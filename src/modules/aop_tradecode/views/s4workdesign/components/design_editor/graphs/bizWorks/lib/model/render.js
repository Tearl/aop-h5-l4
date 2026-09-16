
import Basic from './basic'
import { DagreLayout } from "@antv/layout"

export default class Render extends Basic {

    constructor(context){
        super(context)
    }

    toPicture(){
        let menuDrawer = document.querySelector('.menu_drawer')
        this.graph.cleanSelection()
        if(menuDrawer){
            menuDrawer.style.display = 'none'
        }
        return new Promise((resolve) => {
            let bbox = this.graph.getAllCellsBBox()
            this.graph.toPNG(dataUri => {
                if(menuDrawer){
                    menuDrawer.removeAttribute('style')
                }
                resolve(dataUri)
            }, {
                width: bbox.width * 2,
                height: bbox.height * 2,
                padding: 10,
                quality: 1,
                copyStyles: true,
                stylesheet: `
                    .x6-graph-custom-bizWorks-shape{
                        position: relative;
                        width: 100%;
                        height: 100%;
                        font-size: 12px;
                    }
                    .x6-graph-custom-bizWorks-shape-layout{
                        display: flex;
                        align-items: center;
                        height: 40px;
                        padding: 0 10px;
                        box-sizing: border-box;
                        justify-content: space-between;
                    }
                    .x6-graph-custom-bizWorks-shape-header{
                        border-radius: 6px 6px 0 0;
                        overflow: hidden;
                    }
                    .x6-graph-custom-bizWorks-shape-list{
                        border-radius: 0 0 6px 6px;
                        overflow: hidden;
                        outline: 0.5px solid #dfe0e1 !important;
                        box-sizing: border-box;
                    }
                `,
                beforeSerialize(svg){
                    let ports = Array.from(svg.querySelectorAll('.x6-port'))
                    ports.forEach(port => {
                        port.style.visibility = 'hidden'
                    })
                }
            })
        })
    }

    render(metas){
        let codeMap = {}
        let nodeMetas = []
        let edgeMetas = []

        metas.forEach(meta => {
            let nodeMeta = this.node.formatNode(meta)
            nodeMeta.id = meta.objCode
            this.store.set(meta.objCode, meta.objCode)
            codeMap[meta.objCode] = true
            nodeMetas.push(nodeMeta)
            edgeMetas.push(...meta.objectRelInfos)
        })

        edgeMetas = edgeMetas.reduce((pre, meta) => {
            let { curObjCode, tgtObjCode } = meta
            if(codeMap[curObjCode] && codeMap[tgtObjCode]){
                pre.push(this.edge.formatEdge(meta))
            }
            return pre
        }, [])

        
        let dagre = new DagreLayout({
            type: 'dagre',
            rankdir: 'TB',
            ranksep: 70,
            nodesep: 70,
        })

        let model = dagre.layout({
            nodes: nodeMetas,
            edges: edgeMetas
        })

        let nodes = model.nodes.map(node => {
            delete node.id
            return this.node.createNode(node)
        })

        let edges = edgeMetas.map(meta => {
            let source = this.store.get(meta.source)
            let target = this.store.get(meta.target)
            delete meta.id
            return this.edge.createEdge({...meta, source, target})
        })

        this.graph.resetCells([...nodes, ...edges])
        this.graph.positionContent('center')
        
    }
}