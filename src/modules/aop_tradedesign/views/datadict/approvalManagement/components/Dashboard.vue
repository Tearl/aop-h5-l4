<template>
  <div class="grid-card dashboard">
    <card-header title="标准数据统计" type="standard" />
    <div class="no-drag">
      <div class="list">
        <div
          class="item wait"
          @click="() => goTarget('wait', 'waitDistribute')"
        >
          <div class="cnt">
            <h1>字段总数</h1>
            <div class="count">{{ standardReport.fieldTotalNum || 0 }}</div>
          </div>
          <div class="cnt">
            <h1 class="iso">已贯标</h1>
            <div class="count">{{ standardReport.fieldStandardNum || 0 }}</div>
          </div>
        </div>
        <div
          class="item finish"
          @click="() => goTarget('finish', 'finishDistribute')"
        >
          <div class="cnt">
            <h1>词根总数</h1>
            <div class="count">{{ standardReport.dataRootNum || 0 }}</div>
          </div>
          <!-- <div class="icon" /> -->
        </div>
        <div class="item submit" @click="() => goTarget('sub', null)">
          <div class="cnt">
            <h1>标准主题总数</h1>
            <div class="count">{{ standardReport.topicTotalNum || 0 }}</div>
          </div>
          <!-- <div class="icon" /> -->
        </div>
        <div class="item receive">
          <div class="cnt">
            <h1>标准分类总数</h1>
            <div class="count">{{ standardReport.categoryTotalNum || 0 }}</div>
          </div>
          <!-- <div class="icon" /> -->
        </div>
      </div>
    </div>
    <div class="draggable draggable-handle" />
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import cardHeader from "./cardHeader";

export default {
  data() {
    return {
      wait: 0,
      finish: 0,
      sub: 0,
      receive: 0,
      loading1: false,
      loading2: false,
    };
  },

  props: {
    standardReport: {
      type: Object,
      default: () => {},
    },
  },
  computed: {},
  mixins: [mixin],
  components: {
    cardHeader,
  },

  created() {},

  methods: {
    goTarget(activeTab, activeStatus) {
      // this.$router.push({
      //   path: "/aop_usercenter/todoList",
      //   query: {
      //     activeTab,
      //     activeStatus,
      //   },
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 16px 24px;

  .list {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;

    .item {
      height: 104px;
      background-color: rgba(#ff9600, 0.06);
      border-radius: 4px;
      flex: 1;
      min-width: 180px;
      display: flex;
      justify-content: space-between;
      padding: 20px 24px;
      align-items: center;
      cursor: pointer;

      h1 {
        font-size: 14px;
        color: #666;
        margin-bottom: 12px;
        &.iso {
          color: rgb(103, 194, 58);
        }
      }

      .count {
        font-size: 36px;
        font-weight: 600;
        color: #333;
        line-height: 1;
      }

      .icon {
        width: 36px;
        height: 36px;
        background: url("~@m/assets/images/todo.svg") no-repeat;
        background-size: 100% auto;
      }

      &.finish {
        background-color: rgba(#53c41a, 0.06);

        .icon {
          background-image: url("~@m/assets/images/done.svg");
        }
      }

      &.submit {
        background-color: rgba(#8f66ff, 0.06);

        .icon {
          background-image: url("~@m/assets/images/upload.svg");
        }
      }

      &.receive {
        background-color: #f1f6fd;

        .icon {
          background-image: url("~@m/assets/images/receive.svg");
        }
      }
    }
  }
}
</style>
