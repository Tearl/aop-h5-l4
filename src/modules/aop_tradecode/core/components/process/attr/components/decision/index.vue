<template>
  <div class="aop_tradecode_comps_design_attr_service">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>
          <span>决策信息</span>
          <!-- <el-button
            v-if="!isRead"
            class="btn"
            type="primary"
            size="mini"
            @click="resetParamList"
          >重置参数</el-button> -->
        </div>
      </div>
      <!-- <div class="attr_tabs">
        <el-tabs v-model="d4bActive" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in d4bInfoTabsList"
            :label="item.v"
            :name="item.k"
            :key="index"
          ></el-tab-pane>
        </el-tabs>
      </div> -->

      <!-- 设置 -->
      <!-- <div class="attr_box mt10" v-show="d4bActive == 'setting'">
        <div class="attr_show underLine">
          <div class="attr_show_item flex">
            <div class="item_title w68">前序位置ID：</div>
            <div class="item_value text">{{ getActionFrntSeq() }}</div>
          </div>
        </div>

        <div class="attr_send">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b">输入参数</div>
            <el-checkbox v-model="isNeedCheck" @change="isNeedChange">非必输项</el-checkbox>
            <el-checkbox v-model="headerCheck">非报文头</el-checkbox>
            <div class="attr_show_item_b">
              <i class="el-icon-more" @click="switchTableMode('inputAtSetting')"></i>
            </div>
          </div>
          <div class="attr_show_item_c" v-show="inputParamsVisibleAtSetting">
            <Table
              class="table"
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
              :rowClass="rowClass"
            ></Table>
          </div>
        </div>
        <div class="attr_recive">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b">输出参数</div>
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
        <div class="attr_recive mb20">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b">输出目标</div>
            <el-button
              v-if="!isRead"
              type="primary"
              size="mini"
              @click="addOutputTargetLine"
            >增加行</el-button>
          </div>
          <div class="attr_show_item_c">
            <Table
              class="table"
              :data="outputTargetList"
              :table="outputTargetColumn"
              @operate="outputTargetOperate"
            ></Table>
          </div>
        </div>
      </div> -->

      <!-- 决策信息 -->
      <div class="attr_box">
        <div class="base_info">
          <div class="attr_pre_title">
            <div class="attr_pre_title_b bold">基本信息</div>
          </div>
          <ul class="base_info_list">
            <li class="item">
              <span class="title">决策名称：</span>
              <span class="content">{{ formData.svcNm }}</span>
            </li>
            <li class="item">
              <span class="title">决策ID：</span>
              <span class="content">{{ formData.svcId }}</span>
            </li>
            <li class="item">
              <span class="title">决策类型：</span>
              <span class="content">{{ formData.svcTpCd }}</span>
            </li>
            <li class="item">
              <span class="title">决策描述：</span>
              <span class="content">{{ formData.svcDesc }}</span>
            </li>
          </ul>
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

        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t">业务规则</div>
            <!-- <div class="sub_title">业务规则表</div> -->
            <div v-if="ruleInfo.ruleUrl" class="attr_show_item_c">
              <el-image
                :src="ruleInfo.ruleUrl"
                fit="contain"
                :preview-src-list="[ruleInfo.ruleUrl]"
                @click="setBg"
              >
              </el-image>
              <!-- <RuleTable
                ref="ruleTableRef"
                :currentServObj="currentServObj"
                :pageType="'read'"
              ></RuleTable> -->
            </div>
          </div>

          <div class="attr_show_item border_bottom pb20">
            <div class="sub_title">业务规则说明：</div>
            <div class="attr_show_item_c">
              {{ ruleInfo.ruleComnt }}
            </div>
          </div>
        </div>

        <div class="transition_arrange">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">后续编排列表</div>
              <el-button
                v-if="canSave"
                type="primary"
                size="mini"
                @click="saveServiceCpnParams"
              >保存</el-button>
            </div>
          </div>

          <div class="attr_recive mb20">
            <!-- <div class="attr_pre_title">
              <div class="attr_pre_title_b">后续编排规则表</div>
              <span class="text_btn" v-if="!isRead" @click="addOutputTargetLine">增加行</span>
            </div> -->
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
              <!-- <span class="text_btn" v-if="!isRead" @click="addOutputTargetLine">增加行</span> -->
            </div>
            <div v-if="!isRead && !currentObj.actionParentId">
              <div class="tips_info" v-if="!canSave">
                <el-tag type="warning">保存交易编排后，可对组件信息进行编辑</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择临时参数 -->
    <!-- <SelectTempParams
      ref="tempParamsRef"
      :dataList="dataList"
      :currentServObj="currentServObj"
      :currentObj="currentObj"
      @setParaMapgNm="setParaMapgNm"
    ></SelectTempParams> -->

    <!-- 输出目标-选择输出字段 -->
    <SelectOutputField
      ref="selectOutputFieldRef"
      :currentServObj="currentServObj"
      @setOutputTarget="setOutputTarget"
    ></SelectOutputField>

    <!-- 输出目标-选择后序位置 -->
    <!-- <SelectOutputPostSeq
      ref="selectOutputPostSeqRef"
      :currentObj="currentObj"
      :currentServObj="currentServObj"
      @setOutputTarget="setOutputTarget"
    ></SelectOutputPostSeq> -->

    <!-- 拟态的下拉选择框 -->
    <SimulantSelect
      ref="simulantSelectRef"
      :currentServObj="currentServObj"
      :currentObj="currentObj"
      :currentParentCpnInfo="currentParentCpnInfo"
      :fourRAttrFlag="fourRAttrFlag"
      :serviceIdMapToParamList="serviceIdMapToParamList">
    </SimulantSelect>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table_workgate";
