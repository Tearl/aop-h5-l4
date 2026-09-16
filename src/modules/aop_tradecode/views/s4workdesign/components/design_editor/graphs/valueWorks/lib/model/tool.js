import _ from 'lodash'
import Basic from './basic'
export default class Tools extends Basic {
    constructor(context){
        super(context)
    }

    cloneDeep(data){
        return _.cloneDeep(data)
    }
    resetNodeTools(){
        this.vm.actived = ''
        return this
    }

}