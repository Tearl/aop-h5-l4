<template>
  <div class="page_home">
    <!-- <PageHeader
      :breadcrumbs="cpnBreadcrumbs"
      @labelClick="labelClick"
    ></PageHeader> -->
    <div class="content">
      <L5Detail ref="L5DetailRef"></L5Detail>
    </div>
  </div>
</template>

<script>
import L5Detail from "./components/workbench_design/confirmTwo_define/L5Detail";
import PageHeader from "@m/core/components/page_header";
export default {
  components: {
    L5Detail,
    PageHeader,
  },
  props: {},
  data() {
    return {
      // 组件导航栏参数
      cpnBreadcrumbs: [
        {
          label: "服务详情",
          //   operate: "list",
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    labelClick(data) {
      console.log(data);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
