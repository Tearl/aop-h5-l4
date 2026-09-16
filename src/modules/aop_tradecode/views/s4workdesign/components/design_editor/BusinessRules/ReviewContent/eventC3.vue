<template>
    <div class="event-cs-content">
        <flowPreview :eventInfo="attrs" :flowInfo="flowInfo" />
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import flowPreview from "../flowPreview.vue";
export default {
    mixins: [mixin],
    components: {
        flowPreview,
    },
    props: {
        attrs: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
          flowInfo: {}
        };
    },
    async mounted() {
        await this.getSchema();
    },
    methods: {
        async getSchema() {
            const {
                functionId,
                eleLayId,
                isolateWorkspace,
                modelVersion,
                d4iId,
                relType,
            } = this.attrs;
            if (relType == "00") {
                const res = await this.rpc.businessRules.getSchema({
                    admiId: functionId,
                    elementId: eleLayId,
                    isolateWorkspace,
                    modelVersion,
                });
                if (res && res.aefiConf) {
                    // 解析 schema
                    const schema = JSON.parse(res.aefiConf);
                    console.log("c3 schema", schema);

                    let flowList = schema.flow.flowList || [];
                    const flowInfoArr = flowList.filter(
                        (i) => i.flowId == d4iId
                    );
                    if (flowInfoArr.length) {
                        this.flowInfo = flowInfoArr[0];
                    }
                }
            }   else {
                if (relType == "01") {
                    // 页面
                    const res = await this.rpc.businessRules.getLayoutSchema({
                        admiId: functionId,
                        layoutId: eleLayId,
                        isolateWorkspace,
                        modelVersion,
                    });
                    if (res && res.atfiConf) {
                        // 解析 schema
                        const schema = JSON.parse(res.atfiConf);

                        let flowList = schema.flow.flowList || [];
                        const flowInfoArr = flowList.filter(
                            (i) => i.flowId == d4iId
                        );
                        if (flowInfoArr.length) {
                            this.flowInfo = flowInfoArr[0];
                        }
                    }
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
@import "./index.scss";
::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}
.event-cs-content {
    padding: 10px;
}
</style>
