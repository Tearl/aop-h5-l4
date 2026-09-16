<template>
  <div class="aop_tradeDesign_comps_enumerate">
    <div class="input_wrapper">
      <div class="top_right_create" v-if="bizType == 'edit'">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="pushTable"
          >添加枚举值</el-button
        >
      </div>
      <Table
        class="table_style"
        :data="enumerateValueList"
        :table="enumerateValueTable"
        @operate="operate"
      ></Table>
    </div>
    <PageDialog
      :apTobody="true" 
      :dialogTitle="dialogTitle"
      :dialogVisiable="enumerateValueVisible"
      dialogWidth="56.3%"
      @closeDialog="closeDialog"
    >
      <div slot="box" class="box">
        <el-form
          :model="enumerateValueForm"
          :rules="enumerateValueRules"
          ref="enumerateValueFormRef"
          label-width="100px"
          class="form"
        >
          <el-form-item label="枚举值" prop="enumerateValue">
            <el-input
              placeholder="请输入枚举值"
              clearable
              v-model="enumerateValueForm.enumerateValue"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="mt20" label="内容" prop="stepContent">
            <el-input
              placeholder="请输入内容"
              clearable
              v-model="enumerateValueForm.stepContent"
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
import Table from "@m/core/components/page_table_workgate";
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
      //枚举值参数列表
      enumerateValueTable: [
        {
          prop: "key",
          label: "枚举值",
          minWidth: "25%",
          type: "input",
          placeholder: "请输入枚举值",
        },
        {
          prop: "value",
          label: "内容",
          minWidth: "50%",
          type: "input",
          placeholder: "请输入内容",
          // tooltip: true,
        },
        {
          label: "操作",
          width: "70",
          type: "button",
          buttonList: [
            // {
            //   desc: "编辑",
            //   operate: "edit",
            // },
            {
              desc: "删除",
              operate: "delete",
            },
          ],
        },
      ],
      //控制显示添加枚举值弹框
      enumerateValueVisible: false,
      //枚举值列表数据
      enumerateValueList: [],
      //枚举值输入数据
      enumerateValueForm: {
        enumerateValue: "",
        stepContent: "",
      },
      //枚举值规则校验
      enumerateValueRules: {
        enumerateValue: [{ required: true, message: "请输入枚举值", trigger: "blur" }],
        stepContent: [{ required: true, message: "请输入内容", trigger: "blur" }],
        
      },
      // 弹框标题
      dialogTitle: "",
      // 点击编辑时当前行的数据
      isData: "",
    };
  },
  methods: {
    init() {
      if(this.bizType == "edit") {
        this.enumerateValueTable= [
          {
            prop: "key",
            label: "枚举值",
            minWidth: "15%",
            type: "text",
          },
          {
            prop: "value",
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
        ]
      }else {
        this.enumerateValueTable= [
          {
            prop: "key",
            label: "枚举值",
            minWidth: "15%",
            type: "text",
          },
          {
            prop: "value",
            label: "内容",
            minWidth: "50%",
            type: "text",
            tooltip: true,
          }
        ]
      }
    },
    operate(op, data) {
      if (op == "delete") {
        const i = this.enumerateValueList.indexOf(data);
        this.enumerateValueList.splice(i, 1);
        this.enumerateValueList.forEach((item, index) => {
          item.stepNo = index + 1;
        });
      } else {
        this.showDialog("enumerateEdit", data)
        // this.isData = data;
        // this.dialogTitle = "编辑规则说明";
        // this.enumerateValueForm.enumerateValue = data.key;
        // this.enumerateValueForm.stepContent = data.value;
        // this.enumerateValueVisible = true;
      }
    },
    // 点击添加规则按钮
    showDialog(type, data) {
      this.$emit("showDialog", type, data)
      // this.dialogTitle = "添加规则说明";
      // this.enumerateValueVisible = true;
    },
    // 弹框关闭时
    closeDialog() {
      this.$refs.enumerateValueFormRef.resetFields();
      this.enumerateValueVisible = false;
    },
    // 确定保存
    confirm() {
      this.$refs.enumerateValueFormRef.validate((valid) => {
        if (!valid) return;
        if (this.dialogTitle == "添加规则说明" || this.dialogTitle =="添加枚举") {
          const data = {
            key: this.enumerateValueForm.enumerateValue,
            value: this.enumerateValueForm.stepContent,
          };
          this.enumerateValueList.push(data);
        } else {
          const i = this.enumerateValueList.indexOf(this.isData);
          this.enumerateValueList[i].key = this.enumerateValueForm.enumerateValue;
          this.enumerateValueList[i].value = this.enumerateValueForm.stepContent;
        }
        this.enumerateValueVisible = false;
        this.$refs.enumerateValueFormRef.resetFields();
      });
    },
    pushTable(){
      this.enumerateValueList.push({
        key:"",
        value:""
      })
      this.enumerateValueList = JSON.parse(JSON.stringify(this.enumerateValueList))
    },
    resetTableData(){
      // this.$nextTick(()=>{
      //   this.enumerateValueList.length = 0;
      //   this.enumerateValueList.push({})
      //   this.$forceUpdate();
      // })
      this.enumerateValueList.splice(0,this.enumerateValueList.length)
    }
  },
  created() {
    this.enumerateValueTable[2].type = this.bizType == "read" ? "" : "button";
    if (this.enumerateValueTable[2].type == "") {
      this.enumerateValueTable[2].label = "";
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradeDesign_comps_enumerate {
  // .top_right_create {
  //   ::v-deep .el-button {
  //     @include large_button_common;
  //     width: 117px;
  //   }
  // }
  .box {
    margin: 24px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mt20 {
    margin-top: 20px;
  }
  ::v-deep .el-textarea__inner {
    width: 520px;
  }
  .table_style {
    margin-top: 16px;
    ::v-deep .el-table th {
      line-height: 0;
      color: $sec_ft_color;
    }
    ::v-deep .el-table__row .el-input{
      width: 100% !important;
    }
  }
}
</style>