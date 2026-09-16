<template>
  <div class="aop_tradecode_comps_design_attr_judge_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>判断组件</div>
      </div>
      <div v-if="!isRead" class="attr_box">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t required">
              组件名称：
            </div>
            <div class="attr_show_item_c">
              <el-input
                :disabled="isRead"
                v-model="formData.actionDesc"
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="attr_show_item">
            <!-- <el-tag type="warning" size="small" class="tips" v-if="!isRead">
              如需增加判断条件，请在画布中的判断组件下增加连线，然后双击连线弹出窗口添加</el-tag> -->
            <div class="attr_show_item_t " :class="flex">
              组件描述：
              <!-- <span v-if="!isRead" class="right_btn" @click="showDialog"
                >编辑</span
              > -->
            </div>
            <div class="attr_show_item_c textarea">
              <el-input
                type="textarea"
                v-model="formData.actionMsg"
                placeholder="组件描述"
                size="mini"
              ></el-input>
            </div>
            <!-- <ul class="judge_list">
              <li
                class="list_item"
                v-for="(item, index) in JSON.parse(formData.paramList || '[]')"
                :key="index"
              >
                <el-card class="box_card">
                  <div slot="header" class="header">
                    <el-tooltip class="text" effect="dark" :content="`条件${index + 1}：下一步${item.triggerCpnName}`" placement="top">
                      <span>{{`条件${index + 1}：下一步${item.triggerCpnName}`}}</span>
                    </el-tooltip>
                    
                    <div class="btn_area"  v-if="!isRead">
                      <el-button type="text" @click="editCondition(item, index)">编辑</el-button>
                      <el-button type="text"  @click="deleteCondition(item, index)">删除</el-button>
                    </div>
                  </div>
                  <div class="text item">
                    {{
                      `如果${
                        item.apSource == "40"
                          ? "固定值" + item.paramValue
                          : "参数变量" + item.paramCName
                      } ${item.condTyp} ${
                        item.otherApSource == "40"
                          ? "固定值" + item.otherParamValue
                          : "参数变量" + item.otherParamCName
                      }，则触发组件【${item.triggerCpnName}】`
                    }}
                  </div>
                </el-card>
              </li>
            </ul> -->
          </div>
        </div>
        <div class="output_table">
          <div class="table_header">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">条件表达式</div>
            </div>
            <el-button
              v-if="canSave"
              type="primary"
              size="mini"
              @click="addRow"
            >增加</el-button>
          </div>
          <div class="attr_show_item_c">
            <Table
              class="table output_list"
              :data="tableData"
              :table="tableColumn"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
              @operate="operate"
              @fetchsSuggestions="fetchsSuggestions"
              @autocompleteSelect="autocompleteSelect"
              @selectChange="selectChange"
            ></Table>
          </div>
          <div v-if="!isRead">
            <div class="tips_info" v-if="!canSave">
              <el-tag type="warning">保存交易编排后，可对组件信息进行编辑</el-tag>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="attr_box">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              组件名称：
              <span class="attr_show_item_i">{{
                formData.actionDesc
              }}</span>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              组件描述：
              <span v-if="isRead" class="attr_show_item_i">{{
                formData.actionMsg
              }}</span>
            </div>
          </div>
        </div>
        <div class="output_table">
          <div class="table_header">
            <div class="attr_pre_title mb0">
              <div class="attr_pre_title_b bold">条件表达式</div>
            </div>
          </div>
          <div class="attr_show_item_c">
            <Table
              class="table output_list"
              :data="tableData"
              :table="tableColumn"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
              @operate="operate"
              @fetchsSuggestions="fetchsSuggestions"
              @autocompleteSelect="autocompleteSelect"
              @selectChange="selectChange"
            ></Table>
          </div>
        </div>
      </div>
    </div>
    <div class="attr_btn">
      <el-button
        v-if="canSave"
        type="primary"
        size="small"
        @click="saveParams"
        class="right_button"
        >保存</el-button
      >
    </div>

    <!-- 条件配置 -->
    <PageDialog
      :dialogWidth="'56.3%'"
      :dialogTitle="'条件参数'"
      :dialogVisiable="dialogVisible"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <el-form
          :rules="rules"
          :model="formData"
          ref="form"
          label-position="right"
          label-width="130px"
          class="edit_form"
        >
          <div class="form_info">
            <el-form-item label="条件名称" prop="desc">
              <el-input
                v-model="formData.actionDesc"
                :disabled="isRead"
                size="mini"
                clearable
                placeholder="条件名称"
              />
            </el-form-item>
          </div>
        </el-form>

        <div class="table">
          <el-button
            type="primary"
            @click="addCondition"
            size="small"
            icon="el-icon-plus"
            >添加条件判断</el-button
          >
          <Table
            :data="tableData"
            :table="tableColumn"
            :rowK="'paramOrder'"
            :treeProps="{ children: 'children' }"
            @switchChange="switchChange"
            @inputChange="inputChange"
            @selectFocus="selectFocus"
            @selectChange="selectChange"
            @selectBlur="selectBlur"
            @operate="operate"
          ></Table>
          <ul class="condition_desc_list">
            <li
              v-for="(item, index) in tableData"
              :key="index"
              class="list_item"
            >
              <div class="condition_desc">
                如果参数变量
                {{
                  `${item.paramCName} ${item.condTyp} ${item.paramValue}`
                }}，则触发组件【{{ item.triggerCpnName }}】
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveDialog">确 定</el-button>
      </div>
    </PageDialog>

    <SelectDialog
      ref="selectDialogRef"
      :currentServObj="currentServObj"
      :isRead="isRead"
      :dataList="dataList"
      @getDataList="getDataList"
    ></SelectDialog>

    <!-- 线段弹窗 -->
    <LineDialog
      ref="lineDialogRef"
      :dataList="dataList"
      :currentServObj="currentServObj"
      @editLineDialog="editLineDialog"
    >
    </LineDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import PageDialog from "@m/core/components/page_dialog";
