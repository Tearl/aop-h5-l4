<template>
  <div class="L5_detail_page">
    <BaseInfo ref="baseInfoRef"></BaseInfo>
  </div>
</template>

<script>
import BaseInfo from "./components/base_info";
import mixin from "@m/core/mixin";
export default {
    mixins:[mixin],
  components: {
    BaseInfo,
  },
  props: {},
  data() {
    return {
      svcId: "",
    };
  },
  created() {
    this.svcId = this.$route.query.svcId;
    this.getD4bServiceInfo();
  },
  mounted() {},
  methods: {
    async getD4bServiceInfo() {
      const res = await this.rpc.dicmgmtDefine.getApiDetail({
        apiId: this.svcId,
      });
      this.$refs.baseInfoRef.basicData = res;
    },
  },
};
</script>

<style lang="scss" scoped>
.L5_detail_page{
  padding: 16px;
}
</style>
