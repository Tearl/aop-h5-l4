<template>
  <div class="aop_tradedesign_comps_apimgmt_api_public_obj_select">
    <!-- 选择字典数据 -->
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
          ref="dictListTableRef"
          class="table_style"
          :table="tables"
          :data="bussinessobjList"
          tableType="selection"
          rowK="bsnObjId"
          @selectionChange="handleSelectionChange"
        ></Table>
        <PagePagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager="pager"
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
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import { unduplicated } from "@m/utils/array";
import { getSessionStorage } from "@m/utils/localStorage";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    },
    bsnObjId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      // 数据字典选择公共搜索
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
      // 数据字典搜索信息表单
      form: {
        bsnObjNm: "", // 编号或名称或描述
        domainId: "", // 类型
      },
      // 数据字典搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
       bsnObjNm: "", // 编号或名称或描述
        domainId: "", // 类型
      },
      // 字典列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
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
          type: "text",
          tooltip: true,
        },
        {
          prop: "servType",
          width: "90",
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
      // 数据字典选择列表
      bussinessobjList: [],
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      // 已选参数数组
      tableData: [],
      // 记录已经选择
      selectionData: [],
    }
  },
  methods: {
    // 点击搜索按钮
    search() {
      this.isRecord = true;
      Object.assign(this.searchRecord, this.form);
      this.pager.currentPage = "1";
      this.getList();
    },
    // 点击重置按钮
    reset() {
      this.$refs.formRef.resetFields();
    },
    // 获取字典列表数据
    async getList() {
      data = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        ...this.searchRecord,
        excludeBsnObjId: this.bsnObjId,
        sysId: getSessionStorage("workgate-arsId") || this.$route.query.sysId
      };
      const res = await this.rpc.systemmgmt.getBussinessobjList(data);
      this.bussinessobjList = res.bsnObjList
      this.pager.total = res.turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableData();
      });
    },
    // tableData数据选中表格中
    isTableData() {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item) => {
          this.dictionaryData.forEach((data) => {
            if (item.bsnObjId == data.bsnObjId) {
              this.isRecord = true;
              this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
                data
              );
            }
          });
        });
      }
    },
    // 数据字典选择每页条数改变时
    handleSizeChange(e) {
      this.isRecord = true;
      this.pager.turnPageShowNum = e;
      this.getList();
    },
    // 数据字典选择当前页改变时
    handleCurrentChange(e) {
      this.isRecord = true;
      this.getList();
    },
    closeDialog() {
      this.$refs.formRef.resetFields();
      this.$emit("closeDialog")
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
    confirm() {
      this.$emit("setDictChildList", this.tableData);
    },
    async getDomainList() {
      const res = await this.rpc.systemmgmt.getDomainList()
      this.serviceForm[1].select = res.domainInfoList.map((item) => {return {type: item.domainNm,value: item.domainId}})
    },
    // 初始化
    init() {
      this.getList();
      this.getDomainList()
    },
  },
  created() {
    // this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_api_public_obj_select{
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }
  .dialog {
    ::v-deep.el-dialog {
      margin-top: 3vh !important;
    }
    ::v-deep.el-dialog__body {
      max-height: 78vh;
    }
  }
  .service_top ::v-deep.serivce_top_box {
    padding: 0;
    margin: 0;
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
