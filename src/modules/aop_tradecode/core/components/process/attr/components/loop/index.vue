<template>
  <div class="aop_tradecode_comps_design_attr_loop_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>循环组件</div>
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
              循环集合：
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
              <el-select :disabled="!canSave" @change="handleSelectOption" v-model="formData.loopList" size="mini" placeholder="请选择循环集合">
                <el-option
                  v-for="item in loopListOptions"
                  :key="item"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
              <!-- :disabled="!(tableData.length > 0)" -->
              <div class="attr_pre_title_b required bold">输入参数</div>
              <div class="attr_show_item_b">
                <i class="el-icon-more" style="cursor: pointer; margin-right: 10px;" @click="switchTableMode('inputAtSetting')"></i>
                <el-button
                  v-if="canSave"
                  type="primary"
                  size="mini"
                  :disabled="!formData.loopList"
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
                :rowK="'paramMappingKey'"
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
              <div class="attr_pre_title_b bold">输出参数</div>
            </div>
            <i class="el-icon-more" style="cursor: pointer; margin-right: 10px;" @click="swichShowOutput('inputAtSetting')"></i>

            <!-- <el-button
              v-if="canSave"
              type="primary"
              size="mini"
              @click="showDialog('noSource')"
              >添加</el-button
            > -->
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
          <div v-if="canSave" class="table_tips">
            <p class="title">loopOutputList设置说明：</p>
            <p>1.点击【添加】按钮，可从循环组件内的L5服务中选择参数添加，此时loopOutputList无来源值；</p>
            <p>2.点击【设置】按钮，可从循环组件内的L5服务中选择List类型的参数作为输出，此时loopOutputList的来源值为对应的List类型参数。</p>
            <!-- <el-tag type="warning">
              <p class="title">loopOutputList设置说明：</p>
              <p>1.点击【添加】按钮，可从循环组件内的L5服务中选择参数添加，此时loopOutputList无来源值；</p>
              <p>2.点击【设置】按钮，可从循环组件内的L5服务中选择List类型的参数作为输出，此时loopOutputList的来源值为对应的List类型参数。</p>
            </el-tag> -->
          </div>
        </div>
        <div class="transition_arrange">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">交易编排</div>
              <!-- <el-button
                v-if="canSave"
                type="primary"
                size="mini"
                @click="saveServiceCpnParams"
              >保存</el-button> -->
              <div class="attr_show_item_b">
                <el-button
                  v-if="canSave"
                  type="primary"
                  size="mini"
                  @click="addOutputTargetLine"
                >添加一行</el-button>
              </div>

            </div>
          </div>

          <div class="attr_recive mb20">
            <div class="attr_show_item_c">


              <!-- <div v-if="!executionSteps.length" class="empty_execution_step">暂无执行规则</div>
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
              /> -->
              <Table
                class="table"
                :data="outputTargetList"
                :table="outputTargetColumn"
                @operate="outputTargetOperate"
                @selectChange="outputTargetSelectChange"
              ></Table>

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
          <div class="attr_show_item">
            <div class="attr_show_item_t textLeft">
              循环集合来源：<span class="attr_show_item_i">{{
                getLoopListText("loopListSource")
              }}</span>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t textLeft">
              循环集合：<span class="attr_show_item_i">{{
                getLoopListText("loopList")
              }}</span>
            </div>
          </div>
        </div>
        <div class="transition_arrange">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">输入参数</div>
              <div class="attr_show_item_b">
                <i class="el-icon-more" style="cursor: pointer; margin-right: 10px;" @click="switchTableMode('inputAtSetting')"></i>
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
        <div class="output_table read">
          <div class="table_header">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">输出参数</div>

            </div>
            <i class="el-icon-more" style="cursor: pointer; margin-right: 10px;" @click="swichShowOutput('inputAtSetting')"></i>

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
              <div class="attr_pre_title_b bold">交易编排</div>
            </div>
          </div>

          <div class="attr_recive mb20">
            <div class="attr_show_item_c">


              <!-- <div v-if="!executionSteps.length" class="empty_execution_step">暂无执行规则</div>
              <conditionalBranch
                v-else
                v-for="(item, index) in executionSteps"
                :key="index"
                :ref="'conditionalBranch' + index"
                :compSeqNo="index"
                :sequence="index + 1"
                :fourRAttrFlag="fourRAttrFlag"
                :isRead="true"
                :baseBranchInfo="item"
                :currentCompInfo="currentCompInfo" 
                :currentServObj="currentServObj"
                :isComponent="true"
                :allSelections="allSelections"
                @operate="selectOperate"
                @compDel="compDel"
              /> -->
              <Table
                class="table"
                :data="outputTargetList"
                :table="outputTargetColumn"
                @operate="outputTargetOperate"
                @selectChange="outputTargetSelectChange"
              ></Table>

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
import SelectParams2 from "../set_cache/components/selectParams"
import { unduplicated } from "@m/utils/array";
import { reList, mixList, setParamOrder, packageParamKey } from "@m/utils/paramTree";
import { sourceActionType, actionTypeToApSource, actionNameToNoActionId } from "@m/utils/normalData";
import conditionalBranch from "@m/core/components/service_design/components/ConditionalBranch"

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
        actionDesc: "循环组件",
        actionMsg: "",
        loopListSource: "",
        loopList: "",
        // paramList: "[]"
      },
      // loopListSourceOptions: [],
      // loopListOptions: [],
      paramList: [],
      // 输出数据
      tableData: [],
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
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索参数名称、中文名或描述",
          style: {
            width: "260px",
          },
        },
        // {
        //   type: "select",
        //   model: "clsfId",
        //   placeholder: "所属分类",
        //   select: [],
        //   filterable: true,
        // },
        {
          type: "select",
          model: "dictType",
          placeholder: "参数类型",
          select: [
            { type: "String", value: "String" },
            { type: "List", value: "List" },
            { type: "boolean", value: "boolean" },
            { type: "char", value: "char" },
            { type: "int", value: "int" },
            { type: "byte", value: "byte" },
            { type: "short", value: "short" },
            { type: "long", value: "long" },
            { type: "float", value: "float" },
            { type: "double", value: "double" },
            { type: "Boolean", value: "Boolean" },
            { type: "Character", value: "Character" },
            { type: "Integer", value: "Integer" },
            { type: "Byte", value: "Byte" },
            { type: "Short", value: "Short" },
            { type: "Long", value: "Long" },
            { type: "Float", value: "Float" },
            { type: "Double", value: "Double" },
            { type: "BigDecimal", value: "BigDecimal" },
            { type: "Object", value: "Object" },
          ],
        },
      ],
      // 输入输出参数弹框的搜索表单
      formInline: {
        content: "",
        clsfId: "",
        dictType: "",
      },
      // 选择参数分页器
      dicPager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      // 字典参数
      // 添加参数列表参数
      dictListTables: [
        {
          prop: "paramKey",
          label: "参数Key",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramCName",
          label: "参数名称",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramType",
          label: "参数值类型",
          width: "90",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramLength",
          label: "参数长度",
          width: "90",
          type: "text",
          tooltip: true,
        },
      ],
      // 输入输出参数弹框列表数据
      dictList: [],
      // 输入输出参数弹框选择类型下拉框数据
      dictGategList: [],
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索参数名称、中文名或描述",
          style: {
            width: "260px",
          },
        },
        // {
        //   type: "select",
        //   model: "clsfId",
        //   placeholder: "所属分类",
        //   select: [],
        //   filterable: true,
        // },
        {
          type: "select",
          model: "dictType",
          placeholder: "参数类型",
          select: [
            { type: "String", value: "String" },
            { type: "List", value: "List" },
            { type: "boolean", value: "boolean" },
            { type: "char", value: "char" },
            { type: "int", value: "int" },
            { type: "byte", value: "byte" },
            { type: "short", value: "short" },
            { type: "long", value: "long" },
            { type: "float", value: "float" },
            { type: "double", value: "double" },
            { type: "Boolean", value: "Boolean" },
            { type: "Character", value: "Character" },
            { type: "Integer", value: "Integer" },
            { type: "Byte", value: "Byte" },
            { type: "Short", value: "Short" },
            { type: "Long", value: "Long" },
            { type: "Float", value: "Float" },
            { type: "Double", value: "Double" },
            { type: "BigDecimal", value: "BigDecimal" },
            { type: "Object", value: "Object" },
          ],
        },
      ],
      // 当前数据
      isData: {},
      showAllInputParamsAtSetting: false,
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
      showOutput: false,
      currentCompInfo: {},
      executionSteps: [],
    };
  },
  computed: {
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
        ].filter(item => this.showAllInputParamsAtSetting || ["参数Key", "参数名称", '来源', '来源值', "操作"].includes(item.label));
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
    },
    loopListSourceOptions() {
      return Object.keys(this.compositeIdMapToParamList).reduce((prev, compositeId) => {
        if (compositeId != this.currentObj.compositeId) {
          console.log(this.compositeIdMapToParamList[compositeId], 'this.compositeIdMapToParamList[compositeId]')
          const value = this.compositeIdMapToParamList[compositeId]?.actionSeq ? `(${this.compositeIdMapToParamList[compositeId]?.actionSeq})` : ''
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
              const list = this.getDataList().reduce((prev, item) => {
                const actionSeq = item.conf.find(e => e.name == "actionSeq")?.value
                if (actionSeq && item.actionId != this.currentObj.actionId && !["containerAction", "concurrentAction"].includes(item.actionType)) {
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
              return scope.row.paraMapgNm || "设置"
            },
            operate: "set",
            tooltip: true,
          },
          {
            label: "操作",
            type: "button",
            // minWidth: "10%",
            width: "60",
            buttonList: (row) => {
              if (!row.paramParentId && row.paramKey == "loopOutputList") {
                return [
                  // {
                  //   desc: "设置",
                  //   operate: "set",
                  //   // relation: (scope, table) => {
                  //   //   return true
                  //   // }
                  // },
                  {
                    desc: "添加",
                    operate: "add",
                    // relation: (scope, table) => {
                    //   return true
                    // }
                  }
                ]
              } else {
                return [
                  {
                    desc: "删除",
                    operate: "delete",
                    relation: (scope, table) => {
                      const parentParam = this.cpnData?.paramList.find(item => item.paramOrder == scope.row.paramParentId)
                      return !["List", "Object"].includes(parentParam?.paramType) || parentParam.paramKey == "loopOutputList"
                    }
                  },
                ]
              }
            }
          },
        ].filter(item => this.showOutput || ["参数Key", "参数名称", '来源', '来源值', "操作"].includes(item.label));
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
              // return scope.row.actionName
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
        ].filter(item => this.showOutput || ["参数Key", "参数名称", '来源', '来源值', "操作"].includes(item.label));
      }
    }
  },
  inject: ["getDataList"],
  methods: {
    swichShowOutput() {
      this.showOutput = !this.showOutput
    },
    switchTableMode() {
      this.showAllInputParamsAtSetting = !this.showAllInputParamsAtSetting
    },
    handleSelectOption(e, status = true) {
      const temp = this.formData.loopList
      this.formData.loopList = e
      this.loopListOptions.forEach((item) => {
        if (item.value === e) {
          let obj = {
            ...item
          }
          this.initData(obj, this.tableData)
          if (status) {
            this.initParamKey(obj, this.tableData)
          }
          obj.paraMapgNm = obj.label
          const compositeId = this.formData.loopListSource
          obj.actionId = compositeId
          const data = this.loopListSourceOptions.find(item => item.value == compositeId)
          obj.actionName = data.label
          // this.loopOutputList[0] = obj
          // this.loopOutputList = [...this.loopOutputList]
          if (obj.serviceId === this.currentServObj.svcId) {
            obj.apSource = '00'
          } else {
            obj.apSource = '20'
          }
          // console.log(item.children, 'children')
          this.setActionId(obj.children, obj)
          if (!temp) {
            this.tableData = [obj, ...this.tableData]
          } else {
            this.tableData[0] = obj
          }
          this.tableData = JSON.parse(JSON.stringify(this.tableData))
          console.log(this.tableData[0])
        }
      })
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
    operateInput(operation, data) {
      console.log("operate", operation, data)
      if (operation == "delete") {
        const index = this.tableData.indexOf(data)
        this.tableData.splice(index, 1)
        this.tableData = setParamOrder(this.tableData)
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
    /**
     * 获取执行规则和异常信息
     */
    getBranchErrorList(list) {
      this.executionSteps = []
      
      if(list.length >0) {
        list.forEach(e => {
          if(e.condition.endActionType == '00') {
            this.executionSteps.push({
              ...e.condition,
              endActionNm: this.getDataList().find(k => k.compositeId == e.condition.endActionId).actionName,
              startActionNm: this.getDataList().find(k => k.compositeId == e.condition.startActionId).actionName
            })
          }
        })
      }
      
    },
    async getParams(e, obj) {
      console.log("getParams", e, obj);
      this.init()
      this.currentObj = e;
      this.currentCompInfo = {
        compositeId: e.compositeId,
        compositeName: e.actionName,
        compositeStepNo: e.conf.find((item) => item.name == 'actionSeq').value
      }
      // this.loopListOptions = obj.puApiParams.filter((item) => item.paramDirection == 0 && ["List"].includes(item.paramType));
      if (!e.compositeId) {
        e.conf.map((item) => {
          this.formData[item.name] = item.value;
        });
        this.getBranchErrorList(e.children)
        return;
      } else {
        // const params = {
        //   d4StusCd: "1",
        //   blngtoTyp: this.blngtoTyp,
        //   compositeId: e.compositeId || "",
        // };
        // const res = await this.rpc.d4.getServiceCpnParams(params);
        this.cpnData = e;
        this.getBranchErrorList(e.children)
        // this.executionSteps = e.interfaceProcessActionLayoutRelList.filter(item => item.endActionType == '00') || []
        if (e.paramList[0] && !e.paramList[0]?.children) {
          e.paramList[0].children = []
        }
        this.loopOutputList = reList(e.paramList.filter((item) => {
          return item.paramDirection === '1'
        }));
        this.loopOutputList = JSON.parse(JSON.stringify(this.loopOutputList))
        this.tableData = reList(e.paramList.filter((item) => {
          return item.paramDirection === '0'
        }));
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        e.confList.map((item) => {
          this.formData[item.confKey] = item.confValue;
        });
        let status = false
        for (let i = 0; i < this.tableData.length; i++) {
          const item = this.tableData[i];
          if (!status && item.paramMappingKey === this.formData.loopList) {
            // item.paramMappingKey = 
            status = true
          } else {
            item.deleteBtn = true
          }
        }
        if (this.formData.loopList) {
          this.$nextTick(() => {
            this.$nextTick(() => {
              this.handleSelectOption(this.formData.loopList, false)
            })
          })
        }
        // 更新实时位置序号
        ["actionSeq", "actionFrntSeq", "actionPostSeq"].forEach((key) => {
          this.formData[key] = this.getConfItem(key, e.actionId)?.value || ""
        })
        if (this.formData.loopListSource == "") this.formData.loopListSource = this.currentServObj?.svcId
        // await this.updateCompositeIdMapToParamList()
        const loopList = this.formData.loopList
        if (loopList && loopList != this.currentServObj?.svcId) {
          this.formData.loopList = ""
          await this.updateCompositeIdMapToParamList()
          this.formData.loopList = loopList
        }
        await this.getServiceArrangeList(e)
      }
      // this.querySameStartActionLayoutRel(e)
      if (!this.loopOutputList.length) {
        this.loopOutputList = [{
          actionId: "",
          actionName: "",
          paraMapgNm: "",
          paramMappingKey: "",
          apSource: "",
          paramKey: "loopOutputList",
          paramName: "输出集合",
          paramCName: "输出集合",
          paramType: "List",
          paramValueType: "List",
          paramDirection: "1",
          paramOrder: "1",
          paramParentId: "",
          isNeed: "1",
          children: []
        }]
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
        }
      })
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    },
    async saveParams() {
      if (!this.formData.actionDesc) {
        return this.$message.error("组件名称不能为空")
      } else if (!this.formData.loopListSource) {
        return this.$message.error("循环集合来源不能为空")
      } else if (!this.formData.loopList) {
        return this.$message.error("循环集合不能为空")
      }
      // if (!this.outputTargetList.length) {
      //   return this.$message.error("交易编排不能为空")
      // }
      // console.log(this.currentServObj.puApiParams);
      // const input = this.inputParamsListAtSetting.map((item) => {
      //   item.paramName = item.paramCName;
      //   return item;
      // });
      // console.log("数据-saveParams", this.inputParamsListAtSetting);
      // const output = this.outputParamsListAtSetting.map((item) => {
      //   item.paramName = item.paramCName;
      //   return item;
      // });
      // const loopList = this.loopListAtSetting.map((item) => {
      //   item.paramName = item.paramCName;
      //   return item;
      // });
      // this.paramList = mixList(input, "children").concat(
      //   mixList(output, "children")
      // ).concat(mixList(loopList, "children"));
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
      tfrCdtnCd.forEach((item) => {
        if (item.actionNm == "当前4b交易") item.actionId = ""
      })
      const layoutServiceBeanList = {
        svcId: this.currentObj.actionOwnId,
        actionKey: "",
        actionId: this.currentObj.compositeId,
        actionNm: this.currentObj.actionName,
        actionTyp: "5",
        loSeqNo: "",
        frntLoSeqNo: "",
        postLoSeqNo: "",
        tranId: this.currentServObj?.svcId,
        tfrCdtnCd: JSON.stringify(tfrCdtnCd),
        layoutActionList: []
      }
      const confList = this.cpnData.confList || [];
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
          // const res = await this.rpc.d4.getServiceCpnParams({
          //   d4StusCd: "1",
          //   blngtoTyp: "11",
          //   compositeId: compositeId,
          // })
          item.paramList = this.cpnData.paramList
        }
      }
      // if (compositeId && apiId && !(this.compositeIdMapToParamList[compositeId]?.paramList?.length)) {
      //   const res = await this.rpc.d4.queryL5ParamAndRuleDefinitions({
      //     d4StusCd: "1",
      //     blngtoTyp: "10",
      //     apiId: apiId,
      //     d4bApiId: this.currentServObj?.svcId
      //   })
      //   this.compositeIdMapToParamList[compositeId].paramList = res.paramList.filter((item) => item.paramDirection == 1)
      // }
    },
    // 获取conf配置项
    getConfItem(name, actionId) {
      const dataList = this.currentParentCpnInfo?.dataList || this.getDataList()
      const cpn = dataList.find(data => data.actionId == actionId)
      return cpn?.conf.find(item => item.name == name) || {}
    },
    // 输出目标-增加行
    addOutputTargetLine() {
      console.log("addOutputTargetLine", this.currentObj)
      const row = JSON.parse(JSON.stringify(this.layoutActionList[0] || {}))
      row.svcId = row.svcId || this.currentObj.svcId
      row.tranId = row.tranId || this.currentServObj?.svcId
      row.actionId = this.currentObj.compositeId
      row.actionNm = this.currentObj.actionName
      row.postLoSeqNo = ""
      row.actionPostSeq = ""
      row.paramKey = ""
      row.paramNm = ""
      row.condTyp = "="
      row.paramValue = ""
      this.outputTargetList.push(row)
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList))
    },
    outputTargetOperate(operation, data) {
      console.log("outputTargetOperate", operation, data)
      if (operation == "paramNm") {
        this.$refs.selectOutputFieldRef.showDialog(data, this.formData, "actionId", this.cpnData)
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
      if (type == "paramNm") {
        target.paramKey = obj.paramKey
        target.paramNm = obj.paramCName || obj.paramName
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
    showDialog(key) {
      this.$refs.selectParamsRef.showDialog(key, this.tableData[0]);
    },
    showDialog2() {
      this.$refs.selectParamsRef2.showDialog();
    },
    setDataSource(data) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        item.actionName = '当前循环组件'
        item.apSource = '40'
        item.actionId = this.currentObj.compositeId
        if (item.children && item.children.length) {
          this.setDataSource(item.children)
        }
      }
    },
    confirm(key, data) {
      console.log("confirm", key, data);
      const item = this.loopOutputList[0] || {}
      if (data[0].isLoop) {
        this.setDataSource(data)
      }
      if (key == "noSource") {
        if (item.actionId && item.actionName) {
          item.actionId = item.actionName = item.paraMapgNm = item.paramMappingKey = item.apSource = ""
          item.children = []
        }
        data.forEach(item => item.paramDirection = "1")
        item?.children?.push(...data);
      } else if (key == "source") {
        const children = data[0]?.children || []
        children.forEach(child => child.paramDirection = "1")
        const { actionId, actionName, paraMapgNm, paramMappingKey, apSource } = data[0]
        item.actionId = actionId
        item.actionName = actionName
        item.paraMapgNm = paraMapgNm
        item.paramMappingKey = paramMappingKey
        item.apSource = apSource
        // item?.children?.push(...children);
        item.children = children;
      }
      item.children = unduplicated(item?.children || [], "paramKey")
      this.loopOutputList = JSON.parse(JSON.stringify(this.loopOutputList))
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
     * 查询编排关系
     */
    async querySameStartActionLayoutRel(e) {
      const infaceInfo = await this.rpc.d4.querySameStartActionLayoutRel({tranId: this.currentServObj.apiId || this.currentServObj?.svcId,startActionId: e.compositeId})
      this.executionSteps = infaceInfo.interfaceProcessActionLayoutRelList.filter(item => item.endActionType == '00') || []
    }
    
  },
  created() {
    // this.currentSe      rvObj?.svcId = this.$route.query.transId || this.$route.query.apiId
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

  .empty_execution_step {
    color:  #909399;
    line-height: 60px;
    text-align: center;
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
