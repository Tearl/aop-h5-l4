<template>
  <div class="aop_tradedesign_comps_d4bdesign_public_proces">
    <div class="input_wrapper">
      <div class="top_right_create" v-if="procesType !== 'read'">
        <el-button type="primary" icon="el-icon-plus" @click="showDialog"
          >添加步骤</el-button
        >
      </div>
      <Table
        class="table_style"
        :data="processList"
        :table="procesTable"
        @operate="operate"
      ></Table>
    </div>

    <PageDialog
      :dialogTitle="dialogTitle"
      :dialogVisiable="procesVisible"
      dialogWidth="56.3%"
      @closeDialog="closeDialog"
    >
      <div slot="box" class="box">
        <el-form
          :model="procesRuleForm"
          :rules="procesRules"
          ref="procesRuleFormRef"
          label-width="100px"
        >
          <el-form-item label="步骤:" prop="stepNo">
            <el-select v-model="procesRuleForm.stepNo" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="流程说明:"
            prop="stepContent"
            class="item_bottom"
          >
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入"
              v-model="procesRuleForm.stepContent"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </PageDialog>
  </div>
</template>

<script>
import Table from "@m/core/components/page_table";
import PageDialog from "@m/core/components/page_dialog";
import filters from "@m/utils/filters";

export default {
  components: {
    Table,
    PageDialog,
  },
  props: {
    procesType: {
      type: String,
      default: () => "edit",
    },
  },
  data() {
    return {
      //流程说明列表参数
      procesTable: [
        {
          prop: "stepNo",
          label: "步骤",
          filter: "step",
          width: "100",
          type: "text",
        },
        {
          prop: "stepContent",
          label: "内容",
          minWidth: "50%",
          type: "text",
          tooltip: true,
        },
        {
          label: "操作",
          width: "110",
          type: "button",
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
        },
      ],
      procesVisible: false,
      //流程说明列表参数数据
      processList: [],
      //添加流程说明数据
      procesRuleForm: {
        stepNo: "",
        stepContent: "",
      },
      //流程说明规则校验
      procesRules: {
        stepNo: [{ required: true, message: "请选择步骤", trigger: "blur" }],
        stepContent: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      //步骤下拉框数据
      options: [
        {
          value: "1",
          label: "第一步",
        },
        {
          value: "2",
          label: "第二步",
        },
        {
          value: "3",
          label: "第三步",
        },
        {
          value: "4",
          label: "第四步",
        },
        {
          value: "5",
          label: "第五步",
        },
        {
          value: "6",
          label: "第六步",
        },
        {
          value: "7",
          label: "第七步",
        },
        {
          value: "8",
          label: "第八步",
        },
        {
          value: "9",
          label: "第九步",
        },
        {
          value: "10",
          label: "第十步",
        },
      ],
      // 弹框标题
      dialogTitle: "",
      // 编辑操作时当前行的数据
      isData: "",
    };
  },
  methods: {
    operate(op, data) {
      if (op == "delete") {
        const i = this.processList.indexOf(data);
        this.processList.splice(i, 1);
        this.processList.forEach((item) => {
          if (item.stepNo * 1 > i + 1) item.stepNo = `${item.stepNo * 1 - 1}`
        })
        this.rankedList();
      } else {
        this.isData = data;
        this.dialogTitle = "编辑流程说明";
        this.procesRuleForm.stepNo = data.stepNo;
        this.procesRuleForm.stepContent = data.stepContent;
        this.procesVisible = true;
      }
    },
    // 排序
    rankedList() {
      this.processList.sort((a, b) => {
        return a.stepNo * 1 - b.stepNo * 1;
      });
    },
    //关闭弹框
    closeDialog() {
      this.$refs.procesRuleFormRef.resetFields();
      this.procesVisible = false;
    },
    // 点击添加流程说明按钮
    showDialog() {
      this.dialogTitle = "添加流程说明";
      this.procesVisible = true;
      this.procesRuleForm.stepNo = this.processList.length + 1 + ""
      if (this.processList.length + 1 > 10) {
        this.options.push({
          value: `${this.processList.length + 1}`,
          label: filters.step(this.processList.length + 1),
        })
      }
    },
    // 确定保存
    confirm() {
      this.$refs.procesRuleFormRef.validate((valid) => {
        if (!valid) return;
        if (this.dialogTitle == "添加流程说明") {
          const data = {
            stepNo: this.procesRuleForm.stepNo + "",
            stepContent: this.procesRuleForm.stepContent,
          };
          this.processList.forEach((item) => {
            if (item.stepNo * 1 >= data.stepNo * 1) item.stepNo = `${item.stepNo * 1 + 1}`
          })
          this.processList.push(data);
        } else {
          const i = this.processList.indexOf(this.isData);
          this.processList[i].stepNo = this.procesRuleForm.stepNo + "";
          this.processList[i].stepContent = this.procesRuleForm.stepContent;
        }
        this.procesVisible = false;
        this.$refs.procesRuleFormRef.resetFields();
        this.rankedList();
      });
    },
    // 当步骤超过10时，更新步骤的下拉选框
    updateOptions(length) {
      if (!length || length <= 10) return
      for (let i = 11; i <= length; i++) {
        this.options.push({
          value: `${i}`,
          label: filters.step(i),
        })
      }
    }
  },
  created() {
    this.procesTable[2].type = this.procesType == "read" ? "" : "button";
    if (this.procesTable[2].type == "") {
      this.procesTable[2].label = "";
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4bdesign_public_proces {
  .top_right_create {
    ::v-deep .el-button {
      @include large_button_common;
      width: 121px;
    }
  }
  .table_style {
    margin-top: 16px;
    ::v-deep .el-table th {
      line-height: 0;
      color: $sec_ft_color;
    }
  }
  .box {
    margin: 24px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ::v-deep .el-textarea__inner,
  ::v-deep .el-input__inner {
    width: 520px;
  }
  ::v-deep .item_bottom {
    margin-top: 20px;
  }
}
</style>