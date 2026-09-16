import { EventType, } from '@logicflow/core'
import { customEventType, laneTypes } from "../adapter/typeMap"
import { logger, isDebugEnv, calcChildInParent } from '../utils'
import BasicManage from "./basicManage"

export default class NodeManage extends BasicManage {
    constructor(context) {
        super(context)
        const lf = this.logic
        this.selectedNodeIds = []

        lf.on(EventType.NODE_CLICK, this.nodeClick.bind(this))
        lf.on(EventType.BLANK_CLICK, this.blankClick.bind(this))
        lf.on(EventType.NODE_ROTATE, this.nodeRotate.bind(this))
        lf.on(EventType.NODE_ADD, this.nodeAdd.bind(this))
        lf.on(EventType.NODE_DND_ADD, this.nodeDndAdd.bind(this))
        // 屏蔽双击修改文字事件
        lf.on(EventType.NODE_DBCLICK, this.nodeDblclick.bind(this)) 
        // 添加节点拖拽事件监听
        lf.on(EventType.NODE_DRAG, this.nodeDrag.bind(this))
        lf.on('selection:selected', this.selectionUp.bind(this))
    }
    nodeDrag({ data }) {
        console.log(data, 'nodeDrag')
        const lf = this.logic
        const node = lf.graphModel.getNodeModelById(data.id)
    
        try {
        // 为了防止节点完全贴边，保留一些边距
        const padding = 10;
        
        // 获取节点尺寸信息
        const nodeWidth = node._width || 100;
        const nodeHeight = node._height || 40;
        
        // 获取画布偏移量
        const { TRANSLATE_X, TRANSLATE_Y } = lf.graphModel.transformModel;
        
        // 计算可视区域的左侧和顶部边界（相对于画布坐标系）
        // 可视区域左上角在画布坐标系中的位置 = -画布偏移量 + 内边距
        const leftBoundary = -TRANSLATE_X + padding;
        const topBoundary = -TRANSLATE_Y + padding;
        
        // 计算节点中心点的最小可允许坐标
        // 节点中心点需要在可视区域内，所以要考虑节点的尺寸
        const limitedX = leftBoundary + nodeWidth / 2;
        const limitedY = topBoundary + nodeHeight / 2;

        // 获取节点当前实际位置
            const currentX = node.x;
            const currentY = node.y;
        // 检查是否超出边界
        if (currentX <= limitedX) {
            node.x = limitedX;
            data.x = limitedX;
        }
        if (currentY <= limitedY) {
            node.y = limitedY;
            data.y = limitedY;
        }
        } catch (error) {
        console.error('节点拖拽边界限制出错:', error);
        }
    }
    nodeDblclick({ data }) {
        const isReadonly = this.logic.graphModel.editConfigModel.isSilentMode
        if (isReadonly) {
            this.eventManage.emit(customEventType.NODE_CONFIG, data)
        }
    }

    selectionUp({ leftTopPoint, rightBottomPoint }) {
        const {
            transformModel: { TRANSLATE_X, TRANSLATE_Y },
        } = this.logic.graphModel

        const startPoint = {
            x: leftTopPoint[0] - TRANSLATE_X,
            y: leftTopPoint[1] - TRANSLATE_Y,
        }

        const endPoint = {
            x: rightBottomPoint[0] - TRANSLATE_X,
            y: rightBottomPoint[1] - TRANSLATE_Y,
        }

        // 获取选区
        const rect = {
            x: (startPoint.x + endPoint.x) / 2,
            y: (startPoint.y + endPoint.y) / 2,
            width: Math.abs(endPoint.x - startPoint.x),
            height: Math.abs(endPoint.y - startPoint.y),
        }

        // 遍历所有节点并选中
        const allNodes = this.logic.graphModel.nodes
        allNodes.forEach(node => {
            const isInRect = calcChildInParent(rect, node)
            if (isInRect) {
                this.selectedNodeIds.push(node.id)
            }
        })

        this.updateSelection()
    }

