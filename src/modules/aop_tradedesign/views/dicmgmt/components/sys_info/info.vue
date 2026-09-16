<template>
  <div class="aop_tradedesign_comps_dicmgmt_sys_info_info">
    <div class="content">
      <div class="detail_list_left">
        <div class="left_content">
          <span>应用ID：</span>
          <span class="content_info">{{ detailInfo.sequence }}</span>
        </div>
        <div class="left_content">
          <span>应用名称：</span>
          <span class="content_info">{{ detailInfo.arsName }}</span>
        </div>
        <!-- <div class="left_content">
          <span>是否菜单显示：</span>
          <span class="content_info">{{ detailInfo.showFlag == "1" ? "是" : "否" }}</span>
        </div> -->
        <div class="left_content">
          <span>应用描述：</span>
          <span class="content_info">{{ detailInfo.arsDesc }}</span>
        </div>
      </div>
      <div class="detail_list_right">
        <div class="right_content">
          <span>应用编码：</span>
          <span class="content_info">{{ detailInfo.arsCode }}</span>
        </div>
        <div class="right_content">
          <span>归属用户：</span>
          <span class="content_info">{{ detailInfo.arsBank }}</span>
        </div>
        <!-- <div class="right_content">
          <span>菜单显示顺序：</span>
          <span class="content_info">{{ detailInfo.showOrder }}</span>
        </div> -->
      </div>
    </div>
    <div class="bottom_content">
      <div class="detail_list">
        <div class="list_content">
          <span>服务类型：</span>
          <span class="content_info" v-for="(item,index) in detailInfo.serviceTypeList" :key="index">
            {{item.servTypeNm}}
          </span>
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
.aop_tradedesign_comps_dicmgmt_sys_info_info {
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
  .bottom_content {
    .detail_list {
      width: 100%;
      .list_content {
        margin-top: 16px;
        font-family: $font_regular;
        font-size: 14px;
        color: $sec_ft_color;
        letter-spacing: 0;
        .content_info {
          color: $pri_ft_color;
        }
      }
    }
  }
}
</style>
