<template>
  <div class="aop_tradedesign_comps_dicmgmt_dialog_review">
    <!-- 评审 -->
    <PageDialog
      dialogTitle="评审"
      :dialogVisiable="dialogVisible"
      dialogWidth="33%"
      @closeDialog="closeDialog"
      class="dialog"
    >
      <div slot="box">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="130px"
          class="edit_form"
        >
          <el-form-item label="评审类型" prop="aprvlRsltCd">
            <el-select v-model="form.aprvlRsltCd">
              <el-option label="通过" value="0"></el-option>
              <el-option label="拒绝" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="拒绝说明"
            prop="aprvlOpnn"
            v-show="form.aprvlRsltCd == '1'"
          >
            <el-input
              placeholder="请输入拒绝说明"
              v-model="form.aprvlOpnn"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
  },
  props: {
  },
  data() {
    return {
      dialogVisible: false,
      dataSetNo: "",
      form: {
        aprvlRsltCd: "1",
        aprvlOpnn: "",
      },
      rules: {
        aprvlRsltCd: [
          { required: true, trigger: "blur", message: "请选择评审类型" },
        ],
        // aprvlOpnn: [
        //   { required: true, trigger: "blur", message: "请输入拒绝说明" },
        // ],
      },
    };
  },
  methods: {
    showDialog(e) {
      this.dataSetNo = e
      this.dialogVisible = true;
    },

    closeDialog() {
      this.$refs.formRef.resetFields();
      this.dialogVisible = false;
    },

    confirm() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const params = {
          ...this.form,
          dataSetNo: this.dataSetNo
        };
        const res = await this.rpc.dicmgmt.dataSetApproval(params);
        this.$notify({
          title: "成功",
          message: "评审成功",
          duration: 2000,
          type: "success",
        });
        this.$emit("refresh","01")
        this.closeDialog();
      });
    },
    // 初始化
    init() {
      // this.getList();
      // this.getClassifyTypeList()
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_dialog_review {
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }
  .dialog {
    ::v-deep.el-dialog {
      margin-top: 3vh !important;
    }
    ::v-deep.el-dialog__body {
      max-height: 78vh;
    }
  }
  .edit_form {
    @include form;
    .form_item_flex {
      display: flex;
      .icon_right {
        margin-left: 5px;
        display: flex;
        flex-flow: column;
        font-size: 21px;
        i {
          cursor: pointer;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
