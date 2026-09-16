<template>
  <div class="aop_tradecode_comps_page_table_header">
    <div class="table_header">
      <slot name="table_header_title">
        <div class="table_header_left">{{ title }}</div>
      </slot>
      <div class="table_header_right">
        <el-button
          v-for="item in btnList"
          v-hasPermi="[item.authName]"
          class="operate_button"
          :class="item.type"
          :key="item.type"
          @click="handleClick(item.value)"
        >
          <img v-if="item.imgSrc !== ''" :src="item.imgSrc" />
          <i v-if="item.iconClass !== ''" :class="item.iconClass"></i>
          <span>{{ item.name }}</span>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => "",
    },
    btnList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleClick(e) {
      this.$emit("btnClick", e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_page_table_header {
  width: 100%;
  .table_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    font-size: 16px;
    font-family: $font_medium;
    color: $pri_ft_color;
    ::v-deep .el-button + .el-button {
      margin-left: 0px;
    }
    ::v-deep .el-button [class*="el-icon-"] + span {
      margin-left: 0px;
    }
    .table_header_left {
      font-weight: $font_weight_600;
    }
    .table_header_right {
      display: flex;
      align-items: center;
    }
    .operate_button {
      @include normal_button_common;
      background: $theme_color;
      color: $base_white;
      margin-right: 8px;
      &:nth-last-child(1) {
        margin-right: 0px;
      }
      img {
        width: 16px;
        height: 16px;
        vertical-align: sub;
      }
    }
    .primary {
      @include primary_button;
    }
    .normal {
      @include normal_button;
    }
    .normalPlain {
      @include normal_button;
      border-color: $theme_color;
      color: $theme_color;
    }
  }
}
</style>