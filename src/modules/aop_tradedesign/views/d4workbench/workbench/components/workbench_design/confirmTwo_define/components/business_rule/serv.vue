<template>
  <div class="aop_workgate_comps_apimgmt_api_view_api_flow_serv">
    <div class="service_content_container">
      <div class="service_content_bottom">
        <TableHeader
          :title="'关联服务列表'"
          :btnList="btnAuth ? btnList : []"
          @btnClick="handleBtnClik"
          v-if="type == 'inDetail'"
        ></TableHeader>
        <Table
          class="table"
          :data="dataList"
          :table="tableColumn"
          @operate="operate"
        ></Table>
      </div>
    </div>

    <!-- 选择API -->
    <PageDialog
      :dialogWidth="'56.3%'"
      dialogTitle="关联服务"
      :dialogVisiable="dialogVisiable"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <SearchTop
          ref="formRef"
          :serviceForm="serviceForm"
          :form="form"
          @service="search"
          @reset="reset"
          class="search_top"
        ></SearchTop>
        <Table
          ref="selectTableRef"
          :data="pageDataList"
          :table="pageTableColumn"
          tableType="selection"
          rowK="apiId"
          @selectionChange="handleSelectionChange"
        ></Table>
        <PagePagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager="pager"
        >
        </PagePagination>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveDialog">保存</el-button>
      </div>
    </PageDialog>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import SearchTop from "@m/core/components/page_search_top"; // 头部搜索栏
