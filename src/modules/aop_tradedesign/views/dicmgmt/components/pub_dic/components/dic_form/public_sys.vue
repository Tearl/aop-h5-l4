<template>
  <div class="aop_tradedesign_comps_dicmgmt_dic_form_public">
    <!-- 公共字典数据-从应用数据字典添加 -->
    <PageDialog
      dialogTitle="公共数据字典选择"
      :dialogVisiable="dialogVisible"
      dialogWidth="70%"
      @closeDialog="handleCancel"
      class="dialog"
    >
      <div slot="box">
        <section class="d_flex_center">
          <el-radio-group v-model="radioHeader">
            <el-radio-button label="0"><p class="radio-text">从公共数据字典选择</p></el-radio-button>
            <el-radio-button label="1"><p class="radio-text">从公共数据字典新增</p></el-radio-button>
          </el-radio-group>
        </section>
        <div v-show="radioHeader == 0" class="add_dialog_conf">
          <ServiceTop
            ref="formRef"
            :serviceForm="serviceForm"
            :form="form"
            class="service_top"
          >
            <div slot="rightButton">
              <el-button
                type="primary"
                size="small"
                @click="search"
                class="right_button"
                >搜索</el-button
              >
              <el-button size="small" @click="reset" class="right_button"
                >重置</el-button
              >
            </div>
          </ServiceTop>
          <Table
            ref="dictListTableRef"
            class="table_style"
            :table="tables"
            :data="dictionaryData"
            rowK="serialNumber"
            :cellStyle="dictListCellStyle"
            :radioModel="paramsRadioModel"
            @radioChange="paramsRadioChange"
          ></Table>
          <PagePagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager="pager"
          >
          </PagePagination>
          <!-- <div class="show_conf">
            <div class="show_conf_title">
              已选择：{{ tableData && tableData.length }}个
            </div>
          </div> -->
        </div>
        <div v-show="radioHeader == 1" class="add_dialog_conf">
          <DictionaryForm
            ref="dictionaryFormRef"
            :sysId="sysId"
            @toDicList="toDicList"
            @showDialog="showDialog"
            @handleCancel="handleCancel"
            >
          </DictionaryForm>
        </div>
      </div>
      <span slot="footer">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button v-if="radioHeader == 0" type="primary" @click.native="saveParams">确 定</el-button>
        <el-button v-if="radioHeader == 1" type="primary" @click.native="createParams">确 定</el-button>
      </span>
    </PageDialog>

    <!-- 选择参数弹窗 -->
    <DictionaryPublic
      ref="dictionaryPublicRef"
      :dialogVisible="publicDialogVisible"
      @closeDialog="publicCloseDialog"
      @confirmParams="confirmParams"
    >
    </DictionaryPublic>

    <!-- 选择枚举值弹窗 -->
    <PageDialog
      :dialogTitle="dialogTitle"
      :dialogVisiable="enumerateValueVisible"
      dialogWidth="56.3%"
      @closeDialog="closeDialog('enumerateEdit')"
    >
      <div slot="box" class="box">
        <el-form
          :model="enumerateValueForm"
          :rules="enumerateValueRules"
          ref="enumerateValueFormRef"
          label-width="100px"
          class="form"
        >
          <el-form-item label="枚举值" prop="enumerateValue">
            <el-input
              placeholder="请输入枚举值"
              clearable
              v-model="enumerateValueForm.enumerateValue"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="mt20" label="内容" prop="stepContent">
            <el-input
              placeholder="请输入内容"
              clearable
              v-model="enumerateValueForm.stepContent"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog('enumerateEdit')">取 消</el-button>
        <el-button type="primary" @click="confirm('enumerateEdit')">确 定</el-button>
      </span>
      >
    </PageDialog>

    <!-- 配置验证规则 -->
    <PageDialog
      dialogTitle="添加验证规则"
      :dialogVisiable="addRuleDialogVisible"
      dialogWidth="70%"
      @closeDialog="closeDialog('rule')"
      class="dialog"
    >
      <div slot="box">
        <ServiceTop
          ref="addRuleformRef"
          :serviceForm="addRuleServiceForm"
          :form="addRuleForm"
          class="service_top"
        >
          <div slot="rightButton">
            <el-button
              type="primary"
              size="small"
              @click="addRuleSearch"
              class="right_button"
              >搜索</el-button
            >
            <el-button size="small" @click="resetSearch" class="right_button"
              >重置</el-button
            >
          </div>
        </ServiceTop>
        <Table
          class="table_style"
          ref="configTableRef"
          :table="configTable"
          :data="configData"
          tableType="selection"
          rowK="ruleId"
          @selectionChange="selectionChange"
        ></Table>
        <PagePagination
          @size-change="addRuleHandleSizeChange"
          @current-change="addRuleHandleCurrentChange"
          :pager="addRulePager"
        >
        </PagePagination>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog('rule')">取 消</el-button>
        <el-button type="primary" @click="confirm('rule')">确 定</el-button>
      </span>
    </PageDialog>

    <!-- 选择子参数 -->
    <DictionarySelect
      ref="dictionaryRef"
      :dialogVisible="dictionaryDialogVisible"
      :dictGategList="dictGategList"
      @closeDialog="closeDialog"
      @setDictChildList="setDictChildList"
    >
    </DictionarySelect>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import { unduplicated } from "@m/utils/array";
