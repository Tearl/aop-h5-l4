<template>
    <div class="x6-custom-bizWorks-shape collection">
        <div class="tool" v-show="actived">
            <span @click="editor">编辑</span>
            <span @click="unlink">解绑</span>
            <!-- <span @click="deleteNode">删除</span> -->
        </div>
        <div class="body" :style="groupColor">
            <div class="header" :style="groupHeaderColor">{{options.objName}}</div>
            <div class="main"></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Collection',
    inject: ["getNode", "getGraph"],
    data(){
        return {
            actived: false,
            options: {
                color: [],
                objName: '',
                objCode: ''
            }
        }
    },
    mounted(){
        let node = this.getNode()
        let data = node.getData()
        if(data && data.objCode){
            this.options = data
        }
        node.on('change:data', ({ current }) => {
            this.options = current
        })
        node.on('custom:change:actived', ({ actived }) => {
            this.actived = actived
        })
    },
    computed: {
        colorValue({ options }){
            let { color } = options
            if(color){
                if(Array.isArray(color)){
                    return color.join(',')
                }
                return color
            }
        },
        groupColor({ colorValue }){
            return { backgroundColor: `rgba(${colorValue}, 0.1)` }
        },
        groupHeaderColor({ colorValue }){
            return { backgroundColor: `rgba(${colorValue}, 0.4)` }
        }
    },
    methods: {
        deleteNode(){
            let node = this.getNode()
            this.getGraph().trigger('custom:node:beforeRemove', {id:node.id})
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
        }
    }
}
</script>