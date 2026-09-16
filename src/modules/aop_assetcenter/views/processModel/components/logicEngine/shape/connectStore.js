import { h } from "@logicflow/core"
import RectNode from "./model/RectNode"
import RectNodeModel from './model/RectNodeModel'
import { nodeType } from "../adapter/typeMap"
import { getSvg } from '../utils'

class customModel extends RectNodeModel {
    getDefaultData() {
        return {
            fnName: "数据存储",
            fnClass: "16"
        }
    }

    initNodeData(data) {
        this.initDefaultData(data, 86, 42)
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
        const base = super.getShape()
        base.props.children[0].props.fill = "transparent"

        return h("g", {}, [
            getSvg({
                model,
                type: 'path',
                strokeWidth: 1,
            }, ({ width: w, height: t, offsetX: ox, offsetY: oy }) => {
                return {
                    d: `M ${10 + ox} ${oy}
                        L ${w + ox} ${oy}
                        Q ${w - 10 + ox} ${t / 2 + oy} ${w + ox} ${t + oy}
                        L ${w + ox} ${t + oy}
                        L ${10 + ox} ${t + oy}
                        Q ${ox} ${t / 2 + oy} ${10 + ox} ${oy}
                        L ${10 + ox} ${oy}
                        Z
                    `
                }
            }),
            base,
        ])
    }
}

export default {
    type: nodeType.CONNECT_STORE,
    view: customView,
    model: customModel
}
