
export default class Basic {

    get dialog(){
        return this.ctx.vm.getDialog()
    }

    get vm(){
        return this.ctx.vm
    }

    get graph(){
        return this.ctx.graph
    }

    get node(){
        return this.ctx.node
    }

    get region(){
        return this.ctx.region
    }

    get tool(){
        return this.ctx.tool
    }

    get preview(){
        return this.ctx.preview
    }

    get store(){
        return this.ctx.store
    }

    get edge(){
        return this.ctx.edge
    }

    constructor(context){
        this.ctx = context
    }
}