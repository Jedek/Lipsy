/**
 * Created by jeroen.klerk on 2015-01-09.
 */
describe("LocalStorage", function(){
    it("should initialize", function(){
        expect(LocalStorage.initialize()).toBeTruthy();
    });

    it("should be able to set and get information", function(){
        LocalStorage.set("TestKey", "TestValue");

        expect(LocalStorage.get("TestKey")).not.toBeNull();
    });

    it("should load the database",function(){

        LocalStorage.getData();

        expect(LocalStorage.get(LocalStorage.databaseName)).not.toBeNull();
    });


});