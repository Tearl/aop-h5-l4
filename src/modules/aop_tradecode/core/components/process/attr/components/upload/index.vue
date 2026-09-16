<template>
  <div class="aop_tradecode_comps_design_attr_upload_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>upload</div>
      </div>
      <div class="attr_box" v-if="canSave">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t required">组件名称：</div>
            <div class="attr_show_item_c">
              <el-input
                disabled
                v-model="formData.actionDesc"
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t required">文件上传路径Key：</div>
            <div class="attr_show_item_c">
              <el-input
                disabled
                v-model="formData.uploadKey"
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="attr_send">
            <div class="attr_pre_title">
              <div class="attr_pre_title_b bold">输入参数</div>
              <!-- <el-checkbox v-model="isNeedCheck" @change="isNeedChange">非必输项</el-checkbox>
            <el-checkbox v-model="headerCheck">非报文头</el-checkbox> -->
              <div class="attr_show_item_b">
                <i
                  class="el-icon-more"
                  @click="switchTableMode('inputAtSetting')"
                ></i>
              </div>
            </div>
            <div class="attr_show_item_c">
              <Table
                class="table input_list"
                :data="tableData"
                :table="tableColumn"
                :rowK="'paramOrder'"
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
            <div class="attr_show_item_t">
              文件上传路径Key：<span class="attr_show_item_i">{{
                formData.uploadKey
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <SimulantSelect
        @update="updateData"
        @updateTableData="updateTableData"
        @changeEnumOption="changeEnumOption"
        ref="simulantSelectRef"
        :currentServObj="currentServObj"
        :currentObj="currentObj"
        :currentParentCpnInfo="currentParentCpnInfo"
        :fourRAttrFlag="fourRAttrFlag"
        :serviceIdMapToParamList="serviceIdMapToParamList">
      </SimulantSelect>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import { mixList, reList } from "@m/utils/paramTree";
import SimulantSelect from "../service_setting/simulantSelect"
import Table from "@m/core/components/page_table_workgate";
export default {
  mixins: [mixin],
  components: {
    SimulantSelect,
    Table,
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
    serviceIdMapToParamList: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // output组件编辑
      formData: {
        actionDesc: "output",
        actionMsg: "",
      },
      currentObj: {},
      cpnData: {},
      cpnParamsRecord: {},
      actionIdRecord: "",
      svcIdToSvcNm: {},
      transId: "",
      isEnumList: false,
      paramValueSelect: [],
      tableData: [],
      paramList: [],
      showAllInputParamsAtSetting: false,
      customChanged: false
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
      return (
        this.cpnParamsRecord != JSON.stringify(this.formData) &&
        this.actionIdRecord == this.currentObj.actionId
      );
    },
    canSave() {
      return !this.isRead && this.currentObj.compositeId;
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
            // prop: "apSource", // 当前4b交易00 L5服务20
            prop: "actionId",
            label: "来源",
            minWidth: "30%",
            type: "simulantSelect",
            placeholder: "请选择",
            inputStyle: {
              cursor: "pointer",
            },
            disabled: (scope) => {
              // if (scope.row.actionName !== '复合来源' && scope.row.paramParentId) {
              //   return true
              // } else {
              //   return false
              // }
              return scope.row.disabled2
            },
            filter: (scope) => {
              const { actionName, actionId, paraMapgNm } = scope.row
              if (actionId == 'constantValue') {
                return '枚举值'
                // if (paraMapgNm && paraMapgNm.includes('.') || this.customChanged) {
                //   return '枚举值'
                // }
                
              } else if(actionId == 'fixedValue') {
                return '固定值'
              } else if (!actionName && !actionId) {
                return ""
              } else if (["当前4b交易", "当前循环组件", '复合来源'].includes(actionName)) {
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
            disabled: (scope) => {
              // if (scope.row.actionName !== '复合来源' && scope.row.paramParentId) {
              //   return true
              // } else {
              //   return false
              // }
              return scope.row.disabled3
            },
            prop: (row) => {
              if (row?.actionId == "fixedValue") {
                return "paramMappingKey"
              } else {
                return "paraMapgNm"
              }
            },
            label: "来源值",
            minWidth: "30%",
            type: (row) => {
              if (row.paraMapgNm.includes('.') || this.customChanged) {
                  return "simulantSelect"
                } else if (row.actionId == "fixedValue") {
                return "input"
              }  else {
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
                const actionSeq = this.getConfItem("actionSeq", item?.actionId).value
                return `${actionName}(${actionSeq})`
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
              if (scope.row?.actionId == "fixedValue") {
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
        ]
      }
    },
    bodyOutData() {
      return this.tableData.find((item) => item.paramKey == "bodyOutData");
    },
  },
  inject: ["getDataList"],
  methods: {
    changeEnumOption() {
      this.customChanged = true
    },
    switchTableMode() {
      this.showAllInputParamsAtSetting = !this.showAllInputParamsAtSetting
    },
    updateTableData() {
      for (let i = 0; i < this.tableData.length; i++) {
        this.$set(this.tableData, i, {...this.tableData[i] });
      }
      console.log(this.tableData, 'updateTableData')
    },
    updateData(target, source) {
      target?.children?.map((item1) => {
        source?.children?.map((item2) => {
          if (item1.paramKey === item2.paramKey) {
            item1.paramMappingKey = target.paramMappingKey + '.' + item2.paramKey
            item1.paraMapgNm = item2.paramName
            item1.actionId = target.actionId
            item1.actionName = target.actionName
            item1.apSource = target.apSource
            console.log(item1.actionId, 'actionId')
          }
        })
      })
      this.tableData = [...this.tableData]
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
        // const list = JSON.parse(JSON.stringify(this.tableData))
        // this.tableData = []
        // this.$nextTick(() => {
        //   this.tableData = list
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
    // 获取conf配置项
    getConfItem(name, actionId) {
      const dataList =
        this.currentParentCpnInfo?.dataList || this.getDataList();
      const cpn = dataList.find((data) => data.actionId == actionId);
      return cpn?.conf.find((item) => item.name == name) || {};
    },
    async getParams(e, obj) {
      this.currentObj = e;
      if (e.compositeId) {
        // const params = {
        //   d4StusCd: "1",
        //   blngtoTyp: this.blngtoTyp,
        //   compositeId: e.compositeId || "",
        // };
        // const res = await this.rpc.d4.getServiceCpnParams(params);

        this.cpnData = e;
        
        if(e.paramList?.length) {
          this.tableData = e.paramList.filter((item) => {
            return item.paramDirection === '0'
          });
          this.paramList = e.paramList.filter((item) => {
            return item.paramPosition === '1'
          });
          console.log(this.tableData, this.paramList, "this.tableData")
          if (this.tableData.length === 0) {
            this.tableData = [
              {
                paramKey: 'uploadFilePath',
                paramName: '文件上传路径',
                paramType: 'String',
                actionId: '',
                paraMapgNm: '',
                paramOrder: '2',
                paramDirection: '0',
                paramPosition: '0',
                isNeed: '1',
                paramMappingKey: ''
              },
              {
                paramKey: 'maxUploadSize',
                paramName: ' 最大上传值 （单位 B）',
                paramType: 'long',
                actionId: '',
                paraMapgNm: '',
                paramOrder: '3',
                paramDirection: '0',
                paramPosition: '0',
                isNeed: '1',
                paramMappingKey: ''
              },
            ]
          }
        } else {
          if (this.tableData.length === 0) {
            this.tableData = [
              {
                paramKey: 'uploadFilePath',
                paramName: '文件上传路径',
                paramType: 'String',
                actionId: '',
                paraMapgNm: '',
                paramOrder: '2',
                paramDirection: '0',
                paramPosition: '0',
                isNeed: '1',
                paramMappingKey: ''
              },
              {
                paramKey: 'maxUploadSize',
                paramName: ' 最大上传值 （单位 B）',
                paramType: 'long',
                actionId: '',
                paraMapgNm: '',
                paramOrder: '3',
                paramDirection: '0',
                paramPosition: '0',
                isNeed: '1',
                paramMappingKey: ''
              },
            ]
          }
        }
        e.confList.map((item) => {
          this.formData[item.confKey] = item.confValue;
        });
        // 更新实时位置序号
        ["actionSeq", "actionFrntSeq", "actionPostSeq"].forEach((key) => {
          this.formData[key] = this.getConfItem(key, e.actionId)?.value || "";
        });
      } else {
        e.conf.map((item) => {
          this.formData[item.name] = item.value;
        });
      }
      this.setCpnParamsRecord();
    },
    async saveParams() {
      const paramList = [...this.tableData, ...this.paramList]
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
            compositeId: e?.compositeId || "",
          });
        }
      }
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: this.fourRAttrFlag
          ? this.currentParentCpnInfo.compositeId
          : this.currentServObj.apiId,
        paramList,
        confList,
        compositeId: this.currentObj.compositeId || "",
      };
      // const { compositeId } = await this.rpc.d4.saveServiceCpnParams(params);
      // params.compositeId = compositeId;
      this.$notify({
        title: "成功",
        message: "保存成功",
        duration: 2000,
        type: "success",
      });
      this.setCpnParamsRecord();
      this.$emit(
        "upDateServParams",
        JSON.parse(JSON.stringify(this.currentObj)),
        params
      );
    },
    setCpnParamsRecord() {
      this.cpnParamsRecord = JSON.stringify(this.formData);
      this.actionIdRecord = this.currentObj.actionId;
    },
    inputClick(scope, e) {
      // if (scope.row.paramParentId != this.bodyOutData?.paramOrder) return
      e.preventDefault();
      this.$refs.simulantSelectRef.init(scope, e);
    },
    rowClass({ row }) {
      if (this.isNeedCheck && row.isNeed == "0") {
        return "wraning_row";
      }
      if (this.headerCheck && row.paramPosition != "0") {
        return "wraning_row";
      }
      return "";
    },
    init() {
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
      this.svcIdToSvcNm = this.getDataList().reduce(
        (prev, data) => {
          if (
            ["D4bAction", "D5SelfAction", "D5LinkAction"].includes(
              data.actionType
            ) &&
            data.compositeId
          ) {
            prev[data.compositeId] = data.actionName;
          }
          return prev;
        },
        { [this.currentServObj?.svcId]: "当前4b交易" }
      );
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
.aop_tradecode_comps_design_attr_upload_attr {
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
  .attr_box {
    height: calc(100% - 47px);
    overflow-y: scroll;
    // padding-bottom: 30px;
    &.mt10 {
      margin-top: 10px;
    }
  }
  .attr_show {
    padding: 10px 20px 0;
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
      &.boder_bottom {
        border-bottom: 1px solid #e7e7ee;
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
    // padding: 8px 20px;
    ::v-deep .el-input__suffix {
      color: #333;
    }
  }
  .underLine {
    border-bottom: 1px solid $pri_br_color;
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
  .attr_btn {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    // width: calc(100% - 10px);
    width: 100%;
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
  .output_list {
    ::v-deep .el-input {
      .el-input__inner {
        cursor: pointer;
      }
      &.is-disabled {
        .el-input__inner {
          cursor: not-allowed;
        }
      }
    }
  }
  .tips_info {
    margin-top: 10px;
  }
}
</style>
