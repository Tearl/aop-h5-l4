<template>
  <div class="aop_tradedesign_comps_page_upload_box">
    <el-drawer
      :title="dialogTitle"
      :visible.sync="dialogVisiable"
      :size="dialogWidth"
      :before-close="handleClose"
    >
      <div class="dialog_box">
        <el-steps direction="vertical" :active="1">
          <el-step title="上传文件">
            <div class="dialog_content" slot="description">
              <div class="detial_content">
                <div class="content_header_title">上传文件：</div>
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
                    <el-button size="mini" type="primary" class="upload_button"
                      >选择文件</el-button
                    >
                  </el-upload>
                  <el-button
                    size="mini"
                    type="default"
                    class="download_button"
                    @click="downloadM"
                    >下载模板</el-button
                  >
                </div>
              </div>
              <div class="radio_box">
                <span class="radio_title">是否覆盖：</span>
                <el-radio v-model="radio" label="1" @change="change"
                  >是</el-radio
                >
                <el-radio v-model="radio" label="0" @change="change"
                  >否</el-radio
                >
              </div>
            </div>
          </el-step>
          <el-step title="导入文件">
            <div class="dialog_content" slot="description">
              <div class="detial_content">
                <div class="content_header_title">导入文件：</div>
                <div class="content_body_right">
                  <el-button
                    size="mini"
                    type="primary"
                    class="upload_button"
                    @click.native="handleSave"
                    >开始导入</el-button
                  >
                </div>
              </div>
              <el-progress
                v-if="isShow"
                :percentage="percentage"
                :status="currentStatus"
              ></el-progress>

              <div
                class="content_header_title"
                style="margin-top: 24px"
                v-if="errorCode == '10006'"
              >
                <span>导入结果：</span>
                <span
                  >存在未导入数据，可<span
                    style="color: rgb(53, 138, 255); cursor: pointer"
                    @click="downloadModel"
                    >下载</span
                  >查看</span
                >
              </div>
            </div>
          </el-step>
        </el-steps>
      </div>
      <span class="dialog_footer">
        <el-button @click.native="handleClose">取 消</el-button>
        <el-button type="primary" @click.native="handleClose">确定</el-button>
      </span>
    </el-drawer>
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
      default: "80%",
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
      default: () => {
        {
        }
      },
    },
  },
  data() {
    return {
      radio: "1",
      errorCode: "",
      errorMsg: "",
      currentStatus: "",
      percentage: "",
      isShow: false,
    };
  },
  created() {
    this.errorCode = "";
  },
  methods: {
    change(e) {
      this.$emit("radioChange", e);
    },
    handleSave() {
      this.isShow = true;
      this.$refs.upload.submit();
    },
    handleClose() {
      this.$refs.upload.clearFiles();
      this.radio = "1";
      this.isShow = false;
      this.$emit("closeDialog");
    },
    downloadM() {},
    downloadModel() {
      this.handleClose();
      this.$emit("download");
    },
    refresh(val) {
      this.$emit("refresh", val);
    },
    handleSuccess(response) {
      this.errorCode = response.header.errorCode;
      this.errorMsg = response.header.errorMsg;
      if (response.header.errorCode == "0") {
        this.currentStatus = "sucess";
        this.percentage = "100";
        this.$notify({
          title: "成功",
          message: "上传成功",
          duration: 2000,
          type: "success",
        });
        this.isShow = false;
        this.$emit("closeDialog");
      } else {
        this.currentStatus = "exception";
        this.percentage = "50";
        if (response.header.errorCode == "10006") {
          this.refresh(this.errorMsg);
        }
        this.$message.error({
          message: response.header.errorMsg,
          duration: 10000,
        });
      }
    },
  },
  computed: {
    exData() {
      return {
        isCover: this.radio,
        aseId: this.$route.query?.aseId ?? "",
        asvId: this.$route.query?.asvId ?? "",
        ...this.data,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_page_upload_box {
  position: relative;
  .dialog_box {
    padding: 10px 24px;
  }
  ::v-deep .el-step__title.is-finish {
    font-weight: 700;
  }
  .dialog_footer {
    position: absolute;
    width: 100%;
    border-top: 1px solid #e7e7e7;
    padding: 8px;
    text-align: center;
    bottom: 0;
  }
  ::v-deep .el-drawer__header {
    background-color: $base_bg_color;
    text-align: left;
    padding: 0 24px;
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #e7e7e7;
    background: $base_bg_color;
    box-shadow: inset 0 -1px 0 0 #e7e7e7;
    border-radius: 8px 8px 0 0;
    font-family: $font_medium;
    font-size: 16px;
    color: $pri_ft_color;
    letter-spacing: 0;
    line-height: 24px;
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
    padding: 36px 0;

    .content_header_title {
      font-size: 14px;
      color: $pri_ft_color;
      letter-spacing: 0;
      height: 28px;
      line-height: 28px;
    }
    .detial_content {
      display: flex;
      align-items: flex-start;
    }
    .content_body_right {
      font-family: $font_regular;
      font-size: 14px;
      color: $sec_ft_color;
      letter-spacing: 0;
      display: flex;
      position: relative;
      margin-bottom: 10px;
      ::v-deep .el-button {
        @include mini_button_common;
        min-width: 80px;
      }
      .upload_body {
        overflow: hidden;
        ::v-deep .el-upload {
          margin-right: 10px;
        }
      }
    }
    .content_bottom {
      margin-left: 13px;
    }
    .table_style {
      margin-top: 16px;
    }
    .radio_box {
      margin-top: 30px;
      font-size: 14px;
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