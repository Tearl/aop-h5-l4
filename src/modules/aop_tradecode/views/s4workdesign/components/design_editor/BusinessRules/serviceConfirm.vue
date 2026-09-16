<template>
    <div class="design-review-service-confirm" v-if="initFinish">
        <p class="title">基本信息</p>
        <div class="base-info">
            <div class="line">
                <p class="base-item">
                    <span class="label">服务名称：</span>
                    <span class="value">{{ baseInfo.svcNm }}</span>
                </p>
                <p class="base-item">
                    <span class="label">服务编码：</span>
                    <span class="value">{{ baseInfo.svcSeq }}</span>
                </p>
            </div>
            <div class="line">
                <p class="base-item">
                    <span class="label">服务版本号：</span>
                    <span class="value">{{ baseInfo.svcVersionNo }}</span>
                </p>
                <p class="base-item">
                    <span class="label">所属中心：</span>
                    <span class="value">{{ baseInfo.centerName }}</span>
                </p>
            </div>
            <div class="line">
                <p class="base-item">
                    <span class="label">服务分类：</span>
                    <span class="value">{{ baseInfo.groupNm }}</span>
                </p>
                <!-- <p class="base-item">
                    <span class="label">所属业务域：</span>
                    <span class="value">{{ baseInfo.beltLineNm }}</span>
                </p> -->
                <p class="base-item">
                    <span class="label">创建人：</span>
                    <span class="value">{{ baseInfo.crtNm }}</span>
                </p>
            </div>
            <div class="line">
                <p class="base-item">
                    <span class="label">创建时间：</span>
                    <span class="value">{{ baseInfo.crtTm }}</span>
                </p>
                <p class="base-item">
                    <span class="label">服务描述：</span>
                    <span class="value">{{ baseInfo.svcDesc }}</span>
                </p>
            </div>
            <!-- <div class="line hole-line">
                <p class="base-item">
                    <span class="label">服务描述：</span>
                    <span class="value">{{ baseInfo.svcDesc }}</span>
                </p>
            </div> -->
        </div>
        <p class="title not-first">业务规则</p>
        <div class="table-block rule-table">
            <el-table
                :data="ruleTableData"
                style="width: 100%"
                ref="ruleTable"
                size="medium"
                align="center"
                :stripe="false"
                row-key="actionId"
                :tree-props="{
                    children: 'layoutActionList',
                }"
                :header-cell-style="{ background: '#F5F5F8', color: '#606266' }"
            >
                <el-table-column
                    :prop="col.prop"
                    :label="col.label"
                    :min-width="col.width"
                    show-overflow-tooltip="true"
                    v-for="(col, index) in ruleTableColumn"
                    :key="index + col.prop"
                >
                    <template slot-scope="scope">
                        <span
                            v-if="
                                scope.column.property == 'decisionTreeName' &&
                                scope.row.decisionTreeId
                            "
                        >
                            <el-button type="text" @click="goRule(scope.row)">{{
                                scope.row[col.prop]
                            }}</el-button>
                        </span>
                        <span v-else>{{ scope.row[col.prop] }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <p class="title not-first">输入参数</p>
        <div class="table-block params-table">
            <el-table
                :data="inputParamsTableData"
                style="width: 100%"
                ref="inputParamsTable"
                size="medium"
                align="center"
                :stripe="false"
                row-key="paramId"
                :header-cell-style="{ background: '#F5F5F8', color: '#606266' }"
                :tree-props="{
                    children: 'children',
                }"
            >
                <el-table-column
                    :prop="col.prop"
                    :label="col.label"
                    :min-width="col.width"
                    show-overflow-tooltip="true"
                    v-for="(col, index) in inputParamsTableColumn"
                    :key="col.prop + index"
                ></el-table-column>
            </el-table>
        </div>
        <p class="title not-first">输出参数</p>
        <div class="table-block params-table">
            <el-table
                :data="outputParamsTableData"
                style="width: 100%"
                ref="outputParamsTable"
                size="medium"
                align="center"
                :stripe="false"
                row-key="paramId"
                :header-cell-style="{ background: '#F5F5F8', color: '#606266' }"
                :tree-props="{
                    children: 'children',
                }"
            >
                <el-table-column
                    :prop="col.prop"
                    :label="col.label"
                    :min-width="col.width"
                    show-overflow-tooltip="true"
                    v-for="(col, index) in outputParamsTableColumn"
                    :key="col.prop + index"
                ></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import * as columns from "./tableColumn";
