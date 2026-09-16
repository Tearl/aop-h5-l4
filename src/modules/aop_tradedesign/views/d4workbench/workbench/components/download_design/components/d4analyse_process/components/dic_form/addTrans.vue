<template>
  <div class="aop_tradedesign_download_design_comps_add_trans">
    <PageDialog
      :dialogWidth="'50%'"
      :dialogTitle="'新建交易'"
      :dialogVisiable="addVisible"
      @closeDialog="handleCancel"
      class="create_dialog"
    >
      <div slot="box">
        <el-form
          :model="formData"
          :rules="rules"
          class="service_create_form"
          ref="formData"
          label-width="120px"
          @submit.native.prevent
        >
          <el-form-item label="交易名称" prop="apiName">
            <el-input
              v-model="formData.apiName"
              clearable
              placeholder="请输入交易名称"
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="交易版本" prop="dictryNm">
            <span>{{ formData.apiVersion }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="saveParams">确定</el-button>
      </div>
    </PageDialog>
  </div>
</template>
  <script>
import mixin from "@m/core/mixin";
import {
  unduplicated,
  setSerialNumber,
  unduplicatedByKeys,
} from "@m/utils/array";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    PagePagination,
    ServiceTop,
  },
  props: {
    servId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      // 已选参数
      tableData: [],
      // 选择参数弹框
      addVisible: false,
      formData: {
        // fnctCd: "FM-GN-2022-100842",
        // jobNo: "000002",
        // authId: "FM-ZY0.6ZC-2023-000504",
        apiName: "",
        apiVersion: "1.0.0",
      },
      rules: {
        apiName: [
          {
            required: true,
            trigger: "blur",
            message: "请输入交易名称",
          },
        ],
      },
    };
  },
  methods: {
    handleCancel() {
      this.addVisible = false;
      this.$refs.formData.resetFields();
    },
    saveParams() {
      this.$refs.formData.validate((valid) => {
        if (!valid) return this.$message.error("基本信息未填写或填写有误");
        const params = {
          ...this.formData,
        };
        this.$emit("saveForm", params);
      });
    },
    showDialog(e) {
      this.addVisible = true;
    },
    // 初始化添加输入输出搜索栏
  },
  mounted() {},
};
</script>
  
  <style lang="scss">
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_download_design_comps_add_trans {
  .create_dialog {
    ::v-deep .el-dialog__body {
      padding: 0;
    }
  }
}
</style>