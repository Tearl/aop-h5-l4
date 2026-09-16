<template>
  <div class="aop_end_comps_common_detail_header">
    <div class="demand-header-wrapper">
      <div class="demand-header">
        <img
          @click="click"
          :src="require('@m/assets/images/icon_asset_back.png')"
          alt=""
        />
        <span>{{ label }} </span>
        <span class="subLabel" v-if="!!subLabel">&nbsp;/ {{ subLabel }}</span>
      </div>
      <div class="buttons">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    subLabel: {
      type: String,
      default: "",
    },
  },
  methods: {
    routeBack() {
      this.$emit("routeBack");
    },
    click() {
      this.$emit("routeBack");
    },
  },
};
</script>

<style lang="scss" scoped>
.aop_end_comps_common_detail_header {
  .demand-header-wrapper {
    padding: 0 24px;
    height: 48px;
    background: #ffffff;
    box-shadow: 0 1px 10px 0 #e7e7e7;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .demand-header {
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #999999;
    letter-spacing: 0;
    .demand-label {
      color: #000;
    }
    img {
      width: 16px;
      height: 16px;
      margin-right: 12px;
      cursor: pointer;
    }
    .subLabel {
      color: #151515;
    }
  }
  .buttons {
    display: flex;
    align-items: center;
  }
}
</style>
