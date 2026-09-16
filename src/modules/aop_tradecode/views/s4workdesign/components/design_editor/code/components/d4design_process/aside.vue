<template>
  <div class="aop_tradecode_comps_d4analyse_process_aside">
    <!-- <div class="backList_btns" @click="backToList">
      <i class="el-icon-s-home"></i>
    </div> -->
    <el-menu :default-active="active">
      <el-menu-item index="0" @click="goTo('0')">
        <div slot="title">
          <img
            :src="
              active == '0'
                ? require('@m/assets/images/icon_asdefine_a.png')
                : require('@m/assets/images/icon_asdefine.png')
            "
          /><span>业务流程</span>
        </div>
      </el-menu-item>
      <el-menu-item index="1" @click="goTo('1')">
        <div slot="title">
          <img
            :src="
              active == '0'
                ? require('@m/assets/images/icon_asdefine_a.png')
                : require('@m/assets/images/icon_asdefine.png')
            "
          /><span>业务交易</span>
        </div>
      </el-menu-item>
      <el-menu-item index="2" @click="goTo('2')">
        <div slot="title">
          <img
            :src="
              active == '1'
                ? require('@m/assets/images/icon_asdesign_a.png')
                : require('@m/assets/images/icon_asdesign.png')
            "
          /><span>接口基本信息</span>
        </div>
      </el-menu-item>
      <el-menu-item index="3" @click="goTo('3')">
        <div slot="title">
          <img
            :src="
              active == '2'
                ? require('@m/assets/images/icon_asdesign_a.png')
                : require('@m/assets/images/icon_asdesign.png')
            "
          /><span>接口流程编排</span>
        </div>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: String,
      default: () => "0",
    },
    // 点击时是否会提示保存
    isClickTips: {
      type: Boolean,
      default: () => false
    }
  },
  components: {},
  data () {
    return {}
  },
  methods: {
    backToList () {
      if (this.active == "1") {
        this.$router.push({
          path: "/aop_tradecode/assetsdesign/list",
        })
      }
      this.$emit("backToList")
    },
    goTo (e) {
      console.log(e)
      this.$emit("goTo", e)
    },
  },
  created () { },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_d4analyse_process_aside {
  width: 100%;
  height: 100%;
  ::v-deep .el-menu {
    height: 100%;
    .el-menu-item {
      height: auto;
      padding: 10px 0;
      padding-left: 0 !important;
      border-bottom: 1px solid #e6e6e6;
      letter-spacing: 5px;
      img {
        width: 14px;
        height: 14px;
        margin-bottom: 8px;
      }
      div {
        writing-mode: vertical-lr;
        margin-left: -10px;
        margin-right: -10px;
      }
      &.is-active {
        font-weight: 600;
      }
    }
  }
  .backList_btns {
    background-color: $base_white;
    border-right: solid 1px #e6e6e6;
    text-align: center;
    cursor: pointer;
    padding: 5px 0;
    padding-left: 5px;
    color: $sec_ft_color;
  }
  .mock_title {
    // font-family: 'NSimSun';
    letter-spacing:2px;
  }
  .design_title {
    margin-top: -5px;
  }
}
</style>