import TableHeader from "@m/core/components/page_table_header";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import PageDialog from "@m/core/components/page_dialog";
import { unduplicated } from "@m/utils/array";
export default {
  mixins: [mixin],
  components: {
    SearchTop,
    TableHeader,
    Table,
    PagePagination,
    PageDialog,
  },
  props: {
    sId: {
      type: String,
      default: () => "",
    },
    apiId: {
      type: String,
      default: () => "",
    },
    type: {
      type: String,
      default: () => "",
    },
    btnAuth: {
      type: Boolean,
      default: () => false,
    },
    currentD4bObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      //按钮列表
      btnList: [
        {
          name: "关联服务",
          value: "bind",
          type: "primary",
          imgSrc: "",
          iconClass: "el-icon-plus",
        },
      ],
      // 数据列表
      dataList: [],
      // 列表参数
      tableColumn: [
        {
          prop: "apiSeq",
          label: "API ID",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiName",
          label: "API名称",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiCode",
          label: "API编码",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiServiceType",
          label: "服务类型",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "relySysName",
          label: "服务系统",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiGroupName",
          label: "API分组",
          width: "120",
          type: "text",
          tooltip: true,
        },
        {
          prop: "mockCaseNum",
          label: "案例数",
          width: "120",
          type: "text",
          align: "center",
        },
        // {
        //   prop: "caseSeq",
        //   label: "服务ID",
        //   width: "220",
        //   type: "text",
        // },
        // {
        //   prop: "caseName",
        //   label: "服务名称",
        //   width: "220",
        //   type: "textClick",
        //   operate: "detail",
        //   tooltip: true,
        // },
        // {
        //   prop: "caseDesc",
        //   label: "服务描述",
        //   width: "200",
        //   type: "text",
        //   tooltip: true,
        // },
        // {
        //   prop: "caseCreateName",
        //   label: "创建人",
        //   width: "90",
        //   type: "text",
        // },
        // {
        //   prop: "caseCreateTime",
        //   label: "创建时间",
        //   width: "170",
        //   type: "text",
        //   filter: "crtTm_yyyyMMddhhmmss",
        // },
      ],
      // 分页器参数
      pager: { currentPage: 1, turnPageShowNum: 10, total: 0 },

      // 弹框
      dialogVisiable: false,
      //头部搜索
      serviceForm: [
        {
          type: "input",
          model: "apiName",
          placeholder: "API名称",
          style: {
            width: "240px",
          },
        },
        {
          type: "input",
          model: "apiCode",
          placeholder: "API编码",
          style: {
            width: "240px",
          },
        },
      ],
      // 搜索条件
      form: {
        apiName: "",
        apiCode: "",
        apiState: "2",
      },
      // 点击搜索按钮后，记录搜索条件
      searchForm: {
        apiName: "",
        apiCode: "",
        apiState: "2",
      },
      // 数据列表
      pageDataList: [],
      // 列表参数
      pageTableColumn: [
        {
          prop: "apiSeq",
          label: "API ID",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiName",
          label: "API名称",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiCode",
          label: "API编码",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiServiceType",
          label: "服务类型",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "relySysName",
          label: "服务系统",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiGroupName",
          label: "API分组",
          width: "120",
          type: "text",
          tooltip: true,
        },
        {
          prop: "mockCaseNum",
          label: "案例数",
          width: "120",
          type: "text",
          align: "center",
        },
      ],
      isRecord: false,
      selectionData: [],
      tableData: [],
      fnctId: ""
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.fnctId = this.$route.query.fnctId
      // this.getList();
    },
    operate(operation, data) {},
    //获取数据
    async getList() {
      const params = {
        fnctId: this.fnctId,
        svcId: this.currentD4bObj.svcId,
        svcStsCd: this.currentD4bObj.svcRlsFlg,
        dsgnFlg: this.currentD4bObj.dsgnFlg,
      };
      const res = await this.rpc.d4.getD4bRelatedServiceList(params)
      this.dataList = res.apiList;
      // const params = {
      //   apiId: this.apiId,
      // };
      // const res = await this.rpc.public.getServList({apiId: this.apiId})
      // this.dataList = res.apiList;
    },
    async handleBtnClik(e) {
      if(e == "bind") {
        this.dialogVisiable = true
        this.pageGetList()
      }
    },
    // 弹框
    //更改页码条数
    handleSizeChange(turnPageShowNum) {
      this.isRecord = true;
      this.pager.turnPageShowNum = turnPageShowNum;
      this.pageGetList();
    },
    //更改当前页
    handleCurrentChange() {
      this.isRecord = true;
      this.pageGetList();
    },
    //获取数据
    async pageGetList() {
      const params = {
        apiName: this.form.apiName,
        apiCode: this.form.apiCode,
        apiState: this.form.apiState || "2",
        apiServiceType: "D5直连服务|D5自有服务",
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const res = await this.rpc.public.getApiManageList(params);
      this.pageDataList = res.apiList;
      this.$nextTick(() => {
        this.isTableData()
      })
      this.pager.total = res.turnPageTotalNum * 1;
    },
    //搜索
    search() {
      this.isRecord = true;
      Object.assign(this.searchForm, this.form);
      this.pager.currentPage = 1;
      this.pageGetList();
    },
    //重置
    reset() {
      this.$refs.formRef.resetFields();
    },
    closeDialog() {
      this.dialogVisiable = false
      this.reset()
      this.selectionData = []
      this.tableData = []
    },
    async saveDialog() {
      const params = {
        D4ApiId: this.apiId,
        D5ApiIdList: []
      }
      this.tableData.forEach((item) => {
        params.D5ApiIdList.push({apiId: item.apiId})
      })
      const res = await this.rpc.public.releServ(params)
      this.$notify({
        title: "成功",
        message: "关联成功！",
        duration: 2000,
        type: "success",
      });
      this.closeDialog()
      this.getList()
    },
    handleSelectionChange(e) {
      if (!this.isRecord && this.selectionData.length > e.length) {
        this.selectionData.forEach((item) => {
          if (e.indexOf(item) == -1) {
            this.tableData = this.tableData.filter(
              (it) => it.apiId != item.apiId
            );
          }
        });
      } else {
        this.tableData.push(...e);
        this.tableData = unduplicated(this.tableData, "apiId");
      }
      this.selectionData = e;
      this.isRecord = false;
    },
    // tableData数据选中表格中
    isTableData() {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item) => {
          this.pageDataList.forEach((data) => {
            if (item.apiId == data.apiId) {
              this.isRecord = true;
              this.$refs.selectTableRef.$refs.tableRef.toggleRowSelection(
                data
              );
            }
          });
        });
      }
    },
  },
  filters: {
    ...filters,
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_apimgmt_api_view_api_flow_serv {
  .service_content_container {
    .service_content_bottom {
      background: $base_white;
      // padding: 0 24px 24px;
      margin-bottom: 20px;
    }
  }
  .search_top {
    padding: 0;
  }
}
</style>
