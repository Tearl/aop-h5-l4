<template>
  <div class="aop_tradedesign_comps_order_info_page">
    <div class="page">
      <div class="content">
        <div class="left_content">
          <span class="content_title">订单编号：</span>
          <span class="content_info">{{ detailInfo.orderNumber }}</span>
        </div>
        <div class="left_content">
          <span class="content_title">项目名称：</span>
          <span class="content_info">{{ detailInfo.bizName }}</span>
        </div>
        <div class="left_content">
          <span class="content_title">客户编号：</span>
          <span class="content_info">{{ detailInfo.cstId }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@m/utils/filters";
export default {
  components: {},
  props: {
    detailInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // detailInfo:{
      //   orderNo:"YN-R344-000023",
      //   khmc:"青岛银行",
      //   glzcmc:"转账",
      //   khbh:"QDYH",
      //   xmmc:"企业网银",
      //   glzcbh:"ZZ000010",
      // }
    };
  },
  methods: {},
  filters: {
    ...filters
  }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_order_info_page {
  .title {
    font-family: $font_medium;
    font-size: 16px;
    color: $pri_ft_color;
    letter-spacing: 0;
    font-weight: $font_weight_600;
  }
  .page {
    padding: 4px 0px;
  }
  .content {
    display: flex;
    justify-content: space-between;
    padding-right: 48px;
    .left_content {
      display: flex;
      // justify-content: space-between;
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
    }
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
  .content_title{
    color: #999999;
  }
}
</style>
