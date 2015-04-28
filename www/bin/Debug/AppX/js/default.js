// Pour obtenir une présentation du modèle Navigation, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    var activation = Windows.ApplicationModel.Activation;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {

            // TODO suppr
            //DeleteDatabase(Elipce.Bdd.nom);

            if (Elipce.Bdd.dev) {
                //// Suppression BDD
                //DeleteDatabase(Elipce.Bdd.nom);
                //// Création structure BDD
                //CreateIdbBibliodoc();
                //// Insertion jeu de test
                //InsertDataTest();// Mode dev on simule le user connecté
            }


            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: cette application vient d'être lancée. Initialisez
                // votre application ici.
            } else {
                // TODO: cette application a été réactivée après avoir été suspendue.
                // Restaurez l'état de l'application ici.
            }

            nav.history = app.sessionState.history || {};
            nav.history.current.initialPlaceholder = true;

            // Optimisez la charge de l'application et lorsque l'écran de démarrage s'affiche, exécutez le travail planifié de haute priorité.
            ui.disableAnimations();
            var p = ui.processAll().then(function () {
                var page = nav.location || Application.navigator.home;
                // TODO
                if (Elipce.Bdd.dev) {
                    //page = '/pages/accueil/accueil.html';
                }
                return nav.navigate(page, nav.state);
            }).then(function () {
                return sched.requestDrain(sched.Priority.aboveNormal + 1);
            }).then(function () {
                ui.enableAnimations();
            });

            args.setPromise(p);
        }

        // Initialisation de la charm bar 
        initializeSettingsPane();

        // App Bar
        WinJS.Utilities.query('#search').listen('keypress', function (e) {
            // Enter
            if (e.keyCode == 13) {
                // Recherche des marques par rapport à la saisie
                RechercherMarques(e.target.value);
            }
        });
        
    });

    app.oncheckpoint = function (args) {
        // TODO: cette application est sur le point d'être suspendue. Enregistrez tout état
        // devant être conservé lors des suspensions ici. Si vous devez 
        // effectuer une opération asynchrone avant la suspension de 
        // l'application, appelez args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();

    // Ecoute de l'événement navigated
    WinJS.Navigation.addEventListener('navigated', function (args) {
        // args.detail contient les détails de la navigation qui vient d'avoir lieu
        initApplication();
    });

})();


function initializeSettingsPane() {
	/// <summary>
	/// Initialize la charm bar en ajoutant le bouton déconnexion 
    /// </summary>

    // Charm bar
    var settingsPane = Windows.UI.ApplicationSettings.SettingsPane.getForCurrentView();
    settingsPane.addEventListener("commandsrequested", function (eventArgs) {
        // Bouton Déconnexion de la charm bar
        var settingsCommand = new Windows.UI.ApplicationSettings.SettingsCommand("deco", "Déconnexion",
               function () {
                   // Navigation page de connexion
                   WinJS.Navigation.navigate('/pages/home/home.html', false);
               });
        // Ajout du bouton à la charmbar
        eventArgs.request.applicationCommands.append(settingsCommand);
    });

}


WinJS.Namespace.define("Elipce.Bdd", {
    nom: 'bibliodoc-mobile',
    dev: true // TODO mettre à false en production
});

// Mode dev on simule le user connecté
if (Elipce.Bdd.dev) {
    //WinJS.Namespace.define("Elipce.User", { "nom": "ELIPCE", "prenom": "Informatique", "date_naissance": "2014-07-23", "mail": "yann.plantevin@elipce.com", "login": "elipce", "pwd": "7e54dad3d4b787512e80e6058a01ccecfef6b188", "first_conn": "0", "societe_id": 1 });
}

WinJS.Namespace.define("Elipce.Ws", {
    racine: (Elipce.Bdd.dev ? "http://192.168.1.22/bibliodoc-web/ws/index.php/" : "http://85.14.137.12/elipce/bibliodoc-web/ws/index.php/")
});

WinJS.Namespace.define("Elipce.Document", {

    bibliodoc: (Elipce.Bdd.dev ? "http://192.168.1.22/projects/bibliodoc-web/application/" : "http://85.14.137.12/elipce/bibliodoc-web/application/")
});

