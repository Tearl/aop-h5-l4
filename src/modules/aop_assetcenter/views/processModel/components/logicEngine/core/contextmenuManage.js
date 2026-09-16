import { EventType, } from '@logicflow/core'
import BasicManage from "./basicManage"
import { laneTypes, solidTypes, customEventType, processType } from "../adapter/typeMap"
import { checkPointInGroup } from "../utils"

export default class ContextmenuManage extends BasicManage {
    constructor(context) {
        super(context)
        const lf = this.logic

        lf.on(EventType.SELECTION_CONTEXTMENU, this.selectionContextmenu.bind(this))
        lf.on(EventType.NODE_CONTEXTMENU, this.nodeContextmenu.bind(this))
    }

    nodeContextmenu({ data, position }) {
        const nodeData = data.properties?.data
        const lf = this.logic
        const isLane = laneTypes.includes(data.type)
        const contextmenuPoz = position.canvasOverlayPosition
        const { stepGroup, trackGroup } = data.properties
        const matchStep = checkPointInGroup(contextmenuPoz, stepGroup)
        const matchTrack = checkPointInGroup(contextmenuPoz, trackGroup)

        lf.extension.menu.setMenuByType({
            type: data.type,
            menu: [
                {
                    text: "编排流程段",
                    callback: () => {
                        this.eventManage.emit(customEventType.NODE_CONFIG, data)
                    }
                },
                // solidTypes.includes(data.type) ? null : {
                //     text: "编辑文本",
                //     callback: () => {
                //         (nodeData.fnStatus !='02' && nodeData.fnStatus != '03') && lf.graphModel.editText(data.id)
                //     }
                // },
                // processType.includes(data.type) && nodeData.processId ? {
                //     text: "查看流程段",
                //     callback: () => {
                //         (nodeData.processId) && this.eventManage.emit(customEventType.CUSTOM_PROCESS_CLICK, data)
                //     }
                // } : null,
                
                isLane ? {
                    text: "选中全部子节点",
                    callback: () => {
                        this.nodeManage.selectNodesByIds(data.children)
                    }
                } : null,
                matchTrack ? {
                    text: "选中当前泳道子节点",
                    callback: () => {
                        this.nodeManage.selectNodesByIds(matchTrack.children)
                    }
                } : null,
                matchStep ? {
                    text: "选中当前阶段子节点",
                    callback: () => {
                        this.nodeManage.selectNodesByIds(matchStep.children)
                    }
                } : null,
                {
                    text: "删除",
                    callback: () => {
                        lf.deleteNode(data.id)
                    }
                }
            ].filter(Boolean)
        })
    }

    selectionContextmenu() {
        const lf = this.logic

        lf.extension.menu.setMenuByType({
            type: "lf:defaultSelectionMenu",
            menu: [
                {
                    text: "删除",
                    callback: ({ nodes, edges }) => {
                        edges.forEach(e => {
                            lf.deleteEdge(e.id)
                        })

                        nodes.forEach(n => {
                            lf.deleteNode(n.id)
                        })
                    }
                },
            ].filter(Boolean),
        })
    }
}
