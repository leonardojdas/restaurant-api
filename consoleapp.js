/**
 * Hide MenuItemAccessor; use RestaurantService instead.
 */

const readline = require("readline");
const util = require("util");
const { MenuItem } = require("./entity/MenuItem");
const api = require("./api/RestaurantService");

main();

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const question = util.promisify(rl.question).bind(rl);

    while (true) {
        let command = await question("Enter a command (or 'help'): ");
        if (command === "help") {
            showCommands();
        } else if (command === "quit") {
            break;
        } else if (command === "list") {
            let resp = await api.processRequest("LIST", null);
            console.log("  Status: " + resp.statusCode);
            if (resp.err) {
                console.log("  Response: " + resp.err);
            } else {
                let items = resp.data;
                console.log("  Response:");
                items.forEach((item) => console.log(item.formatItem()));
            }
        } else if (command === "add") {
            let obj = await getObjectToAddOrUpdate(question);
            let resp = await api.processRequest("ADD", obj);
            console.log("  Status: " + resp.statusCode);
            if (resp.err) {
                console.log("  Response: " + resp.err);
            } else {
                let ok = resp.data;
                console.log(
                    "  Response: Add operation " + (ok ? "succeeded" : "failed")
                );
            }
        } else if (command === "delete") {
            let obj = await getObjectToDelete(question);
            let resp = await api.processRequest("DELETE", obj);
            console.log("  Status: " + resp.statusCode);
            if (resp.err) {
                console.log("  Response: " + resp.err);
            } else {
                let ok = resp.data;
                console.log(
                    "  Response: Delete operation " +
                        (ok ? "succeeded" : "failed")
                );
            }
        } else if (command === "update") {
            let obj = await getObjectToAddOrUpdate(question);
            let resp = await api.processRequest("UPDATE", obj);
            console.log("  Status: " + resp.statusCode);
            if (resp.err) {
                console.log("  Response: " + resp.err);
            } else {
                let ok = resp.data;
                console.log("  Data:");
                console.log(
                    "  Response: Update operation " +
                        (ok ? "succeeded" : "failed")
                );
            }
        } else {
            console.log(`  '${command}' is not a recognized command.`);
        }
    } // end loop

    rl.close();
}

function showCommands() {
    console.log();
    console.log("  list");
    console.log("  add");
    console.log("  delete");
    console.log("  update");
    console.log("  quit");
    console.log();
}

async function getObjectToAddOrUpdate(rlFunc) {
    let id = Number(await rlFunc("Enter the ID: "));
    let cat = await rlFunc("Enter the category: ");
    let desc = await rlFunc("Enter the description: ");
    let price = Number(await rlFunc("Enter the price: "));
    let vegStr = await rlFunc("Is the item vegetarian (Y/N): ");
    let veg = vegStr === "Y" || vegStr === "y";
    return new MenuItem(id, cat, desc, price, veg);
}

async function getObjectToDelete(rlFunc) {
    let id = Number(await rlFunc("Enter the ID: "));
    let obj = new MenuItem(id, "", "", 0, true); // dummy object
    return obj;
}
