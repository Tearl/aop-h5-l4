<template>
  <div class="aop_tradedesign_comps_apimgmt_case_form">
    <div class="content_wrapper">
      <el-form
        :rules="rules"
        :model="formData"
        ref="form"
        label-position="right"
        label-width="120px"
        class="edit_form"
      >
        <div class="content_detail">
          <!-- Mock信息 -->
          <div class="content_header">Mock信息</div>
          <div class="form_info">
            <el-form-item label="Mock名称" prop="caseName">
              <el-input
                v-model="formData.caseName"
                clearable
                placeholder="请输入Mock名称"
              />
            </el-form-item>
            <el-form-item
              label="选择所属API"
              prop="serviceId"
              class="select_btn_box"
            >
              <el-input
                v-model="formData.serviceName"
                clearable
                placeholder="请选择所属API"
                disabled
              />
              <el-button type="primary" @click="showApi" v-show="type == 'add'"
                >选择</el-button
              >
            </el-form-item>
            <el-form-item label="是否必须Mock" prop="isNeed">
              <el-select v-model="formData.isNeed" placeholder="请选择">
                <el-option
                  v-for="(item, idx) in needList"
                  :key="idx"
                  :value="item.value"
                  :label="item.type"
                >
                  {{ item.type }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="优先级" prop="level">
              <el-select
                v-model="formData.level"
                clearable
                placeholder="请选择优先级"
                @change="levelChange"
              >
                <el-option
                  v-for="(item, idx) in levelSelectList"
                  :key="idx"
                  :value="item.value"
                  :label="item.type"
                >
                  {{ item.type }}
                </el-option>
              </el-select>
              <span class="level_title" v-if="!isRepetition">{{
                "新增Mock默认优先级，为目前Mock最大优先级+1"
              }}</span>
              <span class="level_title" v-else>{{
                isRepetition == "true"
                  ? "优先级和已存在的Mock优先级重复，如确认不修改，则两者互换优先级"
                  : ""
              }}</span>
            </el-form-item>
            <el-form-item label="Mock描述">
              <el-input
                type="textarea"
                :rows="4"
                v-model="formData.caseDesc"
                clearable
                placeholder="请输入Mock描述"
              />
            </el-form-item>
          </div>
        </div>

        <div class="content_detail">
          <!-- API信息 -->
          <div class="content_header">API信息</div>
          <div class="form_info">
            <el-form-item label="所属资产">
              <span>{{ formData.sgName }}</span>
            </el-form-item>
            <el-form-item label="所属API">
              <span>{{ formData.serviceName }}</span>
            </el-form-item>
            <el-form-item label="URL">
              <span class="url_style">{{ formData.url }}</span>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <div class="content_detail">
        <!-- Mock条件 -->
        <div class="content_header">Mock条件</div>
        <div class="condition_wrapper">
          <div class="wrapper_create">
            <el-button
              v-show="type !== 'addRev'"
              type="primary"
              icon="el-icon-plus"
              @click="addCondition(navDefaultActive)"
              >添加参数</el-button
            >
          </div>
          <div class="middle_radio">
            <el-radio-group v-model="navDefaultActive" size="small">
              <el-radio-button label="body">Body</el-radio-button>
              <el-radio-button label="header">Header</el-radio-button>
            </el-radio-group>
          </div>
          <Table
            v-show="navDefaultActive == 'body'"
            class="table_style_ft table_style"
            :data="conditionList"
            :table="conditionColumns"
            :rowK="'paramOrder'"
            :treeProps="{ children: 'children' }"
            @operate="operate"
            @switchChange="switchChange"
            @inputChange="inputChange"
            @selectFocus="selectFocus"
            @selectChange="inputChange"
            @selectBlur="selectBlur"
          ></Table>
          <Table
            v-show="navDefaultActive == 'header'"
            class="table_style_ft table_style"
            :data="headerData"
            :table="headerColumns"
            :rowK="'paramOrder'"
            :treeProps="{ children: 'children' }"
            @operate="headerOperate"
            @selectFocus="headerSelectFocus"
          ></Table>
        </div>
      </div>

      <div class="content_detail">
        <div class="content_header">报文信息</div>
        <div class="detail_row">
          <div class="left_row">
            <PageMockRow
              ref="requestRow"
              type="mod"
              title="输入报文"
              :dataObj="requestMsg"
              :disabled="true"
            ></PageMockRow>
            <!-- :disabled="type == 'addRev'" -->
          </div>
          <div class="left_row">
            <PageMockRow
              ref="responseRow"
              type="mod"
              title="输出报文"
              :dataObj="responseMsg"
            ></PageMockRow>
          </div>
        </div>
      </div>
    </div>

    <!-- 选择API -->
    <PageDialog
      :dialogWidth="'56.3%'"
      :dialogTitle="dialogTitle"
      :dialogVisiable="dialogVisiable"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <SearchTop
          ref="formRef"
          :serviceForm="serviceForm"
          :form="form"
          @service="search"
          @reset="reset"
          class="search_top"
        ></SearchTop>
        <Table
          ref="radioTableRef"
          :data="dataList"
          :table="tableColumn"
          @radioChange="radioChange"
        ></Table>
        <PagePagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager="pager"
        >
        </PagePagination>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveDialog">保存</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import SearchTop from "@m/core/components/page_search_top"; // 头部搜索栏
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import PageMockRow from "@m/core/components/page_mock_row";
import PageDialog from "@m/core/components/page_dialog";
import { escape2Html } from "@m/utils/html2e";
import { reList } from "@m/utils/paramTree";
import { unduplicated } from "@m/utils/array";
export default {
  mixins: [mixin],
  components: {
    SearchTop,
    Table,
    PagePagination,
    PageMockRow,
    PageDialog,
  },
  props: {
    dataObj: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: () => "mod",
    },
    arsId: {
      type: String,
      default: () => "",
    },
    apiServiceType: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      navDefaultActive: "body",
      isRepetition: "",
      formData: {
        caseName: "",
        serviceId: "",
        level: "",
        caseDesc: "",
        serviceName: "",
        url: "",
        service: "", //apiId
        isNeed: "0",
        system: "",
        positiveAndNegative: "0", //正反Mock
        sgName: "",
      },
      //定义规则
      rules: {
        serviceId: [
          { required: true, trigger: "blur", message: "API不能为空" },
        ],
        caseName: [
          { required: true, trigger: "blur", message: "Mock名称不能为空" },
        ],
        level: [{ required: true, trigger: "blur", message: "优先级不能为空" }],
        isNeed: [{ required: true, trigger: "change", message: "不能为空" }],
      },

      requestMsg: "",
      responseMsg: "",
      needList: [
        { type: "否", value: "0" },
        { type: "是", value: "1" },
      ],

      dialogTitle: "选择所属API",
      dialogVisiable: false,
      // 弹框公共搜索
      serviceForm: [
        {
          type: "input",
          model: "apiName",
          placeholder: "API名称",
          style: {
            width: "240px",
          },
        },
      ],
      // 弹框搜索条件
      form: {
        apiName: "",
      },
      // 记录搜索条件
      searchForm: {
        apiName: "",
      },
      // 列表
      dataList: [],
      // 列表参数
      tableColumn: [
        {
          prop: "apiId",
          width: "45",
          type: "radio",
          tooltip: false,
        },
        {
          prop: "apiName",
          label: "API名称",
          width: "200",
          type: "textClick",
          operate: "check",
          tooltip: true,
        },
        {
          prop: "apiCode",
          label: "API编码",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "version",
          label: "版本",
          width: "120",
          type: "text",
        },
        {
          prop: "apiGroupName",
          label: "业务资产",
          width: "120",
          type: "text",
        },
        {
          prop: "apiDesc",
          label: "描述",
          width: "300",
          type: "text",
          tooltip: false,
        },
      ],
      // 页码相关
      pager: { currentPage: 1, turnPageShowNum: 10, total: 0 },
      currentItem: {},
      selectValData: [],
      headerSelectValData: [],
      // body表格
      conditionList: [],
      conditionColumns: [],
      // header
      headerData: [],
      headerColumns: [],
      levelList: [],
      levelMax: "",
      oldLevel: "",
      levelSelectList: [],
    };
  },
  methods: {
    init() {
      console.log(this.type);
      if (this.type === "addRev") {
        this.conditionColumns = [
          {
            width: "120",
            prop: "paramOrder",
            label: "排序",
            type: "text",
          },
          {
            width: "120",
            prop: "paramCName",
            label: "参数名称",
            type: "text",
          },
          {
            width: "150",
            prop: "paramName",
            label: "参数Key",
            type: "text",
            tooltip: true,
          },
          {
            width: "120",
            prop: "paramMark",
            label: "操作符",
            type: "text",
            filter: "paramMark",
          },
          {
            width: "150",
            prop: "paramValue",
            label: "参数值",
            type: "text",
            tooltip: true,
          },
          {
            width: "120",
            prop: "paramType",
            label: "参数值类型",
            type: "text",
          },
          {
            width: "120",
            prop: "isNeed",
            label: "是否取反",
            type: "switch",
          },
        ];
        this.headerColumns = [
          {
            width: "120",
            prop: "paramOrder",
            label: "排序",
            type: "text",
          },
          {
            width: "120",
            prop: "paramCName",
            label: "参数名称",
            type: "text",
          },
          {
            width: "150",
            prop: "paramName",
            label: "参数Key",
            type: "text",
            tooltip: true,
          },
          {
            width: "120",
            prop: "paramMark",
            label: "操作符",
            type: "text",
            filter: "paramMark",
          },
          {
            width: "150",
            prop: "paramValue",
            label: "参数值",
            type: "text",
            tooltip: true,
          },
          {
            width: "120",
            prop: "paramType",
            label: "参数值类型",
            type: "text",
          },
          {
            width: "120",
            prop: "isNeed",
            label: "是否取反",
            type: "switch",
          },
        ];
      } else {
        this.conditionColumns = [
          {
            width: "120",
            prop: "paramOrder",
            label: "排序",
            type: "text",
          },
          {
            width: "120",
            prop: "paramCName",
            label: "参数名称",
            type: "text",
          },
          {
            width: "120",
            prop: "paramName",
            label: "参数Key",
            type: "selectText",
            filterable: true,
            selectText: function (scope) {
              return scope.row.required != "1";
            },
            selectChange: function (scope) {
              const list = scope._self.table[2].selectVal;
              list.map((item) => {
                if (item.paramKey === scope.row.paramName) {
                  scope.row.paramType = item.paramType;
                  scope.row.paramCName = item.paramCName;
                  if (
                    item.paramType === "Object" ||
                    item.paramType === "List"
                  ) {
                    scope.row.paramValue = "";
                  } else {
                    scope.row.paramValue = item.paramValue;
                  }
                  scope.row.paramMark = "==";
                }
              });
            },
            selectVal: [],
          },
          {
            width: "120",
            prop: "paramMark",
            label: "操作符",
            type: "select",
            selectVal: [
              { type: "等于", value: "==" },
              { type: "不等于", value: "!=" },
              { type: "小于等于", value: "<=" },
              { type: "小于", value: "<" },
              { type: "大于", value: ">" },
              { type: "大于等于", value: ">=" },
            ],
            disabled: function (scope) {
              if (
                scope.row.paramType !== "Object" &&
                scope.row.paramType !== "List" &&
                scope.row.paramType !== "String" &&
                scope.row.paramType !== "boolean" &&
                scope.row.paramType !== "Boolean" &&
                scope.row.paramType !== "char" &&
                scope.row.paramType !== "Character"
              ) {
                return false;
              } else {
                return true;
              }
            },
          },
          {
            width: "150",
            prop: "paramValue",
            label: "参数值",
            type: "selectPicker",
            inputStyle: "width: 145px",
            format: "yyyyMMddHHmmss",
            filterable: true,
            selectPicker: function (scope) {
              return scope.row.paramType !== "Date";
            },
            disabled: function (scope) {
              if (
                scope.row.paramType !== "Object" &&
                scope.row.paramType !== "List"
              )
                return false;
              scope.row.paramValue ? (scope.row.paramValue = "") : "";
              return true;
            },
            selectVal: [],
          },
          {
            width: "120",
            prop: "paramType",
            label: "参数值类型",
            type: "select",
            disabled: function () {
              return true;
            },
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
          },
          {
            prop: "action",
            label: "操作",
            width: "100",
            type: "button",
            buttonList: [
              {
                desc: "添加",
                operate: "add",
                relation: function (scope) {
                  return (
                    scope.row.paramType === "Object" ||
                    scope.row.paramType === "List"
                  );
                },
              },
              {
                desc: "删除",
                operate: "del",
                relation: function (scope) {
                  return scope.row.required != "1";
                },
              },
            ],
          },
        ];
        this.headerColumns = [
          {
            width: "120",
            prop: "paramOrder",
            label: "排序",
            type: "text",
          },
          {
            width: "120",
            prop: "paramCName",
            label: "参数名称",
            type: "text",
          },
          {
            width: "120",
            prop: "paramName",
            label: "参数Key",
            type: "select",
            filterable: true,
            selectChange: function (scope) {
              const list = scope._self.table[2].selectVal;
              list.map((item) => {
                if (item.paramKey === scope.row.paramName) {
                  scope.row.paramType = item.paramType;
                  scope.row.paramCName = item.paramCName;
                  if (
                    item.paramType === "Object" ||
                    item.paramType === "List"
                  ) {
                    scope.row.paramValue = "";
                  } else {
                    scope.row.paramValue = item.paramValue;
                  }
                  scope.row.paramMark = "==";
                }
              });
            },
            selectVal: [],
          },
          {
            width: "120",
            prop: "paramMark",
            label: "操作符",
            type: "select",
            selectVal: [
              { type: "等于", value: "==" },
              { type: "不等于", value: "!=" },
              { type: "小于等于", value: "<=" },
              { type: "小于", value: "<" },
              { type: "大于", value: ">" },
              { type: "大于等于", value: ">=" },
            ],
            disabled: function (scope) {
              if (
                scope.row.paramType !== "Object" &&
                scope.row.paramType !== "List" &&
                scope.row.paramType !== "String" &&
                scope.row.paramType !== "boolean" &&
                scope.row.paramType !== "Boolean" &&
                scope.row.paramType !== "char" &&
                scope.row.paramType !== "Character"
              ) {
                return false;
              } else {
                return true;
              }
            },
          },
          {
            width: "150",
            prop: "paramValue",
            label: "参数值",
            type: "inputPicker",
            inputStyle: "width: 145px",
            format: "yyyyMMddHHmmss",
            inputPicker: function (scope) {
              return scope.row.paramType !== "Date";
            },
            disabled: function (scope) {
              if (
                scope.row.paramType !== "Object" &&
                scope.row.paramType !== "List"
              )
                return false;
              scope.row.paramValue ? (scope.row.paramValue = "") : "";
              return true;
            },
          },
          {
            width: "120",
            prop: "paramType",
            label: "参数值类型",
            type: "select",
            disabled: function () {
              return true;
            },
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
          },
          {
            prop: "action",
            label: "操作",
            width: "100",
            type: "button",
            buttonList: [
              {
                desc: "添加",
                operate: "add",
                relation: function (scope) {
                  return (
                    scope.row.paramType === "Object" ||
                    scope.row.paramType === "List"
                  );
                },
              },
              {
                desc: "删除",
                operate: "del",
              },
            ],
          },
        ];
      }
    },
    // body表格操作
    operate(operation, data) {
      if (operation == "add") {
        console.log(123);
        let n = data.paramOrder;
        if (data.children && data.children.length > 0) {
          const m = {
            paramOrder: n + "." + (data.children.length + 1),
            paramName: "",
            paramMark: "==",
            paramValue: "",
            paramType: "String",
          };
          data.children.push(m);
        } else {
          data.children = [];
          const m = {
            paramOrder: n + "." + 1,
            paramName: "",
            paramMark: "==",
            paramValue: "",
            paramType: "String",
          };
          data.children.push(m);
        }
        this.conditionList = JSON.parse(JSON.stringify(this.conditionList));
      } else if (operation == "del") {
        this.deleteNodeId(this.conditionList, data.paramOrder);
      }
    },
    // header表格操作
    headerOperate(operation, data) {
      if (operation == "add") {
        let n = data.paramOrder;
        if (data.children && data.children.length > 0) {
          const m = {
            paramOrder: n + "." + (data.children.length + 1),
            paramName: "",
            paramMark: "==",
            paramValue: "",
            paramType: "String",
          };
          data.children.push(m);
        } else {
          data.children = [];
          const m = {
            paramOrder: n + "." + 1,
            paramName: "",
            paramMark: "==",
            paramValue: "",
            paramType: "String",
          };
          data.children.push(m);
        }
        this.headerData = JSON.parse(JSON.stringify(this.headerData));
      } else if (operation == "del") {
        this.deleteNodeId(this.headerData, data.paramOrder);
      }
    },
    // 遍历数组 删除一个数组元素
    deleteNodeId(arrs, id) {
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
          this.deleteNodeId(arrs[i].children, id);
        }
        i++;
      }
    },
    addCondition(e) {
      if (e == "body") {
        const index =
          this.conditionList.length == 0
            ? "1"
            : this.conditionList[this.conditionList.length - 1].paramOrder * 1 +
              1 +
              "";
        this.conditionList.push({
          paramOrder: index,
          paramName: "",
          paramMark: "==",
          paramValue: "",
          paramType: "String",
        });
      } else {
        const index =
          this.headerData.length == 0
            ? "1"
            : this.headerData[this.headerData.length - 1].paramOrder * 1 +
              1 +
              "";
        this.headerData.push({
          paramOrder: index,
          paramName: "",
          paramMark: "==",
          paramValue: "",
          paramType: "String",
        });
      }
    },
    delCondition(e) {
      const arr = this.conditionList;
      const index = arr.findIndex((v) => v === e);
      index > -1 && arr.splice(index, 1);
    },
    // 展示列表
    showApi(e) {
      this.dialogVisiable = true;
      this.search();
    },
    //
    closeDialog() {
      this.$refs.radioTableRef.clearRadio();
      this.reset();
      this.dialogVisiable = false;
    },
    saveDialog() {
      if (!this.currentItem.apiId)
        return this.$message.error("请选择一个api！");
      this.getApiDetail(this.currentItem.apiId);
      this.getApiMessage(this.currentItem.apiId);
      this.getLevelList(this.currentItem.apiId);
      this.$refs.radioTableRef.clearRadio();
      this.closeDialog();
    },
    radioChange(e) {
      this.currentItem = e;
    },
    // 搜索
    search() {
      Object.assign(this.searchForm, this.form);
      this.pager.currentPage = 1;
      this.getList();
    },
    // 重置
    reset() {
      this.$refs.formRef.resetFields();
    },
    handleSizeChange(e) {
      this.getList();
    },
    handleCurrentChange(e) {
      this.pager.currentPage = e;
      this.getList();
    },
    // 获取列表
    async getList() {
      const params = {
        ...this.form,
        relySys: this.arsId,
        apiCode: "",
        groupId: "",
        bkId: "",
        apiState: this.apiServiceType ? "2" : "",
        apiServiceType: this.apiServiceType,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const res = await this.rpc.public.getApiManageList(params);
      this.dataList = res.apiList;
      this.pager.total = res.turnPageTotalNum * 1;
    },
    // 获取详情
    async getApiDetail(e) {
      const params = {
        apiId: e,
        paramDirection: "0",
      };
      const res = await this.rpc.apimgmt.getApiDetail(params);
      this.formData.sgName = res.apiGroupName;
      this.formData.service = res.apiCode;
      this.formData.url = res.apiCode;
      this.formData.serviceName = res.apiName;
      this.formData.serviceId = e;
      this.formData.system = res.relySys;
      this.conditionColumns[2].selectVal = [];
      //获取可选key值
      this.selectValData = res.puApiParams.map((item) => {
        item.type = item.paramKey;
        item.value = item.paramKey;
        item.key = item.paramType;
        return item;
      });
      const data = reList(this.selectValData);
      this.conditionList = this.getConditionList(data);
      console.log(this.conditionList);
      //header获取可选key值
      this.headerSelectValData = res.httpHeaderParams.map((item) => {
        item.type = item.paramKey;
        item.value = item.paramKey;
        item.key = item.paramType;
        return item;
      });
      this.headerData = JSON.parse(JSON.stringify(this.headerSelectValData));
      this.headerData = this.getConditionList(this.headerData);
    },
    // 新增时处理条件
    getConditionList(arrs, id) {
      let i = 1;
      let list = [];
      arrs.forEach((item, index) => {
        if (item.isNeed == "1") {
          list.push({
            paramOrder: id ? id + "." + i : i + "",
            paramCName: item.paramCName,
            paramType: item.paramType,
            paramValue: item.paramValue,
            paramName: item.paramKey,
            required: "1",
            paramMark: "==",
          });
          if (item.paramType == "List" || item.paramType == "Object") {
            if (item.children && item.children.length > 0) {
              list[i - 1].children = [];
              list[i - 1].children = this.getConditionList(
                item.children,
                list[i - 1].paramOrder
              );
            }
          }
          i++;
        }
      });
      return list;
    },
    async getLevelList(e) {
      const params = {
        apiId: e,
      };
      const res = await this.rpc.apimgmt.getLevelList(params);
      this.levelList = res.levelList;
      if (this.levelList.length > 0) {
        this.levelMax =
          Math.max.apply(
            Math,
            this.levelList.map(function (item) {
              return item.caseLevel;
            })
          ) +
          1 +
          "";
      } else {
        this.levelMax = "1";
      }
      this.formData.level = this.levelMax;
      for (let i = 0; i < this.levelMax; i++) {
        this.levelSelectList.push({ type: i + 1 + "", value: i + 1 + "" });
      }
    },
    async getApiMessage(e) {
      const params = {
        apiId: e,
      };
      const res = await this.rpc.apimgmt.getApiMessage(params);
      this.requestMsg = res.requestMsg;
      this.responseMsg = res.responseMsg;
    },
    //反Mock切换
    switchChange(e, o) {
      if (!o) {
        e.paramMark = filters.opParamMark(e.paramMark);
      }
      this.inputChange(e, o);
    },
    // 反显输入报文
    inputChange(e, o) {
      if (e.paramName === "") return;
      let data = JSON.parse(escape2Html(this.requestMsg));
      if (e.paramOrder.indexOf(".") === -1) {
        data = this.conductData(data, e);
      } else {
        let n = e.paramOrder.split(".");
        let id = "";
        let obj = data;
        let list = this.conditionList;
        for (let j = 0; j < n.length; j++) {
          id = id ? id + "." + n[j] : n[j];
          if (j === n.length - 1) {
            const res = this.conductDataList(list, obj, e, id, true, o);
            obj = res.obj;
            list = res.list;
          } else {
            const res = this.conductDataList(list, obj, e, id, false, o);
            obj = res.obj;
            list = res.list;
          }
        }
      }
      console.log(data);
      this.requestMsg = JSON.stringify(data);
    },
    conductDataList(list, data, e, id, flag, o) {
      let dataList = [];
      list.forEach((it) => {
        if (it.paramOrder === id) {
          dataList = it.children ? it.children : [];
          if (flag) {
            for (let item in data) {
              if (item === it.paramName) {
                if (
                  it.paramType == "String" ||
                  it.paramType == "boolean" ||
                  it.paramType == "Boolean" ||
                  it.paramType == "char" ||
                  it.paramType == "Character"
                ) {
                  if (it.paramMark == "!=") {
                    data[item] = "!" + e.paramValue;
                  } else {
                    data[item] = e.paramValue;
                  }
                } else if (
                  (it.paramType == "List" || it.paramType == "Object") &&
                  this.type === "addRev"
                ) {
                  if (it.isNeed == "0") {
                    dataList = dataList.map((mapItem) => {
                      if (mapItem.isNeed !== "0") {
                        mapItem.isNeed = "0";
                        mapItem.paramMark = filters.opParamMark(
                          mapItem.paramMark
                        );
                      }
                      this.$nextTick(() => {
                        this.switchChange(mapItem, "children");
                      });
                      return mapItem;
                    });
                  } else {
                    dataList = dataList.map((mapItem) => {
                      if (mapItem.isNeed !== "1") {
                        mapItem.isNeed = "1";
                        mapItem.paramMark = filters.opParamMark(
                          mapItem.paramMark
                        );
                      }
                      this.$nextTick(() => {
                        this.switchChange(mapItem, "children");
                      });
                      return mapItem;
                    });
                  }
                  // dataList = JSON.parse(JSON.stringify(dataList))
                } else {
                  if (it.paramMark == "!=" || it.paramMark == ">") {
                    data[item] = parseInt(e.paramValue) + 1 + "";
                  } else if (it.paramMark == "<") {
                    data[item] = parseInt(e.paramValue) - 1 + "";
                  } else {
                    data[item] = e.paramValue;
                  }
                }
              }
            }
          } else {
            if (o !== "children" && this.type === "addRev") {
              if (it.isNeed != "1") {
                it.isNeed = "1";
                it.paramMark = filters.opParamMark(it.paramMark);
              }
            }
            for (let item in data) {
              if (item === it.paramName && it.paramType === "List") {
                data = data[item][0];
              } else if (item === it.paramName && it.paramType === "Object") {
                data = data[item];
              }
            }
          }
        }
      });
      return {
        obj: data,
        list: dataList,
      };
    },
    conductData(data, e) {
      for (let item in data) {
        if (item === e.paramName) {
          if (
            (e.paramType == "List" || e.paramType == "Object") &&
            this.type === "addRev"
          ) {
            e.children.map((mapItem) => {
              if (mapItem.isNeed !== e.isNeed) {
                mapItem.isNeed = e.isNeed;
                mapItem.paramMark = filters.opParamMark(mapItem.paramMark);
              }
              this.$nextTick(() => {
                this.switchChange(mapItem, "children");
              });
            });
            return data;
          }
          if (
            e.paramType == "String" ||
            e.paramType == "boolean" ||
            e.paramType == "Boolean" ||
            e.paramType == "char" ||
            e.paramType == "Character"
          ) {
            if (e.paramMark == "!=") {
              data[item] = "!" + e.paramValue;
            } else {
              data[item] = e.paramValue;
            }
          } else {
            if (e.paramMark == "!=" || e.paramMark == ">") {
              data[item] = parseInt(e.paramValue) + 1 + "";
            } else if (e.paramMark == "<") {
              data[item] = parseInt(e.paramValue) - 1 + "";
            } else {
              data[item] = e.paramValue;
            }
          }
          return data;
        }
        // if (typeof data[item] !== "string") {
        //   data[item][0] = this.conductData(data[item][0], e);
        // }
      }
      // return data;
    },

    selectBlur(e, row) {
      if (!e) return;
      if (
        row.paramType == "byte" ||
        row.paramType == "double" ||
        row.paramType == "float" ||
        row.paramType == "int" ||
        row.paramType == "short"
      ) {
        let reg = /(^[0-9]\d*$)/ 
        if(!reg.test(e.target.value)) {
          return this.$message.error("参数值与参数类型不匹配")
        } else {
          row.paramValue = e.target.value;
          this.inputChange(row);
        }
      } else {
        row.paramValue = e.target.value;
        this.inputChange(row);
      }
    },

    // 选择框获得焦点时触发
    selectFocus(e, p) {
      if (p == "paramValue") {
        this.conditionColumns[4].selectVal = [];
        if (!e.paramName) return this.$message.error("请先选择参数Key");
        const params = {
          dictryNo: e.paramName,
          sysId: this.arsId,
        };
        this.rpc.apimgmt.getDictryNoExampleList(params).then((res) => {
          this.conditionColumns[4].selectVal = res.exampleValueList.map(
            (item) => {
              return {
                type: item,
                value: item,
                key: item,
              };
            }
          );
        });
        return;
      }
      if (e.paramOrder.indexOf(".") === -1) {
        let selectVal = this.selectValData.filter((item) => {
          return item.paramParentId === "";
        });
        this.conditionList.forEach((item) => {
          if (item.paramName !== e.paramName) {
            selectVal = selectVal.filter((it) => {
              return (
                item.paramName !== it.paramKey && e.paramName !== item.paramName
              );
            });
          }
        });
        this.conditionColumns[2].selectVal = selectVal;
      } else {
        let list = e.paramOrder.split(".");
        let i = "";
        for (let j = 0; j < list.length - 1; j++) {
          i = i ? i + "." + list[j] : list[j] + "";
        }
        let d = [];
        d = this.getParamOrder(this.conditionList, i);
        let selectVal = this.selectValData.filter((item) => {
          return item.paramParentId === d[0].paramOrder;
        });
        console.log(selectVal);
        d[1].children.forEach((item) => {
          if (item.paramName !== e.paramName) {
            selectVal = selectVal.filter((it) => {
              return item.paramName !== it.paramKey;
            });
          }
        });
        this.conditionColumns[2].selectVal = selectVal;
      }
    },
    // 查找父级的paramOrder
    getParamOrder(arrs, id) {
      let d = [];
      for (let i = 0; i < arrs.length; i++) {
        if (arrs[i].paramOrder == id) {
          d = this.selectValData.filter((data) => {
            return data.paramKey == arrs[i].paramName;
          });
          d.push(arrs[i]);
          return d;
        } else {
          if (arrs[i].paramType == "List" || arrs[i].paramType == "Object") {
            if (arrs[i].children && arrs[i].children.length > 0) {
              const j = this.getParamOrder(arrs[i].children, id);
              d = j.length > 0 ? j : d;
            }
          }
        }
      }
      return d;
    },
    // header选择框获得焦点时触发
    headerSelectFocus(e) {
      if (e.paramOrder.indexOf(".") === -1) {
        this.headerColumns[2].selectVal = this.headerSelectValData.filter(
          (item) => {
            return (
              item.paramParentId === "" &&
              item.paramType !== "List" &&
              item.paramType !== "Object"
            );
          }
        );
      } else {
        let i = e.paramOrder.split(".");
        let d = "";
        this.headerData.forEach((item) => {
          if (item.paramOrder === i[0]) {
            d = this.headerSelectValData.filter((data) => {
              return data.paramKey === item.paramName;
            });
          }
        });
        this.headerColumns[2].selectVal = this.headerSelectValData.filter(
          (item) => {
            return (
              item.paramParentId === d[0].paramOrder &&
              item.paramType !== "List" &&
              item.paramType !== "Object"
            );
          }
        );
      }
    },
    // 优先级值改变时触发
    levelChange(e) {
      if (e == this.oldLevel) {
        return (this.isRepetition = "false");
      }
      this.isRepetition = this.levelList.some((item) => {
        return item.caseLevel == e;
      })
        ? "true"
        : "false";
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
.aop_tradedesign_comps_apimgmt_case_form {
  ::v-deep .el-form-item__label {
    text-align: left;
    vertical-align: middle;
    float: left;
    font-family: $font_regular;
    font-size: 14px;
    color: $pri_ft_color;
    letter-spacing: 0;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  ::v-deep .el-select .el-input__inner:focus,
  ::v-deep .el-textarea__inner:focus,
  ::v-deep .el-input__inner:focus {
    border-color: $pri_br_color;
  }

  .content_wrapper {
    font-family: $font_regular;
    .edit_form {
      @include form;
    }
    .content_detail {
      position: relative;
      background: $base_white;
      padding: 20px 30px;
      margin-bottom: 16px;
      .content_header {
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        margin-bottom: 20px;
        font-weight: $font_weight_600;
      }
      .select_btn_box {
        ::v-deep .el-button {
          @include normal_button_common;
          margin-left: 20px;
          // height: 40px;
          // line-height: 40px;
        }
      }
      .detail_row {
        display: flex;
        .left_row {
          flex: 1;
          padding-right: 20px;
          position: relative;
          ::v-deep .el-textarea__inner {
            min-height: 600px !important;
          }
          ::v-deep .jv-code {
            min-height: 500px;
          }
          ::v-deep .el-textarea.is-disabled .el-textarea__inner {
            color: #606266;
            background-color: #ffffff;
          }
        }
        .row_title {
          font-size: 14px;
          color: #333;
          letter-spacing: 0;
          margin-bottom: 10px;
        }
      }
      .url_style {
        color: $warning_color;
      }
      .level_title {
        color: $danger_color;
        font-size: 12px;
        margin-left: 10px;
      }
    }
  }
  .condition_wrapper {
    // position: relative;
    .table_style {
      margin-top: 16px;
      ::v-deep .el-table th {
        color: $sec_ft_color;
      }
    }
    .wrapper_create {
      font-size: 14px;
      ::v-deep .el-button {
        @include large_button_common;
      }
    }
    .middle_radio {
      position: absolute;
      left: 0;
      right: 0;
      top: 18px;
      margin: 0 auto;
      text-align: center;
      width: 50%;
      ::v-deep .el-radio-button__inner {
        padding: 0 8px;
        height: 28px;
        line-height: 28px;
      }
      ::v-deep .el-radio-button:first-child .el-radio-button__inner {
        border-radius: 2px 0 0 2px;
      }
      ::v-deep .el-radio-button:last-child .el-radio-button__inner {
        border-radius: 0 2px 2px 0;
      }
    }
  }
  .search_top {
    padding: 0;
  }
}
</style>
