<template>
  <div class="aop_tradedesign_comps_d4_edit_biz_rule_inner_table_right_click_menu">
    <div style="width: 100%" class="border-radius-little">
      <div
        style="width: 100%"
        v-for="(item, index) in rightMenuList"
        :key="item.name"
        @click="handleClick(item)"
      >
        <RightClickMenuItem
          :class="
            index == rightMenuList.length - 1
              ? 'border-radius-bottom-little'
              : index == 0
              ? 'border-radius-top-little bd-bottom'
              : 'bd-bottom'
          "
          :icon="item.icon"
          :name="item.name"
        ></RightClickMenuItem>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import RightClickMenuItem from './right_click_menu_item.vue'
import filters from "@m/utils/filters";

export default {
  mixins: [mixin],
  components: {
    RightClickMenuItem
  },
  props: {
    rightClickMenuType: {
      type: String,
      default: () => "",
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    tableColumn: {
      type: Array,
      default: () => [],
    },
    currentColumn: {
      type: Object,
      default: () => ({}),
    },
    currentRow: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
    };
  },
  computed: {
    rightMenuList() {
      if (this.rightClickMenuType == "column") {
        const rightMenuList = [
          {
            name: "向左插入列",
            id: "addLeftColumn"
          },
          {
            name: "向右插入列",
            id: "addRightColumn"
          },
          {
            name: "删除选中列",
            id: "deleteColumn"
          },
          {
            name: "向左移动列",
            id: "moveColumnLeft"
          },
          {
            name: "向右移动列",
            id: "moveColumnright"
          },
        ]
        if (this.tableColumn.length == 1) {
          return rightMenuList.filter(item => !["向左移动列", "向右移动列", "删除选中列"].includes(item.name))
        } else if (this.currentColumn.index == 0) {
          return rightMenuList.filter(item => item.name != "向左移动列")
        } else if (this.currentColumn.index == this.tableColumn.length - 1) {
          return rightMenuList.filter(item => item.name != "向右移动列")
        } else {
          return rightMenuList
        }
      } else if (this.rightClickMenuType == "row") {
        const rightMenuList = [
          {
            icon: "el-icon-document",
            name: "向上插入行",
            id: "addUpRow"
          },
          {
            icon: "el-icon-refresh-right",
            name: "向下插入行",
            id: "addDownRow"
          },
          {
            icon: "el-icon-delete",
            name: "删除选中行",
            id: "deleteRow"
          },
          {
            icon: "el-icon-delete",
            name: "向上移动行",
            id: "moveRowUp"
          },
          {
            icon: "el-icon-delete",
            name: "向下移动行",
            id: "moveRowDown"
          },
        ]
        if (this.tableData.length == 1) {
          return rightMenuList.filter(item => !["向上移动行", "向下移动行", "删除选中行"].includes(item.name))
        } else if (this.currentRow.index == 0) {
          return rightMenuList.filter(item => item.name != "向上移动行")
        } else if (this.currentRow.index == this.tableData.length - 1) {
          return rightMenuList.filter(item => item.name != "向下移动行")
        } else {
          return rightMenuList
        }
      } else {
        return []
      }
    } 
  },
  methods: {
    handleClick(item) {
      this.$emit("handleClick", item)
    }
  },
  created() {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4_edit_biz_rule_inner_table_right_click_menu {
}
</style>