import { h } from "@logicflow/core"
import RectNode from "./model/RectNode"
import RectNodeModel from './model/RectNodeModel'
import { nodeType } from "../adapter/typeMap"

class customModel extends RectNodeModel {
    getDefaultData() {
        return {
            fnName: "判断",
            fnClass: "03"
        }
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
    getShape() {
        const { model } = this.props
        const { x, y, width: w, height: t } = model
        const base = super.getShape()
        base.props.children[0].props.fill = "transparent"

        return h("g", {}, [
            h("svg", {
                x: x - w / 2,
                y: y - t / 2,
                width: w,
                height: t,
                viewBox: `0 0 ${w} ${t}`,
            }, [
                h("polygon", {
                    fill: "#FFF",
                    strokeWidth: 1,
                    stroke: "#239edd",
                    points: `${w / 2},1 ${w - 1},${ t / 2}, ${w / 2},${t - 1}, 1,${t / 2}`
                })
            ]),
            base
        ])
    }
}

export default {
    type: nodeType.CONNECT_CONDITION,
    view: customView,
    model: customModel
}
