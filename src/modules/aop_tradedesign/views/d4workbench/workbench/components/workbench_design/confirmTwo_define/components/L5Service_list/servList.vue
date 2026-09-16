<template>
  <div class="aop_tradedesign_dic_comps_serve_list">
    <SearchTop ref="formRef" :serviceForm="serviceForm" :form="form">
      <div slot="rightButton">
        <el-button
          type="primary"
          size="small"
          @click="search"
          class="right_button"
          >搜索</el-button
        >
        <el-button size="small" @click="reset" class="right_button"
          >重置</el-button
        >
      </div>
    </SearchTop>
    <div class="content">
      <TableHeader
        :title="'服务列表'"
        :btnList="btnList"
        @btnClick="handleBtnClik"
      ></TableHeader>
      <Table
        class="table_style"
        :data="servList"
        :table="tableColumn"
        @operate="operate"
      ></Table>
      <!-- 分页器 -->
      <PagePagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pager="pager"
      >
      </PagePagination>
    </div>
    <ServDialog ref="servDialogRef"></ServDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import SearchTop from "@m/core/components/page_search_top";
import Table from "@m/core/components/page_table_workgate"; // 公共表格组件
import PagePagination from "@m/core/components/page_pagination";
import TableHeader from "@m/core/components/page_table_header";
import { getSessionStorage, setSessionStorage } from "@m/utils/localStorage.js";
import ServDialog from "./components/servDialog"; //添加服务弹框
export default {
  mixins: [mixin],
  components: {
    Table,
    SearchTop,
    PagePagination,
    TableHeader,
    ServDialog,
  },
  props: {
    dataSetNo: {
      type: String,
      default: "",
    },
    currentDatasetObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tableColumn: [
        {
          prop: "apiCode",
          label: "服务编码",
          width: "200",
          type: "text",
          operate: "read",
        },
        {
          prop: "apiName",
          label: "服务名称",
          width: "200",
          type: "textClick",
          operate: "read",
        },
        {
          prop: "version",
          label: "服务版本号",
          width: "160",
          type: "text",
        },
        // {
        //   prop: "apiServiceType",
        //   label: "所属服务分类",
        //   width: "160",
        //   type: "text",
        // },
        {
          prop: "apiDesc",
          label: "服务描述",
          width: "250",
          type: "text",
        },
        {
          prop: "apiState",
          label: "服务状态",
          width: "250",
          type: "textClassList",
          filter: "dataStatus",
          textClassList: [
            { class: "unpublish status", val: "0" },
            { class: "publishing status", val: "1" },
            { class: "unchecked status", val: "2" },
            // { class: "finished status", val: "04" },
          ],
        },
        // {
        //   label: "操作",
        //   width: "110",
        //   type: "button",
        //   buttonList: [
        //     {
        //       desc: "编辑",
        //       operate: "edit",
        //     },
        //     {
        //       desc: "删除",
        //       operate: "del",
        //     },
        //   ],
        // },
      ],
      servList: [],
      serviceForm: [
        {
          type: "input",
          model: "apiName",
          placeholder: "请输入",
          labelText: "服务名称:",
        },
        {
          type: "input",
          model: "apiCode",
          placeholder: "请输入",
          labelText: "服务编码:",
        },
      ],
      form: {
        apiName: "",
        apiCode: "",
      },
      btnList: [
        // {
        //   name: "新增服务",
        //   value: "create",
        //   type: "primary",
        //   imgSrc: "",
        //   iconClass: "el-icon-plus",
        // },
      ],
      //列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
    };
  },
  methods: {
    init() {
      console.log(this.currentDatasetObj, "L5服务");
      this.getList();
    },
    operate(operation, data) {
      console.log("operation, data", operation, data);
      if (operation == "read") {
        this.$emit("servDetail", data);
      } else if (operation == "edit") {
        this.$refs.servDialogRef.showDialog(data);
      } else if (operation == "del") {
        this.$confirm("是否删除该服务").then(async () => {
          const params = {
            apiId: data.apiId,
            dataSetNo: this.dataSetNo || this.currentDatasetObj.dataSetNo,
          };
          const res = await this.rpc.dicmgmtDefine.delL5Serv(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getList();
        });
      }
    },
    async getList() {
      const params = {
        ...this.form,
        dataSetNo: this.currentDatasetObj.dataSetNo,
        // dataSetNo: "FM-SJJ-108922",
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const res = await this.rpc.dicmgmtDefine.getServList(params);
      this.servList = res.apiInfoList;
      this.pager.total = res.turnPageTotalNum;
    },
    search() {
      this.getList();
    },
    reset() {
      this.$refs.formRef.resetFields();
    },
    //点击新增按钮
    handleBtnClik(e) {
      this.$refs.servDialogRef.showDialog();
      // this.$router.push({
      //   path: "/aop_tradedesign/dicmgmt/addServ",
      // })
    },
    // 每页条数改变时
    handleSizeChange(turnPageShowNum) {
      this.pager.turnPageShowNum = turnPageShowNum + "";
      this.getList();
    },
    // 当前页改变时
    handleCurrentChange() {
      this.getList();
    },
  },
  mounted() {
    // this.init()
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_comps_serve_list {
  .content {
    background: $base_white;
    padding: 12px 24px;
  }
}
</style>