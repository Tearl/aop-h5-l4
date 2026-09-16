
export default class BasicManage {
    constructor(context) {
        this.context = context
    }

    get logic() {
        return this.context.logic
    }

    get nodeManage() {
        return this.context.nodeManage
    }

    get edgeManage() {
        return this.context.edgeManage
    }

    get textManage() {
        return this.context.textManage
    }

    get keyboardManage() {
        return this.context.keyboardManage
    }

    get shortcutManage() {
        return this.context.shortcutManage
    }

    get laneManage() {
        return this.context.laneManage
    }

    get contextmenuManage() {
        return this.context.contextmenuManage
    }

    get eventManage() {
        return this.context.eventManage
    }
}
