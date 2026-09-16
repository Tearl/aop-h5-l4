<!--
 * 数据字典-数据字典管控
 -->
<template>
    <div class="panel-container">
        <!-- 搜索行 -->
        <div v-show="isSearch" class="top-search-line">
            <el-form :model="searchForm" ref="formData" class="comp-lib-search-form" :inline="false" label-width="150px"
                size="small">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="字段名称/简称/全称：" props="fieldName">
                            <el-input class="w150p" v-model="searchForm.fieldName" placeholder="请输入" clearable
                                maxlength="30">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item class="search_item" label="申请来源：" size="small" props="fieldSource">
                            <el-select placeholder="请选择" v-model="searchForm.fieldSource" clearable filterable
                                class="w150p">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item, i) in applySourceOption" :key="i" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item class="search_item" label="处理结果：" size="small" props="status">
                            <el-select placeholder="请选择" v-model="searchForm.status" filterable class="w150p">
                                <!-- <el-option label="全部" value=""></el-option> -->
                                <el-option v-for="(item, i) in statusList" :key="i" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="search-side-btns">
                <el-button class="search-side-btn" type="primary" size="small" @click="handleSearch">查 询</el-button>
                <el-button class="search-side-btn" size="small" @click="handleReset">重 置</el-button>
            </div>
        </div>
        <!-- 列表 -->
        <div class="list-panel-outer">
            <!-- 列表头部行 -->
            <div class="page-flex-mode-header mb16">
                <div class="title-text">
                    <em>字段申请列表</em>
                </div>
                <tableOptimize :isSearch.sync="isSearch" :isStripe.sync="isStripe" :operateShow="false">
                </tableOptimize>
            </div>
            <!-- 列表 -->
            <div class="aop_common_page_table">
                <el-table v-loading="tableLoading" :stripe="isStripe" :data="tableData">
                    <el-table-column prop="fieldName" label="字段名称" min-width="120"></el-table-column>
                    <el-table-column prop="fieldSource" label="申请来源" min-width="100">
                        <template slot-scope="{ row }">
                            <span>{{
                                applySourceObj[row.fieldSource] ||
                                row.fieldSource ||
                                ""
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createUserName" label="申请人" min-width="100">
                    </el-table-column>
                    <el-table-column prop="createTime" label="申请时间" min-width="100">
                    </el-table-column>
                    <el-table-column prop="status" label="处理结果" min-width="100">
                        <template slot-scope="{ row }">
                            <span class="state_box" :class="stateClass(row.status).type">{{ stateClass(row.status).label
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="120" align="left" fixed="right">
                        <div class="flex_wrap" slot-scope="{ row }">
                            <span class="design_btn blue pointer" v-if="row.status !== '00'"
                                @click="handleView(row)">查看</span>
                            <!-- <el-divider
                                v-if="row.status !== '00'"
                                direction="vertical"
                            ></el-divider> -->
                            <span v-if="row.status === '00'" class="design_btn blue pointer"
                                @click="handleReview(row)">审批</span>
                        </div>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div>
                <pagePagination @size-change="paginationChange" @current-change="currentChange" :pager="pager">
                </pagePagination>
            </div>
        </div>

        <!-- 查看字段 -->
        <viewField ref="viewField" />
        <!-- 新增/审批字段 -->
        <handleField ref="handleField" @refreshData="getTableData" @refreshAddFinish="refreshAddFinish" />
        <!-- 审批字段 -->
        <reviewField ref="reviewField" @reviewFieldAdd="handleReviewAdd" @refreshData="getTableData" />
    </div>
</template>

<script>
import mixin from "@m/core/mixin";
import tableOptimize from "@m/core/components/table_optimize";
import pagePagination from "@m/core/components/page_pagination";
import viewField from "../components/manageControl/viewField.vue";
import handleField from "../components/manageControl/handleField.vue";
import reviewField from "../components/manageControl/reviewField.vue";
import { applySourceOption } from "@m/utils/commonData";
import { arrayToJson } from "@m/utils/tools";

export default {
    mixins: [mixin],
    props: {
        listType: {
            type: String,
            default: 'waitApprove',
        },
        sideType: {
            type: String,
            default: '2',
        },
    },
    components: {
        tableOptimize,
        pagePagination,
        viewField,
        handleField,
        reviewField,
    },
    data() {
        return {
            isSearch: true, // 是否展示搜索行
            isStripe: false, // 是否显示斑马线
            // 列表搜索项
            searchForm: {
                fieldName: "",
                fieldSource: "",
                status: "00",
            },
            // statusList: [
            //     // {
            //     //     label: "待处理",
            //     //     value: "00",
            //     // },
            //     // {
            //     //     label: "已处理",
            //     //     value: "01",
            //     // },
            // ],
            statusList1: [
                {
                    label: "待处理",
                    value: "00",
                },
                // {
                //     label: "已处理",
                //     value: "01",
                // },
            ],
            statusList2: [
                // {
                //     label: "待处理",
                //     value: "00",
                // },
                {
                    label: "已处理",
                    value: "01",
                },
            ],
            tableLoading: false, //表格加载状态
            tableData: [], // 表格数据
            pager: {
                //页码信息
                pageSizes: [10, 20, 50],
                turnPageShowNum: 10,
                currentPage: 1,
                total: 0,
            },
            queryParams: {}, // 页面间跳转传参
            applySourceOption: [],
            applySourceObj: {},
        };
    },
    watch: {
        listType: {
            handler(newVal, oldVal) {
                // this.searchForm.status = this.listType == 'waitApprove' ? '00' : '01';
                // this.getTableData();
                this.searchForm = {
                    fieldName: "",
                    fieldSource: "",
                    status: newVal == 'waitApprove' ? '00' : '01',
                };
                this.pager.currentPage = 1;
                this.getTableData();
            },
            immediate: true,
        }
    },
    computed: {
        stateClass() {
            let statusMap = {
                "00": { type: "orange", label: "待处理" },
                "01": { type: "blue", label: "已处理" },
            };
            return (e) => {
                return statusMap[e] || {};
            };
        },
        statusList() {
            if (this.listType == 'waitApprove') {
                return this.statusList1;
            } else if (this.listType == 'approved') {
                return this.statusList2;
            }
        }
    },
    created() {
        this.queryParams = this.$route.query || {};
        this.applySourceOption = applySourceOption;
        this.applySourceObj = arrayToJson(this.applySourceOption);
        this.getTableData();
    },
    methods: {
        // 查看
        handleView(row) {
            this.$refs.viewField.openDrawer({
                ...row,
                viewType: "datadictControl",
            });
        },
        // 点击 审批
        handleReview(row) {
            this.$refs.reviewField.openDrawer({
                ...row,
            });
        },
        // 审批-新增
        handleReviewAdd(row) {
            console.log(row, 'row----')
            this.$refs.handleField.openDrawer({
                ...row,
                fieldName: row.fieldName,
                fieldKeyName: row.rootShortNameCombine,
                fieldFullName: row.rootFullNameCombine,
                drawerTitle: '新增字段',
                action: "reviewField",
            });
        },
        refreshAddFinish() {
            console.log("refreshAddFinish");
            this.$refs.reviewField.handleClose();
        },
        // 点击搜索
        handleSearch() {
            this.pager.currentPage = 1;
            this.getTableData();
        },
        // 点击重置
        handleReset() {
            this.searchForm = {
                fieldName: "",
                fieldSource: "",
                status: this.listType == 'waitApprove' ? '00' : '01',
            };
            this.pager.currentPage = 1;
            this.getTableData();
        },
        // 切换每页条数
        paginationChange(val) {
            this.pager.turnPageShowNum = val;
            this.pager.currentPage = 1;
            this.getTableData();
        },
        // 切换页码
        currentChange(val) {
            this.pager.currentPage = val;
            this.getTableData();
        },
        // 获取列表数据
        getTableData() {
            this.tableLoading = true;
            let queryParams = {
                ...this.searchForm,
                allOrNot: true,
                currentPage: this.pager.currentPage,
                turnPageShowNum: this.pager.turnPageShowNum,
            };
            this.rpc.datadict
                .dataDictionaryFieldApplyQuery(queryParams)
                .then((res) => {
                    this.pager.total = Number(res.turnPageTotalNum || 0);
                    this.tableData = res.dictionaryFiledLists || [];
                    this.tableLoading = false;
                })
                .catch((err) => {
                    this.tableLoading = false;
                });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/common.scss";
@import "../css/page.scss";

// 头部标题条
.page-flex-mode-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;

    .handle-btn {
        padding: 8px 10px;
        line-height: 20px;
        background: #358aff;
        border-radius: 2px;
        min-width: 126px;
        height: 36px;
    }

    .title-text {
        em {
            margin-right: 8px;
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #333333;
            line-height: 24px;
            font-weight: 500;
            font-style: normal;
        }

        span {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #999999;
            letter-spacing: 0;
            line-height: 24px;
            font-weight: 400;
        }
    }
}

// 搜索框行
.top-search-line {
    padding: 12px 24px 4px;
    margin-bottom: 12px;
    border-radius: 4px;
    background-color: #fff;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex: none;

    ::v-deep .el-form-item {
        margin-bottom: 12px;
    }

    .search-side-btns {
        flex: none;
        margin-left: 20px;
        text-align: right;

        .search-side-btn {
            width: 64px;
            height: 32px;
            padding: 0;
        }
    }

    .comp-lib-search-form {
        ::v-deep .el-form-item__label {
            color: rgba(0, 0, 0, 0.85);
        }
    }
}

.state_box {
    display: inline-block;
    height: 24px;
    line-height: 24px;
    padding: 0 6px;
    border-radius: 2px;

    &.orange {
        color: #ff9104;
        background: #fff4e5;
    }

    &.blue {
        background: #ecf5ff;
    }
}

// 列表部分
.list-panel-outer {
    border-radius: 4px;
    padding: 16px 24px 24px;
    background-color: #fff;
}

.flex_wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.panel-container {
    display: flex;
    flex-direction: column;
    padding: 12px;

    .list-panel-outer {
        flex: 1;
    }
}
</style>
