<template>
  <div class="aop_tradedesign_dictionary_define_transaction">
    <div class="input_wrapper">
      <!-- <TableHeader
        title="交易列表"
        :btnList="btnList"
        @btnClick="handleBtnClik"
      ></TableHeader> -->
      <h1>交易列表</h1>
      <Table
        class="table_style"
        :data="transactionList"
        :table="transactionTable"
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
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";
import filters from "@m/utils/filters";
import PagePagination from "@m/core/components/page_pagination";
import TableHeader from "@m/core/components/page_table_header";

export default {
  mixins: [mixin],
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
      //交易列表数据
      transactionList: [],
      transactionTable: [
        {
          prop: "transCd",
          label: "交易编码",
          // width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transNm",
          label: "交易名称",
          // width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transDesc",
          label: "交易描述",
          width: "180",
          type: "text",
          tooltip: true,
        },
      ],
      // 列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      btnList: [],
      astNo:"",   //资产编号
      authNo:""   //授权编号
    };
  },
  computed: {},
  methods: {
    operate(op, data) {
      console.log(op, data);
    },
    //翻页器
    handleSizeChange(e) {
      this.pager.turnPageShowNum = e;
      this.pager.currentPage = "1";
      this.getTransactionList();
    },
    handleCurrentChange(e) {
      this.pager.currentPage = e;
      this.getTransactionList();
    },
    init() {
      this.getTransactionList();
    },
    //获取交易列表
    async getTransactionList() {
      const params = {
        // l5SvcId: this.currentD4bObj.apiId,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
        astNo:this.astNo,
        authNo:this.authNo
      };
      const res = await this.rpc.dicmgmtDefine.get4bTransactionList(params);
      // console.log(res, "getTransactionList");
      this.transactionList = res.transList;
      this.pager.total = res.turnPageTotalNum *1;
    },
    handleBtnClik() {},
  },
  created() {
    const {admiId,isolateWorkspace} = this.$route.query;
    this.astNo = admiId;
    this.authNo = isolateWorkspace
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dictionary_define_transaction {
  background:#fff;
  .input_wrapper {
    padding: 20px 24px;
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
    // font-family: $font_medium;
    font-size: 16px;
    font-family: PingFangSC-Medium;
    // color: $pri_ft_color;
    letter-spacing: 0;
    color: #333333;
    // font-weight: $font_weight_600;
  }
}
</style>