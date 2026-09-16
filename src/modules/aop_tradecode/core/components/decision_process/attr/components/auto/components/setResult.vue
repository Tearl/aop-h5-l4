<template>
  <div class="aop_tradecode_comps_design_attr_set_result">
    <PageDialog
      :dialogTitle="'选择参数'"
      :dialogVisiable="dialogVisible"
      dialogWidth="600px"
      @closeDialog="closeDialog"
    >
      <div slot="box" class="container">
        <el-form
          :model="formData"
          :rules="rules"
          ref="form"
          label-position="right"
          label-width="127px"
          class="edit_form"
        >
          <div class="form_info">
            <el-form-item label="来源:" prop="actionId">
              <el-select
                v-model="formData.actionId"
                placeholder="请选择来源"
                filterable
                @change="selectChange('actionId', $event)"
              >
                <el-option
                  v-for="item in assignedSourceOptions"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="isFixedValue ? '固定值:' : '参数:'" prop="paramMappingKey">
              <el-input
                v-if="isFixedValue"
                v-model="formData.paramValue"
                placeholder="请输入">
              </el-input>
              <el-select
                v-else
                v-model="formData.paramMappingKey"
                placeholder="请选择参数"
                filterable
                @change="selectChange('paramMappingKey', $event)"
                :disabled="!formData.actionId"
              >
                <el-option
                  v-for="item in assignedSourceKeyOptions"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
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
import { mixList, reList, packageParamKey, getParamParent, getAllChildByParamObj } from "@m/utils/paramTree";
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
    },
    currentParentCpnInfo: {
      type: Object,
      default: () => ({}),
    },
    fourRAttrFlag: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      paramsDetail: {},
      currentRow: {}, // 原表格行数据的引用
      isApSource: "",
      cpnList: [],
      formData: {
        actionId: "",
        paramMappingKey: "",
        apSource: "",
        paramValue: "",
      },
      rules: {
        paramMappingKey: [
          {
            required: true,
            trigger: "change",
            validator: this.validator,
          },
        ],
      },
      tableData: [],
      paramDataList: [],
      dictionaryData: [],
      currentRadio: "",
      compositeIdMapToParamList: {},
      currentKey: "",
      bizDomainNo:"",
      assignType: "",
    };
  },
  computed: {
    assignedSourceOptions() {
      // const prev = ["assignedSource1", "assignedSource2"].includes(this.currentKey) ? [
      //   { label: "当前4b交易", value: this.currentServObj?.svcId, svcId: this.currentServObj?.svcId },
      //   { label: "固定值", value: "", svcId: "" },
      // ] : [ { label: "当前4b交易", value: this.currentServObj?.svcId, svcId: this.currentServObj?.svcId } ]
      const prev = this.fourRAttrFlag ? [
        { label: "当前4b交易", value: this.currentServObj?.svcId, svcId: this.currentServObj?.svcId },
        { label: "当前循环组件", value: this.currentParentCpnInfo?.compositeId, svcId: this.currentParentCpnInfo?.actionOwnId, actionType: this.currentParentCpnInfo?.actionType, },
      ] : [
        { label: "当前4b交易", value: this.currentServObj?.svcId, svcId: this.currentServObj?.svcId },
      ]
      return this.getDataList().reduce((prev, data) => {
        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType) && data.compositeId) {
          prev.push({
            label: data.actionName,
            // value: data.actionOwnId,
            svcId: data.actionOwnId,
            value: data.compositeId,
            actionType: data.actionType,
          })
        }
        return prev
      }, prev)
    },
    assignedSourceKeyOptions() {
      const row = this.formData
      const compositeId = this.formData?.actionId
      // const key = this.currentKey
      const dataList = this.getDataList()
      if (this.currentParentCpnInfo?.actionType == "loopAction") {
        dataList.push(...this.currentParentCpnInfo.dataList)
      }
      const item = dataList.find(data => data.compositeId && data.compositeId == compositeId)
      if ((item || compositeId == this.currentServObj?.svcId)) {
        // 在循环组件的子流程内选择了来源为当前循环组件时
        if (compositeId == this.currentParentCpnInfo.compositeId) {
          const loopListSource = this.currentParentCpnInfo?.conf?.find(item => item.name == "loopListSource").value
          const loopList = this.currentParentCpnInfo?.conf?.find(item => item.name == "loopList").value
          let paramList = []
          if (!loopListSource && loopList) {
            // 循环集合来自当前4B
            paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[this.currentServObj?.svcId]?.paramList || []))
            const loopListParamObj = paramList.find(param => param.paramDirection == "0" && packageParamKey(param, paramList) == loopList)
            if (loopListParamObj) {
              // const loopListParamList = mixList([loopListParamObj], "children")
              const loopListParamList = [loopListParamObj, ...getAllChildByParamObj(loopListParamObj, paramList)]
              return this.filterParamListByRowParamType(loopListParamList, row).map(param => {
                param.label = param.paramCName
                param.value = packageParamKey(param, paramList)
                return param
              })
            }
          } else if(loopListSource && loopList) {
            paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[loopListSource]?.paramList || []))
            const loopListParamObj = paramList.find(param => param.paramDirection == "1" && packageParamKey(param, paramList) == loopList)
            if (loopListParamObj) {
              const loopListParamList = [loopListParamObj, ...getAllChildByParamObj(loopListParamObj, paramList)]
              return this.filterParamListByRowParamType(loopListParamList, row).map(param => {
                param.label = param.paramCName
                param.value = packageParamKey(param, paramList)
                return param
              })
            }
          }
        } else {
          let paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[compositeId]?.paramList || []))
          const paramDirection = row.apSource == "00" ? "0" : "1"
          const paramParent = getParamParent(row, paramList)
          const paramType = row.paramType
          if (!["50", "60"].includes(row.apSource)) {
            // 来源不是缓存会话组件和获取会话组件时，需要根据来源类型筛选输入或者输出参数
            paramList = paramList.filter(param => param.paramDirection == paramDirection)
          }
          return this.filterParamListByRowParamType(paramList, row).map(param => {
            param.label = param.paramCName
            param.value = packageParamKey(param, paramList)
            return param
          })
        }

        // let paramList = this.compositeIdMapToParamList[compositeId]?.paramList || []
        // console.log("assignedSourceKeyOptions1")
        // return paramList.map(param => {
        //   param.label = param.paramCName
        //   param.value = this.packageParamKey(param, paramList)
        //   return param
        // }).filter(param => {
        //   if (this.assignType == "field") {
        //     return !["List", "Object"].includes(param.paramType)
        //   } else if (["List", "Object"].includes(this.assignType)) {
        //     console.log("assignedSourceKeyOptions2")
        //     return param.paramType == this.assignType
        //   }
        // })
      } else {
        return []
      }
    },
    isFixedValue() {
      return this.formData.apSource == "10"
    }
  },
  inject: ["getDataList"],
  methods: {
    validator(rule, value, callback) {
      if (rule.field == "paramMappingKey") {
        if (this.formData.apSource != "10") {
          if (!value) {
            return callback("不能为空")
          } else {
            callback()
          }
        } else {
          if (!this.formData.paramValue) {
            return callback("固定值不能为空")
          } else if (!(/^[+-]?(\d|([1-9]\d+))(\.\d+)?$/.test(this.formData.paramValue))) {
            callback("只能输入数字")
          } else {
            callback()
          }
        }
      }
    },
    isFixedValue() {
      return this.formData?.apSource == "10"
    },
    async showDialog(data, formData) {
      console.log("showDialog", data, formData)
      // this.currentKey = key
      this.currentRow = data
      this.assignType = formData.assignType
      this.formData = JSON.parse(JSON.stringify(data))
      // this.formData.actionId = data?.actionId
      // this.formData.actionName = data?.actionName
      // this.formData.apSource = data?.apSource
      // this.formData.paramMappingKey = data?.paramMappingKey
      // this.formData.paraMapgNm = data?.paraMapgNm


      // this.formData = JSON.parse(JSON.stringify(data[key]))
      // if (data[key]?.apSource != "10") {
      //   await this.updateCompositeIdMapToParamList()
      // }
      this.dialogVisible = true;
    },
    async updateCompositeIdMapToParamList() {
      const compositeId = this.formData?.actionId
      // 新拖进来的组件
      if (!this.compositeIdMapToParamList[compositeId]) {
        const dataList = this.getDataList()
        if (this.currentParentCpnInfo?.actionType == "loopAction") {
          dataList.push(...this.currentParentCpnInfo.dataList)
        }
        const data = dataList.find((item) => item.compositeId == compositeId)
        this.compositeIdMapToParamList[compositeId] = {
          svcId: data.actionOwnId,
          svcNm: data.actionName,
          paramList: [],
        }
      }
      const item = this.compositeIdMapToParamList[compositeId]
      const apiId = item?.svcId
      if (compositeId && apiId && !(this.compositeIdMapToParamList[compositeId]?.paramList?.length)) {
        const res = await this.rpc.transactionDesign.queryL5ParamAndRuleDefinitions({
          d4StusCd: "1",
          blngtoTyp: "10",
          apiId: apiId,
          d4bApiId: this.currentServObj?.svcId,
          bizDomainNo: this.currentServObj.bizLineId
          // bizDomainNo:this.bizDomainNo
        })
        this.compositeIdMapToParamList[compositeId].paramList = res.paramList
      }
    },
    closeDialog() {
      this.formData = {
        actionId: "",
        paramMappingKey: "",
        apSource: "",
        paramValue: "",
      }
      this.$refs.form.resetFields();
      // this.formData.actionId = ""
      // this.dictionaryData = []
      // this.currentRadio = ""
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
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        console.log("confirm", this.currentKey, this.currentRow, this.paramsDetail)
        const data = JSON.parse(JSON.stringify(this.formData))
        this.$emit("setResult", data)
        this.closeDialog()
      });
    },
    async selectChange(type, e) {
      console.log("selectChange", type, e)
      if (type == "actionId") {
        const item = this.assignedSourceOptions.find(item => item.value == e)
        if (item) {
          this.formData.actionId = e;
          this.formData.actionName = item.label;
          this.formData.paramMappingKey = this.formData.paraMapgNm = this.formData.apSource =  ""
          if (!e) {
            this.formData.apSource = "10"
          } else {
            // this.formData.apSource = e == this.currentServObj?.svcId ? "00" : "20"
            this.formData.apSource = actionTypeToApSource[item?.actionType]
            this.formData.paramValue = ""
          }
          this.paramsDetail = {}
        }
        if (e) {
          await this.updateCompositeIdMapToParamList()
        }
      } else if (type == "paramMappingKey") {
        const item = this.assignedSourceKeyOptions.find(item => item.value == e)
        if (item) {
          this.formData.paramMappingKey = e;
          this.formData.paraMapgNm = item.paramCName;
          this.formData.paramType = item.paramType;
          this.paramsDetail = item
        }
      }
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
    filterParamListByRowParamType(paramList, row) {
      // console.log("filterParamListByRowParamType", paramList, row)
      // const { paramType } = row
      if (["List", "Object", "Date"].includes(this.assignType)) {
        return paramList.filter(param => param.paramType == this.assignType)
      } else if (this.assignType == "field") {
        return paramList.filter(param => !["List", "Object"].includes(param.paramType))
      } else {
        return paramList
      }
    },
    init() {
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
      const dataList = this.getDataList()
      if (this.currentParentCpnInfo?.actionType == "loopAction") {
        dataList.push(...this.currentParentCpnInfo.dataList)
      }
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
      this.bizDomainNo = this.$route.query.beltLine || ""
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
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_set_result {
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
