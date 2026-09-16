<template>
  <div class="aop_workgate_comps_apimgmt_api_info_remark">
    <div class="content">
      <div class="detail_list">
        <div class="list_content">
          <PageViewer :editorText="detailInfo.apiDesc"></PageViewer>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import filters from "@m/utils/filters";
import PageViewer from "@m/core/components/page_viewer";
export default {
  components: {
    PageViewer
  },
  props: {
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_apimgmt_api_info_remark {
  .content {
    display: flex;
    .detail_list {
      width: 100%;
    }
    .list_content {
      margin-top: 16px;
      font-family: $font_regular;
      font-size: 14px;
      color: $sec_ft_color;
      letter-spacing: 0;
      .content_info {
        color: $pri_ft_color;
        &.cursor {
          color: $theme_color;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
