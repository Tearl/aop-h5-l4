
import { register } from '@antv/x6-vue-shape'
import widget from '../../components/widget'
import shape from '../shape'
import '../tools/edge'

export default class Regisry {

    constructor(){

        let iwidget = Object.values(widget).map(widget => {
            return {
                shape: widget.name,
                component: widget
            }
        })

        let ishape = Object.values(shape).map(shape => {
            return {
                shape: shape.name,
                component: shape
            }
        })

        this.registry([...iwidget, ...ishape])
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