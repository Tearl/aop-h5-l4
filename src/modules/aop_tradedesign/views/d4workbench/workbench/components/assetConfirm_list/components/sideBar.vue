<template>
  <div class="aop_tradedesign_comps_d4workbench_workbench_header_banner">
    <div class="list_type">
      <div
        class="type_item"
        :class="[{ active: activeTabIndex === index }]"
        v-for="(item, index) in statusList"
        :key="index"
        @click="activeTab(item, index)"
      >
        <span>{{ `${item.statusName}(${item.statusNumber})` }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";

export default {
  mixins: [mixin],
  props: {
    statusList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      reqmentFormdata: {},
      activeTabIndex: 0,
    };
  },
  created() {
    // this.queryRequireList();
  },
  methods: {
    //查询列表页
    queryRequireList() {
      this.rpc.taskmanage
        .queryRequireList({
          reqmentNm: "", //任务名称
          orderId: "", //任务编号
          orderType: "", //任务类型
          orderStatus: "", //任务状态
          distributeNm: "", //指派人
          undertakeNm: "", //承接人
          usrMobile: "", //手机号
          beginTm: "", //开始时间
          endTm: "", //结束时间
          currentPage: 1, //当前页
          turnPageShowNum: "", //当前页数量
          task: true,
        })
        .then((res) => {
          this.reqmentFormdata = res;

          // noDisNum 代派单
          // noReceivedNum 代接单
          // receivedNum 已接单
          // completiondNum 已完成

          this.statusList[0].statusNumber = res.turnPageTotalNum;
          this.statusList[1].statusNumber = res.noDisNum;
          this.statusList[2].statusNumber = res.noReceiveNum;
          this.statusList[3].statusNumber = res.receivedNum;
          this.statusList[4].statusNumber = res.completiondNum;
        });
    },
    activeTab(item, index) {
      this.activeTabIndex = index;
      this.$emit("tabChange", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.aop_tradedesign_comps_d4workbench_workbench_header_banner {
  height: 100%;
  // background: #fff;
  margin-bottom: 16px;
  .list_type {
    display: flex;
    flex-direction: column;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    width: 150px;
    line-height: 60px;
    background: #fff;
    margin: 16px;
    // padding: 12px 0px 12px 16px;
  }
  .type_item {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    // margin-right: 16px;
    border-radius: 2px;
    &.active {
      color: #358aff;
      background: #f2f8ff;
      .item_nums {
        color: #358aff !important;
      }
    }
    .item_nums {
      font-family: DINAlternate-Bold;
      font-size: 28px;
      color: #000000;
    }
  }
}
</style>
