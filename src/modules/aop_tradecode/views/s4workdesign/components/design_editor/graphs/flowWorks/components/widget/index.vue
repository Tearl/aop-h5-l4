<template>
    <div class="aop-graph-flowWorks-widget">
        <div id="aop-graph-flowWorks-widget-list" class="aop-graph-flowWorks-widget-list">
            <div class="aop-graph-flowWorks-widget-list-item flex_column">
                <StartConnection @mousedown.native="dragWidget($event, 'StartConnection')" />
                <FlowConnection @mousedown.native="dragWidget($event, 'FlowConnection')" />
                <ServiceConnection @mousedown.native="dragWidget($event, 'ServiceConnection')" />
                <ConditionConnection @mousedown.native="dragWidget($event, 'ConditionConnection')" />
                <EndConnection @mousedown.native="dragWidget($event, 'EndConnection')" />
            </div>
        </div>
    </div>
</template>
<script>
import components from './index.js'
export default {
    props: ['preview'],
    inject: ['getEditor'],
    components,
    methods: {
        dragWidget($event, widget){
            if(!this.preview){
                this.getEditor().view.node.getDrag($event, {shape:widget})
            }
        }
    }
}
</script>
<style lang="scss">
.aop-graph-flowWorks-widget-list{
    padding: 20px;
    .aop-graph-flowWorks-widget-list-item{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }
    .flex_column{
        display: flex;
        flex-direction: column;
        // justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        margin-bottom: 20px;
        min-height: 280px;
    }
}
</style>
