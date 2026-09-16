
export const widget = {
    width: 86,
    height: 38
}

export const ports = {
    groups: {
        left: {
            position: 'left',
            attrs: {
                circle: {
                    magnet: true,
                    stroke: '#8f8f8f',
                    r: 4
                }
            }
        },
        right: {
            position: 'right',
            attrs: {
                circle: {
                    magnet: true,
                    stroke: '#8f8f8f',
                    r: 4
                }
            }
        }
    }
}

export const usePorts = {
    items: [
        {
            id: 'port_1',
            group: 'left'
        },
        {
            id: 'port_2',
            group: 'right'
        }
    ]
}


export default {
    panning: false,
    autoResize: true,
    mousewheel: {
        enabled: true,
        factor: 1,
        modifiers: ['ctrl']
    },
    background: {
        color: '#edeeef'
    },
    grid: false,
    connecting: {
        allowBlank: false,
        allowLoop: false,
        allowMulti: false,
        allowPort: false,
        router: 'manhattan',
        createEdge(options){
            return this.createEdge({
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
        },
        validateConnection({sourceCell, targetCell}){
            if(sourceCell == targetCell || targetCell.shape == 'x6-shape-region'){ return false }
            return true
        }
    }
}