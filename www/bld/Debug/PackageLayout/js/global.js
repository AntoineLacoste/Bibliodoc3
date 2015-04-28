function initApplication() {
	/// <summary>
	/// Initilise les événements génériques ex: animations, logo qui pointe sur accueil
	/// </summary>

        /**** GLOBAL A TOUTES LES APPLICATIONS ****/
        // Animation click à toutes les balises ayant la classe .animateClick
        animateClick('.animateClick');
        // Navigation page unique avec contenu qui change
        WinJS.Utilities.query('a').listen('click',
            function (eventInfo) {
                /// <summary>
                /// Redefinition d'une navigation depuis un lien => navigate
                /// </summary>
                /// <param name="eventInfo">Evenement</param>

                // Annule le comportement par défaut
                eventInfo.preventDefault();
                // Navigation interne
                //var link = eventInfo.target;
                //WinJS.Navigation.navigate(link.href);
            }, false);

        // Callback après hide navbar
        var aNav = WinJS.Utilities.query('#navbar');
        if (aNav.length > 0) {
            aNav.get(0).addEventListener("afterhide", function (evtInfo) {
                console.log('afterhide navbar');
            });
        }

        // Parcours des éléments de la navbar
        WinJS.Utilities.query('[data-win-control="WinJS.UI.NavBar"]').forEach(function (value, index, array) {
            value.addEventListener('click', function (evt) {
                console.log('clic navbarcommand');
                // On cache la navbar
                WinJS.Utilities.query('#appbar').get(0).winControl.hide();
            });
        });
        


        /**** FIN GLOBAL A TOUTES LES APPLICATIONS ****/



        /**** GLOBAL A CETTE APPLICATION *******/
        // Logo EPS
        WinJS.Utilities.query('#logo').listen('click', function (evt) {
            WinJS.Navigation.navigate('/pages/accueil/accueil.html');
        });
        // Promo
        WinJS.Utilities.query('#promo').listen('click', function (evt) {
            GetPromotionFromSociete().then(function(oMarque){
                console.log('marque %o ', oMarque);
                // Tous les dossiers de la promo
                GetAllFromDossier(oMarque.dossier_id).then(function (aDoss) {
                    if (aDoss.length > 0) {
                        // Affichage des elements
                        WinJS.Navigation.navigate('/pages/document/document.html', { docs: aDoss, breadcrumb: [{item: "Promotions"}] });
                    }
                });
            });
        });
        // Précédent dans la barre de navigation
        WinJS.Utilities.query('#back-navbar').listen('click', function (evt) {
            WinJS.Navigation.back().done(function () {
                if (WinJS.Navigation.state != undefined && WinJS.Navigation.state.breadcrumb != undefined) {
                    // On enlève le dernier element du fil d'arianne
                    var aTab = WinJS.Navigation.state.breadcrumb;
                    aTab.pop();
                    // UL
                    var renderElement = WinJS.Utilities.query('.breadcrumb').get(0);
                    // LI
                    var templateElement = WinJS.Utilities.query('#breadcrumbTemplate').get(0);
                    // Construction fil d'ariane
                    BreadcrumbBuilder(aTab, renderElement, templateElement);
                }
            });
        });

        /**** GLOBAL A CETTE APPLICATION *******/
}

function CreateIdbBibliodoc() {
    /// <summary>
    /// Création de la structure de la BDD bibliodoc-mobile
    /// </summary>

    // Structure BDD
    var aStruct = {
        'utilisateur': [['nom', false], ['prenom', false], ['date_naissance', false], ['mail', false], ['login', false],  ['societe_id', false]],
        'societe': [['libelle', false]],
        'marque_societe': [['marque_id', false], ['societe_id', false]],
        'marque': [['nom', false], ['dossier_id', false], ['is_promo', false]],
        'dossier': [['nom', false], ['dossier_id', false]],
        'document': [['nom', false], ['description', false], ['dossier_id', false]],
        'historique_synchro': [['version', true], ['table', false], ['operation', false], ['affected_id', false], ['societe_id', false]]
    }
    // Création BDD si elle n'existe pas.
    CreateDatabase(Elipce.Bdd.nom, aStruct);

}

