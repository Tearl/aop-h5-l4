<template>
  <div class="aop_tradedesign_comps_dicmgmt_sys_domain_list">
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

    <div class="content_wrapper">
      <TableHeader
        title="领域管理列表"
        :btnList="btnList"
        @btnClick="handleBtnClik">
      </TableHeader>

      <Table
        class="table"
        :data="dataList"
        :table="tableColumn"
        @operate="operate"
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
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import SearchTop from "@m/core/components/page_search_top"; // 头部搜索栏
import TableHeader from "@m/core/components/page_table_header";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";

export default {
  mixins: [mixin],
  components: {
    SearchTop,
    TableHeader,
    Table,
    PagePagination,
  },
  props: {
    arsId: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      // 领域ID
      domainId: "",
      //头部搜索
      serviceForm: [
        {
          type: "input",
          model: "domainNo",
          placeholder: "搜索领域名称",
          style: {
            width: "260px",
          },
        },
        {
          type: "input",
          model: "domainNm",
          placeholder: "搜索领域中文名称",
          style: {
            width: "260px",
          },
        }
      ],
      // 搜索条件
      form: {
        domainNo: "", // 领域名称
        domainNm: "", // 领域中文名称
      },
      // 点击搜索按钮后，记录搜索条件
      searchForm: {
        domainNo: "", // 领域名称
        domainNm: "", // 领域中文名称
      },
      // 表格头部按钮
      btnList: [
        {
          name: "新增领域",
          value: "create",
          type: "primary",
          imgSrc: "",
          iconClass: "",
          style: {
            width: "500px",
          },
        },
      ],
      // 数据列表
      dataList: [],
      // 列表参数
      tableColumn: [
        {
          prop: "domainCd",
          label: "领域名称",
          width: "180",
          type: "text",
          tooltip: true,
        },
        {
          prop: "domainNm",
          label: "领域中文名称",
          width: "180",
          type: "textClick",
          operate: "read",
          tooltip: true,
        },
        {
          prop: "domainDesc",
          label: "领域描述",
          width: "300",
          type: "text",
        },
        {
          label: "操作",
          width: "125",
          fixed: 'right',
          type: "button",
          buttonList: [
            {
              desc: "编辑",
              operate: "edit",
              // relation: function (scope) {
              //   return scope.row.editBtn == "1";
              // },
            },
            {
              desc: "删除",
              operate: "del",
              // relation: function (scope) {
              //   return scope.row.cancelBtn == "1";
              // },
            },
          ],
        },
      ],
      // 分页器参数
      pager: { currentPage: "1", turnPageShowNum: "10", total: 0 },
    };
  },
  methods: {
    operate(operation, data) {
      console.log(operation, data)
      if (operation == "read") {
        console.log("查看")
        this.$emit("toDomainDetail",data.domainId)
        // this.$router.push({
        //   path: "/aop_service/domainmgmt/detail",
        //   query: {
        //     domainId: data.domainId,
        //   },
        // });
      } else if (operation == "edit") {
        this.$emit("toDomainEdit",data.domainId)
        // this.$router.push({
        //   path: "/aop_service/domainmgmt/edit",
        //   query: {
        //     domainId: data.domainId,
        //     pageType: "edit",
        //   },
        // });
      } else if (operation == "del") {
        this.$confirm("确定要删除吗？").then(async () => {
          const params = { domainId: data.domainId };
          const res = await this.rpc.systemmgmt.deleteDomainInfoByDomainId(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getDomainManagementList();
        });
      }
    },
    handleBtnClik(e) {
      this.$emit("toDomainAdd")
      // this.$router.push({
      //   path: "/aop_service/domainmgmt/edit",
      //   query: {
      //     pageType: "create"
      //   }
      // });
    },
    //更改页码条数
    handleSizeChange(turnPageShowNum) {
      this.pager.turnPageShowNum = turnPageShowNum;
      this.getDomainManagementList();
    },
    //更改当前页
    handleCurrentChange() {
      this.getDomainManagementList();
    },
    //搜索
    search() {
      Object.assign(this.searchForm, this.form);
      this.pager.currentPage = "1";
      // this.getList();
      this.getDomainManagementList();
    },
    //重置
    reset() {
      this.$refs.formRef.resetFields();
    },
    async getDomainManagementList() {
      const params = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        arsId: this.arsId,
        domainNo: this.form.domainNo,
        domainNm: this.form.domainNm,
      };
      const res = await this.rpc.systemmgmt.getDomainManagementList(params);
      this.dataList = res.domainList;
      this.pager.total = res.turnPageTotalNum * 1;
    },
    // 初始化
    init() {
      this.getDomainManagementList()
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_sys_domain_list {
  // padding: 20px 24px;
  .content_wrapper {
    background: $base_white;
    padding: 0 24px 24px;
  }
  .pn_style {
    text-align: center;
  }
}
</style>    