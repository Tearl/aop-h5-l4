<template>
  <div class="aop_tradedesignpage_rule_list">
    <PageHeader 
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <div class="content">
      <div class="service_content">
      <ServiceTop :serviceForm="serviceForm" :form="form" ref="serviceTopRef">
        <div slot="rightButton">
          <el-button
            type="primary"
            size="small"
            @click="search"
            class="right_button"
            >搜索</el-button
          >
          <el-button size="small" @click="reset" class="right_button"
            >重置</el-button
          >
        </div>
      </ServiceTop>
    </div>
    <div class="service_content_bottom">
      <RuleList
        ref="ruleList"
        :searchForm="searchRecord"
        :classifyOptions="classifyOptions"
      >
      </RuleList>
    </div>
    </div>
    
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import RuleList from "./components/rule_list";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import PageHeader from "@m/core/components/page_header";
export default {
  mixins: [mixin],
  components: {
    RuleList,
    ServiceTop,
    PageHeader
  },
  data() {
    return {
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索规则名称、中文名或描述",
          style: {
            width: "260px",
          },
        },
        // {
        //   type: "select",
        //   model: "paraClassifyId",
        //   placeholder: "所属分类",
        //   select: [],
        //   filterable: true,
        // },
      ],
      // 搜索信息表单
      form: {
        content: "", // 名称,id,描述
        // paraClassifyId: "", // 所属分类id
      },
      // 搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        content: "", // 编号或名称或描述
        paraClassifyId: "", // 所属分类id
      },
      // 分类下拉框选项参数
      classifyOptions: [],
       // 导航栏参数
      breadcrumbs: [
        {
          label: "元数据",
          operate: "list"
        },
        {
          label: "验证规则管理",
        },
      ],
    };
  },
  methods: {
    // 搜索按钮
    search() {
      Object.assign(this.searchRecord, this.form);
      this.$refs.ruleList.pager.currentPage = "1";
      this.$refs.ruleList.getList();
    },
    // 重置按钮
    reset() {
      this.$refs.serviceTopRef.resetFields();
      this.search()
    },
    // 规则分类的下拉列表
    async getRuleClassification() {
      const res = await this.rpc.systemmgmt.getRuleClassification();
      this.classifyOptions = res.rciList;
      // const selectList = res.rciList.map((item) => ({
      //   type: item.clsfCnNm,
      //   value: item.clsfId,
      // }));
      // this.serviceForm.find((item) => item.model == "paraClassifyId").select =
      //   selectList;
    },
    // 导航栏点击
    labelClick(e) {
      if(e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list"
        })
      }
    }
  },
  created() {
    this.getRuleClassification();
  },
};
</script>

<style lang="scss" scoped>
.aop_tradedesignpage_rule_list {
  .content{
     padding: 20px 24px;
  }
}
</style>    