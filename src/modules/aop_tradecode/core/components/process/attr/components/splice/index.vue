<template>
  <div class="aop_tradecode_comps_design_attr_splice_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>拼接组件</div>
      </div>
      <div v-if="!isRead" class="attr_box">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t">组件名称：</div>
            <div class="attr_show_item_c">
              <el-input
                disabled
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
          <div class="table_wrapper">
            <div class="table_header">
              <div class="attr_pre_title mb0">
                <div class="attr_pre_title_b bold required">拼接字段列表</div>
              </div>
              <div class="attr_show_item_b">
                <i class="el-icon-more" style="cursor: pointer; margin-right: 10px;" @click="switchTableMode('inputAtSetting')"></i>
                <el-button
                  v-if="canSave"
                  type="primary"
                  size="mini"
                  class="mt10"
                  @click="addTableRow"
                  >添加</el-button>
              </div>

            </div>
            <div class="table_body mb20">
              <div class="attr_show_item_c">
                <Table
                  class="table"
                  :data="tableData"
                  rowK="paramOrder"
                  :table="tableColumn"
                  @operate="operate"
                ></Table>
              </div>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t required">拼接格式：</div>
            <div class="attr_show_item_c">
              <el-radio-group v-model="formData.format" :disabled="!canSave" @change="handleChangeFormat">
                <el-radio :label="'field'" :disabled="!canSave">字段</el-radio>
                <el-radio :label="'JSON'" :disabled="!canSave">JSON</el-radio>
                <el-radio :label="'hash'" :disabled="!canSave">哈希</el-radio>
                <el-radio :label="'list'" :disabled="!canSave">集合字段拼接</el-radio>
              </el-radio-group>
              <!-- <el-select v-model="formData.format" class="w100p" placeholder="请选择">
                <el-option
                  v-for="item in formatOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->
            </div>
          </div>
          
          <div v-if="formData.format == 'field' || formData.format == 'list'" class="attr_show_item">
            <div class="attr_show_item_t required">拼接符号：</div>
            <div class="attr_show_item_c">
              <el-input
                v-model="formData.symbol"
                size="mini"
                placeholder="请输入"
              ></el-input>
            </div>
          </div>
          <div class="table_wrapper">
            <div class="table_header">
              <div class="attr_pre_title mb0">
                <div class="attr_pre_title_b required bold">输出结果</div>
              </div>
              <el-button
                v-if="canSave && formData.format == 'list'"
                type="primary"
                size="mini"
                @click="showSelectParam('noSource')"
                >添加</el-button
              >
            </div>
            <div class="table_body mb20">
              <div class="attr_show_item_c">
                <Table
                  class="table"
                  :data="tableDataForOutput"
                  :table="tableColumnForOutput"
                  @operate="operate"
                ></Table>
              </div>
            </div>
          </div>

          <div class="table_wrapper" v-if="formData.format == 'list'">
            <div class="table_header">
              <div class="attr_pre_title mb0">
                <div class="attr_pre_title_b bold">条件编排</div>
              </div>
              <el-button
                v-if="canSave"
                type="primary"
                size="mini"
                class="mt10"
                @click="addOutputTargetLine"
              >添加一行</el-button>
            </div>
            <div class="table_body mb20">
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
          </div>

          <div class="attr_show_item">
            <div class="attr_show_item_t"  style="width: auto;">示例：</div>
            <JsonViewer
              v-if="formData.format == 'JSON'"
              class="io_data"
              :value="outputResult"
              :expand-depth="2"
              copyable
              sort
            ></JsonViewer>
            <div v-else class="attr_show_item_c">
              <el-input
                readonly
                type="textarea"
                :value="outputResult"
                placeholder="输出结果"
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="tips_info" v-if="!canSave && !currentObj.actionParentId">
            <el-tag type="warning"
              >保存交易编排后，可对组件信息进行编辑</el-tag
            >
          </div>
        </div>
        <div v-if="canSave" class="attr_btn">
          <el-button
            type="primary"
            size="small"
            @click="saveParams"
            class="right_button"
            >保存</el-button
          >
        </div>
      </div>
      <div v-else class="attr_box">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              组件名称：<span class="attr_show_item_i">{{
                formData.actionDesc
              }}</span>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              组件描述：<span class="attr_show_item_i">{{
                formData.actionMsg
              }}</span>
            </div>
          </div>
          <div class="table_wrapper">
            <div class="table_header">
              <div class="attr_pre_title mb0">
                <div class="attr_pre_title_b bold">拼接字段列表</div>
              </div>
            </div>
            <div class="table_body mb20">
              <div class="attr_show_item_c">
                <Table
                  class="table"
                  :data="tableData"
                  :table="tableColumn"
                  @operate="operate"
                ></Table>
              </div>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">拼接格式：<span class="attr_show_item_i">{{
                getOptionsName('format', formData.format)
              }}</span>
            </div>
          </div>
          <div v-if="formData.format == 'field' || formData.format == 'list'" class="attr_show_item">
            <div class="attr_show_item_t">拼接符号：<span class="attr_show_item_i">{{
                formData.symbol
              }}</span>
            </div>
          </div>
          <div class="table_wrapper">
            <div class="table_header">
              <div class="attr_pre_title mb0">
                <div class="attr_pre_title_b bold">输出结果</div>
              </div>
            </div>
            <div class="table_body mb20">
              <div class="attr_show_item_c">
                <Table
                  class="table"
                  :data="tableDataForOutput"
                  rowK="paramOrder"
                  :table="tableColumnForOutput"
                  @operate="operate"
                ></Table>
              </div>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t" style="width: auto;">示例：<span v-if="formData.format != 'JSON'" class="attr_show_item_i">{{
                outputResult
              }}</span>
            </div>
            <JsonViewer
              v-if="formData.format == 'JSON'"
              class="io_data"
              :value="outputResult"
              :expand-depth="2"
              copyable
              sort
            ></JsonViewer>
          </div>
        </div>
      </div>
    </div>
    <SelectOutputField
      ref="selectOutputFieldRef"
      :currentServObj="currentServObj"
      @setOutputTarget="setOutputTarget"
    ></SelectOutputField>
    <!-- 输出目标-选择输出字段 -->
    <SelectParams
      ref="selectParamsRef"
      :currentServObj="currentServObj"
      @confirm="confirm"
    ></SelectParams>
    <selectListParams ref="selectListParams" @confirm="handleConfirm">
    </selectListParams>
      <selectListParams ref="selectListParamsRef" @confirm="handleSetData">
    </selectListParams>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table_workgate";
