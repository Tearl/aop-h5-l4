<template>
  <div class="datadict_sort_manage">
    <div class="aside_tree">
      <h1>智能对标</h1>
      <el-input
        readonly
        v-model="actionDesc"
        size="mini"
        placeholder="请输入"
      ></el-input>
      <el-button
        type="primary"
        size="small"
        @click="addSource"
        class="source-btn"
        >新增对标</el-button
      >
      <div class="tree_box">
        <div
          :title="val.topicName"
          @click="querySortList(val, i)"
          class="list-item"
          :class="['tree_box_item', currentIndex == i ? 'active_box_item' : '']"
          v-for="(val, i) in themeList"
          :key="i"
        >
          <span>{{ val.topicName }}</span>
        </div>
      </div>
    </div>

    <div class="table_content">
      <tableList></tableList>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import tableList from "./components/tableList";
export default {
  mixins: [mixin],
  components: {
    tableList,
  },
  data() {
    return {
      actionDesc: "",
      themeList: [],
      currentIndex: 0,
      formData: {
        name: "",
      },
      list: [],
      sortDrawerVisible: false,
      sortDetailDrawerVisible: false,
      type: "add",
      topicCode: "",
      formInfo: {},
      defaultExpandAll: false,
      scrollHeight: "",
    };
  },
  async created() {
    this.salcTableHeight();
    await this.themeListQr();
    await this.listQr();
  },
  methods: {
    addSource() {},
    /**
     * 计算表格滚动高度
     */
    salcTableHeight() {
      let clientHeight = window.document.documentElement.clientHeight;
      let scrollHeight = clientHeight - 251;
      this.scrollHeight = scrollHeight;
    },
    search() {
      this.listQr();
    },
    reset() {
      this.formData.name = "";
      this.listQr();
    },

    expandAllRows(list) {
      list.forEach((row) => {
        this.$refs.table.toggleRowExpansion(row, true);
        if (row.children) {
          this.expandAllRows(row.children);
        }
      });
    },

    /**
     * 查询主题列表
     */
    async themeListQr() {
      const { topicInfoList } =
        await this.rpc.datadict.qryDataDictionaryListTopic();
      this.themeList = topicInfoList || [];
      if (this.themeList.length) {
        this.topicCode = this.themeList[0].topicCode;
      }
    },
    /**
     * 查询分类列表
     */
    async listQr() {
      const { categoryInfoList } =
        await this.rpc.datadict.qryDataDictionaryCategoryList({
          topicCode: this.topicCode,
          categoryName: this.formData.name,
        });
      this.list = categoryInfoList || [];
      this.setDisabledKey(this.list, 0);
    },

    /**
     * 设置父级下的自己不可选
     *
     */
    setChildDisabledKey(list) {
      list.forEach((row) => {
        row.disabled = true;
        if (row.children) {
          this.setChildDisabledKey(row.children);
        }
      });
    },

    /**
     * 设置disabled字段禁用
     */
    setDisabledKey(list, level) {
      list.forEach((row) => {
        row.level = level;
        if (row.endFlag == "1") {
          row.disabled = true;
        }
        if (row.children && row.children.length > 0) {
          this.setDisabledKey(row.children, level + 1);
        }
      });
    },
    querySortList(info, index) {
      this.currentIndex = index;
      this.topicCode = info.topicCode;
      this.listQr();
    },
  },
};
</script>

<style lang="scss" scoped>
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.source-btn {
  width: 100%;
  margin: 6px 0;
}
.datadict_sort_manage {
  padding: 12px;
  display: flex;
  height: 100%;
  overflow: hidden;
}
.aside_tree {
  flex: 0 0 180px; /* 左侧固定宽度 */
  margin-right: 12px;
  background: #ffffff;
  padding: 8px;

  h1 {
    font-size: 16px;
    color: #111111;
    letter-spacing: 0;
    font-weight: 600;
    margin: 8px 0 10px 10px;
  }

  .tree_box {
    height: calc(100% - 30px);
    overflow-y: auto;
    .tree_box_item {
      width: 164px;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      line-height: 16px;
      font-weight: 400;
      padding: 9px 16px;
      margin-top: 6px;
      cursor: pointer;
      white-space: nowrap; /* 确保文本在一行内显示 */
      overflow: hidden; /* 超出容器的文本将被隐藏 */
      text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
    }
    .active_box_item {
      background: #f0f5ff;
      border-radius: 2px;
      color: #358aff;
    }
  }
}
.table_content {
  flex: 1;
  overflow-y: auto;
}
.search {
  padding: 16px 20px 4px 20px;
  background-color: #fff;
  display: flex;
  margin-bottom: 12px;
}
.form {
  flex: 1;
  flex-wrap: wrap;
  ::v-deep .el-input,
  ::v-deep .el-select {
    width: 180px;
  }

  ::v-deep .el-form-item__label {
    color: #000;
    font-family: PingFangSC-Regular;
  }

  ::v-deep .el-form-item--small.el-form-item {
    margin-bottom: 10px;
  }
}
.table_box {
  background: #ffffff;
  margin-top: 12px;
  padding: 14px 24px;
}
.table {
  /deep/.el-table .el-table__body tr {
    cursor: pointer;
  }

  /deep/.el-table th {
    background: #fafafc;
    font-size: 14px;
    color: #333333;
  }

  /deep/.el-table th .cell {
    padding-left: 24px;
    line-height: 23px;
  }

  /deep/.el-table td {
    padding: 11px 0;
    font-size: 14px;
    color: #666666;
    position: relative;
  }

  /deep/.el-table td .cell {
    padding-left: 24px;
    line-height: 23px;
  }
  .link {
    cursor: pointer;
    font-size: 14px;
    color: #358aff;
  }
  .color-red {
    color: #e62c0c;
  }
}
</style>