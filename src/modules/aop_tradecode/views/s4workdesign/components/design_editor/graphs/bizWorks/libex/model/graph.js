import { Graph } from "@antv/x6"
import { Dnd } from "@antv/x6-plugin-dnd"
import { Transform } from "@antv/x6-plugin-transform"
import { Selection } from "@antv/x6-plugin-selection"
import { Scroller } from "@antv/x6-plugin-scroller"
import { Clipboard } from "@antv/x6-plugin-clipboard"
import { Export } from "@antv/x6-plugin-export"

import Stroe from './store'
import Registry from '../registry'
import Node from './node'
import Edge from './edge'
import Blank from './blank'
import Tool from './tool'

import Render from '../render'

export default class View extends Registry {

    get graphDialog(){
        return this.vm.$refs.graphsDialog
    }

    get getNodesData(){
        return this.node.getNodesData
    }

    constructor(vm, options = {}, preview, layout){

        super()
        this.vm = vm
        this.preview = preview
        this.layout = layout

        this.store = new Stroe()
        this.node = new Node(this)
        this.edge = new Edge(this)
        this.blank = new Blank(this)
        this.tool = new Tool(this)
        this.render = new Render(this)

        this.createGraph(options)
        
        this.graph.on('blank:click', this.blank.click.bind(this.blank))
        this.graph.on('node:click', this.node.click.bind(this.node))
        this.graph.on('node:dblclick', this.node.dblclick.bind(this.node))
        this.graph.on('node:added', this.node.added.bind(this.node))
        this.graph.on('node:move', this.node.move.bind(this.node))
        this.graph.on('node:edit', this.node.edit.bind(this.node))
        this.graph.on('node:removed', this.node.remove.bind(this.node))
        this.graph.on('selection:changed', this.node.selection.bind(this.node))
        this.graph.on('custom:node:beforeRemove', this.node.beforeRemove.bind(this.node))
        this.graph.on('edge:connected', this.edge.connected.bind(this.edge))
        this.graph.on('edge:click', this.edge.click.bind(this.edge))
        this.graph.on('edge:removed', this.edge.remove.bind(this.edge))
        this.graph.on('scale', this.tool.scale.bind(this))
    }

    createGraph(options){
        this.graph = new Graph({
            autoResize: true,
            panning: false,
            background: {
                color: "#edeeef"
            },
            // grid: {
            //     visible: true,
            //     size: 40,
            //     type: 'dot',
            //     args: {
            //         thickness: 2
            //     },
            // },
            grid: false,
            scaling: {
                min: 0.33,
                max: 3
            },
            connecting: {
                allowBlank: false,
                allowLoop: false,
                allowMulti: false,
                validateEdge: this.edge.validate
            },
            embedding: {
                enabled: true,
                findParent({ node }) {
                    if(node.shape == 'Collection' || node.shape == 'widgetCollection'){
                        return []
                    }
                    const bbox = node.getBBox()
                    return this.getNodes().filter((node) => {
                        const data = node.getData()
                        if (data && node.shape == 'Collection') {
                          const targetBBox = node.getBBox()
                          return bbox.isIntersectWithRect(targetBBox)
                        }
                        return false
                    })
                }
            },
            ...options
        })


        this.graph.__Stager__ = this
        this.createDnd()
        this.createSelection()
        this.createScroller()
        this.createTransform()
        this.createClipboard()
        this.createExport()

        this.graph.toggleSelection(true)
        this.graph.centerContent()
    }

    createScroller(){
        this.graph.use(new Scroller({
            enabled: true
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

    createDnd(){
        this.Dnd = new Dnd({
            target: this.graph,
            scaled: false,
            getDropNode: (node) => this.node.getDrop(node),
            dndContainer: document.getElementById('mini-component-list')
        })
    }

    createTransform(){
        this.graph.use(new Transform({
            resizing: {
                minWidth: 100,
                minHeight: 100,
                enabled(node){
                    return node.shape == 'Collection'
                }
            }
        }))
    }

    createClipboard(){
        this.graph.use(new Clipboard({
            enabled: true
        }))
    }

    createExport(){
        this.graph.use(new Export())
    }

}