<template>
    <div class="aop_developer_comps_page_tabs">
        <div v-if="tabType == 'C'" class="preview_content_table">
            <h3>部署历史</h3>
            <el-table
                :data="tableListC"
                align="center"
                :header-cell-style="{
                    background: '#F5F5F8',
                    color: '#333',
                }"
                size="medium"
            >
                <el-table-column
                    property="deployApplicationId"
                    label="部署申请号"
                    min-width="120"
                >
                    <!-- <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="
                                clickshowDialog('部署申请号', scope.row)
                            "
                            type="text"
                            size="small"
                        >
                            {{ scope.row.deployApplicationId }}
                        </el-button>
                    </template> -->
                </el-table-column>
                <el-table-column
                    property="crtTm"
                    label="申请时间"
                    min-width="180"
                >
                </el-table-column>
                <el-table-column
                    property="creatrNm"
                    label="申请人"
                    min-width="100"
                ></el-table-column>
                <el-table-column
                    property="planDeployDate"
                    label="部署时间"
                    min-width="180"
                ></el-table-column>
                <el-table-column
                    property="deployPrsnNm"
                    label="部署人"
                    min-width="100"
                ></el-table-column>
                <el-table-column
                    property="deploySts"
                    label="部署状态"
                    min-width="120"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.deploySts == 1" class="orange"
                            >失败</span
                        >
                        <span v-if="scope.row.deploySts == 2" class="green"
                            >成功</span
                        >
                        <span v-if="scope.row.deploySts == 0" class="orange"
                            >未部署</span
                        >
                    </template>
                </el-table-column>
                <el-table-column
                    property="deployFailedReason"
                    label="失败原因"
                    min-width="150"
                ></el-table-column>
                <el-table-column
                    property=""
                    label="附件"
                    min-width="150"
                >
                    <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="
                                downloadText('下载', scope.row.deployAtchUrl)
                            "
                            type="text"
                            size="medium"
                        >
                            下载
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="btn_el_pageNation"
                @size-change="handleSizeChange3"
                @current-change="handleCurrentChange3"
                medium
                background
                :current-page="currentPage2"
                :page-sizes="[10, 20, 30]"
                :page-size="pageSize3"
                layout="  prev, pager, next,sizes, jumper"
                :total="total3"
            >
            </el-pagination>
            <FormDialog
                :dialogTitle="'部署申请信息'"
                :visibleShow="showCodeDialog"
                :formB="formA"
                :tableData="tableListB"
                closeDialog="closeDialogB"
            >
            </FormDialog>
        </div>
    </div>
</template>
<script>
import FormDialog from "./formDialog.vue";
export default {
    components: {
        FormDialog,
    },
    props: {
        tableListC: {
            type: Array,
            default: () => [],
        },
        tabType: {
            type: String,
            default: () => "",
        },
        pageSize3: {
            type: String,
            default: () => "10",
        },
        currentPage3: {
            type: String,
            default: () => "1",
        },
        total3: {
            type: String,
            default: () => "",
        },
    },
    data() {
        return {
            showCodeDialog: false,
            formA: {},
            tableListB: [],
        };
    },
    methods: {
        handleClick(e) {
            this.$emit("tabClick", e);
        },
        handleTabsEdit(e) {
            this.$emit("tabEdit", e);
        },
        // 部署申请号弹窗
        clickshowDialog(type, row) {
            console.log("部署申请号弹窗", type, row);
            this.formA = row;
            this.showCodeDialog = true;
        },
        // 部署附件下载
        downloadText(type, row) {
            console.log("下载附件", type, row);
        },
        // 代码历史列表懒加载
        load(tree, treeNode, resolve) {
            setTimeout(() => {
                resolve([
                    {
                        id: 31,
                        name: "王小虎",
                        address: "上海市普陀区金沙江路 1519 弄",
                    },
                    {
                        id: 32,
                        name: "王小虎",
                        address: "上海市普陀区金沙江路 1519 弄",
                    },
                ]);
            }, 1000);
        },
        handleSizeChange3(val) {
            console.log(`每页 ${val} 条`);
            this.$emit("handleSizeChange3", val);
        },
        handleCurrentChange3(val) {
            console.log(`当前页: ${val}`);
            this.$emit("handleCurrentChange3", val);
        },
        // 列表选择数据提交
        submitChange() {
            // 同步更新首页列表权限
            // const params = {
            //     data: this.multipleSelection || [],
            // };
            // const res = await this.rpc.maint.getSysConfListDetail(params); //WF0301004
        },
    },
    created() {
        // this.getInfo(); // 查询基本详情
    },
    watch: {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_developer_comps_page_tabs {
    background-color: $base_white;
    width: 100%;
    margin-top:12px;
    h3 {
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        line-height: 36px;
    }
    .preview_content_table {
        padding: 16px 16px;
        background: #ffffff;
        color: #131313;
        max-height: calc(100vh - 364px);
        overflow-y: auto;
        h3 {
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            line-height: 36px;
        }
        .orange {
            font-size: 12px;
            color: #fe4758;
            background: #ffffff;
            padding: 2px 5px;
            border-radius: 2px 2px;
            border: 1px solid #fe4758;
        }
        .green {
            font-size: 12px;
            color: #36d542;
            background: #ffffff;
            padding: 2px 5px;
            border-radius: 4px 4px;
            border: 1px solid #36d542;
        }
        .blue {
            font-size: 12px;
            color: #358aff;
            background: #ffffff;
            padding: 2px 5px;
            border-radius: 2px 2px;
            border: 1px solid #358aff;
        }
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
    ::v-deep .el-tabs__nav-wrap::after {
        background-color: $base_white;
    }
    ::v-deep .el-dialog__footer {
        display: flex;
        justify-content: center;
    }
    .btn_el_pageNation {
        display: flex;
        justify-content: center;
        padding: 16px 0;
    }
    .dialog-footer {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        .el-button {
            margin-right: 10px;
        }
    }
    ::v-deep .el-tabs__header {
        margin: 0;
        .el-tabs__item {
            height: 72px;
            padding: 0 30px;
            line-height: 72px;
            font-size: 16px;
            font-family: $font_medium;
            letter-spacing: 0;
            font-weight: $font_weight_600;
        }
    }
    ::v-deep .el-tabs__content {
        display: none;
    }
}
</style>
