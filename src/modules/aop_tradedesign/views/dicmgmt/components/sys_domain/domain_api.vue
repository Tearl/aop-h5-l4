<template>
  <div class="aop_tradedesign_page_dicmgmt_sys_domain_api">
    <div class="create_content_wrapper">
      <div class="detail_content">
        <TableHeader
          title="领域关联API列表"
          :btnList="btnList"
          @btnClick="handleBtnClik"
        ></TableHeader>
        <Table
          :table="tables"
          @operate="operate"
          :data="dataList"
          rowK="apiId"
          :tableType="'selection'"
          @selectionChange="handleSelectionChange"
        ></Table>
      </div>
    </div>
    <!-- 添加示例 -->
    <PageDialog
      dialogTitle="API列表"
      :dialogVisiable="dialogVisible"
      dialogWidth="56.3%"
      @closeDialog="closeDialog"
      class="dialog"
    >
      <div slot="box">
        <SearchTop
          class="search_top"
          ref="formRef"
          :serviceForm="serviceForm"
          :form="form"
        >
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
        <Table
          ref="pageTableRef"
          :table="tables"
          @operate="operate"
          :data="pageApiList"
          rowK="apiId"
          :tableType="'selection'"
          @selectionChange="pageHandleSelectionChange"
        ></Table>
        <!-- 分页器 -->
        <PagePagination
          class="pn_style"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager="pager"
        >
        </PagePagination>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </PageDialog>

    <PageFooter>
      <div slot="box">
        <el-button @click="handleCancel">返 回</el-button>
        <!-- <el-button type="primary" @click="preservation">提 交</el-button> -->
      </div>
    </PageFooter>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import SearchTop from "@m/core/components/page_search_top"; // 搜索栏
import TableHeader from "@m/core/components/page_table_header";
import PageFooter from "@m/core/components/page_footer";
import { unduplicated } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    Table,
    SearchTop,
    TableHeader,
    PageFooter,
  },
  props: {
    domainId: {
      type: String,
      default: () => "",
    },
    arsId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      // 导航栏参数
      breadcrumbs: [],
      // 表格头部按钮
      btnList: [
        {
          name: "绑定API",
          value: "create",
          type: "primary",
          imgSrc: "",
          iconClass: "",
        },
        {
          name: "批量解绑",
          value: "delete",
          type: "primary",
          imgSrc: "",
          iconClass: "",
        },
      ],
      // 示例列表参数
      tables: [
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
          type: "textClick",
          operate: "check",
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
          width: "120",
          type: "text",
          tooltip: true,
        },
        {
          prop: "relySysName",
          label: "服务应用",
          width: "160",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiGroupName",
          label: "业务资产",
          width: "120",
          type: "text",
          tooltip: true,
        },
        {
          width: "100",
          label: "操作",
          type: "button",
          buttonList: [
            {
              desc: "解绑",
              operate: "del",
            },
          ],
        },
      ],
      // 示例列表信息
      dataList: [],
      pageApiList: [],
      //头部搜索
      serviceForm: [
        {
          type: "input",
          model: "apiName",
          placeholder: "API名称",
          style: {
            width: "200px",
          },
        },
        {
          type: "input",
          model: "apiCode",
          placeholder: "API编码",
          style: {
            width: "200px",
          },
        },
        {
          type: "select",
          model: "apiState",
          placeholder: "API状态",
          select: [
            { type: "未完成", value: "0" },
            { type: "已作废", value: "-1" },
            { type: "已完成", value: "1" },
            { type: "已发布", value: "2" },
          ],
          filterable: true,
        },
      ],
      // 搜索条件
      form: {
        apiName: "",
        apiCode: "",
        apiState: "",
      },
      // 点击搜索按钮后，记录搜索条件
      searchForm: {
        apiName: "",
        apiCode: "",
        apiState: "",
      },
      // 分页器参数
      pager: { currentPage: 1, turnPageShowNum: 10, total: 0 },
      dialogVisible: false,
      dialogTitle: "",
      type: "",
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      tableData: [],
      selectionData: [],
      selectApiList: [],
    };
  },
  methods: {
    handleCancel() {
      this.$emit("toDomainList");
    },
    // 添加示例
    async handleBtnClik(e) {
      if (e == "create") {
        this.dialogVisible = true;
        this.getPageList();
      } else {
        this.$confirm("是否批量解绑所选api").then(async () => {
          const params = this.selectApiList.map((item) => {
            return {
              apiId: item.apiId,
              domainId: this.domainId,
            };
          });
          const res = this.rpc.systemmgmt.delBindDomainApi(params);
          this.$notify({
            title: "成功",
            message: "批量解绑成功",
            duration: 2000,
            type: "success",
          });
        });
      }
    },
    handleSelectionChange(e) {
      this.selectApiList = e;
    },
    // 删除示例
    operate(operation, data) {
      if (operation == "del") {
        this.$confirm("是否解绑该api").then(async () => {
          const params = {
            apiId: data.apiId,
            domainId: this.domainId,
          };
          const res = await this.rpc.systemmgmt.delBindDomainApi(params);
          this.$notify({
            title: "成功",
            message: "解绑成功",
            duration: 2000,
            type: "success",
          });
        });
      }
    },
    // 获取列表
    async getList() {
      const data = {
        domainId: this.domainId,
      };
      const res = await this.rpc.systemmgmt.getDictExampleList(data);
      this.dataList = res.dictExampleList;
    },
    // 添加弹框确定
    async confirm() {
      const params = this.tableData.map((item) => {
        return {
          apiId: item.apiId,
          domainId: this.domainId,
        };
      });
      const res = this.rpc.systemmgmt.bindDomainApi(params);
      this.$notify({
        title: "成功",
        message: "绑定成功",
        duration: 2000,
        type: "success",
      });
      this.closeDialog();
      this.getList();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    async getPageList() {
      const params = {
        relySys: this.arsId,
        apiName: this.searchForm.apiName,
        apiCode: this.searchForm.apiCode,
        apiState: this.searchForm.apiState || "",
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
        releaseFlag: "0",
      };
      const res = await this.rpc.public.getApiManageList(params);
      this.pageApiList = res.apiList;
    },
    handleSizeChange(e) {
      this.isRecord = true;
      this.pager.turnPageShowNum = e + "";
      this.getPageList();
    },
    handleCurrentChange(e) {
      this.isRecord = true;
      this.getPageList();
    },
    search() {
      this.isRecord = true;
      this.pager.currentPage = "1";
      this.getParamsList();
    },
    // 初始化添加输入输出搜索栏
    reset() {
      this.pager.currentPage = "1";
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields();
      }
    },
    // tableData数据选中表格中
    isTableData() {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item) => {
          this.dictList.forEach((data) => {
            if (item.apiId == data.apiId) {
              this.isRecord = true;
              this.$refs.pageTableRef.$refs.tableRef.toggleRowSelection(data);
            }
          });
        });
      }
    },
    // 多选框选中
    pageHandleSelectionChange(e) {
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
    // 初始化
    init() {},
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_dicmgmt_sys_domain_api {
  .service_content {
    padding: 20px 24px 0;
  }
  .create_content_wrapper {
    padding: 16px 24px;
    .detail_content {
      background: $base_white;
      padding: 0 24px 24px;
      min-height: 78.5vh;
    }
  }
  .dialog .service_top {
    padding: 0;
  }
  .edit_form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 24px 0;
    @include form;
  }
  .search_top {
    padding: 0;
  }
}
</style>
