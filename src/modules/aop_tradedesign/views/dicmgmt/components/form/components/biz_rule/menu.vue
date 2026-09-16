<template>
  <div
    class="aop_tradedesign_dic_cmps_data_set_form_two_dimensional_table_menu"
  >
    <ul>
      <li v-for="(item, index) in operations" :key="index">
        <el-button
          type="primary"
          size="mini"
          :disabled="handleType != item.type"
          @click="menuItemClick(item.code)"
        >
          {{ item.name }}
        </el-button>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    parentTableData: {
      type: Object,
      default: () => {},
    },
    contextPos: {
      type: Object,
      default: () => ({ l: 0, t: 0 }),
    },
    handleType: {
      type: String,
      default: "",
    },
  },
  computed: {},
  data() {
    return {
      operations: [
        {
          name: "向左插入列",
          code: "addLefttCol",
          type: "header",
          disabled: true,
        },
        {
          name: "向右插入列",
          code: "addRightCol",
          type: "header",
          disabled: true,
        },
        {
          name: "删除选中列",
          code: "delCurrentCol",
          type: "header",
          disabled: true,
        },
        {
          name: "向右移动列",
          code: "moveRightCol",
          type: "header",
          disabled: true,
        },
        {
          name: "向左移动列",
          code: "moveLeftCol",
          type: "header",
          disabled: true,
        },
        {
          name: "向上插入行",
          code: "addUpRow",
          type: "content",
          disabled: true,
        },
        {
          name: "向下插入行",
          code: "addDownRow",
          type: "content",
          disabled: true,
        },
        {
          name: "删除选中行",
          code: "delCurrentRow",
          type: "content",
          disabled: true,
        },
        {
          name: "向上移动行",
          code: "moveUpRow",
          type: "content",
          disabled: true,
        },
        {
          name: "向下移动行",
          code: "moveDownRow",
          type: "content",
          disabled: true,
        },
      ],
    };
  },
  methods: {
    menuItemClick(cmd) {
      this.$emit("menyItemCmd", cmd);
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.aop_tradedesign_dic_cmps_data_set_form_two_dimensional_table_menu {
  width: 96px;
  background-color: #fff;
  font-size: 12px;
  ul {
    display: flex;
  }
  li {
    margin-right: 10px;
    margin-bottom: 4px;
    width: 100%;
    text-align: center;
  }
  /deep/ .el-button {
    border-radius: 1px;
  }
}
</style>
