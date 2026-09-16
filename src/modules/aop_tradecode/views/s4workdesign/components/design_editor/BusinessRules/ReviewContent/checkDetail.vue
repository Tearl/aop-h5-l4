<template>
    <div>
        <el-dialog
            top="10vh"
            width="800px"
            :append-to-body="true"
            :close-on-click-modal="false"
            :visible.sync="checkVisible"
            custom-class="dialog-content-table_standard_check_detail_list"
            :destroy-on-close="true"
            @close="close"
        >
            <div class="title-block" slot="title">
                <div class="left-info">
                    <span style="margin-right: 4px">检测结果</span>
                    <el-tag
                        type="success"
                        effect="plain"
                        size="mini"
                        v-if="checkResult == '1'"
                        >通过</el-tag
                    >
                    <el-tag type="danger" effect="plain" size="mini" v-else
                        >不通过</el-tag
                    >
                </div>
            </div>
            <div class="confirm-body">
                <el-table
                    size="mini"
                    border
                    :data="checkItemList"
                    style="width: 100%"
                    :max-height="800"
                    :show-header="true"
                    :header-cell-style="{
                        background: '#F5F5F8',
                        color: '#606266',
                    }"
                    :span-method="arraySpanMethod"
                >
                    <el-table-column
                        prop="checkTypeName"
                        label="检测类型"
                        min-width="100"
                        show-overflow-tooltip="true"
                    ></el-table-column>
                    <el-table-column
                        prop="checkItemName"
                        label="检测项"
                        min-width="150"
                        show-overflow-tooltip="true"
                    ></el-table-column>
                    <el-table-column label="状态" width="80" align="center">
                        <template slot-scope="scope">
                            <i
                                v-if="scope.row.checkItemResult == '0'"
                                class="el-icon-error"
                                style="color: #f56c6c"
                            ></i>
                            <i
                                v-else
                                class="el-icon-success"
                                style="color: #67c23a"
                            ></i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="confirm-footer" slot="footer">
                <el-button type="primary" size="small" @click="close"
                    >关闭</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        checkVisible: {
            type: Boolean,
            default: false,
        },
        checkResult: "",
        checkItemList: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {};
    },
    computed: {},
    async mounted() {},
    methods: {
        close() {
            this.$emit("close", false);
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (
                    rowIndex === 0 ||
                    row.checkTypeName !== this.checkItemList[rowIndex - 1].checkTypeName
                ) {
                    let rowspan = 1;
                    for (
                        let i = rowIndex + 1;
                        i < this.checkItemList.length;
                        i++
                    ) {
                        if (this.checkItemList[i].checkTypeName === row.checkTypeName) {
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
    },
};
</script>

<style lang="scss">
.dialog-content-table_standard_check_detail_list {
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
.confirm-footer {
    /deep/ button {
        padding-left: 30px !important;
        padding-right: 30px !important;
    }
}
</style>