function InsertDataTest() {
    InsertData(Elipce.Bdd.nom, 'utilisateur', [{ "nom": "ELIPCE", "prenom": "Informatique", "date_naissance": "2014-07-23", "mail": "yann.plantevin@elipce.com", "login": "elipce", "pwd": "7e54dad3d4b787512e80e6058a01ccecfef6b188", "first_conn": "0", "societe_id": 1 },
                                                { "nom": "PEREZ", "prenom": "Vivian", "date_naissance": "1985-02-26", "mail": "vivian.perez@elipce.com", "login": "viv", "pwd": "", "societe_id": 1, "item1": "a", "item2": "b" }]);

    InsertData(Elipce.Bdd.nom, 'societe', [{ "id": 1, "libelle": "EPS", "adresse": "", "adresse2": "", "code_postal": "", "ville": "", "tel": "" }, { "id": 2, "libelle": "APR", "adresse": "", "adresse2": "", "code_postal": "", "ville": "", "tel": "" }]);
    InsertData(Elipce.Bdd.nom, 'marque_societe', [{ "id": 2, "marque_id": 2, "societe_id": 1 },
                                                    { "id": 1, "marque_id": 1, "societe_id": 2 },
                                                    { "marque_id": 3, "societe_id": 1 },
                                                    { "marque_id": 4, "societe_id": 1 },
                                                    { "marque_id": 5, "societe_id": 1 },
                                                    { "marque_id": 6, "societe_id": 1 }]);
    InsertData(Elipce.Bdd.nom, 'marque', [{ "id": 1, "nom": "Promotions APR", "dossier_id": 1, "is_promo": 1 },
                                            { "id": 2, "nom": "Promotions EPS", "dossier_id": 2, "is_promo": 1 },
                                            { "id": 3, "nom": "Armani", "dossier_id": 3, "is_promo": false },
                                            { "id": 4, "nom": "Babar", "dossier_id": null, "is_promo": false },
                                            { "id": 5, "nom": "Birkenstock", "dossier_id": null, "is_promo": false },
                                            { "id": 6, "nom": "Beebop", "dossier_id": null, "is_promo": false },
    ]);
    InsertData(Elipce.Bdd.nom, 'dossier', [{ "id": 1, "nom": "Promotions APR", "dossier_id": null },
                                            { "id": 2, "nom": "Promotions EPS", "dossier_id": null },
                                            { "id": 3, "nom": "Armani folder", "dossier_id": null },
                                            { "id": 4, "nom": "parfums folder", "dossier_id": 3 },
                                            { "id": 5, "nom": "costumes folder", "dossier_id": 3 },
                                            { "id": 6, "nom": "Babar folder", "dossier_id": 4 },
                                            { "id": 7, "nom": "Birkenstock folder", "dossier_id": 5 },
                                            { "id": 8, "nom": "Beebop folder", "dossier_id": 6 },
                                            { "id": 9, "nom": "test1 folder", "dossier_id": 3 },
                                            { "id": 10, "nom": "test2 folder", "dossier_id": 3 },
                                            { "id": 11, "nom": "test3 folder", "dossier_id": 3 },
                                            { "id": 12, "nom": "test4 folder", "dossier_id": 3 },
                                            { "id": 13, "nom": "test5 folder", "dossier_id": 3 },
                                            { "id": 14, "nom": "test6 folder", "dossier_id": 3 },
                                            { "id": 15, "nom": "test7 folder", "dossier_id": 3 },
                                            { "id": 16, "nom": "test8 folder", "dossier_id": 3 },
                                            { "id": 17, "nom": "test9 folder", "dossier_id": 3 },
    ]);
    InsertData(Elipce.Bdd.nom, 'document', [{ "id": 1, "nom": "Armani code", "dossier_id": 4, 'chemin_fichier': '1.pdf' },
                                          { "id": 2, "nom": "Aqua di gio", "dossier_id": 4, 'chemin_fichier': '2.docx' },
                                          { "id": 3, "nom": "Emporio Armani droit", "dossier_id": 5, 'chemin_fichier': '3.gif' },
                                          { "id": 4, "nom": "Emporio Armani cintré", "dossier_id": 5, 'chemin_fichier': '4.pdf' },
                                            { "id": 5, "nom": "Doc1", "dossier_id": 3, 'chemin_fichier': '5.pdf' },
                                            { "id": 6, "nom": "promo1", "dossier_id": 2, 'chemin_fichier': '5.pdf' }
    ]);

}