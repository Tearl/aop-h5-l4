<template>
  <div class="aop_workgate_comps_apimgmt_api_info_protocol">
    <div class="content">
      <div class="detail_list_left">
        <div class="left_content">
          <span>通信服务编号：</span>
          <span class="content_info">{{ detailInfo.ssrId }}</span>
        </div>
        <div class="left_content">
          <span>通信服务名称：</span>
          <span class="content_info">{{ detailInfo.ssrName }}</span>
        </div>
        <div class="left_content">
          <span>网络地址：</span>
          <span class="content_info">{{ detailInfo.sciIp }}</span>
        </div>
      </div>
      <div class="detail_list_right">
        <div class="right_content">
          <span>端口：</span>
          <span class="content_info">{{ detailInfo.sciPort }}</span>
        </div>
        <div class="right_content">
          <span>报文名称：</span>
          <span class="content_info">{{ detailInfo.formater }}</span>
        </div>
        <div class="right_content">
          <span>解析类名：</span>
          <span class="content_info">{{ detailInfo.formaterClass }}</span>
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
.aop_workgate_comps_apimgmt_api_info_protocol {
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
      }
    }
  }
}
</style>
