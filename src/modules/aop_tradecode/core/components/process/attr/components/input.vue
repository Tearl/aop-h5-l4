<template>
  <div class="aop_tradecode_comps_design_attr_input_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>input</div>
      </div>
      <div class="attr_box">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t">组件名称：<span v-if="!canSave" class="attr_show_item_i">{{formData.actionDesc}}</span></div>
            <div class="attr_show_item_c" v-if="canSave">
              <el-input
                disabled
                v-model="formData.actionDesc"
                size="mini"
                placeholder="请输入"
              ></el-input>
            </div>
          </div>
          <!-- <div class="attr_show_item">
            <div class="attr_show_item_t">组件描述：<span v-if="!canSave" class="attr_show_item_i">{{formData.actionMsg}}</span></div>
            <div class="attr_show_item_c" v-if="canSave">
              <el-input
                :disabled="!canSave"
                type="textarea"
                v-model="formData.actionMsg"
                placeholder="组件描述"
                size="mini"
              ></el-input>
            </div>
          </div> -->
          <div class="attr_send">
            <div class="attr_pre_title">
              <div class="attr_pre_title_b bold">输入参数</div>
            </div>
            <div class="attr_show_item_c">
              <Table
                class="attr_innerTable"
                :data="tableData"
                :table="tableColumn"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
              ></Table>
            </div>
          </div>
          <div v-if="!isRead">
            <div class="tips_info" v-if="!canSave">
              <el-tag type="warning">保存交易编排后，可对组件信息进行编辑</el-tag>
            </div>
          </div>
        </div>
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">执行规则</div>
              <!-- <el-button
              v-if="canSave"
              type="primary"
              size="mini"
              @click="addOutputTargetLine"
            >添加一行</el-button> -->
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
            :allSelections="allSelections"
            @operate="selectOperate"
            @compDel="compDel"
          />

          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">异常处理</div>
              <!-- <button class="allocBtn" @click="addErrorStep" v-show="!errorSteps.length">
                    <div class="icon" />
                    <span>添加异常</span>
                </button> -->
                <el-button
                icon="el-icon-plus"
                v-show="canSave && !errorSteps.length"
                type="primary"
                size="small"
                @click="addErrorStep"
              >添加异常</el-button>
            </div>

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

          <!-- <div class="attr_recive mb20">
            <div class="attr_show_item_c">
              <Table
                class="table"
                :data="outputTargetList"
                :table="outputTargetColumn"
                @operate="outputTargetOperate"
                @selectChange="outputTargetSelectChange"
              ></Table>

            </div>
          </div> -->
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
    </div>
  <selectListParams ref="selectListParams" @confirm="handleSetData"></selectListParams>

  <!-- 输出目标-选择输出字段 -->
    <SelectOutputField
      ref="selectOutputFieldRef"
      :currentServObj="currentServObj"
      @setOutputTarget="setOutputTarget"
    ></SelectOutputField>

  </div>
</template>

<script>
import selectListParams from './selectListParams'
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import { mixList, reList } from "@m/utils/paramTree";
import conditionalBranch from "@m/core/components/service_design/components/ConditionalBranch"
import { sourceActionType, actionTypeToApSource, actionNameToNoActionId, actionTypToArrangeEnum } from "@m/utils/normalData";
import throwError from "@m/core/components/service_design/components/ThrowError"
import SelectOutputField from "./service_setting/selectOutputField"

