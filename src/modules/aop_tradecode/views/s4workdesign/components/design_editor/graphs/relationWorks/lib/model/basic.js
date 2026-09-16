
export default class Basic {

    get options(){
        return this.ctx.options
    }

    get dialog(){
        return this.ctx.vm.$refs.dialog
    }

    get vm(){
        return this.ctx.vm
    }

    get graph(){
        return this.ctx.graph
    }

    get tool(){
        return this.ctx.tool
    }

    get region(){
        return this.ctx.region
    }

    get node(){
        return this.ctx.node
    }

    constructor(context){
        this.ctx = context
    }
}