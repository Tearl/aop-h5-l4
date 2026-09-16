<template>
  <div class="aop_tradedesign_page_d4workbench_workbench_one_confirm">
    <div class="content">
      <Detail
        ref="detailRef"
        :fnctCd="fnctCd"
        :mode="$route.query.mode || 'view'"
        class="detail_content_box"
        :pageType="'read'"
        @reflesh="getD4bServiceInfo()"
      ></Detail>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Detail from "./components/design_editor/service_define/components/interface_detail";
export default {
  mixins: [mixin],
  components: {
    Detail,
  },
  data() {
    return {
      fnctCd: "", //功能编码
      apiId: "",
    };
  },
  created() {
    this.init();
  },
  provide() {
    return {
      getDataList: this.getDataList,
    };
  },

  methods: {
    init() {
      this.apiId = this.$route.query.apiId;
      this.getD4bServiceInfo();
    },
    getDataList(reference = false) {
      if (reference) {
        return this.$refs.process.dataList;
      } else {
        return JSON.parse(JSON.stringify(this.$refs.process.dataList));
      }
    },
    // 查询D4b服务详情
    async getD4bServiceInfo() {
      const res = await this.rpc.d4.queryD4bInfoAndParamDetaill({
        svcId: this.apiId,
        dsgnFlg: "1",
      });
      this.fnctCd = res.srcFnctNo
      this.$refs.detailRef.basicData = res;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_d4workbench_workbench_one_confirm {
  .content {
    margin: 14px;
    overflow: scroll;
    .header_title {
      display: flex;
      justify-content: space-between;
      background: $base_white;
      margin-bottom: 12px;
      padding: 16px;
      .content_title {
        .func_title {
          font-size: 16px;
          color: $pri_ft_color;
          font-weight: $font_weight_600;
        }
        .status {
          line-height: 18px;
          font-size: 14dpx;
          padding: 2px 12px;
          margin-left: 8px;
        }
        .status_01 {
          color: #ff9104;
          background: #fff4e5;
        }
        .status_02 {
          color: #ff5f5f;
          background: #ffefee;
        }
        .status_03 {
          color: #358aff;
          background: #f2f8ff;
        }
        .status_04 {
          color: #36d542;
          background: #e5ffe7;
        }
        .status_05 {
          color: #5d36d5;
          background: #e6e5ff;
        }
      }
      .btn_style {
        @include mini_button_common;
        /deep/ .el-dropdown {
          margin-left: 8px;
        }
        .el-dropdown-link {
          height: 28px;
          color: #6d747f;
          background: #f2f3f5;
          border: none;
        }
      }
    }
  }
}
</style>
