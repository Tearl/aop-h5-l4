<template>
  <div class="aop_tradecode_comps_design_attr_splice_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>拼接组件</div>
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
            <div class="table_header">
              <div class="attr_pre_title mb0">
                <div class="attr_pre_title_b bold">拼接字段列表</div>
              </div>
              <el-button
                v-if="canSave"
                type="primary"
                size="mini"
                class="mt10"
                @click="addTableRow"
                >添加</el-button
              >
            </div>
            <div class="table_body mb20">
              <div class="attr_show_item_c">
                <Table
                  class="table"
                  :data="tableData"
                  :table="tableColumn"
                  @operate="operate"
                ></Table>
              </div>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t required">拼接格式：</div>
            <div class="attr_show_item_c">
              <el-select v-model="formData.format" class="w100p" placeholder="请选择">
                <el-option
                  v-for="item in formatOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          
          <div v-if="formData.format == 'field'" class="attr_show_item">
            <div class="attr_show_item_t">拼接符号：</div>
            <div class="attr_show_item_c">
              <el-input
                v-model="formData.symbol"
                size="mini"
                placeholder="请输入"
              ></el-input>
            </div>
          </div>
          <div class="table_wrapper">
            <div class="table_header">
              <div class="attr_pre_title mb0">
                <div class="attr_pre_title_b bold">输出结果</div>
              </div>
            </div>
            <div class="table_body mb20">
              <div class="attr_show_item_c">
                <Table
                  class="table"
                  :data="tableDataForOutput"
                  :table="tableColumnForOutput"
                  @operate="operate"
                ></Table>
              </div>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">示例：</div>
            <JsonViewer
              v-if="formData.format == 'JSON'"
              class="io_data"
              :value="outputResult"
              :expand-depth="2"
              copyable
              sort
            ></JsonViewer>
            <div v-else class="attr_show_item_c">
              <el-input
                readonly
                type="textarea"
                :value="outputResult"
                placeholder="输出结果"
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="tips_info" v-if="!canSave && !currentObj.actionParentId">
            <el-tag type="warning"
              >保存交易编排后，可对组件信息进行编辑</el-tag
            >
          </div>
        </div>
        <div v-if="canSave" class="attr_btn">
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
            <div class="attr_show_item_t">
              组件名称：<span class="attr_show_item_i">{{
                formData.actionDesc
              }}</span>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              组件描述：<span class="attr_show_item_i">{{
                formData.actionMsg
              }}</span>
            </div>
          </div>
          <div class="table_wrapper">
            <div class="table_header">
              <div class="attr_pre_title mb0">
                <div class="attr_pre_title_b bold">拼接字段列表</div>
              </div>
            </div>
            <div class="table_body mb20">
              <div class="attr_show_item_c">
                <Table
                  class="table"
                  :data="tableData"
                  :table="tableColumn"
                  @operate="operate"
                ></Table>
              </div>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">拼接格式：<span class="attr_show_item_i">{{
                getOptionsName('format', formData.format)
              }}</span>
            </div>
          </div>
          <div v-if="formData.format == 'field'" class="attr_show_item">
            <div class="attr_show_item_t">拼接符号：<span class="attr_show_item_i">{{
                formData.symbol
              }}</span>
            </div>
          </div>
          <div class="table_wrapper">
            <div class="table_header">
              <div class="attr_pre_title mb0">
                <div class="attr_pre_title_b bold">输出结果</div>
              </div>
            </div>
            <div class="table_body mb20">
              <div class="attr_show_item_c">
                <Table
                  class="table"
                  :data="tableDataForOutput"
                  :table="tableColumnForOutput"
                  @operate="operate"
                ></Table>
              </div>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">示例：<span v-if="formData.format != 'JSON'" class="attr_show_item_i">{{
                outputResult
              }}</span>
            </div>
            <JsonViewer
              v-if="formData.format == 'JSON'"
              class="io_data"
              :value="outputResult"
              :expand-depth="2"
              copyable
              sort
            ></JsonViewer>
          </div>
        </div>
      </div>
    </div>

    <!-- 输出目标-选择输出字段 -->
    <SelectParams
      ref="selectParamsRef"
      :currentServObj="currentServObj"
      @confirm="confirm"
    ></SelectParams>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table_workgate";
