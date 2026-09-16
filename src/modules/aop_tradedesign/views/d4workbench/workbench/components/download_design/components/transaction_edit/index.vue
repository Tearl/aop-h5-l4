<template>
  <div class="aop_tradedesign_comps_d4editor_service_define_base_info">
    <Basic
      ref="basicRef"
      pageType="read"
      :basicData="basicData"
      :fnctCd="fnctCd"
      :uploadFlag="uploadFlag"
      :transStatus="transStatus"
      :getApiBizType="getApiBizType"
      @showRelatedTops="showRelatedTops"
    >
      <div slot="rightNav" class="rightNav">
        <PageRightNav
          :itemList="itemList"
          parentClass=".process_middle"
          navClass=".base_nav_title"
        ></PageRightNav>
      </div>
    </Basic>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Basic from "./basic";
import PageRightNav from "@m/core/components/page_right_nav";

export default {
  mixins: [mixin],
  components: {
    Basic,
    PageRightNav,
  },
  props: {
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    fnctCd: {
      type: String,
      default: () => "",
    },
    uploadFlag: {
      type: Boolean,
      default: () => false,
    },
    getApiBizType: {
      type: Boolean,
      default: () => false,
    },
    transStatus: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      basicData: {},
      itemList: [
        "基本信息",
        "输入参数",
        "输出参数",
        "L5服务列表",
      ],
    };
  },
  methods: {
    init() {
    },
    showRelatedTops() {
      this.$emit("showRelatedTops");
    },
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
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4editor_service_define_base_info {
  .rightNav {
    /deep/ .nav_right {
      top: 40%;
    }
  }
  
}
</style>
