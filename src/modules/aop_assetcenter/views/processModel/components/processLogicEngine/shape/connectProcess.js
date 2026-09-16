import { h } from "@logicflow/core"
import RectNode from "./model/RectNode"
import RectNodeModel from './model/RectNodeModel'
import { nodeType } from "../adapter/typeMap"

class customModel extends RectNodeModel {
    getDefaultData() {
        return {
            fnName: "子流程",
            fnClass: "09"
        }
    }

    initNodeData(data) {
        this.initDefaultData(data, 86, 38)
        super.initNodeData(data)
        this.radius = 2
    }
}

class customView extends RectNode {
    getShape() {
        let { model } = this.props
        let { x, y, width: w, height: t } = model
        let { properties } = model.getData()
        let style = model.getNodeStyle()

        const g = 10

        return h('g', {}, [
            super.getShape(),
            h('line', {
                x1: x - w / 2 + g,
                y1: y - t / 2,
                x2: x - w / 2 + g,
                y2: y + t / 2,
                ...style
            }),
            h('line', {
                x1: x + w / 2 - g,
                y1: y - t / 2,
                x2: x + w / 2 - g,
                y2: y + t / 2,
                ...style
            })
        ])
    }
}

export default {
    type: nodeType.CONNECT_PROCESS,
    view: customView,
    model: customModel
}
