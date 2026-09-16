<template>
    <el-dialog
        :title="dialogTitle"
        width="60%"
        append-to-body="true"
        :visible.sync="visibleShow"
        @handleClose="closeDialog"
        class="aop_techdesign_techdetail_dialog"
    >
        <div class="preview_content_table">
            <div class="preview_content_table_flex">
                <p>
                    部署环境：
                    <span>{{ formB.product }}</span>
                </p>
            </div>
            <div class="preview_content_table_flex">
                <p>
                    部署时间：
                    <span>{{ formB.time }}</span>
                </p>
            </div>
        </div>
        <div class="preview_dialog_table_list">
            <h3>应用列表</h3>
            <el-table
                :data="tableData"
                align="center"
                :header-cell-style="{
                    background: '#F5F5F8',
                    color: '#333',
                }"
                size="small"
            >
                <el-table-column
                    property="code"
                    label="应用编码"
                    min-width="150"
                ></el-table-column>
                <el-table-column property="name" min-width="150" label="应用名称">
                </el-table-column>

                <el-table-column
                    property="des"
                    label="部署分支"
                    min-width="150"
                ></el-table-column>
            </el-table>
            <div class="dialog_btn">
                <el-button type="primary" @click="visibleShow = false"
                    >关闭</el-button
                >
            </div>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props: {
        visibleShow: {
            type: Boolean,
            default: false,
        },
        dialogTitle: {
            type: String,
            default: "Dialog",
        },
        formB: {
            type: Object,
            default: () => ({}),
        },
        tableData: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            tabActive: "K",
            formLabelWidth: "120",
            formC: {},
        };
    },
    methods: {
        handleClose() {
            this.$emit("closeDialog");
        },
        handleTabClickB(e) {
            this.tabActive = e;
            let form = {
                itNo: "1",
                name: "低配",
                verson: "8G",
                des: "500G",
            };
            let form2 = {
                itNo: "1",
                name: "中配",
                verson: "16G",
                des: "500G",
            };
            let form3 = {
                itNo: "1",
                name: "高配",
                verson: "32G",
                des: "500G",
            };
            let form4 = {
                itNo: "2",
                name: "高配",
                verson: "32G",
                des: "500G",
            };
            if (e == "K") {
                this.formC = form;
            } else if (e == "S") {
                this.formC = form2;
            } else if (e == "U") {
                this.formC = form3;
            } else if (e == "P") {
                this.formC = form4;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_techdesign_techdetail_dialog {
    min-width: 640px;
    ::v-deep .el-dialog{
        border-radius:8px 8px;
    }
    .preview_dialog_table_list {
        width: 100%;
        h3 {
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            line-height: 36px;
        }
        .dialog_btn {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px 0px;
        }
        .preview_dialog_table_list_flex {
            display: flex;
            margin-bottom: 10px !important;
            ::v-deep .el-table__cell {
                text-align: center !important;
                font-size: 12px !important;
                line-height: 1.5 !important;
            }
        }
        .preview_dialog_table_list_flex_end {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            ::v-deep .el-table__cell {
                text-align: center !important;
                font-size: 12px !important;
                line-height: 1.5 !important;
            }
        }
        .preview_dialog_table_list_item {
            margin-bottom: 2px !important;
            span {
                font-size: 12px !important;
                line-height: 1.5 !important;
            }
        }
    }
    ::v-deep .el-dialog__header {
        border-bottom: 1px solid #999999;
        .el-dialog__headerbtn {
            width: 20px;
            height: 20px;
            text-align: center;
            border: 1px solid red !important;
            border-radius: 50% 50% !important;
        }
        .el-dialog__headerbtn .el-dialog__close {
            color: red !important;
        }
    }
    .preview_content_table {
        margin: 16px 0 20px 0;
        color: #131313;
        padding-bottom: 5px;
        .preview_content_table_flex {
            display: flex;
            width: 100%;
            p {
                margin-top: 6px;
                color: $pri_ft_color;
                width: 50%;
                span {
                    color: #131313;
                }
            }
        }
    }
}
</style>
