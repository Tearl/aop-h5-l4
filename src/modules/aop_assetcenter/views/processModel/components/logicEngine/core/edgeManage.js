import { EventType } from '@logicflow/core'
import BasicManage from "./basicManage"
import { logger, isDebugEnv } from '../utils'
import { solidTypes, commentTypes } from "../adapter/typeMap"

export default class EdgeManage extends BasicManage {
    constructor(context) {
        super(context)
        const lf = this.logic
        lf.on(EventType.EDGE_ADD, this.edgeAdd.bind(this))
        lf.on(EventType.EDGE_CLICK, this.edgeClick.bind(this))
    }

    edgeAdd({ data }) {
        // 判断连接节点是否为横线段或者竖线段
        const { id, type, sourceNodeId, targetNodeId } = data
        const lf = this.logic
        const allNodes = lf.graphModel.nodes

        if (this.removeExcessEdge(id, sourceNodeId, targetNodeId)) return

        if (type !== 'polyline') return

        const isConnection = allNodes.some(
            n => [sourceNodeId, targetNodeId].includes(n.id)
                && solidTypes.includes(n.type)
        )

        const isExplain = allNodes.some(
            n => [sourceNodeId, targetNodeId].includes(n.id)
                && commentTypes.includes(n.type)
        )

        // 当该连接线连上了线段，则切换为直线
        if (isConnection) {
            lf.graphModel.changeEdgeType(id, 'line')
        }

        // 当直线又为注释的连线时
        if (isExplain) {
            lf.graphModel.changeEdgeType(id, 'connectLine')
        }
    }

    removeExcessEdge(id, sourceNodeId, targetNodeId) {
        const lf = this.logic
        const allEdges = lf.graphModel.edges

        // 禁止自己连接自己
        if (sourceNodeId === targetNodeId) {
            lf.graphModel.deleteEdgeById(id)
            return true
        }

        // 禁止重复连接相同节点
        const hasSame = allEdges.some(
            (e) => {
                if (id === e.id) return false
                return e.sourceNodeId === sourceNodeId && e.targetNodeId === targetNodeId
            }
        )

        if (hasSame) {
            lf.graphModel.deleteEdgeById(id)
            return true
        }

        return false
    }

    edgeClick({ data }) {
        if (isDebugEnv()) {
            const edge = this.logic.graphModel.getEdgeModelById(data.id)
            logger("🚀 ~ EdgeManage ~ edgeClick:", edge, data)
        }
    }
}
