/**
 * Created by jeroen.klerk on 2015-01-09.
 */

describe("App", function(){
    it("should initialize", function(){
        expect(app).not.toBeNull();
    });

    it("should store the encoded JSON database", function(){
        app.initialize();
        expect(app.database).not.toBeNull();
    });

    it("should allow the user to choose a language", function(){
        var database = app.database;

        app.execute.setChosen("Swedish");
        expect(database["English"].chosen).toBeFalsy();
        expect(database["Swedish"].chosen).toBeTruthy();

        app.execute.setChosen("English");
        expect(database["English"].chosen).toBeTruthy();
        expect(database["Swedish"].chosen).toBeFalsy();
    });

    it("should retrieve the chosen language", function(){
        var chosen = app.execute.getChosen();

        expect(chosen).not.toBeNull();
    });

    describe("Words", function(){
        it("should allow the user to add a word", function(){
            app.execute.addWord("English", "Testword");

            expect(app.database["English"].words["Testword"]).toBeDefined();
        });

        it("should not allow existing words to be added", function(){
            expect(app.execute.addWord("English", "Testword")).toBeFalsy();
        });

        it("should remember the last word added", function(){
            expect(app.lastWord).not.toBeNull();

            var chosen = app.execute.getChosen();

            expect(app.execute.getLatestWord(chosen.name)).not.toBeUndefined();
        });

        it("should allow the user to remove a word", function(){
            app.execute.removeWord("English", "Testword");
            expect(app.database["English"].words["Testword"]).toBeUndefined();
        });
    });

    describe("Translations", function(){
        it("should allow the user to add a translation to a word", function(){
            app.execute.addTranslation("English", "Tree", "Trad", "Swedish");

            expect(app.database["English"].words["Tree"]["Swedish"]).toBeDefined();
        });

        it("should not allow existing translations to be added", function(){
            expect(app.execute.addTranslation("English", "Tree", "Trad", "Swedish")).toBeFalsy();
        });

        it("should allow the user to edit an existing translation", function(){
            app.execute.editTranslation("English", "Tree", "Swedish", "Trod");

            expect(app.database["English"].words["Tree"]["Swedish"]).toBe("Trod");
        });

        it("should allow the user to remove a translation from a word", function(){
            app.execute.removeTranslation("English", "Tree", "Swedish");

            expect(app.database["English"].words["Tree"]["Swedish"]).toBeUndefined();
        });
    });

    describe("Search", function(){
        it("should allow the user to search for one or more words in the chosen language", function(){

            app.execute.addWord("English", "Boat");
            app.execute.addWord("English", "Tell");
            app.execute.addWord("English", "Tater");
            app.execute.addWord("English", "Tall");
            app.execute.addWord("English", "Three");
            app.execute.addWord("English", "Tree");
            app.execute.addWord("English", "Door");
            app.execute.addWord("English", "Bell");

            expect(app.execute.search("English", "T").length).toBeGreaterThan(4);
            expect(app.execute.search("English", "Ta").length).toBe(2);
            expect(app.execute.search("English", "Boat").length).toBe(1);

            app.execute.removeWord("English", "Boat");
            app.execute.removeWord("English", "Tell");
            app.execute.removeWord("English", "Tater");
            app.execute.removeWord("English", "Tall");
            app.execute.removeWord("English", "Three");
            app.execute.removeWord("English", "Door");
            app.execute.removeWord("English", "Bell");
        });
    });
});