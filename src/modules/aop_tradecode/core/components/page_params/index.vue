<template>
  <div class="aop_tradecode_comps_page_params">
    <div class="input_wrapper">
      <div class="top_right_create">
        <span class="params_title required_fields">输入参数</span>
        <el-button type="primary" icon="el-icon-plus" @click="showParams('s')"
          >添加输入参数</el-button
        >
        <!-- <el-button icon="el-icon-circle-check" @click="showConf(iInputList)"
          >配置验证规则</el-button
        > -->
      </div>

      <Table
        class="table_style_ft table_style"
        :data="iInputList"
        :table="iInputListTable"
        :rowK="'serialNumber'"
        :treeProps="{ children: 'children' }"
        @operate="operate"
        :cellStyle="dictListCellStyle"
      ></Table>
    </div>
    <div class="output_wrapper">
      <div class="top_right_create">
        <span class="params_title">输出参数</span>
        <el-button type="primary" icon="el-icon-plus" @click="showParams('r')"
          >添加输出参数</el-button
        >
        <!-- <el-button icon="el-icon-circle-check" @click="showConf(iOutputList)"
          >配置验证规则</el-button
        > -->
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

    <!-- 添加参数 -->
    <PageDialog
      :dialogWidth="'56.3%'"
      :dialogTitle="'请选择参数'"
      :dialogVisiable="addVisible"
      @closeDialog="addVisible = false"
      class="create_dialog"
      :apTobody="apTobody"
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
                {{ item.dictNm }}
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

    <!-- 配置参数 -->
    <PageDialog
      :dialogWidth="'56.3%'"
      :dialogTitle="'校验配置'"
      :dialogVisiable="confVisible"
      @closeDialog="confVisible = false"
      class="create_dialog"
    >
      <div slot="box">
        <div class="conf_dialog_conf">
          <Table
            class="table_style_ft table_style"
            :data="tableData"
            :table="configTables"
          ></Table>
        </div>
      </div>
      <div slot="footer">
        <el-button @click.native="confVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="saveConf">确定</el-button>
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
export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
  },
  props: {
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    apTobody: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
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
          minWidth: "20%",
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
      // 配置验证规则列表参数
      configTables: [
        {
          prop: "paraNo",
          label: "参数名称",
          type: "text",
        },
        {
          prop: "paraNm",
          label: "参数中文名称",
          type: "text",
          minWidth: "100%",
        },
        {
          prop: "paraTyp",
          label: "参数类型",
          filter: "paraTyp",
          type: "text",
        },
        {
          prop: "paraDfltVal",
          label: "默认值",
          placeholder: "默认值",
          type: "input",
          size: "mini",
        },
        {
          prop: "paraMaxLength",
          label: "长度",
          type: "input",
          placeholder: "长度",
          size: "mini",
          input: function (e, scope) {
            return (scope.row.paraMaxLength = e.replace(/[^0-9]/gi, ""));
          },
        },
        {
          prop: "paraVlidtRuleId",
          label: "验证规则",
          placeholder: "请选择",
          type: "select",
          size: "mini",
          selectVal: [],
        },
        {
          prop: "paraVlidtExps",
          label: "自定义规则",
          placeholder: "自定义规则",
          type: "input",
          size: "mini",
          disabled: function (scope, data) {
            const target = data[5].selectVal.find(
              (item) => item.value == scope.row.paraVlidtRuleId
            );
            if (!!target)
              return target.ruleFillInFlg == "0" || target.ruleFillInFlg == ""
                ? false
                : true;
            return true;
          },
        },
        {
          prop: "paraNed",
          label: "是否必输",
          type: "checkbox",
          size: "mini",
          true: "0",
          false: "1",
        },
      ],
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
          prop: "paraDfltVal",
          label: "默认值",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paraMaxLength",
          label: "长度",
          width: "90",
          type: "text",
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
          prop: "paraNed",
          label: "是否必输",
          width: "90",
          type: "text",
          filter: "paraNed",
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
          minWidth: "20%",
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
      // 输入输出参数弹框列表数据
      dictList: [],
      // 输入输出参数弹框选择类型下拉框数据
      dictGategList: [],
      // 输入列表数据
      iInputList: [],
      // 输出列表数据
      iOutputList: [],
      // 配置验证规则的规则下拉框
      ruleList: [],
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
      // 配置验证规则弹框
      confVisible: false,
      // 选择参数分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    //初始化
    init() {
      this.getParamsList();
      this.getRuleList();
      // this.getTypeList();
      this.getClassifyTypeList();
    },
    // 所属分类的下拉列表
    async getClassifyTypeList() {
      const params = { turnPageShowNum: "0" };
      const res = await this.rpc.dictionary.getClassifyTypeList(params);
      this.classifyOptions = res.serviceList;
      const selectList = res.serviceList.map((item) => ({
        type: item.clsfNm,
        value: item.clsfId,
        
      }))
      this.serviceForm.find(item => item.model == "clsfId").select = selectList;
    },
    // 获取输入输出参数列表数据
    async getParamsList() {
      const data = {
        dictPid: "",
        ...this.formInline,
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const { dictList, turnPageTotalNum } = await this.rpc.dictionary.getParamsList(data);
      this.dictList = setSerialNumber(dictList)
      // this.dictList = dictList;
      // for (let i in this.dictList) {
      //   if (this.dictList[i].dictTyp == "1") {
      //     await this.getChildParamsList(this.dictList[i], i);
      //   }
      // }
      this.pager.total = turnPageTotalNum * 1;
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
    // 查找验证规则下拉框数据
    async getRuleList() {
      const { ruleList } = await this.rpc.rule.getSelectRuleList();
      ruleList.forEach((item) => {
        this.configTables[5].selectVal.push({
          type: item.ruleNm,
          value: item.ruleId,
          ruleFillInFlg: item.ruleFillInFlg,
        });
      });
      this.ruleList = ruleList;
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
    addMock(b) {
      const a = {
        key: b.paraNo,
        name: b.paraNm,
        children: b.children || [],
        value: "",
      };
      return a;
    },
    operate(operation, e) {
      if (operation == "s") {
        this.iInputList = this.iInputList.filter(
          (item) => item.paraId !== e.paraId
        );
      } else {
        this.iOutputList = this.iOutputList.filter(
          (item) => item.paraId !== e.paraId
        );
        this.removeMockData(e.paraNo);
      }
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
    mapMockData(data) {
      for (let i in data) {
        data[i] = this.addMock(data[i])
        if (data[i].children && data[i].children.length > 0) {
          this.mapMockData(data[i].children)
        }
      }
      return data
    },
    // 保存当前选中的参数
    saveParams() {
      const data = JSON.parse(JSON.stringify(this.tableData))
      if (this.formInline.type == "s") {
        this.iInputList.push(...this.mapIoData(data, "0"))
        this.iInputList = setSerialNumber(unduplicated(this.iInputList));
      } else {
        this.iOutputList.push(...this.mapIoData(data, "1"))
        this.iOutputList = setSerialNumber(unduplicated(this.iOutputList));
        const mockList = setSerialNumber(this.mapMockData(JSON.parse(JSON.stringify(this.iOutputList))))
        this.addMockData(mockList)
      }
      this.$nextTick(() => {
        this.$refs.dictListTableRef.clearSelection();
      });
      this.pager.currentPage = "1";
      this.addVisible = false;
    },
    // 配置验证规则按钮点击
    showConf(e) {
      this.tableData = JSON.parse(JSON.stringify(e));
      this.confVisible = true;
    },
    // 配置验证规则弹框确定按钮点击
    saveConf() {
      this.iInputList = JSON.parse(JSON.stringify(this.tableData));
      this.iInputList.forEach((item) => {
        this.ruleList.forEach((it) => {
          if (item.paraVlidtRuleId == it.ruleId) {
            item.paraVlidtRuleId = it.ruleNm;
          }
        });
      });
      this.confVisible = false;
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
      this.pager.currentPage = "1";
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
    removeMockData(e) {
      this.$emit("removeMockData", e);
    },
    addMockData(e) {
      this.$emit("addMockData", e);
    },
    //多选显示
    dictListCellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.dictPid !== "" && column.type === "selection") {
        return { visibility: "hidden" };
      }
    },
    // 自定义规则的输入框是否禁用
    isParaVlidtExpsDisabled(row) {
      const target = this.ruleList.find(
        (item) => item.ruleId == row.paraVlidtRuleId
      );
      if (!!target)
        return target.ruleFillInFlg == "0" || target.ruleFillInFlg == ""
          ? false
          : true;
      return true;
    },
    integerFormat(e) {
      return e.replace(/[^0-9]/gi, "");
    },
  },
  filters: {
    ...filters,
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_comps_page_params {
  .input_wrapper,
  .output_wrapper {
    .table_style {
      margin-top: 16px;
    }
    .top_right_create {
      ::v-deep .el-button {
        @include large_button_common;
      }
      .params_title {
        font-family: $font_regular;
        font-size: 14px;
        color: $reg_ft_color;
        letter-spacing: 0;
        text-align: right;
        padding-right: 16px;
        font-weight: $font_weight_600;
        position: absolute;
        left: -70px;
        &.required_fields {
          left: -80px;
          &::before {
            content: "*";
            color: $sec_danger_color;
            margin-right: 2px;
          }
        }
      }
    }
  }
  .output_wrapper {
    margin-top: 20px;
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
    .conf_dialog_conf {
      padding: 15px 24px;
      .search_conf {
        margin-bottom: 15px;
        .search_conf_f {
          width: 200px;
          ::v-deep .el-form-item__content {
            width: 100%;
          }
        }
        .search_conf_s {
          width: 90px;
        }
        .search_conf_btn {
          float: right;
        }
      }
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
