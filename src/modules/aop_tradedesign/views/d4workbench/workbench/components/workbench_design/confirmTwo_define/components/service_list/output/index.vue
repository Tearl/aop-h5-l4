<template>
  <div class="aop_workgate_comps_apimgmt_api_mod_params">
    <div class="params_wrapper">
      <el-form
        :model="formData"
        class="create_form"
        ref="formData"
        label-width="130px"
      >
        <div class="create_form_info">
          <div class="input_wrapper">
            <div class="top_title">
              <div class="title">输出参数</div>
              <div class="top_right_create">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="showParams('s')"
                  >从数据集选择</el-button
                >
              </div>
            </div>
            <div class="data_wrapper">
              <PageBigData
                ref="sendDataRef"
                parentClass="send_data"
                :data="receiveData"
                @add="addBdata"
                @del="delBdata"
                @addByDic="addByDic"
              ></PageBigData>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <!-- 从数据集中选择 -->
     <OutputFromDataSet
      ref="dataSetRef"
      :dataObj="dataObj"
      @saveParams="saveParamsDic"
    ></OutputFromDataSet>

    <!-- 添加参数 -->
    <PageDialog
      :dialogWidth="'80%'"
      :dialogTitle="'请选择参数'"
      :dialogVisiable="addVisible"
      @closeDialog="handleCancel"
      class="create_dialog"
    >
      <div slot="box">
        <section class="d_flex_center">
          <el-radio-group v-model="radioHeader">
            <el-radio-button label="0"><p class="radio-text">选择现有数据字典参数</p></el-radio-button>
            <el-radio-button label="1"><p class="radio-text">新增数据字典</p></el-radio-button>
          </el-radio-group>
        </section>
        <div v-show="radioHeader == 0" class="add_dialog_conf">
          <ServiceTop
            ref="formRef"
            :serviceForm="serviceForm"
            :form="formInline"
            class="search_conf"
          >
            <div slot="rightButton">
              <el-button
                type="primary"
                size="small"
                @click="goSearch"
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
            :data="dictList"
            :table="dictListTables"
            ref="dictListTableRef"
            :rowK="'serialNumber'"
            :treeProps="{ children: 'children' }"
            :tableType="'selection'"
            :cellStyle="dictListCellStyle"
            @selectionChange="handleSelectionChange"
          ></Table>
          <!-- 分页器 -->
          <PagePagination
            @size-change="handleDicSizeChange"
            @current-change="handleDicCurrentChange"
            :pager="dicPager"
          >
          </PagePagination>
          <div class="show_conf">
            <div class="show_conf_title">
              已选择{{ tableData && tableData.length }}个：
            </div>
            <div class="show_conf_content">
              <el-tag
                v-for="(item, index) in tableData"
                :key="index"
                type="info"
                size="small"
                closable
                class="show_conf_tag"
                @close="delParamsTag(item, formInline.type)"
              >
                {{ item.dictryNm }}
              </el-tag>
            </div>
          </div>
        </div>
        <div v-show="radioHeader == 1" class="add_dialog_conf">
          <DictionaryForm
            ref="dictionaryFormRef"
            :sysId="arsId"
            @toDicList="toDicList"
            @showDialog="showDialog"
            @handleCancel="handleCancel"
            >
          </DictionaryForm>
        </div>
      </div>
      <div slot="footer">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button v-if="radioHeader == 0" type="primary" @click.native="saveParams">确定</el-button>
        <el-button v-if="radioHeader == 1" type="primary" @click.native="createParams">确定</el-button>
      </div>
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
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import { unduplicated, setSerialNumber } from "@m/utils/array";
import { dict2Para } from "@m/utils/dict2Para";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import PageBigData from "@m/core/components/dataset/page_big_data";
import DictionaryForm from "./components/dic_form";
import DictionaryPublic from "./components/dic_form/public";
import OutputFromDataSet from "../components/selcOutputFromDataSet";

