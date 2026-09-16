<template>
  <div class="aop_tradedesign_comps_design_attr_set_cache_action_select_params">
    <PageDialog
      :dialogTitle="'选择参数'"
      :dialogVisiable="dialogVisible"
      dialogWidth="70%"
      @closeDialog="closeDialog"
    >
      <div slot="box" class="container">
        <el-form
          :model="formData"
          ref="form"
          label-position="right"
          label-width="80px"
          class="edit_form"
        >
          <div class="form_info">
            <el-form-item label="字段来源:" prop="actionName">
              <el-select
                v-model="formData.actionId"
                placeholder="请选择"
                filterable
                clearable
                @change="selectChange"
              >
                <el-option
                  v-for="item in options"
                  :label="getOptionsName(item)"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <Table
          ref="tableRef"
          class="table_style"
          :table="tables"
          :data="dictionaryData"
          rowK="paramOrder"
          tableType="selection"
          :cellStyle="tableCellStyle"
          @tableSelectChange="selectionChange"
        ></Table>
        <!-- <Table
          ref="tableRef"
          class="table_style"
          :data="dictionaryData"
          :table="tables"
          :radioModel="currentRadio"
          @radioChange="radioChange"
        ></Table> -->
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
import { mixList, reList, packageParamKey, getParamParent } from "@m/utils/paramTree";
import { escape2Html } from "@m/utils/html2e.js";

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
        // {
        //   prop: "paramKey",
        //   width: "40",
        //   type: "radio",
        //   tooltip: false,
        //   show: function(scope) {
        //     return scope.row.paramType != "List" && scope.row.paramType != "Object"
        //   }
        // },
        // {
        //   prop: "paramKey",
        //   width: "45",
        //   type: "radio",
        //   tooltip: false,
        // },
        {
          prop: "paramKey",
          label: "参数名称",
          minWidth: "30%",
          type: "text",
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
        // {
        //   prop: "dictryGategName",
        //   label: "所属分类",
        //   minWidth: "20%",
        //   type: "text",
        //   tooltip: true,
        // },
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
      formData: {
        actionId: "", // 字段来源对应的4B交易ID或L5服务的组件ID
      },
      tableData: [],
      paramDataList: [],
      dictionaryData: [],
      currentRadio: "",
      compositeIdMapToParamList: {},
      // 已选中数据
      selectedTable: [],
      innerFlowDataList: [],
      currentKey: ""
    };
  },
  computed: {
    options() {
      return this.getDataList().reduce((prev, data) => {
        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType) && data.compositeId) {
          prev.push({
            label: data.actionName,
            svcId: data.actionOwnId,
            value: data.compositeId,
            actionSeq: data.conf.find(item => item.name == "actionSeq")?.value
          })
        }
        return prev
      }, [])
    }
  },
  inject: ["getDataList"],
  methods: {
    async showDialog(key) {
      console.log("showDialog", key)
      this.currentKey = key
      await this.init()
      if (this.options[0]?.value) {
        this.selectChange(this.options[0]?.value)
      }
      this.dialogVisible = true;
    },
    //映射数据
    mapData(e, po) {
      let list = [];
      for (let i in e) {
        let pp = JSON.parse(po);
        let p = pp[e[i].id].split(" ");
        let d = {
          actionId: e[i].id,
          actionOwnId: e[i].cpntId,
          actionType: e[i].type,
          actionName: e[i].conf.filter((item) => item.name == "actionDesc")[0]
            .value,
          actionX: p[0] * 1,
          actionY: p[1] * 1,
          actionPoint: "",
          color: e[i].color || "#333",
          actionCoverShow: false,
          conf: e[i].conf,
          resultFlg: e[i].resultFlg || "",
          paramList: e[i].paramList || [],
          stusCd: e[i].stusCd || [],
          compositeId: e[i].compositeId || "",
        };

        d.actionPoint =
          d.actionX +
          (p[2] * 1) / 2 +
          "," +
          d.actionY +
          "  " +
          d.actionX +
          "," +
          (d.actionY + (p[3] * 1) / 2) +
          "  " +
          (d.actionX + (p[2] * 1) / 2) +
          "," +
          (d.actionY + p[3] * 1) +
          "  " +
          (d.actionX + p[2] * 1) +
          "," +
          (d.actionY + (p[3] * 1) / 2);
        list.push(d);
      }
      return list
    },
    async updateCompositeIdMapToParamList() {
      const compositeId = this.formData.actionId
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
          bizDomainNo: this.currentServObj.bizLineId
        })
        // const res = await this.rpc.d4.getServiceCpnParams({
        //   d4StusCd: "1",
        //   blngtoTyp: "11",
        //   compositeId: compositeId,
        //   apiId: apiId,
        //   d4bApiId: this.currentServObj.apiId || this.transId
        // })
        this.compositeIdMapToParamList[compositeId].paramList = res.paramList
      }
    },
    closeDialog() {
      this.formData.actionId = ""
      this.dictionaryData = []
      this.currentRadio = ""
      this.dialogVisible = false
    },
    setParamListSource(selectedTable, paramList, actionId, actionName, apSource = "20") {
      selectedTable.forEach(param => {
        param.actionId = actionId
        param.actionName = actionName
        param.paraMapgNm = param.paramCName
        param.paramMappingKey = packageParamKey(param, paramList)
        param.apSource = apSource
        if (param?.children?.length) {
          this.setParamListSource(param.children, paramList, actionId, actionName, apSource)
        }
      })
    },
    confirm() {
      // if (!this.currentRadio) return this.$message.error("请选择参数")
      const option = this.options.find(item => item.value == this.formData.actionId)
      // const paramList = this.selectedTable.map(param => {
      //   param.actionId = option.value
      //   param.actionName = option.label
      //   return param
      // })
      const actionName = this.options.find(item => item.value == this.formData.actionId)?.label
      const selectedTable = JSON.parse(JSON.stringify(this.selectedTable))
      const paramList = this.compositeIdMapToParamList[this.formData.actionId]?.paramList || []
      this.setParamListSource(selectedTable, paramList, this.formData.actionId, actionName, "20")
      // const paramList = this.selectedTable.map(param => {
      //   param.actionId = this.formData.actionId
      //   param.actionName = actionName
      //   param.paraMapgNm = param.paramCName
      //   param.paramMappingKey = param.paramKey
      //   param.apSource = "20"
      //   return param
      // })
      this.$emit("confirm", selectedTable)
      this.closeDialog()
    },
    async selectChange(e) {
      console.log("selectChange", e)
      this.formData.actionId = e
      this.selectedTable = []
      this.dictionaryData = []
      await this.updateCompositeIdMapToParamList()
      const paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[e].paramList))
      // paramList.forEach(param => {
      //   param.paramKey = packageParamKey(param, paramList)
      // })
      // 选择当前4B的输入参数或者L5服务的输出参数
      const paramDirection = e == this.transId ? "0" : "1"
      this.dictionaryData = reList(paramList?.filter((item) => item.paramDirection == paramDirection))

      // if(!e) return this.dictionaryData = []
      // console.log("selectChange", e)
      // const target = this.cpnList.find(item => item.actionId == e)
      // if (target.actionType == "dataDealAction") {
      //   this.getDataDealOutputParmas(target)
      // } else {
      //   this.getServiceCpnDefaultParams(target)
      // }
    },
    getDataDealOutputParmas(e) {
      console.log("getDataDealOutputParmas", e)
      this.dictionaryData = e.paramList.filter((item) => item.paramDirection == "1")
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
      this.dictionaryData = res.paramList.filter((item) => item.paramDirection == "1")
    },
    selectionChange(e, row) {
      console.log("selectionChange", e, row)
      this.selectedTable = e
    },
    //多选显示
    tableCellStyle({ row, column, rowIndex, columnIndex }) {
      const topParamParent = getParamParent(row, this.dictionaryData)
      // const paramList = this.compositeIdMapToParamList[this.formData.actionId]?.paramList || []
      const paramList = mixList(JSON.parse(JSON.stringify(this.dictionaryData)), "children") || []
      if(column.type === "selection") {
        const _parentParam = paramList.find(item => item.paramOrder == row.paramParentId)
        if ((["List", "Object"].includes(_parentParam?.paramType) && _parentParam?.paramKey != "bodyOutData") || topParamParent?.paramKey != "bodyOutData" || row?.paramKey == "bodyOutData") {
          return { visibility: "hidden" };
        }
      }
    },
    radioChange (e) {
      console.log("radioChange", e)
      this.currentRadio = e.paramKey
      this.paramsDetail = e
    },
    getOptionsName(item) {
      return item.svcId == this.transId ? item.label : `${item.label}(${item.actionSeq})`
    },
    async init() {
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
    // this.init()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_design_attr_set_cache_action_select_params {
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
