
import Basic from './basic'

export default class Edge extends Basic {
    constructor(context){
        super(context)
    }

    async connected(e){
        let source = e.edge.getSource()
        e.edge.setSource({
            cell: source.cell
        })

        setTimeout(() => {
            this.mouseleave(e)
        })
    }

    async dblclick(e){
        let result = await this.node.validate(e.edge)
        let { remove, ...data } = result
        if(remove){
            this.graph.removeEdge(e.edge)
        }else{
            e.edge.replaceData(data)
        }
        
    }

    mouseenter(e){
        e.edge.attr('line/stroke', '#5F95FF')
    }

    mouseleave(e){
        e.edge.attr('line/stroke', '#333')
    }

}