<template>
  <div class="aop_tradedesign_comps_page_pop" v-if="isPopCompleteShow">
    <div class="pop_mantle" @click="handleCancel"></div>
    <div class="pop_content">
      <div class="content_top">
        <div class="title">温馨提示</div>
        <p class="desc">{{ desc }}</p>
      </div>

      <div class="content_footer">
        <el-button class="pop_button" @click="handleCancel">取消</el-button>
        <el-button type="primary" class="pop_button" @click="handleConfirm"
          >确定</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isPopCompleteShow: {
      type: Boolean,
      default: () => false,
    },
    desc: {
      type: String,
      default: () => "",
    },
    title: {
      type: String,
      default: () => "提示",
    },
    isIconShow: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleCancel() {
      this.$emit("handleCancel");
    },
    handleConfirm() {
      this.$emit("handleConfirm");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_page_pop {
  ::v-deep .el-form-item__label:before {
    content: "*";
    color: $danger_color;
    margin-right: 4px;
  }
  ::v-deep .el-input__inner {
    background: $base_white;
  }
  .pop_mantle {
    position: absolute;
    z-index: 2001;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
  }
  .pop_content {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 16px 16px 24px;
    transform: translate(-50%, -50%);
    z-index: 2001;
    width: 420px;
    min-height: 182px;
    background: $base_white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .content_top {
      text-align: center;
      .el-icon-warning {
        font-size: 72px;
        color: $warning_color;
      }
      .title {
        font-size: 16px;
        color: $reg_ft_color;
        margin: 12px 0;
        font-family: $font_medium;
      }
      .desc {
        font-size: 14px;
        color: $sec_ft_color;
        margin-bottom: 16px;
      }
    }

    .content_footer {
      // height: 72px;
      border-radius: 0 0 8px 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      .pop_button {
        width: 112px;
        @include large_button_common;
      }
    }
  }
}
</style>
