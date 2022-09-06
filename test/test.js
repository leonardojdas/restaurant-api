// your code here
const assert = require("chai").assert;
const { MenuItem } = require("../entity/MenuItem");
const { Constants } = require("../utils/Constants");
const dbBuilder = require("../db/DatabaseBuilder");
const rs = require("../api/RestaurantService");
let testItem;

describe("RestaurantService Tests", function(){
    before("Setup", async function(){
        // create a static object with the items to test
        testItem = await defineTestItems();

        // restore the database to its original state
        await dbBuilder.rebuild();
        console.log("    <<SETUP: Database restored to original state.>>");
    });

    describe("Good Requests (200 series)", function () {
        // Test 1
        it("LIST returns status 200, null error, and correct list of items.", async function () {
            // arrange
            let expectedStatus = testItem.statusCode.twoHundred;
            let expectedError = testItem.errorMessage.null;
            let expectedDataLength = testItem.data.initialLength;

            // act
            let res = await rs.processRequest(testItem.command.list, testItem.content.empty);

            // assert
            assert.equal(expectedStatus, res.statusCode);
            assert.equal(expectedError, res.err);
            assert.equal(expectedDataLength, res.data.length); // Check length of array and that objects are of type MenuItem.
        });

        // Test 2
        it("ADD adds a new item, returns status 201, null error, and data true, if item does not already exists.", async function () {
            // arrange
            let expectedStatus = testItem.statusCode.twoHundredOne;
            let expectedError = testItem.errorMessage.null;
            let expectedDataBool = testItem.data.true;
            let expectedDataAdded = testItem.content.itemToAdd.id;

            // act
            let res = await rs.processRequest(testItem.command.add, testItem.content.itemToAdd);
            let actualDataAdded = (await rs.getItemByID(testItem.content.itemToAdd.id)).id;

            // assert
            assert.equal(expectedStatus, res.statusCode);
            assert.equal(expectedError, res.err);
            assert.equal(expectedDataBool, res.data);
            assert.equal(expectedDataAdded, actualDataAdded); // Verify that entity has been added.
        });

        // Test 3
        it("DELETE deletes an item, return status 200, null error, and data true, if item exists.", async function () {
            // arrange
            let expectedStatus = testItem.statusCode.twoHundred;
            let expectedError = testItem.errorMessage.null;
            let expectedDataBool = testItem.data.true;
            let expectedDataDelete = testItem.data.null;

            // act
            let res = await rs.processRequest(testItem.command.delete, testItem.content.itemToDelete);
            let actualDataDelete = await rs.getItemByID(testItem.content.itemToDelete.id);

            // assert
            assert.equal(expectedStatus, res.statusCode);
            assert.equal(expectedError, res.err);
            assert.equal(expectedDataBool, res.data);
            assert.equal(expectedDataDelete, actualDataDelete); // Verify that entity has been deleted.
        });

        // Test 4
        it("UPDATE updates an item, return status 200, null error, and data true, if item exists.", async function () {
            // arrange
            let expectedStatus = testItem.statusCode.twoHundred;
            let expectedError = testItem.errorMessage.null;
            let expectedDataBool = testItem.data.true;
            let expectedDataUpdate = testItem.content.itemToUpdate;

            // act
            let res = await rs.processRequest(testItem.command.update, testItem.content.itemToUpdate);
            let actualDataUpdate = await rs.getItemByID(testItem.content.itemToUpdate.id);

            // assert
            assert.equal(expectedStatus, res.statusCode);
            assert.equal(expectedError, res.err);
            assert.equal(expectedDataBool, res.data);
            assert.equal(expectedDataUpdate.id, actualDataUpdate.id);                   // Verify that entity has been updated
            assert.equal(expectedDataUpdate.category, actualDataUpdate.category);       // Verify that entity has been updated
            assert.equal(expectedDataUpdate.description, actualDataUpdate.description); // Verify that entity has been updated
            assert.equal(expectedDataUpdate.price, actualDataUpdate.price);             // Verify that entity has been updated
            assert.equal(expectedDataUpdate.vegetarian, actualDataUpdate.vegetarian);   // Verify that entity has been updated
        });
    });

    describe("Bad Requests (400 series)", function () {
        describe("Invalid Commands - expect: status 405, error message, and null data", function () {
            // Test 5
            it("Command is empty: API return expected response.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundredFive;
                let expectedError = testItem.errorMessage.unknowOperation;
                let expectedData = testItem.data.null;

                // act
                let res = await rs.processRequest(testItem.command.empty);

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
            });

            // Test 6
            it("Command is null: API returns expected response.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundredFive;
                let expectedError = testItem.errorMessage.unknowOperation;
                let expectedData = testItem.data.null;

                // act
                let res = await rs.processRequest(testItem.command.null);

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
            });

            // Test 7
            it("Command is 'foo': API returns expected response.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundredFive;
                let expectedError = testItem.errorMessage.unknowOperation;
                let expectedData = testItem.data.null;

                // act
                let res = await rs.processRequest(testItem.command.foo);

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
            });

            // Test 8
            it("Command is 'addd': API returns expected response.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundredFive;
                let expectedError = testItem.errorMessage.unknowOperation;
                let expectedData = testItem.data.null;

                // act
                let res = await rs.processRequest(testItem.command.addd);

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
            });

            // Test 9
            it("Command is 'ad': API returns expected response.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundredFive;
                let expectedError = testItem.errorMessage.unknowOperation;
                let expectedData = testItem.data.null;

                // act
                let res = await rs.processRequest(testItem.command.ad);

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
            });
        });

        describe("Content is not an Object - expected: status 400, error message, and null data", function () {
            // Test 10
            it("Content is omitted: DELETE does not change database, and return expected response.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundred;
                let expectedError = testItem.errorMessage.unrecognizedEntity;
                let expectedData = testItem.data.null;
                let expectedDataLength = await rs.getMenuLength();

                // act
                let res = await rs.processRequest(testItem.command.delete, testItem.content.empty);
                let actualDataLength = await rs.getMenuLength();

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
                assert.equal(expectedDataLength, actualDataLength); // Verify that nothing has been deleted from the database.
            });

            // Test 11
            it("Content is null: DELETE does not change database, and returns expected response.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundred;
                let expectedError = testItem.errorMessage.unrecognizedEntity;
                let expectedData = testItem.data.null;
                let expectedDataLength = await rs.getMenuLength();

                // act
                let res = await rs.processRequest(testItem.command.delete, testItem.content.null);
                let actualDataLength = await rs.getMenuLength();

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
                assert.equal(expectedDataLength, actualDataLength); // Verify that nothing has been deleted from the database.
            });

            // Test 12
            it("Content is a string: DELETE does not change database, and returns expected response.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundred;
                let expectedError = testItem.errorMessage.unrecognizedEntity;
                let expectedData = testItem.data.null;
                let expectedDataLength = await rs.getMenuLength();

                // act
                let res = await rs.processRequest(testItem.command.delete, testItem.content.foo);
                let actualDataLength = await rs.getMenuLength();

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
                assert.equal(expectedDataLength, actualDataLength); // Verify that nothing has been deleted from the database.
            });

            // Test 13
            it("Content is a valid ID (number): DELETE does not change database, and returns expected response.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundred;
                let expectedError = testItem.errorMessage.unrecognizedEntity;
                let expectedData = testItem.data.null;
                let expectedDataLength = await rs.getMenuLength();

                // act
                let res = await rs.processRequest(testItem.command.delete, testItem.content.twoHundredOne);
                let actualDataLength = await rs.getMenuLength();

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
                assert.equal(expectedDataLength, actualDataLength); // Verify that nothing has been deleted from the database.
            });
        });

        // Test 14
        describe("Content is an Object but no a MenuItem - expect: status 400, error message, and null data", function () {
            it("ADD returns expected response.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundred;
                let expectedError = testItem.errorMessage.unrecognizedEntity;
                let expectedData = testItem.data.null;
                let expectedEntity = await rs.getItemByID(testItem.content.notMenuItemAdd.id);

                // act
                let res = await rs.processRequest(testItem.command.add, testItem.notMenuItemAdd);
                let actualEntity = await rs.getItemByID(testItem.content.notMenuItemAdd.id);

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
                assert.equal(expectedEntity, actualEntity); // Verify that nothing has been added to the database.
            });

            // Test 15
            it("DELETE returns expected response.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundred;
                let expectedError = testItem.errorMessage.unrecognizedEntity;
                let expectedData = testItem.data.null;
                let expectedEntity = await rs.getItemByID(testItem.content.notMenuItemDelete.id);

                // act
                let res = await rs.processRequest(testItem.command.delete, testItem.content.notMenuItemDelete);
                let actualEntity = await rs.getItemByID(testItem.content.notMenuItemDelete.id);

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
                assert.equal(expectedEntity.id, actualEntity.id); // Verify that the real entity has not been deleted from the database.
            });
            
            // Test 16
            it("UPDATE returns expected response.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundred;
                let expectedError = testItem.errorMessage.unrecognizedEntity;
                let expectedData = testItem.data.null;
                let expectedEntity = await rs.getItemByID(testItem.content.notMenuItemUpdate.id);

                // act
                let res = await rs.processRequest(testItem.command.update, testItem.content.notMenuItemUpdate);
                let actualEntity = await rs.getItemByID(testItem.content.notMenuItemUpdate.id);

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
                assert.equal(expectedEntity.id, actualEntity.id);                   // Verify that the real entity has not been changed in the database.
                assert.equal(expectedEntity.category, actualEntity.category);       // Verify that the real entity has not been changed in the database.
                assert.equal(expectedEntity.description, actualEntity.description); // Verify that the real entity has not been changed in the database.
                assert.equal(expectedEntity.price, actualEntity.price);             // Verify that the real entity has not been changed in the database.
                assert.equal(expectedEntity.vegetarian, actualEntity.vegetarian);   // Verify that the real entity has not been changed in the database.
            });
        });

        describe("Content is a MenuItem, but operation cannot be performed", function () {
            // Test 17
            it("ADD does not change dabatase, returns status 409, error message, and null data, if item already exists.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundredNine;
                let expectedError = testItem.errorMessage.entityAlreadyExists;
                let expectedData = testItem.data.null;
                let expectedMenuLength = await rs.getMenuLength();

                // act
                let res = await rs.processRequest(testItem.command.add, testItem.content.goodItem);
                let actualMenuLength = await rs.getMenuLength();

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
                assert.equal(expectedMenuLength, actualMenuLength); // Verify that database has not changed.
            });

            // Test 18
            it("DELETE does not change database, returns status 404, error message, and null data, if item does not exists.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundredFour;
                let expectedError = testItem.errorMessage.entityNotExistsDelete;
                let expectedData = testItem.data.null;
                let expectedMenuLength = await rs.getMenuLength();

                // act
                let res = await rs.processRequest(testItem.command.delete, testItem.content.itemNotExist);
                let actualMenuLength = await rs.getMenuLength();

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
                assert.equal(expectedMenuLength, actualMenuLength); // Verify that database has not changed.
            });

            // Test 19
            it("UPDATE does not change database, returns status 404, error message, and null data, if item does not exists.", async function () {
                // arrange
                let expectedStatus = testItem.statusCode.fourHundredFour;
                let expectedError = testItem.errorMessage.entityNotExistsUpdate;
                let expectedData = testItem.data.null;
                let expectedMenuLength = await rs.getMenuLength();

                // act
                let res = await rs.processRequest(testItem.command.update, testItem.content.itemNotExist);
                let actualMenuLength = await rs.getMenuLength();

                // assert
                assert.equal(expectedStatus, res.statusCode);
                assert.equal(expectedError, res.err);
                assert.equal(expectedData, res.data);
                assert.equal(expectedMenuLength, actualMenuLength); // Verify that database has not changed.
            });
        });
    });

    describe("Server Errors (500 series) - expect: status 500, error message, and null data", function () {
        before("Setup", async function(){
            Constants.DB_URI = "mongodb://localhost:99999"
            console.log("      <<SETUP: Connection URI corrupted.>>");
        });

        after("Setup", async function(){
            Constants.DB_URI = "mongodb://localhost:27017"
            console.log("      <<TEARDOWN: Connection URI repaired.>>");
        });
        
        // Test 20
        it("LIST returns expected response, if there is a server-side error", async function () {
            // arrange
            let expectedStatus = testItem.statusCode.fiveHundred;
            let expectedError = testItem.errorMessage.serverError;
            let expectedData = testItem.data.null;

            // act
            let res = await rs.processRequest(testItem.command.list, testItem.content.empty);

            // assert
            assert.equal(expectedStatus, res.statusCode);
            assert.equal(expectedError, res.err);
            assert.equal(expectedData, res.data);
        });

        // Test 21
        it("ADD returns expected response, if there is a server-side error.", async function () {
            // arrange
            let expectedStatus = testItem.statusCode.fiveHundred;
            let expectedError = testItem.errorMessage.serverError;
            let expectedData = testItem.data.null;

            // act
            let res = await rs.processRequest(testItem.command.add, testItem.content.goodItem);

            // assert
            assert.equal(expectedStatus, res.statusCode);
            assert.equal(expectedError, res.err);
            assert.equal(expectedData, res.data);
        });

        // Test 22
        it("DELETE returns expected response, if there is a server-side error.", async function () {
            // arrange
            let expectedStatus = testItem.statusCode.fiveHundred;
            let expectedError = testItem.errorMessage.serverError;
            let expectedData = testItem.data.null;

            // act
            let res = await rs.processRequest(testItem.command.delete, testItem.content.goodItem);

            // assert
            assert.equal(expectedStatus, res.statusCode);
            assert.equal(expectedError, res.err);
            assert.equal(expectedData, res.data);
        });

        // Test 23
        it("UPDATE returns expected response, if there is a server-side error.", async function () {
            // arrange
            let expectedStatus = testItem.statusCode.fiveHundred;
            let expectedError = testItem.errorMessage.serverError;
            let expectedData = testItem.data.null;

            // act
            let res = await rs.processRequest(testItem.command.update, testItem.content.goodItem);

            // assert
            assert.equal(expectedStatus, res.statusCode);
            assert.equal(expectedError, res.err);
            assert.equal(expectedData, res.data);
        });
    });
});

