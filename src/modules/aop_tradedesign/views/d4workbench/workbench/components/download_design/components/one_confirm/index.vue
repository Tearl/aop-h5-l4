<template>
  <div class="aop_tradedesign_comps_d4editor_service_define_base_info">
    <!-- <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader> -->
    <Basic
      ref="basicRef"
      pageType="read"
      :basicData="basicData"
      :fnctCd="fnctCd"
      :type="type"
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
// import PageHeader from "@m/core/components/page_header";
import Basic from "./basic";
import PageRightNav from "@m/core/components/page_right_nav";

export default {
  mixins: [mixin],
  components: {
    Basic,
    PageRightNav,
    // PageHeader
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
    type: {
      type: String,
      default: () => "",
    }
  },
  data() {
    return {
      breadcrumbs: [
        {
          label: "下装设计",
          operate: "download"
        },
        {
          label: "服务详情",
        },
      ],
      basicData: {},
      itemList: [
        "基本信息",
        // "业务规则",
        "参数配置",
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
    // 导航栏点击
    labelClick(e) {
      if(e == "download") {
        this.$router.back()
      }
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
  margin-bottom: 80px;
  height: calc(100vh - 154px);
  overflow: auto;
  .rightNav {
    /deep/ .nav_right {
      top: 40%;
    }
  }
  
}
</style>
