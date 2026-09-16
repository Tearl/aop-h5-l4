<template>
  <div class="aop_tradecode_comps_design_attr_service">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>
          <span>服务信息</span>
          <el-button
            v-if="!isRead"
            class="btn"
            type="primary"
            size="mini"
            @click="resetParamList"
          >重置参数</el-button>
        </div>
      </div>

      <!-- D4b服务信息 -->
      <div class="attr_box">
        <div class="base_info">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b bold">基本信息</div>
          </div>
          <ul class="base_info_list">
            <li class="item">
              <span class="title">服务名称：</span>
              <span class="content">{{ formData.svcNm }}</span>
            </li>
            <li class="item">
              <span class="title">服务ID：</span>
              <span class="content">{{ formData.svcId }}</span>
            </li>
            <li class="item">
              <span class="title">服务编码：</span>
              <span class="content">{{ formData.svcCd }}</span>
            </li>
            <li class="item">
              <span class="title">服务类型：</span>
              <span class="content">{{ (formData.svcTpCd || "").substr(-4) }}</span>
            </li>
            <li class="item">
              <span class="title">服务描述：</span>
              <span class="content">{{ formData.svcDesc }}</span>
            </li>
          </ul>
        </div>

        <div class="attr_send">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b bold">输入参数</div>
            <div class="attr_show_item_b">
              <i class="el-icon-more" @click="switchTableMode('inputAtSetting')"></i>
            </div>
          </div>
          <div class="attr_show_item_c">
            <Table
              class="table input_list"
              :data="newInputParamsListAtSetting"
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
        <div class="attr_recive">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b bold">输出参数</div>
            <div class="attr_show_item_b">
              <i class="el-icon-more" @click="switchTableMode('outputAtSetting')"></i>
            </div>
          </div>
          <div class="attr_show_item_c" v-show="outputParamsVisibleAtSetting">
            <Table
              class="table"
              :data="outputParamsListAtSetting"
              :table="outputParamsColumnAtSetting"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div>
        </div>
        <div class="attr_recive">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b bold">业务规则</div>
          </div>
          <div class="attr_show_item_c">
              <RuleTable
                ref="ruleTableRef"
                :currentServObj="currentServObj"
                :pageType="'read'"
                @checkRule="checkRule"
              ></RuleTable>
          </div>
        </div>

        <div class="transition_arrange">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="transition_arrange_title">
                <div class="attr_pre_title_b bold">执行规则</div>
                <button class="allocBtn" @click="addExecutionStep">
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
            :baseBranchInfo="item"
            :currentCompInfo="currentCompInfo" 
            :currentServObj="currentServObj"
            :isComponent="true"
            :executeLength="executionSteps.length"
            :allSelections="allSelections"
            @operate="selectOperate"
            @compDel="compDel"
          />
        </div>

        <div
          class="exception_message"
        >
          <div class="attr_show">
            <div class="attr_pre_title">
              <div class="attr_pre_title_b bold">异常处理</div>
              <button class="allocBtn" @click="addErrorStep">
                    <div class="icon" />
                    <span>添加异常</span>
                </button>
            </div>

            <div v-if="!errorSteps.length" class="empty_execution_step">暂无异常处理</div>
            <div v-else>
              <throwError
              v-for="(item, index) in errorSteps"
              :key="index"
              :compSeqNo="index"
              :ref="'throwError' + index"
              :baseBranchInfo="item"
              :currentCompInfo="currentCompInfo" 
              :currentServObj="currentServObj"
              :isComponent="true"
              @operate="selectOperate"
              @compDel="errorDel"
            />
            </div>
            
            <!-- <div class="attr_show_item flex">
              <div class="attr_show_item_t">
                错误码：
              </div>
              <div class="attr_show_item_c">
                <el-input :disabled="!canSave" v-model="confFormData.errorCode" size="mini" placeholder="错误码"></el-input>
              </div>
            </div>
            <div class="attr_show_item flex">
              <div class="attr_show_item_t">
                错误信息：
              </div>
              <div class="attr_show_item_c textarea">
                <el-input
                  maxlength="1000"
                  show-word-limit
                  autosize
                  :disabled="!canSave"
                  type="textarea"
                  v-model="confFormData.errorMsg"
                  placeholder="错误信息"
                  size="mini"
                ></el-input>
              </div>
            </div> -->
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
    <SelectOutputField
      ref="selectOutputFieldRef"
      :currentServObj="currentServObj"
      @setOutputTarget="setOutputTarget"
    ></SelectOutputField>

    <!-- 拟态的下拉选择框 -->
    <SimulantSelect
      @update="updateData"
      @updateTableData="updateTableData"
      @changeEnumOption="changeEnumOption"
      @updateEnumData="updateEnumData"
      ref="simulantSelectRef"
      :currentServObj="currentServObj"
      :currentObj="currentObj"
      :currentParentCpnInfo="currentParentCpnInfo"
      :fourRAttrFlag="fourRAttrFlag"
      :serviceIdMapToParamList="serviceIdMapToParamList">
    </SimulantSelect>

    <selectenum :enumVisible="enumVisible" :appId="currentServObj.transAppId" @close="enumVisible = false" @select="selectEnumVal" ref="selectEnumRef" />
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table_workgate";
import SelectOutputField from "./service_setting/selectOutputField"
// import SelectOutputPostSeq from "./service_setting/selectOutputPostSeq"
import SimulantSelect from "./service_setting/simulantSelect"
import RuleTable from "@m/core/components/rule_table";
// import SelectTempParams from "./select_temp_params"
import { mixList, reList, packageParamKey } from "@m/utils/paramTree";
import filters from "@m/utils/filters";
import { sourceActionType, actionTypeToApSource, actionNameToNoActionId } from "@m/utils/normalData";
import selectenum from './service_setting/selectenum.vue'
import conditionalBranch from "@m/core/components/service_design/components/ConditionalBranch"
import throwError from "@m/core/components/service_design/components/ThrowError"

