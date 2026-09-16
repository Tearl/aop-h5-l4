<template>
  <div class="aop_tradedesign_comps_design_attr_data_rule">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>规则处理组件</div>
      </div>
      <div class="attr_box">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t">组件名称：<span v-if="isRead" class="attr_show_item_i">{{formData.actionDesc}}</span></div>
            <div class="attr_show_item_c" v-if="!isRead">
              <el-input
                v-model="formData.actionDesc"
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="attr_send">
            <div class="attr_pre_title">
              <div>
                <span class="attr_pre_title_b">输入参数：</span>
                <span v-if="!isRead" class="icon" @click="addParams('s')">增加</span>
              </div>
              <i
                class="el-icon-arrow-down"
                :class="{ hidden: inputParamsVisibleAtSetting }"
                @click="changeParamsVisible('s')"
              >
              </i>
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
                @selectChange="(row, prop) => selectChange(row, prop, 's')"
                @selectBlur="selectBlur"
                @selectFocus="(row, prop) => selectFocus(row, prop, 's')"
                @operate="operate"
              ></Table>
            </div>
          </div>
          <div class="attr_recive">
            <div class="attr_pre_title">
              <div>
                <span class="attr_pre_title_b">输出参数：</span>
                <span v-if="!isRead" class="icon" @click="addParams('r')">增加</span>
              </div>
              <i
                class="el-icon-arrow-down"
                :class="{ hidden: outputParamsVisibleAtSetting }"
                @click="changeParamsVisible('r')"
              >
              </i>
            </div>
            <div class="attr_show_item_c" v-show="outputParamsVisibleAtSetting">
              <Table
                class="table"
                :data="outputParamsListAtSetting"
                :table="outputParamsColumnAtSetting"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
                @switchChange="switchChange"
                @inputChange="inputChange"
                @selectChange="(row, prop) => selectChange(row, prop, 'r')"
                @selectBlur="selectBlur"
                @selectFocus="(row, prop) => selectFocus(row, prop, 'r')"
                @operate="operate"
              ></Table>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">规则类型：<span v-if="isRead" class="attr_show_item_i">{{formData.actionRuleType}}</span></div>
            <div class="attr_show_item_c" v-if="!isRead">
              <el-select v-model="formData.actionRuleType" placeholder="">
                <el-option
                  v-for="item in ruleTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">规则描述：<span v-if="isRead" class="attr_show_item_i">{{formData.actionMsg}}</span></div>
            <div class="attr_show_item_c" v-if="!isRead">
              <el-input
                type="textarea"
                v-model="formData.actionMsg"
                placeholder="条件描述"
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

    <SelectDialog
      ref="selectDialogRef"
      :currentServObj="currentServObj"
      :fourRAttrFlag="fourRAttrFlag"
      :isRead="isRead"
      :dataList="dataList"
      @getDataList="getDataList"
      @selectConfirm="selectConfirm"
    ></SelectDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import SelectDialog from "./components/data_deal/select";
