
import { Graph } from "@antv/x6"
import GraphDefaultConf from '../config'
import { Dnd } from "@antv/x6-plugin-dnd"

import { Selection } from "@antv/x6-plugin-selection"
import { Scroller } from "@antv/x6-plugin-scroller"
// import { Clipboard } from "@antv/x6-plugin-clipboard"
import { Transform } from "@antv/x6-plugin-transform"
import { Snapline } from '@antv/x6-plugin-snapline'
import { Export } from "@antv/x6-plugin-export"
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { History } from '@antv/x6-plugin-history'

import Registry from '../registry'
import Store from './store'
import Node from './node'
import Region from './region'
import Edge from './edge'
import KeyboardInstface from './keyboard'
import Render from './render'

export default class View extends Registry {
    constructor(vm, config = {}, options = {}){
        super()
        this.vm = vm
        this.options = options

        this.store = new Store()
        this.render = new Render(this)
        this.node = new Node(this)
        this.region = new Region(this)
        this.edge = new Edge(this)
        this.keyboard = new KeyboardInstface(this)
        this.createGraph(config)

        this.graph.on('edge:connected', this.edge.connected.bind(this.edge))
        this.graph.on('edge:click', this.edge.click.bind(this.edge))
        this.graph.on('edge:dblclick', this.edge.dblclick.bind(this.edge))
        this.graph.on('edge:mouseenter', this.edge.mouseenter.bind(this.edge))
        this.graph.on('edge:mouseleave', this.edge.mouseleave.bind(this.edge))
        this.graph.on('node:mouseenter', this.node.mouseenter.bind(this.node))
        this.graph.on('node:mouseleave', this.node.mouseleave.bind(this.node))
        this.graph.on('node:dblclick', this.node.dblclick.bind(this.node))
        this.graph.on('node:move', e => {
            this.graph.startBatch('custom-batch-name')
            if(e.node.shape == 'Connection'){
                this.region.move(e)
            }
        })
        this.graph.on('node:moved', e => {
            if(e.node.shape == 'Connection'){
                this.region.moved(e)
            }else{
                this.node.moved(e)
            }
            this.graph.stopBatch('custom-batch-name')
        })
        this.graph.on('node:resize', e => {
            if(e.node.shape == 'Connection'){
                this.region.resize(e)
            }
        })
        this.graph.on('node:resizing', e => {
            if(e.node.shape == 'Connection'){
                this.region.resizing(e)
            }
        })
        this.graph.on('selection:changed', ({selected}) => {

            if(selected.length <= 0){
                let command = ['del']
                this.graph.trigger('shortcut:change', {
                    action: 'setDisabledIcon',
                    value: command
                })

            }else{
                this.graph.trigger('shortcut:change', {
                    action: 'cleanDisabledIcon',
                    value: ['del']
                })
            }
        })
        this.graph.on('scale', e => {
            let selected = this.graph.getSelectedCells()
            this.graph.cleanSelection()
            this.graph.select(selected)
        })

        this.graph.__view__ = this
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
            this.createDnd()
            this.createSnapline()
            this.createTransform()
            this.createExport()
            this.createKeyboard()
            this.createHistory()
        }
    }

    createTransform(){
        this.graph.use(new Transform({
            resizing: {
                minWidth: 86,
                minHeight: 38,
                enabled(node){
                    return true
                }
            }
        }))
    }

    createDnd(){
        this.Dnd = new Dnd({
            target: this.graph,
            scaled: false,
            getDropNode: (node) => this.node.getDrop(node),
            dndContainer: document.getElementById('aop-graph-flowWorks-widget-list')
        })
    }

    createSelection(){
        this.graph.use(
            new Selection({
                enabled: true,
                rubberband: true,
                showNodeSelectionBox: true,
                pointerEvents: 'none',
            })
        )
        this.graph.setSelectionFilter(cell => {
            return cell.shape !== 'Connection'
        })
    }

    createScroller(){

        this.graph.use(
            new Scroller({
                enabled: true,
                autoResize: true,
                pageWidth: 2000,
                pageHeight: 2000
            })
        )
        this.graph.lockScroller()
    }

    createSnapline(){
        this.graph.use(new Snapline())
    }

    createExport(){
        this.graph.use(new Export())
    }

    createKeyboard(){
        this.graph.use(new Keyboard({
            enabled: true
        }))
        this.graph.bindKey('Backspace', e => {
            this.keyboard.backspace(e)
        })
    }

    createHistory(){
        this.graph.use(new History({
            enabled: true,
            beforeAddCommand(e, options){
                return options.key != 'attrs'
            }
        }))
    }
}
