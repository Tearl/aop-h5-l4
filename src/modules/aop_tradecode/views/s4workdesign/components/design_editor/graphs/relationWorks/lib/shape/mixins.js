import x6ShapeBar from './x6-shape-bar'
export default [
    {
        inject: ['getGraph','getNode'],
        components: { x6ShapeBar },
        data(){
            return {
                embed: false,
                preview: true,
                options: {}
            }
        },
        mounted(){

            let node = this.getNode()
            let graph = this.getGraph()
            let { preview, embed } = graph.__view__.options
            this.options = Object.assign({}, node.data || {})
            this.preview = preview
            this.embed = embed

            if(!this.preview){
                node.on('change:data', ({current}) => {
                    this.options = Object.freeze(Object.assign({}, current))
                })
            }

        },
        methods: {
            drill(){
                let { data } = this.getNode()
                this.getGraph().__view__.vm.$emit('drill', data.fnId)
            }
        },
        computed: {
            objectsLen({options}){
                return Array.isArray(options.objects) ? options.objects.length : 0 
            },
            vouchersLen({options}){
                return Array.isArray(options.vouchers) ? options.vouchers.length : 0 
            }
        }
    }
]