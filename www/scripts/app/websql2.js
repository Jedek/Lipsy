/*
 * Database configuration variables.
*/ 

var id = "LipSy";
var name = "Translation App DB";
var version = "1.0";
var size = 200000;

var store;

var debug = true;
var execute_debug = true;

var WebSqlStore = function(successCallback, errorCallback) {
	
	this.initialize = function(successCallback, errorCallback) {
		store = this;
		store.log("Initializing Database");
		
		store.createDatabase();
		store.loadXML("data.xml", successCallback);
	};
	
	this.connect = function(){
		store.db = window.openDatabase(id, version, name, size);
	};
	
	/**
	 * Specific DB Use 
	 */
	this.getLanguages = function(callback) {
		var sql = "SELECT * FROM language";
		
		store.selectSQL(sql, callback);
	};
	
	this.getLanguage = function(id, callback) {
		var sql = "SELECT * FROM language WHERE id = " + id;
		
		store.selectSQL(sql, callback);
	};
	
	this.addWord = function(word, language, callback) {
		word = capitalize(word);
		
		var select = "SELECT * FROM word WHERE word LIKE '" + word + "' AND language="+language+";";
		
		store.selectSQL(select, function(result){
			if(result == null) {
				sql = "INSERT INTO word (word, language) VALUES ('"+word+"', "+language+");";
				
				store.executeSQL(sql);
				
				store.selectSQL(select, callback);
			} else {
				callback(result);
			}
		});
	};
	
	this.updateWord = function(id, word) {
		store.log("Recieved update id: " + id + " with word: " + word);
		var sql = "UPDATE word SET word ='"+word+"' WHERE id="+id;
		
		store.executeSQL(sql);
	};
	
	this.findWord = function(search, callback) {
		var sql = "SELECT w.*, l.image AS image FROM word w INNER JOIN language l ON w.language = l.id WHERE w.word LIKE '"+search+"%' ORDER BY w.word ASC";
		
		store.selectSQL(sql, callback);
	};
	
	this.getWord = function(id, callback) {
		var sql = "SELECT * FROM word WHERE id =" + id;
		
		store.selectSQL(sql, callback);
	};
	
	this.getWordByText = function(word, callback) {
		var sql = "SELECT * FROM word WHERE word LIKE '%"+word+"'";
		
		store.selectSQL(sql, callback);
	};
	
	this.getTranslations = function(word, callback) {
		var sql = "SELECT w.*, l.image AS image from word w "+
					"INNER JOIN word_translation t ON w.id = t.translation "+
					"INNER JOIN language l ON w.language = l.id "+
					"WHERE t.word ="+word;
		
		
		store.selectSQL(sql, callback);
	};
	
	this.addTranslation = function(word, translation, translation_id, language, callback) {
		app.log("Word: " +word+ " translation " +translation+ " id: " +translation_id+ " language " + language, "Test");
		if(translation_id == undefined) {
			store.log("Creating word for translation");
			
			store.addWord(translation, language, function(translated_word){
				store.log("New word: " + translated_word[0].id + " with text: " + translated_word[0].word);
				translation_id = translated_word[0].id;
				
				store.addTranslation(word, translation, translation_id, language, callback);
			});
		} else {
			store.log("Updating translation: " + translation_id + " for translation: " + translation);
			store.updateWord(translation_id, translation);
		
			var sql = "INSERT OR REPLACE INTO word_translation (word, translation) VALUES ("+word+", "+translation_id+")";
			
			store.executeSQL(sql);
			
			callback(translation_id);	
		}
	};
	
	this.removeTranslation = function(word, callback) {
		var sql = "DELETE FROM word_translation WHERE word ="+word+" OR translation="+word;
		
		store.executeSQL(sql);
		
		callback(true);
	};
	
	this.setAppData = function(callback){
		var sql = "SELECT * FROM app";
		store.selectSQL(sql, function(result){
			if(result == null) {
				sql = "INSERT INTO app (id) VALUES (1)";
				store.executeSQL(sql);
			}
		});
	};
	
	this.getAppData = function(callback) {
		var sql = "SELECT * FROM app";
		store.selectSQL(sql, callback);
	};
	
	this.updateAppData = function(attribute, value) {
		var sql = "UPDATE app SET " + attribute + " = '"+value+"' WHERE id = 1";
		
		store.executeSQL(sql);
	};
	/**
	 *Initialization 
	 */
	this.createDatabase = function() {
		$.ajax({
        	type: "GET",
			url: "database.xml",
			dataType: "xml",
			success: function(xml) {
		 		store.log("Structure XML loaded. Proceeding to parse.");

	 			$(xml).find('tables').each(function(){
		 			$(this).find('table').each(function(){
		 				var tableName = $(this).attr("name");
	
	 					store.createTable(tableName, $(this).find("column"));	
		 			});
				});
			}
		});
	};
	
	this.loadXML = function(file, successCallback) {
		$.ajax({
        	type: "GET",
			url: file,
			dataType: "xml",
			success: function(xml) {
		 		store.log("XML loaded. Proceeding to parse.");

		 		$(xml).find("tables").each(function(){
		 			var tables = $(this).find('table');
		 			
		 			//store.fillTable($(this).attr('table'), columns, $(this).find('category'));
		 			
		 			$(tables).each(function(){
		 				var rows = $(this).find("row");
		 				app.log("Got table: " + $(this).attr('name'));
		 				
		 				store.fillTable($(this).attr('name'), rows);
		 			});
		 		});
		 		
		 		successCallback(true);
			}
		});
	};
	
		
	this.fillTable = function(table, rows) {
		var rowTotal = $(rows).length;
		
		store.log("filling table " + table + " with " + rowTotal + " rows");
		
		$(rows).each(function(rowIndex){
			var columns = $(this).find("column");
			var columnTotal = columns.length;
			var sql = "INSERT OR REPLACE INTO " + table + " (";
			
			// Building up the first part of the query	
			$(columns).each(function(columnIndex){
				if(columnIndex === columnTotal -1) {
					sql = sql + $(this).attr("name") + ") VALUES ( ";
				} else {
					sql = sql + $(this).attr("name") +", ";
				}	
			});
			
			// Building up the second part of the query
			$(columns).each(function(columnIndex){
				var value = $(this).text();
				
				if(columnIndex === columnTotal -1) {
					sql = sql + '"'+ value +'"';
					
					sql = sql +");";
				} else {
					sql = sql + '"'+ value +'" ,';
				}
			});

			store.executeSQL(sql);	
			store.sqlLog(sql);
		});
	};
	
	
	this.createTable = function(table, columns) {
				
		var total = $(columns).length;
		
		store.log("Creating table " + table +  " with " + total + " columns.");
		
		var sql = "CREATE TABLE IF NOT EXISTS "+table+" ( ";
		
		$(columns).each(function(index){
			
			var name = $(this).attr("name");
			var type = $(this).attr("type");
			
			
			if(index === total - 1) {
				sql = sql + name + " " + type + ");";	
			} else {
				if(name === "id") {
					sql = sql + name + " " + type + " PRIMARY KEY AUTOINCREMENT, ";
				} else {
					sql = sql + name + " " + type + ", ";
				}	
			}
		});
		store.sqlLog(sql);
		store.executeSQL(sql);
	};
	
	this.emptyTable = function(table) {
		store.log("Clearing table " + table);
		store.executeSQL("DELETE FROM " + table);
		store.executeSQL("DELETE FROM sqlite_sequence WHERE name='"+table+"';");
	};
	
	this.dropTable = function(table, callback) {
		store.executeSQL('DROP TABLE IF EXISTS ' + table);
		
		callback(1);
	};
	
	/**
	 * End Initialization 
	 */
	


	/**
	 * General DB Functions (Select/Execute) 
	 */
	this.executeSQL = function(sql) {
		
		//store.sqlLog("Executing SQL: " + sql);
		store.connect();
		store.db.transaction(function(tx){
			tx.executeSql(sql, null,
                function(tx, result) {
                	store.sqlLog('SQL execution success on query '+ sql);
                },
                function(tx, error) {
                    store.sqlLog('SQL execution error: ' + error.message + ' on query: ' + sql);
                });
		},
        function(error) {
            store.sqlLog('Transaction error: ' + error.message);
            if (errorCallback) errorCallback();
        },
        function() {
            //store.log('Transaction success');
            if (successCallback) successCallback();
        });
	};
	
	this.selectSQL = function(sql, callback, errorCallback) {
		
		//store.sqlLog("Executing SQL: " + sql);
		store.connect();
		store.db.transaction(function(tx){
			tx.executeSql(sql, null,
                function(tx, result) {
                	store.sqlLog('SQL selection success on query ' + sql);
                	
                	var results = [];
                	
                	if(result.rows.length == 0) {
                		callback(null);
                	} else {            	
	            		if(result.rows.length > 1) {
	                		for(i=0;i<result.rows.length;i++) {
	                			var item = result.rows.item(i);
	                			results.push(item);
	                		}
	            			callback(results);
	                	} else {
	                		var array = [];
	                		
	                		array.push(result.rows.item(0));
	                		callback(array);
	                	}
                	}

                },
                function(tx, error) {
                    store.sqlLog('SQL execution error: ' + error.message + " on query: " + sql);
                    //errorCallback(null);
                });
		},
        function(error) {
            store.sqlLog('Transaction error: ' + error.message + " On query: " + sql);
            if (errorCallback) errorCallback();
        },
        function() {
            //store.log('Transaction success');
            if (successCallback) successCallback();
        });
	};
	
	/**
	 * End General Use 
	 */
	
	this.log = function(message, type) {
		
		if(type == null) {
			type = "WebSQL";
		}
		
		if(debug == true) {
			app.log(message, type);	
		}
	};
	
	this.sqlLog = function(message, type) {
		if(type == null) {
			type = "SQL Debug";
		}
		
		if(execute_debug == true) {
			app.log(message, type);	
		}
		
	};
};

/**
 * Generic Functions 
 */

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

