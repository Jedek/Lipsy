/**
 * Created by jeroen.klerk on 2015-01-09.
 */
window.LocalStorage = {

    databaseName: "LipSy",

    initialize: function() {
        if(typeof(Storage) !== "undefined") {
            return true;
        } else {
            throw "Warning! LocalStorage not supported. Database will not work.";
        }
    },

    getData: function() {
        var database = this.get(this.databaseName);

        if(database === null) {
            console.warn("No data found with key: " + this.databaseName + ". Creating a new Database.");

            var req=new XMLHttpRequest();
            req.open("GET","src/base.json",false);
            req.send();

            var json = req.responseText;

            LocalStorage.set(LocalStorage.databaseName,json);

            var database = LocalStorage.get(this.databaseName);
        }

        return JSON.parse(database);
    },

    saveData: function(database){
        this.set(this.databaseName, JSON.stringify(database));
    },

    get: function(key) {
        return localStorage.getItem(key);
    },

    set: function(key, value) {
        localStorage.setItem(key, value);
    }
};