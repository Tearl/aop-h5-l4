<template>
  <div class="aop_tradecode_comps_design_attr_assign_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>字段映射组件</div>
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
            <div class="tips_info" v-if="!canSave">
              <el-tag type="warning">保存交易编排后，可对组件信息进行编辑</el-tag>
            </div>
          </div>
          <div class="transition_arrange ">
            <div class="attr_show" style="padding-left: 0px; padding-right: 0px;">
              <div class="attr_pre_title mb0">
                <!-- :disabled="!(tableData.length > 0)" -->
                <div class="attr_pre_title_b bold attr_show_item"><span>*</span>输入参数</div>
                <div>
                  <i class="el-icon-more" style="cursor: pointer;  margin-right: 10px" @click="switchTableMode('inputAtSetting')"></i>
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
                ></Table>
              </div>
            </div>
          </div>
          <div class="transition_arrange">
            <div class="attr_show" style="padding-left: 0px; padding-right: 0px;">
              <div class="attr_pre_title mb0">
                <!-- :disabled="!(tableData.length > 0)" -->
                <div class="attr_pre_title_b bold"><span>*</span>输出参数</div>
                <el-button
                  v-if="canSave && formData.relType === '03'"
                  type="primary"
                  size="mini"
                  @click="showDialog"
                >添加</el-button>
              </div>
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
          <div class="attr_show_item" style="align-items: center;">
            <div class="attr_show_item_t required" style="margin-top: 10px; width: 95px;">
              映射类型：
            </div>
            <div class="attr_show_item_c left">
                <el-radio-group v-model="formData.relType" @change="handleChangeType" :disabled="!canSave">
                  <el-radio :label="'01'" :disabled="!canSave">一对一</el-radio>
                  <el-radio :label="'02'" :disabled="!canSave">多对一</el-radio>
                  <el-radio :label="'03'" :disabled="!canSave">一对多</el-radio>
                </el-radio-group>
            </div>
          </div>
          <div class="transition_arrange">
            <div class="table_header">
              <div class="attr_pre_title mb0">
                <div class="attr_pre_title_b bold"><span>*</span>字段映射</div>
              </div>
              <el-button
                v-if="canSave"
                type="primary"
                size="mini"
                class="mt10"
                :disabled="!tableDataForOutput.length"
                @click="addTableRow"
              >添加一行</el-button>
            </div>
            <div class="attr_recive mb20">
              <div class="attr_show_item_c">
                <el-table
                  :data="keyMapList"
                  border
                  style="width: 100%">
                  <el-table-column
                    fixed
                    label="字段"
                    >
                    <template slot-scope="scope">
                      <div v-if="formData.relType === '01' || formData.relType === '02'">
                        <div v-for="(item, index) in scope.row.key" :key="index" class="attr-recive-input">
                          <el-input type="text" v-model="scope.row.key[index]"  size="small"></el-input>
                          <i class="el-icon-delete" v-if="scope.row.key.length > 1" @click="handleAddRow(scope, 'pop', index)"></i>
                        </div>
                      </div>
                      <div v-if="formData.relType === '03'">
                        <div v-for="(item, index) in scope.row.key" :key="index" class="attr-recive-input">
                          <div class="attr-recive-field">{{scope.row.field[index]}}</div>
                          <el-input class="attr-recive-key" type="text" v-model="scope.row.key[index]"  size="small"></el-input>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed
                    prop="date"
                    width="150"
                    label="映射字段"
                    >
                    <template slot-scope="scope">
                      <el-input type="text" v-model="scope.row.value" size="small"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                      <el-button type="text" @click="handleAddRow(scope, 'push')" size="small" v-if="formData.relType === '02'">新增字段</el-button>
                      <el-button type="text" @click="handleDeleteRow(scope)" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="canSave"
          class="attr_btn"
        >
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
            <div class="attr_show_item_t">组件名称：<span class="attr_show_item_i">{{formData.actionDesc}}</span></div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">组件描述：<span class="attr_show_item_i">{{formData.actionMsg}}</span></div>
          </div>
        </div>
        <div class="transition_arrange">
          <div class="attr_show" style="padding-left: 0px; padding-right: 0px;">
            <div class="attr_pre_title mb0">
              <!-- :disabled="!(tableData.length > 0)" -->
              <div class="attr_pre_title_b bold required">输入参数</div>
              <el-button
                v-if="canSave"
                type="primary"
                size="mini"
                @click="showDialog"
              >添加</el-button>
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
              ></Table>
            </div>
          </div>
        </div>
        <div class="attr_show_item">
          <div class="attr_show_item_t required" style="margin-top: 10px;">
            映射类型：
          </div>
          <div class="attr_show_item_c left" style="margin-top: 5px;">
              <el-radio-group v-model="formData.relType" @change="handleChangeType" :disabled="!canSave">
                <el-radio :label="'01'" :disabled="!canSave">一对一</el-radio>
                <el-radio :label="'02'" :disabled="!canSave">多对一</el-radio>
                <el-radio :label="'03'" :disabled="!canSave">一对多</el-radio>
              </el-radio-group>
          </div>
        </div>
        <div class="transition_arrange">
            <div class="table_header">
              <div class="attr_pre_title mb0">
                <div class="attr_pre_title_b bold">字段映射</div>
              </div>
              <el-button
                v-if="canSave"
                type="primary"
                size="mini"
                class="mt10"
                @click="addTableRow"
              >添加一行</el-button>
            </div>
            <div class="attr_recive mb20">
              <div class="attr_show_item_c">
                <el-table
                  :data="keyMapList"
                  border
                  style="width: 100%">
                  <el-table-column
                    fixed
                    label="字段"
                    >
                    <template slot-scope="scope">
                      <div v-if="formData.relType === '01' || formData.relType === '02'">
                        <div v-for="(item, index) in scope.row.key" :key="index" class="attr-recive-input">
                          <el-input type="text" v-model="scope.row.key[index]" :disabled="!canSave"  size="small"></el-input>
                          <i class="el-icon-delete" v-if="scope.row.key.length > 1 && canSave" @click="handleAddRow(scope, 'pop', index)"></i>
                        </div>
                      </div>
                      <div v-if="formData.relType === '03'">
                        <div v-for="(item, index) in scope.row.key" :key="index" class="attr-recive-input">
                          <div class="attr-recive-field">{{scope.row.field[index]}}</div>
                          <el-input class="attr-recive-key" type="text" v-model="scope.row.key[index]" :disabled="!canSave"  size="small"></el-input>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed
                    prop="date"
                    width="150"
                    label="映射字段"
                    >
                    <template slot-scope="scope">
                      <el-input type="text" v-model="scope.row.value" size="small" :disabled="!canSave"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed
                    label="操作"
                    v-if="canSave"
                    width="150">
                    <template slot-scope="scope">
                      <el-button type="text" @click="handleAddRow(scope, 'push')" size="small" v-if="formData.relType === '02'">新增字段</el-button>
                      <el-button type="text" @click="handleDeleteRow(scope)" :disabled="!canSave"  size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
        </div>
      </div>
    <!-- 选择参数的弹窗 -->
    <SelectParams2
      ref="selectParamsRef2"
      :currentServObj="currentServObj"
      :currentObj="currentObj"
      :show4b="true"
      @confirm="confirm2"
    ></SelectParams2>
    <SelectParams
      ref="selectParamsRef"
      :currentServObj="currentServObj"
      :currentObj="currentObj"
      :show4b="true"
      @confirm="addOutPutList"
    >

    </SelectParams>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table_workgate";
