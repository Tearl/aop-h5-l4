<template>
    <div class="aop_developer_comps_page_tabs">
        <div v-if="tabType == 'B'">
            <div class="preview_content_table">
                <div style="display:flex;align-items: center;">
                    <h3 style="margin-right: 20px;">基本信息:</h3>
                    <!-- <el-button type="primary" icon="el-icon-plus" size="mini" @click.stop="checkBusiness">从业务交易导入</el-button> -->
                </div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <div class="preview_content_table_flex">
                        <el-form-item label="接口名称：" prop="txName">
                            <!-- <el-input v-model="ruleForm.txName" placeholder="请输入接口中文名称"></el-input> -->
                            <el-autocomplete
                               size="middle"
                                v-model="ruleForm.txName"
                                :fetch-suggestions="querySearch"
                                @select="handleSelect"
                                @change="handleChange"
                                @focus="handleFocus"
                                :trigger-on-focus="true"
                                class="item"
                                clearable
                                ref="autocomplete"
                                @clear="clickClearable"
                                placeholder="请输入接口中文名称"
                                value-key="cnName"
                                :debounce="0"
                                :popper-append-to-body="false"
                                popper-class="search-autocpmplete"
                                >
                                <template slot-scope="{ item }">
                                    <el-tooltip
                                    effect="dark"
                                    :content="item.cnName"
                                    placement="top"
                                    >
                                    <div class="default">
                                        {{ item.cnName }}
                                    </div>
                                    </el-tooltip>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                        <el-form-item label="接口版本：" prop="">
                            <span>{{ruleForm.verson}}</span>
                        </el-form-item>
                    </div>
                    <div class="preview_content_table_flex">
                        <el-form-item label="接口编码：" prop="txCode">
                            <el-input v-model="ruleForm.txCode" @input="codeChange" @blur="codeBlur" placeholder="请输入接口编码 如：queryUserList"></el-input>
                        </el-form-item>
                        <el-form-item label="工程应用：" prop="applyNm">
                            <el-select v-model="ruleForm.applyNm" :disabled="true"  @change="selectChangeA" placeholder="请选择">
                                <el-option v-for="item in applicationList" :key="item.blgPojAppId" :label="item.blgPojAppNm" :value="item.blgPojAppId"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div class="preview_content_table">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <div class="preview_content_table_flex">
                        <span class="lableName">接口特性:</span>
                        <el-form-item label-width="20px">
                            <el-radio-group v-model="ruleForm.radioType" @change="clickRadioList">
                                <el-radio v-for="ra in radioList" :key="ra.value" :label="ra.value">{{ra.label}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div class="preview_content_table">
                <h3>接口主流程:</h3>
                <div v-if="canvasShow" class="processFlow">
                    <ProcessFlow
                        class="process_main"
                        ref="process"
                        pageType="mainFlow"
                        :dataObj="mainFlowData"
                        :processWidth="650"
                        :processHeight="650"
                        :isRead="true"
                    >
                    </ProcessFlow>
                </div>
            </div>
        </div>
        <div class="dialog_btn">
            <el-button @click="handleClose"
                >取消</el-button
            >
            <el-button type="primary" :disabled="btnDisabled" @click="submit"
                >确认</el-button
            >
        </div>
        <PageBusinessTrade ref="businessTradeRef" @checkTrade="checkTrade"></PageBusinessTrade>
    </div>
</template>
<script>
import ProcessFlow from "@m/core/components/process/comps"; //主流程图
import { html2Escape, escape2Html } from "@m/utils/html2e.js";
import { typeEnumObj } from "@m/utils/normalData.js";
import mixin from "@m/core/mixin";
import PageBusinessTrade from "@m/core/components/page_business_trade"; //业务交易弹框
export default {
    mixins: [mixin],
    components: {
        ProcessFlow,
        PageBusinessTrade
    },
    props: {
        tabType: {
            type: String,
            default: () => "",
        },
        bizAppId: {
            type: String,
            default: () => "",
        },
        topInfo: {
            type: Object,
            default: () => {},
        },
        applicationList: {
            type: Array,
            default: () => [],
        },
        addForm: {
            type: Object,
            default: () => {},
        }
    },
    data() {
        const checkCode = (rule, value, callback) => {
            const regex = /^[a-zA-Z0-9]+$/;
            const status = regex.test(value);
            if (!status) {
                return callback(new Error("请输入字母与数字"));
            }
            return callback();
        };
        return {
            visibleShow: false,
            ruleForm: {
                txName: '',
                txCode: '',
                applyNm: '',
                verson: '1.0.0',
                radioType: '1',
            },
            rules: {
                txName: [
                    { required: true, message: '请输入交易名称', trigger: 'blur' },
                    { min: 1, max: 32, message: '', trigger: 'blur' }
                ],
                txCode: [
                    { validator: checkCode,required: true, trigger: 'blur' },
                    { min: 1, max: 32, message: '', trigger: 'blur' }
                ],
                applyNm: [
                    { required: true, message: '请选择工程应用', trigger: 'change' }
                ],
            },
            radioList:[{
                label:"常规",
                value:"1",
            },{
                label:"登录",
                value:"2",
            },
            {
                label:"登出",
                value:"5",
            },
            {
                label:"校验验证码",
                value:"3",
            },{
                label:"上传文件",
                value:"4",
            },],
            //主流程图
            mainFlowData: {},
            canvasShow: false,
            paramList:[]
        };
    },
    computed:{
        btnDisabled(){
            return (!this.ruleForm.txName || !this.ruleForm.txCode || !this.ruleForm.applyNm)
        },
    },
    methods: {
        // id复制
        copyText(text) {
            console.log(text);
            const input = document.createElement("input");
            input.value = text; // 设置复制内容
            document.body.appendChild(input); // 添加临时实例
            input.select(); // 选择实例内容
            document.execCommand("Copy"); // 执行复制
            document.body.removeChild(input); // 删除临时实例
            this.$message({
                type: "success",
                message: "已复制地址到剪贴板",
            });
        },
        codeChange(v){
            // 输入内容处理
            let ele = v.toString()
            let ee = ele.charCodeAt(0)
            if(ee>=48 && ee<=57){
                this.ruleForm.txCode = ele.substring(1)
            }
            this.ruleForm.txCode = this.ruleForm.txCode .replace(/[\u4e00-\u9fa5]/g,'');
            this.ruleForm.txCode = this.ruleForm.txCode .replace(/\s*/g,"");
        },
        codeBlur(v){
            // 失焦数据处理
            let ele = v.target.value.toString()
            let ee = ele.charCodeAt(0)
            if(ee>=48 && ee<=57){
                this.ruleForm.txCode = ''
            }
        },
        clickRadioList(name) {
            this.queryMainFlow()
        },
        selectChangeA(value){
            console.log(value,'工程应用列表切换')
        },
        clickBlockList(name) {

        },
        /**
         * 远程调用建议列表
         */
        async querySearch(queryString, cb) {
            let results = [];
            if (queryString == "") {
                cb(results);
            } else {
                results = (await this.getQryEnName(queryString)) || [];
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                cb(results);
                }, 1000 * Math.random());
            }
        },
        /**
         * 选择接口名称
         */
        async handleSelect(item) {
            await this.getQryCnNameListByWord(item);
        },
        handleChange(item) {
            // replace(/[^\u4E00-\u9FA5]/g,'') 只能输入中文
            this.ruleForm.txName = this.ruleForm.txName .replace(/\s*/g,"");
            // console.log("=====", item);
        },
        handleFocus() {
            // console.log("handleFocus");
        },
        /**
         * 接口编码
         */
        async getQryEnName(queryString) {
            let res = await this.rpc.newEditor.qryCnNameListByWord({
                cnName: queryString,
            });
            if (res.cnNameList?.length > 0) {
                return res.cnNameList;
            }
        },
        /**
         * 接口名称
         */
        async getQryCnNameListByWord(queryString) {
            let res = await this.rpc.newEditor.qryEnName({
                cnName: queryString.cnName,
            });
            this.$set(this.ruleForm, "txCode", res.enName); //ruleForm.txCode
        },
        clickClearable() {
            this.$refs.autocomplete.activated = true;
        },
        handleClose(type,val) {
            this.$emit("handleClose",'serviceClose',val);
        },
        //主流程图数据处理
        getFlowAllData(val) {
            const position = val.flow.reduce((prev, data, index) => {
                const type = typeEnumObj[data.type];
                const actionId = `${type}${index + 1}`;
                prev[actionId] = `50 ${50 + index * 80} 100 48`;
                data.id = data.referId = actionId;
                data.type = type;
                return prev;
            }, {});
            const dataObj = {
                flow: val.flow,
                position: escape2Html(JSON.stringify(position)),
            };
            this.$nextTick(()=>{
                this.mainFlowData = JSON.parse(JSON.stringify(dataObj));
            })
        },
        //主流程图
        async queryMainFlow() {
            // radioType 1 常规（0 0 0）2（登录1）3（验证码1）4（上传文件1）
            const params = {
                isLogin: this.ruleForm.radioType=='2'?'1':'0', // 是否需要登录开关 常规 0否1是
                isVerificationCode: this.ruleForm.radioType=='3'?'1':'0', //是否需要检验验证码 0否1是
                isUploadFile: this.ruleForm.radioType=='4'?'1':'0', // 是否上传文件 0否1是
            };
            let res = await this.rpc.assetList.queryMainFlow(params);
            // console.log("queryMainFlow", res);
            if(res.flow.length>0){
                this.canvasShow = true;
            }
            this.$nextTick(()=>{
                this.getFlowAllData(res);
            })
        },
        // 执行提交新接口
        async submit(type){
            const params = {
                beltLine: this.topInfo.bizDomainNo, //业务域
                authFnctJobInfoId: this.topInfo.authAstFnctInfoId, //授权作业信息id
                apiCode: this.ruleForm.txCode, //接口编码
                apiName: this.ruleForm.txName, //接口名称
                apiVersion: this.ruleForm.verson, // 接口版本
                blgPojAppId: this.applicationList[0].blgPojAppId, // 工程应用Id
                blgPojAppNm: this.applicationList[0].blgPojAppNm, // 工程应用名称
                isLogin: this.ruleForm.radioType=='2'?'1':'0', // 是否需要登录开关 常规 0否1是
                isVerificationCode: this.ruleForm.radioType=='3'?'1':'0', //是否需要检验验证码 0否1是
                isUploadFile: this.ruleForm.radioType=='4'?'1':'0', // 是否上传文件 0否1是
                apiDesc: '', //接口描述 非必输
                isolateWorkspace: '',//隔离标识
                cstNo: this.topInfo.cstNo, // 必输客户应用编号
                appId: this.topInfo.bizAppId || this.$route.query.bizAppNo, // 业务应用编号
                paramList: this.paramList || [],
                isLoginOut: this.ruleForm.radioType==='5' ? '1' : '0',
                examId: this.$route.query.examId,
                fnctId: this.$route.query.fnctId,
                ...this.addForm,
                // arsId: '', // 服务Id
                // arsNm: '', // 服务名称
                // bkId: '', // 银行id
                // bkNm: '', // 银行名称
                // groupId: '', // 分组id
                // groupNm: '', // 分组名称
            }
            this.rpc.assetList.intAddFnctD4ApiInfo(params).then((res)=>{
                console.log("保存新建接口结果",res)
                this.$emit("handleClose",'serviceClose','03');
            })
        },
        //从业务交易导入  2024年1月9日  新版
        checkBusiness() {
            this.$refs.businessTradeRef.showDialog();
        },
        //反显业务交易详情内容，code、name、paramList
        checkTrade(data) {
            this.ruleForm.txCode = data.svcCd;
            this.ruleForm.txName = data.svcNm;
            this.ruleForm.verson = data.svcVersionNo || "1.0.0";
            this.paramList = data.puApiParams;
        },
    },
    created() {
        this.paramList = [];
        console.log("paramList",this.paramList,this.ruleForm);
    },
    mounted() {},
    filters: {
        appType(val) {
            if (!val) {
                return;
            }
            var name = "";
            if (val == "01") {
                name = "PC应用";
            } else if (val == "02") {
                name = "H5应用";
            } else if (val == "03") {
                name = "移动应用";
            } else if (val == "04") {
                name = "小程序应用";
            }
            return name;
        },
    },
    watch: {
        // ruleForm.applyNm
        "applicationList": {
            handler(newVal, oldVal) {
                if(!newVal){return}
                this.$nextTick(()=>{
                    this.ruleForm.applyNm = newVal[0]?newVal[0].blgPojAppNm : '';
                })
            },
            deep: true,
            immediate: true,
        },
        "tabType": {
            handler(newVal, oldVal) {
                if(!newVal){return}
                this.$nextTick(()=>{
                    this.queryMainFlow()
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
.aop_developer_comps_page_tabs {
    // background-color: $base_white;
    width: 100%;
    min-height: calc(100vh - 306px);
    position: relative;
    h3 {
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        line-height: 36px;
    }
    .preview_content_table {
        padding: 10px 12px;
        background: #ffffff;
        color: #131313;
        border-radius: 4px 4px;
        h3 {
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            line-height: 24px;
            display: flex;
            align-items: center;
            span {
                width: 3px;
                height: 18px;
                margin-right: 8px;
                background: #358aff;
            }
        }
        .preview_content_table_flex {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 10px 0px;
            span{
                color: #333333;
            }
            .lableName{
                color: #333333;
                font-size: 16px;
                font-weight: 600;
            }
            ::v-deep .el-form-item{
                margin-bottom: 0;
                width: 70%;
                margin-right: 5%;
            }
        }
        .process_main {
            background: $base_white;
            display: inline-block;
            .process_divMb {
                margin-bottom: 2px;
            }
            &.four_r {
                margin-top: 6px;
            }
        }
        .processFlow{
            max-width:900px;
            max-height:550px;
            overflow-y: scroll;
        }
        .processFlow::-webkit-scrollbar {
            display: none;
        }
    }
    ::v-deep .el-tabs__nav-wrap::after {
        background-color: $base_white;
    }
    ::v-deep .el-dialog__footer {
        display: flex;
        justify-content: center;
    }
    .dialog_btn {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px 0px;
        position: absolute;
        bottom:0;
        ::v-deep .el-button{
            height: 35px;
            text-align: center;
        }
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
