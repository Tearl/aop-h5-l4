<template>
    <div class="aop_developer_comps_page_tabs">
        <div v-if="tabType == 'B'" class="preview_content_table">
            <h3>工程应用列表</h3>
            <el-table
                :data="tableB"
                align="center"
                :header-cell-style="{
                    background: '#F5F5F8',
                    color: '#333',
                }"
                size="medium"
            >
                <el-table-column
                    property="appId"
                    label="工程应用编号"
                    min-width="180"
                ></el-table-column>
                <el-table-column
                    property="appNm"
                    label="工程应用名称"
                    min-width="200"
                ></el-table-column>
                <el-table-column
                    property="appDesc"
                    label="工程应用描述"
                    min-width="380"
                ></el-table-column>
                <el-table-column min-width="150" fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="
                                lookThis('查看配置', scope.row)
                            "
                            type="text"
                            size="small"
                            style="font-size:14px;"
                        >
                            查看配置
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <el-pagination
                class="btn_el_pageNation"
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                medium
                background
                :current-page="currentPage2"
                :page-sizes="[10, 20, 30]"
                :page-size="pageSize2"
                layout="prev, pager, next,sizes, jumper"
                :total="total2"
            >
            </el-pagination> -->
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
        tableB: {
            type: Array,
            default: () => [],
        },
        tabType: {
            type: String,
            default: () => "",
        },
        pageSize2: {
            type: String,
            default: () => "10",
        },
        currentPage2: {
            type: String,
            default: () => "1",
        },
        total2: {
            type: String,
            default: () => "",
        },
        orderDetail: {
            type: String,
            default: () => "",
        }
    },
    data() {
        return {
            formSearch: {
                inputValue: "",
            },
            // 列表数据

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
        listnameDetail(type, value) {
            console.log("交易名称跳转应用", type, value);
        },
        lookThis(type,row){
            // 查看配置
            console.log(row,"查看配置详情")
            let params = Object.assign(row,{authAstFnctInfoId:this.orderDetail.authAstFnctInfoId})
            this.$router.push({
                path: "/aop_tradecode/assetALLList/viewConfigtion",
                query: params,
            });
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
        handleSizeChange2(val) {
            this.$emit("handleSizeChange2", val);
        },
        handleCurrentChange2(val) {
            this.$emit("handleCurrentChange2", val);
        },
    },
    created() {
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
    .preview_content_table::-webkit-scrollbar {
        display: none;
    }
    .preview_content_table {
        padding: 16px 16px;
        background: #ffffff;
        color: #131313;
        max-height: calc(100vh - 300px);
        min-height: calc(100vh - 300px);
        overflow-y: auto;
        h3 {
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            line-height: 36px;
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
