<template>
  <div class="aop_tradecode_comps_d4editor_service_define_base_info">
    <!-- <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader> -->
    <Basic
      ref="basicRef"
      pageType="read"
      :basicData="basicData"
      :fnctCd="fnctCd"
      :showBtn="showBtn"
      :noTrans="noTrans"
      :uploadFlag="uploadFlag"
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
    showBtn: {
      type: Boolean,
      default: () => false
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
      breadcrumbs: [
        {
          label: "后端设计",
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
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_d4editor_service_define_base_info {
  // height: calc(100vh - 155px);
  // overflow: auto;
  .rightNav {
    /deep/ .nav_right {
      top: 40%;
    }
  }

}
</style>