function RechercherMarques(lettre) {
	/// <summary>
	/// Recherche les marques en fonction du paramètre 'marque' et navigue vers la page 'marque.html'
	/// </summary>
    /// <param name="marque">valeur recherchée</param>
    

    // Variables
    var aData = [];
    // Connexion BDD
    var req = window.indexedDB.open(Elipce.Bdd.nom);
    // Overture BDD ok
    req.onsuccess = function (e) {
        // Handler de connexion
        var db = e.target.result;
        // BDD vide (pas de structure)
        if (db.objectStoreNames.length === 0) {
            // Fermeture connexion
            db.close();
            // Log
            console.log('Erreur connexion BDD '+Elipce.Bdd.nom);
        }
            // BDD a au moins une table
        else {
            try {
                // On initialise la transaction avec les droits de lecture
                var transaction = db.transaction(['marque_societe','marque'], "readonly");
                // Requete
                var store = transaction.objectStore('marque_societe');
                try {
                    var cursorRequest;
                    // Index
                    var range = IDBKeyRange.bound(Elipce.User.societe_id,Elipce.User.societe_id,false,false);
                    cursorRequest = store.index('societe_id_Index').openCursor(range);
                    // Résultats de la requete
                    cursorRequest.onsuccess = function (e) {
                        // On récupère la valeur lue par le curseur dans la variable reader
                        var reader = e.target.result;
                        if (reader) {
                            // Détail de la marque
                            try {
                                var cursorMarque;
                                var storeMarque = transaction.objectStore('marque');
                                // Index

                                cursorMarque = storeMarque.get(reader.value.marque_id);
                                // Résultats de la requete
                                cursorMarque.onsuccess = function (evt) {
                                    // On récupère la valeur lue par le curseur dans la variable reader
                                    var readerMarque = evt.target.result;
                                    if (readerMarque) {
                                        // Pas les promos
                                        if (readerMarque.is_promo == '0') {
                                            // Filtre par rapport à la lettre
                                            if (readerMarque.nom.toLowerCase().indexOf(lettre.toLowerCase()) == 0) {
                                                // Majuscule
                                                readerMarque.nom = readerMarque.nom.toUpperCase();
                                                // Détail du magasin
                                                aData.push(readerMarque);
                                            }
                                        }
                                    }
                                }
                            }
                            catch (ex) {
                                HandleException(ex, "Erreur ID marque");
                            }
                            // Marque_societe suivante
                            reader.continue();
                        }
                    }
                }
                catch (ex) {
                    HandleException(ex, "Erreur index marque_societe");
                }
                // Transaction marque_societe_terminée
                transaction.oncomplete = function (e) {
                    if (aData.length > 0) {
                        //console.log('tableau final %o', aData);
                        WinJS.Navigation.navigate('/pages/marque/marque.html', { marques: aData, breadcrumb: [{ item: 'MARQUES' },{ item: lettre.toUpperCase() }] });
                    }
                    else {
                        // Message
                        var msg = new Windows.UI.Popups.MessageDialog("Aucune marque déclarée pour "+lettre);
                        // Show the message dialog
                        msg.showAsync();
                    }
                }
            }
            catch (ex) {
                HandleException(ex, "Erreur table marque_societe");
            }
        }
    }
}


function GetAllFromDossier(idDos) {
    /// <summary>
    /// Retourne tous les documents et le dossiers du dossier passé en param
    /// </summary>
    /// <param name="idDos">ID dossier</param>

    return new WinJS.Promise(function (ok, ko) {
        // Variables
        this.aRetour = [];
        var that = this;
        // ID dossier erroné
        if (isNaN(parseInt(idDos))) {
            ko(aRetour);
        }
        // Lecture Dossiers
        var range = IDBKeyRange.only(idDos);
        Read(Elipce.Bdd.nom, ['dossier'], 'dossier', 'dossier_id', range).then(function (aDoss) {

            if (aDoss.length > 0) {
                // Parcours des dossiers
                for (var i in aDoss) {
                    // Majuscule
                    aDoss[i]['nom'] = aDoss[i]['nom'].toUpperCase();
                    // Ajout classe dossier
                    aDoss[i]['classe'] = 'dossier';
                }
                that.aRetour = aDoss;
            }

            // Lecture Documents
            return Read(Elipce.Bdd.nom, ['document'], 'document', 'dossier_id', range);

        }).then(function (aDocs) {

            if (aDocs.length > 0) {
                // Parcours des documents
                for (var i in aDocs) {
                    // Majuscule
                    aDocs[i]['nom'] = aDocs[i]['nom'].toUpperCase();
                    // Ajout classe doc
                    aDocs[i]['classe'] = 'doc';
                }
                // Concaténation des dossiers et documents
                that.aRetour = that.aRetour.concat(aDocs);
            }
            ok(that.aRetour);
        }).done();
    });

}

