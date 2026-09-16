<template>
    <div class="business-rule-add-interface-drawer">
        <el-drawer
            :destroy-on-close="true"
            :visible.sync="showAddInterfaceDrawer"
            :with-header="false"
            :size="600"
            :before-close="closeDrawer"
        >
            <div class="drawer-header">
                <i
                    class="el-icon-arrow-left"
                    style="cursor: pointer; margin-right: 6px"
                    @click="closeDrawer"
                ></i>
                <span v-if="mode == 'edit'">添加接口</span>
                <span v-else-if="mode == 'preview'">规则详情</span>
            </div>
            <!-- 抽屉内容 -->
            <div class="drawer-content">
                <!-- 基本信息 -->
                <div class="drawer-base-info">
                    <p class="title" style="font-size: 14px">基本信息</p>
                    <p>
                        <span class="label">规则名称:</span>
                        <span class="value" style="font-weight: bold">{{
                            ruleInfo.name
                        }}</span>
                    </p>
                    <p>
                        <span class="label">规则描述:</span>
                        <span class="value">
                            <aopCommonDocPreview
                                :data="ruleInfo.desc"
                            ></aopCommonDocPreview>
                        </span>
                    </p>
                </div>
                <!-- 接口 -->
                <div class="drawer-table">
                    <div class="title table-title">
                        <span>实现接口</span>
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            size="mini"
                            @click="openSelectInterfaceDialog"
                            v-if="mode == 'edit'"
                            >添加</el-button
                        >
                    </div>
                    <interfaceTable
                        :interfaceList="interfaceList"
                        @deleteRow="deleteRow"
                        :hideOpt="mode == 'preview'"
                    />
                </div>
                <!-- 服务 -->
                <div class="drawer-table">
                    <div class="title table-title">
                        <span>实现服务</span>
                    </div>
                    <serviceTable :serviceList="serviceList" />
                </div>
            </div>
        </el-drawer>

        <!-- 选择接口弹窗 -->
        <SelectService
            :visibleShow="showSelectInterfaceDialog"
            :formB="formB"
            :onlySelect="true"
            :addDataForm="addDataForm"
            @closeDialog="closeSelectDialog"
            @selectList="getSelectList"
        />
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import interfaceTable from "./interfaceTable.vue";
import serviceTable from "./serviceTable.vue";
// 选择接口
import SelectService from "../../../../assetList/components/components/add_service.vue";

export default {
    mixins: [mixin],
    components: {
        interfaceTable,
        serviceTable,
        SelectService,
    },
    // 选择接口的参数
    inject: ["formB"],
    props: {
        showAddInterfaceDrawer: {
            type: Boolean,
            default: false,
        },
        ruleInfo: {
            type: Object,
            default: () => {},
        },
        mode: {
            type: String,
            default: "edit",
        },
    },
    data() {
        return {
            showSelectInterfaceDialog: false,
            interfaceList: [],
            serviceList: [],
        };
    },
    computed: {
        addDataForm() {
            return {
                // fnctId: this.ruleInfo.functionId,
                pageId: this.ruleInfo.layoutId,
                elmId: this.ruleInfo.eleLayId,
                interactiveId: this.ruleInfo.d4iId,
                interactiveNm: this.ruleInfo.d4iName,
                stepId: this.ruleInfo.stepId,
                ruleId: this.ruleInfo.id,
            };
        },
    },
    async created() {
        console.log("this.ruleInfo", this.ruleInfo);

        await this.getRuleInterfaceList();
        await this.queryServiceList();
    },
    methods: {
        closeDrawer() {
            this.$emit("closeDrawer");
        },
        openSelectInterfaceDialog() {
            console.log("formB", this.formB);

            this.showSelectInterfaceDialog = true;
        },
        async closeSelectDialog() {
            this.showSelectInterfaceDialog = false;
            await this.getRuleInterfaceList();
        },
        // 查询规则已有接口列表
        async getRuleInterfaceList() {
            if (this.ruleInfo.ruleRelId) {
                const res = await this.rpc.businessRules.getRulesInterfaceList({
                    ruleRelIds: [this.ruleInfo.ruleRelId],
                    isPageFlg: "0",
                });
                if (Array.isArray(res.interfaceInfoList)) {
                    this.interfaceList = res.interfaceInfoList.map((i) => {
                        return {
                            id: i.ifId,
                            name: i.ifNm,
                            interfaceNo: i.ifNo || "/",
                            interfaceCode: i.ifCd || "/",
                            relId: i.relId,
                        };
                    });
                }
            }
        },

        // 查询规则已有服务列表
        async queryServiceList() {
            const { fnctId, examId, d4iId, id } = this.ruleInfo;
            const res = await this.rpc.businessRules.queryServiceList({
                insvId: examId,
                functionId: fnctId,
                eventId: d4iId,
                ruleInfoList: [
                    {
                        businessCode: id,
                    },
                ],
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

        async getSelectList(list) {
            console.log("选择的接口：", list, this.ruleInfo);
            if (Array.isArray(list) && list.length) {
                list.map((i) => {
                    return {
                        id: i.ifId,
                        // name: i.svcNm,
                        // interfaceNo: i.svcSeq,
                        // interfaceCode: i.svcCd,
                    };
                });
                // 调用添加接口
                await this.addInterface(list);
                await this.getRuleInterfaceList();
            }
        },
        async addInterface(list) {
            const functionDemandAchieveRelList = list.map((i) => {
                return {
                    fnctId: this.ruleInfo.fnctId,
                    pageId: this.ruleInfo.layoutId,
                    elmId: this.ruleInfo.eleLayId,
                    interactiveId: this.ruleInfo.d4iId,
                    interactiveNm: this.ruleInfo.d4iName,
                    stepId: this.ruleInfo.stepId,
                    ruleId: this.ruleInfo.id,
                    ifId: i.ifId,
                };
            });
            await this.rpc.businessRules.addInterface({
                functionDemandAchieveRelList,
            });
            this.$message.success("添加成功");
        },
        async deleteRow(row) {
            if (row && row.relId) {
                await this.rpc.businessRules.deleteInterface({
                    relId: row.relId,
                });
                this.$message.success("已删除");
                await this.getRuleInterfaceList();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.drawer-header {
    height: 40px;
    border-bottom: 1px solid #dcdfe6;
    @include flex(row, flex-start, center);
    padding: 0 6px;
    line-height: 20px;
}

.drawer-content {
    width: 100%;
    padding: 14px;
    padding-bottom: 60px;
}

.title {
    font-weight: bold;
    @include flex(row, space-between, center);
}
.table-title {
    margin-bottom: 16px;
}
.drawer-base-info {
    padding-bottom: 20px;
    border-bottom: 1px solid #dcdfe6;
    @include flex(column, flex-start, flex-start);
    p {
        font-size: 12px;
        @include flex(row, flex-start, flex-start);
        margin-top: 10px;
        .label {
            width: 70px;
        }
        .value {
            max-width: 440px;
        }
    }
}
.drawer-table {
    margin-top: 16px;
}
</style>