import SelectParams from "./components/selectParams";
import JsonViewer from "vue-json-viewer";
import { mixList, reList, getSimpleParmaKey, setParamOrder } from "@m/utils/paramTree";
import filters from "@m/utils/filters";

export default {
  mixins: [mixin],
  components: {
    Table,
    SelectParams,
    JsonViewer,
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
  },
  data() {
    return {
      // input组件编辑
      formData: {
        actionDesc: "",
        actionMsg: "",
        format: "", // 拼接格式
        symbol: "", // 拼接符号
      },
      formatOptions: [
        { label: "字段", value: "field" },
        { label: "JSON", value: "JSON" },
        { label: "哈希", value: "hash" },
      ],
      // 赋值表达式
      expression: {
        beAssignedSource: "",
        condTyp: "",
        assignedSource1: "",
        assignedSource2: "",
      },
      currentObj: {},
      cpnData: {},
      cpnParamsRecord: {},
      actionIdRecord: "",
      tableData: [],
      transId: "",
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
    tableColumn() {
      if (this.canSave) {
        return [
          {
            prop: "paramKey",
            label: "参数Key",
            minWidth: "40%",
            type: "text",
            filter: scope => getSimpleParmaKey(scope.row.paramKey),
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
            width: "70",
            // minWidth: "15%",
            type: "text",
            tooltip: true,
          },
          {
            prop: "actionId",
            label: "来源",
            minWidth: "30%",
            type: "text",
            filter: (scope) => {
              const { actionName, actionId } = scope.row
              if (!actionName && !actionId) {
                return ""
              } else if (actionName == "当前4b交易") {
                return actionName
              } else {
                const item = this.getDataList().find(data => data.compositeId == actionId)
                const actionSeq = this.getConfItem("actionSeq", item.actionId).value
                return `${actionName}(${actionSeq})`
              }
            },
          },
          // {
          //   prop: "paraMapgNm",
          //   label: "来源值",
          //   minWidth: "30%",
          //   type: "simulantSelect",
          //   placeholder: "请选择",
          //   inputStyle: {
          //     cursor: "pointer",
          //   },
          // },
          // {
          //   prop: "isNeed",
          //   label: "是否必输",
          //   // minWidth: "15%",
          //   width: "70",
          //   type: "text",
          //   tooltip: true,
          //   align: "center",
          //   filter: "paraNed",
          // },
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
          // {
          //   prop: "actionId",
          //   label: "来源",
          //   minWidth: "25%",
          //   type: "text",
          //   tooltip: true,
          //   filter: (scope) => {
          //     const { actionName, actionId } = scope.row
          //     if (!actionName && !actionId) {
          //       return ""
          //     } else if (actionName == "当前4b交易") {
          //       return actionName
          //     } else {
          //       const item = this.getDataList().find(data => data.compositeId == actionId)
          //       const actionSeq = this.getConfItem("actionSeq", item.actionId).value
          //       return `${actionName}(${actionSeq})`
          //     }
          //   },
          // },
          // {
          //   prop: "paraMapgNm",
          //   label: "来源值",
          //   minWidth: "25%",
          //   type: "text",
          //   tooltip: true,
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
        ];
      }
    },
    tableColumnForOutput() {
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
          width: "70",
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
      ]
    },
    tableDataForOutput() {
      return [{
        paramKey: "strResult",
        paramName: "拼接结果",
        paramCName: "拼接结果",
        paramType: "String",
        paramValueType: "String",
        paramDirection: "1",
        paramOrder: "1",
        paramParentId: "",
        isNeed: "1",
        paramValue: typeof this.outputResult == "string" ? this.outputResult: JSON.stringify(this.outputResult),
      }]
    },
    canSave() {
      return !this.isRead && this.currentObj.compositeId && !this.currentObj.actionParentId;
    },
    outputResult() {
      if (this.formData.format == "JSON") {
        return this.tableData.reduce((prev, item) => {
          const paramKey = getSimpleParmaKey(item.paramKey)
          prev[paramKey] = item.paramCName
          return prev
        }, {})
      } else {
        const { symbol } = this.formData
        if (this.tableData.length && symbol) {
          return this.tableData.reduce((prev, item, index) => {
            const paramKey = getSimpleParmaKey(item.paramKey) 
            return `${prev}${index > 0 ? symbol : ""}${paramKey}`
          }, "")
        } else {
          return ""
        }
      }
    }
  },
  inject: ["getDataList"],
  methods: {
    async getParams(e, obj) {
      console.log("getParams", e, obj);
      this.currentObj = e;
      if (!e.compositeId) {
        e.conf.map((item) => {
          this.formData[item.name] = item.value;
        });
      } else {
        const params = {
          d4StusCd: "1",
          blngtoTyp: this.blngtoTyp,
          compositeId: e.compositeId || "",
        };
        const res = await this.rpc.transactionDesign.getServiceCpnParams(params);
        this.cpnData = res;
        res.confList.map((item) => {
          this.formData[item.confKey] = item.confValue;
        });
        this.tableData = res.paramList.filter(item => item.paramDirection == "0");
        this.tableData.forEach(item => {
          if (item.actionName == "当前4b交易") item.actionId = this.currentServObj?.svcId
        })
      }
      if (!this.formData.format) {
        this.formData.format = "field"
      }
      this.setCpnParamsRecord();
    },
    async saveParams() {
      if (!this.tableData.length) {
        return this.$message.error("拼接字段列表不能为空")
      } else if (!this.formData.format) {
        return this.$message.error("拼接格式不能为空")
      }
      if (this.formData.format == "JSON" || this.formData.format == "hash") {
        this.formData.symbol = ""
      }
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
      // const paramList = JSON.parse(JSON.stringify(mixList(this.tableData, "children")))
      setParamOrder(this.tableData)
      this.tableData.forEach(item => {
        if (item.actionId == this.currentServObj?.svcId) item.actionId = ""
      })
      const paramList = JSON.parse(JSON.stringify(this.tableData.concat(this.tableDataForOutput)))
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: e.apiId,
        paramList,
        confList,
        compositeId: this.currentObj.compositeId || "",
      };
      const { compositeId } = await this.rpc.transactionDesign.saveServiceCpnParams(params);
      params.compositeId = compositeId;
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
    operate(operation, data) {
      console.log("operate", operation, data);
      if (operation == "delete") {
        const index = this.tableData.indexOf(data);
        this.tableData.splice(index, 1);
        setParamOrder(this.tableData)
      }
    },
    addTableRow() {
      this.$refs.selectParamsRef.showDialog();
    },
    confirm(key, data) {
      console.log("confirm", key, data);
      if (key == "paramList") {
        data.forEach(item => item.paramDirection = "0")
        this.tableData.push(...data);
        setParamOrder(this.tableData)
      }
    },
    // 获取conf配置项
    getConfItem(name, actionId) {
      const dataList = this.getDataList()
      const cpn = dataList.find(data => data.actionId == actionId)
      return cpn.conf.find(item => item.name == name) || {}
    },
    getOptionsName(key, value) {
      if (key == "format") {
        return this.formatOptions.find(item => item.value == value)?.label
      } else {
        return ""
      }
    },
    init() {
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId;
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
.aop_tradecode_comps_design_attr_splice_attr {
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
        &.required {
          &::before {
            content: "*";
            color: $sec_danger_color;
            margin-right: 2px;
          }
        }
      }
      .attr_show_item_c {
        width: 100%;
        .click_text {
          color: $theme_color;
          cursor: pointer;
        }
        .w100p {
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
      .jv-container {
        ::v-deep .jv-code {
          padding: 0 4px;
          .jv-string {
            color: #111111;
          }
        }
      }
    }
  }
  .attr_send {
    padding: 8px 10px;
  }
  .table_body {
    padding-top: 8px;
    margin-bottom: 10px;
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
  }
}
</style>
