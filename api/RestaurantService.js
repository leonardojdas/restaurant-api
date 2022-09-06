const mia = require("../db/MenuItemAccessor");
const {MenuItem} = require("../entity/MenuItem");

/**
 * @param {string} action - the action to perform: one of LIST, ADD, UPDATE, DELETE
 * @param {MenuItem object} content - the object to be added, updated, or deleted; null for LIST requests.
 * @returns {object} - an object containing three fields: statusCode, err, data. As per convention,
 *                     only one of err or data will be populated.
 */

async function processRequest(action, content) {
    let res = null;

    // your code here
    switch(action){
        case ACTIONS.LIST:
            res = listItems();
            break;
        case ACTIONS.ADD:
            res = addItem(content);
            break;
        case ACTIONS.UPDATE:
            res = updateItem(content);
            break;
        case ACTIONS.DELETE:
            res = deleteItem(content);
            break;
        default:
            res = responseObject(405, `unknown operation`, null);
    }

    return res;
}

async function listItems(){
    let res = null;
    try{
        let items = await mia.getAllItems();
        res = responseObject(200, null, items);
    } catch(err) {
        res = responseObject(500, `server error - please try again later`, null);
    }
    return res;
}

async function addItem(content){
    let res = null;
    if(!(content instanceof MenuItem)){
        res = responseObject(400, `unrecognized entity`, null);
    } else {
        try {
            if(await mia.addItem(content)) res = responseObject(201, null, true);
            else res = responseObject(409, `entity already exists - could not be added`, null);
        } catch(err) {
            res = responseObject(500, `server error - please try again later`, null);
        }
    }
    return res;
}

async function updateItem(content){
    let res = null;
    if(!(content instanceof MenuItem)){
        res = responseObject(400, `unrecognized entity`, null);
    } else {
        try {
            if(await mia.updateItem(content)) res = responseObject(200, null, true);
            else res = responseObject(404, `entity does not exist - could not update`, null);
        } catch(err) {
            res = responseObject(500, `server error - please try again later`, null);
        }
    }
    return res;
}

async function deleteItem(content){
    let res = null;
    if(!(content instanceof MenuItem)){
        res = responseObject(400, `unrecognized entity`, null);
    } else {
        try {
            if(await mia.deleteItem(content)) res = responseObject(200, null, true);
            else res = responseObject(404, `entity does not exist - could not delete`, null);
        } catch (err) {
            res = responseObject(500, `server error - please try again later`, null);   
        }
    }
    return res;
}

function responseObject(statusCode, err, data){
    return {
        statusCode: statusCode,
        err: err,
        data: data
    };
}

// Auxiliar functions - test.js cannot access the connector Mongo layer (MenuItemAcessor)
// this is realized only by RestaurantService API

async function getItemByID(itemID){
    let res = null;
    try {
        res = await mia.getItemByID(itemID);
    } catch (err) {
        res = err;
    }
    return res;
}

async function getMenuLength(){
    let res = null;
    try {
        res = (await mia.getAllItems()).length;
    } catch (err) {
        res = err;
    }
    return res;
}

const ACTIONS = {
    LIST: "LIST",
    ADD: "ADD",
    UPDATE: "UPDATE",
    DELETE: "DELETE"
};

exports.processRequest = processRequest;
exports.getItemByID = getItemByID;
exports.getMenuLength = getMenuLength;
exports.ACTIONS = ACTIONS;