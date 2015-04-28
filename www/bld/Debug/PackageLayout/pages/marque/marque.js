// Pour obtenir une présentation du modèle Contrôle de page, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var marques;
    var docs;
    var aBreadcrumb;

   

    WinJS.UI.Pages.define("/pages/marque/marque.html", {


        init: function (element, options) {

            // Les marques selon la recherche
            marques = (options != undefined ? options.marques : []);

            // Liaison des données au template
            WinJS.Namespace.define("Elipce.Marques", {
                data: new WinJS.Binding.List(marques)
            });

            
        },

        // Cette fonction est appelée chaque fois qu'un utilisateur accède à cette page. Elle
        // remplit les éléments de la page avec les données d'application.
        ready: function (element, options) {
            var that = this;
            // A ce moment là, les elements générés par le template n'existenet pas encore. De ce fait, 
            // l'évènement click est défini sur le conteneur
            WinJS.Utilities.query('.marque', element).listen('click', function (e) {
                // Element courant
                var elt = e.target;
                // On est sur le span
                if (elt.tagName.toLowerCase() == 'span') {
                    // Element parent (DIV)
                    elt = elt.parentNode;
                }
                // Si on est sur une tuile
                if (elt.hasAttribute('data-dossier')) {
                    // Dossier de la marque cliqueé par le user
                    var dossierCourant = elt.getAttribute('data-dossier');
                    // Maj des données fil d'ariane
                    that.aBreadcrumb = [{ item: 'MARQUES' }, { item: elt.getAttribute('data-nom').toUpperCase() }];
                    // Dossiers + documents de la marque
                    GetAllFromDossier(dossierCourant).then(function (aAll) {
                        docs = aAll;
                    }).done(function () {
                        // Affichage des elements
                        WinJS.Navigation.navigate('/pages/document/document.html', { docs: docs, breadcrumb: that.aBreadcrumb });
                    });
                }
            });

            // Données Fil d'ariane
            this.aBreadcrumb = (options != undefined && options.breadcrumb != undefined ? options.breadcrumb : []);
            // UL
            var renderElement = WinJS.Utilities.query('.breadcrumb', element).get(0);
            // LI
            var templateElement = WinJS.Utilities.query('#breadcrumbTemplate', element).get(0);
            // Construction fil d'ariane
            BreadcrumbBuilder(this.aBreadcrumb, renderElement, templateElement);
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
