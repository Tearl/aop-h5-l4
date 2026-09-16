<template>
    <el-dialog
        :title="dialogTitle"
        width="80%"
        append-to-body="true"
        :visible.sync="visibleShow"
        :before-close="handleClose"
        class="aop_techdesign_techdetail_dialog"
    >
        <div class="top_btn_flex">
            <el-radio-group v-model="changeTabs" size="medium" @change="changeTypeBtn">
                <el-radio-button v-for="item in labelTbs" :key="item.value" :label="item.value" >{{item.label}}</el-radio-button>
            </el-radio-group>
        </div>
        <div class="preview_dialog_table_list" v-if="changeTabs=='A' || changeTabs === 'C'">
            <el-form
                :inline="true"
                :model="formSearchNew"
                class="demo-form-inline"
            >
                <el-form-item label="接口编号名称编码" size="small">
                    <el-input
                        v-model="formSearchNew.ifNoNmCd"
                        :placeholder="'请输入'"
                        class="list-input_search"
                    ></el-input>
                </el-form-item>
                <el-form-item label="接口类型名称" size="small">
                    <el-select
                        clearable
                        v-model="formSearchNew.ifTpNm"
                        :placeholder="'请输入'"
                        class="list-input_search"
                    >
                        <el-option
                        v-for="(nItem, nI) in options"
                        :value="nItem.value"
                        :key="nI"
                        :label="nItem.label"
                        >{{ nItem.label }}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="接口标签名称" size="small">
                    <el-select
                        clearable
                        v-model="formSearchNew.ifLabelNm"
                        :placeholder="'请输入'"
                        class="list-input_search"
                    >
                        <el-option
                        v-for="(nItem, nI) in aiLabelOptions"
                        :value="nItem.value"
                        :key="nI"
                        :label="nItem.label"
                        >{{ nItem.label }}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item size="small" style="float: right">
                    <el-button
                        type="primary"
                        size="small"
                        @click="search()"
                        >搜索</el-button
                    >
                    <el-button size="small" plain @click="resetSearch"
                        >重置</el-button
                    >
                </el-form-item>
            </el-form>
            <!-- <el-form
                :inline="true"
                :model="formSearch"
                class="demo-form-inline"
                v-if="changeTabs === 'A'"
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
            </el-form> -->
            <div style="background:#f5f5f5;width:100%;height:1px;margin-bottom:16px;"></div>
            <PageTable
                class="table_style"
                :table="tables"
                :data="tableData"
                :tableType="'selection'"
                key="connectList1"
                ref="tableRef1"
                rowK="tableData"
                @operate="operate"
                @selectionChange="checkList"
                :show-overflow-tooltip="true"
            ></PageTable>
            <!-- 分页 -->
            <el-pagination
                class="btn_el_pageNation"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                medium
                background
                :current-page="formSearch.currentPage"
                :page-sizes="[10, 20, 30]"
                :page-size="formSearch.pageSize"
                layout="total, prev, pager, next,sizes, jumper"
                :total="formSearch.totalSize"
            >
            </el-pagination>
            <!-- 已选回显 -->
            <div class="btn_tips_flex" v-if="isCheckList.length>0">
                <span>已选接口<a>{{isCheckList.length}}</a>个:</span>
                <el-tag
                    v-for="item in isCheckList"
                    :key="item.svcId"
                    closable
                    @close="removeList(item)"
                    :type="'info'">
                    {{item.svcNm}}
                </el-tag>
            </div>
            <div style="background:#f5f5f5;width:100%;height:1px;margin-bottom:16px;"></div>
            <div class="dialog_btn">
                <el-button @click="handleClose"
                    >取消</el-button
                >
                <el-button type="primary" :disabled="isCheckList.length==0" v-if="dialogType=='s4addInterface'" @click="chooseD4ApiInfoCommit"
                    >确认</el-button
                >
                <el-button type="primary" :disabled="isCheckList.length==0" v-else @click="changeServiceList"
                    >确认</el-button
                >
            </div>
        </div>
        <div class="preview_dialog_table_list" v-if="changeTabs=='B'">
            <NewService4B
                :tabType="changeTabs"
                :topInfo="formB"
                :applicationList="applicationList"
                @handleClose="handleClose"
                @submitEnd="submit"
                :addForm="addForm"
            ></NewService4B>
        </div>
        <!-- 17:04"pageId":"FM-GN-2022-0001",
        "elmId":"FM-YM-2024-000592",
        "interactiveId":"flow_3lv0m3kc3",
        "interactiveNm":"交易规则",
        "stepId":"step_6",
        "ruleId":"A2-YWGZ-20240411-00156506", -->
    </el-dialog>