export default {
  mixins: [mixin],
  components: {
    Table,
    SelectOutputField,
    // SelectOutputPostSeq,
    RuleTable,
    // SelectTempParams,
    SimulantSelect,
    selectenum,
    conditionalBranch,
    throwError
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
      customChanged: false,
      enumVisible: false,
      //服务活动基本信息数据
      formData: {
        svcNm: "", // 服务名称
        svcTpCd: "", // 服务类型
        svcId: "", // 编号
        svcDesc: "", // 描述
        svcVersionNo: "", // 版本号
      },
      confFormData: {
        actionDesc: "", // 名称
        svcId: "", // 服务id
        svcNo: "", // 服务编码
        svcTpCd: "", // 服务类型
        sysNm: "", // 系统名称
        actionSeq: "", // 位置序号
        actionFrntSeq: "", // 前置序号
        actionPostSeq: "", // 后置序号
        errorCode: "", // 异常码
        errorMsg: "", // 异常信息
        conditionType: '0',
      },
      allSelections: [], //保存终点组件id，控制相同终点不可选
      // 组件信息的配置项
      confKeyList: [
        { key: "actionDesc", value: "" }, // 名称
        { key: "svcId", value: "" }, // 服务id
        { key: "svcNo", value: "" }, // 服务编码
        { key: "svcTpCd", value: "" }, // 服务类型
        { key: "sysNm", value: "" }, // 系统名称
        { key: "actionSeq", value: "" }, // 位置序号
        { key: "actionFrntSeq", value: "" }, // 前置序号
        { key: "actionPostSeq", value: "" }, // 后置序号
        { key: "errorCode", value: "" }, // 错误码
        { key: "errorMsg", value: "" }, // 错误信息
        { key: "conditionType", value: "0" }, // 错误信息
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
      outputTargetList2: [],
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
      currentCompInfo: {},
      executionSteps: [],
      errorSteps: []
    };
  },
  computed: {
    newInputParamsListAtSetting() {
        this.inputParamsListAtSetting.forEach((item)=>{
            if(item.actionName=='' && item.actionId=="complex"){
                item.actionName='复合来源'
            }
        })
      if (this.showAllInputParamsAtSetting) {
        return this.inputParamsListAtSetting
      }
      return this.inputParamsListAtSetting.filter((item) => {
        if (![
          'reqHeaderData',
          'channelData',
          'securityData',
          'commonData',
        ].includes(item.paramKey)) {
          return item
        }
      })
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
            // prop: "apSource", // 当前4b交易00 S5服务20
            prop: "actionId",
            label: "来源",
            minWidth: "30%",
            type: "simulantSelect",
            placeholder: "请选择",
            inputStyle: {
              cursor: "pointer",
            },
            disabled: (scope) => {
              return scope.row.disabled2
            },
            filter: (scope) => {
              const { actionName, actionId, paraMapgNm } = scope.row
              console.log(actionName, actionId)
              if (actionId == 'constantValue') {
                // return '枚举值'
                if (paraMapgNm.includes('.') || this.customChanged) {
                  return '枚举值'
                }
                return '固定值'
              } else if (actionId === 'complex') {
                return '复合来源'
              } else if (!actionName && !actionId) {
                return ""
              } else if (["当前4b交易", "当前循环组件", "固定值", "枚举值", '复合来源'].includes(actionName)) {
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
            //   if (scope.row.actionName == '复合来源' || scope.row.apSource=='120') {
            //     scope.row.disabled3 = false
            //   }
              return scope.row.disabled3
            },
            prop: (row) => {
              if (row?.actionId == "constantValue") {
                return "paraMapgNm"
              } else {
                return "paraMapgNm"
              }
            },
            label: "来源值",
            minWidth: "30%",
            type: (row) => {
              if (row.actionId == "constantValue") {
                if (row.paraMapgNm.includes('.') || this.customChanged) {
                  return "simulantSelect"
                }
                return "input"
                
              } else {
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
            // prop: "apSource", // 当前4b交易00 S5服务20
            prop: "actionId",
            label: "来源",
            minWidth: "25%",
            type: "text",
            tooltip: true,
            filter: (scope) => {
              const { actionName, actionId } = scope.row
              if (!actionName && !actionId) {
                return ""
              } else if (["当前4b交易", "当前循环组件", "固定值", "枚举值"].includes(actionName)) {
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
    // 设置页签下的输出参数表格列
    outputParamsColumnAtSetting() {
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
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramType",
          label: "参数类型",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "isNeed",
          label: "是否必输",
          minWidth: "20%",
          type: "text",
          tooltip: true,
          align: "center",
          filter: "paraNed",
        }
      ].filter(item => this.showAllOutputParamsAtSetting || ["参数名称", "是否必输"].includes(item.label))
    },
    outputTargetColumn2() {
      if (this.canSave) {
        return [
          {
            prop: "actionPostSeq",
            label: "后续顺序号",
            // minWidth: "30%",
            width: "120",
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
              return list
            },
          },
          {
            prop: "actionId",
            label: "来源",
            minWidth: "25%",
            type: "select",
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
            tooltip: true,
            operate: "paramNm",
            filter(scope) {
              return scope.row.paramNm || "选择"
            },
          },
          {
            prop: "condTyp",
            label: "对比关系",
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
          },
          {
            prop: "paramValueSrcActionId",
            label: "来源",
            minWidth: "25%",
            type: "select",
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
              }, [{ type: "当前4b交易", value: this.currentServObj?.svcId }, { type: "枚举值", value: '10' }])
            },
            clearable: "false"
          },
          {
            prop: "paramValue",
            label: "对比值",
            minWidth: "25%",
            type: "inputText",
            placeholder: "请输入",
            operate: 'paramValue',
            disabled: (scope) => ["List", "Object"].includes(scope.row.paramType),
            filter(scope) {
              return scope.row.paramValueNm || "选择"
            },
          },
          {
            prop: "groupOperator",
            label: "操作符",
            minWidth: "25%",
            type: "select",
            placeholder: "请选择",
            selectVal: () => {
              return [
                {
                  type: '无',
                  value: ''
                },
                {
                  type: '与',
                  value: '&&'
                },
                {
                  type: '与非',
                  value: '&&!'
                },
                {
                  type: '或',
                  value: '||'
                },
                {
                  type: '或非',
                  value: '||!'
                },
              ]
            },
            clearable: "false"
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
      }
    },
    outputTargetColumn() {
      if (this.canSave) {
        return [
          {
            prop: "actionId",
            label: "来源",
            minWidth: "25%",
            type: "select",
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
            operate: "paramNm",
            filter(scope) {
              return scope.row.paramNm || "选择"
            },
          },
          {
            prop: "condTyp",
            label: "对比关系",
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
              }, [{ type: "当前4b交易", value: this.currentServObj?.svcId }, { type: "枚举值", value: '10' }])
            },
            clearable: "false"
          },
          {
            prop: "paramValue",
            label: "对比值",
            minWidth: "25%",
            type: "inputText",
            placeholder: "请输入",
            operate: 'paramValue',
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
            prop: "paramNm",
            label: "返回字段",
            minWidth: "25%",
            type: "text",
            align: "center",
            tooltip: true,
          },
          {
            prop: "condTyp",
            label: "对比关系",
            minWidth: "25%",
            type: "text",
            tooltip: true,
          },
          {
            prop: "paramValue",
            label: "对比值",
            minWidth: "25%",
            type: "text",
            tooltip: true,
          },
          {
            prop: "actionPostSeq",
            label: "后续顺序号",
            minWidth: "25%",
            type: "text",
            align: "center",
            tooltip: true,
          },
        ]
      }
    },
    canSave() {
      return !this.isRead && this.currentObj.compositeId && !this.showServInfoFlag
    }
  },
  inject: ["getDataList", "setCurrentActionId"],
  methods: {
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
    addErrorStep() {
      this.errorSteps.push(
        {
          tranId: this.fourRAttrFlag ? this.currentParentCpnInfo.compositeId : this.currentServObj?.svcId,
          startActionId: this.currentCompInfo?.compositeId,
          endActionId: '',
          interfaceProcessActionLayoutRelList: '[]'
        }
      )
    },
    checkStatus(list) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item.actionId === 'complex') {
          if (item.children) {
            return this.checkStatus(item.children)
          } else {
            return -1
          }
        } else {
          if (item.actionId) {
            return true
          }
        }
      }
    },
    handleDeleteGroup(index) {
      this.outputTargetList2.splice(index, 1)
    },
    handleChangeConfitionType() {
      if (this.confFormData.conditionType === '1') {
        if (this.outputTargetList2.length === 0) {
          this.addGroup()
        } else {
          this.$nextTick(() => {
            this.$refs.table.forEach((item) => {
              item.initSpanArr()
            })
          })
        }
      }
    },
    /**组件删除 */
    compDel(seqNo) {
      this.executionSteps.splice(seqNo, 1)
    },
    /**异常删除 */
    errorDel(seqNo) {
      this.errorSteps.splice(seqNo, 1)
    },
    /**
     * 控制相同终点组件不可选
     */
    handleSelectionUpdate(newSelection, index) {
      // this.$set(this.executionSteps, index, { endActionId: newSelection });
      
      // // 更新所有选择状态
      // this.allSelections = [...this.executionSteps.map(form => form.endActionId).filter(endPoint => endPoint !== '')];
    },
    /**
     * 表格操作项
     */
    selectOperate(operate, info, index) {
      this.outputTargetOperate(operate, info, index)
    },
    operateList(event, index) {
      // console.log(a, b, index)
      const operation = event[0]
      const data = event[1]
      this.outputTargetOperate(operation, data, index)
    },
    addGroup() {
      this.outputTargetList2.push({
        activityNextSeq: '',
        conditionList: [],
      })
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
    changeEnumOption() {
      this.customChanged = true
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
    updateEnumData(target,source, parent) {
      target.paramMappingKey = parent.value + '.' + source.value
      target.paraMapgNm = `${parent.label}.${source.label}`
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
        // row.paramValue = ""
      } else {
        // this.paramValueSelect = [];
        // const list = JSON.parse(JSON.stringify(this.inputParamsListAtSetting))
        // this.inputParamsListAtSetting = []
        // this.$nextTick(() => {
        //   this.inputParamsListAtSetting = list
        // })
        // this.$forceUpdate()
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
    // 动态生成每个组件的 ref 名称
    getRefName(index) {
      return 'conditionalBranch' + index;
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
      if(this.errorSteps.length) {
        this.errorSteps.forEach((e, i) => {
          let errorRef = this.$refs['throwError' + i]
          let errorData = errorRef[0].dataOutput()
          list.push({
            ...errorData,
            priorityLevel: this.executionSteps.length + 1 + i
          })
        })
        
      }
      e.branchList = list
    },
    async saveServiceCpnParams() {
      const e = this.currentObj
      let paramList = JSON.parse(JSON.stringify(mixList(this.inputParamsListAtSetting, "children").concat(mixList(this.outputParamsListAtSetting, "children"))))

      const list = this.inputParamsListAtSetting.filter((item) => {
        return item.actionId === 'complex'
      })
      const inputList = JSON.parse(JSON.stringify(mixList(this.inputParamsListAtSetting, "children")))
      console.log(list, 'list')

      const result = this.checkStatus(list)
      if (result === -1) {
        return this.$message.error('复合来源必须有子参数')
      }
      if (!result && list.length > 0) {
        return this.$message.error('复合来源的子参数至少有一个来源、来源值不能为空')
      }
      console.log(inputList, "input")
      for (let i = 0; i < inputList.length; i++) {
        const item = inputList[i];
        if (item.actionId !== 'complex') {
          if (item.actionName && !item.paramMappingKey) {
            this.$message.error(`输出参数${item.paramKey}来源值不能为空`)
            return true
          }
        }
      }
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
      })
      let status = false
      this.outputTargetList.map((item) => {
        if (item.actionPostSeq === 'EX001' && !this.confFormData.errorCode) {
          status = true
        }
      })
      if (status) {
        return this.$message.error("请修改交易编排后续顺序号为异常组件")
      }
      const paramOrderToParamsList = paramList.reduce((prev, param) => {
        const key = `${param.paramDirection}-${param.paramOrder}`
        if (!prev[key]) {
          prev[key] = [param]
        } else {
          prev[key].push(param)
          if (prev[key]?.length > prev.longestList?.length) {
            prev.longestList = prev[key]
          }
        }
        return prev
      }, {
        longestList: []
      })
      if (paramOrderToParamsList.longestList?.length > 1) {
        const paramDirection = paramOrderToParamsList.longestList[0].paramDirection
        const paramOrder = paramOrderToParamsList.longestList[0].paramOrder
        return this.$message.error(`${ paramDirection == "0" ? "输入参数" : "输出参数"}中存在${paramOrderToParamsList.longestList?.length}个paramOrder为${paramOrder}的参数，无法保存`)
      }
      // const layoutServiceBeanList = this.outputTargetList.map(item => {
      //   item.tfrCdtnCd = JSON.stringify({
      //     paramKey: item.paramKey,
      //     paramNm: item.paramNm,
      //     condTyp: item.condTyp,
      //     paramValue: item.paramValue,
      //     actionPostSeq: item.actionPostSeq,
      //   })
      //   return item
      // })
      // if (layoutServiceBeanList.length && layoutServiceBeanList.some(item => !item.paramKey || !item.paramNm || !item.condTyp || !item.paramValue || !item.actionPostSeq )) {
      //   console.log("layoutServiceBeanList", layoutServiceBeanList)
      //   return this.$message.error("请完善交易编排列表")
      // }
      // let tfrCdtnCd = []
      // if (this.confFormData.conditionType === '0') {
      //   tfrCdtnCd = this.outputTargetList.reduce((prev, item) => {
      //     // paramValueType 参数值类型
      //     // paramKeySrcType 参数Key来源类型
      //     // paramValueSrcType 参数值来源类型
      //     // paramValueSrcActionId 参数值来源组件ID
      //     let paramKeySrcType = ''
      //     if (item.actionId === this.currentServObj?.svcId) {
      //       paramKeySrcType = '00'
      //     } else {
      //       paramKeySrcType = '20'
      //     }
      //     const id = item.paramValueSrcActionId
      //     let paramValueSrcType = ''
      //     if (id === '10') {
      //       paramValueSrcType = '10'
      //     } else if (id === this.currentServObj?.svcId) {
      //       paramValueSrcType = '00'
      //     } else {
      //       paramValueSrcType = '20'
      //     }
      //     prev.push({
      //       actionId: item.actionId,
      //       actionNm: item.actionNm,
      //       paramKey: item.paramKey,
      //       paramNm: item.paramNm,
      //       paramType: item.paramType,
      //       condTyp: item.condTyp,
      //       paramValue: item.paramValue,
      //       actionPostSeq: item.actionPostSeq,
      //       paramValueType: item.paramValueType,
      //       paramKeySrcType: paramKeySrcType,
      //       paramValueSrcType: paramValueSrcType,
      //       paramValueSrcActionId: item.paramValueSrcActionId === '10' ? '' : item.paramValueSrcActionId,
      //       paramValueNm: item.paramValueNm,
      //     })
      //     return prev
      //   }, [])
      //   console.log(tfrCdtnCd, 'tfrCdtnCd----')
      //   if (tfrCdtnCd.length) {
      //     const keyToErrorMessage = {
      //       actionId: "来源不能为空",
      //       paramKey: "返回字段不能为空",
      //       paramNm: "返回字段不能为空",
      //       condTyp: "对比关系不能为空",
      //       paramValue: "对比值不能为空",
      //       actionPostSeq: "后续顺序号不能为空",
      //     }
      //     for (let key in keyToErrorMessage) {
      //       if (tfrCdtnCd.some(item => !item[key])) return this.$message.error(keyToErrorMessage[key])
      //     }
      //   }
      //   // 如果交易编排列表的返回字段key没有层级结构，则不通过(临时增加的校验，后续删除)
      //   const notMatchKeyItem = tfrCdtnCd.find(item => !item?.paramKey.includes(".") && item.paramKey != "loopOutputList" && !["设置会话组件", "获取会话组件", "文件上传组件"].includes(item.actionNm))
      //   if (notMatchKeyItem) return this.$message.error(`返回字段【${notMatchKeyItem.paramNm}】的参数格式有误，请重新设置`)
      // } else {
      //   tfrCdtnCd = []
      //   for (let i = 0; i < this.outputTargetList2.length; i++) {
      //     const item = this.outputTargetList2[i].conditionList;
      //     const list = item.map((item) => {
      //       let paramKeySrcType = ''
      //       if (item.actionId === this.currentServObj?.svcId) {
      //         paramKeySrcType = '00'
      //       } else {
      //         paramKeySrcType = '20'
      //       }
      //       const id = item.paramValueSrcActionId
      //       let paramValueSrcType = ''
      //       if (id === '10') {
      //         paramValueSrcType = '10'
      //       } else if (id === this.currentServObj?.svcId) {
      //         paramValueSrcType = '00'
      //       } else {
      //         paramValueSrcType = '20'
      //       }
      //       if (item.actionNm == "当前4b交易") item.actionId = ""
      //       return {
      //         actionId: item.actionId,
      //         actionNm: item.actionNm,
      //         paramKey: item.paramKey,
      //         paramNm: item.paramNm,
      //         paramType: item.paramType,
      //         condTyp: item.condTyp,
      //         paramValue: item.paramValue,
      //         actionPostSeq: item.actionPostSeq,
      //         paramValueType: item.paramValueType,
      //         paramKeySrcType: paramKeySrcType,
      //         paramValueSrcType: paramValueSrcType,
      //         paramValueSrcActionId: item.paramValueSrcActionId === '10' ? '' : item.paramValueSrcActionId,
      //         paramValueNm: item.paramValueNm,
      //         groupOperator: item.groupOperator,
      //       }
      //     })
      //     if (!list[0]?.actionPostSeq) {
      //         return this.$message.error(`第${i + 1}个逻辑分组的后续顺序号不能为空`)
      //     }
      //     tfrCdtnCd.push({
      //       activityNextSeq: list[0]?.actionPostSeq || '',
      //       conditionList: list
      //     })
      //   }

      //   if (tfrCdtnCd.length) {
      //     const keyToErrorMessage = {
      //       actionId: "来源不能为空",
      //       paramKey: "返回字段不能为空",
      //       paramNm: "返回字段不能为空",
      //       condTyp: "对比关系不能为空",
      //       paramValue: "对比值不能为空",
      //       // actionPostSeq: "后续顺序号不能为空",
      //       groupOperator: '操作符不能为空'
      //     }
      //     for (let i = 0; i < tfrCdtnCd.length; i++) {
      //       const item = tfrCdtnCd[i];
      //       if (!item.conditionList.length) {
      //         return this.$message.error('交易编排逻辑分段不能为空')
      //       }
      //     }
      //     for (let key in keyToErrorMessage) {
      //       for (let i = 0; i < tfrCdtnCd.length; i++) {
      //         let item = tfrCdtnCd[i].conditionList;
      //         if (item.length) {
      //           for (let j = 0; j < item.length; j++) {
      //             const element = item[j];
      //             if (key === 'groupOperator') {
      //               if (j < (item.length - 1) && !element[key]) {
      //                 console.log(item, "itemitem")
      //                 return this.$message.error(`第${i + 1}个逻辑分组的第${j + 1}行${keyToErrorMessage[key]}`)
      //               } else if (j === (item.length - 1) && element[key]) {
      //                 console.log(element, "itemitem", item.length)

      //                 return this.$message.error(`第${i + 1}个逻辑分组最后一行逻辑符号只能为空`)
      //               }
      //               continue
      //             }

      //             if (!element[key]) {
      //               return this.$message.error(`第${i + 1}个逻辑分组的第${j + 1}行${keyToErrorMessage[key]}`)
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }
      // }



      // tfrCdtnCd.forEach((item) => {
      //   if (item.actionNm == "当前4b交易") item.actionId = ""
      // })
      // const layoutServiceBeanList = {
      //   svcId: this.currentObj.actionOwnId,
      //   actionKey: "",
      //   actionId: this.currentObj.compositeId,
      //   actionNm: this.currentObj.actionName,
      //   actionTyp: "1",
      //   loSeqNo: "",
      //   frntLoSeqNo: "",
      //   postLoSeqNo: "",
      //   tranId: this.currentServObj?.svcId,
      //   tfrCdtnCd: JSON.stringify(tfrCdtnCd),
      //   layoutActionList: []
      // }
      // 错误码、错误信息必须同时填写
      if (this.confFormData.errorCode && !this.confFormData.errorMsg) {
        return this.$message.error("请填写错误信息")
      } else if (!this.confFormData.errorCode && this.confFormData.errorMsg) {
        return this.$message.error("请填写错误码")
      }
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
      console.log(e, 'saveServiceCpnParams')
      const params = {
        d4StusCd: "1",
        blngtoTyp: "10",
        // apiId: e.svcId || e.actionOwnId,
        apiId: this.fourRAttrFlag ? this.currentParentCpnInfo.compositeId : this.currentServObj.apiId,
        paramList,
        // layoutServiceBeanList,
        confList,
        compositeId: e.compositeId || "",
        compositeStepNo: e.conf.filter(k => k.name == 'actionSeq')[0].value
      }
      // await this.rpc.d4.saveServiceCpnParams(params)
      this.rpc.s4design.addFuntionJobCommitFlow({
        fnctId: this.$route.query.fnctId,
        jobTpCd: 'C4',
      })
      this.commitSameStartActionLayoutRel(this.currentObj)    
      this.setCpnParamsRecord()
      // this.upDateServParams(this.currentObj, paramList)
      this.$emit("upDateServParams", JSON.parse(JSON.stringify(this.currentObj)), params, {})
      // this.$emit("updateServiceArrangeList", layoutServiceBeanList)
      // 更新完参数，调保存流程图接口
      // this.toSave(true)
    },
    // 输出目标-增加行
    addOutputTargetLine(index = -1) {
      const row = JSON.parse(JSON.stringify(this.layoutActionList[0] || {}))
      row.svcId = row.svcId || this.currentObj.svcId
      row.tranId = row.tranId || this.currentServObj?.svcId
      row.actionId = row.actionId || this.currentObj.compositeId
      row.postLoSeqNo = ""
      row.actionPostSeq = ""
      row.paramKey = ""
      row.paramNm = ""
      row.condTyp = "="
      row.paramValue = ""
      row.id = '1'
      row.paramValueSrcActionId = row.actionId || this.currentObj.compositeId
      if (index === -1) {
        this.outputTargetList.push(row)
        this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
      } else {
        row.groupOperator = ''
        this.outputTargetList2[index].conditionList.push(row)
      }
    },
    outputTargetOperate(operation, data, index = -1) {
      console.log("outputTargetOperate", operation, data)
      this.operateType = operation
      if (operation == "paramNm") {
        this.$refs.selectOutputFieldRef.showDialog(data, this.formData)
      } else if (operation == "actionPostSeq") {
        this.$refs.selectOutputPostSeqRef.showDialog(data)
      } else if (operation == "delete") {
        if (index === -1) {
          const index1 = this.outputTargetList.indexOf(data)
          this.outputTargetList.splice(index1, 1)
        } else {
          const target = this.outputTargetList2[index].conditionList
          const index1 = target.indexOf(data)
          target.splice(index1, 1)
        }

      } else if (operation === 'paramValue') {
        if (data.paramValueSrcActionId == '10') {
          console.log('??shit');
          // this.enumVisible = true
          this.$refs.selectEnumRef.showDialog(data)
          
        } else {
          this.$refs.selectOutputFieldRef.showDialog(data, this.formData, 'paramValueSrcActionId')
        }
      }
    },
    // 选中枚举
    selectEnumVal() {
      
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    },
    outputTargetSelectChange(row, prop) {
      if (prop == "paramNm") {
        const item = this.formData.paramList.find(item => item.paramCName == row.paramNm)
        // const tfrCdtnCd = JSON.parse(row.tfrCdtnCd || "{}")
        // tfrCdtnCd.paramKey = item.paramKey
        // tfrCdtnCd.paramNm = item.paramCName
        // row.tfrCdtnCd = JSON.stringify(tfrCdtnCd)
        row.paramKey = item.paramKey
      } else if (prop == "actionId") {
        // const tfrCdtnCd = JSON.parse(row.tfrCdtnCd || "{}")
        // tfrCdtnCd.paramKey = ""
        // tfrCdtnCd.paramNm = ""
        // tfrCdtnCd.actionId = ""
        // row.tfrCdtnCd = JSON.stringify(tfrCdtnCd)
        row.paramKey = ""
        row.paramNm = ""
        row.actionNm = this.svcIdToSvcNm[row.actionId]
      } else if (prop == "paramValueSrcActionId") {
        row.paramValue = ''
        row.paramValueNm = ''
        if (row.paramValueSrcActionId === '10') {
          row.elementType = 'text'
        } else {
          row.elementType = 'text'
        }
      }
    },
    setOutputTarget(type, target, obj) {
      console.log("setOutputTarget", type, target, obj, this.outputTargetList.indexOf(target))
      if (this.operateType === 'paramValue') {
        target.paramValue = obj.paramKey
        target.paramValueType = obj.paramType
        target.paramValueNm = obj.paramCName
      } else if (type == "paramNm") {

        // paramValueType 参数值类型
        // paramKeySrcType 参数Key来源类型
        // paramValueSrcType 参数值来源类型
        // paramValueSrcActionId 参数值来源组件ID
        // target.paramKey = obj.paramKey
        // target.paramNm = obj.paramCName
        // target.paramType = obj.paramType
        this.$set(target, 'paramNm', obj.paramCName);
        this.$set(target, 'paramKey', obj.paramKey);
        this.$set(target, 'paramType', obj.paramType);
        if (["List", "Object"].includes(target.paramType)) {
          target.paramValue = "null"
          target.condTyp = "="
        }
      } else if (type == "actionPostSeq") {
        target.actionPostSeq = obj.actionSeq
        target.postLoSeqNo = obj.actionSeq
      }
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    },
    async getD4bServiceInfo(data) {
      console.log("getD4bServiceInfo", data)
      const res = await this.rpc.d4.getD4bServiceInfo({
        dsgnFlg: "0",
        svcId: data.svcId,
        // svcStsCd: "1", // 1发布，0未发布
        fnctId: this.fnctId,
      })
      // this.getFlowParams(res)
      this.formData = res
      this.currentObj = {...res, ...this.currentObj};
      this.inputParamsList  = reList(res.puApiParams.filter((item) => item.paramDirection == "0"));
      this.outputParamsList = reList(res.puApiParams.filter((item) => item.paramDirection == "1"));
      this.cBusinessRuleList = res.bizRuleList
      // this.showType = "d4bInfo"
    },
    setDisabled(children, status = true, parent = null) {
      console.log(children)
      for (let i = 0; i < children?.length; i++) {
        const item = children[i];
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
    // 获取服务组件的参数
    async getServiceCpnParams(e) {
      console.log("getServiceCpnParams", e)
      
      if (e.compositeId) {
        const blngtoTyp = e.actionType.indexOf("D4") > -1 ? "10" : "11"
        const params = {
          d4StusCd: "1",
          blngtoTyp,
          compositeId: e.compositeId || "",
          apiId: e.actionOwnId,
          d4bApiId: this.currentServObj.apiId || this.currentServObj?.svcId,
          bizDomainNo: this.currentServObj.bizLineId || this.currentServObj.beltLine,
        }
        this.disabled = true
        
        Promise.all([
          // this.rpc.d4.getServiceCpnParams(params),
          this.rpc.d4.queryL5ParamAndRuleDefinitions(params)
        ]).then(([ruleInfo]) => {
          // this.executionSteps = interfaceInfo.interfaceProcessActionLayoutRelList.filter(item => item.endActionType == '00') || []
          // this.errorSteps = interfaceInfo.interfaceProcessActionLayoutRelList.filter(item => item.endActionType == '01') || []
          // 处理参数
          let paramList = []
          if(e.paramList.length > 0) {
            paramList = e.paramList
          } else {
            paramList = ruleInfo.paramList
          }
          paramList.forEach(item => {
            if (item.apSource == "00") {
              item.actionName = "当前4b交易"
              item.actionId = this.currentServObj?.svcId
            } else if (item.apSource == "10") {
              item.actionId = "constantValue"
            }
          })
          for (let i = 0; i < paramList.length; i++) {
            const item = paramList[i];
            if (item.actionId === 'getSessionInfo') {
              item.actionId = '获取会话组件'
              item.actionName = '获取会话组件'
            }
          }
          this.inputParamsListAtSetting = reList(paramList.filter((item) => item.paramDirection == "0"));

          this.setDisabled(this.inputParamsListAtSetting)
          // this.inputParamsListAtSetting.forEach((item) => {
          //   console.log(item.paramKey)
          //   if (item.paramKey !== 'bodyData') {
          //     //  置灰
          //     this.setParamDisabled(item)
          //   }
          // })
          this.outputParamsListAtSetting = reList(paramList.filter((item) => item.paramDirection == "1"));
          // 处理配置信息（异常信息、组件前后位置序号）
          this.formData = ruleInfo
          // this.confKeyList.forEach((item) => {
          //   const target = res.confList.find((conf) => conf.confKey == item.key);
          //   this.confFormData[item.key] = target?.confValue || item.value;
          // })
          // this.confFormData.actionFrntSeq = e.conf.find((conf) => conf.name == "actionFrntSeq")?.value || ""
          // this.confFormData.actionPostSeq = e.conf.find((conf) => conf.name == "actionPostSeq")?.value || ""
          // 处理规则信息
          this.ruleInfo = ruleInfo
          const that = this.$refs.ruleTableRef
          if (that) that.setRuleInfo(ruleInfo)
          this.setCpnParamsRecord()
          this.getServiceArrangeList(e),

          this.disabled = false
        })
      } else {
        
        this.getServiceCpnDefaultParams(e)
      }
    },
    async getServiceCpnDefaultParams(e) {
      
      console.log("getServiceCpnDefaultParams", e,this.currentServObj)
      this.currentObj = e
      let apiId = e.conf.find(item => item.name == "svcId").value
      // const blngtoTyp = e.actionType.indexOf("D4") > -1 ? "10" : "11"
      // const params1 = {
      //     d4StusCd: "1",
      //     blngtoTyp,
      //     compositeId: e.compositeId || "",
      //     apiId: e.actionOwnId,
      //     d4bApiId: this.currentServObj.apiId || this.currentServObj?.svcId,
      //     bizDomainNo: this.currentServObj.bizLineId || this.currentServObj.beltLine,
      //   }
        
      //   const result = await this.rpc.d4.getServiceCpnParams(params1)
      //   //当前起点组件信息
      //   this.currentCompInfo = {
      //     compositeId: result.compositeId,
      //     compositeName: result.compositeName,
      //     compositeStepNo: result.compositeStepNo
      //   }
      // const blngtoTyp = e.actionType.indexOf("D4") > -1 ? "10" : "11"
      const params = {
        d4StusCd: "1",
        blngtoTyp: "10",
        apiId: apiId,
        d4bApiId: this.currentServObj.apiId || this.currentServObj?.svcId,
        bizDomainNo: this.currentServObj?.bizLineId || this.currentServObj.beltLine,
      }
      console.log("=====", params, this.currentServObj.beltLine)
      const res = await this.rpc.d4.queryL5ParamAndRuleDefinitions(params)
      this.formData = res
      this.formData.svcId = apiId
      this.setInputAndOutputList(res.paramList)
      // if (e.compositeId) {
      //   await this.getServiceArrangeList(e)
      // }
      // 处理规则信息及异常信息
      this.ruleInfo = res
      this.confKeyList.forEach((item) => {
        const target = e.conf.find((conf) => conf.name == item.key);
        this.confFormData[item.key] = target?.value || item.value;
      })
      const that = this.$refs.ruleTableRef
      if (that) that.setRuleInfo(res)
      this.setCpnParamsRecord()
      this.disabled = false
      // this.showType = "d4bInfo"
      // if(this.isRead) return this.d4bActive = "d4b"
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
    /**
     * queryInterfaceProcessActionLayoutRel
     * 查询接口流程组件编排关系
     */
    queryInterfaceProcessActionLayoutRel() {
      this.rpc.d4.queryInterfaceProcessActionLayoutRel()
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

      console.log(this.confFormData.conditionType, 'confFOrmdata')
      if (this.confFormData.conditionType === '1') {
        this.outputTargetList2 = JSON.parse(JSON.stringify(tfrCdtnCd))
        this.outputTargetList2.forEach((item) => {
          item.conditionList.forEach((data) => {
            data.id = '1'
            data.actionId = data.actionNm == "当前4b交易" ? this.currentServObj?.svcId : data.actionId,
            data.paramValueSrcActionId = data.paramValueSrcActionId ? data.paramValueSrcActionId : '10'
            // data.elementType = data.paramValueSrcType === '10' ? 'input' : 'text'
            data.elementType = 'text'
          })
        })
        setTimeout(() => {
          this.$refs.table.forEach((item) => {
            item.initSpanArr()
          })
        }, 500)
      } else {
        this.outputTargetList = tfrCdtnCd.map(item => {
          return {
            ...item,
            actionId: item.actionNm == "当前4b交易" ? this.currentServObj?.svcId : item.actionId,
            paramValueSrcActionId: item.paramValueSrcActionId ? item.paramValueSrcActionId : '10',
            // elementType: item.paramValueSrcType === '10' ? 'input' : 'text',
            elementType: 'text',
          }
        })
        this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
      }
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
        console.log(this.inputParamsListAtSetting, 'inputParamsListAtSetting')
        const that = this.$refs.ruleTableRef
        if (that) that.setRuleInfo(res)
      })
    },
    resetParamList() {
      console.log("resetParamList")
      this.$confirm("重置参数将会把输入参数、输出参数还原至初始状态，是否继续？").then(async () => {
        const apiId = this.currentObj?.conf?.find(item => item.name == "svcId").value
        const params = {
          d4StusCd: "1",
          blngtoTyp: "10",
          apiId: apiId,
          d4bApiId: this.currentServObj.apiId || this.currentServObj?.svcId,
          bizDomainNo: this.currentServObj.bizLineId || this.currentServObj.beltLine,
        }
        const res = await this.rpc.d4.queryL5ParamAndRuleDefinitions(params)
        this.setInputAndOutputList(res.paramList);
        // this.saveServiceCpnParams();
      })
    },
    setInputAndOutputList(paramList) {
      paramList.forEach(item => {
        if (item.apSource == "00") {
          item.actionName = "当前4b交易"
          item.actionId = this.currentServObj?.svcId
        }
      })
      const inputParamsListAtSetting = paramList.filter((item) => item.paramDirection == "0")
      inputParamsListAtSetting.forEach((param) => {
        if (param.paramMappingKey) {
          param.paramMappingKey = packageParamKey(param, inputParamsListAtSetting)
        }
      })
      this.inputParamsListAtSetting = reList(inputParamsListAtSetting);
      this.outputParamsListAtSetting = reList(paramList.filter((item) => item.paramDirection == "1"));
    },
    /**
     * 获取执行规则和异常信息
     */
    getBranchErrorList(list) {
      console.log(list, 'getBranchErrorList')
      this.executionSteps = []
      this.errorSteps = []
      list.forEach(e => {
        if(e.condition.endActionType == '00') {
          this.executionSteps.push(e.condition)
        }
        if(e.condition.endActionType == '01') {
          this.errorSteps.push(e.condition)
        }
      })
      console.log(this.errorSteps, 'getBranchErrorListerrorSteps')
      
      
    },
    async init(e, click) {
      console.log(e, click,'组件init--------')
      //当前起点组件信息
        this.currentCompInfo = {
          compositeId: e.compositeId,
          compositeName: e.actionName,
          sourceId: e.actionId,
          compositeStepNo: e.conf.find((item) => item.name == 'actionSeq').value
        }
      this.showServInfoFlag = false
      this.inputParamsListAtSetting = []
      this.outputParamsListAtSetting = []
      this.outputTargetList = []

      this.getBranchErrorList(e.children)
      // this.bodyOutData = []
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
      this.$nextTick(async () => {
        // 获取组件信息
        //e.paramList.length > 0是否去掉
        if (click && e.paramList.length > 0) {
          console.log("点击触发", e)
          await this.getServiceCpnParams(e)
        } else {
          // 拖拽触发
          console.log("拖拽触发", e)
          await this.getServiceCpnDefaultParams(e)
        }
      })
    },
    checkRule(data) {
      this.$emit("checkRule", data)
    }
  },
  created() {
    // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
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
  watch:{
    newInputParamsListAtSetting(){
        console.log(this.newInputParamsListAtSetting,'this.newInputParamsListAtSetting')
        this.newInputParamsListAtSetting.forEach((ele)=>{
            if(ele.apSource=='120'){
                //符合来源为复合来源的 不禁用
                if(ele.children&&ele.children.length>0){
                    ele.children.forEach((item)=>{
                        item.disabled2 = false
                        item.disabled = false
                    })
                }
            }
        })
    }
  }
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
      display: inline-block;
      margin-right: 10px;
      &.bold {
        font-weight: 600;
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
    padding: 12px 0;
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
  .add_line_group {
    float: right;
    margin-bottom: 10px;
    margin-top: 10px;
    margin-left: 10px;
  }
}
</style>
