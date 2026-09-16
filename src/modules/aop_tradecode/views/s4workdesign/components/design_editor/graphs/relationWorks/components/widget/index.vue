
<template>
    <div class="aop-graph-relationWorks-widget">
        <div id="aop-graph-relationWorks-widget-list" class="aop-graph-relationWorks-widget-list">
            <widgetNodeLevel1 v-if="dev || level == '1'" @mousedown.native="dragWidget($event, 'x6-widget-node-level1')" />
            <widgetNodeLevel2 v-if="dev || level == '2'" @mousedown.native="dragWidget($event, 'x6-widget-node-level2')" />
            <widgetNodeLevel3 v-if="dev || level == '3'" @mousedown.native="dragWidget($event, 'x6-widget-node-level3')" />
            <widgetNodeLevel4 v-if="dev || level == '4'" @mousedown.native="dragWidget($event, 'x6-widget-node-level4')" />
            <widgetNodeLevel5 v-if="dev || level == '5'" @mousedown.native="dragWidget($event, 'x6-widget-node-level5')" />
            <widgetRegion v-if="dev || level == '4'" @mousedown.native="dragWidget($event, 'x6-widget-region')" />
        </div>
    </div>
</template>
<script>
import widgetNodeLevel1 from './x6-widget-node-level1'
import widgetNodeLevel2 from './x6-widget-node-level2'
import widgetNodeLevel3 from './x6-widget-node-level3'
import widgetNodeLevel4 from './x6-widget-node-level4'
import widgetNodeLevel5 from './x6-widget-node-level5'
import widgetRegion from './x6-widget-region'
export default {
    components: {
        widgetNodeLevel1,
        widgetNodeLevel2,
        widgetNodeLevel3,
        widgetNodeLevel4,
        widgetNodeLevel5,
        widgetRegion
    },
    inject: ['getEditor'],
    props: ['level','preview'],
    data(){
        return {
            dev: process.env.NODE_ENV === "development",
        }
    },
    methods: {
        dragWidget($event, widget){
            if(!this.preview){
                this.getEditor().view.node.getDrag($event, widget)
            }
        }
    }
}
</script>
<style lang="scss">
.aop-graph-relationWorks-widget-list{
    display: flex;
    justify-content: space-between;
    padding: 20px;
    flex-wrap: wrap;
}
</style>