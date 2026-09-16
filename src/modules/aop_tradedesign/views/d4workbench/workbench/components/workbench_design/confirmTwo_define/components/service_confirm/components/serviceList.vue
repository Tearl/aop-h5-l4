<template>
  <div class="aop_tradedesign_service_list_page">
    <div class="content">
      <Table
        class="table_style"
        :data="tableData"
        :table="tableColumn"
        @operate="operate"
      ></Table>
    </div>
  </div>
</template>
  <script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table_workgate";
export default {
  mixins: [mixin],
  components: {
    Table,
  },
  props:{
    tableData:{
      type:Object,
      default:()=>([])
    }
  },
  data() {
    return {
      tableColumn: [
        {
          prop: "svcUpdtType",
          label: "服务变更类型",
          //   width: "180",
          type: "text",
          tooltip: true,
          filter:"svcUpdtType"
        },
        {
          prop: "svcName",
          label: "服务名称",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dataSetNm",
          label: "归属数据集",
          //   width: "180",
          type: "text",
          tooltip: true,
        },

        {
          prop: "updtRsn",
          label: "变更原因",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "remarks",
          label: "备注",
          width: "200",
          type: "input",
          // tooltip: true,
        },
        {
          prop: "designNm",
          label: "设计者",
          //   width: "180",
          type: "text",
          tooltip: true,
          filter:(scope) =>{
           return scope.row.designNm || "/"
          }
        },
        {
          prop: "busiConfiPrsnNm",
          label: "业务确认人",
          //   width: "180",
          type: "text",
          tooltip: true,
          filter:(scope) =>{
            return scope.row.busiConfiPrsnNm || "/"
          }
        },
        {
          prop: "busiConfiTm",
          label: "业务确认时间",
          //   width: "180",
          type: "text",
          tooltip: true,
          filter:(scope) =>{
            return scope.row.busiConfiTm || "/"
          }
        },
      ],
    };
  },
  methods: {},
  created() {},
  mounted() {},
  watch: {},
};
</script>
  <style lang="scss" scoped>
.aop_tradedesign_service_list_page {
}
</style>