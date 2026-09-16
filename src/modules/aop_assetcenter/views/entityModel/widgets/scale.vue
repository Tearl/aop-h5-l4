<template>
  <div class="object-graph-scale">
    <el-dropdown
      size="mini"
      placement="top"
      trigger="click"
      @command="handleCommand"
    >
      <div class="x6-graph-custom-works-scale-bar">
        <p @click.stop="zoomIn">
          <i class="el-icon-zoom-in"></i>
        </p>
        <span class="el-dropdown-link"
          >{{ val }}%<i class="el-icon-arrow-down el-icon--right"></i
        ></span>
        <p @click.stop="zoomOut">
          <i class="el-icon-zoom-out"></i>
        </p>
      </div>
      <el-dropdown-menu slot="dropdown">
        <div style="height: 200px; overflow-y: auto">
          <el-dropdown-item v-for="(v, k) in list" :key="v" :command="k">
            <span style="padding: 0 24px">{{ v }}%</span>
          </el-dropdown-item>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 6,
      list: [33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 200, 250, 300],
    };
  },
  computed: {
    val() {
      return this.list[this.currentIndex];
    },
  },
  methods: {
    handleCommand(command) {
      this.currentIndex = command;
      this.zoom(this.list[command]);
    },
    zoomIn() {
      if (this.currentIndex < this.list.length - 1) {
        this.currentIndex = this.currentIndex + 1;
        this.zoom(this.list[this.currentIndex]);
      }
    },
    zoomOut() {
      if (this.currentIndex > 0) {
        this.currentIndex = this.currentIndex - 1;
        this.zoom(this.list[this.currentIndex]);
      }
    },
    zoom(scale) {
      this.$emit('zoomTo', scale)
    },
  },
};
</script>

<style lang="scss" scoped>
.object-graph-scale {
  padding: 6px 10px 3px 6px;
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 499;
  background: #fff;
  box-shadow: 0 0 0 1px #dddbda, 0 2px 3px 0 rgba(0, 0, 0, 0.16);
  cursor: pointer;
}
.x6-graph-custom-works-scale-bar{
    display: flex;
    align-items: center;
    .x6-graph-custom-works-next-icon{
            cursor: pointer;
            width: 16px;
            height: 16px;
        }
        .el-dropdown-link{
            display: block;
            width: 74px;
            box-sizing: border-box;
            font-size: 14px;
            text-align: center;
        }
}
</style>

