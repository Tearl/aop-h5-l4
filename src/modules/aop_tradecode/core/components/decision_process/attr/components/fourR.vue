<template>
  <div class="aop_tradecode_comps_design_4R_attr">
    <div class="attr_main">
      <div class="attr_title underLine" v-show="!type">
        <div>4R组件</div>
      </div>
      <div class="attr_box">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              组件名称：<span v-if="isRead" class="attr_show_item_i">{{
                formData.actionDesc
              }}</span>
            </div>
            <div class="attr_show_item_c" v-if="!isRead">
              <el-input v-model="formData.actionDesc" size="mini"></el-input>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              组件描述：<span v-if="isRead" class="attr_show_item_i">{{
                formData.actionMsg
              }}</span>
            </div>
            <div class="attr_show_item_c" v-if="!isRead">
              <el-input
                :disabled="isRead"
                type="textarea"
                v-model="formData.actionMsg"
                placeholder="组件描述"
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="attr_send">
            <div class="attr_pre_title">
              <div>
                <span class="attr_pre_title_b">输入参数：</span>
                <span v-if="!isRead" class="icon" @click="addParams('s')"
                  >增加</span
                >
                <el-checkbox v-model="isNeedCheck" @change="isNeedChange"
                  >非必输项</el-checkbox
                >
              </div>
              <i
                class="el-icon-arrow-down"
                :class="{ hidden: inputParamsVisibleAtSetting }"
                @click="changeParamsVisible('s')"
              >
              </i>
            </div>
            <div class="attr_show_item_c" v-show="inputParamsVisibleAtSetting">
              <Table
                class="table"
                :data="inputParamsListAtSetting"
                :table="inputParamsColumnAtSetting"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
                :rowClass="rowClass"
                @switchChange="switchChange"
                @inputChange="inputChange"
                @selectChange="(row, prop) => selectChange(row, prop, 's')"
                @selectBlur="selectBlur"
                @selectFocus="(row, prop) => selectFocus(row, prop, 's')"
                @operate="operate"
              ></Table>
            </div>
          </div>
          <div class="attr_recive">
            <div class="attr_pre_title">
              <div>
                <span class="attr_pre_title_b">输出参数：</span>
                <span v-if="!isRead" class="icon" @click="addParams('r')"
                  >增加</span
                >
              </div>
              <i
                class="el-icon-arrow-down"
                :class="{ hidden: outputParamsVisibleAtSetting }"
                @click="changeParamsVisible('r')"
              >
              </i>
            </div>
            <div class="attr_show_item_c" v-show="outputParamsVisibleAtSetting">
              <Table
                class="table"
                :data="outputParamsListAtSetting"
                :table="outputParamsColumnAtSetting"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
                @switchChange="switchChange"
                @inputChange="inputChange"
                @selectChange="(row, prop) => selectChange(row, prop, 'r')"
                @selectBlur="selectBlur"
                @selectFocus="(row, prop) => selectFocus(row, prop, 'r')"
                @operate="operate"
              ></Table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="attr_btn">
      <el-button
        v-if="!isRead"
        type="primary"
        size="small"
        @click="saveParams"
        class="right_button"
        >保存</el-button
      >
    </div>

    <SelectDialog
      ref="selectDialogRef"
      :currentServObj="currentServObj"
      :isRead="isRead"
      :dataList="dataList"
      @getDataList="getDataList"
      @selectConfirm="setParaMapgNm"
    ></SelectDialog>

    <!-- 选择临时参数 -->
    <!-- <SelectTempParams
      ref="tempParamsRef"
      :dataList="tempDataList"
      :currentServObj="currentServObj"
      :currentObj="currentObj"
      @setParaMapgNm="setParaMapgNm"
    >
    </SelectTempParams> -->

    <!-- 添加参数 -->
    <PageDialog
      :dialogWidth="'80%'"
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
            :treeProps="{ children: 'children' }"
            :tableType="'selection'"
            :cellStyle="dictListCellStyle"
            @selectionChange="handleSelectionChange"
          ></Table>
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
                @close="delParamsTag(item)"
              >
                {{ item.dictryNm }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="save">确定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import PageDialog from "@m/core/components/page_dialog";
import SelectDialog from "./components/data_deal/fourRSelect";
import SelectTempParams from "./select_temp_params";
import { mixList, reList } from "@m/utils/paramTree";
import { unduplicated, setSerialNumber } from "@m/utils/array";
import {
  setSessionStorage,
  getSessionStorage,
  getLocalStorage,
} from "@m/utils/localStorage";
export default {
  mixins: [mixin],
  components: {
    Table,
    SelectDialog,
    SelectTempParams,
    PagePagination,
    ServiceTop,
    PageDialog,
  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    currentObj: {
      type: Object,
      default: () => ({}),
    },
    isRead: {
      type: Boolean,
      default: () => false,
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    type: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      isNeedCheck: "",
      paramValueSelect: [],
      isEnumList: false,
      formData: {
        actionDesc: "4R",
        actionMsg: "",
        // paramList: "[]"
      },
      paramList: [],
      // 输出数据
      tableData: [],
      tableColumn: [
        {
          prop: "paramCName",
          label: "参数中文名",
          minWidth: "60%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "isNeed",
          label: "是否必输",
          minWidth: "40%",
          type: "text",
          filter: "paraNed",
          tooltip: true,
        },
      ],
      currentObj: {},
      cpnData: {},
      inputParamsVisibleAtSetting: true,
      // 设置页签下的输入参数表格数据
      inputParamsListAtSetting: [],
      // 控制设置页签下的输出参数列表显示或隐藏
      outputParamsVisibleAtSetting: true,
      // 设置页签下的输出参数表格数据
      outputParamsListAtSetting: [],
      tempParamsListAtSetting: [],
      tableParamList: [],
      tableType: false,
      currentRow: {},
      cpnParamsRecord: {},
      actionIdRecord: "",
      tempDataList: [],
      chooseData: [],
      // 选择参数弹框
      addVisible: false,
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
        //   model: "clsfId",
        //   placeholder: "所属分类",
        //   select: [],
        //   filterable: true,
        // },
        {
          type: "select",
          model: "dictType",
          placeholder: "参数类型",
          select: [
            { type: "String", value: "String" },
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
          ],
        },
      ],
      // 输入输出参数弹框的搜索表单
      formInline: {
        content: "",
        clsfId: "",
        dictType: "",
      },
      // 选择参数分页器
      dicPager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      // 字典参数
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
      // 输入输出参数弹框列表数据
      dictList: [],
      // 输入输出参数弹框选择类型下拉框数据
      dictGategList: [],
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
        //   model: "clsfId",
        //   placeholder: "所属分类",
        //   select: [],
        //   filterable: true,
        // },
        {
          type: "select",
          model: "dictType",
          placeholder: "参数类型",
          select: [
            { type: "String", value: "String" },
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
          ],
        },
      ],
      // 当前数据
      isData: {},
      // 已选参数数组
      tableData: [],
      selectionData: [],
      // 输入列表数据
      iInputList: [],
      // 输出列表数据
      iOutputList: [],
      // 临时参数列表数据
      iTempList: [],
      // 参数存放
      paramList: [],
      httpData: [],
      typeInterface:""
    };
  },
  computed: {
    blngtoTyp() {
      return this.currentServObj.apiServiceType.indexOf("D4") > -1
        ? "10"
        : "11";
    },
    inputParamsColumnAtSetting() {
      const result = [
      {
          prop: "paramCName",
          label: "中文名称",
          minWidth: "25%",
          inputStyle: "width: 90%",
          type: "text",
          // align: "center",
          // selectVal: (row) => {
          //   return this.tableType
          //     ? this.tableParamList
          //     : this.getParamKeySelectList(row);
          // },
          // disabled: () => this.isRead
        },
        {
          prop: "apSource",
          label: "参数来源",
          minWidth: "30%",
          inputStyle: "width: 60%",
          type: this.isRead ? "text" : "select",
          // align: "center",
          selectVal: [
            { type: "服务输入参数", value: "00" },
            { type: "服务输出参数", value: "10" },
            { type: "服务临时参数", value: "30" },
            { type: "组件输出参数", value: "20" },
          ],
          filter: "fourRApSource",
          disabled: () => true,
        },
        {
          prop: "isNeed",
          label: "是否必输",
          minWidth: "20%",
          type: "select",
          filterable: false,
          tooltip: true,
          selectVal: [
            { type: "是", value: "1" },
            { type: "否", value: "0" },
          ],
          disabled: (scope) => {
            return this.isRead;
          },
          // align: "center",
          // filter: "paraNed",
        },
        {
          prop: function (row) {
            if (row.apSource == "99") {
              return "paramValue";
            } else {
              return "paraMapgNm";
            }
          },
          label: "来源值",
          minWidth: "20%",
          type: (row) => {
            if (row.apSource == "99") {
              return "selectInputPicker";
            } else if (!this.isRead) {
              return "button";
            } else {
              return "text";
            }
          },
          selectVal: this.paramValueSelect,
          size: "mini",
          tooltip: true,
          filterable: true,
          format: "yyyyMMddHHmmss",
          selectPicker: function (scope) {
            return scope.row.paramValueType !== "Date";
            // return true
          },
          buttonList: [
            {
              renamed: function (scope) {
                return scope.row.paraMapgNm || "选择";
              },
              operate: "choseParams",
            },
          ],
        },
      ];
      if (!this.isRead)
        result.push({
          label: "操作",
          type: "button",
          width: "25%",
          buttonList: [
            {
              desc: "删除",
              operate: "deleteInputParam",
            },
          ],
        });
      return result;
    },
    outputParamsColumnAtSetting() {
      const result = [
        {
          prop: "paramCName",
          label: "参数中文名称",
          minWidth: "60%",
          inputStyle: "width: 93%",
          type: "text",
          // align: "center",
          // selectVal: (row) => {
          //   return this.tableType
          //     ? this.tableParamList
          //     : this.getParamKeySelectList(row);
          // },
          // disabled: () => this.isRead
        },
        {
          prop: "isNeed",
          label: "是否必输",
          minWidth: "20%",
          type: "text",
          filterable: false,
          tooltip: true,
          align: "center",
          filter: "paraNed",
        },
      ];
      if (!this.isRead)
        result.push({
          label: "操作",
          type: "button",
          width: "30",
          buttonList: [
            {
              desc: "删除",
              operate: "deleteOutputParam",
            },
          ],
        });
      return result;
    },
    // 是否修改过组件的参数
    hasChangeCpnParams() {
      const _formData = JSON.parse(JSON.stringify(this.formData));
      _formData.inputParamsListAtSetting = this.inputParamsListAtSetting;
      console.log("数据", this.inputParamsListAtSetting);
      _formData.outputParamsListAtSetting = this.outputParamsListAtSetting;
      return (
        this.cpnParamsRecord != JSON.stringify(_formData) &&
        this.actionIdRecord == this.currentObj.actionId
      );
    },
  },
  methods: {
    async getParams(e, obj) {
      console.log("getParams", e, obj);
      this.currentObj = e;
      if (!e.compositeId) {
        e.conf.map((item) => {
          this.formData[item.name] = item.value;
        });
        this.inputParamsListAtSetting = [];
        this.outputParamsListAtSetting = [];
        return;
      } else {
        const params = {
          d4StusCd: "1",
          blngtoTyp: this.blngtoTyp,
          compositeId: e.compositeId || "",
        };
        const res =this.typeInterface == "interfaceType" ? await this.rpc.apimgmt.getServiceCpnParams(params) : await this.rpc.transactionDesign.getServiceCpnParams(params);
        this.cpnData = res;
        this.paramList = res.paramList;
        res.confList.map((item) => {
          this.formData[item.confKey] = item.confValue;
        });
        // const paramList = JSON.parse(this.formData.paramList)
        this.inputParamsListAtSetting = reList(
          res.paramList.filter((item) => item.paramDirection == 0)
        );
        this.outputParamsListAtSetting = reList(
          res.paramList.filter((item) => item.paramDirection == 1)
        );
        this.tempParamsListAtSetting = reList(
          res.paramList.filter((item) => item.paramDirection == 3)
        );
        console.log("inputParamsListAtSetting", res.paramList);
      }
      this.setCpnParamsRecord();
    },
    // 删除当前点击的参数
    delParamsTag(e) {
      console.log("删除标签", e, this.tableData, this.selectionData);
      const index = this.dictList.findIndex(
        (item) => item.dictryId == e.dictryId
      );
      this.tableData = this.tableData.filter((it) => it.dictryId != e.dictryId);
      // this.selectionData = this.tableData
      console.log("删除l ", e, this.tableData);
      this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
        this.dictList[index],
        false
      );
    },
    async saveParams() {
      const e = this.currentServObj;
      console.log(this.currentServObj.puApiParams);
      const input = this.inputParamsListAtSetting.map((item) => {
        item.paramName = item.paramCName;
        return item;
      });
      console.log("数据-saveParams", this.inputParamsListAtSetting);
      const output = this.outputParamsListAtSetting.map((item) => {
        item.paramName = item.paramCName;
        return item;
      });
      this.paramList = mixList(input, "children").concat(
        mixList(output, "children")
      );
      const confList = this.cpnData.confList || [];
      for (let i in this.formData) {
        const target = confList.find((item) => item.confKey == i);
        if (target) {
          target.confValue = this.formData[i];
        } else {
          confList.push({
            confKey: i,
            confValue: this.formData[i],
            confId: "",
            confDescr: "",
            compositeId: e.compositeId || "",
          });
        }
      }
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: e.apiId,
        paramList: this.paramList,
        confList,
        compositeId: this.currentObj.compositeId || "",
      };
      const { compositeId } =this.typeInterface == "interfaceType"?await this.rpc.apimgmt.saveServiceCpnParams(params): await this.rpc.transactionDesign.saveServiceCpnParams(params)
      params.compositeId = compositeId;
      this.setCpnParamsRecord();
      this.$emit("upDateServParams", JSON.parse(JSON.stringify(this.currentObj)), params,this.typeInterface);
      // this.$emit("toSave", true);
    },
    //勾选非必输项
    isNeedChange(e) {
      console.log(e);
    },
    rowClass({ row }) {
      if (this.isNeedCheck && row.isNeed == "0") {
        return "wraning_row";
      }
      return "";
    },
    setCpnParamsRecord() {
      const _formData = JSON.parse(JSON.stringify(this.formData));
      _formData.inputParamsListAtSetting = this.inputParamsListAtSetting;
      _formData.outputParamsListAtSetting = this.outputParamsListAtSetting;
      this.cpnParamsRecord = JSON.stringify(_formData);
      this.actionIdRecord = this.currentObj.actionId;
      console.log("数据-setCpnParamsRecord", this.inputParamsListAtSetting);
      setSessionStorage("4R-paramsData", JSON.stringify(_formData));
    },
    //反案例切换
    switchChange(e, o) {
      console.log("switchChange", e, o);
    },
    // 反显输入报文
    inputChange(e, o) {
      console.log("inputChange", e, o);
    },
    selectBlur(e, row) {
      console.log("selectBlur", e, row);
      if (!e) return;
      row.paramValue = e.target.value;
      this.inputChange(row);
    },
    changeParamsVisible(e) {
      if (e == "s") {
        this.inputParamsVisibleAtSetting = !this.inputParamsVisibleAtSetting;
      } else {
        this.outputParamsVisibleAtSetting = !this.outputParamsVisibleAtSetting;
      }
    },
    addParams(e) {
      console.log("addParams", this.tableData);
      this.selectionData = [];
      this.tableData = [];
      this.addVisible = true;
      this.type = e;
      this.getParamsList();
      // if (e == "s") {
      //   // this.inputParamsListAtSetting.push({
      //   //   paramCName: "",
      //   //   apSource: "",
      //   //   paramDirection: "0",
      //   // })
      //   this.$refs.selectDialogRef.showDialog(this.currentObj, "s");
      // } else {
      //   // this.outputParamsListAtSetting.push({
      //   //   paramCName: "",
      //   //   apSource: "",
      //   //   paramDirection: "1",
      //   // })
      //   this.$refs.selectDialogRef.showDialog(this.currentObj, "r");
      // }
    },
    getParamKeySelectList(row, list) {
      if (row.apSource == "00") {
        // 服务输入参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "0"
        );
        return p.map((item) => {
          return {
            type: item.paramCName,
            value: item.paramKey,
          };
        });
      } else if (row.apSource == "10") {
        // 服务临时参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "3"
        );
        return p.map((item) => {
          return {
            type: item.paramCName,
            value: item.paramKey,
          };
        });
      } else if (row.apSource == "20") {
        // 组件输出
        console.log(list);
        return list;
      }
    },
    selectChange(row, prop, type) {
      console.log("selectChange", row, prop, type);
      if (prop == "apSource") {
        // 参数来源下拉框变更时
        this.resetRow(row);
        if (row.apSource == "20") {
          this.currentRow = row;
          this.$refs.selectDialogRef.showDialog(row, this.currentObj, type);
        }
      } else if (prop == "paramCName") {
        if (row.apSource == "20") {
          if (!row.paramCName) return;
          row.paramKey = row.paramCName;
          const list = this.tableParamList.filter((item) => {
            return item.paramKey == row.paramKey;
          });
          row.paramCName = `${row.actionName}.${list[0].paramCName}`;
          row.paramType = list[0].paramType;
          row.paramOrder = list[0].paramOrder;
          row.paramLength = list[0].paramLength;
          row.children =
            list[0].paramType == "List" || list[0].paramType == "Object"
              ? this.getChildren(row, type, list[0].paramOrder)
              : [];
          if (type == "s") {
            this.inputParamsListAtSetting = JSON.parse(
              JSON.stringify(this.inputParamsListAtSetting)
            );
          } else {
            this.outputParamsListAtSetting = JSON.parse(
              JSON.stringify(this.outputParamsListAtSetting)
            );
          }
        } else {
          if (!row.paramCName) return;
          row.paramKey = row.paramCName;
          const list = this.currentServObj.puApiParams.filter((item) => {
            return item.paramKey == row.paramKey;
          });
          row.paramCName = list[0].paramCName;
          row.paramType = list[0].paramType;
          row.paramLength = list[0].paramLength;
          row.paramOrder = list[0].paramOrder;
        }
      }
      console.log("数据-selectChange", this.inputParamsListAtSetting);
    },
    getChildren(row, type, id) {
      const list = this.tableParamList.filter((item) => {
        if (item.paramParentId == id) {
          item.apSource = "20";
          item.paramDirection = type == "s" ? "0" : "1";
          item.paramName = item.paramCName;
          item.actionId = row.actionId;
          item.actionName = row.actionName;
          item.paramCName = `${row.actionName}.${item.paramCName}`;
          item.children =
            item.paramType == "List" || item.paramType == "Object"
              ? this.getChildren(item, type, item.paramOrder)
              : [];
          return item;
        }
      });
      return list;
    },
    selectFocus(row, prop, type) {
      if (prop == "paramCName" && row.apSource == "20") {
        this.tableType = true;
        console.log("selectFocus", row, prop, type);
        const target = this.dataList.find(
          (item) => item.actionId == row.actionId
        );
        if (target.actionType == "dataDealAction") {
          this.getDataDealOutputParmas(target, type);
        } else {
          this.getServiceCpnDefaultParams(target, type);
        }
      } else {
        this.tableType = false;
      }
      if (p == "paramValue") {
        this.paramValueSelect = [];
        const params = {
          dictryNo: e.paramKey,
          sysId: this.formData.sysId,
        };
        this.rpc.apimgmt.getDictryNoExampleList(params).then((res) => {
          if (res.enumList.length > 0) {
            this.isEnumList = true;
            this.paramValueSelect = res.enumList.map((item, index) => {
              return {
                value: item.key + "- " + item.value,
              };
            });
          } else {
            this.isEnumList = false;
            this.paramValueSelect = res.exampleValueList.map((item) => {
              return {
                value: item,
              };
            });
          }
        });
        return;
      }
    },
    getDataDealOutputParmas(e, type) {
      console.log("getDataDealOutputParmas", e);
      this.tableParamList = e.paramList.filter(
        (item) => item.paramDirection == "1"
      );
      this.tableParamList = this.tableParamList.map((item) => {
        (item.type = item.paramCName), (item.value = item.paramKey);
        return item;
      });
    },
    async getServiceCpnDefaultParams(e, type) {
      console.log("getServiceCpnDefaultParams", e);
      const params = {
        d4StusCd: "1",
        blngtoTyp: "10",
        apiId: e.conf.find((item) => item.name == "svcId").value,
        d4bApiId: this.currentServObj.apiId,
      };
      const res = await this.rpc.transactionDesign.getServiceCpnDefaultParams(params);
      // this.inputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == "0"));
      // this.paramList = res.paramList.filter((item) => item.paramDirection == "1")
      this.tableParamList = res.paramList.filter(
        (item) => item.paramDirection == "1"
      );
      this.tableParamList = this.tableParamList.map((item) => {
        (item.type = item.paramCName), (item.value = item.paramKey);
        return item;
      });
    },
    resetRow(row) {
      console.log("resetRow");
      row.paramCName = "";
      row.children = [];
    },
    getDataList() {
      this.$emit("getDataList");
    },
    getNodeList(list, type, data, defaultActive) {
      if (list && list.length > 0) {
        return list.map((item) => {
          (item.apSource =
            defaultActive == "servInput"
              ? "00"
              : defaultActive == "servOutput"
              ? "10"
              : defaultActive == "cpnOutput"
              ? "20"
              : "30"),
            (item.paramDirection = type == "s" ? "0" : "1");
          item.paramCName =
            defaultActive == "cpnOutput"
              ? `${data.actionName}.${list[0].paramCName}`
              : item.paramCName;
          item.paramName = item.paramCName;
          item.actionId = data.actionId;
          item.actionName = data.actionName;
          if (item.children && item.children.length > 0) {
            item.children = this.getNodeList(
              item.children,
              type,
              data,
              defaultActive
            );
          }
          return item;
        });
      } else {
        return [];
      }
    },
    selectConfirm(e, tableData, paramList, type, defaultActive) {
      if (tableData.length > 0) {
        if (type == "s") {
          tableData.forEach((item, index) => {
            const list = paramList.filter(
              (data) => data.paramKey == item.paramKey
            );
            this.inputParamsListAtSetting.push({
              apSource:
                defaultActive == "servInput"
                  ? "00"
                  : defaultActive == "servOutput"
                  ? "10"
                  : defaultActive == "cpnOutput"
                  ? "20"
                  : "30",
              paramDirection: "0",
              paramKey: item.paramKey,
              paramName: item.paramCName,
              paramType: item.paramType,
              paramOrder: item.paramOrder,
              actionId: e.actionId,
              actionName: e.actionName,
              paramCName:
                defaultActive == "cpnOutput"
                  ? `${e.actionName}.${list[0].paramCName}`
                  : item.paramCName,
              children:
                this.getNodeList(item.children, type, e, defaultActive) || [],
            });
          });
          this.inputParamsListAtSetting = JSON.parse(
            JSON.stringify(this.inputParamsListAtSetting)
          );
          this.inputParamsListAtSetting = unduplicated(
            this.inputParamsListAtSetting,
            "paramKey"
          );
        } else {
          tableData.forEach((item, index) => {
            const list = paramList.filter(
              (data) => data.paramKey == item.paramKey
            );
            this.outputParamsListAtSetting.push({
              apSource:
                defaultActive == "servInput"
                  ? "00"
                  : defaultActive == "servOutput"
                  ? "10"
                  : defaultActive == "cpnOutput"
                  ? "20"
                  : "30",
              paramDirection: "1",
              paramKey: item.paramKey,
              paramName: item.paramCName,
              paramType: item.paramType,
              paramOrder: item.paramOrder,
              actionId: e.actionId,
              actionName: e.actionName,
              paramCName:
                defaultActive == "cpnOutput"
                  ? `${e.actionName}.${list[0].paramCName}`
                  : item.paramCName,
              children:
                this.getNodeList(item.children, type, e, defaultActive) || [],
            });
          });
          this.outputParamsListAtSetting = JSON.parse(
            JSON.stringify(this.outputParamsListAtSetting)
          );
          this.outputParamsListAtSetting = unduplicated(
            this.outputParamsListAtSetting,
            "paramKey"
          );
        }
      }
      console.log("数据-selectConfirm", this.inputParamsListAtSetting);
    },
    operate(operation, data) {
      console.log(operation, data);
      if (operation == "deleteInputParam") {
        this.iInputList = []
        this.delParams(this.inputParamsListAtSetting, data.paramOrder);
        // this.iInputList = this.inputParamsListAtSetting;
        // const index = this.inputParamsListAtSetting.indexOf(data)
        // this.inputParamsListAtSetting.splice(index, 1)
      } else if (operation == "deleteOutputParam") {
        this.iOutputList = []
        this.delParams(this.outputParamsListAtSetting, data.paramOrder);
        // const index = this.outputParamsListAtSetting.indexOf(data)
        // this.outputParamsListAtSetting.splice(index, 1)
      } else {
        // this.addVisible = true;
        console.log("显示临时参数选择弹窗", data);
        // this.chooseData = data;
        // this.tempDataList = this.getDataList();
        // this.getDataList()
        // this.$nextTick(() => {
        //   this.$refs.tempParamsRef.initParams(this.currentServObj, data);
        // });
        if (this.type == "s") {
          // this.inputParamsListAtSetting.push({
          //   paramCName: "",
          //   apSource: "",
          //   paramDirection: "0",
          // })
          this.$refs.selectDialogRef.showDialog(data, "s");
        } else {
          // this.outputParamsListAtSetting.push({
          //   paramCName: "",
          //   apSource: "",
          //   paramDirection: "1",
          // })
          this.$refs.selectDialogRef.showDialog(data, "r");
        }
      }
    },
    setParaMapgNm(target, obj, defaultActive) {
      console.log(1, target, obj);
      const list = mixList(this.inputParamsListAtSetting, "children");
      const data = list.find((item) => item.paramKey == target.paramKey);
      data.paraMapgNm = obj.paramCName;
      data.paramMappingKey = obj.paramKey;
      data.apSource =
        defaultActive == "servInput"
          ? "00"
          : defaultActive == "servOutput"
          ? "10"
          : defaultActive == "cpnOutput"
          ? "20"
          : "30"
        console.log("输入参数list", list, data, obj.apSource);
      this.inputParamsListAtSetting = reList(list);
      this.inputParamsListAtSetting = JSON.parse(
        JSON.stringify(this.inputParamsListAtSetting)
      );
      console.log("组件输入参数list", this.inputParamsListAtSetting, data);
    },
    // 删除报文参数
    delParams(arrs, id) {
      let i = 0;
      while (arrs[i]) {
        if (arrs[i].paramOrder == id) {
          arrs.splice(i, 1);
          let d = 0;
          if (id.indexOf(".") != -1) {
            // d = id.substring(0, id.length - 1);
            d = id.split(".");
            d.pop();
            d = d.join(".");
            for (let i = 0; i < arrs.length; i++) {
              arrs[i].paramOrder = d + "." + (i + 1);
            }
          } else {
            for (let i = 0; i < arrs.length; i++) {
              arrs[i].paramOrder = i + 1 + "";
            }
          }
          return;
        }
        if (arrs[i].children && arrs[i].children.length > 0) {
          this.delParams(arrs[i].children, id);
        }
        i++;
      }
      console.log("删除后", arrs, id);
    },
    //参数操作
    /** 添加第一级报文参数
     * @param {Array} arrs 原数组
     * @param {String} pos 数组位置
     * @param {String} direct 数组方向
     * @param {Object} prs 赋值后的数据,字典需用
     */
    addNewParams(arrs, pos, direct, prs = {}) {
      console.log("新增", arrs);
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
        standType: prs.standType,
      };
      if (prs.children && prs.children.length > 0) {
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
          this.addChildParams({}, data, prs);
        });
      }
      arrs.push(data);
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
        standType: prs.standType,
      };
      if (prs.children && prs.children.length > 0) {
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
          this.addChildParams({}, data, prs);
        });
      }
      console.log(1, data);
      item.children = item.children || [];
      item.children.push(data);
    },
    handleCancel(e) {
      console.log("handleCancel", e);
      this.addVisible = false;
    },
    // 保存当前选中的参数
    async save() {
      const data = JSON.parse(JSON.stringify(this.tableData));
      if (this.formInline.type == "addChild") {
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
        this.refreshParams();
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
          this.addNewParams(
            this.type === "s" ? this.iInputList : this.iOutputList,
            this.type === "s" ? "0" : this.type === "r" ? "1" : "3",
            this.type === "s" ? "0" : this.type === "r" ? "1" : "3",
            prs
          );
        });
      }
      this.refreshParams();
      this.$nextTick(() => {
        this.$refs.dictListTableRef.clearSelection();
      });
      console.log("this.iInputList11", this.iInputList);
      if (this.type === "s") {
        this.iInputList = unduplicated(this.iInputList, "paramKey");
      } else if (this.type === "r") {
        this.iOutputList = unduplicated(this.iOutputList, "paramKey");
      }
      console.log("this.iInputList", this.iInputList);
      // else {
      //   this.iTempList = unduplicated(this.iTempList, "paramKey");
      // }
      this.getNewParams();
      this.dicPager.currentPage = "1";
      this.addVisible = false;
    },
    async getNewParams() {
      const input = this.iInputList.map((item) => {
        item.paramName = item.paramCName;
        return item;
      });
      const output = this.iOutputList.map((item) => {
        item.paramName = item.paramCName;
        return item;
      });
      let paramList = [];
      Object.assign(paramList, this.type == "s" ? input : output);
      const params = {
        paramList,
        d4bApiId: this.currentServObj.apiId,
      };
      const res =this.typeInterface == "interfaceType"?await this.rpc.apimgmt.addDicpParams(params): await this.rpc.public.addDicpParams(params);
      if (this.type == "s") {
        this.inputParamsListAtSetting.push(...res.paramList);
        let arr = unduplicated(this.inputParamsListAtSetting,"paramKey")
        this.inputParamsListAtSetting = JSON.parse(JSON.stringify(arr));
        console.log("arr",arr)
      } else {
        this.outputParamsListAtSetting.push(...res.paramList);
        let arr = unduplicated(this.outputParamsListAtSetting,"paramKey")
        this.outputParamsListAtSetting = JSON.parse(JSON.stringify(arr));
      }
      this.iInputList = [];
      this.iOutputLis = []
    },
    refreshParams() {
      this.httpData = JSON.parse(JSON.stringify(this.httpData));
      this.iOutputList = JSON.parse(JSON.stringify(this.iOutputList));
      this.iInputList = JSON.parse(JSON.stringify(this.iInputList));
      this.iTempList = JSON.parse(JSON.stringify(this.iTempList));
      this.$forceUpdate();
    },
    goSearch() {
      this.isRecord = true;
      this.dicPager.currentPage = "1";
      this.getParamsList();
    },
    handleDicSizeChange(e) {
      this.isRecord = true;
      this.dicPager.turnPageShowNum = e;
      this.getParamsList();
    },
    handleDicCurrentChange(e) {
      this.isRecord = true;
      this.getParamsList();
    },
    // 获取输入输出参数列表数据
    async getParamsList() {
      console.log(1, this.formInline);
      const data = {
        // sysId: this.currentServObj.relySys,
        // dictPid: "",
        // content: this.formInline.content,
        // clsfId: this.formInline.clsfId,
        // paraType: this.formInline.dictType,
        currentPage: this.dicPager.currentPage + "",
        turnPageShowNum: this.dicPager.turnPageShowNum,
        begins: "",
        content: this.formInline.content,
        dictryKeyWord: "",
        paraGateg: "",
        paraType: this.formInline.dictType,
        preciseQuery: "0",
      };
      const { dictionariesInfoBoList, turnPageTotalNum } =
        await this.rpc.dictionary.getSysDictionaryListInfo(data);
      this.dictList = setSerialNumber(dictionariesInfoBoList);
      // for (let i in this.dictList) {
      //   if (this.dictList[i].dictTyp == "1") {
      //     await this.getChildParamsList(this.dictList[i], i);
      //   }
      // }
      this.dicPager.total = turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableData();
      });
    },
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
    // 多选框选中
    handleSelectionChange(e) {
      console.log("选中时", this.selectionData, this.isRecord);
      if (!this.isRecord && this.selectionData.length > e.length) {
        this.selectionData.forEach((item) => {
          if (e.indexOf(item) == -1) {
            this.tableData = this.tableData.filter(
              (it) => it.dictryId != item.dictryId
            );
          }
        });
      } else {
        console.log(e);
        this.tableData.push(...e);
        this.tableData = unduplicated(this.tableData, "dictryId");
      }
      this.selectionData = e;
      this.isRecord = false;
      console.log("选中时", this.tableData);
    },
    init() {
      if(this.$route.query.typeInterface){   //判断 作业太网关接口跳转过来
        this.typeInterface = this.$route.query.typeInterface ||""
      }
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
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_4R_attr {
  position: relative;
  height: 100%;
  .attr_main {
    height: 100%;
    ::v-deep .el-table__cell {
      padding: 2px 0;
      .cell {
        span {
          font-size: 12px;
        }
      }
    }
    ::v-deep tr {
      .cell {
        font-size: 12px;
        padding: 0;
      }
    }
  }
  .attr_title {
    padding: 8px 10px;
    font-family: $font_medium;
    &.flex {
      display: flex;
      justify-content: space-between;
      .right_btn {
        color: $theme_color;
        cursor: pointer;
      }
    }
  }
  .attr_pre_title {
    // padding: 8px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    .el-icon-arrow-down {
      cursor: pointer;
      &.hidden {
        transform: rotate(180deg);
      }
    }
    .attr_pre_title_b {
      color: $reg_ft_color;
    }
    .icon {
      cursor: pointer;
      background: #358aff;
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 2px;
      font-weight: 400;
      color: #fff;
    }
  }
  .attr_content {
    background-color: $base_bg_color;
    padding: 20px 10px;
  }
  .attr_box {
    height: 100%;
    overflow-y: scroll;
    padding-bottom: 102px;
    &.mt10 {
      margin-top: 10px;
    }
  }
  .attr_show {
    padding: 8px 10px;
    overflow: hidden;
    .attr_show_item {
      margin-bottom: 10px;
      overflow: hidden;
      position: relative;
      font-size: 14px;
      &.flex {
        display: flex;
        .item_title {
          width: 80px;
          padding-right: 4px;
          padding-top: 4px;
          text-align: right;
          font-size: 12px;
          font-weight: $font_weight_600;
          &.required_fields {
            &::before {
              content: "*";
              color: $sec_danger_color;
              margin-right: 2px;
            }
          }
          &.w68 {
            width: 68px;
          }
        }
        .item_value {
          flex: 1;
          ::v-deep .el-textarea__inner {
            height: 80px;
          }
          &.select {
            ::v-deep .el-input--suffix {
              font-size: 12px;
            }
          }
          &.text {
            font-size: 12px;
            padding-top: 4px;
          }
        }
      }
      &.mb20 {
        margin-bottom: 20px;
      }
      .attr_show_item_t {
        width: 100%;
        margin-right: 10px;
        margin-bottom: 10px;
        font-weight: $font_weight_600;
        .attr_show_item_i {
          font-weight: 400;
          white-space: normal;
          word-break: break-all;
        }
        &.flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title {
            width: 64px;
          }
          .content {
            flex: 1;
          }
          .right_btn {
            color: $theme_color;
            cursor: pointer;
          }
        }
      }
      .attr_show_item_c {
        width: 100%;
        &.textarea {
          ::v-deep .el-textarea__inner {
            min-height: 200px !important;
          }
        }
      }
      .attr_show_item_b {
        position: absolute;
        right: 0;
        top: 0;
        ::v-deep .el-button {
          @include mini_button_common;
          height: 20px;
          &.el-button--default.is-plain {
            border-color: $sec_ft_color;
            color: $sec_ft_color;
            &:hover,
            &:focus {
              color: $sec_ft_color;
            }
          }
          &.el-button--danger.is-plain {
            border-color: $danger_color;
            &:hover,
            &:focus {
              color: $danger_color;
            }
          }
          &.el-button--primary {
            background-color: $theme_color;
            border-color: $theme_color;
          }
          &.is-plain {
            background-color: $base_white;
            &:hover,
            &:focus {
              color: $theme_color;
            }
          }
        }
        .el-icon-more {
          cursor: pointer;
        }
      }
    }
  }
  .attr_send {
    // padding: 8px 10px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .attr_recive {
    // padding: 8px 10px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .underLine {
    border-bottom: 1px solid $pri_br_color;
  }
  .attr_set_f {
    width: 68px;
    margin-right: 10px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ::v-deep .el-input--mini .el-input__inner {
      height: 24px;
    }
  }
  .attr_set_s {
    width: 116px;
    margin-right: 5px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .attr_set_ad {
    font-size: 16px;
    height: 24px;
    line-height: 24px;
    width: 16px;
    float: right;
    color: $reg_ft_color;
    cursor: pointer;
  }
  .attr_set_t {
    width: 16px;
    float: right;
    .key_action {
      font-size: 16px;
      height: 24px;
      line-height: 24px;
    }
    i {
      cursor: pointer;
    }
  }
  .attr_set_l {
    width: 186px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .key_title {
    padding: 0px 0px 8px;
    overflow: hidden;
    color: $sec_ft_color;
    display: flex;
    justify-content: space-between;
  }
  .key_list {
    overflow: hidden;
    .key_item {
      margin-bottom: 5px;
      overflow: hidden;
      .attr_set_f_ml {
        margin-left: 10px;
      }
      ::v-deep .el-input__inner {
        line-height: 28px;
        border: 1px solid $pri_br_color;
        border-radius: $theme_radius;
        height: 28px;
        color: $reg_ft_color;
        padding: 0 5px;
      }
    }
  }

  ::v-deep .el-input__inner {
    line-height: 32px;
    border: 1px solid $pri_br_color;
    border-radius: $theme_radius;
    height: 32px;
    color: $reg_ft_color;
  }
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  ::v-deep .el-table thead tr th {
    background-color: $table_bg_color;
  }
  .line_dialog_conf {
    .add_conf {
      padding: 15px 20px;
      border-bottom: 1px solid $pri_br_color;
      display: flex;
      align-items: center;
      .add_conf_s {
        width: 90px;
      }
      .add_conf_t {
        width: 90px;
      }
      .add_conf_btn {
        // float: right;
        margin-left: auto;
      }
    }
    .add_condition {
      padding: 15px 20px;
      border-bottom: 1px solid $pri_br_color;
      .add_condition_k {
        width: 110px;
        margin-right: 2px;
      }
      .add_condition_btn {
        cursor: pointer;
      }
      .hidden {
        visibility: hidden;
      }
    }
    .add_content {
      padding: 15px 20px;
      .add_content_t {
        margin-bottom: 15px;
        font-family: $font_medium;
      }
      .add_content_l {
        padding: 15px;
        background-color: $base_bg_color;
      }
    }
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
  .attr_tabs {
    display: flex;
    // justify-content: center;
    background-color: $base_white;
    width: 100%;
    border-bottom: 2px solid #dcdfe6;
    box-shadow: 0 1px 10px 0 #e7e7e7;
    // ::v-deep .el-tabs__active-bar {
    //   width: 50px !important;
    // }
    ::v-deep .el-tabs__nav-wrap::after {
      background-color: $base_white;
    }
    ::v-deep .el-tabs__header {
      margin: 0;
      .el-tabs__item {
        height: 50px;
        line-height: 50px;
        font-size: 12px;
        padding: 0 15px;
        font-family: $font_medium;
        letter-spacing: 0;
        min-width: 78px;
        text-align: center;
        &.is-active {
          font-weight: $font_weight_600;
        }
      }
    }
    ::v-deep .el-tabs__content {
      display: none;
    }
  }
  .form {
    width: 70%;
    margin: 24px auto;
  }
  .attr_btn {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    width: calc(100% - 10px);
    padding: 10px;
    background: $base_white;
    z-index: 10;
    border-left: 2px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    ::v-deep .el-button {
      @include normal_button_common;
      width: 112px;
      color: $reg_ft_color;
      background: $base_white;
      border: 1px solid $pri_br_color;
      &.el-button--primary {
        @include primary_button;
      }
    }
  }
  .service_edit_form {
    ::v-deep .el-form-item__label {
      font-size: 12px;
    }
  }
  .service_edit_form_info {
    margin-bottom: 16px;
    .el-form-item {
      margin-bottom: 8px;
    }
  }
  .rule_dialog {
    padding: 15px 24px;
    .rule_dialog_item {
      margin-bottom: 10px;
    }
  }
  .table ::v-deep .wraning_row {
    display: none;
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
}
</style>
