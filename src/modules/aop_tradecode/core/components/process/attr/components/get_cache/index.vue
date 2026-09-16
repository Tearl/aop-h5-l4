<template>
  <div class="aop_tradecode_comps_design_attr_get_cache_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>获取缓存组件</div>
      </div>
      <div v-if="!isRead" class="attr_box">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t required">
              组件名称：
            </div>
            <div class="attr_show_item_c">
              <el-input disabled v-model="formData.actionDesc" size="mini"></el-input>
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
              缓存索引：
            </div>
            <div class="attr_show_item_c">
              <el-select
                :disabled="!canSave"
                v-model="formData.cacheKey"
                size="mini"
                placeholder="请选择来源"
              >
                <!-- @change="selectChange('cacheKey', $event)" -->

                <el-option
                  v-for="item in cacheKeyOptions"
                  @click.native="selectChange('cacheKey', item.value)"
                  :key="item"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="attr_show_item" >
            <div class="attr_show_item_t required" style="padding-top: 0px;">
              索引类型：
            </div>
            <div class="attr_show_item_c">
              <el-radio-group v-model="formData.cacheKeyType" :disabled="!canSave" @change="handleChangeFormat">
                <el-radio :label="'00'" :disabled="!canSave">静态索引</el-radio>
                <el-radio :label="'01'" :disabled="!canSave">动态索引</el-radio>
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
          <div v-if="formData.cacheKeyType === '01'">
            <div v-for="(data, index) in cacheList" :key="index">
              <div class="add_btn_session">
                <el-button
                  v-if="canSave && index === 0"
                  type="primary"
                  size="mini"
                  @click="addCacheList"
                >添加</el-button>
              </div>
              <div class="attr_show_item">
                <div class="attr_show_item_t required" style="width: 129px;" v-if="index === 0">
                  动态索引来源值：
                </div>
                <div class="add_delete_icon" v-else>
                  <i class="el-icon-plus blue_add" @click="handleAddCacheList(index)"></i>
                  <i class="el-icon-minus red_delete" @click="handleDelectCacheList(index)"></i>
                </div>
                <div class="attr_show_item_c option_width">
                  <el-select
                    :disabled="!canSave"
                    v-model="data.cacheKeySrcActivityId"
                    size="mini"
                    @change="loopListSourceChange(data)"
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
                <div class="attr_show_item_c option_width" style="margin-right: 0px;"  @click="hanldeCLick($event, data)">
                  <el-input
                    :disabled="!canSave"
                    readonly
                    :value="data.paramCName"
                    size="mini"
                    placeholder="请选择来源值"
                    @input="handleInput($event, data)"
                  >
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="transition_arrange">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b required bold">缓存数据结构</div>
              <i class="el-icon-more" style="cursor: pointer;" @click="switchTableMode('inputAtSetting')"></i>
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
                @operate="operate"
                @inputClick="inputClick"
              ></Table>
            </div>
            <div v-if="!isRead">
              <div class="tips_info" v-if="!canSave && !currentObj.actionParentId">
                <el-tag type="warning">保存交易编排后，可对组件信息进行编辑</el-tag>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="transition_arrange">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div>
                <div class="attr_pre_title_b bold">交易编排</div>
                  <el-radio-group @change="handleChangeConfitionType" v-model="formData.conditionType">
                    <el-radio :label="'0'">简单模式</el-radio>
                    <el-radio :label="'1'">复杂模式</el-radio>
                  </el-radio-group>
              </div>
              <div>
                <el-button
                  v-if="canSave  && formData.conditionType === '1'"
                  type="primary"
                  size="mini"
                  @click="addGroup"
                  icon="el-icon-plus"
                >添加逻辑分组</el-button>
                <el-button
                  v-if="canSave && formData.conditionType !== '1'"
                  type="primary"
                  size="mini"
                  @click="addOutputTargetLine(-1)"
                  icon="el-icon-plus"
                >添加逻辑单元</el-button>
              </div>
            </div>
          </div>
          
          <div class="attr_recive" v-if="formData.conditionType === '0'">
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
          <div class="attr_recive" v-if="formData.conditionType === '1'">
            <div class="attr_show_item_c" v-for="(item, index) in outputTargetList2" :key="index">
                <div>
                  <el-button
                    v-if="canSave && outputTargetList2.length > 1"
                    class="add_line_group"
                    type="primary"
                    size="mini"
                    @click="handleDeleteGroup(index)"
                    icon="el-icon-minus"
                  >删除逻辑分组</el-button>
                  <el-button
                    v-if="canSave"
                    class="add_line_group"
                    type="primary"
                    size="mini"
                    @click="addOutputTargetLine(index)"
                    icon="el-icon-plus"
                  >添加逻辑单元</el-button>
                </div>

              <Table
                class="table"
                :mergeColumnList="[0]"
                :ref="'table'"
                :data="item.conditionList"
                :table="outputTargetColumn2"
                @operate="operateList(arguments, index)"
                @selectChange="outputTargetSelectChange"
              ></Table>
            </div>
          </div>
        </div> -->
        <div v-if="!isRead" class="attr_btn">
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
          <div class="attr_show_item">
            <div class="attr_show_item_t textLeft">
              缓存索引：<span class="attr_show_item_i">{{
                formData.cacheKey
              }}</span>
            </div>
          </div>
        </div>
        <div class="transition_arrange read">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">缓存数据结构</div>
            </div>
          </div>
          <div class="attr_recive mb20">
            <div class="attr_show_item_c">
              <Table
                class="table"
                :data="tableData"
                :table="tableColumn"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
                @operate="operate"
              ></Table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 拟态的下拉选择框 -->
    <SimulantSelect
      :disabledData="false"
      @update="handleUpdata"
      @updateEnumData="updateEnumData"
      ref="simulantSelectRef"
      :currentServObj="currentServObj"
      :currentObj="currentObj"
      :currentParentCpnInfo="currentParentCpnInfo"
      :fourRAttrFlag="fourRAttrFlag">
    </SimulantSelect>

    <selectenum :enumVisible="enumVisible" :appId="currentServObj.transAppId" @close="enumVisible = false" @select="selectEnumVal" ref="selectEnumRef" />

    <!-- 选择参数的弹窗 -->
    <SelectParams
      ref="selectParamsRef"
      :currentServObj="currentServObj"
      :currentObj="currentObj"
      @confirm="confirm"
    ></SelectParams>
    <SelectOutputField
      ref="selectOutputFieldRef"
      :currentServObj="currentServObj"
      @setOutputTarget="setOutputTarget"
    ></SelectOutputField>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import SelectOutputField from "../service_setting/selectOutputField"
