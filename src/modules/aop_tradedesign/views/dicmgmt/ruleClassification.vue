<template>
  <div class="aop_tradedesignpage_rule_classification">
    <PageHeader 
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>

    <div class="service_content_container">
      <div class="service_content_top">
        <ServiceTop ref="formRef" :serviceForm="serviceForm" :form="form">
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
        <RuleTable :searchForm="searchRecord" ref="ruleTable"></RuleTable>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from "@m/core/components/page_header";
import ServiceTop from "@m/core/components/page_search_top";
import RuleTable from "./components/rule_classification";
export default {
  components: {
    PageHeader,
    ServiceTop,
    RuleTable,
  },
  data() {
    return {
      // 导航栏参数
      breadcrumbs: [
        {
          label: "验证规则管理",
          operate: "list"
        },
        {
          label: "分类维护",
        },
      ],
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索分类名称、中文名或描述",
          style: {
            width: "260px",
          },
        },
      ],
      // 搜索信息表单
      form: {
        content: "", // 名称,描述
      },
      // 搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        content: "", // 名称或描述
      },
    };
  },
  methods: {
    // 搜索按钮
    search() {
      this.$refs.ruleTable.pager.currentPage = "1";
      Object.assign(this.searchRecord, this.form);
      this.$refs.ruleTable.getList();
    },
    // 重置按钮
    reset() {
      this.$refs.formRef.resetFields();
      this.search()
    },
    // 导航栏点击
    labelClick(e) {
      if(e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/ruleList"
        })
      }
    }
  },
  created() {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesignpage_rule_classification {
  .service_content_container {
    padding: 20px 24px;
  }
  ::v-deep .el-table thead {
    color: $reg_ft_color;
  }
  .service_content_bottom {
    background: $base_white;
    padding: 0 24px 24px;
  }
}
</style>