<template>
  <div class="aop_workgate_comps_systemmgmt_dic_form_enumerate">
    <div class="input_wrapper">
      <div class="top_right_create" v-if="bizType == 'edit'">
        <el-button type="primary" icon="el-icon-plus" @click="showDialog('enumerate')"
          >添加服务</el-button
        >
      </div>
      <Table
        class="table_style"
        :data="servList"
        :table="tableColumn"
        @operate="operate"
      ></Table>
    </div>
    <!-- <AddService
      ref="servRef"
      @confirmParams="confirmServ"
    ></AddService> -->
  </div>
</template>

<script>
import Table from "@m/core/components/page_table";
// import AddService from "../dialog/add/addService";
export default {
  components: {
    Table,
    // AddService,
  },
  props: {
    bizType: {
      type: String,
      default: () => "edit",
    },
    servList: {
      type: Array,
      default: () => [],
    },
    // 数据集信息
    infoData: {
      type: String,
      default: () => {},
    },
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tableColumn: [
        {
          prop: "apiName",
          label: "服务名称",
          minWidth: "25%",
          type: "textClick",
          operate: "read"
        },
        {
          prop: "apiCode",
          label: "服务编码",
          minWidth: "25%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "version",
          label: "版本号",
          minWidth: "15%",
          type: "text",
        },
        {
          prop: "apiDesc",
          label: "服务描述",
          minWidth: "25%",
          type: "text",
          tooltip: true,
        },
      ],
    };
  },
  methods: {
    operate(op, data) {
      if(op == "read") {
        this.$emit("detailClick",data)
      }
    },
    showDialog(type, data) {
      this.$refs.servRef.showDialog("add")
    },
    // 弹框关闭时
    closeDialog() {
      this.$refs.enumerateValueFormRef.resetFields();
      this.enumerateValueVisible = false;
    },
    confirmServ() {

    },
    // 确定保存
    confirm() {
      this.$refs.enumerateValueFormRef.validate((valid) => {
        if (!valid) return;
        if (this.dialogTitle == "添加规则说明") {
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
  },
  created() {
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_systemmgmt_dic_form_enumerate {
  .top_right_create {
    ::v-deep .el-button {
      @include large_button_common;
      width: 117px;
    }
  }
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
  }
}
</style>