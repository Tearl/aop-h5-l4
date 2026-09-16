<template>
  <div class="aop_tradedesign_comps_page_banner">
    <div class="today_target">
      <div @click="searchToday">
        今日目标：<span class="target_num">{{ funcsData.todayNum }}</span
        >个
      </div>
      <div class="cumulative_num">
        <span class="undertake_num"
          >累计承接任务（个）：{{ funcsData.cumulativeUnder }}</span
        >
        <span>累计完成（个）：{{ funcsData.cumulativeCompletion }}</span>
      </div>
    </div>
    <div class="list_type">
      <div
        v-for="(num, index) in iNumsList"
        :key="index"
        class="type_item"
        @click="itemClick(num.numskey, index)"
        :class="{ active: currentIndex === index }"
      >
        <span>{{ num.numsName }}</span>
        <span class="item_nums">{{ num.nums }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  data() {
    return {
      funcsData: {}, //头部整体数据
      currentIndex: 0, //当前索引
    };
  },
  computed: {
    iNumsList() {
      return [
        {
          numsName: "全部(个)",
          nums: this.funcsData.cumulativeUnder,
          numskey: "",
        },
        {
          numsName: "待生产(个)",
          nums: this.funcsData.noProNum,
          numskey: "11",
        },
        {
          numsName: "生产中(个)",
          nums: this.funcsData.inProNum,
          numskey: "12",
        },
        {
          numsName: "待验收(个)",
          nums: this.funcsData.noAcpNum,
          numskey: "13",
        },
        {
          numsName: "已完成(个)",
          nums: this.funcsData.completiondNum,
          numskey: "14",
        },
        {
          numsName: "已延期(个)",
          nums: this.funcsData.delayNum,
          numskey: "15",
        },
      ];
    },
  },
  created() {
    this.initData();
  },
  methods: {
    //数据初始化
    initData() {
      //this.queryFuncDataSta();
    },

    //查询功能数据
    async queryFuncDataSta() {
      const res = await this.rpc.layoutdesign.queryFuncDataSta({
        type: "D3",
      });
      this.funcsData = res;
    },

    //点击每个状态内容
    itemClick(val = "", index) {
      this.currentIndex = index;
      this.$emit("search", val);
    },

    //点击今日目标
    searchToday() {
      this.$emit("search", "06");
    },
  },
};
</script>

<style lang="scss" scoped>
.aop_tradedesign_comps_page_banner {
  height: 164px;
  background: #fff;
  margin-bottom: 16px;
  .today_target {
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    height: 64px;
    padding: 20px 24px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .cumulative_num {
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
    }
    .undertake_num {
      margin-right: 32px;
    }
    .target_num {
      color: #fe5161;
      cursor: pointer;
    }
  }
  .list_type {
    display: flex;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
    height: 100px;
    background: #fff;
    padding: 12px 0px 12px 16px;
  }
  .type_item {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-right: 16px;
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

  .type_item:nth-child(2),
  .type_item:nth-child(6) {
    .item_nums {
      color: #fe5161;
    }
  }
  .type_item:nth-child(3) {
    .item_nums {
      color: #ff9104;
    }
  }
  .type_item:nth-child(4) {
    .item_nums {
      color: #2ddaac;
    }
  }
}
</style>
