
import { register } from '@antv/x6-vue-shape'
import ports from './ports'
import shape from '../shape'
export default class Register {
    constructor(options){
        this.options = options
        let ishape = Object.values(shape).map(shape => {
            let info = {
                shape: shape.name,
                component: shape,
                width: 180,
                height: 80,
            }

            if(!this.options.preview){
                info.ports = ports
            }
            return info
        })
        this.registry(ishape)
    }

    registry(registryMeta){
        if(Array.isArray(registryMeta)){
            registryMeta.forEach(meta => {
                register(meta)
            })
        }else{
            register(registryMeta)
        }
    }
}