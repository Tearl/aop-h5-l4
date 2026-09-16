<template>
  <div class="aop_tradecode_comps_d4analyse_nav">
    <div class="left_nav">
      <!-- <el-tooltip
        effect="dark"
        content="返回首页"
        placement="top"
        :enterable="false"
      >
        <i @click="navBack('home')" class="el-icon-s-home"></i>
      </el-tooltip> -->
      <el-tooltip
        effect="dark"
        content="返回上一步"
        placement="top"
        :enterable="false"
        v-if="showBackIcon"
      >
        <img
          @click="navBack('back')"
          :src="require('@m/assets/images/icon_nav.png')"
        />
      </el-tooltip>
      <div style="width:16px;" v-if="!showBackIcon"></div>
      <div class="text">
        <slot name="textProps"></slot>
      </div>
    </div>
    <div class="middle_radio">
      <slot name="radioProps"></slot>
    </div>
    <div class="right_btns">
      <slot name="btnProps"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    asideActive: {
      type: String,
      default: () => "",
    },
    showBackIcon: {
        type: Boolean,
        default: () => true,
    },
  },
  data() {
    return {};
  },
  methods: {
    navBack(e) {
        this.$router.go(-1);
    //   this.$emit("navBack", e);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_comps_d4analyse_nav {
  display: flex;
  justify-content: space-between;
  box-shadow: 0 1px 10px 0 #e7e7e7;
  align-items: center;
  height: 48px;
  width: 100%;
  background: $base_white;
  position: relative;
  z-index: 20;
  .left_nav {
    display: flex;
    align-items: center;
    i {
      font-size: 17px;
      cursor: pointer;
      margin: 1px 0px 0px 16px;
      font-weight: 600;
      color: #666;
    }
    img {
      width: 15px;
      cursor: pointer;
      margin: auto 10px;
    }
    .text {
      font-size: 14px;
      color: $pri_ft_color;
    }
  }

  .right_btns {
    margin-right: 10px;
    ::v-deep .el-button {
      @include mini_button_common;
      &.el-button--default.is-plain {
        border-color: $sec_ft_color;
        color: $sec_ft_color;
        &:hover,
        &:focus {
          color: $sec_ft_color;
        }
      }
      &.el-button--danger.is-plain {
        border-color: $danger_color;
        &:hover,
        &:focus {
          color: $danger_color;
        }
      }
      &.el-button--primary {
        background-color: $theme_color;
        border-color: $theme_color;
      }
      &.is-plain {
        background-color: $base_white;
        &:hover,
        &:focus {
          color: $theme_color;
        }
      }
    }
  }
  .middle_radio {
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;
    width: 50%;
    ::v-deep .el-radio-button__inner {
      padding: 0 8px;
      height: 28px;
      line-height: 28px;
    }
    ::v-deep .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 2px 0 0 2px;
    }
    ::v-deep .el-radio-button:last-child .el-radio-button__inner {
      border-radius: 0 2px 2px 0;
    }
  }
  // .left_nav_content {
  //   display: flex;
  //   justify-content: space-between;
  //   border-bottom: 1px solid #e7e7e7 ;
  //   // box-shadow: 0 1px 10px 0 #e7e7e7;
  //   align-items: center;
  //   height: 48px;
  //   width: 100%;
  //   background: $base_white;
  //   position: fixed;
  //   z-index: 1;
  // }
}
</style>
