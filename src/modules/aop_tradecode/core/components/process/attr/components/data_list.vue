<template>
  <div class="aop_tradecode_comps_design_attr_judge_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>数据集</div>
      </div>
      <div class="attr_box">
        <div class="attr_show underLine">
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              组件名称：
              <span v-if="isRead" class="attr_show_item_i">{{
                formData.actionDesc
              }}</span>
            </div>
            <div class="attr_show_item_c" v-if="!isRead">
              <el-input
                :disabled="isRead"
                v-model="formData.actionDesc"
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              数据集：
              <span class="attr_show_item_i">{{ formData.dataColletChiNm }}</span>
              <el-button
                v-if="!isRead"
                type="primary"
                size="mini"
                @click="selectDataList"
                >选择</el-button
              >
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              操作类型：
              <span v-if="isRead" class="attr_show_item_i">{{
                formData.actionDesc
              }}</span>
            </div>
            <div class="attr_show_item_c textarea" v-if="!isRead">
              <el-select v-model="formData.actionType" size="mini">
                <el-option
                  v-for="i in typeList"
                  :key="i.value"
                  :label="i.type"
                  :value="i.value"
                ></el-option>
              </el-select>
              <el-button
                v-if="!isRead"
                type="primary"
                size="small"
                @click="modDataList(formData.actionType)"
                >编辑</el-button
              >
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t" :class="!isRead ? 'flex' : ''">
              组件描述：
              <span v-if="isRead" class="attr_show_item_i">{{
                formData.actionMsg
              }}</span>
            </div>
            <div class="attr_show_item_c textarea" v-if="!isRead">
              <el-input
                :disabled="isRead"
                readonly
                type="textarea"
                v-model="formData.actionMsg"
                placeholder="组件描述"
                size="mini"
              ></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="attr_btn">
      <el-button
        v-if="!isRead"
        type="primary"
        size="small"
        @click="saveParams"
        class="right_button"
        >保存</el-button
      >
    </div>

    <!-- 条件配置 -->
    <PageDialog
      :dialogWidth="'80%'"
      :dialogTitle="formData.actionType + '数据集'"
      :dialogVisiable="dialogVisible"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <div class="sidebar_box">
          <div class="sidebar_box_left">
            <div class="sidebar_title">{{formData.dataColletChiNm}}<span class="sidebar_button" v-if="formData.actionType != '删除'" @click="checkAllClick">{{aMenuList.length == tableDataList.length ? "取消全选" : "全选"}}</span></div>
            <!-- <el-menu>
              <el-menu-item
                v-for="(item, index) in aMenuList"
                :key="index"
                :index="index + 1"
                @click="menuClick(item)"
              >
                <span slot="title">{{ item.menuName }}</span>
              </el-menu-item>
            </el-menu> -->
            <ul class="data_list_ul">
              <li
                class="data_list_ul_li"
                v-for="(item, index) in aMenuList"
                :key="index"
                :index="index + 1"
                :class="item.isActive ? 'is_active' : ''"
                @click="menuClick(item)"
              >{{ item.menuName }}</li>
            </ul>
          </div>
          <div class="sidebar_box_right">
            <Table
              height="400"
              :data="tableDataList"
              :table="dataTableColumn"
              @selectChange="dataSelectChange"
              @operate="dataOperate"
              rowk="paramId"
            ></Table>
          </div>
        </div>
        <div class="table" v-if="formData.actionType !== '新增'">
          <!-- <el-button
            type="primary"
            @click="addCondition"
            size="small"
            icon="el-icon-plus"
            >添加条件判断</el-button
          > -->
          <div class="table_title">条件</div>
          <Table
            :data="tableData"
            :table="tableColumn"
            @selectChange="selectChange"
            @operate="operate"
          ></Table>
          <!-- <ul class="condition_desc_list">
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
          </ul> -->
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

    <SelectData
      ref="selectDataRef"
      :currentServObj="currentServObj"
      :isRead="isRead"
      :dataList="dataList"
      :sysId="sysId"
      @selectDataConfirm="selectDataConfirm"
    ></SelectData>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import PageDialog from "@m/core/components/page_dialog";
