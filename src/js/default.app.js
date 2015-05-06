var $ = require('jquery');

(function() {


    $(function() {
        console.log("" + navigator.userAgent);

        if (navigator.userAgent.match(/iPhone|Android|IEMobile/)) {
            document.addEventListener("deviceready", onReady, false);
        }
        else {
            onReady();
        }

        function onReady() {
            // Handle the deviceready event.
            initialize();
        }

        function initialize() {
            var parentElement = document.getElementById("deviceready");
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        }
    });
})();