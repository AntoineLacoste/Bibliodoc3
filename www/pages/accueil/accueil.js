// Pour obtenir une présentation du modèle Contrôle de page, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("./pages/accueil/accueil.html", {

        // Cette fonction est appelée chaque fois qu'un utilisateur accède à cette page. Elle
        // remplit les éléments de la page avec les données d'application.
        // ATTENTION les modifications du DOM doivent être réalisées sur le paramètre element
        ready: function (element, options) {

            // IDB viewer en mode dev
            console.log("coucou");
            if (Elipce.Bdd.dev) {
                var navContainer = WinJS.Utilities.query('#navbar_container', element).get(0);
                navContainer.innerHTML += '<div data-win-control="WinJS.UI.NavBarCommand" data-win-options="{ icon: WinJS.UI.AppBarIcon.memo, location: \'/pages/idbviewer/idb.html\', label: \'IDB\' }"></div>';
            }

            // Clavier
            // Ligne 1
            var line1 = WinJS.Utilities.query('#line1',element).get(0); 
            line1.innerHTML = '';
            // Parcous des lettres le la ligne 1
            for (var lettre = 'A'.charCodeAt(0) ; lettre < 'K'.charCodeAt(0) ; lettre++) {
                line1.innerHTML += '<p  class="touche animateClick">' + String.fromCharCode(lettre) + '</p>';
            }
            // Ligne 2
            var line2 = WinJS.Utilities.query('#line2', element).get(0);
            line2.innerHTML = '';
            // Parcous des lettres le la ligne 1
            for (lettre = 'K'.charCodeAt(0); lettre < 'U'.charCodeAt(0); lettre++) {
                line2.innerHTML += '<p  class="touche animateClick">' + String.fromCharCode(lettre) + '</p>';
            }
            // Ligne 3
            var line3 = WinJS.Utilities.query('#line3', element).get(0);
            line3.innerHTML = '';
            // Parcous des lettres le la ligne 1
            for (lettre = 'U'.charCodeAt(0); lettre <= 'Z'.charCodeAt(0); lettre++) {
                line3.innerHTML += '<p  class="touche animateClick">' + String.fromCharCode(lettre) + '</p>';
            }

            // Evenement click sur touche
            WinJS.Utilities.query('.touche',element).listen('click', function (e) {
                //console.log(e.target.textContent);
                RechercherMarques(e.target.textContent);
                //var docs = [{ "id": 4, "nom": "parfums", "dossier_id": 3, "type": "dossier" }, { "id": 5, "nom": "costumes", "dossier_id": 3, "type": "dossier" }, { "id": 5, "nom": "Doc1", "dossier_id": 3, "type": "doc" }];
                //WinJS.Navigation.navigate('/pages/dossier/dossier.html', { dossiers: docs });
            });
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
