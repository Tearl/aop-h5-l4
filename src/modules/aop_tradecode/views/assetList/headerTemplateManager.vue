<template>
    <div class="aop_endentry_assetList_list_header">
        <el-container>
            <el-header style="height: auto">
                <el-form
                    :inline="true"
                    :model="formSearch"
                    class="demo-form-inline"
                    v-show="showSearchForm"
                >
                    <el-form-item label="模板名称：" size="small">
                        <el-input
                            v-model="formSearch.templateNm"
                            placeholder="请输入"
                            class="input_search_num"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="业务域：" size="small">
                        <el-select
                            v-model="formSearch.bizDomainNo"
                            clearable
                            placeholder="请选择"
                            size="small"
                        >
                            <el-option
                                v-for="(item, index) in [
                                    {
                                        label: '全部',
                                        type: '',
                                    },
                                    ...options,
                                ]"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item size="small" style="float: right">
                        <el-button
                            type="primary"
                            size="small"
                            @click="submitSearch"
                            >查询</el-button
                        >
                        <el-button plain size="small" @click="resetSearch"
                            >重置</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-header>
            <el-main class="preview_main">
                <div class="homeMainHeader">
                    <div>报文模板列表</div>
                    <div class="right_btns">
                        <!-- 进度管理-收集器 -->
                        <el-button
                            type="primary"
                            class="right_btns_item"
                            size="small"
                            icon="el-icon-circle-plus-outline"
                            @click="handleAdd"
                            >新增报文模板</el-button
                        >
                        <common-table-operate
                            @changeComlunTable="changeComlunTable"
                            @btnClick="btnClick"
                            :tableColumnList="tableColumnList"
                            :selectItemKeyList="selectItemKeyList"
                        />
                    </div>
                </div>
                <div class="wrap">
                    <PageTable
                        class="table_style"
                        :table="tables"
                        :data="treeData"
                        :maxTableHeight="maxTableHeight"
                        @operate="operate"
                        key="connectList1"
                        ref="dialogTableRef"
                        rowK="connectList"
                        :show-overflow-tooltip="true"
                    ></PageTable>
                    <el-pagination
                        class="btn_el_pageNation"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        medium
                        background
                        :current-page="formSearch.currentPage"
                        :page-sizes="[10, 20, 30]"
                        :page-size="formSearch.turnPageShowNum"
                        layout="total, prev, pager, next,sizes, jumper"
                        :total="turnPageTotalNum"
                    >
                    </el-pagination>
                </div>
            </el-main>
        </el-container>
        <el-dialog
            title="报文模板"
            :visible.sync="visibleShow"
            width="50%"
            :before-close="handleClose"
        >
            <div>
                <el-form
                    label-width="100px"
                    :model="createForm"
                    :rules="rules"
                    class="demo-form-inline"
                >
                    <!-- srcTemplateId
        templateNm
        templateDesc -->
                    <el-form-item
                        label="业务域："
                        size="small"
                        prop="bizDomainNo"
                    >
                        <el-select
                            v-model="createForm.bizDomainNo"
                            clearable
                            @change="handleChange"
                            placeholder="请选择"
                            size="small"
                        >
                            <el-option
                                v-for="(item, index) in options"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="模板名称："
                        size="small"
                        prop="templateNm"
                    >
                        <!-- getBizAppList -->

                        <el-input
                            v-model="createForm.templateNm"
                            placeholder="请输入"
                            class="input_search_num"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="模板描述：" size="small">
                        <el-input
                            v-model="createForm.templateDesc"
                            type="textarea"
                            placeholder="请输入"
                            class="input_search_num"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div class="dialog-btn-container">
                    <el-button size="small" @click="handleClose"
                        >取消</el-button
                    >
                    <el-button type="primary" size="small" @click="handleCreate"
                        >确定</el-button
                    >
                </div>
            </div>
        </el-dialog>
        <projectList ref="projectList"></projectList>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";
