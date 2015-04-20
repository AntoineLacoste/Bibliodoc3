cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-indexedDB/www/IndexedDBShim.min.js",
        "id": "cordova-plugin-indexedDB.IndexedDBShim",
        "runs": true
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "id": "org.apache.cordova.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-indexedDB": "0.1.2",
    "org.apache.cordova.dialogs": "0.3.0"
}
// BOTTOM OF METADATA
});