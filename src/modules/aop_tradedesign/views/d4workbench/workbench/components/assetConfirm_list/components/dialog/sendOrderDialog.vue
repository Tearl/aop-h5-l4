<template>
  <div class="aop_tradedesign_service_confirm_page">
    <PageDialog
      :dialogWidth="'90%'"
      :dialogTitle="'数据集及L5确认凭证'"
      :dialogVisiable="dialogVisible"
      @closeDialog="dialogVisible = false"
      class="create_dialog"
    >
      <div slot="box">
        <div class="form_content">
          <el-form
            ref="form"
            :model="form"
            label-width="110px"
            size="mini"
            :inline="true"
          >
            <el-form-item label="生产开始日期：">
              <el-date-picker
                v-model="form.value"
                type="date"
                placeholder="选择生产开始日期"
              >
              </el-date-picker>
            </el-form-item>
            <div class="data_pocker_content">至</div>
            <el-form-item label="生产结束日期：">
              <el-date-picker
                v-model="form.value1"
                type="date"
                placeholder="选择生产结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="被授权人：">
              <el-input
                size="small"
                class="input"
                v-model="form.content"
                clearable
              >
                <span slot="suffix" class="text" @click.stop="openDialog"
                  >添加成员</span
                >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="dataList">
          <div class="title">数据集确认项</div>
          <Table
            class="table_style"
            :data="dataList"
            :table="tableColumn"
            @operate="operate"
          ></Table>
        </div>
        <div class="service">
          <div class="title">L5服务确认项</div>
          <Table
            class="table_style"
            :data="serviceList"
            :table="servTableColumn"
            @operate="operate"
          ></Table>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click.native="confirm">提 交</el-button>
        <el-button @click.native="dialogVisible = false">关 闭</el-button>
      </div>
    </PageDialog>
    <SelectPersonDialog ref="selectPersonDialogRef" @savePerson="savePerson"></SelectPersonDialog>
  </div>
</template>
<script>
import PageDialog from "@m/core/components/page_dialog";
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import SelectPersonDialog from "./selectPersonDialog";

export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    ServiceTop,
    SelectPersonDialog
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        content: "",
        value: "",
        value1: "",
      },
      dataList: [{ transCd: "单笔转账提交" }],
      tableColumn: [
        {
          prop: "transCd",
          label: "是否新增数据集",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "数据集名称",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "是否新增数据分段",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "数据分段",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "是否新增数据字段",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "数据名称",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "设计者",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "业务确认人",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "业务确认时间",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
      ],
      serviceList: [{ transCd: "单笔转账提交" }],
      servTableColumn: [
        {
          prop: "transCd",
          label: "服务变更类型",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "服务名称",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "归属数据集",
          //   width: "180",
          type: "text",
          tooltip: true,
        },

        {
          prop: "transCd",
          label: "变更原因",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "备注",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "创建人",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "业务确认人",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "transCd",
          label: "业务确认时间",
          //   width: "180",
          type: "text",
          tooltip: true,
        },
      ],
    };
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
    },
    openDialog(){
      this.$refs.selectPersonDialogRef.showDialog();
    },
    savePerson(data){
      this.form.content = data.dictNo
    },
    confirm() {
      this.dialogVisible = false;
      this.$router.back();
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_service_confirm_page {
  .dialog_title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    color: #131313;
    font-size: 16px;
  }
  .title {
    display: flex;
    margin: 10px 0px;
    justify-content: center;
    align-items: center;
  }
  .form_content {
    display: flex;
    align-items: center;
  }
  .data_pocker_content {
    display: inline-block;
    margin: 4px 10px;
  }
  .el-form {
    ::v-deep .el-form-item {
      .text {
        color: $theme_color;
        cursor: pointer;
      }
    }
  }
}
</style>
