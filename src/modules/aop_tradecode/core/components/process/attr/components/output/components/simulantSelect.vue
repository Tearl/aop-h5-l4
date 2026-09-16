<template>
  <div class="aop_tradecode_comps_design_attr_simulant_select" :style="style">
    <el-select
      v-if="flag"
      ref="elSelectRef"
      class="select_container"
      v-model="selectValue"
      placeholder="请选择"
      @change="change"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";

export default {
  mixins: [mixin],
  components: {
  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      selectValue: "",
      currentScope: {},
      currentEvent: {},
      currentPosition: {},
      compositeIdMapToParamList: {},
      transId: "",
      flag: true,
      operateType: "",//若是参数设置页签则为"paramsSet"
      paramsData: [],//存储修改后的输入输出参数
    };
  },
  computed: {
    style() {
      return {
        top: `${this.currentPosition.y || 0}px`,
        left: `${this.currentPosition.x || 0}px`,
      }
    },
    options() {
      const { label } = this.currentScope.column || {}
      if (label == "来源") {
        return this.getDataList().reduce((prev, data) => {
          if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType) && data.compositeId) {
            prev.push({
              label: data.actionName,
              // value: data.actionOwnId,
              svcId: data.actionOwnId,
              value: data.compositeId,
            })
          }
          return prev
        }, [{
          label: "当前4b交易",
          value: this.currentServObj?.svcId,
          svcId: this.currentServObj?.svcId,
        }])
      } else if (label == "来源值") {
          const { row } = this.currentScope
          const item = this.getDataList().find(data => data.compositeId && data.compositeId == row.actionId)
          if (item || row.actionId == this.currentServObj?.svcId) {
            const paramParentId = row.paramParentId || row.paramOrder
            const { paramDirection, paramType } = row
            let list = this.compositeIdMapToParamList[row.actionId]?.paramList || []
            list = list.filter((param) => (param.paramParentId == paramParentId || param.paramOrder == paramParentId) && param.paramDirection == paramDirection)
            // List、Object类型参数的来源值类型和原参数相同，其他简单类型参数的来源值类型不能为List或Object
            if (["List", "Object"].includes(paramType)) {
              list = list.filter((param) => param.paramType == paramType)
            } else {
              list = list.filter((param) => !["List", "Object"].includes(param.paramType) && param.paramCName)
            }
            return list.map(param => {
              param.label = param.paramCName
              param.value = param.paramKey
              return param
            })
          } else {
            return []
          }
      } {
        return []
      }
    }
  },
  inject: ["getDataList", "setCurrentActionId"],
  methods: {
    async change(e) {
      const { row, column } = this.currentScope
      if (column.property == "actionId") {
        row.paraMapgNm = ""
        const item = this.options.find(item => item.value == e)
        row.actionId = item?.value || e
        row.actionName = item?.label
        row.apSource = e == this.currentServObj?.svcId ? "00" : "20"
        await this.updateCompositeIdMapToParamList()
      } else if (column.property == "paraMapgNm") {
        const item = this.options.find(item => item.value == e)
        // row.paramMappingKey = item?.value || e
        // row.paraMapgNm = item?.label
        this.$set(row,"paramMappingKey",item?.value || e)
        this.$set(row,"paraMapgNm",item?.label)
      }
    },
    async updateCompositeIdMapToParamList() {
      const { row } = this.currentScope
      const compositeId = row.actionId
      const item = this.compositeIdMapToParamList[compositeId]
      const apiId = item?.svcId
      if(this.operateType == "paramsSet" && this.currentServObj?.svcId == apiId) {
        this.compositeIdMapToParamList[apiId].paramList = this.paramsData
      }
      if (compositeId && apiId && !(this.compositeIdMapToParamList[compositeId]?.paramList?.length)) {
        const res = await this.rpc.d4.queryL5ParamAndRuleDefinitions({
          d4StusCd: "1",
          blngtoTyp: "10",
          apiId: apiId,
          d4bApiId: this.currentServObj?.svcId || this.currentServObj.apiId,
          bizDomainNo: this.currentServObj.bizLineId,
        })
        this.compositeIdMapToParamList[compositeId].paramList = res.paramList
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
    async init(scope, event, type="output",paramsData=[]) {
      this.operateType = type
      this.paramsData = paramsData
      this.currentScope = scope
      this.currentEvent = event
      this.currentPosition = event.target.getBoundingClientRect()
      this.selectValue = scope.row?.paramMappingKey
      this.flag = false
      await this.updateCompositeIdMapToParamList()
      this.flag = true
      // setTimeout(() => {
      //   this.$refs.elSelectRef.toggleMenu();
      // }, 150)
      this.$nextTick(() => {
        this.$refs.elSelectRef.toggleMenu();
      })
    },
  },
  created() {
    // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
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
    }, {[this.currentServObj?.svcId]: { svcNm: apiName, svcId: this.currentServObj?.svcId, paramList: puApiParams}})
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_simulant_select {
  position: fixed;
  .select_container {
    width: 0px;
    overflow: hidden;
  }
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
