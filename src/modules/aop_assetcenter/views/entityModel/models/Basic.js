export default class Basic {
    get graph() {
        return this.ctx.graph;
    }

    get vm() {
        return this.ctx.vm;
    }

    get store() {
        return this.ctx.store;
    }

    get designType() {
        return this.ctx.designType;
    }

    constructor(context) {
        this.ctx = context;
    }
}


