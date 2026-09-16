<template>
  <div class="aop_tradecode_comps_design_attr_loop_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>脱敏组件</div>
      </div>
      <div v-if="!isRead && !fourRAttrFlag" class="attr_box">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t required">组件名称：</div>
            <div class="attr_show_item_c">
              <el-input
                :disabled="!canSave"
                v-model="formData.actionDesc"
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">&nbsp;&nbsp;组件描述：</div>
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
        </div>
        <div class="transition_arrange">
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b required bold">输入参数</div>
              <div>
                <i
                  class="el-icon-more"
                  style="cursor: pointer; margin-right: 10px"
                  @click="switchTableMode('inputAtSetting')"
                ></i>
                <el-button
                  v-if="canSave"
                  type="primary"
                  size="mini"
                  @click="showDialog2"
                  >添加</el-button
                >
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
          <div class="attr_show">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b required bold">脱敏配置</div>
              <div>
                <el-button
                  v-if="canSave"
                  type="primary"
                  size="mini"
                  @click="showConfigParamList"
                  >添加</el-button
                >
              </div>
            </div>
          </div>
          <div class="attr_recive mb20">
            <div class="attr_show_item_c">
              <Table
                class="table input_list"
                :data="configList"
                :table="configColumn"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
                @operate="operateList"
              ></Table>
            </div>
          </div>
        </div>
        <div class="output_table">
          <div class="table_header">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">输出参数</div>
            </div>
            <div>
              <i
                class="el-icon-more"
                style="cursor: pointer; margin-right: 10px"
                @click="switchTableMode2()"
              ></i>
            </div>
          </div>
          <div class="attr_show_item_c">
            <Table
              class="table output_list"
              :data="outputList"
              :table="tableColumn2"
              :rowK="'paramId'"
              :rowKey="expandRowKeys"
              :treeProps="{ children: 'children' }"
              @operate="operate"
              :rowClass="rowClass"
            ></Table>
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
              <div class="attr_pre_title_b bold">输入参数</div>
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
        <div class="output_table read">
          <div class="table_header">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">输出参数</div>
            </div>
            <div>
              <i
                class="el-icon-more"
                style="cursor: pointer; margin-right: 10px"
                @click="switchTableMode2()"
              ></i>
            </div>
          </div>
          <div class="attr_show_item_c">
            <Table
              class="table output_list"
              :data="outputList"
              :table="tableColumn2"
              :rowK="'paramOrder'"
              :rowKey="expandRowKeys"
              :treeProps="{ children: 'children' }"
              @operate="operate"
              :rowClass="rowClass"
            ></Table>
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
    <addUserDefined ref="addUserDefined" selectType="" @saveParams="addParams"></addUserDefined>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import SelectOutputField from "../service_setting/selectOutputField";
import SelectParams from "./components/selectParams";
import SelectParams2 from "./components/selectParams2";
import SelectListParams from "./components/selectListParams";
import addUserDefined from "@m/core/components/download_design/page_big_data/addUserDefined";
import { unduplicated } from "@m/utils/array";
import {
  reList,
  mixList,
  setParamOrder,
  packageParamKey,
} from "@m/utils/paramTree";
import {
  sourceActionType,
  actionTypeToApSource,
  actionNameToNoActionId,
  actionTypToArrangeEnum,
} from "@m/utils/normalData";

