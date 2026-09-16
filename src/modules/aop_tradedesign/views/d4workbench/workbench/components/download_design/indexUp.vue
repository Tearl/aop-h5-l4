<template>
  <div class="aop_tradedesign_page_d4workbench_workbench_download_design">
    <!-- 主体 -->
    <div class="design_container">
      <BaseInfo
        ref="baseInfoRef"
        :fnctCd="fnctCd"
        :uploadFlag="true"
        @showRelatedTops="showRelatedTops"
      ></BaseInfo>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { mapActions, mapState } from "vuex";
import Process from "@m/core/components/process/comps";
import Pelem from "./components/d4analyse_process/elem";
import { html2Escape } from "@m/utils/html2e.js";
import { unduplicatedByKeys } from "@m/utils/array";
import BaseInfo from "./components/transaction_edit";
export default {
  mixins: [mixin],
  components: {
    Process,
    Pelem,
    BaseInfo,
  },
  props: {
    pageType: {
      type: String,
      default: () => "",
    },
    authId: {
      type: String,
      default: () => "",
    },
    fnctId: {
      type: String,
      default: () => "",
    },
    jobNo: {
      type: String,
      default: () => "",
    },
    fnctCd: {
      type: String,
      default: () => "",
    },
    apiId: {
      type: String,
      default: () => "",
    },
    authAppDtlId: {
      type: String,
      default: () => "",
    },
    admiId: {
      type: String,
      default: () => "",
    },
    modelVersion: {
      type: String,
      default: () => "",
    },
    detailType: {
      type: String,
      default: () => "",
    },
    // bizLineId: {
    //   type: String,
    //   default: () => "",
    // },
  },
  data() {
    d2Url = `${window.origin}/#/aop_enddesign/layoutdesign/detail?admiId=20000244&orderId=10001865`;
    return {
      //当前ID与状态
      servId: "",
      // 服务定义 (04-完成服务定义，05-暂定服务定义)
      deployFlg: "",
      currentApiId: "",
      currentD4bObj: {},
      // 左侧菜单数据
      fnctInfo: {},
      d4bSvcList: [],
      elemActive: "D4b服务列表",
      currentServObj: {},
      newData: {}, //存放D4b服务基本信息
    };
  },
  computed: {
    ...mapState("aop_tradedesign", ["tempProcessObj", "isProcessTemp"]),
  },
  provide() {
    return {
      handleGoTo: this.handleGoTo,
      bizLineId: this.bizLineId,
      // toL5ServiceInfo: this.toL5ServiceInfo,
    };
  },
  methods: {
    ...mapActions("aop_tradedesign", [
      "saveTempProcessObj",
      "changeProcessTemp",
    ]),
    //点击提交按钮 保存D4b服务信息
    handleConfirm() {
      this.$refs.baseInfoRef.$refs.basicRef.handleConfirm();
    },
    handleGoTo(e) {
      if (e == 1) {
        this.$emit("doOperate", "arrange");
      } else if (e == 2) {
        this.$emit("doOperate", "confirmTwoDesign");
      } //测试跳转二确页面
      else if (e == 3) {
        this.$emit("doOperate", "assetConfirmList");
      }
    },
    //初始化
    init() {
      // this.getD4bServiceList();
      this.getD4bServiceInfo();
    },
    showRelatedTops() {
      window.open(
        `/h5-pc-terminal-web/layout_preview/#/previewex?kind=01&orderId=${this.authId}&funcId=${this.fnctCd}&modelVersion=${this.modelVersion}`
      );
    },
    handleDesign(e) {
      this.$emit("handleDesign", e);
    },
    // D4b服务列表查询
    async getD4bServiceList(data) {
      let nmOrNo = data;
      console.log(nmOrNo);
      //模块授权
      const params = {
        authId: this.authId,
        fnctCd: this.fnctCd,
        jobNo: this.jobNo,
        svcNm: nmOrNo,
      };
      const res = await this.rpc.d4.getFuncServList(params);
      this.d4bSvcList = res.bottomApiInfoList;
      this.infoShow = true;
      if (this.apiId) {
        this.currentD4bObj =
          this.d4bSvcList.find((item) => item.svcId == this.apiId) || {};
      } else {
        this.currentD4bObj = this.d4bSvcList[0];
      }
      console.log("初始化", this.getD4bServiceList.flag);
      // 初次加载
      if (!this.getD4bServiceList.flag && res.bottomApiInfoList.length > 0) {
        this.getD4bServiceInfo();
        this.getD4bServiceList.flag = true;
      }
    },
    async d4bServClick(e) {
      console.log("d4bServClick", e);
      this.currentD4bObj = e;
      this.currentApiId = e.apiId;
      this.getD4bServiceInfo();
    },
    // 查询D4b服务详情
    async getD4bServiceInfo() {
      Promise.all([this.rpc.d4.getD4bServiceInfo({
        svcId: this.apiId,
        // svcStsCd: this.currentD4bObj && this.currentD4bObj.svcRlsFlg, // 1发布，0未发布
        fnctId: this.fnctId,
        dsgnFlg: "1",
      }), this.rpc.d4.getServiceDesignDetail({
        apiId: this.apiId,
        d4StusCd: "1", // 0-分析，1-设计；2-测试
        blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
        dsgnFlg: "1",
      })]).then((res) => {
        const basicData = res[0]
        basicData.flow = res[1].flow
        this.$nextTick(() => {
          this.$refs.baseInfoRef.basicData = JSON.parse(JSON.stringify(basicData));
        });
      })
    },
  },
  created() {
    this.init();
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_d4workbench_workbench_download_design {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>