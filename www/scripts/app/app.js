var app = {
	
    initialize: function() {
    	app.log("Initializing program.");
    	
    	this.store = new WebSqlStore();
    	
    	this.store.initialize(function(success){
    		app.store.setAppData();
    		app.load.index();
    	});
    	
    },
    
    log: function(message, sender) {
    	if(sender == null){
    		sender = "Phonegap";
    	}
    	
    	console.log(sender + ":: " + message);
    },
    
    load: {
    	index: function() {
    		var home = new nova.Page("home.html");
    		
    		app.store.getLanguages(function(result){
    			app.log("Found languages");
    			
    			home.languages = result;
    		});
    		
    		app.execute.getChosenLanguage(function(chosen_language){
    			
    			home.chosen = chosen_language;
    			
    			nova.application.gotoPage(home);
    		});
    	},
    	
    	add: function() {
    		var add = new nova.Page("pages/add.html");
    		
    		app.execute.getChosenLanguage(function(chosen_language){
    			add.chosen = chosen_language;
    			
    			nova.application.gotoPage(add);
    		});
    	},
    	
    	word: function(word) {
    		var wordPage = new nova.Page("pages/word.html");
    		
    		if(word == null) {
    			app.execute.getLatestWord(function(theWord){
    				app.execute.getLanguage(theWord.language, function(language){
    					wordPage.the_word = theWord;
    					wordPage.the_language = language;
    				
    					nova.application.gotoPage(wordPage);
    				});
    			});	
    		} else {
    			app.execute.getWord(word, function(theWord){
    				app.execute.getLanguage(theWord.language, function(language){
    					wordPage.the_word = theWord;
    					wordPage.the_language = language;
    				
    					nova.application.gotoPage(wordPage);
    				});    				
    			});
    		}
    	}
    },
    
    execute: {
    	updateApp: function(attribute, value) {
    		app.store.updateAppData(attribute, value);
    	},
    	
    	getChosenLanguage: function(callback) {
    		app.store.getAppData(function(result){
    			
    			var chosen_language = 1;
    			
    			if(result != null) {
    				if(result.latest_language != null) {
    					chosen_language = result.latest_language;	
    				}	
    			}
    			
    			app.store.getLanguage(chosen_language, callback);
    		});
    	},
    	
    	getAllLanguages: function(callback) {
    		app.store.getLanguages(callback);
    	},
    	
    	getLanguage: function(id, callback) {
    		app.store.getLanguage(id, callback);
    	},
    	
    	getLatestWord: function(callback) {
    		app.store.getAppData(function(result){
    			if(result != null) {
    				app.log("Latest word id is: " + result.latest_word);
    				var latest_word = result.latest_word;
    				app.store.getWord(latest_word, callback);
    			}
    		});
    	},
    	
    	getWord: function(id, callback) {
    		app.store.getWord(id, callback);
    	},
    	
    	addWord: function(word, callback) {
    		app.execute.getChosenLanguage(function(language){
    			app.store.addWord(word, language.id, function(result){
					app.log("Latest word is: " + result.word);
					app.execute.updateApp('latest_word', result.id);
					callback(result);
    			});
    		});
    	},
    	
    	getTranslations: function(word, callback) {
    		app.store.getTranslations(word, function(translations){
    			if(Array.isArray(translations)) {
    				callback(translations);
    			} else {
    				var array = [];
    				array.push(translations);
    				callback(array);
    			}
    		});
    	},
    	
    	/**
    	 * 
		 * @param {Object} word 		The Original Word
		 * @param {Object} translation  Translation of the Original Word
		 * @param {Object} translation_id			ID of the translation word
		 * @param {Object} language		ID of the language of the translation
		 * @param {Object} callback
    	 */
    	updateTranslation: function(word, translation, translation_id, language, callback) {
    		app.store.addTranslation(word, translation, translation_id, language, callback);
    	},
    	
    	removeTranslation: function(word, callback) {
    		app.store.removeTranslation(word, callback);	
    	}
    }
};