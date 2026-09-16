<template>
  <div class="aop_tradedesign_comps_apimgmt_api_info_messExam">
    <div class="detail_row">
      <div class="left_row">
        <PageMockRow
          ref="testLeftRow"
          :title="'输入报文：'"
          :dataObj="detailInfo.mockReqMsg"
          :theme="'vscode_theme'"
        ></PageMockRow>
      </div>
      <div class="left_row">
        <PageMockRow
          ref="testRightRow"
          :title="'输出报文：'"
          :dataObj="detailInfo.mockRespMeg"
          :theme="'vscode_theme'"
        ></PageMockRow>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@m/utils/filters";
import PageMockRow from "@m/core/components/page_mock_row";
export default {
  components: {
    PageMockRow,
  },
  props: {
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_api_info_messExam {
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
}
</style>
