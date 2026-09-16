<template>
  <div class="aop_tradecode_comps_design_attr_judge_attr_select">
    <PageDialog
      :dialogWidth="'56.3%'"
      :dialogTitle="'请选择参数类型'"
      :dialogVisiable="dialogVisible"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <el-form
          :rules="rules"
          :model="formData"
          ref="form"
          label-position="right"
          label-width="130px"
          class="edit_form"
        >
          <div class="form_info">
            <el-form-item label="参数类型" prop="paramsType">
              <el-select
                v-model="formData.paramsType"
                placeholder="请选择参数类型"
                filterable
                clearable
                @change="selectChange"
              >
                <el-option
                  v-for="item in typeList"
                  :label="item.type"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import PageDialog from "@m/core/components/page_dialog";
import { mixList, reList } from "@m/utils/paramTree";

export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    isRead: {
      type: Boolean,
      default: () => false,
    },
    typeList: {
      type: Array,
      default: () => [
        { type: "String", value: "String" },
        { type: "File", value: "File" },
        { type: "List", value: "List" },
        { type: "boolean", value: "boolean" },
        { type: "char", value: "char" },
        { type: "int", value: "int" },
        { type: "byte", value: "byte" },
        { type: "short", value: "short" },
        { type: "long", value: "long" },
        { type: "float", value: "float" },
        { type: "double", value: "double" },
        { type: "Boolean", value: "Boolean" },
        { type: "Character", value: "Character" },
        { type: "Integer", value: "Integer" },
        { type: "Byte", value: "Byte" },
        { type: "Short", value: "Short" },
        { type: "Long", value: "Long" },
        { type: "Float", value: "Float" },
        { type: "Double", value: "Double" },
        { type: "BigDecimal", value: "BigDecimal" },
        { type: "Object", value: "Object" },
        { type: "Date", value: "Date" },
      ],
    },
  },
  data() {
    return {
      dialogVisible: false,
      formData: {
        paramsType: "", // 参数类型
        paramsSource: "", //参数来源
      },
      //定义规则
      rules: {
        paramsType: [{ required: true, trigger: "blur", message: "参数类型不能为空" }],
      },
    };
  },
  inject: ["getDataList"],
  methods: {
    resetForm() {
      this.$refs.form.resetFields()
      this.formData = {
        paramsType: ""
      }
    },
    selectChange(e) {
      console.log("下拉框",e)
      this.formData.paramsType = e
    },
    showDialog(row,prop) {
      console.log("弹窗类型",row)
      this.formData.paramsSource = prop
      this.dialogVisible = true;
    },
    closeDialog() {
      this.resetForm();
      this.dialogVisible = false;
    },
    confirm() {
      console.log("选择的参数",this.formData)
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        this.$emit("getParamsType",this.formData)
        this.resetForm();
        this.dialogVisible = false;
      });
    },
  },
  created() {
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_judge_attr_select {
  .edit_form {
    margin-top: 10px;
    @include form;
  }
}
</style>
