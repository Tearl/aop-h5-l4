
import Basic from './basic'
import _ from 'lodash'

export default class Edge extends Basic {
    constructor(context){
        super(context)
    }

    marker(value){
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

    label(value){
        let text = this.relationshipValue(value) || value
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
                    cursor: 'pointer',
                }
            },
            position: {
                options: {
                    keepGradient: true
                }
            },
        }
    }

    relationshipValue(value){
        let map = {
            '0-N': '1:0..*',
            '1-N': '1:1..*',
            '0-1': '1:0..1',
            '1-1': '1:1'
        }
        return map[value]
    }

    formatEdge(meta){

        let { curObjCode, tgtObjCode } = meta
        let source = this.store.get(curObjCode)
        let target = this.store.get(tgtObjCode)
        let edgeMeta = {
            id: `edge-${curObjCode}-${tgtObjCode}`,
            shape: 'edge',
            zIndex: 0,
            source, target,
            attrs: {
                line: {
                    stroke: '#333',
                    strokeWidth: 2,
                    targetMarker: this.marker(meta.obrRelash)
                }
            },
            labels: [],
            data: meta
        }

        if(meta.obrRelash != 'extends'){
            edgeMeta.labels = [this.label(meta.relashMult)]
        }

        return edgeMeta
    }

    createEdge(meta){
        let { curObjCode, tgtObjCode } = meta.data
        let key = `edge-${curObjCode}-${tgtObjCode}`
        let edge = this.graph.createEdge(meta)
        this.store.set(key, edge.id)
        return edge
    }

    operate(data){
        let nodeId = this.store.get(data.objCode)
        let node = this.graph.getCellById(nodeId)
        let originEdges = (this.graph.getOutgoingEdges(node) || []).slice(0)
        let validateEdge = m => {
            let { curObjCode, tgtObjCode } = m
            let curId = this.store.get(curObjCode)
            let tgtId = this.store.get(tgtObjCode)
            if(curId && tgtId){
                return { curId, tgtId }
            }
            return null
        }
        this.graph.startBatch('custom-batch-name')
        let edges = data.objectRelInfos.reduce((pre, item) => {
            let valid = validateEdge(item)
            if(valid){
                let edgeKey = `edge-${item.curObjCode}-${item.tgtObjCode}`
                let edgeId = this.store.get(edgeKey)
                let edge = this.graph.getCellById(edgeId)
                if(edge){
                    //更新
                    if(item.obrRelash == 'extends'){
                        edge.removeLabelAt(0)
                    }else{
                        edge.setLabels(this.label(item.relashMult))
                    }
                    edge.attr('line/targetMarker', this.marker(item.obrRelash))

                    let index = originEdges.findIndex(e => e.id == edgeId)
                    if(index > -1){
                        originEdges.splice(index, 1)
                    }
                }else{
                    let edm = this.formatEdge(item)
                    pre.push(this.createEdge(edm))
                }
            }
            return pre
        }, [])
        this.graph.addEdges(edges).removeCells(originEdges)
        this.graph.stopBatch('custom-batch-name')
    }

    contextmenu(e){
        const pos = this.graph.localToPage(e.x, e.y)
        this.vm.getContextMenu().calc(pos).then(() => {
            let sourceCell = e.edge.getSourceCell()
            let sourceData = sourceCell.data || {}
            sourceData.objectRelInfos = sourceData.objectRelInfos.filter(o => {
                return o.curObjCode != e.edge.data.curObjCode
            })
            sourceCell.replaceData(sourceData)
            this.graph.removeEdge(e.edge)
        }).catch(() => {

        })
    }

    click(e){

    }

    dblclick(e){
        let source = e.edge.getSourceCell()
        let target = e.edge.getTargetCell()

        this.dialog.relation(source.data, target.data.objCode).then(res => {
            if(res){
                this.operate(res)
            }
        })
    }

    async connected(e){
        console.log('edge:connected')
        let { isNew, edge, currentCell } = e
        if(isNew){
            let source = edge.getSource()
            let sourceNode = this.graph.getCellById(source.cell)
            let targetNode = this.graph.getCellById(currentCell.id)
            let result = await this.dialog.relation(_.cloneDeep(sourceNode.data),  targetNode.data.objCode)
            this.graph.removeEdge(edge)
            if(result){
                let edges = result.objectRelInfos.map(item => {
                    let edm = this.formatEdge(item)
                    return this.createEdge(edm)
                })
                this.graph.addEdges(edges)
                sourceNode.replaceData(result)
            }
        }
    }

}
