
<template>
    <div class="x6-custom-flowWorks-shape connection">
        <div class="header">
            <p>{{options.fnName}}</p>
            <template v-if="!showDisplayType">
                <div @mousedown.stop>
                <i class="el-icon-edit-outline" @click.stop="operate('edit')"></i>
                <i class="el-icon-delete" @click.stop="operate('remove')"></i>
                <i class="el-icon-circle-plus-outline" @click.stop="operate('add')"></i>
            </div>
            </template>
        </div>
        <div class="body" @mousedown="stopMove"></div>
        <!-- <div class="body" @mousedown.stop="stopMove"></div> -->
    </div>
</template>
<script>
export default {
    name: 'Connection',
    inject: ['getGraph', 'getNode'],
    data(){
        return {
            preview: false,
            options: {
                fnDesc: '',
                fnName: '默认标题'
            },
            showDisplayType: false
        }
    },
    mounted(){
        this.showDisplayType = this.$route && this.$route.query && this.$route.query.displayType == '01'
        let node = this.getNode()
        this.options = Object.assign({}, node.data || {})
        node.on('change:data', ({current}) => {
            this.options = Object.assign({}, current)
        })
    },
    methods: {
        operate(action){
            let graph = this.getGraph()
            let node = this.getNode()
            graph.__view__.region[action](node)
        },
        stopMove(){
            let graph = this.getGraph()
            graph.__view__.node.mouseleave()
        }
    }
}
</script>
