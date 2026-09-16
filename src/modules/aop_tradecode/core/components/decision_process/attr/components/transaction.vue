<template>
  <div class="aop_tradecode_comps_design_attr_transaction">
    <div class="attr_main">
      <div class="attr_tabs">
        <el-tabs v-model="serviceActive" @tab-click="handleClickServ">
          <el-tab-pane
            v-for="(item, index) in tabsList"
            :label="item.v"
            :name="item.k"
            :key="index"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <!-- 服务信息 -->
      <div class="attr_box" v-show="serviceActive == 'd4b'">
        <div class="attr_show underLine">
          <div class="attr_show_item flex">
            <div class="item_title w68 can_select">交易名称：</div>
            <div class="item_value text can_select">{{ currentServObj.apiName || dataObj.apiName}}</div>
          </div>
          <div class="attr_show_item flex">
            <div class="item_title w68 can_select">交易ID：</div>
            <div class="item_value text can_select">{{ currentServObj.apiId || dataObj.apiId}}</div>
          </div>
          <!-- <div class="attr_show_item flex">
            <div class="item_title w68 can_select">服务类型：</div>
            <div class="item_value text can_select">{{ getSvcTp() }}</div>
          </div> -->
          <div class="attr_show_item flex">
            <div class="item_title w68 can_select">交易描述：</div>
            <div class="item_value text can_select">{{ currentServObj.apiDesc|| dataObj.apiDesc}}</div>
          </div>
          <!-- <div class="attr_show_item flex">
            <div class="item_title w68 can_select">版本号：</div>
            <div class="item_value text can_select">{{ currentObj && currentObj.apiVersion || currentObj.svcVersionNo }}</div>
          </div> -->
          <!-- <div class="attr_show_item flex mb20">
            <div class="item_title w68">所属系统：</div>
            <div class="item_value text">{{ currentObj && currentObj.relySysName }}</div>
          </div> -->
          
          <div class="attr_show_item mb20">
            <div class="attr_show_item_t">输入参数</div>
            <div class="attr_show_item_b">
              <i class="el-icon-more" @click="switchTableMode('input')"></i>
            </div>
            <div class="attr_show_item_c">
              <Table
                v-show="showAllInputParams"
                class="table"
                :data="inputParamsList"
                :table="inputParamsColumn"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
              ></Table>
              <Table
                v-show="!showAllInputParams"
                class="table"
                :data="inputParamsList"
                :table="getPartInputParamsColumn(inputParamsColumn)"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
              ></Table>
            </div>
          </div>

          <div class="attr_show_item mb20">
            <div class="attr_show_item_t">输出参数</div>
            <div class="attr_show_item_b">
              <i class="el-icon-more" @click="switchTableMode('output')"></i>
            </div>
            <div class="attr_show_item_c">
              <Table
                v-show="showAllOutputParams"
                class="table"
                :data="outputParamsList"
                :table="outputParamsColumn"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
              ></Table>
              <Table
                v-show="!showAllOutputParams"
                class="table"
                :data="outputParamsList"
                :table="getPartOutputParamsColumn(inputParamsColumn)"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
              ></Table>
            </div>
          </div>

          <!-- <div class="attr_show_item mb20">
            <div class="attr_show_item_t">业务规则</div>
            <div class="attr_show_item_c">
              <Table
                class="table"
                :data="businessRuleList"
                :table="businessRuleColumn"
                @operate="businessRuleOperate"
              ></Table>
            </div>
          </div> -->
        </div>
      </div>
      <!-- 布局结构 -->
      <div class="attr_box" v-show="serviceActive == 'layout'">
        <el-menu>
          <el-menu-item
            v-for="(item, index) in layoutList"
            :key="item.actionId"
            :index="index + 1"
            @click="menuClick(item)"
            :class="actionId == item.actionId ? 'is_active' : ''"
          >
            <div class="menu_item">
              <div class="icon">
                <span
                  class="center"
                  :class="{
                    yellow: item.actionType == 'D5LinkAction',
                    origin: ['D5SelfAction', 'decisionAction'].includes(item.actionType),
                    blue: ['inputAction', 'outputAction', 'loopAction', 'containerAction', 'cacheSessionAction', 'getSessionAction', 'createGraphValidateCodeAction', 'verifyGraphValidateCodeAction', 'getCacheAction', 'setCacheAction', 'updateCacheAction', 'updateSessionAction', 'listAction', 'setHeaderAction', 'listSetValAction',].includes(item.actionType),
                    green: ['concurrentAction'].includes(item.actionType),
                    purple: ['asyncAction'].includes(item.actionType),
                    grey: ['spliceAction', 'uploadAction'].includes(item.actionType),
                  }"
                ></span>
              </div>
              <span class="title">{{ item.actionName }}</span>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import { mixList, reList } from "@m/utils/paramTree";