import SelectDialog from "./components/data_list/judge_select";
import SelectData from "./components/data_list/select_data";
import { mixList, reList } from "@m/utils/paramTree";
import { unduplicated } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    SelectDialog,
    SelectData,
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
  },
  data() {
    return {
      aMenuList: [
      ],
      sysId: "",
      formData: {
        actionDesc: "数据集组件",
        actionMsg: "",
        actionType: "查询",
        dataColletChiNm: "",
        dataColletEngNm: "",
        actionDataId: "",
        actionDataList: "[]",
        judgeList: "[]",
      },
      currentObj: {},
      cpnData: {},
      cpnParamsRecord: {},
      actionIdRecord: "",
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
      tableData: [
        {
            index: "1",
            relation: "",
            connector1: "",
            apSource1: "99",
            paramValue1: "1",
            condTyp: "=",
            apSource2: "99",
            paramValue2: "1",
            connector2: ""
          }
      ],
      tableColumn: [
        {
          prop: "relation",
          label: "关系符",
          width: "100",
          type: "select",
          disabled: function (scope) {
            return scope.row.index == "1"
          },
          selectVal: [
            { type: "并且", value: "并且" },
            { type: "或者", value: "或者" },
          ],
        },
        // {
        //   prop: "connector1",
        //   label: "连接符",
        //   width: "100",
        //   type: "select",
        //   selectVal: [
        //     { type: "（", value: "（" },
        //     { type: "", value: "" },
        //   ],
        // },
        {
          prop: "apSource1",
          label: "参数来源",
          width: "100",
          type: "select",
          align: "center",
          selectVal: [
            { type: "固定值", value: "99" },
            { type: "服务输入参数", value: "00" },
            { type: "服务临时参数", value: "10" },
            { type: "组件输出参数", value: "20" },
            { type: "数据集", value: "30" },
          ],
        },
        {
          prop: "paramValue1",
          label: "参数值",
          width: "100",
          type: function(row) {
            if (row.apSource1 == "99") {
              return "input"
            } else {
              return "select"
            }
          },
          // tooltip: true,
          selectVal: (row) => {
            return this.getParamKeySelectList(row,"1");
          },
        },
        {
          prop: "condTyp",
          label: "操作符",
          width: "100",
          type: "select",
          selectVal: [
            { type: "=", value: "=" },
            { type: ">", value: ">" },
            { type: ">=", value: ">=" },
            { type: "<", value: "<" },
            { type: "<=", value: "<=" },
            { type: "!=", value: "!=" },
          ],
        },
        {
          prop: "apSource2",
          label: "参数来源",
          width: "100",
          type: "select",
          align: "center",
          selectVal: [
            { type: "固定值", value: "99" },
            { type: "服务输入参数", value: "00" },
            { type: "服务临时参数", value: "10" },
            { type: "组件输出参数", value: "20" },
            { type: "数据集", value: "30" },
          ],
        },
        {
          prop: "paramValue2",
          label: "参数值",
          width: "100",
          type: function(row) {
            if (row.apSource2 == "99") {
              return "input"
            } else {
              return "select"
            }
          },
          // tooltip: true,
          selectVal: (row) => {
            return this.getParamKeySelectList(row,"2");
          },
        },
        // {
        //   prop: "connector2",
        //   label: "连接符",
        //   width: "100",
        //   type: "select",
        //   selectVal: [
        //     { type: "）", value: "）" },
        //     { type: "", value: "" },
        //   ],
        // },
        {
          label: "操作",
          type: "button",
          width: "100",
          buttonList: [
            {
              desc: "添加",
              operate: "add",
            },
            {
              desc: "删除",
              operate: "deleteCondition",
              relation: function (scope) {
                return scope.row.index !== "1"
              }
            },
          ],
        },
      ],
      typeList: [
        {
          type: "新增",
          value: "新增",
        },
        {
          type: "编辑",
          value: "编辑",
        },
        {
          type: "删除",
          value: "删除",
        },
        {
          type: "查询",
          value: "查询",
        },
      ],
      dataTableColumn: [],
      tableDataList: [],
      currentActionType: "查询",
      typeInterface:""
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
      return this.cpnParamsRecord != JSON.stringify(this.formData) && this.actionIdRecord == this.currentObj.actionId
    }
  },
  methods: {
    async getParams(e, obj) {
      console.log("getParams", e, obj);
      this.currentObj = e;
      if (!e.compositeId) {
        // this.formData = {
        //   actionDesc: e.actionName,
        //   actionMsg: "",
        //   actionType: "查询",
        //   dataColletChiNm: "",
        //   actionDataId: "",
        //   actionDataList: "[]",
        //   judgeList: "[]",
        // }
        e.conf.map(item => {
          this.formData[item.name] = item.value
        })
        return;
      } else {
        const params = {
          d4StusCd: "1",
          blngtoTyp: this.blngtoTyp,
          compositeId: e.compositeId || "",
        };
        const res =this.typeInterface == "interfaceType" ? await this.rpc.apimgmt.getServiceCpnParams(params) : await this.rpc.d4.getServiceCpnParams(params);
        this.cpnData = res;
        res.confList.map((item) => {
          this.formData[item.confKey] = item.confValue;
        });
        this.currentActionType = this.formData.actionType
      }
      this.setCpnParamsRecord()
    },
    async saveParams() {
      if(this.currentActionType !== this.formData.actionType) {
        this.formData.actionType = this.currentActionType
      }
      const e = this.currentServObj;
      let paramList = []
      if(this.formData.actionType == "查询") {
        paramList = this.tableDataList.map((item,index) => {
          return {
            paramName: item.paramKey,
            paramCName: item.paramKey,
            paramKey: item.paramId,
            paramType: item.paramType,
            paramLength: item.paramLength,
            paramParentId: "1",
            paramDirection: "1",
            paramOrder: "1." + (index + 1 )
          }
        })
        paramList.push({
          paramName: this.formData.dataColletChiNm,
          paramCName: this.formData.dataColletChiNm,
          paramKey: this.formData.dataColletEngNm,
          paramType: "List",
          paramLength: "",
          paramDirection: "1",
          paramOrder: "1",
        })
      }
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
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: e.apiId,
        paramList: paramList,
        confList,
        compositeId: this.currentObj.compositeId || "",
      };
      const { compositeId } =this.typeInterface == "interfaceType"?await this.rpc.apimgmt.saveServiceCpnParams(params): await this.rpc.d4.saveServiceCpnParams(params)
      params.compositeId = compositeId
      this.rpc.s4design.addFuntionJobCommitFlow({
        fnctId: this.$route.query.fnctId,
        jobTpCd: 'C4',
      })
      this.setCpnParamsRecord()
      this.$emit("upDateServParams", JSON.parse(JSON.stringify(this.currentObj)), params);
      // this.$emit("toSave", true);
    },
    setCpnParamsRecord() {
      this.cpnParamsRecord = JSON.stringify(this.formData)
      this.actionIdRecord = this.currentObj.actionId
    },
    async showDialog() {
      this.getDataList();
      this.$nextTick(() => {
        // console.log(JSON.parse(JSON.stringify(this.dataList)));
        // this.tableColumn.find(
        //   (item) => item.prop == "triggerCpnName"
        // ).selectVal = this.dataList
        //   .filter((item) => item.actionId != this.currentObj.actionId)
        //   .map((item) => {
        //     return {
        //       type: item.actionName,
        //       value: item.actionName,
        //     };
        //   });
        // // this.setParamKeySelectList()
        // try {
        //   this.tableData = JSON.parse(
        //     this.cpnData.confList.find((item) => item.confKey == "paramList")
        //       .confValue
        //   );
        // } catch (error) {
        //   console.log(error);
        // }
        if(this.currentActionType == this.formData.actionType) {
          this.tableDataList = JSON.parse(this.formData.actionDataList);
          // this.tableData = JSON.parse(this.formData.judgeList) || [
          //   {
          //       index: "1",
          //       relation: "",
          //       connector1: "",
          //       apSource1: "99",
          //       paramValue1: "1",
          //       condTyp: "=",
          //       apSource2: "99",
          //       paramValue2: "1",
          //       connector2: ""
          //     }
          // ];
          const list = JSON.parse(this.formData.judgeList)
          this.tableData = list.length > 0 ? list : [{
            index: "1",
            relation: "",
            connector1: "",
            apSource1: "99",
            paramValue1: "1",
            condTyp: "=",
            apSource2: "99",
            paramValue2: "1",
            connector2: ""
          }]
        } else {
          this.tableDataList = []
          this.tableData = [
            {
                index: "1",
                relation: "",
                connector1: "",
                apSource1: "99",
                paramValue1: "1",
                condTyp: "=",
                apSource2: "99",
                paramValue2: "1",
                connector2: ""
              }
          ]
        }
        if(this.formData.actionType == "删除" || this.formData.actionType == "查询") {
          this.dataTableColumn = [
            {
              prop: "paramKey",
              label: "参数key",
              width: "120",
              type: "text",
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
          this.dataTableColumn = [
            {
              prop: "paramKey",
              label: "参数key",
              width: "120",
              type: "text",
              // selectVal: [],
            },
            {
              prop: "apSource",
              label: "参数来源",
              width: "120",
              type: "select",
              selectVal: [
                { type: "固定值", value: "99" },
                { type: "服务输入参数", value: "00" },
                { type: "服务临时参数", value: "10" },
                { type: "组件输出参数", value: "20" },
              ],
            },
            {
              prop: "paramValue",
              label: "参数值",
              width: "120",
              type: function(row) {
                if (row.apSource == "99") {
                  return "input"
                } else {
                  return "select"
                }
              },
              selectVal: (row) => {
                return this.getParamKeySelectListD(row);
              },
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
        }
      });
      await this.getPageDataList()
      this.dialogVisible = true;
    },
    async getPageDataList() {
      const res = await this.rpc.d5.getPageDataList({dataColletId: this.formData.dataColletId})
      // console.log(123,res.dictInfos);
      this.aMenuList = res.dictInfos.map((item) => {
        item.menuId = item.dictryNo
        item.menuName = item.dictryNm
        return item
      })
    },
    apSourceFilters(value) {
      switch (value) {
        case "00":
          return "服务输入参数."
        case "10":
          return "临时参数."
        case "20":
          return "组件输出参数."
        case "99":
          return ""
        case "30":
          return "数据集."
        default:
          return value
      }
    },
    //保存编辑条件配置
    saveDialog(flag = true) {
      if(this.formData.actionType == "新增") {
        if(this.tableDataList.length == 0) return this.$message.error("抱歉，无法对空数据进行操作！！")
        this.formData.actionDataList = JSON.stringify(this.tableDataList)
        const desc = this.tableDataList.reduce((prev, item, index) => {
          return `${prev}  数据集.${item.paramKey} 赋值为 ${this.apSourceFilters(item.apSource)}${item.paramValue} 的值;`;
        }, "");
        this.formData.actionMsg = `在${this.formData.dataColletChiNm}中新增一条数据：` + desc;
      } else if (this.formData.actionType == "删除") {
        this.formData.actionDataList = JSON.stringify(this.tableDataList)
        this.formData.judgeList = JSON.stringify(this.tableData)
        const desc = this.tableData.reduce((prev, item, index) => {
          return `${prev} ${item.relation} ${this.apSourceFilters(item.apSource1)}${item.paramValue1} ${item.condTyp} ${this.apSourceFilters(item.apSource2)}${item.paramValue2}`;
        }, "");
        this.formData.actionMsg = `将满足条件为` + desc + `的${this.formData.dataColletChiNm}的数据删除` ;
      } else if (this.formData.actionType == "编辑") {
        if(this.tableDataList.length == 0) return this.$message.error("抱歉，无法对空数据进行操作！！")
        this.formData.actionDataList = JSON.stringify(this.tableDataList)
        this.formData.judgeList = JSON.stringify(this.tableData)
        const desc = this.tableData.reduce((prev, item, index) => {
          return `${prev} ${item.relation} ${this.apSourceFilters(item.apSource1)}${item.paramValue1} ${item.condTyp} ${this.apSourceFilters(item.apSource2)}${item.paramValue2}`;
        }, "");
        const descD = this.tableDataList.reduce((prev, item, index) => {
          return `${prev}  数据集.${item.paramKey} 赋值为 ${this.apSourceFilters(item.apSource)}${item.paramValue} 的值;`;
        }, "");
        this.formData.actionMsg = `将满足条件为` + desc + `的${this.formData.dataColletChiNm}的数据修改如下：` + descD;
      } else {
        if(this.tableDataList.length == 0) return this.$message.error("抱歉，无法对空数据进行操作！！")
        this.formData.actionDataList = JSON.stringify(this.tableDataList)
        this.formData.judgeList = JSON.stringify(this.tableData)
        const desc = this.tableData.reduce((prev, item, index) => {
          return `${prev} ${item.relation} ${this.apSourceFilters(item.apSource1)}${item.paramValue1} ${item.condTyp} ${this.apSourceFilters(item.apSource2)}${item.paramValue2}`;
        }, "");
        const descD = this.tableDataList.reduce((prev, item, index) => {
          return `${prev} ${prev ? "、" : ""} ${item.paramKey}`;
        }, "");
        this.formData.actionMsg = `查询出满足条件为` + desc + `的${this.formData.dataColletChiNm}，查询数据如下：` + descD;
      }
      this.dialogVisible = false;
      this.currentActionType = this.formData.actionType
    },
    menuClick(e) {
      if(this.formData.actionType == "删除") return
      e.isActive = true
      this.tableDataList.push({paramKey: e.menuName, paramId: e.menuId, paramType: e.dictryTyp, paramLength: e.dictryLength, paramValue: "", apSource: ""})
      this.tableDataList = unduplicated(this.tableDataList, "paramId")
      // console.log(e);
    },
    //取消编辑条件配置
    closeDialog() {
      // this.formData.actionType = this.currentActionType
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
      } else if(operation == "add") {
        this.tableData.push({
          relation: "并且",
          connector1: "",
          apSource1: "",
          paramValue1: "",
          condTyp: "",
          apSource2: "",
          paramValue2: "",
          connector2: ""
        })
      }
    },
    dataOperate(operation, data) {
      console.log(operation, data);
      if (operation == "deleteCondition") {
        const index = this.tableDataList.indexOf(data);
        this.aMenuList.forEach((item) => {
          if(item.menuId == data.paramId) {
            item.isActive = false
          }
        })
        this.tableDataList.splice(index, 1);
      }
    },
    selectChange(row, prop) {
      console.log("selectChange", row, prop);
      if (prop == "apSource1") {
        // 参数来源下拉框变更时
        // this.resetRow(row);
        row.paramValue1 = ""
        if (row.apSource1 == "20") {
          this.$refs.selectDialogRef.showDialog(row, this.currentObj, "1");
        }
      } else if (prop == "apSource2") {
        // 参数来源下拉框变更时
        // this.resetRow(row);
        row.paramValue2 = ""
        if (row.apSource2 == "20") {
          this.$refs.selectDialogRef.showDialog(row, this.currentObj, "2");
        }
      } else if (prop == "paramValue1") {
        if(row.apSource1 == "30") {
          row.paramKey1 = row.paramValue1
          const list = this.aMenuList.filter((item) => {return item.dictryNo == row.paramKey1})
          row.paramCName1 = list[0].dictryNm
          row.paramType1 = list[0].dictryTyp
          row.paramLength1 = list[0].dictryLength
        } else {
          row.paramKey1 = row.paramValue1
          const list = this.currentServObj.puApiParams.filter((item) => {return item.paramKey == row.paramKey1})
          row.paramCName1 = list[0].paramCName
          row.paramType1 = list[0].paramType
          row.paramLength1 = list[0].paramLength
        }
      } else if (prop == "paramValue2") {
        if(row.apSource2 == "30") {
          row.paramKey2 = row.paramValue1
          const list = this.aMenuList.filter((item) => {return item.dictryNo == row.paramKey2})
          row.paramCName2 = list[0].dictryNm
          row.paramType2 = list[0].dictryTyp
          row.paramLength2 = list[0].dictryLength
        } else {
          row.paramKey2 = row.paramValue2
          const list = this.currentServObj.puApiParams.filter((item) => {return item.paramKey == row.paramKey2})
          row.paramCName2 = list[0].paramCName
          row.paramType2 = list[0].paramType
          row.paramLength2 = list[0].paramLength
        }
      }
    },
    dataSelectChange(row, prop) {
      console.log("dataSelectChange", row, prop);
      if (prop == "apSource") {
        // 参数来源下拉框变更时
        row.paramValue = ""
        if (row.apSource == "20") {
          this.$refs.selectDialogRef.showDialog(row, this.currentObj, "d");
        }
      } else if (prop == "paramValue") {
        // row.paramKey = row.paramValue
        const list = this.currentServObj.puApiParams.filter((item) => {return item.paramKey == row.paramValue})
        row.paramCName = list[0].paramCName
        row.paramType = list[0].paramType
        row.paramLength = list[0].paramLength
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
    getParamKeySelectList(row,o) {
      if(o == "1") {
        if (row.apSource1 == "00") {
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
        } else if (row.apSource1 == "10") {
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
        } else if (row.apSource1 == "20") {
          // 组件输出
          return [];
        } else if (row.apSource1 == "30") {
          return this.aMenuList.map((item) => {
            return {
              type: item.menuName,
              value: item.menuId,
            };
          })
        }
      } else if(o == "2") {
        if (row.apSource2 == "00") {
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
        } else if (row.apSource2 == "10") {
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
        } else if (row.apSource2 == "20") {
          // 组件输出
          return [];
        } else if (row.apSource2 == "30") {
          return this.aMenuList.map((item) => {
            return {
              type: item.menuName,
              value: item.menuId,
            };
          })
        }
      }
    },
    getParamKeySelectListD(row) {
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
    getDataList() {
      this.$emit("getDataList");
    },
    // 选择数据集
    selectDataList() {
      this.$refs.selectDataRef.init();
    },
    selectDataConfirm(e) {
      this.formData.dataColletChiNm = e.dataColletChiNm;
      this.formData.dataColletEngNm = e.dataColletEngNm;
      this.formData.dataColletId = e.dataColletId
    },
    // 编辑数据集
    modDataList(e) {
      if (!this.formData.dataColletChiNm) return this.$message.error("请先选择数据集！");
      if (!e) return this.$message.error("请先选择操作类型！");
      this.showDialog()
    },
    checkAllClick() {
      if(this.aMenuList.length == this.tableDataList.length) {
        this.aMenuList.forEach((item) => {
          item.isActive = false
        })
        this.tableDataList = []
      } else {
        this.aMenuList.forEach((item) => {
          item.isActive = true
          this.tableDataList.push({paramKey: item.menuName, paramId: item.menuId, paramValue: "", apSource: ""})
        });
        this.tableDataList = unduplicated(this.tableDataList, "paramId")
      }
    },
    init() {
      if(this.$route.query.typeInterface){   //判断 作业太网关接口跳转过来
        this.typeInterface = this.$route.query.typeInterface ||""
      }
      this.sysId = this.$route.query.domainId;
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
  .attr_main {
    height: 100%;
    ::v-deep .el-table__cell {
      padding: 2px 0;
      .cell {
        span {
          font-size: 12px;
        }
      }
    }
    ::v-deep tr {
      .cell {
        font-size: 12px;
        padding: 0;
      }
    }
  }
  .attr_title {
    padding: 8px 10px;
    font-family: $font_medium;
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
    }
  }
  .attr_content {
    background-color: $base_bg_color;
    padding: 20px 10px;
  }
  .attr_box {
    height: 100%;
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
        width: 100%;
        margin-right: 10px;
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
      }
      .attr_show_item_c {
        width: 100%;
        &.textarea {
          ::v-deep .el-textarea__inner {
            min-height: 200px !important;
          }
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
    padding: 8px 10px;
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
    padding-bottom: 10px;
    background: $base_white;
    z-index: 10;
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
  .edit_form {
    margin-top: 10px;
    @include form;
  }
  .table {
    margin-top: 20px;
    padding: 0 16px;
    .table_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #131313;
      letter-spacing: 0;
      line-height: 48px;
      font-weight: 600;
    }
    .condition_desc_list {
      padding: 20px 0;
      .list_item {
        margin-bottom: 6px;
      }
    }
  }
  .sidebar_box {
    display: flex;
    // height: 400px;
    // overflow: auto;
    // justify-content: space-between
    // height: 83%;
  }
  .sidebar_box_left {
    flex: 1;
    // height: 100%;
    padding: 10px 16px 0 16px;
    // margin-right: 20px;
    .sidebar_title {
      padding-left: 19px;
      background-color: #fafafc;
      display: inline-block;
      width: 100%;
      font-size: 16px;
      color: #131313;
      font-weight: $font_weight_600;
      height: 48px;
      line-height: 48px;
      border-bottom: 1px solid #EBEEF5;
      .sidebar_button {
        float: right;
        padding-right: 16px;
        color: $theme_color;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
  .sidebar_box_right {
    flex: 4;
    padding: 10px 16px 0 0px;
  }
  .data_list_ul {
    border-right: 0;
    height: 352px;
    overflow: auto;
    border-left: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    padding-bottom: 16px;
    ::v-deep .is-active {
      color: #303133;
    }
    .data_list_ul_li {
      padding-left: 20px;
      margin: 5px 0;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      color: #303133;
      padding: 0 20px;
      list-style: none;
      cursor: pointer;
      position: relative;
    }
    .is_active {
      background-color: #ebf3ff;
    }
  }
}
</style>
