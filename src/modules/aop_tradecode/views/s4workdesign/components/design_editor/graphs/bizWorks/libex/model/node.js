
import Basic from './basic'
import nodeMock from '../config/mock'


export default class Node extends Basic {
    
    constructor(context){
        super(context)
    }

    getNodeDefaultData(){
        return this.tool.cloneDeep(nodeMock)
    }

    getDrag($event, meta){
        let node = this.graph.createNode(meta)
        this.ctx.Dnd.start(node, $event)
    }

    getDrop(node){
        let name = node.shape.replace(/^widget/, '')
        let meta = this.tool.formatMeta({ shape: name })
        let newNode = this.graph.createNode(meta)
        this.getValidateNode(newNode)
        return newNode
    }

    getNodeData(node){
        return this.tool.cloneDeep(node.data || {})
    }

    getNodesData(){
        let nodes = this.graph.getNodes()
        return nodes.map(node => node.data)
    }

    async getValidateNode(node){
        let valid = await this.ctx.graphDialog.show(
            this.getNodeDefaultData(), 
            { shape: node.shape }
        )
        
        if(valid){
            this.store.set(valid.objCode, node.id)
            this.edge.operate(node, valid.objectRelInfos)
            node.setData(valid, { overwrite: true })
            if(node.shape == 'Collection'){
                node.setZIndex(-1)
            }
            this.graph.trigger('custom:node:changed')
        }else{
            this.graph.removeNode(node)
        }
    }

    resetTools(id = ''){
        this.vm.actived = id
        return this
    }

    scale(){
        let selected = this.graph.getSelectedCells()
        this.graph.cleanSelection()
        this.graph.select(selected)
    }

    async link(){
        let nodes = this.graph.getSelectedCells().filter(node => node.shape != 'Collection' && !node.parent)
        if(nodes.length){
            let result = await this.ctx.graphDialog.show(this.getNodeDefaultData(), { shape: 'Collection' })
            if(result){
                let { width, height, x, y } = this.graph.getCellsBBox(nodes)
                let Collection = this.graph.createNode({
                    shape: 'Collection',
                    size: { width: Math.max(280, width), height:Math.max(180 + 80, height + 40) },
                    position: {x,y: y - 40}
                })
                Collection.setZIndex(-1)
                this.graph.addNode(Collection)
                nodes.forEach(node => {
                    Collection.embed(node)
                })
                Collection.replaceData({ objName: result.objName, objCode: result.objCode, color: result.color })
                this.graph.resetSelection(Collection)
                // setTimeout(() => {
                //     Collection.setData({ objName: result.objName, objCode: result.objCode, color: result.color })
                // }, 100)
            }
        }
    }

    unlink(){
        let cells = this.graph.getSelectedCells()
        cells.forEach(item => {
            if(item.shape == 'Collection'){
                item.eachChild(child => {
                    item.unembed(child)
                })
                this.graph.removeNode(item)
            }
        })
    }

    selection(e){
        console.log(e)
        let { selected } = e
        if(selected.length <= 0){
            this.vm.toolData.copy = false
            this.vm.toolData.cut = false
            this.vm.toolData.del = false
            this.vm.toolData.link = false
            this.vm.toolData.unlink = false
            if(this.graph.isClipboardEmpty()){
                this.vm.toolData.paste = false
            }
        }else{
            let Collection = selected.find(n => n.shape == 'Collection')
            let ConnectionItem = selected.find(n => n.shape != 'Collection' && !n.parent)
            if(Collection){
                this.vm.toolData.unlink = true
            }
            if(ConnectionItem){
                if(!ConnectionItem.parent){
                    this.vm.toolData.link = true
                }
                if(!Collection){
                    this.vm.toolData.unlink = false
                }
            }
            this.vm.toolData.copy = true
            this.vm.toolData.cut = true
            this.vm.toolData.del = true
        }

    }

    click(e){
        this.tool.resetEdgeTools()
        this.graph.resetSelection(e.node)
        this.vm.actived = e.node.id
    }

