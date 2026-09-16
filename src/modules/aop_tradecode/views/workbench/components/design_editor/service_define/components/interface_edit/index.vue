<template>
  <div class="aop_tradecode_comps_d4editor_service_define_base_info">
    <Basic
      ref="basicRef"
      pageType="read"
      :basicData="basicData"
      :fnctCd="fnctCd"
      :uploadFlag="uploadFlag"
      :transStatus="transStatus"
      :getApiBizType="getApiBizType"
      @showRelatedTops="showRelatedTops"
      @changeList="changeList"
      :currentD4bObj="currentD4bObj"
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
    uploadFlag: {
      type: Boolean,
      default: () => false,
    },
    // currentD4bObj: {
    //   type: Object,
    //   default: () => ({})
    // }
  },
  data() {
    return {
      basicData: {},
      currentD4bObj: {},
    };
  },
  methods: {
    init() {},
    showRelatedTops() {
      this.$emit("showRelatedTops");
    },
    changeList() {
      this.$emit("changeList");
    },
  },
  created() {
    this.init();
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_d4editor_service_define_base_info {
  .rightNav {
    /deep/ .nav_right {
      top: 40%;
    }
  }
}
</style>
