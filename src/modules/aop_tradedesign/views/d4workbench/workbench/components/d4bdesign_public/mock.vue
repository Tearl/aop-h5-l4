<template>
  <div class="aop_tradedesign_comps_d4bdesign_public_mock">
    <div class="top_right_desc">数据输出</div>
    <Table
      class="table_style"
      :data="iMockList"
      :table="iMockListTable"
      :rowK="'serialNumber'"
      :treeProps="{ children: 'children' }"
    ></Table>
  </div>
</template>

<script>
import Table from "@m/core/components/page_table";
export default {
  components: {
    Table,
  },
  props: {
    // 当前reqmentId对应的详情信息
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    // 页面类型
    pageType: {
      type: String,
      default: () => "edit",
    },
  },
  data() {
    return {
      // mock列表参数
      iMockListTable: [
        {
          prop: "key",
          label: "参数名称",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "name",
          label: "参数中文名称",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "value",
          label: "参数值",
          placeholder: "请输入参数值",
          minWidth: "20%",
          type: "input",
          templateIf: function (scope) {
            return !scope.row.children;
          },
        },
      ],
      // mock列表数据
      iMockList: [],
    };
  },
  created() {
    this.iMockListTable[2].type = this.pageType == "read" ? "text" : "input";
    console.log(this.iMockListTable[2].type);
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4bdesign_public_mock {
  .table_style {
    margin-top: 16px;
    ::v-deep .el-table th {
      line-height: 0;
      color: $sec_ft_color;
    }
  }
  .top_right_desc {
    font-family: $font_regular;
    font-size: 14px;
  }
}
</style>
