<!--
 * 新增词根-新增字段要求
 -->
<template>
  <div class="info-form-content">
    <!-- 新增 -->
    <div class="aop-com-info-form-wrap">
      <!-- 模块信息表单 -->
      <el-form
        ref="infoForm"
        :model="formData"
        :rules="formRules"
        label-position="top"
        :inline="false"
        size="small"
        @submit.native.prevent
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="字段名称" prop="fieldName">
              <el-input
                v-model="formData.fieldName"
                placeholder="请输入字段名称"
                :maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段类型" prop="fieldType">
              <el-select
                v-model="formData.fieldType"
                placeholder="请选择字段类型"
                clearable
              >
                <el-option
                  :label="item.lable"
                  :value="item.value"
                  v-for="item in fieldTypeOption"
                  :key="item.lable"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段长度" prop="fieldLength">
              <el-input
                v-model="formData.fieldLength"
                placeholder="请输入字段长度"
                :maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="业务定义" prop="fieldBusiness">
              <el-input
                v-model="formData.fieldBusiness"
                type="textarea"
                :rows="3"
                resize="none"
                placeholder="请输入业务定义"
                :maxlength="200"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="业务规则" prop="fieldRule">
              <el-input
                v-model="formData.fieldRule"
                type="textarea"
                :rows="3"
                resize="none"
                placeholder="请输入业务规则"
                :maxlength="200"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 枚举定义 -->
      <h3 class="required-title">枚举定义</h3>
      <div class="padding-b-12">
        <el-button
          @click="handleAdd"
          class="com-plain-primary-btn"
          icon="el-icon-plus"
          type="default"
          size="small"
          >新增枚举值</el-button
        >
      </div>
      <div class="aop_common_page_table">
        <el-table :data="tableData">
          <el-table-column
            prop="enumValue"
            label="代码名称（VALUE）"
          ></el-table-column>
          <el-table-column label="操作" width="150" align="left">
            <div class="flex_wrap" slot-scope="{ row, $index }">
              <span
                class="design_btn blue pointer"
                @click="handleEdit(row, $index)"
                >编辑</span
              >
              <el-divider direction="vertical"></el-divider>
              <span
                class="design_btn red pointer"
                @click="handleDelete(row, $index)"
                >删除</span
              >
            </div>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新增/修改枚举值 -->
    <addEnum ref="addEnum" @enumConfirm="enumConfirm" />
    <div class="info-bottom-handle">
      <el-button type="default" plain size="medium" @click="handleClose">
        取消
      </el-button>
      <el-button
        class="ml24"
        type="primary"
        size="medium"
        @click="handleConfirm"
      >
        保存
      </el-button>
    </div>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import addEnum from "./addEnum.vue";
import { fieldTypeOption } from "@m/utils/commonData";
export default {
  mixins: [mixin],
  components: { addEnum },
  data() {
    return {
      // 表单数据
      formData: {
        fieldName: "",
        fieldType: "",
        fieldLength: "",
        fieldBusiness: "",
        fieldRule: "",
      },
      // 表单规则
      formRules: {
        fieldName: [
          {
            required: true,
            message: "请输入字段名称",
            trigger: "blur",
          },
        ],
        fieldType: [
          {
            required: true,
            message: "请选择字段类型",
            trigger: "blur",
          },
        ],
        fieldLength: [
          {
            required: true,
            message: "请输入字段长度",
            trigger: "blur",
          },
        ],
      },
      fieldTypeOption: [],
      tableData: [],
      editIndex: -1,
    };
  },
  props: {
    addParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  inject: ["openTab"], // 用于打开窗口
  created() {
    this.fieldTypeOption = fieldTypeOption;
  },
  methods: {
    // 点击取消按钮
    handleClose() {
      this.$emit("close");
    },
    handleAdd() {
      this.editIndex = -1;
      this.$refs.addEnum.openDialog({
        action: "add",
      });
    },
    handleEdit(row, $index) {
      this.editIndex = $index;
      this.$refs.addEnum.openDialog({
        action: "edit",
        enumValue: row.enumValue,
      });
    },
    handleDelete(row, $index) {
      this.$confirm("确定删除此枚举定义吗？", "提示")
        .then(() => {
          this.tableData.splice($index, 1);
        })
        .catch(() => {});
    },
    enumConfirm(enumValue) {
      console.log(enumValue, "enumValue===");

      if (this.editIndex === -1) {
        this.tableData.push({
          enumValue: enumValue,
        });
      } else {
        this.tableData[this.editIndex] = {
          ...this.tableData[this.editIndex],
          enumValue: enumValue,
        };
        this.tableData = this.tableData.concat([]);
      }
    },
    // 点击确定按钮
    handleConfirm() {
      this.$refs.infoForm.validate((valid, validObject) => {
        if (valid === true) {
          this.rpc.d4
            .dataDictionaryFieldAddApply({
              ...this.formData,
              ...(this.addParams.params || {}),
              fieldSource: this.addParams.fieldSource || "design",
              dataDictionaryEnumLists: this.tableData,
            })
            .then(() => {
              this.$notify({
                title: "成功",
                message: "字段新增成功",
                duration: 2000,
                type: "success",
              });
              this.$emit("selectConfirm", []);
              this.$emit("refreshData");
              this.handleClose();
            });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
@import "@m/assets/css/common.scss";
@import "./css/page.scss";
.info-form-content {
  padding: 24px;

  .aop-com-info-form-wrap {
    ::v-deep {
      .el-form-item {
        margin-bottom: 24px;
      }
      .el-form-item__label {
        line-height: 16px;
        padding-bottom: 12px;
      }
      .el-select {
        width: 100%;
      }
    }
  }
  .required-title {
    padding-bottom: 12px;
    font-size: 14px;
    color: #323c41;
    line-height: 16px;
    font-weight: 400;
  }
}
.info-bottom-handle {
  position: fixed;
  bottom: 0;
  width: stretch;
  background: #ffffff;
  flex: none;
  height: 72px;
  box-shadow: inset 0px 1px 0px 0px rgba(245, 245, 250, 1);
  @extend .flex-center;
  ::v-deep .el-button {
    width: 112px;
    height: 40px;
    border-radius: 2px;
  }
}
</style>