import DictionaryForm from "./components/dic_form";
import PageBigData from "./components/page_big_data";
import { reList } from "@m/utils/paramTree";
import DictionaryPublic from "./components/dic_form/public";
import DictionarySelect from "./components/dic_form/select";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    DictionaryForm,
    PageBigData,
    DictionaryPublic,
    DictionarySelect,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    },
    sysId: {
      type: String,
      default: () => ""
    },
  },
  data() {
    return {
      // 数据字典选择公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索参数名称、中文名或描述",
          style: {
            width: "260px",
          },
        },
        {
          type: "switch",
          model: "preciseQuery",
          label: "精确查询",
          activeValue: "1",
          inactiveValue: "0",
          style: {
            width: "260px",
          },
        },
        // {
        //   type: "select",
        //   model: "paraGateg",
        //   placeholder: "所属分类",
        //   select: [],
        //   filterable: true,
        // },
        {
          type: "select",
          model: "paraType",
          placeholder: "参数类型",
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
            { type: "Date", value: "Date" },
          ],
        },
      ],
      // 数据字典搜索信息表单
      form: {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        dictryKeyWord: "", // 关键字
        paraType: "", // 类型
        // paraGateg: "", // 所属分类
      },
      // 数据字典搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        dictryKeyWord: "", // 关键字
        paraType: "", // 类型
        // paraGateg: "", // 所属分类
      },
      // 字典列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 字典列表参数
      tables: [
        {
          prop: "dictryNo",
          width: "40",
          type: "radio",
          tooltip: false,
        },
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
        //   tooltip: true,
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
      ],
      // 数据字典选择列表
      dictionaryData: [],
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      // 已选参数数组
      tableData: [],
      // 记录已经选择
      selectionData: [],

      paramsRadioModel: "",
      paramsDetail: {},
      radioHeader: 0,  //切换tabs参数,
      publicDialogVisible: false,
      // 枚举值弹窗变量
      //控制显示添加枚举值弹框
      enumerateValueVisible: false,
      //枚举值列表数据
      enumerateValueList: [],
      //枚举值输入数据
      enumerateValueForm: {
        enumerateValue: "",
        stepContent: "",
      },
      //枚举值规则校验
      enumerateValueRules: {
        enumerateValue: [{ required: true, message: "请输入枚举值", trigger: "blur" }],
        stepContent: [{ required: true, message: "请输入内容", trigger: "blur" }],
        
      },
      // 弹框标题
      dialogTitle: "",

      // 验证规则弹窗变量
      // 添加验证规则弹框
      addRuleDialogVisible: false,
      // 公共搜索
      addRuleServiceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索规则名称、中文名或描述",
          style: {
            width: "260px",
          },
        },
        // {
        //   type: "select",
        //   model: "paraClassifyId",
        //   placeholder: "所属分类",
        //   select: [],
        //   filterable: true,
        // },
      ],
      // 搜索信息表单
      addRuleForm: {
        content: "", // 名称,id,描述
        // paraClassifyId: "", // 所属分类id
      },
      // 搜索表单记录(点击搜索按钮后保存)
      addRuleSearchRecord: {
        content: "", // 编号或名称或描述
        // paraClassifyId: "", // 所属分类id
      },
      // 添加验证规则分页器
      addRulePager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 配置验证规则列表参数
      configTable: [
        {
          prop: "ruleNo",
          label: "规则名称",
          type: "text",
          tooltip: false,
        },
        {
          prop: "ruleNm",
          label: "规则中文名称",
          type: "text",
          tooltip: false,
        },
        {
          prop: "ruleDescr",
          label: "验证描述",
          type: "text",
          tooltip: true,
        },
        {
          prop: "ruleExps",
          label: "正则表达式",
          type: "text",
          tooltip: true,
        },
        {
          prop: "ruleTip",
          label: "提示信息",
          type: "text",
          tooltip: true,
        },
      ],
      // 验证规则列表数据
      configData: [],

      // 选择子参数弹窗
      // 数据字典选择弹框
      dictionaryDialogVisible: false,
    }
  },
  methods: {
    showDialog(type, data) {
      console.log("showDialog", type)
      if (type == "enumerate") {
        this.dialogTitle = "添加规则说明";
        this.enumerateValueVisible = true
      } else if (type == "enumerateEdit") {
        this.isData = data;
        this.dialogTitle = "编辑规则说明";
        this.enumerateValueForm.enumerateValue = data.key;
        this.enumerateValueForm.stepContent = data.value;
        this.enumerateValueVisible = true;
      } else if (type == "rule") {
        this.addRuleGetList()
        this.getRuleClassification()
        this.dialogTitle = "配置验证规则";
        this.addRuleDialogVisible = true;
      } else if (type == "sonParams") {
        this.dictionaryDialogVisible = true
      } else {
        this.publicDialogVisible = true
        this.$refs.dictionaryPublicRef.resetForm();
        this.$refs.dictionaryPublicRef.getList();
      }
    },
    // 获取未配置验证规则数据列表
    async addRuleGetList() {
      const _this = this.$refs.dictionaryFormRef.$refs.ruleRef
      const data = {
        qCondition: this.addRuleSearchRecord.content ? this.addRuleSearchRecord.content : "",
        paraClassifyId: this.addRuleSearchRecord.paraClassifyId
          ? this.addRuleSearchRecord.paraClassifyId
          : "",
        dictryId: "",
        currentPage: this.addRulePager.currentPage + "",
        turnPageShowNum: this.addRulePager.turnPageShowNum,
      };
      const res = await this.rpc.systemmgmt.notConfiguredList(data);
      this.configData = res.ruleDefinedInfoPageList;
      this.addRulePager.total = res.turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableDataInAddRule();
      });
    },
    isTableDataInAddRule() {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item) => {
          this.configData.forEach((data) => {
            if (item.ruleId == data.ruleId) {
              this.isRecord = true;
              this.$refs.configTableRef.$refs.tableRef.toggleRowSelection(
                data
              );
            }
          });
        });
      }
    },
    // 规则分类的下拉列表
    async getRuleClassification() {
      const res = await this.rpc.systemmgmt.getRuleClassification();
      const selectList = res.rciList.map((item) => ({
        type: item.clsfCnNm,
        value: item.clsfId,
      }));
      this.addRuleServiceForm.find((item) => item.model == "paraClassifyId").select =
        selectList;
        this.addRuleServiceForm.find((item) => item.model == "paraClassifyId").select =
        selectList;
    },
    // 弹框关闭时
    closeDialog(type) {
      if (type == "enumerateEdit") {
        this.$refs.enumerateValueFormRef.resetFields();
        this.enumerateValueVisible = false;
      } else if (type == "rule") {
        this.$refs.addRuleformRef.resetFields();
        this.addRuleDialogVisible = false;
      } else if (type == "sonParams") {
        this.dictionaryDialogVisible = false;
      }
    },
    selectionChange(e) {
      if (!this.isRecord && this.selectionData.length > e.length) {
        this.selectionData.forEach((item) => {
          if (e.indexOf(item) == -1) {
            this.tableData = this.tableData.filter(
              (it) => it.ruleId != item.ruleId
            );
          }
        });
      } else {
        this.tableData.push(...e);
        this.tableData = unduplicated(this.tableData, "ruleId");
      }
      this.selectionData = e;
      this.isRecord = false;
    },
    // 搜索按钮
    addRuleSearch() {
      Object.assign(this.addRuleSearchRecord, this.addRuleForm);
      this.addRulePager.currentPage = "1";
      this.isRecord = true;
      this.addRuleGetList();
    },
    // 重置按钮
    resetSearch() {
      this.$refs.addRuleformRef.resetFields();
    },
    toDicList() {
      this.$emit("toDicList");
    },
    // 从公共数据字典选择
    publicCloseDialog() {
      this.publicDialogVisible = false;
    },
    // 从公共数据字典确认
    confirmParams(e) {
      this.publicCloseDialog();
      this.getDictionaryInfoById(e.dictryId);
    },
    // 进入编辑页面时查询详情
    async getDictionaryInfoById(e) {
      const _this =  this.$refs.dictionaryFormRef
      const params = {
        dictryId: e,
      };
      const res = await this.rpc.systemmgmt.editList(params);
      _this.formData.dictryNo = res.dictryNo;
      _this.formData.dictryNm = res.dictryNm;
      _this.formData.dictryKeyWord = res.dictryKeyWord.replace(
        /(^\s*)|(\s*$)/g,
        ""
      ); // 去除前后空格
      _this.formData.dictryEnglishFullName = res.dictryEnglishFullName;
      _this.formData.dictryDescr = res.dictryDescr;
      _this.formData.dictryGateg = res.dictryGateg;
      _this.formData.dictryTyp = res.dictryTyp;
      _this.formData.dictryLength = res.dictryLength;
      _this.dicGetNodeId(res.dictChildList);
      _this.iInputList = JSON.parse(JSON.stringify(res.dictChildList));
      if (res.dictryTyp == "String") {
        if (res.dictryEnum) {
          _this.$refs.enumRef.enumerateValueList = res.dictryEnum
            .split(";")
            .map((item) => {
              const arr = item.split("-");
              return {
                key: arr[0],
                value: arr[1],
              };
            });
        }
        _this.$refs.ruleRef.ruleTableData = res.ruleList;
      }
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
    async createParams() {
      console.log("createParams")
      const _this = this.$refs.dictionaryFormRef
      const params = Object.assign({}, _this.formData);
      if (params.dictryTyp == "String") {
        const enumerateValueList = _this.$refs.enumRef.enumerateValueList;
        params.dictryEnum = enumerateValueList.reduce((pre, item, index) => {
          return `${pre}${item.key}-${item.value}${
            index == enumerateValueList.length - 1 ? "" : ";"
          }`;
        }, "");
        params.ruleIdList = _this.$refs.ruleRef.ruleTableData.map((item) => ({
          ruleId: item.ruleId,
        }));
      } else if (params.dictryTyp == "List" || params.dictryTyp == "Object") {
        params.dictChildList = _this.iInputList;
        params.dictryLength = "";
      }
      // if(_this.apiType == "sys" || !!_this.sysId) {
      //   params.dictryGateg = "10000000"
      //   params.sysId = this.sysId;
      // }
      // const api = this.apiType == "sys" ? "addSysDic" : "addPublicDictionary"
      // const res = await this.rpc.systemmgmt[api](params);
      const res = await this.rpc.systemmgmt.addPublicDictionary(params);
      this.$notify({
        title: "成功",
        message: "成功",
        duration: 2000,
        type: "success",
      });
      this.radioHeader = 0
      this.search()
      // this.handleCancel()
    },
    handleCancel(e) {
      console.log("handleCancel", e)
      this.radioHeader = 0
      this.addVisible = false
      this.$refs.dictionaryFormRef.$refs.formData.resetFields()
      this.$emit("closeDialog")
    },

    // 点击搜索按钮
    search() {
      this.isRecord = true;
      Object.assign(this.searchRecord, this.form);
      this.pager.currentPage = "1";
      this.getList();
    },
    // 点击重置按钮
    reset() {
      this.$refs.formRef.resetFields();
    },
    // 获取字典列表数据
    async getList() {
      data = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        ...this.searchRecord
      };
      const res = await this.rpc.systemmgmt.getDictionaryList(data);
      this.dicGetNodeId(res.dictionariesInfoBoList);
      this.dictionaryData = JSON.parse(
        JSON.stringify(res.dictionariesInfoBoList)
      );
      this.pager.total = res.turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableData();
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
    // 子参数没有多选框
    dictListCellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.dictryPid !== "" && column.type === "selection") {
        return { visibility: "hidden" };
      }
    },
    // tableData数据选中表格中
    isTableData() {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item) => {
          this.dictionaryData.forEach((data) => {
            if (item.dictryId == data.dictryId) {
              this.isRecord = true;
              this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
                data
              );
            }
          });
        });
      }
    },
    // 数据字典选择每页条数改变时
    handleSizeChange(e) {
      this.isRecord = true;
      this.pager.turnPageShowNum = e;
      this.getList();
    },
    // 数据字典选择当前页改变时
    handleCurrentChange(e) {
      this.isRecord = true;
      this.getList();
    },
    // 数据分类的下拉列表
    async getClassifyTypeList() {
      const params = { turnPageShowNum: "0" };
      const res = await this.rpc.systemmgmt.getClassifyTypeList(params);
      this.classifyOptions = res.serviceList;
      const selectList = res.serviceList.map((item) => ({
        type: item.clsfNm,
        value: item.clsfId,
      }));
      this.serviceForm.find((item) => item.model == "paraGateg").select =
        selectList;
    },
    // 单选框变化时
    paramsRadioChange(e, data) {
      //this.paramsRadioModel = e;
      this.paramsDetail = e;
      console.log(this.paramsDetail)
    },
    // 枚举值确定保存
    confirm(type) {
      if (type == "enumerateEdit") {
        this.$refs.enumerateValueFormRef.validate((valid) => {
          if (!valid) return;
          const _this = this.$refs.dictionaryFormRef.$refs.enumRef
          if (this.dialogTitle == "添加规则说明") {
            const data = {
              key: this.enumerateValueForm.enumerateValue,
              value: this.enumerateValueForm.stepContent,
            };
            _this.enumerateValueList.push(data);
          } else {
            const i = _this.enumerateValueList.indexOf(this.isData);
            _this.enumerateValueList[i].key = this.enumerateValueForm.enumerateValue;
            _this.enumerateValueList[i].value = this.enumerateValueForm.stepContent;
          }
          this.enumerateValueVisible = false;
          this.$refs.enumerateValueFormRef.resetFields();
        });
      } else if (type == "rule") {
        const _this = this.$refs.dictionaryFormRef.$refs.ruleRef
        _this.ruleTableData = unduplicated(_this.ruleTableData.concat(this.tableData), "ruleId")
        this.addRuleDialogVisible = false;
      }
    },
    saveParams() {
      this.$emit("confirmParams", this.paramsDetail);
    },
    // confirm() {
    //   this.$emit("confirmParams", this.paramsDetail);
    // },
    // 初始化
    init() {
      this.getList();
      this.getClassifyTypeList()
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_dic_form_public {
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }
  .dialog {
    ::v-deep.el-dialog {
      margin-top: 3vh !important;
    }
    ::v-deep.el-dialog__body {
      max-height: 78vh;
      padding: 0;
    }
    .add_dialog_conf {
      padding: 15px 24px;
      height: 400px;
      overflow: auto;
      .search_conf {
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
        .show_conf_content {
          float: left;
        }
        .show_conf_tag {
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
      ::v-deep .el-form-item {
        margin-bottom: 0;
      }
    }
    .d_flex_center {
      display: flex;
      justify-content: center;
      padding: 16px 0 12px;
      margin: 0 0 0 -24px;
      border-bottom: 1px solid #DCDFE6;
      width: calc(100% + 48px);
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
