import { EventType } from '@logicflow/core'
import BasicManage from "./basicManage"
import { laneTypes, customEventType } from "../adapter/typeMap"
import { calcChildInParent } from '../utils'

export default class LaneManage extends BasicManage {
    constructor(context) {
        super(context)
        const lf = this.logic

        lf.on(EventType.BLANK_CLICK, this.hidePanelTrigger.bind(this))
        lf.on(EventType.ELEMENT_CLICK, this.elementClick.bind(this))
        lf.on(EventType.SELECTION_DROP, this.selectionDrop.bind(this))
        lf.on('group:add-node', this.groupAddNode.bind(this))
    }

    groupAddNode({ data }) {
        this.updateChildren(data)
        this.hidePanelTrigger()
    }

    elementClick({ data }) {
        if (laneTypes.includes(data.type)) {
            this.showPanelTrigger(data)
        } else {
            this.hidePanelTrigger()
        }
    }

    showPanelTrigger(data) {
        const isReadonly = this.logic.graphModel.editConfigModel.isSilentMode
        if (!isReadonly) {
            this.eventManage.emit(customEventType.LANE_SHOW_PANEL, data)
        }
    }

    hidePanelTrigger() {
        const isReadonly = this.logic.graphModel.editConfigModel.isSilentMode
        if (!isReadonly) {
            this.eventManage.emit(customEventType.LANE_HIDE_PANEL)
        }
    }

    updateChildren(data) {
        if (!laneTypes.includes(data?.type)) return

        const lf = this.logic
        const node = lf.graphModel.getNodeModelById(data.id)
        node?.updateStepChildren()
        node?.updateTrackChildren()
    }

    matchChildNodeInParentNode(parentNode, childNode) {
        return calcChildInParent({
            ...parentNode,
            ...parentNode.properties,
        }, {
            ...childNode,
            ...childNode.properties,
        })
    }

    selectionDrop() {
        // 批量选中拖拽释放后，判断元素是否在泳道内，以此决定是否设置为子节点
        const lf = this.logic
        const { nodes } = lf.graphModel.getSelectElements()
        const allNodes = lf.graphModel.nodes
        const allLanes = allNodes.filter(
            e => laneTypes.includes(e.type)
        )

        allLanes.forEach(ln => {
            nodes.forEach(n => {
                if (!laneTypes.includes(n.type)) {
                    const isIn = this.matchChildNodeInParentNode(ln, n)
                    if (isIn) {
                        ln.addChild(n.id)
                    } else {
                        ln.removeChild(n.id)
                    }
                }
            })
        })
    }

    switchLaneType(id, type) {
        const lf = this.logic
        lf.graphModel.changeNodeType(id, type)
        const node = lf.graphModel.getNodeModelById(id)
        const { x, y, properties: { width, height, stepGroup, trackGroup } } = node.getData()
        const [nw, nh] = [height, width]
        const [nx, ny] = [x + (nw - width) / 2, y + (nh - height) / 2]
        const newStepGroup = stepGroup.map(({ id, name, size }) => ({ id, name, size }))
        const newTrackGroup = trackGroup.map(({ id, name, size }) => ({ id, name, size }))

        node.x = nx
        node.y = ny
        node.setProperties({
            width: nw,
            height: nh,
            stepGroup: newStepGroup,
            trackGroup: newTrackGroup,
        })
        node.refresh()
    }
}
