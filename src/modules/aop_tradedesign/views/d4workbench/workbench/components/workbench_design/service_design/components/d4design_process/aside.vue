<template>
  <div class="aop_tradedesign_comps_d4analyse_process_aside">
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
          /><span>交易定义</span>
        </div>
      </el-menu-item>
      <el-menu-item index="1" @click="goTo('1')">
        <div slot="title">
          <img
            :src="
              active == '1'
                ? require('@m/assets/images/icon_asdesign_a.png')
                : require('@m/assets/images/icon_asdesign.png')
            "
          /><span>交易设计</span>
        </div>
      </el-menu-item>
      <el-menu-item index="2" @click="goTo('2')">
        <div slot="title">
          <img
            :src="
              active == '2'
                ? require('@m/assets/images/icon_asdev_a.png')
                : require('@m/assets/images/icon_asdev.png')
            "
          /><span>字典定义</span>
        </div>
      </el-menu-item>
      <!-- <el-menu-item index="2" @click="goTo('2')">
        <div slot="title">
          <img
            :src="
              active == '2'
                ? require('@m/assets/images/icon_asdev_a.png')
                : require('@m/assets/images/icon_asdev.png')
            "
          /><span class="mock_title">MOCK</span>
          <span class="design_title">设计</span>
        </div>
      </el-menu-item>
      <el-menu-item index="3" @click="goTo('3')">
        <div slot="title">
          <img
            :src="
              active == '3'
                ? require('@m/assets/images/icon_asdev_a.png')
                : require('@m/assets/images/icon_asdev.png')
            "
          /><span>服务划分</span>
        </div>
      </el-menu-item> -->
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: String,
      default: () => "1",
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
      if (this.active == "0") {
        this.$router.push({
          path: "/aop_tradedesign/assetsdesign/list",
        })
      }
      this.$emit("backToList")
    },
    goTo (e) {
      console.log(e)
      this.$emit("goTo", e)
      // if (this.isClickTips) {
      //   this.$emit("goTo", e)
      // } else {
      //   if (e == "0") {
      //     if(this.active == e) return
      //     this.$router.push({
      //       path: "/aop_tradedesign/assetsdesign/definition",
      //       query: {
      //         servId: this.$route.query.servId,
      //         servNm: this.$route.query.servNm,
      //         isDev: this.$route.query.isDev,
      //         pageType: 'design'
      //       },
      //     });
      //   } else if (e == "1") {
      //     if(this.active == e) return
      //     this.$router.push({
      //       path: "/aop_tradedesign/assetsdesign/design",
      //       query: {
      //         servId: this.$route.query.servId,
      //         servNm: this.$route.query.servNm,
      //         isDev: this.$route.query.isDev
      //       },
      //     });
      //   } else {
      //     if(this.active == e) return
      //     this.$router.push({
      //       path: "/aop_tradedesign/assetsdev/modify",
      //       query: {
      //         servId: this.$route.query.servId,
      //         servNm: this.$route.query.servNm,
      //         isDev: this.$route.query.isDev
      //       },
      //     });
      //   }
      // }
    },
  },
  created () { },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4analyse_process_aside {
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