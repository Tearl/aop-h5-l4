

import { DagreLayout, GridLayout } from "@antv/layout"
import Basic from '../model/basic'
export default class Render extends Basic {

    constructor(context){
        super(context)
    }

    render(metas){

        if(this.ctx.layout){
            return this.rebuild(metas)
        }

        return this.rebuild(metas)

        let embed = []
        let edges = []
        let layout = []

        let nodes = metas.reduce((pre, meta) => {
            let nodeMeta = this.tool.formatMeta(meta)
            if(meta.point.pointX !== undefined || meta.point.pointY !== undefined){
                let node = this.graph.createNode(nodeMeta)
                this.store.set(node.data.objCode, node.id)
                pre.push(node)
                if(meta.nodeInfos && meta.nodeInfos.length){
                    embed.push({
                        parent: node,
                        children: meta.nodeInfos.map(m => m)
                    })
                }
            }else{
                layout.push(nodeMeta)
            }
            if(meta.objectRelInfos && meta.objectRelInfos.length){
                edges.push(meta.objectRelInfos)
            }
            return pre
        }, [])

        if(layout.length){
            let gridLayout = new GridLayout({type: 'grid',begin:[0,0]})
            let model = gridLayout.layout({nodes: layout})
            model.nodes.forEach(n => {
                let node = this.graph.createNode(n)
                this.store.set(node.data.objCode, node.id)
                nodes.push(node)
            })
        }

        this.graph.resetCells(nodes)
        
        embed.forEach(e => {
            let { parent, children } = e
            children.forEach(child => {
                let childId = this.store.get(child.code)
                let childNode = this.graph.getCellById(childId)
                parent.embed(childNode) 
            })
        })
        edges.forEach(ed => {
            this.edge.create(ed)
        })

        this.graph.positionContent('center')
        

        // this.graph.resetCells(nodes)

        // let embed = []
        // let edge = []
        // let nodes = metas.map(meta => {
        //     let node = this.graph.createNode(this.tool.formatMeta(meta))
        //     this.store.set(node.data.objCode, node.id)
        //     if(meta.nodeInfos && meta.nodeInfos.length){
        //         embed.push({
        //             parent: node,
        //             children: meta.nodeInfos.map(m => m)
        //         })
        //     }
        //     if(meta.objectRelInfos && meta.objectRelInfos.length){
        //         edge.push(meta.objectRelInfos)
        //     }
        //     return node
        // })
        // this.graph.addNodes(nodes)
        // embed.forEach(e => {
        //     let { parent, children } = e
        //     children.forEach(child => {
        //         let childId = this.store.get(child.code)
        //         let childNode = this.graph.getCellById(childId)
        //         parent.embed(childNode) 
        //     })
        // })
        // edge.forEach(ed => {
        //     this.edge.create(ed)
        // })
    }

    rebuild(metas){
        let nodesMetas = []
        let edgesMetas = []
        metas.forEach((meta) => {
            let nodeMeta = this.tool.formatMeta(meta)
            nodeMeta.id = meta.objId
            this.store.set(meta.objCode, meta.objId)
            nodesMetas.push(nodeMeta)
            if(meta.objectRelInfos && meta.objectRelInfos.length){
                edgesMetas.push(...meta.objectRelInfos)
            }
        })
        
        
        let emt = edgesMetas.reduce((pre, meta) => {
            let { curObjCode, tgtObjCode } = meta
            let cur = this.store.get(curObjCode)
            let tgt = this.store.get(tgtObjCode)
            if(cur && tgt){
                let edge = {
                    shape: 'edge',
                    source: { cell: cur },
                    target: { cell: tgt },
                    attrs: {
                        line: {
                            targetMarker: this.edge.marker(meta.obrRelash)
                        }
                    },
                    labels:[this.edge.label(meta.relashMult)],
                    
                    zIndex: 0
                }
                pre.push(edge)
            }
            
            return pre
        }, [])
        
        let dagreLayout = new DagreLayout({
            type: 'dagre',
            rankdir: 'TB',
            ranksep: 70,
            nodesep: 70,
        })

        const model = dagreLayout.layout({
            nodes: [...nodesMetas],
            edges: emt,
        })

        this.graph.fromJSON(model)
        this.graph.positionContent('center')

    }

    rebuildssss(metas){
        let edges = []
        let layout = []
        let nodes = []

        metas.reduce((pre, meta) => {
            console.log(nodes)
            let nodeMeta = this.tool.formatMeta(meta)
            if(meta.objectRelInfos && meta.objectRelInfos.length){
                nodes.push(nodeMeta)
                edges.push(meta.objectRelInfos)
            }else{
                layout.push(nodeMeta)
            }
            // if(meta.objectRelInfos && meta.objectRelInfos.length){
            //     edges.push(meta.objectRelInfos)
            // }
            return pre
        }, [])

        // ERLayoutInstance.execute().then(res => {
        //     console.log(res)
        // })

        // let gridLayout = new GridLayout({
        //     type: 'grid',
        //     preventOverlap: true,
        //     condense: true,
        //     nodeSize: {
        //         width: 280,
        //         height: 120
        //     }
        // })
        // let model = gridLayout.layout({nodes: [...nodes, ...layout]})
        // model.nodes.forEach(n => {
        //     let node = this.graph.createNode(n)
        //     this.store.set(node.data.objCode, node.id)
        //     m.push(node)
        // })

        let ms = [...nodes, ...layout].map(n => {
            let node = this.graph.createNode(n)
            this.store.set(node.data.objCode, node.id)
            return node
        })

        // this.graph.resetCells(ms) 

        // edges.forEach(ed => {
        //     this.edge.create(ed)
        // })

        // this.graph.positionContent('center')

        // if(layout.length){
        //     let gridLayout = new GridLayout({
        //         type: 'grid',
        //         preventOverlap: true,
        //         condense: true,
        //         nodeSize: {
        //             width: 280,
        //             height: 120
        //         }
        //     })
        //     let model = gridLayout.layout({nodes: layout})
            
        //     model.nodes.forEach(n => {
        //         let node = this.graph.createNode(n)
        //         this.store.set(node.data.objCode, node.id)
        //         nodes.push(node)
        //     })
        //     this.graph.resetCells(nodes)
        //     edges.forEach(ed => {
        //         this.edge.create(ed)
        //     })
    
        //     this.graph.positionContent('center')
        // }
    }

    updateObjId(metas){
        metas.forEach(meta => {
            let id = this.store.get(meta.objCode)
            let node = this.graph.getCellById(id)
            node.replaceData(meta)
        })
    }

    toJSON(){
        let { userInfo } = this.vm.$store.state
        return this.graph.getNodes().map(node => {
            let { x, y } = node.position()
            let { width, height } = node.size()
            let data = Object.assign({}, node.data || {})

            data.point = {
                width: String(width),
                height: String(height),
                pointX: String(x),
                pointY: String(y)
            }

            if(node.shape == 'Collection'){
                data.colour = ''
                data.metadateType = 'aggregate'
                if(data.color){
                    data.colour = data.color
                }
                
                if(node.children){
                    data.nodeInfos = node.children.map(item => {
                        let { objCode: code, objName: name } = item.data
                        return { code, name }
                    })
                }
                delete data.color
            }else{  
                data.metadateType = 'object'
            }

            data.userId = userInfo.cstNo
            return data
        })
    }
}