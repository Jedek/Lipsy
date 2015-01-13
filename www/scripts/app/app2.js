/**
 * Created by jeroen.klerk on 2015-01-09.
 */
var app = {

    database: null,
    lastWord: null,

    initialize: function(){
        console.log("Initializing application");
        LocalStorage.initialize();

        this.database = LocalStorage.getData();

        app.load.index();
    },

    load: {
        index: function() {
            var home = new nova.Page("home.html");
            nova.application.gotoPage(home);
        },

        word: function() {
            var word = new nova.Page("pages/word.html");
            nova.application.gotoPage(word);
        },

        search: function() {
            var search = new nova.Page("pages/search.html");
            nova.application.gotoPage(search);
        }
    },

    execute: {
        setChosen: function(chosen) {
            for(var language in app.database) {
                if(language === chosen) {
                    app.database[language].chosen = true;
                } else {
                    app.database[language].chosen = false;
                }
            }

            LocalStorage.saveData(app.database);
        },

        getChosen: function() {
            for(var language in app.database) {
                if(app.database[language].chosen === true) {
                    return app.database[language];
                }
            }

            return undefined;
        },

        /**
         * Words
         */

        addWord: function(language, new_word) {

            var found = false;

            new_word = app.execute.formatWord(new_word);
            console.log("Test: " + language);
            for(var word in app.database[language].words) {
                if(word === new_word) {
                    found = true;
                }
            }

            if(found) {
                console.warn("Warning. There was an attempt to add an existing word");
                return false;
            } else {
                app.database[language].words[new_word] = {};

                LocalStorage.saveData(app.database);
                app.lastWord = new_word;
                return true;
            }
        },

        getLatestWord: function(language){
            for(var word in app.database[language].words){
                if(word === app.lastWord) {
                    return app.database[language].words[word];
                }
            }
            return undefined;
        },

        removeWord: function(language, remove_word) {
            remove_word = app.execute.formatWord(remove_word);

            delete app.database[language].words[remove_word];
            LocalStorage.saveData(app.database);
        },

        formatWord: function(the_word) {
            the_word = the_word.toLowerCase();

            return the_word.charAt(0).toUpperCase() + the_word.slice(1);
        },

        /**
         * Translations
         */

        addTranslation: function(language, word, new_translation, trans_language) {
            var found = false;
            new_translation = app.execute.formatWord(new_translation);
            for(var translation in app.database[language].words[word]) {

                if(app.database[language].words[word][translation] === trans_language) {
                    found = true;
                }
            }

            if(found) {
                console.warn("Warning. There was an attempt to add an existing translation");

                return false;
            } else {
                app.database[language].words[word][trans_language] = new_translation;

                LocalStorage.saveData(app.database);
                return true;
            }
        },

        editTranslation: function(language, word, trans_language, new_translation) {
            app.database[language].words[word][trans_language] = new_translation;
            LocalStorage.saveData(app.database);
        },

        removeTranslation: function(language, word, translation) {
            translation = app.execute.formatWord(translation);
            delete app.database[language].words[word][translation];
            LocalStorage.saveData(app.database);
        },


        /**
         * Search
         */
        search: function(language, searchWord) {

            var results = [];

            searchWord = app.execute.formatWord(searchWord);

            for(var word in app.database[language].words) {

                if(word.indexOf(searchWord) > -1) {
                    results.push(word);
                }
            }

            return results;
        }
    }
};