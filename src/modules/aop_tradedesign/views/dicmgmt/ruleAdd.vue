<template>
  <div class="aop_tradedesignpage_rule_add">
    <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <RuleAdd ref="ruleAddRef" :ruleId="ruleId"></RuleAdd>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
import RuleAdd from "./components/rule_add";
export default {
  mixins: [mixin],
  components: {
    PageHeader,
    RuleAdd,
  },
  data() {
    return {
      // 导航栏参数
      breadcrumbs: [
        {
          label: "规则管理",
          operate: "list"
        },
        {
          label: "编辑规则",
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
          path: "/aop_tradedesign/dicmgmt/ruleList"
        })
      }
    },
    // 初始化
    init() {
      this.ruleId = this.$route.query.ruleId;
      this.breadcrumbs[1].label = this.ruleId ? '编辑规则' : '创建规则'
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
</style>