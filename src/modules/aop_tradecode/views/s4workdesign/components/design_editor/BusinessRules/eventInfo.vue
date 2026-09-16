<template>
    <div class="business-rules-event">
        <!-- 业务流程 -->
        <div class="flow-block">
            <p>业务流程</p>
            <flowPreview
                :eventInfo="eventInfoProps"
                :flowInfo="flowInfo"
                @stepNodeDetail="stepNodeDetail"
            />
        </div>

        <!-- 信息面板 -->
        <infoPreview
            ref="infoPreview"
            :eventRules="eventRules"
            :eventInfoProps="eventInfoProps"
        />
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import flowPreview from "./flowPreview.vue";
import infoPreview from "./infoPreview.vue";

export default {
    mixins: [mixin],
    props: {
        eventInfoProps: {
            type: Object,
            default: () => {},
        },
    },
    components: {
        flowPreview,
        infoPreview,
    },
    data() {
        return {
            flowInfo: {},
            eventRules: [],
        };
    },
    watch: {
        eventInfoProps: {
            deep: true,
            async handler(newVal, oldVal) {
                await this.getSchema();
            },
        },
    },
    async mounted() {
        await this.getSchema();
    },
    methods: {
        // 获取schema
        async getSchema() {
            // 功能id
            // 要素id
            // isolateWorkspace
            // modelVersion
            // flowId 用来筛选
            const {
                functionId,
                eleLayId,
                isolateWorkspace,
                modelVersion,
                d4iId,
                relType,
            } = this.eventInfoProps;
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
                    console.log("schema", schema);

                    let flowList = schema.flow.flowList || [];
                    const flowInfoArr = flowList.filter(
                        (i) => i.flowId == d4iId
                    );
                    if (flowInfoArr.length) {
                        this.flowInfo = flowInfoArr[0];
                    }

                    // 从 flowList 中解出所有规则
                    let rules = [];
                    let { stepDefineList = [], stepList = [] } = this.flowInfo;
                    let list = [];
                    if (this.eventInfoProps.isolateWorkspace == "D2") {
                        list = stepDefineList;
                    } else if (this.eventInfoProps.isolateWorkspace == "C3") {
                        list = stepList;
                    }
                    if (Array.isArray(list)) {
                        list.forEach((r) => {
                            if (Array.isArray(r.action.properties.ruleList)) {
                                r.action.properties.ruleList.forEach((i) => {
                                    rules.push({
                                        id: i.rule ? i.rule.ruleId : "",
                                        name: i.rule
                                            ? i.rule.ruleName
                                            : i.text || "",
                                        text: i.text || "",
                                        desc: i.rule ? i.rule.ruleDesc : "",
                                        componentName: r.action.name,
                                        componentId: r.action.id,
                                        componentDesc: r.name,
                                        stepId: r.stepId,
                                    });
                                });
                            }
                        });
                    }
                    this.eventRules = rules;
                    console.log("eventRules===>", this.eventRules);
                }
            } else {
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
                        console.log("schema", schema);

                        let flowList = schema.flow.flowList || [];
                        const flowInfoArr = flowList.filter(
                            (i) => i.flowId == d4iId
                        );
                        if (flowInfoArr.length) {
                            this.flowInfo = flowInfoArr[0];
                        }

                        // 从 flowList 中解出所有规则
                        let rules = [];
                        let { stepDefineList = [], stepList = [] } =
                            this.flowInfo;
                        let list = [];
                        if (this.eventInfoProps.isolateWorkspace == "D2") {
                            list = stepDefineList;
                        } else if (
                            this.eventInfoProps.isolateWorkspace == "C3"
                        ) {
                            list = stepList;
                        }
                        if (Array.isArray(list)) {
                            list.forEach((r) => {
                                if (
                                    Array.isArray(r.action.properties.ruleList)
                                ) {
                                    r.action.properties.ruleList.forEach(
                                        (i) => {
                                            rules.push({
                                                id: i.rule ? i.rule.ruleId : "",
                                                name: i.rule
                                                    ? i.rule.ruleName
                                                    : i.text || "",
                                                text: i.text || "",
                                                desc: i.rule
                                                    ? i.rule.ruleDesc
                                                    : "",
                                                componentName: r.action.name,
                                                componentId: r.action.id,
                                                componentDesc: r.name,
                                                stepId: r.stepId,
                                            });
                                        }
                                    );
                                }
                            });
                        }
                        this.eventRules = rules;
                        console.log("page eventRules===>", this.eventRules);
                    }
                }
            }
        },
        stepNodeDetail(data) {
            this.$refs.infoPreview.stepOpenComponentDrawer(data);
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.business-rules-event {
    width: 100%;
    @include flex(row, flex-start, center);
    .flow-block {
        width: 520px;
        height: 100%;
        padding: 10px;
        p {
            width: 100%;
            font-weight: bold;
            margin-bottom: 10px;
        }
    }
}
</style>
