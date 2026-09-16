<template>
  <div class="aop_tradedesign_comps_d4b_edit_create_group">
    <!-- 新增服务系统 -->
    <PageDialog
      :dialogWidth="'600px'"
      :dialogTitle="'新增API分组'"
      :dialogVisiable="dialogVisiable"
      @closeDialog="closeDialog"
      class="create_dialog"
    >
      <div slot="box">
        <el-form
          :rules="rules"
          :model="formData"
          ref="form"
          label-position="right"
          label-width="120px"
          class="edit_form"
        >
          <div class="form_info">
            <el-form-item label="分组名称" prop="sgName">
            <el-input
              v-model="formData.sgName"
              placeholder="请设置分组名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="分组编号" prop="sgCode">
            <el-input
              v-model="formData.sgCode"
              placeholder="请设置分组编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="服务类型" prop="serviceType">
            <el-select
              v-model="formData.serviceType"
              placeholder="请选择服务类型"
            >
              <el-option
                v-for="(item) in servTypeList"
                :key="item.servTypeId"
                :value="item.servTypeNm"
                :label="item.servTypeNm"
              >
                {{ item.servTypeNm }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分组描述">
            <el-input
              v-model="formData.sgDesc"
              :maxlength="100"
              placeholder="请输入分组描述"
            ></el-input>
          </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click.native="closeDialog">取 消</el-button>
        <el-button type="primary" @click.native="confirm">确定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";
import { getLocalStorage } from "@m/utils/localStorage";

export default {
  mixins: [mixin],
  components: {
    PageDialog
  },
  props: {
    dialogVisiable: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      formData: {
        bkId: "",
        arsId: "",
        sgName: "",
        sgCode: "",
        serviceType: "",
        sgDesc: "",
      },
      //定义规则
      rules: {
        sgName: [{ required: true, trigger: "blur", message: "分组名称不能为空" }],
        sgCode: [
          { required: true, trigger: "blur", message: "分组编号不能为空" },
        ],
        serviceType: [
          { required: true, trigger: "change", message: "服务类型不能为空" },
        ],
      },
      // 服务类型列表
      servTypeList: []
    }
  },
  methods: {
    resetDialog() {
      this.formData = {
        bkId: "",
        arsId: "",
        sgName: "",
        sgCode: "",
        serviceType: "",
        sgDesc: "",
      }
    },
    closeDialog() {
      this.resetDialog()
      this.$emit("closeDialog", "group")
    },
    confirm() {
      const form = this.$refs.form;
      const data = this.formData;
      form.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const params = {
            ...this.formData,
            creater: JSON.parse(getLocalStorage("_userInfo")).cstName,
        }
        const res = await this.rpc.public.addApiGroup(params);
        this.$notify({
          title: "成功",
          message: "新增分组成功",
          duration: 2000,
          type: "success",
        });
        this.$emit("updateSelect", "group")
        this.closeDialog()
      });
    },
    async getServTypeList() {
      const res = await this.rpc.public.getServTypeList()
      this.servTypeList = res.serviceTypeList
    },
    init() {
      this.getServTypeList()
    }
  },
  created() {
    // this.init()
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4b_edit_create_group {
  .edit_form {
    @include form;
    .no_before {
      ::v-deep .el-form-item__label::before {
        content: "";
      }
    }
  }
}
</style>
