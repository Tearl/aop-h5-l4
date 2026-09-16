
export default class Store {

    constructor(){
        this.store = Object.create(null)
    }

    set(key, value){
        this.store[key] = value
    }

    get(key){
        let res = this.store[key]
        if(!res){
            console.error('not found anything from the stroe')
        }
        return res
    }

    remove(key){
        let result = this.get(key)
        delete this.store[key]
        return result
    }

    updateKey(oldKey, newKey){
        let value = this.get(oldKey)
        this.remove(oldKey)
        this.set(newKey, value)
        return value
    }
}