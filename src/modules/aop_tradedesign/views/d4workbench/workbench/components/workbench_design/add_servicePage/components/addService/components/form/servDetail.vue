<template>
  <div class="aop_tradedesign_cmps_data_set_form_serv_Info">
    <div class="detail_info">
      <div class="header_title">基本信息</div>
      <div v-if="servType">
        <div class="detail">
          <span class="content_label">服务类型：</span>
          <span class="content_info">{{ (detailInfo.apiServiceType || "").substr(-4) }}</span>
        </div>
        <div class="detail">
          <span class="content_label">所属系统：</span>
          <span class="content_info">{{
            detailInfo.relySysName || detailInfo.relySys
          }}</span>
        </div>
        <div class="detail">
          <span class="content_label">服务名称：</span>
          <span class="content_info">{{ detailInfo.apiName }}</span>
        </div>
        <div class="detail">
          <span class="content_label">服务编码：</span>
          <span class="content_info">{{ detailInfo.apiCode }}</span>
        </div>
        <div class="detail_bottom">
          <div class="bottom_content">
            <span class="content_label">服务描述：</span>
            <span class="content_info" v-html="detailInfo.apiDesc"></span>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="detail">
          <span class="content_label">服务类型：</span>
          <span class="content_info">{{ (detailInfo.apiServiceType || "").substr(-4) }}</span>
        </div>
        <div class="detail">
          <span class="content_label">服务名称：</span>
          <span class="content_info">{{ detailInfo.apiName }}</span>
        </div>
        <div class="detail">
          <span class="content_label">所属数据集：</span>
          <span class="content_info">{{
            serData.dataSetNm || detailInfo.dataSetNm
          }}</span>
        </div>
        <div class="detail_bottom">
          <div class="bottom_content">
            <span class="content_label">服务描述：</span>
            <span class="content_info" v-html="detailInfo.apiDesc"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";

export default {
  mixins: [mixin],
  components: {},
  props: {
    serData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      detailInfo: {},
      servType: false,
    };
  },
  methods: {},
  created() {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_cmps_data_set_form_serv_Info {
  background: $base_white;
  padding: 20px 24px;
  .detail_info {
    .header_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #111111;
      letter-spacing: 0;
      margin-bottom: 20px;
    }
    .detail {
      margin-bottom: 20px;
      // margin-left: 20px;
      font-family: $font_regular;
      font-size: 14px;
      // color: $sec_ft_color;
      letter-spacing: 0;
      display: flex;
      .content_info {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        flex: 1;
        // color: $pri_ft_color;
      }
      .content_label {
        text-align: right;
        width: 90px;
      }
    }
    .detail_bottom {
      padding-bottom: 10px;
      .bottom_content {
        // margin-left: 20px;
        display: flex;
        .content_label {
          text-align: right;
          width: 88px;
        }
      }
    }
  }
}
</style>
