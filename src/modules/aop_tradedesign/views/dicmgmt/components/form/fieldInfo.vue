<template>
  <div class="aop_tradedesign_dic_cmps_data_set_form_field_info">
    <div class="create_content_wrapper" slot="box">
      <div class="detail_content">
        <div class="content_header nav_title">基本信息</div>
        <el-form
          :model="formData"
          :rules="rules"
          class="service_create_form"
          ref="formData"
          label-width="120px"
        >
          <div class="service_create_form_info">
            <el-form-item label="所属数据集：">
              <span class="text_style">{{ infoData.dataSetNm || formData.dataSetNm}}</span>
            </el-form-item>
             <el-form-item label="所属分段：" prop="dataSubstnNo">
              <el-select placeholder="请选择分段" v-model="formData.dataSubstnNo" @change="changeSub">
              <el-option
                v-for="(item) in subOption"
                :key="item.dataSubstnNo"
                :label="item.dataSubstnNm"
                :value="item.dataSubstnNo"
              ></el-option>
            </el-select>
            </el-form-item>
            <!-- <el-form-item label="所属分段">
              <span class="text_style">{{ infoData.dataSubstnNm || formData.dataSubstnNm }}</span>
            </el-form-item> -->
            <el-form-item label="英文名称：" prop="dictryNo">
              <el-input
                v-model.trim="formData.dictryNo"
                clearable
                placeholder="请输入英文名称"
                show-word-limit
                :disabled="editDisabled"
              >
              </el-input>
              <el-button class="" :disabled="editDisabled" type="primary" @click="showSelectDialog"
                >从元数据中选择</el-button
              >
            </el-form-item>
            <el-form-item label="字段名称：" prop="dictryNm">
              <el-input
                v-model.trim="formData.dictryNm"
                clearable
                maxlength="100"
                placeholder="请输入字段名称"
              >
              </el-input>
            </el-form-item>
      
            <el-form-item label="字段类型：" prop="dictryTyp">
              <el-select
                v-model="formData.dictryTyp"
                placeholder="请选择字段类型"
                clearable
                @change="change"
              >
                <el-option
                  v-for="item in selectVal"
                  :label="item.type"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="最大长度："
              prop="dictryLength"
              class=""
              v-if="
                formData.dictryTyp != 'List' && formData.dictryTyp != 'Object'
              "
            >
              <el-input
                v-model.trim="formData.dictryLength"
                clearable
                placeholder="请输入最大长度"
              />
              <el-tag
                size="small"
                type="warning"
                v-show="
                  ['double', 'float', 'Double', 'Float', 'BigDecimal'].indexOf(
                    formData.dictryTyp
                  ) != -1
                "
                >格式：最大长度,精度。如20,2</el-tag
              >
            </el-form-item>

            <el-form-item label="枚举值：" class="no_before" v-if="showEnum">
              <div class="enum">
                <Enumerate ref="enumRef"></Enumerate>
              </div>
            </el-form-item>

            <el-form-item label="字段描述：" prop="dictryDescr" class="no_before">
              <el-input
                type="textarea"
                :rows="3"
                maxlength="500"
                placeholder="请输入字段描述"
                v-model="formData.dictryDescr"
                clearable
              >
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <PageFooter slot="footer">
      <div slot="box">
        <el-button @click="handleCancel">返 回</el-button>
        <el-button type="primary" @click="preservation">提 交</el-button>
      </div>
    </PageFooter>
    <!-- 从字段池中选择 -->
    <SelectFromMateData ref="selectFromMateDataRef" @confirmData="confirmData"></SelectFromMateData>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import validate from "@m/utils/validate";