import SelectAssignedSource from "./components/selectAssignedSource"
import SetResult from "./components/setResult"
import filters from "@m/utils/filters";
import SelectParams2 from "../set_cache/components/selectParams"
import { reList, mixList, setParamOrder, packageParamKey } from "@m/utils/paramTree";
import { sourceActionType, actionTypeToApSource, actionNameToNoActionId } from "@m/utils/normalData";
import SelectParams from "./components/selectParams"
export default {
  mixins: [mixin],
  components: {
    Table,
    SelectAssignedSource,
    SetResult,
    SelectParams2,
    SelectParams,
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
    currentParentCpnInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // input组件编辑
      formData: {
        actionDesc: "",
        actionMsg: "",
        relType: "01",
        relList: '',
      },
      currentObj: {},
      cpnData: {},
      cpnParamsRecord: {},
      actionIdRecord: "",
      tableData: [],
      transId: "",
      expressionList: [],
      tableKey: "",
      assignType: "",
      keyMapList: [],
      tempObj: {
        '01': [],
        '02': [],
        '03': [],
      },
      tempTableObj: {
        '01': [],
        '02': [],
        '03': [],
      },
      tableDataForOutput: [],
      firstStatus: false,
      showAllInputParamsAtSetting: false,
    };
  },
  watch: {
    'formData.relType'(newVal, oldVal) {
      if (this.firstStatus) {
        this.tempObj[oldVal] = this.keyMapList
        this.keyMapList = this.tempObj[newVal]
        this.tempTableObj[oldVal] = this.tableDataForOutput
        this.tableDataForOutput = this.tempTableObj[newVal]
      }
      if (this.formData.relType === '01' || this.formData.relType === '02') {
        this.tableDataForOutput = [{
          paramKey: "strResult",
          paramName: "映射结果",
          paramCName: "映射结果",
          paramType: "String",
          paramValueType: "String",
          paramDirection: "1",
          paramOrder: "1",
          paramParentId: "",
          isNeed: "1",
          paramValue: typeof this.outputResult == "string" ? this.outputResult: JSON.stringify(this.outputResult),
        }]
      }
      this.firstStatus = true
    },
    currentServObj() {
      console.log(this.currentServObj, "currentServObj")
    },
    currentParentCpnInfo() {
      console.log(this.currentParentCpnInfo, "currentParentCpnInfo")
    },
  },
  computed: {
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
                relation: () => {
                  return this.formData.relType !== '01' && this.formData.relType !== '02'
                }
              },
            ],
          },
      ]
    },
    // tableDataForOutput() {
    //   return [{
    //     paramKey: "strResult",
    //     paramName: "映射结果",
    //     paramCName: "映射结果",
    //     paramType: "String",
    //     paramValueType: "String",
    //     paramDirection: "1",
    //     paramOrder: "1",
    //     paramParentId: "",
    //     isNeed: "1",
    //     paramValue: typeof this.outputResult == "string" ? this.outputResult: JSON.stringify(this.outputResult),
    //   }]
    // },
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
                  const actionSeq = this.getConfItem("actionSeq", item?.actionId).value
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
                  return scope.row.deleteBtn
                },
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
                const actionSeq = this.getConfItem("actionSeq", item?.actionId).value
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
      return this.currentServObj.apiServiceType.indexOf("D4") > -1 ? "10" : "11"
    },
    // // 是否修改过组件的参数
    // hasChangeCpnParams() {
    //   return this.cpnParamsRecord != JSON.stringify(this.formData) && this.actionIdRecord == this.currentObj.actionId
    // },
    // tableData() {
    //   if (this.expressionList.length) {
    //     const row = this.expressionList.reduce((prev, item, index, array) => {
    //       const key = `assignedSource${item?.order || index}`
    //       prev[key] = item
    //       if (index == 0) {
    //         prev.operator0 = "="
    //       } else if (index > 0 && index != array.length - 1) {
    //         prev[`operator${item?.order || index}`] = item.operator
    //       }
    //       return prev
    //     }, {})
    //     return [row]
    //   } else {
    //     return []
    //   }
    // },
    // tableDataForOutput() {
    //   return [{
    //     actionId: "",
    //     actionName: "",
    //     apSource: "",
    //     paramKey: "result",
    //     paramName: "赋值结果",
    //     paramCName: "赋值结果",
    //     paramType: "String",
    //     paramValueType: "String",
    //     paramDirection: "1",
    //     paramOrder: "1",
    //     paramParentId: "",
    //     isNeed: "1",
    //     paramMappingKey: "",
    //     paraMapgNm: "",
    //     // paramValue: typeof this.outputResult == "string" ? this.outputResult: JSON.stringify(this.outputResult),
    //   }]
    // },
    // tableColumnForOutput() {
    //   return [
    //     {
    //       prop: "paramKey",
    //       label: "参数Key",
    //       minWidth: "30%",
    //       type: "text",
    //       tooltip: true,
    //     },
    //     {
    //       prop: "paramName",
    //       label: "参数名称",
    //       minWidth: "30%",
    //       type: "text",
    //       tooltip: true,
    //     },
    //     {
    //       prop: "paramType",
    //       label: "参数类型",
    //       minWidth: "20%",
    //       width: "70",
    //       type: "text",
    //       tooltip: true,
    //     },
    //     {
    //       prop: "actionName",
    //       label: "来源",
    //       minWidth: "20%",
    //       type: "text",
    //       tooltip: true,
    //       // filter: (scope) => {
    //       //   const { actionName, actionId } = scope.row
    //       //   if (!actionName && !actionId) {
    //       //     return ""
    //       //   } else if (["当前4b交易", "当前循环组件", "固定值"].includes(actionName)) {
    //       //     return actionName
    //       //   } else {
    //       //     const item = this.getDataList().find(data => data.compositeId == actionId)
    //       //     if (item) {
    //       //       const actionSeq = this.getConfItem("actionSeq", item.actionId)?.value
    //       //       return `${actionName}(${actionSeq})`
    //       //     } else {
    //       //       return scope.row.actionId
    //       //     }
    //       //   }
    //       // },
    //     },
    //     {
    //       prop: "paraMapgNm",
    //       label: "来源值",
    //       minWidth: "20%",
    //       type: "text",
    //       tooltip: true,
    //       filter: (scope) => {
    //         if (scope.row?.actionId == "constantValue") {
    //           return scope.row.paramMappingKey
    //         } else {
    //           return scope.row.paraMapgNm
    //         }
    //       },
    //     },
    //   ]
    // },
    canSave() {
      return !this.isRead && this.currentObj.compositeId && !this.currentObj.actionParentId
    }
  },
  inject: ["getDataList"],
  methods: {
    // 切换表格的显示模式（是否完整显示）
    switchTableMode() {
      this.showAllInputParamsAtSetting = !this.showAllInputParamsAtSetting
    },
    addOutPutList(data) {
      let list = JSON.parse(JSON.stringify(data))
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        this.initData(item, this.tableDataForOutput)
        this.initParamKey(item, this.tableDataForOutput)
        item.deleteBtn = true
      }
      list.forEach(item => item.paramDirection = "0")

      this.tableDataForOutput.push(...list)
      console.log(this.tableDataForOutput)
      this.tableDataForOutput = setParamOrder(this.tableDataForOutput)
      // const lengthStr = this.tableDataForOutput.length
      this.tableDataForOutput.forEach((item, index) => {
        this.keyMapList.forEach((item2, index2) => {
          if (index > (item2.field.length - 1)) {
            item2.field.push(item.paramKey)
            item2.key.push('')
          }
        })
      })
      this.keyMapList = JSON.parse(JSON.stringify(this.keyMapList))
      this.$forceUpdate()
    },
    handleDeleteRow(scope) {
      const index = this.keyMapList.indexOf(scope.row)
      this.keyMapList.splice(index, 1)

    },
    handleChangeType() {


    },
    // 获取conf配置项
    getConfItem(name, actionId) {
      const dataList = this.currentParentCpnInfo?.dataList || this.getDataList()
      const cpn = dataList.find(data => data.actionId == actionId)
      return cpn?.conf.find(item => item.name == name) || {}
    },
    initParamKey(item, list, index = 1) {
      const temp = item.paramKey
      for (let i = 0; i < list.length; i++) {
        const item1 = list[i];
        if (item.paramKey === item1.paramKey) {
          const arr = temp.split('List')
          if (arr.length > 1) {
            item.paramKey = arr[0] + index + 'List'
          } else {
            item.paramKey = arr[0] + index
          }
          i = 0
          index += 1
        }      
      }
    },
    setActionId(children, parent) {
      children?.forEach((child) => {
        child.actionName = parent.actionName
        child.actionId = parent.actionId
        child.apSource = parent.apSource
        child.paraMapgNm = child.paramName
        if (child.children && child.children.length) {
          this.setActionId(child.children, parent)
        }
      })
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
    confirm2(data) {
      let list = JSON.parse(JSON.stringify(data))
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        this.initData(item, this.tableData)
        this.initParamKey(item, this.tableData)
        item.deleteBtn = true
      }
      list.forEach(item => item.paramDirection = "0")

      this.tableData.push(...list)
      this.tableData = setParamOrder(this.tableData)
      return
    },
    operateInput(operation, data) {
      console.log("operate", operation, data)
      if (operation == "delete") {
        const index = this.tableData.indexOf(data)
        this.tableData.splice(index, 1)
        this.tableData = setParamOrder(this.tableData)
      }
    },
    showDialog() {
      this.$refs.selectParamsRef.showDialog();
    },
    showDialog2() {
      this.$refs.selectParamsRef2.showDialog();
    },
    handleChange(v) {
      console.log('handleChange', v)
    },
    handleAddRow(scope, key, index) {
      console.log(scope.row, 'scope.row')
      if (key === 'pop') {
        if (scope.row.key.length > 1) {
          scope.row.key.splice(index, 1)
        }
      } else {
        scope.row.key.push('')
      }
      this.keyMapList = JSON.parse(JSON.stringify(this.keyMapList))
    },
    getParams(e, obj) {
      console.log("getParams", e, obj);
      this.currentObj = e
      if (!e.compositeId) {
        e.conf.map(item => {
          this.formData[item.name] = item.value
        })
        return;
      } else {
        // const params = {
        //   d4StusCd: "1",
        //   blngtoTyp: this.blngtoTyp,
        //   compositeId: e.compositeId || "",
        // };
        this.tempObj = {
          '01': [],
          '02': [],
          '03': [],
        }
        this.tempTableObj = {
          '01': [],
          '02': [],
          '03': [],
        }
        // const res = await this.rpc.d4.getServiceCpnParams(params);
        this.cpnData = e
        
        this.tableData = reList(e.paramList.filter((item) => {
          return item.paramDirection === '0'
        }));
        this.tableDataForOutput = reList(e.paramList.filter((item) => {
          return item.paramDirection === '1'
        }));
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        e.confList.map((item) => {
          this.formData[item.confKey] = item.confValue;
          if(item.confKey === 'relList' && item.confValue) {
            this.formData.relList = item.confValue
          } else {
            this.formData.relList = ''
          }
        });
        console.log(this.formData, "formDat2222222a")
        // 更新实时位置序号
        let arr = ["actionSeq", "actionFrntSeq", "actionPostSeq"]
        arr.forEach((key) => {
          this.formData[key] = this.getConfItem(key, e.actionId)?.value || ""
        })
        if (this.formData.relType === '01' || this.formData.relType === '02') {
          this.tableDataForOutput = [{
            paramKey: "strResult",
            paramName: "映射结果",
            paramCName: "映射结果",
            paramType: "String",
            paramValueType: "String",
            paramDirection: "1",
            paramOrder: "1",
            paramParentId: "",
            isNeed: "1",
            paramValue: typeof this.outputResult == "string" ? this.outputResult: JSON.stringify(this.outputResult),
          }]
        }
        let relList = this.formData?.relList
        if (relList) {
          const list = JSON.parse(relList)
          console.log(list, "list")
          const data = []
          if (list) {
            for (let i = 0; i < list.length; i++) {
              const item = list[i];
              console.log(item.key.split, item.key, 'itemitem')
              let keyList = item.key.split(';')
              let fieldList = item.field.split(';')
              let value = item.value
              let obj = {
                field: fieldList,
                key: keyList,
                value: value,
              }
              data.push(obj)
            }
            this.keyMapList = data

            console.log(list, "listlist")
            // this.keyMapList = list
          }
        } else {
          this.keyMapList = []
        }


        // this.formData.relList = null
        this.tableData.forEach((item, index) => {
          // if (index > 0) {
            item.deleteBtn = true
          // }
        })
        // const expressionList = JSON.parse(this.formData.expressionList || "[]");
        // this.expressionList = expressionList
        // this.tableDataForOutput = res.paramList
        // this.tableDataForOutput.forEach(item => {
        //   if (item.actionName == "当前4b交易") item.actionId = this.currentServObj?.svcId
        // })
        // if (!this.expressionList.length) {
        //   this.addTableRow()
        // }
        // if (!this.tableDataForOutput.length) {
        //   this.addOutputTableRow()
        // }
      }
      this.setCpnParamsRecord()
    },
    async saveParams() {
      // const item = this.tableData[0]
      // const { assignedSource0, operator0, assignedSource1, operator1, assignedSource2 } = item
      // const assignedSource0Value = assignedSource0?.paramKey
      // const assignedSource1Value = assignedSource1[assignedSource1?.apSource == "10" ? "paramValue" : "paramKey"]
      // const assignedSource2Value = assignedSource2[assignedSource2.apSource == "10" ? "paramValue" : "paramKey"]
      // if (!assignedSource0Value) return this.$message.error("被赋值来源不能为空")
      // if (!operator0) return this.$message.error("对比关系不能为空")
      // if (!assignedSource1Value) return this.$message.error("赋值来源1不能为空")
      // if (!operator1) return this.$message.error("运算符不能为空")
      // if (!assignedSource2Value) return this.$message.error("赋值来源2不能为空")
      // this.formData.expressionList = JSON.stringify(this.expressionList)

      // const item = this.tableDataForOutput[0]
      // const { actionId, actionName, apSource, paramMappingKey, paraMapgNm } = item
      // if (!actionId && !actionName) return this.$message.error("请选择输出结果的来源及来源值")
      if (!this.tableData.length) {
        this.$message.error("输入参数不能为空")
        return
      }
      if (!this.keyMapList.length) {
        this.$message.error("字段映射不能为空")
        return
      }
      for (let i = 0; i < this.keyMapList.length; i++) {
        const item = this.keyMapList[i];
        if (this.formData.relType !== '03') {
          for (let j = 0; j < item.key.length; j++) {
            const value = item.key[j];
            if (!value) {
              this.$message.error("字段不能为空")
              return
            }
          }
        }
        if (!item.value) {
          this.$message.error("映射字段不能为空")
          return
        }
      }
      const e = this.currentServObj
      const confList = this.cpnData.confList || []
      const list = []
      for (let i = 0; i < this.keyMapList.length; i++) {
        const item = this.keyMapList[i];
        let keyList = item.key?.join(';')
        let fieldList = item.field?.join(';') || ''
        console.log(keyList, "keyList")
        let value = item.value
        let obj = {
          field: fieldList,
          key: keyList,
          value: value,
        }
        list.push(obj)
      }
      for (let i in this.formData)  {
        const target = confList.find(item => item.confKey == i)
        console.log()
        if (target && target.confKey === 'relList') {
          target.confValue = JSON.stringify(list)
        } else if (target) {
          target.confValue = this.formData[i]
        } else if (i === 'relList') {
          confList.push({
            confKey: i,
            confValue: JSON.stringify(list),
            confId: "",
            confDescr: "",
            compositeId: e.compositeId || "",
          })
        } else {
          confList.push({
            confKey: i,
            confValue: this.formData[i],
            confId: "",
            confDescr: "",
            compositeId: e.compositeId || "",
          })
        }
      }

      // let relList = {
      //   confKey: 'relList',
      //   confValue: ,
      //   confId: "",
      //   confDescr: "",
      //   compositeId: e.compositeId || "",
      // }
      // confList.push(relList)
      // setParamOrder(this.tableDataForOutput)
      // this.tableDataForOutput.forEach(item => {
      //   if (item.actionId == this.currentServObj?.svcId) item.actionId = ""
      // })
      // const paramList = JSON.parse(JSON.stringify(this.tableDataForOutput))
      let paramList2 = JSON.parse(JSON.stringify(this.tableData))
      paramList2 = setParamOrder(paramList2)
      paramList2 = mixList(paramList2, "children").map(param => {
        param.paramDirection = "0"
        if (actionNameToNoActionId.includes(param.actionName)) {
          param.actionId = ""
        }
        return param
      })
      let paramList3 = JSON.parse(JSON.stringify(this.tableDataForOutput))
      paramList3 = setParamOrder(paramList3)
      paramList3 = mixList(paramList3, "children").map(param => {
        param.paramDirection = "1"
        if (actionNameToNoActionId.includes(param.actionName)) {
          param.actionId = ""
        }
        return param
      })
      // paramList2.push({
      //   paramKey: "strResult",
      //   paramName: "映射结果",
      //   paramCName: "映射结果",
      //   paramType: "String",
      //   paramValueType: "String",
      //   paramDirection: "1",
      //   paramOrder: "1",
      //   paramParentId: "",
      //   isNeed: "1",
      //   paramValue: typeof this.outputResult == "string" ? this.outputResult: JSON.stringify(this.outputResult),
      // })
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: this.fourRAttrFlag ? this.currentParentCpnInfo.compositeId : this.currentServObj.apiId,
        paramList: [...paramList2, ...paramList3],
        confList,
        compositeId: this.currentObj.compositeId || ""
      }
      // const { compositeId } = await this.rpc.d4.saveServiceCpnParams(params)
      // params.compositeId = compositeId
      this.rpc.s4design.addFuntionJobCommitFlow({
        fnctId: this.$route.query.fnctId,
        jobTpCd: 'C4',
      })
      this.setCpnParamsRecord()
      this.$emit("upDateServParams", JSON.parse(JSON.stringify(this.currentObj)), params)
    },
    setCpnParamsRecord() {
      this.cpnParamsRecord = JSON.stringify(this.formData)
      this.actionIdRecord = this.currentObj.actionId
    },
    operate(operation, data) {
      const index = this.tableDataForOutput.indexOf(data)
      this.tableDataForOutput.splice(index, 1)
      this.keyMapList.forEach((item2) => {
        item2.field.splice(index, 1)
        item2.key.splice(index, 1)
      })
      if (this.tableDataForOutput.length === 0) {
        this.keyMapList = []
        this.tempObj = {
          '01': [],
          '02': [],
          '03': [],
        }
        this.tempTableObj = {
          '01': [],
          '02': [],
          '03': [],
        }
      }
    },
    addTableRow() {
      if (this.formData.relType === '03') {
        let keys = this.tableDataForOutput.map((item) => {
          return ''
        })
        let field = this.tableDataForOutput.map((item) => {
          return item.paramKey
        })
        this.keyMapList.push({
          field: field,
          key: keys,
          value: '',
        })
      } else {
        this.keyMapList.push({
          key: [''],
          value: '',
        })
      }

    },
    // addOutputTableRow() {
    //   this.tableDataForOutput = [{
    //     actionId: "",
    //     actionName: "",
    //     apSource: "",
    //     paramKey: "result",
    //     paramName: "赋值结果",
    //     paramCName: "赋值结果",
    //     paramType: "String",
    //     paramValueType: "String",
    //     paramDirection: "1",
    //     paramOrder: "1",
    //     paramParentId: "",
    //     isNeed: "1",
    //     paramMappingKey: "",
    //     paraMapgNm: "",
    //     // paramValue: typeof this.outputResult == "string" ? this.outputResult: JSON.stringify(this.outputResult),
    //   }]
    // },
    // setAssignedSource(type, data) {
    //   console.log("setAssignedSource", type, data)
    //   const index = type.split("assignedSource")[1]
    //   this.expressionList.splice(index, 1, data)
    // },
    // setResult(data) {
    //   console.log("setResult", data)
    //   const row = this.tableDataForOutput[0]
    //   row.actionId = data.actionId
    //   row.actionName = data.actionName
    //   row.apSource = data.apSource
    //   row.paraMapgNm = data.paraMapgNm
    //   row.paramMappingKey = data.paramMappingKey
    // },
    // handleRaidoChange(e) {
    //   console.log("handleRaidoChange", e)
    //   this.formData = JSON.parse(JSON.stringify(this.formData))
    //   const row = this.tableDataForOutput[0] || {}
    //   row.actionId = ""
    //   row.actionName = ""
    //   row.apSource = ""
    //   row.paraMapgNm = ""
    //   row.paramMappingKey = ""
    //   if (this.formData.assignType == "field") {
    //     row.paramType = row.paramValueType = "String"
    //   } else if (["List", "Object"].includes(this.formData.assignType)) {
    //     row.paramType = row.paramValueType = this.formData.assignType
    //   }
    // },
    // showDialog() {
    //   const data = this.tableDataForOutput[0]
    //   this.$refs.setResultRef.showDialog(data, this.formData)
    // },
    init() {
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
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
.aop_tradecode_comps_design_attr_assign_attr {
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
      span {
        display: inline-block;
        color: $sec_danger_color;
        margin-right: 6px;
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
      margin-bottom: 10px;
      overflow: hidden;
      display: flex;
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
    padding: 8px 10px;
  }
  .attr_recive {
    padding-top: 8px;
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
    .table_header {
      display: flex;
      justify-content: space-between;
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
    .table_body {
      padding-top: 8px;
      margin-bottom: 10px;
    }
  }
  .attr-recive-input {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    margin-top: 8px;
    overflow: hidden;
    i {
      margin-left: 5px;
      cursor: pointer;
      color: #358AFF;
    }
  }
  .attr-recive-field {
    width: 60px;
    flex: 1;
  }
  .attr-recive-key {
    flex: 1;
    margin-left: 5px;
  }
  .attr_show_item_c {
    ::v-deep .el-table__cell {
      padding: 4px 0px;
      .cell {
        span {
          font-size: 12px;
        }
      }
    }
  }
  /deep/ thead {
    // b
    .cell {
      // background: red;
      color: #333;
      background: #F5F5F8;
    }
  }
}
</style>
