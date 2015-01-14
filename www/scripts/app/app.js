/**
 * Created by jeroen.klerk on 2015-01-09.
 */
var app = {

    database: null,
    lastWord: null,

    practiceLanguage: null,
    practiceWordsAmount: 0,
    practiceWords: null,

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

                if(app.database[language].words[word][trans_language] === new_translation) {
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
        },

        /**
         * Practice
         */
        chooseLanguage: function(practiceLanguage){
            for(var language in app.database) {
                if(language === practiceLanguage) {
                    app.practiceLanguage = practiceLanguage;
                }
            }
        },


        chooseAmountWords: function(amount) {
            var count = 0;

            for(var word in app.database[app.practiceLanguage].words) {
                count++;
            }

            if(count <= amount) {
                app.practiceWordsAmount = count;
            } else {
                app.practiceWordsAmount = amount;
            }
        },

        getPracticeWords: function(){
            var existingWords = [];
            var chosenWords = [];

            for(var word in app.database[app.practiceLanguage].words) {
                existingWords.push([word,app.database[app.practiceLanguage].words[word]]);
            }

            for(var i=0;i<app.practiceWordsAmount;i++) {
                var randomWord =  Math.floor(Math.random() * existingWords.length);

                if(existingWords[randomWord] !== undefined) {
                    chosenWords.push(existingWords[randomWord]);
                    delete existingWords[randomWord];
                } else {
                    i--;
                }
            }

            return chosenWords;

        },

        giveAnswer: function(word, answer){
            var chosen = app.execute.getChosen();
            answer = app.execute.formatWord(answer);

            if(app.database[chosen.name].words[word][app.practiceLanguage] === answer) {
                return true;
            } else {
                return false;
            }
        }

    }
};