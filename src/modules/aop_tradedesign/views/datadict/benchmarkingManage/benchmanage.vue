<template>
  <div class="datadict_sort_manage">
    <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>

    <div class="table_content">
      <tableList></tableList>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import tableList from "./components/tableList";
import PageHeader from "@m/core/components/page_header";
export default {
  mixins: [mixin],
  components: {
    tableList,
    PageHeader,
  },
  data() {
    return {
      finaBrhShortCode: "",
    };
  },
  computed: {
    breadcrumbs() {
      return [
        {
          label: this.finaBrhShortCode || "默认",
        },
        {
          label: "对标管理",
        },
      ];
    },
  },
  async created() {
    const { finaBrhShortCode } = this.$route.query;
    this.finaBrhShortCode = finaBrhShortCode;
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>