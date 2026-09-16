<template>
  <div class="aop_tradedesign_comps_apimgmt_case_etail">
    <div class="detail_container">
      <div class="detail_content">
        <!-- 基本信息 -->
        <div class="content_header_title nav_title">基本信息</div>
        <Info :detailInfo="detailInfo"></Info>
      </div>

      <div class="detail_content">
        <!-- API信息 -->
        <div class="content_header_title nav_title">API信息</div>
        <Api :detailInfo="detailInfo"></Api>
      </div>

      <div class="detail_content detail_content_position nav_title">
        <!-- Mock条件 -->
        <div class="content_header_title ">Mock条件</div>
        <Condition :dataList="dataList" :headerDataList="headerDataList"></Condition>
      </div>

      <div class="detail_content" v-show="isReverse == '0'">
        <!-- 反Mock -->
        <div class="content_header_title nav_title">反Mock</div>
        <Rev :dataList="revList"></Rev>
      </div>

      <div class="detail_content">
        <!-- 报文信息 -->
        <div class="content_header_title nav_title">报文信息</div>
        <div class="detail_row">
          <div class="left_row">
            <PageMockRow
              ref="testLeftRow"
              :title="'输入报文：'"
              :dataObj="requestMsg"
              :theme="'vscode_theme'"
              :copyable="true"
            ></PageMockRow>
          </div>
          <div class="left_row">
            <PageMockRow
              ref="testRightRow"
              :title="'输出报文：'"
              :dataObj="responseMsg"
              :theme="'vscode_theme'"
              :copyable="true"
            ></PageMockRow>
          </div>
        </div>
      </div>
    </div>

    <PageRightNav
      :itemList="itemList"
      :parentClass="'.page_wrapper'"
    ></PageRightNav>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageMockRow from "@m/core/components/page_mock_row";
import Info from "./info";
import Api from "./api";
import Condition from "./condition";
import Rev from "./rev";
import { escape2Html } from "@m/utils/html2e";

import PageRightNav from "@m/core/components/page_right_nav";
export default {
  mixins: [mixin],
  components: {
    PageMockRow,
    Info,
    Api,
    Condition,
    Rev,
    PageRightNav
  },
  props: {
    caseId: {
      type: String,
      default: () => "",
    },
    isReverse:{
      type: String,
      default: () => "0",
    },
  },
  data() {
    return {
      // 右侧导航栏参数
      itemList: [
        "基本信息",
        "API信息",
        "Mock条件",
        "反Mock",
        "报文信息",
      ],
      detailInfo: {},
      dataList: [],
      headerDataList: [],
      revList: [],
      requestMsg: "",
      responseMsg: "",
    };
  },
  methods: {
    init() {
      this.getApiCaseDetail();
    },
    // 提示
    handleItemClick(i) {},
    // 查询详情
    async getApiCaseDetail() {
      const params = {
        caseId: this.caseId,
      };
      const res = await this.rpc.apimgmt.getApiCaseDetail(params);
      this.requestMsg = res.requestMsg;
      this.responseMsg = res.responseMsg;
      this.detailInfo = res;
      const dataList = this.caseConditionBakTrasBack(
        JSON.parse(escape2Html(res.caseConditionBak) || "[]")
      );
      this.dataList = this.disposeList(dataList);
      const headerDataList = this.caseConditionBakTrasBack(
        JSON.parse(escape2Html(res.caseCondition) || "[]")
      );
      this.headerDataList = this.disposeList(headerDataList);
      this.revList = res.caseNegativeList2;
    },
    // 处理数组
    disposeList(arrs) {
      arrs.forEach((item, index) => {
        if (item.paramType == "List" || item.paramType == "Object") {
          arrs[index].paramValue = this.caseConditionBakTrasBack(
            JSON.parse(JSON.stringify(item.paramValue))
          );
          arrs[index].paramValue = this.disposeList(
            JSON.parse(JSON.stringify(item.paramValue))
          );
          arrs[index].children = item.paramValue;
          arrs[index].paramValue = "";
        }
      });
      return arrs;
    },
    caseConditionBakTrasBack(e) {
      const list = [];
      for (let i in e) {
        for (let k in e[i]) {
          list.push(e[i][k]);
        }
      }
      return list;
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_case_etail {
  .detail_container {
    .detail_content {
      background: $base_white;
      padding: 20px 30px;
      margin-bottom: 20px;
      .detail_row {
        display: flex;
        margin-top: 10px;
        .left_row {
          flex: 1;
          padding-right: 20px;
          position: relative;
          ::v-deep .el-textarea__inner {
            min-height: 600px !important;
          }
          ::v-deep .jv-code {
            min-height: 500px;
          }
        }
      }
      .content_header_title {
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
      }
    }
    .detail_content_position {
      position: relative;
    }
  }
}
</style>