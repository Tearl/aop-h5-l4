<template>
    <div class="aop_developer_comps_page_tabs">
        <div v-if="tabType == 'C'">
            <el-form
                :inline="true"
                :model="formSearch3"
                class="demo-form-inline"
            >
                <el-form-item label="应用名称：" size="mini">
                    <el-input
                        v-model="formSearch3.appNm"
                        placeholder="请输入应用名称"
                        class="list-input_search"
                    ></el-input>
                </el-form-item>
                <el-form-item label="应用编号：" size="mini">
                    <el-input
                        v-model="formSearch3.appId"
                        placeholder="请输入应用编号"
                        class="list-input_search"
                    ></el-input>
                </el-form-item>
                <el-form-item size="small" style="float: right">
                    <el-button size="small" type="primary" @click="searchSubmit2('C')"
                        >搜索</el-button
                    >
                    <el-button size="small" plain @click="resetSearch2">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="preview_content_table">
                <h3>代码历史列表</h3>
                <el-table
                    :data="tableC"
                    align="center"
                    :header-cell-style="{
                        background: '#F5F5F8',
                        color: '#333',
                    }"
                    size="medium"
                    default-expand-all="true"
                >
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table
                                :data="props.row.fnctDevBranchInfoList"
                                align="center"
                                :header-cell-style="table_rowStyle"
                                size="small"
                                class="table_table_cell"
                                :cell-style="table_columnStyle"
                            >
                                <el-table-column
                                    property="branchAddr"
                                    label="分支地址"
                                    min-width="150"
                                ></el-table-column>
                                <el-table-column
                                    property="branchNm"
                                    label="分支描述"
                                    min-width="150"
                                ></el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column
                        property="appNm"
                        min-width="150"
                        label="应用名称"
                    >
                    </el-table-column>
                    <el-table-column
                        property="projectName"
                        label="应用编码"
                        min-width="180"
                    ></el-table-column>
                    <el-table-column
                        property="appDesc"
                        label="应用描述"
                        min-width="220"
                    ></el-table-column>
                </el-table>
            </div>
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
        tableC: {
            type: Array,
            default: () => [],
        },
        tabType: {
            type: String,
            default: () => "",
        },
        formSearch3: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            // 列表数据
            showCodeDialog: false,
        };
    },
    methods: {
        handleClick(e) {
            this.$emit("tabClick", e);
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
        // 弹窗搜索
        searchSubmit2(type) {
            this.$emit("searchSubmit2", type);
        },
        // 重置搜
        resetSearch2(type) {
            this.$emit("resetSearch2", type);
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
    computed:{
        table_columnStyle(){
            return function(row, column, rowIndex, columnIndex){
                const style = {
                    line:{'text-indent':"47px"}
                };
                if(row.column.property=="branchAddr"){
                    return style['line']
                }
            }
        },
        table_rowStyle(){
            return function(row, column, rowIndex, columnIndex){
                const style = {
                    line:{ background: '#F5F5F8',
                                    color: '#333',},
                    title:{
                                    background: '#F5F5F8',
                                    color: '#333',
                                    'text-indent':"23px"
                                }
                };
                if(row.column.label=="分支地址"){
                    return style['title']
                } else {
                    return style['line']
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_developer_comps_page_tabs {
    width: 100%;
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
        max-height: calc(100vh - 234px);
        min-height: calc(100vh - 234px);
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
    .demo-form-inline {
        width: 100%;
        margin: 12px 0px;
        padding: 16px 0 0 16px;
        background: #ffffff;
        ::v-deep .el-form-item__content {
            input {
                width: 140px;
            }
            .el-date-editor.el-input,
            .el-date-editor.el-input__inner {
                width: 140px;
            }
        }
        ::v-deep .el-button{
            min-width:64px;
            height:32px;
            font-size:14px;
        }
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
