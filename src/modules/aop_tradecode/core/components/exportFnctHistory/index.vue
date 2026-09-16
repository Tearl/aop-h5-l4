<template>
    <div class="export-fnct-history">
        <el-dialog
            top="10vh"
            width="800px"
            :append-to-body="true"
            :close-on-click-modal="false"
            :visible.sync="exportVisible"
            custom-class="export-fnct-history_detail_list"
            :destroy-on-close="true"
            @close="close"
        >
            <div class="title-block" slot="title">
                <div class="left-info">
                    <span>功能历史版本</span>
                </div>
            </div>
            <div class="select-body">
                <el-table
                    :data="functionInfoList"
                    align="center"
                    :header-cell-style="{
                        background: '#F5F5F8',
                        color: '#333',
                    }"
                    size="mini"
                    :stripe="false"
                    max-height="500"
                    @row-click="rowClick"
                    highlight-current-row
                >
                    <el-table-column label="选择" width="55" align="center">
                        <template slot-scope="scope">
                            <el-radio
                                class="radio"
                                v-model="selectFnct"
                                :label="scope.row.fnctId"
                                >&nbsp;</el-radio
                            >
                        </template>
                    </el-table-column>
                    <el-table-column
                        property="fnctNo"
                        label="功能编号"
                        min-width="100"
                        show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                        property="fnctNm"
                        label="功能名称"
                        min-width="100"
                        show-overflow-tooltip="true"
                    >
                    </el-table-column>
                    <el-table-column
                        property="fnctVerNo"
                        label="功能版本号"
                        min-width="100"
                    >
                    </el-table-column>
                </el-table>
            </div>

            <div class="confirm-footer" slot="footer">
                <el-button type="plain" size="small" @click="close"
                    >取消</el-button
                >
                <el-button
                    type="primary"
                    size="small"
                    :loading="confirmLoading"
                    @click="confirm('01')"
                    >增量导入</el-button
                >
                <el-button
                    type="primary"
                    size="small"
                    :loading="confirmLoading"
                    @click="confirm('02')"
                    >全量替换</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],
    props: {
        exportVisible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            functionInfoList: [],
            selectFnct: "",
            confirmLoading: false,
        };
    },
    async mounted() {
        await this.getList();
    },
    methods: {
        close() {
            this.$emit("close");
        },
        async getList() {
            //
            const { fnctId, examId } = this.$route.query;
            const { functionInfoList } =
                await this.rpc.s4design.queryFunctionHistoryVersionList({
                    fnctId,
                    examId,
                    qryTpCd: "C4",
                });
            this.functionInfoList = functionInfoList;
            functionInfoList.forEach((element) => {
                if (element.flg == "1") {
                    this.selectFnct = element.fnctId;
                }
            });
            // this.functionInfoList = [
            //     {
            //         fnctId: "1",
            //         fnctNo: "1",
            //         fnctNm: "1",
            //         fnctVerNo: "1",
            //     },
            //     {
            //         fnctId: "12",
            //         fnctNo: "12",
            //         fnctNm: "12",
            //         fnctVerNo: "12",
            //     },
            //     {
            //         fnctId: "123",
            //         fnctNo: "123",
            //         fnctNm: "123",
            //         fnctVerNo: "123",
            //     },
            // ];
        },
        rowClick(row) {
            this.selectFnct = row.fnctId;
        },
        async confirm(importTpCd) {
            if (!this.selectFnct) {
                return this.$message({
                    message: "请选择功能版本",
                    type: "warning",
                });
            }
            this.confirmLoading = true;
            const { fnctId, examId } = this.$route.query;
            await this.rpc.s4design.copyFunctionJobData({
                srcFnctId: this.selectFnct,
                fnctId,
                examId,
                importTpCd,
            });
            this.confirmLoading = false;
            this.$emit("confirm");
        },
    },
};
</script>

<style lang="scss">
.export-fnct-history_detail_list {
    border-radius: 8px;
    .el-dialog__header {
        padding: 12px 24px !important;
        background: #fafafc;
        border-radius: 8px 8px 0px 0px;
        .el-dialog__headerbtn {
            top: 14px !important;
        }
    }

    .el-dialog__body {
        border-top: 1px solid #eee;
        padding: 18px !important;
    }
    .el-dialog__footer {
        text-align: center;
    }
}
</style>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.title-block {
    font-weight: 500;
    @include flex(row, space-between, center);
    padding-right: 30px;
}
</style>
