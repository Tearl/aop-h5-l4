
import * as utils from './utils'

export default class Adapter {
    constructor(logic) {
        logic.adapterIn = this.adapterIn
        logic.adapterOut = this.adapterOut
    }

    adapterIn(userData) {
        const { laneGroupInfoList = [], flowNodeInfos = [], nodeRels = [] } = userData

        const laneNodes = laneGroupInfoList.map(lane => {
            return utils.getInLaneItem(lane, this)
        })

        const normalNodes = flowNodeInfos.map(node => {
            return utils.getInNodeItem(node)
        })

        const edgeValid = (id) => normalNodes.some(node => node.id === id)

        const edges = nodeRels.filter((e) => {
            return edgeValid(e.curFnId) && edgeValid(e.tgtFnId)
        }).map(origin => {
            return utils.getInEdgeItem(normalNodes, origin)
        }).filter(Boolean)

        return {
            nodes: [
                ...laneNodes,
                ...normalNodes
            ],
            edges
        }
    }

    adapterOut(logicFlowData) {
        const { nodes, edges } = logicFlowData
        const flowNodeInfos = []
        const laneGroupInfoList = []
        const nodeRels = []

        nodes.forEach(node => {
            const { properties } = node

            if (["laneGroup", "lane"].includes(properties.data.fnClass)) {
                const result = utils.getOutLaneItem(node, properties)
                laneGroupInfoList.push(result)
            } else {
                const result = utils.getOutNodeItem(node, properties)
                flowNodeInfos.push(result)
            }
        })

        edges.forEach(edge => {
            const result = utils.getOutEdgeItem(this.graphModel, edge)
            nodeRels.push(result)
        })

        return {
            flowNodeInfos,
            laneGroupInfoList,
            nodeRels
        }
    }
}
