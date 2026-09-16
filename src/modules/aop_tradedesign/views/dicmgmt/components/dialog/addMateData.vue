<template>
  <div class="aop_tradedesign_dicmgmt_dialog_add_madeData">
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
            <el-form-item label="参数名称：" prop="dictryNo">
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
                v-model.trim="formData.dictryNm"
                clearable
                placeholder="请输入参数中文名称"
                maxlength="15"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="字段属性：" prop="attrType">
              <el-radio-group v-model="formData.attrType" @change="radioChange">
                <el-radio label="0">普通属性</el-radio>
                <el-radio label="1">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="验证规则："
              prop="ruleId"
              v-show="formData.attrType == '1'"
            >
              <el-select
                v-model="formData.ruleId"
                placeholder="请选择验证规则"
                @change="changeRule"
              >
                <el-option
                  v-for="item in ruleTableData"
                  :label="item.ruleNm"
                  :key="item.ruleId"
                  :value="item.ruleId"
                ></el-option>
              </el-select>
            </el-form-item>
            <div v-show="formData.attrType == '0' || chooseRule">
              <el-form-item label="关键字：" class="no_before">
                <el-input
                  v-model="formData.dictryKeyWord"
                  clearable
                  maxlength="100"
                  placeholder="请输入关键字"
                >
                </el-input>
                <el-tag size="small" type="warning"
                  >多个关键字用空格隔开</el-tag
                >
              </el-form-item>
              <el-form-item label="英文名字全称：" class="no_before">
                <el-input
                  v-model.trim="formData.dictryEnglishFullName"
                  clearable
                  maxlength="100"
                  placeholder="请输入英文名字全称"
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
                  v-model.trim="formData.dictryLength"
                  clearable
                  placeholder="请输入最大长度"
                  maxlength="50"
                />
                <el-tag
                  size="small"
                  type="warning"
                  v-show="
                    [
                      'double',
                      'float',
                      'Double',
                      'Float',
                      'BigDecimal',
                    ].indexOf(formData.dictryTyp) != -1
                  "
                  >格式：最大长度,精度。如20,2</el-tag
                >
              </el-form-item>
              <el-form-item
                label="枚举值："
                class="no_before"
                v-if="showEnum"
              >
                <Enumerate ref="enumRef"></Enumerate>
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

              <el-form-item
                label="子参数列表"
                class="no_before"
                v-show="
                  formData.dictryTyp == 'List' || formData.dictryTyp == 'Object'
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
            </div>
          </div>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </PageDialog>
    <!-- 从字段池中选择 -->
    <SelectFromData ref="selectRef" @confirmData="confirmData"></SelectFromData>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import { unduplicated, setSerialNumber } from "@m/utils/array";
