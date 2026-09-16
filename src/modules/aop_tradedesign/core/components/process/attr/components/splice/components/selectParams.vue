<template>
  <div class="aop_tradedesign_comps_design_attr_splice_action_select_params">
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
import { mixList, reList } from "@m/utils/paramTree";

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
      selectedTable: []
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
      }, [{
        label: "当前4b交易",
        value: this.transId,
        svcId: this.transId,
      }])
    }
  },
  inject: ["getDataList"],
  methods: {
    async showDialog() {
      console.log("showDialog")
      this.selectChange(this.transId)
      // this.currentRow = data
      // this.currentRadio = data.paramKey
      // await this.updateCompositeIdMapToParamList()
      // const paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[data.actionId].paramList))
      // paramList.forEach(param => {
      //   param.paramKey = this.packageParamKey(param, paramList)
      // })
      // this.dictionaryData = reList(paramList?.filter((item) => item.paramDirection == "1"))
      this.dialogVisible = true;
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
          d4bApiId: this.transId
        })
        this.compositeIdMapToParamList[compositeId].paramList = res.paramList
      }
    },
    closeDialog() {
      this.formData.actionId = ""
      this.dictionaryData = []
      this.currentRadio = ""
      this.dialogVisible = false
    },
    confirm() {
      // if (!this.currentRadio) return this.$message.error("请选择参数")
      const option = this.options.find(item => item.value == this.formData.actionId)
      const paramList = this.selectedTable.map(param => {
        param.actionId = option.value
        param.actionName = option.label
        return param
      })
      this.$emit("confirm", "paramList", paramList)
      this.closeDialog()
    },
    async selectChange(e) {
      console.log("selectChange", e)
      this.formData.actionId = e
      this.selectedTable = []
      this.dictionaryData = []
      await this.updateCompositeIdMapToParamList()
      const paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[e].paramList))
      paramList.forEach(param => {
        param.paramKey = this.packageParamKey(param, paramList)
      })
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
    selectionChange(e,row) {
      console.log("selectionChange", e, row)
      this.selectedTable = e
    },
    //多选显示
    tableCellStyle({ row, column, rowIndex, columnIndex }) {
      if(column.type === "selection") {
        if(["List", "Object"].includes(row.paramType)) {
          return { visibility: "hidden" };
        }
      }
      // if(column.type === "selection") {
      //   if (!row.paramOrder.includes(".")) {
      //     return { visibility: "hidden" };
      //   }
      // }
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
    /**
     * @description: 把参数key组装成 parentKey.key的形式
     * @param {*} param 当前进行拼接的参数
     * @param {*} paramList 参数列表
     * @param {*} paramKey 累计拼接的paramKey
     * @return {*}
     */
    packageParamKey(param, paramList, paramKey = "") {
      const { paramOrder, paramParentId } = param
      if (paramOrder != paramParentId && paramParentId) {
        const _param = paramList.find(item => item.paramOrder == paramParentId)
        const _paramKey = `${param.paramKey}${paramKey ? "." : ""}${paramKey}`
        return this.packageParamKey(_param, paramList, _paramKey)
      } else {
        return `${param.paramKey}${paramKey ? "." : ""}${paramKey}`
      }
    },
    getOptionsName(item) {
      return item.svcId == this.transId ? item.label : `${item.label}(${item.actionSeq})`
    },
    init() {
      this.transId = this.$route.query.transId || this.$route.query.apiId
      const dataList = this.getDataList()
      const { apiName, puApiParams} = this.currentServObj
      this.compositeIdMapToParamList = dataList.reduce((prev, data) => {
        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType) && data.compositeId) {
          // const svcId = data.conf.find(item => item.name == "svcId").value
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
    this.init()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_design_attr_splice_action_select_params {
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
