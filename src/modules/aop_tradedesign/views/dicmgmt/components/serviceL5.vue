<template>
  <div class="aop_tradedesign_comps_l5_service_add_service">
    <SearchTop
      class="search_top"
      ref="formRef"
      :serviceForm="serviceForm"
      :form="form"
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
        <el-button size="small" @click="reset" class="right_button">
          重置
        </el-button>
      </div>
    </SearchTop>
    <div class="service_content">
      <div class="content">
        <TableHeader
          title="服务列表"
          :slotVisble="true"
          :checkedColumns="checkedColumns"
          :checkBoxGroup="checkBoxGroup"
          @changeColumn="changeColumn"
          @btnClick="openDialog"
          :btnList="btnList"
        >
        </TableHeader>
        <Table
          ref="servListRef"
          class="table_style"
          :data="servList"
          :table="servColumn"
          @operate="operate"
          :cellStyle="dictListCellStyle"
          :rowK="'apiId'"
          useType="dialog"
          :reload="reload"
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
import PageFooter from "@m/core/components/page_footer";
// import EditL5Service from "./editL5Service";
import { unduplicated, setSerialNumber } from "@m/utils/array";
import TableHeader from "@m/core/components/page_table_header_filter";
import editService from './editService.vue'
import serviceDialog from '../design/dialog//serviceDetailDialog.vue'
import { getSessionStorage, setSessionStorage } from "@m/utils/localStorage.js";
export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    PagePagination,
    ServiceTabs,
    SearchTop,
    PageFooter,
    TableHeader,
    editService,
    serviceDialog,
  },
  props: {
    checkShow: {
      type: Boolean,
      default: () => true,
    },
    dataSetNo: {
      type: String,
      default: () => "",
    },
    checkInfo: {
      type: Object,
      default: () => ({}),
    },
    active: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      servList: [],
      servColumn: [
        {
          prop: "apiSeq",
          label: "服务编号",
          // width: "200",
          type: "text",
          isTrue: true,
        },
        {
          prop: "apiName",
          label: "服务名称",
          // width: "200",
          type: "textClick",
          operate: "detail",
          isTrue: true,
        },
        {
          prop: "dataSetNm",
          label: "所属数据集",
          // width: "200",
          type: "text",
          operate: "detail",
          isTrue: true,
        },
        {
          prop: "apiServiceType",
          label: "服务类型",
          // width: "250",
          type: "textClassList",
          filter: "serType",
          textClassList: [
            { class: "self status", val: "D5自有服务" },
            { class: "change status", val: "D5直连服务" },
          ],
          isTrue: true,
        },
        {
          prop: "apiState",
          label: "服务状态",
          // width: "250",
          type: "textClassList",
          filter: "apiStatusType",
          textClassList: [
            { class: "add status", val: "0" },
            { class: "register status", val: "2" },
          ],
          isTrue: true,
        },
        {
          label: "操作",
          width: "110",
          type: "button",
          fixed: "right",
          buttonList: [
            {
              desc: "编辑",
              operate: "edit",
              relation: function (scope) {
                return scope.row.apiState == "0";
              },
            },
            // {
            //   desc: "删除",
            //   operate: "del",
            //   relation: function (scope) {
            //     return scope.row.apiState == "0";
            //   },
            // },
          ],
          isTrue: true,
        },
      ],
      serviceForm: [
        // {
        //   type: "radioGroup",
        //   model: "apiServiceType",
        //   labelText: "服务类型:",
        //   groupItem: [
        //     { label: "D5自有服务", content: "自有服务" },
        //     { label: "D5直连服务", content: "直连服务" },
        //   ],
        // },
        {
          type: "inputIcon",
          model: "apiName",
          placeholder: "请输入",
          labelText: "服务名称:",
        },
        {
          type: "select",
          model: "apiServiceType",
          placeholder: "请选择",
          labelText: "服务类型:",
          select: [
            { value: "", type: "全部" },
            { value: "D5自有服务", type: "自有服务" },
            { value: "D5直连服务", type: "直连服务" },
          ],
        },
      ],
      form: {
        apiName: "",
        apiCode: "",
        apiServiceType: "",
      },
      //列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 已选参数数组
      statusObj: {
        0: "新增",
        1: "已入库",
        2: "变更",
      },
      tableData: [],
      selectionData: [],
      isRecord: false,
      transId: "",
      btnList: [
        // {
        //   name: "添加新服务",
        //   value: "addServ",
        //   type: "primary",
        //   imgSrc: "",
        //   iconClass: "el-icon-plus",
        // },
      ],
      // 表格筛选信息
      checkedColumns: ["服务名称", "服务编号", "服务类型", "服务状态", "操作"],
      checkBoxGroup: [
        { label: "服务名称", disabled: true },
        { label: "服务编号" },
        { label: "服务类型" },
        { label: "服务状态" },
        { label: "操作" },
      ],
      reload: 0,
      dialogVisiable: false,
      apiId: '',
      dataObj: {},
      showServiceDialog: false,
    };
  },
  watch: {
    active() {
      this.init()
    }
  },
  methods: {
    async confirmDialog() {
      await this.$refs.editServiceRef.confirm()
    },
    saveEnd() {
      this.dialogVisiable = false
      this.getList();
      console.log('saveEnd, update')
    },
    closeDialog() {
      this.$nextTick(() => {
        this.dialogVisiable = false
      })
    },
    showDialogVisible() {
      this.dialogVisiable = true
    },
    changeColumn(val) {
      this.checkedColumns = val;
      let tempArr = this.checkBoxGroup.filter((i) => !val.includes(i.label));
      let arr = tempArr.map((item) => {
        return item.label;
      });
      this.servColumn.filter((i) => {
        if (arr.indexOf(i.label) != -1) {
          i.isTrue = false;
        } else {
          i.isTrue = true;
        }
      });
      ++this.reload;
    },
    confirmService() {
      this.getList();
    },
    async delSer(data) {
      this.$confirm(`是否删除该服务，服务名称为：${data.apiName}`).then(
        async () => {
          const params = {
            apiId: data.apiId,
          };
          const res = await this.rpc.downloadDesign.delSer(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getList();
        }
      );
    },
    async getQueryDict() {
      const params = {
        currentPage: 1,
        turnPageShowNum: 10,
      }
      const res = await this.rpc.dicmgmt.getQueryList(params);
      this.serviceCount = res.turnPageTotalNum
    },
    operate(operation, data) {
      if (operation == "edit") {
        setSessionStorage("dataObj", JSON.stringify(data))
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editServiceL5",
        });
      } else if (operation == "check") {
        // console.log("选择", data);
        this.$emit("checkL5", data);
      } else if (operation == "del") {
        this.delSer(data);
      } else if (operation == "detail") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/L5serviceDetail",
          query: {
            apiId: data.apiId,
            dataSetNo: data.dataSetNo,
            dataSubstnNo: data.dataSubstnNo,
            type: 'tableDetail'
          }
        })
      }
    },
    init() {
      this.pager = {
        currentPage: "1",
        turnPageShowNum: 10,
        total: 0,
      };
      this.getList();
      this.selectionData = [];
      this.tableData = [];
    },
    
    async getList(apiId) {
      let desiStus = ''
      console.log(this.active)
      if (this.active === 'design') {
        desiStus = '0'
      } else if (this.active === "unaccept") {
        desiStus = '2'
      }
      const serviceParams = {
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
        apiCode: '',
        apiName: this.form.apiName,
        beltLine: '',
        apiServiceType: this.form.apiServiceType,
        desiStusCdList: !desiStus ? [] : [desiStus],
      };
      const res = await this.rpc.dicmgmt.getQueryList(serviceParams);
      // const res = await this.rpc.dicmgmt.getServList(params);
      this.servList = res.apiInfoList;
      this.pager.total = res.turnPageTotalNum;
      this.$nextTick(() => {
        this.isTableData();
      });
      this.$emit('input', res.turnPageTotalNum)
      if (apiId) {
        this.servList.forEach((item) => {
          if (item.apiId === apiId) {
            this.dataObj = item
          }
        })
      }
      // this.isRecord = true;
    },
    search() {
      this.isRecord = true;
      this.pager.currentPage = "1";
      this.getList(this.form.apiName);
    },
    reset() {
      this.form = {
        apiName: "",
        apiCode: "",
        apiServiceType: "",
      };
      this.pager.currentPage = "1";
      this.getList();
    },
    // 每页条数改变时
    handleSizeChange(turnPageShowNum) {
      this.isRecord = true;
      this.pager.currentPage = "1";
      this.pager.turnPageShowNum = turnPageShowNum;
      this.getList();
    },
    // 当前页改变时
    handleCurrentChange() {
      this.isRecord = true;
      this.getList();
    },
    openDialog() {
      // console.log(this.checkInfo, "this.checkInfo");
    },
    handleSelectionChange(e) {
      // console.log(e, "handleSelectionChange");
      // this.datasetObj = e;
      if (!this.isRecord && this.selectionData.length > e.length) {
        this.selectionData.forEach((item) => {
          if (e.indexOf(item) == -1) {
            this.tableData = this.tableData.filter(
              (it) => it.apiId != item.apiId
            );
          }
        });
        // console.log("1");
      } else {
        // console.log("2");
        this.tableData.push(...e);
        this.tableData = unduplicated(this.tableData, "apiId");
      }
      this.selectionData = e;
      this.isRecord = false;
    },
    delParamsTag(e) {
      // console.log(e, "eeee");
      const index = this.servList.findIndex((item) => item.apiId == e.apiId);
      if (index == -1) {
        this.tableData = this.tableData.filter((it) => it.apiId != e.apiId);
      } else {
        this.$refs.servListRef.$refs.tableRef.toggleRowSelection(
          this.servList[index],
          false
        );
      }
    },
    // tableData数据选中表格中
    isTableData() {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item) => {
          this.servList.forEach((data) => {
            if (item.apiId == data.apiId) {
              this.isRecord = true;
              this.$refs.servListRef.$refs.tableRef.toggleRowSelection(data);
            }
          });
        });
      }
    },
    cancel() {
      if (this.checkShow) {
        this.$emit("goBack");
        // this.$router.go(-1);
        // this.beforeDestroy();
      } else {
        this.$emit("cancel");
      }
    },
    async confirm() {
      if (this.tableData.length == 0) return this.$message.error("请选择服务");
      this.tableData.map((item) => {
        item.transId = this.transId;
        return item;
      });
      // console.log(this.tableData, "111111");
      const params = {
        svcChoiceList: this.tableData,
      };
      const res = await this.rpc.dicmgmtDefine.checkService(params);
      this.$notify({
        title: "成功",
        message: "添加成功",
        duration: 2000,
        type: "success",
      });
      this.$emit("goBack");
      // this.$router.go(-1);
      // this.beforeDestroy();
    },
  },
  mounted() {
    this.transId = this.$route.query.transId || this.$route.query.apiId;
    this.beltLine = this.$route.query.bizLineId;
    this.getList();
  },
  // beforeDestroy() {
  //   sessionStorage.removeItem("svcId")
  // },
  // beforeRouteLeave(to, from, next) {
  //   this.$destroy();
  //   next();
  // },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_l5_service_add_service {
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
  ::v-deep .service_content .el-button--small {
    height: 36px !important;
    width: 110px !important;
    font-size: 14px !important;
    padding: 9px;
  }
  .service_content {
    margin-top: 12px;
    background: #fff;
    padding: 20px 24px;
  }
  .btn {
    margin-top: 12px;
    background: #fff;
    padding: 20px 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
      span {
        color: #358aff;
      }
    }
    .show_conf_content {
      float: left;
    }
    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>

