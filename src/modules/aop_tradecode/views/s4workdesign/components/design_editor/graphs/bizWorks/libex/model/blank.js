
import Basic from './basic'
export default class Blank extends Basic {

    constructor(context){
        super(context)
    }

    click(){
        this.tool.resetNodeTools()
        this.tool.resetEdgeTools()
    }
}