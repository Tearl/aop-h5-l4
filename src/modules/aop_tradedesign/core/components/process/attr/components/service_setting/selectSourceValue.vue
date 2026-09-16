<template>
  <div class="aop_tradedesign_comps_design_attr_select_source_value">
    <PageDialog
      :dialogTitle="'选择来源值'"
      :dialogVisiable="dialogVisible"
      dialogWidth="70%"
      @closeDialog="closeDialog"
    >
      <div slot="box" class="container">
        <Table
          ref="tableRef"
          class="table_style"
          :table="tables"
          :data="tableData"
          rowK="paramOrder"
          tableType="selection"
          :cellStyle="tableCellStyle"
          @tableSelectChange="selectionChange"
        ></Table>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
      >
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import PageDialog from "@m/core/components/page_dialog";
import { mixList, reList, packageParamKey, getSimpleParmaKey } from "@m/utils/paramTree";

export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    currentObj: {
      type: Object,
      default: () => ({}),
    }
  },
  data() {
    return {
      // 字典列表参数
      tables: [
        {
          prop: "paramKey",
          label: "参数名称",
          minWidth: "30%",
          type: "text",
          filter: scope => getSimpleParmaKey(scope.row.paramKey),
          tooltip: true,
        },
        {
          prop: "paramCName",
          minWidth: "30%",
          label: "参数中文名称",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramType",
          filter: "paraTyp",
          label: "参数类型",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
        {
          prop: "paramLength",
          label: "最大长度",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
      ],
      dialogVisible: false,
      paramsDetail: {},
      currentRow: {},
      isApSource: "",
      cpnList: [],
      formData: {
        actionId: "", // 输出服务id\
      },
      paramDataList: [],
      tableData: [],
      currentRadio: "",
      compositeIdMapToParamList: {},
      bizDomainNo:""
    };
  },
  inject: ["getDataList"],
  methods: {
    async showDialog(data) {
      console.log("showDialog", data)
      this.init()
      this.currentRow = data
      this.currentRadio = data.paramKey
      await this.updateCompositeIdMapToParamList()
      let paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[data.actionId].paramList))
      if (data.apSource == "00") {
        // 来源为当前4b交易时，从输入参数中选择来源值；来源为当前l5服务时，从全量参数中选择来源值。
        paramList = paramList.filter((item) => item.paramDirection == "0")
      }
      paramList.forEach(param => {
        param.paramKey = packageParamKey(param, paramList)
      })
      this.tableData = reList(paramList)
      this.dialogVisible = true;
    },
    async updateCompositeIdMapToParamList() {
      const compositeId = this.currentRow.actionId
      // 新拖进来的组件
      if (!this.compositeIdMapToParamList[compositeId]) {
        const data = this.getDataList().find((item) => item.compositeId == compositeId)
        this.compositeIdMapToParamList[compositeId] = {
          svcId: data.actionOwnId,
          svcNm: data.actionName,
          paramList: [],
        }
      }
      const item = this.compositeIdMapToParamList[compositeId]
      const apiId = item?.svcId
      if (compositeId && apiId && !(this.compositeIdMapToParamList[compositeId]?.paramList?.length)) {
        const res = await this.rpc.d4.queryL5ParamAndRuleDefinitions({
          d4StusCd: "1",
          blngtoTyp: "10",
          apiId: apiId,
          d4bApiId: this.transId,
          bizDomainNo:this.bizDomainNo
        })
        this.compositeIdMapToParamList[compositeId].paramList = res.paramList
      }
    },
    closeDialog() {
      this.formData.actionId = ""
      this.tableData = []
      this.currentRadio = ""
      this.dialogVisible = false
    },
    confirm() {
      // if (!this.currentRadio) return this.$message.error("请选择参数")
      this.$emit("setSourceValue", this.currentRow, this.paramsDetail)
      this.closeDialog()
    },
    selectChange(e) {
      if(!e) return this.tableData = []
      console.log("selectChange", e)
      const target = this.cpnList.find(item => item.actionId == e)
      if (target.actionType == "dataDealAction") {
        this.getDataDealOutputParmas(target)
      } else {
        this.getServiceCpnDefaultParams(target)
      }
    },
    getDataDealOutputParmas(e) {
      console.log("getDataDealOutputParmas", e)
      this.tableData = e.paramList.filter((item) => item.paramDirection == "1")
    },
    async getServiceCpnDefaultParams(e) {
      console.log("getServiceCpnDefaultParams", e)
      const params = {
        d4StusCd: "1",
        blngtoTyp: "10",
        apiId: e.conf.find(item => item.name == "svcId").value,
        d4bApiId: this.currentServObj.apiId
      }
      const res = await this.rpc.d4.getServiceCpnDefaultParams(params)
      // this.inputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == "0"));
      this.tableData = res.paramList.filter((item) => item.paramDirection == "1")
    },
    selectionChange(e,row) {
      this.$refs.tableRef.clearSelection();
      this.$refs.tableRef.toggleRowSelection(row, true);
      this.paramsDetail = JSON.parse(JSON.stringify(row));
    },
    //多选显示
    tableCellStyle({ row, column, rowIndex, columnIndex }) {
      // if(column.type === "selection") {
      //   if (!row.paramOrder.includes(".")) {
      //     return { visibility: "hidden" };
      //   }
      // }
    },
    radioChange (e) {
      console.log("radioChange", e)
      this.currentRadio = e.paramKey
      this.paramsDetail = e
    },
    init() {
      this.transId = this.$route.query.transId || this.$route.query.apiId
      const dataList = this.getDataList()
      const { apiName, puApiParams} = this.currentServObj
      this.compositeIdMapToParamList = dataList.reduce((prev, data) => {
        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType) && data.compositeId) {
          const compositeId = data.compositeId
          if (!this.compositeIdMapToParamList[compositeId]) {
            prev[compositeId] = {
              svcId: data.actionOwnId,
              svcNm: data.actionName,
              paramList: [],
            }
          }
        }
        return prev
      }, {[this.transId]: { svcNm: apiName, svcId: this.transId, paramList: puApiParams}})
    }
  },
  created() {
    this.bizDomainNo = this.$route.query.bizLineId || ""
    // this.init()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_design_attr_select_source_value {
  .container {
    padding: 16px;
  }
  .edit_form {
    margin-top: 10px;
    @include form;
  }
  .table_style ::v-deep .el-table__header-wrapper .el-checkbox {
    display: none;
  }
}
</style>