import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],
    props: {
        attrs: {
            type: Object,
            default: () => {},
        },
    },
    watch: {
        attrs() {
            Promise.all([this.queryS5Info(), this.getRuleList()]).then(() => {
                this.removeComponentLoading();
                this.initFinish = true;
            });
        }
    },
    data() {
        return {
            initFinish: false,
            serviceDetail: {},
            // 基本信息
            baseInfo: {
                svcNm: "", // 服务名称
                svcSeq: "", // 服务编码
                svcVersionNo: "", // 服务版本号
                beltLineNm: "", // 归属业务
                groupNm: "", // 服务分类
                crtNm: "", // 创建人
                crtTm: "", // 创建时间
                svcDesc: "", // 接口描述
                centerName: "",
            },
            ruleTableData: [], // 业务规则
            ruleTableColumn: columns.ruleTableColumn,
            inputParamsTableData: [], // 输入参数
            inputParamsTableColumn: columns.inputParamsTableColumn,
            outputParamsTableData: [], // 输出参数
            outputParamsTableColumn: columns.outputParamsTableColumn,
        };
    },

    async created() {
        console.log("attrs", this.attrs);
        Promise.all([this.queryS5Info(), this.getRuleList()]).then(() => {
            this.removeComponentLoading();
            this.initFinish = true;
        });
    },
    methods: {
        goRule(row) {
            // 进入S4设计
            let link = this.$router.resolve({
                path: "/aop_businessd2/transactionDesign/decisionRuleDetail",
                query: {
                    decisionId: row.decisionTreeId
                },
            });
            window.open(link.href, "_blank");
        },
        async queryS5Info() {
            const info = await this.rpc.businessRules.queryS5({
                apiId: this.attrs.apiId,
            });
            this.interfaceDetail = info;
            // 基本信息
            const {
                apiName,
                apiCode,
                beltLineNm,
                crtNm,
                crtTm,
                apiDesc,
                apiVersion,
                apiServiceGroupName,
                centerName,
            } = info;
            this.baseInfo = {
                svcNm: apiName || "/",
                svcSeq: apiCode || "/", // 接口编码
                beltLineNm: beltLineNm || "/", // 归属业务
                crtNm: crtNm || "/", // 创建人
                crtTm: crtTm || "/", // 创建时间
                svcDesc: apiDesc || "/", // 接口描述
                svcVersionNo: apiVersion || "/",
                groupNm: apiServiceGroupName || "/",
                centerName: centerName || "/",
            };

            const { puApiParams = [] } = info;
            let inputParams = puApiParams
                .filter((p) => p.paramDirection == "0")
                .map((i) => {
                    return {
                        ...i,
                        isNeed: i.isNeed == "1" ? "是" : "否",
                    };
                });
            this.inputParamsTableData = this.flatToTree(inputParams);
            let outputParams = puApiParams
                .filter((p) => p.paramDirection == "1")
                .map((i) => {
                    return {
                        ...i,
                        isNeed: i.isNeed == "1" ? "是" : "否",
                    };
                });
            this.outputParamsTableData = this.flatToTree(outputParams);
        },
        async getRuleList() {
            const res = await this.rpc.businessRules.getRuleList({
                queryId: this.attrs.apiId, // "19006316139394702175",
                idType: "1",
            });

            let list = [];
            if (Array.isArray(res.l5AndDecisionTreeBos)) {
                list = res.l5AndDecisionTreeBos;
            }
            this.ruleTableData = list;
        },
        removeComponentLoading() {
            this.$emit("removeComponentLoading");
        },

        flatToTree(params) {
            const tree = {};
            const mMap = {};
            params.forEach((item) => {
                mMap[item.paramOrder] = {
                    ...item,
                    children: [],
                };
            });
            params.forEach((item) => {
                if (item.paramParentId) {
                    mMap[item.paramParentId].children.push(
                        mMap[item.paramOrder]
                    );
                } else {
                    tree[item.paramOrder] = mMap[item.paramOrder];
                }
            });
            return Object.values(tree);
        },
    },
};
</script>

<style lang="scss" scoped>
@import "./mixin.scss";

.design-review-service-confirm {

    padding: 16px;
    .title {
        font-weight: 600;
        font-size: 16px;
    }
    .not-first {
        margin-top: 20px;
        @include flex(row, flex-start, center);
        .title-value {
            font-size: 14px;
            color: #333;
            margin-left: 20px;
            font-weight: 400;
            /deep/ .el-checkbox__label {
                color: #333 !important;
                font-weight: 400;
            }
        }
    }
    .base-info {
        .line {
            @include flex(row, space-between, flex-start);
            margin-top: 8px;
        }
        .base-item {
            width: 50%;
            color: #333;
        }
        .hole-line {
            width: 100%;
        }
    }

    .table-block {
        margin-top: 12px;
    }
}
</style>
