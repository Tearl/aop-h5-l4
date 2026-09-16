<template>
  <div class="aop_tradecode_comps_d4analyse_page_tabs">
    <el-tabs v-model="activeTab" @edit="handleTabsEdit" @tab-click="handleClick(activeTab)">
      <el-tab-pane
        v-for="(item, index) in tabsList"
        :label="item.v"
        :name="item.k"
        :key="index"
        :closable="item.closable ? item.closable : false"
      ></el-tab-pane>
    </el-tabs>
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
  data() {
    return {
      activeTab: this.defaultActive,
    };
  },
  methods: {
    handleClick(e) {
      this.$emit("tabClick", e);
    },
    handleTabsEdit(e) {
      this.$emit("tabEdit", e);
    }
  },
  watch: {
    defaultActive(o) {
      this.activeTab = o;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_d4analyse_page_tabs {
  border-bottom: 1px solid #ededed;
  height: 50px;
  /deep/ .el-tabs__item {
    width: 140px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: #111111;
    background-color: $base_white;
    padding: 0;
    font-weight: $font_weight_600;
    border-right: 1px solid #ededed;
    // border: 1px solid #ededed;
    // border-left: 0;
    // border-top: 0;
    // &:last-child {
    //   border-right: 0;
    // }
  }
  /deep/ .el-tabs__item.is-active {
    background-color: $theme_color;
    color: $base_white;
  }
  /deep/ .el-tabs__header {
    margin: 0;
  }
  /deep/ .el-tabs__content {
    display: none;
  }
  /deep/ .el-tabs__nav-wrap {
    margin-bottom: 0;
  }
  /deep/ .el-tabs__nav-wrap::after {
    height: 0;
  }
  /deep/ .el-tabs__active-bar {
    height: 0;
  }
}
</style>
