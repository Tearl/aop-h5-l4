import { Graph } from "@antv/x6"
import { Dnd } from "@antv/x6-plugin-dnd"
import { Export } from "@antv/x6-plugin-export"
import Registry from '../registry'
import Node from './node'
import Tool from './tool'

export default class View extends Registry {

    get valueFlowDiaog(){
        return this.vm.$refs.editValueFlow
    }
    
    constructor(vm, options = {}){
        super()
        this.vm = vm
        this.node = new Node(this)
        this.tool = new Tool(this)
        this.createGraph(options)

    }
    createGraph(options){
        this.graph = new Graph({
            autoResize: true,
            panning: false,
            background: {
                color: "#edeeef"
            },
            grid: {
                visible: true,
                size: 40,
                type: 'dot',
                args: {
                    thickness: 2
                },
            },
            scaling: {
                min: 0.33,
                max: 3
            },
            ...options
        })

        this.graph.__Stager__ = this
        this.addBox()
        this.createDnd()
        this.createExport()
    }

    createDnd(){
        this.Dnd = new Dnd({
            target: this.graph,
            scaled: false,
            getDropNode: (node) => this.node.getDrop(node),
            validateNode(){
                return false
            },
            dndContainer: document.getElementById('mini-component-list')
        })
    }

    createExport(){
        this.graph.use(new Export())
    }
    
    addBox(){
        let box = this.node.createNode()
        this.graph.addNode(box)
    }
}