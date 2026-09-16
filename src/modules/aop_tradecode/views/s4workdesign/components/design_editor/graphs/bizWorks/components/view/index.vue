<template>
    <div class="x6-graph-custom-bizWorks-container" style="width:100%;height:100%">
        <div ref="view" class="x6-custom-bizWorks-view"></div>
    </div>
</template>
<script>
import props from './props'
import View from '../../lib'
export default {
    inject: ['getDialog','getContextMenu'],
    props,
    mounted(){
        this.$nextTick(() => {
            this.view = new View(this, {
                container: this.$refs.view,
                ...this.config
            }, this.options)
        })
    },
    methods: {

        getNodesData(){
            return this.view.graph.getNodes().map(node => node.data)
        },

        dispose(){
            this.view.graph.dispose()
        },

        render(metas){
            this.view.render.render(metas)
        }
    }
}
</script>
<style lang="scss">
@import './style.scss';
</style>
