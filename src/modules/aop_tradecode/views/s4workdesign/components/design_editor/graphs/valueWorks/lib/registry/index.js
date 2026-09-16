

import { register } from '@antv/x6-vue-shape'
import shapeComponent from '../shape'
import miniShapeComponent from '../../components/shape'
export default class Regisry {
    constructor(){
        let miniComponent = [
            {
                shape: miniShapeComponent.ConnectionValue.name,
                component: miniShapeComponent.ConnectionValue
            }
        ]
        this.registry([...shapeComponent, ...miniComponent])
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