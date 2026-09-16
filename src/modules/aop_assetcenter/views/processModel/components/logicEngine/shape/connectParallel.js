import { h } from "@logicflow/core"
import RectNode from "./model/RectNode"
import RectNodeModel from './model/RectNodeModel'
import { nodeType } from "../adapter/typeMap"

class customModel extends RectNodeModel {
    minWidth = 60
    minHeight = 18

    getDefaultData() {
        return {
            fnName: "并行",
            fnClass: "12"
        }
    }

    getDefaultAnchor() {
        const { x, y, width: w, height: h, id } = this

        return [
            { x: x, y: y - h / 2 },
            { x: x - w * 1 / 6, y: y - h / 2 },
            { x: x - w * 2 / 6, y: y - h / 2 },
            { x: x + w * 1 / 6, y: y - h / 2 },
            { x: x + w * 2 / 6, y: y - h / 2 },

            { x: x, y: y + h / 2 },
            { x: x - w * 1 / 6, y: y + h / 2 },
            { x: x - w * 2 / 6, y: y + h / 2 },
            { x: x + w * 1 / 6, y: y + h / 2 },
            { x: x + w * 2 / 6, y: y + h / 2 },
        ].map((p, i) => ({
            ...p,
            id: [id, i].join('_')
        }))
    }

    initNodeData(data) {
        this.initDefaultData(data, 86, 38)
        super.initNodeData(data)
    }

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
            h("line", {
                x1: x - w / 2,
                y1: y - t / 2,
                x2: x + w / 2,
                y2: y - t / 2,
                ...style,
                stroke: "#239edd",
                strokeWidth: 2,
            }),
            h('line', {
                x1: x - w / 2,
                y1: y + t / 2,
                x2: x + w / 2,
                y2: y + t / 2,
                ...style,
                stroke: "#239edd",
                strokeWidth: 2,
            }),
            base,
        ])
    }
}


export default {
    type: nodeType.CONNECT_PARALLEL,
    view: customView,
    model: customModel
}
