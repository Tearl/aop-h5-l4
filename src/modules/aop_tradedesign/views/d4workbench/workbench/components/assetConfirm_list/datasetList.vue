<template>
  <div class="aop_tradedesign_dataset_list_page">
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
          label: "是否新增数据集",
        //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "数据集名称",
        //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "是否新增数据分段",
        //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "数据分段",
        //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "是否新增数据字段",
        //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "数据名称",
        //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "设计者",
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
.aop_tradedesign_dataset_list_page {
}
</style>