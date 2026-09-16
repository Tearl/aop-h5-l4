
import Baisc from './basic'
export default class Tool extends Baisc {
    constructor(context){
        super(context)
    }

    scale(){
        let selected = this.graph.getSelectedCells()
        this.graph.cleanSelection()
        this.graph.select(selected)
    }

    formatPNG(){
        let menuDrawer = document.querySelector('.menu_drawer')
        return new Promise((resolve) => {
            let bbox = this.graph.getAllCellsBBox()
            if(bbox){
                if(menuDrawer){
                    menuDrawer.style.display = 'none'
                }
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
                    stylesheet: `
                        .header{}
                    `
                })
            }else{
                resolve(undefined)
            }
        })
    }

    unformatFnclass(value){
        let maps = {
            '04': 'x6-shape-node-level1',
            '05': 'x6-shape-node-level2',
            '06': 'x6-shape-node-level3',
            '07': 'x6-shape-node-level4',
            '08': 'x6-shape-node-level5'
        }
        return maps[value]
    }

    formatFnClass(shape){
        let maps = {
            'x6-shape-node-level1': '04',
            'x6-shape-node-level2': '05',
            'x6-shape-node-level3': '06',
            'x6-shape-node-level4': '07',
            'x6-shape-node-level5': '08',
        }
        return maps[shape]
    }

    formatWidget(options){
        return this.graph.createNode(options)
    }

    formatShape(options){
        
        let { point = {}, createTime, userId, visible = true, shape, ...data } = options
        let meta = { shape, data }
        if(!shape){
            meta.shape = this.unformatFnclass(data.fnClass)
            meta.x = Number(point.pointX)
            meta.y = Number(point.pointY)
            meta.width = Number(point.width)
            meta.height = Number(point.height)
        }
        return this.graph.createNode(meta)
    }

    formatRegion(options){
        let { point = {}, createTime, userId, visible = true, shape, ...data } = options
        let meta = { shape, visible, data }
        if(!shape){
            meta.shape = 'x6-shape-region'
            meta.x = Number(point.pointX)
            meta.y = Number(point.pointY)
            meta.width = Number(point.width)
            meta.height = Number(point.height)
        }
        return this.graph.createNode(meta)
    }

    formatEdge(options, nodeMap){
        return options.reduce((pre, next) => {
            let { curFnId, fnrDesc, fnrName, tgtFnId } = next
            let aid = nodeMap[curFnId]
            let bid = nodeMap[tgtFnId]
            if(aid && bid){
                let edge = this.graph.createEdge({
                    source: aid,
                    target: bid,
                    data: {
                        fnrDesc,
                        fnrName
                    },
                    attrs: {
                        line: {
                            stroke: '#333',
                            strokeWidth: 1.2,
                            targetMarker: {
                                name: 'block',
                                size: 8
                            }
                        }
                    },
                    zIndex: 0
                })

                pre.push(edge)
            }
            return pre
        }, [])
        
    }


    async unformat(){
        let cells = this.graph.getCells()
        let flowNodeInfos = []
        let laneNodeInfos = []
        let nodeRels = []
        
        let picture = await this.formatPNG()
        cells.forEach(cell => {
            if(cell.isNode()){
                if(cell.shape == 'x6-shape-region'){
                    laneNodeInfos = laneNodeInfos.concat(this.unformatRegion(cell))
                }else{
                    flowNodeInfos = flowNodeInfos.concat(this.unformatNode(cell))
                }
            }else{
                nodeRels = nodeRels.concat(this.unformatEdge(cell))   
            }
        })

        return {
            picture,
            flowNodeInfos,
            laneNodeInfos,
            nodeRels
        }
    }

    unformatNode(cell){
        let { x, y } = cell.position()
        let { width, height } = cell.size()
        let { createTime, fcId, userId, ...data } = cell.data
        let point = {
            pointX: String(x),
            pointY: String(y),
            width: String(width),
            height: String(height)
        }
        let fnClass = this.formatFnClass(cell.shape)

        return Object.assign({}, data || {}, { point, fnClass })
    }

    unformatRegion(cell){
        let { x, y } = cell.position()
        let { width, height } = cell.size()
        let { createTime, fcId, userId, ...data } = cell.data
        let point = {
            pointX: String(x),
            pointY: String(y),
            width: String(width),
            height: String(height)
        }
        return Object.assign({}, data || {}, { point })
    }

    unformatEdge(cell){
        let sourceNode = cell.getSourceNode()
        let targetNode = cell.getTargetNode()
        let data = cell.data
        return {
            ...data,
            curFnId: sourceNode.data.fnId,
            curFnName: sourceNode.data.fnName,
            tgtFnId: targetNode.data.fnId,
            tgtFnName: targetNode.data.fnName
        }
    }
}