

import { register } from '@antv/x6-vue-shape'
import widget from '../../components/widget'
import shape from '../shape'

export default class Registry {
    constructor(options){
        widget.components.forEach(component => {
            register({
                width: widget.width,
                height: widget.height,
                shape: component.name,
                component
            })
        })

        shape.forEach(item => {
            if(options.preview){ delete item.ports }
            register(item)
        })
    }
}