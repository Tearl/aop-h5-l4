<template>
  <div class="aop_tradedesign_comps_d4_edit_biz_rule">
    <div class="input_wrapper">
      <div class="top_right_create" v-if="bizType !== 'read'">
        <el-button type="primary" icon="el-icon-plus" @click="showDialog"
          >添加规则</el-button
        >
      </div>
      <Table
        class="table_style"
        :data="businessRuleList"
        :table="bizRuleTable"
        @operate="operate"
      ></Table>
    </div>
    <PageDialog
      :dialogTitle="dialogTitle"
      :dialogVisiable="bizRuleVisible"
      dialogWidth="600px"
      @closeDialog="closeDialog"
    >
      <div class="dialog_content" slot="box">
        <el-form
          class="edit_form"
          ref="bizRuleFormRef"
          label-width="120px"
          :model="bizRuleForm"
          :rules="bizRules"
        >
          <div class="form_info">
            <el-form-item label="规则ID" prop="ruleCode">
              <el-input
                v-model="bizRuleForm.ruleCode"
                clearable
                placeholder="请输入规则ID"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="规则类型" prop="ruleType">
              <el-select
                v-model="bizRuleForm.ruleType"
                clearable
                placeholder="规则类型"
              >
                <el-option
                  v-for="(item, index) in classificationNmOptions"
                  :value="item.value"
                  :label="item.type"
                  :key="index"
                  >{{ item.type }}</el-option
                >
              </el-select>
            </el-form-item>
            <el-form-item label="规则描述" prop="ruleDesc" class="no_before">
              <el-input
                type="textarea"
                v-model="bizRuleForm.ruleDesc"
                clearable
                placeholder="请输入规则描述"
              >
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
      >
    </PageDialog>
  </div>
</template>

<script>
import Table from "@m/core/components/page_table";
import PageDialog from "@m/core/components/page_dialog";
export default {
  components: {
    Table,
    PageDialog,
  },
  props: {
    bizType: {
      type: String,
      default: () => "edit",
    },
  },
  data() {
    return {
      //控制显示添加业务规则弹框
      bizRuleVisible: false,
      //业务规则列表数据
      businessRuleList: [],
      //业务规则输入数据
      bizRuleForm: {
        ruleCode: "", // 规则ID
        ruleType: "", // 规则类型
        ruleDesc: "", // 规则语言描述
      },
      //业务规则规则校验
      bizRules: {
        ruleCode: [
          { required: true, trigger: "blur", message: "规则ID不能为空" },
        ],
        ruleType: [
          { required: true, trigger: "blur", message: "规则类型不能为空" },
        ],
      },
      // 弹框标题
      dialogTitle: "",
      // 点击编辑时当前行的数据
      isData: "",
      // 分类下拉框选项
      classificationNmOptions: [
        { type: "文本", value: "文本" },
        { type: "赋值", value: "赋值" },
        { type: "判断", value: "判断" },
        { type: "服务调用", value: "服务调用" },
      ],
    };
  },
  computed: {
    //业务规则参数列表
    bizRuleTable() {
      const result = [
        {
          prop: "ruleNo",
          label: "规则ID",
          width: "120",
          type: "text",
          tooltip: true,
        },
        {
          prop: "ruleTpCd",
          label: "规则类型",
          width: "120",
          // type: "textClick",
          type: "text",
          operate: "read",
          filter: "ruleTpCd",
          tooltip: true,
        },
        {
          prop: "ruleDesc",
          label: "规则描述",
          width: "600",
          type: "textarea",
        },
      ]
      if (this.bizType == "edit") result.push({
        label: "操作",
        width: "110",
        type: "button",
        // fixed: "right",
        buttonList: [
          {
            desc: "编辑",
            operate: "edit",
          },
          {
            desc: "删除",
            operate: "delete",
          },
        ],
      })
      return result
    }
  },
  methods: {
    operate(op, data) {
      console.log(data)
      if (op == "delete") {
        const i = this.businessRuleList.indexOf(data);
        this.businessRuleList.splice(i, 1);
        this.businessRuleList.forEach((item, index) => {
          item.stepNo = index + 1;
        });
      } else {
        this.isData = data;
        this.dialogTitle = "编辑规则说明";
        this.bizRuleForm = JSON.parse(JSON.stringify(this.isData))
        // this.bizRuleForm.stepContent = data.stepContent;
        this.bizRuleVisible = true;
      }
    },
    // 点击添加规则按钮
    showDialog() {
      this.dialogTitle = "添加规则说明";
      this.bizRuleVisible = true;
    },
    // 弹框关闭时
    closeDialog() {
      this.$refs.bizRuleFormRef.resetFields();
      this.bizRuleVisible = false;
    },
    // 确定保存
    confirm() {
      this.$refs.bizRuleFormRef.validate((valid) => {
        if (!valid) return;
        const data = JSON.parse(JSON.stringify(this.bizRuleForm))
        
        if (this.dialogTitle == "添加规则说明") {
          this.businessRuleList.push(data)
        } else {
          
          const target = this.businessRuleList.find(item => item.ruleCode == this.isData.ruleCode)
          const i = this.businessRuleList.indexOf(target)
          this.$set(this.businessRuleList, i, JSON.parse(JSON.stringify(this.bizRuleForm)))
        }
        this.bizRuleVisible = false;
        this.$refs.bizRuleFormRef.resetFields();
      });
    },
  },
  created() {
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4_edit_biz_rule {
  .top_right_create {
    ::v-deep .el-button {
      @include large_button_common;
      width: 121px;
    }
  }
  .edit_form {
    @include form;
    .no_before {
      ::v-deep .el-form-item__label::before {
        content: ""!important;
      }
    }
  }
  .table_style {
    margin-top: 16px;
    ::v-deep .el-table th {
      line-height: 0;
      color: $sec_ft_color;
    }
  }
}
</style>