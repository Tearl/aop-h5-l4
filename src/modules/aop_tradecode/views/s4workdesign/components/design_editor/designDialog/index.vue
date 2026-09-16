<template>
    <div
        class="aop_tradecode_comps_d4editor_service_define_check_systemDesign_dialog"
    >
        <PageDialog
            :dialogWidth="'800px'"
            :dialogTitle="'设计确认'"
            :dialogVisiable="dialogVisible"
            :destroyOnClose="true"
            @closeDialog="closeDialog"
            class="dialog_container"
        >
            <div slot="box">
                <div class="standar_check_dialog">
                    <el-table :data="tableData" border style="width: 100%">
                        <el-table-column
                            prop="label"
                            label="评审项"
                            width="350"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="checkFlg"
                            label="评审结果"
                            align="center"
                            width="80"
                        >
                            <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.checkFlg"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                >
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column prop="inputText" label="评审意见">
                            <template slot-scope="scope">
                                <el-input
                                    v-model="scope.row.inputText"
                                    size="small"
                                    placeholder="请输入内容"
                                ></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div slot="footer" style="text-align: right">
                <el-button @click.native="closeDialog">取 消</el-button>
                <el-button type="primary" @click.stop="confirm"
                    >确 定</el-button
                >
            </div>
        </PageDialog>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_editor_table";
export default {
    mixins: [mixin],
    components: {
        PageDialog,
        Table,
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
        },
        nodeData: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            noStandarParamsColumn: [
                {
                    prop: "txId",
                    label: "交易ID",
                    minWidth: "50%",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "txNm",
                    label: "交易名称",
                    minWidth: "50%",
                    type: "text",
                    tooltip: true,
                },
            ],
            funFlowColumn: [
                {
                    prop: "ifId",
                    label: "接口ID",
                    minWidth: "50%",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "ifNm",
                    label: "接口名称",
                    minWidth: "50%",
                    type: "text",
                    tooltip: true,
                },
            ],
            //未被实现业务交易：
            arrangeParamList: [],

            //接口未被功能流程图使用列表：
            funFlowList: [],

            successFlag: false,
            tableData: [],
        };
    },
    methods: {
        async init() {
            const res = await this.rpc.assetList.commonVariableQuery({
                varTpCd: "bizEventReviewSection",
            });
            const list = res.commonVariableList;
            this.tableData = [];
            list.forEach((item) => {
                this.tableData.push({
                    ...item,
                    label: item.varVal,
                    checkFlg: true,
                    inputText: "",
                });
            });
        },
        async showDialog(nodeData) {
            const { systemDesignReviewContentDetailRecordList } =
                await this.rpc.assetList.querySingleContentReviewResult({
                    examId: this.$route.query.examId,
                    fnctId: this.$route.query.fnctId,
                    contTpCd: "04",
                    // 内容类型代码
                    parntContId: nodeData.parent.dataId,
                    contId: nodeData.dataId,
                });
            if (
                Array.isArray(systemDesignReviewContentDetailRecordList) &&
                systemDesignReviewContentDetailRecordList.length
            ) {
                this.tableData = systemDesignReviewContentDetailRecordList.map(
                    (item) => {
                        return {
                            checkFlg: item.rewReltCd === "0",
                            inputText: item.rewOpinion || "",
                            label: item.rewSectnNm,
                            ...item,
                        };
                    }
                );
            } else {
                await this.init();
            }
        },
        async confirm() {
            this.$emit("checkSystemDesign", this.tableData);
        },
        closeDialog() {
            this.$emit("closeReview");
        },
    },
    async mounted() {
        await this.showDialog(this.nodeData);
    },
    filters: {
        ...filters,
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";

.aop_tradecode_comps_d4editor_service_define_check_systemDesign_dialog {
    .standar_check_dialog {
        display: flex;
        justify-content: center;
        flex-direction: column;

        .standar_check_list {
            .list_item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 16px;

                .text {
                    margin-right: 10px;
                }

                .title {
                    display: inline-block;
                    width: 200px;
                    margin-right: 10px;
                    font-weight: 600;
                }

                .result {
                    margin-right: 10px;

                    &.failed {
                        color: $danger_color;
                    }

                    &.success {
                        color: $success_color;
                    }
                    &.waring {
                        color: $warning_color;
                    }
                }
            }
        }

        .tips_info {
            text-align: center;
            font-weight: 600;
        }

        .case_tips {
            .case_content {
                display: inline-block;
                margin-left: 180px;
                margin-top: 12px;
                max-width: 500px;
            }

            .btn_style {
                position: absolute;
                right: 32px;
                top: 254px;
            }
        }

        .case_content {
            // display: inline-block;
            margin-left: 138px;
            margin-top: 12px;
            max-width: 500px;
            display: flex;
        }

        .btn_style {
            position: absolute;
            right: 32px;
            top: 254px;
        }

        .execute {
            width: 90px;
        }
    }

    .test_record_icon {
        width: 20px;
        height: 20px;
        vertical-align: sub;
    }

    .success_box {
        text-align: center;
    }

    .tips {
        padding: 10px;
        // background-color: #fdf6ec;
        // border-color: #faecd8;
        color: #e6a23c;
    }
}
</style>
