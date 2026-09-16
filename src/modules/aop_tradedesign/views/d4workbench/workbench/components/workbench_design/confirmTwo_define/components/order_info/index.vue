<template>
  <div class="aop_tradedesign_comps_order_info_page">
    <div class="page">
      <div class="title">订单信息</div>
      <div class="content">
        <div class="detail_list_left">
          <div class="left_content">
            <span class="content_label">订单编号：</span>
            <span class="content_info">{{ detailInfo.orderNumber }}</span>
          </div>
          <div class="left_content">
            <span class="content_label">项目名称：</span>
            <span class="content_info">{{ detailInfo.bizName }}</span>
          </div>
        </div>
        <div class="detail_list_middle">
          <div class="middle_content">
            <span class="content_label">客户编号：</span>
            <span class="content_info">{{ detailInfo.cstId }}</span>
          </div>
          <div class="middle_content">
            <span class="content_label">关联资产名称：</span>
            <span class="content_info">{{ detailInfo.assetName }}</span>
          </div>
        </div>
        <div class="detail_list_right">
          <!-- <div class="right_content">
            <span class="content_label">客户名称：</span>
            <span class="content_info">{{ detailInfo.cstName }}</span>
          </div> -->
          <div class="right_content">
            <span class="content_label">关联资产编号：</span>
            <span class="content_info">{{ detailInfo.assetId }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@m/utils/filters";
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  components: {},
  props: {
    admiId: {
      type: String,
      default: () => "",
    },
    isolateWorkspace: {
      type: String,
      default: () => "",
    },
    authCode:{
      type: String,
      default: () => "",
    }
  },
  data() {
    return {
      detailInfo: {
        orderNumber: "",
        bizName: "",
        cstId: "",
        assetName: "",
        cstName: "",
        assetId: "",
      },
      // assetId: "",
      // isolateWorkspace: "",
    };
  },
  methods: {
    async getOrderDetail() {
      const params = {
        assetId: this.admiId ,
        authCode: this.authCode || "" ,
        // isolateWorkspace: "FM-SQ-GCZCSC-2023-000621" ,
      };
      const res = await this.rpc.downloadDesign.getOrderDetail(params);
      this.detailInfo = res;
    },
    init() {
      this.getOrderDetail();
    },
    mounted() {
      // this.init();
      // const { fnctCd, isolateWorkspace } = this.$route.query;
      // this.isolateWorkspace =this.$route.query.isolateWorkspace || "FM-ZY0.6ZC-2023-000502";
      // this.assetId = this.$route.query.fnctCd || "FM-GN-2023-100924";
      // console.log("路由地址：",this.$route.query)
      this.getOrderDetail();
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_order_info_page {
  background: #fff;
  // height:calc(100vh - 48px - 48px);
  .title {
    // font-family: $font_medium;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    // color: $pri_ft_color;
    letter-spacing: 0;
    color: #333333;
    // font-weight: $font_weight_600;
  }
  .page {
    padding: 20px 24px;
  }
  .content {
    display: flex;
    .detail_list_left,
    .detail_list_middle,
    .detail_list_right {
      width: 33%;
    }

    .left_content,
    .middle_content,
    .right_content {
      margin-top: 16px;
      font-family: $font_regular;
      font-size: 14px;
      color: $sec_ft_color;
      letter-spacing: 0;
      display: flex;
      .content_info {
        color: $pri_ft_color;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        flex: 1;
        &.cursor {
          color: $theme_color;
          cursor: pointer;
        }
        /deep/ .el-tag--dark {
          border-radius: $theme_radius;
          height: 19px;
          line-height: 19px;
          font-size: 14px;
        }
      }
      .content_versNo {
        background: #f2f8ff;
        color: $theme_color;
      }
      .text_style {
        color: $theme_color;
        font-family: $font_regular;
        font-size: 14px;
        cursor: pointer;
      }
      .status {
        display: inline-block;
        text-align: center;
        line-height: 20px;
        padding: 0px 5px;
        &.unpublish {
          background: #dffff6;
          color: #2ddaac;
        }
        &.publishing {
          background: #fff4e5;
          color: #ff9104;
        }
        &.unchecked {
          background: #ffeaec;
          color: #fe4758;
        }
        &.finished {
          background: #f2f8ff;
          color: #358aff;
        }
      }
      .input {
        display: inline-block;
        width: 50%;
      }
    }
  }
  .left_content {
    margin-right: 300px;
    width: 100%;
  }

  .detail_list_bottom {
    margin-top: 16px;
    .bottom_content {
      border-top: 1px solid #e7e7ee;
      color: $sec_ft_color;
      padding: 16px 0;
      .content_info {
        display: block;
        color: #333330;
        line-height: 1;
        margin-top: 16px;
      }
    }
  }
}
</style>
