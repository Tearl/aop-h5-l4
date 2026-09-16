<template>
  <div class="aop_workgate_comps_apimgmt_api_mod_params">
    <div class="params_wrapper">
      <el-form
        :model="formData"
        class="create_form"
        ref="formData"
        label-width="90px"
      >
        <div class="create_form_info">
          <el-form-item label="输入参数">
            <div class="input_wrapper">
              <div class="top_right_create">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="showParams('s')"
                  >从字典选择</el-button
                >
              </div>
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
          </el-form-item>
          <el-form-item label="输出参数">
            <div class="output_wrapper">
              <div class="top_right_create">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="showParams('r')"
                  >从字典选择</el-button
                >
              </div>
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
      :dialogWidth="'90%'"
      :dialogTitle="'请选择参数'"
      :dialogVisiable="addVisible"
      @closeDialog="handleCancel"
      class="create_dialog"
    >
      <div slot="box">
        <div class="add_dialog_conf1">
          <div class="check_content">
            <div class="left">
              <div class="left_tree">
                <div class="list_title">
                  <span>服务列表</span>
                </div>
                <div>
                  <ul class="service_menu_list menu_scroll">
                    <li
                      class="list_item"
                      :class="{ active: currentl5Obj.apiId == item.apiId }"
                      v-for="item in l5SvcList"
                      :key="item.apiId"
                      @click="d4bServClick(item)"
                    >
                      <div class="text_area">
                        <span class="list_item_title">{{ item.apiName }}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="middle">
              <div class="right_table">
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
                    <el-button
                      size="small"
                      @click="resetFields"
                      class="right_button"
                      >重置</el-button
                    >
                  </div>
                </ServiceTop>
                <div class="content">
                  <div class="table">
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
                    <!-- <Table
                      ref="tableRef"
                      class="table"
                      :data="dictList"
                      :table="dictListTables"
                      :radioModel="radioModel"
                      @operate="operate"
                      @radioChange="radioChange"
                    ></Table> -->
                    <!-- 分页器 -->
                    <PagePagination
                      @size-change="handleDicSizeChange"
                      @current-change="handleDicCurrentChange"
                      :pager="dicPager"
                    >
                    </PagePagination>
                  </div>
                </div>
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
                      {{ item.paramCName }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click.native="handleCancel">取 消</el-button>
        <!-- <el-button
          v-if="radioHeader == 0"
          type="primary"
          @click.native="saveParams"
          >确定</el-button
        > -->
        <el-button type="primary" @click.native="saveParamsDataset"
          >确定</el-button
        >
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import {
  unduplicated,
  setSerialNumber,
  unduplicatedByKeys,
} from "@m/utils/array";
import { dict2Para } from "@m/utils/dict2Para";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import PageBigData from "@m/core/components/dataset/page_big_data";
import { reList, mixList } from "@m/utils/paramTree";

// import { reList } from "@m/utils/paramTree";
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
          prop: "paramCName",
          label: "中文名称",
          // minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramKey",
          label: "英文名称",
          // minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramDesc",
          label: "描述",
          // minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        // {
        //   prop: "dictryTyp",
        //   label: "参数值类型",
        //   width: "90",
        //   type: "text",
        //   tooltip: true,
        // },
        {
          prop: "typeLength",
          label: "类型(长度)",
          // width: "90",
          type: "text",
          tooltip: true,
        },
      ],
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "请输入字段名称",
          style: {
            width: "260px",
          },
        },
        // {
        //   type: "select",
        //   model: "paraType",
        //   placeholder: "参数值类型",
        //   select: [
        //     { type: "String", value: "String" },
        //     { type: "File", value: "File" },
        //     { type: "List", value: "List" },
        //     { type: "boolean", value: "boolean" },
        //     { type: "char", value: "char" },
        //     { type: "int", value: "int" },
        //     { type: "byte", value: "byte" },
        //     { type: "short", value: "short" },
        //     { type: "long", value: "long" },
        //     { type: "float", value: "float" },
        //     { type: "double", value: "double" },
        //     { type: "Boolean", value: "Boolean" },
        //     { type: "Character", value: "Character" },
        //     { type: "Integer", value: "Integer" },
        //     { type: "Byte", value: "Byte" },
        //     { type: "Short", value: "Short" },
        //     { type: "Long", value: "Long" },
        //     { type: "Float", value: "Float" },
        //     { type: "Double", value: "Double" },
        //     { type: "BigDecimal", value: "BigDecimal" },
        //     { type: "Object", value: "Object" },
        //     { type: "Date", value: "Date" },
        //   ],
        // },
      ],
      // 输入输出参数弹框的搜索表单
      formInline: {
        content: "",
        paraType: "",
      },
      isHandleParamType: "",
      // 当前数据
      isData: {},

      sendData: [], // 请求报文
      receiveData: [], // 响应报文
      formData: {},
      // 表单数据
      // formData: {
      //   dictryNo: "", // 参数名称
      //   dictryNm: "", // 参数中文名称
      //   dictryKeyWord: "", // 关键字
      //   dictryEnglishFullName: "", // 英文名字全称
      //   dictryDescr: "", // 参数描述
      //   dictryGateg: "", // 所属分类
      //   dictryTyp: "String", // 参数类型
      //   dictryLength: "", // 最大长度
      // },
      currentSubObj: {},
      datasetObj: {},
      L5CheckList: [],
      paramsIntList: [],
      paramsIntL5List: [],
      paramsOutList: [],
      paramsOutL5List: [],
      radioModel: "",
      L5Arr: [],
      l5ServiceList: [],
      puApiParams: [],
      l5SvcList: [
        {
          svcId: "121",
          svcNm: "测试1",
        },
        {
          svcId: "122",
          svcNm: "测试2",
        },
      ],
      currentl5Obj: {},
      currentPage: 1, //存储当前服务列表的显示页数
      turnPageTotalNum: 10, //存储当前服务列表的总条数
      scorllFalg: false,
    };
  },
  methods: {
    init() {
      this.getParamsList();
    },
    // 获取未配置验证规则数据列表
    async addRuleGetList() {
      const _this = this.$refs.dictionaryFormRef.$refs.ruleRef;
      const data = {
        qCondition: this.addRuleSearchRecord.content
          ? this.addRuleSearchRecord.content
          : "",
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
              this.$refs.configTableRef.$refs.tableRef.toggleRowSelection(data);
            }
          });
        });
      }
    },

    // 弹框关闭时
    closeDialog(type) {
      if (type == "enumerateEdit") {
        this.$refs.enumerateValueFormRef.resetFields();
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

    handleCancel(e) {
      console.log("handleCancel", e);
      this.radioHeader = 0;
      this.addVisible = false;
      this.beforeDestroy();
    },
    initParams(data) {
      console.log(data);
      console.time("render耗时");
      this.sendData = reList(
        data.puApiParams.filter((item) => item.paramDirection == 0)
      );
      this.receiveData = reList(
        data.puApiParams.filter((item) => item.paramDirection == 1)
      );
      // this.httpData = httpHeaderParams;
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
          this.refreshParams();
        } else if (operation == "dicAdd") {
          this.isData = data;
          this.showParams("addChild");
        } else {
          this.delParams(this.sendData, data.paramOrder);
        }
      } else {
        if (operation == "add") {
          this.addChildParams(this.receiveData, data);
          this.refreshParams();
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
        standType: prs.standType,
        paramId: prs.paramId,
      };
      if (prs.children && prs.children.length > 0) {
        prs.children.map((item) => {
          const prs = {
            paramKey: item.dictryNo,
            paramCName: item.dictryNm,
            paramLength: item.dictryLength,
            paramValueType: item.dictryTyp,
            paramDesc: item.dictryDescr,
            paramId: item.paramId,
            children: item.children,
            standFlg: this.radioHeader == "0" ? "10" : "00",
            standType: this.radioHeader == "0" ? "10" : "00",
          };
          this.addChildParams({}, data, prs);
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
      // this.$emit("delF","delF");
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
        paramId: prs.paramId,
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
            paramId: prs.paramId,
          };
          this.addChildParams({}, data, prs);
        });
      }
      // console.log(1, data);
      item.children = item.children || [];
      item.children.push(data);
      item.children = unduplicated(item.children, "paramKey");
    },
    refreshParams() {
      this.httpData = JSON.parse(JSON.stringify(this.httpData || []));
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
      this.L5serviceList = [];
      this.L5CheckList = [];
      this.addVisible = true;
      this.resetSearch();
      this.getL5ServList();
      this.getLocation();
      // this.getParamsList();
    },
    beforeDestroy() {
      window.removeEventListener("scroll", this.getLocation, true);
      this.scorllFalg = true;
    },
    watchScroll() {
      window.addEventListener("scroll", this.getLocation, true);
    },
    //获取服务列表位置
    getLocation() {
      if (this.scorllFalg) {
        this.watchScroll();
      }
      let b = document.querySelector(".menu_scroll");
      if (!!b) {
        if (
          b.scrollTop + b.clientHeight >= b.scrollHeight - 4 &&
          b.scrollHeight
        ) {
          this.updateData();
        }
      }
    },
    updateData() {
      console.log(
        "updateData",
        this.turnPageTotalNum,
        this.currentPage,
        this.l5SvcList.length
      );
      if (this.turnPageTotalNum > this.l5SvcList.length) {
        ++this.currentPage;
        this.getL5ServList();
      }
    },
    async getL5ServList() {
      const params = {
        apiName: "",
        apiServiceType: "D5直连服务|D5自有服务",
        apiState: "2",
        bkId: "",
        relySys: "",
        currentPage: this.currentPage,
        turnPageShowNum: 10,
      };
      const res = await this.rpc.public.getApiManageList(params);
      if (this.currentPage == 1) {
        this.l5SvcList = res.apiList;
        this.turnPageTotalNum = res.turnPageTotalNum * 1;
        this.d4bServClick(this.l5SvcList[0]);
        this.currentPage++
        this.getL5ServList()
      } else {
        let arr = res.apiList;
        this.l5SvcList = this.l5SvcList.concat(arr);
      }
    },
    d4bServClick(e) {
      this.currentl5Obj = e;
      this.getFiledList();
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
      this.getFiledList();
    },
    handleDicCurrentChange(e) {
      this.isRecord = true;
      this.getFiledList();
    },
    //字段
    async getFiledList() {
      const param = {
        apiId: this.currentl5Obj.apiId,
        currentPage: this.dicPager.currentPage + "",
        turnPageShowNum: this.dicPager.turnPageShowNum,
      };
      const res = await this.rpc.d4.getL5ServField(param);
      res.paramList.map((item) => {
        item.typeLength = `${item.paramType}（${item.paramLength}）`;
      });
      this.radioModel = {};
      this.dictList = setSerialNumber(res.paramList);
      this.dicPager.total = res.turnPageTotalPage * 1;
    },
    // tableData数据选中表格中
    isTableData() {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item) => {
          this.dictList.forEach((data) => {
            if (item.dictId == data.dictId) {
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
      if (row.dictryPid == "" && column.type === "selection") {
        return { visibility: "hidden" };
      }
    },
    goSearch() {
      this.isRecord = true;
      this.pager.currentPage = "1";
      this.getFiledList();
    },
    resetFields() {
      this.formInline.content = "";
      this.pager.currentPage = "1";
      this.getFiledList();
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
      console.log(e, "handleSelectionChange");
      this.datasetObj = e;
      if (!this.isRecord && this.selectionData.length > e.length) {
        this.selectionData.forEach((item) => {
          if (e.indexOf(item) == -1) {
            this.tableData = this.tableData.filter(
              (it) => it.dictId != item.dictId
            );
          }
        });
      } else {
        this.tableData.push(...e);
        this.tableData = unduplicated(this.tableData, "paramId");
      }
      this.selectionData = e;
      this.isRecord = false;
    },
    // 保存当前选中的参数
    async saveParams() {
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
          this.addParams(
            this.formInline.type === "s"
              ? this.sendData
              : this.formInline.type === "r"
              ? this.receiveData
              : this.isData,
            this.formInline.type === "s"
              ? "0"
              : this.formInline.type === "r"
              ? "1"
              : "3",
            this.formInline.type === "s"
              ? "0"
              : this.formInline.type === "r"
              ? "1"
              : "3",
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

    //确认选择参数
    async saveParamsDataset() {
      const data = JSON.parse(JSON.stringify(this.tableData));
      const sendDataTemp = JSON.parse(
        JSON.stringify(mixList(this.sendData, "children"))
      );
      const receiveDataTemp = JSON.parse(
        JSON.stringify(mixList(this.receiveData, "children"))
      );
      // console.log("变化",sendDataTemp,receiveDataTemp)
      let paramsF = false;
      //输入参数判断 s 输入   r 输出
      if (this.formInline.type == "s") {
        data.map((item) => {
          sendDataTemp.map((m) => {
            if (item.paramKey == m.paramKey) {
              paramsF = true;
            }
          });
        });
      } else if (this.formInline.type == "r") {
        data.map((item) => {
          receiveDataTemp.map((m) => {
            if (item.paramKey == m.paramKey) {
              paramsF = true;
            }
          });
        });
      }
      if (paramsF) {
        return this.$message.error("参数已存在");
      }
      // let l5F = false;
      // L5Data.map((item) =>{
      //   this.l5ServiceList.map((m) =>{
      //     if(item.l5SvcId == m.svcId){
      //       l5F = true;
      //     }
      //   })
      // })
      // if(l5F){
      //   return this.$message.error("L5服务已经存在");
      // }
      let arrTemp = [];
      // console.log("data", data, "L5Data", L5Data.length);
      // console.log("data", data);
      if (this.formInline.type == "addChild") {
        data.map((item) => {
          const prs = {
            paramKey: item.paramKey,
            paramCName: item.paramCName,
            paramLength: item.paramLength,
            paramValueType: item.paramValueType,
            paramDesc: item.paramDesc,
            paramId: this.createId(),
            // dataSetDataId: item.dataSetDataId,
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
          arrTemp.push(prs);
        });
        this.refreshParams();
      } else {
        data.map((item) => {
          // const prs = {
          //   paramKey: item.dictryNo,
          //   paramCName: item.dictryNm,
          //   paramLength: item.dictryLength,
          //   paramValueType: item.dictryTyp,
          //   paramDesc: item.dictryDescr,
          //   children: item.children,
          //   standFlg: this.radioHeader == "0" ? "10" : "00",
          //   standType: this.radioHeader == "0" ? "10" : "00",
          // };
          const prs = {
            paramKey: item.paramKey,
            paramCName: item.paramCName,
            paramLength: item.paramLength,
            paramValueType: item.paramValueType,
            paramDesc: item.paramDesc,
            paramId: this.createId(),
            // dataSetDataId: item.dataSetDataId,
            // children: item.children,
            // standFlg: this.radioHeader == "0" ? "10" : "00",
            // standType: this.radioHeader == "0" ? "10" : "00",
          };
          // console.log(prs, "prsprsprsprs");
          this.addParams(
            this.formInline.type === "s"
              ? this.sendData
              : this.formInline.type === "r"
              ? this.receiveData
              : this.isData,
            this.formInline.type === "s"
              ? "0"
              : this.formInline.type === "r"
              ? "1"
              : "3",
            this.formInline.type === "s"
              ? "0"
              : this.formInline.type === "r"
              ? "1"
              : "3",
            prs
          );
          arrTemp.push(prs);
        });
      }
      // console.log("变化",this.sendData,this.receiveData)
      let arr1 = [];
      // arrTemp.map((item) => {
      //   L5Data.map((m) => {
      //     if (item.dataSetDataId == m.dataSetDataId) {
      //       let obj = {
      //         ...item,
      //         ...m,
      //       };
      //       arr1.push(obj);
      //     }
      //   });
      // });
      if (this.formInline.type == "r") {
        console.log(arrTemp, arr1, "输出参数");
        this.paramsOutList.push(...arrTemp);
        this.paramsOutL5List.push(...arr1);
      } else {
        console.log(arrTemp, arr1, "输入参数");
        this.paramsIntList.push(...arrTemp);
        this.paramsIntL5List.push(...arr1);
      }
      // console.log("输入参数", this.paramsIntList, this.paramsIntL5List);
      // console.log("输出参数", this.paramsOutList, this.paramsOutL5List);
      // this.$nextTick(() => {
      //   this.$refs.dictListTableRef.clearSelection();
      // });
      this.dicPager.currentPage = "1";
      this.addVisible = false;
      this.$emit(
        "paramList",
        this.paramsIntList,
        this.paramsIntL5List,
        this.paramsOutList,
        this.paramsOutL5List
      );
    },
    // 删除当前点击的参数
    delParamsTag(e) {
      console.log(e, "delParamsTag");
      const index = this.dictList.findIndex((item) => item.paramId == e.paramId);
      if (index == -1) {
        this.tableData = this.tableData.filter((it) => it.paramId != e.paramId);
      } else {
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          this.dictList[index],
          false
        );
      }
      // this.tableData.map((item, index) => {
      //   if (item.dictNo == e.dictNo && item.dataSubstnNo == e.dataSubstnNo) {
      //     this.tableData.splice(index, 1);
      //   }
      // });
      // this.L5CheckList.map((item, index) => {
      //   if (
      //     item.l5SvcId == e.l5SvcId &&
      //     item.dataSetDataId == e.dataSetDataId
      //   ) {
      //     this.L5CheckList.splice(index, 1);
      //   }
      // });
      // this.L5serviceList.map((item) => {
      //   if (
      //     item.l5SvcId == e.l5SvcId &&
      //     item.dataSetDataId == e.dataSetDataId
      //   ) {
      //     item.checked = false;
      //   }
      // });
      // console.log(this.tableData, this.L5CheckList, "1111");
    },
    createId() {
      let paramId = "";
      const paramIdLength = 6;
      const random = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        0,
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ];
      for (let i = 0; i < paramIdLength; i++) {
        let indexId = Math.floor(Math.random() * 26);
        paramId += random[indexId];
      }
      return paramId;
    },
  },
  created() {
    // this.init()
  },
  mounted() {
    window.addEventListener("scroll", this.getLocation, true);
    // document
    //   .querySelector(".menu_scroll");
    //   .addEventListener("scroll", this.getLocation);
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_apimgmt_api_mod_params {
  .params_wrapper {
    // padding: 20px 30px;
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
    .add_dialog_conf1 {
      padding: 15px 12px;
      .search_conf {
        padding: 0;
        margin: 0;
      }
      .show_conf {
        padding: 15px 24px;
        // overflow: hidden;
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
      .check_content {
        display: flex;
        .left {
          width: 20%;
          max-height: 420px;
          // overflow: auto;
          border: 2px solid #dcdfe6;
          // flex: 1;
        }
        .middle {
          width: 80%;
          max-height: 420px;
          margin-left: 10px;
          // overflow: auto;
        }
        .list_title {
          border-bottom: 1px solid #dcdfe6;
          padding: 10px;
          font-weight: 600;
          color: #333;
          // margin-bottom: 5px;
        }
      }
    }
    .service_menu_list {
      // margin-top: 8px;
      // height: 278px;
      max-height: 370px;
      overflow-y: scroll;
      .list_item {
        font-size: 12px;
        // margin-bottom: 6px;
        // white-space: nowrap;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        cursor: pointer;
        padding: 4px 6px;
        // height: 30px;
        &:hover,
        &.active {
          background: #eaf1ff;
          .text_area .list_item_title {
            color: $theme_color;
            font-weight: 600;
          }
        }
        .text_area {
          display: flex;
          .icon {
            margin-right: 4px;
          }
          .list_item_title {
            white-space: nowrap;
            text-overflow: ellipsis;
            // overflow: hidden;
            // padding: 0 10px;
            max-width: 120px;
            height: 20px;
            line-height: 20px;
            color: #000;
            cursor: pointer;
            font-size: 13px;
            &.r4b {
              max-width: 170px;
            }
          }
        }
        &:hover {
          .list_item_icon {
            &.delete {
              display: inline-block;
            }
          }
        }
        .list_item_icon {
          &.delete {
            display: none;
            // color: $danger_color;
            cursor: pointer;
          }
        }
        .icon_area {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
