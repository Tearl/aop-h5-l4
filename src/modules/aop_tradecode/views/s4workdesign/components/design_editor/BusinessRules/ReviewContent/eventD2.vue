<template>
    <div class="event-d2-content">
        <el-tabs v-model="activeTab" @tab-click="tabClick">
            <el-tab-pane label="业务流程" name="first">
                <flowPreview
                    :eventInfo="attrs"
                    :flowInfo="flowInfo"
                    @stepNodeDetail="stepNodeDetail"
                />
            </el-tab-pane>
            <el-tab-pane label="基本信息" name="second">
                <p class="base-info">
                    <span class="label">交互 ID:</span>
                    <span class="value">{{ attrs.d4iId || "--" }}</span>
                </p>
                <p class="base-info">
                    <span class="label">交互名称:</span>
                    <span class="value bold">{{ attrs.d4iName || "--" }}</span>
                </p>
                <p class="base-info">
                    <span class="label">交互描述:</span>
                    <span class="value">{{ attrs.d4iDesc || "--" }}</span>
                </p>
                <p class="base-info">
                    <span class="label">要点 ID:</span>
                    <span class="value">{{ attrs.componentId || "--" }}</span>
                </p>
                <p class="base-info">
                    <span class="label">要点名称:</span>
                    <span class="value">{{
                        attrs.componentName || attrs.componentTypeName || "--"
                    }}</span>
                </p>
                <p class="base-info">
                    <span class="label">关联事件:</span>
                    <span class="value">{{ attrs.eventName || "--" }}</span>
                </p>
            </el-tab-pane>

            <el-tab-pane label="规则列表" name="third">
                <el-table
                    size="mini"
                    border
                    :data="ruleList"
                    :span-method="arraySpanMethod"
                    style="width: 100%"
                    :header-cell-style="{
                        background: '#F5F5F8',
                        color: '#606266',
                    }"
                >
                    <el-table-column
                        label="组件名称"
                        min-width="80"
                        show-overflow-tooltip="true"
                    >
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                style="padding-right: 10px"
                                @click="openComponentDrawer(scope.row)"
                                >{{ scope.row.componentName }}</el-button
                            >
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="规则名称"
                        min-width="100"
                        show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="interfaceCount"
                        label="实现接口"
                        min-width="60"
                        show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="serviceCount"
                        label="实现服务"
                        min-width="60"
                        show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" min-width="60">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                size="mini"
                                @click="openAddInterfaceDrawer(scope.row)"
                                :disabled="scope.row.id == ''"
                                >查看</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="接口列表" name="fourth">
                <interfaceTable
                    :interfaceList="flowInterfaceList"
                    :hideOpt="true"
                />
            </el-tab-pane>
            <el-tab-pane label="服务列表" name="fifth">
                <serviceTable :serviceList="serviceList" />
            </el-tab-pane>
        </el-tabs>

        <!-- 组件详情抽屉 -->
        <componentDetailDrawer
            :showComponentDetailDrawer="showComponentDetailDrawer"
            @closeDrawer="closeComponentDetailDrawer"
            :componentInfo="componentInfo"
            :ruleList="componentRuleList"
            mode="preview"
        />
        <!-- 添加接口抽屉 -->
        <addInterfaceDrawer
            v-if="showAddInterfaceDrawer"
            :showAddInterfaceDrawer="showAddInterfaceDrawer"
            @closeDrawer="closeInterfaceDrawer"
            :ruleInfo="ruleInfo"
            mode="preview"
        />
    </div>
</template>

