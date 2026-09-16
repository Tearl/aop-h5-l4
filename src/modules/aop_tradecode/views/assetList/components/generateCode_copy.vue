<template>
    <div class="dialog-content-table">
        <el-dialog
            :close-on-click-modal="false"
            title="生成代码"
            :visible.sync="visibleShow"
            width="80%"
            :before-close="handleClose"
            class="aop_techdesign_techdetail_dialog"
        >
            <div class="switch-top">
                <span>mock：</span>
                <el-switch
                    v-model="mockFlg"
                    active-text="开"
                    inactive-text="关"
                >
                </el-switch>
            </div>
            <div class="dialogTable">
                <span style="font-size:16px;line-height:32px;">功能/交易英文名称</span>
                <el-table
                    :data="tableData"
                    align="center"
                    :header-cell-style="{
                        background: '#F5F5F8',
                        color: '#333',
                    }"
                >
                    <el-table-column
                        prop="txNm"
                        label=""
                        width="60"
                        v-if="tableData.length>1"
                    >
                        <template slot="header" slot-scope="scope">
                            <!-- <span>是否生成</span> -->
                            <el-checkbox :key="scope.row" v-model="changeAll" :indeterminate="isIndeterminate" @change="changeAllStatus"></el-checkbox>
                        </template>
                        <template slot-scope="scope">
                            <el-checkbox
                                v-model="scope.row.status"
                                :disabled="scope.row.type=='功能'"
                                :checked="scope.row.type=='功能'"
                                @change="changeSwitch(scope.row.status)"
                                key="mock"
                                >
                            </el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="txNm"
                        label="中文名称"
                        min-width="120"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="类型"
                        min-width="80"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.type || "交易" }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="txEngNm"
                        label="英文名称"
                        min-width="180"
                    >
                        <template slot-scope="scope">
                            <el-input
                                size="small"
                                placeholder="请输入"
                                @blur="txEngNmBlur(scope.row)"
                                @input="txEngNmInput"
                                onkeyup="this.value=this.value.replace(/[^a-zA-Z]/g,'')"
                                v-model="scope.row.txEngNm"
                            >
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label=""
                        min-width="120"
                    >
                        <template slot-scope="scope">
                            <el-link
                                type="primary"
                                :underline="false"
                                @click="dictionariesSelect(scope.row)"
                                >从字典选入</el-link
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- <div class="btn_tips_flex">
                <span>服务创建类型</span>
                <el-radio-group v-model="shureGenerateSt" @input="inputRadioChange">
                    <el-radio :label="'0'">创建真实L5服务</el-radio>
                    <el-radio :label="'1'">创建临时L5服务</el-radio>
                </el-radio-group>
            </div>
            <div class="btn_tips_flex">
                <span>特别提醒</span>
                <p>若您勾选[创建临时L5服务]，系统将为当前活动涉及的所有L5服务模拟包路径、类名等一系列代码，您可在此基础上验证4b编排逻辑，但是不能作为最终开发产物，若是需要变成真实L5服务代码，需要在此页面重新勾选[创建真实L5服务]后，重新生成！</p>
                <el-radio-group v-model="shureGenerateSt" @input="inputRadioChange">
                    <el-radio :label="'0'">我已阅读并同意</el-radio>
                </el-radio-group>
            </div> -->
            <div class="btn_tips_flex" v-if="checkResultCd=='1'">
                <span><i
                            class="el-icon-warning el-icon--left"
                            style="background: #fef2dd; color: #f5a623"
                        ></i
                        >警告:</span>

                <div v-for="item in checkResultList" :key="item.txId">
                    <div class="top_title_tips" v-for="prop in item.fnctInfos" :key="prop.fnctId">
                        <span
                            >存在【交易】【{{item.txNm}}】已在【活动】【{{prop.fnctNm}}】中生成代码；</span
                        >
                    </div>
                </div>
            </div>
            <div class="btn_tips_flex" v-if="checkResultCd=='1'">
                <span>交易生成方式</span>
                <el-radio-group v-model="shureGenerateSt" @input="inputRadioChange">
                    <el-radio :label="'0'">全量生成</el-radio>
                    <el-radio :label="'1'">去重后生成</el-radio>
                </el-radio-group>
            </div>
            <div class="btn_tips_flex" v-if="!switchStatus">
                <p style="color:red;">请至少选择一条交易！</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button
                    v-if="!checkResultCd"
                    type="primary"
                    size="small"
                    key="left"
                    :disabled="!switchStatus"
                    @click="checkGenerateCode"
                    >确 定</el-button
                >
                <el-button
                    v-else
                    type="primary"
                    size="small"
                    key="right"
                    :disabled="btnStatus || !switchStatus"
                    @click="appyBranchCodeSave"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <lebDataDictionDialog2
            v-if="addVisible"
            v-model="addVisible"
            @output="dickChkFn"
            :splitFirst="splitFirst"
            name="lebDataDictionDialog2"
        ></lebDataDictionDialog2>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";
