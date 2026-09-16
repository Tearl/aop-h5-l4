<template>
  <div class="aop_tradedesign_comps_apimgmt_case_detail_rev">
    <div class="content_wrapper">
      <Table
        class="table_style"
        :data="dataList"
        :table="tableColumn"
        tableType="index"
      ></Table>
    </div>
  </div>
</template>

<script>
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table";
export default {
  components: {
    Table,
  },
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tableColumn: [
        {
          prop: "service2",
          label: "反Mock名称",
          type: "text",
        },
        {
          prop: "descr",
          label: "反Mock描述",
          type: "text",
        }
      ],
    };
  },
  methods: {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_case_detail_rev {
  .content_wrapper {
    .table_style {
      margin-top: 16px;
      ::v-deep .el-table th {
        color: $sec_ft_color;
      }
    }
  }
}
</style>
