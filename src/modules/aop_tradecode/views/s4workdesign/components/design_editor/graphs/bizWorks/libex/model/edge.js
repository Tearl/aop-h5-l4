
import Basic from './basic'
import { relationshipValueMap } from '../config'


export default class Edge extends Basic {

    constructor(context){
        super(context)
    }

    label(value){
        let text = relationshipValueMap[value] || value
        return {
            attrs: {
                label: {
                    text,
                },
                rect: {
                    ref: 'label',
                    stroke: 'rgba(31,56,88,.6)',
                    strokeWidth: 2,
                    rx: 4,
                    ry: 4,
                    refWidth: '140%',
                    refHeight: '100%',
                    refX: '-20%',
                    refY: '-0%',
                }
            },
            position: {
                options: {
                    keepGradient: true
                }
            },
        }
    }

    marker(value){
        let name = 'path'
        switch(value){
            case 'combination':
                return {
                    name,
                    d: 'M 30 10 L 20 16 L 10 10 L 20 4 z',
                    fill: 'black',
                    offsetX: -10
                }
            case 'aggregation':
                return {
                    name,
                    d: 'M 30 10 L 20 16 L 10 10 L 20 4 z',
                    fill: 'white',
                    offsetX: -10
                }
            case 'association':
                return {
                    name,
                    d: 'M 6 10 L 18 4 C 14.3333 6 10.6667 8 7 10 L 18 16 z',
                    strokeWidth: 2,
                    offsetX: -7,
                }
            case 'extends':
                return {
                    name,
                    d: 'M 14 -8 0 0 14 8 Z',
                    fill: 'white',
                    offsetX: -7,
                }
        }
    }

    validate(e){
        let node = e.edge.getTargetNode()
        return node.shape != 'Collection'
    }

    create(objectRelInfos){

        let edges = objectRelInfos.reduce((pre, item) => {
            let sourceNodeId = this.store.get(item.curObjCode)
            let targetNodeId = this.store.get(item.tgtObjCode)
            if(sourceNodeId && targetNodeId){
                let edgeKey = `edge-${item.curObjCode}-${item.tgtObjCode}`
                let edge = this.graph.createEdge({
                    source: { cell: sourceNodeId },
                    target: { cell: targetNodeId },
                    attrs: {
                        line: {
                            targetMarker: this.marker(item.obrRelash)
                        }
                    },
                    zIndex: 0
                })

                this.store.set(edgeKey, edge.id)

                if(item.obrRelash != 'extends'){
                    edge.setLabels(this.label(item.relashMult))
                }

                pre.push(edge)
            }

            return pre
        }, [])

        this.graph.addEdges(edges)
    }

    resetTools(id){
        let edges = this.ctx.graph.getEdges()
        edges.forEach(edge => {
            if(id){
                if(id != edge.id){
                    edge.removeTool('EdgeTools')
                }else{
                    this.toolsMap.args.onClick = this.click.bind(this)
                    edge.addTools([{
                        name: 'EdgeTools',
                        attrs: {
                            cursor: 'pointer'
                        },
                        args: {
                            rotate: true,
                            distance: 0.5,
                            onClick: (event) => {
                                let { e, view, btn, cell } = event
                                if(e.target.id == 'bwf-icon-editor'){
                                    let source = cell.getSource()
                                    let sourceNode = this.graph.getCellById(source.cell)
                                    let sourceNodeData = this.node.getNodeData(sourceNode)
                                    let target = cell.getTarget()
                                    let targetNode = this.graph.getCellById(target.cell)
                                    let targetNodeData = targetNode.getData()
                                    this.ctx.graphDialog.relation(sourceNodeData, targetNodeData.objCode).then(res => {
                                        if(res){
                                            this.edge.operate(sourceNode, res, true)
                                        }
                                    })
                                }

                                if(e.target.id == 'bwf-icon-del'){
                                    btn.parent.remove()
                                    view.cell.remove({ ui: true, toolId: btn.cid })
                                }
                            }
                        }
                    }])
                }
            }else{
                edge.removeTool('EdgeTools')
            }
        })
    }

    click(e){    
        this.tool.resetNodeTools()
        if(!e.edge.hasTool('EdgeTools')){
            this.tool.resetEdgeTools(e)
        }
    }

    remove(e){
        if(e.options.useRemoveEvent !== false){
            let source = e.edge.getSource()
            let sourceNode = this.graph.getCellById(source.cell)
            let sourceNodeData = sourceNode.getData()
            let edgeIndex = sourceNodeData.objectRelInfos.findIndex(item => {
                let edgeId = `edge-${item.curObjCode}-${item.tgtObjCode}`
                let id = this.store.get(edgeId)
                return id == e.edge.id
            })
            if(edgeIndex > -1){
                sourceNodeData.objectRelInfos.splice(edgeIndex, 1)
                // sourceNode.setData(sourceNodeData, {overwrite:true})
            }

        }
    }

    update(objectRelInfos){
        objectRelInfos.forEach(item => {
            let edgeId = `edge-${item.curObjCode}-${item.tgtObjCode}`
            let id = this.store.get(edgeId)
            let edge = this.graph.getCellById(id)
            if(!edge){
                this.create([item])
            }else{
                if(item.obrRelash == 'extends'){
                    edge.removeLabelAt(0)
                }else{
                    edge.setLabels(this.label(item.relashMult))
                }
                edge.attr('line/targetMarker', this.marker(item.obrRelash))
            }
        })
    }

    clean(node){
        let edges = this.graph.getOutgoingEdges(node)
        if(edges){
            this.graph.removeCells(edges)
        }
    }

    operate(node, objectRelInfos){
        
        let cloneData = this.tool.cloneDeep(objectRelInfos)

        if(cloneData.length <= 0){
            this.clean(node)
        }else if(node.data.objectRelInfos.length <= 0){
            this.create(cloneData)
        }else{
            let needUpdate = []
            node.data.objectRelInfos.forEach(n => {
                let { curObjCode, tgtObjCode } = n 
                let i = cloneData.findIndex(c => (c.curObjCode == curObjCode && c.tgtObjCode == tgtObjCode))
                if(i != -1){
                    needUpdate.push(...cloneData.splice(i,1))
                }else{
                    let edgeKey = `edge-${curObjCode}-${tgtObjCode}`
                    let edgeId = this.store.get(edgeKey)
                    this.graph.removeEdge(edgeId)
                }
            })

            this.create(cloneData)
            this.update(needUpdate)
        }
    }

    async connected(e){
        let { isNew, edge, currentCell } = e
        if(isNew){
            this.graph.removeEdge(edge, {useRemoveEvent:false})
            let source = edge.getSource()
            let sourceNode = this.graph.getCellById(source.cell)
            let targetNode = this.graph.getCellById(currentCell.id)
            let result = await this.ctx.graphDialog.relation(this.node.getNodeData(sourceNode),  targetNode.data.objCode)
            if(result){
                this.create(result.objectRelInfos)
                sourceNode.replaceData(result)
            }
        }
    }
}