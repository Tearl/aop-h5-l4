<template>
  <div class="aop_tradecode_comps_design_attr_select_output_field">
    <PageDialog
      :dialogTitle="'选择参数'"
      :dialogVisiable="dialogVisible"
      dialogWidth="70%"
      @closeDialog="closeDialog"
    >
      <div slot="box" class="container">
        <el-form
          v-if="isApSource == '20'"
          :model="formData"
          ref="form"
          label-position="right"
          label-width="127px"
          class="edit_form"
        >
          <div class="form_info">
            <el-form-item label="输出服务名称:" prop="actionName">
              <el-select
                v-model="formData.actionId"
                placeholder="请选择输出服务"
                filterable
                clearable
                @change="selectChange"
              >
                <el-option
                  v-for="item in cpnList"
                  :label="item.actionName"
                  :key="item.actionId"
                  :value="item.actionId"
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
import { mixList, reList, packageParamKey, getSimpleParmaKey } from "@m/utils/paramTree";
import { sourceActionType, actionTypeToApSource } from "@m/utils/normalData";

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
      cpnList: [],
      formData: {
        actionId: "", // 输出服务id\
      },
      tableData: [],
      paramDataList: [],
      dictionaryData: [],
      currentRadio: "",
      compositeIdMapToParamList: {},
      bizDomainNo:"",
      appId: ""
    };
  },
  inject: ["getDataList"],
  methods: {
    async showDialog(data, formData) {
      console.log("showDialog", data, formData)
      this.dialogVisible = true;
      this.init()
      this.currentRow = data
      this.currentRadio = data.paramKey
      // if (data.actionId == this.currentServObj?.svcId || data.actionNm == "当前4b交易") {
      //   this.dictionaryData = reList(this.currentServObj?.puApiParams?.filter((item) => item.paramDirection == "1"))
      // } else {
      //   const item = this.getDataList().find((item) => item.compositeId == data.actionId)
      //   const params = {
      //     d4StusCd: "1",
      //     blngtoTyp: "10",
      //     apiId: item.actionOwnId,
      //     d4bApiId: this.currentServObj?.svcId
      //   }
      //   const res = await this.rpc.transactionDesign.queryL5ParamAndRuleDefinitions(params)
      //   this.dictionaryData = reList(res?.paramList?.filter((item) => item.paramDirection == "1"))
      // }
      await this.updateCompositeIdMapToParamList()
      const item = this.compositeIdMapToParamList[data.actionId]
      let paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[data.actionId].paramList))
      const paramDirection = data.actionId == this.currentServObj?.svcId ? "0" : "1"
      if (!["cacheSessionAction", "getSessionAction", 'updateSessionAction'].includes(item.actionType)) {
        // 来源不是设置会话组件和获取会话组件时，需要根据来源类型筛选输入或者输出参数
        paramList = paramList.filter(param => param.paramDirection == paramDirection)
      }
      paramList.forEach(param => {
        param.paramKey = packageParamKey(param, paramList)
      })
      this.dictionaryData = reList(paramList)
    },
    async updateCompositeIdMapToParamList() {
      const compositeId = this.currentRow.actionId
      // 新拖进来的组件
      if (!this.compositeIdMapToParamList[compositeId]) {
        const data = this.getDataList().find((item) => item.compositeId == compositeId)
        this.compositeIdMapToParamList[compositeId] = {
          svcId: data.actionOwnId,
          svcNm: data.actionName,
          actionType: data.actionType,
          paramList: [],
        }
      }
      const item = this.compositeIdMapToParamList[compositeId]
      const apiId = item?.svcId
      if (compositeId && item && !(item?.paramList?.length)) {
        if (apiId && ["D4bAction", "D5SelfAction", "D5LinkAction"].includes(item.actionType)) {
          const res = await this.rpc.transactionDesign.queryL5ParamAndRuleDefinitions({
            d4StusCd: "1",
            blngtoTyp: "10",
            apiId: apiId,
            d4bApiId: this.currentServObj?.svcId,
            bizDomainNo:this.bizDomainNo
          })
          item.paramList = res.paramList
        } else if (item.actionType == "loopAction") {
          const res = await this.rpc.transactionDesign.getServiceCpnParams({
            d4StusCd: "1",
            blngtoTyp: "11",
            compositeId: compositeId,
          })
          item.paramList = res.paramList
        } else if (["cacheSessionAction", "getSessionAction", 'updateSessionAction'].includes(item.actionType)) {
          const res = await this.rpc.transactionDesign.querySessionParam({
            cstNo: this.currentServObj.competitorId,
            bizDomainNo: this.currentServObj.bizLineId,
            appId: this.currentServObj.relySys || this.appId,
          });
          item.paramList = res.paramList
        } else if (["uploadAction", "assignAction",].includes(item.actionType)) {
          // 'autoAction', 'signCustAddAction',
          // 'setAcctLimitAction',
          // 'setRoleAction',
          // 'menuRoleSetAction',
          // 'corpCustMenuSetAction',
          // 'authJobDGAction',
          const res = await this.rpc.transactionDesign.getServiceCpnParams({
            d4StusCd: "1",
            blngtoTyp: "11",
            compositeId: compositeId,
          });
          item.paramList = res.paramList
        } else if (item.actionType == "decisionAction") {
          const res = await this.rpc.transactionDesign.queryDecisionTreeParamAndRuleDefinitions({
            d4StusCd: "1",
            blngtoTyp: "10",
            apiId: apiId,
            d4bApiId: this.currentServObj?.svcId,
            bizDomainNo:this.bizDomainNo
          })
          item.paramList = res.paramList
        }
      }
    },
    closeDialog() {
      this.formData.actionId = ""
      this.dictionaryData = []
      this.currentRadio = ""
      this.dialogVisible = false
    },
    initParams(data, params) {
      console.log(data, params);
      console.time("render耗时");
      this.currentRow = params
      this.isApSource = params.apSource
      if(this.isApSource == "20") {
        this.$nextTick(() => {
          this.cpnList = this.dataList.filter(item => {
            return item.actionId != this.currentObj.actionId && ["D4bAction", "D5SelfAction", "D5LinkAction", "dataDealAction"].indexOf(item.actionType) > -1
          })
          this.dialogVisible = true
        })
      } else {
        this.paramDataList = data.puApiParams.filter(
          (item) => item.paramDirection === (params.apSource == "10" ? "3" : (params.apSource == "00" ? "0" : "1"))
        );
        this.dictionaryData = reList(this.paramDataList);
        this.dialogVisible = true
      }
      this.$nextTick(() => {
        console.timeEnd("render耗时");
      });
    },
    confirm() {
      // if (!this.currentRadio) return this.$message.error("请选择参数")
      this.$emit("setOutputTarget", "paramNm", this.currentRow, this.paramsDetail)
      this.closeDialog()
    },
    selectChange(e) {
      if(!e) return this.dictionaryData = []
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
      const res = await this.rpc.transactionDesign.getServiceCpnDefaultParams(params)
      // this.inputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == "0"));
      this.dictionaryData = res.paramList.filter((item) => item.paramDirection == "1")
    },
    selectionChange(e,row) {
      this.$refs.tableRef.clearSelection();
      this.$refs.tableRef.toggleRowSelection(row, true);
      this.paramsDetail = JSON.parse(JSON.stringify(row));
    },
    //多选显示
    tableCellStyle({ row, column, rowIndex, columnIndex }) {
      if(column.type === "selection") {
        const item = this.compositeIdMapToParamList[this.currentRow?.actionId]
        if (item && ["cacheSessionAction", "getSessionAction", "uploadAction", "assignAction", 'updateSessionAction', 'autoAction', 'keyMapAction', 'timeAction'].includes(item.actionType)) {
          
        } else if (!row.paramOrder.includes(".") && (row.paramKey != "loopOutputList" && !row.paramParentId)) {
          // return { visibility: "hidden" };
        }
        // if(row.paramType == "List" || row.paramType == "Object") {
        //   return { visibility: "hidden" };
        // } else {
        //   if(row.paramParentId !== "") {
        //     let list = row.paramOrder.split(".");
        //     let i = "";
        //     for (let j = 0; j < list.length - 1; j++) {
        //       i = i ? i + "." + list[j] : list[j] + "";
        //     }
        //     let d = [];
        //     d = this.getParamParent(this.dictionaryData, i);
        //     if(d[0]?.paramType == "List") {
        //       return { visibility: "hidden" };
        //     }
        //   }
        // }
      }
    },
    getParamParent(arrs, id) {
      let d = [];
      for (let i = 0; i < arrs.length; i++) {
        if (arrs[i].paramOrder == id) {
          d = this.paramDataList.filter((data) => {
            return data.paramKey == arrs[i].paramName;
          });
          d.push(arrs[i]);
          return d;
        } else {
          if (arrs[i].paramType == "List" || arrs[i].paramType == "Object") {
            if (arrs[i].children && arrs[i].children.length > 0) {
              const j = this.getParamParent(arrs[i].children, id);
              d = j.length > 0 ? j : d;
            }
          }
        }
      }
      return d;
    },
    radioChange (e) {
      console.log("radioChange", e)
      this.currentRadio = e.paramKey
      this.paramsDetail = e
    },
    init() {
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
      this.appId = this.$route.query.appId
      const dataList = this.getDataList()
      const { apiName, puApiParams} = this.currentServObj
      this.compositeIdMapToParamList = dataList.reduce((prev, data) => {
        if (sourceActionType.includes(data.actionType) && data.compositeId) {
          // const svcId = data.conf.find(item => item.name == "svcId").value
          const compositeId = data.compositeId
          if (!this.compositeIdMapToParamList[compositeId]) {
            prev[compositeId] = {
              svcId: data.actionOwnId,
              svcNm: data.actionName,
              actionType: data.actionType,
              paramList: [],
            }
          }
        }
        return prev
      }, {[this.currentServObj?.svcId]: { svcNm: apiName, svcId: this.currentServObj?.svcId, paramList: puApiParams}})
    }
  },
  created() {
    this.bizDomainNo = this.$route.query.beltLine || ""
    // this.init()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_select_output_field {
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