///*** HELPERS ***///
function defineTestItems() {
    return {
        // Inputs
        command: {
            list: rs.ACTIONS.LIST,
            add: rs.ACTIONS.ADD,
            delete: rs.ACTIONS.DELETE,
            update: rs.ACTIONS.UPDATE,
            empty: "",
            null: null,
            foo: "FOO",
            addd: "ADDD",
            ad: "AD"
        },
        content: {
            // Objects
            goodItem: new MenuItem(107, "", "", 0, false),
            itemToAdd: new MenuItem(888, "ENT", "poutine", 11, false),
            itemToDelete: new MenuItem(202, "", "", 30, false),
            itemToUpdate: new MenuItem(303, "ENT", "after update", 11, false),
            notMenuItemAdd: { id: 999, category: "DES", description: "apple crisp", price: 12, vegetarian: true },
            notMenuItemDelete: { id: 201, category: "ENT", description: "black cod", price: 21, vegetarian: false },
            notMenuItemUpdate: { id: 301, category: "DES", description: "wrong", price: -1, vegetarian: false },
            itemNotExist: new MenuItem(999, "ENT", "cheese bread", 20, false),
            
            // Non-objects
            empty: "",
            null: null,
            foo: "foo",
            twoHundredOne: 201
        },

        // Expected results
        statusCode: {
            twoHundred: 200,
            twoHundredOne: 201,
            fourHundred: 400,
            fourHundredFour: 404,
            fourHundredFive: 405,
            fourHundredNine: 409,
            fiveHundred: 500
        },
        errorMessage: {
            null: null,
            unknowOperation: "unknown operation",
            unrecognizedEntity: "unrecognized entity",
            entityAlreadyExists: "entity already exists - could not be added",
            entityNotExistsDelete: "entity does not exist - could not delete",
            entityNotExistsUpdate: "entity does not exist - could not update",
            serverError: "server error - please try again later",
        },
        data: {
            initialLength: Constants.NUM_MENUITEMS,
            true: true,
            null: null,
        },
    };
}