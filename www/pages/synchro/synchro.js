// Pour obtenir une présentation du modèle Contrôle de page, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("./pages/synchro/synchro.html", {

        // Cette fonction est appelée chaque fois qu'un utilisateur accède à cette page. Elle
        // remplit les éléments de la page avec les données d'application.
        ready: function (element, options) {
            // Libelle de synchro
            var libelle = WinJS.Utilities.query('#libelle', element).get(0);
            libelle.hidden = true;
            // Bouton synchro
            var btnSynchro = WinJS.Utilities.query('#synchro', element);
            // Click sur bouton synchro
            btnSynchro.listen('click', function (evt) {
                // Libelle visible 
                libelle.hidden = false;
                // Bouton grisé
                WinJS.Utilities.query('#synchro', element).disabled = true;
                // Tentative connexion BDD table historique_synchro
                var range = IDBKeyRange.only(Elipce.User.societe_id);
                Read(Elipce.Bdd.nom, ['historique_synchro'], 'historique_synchro', 'societe_id', range).then(function (aHisto) {
                    // Variables
                    var url;
                    var progressBar = WinJS.Utilities.query("#pb").get(0);
                    // Delta depuis la dernière version
                    if (Array.isArray(aHisto) && aHisto.length>0) {
                        // Dernière ligne d'historique
                        var last = aHisto.pop();
                        url = Elipce.Ws.racine + "synchro/" + Elipce.User.societe_id + "/" + last.version;
                        //Connexion au web service
                        WinJS.xhr({
                            url: url,
                            headers: {
                                "If-Modified-Since": "Mon, 27 Mar 1972 00:00:00 GMT"
                            } }
                        ).done(
                            function completed(result) {
                                // Résultat
                                if (result.status === 200) {
                                    // Réponse
                                    var rep = result.response;
                                    var aSynchro = JSON.parse(rep);
                                    // Des données existent
                                    if (Array.isArray(aSynchro) && aSynchro.length > 0) {
                                        // Variables
                                        var ligne;
                                        var tailleTotale = 0;
                                        var aDocs = [];
                                        // Parcours des données d'init
                                        for (var i in aSynchro) {
                                            ligne = aSynchro[i];
                                            if (ligne['operation'] != undefined) {
                                                switch (ligne['operation'].toLowerCase()) {
                                                    case 'insert':
                                                        // Add BDD
                                                        InsertData(Elipce.Bdd.nom, ligne['affected_table'], [ligne['data']], function (er) {
                                                            console.log("erreur d'insertion delta " + ligne['affected_table'] + " " + ligne['affected_id']);
                                                        });
                                                        break;
                                                    case 'delete':
                                                        // Sauvegarde des data afin d'avoir le chemin_fichier
                                                        var rangePerso = IDBKeyRange.only(ligne['affected_id']);
                                                        Read(Elipce.Bdd.nom, [ligne['affected_table']], ligne['affected_table'], null, rangePerso).then(function (aLigne) {
                                                            this.data = aLigne[0];

                                                            // DELETE BDD
                                                            DeleteData(Elipce.Bdd.nom, this.affected_id, this.affected_table, function (er) {
                                                                console.log("erreur de suppression delta " + this.affected_table + " " + this.affected_id);
                                                            });
                                                            // Ajout taille
                                                            tailleTotale += parseInt(this.data);
                                                            aDocs.push(this);
                                                        }.bind(ligne));
                                                        break;
                                                    case 'update':
                                                        // UPDATE BDD
                                                        UpdateData(Elipce.Bdd.nom, ligne['affected_table'], [ligne['data']], function (er) {
                                                            console.log("erreur de modification delta " + ligne['affected_table'] + " " + ligne['affected_id']);
                                                        });
                                                        break;
                                                    default: break;
                                                }

                                                // Calcul taille document à télécharger
                                                if (ligne['affected_table'].toLowerCase() == 'document' && ligne['operation'].toLowerCase() != 'delete') {
                                                    tailleTotale += parseInt(ligne['data']);
                                                    aDocs.push(ligne);
                                                }
                                            }
                                           
                                        }// fin FOR insertions

                                        // Documents à télécharger
                                        if (aDocs.length > 0) {
                                            // Affectation taille totale à la barre de progression
                                            progressBar.max = tailleTotale;
                                            // Téléchargement des fichiers
                                            var urlFic;
                                            var fichier;
                                            var tailleCourante = 0;
                                            // Parcours des documents à télécharger
                                            for (var i in aDocs) {
                                                //console.log(urlFic + " " + fichier);
                                                // Url du doc à télécharger
                                                urlFic = Elipce.Document.bibliodoc + aDocs[i]['data']['chemin_fichier'];
                                                fichier = urlFic.split(/(\\|\/)/g).pop();

                                                switch (aDocs[i]['operation'].toLowerCase()) {
                                                    case 'insert': case 'update':
                                                        // Téléchargement asynchrone
                                                        DownloadFile(urlFic, fichier).then(function (file) {
                                                            // Taille téléchargée incrémentée
                                                            tailleCourante += parseInt(file.progress.bytesReceived);
                                                            // Maj progress bar
                                                            progressBar.value = tailleCourante;
                                                            // Maj libellé pourcentage
                                                            WinJS.Utilities.query('#percent').get(0).innerText = Math.round(progressBar.position * 100) + '%';
                                                        }, function (file) {
                                                            // erreur
                                                            console.log('erreur téléchargement fichier %o', file);
                                                        });
                                                        break;
                                                    case 'delete':
                                                        DeleteFile(fichier).done(function () { }, function (err) { console.log('erreur suppression fichier %o', err) });
                                                        break;
                                                    default: break;
                                                }
                                                

                                            }
                                        }
                                            // Pas de modifs depuis la dernière version
                                        else {
                                            // Barre à 100%
                                            progressBar.max = 1;
                                            progressBar.value = 1;
                                            // Maj libellé pourcentage
                                            WinJS.Utilities.query('#percent').get(0).innerText = Math.round(progressBar.position * 100) + '%';
                                        }
                                    // Dernière ligne d'histo_synchro sur appli web
                                        var urlLast = Elipce.Ws.racine + "last_synchro/" + Elipce.User.societe_id;
                                        //Connexion au web service
                                        WinJS.xhr({
                                            url: urlLast,
                                            headers: {
                                                "If-Modified-Since": "Mon, 27 Mar 1972 00:00:00 GMT"
                                            }
                                        }).done(
                                            function completed(result) {
                                                // Résultat
                                                if (result.status === 200) {
                                                    // Réponse
                                                    var rep = result.response;
                                                    var lastSynchron = JSON.parse(rep);
                                                    // Insertion en local
                                                    InsertData(Elipce.Bdd.nom, 'historique_synchro', [lastSynchron], function (er) {
                                                        console.log("erreur d'insertion last synchro " + lastSynchron);
                                                    });
                                                }
                                            });
                                    }
                                    else{
                                        AlertMssg("Le catalogue est à jour",null,"Synchronisation","Fermer");
                                    }

                                }

                            },
                            function error(request) {
                                // handle error conditions.
                                console.log('Erreur WS synchro %o', request);
                                // Message
                                alertMssg("Lors de la synchronisation, veuillez être connecté à internet via Wifi (conseillé), 3G ou 4G.",null,"Erreur connexion","Fermer");
                            });//Fin ws synchro

                            }

                    // Init des marques, dossiers, documents
                    else {
                        url = Elipce.Ws.racine + "synchro_init/" + Elipce.User.societe_id; //Connexion au web service
                        console.log(url);
                        WinJS.xhr({ url: url }).done(
                            function completed(result) {
                                // Résultat
                                if (result.status === 200) {
                                    // Réponse
                                    var rep = result.response;
                                    var aInit = JSON.parse(rep);
                                    // Parcours des données d'init
                                    for (var i in aInit) {
                                        if (Array.isArray(aInit[i])) {
                                            InsertData(Elipce.Bdd.nom, i, aInit[i], function (er) {
                                                console.log("erreur d'insertion " + i);
                                            });
                                            if (i == 'document') {
                                                var tailleTotale = 0;
                                                // Récupère la taille totale à télécharger
                                                for (var k in aInit[i]) {
                                                    tailleTotale += parseInt(aInit[i][k]['taille_fichier']);
                                                }
                                                // Affectation taille totale à la barre de progression
                                                progressBar.max = tailleTotale;
                                                // Téléchargement des fichiers
                                                var urlFic;
                                                var fichier;
                                                var tailleCourante = 0;
                                                // Parcours des documents à télécharger
                                                for (var l in aInit[i]) {
                                                    // Url du doc à télécharger
                                                    urlFic = Elipce.Document.bibliodoc + aInit[i][l]['chemin_fichier'];
                                                    console.log("TEST");
                                                    fichier = urlFic.split(/(\\|\/)/g).pop();
                                                    //console.log(urlFic + " " + fichier);
                                                    // Téléchargement asynchrone
                                                    DownloadFile(urlFic, fichier).then(function (file) {
                                                        // Taille téléchargée incrémentée
                                                        tailleCourante += parseInt(file.progress.bytesReceived);
                                                        // Maj progress bar
                                                        progressBar.value = tailleCourante;
                                                        // Maj libellé pourcentage
                                                        WinJS.Utilities.query('#percent').get(0).innerText = Math.round(progressBar.position * 100)+ '%';
                                                    }, function (file) {
                                                        // erreur
                                                        console.log('erreur téléchargement fichier %o', file);
                                                    });

                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            function error(result) {
                                // handle error conditions.
                                console.log('Erreur WS synchro_init %o', result);
                                // Message
                                alertMssg("Lors de la synchronisation, veuillez être connecté à internet via Wifi (conseillé), 3G ou 4G.",null,"Erreur connexion","Fermer");
                            });
                    }
               
                });

            });// fin click synchro

                //DownloadFile('http://www.sonel.org/IMG/pdf/Cariolet_etal_2010.pdf', 'titi.pdf').then(function(){
                //    console.log("FINISH")
                //});
            //DownloadFile('http://www.clg-estaque.ac-aix-marseille.fr/spip/IMG/rubon32.gif', 'eps.gif');
        },

        unload: function () {
            // TODO: répondre aux navigations en dehors de cette page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: répondez aux modifications de la disposition.
        }
    });
})();

