<template>
    <div class="business-rules-event-info-preview_detail">
        <p class="base-info">
            <span class="label">交互 ID:</span>
            <span class="value">{{
                eventInfoProps.d4iId || "--"
            }}</span>
        </p>
        <p class="base-info">
            <span class="label">交互名称:</span>
            <span class="value bold">{{
                eventInfoProps.d4iName || "--"
            }}</span>
        </p>
        <p class="base-info">
            <span class="label">交互描述:</span>
            <span class="value">{{
                eventInfoProps.d4iDesc || "--"
            }}</span>
        </p>
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import interfaceTable from "./interfaceTable.vue";
import serviceTable from "./serviceTable.vue";
import addInterfaceDrawer from "./addInterfaceDrawer.vue";
import componentDetailDrawer from "./componentDetailDrawer.vue";

export default {
    mixins: [mixin],
    components: {
        interfaceTable,
        serviceTable,
        addInterfaceDrawer,
        componentDetailDrawer,
    },
    props: {
        eventInfoProps: {
            type: Object,
            default: () => {},
        },
        eventRules: {
            type: Array,
            default: () => [],
        },
    },
    watch: {
        eventRules: {
            deep: true,
            async handler(newVal, oldVal) {
                this.ruleList = newVal.map((i) => {
                    return {
                        ...i,
                        relId: "",
                        interfaceCount: 0,
                        serviceCount: 0,
                    };
                });
                await this.queryInterfaceList();
            },
        },
    },
    data() {
        return {
            activeTab: "first",
            showAddInterfaceDrawer: false, // 添加接口抽屉
            showComponentDetailDrawer: false, // 组件详情抽屉

            componentInfo: {},
            componentRuleList: [],

            ruleInfo: {},
            // 规则列表
            ruleList: [],
            flowInterfaceList: [], // 交互下的接口列表
        };
    },
    async mounted() {
        this.ruleList = this.eventRules.map((i) => {
            return {
                ...i,
                ruleRelId: "",
                interfaceCount: 0,
                serviceCount: 0,
            };
        });
    },
    methods: {
        async tabClick(tab, event) {
            // console.log('tab', tab, event);
            switch (tab.name) {
                case "second":
                    await this.queryInterfaceList();
                    break;
                case "third":
                    await this.queryFlowInterfaceList();
                    break;

                default:
                    break;
            }
        },
        openAddInterfaceDrawer(row) {
            this.ruleInfo = { ...row, ...this.eventInfoProps };
            this.showAddInterfaceDrawer = true;
        },
        openInterFaceDrawerByComponent(componentRule) {
            const { functionId, layoutId, eleLayId, d4iId } =
                this.eventInfoProps;

            this.ruleInfo = { ...componentRule, ...this.eventInfoProps };
            this.ruleInfo.ruleRelId = `${this.formateId(
                functionId
            )}&&${this.formateId(layoutId)}&&${this.formateId(
                eleLayId
            )}&&${this.formateId(d4iId)}&&${this.formateId(
                componentRule.stepId
            )}&&${this.formateId(componentRule.id)}`;
            this.showAddInterfaceDrawer = true;
        },
        async closeInterfaceDrawer() {
            this.showAddInterfaceDrawer = false;
            await this.queryInterfaceList();
        },
        openComponentDrawer(row) {
            this.componentInfo = {
                id: row.componentId,
                name: row.componentName,
                desc: row.componentDesc,
            };
            this.componentRuleList = this.eventRules.filter(
                (i) => i.componentId == row.componentId
            );

            this.showComponentDetailDrawer = true;
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (
                    rowIndex === 0 ||
                    row.componentId !== this.ruleList[rowIndex - 1].componentId
                ) {
                    let rowspan = 1;
                    for (let i = rowIndex + 1; i < this.ruleList.length; i++) {
                        if (this.ruleList[i].componentId === row.componentId) {
                            rowspan++;
                        } else {
                            break;
                        }
                    }
                    return {
                        rowspan,
                        colspan: 1,
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0,
                    };
                }
            }
        },
        // 流程图打开组件详情
        stepOpenComponentDrawer(data) {
            this.componentInfo = {
                id: data.action.id,
                name: data.action.name,
                desc: data.name,
                stepId: data.stepId,
            };
            if (Array.isArray(data.action.properties.ruleList)) {
                this.componentRuleList = data.action.properties.ruleList.map(
                    (i) => {
                        return {
                            id: i.rule.ruleId,
                            name: i.rule.ruleName,
                            text: i.text,
                            desc: i.rule.ruleDesc,
                            stepId: data.stepId,
                        };
                    }
                );
            } else {
                this.componentRuleList = [];
            }
            this.showComponentDetailDrawer = true;
        },

        closeComponentDetailDrawer() {
            this.showComponentDetailDrawer = false;
        },

        formateId(id) {
            return id || "null";
        },
        // 查询规则关联的接口
        async queryInterfaceList() {
            // 组装关联id
            // 关系ID赋值规则：
            // 1.功能ID + && + 页面ID + && + 要素ID + && + 交互ID + && + 步骤ID + && + 规则ID + && + 接口ID
            // 2.若其中某个ID为空，则使用“null”进行占位填充，例如要素ID为空，那就是：.....&&null&&......
            const { functionId, layoutId, eleLayId, d4iId } =
                this.eventInfoProps;
            if (Array.isArray(this.ruleList) && this.ruleList.length) {
                let ruleRelIds = [];
                this.ruleList.forEach((i) => {
                    let ruleRelId = `${this.formateId(
                        functionId
                    )}&&${this.formateId(layoutId)}&&${this.formateId(
                        eleLayId
                    )}&&${this.formateId(d4iId)}&&${this.formateId(
                        i.stepId
                    )}&&${this.formateId(i.id)}`;
                    i.ruleRelId = ruleRelId;
                    ruleRelIds.push(ruleRelId);
                });
                const res = await this.rpc.businessRules.getRulesInterfaceList({
                    ruleRelIds,
                    isPageFlg: "0",
                });
                if (Array.isArray(res.interfaceInfoList)) {
                    // 统计接口数量
                    this.ruleList = this.ruleList.map((rule) => {
                        let _count = res.interfaceInfoList.filter(
                            (i) => i.ruleRelId == rule.ruleRelId
                        );
                        return {
                            ...rule,
                            interfaceCount: _count.length,
                        };
                    });
                }
            }
        },
        // 查询交互下的所有接口
        async queryFlowInterfaceList() {
            const { functionId, layoutId, eleLayId, d4iId } =
                this.eventInfoProps;
            const res = await this.rpc.businessRules.getRulesInterfaceList({
                fnctId: functionId,
                pageId: layoutId,
                elmId: eleLayId,
                interactiveId: d4iId,
                isPageFlg: "1",
                turnPageShowNum: 999,
                currentPage: 1,
            });
            if (Array.isArray(res.interfaceInfoList)) {
                this.flowInterfaceList = res.interfaceInfoList.map((i) => {
                    return {
                        id: i.ifId,
                        name: i.ifNm,
                        interfaceNo: i.ifNo || "/",
                        interfaceCode: i.ifCd || "/",
                        relId: "",
                    };
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.business-rules-event-info-preview_detail {
    min-width: 500px;
    width: calc(100% - 500px);
    height: 100%;
    padding: 0 20px 20px;
    padding-top: 20px;
    border-left: 1px solid #dcdfe6;
    overflow-y: scroll;
    /deep/ .base-info {
        @include flex(row, flex-start, flex-start);
        margin-bottom: 20px;
        span {
            font-size: 12px;
        }
        .label {
            width: 70px;
        }
        .value {
            width: 400px;
        }
        .bold {
            font-weight: bold;
        }
    }
}
</style>
