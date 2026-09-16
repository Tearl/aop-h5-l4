<template>
  <div class="panel-container">
    <div v-show="isSearch" class="top-search-line">
      <el-form
        :model="searchForm"
        ref="formData"
        class="comp-lib-search-form"
        :inline="false"
        label-width="auto"
        size="small"
      >
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="字段名称/简称/全称：" props="keyName">
              <el-input
                class="w150p"
                v-model="searchForm.keyName"
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
            <el-form-item label="创建人：" props="createUserName">
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
            <el-form-item label="创建时间：" size="mini">
              <el-date-picker
                v-model="searchForm.beginTime"
                type="date"
                size="small"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 180px"
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
                style="width: 180px"
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
    </div>
    <div class="list-panel-outer">
      <div class="page-flex-mode-header mb16">
        <div class="tabs_area">
          <div
            class="tab_item"
            v-for="(item, index) in objectClassCountList"
            :class="{ active: currentIndex == index }"
            :key="index"
            @click="tabItemClick(item, index)"
          >
            {{ `${item.name}（${item.num}）` }}
          </div>
        </div>
        <div class="header-right">
          <el-button
            class="handle-btn"
            @click="handleAdd"
            icon="el-icon-plus"
            type="primary"
            >新增字段</el-button
          >
          <el-button
            @click="moreImport"
            icon="el-icon-upload2"
            style="margin-right: 10px"
            >批量导入</el-button
          >
          <tableOptimize
            :isSearch.sync="isSearch"
            :isStripe.sync="isStripe"
            :operateShow="false"
          >
          </tableOptimize>
        </div>
      </div>
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
          <el-table-column prop="fieldSource" label="是否映射" min-width="100">
            <template slot-scope="{ row }">
              <span></span>
              <el-tag :type="row.mappingFlag == '0' ? 'danger' : 'success'">{{
                row.mappingFlag == "0" ? "未映射" : "已映射"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createUserName" label="创建人" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.createUserName || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="170px"
            align="left"
            fixed="right"
          >
            <div class="flex_wrap" slot-scope="{ row }">
              <span
                class="design_btn blue pointer"
                @click="handleDelete(row)"
                v-if="row.mappingFlag == '1'"
                >解除映射</span
              >
              <span
                class="design_btn blue pointer"
                @click="handleUpgrade(row)"
                v-if="row.mappingFlag == '0'"
                >映射</span
              >
              <el-divider direction="vertical"></el-divider>
              <span class="design_btn blue pointer" @click="handleEdit(row)"
                >编辑</span
              >
              <el-divider direction="vertical"></el-divider>
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

    <!-- 新增/审批字段 -->
    <handleField
      ref="handleField"
      currentType="benchMaking"
      @refreshData="getTableData"
    />

    <mapData ref="mapData" @refreshData="getTableData" />
    <mapdetail ref="mapdetail" @refreshData="getTableData" />

    <mapping ref="mapping" @reflesh="getTableData" />
    <PageUploadBox
      dialogTitle="批量导入"
      :dialogVisiable="uploadDialog"
      dialogWidth="50%"
      :actionUrl="actionUrl"
      @uploadFile="uploadFile"
      @closeDialog="closeDialog"
      @download="download"
      @refresh="refreshData"
      @radioChange="radioChange"
    ></PageUploadBox>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import tableOptimize from "@m/core/components/table_optimize";
import pagePagination from "@m/core/components/page_pagination";
import mapData from "./mapData.vue";
import mapdetail from "./mapdetail.vue";
import mapping from "./mapping.vue";
import handleField from "../../components/manageControl/addField.vue";
import PageUploadBox from "./page_upload_box"; // 上传文件弹框

export default {
  mixins: [mixin],
  components: {
    tableOptimize,
    pagePagination,
    handleField,
    mapData,
    mapdetail,
    mapping,
    PageUploadBox,
  },
  data() {
    return {
      uploadDialog: false,
      currentIndex: 0,
      isSearch: true, // 是否展示搜索行
      isStripe: false, // 是否显示斑马线
      // 列表搜索项
      searchForm: {
        keyName: "",
        standards: [],
        categoryId: "",
        createUserName: "",
        beginTime: "",
        endTime: "",
        fieldSource: "",
      },
      objectClassCountList: [
        {
          code: "",
          name: "全部",
          num: "0",
        },
        {
          code: "0",
          name: "未映射",
          num: "0",
        },
        {
          code: "1",
          name: "已映射",
          num: "0",
        },
      ],
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
      queryParams: {}, // 页面间跳转传参
    };
  },
  created() {
    this.queryParams = this.$route.query || {};
    this.getTableData();
  },
  methods: {
    closeDialog() {
      this.uploadDialog = false;
      this.getTableData();
    },
    handleUpgrade(info = {}) {
      this.$refs.mapping.showDialog(info);
    },

    handleDelete(row = {}) {
      this.$confirm("确认解除当前映射？", "温馨提示").then(async () => {
        await this.rpc.datadict.delDataDictionaryFieldMapping({
          mappingId: row.mappingId,
        });
        this.$message({
          type: "success",
          message: "解除映射成功",
        });
        this.getTableData();
      });
    },

    tabItemClick(item, i) {
      this.currentIndex = i;
      this.mappingFlag = item.code;
      this.getTableData();
    },

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

    getDictTopic() {
      return this.rpc.datadict
        .qryBenchMarkingDictionaryListTopic({
          finaBrhNo: this.queryParams.finaBrhNo,
        })
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

    async moreImport() {
      this.uploadDialog = true;
      this.actionUrl = this.rpc.datadict.importFinaBranchDataFile({
        finaBrhNo: this.queryParams.finaBrhNo,
        nameCoverFlag: "1",
      });
    },
    refreshData(val = "") {
      this.downloadUrl = val;
      this.getTableData();
    },
    // 模板下载或导出
    async download() {
      const downLoadUrl = this.$replaceUrl(this.downloadUrl);
      const a = document.createElement("a");
      a.style.display = "none";
      a.download = "";
      a.href = downLoadUrl;
      a.click();
    },
    // 导入是否覆盖
    radioChange(e) {
      if (e == "1") {
        this.actionUrl = this.rpc.datadict.importFinaBranchDataFile({
          finaBrhNo: this.queryParams.finaBrhNo,
          nameCoverFlag: "1",
        });
      } else {
        this.actionUrl = this.rpc.datadict.importFinaBranchDataFile({
          finaBrhNo: this.queryParams.finaBrhNo,
          nameCoverFlag: "0",
        });
      }
    },

    getDictCategory(val = "") {
      return this.rpc.datadict
        .qryBenchMarkingDictionaryCategoryList({
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

    // 升级
    handleView(row) {
      if (row.mappingFlag == "1") {
        this.$refs.mapdetail.openDrawer({
          ...row,
          action: "upgrade",
          drawerTitle: "映射",
          viewType: "dataFieldManage",
        });
      } else {
        this.$refs.mapData.openDrawer({
          ...row,
          action: "upgrade",
          drawerTitle: "映射",
          viewType: "dataFieldManage",
        });
      }
    },
    // 编辑
    handleEdit(row) {
      this.$refs.handleField.openDrawer({
        ...row,
        drawerTitle: "编辑字段",
        action: "editField",
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
        keyName: "",
        standards: [],
        categoryId: "",
        createUserName: "",
        beginTime: "",
        endTime: "",
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
      let tempCategoryList = this.searchForm.standards.splice(1);
      let temStr = "";
      if (tempCategoryList.length > 1) {
        temStr = tempCategoryList.join("#");
      } else {
        temStr = tempCategoryList[0];
      }
      this.searchForm.categoryId = temStr;
      this.searchForm.topicCode = this.searchForm.standards[0] || "";
      let queryParams = {
        ...this.searchForm,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
        finaBrhNo: this.queryParams.finaBrhNo,
        mappingFlag: this.mappingFlag,
      };
      this.rpc.datadict
        .qryDataDictionaryFieldPageList(queryParams)
        .then((res) => {
          this.pager.total = Number(res.turnPageTotalNum || 0);
          this.tableData = res.dictionaryFiledLists || [];
          this.objectClassCountList[0].num = res.fieldTotal;
          this.objectClassCountList[1].num = res.notMappingFieldTotal;
          this.objectClassCountList[2].num = res.mappingFieldTotal;
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

// 头部标题条
.page-flex-mode-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  .header-right {
    display: flex;
    align-items: center;
  }
  .tabs_area {
    display: flex;
    .tab_item {
      height: 24px;
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
      margin-right: 5px;
      cursor: pointer;
      background: #f5f5f5;
      border-radius: 20px;
      padding: 0 10px;
      &.active {
        color: #358aff;
        background: #f0f5ff;
      }
    }
  }
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
  padding: 16px;
  .list-panel-outer {
    flex: 1;
  }
}
</style>
