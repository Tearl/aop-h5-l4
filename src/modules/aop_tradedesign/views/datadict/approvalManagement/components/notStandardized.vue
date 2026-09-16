<template>
  <div class="grid-card dashboard">
    <card-header title="引用不规范数据统计" />
    <div class="no-drag">
      <div class="list">
        <div
          class="item wait"
          @click="() => goTarget('wait', 'waitDistribute')"
        >
          <div class="cnt">
            <h1>引用不规范数据总数</h1>
            <div class="count">
              {{ nonStandardReport.nonStandardTotalNum || 0 }}
            </div>
          </div>
        </div>
        <div
          class="item wait"
          @click="() => goTarget('finish', 'finishDistribute')"
        >
          <div class="cnt">
            <h1>不规范占比</h1>
            <div class="count">
              {{ nonStandardReport.nonStandardTotalNum || 0 + "%" }}
            </div>
          </div>
        </div>
        <div
          class="item wait"
          v-for="(item, index) in nonStandardReport.nonStandardList"
          :key="index"
        >
          <div class="cnt">
            <h1>{{ item.dataName || "示例名称" }}</h1>
            <div class="count">{{ item.dataCount || 0 }}</div>
          </div>
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
    return {};
  },

  props: {
    nonStandardReport: {
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
