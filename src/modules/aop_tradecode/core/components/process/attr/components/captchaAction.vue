<template>
  <div class="aop_tradecode_comps_design_attr_service">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>
          <span>校验验证码组件</span>
        </div>
      </div>
      <div class="attr_box">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t">组件名称：</div>
            <div class="attr_show_item_c">
              <el-input
                v-model="formData.actionDesc"
                size="mini"
                placeholder="请输入"
              ></el-input>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">组件描述：</div>
            <div class="attr_show_item_c">
              <el-input
                type="textarea"
                v-model="formData.actionMsg"
                placeholder="组件描述"
                size="mini"
              ></el-input>
            </div>
          </div>
        </div>

        <div class="attr_send">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b bold">输入参数</div>
            <!-- <el-checkbox v-model="isNeedCheck" @change="isNeedChange">非必输项</el-checkbox>
            <el-checkbox v-model="headerCheck">非报文头</el-checkbox> -->
            <div class="attr_show_item_b">
              <i class="el-icon-more" @click="switchTableMode('inputAtSetting')"></i>
            </div>
          </div>
          <div class="attr_show_item_c">
            <Table
              class="table input_list"
              :data="inputParamsListAtSetting"
              :table="inputParamsColumnAtSetting"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
              @switchChange="switchChange"
              @inputChange="inputChange"
              @selectFocus="selectFocus"
              @selectChange="selectChange"
              @selectBlur="selectBlur"
              @operate="operate"
              @autocompleteSelect="autocompleteSelect"
              @fetchsSuggestions="fetchsSuggestions"
              @inputClick="inputClick"
              :rowClass="rowClass"
            ></Table>
          </div>
        </div>
        <!-- <div class="transition_arrange read">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">条件编排</div>
              <el-button
                v-if="canSave"
                type="primary"
                size="mini"
                class="mt10"
                @click="addOutputTargetLine"
              >添加一行</el-button>
            </div>
          </div>

          <div class="attr_recive mb20">
            <div class="attr_show_item_c">
              <Table
                class="table"
                :data="outputTargetList"
                :table="outputTargetColumn"
                @operate="outputTargetOperate"
                @selectChange="outputTargetSelectChange"
              ></Table>

            </div>
          </div>
        </div> -->
        <div class="transition_arrange">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="transition_arrange_title">
                <div class="attr_pre_title_b bold">执行规则</div>
                <button class="allocBtn" v-if="canSave" @click="addExecutionStep">
                    <div class="icon" />
                    <span>添加执行步骤</span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="!executionSteps.length" class="empty_execution_step">暂无执行规则</div>
          <conditionalBranch
            v-else
            v-for="(item, index) in executionSteps"
            :key="index"
            :ref="'conditionalBranch' + index"
            :compSeqNo="index"
            :sequence="index + 1"
            :isRead="true"
            :baseBranchInfo="item"
            :currentCompInfo="currentCompInfo" 
            :currentServObj="currentServObj"
            :isComponent="true"
            :executeLength="executionSteps.length"
            @operate="selectOperate"
            @compDel="compDel"
          />
        </div>
        <div
          class="exception_message"
        >
          <div class="attr_show">
            <div v-if="!isRead">
              <div class="tips_info" v-if="!canSave">
                <el-tag type="warning">保存交易编排后，可对组件信息进行编辑</el-tag>
              </div>
            </div>
            <div
              v-if="canSave"
              class="attr_btn"
            >
              <el-button
                type="primary"
                size="small"
                :disabled="disabled"
                @click="saveServiceCpnParams"
                class="right_button"
                >保存</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输出目标-选择输出字段 -->
    <!-- <SelectOutputField
      ref="selectOutputFieldRef"
      :currentServObj="currentServObj"
      @setOutputTarget="setOutputTarget"
    ></SelectOutputField> -->
    <!-- 拟态的下拉选择框 -->
    <SimulantSelect
      @update="updateData"
      @updateTableData="updateTableData"
      @changeEnumOption="changeEnumOption"
      ref="simulantSelectRef"
      :currentServObj="currentServObj"
      :currentObj="currentObj"
      :currentParentCpnInfo="currentParentCpnInfo"
      :fourRAttrFlag="fourRAttrFlag"
      :serviceIdMapToParamList="serviceIdMapToParamList">
    </SimulantSelect>
    <!-- 输出目标-选择输出字段 -->
    <SelectOutputField
      ref="selectOutputFieldRef"
      :currentServObj="currentServObj"
      @setOutputTarget="setOutputTarget"
    ></SelectOutputField>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table_workgate";
import SelectOutputField from "./service_setting/selectOutputField"
// import SelectOutputPostSeq from "./service_setting/selectOutputPostSeq"
import SimulantSelect from "./service_setting/simulantSelect"
import RuleTable from "@m/core/components/rule_table";
import conditionalBranch from "@m/core/components/service_design/components/ConditionalBranch"
// import SelectTempParams from "./select_temp_params"
import { mixList, reList, packageParamKey } from "@m/utils/paramTree";
import filters from "@m/utils/filters";
import {
  sourceActionType,
  actionTypeToApSource,
  actionNameToNoActionId,
  actionTypToArrangeEnum,
} from "@m/utils/normalData";

