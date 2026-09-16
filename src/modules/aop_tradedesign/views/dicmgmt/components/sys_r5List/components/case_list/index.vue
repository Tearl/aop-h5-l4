<template>
  <div class="aop_tradedesign_comps_apimgmt_case_list">
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
        title="Mock管理"
        :btnList="pageType == 'read' ? [] : btnList"
        @btnClick="handleBtnClik"
      ></TableHeader>

      <Table
        class="table"
        :data="dataList"
        :table="tableColumn"
        @operate="operate"
        :treeProps="{ children: 'caseList' }"
        :rowK="'caseId'"
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
import filters from "@m/utils/filters";
import SearchTop from "@m/core/components/page_search_top"; // 头部搜索栏
import TableHeader from "@m/core/components/page_table_header";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import PageDialog from "@m/core/components/page_dialog";
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
    arsId: {
      type: String,
      default: () => "",
    },
    type: {
      type: String,
      default: () => "view",
    },
    pageType: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      //头部搜索
      serviceForm: [
        {
          type: "input",
          model: "caseName",
          placeholder: "Mock名称",
          style: {
            width: "160px",
          },
        },
        {
          type: "input",
          model: "caseSeq",
          placeholder: "MockID",
          style: {
            width: "160px",
          },
        },
        {
          type: "input",
          model: "caseCreateUser",
          placeholder: "创建人",
          style: {
            width: "160px",
          },
        },
        // {
        //   type: "select",
        //   model: "positiveAndNegative",
        //   placeholder: "Mock类型",
        //   select: [
        //     { type: "正Mock", value: "0" },
        //     { type: "反Mock", value: "1" },
        //   ],
        //   filterable: true,
        // },
      ],
      // 搜索条件
      form: {
        caseName: "",
        caseSeq: "",
        caseCreateUser: "",
        positiveAndNegative: "",
      },
      // 点击搜索按钮后，记录搜索条件
      searchForm: {
        caseName: "",
        caseSeq: "",
        caseCreateUser: "",
        positiveAndNegative: "",
      },
      //按钮列表
      btnList: [
        {
          name: "新增Mock",
          value: "addCase",
          type: "primary",
          imgSrc: "",
          iconClass: "",
        },
      ],
      // 数据列表
      dataList: [],
      // 列表参数
      tableColumn: [
        {
          prop: "caseSeq",
          label: "MockID",
          width: "220",
          type: "text",
        },
        {
          prop: "caseName",
          label: "Mock名称",
          width: "220",
          type: "textClick",
          operate: "detail",
          tooltip: true,
        },
        {
          prop: "caseLevel",
          label: "优先级",
          width: "70",
          type: "text",
        },
        {
          prop: "caseDesc",
          label: "Mock描述",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "caseCreateName",
          label: "创建人",
          width: "90",
          type: "text",
        },
        {
          prop: "caseCreateTime",
          label: "创建时间",
          width: "170",
          type: "text",
          filter: "crtTm_yyyyMMddhhmmss",
        },
        {
          prop: "action",
          label: "操作",
          width: "220",
          fixed: "right",
          type: "button",
          buttonList: [
            {
              desc: "测试",
              operate: "test",
            },
            {
              desc: "新增反Mock",
              operate: "add",
              relation: function (scope) {
                return scope.row.positiveAndNegative === "0";
              },
            },
            {
              desc: "编辑",
              operate: "mod",
            },
            {
              desc: "复制",
              operate: "copy",
            },
            {
              desc: "删除",
              operate: "del",
            },
          ],
        },
      ],
      // 分页器参数
      pager: { currentPage: 1, turnPageShowNum: 10, total: 0 },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // this.getColumn();
      this.getList();
    },
    operate(operation, data) {
      if (operation == "mod") {
        this.modCase(data);
      } else if (operation == "del") {
        this.del(data);
      } else if (operation == "add") {
        this.add(data);
      } else if (operation == "test") {
        this.goTest(data);
      } else if (operation == "apiDetail") {
        this.goApiDetail(data);
      } else if (operation == "copy") {
        this.goCopy(data);
      } else {
        this.goDetail(data);
      }
    },
    //更改页码条数
    handleSizeChange(turnPageShowNum) {
      this.pager.turnPageShowNum = turnPageShowNum;
      this.getList();
    },
    //更改当前页
    handleCurrentChange() {
      this.getList();
    },
    //获取数据
    async getList() {
      const params = {
        caseName: this.searchForm.caseName,
        caseSeq: this.searchForm.caseSeq,
        caseCreateUser: this.searchForm.caseCreateUser,
        positiveAndNegative: this.searchForm.positiveAndNegative,
        sceneId: this.sId,
        apiId: this.apiId,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      let api = "";
      if (this.sId == "" && this.apiId == "") {
        api = "getUpCaseList";
        params.arsId = this.arsId;
        params.serviceType =
          this.type == "view" ? "" : this.type == "api" ? "直连L5服务|自有L5服务" : "4B服务";
      } else {
        api = "pageGetApiCaseList";
      }
      const res = await this.rpc.apimgmt[api](params);
      this.dataList = res.newInnerCaseList;
      this.pager.total = res.turnPageTotalNum * 1;
    },
    getColumn() {
      if (this.type !== "view") {
        this.tableColumn = [
          {
            prop: "caseSeq",
            label: "MockID",
            width: "220",
            type: "text",
          },
          {
            prop: "caseName",
            label: "Mock名称",
            width: "220",
            type: "textClick",
            operate: "detail",
            tooltip: true,
          },
          {
            prop: "caseLevel",
            label: "优先级",
            width: "70",
            type: "text",
          },
          {
            prop: "sgName",
            label: "所属业务资产",
            width: "150",
            type: "text",
            tooltip: true,
          },
          {
            prop: "caseServiceName",
            label: "所属API",
            width: "150",
            type: "textClick",
            operate: "apiDetail",
            tooltip: true,
          },
          {
            prop: "caseDesc",
            label: "Mock描述",
            width: "200",
            type: "text",
            tooltip: true,
          },
          {
            prop: "caseCreateName",
            label: "创建人",
            width: "90",
            type: "text",
          },
          {
            prop: "caseCreateTime",
            label: "创建时间",
            width: "170",
            type: "text",
            filter: "crtTm_yyyyMMddhhmmss",
          },
          {
            prop: "action",
            label: "操作",
            width: "220",
            fixed: "right",
            type: "button",
            buttonList: [
              {
                desc: "测试",
                operate: "test",
              },
              {
                desc: "新增反Mock",
                operate: "add",
                relation: function (scope) {
                  return scope.row.positiveAndNegative === "0";
                },
              },
              {
                desc: "编辑",
                operate: "mod",
              },
              {
                desc: "复制",
                operate: "copy",
              },
              {
                desc: "删除",
                operate: "del",
              },
            ],
          },
        ];
      } else {
        this.tableColumn = [
          {
            prop: "caseSeq",
            label: "MockID",
            width: "220",
            type: "text",
          },
          {
            prop: "caseName",
            label: "Mock名称",
            width: "220",
            type: "textClick",
            operate: "detail",
            tooltip: true,
          },
          {
            prop: "caseLevel",
            label: "优先级",
            width: "70",
            type: "text",
          },
          {
            prop: "caseDesc",
            label: "Mock描述",
            width: "200",
            type: "text",
            tooltip: true,
          },
          {
            prop: "caseCreateName",
            label: "创建人",
            width: "90",
            type: "text",
          },
          {
            prop: "caseCreateTime",
            label: "创建时间",
            width: "170",
            type: "text",
            filter: "crtTm_yyyyMMddhhmmss",
          },
          {
            prop: "action",
            label: "操作",
            width: "220",
            fixed: "right",
            type: "button",
            buttonList: [
              {
                desc: "测试",
                operate: "test",
              },
              {
                desc: "新增反Mock",
                operate: "add",
                relation: function (scope) {
                  return scope.row.positiveAndNegative === "0";
                },
              },
              {
                desc: "编辑",
                operate: "mod",
              },
              {
                desc: "复制",
                operate: "copy",
              },
              {
                desc: "删除",
                operate: "del",
              },
            ],
          },
        ];
      }
    },
    //搜索
    search() {
      Object.assign(this.searchForm, this.form);
      this.pager.currentPage = 1;
      this.getList();
    },
    //重置
    reset() {
      this.$refs.formRef.resetFields();
    },
    //点击按钮
    handleBtnClik(e) {
      if (e == "addCase") {
        this.addCase();
      }
    },
    del(e) {
      this.$confirm("是否删除该Mock，名称为" + e.caseName)
        .then(async () => {
          const params = {
            caseId: e.caseId,
          };
          const res = await this.rpc.apimgmt.delApiCase(params);
          this.$notify({
            title: "成功",
            message: "删除成功！",
            duration: 2000,
            type: "success",
          });
          this.getList();
        })
        .catch(() => {});
    },
    add(e) {
      if (e.caseId === "") return;
      this.$emit("toAddRevCase", e.caseId);
    },
    addCase(e) {
      this.$emit("toAddCase", this.apiId);
    },
    modCase(e) {
      if (e.caseId === "") return;
      this.$emit("toModCase", e.caseId);
    },
    goCopy(e) {
      if (e.caseId === "") return;
      this.$emit("toCopyCase", e.caseId);
    },
    goDetail(e) {
      if (e.caseId === "") return;
      this.$emit("toCaseDetail", e.caseId, e.positiveAndNegative);
    },
    goApiDetail(e) {
      if (e.apiId === "") return;
      this.$emit("toApiView", e.apiId);
    },
    // 测试
    goTest(e) {
      if (e.caseId === "") return;
      this.$emit("toCaseTest", e.caseId);
    },
  },
  watch: {
    sId(n, o) {
      this.init();
    },
    arsId(n, o) {
      this.init();
    },
    apiId(n, o) {
      this.init();
    },
  },
  filters: {
    ...filters,
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_case_list {
  .content_wrapper {
    position: relative;
    background: $base_white;
    padding: 0 24px 24px;
  }
  .pn_style {
    text-align: center;
  }
}
</style>
