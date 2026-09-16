<template>
  <div class="aop_tradedesign_comps_workbench_public_dialog_addService">
    <PageDialog
      :dialogWidth="'1000px'"
      :dialogTitle="'选择数据集'"
      :dialogVisiable="dialogVisible"
      @closeDialog="dialogVisible = false"
      class="create_dialog_dataset_list"
      :apTobody="true"
    >
      <div slot="box">
        <SearchTop
          ref="formRef"
          :serviceForm="serviceForm"
          :form="form"
          labelwidth="100px"
          @enterIconSearch="search"
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
        <div class="content">
          <div class="title_content">
            <div class="title">数据集列表</div>
            <el-button
              type="primary"
              icon="el-icon-plus"
              class="gotoPage"
              @click.stop="openDialog"
              size="small"
              >新增数据集</el-button
            >
          </div>
          <div class="ser_content">
            <Table
              ref="servListRef"
              class="table_style"
              :data="datasetList"
              :table="tableColumn"
              :radioModel="radioModel"
              @radioChange="radioChange"
              @operate="operate"
            ></Table>
            <!-- 分页器 -->
            <PagePagination
              @size-change="sizeChange"
              @current-change="currentChange"
              :pager="pager"
            >
            </PagePagination>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="confirmSer">确定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";
import PageDialog from "@m/core/components/page_dialog";
import SearchTop from "@m/core/components/page_search_top";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";

export default {
  mixins: [mixin],
  components: {
    PageHeader,
    PageFooter,
    PageDialog,
    SearchTop,
    Table,
    PagePagination,
  },
  data() {
    return {
      dialogVisible: false,
      serviceForm: [
        {
          type: "inputIcon",
          model: "content",
          placeholder: "",
          labelText: "数据集名称:",
        },
        // {
        //   type: "select",
        //   model: "beltLine",
        //   placeholder: "请选择",
        //   labelText: "所属部:",
        //   select: [
        //     { value: "0", type: "对公" },
        //     { value: "1", type: "对私" },
        //     { value: "2", type: "营销" },
        //   ],
        // },
        {
          type: "select",
          model: "classifyId",
          placeholder: "请选择",
          labelText: "分类:",
          select: [
            { value: "", type: "全部" },
            { value: "1", type: "用户" },
            { value: "2", type: "机构" },
            { value: "3", type: "渠道" },
            { value: "4", type: "产品" },
            { value: "5", type: "合约" },
            { value: "6", type: "系统" },
          ],
        },
      ],
      // 搜索条件
      form: {
        content: "",
        beltLine: "",
        classifyId: "",
        preciseQuery: "0",
      },
      beltLineObj:{
        "对公业务域":"0",
        "对私业务域":"1",
        "营销业务域":"2",
      },
      datasetList: [],
      tableColumn: [
        {
          prop: "dataSetNo",
          width: "55",
          type: "radio",
        },
        {
          prop: "dataSetNo",
          label: "数据集编号",
          // width: "200",
          type: "text",
        },
        {
          prop: "dataSetNm",
          label: "数据集名称",
          // width: "200",
          type: "textClick",
          operate: "detail",
        },
        {
          prop: "beltLine",
          label: "业务域",
          // width: "200",
          filter: "newBeltLineType",
          type: "text",
        },
        {
          prop: "classifyId",
          label: "分类",
          // width: "200",
          type: "text",
          filter:"classifyIdSt"
        },
        {
          prop: "statusCd",
          label: "状态",
          type: "textClassList",
          filter: "dataSetStusCd",
          textClassList: [
            { class: "add status", val: "0" },
            { class: "publishing status", val: "-1" },
            { class: "selfOther status", val: "1" },
            { class: "register status", val: "2" },
          ],
        },
      ],
      //列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      radioModel: {},
      dataObj: {},
    };
  },
  methods: {
    init() {},
    showDialog() {
      this.dialogVisible = true;
      this.reset();
    },
    confirmSer() {
      if(JSON.stringify(this.dataObj) == "{}") return this.$message.error("请选择数据集");
      this.$emit("confirmDataset", this.dataObj);
      this.dialogVisible = false;
    },
    async getDatasetList() {
      let beltLine = this.$route.query.bizLineId; //没有枚举
      // this.form.beltLine = this.beltLineObj[beltLine];
      this.form.beltLine = beltLine;
      // console.log("111111",beltLine,this.form)
      const params = {
        ...this.form,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const res = await this.rpc.dicmgmtDefine.getMyDicList(params);
      this.datasetList = res.dataSetList;
      this.pager.total = res.turnPageTotalNum;
    },
    operate(operation, data) {
      if (operation == "detail") {
        this.$emit("openEditDialog", data);
      }
    },
    // 每页条数改变时
    sizeChange(turnPageShowNum) {
      this.pager.currentPage = "1"
      this.pager.turnPageShowNum = turnPageShowNum;
      this.getDatasetList();
    },
    // 当前页改变时
    currentChange() {
      this.getDatasetList();
    },
    reset() {
      this.form = {
        content: "",
        // beltLine: "",
        classifyId: "",
        preciseQuery: "0",
      };
      this.pager.currentPage = "1";
      this.pager.turnPageShowNum = 10;
      this.getDatasetList();
    },
    search() {
      this.pager.currentPage = "1"
      this.getDatasetList();
    },
    radioChange(e, data) {
      this.dataObj = data;
    },
    openDialog() {
      this.$emit("openDialog");
      // console.log("新增数据集");
    },
  },
  created() {
    // this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_workbench_public_dialog_addService {
  .content {
    margin: 16px;
  }
}
.create_dialog_dataset_list {
  ::v-deep .aop_tradedesign_comps_page_service_top {
    padding: 0;
    margin-bottom: 0;
    // height: 64px;
  }
  ::v-deep .el-form-item__label{
    width: 86px !important;
  }
  ::v-deep .aop_tradedesign_comps_page_service_top .serivce_top {
    padding: 21px 24px;
    height: 64px;
    box-shadow: inset 0 -1px 0 0 #e7e7e7;
  }
  ::v-deep  .el-dialog .el-dialog__body{
    padding: 0px !important;
  }
  ::v-deep .content .el-button--small{
    height: 36px !important;
    font-size: 14px !important;
  }  
  ::v-deep
    .aop_tradedesign_comps_page_service_top
    .el-form
    .el-form-item
    .el-input {
    width: 160px;
  }
  .content {
    // margin: 16px;
    padding: 20px 24px 20px 24px;
    .title_content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .title {
        font-weight: 600;
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #000000;
        letter-spacing: 0;
      }
    }
  }
}
</style>