import SelectOutputField from "./selectOutputField"
// import SelectOutputPostSeq from "./service_setting/selectOutputPostSeq"
import SimulantSelect from "./simulantSelect"
import RuleTable from "@m/core/components/rule_table";
// import SelectTempParams from "./select_temp_params"
import { mixList, reList, packageParamKey } from "@m/utils/paramTree";
import filters from "@m/utils/filters";
import { sourceActionType, actionTypeToApSource, actionNameToNoActionId } from "@m/utils/normalData";

export default {
  mixins: [mixin],
  components: {
    Table,
    SelectOutputField,
    // SelectOutputPostSeq,
    RuleTable,
    // SelectTempParams,
    SimulantSelect,
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
      },
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
      showServInfoFlag: false
    };
  },
  computed: {
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
            prop: (row) => {
              if (row?.actionId == "constantValue") {
                return "paramMappingKey"
              } else {
                return "paraMapgNm"
              }
            },
            label: "来源值",
            minWidth: "30%",
            type: (row) => {
              if (row.actionId == "constantValue") {
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
          // {
          //   prop: "paramNm",
          //   label: "返回字段",
          //   minWidth: "25%",
          //   type: "select",
          //   selectVal: () => {
          //     return this.bodyOutData.map(item => {
          //       item.type = item.paramCName
          //       item.value = item.paramCName
          //       return item
          //     })
          //   },
          // },
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
            prop: "paramValue",
            label: "对比值",
            minWidth: "25%",
            type: "input",
            placeholder: "请输入",
            disabled: (scope) => ["List", "Object"].includes(scope.row.paramType)
            // tooltip: true,
          },
          // {
          //   prop: "actionPostSeq",
          //   label: "后续顺序号",
          //   minWidth: "30%",
          //   type: "textClick",
          //   align: "center",
          //   tooltip: true,
          //   operate: "actionPostSeq",
          //   filter(scope) {
          //     return scope.row.actionPostSeq || "选择"
          //   },
          // },
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
              const list = dataList.reduce((prev, item) => {
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
      return !this.isRead && this.currentObj.compositeId && !this.showServInfoFlag && !this.currentObj.actionParentId
    }
  },
  inject: ["getDataList", "setCurrentActionId"],
  methods: {
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
    async saveServiceCpnParams() {
      const e = this.currentObj
      let paramList = JSON.parse(JSON.stringify(mixList(this.inputParamsListAtSetting, "children").concat(mixList(this.outputParamsListAtSetting, "children"))))
      paramList.forEach((item) => {
        if (actionNameToNoActionId.includes(item.actionName)) {
          item.actionId = ""
        }
      })
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
      // const notMatchKeyItem = tfrCdtnCd.find(item => !item?.paramKey.includes(".") && item.paramKey != "loopOutputList" && !["设置会话组件", "获取会话组件", "文件上传组件"].includes(item.actionNm) && !item.actionNm.includes("赋值组件"))
      // if (notMatchKeyItem) return this.$message.error(`返回字段【${notMatchKeyItem.paramNm}】的参数格式有误，请重新设置`)
      tfrCdtnCd.forEach((item) => {
        if (item.actionNm == "当前4b交易") item.actionId = ""
      })
      const layoutServiceBeanList = {
        svcId: this.currentObj.actionOwnId,
        actionKey: "",
        actionId: this.currentObj.compositeId,
        actionNm: this.currentObj.actionName,
        actionTyp: "1",
        loSeqNo: "",
        frntLoSeqNo: "",
        postLoSeqNo: "",
        tranId: this.currentServObj?.svcId,
        tfrCdtnCd: JSON.stringify(tfrCdtnCd),
        layoutActionList: []
      }
      const confList = e.conf.map(item => {
        return {
          confKey: item.name,
          confValue: item.value,
          confId: "",
          confDescr: "",
          compositeId: e.compositeId || "",
        }
      })
      const params = {
        d4StusCd: "1",
        blngtoTyp: "10",
        // apiId: e.svcId || e.actionOwnId,
        apiId: this.fourRAttrFlag ? this.currentParentCpnInfo.compositeId : this.currentServObj.apiId,
        paramList,
        // layoutServiceBeanList,
        confList,
        compositeId: e.compositeId || ""
      }
      await this.rpc.transactionDesign.saveServiceCpnParams(params)
      this.rpc.s4design.addFuntionJobCommitFlow({
        fnctId: this.$route.query.fnctId,
        jobTpCd: 'C4',
      })
      this.setCpnParamsRecord()
      // this.upDateServParams(this.currentObj, paramList)
      this.$emit("upDateServParams", this.currentObj, paramList)
      this.$emit("updateServiceArrangeList", layoutServiceBeanList)
      // 更新完参数，调保存流程图接口
      // this.toSave(true)
    },
    // 输出目标-增加行
    addOutputTargetLine() {
      console.log("addOutputTargetLine", this.currentObj)
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
      this.outputTargetList.push(row)
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
      // this.outputTargetList.push({
      //   paramKey: "",
      //   paramNm: "",
      //   condTyp: "=",
      //   paramValue: "",
      //   actionPostSeq: "",
      //   tranId: this.currentServObj.apiId,
      //   svcId: this.currentObj.svcId,
      //   loSeqNo: this.currentObj.conf.find(item => item.name == "actionSeq")?.value,
      //   frntLoSeqNo: this.currentObj.conf.find(item => item.name == "actionFrntSeq")?.value,
      //   postLoSeqNo: this.currentObj.conf.find(item => item.name == "actionPostSeq")?.value,
      //   tfrCdtnCd: "",
      // })
    },
    outputTargetOperate(operation, data) {
      console.log("outputTargetOperate", operation, data)
      if (operation == "paramNm") {
        this.$refs.selectOutputFieldRef.showDialog(data, this.formData)
      } else if (operation == "actionPostSeq") {
        this.$refs.selectOutputPostSeqRef.showDialog(data)
      } else if (operation == "delete") {
        const index = this.outputTargetList.indexOf(data)
        this.outputTargetList.splice(index, 1)
      }
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
      }
    },
    setOutputTarget(type, target, obj) {
      console.log("setOutputTarget", type, target, obj, this.outputTargetList.indexOf(target))
      if (type == "paramNm") {
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
    async getD4bServiceInfo(data) {
      console.log("getD4bServiceInfo", data)
      const res = await this.rpc.transactionDesign.getD4bServiceInfo({
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
    // 获取服务组件的参数
    async getServiceCpnParams(e) {
      console.log("getServiceCpnParams", e)
      this.currentObj = e
      if (e.compositeId) {
        // const blngtoTyp = e.actionType.indexOf("D4") > -1 ? "10" : "11"
        const params = {
          d4StusCd: "1",
          blngtoTyp: "10",
          compositeId: e.compositeId || "",
          apiId: e.actionOwnId,
          d4bApiId: this.currentServObj.apiId || this.currentServObj?.svcId,
          bizDomainNo: this.currentServObj.bizLineId || this.currentServObj.beltLine || this.bizDomainNo,
        }
        const res = await this.rpc.transactionDesign.getServiceCpnParams(params)
        res.paramList.forEach(item => {
          if (item.apSource == "00") {
            item.actionName = "当前4b交易"
            item.actionId = this.currentServObj?.svcId
          } else if (item.apSource == "10") {
            item.actionId = "constantValue"
          }
        })
        this.inputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == "0"));
        this.outputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == "1"));
        // this.outputTargetList = res.layoutServiceBeanList.map(item => {
        //   const tfrCdtnCd = JSON.parse(item.tfrCdtnCd)
        //   item.paramKey = tfrCdtnCd.paramKey
        //   item.paramNm = tfrCdtnCd.paramNm
        //   item.condTyp = tfrCdtnCd.condTyp
        //   item.paramValue = tfrCdtnCd.paramValue
        //   item.actionPostSeq = tfrCdtnCd.actionPostSeq
        //   return item
        // })
        const ruleInfo = await this.rpc.transactionDesign.queryDecisionTreeParamAndRuleDefinitions(params)
        this.formData = ruleInfo
        // const iOutputList = reList(
        //   this.formData.paramList.filter((item) => item.paramDirection == 1)
        // ).filter(item => item.paramKey == "bodyOutData");
        // this.bodyOutData = iOutputList[0]?.children || []
        this.ruleInfo = ruleInfo
        const that = this.$refs.ruleTableRef
        if (that) that.setRuleInfo(ruleInfo)
        await this.getServiceArrangeList(e)
        this.setCpnParamsRecord()
        // this.showType = "d4bInfo"
        // this.d4bActive = "d4b"
      } else {
        this.getServiceCpnDefaultParams(e)
      }
    },
    async getServiceCpnDefaultParams(e) {
      console.log("getServiceCpnDefaultParams", e)
      this.currentObj = e
      let apiId = e.conf.find(item => item.name == "svcId").value
      // const blngtoTyp = e.actionType.indexOf("D4") > -1 ? "10" : "11"
      const params = {
        d4StusCd: "1",
        blngtoTyp: "10",
        apiId: apiId,
        d4bApiId: this.currentServObj.apiId || this.currentServObj?.svcId,
        bizDomainNo: this.currentServObj.bizLineId || this.currentServObj.beltLine || this.bizDomainNo,
      }
      const res = await this.rpc.transactionDesign.queryDecisionTreeParamAndRuleDefinitions(params)
      this.formData = res
      this.formData.svcId = apiId
      this.setInputAndOutputList(res.paramList)
      if (e.compositeId) {
        await this.getServiceArrangeList(e)
      }
      this.ruleInfo = res
      const that = this.$refs.ruleTableRef
      if (that) that.setRuleInfo(res)
      this.setCpnParamsRecord()
      // this.showType = "d4bInfo"
      // if(this.isRead) return this.d4bActive = "d4b"
    },
    async getBusinessRuleInfo() {
      this.ruleInfo = {}
      const params = {
        apiId: this.currentObj.actionOwnId,
      };
      const res = await this.rpc.transactionDesign.getBusinessRuleInfo(params);
      this.ruleInfo = res
      const that = this.$refs.ruleTableRef
      that.setRuleInfo(res)
    },
    // 查询编排列表
    async getServiceArrangeList(e) {
      console.log("getServiceArrangeList11", e, this.currentServObj)
      const res = await this.rpc.transactionDesign.getServiceArrangeList({
        svcId: this.currentServObj?.svcId,
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
        return {
          actionId: item.actionNm == "当前4b交易" ? this.currentServObj?.svcId : item.actionId,
          actionNm: item.actionNm,
          paramKey: item.paramKey,
          paramNm: item.paramNm,
          paramType: item.paramType,
          condTyp: item.condTyp,
          paramValue: item.paramValue,
          actionPostSeq: item.actionPostSeq,
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
        const res = await this.rpc.transactionDesign.queryDecisionTreeParamAndRuleDefinitions({
          d4StusCd: "1",
          blngtoTyp: "11",
          apiId: e.cpntId,
          d4bApiId: this.currentServObj.apiId || this.currentServObj?.svcId,
          bizDomainNo: this.currentServObj.bizLineId|| this.currentServObj.beltLine || this.bizDomainNo,
        })
        this.formData = res
        this.ruleInfo = res
        this.inputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == "0"));
        this.outputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == "1"));
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
          bizDomainNo: this.currentServObj.bizLineId || this.currentServObj.beltLine || this.bizDomainNo,
        }
        const res = await this.rpc.transactionDesign.queryDecisionTreeParamAndRuleDefinitions(params)
        this.setInputAndOutputList(res.paramList)
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
    async init(e, click) {
      this.showServInfoFlag = false
      this.inputParamsListAtSetting = []
      this.outputParamsListAtSetting = []
      this.outputTargetList = []
      // this.bodyOutData = []
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
      this.$nextTick(async () => {
        // 获取组件信息
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
    setBg(){
      this.$nextTick(() =>{
        let documentMask = document.querySelector(".el-image-viewer__mask")
        documentMask.style.backgroundColor = '#f5f7fa'
      })
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
    this.bizDomainNo = this.$route.query.beltLine || ""
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
    }
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
        width: 100%;
        margin-right: 10px;
        margin-bottom: 10px;
        font-weight: $font_weight_600;
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
      }
      .attr_show_item_c {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
}
</style>
