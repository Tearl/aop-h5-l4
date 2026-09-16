import { h } from "@logicflow/core"
import RectNode from "./model/RectNode"
import RectNodeModel from './model/RectNodeModel'
import { nodeType } from "../adapter/typeMap"

class customModel extends RectNodeModel {
    getDefaultData() {
        return {
            fnName: "竖线段",
            fnClass: "11"
        }
    }

    getDefaultAnchor() {
        const { x, y, width: w, height: h, id } = this

        return [
            { x: x, y: y - h / 2 },
            { x: x, y: y + h / 2 },

            { x: x - w / 2, y: y },
            { x: x - w / 2, y: y - h * 1 / 6 },
            { x: x - w / 2, y: y - h * 2 / 6 },
            { x: x - w / 2, y: y + h * 1 / 6 },
            { x: x - w / 2, y: y + h * 2 / 6 },

            { x: x + w / 2, y: y },
            { x: x + w / 2, y: y - h * 1 / 6 },
            { x: x + w / 2, y: y - h * 2 / 6 },
            { x: x + w / 2, y: y + h * 1 / 6 },
            { x: x + w / 2, y: y + h * 2 / 6 },
        ].map((p, i) => ({
            ...p,
            id: [id, i].join('_')
        }))
    }

    initNodeData(data) {
        this.initDefaultData(data, 32, 94)
        super.initNodeData(data)
        this.text = {}
        this.editable = false
    }

    formatText() {}

    getNodeStyle() {
        const style = super.getNodeStyle()
        style.stroke = ""
        return style
    }
}

class customView extends RectNode {
    createText() {
        return null
    }

    getShape() {
        let { model } = this.props
        let { x, y, width: w, height: t } = model
        let { properties } = model.getData()
        let style = model.getNodeStyle()
        const base = super.getShape()
        base.props.children[0].props.fill = "transparent"

        return h('g', {}, [
            h('line', {
                x1: x,
                y1: y - t / 2 + 4,
                x2: x,
                y2: y + t / 2 - 4,
                ...style,
                stroke: "#239edd",
                strokeWidth: "6"
            }),
            base,
        ])
    }
}

export default {
    type: nodeType.SOLID_VERTICAL,
    view: customView,
    model: customModel
}
