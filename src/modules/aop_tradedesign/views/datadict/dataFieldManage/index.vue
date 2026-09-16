<!--
 * 数据字典-数据字段管理
 -->
<template>
  <div class="panel-container">
    <!-- 搜索行 -->
    <div v-show="isSearch" class="top-search-line">
      <el-form
        :model="searchForm"
        ref="formData"
        class="comp-lib-search-form"
        :inline="false"
        label-width="auto"
        size="small"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="字段名称/简称/全称：" props="fieldName">
              <el-input
                class="w150p"
                v-model="searchForm.fieldName"
                placeholder="请输入"
                clearable
                maxlength="30"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              class="search_item"
              label="主题-标准分类："
              size="small"
              props="standards"
            >
              <el-cascader
                class="w150p"
                placeholder="请选择主题-标准分类"
                v-model="searchForm.standards"
                clearable
                :props="{
                  lazy: true,
                  lazyLoad,
                  checkStrictly: true,
                }"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              class="search_item"
              label="申请来源："
              size="small"
              props="fieldSource"
            >
              <el-select
                placeholder="请选择申请来源"
                v-model="searchForm.fieldSource"
                clearable
                class="w150p"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="(item, i) in mapSourceList"
                  :key="i"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              class="search_item"
              label="是否贯标："
              size="small"
              props="fieldFlag"
            >
              <el-select
                placeholder="请选择是否贯标"
                v-model="searchForm.fieldFlag"
                clearable
                class="w150p"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="未贯标" value="1"></el-option>
                <el-option label="已贯标" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item
              class="search_item"
              label="是否映射："
              size="small"
              props="mappingFlag"
              v-if="showSearch"
            >
              <el-select
                placeholder="请选择是否映射"
                v-model="searchForm.mappingFlag"
                clearable
                class="w150p"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="已映射" value="1"></el-option>
                <el-option label="未映射" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item
              label="登记人："
              props="createUserName"
              v-if="showSearch"
            >
              <el-input
                class="w150p"
                v-model="searchForm.createUserName"
                placeholder="请输入"
                clearable
                maxlength="30"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="登记时间：" size="mini" v-if="showSearch">
              <el-date-picker
                v-model="searchForm.beginTime"
                type="date"
                size="small"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 190px"
                placeholder="开始时间"
              >
              </el-date-picker>
              至
              <el-date-picker
                v-model="searchForm.endTime"
                type="date"
                size="small"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 190px"
                placeholder="结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="search-side-btns">
        <el-button
          class="search-side-btn"
          type="primary"
          size="small"
          @click="handleSearch"
          >查 询</el-button
        >
        <el-button class="search-side-btn" size="small" @click="handleReset"
          >重 置</el-button
        >
      </div>
      <div
        class="showSideBar2"
        :style="{ bottom: !showSearch ? '-5px' : '-5px' }"
        @click="searchMore"
      >
        <i class="el-icon-arrow-right arrow_left" v-show="showSearch"></i>
        <i class="el-icon-arrow-left arrow_right" v-show="!showSearch"></i>
      </div>
    </div>
    <!-- 列表 -->
    <div class="list-panel-outer">
      <!-- 列表头部行 -->
      <div class="page-flex-mode-header mb16">
        <div>
          <el-button
            v-if="action !== 'view'"
            class="handle-btn"
            @click="handleAdd"
            icon="el-icon-plus"
            type="primary"
            >新增字段</el-button
          >
          <!-- <el-button
                    class="handle-btn"
                    @click="handleAdd1"
                    icon="el-icon-plus"
                    type="primary"
                    >测试-数据字典公共组件</el-button
                > -->
        </div>

        <tableOptimize
          :isSearch.sync="isSearch"
          :isStripe.sync="isStripe"
          :operateShow="false"
        >
        </tableOptimize>
      </div>
      <!-- 列表 -->
      <div class="aop_common_page_table">
        <el-table v-loading="tableLoading" :stripe="isStripe" :data="tableData">
          <el-table-column prop="fieldName" label="字段名称" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.fieldName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fieldKeyName" label="字段简称" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.fieldKeyName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="fieldFullName"
            label="字段全称"
            min-width="120"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.fieldFullName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="topicName" label="主题" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.topicName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="categoryName" label="标准分类" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.categoryName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fieldSource" label="申请来源" min-width="100">
            <template slot-scope="{ row }">
              <span>{{
                applySourceObj[row.fieldSource] || row.fieldSource || ""
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fieldFlag" label="是否贯标" min-width="100">
            <template slot-scope="{ row }">
              <el-tag
                v-if="row.fieldFlag == '2'"
                type="danger"
                effect="dark"
                color="#FE5161"
                size="mini"
                >已贯标</el-tag
              >
              <el-tag
                v-else-if="row.fieldFlag == '1'"
                type="info"
                effect="dark"
                color="#D6D6D6"
                size="mini"
                style="border-color: #d6d6d6"
                >未贯标</el-tag
              >
              <span v-else>/</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="fieldSource" label="是否映射" min-width="100">
            <template slot-scope="{ row }">
              <span>{{ row.mappingFlag == "0" ? "未映射" : "已映射" }}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="createUserName" label="登记人" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.createUserName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="登记时间" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="120px"
            align="left"
            fixed="right"
          >
            <div class="flex_wrap" slot-scope="{ row }">
              <span
                class="design_btn blue pointer"
                v-if="action !== 'view' && row.fieldFlag == '1'"
                @click="handleUpgrade(row)"
                >升级</span
              >
              <span
                class="design_btn blue pointer"
                v-if="action !== 'view' && row.fieldFlag == '2'"
                @click="handleEdit(row)"
                >编辑</span
              >
              <el-divider
                v-if="
                  action !== 'view' &&
                  (row.fieldFlag == '1' || row.fieldFlag == '2')
                "
                direction="vertical"
              ></el-divider>

              <span class="design_btn blue pointer" @click="handleView(row)"
                >查看</span
              >
            </div>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div>
        <pagePagination
          @size-change="paginationChange"
          @current-change="currentChange"
          :pager="pager"
        >
        </pagePagination>
      </div>
    </div>

    <!-- 查看字段 -->
    <viewField ref="viewField" @refreshData="getTableData" />
    <mapData ref="mapData" @refreshData="mapData" />

    <!-- 新增/审批字段 -->
    <handleField ref="handleField" @refreshData="getTableData" />

    <!-- 公共组件试验 -->
    <aopBusinessDatadict ref="aopBusinessDatadict" />
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import tableOptimize from "@m/core/components/table_optimize";
import pagePagination from "@m/core/components/page_pagination";
import viewField from "../components/manageControl/viewField.vue";
import mapData from "../components/manageControl/mapData.vue";
import handleField from "../components/manageControl/handleField.vue";
import { applySourceOption } from "@m/utils/commonData";
import { arrayToJson } from "@m/utils/tools";

export default {
  mixins: [mixin],
  components: {
    tableOptimize,
    pagePagination,
    viewField,
    mapData,
    handleField,
  },
  data() {
    return {
      showSearch: false,
      isSearch: true, // 是否展示搜索行
      isStripe: false, // 是否显示斑马线
      // 列表搜索项
      searchForm: {
        fieldName: "",
        standards: [],
        categoryId: "",
        fieldFlag: "2",
        createUserName: "",
        beginTime: "",
        endTime: "",
        mappingFlag: "",
        fieldSource: "",
      },
      action: "",
      themeList: [],
      tableLoading: false, //表格加载状态
      tableData: [], // 表格数据
      pager: {
        //页码信息
        pageSizes: [10, 20, 50],
        turnPageShowNum: 10,
        currentPage: 1,
        total: 0,
      },
      mapSourceList: [
        {
          name: "数据字典",
          code: "common",
        },
        {
          name: "业务建模工作台",
          code: "design",
        },
        {
          name: "开发工作台",
          code: "develop",
        },
        {
          name: "测试工作台",
          code: "test",
        },
        {
          name: "架构设计工作台",
          code: "framework",
        },
        {
          name: "BJ银行",
          code: "BJBK",
        },
        {
          name: "系统初始化",
          code: "SYS_INIT",
        },
        {
          name: "S5工作台",
          code: "s5",
        },
        {
          name: "XJ银行",
          code: "XJBANK",
        },
      ],
      queryParams: {}, // 页面间跳转传参
      applySourceObj: {},
    };
  },
  created() {
    this.queryParams = this.$route.query || {};
    this.action = this.queryParams.action || "";
    this.applySourceObj = arrayToJson(applySourceOption);
    this.getTableData();
  },
  methods: {
    lazyLoad(node, resolve) {
      if (node.level === 0) {
        this.getDictTopic().then((data) => {
          resolve(data);
        });
      } else if (node.level === 1) {
        this.getDictCategory(node.value).then((data) => {
          resolve(data);
        });
      } else {
        resolve([]);
      }
    },

    searchMore() {
      this.showSearch = !this.showSearch;
    },
    getDictTopic() {
      return this.rpc.datadict
        .qryDataDictionaryListTopic()
        .then((res) => {
          const list = res.topicInfoList.map((e) => {
            return {
              value: e.topicCode,
              label: e.topicName,
            };
          });
          return list;
        })
        .catch((err) => {});
    },

    recursionData(curentArr = []) {
      for (let i = 0; i <= curentArr.length - 1; i++) {
        const item = curentArr[i];

        if (item.children.length) {
          this.recursionData(item.children);
        }
        item.value = item.categoryId;
        item.label = item.categoryName;
      }
      return curentArr;
    },

    getDictCategory(val = "") {
      return this.rpc.datadict
        .qryDataDictionaryCategoryList({
          topicCode: val,
        })
        .then((res) => {
          let list = this.recursionData(res.categoryInfoList);
          return list;
        })
        .catch((err) => {});
    },
    // 新增
    handleAdd() {
      this.$refs.handleField.openDrawer({
        drawerTitle: "新增字段",
        action: "addField",
      });
    },
    // 数据字典公共组件
    handleAdd1() {
      this.$refs.aopBusinessDatadict.openDatadict({
        fieldSource: "common",
        searchLock: {
          fieldName: "",
          // fieldType:'DATE',
          // likeFlag: '0'
        },
      });
    },
    // 升级
    handleUpgrade(row) {
      this.$refs.viewField.openDrawer({
        ...row,
        action: "upgrade",
        drawerTitle: "升级字段",
        viewType: "dataFieldManage",
      });
    },
    // 编辑
    handleEdit(row) {
      this.$refs.handleField.openDrawer({
        ...row,
        drawerTitle: "编辑字段",
        action: "editField",
      });
    },
    // 查看
    handleView(row) {
      this.$refs.mapData.openDrawer({
        ...row,
      });
    },
    // 点击搜索
    handleSearch() {
      this.pager.currentPage = 1;
      this.getTableData();
    },
    // 点击重置
    handleReset() {
      this.searchForm = {
        fieldName: "",
        standards: [],
        categoryId: "",
        fieldFlag: "",
        createUserName: "",
        beginTime: "",
        endTime: "",
        mappingFlag: "",
        fieldSource: "",
      };
      this.pager.currentPage = 1;
      this.getTableData();
    },
    // 切换每页条数
    paginationChange(val) {
      this.pager.turnPageShowNum = val;
      this.pager.currentPage = 1;
      this.getTableData();
    },
    // 切换页码
    currentChange(val) {
      this.pager.currentPage = val;
      this.getTableData();
    },
    // 获取列表数据
    getTableData() {
      this.tableLoading = true;
      this.searchForm.categoryId = this.searchForm.standards[1] || "";
      this.searchForm.topicCode = this.searchForm.standards[0] || "";
      let queryParams = {
        ...this.searchForm,
        queryType: "2", // 1数据字典管控 2数据字段管理 3其他
        likeFlag: "1", // 模糊查询
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      this.rpc.datadict
        .dataDictionaryFieldListQuery(queryParams)
        .then((res) => {
          this.pager.total = Number(res.turnPageTotalNum || 0);
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
@import "../css/page.scss";

// 头部标题条
.page-flex-mode-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  .handle-btn {
    padding: 8px 10px;
    line-height: 20px;
    background: #358aff;
    border-radius: 2px;
    min-width: 126px;
    height: 36px;
  }
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
  padding: 16px 24px 24px;
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
  padding: 12px;
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
