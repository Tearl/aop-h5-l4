<template>
  <div class="aop_tradedesign_comps_d4_edit_biz_rule_inner_table_right_click_menu_item">
    <div
      class="flex right-menu-item align-item-center pointer"
      @mouseover="handleOver"
      @mouseleave="handleLeave"
      :style="{ backgroundColor: bdColor, color: colorStr}"
    >
      <div class="text-overflow-hidden margin-left-small">{{ name }}</div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";

export default {
  mixins: [mixin],
  components: {
  },
  props: {
    icon: {
      type: String,
      default: () => "",
    },
    name: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      bdColor: "white",
      colorStr: "var(--color-main-font)"
    };
  },
  computed: {},
  methods: {
    handleOver() {
      this.bdColor = "#ecf5ff"
      this.colorStr = "var(--color-main)"
    },
    handleLeave() {
      this.bdColor = "white"
      this.colorStr = "var(--color-main-font)"
    }
  },
  created() {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4_edit_biz_rule_inner_table_right_click_menu_item {
  .right-menu-item {
    padding: 3px 6px 3px 6px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
  }
}
</style>