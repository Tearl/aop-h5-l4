<template>
  <div class="aop_tradecode_comps_design_attr_simulant_select" :style="style">
    <el-select
      v-if="flag"
      ref="elSelectRef"
      class="select_container"
      :class="{ 'tree_select_container': columnLabel == '来源值' }"
      v-model="selectValue"
      placeholder="请选择"
      @change="change"
      :popper-append-to-body="false"
    >
      <div v-if="columnLabel == '来源'">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >{{ getOptionsName(item) }}</el-option>
      </div>
      <div v-else-if="columnLabel == '来源值'" class="aop_tradecode_comps_design_attr_simulant_select_tree_option_container">
        <div class="search_area">
          <el-input
            v-model="formData.paramCName"
            placeholder="请输入参数名"
            size="small"
            clearable
            @input="handleInput"
          ></el-input>
        </div>
        <el-option class="select_tree_option" disabled>
          <el-tree
            ref="paramCNameTreeRef"
            :highlight-current="true"
            :data="paramCNameTree"
            :props="defaultProps"
            :default-expanded-keys="defaultExpanded"
            :current-node-key="currentKey"
            :load="loadNode"
            lazy
            node-key="paramOrder"
            :expand-on-click-node="false"
          >
            <div class="custom_tree_node" slot-scope="{ node, data }">
              <div
                :class="data.disabled ? 'disabled' : ''"
                @click.stop="handleNodeClick(data, node, 'paramCName')"
              >
                {{ data.paramCName }}
              </div>
            </div>
          </el-tree>
        </el-option>
      </div>
    </el-select>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { packageParamKey, getParamParent, mixList, getAllChildByParamObj, reList, getRelativeParamList } from "@m/utils/paramTree";
