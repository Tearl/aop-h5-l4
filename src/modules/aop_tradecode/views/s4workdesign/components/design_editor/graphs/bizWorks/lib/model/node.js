
import Basic from './basic'
import _ from 'lodash'

export default class Node extends Basic {
    constructor(context){
        super(context)
    }

    formatNode(meta){
        let { point, ...data } = meta
        let shape = data.objType == '00' ? 'ConnectionObject': 'ConnectionValue'
        return {
            shape,
            width: 180,
            height: 80,
            zIndex: 1,
            data
        }
    }

    createNode(meta){
        let node = this.graph.createNode(meta)
        this.store.set(meta.data.objCode, node.id)
        return node
    }

    scale(){
        let selected = this.graph.getSelectedCells()
        this.graph.cleanSelection()
        this.graph.select(selected)
    }

    async dblclick(e){
        let { node } = e
        let result = await this.dialog.show(_.cloneDeep(node.data), {shape:node.shape})
        
        if(result){
            this.edge.operate(result)
            node.replaceData(result)
        }
    }
}