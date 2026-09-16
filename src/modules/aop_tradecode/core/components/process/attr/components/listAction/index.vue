<template>
  <div class="aop_tradecode_comps_design_attr_loop_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>集合处理组件</div>
      </div>
      <div v-if="!isRead && !fourRAttrFlag" class="attr_box">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t required">
              组件名称：
            </div>
            <div class="attr_show_item_c">
              <el-input :disabled="!canSave" v-model="formData.actionDesc" size="mini"></el-input>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              &nbsp;&nbsp;组件描述：
            </div>
            <div class="attr_show_item_c textarea">
              <el-input
                maxlength="1000"
                show-word-limit
                autosize
                :disabled="!canSave"
                type="textarea"
                v-model="formData.actionMsg"
                placeholder="组件描述"
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t required">
              集合：
            </div>
            <div class="attr_show_item_c left">
              <el-select
                :disabled="!canSave"
                v-model="formData.loopListSource"
                size="mini"
                @change="loopListSourceChange"
                placeholder="请选择来源"
              >
                <el-option
                  v-for="item in loopListSourceOptions"
                  :key="item"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>

            </div>
            <div class="attr_show_item_c right">
              <el-select @change="handleLoopChange" :disabled="!canSave" v-model="formData.loopList" size="mini" placeholder="请选择循环集合">
                <el-option
                  v-for="item in loopListOptions"
                  :key="item"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t required">
              集合操作：
            </div>
            <div class="attr_show_item_c left">
                <el-radio-group v-model="formData.listType" :disabled="!canSave">
                  <el-radio :label="'10'" :disabled="!canSave">交集</el-radio>
                  <el-radio :label="'20'" :disabled="!canSave">并集</el-radio>
                </el-radio-group>
            </div>
          </div>
          <div class="attr_show_item" v-if="formData.listType === '20'">
            <div class="attr_show_item_t required">
              是否去重：
            </div>
            <div class="attr_show_item_c left" style="margin-top: 5px;">
              <el-radio-group v-model="isRepeat" :disabled="!canSave">
                <el-radio :label="true" :disabled="!canSave">是</el-radio>
                <el-radio :label="false" :disabled="!canSave">否</el-radio>
              </el-radio-group>
            </div>
          </div>
          <!-- <div class="attr_show_item border_bottom pb20">
            <div class="attr_show_item_t required">
              循环集合：
            </div>
            <div class="attr_show_item_c">
              <el-select :disabled="!canSave" v-model="formData.loopList" size="mini">
                <el-option
                  v-for="item in loopListOptions"
                  :key="item"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div> -->
        </div>
        <div class="transition_arrange">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b required bold">输入参数</div>
              <div>
              <i class="el-icon-more" style="cursor: pointer; margin-right: 10px;" @click="switchTableMode('inputAtSetting')"></i>
                <el-button
                v-if="canSave"
                type="primary"
                size="mini"
                @click="showDialog2"
              >添加</el-button>
              </div>

            </div>
          </div>
          <div class="attr_recive mb20">
            <div class="attr_show_item_c">
              <Table
                class="table input_list"
                :data="tableData"
                :table="tableColumn"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
                @operate="operateInput"
                @inputClick="inputClick"
              ></Table>
            </div>
          </div>
        </div>
        <div class="output_table">
          <div class="table_header">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b required bold">输出参数</div>
            </div>
          </div>
          <div class="attr_show_item_c">
            <Table
              class="table output_list"
              :data="loopOutputList"
              :table="loopOutputColumn"
              :rowK="'paramOrder'"
              :rowKey="expandRowKeys"
              :treeProps="{ children: 'children' }"
              @operate="operate"
              :rowClass="rowClass"
            ></Table>
          </div>
        </div>
        <div class="transition_arrange" v-if="isList">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b required bold">条件编排</div>
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
              <el-button
                v-if="canSave"
                type="primary"
                size="mini"
                class="mt10"
                @click="addOutputTargetLine"
              >添加一行</el-button>
            </div>
            <div v-if="!isRead">
              <div class="tips_info" v-if="!canSave">
                <el-tag type="warning">保存交易编排后，可对组件信息进行编辑</el-tag>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isRead && !fourRAttrFlag" class="attr_btn">
          <el-button
            v-if="canSave"
            type="primary"
            size="small"
            @click="saveParams"
            class="right_button"
            >保存</el-button
          >
        </div>
      </div>
      <div v-else class="attr_box">
        <div class="attr_show read">
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              组件名称：<span class="attr_show_item_i">{{
                formData.actionDesc
              }}</span>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t textLeft">
              组件描述：<span class="attr_show_item_i">{{
                formData.actionMsg
              }}</span>
            </div>
          </div>
        </div>
        <div class="transition_arrange">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b required bold">输入参数</div>
            </div>
          </div>
          <div class="attr_recive mb20">
            <div class="attr_show_item_c">
              <Table
                class="table input_list"
                :data="tableData"
                :table="tableColumn"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
                @operate="operateInput"
                @inputClick="inputClick"
              ></Table>
            </div>
          </div>
        </div>
        <div class="output_table read">
          <div class="table_header">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">输出参数</div>
            </div>
            <el-button
              v-if="canSave"
              type="primary"
              size="mini"
              @click="showDialog('noSource')"
              >添加</el-button
            >
          </div>
          <div class="attr_show_item_c">
            <Table
              class="table output_list"
              :data="loopOutputList"
              :table="loopOutputColumn"
              :rowK="'paramOrder'"
              :rowKey="expandRowKeys"
              :treeProps="{ children: 'children' }"
              @operate="operate"
              :rowClass="rowClass"
            ></Table>
          </div>
        </div>
        <div class="transition_arrange read">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">条件编排</div>
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
              <el-button
                v-if="canSave"
                type="primary"
                size="mini"
                class="mt10"
                @click="addOutputTargetLine"
              >添加一行</el-button>
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
    <SelectListParams ref="selectListParamsRef" @confirm="handleSetData">
    </SelectListParams>
    <!-- 选择参数的弹窗 -->
    <SelectParams
      ref="selectParamsRef"
      :currentServObj="currentServObj"
      :currentObj="currentObj"
      @confirm="confirm"
    ></SelectParams>
    <!-- 选择参数的弹窗 -->
    <SelectParams2
      ref="selectParamsRef2"
      :currentServObj="currentServObj"
      :currentObj="currentObj"
      @confirm="confirm2"
    ></SelectParams2>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import SelectOutputField from "../service_setting/selectOutputField"
