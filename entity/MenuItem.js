/**
 * Class to represent an item on a restaurant menu.
 */
class MenuItem {
    // your code here
    #id;
    #category;
    #description;
    #price;
    #vegetarian;

    constructor(inID, inCategory, inDescription, inPrice, inVegetarian){
        this.#id = inID;
        this.#category = inCategory;
        this.#description = inDescription;
        this.#price = inPrice;
        this.#vegetarian = inVegetarian;
    }

    get id(){
        return this.#id;
    }

    get category(){
        return this.#category;
    }

    get description(){
        return this.#description;
    }

    get price(){
        return this.#price;
    }

    get vegetarian(){
        return this.#vegetarian;
    }

    toJSON(){
        return {
            id: this.#id,
            category: this.#category,
            description: this.#description,
            price: this.#price,
            vegetarian: this.#vegetarian
        };
    }

    formatItem() {
        return `\t${this.#description} (ID: ${this.#id}): ${this.#price} ${
            this.#vegetarian ? " (veg)" : ""
        }`;
    }
} // end class

exports.MenuItem = MenuItem;