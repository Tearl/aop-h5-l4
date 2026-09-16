<template>
  <div class="aop_workgate_comps_dicmgmt_dic_form_select">
    <PageDialog
      dialogTitle="新增元数据"
      :dialogVisiable="dialogVisible"
      dialogWidth="1000px"
      @closeDialog="closeDialog"
      class="dialog"
      :apTobody="true"
      :customClass="'customClass_addField'"
    >
      <div slot="box">
        <el-form
          :model="formData"
          :rules="rules"
          class="edit_form"
          ref="formData"
          label-width="120px"
          size="small"
        >
          <div class="service_create_form_info">
            <!-- <el-form-item label="所属数据集：">
              <span class="text_style">{{
                datasetInfo.dataSetNm || formData.dataSetNm
              }}</span>
            </el-form-item>
            <el-form-item label="所属分段：" prop="dataSubstnNo">
              <el-select placeholder="请选择分段" v-model="formData.dataSubstnNo">
              <el-option
                v-for="(item) in subOption"
                :key="item.dataSubstnNo"
                :label="item.dataSubstnNm"
                :value="item.dataSubstnNo"
              ></el-option>
            </el-select>
            </el-form-item> -->
            <el-form-item label="参数名称："  prop="dictryNo">
              <el-input
                v-model.trim="formData.dictryNo"
                clearable
                maxlength="50"
                placeholder="请输入参数名称"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="参数中文名称：" prop="dictryNm">
              <el-input
                v-model="formData.dictryNm"
                clearable
                placeholder="请输入参数中文名称"
                maxlength="15"
              >
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="参数中文名称" prop="dictryNm">
              <el-input
                v-model="formData.dictryNm"
                clearable
                maxlength="100"
                placeholder="请输入参数中文名称"
              >
              </el-input>
            </el-form-item> -->
            <el-form-item label="关键字：" class="no_before">
              <el-input
                v-model="formData.dictryKeywd"
                clearable
                maxlength="100"
                placeholder="请输入关键字"
              >
              </el-input>
              <el-tag size="small" type="warning">多个关键字用空格隔开</el-tag>
            </el-form-item>
            <el-form-item label="英文名字全称：" class="no_before">
              <el-input
                v-model="formData.dictryEnm"
                clearable
                maxlength="100"
                placeholder="请输入英文名字全称"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="参数描述："
              prop="dictryDescr"
              class="no_before"
            >
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入参数描述"
                v-model="formData.dictryDescr"
                clearable
                maxlength="500"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="参数类型：" prop="dictryTyp">
              <el-select
                v-model="formData.dictryTyp"
                placeholder="请选择参数类型"
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
              v-if="
                formData.dictryTyp != 'List' && formData.dictryTyp != 'Object'
              "
            >
              <el-input
                v-model="formData.dictryLength"
                clearable
                placeholder="请输入最大长度"
                maxlength="50"
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

            <el-form-item
              label="子参数列表"
              class="no_before"
              v-show="
                (formData.dictryTyp == 'List' ||
                  formData.dictryTyp == 'Object') 
              "
            >
              <el-button
                class="add_params_button"
                icon="el-icon-plus"
                type="primary"
                @click="addSonParams"
                >添加子参数</el-button
              >
              <Table
                class="table_style"
                :data="iInputList"
                :table="iInputListTable"
                rowK="serialNumber"
                :cellStyle="dictListCellStyle"
                @operate="operate"
              ></Table>
            </el-form-item>

            <!-- <el-form-item
              label="枚举值"
              class="no_before"
              v-show="formData.dictryTyp == 'String' && type == 'edit'"
            >
            </el-form-item> -->

            <!-- <el-form-item
              label="验证规则"
              class="no_before"
              v-show="formData.dictryTyp == 'String' && type == 'edit'"
            >
              <Rule
                ref="ruleRef"
                :bizType="pageMode"
                @showDialog="showDialog"
              ></Rule>
            </el-form-item> -->
            <!-- <el-form-item
              label="示例列表"
              class="no_before"
              v-show="type == 'edit'"
            >
              <DicExampleList :bizType="pageMode"></DicExampleList>
            </el-form-item> -->
            <!-- <el-form-item
              label="L5服务"
              class="no_before"
              v-show="type == 'edit'"
            >
              <ServList
                bizType="read"
                :servList="servList"
                :infoData="infoData"
                :type="type"
              ></ServList>
            </el-form-item> -->
          </div>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </PageDialog>
    <SelectFromData ref="selectFromDataRef" @confirmData="confirmData"></SelectFromData>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import filters from "@m/utils/filters";
