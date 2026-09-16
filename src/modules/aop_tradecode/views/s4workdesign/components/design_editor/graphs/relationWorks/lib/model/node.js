
import Basic from './basic'

export default class Node extends Basic {
    constructor(context){
        super(context)
    }

    getDrag($event, shape){
        let widget = this.tool.formatWidget({shape})
        return this.ctx.Dnd.start(widget, $event)
    }

    getDrop(node){
        let shape = node.shape.replace('widget', 'shape')
        let newNode = this.tool.formatShape({shape})
        setTimeout(() => this.afterDrop(newNode))
        return newNode
    }

    async afterDrop(node){
        let validate = async (n) => {
            let res = await this.validate(n)
            if(!res){
                this.graph.removeNode(n)
            }
        }
        if(node.shape == 'x6-shape-node-level4'){
            let canDrop = await this.region.validate(node)
            canDrop && validate(node)
        }else{
            validate(node)
        }
    }

    dblclick(e){
        this.validate(e.node)
    }

    copy(){
        let selectCells = this.graph.getSelectedCells().filter(t => t.isNode())
        this.graph.copy(selectCells)
    }

    paste(getNodeId){
        let cells = this.graph.getCellsInClipboard().filter(t => t.isNode())
        if(cells.length){
            getNodeId(cells.length).then(({ nodeCodeList }) => {
                cells.forEach((c, i) => {
                    let d = c.getData()
                    c.replaceData({ ...d, fnId: nodeCodeList[i] })
                })
                let copyCells = this.graph.paste(cells)
                this.graph.resetSelection(copyCells)
            })
        }
    }

    batchRemove(nodes){
        this.graph.startBatch('custom-batch-name')
        nodes.map(node => this.remove(node))
        this.graph.stopBatch('custom-batch-name')
    }

    remove(node){
        this.graph.removeNode(node)
        this.graph.trigger('shortcut:change', {
            action: 'setDisabledIcon',
            value: ['copy','paste','paste']
        })
    }

    moved(node){
        // let getParent = node.getParent()
        // let box = this.graph.getNodesUnderNode(node).find(n => n.shape == 'x6-shape-region')
        // if(box && box.id != getParent.id){
        //     getParent.unembed(node)
        //     box.embed(node)
        // }
    }

    async validate(node){
        let { shape, data = {} } = node
        let { preview, embed } = this.options
        let result = await this.dialog.show({ shape, preview: preview || embed || false }, data)
        result && node.replaceData({...data, ...result})
        return result
    }
    
}