    cancelNodesSelected() {
        this.selectedNodeIds = []
        this.logic.clearSelectElements()
    }

    nodeRotate({ data }) {
        const step = 15
        const deg = data.rotate / Math.PI * 180

        const node = this.logic.getModelById(data.id)
        const remainder = deg % step
        const base = deg - remainder
        const result = remainder > step / 2 ? base + step : base
        const resultSize = result / 180 * Math.PI
        node.updateAttributes({
            rotate: resultSize
        })
    }

    updateNodeData(data) {
        const lf = this.logic
        const node = lf.graphModel.getNodeModelById(data.fnId)
        node.setProperties({ data })
    }

    nodeDblclick({ data }) {
        // const lf = this.logic
        // const isSilentMode = lf.graphModel.editConfigModel.isSilentMode

        // if (isSilentMode) {
        //     this.eventManage.emit(customEventType.NODE_CONFIG, data)
        // }
        this.eventManage.emit(customEventType.NODE_DBLCLICK, data)
    }

    nodeClick({ data }) {
        console.log("????????", data);
        logger("🚀 ~ NodeManage ~ nodeClick:", data)
        if (isDebugEnv()) {
            this.logic.getNodeModelById(data.id).setProperty('isDev', true) // 泳道测试专用
        }

        const nodeId = data.id

        if (this.keyboardManage.isAltOrCmdPressed) {
            if (this.selectedNodeIds.includes(nodeId)) {
                this.selectedNodeIds = this.selectedNodeIds.filter(id => {
                    return id !== nodeId
                })
            } else {
                this.selectedNodeIds.push(nodeId)
            }

            this.laneManage.hidePanelTrigger()
        } else {
            this.selectedNodeIds = [nodeId]
        }

        this.updateSelection()

        if (!laneTypes.includes(data.type)) {
            this.logic.updateEditConfig({
                hideAnchors: true,
            })
        } else {
            this.logic.updateEditConfig({
                hideAnchors: false,
            })
        }

        // 点击节点
        this.eventManage.emit(customEventType.NODE_CLICK, { data })
    }

    selectNodesByIds(ids = []) {
        this.selectedNodeIds = ids
        this.updateSelection()
    }

    updateSelection() {
        const lf = this.logic
        // 获取所有节点
        const allNodes = lf.graphModel.nodes
        // 获取所有连接线
        const allEdges = lf.graphModel.edges

        allNodes.forEach(el => {
            el.setSelected(this.selectedNodeIds.includes(el.id))
        })

        // 动态选择节点所包含的连接线
        allEdges.forEach(el => {
            const should = [el.sourceNodeId, el.targetNodeId].every(
                id => this.selectedNodeIds.includes(id)
            )
            el.setSelected(should)
        })
    }

    nodeDndAdd(data) {
        this.nodeAdd(data)
    }

    nodeAdd({ data }) {
        const lf = this.logic
        const node = lf.graphModel.getNodeModelById(data.id)
        if (!node) return
        // console.log({...node.properties.data}, 'properties.data-----')
        // this.nodeTextChange(node)
        node.setProperties({
            data: {
                ...node.properties.data,
                fnId: node.id,
            },
            laneGroup: null,
        })
    }

    /**
     * 判断是什么节点，给节点文本赋值文本 
     */
    nodeTextChange(newNode) {
        const lf = this.logic
        // 获取所有节点
        const allNodes = lf.graphModel.nodes
        const newNodeName = newNode.properties.data?.fnName;

        console.log(newNodeName, 'newNodeName-----')
        if (!newNodeName) return;

        // 统计同名节点数量
        let nameCount = 0;
        allNodes.forEach(node => {
            const nodeName = node.properties.data?.fnName;
            console.log(nodeName, 'nodeName-----')
            if (nodeName && nodeName === newNodeName && node.id !== newNode.id) {
                nameCount++;
            }
        });
        console.log(nameCount, 'nameCount')

        // 如果有重名，修改新节点名称
        if (nameCount > 0) {
            let timeNum = new Date().getTime()
            newNode.setProperties({
                data: {
                    ...newNode.properties.data,
                    fnName: `${newNodeName}_${timeNum}`
                }
            });
        }
    }

