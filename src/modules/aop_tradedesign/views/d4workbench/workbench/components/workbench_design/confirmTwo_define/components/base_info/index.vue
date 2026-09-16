<template>
  <div class="aop_tradedesign_comps_d4editor_service_define_base_info">
    <Basic
      ref="basicRef"
      pageType="read"
      :basicData="basicData"
      :isEdit="isEdit"
    >
      <!-- <div slot="rightNav">
        <PageRightNav
          :itemList="itemList"
          parentClass=".process_middle"
          navClass=".base_nav_title"
        ></PageRightNav>
      </div> -->
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
    isEdit: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      basicData: {},
      itemList: [
        "基本信息",
        "输入参数",
        "业务规则",
        "输出参数",

      ],
    };
  },
  methods: {
    init() {
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
  
}
</style>
