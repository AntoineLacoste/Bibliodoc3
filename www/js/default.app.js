(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/js/default.app.js":[function(require,module,exports){
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

            navigator.notification.alert("toto",null);
            if(catalogue!== undefined) {
                navigator.notification.alert("catalogue existe",null);
                navigator.notification.alert("" + catalogue.test(), null);
            }
            else{
                navigator.notification.alert("catalogue undefined",null);
            }
            var parentElement = document.getElementById("deviceready");
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        }

    });
})();
},{}]},{},["./src/js/default.app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvZGVmYXVsdC5hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vdmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcclxuKGZ1bmN0aW9uKCkge1xyXG5cclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlwiICsgbmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcblxyXG4gICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkfGlQaG9uZXxBbmRyb2lkfElFTW9iaWxlLykpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZXJlYWR5XCIsIGluaXRpYWxpemUsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGluaXRpYWxpemUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgICAgIC8vY2F0YWxvZ3VlLmFsZXJ0TXNzZyhcIm91Y291XCIsbnVsbCk7XHJcblxyXG4gICAgICAgICAgICBuYXZpZ2F0b3Iubm90aWZpY2F0aW9uLmFsZXJ0KFwidG90b1wiLG51bGwpO1xyXG4gICAgICAgICAgICBpZihjYXRhbG9ndWUhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3Iubm90aWZpY2F0aW9uLmFsZXJ0KFwiY2F0YWxvZ3VlIGV4aXN0ZVwiLG51bGwpO1xyXG4gICAgICAgICAgICAgICAgbmF2aWdhdG9yLm5vdGlmaWNhdGlvbi5hbGVydChcIlwiICsgY2F0YWxvZ3VlLnRlc3QoKSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIG5hdmlnYXRvci5ub3RpZmljYXRpb24uYWxlcnQoXCJjYXRhbG9ndWUgdW5kZWZpbmVkXCIsbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHBhcmVudEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRldmljZXJlYWR5XCIpO1xyXG4gICAgICAgICAgICB2YXIgbGlzdGVuaW5nRWxlbWVudCA9IHBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmxpc3RlbmluZycpO1xyXG4gICAgICAgICAgICB2YXIgcmVjZWl2ZWRFbGVtZW50ID0gcGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucmVjZWl2ZWQnKTtcclxuXHJcbiAgICAgICAgICAgIGxpc3RlbmluZ0VsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5Om5vbmU7Jyk7XHJcbiAgICAgICAgICAgIHJlY2VpdmVkRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6YmxvY2s7Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG59KSgpOyJdfQ==
