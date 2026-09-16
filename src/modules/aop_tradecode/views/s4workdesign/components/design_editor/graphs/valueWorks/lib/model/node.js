import Basic from './basic'
import mixin from '@m/core/mixin'
import ShapeComponents from '../shape'
import { async } from '@antv/x6/lib/registry/marker/async'
export default class Node extends Basic {

    constructor(context) {
        super(context)
    }

    drop($event, data) {
        let node = this.graph.createNode(data)
        this.ctx.Dnd.start(node, $event)
    }

    getDrop(node) {
        let name = node.shape.replace(/^Mini/, '')
        let componentOpt = ShapeComponents.find(c => c.shape == name)
        let n = this.graph.createNode(componentOpt)
        this.validateNode()
        return n
    }

    createNode() {
        let { width, height } = ShapeComponents[0]
        this.box = this.graph.createNode({
            shape: 'CollectionValue',
            size: {
                width,
                height
            },
            position: {
                x: 20, y: 20
            },
            data: {}
        })
        this.initEvent()
        return this.box
    }

    async editNode({ data, type }) {
        let cloneData = this.tool.cloneDeep(data || {})
        let result = await this.ctx.valueFlowDiaog.show(cloneData, type)
        if (result) {
            this.box.trigger('custom:node:operate', {
                action: 'edited',
                data: result
            })
        }
    }

    initEvent() {
        this.box.on('custom:node:operate', async ({ action, data, type }) => {
            console.log('custom:node:operate', action, data, type, this.selectNode);
            let fromDataList = this.box.getData()
            if (action == 'add') {
                if (data == 'next' || data == 'last') {
                    this.vm.rpc.graph.getSegmentCode().then(async (res) => {
                        let result = await this.ctx.valueFlowDiaog.show({ segCode: res.segCode })
                        let index = data == 'next' ? type + 1 : type
                        fromDataList.splice(index, 0, result)
                        this.box.trigger("change:data", {
                        });
                    });
                } else {
                    fromDataList.push(data)
                }

            }
            if (action == 'edit') {
                this.editNode({ data, type })
                fromDataList.map((item, index) => {
                    if (item.segCode == data.segCode) {
                        this.editIndex = index
                    }
                })
            }
            if (action == 'edited') {

                if (this.editIndex >= 0 && data.segCode) {
                    fromDataList[this.editIndex] = data
                }
                this.graph.trigger('node:edit:handle', data)
                this.box.trigger("change:data", {
                });
            }
            if (action == 'remove') {
                if (data?.segCode) {
                    fromDataList.map((item, index) => {
                        if (item.segCode == data.segCode) {
                            fromDataList.splice(index, 1)
                        }
                    })
                } else {
                    fromDataList.map((item, index) => {
                        if (item.segCode == this.selectNode?.segCode) {
                            fromDataList.splice(index, 1)
                        }
                    })
                }
                this.box.trigger("change:data", {
                });
                this.ctx.vm.toolData.copy = false
                this.ctx.vm.toolData.del = false
            }
            if (action == 'copy') {
                if (this.selectNode) {
                    this.copyData = this.selectNode
                    this.copyData.segId = ''
                    this.pasteNum = '0'
                }
            }
            if (action == 'paste') {
                if (this.copyData) {
                    let pasteData = JSON.parse(JSON.stringify(this.copyData))
                    pasteData.segName = this.copyData.segName + '_' + this.pasteNum + 'copy'
                    this.vm.rpc.graph.getSegmentCode().then((res) => {
                        pasteData.segCode = res.segCode
                        fromDataList.push(pasteData);
                        this.box.trigger("change:data", {
                        });
                        this.pasteNum++
                    });
                }
            }
            if (action == 'select') {
                if (this.vm.$route.query?.save) {
                    this.selectNode = data
                    this.ctx.vm.toolData.copy = true
                    this.ctx.vm.toolData.del = true
                }
            }
        })
    }

    validateNode() {
        if (this.vm.$route.query?.save) {
            this.vm.rpc.graph.getSegmentCode().then(async (res) => {
                let result = await this.ctx.valueFlowDiaog.show({ segCode: res.segCode })
                if (result) {
                    this.box.trigger('custom:node:operate', {
                        action: 'add',
                        data: result
                    })
                }
            });
        }
        return false
    }
}