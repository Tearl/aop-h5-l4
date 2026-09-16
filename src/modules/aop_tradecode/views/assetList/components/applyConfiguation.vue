<template>
    <div class="dialog-content-table">
        <el-dialog
            title="初始化配置"
            :visible.sync="visibleShow"
            width="680px"
            :before-close="handleClose"
            class="aop_techdesign_techdetail_dialog"
        >
            <h3>基本信息</h3>
            <div class="preview_content_table2">
                <div class="preview_content_table_flex">
                    <p>
                        工程编码：
                        <span>{{ detailObj.projectName }}</span>
                    </p>
                    <p>
                        工程名称：
                        <span>{{ detailObj.appNm }}</span>
                    </p>
                </div>
                <div class="preview_content_table_flex3">
                    <p>
                        工程初始化配置项：
                    </p>
                    <div style="padding:0 16px;">
                        <el-table
                            ref="singleTable1"
                            :data="tableData2"
                            :header-cell-style="{
                                background: '#F5F5F8',
                                color: '#333',
                            }"
                            style="width: 100%">
                            <el-table-column
                                type="index"
                                label="序号"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                property="typeName"
                                label="配置项"
                                min-width="150">
                            </el-table-column>
                            <el-table-column
                                property="status"
                                label="状态"
                                v-if="showLoading"
                                min-width="80">
                                <template slot-scope="scope">
                                    <span
                                        class="gray"
                                        v-loading="showLoading"
                                        element-loading-spinner="el-icon-loading">
                                    {{scope.row.status}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="status"
                                label="状态"
                                v-else
                                min-width="80">
                                <template slot-scope="scope">
                                    <span
                                        class="gray"
                                        v-loading="scope.row.status=='-1'"
                                        v-if="scope.row.status=='-1'"
                                        element-loading-spinner="el-icon-loading">
                                    {{scope.row.status}}</span>
                                    <span class="green" v-else-if="scope.row.status=='0'"><i class="el-icon-success"></i></span>
                                    <span class="orange" v-else-if="scope.row.status=='-2'"><i class="el-icon-error"></i></span>
                                    <span class="red" v-else-if="scope.row.status=='-3'"><i class="el-icon-warning"></i></span>

                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="preview_content_table_flex3" v-if="keyType !='s4design'">
                    <p>
                        工程手动配置项：
                    </p>
                    <div style="padding:0 16px;">
                        <el-table
                            ref="singleTable2"
                            :data="tableData3"
                            :header-cell-style="{
                                background: '#F5F5F8',
                                color: '#333',
                            }"
                            style="width: 100%">
                            <el-table-column
                                type="index"
                                label="序号"
                                width="80">
                                <template slot-scope="scope">
                                    <el-checkbox
                                        v-model="scope.row.isCheck"
                                        @change="handleCurrentChange(scope.row)"
                                        :name="scope.row.index"
                                    >
                                    </el-checkbox>
                                    <span>{{scope.row.index}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="type"
                                label="配置项"
                                min-width="120">
                            </el-table-column>
                            <el-table-column
                                property="desc"
                                label="备注"
                                min-width="120">
                                <template slot-scope="scope">
                                    <el-input
                                        size="small"
                                        placeholder="请输入"
                                        @blur="blurText(scope.row)"
                                        @input="inputText(scope.row)"
                                        v-model="scope.row.remark"
                                    >
                                    </el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleClose" v-if="keyType !='s4design'"
                    >取 消</el-button
                >
                <el-button size="small" @click="handleClose" v-if="keyType =='s4design'"
                    >关 闭</el-button
                >
                <el-button
                    size="small"
                    type="primary"
                    v-if="keyType !='s4design'"
                    @click="submitAppConfApply()"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";
import { downloadEvt } from "@m/core/utils/download.js";
export default {
    mixins: [mixin],
    props: {
        visibleShow: {
            type: Boolean,
            default: false,
        },
        formInfo3: {
            type: Object,
            default: () => ({}),
        },
        tableData: {
            type: Array,
            default: () => [],
        },
        appId: {
            type: String,
            default: () => (''),
        },
        detailObj: {
            type: Object,
            default: () =>({}),
        },
        keyType: {
            type: String,
            default: () =>(''),
        },
    },
    data() {
        return {
            appId: "",
            fnctNo: "",
            authFnctJobInfoId2: "",
            arrangeradio:[],
            showLoading:false,
            tableData2:[
                {
                    typeCode: 'c1',
                    status: '-1',
                },
                {
                    typeCode: 'c2',
                    status: '-1',
                },
                {
                    typeCode: 'c3',
                    status: '-1',
                },{
                    typeCode: 'c4',
                    status: '-1',
                }
            ],
            tableData3:[],
            startValue:"",
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    created() {
        this.visibleShow = false;
        // console.log(this.formInfo3, "------------info");
    },
    mounted() {

    },
    methods: {
        handleClose(e) {
            this.arrangeradio=[];
            this.$emit("handleClose", e);
        },
        inputText(v){ // 输入框改变
            // console.log(v)
        },
        blurText(v){ //输入框失焦
            // console.log(v)
        },
        async getRefesh(){
            // 初始化配置查询
            this.showLoading = true;
            const params = {
                appId:this.detailObj.appId || "",
                fnctId: this.$route.query.fnctId || "",
            }
            const res = await this.rpc.configSev.queryAppInitConfStuts(params);
            if(res.appInitConfStutsInfos.length>0){
                let list = res.appInitConfStutsInfos.map((item)=>{
                    return {
                        typeName: item.confNm,
                        typeCode: item.confCd,
                        status: item.stusCd, // -1 未配置 0 已配置 -2配置失败
                        appId: item.appId,
                    }
                })
                setTimeout(()=>{
                    this.showLoading = false;
                },800)
                this.tableData2 = list;
                let arr = this.tableData2.filter((ele)=>ele.status == -1);
                if(arr.length ==0){return}
                console.log('22222222222')
                // 从第一个未配置的开始初始化
                switch (arr[0].typeCode) {
                    case 'c1':
                        this.createAppGitStroe(arr[0]);
                        break;
                    case 'c2':
                        this.createAppGitBaseBranch(arr[0]);
                        break;
                    case 'c3':
                        this.createAppGitFnctBranch(arr[0]);
                        break;
                    case 'c4':
                        this.createCICDConfig(arr[0]);
                        break;
                }
            }
        },
        async createAppGitStroe(obj){ // git 仓库配置
            const params = {
                appId: obj.appId || "",
            }
            this.rpc.configSev.createAppGitStroe(params).then((res)=>{
                this.$nextTick(()=>{
                    this.tableData2.map((ele)=>{ // 依次执行未配置项
                        if(ele.typeCode.indexOf('c1')>-1){
                            ele.status =0;
                            this.createAppGitBaseBranch(ele);
                        }
                    })
                })
            }).catch((err)=>{
                console.log(err)
                this.$nextTick(()=>{
                    this.tableData2.map((ele)=>{ // 依次执行未配置项
                        if(ele.typeCode.indexOf('c1')>-1){
                            ele.status =-2;
                            // this.createAppGitBaseBranch(ele);
                        } else if (ele.status !== '0')  {
                            ele.status = -3
                        }
                    })
                })
            });
        },
        async createAppGitBaseBranch(obj){ // git基础分支配置
            const params = {
                appId: obj.appId || "",
            }
            this.rpc.configSev.createAppGitBaseBranch(params).then((res)=>{
                console.log('ooooooooooooo')
                this.$nextTick(()=>{
                    this.tableData2.map((ele)=>{ // 依次执行未配置项
                        if(ele.typeCode.indexOf('c2')>-1){
                            ele.status =0;
                            this.createAppGitFnctBranch(ele);
                        }
                    })
                })
            }).catch((err)=>{
                console.log(err)
                this.$nextTick(()=>{
                    this.tableData2.map((ele)=>{ // 配置失败 -2
                        if(ele.typeCode.indexOf('c2')>-1){
                            ele.status =-2;
                            // this.createAppGitFnctBranch(ele);
                        } else if (ele.status != '0')  {
                            ele.status = -3
                        }
                    })
                })
            });
        },
        async createAppGitFnctBranch(obj){ // git功能分支配置
            const params = {
                appId: obj.appId || "",
                fnctId: this.$route.query.fnctId || "",
            }
            this.rpc.configSev.createAppGitFnctBranch(params).then((res)=>{
                this.$nextTick(()=>{
                    this.tableData2.map((ele)=>{ // 依次执行未配置项
                        if(ele.typeCode.indexOf('c3')>-1){
                            ele.status = 0;
                            this.createCICDConfig(ele);
                        }
                    })
                })
            }).catch((err)=>{
                console.log(err)
                this.$nextTick(()=>{
                    this.tableData2.map((ele)=>{ // 配置失败 -2
                        if(ele.typeCode.indexOf('c3')>-1){
                            ele.status =-2;
                            // this.createCICDConfig(ele);
                        } else if (ele.status != '0')  {
                            ele.status = -3
                        }
                    })
                })
            });
        },
        async createCICDConfig(obj){ // cicd配置依赖前三项
            const params = {
                appId: obj.appId || "",
                envId: "1",
            }
            this.rpc.configSev.createCICDPipeline(params).then((res)=>{
                this.$nextTick(()=>{
                    this.tableData2.map((ele)=>{ // 配置失败 -2
                        if(ele.typeCode.indexOf('c4')>-1){
                            ele.status =0;
                        }
                    })
                })
            }).catch((err)=>{
                console.log(err)
                this.$nextTick(()=>{
                    this.tableData2.map((ele)=>{ // 配置失败 -2
                        if(ele.typeCode.indexOf('c4')>-1){
                            ele.status =-2;
                        }
                    })
                })
            });
        },
        handleCurrentChange(row) {
            if(row.isCheck){
               this.startValue =  row.value + ',' + this.startValue
            } else {
                let obj = row.value + ','
                this.startValue =  this.startValue.replace(obj,'')
            }
            let list = this.startValue.split(',')
            this.arrangeradio = list.splice(0,list.length-1)
            console.log(this.arrangeradio)
        },
        // 申请配置提交 新
        async submitAppConfApply() {
            let list = this.tableData3.filter((item)=>item.isCheck===true);
            console.log(list)
            if(list.length==0 && this.keyType !='s4design'){
                this.$message({
                    type: "warning",
                    message: "请选择手动配置项内容",
                });
                return;
            }
            let descList = [];
            let confType = this.arrangeradio.join(",");
            list.map((item)=>{
                descList.push(item.remark);
            })
            let confDesc = descList.join("||");
            const params = {
                appId: this.appId,
                fnctNo: this.formInfo3.assetFnctNo, // 功能编号
                fnctNm: this.formInfo3.assetFnctNm,
                confTypeCd: confType,
                confDesc: confDesc,
            };
            const res = await this.rpc.configSev.submitAppConfApply(params);
            console.log("申请配置结果--", res);
            this.handleClose('applyConfigClose');
            this.visibleShow = false;
            this.detailObj.applyDesc="";
        },
        // 申请配置
        // async saveRightDialog() {
        //     let list = this.tableData3.filter((item)=>item.isCheck===true)
        //     console.log(list)
        //     let confType = this.arrangeradio.join(",")
        //     const params = {
        //         authFnctJobInfoId: this.formInfo3.authAstFnctInfoId,
        //         appId: this.appId,
        //         fnctNo: this.formInfo3.assetFnctNo, // 功能编号
        //         fnctNm: this.formInfo3.assetFnctNm,
        //         bizDomainNo: this.formInfo3.bizDomainNo,
        //         cstNo: this.formInfo3.cstNo,
        //         confType: confType,
        //         confDesc: this.detailObj.applyDesc,
        //     };
        //     const res = await this.rpc.assetList.queryApplyConfiguration(params);
        //     console.log("申请配置结果--", res);
        //     this.handleClose('applyConfigClose');
        //     this.visibleShow = false;
        //     this.detailObj.applyDesc="";
        // },
    },
    watch: {
        "visibleShow": { //弹窗初始化
            handler(newVal, oldVal) {
                if(!newVal){return}
                this.$nextTick(()=>{
                    this.tableData3 = [{
                        type:"配置中心信息",
                        value:"10",
                        isCheck: false,
                        remark:"",
                        index:1,
                    },{
                        type:"会话数据",
                        value:"02",
                        isCheck: false,
                        remark:"",
                        index:2,
                    },{
                        type:"其他",
                        value:"00",
                        isCheck: false,
                        remark:"",
                        index:3,
                    }]
                    this.getRefesh();
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
    ::v-deep .el-dialog {
        border-radius: 8px 8px;
    }
    ::v-deep .el-dialog__body {
        padding: 20px 20px 0 20px !important;
        border-top:1px solid #eee;
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
        margin-bottom: 10px;
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
        margin: 10px 0px;
        color: #ff9104;
    }
    .dialog-footer {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 20px 24px;
        justify-content: center;
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
            padding:0 16px;
            p {
                color: #333;
                font-size: 14px;
                width: 50%;
            }
            span {
                font-size: 14px;
                color: $pri_ft_color;
            }
        }
        .preview_content_table_flex2 {
            display: flex;
            width: 100%;
            text-align: left;
            padding:0 16px;
            p {
                color: #333;
                font-size: 14px;
                width: 100%;
                display: flex;
            }
            span {
                font-size: 14px;
                color: $pri_ft_color;
            }
        }
        .preview_content_table_flex3 {
            width: 100%;
            text-align: left;
            padding:0 16px;
            h3{
               color: #ff9104;
               font-size: 16px;
               margin-top:32px;
               text-align: center;
            }
            p {
                color: #333;
                font-size: 14px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                span{
                    color:#358af3;
                    cursor: pointer;
                    margin-right:16px;
                }
            }
            .orange {
                color: #ff3f04;
                padding: 2px 5px;
                border-radius: 2px 2px;
                font-size: 14px;
            }
            .red {
                color: #e6a23c;
                padding: 2px 5px;
                border-radius: 2px 2px;
                font-size: 14px;
            }
            .green {
                color: #36d542;
                padding: 2px 5px;
                border-radius: 2px 2px;
                font-size: 14px;
            }
            .gray {
                color: #6666;
                background: #ffffff;
                font-size: 14px;
                text-align: center;
                display: inline-block;
                ::v-deep .el-loading-spinner{
                    margin-top:-15px !important;
                }
                ::v-deep .el-loading-spinner i{
                    color:#666!important;
                }
            }
        }
    }
}
</style>
