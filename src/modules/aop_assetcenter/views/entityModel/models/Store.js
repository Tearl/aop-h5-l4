export default class Store {
    constructor() {
        this.store = Object.create(null);
    }

    set(key, value) {
        this.store[key] = value;
    }

    get(key) {
        return this.store[key];
    }

    remove(key) {
        let result = this.get(key);
        delete this.store[key];
        return result;
    }

    updateKey(oldKey, newKey) {
        let value = this.get(oldKey);
        this.remove(oldKey);
        this.set(newKey, value);
        return value;
    }
}


