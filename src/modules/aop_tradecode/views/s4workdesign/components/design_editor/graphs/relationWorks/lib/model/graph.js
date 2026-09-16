
import { Graph } from "@antv/x6"
import { Dnd } from "@antv/x6-plugin-dnd"
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Selection } from "@antv/x6-plugin-selection"
import { Transform } from "@antv/x6-plugin-transform"
import { Export } from "@antv/x6-plugin-export"
import { Scroller } from "@antv/x6-plugin-scroller"
import { Clipboard } from "@antv/x6-plugin-clipboard"
import { History } from '@antv/x6-plugin-history'

import Registry from '../registry'
import Node from './node'
import Tool from './tool'
import Edge from './edge'
import Region from './region'
import Render from './render'
import KeyboardInstface from './keyboard'
import HistoryInstface from './history'

export default class View extends Registry {
    constructor(vm,  conf = {}, options = {}){
        super(options)
        this.options = options
        this.vm = vm

        this.node = new Node(this)
        this.tool = new Tool(this)
        this.edge = new Edge(this)
        this.region = new Region(this)
        this.render = new Render(this)
        this.keyboard = new KeyboardInstface(this)
        this.history = new HistoryInstface(this)
        this.createGraph(conf)
        this.graph.__view__ = this

        this.graph.on('scale', this.tool.scale.bind(this))
        this.graph.on('edge:connected', this.edge.connected.bind(this.edge))
        this.graph.on('edge:dblclick', this.edge.dblclick.bind(this.edge))
        this.graph.on('edge:mouseenter', this.edge.mouseenter.bind(this.edge))
        this.graph.on('edge:mouseleave', this.edge.mouseleave.bind(this.edge))
        this.graph.on('node:dblclick', this.node.dblclick.bind(this.node))
        this.graph.on('node:move', e => {
            if(e.node.shape == 'x6-shape-region'){
                this.region.move(e.node)
            }
        })
        this.graph.on('node:moved', e => {
            if(e.node.shape == 'x6-shape-region'){
                this.region.moved(e.node)
            }else if(e.node.shape == 'x6-shape-node-level4'){
                this.node.moved(e.node)
            }
        })
        this.graph.on('selection:changed', ({selected}) => {
            if(selected.length <= 0){
                let command = ['copy','del']
                if(this.graph.isClipboardEmpty()){
                    command.push('paste')
                }

                this.graph.trigger('shortcut:change', {
                    action: 'setDisabledIcon',
                    value: command
                })

            }else{
                this.graph.trigger('shortcut:change', {
                    action: 'cleanDisabledIcon',
                    value: ['copy','del']
                })
            }
        })
        this.graph.on('node:resize', this.region.resize.bind(this.region))
        this.graph.on('node:resizing', this.region.resizing.bind(this.region))
        this.graph.on('node:resized', this.region.resized.bind(this.region))
    }


    createGraph(conf){
        this.graph = new Graph({
            panning: false,
            autoResize: true,
            mousewheel: {
                enabled: true,
                factor: 1,
                modifiers: ['ctrl']
            },
            background: {
                color: this.options.embed ? "#ffffff" :"#edeeef"
            },
            grid: false,
            connecting: {
                allowBlank: false,
                allowLoop: false,
                allowMulti: false,
                allowPort: false,
                router: 'manhattan',
                createEdge(options){
                    let edge = this.createEdge({
                        attrs: {
                            line: {
                                stroke: '#333',
                                strokeWidth: 1.2,
                                targetMarker: {
                                    name: 'block',
                                    size: 8
                                }
                            }
                        },
                        zIndex: 0
                    })
                    return edge
                },
                validateConnection({sourceCell, targetCell}){
                    if(sourceCell == targetCell || targetCell.shape == 'x6-shape-region'){ return false }
                    return true
                }
            },
            interacting: !this.options.preview,
            ...conf
        })

        this.graph.center()

        if(!this.options.preview){
            this.createDnd()
            this.createSnapline()
            this.createSelection()
            this.createTransform()
            this.createExport()
            this.createClipboard()
            this.createKeyboard()
            this.createHistory()
            this.createScroller()
            this.graph.toggleSelection(true)
            this.graph.centerContent()
        }else{
            this.graph.toggleSelection(false)
            this.graph.togglePanning(true)
        }
    }

    createDnd(){
        this.Dnd = new Dnd({
            target: this.graph,
            scaled: false,
            getDropNode: (node) => {
                if(node.shape == 'x6-widget-region'){
                    return this.region.getDrop(node)
                }
                return this.node.getDrop(node)
            },
            dndContainer: document.getElementById('aop-graph-relationWorks-widget-list')
        })
    }

    createSnapline(){
        this.graph.use(new Snapline())
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
            return cell.shape !== 'x6-shape-region'
        })
    }

    createTransform(){
        this.graph.use(new Transform({
            resizing: {
                minWidth: 86,
                minHeight: 38,
                allowReverse: false,
                enabled(node){
                    return node.shape == 'x6-shape-region'
                }
            }
        }))
    }

    createExport(){
        this.graph.use(new Export())
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

    createClipboard(){
        this.graph.use(new Clipboard({
            enabled: true
        }))
    }

    createKeyboard(){
        this.graph.use(new Keyboard({
            enabled: true
        }))
        this.graph.bindKey('Backspace', e => { this.keyboard.backspace(e) })
        this.graph.bindKey(['Ctrl+c','Command+c'], e => { this.keyboard.ctrlC(e) })
        this.graph.bindKey(['Ctrl+v','Command+v'], e => { this.keyboard.ctrlV(e) })
    }

    createHistory(){
        this.graph.use(new History({
            enabled: true
        }))
    }
}