<template>
    <div class="interface-contract">
        <div class="item">
            <div class="card_title">
                <span class="d_line"></span>
                <span class="d_detail">基本信息</span>
            </div>
            <div class="content-top">
                <el-row>
                    <el-col :span="12">
                        <div class="card">
                            <span>服务名称：</span>
                            <span>{{ basicData.objId || "/" }}</span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="card">
                            <span>服务编码：</span>
                            <span>{{ basicData.s6ServiceCode || "/" }}</span>
                        </div>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="card">
                            <span>所属对象：</span>
                            <span>{{ basicData.aiVersion || "/" }}</span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="card">
                            <span>所属中心：</span>
                            <span>{{ basicData.objName || "/" }}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="card">
                            <span>创建人：</span>
                            <span>{{ basicData.aiVersion || "/" }}</span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="card">
                            <span>创建时间</span>
                            <span>{{ basicData.objName || "/" }}</span>
                        </div>
                    </el-col>
                </el-row>
                <div class="card">
                    <span>服务描述：</span>
                </div>
                <div class="card">
                    <span class="desc">{{
                        basicData.s6ServiceDesc || "/"
                        }}</span>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="card_title">
                <span class="d_line"></span>
                <span class="d_detail">输入参数</span>
            </div>
            <div class="center-wrap">
                <Table class="table_style" :data="iInputList" :table="iInputListTable" :rowK="'paramOrder'"
                    :treeProps="{ children: 'children' }"></Table>
            </div>
        </div>
        <div class="item">
            <div class="card_title">
                <span class="d_line"></span>
                <span class="d_detail">输出参数</span>
            </div>
            <div class="bottom-wrap">
                <Table class="table_style" :data="iOutputList" :table="iOutputListTable" :rowK="'paramOrder'"
                    :treeProps="{ children: 'children' }"></Table>
            </div>
        </div>
    </div>
</template>

<script>
import Table from "./pageTable.vue";
import { reList } from "@m/utils/paramTree";
export default {
    name: "S6Details",
    props: {
        basicData: {
            type: Object,
            default: () => { },
        },
    },
    components: {
        Table,
    },
    data() {
        return {
            isShowHeader: true,
            inputFlag: false,
            outputFlag: false,
            iInputList: [], // 数据输入列表
            iOutputList: [], // 数据输出列表
            allInputList: [],
            allOutputList: [],
            iInputListTable: [
                {
                    prop: "paramCName",
                    label: "参数名称",
                    type: "text",
                },

                {
                    prop: "paramValueType",
                    label: "参数类型",
                    type: "text",
                },

                {
                    prop: "isNeed",
                    label: "是否必输",
                    type: "text",
                    filter: "isFilter"
                },
            ],
            iOutputListTable: [
                {
                    prop: "paramCName",
                    label: "参数名称",
                    type: "text",
                },

                {
                    prop: "paramValueType",
                    label: "参数类型",
                    type: "text",
                },

                {
                    prop: "isNeed",
                    label: "是否必输",
                    type: "text",
                    filter: "isFilter"
                },
            ],
        };
    },
    watch: {
        basicData: {
            handler(newVal) {
                console.log(newVal, '???')
                this.iInputList = [];
                this.iOutputList = [];
                this.$nextTick(() => {
                    // this.$refs.bizRuleRef.businessRuleList = res.bizRuleList;
                    this.iInputList = reList(
                        newVal.puApiParams.filter(
                            (item) => item.paramDirection == 0
                        )
                    );
                    this.iOutputList = reList(
                        newVal.puApiParams.filter(
                            (item) => item.paramDirection == 1
                        )
                    );
                    // this.changeStatus();
                    this.setSourceOption(this.iOutputList);
                });
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        setSourceOption(data) {
            data.forEach((item) => {
                if (item.actionId == "" || item.actionName == "") {
                    // item.actionId = this.detailInfo.svcId;
                    item.actionName = "当前4b交易";
                    item.paramMappingKey = item.paramKey;
                    item.paraMapgNm = item.paramCName;
                }
                if (item.children && item.children.length) {
                    this.setSourceOption(item.children);
                }
            });
        },
        changeStatus() {
            const tempInArr = this.allInputList.filter(
                (item) => item.paramPosition == 0
            );
            const tempOutArr = this.allOutputList.filter(
                (item) => item.paramPosition == 0
            );
            this.iInputList = this.isShowHeader
                ? this.allInputList
                : tempInArr.length
                    ? [...tempInArr[0].children]
                    : [];

            this.iOutputList = this.isShowHeader
                ? this.allOutputList
                : tempOutArr.length
                    ? [...tempOutArr[0].children]
                    : [];
        },
    },
};
</script>

<style lang="scss" scoped>
.interface-contract {
    .wrap-item {
        overflow-y: auto;
        padding: 24px;
    }

    .card {
        margin-bottom: 20px;

        .desc {
            font-size: 14px;
            color: #999999;
        }
    }

    p {
        line-height: 36px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .ellipsis {
            cursor: pointer;
        }

        span {
            font-size: 14px;
        }

        .top {
            font-size: 16px;
        }
    }

    .item {
        background-color: #ffffff;
        border-bottom: 1px solid #dcdce8;
        padding: 20px;
        margin-bottom: 10px;

        .card_title {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #333;
            margin-bottom: 24px;

            .d_line {
                display: inline-block;
                width: 3px;
                height: 14px;
                margin-right: 6px;
                background: #358AFF;
                flex-shrink: 0;
            }

            .d_detail {
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #333333;
                letter-spacing: 0;
                font-weight: 500;
            }

            .card_desc_tips {
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #999999;
                font-weight: 400;
                margin-left: 8px;
                line-height: 22px;
            }
        }
    }

    .el-row {
        margin-bottom: 20px;
    }

    .content-top {
        padding: 20px;
    }

    .center-wrap {
        padding: 20px;
    }

    .bottom-wrap {
        padding: 20px;
    }
}
</style>
