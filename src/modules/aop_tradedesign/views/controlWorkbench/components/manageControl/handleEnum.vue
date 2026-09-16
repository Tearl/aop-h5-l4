<!-- 业务规则-添加业务规则类型 -->
<template>
  <PageDialog
      class="page_dialog"
      dialogWidth="720px"
      :dialogTitle="action === 'add' ? '添加枚举值' : '修改枚举值'"
      :dialogVisiable="dialogShow"
      subName="确定"
      :modalAppendToBody="true"
      :apTobody="true"
      @closeDialog="handleClose"
      @saveDialog="handleConfirm"
  >
      <div slot="box">
          <el-form
              ref="infoForm"
              :model="formData"
              :rules="formRules"
              :inline="false"
              class="block-form-wrap padding-t-44 padding-b-26"
              label-width="170px"
              size="small"
          >
              <el-form-item label="代码取值（KEY）：" prop="enumKey">
                  <el-input type="text" v-model="formData.enumKey" clearable>
                  </el-input>
              </el-form-item>
              <el-form-item label="代码名称（VALUE）：" prop="enumValue">
                  <el-input
                      type="text"
                      v-model="formData.enumValue"
                      clearable
                  >
                  </el-input>
              </el-form-item>
          </el-form>
      </div>
  </PageDialog>
</template>
<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";
export default {
  mixins: [mixin],
  components: {
      PageDialog,
  },
  data() {
      return {
          dialogShow: false, // 抽屉显示
          action: "add",
          formData: {
              enumKey: "",
              enumValue: "",
          },
          formRules: {
              enumKey: [
                  {
                      required: true,
                      message: "请输入枚举值",
                      trigger: "blur",
                  },
                  {
                      message: "枚举值仅支持输入数字、字母、中文、下划线",
                      trigger: "blur",
                      pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
                  },
              ],
              enumValue: [
                  {
                      required: true,
                      message: "请输入内容",
                      trigger: "blur",
                  },
              ],
          },
      };
  },
  inject: ["openTab"], // 用于打开窗口
  created() {},
  methods: {
      openDialog({ action, enumKey, enumValue }) {
          // data数据初始化
          Object.assign(this.$data, this.$options.data());
          this.action = action;
          this.formData.enumKey = enumKey || "";
          this.formData.enumValue = enumValue || "";
          this.dialogShow = true;
          this.$nextTick(() => {
              this.$refs.infoForm && this.$refs.infoForm.clearValidate();
          });
      },
      handleClose() {
          console.log("handleClose");
          this.dialogShow = false;
      },
      handleConfirm() {
          this.$refs.infoForm.validate((valid) => {
              if (!valid) {
                  return false;
              }
              this.$emit("enumConfirm", this.formData);
              this.dialogShow = false;
          });
      },
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
@import "@m/assets/css/common.scss";
.dialog-popup-wrap {
  /deep/ .el-dialog__header {
      .el-dialog__headerbtn {
          top: 16px;
      }
  }
  /deep/ .el-dialog__body {
      background: #fff;
      padding: 0;
      color: #333;
      border-radius: 0 0 8px 8px;
  }
  .block-form-wrap {
      padding: 20px 30px;
  }
}
</style>