import SelectDialog from "./components/judge/select";
import LineDialog from "./line"
import { mixList, reList } from "@m/utils/paramTree";
import { packageParamKey } from "@m/utils/paramTree";

export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    SelectDialog,
    LineDialog,
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
    // dataList: {
    //   type: Array,
    //   default: () => [],
    // },
  },
  data() {
    return {
      formData: {
        actionDesc: "判断组件",
        actionMsg: "",
        paramList: "[]",
      },
      currentObj: {},
      cpnData: {},
      dialogVisible: false,
      //编辑条件配置 默认条件和优先级的数据
      lineForm: {
        actionDesc: "", // 条件名称
        deltCondFlg: "1",
        condPrit: "1",
        condList: [],
        desc: "",
      },
      //增加条件数据
      condList: [],
      changeList: [], //正在改变线条的存储
      tableData: [],
      tableParamList: [],
      tableType: false,
      cpnParamsRecord: {},
      actionIdRecord: "",
      dataList: [],
      currentIndex: 0 ,// 当前编辑的条件的序号
      typeInterface:"",
      condRelOptions: {
        "and": "与",
        "or": "或",
      },
      sourceOptions: {
        "10": "固定值",
        "20": "输入参数",
      },
    };
  },
  computed: {
    blngtoTyp() {
      return this.currentServObj.apiServiceType.indexOf("D4") > -1
        ? "10"
        : "11";
    },
    // 是否修改过组件的参数
    hasChangeCpnParams() {
      // return this.cpnParamsRecord != JSON.stringify(this.formData) && this.actionIdRecord == this.currentObj.actionId
    },
    canSave() {
      return !this.isRead && this.currentObj.compositeId
    },
    tableColumn() {
      if (this.canSave) {
        return [
          {
            prop: "leftFormSource",
            label: "左式来源",
            // minWidth: "30%",
            width: "130",
            type: "select",
            placeholder: "请选择",
            // align: "center",
            selectVal: [
              // { type: "服务输入参数", value: "00" },
              // { type: "服务临时参数", value: "10" },
              // { type: "组件输出参数", value: "20" },
              { type: "输入参数", value: "20" },
              { type: "固定值", value: "10" },
              
            ],
          },
          {
            prop: (row) => {
              if (row?.leftFormSource == "10") {
                return "leftFormParamMappingKey"
              } else {
                return "leftFormParaMapgNm"
              }
            },
            label: "左式来源值",
            minWidth: "30%",
            placeholder: "请选择",
            // type: "input",
            type: (row) => {
              if (row?.leftFormSource == "20") {
                return "selectInputPicker"
              } else {
                return "input"
              }
            },
            filter: (scope) => {
              // console.log("filter", scope)
              if (scope?.row?.leftFormSource == "20") {
                return scope.row.leftFormParaMapgNm || "选择"
              } else {
                return scope?.row?.leftFormParamMappingKey
              }
            },
            selectPicker: function (scope) {
              // return scope.row.paramValueType !== "Date";
              return true
            },
            // align: "center",
            display: (option) => {
              // console.log("display", option)
              return option.paramCName
            }
          },
          {
            prop: "condTyp",
            label: "操作符",
            // minWidth: "15%",
            width: "100",
            type: "select",
            placeholder: "请选择",
            selectVal: [
              { type: "==", value: "==" },
              { type: ">", value: ">" },
              { type: ">=", value: ">=" },
              { type: "<", value: "<" },
              { type: "<=", value: "<=" },
              { type: "!=", value: "!=" },
            ],
          },
          {
            prop: "rightFormSource",
            label: "右式来源",
            // minWidth: "30%",
            width: "130",
            type: "select",
            placeholder: "请选择",
            // align: "center",
            selectVal: [
              // { type: "服务输入参数", value: "00" },
              // { type: "服务临时参数", value: "10" },
              // { type: "组件输出参数", value: "20" },
              { type: "输入参数", value: "20" },
              { type: "固定值", value: "10" },
              
            ],
          },
          {
            prop: (row) => {
              if (row?.rightFormSource == "10") {
                return "rightFormParamMappingKey"
              } else {
                return "rightFormParaMapgNm"
              }
            },
            label: "右式来源值",
            minWidth: "30%",
            placeholder: "请选择",
            // type: "input",
            type: (row) => {
              if (row?.rightFormSource == "20") {
                return "selectInputPicker"
              } else {
                return "input"
              }
            },
            filter: (scope) => {
              if (scope?.row?.rightFormSource == "20") {
                return scope.row.rightFormParaMapgNm || "选择"
              } else {
                return scope?.row?.rightFormParamMappingKey
              }
            },
            selectPicker: function (scope) {
              // return scope.row.paramValueType !== "Date";
              return true
            },
            // align: "center",
            display: (option) => {
              return option.paramCName
            }
          },
          {
            prop: "condRel",
            label: "条件关系",
            width: "100",
            type: "select",
            placeholder: "请选择",
            selectVal: [
              { type: "与", value: "and" },
              { type: "或", value: "or" },            
            ],
          },
          {
            label: "操作",
            type: "button",
            width: "50",
            buttonList: [
              {
                desc: "删除",
                operate: "deleteCondition",
              },
            ],
          },
        ]
      } else {
        return [
          {
            prop: "leftFormSource",
            label: "左式来源",
            width: "130",
            type: "text",
            placeholder: "请选择",
            filter: (scope) => {
              return this.sourceOptions[scope?.row?.leftFormSource] || ""
            },
          },
          {
            prop: (row) => {
              if (row?.leftFormSource == "10") {
                return "leftFormParamMappingKey"
              } else {
                return "leftFormParaMapgNm"
              }
            },
            label: "左式来源值",
            minWidth: "30%",
            placeholder: "请选择",
            type: "text",
            filter: (scope) => {
              if (scope?.row?.leftFormSource == "20") {
                return scope.row.leftFormParaMapgNm
              } else {
                return scope?.row?.leftFormParamMappingKey
              }
            },
          },
          {
            prop: "condTyp",
            label: "操作符",
            width: "100",
            type: "text",
          },
          {
            prop: "rightFormSource",
            label: "右式来源",
            width: "130",
            type: "text",
            filter: (scope) => {
              return this.sourceOptions[scope?.row?.rightFormSource] || ""
            },
          },
          {
            prop: (row) => {
              if (row?.rightFormSource == "10") {
                return "rightFormParamMappingKey"
              } else {
                return "rightFormParaMapgNm"
              }
            },
            label: "右式来源值",
            minWidth: "30%",
            placeholder: "请选择",
            type: "text",
            filter: (scope) => {
              if (scope?.row?.rightFormSource == "20") {
                return scope.row.rightFormParaMapgNm
              } else {
                return scope?.row?.rightFormParamMappingKey
              }
            },
          },
          {
            prop: "condRel",
            label: "条件关系",
            width: "100",
            type: "text",
            placeholder: "请选择",
            filter: (scope) => {
              return this.condRelOptions[scope?.row?.condRel] || ""
            }
          },
        ]
      }
    }
  },
  inject: ["getDataList", "deleteLineBySourceIdAndTargetId", "save"],
  methods: {
    async getParams(e, obj, data, type) {
      console.log("getParams", e, obj);
      this.currentObj = e;
      if (!e.compositeId) {
        // this.formData = {
        //   actionDesc: "判断组件",
        //   actionMsg: "",
        //   paramList: "[]",
        // }
        e.conf.map(item => {
          this.formData[item.name] = item.value
        })
        if (data && type) {
          this.setParamsList(data, type)
          this.saveParams()
        }
        this.cpnData = {}
        return;
      } else {
        const params = {
          d4StusCd: "1",
          blngtoTyp: this.blngtoTyp,
          compositeId: e.compositeId || "",
        };
        const res =this.typeInterface == "interfaceType" ? await this.rpc.apimgmt.getServiceCpnParams(params) : await this.rpc.transactionDesign.getServiceCpnParams(params);
        this.cpnData = res;
        res.confList.map((item) => {
          this.formData[item.confKey] = item.confValue;
        });
        this.tableData = JSON.parse(this.formData.expressionList || "[]");
        if (data && type) {
          this.setParamsList(data, type)
          this.saveParams()
        }
      }
      // try {
      //   this.tableData = JSON.parse(
      //     this.cpnData.confList.find((item) => item.confKey == "paramList")
      //       .confValue
      //   );
      // } catch (error) {
      //   console.log(error);
      // }
      this.setCpnParamsRecord()
    },
    async saveParams() {
      const e = this.currentServObj;
      const confList = this.cpnData.confList || [];
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
      // 校验条件表达式是否完整
      if (this.tableData?.length) {
        if (this.tableData.find(item => !item.leftFormSource)) {
          return this.$message.error("左式来源不能为空")
        } else if (this.tableData.find(item => item.leftFormSource == "20" && (!item.leftFormParamMappingKey || !item.leftFormParaMapgNm))) {
          return this.$message.error("左式来源值有误")
        } else if (this.tableData.find(item => item.leftFormSource == "10" && !item.leftFormParamMappingKey)) {
          return this.$message.error("左式固定值不能为空")
        } else if (this.tableData.find(item => !item.condTyp)) {
          return this.$message.error("操作符不能为空")
        } else if (this.tableData.find(item => !item.rightFormSource)) {
          return this.$message.error("右式来源不能为空")
        } else if (this.tableData.find(item => item.rightFormSource == "20" && (!item.rightFormParamMappingKey || !item.rightFormParaMapgNm))) {
          return this.$message.error("右式来源值有误")
        } else if (this.tableData.find(item => item.rightFormSource == "10" && !item.rightFormParamMappingKey)) {
          return this.$message.error("右式固定值不能为空")
        }
      }
      const expressionList = confList.find(item => item.confKey == "expressionList")
      expressionList.confValue = JSON.stringify(this.tableData)
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: e.apiId,
        paramList: [],
        confList,
        compositeId: this.currentObj.compositeId || "",
      };
      const { compositeId } =this.typeInterface == "interfaceType"?await this.rpc.apimgmt.saveServiceCpnParams(params): await this.rpc.transactionDesign.saveServiceCpnParams(params);
      params.compositeId = compositeId
      this.setCpnParamsRecord()
      this.$emit("upDateServParams", this.currentObj, params, this.typeInterface);
      // this.$emit("updateServiceArrangeList", {})
    },
    setCpnParamsRecord() {
      this.cpnParamsRecord = JSON.stringify(this.formData)
      this.actionIdRecord = this.currentObj.actionId
    },
    showDialog() {
      this.dataList = this.getDataList();
      this.$nextTick(() => {
        console.log(JSON.parse(JSON.stringify(this.dataList)));
        this.tableColumn.find(
          (item) => item.prop == "triggerCpnName"
        ).selectVal = this.dataList
          .filter((item) => item.actionId != this.currentObj.actionId)
          .map((item) => {
            return {
              type: item.actionName,
              value: item.actionName,
            };
          });
        // this.setParamKeySelectList()
        try {
          this.tableData = JSON.parse(
            this.cpnData.confList.find((item) => item.confKey == "paramList")
              .confValue
          );
        } catch (error) {
          console.log(error);
        }
      });
      this.dialogVisible = true;
    },
    //保存编辑条件配置
    saveDialog(flag = true) {
      // flag：是否进行填写项校验
      if (flag) {
        if (
          this.tableData.find(
            (item) =>
              !item.paramCName ||
              !item.condTyp ||
              !item.paramValue ||
              !item.triggerCpnName
          )
        ) {
          return this.$message.error("条件判断填写有误");
        }
      }
      console.log(this.tableData);
      const desc = this.tableData.reduce((prev, item, index) => {
        return `${prev} 如果参数变量 ${item.paramCName} ${item.condTyp} ${item.paramValue}，则触发组件【${item.triggerCpnName}】;`;
      }, "");
      this.formData.actionMsg = desc;
      this.formData.paramList = JSON.stringify(this.tableData);
      this.dialogVisible = false;
    },
    //取消编辑条件配置
    closeDialog() {
      this.tableData = []
      this.dialogVisible = false;
    },
    //删除添加的条件
    innerDelLine(e) {
      this.changeList.splice(e, 1);
    },
    //点击增加条件按钮
    addCondition() {
      const d = {
        paramCName: "",
        condTyp: "==",
        paramValue: "",
        triggerCpnName: "",
      };
      this.tableData.push(d);
    },
    //输入框的值发生改变
    handleConditionInput(e, i) {
      if (i == "s") {
        e.sorcParaNm = e.sorcParaVal;
      } else {
        e.trgtParaNm = e.trgtParaVal;
      }
      this.$forceUpdate();
    },
    //下拉框的值发生改变
    handleConditionSelect(e, i) {
      if (i == "s") {
        e.sorcParaNm = this.dicArray.filter(
          (item) => item.paraNo == e.sorcParaVal
        )[0].paraNm;
      } else {
        e.trgtParaNm = this.dicArray.filter(
          (item) => item.paraNo == e.trgtParaVal
        )[0].paraNm;
      }
      this.$forceUpdate();
    },
    //更新数据 并向父组件返回当前对象
    upDateCondition() {
      this.$emit("updateConditionEvent", this.currentLineObj);
    },
    operate(operation, data) {
      console.log(operation, data);
      if (operation == "deleteCondition") {
        const index = this.tableData.indexOf(data);
        this.tableData.splice(index, 1);
      }
    },
    selectChange(row, prop) {
      console.log("selectChange", row, prop);
      if (prop == "apSource") {
        // 参数来源下拉框变更时
        this.resetRow(row);
        if (row.apSource == "20") {
          this.$refs.selectDialogRef.showDialog(row, this.currentObj);
        }
      } else if (prop == "paramCName") {
        if(row.apSource == "20") {
          if(!row.paramCName) return
          row.paramKey = row.paramCName
          const list = this.tableParamList.filter((item) => {return item.paramKey == row.paramKey})
          row.paramCName = `${row.actionName}.${list[0].paramCName}`
          row.paramType = list[0].paramType
          row.paramLength = list[0].paramLength
        } else {
          if(!row.paramCName) return
          row.paramKey = row.paramCName
          const list = this.currentServObj.puApiParams.filter((item) => {return item.paramKey == row.paramKey})
          row.paramCName = list[0].paramCName
          row.paramType = list[0].paramType
          row.paramLength = list[0].paramLength
        }
      }
    },
    resetRow(row) {
      row.paramCName = row.condTyp = row.paramValue = row.triggerCpnName = "";
    },
    setParamKeySelectList() {
      this.tableColumn.find((item) => item.prop == "paramCName").selectVal =
        this.currentServObj.puApiParams.map((item) => {
          return {
            type: item.paramCName,
            value: item.paramCName,
          };
        });
    },
    getParamKeySelectList(row) {
      if (row.apSource == "00") {
        // 服务输入参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "0"
        );
        return p.map((item) => {
          return {
            type: item.paramCName,
            value: item.paramKey,
          };
        });
      } else if (row.apSource == "10") {
        // 服务临时参数
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "3"
        );
        return p.map((item) => {
          return {
            type: item.paramCName,
            value: item.paramKey,
          };
        });
      } else if (row.apSource == "20") {
        // 组件输出
        return [];
      }
    },
    selectFocus(row, prop) {
      if(prop == "paramCName" && row.apSource == "20") {
        this.tableType = true
        console.log("selectFocus", row, prop)
        const target = this.dataList.find(item => item.actionId == row.actionId)
        if (target.actionType == "dataDealAction") {
          this.getDataDealOutputParmas(target)
        } else {
          this.getServiceCpnDefaultParams(target)
        }
      } else {
        this.tableType = false
      }
    },
    getDataDealOutputParmas(e) {
      console.log("getDataDealOutputParmas", e)
      this.tableParamList = e.paramList.filter((item) => item.paramDirection == "1")
      this.tableParamList = this.tableParamList.map((item) => {
        item.type = item.paramCName,
        item.value = item.paramKey
        return item
      })
    },
    async getServiceCpnDefaultParams(e) {
      console.log("getServiceCpnDefaultParams", e)
      const params = {
        d4StusCd: "1",
        blngtoTyp: "10",
        apiId: e.conf.find(item => item.name == "svcId").value,
        d4bApiId: this.currentServObj.apiId
      }
      const res = await this.rpc.transactionDesign.getServiceCpnDefaultParams(params)
      this.tableParamList = res.paramList.filter((item) => item.paramDirection == "1")
      this.tableParamList = this.tableParamList.map((item) => {
        item.type = item.paramCName,
        item.value = item.paramKey
        return item
      })
    },
    setParamsList(data, type) {
      if (type == "add") {
        const paramList = JSON.parse(this.formData.paramList) || []
        paramList.push(data)
        this.formData.paramList = JSON.stringify(paramList)
      } else if (type == "edit") {
        const paramList = JSON.parse(this.formData.paramList) || []
        const index = paramList.findIndex(item => item => item.targetId == data.targetId)
        paramList.splice(index, 1, data)
        this.formData.paramList = JSON.stringify(paramList)
      }
    },
    editCondition(item, index) {
      console.log("editCondition", item, index)
      this.currentIndex = index
      this.$refs.lineDialogRef.showDialog("edit", item, this.currentObj)
    },
    deleteCondition(item, index) {
      const paramList = JSON.parse(this.formData.paramList) || []
      paramList.splice(index, 1)
      this.formData.paramList = JSON.stringify(paramList)
      this.deleteLineBySourceIdAndTargetId(item.sourceId, item.targetId)
      this.saveParams()
    },
    // 编辑条件保存
    editLineDialog(judgeCpn, data) {
      console.log("editLineDialog", data)
      const paramList = JSON.parse(this.formData.paramList) || []
      paramList[this.currentIndex] = data
      this.formData.paramList = JSON.stringify(paramList)
      this.saveParams()
    },
    // getDataList() {
    //   this.$emit("getDataList");
    // },
    fetchsSuggestions(queryString, cb) {
      // console.log("fetchSuggestions", queryString)
      const paramList = JSON.parse(JSON.stringify(this.currentServObj.puApiParams))
      const results = paramList.filter(param => {
        if (param.paramDirection == "0" && (param.paramKey.includes(queryString) || param.paramCName.includes(queryString))) {
          param.value = packageParamKey(param, paramList)
          return true
        }
      })
      cb(results)
    },
    autocompleteSelect(row, column, option) {
      // console.log("autocompleteSelect", row, column, option)
      if (column?.label == "左式来源值") {
        row.leftFormSource = "20"
        row.leftFormActionId = this.currentServObj.apiId
        row.leftFormActionNm = this.currentServObj.apiName
        row.leftFormParaMapgNm = option.paramCName
        row.leftFormParamMappingKey = option.value
      } else if (column?.label == "右式来源值") {
        row.rightFormSource = "20"
        row.rightFormActionId = this.currentServObj.apiId
        row.rightFormActionNm = this.currentServObj.apiName
        row.rightFormParaMapgNm = option.paramCName
        row.rightFormParamMappingKey = option.value
      }
    },
    addRow() {
      this.tableData.push({
        leftFormSource: "20",
        leftFormActionId: "",
        leftFormActionNm: "",
        leftFormParaMapgNm: "",
        leftFormParamMappingKey: "",
        condTyp: "==",
        rightFormSource: "20",
        rightFormActionId: "",
        rightFormActionNm: "",
        rightFormParaMapgNm: "",
        rightFormParamMappingKey: "",
        condRel: "and"
      })
    },
    selectChange(row, prop) {
      console.log("selectChange", row, prop)
      if (prop == "leftFormSource") {
        row.leftFormActionId = row.leftFormActionNm = row.leftFormParaMapgNm = row.leftFormParamMappingKey = ""
      } else if (prop == "rightFormSource") {
        row.rightFormActionId = row.rightFormActionNm = row.rightFormParaMapgNm = row.rightFormParamMappingKey = ""
      }
    },
    init() {
      if(this.$route.query.typeInterface){   //判断 作业太网关接口跳转过来
        this.typeInterface = this.$route.query.typeInterface ||""
      }
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
.aop_tradecode_comps_design_attr_judge_attr {
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
        min-width: 120px;
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
