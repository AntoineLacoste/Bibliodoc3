// Pour obtenir une présentation du modèle Contrôle de page, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var elts;

    

    WinJS.UI.Pages.define("/pages/document/document.html", {
        
        init: function (element, options) {

            // Les données docs + dossiers
            elts = (options != undefined ? options.docs : []);
            //elts = WinJS.Navigation.state.docs;
            // Liste
            var docListe = new WinJS.Binding.List(elts);
            // Liaison des données au template
            WinJS.Namespace.define("Elipce.Docs", {
                data: docListe
            });
           
        },

        // Cette fonction est appelée chaque fois qu'un utilisateur accède à cette page. Elle
        // remplit les éléments de la page avec les données d'application.
        ready: function (element, options) {
            var that = this;

            // A ce moment là, les elements générés par le template n'existenet pas encore. De ce fait, 
            // l'évènement click est défini sur le conteneur
            WinJS.Utilities.query('.document', element).listen('click', function (e) {
                // Element courant
                var elt = e.target;
                // On est sur le span
                if (elt.tagName.toLowerCase() == 'span') {
                    // Element parent (DIV)
                    elt = elt.parentNode;
                }
                // Si on est sur une tuile
                if (elt.hasAttribute('data-dossier')) {
                    // Dossier
                    if (WinJS.Utilities.hasClass(elt, 'dossier')) {
                        var dossierCourant = elt.getAttribute('data-id');
                        // Dossiers + documents du dossier cliqué
                        GetAllFromDossier(dossierCourant).then(function (aDoss) {
                            if (aDoss.length > 0) {
                                // Maj des données fil d'ariane
                                that.aBreadcrumb.push({ item: elt.getAttribute('data-nom').toUpperCase() });
                                // Affichage des elements
                                WinJS.Navigation.navigate('/pages/document/document.html', { docs: aDoss, breadcrumb: that.aBreadcrumb });
                            }
                        });
                    }
                    // Document
                    if (WinJS.Utilities.hasClass(elt, 'doc')) {
                        // Fichier associé
                        var fichier = elt.getAttribute('data-chemin');
                        fichier = fichier.split(/(\\|\/)/g).pop();
                        OpenFile(fichier);
                    }
                }
            });

            // Données Fil d'ariane
            this.aBreadcrumb = (options != undefined && options.breadcrumb!=undefined ? options.breadcrumb : []);
            // UL
            var renderElement = WinJS.Utilities.query('.breadcrumb', element).get(0);
            // LI
            var templateElement = WinJS.Utilities.query('#breadcrumbTemplate', element).get(0);
            // Construction fil d'ariane
            BreadcrumbBuilder(this.aBreadcrumb, renderElement, templateElement);
        },

        error: function(err){
            console.log("erreur %o", err);
        },

        unload: function () {
            // TODO: répondre aux navigations en dehors de cette page.
            console.log('unload');
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />
            // TODO: répondez aux modifications de la disposition.
            console.log('update');
        }
    });


    //WinJS.Binding.processAll(document.querySelector(".docdoss"), Elipce.Docs.data.dataSource).done(function () {
    //    // processAll is async. You can hook up a then or done handler
    //    // if you need to wait for the binding to finish
    //    var toto = WinJS.Utilities.query('.docdoss', element);
    //    console.log('UUUUU ' + toto.length);
    //});

    //// Ecoute de l'événement navigated
    //WinJS.Navigation.addEventListener('navigated', function (args) {
    //    console.log('NAVIGATED :'+WinJS.Utilities.query('.dossier').length);
    //});

    //WinJS.UI.processAll().then(function () {
    //    console.log('PROCESS ALL '+WinJS.Utilities.query('.dossier').length);
    //});
})();