</template>
<script>
import PageTable from "@m/core/components/page_table";
import NewService4B from "./new_service4B.vue";
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";
import { unduplicated } from "@m/utils/array";
export default {
    mixins: [mixin],
    components: {
        PageTable,
        NewService4B,
    },
    computed: {
        ...mapGetters(["userInfo"]),
        ...mapGetters(["systemId"]),
    },
    props: {
        visibleShow: {
            type: Boolean,
            default: false,
        },
        dialogTitle: {
            type: String,
            default: "",
        },
        formB: {
            type: Object,
            default: () => ({}),
        },
        tableData: {
            type: Array,
            default: () => [],
        },
        addDataForm: {
            type: Object,
            default: () => ({}),
        },
        onlySelect: {
            type: Boolean,
            default: false,
        },
        dialogType:{
            type: String,
            default: "",
        },
    },
    data() {
        return {
            changeTabs: "C",
            // 工程应用名称组合
            applicationList:[],
            labelTbs:[
                {
                    value:'C',
                    label:"功能下接口",
                },
                {
                    value:'A',
                    label:"产品下接口",
                },
                {
                    value:'B',
                    label:"新建接口",
                },
            ],
            searchForm: [
                {
                    type: "inputIcon",
                    model: "txId",
                    placeholder: "请输入",
                    labelText:"接口编号:",
                },
                {
                    type: "inputIcon",
                    model: "txCd",
                    placeholder: "请输入",
                    labelText:"接口编码:",
                },
                {
                    type: "inputIcon",
                    model: "txNm",
                    placeholder: "请输入",
                    labelText:"接口名称:",
                },
            ],
            tables: [
                {
                    prop: "svcSeq",
                    label: "接口编号",
                    minWidth: "150",
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
                // {
                //     prop: "projectName",
                //     label: "工程应用",
                //     minWidth: "180",
                //     type: "text",
                //     tooltip: true,
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
                    width: "100",
                    buttonList: [
                        {
                            desc: "查看",
                            operate: "look",
                        },
                    ],
                },
            ],
            formSearch: {
                txNm: "",
                txCd: "",
                txId:"",
                transId:"",
                transNm:"",
                currentPage:1,
                pageSize: 10,
                totalSize: 0,
            },
            multipleSelection:[],
            isCheckList:[], // 已选列表返显
            isRecord: false,
            addForm: {},
            aiLabelOptions: [],
            options: [],
            formSearchNew: {
                ifNoNmCd: '',
                ifTpNm: '',
                ifLabelNm: '',
            }
        };
    },
    watch: {
        addDataForm() {
            this.addForm = this.addDataForm
        }
    },
    mounted() {
        this.addForm = this.addDataForm
        this.serachLabelOptions('01')
        this.serachLabelOptions('02')
    },
    methods: {
        async serachLabelOptions(type) {
            const res = await this.rpc.newEditor.queryInterfaceAttributeList({
                atrTpCd: type,
            })
            const intefaceAttributeInfoList = res.intefaceAttributeInfoList
            if (type == '01') {
                this.options = intefaceAttributeInfoList.map((item) => {
                    return {
                        label: item.atrNm,
                        value: item.atrNm,
                    }
                })
            } else {
                this.aiLabelOptions = intefaceAttributeInfoList.map((item) => {
                    return {
                        label: item.atrNm,
                        value: item.atrNm,
                    }
                })
            }
        },
        handleClose(type,val) {
            this.$emit("closeDialog",'serviceClose',val);
        },
        operate(operation, data) {
            if(operation=='look'){//查看此条交易
                // console.log('信息',data)
                window.open(
                    `/aop-h5-sub/#/aop_tradecode/editorDesign/interfaceDetail?apiId=${data.svcId}&fnctId=${this.$route.query.fnctId}`,
                    "_blank"
                );
            }
        },
        changeTypeBtn(v, b) {
            if(v=='A'){
                this.getServiceList()
            } else if(v=='B'){
                this.getApplication()
            } else if (v === 'C') {
                this.getServiceNewList()
            }
        },
        search() {
            this.formSearch= {
                txNm: "",
                txCd: "",
                txId:"",
                transId:"",
                transNm:"",
                currentPage:1,
                pageSize: 10,
                totalSize: 0,
            }
            if (this.changeTabs === 'A') {
                this.getServiceList()
            } else {
                this.getServiceNewList()
            }
        },
        getServiceNewList() {
            // fnctId
            // pageId
            // elmId
            // interactiveId
            // stepId
            // ruleId
            // ifNoNmCd
            // ifTpNm
            // ifLabelNm
            // isPageFlg
            // ruleRelIds
            // currentPage
            // turnPageShowNum
            const params = {
                ifNoNmCd: this.formSearchNew.ifNoNmCd,
                ifLabelNm: this.formSearchNew.ifLabelNm,
                ifTpNm: this.formSearchNew.ifTpNm,
                fnctId: this.$route.query.fnctId,
                currentPage: this.formSearch.currentPage,
                turnPageShowNum: this.formSearch.pageSize,
                examId: this.$route.query.examId,
                fnctId: this.$route.query.fnctId,
                isPageFlg: 1,
                ruleRelIds: [],
            }
            this.rpc.assetList.queryFunctionDemandAchieveInterfaceInfoList(params).then((res)=>{
                // console.log("查询下装接口列表22222",res)
                this.tableData = res.interfaceInfoList || []
                this.tableData.forEach((item) => {
                    // 关系ID	relId
                    // 规则关系ID	ruleRelId
                    // 接口ID	ifId
                    // 接口编号	ifNo
                    // 接口编码	ifCd
                    // 接口名称	ifNm
                    // 接口版本号	ifVerNo
                    // 接口描述	ifDesc
                    // 接口类型名称	ifTpNm
                    // 接口标签名称	ifLabelNm
                    // 接口状态代码	ifStsCd
                    // 更新人编号	updNo
                    // 更新人名称	updNm
                    // 更新时间	updTm
                    item.svcSeq = item.ifNo
                    item.svcCd = item.ifCd
                    item.svcNm = item.ifNm
                    item.svcSts = item.ifStsCd
                    item.aiModifyUserNm = item.updNm
                    item.aiModifyTime = item.updTm
                    item.svcId = item.ifId

                })
                this.formSearch.totalSize  = Number(res.turnPageTotalNum);
                this.$nextTick(() => {
                    this.isTableData()
                })
            })
        },
        // 列表多选
        checkList(e) {
            if(!this.isRecord && this.multipleSelection.length > e.length){
                this.multipleSelection.forEach((item) =>{
                    if(e.indexOf(item) == -1){
                        this.isCheckList = this.isCheckList.filter(data => data.svcId != item.svcId)
                    }
                })
            } else {
                this.isCheckList.push(...e)
                this.isCheckList = unduplicated(this.isCheckList, "svcId");
            }
            this.multipleSelection = e;
            this.isRecord = false;
            // this.isCheckList = this.multipleSelection
        },
        // 删除单条
        async removeList(op){
            // this.isCheckList.splice(this.isCheckList.indexOf(op), 1);
            // this.$refs.tableRef1.toggleRowSelection(op);
            // 走接口删除--
            // const params = {
            //     fnctCd: this.formB.fnctNo, //功能编号
            //     jobNo: this.formB.asgntNo, //作业号
            //     apiId: op.svcId, // 接口Id
            //     svcSeq: op.svcNm, // 接口编号
            //     isolateWorkspace: '', //工作台隔离标识
            // }
            // this.rpc.assetList.deleteFnctD4ApiInfo(params).then((res)=>{
            //     // console.log("删除结果",res)
            //     this.getServiceList()
            // })
            const index = this.tableData.findIndex(item => item.svcId == op.svcId);
            if(index == -1) {
                this.isCheckList = this.isCheckList.filter(data => data.svcId != op.svcId)
            }else {
                this.$refs.tableRef1.$refs.tableRef.toggleRowSelection(this.tableData[index],false)
            }
        },
        searchSubmit(){
            this.isRecord = true;
            this.getServiceList()
        },
        handleReset() {
            this.isRecord = true;
            this.formSearch= {
                txNm: "",
                txCd: "",
                txId:"",
                transId:"",
                transNm:"",
                currentPage:1,
                pageSize: 10,
                totalSize: 0,
            }
            this.formSearchNew = {
                ifNoNmCd: '',
                ifTpNm: '',
                ifLabelNm: '',
            }
            this.getServiceNewList()
        },
        resetSearch(){
            this.isRecord = true;
            this.formSearch= {
                txNm: "",
                txCd: "",
                txId:"",
                transId:"",
                transNm:"",
                currentPage:1,
                pageSize: 10,
                totalSize: 0,
            }
            this.formSearchNew = {
                ifNoNmCd: '',
                ifTpNm: '',
                ifLabelNm: '',
            }
            if (this.changeTabs === 'A') {
                this.getServiceList()
            } else {
                this.getServiceNewList()
            }
        },
        // 列表分页
        handleSizeChange(val) {
            this.isRecord = true;
            this.formSearch.currentPage = "1";
            this.formSearch.pageSize = val;
            if (this.changeTabs === 'A') {
                this.getServiceList()
            } else {
                this.getServiceNewList()
            }
        },
        handleCurrentChange(val) {
            this.isRecord = true;
            this.formSearch.currentPage = val;
            if (this.changeTabs === 'A') {
                this.getServiceList()
            } else {
                this.getServiceNewList()
            }
        },
        // 新建接口选择列表保存
        async changeServiceList(row){
            let list = this.isCheckList.map((item)=>{
                return {
                    fnctId: this.$route.query.fnctId,
                    ifId: item.svcId,
                    // "pageId":"FM-GN-2022-0001",
                    // "elmId":"FM-YM-2024-000592",
                    // "interactiveId":"flow_3lv0m3kc3",
                    // "interactiveNm":"交易规则",
                    // "stepId":"step_6",
                    // "ruleId":"A2-YWGZ-20240411-00156506",
                    ...this.addForm

                }
            })
            if (this.onlySelect) {
                this.$emit("selectList", list);
                this.$emit("closeDialog",'serviceClose','02');
                return;
            }
            // console.log("2222222222",list)
            const params = {
                functionDemandAchieveRelList: list || [],
            }
            this.rpc.assetList.addFunctionDemandAchieveRel(params).then((res)=>{
                // console.log("选择下装接口列表保存提交",res)
                // this.handleClose()
                this.rpc.s4design.addFuntionJobCommitFlow({
                    fnctId: this.$route.query.fnctId,
                    jobTpCd: 'C4',
                })
                this.$emit("closeDialog",'serviceClose','02');
            })
        },
        chooseD4ApiInfoCommit(){
            let list = this.isCheckList.map((item)=>{
                return {
                    fnctId: this.$route.query.fnctId,
                    svcId: item.svcId,
                    svcNm: item.svcNm,
                    svcCd: item.svcCd,
                    svcSeq: item.svcSeq,
                    svcVer: item.svcVer,
                    svcDesc: item.svcDesc,
                }
            })
            // console.log("2222222222",list)
            const params = {
                apiInfoList: list || [],
                fnctId: this.$route.query.fnctId,
            }
            this.rpc.assetList.chooseD4ApiInfoCommit(params).then((res)=>{
                // console.log("选择下装接口列表保存提交",res)
                this.rpc.s4design.addFuntionJobCommitFlow({
                    fnctId: this.$route.query.fnctId,
                    jobTpCd: 'C4',
                })
                this.$emit("closeDialog",'serviceClose','02');
            })
        },
        // 新增接口先查询后端关联接口列表
        async getServiceList(row){
            const params = {
                svcNm: this.formSearchNew.ifNoNmCd,
                ifTpNm: this.formSearchNew.ifTpNm,
                ifLabelNm: this.formSearchNew.ifLabelNm,
                // svcId: '', //id
                // svcCd: this.formSearch.txCd, //接口编码
                // svcSeq: this.formSearch.txId, //编号
                svcId: '', //id
                authId: this.formB.authFnctJobInfoId,
                jobNo: this.formB.asgntNo, // 工程编号编码名称
                pageFlg:'1', //0否1是
                fnctId: this.$route.query.fnctId,
                currentPage: this.formSearch.currentPage,
                turnPageShowNum: this.formSearch.pageSize,
                examId: this.$route.query.examId,

            }
            this.rpc.assetList.intQueryBeltLineApiInfoListByPage(params).then((res)=>{
                // console.log("查询后端接口列表22222",res)
                this.tableData = res.apiInfoList || []
                this.formSearch.totalSize  = Number(res.turnPageTotalPage);
                this.$nextTick(() => {
                    this.isTableData()
                })
            })
        },
        // 新增接口先查询工程应用信息
        async getApplication(row){
            const params = {
                fnctId: this.$route.query.fnctId,
                examId: this.$route.query.examId,
            }
            console.log(2222222,33333)
            this.rpc.newEditor.queryFunctionRelInfo(params).then((res)=>{
                // console.log("查询工程应用名称",res)
                let item = {
                    authFnctJobInfoId: res.authFnctJobInfoId,
                    blgPojAppId: res.transAppId,
                    blgPojAppNm: res.transAppNm,
                }
                this.applicationList.push(item);
            })
        },
        isTableData() {
            if (this.isCheckList.length > 0){
                this.isCheckList.forEach((item) =>{
                    this.tableData.forEach((data) =>{
                        if(item.svcId == data.svcId){
                            this.isRecord = true;
                            this.$refs.tableRef1.toggleRowSelection(data);
                        }
                    })
                })
            }
        }
    },
    created(){
    },
    watch: {
        visibleShow: {
            handler(newVal, oldVal) {
                // console.log('初始化弹窗',newVal)
                this.$nextTick(()=>{
                    this.changeTabs = 'C';
                })
                if(!newVal){return}
                if(newVal){
                    this.isCheckList.length = 0;
                    this.$nextTick(()=>{
                        this.getServiceNewList()
                    })
                }
            },
            deep: true,
            immediate: true,
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
    .top_btn_flex{
        margin-top:-66px;
        margin-bottom: 24px;
        display: flex;
        justify-content: center;
    }
    .preview_dialog_table_list {
        width: 100%;
        h3 {
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            line-height: 36px;
        }
        .btn_el_pageNation {
            display: flex;
            justify-content: flex-end;
            padding: 16px 0;
        }
        .dialog_btn {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px 0px;
            ::v-deep .el-button{
                height: 35px;
                text-align: center;
            }
        }
        .demo-form-inline {
            width: 100%;
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
            ::v-deep .el-button {
                min-width: 64px;
                height: 32px;
                font-size: 14px;
            }
        }
        .btn_tips_flex{
            width:100%;
            margin-bottom:10px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            span{
                font-size:14px;
                text-align: center;
                margin-right:6px;
                a{
                    color:#358aff;
                }
            }
        }
    }
    ::v-deep .el-dialog__header {
        border-bottom: 1px solid #dedede;
        height:55px;
        .el-dialog__headerbtn {
            width: 20px;
            height: 20px;
            text-align: center;
        }
    }
}
</style>
