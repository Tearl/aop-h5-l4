<template>
  <div class="aop_tradedesign_comps_apimgmt_api_mod_params">
    <div class="params_header_wrapper">
      <el-form
        :model="formData"
        class="create_form"
        ref="formData"
        label-width="120px"
      >
        <div class="create_form_info">
          <el-form-item label="http请求头">
            <div class="input_wrapper">
              <div class="top_right_create">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="addParams(httpData, '1', '0')"
                  >添加请求头参数</el-button
                >
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="showParams('h')"
                  >从数据字典添加</el-button
                >
              </div>
              <div class="data_wrapper">
                <PageBigData
                  ref="httpDataRef"
                  parentClass="http_data"
                  :data="httpData"
                  :typeList="httpTypeList"
                  @add="addHdata"
                  @del="delHdata"
                  @addByDic="addHByDic"
                  @paramKeyBlur="paramKeyBlur"
                ></PageBigData>
              </div>
              <!-- <Table
                class="table_style_ft table_style"
                :data="httpData"
                rowK="paramOrder"
                :table="httpColumns"
                @operate="httpOperate"
              ></Table> -->
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="params_wrapper">
      <el-form
        :model="formData"
        class="create_form"
        ref="formData"
        label-width="120px"
      >
        <div class="create_form_info">
          <el-form-item label="参数配置">
            <div class="input_wrapper">
              <div class="top_right_create">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="addParams(sendData, '0', '0')"
                  >添加输入参数</el-button
                >
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="showParams('s')"
                  >从数据字典添加</el-button
                >
              </div>
              <!-- <Table
                class="table_style_ft table_style"
                :data="sendData"
                rowK="paramOrder"
                :table="sendColumns"
                @operate="operate"
              ></Table> -->
              <div class="data_wrapper">
                <PageBigData
                  ref="sendDataRef"
                  parentClass="send_data"
                  :data="sendData"
                  @add="addBdata"
                  @del="delBdata"
                  @addByDic="addByDic"
                ></PageBigData>
              </div>
            </div>
            <div class="output_wrapper">
              <div class="top_right_create">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="addParams(receiveData, '0', '1')"
                  >添加输出参数</el-button
                >
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="showParams('r')"
                  >从数据字典添加</el-button
                >
              </div>
              <!-- <Table
                class="table_style_ft table_style"
                :data="receiveData"
                :table="receiveColumns"
                rowK="paramOrder"
                @operate="operate"
              ></Table> -->
              <div class="data_wrapper">
                <PageBigData
                  ref="receiveDataRef"
                  parentClass="receive_data"
                  :data="receiveData"
                  @add="addBdata"
                  @del="delBdata"
                  @addByDic="addByDic"
                ></PageBigData>
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>

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
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import { unduplicated, setSerialNumber } from "@m/utils/array";
import { dict2Para } from "@m/utils/dict2Para";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import PageBigData from "@m/core/components/page_big_data";
import { reList } from "@m/utils/paramTree";
export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    PagePagination,
    ServiceTop,
    PageBigData,
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
      isHandleParamType: "",
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
    };
  },
  methods: {
    init() {
      this.getParamsList();
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
      const data = {
        paramOrder: order.toString(),
        paramCName: "",
        paramValue: "",
        paramLength: "",
        paramValueType: "String",
        paramPosition: pos,
        paramDirection: direct,
        paramDesc: "",
        isNeed: "0", // 0过滤，1不过虑
        paramParentId: "",
        action: "0",
      };
      const mixData = Object.assign(data, prs);
      arrs.push(mixData);
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
        paramCName: "",
        paramValue: "",
        paramLength: "",
        paramValueType: "String",
        paramPosition: item.paramPosition,
        paramDirection: item.paramDirection,
        paramDesc: "",
        isNeed: "0", // 0过滤，1不过虑
        paramParentId: item.paramOrder,
        action: "0",
      };
      const mixData = Object.assign(data, prs);
      item.children = item.children || [];
      item.children.push(mixData);
      // arrs = JSON.parse(JSON.stringify(arrs));
      // this.refreshParams();
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
      this.isHandleParamType = e;
      this.selectionData = [];
      this.tableData = [];
      this.addVisible = true;
      this.resetSearch();
      this.getParamsList();
    },
    // 获取输入输出参数列表数据
    async getParamsList() {
      const data = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        sysId: this.arsId,
        ...this.formInline,
      };
      const res = await this.rpc.systemmgmt.getSysDictionaryList(data);
      this.dictList = setSerialNumber(res.dictionariesInfoBoList);
      this.pager.total = res.turnPageTotalNum * 1;
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
    saveParams() {
      const data = JSON.parse(JSON.stringify(this.tableData));
      if (this.isHandleParamType === "addChild") {
        data.map((item) => {
          const prs = {
            paramKey: item.dictryNo,
            paramCName: item.dictryNm,
            paramLength: item.dictryLength,
            paramValueType: item.dictryTyp,
            paramDesc: item.dictryDescr,
          };
          this.addChildParams(
            this.isData.paramPosition === "1"
              ? this.httpData
              : this.isData.paramDirection === "1"
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
          };
          this.addParams(
            this.isHandleParamType === "h"
              ? this.httpData
              : this.isHandleParamType === "r"
              ? this.receiveData
              : this.sendData,
            this.isHandleParamType === "h" ? "1" : "0",
            this.isHandleParamType === "r" ? "1" : "0",
            prs
          );
        });
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
.aop_tradedesign_comps_apimgmt_api_mod_params {
  .params_wrapper,
  .params_header_wrapper {
    padding: 20px 30px;
    .input_wrapper,
    .output_wrapper {
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
      margin-top: 20px;
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
  }
}
</style>
