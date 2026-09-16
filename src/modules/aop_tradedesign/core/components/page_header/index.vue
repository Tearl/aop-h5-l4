<template>
  <div class="aop_tradedesign_comps_page_header">
    <div class="header_wrapper">
      <div class="header">
        <img
          @click="routeGoBack"
          :src="require('@m/assets/images/icon_back.png')"
          alt=""
        />
        <span
          v-for="(item, index) in breadcrumbs"
          :key="index"
          :class="{ demand_label: index == breadcrumbs.length - 1 }"
        >
          <template>
            <span v-if="index != 0" class="separator">/</span>
            <a v-if="!!item.operate" @click="labelClick(item.operate)">{{item.label}}</a>
            <span v-else>{{item.label}}</span>
          </template>
        </span>
      </div>
      <div v-if="labelList.length" class="detail_label_list">
        <div
          class="label"
          :class="[{ disable: item.isDisable }, item.type]"
          v-for="(item, index) in labelList"
          :key="index"
          @click="handleItemClick(item)"
        >
          {{ item.label }}
        </div>
      </div>
      <div v-else class="btn_class">
        <slot name="btn"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 左侧面包屑信息的数组
    breadcrumbs: {
      type: Array,
      default: () => [],
    },
    labelList: {
      type: Array,
      default: () => [],
    },
    routerTpye: {
      type: String,
      default: () => "",
    },
  },
  methods: {
    handleItemClick(item) {
      if (item.isDisable) return;
      this.$emit("itemClick", item.label);
    },
    routeGoBack() {
      if (!this.routerTpye) {
        this.$router.go(-1);
      }
      this.$emit("goRoute");
    },
    labelClick(e) {
      this.$emit("labelClick",e);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_page_header {
  height: 48px;
  .header_wrapper {
    position: fixed;
    width: 100%;
    padding: 0 24px;
    height: 48px;
    background: $base_white;
    border-bottom: 1px solid #e7e7e7 ;
    // box-shadow: 0 1px 10px 0 #e7e7e7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
  }
  .header {
    display: flex;
    align-items: center;
    font-family: $font_regular;
    font-size: 14px;
    color: $theme_color;
    letter-spacing: 0;
    .demand_label {
      color: $reg_ft_color;
    }
    a {
      cursor: pointer;
      font-weight: $font_weight_600;
      &:hover {
        color: $theme_color;
      }
    }
    span {
      font-weight: $font_weight_600;
    }
    img {
      width: 16px;
      height: 16px;
      margin-right: 12px;
      cursor: pointer;
    }
    .separator {
      color: $reg_ft_color;
      margin: 0 4px;
    }
  }
  .detail_label_list {
    display: flex;
    margin: 18px 0 16px;
    margin-right: 170px;
    justify-content: flex-end;
    .label {
      border: 1px solid;
      margin-left: 8px;
      border-radius: $theme_radius;
      height: 32px;
      line-height: 32px;
      font-family: $font_regular;
      font-size: 14px;
      letter-spacing: 0;
      text-align: center;
      cursor: pointer;
      padding: 0 10px;
      &.blue {
        color: $theme_color;
        border-color: $theme_color;
      }
      &.red {
        color: $danger_color;
        border-color: $danger_color;
      }
      &.green {
        color: $success_color;
        border-color: $success_color;
      }
      &.disable {
        cursor: not-allowed;
        background-image: none;
        color: $sec_ft_color;
        background-color: $base_bg_color;
        border-color: $pri_br_color;
      }
    }
  }
  .btn_class ::v-deep .el-button--primary {
    width: 72px;
    height: 32px;
    margin-right: 24px;
    border-radius: 2px;
    line-height: 8px;
  }
}
</style>
