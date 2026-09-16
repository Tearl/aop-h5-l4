<template>
  <div class="aop_tradedesign_comps_dicmgmt_sys_header">
    <div class="create_content_wrapper">
      <div class="detail_content">
        <el-radio-group :value="templateNm" @input="templateNmChange">
          <el-radio
            v-for="item in this.templateList"
            :key="item.templateId"
            :label="item.templateNm"
            >{{ item.templateNm }}</el-radio
          >
        </el-radio-group>
        <div class="params_header">报文格式设置</div>
        <el-form
          :model="formData"
          class="create_form"
          ref="formData"
          label-width="120px"
        >
          <div class="create_form_info">
            <el-form-item label="http请求头">
              <div class="input_wrapper">
                <div class="top_right_create" v-show="templateNm == '自定义'">
                  <el-button type="primary" icon="el-icon-plus" @click="addHttp"
                    >添加请求头参数</el-button
                  >
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="showParams('h')"
                    >从数据字典添加</el-button
                  >
                </div>
                <Table
                  class="table_style_ft table_style"
                  :data="httpData"
                  rowK="paramOrder"
                  :table="httpTableColumns"
                  @operate="httpOperate"
                ></Table>
              </div>
            </el-form-item>
            <el-form-item label="参数配置">
              <div class="input_wrapper">
                <div class="top_right_create" v-show="templateNm == '自定义'">
                  <el-button type="primary" icon="el-icon-plus" @click="addSend"
                    >添加输入参数</el-button
                  >
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="showParams('s')"
                    >从数据字典添加</el-button
                  >
                </div>
                <Table
                  class="table_style_ft table_style"
                  :data="sendData"
                  rowK="paramOrder"
                  :table="tableColumns"
                  @operate="operate"
                ></Table>
              </div>
              <div class="output_wrapper">
                <div class="top_right_create" v-show="templateNm == '自定义'">
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="addReceive"
                    >添加输出参数</el-button
                  >
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="showParams('r')"
                    >从数据字典添加</el-button
                  >
                </div>
                <Table
                  class="table_style_ft table_style"
                  :data="receiveData"
                  :table="receiveColumns"
                  rowK="paramOrder"
                  @operate="operate"
                  @switchChange="switchChange"
                ></Table>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <PageFooter @handleConfirm="preservation" :cancelLabel="''"> </PageFooter>

    <!-- 添加参数 -->
    <PageDialog
      :dialogWidth="'70%'"
      :dialogTitle="'请选择参数'"
      :dialogVisiable="addVisible"
      @closeDialog="addVisible = false"
      class="create_dialog"
    >
      <div slot="box">
        <div class="add_dialog_conf">
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
            :tableType="'selection'"
            :cellStyle="dictListCellStyle"
            @selectionChange="handleSelectionChange"
          ></Table>
          <!-- 分页器 -->
          <PagePagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager="pager"
          >
          </PagePagination>
          <div class="show_conf">
            <div class="show_conf_title">
              已选择<span>{{ tableData && tableData.length }}</span
              >个：
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
      </div>
      <div slot="footer">
        <el-button @click.native="addVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="saveParams">确定</el-button>
      </div>
    </PageDialog>
  </div>