import SimulantSelect from "../service_setting/simulantSelect"
import { unduplicated } from "@m/utils/array";
import { mixList, reList, packageParamKey, setParamOrder } from "@m/utils/paramTree";
import { sourceActionType, actionTypeToApSource, actionNameToNoActionId, actionTypToArrangeEnum } from "@m/utils/normalData";

import {
  setSessionStorage,
} from "@m/utils/localStorage";

import selectenum from '../service_setting/selectenum.vue'
export default {
  mixins: [mixin],
  components: {
    Table,
    SimulantSelect,
    SelectOutputField,
    selectenum
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

      enumVisible: false,
      formData: {
        actionDesc: "",
        actionMsg: "",
        cacheKey: "", // 缓存索引
        cacheKeyType: '00',
        cacheKeySrcActivityId: '',
        cacheKeySrc: '',
        cacheKeySrcType: '',
        conditionType: '0',
        paramCName: ''
      },
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
      svcIdToSvcNm: {},
      transId: "",
      compositeIdMapToParamList: {},
      tableData: [],
      appId: "",
      cacheKeyOptions: [],
      showAllInputParamsAtSetting: false,
      paramCName: '',
      cacheList: [],
      target: null,
      layoutActionList: [],
      outputTargetList: [],
      outputTargetList2: [],
    };
  },
  computed: {
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
              // console.log('listppppp', list)
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
            // selectVal: [
            //   { type: "=", value: "=" },
            //   { type: ">", value: ">" },
            //   { type: ">=", value: ">=" },
            //   { type: "<", value: "<" },
            //   { type: "<=", value: "<=" },
            //   { type: "!=", value: "!=" },
            // ],
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
            // minWidth: "15%",
            width: "100",
            type: "select",
            // selectVal: [
            //   { type: "=", value: "=" },
            //   { type: ">", value: ">" },
            //   { type: ">=", value: ">=" },
            //   { type: "<", value: "<" },
            //   { type: "<=", value: "<=" },
            //   { type: "!=", value: "!=" },
            // ],
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
    loopListSourceOptions() {
      console.log(this.compositeIdMapToParamList, 'compositeIdMapToParamList')
      const arr = Object.keys(this.compositeIdMapToParamList).reduce((prev, compositeId) => {
        if (compositeId != this.currentObj.compositeId) {
          const value = this.compositeIdMapToParamList[compositeId]?.actionSeq ? `(${this.compositeIdMapToParamList[compositeId]?.actionSeq})` : ''
          console.log('11111111111111111', this.compositeIdMapToParamList[compositeId])
          prev.push({
            ...this.compositeIdMapToParamList[compositeId],
            value: compositeId,
            label: this.compositeIdMapToParamList[compositeId]?.svcNm + value,
            actionType: this.compositeIdMapToParamList[compositeId]?.actionType,
            actionId: compositeId,
            apSource: compositeId ===  this.currentServObj?.svcId ? '00' : '',
          })
        }
        return prev
      }, [{ label: "枚举值", value: "10" },])
      console.log(arr, 'ppppppppppp')
      return arr

    },
    blngtoTyp() {
      return this.currentServObj.apiServiceType.indexOf("D4") > -1
        ? "10"
        : "11";
    },
    // 是否修改过组件的参数
    hasChangeCpnParams() {
      return false
    },
    canSave() {
      return !this.isRead && this.currentObj.compositeId && !this.fourRAttrFlag && !this.currentObj.actionParentId
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
          // {
          //   // prop: "apSource", // 当前4b交易00 L5服务20
          //   prop: "actionId",
          //   label: "来源",
          //   minWidth: "30%",
          //   type: "simulantSelect",
          //   placeholder: "请选择",
          //   inputStyle: {
          //     cursor: "pointer",
          //   },
          //   filter: (scope) => {
          //     const { actionName, actionId } = scope.row
          //     if (!actionName && !actionId) {
          //       return ""
          //     } else if (["当前4b交易", "当前循环组件", "固定值"].includes(actionName)) {
          //       return actionName
          //     } else {
          //       const item = this.getDataList().find(data => data.compositeId == actionId)
          //       if (item) {
          //         const actionSeq = this.getConfItem("actionSeq", item.actionId).value
          //         return `${actionName}(${actionSeq})`
          //       } else {
          //         return scope.row.actionId
          //       }
          //     }
          //   },
          // },
          // {
          //   prop: (row) => {
          //     if (row?.actionId == "constantValue") {
          //       return "paramMappingKey"
          //     } else {
          //       return "paraMapgNm"
          //     }
          //   },
          //   label: "来源值",
          //   minWidth: "30%",
          //   type: (row) => {
          //     if (row.actionId == "constantValue") {
          //       return "input"
          //     } else {
          //       return "simulantSelect"
          //     }
          //   },
          //   placeholder: "请选择",
          //   inputStyle: {
          //     cursor: "pointer",
          //   },
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
                  const paramList = mixList(JSON.parse(JSON.stringify(this.tableData)), "children") || []
                  const _parentParam = paramList.find(item => item.paramOrder == scope.row.paramParentId)
                  return !["List", "Object"].includes(_parentParam?.paramType)
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
          //     } else if (["当前4b交易", "当前循环组件", "固定值"].includes(actionName)) {
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
          //   filter: (scope) => {
          //     if (scope.row?.actionId == "constantValue") {
          //       return scope.row.paramMappingKey
          //     } else {
          //       return scope.row.paraMapgNm
          //     }
          //   },
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
  },
  inject: ["getDataList"],
  methods: {
    // 选中枚举
    selectEnumVal() {
      
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    },
    updateEnumData(target,source, parent) {
      console.log('????', target);
      
      target.paramMappingKey = parent.value + '.' + source.value
      target.paraMapgNm = `${parent.label}.${source.label}`
      this.target.cacheKeySrc = target.paramMappingKey
      this.target.paramCName = target.paraMapgNm
      this.cacheList = [...this.cacheList]
    },
    handleUpdata(row, data) {
      console.log(row, data, 'row, data')
      this.target.cacheKeySrc = row.paramMappingKey
      this.target.paramCName = row.paraMapgNm
      this.cacheList = [...this.cacheList]
      console.log(this.target, "paramCName")
    },
    handleDeleteGroup(index) {
      this.outputTargetList2.splice(index, 1)
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

      if (this.formData.conditionType === '1') {
        this.outputTargetList2 = JSON.parse(JSON.stringify(tfrCdtnCd))
        this.outputTargetList2.forEach((item) => {
          item.conditionList.forEach((data) => {
            data.id = '1'
            data.actionId = data.actionNm == "当前4b交易" ? this.currentServObj?.svcId : data.actionId,
            data.paramValueSrcActionId = data.paramValueSrcActionId ? data.paramValueSrcActionId : '10'
            data.elementType = data.paramValueSrcType === '10' ? 'text' : 'text'
          })
        })
        setTimeout(() => {
          this.$refs.table?.forEach((item) => {
            item.initSpanArr()
          })
        }, 500)
      } else {
        this.outputTargetList = tfrCdtnCd.map(item => {
          return {
            ...item,
            actionId: item.actionNm == "当前4b交易" ? this.currentServObj?.svcId : item.actionId,
            paramValueSrcActionId: item.paramValueSrcActionId ? item.paramValueSrcActionId : '10',
            elementType: item.paramValueSrcType === '10' ? 'text' : 'text',
          }
        })
        this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
      }
    },
    setOutputTarget(type, target, obj) {
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
    handleChangeConfitionType(value, e) {
      console.log(1111, value, e)
      if (this.formData.conditionType === '1') {
        if (this.outputTargetList2.length === 0) {
          this.addGroup()
        } else {
          this.$nextTick(() => {
            this.$refs.table?.forEach((item) => {
              item.initSpanArr()
            })
          })
        }
      }
    },
    addGroup() {
      this.outputTargetList2.push({
        activityNextSeq: '',
        conditionList: [],
      })
    },
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
    operateList(event, index) {
      // console.log(a, b, index)
      const operation = event[0]
      const data = event[1]
      this.outputTargetOperate(operation, data, index) 
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
        // this.$refs.selectOutputFieldRef.showDialog(data, this.formData, 'paramValueSrcActionId')
        if (data.paramValueSrcActionId == '10') {
          console.log('??shit');
          this.$refs.selectEnumRef.showDialog(data)
          
        } else {
          this.$refs.selectOutputFieldRef.showDialog(data, this.formData, 'paramValueSrcActionId')
        }
      }
    },
    outputTargetSelectChange(row, prop) {
      console.log(row, prop, "row, prop")
      if (prop == "paramNm") {
        console.log(paramNm, this.formData, "paramNm")
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
        console.log(row.actionNm, 'actionNm')
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
    handleInput(v, data) {
      console.log("handleInput", v);
      data.cacheKeySrc = v
      data.paramCName = v
      this.cacheList = [...this.cacheList]
    },
    handleDelectCacheList(index) {
      this.cacheList.splice(index, 1)
    },
    handleAddCacheList(index) {
      this.cacheList.splice(index, 0, {
        cacheKeySrc: '',
        cacheKeySrcActivityId: '',
        paramCName: '',
      })
    },
    loopListOptions(id) {
      const compositeId = id
      const dataList = this.currentParentCpnInfo?.dataList || this.getDataList()
      const option = this.loopListSourceOptions.find(item => item.value == compositeId)
      const paramDirection = option?.value == this.currentServObj?.svcId ? "0" : "1"
      const item = dataList.find(data => data.compositeId && data.compositeId == compositeId)
      console.log(item, "itemitem")
      if (item || compositeId == this.currentServObj?.svcId) {
        let paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[compositeId]?.paramList || []))
        reList(paramList)
        const list = []
        console.log(paramList, "result")
        paramList.map(param => {
          const paramOrder = param.paramOrder
          const arr = paramOrder.split('.')
          const paramParentOrder = arr[0] + '.' + arr[1]
          const paramParent = paramList.find((item) => {
            return item.paramOrder === paramParentOrder && item.paramDirection == paramDirection
          })
          param.label = param.paramCName
          param.paramMappingKey = packageParamKey(param, paramList)
          param.value = param.paramMappingKey
          if ((paramParent && paramParent.paramType !== 'List' && paramParent.paramType !== 'Object' && param.paramDirection == paramDirection) || item?.actionType === "getFlowNumAction") {
            list.push(param)
          }
          return param
        })
        return list
      } else {
        return []
      }
    },
    addCacheList() {
      this.cacheList.push({
        cacheKeySrc: '',
        cacheKeySrcActivityId: '',
        paramCName: '',
      })
    },
    
    hanldeCLick(event, data) {
      this.target = data
      console.log('111111111')
      const id = this.target.cacheKeySrcActivityId
      for (let i = 0; i < this.loopListSourceOptions.length; i++) {
        const item = this.loopListSourceOptions[i];
        // if (item.)
        if (item.value === id) {
          const scope = {
            row: item,
            apSource: item.actionId === this.currentServObj?.svcId ? '00' : '',
            column: {
              label: '来源值'
            }
          }
          console.log(scope, "scope1111")
          this.$refs.simulantSelectRef.init(scope, event)
        }
      }

    },
    handleChangeFormat() {
      if (this.formData.cacheKeyType === '00') {
        this.formData.cacheKeySrcActivityId = ''
        this.formData.cacheKeySrc = ''
        this.formData.cacheKeySrcType = ''
        this.paramCName = ''
      } else {
        if (this.cacheList.length === 0) {
          this.addCacheList()
        }
      }
    },
    async loopListSourceChange(e) {
      e.cacheKeySrc = ""
      e.paramCName = ''
      const componentList = this.getDataList()
      const target = componentList.filter((data) => {
        return data.compositeId === e.cacheKeySrcActivityId
      })[0]
      console.log(e, 'eeeeeee')
      this.cacheList = [...this.cacheList]
      if (e.cacheKeySrcActivityId === '10') {
        e.cacheKeySrcType = '10'
      } else if (e.cacheKeySrcActivityId === this.currentServObj?.svcId) {
        e.cacheKeySrcType = '00'
      } else {
        e.cacheKeySrcType = actionTypeToApSource[target.actionType]
      }
      await this.updateCompositeIdMapToParamList(e)
    },
    async updateCompositeIdMapToParamList(e) {
      const compositeId = e.cacheKeySrcActivityId
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
        } else {
          const res = await this.rpc.d4.getServiceCpnParams({
            d4StusCd: "1",
            blngtoTyp: "11",
            compositeId: compositeId,
          })
          item.paramList = res.paramList
        }
      }
      return null
    },
    switchTableMode() {
      this.showAllInputParamsAtSetting = !this.showAllInputParamsAtSetting
    },
    async getParams(e, obj) {
      console.log(actionNameToNoActionId, sourceActionType, 'getParams')
      console.log("getParams", e, obj);
      this.init()
      this.currentObj = e;
      if (!e.compositeId) {
        e.conf.map((item) => {
          this.formData[item.name] = item.value;
        });
        return;
      } else {
        Promise.all([
        //   this.rpc.d4.getServiceCpnParams({
        //   d4StusCd: "1",
        //   blngtoTyp: this.blngtoTyp,
        //   compositeId: e.compositeId || "",
        // }), 
        this.rpc.d4.queryCacheIndexList({
          appId: this.currentServObj.relySys || this.$route.query.bizAppNo
        })]).then(async (resArr) => {
          const res1 = resArr[0];
          this.cacheKeyOptions = res1.confList.map(item => {
            item.label = item.confValue
            item.value = item.confValue
            return item
          })
          const res = e;
          this.cpnData = res;
          this.paramList = res.paramList;
          console.log(this.paramList, "ddddddddddd")
          this.cacheList = []
          res.confList.map((item) => {
            this.formData[item.confKey] = item.confValue;
            if (item.confKey === 'cacheKeySrcActivityId') {
              this.cacheList = item.confValue.split('##').map((value, index) => {
                return {
                  cacheKeySrcActivityId: value,
                  cacheKeySrc: this.cacheList[index]?.cacheKeySrc || '',
                  cacheKeySrcType: this.cacheList[index]?.cacheKeySrcType || '',
                }
              })
            }
            if (item.confKey === 'cacheKeySrc') {
              this.cacheList = item.confValue.split('##').map((value, index) => {
                return {
                  cacheKeySrcActivityId: this.cacheList[index]?.cacheKeySrcActivityId || '',
                  cacheKeySrc: value,
                  cacheKeySrcType: this.cacheList[index]?.cacheKeySrcType || '',
                }
              })
            }
            if (item.confKey === 'cacheKeySrcType') {
              this.cacheList = item.confValue.split('##').map((value, index) => {
                return {
                  cacheKeySrcActivityId: this.cacheList[index]?.cacheKeySrcActivityId || '',
                  cacheKeySrc: this.cacheList[index]?.cacheKeySrc || '',
                  cacheKeySrcType: value,
                }
              })
            }
            if (item.confKey == 'paramCName')  {
              this.cacheList = item.confValue.split('##').map((value, index) => {
                return {
                  cacheKeySrcActivityId: this.cacheList[index]?.cacheKeySrcActivityId || '',
                  cacheKeySrc: this.cacheList[index]?.cacheKeySrc || '',
                  cacheKeySrcType: this.cacheList[index]?.cacheKeySrcType || '',
                  confDescr: value
                }
              })
            }
          });
          if (!this.formData.conditionType) {
            this.formData.conditionType = '0'
          }
          // 更新实时位置序号
          const arr = ["actionSeq", "actionFrntSeq", "actionPostSeq"]
          arr.forEach((key) => {
            this.formData[key] = this.getConfItem(key, e.actionId)?.value || ""
          })
          res.paramList.forEach(item => {
            if (item.apSource == "00") {
              item.actionName = "当前4b交易"
              item.actionId = this.currentServObj?.svcId
            } else if (item.apSource == "10") {
              item.actionId = "constantValue"
            }
          })
          // this.getServiceArrangeList(e)
          this.tableData = reList(res.paramList)
          this.$nextTick(async () => {
            for (let j = 0; j < this.cacheList.length; j++) {
              const data = this.cacheList[j];
              if (data.cacheKeySrcActivityId === '10') {
                // data.paramCName = data.cacheKeySrc
                data.paramCName = data.confDescr
              } else {
                await this.updateCompositeIdMapToParamList(data)
                console.log(data, 'data')
                const list = this.loopListOptions(data.cacheKeySrcActivityId)
                for (let i = 0; i < list.length; i++) {
                  const item = list[i];
                  console.log(data, item.paramMappingKey, 'ooooooo')
                  if (item.paramMappingKey === data.cacheKeySrc) {
                    data.paramCName = item.paramName
                  }
                }
              }
            }
            this.cacheList = [...this.cacheList]
          })
        })
      }
      this.setCpnParamsRecord();
    },
    async saveParams() {
      if (!this.formData.actionDesc) {
        return this.$message.error("组件名称不能为空")
      } else if (!this.formData.cacheKey) {
        return this.$message.error("缓存索引不能为空")
      }
      if (!this.tableData.length) {
        return this.$message.error("缓存数据结构不能为空")
      }
      if (this.formData.cacheKeyType === '01') {
        this.formData.cacheKeySrcActivityId = ''
        this.formData.cacheKeySrc = ''
        console.log('???????+++++++======', this.cacheList);
        for (let i = 0; i < this.cacheList.length; i++) {
          const item = this.cacheList[i];
          if (!item.cacheKeySrc || !item.cacheKeySrcActivityId) {
            console.log(item, "itemitemitem")
            return this.$message.error("动态索引来源值不能为空")
          }
          if (i == 0) {
            this.formData.cacheKeySrcActivityId = item.cacheKeySrcActivityId
            this.formData.cacheKeySrc = item.cacheKeySrc
            this.formData.cacheKeySrcType = item.cacheKeySrcType
            this.formData.paramCName = item.paramCName
          } else {
            this.formData.cacheKeySrcActivityId = this.formData.cacheKeySrcActivityId + '##' + item.cacheKeySrcActivityId
            this.formData.cacheKeySrc = this.formData.cacheKeySrc + '##' + item.cacheKeySrc
            this.formData.cacheKeySrcType = this.formData.cacheKeySrcType + '##' + item.cacheKeySrcType
            this.formData.paramCName = this.formData.paramCName + '##' + item.paramCName
          }
        }
      }
      const confList = this.cpnData.confList || [];
      const _formData = JSON.parse(JSON.stringify(this.formData))
      let tfrCdtnCd = []
      const componentList = this.getDataList()
      if (this.formData.conditionType === '0') {
        tfrCdtnCd = this.outputTargetList.reduce((prev, item) => {
          // paramValueType 参数值类型
          // paramKeySrcType 参数Key来源类型
          // paramValueSrcType 参数值来源类型
          // paramValueSrcActionId 参数值来源组件ID
          const target = componentList.filter((data) => {
            return data.compositeId === item.actionId
          })[0]
          let paramKeySrcType = ''
          if (item.actionId === this.currentServObj?.svcId) {
            paramKeySrcType = '00'
          } else {
            paramKeySrcType = actionTypeToApSource[target.actionType]
            console.log(paramKeySrcType, 'paramKeySrcType')

          }
          const id = item.paramValueSrcActionId
          let paramValueSrcType = ''
          const target2 = componentList.filter((data) => {
            return data.compositeId === id
          })[0]
          if (id === '10') {
            paramValueSrcType = '10'
          } else if (id === this.currentServObj?.svcId) {
            paramValueSrcType = '00'
          } else {
            paramValueSrcType = actionTypeToApSource[target2.actionType]
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
        // 如果交易编排列表的返回字段key没有层级结构，则不通过(临时增加的校验，后续删除)
        // const notMatchKeyItem = tfrCdtnCd.find(item => !item?.paramKey.includes(".") && item.paramKey != "loopOutputList" && !["设置会话组件", "获取会话组件", "文件上传组件"].includes(item.actionNm))
        // if (notMatchKeyItem) return this.$message.error(`返回字段【${notMatchKeyItem.paramNm}】的参数格式有误，请重新设置`)
      } else {
        tfrCdtnCd = []
        const dataList = JSON.parse(JSON.stringify(this.outputTargetList2))
        for (let i = 0; i < dataList.length; i++) {
          const item = dataList[i].conditionList;
          const list = item.map((item) => {
            const target = componentList.filter((data) => {
              return data.compositeId === item.actionId
            })[0]
            let paramKeySrcType = ''
            if (item.actionId === this.currentServObj?.svcId) {
              paramKeySrcType = '00'
            } else {
              paramKeySrcType = actionTypeToApSource[target.actionType]
              console.log(paramKeySrcType, 'paramKeySrcType')

            }
            const id = item.paramValueSrcActionId
            let paramValueSrcType = ''
            const target2 = componentList.filter((data) => {
              return data.compositeId === id
            })[0]
            if (id === '10') {
              paramValueSrcType = '10'
            } else if (id === this.currentServObj?.svcId) {
              paramValueSrcType = '00'
            } else {
              paramValueSrcType = actionTypeToApSource[target2.actionType]
              console.log(paramValueSrcType, 'paramValueSrcType')
            }
            if (item.actionNm == "当前4b交易") item.actionId = ""
            return {
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
              groupOperator: item.groupOperator,
            }
          })
          if (!list[0]?.actionPostSeq) {
              return this.$message.error(`第${i + 1}个逻辑分组的后续顺序号不能为空`)  
          }
          tfrCdtnCd.push({
            activityNextSeq: list[0]?.actionPostSeq || '',
            conditionList: list
          })
        }

        if (tfrCdtnCd.length) {
          const keyToErrorMessage = {
            actionId: "来源不能为空",
            paramKey: "返回字段不能为空",
            paramNm: "返回字段不能为空",
            condTyp: "对比关系不能为空",
            paramValue: "对比值不能为空",
            // actionPostSeq: "后续顺序号不能为空",
            groupOperator: '操作符不能为空'
          }
          for (let i = 0; i < tfrCdtnCd.length; i++) {
            const item = tfrCdtnCd[i];
            if (!item.conditionList.length) {
              return this.$message.error('交易编排逻辑分段不能为空')  
            }
          }
          for (let key in keyToErrorMessage) {
            for (let i = 0; i < tfrCdtnCd.length; i++) {
              let item = tfrCdtnCd[i].conditionList;
              if (item.length) {
                for (let j = 0; j < item.length; j++) {
                  const element = item[j];
                  if (key === 'groupOperator') {
                    if (j < (item.length - 1) && !element[key]) {
                      return this.$message.error(`第${i + 1}个逻辑分组的第${j + 1}行${keyToErrorMessage[key]}`)
                    } else if (j === (item.length - 1) && element[key]) {
                      return this.$message.error(`第${i + 1}个逻辑分组最后一行逻辑符号只能为空`)
                    }
                    continue
                  }
                  if (key === 'actionId' && element.actionNm === '当前4b交易') {
                    continue
                  }
                  if (!element[key]) {
                    return this.$message.error(`第${i + 1}个逻辑分组的第${j + 1}行${keyToErrorMessage[key]}`)
                  }
                }
              }
            }
          }
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
        actionTyp: actionTypToArrangeEnum['getCacheAction'],
        loSeqNo: "",
        frntLoSeqNo: "",
        postLoSeqNo: "",
        tranId: this.currentServObj?.svcId,
        tfrCdtnCd: JSON.stringify(tfrCdtnCd),
        layoutActionList: []
      }
      console.log('formDataformDataformDataformDataformData',_formData);
      for (let i in _formData) {
        console.log('??????', i);
        
        const target = confList.find((item) => item.confKey == i);
        if (target) {
          target.confValue = _formData[i];
          if (i == 'cacheKeySrc') {
            target.confDescr = _formData.paramCName || ""
          } else {
            target.confDescr = ""
          }
        } else {
          confList.push({
            confKey: i,
            confValue: _formData[i],
            confId: "",
            confDescr: _formData.paramCName || "",
            compositeId: this.currentObj?.compositeId || "",
          });
        }
      }

      console.log("confListconfList====》", confList)
      let paramList = JSON.parse(JSON.stringify(this.tableData))
      paramList = setParamOrder(paramList)
      paramList = mixList(paramList, "children").map(param => {
        param.paramDirection = "1"
        if (actionNameToNoActionId.includes(param.actionName)) {
          param.actionId = ""
        }
        return param
      })
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: this.fourRAttrFlag ? this.currentParentCpnInfo.compositeId : this.currentServObj.svcId,
        paramList: paramList,
        confList,
        compositeId: this.currentObj?.compositeId || "",
      };
      const { compositeId } = await this.rpc.d4.saveServiceCpnParams(params);
      params.compositeId = compositeId;
      this.rpc.s4design.addFuntionJobCommitFlow({
        fnctId: this.$route.query.fnctId,
        jobTpCd: 'C4',
      })
      this.setCpnParamsRecord();
      this.$emit("upDateServParams", JSON.parse(JSON.stringify(this.currentObj)), params);
      // this.$emit("updateServiceArrangeList", layoutServiceBeanList);
      // this.$emit("toSave", true);
    },
    setCpnParamsRecord() {
      const _formData = JSON.parse(JSON.stringify(this.formData));
      _formData.inputParamsListAtSetting = this.inputParamsListAtSetting;
      _formData.outputParamsListAtSetting = this.outputParamsListAtSetting;
      this.cpnParamsRecord = JSON.stringify(_formData);
      this.actionIdRecord = this.currentObj.actionId;
      setSessionStorage("4R-paramsData", JSON.stringify(_formData));
    },
    // 获取conf配置项
    getConfItem(name, actionId) {
      // const dataList = this.currentParentCpnInfo?.dataList || this.getDataList()
      const dataList = this.getDataList()
      const cpn = dataList.find(data => data.actionId == actionId)
      return cpn.conf.find(item => item.name == name) || {}
    },
    operate(operation, data) {
      if (operation == "delete") {
        const index = this.tableData.indexOf(data)
        this.tableData.splice(index, 1)
        this.tableData = setParamOrder(this.tableData)
      }
    },
    inputClick(scope, e) {
      e.preventDefault();
      this.$refs.simulantSelectRef.init(scope, e)
    },
    showDialog() {
      this.$refs.selectParamsRef.showDialog();
    },
    confirm(data) {
      data.forEach(item => item.paramDirection = "1")
      this.tableData.push(...data)
      this.tableData = unduplicated(setParamOrder(this.tableData), "paramKey")
      return
    },
    async selectChange(key, e) {
      console.log("selectChange", key, e)
      if (key == "cacheKey") {
        let id = ''
        for (let i = 0; i < this.cacheKeyOptions.length; i++) {
          const item = this.cacheKeyOptions[i];
          if (item.confValue === e) {
            id = item.confId
          }
        }
        const res = await this.rpc.d4.queryCacheModuleParamList({
          confId: id
        });
        res.paramList.forEach(item => {
          if (item.apSource == "00") {
            item.actionName = "当前4b交易"
            item.actionId = this.currentServObj?.svcId
          } else if (item.apSource == "10") {
            item.actionId = "constantValue"
          }
        })
        this.tableData = reList(res.paramList)
      }
    },
    init() {
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
      this.appId = this.$route.query.appId
      this.svcIdToSvcNm = this.getDataList().reduce((prev, data) => {
        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType)  && data.compositeId) {
          prev[data.compositeId] = data.actionName
        }
        return prev
      }, { [this.currentServObj?.svcId]: "当前4b交易" })
      const dataList = this.currentParentCpnInfo?.dataList || this.getDataList()
      let { puApiParams} = this.currentServObj
      puApiParams = puApiParams.filter((item) => item.paramDirection == 0)
      console.log(dataList, "dataList")
      this.compositeIdMapToParamList = dataList.reduce((prev, data) => {
        if (["D4bAction", "D5SelfAction", "D5LinkAction", "getFlowNumAction"].includes(data.actionType)  && data.compositeId) {
          const compositeId = data.compositeId
          const conf = data.conf.find(item => {
            return item.name === 'actionSeq'
          })
          //if (!this.compositeIdMapToParaquerySessionParammList[compositeId]) {
          prev[compositeId] = {
            svcId: data.actionOwnId,
            svcNm: data.actionName,
            actionSeq: conf?.value || '',
            actionType: data.actionType,
            paramList: [],
          }

          //}
        }
        // if (sourceActionType.includes(data.actionType) && data.compositeId) {
        //   // const svcId = data.conf.find(item => item.name == "svcId").value

        // }
        return prev
      }, {[this.currentServObj?.svcId]: { svcNm: "当前4b交易", svcId: this.currentServObj?.svcId, paramList: puApiParams}})
      console.log(this.compositeIdMapToParamList, 'oooooooooooooo')
    },
  },
  created() {
    // this.init()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_get_cache_attr {
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
    margin-bottom: 10px;
    &.mb0 {
      margin-bottom: 0;
    }
    .el-icon-arrow-down {
      cursor: pointer;
      &.hidden {
        transform: rotate(180deg);
      }
    }
    .attr_pre_title_b {
      color: $reg_ft_color;
      display: inline-block;
      margin-right: 10px;
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
    .add_btn_session {
      margin-top: 10px;
      margin-bottom: 10px;
      text-align: right;
    }
    .attr_show_item {
      display: flex;
      margin-bottom: 10px;
      overflow: hidden;
      position: relative;
      font-size: 14px;
      .add_delete_icon {
        display: flex;
        align-items: center;
        justify-content: right;
        width: 129px;
        padding-right: 12px;
        i {
          margin-left: 5px
        }
        .red_delete {
          color: $danger_color;
        }
        .blue_add {
          color: #358aff;
        }
      }
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
        // min-width: 90px;
        // text-align: right;
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
        ::v-deep .el-select {
          width: 100%;
        }
      }
      .option_width {
        width: 30%;
        flex: 1;
        margin-right: 10px;
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
  .table {
    &.input_list {
      ::v-deep .el-input__inner {
        cursor: pointer;
      }
      ::v-deep .el-table {
        &::before {
          display: none;
        }
      }
    }
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
    // margin-top: 10px;
    ::v-deep .el-select__caret {
      color: #333;
      transform: rotateZ(0);
      &::before {
        content: "\e790"
      }
    }
    ::v-deep .el-input__suffix {
      color: #333;
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
  .add_line_group {
    float: right;
    margin-bottom: 10px;
    margin-top: 10px;
    margin-left: 10px;
  }
}
</style>
