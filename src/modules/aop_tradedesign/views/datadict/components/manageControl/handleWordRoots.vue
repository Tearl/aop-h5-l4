<!--
 * 数据字典-数据字段管理/数据字典管控-新增词根
 -->
<template>
  <el-drawer
    class="aop-com-drawer"
    :title="action === 'add' ? '新增词根' : '编辑词根'"
    :size="800"
    :visible.sync="drawerShow"
    :wrapperClosable="false"
  >
    <div class="info-content">
      <div v-loading="isLoading" class="drawer-main-content info-form-content">
        <!-- 内容 -->
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
                <el-form-item label="词根名称:" prop="rootName">
                  <el-input
                    v-model="formData.rootName"
                    placeholder="仅支持中文、英文"
                    :maxlength="20"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="词根类别:" prop="rootType">
                  <el-select
                    v-model="formData.rootType"
                    placeholder="请选择词根类别"
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in rootTypeOption"
                      :label="item.label"
                      :value="item.value"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 类别阈值-类词时必输 -->
              <el-col v-if="formData.rootType == '02'" :span="12">
                <el-form-item label="类别阈值:" prop="rootTypeThreshold">
                  <el-select
                    v-model="formData.rootTypeThreshold"
                    placeholder="请选择类别阈值"
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in rootTypeThresholdOption"
                      :label="item.label"
                      :value="item.value"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="词根全称:" prop="rootFullName">
                  <el-input
                    v-model="formData.rootFullName"
                    placeholder="英文、首字母大写，两个以上用空格隔开如User Name"
                    :maxlength="20"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="词根简称:" prop="rootShortName">
                  <el-input
                    v-model="formData.rootShortName"
                    placeholder="英文、小写，两个之间用_分隔开例如user_name"
                    :maxlength="20"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="词根来源:" prop="rootSource">
                  <el-input
                    v-model="formData.rootSource"
                    placeholder="请输入词根来源"
                    :maxlength="20"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注:" prop="rootRemarks">
                  <el-input
                    type="textarea"
                    v-model="formData.rootRemarks"
                    placeholder="请输入备注"
                    :rows="5"
                    :maxLength="200"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <!-- 底部操作按钮 -->
      <div class="info-bottom-handle">
        <el-button type="default" plain size="medium" @click="handleClose">
          取消
        </el-button>
        <el-button
          class="ml24"
          type="primary"
          size="medium"
          :disabled="isSaving"
          @click="handleConfirm"
        >
          确定
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import mixin from "@m/core/mixin";
import { rootTypeOption, rootTypeThresholdOption } from "@m/utils/commonData";
const chineseOrEnglish = /^[a-zA-Z\u4e00-\u9fa5]+$/;
const validateName = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入名称"));
  } else if (!/[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(value)) {
    callback(new Error("英文、首字母大写，两个以上用空格隔开如User Name"));
  } else {
    callback();
  }
};
export default {
  mixins: [mixin],
  data() {
    return {
      isLoading: false,
      isSaving: false,
      drawerShow: false, // 弹窗是否显示
      action: "add", // edit编辑
      // 表单数据
      formData: {
        rootName: "",
        rootType: "",
        rootTypeThreshold: "",
        rootFullName: "",
        rootShortName: "",
        rootSource: "",
        rootRemarks: "",
      },
      // 表单规则
      formRules: {
        rootName: [
          {
            required: true,
            message: "请输入词根名称",
            trigger: "blur",
          },
          {
            pattern: chineseOrEnglish,
            message: "仅支持中英文",
            trigger: "blur",
          },
        ],
        rootType: [
          {
            required: true,
            message: "请选择词根类别",
            trigger: "blur",
          },
        ],
        rootTypeThreshold: [
          {
            required: true,
            message: "请选择类别阈值",
            trigger: "blur",
          },
        ],
        rootFullName: [
          {
            required: true,
            message: "请输入词根全称",
            trigger: "blur",
          },
          {
            required: true,
            trigger: "blur",
            validator: validateName,
          },
        ],
        rootShortName: [
          {
            required: true,
            message: "请输入词根简称（xxxx_xxxx）",
            trigger: "blur",
          },
          {
            pattern: /^[a-z_]+$/,
            message: "英文、小写，两个之间用_分隔开例如user_name",
            trigger: "blur",
          },
        ],
        rootSource: [
          {
            required: true,
            message: "请输入词根来源",
            trigger: "blur",
          },
        ],
      },
      // 词根类别
      rootTypeOption: [],
      // 类别阈值
      rootTypeThresholdOption: [],
      rootId: "", // 词根ID
    };
  },
  inject: ["openTab"], // 用于打开窗口
  created() {},
  methods: {
    // 打开抽屉
    openDrawer(action, rootId) {
      // data数据初始化
      Object.assign(this.$data, this.$options.data());
      this.action = action || "add";
      this.rootId = rootId || "";
      this.rootTypeOption = rootTypeOption;
      this.rootTypeThresholdOption = rootTypeThresholdOption;
      this.drawerShow = true;
      this.$nextTick(() => {
        this.$refs.infoForm && this.$refs.infoForm.clearValidate();
      });
      if (this.rootId) {
        this.getInfo();
      }
    },
    // 获取词根详情
    getInfo() {
      this.isLoading = true;
      this.rpc.datadict
        .qryDataDictionaryRootDetail({
          rootId: this.rootId,
        })
        .then((res) => {
          this.formData = {
            rootName: res.rootName || "",
            rootType: res.rootType || "",
            rootTypeThreshold: res.rootTypeThreshold || "",
            rootFullName: res.rootFullName || "",
            rootShortName: res.rootShortName || "",
            rootSource: res.rootSource || "",
            rootRemarks: res.rootRemarks || "",
          };
        })
        .catch((err) => {})
        .finally(() => {
          this.isLoading = false;
        });
    },
    // 点击取消按钮
    handleClose() {
      this.isLoading = false;
      this.drawerShow = false;
    },

    // 点击确定按钮
    handleConfirm() {
      this.$refs.infoForm.validate((valid, validObject) => {
        if (valid === true) {
          this.isSaving = true;
          if (this.action === "add") {
            this.rpc.datadict
              .saveDataDictionaryRoot(this.formData)
              .then((res) => {
                this.$notify({
                  title: "成功",
                  message: "新增成功",
                  duration: 2000,
                  type: "success",
                });
                this.$emit("success", this.formData);
                this.drawerShow = false;
              })
              .catch((err) => {})
              .finally(() => {
                this.isSaving = false;
              });
          } else {
            this.rpc.datadict
              .updateDataDictionaryRoot({
                ...this.formData,
                rootId: this.rootId,
              })
              .then((res) => {
                this.$notify({
                  title: "成功",
                  message: "编辑成功",
                  duration: 2000,
                  type: "success",
                });
                this.$emit("success", {
                  ...this.formData,
                  rootId: this.rootId,
                });
                this.drawerShow = false;
              })
              .catch((err) => {})
              .finally(() => {
                this.isSaving = false;
              });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
@import "@m/assets/css/common.scss";
@import "@m/assets/css/public.scss";
@import "../../css/page.scss";
.info-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-top: 1px solid #e7e7ee;
  .drawer-main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .info-top-fixed {
    flex: none;
  }
  .top-header-tab {
    padding: 0 24px;
    box-shadow: 0px 0.5px 0px 0px rgba(231, 231, 238, 1);
  }
  .info-bottom-handle {
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
}
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
    &::before {
      display: inline-block;
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  }
}
</style>
