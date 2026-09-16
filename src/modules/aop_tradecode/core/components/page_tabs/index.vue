<template>
  <div class="aop_tradecode_comps_page_tabs">
    <el-tabs v-model="defaultActive" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in tabsList"
        :label="item.v"
        :name="item.k"
        :key="index"
      ></el-tab-pane>
    </el-tabs>
    <slot name="child"></slot>
  </div>
</template>
<script>
export default {
  props: {
    defaultActive: {
      type: String,
      default: () => "",
    },
    tabsList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleClick(e) {
      this.$emit("tabClick", e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_page_tabs {
  background-color: $base_white;
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  ::v-deep .el-tabs__nav-wrap::after {
    background-color: $base_white;
  }
  ::v-deep .el-tabs__header {
    margin: 0;
    .el-tabs__item {
      height: 72px;
      padding: 0 30px;
      line-height: 72px;
      font-size: 16px;
      font-family: $font_medium;
      letter-spacing: 0;
      font-weight: $font_weight_600;
    }
  }
  ::v-deep .el-tabs__content {
    display: none;
  }
}
</style>