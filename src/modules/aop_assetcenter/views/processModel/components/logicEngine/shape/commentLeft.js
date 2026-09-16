import { CommentNode, CommentNodeModel } from './model/CommentNodeModel'
import { nodeType } from "../adapter/typeMap"

class customModel extends CommentNodeModel {
    getDefaultAnchor() {
        const { x, y, width: w, id } = this

        return [
            { x: x + w / 2, y: y }
        ].map((p, i) => ({
            ...p,
            id: [id, i].join('_')
        }))
    }

    initNodeData(data) {
        this.initDefaultData(data, 86, 38)
        super.initNodeData(data)
    }
}

class customView extends CommentNode {}

export default {
    type: nodeType.COMMENT_LEFT,
    view: customView,
    model: customModel
}