import SelectFromData from "./selcFromData";
import validate from "@m/utils/validate";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    SelectFromData
  },
  props: {
    dictGategList: {
      type: Array,
      default: () => false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      dictryId: "",
      servList: [],
      iInputList: [],
      iInputListTable: [
        {
          prop: "dictryNo",
          label: "参数名称",
          // minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryNm",
          // minWidth: "30%",
          label: "参数中文名称",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryDescr",
          label: "参数描述",
          // minWidth: "30%",
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
          // minWidth: "15%",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryLength",
          label: "最大长度",
          // minWidth: "15%",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryRule",
          label: "验证规则",
          // minWidth: "30%",
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
        dictryEnm:"",
        dataSubstnNo:""
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
            message: "请输入包含中文的字段名称",
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
          { required: true, trigger: "blur", message: "请选择字段类型" },
        ],
        // dictryGateg: [
        //   { required: true, trigger: "change", message: "请选择所属分类" },
        // ],
        dictryLength: [
          { required: true, trigger: "blur", validator: this.validator },
          // { required: true, trigger: "blur", message: "请输入最大长度" },
        ],
      },
      // 所属分类列表
      dictGategList: [],
      // 数据字典选择弹框
      dictionaryDialogVisible: false,
      // 公共数据字典选择
      publicDialogVisible: false,

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
    };
  },
  methods: {
    showDialog(e) {
      this.dialogVisible = true;
      this.iInputList = [];
      this.formData = {
        dictryNo: "", // 参数名称
        dictryNm: "", // 参数中文名称
        dictryKeyWord: "", // 关键字
        dictryEnglishFullName: "", // 英文名字全称
        dictryDescr: "", // 参数描述
        dictryTyp: "String", // 参数类型
        dictryLength: "", // 最大长度
        dictryEnm:"",
        dataSubstnNo:""
      }
      this.$refs.formData.resetFields();
    },
    change(e){
      this.$nextTick(() =>{
        this.$refs.formData.validateField("dictryNo")
      })
    },
    closeDialog() {
      this.dialogVisible = false;
      this.$refs.formData.resetFields();
    },
    async validator(rule, value, callback) {
      if (rule.field == "dictryLength") {
        if (
          this.formData.dictryTyp == "List" ||
          this.formData.dictryTyp == "Object"
        ) {
          // this.$refs.formData.clearValidate(["dictryLength"]);
          callback();
        } else if(!value){
          callback(new Error("请输入最大长度"));
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
        const reg = /^[a-zA-Z]+$/; //字母
        // console.log(this.javaKeyWord.includes(value),"开始")
        if(value == "" || value && !reg.test(value)){
          callback(new Error("请输入英文"))
        }else{
          // console.log(this.javaKeyWord.includes(value),value,"dictryTyp")
          if(this.formData.dictryTyp == "List" || this.formData.dictryTyp == "Object"){
            if(this.javaKeyWord.includes(value)){
              callback(new Error("字段类型为List、Object,字段英文名称不能是Java关键字"))
            }else{
              callback();
            }
          }else{
            callback();
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
    // 添加子参数
    addSonParams() {
     this.$refs.selectFromDataRef.showDialog()
    },
    // 数据字典选择弹框取消
    dictionaryCloseDialog() {
      // this.dictionaryDialogVisible = false;
    },

    confirm() {
      this.$refs.formData.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        this.addDictionary();
      });
      // this.closeDialog();
    },
    // 创建数据字典
    async addDictionary() {
      const params = Object.assign({}, this.formData);
      // let flag = false;
      // if(['String','char','byte','short','long','Character','Byte','Short','Long'].includes(params.dictryTyp)){
      //   const enumerateValueList = this.$refs.enumRef.enumerateValueList;
      //   if(enumerateValueList.length > 0){
      //     flag = enumerateValueList.some(item =>item.key =="" || item.value =="")
      //     console.log("flag",flag)
      //     params.dictryEnum = enumerateValueList.reduce((pre, item, index) => {
      //       return `${pre}${item.key}-${item.value}${
      //         index == enumerateValueList.length - 1 ? "" : ","
      //       }`;
      //     }, "");
      //   }
      // }else{
      //   params.dictryEnum = ""
      // }
      // if(flag) return this.$message.error("添加的枚举值表格需补充完整信息或删除不完整信息的行")
     
      params.dataSetNo = this.datasetInfo?.dataSetNo;
      // 从字段池选择时的传参
      const addParams = {
        dictId: this.dictryId,
        dataSetNo: this.datasetInfo?.dataSetNo,
        dataSubstnNo: this.subObj?.dataSubstnNo,
      };
      // console.log("参数", this.formData, params, addParams, this.type);
      const api = this.type == "edit" ? "editMyField" : "addMyField";
      const res = await this.rpc.dicmgmt[api](
        !this.dictryId ? params : addParams
      );
      this.$notify({
        title: "成功",
        message: "成功",
        duration: 2000,
        type: "success",
      });
      this.$emit("confirmField",this.formData);
      this.closeDialog();
    },

    confirmData(data) {
      // console.log(data,"-------")
      this.iInputList.push(...data)
    },
    // 初始化
    init() {
      // this.getList();
      // this.getClassifyTypeList()
    },
  },
  created() {
    this.init();
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_dicmgmt_dic_form_select {
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }
  .dialog {
    ::v-deep.el-dialog {
      margin-top: 3vh !important;
    }
    ::v-deep.el-dialog__body {
      max-height: 78vh;
    }
  }
  .service_top ::v-deep.serivce_top_box {
    padding: 0;
    margin: 0;
  }
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
    }
  }
}
.customClass_addField {
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }
  .dialog {
    ::v-deep.el-dialog {
      margin-top: 3vh !important;
    }
    ::v-deep.el-dialog__body {
      max-height: 78vh;
    }
  }
  .edit_form {
    // @include form;
    /deep/ .el-input,
    /deep/ .el-textarea__inner {
      width: 700px;
    }
    /deep/ .el-textarea__inner{
      height: 80px;
    }
    ::v-deep .el-form-item__label {
      width: 120px !important;
    }
    ::v-deep .el-form-item__content {
      margin-left: 120px !important;
    }
    ::v-deep .el-form-item .el-form-item__label {
      color: #333333 !important;
      font-weight: 400 !important;
    }
    // ::v-deep .el-button {
    //   @include large_button_common;
    // }
    .no_before {
      ::v-deep .el-form-item__label::before {
        content: "";
      }
    }
  }
  .service_top ::v-deep.serivce_top_box {
    padding: 0;
    margin: 0;
  }
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
    }
  }
  .table_style{
    width: 700px;
  }
}
</style>
