<template>
  <div class="aop_tradedesign_dic_cmps_data_set_form_serv_Info">
    <el-form ref="formRef" size="small" :model="servForm" :rules="rules" label-width="130px" class="edit_form">
      <div class="header_title">基本信息</div>
      <el-form-item label="服务类型：" prop="svcTyp">
        <el-radio-group v-model="servForm.svcTyp" @change="radioChange" :disabled="svcTypShow">
          <el-radio label="D5自有服务">自有服务</el-radio>
          <el-radio label="D5直连服务">直连服务</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="所属系统：" prop="systemCode"  v-if="servForm.svcTyp !== 'D5自有服务'">
        <el-select  v-model="servForm.systemCode" @change="changeSystem" placeholder="请选择所属系统">
          <el-option v-for="item in option" :key="item.systemCode" :label="item.systemName" :value="item.systemCode"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="服务名称：" prop="svcNm">
        <el-input placeholder="请输入服务名称" maxlength="50" v-model="servForm.svcNm"></el-input>
      </el-form-item>
      <el-form-item label="服务编码：" prop="svcNo" v-if="servForm.svcTyp !== 'D5自有服务'">
        <el-input
          placeholder="请输入服务编码"
          v-model="servForm.svcNo"
          maxlength="50"
        ></el-input>
      </el-form-item>

      <el-form-item label="所属数据集：" v-if="servForm.svcTyp == 'D5自有服务'" prop="dataSetNm">
        <div class="dataSet">
          <el-input v-model="servForm.dataSetNm" disabled class="gr10"></el-input>
          <!-- <span class="title" @click.stop="openDataset">选择数据集</span> -->
          <el-button type="primary" size="small" @click.stop="openDataset" :disabled="datasetDisabled">选择数据集</el-button>
        </div>
      </el-form-item>
      <!-- <el-form-item label="服务版本" prop="svcVer">
        <div class="form_item_flex">
          <el-input v-model="servForm.svcVer" clearable placeholder="1.0.0" />

          <span class="icon_right">
            <i class="el-icon-caret-top" @click="iconClick('add')"></i>
            <i class="el-icon-caret-bottom" @click="iconClick('lose')"></i>
          </span>
        </div>
      </el-form-item>-->
      <!-- <el-form-item label="参与方" prop="apiServiceParticipater">
        <el-input
          placeholder="请输入参与方"
          v-model="servForm.apiServiceParticipater"
        ></el-input>
      </el-form-item>-->
      <el-form-item label="服务描述：">
        <el-input
          type="textarea"
          :rows="4"
          v-model="servForm.svcDesc"
          clearable
          placeholder="请输入服务描述"
          maxlength="500"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { getSessionStorage } from "@m/utils/localStorage.js";

