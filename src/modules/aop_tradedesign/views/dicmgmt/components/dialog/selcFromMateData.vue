<template>
  <div class="aop_workgate_comps_dicmgmt_dic_form_select">
    <PageDialog
      dialogTitle="选择元数据"
      :dialogVisiable="dialogVisible"
      dialogWidth="1000px"
      @closeDialog="closeDialog"
      class="dialog"
    >
      <div slot="box">
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
        <div class="content">
          <div class="table_operate">
            <div class="header_content">
              <h1>现有元数据列表</h1>
              <div class="btn">
                <el-button
                  type="primary"
                  @click="addMateData"
                  class="btn_style"
                  icon="el-icon-plus"
                  >新增元数据</el-button
                >
              </div>
            </div>
          </div>
          <Table
            ref="dictListTableRef"
            class="table_style"
            :table="tables"
            :tableType="selectType"
            :data="dictionaryData"
            @selectionChange="handleSelectionChange"
            @radioChange="radioChange"
            @operate="operate"
            :treeProps="{ children: 'none' }"
          ></Table>
          <PagePagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager="pager"
          >
          </PagePagination>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </PageDialog>
    <AddMateData ref="addMateDataRef" @confirmMate="getList"></AddMateData>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import AddMateData from "./addMateData";
import { unduplicated } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    AddMateData,
  },
  props: {
    selectType: () => "",
  },
  data() {
    return {
      dialogVisible: false,
      serviceForm: [
        {
          type: "inputIcon",
          model: "content",
          placeholder: "请输入",
          labelText: "参数名称:",
        },
        {
          type: "select",
          model: "attributeTyp",
          placeholder: "请选择",
          labelText: "属性类型:",
          select: [
            { value: "", type: "所有属性" },
            { value: "0", type: "普通属性" },
            { value: "1", type: "对象属性" },
            { value: "2", type: "枚举属性" },
            { value: "3", type: "列表属性" },
            { value: "4", type: "自定义属性" },
          ],
        },
        {
          type: "select",
          model: "paraType",
          placeholder: "参数值类型",
          labelText: "参数值类型:",
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
        // preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        paraType: "",
        attributeTyp: "",
      },
      // 数据字典搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        content: "", // 编号或名称或描述
        // preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        paraType: "",
        attributeTyp: "",
      },
      // 分段列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 分段列表参数
      tables: [
        {
          prop: "dictryId",
          label: "",
          minWidth: "10%",
          type: "radio",
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
          // operate: "read",
        },
        {
          prop: "dictryDescr",
          label: "参数描述",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "attributeTypNm",
          label: "属性类型",
          minWidth: "30%",
          type: "text",
        },
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
      beltLine: "",
    };
  },
  watch: {
    defaultTable(value) {
      this.tableData = JSON.parse(JSON.stringify(value))
    }
  },
  methods: {
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
      console.log(this.selectionData, "selectionData")
      this.selectionData = e;
      this.isRecord = false;
    },
    showDialog() {
      this.searchRecord = {
        content: "",
        paraType: "",
        attributeTyp: "",
      };
      this.getList();
      this.init();
      this.dialogVisible = true;
    },
    operate(operation, data) {
      console.log(operation, data);
      if (operation == "read") {
        this.$refs.subsectioDetailRef.showDialog();
      }
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
        isBaseType: "0",
        ...this.searchRecord,
        beltLine:this.beltLine
      };
      const res = await this.rpc.dictionary.getDictionaryList(data);
      // this.dicGetNodeId(res.dictionariesInfoBoList);
      this.dictionaryData = JSON.parse(
        JSON.stringify(res.dictionariesInfoBoList)
      );
      this.pager.total = res.turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableData();
      });
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
    closeDialog() {
      this.$refs.formRef.resetFields();
      this.dialogVisible = false;
    },
    radioChange(e, data) {
      this.selectionData = data;
      console.log(this.selectionData);
    },
    confirm() {
      this.$emit("confirmData", this.selectionData);
      this.closeDialog();
    },
    // 初始化
    init() {
      this.beltLine = this.$route.query.beltLine;
      console.log(this.tables)
      if (this.selectType === 'selection') {
        this.tables = this.tables.filter((item) => {
          return item && item.type !== 'radio'
        })
      }
      // this.getList();
      // this.getClassifyTypeList()
    },
     // 数据分类的下拉列表
    async getClassifyTypeList() {
      const params = { turnPageShowNum: "0" };
      const res = await this.rpc.systemmgmt.getClassifyTypeList(params);
      const selectList = res.serviceList.map((item) => ({
        type: item.clsfNm,
        value: item.clsfId,
      }));
      this.serviceForm.find((item) => item.model == "paraGateg").select =
        selectList;
    },
    addMateData() {
      this.$refs.addMateDataRef.showAddDialog();
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_dicmgmt_dic_form_select {
  .content {
    padding: 0px 30px;
  }
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
  ::v-deep
    .aop_tradedesign_comps_page_service_top
    .el-form
    .el-form-item
    .el-input {
    width: 160px;
  }
  ::v-deep .el-form-item__label {
    width: 86px !important;
  }
  .table_operate {
    padding: 16px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    h1 {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #111111;
      letter-spacing: 0;
    }
    .header_content {
      display: flex;
      justify-content: space-between;
      // flex: 1;
      width: 100%;
      margin-right: 10px;
      .btn_style {
        @include small_button_common;
      }
    }
  }
  ::v-deep .aop_tradedesign_comps_page_service_top {
    padding: 0;
    margin-bottom: 0;
    // height: 64px;
  }
  ::v-deep .aop_tradedesign_comps_page_service_top .serivce_top {
    padding: 21px 16px;
    height: 64px;
    box-shadow: inset 0 -1px 0 0 #e7e7e7;
  }
  ::v-deep .el-dialog .el-dialog__body {
    padding: 0px !important;
  }
}
</style>
