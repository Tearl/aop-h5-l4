<template>
    <div class="aop_developer_comps_page_tabs">
        <div v-if="tabType == 'D'">
            <el-form
                :inline="true"
                :model="formSearch4"
                class="demo-form-inline"
            >
                <div>
                    <el-form-item label="工程应用：" size="mini">
                        <el-select
                            v-model="formSearch4.appNm"
                            style="width: 140px;"
                            placeholder="请选择"
                            @change="formSearchCCc"
                        >
                            <el-option
                                v-for="item in options4"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部署申请时间：" size="mini">
                        <el-date-picker
                            v-model="formSearch4.deployDateStart"
                            type="date"
                            size="small"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width: 140px;"
                            placeholder="申请开始日期"
                        >
                        </el-date-picker>
                        至
                        <el-date-picker
                            v-model="formSearch4.deployDateEnd"
                            type="date"
                            size="small"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width: 140px;"
                            placeholder="申请结束日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="部署申请时间窗口：" size="mini">
                        <el-select
                            size="small"
                            style="margin-right: 10px; width: 140px"
                            v-model="formSearch4.planDeployTimeCd"
                            placeholder="请选择时间窗口"
                        >
                            <el-option
                                v-for="item in timeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="部署环境：" size="mini">
                        <el-radio-group
                            v-model="formSearch4.envTypeCode"
                            @change="radioChange()"
                        >
                            <el-radio :label="1">开发环境</el-radio>
                            <el-radio :label="2">SIT环境</el-radio>
                            <el-radio :label="3">UAT环境</el-radio>
                            <el-radio :label="4">投产演练环境</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>

                <el-form-item size="small" style="float: right;margin-top:-92px;">
                    <el-button size="small" type="primary" @click="searchSubmit3('A')"
                        >搜索</el-button
                    >
                    <el-button size="small" plain @click="resetSearch3">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="preview_content_table">
                <h3>部署历史</h3>
                <el-table
                    :data="tableD"
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
                        min-width="150"
                    >
                    </el-table-column>
                    <el-table-column
                        property="planDeployDate2"
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
                        property="deployTm"
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
                        min-width="100"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.deploySts == '03'" class="orange"
                                >失败</span
                            >
                            <span v-if="scope.row.deploySts == '02'" class="green"
                                >成功</span
                            >
                            <span v-if="scope.row.deploySts == '01'" class="orange"
                                >部署中</span
                            >
                            <span v-if="scope.row.deploySts == '00'" class="orange"
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
                        label="操作"
                        min-width="100"
                    >
                        <template slot-scope="scope">
                            <el-button
                                @click.native.prevent="
                                    downloadText(
                                        '下载',
                                        scope.row.deployAtchUrl
                                    )
                                "
                                type="text"
                                :disabled="scope.row.deploySts == 0"
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
                    :current-page="currentPage3"
                    :page-sizes="[10, 20, 30]"
                    :page-size="pageSize3"
                    layout="total, prev, pager, next,sizes, jumper"
                    :total="total3"
                >
                </el-pagination>
            </div>
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
        tableD: {
            type: Array,
            default: () => [],
        },
        tabType: {
            type: String,
            default: () => "",
        },
        formSearch4: {
            type: Object,
            default: () => {},
        },
        options4: {
            type: Array,
            default: () => [],
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
        tableListB: {
            type: Array,
            default: () => [],
        },
        formA: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            formSearch: {
                inputValue: "",
            },
            // 列表数据
            showCodeDialog: false,
            timeOptions: [
                {
                    value: "A",
                    label: "9:00-10:00",
                },
                {
                    value: "B",
                    label: "11:00-12:00",
                },
                {
                    value: "C",
                    label: "17:00-18:00",
                },
            ],
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
        formSearchCCc(e){
            console.log(e)
            this.formSearch4.appNm = e
        },
        // 部署申请号弹窗
        clickshowDialog(type, row) {
            this.formA = row;
            this.showCodeDialog = true;
        },
        // 部署附件下载
        downloadText(type, row) {
            let saveLink = document.createElement("a");
            saveLink.download = "h5-pc-component-template.zip";
            // saveLink.href = `${PUBLIC_PATH}static/h5-pc-component-template.zip`;
            saveLink.href = row;
            saveLink.click();
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
        searchSubmit3(type) {
            this.$emit("searchSubmit3", type);
        },
        // 重置搜
        resetSearch3(type) {
            this.$emit("resetSearch3", type);
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
    width: 100%;
    h3 {
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        line-height: 36px;
    }
    ::v-deep .el-tabs__nav-wrap::after {
        background-color: $base_white;
    }
    .preview_content_table::-webkit-scrollbar {
        display: none;
    }
    .preview_content_table {
        padding: 16px 16px;
        background: #ffffff;
        color: #131313;
        max-height: calc(100vh - 278px);
        min-height: calc(100vh - 278px);
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
