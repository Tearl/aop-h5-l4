<template>
  <div class="aop_tradedesign_comps_apimgmt_api_info_info">
    <div class="content">
      <div class="detail_list_left">
        <div class="left_content">
          <span>API名称：</span>
          <span class="content_info">{{ detailInfo.apiName }}</span>
        </div>
        <div class="left_content">
          <span>API编码：</span>
          <span class="content_info url_style">{{ detailInfo.apiCode }}</span>
        </div>
        <div class="left_content">
          <span>业务资产：</span>
          <span class="content_info">{{ detailInfo.apiGroupName }}</span>
        </div>
        <div class="left_content">
          <span>参与方：</span>
          <span class="content_info">{{ detailInfo.apiServiceParticipater }}</span>
        </div>
        <div class="left_content">
          <span>服务大类：</span>
          <span class="content_info">{{ detailInfo.lvl1TypeCodeName }}</span>
        </div>
      </div>
      <div class="detail_list_right">
        <div class="right_content">
          <span>API ID：</span>
          <span class="content_info">{{ detailInfo.apiSeq }}</span>
        </div>
        <div class="right_content">
          <span>API版本：</span>
          <span class="content_info">
            <el-tag type="success" effect="dark">
              {{ detailInfo.apiVersion }}
            </el-tag>
          </span>
        </div>
        <div class="right_content">
          <span>服务类型：</span>
          <span class="content_info">{{ detailInfo.apiServiceType }}</span>
        </div>
        <div class="right_content">
          <span>API来源：</span>
          <span class="content_info">{{ detailInfo.apiSource }}</span>
        </div>
        <div class="right_content">
          <span>服务小类：</span>
          <span class="content_info">{{ detailInfo.lvl2TypeCodeName }}</span>
        </div>
      </div>
    </div>
    <div class="bottom_content">
      <div class="detail_list">
        <div class="list_content">
          <span>场景：</span>
          <span class="content_info" v-for="(item,index) in detailInfo.apiSceneIdList">
            {{item.asrSceneName}}
          </span>
          <!-- <span class="content_info text_click" v-for="(item,index) in detailInfo.apiSceneIdList" @click="goToScene(item)">
            {{item.asrSceneName}}
          </span> -->
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
.aop_tradedesign_comps_apimgmt_api_info_info {
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
