import { h } from "@logicflow/core"
import RectNode from "./model/RectNode"
import RectNodeModel from './model/RectNodeModel'
import { nodeType } from "../adapter/typeMap"

class customModel extends RectNodeModel {
    getDefaultData() {
        return {
            fnName: "横线段",
            fnClass: "10"
        }
    }

    getDefaultAnchor() {
        const { x, y, width: w, height: h, id } = this

        return [
          { x: x - w / 2, y: y },
          { x: x + w / 2, y: y },

          { x: x, y: y - h / 2 },
          { x: x - w * 1 / 6, y: y - h / 2 },
          { x: x - w * 2 / 6, y: y - h / 2 },
          { x: x + w * 1 / 6, y: y - h / 2 },
          { x: x + w * 2 / 6, y: y - h / 2 },

          { x: x, y: y + h / 2, },
          { x: x - w * 1 / 6, y: y + h / 2, },
          { x: x - w * 2 / 6, y: y + h / 2, },
          { x: x + w * 1 / 6, y: y + h / 2, },
          { x: x + w * 2 / 6, y: y + h / 2, },
        ].map((p, i) => ({
            ...p,
            id: [id, i].join('_')
        }))
    }

    formatText() {}

    initNodeData(data) {
        this.initDefaultData(data, 94, 32)
        super.initNodeData(data)
        this.text = {}
        this.editable = false
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
            h('line', {
                x1: x - w / 2 + 4,
                y1: y,
                x2: x + w / 2 - 4,
                y2: y,
                ...style,
                stroke: "#239edd",
                strokeWidth: "6"
            }),
            base,
        ])
    }
}

export default {
    type: nodeType.SOLID_HORIZONTAL,
    view: customView,
    model: customModel
}
