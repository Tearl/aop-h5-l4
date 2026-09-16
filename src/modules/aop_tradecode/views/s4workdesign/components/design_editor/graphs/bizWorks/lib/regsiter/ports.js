
export default {
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
    },
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