function GetPromotionFromSociete() {
    /// <summary>
    /// Retourne la marque correspondant à la promotion de la socitété du user connecté
    /// </summary>

    return new WinJS.Promise(function (ok, ko) {
        // Variables
        var aData = [];
        // Connexion BDD
        var req = window.indexedDB.open(Elipce.Bdd.nom);
        // Overture BDD ok
        req.onsuccess = function (e) {
            // Handler de connexion
            var db = e.target.result;
            // BDD vide (pas de structure)
            if (db.objectStoreNames.length === 0) {
                // Fermeture connexion
                db.close();
                // Log
                console.log('Erreur connexion BDD ' + Elipce.Bdd.nom);
            }
                // BDD a au moins une table
            else {
                try {
                    // On initialise la transaction avec les droits de lecture
                    var transaction = db.transaction(['marque_societe', 'marque'], "readonly");
                    // Requete
                    var store = transaction.objectStore('marque_societe');
                    try {
                        var cursorRequest;
                        // Index
                        var range = IDBKeyRange.only(Elipce.User.societe_id);
                        cursorRequest = store.index('societe_id_Index').openCursor(range);
                        // Résultats de la requete
                        cursorRequest.onsuccess = function (e) {
                            // On récupère la valeur lue par le curseur dans la variable reader
                            var reader = e.target.result;
                            if (reader) {
                                // Détail de la marque
                                try {
                                    var cursorMarque;
                                    var storeMarque = transaction.objectStore('marque');
                                    // Index

                                    cursorMarque = storeMarque.get(reader.value.marque_id);
                                    // Résultats de la requete
                                    cursorMarque.onsuccess = function (evt) {
                                        // On récupère la valeur lue par le curseur dans la variable reader
                                        var readerMarque = evt.target.result;
                                        if (readerMarque) {
                                            // Les promos
                                            if (readerMarque.is_promo == 1) {
                                                // Détail du magasin
                                                ok(readerMarque);
                                            }
                                        }
                                    }
                                }
                                catch (ex) {
                                    HandleException(ex, "Erreur ID marque");
                                }
                                // Marque_societe suivante
                                reader.continue();
                            }
                        }
                    }
                    catch (ex) {
                        HandleException(ex, "Erreur index marque_societe");
                    }
                }
                catch (ex) {
                    HandleException(ex, "Erreur table marque_societe");
                }
            }
        }
    });


}

function BreadcrumbBuilder(aData, renderElement, templateElement) {
	/// <summary>
	/// Construit un fil d'ariane
	/// </summary>
    /// <param name="aData">données au format: [{item: toto},{item: titi}, ...]</param>
	/// <param name="renderElement">Element HTML dans lequel le fil d'ariane va être mis</param>
    /// <param name="templateElement">Le template LI</param>

    // Vidage
    renderElement.innerHTML = '';
    // Le fil a des items
    if (aData.length > 0) {
        var clItem = WinJS.Binding.define({ item: "" });
        // UL
        var templateControl = templateElement.winControl;
        var temp;
        // Parcours des items
        for (var i in aData) {
            temp = new clItem(aData[i]);
            // Génération du LI
            templateControl.render(temp, renderElement).done(function (result) {
                // Ajout du LI à UL
                //renderElement.appendChild(result);
            });
        }

    }
    //else {
    //    renderElement.innerHTML = '';
    //}
}