import PageFooter from "@m/core/components/page_footer";
import DictionarySelect from "./components/select";
import Enumerate from "./components/enumerateData";
// import Rule from "./components/rule";
// import ServList from "./components/servList";
// import DicExampleList from "./components/dicExampleList";
import { 
  enumCondition
} from "@m/utils/enumCondition";
import DictionaryPublic from "./components/public";
import SelectFromMateData from "../dialog/selcFromMateData";
export default {
  mixins: [mixin],
  components: {
    PageFooter,
    DictionarySelect,
    Enumerate,
    // Rule,
    DictionaryPublic,
    // DicExampleList,
    // ServList,
    SelectFromMateData
  },
  props: {
    type: {
      type: String,
      default: "read",
    },
    // 数据集信息
    infoData: {
      type: String,
      default: () => {},
    },
    backType: {
      type: String,
      default: "",
    },
  },
  computed: {
    showEnum() {
      return enumCondition(this.formData.dictryTyp)
    }
  },
  data() {
    return {
      dictryId: "",
      servList: [],
      iInputList: [],
      // 添加输入参数列表参数
      iInputListTable: [
        {
          prop: "dictryNo",
          label: "参数名称",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryNm",
          minWidth: "30%",
          label: "参数中文名称",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryDescr",
          label: "参数描述",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        // {
        //   prop: "dictryGategName",
        //   label: "所属分类",
        //   minWidth: "20%",
        //   type: "text",
        // },
        {
          prop: "dictryTyp",
          filter: "paraTyp",
          label: "参数类型",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryLength",
          label: "最大长度",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryRule",
          label: "验证规则",
          minWidth: "30%",
          type: "text",
          operate: "read",
          tooltip: true,
        },
        {
          label: "操作",
          type: "button",
          width: "50",
          buttonList: [
            {
              desc: "删除",
              operate: "delete",
            },
          ],
        },
      ],
      // 导航栏参数
      breadcrumbs: [
        {
          label: "数据字典管理",
          operate: "list",
        },
        {
          label: "编辑数据字典",
        },
      ],
      selectVal: [
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
        { type: "Date", value: "Date" },
      ],
      // 表单数据
      formData: {
        dictryNo: "", // 参数名称
        dictryNm: "", // 参数中文名称
        dictryKeyWord: "", // 关键字
        dictryEnglishFullName: "", // 英文名字全称
        dictryDescr: "", // 参数描述
        dictryTyp: "String", // 参数类型
        dictryLength: "", // 最大长度
        dataSubstnNo:"",
        dataSubstnNm:""
      },
      //服务资产基本信息绑定的验证规则
      rules: {
        dictryNo: [
          {
            required: true,
            trigger: "blur",
            message: "请输入英文名称",
          },
          {
            required: true,
            trigger: "blur",
            validator: this.validator,
          },
        ],
        dictryNm: [
          {
            required: true,
            trigger: "blur",
            message: "请输入字段名称",
          },
          {
            required: true,
            trigger: "blur",
            message: "请输入中文",
            validator: validate.containChinese,
          },
        ],
        dictryKeyWord: [
          {
            required: true,
            trigger: "blur",
            message: "请输入关键字",
          },
        ],
        dictryEnglishFullName: [
          {
            required: true,
            trigger: "blur",
            message: "请输入英文名字全称",
          },
          {
            required: true,
            trigger: "blur",
            message: "请输入英文",
            validator: validate.isEnglish,
          },
        ],
        dictryTyp: [
          { required: true, trigger: "change", message: "请选择参数类型" },
        ],
        dataSubstnNo: [
          { required: true, trigger: "change", message: "请选择所属分段" },
        ],
        dictryLength: [
          { required: true, trigger: "blur", message: "请输入最大长度", },
          { required: true, trigger: "blur", validator: this.validator },
        ],
      },
      // 所属分类列表
      dictGategList: [],
      // 数据字典选择弹框
      dictionaryDialogVisible: false,
      // 公共数据字典选择
      publicDialogVisible: false,

      // 判断是否从公共数据字典过来
      type: "",
      dialogVisible: false,
      subOption:[],
      javaKeyWord: [
        "private",
        "protected",
        "public",
        "abstract",
        "class",
        "extends",
        "final",
        "implements",
        "interface",
        "native",
        "new",
        "static",
        "strictfp",
        "synchronized",
        "transient",
        "volatile",
        "break",
        "case",
        "continue",
        "default",
        "do",
        "else",
        "for",
        "if",
        "instanceof",
        "return",
        "switch",
        "while",
        "assert",
        "catch",
        "finally",
        "throw",
        "throws",
        "try",
        "import",
        "package",
        "boolean",
        "byte",
        "char",
        "double",
        "float",
        "int",
        "long",
        "short",
        "super",
        "this",
        "void",
        "goto",
        "const",
        "null",
        "true",
        "false",
      ],
      typeAdd:"",
      editDisabled:false,
      beltLine:""
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    showFiledDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.$refs.formData.resetFields();
      this.dialogVisible = false;
    },
    async getSubOption() {
      const params = {
        dataSetNo: this.infoData.dataSetNo,
        turnPageShowNum:"99999"
      };
      const res = await this.rpc.dicmgmt.getSubStnList(params);
      this.subOption = res.dataSubsectionList;
      // this.$nextTick(()=>{
      //   this.formData.dataSubstnNo = this.subObj.dataSubstnNo;
      // })
      // this.formData.dataSubstnNo = this.subObj.dataSubstnNo;
    },
    showSelectDialog() {
      this.$refs.selectFromMateDataRef.showDialog()
    },
    change(e){
      this.$nextTick(() =>{
        this.$refs.formData.validateField("dictryNo")
      })
    },
    showDialog(type, data) {
      if (type == "enumerate") {
        this.$refs.enumRef.dialogTitle = "添加枚举";
        this.$refs.enumRef.enumerateValueVisible = true;
      } else if (type == "rule") {
        this.$refs.ruleRef.addRuleGetList();
        this.$refs.ruleRef.getRuleClassification();
        this.$refs.ruleRef.dialogTitle = "配置验证规则";
        this.$refs.ruleRef.addRuleDialogVisible = true;
      }
    },
    async validator(rule, value, callback) {
      if (rule.field == "dictryLength") {
        if (
          this.formData.dictryTyp == "List" ||
          this.formData.dictryTyp == "Object"
        ) {
          callback();
        } else if (
          ["double", "float", "Double", "Float", "BigDecimal"].indexOf(
            this.formData.dictryTyp
          ) != -1
        ) {
          const reg = /^([1-9][0-9]*)(,([1-9][0-9]*))$/;
          if (value && !reg.test(value)) callback(new Error("格式错误"));
          const lengthNum = value.split(",");
          if (lengthNum[0] * 1 < lengthNum[1] * 1)
            callback(new Error("最大长度不能小于精度长度"));
          else callback();
        } else {
          const reg = /^[0-9]*$/;
          if (value && !reg.test(value)) {
            callback(new Error("请输入数字"));
          } else {
            callback();
          }
        }
      } else if (rule.field == "dictryNo") {
        const reg = /^[a-zA-Z]+[0-9]*$/; //字母
        const regList = /^[a-zA-Z]+List$/;
        if(value == "" || value && !reg.test(value)){
          callback(new Error("请输入英文开头或数字结尾。例如:错误输入A6A、A6A6"))
        }else{
          // if(this.formData.dictryTyp == "List" || this.formData.dictryTyp == "Object"){
          //   if(this.javaKeyWord.includes(value)){
          //     callback(new Error("字段类型为List、Object,字段英文名称不能是Java关键字"))
          //   }else{
          //     callback();
          //   }
          // }else{
          //   callback();
          // }
          if(this.formData.dictryTyp == "List"){
            if(!regList.test(value)){
              callback(new Error("字段类型为List,字段英文名称只能以英文开头，List结尾"))
            }else{
              callback()
            }
          }else if(this.formData.dictryTyp == "Object"){
            if(this.javaKeyWord.includes(value)){
              callback(new Error("字段类型为Object,字段英文名称不能是Java关键字"))
            }else{
              callback()
            }
          }else{
            callback()
          }
        }
      }
    },
    operate(operation, data) {
      if (operation == "delete") {
        this.iInputList = this.iInputList.filter(
          (item) => item.dictryId != data.dictryId
        );
      }
    },
    // 所属分类选择框变化时
    async handleDictryGategChange() {
      if (this.formData.dictryNo) {
        this.$refs.formData.validateField("dictryNo");
      }
    },
    // 添加子参数
    addSonParams() {
      console.log(this.dictGategList);
      this.dictionaryDialogVisible = true;
    },
    // 数据字典选择弹框取消
    dictionaryCloseDialog() {
      this.dictionaryDialogVisible = false;
    },
    setDictChildList(data) {
      this.iInputList = setSerialNumber(
        unduplicated(this.iInputList.concat(data), "dictryId")
      );
      this.dictionaryCloseDialog();
    },
    // 从公共数据字典选择
    publicCloseDialog() {
      this.publicDialogVisible = false;
    },
    // 获取所属分类列表
    async getTypeList() {
      const params = { turnPageShowNum: "0" };
      if (!this.sysId) {
        params.excludeClsfId = "10000000";
      }
      const res = await this.rpc.dictionary.getClassifyTypeList(params);
      this.dictGategList = res.serviceList;
    },
    changeSub(val){
      console.log(val,'-----')
      let tempList = this.subOption.filter(item =>item.dataSubstnNo == val)
      this.formData.dataSubstnNm = tempList[0].dataSubstnNm;
    },
    // 创建数据字典
    async addDictionary() {
      const params = JSON.parse(JSON.stringify(this.formData).replace(/dictryId/g,"dataSetDictId"));
      let flag = false;
      
      if(enumCondition(params.dictryTyp)){
        const enumerateValueList = this.$refs.enumRef.enumerateValueList;
        if(enumerateValueList.length > 0){
          flag = enumerateValueList.some(item =>item.key =="" || item.value =="")
          console.log("flag",flag)
          params.dictryEnum = enumerateValueList.reduce((pre, item, index) => {
            return `${pre}${item.key}-${item.value}${
              index == enumerateValueList.length - 1 ? "" : ","
            }`;
          }, "");
        }
      }else{
        params.dictryEnum = ""
      }
      if(flag) return this.$message.error("添加的枚举值表格需补充完整信息或删除不完整信息的行")
      params.dataSetNo = this.infoData.dataSetNo
      // // 从字段池选择时的传参
      // const addParams = {
      //   dictId: this.dictryId,
      //   dataSetNo: this.infoData.dataSetNo,
      //   dataSubstnNo:this.infoData.dataSubstnNo
      // }
      if(this.type == "add") params.beltLine = this.beltLine
      console.log("参数",this.formData,params,this.type)
      const api = this.type == "edit" ? "editMyField" : "addMyField"
      const res = await this.rpc.dicmgmt[api](params);
      this.$notify({
        title: "成功",
        message: "成功",
        duration: 2000,
        type: "success",
      });
      this.handleCancel()
    },
    handleCancel() {
      console.log("backType",this.backType)
      if(["add","edit"].includes(this.backType)) {
        this.$router.push({
            path: "/aop_tradedesign/dicmgmt/editDataSet",
            query: {
              dataSetNo: this.infoData.dataSetNo,
            },
          });
      }else {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editSubstn",
          query: {
            dataSetNo: this.infoData.dataSetNo,
            dataSubstnNo: this.infoData.dataSubstnNo,
          },
        });
      }
    },
    // 点击确定按钮
    preservation() {
      this.$refs.formData.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
          // 创建数据字典
          this.addDictionary();
      });
    },
    //判断是否有子参数
    dicGetNodeId(arrs, id) {
      arrs.forEach((item, i) => {
        if (item.children.length > 0) {
          item.serialNumber = id ? id + "." + (i + 1) : i + 1 + "";
          this.dicGetNodeId(item.children, item.serialNumber);
        } else {
          item.serialNumber = id ? id + "." + (i + 1) : i + 1 + "";
          delete item.children;
        }
      });
    },
    confirmData(e) {
      this.dictryId = e.dictryId
      this.getDictionaryInfoById(e.dictryId, "confirmPublic")
    },
    // 进入编辑页面时查询详情
    async getDictionaryInfoById (e, operation) {
      console.log("88", e, operation)
      const params = {
        dictryId: e,
      }
      const res = await this.rpc.dicmgmt.editList(params)
      this.formData.dictryNo = res.dictryNo
      this.formData.dictryNm = res.dictryNm
      this.formData.dictryKeyWord = res.dictryKeyWord.replace(
        /(^\s*)|(\s*$)/g,
        ""
      ) // 去除前后空格
      this.formData.dictryEnglishFullName = res.dictryEnglishFullName
      this.formData.dictryDescr = res.dictryDescr
      this.formData.dictryTyp = res.dictryTyp
      this.formData.dictryLength = res.dictryLength
      this.dicGetNodeId(res.dictChildList)
      this.iInputList = JSON.parse(JSON.stringify(res.dictChildList))
      if (enumCondition(res.dictryTyp)) {
        if (res.dictryEnum) {
          this.$refs.enumRef.enumerateValueList = res.dictryEnum
            .split(";")
            .map((item) => {
              const arr = item.split("-")
              return {
                key: arr[0],
                value: arr[1],
              }
            })
        }
      }
      console.log("查详情", e, operation, this.formData, res)
    },
    //初始化
    init() {
      this.getSubOption();
      this.typeAdd = this.$route.query.type || "";
      this.beltLine = this.$route.query.beltLine || "";
      console.log(this.beltLine,"------")
      if(["edit","editSubstn"].includes(this.typeAdd)) this.editDisabled = true
      else this.editDisabled = false
      this.$nextTick(() =>{
        this.$refs.enumRef.resetTableData();
      })
      if(["add","addSubstn"].includes(this.typeAdd)) this.formData.dataSubstnNo = this.infoData.dataSubstnNo
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_cmps_data_set_form_field_info {
  .create_content_wrapper {
    padding: 16px 24px;
    .detail_content {
      position: relative;
      background: $base_white;
      padding: 0 24px 24px;
      min-height: 78.5vh;
      .content_header {
        // padding: 20px 30px 0;
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
      }
      .service_create_form {
        margin-top: 32px;
        // @include form(".service_create_form_info");
        .create_form_tips {
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
          @include large_button_common;
        }
      }
      .service_create_form_info {
        padding: 0px 30px 0;
        .no_before ::v-deep.el-form-item__label::before {
          content: "";
        }
        .add_params_button {
          font-size: 14px;
          border-radius: 2px;
          cursor: pointer;
          padding: 0 8px;
          letter-spacing: 0;
          text-align: center;
          font-family: PingFangSC-Regular;
          height: 40px;
        }
      }
    }
    .table_class {
      ::v-deep tr td {
        &:nth-child(1) {
          .cell {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
  .input_textarea {
    position: absolute;
    top: 20px;
    left: 30px;
    width: 1000px;
    height: 500px;
  }
  ::v-deep .table_style .el-radio__label {
    display: none;
  }

  .dialog {
    ::v-deep .service_top {
      padding: 0;
    }
  }
  ::v-deep .el-dialog__wrapper {
    overflow: hidden;
  }
  .table_class ::v-deep.el-table tr {
    height: 75px;
  }
  .table_class ::v-deep.input_error .el-input__inner {
    border-color: #f56c6c;
  }
  .table_style {
    margin-top: 16px;
    ::v-deep .el-table th {
      line-height: 0;
      color: $sec_ft_color;
    }
  }
  .text_style {
    font-family: $font_medium;
    color: $pri_ft_color;
    letter-spacing: 0;
  }
  .service_create_form{
    /deep/ .el-input,
    /deep/ .el-textarea__inner {
      width: 584px;
    }
    /deep/ .el-textarea__inner{
      height: 80px;
    }
  }
  .enum{
    width: 584px;
  }
}
</style>