import { sourceActionType, actionTypeToApSource } from "@m/utils/normalData";
import { unduplicated } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
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
      selectValue: "",
      currentScope: {},
      currentEvent: {},
      currentPosition: {},
      compositeIdMapToParamList: {},
      transId: "",
      flag: true,
      bizDomainNo:"",
      defaultProps: {
        label: "label",
        children: "children",
        isLeaf: "leaf",
        // disabled(data, node) {
        //   return node.parent.data.paramType == "List";
        // },
      },
      defaultExpanded: [], // 树形展示序号组,
      currentKey: "",
      resolve: "",
      appId: "",
      formData: {
        paramCName: "", // 参数中文名
      },
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
      const { row } = this.currentScope
      if (label == "来源") {
        const _prev = ["List", "Object"].includes(row.paramType) ? [
          { label: "无", value: "", svcId: "" }, 
          { label: "当前4b交易", value: this.currentServObj?.svcId, svcId: this.currentServObj?.svcId }
        ] : [
          { label: "无", value: "", svcId: "" }, 
          { label: "固定值", value: "constantValue", svcId: "" },
          { label: "当前4b交易", value: this.currentServObj?.svcId, svcId: this.currentServObj?.svcId }
        ]
        if (this.currentParentCpnInfo?.actionType == "loopAction") {
          _prev.push({
            label: "当前循环组件",
            svcId: this.currentParentCpnInfo?.actionOwnId,
            value: this.currentParentCpnInfo?.compositeId,
            actionType: this.currentParentCpnInfo?.actionType,
            actionSeq:  this.currentParentCpnInfo?.conf.find(item => item.name == "actionSeq")?.value
          })
        }
        return this.getDataList().reduce((prev, data) => {
          if (sourceActionType.includes(data.actionType) && data.compositeId && data.compositeId != this.currentObj.compositeId) {
            prev.push({
              label: data.actionName,
              svcId: data.actionOwnId,
              value: data.compositeId,
              actionType: data.actionType,
              actionSeq: data.conf.find(item => item.name == "actionSeq")?.value
            })
          }
          return prev
        }, _prev)
      } else if (label == "来源值") {
          const { row } = this.currentScope
          const dataList = this.getDataList()
          if (this.currentParentCpnInfo?.actionType == "loopAction") {
            dataList.push(...this.currentParentCpnInfo.dataList)
          }
          const item = dataList.find(data => data.compositeId && data.compositeId == row.actionId)
          if (item || row.actionId == this.currentServObj?.svcId) {
            // 在循环组件的子流程内选择了来源为当前循环组件时
            if (row.actionId == this.currentParentCpnInfo.compositeId) {
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
              let paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[row.actionId]?.paramList || []))
              const paramDirection = row.apSource == "00" ? "0" : "1"
              const paramParent = getParamParent(row, paramList)
              const paramType = row.paramType
              if (!["50", "60"].includes(row.apSource)) {
                // 来源不是设置会话组件和获取会话组件时，需要根据来源类型筛选输入或者输出参数
                paramList = paramList.filter(param => param.paramDirection == paramDirection)
              }
              return this.filterParamListByRowParamType(paramList, row).map(param => {
                param.label = param.paramCName
                param.value = packageParamKey(param, paramList)
                return param
              })
            }
            // if (paramParent?.paramKey == "bodyData" && row?.paramParentId) {
            //   const bodyDataKey = row.apSource == "00" ? "bodyData" : "bodyOutData"
            //   return paramList.filter(param => {
            //     if (["List", "Object"].includes(paramType)) {
            //       return param.paramDirection == paramDirection && param.paramParentId && getParamParent(param, paramList)?.paramKey == bodyDataKey && param.paramType == paramType
            //     } else {
            //       return param.paramDirection == paramDirection && param.paramParentId && getParamParent(param, paramList)?.paramKey == bodyDataKey
            //     }
            //   }).map(param => {
            //     param.label = param.paramCName
            //     param.value = packageParamKey(param, paramList)
            //     return param
            //   })
            // } else {
            //   return paramList.filter(param => param.paramDirection == paramDirection).map(param => {
            //     param.label = param.paramCName
            //     param.value = packageParamKey(param, paramList)
            //     return param
            //   })
            // }
          } else {
            return []
          }
      } else {
        return []
      }
    },
    columnLabel() {
      return this.currentScope.column?.label
    },
    paramCNameTree() {
      const { row } = this.currentScope
      const dataList = this.getDataList()
      if (this.currentParentCpnInfo?.actionType == "loopAction") {
        dataList.push(...this.currentParentCpnInfo.dataList)
      }
      const item = dataList.find(data => data.compositeId && data.compositeId == row.actionId)
      if (item || row.actionId == this.currentServObj?.svcId) {
        // 在循环组件的子流程内选择了来源为当前循环组件时
        if (row.actionId == this.currentParentCpnInfo.compositeId) {
          const loopListSource = this.currentParentCpnInfo?.conf?.find(item => item.name == "loopListSource").value
          const loopList = this.currentParentCpnInfo?.conf?.find(item => item.name == "loopList").value
          let paramList = []
          if (!loopListSource && loopList) {
            // 循环集合来自当前4B
            paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[this.currentServObj?.svcId]?.paramList || []))
            const loopListParamObj = paramList.find(param => param.paramDirection == "0" && packageParamKey(param, paramList) == loopList)
            if (loopListParamObj) {
              loopListParamObj.paramParentId = ""
              const loopListParamList = [loopListParamObj, ...getAllChildByParamObj(loopListParamObj, paramList)]
              this.setParamListDisabledByRowParamType(loopListParamList, row)
              let paramListWithFilter = loopListParamList.map((param) => {
                param.label = param.paramCName
                param.value = packageParamKey(param, paramList)
                param.leaf = !(param?.children?.length > 0);
                return param
              }).filter(param => param.paramCName.includes(this.formData.paramCName))
              paramListWithFilter = unduplicated(getRelativeParamList(paramListWithFilter, paramList), "paramOrder")
              return reList(paramListWithFilter)
            }
          } else if(loopListSource && loopList) {
            // 循环集合来自L5服务
            paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[loopListSource]?.paramList || []))
            const loopListParamObj = paramList.find(param => param.paramDirection == "1" && packageParamKey(param, paramList) == loopList)
            if (loopListParamObj) {
              loopListParamObj.paramParentId = ""
              const loopListParamList = [loopListParamObj, ...getAllChildByParamObj(loopListParamObj, paramList)]
              this.setParamListDisabledByRowParamType(loopListParamList, row)
              let paramListWithFilter = loopListParamList.map((param) => {
                param.label = param.paramCName
                param.value = packageParamKey(param, paramList)
                param.leaf = !(param?.children?.length > 0);
                return param
              }).filter(param => param.paramCName.includes(this.formData.paramCName))
              paramListWithFilter = unduplicated(getRelativeParamList(paramListWithFilter, paramList), "paramOrder")
              return reList(paramListWithFilter)
            }
          }
        } else {
          let paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[row.actionId]?.paramList || []))
          const paramDirection = row.apSource == "00" ? "0" : "1"
          if (!["50", "60"].includes(row.apSource)) {
            // 来源不是设置会话组件和获取会话组件时，需要根据来源类型筛选输入或者输出参数
            paramList = paramList.filter(param => param.paramDirection == paramDirection)
          }
          this.setParamListDisabledByRowParamType(paramList, row)
          let paramListWithFilter = paramList.map((param) => {
            param.label = param.paramCName
            param.value = packageParamKey(param, paramList)
            param.leaf = !(param?.children?.length > 0);
            return param
          }).filter(param => param.paramCName.includes(this.formData.paramCName))
          paramListWithFilter = unduplicated(getRelativeParamList(paramListWithFilter, paramList), "paramOrder")
          return reList(paramListWithFilter)
        }
      } else {
        return []
      }
    },
  },
  inject: ["getDataList", "setCurrentActionId"],
  methods: {
    async change(e) {
      // console.log("change", e)
      const { row, column } = this.currentScope
      if (column.label == "来源") {
        if (!e) {
          row.paraMapgNm = row.paramMappingKey = row.actionId = row.actionName = row.apSource = ""
        } else if (e == "constantValue") {
          row.paraMapgNm = row.paramMappingKey = ""
          row.actionId = e
          row.actionName = "固定值"
          row.apSource = actionTypeToApSource[e]
        } else {
          row.paraMapgNm = row.paramMappingKey = ""
          const item = this.options.find(item => item.value == e)
          row.actionId = item?.value || e
          row.actionName = item?.label
          const option = this.options.find(item => item.value == e)
          if (e == this.currentServObj?.svcId) {
            row.apSource = "00"
          } else {
            row.apSource = actionTypeToApSource[option?.actionType]
          }
          // await this.updateCompositeIdMapToParamList()
        }
      } else if (column.label == "来源值") {
        const item = this.options.find(item => item.value == e)
        row.paramMappingKey = item?.value || e
        row.paraMapgNm = item?.label
      }
    },
    async updateCompositeIdMapToParamList() {
      const { row } = this.currentScope
      const compositeId = row.actionId
      const item = this.compositeIdMapToParamList[compositeId]
      const apiId = item?.svcId
      if (compositeId && item && !(item?.paramList?.length)) {
        if (apiId && ["D4bAction", "D5SelfAction", "D5LinkAction"].includes(item.actionType)) {
          const res = await this.rpc.transactionDesign.queryL5ParamAndRuleDefinitions({
            d4StusCd: "1",
            blngtoTyp: "10",
            apiId: apiId,
            d4bApiId: this.currentServObj?.svcId,
            bizDomainNo: this.currentServObj.bizLineId,
          })
          item.paramList = res.paramList
        } else if (item.actionType == "loopAction") {
          if (this.currentParentCpnInfo?.actionType == "loopAction") {
            // 在循环组件的子流程内，选择了来源为当前循环组件时
            const loopListSource = this.currentParentCpnInfo?.conf?.find(item => item.name == "loopListSource").value
            const loopList = this.currentParentCpnInfo?.conf?.find(item => item.name == "loopList").value
            const _item = this.compositeIdMapToParamList[loopListSource]
            const _apiId = _item?.svcId
            if (loopListSource && !(_item?.paramList?.length)) {
              if (_apiId && ["D4bAction", "D5SelfAction", "D5LinkAction"].includes(_item.actionType)) {
                const _res = await this.rpc.transactionDesign.queryL5ParamAndRuleDefinitions({
                  d4StusCd: "1",
                  blngtoTyp: "10",
                  apiId: _apiId,
                  d4bApiId: this.currentServObj?.svcId,
                  bizDomainNo: this.currentServObj.bizLineId,
                })
                _item.paramList = _res.paramList
              } 
            }
          } else {
            // 在主流程，选择了来源为某个循环组件时
            const res = await this.rpc.transactionDesign.getServiceCpnParams({
              d4StusCd: "1",
              blngtoTyp: "11",
              compositeId: compositeId,
            })
            item.paramList = res.paramList
          }
        } else if (item.actionType == "listAction") {
          // 在主流程，选择了来源为某个循环组件时
          const res = await this.rpc.transactionDesign.getServiceCpnParams({
            d4StusCd: "1",
            blngtoTyp: "11",
            compositeId: compositeId,
          })
          item.paramList = res.paramList
        } else if (["cacheSessionAction", "getSessionAction", "updateSessionAction"].includes(item.actionType)) {
          const res = await this.rpc.transactionDesign.querySessionParam({
            cstNo: this.currentServObj.competitorId,
            bizDomainNo: this.currentServObj.bizLineId,
            appId: this.currentServObj.relySys || this.appId,
          });
          item.paramList = res.paramList
        } else if (["uploadAction", "getCacheAction", "setCacheAction", "assignAction", 'updateCacheAction', 'autoAction', 'setHeaderAction'].includes(item.actionType)) {
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
            bizDomainNo: this.currentServObj.bizLineId
          })
          item.paramList = res.paramList
        }
      }
    },
    getOptionsName(item) {
      const { property } = this.currentScope.column
      if (property == "actionId") {
        return item.svcId == this.currentServObj?.svcId || ["无", "当前循环组件", "固定值"].includes(item.label) ? item.label : `${item.label}(${item.actionSeq})`
      } else {
        return item.label
      }
    },
    filterParamListByRowParamType(paramList, row) {
      // console.log("filterParamListByRowParamType", paramList, row)
      const { paramType } = row
      if (["List", "Object", "Date"].includes(paramType)) {
        return paramList.filter(param => param.paramType == paramType)
      } else if (paramType == "String") {
        return paramList.filter(param => !["List", "Object"].includes(param.paramType))
      } else {
        return paramList
      }
    },
    setParamListDisabledByRowParamType(paramList, row) {
      const { paramType } = row
      if (["List", "Object", "Date"].includes(paramType)) {
        paramList.forEach(param => {
          param.children = paramList.filter(_param => _param.paramParentId == param.paramOrder)
          param.disabled = param.paramType != paramType
        })
      } else {
        paramList.forEach(param => {
          param.children = paramList.filter(_param => _param.paramParentId == param.paramOrder)
          param.disabled = ["List", "Object"].includes(param.paramType)
        })
      }
    },
    //获取子级
    async loadNode(node, resolve) {
      // console.log("loadNode", node);
      this.resolve = resolve;
      if (node.level === 0) {
        return resolve(node.data);
      }
      if (node.level >= 1) {
        return resolve(node.data.children);
      }
    },
    handleNodeClick(data, node, type) {
      // console.log("handleNodeClick", data, node, type);
      if (node.data?.disabled) return
      if (type == "paramCName") {
        const { row, column } = this.currentScope
        this.currentKey = data.paramOrder;
        row.paramMappingKey = node?.data?.value
        row.paraMapgNm = node?.data?.label
        this.flag = false
      }
    },
    handleInput(e) {
      this.defaultExpanded = this.getDefaultExpanded(this.paramCNameTree)
    },
    getDefaultExpanded(list) {
      return list.reduce((prev, item) => {
        if (["List", "Object"].includes(item.paramType)) {
          prev.push(item.paramOrder)
          if (item.children?.length) {
            prev.push(...this.getDefaultExpanded(item.children))
            return prev
          }
        }
        return prev
      }, [])
    },
    async init(scope, event) {
      this.currentScope = scope
      this.currentEvent = event
      this.currentPosition = event.target.getBoundingClientRect()
      const { property } =  scope.column
      if (property == "paraMapgNm") {
        this.selectValue = scope.row.paramMappingKey
      } else {
        this.selectValue = scope.row[property]
      }
      this.formData = {
        paramCName: "", // 参数中文名
      }
      this.flag = false
      await this.updateCompositeIdMapToParamList()
      this.flag = true
      // setTimeout(() => {
      //   this.$refs.elSelectRef.toggleMenu();
      // }, 150)
      this.$nextTick(() => {
        this.$refs.elSelectRef.toggleMenu();
        if (this.columnLabel == "来源值") {
          const { row } = this.currentScope
          let paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[row.actionId]?.paramList || []))
          const paramParent = getParamParent(row, paramList)
          if (paramParent) {
            if (["bodyData", "bodyOutData"].includes(paramParent.paramKey)) {
              // 默认展开body
              // console.log("默认展开body")
              const items = this.paramCNameTree.filter(param => !param.paramParentId && (["bodyOutData"].includes(param.paramKey) || param.paramKey == paramParent.paramKey))
              if (items?.length) {
                this.defaultExpanded = items.map(item => item.paramOrder)
              }
            } else {
              // 默认展开报文头
              // console.log("默认展开报文头")
              const items = this.paramCNameTree.filter(param => !param.paramParentId && (["resHeaderData"].includes(param.paramKey) || param.paramKey == paramParent.paramKey))
              if (items?.length) {
                this.defaultExpanded = items.map(item => item.paramOrder)
              }
            }
          }
        }
      })
    },
  },
  created() {
    // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
    this.appId = this.$route.query.appId
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
    .select_tree_option {
      min-width: 150px !important;
      min-height: 200px !important;
      padding: 0 !important;
      margin: 0;
      overflow: auto;
      cursor: default !important;
      .custom_tree_node {
        position: relative;
        width: 100%;
        .disabled {
          color: #ccc;
        }
      }
    }
    .search_area {
      padding: 0 10px 8px;
    }
  }
  .tree_select_container {
    ::v-deep .el-scrollbar {
      .el-scrollbar__bar {
        &.is-vertical {
          display: none;
        }
      }
    }
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
