import { Graph } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
import Shape from '../shape'
import StartConnection from '../shape/StartConnection'
import EndConnection from '../shape/EndConnection'
import FlowConnection from '../shape/FlowConnection'
import ConditionConnection from '../shape/ConditionConnection'
import ServiceConnection from '../shape/ServiceConnection'

export default class Registry {
    constructor(){
        let ishape = Object.values(Shape)
        this.registry(ishape)
        Graph.registerNode('StartConnection', StartConnection, true)
        Graph.registerNode('EndConnection', EndConnection, true)
        Graph.registerNode('FlowConnection', FlowConnection, true)
        Graph.registerNode('ConditionConnection', ConditionConnection, true)
        Graph.registerNode('ServiceConnection', ServiceConnection, true)
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
