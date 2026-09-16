<template>
    <div class="aop_developer_comps_page_tabs">
        <div v-if="tabType == 'B'">
            <el-form
                :inline="true"
                :model="formSearch"
                class="demo-form-inline"
            >
                <el-form-item label="标准服务名称/ID：" size="mini">
                    <el-input
                        v-model="formSearch.inputValue"
                        placeholder="请输入"
                        class="list-input_search"
                    ></el-input>
                </el-form-item>
                <el-form-item size="mini" style="float: right">
                    <el-button type="primary" @click="searchSubmit('A')"
                        >搜索</el-button
                    >
                    <el-button plain @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="preview_content_table">
                <h3>服务列表</h3>
                <el-table
                    :data="tableListB"
                    align="center"
                    :header-cell-style="{
                        background: '#F5F5F8',
                        color: '#333',
                    }"
                    size="medium"
                >
                    <el-table-column
                        property="serviceName"
                        label="标准服务名称"
                        min-width="150"
                    ></el-table-column>
                    <el-table-column
                        property="serviceCode"
                        label="标准服务ID"
                        min-width="150"
                    >
                    </el-table-column>
                    <el-table-column
                        property="domainNm"
                        label="所属系统"
                        min-width="180"
                    ></el-table-column>
                    <el-table-column
                        property="toAlctPersonNm"
                        label="作业人员"
                        min-width="180"
                    ></el-table-column>
                    <el-table-column
                        property=""
                        min-width="180"
                        label="操作"
                    >
                        <template slot-scope="scope">
                            <el-button
                                @click.native.prevent="
                                    listnameDetail('对比图', scope.row)
                                "
                                type="text"
                                size="small"
                            >
                                对比图
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="btn_el_pageNation"
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    medium
                    background
                    :current-page="currentPage1"
                    :page-sizes="[5, 10, 20]"
                    :page-size="pageSize1"
                    layout="  prev, pager, next,sizes, jumper"
                    :total="total1"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    components: {},
    props: {
        tableListB: {
            type: Array,
            default: () => [],
        },
        tabType: {
            type: String,
            default: () => "",
        },
        topInfo: {
            type: Object,
            default: () => {},
        },
        formSearch: {
            type: Object,
            default: () => {},
        },
        pageSize1: {
            type: String,
            default: () => "10",
        },
        currentPage1: {
            type: String,
            default: () => "1",
        },
        total1: {
            type: String,
            default: () => "",
        },
    },
    data() {
        return {};
    },
    methods: {
        handleClick(e) {
            this.$emit("tabClick", e);
        },
        handleTabsEdit(e) {
            this.$emit("tabEdit", e);
        },
        listnameDetail(type, value) {
            console.log("对比图点击跳转", type, value);
            let path =
                window.location.protocol +
                "//" +
                window.location.host +
                "/aop-h5-sub/#/aop_l5directdesign/alonePages/apicompare?isGatewayCompare=true&grsiiId=" +
                value.serviceId;
            window.location.href = path;
            // this.$router.push({
            //     path: path,
            //     query: {
            //         isGatewayCompare: true,
            //         grsiiId:""
            //     },
            // });
        },
        // 弹窗搜索
        searchSubmit(type) {
            this.$emit("searchSubmit", type);
        },
        // 重置
        resetSearch(type) {
            this.$emit("resetSearch", type);
        },
        handleSizeChange1(val) {
            console.log(`每页 ${val} 条`);
            this.$emit("handleSizeChange1", val);
        },
        handleCurrentChange1(val) {
            console.log(`当前页: ${val}`);
            this.$emit("handleCurrentChange1", val);
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
    width: 100%;
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
        max-height: calc(100vh - 364px - 102px);
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
    .demo-form-inline {
        width: 100%;
        margin: 12px 0px;
        padding: 16px 0 0 16px;
        background: #ffffff;
        .el-form-item__label {
            color: #333333;
        }
        ::v-deep .el-form-item__content {
            input {
                width: 140px;
            }
            .el-date-editor.el-input,
            .el-date-editor.el-input__inner {
                width: 140px;
            }
        }
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
