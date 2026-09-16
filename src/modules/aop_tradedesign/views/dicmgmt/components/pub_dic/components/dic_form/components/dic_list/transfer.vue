<template>
  <div class="aop_tradedesign_comps_dicmgmt_sys_dic_list_transfer">
    <PageDialog
      ref="transferDialog"
      dialogWidth="30%"
      dialogTitle="数据分类切换"
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
            <el-form-item label="切换至所属分类：" prop="clsfId">
              <el-select
                filterable
                v-model="editForm.clsfId"
                clearable
                placeholder="分类"
                size="small"
              >
                <el-option
                  v-for="(item, index) in classifyOptions"
                  :label="item.clsfNm"
                  :value="item.clsfId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="transfer">切 换</el-button>
      </div>
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
    //控制数据分类切换的显示和隐藏
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
      //存储切换后的分类id
      editForm: {
        clsfId: "", // 切换成的分类ID
      },
      //迁移数据的校验
      rules: {
        clsfId: [
          {
            required: true,
            trigger: "blur",
            message: "请选择切换后的所属分类",
          },
        ],
      },
    };
  },
  methods: {
    //取消
    closeDialog() {
      this.$refs.editForm.resetFields();
      this.$emit("closeDialog");
    },
    confirm() {
      this.$emit("confirm");
    },
    //获取数据
    getList(params) {
      this.$emit("getList", params);
    },
    //切换
    transfer() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return;
        const params = {
          clsfId: this.editForm.clsfId,
          dictryIdList: this.selectedData.map((item) => item.dictryId),
          ...this.searchForm,
        };
        // console.log(params)
        const res = await this.rpc.systemmgmt.classifyTransfer(params);
        this.$notify({
          title: "成功",
          message: "数据分类切换成功",
          duration: 2000,
          type: "success",
        });
        this.getList(this.searchForm);
        this.closeDialog();
      });
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_sys_dic_list_transfer {
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