export default {
  mixins: [mixin],
  components: {
    Table,
    SelectOutputField,
    // SelectOutputPostSeq,
    RuleTable,
    // SelectTempParams,
    SimulantSelect,
    SelectOutputField,
    conditionalBranch
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
    isRead: {
      type: Boolean,
      default: () => false,
    },
    serviceIdMapToParamList: {
      type: Object,
      default: () => ({}),
    },
    fourRAttrFlag: {
      type: Boolean,
      default: () => false,
    },
    currentParentCpnInfo: {
      type: Object,
      default: () => ({}),
    },
    showTips: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {
      //服务活动基本信息数据
      formData: {
        svcNm: "", // 服务名称
        svcTpCd: "", // 服务类型
        svcId: "", // 编号
        svcDesc: "", // 描述
        svcVersionNo: "", // 版本号
        actionMsg: ''
      },
      
      serviceformData: {
        actionId: "",
      },
      confFormData: {
        actionDesc: "", // 名称
        svcId: "", // 服务id
        actionSeq: "", // 位置序号
        actionFrntSeq: "", // 前置序号
        actionPostSeq: "", // 后置序号
      },
      // 组件信息的配置项
      confKeyList: [
        { key: "actionDesc", value: "" }, // 名称
        { key: "svcId", value: "" }, // 服务id
        { key: "svcNo", value: "" }, // 服务编码
        { key: "actionSeq", value: "" }, // 位置序号
        { key: "actionFrntSeq", value: "" }, // 前置序号
        { key: "actionPostSeq", value: "" }, // 后置序号
      ],
      // 控制设置页签下的输入参数列表显示或隐藏
      inputParamsVisibleAtSetting: true,
      // 控制设置页签下的输出参数列表显示或隐藏
      outputParamsVisibleAtSetting: true,
      // 设置页签下的输入参数表格数据
      inputParamsListAtSetting: [],
      // 设置页签下的输出参数表格数据
      outputParamsListAtSetting: [],
      ruleInfo: {},
      layoutActionList: [],
      outputTargetList: [],
      cpnParamsRecord: "[]",
      dataList: [],
      showAllInputParamsAtSetting: false,
      showAllOutputParamsAtSetting: true,
      paramValueSelect: [],
      svcIdToSvcNm: {},
      transId: "",
      bodyOutData: [],
      showServInfoFlag: false,
      operateType: '',
      disabled: true,
      compositeIdMapToParamList: {},
      outputTargetList: [],
      executionSteps: [],
      currentCompInfo: {},
      customChanged: false
    };
  },
  computed: {
    outputTargetColumn() {
      if (this.canSave) {
        return [
          {
            prop: "actionId",
            label: "来源",
            minWidth: "25%",
            type: "select",
            disabled: () => {
              // return true
            },
            placeholder: "请选择",
            selectVal: () => {
              return this.getDataList().reduce((prev, data) => {
                if (sourceActionType.includes(data.actionType)  && data.compositeId) {
                  const actionSeq = data.conf.find(item => item.name == "actionSeq")?.value || ""
                  prev.push({
                    type: `${data.actionName}(${actionSeq})`,
                    value: data.compositeId
                  })
                }
                return prev
              }, [{ type: "当前4b交易", value: this.currentServObj?.svcId }])
            },
            clearable: "false"
          },
          {
            prop: "paramNm",
            label: "返回字段",
            minWidth: "20%",
            type: "textClick",
            // align: "center",
            tooltip: true,
            operate: "paramNm1",
            filter(scope) {
              return scope.row.paramNm || "选择"
            },
          },
          {
            prop: "condTyp",
            label: "对比关系",
            // minWidth: "15%",
            width: "100",
            type: "select",
            selectVal: (row) => {
              if (["List", "Object"].includes(row.paramType)) {
                return [
                  { type: "=", value: "=" },
                  { type: "!=", value: "!=" },
                ]
              } else {
                return [
                  { type: "=", value: "=" },
                  { type: ">", value: ">" },
                  { type: ">=", value: ">=" },
                  { type: "<", value: "<" },
                  { type: "<=", value: "<=" },
                  { type: "!=", value: "!=" },
                ]
              }
            },
            clearable: "false"
            // tooltip: true,
          },
          {
            prop: "paramValueSrcActionId",
            label: "来源",
            minWidth: "25%",
            type: "select",
            placeholder: "请选择",
            disabled: () => {
              // return true
            },
            selectVal: () => {
              return this.getDataList().reduce((prev, data) => {
                if (sourceActionType.includes(data.actionType)  && data.compositeId) {
                  const actionSeq = data.conf.find(item => item.name == "actionSeq")?.value || ""
                  prev.push({
                    type: `${data.actionName}(${actionSeq})`,
                    value: data.compositeId
                  })
                }
                return prev
              }, [{ type: "当前4b交易", value: this.currentServObj?.svcId }, { type: "固定值", value: '10' }])
            },
            // selectVal: () => {
            //   return this.getDataList().reduce((prev, data) => {
            //     if (data.compositeId === this.currentObj.compositeId) {
            //       const actionSeq = data.conf.find(item => item.name == "actionSeq")?.value || ""
            //       prev.push({
            //         type: `${data.actionName}(${actionSeq})`,
            //         value: data.compositeId
            //       })
            //     }
            //     this.currentObj.compositeId
            //     return prev
            //   }, [{ type: "固定值", value: '10' }])
            // },
            clearable: "false"
          },
          {
            prop: "paramValue",
            label: "对比值",
            minWidth: "25%",
            type: "inputText",
            placeholder: "请输入",
            operate: 'paramNm2',
            disabled: (scope) => ["List", "Object"].includes(scope.row.paramType),
            filter(scope) {
              return scope.row.paramValueNm || "选择"
            },
          },
          {
            prop: "actionPostSeq",
            label: "后续顺序号",
            // minWidth: "30%",
            width: "150",
            type: "select",
            // align: "center",
            selectVal: () => {
              const dataList = this.getDataList();
              // 筛选出并发组件内的组件id
              const concurrentInnerActionIdList = dataList.reduce((prev, data) => {
                if (data.actionType == "concurrentAction") {
                  const conf = this.getConfItem("subcomponent", data.actionId)
                  const subcomponent = JSON.parse((conf.value || "[]"))
                  return prev.concat(subcomponent)
                }
                return prev
              }, [])
              let list = dataList.reduce((prev, item) => {
                const actionSeq = item.conf.find(e => e.name == "actionSeq")?.value
                if (actionSeq && item.actionId != this.currentObj.actionId && !["containerAction"].includes(item.actionType) && !concurrentInnerActionIdList.includes(item.actionId)) {
                  prev.push({
                    type: actionSeq,
                    value: actionSeq,
                  })
                }
                return prev
              }, [])
              list.sort((a, b) => {
                let actionSeqs = [a.value, b.value]
                actionSeqs = actionSeqs.map((item) => {
                  if (item.includes("-")) {
                    const arr = item.split("-")
                    item = arr[0].slice(1) * 1 + arr[1].slice(1) * 0.0001
                  } else {
                    item = item.slice(1) * 1
                  }
                  return item
                })
                return actionSeqs[0] - actionSeqs[1];
              });
              list = list.filter((item) => {
                return !item.type.includes('位置序号')
              })
              if (this.confFormData.errorCode) {    
                list.push({type: '异常组件', value: 'EX001'})
              }
              // console.log('listppppp', list)
              return list
            },
          },
          {
            label: "操作",
            type: "button",
            // minWidth: "10%",
            width: "60",
            buttonList: [
              {
                desc: "删除",
                operate: "delete",
              },
            ],
          },
        ]
      } else {
        return [
          {
            prop: "actionId",
            label: "来源",
            minWidth: "25%",
            type: "select",
            disabled: () => {
              return true
            },
            placeholder: "请选择",
            selectVal: () => {
              return this.getDataList().reduce((prev, data) => {
                if (data.compositeId === this.currentObj.compositeId) {
                  const actionSeq = data.conf.find(item => item.name == "actionSeq")?.value || ""
                  prev.push({
                    type: `${data.actionName}(${actionSeq})`,
                    value: data.compositeId
                  })
                }
                this.currentObj.compositeId
                return prev
              }, [{ type: "固定值", value: '10' }])
            },
            clearable: "false"
          },
          {
            prop: "paramNm",
            label: "返回字段",
            minWidth: "20%",
            type: "text",
            // align: "center",
            tooltip: true,
            // operate: "paramNm1",
            filter(scope) {
              return scope.row.paramNm || "选择"
            },
          },
          {
            prop: "condTyp",
            label: "对比关系",
            // minWidth: "15%",
            width: "100",
            type: "select",
            disabled: () => {
              return true
            },
            selectVal: (row) => {
              if (["List", "Object"].includes(row.paramType)) {
                return [
                  { type: "=", value: "=" },
                  { type: "!=", value: "!=" },
                ]
              } else {
                return [
                  { type: "=", value: "=" },
                  { type: ">", value: ">" },
                  { type: ">=", value: ">=" },
                  { type: "<", value: "<" },
                  { type: "<=", value: "<=" },
                  { type: "!=", value: "!=" },
                ]
              }
            },
            clearable: "false"
            // tooltip: true,
          },
          {
            prop: "paramValueSrcActionId",
            label: "来源",
            minWidth: "25%",
            type: "select",
            placeholder: "请选择",
            disabled: () => {
              return true
            },
            selectVal: () => {
              return this.getDataList().reduce((prev, data) => {
                if (sourceActionType.includes(data.actionType)  && data.compositeId) {
                  const actionSeq = data.conf.find(item => item.name == "actionSeq")?.value || ""
                  prev.push({
                    type: `${data.actionName}(${actionSeq})`,
                    value: data.compositeId
                  })
                }
                return prev
              }, [{ type: "当前4b交易", value: this.currentServObj?.svcId }, { type: "固定值", value: '10' }])
            },
            clearable: "false"
          },
          {
            prop: "paramValue",
            label: "对比值",
            minWidth: "25%",
            type: "text",
            placeholder: "请输入",
            operate: 'paramNm2',
            disabled: () => {
              return true
            },
            disabled: (scope) => ["List", "Object"].includes(scope.row.paramType),
            filter(scope) {
              return scope.row.paramValueNm || "选择"
            },
          },
        ]
      }
    },
    options() {
      return this.getDataList().reduce((prev, data) => {
        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType) && data.compositeId) {
          console.log(data, "data")
          prev.push({
            label: data.actionName,
            svcId: data.actionOwnId,
            value: data.compositeId,
            actionSeq: data.conf.find(item => item.name == "actionSeq")?.value
          })
        }
        return prev
      }, [])
    },
    // 设置页签 输入参数表格
    inputParamsColumnAtSetting() {
      if(this.canSave) {
        return [
          {
            prop: "paramKey",
            label: "参数Key",
            minWidth: "25%",
            type: "text",
            tooltip: true,
          },
          {
            prop: "paramName",
            label: "参数名称",
            minWidth: "20%",
            type: "text",
            tooltip: true,
          },
          {
            prop: "paramType",
            label: "参数类型",
            width: "70",
            // minWidth: "15%",
            type: "text",
            tooltip: true,
          },
          {
            // prop: "apSource", // 当前4b交易00 L5服务20
            prop: "actionId",
            label: "来源",
            minWidth: "30%",
            type: "simulantSelect",
            placeholder: "请选择",
            inputStyle: {
              cursor: "pointer",
            },
            disabled: (scope) => {
              // if (scope.row.actionName !== '复合来源' && scope.row.paramParentId) {
              //   return true
              // } else {
              //   return false
              // }
              return scope.row.disabled2
            },
            filter: (scope) => {
              const { actionName, actionId, paraMapgNm } = scope.row
              if (actionId == 'constantValue') {
                // return '枚举值'
                if (paraMapgNm && paraMapgNm.includes('.') || this.customChanged) {
                  return '枚举值'
                }
                
              } else if(actionId == '03') {
                return '固定值'
              } else if (!actionName && !actionId) {
                return ""
              } else if (["当前4b交易", "当前循环组件", "固定值", '复合来源'].includes(actionName)) {
                return actionName
              } else {
                const item = this.getDataList().find(data => data.compositeId == actionId)
                if (item) {
                  const actionSeq = this.getConfItem("actionSeq", item.actionId)?.value
                  return `${actionName}(${actionSeq})`
                } else {
                  return scope.row.actionId
                }
              }
            },
          },
          {
            disabled: (scope) => {
              // if (scope.row.actionName !== '复合来源' && scope.row.paramParentId) {
              //   return true
              // } else {
              //   return false
              // }
              return scope.row.disabled3
            },
            prop: (row) => {
              if (row?.actionId == "03") {
                return "paramMappingKey"
              } else {
                return "paraMapgNm"
              }
            },
            label: "来源值",
            minWidth: "30%",
            type: (row) => {
              if (row.paraMapgNm.includes('.') || this.customChanged) {
                  return "simulantSelect"
                } else if (row.actionId == "03") {
                return "input"
              }  else {
                return "simulantSelect"
              }
            },
            placeholder: "请选择",
            inputStyle: {
              cursor: "pointer",
            },
          },
          {
            prop: "isNeed",
            label: "是否必输",
            // minWidth: "15%",
            width: "70",
            type: "text",
            tooltip: true,
            align: "center",
            filter: "paraNed",
          },
          {
            // prop: "paraMapgNm",
            prop: "paramValue",
            label: "缺省值",
            width: "70",
            // minWidth: "15%",
            type: "text",
            align: "center",
          },
        ].filter(item => this.showAllInputParamsAtSetting || ["参数Key", "参数名称", "来源", "来源值"].includes(item.label))
      } else {
        return [
          {
            prop: "paramKey",
            label: "参数Key",
            minWidth: "30%",
            type: "text",
            tooltip: true,
          },
          {
            prop: "paramName",
            label: "参数名称",
            minWidth: "25%",
            type: "text",
            tooltip: true,
          },
          {
            prop: "paramType",
            label: "参数类型",
            width: "70",
            // minWidth: "15%",
            type: "text",
            tooltip: true,
          },
          {
            // prop: "apSource", // 当前4b交易00 L5服务20
            prop: "actionId",
            label: "来源",
            minWidth: "25%",
            type: "text",
            tooltip: true,
            filter: (scope) => {
              const { actionName, actionId } = scope.row
              if (!actionName && !actionId) {
                return ""
              } else if (["当前4b交易", "当前循环组件", "固定值"].includes(actionName)) {
                return actionName
              } else {
                const item = this.getDataList().find(data => data.compositeId == actionId)
                if (item) {
                  const actionSeq = this.getConfItem("actionSeq", item.actionId)?.value
                  return `${actionName}(${actionSeq})`
                } else {
                  return scope.row.actionId
                }
              }
            },
          },
          {
            prop: "paraMapgNm",
            label: "来源值",
            minWidth: "25%",
            type: "text",
            tooltip: true,
            filter: (scope) => {
              if (scope.row?.actionId == "constantValue") {
                return scope.row.paramMappingKey
              } else {
                return scope.row.paraMapgNm
              }
            },
          },
          {
            prop: "isNeed",
            label: "是否必输",
            // minWidth: "15%",
            width: "70",
            type: "text",
            tooltip: true,
            align: "center",
            filter: "paraNed",
          },
          {
            // prop: "paraMapgNm",
            prop: "paramValue",
            label: "缺省值",
            // minWidth: "15%",
            width: "70",
            type: "text",
            align: "center",
          },
        ].filter(item => this.showAllInputParamsAtSetting || ["参数Key", "参数名称", "来源", "来源值"].includes(item.label))
      }
    },
    canSave() {
      return !this.isRead && this.currentObj.compositeId && !this.showServInfoFlag
    }
  },
  inject: ["getDataList", "setCurrentActionId"],
  methods: {
    changeEnumOption() {
      this.customChanged = true
    },
    addExecutionStep() {
      this.executionSteps.push(
        {
          tranId: this.fourRAttrFlag ? this.currentParentCpnInfo.compositeId : this.currentServObj?.svcId,
          startActionId: this.currentCompInfo?.compositeId,
          endActionId: "",
          interfaceProcessActionLayoutRelList: '[]'
        }
      )
    },
    /**
     * 表格操作项
     */
    selectOperate(operate, info, index) {
      this.outputTargetOperate(operate, info, index)
    },
    /**组件删除 */
    compDel(seqNo) {
      this.executionSteps.splice(seqNo, 1)
    },
    /**
     * 执行规则编排保存
     */
    commitSameStartActionLayoutRel(e) {
      let list = []
      this.executionSteps.forEach((e, index) => {
        let branchRef = this.$refs['conditionalBranch' + index]
        let branchData = branchRef[0].dataOutput()
        list.push({
          ...branchData,
          priorityLevel: index + 1
        })
      })
      e.branchList = list
    },
    /**
     * 获取执行规则和异常信息
     */
    getBranchErrorList(list) {
      this.executionSteps = []
      list.forEach(e => {
        if(e.condition.endActionType == '00') {
          this.executionSteps.push(e.condition)
        }
      })
    },
    getactionPostSeq() {
      const dataList = this.getDataList();
      // 筛选出并发组件内的组件id
      const concurrentInnerActionIdList = dataList.reduce((prev, data) => {
        if (data.actionType == "concurrentAction") {
          const conf = this.getConfItem("subcomponent", data.actionId)
          const subcomponent = JSON.parse((conf.value || "[]"))
          return prev.concat(subcomponent)
        }
        return prev
      }, [])
      const list = dataList.reduce((prev, item) => {
        const actionSeq = item.conf.find(e => e.name == "actionSeq")?.value
        if (actionSeq && item.actionId === this.currentObj.actionId && !["containerAction"].includes(item.actionType) && !concurrentInnerActionIdList.includes(item.actionId)) {
          prev.push({
            type: actionSeq,
            value: actionSeq,
          })
        }
        return prev
      }, [])
      list.sort((a, b) => {
        let actionSeqs = [a.value, b.value]
        actionSeqs = actionSeqs.map((item) => {
          if (item.includes("-")) {
            const arr = item.split("-")
            item = arr[0].slice(1) * 1 + arr[1].slice(1) * 0.0001
          } else {
            item = item.slice(1) * 1
          }
          return item
        })
        return actionSeqs[0] - actionSeqs[1];
      });
      return list
    },
    outputTargetSelectChange(row, prop) {
      console.log("outputTargetSelectChange", row, prop)
      if (prop == "paramNm") {
        const item = this.formData.paramList.find(item => item.paramCName == row.paramNm)
        row.paramKey = item.paramKey
      } else if (prop == "actionId") {
        row.paramKey = ""
        row.paramNm = ""
        row.actionNm = this.svcIdToSvcNm[row.actionId]
      } else if (prop == "paramValueSrcActionId") {
        row.paramValue = ''
        row.paramValueNm = ''
        if (row.paramValueSrcActionId === '10') {
          row.elementType = 'input'
        } else {
          row.elementType = 'text'
        }
      }
    },
    // 输出目标-增加行
    addOutputTargetLine() {
      console.log("addOutputTargetLine", this.currentObj)
      const row = JSON.parse(JSON.stringify(this.layoutActionList[0] || {}))
      row.svcId = row.svcId || this.currentObj.svcId
      row.tranId = row.tranId || this.currentServObj?.svcId
      row.actionId = ''
      row.actionNm = this.currentObj.actionName
      console.log(row.actionId, row.actionNm)
      row.postLoSeqNo = ""
      row.actionPostSeq = ''
      row.paramKey = ""
      row.paramNm = ""
      row.condTyp = "="
      row.paramValue = ""
      row.paramValueSrcActionId = ''
      row.paramKeySrcType = ''
      row.paramValueSrcType = ''
      console.log(row.paramValueSrcActionId, row.actionId, "sssssss")
      this.outputTargetList.push(row)
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    },
    outputTargetOperate(operation, data) {
      console.log("outputTargetOperate", operation, data)
      if (operation == "paramNm1") {
        this.$refs.selectOutputFieldRef.showDialog(data)
        this.targetData = data
        this.targetData.operation = 'paramNm1'
      } else if (operation == "paramNm2") {
        this.$refs.selectOutputFieldRef.showDialog({
          actionId: data.paramValueSrcActionId
        })
        this.targetData = data
        this.targetData.operation = 'paramNm2'
      } else if (operation == "actionPostSeq") {
        this.$refs.selectOutputPostSeqRef.showDialog(data)
      } else if (operation == "delete") {
        const index = this.outputTargetList.indexOf(data)
        this.outputTargetList.splice(index, 1)
      }
    },
   async handleSelectChange(e) {
      this.confFormData.actionId = e
      await this.updateCompositeIdMapToParamList()
      console.log(this.compositeIdMapToParamList, 'pppppppppppppppp')
      const paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[e].paramList))
      // paramList.forEach(param => {
      //   param.paramKey = packageParamKey(param, paramList)
      // })
      // 选择当前4B的输入参数或者L5服务的输出参数
      const paramDirection = '0'
      this.inputParamsListAtSetting = reList(paramList?.filter((item) => item.paramDirection == paramDirection))
      this.setDisabled(this.inputParamsListAtSetting)
      console.log(this.inputParamsListAtSetting, "inputParamsListAtSetting")
      this.inputParamsListAtSetting.forEach((item) => {
        console.log(item.paramKey)
        if (item.paramKey === 'bodyData') {
          this.setParamDisabled(item)
        }
      })
    },
    getOptionsName(item) {
      return item.svcId == this.currentServObj?.svcId ? item.label : `${item.label}(${item.actionSeq})`
    },
    setParamDisabled(item) {
      item.disabled2 = true
      item.disabled3 = true
      if (item.children && item.children.length) {
        item.children.forEach((child) => {
          this.setParamDisabled(child)
        })
      }
    },
    updateTableData() {
      this.inputParamsListAtSetting = [...this.inputParamsListAtSetting]
    },
    updateData(target, source) {
      target?.children?.map((item1) => {
        source?.children?.map((item2) => {
          if (item1.paramKey === item2.paramKey) {
            item1.paramMappingKey = target.paramMappingKey + '.' + item2.paramKey
            item1.paraMapgNm = item2.paramName
            item1.actionId = target.actionId
            item1.actionName = target.actionName
            item1.apSource = target.apSource
            console.log(item1.actionId, 'actionId')
          }
        })
      })
      this.inputParamsListAtSetting = [...this.inputParamsListAtSetting]
    },
    //反案例切换
    switchChange(e, o) {
      console.log("switchChange", e, o)
    },
    // 反显输入报文
    inputChange(e, o) {
      console.log("inputChange", e, o)
    },
    // 选择框获得焦点时触发
    selectFocus(e, p) {
      console.log("selectFocus", e, p)
      if (p == "paramValue") {
        this.paramValueSelect = [];
        const params = {
          dictryNo: e.paramKey,
          sysId: this.formData.sysId,
        };
        this.rpc.apimgmt.getDictryNoExampleList(params).then((res) => {
          if(res.enumList.length > 0) {
            this.isEnumList = true
            this.paramValueSelect = res.enumList.map(
              (item,index) => {
                return {
                  value: item.key + "- " + item.value,
                };
              }
            );
          } else {
            this.isEnumList = false
            this.paramValueSelect = res.exampleValueList.map(
              (item) => {
                return {
                  value: item,
                };
              }
            );
          }
        });
        return;
      }
    },
    selectChange(row, prop) {
      console.log("selectChange", row, prop)
      if (prop == "apSource") {
        row.paraMapgNm = ""
      } else {
      }
    },
    selectBlur(e, row) {
      console.log("selectBlur", e, row)
      if (!e) return;
      row.paramValue = e.target.value;
      this.inputChange(row);
    },
    operate(operation, data) {
      console.log("显示临时参数选择弹窗", data)
      this.dataList = this.getDataList()
      // this.getDataList()
      this.$nextTick(() => {
        this.$refs.tempParamsRef.initParams(this.currentServObj, data)
      })
    },
    autocompleteSelect(row) {
      if(row.apSource == "99" && this.isEnumList) {
        row.paramValue = row.paramValue.split("-")[0]
      } 
      console.log(row);
    },
    fetchsSuggestions(queryString,cb) {
      const restaurants = this.paramValueSelect;
      const results = queryString ? restaurants.filter((item) => {return item.value.indexOf(queryString) != -1}) : restaurants;
      cb(results)
    },
    rowClass({row}) {
      if(this.isNeedCheck && row.isNeed == "0") {
        return "wraning_row"
      } 
      if(this.headerCheck && row.paramPosition != "0") {
        return "wraning_row"
      }
      return ""
    },
    async saveServiceCpnParams() {
      const e = this.currentObj
      for (let i = 0; i < this.inputParamsListAtSetting.length; i++) {
        const item = this.inputParamsListAtSetting[i];
        if (!item.paramMappingKey) {
          return this.$message.error('来源、来源值不能为空')
        }
        if (item.actionId === '' && !item.actionName) {
          return this.$message.error('来源、来源值不能为空')
        }
      }
      let paramList = JSON.parse(JSON.stringify(mixList(this.inputParamsListAtSetting, "children").concat(mixList(this.outputParamsListAtSetting, "children"))))
      paramList.forEach((item) => {
        if (actionNameToNoActionId.includes(item.actionName)) {
          item.actionId = ""
        }
        if (item.actionName === '获取会话组件') {
          item.actionId = 'getSessionInfo'
          item.apSource = "60"
        }
        if (item.actionName === '复合来源') {
          item.actionId = 'complex'
        }
        if (item.actionName === '固定值') {
          item.apSource = '10'
        }
      })
      const tfrCdtnCd = this.outputTargetList.reduce((prev, item) => {
        // paramValueType 参数值类型
        // paramKeySrcType 参数Key来源类型
        // paramValueSrcType 参数值来源类型
        // paramValueSrcActionId 参数值来源组件ID
        let paramKeySrcType = ''
        if (item.actionId === this.currentServObj?.svcId) {
          paramKeySrcType = '00'
        } else {
          paramKeySrcType = '20'
        }
        const id = item.paramValueSrcActionId
        let paramValueSrcType = ''
        if (id === '10') {
          paramValueSrcType = '10'
        } else if (id === this.currentServObj?.svcId) {
          paramValueSrcType = '00'
        } else {
          paramValueSrcType = '20'
        }
        prev.push({
          actionId: item.actionId,
          actionNm: item.actionNm,
          paramKey: item.paramKey,
          paramNm: item.paramNm,
          paramType: item.paramType,
          condTyp: item.condTyp,
          paramValue: item.paramValue,
          actionPostSeq: item.actionPostSeq,
          paramValueType: item.paramValueType,
          paramKeySrcType: paramKeySrcType,
          paramValueSrcType: paramValueSrcType,
          paramValueSrcActionId: item.paramValueSrcActionId === '10' ? '' : item.paramValueSrcActionId,
          paramValueNm: item.paramValueNm,
        })
        return prev
      }, [])
      if (tfrCdtnCd.length) {
        const keyToErrorMessage = {
          actionId: "来源不能为空",
          paramKey: "返回字段不能为空",
          paramNm: "返回字段不能为空",
          condTyp: "对比关系不能为空",
          paramValue: "对比值不能为空",
          actionPostSeq: "后续顺序号不能为空",
        }
        for (let key in keyToErrorMessage) {
          if (tfrCdtnCd.some(item => !item[key])) return this.$message.error(keyToErrorMessage[key])
        }
      }
      const layoutServiceBeanList = {
        svcId: this.currentObj.actionOwnId,
        actionKey: "",
        actionId: this.currentObj.compositeId,
        actionNm: this.currentObj.actionName,
        actionTyp: actionTypToArrangeEnum['captchaAction'],
        loSeqNo: "",
        frntLoSeqNo: "",
        postLoSeqNo: "",
        tranId: this.currentServObj?.svcId,
        tfrCdtnCd: JSON.stringify(tfrCdtnCd),
        layoutActionList: []
      }
      console.log(e.conf, "e.conf.find")

      const confList = this.confKeyList.map((item) => {
        const confKey = item.key;
        const confValue = this.confFormData[item.key] || item.value;
        const target = e.conf.find((conf) => conf.name == confKey);
        if (!target) {
          // 给flow中的数据补上缺失的配置项
          e.conf.push({
            name: confKey,
            value: confValue,
          })
        }
        return {
          confKey: confKey,
          confValue: confValue,
          confId: "",
          confDescr: "",
          compositeId: e.compositeId || "",
        }
      })
      // let arr = []
      // for (let i = 0; i < confList.length; i++) {
      //   const item = confList[i];
      //   if (item.confKey !== 'actionFrntSeq' && item.confKey !== 'actionPostSeq' && item.confKey !== 'cacheKey') {
      //     arr.push(item)
      //   }
      // }
      const params = {
        d4StusCd: "1",
        blngtoTyp: "10",
        // apiId: e.svcId || e.actionOwnId,
        apiId: this.fourRAttrFlag ? this.currentParentCpnInfo.compositeId : this.currentServObj.apiId,
        paramList,
        // layoutServiceBeanList,
        confList: confList,
        compositeId: e.compositeId || ""
      }
      // await this.rpc.d4.saveServiceCpnParams(params)
      this.rpc.s4design.addFuntionJobCommitFlow({
        fnctId: this.$route.query.fnctId,
        jobTpCd: 'C4',
      })
      this.commitSameStartActionLayoutRel(this.currentObj)    
      this.setCpnParamsRecord()
      // this.upDateServParams(this.currentObj, paramList)
      this.$emit("upDateServParams", JSON.parse(JSON.stringify(this.currentObj)), params, layoutServiceBeanList)
      // this.$emit("updateServiceArrangeList", layoutServiceBeanList)
      // 更新完参数，调保存流程图接口
      // this.toSave(true)
    },
    // outputTargetOperate(operation, data) {
    //   console.log("outputTargetOperate", operation, data)
    //   this.operateType = operation
    //   if (operation == "paramNm") {
    //     this.$refs.selectOutputFieldRef.showDialog(data, this.formData)
    //   } else if (operation == "actionPostSeq") {
    //     this.$refs.selectOutputPostSeqRef.showDialog(data)
    //   } else if (operation == "delete") {
    //     const index = this.outputTargetList.indexOf(data)
    //     this.outputTargetList.splice(index, 1)
    //   } else if (operation === 'paramValue') {
    //     this.$refs.selectOutputFieldRef.showDialog(data, this.formData, 'paramValueSrcActionId')
    //   }
    // },
    // outputTargetSelectChange(row, prop) {
    //   if (prop == "paramNm") {
    //     const item = this.formData.paramList.find(item => item.paramCName == row.paramNm)
    //     // const tfrCdtnCd = JSON.parse(row.tfrCdtnCd || "{}")
    //     // tfrCdtnCd.paramKey = item.paramKey
    //     // tfrCdtnCd.paramNm = item.paramCName
    //     // row.tfrCdtnCd = JSON.stringify(tfrCdtnCd)
    //     row.paramKey = item.paramKey
    //   } else if (prop == "actionId") {
    //     // const tfrCdtnCd = JSON.parse(row.tfrCdtnCd || "{}")
    //     // tfrCdtnCd.paramKey = ""
    //     // tfrCdtnCd.paramNm = ""
    //     // tfrCdtnCd.actionId = ""
    //     // row.tfrCdtnCd = JSON.stringify(tfrCdtnCd)
    //     row.paramKey = ""
    //     row.paramNm = ""
    //     row.actionNm = this.svcIdToSvcNm[row.actionId]
    //   } else if (prop == "paramValueSrcActionId") {
    //     row.paramValue = ''
    //     row.paramValueNm = ''
    //     if (row.paramValueSrcActionId === '10') {
    //       row.elementType = 'input'
    //     } else {
    //       row.elementType = 'text'
    //     }
    //   }
    // },
    setOutputTarget(type, target, obj) {
      console.log("setOutputTarget", type, target, obj, this.outputTargetList.indexOf(target))
      if (this.targetData.operation == "paramNm1") {
        this.targetData.paramKey = obj.paramKey
        this.targetData.paramNm = obj.paramCName
        this.targetData.paramType = obj.paramType
        console.log(target, "target")

        if (["List", "Object"].includes(target.paramType)) {
          target.paramValue = "null"
          target.condTyp = "="
        }
      } else if (type == "actionPostSeq") {
        target.actionPostSeq = obj.actionSeq
        target.postLoSeqNo = obj.actionSeq
      } else if (this.targetData.operation == "paramNm2") {
        this.targetData.paramValue = obj.paramKey
        this.targetData.paramValueType = obj.paramType
        this.targetData.paramValueNm = obj.paramCName
      }

      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    },
    setDisabled(children, status = true, parent = null) {
      for (let i = 0; i < children?.length; i++) {
        const item = children[i];
        console.log(status, "status")
        if (item.paramParentId && status) {
          item.disabled2 = true
        } else {
          item.disabled2 = false
        }
        if (parent?.paramMappingKey) {
          item.tree = parent.paramMappingKey
        }
        // item.children?.forEach((data) => {
        //   data.parent = item
        // })
        if (item.children && item.children.length) {
          let temp = true
          if (item.actionName === '复合来源') {
            temp = false
          }
          this.setDisabled(item.children, temp, item)
        }
      }
    },
    async updateCompositeIdMapToParamList() {
      const compositeId = this.confFormData.actionId
      // 新拖进来的组件
      if (!this.compositeIdMapToParamList[compositeId]) {
        console.log(this.compositeIdMapToParamList, "sssssssssss")
        const data = this.getDataList().find((item) => item.compositeId == compositeId)
        console.log(data, "dddddddd")
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
          d4bApiId: this.currentServObj?.svcId || this.currentServObj.apiId,
          bizDomainNo: this.currentServObj.bizLineId || this.currentServObj.beltLine
        })
        // const res = await this.rpc.d4.getServiceCpnParams({
        //   d4StusCd: "1",
        //   blngtoTyp: "11",
        //   compositeId: compositeId,
        //   apiId: apiId,
        //   d4bApiId: this.currentServObj.apiId || this.currentServObj?.svcId
        // })
        this.compositeIdMapToParamList[compositeId].paramList = res.paramList
      }
      // for (let i = 0; i < this.compositeIdMapToParamList.length; i++) {
      //   const item = j[i];
      //   item.paramList.forEach((item2) => {
      //     if (item2.actionName = '当前4b交易') {
      //       item.actionName = ''
      //     }
      //   })
      // }
      for (const key in this.compositeIdMapToParamList) {
        const item = this.compositeIdMapToParamList[key]
        
        console.log(item.paramList, "item.paramList")
        if (item.paramList) {
          let paramOrder = ''
          // 找到bodyData paramerOrder id
          for (let i = 0; i < item?.paramList.length; i++) {
            const item2 = item?.paramList[i];
            if (item2.paramKey === 'bodyData') {
              paramOrder = item2.paramOrder
              console.log(paramOrder, "paramOrder")
              break
            }
          }
          
          for (let i = 0; i < item?.paramList.length; i++) {
            const item2 = item?.paramList[i];
            const paramOrder1 = item2.paramOrder.split('.')[0]
            //  判断是否为bodyData 子类
            if (paramOrder1 === paramOrder) {
              continue
            }
            // 否则全部清空数据
            // console.log(paramOrder1)
            // if (item2.actionName) {
            item2.actionName = ''
            item2.actionId = ''
            item2.paramMappingKey = ''
            item2.paraMapgNm = ''
            // }
          }
        }
      }

    },
    // 获取服务组件的参数
    getParams(e) {
      console.log("getServiceCpnParams", e)
      this.currentObj = e;
      this.currentCompInfo = {
        compositeId: e.compositeId,
        compositeName: e.actionName,
        sourceId: e.actionId,
        compositeStepNo: e.conf.find((item) => item.name == 'actionSeq').value
      }
      this.getBranchErrorList(e.children)
      if (!e.compositeId) {
        e.conf.map((item) => {
          this.formData[item.name] = item.value;
        });
        console.log(this.formData, 'formData====')
        return
      }
      if (e.compositeId) {
        // const blngtoTyp = e.actionType.indexOf("D4") > -1 ? "10" : "11"
        // const params = {
        //   d4StusCd: "1",
        //   blngtoTyp,
        //   compositeId: e.compositeId || "",
        //   apiId: e.actionOwnId,
        //   d4bApiId: this.currentServObj.apiId || this.currentServObj?.svcId,
        //   bizDomainNo: this.currentServObj.bizLineId || this.currentServObj.beltLine,
        // }
        // this.disabled = true
        // Promise.all([
        //   this.rpc.d4.getServiceCpnParams(params),
        // ]).then(async([res]) => {
          // 处理参数
          e.paramList.forEach(item => {
            if (item.apSource == "00") {
              // item.actionName = "当前4b交易"
              // item.actionId = this.currentServObj?.svcId
            } else if (item.apSource == "10") {
              item.actionId = "constantValue"
            }
          })
          for (let i = 0; i < e.paramList.length; i++) {
            const item = e.paramList[i];
            if (item.actionId === 'getSessionInfo') {
              item.actionId = '获取会话组件'
            }
          }
          this.inputParamsListAtSetting = reList(e.paramList.filter((item) => item.paramDirection == "0"));
          if (!this.inputParamsListAtSetting.length) {
            this.inputParamsListAtSetting = [{
              "actionId": '',
              "actionName": "",
              "isNeed": "1",
              "paramCName": "验证码key",
              "paramDesc": "验证码key",
              "paramDirection": "0",
              "paramId": "",
              "paramIndex": "0",
              "paramKey": "captchaKey",
              "paramName": "验证码key",
              "paramOrder": "1",
              "paramPosition": "0",
              "paramType": "String",
              "paramValueType": "String",
              paramMappingKey: '',
              paramNm: '',
              paraMapgNm: '',
            }, {
              "actionId": '',
              "actionName": "",
              "isNeed": "1",
              "paramCName": "验证码value",
              "paramDesc": "验证码value",
              "paramDirection": "0",
              "paramId": "",
              "paramIndex": "0",
              "paramKey": "captchaValue",
              "paramName": "验证码key",
              "paramOrder": "2",
              "paramPosition": "0",
              "paramType": "String",
              "paramValueType": "String",
              paramMappingKey: '',
              paramNm: '',
              paraMapgNm: '',
            }]
          }
          this.setDisabled(this.inputParamsListAtSetting)
          this.inputParamsListAtSetting.forEach((item) => {
            console.log(item.paramKey)
            if (item.paramKey === 'bodyData') {
              this.setParamDisabled(item)
            }
            if (item.actionName === '当前4b交易') {
              item.actionId = this.currentServObj?.svcId
            }
          })

          e.confList.forEach((item) => {
            console.log(item, "item: " + item.paramKey)
            this.formData[item.confKey] = item.confValue
          })
          this.outputParamsListAtSetting = reList(e.paramList.filter((item) => item.paramDirection == "1"));
          // 处理配置信息（异常信息、组件前后位置序号）
          this.confKeyList.forEach((item) => {
            const target = e.confList.find((conf) => conf.confKey == item.key);
            this.confFormData[item.key] = target?.confValue || "";
          })
          this.confFormData.actionFrntSeq = e.conf.find((conf) => conf.name == "actionFrntSeq")?.value || ""
          this.confFormData.actionPostSeq = e.conf.find((conf) => conf.name == "actionPostSeq")?.value || ""
          // 处理规则信息
          // await this.getServiceArrangeList(e)
          this.disabled = false
        // })
        console.log(this.formData, "this.formData")
      }
    },
    async getBusinessRuleInfo() {
      this.ruleInfo = {}
      const params = {
        apiId: this.currentObj.actionOwnId,
      };
      const res = await this.rpc.d4.getBusinessRuleInfo(params);
      this.ruleInfo = res
      const that = this.$refs.ruleTableRef
      that.setRuleInfo(res)
    },
    // 查询编排列表
    async getServiceArrangeList(e) {
      console.log("getServiceArrangeList", e, this.currentServObj)
      const res = await this.rpc.d4.getServiceArrangeList({
        svcId: this.currentServObj?.svcId || this.currentServObj.apiId,
        actionId: e.compositeId,
        // parentActionId: 
      })
      this.layoutActionList = res.layoutActionList
      // this.outputTargetList = res.layoutActionList.map(item => {
      //   const tfrCdtnCd = JSON.parse(item.tfrCdtnCd || "{}")
      //   item.paramKey = tfrCdtnCd.paramKey || ""
      //   item.paramNm = tfrCdtnCd.paramNm || ""
      //   item.condTyp = tfrCdtnCd.condTyp || ""
      //   item.paramValue = tfrCdtnCd.paramValue || ""
      //   item.actionPostSeq = tfrCdtnCd.actionPostSeq || ""
      //   return item
      // })
      const tfrCdtnCd = JSON.parse(res.layoutActionList[0]?.tfrCdtnCd || "[]")
      this.outputTargetList = tfrCdtnCd.map(item => {
        // if (item.paramValueSrcActionId === '10') {
        //   item.elementType = 'input'
        // } else {
        //   item.elementType = 'text'
        // }
        console.log(item.paramValueSrcType, "paramValueSrcType")
        return {
          actionId: item.actionNm == "当前4b交易" ? this.currentServObj?.svcId : item.actionId,
          ...item,
          paramValueSrcActionId: item.paramValueSrcActionId ? item.paramValueSrcActionId : '10',
          elementType: item.paramValueSrcType === '10' ? 'input' : 'text',
        }
      })
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    },
    setCpnParamsRecord() {
      this.cpnParamsRecord = JSON.stringify(this.inputParamsListAtSetting)
    },
    resetCpnParamsRecord() {
      this.cpnParamsRecord = "[]"
      this.inputParamsListAtSetting = []
    },
    setParaMapgNm(target, obj) {
      console.log(1,target, obj)
      const list = mixList(this.inputParamsListAtSetting, "children")
      const data = list.find(item => item.paramId == target.paramId)
      data.paraMapgNm = obj.paramCName
      data.paramMappingKey = obj.paramKey
      this.inputParamsListAtSetting = reList(list)
      this.inputParamsListAtSetting = JSON.parse(JSON.stringify(this.inputParamsListAtSetting))
      console.log("组件输入参数list",this.inputParamsListAtSetting)
    },
    inputClick(scope, e) {
      e.preventDefault();
      console.log(scope.row, e, 'scope. row')
      this.$refs.simulantSelectRef.init(scope, e)
    },
    // 获取conf配置项
    getConfItem(name, actionId) {
      const dataList = this.getDataList()
      const cpn = dataList.find(data => data.actionId == actionId)
      return cpn.conf.find(item => item.name == name) || {}
    },
    // 切换表格的显示模式（是否完整显示）
    switchTableMode(e) {
      if (e == "inputAtSetting") this.showAllInputParamsAtSetting = !this.showAllInputParamsAtSetting
      if (e == "outputAtSetting") this.showAllOutputParamsAtSetting = !this.showAllOutputParamsAtSetting
    },
    async showServInfo(e) {
      console.log("showServInfo", e)
      this.showServInfoFlag = true
      this.inputParamsListAtSetting = []
      this.outputParamsListAtSetting = []
      this.outputTargetList = []
      this.$nextTick(async () => {
        const res = await this.rpc.d4.queryL5ParamAndRuleDefinitions({
          d4StusCd: "1",
          blngtoTyp: "11",
          apiId: e.cpntId,
          d4bApiId: this.currentServObj.apiId || this.currentServObj?.svcId,
          bizDomainNo: this.currentServObj.bizLineId || this.currentObj.beltLine,
        })
        this.formData = res
        this.ruleInfo = res
        this.inputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == "0"));
        this.outputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == "1"));
        const that = this.$refs.ruleTableRef
        if (that) that.setRuleInfo(res)
      })
    },
    setInputAndOutputList(paramList) {
      // paramList.forEach(item => {
      //   // if (item.apSource == "00") {
      //   //   item.actionName = "当前4b交易"
      //   //   item.actionId = this.currentServObj?.svcId
      //   // }
      // })
      const inputParamsListAtSetting = paramList.filter((item) => item.paramDirection == "0")
      inputParamsListAtSetting.forEach((param) => {
        if (param.paramMappingKey) {
          param.paramMappingKey = packageParamKey(param, inputParamsListAtSetting)
        }
      })
      this.inputParamsListAtSetting = reList(inputParamsListAtSetting);
    },
    async init(e, click) {
      this.showServInfoFlag = false
      this.inputParamsListAtSetting = []
      this.outputParamsListAtSetting = []
      this.outputTargetList = []
      // this.bodyOutData = []
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
      this.$nextTick(async () => {
        console.log("点击触发", e)
        await this.getServiceCpnParams(e)

      })
    },
    checkRule(data) {
      this.$emit("checkRule", data)
    }
  },
  created() {
    // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
    // const dataList = this.getDataList()
    // this.compositeIdMapToParamList = dataList.reduce((prev, data) => {
    //   if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType) && data.compositeId) {
    //     const compositeId = data.compositeId
    //     if (!this.compositeIdMapToParamList[compositeId]) {
    //       prev[compositeId] = {
    //         svcId: data.actionOwnId,
    //         svcNm: data.actionName,
    //         paramList: [],
    //       }
    //     }
    //   }
    //   return prev
    // })
    this.svcIdToSvcNm = this.getDataList().reduce((prev, data) => {
      if (sourceActionType.includes(data.actionType)  && data.compositeId) {
        prev[data.compositeId] = data.actionName
      }
      return prev
    }, { [this.currentServObj?.svcId]: "当前4b交易" })
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_service {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  .mt10 {
    margin-top: 10px;
  }
  .form_info {
    padding: 20px 20px 0 15px;
  }
  .bold_text {
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #111111;
    letter-spacing: 0;
  }
  .width_move {
    width: 1px;
    position: absolute;
    left: 0px;
    height: 100%;
    cursor: w-resize;
    background: #f5f5fa;
    z-index: 1;
  }
  .trigger_diy {
    position: absolute;
    left: -22px;
    top: 50%;
    width: 11px;
    height: 84px;
    line-height: 84px;
    color: #fff;
    font-size: 18px;
    padding-right: 10px;
    cursor: pointer;
    transition: background 0.3s ease;
    z-index: 200;
    background: rgba(0, 0, 0, 0);
    border-top: 11px solid rgba(0, 0, 0, 0);
    border-bottom: 11px solid rgba(0, 0, 0, 0);
    border-right: 11px solid #409eff;
    i {
      margin-left: 7px;
      margin-top: -25px;
      vertical-align: middle;
    }
  }
  .trigger_diy_without_sidebar {
    transform: rotate(180deg);
    transform-origin: 100% 50% 0;
  }
  .attr_main {
    height: 100%;
    ::v-deep .el-table__cell {
      padding: 8px 0;
      .cell {
        span {
          font-size: 12px;
        }
      }
    }
    ::v-deep tr {
      .cell {
        font-size: 12px;
        // padding: 0;
      }
    }
  }
  .attr_title {
    padding: 0px 20px;
    font-family: $font_medium;
    font-weight: 600;
    height: 44px;
    line-height: 44px;
    &.flex {
      display: flex;
      justify-content: space-between;
      .right_btn {
        color: $theme_color;
        cursor: pointer;
      }
    }
    .btn {
      margin-left: 4px;
    }
  }
  .attr_pre_title {
    // padding: 8px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    &.underline {
      border-bottom: 1px solid $pri_br_color;
    }
    &.mb0 {
      margin-bottom: 0;
    }
    .el-icon-arrow-down {
      cursor: pointer;
      &.hidden {
        transform: rotate(180deg);
      }
    }
    .el-icon-more {
      cursor: pointer;
    }
    .attr_pre_title_b {
      color: $reg_ft_color;
      &.bold {
        font-weight: 600;
      }
      span {
        display: inline-block;
        color: $sec_danger_color;
        margin-right: 2px;
      }
      
    }
    .allocBtn {
        background: transparent;
        border-radius: 4px;
        color: #358aff;
        border: 1px solid #358aff;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        cursor: pointer;

        .icon {
            height: 16px;
            width: 16px;
            background: url("~@m/assets/images/icon_add_blue.png") no-repeat;
            background-size: 100% auto;
        }
    }

    .allocBtn:hover {
        background-color: rgba(#358aff, 0.1);
    }
  }
  .empty_execution_step {
    color:  #909399;
    line-height: 60px;
    text-align: center;
  }
  .attr_content {
    background-color: $base_bg_color;
    padding: 20px 10px;
  }
  .attr_box {
    height: calc(100% - 47px);
    overflow-y: scroll;
    padding-bottom: 30px;
    &.mt10 {
      margin-top: 10px;
    }
    .base_info {
      margin: 10px 20px 0;
      border-bottom: 1px solid  #E7E7EE;
      .base_info_list {
        .item {
          margin-bottom: 10px;
          .title {
            display: inline-block;
            color: #999;
            white-space: nowrap;
            width: 70px;
            text-align: right;
          } 
          .content {
            color: #333;
          }
          &:nth-last-child(1) {
            margin-bottom: 16px;
          }
        }
      }
    }
  }
  .attr_show {
    padding: 0px 20px;
    overflow: hidden;
    .attr_show_item {
      margin-bottom: 10px;
      overflow: hidden;
      position: relative;
      font-size: 14px;
      &.flex {
        display: flex;
        .item_title {
          width: 80px;
          padding-right: 4px;
          padding-top: 4px;
          text-align: right;
          font-size: 12px;
          font-weight: $font_weight_600;
          white-space: nowrap;
          &.required_fields {
            &::before {
              content: "*";
              color: $sec_danger_color;
              margin-right: 2px;
            }
          }
          &.w68 {
            width: 68px;
          }
        }
        .item_value {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          ::v-deep .el-textarea__inner {
            height: 80px;
          }
          &.select {
            ::v-deep .el-input--suffix {
              font-size: 12px;
            }
          }
          &.text {
            font-size: 12px;
            padding-top: 4px;
          }
        }
      }
      &.mb20 {
        margin-bottom: 20px;
      }
      &.pb20 {
        padding-bottom: 20px;
      }
      &.border_bottom {
        border-bottom: 1px solid #E7E7EE;
      }
      .can_select {
        user-select: text;
      }
      .sub_title {
        font-size: 12px;
        margin-bottom: 6px;
      }
      .attr_show_item_t {
        // width: 100%;
        // margin-right: 10px;
        // margin-bottom: 10px;
        padding: 5px 5px 0 0;
        // font-weight: $font_weight_600;
        white-space: nowrap;
        min-width: 100px;
        text-align: right;
        .attr_show_item_i {
          font-weight: 400;
          white-space: normal;
          word-break: break-all;
        }
        &.flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title {
            width: 64px;
          }
          .content {
            flex: 1;
          }
          .right_btn {
            color: $theme_color;
            cursor: pointer;
          }
        }
        &.required {
          &::before {
            content: "*";
            color: red;
          }
        }
        &.textLeft {
          text-align: left;
        }
      }
      .attr_show_item_c {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &.textarea {
          ::v-deep .el-textarea__inner {
            min-height: 60px !important;
          }
        }
        &.left {
          padding-right: 4px;
        }
        &.right {
          padding-left: 4px;
        }
        ::v-deep .el-select {
          width: 100%;
        }
      }
      .attr_show_item_b {
        position: absolute;
        right: 0;
        top: 0;
        ::v-deep .el-button {
          @include mini_button_common;
          height: 20px;
          &.el-button--default.is-plain {
            border-color: $sec_ft_color;
            color: $sec_ft_color;
            &:hover,
            &:focus {
              color: $sec_ft_color;
            }
          }
          &.el-button--danger.is-plain {
            border-color: $danger_color;
            &:hover,
            &:focus {
              color: $danger_color;
            }
          }
          &.el-button--primary {
            background-color: $theme_color;
            border-color: $theme_color;
          }
          &.is-plain {
            background-color: $base_white;
            &:hover,
            &:focus {
              color: $theme_color;
            }
          }
        }
        .el-icon-more {
          cursor: pointer;
        }
      }
    }
  }
    .attr_show {
    padding: 20px 20px 0;
    overflow: hidden;
    // &.read {
    //   padding: 10px 20px;
    // }
    .attr_show_item {
      display: flex;
      margin-bottom: 10px;
      overflow: hidden;
      position: relative;
      font-size: 14px;
      &.flex {
        display: flex;
        .item_title {
          width: 80px;
          padding-right: 4px;
          padding-top: 4px;
          text-align: right;
          font-size: 12px;
          font-weight: $font_weight_600;
          &.required_fields {
            &::before {
              content: "*";
              color: $sec_danger_color;
              margin-right: 2px;
            }
          }
          &.w68 {
            width: 68px;
          }
        }
        .item_value {
          flex: 1;
          ::v-deep .el-textarea__inner {
            height: 80px;
          }
          &.select {
            ::v-deep .el-input--suffix {
              font-size: 12px;
            }
          }
          &.text {
            font-size: 12px;
            padding-top: 4px;
          }
        }
      }
      &.mb20 {
        margin-bottom: 20px;
      }
      &.pb20 {
        padding-bottom: 20px;
      }
      &.border_bottom {
        border-bottom: 1px solid #E7E7EE;
      }
      .attr_show_item_t {
        // width: 100%;
        // margin-right: 10px;
        // margin-bottom: 10px;
        padding: 5px 5px 0 0;
        // font-weight: $font_weight_600;
        white-space: nowrap;
        min-width: 90px;
        text-align: left;
        font-weight: $font_weight_600;
        .attr_show_item_i {
          font-weight: 400;
          white-space: normal;
          word-break: break-all;
        }
        &.flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title {
            width: 64px;
          }
          .content {
            flex: 1;
          }
          .right_btn {
            color: $theme_color;
            cursor: pointer;
          }
        }
        &.required {
          &::before {
            content: "*";
            color: red;
          }
        }
        &.textLeft {
          text-align: left;
        }
      }
      .attr_show_item_c {
        width: 100%;
        &.textarea {
          ::v-deep .el-textarea__inner {
            min-height: 60px !important;
          }
        }
        &.left {
          padding-right: 4px;
        }
        &.right {
          padding-left: 4px;
        }
        ::v-deep .el-select {
          width: 100%;
        }
      }
      .attr_show_item_b {
        position: absolute;
        right: 0;
        top: 0;
        ::v-deep .el-button {
          @include mini_button_common;
          height: 20px;
          &.el-button--default.is-plain {
            border-color: $sec_ft_color;
            color: $sec_ft_color;
            &:hover,
            &:focus {
              color: $sec_ft_color;
            }
          }
          &.el-button--danger.is-plain {
            border-color: $danger_color;
            &:hover,
            &:focus {
              color: $danger_color;
            }
          }
          &.el-button--primary {
            background-color: $theme_color;
            border-color: $theme_color;
          }
          &.is-plain {
            background-color: $base_white;
            &:hover,
            &:focus {
              color: $theme_color;
            }
          }
        }
        .el-icon-more {
          cursor: pointer;
        }
      }
    }
  }
  .attr_send {
    padding: 8px 20px;
    ::v-deep .el-input__suffix {
      color: #333;
    }
  }
  .attr_recive {
    padding: 8px 20px;
    &.mb20 {
      margin-bottom: 20px;
    }
    .text_btn {
      color: $theme_color;
      cursor: pointer;
      font-size: 10px;
    }
  }
  .underLine {
    border-bottom: 1px solid $pri_br_color;
  }
  .attr_set_f {
    width: 68px;
    margin-right: 10px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ::v-deep .el-input--mini .el-input__inner {
      height: 24px;
    }
  }
  .attr_set_s {
    width: 116px;
    margin-right: 5px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .attr_set_ad {
    font-size: 16px;
    height: 24px;
    line-height: 24px;
    width: 16px;
    float: right;
    color: $reg_ft_color;
    cursor: pointer;
  }
  .attr_set_t {
    width: 16px;
    float: right;
    .key_action {
      font-size: 16px;
      height: 24px;
      line-height: 24px;
    }
    i {
      cursor: pointer;
    }
  }
  .attr_set_l {
    width: 186px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .key_title {
    padding: 0px 0px 8px;
    overflow: hidden;
    color: $sec_ft_color;
    display: flex;
    justify-content: space-between;
  }
  .key_list {
    overflow: hidden;
    .key_item {
      margin-bottom: 5px;
      overflow: hidden;
      .attr_set_f_ml {
        margin-left: 10px;
      }
      ::v-deep .el-input__inner {
        line-height: 28px;
        border: 1px solid $pri_br_color;
        border-radius: $theme_radius;
        height: 28px;
        color: $reg_ft_color;
        padding: 0 5px;
      }
    }
  }

  ::v-deep .el-input__inner {
    line-height: 32px;
    border: 1px solid $pri_br_color;
    border-radius: $theme_radius;
    height: 32px;
    color: $reg_ft_color;
  }
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  ::v-deep .el-table thead tr th {
    background-color: $table_bg_color;
  }
  .line_dialog_conf {
    .add_conf {
      padding: 15px 20px;
      border-bottom: 1px solid $pri_br_color;
      display: flex;
      align-items: center;
      .add_conf_s {
        width: 90px;
      }
      .add_conf_t {
        width: 90px;
      }
      .add_conf_btn {
        // float: right;
        margin-left: auto;
      }
    }
    .add_condition {
      padding: 15px 20px;
      border-bottom: 1px solid $pri_br_color;
      .add_condition_k {
        width: 110px;
        margin-right: 2px;
      }
      .add_condition_btn {
        cursor: pointer;
      }
      .hidden {
        visibility: hidden;
      }
    }
    .add_content {
      padding: 15px 20px;
      .add_content_t {
        margin-bottom: 15px;
        font-family: $font_medium;
      }
      .add_content_l {
        padding: 15px;
        background-color: $base_bg_color;
      }
    }
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
  .attr_tabs {
    display: flex;
    // justify-content: center;
    background-color: $base_white;
    width: 100%;
    border-bottom: 2px solid #dcdfe6;
    box-shadow: 0 1px 10px 0 #e7e7e7;;
    // ::v-deep .el-tabs__active-bar {
    //   width: 50px !important;
    // }
    ::v-deep .el-tabs__nav-wrap::after {
      background-color: $base_white;
    }
    ::v-deep .el-tabs__header {
      margin: 0;
      .el-tabs__item {
        height: 50px;
        line-height: 50px;
        font-size: 12px;
        padding: 0 15px;
        font-family: $font_medium;
        letter-spacing: 0;
        min-width: 78px;
        text-align: center;
        &.is-active {
          font-weight: $font_weight_600;
        }
      }
    }
    ::v-deep .el-tabs__content {
      display: none;
    }
  }
  .form {
    width: 70%;
    margin: 24px auto;
  }
  .attr_btn {
    @include attr_btn;
  }
  .service_edit_form {
    ::v-deep .el-form-item__label {
      font-size: 12px;
    }
  }
  .service_edit_form_info {
    margin-bottom: 16px;
    .el-form-item {
      margin-bottom: 8px;
    }
  }
  .rule_dialog {
    padding: 15px 24px;
    .rule_dialog_item {
      margin-bottom: 10px;
    }
  }
  .table ::v-deep .wraning_row {
    display: none;
  }
  .table {
    &.input_list {
      ::v-deep .el-input__inner {
        cursor: pointer;
      }
    }
    ::v-deep .el-table {
      &::before {
        display: none;
      }
    }
  }
  .el-menu {
    border-right: 0;
    ::v-deep .is-active {
      color: #303133;
    }
    .is_active {
      color: $theme_color;
      background-color: #eaf1ff;
      font-weight: $font_weight_600;
    }
    ::v-deep .el-menu-item {
      padding-left: 10px !important;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      letter-spacing: 0;
    }
  }
  .list_item_tag {
    font-size: 12px;
    padding: 0 3px;
    border-radius: $theme_radius;
    // margin-right: 4px;
    transform: scale(0.7);
    height: 20px;
    line-height: 20px;
    text-align: center;
    margin-left: 5px;
    &.outside {
      color: #ff934b;
      background: #fff4e5;
      font-size: 14px;
    }
  }
  .transition_arrange {
    .transition_arrange_title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    ::v-deep .el-select__caret {
      color: #333;
      transform: rotateZ(0);
      &::before {
        content: "\e790"
      }
    }
    .tips_info {
      margin-top: 10px;
    }
  }
  .exception_message {
    margin-bottom: 30px;
    .tips_info {
      margin-top: 10px;
    }
  }
}
</style>
