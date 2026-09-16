<!--
 * 数据字典-数据字段管理
 -->
<template>
  <div class="panel-container">
    <!-- 列表 -->
    <div class="list-panel-outer">
      <!-- 列表头部行 -->
      <div class="page-flex-mode-header mb16">
        <h1>对标记录</h1>
        <el-button
          @click="handleAdd"
          icon="el-icon-plus"
          size="small"
          type="primary"
          >新增对标</el-button
        >
      </div>
      <!-- 列表 -->
      <div class="aop_common_page_table">
        <el-table v-loading="tableLoading" :stripe="isStripe" :data="tableData">
          <el-table-column prop="fieldName" label="对标数据" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.fieldName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fieldKeyName" label="对标值" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.fieldKeyName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="fieldFullName"
            label="发起时间"
            min-width="120"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.fieldFullName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="topicName" label="结束时间" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.topicName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="categoryName" label="对标结果" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.categoryName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fieldSource" label="当前进度" min-width="100">
            <template slot-scope="{ row }">
              <span>{{ row.mappingFlag == "0" ? "未映射" : "已映射" }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="list-panel-outer" style="margin-top: 10px">
      <div class="page-flex-mode-header mb16">
        <h1>对标结果</h1>
        <el-button @click="handleAdd" size="small" type="warning"
          >批量映射</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { applySourceOption } from "@m/utils/commonData";

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      action: "",
      tableLoading: false, //表格加载状态
      tableData: [], // 表格数据
      queryParams: {}, // 页面间跳转传参
      applySourceObj: {},
    };
  },
  created() {
    this.queryParams = this.$route.query || {};
    this.action = this.queryParams.action || "";
    this.getTableData();
  },
  methods: {
    // 新增
    handleAdd() {
      this.$refs.handleField.openDrawer({
        drawerTitle: "新增字段",
        action: "addField",
      });
    },

    // 获取列表数据
    getTableData() {
      // this.tableLoading = true;
      this.searchForm.categoryId = this.searchForm.standards[1] || "";
      this.searchForm.topicCode = this.searchForm.standards[0] || "";
      let queryParams = {
        ...this.searchForm,
        queryType: "2", // 1数据字典管控 2数据字段管理 3其他
        likeFlag: "1", // 模糊查询
      };
      this.rpc.datadict
        .dataDictionaryFieldListQuery(queryParams)
        .then((res) => {
          this.tableData = res.dictionaryFiledLists || [];
          this.tableLoading = false;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/common.scss";
@import "../../css/page.scss";
h1 {
  font-size: 16px;
  color: #111111;
  letter-spacing: 0;
  font-weight: 600;
}
// 头部标题条
.page-flex-mode-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;

  .title-text {
    em {
      margin-right: 8px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #333333;
      line-height: 24px;
      font-weight: 500;
      font-style: normal;
    }
    span {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #999999;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: 400;
    }
  }
}
// 搜索框行
.top-search-line {
  padding: 16px 24px 4px;
  position: relative;
  // height: 64px;
  margin-bottom: 12px;
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex: none;
  ::v-deep .el-form-item {
    margin-bottom: 12px;
    .el-select {
      width: 100%;
    }
  }
  .search-side-btns {
    width: 400px;
    text-align: right;
    .search-side-btn {
      width: 64px;
      height: 32px;
      padding: 0;
    }
  }
  .comp-lib-search-form {
    ::v-deep .el-form-item__label {
      color: rgba(0, 0, 0, 0.85);
    }
  }
}

// 列表部分
.list-panel-outer {
  border-radius: 4px;
  padding: 16px 24px;
  background-color: #fff;
}
.flex_wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.panel-container {
  display: flex;
  flex-direction: column;
  .list-panel-outer {
    flex: 1;
  }
}
.showSideBar2 {
  position: absolute;
  left: 50%;
  bottom: -5px;
  height: 18px;
  color: #666;
  font-size: 18px;
  cursor: pointer;
  -webkit-transition: background 0.3s ease;
  transition: background 0.3s ease;
  transform: rotate(270deg);
  -webkit-transform: rotate(270deg);
  z-index: 2;
  .arrow_right {
    position: absolute;
    right: 2px;
    font-size: 14px;
    cursor: pointer;
  }
  .arrow_left {
    position: absolute;
    right: 2px;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
