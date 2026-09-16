<template>
    <div class="interface-detail-content">
        <InterfaceDetail
            :sendApiId="apiId"
            :showHeader="false"
        ></InterfaceDetail>
    </div>
</template>

<script>
import InterfaceDetail from "../../../../interfaceDetail";
export default {
    components: {
        InterfaceDetail,
    },
    props: {
        attrs: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
      apiId() {
        return this.attrs.apiId || ""
      }
    },
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>

/deep/ .aop_tradedesign_page_d4workbench_workbench_one_confirm {
  height: 100% !important;
}
  
</style>