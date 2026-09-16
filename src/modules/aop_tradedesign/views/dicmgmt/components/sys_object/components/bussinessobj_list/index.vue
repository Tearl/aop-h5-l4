<template>
  <div class="aop_tradedesign_comps_dicmgmt_bussinessobj_list">
    <TableHeader
      title="业务对象管理"
      :btnList="btnList"
      @btnClick="handleBtnClik"
    ></TableHeader>

    <Table
      :table="tables"
      @operate="operate"
      :data="bussinessobjList"
    ></Table>
    <!-- 分页器 -->
    <PagePagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :pager="pager"
    >
    </PagePagination>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import TableHeader from "@m/core/components/page_table_header";
import { getSessionStorage } from "@m/utils/localStorage";
export default {
  mixins: [mixin],
  props: {
    searchForm: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    TableHeader,
  },
  data() {
    return {
      // 字典列表参数
      tables: [
        {
          prop: "bsnObjId",
          label: "业务对象ID",
          width: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "bsnObjNm",
          width: "150",
          label: "业务对象名称",
          type: "textClick",
          operate: "detail",
          tooltip: true,
        },
        {
          prop: "bsnObjCd",
          width: "160",
          label: "业务对象英文名称",
          type: "text",
          tooltip: true,
        },
        {
          prop: "bsnObjDesc",
          width: "160",
          label: "业务对象描述",
          type: "text",
          tooltip: true,
        },
        {
          prop: "servType",
          width: "130",
          label: "服务类型",
          type: "text",
          tooltip: true,
        },
        {
          prop: "domainNm",
          width: "150",
          label: "所属领域",
          type: "text",
          tooltip: true,
        },
        {
          width: "100",
          label: "操作",
          type: "button",
          fixed: "right",
          buttonList: [
            {
              desc: "编辑",
              operate: "edit",
              relation: function (scope) {
                return !scope.row.dictryPid;
              },
            },
            {
              desc: "删除",
              operate: "delete",
            },
          ],
        },
      ],
      //字典数据集合
      bussinessobjList: [],
      // 列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      //控制迁移数据对话框显示或隐藏
      transferVisible: false,
      // 选中的数据
      selectedData: [],
      // 查看验证规则弹框
      ruleDetailsDialogVisible: false,
      // 查看验证规则详情表单
      detailsData: [],
      // 表格头部按钮
      btnList: [
        {
          name: "创建业务对象",
          value: "create",
          type: "primary",
          imgSrc: "",
          iconClass: "el-icon-plus",
        },
      ],
      //导出数据
      isExportPop: false,
      // 批量删除提示弹框
      isMultipleDeletePop: false,
      sysId: ""
    };
  },
  methods: {
    //操作
    async operate(operation, data) {
      if (operation == "delete") {
        this.$confirm("确定要删除吗？").then(async () => {
          const params = { bsnObjId: data.bsnObjId };
          const res = await this.rpc.systemmgmt.deleteBussinessobj(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          if (this.bussinessobjList.length <= 1) {
            this.pager.currentPage = "1";
          }
          this.getList();
        });
      } else if (operation == "detail") {
        this.$emit("toObjDetail",data.bsnObjId)
      } else if (operation == "edit") {
        this.$emit("toModObj",data.bsnObjId)
      }
    },
    // 获取字典列表数据
    async getList() {
      data = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        ... this.searchForm,
        sysId: this.sysId,
        servType: getSessionStorage("workgate-servType")
      };
      const res = await this.rpc.systemmgmt.getBussinessobjList(data);
      this.bussinessobjList = res.bsnObjList
      this.pager.total = res.turnPageTotalNum * 1;
    },
    // 每页条数改变时
    handleSizeChange(e) {
      this.pager.turnPageShowNum = e;
      this.getList();
    },
    // 当前页改变时
    handleCurrentChange(e) {
      this.getList();
    },
    // 点击创建按钮，跳转页面到创建字典页面
    newDictionary() {
      this.$emit("toAddObj")
    },
    //点击btnList里的按钮
    handleBtnClik(btn) {
      switch (btn) {
        case "create":
          this.newDictionary();
          return;
        default:
          return;
      }
    },
    // 多选框变化时
    handleSelectionChange(e) {
      this.selectedData = e;
    },
    // 子参数没有多选框
    dictListCellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.dictryPid !== "" && column.type === "selection") {
        return { visibility: "hidden" };
      }
    },
    // 初始化
    init() {
      this.sysId = this.$route.query.sysId
      // this.getList();
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_bussinessobj_list {
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }
}
</style>
