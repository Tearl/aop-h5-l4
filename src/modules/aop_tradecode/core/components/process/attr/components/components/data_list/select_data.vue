<template>
  <div class="aop_workgate_comps_systemmgmt_data_list_mgmt_list">
    <PageDialog
      :dialogWidth="'56.3%'"
      :dialogTitle="'选择数据集'"
      :dialogVisiable="dialogVisible"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <SearchTop
          ref="formRef"
          :serviceForm="serviceForm"
          :form="form"
          class="search_top"
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
        <div class="content_wrapper">
          <!-- <TableHeader
        title="数据集管理"
        :btnList="btnList"
        @btnClick="handleBtnClik"
      ></TableHeader> -->

          <Table
            ref="tableRef"
            class="table"
            :data="dataList"
            :table="tableColumn"
            :radioModel="radioModel"
            @operate="operate"
            @radioChange="radioChange"
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
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
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
import { getLocalStorage } from "@m/utils/localStorage";
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
    sysId: {
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
          model: "dataColletChiNm",
          placeholder: "请输入数据集中文名称",
        },
      ],
      // 搜索条件
      form: {
        dataColletChiNm: "",
      },
      // 点击搜索按钮后，记录搜索条件
      searchForm: {
        dataColletChiNm: "",
      },
      //按钮列表
      btnList: [
        {
          name: "创建数据集",
          value: "addDataList",
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
          prop: "dataColletChiNm",
          width: "55",
          type: "radio",
        },
        {
          prop: "dataColletId",
          label: "数据集ID",
          width: "100",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dataColletChiNm",
          label: "数据集中文名称",
          width: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dataColletEngNm",
          label: "数据集英文名称",
          width: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dataColletDescr",
          label: "数据集描述",
          width: "200",
          type: "text",
          tooltip: true,
        },
      ],
      // 分页器参数
      pager: { currentPage: 1, turnPageShowNum: 10, total: 0 },
      dialogVisible: false,
      radioModel: "",
      isData: ""
    };
  },
  methods: {
    init() {
      this.dialogVisible = true;
      this.getList();
    },
    closeDialog() {
      this.$refs.formRef.resetFields();
      this.$refs.tableRef.clearRadio();
      this.dialogVisible = false;
    },
    confirm() {
      this.$emit("selectDataConfirm", this.isData);
      this.closeDialog();
    },
    radioChange(e, data) {
      this.radioModel = e;
      this.isData = data
      console.log(e, data);
    },
    operate(operation, data) {
      if (operation == "mod") {
        this.modType(data);
      } else if (operation == "del") {
        this.del(data);
      } else if (operation == "toDetail") {
        this.toDetail(data);
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
        ...this.searchForm,
        sysId: this.sysId,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const res = await this.rpc.d5.getDataList(params);
      this.dataList = res.dataColletionInfos;
      this.pager.total = res.turnPageTotalNum * 1;
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
      if (e == "addDataList") {
        this.$emit("addDataList");
      }
    },

    //编辑分组
    modType(e) {
      this.$emit("moddDataList", e);
    },
    //删除分组
    del(e) {
      this.$confirm("是否删除该大类，名称为" + e.dataColletChiNm)
        .then(async () => {
          const params = {
            dataColletId: e.dataColletId,
          };
          const res = await this.rpc.systemmgmt.delDataList(params);
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
    // 查看详情
    toDetail(e) {
      this.$emit("toDetail", e);
    },
  },
  created() {
    // this.init();
  },
  watch: {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_workgate_comps_systemmgmt_data_list_mgmt_list {
  .content_wrapper {
    background: $base_white;
    padding: 0 24px 24px;
  }
  .pn_style {
    text-align: center;
  }
  //   .search_top {
  //     padding: 0;
  //     margin: 0;
  //   }
}
</style>