import { mixList, reList } from "@m/utils/paramTree";
import { unduplicated} from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    Table,
    SelectDialog,
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
    fourRAttrFlag: {
      type: Boolean,
      default: () => false,
    }
  },
  data() {
    return {
      formData: {
        actionDesc: "规则处理",
        actionMsg: "",
        actionRuleType: "顺序逻辑",
        // paramList: "[]"
      },
      paramList: [],
      // 输出数据
      tableData: [],
      tableColumn: [
        {
          prop: "paramCName",
          label: "参数中文名",
          minWidth: "60%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "isNeed",
          label: "是否必输",
          minWidth: "40%",
          type: "text",
          filter: "paraNed",
          tooltip: true,
        },
      ],
      currentObj: {},
      cpnData: {},
      inputParamsVisibleAtSetting: true,
      // 设置页签下的输入参数表格数据
      inputParamsListAtSetting: [],
      // 控制设置页签下的输出参数列表显示或隐藏
      outputParamsVisibleAtSetting: true,
      // 设置页签下的输出参数表格数据
      outputParamsListAtSetting: [],
      tableParamList: [],
      tableType: false,
      currentRow: {},
      cpnParamsRecord: {},
      actionIdRecord: "",
      ruleTypeOptions: [
        {label: "顺序逻辑", value: "顺序逻辑"},
        {label: "条件逻辑", value: "条件逻辑"},
        {label: "迭代逻辑", value: "迭代逻辑"},
        {label: "计算逻辑", value: "计算逻辑"},
        {label: "复杂逻辑", value: "复杂逻辑"},
      ],
      typeInterface:""
    };
  },
  computed: {
    blngtoTyp() {
      return this.currentServObj.apiServiceType.indexOf("D4") > -1
        ? "10"
        : "11";
    },
    inputParamsColumnAtSetting() {
      const result = [
        {
          prop: "apSource",
          label: "参数来源",
          minWidth: "40%",
          inputStyle: "width: 60%",
          type: this.isRead ? "text" : "select",
          // align: "center",
          selectVal: [
            {type: "服务输入参数", value: "00"},
            {type: "服务输出参数", value: "10"},
            {type: "服务临时参数", value: "30"},
            {type: "组件输出参数", value: "20"},
          ],
          filter: "apSource",
          disabled: (scope) => {
            // return scope.row.paramOrder ? scope.row.paramOrder.indexOf(".") != -1 : false
            return true
          }
        },
        {
          prop: "paramCName",
          label: "参数中文名称",
          minWidth: "60%",
          inputStyle: "width: 90%",
          type: this.isRead ? "text" : "select",
          // align: "center",
          selectVal: (row) => {
            return this.tableType ? this.tableParamList : this.getParamKeySelectList(row)
          },
          // disabled: () => this.isRead
        },
      ]
      if (!this.isRead) result.push({
        label: "操作",
        type: "button",
        width: "30",
        buttonList: [
          {
            desc: "删除",
            operate: "deleteInputParam",
          },
        ],
      })
      return result
    },
    outputParamsColumnAtSetting() {
      const result = [
        {
          prop: "apSource",
          label: "参数来源",
          minWidth: "40%",
          inputStyle: "width: 60%",
          type: this.isRead ? "text" : "select",
          // align: "center",
          selectVal: [
            {type: "服务输入参数", value: "00"},
            {type: "服务输出参数", value: "10"},
            {type: "服务临时参数", value: "30"},
            {type: "组件输出参数", value: "20"},
          ],
          filter: "apSource",
          disabled: (scope) => {
            // return scope.row.paramOrder ? scope.row.paramOrder.indexOf(".") != -1 : false
            return true
          }
        },
        {
          prop: "paramCName",
          label: "参数中文名称",
          minWidth: "60%",
          inputStyle: "width: 93%",
          type: this.isRead ? "text" : "select",
          // align: "center",
          selectVal: (row) => {
            return this.tableType ? this.tableParamList : this.getParamKeySelectList(row)
          },
          // disabled: () => this.isRead
        },
      ]
      if (!this.isRead) result.push({
        label: "操作",
        type: "button",
        width: "30",
        buttonList: [
          {
            desc: "删除",
            operate: "deleteOutputParam",
          },
        ],
      })
      return result
    },
    // 是否修改过组件的参数
    hasChangeCpnParams() {
      const _formData = JSON.parse(JSON.stringify(this.formData))
      _formData.inputParamsListAtSetting = this.inputParamsListAtSetting
      console.log("数据",this.inputParamsListAtSetting)
      _formData.outputParamsListAtSetting = this.outputParamsListAtSetting
      return this.cpnParamsRecord != JSON.stringify(_formData) && this.actionIdRecord == this.currentObj.actionId
    }  
  },
  methods: {
    async getParams(e, obj) {
      console.log("getParams", e, obj);
      this.currentObj = e;
       if (!e.compositeId) {
        e.conf.map(item => {
          this.formData[item.name] = item.value
        })
        this.inputParamsListAtSetting = []
        this.outputParamsListAtSetting = []
        return;
      } else {
        const params = {
          d4StusCd: "1",
          blngtoTyp: this.blngtoTyp,
          compositeId: e.compositeId || "",
        };
        const res =this.typeInterface == "interfaceType" ? await this.rpc.apimgmt.getServiceCpnParams(params) : await this.rpc.d4.getServiceCpnParams(params);
        this.cpnData = res;
        this.paramList = res.paramList;
        res.confList.map((item) => {
          this.formData[item.confKey] = item.confValue;
        });
        // const paramList = JSON.parse(this.formData.paramList)
        this.inputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == 0));
        this.outputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == 1));
        console.log("inputParamsListAtSetting",this.inputParamsListAtSetting);
      }
      this.setCpnParamsRecord()
    },
    async saveParams() {
      const e = this.currentServObj;
      console.log(this.currentServObj.puApiParams);
      const input = this.inputParamsListAtSetting.map(item => {
        item.paramName = item.paramCName
        return item
      })
      console.log("数据-saveParams",this.inputParamsListAtSetting)
      const output = this.outputParamsListAtSetting.map(item => {
        item.paramName = item.paramCName
        return item
      })
      this.paramList = mixList(input, "children").concat(
        mixList(output, "children")
      )
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
        paramList: this.paramList,
        confList,
        compositeId: this.currentObj.compositeId || "",
      };
      const { compositeId } =this.typeInterface == "interfaceType"?await this.rpc.apimgmt.saveServiceCpnParams(params): await this.rpc.d4.saveServiceCpnParams(params);
      params.compositeId = compositeId
      this.setCpnParamsRecord()
      this.$emit("upDateServParams", JSON.parse(JSON.stringify(this.currentObj)), params,this.typeInterface);
      // this.$emit("toSave", true);
    },
    setCpnParamsRecord() {
      const _formData = JSON.parse(JSON.stringify(this.formData))
      _formData.inputParamsListAtSetting = this.inputParamsListAtSetting
      _formData.outputParamsListAtSetting = this.outputParamsListAtSetting
      this.cpnParamsRecord = JSON.stringify(_formData)
      this.actionIdRecord = this.currentObj.actionId
      console.log("数据-setCpnParamsRecord",this.inputParamsListAtSetting)
    },
    //反案例切换
    switchChange(e, o) {
      console.log("switchChange", e, o);
    },
    // 反显输入报文
    inputChange(e, o) {
      console.log("inputChange", e, o);
    },
    selectBlur(e, row) {
      console.log("selectBlur", e, row);
      if (!e) return;
      row.paramValue = e.target.value;
      this.inputChange(row);
    },
    changeParamsVisible(e) {
      if (e == "s") {
        this.inputParamsVisibleAtSetting = !this.inputParamsVisibleAtSetting;
      } else {
        this.outputParamsVisibleAtSetting = !this.outputParamsVisibleAtSetting;
      }
    },
    addParams(e) {
      console.log("addParams", e)
      if (e == "s") {
        // this.inputParamsListAtSetting.push({
        //   paramCName: "",
        //   apSource: "",
        //   paramDirection: "0",
        // })
        this.$refs.selectDialogRef.showDialog(this.currentObj,"s")
      } else {
        // this.outputParamsListAtSetting.push({
        //   paramCName: "",
        //   apSource: "",
        //   paramDirection: "1",
        // })
        this.$refs.selectDialogRef.showDialog(this.currentObj,"r")
      }
    },
    getParamKeySelectList(row,list) {
      if (row.apSource == "00") { // 服务输入参数
        const p = this.currentServObj.puApiParams.filter(item => item.paramDirection === "0")
        return p.map(item => {
          return {
            type: item.paramCName,
            value: item.paramKey
          }
        })
      } else if (row.apSource == "10") { // 服务临时参数
        const p = this.currentServObj.puApiParams.filter(item => item.paramDirection === "3")
        return p.map(item => {
          return {
            type: item.paramCName,
            value: item.paramKey
          }
        })
      } else if (row.apSource == "20") { // 组件输出
        console.log(list);
        return list
      }
    },
    selectChange(row, prop, type) {
      console.log("selectChange", row, prop, type)
      if (prop == "apSource") { // 参数来源下拉框变更时
        this.resetRow(row)
        if (row.apSource == "20") {
          this.currentRow = row
          this.$refs.selectDialogRef.showDialog(row, this.currentObj,type)
        }
      } else if (prop == "paramCName") {
        if(row.apSource == "20") {
          if(!row.paramCName) return
          row.paramKey = row.paramCName
          const list = this.tableParamList.filter((item) => {return item.paramKey == row.paramKey})
          row.paramCName = `${row.actionName}.${list[0].paramCName}`
          row.paramType = list[0].paramType
          row.paramOrder = list[0].paramOrder
          row.paramLength = list[0].paramLength
          row.children = list[0].paramType == "List" || list[0].paramType == "Object" ? this.getChildren(row,type,list[0].paramOrder) : []
          if(type == "s") {
            this.inputParamsListAtSetting = JSON.parse(JSON.stringify(this.inputParamsListAtSetting))
          } else {
            this.outputParamsListAtSetting = JSON.parse(JSON.stringify(this.outputParamsListAtSetting))
          }
        } else {
          if(!row.paramCName) return
          row.paramKey = row.paramCName
          const list = this.currentServObj.puApiParams.filter((item) => {return item.paramKey == row.paramKey})
          row.paramCName = list[0].paramCName
          row.paramType = list[0].paramType
          row.paramLength = list[0].paramLength
          row.paramOrder = list[0].paramOrder
        }
      }
      console.log("数据-selectChange",this.inputParamsListAtSetting)
    },
    getChildren(row,type,id) {
      const list =  this.tableParamList.filter((item) => {
        if(item.paramParentId == id) {
          item.apSource = "20"
          item.paramDirection = type == "s" ? "0" : "1"
          item.paramName = item.paramCName
          item.actionId = row.actionId
          item.actionName = row.actionName
          item.paramCName = `${row.actionName}.${item.paramCName}`
          item.children = item.paramType == "List" || item.paramType == "Object" ? this.getChildren(item,type,item.paramOrder) : []
          return item
        }
      })
      return list
    },
    selectFocus(row, prop, type) {
      if(prop == "paramCName" && row.apSource == "20") {
        this.tableType = true
        console.log("selectFocus", row, prop, type)
        const target = this.dataList.find(item => item.actionId == row.actionId)
        if (target.actionType == "dataDealAction") {
          this.getDataDealOutputParmas(target,type)
        } else {
          this.getServiceCpnDefaultParams(target,type)
        }
      } else {
        this.tableType = false
      }
    },
    getDataDealOutputParmas(e,type) {
      console.log("getDataDealOutputParmas", e)
      this.tableParamList = e.paramList.filter((item) => item.paramDirection == "1")
      this.tableParamList = this.tableParamList.map((item) => {
        item.type = item.paramCName,
        item.value = item.paramKey
        return item
      })
    },
    async getServiceCpnDefaultParams(e,type) {
      console.log("getServiceCpnDefaultParams", e)
      const params = {
        d4StusCd: "1",
        blngtoTyp: "10",
        apiId: e.conf.find(item => item.name == "svcId").value,
        d4bApiId: this.currentServObj.apiId
      }
      const res = await this.rpc.d4.getServiceCpnDefaultParams(params)
      // this.inputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == "0"));
      // this.paramList = res.paramList.filter((item) => item.paramDirection == "1")
      this.tableParamList = res.paramList.filter((item) => item.paramDirection == "1")
      this.tableParamList = this.tableParamList.map((item) => {
        item.type = item.paramCName,
        item.value = item.paramKey
        return item
      })
    },
    resetRow(row) {
      console.log("resetRow")
      row.paramCName = ""
      row.children = []
    },
    getDataList() {
      this.$emit("getDataList")
    },
    getNodeList(list,type,data,defaultActive) {
      if(list && list.length > 0) {
        return list.map((item) => {
          item.apSource = defaultActive == "servInput" ? "00" 
              : defaultActive == "servOutput" ? "10"
              : defaultActive == "cpnOutput" ? "20" : "30",
          item.paramDirection = type == "s" ? "0" : "1"
          item.paramCName = defaultActive == "cpnOutput" ? `${data.actionName}.${list[0].paramCName}` : item.paramCName
          item.paramName = item.paramCName
          item.actionId = data.actionId
          item.actionName = data.actionName
          if(item.children && item.children.length > 0) {
            item.children = this.getNodeList(item.children,type,data,defaultActive)
          }
          return item
        })
      } else {
        return []
      }
    },
    selectConfirm(e,tableData,paramList,type,defaultActive) {
      console.log("确定后的数据",tableData[0].children[2])
      if(tableData.length > 0) {
        if(type == "s") {
          console.log("S的数据",tableData)
          tableData.forEach((item,index) => {
            const list = paramList.filter((data) => data.paramKey == item.paramKey)
            this.inputParamsListAtSetting.push({
              apSource: defaultActive == "servInput" ? "00" 
              : defaultActive == "servOutput" ? "10"
              : defaultActive == "cpnOutput" ? "20" : "30",
              paramDirection: "0",
              paramKey: item.paramKey,
              paramName: item.paramCName,
              paramType: item.paramType,
              paramOrder: item.paramOrder,
              actionId: e.actionId,
              actionName: e.actionName,
              paramCName: defaultActive == "cpnOutput" ? `${e.actionName}.${list[0].paramCName}` : list[0].paramCName,
              children: this.getNodeList(item.children,type,e,defaultActive) || []
            })
          })
          this.inputParamsListAtSetting = JSON.parse(JSON.stringify(this.inputParamsListAtSetting))
          this.inputParamsListAtSetting = unduplicated(this.inputParamsListAtSetting,"paramKey")
        } else {
          tableData.forEach((item,index) => {
            const list = paramList.filter((data) => data.paramKey == item.paramKey)
            this.outputParamsListAtSetting.push({
              apSource: defaultActive == "servInput" ? "00" 
              : defaultActive == "servOutput" ? "10"
              : defaultActive == "cpnOutput" ? "20" : "30",
              paramDirection: "1",
              paramKey: item.paramKey,
              paramName: item.paramCName,
              paramType: item.paramType,
              paramOrder: item.paramOrder,
              actionId: e.actionId,
              actionName: e.actionName,
              paramCName: defaultActive == "cpnOutput" ? `${e.actionName}.${list[0].paramCName}` : list[0].paramCName,
              children: this.getNodeList(item.children,type,e,defaultActive) || []
            })
          })
          this.outputParamsListAtSetting = JSON.parse(JSON.stringify(this.outputParamsListAtSetting))
          this.outputParamsListAtSetting = unduplicated(this.outputParamsListAtSetting,"paramKey")
        }
      }
      console.log("数据-selectConfirm",this.inputParamsListAtSetting)
    },
    operate(operation, data) {
      console.log(operation, data)
      if (operation == "deleteInputParam") {
        this.delParams(this.inputParamsListAtSetting,data.paramOrder)
        // const index = this.inputParamsListAtSetting.indexOf(data)
        // this.inputParamsListAtSetting.splice(index, 1)
      } else if (operation == "deleteOutputParam") {
        this.delParams(this.outputParamsListAtSetting,data.paramOrder)
        // const index = this.outputParamsListAtSetting.indexOf(data)
        // this.outputParamsListAtSetting.splice(index, 1)
      }
    },
    // 删除报文参数
    delParams(arrs, id) {
      let i = 0;
      while (arrs[i]) {
        if (arrs[i].paramOrder == id) {
          arrs.splice(i, 1);
          let d = 0;
          if (id.indexOf(".") != -1) {
            d = id.substring(0, id.length - 1);
          }
          for (let i = 0; i < arrs.length; i++) {
            arrs[i].paramOrder = d + (i + 1) + "";
          }
          return;
        }
        if (arrs[i].children && arrs[i].children.length > 0) {
          this.delParams(arrs[i].children, id);
        }
        i++;
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
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_design_attr_data_rule {
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
    margin-bottom: 6px;
    .el-icon-arrow-down {
      cursor: pointer;
      &.hidden {
        transform: rotate(180deg);
      }
    }
    .attr_pre_title_b {
      color: $reg_ft_color;
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
    // padding: 8px 10px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .attr_recive {
    // padding: 8px 10px;
    font-weight: 600;
    margin-bottom: 16px;
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
    border-left: 2px solid #dcdfe6;
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
}
</style>
