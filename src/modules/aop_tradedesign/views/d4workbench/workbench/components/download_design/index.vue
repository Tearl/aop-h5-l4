<template>
  <div class="aop_tradedesign_page_d4workbench_workbench_download_design">
    <!-- 主体 -->
    <div class="design_container">
      <div class="design_container_process">
        <div class="process_contain_box">
          <div class="process_container">
            <!-- 元素 -->
            <Pelem
              v-if="pageType !== 'upload'"
              ref="pelem"
              class="process_left"
              :fnctCd="fnctCd"
              :jobNo="jobNo"
              :authId="authId"
              :bizLineId="bizLineId"
              @d4bServClick="d4bServClick"
              @setTransFlag="setTransFlag"
            ></Pelem>
            <!-- 浏览 -->
            <div class="content_wrapper">
              <!-- 画布 -->
              <div class="process_middle_wrapper">
                <div class="process_middle">
                  <div v-if="transStatus == '2'">
                    <BaseInfo
                      ref="baseInfoRef"
                      :fnctCd="fnctCd"
                      :showBtn="noTrans ? false : true"
                      :uploadFlag="showType != 'unRelation'"
                      :noTrans="noTrans"
                      @showRelatedTops="showRelatedTops"
                      @changeList="initData"
                    ></BaseInfo>
                  </div>
                  <div v-else>
                    <EditBaseInfo
                      ref="baseInfoRef"
                      :fnctCd="fnctCd"
                      :uploadFlag="uploadFlag"
                      @showRelatedTops="showRelatedTops"
                      @changeList="initData"
                    ></EditBaseInfo>
                  </div>
                </div>
              </div>
              <!-- 属性 -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { mapGetters, mapActions, mapState } from "vuex";
import Process from "@m/core/components/process/comps";
import Pelem from "./components/d4analyse_process/elem";
import BaseInfo from "./components/trans_detail";
import EditBaseInfo from "./components/transaction_edit";
import { packageParamKey, getParamParent } from "@m/utils/paramTree";

