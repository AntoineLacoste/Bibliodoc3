(function () {
    "use strict";

    var idb = require('./metier/bdd/idb.js');
    var sha1= require('sha1');

    WinJS.UI.Pages.define("./home.html", {
        // Cette fonction est appelée chaque fois qu'un utilisateur accède à cette page. Elle
        // remplit les éléments de la page avec les données d'application.
        ready: function (element, options) {
            // Pas de chargement visible
            Chargement(false);

            // Mode dev on prérempli les champs
            if (Elipce.Bdd.dev) {
                WinJS.Utilities.query('#login', element).get(0).value = 'elipce';
                WinJS.Utilities.query('#pwd', element).get(0).value = 'elipce05';
            }
            // Variables
            var bConnect = false;

            // Bouton connexion
            WinJS.Utilities.query('#connect', element).listen('click', function (evt) {
                // Début chargment
                Chargement(true);
                // Tentative de connexion
                idb.ReadAll(Elipce.Bdd.nom, 'utilisateur', function (aData) {
                    // 1ère connexion (la BDD n'existe pas ou la table n'existe pas)
                    if (aData == '0') {
                        // Création structure BDD
                        catalogue.CreateIdbBibliodoc();
                        // Procédure WS
                        ConnexionWs(element, true);
                    }
                    // Des utilisateurs sont enregistrés
                    else {
                        // Parcours des utilisateurs
                        for(var i in aData){
                            // Login OK
                            if (aData[i]['login'] == WinJS.Utilities.query('#login', element).get(0).value) {
                                // Variables
                                var pwd = WinJS.Utilities.query('#pwd', element).get(0).value;
                                // SHA1
                                var sha1Pwd = sha1(pwd);
                                // Mot de passe OK
                                if (aData[i]['pwd'] == sha1Pwd) {
                                    //console.log(sha1Pwd);
                                    // Sauvegarde user
                                    WinJS.Namespace.define("Elipce.User", aData[i]);
                                    bConnect = true;
                                    break;
                                }
                            }
                        }// fin foreach
                        // Pas de connexion
                        if (!bConnect) {
                            //// Fin chargment
                            //Chargement(false);
                            //// Message
                            //var msg = new Windows.UI.Popups.MessageDialog("Mauvais login et / ou mot de passe");
                            //// Show the message dialog
                            //msg.showAsync();

                            // Connexion BDD via WS
                            ConnexionWs(element, false);
                        }
                        // Connexion OK
                        else {
                            // Navigation
                            WinJS.Navigation.navigate('./accueil.html', false);
                        }
                    }


                });
            });

        },


    });

    function Chargement(bool) {
        /// <summary>
        /// Gère le chargement sur connexion
        /// </summary>
        /// <param name="bool">Booléen: chargement actif ou non</param>
        // Logo chargement et bouton connexion
        var charg = WinJS.Utilities.query('#chargement').get(0);
        var btn = WinJS.Utilities.query('#connect').get(0);

        // En cours de chargement
        if (bool) {
            charg.style.display = '';
            btn.disabled = true;
        }
        // Fin chargement
        else {
            charg.style.display = 'none';
            btn.disabled = false;
        }
    }

    function ConnexionWs(element, bFirstConn) {
        /// <summary>
        /// Connexion au webservice et connexion ou pas.
        /// </summary>
        /// <param name="element"></param>
        // URL WS
        var pwd = sha1(WinJS.Utilities.query('#pwd', element).get(0).value);
        var url = Elipce.Ws.racine + "connexion/" + WinJS.Utilities.query('#login', element).get(0).value + "/" + pwd;
        //Connexion au web service
        WinJS.xhr({ url: url }).done(
            function completed(result) {
                if (result.status === 200) {
                    var rep = result.response;
                    var id = JSON.parse(rep);
                    // Connexion KO
                    if (id === false) {
                        // Fin chargment
                        Chargement(false);
                        // Message
                        alertMssg("Mauvais login et / ou mot de passe",null,"Erreur","Fermer");
                    }
                    // Connexion OK
                    else {
                        // Init du user (et des societes si bFirstConn = true)
                        var url = Elipce.Ws.racine + "init/" + id + "/" + bFirstConn;
                        //Connexion au web service
                        WinJS.xhr({ url: url }).done(
                            function completed(result) {
                                if (result.status === 200) {
                                    console.log("init OK");
                                    // Réponse
                                    var rep = result.response;
                                    var aTab = JSON.parse(rep);

                                    // Parcours des données d'init
                                    for (var i in aTab) {

                                        // Des données à insérer
                                        if (Array.isArray(aTab[i])) {
                                            // Insertion
                                            idb.InsertData(Elipce.Bdd.nom, i, aTab[i], function (er) {0
                                                console.log("erreur d'insertion ws init " + i);
                                            });
                                        }
                                    }

                                    // Sauvegarde user
                                    //console.log('user %o', aTab['utilisateur']);
                                    WinJS.Namespace.define("Elipce.User", aTab['utilisateur'][0]);
                                    // Navigation vers accueil
                                    WinJS.Navigation.navigate('../../pages/accueil/accueil.html');
                                }
                            },
                            function error(result) {
                                // Fin chargment
                                Chargement(false);
                                // Message
                                catalogue.alertMssg("Erreur d'initialisation de l'application, veuillez désinstaller puis réinstaller votre application SVP. Merci.",null,"Erreur","Fermer");
                                // handle error conditions.
                                console.log('error init REST %o', result);
                            }
                        );
                    }

                }
            },
            function error(result) {
                // Fin chargment
                Chargement(false);
                // handle error conditions.
                console.log('error REST %o', result);
                // Message
                catalogue.alertMssg("Lors de la prmière connexion, veuillez être connecté à internet via Wifi (conseillé), 3G ou 4G.",null,"Erreur connexion","Fermer");
            });
    }

})();