/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
       if(navigator.userAgent.match(/Chrome|Trident/)){
            app.onDeviceReady();
        }
        else{
        document.addEventListener("deviceready", app.onDeviceReady, false);
        }

},
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent("deviceready");
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('user : '+ navigator.userAgent);
        testIDB();
    }
};

app.initialize();

// Pour obtenir une présentation du modèle Navigation, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkId=232506
function testIDB(){

                //// Suppression BDD
                //DeleteDatabase("Test");
                //// Création structure BDD
                //CreateIdbBibliodoc();
                //// Insertion jeu de test
                //InsertDataTest();
                testID();
}

function testID(){
    DeleteDatabase("idarticle_people");
    var openRequest = indexedDB.open("idarticle_people",1);
 
    openRequest.onupgradeneeded = function(e) {
        var thisDB = e.target.result;
 
        if(!thisDB.objectStoreNames.contains("people")) {
            thisDB.createObjectStore("people",{autoIncrement:true});
        }
    openRequest.onsuccess = function(e) {

    
        console.log("running onsuccess");
 
        db = e.target.result;
 
        //Listen for add clicks
        document.getElementById("addButton").addEventListener("click", addPerson, false);
    }
}
}

function addPerson(e) {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
 
    console.log("About to add "+name+"/"+email);
 
    var transaction = db.transaction(["people"],"readwrite");
    var store = transaction.objectStore("people",{autoIncrement:true});
 
    //Define a person
    var person = {
        name:name,
        email:email,
        created:new Date()
    }
 
    //Perform the add
    var request = store.add(person);
 
    request.onerror = function(e) {
        console.log("Error",e.target.error.name);
        //some type of error handler
    }
 
    request.onsuccess = function(e) {
        var a=document.createElement("p");
        var b=document.createTextNode('ajout effectué');
        a.appendChild(b);
        document.getElementById("anduin").appendChild(a);

    }
}


function InsertDataTest() {
    console.log('jinsere');
    InsertData("Test", 'utilisateur', [{ "nom": "ELIPCE", "prenom": "Informatique", "date_naissance": "2014-07-23", "mail": "yann.plantevin@elipce.com", "login": "elipce", "pwd": "7e54dad3d4b787512e80e6058a01ccecfef6b188", "first_conn": "0", "societe_id": 1 },
                                                { "nom": "PEREZ", "prenom": "Vivian", "date_naissance": "1985-02-26", "mail": "vivian.perez@elipce.com", "login": "viv", "pwd": "", "societe_id": 1, "item1": "a", "item2": "b" }]);

    InsertData("Test", 'societe', [{ "id": 1, "libelle": "EPS", "adresse": "", "adresse2": "", "code_postal": "", "ville": "", "tel": "" }, { "id": 2, "libelle": "APR", "adresse": "", "adresse2": "", "code_postal": "", "ville": "", "tel": "" }]);
    InsertData("Test", 'marque_societe', [{ "id": 2, "marque_id": 2, "societe_id": 1 },
                                                    { "id": 1, "marque_id": 1, "societe_id": 2 }]);
    InsertData("Test", 'marque', [{ "id": 1, "nom": "Promotions APR", "dossier_id": 1, "is_promo": 1 },
                                            { "id": 2, "nom": "Promotions EPS", "dossier_id": 2, "is_promo": 1 }
    ]);
    InsertData("Test", 'dossier', [{ "id": 1, "nom": "Promotions APR", "dossier_id": null },
                                            { "id": 2, "nom": "Promotions EPS", "dossier_id": null }
    ]);
    InsertData("Test", 'document', [{ "id": 1, "nom": "Armani code", "dossier_id": 4, 'chemin_fichier': '1.pdf' },
                                          { "id": 2, "nom": "Aqua di gio", "dossier_id": 4, 'chemin_fichier': '2.docx' }
    ]);

}

function CreateIdbBibliodoc() {
    /// <summary>
    /// Création de la structure de la BDD bibliodoc-mobile
    /// </summary>

    // Structure BDD
    var aStruct = {
        'utilisateur': [['nom', false], ['prenom', false], ['date_naissance', false], ['mail', false], ['login', false],  ['societe_id', false]],
        'societe': [['libelle', false]],
        'marque_societe': [['marque_id', false], ['societe_id', false]],
        'marque': [['nom', false], ['dossier_id', false], ['is_promo', false]],
        'dossier': [['nom', false], ['dossier_id', false]],
        'document': [['nom', false], ['description', false], ['dossier_id', false]]
    }
    // Création BDD si elle n'existe pas.
    CreateDatabase("Test", aStruct);

}