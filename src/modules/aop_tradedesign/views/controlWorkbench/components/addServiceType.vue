<template>
  <div class="aop_l5design_saddServiceType">
    <PageDialog
      :dialogWidth="'520px'"
      :dialogTitle="isEdit ? '编辑对象行为' : '新增对象行为'"
      :dialogVisiable="dialogVisible"
      @closeDialog="handleClose"
      class="create_dialog"
      :hasFooter="true"
    >
      <div class="aop_l5design_saddServiceType-table" slot="box">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          size="mini"
          :rules="rules"
          :inline="true"
        >
          <div class="form-container-margin">
            <el-form-item label="行为名称：" prop="obeName">
              <el-input
                class="input"
                v-model="form.obeName"
                clearable
                placeholder="请输入行为名称"
              >
              </el-input>
            </el-form-item>
            <br />
            <el-form-item label="行为编码：" prop="obeNo">
              <el-input
                class="input"
                v-model="form.obeNo"
                clearable
                placeholder="字母、数字组合的编码，小写开头"
              >
              </el-input>
            </el-form-item>
            <br />
            <el-form-item label="行为描述：" prop="obeDesc">
              <el-input
                type="textarea"
                class="input"
                v-model="form.obeDesc"
                placeholder="请输入行为描述"
                clearable
              >
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click.native="concelDialog">取消</el-button>
        <el-button type="primary" @click.native="confirmDialog">确定</el-button>
      </span>
    </PageDialog>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table";
import PageDialog from "@m/core/components/page_dialog";
export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
  },
  props: {},
  computed: {},
  watch: {},
  data() {
    return {
      isEdit: false,
      form: {
        obeNo: "",
        obeName: "",
        obeDesc: "",
      },
      currentIndex: "",
      dialogVisible: false,
      rules: {
        obeNo: [
          {
            required: true,
            pattern: "^[a-z]{1}([a-zA-Z0-9._]){0,}$",
            message: "字母、数字组合的编码，小写开头",
            trigger: "blur",
          },
        ],
        obeName: [
          {
            required: true,
            trigger: "blur",
            message: "请输入对象行为",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    concelDialog() {
      this.dialogVisible = false;
    },
    async confirmDialog() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.$emit("confirm", { ...this.form }, this.currentIndex);
          this.dialogVisible = false;
        }
      });
    },
    show(data, index) {
      this.form = {
        obeNo: "",
        obeName: "",
        obeDesc: "",
      };
      this.isEdit = false;
      this.currentIndex = "";
      if (!!data.obeName) {
        this.isEdit = true;
        this.form = data;
        this.currentIndex = index;
      }
      this.dialogVisible = true;
      this.$refs.form.clearValidate();
    },
    handleClose() {
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_l5design_saddServiceType {
  .show_conf {
    padding-bottom: 10px;
    position: relative;
    bottom: 0;
    left: 0;
    background: #fff;
    width: 100%;
    z-index: 9;
    border-bottom: 1px solid #e7e7e7;
    // overflow: hidden;
    .show_conf_title {
      text-align: left;
      margin-right: 10px;
      font-family: $font_medium;

      span {
        color: #358aff;
      }
    }

    .show_conf_content {
      text-align: left;
    }

    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
::v-deep .el-input__inner {
  width: 300px;
}
::v-deep .el-textarea__inner {
  width: 300px;
}
.create_dialog {
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  /deep/ .aop_l5design_saddServiceType-table {
    margin: 20px;
  }
}
</style>
