<template>
    <div class="aop_developer_comps_page_tabs">
        <div v-if="tabType == 'A'">
            <!--  -->
            <el-form
                :inline="true"
                :model="formSearch"
                class="demo-form-inline"
            >
                <el-form-item v-for="item in searchForm" :key="item.value" :label="item.labelText" size="small">
                    <el-input
                        v-model="formSearch[item.model]"
                        :placeholder="item.placeholder"
                        class="list-input_search"
                    ></el-input>
                </el-form-item>
                <el-form-item size="small" style="float: right">
                    <el-button
                        type="primary"
                        size="small"
                        @click="searchSubmit('A')"
                        >搜索</el-button
                    >
                    <el-button size="small" plain @click="resetSearch"
                        >重置</el-button
                    >
                </el-form-item>
            </el-form>
            <div class="preview_content_table">
                <span @click="showAddService">添加接口</span>
                <!-- 接口列表 -->
                <PageTable
                    class="table_style"
                    :table="tables"
                    :data="tableA"
                    key="connectList1"
                    ref="tableRef1"
                    rowK="tableA"
                    @operate="operate"
                    :show-overflow-tooltip="true"
                ></PageTable>
                <el-pagination
                    class="btn_el_pageNation"
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    medium
                    background
                    :current-page="currentPage1"
                    :page-sizes="[10, 20, 30]"
                    :page-size="pageSize1"
                    layout="total, prev, pager, next,sizes, jumper"
                    :total="total1"
                >
                </el-pagination>
            </div>
            <!-- 添加接口 -->
            <Service4BDialog
                :visibleShow="visibleShowAdd"
                :dialogTitle="dialogTitle"
                :tableData="service4BList"
                :formB="formA"
                :key="'1'"
                @closeDialog="closeDialog"
                name="service4BDialog"
            ></Service4BDialog>
            <!-- 查看交互 -->
            <EachOtherDialog
                :visibleShow="visibleShow"
                :dialogTitle="dialogTitle"
                :tableData="eachOtherList"
                :formB="rowDetail"
                :key="'2'"
                @closeDialog="closeDialog"
                name="eachOtherDialog"
            ></EachOtherDialog>
            <!-- 绑定交互 -->
            <EditeachOtherDialog
                :visibleShow="visibleShowEdit"
                :dialogTitle="dialogTitle"
                :tableData="service4BList"
                :formC="rowDetail"
                :formB="formA"
                :key="'3'"
                @closeDialog="closeDialog"
                name="EditeachOtherDialog"
            ></EditeachOtherDialog>
        </div>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";
