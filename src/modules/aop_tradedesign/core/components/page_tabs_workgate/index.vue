<template>
  <div class="aop_workgate_comps_page_tabs">
    <div :class="type == '1' ? 'detail_tabs' : 'fun_tabs'">
      <el-tabs
        v-model="activeTab"
        @edit="handleTabsEdit"
        @tab-click="handleClick(activeTab)"
      >
        <el-tab-pane
          v-for="(item, index) in tabsList"
          v-hasPermi="[item.authName]"
          :label="item.v"
          :name="item.k"
          :key="index"
          :closable="item.closable ? item.closable : false"
        ></el-tab-pane>
      </el-tabs>
    </div>
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
    // type: 1 ,2
    type: {
      type: String,
      default: () => "1",
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
    },
  },
  watch: {
    defaultActive(o) {
      this.activeTab = o;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_page_tabs {
  .detail_tabs {
    /deep/ .el-tabs__item {
      width: 140px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      color: #111111;
      background-color: $base_white;
      padding: 0;
      font-weight: $font_weight_600;
      border: 1px solid #ededed;
      border-left: 0;
      border-top: 0;
      &:last-child {
        border-right: 0;
      }
    }
    /deep/ .el-tabs__item.is-active {
      background-color: $theme_color;
      color: $base_white;
    }
  }
  .fun_tabs {
    display: flex;
    align-items: center;
    justify-content: left;
    text-align: center;
    padding-left: 20px;
    margin-bottom: 10px;
    background-color: $base_white;
    /deep/ .el-tabs__item {
      margin-right: 24px;
      height: 48px;
      line-height: 48px;    
      padding: 0 16px;
      cursor: pointer;
      color: #111111;
      font-family: PingFangSC-Semibold;
      font-size: 14px;
      letter-spacing: 0;
      font-weight: normal;
    }
    /deep/ .el-tabs__item.is-active {
      color: $theme_color;
      border-bottom: 2px solid $theme_color;
    }
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