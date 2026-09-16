<!--
 * 数据字典-数据字典管控-审批字段
 -->
<template>
  <div>
    <el-drawer
      class="aop-com-drawer"
      title="申请字段信息"
      :size="800"
      :visible.sync="drawerShow"
      :wrapperClosable="false"
    >
      <div v-loading="isLoading" class="datadict-drawer-info-content">
        <!-- 查看 -->
        <div class="drawer-main-content aop-com-info-form-wrap">
          <div class="info-main view-mode">
            <dl
              v-for="(item, index) in infoList"
              :key="index"
              class="info-cell"
              :class="{ 'info-block': item.isBlock }"
            >
              <dt>{{ item.title }}：</dt>
              <dd>
                {{ item.contentKey ? drawerData[item.contentKey] || "/" : "/" }}
              </dd>
            </dl>
          </div>

          <!-- 枚举定义列表 -->
          <div class="table-list-box border-top">
            <div class="table-title">枚举定义</div>
            <div class="aop_common_page_table">
              <el-table :data="enumData">
                <el-table-column prop="enumLabel" label="枚举标签">
                  <template slot-scope="scope">{{
                    scope.row.enumLabel || "/"
                  }}</template>
                </el-table-column>
                <el-table-column
                  prop="enumValue"
                  label="枚举值"
                ></el-table-column>
                <el-table-column prop="enumKey" label="枚举key">
                  <template slot-scope="scope">{{
                    scope.row.enumKey || "/"
                  }}</template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 系统推荐字段 -->
          <!-- <div class="title-text">系统推荐字段</div> -->

          <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane label="系统推荐字段" name="0"> </el-tab-pane>
            <el-tab-pane label="新增字段" name="1"> </el-tab-pane>
          </el-tabs>

          <div v-if="activeName == '0'">
            <!-- 搜索行 -->
            <div class="comp-lib-search-line">
              <el-form
                :model="searchForm"
                ref="formData"
                class="comp-lib-search-form"
                :inline="false"
                size="small"
              >
                <el-row :gutter="8">
                  <el-col :span="7">
                    <el-form-item
                      label="关键字："
                      props="fieldName"
                      label-width="70px"
                    >
                      <el-input
                        v-model="searchForm.fieldName"
                        placeholder="请输入"
                        clearable
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="" label-width="0" props="fieldType">
                      <el-select
                        v-model="searchForm.fieldType"
                        placeholder="数据类型"
                        clearable
                      >
                        <el-option
                          :label="item.lable"
                          :value="item.value"
                          v-for="item in fieldTypeOption"
                          :key="item.lable"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item
                      class="search_item"
                      label=""
                      label-width="0"
                      size="small"
                      props="fieldFlag"
                    >
                      <el-select
                        placeholder="新旧标识"
                        v-model="searchForm.fieldFlag"
                        clearable
                        class="w150p"
                        @change="topicChange"
                      >
                        <el-option label="旧字段" value="1"></el-option>
                        <el-option label="新字段" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item
                      label="精准查询："
                      props="likeFlag"
                      label-width="90px"
                    >
                      <el-switch
                        v-model="searchForm.likeFlag"
                        active-value="0"
                        inactive-value="1"
                      >
                      </el-switch>
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
                <el-button
                  class="search-side-btn"
                  size="small"
                  @click="handleReset"
                  >重 置</el-button
                >
              </div>
            </div>
            <!-- 列表 -->
            <div class="aop_common_page_table">
              <el-table v-loading="tableLoading" :data="tableData">
                <el-table-column
                  prop="fieldKeyName"
                  label="字段简称"
                  min-width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="fieldName"
                  label="字段名称"
                  min-width="100"
                ></el-table-column>
                <el-table-column
                  prop="fieldFlag"
                  label="新旧标示"
                  min-width="100"
                >
                  <template slot-scope="{ row }">
                    <el-tag
                      v-if="row.fieldFlag == '2'"
                      type="danger"
                      effect="dark"
                      color="#FE5161"
                      size="mini"
                      >新字段</el-tag
                    >
                    <el-tag
                      v-else-if="row.fieldFlag == '1'"
                      type="info"
                      effect="dark"
                      color="#D6D6D6"
                      size="mini"
                      style="border-color: #d6d6d6"
                      >旧字段</el-tag
                    >
                    <span v-else>/</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fieldBusiness"
                  label="业务定义"
                  min-width="150"
                >
                </el-table-column>
                <el-table-column
                  prop="fieldRule"
                  label="业务规则"
                  min-width="150"
                >
                </el-table-column>

                <el-table-column
                  label="操作"
                  min-width="160"
                  align="left"
                  fixed="right"
                >
                  <div class="flex_wrap" slot-scope="{ row }">
                    <span
                      class="design_btn blue pointer"
                      v-if="row.fieldFlag == '1'"
                      @click="handleUse(row, '1')"
                      >升级并使用</span
                    >
                    <span
                      class="design_btn blue pointer"
                      v-if="row.fieldFlag == '2'"
                      @click="handleUse(row, '2')"
                      >使用该字段</span
                    >

                    <el-divider
                      v-if="row.fieldFlag == '1' || row.fieldFlag == '2'"
                      direction="vertical"
                    ></el-divider>

                    <span
                      class="design_btn blue pointer"
                      @click="handleView(row)"
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

          <div v-else>
            <analysisFieIdForm
              @addWordRoots="addWordRoots"
              ref="fieIdForm"
              :analyInfo="analyInfo"
            />
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="info-bottom-handle">
          <el-button type="default" plain size="medium" @click="handleClose">
            取消
          </el-button>
          <el-button
            class="ml24"
            type="primary"
            size="medium"
            @click="handleAddField"
          >
            新增
          </el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 查看字段 -->
    <viewField
      ref="viewField"
      @fieldUse="handleUse"
      @fieldUpgradeUse="handleUse"
    />

    <!-- 新增词根 -->
    <handleWordRoots ref="handleWordRoots" @success="handleAddRootSuccess" />
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import viewField from "./viewField.vue";
import pagePagination from "@m/core/components/page_pagination";
import { applySourceOption, fieldTypeOption } from "@m/utils/commonData";
import analysisFieIdForm from "./analysisFieIdForm.vue";
import handleWordRoots from "./handleWordRoots.vue";
import { arrayToJson } from "@m/utils/tools";
export default {
  mixins: [mixin],
  components: { viewField, pagePagination, analysisFieIdForm, handleWordRoots },
  data() {
    return {
      isLoading: false,
      drawerShow: false, // 弹窗是否显示
      drawerData: {},
      fieldTypeOption: [],
      // 列表搜索项
      searchForm: {
        fieldName: "",
        fieldType: "",
        likeFlag: "1",
        fieldFlag: "",
      },
      tableLoading: false, //表格加载状态
      tableData: [], // 表格数据
      pager: {
        //页码信息
        pageSizes: [10, 20, 50],
        turnPageShowNum: 10,
        currentPage: 1,
        total: 0,
      },
      // 展示数据
      infoList: [
        {
          title: "字段名称",
          contentKey: "fieldName",
        },
        {
          title: "字段简称",
          contentKey: "fieldKeyName",
        },
        {
          title: "字段全称",
          contentKey: "fieldFullName",
        },
        {
          title: "别名",
          contentKey: "fieldAlias",
        },
        {
          title: "业务定义",
          contentKey: "fieldBusiness",
          isBlock: true,
        },
        {
          title: "业务规则",
          contentKey: "fieldRule",
          isBlock: true,
        },
        {
          title: "字段类型",
          contentKey: "fieldType",
        },
        {
          title: "字段长度",
          contentKey: "fieldLength",
        },
        {
          title: "申请人",
          contentKey: "createUserName",
        },
        {
          title: "申请来源",
          contentKey: "fieldSourceName",
        },
        {
          title: "申请时间",
          contentKey: "createTime",
        },
        // {
        //   title: "原始字典项英文名称",
        //   contentKey: "createTime",
        // },
        // {
        //   title: "原始字典项英文简称",
        //   contentKey: "createTime",
        // },
      ],
      enumData: [],

      activeName: "0",
      analyInfo: {},
    };
  },
  inject: ["openTab"], // 用于打开窗口
  created() {},
  methods: {
    addWordRoots() {
      this.$refs.handleWordRoots.openDrawer();
    },

    handleAddRootSuccess() {
      this.$refs.fieIdForm.handleAddRootSuccess();
    },

    tabClick() {
      if (this.activeName == "1") {
        this.analyInfo = {
          fieldName: this.searchForm.fieldName,
          fieldNameDisabled: false,
        };
      }
    },
    // 打开抽屉
    openDrawer(data = {}) {
      console.log(data, ".......openDrawer");

      // data数据初始化
      Object.assign(this.$data, this.$options.data());
      this.drawerData = { ...data };
      let applySourceObj = arrayToJson(applySourceOption);
      this.drawerData.fieldSourceName =
        applySourceObj[this.drawerData.fieldSource] ||
        this.drawerData.fieldSource ||
        "";
      this.fieldTypeOption = fieldTypeOption;
      this.enumData = data.dataDictionaryEnumLists || [];

      this.drawerShow = true;
      this.searchForm.fieldName = data.fieldName;
      this.getTableData();
    },
    handleAddField() {
      if (this.activeName == "0") {
        this.$emit("reviewFieldAdd", Object.assign({}, this.drawerData));
      } else {
        const data = this.$refs.fieIdForm.handleConfirm();
        if (data) {
          this.$emit(
            "reviewFieldAdd",
            Object.assign({}, this.drawerData, data)
          );
        } else {
          // this.$emit("reviewFieldAdd", Object.assign({}, this.drawerData));
        }
      }
    },
    // 使用该字段/升级并使用
    handleUse(row, fieldFlag) {
      this.$confirm(
        fieldFlag === "1"
          ? "是否确认升级并使用该字段处理申请？"
          : "是否确认使用该字段处理申请？",
        "温馨提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          customClass: "custom_confirm_box",
          showClose: false,
        }
      )
        .then(() => {
          this.rpc.datadict
            .dataDictionaryFieldUpdate({
              fieldId: this.drawerData.fieldId || "",
              fieldSource: this.drawerData.fieldSource || "",
              status: "02", // 拒绝
              replaceField: row.fieldId,
              fieldFlag: row.fieldFlag,
              operation: "0", // 操作方式 0：审批；1：修改
            })
            .then(() => {
              this.$notify({
                title: "成功",
                message: "处理成功",
                duration: 2000,
                type: "success",
              });
              this.$emit("refreshData");
              this.$refs.viewField.handleClose();
              this.handleClose();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    handleView(row) {
      this.$refs.viewField.openDrawer({
        ...row,
        action: row.fieldFlag === "1" ? "fieldUpgradeUse" : "fieldUse",
        viewType: "datadictControl",
      });
    },
    handleClose() {
      this.drawerShow = false;
    },
    // 点击搜索
    handleSearch() {
      this.pager.currentPage = 1;
      this.getTableData();
    },
    // 点击重置按钮
    handleReset() {
      this.searchForm = {
        fieldName: "",
        fieldType: "",
        likeFlag: "1",
        fieldFlag: "",
      };
      this.pager.currentPage = 1;
      this.getTableData();
    },
    // 切换每页条数
    paginationChange(val) {
      this.pager.currentPage = 1;
      this.pager.turnPageShowNum = val;
      this.getTableData();
    },
    // 切换页码
    currentChange(val) {
      this.pager.currentPage = val;
      this.getTableData();
    },
    // 获取列表数据
    getTableData(getSelection) {
      this.tableLoading = true;
      this.rpc.datadict
        .dataDictionaryFieldListQuery({
          ...this.searchForm,
          // fieldSource: this.addParams.fieldSource || "",
          queryType: "2", // 1数据字典管控 2数据字段管理 3其他
          currentPage: this.pager.currentPage,
          turnPageShowNum: this.pager.turnPageShowNum,
        })
        .then((res) => {
          this.pager.total = Number(res.turnPageTotalNum || 0);
          this.tableData = res.dictionaryFiledLists || [];
          let selected = getSelection ? this.addParams.selected || [] : [];
          this.echoRowSelection(selected);
        })
        .catch((err) => {})
        .finally(() => {
          this.tableLoading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
@import "@m/assets/css/common.scss";
@import "../../css/page.scss";
@import "../../css/drawer.scss";
.title-text {
  font-size: 16px;
  color: #333333;
  line-height: 16px;
  font-weight: bold;
  font-style: normal;
  padding: 40px 0 24px;
}

// 搜索框行
.comp-lib-search-line {
  display: flex;
  align-items: flex-start;
  padding: 0 0 18px;
  .comp-lib-search-form {
    flex: 1;
    .el-form-item {
      margin-bottom: 0;
    }
    ::v-deep .el-form-item__label {
      line-height: 32px;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .search-side-btns {
    flex: none;
    text-align: right;
    margin-left: 24px;
    .search-side-btn {
      width: 64px;
      height: 32px;
      padding: 0;
    }
  }
}
</style>

<style lang="scss">
@import "@m/assets/css/public.scss";

.el-tabs__nav-wrap::after {
  height: 0;
}
</style>
