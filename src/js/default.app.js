(function () {
    "use strict";

    var idb = require("./metier/bdd/idb");
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;


    console.log(""+navigator.userAgent);
    if(navigator.userAgent.match(/iPad|iPhone|IEMobile|Android/)){
        document.addEventListener("deviceready", onReady, false);
    }
    else{
        onReady();
    }

    function onReady() {
        // Handle the deviceready event.
        initialize();
    }

    function initialize() {

        nav.history = app.sessionState.history || {};
        nav.history.current.initialPlaceholder = true;

        // Optimize the load of the application and while the splash screen is shown, execute high priority scheduled work.
        ui.disableAnimations();
        var p = ui.processAll().then(function () {
            return nav.navigate(nav.location || Application.navigator.home, nav.state);
        }).then(function () {
            return sched.requestDrain(sched.Priority.aboveNormal + 1);
        }).then(function () {
            ui.enableAnimations();
        });

        // ui.processAll();
    }

})();


WinJS.Navigation.addEventListener('navigated', function (args) {

    catalogue.initPage();
});

WinJS.Namespace.define("Elipce.Bdd", {
    nom: 'bibliodoc-mobile',
    dev: true // TODO mettre à false en production
});

// Mode dev on simule le user connecté
if (Elipce.Bdd.dev) {
    //WinJS.Namespace.define("Elipce.User", { "nom": "ELIPCE", "prenom": "Informatique", "date_naissance": "2014-07-23", "mail": "yann.plantevin@elipce.com", "login": "elipce", "pwd": "7e54dad3d4b787512e80e6058a01ccecfef6b188", "first_conn": "0", "societe_id": 1 });
}

WinJS.Namespace.define("Elipce.Ws", {
    racine: (Elipce.Bdd.dev ? "http://192.168.1.16/bibliodoc-web/ws/index.php/" : "http://85.14.137.12/elipce/bibliodoc-web/ws/index.php/")
});

WinJS.Namespace.define("Elipce.Document", {

    bibliodoc: (Elipce.Bdd.dev ? "http://192.168.1.16/projects/bibliodoc-web/application/" : "http://85.14.137.12/elipce/bibliodoc-web/application/")
});
function InsertDataTest() {
    idb.InsertData(Elipce.Bdd.nom, 'utilisateur', [{ "nom": "ELIPCE", "prenom": "Informatique", "date_naissance": "2014-07-23", "mail": "yann.plantevin@elipce.com", "login": "elipce", "pwd": "7e54dad3d4b787512e80e6058a01ccecfef6b188", "first_conn": "0", "societe_id": 1 },
        { "nom": "PEREZ", "prenom": "Vivian", "date_naissance": "1985-02-26", "mail": "vivian.perez@elipce.com", "login": "viv", "pwd": "", "societe_id": 1, "item1": "a", "item2": "b" }]);

    idb.InsertData(Elipce.Bdd.nom, 'societe', [{ "id": 1, "libelle": "EPS", "adresse": "", "adresse2": "", "code_postal": "", "ville": "", "tel": "" }, { "id": 2, "libelle": "APR", "adresse": "", "adresse2": "", "code_postal": "", "ville": "", "tel": "" }]);
    idb.InsertData(Elipce.Bdd.nom, 'marque_societe', [{ "id": 2, "marque_id": 2, "societe_id": 1 },
        { "id": 1, "marque_id": 1, "societe_id": 2 },
        { "marque_id": 3, "societe_id": 1 },
        { "marque_id": 4, "societe_id": 1 },
        { "marque_id": 5, "societe_id": 1 },
        { "marque_id": 6, "societe_id": 1 }]);
    idb.InsertData(Elipce.Bdd.nom, 'marque', [{ "id": 1, "nom": "Promotions APR", "dossier_id": 1, "is_promo": 1 },
        { "id": 2, "nom": "Promotions EPS", "dossier_id": 2, "is_promo": 1 },
        { "id": 3, "nom": "Armani", "dossier_id": 3, "is_promo": false },
        { "id": 4, "nom": "Babar", "dossier_id": null, "is_promo": false },
        { "id": 5, "nom": "Birkenstock", "dossier_id": null, "is_promo": false },
        { "id": 6, "nom": "Beebop", "dossier_id": null, "is_promo": false },
    ]);
    idb.InsertData(Elipce.Bdd.nom, 'dossier', [{ "id": 1, "nom": "Promotions APR", "dossier_id": null },
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
    idb.InsertData(Elipce.Bdd.nom, 'document', [{ "id": 1, "nom": "Armani code", "dossier_id": 4, 'chemin_fichier': '1.pdf' },
        { "id": 2, "nom": "Aqua di gio", "dossier_id": 4, 'chemin_fichier': '2.docx' },
        { "id": 3, "nom": "Emporio Armani droit", "dossier_id": 5, 'chemin_fichier': '3.gif' },
        { "id": 4, "nom": "Emporio Armani cintré", "dossier_id": 5, 'chemin_fichier': '4.pdf' },
        { "id": 5, "nom": "Doc1", "dossier_id": 3, 'chemin_fichier': '5.pdf' },
        { "id": 6, "nom": "promo1", "dossier_id": 2, 'chemin_fichier': '5.pdf' }
    ]);

}