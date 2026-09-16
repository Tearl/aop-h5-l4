<template>
  <div class="aop_tradedesign_comps_page_upload_box">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisiable"
      :width="dialogWidth"
      :before-close="handleClose"
      center
    >
      <div class="dialog_box">
        <div class="dialog_content">
          <div class="detial_content">
            <div class="content_header_title">上传数据</div>
            <div class="content_body_right">
              <el-upload
                ref="upload"
                class="upload_body"
                :action="actionUrl"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                :on-success="handleSuccess"
                :file-list="fileList"
                :auto-upload="false"
                :data="exData"
              >
                <div class="upload_body_btn">
                  <el-button size="mini" type="primary" class="upload_button"
                    >点击上传</el-button
                  >
                </div>
              </el-upload>
              <el-button
                size="mini"
                type="default"
                class="download_button"
                @click.native="download"
                >模板下载</el-button
              >
            </div>
          </div>
          <div class="radio_box">
            <span class="radio_title">是否覆盖</span>
            <el-radio v-model="radio" label="1" @change="change">是</el-radio>
            <el-radio v-model="radio" label="0" @change="change">否</el-radio>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog_footer">
        <slot name="footer">
          <el-button @click.native="handleClose">取 消</el-button>
          <el-button type="primary" @click.native="handleSave">保存</el-button>
        </slot>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
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
    actionUrl: {
      type: String,
      default: () => "",
    },
    data: {
      type: Object,
      default: () => {{}}
    }
  },
  data() {
    return {
      radio: "1",
    };
  },
  methods: {
    change(e) {
      this.$emit("radioChange", e);
    },
    handleSave() {
      this.$refs.upload.submit();
    },
    handleClose() {
      this.$refs.upload.clearFiles();
      this.radio = "1";
      this.$emit("closeDialog");
    },
    download() {
      this.$emit("download");
    },
    refresh() {
      this.$emit("refresh");
    },
    handleSuccess(response) {
      if (response.header.errorCode == "0") {
        this.$notify({
          title: "成功",
          message: "上传成功",
          duration: 2000,
          type: "success",
        });
        this.$refs.upload.clearFiles();
        this.refresh();
        this.handleClose();
      } else {
        this.$message.error({
          message: response.header.errorMsg,
          duration: 10000,
        });
      }
    },
  },
  computed:{
    exData() {
      return {
        isCover: this.radio,
        aseId:this.$route.query?.aseId??'',
        asvId:this.$route.query?.asvId??'',
        ...this.data,
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_page_upload_box {
  ::v-deep .el-dialog {
    border-radius: 8px;
  }
  ::v-deep .el-dialog__header {
    background-color: $base_bg_color;
    text-align: left;
    padding: 0 24px;
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #e7e7e7;
    background: $base_bg_color;
    box-shadow: inset 0 -1px 0 0 #e7e7e7;
    border-radius: 8px 8px 0 0;
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
    padding: 16px 24px;
  }
  ::v-deep .el-dialog__footer {
    border-top: 1px solid #e7e7e7;
    padding: 16px 24px;
    button {
      width: 80px;
      height: $btn_large_h;
    }
  }
  .dialog_content {
    .content_header_title {
      font-family: $font_medium;
      font-size: 16px;
      color: $pri_ft_color;
      letter-spacing: 0;
      margin-bottom: 20px;
    }
    .content_body_right {
      margin-top: -45px;
      font-family: $font_regular;
      font-size: 14px;
      color: $sec_ft_color;
      letter-spacing: 0;
      position: relative;
      ::v-deep .el-button {
        @include mini_button_common;
        min-width: 80px;
      }
      .upload_body {
        overflow: hidden;
        ::v-deep .el-upload {
          float: right;
          margin-right: 90px;
        }
        ::v-deep .el-upload-list {
          margin-top: 40px;
        }
      }
      .download_button {
        position: absolute;
        right: 0;
        z-index: 1111;
        top: 0;
      }
    }
    .content_bottom {
      margin-left: 13px;
    }
    .table_style {
      margin-top: 16px;
    }
    .radio_box {
      font-family: $font_medium;
      margin-top: 20px;
      font-size: 16px;
      color: $pri_ft_color;
      letter-spacing: 0;
    }
    .radio_title {
      margin-right: 30px;
    }
  }
  .dialog_bottom {
    display: flex;
    justify-content: center;
    margin-left: 70px;
    margin-top: 10px;
  }
  .dialog_bottom:hover {
    cursor: pointer;
    color: $theme_color;
  }
}
</style>