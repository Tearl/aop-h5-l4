
import { usePorts, ports } from '../config'
export default {
    inherit: 'polygon',
    width: 86,
    height: 38,
    attrs: {
        body: {
            strokeWidth: 1,
            stroke: '#5F95FF',
            fill: '#EFF4FF',
            refPoints: '0 19 43 1 86 19 43 37'
        },
        label: {
            text: '判断',
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
        fnClass: '03'
    },
    ports: {
        ...ports,
        ...usePorts
    }
}