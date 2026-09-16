<template>
  <div class="datadict_sort_manage">
    <div class="aside_tree">
      <h1>主题列表</h1>
      <div class="tree_box">
        <div
          :title="item.topicName"
          @click="querySortList(item, i)"
          :class="['tree_box_item', currentIndex == i ? 'active_box_item' : '']"
          v-for="(item, i) in themeList"
          :key="item"
        >
          {{ item.topicName }}
        </div>
      </div>
    </div>

    <div class="table_content">
      <!-- 表格查询 -->
      <div class="search">
        <div class="form">
          <el-form size="small" :model="formData" inline="true" ref="form">
            <el-form-item label="分类名称：">
              <el-input v-model="formData.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn">
          <el-button type="primary" size="small" @click="search"
            >查询</el-button
          >
          <el-button size="small" plain @click="reset">重置</el-button>
        </div>
      </div>

      <div class="table_box">
        <div class="table_box_operate">
          <el-button
            @click="doOperate('add')"
            size="medium"
            icon="el-icon-plus"
            type="primary"
            >新建分类</el-button
          >
          <el-button
            @click="expandAllRows(list)"
            size="medium"
            icon="el-icon-arrow-down"
            >{{ isOpen ? "全部展开" : "全部收起" }}</el-button
          >
        </div>
      </div>
      <div class="table">
        <el-table
          :data="list"
          :height="scrollHeight"
          row-key="categoryId"
          ref="table"
          :default-expand-all="defaultExpandAll"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column
            prop="categoryName"
            label="分类名称"
            show-overflow-tooltip
            width="240"
          >
          </el-table-column>
          <el-table-column
            prop="categoryDesc"
            show-overflow-tooltip
            label="分类说明"
          >
            <template slot-scope="scope">
              <div
                v-if="
                  scope.row.categoryDesc &&
                  scope.row.categoryDesc != '<p><br></p>' &&
                  scope.row.categoryDesc != '<p> </p>'
                "
                v-html="scope.row.categoryDesc"
              ></div>
              <div v-else>/</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="320">
            <template slot-scope="scope">
              <span
                class="link"
                @click="doOperate('add', scope.row)"
                v-if="scope.row.endFlag != '1'"
                >新建</span
              >
              <el-divider
                direction="vertical"
                v-if="scope.row.endFlag != '1'"
              ></el-divider>
              <span class="link" @click="doOperate('look', scope.row)"
                >查看</span
              >
              <el-divider direction="vertical"></el-divider>
              <span class="link" @click="doOperate('edit', scope.row)"
                >编辑</span
              >
              <el-divider direction="vertical"></el-divider>
              <span class="link color-red" @click="doOperate('del', scope.row)"
                >删除</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <sortDrawer
      v-if="sortDrawerVisible"
      v-model="sortDrawerVisible"
      :type="type"
      :formInfo="formInfo"
      :categoryList="list"
      @submit="output"
    />
    <sortDetailDrawer
      v-if="sortDetailDrawerVisible"
      v-model="sortDetailDrawerVisible"
      :formInfo="formInfo"
    />
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import sortDrawer from "./components/SortDrawer";
import sortDetailDrawer from "./components/SortDetailDrawer";
export default {
  mixins: [mixin],
  components: {
    sortDrawer,
    sortDetailDrawer,
  },
  data() {
    return {
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
      isOpen: true,
    };
  },
  async created() {
    this.salcTableHeight();
    await this.themeListQr();
    await this.listQr();
  },
  methods: {
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
    output() {
      this.listQr();
      this.sortDrawerVisible = false;
    },
    expandRows(list, isOpen) {
      list.forEach((row) => {
        this.$refs.table.toggleRowExpansion(row, isOpen);
        if (row.children) {
          this.expandRows(row.children);
        }
      });
    },
    expandAllRows(list) {
      this.isOpen = !this.isOpen;
      this.expandRows(list, !this.isOpen);
    },
    doOperate(operate, scope) {
      switch (operate) {
        case "add":
          this.type = operate;
          this.formInfo = {
            topicCode: this.topicCode,
            ...scope,
          };
          this.sortDrawerVisible = true;
          break;
        case "edit":
          console.log(scope, "scope");
          this.type = operate;
          this.formInfo = {
            categoryId: scope.categoryId,
            topicCode: this.topicCode,
          };

          if (scope.children && scope.children.length) {
            scope.disabled = true;
            this.setChildDisabledKey(scope.children);
          }

          this.sortDrawerVisible = true;
          break;
        case "look":
          this.formInfo = {
            categoryId: scope.categoryId,
          };
          this.sortDetailDrawerVisible = true;
          break;
        case "del":
          this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(async () => {
            await this.rpc.datadict.delDataDictionaryCategory({
              categoryId: scope.categoryId,
            });
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
            });
            this.listQr();
          });

          break;
      }
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
    margin: 8px 0 10px 16px;
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