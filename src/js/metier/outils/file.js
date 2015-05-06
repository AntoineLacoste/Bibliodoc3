function DownloadFile(uriString, fileName) {

        /// <summary>
        /// Enregistre un fichier sur le disque
        /// </summary>
        /// <param name="uriString">dossier source (http, https ou ftp)</param>
        /// <param name="fileName">nomFichier destination</param>

        return new WinJS.Promise(function (ok, ko) {
            try {
                // Asynchronously create the file in the pictures folder.
                Windows.Storage.ApplicationData.current.localFolder.createFileAsync(fileName, Windows.Storage.CreationCollisionOption.replaceExisting).done(function (newFile) {
                    var uri = Windows.Foundation.Uri(uriString);
                    var downloader = new Windows.Networking.BackgroundTransfer.BackgroundDownloader();

                    // Create a new download operation.
                    download = downloader.createDownload(uri, newFile);

                    // Start the download and persist the promise to be able to cancel the download.
                    promise = download.startAsync().then(function (e) {
                        // Completelo
                        ok(e);
                    }, function (e) { /*erreur*/
                        ko(e);
                    }, function (e) { /* progress*/
                    });
                }, function (e) { /*erreur*/
                    ko(e);
                });
            } catch (err) {
                catalogue.HandleException(err, 'dans DownloadFile()');
            }
        });

    }

    function ErrorDownloadFile(e) {
        console.log('erreur téléchargement fichier ' + e.message);
    }

    function DeleteFile(fileName) {
        /// <summary>
        /// Suppression fichier encapsulé d'une promise
        /// </summary>
        /// <param name="fileName">fic à suppr</param>
        return new WinJS.Promise(function (ok, ko) {
            Windows.Storage.ApplicationData.current.localFolder.getFileAsync(fileName).done(function (oFile) {
                oFile.deleteAsync().done(function () {
                    ok();
                }, function (err) {
                    ko(err)
                });
            });
        });
    }

    function OpenFile(fic) {
        /// <summary>
        /// Ouvre un fichier à partir d'une URL
        /// </summary>
        /// <param name="fic">fichier à supprimer</param>
        try {
            // Get the image file from the package's image directory
            Windows.Storage.ApplicationData.current.localFolder.getFileAsync(fic).then(
                function (file) {
                    // Set the show picker option
                    var options = new Windows.System.LauncherOptions();
                    options.displayApplicationPicker = false;
                    Windows.System.Launcher.launchFileAsync(file, options).done(function (file) {
                        // Complete
                    }, function (err) {
                        // Erreur
                        console.log('erreur affichage fichier ' + e.message);
                    });
                }, function (err) {
                    console.log('le fichier ' + fic + 'n existe pas');
                });
        }
        catch (err) {
            catalogue.HandleException(err,"dans openfile");
        }
    }

module.exports.DeleteFile=DeleteFile;
module.exports.DownloadFile=DownloadFile;
module.exports.OpenFile=OpenFile;


