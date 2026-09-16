<template>
  <div class="aop_tradedesign_comps_dicmgmt_sys_sidebar">
    <span class="sidebar_title">{{ name }}</span>
    <div class="sys_sidebar">
      <el-menu>
        <el-menu-item
          v-for="(item, index) in iconList"
          :key="index"
          :index="index + 1"
          @click="menuClick(item.v)"
          :class="iconCurrent == item.v ? 'is_active' : ''"
        >
          <span slot="title">{{ item.n }}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template> 

<script>
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  components: {},
  props: {
    name: {
      type: String,
      default: () => "应用",
    },
    iconCurrent: {
      type: String,
      default: () => "info",
    },
  },
  data() {
    return {
      iconList: [
        {
          n: "基本信息",
          v: "info",
        },
        // {
        //   n: "业务对象",
        //   v: "business",
        // },
        // {
        //   n: "术语定义",
        //   v: "definition",
        // },
        // {
        //   n: "数据字典",
        //   v: "dictionary",
        // },
        {
          n: "报文设置",
          v: "setting",
        },
        {
          n: "业务资产",
          v: "group",
        },
        // {
        //   n: "类别管理",
        //   v: "type",
        // },
        // {
        //   n: "领域管理",
        //   v: "domainList",
        // },
        // {
        //   n: "R5管理",
        //   v: "R5List",
        // },
        // {
        //   n: "数据集",
        //   v: "dataList",
        // },
      ]
    };
  },
  methods: {
    init() {},
    menuClick(operation) {
      this.$emit("toCurrent",operation)
    },
  },
  created() {
    this.init();
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_sys_sidebar {
  position: absolute;
  height: 100%;
  left: 0;
  top: 105px;
  bottom: 0;
  width: 216px;
  padding: 16px;
  padding-right: 0;
  .sidebar_title {
    padding: 16px;
    padding-left: 19px;
    background: #dddddd;
    display: inline-block;
    width: 100%;
    font-size: 16px;
    color: #131313;
    font-weight: $font_weight_600;
    // height: 46px;
    // line-height: 46px;
  }
  .sys_sidebar {
    // padding: 0 0 16px 16px;
    width: 100%;
    height: 100%;
    background: $base_white;
    .el-menu {
      border-right: 0;
      ::v-deep .is-active {
        color: #303133;
      }
      .is_active {
        color: $theme_color;
        background-color: #eaf1ff;
        font-weight: $font_weight_600;
      }
      ::v-deep .el-menu-item {
        padding-left: 16px !important;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        letter-spacing: 0;
      }
    }
  }
}
</style>