export default {
  mixins: [mixin],
  components: {
    Table,
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
  },
  data() {
    return {
      serviceActive: "d4b",
      //tab切换
      tabsList: [
        // { v: "设置", k: "setting" },
        { v: "交易信息", k: "d4b" },
        { v: "布局结构", k: "layout" },
      ],
      // 是否显示完整输入参数
      showAllInputParams: false,
      // 输入参数表格数据
      inputParamsList: [],
      // 输入参数表格列
      inputParamsColumn: [
        {
          prop: "paramKey",
          label: "参数Key",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramCName",
          label: "参数中文名称",
          minWidth: "35%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramType",
          label: "参数类型",
          minWidth: "25%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "isNeed",
          label: "是否必输",
          minWidth: "20%",
          type: "text",
          align: "center",
          filter: "paraNed",
          tooltip: true,
        }
      ],
      // 输出参数表格数据
      outputParamsList: [
      ],
      // 输出参数表格列
      outputParamsColumn: [
        {
          prop: "paramKey",
          label: "参数Key",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramCName",
          label: "参数中文名称",
          minWidth: "35%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramType",
          label: "参数类型",
          minWidth: "25%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "isNeed",
          label: "是否必输",
          minWidth: "20%",
          type: "text",
          align: "center",
          filter: "paraNed",
          tooltip: true,
        }
      ],
      // 是否显示完整输chu参数
      showAllOutputParams: false,
      // 业务规则表格数据
      businessRuleList: [],
      layoutList: [],
      dataObj: {}
    };
  },
  computed: {
    // 业务规则表格列
    businessRuleColumn() {
      ruleDescType = (this.showType == "service" && this.serviceActive == 'd4b') || (this.showType == "d4bInfo" && this.d4bActive == 'd4b') ? "textClick" : "text"
      return [
        {
          prop: "briRuleNm",
          label: "规则名称",
          minWidth: "35%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "briBsnruleType",
          label: "规则类型",
          minWidth: "25%",
          type: "text",
          filter: "ruleTpCd",
          tooltip: true,
        },
        {
          prop: "briBsnruleNature",
          label: "规则描述",
          minWidth: "20%",
          type: ruleDescType,
          operate: "showRuleInfo",
          tooltip: true,
        }
      ]
    },
  },
  inject: ["getDataList"],
  methods: {
    // 获取部分输入参数的表格列
    getPartInputParamsColumn(data) {
      return data.filter((item, index) => {
         return index == 1 || index == 3
      })
    },
    // 获取部分输出参数的表格列
    getPartOutputParamsColumn(data) {
      return data.filter((item, index) => {
         return index == 1 || index == 3
      })
    },
    // 点击业务规则列表的操作列按钮
    businessRuleOperate(operation, data) {
      console.log("businessRuleOperate", operation, data)
      this.currentRuleObj = data
      this.ruleVisible = true
    },
    menuClick(e) {  
      let s = document.querySelector(".process_middle");
      console.log(s.offsetWidth,s.offsetHeight);
      s.scrollTo({
        top: e.actionY - s.offsetHeight / 2 + 40 + 50,
        left: e.actionX - s.offsetWidth / 2 + 50,
        behavior: "smooth",
      });
    },
    getSvcTp() {
      const str = this.currentObj.apiServiceType || this.currentObj.svcTpCd
      if (str) {
        return str.substr(-4)
      } else {
        return ""
      }
    },
    // 切换表格的显示模式（是否完整显示）
    switchTableMode(e) {
      if (e == "input") this.showAllInputParams = !this.showAllInputParams
      if (e == "output") this.showAllOutputParams = !this.showAllOutputParams
      if (e == "inputAtSetting") this.showAllInputParamsAtSetting = !this.showAllInputParamsAtSetting
      if (e == "outputAtSetting") this.showAllOutputParamsAtSetting = !this.showAllOutputParamsAtSetting
    },
    // 布局结构点击
    handleClickServ(e) {
      // this.$emit("getDataList")
      // let list = JSON.parse(JSON.stringify(this.dataList))
      let list = this.getDataList()
      this.layoutList = list.sort((a,b) => { return a.actionY == b.actionY ? a.actionX - b.actionX :  a.actionY - b.actionY})
    },
    init(e) {
      this.inputParamsList = reList(e.puApiParams.filter((item) => item.paramDirection == "0"));
      this.outputParamsList = reList(e.puApiParams.filter((item) => item.paramDirection == "1"));
      this.businessRuleList = e.businessRuleList
      this.serviceActive = "d4b";
      this.dataObj.apiName = e.apiName
      this.dataObj.apiId = e.apiId
      this.dataObj.apiDesc = e.apiDesc
    }
  },
  created() {
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_transaction {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  .bold_text {
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #111111;
    letter-spacing: 0;
  }
  .width_move {
    width: 2px;
    position: absolute;
    left: 0px;
    height: 100%;
    cursor: w-resize;
    background: $pri_br_color;
    z-index: 1;
  }
  .trigger_diy {
    position: absolute;
    left: -22px;
    top: 50%;
    width: 11px;
    height: 84px;
    line-height: 84px;
    color: #fff;
    font-size: 18px;
    padding-right: 10px;
    cursor: pointer;
    transition: background 0.3s ease;
    z-index: 200;
    background: rgba(0, 0, 0, 0);
    border-top: 11px solid rgba(0, 0, 0, 0);
    border-bottom: 11px solid rgba(0, 0, 0, 0);
    border-right: 11px solid #409eff;
    i {
      margin-left: 7px;
      margin-top: -25px;
      vertical-align: middle;
    }
  }
  .trigger_diy_without_sidebar {
    transform: rotate(180deg);
    transform-origin: 100% 50% 0;
  }
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
        padding: 0 ;
      }
    }
  }
  .attr_title {
    padding: 0px 20px;
    font-family: $font_medium;
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
  .attr_content {
    background-color: $base_bg_color;
    padding: 20px 10px;
  }
  .attr_box {
    height: calc(100% - 52px);
    overflow-y: scroll;
    padding-bottom: 102px;
    &.mt10 {
      margin-top: 10px;
    }
    .base_info {
      margin: 10px 20px 0;
      border-bottom: 1px solid  #E7E7EE;
      .flex_container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        .info_list_item {
          .title {
            color: #999;
          } 
          .content {
            color: #333;
          } 
        }
      }

    }
    .menu_item {
      display: flex;
      align-items: center;
      .icon {
        width: 16px;
        height: 16px;
        border: 1px solid #e7e7ee;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        .center {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 2px;
          &.blue {
            background: $theme_color;
          }
          &.origin {
            background: #FF9104;
          }
          &.yellow {
            background: #f7ecc2;
          }
          &.green {
            background: #36d542;
          }
          &.purple {
            background: #8080ff;
          }
          &.grey {
            background: #f1f1f1;
          }
        }
      }
      .title {
        margin-left: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .attr_show {
    padding: 0px 20px;
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
  .attr_tabs {
    display: flex;
    // justify-content: center;
    background-color: $base_white;
    width: 100%;
    border-bottom: 2px solid #dcdfe6;
    box-shadow: 0 1px 10px 0 #e7e7e7;;
    // ::v-deep .el-tabs__active-bar {
    //   width: 50px !important;
    // }
    ::v-deep .el-tabs__nav-wrap::after {
      background-color: $base_white;
    }
    ::v-deep .el-tabs__header {
      margin: 0;
      .el-tabs__item {
        height: 44px;
        line-height: 44px;
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
  .table ::v-deep .wraning_row {
    display: none;
  }
  .el-menu {
    border-right: 0;
    ::v-deep .is-active {
      color: #303133;
    }
    .is_active {
      color: $theme_color;
      background-color: #eaf1ff;
      font-weight: $font_weight_600;
    }
    ::v-deep .el-menu-item {
      padding-left: 10px !important;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      letter-spacing: 0;
    }
  }
}
</style>
