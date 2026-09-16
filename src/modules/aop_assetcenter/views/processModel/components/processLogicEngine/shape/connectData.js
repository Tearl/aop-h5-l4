import { h } from "@logicflow/core"
import RectNode from "./model/RectNode"
import RectNodeModel from './model/RectNodeModel'
import { nodeType } from "../adapter/typeMap"

class customModel extends RectNodeModel {
    getDefaultData() {
        return {
            fnName: "调用数据",
            fnClass: "14"
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
                    points: `12,2 ${w - 2},2, ${w - 14},${t - 2}, 2,${t - 2}`
                })
            ]),
            base
        ])
    }
}

export default {
    type: nodeType.CONNECT_DATA,
    view: customView,
    model: customModel
}
