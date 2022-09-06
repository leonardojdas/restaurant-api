const path = require("path");

/**
 * Some useful constants
 *
 * @module Constants
 */

 const DB_URI = "mongodb://localhost:27017";
 const DB_NAME = "restaurantdb";
 const DB_COLLECTION = "menuitems";
 const NUM_MENUITEMS = 39;
 
 exports.Constants = {
     DB_URI: DB_URI,
     DB_NAME: DB_NAME,
     DB_COLLECTION: DB_COLLECTION,
     NUM_MENUITEMS: NUM_MENUITEMS,
 };
