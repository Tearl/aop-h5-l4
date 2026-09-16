
import Basic from './basic'
import _ from 'lodash'

export default class Node extends Basic {

    constructor(context){
        super(context)
    }

    getDrag($event, options){
        let node = this.graph.createNode(options)
        this.ctx.Dnd.start(node, $event)
    }

    getDrop(node){
        let meta = this.formatNode(node.data || {})
        let newNode = this.createNode(meta)
        setTimeout(() => {
            let bbox = this.graph.getNodesUnderNode(newNode)
            let Connection = bbox.find(b => b.shape == 'Connection')
            if(Connection){
                Connection.embed(newNode)
            }
        })
        // console.log("====",newNode.data,this.dialog)
        if(newNode.data.fnClass == '20'){
            let aaa = '20show';
            this.dialog.showNode(meta.data)
            this.dialog.change4bList(aaa,newNode)
        } else {
            this.dialog.putTextInfo(newNode)
        }
        return newNode
    }

    formatShape(value){
        let maps = {
            '00': 'StartConnection',
            '01': 'EndConnection',
            '02': 'FlowConnection',
            '03': 'ConditionConnection',
            '20': 'ServiceConnection'
        }
        return maps[value]
    }

    formatNode(meta={}){
        let { point = {}, shape, ...other } = meta
        let info = {
            shape: this.formatShape(other.fnClass) || shape,
            zIndex: 1,
            data: Object.assign({
                fnId: new Date().getTime(),
                fnName: '',
                fnCode: '',
                fnDesc: ''
            }, other)
        }
        if(point.width){
            info.width = Number(point.width)
        }
        if(point.height){
            info.height = Number(point.height)
        }
        if(point.pointX){
            info.x = Number(point.pointX)
        }
        if(point.pointY){
            info.y = Number(point.pointY)
        }
        return info
    }

    createNode(meta){
        let node = this.graph.createNode(meta)
        this.store.set(meta.data.fnId, node.id)
        return node
    }

    dblclick(e){
        let data = _.cloneDeep(e.node.data)
        this.dialog.showNode(data).then(valid => {
            if(valid){
                this.graph.startBatch('custom-batch-name')
                e.node.attr('label/text', valid.fnName)
                e.node.replaceData(valid)
                this.graph.stopBatch('custom-batch-name')
            }
        })
    }

    showPorts(show){
        const container = document.querySelector('.x6-custom-flowWorks-view')
        const ports = container.querySelectorAll('.x6-port-body')
        for(let i = 0, len = ports.length; i < len; i += 1){
            ports[i].style.visibility = show ? 'visible': 'hidden'
        }
    }

    mouseenter(e){
        if(e && e.cell.shape == 'Connection'){
            return
        }

        this.showPorts(true)
    }

    mouseleave(e){
        if(e && e.cell.shape == 'Connection'){
            return
        }
        this.showPorts(false)
    }

    moved(e){
        let { parent } = e.node
        let bbox = this.graph.getNodesUnderNode(e.node)
        let Connection = bbox.find(b => b.shape == 'Connection')
        if(Connection){
           if(parent && parent.id != Connection.id){
                parent.unembed(e.node)
                Connection.embed(e.node)
           }else{
                Connection.embed(e.node)
           }
        }else if(parent){
            parent.unembed(e.node)
        }
    }

    batchRemove(nodes){
        this.graph.startBatch('custom-batch-name')
        nodes.map(node => this.remove(node))
        this.graph.stopBatch('custom-batch-name')
    }

    remove(node){
        this.graph.removeNode(node)
    }

}
