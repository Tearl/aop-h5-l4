import rpcMixins from '@m/core/mixin/'
export default [
    rpcMixins,
    {
        mounted(){
            this.getBizVsmContentList()
        },
        methods: {
  
            async getBizVsmContentList() {
                let vsmId = this.$route.query.vsmId
                let res = await this.rpc.graph.getBizVsmContentList({ vsmId })
                this.Stager.graph.trigger('node:getData',res.segmentInfos,this.$route.query)
                console.log('价值流列表',res.segmentInfos)
            },
            //   async qryKeyActivityByVsmList(){
            //     let baiId = this.$route.query.baiId
            //     let res = await this.rpc.graph.qryKeyActivityByVsmList({baiId})
            // },
        }
    }
]