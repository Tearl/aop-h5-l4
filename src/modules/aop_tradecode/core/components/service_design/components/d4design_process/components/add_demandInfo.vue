<template>
    <div
        class="aop_tradecode_servicedesign_adddemandInfo"
    >
        <el-tabs v-model="activeName" v-if="showType=='edit'" @tab-click="tabsHandleClick">
            <el-tab-pane label="基本信息" name="first"></el-tab-pane>
        </el-tabs>
        <div class="line" v-if="showType=='edit'"></div>
        <el-form ref="ruleForm" v-if="activeName=='first'" :model="form" label-width="120px" class="form_info">
            <el-form-item label="需求名称：" required>
                <el-input :disabled="showType=='edit'" v-model="form.name" maxlength="64"></el-input>
            </el-form-item>
            <el-form-item label="需求描述：">
                <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 20}"
                v-model="form.desc"
                maxlength="500"
                show-word-limit></el-input>
            </el-form-item>
            <!-- <el-form-item label="回复状态：" required>
                <span slot="label">回复状态：</span>
                <el-select v-model="form.region1" placeholder="请选择">
                    <el-option label="未回复" value="01"></el-option>
                    <el-option label="已回复" value="02"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="回复内容：">
                <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 20}"
                v-model="form.callBackdesc"
                maxlength="500"
                show-word-limit></el-input>
            </el-form-item> -->
        </el-form>
        <div class="btn_bottom">
            <el-button size="medium" @click="cancel">取消</el-button>
            <el-button size="medium" type="primary" @click="onSubmit">确定</el-button>
        </div>
    </div>
</template>
<script>
import mixin from "@m/core/mixin";
import PageTable from "@m/core/components/page_table";
export default {
    mixins: [mixin],
    components: {
        PageTable,
    },
    props: {
        funcList: {
            type: Array,
            default: () => [],
        },
        newlabelShow: {
            type: Boolean,
            default: () => false,
        },
        showType: {
            type: String,
            default: () => 'add',
        },
        topInfo: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            formInfoId:'',
            showTableType:'label',
            form: {
                name: '',
                desc: '',
                region1: '',
                callBackdesc:'',
            },


            dialogTitle:'',
            showAssetList: false,
            isResetList:'',
            activeName:'first',
        };
    },
    created(){},
    mounted(){
        // console.log(this.form)
    },
    methods: {
        handleClose() {
            this.resetForm();
            this.$emit("closeDrawer");
        },
        closeDialog(type,val){
            this.dialogTitle="";
            this.showAssetList=false;
            if(type=='labelClose'&&val=='01'){
                this.isResetList = val;
            }
        },
        tabsHandleClick(e){
            console.log(e,'tabsHandleClick')
            this.activeName = e.name;
        },
        onSubmit() {
            if(this.form.name==''){
                this.$message({
                    message: '请输入需求名称',
                    type: 'warning'
                });
                return
            }
            if(this.form.region1==''){
                this.$message({
                    message: '请选择回复状态',
                    type: 'warning'
                });
                return
            }
            if(this.showType=='edit'){
                this.updateLabelBaseInfo(this.form);
            }
            if(this.showType=='add'){
                this.saveOrUpDemandInfo(this.form);
            }
        },
        cancel(){
            this.resetForm();
            this.$emit("closeDrawer");
        },
        resetForm(){
            this.form= {
                name: '',
                desc: '',
                region1: '01',
                callBackdesc:'',
            };
        },
        addAsset(){
            this.showAssetList = !this.showAssetList;
        },
        async saveOrUpDemandInfo(data){
            let params = {
                demandId: '',//新增为空
                functionId: this.$route.query.fnctId,
                demandName: data.name,
                demandDesc: data.desc,
                demandStatus: data.region1,
                demandReplyDesc: data.callBackdesc,
                apis: [],//服务列表 新增为空
            };
            const res = await this.rpc.d4.saveOrUpDemandInfo(
                params
            );
            this.resetForm();
            this.$emit("closeDrawer");
        },
        async updateLabelBaseInfo(data){ //编辑
            let params = {
                demandId: data.demandId,
                functionId: this.$route.query.fnctId,
                demandName: data.name,
                demandDesc: data.desc,
                demandStatus: data.region1,
                demandReplyDesc: data.callBackdesc,
                apis: [],//服务列表 新增为空
            };
            const res = await this.d4.saveOrUpDemandInfo(
                params
            );
            this.resetForm();
            this.$emit("closeDrawer");
        },
    },
    beforeDestroy() {
        this.resetForm();
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy();
        next();
    },
    watch:{
        'topInfo':{
            handler(val,oldval){
                // console.log(val,"99999")
                if(val){
                    this.$nextTick(()=>{
                        this.formInfoId = val.labelId;
                        this.form = {
                            name: val.labelNm,
                            desc: val.labelDesc,
                            region1: val.label1LvlClassCd,
                            callBackdesc: val.callBackdesc,
                        }
                    })
                } else {
                    this.$nextTick(()=>{
                        this.resetForm();
                    })
                }
            },
            deep:true,
            immediate: true,
        },
        "showType":{
            handler(val,oldval){
                if(val && val =="add"){
                    this.$nextTick(()=>{
                        this.resetForm();
                    })
                }
            },
            deep:true,
            immediate: true,
        },
    },
};
</script>
<style lang="scss" scoped>
    .tag-list{
        width:60px;
        text-align:center;
        margin:4px 6px;
        cursor: pointer;
    }
    .changeBtn{
        width:140px;
        height: 32px;
        line-height: 32px;
        text-align:center;
        padding: 0;
        cursor: pointer;
    }
</style>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_servicedesign_adddemandInfo {
    min-width: 640px;
    ::v-deep .el-tabs__header{
        margin-bottom:0;
    }
    .form_info{
        padding-bottom: 50px;
        ::v-deep .el-form-item{
            display: flex!important;
            // flex-direction: column!important;
        }
        ::v-deep .el-form-item__content {
            margin-left: 0px!important;
            min-width: 180px!important;
            flex:1;
            padding-right:30px;
        }
        ::v-deep .el-form-item__label {
            margin-left: 4px!important;
            width: 120px!important;
        }
    }
    .labelStyle{
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        line-height: 2;
        font-weight: 600;
        margin: 10px 0 10px 24px;
    }
    .line{
        width:100%;
        height:1px;
        background:#dedede;
        margin-bottom:12px;
        margin-top:1px;
    }
    .question{
        color: #ff9104;
        margin-left: 0px;
        position: relative;
        margin-top: 12px;
        cursor: pointer;
        font-size: 14px;
        width: 14px;
    }
    .box_card{
        border-radius: 4px;
        border: 1px solid #dedede;
        background-color: #dedede;
        width: 400px;
        height: 240px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: relative;
        h3{
            text-align: center;
            line-height: 30px;
            top: 0;
            position: absolute;
        }
        .el-button{
            top: 100px;
            min-width: 84px;
            font-size: 16px;
            text-align: center;
            height: 35px;
            line-height: 35px;
            padding: 0 5px;
        }
    }
    .flex-boxs{
        display: flex;
    }
    .wrap::-webkit-scrollbar {
        display: none;
    }
    .preview_content_table {
        color: #131313;
        max-height:calc(100vh - 150px);
    }
    .btn_bottom {
        display: flex;
        justify-content: center;
        border-top: 1px solid #dddddd;
        padding: 16px 0;
        position: absolute;
        bottom: 0px;
        right: 0px;
        z-index: 1001;
        width:100%;
        background: #ffffff;
        .el-button{
            margin-left: 30px;
        }
    }
}
</style>
