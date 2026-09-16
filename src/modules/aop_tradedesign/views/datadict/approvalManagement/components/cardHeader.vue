<template>
  <div class="grid-card-head">
    <div class="draggable title">
      <span>{{ title }}</span>
      <el-radio-group
        v-model="radio"
        v-if="type == 'chart'"
        size="mini"
        class="chart-classs"
        @input="radioChange"
      >
        <el-radio-button label="柱状图"></el-radio-button>
        <el-radio-button label="折线图"></el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="type == 'standard'">统计时间：2025-04-21 00:00:00</div>
    <div
      v-if="type == 'standard'"
      class="icon refresh"
      @click="() => refresh()"
    />
    <el-button
      v-if="type == 'chart'"
      type="primary"
      size="small"
      @click="uploadList"
      >下载报表</el-button
    >
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    refresh: Function,
    type: {
      type: String,
      default: () => "",
    },
  },

  data() {
    return {
      radio: "柱状图",
    };
  },

  computed: {},

  methods: {
    radioChange() {
      this.$emit("change", this.radio);
    },
    uploadList() {},
  },
};
</script>

<style lang="scss" scoped>
.grid-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    flex: 1;

    &.draggable {
      padding-left: 4px;
    }
  }
  .chart-classs {
    margin-left: 20px;
  }

  .icon {
    cursor: pointer;
    height: 20px;
    width: 20px;
    background: url("~@m/assets/images/arrow.svg") no-repeat;
    background-size: 100% auto;
    margin-left: 6px;
    border-radius: 2px;

    &:hover {
      background-color: #f5f5f5;
    }

    &.refresh {
      background-image: url("~@m/assets/images/sync.png");
    }

    &.set {
      background-image: url("~@m/assets/images/setup.png");
    }
  }
}
</style>

