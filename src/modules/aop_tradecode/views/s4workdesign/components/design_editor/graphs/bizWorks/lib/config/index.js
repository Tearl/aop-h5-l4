


export default {
    autoResize: true,
    panning: false,
    grid: false,
    background: {
        color: "#edeeef"
    },
    mousewheel: {
        enabled: true,
        factor: 1,
        modifiers: ['ctrl']
    },
    scaling: {
        min: 0.33,
        max: 3
    },
    connecting: {
        allowBlank: false,
        allowLoop: false,
        allowMulti: false,
        allowPort: false,
        createEdge(options){
            let edge = this.createEdge({
                attrs: {
                    line: {
                        stroke: '#333',
                        strokeWidth: 2
                    }
                },
                zIndex: 0
            })
            return edge
        },
        validateConnection(args){
            let { sourceCell, targetCell } = args
            return !this.isNeighbor(sourceCell, targetCell)
        }
    },
    
}