//var $ = require('jquery');
(function() {


    document.addEventListener("DOMContentLoaded", function() {
        console.log("" + navigator.userAgent);

        if (navigator.userAgent.match(/iPad|iPhone|Android|IEMobile/)) {
            document.addEventListener("deviceready", initialize, false);
        }
        else {
            initialize();
        }

        function initialize() {
            //catalogue.alertMssg("oucou",null);
            navigator.notification.alert("%o"+catalogue,null);
            var parentElement = document.getElementById("deviceready");
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        }

    });
})();