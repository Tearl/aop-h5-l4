<template>
  <div class="aop_tradecode_comps_design_attr_output_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>output</div>
      </div>
      <div class="attr_box">
        <div class="attr_show">
          <div class="attr_show_item">
            <div class="attr_show_item_t">组件名称：<span v-if="!canSave" class="attr_show_item_i">{{formData.actionDesc}}</span></div>
            <div class="attr_show_item_c" v-if="canSave">
              <el-input
                disabled
                v-model="formData.actionDesc"
                size="mini"
                placeholder="请输入"
              ></el-input>
            </div>
          </div>
          <!-- <div class="attr_show_item">
            <div class="attr_show_item_t">组件描述：<span v-if="!canSave" class="attr_show_item_i">{{formData.actionMsg}}</span></div>
            <div class="attr_show_item_c" v-if="canSave">
              <el-input
                :disabled="!canSave"
                type="textarea"
                v-model="formData.actionMsg"
                placeholder="组件描述"
                size="mini"
              ></el-input>
            </div>
          </div> -->
          <!-- <div class="attr_show_item_c">
            <Table
              class="attr_innerTable"
              :data="tableData"
              :table="tableColumn"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div> -->
          <div class="attr_send">
            <div class="attr_pre_title">
              <div class="attr_pre_title_b bold">输出参数</div>
            </div>
            <div class="attr_show_item_c">
              <!-- <Table
                class="attr_innerTable"
                :data="tableData"
                :table="tableColumn"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
              ></Table> -->
              <Table
                class="table output_list"
                :data="tableData"
                :table="tableColumn"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
                @inputClick="inputClick"
                :rowClass="rowClass"
              ></Table>
            </div>
          </div>
          <div v-if="!isRead">
            <div class="tips_info" v-if="!canSave">
              <el-tag type="warning">保存交易编排后，可对组件信息进行编辑</el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!isRead"
      class="attr_btn"
    >
      <el-button
        v-if="canSave"
        type="primary"
        size="small"
        @click="saveParams"
        class="right_button"
        >保存</el-button
      >
    </div>
    <!-- 拟态的下拉选择框 -->
    <SimulantSelect
      ref="simulantSelectRef"
      :currentServObj="currentServObj"
      :serviceIdMapToParamList="serviceIdMapToParamList">
    </SimulantSelect>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import SimulantSelect from "./components/simulantSelect"
import { mixList, reList } from "@m/utils/paramTree";

export default {
  mixins: [mixin],
  components: {
    Table,
    SimulantSelect,
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
      tableData: [],
      currentObj: {},
      cpnData: {},
      cpnParamsRecord: {},
      actionIdRecord: "",
      svcIdToSvcNm: {},
      transId: ""
    };
  },
  computed: {
    blngtoTyp() {
      return this.currentServObj.apiServiceType.indexOf("D4") > -1 ? "10" : "11"
    },
    // 是否修改过组件的参数
    hasChangeCpnParams() {
      return this.cpnParamsRecord != JSON.stringify(this.formData) && this.actionIdRecord == this.currentObj.actionId
    },
    canSave() {
      return !this.isRead && this.currentObj.compositeId
    },
    tableColumn() {
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
    },
    bodyOutData() {
      return this.tableData.find((item) => item.paramKey == "bodyOutData")
    }
  },
  inject: ["getDataList"],
  methods: {
    async getParams(e, obj) {
      this.currentObj = e
      e.conf.map(item => {
        this.formData[item.name] = item.value
      })
      const res = await this.rpc.d4.getD4bServiceInfo({
        svcId: this.currentServObj?.svcId || obj.apiId,
        dsgnFlg: "1",
      });
      const paramsList = res.puApiParams.filter((param) => {
        if (param.paramDirection == 1) {
          param.apSource = param.apSource || "00"
          param.actionName = param.actionName || "当前4b交易"
          param.paramMappingKey = param.paramMappingKey || param.paramKey
          param.paraMapgNm = param.paraMapgNm || param.paramCName
          param.actionId = param.actionId || this.currentServObj?.svcId
          return true
        }
      })
      this.tableData = reList(paramsList);
      this.setCpnParamsRecord()
    },
    async saveParams() {
      const paramList = JSON.parse(
        JSON.stringify(
          mixList(this.tableData, "children")
        )
      );
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
            compositeId: e?.compositeId || "",
          })
        }
      }
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: this.fourRAttrFlag ? this.currentParentCpnInfo.compositeId : this.currentServObj.apiId,
        paramList,
        confList,
        compositeId: this.currentObj.compositeId || ""
      }
      // const { compositeId } = await this.rpc.d4.saveServiceCpnParams(params)
      // params.compositeId = compositeId
      paramList.forEach((item) => {
        if (item.actionName == "当前4b交易") item.actionId = ""
      })
      await this.rpc.d4.updateD4Param({
        apiId: this.currentServObj?.svcId,
        paramList,
        paramDirection: "1"
      })
      this.$notify({
        title: "成功",
        message: "保存成功",
        duration: 2000,
        type: "success",
      });
      this.setCpnParamsRecord()
      this.$emit("upDateServParams", JSON.parse(JSON.stringify(this.currentObj)), params)
    },
    setCpnParamsRecord() {
      this.cpnParamsRecord = JSON.stringify(this.formData)
      this.actionIdRecord = this.currentObj.actionId
    },
    inputClick(scope, e) {
      // if (scope.row.paramParentId != this.bodyOutData?.paramOrder) return
      e.preventDefault();
      this.$refs.simulantSelectRef.init(scope, e)
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
    init() {
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
      this.svcIdToSvcNm = this.getDataList().reduce((prev, data) => {
        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType)  && data.compositeId) {
          prev[data.compositeId] = data.actionName
        }
        return prev
      }, { [this.currentServObj?.svcId]: "当前4b交易" })
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
.aop_tradecode_comps_design_attr_output_attr {
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
    padding:  10px;
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
