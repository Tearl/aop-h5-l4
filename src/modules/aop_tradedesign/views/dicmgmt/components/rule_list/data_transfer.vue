<template>
  <div class="aop_tradedesigncomps_rule_data_transfer">
    <PageDialog
      ref="transferDialog"
      dialogWidth="30%"
      dialogTitle="规则分类切换"
      :dialogVisiable="dialogVisiable"
      @closeDialog="closeDialog"
      class="transfer_dialog"
    >
      <div class="dialog_content" slot="box">
        <el-form
          ref="editForm"
          :inline="true"
          :model="editForm"
          :rules="rules"
          class="transfer_form"
        >
          <div class="form_info">
            <el-form-item label="切换至所属分类：" prop="ruleClassifyId">
              <el-select
                filterable
                v-model="editForm.ruleClassifyId"
                clearable
                placeholder="分类"
                size="small"
              >
                <el-option
                  v-for="item in classifyOptions"
                  :label="item.clsfCnNm"
                  :value="item.clsfId"
                  :key="item.clsfId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="default" @click="closeDialog" size="small"
          >取消</el-button
        >
        <el-button type="primary" @click="transfer" size="small"
          >切换</el-button
        >
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
    PageDialog,
  },
  props: {
    // 迁移弹框是否可见
    dialogVisiable: {
      type: Boolean,
      default: () => false,
    },
    // 选中的数据
    selectedData: {
      type: Array,
      default: () => [],
    },
    // 表单的搜索条件
    searchForm: {
      type: Object,
      default: () => ({}),
    },
    // 分类选择下拉列表
    classifyOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 迁移表单参数
      editForm: {
        ruleClassifyId: "", // 切换至的分类ID
      },
      // 迁移规则
      rules: {
        ruleClassifyId: [
          {
            required: true,
            trigger: "change",
            message: "请选择切换后的所属分类",
          },
        ],
      },
    };
  },
  methods: {
    // 关闭弹框
    closeDialog() {
      this.$refs.editForm.resetFields();
      this.$emit("closeDialog");
    },
    // 获取迁移数据列表
    getList(params) {
      this.$emit("getList", params);
    },
    // 迁移验证规则数据
    transfer() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return;
        const params = {
          ruleClassifyId: this.editForm.ruleClassifyId,
          ruleIdList: this.selectedData.map((item) => item.ruleId),
          qCondition: this.searchForm.content,
          paraClassifyId: this.searchForm.paraClassifyId,
        };
        const res = await this.rpc.systemmgmt.ruleClassifyTransfer(params);
        this.$notify({
          title: "成功",
          message: "规则分类切换成功",
          duration: 2000,
          type: "success",
        });
        this.getList(this.searchForm);
        this.closeDialog();
      });
    },
  },
  created() {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesigncomps_rule_data_transfer {
  .transfer_dialog {
    .dialog_content {
      text-align: center;
      .transfer_form {
        @include form($input_width: 100%);
      }
      .el-form-item {
        margin: 12px 0;
      }
    }
  }
}
</style>


