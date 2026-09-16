<template>
  <div class="aop_tradedesign_comps_d4bdesign_public_tech_desc">
    <div class="input_wrapper">
      <div class="top_right_create" v-if="safeDescType !== 'read'">
        <el-button type="primary" icon="el-icon-plus" @click="showDialog"
          >添加描述</el-button
        >
      </div>
      <Table
        class="table_style"
        :data="techDescList"
        :table="techDescTable"
        @operate="operate"
      ></Table>
    </div>
    <PageDialog
      :dialogTitle="dialogTitle"
      :dialogVisiable="techDescVisible"
      dialogWidth="56.3%"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <el-form
          :model="techDescForm"
          :rules="techDescs"
          ref="techDescFormRef"
          label-width="100px"
          class="form"
        >
          <el-form-item label="描述" prop="name">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入"
              v-model="techDescForm.name"
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
export default {
  components: {
    Table,
    PageDialog,
  },
  props: {
    safeDescType: {
      type: String,
      default: () => "edit",
    },
  },
  data() {
    return {
      //列表参数
      techDescTable: [
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
      //列表数据
      techDescList: [],
      techDescVisible: false,
      //技术\安全内容数据
      techDescForm: {
        name: "",
      },
      //技术安全规则校验
      techDescs: {
        name: [{ required: true, message: "请输入描述内容", trigger: "blur" }],
      },
      // 弹框标题
      dialogTitle: "",
      // 编辑操作时当前行的数据
      isData: "",
    };
  },
  methods: {
    operate(op, data) {
      if (op == "delete") {
        const i = this.techDescList.indexOf(data);
        this.techDescList.splice(i, 1);
        console.log("i", i, data);
        this.techDescList.forEach((item, index) => {
          item.stepNo = index + 1;
        });
      } else {
        this.isData = data;
        this.techDescForm.name = data.stepContent;
        this.dialogTitle = "编辑描述";
        this.techDescVisible = true;
      }
    },
    //点击确定
    confirm() {
      this.$refs.techDescFormRef.validate((valid) => {
        if (!valid) return;
        if (this.dialogTitle == "添加描述") {
          const data = {
            stepNo: this.techDescList.length + 1 + "",
            stepContent: this.techDescForm.name,
          };
          this.techDescList.push(data);
        } else {
          const i = this.techDescList.indexOf(this.isData);
          this.techDescList[i].stepContent = this.techDescForm.name;
        }
        this.techDescVisible = false;
        this.$refs.techDescFormRef.resetFields();
      });
    },
    //显示弹框
    showDialog() {
      this.dialogTitle = "添加描述";
      this.techDescVisible = true;
    },
    //关闭弹框
    closeDialog() {
      this.techDescVisible = false;
      this.$refs.techDescFormRef.resetFields();
    },
  },
  created() {
    this.techDescTable[2].type = this.safeDescType == "read" ? "" : "button";
    if (this.techDescTable[2].type == "") {
      this.techDescTable[2].label = "";
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4bdesign_public_tech_desc {
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