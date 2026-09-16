<template>
  <div class="aop_tradedesign_service_list_page">
    <div class="content">
      <Table
        class="table_style"
        :data="dataList"
        :table="tableColumn"
        @operate="operate"
      ></Table>
    </div>
  </div>
</template>
  <script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table";
export default {
  mixins: [mixin],
  components: {
    Table,
  },
  data() {
    return {
      dataList: [
      {transCd:"单笔转账提交"}
      ],
      tableColumn: [
        {
          prop: "transCd",
          label: "服务变更类型",
        //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "服务名称",
        //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "归属数据集",
        //   width: "180",
          type: "text",
          tooltip: true,
        },

        {
          prop: "transCd",
          label: "变更原因",
        //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "备注",
        //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "创建人",
        //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "业务确认人",
        //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "确认时间",
        //   width: "180",
          type: "text",
          tooltip: true,
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