import { setSessionStorage } from "@m/utils/localStorage";
export default {
  mixins: [mixin],
  components: {
    Table,
    SelectOutputField,
    SelectParams,
    SelectParams2,
    SelectListParams,
    addUserDefined,
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
      formData: {
        "actionSeq": '',
        "actionFrntSeq": '',
        "actionPostSeq": '',
        actionDesc: "",
        actionMsg: "",
        desensitizationConf: "",
      },
      paramList: [],
      currentObj: {},
      cpnData: {},
      // 设置页签下的输入参数表格数据
      inputParamsListAtSetting: [],
      // 设置页签下的输出参数表格数据
      outputParamsListAtSetting: [],
      cpnParamsRecord: {},
      actionIdRecord: "",
      // 选择参数弹框
      addVisible: false,
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      // 当前数据
      isData: {},
      // 已选参数数组
      tableData: [],
      selectionData: [],
      svcIdToSvcNm: {},
      transId: "",
      compositeIdMapToParamList: {},
      outputTargetList: [],
      layoutActionList: [],
      loopOutputList: [],
      expandRowKeys: ["1"],
      isRepeat: true,
      showAllInputParamsAtSetting: false,
      showAllOutputParamsAtSetting: false,
      configList: [],
      outputList: [],
      target: null,
    };
  },
  computed: {
    // {"key":"userNo","name": "用户","value": "userNoRel","desensitization":"USERNAME"},
    configColumn() {
      return [
        {
          prop: "key",
          label: "参数Key",
          minWidth: "25%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "name",
          label: "参数名称",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "desensitization",
          label: "脱敏类型",
          width: "130",
          // minWidth: "15%",
          type: "select",
          tooltip: true,
          selectVal: () => {
            return this.options
          },
        },
        {
          prop: "value",
          label: "脱敏参数映射key",
          width: "120",
          // minWidth: "15%",
          type: "textClick",
          tooltip: true,
          operate: 'addKey',
          filter(scope) {
            return scope.row.value || '请选择'
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
      ];
    },
    tableColumn() {
      if (this.canSave) {
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
              const { actionName, actionId } = scope.row;
              if (!actionName && !actionId) {
                return "";
              } else if (
                ["当前4b交易", "当前循环组件", "固定值"].includes(actionName)
              ) {
                return actionName;
              } else {
                const item = this.getDataList().find(
                  (data) => data.compositeId == actionId
                );
                if (item && actionName) {
                  const actionSeq = this.getConfItem(
                    "actionSeq",
                    item.actionId
                  ).value;
                  return `${actionName}(${actionSeq})`;
                }
              }
            },
          },
          {
            prop: (row) => {
              if (row?.actionId == "constantValue") {
                return "paramMappingKey";
              } else {
                return "paraMapgNm";
              }
            },
            label: "来源值",
            minWidth: "30%",
            type: "text",
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
                  return scope.row.deleteBtn;
                },
              },
            ],
          },
        ].filter(
          (item) =>
            this.showAllInputParamsAtSetting ||
            ["参数Key", "参数名称", "来源", "来源值", "操作"].includes(
              item.label
            )
        );
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
              const { actionName, actionId } = scope.row;
              if (!actionName && !actionId) {
                return "";
              } else if (
                ["当前4b交易", "当前循环组件", "固定值"].includes(actionName)
              ) {
                return actionName;
              } else {
                const item = this.getDataList().find(
                  (data) => data.compositeId == actionId
                );
                const actionSeq = this.getConfItem(
                  "actionSeq",
                  item.actionId
                ).value;
                return `${actionName}(${actionSeq})`;
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
                return scope.row.paramMappingKey;
              } else {
                return scope.row.paraMapgNm;
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
        ].filter(
          (item) =>
            this.showAllInputParamsAtSetting ||
            ["参数Key", "参数名称", "来源", "来源值", "操作"].includes(
              item.label
            )
        );
      }
    },
    tableColumn2() {
      if (this.canSave) {
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
              const { actionName, actionId } = scope.row;
              if (!actionName && !actionId) {
                return "";
              } else if (
                ["当前4b交易", "当前循环组件", "固定值"].includes(actionName)
              ) {
                return actionName;
              } else {
                const item = this.getDataList().find(
                  (data) => data.compositeId == actionId
                );
                if (item && actionName) {
                  const actionSeq = this.getConfItem(
                    "actionSeq",
                    item.actionId
                  ).value;
                  return `${actionName}(${actionSeq})`;
                }
              }
            },
          },
          {
            prop: (row) => {
              if (row?.actionId == "constantValue") {
                return "paramMappingKey";
              } else {
                return "paraMapgNm";
              }
            },
            label: "来源值",
            minWidth: "30%",
            type: "text",
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
        ].filter(
          (item) =>
            this.showAllOutputParamsAtSetting ||
            ["参数Key", "参数名称", "来源", "来源值", "操作"].includes(
              item.label
            )
        );
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
              const { actionName, actionId } = scope.row;
              if (!actionName && !actionId) {
                return "";
              } else if (
                ["当前4b交易", "当前循环组件", "固定值"].includes(actionName)
              ) {
                return actionName;
              } else {
                const item = this.getDataList().find(
                  (data) => data.compositeId == actionId
                );
                const actionSeq = this.getConfItem(
                  "actionSeq",
                  item.actionId
                ).value;
                return `${actionName}(${actionSeq})`;
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
                return scope.row.paramMappingKey;
              } else {
                return scope.row.paraMapgNm;
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
        ].filter(
          (item) =>
            this.showAllOutputParamsAtSetting ||
            ["参数Key", "参数名称", "来源", "来源值", "操作"].includes(
              item.label
            )
        );
      }
    },
    blngtoTyp() {
      return this.currentServObj.apiServiceType.indexOf("D4") > -1
        ? "10"
        : "11";
    },
    // 是否修改过组件的参数
    hasChangeCpnParams() {
      return false;
    },
    canSave() {
      return !this.isRead && this.currentObj.compositeId && !this.fourRAttrFlag;
    },
  },
  inject: ["getDataList"],
  methods: {
    addParams(list) {
      let param = list[0]
      if (param) {
        const paramKey = param.paramKey
        for (let i = 0; i < this.configList.length; i++) {
          const item = this.configList[i];
          if (item.value == paramKey) {
            this.$confirm("已有相同字段映射", "请确认", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
            })
            return 
          }
        }
        const children = this.outputList[0]?.children || []
        for (let i = 0; i < children.length; i++) {
          const item = children[i];
          if (item.paramKey === this.target.value) {
            children.splice(i, 1);
            break
          }
        }


        this.target.value = param.paramKey
        this.outputList[0].children.push(param)
        param.paramName = param.paramCName
        console.log(param, this.outputList[0])
        param.paramDirection = '1'
        param.paramPosition = '1'
        param.actionId = this.outputList[0].actionId
        param.actionName = this.outputList[0].actionName
        param.paramMappingKey = this.outputList[0].paramKey + param.paramKey
        this.outputList = [...this.outputList]
      }

    },
    operateList(type, data) {
      if (type == "addKey") {
        // this.tableData.splice(scope.$index, 1);
        this.target = data
        this.$refs.addUserDefined.showDialog()
      } else if (type == 'delete') {
        this.$confirm('此操作将删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let index = -1
          const children = this.outputList[0]?.children || []
          for (let i = 0; i < children.length; i++) {
            const item = children[i];
            if (item.paramKey === data.value) {
              index = i
              break
            }
          }
          children.splice(index, 1);
          const index2 = this.configList.indexOf(data)
          this.configList.splice(index2, 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
    // async getDessitizaList() {
    //   const res = await this.rpc.d4.getDessitizaList();
    //   let arr = []
    //   if (
    //     res.desensitizationTypeList &&
    //     res.desensitizationTypeList.length > 0
    //   ) {
    //     res.desensitizationTypeList.map((item) => {
    //       arr.push({
    //         value: item.desensitizationType,
    //         type: item.desensitizationName,
    //       })
    //     });
    //   }
    //   this.options = arr
    // },
    switchTableMode() {
      this.showAllInputParamsAtSetting = !this.showAllInputParamsAtSetting;
    },
    switchTableMode2() {
      this.showAllOutputParamsAtSetting = !this.showAllOutputParamsAtSetting;
    },
    getactionPostSeq() {
      const dataList = this.getDataList();
      // 筛选出并发组件内的组件id
      const concurrentInnerActionIdList = dataList.reduce((prev, data) => {
        if (data.actionType == "concurrentAction") {
          const conf = this.getConfItem("subcomponent", data.actionId);
          const subcomponent = JSON.parse(conf.value || "[]");
          return prev.concat(subcomponent);
        }
        return prev;
      }, []);
      const list = dataList.reduce((prev, item) => {
        const actionSeq = item.conf.find((e) => e.name == "actionSeq")?.value;
        if (
          actionSeq &&
          item.actionId === this.currentObj.actionId &&
          !["containerAction"].includes(item.actionType) &&
          !concurrentInnerActionIdList.includes(item.actionId)
        ) {
          prev.push({
            type: actionSeq,
            value: actionSeq,
          });
        }
        return prev;
      }, []);
      list.sort((a, b) => {
        let actionSeqs = [a.value, b.value];
        actionSeqs = actionSeqs.map((item) => {
          if (item.includes("-")) {
            const arr = item.split("-");
            item = arr[0].slice(1) * 1 + arr[1].slice(1) * 0.0001;
          } else {
            item = item.slice(1) * 1;
          }
          return item;
        });
        return actionSeqs[0] - actionSeqs[1];
      });
      return list;
    },
    initData(item) {
      if (item.serviceId === this.currentServObj.svcId) {
        item.apSource = "00";
      } else {
        item.apSource = "20";
      }
    },
    initParamKey(item, list, index = 1) {
      const temp = item.paramKey;
      for (let i = 0; i < list.length; i++) {
        const item1 = list[i];
        if (item.paramKey === item1.paramKey) {
          item.paramKey = temp.split("List")[0] + index + "List";
          i = 0;
          index += 1;
        }
      }
    },
    getActionName(row) {
      const { actionName, actionId } = row;
      if (!actionName && !actionId) {
        return "";
      } else if (
        ["当前4b交易", "当前循环组件", "固定值"].includes(actionName)
      ) {
        return actionName;
      } else {
        const item = this.getDataList().find(
          (data) => data.compositeId == actionId
        );
        if (item) {
          const actionSeq = this.getConfItem("actionSeq", item.actionId).value;
          return `${actionName}(${actionSeq})`;
        } else {
          return row.actionId;
        }
      }
    },
    handleSetData(obj) {
      console.log(obj);
      
      // paramValueType 参数值类型
      // paramKeySrcType 参数Key来源类型
      // paramValueSrcType 参数值来源类型
      // paramValueSrcActionId 参数值来源组件ID
      // [{"key":"userNo","name": "用户","value": "userNoRel","desensitization":"USERNAME"},
      let obj1 = {
        key: obj.paramKey,
        name: obj.paramName,
        value: '',
        desensitization: '',
      }
      this.configList.push(obj1)
    },
    setActionId(children, parent) {
      children.forEach((child) => {
        child.actionName = parent.actionName;
        child.actionId = parent.actionId;
        child.apSource = parent.apSource;
        child.paraMapgNm = child.paramName;
      });
    },
    operateInput(operation, data) {
      if (operation == "delete") {
        this.tableData = []
        this.configList = []
        this.outputList = []
      }
    },
    confirm2(data) {
      const obj = {
        ...data[0],
      };
      this.initData(obj);
      this.tableData = [obj];
      const newData = JSON.parse(JSON.stringify(this.tableData));
      this.outputList = [...newData]
      this.deepChildren(this.outputList)
      obj.deleteBtn = true
      this.setDirection(this.tableData, '0')
      this.setDirection(this.outputList, '1')
      this.configList = []
    },
    deepChildren(children, parent) {
      children.forEach(param => {
        if (parent) {
          param.paramMappingKey = parent.paramMappingKey + '.' + param.paramKey
        } else {
          param.paramMappingKey = param.paramKey
        }
        if (param.children && param.children.length) {
          this.deepChildren(param.children, param)
        }
      })
    },
    setDirection(list, direction) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        item.paramPosition = direction
        item.paramDirection = direction
        if (item.children && item.children.length > 0) {
          this.setDirection(item.children, direction)
        }
      }
    },
    setDisabled(children) {
      for (let i = 0; i < children?.length; i++) {
        const item = children[i];
        item.deleteBtn = true;
        if (item.children && item.children.length) {
          this.setDisabled(item.children);
        }
      }
    },
    showConfigParamList() {
      this.$refs.selectListParamsRef.showDialog(this.tableData);
    },
    async getParams(e, obj) {
      console.log("getParams", e, obj);
      this.init();
      this.currentObj = e;
      // this.loopListOptions = obj.puApiParams.filter((item) => item.paramDirection == 0 && ["List"].includes(item.paramType));
      if (!e.compositeId) {
        e.conf.map((item) => {
          this.formData[item.name] = item.value;
        });
        this.updateCompositeIdMapToParamList();
        await this.getServiceArrangeList(e);
        return;
      } else {
        // const params = {
        //   d4StusCd: "1",
        //   blngtoTyp: this.blngtoTyp,
        //   compositeId: e.compositeId || "",
        // };
        // const res = await this.rpc.d4.getServiceCpnParams(params);
        // this.getDessitizaList()
        const res1 = await this.rpc.d4.getDessitizaList();
        let arr1 = []
        if (
          res1.desensitizationTypeList &&
          res1.desensitizationTypeList.length > 0
        ) {
          res1.desensitizationTypeList.map((item) => {
            arr1.push({
              value: item.desensitizationType,
              type: item.desensitizationName,
            })
          });
        }
        this.options = arr1
        this.cpnData = e;
        if (e.paramList[0] && !e.paramList[0]?.children) {
          e.paramList[0].children = [];
        }
        this.tableData = reList(
          e.paramList.filter((item) => {
            return item.paramDirection === "0";
          })
        );
        this.tableData = JSON.parse(JSON.stringify(this.tableData));
        if (this.tableData[0]) {
          this.tableData[0].deleteBtn = true
        }
        this.outputList = reList(
          e.paramList.filter((item) => {
            return item.paramDirection === "1";
          })
        );
        // 更新实时位置序号
        let arr = ["actionSeq", "actionFrntSeq", "actionPostSeq"];
        arr.forEach((key) => {
          this.formData[key] = this.getConfItem(key, e.actionId)?.value || "";
          console.log(this.getConfItem(key, e.actionId), 'this.getConfItem(key, e.actionId)')
        });
        console.log(this.formData, "formData")
        e.confList.map((item) => {
          if (item.confKey === 'desensitizationConf') {
            this.configList = JSON.parse(item.confValue)
          }
          if (
            !["actionSeq", "actionFrntSeq", "actionPostSeq"].includes(
              item.confKey
            )
          ) {
            this.formData[item.confKey] = item.confValue;
          }
        });
        // 更新实时位置序号
        // ["actionSeq", "actionFrntSeq", "actionPostSeq"].forEach((key) => {
        //   this.formData[key] = this.getConfItem(key, e.actionId)?.value || ""
        // })
        // if (this.formData.loopListSource == "")
        //   this.formData.loopListSource = this.currentServObj?.svcId;
        // await this.updateCompositeIdMapToParamList()
        // const loopList = this.formData.loopList;

        // if (loopList && loopList != this.currentServObj?.svcId) {
        //   this.formData.loopList = "";
        //   await this.updateCompositeIdMapToParamList();
        //   // this.formData.loopList = loopList
        //   this.formData = {
        //     ...this.formData,
        //     loopList: loopList,
        //   };
        // }
        console.log(this.formData, "this.formData");

        await this.getServiceArrangeList(e);
      }
      this.setCpnParamsRecord();
    },
    // 查询编排列表
    async getServiceArrangeList(e) {
      console.log("getServiceArrangeList", e, this.currentServObj);
      const res = await this.rpc.d4.getServiceArrangeList({
        svcId: this.currentServObj?.svcId,
        actionId: e.compositeId,
        // parentActionId:
      });
      this.layoutActionList = res.layoutActionList;
      const tfrCdtnCd = JSON.parse(res.layoutActionList[0]?.tfrCdtnCd || "[]");
      this.outputTargetList = tfrCdtnCd.map((item) => {
        return {
          actionId:
            item.actionNm == "当前4b交易"
              ? this.currentServObj?.svcId
              : item.actionId,
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
          paramKeySrcType: "119",
          paramValueSrcType: "119",
        };
      });
      console.log(this.outputTargetList, "outputTargetList");
      this.outputTargetList = JSON.parse(JSON.stringify(this.outputTargetList));
    },
    async saveParams() {
      if (!this.formData.actionDesc) {
        return this.$message.error("组件名称不能为空");
      }
      if (!this.tableData.length) {
        return this.$message.error("输入参数不能为空");
      }
      if (!this.configList.length) {
        return this.$message.error("脱敏配置不能为空");
      }
      for (let i = 0; i < this.configList.length; i++) {
        const item = this.configList[i];
        if (!item.desensitization) {
          // 脱敏类型
          return this.$message.error("脱敏类型不能为空");
        }
        if (!item.value) {
          // 脱敏类型
          return this.$message.error("脱敏参数映射key不能为空");
        }
      }
      const paramList = mixList(setParamOrder(this.tableData), "children");
      const layoutServiceBeanList = {
        svcId: this.currentObj.actionOwnId,
        actionKey: "",
        actionId: this.currentObj.compositeId,
        actionNm: this.currentObj.actionName,
        actionTyp: actionTypToArrangeEnum['desensitizationAction'],
        loSeqNo: "",
        frntLoSeqNo: "",
        postLoSeqNo: "",
        tranId: this.currentServObj?.svcId,
        tfrCdtnCd: '',
        layoutActionList: [],
      };
      let confList = this.cpnData.confList || [];
      console.log(JSON.parse(JSON.stringify(confList)))
      let arr = []
      let list = []
      const _formData = JSON.parse(JSON.stringify(this.formData));
      for (let i in _formData) {
        const target = confList.find((item) => item.confKey == i);
        if (arr.includes(i)) {
          continue
        }
        if (target && i === 'desensitizationConf') {
          target.confValue = JSON.stringify(this.configList);
          list.push(target)
        } else if (target && i !== 'desensitizationConf') {
          console.log(i, "i")
          target.confValue = _formData[i];
          list.push(target)

        } else if (i === 'desensitizationConf') {
          list.push({
            confKey: 'desensitizationConf',
            confValue: JSON.stringify(this.configList),
            confId: "",
            confDescr: "",
            compositeId: this.currentObj?.compositeId || "",
          })

        } else {
          list.push({
            confKey: i,
            confValue: _formData[i],
            confId: "",
            confDescr: "",
            compositeId: this.currentObj?.compositeId || "",
          })
        }
        arr.push(i)
      }
      console.log(JSON.parse(JSON.stringify(confList)))

      // let arr = [];
      // for (let i = 0; i < confList.length; i++) {
      //   const item = confList[i];
      //   if (
      //     item.confKey !== "actionFrntSeq" &&
      //     item.confKey !== "actionPostSeq" &&
      //     item.confKey !== "cacheKey"
      //   ) {
      //     arr.push(item);
      //   }
        
      // }
      // console.log(arr, 'result')
      // const paramList = mixList(this.loopOutputList, "children")
      paramList.map((item) => {
        item.paramDirection = "0";
      });
      let paramList2 = JSON.parse(JSON.stringify(this.outputList));
      paramList2 = setParamOrder(paramList2);
      paramList2 = mixList(paramList2, "children").map((param) => {
        param.paramDirection = "1";
        if (actionNameToNoActionId.includes(param.actionName)) {
          param.actionId = "";
        }
        return param;
      });
      // return this.loopOutputList = paramList
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: this.currentServObj?.svcId,
        paramList: [...paramList, ...paramList2],
        confList: list,
        compositeId: this.currentObj?.compositeId || "",
      };
      console.log(params, "hhhhhhhhhhhhhh");
      // const { compositeId } = await this.rpc.d4.saveServiceCpnParams(params);
      // params.compositeId = compositeId;
      this.rpc.s4design.addFuntionJobCommitFlow({
        fnctId: this.$route.query.fnctId,
        jobTpCd: "C4",
      });
      this.setCpnParamsRecord();
      this.$emit(
        "upDateServParams",
        JSON.parse(JSON.stringify(this.currentObj)),
        params,
        layoutServiceBeanList
      );
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
    async updateCompositeIdMapToParamList() {
      const compositeId = this.formData.loopListSource;
      const item = this.compositeIdMapToParamList[compositeId];
      const apiId = item?.svcId;
      if (compositeId && item && !item?.paramList?.length) {
        if (
          apiId &&
          ["D4bAction", "D5SelfAction", "D5LinkAction"].includes(
            item.actionType
          )
        ) {
          const res = await this.rpc.d4.queryL5ParamAndRuleDefinitions({
            d4StusCd: "1",
            blngtoTyp: "10",
            apiId: apiId,
            d4bApiId: this.currentServObj?.svcId || this.currentServObj.apiId,
            bizDomainNo: this.currentServObj.bizLineId,
          });
          item.paramList = res.paramList;
        } else if (item.actionType == "loopAction") {
          const res = await this.rpc.d4.getServiceCpnParams({
            d4StusCd: "1",
            blngtoTyp: "11",
            compositeId: compositeId,
          });
          item.paramList = res.paramList;
        }
      }
    },
    // 获取conf配置项
    getConfItem(name, actionId) {
      const dataList =
        this.currentParentCpnInfo?.dataList || this.getDataList();
      const cpn = dataList.find((data) => data.actionId == actionId);

      return cpn?.conf?.find((item) => item.name == name) || {};
    },
    showDialog(key) {
      this.$refs.selectParamsRef.showDialog(key);
    },
    showDialog2() {
      this.$refs.selectParamsRef2.showDialog();
    },
    confirm(key, data) {
      console.log("confirm", key, data);
      this.loopOutputList.push(...key);
    },
    init() {
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
      // 在子流程时，使用currentParentCpnInfo中的主流程数据
      const dataList =
        this.currentParentCpnInfo?.dataList || this.getDataList();
      let { apiName, puApiParams } = this.currentServObj;
      puApiParams = puApiParams.filter((item) => item.paramDirection == 0);
      this.compositeIdMapToParamList = dataList.reduce(
        (prev, data) => {
          if (sourceActionType.includes(data.actionType) && data.compositeId) {
            // const svcId = data.conf.find(item => item.name == "svcId").value
            const compositeId = data.compositeId;
            const conf = data.conf.find((item) => {
              return item.name === "actionSeq";
            });
            if (!this.compositeIdMapToParamList[compositeId]) {
              prev[compositeId] = {
                svcId: data.actionOwnId,
                svcNm: data.actionName,
                actionSeq: conf?.value || "",
                actionType: data.actionType,
                paramList: [],
              };
            }
          }
          return prev;
        },
        {
          [this.currentServObj?.svcId]: {
            svcNm: "当前4b交易",
            svcId: this.currentServObj?.svcId,
            paramList: puApiParams,
          },
        }
      );
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
    // this.getDessitizaList()
    this.svcIdToSvcNm = this.getDataList().reduce(
      (prev, data) => {
        if (sourceActionType.includes(data.actionType) && data.compositeId) {
          prev[data.compositeId] = data.actionName;
        }
        return prev;
      },
      { [this.currentServObj?.svcId]: "当前4b交易" }
    );
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
        border-bottom: 1px solid #e7e7ee;
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
        content: "\e790";
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
