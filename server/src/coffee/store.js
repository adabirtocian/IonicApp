import dataStore from 'nedb-promise';

export class CoffeeStore {
    constructor({ filename, autoload }) {
        this.store = dataStore({ filename, autoload });
    }

    async find(props) {
        console.log(props);
        return this.store.find(props);
    }

    async findOne(props) {
        return this.store.findOne(props);
    }

    async insert(coffee) {
        let coffeeOrigin = coffee.originName;
        if (!coffeeOrigin) { // validation
            throw new Error('Missing originName property')
        }
        return this.store.insert(coffee);
    };

    async update(props, coffee) {
        return this.store.update(props, coffee);
    }

    async remove(props) {
        return this.store.remove(props);
    }
}

export default new CoffeeStore({ filename: './db/coffees.json', autoload: true });