import { reList } from "@m/utils/paramTree";
export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    PagePagination,
    ServiceTop,
    PageBigData,
    DictionaryForm,
    DictionaryPublic,
    OutputFromDataSet
  },
  props: {
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    arsId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      // 已选参数数组
      tableData: [],
      selectionData: [],
      // 选择参数弹框
      addVisible: false,
      // 选择参数分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      dicPager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      dictList: [],
      // 添加参数列表参数
      dictListTables: [
        {
          prop: "dictryNo",
          label: "参数Key",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryNm",
          label: "参数名称",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryDescr",
          label: "参数描述",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryTyp",
          label: "参数值类型",
          width: "90",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryLength",
          label: "参数长度",
          width: "90",
          type: "text",
          tooltip: true,
        },
      ],
      // 公共搜索
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
            { type: "Date", value: "Date" },
          ],
        },
      ],
      // 输入输出参数弹框的搜索表单
      formInline: {
        content: "",
        paraType: "",
      },
      isHandleParamType: "r",
      // 当前数据
      isData: {},

      sendColumns: [
        {
          width: "200px",
          prop: "paramKey",
          label: "参数Key",
          inputStyle: "width: 70%",
          type: "input",
        },
        {
          width: "160px",
          prop: "paramCName",
          label: "参数名称",
          type: "input",
        },
        {
          width: "140px",
          prop: "paramValueType",
          label: "参数值类型",
          type: "select",
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
          selectChange: function (scope) {
            if (
              scope.row.paramValueType !== "Object" ||
              scope.row.paramValueType !== "List"
            ) {
              scope.row.children = [];
            }
          },
        },
        {
          width: "90px",
          prop: "paramLength",
          label: "参数长度",
          type: "input",
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "select",
          tooltip: false,
          selectVal: [
            { type: "否", value: "0" },
            { type: "是", value: "1" },
          ],
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "input",
        },
        {
          width: "180px",
          prop: "paramDesc",
          label: "参数描述",
          type: "input",
        },
        {
          prop: "action",
          label: "操作",
          width: "100",
          fixed: "right",
          type: "button",
          dropdownTitle: "操作",
          dropdownList: [
            {
              desc: "添加",
              operate: "add",
              relation: function (scope) {
                return (
                  scope.row.paramValueType === "List" ||
                  scope.row.paramValueType === "Object"
                );
              },
            },
            {
              desc: "删除",
              operate: "del",
            },
          ],
        },
      ],
      receiveColumns: [
        {
          width: "200px",
          prop: "paramKey",
          label: "参数Key",
          inputStyle: "width: 70%",
          type: "input",
        },
        {
          width: "160px",
          prop: "paramCName",
          label: "参数名称",
          type: "input",
        },
        {
          width: "140px",
          prop: "paramValueType",
          label: "参数值类型",
          type: "select",
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
          selectChange: function (scope) {
            if (
              scope.row.paramValueType !== "Object" ||
              scope.row.paramValueType !== "List"
            ) {
              scope.row.children = [];
            }
          },
        },
        {
          width: "90px",
          prop: "paramLength",
          label: "参数长度",
          type: "input",
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "select",
          tooltip: false,
          selectVal: [
            { type: "否", value: "0" },
            { type: "是", value: "1" },
          ],
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "input",
        },
        {
          width: "180px",
          prop: "paramDesc",
          label: "参数描述",
          type: "input",
        },
        {
          prop: "action",
          label: "操作",
          width: "100",
          fixed: "right",
          type: "button",
          dropdownTitle: "操作",
          dropdownList: [
            {
              desc: "添加",
              operate: "add",
              relation: function (scope) {
                return (
                  scope.row.paramValueType === "List" ||
                  scope.row.paramValueType === "Object"
                );
              },
            },
            {
              desc: "删除",
              operate: "del",
            },
          ],
        },
      ],
      sendData: [], // 请求报文
      receiveData: [], // 响应报文
      formData: {},

      httpColumns: [
        {
          width: "200px",
          prop: "paramKey",
          label: "参数Key",
          inputStyle: "width: 70%",
          type: "input",
        },
        {
          width: "160px",
          prop: "paramCName",
          label: "参数名称",
          type: "input",
        },
        {
          width: "140px",
          prop: "paramValueType",
          label: "参数值类型",
          type: "select",
          selectVal: [
            { type: "String", value: "String" },
            { type: "File", value: "File" },
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
            { type: "Date", value: "Date" },
          ],
        },
        {
          width: "90px",
          prop: "paramLength",
          label: "参数长度",
          type: "input",
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "select",
          tooltip: false,
          selectVal: [
            { type: "否", value: "0" },
            { type: "是", value: "1" },
          ],
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "input",
        },
        {
          width: "180px",
          prop: "paramDesc",
          label: "参数描述",
          type: "input",
        },
        {
          prop: "action",
          label: "操作",
          width: "100",
          fixed: "right",
          type: "button",
          dropdownTitle: "操作",
          dropdownList: [
            {
              desc: "添加",
              operate: "add",
              relation: function (scope) {
                return (
                  scope.row.paramValueType === "List" ||
                  scope.row.paramValueType === "Object"
                );
              },
            },
            {
              desc: "删除",
              operate: "del",
            },
          ],
        },
      ],
      httpData: [],
      httpTypeList: [
        { type: "String", value: "String" },
        { type: "File", value: "File" },
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
        { type: "Date", value: "Date" },
      ],

      radioHeader: 0,  //切换tabs参数
      // 新增数据字典变量
      // 公共数据字典选择
      publicDialogVisible: false,
      // 表单数据
      formData: {
        dictryNo: "", // 参数名称
        dictryNm: "", // 参数中文名称
        dictryKeyWord: "", // 关键字
        dictryEnglishFullName: "", // 英文名字全称
        dictryDescr: "", // 参数描述
        dictryGateg: "", // 所属分类
        dictryTyp: "String", // 参数类型
        dictryLength: "", // 最大长度
      },

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
      // 点击编辑时当前行的数据
      // isData: "",

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
        {
          type: "select",
          model: "paraClassifyId",
          placeholder: "所属分类",
          select: [],
          filterable: true,
        },
      ],
      // 搜索信息表单
      addRuleForm: {
        content: "", // 名称,id,描述
        paraClassifyId: "", // 所属分类id
      },
      // 搜索表单记录(点击搜索按钮后保存)
      addRuleSearchRecord: {
        content: "", // 编号或名称或描述
        paraClassifyId: "", // 所属分类id
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
    };
  },
  methods: {
    init() {
      this.getParamsList();
    },
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
      } else {
        this.publicDialogVisible = true;
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
      const res = await this.rpc.dictionary.notConfiguredList(data);
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
      const res = await this.rpc.rule.getRuleClassification();
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
      const res = await this.rpc.dictionary.editList(params);
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
      _this.sendData = JSON.parse(JSON.stringify(res.dictChildList));
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
    createParams() {
      console.log("createParams")
      const _this = this.$refs.dictionaryFormRef
      const item = JSON.parse(JSON.stringify(_this.formData));
      item.children = _this.iInputList
      const prs = {
        paramKey: item.dictryNo,
        paramCName: item.dictryNm,
        paramLength: item.dictryLength,
        paramValueType: item.dictryTyp,
        paramDesc: item.dictryDescr,
        children: item.children,
        standFlg: "00",
        standType: "00",
      };
      if (item.dictryTyp == "String") {
        const enumerateValueList = _this.$refs.enumRef.enumerateValueList;
        prs.dictryEnum = enumerateValueList.reduce((pre, item, index) => {
          return `${pre}${item.key}-${item.value}${
            index == enumerateValueList.length - 1 ? "" : ";"
          }`;
        }, "");
        prs.ruleIdList = _this.$refs.ruleRef.ruleTableData.map((item) => ({
          ruleId: item.ruleId,
        }));
      } 
      // else if (item.dictryTyp == "List" || item.dictryTyp == "Object") {
      //   const list = this.$refs.dictionaryFormRef.iInputList
      //   list.forEach((iten) => {
      //     prs.children.push({
      //       paramKey: item.dictryNo,
      //       paramCName: item.dictryNm,
      //       paramLength: item.dictryLength,
      //       paramValueType: item.dictryTyp,
      //       paramDesc: item.dictryDescr,
      //       standFlg: "00",
      //       standType: "00",
      //     })
      //   })
      // }

      console.log("prs",prs)
      if(this.formInline.type == "addChild") {
        this.addChildParams(
          this.isData.paramDirection === "1"
            ? this.receiveData
            : this.sendData,
          this.isData,
          prs
        );
        this.refreshParams()
      } else {
        this.addParams(
          this.formInline.type === "s"
            ? this.sendData
            : this.formInline.type === "r"
            ? this.receiveData
            : this.isData,
          this.formInline.type === "s" ? "0" : this.formInline.type === "r" ? "1" : "3",
          this.formInline.type === "s" ? "0" : this.formInline.type === "r" ? "1" : "3",
          prs
        );
      }
      this.handleCancel()
      // _this.preservation()
    },
    handleCancel(e) {
      console.log("handleCancel", e)
      this.radioHeader = 0
      this.addVisible = false
      this.$refs.dictionaryFormRef.$refs.formData.resetFields()
    },
    initParams(data) {
      console.log(data);
      // const list = reList(data.puApiParams);
      console.time("render耗时");
      const inputList = data.puApiParams.filter(
        (item) => item.paramDirection === "0"
      );
      const outputList = data.puApiParams.filter(
        (item) => item.paramDirection === "1"
      );
      const httpHeaderParams = reList(data.httpHeaderParams);
      this.sendData = reList(inputList);
      this.receiveData = reList(outputList);
      this.httpData = httpHeaderParams;
      this.$nextTick(() => {
        console.timeEnd("render耗时");
      });
    },
    //大数据的添加
    addBdata(e) {
      this.operate("add", e);
    },
    //大数据的删除
    delBdata(e) {
      this.operate("del", e);
    },
    addByDic(e) {
      this.operate("dicAdd", e);
    },
    //BODY列表参数操作
    operate(operation, data) {
      console.log(data);
      if (data.paramDirection == "0") {
        if (operation == "add") {
          this.addChildParams(this.sendData, data);
          this.refreshParams()
        } else if (operation == "dicAdd") {
          this.isData = data;
          this.showParams("addChild");
        } else {
          this.delParams(this.sendData, data.paramOrder);
        }
      } else {
        if (operation == "add") {
          this.addChildParams(this.receiveData, data);
          this.refreshParams()
        } else if (operation == "dicAdd") {
          this.isData = data;
          this.showParams("addChild");
        } else {
          this.delParams(this.receiveData, data.paramOrder);
        }
      }
    },
    //大数据头部的添加
    addHdata(e) {
      this.httpOperate("add", e);
    },
    //大数据头部的删除
    delHdata(e) {
      this.httpOperate("del", e);
    },
    //大数据头部从数字字典添加
    addHByDic(e) {
      this.httpOperate("dicAdd", e);
    },
    //http头处理
    httpOperate(operation, data) {
      if (data.paramDirection == "0") {
        if (operation == "add") {
          this.addChildParams(this.httpData, data);
        } else if (operation == "dicAdd") {
          this.isData = data;
          this.showParams("addChild");
        } else {
          this.delParams(this.httpData, data.paramOrder);
        }
      }
    },
    paramKeyBlur(e) {
      if (
        e.paramKey == "connection" ||
        e.paramKey == "charset" ||
        e.paramKey == "Content-Type" ||
        e.paramKey == "Authorization" ||
        e.paramKey == "apiVersion"
      )
        return this.$message.error(
          "http请求头参数不能为：connection，charset，Content-Type，Authorization，apiVersion"
        );
    },

    //参数操作
    /** 添加第一级报文参数
     * @param {Array} arrs 原数组
     * @param {String} pos 数组位置
     * @param {String} direct 数组方向
     * @param {Object} prs 赋值后的数据,字典需用
     */
    addParams(arrs, pos, direct, prs = {}) {
      const order =
        arrs.length > 0
          ? arrs[arrs.length - 1].paramOrder.indexOf(".") !== -1
            ? arrs[arrs.length - 1].split(".")[0] * 1 + 1
            : arrs[arrs.length - 1].paramOrder * 1 + 1
          : 1;
      let data = {
        paramOrder: order.toString(),
        paramPosition: pos,
        paramDirection: direct,
        isNeed: "0", // 0过滤，1不过虑
        paramParentId: "",
        action: "0",
        paramKey: prs.paramKey,
        paramCName: prs.paramCName,
        paramLength: prs.paramLength,
        paramValueType: prs.paramValueType,
        paramDesc: prs.paramDesc,
        standFlg: prs.standFlg,
        standType: prs.standType
      };
      if(prs.children && prs.children.length > 0) {
        prs.children.map((item) => {
          const prs = {
            paramKey: item.dictryNo,
            paramCName: item.dictryNm,
            paramLength: item.dictryLength,
            paramValueType: item.dictryTyp,
            paramDesc: item.dictryDescr,
            children: item.children,
            standFlg: this.radioHeader == "0" ? "10" : "00",
            standType: this.radioHeader == "0" ? "10" : "00",
          };
          this.addChildParams(
            {},
            data,
            prs
          );
        });
      }
      arrs.push(data);
    },
    // 删除报文参数
    delParams(arrs, id) {
      let i = 0;
      while (arrs[i]) {
        if (arrs[i].paramOrder == id) {
          arrs.splice(i, 1);
          let d = 0;
          if (id.indexOf(".") != -1) {
            d = id.substring(0, id.length - 1);
          }
          for (let i = 0; i < arrs.length; i++) {
            arrs[i].paramOrder = d + (i + 1) + "";
          }
          return;
        }
        if (arrs[i].children && arrs[i].children.length > 0) {
          this.delParams(arrs[i].children, id);
        }
        i++;
      }
    },
    /** 添加子级报文参数
     * @param {Array} arrs 原数组
     * @param {Object} item 父级
     * @param {Object} prs 赋值后的数据,字典需用
     */
    addChildParams(arrs, item = {}, prs = {}) {
      const order =
        item.children && item.children.length > 0
          ? item.paramOrder + "." + (item.children.length + 1)
          : item.paramOrder + "." + 1;
      const data = {
        paramOrder: order,
        paramValue: "",
        paramPosition: item.paramPosition,
        paramDirection: item.paramDirection,
        isNeed: "0", // 0过滤，1不过虑
        paramParentId: item.paramOrder,
        action: "0",
        paramKey: prs.paramKey,
        paramCName: prs.paramCName,
        paramLength: prs.paramLength,
        paramValueType: prs.paramValueType,
        paramDesc: prs.paramDesc,
        standFlg: prs.standFlg,
        standType: prs.standType
      };
      if(prs.children && prs.children.length > 0) {
        prs.children.map((item) => {
          const prs = {
            paramKey: item.dictryNo,
            paramCName: item.dictryNm,
            paramLength: item.dictryLength,
            paramValueType: item.dictryTyp,
            paramDesc: item.dictryDescr,
            children: item.children,
            standFlg: this.radioHeader == "0" ? "10" : "00",
            standType: this.radioHeader == "0" ? "10" : "00",
          };
          this.addChildParams(
            {},
            data,
            prs
          );
        }); 
      }
      console.log(1,data);
      item.children = item.children || [];
      item.children.push(data);
    },
    refreshParams() {
      this.httpData = JSON.parse(JSON.stringify(this.httpData));
      this.receiveData = JSON.parse(JSON.stringify(this.receiveData));
      this.sendData = JSON.parse(JSON.stringify(this.sendData));
      this.$forceUpdate();
    },
    //参数列表操作
    // 添加输入输出按钮点击
    showParams(e) {
      // this.isHandleParamType = e;
      this.formInline.type = e;
      this.selectionData = [];
      this.tableData = [];
      // this.addVisible = true;
      // this.resetSearch();
      // this.getParamsList();
      this.$refs.dataSetRef.showDialog();
    },
    // 获取输入输出参数列表数据
    async getParamsList() {
      const data = {
        currentPage: this.dicPager.currentPage + "",
        turnPageShowNum: this.dicPager.turnPageShowNum,
        sysId: this.arsId,
        ...this.formInline,
      };
      const res = await this.rpc.dictionary.getSysDictionaryList(data);
      this.dictList = setSerialNumber(res.dictionariesInfoBoList);
      this.dicPager.total = res.turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableData();
      });
    },
    handleDicSizeChange(e) {
      this.isRecord = true;
      this.dicPager.turnPageShowNum = e + "";
      this.getParamsList();
    },
    handleDicCurrentChange(e) {
      this.isRecord = true;
      this.getParamsList();
    },
    handleSizeChange(e) {
      this.isRecord = true;
      this.pager.turnPageShowNum = e + "";
      this.getParamsList();
    },
    handleCurrentChange(e) {
      this.isRecord = true;
      this.getParamsList();
    },
    // tableData数据选中表格中
    isTableData() {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item) => {
          this.dictList.forEach((data) => {
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
    //多选显示
    dictListCellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.dictryPid !== "" && column.type === "selection") {
        return { visibility: "hidden" };
      }
    },
    goSearch() {
      this.isRecord = true;
      this.pager.currentPage = "1";
      this.getParamsList();
    },
    // 初始化添加输入输出搜索栏
    resetSearch() {
      this.pager.currentPage = "1";
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields();
      }
    },
    // 多选框选中
    handleSelectionChange(e) {
      if (!this.isRecord && this.selectionData.length > e.length) {
        this.selectionData.forEach((item) => {
          if (e.indexOf(item) == -1) {
            this.tableData = this.tableData.filter(
              (it) => it.dictryId != item.dictryId
            );
          }
        });
      } else {
        this.tableData.push(...e);
        this.tableData = unduplicated(this.tableData, "dictryId");
      }
      this.selectionData = e;
      this.isRecord = false;
    },
    // 保存当前选中的参数
    async saveParams() {
      const data = JSON.parse(JSON.stringify(this.tableData));
      console.log("data", data)
      if(this.formInline.type == "addChild") {
        data.map((item) => {
          const prs = {
            paramKey: item.dictryNo,
            paramCName: item.dictryNm,
            paramLength: item.dictryLength,
            paramValueType: item.dictryTyp,
            paramDesc: item.dictryDescr,
            children: item.children,
            standFlg: this.radioHeader == "0" ? "10" : "00",
            standType: this.radioHeader == "0" ? "10" : "00",
          };
          this.addChildParams(
            this.isData.paramDirection === "1"
              ? this.receiveData
              : this.sendData,
            this.isData,
            prs
          );
        });
        this.refreshParams()
      } else {
        data.map((item) => {
          const prs = {
            paramKey: item.dictryNo,
            paramCName: item.dictryNm,
            paramLength: item.dictryLength,
            paramValueType: item.dictryTyp,
            paramDesc: item.dictryDescr,
            children: item.children,
            standFlg: this.radioHeader == "0" ? "10" : "00",
            standType: this.radioHeader == "0" ? "10" : "00",
          };
          this.addParams(
            this.formInline.type === "s"
              ? this.sendData
              : this.formInline.type === "r"
              ? this.receiveData
              : this.isData,
            this.formInline.type === "s" ? "0" : this.formInline.type === "r" ? "1" : "3",
            this.formInline.type === "s" ? "0" : this.formInline.type === "r" ? "1" : "3",
            prs
          );
        });
      }
      this.$nextTick(() => {
        this.$refs.dictListTableRef.clearSelection();
      });
      this.dicPager.currentPage = "1";
      this.addVisible = false;
    },
    // 删除当前点击的参数
    delParamsTag(e) {
      const index = this.dictList.findIndex((item) => item.dictryId == e.dictryId);
      if (index == -1) {
        this.tableData = this.tableData.filter((it) => it.dictryId != e.dictryId);
      } else {
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          this.dictList[index],
          false
        );
      }
    },
    toDicList() {
      this.$emit("toDicList");
    },
    async saveParamsDic(e) {
      const data = JSON.parse(JSON.stringify(e));
      console.log("data", data)
      if(this.formInline.type == "addChild") {
        data.map((item) => {
          const prs = {
            paramKey: item.dictNo,
            paramCName: item.dictNm,
            paramLength: item.dictLength,
            paramValueType: item.dictTyp,
            paramDesc: "",
            dataSetDataId: item.dataSetDataId,
            // children: item.children,
            // standFlg: this.radioHeader == "0" ? "10" : "00",
            // standType: this.radioHeader == "0" ? "10" : "00",
          };
          this.addChildParams(
            this.isData.paramDirection === "1"
              ? this.receiveData
              : this.sendData,
            this.isData,
            prs
          );
        });
        this.refreshParams()
      } else {
        data.map((item) => {
          const prs = {
            paramKey: item.dictNo,
            paramCName: item.dictNm,
            paramLength: item.dictLength,
            paramValueType: item.dictTyp,
            paramDesc: "",
            // children: item.children,
            // standFlg: this.radioHeader == "0" ? "10" : "00",
            // standType: this.radioHeader == "0" ? "10" : "00",
          };
          this.addParams(
            this.formInline.type === "s"
              ? this.sendData
              : this.formInline.type === "r"
              ? this.receiveData
              : this.isData,
            this.formInline.type === "s" ? "0" : this.formInline.type === "r" ? "1" : "3",
            this.formInline.type === "s" ? "0" : this.formInline.type === "r" ? "1" : "3",
            prs
          );
        });
      }
      // this.$nextTick(() => {
      //   this.$refs.dictListTableRef.clearSelection();
      // });
      this.dicPager.currentPage = "1";
      this.addVisible = false;
    },
  },
  created() {
    // this.init()
  },
  mounted() {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_apimgmt_api_mod_params {
  .params_wrapper,
  .params_header_wrapper {
    // padding: 20px 30px;
    .input_wrapper,
    .output_wrapper {
      .top_title {
        display: flex;
        justify-content: space-between;
        .title {
          font-family: $font_medium;
          font-size: 16px;
          color: $pri_ft_color;
          letter-spacing: 0;
          margin-bottom: 20px;
          font-weight: $font_weight_600;
        }
      }
      .table_style {
        margin-top: 16px;
      }
      .top_right_create {
        font-size: 14px;
        ::v-deep .el-button {
          @include large_button_common;
        }
      }
      .data_wrapper {
        margin-top: 16px;
      }
    }
    .output_wrapper {
      // margin-top: 20px;
    }
    ::v-deep .create_form {
      .el-form-item__label {
        color: $reg_ft_color;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        letter-spacing: 0;
        text-align: right;
        padding-right: 16px;
        font-weight: 600;
      }
    }
  }

  .create_dialog {
    ::v-deep .el-dialog__body {
      padding: 0;
    }
    .add_dialog_conf {
      padding: 15px 24px;
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
          span {
            color: #358aff;
          }
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
}
</style>
