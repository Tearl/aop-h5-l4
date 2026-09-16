<template>
  <div class="aop_tradecode_comps_decision_list">
    <PageDialog
      dialogTitle="绑定规则"
      :dialogVisiable="dialogVisible"
      dialogWidth="80%"
      @closeDialog="closeDialog"
      class="dialog"
      :apTobody="true"
    >
      <div slot="box">
        <div class="content">
          <div class="table_operate">
            <div class="header_content">
              <h1>绑定规则列表</h1>
            </div>
          </div>
          <Table
            ref="dictListTableRef"
            class="table_style"
            :table="tables"
            :data="dictList"
            @operate="operate"
          ></Table>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_editor_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    Table,
  },
  props: {
    currentInterfaceObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialogVisible: false,
      // 分段列表参数
      tables: [
        {
          prop: "decisionTreeSeq",
          label: "规则编号",
          type: "text",
          tooltip: true,
        },
        {
          prop: "decisionTreeName",
          label: "规则名称",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiName",
          label: "服务名称",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiSeq",
          label: "服务序号",
          type: "text",
          tooltip: true,
        },
      ],
      // 数据字典选择列表
      dictList: [],
    };
  },
  methods: {
    showDialog(queryId) {  
      this.dialogVisible = true;
      this.getList(queryId)
    },
    // 获取字典列表数据
    async getList(queryId) {
      const params = {
        queryId:queryId.aiId,
        idType:"1"
      };
      const res = await this.rpc.newEditor.checkBindDecisionList(params);
      this.dictList = res.l5AndDecisionTreeBos;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.dialog {
  ::v-deep.el-dialog {
    margin-top: 3vh !important;
  }
  ::v-deep.el-dialog__body {
    max-height: 78vh;
  }
}
</style>
