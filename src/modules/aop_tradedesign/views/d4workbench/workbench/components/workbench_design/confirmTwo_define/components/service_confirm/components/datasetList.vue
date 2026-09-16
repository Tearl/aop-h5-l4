<template>
  <div class="aop_tradedesign_dataset_list_page">
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
import filters from "@m/utils/filters";
export default {
  mixins: [mixin],
  components: {
    Table,
  },
  filters: {
    ...filters,
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
          prop: "dataSetStatus",
          label: "是否新增数据集",
          width: "120",
          type: "text",
          // tooltip: true,
          filter:"twoConfirm"
        },
        {
          prop: "dataSetNm",
          label: "数据集名称",
          width: "90",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dataSubstnSts",
          label: "是否新增数据分段",
          width: "140",
          type: "text",
          // tooltip: true,
          filter:"twoConfirm"
        },
        {
          prop: "dataSubstnNm",
          label: "分段名称",
          // width: "120",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictSts",
          label: "是否新增数据字段",
          width: "140",
          type: "text",
          // tooltip: true,
          filter:"twoConfirm"
        },
        {
          prop: "dataSubstnNm",
          label: "字段名称",
          // width: "120",
          type: "text",
          tooltip: true,
        },
        {
          prop: "crtPrsnNm",
          label: "创建人",
          // width: "120",
          type: "text",
          tooltip: true,
        },
        {
          prop: "busiConfiPrsnNm",
          label: "业务确认人",
          width: "100",
          type: "text",
          tooltip: true,
          filter:(scope) =>{
            return scope.row.busiConfiPrsnNm || "/"
          }
        },
        {
          prop: "busiConfiTm",
          label: "业务确认时间",
          width: "110",
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
.aop_tradedesign_dataset_list_page {
}
</style>