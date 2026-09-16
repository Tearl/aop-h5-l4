<template>
  <div class="aop_tradedesign_comps_apimgmt_case_detail_info">
    <div class="content">
      <div class="detail_list_left">
        <div class="left_content">
          <span>Mock名称：</span>
          <span class="content_info">{{ detailInfo.caseName }}</span>
        </div>
        <div class="left_content">
          <span>是否为必须Mock：</span>
          <span class="content_info">{{
            detailInfo.isNeed == "0" ? "否" : "是"
          }}</span>
        </div>
      </div>
      <div class="detail_list_right">
        <div class="right_content">
          <span>所属API：</span>
          <span class="content_info">{{ detailInfo.serviceName }}</span>
        </div>
        <div class="right_content">
          <span>优先级：</span>
          <span class="content_info">{{ detailInfo.level }}</span>
        </div>
      </div>
    </div>
    <div class="detail_list_bottom">
      <div class="bottom_content">
        <span>Mock描述：</span>
        <span class="content_info">{{ detailInfo.caseDesc }}</span>
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
.aop_tradedesign_comps_apimgmt_case_detail_info {
  .content {
    display: flex;
    .detail_list_left,
    .detail_list_right {
      width: 50%;
    }
  }
  .left_content,
  .right_content,
  .bottom_content {
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
    }
  }
  .bottom_content {
    padding-top: 20px;
    border-top: 1px solid #e7e7ee;
  }
}
</style>
