<template>
  <div class="aop_tradedesign_comps_dicmgmt_sys_info">
    <div class="detail_container">
      <div class="detail_container_right">
        <div class="detail_content">
          <!-- 基本信息 -->
          <div class="content_header_title">基本信息</div>
          <Info :detailInfo="detailInfo"></Info>
        </div>
        <div class="detail_content">
          <!-- 解析报文样例 -->
          <div class="content_header_title">解析报文样例</div>
          <div class="detail_row">
            <div class="left_row">
              <PageMockRow
                ref="testLeftRow"
                :title="'输入报文：'"
                :dataObj="detailInfo.requestStr"
                :theme="'vscode_theme'"
              ></PageMockRow>
            </div>
            <div class="left_row">
              <PageMockRow
                ref="testRightRow"
                :title="'输出报文：'"
                :dataObj="detailInfo.responseStr"
                :theme="'vscode_theme'"
              ></PageMockRow>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
import PageMockRow from "@m/core/components/page_mock_row";
import Info from "./info";
export default {
  mixins: [mixin],
  components: {
    PageHeader,
    PageMockRow,
    Info,
  },
  props: {
    arsId: {
      type: String,
      default: () => "",
    },
    detailInfo: {
      type: Object,
      default: () => ({}),
    }
  },
  data() {
    return {
      // 导航栏参数
      breadcrumbs: [
        {
          label: "服务应用",
          operate: "list",
        },
        {
          label: "服务应用详情",
        },
      ],
      //按钮列表
      labelList: [],
      detailInfo: {},
      iconCurrent: "info",
    };
  },
  methods: {
    init() {
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_sys_info {
  .detail_container {
    .detail_container_right {
      background: $base_white;
    }
    .detail_content {
      background: $base_white;
      padding: 20px 30px;
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
  }
}
</style>