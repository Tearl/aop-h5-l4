<template>
  <div class="aop_tradedesignpage_dic_view">
    <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <div class="content">
      <DicView ref="ruleAddRef"></DicView>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
import DicView from "./components/dic_view";
export default {
  mixins: [mixin],
  components: {
    PageHeader,
    DicView,
  },
  data() {
    return {
      // 导航栏参数
      breadcrumbs: [
        {
          label: "元数据管理",
          operate: "list"
        },
        {
          label: "元数据详情",
        },
      ],
      // 规则ID
      ruleId: "",
    };
  },
  methods: {
    // 点击导航栏
    labelClick(e) {
      if(e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list"
        })
      }
    },
    // 初始化
    init() {
      // this.ruleId = this.$route.query.ruleId;
      // this.breadcrumbs[1].label = this.ruleId ? '编辑规则' : '创建规则'
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.aop_tradedesignpage_dic_view{
  .content{
    padding: 24px;
  }
}
</style>