
export default class Basic {

    get vm(){
        return this.ctx.vm
    }

    get graph(){
        return this.ctx.graph
    }

    get blank(){
        return this.ctx.blank
    }

    get edge(){
        return this.ctx.edge
    }

    get node(){
        return this.ctx.node
    }

    get tool(){
        return this.ctx.tool
    }

    get store(){
        return this.ctx.store
    }

    get render(){
        return this.ctx.render
    }

    constructor(context){
        this.ctx = context
    }
}