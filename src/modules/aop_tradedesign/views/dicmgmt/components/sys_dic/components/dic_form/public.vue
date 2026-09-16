<template>
  <div class="aop_tradedesign_comps_dicmgmt_dic_form_public">
    <!-- 公共字典数据 -->
    <PageDialog
      dialogTitle="公共数据字典选择"
      :dialogVisiable="dialogVisible"
      dialogWidth="70%"
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
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import { unduplicated } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    }
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
        {
          type: "select",
          model: "paraGateg",
          placeholder: "所属分类",
          select: [],
          filterable: true,
        },
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
        paraGateg: "", // 所属分类
      },
      // 数据字典搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        dictryKeyWord: "", // 关键字
        paraType: "", // 类型
        paraGateg: "", // 所属分类
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
        {
          prop: "dictryGategName",
          label: "所属分类",
          minWidth: "20%",
          type: "text",
          tooltip: true,
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

      paramsRadioModel: "",
      paramsDetail: {}
    }
  },
  methods: {
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
      this.paramsDetail = data;
      console.log(this.paramsDetail)
    },
    closeDialog() {
      this.$refs.formRef.resetFields();
      this.$emit("closeDialog")
    },
    confirm() {
      this.$emit("confirmParams", this.paramsDetail);
    },
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
