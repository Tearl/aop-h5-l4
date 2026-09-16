<template>
  <div class="aop_tradecode_comps_page_table_header_filter">
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
        <div v-show="slotVisble">
          <el-popover
            popper-class="my-popover"
            placement="bottom"
            trigger="click"
            width="40"
          >
            <el-checkbox-group v-model="checkData" size="mini">
              <el-checkbox
                v-for="item in checkBoxGroup"
                :key="item.label"
                :label="item.label"
                :value="item.label"
                :disabled="item.disabled"
                class="check"
              ></el-checkbox>
            </el-checkbox-group>
            <div class="filter-table-col" slot="reference">
              <i class="img_box">
                <img :src="require('@m/assets/images/common_operate.png')" />
              </i>
            </div>
          </el-popover>
        </div>
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
    checkedColumns: {
      type: Array,
      default: () => [],
    },
    checkBoxGroup: {
      type: Array,
      default: () => [],
    },
    slotVisble: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    checkData: {
      get() {
        return JSON.parse(JSON.stringify(this.checkedColumns));
      },
      set(val) {
        this.$emit("changeColumn", val);
      },
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
.aop_tradecode_comps_page_table_header_filter {
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
  .img_box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    cursor: pointer;
    line-height: 40px;
    text-align: center;
    border: 1px solid #dce0e4;
    img {
      height: 20px;
      width: 20px;
    }
  }
}
</style>

<style>
.el-popover.my-popover {
  min-width: 120px;
}
.check .el-checkbox__label {
  font-size: 12px;
}
</style>