<template>
  <div class="aop_tradedesign_comps_d4bdesign_detail_list">
    <div v-if="isEdit">
      <div class="content">
        <div class="detail_list_left">
          <div class="left_content">
            <span>服务名称：</span>
            <el-input v-model="detailInfo.svcNm" placeholder="请输入" size="mini" class="input"></el-input>
            <!-- <span class="content_info">{{ detailInfo.svcNm }}</span> -->
          </div>
          <div class="left_content">
            <span>版本号：</span>
            <span class="content_info">
              <el-tag effect="dark">{{ detailInfo.svcVersionNo || detailInfo.apiVersion }}</el-tag>
            </span>
          </div>
          <div class="left_content">
            <span>创建人：</span>
            <span class="content_info">{{ detailInfo.crtNm }}</span>
          </div>
        </div>
        <div class="detail_list_right">
          <div class="right_content">
            <span>服务编码：</span>
            <span class="content_info">{{ detailInfo.svcCd }}</span>
          </div>
          <div class="right_content">
            <span>被交易调用次数：</span>
            <span class="content_info redColor">
              {{numUser}}
            </span>
          </div>
          <div class="right_content">
            <span>创建时间：</span>
            <span class="content_info">
              {{detailInfo.crtTm}}
            </span>
          </div>
        </div>
      </div>
      <div class="detail_list_bottom">
        <!-- <div class="bottom_content">
          <span>版本描述：</span>
          <span class="content_info">{{ detailInfo.sersionDesc }}</span>
        </div>-->
        <div class="bottom_content">
          <span>服务描述：</span>
          <span v-html="detailInfo.svcDesc" class="content_info"></span>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="content">
        <div class="detail_list_left">
          <div class="left_content">
            <span class="content_label">服务名称：</span>
            <span class="content_info red">{{ detailInfo.svcNm || detailInfo.apiName }}</span>
          </div>
          <!-- <div class="left_content">
            <span>版本号：</span>
            <span class="content_info">
              <el-tag effect="dark">
                {{ detailInfo.svcVersionNo || detailInfo.apiVersion}}
              </el-tag>
            </span>
          </div>-->
          <div class="left_content">
            <span class="content_label">创建人：</span>
            <span class="content_info">{{ detailInfo.crtNm }}</span>
          </div>
        </div>
        <div class="detail_list_middle">
          <div class="middle_content">
            <span class="content_label">服务ID：</span>
            <span class="content_info">{{ detailInfo.apiId || detailInfo.apiCode || detailInfo.svcId || detailInfo.svcCd}}</span>
          </div>
          <div class="middle_content">
            <span class="content_label">创建时间：</span>
            <span class="content_info">
              {{detailInfo.crtTm.indexOf('-') > -1 ? detailInfo.crtTm : getData(detailInfo.crtTm)}}
            </span>
          </div>
        </div>
        <div class="detail_list_right">
          <!-- <div class="right_content">
            <span>服务编码：</span>
            <span class="content_info">{{ detailInfo.svcCd ||detailInfo.apiCode}}</span>
          </div>-->
          <div class="right_content">
            <span class="content_label">被交易调用次数：</span>
            <span class="content_info redColor">
              {{numUser}}
            </span>
          </div>
        </div>
      </div>
      <div class="detail_list_bottom">
        <!-- <div class="bottom_content">
          <span>版本描述：</span>
          <span class="content_info">{{ detailInfo.sersionDesc }}</span>
        </div>-->
        <div class="bottom_content">
          <span class="content_label">服务描述：</span>
          <span v-html="detailInfo.svcDesc || detailInfo.apiDesc" class="content_info"></span>
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
    // 当前reqmentId对应的详情信息
    detailInfo: {
      type: Object,
      default: () => ({})
    },
    // 关联服务资产列表
    relatedAssetsList: {
      type: Array,
      default: () => []
    },
    reqmentId: {
      type: String,
      default: () => ""
    },
    isEdit: {
      type: Boolean,
      default: () => false
    },
    numUser:{
      type:String,
      default:() =>""
    }
  },
  methods: {
    // 关联服务资产按钮
    showRelatedAssets() {
      this.$emit("showRelatedAssets");
    },
    getData(value){
      if (!!value) {
        const year = value.slice(0, 4)
        const month = value.slice(4, 6)
        const day = value.slice(6, 8)
        const hour = value.slice(8, 10)
        const minute = value.slice(10, 12)
        const second = value.slice(12, 14)
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
      }
      return ""
    }
  },
  filters: {
    ...filters
  }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";

.aop_tradedesign_comps_d4bdesign_detail_list {
  .content {
    display: flex;
    // justify-content: space-between;

    .detail_list_left,
    .detail_list_middle,
    .detail_list_right {
      // flex: 1;
      width: 33%;
      // white-space: nowrap;
      // text-overflow: ellipsis;
      // overflow: hidden;
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
        &.redColor{
         color: #fe5666
        }

        /deep/ .el-tag--dark {
          border-radius: $theme_radius;
          height: 19px;
          line-height: 19px;
          font-size: 14px;
        }
      }

      .content_label {
        // flex: 1;
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
      // padding: 16px 0;
      padding-bottom: 16px;
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
