


export default [
    {
        inject: ["getNode", "getGraph"],
        filters: {
            formatH(value){
                if(value){
                    return `(${value})`
                }
                return ''
            }
        },
        computed: {
            desc({options}){
                const { attributeInfos, objectBehaviorInfos } = options
                if((attributeInfos && attributeInfos.length) || (objectBehaviorInfos && objectBehaviorInfos.length)){
                    let pcount = attributeInfos ? attributeInfos.length : '0'
                    let bcount = objectBehaviorInfos ? objectBehaviorInfos.length : '0'
                    return `${pcount}模型属性 ${bcount}对象行为`
                }
                return undefined
            }
        },
        mounted(){
            let node = this.getNode()
            let data = node.getData()
            if(data.objCode){
                this.options = data
            }

            node.on('change:data', ({ current }) => {
                this.options = current
                this.resetShape(current)
            })

            node.on('custom:change:actived', ({ actived }) => {
                this.actived = actived
            })
        },
        beforeDestroy(){
            
        },
        methods: {
            deleteNode(){
                let node = this.getNode()
                this.getGraph().trigger('custom:node:beforeRemove', {id:node.id})
            },
            showHandle(){
                this.show = !this.show
            },
            calc(){
                let ref = this.$refs.main
                this.getNode().prop('size', {width:ref.offsetWidth,height:ref.offsetHeight + 40})
            },
            editor(){
                this.getGraph().trigger('node:edit', { id: this.getNode().id })
            },
            unlink(){
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
            resetShape(options){
                let shape = this.getGraph().__Stager__.tool.formatShape(options)
                this.$emit('update:shape', shape)
            }
        },
        watch: {
            show(val){
                this.$nextTick(() => {
                    this.calc()
                })
            }
        }
    }
]