import lebDataDictionDialog2 from "./LebDataDictionDialog2.vue";
import { downloadEvt } from "@m/core/utils/download.js";
export default {
    mixins: [mixin],
    components: {
        lebDataDictionDialog2,
    },
    props: {
        visibleShow: {
            type: Boolean,
            default: false,
        },
        formInfo: {
            type: Object,
            default: () => ({}),
        },
        tableData: {
            type: Array,
            default: () => [],
        },
        appId: {
            type: String,
            default: () => "",
        },
        fnctNo: {
            type: String,
            default: () => "",
        },
        authFnctJobInfoId2: {
            type: String,
            default: () => "",
        },
    },
    data() {
        return {
            showLoading: false,
            //英文名称输入框是否正在输入
            isInput: false,
            //数据字典
            addVisible: false,
            //送到数据字典的中文名称
            splitFirst: "",
            //要从字典输入的那列数据的id
            splitFirstWord: "",
            //列表修改之前的英文名称
            intrinsicText: "",
            //生成代码列表输入框是否改东西
            changeInput: false,
            mockFlg: true, // 是否mock
            checkResultCd:"", // 重复检验0-成功;1-失败
            checkResultList:[], // 重复数据列表
            shureGenerateSt:"", // 选择生成代码选项
            switchStatus: true,
            changeAll: false, // 不全部生成
            isIndeterminate:false, // 复选状态
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),
        btnStatus(){
            return (this.checkResultCd ==="1" && this.shureGenerateSt==="")
        },
    },
    watch: {
        "visibleShow": {
            handler(newVal, oldVal) {
                if(newVal){
                    this.switchStatus = true;
                    this.tableData.forEach((item)=>{
                        if(item.type !="功能"){
                            item.status= true
                        }

                    })
                } else {
                    this.tableData.forEach((item)=>{
                        if(item.type !="功能"){
                            item.status= false
                        }
                    })
                }
            },
            deep: true,
            immediate: true,
        },
        "tableData": {
            handler(newVal, oldVal) {
                let list = this.tableData.filter(ele=>ele.type!='功能');
                if(list.length==0){return}
                let nowLength = list.filter(ele=>ele.status === true).length;
                this.changeAll = list.every(ele=>ele.status === true)
                if(nowLength == 0 || nowLength == list.length){
                    this.isIndeterminate = false;
                    return
                }
                if(nowLength<list.length && nowLength>0){
                    this.isIndeterminate = true;
                    return
                }
            },
            deep: true,
            immediate: true,
        },
    },
    created() {
        // console.log(this.formInfo,'------------info')
    },
    methods: {
        handleClose(e) {
            this.$emit("handleClose", e);
        },
        changeAllStatus(value){
            if(value){
                this.tableData.forEach((item)=>{
                    item.status = true
                })
                this.switchStatus = true;
            } else {
                this.tableData.forEach((item)=>{
                    if(item.type=='功能'){
                        item.status = true
                    } else {
                        item.status = false
                    }
                })
                this.switchStatus = false;
            }
        },
        // 英文名称输入信息保存
        txEngNmBlur(val) {
            if (!val.txEngNm) {
                return;
            }
            if (this.changeInput) {
                this.getSaveCodeListUpdate(val);
            }
        },
        txEngNmInput() {
            this.changeInput = true;
            this.isInput = true;
        },
        // 生成代码对话框保存信息
        async getSaveCodeListUpdate(item) {
            if(item.type == "功能" && !this.appId){
                return;
            }
            const params = {
                appId: item.type == "功能" ? this.appId : "", // 应用ID
                fnctId: this.fnctNo, // 功能ID必输
                txId: item.type == "功能" ? "" : item.txId,
                engNm: item.txEngNm,
            };
            const res = await this.rpc.assetList
                .queryApplicationSaveCode(params)
                .catch((err) => {
                    this.applicationSaveCodeList(item);
                });
            this.isInput = false;
            this.changeInput = false;
        },
        inputRadioChange(e){
            this.shureGenerateSt = e;
        },
        changeSwitch(e){
            let list = this.tableData.filter(ele=>ele.type!='功能');
            let nowLength = list.filter(ele=>ele.status === true).length;
            this.changeAll = list.every(ele=>ele.status === true);
            this.switchStatus = list.some(ele=>ele.status === true);
            if(nowLength == 0 || nowLength == list.length){
                this.isIndeterminate = false;
                return
            }
            if(nowLength<list.length && nowLength>0){
                this.isIndeterminate = true;
                return
            }
        },
        // 生成代码提交检验是否重复
        checkGenerateCode(){
            // if(!this.appId){
            //     this.$message({
            //         type: "warning",
            //         message: "缺少必要的交易信息,无法生成代码",
            //     });
            //     return;
            // }
            // const params = {
            //     authFnctJobInfoId: this.authFnctJobInfoId2,
            // };
            // this.rpc.assetList.checkCodeGenerateRecord(params).then((res) => {
            //     this.checkResultCd = res.checkResultCd;
            //     this.checkResultList = res.txFnctInfos;
            //     this.switchStatus = this.tableData.some(e=>e.status===true);
            //     if(this.checkResultCd=="0" && this.switchStatus){
                    this.appyBranchCodeSave()
            //     }
            // });
        },
        //生成代码确认按钮
        async appyBranchCodeSave(obj) {
            // let flag = this.tableData.some((value) => {
            //     return value.txEngNm == ""&& value.status;
            // });
            // if (flag) {
            //     this.$message({
            //         type: "warning",
            //         message: "请补充完善所要生成代码的交易英文名称",
            //     });
            //     return;
            // }
            this.switchStatus = this.tableData.some(e=>e.status===true);
            let list = this.tableData.slice(1,this.tableData.length);
            list.forEach((item)=>{
                if(item.status){
                    item.generateFlg = "1"
                } else {
                    item.generateFlg = "0"
                }
            })
            const params = {
                // authFnctJobInfoId: this.authFnctJobInfoId2,
                mockFlg: this.mockFlg ? "1" : "0",
                codeFlg: this.checkResultCd == "1"?this.shureGenerateSt:"", // 0-全部生成;1-去掉重复交易后生成
                txFnctInfos: this.shureGenerateSt=="1"?this.checkResultList:[],
                fnctEngNm: this.tableData[0].txEngNm,
                fnctNm: this.tableData[0].txNm,
                fnctId: this.$route.query.fnctId,
                dataList: list,
                bizDomainNo: this.$route.query.beltLine,
                examId: this.$route.query.examId || "",
            };
            this.rpc.assetList.submitAppyBranchCodeSave(params).then((res) => {
                this.visibleShow = false;
                this.handleClose();
                this.checkResultCd = ""; // 重置校验
                this.shureGenerateSt = ""; //重置单选
                this.$message({
                    type: "success",
                    message: "生成代码成功!",
                });
            });
        },
        //从字典选入
        dictionariesSelect(row) {
            const params = {
                text: row.txNm,
            };
            this.intrinsicText = row.txEngNm;
            this.splitFirstWord = row.txId;
            this.rpc.assetList.querySplitWord(params).then((res) => {
                this.splitFirst = res.splitFirstWord;
                this.addVisible = true;
            });
        },
        //数据字典选择数据
        dickChkFn(arr) {
            if (this.intrinsicText == arr) {
                return;
            }
            this.changeInput = true;
            this.tableData.forEach((item) => {
                if (item.txId == this.splitFirstWord) {
                    item.txEngNm = arr;
                    this.txEngNmBlur(item);
                }
            });
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
    .switch-top{
        position: absolute; top: 18px; right: 90px; z-index: 999;
        span{
            font-size:14px;
        }
    }
    ::v-deep .el-switch__label {
        position: absolute;
        display: none;
        color: #fff;
        font-size: 12px;
        line-height:23px;
    }
    ::v-deep .el-switch.is-checked .el-switch__core::after {
        left: 100%;
        margin-left: -20px;
    }
    /*打开时文字位置设置*/
    ::v-deep .el-switch__label--right {
        z-index: 1;
        left: 2px;
        height: 20px;
        line-height:23px;
    }
    ::v-deep .el-switch__core:after {
        width: 20px;
        height: 20px;
    }
    /*关闭时文字位置设置*/
    ::v-deep .el-switch__label--left {
        z-index: 1;
        right: 2px;
        height: 20px;
        line-height:23px;
    }
    /*显示文字*/
    ::v-deep .el-switch__label.is-active {
        display: block;
    }
    .is-checked .el-switch__core::after {
        left: 100%;
    }
    ::v-deep .el-switch__core,
    ::v-deep .el-switch {
        width: 55px !important;
        height: 23px;
        line-height: 23px;
        border-radius: 13px;
    }
    ::v-deep .el-dialog__body {
        padding: 2px 20px 0 20px !important;
    }
    ::v-deep .el-button {
        min-width: 64px;
        height: 32px;
        font-size: 14px;
    }
    .btn_tips_flex{
        width:100%;
        margin-top:10px;
        display: flex;
        flex-direction: column;
        span{
            font-size:16px;
            line-height:1.5;
        }
        p{
            font-size:14px;
            line-height:1.2;
        }
        .el-radio-group{
            margin-left:30px;
            .el-radio{
                margin-top:10px !important;
            }
        }
    }

    .top_title_tips {
        width: 100%;
        margin-top:10px;
        padding: 0px 50px;
        span {
            font-size: 14px;
            color: #f5a623;
            line-height: 18px;
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
}
</style>
