<template>
  <div class="aop_tradecode_comps_d4bdesign_info_baisc">
    <div class="content_wrapper">
      <!-- 查看基本信息 -->
      <div class="content_read">
        <div class="detail_content">
          <div class="content_header base_nav_title">基本信息</div>
          <DetailInfo
            :reqmentId="reqmentId"
            :detailInfo="detailInfo"
            :uploadFlag="uploadFlag"
            :showBtn="showBtn"
            :noTrans="noTrans"
            @showRelatedTops="showRelatedTops"
          >
          </DetailInfo>
        </div>

        <!-- 参数配置 -->
        <div class="detail_content">
          <div class="content_header base_nav_title">输入参数</div>
          <Table
            class="table_style"
            :data="iInputList"
            :table="iInputListTable"
            :rowK="'paramOrder'"
            :treeProps="{ children: 'children' }"
          ></Table>
        </div>
        <div class="detail_content">
          <div class="content_header base_nav_title">输出参数</div>
          <Table
            class="table_style"
            :data="iOutputList"
            :table="iOutputListTable"
            :rowK="'paramOrder'"
            :treeProps="{ children: 'children' }"
          ></Table>
        </div>
        <!-- 规则列表 -->
        <div class="detail_content">
          <L5ServList
            ref="l5servRef"
            pageType="confirm"
            :showBtn="showBtn"
            :noTrans="noTrans"
          ></L5ServList>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageParams from "@m/core/components/page_params";
import DetailInfo from "./info";
import Table from "@m/core/components/page_table_workgate";
import { reList, mixList } from "@m/utils/paramTree";
import Params from "./params";
import L5ServList from "./components/l5_service_list";
import { escape2Html } from "@m/utils/html2e.js";
import { typeEnumObj } from "@m/utils/normalData.js";
import Process from "@m/core/components/process/comps";

export default {
  mixins: [mixin],
  components: {
    PageParams,
    DetailInfo,
    Table,
    Params,
    L5ServList,
    Process,
  },
  props: {
    basicData: {
      type: Object,
      default: () => ({}),
    },
    showBtn: {
      type: Boolean,
      default: () => false,
    },
    uploadFlag: {
      type: Boolean,
      default: () => false,
    },
    noTrans: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      iInputList: [], // 数据输入列表
      iOutputList: [], // 数据输出列表
      detailInfo: {}, //服务组件基本信息
      reuseType: "",
      itemList: ["基本信息", "业务规则", "参数配置"],
      l5ServiceList: [],
      isFilterList: [],
      apEncryTypeList: [],
      /* 流程图相关变量 */
      dataObj: {
        flow: [],
        position: "",
      },
    };
  },
  computed: {
    // 数据输入列表参数
    iInputListTable() {
      return [
        {
          prop: "paramKey",
          label: "参数Key",
          width: "200px",
          type: "text",
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
          type: "text",
        },
        {
          prop: "paramLength",
          label: "参数长度",
          type: "text",
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter",
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          type: "text",
        },
        {
          prop: "dictryEnum",
          label: "枚举值",
          type: "text",
        },
      ]
    },
    // 数据输出列表参数
    iOutputListTable() {
      return [
        {
          prop: "paramKey",
          label: "参数Key",
          width: "200px",
          type: "text",
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
          type: "text",
        },
        {
          prop: "paramLength",
          label: "参数长度",
          type: "text",
        },
        {
          prop: "actionName",
          label: "来源",
          type: "text",
        },
        {
          prop: "paraMapgNm",
          label: "来源值",
          type: "text",
          filter: (scope) => {
            if (scope.row?.actionId == "constantValue") {
              return scope.row.paramMappingKey
            } else {
              return scope.row.paraMapgNm
            }
          },
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter",
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          type: "text",
        },
        {
          prop: "dictryEnum",
          label: "枚举值",
          type: "text",
        },
      ]
    }
  },
  methods: {
    init() {},
    showRelatedTops() {
      this.$emit("showRelatedTops");
    },
    setSourceOption(data) {
      data.forEach((item) => {
        if (item.actionId == "" || item.actionName == "") {
          item.actionId = this.detailInfo.svcId;
          item.actionName = "当前4b交易";
          item.paramMappingKey = item.paramKey;
          item.paraMapgNm = item.paramCName;
        }
        if (item.children && item.children.length) {
          this.setSourceOption(item.children);
        }
      });
    },
  },
  created() {},
  watch: {
    async basicData(res, o) {
      this.detailInfo = res;
      this.detailInfo.isSession = this.detailInfo.isSession== '1' ? true:false
      this.detailInfo.isVerificationCode = this.detailInfo.isVerificationCode== '1' ? true:false
      this.detailInfo.isUploadFile = this.detailInfo.isUploadFile == "1"
      this.iInputList = [];
      this.iOutputList = [];
      this.$nextTick(() => {
        // this.$refs.bizRuleRef.businessRuleList = res.bizRuleList;
        this.iInputList = reList(
          res.puApiParams.filter((item) => item.paramDirection == 0)
        );
        this.iOutputList = reList(
          res.puApiParams.filter((item) => item.paramDirection == 1)
        );
        this.setSourceOption(this.iOutputList);
        this.$refs.l5servRef.initData(this.detailInfo.svcId);
        // this.$refs.paramsRef.initParams(res);
        // const position = res.mainFlow.reduce((prev, data, index) => {
        //   const type = typeEnumObj[data.type]
        //   const actionId = `${type}${index + 1}`
        //   prev[actionId] = `50 ${50 + index * 80} 100 48`
        //   data.id = data.referId = actionId
        //   data.type = type
        //   return prev
        // }, {})
        // const dataObj = {
        //   flow: res.mainFlow,
        //   position: escape2Html(JSON.stringify(position))
        // }
        // this.dataObj = JSON.parse(JSON.stringify(dataObj))
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_d4bdesign_info_baisc {
  .content_wrapper {
    font-family: $font_regular;
    .content_read {
      .detail_content {
        background: $base_white;
        padding: 20px 32px;
        margin-bottom: 16px;
        .flex_tab {
          display: flex;
          justify-content: flex-start;
          .table_title {
            line-height: 40px;
            margin-right: 10px;
          }
          .btn_style {
            font-size: 14px;
            border-radius: 2px;
            cursor: pointer;
            padding: 0 8px;
            letter-spacing: 0;
            text-align: center;
            font-family: PingFangSC-Regular;
            height: 40px;
          }
        }
      }
      .content_header {
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
      }
      .process_middle {
        background: $base_white;
        padding: 20px 32px;
        margin-bottom: 16px;
        height: 500px;
        overflow: hidden;
        display: flex;
        flex-direction: column
      }
      .process_box {
        @include scrollbar;
        overflow-y: auto;
        overflow-x: auto;
      }
      ::v-deep .el-table {
        margin-top: 16px;
      }
      ::v-deep .el-table th {
        color: $sec_ft_color;
      }
    }
  }
  /deep/ .el-table th.el-table__cell > .cell {
    color: #333;
  }
  .check_group {
    display: flex;
    margin-top: 16px;
    .left,
    .right {
      width: 50%;
    }
  }
}
</style>
