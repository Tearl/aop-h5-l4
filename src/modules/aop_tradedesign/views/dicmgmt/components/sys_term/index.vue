<template>
  <div class="aop_tradedesign_comps_dicmgmt_sys_term">

    <div class="service_content_container">
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
      <div class="service_content_bottom">
        <TermsList ref="abbreviation" :searchForm="form">
        </TermsList>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import PageHeader from "@m/core/components/page_header";
import TermsList from "./components/terms_list";

export default {
  mixins: [mixin],
  components: {
    PageHeader,
    TermsList,
    ServiceTop,
  },
  props: {
    arsId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      // 导航栏参数
      breadcrumbs: [
        {
          label: "工作台",
          operate: "list",
        },
        {
          label: "术语定义",
        },
      ],
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "qCondition",
          placeholder: "搜索中文名称、英文名称或描述",
          style: {
            width: "260px",
          },
        },
      ],
      // 搜索条件
      form: {
        qCondition: "", // 查询条件
      },
    };
  },
  methods: {
    //点击搜索按钮
    search() {
      this.$refs.abbreviation.pager.currentPage = "1";
      this.$refs.abbreviation.getList();
    },
    //点击重置按钮
    reset() {
      this.$refs.formRef.resetFields();
    },
    // 导航栏点击
    labelClick(e) {
      if (e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/workbench/home",
        });
      }
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_sys_term {
  .service_content_container {
    // padding: 20px 24px;

    .service_content_bottom {
      background: $base_white;
      padding: 0 24px 24px;
    }
  }
}
</style>