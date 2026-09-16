<template>
  <el-dialog
    class="aop_tradecode_comps_page_dialog"
    :title="dialogTitle"
    :visible.sync="dialogVisiable"
    :width="dialogWidth"
    :modal-append-to-body="modalAppendToBody"
    :before-close="handleClose"
    :append-to-body="apTobody"
    :close-on-click-modal="false"
    :custom-class="customClass"
    :destroy-on-close="destroyOnClose"
    center
  >
    <div v-if="!dialogTitle" slot="title">
      <slot name="title"></slot>
    </div>
    <div class="dialog_box">
      <slot name="box"></slot>
    </div>
    <span slot="footer" class="dialog_footer" v-show="footerShow">
      <slot name="footer">
        <el-button @click.native="handleClose">取 消</el-button>
        <el-button type="primary" @click.native="handleSave">保存</el-button>
      </slot>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogVisiable: {
      type: Boolean,
      default: () => false,
    },
    dialogWidth: {
      type: String,
      default: () => "56.3%",
    },
    dialogTitle: {
      type: String,
      default: () => "Dialog",
    },
    apTobody: {
      type: Boolean,
      default: () => false,
    },
    modalAppendToBody: {
      type: Boolean,
      default: () => false,
    },
    customClass:{
      type:String,
      default:()=>""
    },
    footerShow:{
      type:Boolean,
      default:()=>true
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {};
  },
  methods: {
    handleSave() {
      this.$emit("closeDialog");
    },
    handleClose() {
      this.$emit("closeDialog");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_page_dialog {
  ::v-deep .el-dialog {
    border-radius: 8px;
  }
  ::v-deep .el-dialog__header {
    background-color: $base_bg_color;
    text-align: left;
    padding: 0 24px;
    height: 48px;
    line-height: 48px;
    // border-bottom: 1px solid #e7e7e7;
    background: $base_bg_color;
    box-shadow: inset 0 -1px 0 0 #e7e7e7;
    border-radius: 8px 8px 0 0;
    font-weight: $font_weight_600;
    .el-dialog__headerbtn {
      top: 12px;
    }
    .el-dialog__title {
      font-family: $font_medium;
      font-size: 16px;
      color: $pri_ft_color;
      letter-spacing: 0;
      line-height: 24px;
    }
  }
  ::v-deep .el-dialog__body {
    max-height: 68vh;
    overflow: auto;
    padding: 16px 24px;
  }
  ::v-deep .el-dialog__footer {
    border-top: 1px solid #e7e7e7;
    padding: 16px 24px;
    button {
      width: 110px;
      height: $btn_large_h;
    }
  }
}
</style>