<template>
  <div class="aop_workgate_comps_systemmgmt_sys_dic_list_upgrade">
    <PageDialog
      ref="upgradeDialog"
      dialogWidth="30%"
      dialogTitle="数据字典升级"
      :dialogVisiable="dialogVisiable"
      @closeDialog="closeDialog"
      class="upgrade_dialog"
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
            <el-form-item label="所属分类：" prop="clsfId">
              <el-select
                filterable
                v-model="editForm.clsfId"
                clearable
                placeholder="分类"
                size="small"
                @change="getName"
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
        <el-button type="primary" @click="check">升 级</el-button>
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
    //控制数据字典升级的显示和隐藏
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
      //存储升级后的分类id
      editForm: {
        clsfId: "", // 升级成的分类ID
      },
      //迁移数据的校验
      rules: {
        clsfId: [
          {
            required: true,
            trigger: "blur",
            message: "请选择升级后的所属分类",
          },
        ],
      },
      dictryGategName: "",
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
    getList() {
      this.$emit("getList");
    },
    getName(e) {
      this.dictryGategName = this.classifyOptions.filter(
        (item) => item.clsfId == e
      )[0].clsfNm;
    },
    //升级
    async upgrade() {
      const params = {
        dictryGateg: this.editForm.clsfId,
        dictryGategName: this.dictryGategName,
        dictryIdList: this.selectedData.map((item) => {
          return { dictryId: item.dictryId };
        }),
      };
      const res = await this.rpc.dictionary.upgradeClassify(params);
      this.$notify({
        title: "成功",
        message: "数据字典升级成功",
        duration: 2000,
        type: "success",
      });
      this.getList();
      this.closeDialog();
    },
    //
    async check() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return;
        const params = {
          dictryGateg: this.editForm.clsfId,
          dictryIdList: this.selectedData.map((item) => {
            return { dictryId: item.dictryId };
          }),
        };
        const res = await this.rpc.dictionary.upgradeCheck(params);
        if (res.dictryNoList.length !== 0) {
          this.$confirm(
            "警告：公共数据字典池已有该字典，请确认是否仍要升级"
          ).then(async () => {
            this.upgrade();
          }).catch(() => {
            this.closeDialog();
          })
        } else {
          this.upgrade();
        }
      });
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_systemmgmt_sys_dic_list_upgrade {
  .upgrade_dialog {
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


