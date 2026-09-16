<template>
    <div class="business-rules-event-flow">
        <div class="review_graph_panel" :style="{ height: graphHeight + 'px' }">
            <div v-if="isEmpty" class="review_graph_empty">
                <img src="./assets/empty.png" />
                <p>当前事件未绑定交互处理</p>
            </div>
            <div ref="graph" class="review_graph" :class="{ 'empty' : isEmpty }" />
        </div>
    </div>
</template>

<script>
import FlowManager from "./manager/FlowManager";
import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],
    props: {
        eventInfo: {
            type: Object,
            default: () => {},
        },
        flowInfo: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            graph: null,
            graphHeight: 0,
        };
    },
    created() {
        window.addEventListener("resize", this.doResize);
        this.doResize();
    },
    destroyed() {
        window.removeEventListener("resize", this.doResize);
    },
    watch: {
        flowInfo: {
            deep: true,
            async handler(newVal, odlVal) {
                await this.renderFlowGraph(newVal);
            },
        },
    },
    computed: {
        isEmpty() {
            return !this.flowInfo.id;
        }
    },
    async mounted() {
        await this.init();
    },
    methods: {
        async init() {
            await this.renderFlowGraph(this.flowInfo);
        },
        // 处理图像高度
        doResize() {
            this.graphHeight = document.documentElement.clientHeight;
        },
        // 渲染流程图
        renderFlowGraph(flowInfo) {
            console.log("render info ===> ", flowInfo, flowInfo.id);
            let graphDom = this.$refs.graph;
            if (!graphDom) return;
            if (this.graph) {
                // 销毁图形对象
                this.graph.dispose();
            }

            // 创建图形对象
            this.graph = FlowManager.createGraph({ container: graphDom });
            // 获取流程图形数据
            let { nodes = [], edges = [] } = FlowManager.getGraphData(
                flowInfo,
                this.eventInfo.isolateWorkspace
            );

            this.graph.on("node:click", ({ e, x, y, node, view }) => {
                console.log("node----->", node.data);
                this.$emit("stepNodeDetail", node.data);
            });

            this.graph.fromJSON({ nodes, edges });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";

.business-rules-event-flow {
    width: 100%;
    .review_graph_panel {
        background: #fafafc;
        border: 1px solid #eef0f5;
        border-radius: 2px;
        height: 480px;
        overflow: hidden;
        position: relative;
    }

    .review_graph {
        width: 100%;
        height: 100%;
    }
    .empty {
        opacity: 0;
    }
    .review_graph_empty {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999;
        @include flex(column, center, center);
        min-width: 300px;
        img {
            width: 200px;
            height: 160px;
            margin-bottom: 30px;
        }
        p {
            color: #999;
        }
    }
}
</style>
