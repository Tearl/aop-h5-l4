<template>
  <div class="aop_tradedesign_dicmgmt_comps_field_list">
    <div class="input_wrapper">
      <!-- <TableHeader
        title="相似服务列表"
        :btnList="btnList"
        @btnClick="handleBtnClik"
      ></TableHeader> -->
      <h1>字段列表</h1>
      <Table
        class="table_style"
        :data="dataList"
        :table="dataTable"
        @operate="operate"
      ></Table>
      <PagePagination
        class="pn_style"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pager="pager"
      >
      </PagePagination>
    </div>
  </div>
</template>

<script>
import Table from "@m/core/components/page_table";
import PageDialog from "@m/core/components/page_dialog";
import filters from "@m/utils/filters";
import PagePagination from "@m/core/components/page_pagination";
import TableHeader from "@m/core/components/page_table_header";

export default {
  components: {
    Table,
    PageDialog,
    PagePagination,
    TableHeader,
  },
  props: {
    bizType: {
      type: String,
      default: () => "edit",
    },
    currentD4bObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      //相似服务数据
      dataList: [],
      dataTable: [
        {
          prop: "xsd",
          label: "字段名称",
          // width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "fwbm",
          label: "字段英文",
          // width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "fwmc",
          label: "所属类型",
          // width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "fwms",
          label: "所属数据集",
          // width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "fwms",
          label: "所属分段",
          // width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "statusCd",
          label: "状态",
          type: "textClassList",
          filter: "dataSetStusCd",
          textClassList: [
            { class: "add status", val: "0" },
            { class: "publishing status", val: "-1" },
            { class: "selfOther status", val: "1" },
            { class: "register status", val: "2" },
          ],
        },
      ],
      // 列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      btnList: [],
    };
  },
  computed: {},
  methods: {
    operate(op, data) {
      console.log(op, data);
    },
    init() {
      this.getSimilarServiceList();
    },
    //翻页器
    handleSizeChange(e) {
      this.pager.turnPageShowNum = e + "";
      this.pager.currentPage = "1";
      this.getSimilarServiceList();
    },
    handleCurrentChange(e) {
      this.pager.currentPage = e + "";
      this.getSimilarServiceList();
    },
    //获取相似列表
    getSimilarServiceList() {},
    handleBtnClik() {},
  },
  created() {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dicmgmt_comps_field_list {
  .input_wrapper {
    padding: 20px 24px;
    background-color: #fff;
  }
  .table_style {
    margin-top: 16px;
    ::v-deep .el-table th {
      line-height: 0;
      color: $sec_ft_color;
    }
  }
  .pn_style {
    text-align: center;
  }
  h1 {
    font-family: $font_medium;
    font-size: 16px;
    // color: $pri_ft_color;
    color: #333333;
    letter-spacing: 0;
    // font-weight: $font_weight_600;
  }
}
</style>