import PageHeader from "@m/core/components/page_header";
import PageTable from "@m/core/components/page_table_workgate";
import commonTableOperate from "./components/CommonTableOperate.vue";
import projectList from "./components/projectList";
// import LabelformInfo from "./components/add_labelForm.vue";
// import LabeldetailInfo from "./components/labelDetails.vue";
// import BlocklistTable from "./components/block_list.vue";
export default {
    mixins: [mixin],
    components: {
        PageHeader,
        PageTable,
        commonTableOperate,
        projectList,
    },
    props: {},
    data() {
        return {
            treeData: [],

            //搜索条件
            formSearch: {
                labelIdNm: "",
                label1LvlClassCd: "",
                label2LvlClassCd: "",
                turnPageShowNum: 10,
                currentPage: 1,
            },
            createForm: {
                srcTemplateId: "",
                templateNm: "",
                templateDesc: "",
                bizDomainNo: "",
            },
            options: [],
            showSearch: true,
            zoomSize: 1,
            // 右侧待选项的数据列表
            selectItemKeyList: [],
            selectedKey: [],
            toggleIndex: 0,
            tableColumnList: [],
            showSearchForm: true,
            tables: [
                {
                    prop: "templateId",
                    label: "模板ID",
                    minWidth: "200",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "templateNm",
                    label: "模板名称",
                    minWidth: "120",
                    type: "textClick",
                    tooltip: true,
                    operate: "templateNm",
                },
                {
                    prop: "templateDesc",
                    label: "模板描述",
                    minWidth: "110",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "bizDomainNm",
                    label: "业务域",
                    minWidth: "110",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "useAppNum",
                    label: "使用工程数",
                    minWidth: "150",
                    type: "textClick",
                    tooltip: true,
                    operate: "useAppNum",
                    filter: (scope) => {
                        return scope.row.useAppNum + "";
                    },
                },
                {
                    prop: "creatrNm",
                    label: "创建人",
                    minWidth: "170",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "crtTm",
                    label: "创建时间",
                    minWidth: "100",
                    cellSelectStyle: "true",
                    type: "text",
                    tooltip: true,
                },
                {
                    label: "操作",
                    type: "button",
                    fixed: "right",
                    width: "150",
                    buttonList: [
                        {
                            desc: "复制",
                            operate: "copy",
                        },
                        {
                            desc: "编辑",
                            operate: "edit",
                        },
                        {
                            desc: "删除",
                            operate: "del",
                        },
                    ],
                },
            ],
            //列表数量
            turnPageTotalNum: 0,
            buttonList: [
                {
                    name: "查看",
                    color: "#358aff",
                    type: "look",
                    isDisabled: false,
                },
                {
                    name: "编辑",
                    color: "#358aff",
                    type: "edit",
                    isDisabled: false,
                },
                {
                    name: "复制",
                    color: "#358aff",
                    type: "copy",
                    isDisabled: false,
                },
                {
                    name: "删除",
                    color: "red",
                    type: "del",
                    isDisabled: false,
                },
            ],

            newlabelShow: false,
            drawerTitle: "新增标签",
            drawShowType: "add",
            topInfo: {},
            looklabelShow: false,

            maxTableHeight: "",
            turnPageTotalNum: 0,
            visibleShow: false,
            rules: {
                bizDomainNo: [
                    {
                        required: true,
                        message: "请选择活动区域",
                        trigger: "change",
                    },
                ],
                templateNm: [
                    {
                        required: true,
                        message: "请输入模板名称",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),
        breadcrumbs() {
            return [
                {
                    label: "标签管理",
                    operate: "list",
                },
                {
                    label: "标签列表",
                },
            ];
        },
    },
    methods: {
        handleChange(data) {
            let name = "";
            for (let i = 0; i < this.options.length; i++) {
                const item = this.options[i];
                console.log(item, data);
                if (item.value === data) {
                    name = item.label;
                }
            }
            console.log(data, "data");
            this.createForm.bizDomainNm = name;
            console.log(this.createForm);
        },
        async getOptions() {
            const res = await this.rpc.assetList.queryBizDomainList();

            this.options = res.businessDomainLists.map((ele) => {
                return {
                    value: ele.bizDomainNo,
                    label: ele.bizDomainName,
                };
            });

            console.log(this.options, "options");
        },
        handleClose() {
            this.visibleShow = false;
            this.createForm = {
                srcTemplateId: "",
                templateNm: "",
                templateDesc: "",
                bizDomainNo: "",
                bizDomainNm: "",
            };
        },
        async handleCreate() {
            // /messageTemplateManageServiceI/addOrCopyMessageTemplate
            console.log(
                this.rpc.assetList,
                "create",
                this.rpc.assetList.addOrCopyMessageTemplate
            );
            const res = await this.rpc.assetList.addOrCopyMessageTemplate({
                ...this.createForm,
            });
            this.$notify({
                title: "成功",
                message: "新增成功",
                duration: 2000,
                type: "success",
            });
            this.visibleShow = false;
            this.createForm = {
                srcTemplateId: "",
                templateNm: "",
                templateDesc: "",
                bizDomainNo: "",
                bizDomainNm: "",
            };
            this.resetSearch();
        },
        handleClose() {
            this.visibleShow = false;
        },
        handleAdd() {
            this.createForm = {
                srcTemplateId: "",
                templateNm: "",
                templateDesc: "",
                bizDomainNo: "",
                bizDomainNm: "",
            };
            this.visibleShow = true;
            this.createForm.bizDomainNo = this.options[0].value;
        },
        btnClick(val, pop) {
            this.visibleShow = false;
            this.assetReback = false;
            switch (val) {
                case 0:
                    this.showSearchForm = !this.showSearchForm;
                    break;
                case 1:
                    this.showBackLine = !this.showBackLine;
                    break;
                case 2:
                    // this.showBackLine = !this.showBackLine;
                    break;
            }
        },
        //commonTableOperate组件函数
        changeComlunTable(val) {
            this.selectedKey = val;
            this.selectItemKeyList = val;
        },
        // 顶部导航栏点击
        labelClick(e) {
            this.$router.push({
                path: "/aop_endentry/assetALLList/list",
            });
        },
        operate(operation, data) {
            // console.log(operation, data);
            // return
            this.handleClick(data, operation);
        },
        handleClick(row, type) {
            this.drawShowType = type;
            if (type === "templateNm") {
                console.log(row);
                this.$router.push({
                    path: "/aop_tradecode/assetALLList/headerTemplateDetail",
                    query: {
                        templateId: row.templateId,
                        bizLineId: row.bizDomainNo,
                        type: "detail",
                    },
                });
            } else if (type === "useAppNum") {
                this.$refs.projectList.showDialog(row.templateId);
                return;
            } else if (type === "edit") {
                this.$router.push({
                    path: "/aop_tradecode/assetALLList/headerTemplateDetail",
                    query: {
                        templateId: row.templateId,
                        bizLineId: row.bizDomainNo,
                        type: "edit",
                    },
                });
            }
            if (type == "copy") {
                this.drawerTitle = "复制标签";
                // this.topInfo = row;
                // this.newlabelShow = true;
                this.visibleShow = true;
                this.createForm = {
                    ...row,
                    srcTemplateId: row.templateId,
                };
                return;
            }
            if (type == "del") {
                if (row.useAppNum) {
                    this.$confirm(
                        "当前报文模板仍有工程使用，不可删除！",
                        "提示",
                        {
                            // confirmButtonText: "确定",
                            showCancelButton: false,
                            type: "warning",
                        }
                    );
                    return;
                }
                this.$confirm("确认删除？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.removeLabel(row);
                    })
                    .catch(() => {});
            }
        },
        closeDrawer() {
            if (this.drawShowType == "look") {
                this.looklabelShow = false;
            } else {
                this.newlabelShow = false;
                setTimeout(() => {
                    this.resetSearch();
                }, 800);
            }
        },
        valueTypeChange(v) {
            // console.log(v,"88888")
            if (v == "01") {
                this.formSearch.label2LvlClassCd = "";
            }
        },

        submitSearch() {
            this.formSearch.turnPageShowNum = 10;
            this.formSearch.currentPage = 1;
            this.queryLabelBaseInfoPageList();
        },
        resetSearch() {
            this.formSearch.templateNm = "";
            this.formSearch.bizDomainNo = "";
            this.formSearch.turnPageShowNum = 10;
            this.formSearch.currentPage = 1;
            this.queryLabelBaseInfoPageList();
        },
        handleSizeChange(newsize) {
            this.formSearch.turnPageShowNum = newsize;
            this.queryLabelBaseInfoPageList();
        },
        handleCurrentChange(newPage) {
            this.formSearch.currentPage = newPage;
            this.queryLabelBaseInfoPageList();
        },
        async removeLabel(row) {
            const params = {
                templateId: row.templateId,
            };
            const res = await this.rpc.assetList.removeMessageTemplate(params);
            this.$message({
                type: "success",
                message: "删除成功!",
            });
            // setTimeout(() => {
            this.resetSearch();
            // }, 800);
        },
        mockData(number) {
            const data = {
                templateId: 123,
                templateNm: "测试",
                templateDesc: "",
                useAppNum: "",
                crtTm: "",
                creatrNo: "",
                creatrNm: "",
                updTm: "",
                updNo: "",
                updNm: "",
            };
            let arr = [];
            for (let i = 0; i < number; i++) {
                // const element = number[i];
                const item = {
                    ...data,
                };
                for (const key in item) {
                    item[key] = parseInt(Math.random() * 100);
                }
                arr.push(item);
            }
            return arr;
        },
        // 所有活动标签列表
        async queryLabelBaseInfoPageList() {
            this.treeData = [];
            const params = {
                bizDomainNo: this.formSearch.bizDomainNo,
                templateNm: this.formSearch.templateNm,
                currentPage: this.formSearch.currentPage,
                turnPageShowNum: this.formSearch.turnPageShowNum,
            };
            const res = await this.rpc.assetList.queryMessageTemplatePageList(
                params
            );
            this.turnPageTotalNum = Number(res.turnPageTotalNum);

            // const arr = this.mockData(12)
            this.treeData = res.messageTemplateList;
            // this.treeData = arr
            //   let arr2 = res.labelBaseInfoList || [];
            // let arr2 = [{}];
            this.$nextTick(() => {});
        },
        filterArray(arr) {
            let newdata = [];
            let stringArr = [];
            for (var i = 0; i <= arr.length; i++) {
                if (
                    arr[i] &&
                    arr[i].value &&
                    !stringArr.includes(JSON.stringify(arr[i]))
                ) {
                    stringArr.push(JSON.stringify(arr[i]));
                    newdata.push(arr[i]);
                }
            }
            return newdata;
        },
        filterString(arr, string) {
            if (string == "") {
                return "";
            }
            let arr2 = arr.find((ele) => ele.value === string);
            return arr2.text;
        },
    },
    created() {},
    mounted() {
        this.getOptions();
        this.queryLabelBaseInfoPageList(); // 查询标签列表
    },
    beforeDestroy() {
        this.treeData = [];
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy();
        next();
    },
    watch: {},
    filters: {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_endentry_assetList_list_header {
    background-color: $base_white;
    width: 100%;
    position: relative;
    .el-container {
        width: 100%;
        height: calc(100vh - 88px);
        overflow: hidden;
        background: #f5f5f5;
        padding: 12px 12px;
    }
    h3 {
        font-size: 16px;
        font-family: PingFangSC-Semibold;
        color: #111111;
        letter-spacing: 0;
        line-height: 24px;
        font-weight: 600;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
    }
    .dialog-btn-container {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
    }
    .el-header {
        background-color: #fff;
        margin-bottom: 10px;
        position: relative;
        .el-form {
            margin-top: 30px;
        }
        .demo-form-inline {
            width: 100%;
            margin: 16px 0px 0 0;
            background: #ffffff;
            .input_search_num {
                max-width: 150px;
                /deep/ .el-input__inner {
                    input {
                        min-width: 120px !important;
                        max-width: 130px !important;
                    }
                }
            }
            .input_search_select1 {
                /deep/ .el-form-item__content {
                    input {
                        min-width: 130px !important;
                        max-width: 150px !important;
                    }
                }
            }
            .input_search_select2 {
                /deep/ .el-form-item__content {
                    input {
                        min-width: 125px !important;
                        max-width: 145px !important;
                    }
                }
            }
            .input_search_name {
                max-width: 90px;
            }
            .input_search_time {
                max-width: 250px;
            }
            /deep/.el-date-editor .el-range-separator {
                min-width: 25px !important;
            }
            ::v-deep .el-button {
                min-width: 64px;
                height: 32px;
                font-size: 14px;
            }
        }
    }
    .preview_main {
        padding: 12px 24px 24px 24px;
        background: #ffffff;
        min-height: calc(100vh - 120px);
        position: relative;
        overflow: hidden;
        .homeMainHeader {
            height: auto;
            background-color: #fff;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 0px;
            justify-content: space-between;
            margin-bottom: 12px;
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #333333;
            letter-spacing: 0;
            margin: 10px 0 21px 0;
            .right_btns {
                display: flex;
                .right_btns_item {
                    margin-right: 10px;
                }
            }
            h3 {
                font-family: PingFangSC-Medium;
                font-size: 16px;
                color: #333333;
                letter-spacing: 0;
                line-height: 24px;
                font-weight: 500;
            }
            /deep/.el-icon-search:before {
                font-size: 16px;
            }
            /deep/.el-icon-zoom-in:before {
                font-size: 16px;
            }
            /deep/.el-icon-zoom-out:before {
                font-size: 16px;
            }
        }
        .tabs_div::-webkit-scrollbar {
            display: none;
        }
        .wrap {
            width: 100%;
            background: #ffffff;
            max-height: calc(100vh - 290px);
            // overflow: scroll;
        }
    }
    ::v-deep .el-drawer__header {
        box-shadow: inset 0 -1px 0 0 #e7e7e7;
        font-family: PingFangSC-Semibold;
        color: #333333;
        letter-spacing: 0;
        font-weight: 600;
        padding: 14px 24px;
        margin-bottom: 0px;
    }
    ::v-deep .el-dialog {
        border-radius: 8px 8px;
    }
    ::v-deep .el-dialog__footer {
        display: flex;
        justify-content: center;
    }
    h3 {
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        line-height: 36px;
    }
    .preview_content_table {
        padding: 16px 16px;
        color: #131313;
        background-color: $base_white;
        h3 {
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            line-height: 36px;
        }
        .orange {
            color: #ff9104;
            background: #fff4e5;
        }
        .green {
            color: #36d542;
            background: #e5ffe7;
        }
        .blue {
            color: #358aff;
            background: #f2f8ff;
        }
        .red {
            color: #fe4758;
            background: #ffeaec;
        }
        .span-tag {
            padding: 0px 8px;
            border-radius: 2px 2px;
            font-size: 14px;
            line-height: 24px;
            height: 24px;
            display: inline-block;
            font-family: PingFangSC-Regular;
        }
        .preview_content_table_flex {
            display: flex;
            width: 100%;
            font-size: 14px;
            p {
                margin-top: 6px;
                color: #999999;
                width: 50%;
                span {
                    color: #333333;
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
        justify-content: flex-end;
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
    .dialog-content-table {
        width: 100%;
        ::v-deep .el-dialog__body {
            padding: 20px 20px 0 20px !important;
            border-top: 1px solid #eee;
        }
        ::v-deep .el-button {
            min-width: 64px;
            height: 32px;
            font-size: 14px;
        }
        .top_title_tips {
            width: 100%;
            display: flex;
            align-items: center;
            background: #fef2dd;
            position: absolute;
            top: 54px;
            left: 0;
            padding: 16px 16px;
            span {
                font-size: 14px;
                color: #f5a623;
                line-height: 1;
                margin-left: 5px;
            }
        }
        h3 {
            color: $pri_ft_color;
            font-weight: 600;
            line-height: 36px;
        }
        ::v-deep .el-pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        p {
            font-size: 14px;
            line-height: 30px;
            color: #ff9104;
        }
        .dialog-footer {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .dialog_table_title_top {
            width: 100%;
            display: flex;
            align-items: center;
            margin: 10px 0px;
        }
        .preview_content_table2 {
            display: flex;
            flex: 1;
            flex-direction: column;
            margin: 10px 0px;
            color: #131313;
            padding-bottom: 5px;
            .preview_content_table_flex {
                display: flex;
                width: 100%;
                text-align: left;
                p {
                    color: #999999;
                    font-size: 14px;
                    width: 50%;
                }
                span {
                    font-size: 14px;
                    color: $pri_ft_color;
                }
            }
        }

        .left_dialog_table_content {
            width: 100%;
            h3 {
                margin-top: 10px;
            }
            .left_dialog_table_flex {
                width: 100%;
                display: flex;
                span {
                    font-size: 14px;
                    color: #999999;
                }
                span:last-child {
                    font-size: 14px;
                    color: #333333;
                }
            }
            .left_dialog_table_flex_end {
                width: 100%;
                margin-top: 14px;
                span {
                    font-size: 14px;
                    color: $pri_ft_color;
                }
                p {
                    font-size: 14px;
                    color: $pri_ft_color;
                    span {
                        font-size: 14px;
                        color: #999999;
                        margin-right: 5px;
                    }
                }
            }
        }
    }
    .bg-red {
        //艳红
        background-color: #e54d42;
        color: #fff;
    }

    .bg-orange {
        //橘黄
        background-color: #f37b1d;
        color: #fff;
    }

    .bg-yellow {
        //亮黄
        background-color: #fbbd08;
        color: #333;
    }

    .bg-olive {
        // 橄榄绿
        background-color: #8dc63f;
        color: #fff;
    }

    .bg-green {
        // 森林绿
        background-color: #39b54a;
        color: #fff;
    }

    .bg-cyan {
        //天青
        background-color: #1cbbb4;
        color: #fff;
    }

    .bg-blue {
        // 海蓝
        background-color: #0081ff;
        color: #fff;
    }

    .bg-purple {
        // 葡萄紫
        background-color: #6739b6;
        color: #fff;
    }

    .bg-mauve {
        // 木槿紫
        background-color: #9c26b0;
        color: #fff;
    }

    .bg-pink {
        // 粉红
        background-color: #e03997;
        color: #fff;
    }

    .bg-brown {
        //土褐色
        background-color: #a5673f;
        color: #fff;
    }

    .bg-grey {
        // 青灰色
        background-color: #8799a3;
        color: #fff;
    }

    .bg-gray {
        // 浅灰色
        background-color: #f0f0f0;
        color: #666;
    }

    .bg-black {
        // 深黑
        background-color: #333;
        color: #fff;
    }

    .bg-white {
        // 雅白
        background-color: #fff;
        color: #666;
    }
}
</style>
