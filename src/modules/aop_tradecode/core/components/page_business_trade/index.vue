<template>
<!-- 2024年1月9日 新增接口从业务交易导入 -->
  <div class="aop_tradecode_comps_page_business_trade">
    <PageDialog
      dialogTitle="选择业务交易"
      :dialogVisiable="dialogVisible"
      dialogWidth="60%"
      @closeDialog="closeDialog"
      apTobody
    >
      <div slot="box">
        <!-- <ServiceTop
          ref="formRef"
          :serviceForm="serviceForm"
          :form="form"
          class="service_top"
          labelwidth="auto"
        >
          <div slot="rightButton">
            <el-button
              type="primary"
              size="small"
              @click="search"
              class="right_button"
              >搜索</el-button
            >
            <el-button size="small" @click="reset" class="right_button"
              >重置</el-button
            >
          </div>
        </ServiceTop> -->
        <div class="conenet">
          <PageTable
            :table="tables"
            :data="tableData"
            @operate="operate"
            :show-overflow-tooltip="true"
          ></PageTable>
          <!-- <PagePagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager="pager"
          >
          </PagePagination> -->
        </div>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <!-- <el-button type="primary" @click="confirm">确 定</el-button> -->
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageTable from "@m/core/components/page_table";
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
export default {
  mixins: [mixin],
  components: {
    PageTable,
    PageDialog,
    PagePagination,
    ServiceTop,
  },
  data() {
    return {
      dialogVisible: false,
      // 分段列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      tableData: [],
      tables: [
        {
          prop: "txId",
          label: "交易ID",
          minWidth: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "txNm",
          label: "交易名称",
          minWidth: "150",
          type: "textClick",
          tooltip: true,
          operate: "txNm",
        },
        {
          label: "操作",
          type: "button",
          fixed: "right",
          width: "100",
          buttonList: [
            {
              desc: "选择",
              operate: "checkItem",
            },
          ],
        },
      ],
    };
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
      this.getList();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    // 每页条数改变时
    handleSizeChange(e) {
      this.pager.currentPage = "1";
      this.pager.turnPageShowNum = e;
      this.getList();
    },
    // 当前页改变时
    handleCurrentChange(e) {
      this.getList();
    },
    async getList() {
      const res = await this.rpc.s4design.queryFunctionBizTradeList({
        fnctId: this.$route.query.fnctId || "",
      });
      this.tableData = res.bizTradeAchieveSituationList;
    },
    async operate(op, data) {
      console.log(op,data)
      if (op == "checkItem") {
        const res = await this.rpc.newEditor.get4BServiceInfo({
          dsgnFlg: "1",
          svcId: data.txId,
        });
        this.dialogVisible = false;
        this.$emit("checkTrade",res)
        // console.log("txNm", res);
      } else if (op == "txNm") {
         window.open(
            `/aop-h5-sub/#/aop_businessd2/transactionDesign/transDetail?apiId=${data.txId}`,
            "_blank"
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.aop_tradecode_comps_page_business_trade {
}
</style>