import filters from "@m/utils/filters";
import validate from "@m/utils/validate";
import Enumerate from "./enumerate";
import { 
  enumCondition
} from "@m/utils/enumCondition";
import SelectFromData from "./selcFromData";
export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    Enumerate,
    SelectFromData,
  },
  props: {
    dictGategList: {
      type: Array,
      default: () => false,
    },
    type: {
      type: String,
      default: "read",
    },
    // 数据集信息
    datasetInfo: {
      type: Object,
      default: () => ({}),
    },
    //分段信息
    subObj: {
      type: Object,
      default: () => ({}),
    },
    backType: {
      type: String,
      default: "",
    },
  },
  computed: {
    showEnum() {
      return enumCondition(this.formData.dictryTyp)
    },
    selectVal() {
      if (this.formData.ruleId == "") {
        return [
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
        ];
      } else {
        return [
          { type: "String", value: "String" },
          { type: "File", value: "File" },
          // { type: "List", value: "List" },
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
          // { type: "Object", value: "Object" },
          { type: "Date", value: "Date" },
        ];
      }
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
      // selectVal: [
      //   { type: "String", value: "String" },
      //   { type: "File", value: "File" },
      //   { type: "List", value: "List" },
      //   { type: "boolean", value: "boolean" },
      //   { type: "char", value: "char" },
      //   { type: "int", value: "int" },
      //   { type: "byte", value: "byte" },
      //   { type: "short", value: "short" },
      //   { type: "long", value: "long" },
      //   { type: "float", value: "float" },
      //   { type: "double", value: "double" },
      //   { type: "Boolean", value: "Boolean" },
      //   { type: "Character", value: "Character" },
      //   { type: "Integer", value: "Integer" },
      //   { type: "Byte", value: "Byte" },
      //   { type: "Short", value: "Short" },
      //   { type: "Long", value: "Long" },
      //   { type: "Float", value: "Float" },
      //   { type: "Double", value: "Double" },
      //   { type: "BigDecimal", value: "BigDecimal" },
      //   { type: "Object", value: "Object" },
      //   { type: "Date", value: "Date" },
      // ],
      // 表单数据
      formData: {
        dictryNo: "", // 参数名称
        dictryNm: "", // 参数中文名称
        dictryKeyWord: "", // 关键字
        dictryEnglishFullName: "", // 英文名字全称
        dictryDescr: "", // 参数描述
        dictryTyp: "String", // 参数类型
        dictryLength: "", // 最大长度
        dictryEnm: "",
        dataSubstnNo: "",
        attrType: "0", //字段属性
        ruleId: "", //验证规则
        // dictryGateg: "10000001", // 所属分类
      },
      //服务资产基本信息绑定的验证规则
      rules: {
        dictryNo: [
          {
            required: true,
            trigger: "blur",
            message: "请输入参数名称",
          },
          {
            required: true,
            trigger: "blur",
            validator: this.validator,
          },
          // {
          //   required: true,
          //   trigger: "blur",
          //   validator: this.validator,
          // },
        ],
        dictryNm: [
          {
            required: true,
            trigger: "blur",
            message: "请输入参数中文名称",
          },
          {
            required: true,
            trigger: "blur",
            message: "请输入包含中文的参数名称",
            validator: validate.containChinese,
          },
          // {
          //   required: true,
          //   trigger: "blur",
          //   validator: this.validator,
          // },
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
        dictryGateg: [
          { required: true, trigger: "change", message: "请选择所属分类" },
        ],
        dictryLength: [
          { required: true, trigger: "blur", validator: this.validator },
          // { required: true, trigger: "blur", message: "请输入最大长度" },
        ],
        ruleId: [
          // { required: true, trigger: "blur", message: "请选择验证规则" },
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
      subOption: [
        // { label: "分段1", value: "01" },
        // { label: "分段2", value: "02" },
        // { label: "分段3", value: "03" },
        // { label: "分段4", value: "04" },
        // { label: "分段5", value: "05" },
      ],
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
      chooseRule: false,
      ruleTableData: [],
      beltLine: "",
      ruleList: [],
    };
  },
  methods: {
    showAddDialog() {
      this.dialogVisible = true;
      this.getRuleList();
      this.getTypeList();
      this.$nextTick(() => {
        // this.$refs.enumRef.resetTableData();
      });
      // console.log("datasetInfo",this.datasetInfo,this.subInfo,this.fieldInfo)
    },
    radioChange(e) {
      if (e == "1") {
        this.rules.ruleId = [
          { required: true, trigger: "blur", message: "请选择验证规则" },
        ];
        this.formData.dictryTyp = "String"
      } else {
        this.rules.rule = [];
        this.formData.ruleId = "";
      }
    },
    changeRule(val) {
      this.chooseRule = true;
      let ruleList = this.ruleTableData.filter((item) => item.ruleId == val);
      this.ruleList.push(...ruleList);
      console.log(val, ruleList, "val");
      if (this.formData.ruleId !== "") {
        this.formData.dictryTyp = "String"
      }
    },
    change(e) {
      this.$nextTick(() => {
        this.$refs.formData.validateField("dictryNo");
      });
    },
    // 获取迁移数据列表
    async getRuleList() {
      const data = {
        qCondition: "",
        paraClassifyId: "",
        currentPage: 1,
        turnPageShowNum: "99999",
      };
      const res = await this.rpc.systemmgmt.getRuleList(data);
      this.ruleTableData = res.ruleDefinedInfoPageList;
    },
    async getDetail() {
      const params = {
        dataSetDataId: this.fieldInfo.dataSetDataId,
      };
      const res = await this.rpc.dicmgmt.getMyFieldDetail(params);
      // console.log("getDetail", res);
      this.formData = res;
      this.servList = res.apiList;
      // this.$refs.baseRef.formData = res;
      // this.$refs.baseRef.servList = res.apiList
    },
    closeDialog() {
      this.$refs.formData.resetFields();
      this.dialogVisible = false;
      this.formData = {
        dictryNo: "", // 参数名称
        dictryNm: "", // 参数中文名称
        dictryKeyWord: "", // 关键字
        dictryEnm: "", // 英文名字全称
        dictryDescr: "", // 参数描述
        dictryTyp: "String", // 参数类型
        dictryLength: "", // 最大长度
        attrType: "0", //字段属性
        ruleId: "", //验证规则
        dictryEnglishFullName: "", //英文名字全称
        // dictryGateg: "10000001", // 所属分类
      };
      this.iInputList.splice(0, this.iInputList.length);
      this.$refs.enumRef.resetTableData();
      this.chooseRule = false;
      // this.iInputList = [];
    },
    showSelectDialog() {
      this.$refs.selectRef.showDialog();
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
          // this.$refs.formData.clearValidate(["dictryLength"]);
          callback();
        } else if (!value) {
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
        const reg = /^[a-zA-Z]+[0-9]*$/;
        const regList = /^[a-zA-Z]+List$/;
        if(value == "" || value && !reg.test(value)){
          callback(new Error("请输入英文开头或数字结尾。例如:错误输入A6A、A6A6"))
        }else{
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
      } else if (rule.field == "dictryNm") {
        // if (this.formData.dictryNo) {
        //   const params = {
        //     dictryNm: this.formData.dictryNm,
        //   };
        //   const res = await this.rpc.systemmgmt.duplicateChenck(params);
        //   if (res.result == "2") {
        //     callback("中文名称重复，请重新输入");
        //   }
        // }
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
      this.$refs.selectRef.showDialog();
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
      let flag = false;
      if (
        [
          "String",
          "char",
          "byte",
          "short",
          "long",
          "Character",
          "Byte",
          "Short",
          "Long",
        ].includes(params.dictryTyp)
      ) {
        const enumerateValueList = this.$refs.enumRef.enumerateValueList;
        if (enumerateValueList.length > 0) {
          flag = enumerateValueList.some(
            (item) => item.key == "" || item.value == ""
          );
          params.dictryEnum = enumerateValueList.reduce((pre, item, index) => {
            return `${pre}${item.key}-${item.value}${
              index == enumerateValueList.length - 1 ? "" : ";"
            }`;
          }, "");
        }
      } else {
        params.dictryEnum = "";
      }
      if (params.attrType == "1") {
        params.ruleList = this.ruleList;
      }
      if (["List", "Object"].includes(params.dictryTyp)) {
        params.dictryLength = "";
      }
      params.dictChildList = this.iInputList || [];
      params.beltLine = this.beltLine;
      if (flag)
        return this.$message.error(
          "添加的枚举值表格需补充完整信息或删除不完整信息的行"
        );
      console.log(params, "参数");
      const res = await this.rpc.systemmgmt.addPublicDictionary(params);
      this.$notify({
        title: "成功",
        message: "成功",
        duration: 2000,
        type: "success",
      });
      this.$emit("confirmMate");
      this.closeDialog();
    },
    handleCancel() {
      console.log("backType", this.backType);
      if (this.backType == "dataset") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editDataSet",
          query: {
            dataSetNo: this.infoData.dataSetNo,
          },
        });
      } else {
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
    confirmData(data) {
      this.iInputList = setSerialNumber(
        unduplicated(this.iInputList.concat(data), "dictryId")
      );
    },
    // 进入编辑页面时查询详情
    async getDictionaryInfoById(e, operation) {
      console.log("88", e, operation);
      const params = {
        dictryId: e,
      };
      const res = await this.rpc.dicmgmt.editList(params);
      this.formData.dictryNo = res.dictryNo;
      this.formData.dictryNm = res.dictryNm;
      this.formData.dictryKeyWord = res.dictryKeyWord.replace(
        /(^\s*)|(\s*$)/g,
        ""
      ); // 去除前后空格
      this.formData.dictryEnglishFullName = res.dictryEnglishFullName;
      this.formData.dictryDescr = res.dictryDescr;
      this.formData.dictryTyp = res.dictryTyp;
      this.formData.dictryLength = res.dictryLength;
      this.dicGetNodeId(res.dictChildList);
      this.iInputList = JSON.parse(JSON.stringify(res.dictChildList));
      if (res.dictryTyp == "String") {
        if (res.dictryEnum) {
          this.$refs.enumRef.enumerateValueList = res.dictryEnum
            .split(",")
            .map((item) => {
              const arr = item.split("-");
              return {
                key: arr[0],
                value: arr[1],
              };
            });
        }
        this.$refs.ruleRef.ruleTableData = res.ruleList;
      }
      console.log("查详情", e, operation, this.formData, res);
    },
    // 初始化
    init() {
      this.beltLine = this.$route.query.beltLine || "";
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
.aop_tradedesign_dicmgmt_dialog_add_madeData {
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
      width: 520px;
    }
    /deep/ .el-textarea__inner {
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
}
</style>
