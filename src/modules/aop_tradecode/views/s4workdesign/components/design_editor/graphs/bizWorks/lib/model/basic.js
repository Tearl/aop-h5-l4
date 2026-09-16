
export default class Basic {

    get dialog(){
        return this.ctx.vm.getDialog()
    }

    get store(){
        return this.ctx.store
    }

    get graph(){
        return this.ctx.graph
    }

    get node(){
        return this.ctx.node
    }

    get render(){
        return this.ctx.render
    }

    get edge(){
        return this.ctx.edge
    }

    get vm(){
        return this.ctx.vm
    }

    constructor(context){
        this.ctx = context
    }
}