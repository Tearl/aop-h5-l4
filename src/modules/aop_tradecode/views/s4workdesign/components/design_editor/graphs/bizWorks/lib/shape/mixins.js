


export default [{
    inject: ['getNode', 'getGraph'],
    data(){
        return {
            expand: false,
            options: {}
        }
    },
    mounted(){
        let node = this.getNode()
        this.setData(node.data)
        node.on('change:data', ({ current }) => {
            this.setData(current)
        })
    },
    beforeDestroy(){},
    computed: {
        desc({options}){
            const { attributeInfos } = options
            if((attributeInfos && attributeInfos.length)){
                return `${attributeInfos.length}模型属性`
            }
            return undefined
        }
    },
    methods: {
        setData(current = {}){
            let res = Object.assign({}, current)
            this.options = Object.freeze(res)
        },
        toggleExpand(){
            this.expand = !this.expand
            this.$nextTick(() => {
                this.caleSize()
            })
        },
        caleSize(){
            let ref = this.$refs.main
            this.getNode().prop('size', {width:ref.offsetWidth,height:ref.offsetHeight + 40})
        }
    }
}]