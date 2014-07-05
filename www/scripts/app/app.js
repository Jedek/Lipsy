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
    		var home = new nova.Page("test.html");
    		
    		app.store.getLanguages(function(result){
    			app.log("Found languages");
    			
    			home.languages = result;
    		});
    		
    		
    		app.store.getAppData(function(result){
    			
    			var chosen_language = 1;
    			
    			if(result != null) {
    				if(result.latest_language != null) {
    					chosen_language = result.latest_language;	
    				}	
    			}
    			
    			home.chosen = chosen_language;
    			
    			nova.application.gotoPage(home);
    		});
    	}
    },
    
    execute: {
    	updateApp: function(attribute, value) {
    		app.store.updateAppData(attribute, value);
    	}
    }
};