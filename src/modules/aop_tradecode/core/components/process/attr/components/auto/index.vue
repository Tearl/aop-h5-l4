<template>
  <div class="aop_tradecode_comps_design_attr_assign_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>{{componentTitle}}</div>
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
          <!-- <div class="transition_arrange">
            <div class="table_header">
              <div class="attr_pre_title mb0">
                <div class="attr_pre_title_b bold">赋值表达式</div>
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
                <Table
                  :key="tableKey"
                  class="table"
                  :data="tableData"
                  :table="tableColumn"
                  @operate="operate"
                ></Table>
              </div>
              <div class="tips_info" v-if="!canSave && !currentObj.actionParentId">
                <el-tag type="warning">保存交易编排后，可对组件信息进行编辑</el-tag>
              </div>
            </div>
          </div> -->
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
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table_workgate";
import SelectAssignedSource from "./components/selectAssignedSource"
import SetResult from "./components/setResult"
import filters from "@m/utils/filters";
import { setParamOrder } from "@m/utils/paramTree";

export default {
  mixins: [mixin],
  components: {
    Table,
    SelectAssignedSource,
    SetResult,
  },
  inject: ["getDataList"],
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
      },
      currentObj: {},
      cpnData: {},
      cpnParamsRecord: {},
      actionIdRecord: "",
      // tableData: [],
      transId: "",
      expressionList: [],
      tableKey: "",
      assignType: "",
      tableDataForOutput: []
    };
  },
  computed: {
    componentTitle() {
      console.log(this.currentObj)
      const str = this.currentObj.actionName
      const numberStr = '0123456789'
      let title = ''
      if (str && str.length) {
        for (let i = 0; i < str.length; i++) {
          const item = str[i];
          if (!numberStr.includes(item)) {
            title += item
          }
        }
      }

      return title
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
  methods: {
    // 获取conf配置项
    getConfItem(name, actionId) {
      const dataList = this.currentParentCpnInfo?.dataList || this.getDataList()
      const cpn = dataList.find(data => data.actionId == actionId)
      return cpn?.conf.find(item => item.name == name) || {}
    },
    async getParams(e, obj) {
      console.log("getParams", e, obj);
      console.log('pppppppppppppppp')
      this.currentObj = e
      if (!e.compositeId) {
        e.conf.map(item => {
          this.formData[item.name] = item.value
        })
        // this.addTableRow()
        // this.addOutputTableRow()
        return;
      } else {
        // const params = {
        //   d4StusCd: "1",
        //   blngtoTyp: this.blngtoTyp,
        //   compositeId: e.compositeId || "",
        // };
        // const res = await this.rpc.d4.getServiceCpnParams(params);
        this.cpnData = e
        e.confList.map(item => {
          this.formData[item.confKey] = item.confValue
        })
        // 更新实时位置序号
        let arr = ["actionSeq", "actionFrntSeq", "actionPostSeq"]
        arr.forEach((key) => {
          this.formData[key] = this.getConfItem(key, e.actionId)?.value || ""
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
      const e = this.currentServObj
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
            compositeId: e.compositeId || "",
          })
        }
      }
      // setParamOrder(this.tableDataForOutput)
      // this.tableDataForOutput.forEach(item => {
      //   if (item.actionId == this.currentServObj?.svcId) item.actionId = ""
      // })
      // const paramList = JSON.parse(JSON.stringify(this.tableDataForOutput))
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: this.fourRAttrFlag ? this.currentParentCpnInfo.compositeId : this.currentServObj.apiId,
        paramList: [],
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
    // operate(operation, data) {
    //   console.log("operate", operation, data)
    //   if (["assignedSource0", "assignedSource1", "assignedSource2"].includes(operation)) {
    //     this.$refs.selectAssignedSourceRef.showDialog(operation, data, this.formData)
    //   } else if (operation == "delete") {
    //     const index = this.tableData.indexOf(data)
    //     this.tableData.splice(index, 1)
    //   }
    // },
    // addTableRow() {
    //   this.expressionList = [
    //     {
    //       actionId: this.currentServObj?.svcId,
    //       actionNm: "当前4b交易",
    //       paramValue: "", // 参数值，类型为固定值时使用
    //       paramKey: "",
    //       paramNm: "",
    //       paramType: "",
    //       apSource: "00", // 00-当前4b 10-固定值 20-L5服务
    //       order: "0", // 00-当前4b 10-固定值 20-L5服务
    //       operator: "=", // 00-当前4b 10-固定值 20-L5服务
    //     },
    //     {
    //       actionId: this.currentServObj?.svcId,
    //       actionNm: "当前4b交易",
    //       paramValue: "", // 参数值，类型为固定值时使用
    //       paramKey: "",
    //       paramNm: "",
    //       paramType: "",
    //       apSource: "00", // 00-当前4b 10-固定值 20-L5服务
    //       order: "1", // 00-当前4b 10-固定值 20-L5服务
    //       operator: "+", // 00-当前4b 10-固定值 20-L5服务
    //     },
    //     // {
    //     //   actionId: this.currentServObj?.svcId,
    //     //   actionNm: "当前4b交易",
    //     //   paramValue: "", // 参数值，类型为固定值时使用
    //     //   paramKey: "",
    //     //   paramNm: "",
    //     //   paramType: "",
    //     //   apSource: "00", // 00-当前4b 10-固定值 20-L5服务
    //     //   order: "2", // 00-当前4b 10-固定值 20-L5服务
    //     //   operator: "", // 00-当前4b 10-固定值 20-L5服务
    //     // },
    //   ]
    //   this.tableKey = +new Date()
    // },
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
      display: flex;
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
        // width: 100%;
        margin-right: 10px;
        margin-bottom: 10px;
        max-width: 100px;
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
      }
      .attr_show_item_c {
        width: auto;
        flex: 1;
        .click_text {
          color: $theme_color;
          cursor: pointer;
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
}
</style>
