<template>
  <div class="aop_tradecode_comps_design_attr_set_cache_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>设置缓存组件</div>
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
              <el-input
                :disabled="!canSave"
                v-model="formData.cacheKey"
                size="mini">
              </el-input>
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
                <div class="attr_show_item_c option_width" style="margin-right: 0px;" @click="hanldeCLick($event, data)">
                  <el-input placeholder="请选择来源值" size="mini" readonly v-model="data.paramCName" @click="hanldeCLick($event, data)"></el-input>
                </div>
                <!-- <div class="attr_show_item_c option_width" style="margin-right: 0px;" v-if="data.cacheKeySrcActivityId === '10'">
                  <el-input placeholder="请输入" size="mini" @input="handleInput($event, data)" v-model="data.paramCName"></el-input>
                </div> -->
              </div>
            </div>

          </div>
        </div>
        <div class="transition_arrange">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b required bold">缓存数据结构</div>
              <div>
                <i class="el-icon-more" style="cursor: pointer; margin-right: 10px;" @click="switchTableMode('inputAtSetting')"></i>
                <el-button
                  v-if="canSave"
                  type="primary"
                  size="mini"
                @click="showDialog"
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

    <!-- 选择参数的弹窗 -->
    <SelectParams
      ref="selectParamsRef"
      :currentServObj="currentServObj"
      :currentObj="currentObj"
      @confirm="confirm"
    ></SelectParams>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import SimulantSelect from "../service_setting/simulantSelect"
import { unduplicated } from "@m/utils/array";
import { mixList, reList, packageParamKey, setParamOrder } from "@m/utils/paramTree";
import { sourceActionType, actionTypeToApSource, actionNameToNoActionId } from "@m/utils/normalData";
import SelectParams from "./components/selectParams"