<script>
// @ts-ignore
import mixin from "@m/core/mixin";
import flowPreview from "../flowPreview.vue";
import interfaceTable from "../interfaceTable.vue";
import serviceTable from "../serviceTable.vue";
import componentDetailDrawer from "../componentDetailDrawer.vue";
import addInterfaceDrawer from "../addInterfaceDrawer.vue";
export default {
    mixins: [mixin],
    components: {
        flowPreview,
        interfaceTable,
        serviceTable,
        componentDetailDrawer,
        addInterfaceDrawer,
    },
    props: {
        attrs: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            activeTab: "first",
            flowInfo: {},
            eventRules: [],
            ruleList: [],
            flowInterfaceList: [], // 交互下的接口列表
            serviceList: [], // 交互下的服务列表
            showAddInterfaceDrawer: false, // 添加接口抽屉
            ruleInfo: {},
            showComponentDetailDrawer: false, // 组件详情抽屉
            componentInfo: {},
            componentRuleList: [],
        };
    },
    async mounted() {
        console.log("attrs", this.attrs);

        await this.getSchema();
    },
    methods: {
        async tabClick(tab, event) {
            switch (tab.name) {
                case "third":
                    await this.queryInterfaceList();
                    await this.queryServiceCount();
                    break;
                case "fourth":
                    await this.queryFlowInterfaceList();
                    break;
                case "fifth":
                    await this.queryServiceList();
                    break;
                default:
                    break;
            }
        },
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
                    if (this.attrs.isolateWorkspace == "D2") {
                        list = stepDefineList;
                    } else if (this.attrs.isolateWorkspace == "C3") {
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
                    this.ruleList = this.eventRules.map((i) => {
                        return {
                            ...i,
                            relId: "",
                            interfaceCount: 0,
                            serviceCount: 0,
                        };
                    });
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
                        this.ruleList = this.eventRules.map((i) => {
                            return {
                                ...i,
                                relId: "",
                                interfaceCount: 0,
                                serviceCount: 0,
                            };
                        });
                    }
                }
            }
        },
        stepNodeDetail(data) {
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
                            id: i.rule ? i.rule.ruleId : "",
                            name: i.rule ? i.rule.ruleName : "",
                            text: i.text || "",
                            desc: i.rule ? i.rule.ruleDesc : "",
                            stepId: data.stepId,
                        };
                    }
                );
            } else {
                this.componentRuleList = [];
            }
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
        closeComponentDetailDrawer() {
            this.showComponentDetailDrawer = false;
        },
        openAddInterfaceDrawer(row) {
            this.ruleInfo = { ...row, ...this.eventInfoProps };
            this.showAddInterfaceDrawer = true;
        },
        closeInterfaceDrawer() {
            this.showAddInterfaceDrawer = false;
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
            const { fnctId, layoutId, eleLayId, d4iId } = this.attrs;
            if (Array.isArray(this.ruleList) && this.ruleList.length) {
                let ruleRelIds = [];
                this.ruleList.forEach((i) => {
                    let ruleRelId = `${this.formateId(
                        fnctId
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

        // 查询关联的服务
        async queryServiceCount() {
            const { fnctId, examId, d4iId } = this.attrs;
            if (Array.isArray(this.ruleList) && this.ruleList.length) {
                let ruleIds = this.ruleList
                    .map((i) => {
                        return i.id;
                    })
                    .filter((r) => r != "");
                const res = await this.rpc.businessRules.queryServiceCount({
                    insvId: examId,
                    functionId: fnctId,
                    eventId: d4iId,
                    decisionTreeIds: ruleIds,
                });
                if (Array.isArray(res.serviceCounts)) {
                    this.ruleList = this.ruleList.map((rule) => {
                        let _count = res.serviceCounts.filter(
                            (i) => i.decisionTreeId == rule.id
                        );
                        return {
                            ...rule,
                            serviceCount: _count.length
                                ? _count[0].apiCount
                                : 0,
                        };
                    });
                }
            }
        },

        // 查询交互下的所有接口
        async queryFlowInterfaceList() {
            const { fnctId, layoutId, eleLayId, d4iId } = this.attrs;
            const res = await this.rpc.businessRules.getRulesInterfaceList({
                fnctId: fnctId,
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
        // 查询交互下的所有服务
        async queryServiceList() {
            const { fnctId, examId, d4iId } = this.attrs;
            const res = await this.rpc.businessRules.queryServiceList({
                insvId: examId,
                functionId: fnctId,
                eventId: d4iId,
                currentPage: 1,
                turnPageShowNum: -1
            });
            if (Array.isArray(res.funcServiceApiInfos)) {
                this.serviceList = res.funcServiceApiInfos.map((i) => {
                    return {
                        id: i.apiId,
                        apiCode: i.apiCode,
                        apiName: i.apiName,
                        apiSeq: i.apiSeq,
                    };
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.event-d2-content {
    padding: 0 12px;
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
            width: 200px;
        }
        .bold {
            font-weight: bold;
        }
    }
}
</style>
