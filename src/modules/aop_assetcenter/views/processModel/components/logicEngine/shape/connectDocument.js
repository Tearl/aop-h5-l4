import { h } from '@logicflow/core'
import RectNode from "./model/RectNode"
import RectNodeModel from './model/RectNodeModel'
import { nodeType } from "../adapter/typeMap"
import { getSvg } from '../utils'

class customModel extends RectNodeModel {
    getDefaultData() {
        return {
            fnName: "文档",
            fnClass: "15"
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
                    d: `
                        M ${w + ox} ${t - 5 + oy}
                        L ${w + ox} ${oy}
                        L ${ox} ${oy}
                        L ${ox} ${t - 5 + oy}
                        Q ${w / 4 + ox} ${t + 2 + oy} ${w / 2 + ox} ${t - 5 + oy}
                        L ${w / 2 + ox} ${t - 5 + oy}
                        Q ${w / 4 * 3 + ox} ${t - 10 + oy} ${w + ox} ${t - 5 + oy}
                        Z
                    `
                }
            }),
            base,
        ])
    }
}

export default {
    type: nodeType.CONNECT_DOCUMENT,
    view: customView,
    model: customModel
}
