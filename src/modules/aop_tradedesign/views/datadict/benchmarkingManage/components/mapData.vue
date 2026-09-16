<!--
 * 数据字典-数据字段管理/数据字典管控-查看字段
 -->
<template>
  <el-drawer
    class="aop-com-drawer"
    :size="800"
    :visible.sync="drawerShow"
    :with-header="false"
  >
    <div class="datadict-drawer-info-content">
      <div class="drawer-main-content aop-com-info-form-wrap">
        <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
          <el-tab-pane label="基本信息" name="first"></el-tab-pane>
          <el-tab-pane label="字段映射" name="second"></el-tab-pane>
        </el-tabs>
        <div class="" v-if="activeName == 'first'">
          <div class="info-main view-mode">
            <div class="table-title">
              <span>{{ detailInfo.fieldName }}</span>
              <span class="topRight">{{ detailInfo.fieldId }}</span>
              <el-tag size="small" type="success" style="margin-left: 20px">{{
                detailInfo.mappingFlag == "1" ? "已映射" : "未映射"
              }}</el-tag>
            </div>
            <dl
              v-for="(item, index) in infoList"
              :key="index"
              class="info-cell"
              :class="{ 'info-block': item.isBlock }"
            >
              <dt>{{ item.title }}：</dt>
              <dd>
                {{ detailInfo[item.contentKey] || "/" }}
              </dd>
            </dl>
          </div>
          <el-descriptions
            title="业务属性"
            :column="2"
            border
            :contentStyle="contentStyle"
            :label-style="labelStyle"
          >
            <el-descriptions-item label="字段名称">{{
              detailInfo.fieldName
            }}</el-descriptions-item>
            <el-descriptions-item label="字段简称">{{
              detailInfo.fieldKeyName
            }}</el-descriptions-item>
            <el-descriptions-item label="字段全称">{{
              detailInfo.fieldFullName
            }}</el-descriptions-item>
            <el-descriptions-item label="别名">
              {{ detailInfo.fieldAlias }}
            </el-descriptions-item>
            <el-descriptions-item label="字段定义">{{
              detailInfo.fieldBusiness
            }}</el-descriptions-item>
            <el-descriptions-item label="字段规则">{{
              detailInfo.fieldRule
            }}</el-descriptions-item>
          </el-descriptions>
          <el-divider></el-divider>
          <el-descriptions
            title="技术属性"
            :column="2"
            border
            :contentStyle="contentStyle"
            :label-style="labelStyle"
          >
            <el-descriptions-item label="字段类型">{{
              detailInfo.fieldType
            }}</el-descriptions-item>
            <el-descriptions-item label="字段主题">{{
              detailInfo.topicName
            }}</el-descriptions-item>
            <el-descriptions-item label="标准分类">{{
              detailInfo.categoryName
            }}</el-descriptions-item>
            <el-descriptions-item label="数据格式">
              {{ mapType[detailInfo.dataFormatType] }}
            </el-descriptions-item>
            <el-descriptions-item label="字段长度">{{
              detailInfo.fieldLength
            }}</el-descriptions-item>
            <el-descriptions-item label="数据精度">{{
              detailInfo.fieldScale
            }}</el-descriptions-item>
            <el-descriptions-item label="最小长度">{{
              detailInfo.fieldLengthMin
            }}</el-descriptions-item>
            <el-descriptions-item label="最大长度">{{
              detailInfo.fieldLengthMax
            }}</el-descriptions-item>
            <el-descriptions-item label="取值范围">
              {{ detailInfo.valueRange }}
            </el-descriptions-item>
            <el-descriptions-item label="主数据系统">{{
              detailInfo.masterDataSystem
            }}</el-descriptions-item>
            <el-descriptions-item label="代码编码规则">{{
              detailInfo.codeRule
            }}</el-descriptions-item>
          </el-descriptions>
          <el-divider></el-divider>
          <div class="table-list-box">
            <div class="table-title">枚举定义</div>
            <div class="aop_common_page_table">
              <el-table :data="detailInfo.dataDictionaryEnumLists">
                <el-table-column prop="enumLabel" label="枚举标签">
                  <template slot-scope="scope">{{
                    scope.row.enumLabel || "/"
                  }}</template>
                </el-table-column>
                <el-table-column
                  prop="enumValue"
                  label="枚举值"
                ></el-table-column>
                <el-table-column prop="enumKey" label="枚举键值">
                  <template slot-scope="scope">{{
                    scope.row.enumKey || "/"
                  }}</template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div v-if="activeName == 'second'">
          <div class="page-flex-mode-header">
            <div class="table-title-two">字段映射</div>
            <el-button
              class="handle-btn"
              @click="handleUpgrade"
              icon="el-icon-plus"
              type="primary"
              size="mini"
              >新增映射</el-button
            >
          </div>
          <el-table
            :data="infoList"
            ref="multipleTableTwo"
            v-loading="tableLoadingTwo"
            @row-dbclick="rowClickTwo"
            @current-change="handleChangeTwo"
          >
            <el-table-column
              show-overflow-tooltip
              prop="fieldName"
              label="字段名称"
            >
              <template slot-scope="scope">
                {{ scope.row.fieldName || "/" }}
              </template>
            </el-table-column>
            <el-table-column prop="fieldKeyName" label="字段简称">
              <template slot-scope="scope">
                {{ scope.row.fieldKeyName || "/" }}
              </template>
            </el-table-column>
            <el-table-column prop="fieldFullName" label="字段全称">
              <template slot-scope="scope">
                {{ scope.row.fieldFullName || "/" }}
              </template>
            </el-table-column>
            <el-table-column prop="recommendLevel" label="合标评估">
              <template slot-scope="scope">
                {{ scope.row.recommendLevel == "1" ? "完全映射" : "一般映射" }}
              </template>
            </el-table-column>
            <el-table-column prop="fieldSource" label="来源系统">
              <template slot-scope="scope">
                {{ scope.row.fieldSource || "/" }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="80px"
              align="left"
              fixed="right"
            >
              <div class="flex_wrap" slot-scope="{ row }">
                <span class="design_btn blue pointer" @click="handleDelete(row)"
                  >解除映射</span
                >
              </div>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <mapping ref="mapping" @reflesh="qryDataDictionaryFieldMappingdList" />
  </el-drawer>
</template>
<script>
import mapping from "./mapping.vue";
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  components: { mapping },
  data() {
    return {
      tableLoadingTwo: false,
      activeName: "first",
      drawerShow: false, // 弹窗是否显示
      drawerData: {},
      contentStyle: {
        "text-align": "left",
        "min-width": "250px",
        "word-break": "break-all",
        color: "#333333",
      },
      labelStyle: {
        "text-align": "left",
        "min-width": "100px",
        "word-break": "keep-all",
        color: "#333333",
      },
      // 展示数据
      infoList: [
        {
          title: "登记人",
          contentKey: "createUserName",
        },
        {
          title: "登记时间",
          contentKey: "createTime",
        },
        {
          title: "最近编辑人",
          contentKey: "updateUserName",
        },
        {
          title: "最近编辑时间",
          contentKey: "updateTime",
        },
      ],
      detailInfo: {},
      mapType: {
        a: "字母",
        n: "数字",
        an: "字母+数字",
        anc: "字母+数字+汉字",
        d: "日期",
        t: "时间",
        dt: "日期时间",
        m: "金额",
        p: "百分比",
      },
    };
  },
  methods: {
    // 打开抽屉
    openDrawer(data = {}) {
      this.drawerData = { ...data };
      this.qryDataDictionaryFieldDetail();
      this.drawerShow = true;
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
        this.qryDataDictionaryFieldMappingdList();
      });
    },

    handleUpgrade() {
      this.$refs.mapping.showDialog(this.drawerData);
    },

    tabsHandleClick() {
      if (this.activeName == "first") {
        this.qryDataDictionaryFieldDetail();
      } else {
        this.qryDataDictionaryFieldMappingdList();
      }
    },

    async qryDataDictionaryFieldDetail() {
      const res = await this.rpc.datadict.qryDataDictionaryFieldDetail({
        fieldId: this.drawerData.fieldId,
      });
      this.detailInfo = res;
    },

    qryDataDictionaryFieldMappingdList() {
      this.tableLoadingTwo = true;
      this.rpc.datadict
        .qryDataDictionaryFieldMappingdList({
          fieldId: this.drawerData.fieldId,
          finaBrhNo: this.$route.query.finaBrhNo,
        })
        .then((res) => {
          this.infoList = res.fieldRecommendList || [];
        })
        .catch((err) => {})
        .finally(() => {
          this.tableLoadingTwo = false;
        });
    },

    handleClose() {
      this.drawerShow = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
@import "@m/assets/css/common.scss";

.topRight {
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 20px;
  font-weight: 400;
  background: #f5f5f5;
  border: 0.5px solid rgba(217, 217, 217, 1);
  border-radius: 2px;
  padding: 2px 4px;
  text-align: center;
  margin-left: 20px;
}
.page-flex-mode-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

// 表格
.aop_common_page_table {
  ::v-deep .status {
    display: inline-block;
    text-align: center;
    height: 24px;
    line-height: 24px;
    padding: 0 6px;
    border-radius: 2px;
    // 绿色标签
    &.tag-green {
      background: #e5ffe7;
      color: #36d542;
    }
    // 橙色标签
    &.tag-orange {
      background: #fff4e5;
      color: #ff9104;
    }
    //蓝色标签
    &.tag-blue {
      background: #f2f8ff;
      color: $theme_color;
    }
  }
  // min-height: 390px;
  ::v-deep .el-table tr {
    background: #fff;
    color: $reg_ft_color;
    padding: 12px 0;
    .cell {
      padding: 0 0 0 24px;
      line-height: 24px;
      div {
        display: inline-block;
      }
    }
    & td:last-child {
      .cell {
        padding-right: 10px;
      }
    }
  }
  ::v-deep .el-table th {
    background: $table_bg_color;
    color: $reg_ft_color;
    padding: 12px 0;
    font-family: $font_medium;
    &:last-child {
      .cell {
        padding-right: 24px;
      }
    }
  }
  ::v-deep .el-table {
    table {
      width: 100% !important;
    }
    .el-table__empty-block {
      width: 100% !important;
    }
    .is-scrolling-none + .el-table__fixed-right::before {
      display: none;
    }
  }

  .table_button {
    display: inline-block;
    cursor: pointer;
    color: $theme_color;
    margin-right: 16px;
  }
  .icon {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    display: inline-block;
    font-size: 30px;
    line-height: 20px;
    color: $reg_ft_color;
  }
  .text_style {
    color: $theme_color;
    font-family: $font_regular;
    font-size: 14px;
    cursor: pointer;
  }

  .table_text {
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  // 隐藏全选框
  .hide_checkbox ::v-deep thead th .el-checkbox {
    visibility: hidden;
  }
  .table_btn_box .table_border {
    display: inline-block;
    cursor: pointer;
    color: $theme_color;
  }
  .btn_delete {
    color: #fe4758;
  }
  .table_btn_box {
    .table_border {
      &::after {
        content: "|";
        margin: 0 8px;
        color: $pri_br_color;
      }
      &:last-child {
        &::after {
          content: "";
        }
      }
    }
  }
}

/**分页器公共样式*/
.workspace_common_pagination {
  display: flex;
  justify-content: center;

  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #3671ff;
  }
}
// 数据管理-抽屉
.datadict-drawer-info-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  .drawer-main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 8px 24px;
  }
  .info-main {
    padding-top: 8px;
    overflow: hidden;
    flex: none;
    .info-cell {
      padding-bottom: 8px;
      display: flex;
      width: 50%;
      float: left;
      &.info-block {
        width: 100%;
      }
      dt {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #999999;
        line-height: 22px;
        font-weight: 400;
      }
      dd {
        flex: 1;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        line-height: 22px;
        font-weight: 400;
      }
      &.info-half {
        float: left;
        width: 50%;
      }
    }
    &.view-mode {
      .info-cell {
        padding-bottom: 24px;
      }
    }
  }

  .info-bottom-handle {
    height: 72px;
    box-shadow: inset 0px 1px 0px 0px rgba(245, 245, 250, 1);
    @extend .flex-center;
    ::v-deep .el-button {
      width: 112px;
      height: 40px;
      border-radius: 2px;
    }
  }
}
/deep/.el-table {
  .el-table__body tr {
    cursor: pointer;
  }

  th {
    color: rgb(51, 51, 51);
    background: #f5f5f8;
    font-size: 14px;
    padding: 8px 0;
  }

  th .cell {
    padding-left: 24px;
    line-height: 23px;
  }

  td {
    height: 48px;
    padding: 12px 0;
    font-size: 14px;
    color: #666666;
    position: relative;
  }

  td .cell {
    padding-left: 24px;
    line-height: 23px;
  }
}
.table-title {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  line-height: 16px;
  padding-bottom: 16px;
}
.table-title-two {
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  line-height: 14px;
}
</style>
