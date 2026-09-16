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
      :title="'L5服务列表'"
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
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import SearchTop from "@m/core/components/page_search_top";
import Table from "@m/core/components/page_table_workgate"; // 公共表格组件
import PagePagination from "@m/core/components/page_pagination";
import TableHeader from "@m/core/components/page_table_header";
import { getSessionStorage, setSessionStorage } from "@m/utils/localStorage.js";
export default {
  mixins: [mixin],
  components: {
    Table,
    SearchTop,
    PagePagination,
    TableHeader,
  },
  props: {
    dataSetNo: {
      type: String,
      default: ""
    },
    defaultActive:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      tableColumn: [
        {
          prop: "apiSeq",
          label: "服务编码",
          width: "200",
          type: "text",
        },
        {
          prop: "apiName",
          label: "服务名称",
          width: "200",
          type: "textClick",
          operate: "read"
        },
        {
          prop: "dataSetNm",
          label: "数据集名称",
          width: "160",
          type: "text",
        },
        {
          prop: "apiServiceType",
          label: "服务类型",
          width: "160",
          type: "textClassList",
          filter: "serType",
          textClassList: [
            { class: "self status", val: "D5自有服务" },
            { class: "change status", val: "D5直连服务" },
          ],
        },
        {
          prop: "apiDesc",
          label: "服务描述",
          width: "250",
          type: "text",
        },
        {
          label: "操作",
          width: "110",
          type: "button",
          buttonList: [
            {
              desc: "编辑",
              operate: "edit",
              relation: function (scope) {
                return scope.row.apiState == "0"
              }
            },
            {
              desc: "删除",
              operate: "del",
              relation: function (scope) {
                return scope.row.apiState == "0"
              }
            },
          ],
        },
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
        apiCode: ""
      },
      btnList: [
        {
          name: "新增服务",
          value: "create",
          type: "primary",
          imgSrc: "",
          iconClass: "el-icon-plus",
        },
      ],
       //列表分页器
       pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      beltLine:""
    };
  },
  methods: {
    init() {
      this.getList()
    },
    operate(operation, data) {
      console.log("operation, data",operation, data)
      if(operation == "read") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/L5serviceDetail",
          query: {
            apiId: data.apiId,
            dataSetNo: this.dataSetNo,
            type: "editDataSet",
            editDatasetType:this.defaultActive,
            beltLine:this.beltLine
          }
        })
      }else if(operation == "edit") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editServ",
          query: {
            apiId: data.apiId,
            dataSetNo: this.dataSetNo,
            editDatasetType:this.defaultActive,
            beltLine:this.beltLine
          }
        })
      }else if(operation == "del") {
        this.$confirm("是否删除该服务").then(async () => {
          const params = {
            apiId: data.apiId,
            dataSetNo: this.dataSetNo,
          };
          const res = await this.rpc.dicmgmt.delL5Serv(params);
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
        dataSetNo: this.dataSetNo,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
        beltLine:this.beltLine
      }
      const res =await this.rpc.dicmgmt.getDataSerList(params)
      this.servList = res.apiInfoList
      this.pager.total = res.turnPageTotalNum
    },
    search() {
      this.getList()
    },
    reset() {
      this.$refs.formRef.resetFields();
    },
    //点击新增按钮
    handleBtnClik(e) {
      this.$router.push({
        path: "/aop_tradedesign/dicmgmt/addServ",
        query:{
          editDatasetType:this.defaultActive,
          beltLine:this.beltLine
        }
      })
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
    this.init()
  },
  created(){
    this.beltLine = getSessionStorage("datasetBeltLine")
  }
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