import { setSessionStorage } from "@m/utils/localStorage.js";
import SearchTop from "@m/core/components/page_search_top";
import PageTable from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import EachOtherDialog from "./components/dialog_eachOther.vue";
import Service4BDialog from "./components/add_service.vue";
import EditeachOtherDialog from "./components/edit_eachOther.vue";
export default {
    components: {
        EachOtherDialog,
        SearchTop,
        PageTable,
        PagePagination,
        Service4BDialog,
        EditeachOtherDialog
    },
    props: {
        tableA: {
            type: Array,
            default: () => [],
        },
        tabType: {
            type: String,
            default: () => "",
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
        formA: {
            type: Object,
            default: () => {},
        },
        detailObj: {
            type: Object,
            default: () => {},
        }
    },
    data() {
        return {
            showCodeDialog: false,
            changeStatus: 1, // 设计按钮状态
            bizAppId: "",
            // 公共搜索
            searchForm: [
                {
                    type: "inputIcon",
                    model: "txId",
                    placeholder: "请输入",
                    labelText:"接口编号:",
                    style: {
                        width: "160px",
                    },
                },
                {
                    type: "inputIcon",
                    model: "txCd",
                    placeholder: "请输入",
                    labelText:"接口编码:",
                    style: {
                        width: "160px",
                    },
                },
                {
                    type: "inputIcon",
                    model: "txNm",
                    placeholder: "请输入",
                    labelText:"接口名称:",
                    style: {
                        width: "160px",
                    },
                },
            ],
            tables: [
                {
                    prop: "svcSeq",
                    label: "接口编号",
                    minWidth: "200",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "svcCd",
                    label: "接口编码",
                    minWidth: "150",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "svcNm",
                    label: "接口名称",
                    minWidth: "150",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "projectName",
                    label: "工程应用",
                    minWidth: "150",
                    type: "text",
                    tooltip: true,
                },
                // {
                //     prop: "lookBtn",
                //     label: "交互事件",
                //     minWidth: "150",
                //     type: "textClick",
                //     tooltip: true,
                //     operate:"lookDetail"
                // },
                {
                    prop: "svcSts",
                    label: "状态",
                    minWidth: "100",
                    type: "textClassList",
                    tooltip: true,
                    filter:"business4BSt",
                    textClassList: [
                        { class: "red status", val: "-1" },
                        { class: "orange status", val: "0" },
                        { class: "green status", val: "1" },
                        { class: "green status", val: "2" },
                    ],
                },
                {
                    prop: "aiModifyUserNm",
                    label: "更新人",
                    minWidth: "150",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "aiModifyTime",
                    label: "更新时间",
                    minWidth: "150",
                    type: "text",
                    tooltip: true,
                    filter:"crtTm_yyyyMMddhhmmss"
                },
                {
                    label: "操作",
                    type: "button",
                    fixed: 'right',
                    width: "150",
                    buttonList: [
                        {
                            desc: "设计",
                            operate: "intoApply",
                        },
                        // {
                        //     desc: "绑定交互",
                        //     operate: "connectApply",
                        // },
                        {
                            desc: "完成",
                            operate: "complete",
                            relation: function (scope){
                                return scope.row.svcSts == "0" && scope.row.srcFnctFlg == "1"
                            }
                        },
                        {
                            desc: "删除",
                            operate: "del",
                        },
                    ],
                },
            ],
            // 添加接口
            visibleShowAdd: false,
            service4BList:[],
            // 查看交互
            visibleShow: false,
            dialogTitle: "",
            eachOtherList:[],
            rowDetail:{},
            // 绑定交互
            visibleShowEdit: false,
        };
    },
    methods: {
        operate(operation, data) {
            if(operation=='intoApply'){
                this.goDesign(operation, data)
            }
            if(operation=='connectApply'){// 绑定交互
                console.log(this.formA,'进行绑定交互事件')
                this.rowDetail = data;
                this.service4BList= [];
                this.visibleShowEdit = true;
                this.dialogTitle = "";
            }
            if(operation=='del'){
                //删除此条交易
                this.rowDetail = data;
                console.log(data,"删除")
                this.$emit("removeList", data);
            }
            if(operation=='lookDetail'){// 查看交互
                this.dialogTitle = "绑定交互事件列表";
                this.rowDetail = data;
                this.getEachList(data)
            }
            if(operation == "complete"){
                this.$emit("apiStateChange", data);
            }
        },
        // 添加接口
        showAddService(row){
            console.log(this.formA,'功能活动信息')
            this.getService4BList()
        },
        // 多个弹窗关闭交互
        closeDialog(type,val){
            if(type=='eachClose'){
                this.visibleShow = false;
            }else if(type=='serviceClose'){
                this.visibleShowAdd = false;
            } else if(type=='editServiceClose'){
                this.visibleShowEdit = false;
            }
            if(val && val=='02'){
                // 保存新建成功去刷新列表
                this.resetSearch(val)
            }
        },
        listnameDetail(type, value) {
            // 传参：apiId(服务id)
            window.open(
                `/aop-h5-sub/#/aop_tradedesign/d4workbench/transDetail?apiId=${value.txId}`,
                '_blank'
            );
        },
        // 进入设计--可视化开发预览
        goDesign(type, row) {
            // setSessionStorage("designCodeRouter",this.$route.fullPath)
            // console.log("row",row)
            // this.$router.push({
            //     path: "/aop_tradecode/editorDesign/downloadDesign",
            //     query: {
            //         viewType: 'func',
            //         isolateWorkspace: this.systemId == 1 ? "T2" : "T1",
            //         admiId: row.fnctNo || "FM-ZC-2023-008773",
            //         modelVersion: row.modelVersion || "000001",
            //         modelName:row.fnctNm || "",
            //         competitorId: row.cstNo || "FM-KHJG-000066",
            //         jobId:row.jobId || "000001",
            //         serviceStatus:row?.serviceStatus || "",
            //         bizLineId: row.bizDomainNo || "FM-YWY-2022-000001",
            //         appId: this.bizAppId || "FM-YWYY-2022-000001"
            //     }
            // })
            setSessionStorage("interfaceRouter",this.$route.fullPath)
            this.$router.push({
                path:"/aop_tradecode/editorDesign/design",
                query:{
                    viewType: 'func',
                    isolateWorkspace: this.systemId == 1 ? "T2" : "T1",
                    admiId:this.formA.fnctCd,
                    modelVersion:this.formA?.modelVersion,
                    modelName:this.formA.assetFnctNm,
                    competitorId:this.formA.cstNo,
                    jobId:this.formA?.jobId,
                    bizLineId:this.formA?.bizDomainNo,
                    appId:this.formA?.bizAppId,
                    authId:this.formA.authFnctJobInfoId,     //授权编号
                    asgntNo:this.formA.asgntNo,
                    assetFnctNo: this.formA.assetFnctNo,
                    authAstFnctInfoId: this.formA.authAstFnctInfoId,
                    fnctNo: this.formA.fnctNo,
                    projectId: this.detailObj.appId,
                    // 从接口进入 追加接口标识和接口编号
                    typeOf4b: '1',
                    serviceSeq: row.svcSeq,
                }
               })
        },
        // 查看已添加接口服务
        async getService4BList(row){
            // 重置页签
            this.service4BList= [];
            this.visibleShowAdd = true;
            this.dialogTitle = "";
        },
        // 获取交互查看列表
        async getEachList(row){
            this.eachOtherList= [];
            this.visibleShow= true;
            const params = {
                d4iType: '02', // 要素00 页面01
                interfaceId: row.svcId, //交易接口ID
                name: "",// 接口名称
            }
            this.rpc.assetList.queryConnect4BtList(params).then((res)=>{
                console.log("查询返回关联的交互列表",res)
                this.eachOtherList = res.list;
            }).catch((err)=>{
                console.log(err)
            })

        },
        // 重新设计
        async rebackDesign(type, row) {
            const params = {
                tranId: row.txId || "", // 交易ID
            };
            const res = await this.rpc.assetList.queryBackUpTran(params);
            console.log(res, "点重新设计");
            this.changeStatus = 2;
        },
        // 设计完成
        async overDesign(type, row) {
            const params = {
                tranId: row.txId || "", // 交易ID
            };
            const res = await this.rpc.assetList.queryRegisterTran(params);
            console.log(res, "点设计完成");
            this.changeStatus = 1;
        },
        // 弹窗搜索
        searchSubmit(type) {
            this.$emit("searchSubmit", type);
        },
        // 重置搜
        resetSearch(type) {
            this.$emit("resetSearch", type);
        },
        handleSizeChange1(val) {
            this.$emit("handleSizeChange1", val);
        },
        handleCurrentChange1(val) {
            this.$emit("handleCurrentChange1", val);
        },
    },
    created() {
        // this.getInfo(); // 查询基本详情
        // setSessionStorage("designCodeRouter", "");
        this.bizAppId = this.$route.query.bizAppId
    },
    watch: {
        "tableA": {
            handler(newVal, oldVal) {
                newVal.forEach((item)=>{
                    item.lookBtn = "查看";
                })
                this.tableA = newVal || []
            },
            deep: true,
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_developer_comps_page_tabs {
    width: 100%;
    ::v-deep .el-dialog {
        border-radius: 8px 8px;
    }
    .preview_content_table::-webkit-scrollbar {
        display: none;
    }
    .preview_content_table {
        padding: 16px 16px;
        width: 100%;
        background: #ffffff;
        color: #131313;
        min-height: calc(100vh - 234px);
        max-height: calc(100vh - 234px);
        overflow-y: auto;
        position: relative;
        span {
            font-size: 16px;
            font-weight: 500;
            color: #358aff;
            line-height: 24px;
            margin-bottom: 16px;
            cursor: pointer;
            text-align: center;
            float: right;
        }
    }
    .searchTop_form{
        width: 100%;
        margin: 12px 0px;
        padding: 16px 0 0 16px;
        background: #ffffff;
    }
    .demo-form-inline {
        width: 100%;
        margin: 12px 0px;
        padding: 16px 0 0 16px;
        background: #ffffff;
        display: inline-block;
        ::v-deep .el-form-item__content {
            input {
                width: 150px;
            }
            .el-date-editor.el-input,
            .el-date-editor.el-input__inner {
                width: 150px;
            }
        }
        ::v-deep .el-button{
            min-width:64px;
            height:32px;
            font-size:14px;
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