export default {
  mixins: [mixin],
  components: {},
  props: {
    // 数据集信息
    infoData: {
      type: Object,
      default: () => ({})
    },
    editFlag: {
      type: Boolean,
      default: () => false
    },
    svcTypShow:{
      type:Boolean,
      default:() => false
    },
    // datasetDisabled:{
    //   type:Boolean,
    //   default:() => false
    // }
  },
  data() {
    return {
      servForm: {
        svcTyp: "D5自有服务",
        svcNm: "",
        svcNo: "",
        // svcVer: "1.0.0",
        // apiServiceParticipater: "",
        svcDesc: "",
        dataSetNm: "",
        systemCode:"",
        standardSystemCode:""
      },
      rules: {
        svcTyp: [
          { required: true, trigger: "blur", message: "请选择服务类型" }
        ],
        svcNm: [{ required: true, trigger: "blur", message: "请输入服务名称" }],
        svcNo: [{ required: true, trigger: "blur", message: "请输入服务编码" }],
        svcVer: [
          { required: true, trigger: "blur", message: "请输入服务版本" }
        ],
        apiServiceParticipater: [
          { required: true, trigger: "blur", message: "请输入参与方" }
        ],
        svcDesc: [
          { required: true, trigger: "blur", message: "请输入服务作用" }
        ],
        dataSetNm: [
          { required: true, trigger: "blur", message: "请选择数据集" }
        ],
        systemCode: [
          { required: true, trigger: "change", message: "请选择所属系统" }
        ]
      },
      //选择数据字典参数弹窗
      addVisible: false,
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索参数名称、中文名或描述",
          style: {
            width: "260px"
          }
        },
        {
          type: "select",
          model: "paraType",
          placeholder: "参数值类型",
          select: [
            { type: "String", value: "String" },
            { type: "File", value: "File" },
            { type: "List", value: "List" },
            { type: "boolean", value: "boolean" },
            { type: "char", value: "char" },
            { type: "int", value: "int" },
            { type: "byte", value: "byte" },
            { type: "short", value: "short" },
            { type: "long", value: "long" },
            { type: "float", value: "float" },
            { type: "double", value: "double" },
            { type: "Boolean", value: "Boolean" },
            { type: "Character", value: "Character" },
            { type: "Integer", value: "Integer" },
            { type: "Byte", value: "Byte" },
            { type: "Short", value: "Short" },
            { type: "Long", value: "Long" },
            { type: "Float", value: "Float" },
            { type: "Double", value: "Double" },
            { type: "BigDecimal", value: "BigDecimal" },
            { type: "Object", value: "Object" },
            { type: "Date", value: "Date" }
          ]
        }
      ],
      // 当前数据
      dataObj: {},
      dataSetNm: "",
      groupId: "",
      arsId: "",
      datasetDisabled: true,
      option:[],
      competitorId:""
    };
  },
  methods: {
    init() {
      this.competitorId = this.$route.query.competitorId
    },
    radioChange(e) {
      console.log(e, "radioChange");
      if(e == "D5直连服务"){
        this.getSystemList();
        this.$refs.formRef.resetFields();
        // this.servForm.svcTyp = e;
        this.servForm =  {
          svcNm:"",
          svcNo:"",
          svcDesc:"",
          systemCode:"",
          dataSetNm:this.infoData?.dataSetNm
        }
        this.$set(this.servForm,"svcTyp",e);
        // console.log(this.servForm,"sssssss")
        // this.servForm.svcTyp = e;
      }else{
        this.$refs.formRef.resetFields();
        // this.servForm.svcTyp = e;
        this.servForm =  {
          svcNm:"",
          svcNo:"",
          svcDesc:"",
          systemCode:"",
          dataSetNm:this.infoData?.dataSetNm,
          standardSystemCode:""
        },
        this.$set(this.servForm,"svcTyp",e)
        // console.log(this.servForm,"sssssss")
        // this.servForm.svcTyp = e;
      }
      this.$emit("radioChange", e ,this.servForm);
    },

    // 版本号增减点击
    iconClick(e) {
      this.$refs.formRef.validateField(["svcVer"], valid => {
        if (!!valid) return;
        if (e == "add") {
          let list = this.servForm.svcVer.split(".");
          list[2] = Number(list[2]) + 1;
          if (list[2] > 9) {
            list[2] = 0;
            list[1] = Number(list[1]) + 1;
            if (list[1] > 9) {
              list[1] = 0;
              list[0] = Number(list[0]) + 1;
              if (list[0] > 9) return;
            }
          }
          let n = list.join(".");
          this.servForm.svcVer = n;
        } else {
          let list = this.servForm.svcVer.split(".");
          list[2] = Number(list[2]) - 1;
          if (list[2] < 0) {
            list[2] = 9;
            list[1] = Number(list[1]) - 1;
            if (list[1] < 0) {
              list[1] = 9;
              list[0] = Number(list[0]) - 1;
              if (list[0] < 1) return;
            }
          }
          let n = list.join(".");
          this.servForm.svcVer = n;
        }
      });
    },
    resetForm() {
      this.$refs.formRef && this.$refs.formRef.resetFields();
      this.servForm = {
        svcTyp: "D5自有服务",
        svcNm: "",
        svcDesc: "",
        dataSetNm: "",
        standardSystemCode:""
      };
      this.dataSetNm = "";
    },
    openDataset() {
      this.$emit("openDataset");
    },
    validateField(refName,propName){{
      this.$nextTick(()=>{
        this.$refs[refName].validateField(propName,(valid) =>{
          if(!valid) return
        })
      })
    }},
    async getSystemList(){
      // console.log("获取直连系统列表")
      const params = {
        instNo:this.competitorId
        // instNo:"BQD"
      }
      const res = await this.rpc.downloadDesign.getSystemList(params);
      this.option = res.relationSystemList;
      // console.log(res,"res========>")
    },
    changeSystem(e){
      this.option.map((item) =>{
        if(item.systemCode == e){
          this.servForm.standardSystemCode = item.standardSystemCode
        }
      })
      console.log(e,this.servForm,"changeSystem")
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_cmps_data_set_form_serv_Info {
  background: $base_white;
  padding: 20px 24px;
  .title {
    color: $theme_color;
    font-family: $font_regular;
    font-size: 14px;
    cursor: pointer;
  }
  .edit_form {
    // @include form;
    .header_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #111111;
      letter-spacing: 0;
      margin-bottom: 20px;
      // font-weight: 600;
    }
    /deep/ .dataSet {
      display: flex;
      justify-content: space-between;
      .gr10 {
        margin-right: 8px;
      }
    }
    .tips {
      width: 500px;
      position: absolute;
      left: 420px;
      top: 0px;
      height: 40px;
      line-height: 40px;
      font-family: $font_regular;
      font-size: 12px;
      color: $sec_ft_color;
      letter-spacing: 0;
    }
    ::v-deep .el-button {
      height: 32px;
      // @include large_button_common;
    }
    ::v-deep .el-form-item--small.el-form-item{
      margin-bottom: 24px;
    }
    ::v-deep .el-textarea__inner{
      height: 80px;
    }
    ::v-deep .el-select{
      width: 100%;
    }
    // /deep/ .el-input {
    //   width: 400px;
    // }
    .no_before {
      ::v-deep .el-form-item__label::before {
        content: "";
      }
    }
  }
  .form_item_flex {
    display: flex;
    .icon_right {
      margin-left: 5px;
      display: flex;
      flex-flow: column;
      font-size: 21px;
      i {
        cursor: pointer;
        line-height: 20px;
      }
    }
  }
  ::v-deep .el-form-item__label {
    width: 106px !important;
  }
  ::v-deep .el-form-item__content {
    margin-left: 106px !important;
  }
}
</style>