    blankClick(ev) {
        this.selectedNodeIds = []

        this.logic.updateEditConfig({
            hideAnchors: false,
        })
    }

    deleteSelectedNodes() {
        const { nodes, edges } = this.logic.graphModel.getSelectElements()

        const selectedElements = nodes.concat(edges)
        selectedElements.forEach((el) => {
            this.logic.deleteElement(el.id)
        })
    }

    renameNodeId(id, slatNumber) {
        const idArr = id.split('-')
        const size = idArr.length - 1
        const last = Number(idArr[size])
        idArr[size] = last + slatNumber

        return idArr.join('-')
    }

    copySelectedNodes(offsetX = 40, offsetY = 40) {
        const { nodes, edges } = this.logic.graphModel.getSelectElements()
        const suffix = ~~(Math.random() * 1000)

        const nodesCopy = nodes.map((node) => ({
            ...node,
            id: this.renameNodeId(node.id, suffix),
            x: node.x + offsetX,
            y: node.y + offsetY,
        }))

        const edgesCopy = edges.map((edge) => ({
            ...edge,
            id: this.renameNodeId(edge.id, suffix),
            sourceNodeId: this.renameNodeId(edge.sourceNodeId, suffix),
            targetNodeId: this.renameNodeId(edge.targetNodeId, suffix),
            pointsList: edge.pointsList.map((e) => {
                return {
                    x: e.x + offsetX,
                    y: e.y + offsetY,
                };
            }),
        }))

        return { nodes: nodesCopy, edges: edgesCopy }
    }

    pasteNewNodes({ nodes, edges } = { nodes: [], edges: [] }) {
        const lf = this.logic

        nodes.forEach((node) => {
            lf.addNode(node)
        })

        edges.forEach((edge) => {
            lf.addEdge(edge)
        })

        lf.clearSelectElements()
        const newElements = nodes.concat(edges)
        newElements.forEach((el) => {
            const elem = lf.getModelById(el.id)
            elem.setSelected(true)
        })
    }

    nodeStepMove(nodeId, offsetX = 0, offsetY = 0, deep = true) {
        console.log(nodeId, offsetX, offsetY, deep, 'nodeStepMove')
        if (offsetX === offsetY === 0) return

        const lf = this.logic
        const allEdges = lf.graphModel.edges
        const node = lf.getModelById(nodeId)
        if (!node) return

        node.move(offsetX, offsetY)

        // 如果有子节点则需要同步遍历移动
        if (deep) {
            node.children?.forEach(e => {
                this.nodeStepMove(e, offsetX, offsetY, deep)
            })
        }

        allEdges.forEach((elem) => {
            const { startPoint, endPoint } = elem

            if (nodeId === elem.sourceNodeId) {
                elem.updateStartPoint({
                    x: startPoint.x + offsetX,
                    y: startPoint.y + offsetY,
                })
            }

            if (nodeId === elem.targetNodeId) {
                elem.updateEndPoint({
                    x: endPoint.x + offsetX,
                    y: endPoint.y + offsetY,
                })
            }
        })
    }

    selectedNodesStepMove(dir = 'up', step = 1) {
        const { nodes } = this.logic.graphModel.getSelectElements()
        const ids = nodes.map(n => n.id)

        const isX = ['left', 'right'].includes(dir)
        const ratio = ['up', 'left'].includes(dir) ? -1 : 1

        const offsetSize = step * ratio
        let offsetX = 0
        let offsetY = 0

        if (isX) {
            offsetX = offsetSize
        } else {
            offsetY = offsetSize
        }

        ids.forEach(id => {
            this.nodeStepMove(id, offsetX, offsetY)
        })
    }
}
