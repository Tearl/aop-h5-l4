<template>
  <div class="agg-root-container">
    <div class="left">
      <span class="title">{{ title }}</span>
    </div>
    <div class="opt-btns" :class="{ show: isClicked }">
      <span>
        <i
          class="el-icon-edit-outline custom-event-target"
          @click="editAgg"
        ></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["getNode", "getGraph"],
  data() {
    return {
      node: null,
      graph: null,
      nodeData: {
        isClicked: false,
      },
    };
  },
  computed: {
    title() {
      return this.nodeData && this.nodeData.aggregationName || "聚合"
    },
    isClicked() {
      return this.nodeData && this.nodeData.isClicked && this.nodeData.action == '0';
    },
  },
  mounted() {
    this.graph = this.getGraph();
    this.node = this.getNode();
    this.nodeData = this.node.getData();
    this.node.on("change:data", () => {
      this.nodeData = this.node.getData();
    });
  },
  methods: {
    editAgg() {
      this.graph.trigger("node:edit", { node: this.node });
    },
  },
};
</script>

<style lang="scss" scoped>
.agg-root-container {
  position: relative;
  width: 100%;
  height: 100%;
  .left {
    position: absolute;
    height: 30px;
    top: -30px;
    left: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 8px;
    background: #fff;
    border-radius: 6px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    box-sizing: border-box;
    border: 1px solid #bbbdbf;
    .title {
      font-size: 12px;
    }
  }
  .opt-btns {
    position: absolute;
    top: -18px;
    right: 0px;
    display: flex;
    justify-content: flex-end;
    visibility: hidden;
    span {
      background: #fff;
      padding: 0 4px;
      font-size: 12px;
      .el-icon-edit-outline {
        &:hover {
          color: #0070d2;
        }
      }
      i {
        cursor: pointer;
      }
    }
  }
  .show {
    visibility: visible;
  }

  border-radius: 6px;
    border-top-left-radius: 0;
  box-sizing: border-box;

  background: #fff;
  border: 1px solid #bbbdbf;
}
</style>

