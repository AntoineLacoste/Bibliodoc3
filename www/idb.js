function CreateDatabase(nomDb, objetStructure) {
    /// <summary>
    /// Créé une BDD
    /// </summary>
    /// <param name="nomDb">nom de la BDD</param>
    /// <param name="objetStructure">{ 'table1': [ [champ1,bUnique], ... ], ...}</param>

    // Variables
    var dbHandle = null;
    try {
        // Tentative de Connexion à la BDD
        var IDB = window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB ||
            window.shimIndexedDB;
        var req = IDB.open(nomDb, 2);

        // Création / ouverture OK
        req.onsuccess = function (e) {
            dbHandle = e.target.result;
            console.log('succes creation BDD');
            dbHandle.close();
        }
        // Création / ouverture KO
        req.onerror = function (e) { console.log('error creation BDD'); }

        // Création / ouverture bloquée
        req.onblocked = function (e) { console.log('blocked BDD'); }

        // Si la BDD n'existe pas => Création structure BDD
        req.onupgradeneeded = function (e) {
            // Récupération de la connexion
            dbHandle = e.target.result;

            var store;
            // Parcours des magasins (tables en SQL)
            for (var nomStore in objetStructure) {
                var aIndex = objetStructure[nomStore];
                // Création magasin
                store = e.currentTarget.result.createObjectStore(nomStore, { keyPath: "id", autoIncrement: true });
                // Parcours des index du magasin (champs en SQL)
                for (var index in aIndex) {
                    //console.log(aIndex[index][0]);
                    // On crée ensuite un index dans la base de données avec les 3 variables récupérées
                    store.createIndex(aIndex[index][0]+'_Index', aIndex[index][0], { unique: aIndex[index][1], multientry: false });

                }

            }
            console.log('Upgrade BDD');
        }
    }
    catch (ex) {
        // Affichage message erreur
        alertMssg(ex.message,null,"Erreur","Fermer");
    }
}

function DeleteDatabase(dbName) {
    /// <summary>
    /// Suppression BDD
    /// </summary>
    /// <param name="dbName">nom de la BDD à suppr</param>

    var dbRequest = window.indexedDB.deleteDatabase(dbName);
    dbRequest.onerror = function () { console.log("Error deleting database "+dbName); };
    dbRequest.onsuccess = function () { console.log("Database deleted "+dbName); };
    dbRequest.onblocked = function () { console.log("Database delete blocked "+dbName);};
}

function InsertData(nomDb, nomTable, aObjets, fctError) {
    /// <summary>
    /// Insertion de données dans la BDD (UPDATE est identique)
    /// </summary>
    /// <param name="nomDb">nom de la BDD</param>
    /// <param name="nomTable">nom du magasin concerné par l'insertion</param>
    /// <param name="aObjet">Tableau d'(objets JSON à insérer dans le magasin ex: [{"id": 2,"marque_id": 2,"societe_id": 1}, {"id": 1,"marque_id": 1,"societe_id": 2}]</param>
    /// <param name="fctError">(facultatif) fonction permettant de gérer l'erreur</param>

    // Gestion erreurs
    var err = (fctError===undefined?function (e){console.log("erreur InsertData table:" + nomTable+' '+e.message);}:fctError);
    // Connexion BDD
    var IDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;
    var db = IDB.open(nomDb);
    // Connexion OK
    if (db) {
        // Callback de connexion réussi
        db.onsuccess = function (e) {
            try{
                // On initialise la transaction avec les droits de lecture/écriture
                var transaction = e.target.result.transaction(nomTable, "readwrite");
                // On établie la transaction pour le magasin d'objet que l'on a entré en paramètre
                var table = transaction.objectStore(nomTable);
                var req;
                // Parcours des objets à insérer
                for (var i in aObjets) {
                    // On lui ajoute alors l'objet voulu avec la fonction add
                    req = table.add(aObjets[i]);
                    // On gère les erreurs qui peuvent survenir lors de l'ajout de donnée
                    req.onerror = err;
                }
            }
            catch (ex) {
                HandleException(ex, "InsertData() La table " + nomTable + " n'existe pas ");
            }
        }
    }
    // Connexion KO
    db.onerror = err;
}

