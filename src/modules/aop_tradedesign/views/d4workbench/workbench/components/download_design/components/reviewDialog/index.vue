<template>
  <div class="aop_tradedesign_comps_d4editor_service_define_review_dialog">
    <PageDialog
      :dialogWidth="'720px'"
      :dialogTitle="'验收不通过原因'"
      :dialogVisiable="dialogVisible"
      @closeDialog="closeDialog"
      class="dialog_container"
    >
      <div slot="box">
        <div class="submit_record_not_pass_content">
            <el-input v-model="textareaValue" type="textarea" placeholder="请输入不通过原因" :rows="8">

            </el-input>
        </div>
      </div>
      <div slot="footer">
        <el-button @click.native="closeDialog">取 消</el-button>
        <el-button type="primary" @click.native="confirm">确 定</el-button>
      </div>
    </PageDialog>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import PageDialog from "@m/core/components/page_dialog";

export default {
  mixins: [mixin],
  components: {
    PageDialog
  },
  props: {
  },
  data() {
    return {
      dialogVisible: false,
      textareaValue: "",
      currentData: {}
    };
  },
  methods: {
    showDialog(data) {
      this.currentData = data
      this.dialogVisible = true
    },
    async confirm() {
      if (!this.textareaValue) return this.$message.error("请输入不通过原因")
      this.$emit("confirmReview", false, this.textareaValue)
    },
    closeDialog() {
      this.dialogVisible = false
    }
  },
  created() {
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4editor_service_define_review_dialog {
  .submit_record_not_pass_content {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
    .el-textarea {
      height: 180px;
    }
  }
}
</style>
