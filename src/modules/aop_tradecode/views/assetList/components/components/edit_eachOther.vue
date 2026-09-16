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
            <el-radio-group v-model="changeTabs" size="medium" @change="queryConnectList">
                <el-radio-button v-for="item in labelTbs" :key="item.value" :label="item.value" >{{item.label}}</el-radio-button>
            </el-radio-group>
        </div>
        <!-- 要素 -->
        <div class="preview_dialog_table_list" v-if="changeTabs=='A'">
            <BasisList
                :tabType="changeTabs"
                :leftCheckList="leftCheckList"
                :oldleftCheckList="oldleftCheckList"
                :removeleftCheckList="removeleftCheckList"
                :formData="formB"
                :formC="formC"
                :visibleShow="visibleShow"
                @checkListA="checkListA"
            ></BasisList>
            <!-- 已选回显 -->
            <div style="background:#f5f5f5;width:100%;height:1px;margin-bottom:10px;" v-if="leftCheckList.length>0"></div>
            <div class="btn_tips_flex" v-if="leftCheckList.length>0">
                <span>已选交互<a>{{leftCheckList.length}}</a>个:</span>
                <el-tag
                    v-for="item in leftCheckList"
                    :key="item.id"
                    closable
                    @close="removeList(item)"
                    :type="'info'">
                    {{item.d4iName}}
                </el-tag>
            </div>
            <div style="background:#f5f5f5;width:100%;height:1px;margin-bottom:16px;"></div>
            <div class="dialog_btn">
                <el-button @click="handleClose"
                    >取消</el-button
                >
                <el-button type="primary" @click="submitService('left')"
                    >确认</el-button
                >
            </div>
        </div>
        <!-- 布局 -->
        <div class="preview_dialog_table_list" v-if="changeTabs=='B'">
            <PlotList
                class="table_style"
                :tabType="changeTabs"
                :rightCheckList="rightCheckList"
                :oldrightCheckList="oldrightCheckList"
                :removerightCheckList="removerightCheckList"
                :formData="formB"
                :formC="formC"
                :visibleShow="visibleShow"
                @checkListB="checkListB"
            ></PlotList>
            <!-- 已选回显 -->
            <div style="background:#f5f5f5;width:100%;height:1px;margin-bottom:10px;" v-if="rightCheckList.length>0"></div>
            <div class="btn_tips_flex" v-if="rightCheckList.length>0">
                <span>已选交互<a>{{rightCheckList.length}}</a>个:</span>
                <el-tag
                    v-for="item in rightCheckList"
                    :key="item.id"
                    closable
                    @close="removeList(item)"
                    :type="'info'">
                    {{item.d4iName}}
                </el-tag>
            </div>
            <div style="background:#f5f5f5;width:100%;height:1px;margin-bottom:16px;"></div>
            <div class="dialog_btn">
                <el-button @click="handleClose"
                    >取消</el-button
                >
                <el-button type="primary" @click="submitService('right')"
                    >确认</el-button
                >
            </div>
        </div>
    </el-dialog>
</template>
<script>
import PageTable from "@m/core/components/page_table";
import BasisList from "./basisList.vue";
import PlotList from "./plotList.vue";
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";
export default {
    mixins: [mixin],
    components: {
        PageTable,
        BasisList,
        PlotList,
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
        formC: {
            type: Object,
            default: () => ({}),
        },
        tableData: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            changeTabs:"A",
            labelTbs:[
                {
                    value:'A',
                    label:"要素",
                },
                {
                    value:'B',
                    label:"布局",
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
            ysList:[],
            plotList:[],
            // 勾选列表
            leftCheckList: [],
            rightCheckList: [],
            // 已选择过的
            oldleftCheckList: [],
            oldrightCheckList: [],
            // 已选过的加新勾选的
            newleftCheckList: [],
            newrightCheckList: [],
            // 移除已选择
            removeleftCheckList: {},
            removerightCheckList: {},
        };
    },
    methods: {
        handleClose(type) {
            this.leftCheckList = [];
            this.rightCheckList = [];
            this.changeTabs = "",
            this.$emit("closeDialog",'editServiceClose');
        },
        checkListA(e){
            this.leftCheckList = e;
            // this.newleftCheckList = this.oldleftCheckList.concat(e);
        },
        checkListB(e){
            this.rightCheckList = e;
            // this.newrightCheckList = this.oldrightCheckList.concat(e);
        },
        async submitService(type){
            // connectNew4BList
            const list = type=='left'?this.leftCheckList:this.rightCheckList;
            const arr = list.map((item)=>{
                return {
                    d4iId: item.id,
                    d4iType: type=='left'?'00':'01',
                }
            })
            const params = {
                list: arr, // 选中列表
                interfaceId: this.formC.svcId, //接口ID
                interfaceName: this.formC.svcNm,// 接口名称
            }
            this.rpc.assetList.connectNew4BList(params).then((res)=>{
                // console.log("保存关联交互",res)
                this.leftCheckList = [];
                this.rightCheckList = [];
                this.$emit("closeDialog",'editServiceClose');
            })
        },
        async queryConnectList(type){
            const params = {
                d4iType: type=='A'?'00':'01', // 要素00 页面01
                interfaceId: this.formC.svcId, //交易接口ID
                name: "",// 接口名称
            }
            this.rpc.assetList.queryConnect4BtList(params).then((res)=>{
                if(type=='A'){
                    this.oldleftCheckList = res.list || [];
                } else {
                    this.oldrightCheckList = res.list || [];
                }
            }).catch((err)=>{
                // console.log(err)
            })

        },
        // 删除单条
        removeList(op){
            let type = this.changeTabs;
            if(type=='A'){
                this.leftCheckList.splice(this.leftCheckList.indexOf(op), 1);
                this.removeleftCheckList= op;
            } else if(type=='B'){
                this.rightCheckList.splice(this.rightCheckList.indexOf(op), 1);
                this.removerightCheckList = op
            }
            // 走接口删除--
        },
        // 列表分页
        handleSizeChange(val) {
            this.formSearch.pageSize = val;

        },
        handleCurrentChange(val) {
            this.formSearch.currentPage = val;
        },
    },
    created(){
    },
    watch: {
        "tableData": {
            handler(newVal, oldVal) {
                newVal.forEach((item)=>{
                    item.statusName = "";
                    if(item.asgntStsCd == "20"){
                        item.statusName="未登记"
                    }else if(item.asgntStsCd == "21"){
                        item.statusName="已登记"
                    }else if(item.asgntStsCd == "22"){
                        item.statusName="设计中"
                    }else if(item.asgntStsCd == "23"){
                        item.statusName="已完成"
                    }
                })
                this.tableData = newVal
            },
            deep: true,
            immediate: true,
        },
        visibleShow: {
            handler(newVal, oldVal) {
                // console.log('初始化弹窗',newVal)
                this.$nextTick(()=>{
                    this.changeTabs = 'A';
                })
                if(!newVal){
                    return
                }
                this.$nextTick(()=>{
                    this.queryConnectList('A')
                })
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
