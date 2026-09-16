<template>
    <el-dialog
        :title="dialogTitle"
        width="80%"
        append-to-body="true"
        :visible.sync="visibleShow"
        :before-close="handleClose"
        class="aop_techdesign_techdetail_dialog"
    >
        <div class="preview_dialog_table_list" v-if="changeTabs=='A'">
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
                    :key="item.txId"
                    closable
                    @close="removeList(item)"
                    :type="'info'">
                    {{item.txNm}}
                </el-tag>
            </div>
            <div style="background:#f5f5f5;width:100%;height:1px;margin-bottom:16px;"></div>
            <div class="dialog_btn">
                <el-button @click="handleClose"
                    >取消</el-button
                >
                <el-button type="primary" @click="saveTradeAchieveSituation"
                    >确认</el-button
                >
            </div>
        </div>
    </el-dialog>
</template>
<script>
import PageTable from "@m/core/components/page_table";
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";
import { unduplicated } from "@m/utils/array";
export default {
    mixins: [mixin],
    components: {
        PageTable,
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
        detailInfo: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            changeTabs: "A",
            // 工程应用名称组合
            applicationList:[],
            labelTbs:[
                {
                    value:'A',
                    label:"选择接口",
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
                    labelText:"交易编号:",
                },
                {
                    type: "inputIcon",
                    model: "txNm",
                    placeholder: "请输入",
                    labelText:"交易名称:",
                },
            ],
            tables: [
                {
                    prop: "txId",
                    label: "交易编号",
                    minWidth: "150",
                    type: "text",
                    tooltip: true,
                },
                {
                    prop: "txNm",
                    label: "交易名称",
                    minWidth: "150",
                    type: "text",
                    tooltip: true,
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
        };
    },
    methods: {
        handleClose(type,val) {
            this.$emit("closeDialog",'serviceClose',val);
        },
        operate(operation, data) {
            if(operation=='look'){//查看此条交易
                // console.log('信息',data)
                window.open(
                    `/aop-h5-sub/#/aop_businessd2/transactionDesign/transDetail?apiId=${data.txId}`,
                    "_blank"
                );

            }
        },
        // 列表多选
        checkList(e) {
            if(!this.isRecord && this.multipleSelection.length > e.length){
                this.multipleSelection.forEach((item) =>{
                    if(e.indexOf(item) == -1){
                        this.isCheckList = this.isCheckList.filter(data => data.txId != item.txId)
                    }
                })
            } else {
                this.isCheckList.push(...e)
                this.isCheckList = unduplicated(this.isCheckList, "txId");
            }
            this.multipleSelection = e;
            this.isRecord = false;
            // this.isCheckList = this.multipleSelection
        },
        // 删除单条
        async removeList(op){
            const index = this.tableData.findIndex(item => item.txId == op.txId);
            if(index == -1) {
                this.isCheckList = this.isCheckList.filter(data => data.txId != op.txId)
            }else {
                this.$refs.tableRef1.$refs.tableRef.toggleRowSelection(this.tableData[index],false)
            }
        },
        searchSubmit(){
            this.isRecord = true;
            this.getServiceList()
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
            this.getServiceList()
        },
        // 列表分页
        handleSizeChange(val) {
            this.isRecord = true;
            this.formSearch.currentPage = "1";
            this.formSearch.pageSize = val;
            this.getServiceList()
        },
        handleCurrentChange(val) {
            this.isRecord = true;
            this.formSearch.currentPage = val;
            this.getServiceList()
        },
        // 选择接口绑定交易
        async saveTradeAchieveSituation(data,type){
            // 多个交易 一个接口
            let list = this.isCheckList.map((item)=>{
                return {
                    fnctId: item.fnctCd || this.$route.query.fnctId,
                    txId: item.txId,
                    txNm: item.txNm,
                    achFlg: 1, // 0-不实现;1-实现 当实现标志为1时，接口信息列表不能为空
                    ifId: this.detailInfo.svcId || '', // 接口id
                    ifNm: this.detailInfo.svcNm ||'',
                }
            })
            let params = {
                bizTradeAchieveSituationList: list,
            };
            let res = await this.rpc.s4design.saveTradeAchieveSituation(params);
            // console.log('交易==>接口关系绑定',res)
            this.rpc.s4design.addFuntionJobCommitFlow({
              fnctId: this.$route.query.fnctId,
              jobTpCd: 'C4',
            })
            this.$emit("closeDialog",'serviceClose',res);
        },
        // 新增接口先查询后端关联接口列表
        async getServiceList(row){
            const params = {
                txNm: this.formSearch.txNm,
                svcSeq: this.formSearch.txId, //编号
                txId: this.formSearch.txId, //id
                pageFlg:'1', //0否1是
                fnctId: this.$route.query.fnctId || '', //功能编号   FM-ZC-2023-000663
                currentPage: this.formSearch.currentPage,
                turnPageShowNum: this.formSearch.pageSize,
            }
            this.rpc.s4design.queryFunctionBizTradeList(params).then((res)=>{
                // console.log("查询后端接口列表22222",res)
                this.tableData = res.bizTradeAchieveSituationList || []
                this.formSearch.totalSize  = Number(res.turnPageTotalPage);
                this.$nextTick(() =>{
                    this.isTableData()
                })
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
                // this.$nextTick(()=>{
                //     this.changeTabs = 'A';
                // })
                // if(!newVal){return}
                // if(newVal){
                //     this.isCheckList.length = 0;
                //     this.$nextTick(()=>{
                //         this.getServiceList()
                //     })
                // }
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