import SelectParams from "./components/selectParams";
import selectListParams from "./components/selectListParams";
import JsonViewer from "vue-json-viewer";
import { mixList, reList, getSimpleParmaKey, setParamOrder } from "@m/utils/paramTree";
import { sourceActionType, actionTypeToApSource, actionNameToNoActionId } from "@m/utils/normalData";
import filters from "@m/utils/filters";
import SelectOutputField from "../service_setting/selectOutputField"
export default {
  mixins: [mixin],
  components: {
    Table,
    SelectParams,
    JsonViewer,
    selectListParams,
    SelectOutputField,
  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    isRead: {
      type: Boolean,
      default: () => false,
    },
    fourRAttrFlag: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      // input组件编辑
      formData: {
        actionDesc: "",
        actionMsg: "",
        format: "", // 拼接格式
        symbol: "", // 拼接符号
      },
      formatOptions: [
        { label: "字段", value: "field" },
        { label: "JSON", value: "JSON" },
        { label: "哈希", value: "hash" },
        { label: '集合字段拼接', value: 'list'}
      ],
      // 赋值表达式
      expression: {
        beAssignedSource: "",
        condTyp: "",
        assignedSource1: "",
        assignedSource2: "",
      },
      currentObj: {},
      cpnData: {},
      cpnParamsRecord: {},
      actionIdRecord: "",
      tableData: [],
      transId: "",
      selectData: [],
      outputTargetList: [],
      targetData: null,
      operateType: '',
      showAllInputParamsAtSetting: false,
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
            operate: "paramNm",
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
            // disabled: () => {
            //   return true
            // },
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
            operate: 'paramValue',
            disabled: (scope) => ["List", "Object"].includes(scope.row.paramType),
            filter(scope) {
              return scope.row.paramValueNm || scope.row.paramValue || "选择"
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
    blngtoTyp() {
      return this.currentServObj.apiServiceType.indexOf("D4") > -1
        ? "10"
        : "11";
    },
    // 是否修改过组件的参数
    hasChangeCpnParams() {
      return (
        this.cpnParamsRecord != JSON.stringify(this.formData) &&
        this.actionIdRecord == this.currentObj.actionId
      );
    },
    tableColumn() {
      if (this.canSave) {
        return [
          {
            prop: "paramKey",
            label: "参数Key",
            minWidth: "40%",
            type: "text",
            filter: scope => getSimpleParmaKey(scope.row.paramKey),
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
            width: "70",
            // minWidth: "15%",
            type: "text",
            tooltip: true,
          },
          {
            prop: "actionId",
            label: "来源",
            minWidth: "30%",
            type: "text",
            filter: (scope) => {
              const { actionName, actionId } = scope.row
              if (!actionName && !actionId) {
                return ""
              } else if (actionName == "当前4b交易") {
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
              },
            ],
          },
        ].filter(item => this.showAllInputParamsAtSetting || ["参数Key", "参数名称", '来源', '来源值', "操作"].includes(item.label));
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
          // {
          //   prop: "actionId",
          //   label: "来源",
          //   minWidth: "25%",
          //   type: "text",
          //   tooltip: true,
          //   filter: (scope) => {
          //     const { actionName, actionId } = scope.row
          //     if (!actionName && !actionId) {
          //       return ""
          //     } else if (actionName == "当前4b交易") {
          //       return actionName
          //     } else {
          //       const item = this.getDataList().find(data => data.compositeId == actionId)
          //       const actionSeq = this.getConfItem("actionSeq", item.actionId).value
          //       return `${actionName}(${actionSeq})`
          //     }
          //   },
          // },
          // {
          //   prop: "paraMapgNm",
          //   label: "来源值",
          //   minWidth: "25%",
          //   type: "text",
          //   tooltip: true,
          // },
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
        ];
      }
    },
    tableColumnForOutput() {
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
          width: "70",
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
      ]
    },
    tableDataForOutput() {
      if (this.formData.format !== 'list') {
        return [{
          paramKey: "strResult",
          paramName: "拼接结果",
          paramCName: "拼接结果",
          paramType: "String",
          paramValueType: "String",
          paramDirection: "1",
          paramOrder: "1",
          paramParentId: "",
          isNeed: "1",
          paramValue: typeof this.outputResult == "string" ? this.outputResult: JSON.stringify(this.outputResult),
        }]
      } else {
        // if (this.selectData
        const data = this.selectData[0]?.paramKey
        console.log(data, this.selectData, 'sel222ectData')

        if (data === 'strResult') {
          return []
        }
        return this.selectData
      }
    },
    canSave() {
      return !this.isRead && this.currentObj.compositeId && !this.currentObj.actionParentId;
    },
    outputResult() {
      if (this.formData.format == "JSON") {
        return this.tableData.reduce((prev, item) => {
          const paramKey = getSimpleParmaKey(item.paramKey)
          prev[paramKey] = item.paramCName
          return prev
        }, {})
      } else if (this.formData.format == "list") {
        const { symbol } = this.formData
        if (this.tableDataForOutput.length&&symbol) {
          const res = this.tableDataForOutput[0]
          const paramKey = getSimpleParmaKey(res.paramKey)
          return paramKey + '#' + paramKey
        } else {
          return ''
        }
      } else {
        const { symbol } = this.formData
        if (this.tableData.length && symbol) {
          return this.tableData.reduce((prev, item, index) => {
            const paramKey = getSimpleParmaKey(item.paramKey)
            return `${prev}${index > 0 ? symbol : ""}${paramKey}`
          }, "")
        } else {
          return ""
        }
      }
    }
  },
  inject: ["getDataList"],
  methods: {
    handleChangeFormat() {
      this.tableData = []
    },
    // 切换表格的显示模式（是否完整显示）
    switchTableMode() {
      this.showAllInputParamsAtSetting = !this.showAllInputParamsAtSetting
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
        target.paramKey = obj.paramKey
        target.paramNm = obj.paramCName
        target.paramType = obj.paramType
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
      console.log("addOutputTargetLine", this.currentObj, this.layoutActionList)
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
    // handleSetData(obj) {
    //   const target = this.targetData
      
    //   // paramValueType 参数值类型
    //   // paramKeySrcType 参数Key来源类型 
    //   // paramValueSrcType 参数值来源类型 
    //   // paramValueSrcActionId 参数值来源组件ID
    //   let str = obj.paramMappingKey
    //   if (str.includes('bodyOutData.')) {
    //     str = obj.paramMappingKey.split('bodyOutData.')[1]
    //     obj.paramMappingKey = str
    //   }
    //   if (this.targetData.operation == "paramNm1") {
    //     this.targetData.paramKey = str
    //     this.targetData.paramNm = obj.paramCName
    //     this.targetData.paramType = obj.paramValueType
    //     if (["List", "Object"].includes(target.paramType)) {
    //       target.paramValue = "null"
    //       target.condTyp = "="
    //     }
    //   } else if (this.targetData.operation == "paramNm2") {
    //     target.paramValue = str
    //     target.paramValueType = obj.paramType
    //     target.paramValueNm = obj.paramCName
    //   }
    //   console.log(target, "target")
    //   this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    // },
    outputTargetOperate(operation, data) {
      console.log("outputTargetOperate", operation, data, this.tableData)
      this.operateType = operation
      if (operation == "paramNm") {
        this.$refs.selectListParamsRef.showDialog(this.tableData)
        this.targetData = data
        this.targetData.operation = 'paramNm1'
      } else if (operation == "paramValue") {
        this.$refs.selectOutputFieldRef.showDialog(data, this.formData, 'paramValueSrcActionId')
        this.targetData = data
        this.targetData.operation = 'paramNm2'
      } else if (operation == "actionPostSeq") {
        this.$refs.selectOutputPostSeqRef.showDialog(data)
      } else if (operation == "delete") {
        const index = this.outputTargetList.indexOf(data)
        this.outputTargetList.splice(index, 1)
      }
    },
    // 查询编排列表
    async getServiceArrangeList(e) {
      console.log("getServiceArrangeList", e, this.currentServObj)
      // const res = await this.rpc.d4.getServiceArrangeList({
      //   svcId: this.currentServObj?.svcId,
      //   actionId: e.compositeId,
      //   // parentActionId:
      // })
      this.layoutActionList = e.conf.filter(c => c.name == 'conditionStr')
      console.log(this.layoutActionList, "layoutActionList")
      const tfrCdtnCd = JSON.parse(this.layoutActionList[0].value || "[]")
      this.outputTargetList = tfrCdtnCd.map(item => {
        let obj = {
          actionId: item.actionNm == "当前4b交易" ? this.currentServObj?.svcId : item.actionId,
          actionNm: item.actionNm,
          paramKey: item.paramKey,
          paramNm: item.paramNm,
          paramType: item.paramType,
          condTyp: item.condTyp,
          paramValue: item.paramValue,
          actionPostSeq: item.actionPostSeq,
          paramValueSrcActionId: item.paramValueSrcType === '10' ? '10' : item.paramValueSrcActionId,
          paramValueNm: item.paramValueNm,
          paramValueType: item.paramValueType,
          paramKeySrcType: item.paramKeySrcType,
          paramValueSrcType: item.paramValueSrcType,
        }
        if (obj.paramValueSrcActionId === '10') {
          obj.elementType = 'input'
        } else {
          obj.elementType = 'text'
        }
        return obj
      })
      console.log(this.outputTargetList, "outputTargetList")
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    },
    handleSetData(obj) {
      console.log(obj)
      const target = this.targetData
      
      // paramValueType 参数值类型
      // paramKeySrcType 参数Key来源类型 
      // paramValueSrcType 参数值来源类型 
      // paramValueSrcActionId 参数值来源组件ID
      let str = obj.paramMappingKey
      // console.log(str, "str")
      if (str.includes('bodyOutData.')) {
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
    handleConfirm(data) {
      console.log(data, "data")
      let temp = JSON.parse(JSON.stringify(data))
      temp.paramDirection = '1'
      temp.paramPosition = '1'
      this.deepChildren(temp)
      this.selectData = [temp]
    },
    deepChildren(children, direction = '1') {
      for (let i = 0; i < children.length; i++) {
        const item = children[i];
        item.paramDirection = direction
        item.paramPosition = direction
        console.log(item, "item", direction)
        if (item.children && item.children.length) {
          this.deepChildren(item.children, direction)
        }
      }
    },
    showSelectParam() {
      this.$refs.selectListParams.showDialog(this.tableData)
    },
    async getParams(e, obj) {
      console.log("getParams", e, obj);
      this.currentObj = e;
      if (!e.compositeId) {
        e.conf.map((item) => {
          this.formData[item.name] = item.value;
        });
      } else {
        // const params = {
        //   d4StusCd: "1",
        //   blngtoTyp: this.blngtoTyp,
        //   compositeId: e.compositeId || "",
        // };
        // const res = await this.rpc.d4.getServiceCpnParams(params);
        this.cpnData = e;
        e.confList.map((item) => {
          this.formData[item.confKey] = item.confValue;
        });
        // 更新实时位置序号
        let arr = ["actionSeq", "actionFrntSeq", "actionPostSeq"]
        arr.forEach((key) => {
          this.formData[key] = this.getConfItem(key, e.actionId)?.value || ""
        })
        this.tableData = reList(e.paramList.filter((item) => item.paramDirection == "0").map(param => {
          return {
            ...param,
            paramCName: param.paramName
          }
        }));
        this.selectData = e.paramList.filter((item) => {
          return item.paramDirection == "1"
        });
        console.log(this.selectData, "selectData")
      //  console.log(this.tableData, "this.tableData")
        this.tableData.forEach(item => {
          if (item.actionName == "当前4b交易") item.actionId = this.currentServObj?.svcId
        })
      }
      if (!this.formData.format) {
        this.formData.format = "field"
      }
      await this.getServiceArrangeList(e)
      this.setCpnParamsRecord();
    },
    // deepChildren(children, status = false) {
    //   console.log('deepCHildren')
    //   for (let i = 0; i < children.length; i++) {
    //     const item = children[i];
    //     if (item.paramType.includes('List')) {
    //       item.status = 'CheckFail'
    //       this.deepChildren(item.children, true)
    //       continue
    //     }
    //     if (status) {
    //       item.status = 'CheckFail'
    //       if (item.children && item.children.length) {
    //         this.deepChildren(item.children, status)
    //       }
    //       continue
    //     }
    //     if (item.children && item.children.length) {
    //       console.log('sssssss')
    //       this.deepChildren(item.children)
    //     }
        
    //   }
    // },
    async saveParams() {
      if (!this.tableData.length) {
        return this.$message.error("拼接字段列表不能为空")
      } else if (!this.formData.format) {
        return this.$message.error("拼接格式不能为空")
      }
      if (this.formData.format == "JSON" || this.formData.format == "hash") {
        this.formData.symbol = ""
      } else if (!this.formData.symbol) {
        return this.$message.error("拼接符号不能为空")
      } else if (!this.tableDataForOutput.length) {
        return this.$message.error("输出结果不能为空")
        
      }
      const e = this.currentServObj;
      
      const tfrCdtnCd = this.outputTargetList.reduce((prev, item) => {
        // paramValueType 参数值类型
        // paramKeySrcType 参数Key来源类型
        // paramValueSrcType 参数值来源类型
        // paramValueSrcActionId 参数值来源组件ID
        let paramKeySrcType = '30'
        const id = item.paramValueSrcActionId
        let paramValueSrcType = ''
        if (id === '10') {
          paramValueSrcType = '10'
        } else if (id === this.currentServObj?.svcId) {
          paramValueSrcType = '00'
        } else {
          paramValueSrcType = '20'
        }
        console.log(item)
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
      // 如果交易编排列表的返回字段key没有层级结构，则不通过(临时增加的校验，后续删除)
      const notMatchKeyItem = tfrCdtnCd.find(item => !item?.paramKey.includes(".") && item.paramKey != "loopOutputList" && !["设置会话组件", "获取会话组件", "文件上传组件"].includes(item.actionNm))
      if (notMatchKeyItem) return this.$message.error(`返回字段【${notMatchKeyItem.paramNm}】的参数格式有误，请重新设置`)
      tfrCdtnCd.forEach((item) => {
        if (item.actionNm == "当前4b交易") item.actionId = ""
      })
      const confList = this.cpnData.confList || [];
      confList.push({
        confKey: 'conditionStr',
        confValue: JSON.stringify(tfrCdtnCd),
        confId: "",
        confDescr: "",
        compositeId: this.currentObj?.compositeId || "",
      })
      for (let i in this.formData) {
        const target = confList.find((item) => item.confKey == i);
        if (target) {
          target.confValue = this.formData[i];
        } else {
          confList.push({
            confKey: i,
            confValue: this.formData[i],
            confId: "",
            confDescr: "",
            compositeId: e.compositeId || "",
          });
        }
      }
      // const paramList = JSON.parse(JSON.stringify(mixList(this.tableData, "children")))
      setParamOrder(this.tableData)
      setParamOrder(this.selectData)
      this.tableData.forEach(item => {
        if (item.actionId == this.currentServObj?.svcId) item.actionId = ""
      })
      const paramList = JSON.parse(JSON.stringify(mixList(this.tableData, "children").concat(mixList(this.tableDataForOutput, "children"))))
      console.log(paramList, "paramList")
      // const paramList = JSON.parse(JSON.stringify(this.tableData.concat(this.tableDataForOutput)))
      console.log(paramList, "paramList")
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: e.apiId,
        paramList,
        confList,
        compositeId: this.currentObj.compositeId || "",
      };
      // const { compositeId } = await this.rpc.d4.saveServiceCpnParams(params);
      // params.compositeId = compositeId;
      this.rpc.s4design.addFuntionJobCommitFlow({
        fnctId: this.$route.query.fnctId,
        jobTpCd: 'C4',
      })
      
      const layoutServiceBeanList = {
        svcId: this.currentObj.actionOwnId,
        actionKey: "",
        actionId: this.currentObj.compositeId,
        actionNm: this.currentObj.actionName,
        actionTyp: "9",
        loSeqNo: "",
        frntLoSeqNo: "",
        postLoSeqNo: "",
        tranId: this.currentServObj?.svcId,
        tfrCdtnCd: JSON.stringify(tfrCdtnCd),
        layoutActionList: []
      }
      this.setCpnParamsRecord();
      this.$emit(
        "upDateServParams",
        JSON.parse(JSON.stringify(this.currentObj)),
        params,
        layoutServiceBeanList,
      );
    },
    setCpnParamsRecord() {
      this.cpnParamsRecord = JSON.stringify(this.formData);
      this.actionIdRecord = this.currentObj.actionId;
    },
    operate(operation, data) {
      console.log("operate", operation, data);
      if (operation == "delete") {
        const index = this.tableData.indexOf(data);
        this.tableData.splice(index, 1);
        setParamOrder(this.tableData)
      }
    },
    addTableRow() {
      this.$refs.selectParamsRef.showDialog();
    },
    confirm(key, data) {
      console.log("confirm", key, data);
      const temp = JSON.parse(JSON.stringify(data))
      if (key == "paramList") {
        this.tableData.push(...temp);
        setParamOrder(this.tableData)
        this.deepChildren(temp, '0')
      }
    },
    // 获取conf配置项
    getConfItem(name, actionId) {
      const dataList = this.getDataList()
      const cpn = dataList.find(data => data.actionId == actionId)
      return cpn.conf.find(item => item.name == name) || {}
    },
    getOptionsName(key, value) {
      if (key == "format") {
        return this.formatOptions.find(item => item.value == value)?.label
      } else {
        return ""
      }
    },
    init() {
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId;
    },
  },
  created() {
    this.init();
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_splice_attr {
  position: relative;
  height: 100%;
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
          color: $sec_danger_color;
          margin-right: 2px;
        }
      }
    }
  }
  .attr_content {
    background-color: $base_bg_color;
    padding: 20px 10px;
  }
  .attr_box {
    height: calc(100% - 47px);
    overflow-y: scroll;
    padding-bottom: 102px;
    &.mt10 {
      margin-top: 10px;
    }
  }
  .attr_show {
    padding: 8px 10px;
    overflow: hidden;
    .attr_show_item {
      display: flex;
      margin-bottom: 10px;
      overflow: hidden;
      // padding-right: 10px;
      box-sizing: border-box;
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
      .attr_show_item_t {
        // width: 20%;
        width: 80px;
        // margin-right: 10px;
        margin-bottom: 10px;
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
            color: $sec_danger_color;
            margin-right: 2px;
          }
        }
      }
      .attr_show_item_c {
        // width: 70%;
        flex: 1;
        .click_text {
          color: $theme_color;
          cursor: pointer;
        }
        .w100p {
          width: 100%;
        }
      }
      .attr_show_item_b {
        /deep/ .el-icon-more {
          cursor: pointer;
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
      .jv-container {
        ::v-deep .jv-code {
          padding: 0 4px;
          .jv-string {
            color: #111111;
          }
        }
      }
    }
  }
  .attr_send {
    padding: 8px 10px;
  }
  .table_body {
    padding-top: 8px;
    margin-bottom: 10px;
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
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    width: calc(100% - 10px);
    padding: 10px;
    background: $base_white;
    z-index: 10;
    // border-left: 2px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    ::v-deep .el-button {
      @include normal_button_common;
      width: 112px;
      color: $reg_ft_color;
      background: $base_white;
      border: 1px solid $pri_br_color;
      &.el-button--primary {
        @include primary_button;
      }
    }
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
  .table_wrapper {
    ::v-deep .el-select__caret {
      color: #333;
      transform: rotateZ(0);
      &::before {
        content: "\e790";
      }
    }
    .tips_info {
      margin-top: 10px;
    }
    .table_header {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
