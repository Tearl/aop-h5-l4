<template>
  <div class="aop_tradedesign_comps_dictionary_process_params">
    <div class="params_pick">
      <div class="middle_radio">
        <el-radio-group v-model="defaultActive" size="small">
          <el-radio-button label="s">输入参数</el-radio-button>
          <el-radio-button label="r">输出参数</el-radio-button>
          <el-radio-button label="t">临时参数</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="input_wrapper" v-show="defaultActive == 's'">
      <div class="top_create">
        <div class="top_title"><span>*</span>输入参数</div>
        <div class="top_btns">
          <el-button type="primary" icon="el-icon-plus" @click="showParams('s')"
            >从数据字典选择</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="showInnerParams('s')"
            >从流程内部选择</el-button
          >
        </div>
      </div>

      <Table
        class="table_style_ft table_style"
        :data="iInputList"
        :table="iInputListTable"
        :rowK="'serialNumber'"
        :treeProps="{ children: 'children' }"
        @operate="operate"
      ></Table>
    </div>
    <div class="output_wrapper" v-show="defaultActive == 'r'">
      <div class="top_create">
        <div class="top_title">输出参数</div>
        <div class="top_btns">
          <el-button type="primary" icon="el-icon-plus" @click="showParams('r')"
            >从数据字典选择</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="showInnerParams('r')"
            >从流程内部选择</el-button
          >
        </div>
      </div>
      <Table
        class="table_style_ft table_style"
        :data="iOutputList"
        :table="iOutputListTable"
        :rowK="'serialNumber'"
        :treeProps="{ children: 'children' }"
        @operate="operate"
      ></Table>
    </div>
    <div class="temp_wrapper" v-show="defaultActive == 't'">
      <div class="top_create">
        <div class="top_title"><span>*</span>临时参数</div>
        <div class="top_btns">
          <el-button type="primary" icon="el-icon-plus" @click="showParams('s')"
            >从数据字典选择</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="showInnerParams('s')"
            >从流程内部选择</el-button
          >
        </div>
      </div>

      <Table
        class="table_style_ft table_style"
        :data="iInputList"
        :table="iInputListTable"
        :rowK="'serialNumber'"
        :treeProps="{ children: 'children' }"
        @operate="operate"
      ></Table>
    </div>

    <!-- 添加参数 -->
    <PageDialog
      :dialogWidth="'80%'"
      :dialogTitle="'请选择参数'"
      :dialogVisiable="addVisible"
      @closeDialog="addVisible = false"
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
                {{ item.dictNm }}
              </el-tag>
            </div>
          </div>
        </div>
        <div v-show="radioHeader == 1" class="add_dialog_conf">
          <DictionaryForm :sysId="sysId" @toDicList="toDicList"></DictionaryForm>
        </div>
      </div>
      <div slot="footer">
        <el-button @click.native="addVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="saveParams">确定</el-button>
      </div>
    </PageDialog>

    <!-- 添加流程内参数 -->
    <PageDialog
      :dialogWidth="'56.3%'"
      :dialogTitle="'请选择参数'"
      :dialogVisiable="innerTableVis"
      @closeDialog="innerTableVis = false"
      class="create_dialog"
    >
      <div slot="box">
        <div class="add_dialog_conf">
          <ServiceTop
            ref="innerFormRef"
            :serviceForm="innerForm"
            :form="innerFormInline"
            class="search_conf"
          >
            <div slot="rightButton">
              <el-button
                type="primary"
                size="small"
                @click="goInnerSearch"
                class="right_button"
                >搜索</el-button
              >
              <el-button
                size="small"
                @click="resetInnerSearch"
                class="right_button"
                >重置</el-button
              >
            </div>
          </ServiceTop>
          <Table
            class="table_style"
            :data="innerFlow"
            :table="innerFlowTables"
            ref="innerTableRef"
            :rowK="'serialNumber'"
            :treeProps="{ children: 'children' }"
            :tableType="'selection'"
            :cellStyle="innerCellStyle"
            @selectionChange="handleInnerSelectionChange"
          ></Table>
          <!-- 分页器 -->
          <PagePagination
            @size-change="handleInnerSizeChange"
            @current-change="handleInnerCurrentChange"
            :pager="innerPager"
          >
          </PagePagination>
          <div class="show_conf">
            <div class="show_conf_title">
              已选择{{ innerDataPick && innerDataPick.length }}个：
            </div>
            <div class="show_conf_content">
              <el-tag
                v-for="(item, index) in innerDataPick"
                :key="index"
                type="info"
                size="small"
                closable
                class="show_conf_tag"
                @close="delInnerParamsTag(item, innerFormInline.type)"
              >
                {{ item.dictNm }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click.native="innerTableVis = false">取 消</el-button>
        <el-button type="primary" @click.native="saveInnerParams"
          >确定</el-button
        >
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
import Tabs from "@m/core/components/page_tabs";
import DictionaryForm from "./components/dic_form";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    Tabs,
    DictionaryForm,
  },
  props: {
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // 当前服务id
      blngtoId: "",
      //控制页签的切换显示
      defaultActive: "s",
      // 添加输入参数列表参数
      iInputListTable: [
        {
          prop: "paraNo",
          label: "参数名称",
          type: "text",
          minWidth: "30%",
          tooltip: true,
        },
        {
          prop: "paraNm",
          label: "参数中文名称",
          type: "text",
          minWidth: "20%",
          tooltip: true,
        },
        {
          prop: "paraDescr",
          label: "参数描述",
          type: "text",
          minWidth: "20%",
          tooltip: true,
        },
        {
          prop: "paraTyp",
          label: "参数类型",
          type: "text",
          filter: "paraTyp",
          width: "90",
        },
        {
          prop: "paraVlidtRuleId",
          label: "验证规则",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paraVlidtExps",
          label: "自定义规则",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          label: "操作",
          type: "button",
          width: "50",
          buttonList: [
            {
              desc: "删除",
              operate: "s",
              relation: function (scope) {
                return scope.row.paraPareId == "";
              },
            },
          ],
        },
      ],
      // 添加参数输出列表参数
      iOutputListTable: [
        {
          prop: "paraNo",
          label: "参数名称",
          type: "text",
          minWidth: "30%",
          tooltip: true,
        },
        {
          prop: "paraNm",
          label: "参数中文名称",
          type: "text",
          minWidth: "20%",
          tooltip: true,
        },
        {
          prop: "paraDescr",
          label: "参数描述",
          type: "text",
          minWidth: "20%",
          tooltip: true,
        },
        {
          prop: "paraTyp",
          label: "参数类型",
          type: "text",
          filter: "paraTyp",
          width: "90",
        },
        {
          prop: "paraVlidtRuleId",
          label: "验证规则",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paraVlidtExps",
          label: "自定义规则",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          label: "操作",
          type: "button",
          width: "50",
          buttonList: [
            {
              desc: "删除",
              operate: "r",
              relation: function (scope) {
                return scope.row.paraPareId == "";
              },
            },
          ],
        },
      ],
      // 输入列表数据
      iInputList: [],
      // 输出列表数据
      iOutputList: [],
      // 参数存放
      paramList: [],

      // 字典参数
      // 添加参数列表参数
      dictListTables: [
        {
          prop: "dictNo",
          label: "参数名称",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictNm",
          label: "参数中文名称",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictDescr",
          label: "参数描述",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictGategNm",
          label: "所属分类",
          width: "90",
          type: "text",
        },
        {
          prop: "dictTyp",
          label: "参数类型",
          width: "90",
          type: "text",
          filter: "paraTyp",
        },
        {
          prop: "dictRule",
          label: "验证规则",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictRuleExps",
          label: "自定义规则",
          minWidth: "20%",
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
          model: "searchContent",
          placeholder: "搜索参数名称、中文名或描述",
          style: {
            width: "260px",
          },
        },
        {
          type: "select",
          model: "clsfId",
          placeholder: "所属分类",
          select: [],
          filterable: true,
        },
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
        searchContent: "",
        clsfId: "",
        dictType: "",
      },
      // 已选参数数组
      tableData: [],
      selectionData: [],
      // 选择参数弹框
      addVisible: false,
      // 选择参数分页器
      dicPager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 记录是否点击分页器和搜索按钮
      isRecord: false,

      // 流程内添加参数
      // 添加参数列表参数
      innerFlowTables: [
        {
          prop: "dictNo",
          label: "参数名称",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictNm",
          label: "参数中文名称",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictDescr",
          label: "参数描述",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictTyp",
          label: "参数类型",
          width: "90",
          type: "text",
          filter: "paraTyp",
        },
        {
          prop: "dictRule",
          label: "验证规则",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictRuleExps",
          label: "自定义规则",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
      ],
      // 输入输出参数弹框列表数据
      innerFlow: [],
      // 输入输出参数弹框选择类型下拉框数据
      dictGategList: [],
      // 公共搜索
      innerForm: [
        {
          type: "input",
          model: "searchContent",
          placeholder: "搜索参数名称、中文名或描述",
          style: {
            width: "260px",
          },
        },
        {
          type: "select",
          model: "paraType",
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
      innerFormInline: {
        searchContent: "",
        paraType: "",
      },
      // 已选参数数组
      innerDataPick: [],
      innerDataSel: [],
      // 选择参数弹框
      innerTableVis: false,
      // 选择参数分页器
      innerPager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 记录是否点击分页器和搜索按钮
      isInnerRecord: false,
      // 输入参数记录
      iInputListRecord: "",
      // 输出参数记录
      iOutputListRecord: "",
      radioHeader: 0,  //切换tabs参数
      sysId: ""
    };
  },
  created() {
    this.init();
  },
  methods: {
    //初始化
    init() {
      this.blngtoId = this.$route.query.servId;
      this.getParamsList();
      this.getClassifyTypeList()
      // this.getTypeList();
      this.getAllParams('0');
      this.getAllParams('1');
    },
    // 获取已有参数列表
    async getAllParams(e) {
      const data = {
        blngtoId: this.blngtoId,
        blngtoTyp: "1",
        paraPosition: e ? e : this.defaultActive == "s" ? "0" : "1",
      };
      const { paramList } =
        await this.rpc.public.getAllParamsList(data);
      this.paramList = paramList;
      if (e == '0' ? true : (e == '1' ? false : this.defaultActive == "s")) {
        this.iInputList = setSerialNumber(this.paramList);
      } else {
        this.iOutputList = setSerialNumber(this.paramList);
      }
      if(!!e) {
        this.iInputListRecord = JSON.stringify(this.iInputList)
        this.iOutputListRecord = JSON.stringify(this.iOutputList)
      }
    },
    // 获取输入输出参数列表数据
    async getParamsList() {
      const data = {
        dictPid: "",
        searchContent: this.formInline.searchContent,
        clsfId: this.formInline.clsfId,
        dictType: this.formInline.dictType,
        currentPage: this.dicPager.currentPage + "",
        turnPageShowNum: this.dicPager.turnPageShowNum,
      };
      const { dictList, turnPageTotalNum } =
        await this.rpc.dictionary.getParamsList(data);
      this.dictList = setSerialNumber(dictList);
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
    // 查找所有list的子参数
    async getChildParamsList(e, i) {
      const data = {
        dictPid: e.dictId,
        searchContent: "",
        clsfId: "",
        dictType: "",
        currentPage: "",
        turnPageShowNum: "",
      };
      const { dictList } = await this.rpc.dictionary.getParamsList(data);
      e.dictList = dictList;
      this.$set(this.dictList, i, e);
    },
    // 数据分类的下拉列表
    async getClassifyTypeList() {
      const params = { turnPageShowNum: "0" };
      const res = await this.rpc.dictionary.getClassifyTypeList(params);
      this.classifyOptions = res.serviceList;
      const selectList = res.serviceList.map((item) => ({
        type: item.clsfNm,
        value: item.clsfId,
      }));
      this.serviceForm.find((item) => item.model == "clsfId").select = selectList;
    },
    // 接口获取输入输出参数搜索栏 选择参数 下拉框数据
    // async getTypeList() {
    //   const { dictGategList } = await this.rpc.dictionary.getParamsTypeList();
    //   this.dictGategList = dictGategList.map((item) => {
    //     item.type = item.dictGategNm;
    //     item.value = item.dictGateg;
    //     return item;
    //   });
    //   this.serviceForm[0].select = this.serviceForm[0].select.concat(
    //     this.dictGategList
    //   );
    // },
    operate(operation, data) {
      if(operation == "s") {
        const index = this.iInputList.indexOf(data)
        this.iInputList.splice(index, 1)
      } else {
        const index = this.iOutputList.indexOf(data)
        this.iOutputList.splice(index, 1)
      }
      // this.$confirm("确定要删除吗？").then(async () => {
      //   const params = {
      //     paraId: e.paraId,
      //     blngtoId: this.blngtoId,
      //     blngtoTyp: "1",
      //     paraPosition: this.defaultActive == "s" ? "0" : "1",
      //   };
      //   const res = await this.rpc.public.delParamsIn(params);
      //   this.$notify({
      //     title: "成功",
      //     message: "删除成功",
      //     duration: 2000,
      //     type: "success",
      //   });
      //   this.getAllParams();
      // });
    },

    // 字典选择
    // 添加输入输出按钮点击
    showParams(e) {
      this.formInline.type = e;
      this.selectionData = [];
      this.tableData = [];
      this.addVisible = true;
      this.resetSearch();
      this.getParamsList();
      // this.tableData = e == "s" ? this.iInputList : this.iOutputList;
    },
    // 删除当前点击的参数
    delParamsTag(e) {
      const index = this.dictList.findIndex((item) => item.dictId == e.dictId);
      if (index == -1) {
        this.tableData = this.tableData.filter((it) => it.dictId != e.dictId);
      } else {
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          this.dictList[index],
          false
        );
      }
    },
    mapIoData(data, paraPosition) {
      for (let i in data) {
        data[i] = dict2Para(data[i], paraPosition)
        if (data[i].children && data[i].children.length > 0) {
          this.mapIoData(data[i].children, paraPosition)
        }
      }
      return data
    },
    // 保存当前选中的参数
    async saveParams() {
      const data = JSON.parse(JSON.stringify(this.tableData))
      if (this.formInline.type == "s") {
        this.iInputList.push(...this.mapIoData(data, "0"))
        this.iInputList = setSerialNumber(unduplicated(this.iInputList));
      } else {
        this.iOutputList.push(...this.mapIoData(data, "1"))
        this.iOutputList = setSerialNumber(unduplicated(this.iOutputList));
      }
      this.$nextTick(() => {
        this.$refs.dictListTableRef.clearSelection();
      });
      this.dicPager.currentPage = "1";
      this.addVisible = false;
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
    goSearch() {
      this.isRecord = true;
      this.dicPager.currentPage = "1";
      this.getParamsList();
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
    // 初始化添加输入输出搜索栏
    resetSearch() {
      this.dicPager.currentPage = "1";
      this.formInline.dictNo = "";
      this.formInline.dictGateg = "ALL";
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
              (it) => it.dictId != item.dictId
            );
          }
        });
      } else {
        this.tableData.push(...e);
        this.tableData = unduplicated(this.tableData, "dictId");
      }
      this.selectionData = e;
      this.isRecord = false;
    },
    //多选显示
    dictListCellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.dictPid !== "" && column.type === "selection") {
        return { visibility: "hidden" };
      }
    },

    // 流程内部
    // 获取输入输出参数列表数据
    async getParamsByProcess() {
      const data = {
        dictPid: "",
        searchContent: this.innerFormInline.searchContent,
        paraType: this.innerFormInline.paraType,
        cpntId: this.blngtoId,
        blngtoTyp: "1",
        currentPage: this.innerPager.currentPage + "",
        turnPageShowNum: this.innerPager.turnPageShowNum,
      };
      const { dictList, turnPageTotalNum } =
        await this.rpc.public.getParamsByProcess(data);
      this.innerFlow = setSerialNumber(dictList);
      // for (let i in this.innerFlow) {
      //   if (this.innerFlow[i].dictTyp == "1") {
      //     await this.getChildParamsByProcess(this.innerFlow[i], i);
      //   }
      // }
      this.innerPager.total = turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isInnerTableData();
      });
    },
    // 查找所有list的子参数
    async getChildParamsByProcess(e, i) {
      const data = {
        dictPid: e.dictId,
        blngtoTyp: "1",
        searchContent: "",
        paraType: "",
        cpntId: this.blngtoId,
        currentPage: "",
        turnPageShowNum: "",
      };
      const { dictList } = await this.rpc.dictionary.getParamsList(data);
      e.dictList = dictList;
      this.$set(this.innerFlow, i, e);
    },
    // 添加输入输出按钮点击
    showInnerParams(e) {
      this.innerFormInline.type = e;
      this.innerDataSel = [];
      this.innerDataPick = [];
      this.innerTableVis = true;
      this.resetInnerSearch();
      this.getParamsByProcess();
      // this.innerDataPick = e == "s" ? this.iInputList : this.iOutputList;
    },
    // 删除当前点击的参数
    delInnerParamsTag(e) {
      const index = this.innerFlow.findIndex((item) => item.dictId == e.dictId);
      if (index == -1) {
        this.innerDataPick = this.innerDataPick.filter(
          (it) => it.dictId != e.dictId
        );
      } else {
        this.$refs.innerTableRef.$refs.tableRef.toggleRowSelection(
          this.innerFlow[index],
          false
        );
      }
    },
    // 保存当前选中的参数
    async saveInnerParams() {
      const data = JSON.parse(JSON.stringify(this.innerDataPick))
      if (this.innerFormInline.type == "s") {
        this.iInputList.push(...this.mapIoData(data, "0"))
        this.iInputList = setSerialNumber(unduplicated(this.iInputList));
      } else {
        this.iOutputList.push(...this.mapIoData(data, "1"))
        this.iOutputList = setSerialNumber(unduplicated(this.iOutputList));
      }
      this.$nextTick(() => {
        this.$refs.innerTableRef.clearSelection();
      });
      this.innerPager.currentPage = "1";
      this.innerTableVis = false;
    },
    handleInnerSizeChange(e) {
      this.isInnerRecord = true;
      this.innerPager.turnPageShowNum = e + "";
      this.getParamsByProcess()
    },
    handleInnerCurrentChange(e) {
      this.isInnerRecord = true;
      this.getParamsByProcess()
    },
    goInnerSearch() {
      this.isInnerRecord = true;
      this.innerPager.currentPage = "1";
      this.getParamsByProcess();
    },
    // innerDataPick数据选中表格中
    isInnerTableData() {
      if (this.innerDataPick.length > 0) {
        this.innerDataPick.forEach((item) => {
          this.innerFlow.forEach((data) => {
            if (item.dictId == data.dictId) {
              this.isInnerRecord = true;
              this.$refs.innerTableRef.$refs.tableRef.toggleRowSelection(data);
            }
          });
        });
      }
    },
    // 初始化添加输入输出搜索栏
    resetInnerSearch() {
      this.innerPager.currentPage = "1";
      this.innerFormInline.paraNm = "";
      this.innerFormInline.paraSource = "ALL";
      if (this.$refs.innerFormRef) {
        this.$refs.innerFormRef.resetFields();
      }
    },
    // 多选框选中
    handleInnerSelectionChange(e) {
      if (!this.isInnerRecord && this.innerDataSel.length > e.length) {
        this.innerDataSel.forEach((item) => {
          if (e.indexOf(item) == -1) {
            this.innerDataPick = this.innerDataPick.filter(
              (it) => it.dictId != item.dictId
            );
          }
        });
      } else {
        this.innerDataPick.push(...e);
        this.innerDataPick = unduplicated(this.innerDataPick, "dictId");
      }
      this.innerDataSel = e;
      this.isInnerRecord = false;
    },
    //多选显示
    innerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.dictPid !== "" && column.type === "selection") {
        return { visibility: "hidden" };
      }
    },
    toDicList() {
      this.$emit("toDicList");
    },
  },
  filters: {
    ...filters,
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dictionary_process_params {
  width: 100%;
  height: 100%;
  .params_pick {
    height: 60px;
    line-height: 60px;
    width: 100%;
    border-bottom: 1px solid #dcdfe6;
    .middle_radio {
      margin-left: 30px;
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
  .input_wrapper,
  .output_wrapper,
  .temp_wrapper {
    padding: 35px 30px;
    .table_style {
      margin-top: 16px;
    }
    .top_create {
      overflow: hidden;
      width: 100%;
      ::v-deep .el-button {
        @include large_button_common;
      }
      .top_title {
        float: left;
        font-size: 16px;
        font-family: $font_medium;
        color: $pri_ft_color;
        span {
          color: #fc226e;
          margin-right: 2px;
        }
      }
      .top_btns {
        float: right;
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
      margin: 0 0 20px -24px;
      border-bottom: 1px solid #DCDFE6;
      width: calc(100% + 48px);
    }
  }
  ::v-deep .table_style_ft th {
    color: $sec_ft_color;
  }
  ::v-deep .table_style th {
    line-height: 0;
  }
  ::v-deep .el-dialog__wrapper {
    overflow: hidden;
  }
}
</style>
