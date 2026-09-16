<template>
  <div class="aop_tradedesign_page_d4workbench_workbench_design">
    <!-- 服务设计 -->
    <ServiceDesign
      ref="designRef"
      v-if="currentActive == 1 && detailType!= 'upload'"
      @handleGoTo="handleGoTo"
      :pageType="pageType"
      :fnctId="fnctId"
      :fnctCd="fnctCd"
      :authId="authId"
      :jobNo="jobNo"
      :apiId="apiId"
      :svcId="svcId"
      :authAppDtlId="authAppDtlId"
      :detailType="detailType"
    ></ServiceDesign>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import ServiceDesign from "./components/workbench_design/service_design";
export default {
  mixins: [mixin],
  components: {
    ServiceDesign,
  },
  data() {
    // d2Url = `${window.origin}/#/aop_tradedesign/d4workbench/home`;
    return {
      currentActive: 1,
      pageType: "",
      fnctId: "", // 功能ID
      fnctCd: "",//功能编号
      apiId: "", // 服务ID
      authAppDtlId: "", //工作台ID
      admiId: "", //工作台ID
      modelVersion: "", //工作台版本号
      pageMode:'',//只读服务定义
      jobNo: "", //作业号
      authId: "", //授权码
      svcId:"", //交易ID
    };
  },
  methods: {
    handleGoTo(e, data) {
      this.currentActive = e;
      if (data && data.svcId) {
        this.$route.query.apiId = data.svcId;
      }
      // if (e == 1) {
      //   this.$nextTick(() => {
      //     this.$refs.designRef.currentApiId = data.svcId
      //   })
      // }
    },
    //初始化
    init() {
      this.pageType = this.$route.query.pageType;
      this.apiId = this.$route.query.apiId;
      this.fnctId = this.$route.query.fnctId;
      this.fnctCd= this.$route.query.fnctCd || "FM-GN-2022-100882"
      this.authId= this.$route.query.authId || "FM-ZY0.5ZC-2022-001682"
      this.jobNo= this.$route.query.jobNo
      this.currentActive = this.$route.query.active || 1;
      this.authAppDtlId = this.$route.query.authAppDtlId;
      this.admiId = this.$route.query.admiId;
      this.modelVersion = this.$route.query.modelVersion;
      this.detailType = this.$route.query.detailType;
      this.pageMode = this.$route.query.pageMode
      this.svcId = this.$route.query.transId;
      console.log(this.pageMode,this.svcId,'this.pageModethis.pageMode')
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_d4workbench_workbench_design {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .design_container {
    display: flex;
    width: 100%;
    overflow: hidden;
    .design_container_aside {
      flex: 0 0 40px;
    }
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
            flex: 0 0 240px;
            border-right: 1px solid $pri_br_color;
          }
          .process_right {
            background: $base_white;
            flex: 0 0 300px;
            // flex: 0 0 260px;
            border-left: 1px solid $pri_br_color;
          }
          .process_main {
            background: $base_white;
            display: inline-block;
            margin: 0px 24px;
            margin-top: 88px;
            .process_divMb {
              margin-bottom: 2px;
            }
          }
          .process_middle {
            background-color: $base_white;
            flex: 1;
            overflow: auto;
            position: relative;
            .create_container {
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .el-icon-plus {
                font-size: 60px;
              }
            }
          }
        }
      }
      .params_contain_box {
        width: 100%;
        height: calc(100vh - 48px);
        background-color: $base_white;
        overflow: auto;
      }
    }
  }
  .newService_dialog {
    .el-select {
      width: 100%;
    }
    ::v-deep .el-form-item__label {
      color: $reg_ft_color;
      font-weight: $font_weight_600;
    }
  }
  .params_contain_box {
    width: 100%;
    height: 100%;
    height: calc(100vh - 48px);
    background-color: $base_white;
    overflow: auto;
  }
  .info_container_main {
    background-color: $base_white;
    .info_container_fr {
      ::v-deep .search_bar {
        width: 500px;
        margin: 0 auto;
      }
      padding: 16px 24px;
    }
  }
  .steps_box {
    background-color: $base_white;
    padding: 0px 100px;
    width: 100%;
    ::v-deep .el-step__head.is-finish {
      color: $base_white;
      border-color: #358aff;
      .el-step__icon.is-text {
        background-color: #358aff;
      }
    }
    ::v-deep .el-step__head.is-process {
      color: #333;
      border-color: #f8f8f8;
      .el-step__icon.is-text {
        background-color: #f8f8f8;
        .el-step__icon-inner {
          font-weight: normal;
        }
      }
    }
    ::v-deep .el-step__title.is-process {
      font-weight: normal;
      font-size: 12px;
    }
    ::v-deep .el-step__title.is-finish {
      color: #303133;
      font-size: 12px;
    }
  }
  .form_box {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    ::v-deep .el-textarea__inner {
      width: 400px;
    }
    .el-input,
    .el-select {
      width: 400px;
    }
  }
  .form_item_flex {
    display: flex;
    .icon_right {
      margin-left: 5px;
      display: flex;
      flex-flow: column;
      font-size: 21px;
      i {
        cursor: pointer;
        line-height: 20px;
      }
    }
  }
  .d2Info_dialog {
    ::v-deep .el-dialog {
      margin-top: 5vh !important;
    }
    .iframe_content {
      width: 100%;
      height: 1200px;
    }
  }
  ::v-deep .el-dialog__wrapper {
    overflow: hidden;
  }
}
</style>