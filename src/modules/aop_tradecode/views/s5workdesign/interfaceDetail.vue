<template>
  <div class="aop_tradedesign_page_d4workbench_workbench_one_confirm">
    <!-- 页签 -->
    <div class="application_detail_tabs">
      <div class="application_detail_tabs_label_area">
        <div class="img_style">
          <img
            @click="$router.back"
            :src="require('@m/assets/images/icon_cancle_h.png')"
            alt=""
            class="icon_close"
          />
        </div>
        <img
          :src="require('@m/assets/images/icon_fn_h.png')"
          alt=""
          class="icon_fn"
        />
        <img
          :src="require('@m/assets/images/icon_LOGO.png')"
          alt=""
          class="icon_logo"
        />
      </div>
    </div>

    <div class="content">
      <!-- 基本信息 -->
      <ruleDetailInfo :basicData="currentS5bObj"></ruleDetailInfo>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import ruleDetailInfo from './components/ruleDetail.vue'
import { unduplicatedByKeys } from "@m/utils/array";
import { typeEnumObj } from "@m/utils/normalData.js";
import { escape2Html } from "@m/utils/html2e.js";
export default {
  mixins: [mixin],
  components: {
    ruleDetailInfo,
  },
  provide() {
    return {};
  },
  data() {
    return {
      apiId: "", //服务规则编码
      status: "", //状态
      viewType: "", //页面类型 downReview-评审
      currentS5bObj: {},
    };
  },
  computed: {},
  created() {
    this.init();
  },
  provide() {
    return {
        currentS5bObj: this.currentS5bObj,
    };
  },
  mounted() {},
  methods: {
    init() {
      this.apiId = this.$route.query.apiId;
      this.s5ServClick();
    },
    async s5ServClick(data){
        // 查询详情
        let params = {
            apiId: this.apiId,
        }
        let res = await this.rpc.s4design.queryTreeBaseInfo(params);
        this.currentS5bObj = res;
        console.log(this.currentS5bObj)
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_d4workbench_workbench_one_confirm {
  overflow: hidden;
  height: 100vh;
  .application_detail_tabs {
    background: #ffffff;
    margin-bottom: 12px;
    height: 48px;
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    box-shadow: 0 1px 10px 0 #e7e7e7;
    z-index: 100;
    .btn_style {
      /deep/ .el-button {
        height: 30px;
        line-height: 5px;
        border-radius: 2px;
        padding: 2px 14px;
        font-size: 14px;
      }
    }

    .application_detail_tabs_label_area {
      display: flex;
      align-items: center;

      .page_type_title {
        font-family: $font_regular;
        font-size: 14px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
        margin-right: 6px;
      }
      .fnc_Nm {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: $reg_ft_color;
        letter-spacing: 0;
        padding-left: 8px;
        font-weight: $font_weight_600;
        border-left: 1px solid #d8d8d8;
      }
      .img_style {
        width: 40px;
        height: 48px;
        line-height: 54px;
        text-align: center;
        border-right: 1px solid $pri_br_color;
        cursor: pointer;
      }
      .icon_close {
        width: 16px;
        height: 16px;
      }
      .icon_back {
        width: 16px;
        height: 16px;
        margin-left: 12px;
        cursor: pointer;
      }
      .icon_fn {
        width: 16px;
        height: 16px;
        margin-left: 12px;
      }
      .icon_logo {
        width: 30px;
        height: 14px;
        margin: 0 8px;
      }
    }
  }
  .content {
    margin: 14px;
    height: calc(100vh - 50px);
    overflow: auto;
    .header_title {
      display: flex;
      justify-content: space-between;
      background: $base_white;
      margin-bottom: 12px;
      padding: 16px;
      .content_title {
        .func_title {
          font-size: 16px;
          color: $pri_ft_color;
          font-weight: $font_weight_600;
        }
        .status {
          line-height: 18px;
          font-size: 14dpx;
          padding: 2px 12px;
          margin-left: 8px;
        }
        .status_01 {
          color: #ff9104;
          background: #fff4e5;
        }
        .status_02 {
          color: #ff5f5f;
          background: #ffefee;
        }
        .status_03 {
          color: #358aff;
          background: #f2f8ff;
        }
        .status_04 {
          color: #36d542;
          background: #e5ffe7;
        }
        .status_05 {
          color: #5d36d5;
          background: #e6e5ff;
        }
      }
      .btn_style {
        @include mini_button_common;
        /deep/ .el-dropdown {
          margin-left: 8px;
        }
        .el-dropdown-link {
          height: 28px;
          color: #6d747f;
          background: #f2f3f5;
          border: none;
        }
      }
    }
  }
  /deep/ .aop_tradedesign_comps_page_footer {
    position: fixed;
    z-index: 98;
  }
  .process_contain_box {
    width: 100%;

    display: flex;
    overflow: hidden;
    background: #fff;
    .process_container {
      width: 100%;
      // height: 100%;
      margin: 0 auto;
      display: flex;
      height: calc(100vh - 48px);
      // align-items: center;
      // justify-content: flex-end;
      font-family: $font_regular;
      overflow: hidden;
      flex-direction: column;
      ::v-deep .el-input__inner {
        border: 1px solid $pri_br_color;
        border-radius: $theme_radius;
      }
      .process_main {
        background: $base_white;
        display: inline-block;
        padding: 24px;
        // padding: 0 24px 24px;
        .process_divMb {
          margin-bottom: 5px;
        }
      }
      .process_middle {
        background-color: $base_bg_color;
        // height: calc(100vh - 48px);
        flex: 1;
        overflow: auto;
        position: relative;
        .process_header_title {
          font-family: $font_medium;
          font-size: 16px;
          color: $pri_ft_color;
          letter-spacing: 0;
          background-color: $base_white;
          padding: 20px 30px;
          padding-bottom: 0;
          font-weight: $font_weight_600;
        }
      }
    }
    .flow_pic {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f7f7f9;
    }
  }
  .content_header {
    display: flex;
    justify-content: space-between;
    // background-color: $base_bg_color;
    // .btn_style {
    //   line-height: 47px;
    // }
  }

  .record_btn_style {
    position: absolute;
    top: 230px;
    right: 50px;
    z-index: 999;
    padding: 0 10px;
    background: #ffffff;
    border: 0 solid #ececec;
    box-shadow: 0 0 11px 0 #ececec;
    border-radius: 2px;
  }
  .tabs_btn_style {
    line-height: 71px;
    margin-right: 24px;
    .detail {
      background: $base_white;
      color: $theme_color;
      border: 0.5px solid $theme_color;
    }
    /deep/ .el-button {
      border-radius: 2px;
      font-size: 14px;
    }
  }
  .plus-icon-enter-active {
    animation: axisYin 0.3s;
  }
  .plus-icon-leave-to {
    animation: axisYin 0.3s reverse;
  }
  @keyframes axisYin {
    0% {
      opacity: 0;
      transform: translateX(100%);
    }
    100% {
      opacity: 1;
      transform: translateX(0%);
    }
  }
  .detail_box {
    position: absolute;
    top: 48px;
    right: 0;
    width: 100%;
    height: calc(100vh - 48px);
    background: rgba(8, 7, 7, 0.6);
    overflow-x: hidden;
    z-index: 99;
    .detail_content {
      position: absolute;
      right: 0;
      // min-width: 300px;
      // max-width: 550px;
      height: 100%;
      background: #fff;
    }
    .detail_background {
      position: absolute;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .detail_content_box {
    height: calc(100vh - 155px);
    overflow: auto;
  }
  .process_right {
    background: $base_white;
    flex: 0 0 260px;
    border-left: 1px solid $pri_br_color;
    position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