export default {
  mixins: [mixin],
  components: {
    Process,
    Pelem,
    BaseInfo,
    EditBaseInfo,
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
    bizLineId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      //当前ID与状态
      servId: "",
      // 服务定义 (04-完成服务定义，05-暂定服务定义)
      deployFlg: "",
      currentApiId: "",
      currentD4bObj: {},
      d4bSvcList: [],
      newData: {}, //存放D4b服务基本信息
      transStatus: "",
      noTrans: false, //无交易时为true 不可编辑
      uploadFlag: false,
      showType: "", //未关联 or 已关联交易
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  provide() {
    return {
      handleGoTo: this.handleGoTo,
      bizLineId: this.bizLineId,
      showRelatedTops: this.showRelatedTops,
      // toL5ServiceInfo: this.toL5ServiceInfo,
    };
  },
  methods: {
    //点击提交按钮 保存D4b服务信息
    async handleConfirm() {
      const res = await this.$refs.baseInfoRef.$refs.basicRef.handleConfirm()
    },
    initData() {
      this.$refs.pelem.init(this.currentApiId)
    },
    handleGoTo(e, type) {
      if (e == 1) {
        this.$emit("doOperate", "arrange", type);
      } else if (e == 2) {
        this.$emit("doOperate", "confirmTwoDesign");
      } //测试跳转二确页面
      else if (e == 3) {
        this.$emit("doOperate", "assetConfirmList");
      }
    },
    //初始化
    init() {},
    showRelatedTops() {
      window.open(
        `/h5-pc-terminal-web/layout_preview/#/previewex?kind=01&orderId=${this.authId}&funcId=${this.fnctCd}&modelVersion=${this.modelVersion}`
      );
    },
    setTransFlag(e) {
      this.noTrans = e;
      this.$parent.noTrans = this.noTrans;
      this.$nextTick(() => {
        this.$refs.baseInfoRef.$refs.basicRef.noTrans = this.noTrans;
      });
    },
    async d4bServClick(e, type = "relation") {
      this.showType = type;
      if (type == "unRelation") {
        this.uploadFlag = true;
      } else {
        this.uploadFlag = false;
      }
      console.log(
        "d4bServClick",
        e,
        type,
        this.$parent.transStatus,
        this.uploadFlag
      );
      if (e?.apiId) {
        this.currentD4bObj = e;
        this.currentApiId = e.apiId;
        this.transStatus = e.apiState;
        this.$parent.transStatus = this.transStatus;
        this.setTransFlag(false);
        this.$nextTick(() => {
          this.getD4bServiceInfo();
        });
      } else {
        this.currentApiId = "";
        this.currentD4bObj = {};
        // this.transStatus = "2"
        this.setTransFlag(true);
        this.$refs.baseInfoRef.basicData = {};
      }
    },
    // 查询D4b服务详情
    async getD4bServiceInfo() {
      Promise.all([this.rpc.d4.getD4bServiceInfo({
        svcId: this.currentD4bObj && this.currentD4bObj.apiId,
        // svcStsCd: this.currentD4bObj && this.currentD4bObj.svcRlsFlg, // 1发布，0未发布
        fnctId: this.fnctId,
        dsgnFlg: "1",
      }), this.rpc.d4.getServiceDesignDetail({
        apiId: this.currentD4bObj?.apiId,
        d4StusCd: "1", // 0-分析，1-设计；2-测试
        blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
        dsgnFlg: "1",
      })]).then((res) => {
        const basicData = res[0]
        basicData.flow = res[1].flow
        basicData.puApiParams.forEach((item, index, paramList) => {
          const paramParent = getParamParent(item, paramList)
          const isHeaderData = ["resHeaderData"].includes(paramParent?.paramKey) || (item.paramKey == "bodyOutData" && !item.paramParentId)
          if (isHeaderData && item.paramDirection == "1" && !item.actionId && !item.actionName && !item.apSource) {
            item.actionId = "system"
            item.actionName = "平台系统"
            item.apSource = "01"
            item.paraMapgNm = item.paramCName
            item.paramMappingKey = packageParamKey(item, basicData.puApiParams)
          }
          if (item.apSource == "01") {
            item.actionId = "system"
          } else if (item.apSource == "10") {
            item.actionId = "constantValue"
          }
        })
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
  .design_container {
    display: flex;
    width: 100%;
    overflow: hidden;
    .design_container_process {
      flex: 1;
      width: 0;
      .process_contain_box {
        width: 100%;
        height: calc(100vh - 48px);
        display: flex;
        overflow: hidden;
        .process_container {
          width: 100%;
          height: 100%;
          margin: 0 auto;
          display: flex;
          font-family: $font_regular;
          overflow: hidden;
          ::v-deep .el-input__inner {
            border: 1px solid $pri_br_color;
            border-radius: $theme_radius;
          }
          .process_left {
            background: $base_white;
            flex: 0 0 260px;
            margin-right: 10px;
            // border-right: 1px solid $pri_br_color;
          }
          .process_right {
            // background: $base_white;
            flex: 0 0 300px;
            // flex: 0 0 260px;
            border-left: 1px solid $pri_br_color;
          }
          .process_main {
            // background: $base_white;
            display: inline-block;
            margin: 0px 24px;
            margin-top: 50px;
            .process_divMb {
              margin-bottom: 2px;
            }
          }
          .content_wrapper {
            display: flex;
            flex: 1;
            overflow: auto;
            margin-bottom: 60px;
            .process_middle_wrapper {
              display: flex;
              flex-direction: column;
              flex: 1;
              overflow: auto;
              .process_middle {
                @include scrollbar;
                // background-color: $base_white;
                flex: 1;
                overflow: auto;
                position: relative;
              }
            }
          }
          .create_container {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: $theme_color;
            font-weight: 600;
            .el-icon-plus {
              font-size: 60px;
              cursor: pointer;
            }
          }
          .edit_wrapper {
          }
        }
      }
      .params_contain_box {
        width: 100%;
        height: calc(100vh - 48px);
        // background-color: $base_white;
        overflow: auto;
      }
    }
  }
  // .disabled_content {
  //   cursor: not-allowed;
  // }
  // .disabled_middle {
  //   pointer-events: none;
  // }
}
</style>