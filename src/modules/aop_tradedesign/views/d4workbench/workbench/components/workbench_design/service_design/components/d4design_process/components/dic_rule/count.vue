<template>
  <div class="aop_workgate_comps_systemmgmt_dic_rule_count">
    <PageDialog
      ref="dictionaryDialog"
      dialogWidth="56.3%"
      dialogTitle="关联数据字典列表"
      :dialogVisiable="dialogVisiable"
      @closeDialog="closeDialog"
      class="transfer_dialog"
    >
      <div class="dialog_content" slot="box">
        <Table class="table_style" :data="dictionaryList" :table="tables"></Table>
        <!-- 分页器 -->
        <PagePagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager="pager"
        >
        </PagePagination>
      </div>
      <div slot="footer">
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PagePagination from "@m/core/components/page_pagination";
import filters from "@m/utils/filters";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    Table,
    PagePagination
  },
  props: {
    // 弹框是否可见
    dialogVisiable: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
       // 关联资产列表
      dictionaryList: [],
      // 关联业务资产列表参数
      tables: [
        {
          prop: "dictNo",
          label: "参数名称",
          type: "text",
          width: "120",
          tooltip: true,
        },
        {
          prop: "dictNm",
          label: "参数中文名称",
          type: "text",
          width: "130",
          tooltip: true,
        },
        {
          prop: "dictDescr",
          label: "参数描述",
          type: "text",
          idth: "140",
          tooltip: true,
        },
        {
          prop: "dictGategNm",
          label: "所属分类",
          type: "text",
          width: "100",
          tooltip: true,
        },
        {
          prop: "dictTyp",
          label: "参数类型",
          type: "text",
          width: "90",
          tooltip: false,
          align: "center",
          filter: "paraTyp",
        },
        {
          prop: "dictLength",
          label: "最大长度",
          width: "100",
          type: "text",
          tooltip: false,
          align: "center"
        },
      ],
      //页码列表参数
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
    };
  },
  methods: {
    // 关闭弹框
    closeDialog() {
      this.pager.currentPage = "1"
      this.pager.turnPageShowNum = "10"
      this.$emit("closeDialog");
    },
    //根据服务资产ID查询业务资产
    async getList(id) {
      const data = {
        ruleId: id,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const { dictList, turnPageTotalNum } =
        await this.rpc.dictionary.relevanceDictionaryList(data);
      this.dictionaryList = dictList;
      this.pager.total = turnPageTotalNum * 1;
    },
    //改变页码的每条页数时触发
    handleSizeChange(e) {
      this.pager.turnPageShowNum = e + "";
      this.getList();
    },
    //改变页码的当前页时触发
    handleCurrentChange(e) {
      this.pager.currentPage = e;
      this.getList();
    },
  },
  filters: {
    ...filters,
  },
  created() {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_systemmgmt_dic_rule_count {
  .transfer_dialog {
    .dialog_content {
      text-align: center;
      .transfer_form {
        @include form($input_width: 100%);
      }
      .el-form-item {
        margin: 12px 0;
      }
    }
  }
}
</style>


