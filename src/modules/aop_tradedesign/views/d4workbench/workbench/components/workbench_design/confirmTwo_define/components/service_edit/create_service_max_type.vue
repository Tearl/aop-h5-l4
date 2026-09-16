<template>
  <div class="aop_tradedesign_comps_d4b_edit_create_service_max_type">
    <!-- 新增服务系统 -->
    <PageDialog
      :dialogWidth="'600px'"
      :dialogTitle="'新增服务大类'"
      :dialogVisiable="dialogVisiable"
      @closeDialog="closeDialog"
      class="create_dialog"
    >
      <div slot="box">
        <el-form
          :model="formData"
          :rules="ruleValidate"
          ref="form"
          label-width="120px"
          class="edit_form"
        >
          <div class="form_info">
            <el-form-item label="大类名称" prop="typeName">
              <el-input
                v-model="formData.typeName"
                placeholder="请输入大类名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="大类编码" prop="typeCode">
              <el-input
                v-model="formData.typeCode"
                placeholder="请输入大类编码"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="类别描述">
              <el-input
                v-model="formData.typeDesc"
                :maxlength="100"
                placeholder="请输入类别描述"
              ></el-input>
            </el-form-item> -->
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
    sysId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      formData: {
        typeName: "",
        typeCode: "",
        typeDesc: "",
      },
      //定义规则
      rules: {
        typeName: [{ required: true, message: "请输入大类名称", trigger: "blur" }],
        typeCode: [{ required: true, message: "请输入大类名称", trigger: "blur" }],
      },
    }
  },
  methods: {
    resetDialog() {
      this.formData = {
        typeName: "",
        typeCode: "",
        typeDesc: "",
      }
    },
    closeDialog() {
      this.resetDialog()
      this.$emit("closeDialog", "maxType")
    },
    confirm() {
      console.log("confirm")
      this.$refs.form.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const params = {
          typeName: this.formData.typeName,
          typeDesc: this.formData.typeDesc,
          typeCode: this.formData.typeCode,
          creater: JSON.parse(getLocalStorage("_userInfo")).cstName,
          arsId: this.sysId,
        }
        const res = await this.rpc.public.addType(params);
        this.$notify({
          title: "成功",
          message: "新增成功",
          duration: 2000,
          type: "success",
        });
        this.$emit("updateSelect", "maxType")
        this.closeDialog();
        // this.search();
        // this.closeGroupDialog();
      });
    },
    init() {
    }
  },
  created() {
    this.init()
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4b_edit_create_service_max_type {
  .edit_form {
    @include form;
  }
}
</style>
