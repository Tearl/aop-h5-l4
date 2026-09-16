<template>
  <div class="aop_tradedesign_comps_design_attr_concurrent_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>异步组件</div>
      </div>
      <div v-if="!isRead && !fourRAttrFlag" class="attr_box">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t required">
              组件名称：
            </div>
            <div class="attr_show_item_c">
              <el-input v-model="formData.actionDesc" size="mini"></el-input>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">
              组件描述：
            </div>
            <div class="attr_show_item_c textarea">
              <el-input
                maxlength="1000"
                show-word-limit
                autosize
                type="textarea"
                v-model="formData.actionMsg"
                placeholder="组件描述"
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="tips_info" v-if="!canSave">
            <el-tag type="warning">保存交易编排后，可对组件信息进行编辑</el-tag>
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
            <div class="attr_show_item_t textLeft">
              组件描述：<span class="attr_show_item_i">{{
                formData.actionMsg
              }}</span>
            </div>
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
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import { mixList, reList } from "@m/utils/paramTree";
import { unduplicated, setSerialNumber } from "@m/utils/array";
import {
  setSessionStorage,
  getSessionStorage,
  getLocalStorage,
} from "@m/utils/localStorage";
export default {
  mixins: [mixin],
  components: {
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
  },
  data() {
    return {
      isNeedCheck: "",
      paramValueSelect: [],
      isEnumList: false,
      formData: {
        actionDesc: "异步组件",
        actionMsg: "",
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
          prop: "paramCName",
          label: "中文名称",
          minWidth: "25%",
          inputStyle: "width: 90%",
          type: "text",
          // align: "center",
          // selectVal: (row) => {
          //   return this.tableType
          //     ? this.tableParamList
          //     : this.getParamKeySelectList(row);
          // },
          // disabled: () => this.isRead
        },
        {
          prop: "apSource",
          label: "参数来源",
          minWidth: "30%",
          inputStyle: "width: 60%",
          type: this.isRead ? "text" : "select",
          // align: "center",
          selectVal: [
            { type: "服务输入参数", value: "00" },
            { type: "服务输出参数", value: "10" },
            { type: "服务临时参数", value: "30" },
            { type: "组件输出参数", value: "20" },
          ],
          filter: "fourRApSource",
          disabled: () => true,
        },
        {
          prop: "isNeed",
          label: "是否必输",
          minWidth: "20%",
          type: "select",
          filterable: false,
          tooltip: true,
          selectVal: [
            { type: "是", value: "1" },
            { type: "否", value: "0" },
          ],
          disabled: (scope) => {
            return this.isRead;
          },
          // align: "center",
          // filter: "paraNed",
        },
        {
          prop: function (row) {
            if (row.apSource == "99") {
              return "paramValue";
            } else {
              return "paraMapgNm";
            }
          },
          label: "来源值",
          minWidth: "20%",
          type: (row) => {
            if (row.apSource == "99") {
              return "selectInputPicker";
            } else if (!this.isRead) {
              return "button";
            } else {
              return "text";
            }
          },
          selectVal: this.paramValueSelect,
          size: "mini",
          tooltip: true,
          filterable: true,
          format: "yyyyMMddHHmmss",
          selectPicker: function (scope) {
            return scope.row.paramValueType !== "Date";
            // return true
          },
          buttonList: [
            {
              renamed: function (scope) {
                return scope.row.paraMapgNm || "选择";
              },
              operate: "choseParams",
            },
          ],
        },
      ];
      if (!this.isRead)
        result.push({
          label: "操作",
          type: "button",
          width: "25%",
          buttonList: [
            {
              desc: "删除",
              operate: "deleteInputParam",
            },
          ],
        });
      return result;
    },
    outputParamsColumnAtSetting() {
      const result = [
        {
          prop: "paramCName",
          label: "参数中文名称",
          minWidth: "60%",
          inputStyle: "width: 93%",
          type: "text",
          // align: "center",
          // selectVal: (row) => {
          //   return this.tableType
          //     ? this.tableParamList
          //     : this.getParamKeySelectList(row);
          // },
          // disabled: () => this.isRead
        },
        {
          prop: "isNeed",
          label: "是否必输",
          minWidth: "20%",
          type: "text",
          filterable: false,
          tooltip: true,
          align: "center",
          filter: "paraNed",
        },
      ];
      if (!this.isRead)
        result.push({
          label: "操作",
          type: "button",
          width: "30",
          buttonList: [
            {
              desc: "删除",
              operate: "deleteOutputParam",
            },
          ],
        });
      return result;
    },
    loopListColumnAtSetting() {
      const result = [
        {
          prop: "paramCName",
          label: "参数中文名称",
          minWidth: "60%",
          inputStyle: "width: 93%",
          type: "text",
          // align: "center",
          // selectVal: (row) => {
          //   return this.tableType
          //     ? this.tableParamList
          //     : this.getParamKeySelectList(row);
          // },
          // disabled: () => this.isRead
        },
        {
          prop: "isNeed",
          label: "是否必输",
          minWidth: "20%",
          type: "text",
          filterable: false,
          tooltip: true,
          align: "center",
          filter: "paraNed",
        },
      ];
      if (!this.isRead)
        result.push({
          label: "操作",
          type: "button",
          width: "30",
          buttonList: [
            {
              desc: "删除",
              operate: "deleteLoopList",
            },
          ],
        });
      return result;
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
      return !this.isRead && this.currentObj.compositeId
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
        // this.inputParamsListAtSetting = [];
        // this.outputParamsListAtSetting = [];
        return;
      } else {
        const params = {
          d4StusCd: "1",
          blngtoTyp: this.blngtoTyp,
          compositeId: e.compositeId || "",
        };
        const res = await this.rpc.d4.getServiceCpnParams(params);
        this.cpnData = res;
        this.paramList = res.paramList;
        res.confList.map((item) => {
          this.formData[item.confKey] = item.confValue;
        });
        // 更新实时位置序号
        ["actionSeq", "actionFrntSeq", "actionPostSeq"].forEach((key) => {
          this.formData[key] = this.getConfItem(key, e.actionId)?.value || ""
        })
        console.log("更新实时位置序号", this.formData)
        // const paramList = JSON.parse(this.formData.paramList)
        // this.inputParamsListAtSetting = reList(
        //   res.paramList.filter((item) => item.paramDirection == 0)
        // );
        // this.outputParamsListAtSetting = reList(
        //   res.paramList.filter((item) => item.paramDirection == 1)
        // );
        // this.loopListAtSetting = reList(
        //   res.paramList.filter((item) => item.paramDirection == 3)
        // );
        console.log("inputParamsListAtSetting", res.paramList);
      }
      this.setCpnParamsRecord();
    },
    async saveParams() {
      if (!this.formData.actionDesc) return this.$message.error("必填项不能为空")
      const e = this.currentServObj;
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
            compositeId: this.currentObj?.compositeId || "",
          });
        }
      }
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: this.transId,
        paramList: [],
        confList,
        compositeId: this.currentObj?.compositeId || "",
      };
      const { compositeId } = await this.rpc.d4.saveServiceCpnParams(params);
      params.compositeId = compositeId;
      this.setCpnParamsRecord();
      this.$emit("upDateServParams", JSON.parse(JSON.stringify(this.currentObj)), params);
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
    // 获取conf配置项
    getConfItem(name, actionId) {
      const dataList = this.currentParentCpnInfo?.dataList || this.getDataList()
      const cpn = dataList.find(data => data.actionId == actionId)
      return cpn?.conf.find(item => item.name == name) || {}
    },
    init() {
      this.transId = this.$route.query.transId || this.$route.query.apiId
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
.aop_tradedesign_comps_design_attr_concurrent_attr {
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
    padding: 20px;
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
      .attr_show_item_t {
        // width: 100%;
        // margin-right: 10px;
        // margin-bottom: 10px;
        padding: 5px 5px 0 0;
        // font-weight: $font_weight_600;
        white-space: nowrap;
        min-width: 90px;
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
}
</style>
