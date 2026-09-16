
import Basic from './basic'
export default class Edge extends Basic {
    constructor(context){
        super(context)
    }

    formatLabel(text = ''){
        return {
            attrs: {
                label: {
                    text,
                },
                text: {

                    fill: '#333',
                    fontSize: 12,
                    // fontWeight: 'bold'
                }
            },
            position: {
                // distance: 1
            }
        }
    }

    formatEdge(meta){

        let { curFnId, tgtFnId, sourcePort, targetPort } = meta
        meta.port = {
            targetPort: 'port_1'
        }

        let info = {
            attrs: {
                line: {
                    sourceMarker: {
                        name: null,
                        offset: -2
                    }
                }
            },
            source: {
                cell: this.store.get(curFnId),
            },
            target: {
                cell: this.store.get(tgtFnId),
            },
            zIndex: -1,
            data: meta
        }

        if(sourcePort){
            info.source.port = sourcePort
        }

        if(targetPort){
            info.target.port = targetPort
        }


        if(meta.seleType || meta.fnrDesc){
            Object.assign(info, {
                label: this.formatLabel(meta.seleType || meta.fnrDesc)
            })
        }

        return info
    }

    async connected(e){
        // let source = e.edge.getSource()
        // let target = e.edge.getTarget()
        // e.edge.setSource({
        //     cell: source.cell,
        //     connectionPoint: 'boundary',
        //     args: {
        //         sticky: true
        //     }
        // })
        // e.edge.setTarget({
        //     cell: target.cell,
        //     connectionPoint: 'boundary',
        //     args: {
        //         sticky: true
        //     }
        // })

        e.edge.replaceData({
            fnrName: '',
            fnrDesc: '',
            seleType: ''
        })

        setTimeout(() => {
            this.mouseleave(e)
        })

    }

    click(e){
        this.graph.resetSelection(e.edge)
    }

    async dblclick(e){

        let sourceNode = e.edge.getSourceNode()
        let valid = await this.dialog.showEdge({
            shape: sourceNode.shape,
            ...e.edge.data
        })

        if(valid){
            let label = sourceNode.shape == 'ConditionConnection' ? valid.seleType : valid.fnrDesc
            e.edge.replaceData({...e.edge.data, ...valid})
            e.edge.setLabels(this.formatLabel(label))
        }

    }

    mouseenter(e){
        e.edge.attr('line/stroke', '#5F95FF')
    }

    mouseleave(e){
        e.edge.attr('line/stroke', '#333')
    }
}
