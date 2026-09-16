<template>
  <div class="aop_tradedesign_comps_apimgmt_case_detail_api">
    <div class="content">
      <div class="detail_list_left">
        <div class="left_content">
          <span>URL：</span>
          <span class="content_info url_style">{{ detailInfo.url }}</span>
        </div>
      </div>
      <div class="detail_list_right">
        <div class="right_content">
          <span>所属资产：</span>
          <span class="content_info">{{ detailInfo.sgName }}</span>
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
      default: () => ({}),
    },
  },
  methods: {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_case_detail_api {
  .content {
    display: flex;
    .detail_list_left , .detail_list_right {
      width: 50%;
    }
    .left_content,
    .right_content {
      margin-top: 16px;
      font-family: $font_regular;
      font-size: 14px;
      color: $sec_ft_color;
      letter-spacing: 0;
      .content_info {
        color: $pri_ft_color;
        &.cursor {
          color: $theme_color;
          cursor: pointer;
        }
        &.url_style {
          color: $warning_color;
        }
      }
    }
  }
}
</style>
