<template>
  <div class="aop_tradedesign_comps_d4bdesign_detail_list">
    <div class="content">
      <div class="detail_list_left">
        <div class="left_content">
          <span>交易名称：</span>
          <span class="content_info">{{ detailInfo.apiName }}</span>
        </div>
        <div class="left_content">
          <span>归属业务线：</span>
          <span class="content_info">{{ detailInfo.bkNm }}</span>
        </div>
        <div class="left_content">
          <span>创建时间：</span>
          <span class="content_info">{{ detailInfo.crtTm | crtTm }}</span>
        </div>
      </div>
      <div class="detail_list_right">
        <div class="right_content">
          <span>交易编码：</span>
          <span class="content_info">{{ detailInfo.apiCode }}</span>
        </div>
        <div class="right_content">
          <span>创建人：</span>
          <span class="content_info">{{ detailInfo.crtNm }}</span>
        </div>
      </div>
    </div>
    <div class="detail_list_bottom">
      <!-- <div class="bottom_content">
        <span>版本描述：</span>
        <span class="content_info">{{ detailInfo.sersionDesc }}</span>
      </div> -->
      <div class="bottom_content">
        <span>交易描述：</span>
        <span v-html="detailInfo.apiDesc" class="content_info"></span>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@m/utils/filters";
export default {
  components: {},
  props: {
    // 当前reqmentId对应的详情信息
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    // 关联服务资产列表
    relatedAssetsList: {
      type: Array,
      default: () => [],
    },
    reqmentId: {
      type: String,
      default: () => "",
    },
  },
  methods: {
    // 关联服务资产按钮
    showRelatedAssets() {
      this.$emit("showRelatedAssets");
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4bdesign_detail_list {
  .content {
    display: flex;
    .detail_list_left,
    .detail_list_right {
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
