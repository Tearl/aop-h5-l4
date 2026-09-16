<template>
  <div class="aop_tradecode_comps_page_pagination">
    <template v-if="!custom">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pager.currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pager.turnPageShowNum"
        :total="pager.total"
        layout="total, prev, pager, next, sizes, jumper"
        v-bind="$attrs"
      >
      </el-pagination>
    </template>

    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    pager: {
      type: Object,
      default: () => ({
        currentPage: "1", // 当前页数
        turnPageShowNum: "10", // 每页条数
        total: 0, // 总条数
      }),
    },
    // 是否自定义分页器，默认使用通用样式
    custom: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleSizeChange(turnPageShowNum) {
      this.$emit("size-change", turnPageShowNum);
    },
    handleCurrentChange(currentPage) {
      this.$emit("current-change", currentPage);
    },
  },
};
</script>
<style lang="scss" scoped>
.aop_tradecode_comps_page_pagination {
  margin-top: 24px;
  text-align: right;
  .el-pagination {
    ::v-deep .el-input__inner {
      height: 28px;
    }
    ::v-deep .el-pagination__jump {
      margin-left: 0;
    }
  }
}
</style>