/**
 * Mise à jour de données dans la BDD
 * @param nomDb: nom de la BDD
 * @param nomTable: nom du magasin concerné par l'insertion
 * @param objet: ojet à insérer dans le magasin*
 * @param fctError: (facultatif) fonction permettant de gérer l'erreur
 * @return: pas de retour car fonction asynchrone.
 */
function UpdateData(nomDb, nomTable, objet, fctError) {
    /// <summary>
    /// Insertion de données dans la BDD (UPDATE est identique)
    /// </summary>
    /// <param name="nomDb">nom de la BDD</param>
    /// <param name="nomTable">nom du magasin concerné par l'insertion</param>
    /// <param name="objet">bjet à insérer dans le magasin</param>
    /// <param name="fctError">(facultatif) fonction permettant de gérer l'erreur</param>

    InsertData(nomDb, nomTable, objet, fctError);
}

function DeleteData(nomdB, keyObjet, nomTable, fctError) {
    /// <summary>
    /// Suppression de données dans la BDD (UPDATE est identique)
    /// </summary>
    /// <param name="nomdB">nom de la BDD</param>
    /// <param name="keyObjet"> clé de l'objet à supprimer</param>
    /// <param name="nomTable">nom du magasin concerné par l'insertion</param>
    /// <param name="fctError">(facultatif) fonction permettant de gérer l'erreur</param>

    // Gestion erreurs
    var err = (fctError===undefined?function (e){console.log("erreur InsertData table:" + nomTable+' '+e.message);}:fctError);
    // Connexion BDD
    var IDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;
    var db = IDB.open(nomdB);
    // Connexion OK
    if (db) {
        // Callback de connexion réussi
        db.onsuccess = function (e) {
            // On initialise la transaction avec les droits de lecture/écriture
            var transaction = e.target.result.transaction(nomTable, "readwrite");
            // On établie la transaction pour le magasin d'objet que l'on a entré en paramètre
            var table = transaction.objectStore(nomTable);
            // On supprime alors toute la donnée correspondant à la clé entré en paramètre
            var delRequest = table.delete(keyObjet);
            // On gère les erreurs qui peuvent survenir lors de la suppression de donnée
            delRequest.onerror = err;
        }
    }
    // Connexion KO
    db.onerror = err;
}

function ReadAll(nomDb, nomTable, fctSuccess, fctError) {
    /// <summary>
    /// Récupérer toutes les lignes d'une table (TESTEE)
    /// </summary>
    /// <param name="nomDb">nom de la BDD</param>
    /// <param name="nomTable">nom du magasin (ou table en SQL)</param>
    /// <param name="fctSuccess">fonction de callback permettant de traiter les données récupérées sous forme de tableau (1 param) 
    ///         ex: BuildTable(tab) : tab est un tableau de données 
    ///                               tab = 0 si la BDD n'est pas initialisée ou table n'existe pas.</param>
    /// <param name="fctError">(facultatif) fonction permettant de gérer l'erreur (1 param evt)</param>


    // Connexion BDD
    var IDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;
    var req = IDB.open(nomDb);
    // Variables
    var aData = [];
    // Overture BDD ok
    req.onsuccess = function (e) {
        // Handler de connexion
        var db = e.target.result;
        // BDD vide (pas de structure)
        if (db.objectStoreNames.length === 0) {
            // Fermeture connexion
            db.close();
            // Log
            console.log('la BDD ' + nomDb + ' est vide');
            // Retour en callback
            fctSuccess('0');
        }
        // BDD a au moins une table
        else {
            try {
                // On initialise la transaction avec les droits de lecture
                var transaction = db.transaction(nomTable, "readonly");
                // Requete
                var cursorRequest = transaction.objectStore(nomTable).openCursor();
                // Résultats de la requete
                cursorRequest.onsuccess = function (e) {
                    // On récupère la valeur lu par le curseur dans la variable reader
                    var reader = e.target.result;
                    if (reader) {
                        // Résultat dans un tableau
                        aData.push(reader.value);
                        // On continue de parcourir le magasin d'objet tant qu'il y a de la donnée à afficher
                        reader.continue();
                    }
                }
                // Gestion erreur
                cursorRequest.onerror = function(e){ (fctError === undefined ? console.log('erreur ReadAll table:' + nomTable + ' ' + e.message)  : fctError(e))};
                // Transaction terminée + Ok
                transaction.oncomplete = function (e) { fctSuccess(aData); }
            }
            catch (ex) {
                HandleException(ex, "La table " + nomTable + " n'existe pas ");
                // Retour en callback
                fctSuccess('0');
            }
        }
    }
    // On gère l'erreur d'ouverture de la base de données
    req.onerror = function (e) { (fctError === undefined ? console.log('erreur ReadAll table:' + nomTable + ' ' + e.message) : fctError(e)) };
}


