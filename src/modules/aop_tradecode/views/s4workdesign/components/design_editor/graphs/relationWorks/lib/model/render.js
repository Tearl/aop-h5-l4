
import Basic from './basic'

export default class Render extends Basic {
    constructor(context){
        super(context)
    }

    toJSON(){
        return this.tool.unformat()
    }

    render(data){

        let nodeMap = {}
        let { flowNodeInfos = [], laneNodeInfos = [], nodeRels = [] } = data
        let nodes = flowNodeInfos.map(node => {
            let newNode = this.tool.formatShape(node)
            nodeMap[newNode.data.fnId] = newNode.id
            return newNode
        })

        let regions = laneNodeInfos.map(region => {
            let re = this.tool.formatRegion(region)
            re.setZIndex(-1)
            return re
        })

        let edges = this.tool.formatEdge(nodeRels, nodeMap)

        this.graph.resetCells([
            ...regions,
            ...nodes,
            ...edges
        ])

        
        
        if(this.options.embed){
            this.graph.positionContent('top-left')
        }else{
            this.graph.positionContent('center')
        }
    }
}