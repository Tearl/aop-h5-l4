<template>
  <div class="aop_tradecode_comps_d4editor_service_define_base_info">
    <Basic
      ref="basicRef"
      :basicData="basicData"
      :fnctCd="fnctCd"
      :noTrans="noTrans"
      :uploadFlag="uploadFlag"
      :isEditing="isEditing"
      :mode="mode"
      @showRelatedTops="showRelatedTops"
      v-on="$listeners"
    >
    </Basic>
  </div>
</template>
<script>
import Basic from "./basic";
export default {
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
    noTrans: {
      type: Boolean,
      default: () => false,
    },
    mode: {
      type: String,
      default: 'view'
    }
  },
  data() {
    return {
      basicData: {},
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_comps_d4editor_service_define_base_info {
  .rightNav {
    /deep/ .nav_right {
      top: 40%;
    }
  }
}
</style>
