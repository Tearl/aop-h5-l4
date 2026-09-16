
import GraphDefaultConf from '../config'
import { Graph } from "@antv/x6"
import { Selection } from "@antv/x6-plugin-selection"
import { Scroller } from "@antv/x6-plugin-scroller"
// import { Clipboard } from "@antv/x6-plugin-clipboard"
import { History } from '@antv/x6-plugin-history'
import { Export } from "@antv/x6-plugin-export"
import Register from '../regsiter'

import Store from './store'
import Render from './render'
import Node from './node'
import Edge from './edge'

export default class View extends Register {
    constructor(vm, config = {}, options = {}){
        super(options)
        this.vm = vm

        this.store = new Store()
        this.render = new Render(this)
        this.node = new Node(this)
        this.edge = new Edge(this)
        
        this.createGraph(config)

        this.graph.on('node:dblclick', this.node.dblclick.bind(this.node))
        this.graph.on('edge:dblclick', this.edge.dblclick.bind(this.edge))
        if(!this.options.preview){
            this.graph.on('edge:connected', this.edge.connected.bind(this.edge))
            this.graph.on('edge:contextmenu', this.edge.contextmenu.bind(this.edge))
            // this.graph.on('edge:click', this.edge.click.bind(this.edge))
        }
    }

    createGraph(config){
        this.graph = new Graph({
            ...GraphDefaultConf,
            ...config
        })

        this.graph.center()
        this.createScroller()
        this.createSelection()
        if(!this.options.preview){
            // this.createClipboard()
            this.createHistory()
            this.createExport()
        }
        this.createHistory()
    }

    createScroller(){
        this.graph.use(new Scroller({
            enabled: true,
            autoResize: true,
            pageWidth: 2000,
            pageHeight: 2000
        }))
        this.graph.lockScroller()
    }

    createSelection(){
        this.graph.use(new Selection({
            enabled: true,
            rubberband: true,
            showNodeSelectionBox: true,
            pointerEvents: 'none',
            filter(cell){
                return this.isNode(cell)
            }
        }))
    }

    // createClipboard(){
    //     this.graph.use(new Clipboard({
    //         enabled: true
    //     }))
    // }

    createExport(){
        this.graph.use(new Export())
    }

    createHistory(){
        this.graph.use(new History({
            enabled: true,
            ignoreAdd: true,
            ignoreRemove: true
        }))
    }
}