function Read(nomDb, magasins, magCondition, nomIndex, range) {
    /// <summary>
    /// Récupérer les lignes de la table "nomTable" avec la consition "nomIndex"="valeur"
    /// </summary>
    /// <param name="nomDb">nom de la BDD</param>
    /// <param name="magasins">tableau de magasins concerénés par la requête</param>
    /// <param name="magCondition">magasin sur lequel la condition nomIdex est appliquée</param>
    /// <param name="nomIndex">(facultatif => null)nom de l'index sur lequel on veut effectuer la recherche.
    /// Si la recherche est faite sur la clé primaire (ID) alors index null</param>
    /// <param name="range">IDBKeyRange.boud()</param>
    /// <param name="fctSuccess">fonction de callback permettant de traiter les données récupérées sous forme de tableau (1 param) 
    ///         ex: BuildTable(tab) : tab est un tableau de données 
    ///                               tab = 0 si la BDD n'est pas initialisée ou table n'existe pas.</param>
    /// <param name="fctError">(facultatif) fonction permettant de gérer l'erreur (1 param evt)</param>


    // Promise
    return new WinJS.Promise(function (ok, ko) {
        // Connexion BDD
        var IDB = window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB ||
            window.shimIndexedDB;
        var req = IDB.open(nomDb);
        // Variables
        var aData = [];
        // Overture BDD ok
        req.onsuccess = function (e) {
            // Handler de connexion
            var db = e.target.result;
            // BDD vide (pas de structure)
            if (db.objectStoreNames.length === 0) {
                // Fermeture connexion
                db.close();
                // Log
                console.log('la BDD ' + nomDb + ' est vide');
                // Retour en callback
                ko('la BDD ' + nomDb + ' est vide');
            }
            // BDD a au moins une table
            else {
                try {
                    // On initialise la transaction avec les droits de lecture
                    var transaction = db.transaction(magasins, "readonly");
                    // Requete
                    var store = transaction.objectStore(magCondition);
                    try {
                        var cursorRequest;
                        // Index
                        if (nomIndex !== null) {
                            cursorRequest = store.index(nomIndex + '_Index').openCursor(range);
                        }
                        // Clé primaire
                        else {
                            cursorRequest = store.openCursor(range);
                        }
                        // Résultats de la requete
                        cursorRequest.onsuccess = function (e) {
                            // On récupère la valeur lue par le curseur dans la variable reader
                            var reader = e.target.result;
                            // Lecture
                            if (reader) {
                                //if (reader.value[nomIndex] == valeur) {
                                // Résultat dans un tableau
                                aData.push(reader.value);
                                //}
                                // On continue de parcourir le magasin d'objet tant qu'il y a de la donnée à afficher
                                reader.continue();
                            }
                            // Fin lecture
                            else {
                                // Fin promise
                                console.log('OK promise READ()');
                                ok(aData);
                            }
                        }
                        // Gestion erreur
                        cursorRequest.onerror = function (e) {
                            console.log('Impossible de parcourir le magasin ' + magCondition);
                            ko('Impossible de parcourir le magasin ' + magCondition);
                        };
                    }
                    catch (ex) {
                        //HandleException(ex, "L'index " + nomIndex + " n'existe pas ");
                        // erreur
                        console.log("L'index " + nomIndex + " n'existe pas ");
                        ko("L'index " + nomIndex + " n'existe pas ");
                    }
                }
                catch (ex) {
                    console.log("La table " + magCondition + " n'existe pas ");
                    ko("La table " + magCondition +" n'existe pas ");
                }
            }
        }
        // On gère l'erreur d'ouverture de la base de données
        req.onerror = function (e) {
            console.log('erreur Read table:' + nomTable);
            ko('erreur Read table:' + nomTable);
        };
    });
}


/**
 * Gère les exceptions
 */
function HandleException(ex, msg) {
    console.log("EXCEPTION: " + ex.message+'\n'+msg);
}