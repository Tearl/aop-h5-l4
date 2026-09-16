<template>
  <div class="aop_tradecode_comps_d4analyse_process_aside">
    <el-menu :default-active="active">
      <!-- 原先的0接口定义 拆分业务交易列表 和 业务接口列表 -->
      <el-menu-item index="1" @click="goTo('1')">
        <div slot="title">
          <span>规则分析</span>
        </div>
      </el-menu-item>
      <el-menu-item index="2" @click="goTo('2')" >
        <div slot="title">
          <span>功能设计</span>
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
      default: () => "",
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
  watch:{
    'active':{
        handler(val,old){
            if(val=='0' || val =='3'){
                this.$nextTick(()=>{
                    this.active='2'
                })
            }
        },
        deep: true,
        immediate: true,
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
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
