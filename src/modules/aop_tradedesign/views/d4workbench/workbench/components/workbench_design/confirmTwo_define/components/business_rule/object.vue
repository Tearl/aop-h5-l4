<template>
  <div class="aop_workgate_comps_apimgmt_api_view_api_flow_object">
    <div class="service_content_container">
      <div class="service_content_bottom">
        <TableHeader
          title="业务对象列表"
          :btnList="btnAuth ? btnList: []"
          @btnClick="handleBtnClik"
          v-if="type == 'inDetail'"
        ></TableHeader>

        <Table
          :table="btnAuth ? tables : nextTables"
          @operate="operate"
          :data="bussinessobjList"
        ></Table>

      </div>
    </div>

    <PageDialog
      dialogTitle="业务对象选择"
      :dialogVisiable="dialogVisible"
      dialogWidth="70%"
      @closeDialog="closeDialog"
      class="dialog"
    >
      <div slot="box">
        <ServiceTop
          ref="formRef"
          :serviceForm="serviceForm"
          :form="form"
          class="service_top"
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
        </ServiceTop>
        <Table
          ref="objTableRef"
          class="table_style"
          :table="objTables"
          :data="objData"
          tableType="selection"
          @selectionChange="handleSelectionChange"
        ></Table>
        <PagePagination
          @size-change="handleObjSizeChange"
          @current-change="handleObjCurrentChange"
          :pager="objPager"
        >
        </PagePagination>
        <div class="show_conf">
          <div class="show_conf_title">
            已选择：{{ tableData && tableData.length }}个
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import validate from "@m/utils/validate";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import TableHeader from "@m/core/components/page_table_header";
import { unduplicated } from "@m/utils/array";
export default {
  mixins: [mixin],
  components: {
    ServiceTop,
    Table,
    PagePagination,
    TableHeader,
    PageDialog,
  },
  props: {
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
  },
  data() {
    return {
      // 列表参数
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
          prop: "servType",
          width: "200",
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
      nextTables: [
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
          prop: "servType",
          width: "200",
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
      ],
      //集合
      bussinessobjList: [],

      // 表格头部按钮
      btnList: [
        {
          name: "关联业务对象",
          value: "bind",
          type: "primary",
          imgSrc: "",
          iconClass: "el-icon-plus",
        },
      ],
      apiId: "",


      //业务对象选择
      dialogVisible: false,
      //选择公共搜索
      serviceForm: [
        {
          type: "input",
          model: "bsnObjNm",
          placeholder: "搜索业务对象名称",
          style: {
            width: "300px",
          },
        },
        {
          type: "select",
          model: "domainId",
          placeholder: "所属领域",
          select: [],
          filterable: true,
        },
      ],
      // 搜索信息表单
      form: {
        bsnObjNm: "", // 编号或名称或描述
        domainId: "", // 类型
      },
      // 搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        bsnObjNm: "", // 编号或名称或描述
        domainId: "", // 类型
      },
      // 列表分页器
      objPager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 列表参数
      objTables: [
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
          type: "text",
          tooltip: true,
        },
        {
          prop: "servType",
          width: "200",
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
      ],
      // 数据选择列表
      objData: [],
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      // 已选参数数组
      tableData: [],
      // 记录已经选择
      selectionData: [],
    };
  },
  methods: {
    init() {
      this.sysId = this.$route.query.arsId;
      this.getDomainList();
      this.getList()
    },
    //点击btnList里的按钮
    handleBtnClik(btn) {
      switch (btn) {
        case "bind":
          this.bindObj();
          return;
        default:
          return;
      }
    },
    bindObj() {
      this.dialogVisible = true;
      this.search();
    },
    // 获取列表数据
    async getList() {
      data = {
        apiId: this.apiId
      };
      const res = await this.rpc.public.getApiObj(data);
      this.bussinessobjList = res.bsnObjList
    },
    //操作
    async operate(operation, data) {
      if (operation == "delete") {
        this.$confirm("确定要删除吗？").then(async () => {
          const params = { 
            apiId: this.apiId,
            sysId: this.sysId,
            bsnObjBindingApis: [{bsnObjId:data.bsnObjId }]};
          const res = await this.rpc.public.deleteApiObj(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getList();
        });
      } else if (operation == "detail") {
        this.$emit("toObjDetail",data.bsnObjId)
        // const msgFormat = this.$route.query.msgFormat
        // this.$router.push({
        //   path: "/aop_workgate/systemmgmt/objDetail",
        //   query: { bsnObjId: data.bsnObjId, sysId: this.sysId, apiId: this.apiId, msgFormat: msgFormat},
        // });
      } else if (operation == "edit") {
        this.$emit("toModObj",data.bsnObjId)
        // const msgFormat = this.$route.query.msgFormat
        // this.$router.push({
        //   path: "/aop_workgate/systemmgmt/modObj",
        //   query: { bsnObjId: data.bsnObjId, sysId: this.sysId, apiId: this.apiId, msgFormat: msgFormat},
        // });
      }
    },

    //弹窗
    closeDialog() {
      this.reset()
      this.tableData = []
      this.selectionData = []
      this.dialogVisible = false;
    },
    // 点击搜索按钮
    search() {
      this.isRecord = true;
      Object.assign(this.searchRecord, this.form);
      this.getObjList();
    },
    // 点击重置按钮
    reset() {
      this.$refs.formRef.resetFields();
    },
    async getDomainList() {
      const res = await this.rpc.public.getDomainList();
      this.serviceForm[1].select = res.domainInfoList.map((item) => {
        return { type: item.domainNm, value: item.domainId };
      });
    },
    // 获取字典列表数据
    async getObjList() {
      data = {
        currentPage: this.objPager.currentPage + "",
        turnPageShowNum: this.objPager.turnPageShowNum,
        ...this.searchRecord,
        apiId: this.apiId,
        sysId: this.sysId
      };
      const res = await this.rpc.public.getBussinessobjList(data);
      this.objData = res.bsnObjList
      this.objPager.total = res.turnPageTotalNum * 1;
      res.bsnObjList.forEach((item) => {
        if(item.bindFlag == "1") {
          this.tableData.push(item)
        }
      })
      this.tableData = unduplicated(this.tableData, "bsnObjId");
      this.$nextTick(() => {
        this.isTableData();
      });
    },
    // tableData数据选中表格中
    isTableData() {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item) => {
          this.objData.forEach((data) => {
            if (item.bsnObjId == data.bsnObjId) {
              this.isRecord = true;
              this.$refs.objTableRef.$refs.tableRef.toggleRowSelection(
                data
              );
            }
          });
        });
      }
    },
    // 业务对象选择每页条数改变时
    handleObjSizeChange(e) {
      this.isRecord = true;
      this.objPager.turnPageShowNum = e;
      this.getObjList();
    },
    // 业务对象选择当前页改变时
    handleObjCurrentChange(e) {
      this.isRecord = true;
      this.getObjList();
    },
    handleSelectionChange(e) {
      if (!this.isRecord && this.selectionData.length > e.length) {
        this.selectionData.forEach((item) => {
          if (e.indexOf(item) == -1) {
            this.tableData = this.tableData.filter(
              (it) => it.bsnObjId != item.bsnObjId
            );
          }
        });
      } else {
        this.tableData.push(...e);
        this.tableData = unduplicated(this.tableData, "bsnObjId");
      }
      this.selectionData = e;
      this.isRecord = false;
    },
    async confirm() {
      if(this.tableData.length == 0) return this.$message.error("请选择需要关联的业务对象")
      console.log(this.tableData);
      const params = {
        apiId: this.apiId,
        sysId: this.sysId,
        bsnObjBindingApis: []
      }
      this.tableData.forEach((item) => {
        params.bsnObjBindingApis.push({bsnObjId: item.bsnObjId})
      })
      const res = await this.rpc.public.apiRelaObj(params)
      this.$notify({
        title: "成功",
        message: "关联成功！",
        duration: 2000,
        type: "success",
      });
      this.getList()
      this.closeDialog()
    }
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_apimgmt_api_view_api_flow_object {
  .service_content_container {
    .service_content_bottom {
      background: $base_white;
      padding: 0 24px 24px;
      margin-bottom: 20px;
    }
  }
  .dialog_wrapper {
    .dialog_content {
      font-family: $font_regular;
      .edit_form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 24px 0;
        @include form;
      }
    }
  }
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
    }
  }
}
</style>