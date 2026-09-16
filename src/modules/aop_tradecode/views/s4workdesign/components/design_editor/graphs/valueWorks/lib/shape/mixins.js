import rpcMixins from '@m/core/mixin/'
export default [
    rpcMixins,
    {
        inject: ["getNode", "getGraph"],
        filters: {
            formatH(value) {
                if (value) {
                    return `(${value})`
                }
                return ''
            }
        },
        computed: {
            desc({ options }) {
                const { attributeInfos, objectBehaviorInfos } = options
                if ((attributeInfos && attributeInfos.length) || (objectBehaviorInfos && objectBehaviorInfos.length)) {
                    let pcount = attributeInfos ? attributeInfos.length : '0'
                    let bcount = objectBehaviorInfos ? objectBehaviorInfos.length : '0'
                    return `${pcount}模型属性 ${bcount}对象行为`
                }
                return undefined
            }
        },
        mounted() {
            this.initEvent()
        },
        methods: {
            initEvent() {
                this.getGraph().on('node:getData', this.nodeGetData.bind(this))
                this.getGraph().on('node:save', this.saveBizVsmContent.bind(this))
                this.getGraph().on('node:edit:handle', this.editorResult.bind(this))
                let node = this.getNode()
                node.on('change:data', ({ current }) => {
                    this.options = Object.assign({}, this.options, current)
                    // this.resetShape(current)
                    this.$nextTick(() => {
                        if (this.show) {
                            this.calc()
                        }
                    })
                })
                // node.on('custom:change:actived', ({actived}) => {
                //     this.actived = actived
                // })
            },
            nodeGetData(data, info) {
                this.fromDataList = data
                if (info) {
                    this.info = info
                }
                let node = this.getNode()
                node.setData(this.fromDataList, { overwrite: true })
            },
            deleteNode() {
                let node = this.getNode()
                node.trigger("custom:node:operate", {
                    action: "remove",
                });
                node.setData(this.fromDataList, { overwrite: true })
            },
            selectNode(index) {
                if (this.info.save) {
                    this.abId = index
                    this.getNode().trigger('custom:node:operate', {
                        action: 'select',
                        data: this.fromDataList[index]
                    })
                }
            },
            showHandle() {
                this.show = !this.show
            },
            calc() {
                let ref = this.$refs.body
                this.getNode().prop('size', { width: ref.offsetWidth, height: ref.offsetHeight + 40 })
            },
            editor(item) {
                this.getNode().trigger('custom:node:operate', {
                    action: 'edit',
                    data: item
                })
            },
            editFlowName() {
                if (this.info.save) {
                    this.getNode().trigger('custom:node:operate', {
                        action: 'edit',
                        data: this.info,
                        type: 'editFlow'
                    })
                }
            },
            editorResult(result) {
                if (!result.segCode) {
                    this.info = result
                }
                this.$forceUpdate()
                this.changeNode()
            },
            unlink() {
                this.$confirm('确认要取消聚合吗?', '取消聚合', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let node = this.getNode()
                    node.eachChild(child => {
                        node.unembed(child)
                    })
                    this.getGraph().removeNode(node.id)
                })
            },
            // resetShape(option) {
            //     let shape = ''
            //     if (option.objAggRoor) {
            //         shape = 'ConnectionRoot'
            //     } else if (option.objType == '00') {
            //         shape = 'ConnectionObject'
            //     } else {
            //         shape = 'ConnectionValue'
            //     }
            //     this.$emit('update:shape', shape)
            // },
            async saveBizVsmContent(query) {
                if (query == 'img') {
                    this.abId = null
                    this.$forceUpdate()
                } else {
                    let segmentInfos = this.fromDataList
                    await Promise.all([
                        this.rpc.graph.updateBizVsm(this.info),
                        this.rpc.graph.saveBizVsmContent({ baiId: this.info.baiId, vsmId: query.vsmId, segmentInfos })
                    ]
                    )
                    this.$notify({
                        title: '成功',
                        message: '保存成功！',
                        duration: 2000,
                        type: 'success'
                    })
                }
            },

            addLocal(data, index) {
                this.getNode().trigger('custom:node:operate', {
                    action: 'add',
                    data: data,
                    type: index
                })
            },
            changeNode() {
                this.$nextTick(() => {
                    var myDiv = document.getElementById("setDiv");
                    if (myDiv.offsetWidth > 664) {
                        this.myDivWidth = myDiv.offsetWidth + 256
                        this.getNode().size({ width: myDiv.offsetWidth + 256, height: 150 })
                    }

                })
            }
        },
        watch: {
            show(val) {
                this.$nextTick(() => {
                    this.calc()
                })
            }
        }
    }

]
