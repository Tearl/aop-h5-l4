<template>
  <div class="aop_tradedesign_comps_page_order_info">
    <ul class="order_info">
      <li class="list_item">
        名称：<span>{{ orderName }}</span>
      </li>
      <li class="list_item">
        工单编号：<span>{{ orderInfo.orderId }}</span>
      </li>
      <li class="list_item">
        工单类型：<span>{{ orderInfo.orderType | orderType }}</span>
      </li>
      <li class="list_item">
        工单状态：<span>{{ orderInfo.orderStatus | orderStatus }}</span>
      </li>
      <li class="list_item">
        派单时间：<span>{{ orderInfo.distributeTm | crtTm }}</span>
      </li>
      <li class="list_item">
        接单时间：<span>{{ orderInfo.undertakeTm | crtTm }}</span>
      </li>
      <li class="list_item">
        指派人员：<span>{{ orderInfo.distributeNm }}</span>
      </li>
      <li class="list_item">
        手机号：<span>{{ orderInfo.distributeMobile }}</span>
      </li>
      <li class="list_item">
        承接人员：<span>{{ orderInfo.undertakeNm }}</span>
      </li>
      <li class="list_item">
        手机号：<span>{{ orderInfo.undertakeMobile }}</span>
      </li>
      <li class="list_item">
        计划开始时间：<span>{{ orderInfo.expcWorkBeginTm | crtTm }}</span>
      </li>
      <li class="list_item">
        实际开始时间：<span>{{ orderInfo.realWorkBeginTm | crtTm }}</span>
      </li>
      <li class="list_item">
        计划结束时间：<span>{{ orderInfo.expcWorkEndTm | crtTm }}</span>
      </li>
      <li class="list_item">
        实际结束时间：<span>{{ orderInfo.realWorkEndTm | crtTm }}</span>
      </li>
      <li class="list_item">
        提交验收时间：<span>{{ orderInfo.reviewTm | crtTm }}</span>
      </li>
      <li class="list_item">
        完成验收时间：<span>{{ orderInfo.reviewCompleteTm | crtTm }}</span>
      </li>
      <li class="list_item">
        计划工时：<span>{{ expcHours }}</span>
      </li>
      <li class="list_item">
        实际工时：<span>{{ realHours }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";

export default {
  mixins: [mixin],
  components: {},
  props: {
    orderInfo: {
      type: Object,
      default: () => ({}),
    },
    orderName: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {};
  },
  computed: {
    expcHours() {
      const { expcWorkBeginTm, expcWorkEndTm } = this.orderInfo;
      if (expcWorkBeginTm && expcWorkEndTm) {
        const begin = Date.parse(filters.crtTm(expcWorkBeginTm));
        const end = Date.parse(filters.crtTm(expcWorkEndTm));
        return `${(end - begin) / 86400000 + 1}天`;
      }
      return "";
    },
    realHours() {
      const { realWorkBeginTm, realWorkEndTm } = this.orderInfo;
      if (realWorkBeginTm && realWorkEndTm) {
        const begin = Date.parse(filters.crtTm(realWorkBeginTm));
        const end = Date.parse(filters.crtTm(realWorkEndTm));
        return `${(end - begin) / 86400000 + 1}天`;
      }
      return "";
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_page_order_info {
  margin-top: 16px;
  .order_info {
    display: flex;
    flex-wrap: wrap;
    .list_item {
      width: 50%;
      font-size: 14px;
      color: $sec_ft_color;
      letter-spacing: 0;
      &:not(:nth-last-child(-n + 2)) {
        margin-bottom: 16px;
      }
      span {
        color: $pri_ft_color;
      }
    }
  }
}
</style>