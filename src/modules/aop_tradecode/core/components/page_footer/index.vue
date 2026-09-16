<template>
  <div class="aop_tradecode_comps_page_footer">
    <slot name="box">
      <el-button @click="$router.go(-1)" v-if="cancelLabel !== ''">{{
        cancelLabel
      }}</el-button>
      <el-button
        type="primary"
        @click="handleConfirm"
        :disabled="confirmDisabled"
        v-if="confirmLabel !== ''"
        >{{ confirmLabel }}</el-button
      >
    </slot>
  </div>
</template>

<script>
// 兼容按钮 label为空值时隐藏
export default {
  props: {
    confirmLabel: {
      type: String,
      default: () => "确 定",
    },
    cancelLabel: {
      type: String,
      default: () => "取 消",
    },
    confirmDisabled: {
      type: Boolean,
      default: () => false,
    },
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
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_page_footer {
  width: 100%;
  bottom: 0px;
  background: $base_white;
  text-align: center;
  padding: 16px;
  ::v-deep .el-button {
    @include large_button_common;
    width: 112px;
    color: $reg_ft_color;
    background: $base_white;
    border: 1px solid $pri_br_color;
    margin-right: 14px;
    &.el-button--primary {
      @include primary_button;
    }
  }
}
</style>
