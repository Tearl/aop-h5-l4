<template>
  <div class="aop_tradedesign_comps_d4bdesign_public_bug_desc">
    <div class="input_wrapper">
      <div class="top_right_create" v-if="bugDescType !== 'read'">
        <el-button type="primary" icon="el-icon-plus" @click="showDialog"
          >添加说明</el-button
        >
      </div>
      <Table
        class="table_style"
        :data="bugDescList"
        :table="bugDescTable"
        @operate="operate"
      ></Table>
    </div>
    <PageDialog
      :dialogTitle="dialogTitle"
      :dialogVisiable="bugDescVisible"
      dialogWidth="56.3%"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <el-form
          :model="bugDescForm"
          :rules="bugDescs"
          ref="bugDescFormRef"
          label-width="100px"
          class="form"
        >
          <el-form-item label="异常说明" prop="name">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入"
              v-model="bugDescForm.name"
            >
            </el-input>
          </el-form-item>
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
    bugDescType: {
      type: String,
      default: () => "edit",
    },
  },
  data() {
    return {
      //异常说明列表参数
      bugDescTable: [
        {
          prop: "stepNo",
          label: "序号",
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
      //异常处理说明列表数据
      bugDescList: [],
      //控制异常处理说明弹框显示
      bugDescVisible: false,
      //添加异常处理说明内容
      bugDescForm: {
        name: "",
      },
      //异常处理说明规则校验
      bugDescs: {
        name: [
          { required: true, message: "请输入异常处理说明", trigger: "blur" },
        ],
      },
      dialogTitle: "",
      isData: "",
    };
  },
  methods: {
    //操作
    operate(op, data) {
      if (op == "delete") {
        const i = this.bugDescList.indexOf(data);
        this.bugDescList.splice(i, 1);
        this.bugDescList.forEach((item, index) => {
          item.stepNo = index + 1;
        });
      } else {
        this.isData = data;
        this.bugDescForm.name = data.stepContent;
        this.bugDescVisible = true;
        this.dialogTitle = "编辑异常处理说明";
      }
    },
    //点击确定
    confirm() {
      this.$refs.bugDescFormRef.validate((valid) => {
        if (!valid) return;
        if (this.dialogTitle == "添加异常处理说明") {
          const data = {
            stepNo: this.bugDescList.length + 1 + "",
            stepContent: this.bugDescForm.name,
          };
          this.bugDescList.push(data);
        } else {
          const i = this.bugDescList.indexOf(this.isData);
          this.bugDescList[i].stepContent = this.bugDescForm.name;
        }
        this.bugDescVisible = false;
        this.$refs.bugDescFormRef.resetFields();
      });
    },
    //显示添加异常说明弹框
    showDialog() {
      this.dialogTitle = "添加异常处理说明";
      this.bugDescVisible = true;
    },
    //关闭弹框
    closeDialog() {
      this.bugDescVisible = false;
      this.$refs.bugDescFormRef.resetFields();
    },
  },
  created() {
    this.bugDescTable[2].type = this.bugDescType == "read" ? "" : "button";
    if (this.bugDescTable[2].type == "") {
      this.bugDescTable[2].label = "";
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4bdesign_public_bug_desc {
  .top_right_create {
    ::v-deep .el-button {
      @include large_button_common;
      width: 121px;
    }
  }
  .form {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 24px 0;
  }
  ::v-deep .el-textarea__inner {
    width: 520px;
    // min-height: 100px !important;
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