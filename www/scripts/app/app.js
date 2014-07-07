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
    	
    	addWord: function(word, callback) {
    		app.execute.getChosenLanguage(function(language){
    			app.store.addWord(word, language.id, function(result){
	    			app.store.getWordByText(word, function(theWord){
	    				app.log("Latest word is: " + word);
	    				app.execute.updateApp('latest_word', theWord.id);
	    				callback(result);
	    			});
    			});
    		});
    	},
    	
    	getTranslations: function(word, callback) {
    		app.store.getTranslations(word.id, callback);
    	},
    	
    	updateTranslation: function(word, translation, language, callback) {
    		app.log("Translation: " + translation, 'App');
    		app.store.addTranslation(word, translation, language, callback);
    	}
    }
};