import { usePorts, ports } from '../config'
export default {
    inherit: 'rect',
    width: 86,
    height: 38,
    attrs: {
        body: {
            strokeWidth: 1,
            stroke: '#5F95FF',
            fill: '#EFF4FF',
            rx: 2,
            ry: 2
        },
        label: {
            text: '接口',
            fontSize: 12,
            fill: '#262626',
            textWrap: {
                width: -10,
                height: -10,
                ellipsis: true,
                breakWord: true
            }
        }
    },
    data: {
        fnName: '',
        fnCode: '',
        fnDesc: '',
        fnClass: '20'
    },
    ports: {
        ...ports,
        ...usePorts
    }
}