</template>
<script>
import PageHeader from "@m/core/components/page_header";
import Table from "@m/core/components/page_table";
import PageFooter from "@m/core/components/page_footer";
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import { mixList, reList } from "@m/utils/paramTree";
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import { unduplicated, setSerialNumber } from "@m/utils/array";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
export default {
  mixins: [mixin],
  components: {
    PageHeader,
    Table,
    PageFooter,
    PageDialog,
    PagePagination,
    ServiceTop,
  },
  props: {
    arsId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      templateId: "",
      sendData: [], // 请求报文
      receiveData: [], // 响应报文
      formData: {},
      httpData: [],
      httpTableColumns: [
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
          buttonList: [
            {
              desc: "删除",
              operate: "del",
            },
          ],
        },
      ],
      tableColumns: [
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
          prop: "paramPosition",
          label: "是否是应用报文",
          type: "switch",
          disabled: function (scope) {
            return (
              (scope.row.paramValueType !== "List" &&
                scope.row.paramValueType !== "Object") ||
              scope.row.paramParentId !== ""
            );
          },
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
              desc: "从数据字典添加",
              operate: "dicAdd",
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
          prop: "paramPosition",
          label: "是否是应用报文",
          type: "switch",
          disabled: function (scope) {
            return (
              (scope.row.paramValueType !== "List" &&
                scope.row.paramValueType !== "Object") ||
              scope.row.paramParentId !== ""
            );
          },
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
              desc: "从数据字典添加",
              operate: "dicAdd",
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
        // {
        //   prop: "dictryGategName",
        //   label: "所属分类",
        //   width: "90",
        //   type: "text",
        //   tooltip: true,
        // },
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
        paraGateg: "",
        paraType: "",
      },
      isHandleParamType: "",
      // 当前数据
      isData: {},
      templateNm: "",
      templateList: [],
    };
  },
  methods: {
    async init() {
      await this.getFormatList();
      this.getDetail();
    },
    initTable() {
      if (this.templateNm == "自定义") {
        this.tableColumns = [
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
          prop: "paramPosition",
          label: "是否是应用报文",
          type: "switch",
          disabled: function (scope) {
            return (
              (scope.row.paramValueType !== "List" &&
                scope.row.paramValueType !== "Object") ||
              scope.row.paramParentId !== ""
            );
          },
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
                desc: "从数据字典添加",
                operate: "dicAdd",
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
        ];
        this.httpTableColumns = [
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
          buttonList: [
            {
              desc: "删除",
              operate: "del",
            },
          ],
        },
      ],
        this.receiveColumns = [
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
            prop: "paramPosition",
            label: "是否是应用报文",
            type: "switch",
            disabled: function (scope) {
              return (
                (scope.row.paramValueType !== "List" &&
                  scope.row.paramValueType !== "Object") ||
                scope.row.paramParentId !== ""
              );
            },
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
                desc: "从数据字典添加",
                operate: "dicAdd",
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
        ];
      } else {
        this.httpTableColumns = [
          {
            width: "200px",
            prop: "paramKey",
            label: "参数Key",
            type: "text",
            tooltip: true,
          },
          {
            width: "160px",
            prop: "paramCName",
            label: "参数名称",
            type: "text",
            tooltip: true,
          },
          {
            width: "140px",
            prop: "paramValueType",
            label: "参数值类型",
            type: "text",
            tooltip: true,
          },
          {
            width: "90px",
            prop: "paramLength",
            label: "参数长度",
            type: "text",
            tooltip: true,
          },
          {
            prop: "isNeed",
            label: "是否必输",
            type: "text",
            tooltip: true,
            filter: "isFilter",
          },
          {
            prop: "paramValue",
            label: "默认值",
            type: "text",
            tooltip: true,
          },
          {
            width: "180px",
            prop: "paramDesc",
            label: "参数描述",
            type: "text",
            tooltip: true,
          },
        ];
        this.tableColumns = [
          {
            width: "200px",
            prop: "paramKey",
            label: "参数Key",
            type: "text",
            tooltip: true,
          },
          {
            width: "160px",
            prop: "paramCName",
            label: "参数名称",
            type: "text",
            tooltip: true,
          },
          {
            width: "140px",
            prop: "paramValueType",
            label: "参数值类型",
            type: "text",
            tooltip: true,
          },
          {
            width: "90px",
            prop: "paramLength",
            label: "参数长度",
            type: "text",
            tooltip: true,
          },
          {
            prop: "isNeed",
            label: "是否必输",
            type: "text",
            tooltip: true,
            filter: "isFilter",
          },
          {
            prop: "paramValue",
            label: "默认值",
            type: "text",
            tooltip: true,
          },
          {
            prop: "paramPosition",
            label: "是否是应用报文",
            type: "switch",
            disabled: function (scope) {
              return (
                (scope.row.paramValueType !== "List" &&
                  scope.row.paramValueType !== "Object") ||
                scope.row.paramParentId !== ""
              );
            },
          },
          {
            width: "180px",
            prop: "paramDesc",
            label: "参数描述",
            type: "text",
            tooltip: true,
          },
        ];
        this.receiveColumns = [
          {
            width: "200px",
            prop: "paramKey",
            label: "参数Key",
            type: "text",
            tooltip: true,
          },
          {
            width: "160px",
            prop: "paramCName",
            label: "参数名称",
            type: "text",
            tooltip: true,
          },
          {
            width: "140px",
            prop: "paramValueType",
            label: "参数值类型",
            type: "text",
            tooltip: true,
          },
          {
            width: "90px",
            prop: "paramLength",
            label: "参数长度",
            type: "text",
            tooltip: true,
          },
          {
            prop: "isNeed",
            label: "是否必输",
            type: "text",
            tooltip: true,
            filter: "isFilter",
          },
          {
            prop: "paramValue",
            label: "默认值",
            type: "text",
            tooltip: true,
          },
          {
            prop: "paramPosition",
            label: "是否是应用报文",
            type: "text",
            tooltip: true,
            filter: "isFilter",
          },
          {
            width: "180px",
            prop: "paramDesc",
            label: "参数描述",
            type: "text",
            tooltip: true,
          },
        ];
      }
    },
    async getFormatList() {
      const res = await this.rpc.systemmgmt.getFormatList()
      this.templateList = res.templates;
      this.templateList.push({
        templateId: "",
        templateCode: "",
        templateNm: "自定义",
      });
    },
    templateNmChange(e) {
      this.templateNm = e;
      this.httpData = [];
      this.sendData = [];
      this.receiveData = [];
      this.initTable();
      if (this.templateNm == "自定义") return;
      this.getDetail("change");
    },
    getDetail(e) {
      let params = {};
      if (e == "change") {
        const obj = this.templateList.filter((item) => {
          return item.templateNm == this.templateNm;
        });
        console.log(this.templateList);
        console.log(this.templateNm);
        console.log(123,obj)
        params = {
          templateCode: obj[0].templateCode,
        };
      } else {
        params = {
          arsId: this.arsId,
        };
      }
      this.rpc.systemmgmt.getHeaderInfo(params).then((res) => {
        if(!res.templateName) {
          this.templateNm = "IFP3.X报文"
          this.getDetail("change")
          return
        } else {
          this.templateNm = res.templateName
        }
        this.initTable();
        // 处理http数据
        this.httpData = res.paramList.filter((item) => {
          return item.paramPosition == "2";
        });
        // this.httpData = reList(headerList, "paramParentId", "paramOrder");

        // 处理输入参数
        const sendData = res.paramList.filter((item) => {
          return item.paramPosition != "2" && item.paramDirection == "0";
        });
        this.sendData = reList(sendData, "paramParentId", "paramOrder");

        // 处理输出参数
        const receiveData = res.paramList.filter((item) => {
          return item.paramPosition != "2" && item.paramDirection == "1";
        });
        this.receiveData = reList(receiveData, "paramParentId", "paramOrder");
      });
    },
    handleEmptyList(data) {
      return data.filter((item) => item.paramKey == "" || item.paramCName == "")
    },  
    // 点击确定按钮
    async preservation() {
      const httpData = JSON.parse(
        JSON.stringify(mixList(this.httpData, "children"))
      );
      const h = this.handleEmptyList(httpData)
      if(h.length > 0) return this.$message.error("http请求头参数key、参数名称不可为空！请检查")

      const sendData = JSON.parse(
        JSON.stringify(mixList(this.sendData, "children"))
      );
      const s = this.handleEmptyList(sendData)
      if(s.length > 0) return this.$message.error("输入报文参数key、参数名称不可为空！请检查")

      const receiveData = JSON.parse(
        JSON.stringify(mixList(this.receiveData, "children"))
      );
      const r = this.handleEmptyList(receiveData)
      if(r.length > 0) return this.$message.error("输出报文参数key、参数名称不可为空！请检查")

      const params = {
        paramList: [...httpData, ...sendData, ...receiveData],
        templateNm: this.templateNm,
        arsId: this.arsId,
      };
      if (params.paramList) {
        params.paramList.map((item, index) => {
          item.paramIndex = index;
        });
      }
      console.log(params,"--------")
      const res = await this.rpc.systemmgmt.modHeaderInfo(params);
      this.$notify({
        title: "成功",
        message: "编辑报文头成功",
        duration: 2000,
        type: "success",
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

    //http表头
    // 添加http表头第一级发送报文参数
    addHttp() {
      if (this.httpData.length > 0) {
        if (this.httpData.length < 10) {
          var a =
            this.httpData[this.httpData.length - 1].paramOrder.substr(0, 1) *
              1 +
            1;
        } else {
          var a =
            this.httpData[this.httpData.length - 1].paramOrder.substr(0, 2) *
              1 +
            1;
        }
      } else {
        var a = 1;
      }
      var data = {
        paramOrder: a.toString(),
        paramName: "",
        paramCName: "",
        paramValue: "",
        paramLength: "",
        paramMappingKey: "",
        paramValueType: "String",
        paramPosition: "2",
        paramDirection: "0",
        paramType: "0",
        paramDesc: "",
        paramIsCheck: "0",
        //   isEncode: '0',  // 加密
        isNeed: "1", // 0过滤，1不过虑
        checkRule: "",
        checkPattern: "",
        //   encodeMappingKey: '',
        paramParentId: "",
        action: "0",
      };
      this.httpData.push(data);
    },
    //http头处理
    httpOperate(operation, data) {
      if (data.paramDirection == "0") {
        if (operation == "add") {
          this.addHttpChild(data);
        } else if (operation == "dicAdd") {
          this.isData = data;
          this.showParams("addChild");
        } else {
          this.delHttp(this.httpData, data.paramOrder);
        }
      }
    },
    //添加http表头报文参数
    addHttpChild(item) {
      let n = item.paramOrder;
      if (item.children && item.children.length > 0) {
        const m = {
          paramOrder: n + "." + (item.children.length + 1),
          paramName: "",
          paramCName: "",
          paramValue: "",
          paramLength: "",
          paramMappingKey: "",
          paramValueType: "String",
          paramDirection: "0",
          paramPosition: "2",
          paramType: "0",
          paramDesc: "",
          paramIsCheck: "0",
          checkRule: "",
          checkPattern: "",
          paramParentId: item.paramOrder,
          action: "0",
        };
        item.children.push(m);
      } else {
        item.children = [];
        const m = {
          paramOrder: n + "." + 1,
          paramName: "",
          paramCName: "",
          paramValue: "",
          paramLength: "",
          paramMappingKey: "",
          paramValueType: "String",
          paramDirection: "0",
          paramPosition: "2",
          paramType: "0",
          paramDesc: "",
          paramIsCheck: "0",
          checkRule: "",
          checkPattern: "",
          paramParentId: item.paramOrder,
          action: "0",
        };
        item.children.push(m);
        this.httpData = JSON.parse(JSON.stringify(this.httpData));
      }
    },
    // 删除http表头参数
    delHttp(arrs, id) {
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
          this.delHttp(arrs[i].children, id);
        }
        i++;
      }
    },

    // 输入输出
    // 输入输出处理
    operate(operation, data) {
      if (data.paramDirection == "0") {
        if (operation == "add") {
          this.addSendChild(data);
        } else if (operation == "dicAdd") {
          this.isData = data;
          this.showParams("addChild");
        } else {
          this.delSend(this.sendData, data.paramOrder);
        }
      } else {
        if (operation == "add") {
          this.addReceiveChild(data);
        } else if (operation == "dicAdd") {
          this.isData = data;
          this.showParams("addChild");
        } else {
          this.delReceive(this.receiveData, data.paramOrder);
        }
      }
    },
    // 添加第一级发送报文参数
    addSend() {
      if (this.sendData.length > 0) {
        if (this.sendData.length < 10) {
          var a =
            this.sendData[this.sendData.length - 1].paramOrder.substr(0, 1) *
              1 +
            1;
        } else {
          var a =
            this.sendData[this.sendData.length - 1].paramOrder.substr(0, 2) *
              1 +
            1;
        }
      } else {
        var a = 1;
      }
      var data = {
        paramOrder: a.toString(),
        paramName: "",
        paramCName: "",
        paramValue: "",
        paramLength: "",
        paramMappingKey: "",
        paramValueType: "String",
        paramPosition: "0",
        paramDirection: "0",
        paramType: "0",
        paramDesc: "",
        paramIsCheck: "0",
        //   isEncode: '0',  // 加密
        isNeed: "1", // 0过滤，1不过虑
        checkRule: "",
        checkPattern: "",
        //   encodeMappingKey: '',
        paramParentId: "",
        action: "0",
      };
      this.sendData.push(data);
    },
    // 添加第一级返回报文参数
    addReceive() {
      if (this.receiveData.length > 0) {
        if (this.receiveData.length < 10) {
          var a =
            this.receiveData[this.receiveData.length - 1].paramOrder.substr(
              0,
              1
            ) *
              1 +
            1;
        } else {
          var a =
            this.receiveData[this.receiveData.length - 1].paramOrder.substr(
              0,
              2
            ) *
              1 +
            1;
        }
      } else {
        var a = 1;
      }
      var data = {
        paramOrder: a.toString(),
        paramName: "",
        paramCName: "",
        paramValue: "",
        paramLength: "",
        paramMappingKey: "",
        paramValueType: "String",
        paramPosition: "0",
        paramDirection: "1",
        paramType: "0",
        paramDesc: "",
        paramIsCheck: "0",
        // isEncode: '0', // 加密
        isNeed: "1", // 是否过滤
        checkRule: "",
        checkPattern: "",
        // encodeMappingKey: '',
        paramParentId: "",
        action: "0",
      };
      this.receiveData.push(data);
    },
    // 删除发送报文参数
    delSend(arrs, id) {
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
          this.delSend(arrs[i].children, id);
        }
        i++;
      }
    },
    // 删除返回报文参数
    delReceive(arrs, id) {
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
          this.delSend(arrs[i].children, id);
        }
        i++;
      }
    },
    // 添加子级发送报文参数
    addSendChild(item) {
      let n = item.paramOrder;
      if (item.children && item.children.length > 0) {
        console.log(item);
        const m = {
          paramOrder: n + "." + (item.children.length + 1),
          paramName: "",
          paramCName: "",
          paramValue: "",
          paramLength: "",
          paramMappingKey: "",
          paramValueType: "String",
          paramDirection: "0",
          paramPosition: "0",
          paramType: "0",
          paramDesc: "",
          paramIsCheck: "0",
          checkRule: "",
          checkPattern: "",
          paramParentId: item.paramOrder,
          action: "0",
        };
        item.children.push(m);
      } else {
        item.children = [];
        const m = {
          paramOrder: n + "." + 1,
          paramName: "",
          paramCName: "",
          paramValue: "",
          paramLength: "",
          paramMappingKey: "",
          paramValueType: "String",
          paramDirection: "0",
          paramPosition: "0",
          paramType: "0",
          paramDesc: "",
          paramIsCheck: "0",
          checkRule: "",
          checkPattern: "",
          paramParentId: item.paramOrder,
          action: "0",
        };
        item.children.push(m);
        this.sendData = JSON.parse(JSON.stringify(this.sendData));
      }
    },
    // 添加子级返回报文参数
    addReceiveChild(item) {
      let n = item.paramOrder;
      if (item.children && item.children.length > 0) {
        const m = {
          paramOrder: n + "." + (item.children.length + 1),
          // paramOrder: "",
          paramName: "",
          paramCName: "",
          paramValue: "",
          paramLength: "",
          paramMappingKey: "",
          paramValueType: "String",
          paramDirection: "1",
          paramPosition: "0",
          paramType: "0",
          paramDesc: "",
          paramIsCheck: "0",
          isNeed: "1", // 是否过滤
          checkRule: "",
          checkPattern: "",
          paramParentId: item.paramOrder,
          action: "0",
        };
        item.children.push(m);
      } else {
        item.children = [];
        const m = {
          paramOrder: n + "." + 1,
          // paramOrder: "",
          paramName: "",
          paramCName: "",
          paramValue: "",
          paramLength: "",
          paramMappingKey: "",
          paramValueType: "String",
          paramDirection: "1",
          paramPosition: "0",
          paramType: "0",
          paramDesc: "",
          paramIsCheck: "0",
          isNeed: "1", // 是否过滤
          checkRule: "",
          checkPattern: "",
          paramParentId: item.paramOrder,
          action: "0",
        };
        item.children.push(m);
        this.receiveData = JSON.parse(JSON.stringify(this.receiveData));
      }
    },
    switchChange(e) {
      const i = this.receiveData.indexOf(e);
      this.receiveData.forEach((item, index) => {
        if (index !== i) {
          item.paramPosition = 0;
        }
      });
    },

    //参数列表操作
    // 添加输入输出按钮点击
    showParams(e) {
      this.isHandleParamType = e;
      this.selectionData = [];
      this.tableData = [];
      this.addVisible = true;
      this.resetSearch();
      this.getParamsList();
      // this.getClassifyTypeList();
    },
    // 数据分类的下拉列表
    // async getClassifyTypeList() {
    //   const params = { turnPageShowNum: "0" };
    //   const res = await this.rpc.systemmgmt.getClassifyTypeList(params);
    //   this.serviceForm[1].select = res.serviceList.map((item) => {
    //     item.type = item.clsfNm;
    //     item.value = item.clsfId;
    //     return item;
    //   });
    // },
    // 获取输入输出参数列表数据
    async getParamsList() {
      const data = {
        sysId: this.arsId,
        ...this.formInline,
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const { dictionariesInfoBoList, turnPageTotalNum } =
        await this.rpc.systemmgmt.getSysDictionaryList(data);
      this.dictList = setSerialNumber(dictionariesInfoBoList);
      this.pager.total = turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableData();
      });
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
    goSearch() {
      this.isRecord = true;
      this.pager.currentPage = "1";
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
    saveParams() {
      const data = JSON.parse(JSON.stringify(this.tableData));
      console.log(data);
      data.map((item) => {
        this.handleDataPush(item);
      });
      console.log(this.httpData);
      if (this.isHandleParamType === "addChild") {
        this.httpData = JSON.parse(JSON.stringify(this.httpData));
        this.sendData = JSON.parse(JSON.stringify(this.sendData));
        this.receiveData = JSON.parse(JSON.stringify(this.receiveData));
      }
      this.$nextTick(() => {
        this.$refs.dictListTableRef.clearSelection();
      });
      this.pager.currentPage = "1";
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
    //多选显示
    dictListCellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.dictryPid !== "" && column.type === "selection") {
        return { visibility: "hidden" };
      }
    },
    handleDataPush(e) {
      const oldData =
        this.isHandleParamType === "h"
          ? this.httpData
          : this.isHandleParamType === "addChild"
          ? this.isData
          : this.isHandleParamType === "s"
          ? this.sendData
          : this.receiveData;
      let a = 0;
      if (this.isHandleParamType === "addChild") {
        a =
          this.isData.paramOrder +
          "." +
          (this.isData.children ? this.isData.children.length + 1 : 1);
      } else {
        if (oldData.length > 0) {
          if (oldData.length < 10) {
            a = oldData[oldData.length - 1].paramOrder.substr(0, 1) * 1 + 1;
          } else {
            a = oldData[oldData.length - 1].paramOrder.substr(0, 2) * 1 + 1;
          }
        } else {
          a = 1;
        }
      }
      const data = {
        paramOrder: a.toString(),
        paramKey: e.dictryNo,
        paramName: e.dictryNm,
        paramCName: e.dictryNm,
        paramValue: "",
        paramLength: e.dictryLength,
        paramMappingKey: "",
        paramValueType: e.dictryTyp,
        paramPosition: this.isHandleParamType === "h" ? "2" : "0",
        paramDirection: this.isHandleParamType === "addChild" ? this.isData.paramDirection : (this.isHandleParamType === "r" ?  "1" : "0"),
        paramType: "0",
        paramDesc: e.dictryDescr,
        paramIsCheck: "0",
        isNeed: "1",
        checkRule: "",
        checkPattern: "",
        paramParentId:
          this.isHandleParamType === "addChild" ? this.isData.paramOrder : "",
        action: "0",
      };

      if (this.isHandleParamType === "h") {
        this.httpData.push(data);
        this.httpData = unduplicated(this.httpData, "paramKey");
      } else if (this.isHandleParamType === "s") {
        this.sendData.push(data);
        this.sendData = unduplicated(this.sendData, "paramKey");
      } else if (this.isHandleParamType === "r") {
        this.receiveData.push(data);
        this.receiveData = unduplicated(this.receiveData, "paramKey");
      } else {
        if (!this.isData.children) {
          this.isData.children = [];
        }
        this.isData.children.push(data);
        this.isData.children = unduplicated(this.isData.children, "paramKey");
      }
    },
  },
  created() {
    // this.init();
  },
  mounted() {
    this.init()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_sys_header {
  .create_content_wrapper {
    // padding: 16px 24px;
    .detail_content {
      background: $base_white;
      padding: 20px 30px;
      margin-bottom: 16px;
      .params_header {
        padding: 0px 0px 20px;
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
      }
      .content_header {
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
        margin-bottom: 20px;
        span {
          margin-right: 20px;
        }
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
      .top_right_create {
        font-size: 14px;
        margin-bottom: 10px;
        ::v-deep .el-button {
          @include large_button_common;
        }
      }
      .el-radio-group {
        line-height: 45px;
        padding-left: 120px;
        .el-radio {
          font-size: 14px;
          font-weight: $font_weight_600;
          color: $pri_ft_color;
        }
      }
    }
  }
  ::v-deep .table_style .el-radio__label {
    display: none;
  }
  .table_style {
    // margin-top: 16px;
    ::v-deep .el-table th {
      line-height: 0;
      color: $sec_ft_color;
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
  }
}
</style>
