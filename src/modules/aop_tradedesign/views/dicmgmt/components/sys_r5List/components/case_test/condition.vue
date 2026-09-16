<template>
  <div class="aop_tradedesign_comps_apimgmt_case_detail_condition">
    <div class="content_wrapper">
      <div class="middle_radio">
        <el-radio-group v-model="navDefaultActive" size="small">
          <el-radio-button label="body">Body</el-radio-button>
          <el-radio-button label="header">Header</el-radio-button>
        </el-radio-group>
      </div>
      <Table
        v-show="navDefaultActive == 'body'"
        class="table_style"
        :data="dataList"
        :table="tableColumn"
        :rowK="'paramOrder'"
        :treeProps="{ children: 'children' }"
      ></Table>
      <Table
        v-show="navDefaultActive == 'header'"
        class="table_style"
        :data="headerDataList"
        :table="tableColumn"
        :rowK="'paramOrder'"
        :treeProps="{ children: 'children' }"
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
    headerDataList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      navDefaultActive: "body",
      tableColumn: [
        {
          prop: "paramOrder",
          label: "排序",
          type: "text",
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
        },
        {
          prop: "paramName",
          label: "参数Key",
          type: "text",
        },
        {
          prop: "paramMark",
          label: "操作符",
          type: "text",
          filter: "paramMark",
        },
        {
          prop: "paramValue",
          label: "参数值",
          type: "text",
        },
        {
          prop: "paramType",
          label: "参数值类型",
          type: "text",
        },
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
.aop_tradedesign_comps_apimgmt_case_detail_condition {
  .content_wrapper {
    .table_style {
      margin-top: 16px;
      ::v-deep .el-table th {
        color: $sec_ft_color;
      }
    }
    .middle_radio {
      position: absolute;
      left: 0;
      right: 0;
      top: 18px;
      margin: 0 auto;
      text-align: center;
      width: 50%;
      ::v-deep .el-radio-button__inner {
        padding: 0 8px;
        height: 28px;
        line-height: 28px;
      }
      ::v-deep .el-radio-button:first-child .el-radio-button__inner {
        border-radius: 2px 0 0 2px;
      }
      ::v-deep .el-radio-button:last-child .el-radio-button__inner {
        border-radius: 0 2px 2px 0;
      }
    }
  }
}
</style>
