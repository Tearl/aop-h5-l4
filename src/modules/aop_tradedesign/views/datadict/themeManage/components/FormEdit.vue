<template>
  <div class="form_edit_common_wrap">
    <el-form
      label-position="top"
      :rules="rules"
      ref="ruleForm"
      :model="form"
      label-width="120px"
      size="small"
    >
      <el-form-item
        v-if="type == 'edit'"
        :label="`主题编码：`"
        prop="topicCode"
      >
        <el-input v-model.trim="form.topicCode" disabled></el-input>
      </el-form-item>
      <el-form-item :label="`主题名称：`" prop="topicName">
        <el-input v-model.trim="form.topicName"></el-input>
      </el-form-item>
      <el-form-item :label="`定义内容：`" prop="topicContent">
        <el-input
          type="textarea"
          maxlength="255"
          show-word-limit
          :autosize="{ minRows: 4 }"
          placeholder="请输入内容"
          v-model="form.topicContent"
        >
        </el-input>
        <!-- <div class="editor-wrap">
                    <aopCommonDocEditor 
                        ref="docEditor"
                        :formMode="true"
                        :useDrawio="false"
                        :showTitle="false"
                        :showHeaderTree="false"
                        v-model="initValues"
                    />
                </div> -->
      </el-form-item>
    </el-form>
    <div class="btn_bottom">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  data() {
    return {
      form: {
        topicCode: "",
        topicName: "",
        topicContent: "",
      },
      rules: {
        topicName: [
          { required: true, message: "请输入主题名称", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "长度在 1 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {
    type: {
      type: String,
      default: "",
    },
    formInfo: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    if (this.type != "add") {
      this.formInit();
    }
  },
  methods: {
    formInit() {
      this.queryThemDetail();
    },
    async queryThemDetail() {
      const { topicCode } = this.formInfo;
      const { topicName, topicContent } =
        await this.rpc.datadict.qryDataDictionaryTopicDetail({ topicCode });
      this.form.topicName = topicName;
      this.form.topicCode = topicCode;
      this.form.topicContent = topicContent
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "");
    },
    cancel() {
      this.$emit("cancel");
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.type == "add") {
            this.addTheme();
          } else {
            this.updateTheme();
          }
        } else {
          return false;
        }
      });
    },
    async addTheme() {
      const { topicName, topicContent } = this.form;

      await this.rpc.datadict.saveDataDictionaryTopic({
        topicName,
        topicContent,
      });
      this.$notify({
        title: "成功",
        message: "新建成功",
        type: "success",
      });
      this.$emit("submit");
    },
    async updateTheme() {
      const { topicCode, topicName, topicContent } = this.form;
      await this.rpc.datadict.updateDataDictionaryTopic({
        topicCode,
        topicName,
        topicContent,
      });
      this.$notify({
        title: "成功",
        message: "编辑成功",
        type: "success",
      });
      this.$emit("submit");
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
<style lang="scss" scoped>
.form_edit_common_wrap {
  padding-bottom: 90px;
  /deep/.el-drawer__body {
    padding: 24px;
  }
  /deep/.el-drawer__header {
    font-size: 16px;
    color: #333333;
    font-weight: 600;
    margin: 0;
    padding: 16px 24px;
    box-shadow: inset 0px -0.5px 0px 0px rgba(220, 224, 228, 1);
  }
}
.btn_bottom {
  background: #ffffff;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 16px 0;
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 1001;
  box-shadow: inset 0px 1px 0px 0px rgba(245, 245, 250, 1);
  .el-button {
    margin-left: 30px;
    width: 112px;
  }
}
.editor-wrap {
  width: 100%;
  height: calc(100vh - 300px);
  overflow-y: auto;
  //   padding-bottom: 78px;
}
</style>