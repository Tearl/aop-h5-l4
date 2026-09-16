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
            <div class="switch-top" v-if="!s4Design">
                <span>mock：</span>
                <el-switch
                    v-model="mockFlg"
                    active-text="开"
                    inactive-text="关"
                >
                </el-switch>
            </div>
            <div class="dialogTable">
                <div class="packageInput">
                    <span>包路径：</span>
                    <el-input
                        size="small"
                        label="包路径："
                        placeholder="请输入包路径,例如（com.finmall）"
                        @blur="packageUrlBlur"
                        @input="packageUrlInput"
                        onkeyup="this.value=this.value.replace(/[^\a-\z\A-\Z\.]/g,'')"
                        v-model="packageUrl"
                        style="max-width:300px!important;"
                    >
                    </el-input>
                </div>
                <span style="font-size:16px;line-height:32px;">功能信息(包名)</span>
                <el-table
                    :data="tranData"
                    align="center"
                    :header-cell-style="{
                        background: '#F5F5F8',
                        color: '#333',
                    }"
                >
                    <el-table-column
                        prop="txNm"
                        label="中文名称"
                        min-width="120"
                    >
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
                    <!-- <el-table-column
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
                    </el-table-column> -->
                </el-table>
            </div>
            <div class="dialogTable">
                <span style="font-size:16px;line-height:32px;">交易信息</span>
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
                    >
                        <template slot="header" slot-scope="scope">
                            <!-- <span>是否生成</span> -->
                            <el-checkbox :key="scope.row" v-model="changeAll" :indeterminate="isIndeterminate" @change="changeAllStatus"></el-checkbox>
                        </template>
                        <template slot-scope="scope">
                            <el-checkbox
                                v-model="scope.row.status"
                                :disabled="scope.row.type=='功能' || scope.row.codeFlg == '0'"
                                :checked="scope.row.type=='功能'"
                                @change="changeSwitch(scope.row.status)"
                                key="mock"
                                >
                            </el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="svcSeq"
                        label="交易编号"
                        min-width="120"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="svcCd"
                        label="交易编码"
                        min-width="120"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="txNm"
                        label="交易名称"
                        min-width="120"
                    >
                    </el-table-column>
                </el-table>
            </div>
            <!-- <div class="btn_tips_flex" v-if="creatL5stat">
                <span>服务创建类型</span>
                <el-radio-group v-model="shureGenerateSt" @input="inputRadioChange">
                    <el-radio :label="'0'">创建真实L5服务</el-radio>
                    <el-radio :label="'1'">创建临时L5服务</el-radio>
                </el-radio-group>
            </div>
            <div class="btn_tips_flex">
                <span>特别提醒</span>
                <p>若您勾选[创建临时L5服务]，系统将为当前资产涉及的所有L5服务模拟包路径、类名等一系列代码，您可在此基础上验证4b编排逻辑，但是不能作为最终开发产物，若是需要变成真实L5服务代码，需要在此页面重新勾选[创建真实L5服务]后，重新生成！</p>
                <el-radio-group v-model="agreeMent" @input="inputRadioChange3">
                    <el-radio :label="'0'">我已阅读并同意</el-radio>
                </el-radio-group>
            </div> -->
            <!-- 别的版本暂时隐藏 -->
            <!-- <div class="btn_tips_flex">
                <span>L5服务Mock开关</span>
                <el-radio-group v-model="mockFlg" @input="inputRadioChange4">
                    <el-radio :label="'1'">开启</el-radio>
                    <el-radio :label="'0'">关闭</el-radio>
                </el-radio-group>
            </div> -->
            <!-- <div class="btn_tips_flex" v-if="checkResultCd=='1'">
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
            </div> -->
            <!-- <div class="btn_tips_flex" v-if="checkResultCd=='1'">
                <span>交易生成方式</span>
                <el-radio-group v-model="shureGenerateSt" @input="inputRadioChange">
                    <el-radio :label="'0'">全量生成</el-radio>
                    <el-radio :label="'1'">去重后生成</el-radio>
                </el-radio-group>
            </div> -->
            <div class="btn_tips_flex" v-if="!switchStatus">
                <p style="color:red;">请至少选择一条交易！</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button
                    v-if="!checkResultCd"
                    type="primary"
                    size="small"
                    key="left"
                    @click="checkGenerateCode"
                    >确 定</el-button
                >
                <el-button
                    v-else
                    type="primary"
                    size="small"
                    key="right"
                    :disabled="btnStatus"
                    @click="appyBranchCodeSave"
                    >确 定</el-button
                > -->
                <el-button
                    type="primary"
                    size="small"
                    key="right"
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
        tranData: {
            type: Array,
            default: () => []
        },
        s4Design: {
            type: Boolean,
            default: false,
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
            mockFlg: false, // 是否mock
            checkResultCd:"", // 重复检验0-成功;1-失败
            checkResultList:[], // 重复数据列表
            shureGenerateSt:"", // 选择生成代码选项
            agreeMent:"", // 同意协议
            creatL5stat:false, // 创建服务类型
            options: [{
            value: '1',
            label: '创建真实L5服务'
            }, {
            value: '2',
            label: '创建临时L5服务'
            }],
            switchStatus: true,
            changeAll: false, // 不全部生成
            isIndeterminate:false, // 复选状态

            packageUrl:'', // 包路径
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
                    this.creatL5stat = false;
                    this.switchStatus = true;
                    this.agreeMent = "";
                    this.tableData.forEach((item)=>{
                        // item.status= true
                        // if(item.type !="功能"){
                        //     item.status= true
                        // }
                        if(item.codeFlg == "1"){
                            item.status = true;
                        }else{
                            item.status = false;
                        }

                    })
                } else {
                    this.tableData.forEach((item)=>{
                        if(item.type !="功能"){
                            item.status= "1"
                            item.statusGenerate = true
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
                let tempArr = list.filter(item => item.codeFlg == "1");
                this.changeAll = tempArr.every(ele=>ele.status === true)
                // this.changeAll = list.every(ele=>ele.status === true)
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
        "tranData": {
            handler(newVal, oldVal) {
                let list = newVal.filter(ele=>ele.type!='功能');
                if(list.length==0){return}
                console.log(list[0])
                this.packageUrl = list[0].pkgPath || '';
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
            this.visibleShow = false;
            this.checkResultCd = ""; // 重置校验
            this.shureGenerateSt = ""; //重置单选
            this.creatL5stat = false;
            this.$emit("handleClose", e);
        },
        changeAllStatus(value){
            console.log("----->",value,this.tableData)
            if(value){
                this.tableData.forEach((item)=>{
                    // item.status = true
                    if(item.codeFlg == "1"){ // srcFnctFlg
                        item.status = true;
                    }else {
                        item.status = false;
                    }
                })
                this.switchStatus = true;
            } else {
                this.tableData.forEach((item)=>{
                    // if(item.type=='功能'){
                    //     item.status = true
                    // } else {
                    //     item.status = false
                    // }
                    item.status = false
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
        packageUrlBlur(val) {
            if (!val.target.value) {
                return;
            }
            this.packageUrl = val.target.value;
            // this.getSaveCodeListUpdate(val);
        },
        packageUrlInput(v) {
            console.log(v,'-----')
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
                engNm: item.txEngNm || '',
                pkgPath: this.packageUrl || '', // 增加包路径
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
        inputRadioChange3(e){
            this.agreeMent = e;
        },
        inputRadioChange4(e){
            this.mockFlg = e;
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
                // this.switchStatus = this.tableData.some(e=>e.status===true);
                // if(this.checkResultCd=="0"){
                    this.appyBranchCodeSave()
            //     }
            // });
        },
        //生成代码确认按钮
        async appyBranchCodeSave(obj) {
            let flag = this.tranData.some((value) => {
                return value.txEngNm == "";
            });
            if (flag) {
                this.$message({
                    type: "warning",
                    message: "请补充完善所要生成代码的功能/交易英文名称",
                });
                return;
            }
            this.switchStatus = this.tableData.some(e=>e.status===true);
            // let list = this.tableData.slice(1,this.tableData.length);
            // list.forEach((item)=>{
            //     if(item.status){
            //         item.generateFlg = "1"
            //     } else {
            //         item.generateFlg = "0"
            //     }
            // })
            let list = this.tableData.filter(f => f.status === true)
            // let mockFlgType = this.s4Design?'01':'02';
            if(this.s4Design){ // 设置从S4系统设计默认true 传递01上送
                this.mockFlg = true;
            }
            const params = {
                // authFnctJobInfoId: this.authFnctJobInfoId2,
                mockFlg: this.mockFlg ? "01" : "00", //00-不走mock；01-4bMock；02-S5Mock
                // codeFlg: this.checkResultCd == "1"?this.shureGenerateSt:"", // 0-全部生成;1-去掉重复交易后生成
                codeFlg:"0",
                // txFnctInfos: this.shureGenerateSt=="1"?this.checkResultList:[],
                txFnctInfos:[],
                fnctEngNm: this.tranData[0].txEngNm,
                fnctNm: this.tranData[0].txNm,
                fnctId: this.$route.query.fnctId,
                dataList: list,
                pkgPath: this.packageUrl || '', // 增加包路径
                bizDomainNo: this.$route.query.beltLine,
                examId: this.$route.query.examId || "",
            };
            this.rpc.assetList.submitAppyBranchCodeSave(params).then((res) => {
                this.visibleShow = false;
                this.handleClose();
                this.checkResultCd = ""; // 重置校验
                this.shureGenerateSt = ""; //重置单选
                this.creatL5stat = false;
                this.$message({
                    type: "success",
                    message: "生成代码成功!",
                });
            });
            this.rpc.s4design.addFuntionJobCommitFlow({
                fnctId: this.$route.query.fnctId,
                jobTpCd: 'C4',
            })
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
            this.tranData.forEach((item) => {
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
        line-height:21px;
    }
    ::v-deep .el-switch.is-checked .el-switch__core::after {
        left: 100%;
        margin-left: -18px;
    }
    /*打开时文字位置设置*/
    ::v-deep .el-switch__label--right {
        z-index: 1;
        left: 2px;
        height: 20px;
        line-height:21px;
    }
    ::v-deep .el-switch__core:after {
        width: 18px;
        height: 18px;
    }
    /*关闭时文字位置设置*/
    ::v-deep .el-switch__label--left {
        z-index: 1;
        right: 2px;
        height: 20px;
        line-height:21px;
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
        height: 21px;
        line-height: 21px;
        border-radius: 12px;
    }
    ::v-deep .el-dialog__body {
        padding: 2px 20px 0 20px !important;
    }
    ::v-deep .el-button {
        min-width: 64px;
        height: 32px;
        font-size: 14px;
    }
    .packageInput{
        width:50%;
        display: flex;
        align-items: center;
        span{
            min-width: 65px;
        }
        .el-input__inner{
            max-width:250px;
        }
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
            margin-left:36px;
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
