import _ from 'lodash'
import { relationshipValueMap, ports, usePorts } from '../config'
import Basic from './basic'
export default class Tool extends Basic {
    
    constructor(context){

        super(context)

        this.toolsMap = {
            name: 'EdgeTools',
            attrs: {
                cursor: 'pointer'
            },
            args: {
                rotate: true,
                distance: 0.5
            }
        }
    }

    cloneDeep(data){
        return _.cloneDeep(data)
    }

    formatShape(meta){
        let { objAggRoor, objType, metadateType } = meta
        if(metadateType == 'aggregate'){
            return 'Collection'
        }else{
            if(objAggRoor && objAggRoor == '0'){
                return 'ConnectionRoot'
            }else if(objType == '00'){
                return 'ConnectionObject'
            }else{
                return 'ConnectionValue'
            }
        }
    }

    formatCollectionMeta(meta){

        if(!meta.point){
            meta.point = {}
        }

        if(!meta.colour){
            meta.colour = ''
        }

        let { colour = '', point = {} } = meta
        return {
            shape: meta.shape,
            width: Number(Math.max(point.width || 0, 280)),
            height: Number(Math.max(point.height || 0, 180)),
            x: Number(point.pointX || 0),
            y: Number(point.pointY || 0),
            zIndex: -1,
            data: {
                color: colour,
                objCode: meta.objCode || '',
                objName: meta.objName || '',
                objId: meta.objId || '',
                objDesc: meta.objDesc || ''
            }
        }
    }

    formatConnectionMeta(meta){
        
        if(!meta.point){
            meta.point = {}
        }

        return {
            shape: meta.shape,
            width: 180,
            height: 80,
            x: Number(meta.point.pointX || 0),
            y: Number(meta.point.pointY || 0),
            ports: {
                ...ports,
                ...usePorts
            },
            data: {
                objCode: meta.objCode || '',
                objName: meta.objName || '',
                objId: meta.objId || '', 
                objDesc: meta.objDesc || '',
                objType: meta.objType || '',
                objAggRoor: meta.objAggRoor,
                objClass: meta.objClass,
                objClassName: meta.objClassName,
                attributeInfos: meta.attributeInfos || [],
                objectRelInfos: meta.objectRelInfos || [],
                objectBehaviorInfos: meta.objectBehaviorInfos || []
            }
        }
    }

    formatEdgeMeta(meta){

    }

    formatMeta(meta){
        if(meta.isNode && meta.isNode()){
            return meta
        }
        if(!meta.shape){
            meta.shape = this.formatShape(meta)
        }
    
        if(meta.shape == 'Collection'){
            return this.formatCollectionMeta(meta)
        }
    
        return this.formatConnectionMeta(meta)
    }

    formatLabel(value){
        let text = relationshipValueMap[value] || value
        return {
            attrs: {
                label: {
                    text,
                },
                rect: {
                    ref: 'label',
                    stroke: 'rgba(31,56,88,.6)',
                    strokeWidth: 2,
                    rx: 4,
                    ry: 4,
                    refWidth: '140%',
                    refHeight: '100%',
                    refX: '-20%',
                    refY: '-0%',
                }
            },
            position: {
                options: {
                    keepGradient: true
                }
            },
        }
    }

    formatMarker(value){
        let name = 'path'
        switch(value){
            case 'combination':
                return {
                    name,
                    d: 'M 30 10 L 20 16 L 10 10 L 20 4 z',
                    fill: 'black',
                    offsetX: -10
                }
            case 'aggregation':
                return {
                    name,
                    d: 'M 30 10 L 20 16 L 10 10 L 20 4 z',
                    fill: 'white',
                    offsetX: -10
                }
            case 'association':
                return {
                    name,
                    d: 'M 6 10 L 18 4 C 14.3333 6 10.6667 8 7 10 L 18 16 z',
                    strokeWidth: 2,
                    offsetX: -7,
                }
            case 'extends':
                return {
                    name,
                    d: 'M 14 -8 0 0 14 8 Z',
                    fill: 'white',
                    offsetX: -7,
                }
        }
    }

    scale(){
        let selected = this.graph.getSelectedCells()
        this.graph.cleanSelection()
        this.graph.select(selected)
    }

    resetEdgeTools(e){
        let edges = this.ctx.graph.getEdges()
        edges.map(edge => {
            if(e && e.edge){
                if(e.edge.id != edge.id){
                    edge.removeTool('EdgeTools')
                }else{
                    this.toolsMap.args.onClick = this.click.bind(this)
                    edge.addTools([this.toolsMap])
                }
            }else{
                edge.removeTool('EdgeTools')
            }
        })
        return this
    }

    resetNodeTools(){
        this.vm.actived = ''
        return this
    }

    click(event){
        let { e, view, btn, cell } = event
        if(e.target.id == 'bwf-icon-editor'){
            let source = cell.getSource()
            let sourceNode = this.graph.getCellById(source.cell)
            let sourceNodeData = this.node.getNodeData(sourceNode)
            let target = cell.getTarget()
            let targetNode = this.graph.getCellById(target.cell)
            let targetNodeData = targetNode.getData()
            this.ctx.graphDialog.relation(sourceNodeData, targetNodeData.objCode).then(res => {
                if(res){
                    this.edge.operate(sourceNode, res.objectRelInfos)
                    sourceNode.replaceData(res)
                }
            })
        }

        if(e.target.id == 'bwf-icon-del'){
            btn.parent.remove()
            view.cell.remove({ ui: true, toolId: btn.cid })
        }
    }

    exportPNG(){
        let bbox = this.graph.getAllCellsBBox()
        if(!bbox){ return }

        this.resetEdgeTools().resetNodeTools()
        this.graph.exportPNG("file", {
            width: bbox.width * 2,
            height: bbox.height * 2,
            padding: 10,
            quality: 1,
            backgroundColor: '#edeeef',
            stylesheet: `
                .x6-custom-bizWorks-shape .body{
                    border: solid 1px #dfe0e1;   
                    border-radius: 6px;
                }
                .x6-custom-bizWorks-shape .header {
                    height: 40px;
                    line-height: 40px;
                    border-radius: 6px 6px 0 0;
                }
                .x6-custom-bizWorks-shape .main {
                    border-radius: 0 0 6px 6px;
                    background-color: #fff;
                    border: 1px solid #dfe0e1;
                    overflow: hidden;
                    height: 100%;
                }
                .x6-custom-bizWorks-shape .layout{
                    display:flex;
                    align-items: center;
                }
                .x6-custom-bizWorks-shape.collection .header{
                    color: #000;
                    height: 24px;
                    line-height: 24px;
                    text-align:center
                }
                .x6-custom-bizWorks-shape.collection .main
                {
                    background-color: transparent;
                }
            `
        })
    }


}