

export const relationshipValueMap = {
    '0-N': '1:0..*',
    '1-N': '1:1..*',
    '0-1': '1:0..1',
    '1-1': '1:1'
}

export const ports = {
    groups: {
        left: {
            position: 'left',
            attrs: {
                circle: {
                    magnet: true,
                    stroke: '#8f8f8f',
                    r: 5
                }
            }
        },
        right: {
            position: 'right',
            attrs: {
                circle: {
                    magnet: true,
                    stroke: '#8f8f8f',
                    r: 5
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
