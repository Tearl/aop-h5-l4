<template>
  <div class="aop_tradecode_comps_d4editor_service_define_base_info">
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
    </Basic>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Basic from "./basic";

export default {
  mixins: [mixin],
  components: {
    Basic,
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
