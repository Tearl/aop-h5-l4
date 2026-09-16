<template>
  <div class="aop_workgate_comps_服务mgmt_服务_info_info">
    <div class="content">
      <div class="detail_list_left">
        <div class="left_content">
          <span>服务名称：</span>
          <span class="content_info">{{ detailInfo.apiName }}</span>
        </div>
        <div class="left_content">
          <span>服务编码：</span>
          <span class="content_info url_style">{{ detailInfo.apiCode }}</span>
        </div>
        <div class="left_content">
          <span>所属数据集：</span>
          <span class="content_info">{{ detailInfo.dataSetNm }}</span>
        </div>
      </div>
      <div class="detail_list_right">
        <div class="right_content">
          <span>服务ID：</span>
          <span class="content_info">{{ detailInfo.apiSeq }}</span>
        </div>
        <div class="right_content">
          <span>服务版本：</span>
          <span class="content_info">
            <el-tag type="success" effect="dark">
              {{ detailInfo.apiVersion }}
            </el-tag>
          </span>
        </div>
        <!-- <div class="right_content">
          <span>4b调用次数：</span>
          <span class="content_info">{{ detailInfo.服务ServiceType }}</span>
        </div> -->
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
  methods: {
    goToScene(e) {
      this.$emit("goToScene",e.asrSceneId);
    }
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_服务mgmt_服务_info_info {
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
        &.url_style {
          color: $warning_color;
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
        .text_click {
          color: $theme_color;
          font-family: $font_regular;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
