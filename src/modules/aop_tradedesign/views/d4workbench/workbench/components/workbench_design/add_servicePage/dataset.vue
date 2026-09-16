<template>
  <div class="aop_tradedesign_comps_l5_service_add_dataset">
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
    <div class="dataset_content">
      <div class="content">
        <div class="title">数据集列表</div>
        <!-- <TableHeader :title="'数据集列表'"></TableHeader> -->
        <Table
          ref="datasetListRef"
          class="table_style"
          :data="datasetList"
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
      <el-drawer
        title="用户数据集"
        :visible.sync="drawer"
        :direction="direction"
        :wrapperClosable="false"
        @openDialog="openDialog"
        size="800px"
      >
        <ServiceList
          ref="serviceListRef"
          :checkShow="false"
          :dataSetNo="dataSetNo"
          @cancel="cancel"
          :checkInfo="checkInfo"
          @goBack="goBack"
        ></ServiceList>
      </el-drawer>
    </div>
    <editDataset ref=editDatasetRef @getList="getDatasetList"></editDataset>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import PageDialog from "@m/core/components/page_dialog";
import SearchTop from "@m/core/components/page_search_top";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTabs from "@m/core/components/page_tabs_workgate";
import TableHeader from "@m/core/components/page_table_header";
import ServiceList from "./service";
import editDataset from "./components/addDataset/editIndex";
import { unduplicated, setSerialNumber } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    PagePagination,
    ServiceTabs,
    SearchTop,
    TableHeader,
    ServiceList,
    editDataset
  },
  props: {},
  data() {
    return {
      tableColumn: [
        {
          prop: "dataSetNo",
          label: "数据集编号",
          width: "200",
          type: "text",
        },
        {
          prop: "dataSetNm",
          label: "数据集名称",
          width: "250",
          // type: "text",
          type: "textClick",
          operate:"edit"
        },
        {
          prop: "classifyId",
          label: "分类",
          width: "250",
          type: "text",
          filter: "classifyIdSt",
        },
        {
          label: "操作",
          width: "110",
          type: "button",
          fixed: "right",
          buttonList: [
            {
              desc: "查询服务",
              operate: "searchServ",
            },
          ],
        },
      ],
      datasetList: [],
      serviceForm: [
        {
          type: "inputIcon",
          model: "content",
          placeholder: "请输入",
          labelText: "数据集名称:",
        },
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
      form: {
        content: "",
        classifyId: "",
      },
      //列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      datasetName: "",
      isShow: false,
      servList: [],
      servColumn: [
        {
          prop: "apiName",
          label: "服务名称",
          width: "200",
          type: "text",
        },
        {
          prop: "apiServiceType",
          label: "服务类型",
          width: "250",
          type: "text",
        },
        {
          label: "操作",
          width: "110",
          type: "button",
          fixed: "right",
          buttonList: [
            {
              desc: "选择",
              operate: "check",
            },
          ],
        },
      ],
      //列表分页器
      pagerSer: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      dataSetNo: "",
      direction: "rtl",
      drawer: false,
      checkInfo:{},
      bizLineId:"",
      beltLineObj:{
        "对公业务域":"0",
        "对私业务域":"1",
        "营销业务域":"2",
      },
    };
  },
  methods: {
     operate(operation, data) {
      if (operation == "searchServ") {
        this.datasetName = data.dataSetNm;
        this.dataSetNo = data.dataSetNo;
        this.drawer = true;
        this.checkInfo = data;
        this.$nextTick(() => {
          this.$refs.serviceListRef.init();
        });
      } else if (operation == "check") {
        // console.log("选择", data);
        this.$emit("checkL5", data);
      }else if (operation == "edit"){
        // console.log("11111")
        this.$refs.editDatasetRef.showDialog(data);
      }
    },
    async getDatasetList() {
      const params = {
        ...this.form,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
        preciseQuery: "0",
        beltLine:this.bizLineId,
        // beltLine:this.beltLineObj[this.bizLineId]
      };
      const res = await this.rpc.dicmgmtDefine.getMyDicList(params);
      this.datasetList = res.dataSetList;
      this.pager.total = res.turnPageTotalNum * 1;
    },
    async getServiceList() {
      const params = {
        dataSetNo: this.dataSetNo,
        currentPage: this.pagerSer.currentPage,
        turnPageShowNum: this.pagerSer.turnPageShowNum,
      };
      const res = await this.rpc.dicmgmtDefine.getServList(params);
      this.servList = res.apiInfoList;
      this.pagerSer.total = res.turnPageTotalNum * 1;
    },
    search() {
      this.pager.currentPage = "1"
      this.getDatasetList();
    },
    reset() {
      this.form = {
        content: "",
        classifyId: "",
      };
      this.pager.currentPage = "1"
      this.getDatasetList();
    },
    // 每页条数改变时
    handleSizeChange(turnPageShowNum) {
      this.pager.currentPage = "1"
      this.pager.turnPageShowNum = turnPageShowNum;
      this.getDatasetList();
    },
    // 当前页改变时
    handleCurrentChange() {
      this.getDatasetList();
    },
    // 每页条数改变时
    sizeChange(turnPageShowNum) {
      this.pagerSer.turnPageShowNum = turnPageShowNum;
      this.getServiceList();
    },
    // 当前页改变时
    currentChange() {
      this.getServiceList();
    },
    init() {
      this.isShow = false;
      this.getDatasetList();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch((_) => {});
    },

    closeDrawer() {
      // console.log("222");
      this.drawer = false;
    },
    cancel(){
      this.drawer = false;
    },
    goBack() {
        this.$emit("goBack");
    },
  },
  mounted() {
    this.bizLineId = this.$route.query.bizLineId;
    this.getDatasetList();
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_l5_service_add_dataset {
  ::v-deep .aop_tradedesign_comps_page_service_top {
    padding: 0;
    margin-bottom: 0;
    // height: 64px;
  }
  ::v-deep .aop_tradedesign_comps_page_service_top .serivce_top {
    padding: 16px 24px 16px 20px;
    height: 64px;
  }
  ::v-deep
    .aop_tradedesign_comps_page_service_top
    .el-form
    .el-form-item
    .el-input {
    width: 180px;
  }
  .title {
    font-weight: 600;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #000000;
    letter-spacing: 0;
    margin-bottom: 24px;
  }
  .dataset_content {
    margin-top: 12px;
    background: #fff;
    padding: 20px 24px;
  }
  ::v-deep .dataset_content .el-drawer__header{
    box-shadow: inset 0 -1px 0 0 #e7e7e7;
    padding: 14px 24px;
    font-family: $font_medium;
    color: $pri_ft_color;
    letter-spacing: 0;
    font-weight: $font_weight_600;
    margin-bottom: 20px;
  }
  ::v-deep .aop_tradedesign_comps_l5_service_add_service .service_content{
    margin-top: 0;
    padding: 0 24px;
  }
  .servList {
    margin-top: 30px;
    // display: flex;
    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .left {
        .title {
          font-weight: 600;
          font-family: PingFangSC-Semibold;
        }
      }
      .right {
        .gotoPage {
          color: $theme_color;
          font-family: $font_regular;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