import {
  setSessionStorage,
} from "@m/utils/localStorage";
export default {
  mixins: [mixin],
  components: {
    Table,
    SimulantSelect,
    SelectParams,
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
      formData: {
        actionDesc: "",
        actionMsg: "",
        cacheKey: "", // 缓存索引
        cacheKeyType: '00',
        cacheKeySrcActivityId: '',
        cacheKeySrc: '',
        cacheKeySrcType: '',
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
      showAllInputParamsAtSetting: false,
      paramCName: '',
      cacheList: [],
      target: null,
    };
  },
  computed: {
    setDisabled2(data) {
      console.log(data, "datadata222222222222222")
    },
    loopListSourceOptions() {
      console.log(this.compositeIdMapToParamList, 'compositeIdMapToParamList')
      const arr = Object.keys(this.compositeIdMapToParamList).reduce((prev, compositeId) => {
        if (compositeId != this.currentObj.compositeId) {
          const value = this.compositeIdMapToParamList[compositeId]?.actionSeq ? `(${this.compositeIdMapToParamList[compositeId]?.actionSeq})` : ''
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
          {
            // prop: "apSource", // 当前4b交易00 S5服务20
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
                
                return "paraMapgNm"
              } else if(row?.actionId == "fixedValue") {
                return "paramMappingKey"
              } else {
                return "paraMapgNm"
              }
            },
            label: "来源值",
            minWidth: "30%",
            type: (row) => {
              if (row.actionId == "constantValue") {
                return "text"
              } else if(row.actionId == "fixedValue") {
                return "input"
              } else {
                return "text"
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
                if (item) {
                  const actionSeq = this.getConfItem("actionSeq", item.actionId).value
                  return `${actionName}(${actionSeq})`
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
                // return scope.row.paramMappingKey
                return scope.row.paraMapgNm
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
  },
  inject: ["getDataList"],
  methods: {
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
      if (item || compositeId == this.currentServObj?.svcId) {
        let paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[compositeId]?.paramList || []))
        reList(paramList)
        const list = []
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
          console.log('333333333')
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
        this.formData.paramCName = ''
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
      let item = this.compositeIdMapToParamList[compositeId]
      const apiId = item?.svcId
      console.log(item, 'qqqqqqqqqqqqqq')
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
          console.log('111111111')
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
      console.log("getParams", e, obj);
      this.init()
      this.currentObj = e;
      if (!e.compositeId) {
        e.conf.map((item) => {
          this.formData[item.name] = item.value;
        });
        return;
      } else {
        // const params = {
        //   d4StusCd: "1",
        //   blngtoTyp: this.blngtoTyp,
        //   compositeId: e.compositeId || "",
        // };
        // const res = await this.rpc.d4.getServiceCpnParams(params);
        this.cpnData = e;
        this.paramList = e.paramList;
        this.cacheList = []
        this.formData = {
          actionDesc: "",
          actionMsg: "",
          cacheKey: "", // 缓存索引
          cacheKeyType: '00',
          cacheKeySrcActivityId: '',
          cacheKeySrc: '',
          cacheKeySrcType: '',
          paramCName: ''
        }
        e.confList.map((item) => {
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
          if (item.confKey === 'cacheKeySrcType') {
            this.cacheList = item.confValue.split('##').map((value, index) => {
              return {
                cacheKeySrcActivityId: this.cacheList[index]?.cacheKeySrcActivityId || '',
                cacheKeySrc: this.cacheList[index]?.cacheKeySrc || '',
                cacheKeySrcType: value,
                // confDescr: item.confDescr.split('##')[index]
              }
            })
          }
          if (item.confKey === 'cacheKeySrc') {
            this.cacheList = item.confValue.split('##').map((value, index) => {
              return {
                cacheKeySrcActivityId: this.cacheList[index]?.cacheKeySrcActivityId || '',
                cacheKeySrc: value,
                cacheKeySrcType: this.cacheList[index]?.cacheKeySrcType || '',
                // confDescr: item.confDescr.split('##')[index]
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
        console.log(this.cacheList, "cacheList")
        // 更新实时位置序号
        const arr = ["actionSeq", "actionFrntSeq", "actionPostSeq"]
        arr.forEach((key) => {
          this.formData[key] = this.getConfItem(key, e.actionId)?.value || ""
        })
        e.paramList.forEach(item => {
          if (item.apSource == "00") {
            item.actionName = "当前4b交易"
            item.actionId = this.currentServObj?.svcId
          } else if (item.apSource == "10") {
            item.actionId = "constantValue"
          }
        })

        this.tableData = reList(e.paramList)
        this.$nextTick(async () => {
          for (let j = 0; j < this.cacheList.length; j++) {
            const data = this.cacheList[j];

            if (data.cacheKeySrcActivityId === '10') {
              data.paramCName = data.confDescr
              
            } else {
              await this.updateCompositeIdMapToParamList(data)
              const list = this.loopListOptions(data.cacheKeySrcActivityId)
              for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (item.paramMappingKey === data.cacheKeySrc) {
                  data.paramCName = item.paramName
                }
              }
            }

          }
          this.cacheList = [...this.cacheList]
          console.log(this.cacheList, 'cachelist')
        })

      }
      this.setCpnParamsRecord();
    },
    async saveParams() {
      const reg = /^[A-Za-z]/;
      const value = this.formData.cacheKey
      if (!this.formData.actionDesc) {
        return this.$message.error("组件名称不能为空")
      } else if (!this.formData.cacheKey) {
        return this.$message.error("缓存索引不能为空")
      } else if (value == "" || value && !reg.test(value)) {
        return this.$message.error("请输入英文开头")
      } else if (!(/^\w+$/.test(this.formData.cacheKey))) {
        return this.$message.error("只能输入数字、英文字母及下划线")
      }
      if (!this.tableData.length) {
        return this.$message.error("缓存数据结构不能为空")
      }
      if (this.formData.cacheKeyType === '01') {
        this.formData.cacheKeySrcActivityId = ''
        this.formData.cacheKeySrc = ''
        
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
          // this.formData.paramCName = item.paramCName
        }
      }
      
      const confList = this.cpnData.confList || [];
      const _formData = JSON.parse(JSON.stringify(this.formData))
      console.log('formDataformDataformDataformDataformData',_formData);
      
      for (let i in _formData) {
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
      // const { compositeId } = await this.rpc.d4.saveServiceCpnParams(params);
      // params.compositeId = compositeId;
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
      console.log("数据-setCpnParamsRecord", this.inputParamsListAtSetting);
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
      console.log("operate", operation, data)
      if (operation == "delete") {
        const index = this.tableData.indexOf(data)
        this.tableData.splice(index, 1)
        this.tableData = setParamOrder(this.tableData)
      }
    },
    inputClick(scope, e) {
      console.log("inputClick", scope, e)
      e.preventDefault();
      this.$refs.simulantSelectRef.init(scope, e)
    },
    showDialog() {
      console.log("showDialog")
      this.$refs.selectParamsRef.showDialog();
    },
    confirm(data) {
      console.log("confirm", data);
      data.forEach(item => item.paramDirection = "1")
      this.tableData.push(...data)
      this.tableData = unduplicated(setParamOrder(this.tableData), "paramKey")
      return
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
        if (["D4bAction", "D5SelfAction", "D5LinkAction", 'getFlowNumAction'].includes(data.actionType)  && data.compositeId) {
          const compositeId = data.compositeId
          const conf = data.conf.find(item => {
            return item.name === 'actionSeq'
          })
          // if (!this.compositeIdMapToParamList[compositeId]) {
          prev[compositeId] = {
            svcId: data.actionOwnId,
            svcNm: data.actionName,
            actionSeq: conf?.value || '',
            actionType: data.actionType,
            paramList: [],
          }
          
          // }
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
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_set_cache_attr {
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
}
</style>