import SelectParams from "./components/selectParams"
import SelectParams2 from "./components/selectParams2"
import SelectListParams from "./components/selectListParams"
import { unduplicated } from "@m/utils/array";
import { reList, mixList, setParamOrder, packageParamKey } from "@m/utils/paramTree";
import { sourceActionType, actionTypeToApSource, actionNameToNoActionId } from "@m/utils/normalData";

import {
  setSessionStorage,
} from "@m/utils/localStorage";
export default {
  mixins: [mixin],
  components: {
    Table,
    SelectOutputField,
    SelectParams,
    SelectParams2,
    SelectListParams,
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
    dataList: {
      type: Array,
      default: () => [],
    },
    type: {
      type: Boolean,
      default: () => false,
    },
    showTips: {
      type: Boolean,
      default: () => true,
    },
    fourRAttrFlag: {
      type: Boolean,
      default: () => false,
    },
    currentParentCpnInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isNeedCheck: "",
      paramValueSelect: [],
      isEnumList: false,
      formData: {
        actionDesc: "",
        actionMsg: "",
        loopListSource: "",
        loopList: "",
        listType: "10",
      },
      // loopListSourceOptions: [],
      // loopListOptions: [],
      paramList: [],
      currentObj: {},
      cpnData: {},
      inputParamsVisibleAtSetting: true,
      // 设置页签下的输入参数表格数据
      inputParamsListAtSetting: [],
      // 控制设置页签下的输出参数列表显示或隐藏
      outputParamsVisibleAtSetting: true,
      // 设置页签下的输出参数表格数据
      outputParamsListAtSetting: [],
      loopListVisibleAtSetting: true,
      // 设置页签下的输出参数表格数据
      loopListAtSetting: [],
      tempParamsListAtSetting: [],
      tableParamList: [],
      tableType: false,
      currentRow: {},
      cpnParamsRecord: {},
      actionIdRecord: "",
      tempDataList: [],
      chooseData: [],
      // 选择参数弹框
      addVisible: false,
      // 输入输出参数弹框的搜索表单
      formInline: {
        content: "",
        clsfId: "",
        dictType: "",
      },
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      // 输入输出参数弹框列表数据
      dictList: [],
      // 输入输出参数弹框选择类型下拉框数据
      dictGategList: [],
      // 当前数据
      isData: {},
      // 已选参数数组
      tableData: [],
      selectionData: [],
      // 输入列表数据
      iInputList: [],
      // 输出列表数据
      iOutputList: [],
      // 循环集合数据
      iLoopList: [],
      // 临时参数列表数据
      iTempList: [],
      // 参数存放
      paramList: [],
      httpData: [],
      svcIdToSvcNm: {},
      transId: "",
      compositeIdMapToParamList: {},
      outputTargetList: [],
      layoutActionList: [],
      loopOutputList: [],
      expandRowKeys: ["1"],
      targetData: {},
      listTypeList: [
        {
          label: '交集',
          value: '01',
        },
        {
          label: '并集',
          value: '02',
        },
      ],
      isRepeat: true,
      showAllInputParamsAtSetting: false,
    };
  },
  computed: {
    isList() {
      return this.loopOutputList[0]?.paramType === "List"
    },
    tableColumn() {
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
            type: "text",
            placeholder: "请选择",
            inputStyle: {
              cursor: "pointer",
            },
            filter: (scope) => {
              const { actionName, actionId } = scope.row
              if (!actionName && !actionId) {
                return ""
              } else if (["当前4b交易", "当前循环组件", "固定值"].includes(actionName)) {
                return actionName
              } else {
                const item = this.getDataList().find(data => data.compositeId == actionId)
                if (item) {
                  const actionSeq = this.getConfItem("actionSeq", item.actionId).value
                  return `${actionName}(${actionSeq})`
                } else {
                  return scope.row.actionId
                }
              }
            },
          },
          {
            prop: (row) => {
              if (row?.actionId == "constantValue") {
                return "paramMappingKey"
              } else {
                return "paraMapgNm"
              }
            },
            label: "来源值",
            minWidth: "30%",
            type: 'text',
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
          {
            label: "操作",
            type: "button",
            // minWidth: "10%",
            width: "60",
            buttonList: [
              {
                desc: "删除",
                operate: "delete",
                relation: (scope) => {
                  // console.log(scope.row, this.tableData[0])
                  // if (scope.row?.paramKey === this.tableData[0]?.paramKey) {
                  //   return false
                  // }
                  // // return true
                  // const paramList = mixList(JSON.parse(JSON.stringify(this.tableData)), "children") || []
                  // const _parentParam = paramList.find(item => item.paramOrder == scope.row.paramParentId)
                  // console.log(_parentParam?.paramType, "paramTYpe")
                  // // if (_parentParam)
                  // console.log(!["List", "Object"].includes(_parentParam?.paramType), _parentParam?.paramType)
                  // if (!_parentParam) {
                  //   return true
                  // }
                  // return !["List", "Object"].includes(_parentParam?.paramType)
                  return scope.row.deleteBtn
                },
              },
            ],
          },
        ].filter(item => this.showAllInputParamsAtSetting || ["参数Key", "参数名称", "来源", "来源值", "操作"].includes(item.label));
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
                const actionSeq = this.getConfItem("actionSeq", item.actionId).value
                return `${actionName}(${actionSeq})`
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
        ]
      }
    },
    blngtoTyp() {
      return this.currentServObj.apiServiceType.indexOf("D4") > -1
        ? "10"
        : "11";
    },
    // 是否修改过组件的参数
    hasChangeCpnParams() {
      return false
      // const _formData = JSON.parse(JSON.stringify(this.formData));
      // _formData.inputParamsListAtSetting = this.inputParamsListAtSetting;
      // console.log("数据", this.inputParamsListAtSetting);
      // _formData.outputParamsListAtSetting = this.outputParamsListAtSetting;
      // return (
      //   this.cpnParamsRecord != JSON.stringify(_formData) &&
      //   this.actionIdRecord == this.currentObj.actionId
      // );
    },
    canSave() {
      return !this.isRead && this.currentObj.compositeId && !this.fourRAttrFlag
      // return false
    },
    loopListSourceOptions() {
      return Object.keys(this.compositeIdMapToParamList).reduce((prev, compositeId) => {
        if (compositeId != this.currentObj.compositeId) {
          const value = this.compositeIdMapToParamList[compositeId]?.actionSeq ? `(${this.compositeIdMapToParamList[compositeId]?.actionSeq})` : ''
          console.log('11111111111111111', this.compositeIdMapToParamList[compositeId])
          prev.push({
            value: compositeId,
            label: this.compositeIdMapToParamList[compositeId]?.svcNm + value,
            actionType: this.compositeIdMapToParamList[compositeId]?.actionType,
          })
        }
        return prev
      }, [])
    },
    loopListOptions() {
      const compositeId = this.formData.loopListSource
      const dataList = this.currentParentCpnInfo?.dataList || this.getDataList()
      const option = this.loopListSourceOptions.find(item => item.value == compositeId)
      const paramDirection = option?.value == this.currentServObj?.svcId ? "0" : "1"
      const item = dataList.find(data => data.compositeId && data.compositeId == compositeId)
      if (item || compositeId == this.currentServObj?.svcId) {
        let paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[compositeId]?.paramList || []))
        reList(paramList)
        paramList.map(param => {
          param.label = param.paramCName
          param.paramMappingKey = packageParamKey(param, paramList)
          param.value = param.paramMappingKey
          return param
        })
        let list = paramList.filter(param => param.paramType == "List" && param.paramDirection == paramDirection)
        return list
      } else {
        return []
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
            disabled: () => {
              return true
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
            type: "inputText",
            placeholder: "请输入",
            operate: 'paramNm2',
            disabled: (scope) => ["List", "Object"].includes(scope.row.paramType),
            filter(scope) {
              return scope.row.paramValueNm || "选择"
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
    loopOutputColumn() {
      if (this.canSave) {
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
            // minWidth: "15%",
            width: "70",
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
              return scope.row.actionName
              // if (scope.row.actionId && this.svcIdToSvcNm[scope.row.actionId]) {
              //   return this.svcIdToSvcNm[scope.row.actionId]
              // } else {
              //   return ""
              // }
            },
          },
          {
            prop: "paraMapgNm",
            label: "来源值",
            minWidth: "25%",
            type: "textClick",
            textClass: (scope) => {
              if (scope.row.paramParentId || scope.row.paramKey != "loopOutputList") {
                return "disabled"
              } else {
                return ""
              }
            },
            filter: (scope) => {
              return scope.row.paraMapgNm
            },
            operate: "set",
            tooltip: true,
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
                relation: (scope) => {
                  // console.log(scope.row, this.tableData[0])
                  // if (scope.row?.paramKey === this.tableData[0]?.paramKey) {
                  //   return false
                  // }
                  // // return true
                  // const paramList = mixList(JSON.parse(JSON.stringify(this.tableData)), "children") || []
                  // const _parentParam = paramList.find(item => item.paramOrder == scope.row.paramParentId)
                  // console.log(_parentParam?.paramType, "paramTYpe")
                  // // if (_parentParam)
                  // console.log(!["List", "Object"].includes(_parentParam?.paramType), _parentParam?.paramType)
                  // if (!_parentParam) {
                  //   return true
                  // }
                  // return !["List", "Object"].includes(_parentParam?.paramType)
                  return scope.row.deleteBtn
                },
              },
            ],
          },
        ]
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
            // minWidth: "15%",
            width: "70",
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
              if (scope.row.actionId && this.svcIdToSvcNm[scope.row.actionId]) {
                return this.svcIdToSvcNm[scope.row.actionId]
              } else {
                return ""
              }
            },
          },
          {
            prop: "paraMapgNm",
            label: "来源值",
            minWidth: "25%",
            type: "text",
            tooltip: true,
          },
        ]
      }
    }
  },
  inject: ["getDataList"],
  methods: {
    switchTableMode() {
      this.showAllInputParamsAtSetting = !this.showAllInputParamsAtSetting
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
    initData(item, list) {
      if (item.serviceId === this.currentServObj.svcId) {
        item.apSource = '00'
      } else {
        item.apSource = '20'
      }
      for (let i = 0; i < list.length; i++) {
        const item1 = list[i];
        this.setActionId(item1.children, item1) 
      }
    },
    initParamKey(item, list, index = 1) {
      const temp = item.paramKey
      for (let i = 0; i < list.length; i++) {
        const item1 = list[i];
        if (item.paramKey === item1.paramKey) {
          item.paramKey = temp.split('List')[0] + index + 'List'
          i = 0
          index += 1
        }      
      }
    },
    getActionName(row) {
      const { actionName, actionId } = row
      if (!actionName && !actionId) {
        return ""
      } else if (["当前4b交易", "当前循环组件", "固定值"].includes(actionName)) {
        return actionName
      } else {
        const item = this.getDataList().find(data => data.compositeId == actionId)
        if (item) {
          const actionSeq = this.getConfItem("actionSeq", item.actionId).value
          return `${actionName}(${actionSeq})`
        } else {
          return row.actionId
        }
      }
    },
    handleSetData(obj) {
      
      const target = this.targetData
      console.log(obj,target, 'handleSetData')
      // paramValueType 参数值类型
      // paramKeySrcType 参数Key来源类型 
      // paramValueSrcType 参数值来源类型 
      // paramValueSrcActionId 参数值来源组件ID
      let str = obj.paramMappingKey
      if (str && str.includes('bodyOutData.')) {
        str = obj.paramMappingKey.split('bodyOutData.')[1]
        obj.paramMappingKey = str
      }
      if (this.targetData.operation == "paramNm1") {
        this.targetData.paramKey = str
        this.targetData.paramNm = obj.paramCName
        this.targetData.paramType = obj.paramValueType
        if (["List", "Object"].includes(target.paramType)) {
          target.paramValue = "null"
          target.condTyp = "="
        }
      } else if (this.targetData.operation == "paramNm2") {
        target.paramValue = str
        target.paramValueType = obj.paramType
        target.paramValueNm = obj.paramCName
      }
      console.log(target, "target")
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    },
    handleLoopChange(e) {
      this.formData.loopList = e
      console.log(this.formData.loopList, e, "loopList")
      this.loopListOptions.forEach((item) => {
        if (item.value === e) {
          let obj = {
            ...item
          }
          this.initData(obj, this.tableData)
          this.initParamKey(obj, this.tableData)
          this.tableData[0] = obj
          obj.paraMapgNm = obj.label
          this.tableData = [...this.tableData]
          const compositeId = this.formData.loopListSource
          obj.actionId = compositeId
          const data = this.loopListSourceOptions.find(item => item.value == compositeId)
          obj.actionName = data.label
          this.setActionId(obj.children, obj)
          this.loopOutputList[0] = JSON.parse(JSON.stringify(obj))
          if (this.tableData.length > 1 && this.isList) {
            for (let i = 1; i < this.tableData.length; i++) {
              const data = this.tableData[i];
              const children = JSON.parse(JSON.stringify(data.children))
              this.loopOutputList[0].children.push(...children)
            }
          }
          this.setDisabled(this.loopOutputList[0].children)
          this.loopOutputList = [...this.loopOutputList]
          if (obj.serviceId === this.currentServObj.svcId) {
            obj.apSource = '00'
          } else {
            obj.apSource = '20'
          }
        }
      })
    },
    setActionId(children, parent) {
      children.forEach((child) => {
        child.actionName = parent.actionName
        child.actionId = parent.actionId
        child.apSource = parent.apSource
        child.paraMapgNm = child.paramName
      })
    },
    operateInput(operation, data) {
      if (operation == "delete") {
        const index = this.tableData.indexOf(data)
        this.tableData.splice(index, 1)
        this.tableData = setParamOrder(this.tableData)
      }
    },
    confirm2(data) {
      const obj = {
        ...data[0],
        children:[...data[0].children],
        deleteBtn: true,
      }
      // for (let i = 0; i < this.tableData.length; i++) {
      //   const item1 = this.tableData[i];
      //   if (obj.paramKey === item1.paramKey && item1.actionId === obj.actionId) {
      //     return
      //   }
      // }
      
      this.initData(obj, this.tableData)
      this.initParamKey(obj, this.tableData)
      this.tableData = [...this.tableData, obj]
      if (this.loopOutputList?.length && this.loopOutputList[0].paramType === "List") {
        const children = obj.children
        this.loopOutputList[0].children.push(...children)
        this.setDisabled(this.loopOutputList[0].children)
        this.loopOutputList[0].children = unduplicated(setParamOrder(this.loopOutputList[0].children), "paramKey")
        this.loopOutputList = JSON.parse(JSON.stringify(this.loopOutputList))
      }
      // this.tableData = unduplicated(setParamOrder(this.tableData), "paramKey")
      return
    },
    setDisabled(children) {
      for (let i = 0; i < children?.length; i++) {
        const item = children[i];
        item.deleteBtn = true
        if (item.children && item.children.length) {
          this.setDisabled(item.children)
        }
      }
    },
    async getParams(e, obj) {
      console.log("getParams", e, obj);
      this.init()
      this.currentObj = e;
      // this.loopListOptions = obj.puApiParams.filter((item) => item.paramDirection == 0 && ["List"].includes(item.paramType));
      if (!e.compositeId) {
        e.conf.map((item) => {
          this.formData[item.name] = item.value;
        });
        this.updateCompositeIdMapToParamList()
        await this.getServiceArrangeList(e)
        return;
      } else {
        // const params = {
        //   d4StusCd: "1",
        //   blngtoTyp: this.blngtoTyp,
        //   compositeId: e.compositeId || "",
        // };
        // const res = await this.rpc.d4.getServiceCpnParams(params);
        this.cpnData = e;
        if (e.paramList[0] && !e.paramList[0]?.children) {
          e.paramList[0].children = []
        }
        this.loopOutputList = reList(e.paramList.filter((item) => {
          return item.paramDirection === '1'
        }));
        this.loopOutputList = JSON.parse(JSON.stringify(this.loopOutputList))
        this.setDisabled(this.loopOutputList[0]?.children)
        this.tableData = reList(e.paramList.filter((item) => {
          return item.paramDirection === '0'
        }));
        // 更新实时位置序号
        let arr = ["actionSeq", "actionFrntSeq", "actionPostSeq"]
        arr.forEach((key) => {
          this.formData[key] = this.getConfItem(key, e.actionId)?.value || ""
        })
        this.tableData.forEach((item, index) => {
          if (index > 0) {
            item.deleteBtn = true
          }
        })
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        e.confList.map((item) => {
          if (!["actionSeq", "actionFrntSeq", "actionPostSeq"].includes(item.confKey)) {
            this.formData[item.confKey] = item.confValue;
          }
        });
        if (this.formData.listType === '21') {
          this.isRepeat = false
        }
        this.formData.listType = '20'
        // 更新实时位置序号
        // ["actionSeq", "actionFrntSeq", "actionPostSeq"].forEach((key) => {
        //   this.formData[key] = this.getConfItem(key, e.actionId)?.value || ""
        // })
        if (this.formData.loopListSource == "") this.formData.loopListSource = this.currentServObj?.svcId
        // await this.updateCompositeIdMapToParamList()
        const loopList = this.formData.loopList

        if (loopList && loopList != this.currentServObj?.svcId) {
          this.formData.loopList = ""
          await this.updateCompositeIdMapToParamList()
          // this.formData.loopList = loopList
          this.formData = {
            ...this.formData,
            loopList: loopList
          }
        }
        console.log(this.formData, "this.formData")

        await this.getServiceArrangeList(e)
      }
      this.setCpnParamsRecord();
    },
    // 查询编排列表
    async getServiceArrangeList(e) {
      console.log("getServiceArrangeList", e, this.currentServObj)
      this.layoutActionList = e.conf.filter(c => c.name == 'conditionStr')
      console.log(this.layoutActionList, "layoutActionList")
      const tfrCdtnCd = JSON.parse(this.layoutActionList[0].value || "[]")
      this.outputTargetList = tfrCdtnCd.map(item => {
        return {
          actionId: item.actionNm == "当前4b交易" ? this.currentServObj?.svcId : item.actionId,
          actionNm: item.actionNm,
          paramKey: item.paramKey,
          paramNm: item.paramNm,
          paramType: item.paramType,
          condTyp: item.condTyp,
          paramValue: item.paramValue,
          actionPostSeq: item.actionPostSeq,
          paramValueSrcActionId: item.paramValueSrcActionId,
          paramValueNm: item.paramValueNm,
          paramValueType: item.paramValueType,
          paramKeySrcType: '119',
          paramValueSrcType: '119',
        }
      })
      console.log(this.outputTargetList, "outputTargetList")
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    },
    async saveParams() {
      if (!this.formData.actionDesc) {
        return this.$message.error("组件名称不能为空")
      }
      if (!this.formData.loopList) {
        return this.$message.error("循环集合不能为空")
      }
      if (!this.outputTargetList.length && this.isList) {
        return this.$message.error("条件编排不能为空")
      }

      const tfrCdtnCd = this.outputTargetList.reduce((prev, item) => {
        prev.push({
          actionId: item.actionId,
          actionNm: item.actionNm,
          paramKey: item.paramKey,
          paramNm: item.paramNm,
          paramType: item.paramType,
          condTyp: item.condTyp,
          paramValue: item.paramValue,
          actionPostSeq: item.actionPostSeq,
          paramValueSrcActionId: item.paramValueSrcActionId,
          paramValueNm: item.paramValueNm,
          paramValueType: item.paramValueType,
          paramKeySrcType: '119',
          paramValueSrcType: '119',
        })
        return prev
      }, [])
      console.log(tfrCdtnCd, 'tfrCdtnCd')
      if (tfrCdtnCd.length) {
        const keyToErrorMessage = {
          actionId: "来源不能为空",
          paramKey: "返回字段不能为空",
          paramNm: "返回字段不能为空",
          condTyp: "对比关系不能为空",
          paramValue: "对比值不能为空",
        }
        for (let key in keyToErrorMessage) {
          if (tfrCdtnCd.some(item => !item[key])) return this.$message.error(keyToErrorMessage[key])
        }
      }
      tfrCdtnCd.forEach((item) => {
        if (item.actionNm == "当前4b交易") item.actionId = ""
      })
      const layoutServiceBeanList = {
        svcId: this.currentObj.actionOwnId,
        actionKey: "",
        actionId: this.currentObj.compositeId,
        actionNm: this.currentObj.actionName,
        actionTyp: "26",
        loSeqNo: "",
        frntLoSeqNo: "",
        postLoSeqNo: "",
        tranId: this.currentServObj?.svcId,
        tfrCdtnCd: JSON.stringify(tfrCdtnCd),
        layoutActionList: []
      }
      let confList = this.cpnData.confList || [];
      confList.push({
        confKey: 'conditionStr',
        confValue: JSON.stringify(tfrCdtnCd),
        confId: "",
        confDescr: "",
        compositeId: this.currentObj?.compositeId || "",
      })
      const _formData = JSON.parse(JSON.stringify(this.formData))
      _formData.loopListSource = _formData.loopListSource == this.currentServObj?.svcId ? "" : _formData.loopListSource
      for (let i in _formData) {
        const target = confList.find((item) => item.confKey == i);
        if (target) {
          target.confValue = _formData[i];
        } else {
          confList.push({
            confKey: i,
            confValue: _formData[i],
            confId: "",
            confDescr: "",
            compositeId: this.currentObj?.compositeId || "",
          });
        }
      }
      let arr = []
      for (let i = 0; i < confList.length; i++) {
        const item = confList[i];
        if (item.confKey !== 'actionFrntSeq' && item.confKey !== 'actionPostSeq' && item.confKey !== 'cacheKey') {
          arr.push(item)
        }
        if (item.confKey === 'listType') {
          if (item.confValue === '20' && !this.isRepeat) {
            item.confValue = '21'
          }
        }
      }
      // const paramList = mixList(this.loopOutputList, "children")
      const paramList = mixList(setParamOrder(this.loopOutputList), "children")
      paramList.map((item) => {
        item.paramDirection = '1'
      })
      let paramList2 = JSON.parse(JSON.stringify(this.tableData))
      paramList2 = setParamOrder(paramList2)
      paramList2 = mixList(paramList2, "children").map(param => {
        param.paramDirection = "0"
        if (actionNameToNoActionId.includes(param.actionName)) {
          param.actionId = ""
        }
        return param
      })
      // return this.loopOutputList = paramList
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: this.currentServObj?.svcId,
        paramList: [...paramList, ...paramList2],
        confList: arr,
        compositeId: this.currentObj?.compositeId || "",
      };
      console.log(params, "hhhhhhhhhhhhhh")
      // const { compositeId } = await this.rpc.d4.saveServiceCpnParams(params);
      // params.compositeId = compositeId;
      this.rpc.s4design.addFuntionJobCommitFlow({
        fnctId: this.$route.query.fnctId,
        jobTpCd: 'C4',
      })
      this.setCpnParamsRecord();
      console.log(params,layoutServiceBeanList, 'paramsparams')
      this.$emit("upDateServParams", JSON.parse(JSON.stringify(this.currentObj)), params, layoutServiceBeanList);
      // this.$emit("updateServiceArrangeList", layoutServiceBeanList);
      // this.$emit("toSave", true);
    },
    setCpnParamsRecord() {
      const _formData = JSON.parse(JSON.stringify(this.formData));
      _formData.inputParamsListAtSetting = this.inputParamsListAtSetting;
      _formData.outputParamsListAtSetting = this.outputParamsListAtSetting;
      this.cpnParamsRecord = JSON.stringify(_formData);
      this.actionIdRecord = this.currentObj.actionId;
      console.log("数据-setCpnParamsRecord", this.inputParamsListAtSetting);
      setSessionStorage("4R-paramsData", JSON.stringify(_formData));
    },
    getLoopListText(type) {
      if (type == "loopListSource") {
        return this.compositeIdMapToParamList[this.formData.loopListSource]?.svcNm
      } else if (type == "loopList") {
        const option = this.loopListOptions.find(item => item.value == this.formData.loopList)
        return option?.paramCName || ""
      }
    },
    async loopListSourceChange(e) {
      this.formData.loopList = ""
      console.log(this.loopListSourceOptions, "loopListSourceOptions", this.loopListOptions, 'this.loopListOptions')
      await this.updateCompositeIdMapToParamList()
    },
    async updateCompositeIdMapToParamList() {
      const compositeId = this.formData.loopListSource
      const item = this.compositeIdMapToParamList[compositeId]
      const apiId = item?.svcId
      if (compositeId && item && !(item?.paramList?.length)) {
        if (apiId && ["D4bAction", "D5SelfAction", "D5LinkAction"].includes(item.actionType)) {
          const res = await this.rpc.d4.queryL5ParamAndRuleDefinitions({
            d4StusCd: "1",
            blngtoTyp: "10",
            apiId: apiId,
            d4bApiId: this.currentServObj?.svcId || this.currentServObj.apiId,
            bizDomainNo: this.currentServObj.bizLineId,
          })
          item.paramList = res.paramList
        } else if (item.actionType == "loopAction") {
          const res = await this.rpc.d4.getServiceCpnParams({
            d4StusCd: "1",
            blngtoTyp: "11",
            compositeId: compositeId,
          })
          item.paramList = res.paramList
        }
      }
    },
    // 获取conf配置项
    getConfItem(name, actionId) {
      const dataList = this.currentParentCpnInfo?.dataList || this.getDataList()
      const cpn = dataList.find(data => data.actionId == actionId)
      return cpn?.conf?.find(item => item.name == name) || {}
    },
    // 输出目标-增加行
    addOutputTargetLine() {
      console.log("addOutputTargetLine", this.currentObj)
      const row = JSON.parse(JSON.stringify(this.layoutActionList[0] || {}))
      row.svcId = row.svcId || this.currentObj.svcId
      row.tranId = row.tranId || this.currentServObj?.svcId
      row.actionId = this.currentObj.compositeId
      row.actionNm = this.currentObj.actionName
      console.log(row.actionId, row.actionNm)
      row.postLoSeqNo = ""
      row.actionPostSeq = this.getactionPostSeq()[0]?.value
      row.paramKey = ""
      row.paramNm = ""
      row.condTyp = "="
      row.paramValue = ""
      row.paramValueSrcActionId = this.currentObj.compositeId
      console.log(row.paramValueSrcActionId, row.actionId, "sssssss")
      this.outputTargetList.push(row)
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    },
    outputTargetOperate(operation, data) {
      console.log("outputTargetOperate", operation, data, this.tableData.slice(1))
      if (operation == "paramNm1") {
        this.$refs.selectListParamsRef.showDialog(this.loopOutputList)
        this.targetData = data
        this.targetData.operation = 'paramNm1'
      } else if (operation == "paramNm2") {
        this.$refs.selectListParamsRef.showDialog(this.tableData)
        this.targetData = data
        this.targetData.operation = 'paramNm2'
      } else if (operation == "actionPostSeq") {
        this.$refs.selectOutputPostSeqRef.showDialog(data)
      } else if (operation == "delete") {
        const index = this.outputTargetList.indexOf(data)
        this.outputTargetList.splice(index, 1)
      }
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
      }
    },
    setOutputTarget(type, target, obj) {
      console.log("setOutputTarget", type, target, obj, this.outputTargetList.indexOf(target))
      if (type == "paramNm1") {
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
      }

      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    },
    showDialog(key) {
      this.$refs.selectParamsRef.showDialog(key);
    },
    showDialog2() {
      this.$refs.selectParamsRef2.showDialog();
    },
    confirm(key, data) {
      console.log("confirm", key, data);

      this.loopOutputList.push(...key)
    },
    operate(operation, data) {
      console.log("operate", operation, data);
      if (operation == "set") {
        if (data.paramParentId || data.paramKey != "loopOutputList") return

        this.showDialog("source")
      } else if (operation == "delete") {
        const list = this.loopOutputList[0]?.children || []
        const index = list.indexOf(data)
        list.splice(index, 1)
      } else if (operation == "add") {
        this.showDialog('noSource')
      }
    },
    init() {
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
      // 在子流程时，使用currentParentCpnInfo中的主流程数据
      const dataList = this.currentParentCpnInfo?.dataList || this.getDataList()
      let { apiName, puApiParams} = this.currentServObj
      puApiParams = puApiParams.filter((item) => item.paramDirection == 0)
      console.log(dataList, "dataList")
      this.compositeIdMapToParamList = dataList.reduce((prev, data) => {
        if (sourceActionType.includes(data.actionType) && data.compositeId) {
          // const svcId = data.conf.find(item => item.name == "svcId").value
          const compositeId = data.compositeId
          const conf = data.conf.find(item => {
            return item.name === 'actionSeq'
          })
          if (!this.compositeIdMapToParamList[compositeId]) {
            prev[compositeId] = {
              svcId: data.actionOwnId,
              svcNm: data.actionName,
              actionSeq: conf?.value || '',
              actionType: data.actionType,
              paramList: [],
            }
          }
        }
        return prev
      }, {[this.currentServObj?.svcId]: { svcNm: "当前4b交易", svcId: this.currentServObj?.svcId, paramList: puApiParams}})
      // this.loopListSourceOptions = Object.keys(this.compositeIdMapToParamList).reduce((prev, compositeId) => {
      //   if (compositeId != this.currentObj.compositeId) {
      //     prev.push({
      //       value: compositeId,
      //       label: this.compositeIdMapToParamList[compositeId]?.svcNm
      //     })
      //   }
      //   return prev
      // }, [])
    },
  },
  created() {
    // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
    this.svcIdToSvcNm = this.getDataList().reduce((prev, data) => {
      if (sourceActionType.includes(data.actionType)  && data.compositeId) {
        prev[data.compositeId] = data.actionName
      }
      return prev
    }, { [this.currentServObj?.svcId]: "当前4b交易" })
    // this.updateCompositeIdMapToParamList()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_loop_attr {
  position: relative;
  height: 100%;
  .mt10 {
    margin-top: 10px;
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
  }
  .attr_pre_title {
    // padding: 8px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    .el-icon-arrow-down {
      cursor: pointer;
      &.hidden {
        transform: rotate(180deg);
      }
    }
    .attr_pre_title_b {
      color: $reg_ft_color;
      &.bold {
        font-weight: 600;
      }
      &.required {
        &::before {
          content: "*";
          color: red;
          margin-right: 4px;
        }
      }
    }
    .icon {
      cursor: pointer;
      background: #358aff;
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 2px;
      font-weight: 400;
      color: #fff;
    }
  }
  .attr_content {
    background-color: $base_bg_color;
    padding: 20px 10px;
  }
  .attr_box {
    height: calc(100% - 47px);
    overflow-y: scroll;
    padding-bottom: 55px;
    &.mt10 {
      margin-top: 10px;
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
    // padding: 8px 10px;
    font-weight: 600;
    margin-bottom: 16px;
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
    box-shadow: 0 1px 10px 0 #e7e7e7;
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
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
    }
    .show_conf_content {
      float: left;
    }
    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .tips_info {
    margin-top: 10px;
  }
  .transition_arrange {
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
    .attr_show {
      padding-top: 0px;
    }
    &.read {
      margin-top: 20px;
    }
  }
  .output_table {
    padding: 10px 20px;
    .table_header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .table_tips {
      margin-top: 5px;
      background: #fdf6ec;
      font-size: 12px;
      color: #e6a23c;
      border: 1px solid #faecd8;
      border-radius: 4px;
      padding: 0 10px;
      .el-tag {
        height: auto;
      }
      .title {
        font-weight: 600;
      }
    }
    ::v-deep .text_style {
      &.disabled {
        color: #333;
        cursor: default;
      }
    }
  }
}
</style>
