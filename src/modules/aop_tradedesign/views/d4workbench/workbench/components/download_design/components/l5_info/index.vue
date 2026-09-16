<template>
  <div class="aop_tradedesign_comps_d4editor_service_define_base_info">
    <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <Basic
      class="l5_info"
      ref="basicRef"
      pageType="read"
      :basicData="basicData"
    >
      <div slot="rightNav">
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
import PageHeader from "@m/core/components/page_header";
import filters from "@m/utils/filters";
import Basic from "./basic";
import PageRightNav from "@m/core/components/page_right_nav";

export default {
  mixins: [mixin],
  components: {
    Basic,
    PageRightNav,
    PageHeader
  },
  props: {
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      basicData: {},
      itemList: [
        "基本信息",
        // "业务规则",
        "参数配置",
        "L5服务列表",
      ],
      breadcrumbs: [
        {
          label: "下装设计",
          operate: "download"
        },
        {
          label: "L5服务详情",
        },
      ],
      svcId: "", //L5服务ID
    };
  },
  methods: {
    init() {
      this.svcId = this.$route.query.svcId
      this.getDetail()
    },
    // 导航栏点击
    labelClick(e) {
      if(e == "download") {
        this.$router.back()
      }
    },
    async getDetail() {
      const res = await this.rpc.apimgmt.getApiDetail({
        apiId: this.svcId,
      });
      this.basicData = res
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
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4editor_service_define_base_info {
  .l5_info {
    margin: 20px;
  }
  
}
</style>
