
const portsAttr = {
    attrs: {
        circle: {
            magnet: true,
            stroke: '#8f8f8f',
            r: 4,
            style: {
                visibility: 'hidden'
            },
        },
    }
}

export const ports = {
    groups: {
        left: {
            position: 'left',
            ...portsAttr
        },
        right: {
            position: 'right',
            ...portsAttr
        },
        top: {
            position: 'top',
            ...portsAttr
        },
        bottom: {
            position: 'bottom',
            ...portsAttr
        },
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
        },
        {
            id: 'port_3',
            group: 'top'
        },
        {
            id: 'port_4',
            group: 'bottom'
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
        color: "#edeeef"
    },
    grid: false,
    connecting: {
        allowBlank: false,
        allowLoop: false,
        allowMulti: false,
        allowNode: false,
        router: {
            name: 'manhattan',
            args: {
                excludeShapes: ['Connection']
            }
        },
        connectionPoint: {
            name: 'boundary',
            args: {
                offset: -2,
                sticky: true,
            },
        },
        connector: {
            name: 'rounded',
            args: {
                radius: 8,
            },
        },
        snap: {
            radius: 20,
        },
        createEdge(){
            return this.createEdge({
                shape: 'edge',
                zIndex: -1,
                attrs: {
                    line: {
                        stroke: '#333',
                        strokeWidth: 1.5
                    }
                }
            })
        }
    }
}
