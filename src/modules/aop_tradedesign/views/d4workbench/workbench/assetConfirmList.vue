<template>
  <div class="aop_tradedesign_page_d4workbench_workbench_design">
    <!-- 待二确派单列表 -->
    <AssetConfirmList
      v-if="currentActive == 1"
    ></AssetConfirmList>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { mapActions, mapState } from "vuex";
import AssetConfirmList from "./components/assetConfirm_list";
export default {
  mixins: [mixin],
  components: {
    AssetConfirmList,
  },
  data() {
    return {
      currentActive: 1,
    };
  },
  computed: {
    ...mapState("aop_tradedesign", ["tempProcessObj", "isProcessTemp"]),
  },
  methods: {
    ...mapActions("aop_tradedesign", ["saveTempProcessObj", "changeProcessTemp"]),
    //初始化
    init() {},
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_d4workbench_workbench_design {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>