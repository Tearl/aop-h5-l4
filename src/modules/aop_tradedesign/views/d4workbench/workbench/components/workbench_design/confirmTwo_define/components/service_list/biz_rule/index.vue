<template>
  <div class="aop_tradedesign_comps_d4_edit_biz_rule">
    <div class="content_wrapper" v-if="isEdit">
      <div class="block">
        <div class="title">规则表</div>
        <RuleTable
          ref="ruleTableRef"
          :currentServObj="currentServObj"
          :ruleComnt="ruleInfo.ruleComnt"
          :pageType="isEdit ? 'edit' : 'read'"
        ></RuleTable>
        <!-- <Table
          class="table_style"
          :data="businessRuleList"
          :table="bizRuleTable"
          @operate="operate"
        ></Table> -->
      </div>
      <div class="block">
        <div class="title">规则说明</div>
        <el-input
          v-model="ruleInfo.ruleComnt"
          placeholder="请输入"
          type="textarea"
        ></el-input>
      </div>
    </div>
    <div class="content_wrapper" v-else>
      <div class="block">
        <div class="title">规则表</div>
        <RuleTable
          ref="ruleTableRef"
          :currentServObj="currentServObj"
          :pageType="isEdit ? 'edit' : 'read'"
        ></RuleTable>
        <!-- <Table
          class="table_style"
          :data="businessRuleList"
          :table="bizRuleTable"
          @operate="operate"
        ></Table> -->
      </div>
      <div class="block">
        <div class="title">规则说明</div>
        <div>{{ ruleInfo.ruleComnt }}</div>
      </div>
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
            <el-form-item label="规则ID" prop="ruleNo">
              <el-input
                v-model="bizRuleForm.ruleNo"
                clearable
                placeholder="请输入规则ID"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="规则名称" prop="ruleNm">
              <el-input
                v-model="bizRuleForm.ruleNm"
                clearable
                placeholder="请输入规则名称"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="规则类型" prop="ruleType">
              <el-select
                v-model="bizRuleForm.ruleTpCd"
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
            <el-form-item label="自然语言描述" prop="ruleDesc" class="no_before">
              <el-input
                type="textarea"
                v-model="bizRuleForm.ruleDesc"
                clearable
                placeholder="请输入自然语言描述"
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
import filters from "@m/utils/filters";
import RuleTable from "@m/core/components/rule_table";

export default {
  components: {
    Table,
    PageDialog,
    RuleTable,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: () => false,
    },
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    ruleInfo: {
      type: Object,
      default: () => ({}),
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
        ruleNo: "", // 规则ID
        ruleNm: "", // 规则名称
        ruleTpCd: "", // 规则类型
        ruleDesc: "", // 规则语言描述
      },
      //业务规则规则校验
      bizRules: {
        ruleNo: [
          { required: true, trigger: "blur", message: "规则ID不能为空" },
        ],
        ruleNm: [
          { required: true, trigger: "blur", message: "规则名称不能为空" },
        ],
        ruleTpCd: [
          { required: true, trigger: "blur", message: "规则类型不能为空" },
        ],
      },
      // 弹框标题
      dialogTitle: "",
      // 点击编辑时当前行的数据
      isData: "",
      // 分类下拉框选项
      classificationNmOptions: [
        { type: "文本", value: "0" },
        { type: "引用", value: "1" },
        { type: "赋值", value: "2" },
        { type: "判断", value: "3" },
        { type: "服务调用", value: "4" },
        { type: "公式", value: "5" },
      ],
      ruleComnt: ""
    };
  },
  computed: {
    //业务规则参数列表
    bizRuleTable() {
      const result = [
        {
          prop: "ruleNo",
          label: "规则ID",
          width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "ruleNm",
          label: "规则名称",
          width: "120",
          type: "text",
          tooltip: true,
        },
        {
          prop: "ruleTpCd",
          label: "规则类型",
          width: "120",
          type: "text",
          filter: "ruleTpCd",
          operate: "read",
          tooltip: true,
        },
        {
          prop: "ruleDesc",
          label: "自然语言描述",
          width: "600",
          type: "input",
        },
      ]
      if (this.isEdit) result.push({
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
          
          const target = this.businessRuleList.find(item => item.ruleNo == this.isData.ruleNo)
          const i = this.businessRuleList.indexOf(target)
          this.$set(this.businessRuleList, i, JSON.parse(JSON.stringify(this.bizRuleForm)))
        }
        this.bizRuleVisible = false;
        this.$refs.bizRuleFormRef.resetFields();
      });
    },
    Add(){
      let arrTemp = this.businessRuleList[0];
      const newObj = {}
      if(arrTemp){
        for(let key in arrTemp){
          newObj[key] = ""
          
        }
      }
      console.log(newObj,"key")
      this.businessRuleList.push(newObj)
      // this.businessRuleList.splice(this.businessRuleList.length-1 ,0,newObj)
      console.log(this.businessRuleList,"Add")
    }
  },
  created() {
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4_edit_biz_rule {
  .content_wrapper {
    .block {
      margin-bottom: 16px;
      .title {
        margin-bottom: 8px;
      }
      .table_style {
        margin-top: 16px;
        ::v-deep .el-table th {
          line-height: 0;
          color: $sec_ft_color;
        }
      }
      .btn_list{
        /deep/ .el-button--small{
          padding: 9px 0px;
        }
        /deep/.el-button{
          width: 72px;
        }
      }
    }
    .top_right_create {
      ::v-deep .el-button {
        @include large_button_common;
        width: 121px;
      }
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
}
</style>