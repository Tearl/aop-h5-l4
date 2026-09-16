<template>
  <div class="aop_tradedesign_comps_workbench_public_dialog_detailService">
    <PageDialog
      :dialogWidth="'1000px'"
      :dialogTitle="'服务详情'"
      :dialogVisiable="dialogVisible"
      @closeDialog="dialogVisible = false"
      class="detail_service_dialog"
      :apTobody="true"
    >
      <div slot="box">
        <div class="content">
          <ServDetail ref="servDetailRef" :serData="serData"></ServDetail>
          <Params
            ref="paramsRef"
            sendParentClass="send_data_list_edit"
            receiveParentClass="receive_data_list_edit"
            :detailShow="false"
            v-if="showServ"
          ></Params>
          <Rule
            ref="bizRuleRef"
            :isEdit="false"
            :ruleInfo="ruleInfo"
            v-if="showServ"
          ></Rule>
        </div>
      </div>
      <div slot="footer">
        <!-- <el-button @click="handleCancel">取 消</el-button> -->
        <el-button type="primary" @click.native="confirmSer">确定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";
import PageDialog from "@m/core/components/page_dialog";
import Params from "./components/form/params";
import ServDetail from "./components/form/servDetail";
import Rule from "./components/form/biz_rule";
import { reList } from "@m/utils/paramTree";
export default {
  mixins: [mixin],
  components: {
    Params,
    PageHeader,
    PageFooter,
    Rule,
    PageDialog,
    ServDetail,
  },
  props: {
    servDetail: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialogVisible: false,
      showServ: true,
      serData: {},
      ruleInfo: {},
    };
  },
  methods: {
    showDialog(data) {
      this.dialogVisible = true;
      console.log(data, "detail");
      if (data.apiServiceType == "D5自有服务") {
        this.$nextTick(() => {
          this.showServ = true;
          this.$refs.servDetailRef.servType = false;
          Object.assign(this.serData, data);
        });
      } else {
        this.$nextTick(() => {
          this.showServ = false;
          this.$refs.servDetailRef.servType = true;
        });
      }
      this.getDetail(data);
    },
    async getBusinessRuleInfo(data) {
      this.ruleInfo = {};
      const params = {
        apiId: data.svcId || data.apiId,
      };
      const res = await this.rpc.d4.getBusinessRuleInfo(params);
      this.ruleInfo = res;
      const that = this.$refs.bizRuleRef.$refs.ruleTableRef;
      that.setRuleInfo(res);
    },
    async getDetail(data) {
      const res = await this.rpc.dicmgmt.getApiDetail({
        apiId: data.apiId,
      });
      this.$refs.servDetailRef.detailInfo = res;
      if (res.apiServiceType == "D5自有服务") {
        this.$nextTick(() => {
          this.getBusinessRuleInfo(res);
          let iInputList = [],
            iOutputList = [];
          iInputList = reList(
            res.puApiParams.filter((item) => item.paramDirection == 0)
          );
          iOutputList = reList(
            res.puApiParams.filter((item) => item.paramDirection == 1)
          );
          this.$refs.paramsRef.sendInputData = iInputList;
          this.$refs.paramsRef.receiveOutputData = iOutputList;
        });
      }

      console.log(res, "-------");
    },
    confirmSer() {
      this.dialogVisible = false;
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_workbench_public_dialog_detailService {
  .content {
    margin: 16px;
  }
}
.detail_service_dialog {
  ::v-deep .el-dialog__body {
    padding: 0;
  }
}
</style>