export default {
  mixins: [mixin],
  components: {
    Table,
    selectListParams,
    conditionalBranch,
    throwError,
    SelectOutputField
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
    showTips: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {
      // input组件编辑
      formData: {
        actionDesc: "input",
        actionMsg: "",

      },
      tableData: [],
      tableColumn: [
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
          // minWidth: "15%",
          width: "70",
          type: "text",
          tooltip: true,
        },
        // {
        //   // prop: "apSource", // 当前4b交易00 S5服务20
        //   prop: "actionId",
        //   label: "来源",
        //   minWidth: "30%",
        //   type: "text",
        //   placeholder: "请选择",
        //   inputStyle: {
        //     cursor: "pointer",
        //   },
        //   filter: (scope) => {
        //     if (scope.row.actionId && this.svcIdToSvcNm[scope.row.actionId]) {
        //       return this.svcIdToSvcNm[scope.row.actionId]
        //     } else {
        //       return ""
        //     }
        //   },
        //   // disabled: (scope) => {
        //   //   return scope.row.paramParentId != this.bodyOutData?.paramOrder
        //   // }
        // },
        // {
        //   prop: "paraMapgNm",
        //   label: "来源值",
        //   minWidth: "30%",
        //   type: "text",
        //   placeholder: "请选择",
        //   inputStyle: {
        //     cursor: "pointer",
        //   },
        //   // disabled: (scope) => {
        //   //   return scope.row.paramParentId != this.bodyOutData?.paramOrder
        //   // }
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
          tooltip: true,
        },
      ],
      currentObj: {},
      cpnData: {},
      cpnParamsRecord: {},
      actionIdRecord: "",
      svcIdToSvcNm: {},
      transId: "",
      outputTargetList: [],
      target: {},
      puApiList: {}, //
      currentCompInfo: {},
      executionSteps: [],
      errorSteps: []
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
            type: "input",
            placeholder: "请输入",
            operate: 'paramValue',
            disabled: (scope) => ["List", "Object"].includes(scope.row.paramType),
            filter(scope) {
              return scope.row.paramValueNm || scope.row.paramValue || "选择"
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
              // if (this.confFormData.errorCode) {    
              //   list.push({type: '异常组件', value: 'EX001'})
              // }
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
    blngtoTyp() {
      return this.currentServObj.apiServiceType.indexOf("D4") > -1 ? "10" : "11"
    },
    // 是否修改过组件的参数
    hasChangeCpnParams() {
      return this.cpnParamsRecord != JSON.stringify(this.formData) && this.actionIdRecord == this.currentObj.actionId
    },
    canSave() {
      return !this.isRead && this.currentObj.compositeId
    },
  },
  inject: ["getDataList"],
  methods: {
    handleSetData(data) {
      console.log(data, 'data')
      // console.
      // this.target 
      const target = this.target
      target.paramKey = data.paramKey
      target.paramNm = data.paramCName
      target.paramType = data.paramType
      if (["List", "Object"].includes(target.paramType)) {
        target.paramValue = "null"
        target.condTyp = "="
      }
      this.outputTargetList = [...this.outputTargetList]
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
        this.$refs.selectOutputFieldRef.showDialog(data, this.formData, 'paramValueSrcActionId')
      }
    },
    // 输出目标-增加行
    addOutputTargetLine() {
      console.log("addOutputTargetLine", this.currentObj)
      const row = {}
      row.svcId = this.currentObj.svcId
      row.tranId = this.currentServObj?.svcId
      row.actionId = this.currentServObj?.svcId
      row.actionNm = '当前4b交易'
      row.postLoSeqNo = ""
      row.actionPostSeq = ""
      row.paramKey = ""
      row.paramNm = ""
      row.condTyp = "="
      row.paramValueNm = ""
      row.paramValueSrcActionId = '10'
      row.paramValueSrcType = '10'
      row.paramKeySrcType = '00'
          // actionId: item.actionNm == "当前4b交易" ? this.currentServObj?.svcId : item.actionId,
          // actionNm: item.actionNm,
          // paramKey: item.paramKey,
          // paramNm: item.paramNm,
          // paramType: item.paramType,
          // condTyp: item.condTyp,
          // paramValue: item.paramValue,
          // actionPostSeq: item.actionPostSeq,
          // paramValueSrcActionId: item.paramValueSrcType === '10' ? '10' : item.paramValueSrcActionId,
          // paramValueNm: item.paramValueNm,
          // paramValueType: item.paramValueType,
          // paramKeySrcType: item.paramKeySrcType,
          // paramValueSrcType: item.paramValueSrcType,
      this.outputTargetList.push(row)
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    },
    // 查询新的执行规则
    async querySameStartActionLayoutRel(e) {
      const { interfaceProcessActionLayoutRelList } = await this.rpc.d4.querySameStartActionLayoutRel({tranId: this.currentServObj?.svcId,startActionId: e.compositeId})
      this.executionSteps = interfaceProcessActionLayoutRelList.filter(item => item.endActionType == '00') || []
      this.errorSteps = interfaceProcessActionLayoutRelList.filter(item => item.endActionType == '01') || []
    },
    // 查询编排列表
    async getServiceArrangeList(e) {
      console.log("getServiceArrangeList", e, this.currentServObj)
      const res = await this.rpc.d4.getServiceArrangeList({
        svcId: this.currentServObj?.svcId,
        actionId: e.compositeId,
        // parentActionId:
      })
      this.layoutActionList = res.layoutActionList
      const tfrCdtnCd = JSON.parse(res.layoutActionList[0]?.tfrCdtnCd || "[]")
      this.outputTargetList = tfrCdtnCd.map(item => {
        return {
          actionId: item.actionId,
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
      })
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
      
    },
  // 获取conf配置项
    getConfItem(name, actionId) {
      const dataList = this.currentParentCpnInfo?.dataList || this.getDataList()
      const cpn = dataList.find(data => data.actionId == actionId)
      return cpn?.conf.find(item => item.name == name) || {}
    },
    async getParams(e, obj) {
      console.log("getParams", e, obj,this.currentServObj);
      this.currentCompInfo = {
          compositeId: e.compositeId,
          compositeName: e.actionName,
          compositeStepNo: e.conf.find((item) => item.name == 'actionSeq').value
        }
      this.currentObj = e
      if (!e.compositeId) {
        e.conf.map((item) => {
          this.formData[item.name] = item.value;
        });
        console.log("getD4bServiceInfo", res, obj)

        await this.getServiceArrangeList(e)
        this.getBranchErrorList(e.children)
        // await this.querySameStartActionLayoutRel(e)
        return;
      } else {
        const res = await this.rpc.d4.getD4bServiceInfo({
          svcId: this.currentServObj?.svcId || obj.apiId,
          dsgnFlg: "1",
        });
        console.log("getD4bServiceInfo", res, obj)

        // 更新实时位置序号
        // ["actionSeq", "actionFrntSeq", "actionPostSeq"].forEach((key) => {
        //   this.formData[key] = this.getConfItem(key, e.actionId)?.value || ""
        // })
        let arr = ["actionSeq", "actionFrntSeq", "actionPostSeq"]
        arr.forEach((key) => {
          this.formData[key] = this.getConfItem(key, e.actionId)?.value || ""
        })

        // const confList = res.flow[0]
        // confList.conf.map((item) => {
        //   this.formData[item.name] = item.value;
        // });
        e.confList.map(item => {
          this.formData[item.confKey] = item.confValue
        })
        console.log(this.formData, 'formData', "res.flow")
        const paramsList = e.paramList.filter((param) => {
          if (param.paramDirection == 0) {
            // param.apSource = param.apSource || "00"
            // param.actionName = param.actionName || "当前4b交易"
            // param.paramMappingKey = param.paramMappingKey || param.paramKey
            // param.paraMapgNm = param.paraMapgNm || param.paramCName
            // param.actionId = param.actionId || this.currentServObj?.svcId
            return true
          }
        })
        this.tableData = reList(paramsList);
        this.setCpnParamsRecord()
        await this.getServiceArrangeList(e)
        this.getBranchErrorList(e.children)
        // await this.querySameStartActionLayoutRel(e)
      }

    },

    /**
     * 获取执行规则和异常信息
     */
    getBranchErrorList(list) {
      this.executionSteps = []
      this.errorSteps = []
      if(list.length >0) {
        list.forEach(e => {
          this.executionSteps.push(e.condition)

          if(e.condition.exceptionActionInfo && e.condition.exceptionActionInfo.actionId) {
            this.errorSteps.push(e.condition.exceptionActionInfo)
          }
        })
      }
      
    },
    async saveParams() {
      const paramList = JSON.parse(
        JSON.stringify(
          mixList(this.tableData, "children")
        )
      );
      
      const tfrCdtnCd = this.outputTargetList.reduce((prev, item) => {
        prev.push(item)
        return prev
      }, [])
      // if (tfrCdtnCd.length) {
      //   const keyToErrorMessage = {
      //     actionId: "来源不能为空",
      //     paramKey: "返回字段不能为空",
      //     paramNm: "返回字段不能为空",
      //     condTyp: "对比关系不能为空",
      //     paramValue: "对比值不能为空",
      //     actionPostSeq: "后续顺序号不能为空",
      //   }
      //   for (let key in keyToErrorMessage) {
      //     if (tfrCdtnCd.some(item => !item[key])) return this.$message.error(keyToErrorMessage[key])
      //   }
      // }
      if(this.errorSteps.length) {
        const keyToErrorMessage = {
          actionId: "来源不能为空",
          paramKey: "来源值不能为空",
          condTyp: "对比关系不能为空",
          paramValueSrcActionId: "对比来源不能为空",
          paramValue: "对比来源值不能为空",
          endActionId: '请选择异常信息'
        }
        let errorRef = this.$refs['throwError0']
        let errorData = errorRef[0].dataOutput()
        console.log(errorData, 'errorData=====')
        let list = JSON.parse(errorData.executeConditionJson)
        for (let key in keyToErrorMessage) {
          if (list.some(item => !item[key])) return this.$message.error(keyToErrorMessage[key])
        }
        if(!errorData.endActionId) {
          return this.$message.error(keyToErrorMessage['endActionId'])
        }
      }
      
      const e = this.currentServObj
      const layoutServiceBeanList = {
        svcId: this.currentObj.actionOwnId,
        actionKey: "",
        actionId: this.currentObj.compositeId,
        actionNm: this.currentObj.actionName,
        actionTyp: actionTypToArrangeEnum['inputAction'],
        loSeqNo: "",
        frntLoSeqNo: "",
        postLoSeqNo: "",
        tranId: this.currentServObj?.svcId,
        tfrCdtnCd: JSON.stringify(tfrCdtnCd),
        layoutActionList: []
      }
      const confList = this.cpnData.confList || []
      for (let i in this.formData)  {
        const target = confList.find(item => item.confKey == i)
        if (target) {
          target.confValue = this.formData[i]
        } else {
          confList.push({
            confKey: i,
            confValue: this.formData[i],
            confId: "",
            confDescr: "",
            compositeId: e?.compositeId || "",
          })
        }
      }
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: this.fourRAttrFlag ? this.currentParentCpnInfo.compositeId : this.currentServObj.apiId,
        paramList,
        confList,
        compositeId: this.currentObj.compositeId || ""
      }
      const { compositeId } = await this.rpc.d4.saveServiceCpnParams(params)
      params.compositeId = compositeId
      this.rpc.s4design.addFuntionJobCommitFlow({
        fnctId: this.$route.query.fnctId,
        jobTpCd: 'C4',
      })
      this.commitSameStartActionLayoutRel()
      this.setCpnParamsRecord()
      this.$emit("upDateServParams", JSON.parse(JSON.stringify(this.currentObj)), params, layoutServiceBeanList);
    },
    setCpnParamsRecord() {
      this.cpnParamsRecord = JSON.stringify(this.formData)
      this.actionIdRecord = this.currentObj.actionId
    },
    init() {
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
      this.svcIdToSvcNm = this.getDataList().reduce((prev, data) => {
        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType)  && data.compositeId) {
          prev[data.compositeId] = data.actionName
        }
        return prev
      }, { [this.currentServObj?.svcId]: "当前4b交易" })
    },
    addErrorStep() {
      this.errorSteps.push(
        {
          tranId: this.currentServObj?.svcId,
          startActionId: this.currentCompInfo?.compositeId,
          endActionId: '',
          interfaceProcessActionLayoutRelList: '[]'
        }
      )
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
    /**
     * 表格操作项
     */
    selectOperate(operate, info, index) {
      this.outputTargetOperate(operate, info, index)
    },
    /**异常删除 */
    errorDel(seqNo) {
      this.errorSteps.splice(seqNo, 1)
    },
    /**
     * 执行规则编排保存
     */
    commitSameStartActionLayoutRel() {
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
        let errorRef = this.$refs['throwError0']
        let errorData = errorRef[0].dataOutput()
        list.push({
          ...errorData,
          priorityLevel: this.executionSteps.length + 1
        })
      }
      console.log(list, 'commitSameStartActionLayoutRel----')
      this.rpc.d4.commitSameStartActionLayoutRel({
        tranId: this.currentServObj?.svcId,
        startActionId: this.currentCompInfo?.compositeId,
        interfaceProcessActionLayoutRelList: list
      })
    },
  },
  async created() {
    // console.log(this.currentServObj.puApiParams, "aaaaaaa")
    // this.puApiList = JSON.parse(
    //     JSON.stringify(
    //       reList(mixList(this.currentServObj.puApiParams, "children"))
    //     )
    // ).filter((item) => {
    //   return item.paramDirection === '0'
    // });
    this.init()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_input_attr {
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
  .empty_execution_step {
    color:  #909399;
    line-height: 60px;
    text-align: center;
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