    dblclick(e){
        // this.vm.actived = e.node.id
    }

    move(e){
        this.tool.resetNodeTools()
        this.tool.resetEdgeTools()
        let selectedCells = this.graph.getSelectedCells()
        if(selectedCells.length <= 1){
            this.graph.clearTransformWidgets()
            this.graph.resetSelection(e.node)
        }
    }

    beforeRemove(e){
        let edges = this.graph.getIncomingEdges(e.id)
        if(edges){
            edges.forEach(edge => {
                let sourceNode = edge.getSourceNode()
                let sourceNodeData = sourceNode.getData()
                let edgeIndex = sourceNodeData.objectRelInfos.findIndex(item => {
                    return `edge-${item.curObjCode}-${item.tgtObjCode}` == edge.id
                })
                if(edgeIndex > -1){
                    sourceNodeData.objectRelInfos.splice(edgeIndex, 1)
                }
            })
        }

        this.graph.removeNode(e.id, {useRemoveEvent:false})
    }

    remove(e){
        try{
            let { objCode } = e.node.getData()
            this.store.remove(objCode)
        }catch(e){}
        this.graph.cleanClipboard()
        this.graph.cleanSelection()
        this.graph.trigger('custom:node:changed')
        if(e.options.useRemoveEvent !== false){
            
        }
    }

    updateData(e, data){
        let { node } = e
        if(node.shape == 'Collection'){ 
            return node.setData({ objName: data.objName, objCode: data.objCode, color: data.color })
        }
        this.edge.operate(node, data)
        node.setData(data, { overwrite:true })
    }

    updateObjCode(oldCode, newCode, data){
        let nodeId = this.store.updateKey(oldCode, newCode)
        let edges = this.graph.getConnectedEdges(nodeId)
        edges.forEach(edge => {
            this.graph.updateCellId(edge, 'edge-110-110')
        })
        // let nodeId = this.store.remove(oldCode)
        // this.store.set(newCode, nodeId)
        // data.objectRelInfos.forEach(item => {
        //     let edge = this.graph.getCellById(`edge-${item.curObjCode}-${item.tgtObjCode}`)
        //     this.graph.updateCellId(edge, `edge-${newCode}-${item.tgtObjCode}`)
        //     item.objCode = newCode
        // })
        // let edges = this.graph.getIncomingEdges(nodeId)
        // if(edges){
        //     edges.forEach(edge => {
        //         let sourceNode = edge.getSourceNode()
        //         let sourceNodeData = sourceNode.getData()
        //         sourceNodeData.objectRelInfos.forEach(item => {
        //             item.tgtObjCode = newCode
        //         })
        //     })
        // }
    }

    async edit(e){
        let node = this.graph.getCellById(e.id)
        let result = await this.ctx.graphDialog.show(this.getNodeData(node), {shape: node.shape})
        if(result){
            if(node.shape == 'Collection'){
                node.replaceData({
                    objName: result.objName, objCode: result.objCode, color: result.color
                })
            }else{

                if(node.data.objCode != result.objCode){
                    this.store.updateKey(node.data.objCode, result.objCode)
                    let incomingEdges = this.graph.getIncomingEdges(node) || []
                    incomingEdges.forEach(edge => {
                        
                        let source = edge.getSource()
                        let sourceNode = this.graph.getCellById(source.cell)
                        sourceNode.data.objectRelInfos.forEach(item => {
                            this.store.updateKey(`edge-${item.curObjCode}-${item.tgtObjCode}`, `edge-${item.curObjCode}-${result.objCode}`)
                            item.tgtObjCode = result.objCode
                        })
                    })
                }

                this.edge.operate(node, result.objectRelInfos)
                node.replaceData(result)
                this.graph.trigger('custom:node:changed')
            }
            // if(result.objCode != cloneData.objCode){
            //     this.updateObjCode(oldObjCode, result.objCode, result)
            // }
            // this.edge.operate(node, result.objectRelInfos)
            // node.replaceData()
            // this.updateData({node}, result)
        }
    }

    async added(e){
        
    }

}