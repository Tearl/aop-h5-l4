
import Basic from './basic'

export default class Render extends Basic {
    constructor(context){
        super(context)
    }

    toPicture(){
        let menuDrawer = document.querySelector('.menu_drawer')
        this.graph.clearTransformWidgets()
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
                    .header{
                        display:flex;
                        align-items: center;
                    }
                `
            })
        })
    }

    async toJSON(){
        let picture = await this.toPicture()
        let nodes = this.graph.getNodes()
        return nodes.reduce((res, item) => {
            let { x, y } = item.position()
            let { width, height } = item.size()
            let point = {
                pointX: String(x),
                pointY: String(y),
                width: String(width),
                height: String(height)
            }

            if(item.shape == 'Connection'){
                res.laneNodeInfos.push({ point, ...item.data })
            }else{
                res.flowNodeInfos.push({ point,...item.data })
                let edges = this.graph.getOutgoingEdges(item)
                if(edges){
                    edges.forEach(edge => {
                        let targetNode = edge.getTargetNode()
                        let targetNodeData = targetNode.getData()
                        res.nodeRels.push({
                            fnrName: edge.data.fnrName || '',
                            fnrDesc: edge.data.fnrDesc || '',
                            seleType: edge.data.seleType || '',
                            curFnId: item.data.fnId,
                            curFnName: item.data.fnName,
                            tgtFnId: targetNode.data.fnId,
                            tgtFnName: targetNodeData.fnName,
                            relId: item.data.fnId,
                            sourcePort: edge.source.port,
                            targetPort: edge.target.port,
                        })
                    })
                }
            }

            return res

        }, {
            picture,
            flowNodeInfos: [],
            laneNodeInfos: [],
            nodeRels: []
        })
    }

    render(metas){

        let regions = []
        let nodes = []
        let edges = []
        let { laneNodeInfos = [], flowNodeInfos = [], nodeRels = [] } = metas

        regions = laneNodeInfos.map(item => {
            let meta = this.region.formatRegion(item)
            return this.region.createRegion(meta)
        })

        nodes = flowNodeInfos.map(item => {
            let meta = this.node.formatNode(item)
            let node = this.node.createNode(meta)
            if(item.fnName){
                node.attr('label/text', item.fnName)
            }
            return node
        })

        edges = nodeRels.reduce((res, item) => {
            let { curFnId, tgtFnId } = item
            let cur = this.store.get(curFnId)
            let tgt = this.store.get(tgtFnId)
            if(cur && tgt){
                let meta = this.edge.formatEdge(item)
                res.push(
                    this.graph.createEdge(meta)
                )
            }
            return res
        }, [])

        if(!regions.length){
            let defaultRegionMeta = this.region.formatRegion()
            let defaultRegion = this.region.createRegion(defaultRegionMeta)
            regions = [defaultRegion]
        }

        this.graph.resetCells([...regions, ...nodes, ...edges]).positionContent('center')

        nodes.map(item => {
            let bbox = this.graph.getNodesUnderNode(item)
            let Connection = bbox.find(b => b.shape == 'Connection')
            if(Connection){
                Connection.embed(item)
            }
        })

        this.graph.cleanHistory()
    }
}
