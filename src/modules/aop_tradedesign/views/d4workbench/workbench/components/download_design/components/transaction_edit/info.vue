<template>
  <div class="aop_tradedesign_comps_d4bdesign_detail_list">
    <div class="content">
      <div class="detail_list_left">
        <div class="left_content trans_content">
          <span>交易名称：</span>
          <el-tooltip
            class="item"
            effect="dark"
            :content="detailInfo.svcNm"
            placement="top"
          >
            <span class="trans_nm">
              <span class="content_info">{{ detailInfo.svcNm }}</span>
            </span>
          </el-tooltip>
          <el-button
            v-show="!uploadFlag"
            size="mini"
            type="primary"
            class="btn_style"
            :disabled="noTrans"
            @click="search"
            >查询关联上装</el-button
          >
        </div>
        <div class="left_content">
          <span>创建人：</span>
          <span class="content_info">{{ detailInfo.crtNm }}</span>
        </div>
      </div>
      <div class="detail_list_right">
        <div class="right_content">
          <span>交易编号：</span>
          <span class="content_info">{{ detailInfo.svcId }}</span>
        </div>
        <div class="right_content">
          <span>创建时间：</span>
          <span class="content_info">{{
            detailInfo.crtTm | crtTm_yyyyMMddhhmmss
          }}</span>
        </div>
      </div>
      <div class="detail_list_right">
        <div class="right_content">
          <span>归属业务域：</span>
          <span class="content_info">{{ detailInfo.beltLineNm }}</span>
        </div>
        <!-- <div class="right_content">
          <el-checkbox v-model="detailInfo.isSession" :disabled="noTrans"
            >是否校验会话</el-checkbox
          >
        </div> -->
      </div>
    </div>
    <div class="detail_list_bottom">
      <!-- <div class="bottom_content">
        <span>版本描述：</span>
        <span class="content_info">{{ detailInfo.sersionDesc }}</span>
      </div> -->
      <div class="bottom_content">
        <span class="desc">交易描述：</span>
        <el-input
          type="textarea"
          v-model="detailInfo.svcDesc"
          placeholder="请输入交易描述"
          maxlength="500"
          show-word-limit
          :disabled="noTrans"
        ></el-input>
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
    // 关联服务资产列表
    relatedAssetsList: {
      type: Array,
      default: () => [],
    },
    uploadFlag: {
      type: Boolean,
      default: () => false,
    },
    noTrans: {
      type: Boolean,
      default: () => false,
    },
  },
  methods: {
    // 关联服务资产按钮
    // showRelatedAssets() {
    //   this.$emit("showRelatedAssets");
    // },
    search() {
      this.$emit("showRelatedTops");
    },
  },
  created() {},
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
  .btn_style {
    margin-left: 8px;
    background: #fff;
    color: #358aff;
    border: 0.5px solid #358aff;
    padding: 4px 6px;
    font-size: 12px;
  }
  .detail_list_bottom {
    margin-top: 24px;
    .bottom_content {
      border-top: 1px solid #e7e7ee;
      color: $sec_ft_color;
      padding: 16px 0;
      display: flex;
      .content_info {
        display: block;
        color: #333330;
        line-height: 1;
        margin-top: 16px;
      }
      span {
        min-width: 74px;
      }
      .desc {
        color: #333;
      }
      /deep/ .el-textarea__inner {
        height: 80px;
        margin-top: -5px;
        border-radius: 2px;
      }
    }
  }
  /deep/ .el-checkbox__label {
    color: #999;
  }
  /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #999;
  }
  .trans_content {
    margin-top: 10px !important;
  }
  .trans_nm {
    display: inline-block;
    width: 12em;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    top: 6px;
  }
}
</style>
