<template>
  <div class="aop_businessd2_comps_decision_list">
    <el-drawer
      :visible.sync="dialogVisible"
      :size="900"
      @closeDialog="handleClose"
      :with-header="false"
      :append-to-body="true"
      class="dialog"
    >
      <div class="content-wrapper">
        <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
          <el-tab-pane label="系统推荐" name="first"></el-tab-pane>
          <el-tab-pane label="选择现有数据字典" name="second"></el-tab-pane>
          <el-tab-pane label="新增字段要求" name="third"></el-tab-pane>
        </el-tabs>
        <div class="" v-if="activeName == 'first'">
          <div class="D2_workspace_common_table">
            <div class="table-header">
              <div class="recommend-wrapper">
                <span class="recommend-title" style="margin-right: 16px"
                  >根据您当前输入的信息，为您推荐以下字段:</span
                >
              </div>
            </div>
            <el-table
              :data="recomondList"
              ref="multipleTable"
              v-loading="tableLoading"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                fixed
                width="52"
                align="center"
              ></el-table-column>
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
              <el-table-column prop="fieldBusiness" label="字段定义">
                <template slot-scope="scope">
                  {{ scope.row.fieldBusiness || "/" }}
                </template>
              </el-table-column>
              <el-table-column prop="fieldType" label="字段类型">
                <template slot-scope="scope">
                  {{ scope.row.fieldType || "/" }}
                </template>
              </el-table-column>
              <el-table-column prop="fieldSource" label="数据来源">
                <template slot-scope="scope">
                  {{ scope.row.fieldSource || "/" }}
                </template>
              </el-table-column>
              <el-table-column prop="recommendLevel" label="合标评估">
                <template slot-scope="scope">
                  {{
                    scope.row.recommendLevel == "1" ? "完全映射" : "一般映射"
                  }}
                </template>
              </el-table-column>
            </el-table>
            <PagePagination
              @size-change="handleSizeChangeTwo"
              @current-change="handleCurrentChangeTwo"
              :pager="pagerTwo"
            >
            </PagePagination>
          </div>
        </div>
        <div class="" v-if="activeName == 'second'">
          <ServiceTop ref="formRef" :serviceForm="serviceForm" :form="form">
            <div class="switch-style">
              <span>精准查询：</span><el-switch v-model="value1"> </el-switch>
            </div>
            <el-select
              v-model="fieldType"
              placeholder="请选择字段类型"
              clearable
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in fieldTypeOption"
                :key="item.label"
              ></el-option>
            </el-select>
            <div slot="rightButton">
              <el-button
                type="primary"
                size="small"
                @click="search"
                class="right_button"
                >查询</el-button
              >
              <el-button size="small" @click="reset" class="right_button"
                >重置</el-button
              >
            </div>
          </ServiceTop>

          <div class="D2_workspace_common_table">
            <el-table
              :data="infoList"
              ref="multipleTableTwo"
              v-loading="tableLoadingTwo"
              @selection-change="handleSelectionChangeTwo"
            >
              <el-table-column
                type="selection"
                fixed
                width="52"
                align="center"
              ></el-table-column>
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
              <el-table-column prop="fieldBusiness" label="字段定义">
                <template slot-scope="scope">
                  {{ scope.row.fieldBusiness || "/" }}
                </template>
              </el-table-column>
              <el-table-column prop="fieldType" label="字段类型">
                <template slot-scope="scope">
                  {{ scope.row.fieldType || "/" }}
                </template>
              </el-table-column>
            </el-table>
            <PagePagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :pager="pager"
            >
            </PagePagination>
          </div>
        </div>
        <div class="" v-if="activeName == 'third'">
          <handleField
            ref="handleField"
            currentType="benchMaking"
            @refreshData="$emit('reflesh')"
            @close="handleClose"
          />
        </div>
      </div>
      <div class="info-bottom-handle" v-if="activeName != 'third'">
        <el-button type="default" plain size="medium" @click="handleClose">
          取消
        </el-button>
        <el-button
          class="ml24"
          type="primary"
          size="medium"
          @click="handleConfirm"
        >
          确定
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>
  
  <script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "./dialog";
import handleField from "./addField.vue";
export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    handleField,
  },
  props: {},
  data() {
    return {
      fieldTypeOption: [
        {
          label: "String",
          value: "String",
        },
        {
          label: "Short",
          value: "Short",
        },
        {
          label: "Integer",
          value: "Integer",
        },
        {
          label: "Long",
          value: "Long",
        },
        {
          label: "Float",
          value: "Float",
        },
        {
          label: "Double",
          value: "Double",
        },
        {
          label: "BigDecimal",
          value: "BigDecimal",
        },
        {
          label: "Byte",
          value: "Byte",
        },
        {
          label: "Character",
          value: "Character",
        },
        {
          label: "File",
          value: "File",
        },
        {
          label: "Date",
          value: "Date",
        },

        {
          label: "LocalDate",
          value: "LocalDate",
        },
        {
          label: "LocalTime",
          value: "LocalTime",
        },
        {
          label: "LocalDateTime",
          value: "LocalDateTime",
        },
      ],
      fieldInfo: {},
      activeName: "first",
      dialogVisible: false,
      tableLoading: false,
      tableLoadingTwo: false,
      recomondList: [],
      value1: "0",
      fieldType: "",
      serviceForm: [
        {
          type: "input",
          model: "enumCodeOrNm",
          placeholder: "请输入字段名称、英文名或描述",
          style: { width: "280px" },
        },
      ],
      form: {
        enumCodeOrNm: "",
      },
      infoList: [],
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      pagerTwo: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      firstSelectList: [],
      secondSelectList: [],
    };
  },

  methods: {
    async showDialog(params) {
      this.fieldInfo = params;
      this.dialogVisible = true;
      this.getTableData();
    },
    handleSelectionChange(row) {
      this.firstSelectList = row;
    },
    handleSelectionChangeTwo(row) {
      this.secondSelectList = row;
    },

    handleClose() {
      this.dialogVisible = false;
      this.activeName = "first";
    },

    tabsHandleClick() {
      if (this.activeName == "first") {
        this.getTableData();
      } else if (this.activeName == "second") {
        this.qryDataDictionaryFieldMappingdList();
      }
    },

    // 点击搜索按钮
    search() {
      this.pager.currentPage = "1";
      this.qryDataDictionaryFieldMappingdList();
    },

    // 点击重置按钮
    reset() {
      this.pager.currentPage = "1";
      this.form = {
        functionIdOrNm: "", //功能名称/ID
      };
      this.$refs.formRef.resetFields();
      this.qryDataDictionaryFieldMappingdList();
    },

    qryDataDictionaryFieldMappingdList() {
      this.tableLoadingTwo = true;
      this.rpc.controlWorkbench
        .dataDictionaryFieldListQuery({
          queryType: "4", // 1数据字典管控 2数据字段管理 3其他
          likeFlag: this.value1 == "0" ? "1" : "0", // 模糊查询
          fieldType: this.fieldType,
          fieldName: this.form.enumCodeOrNm,
          currentPage: this.pager.currentPage,
          turnPageShowNum: this.pager.turnPageShowNum,
          fieldFlag: "2",
        })
        .then((res) => {
          this.infoList = res.dictionaryFiledLists || [];
          this.pager.total = Number(res.turnPageTotalNum || 0);
        })
        .catch((err) => {})
        .finally(() => {
          this.tableLoadingTwo = false;
        });
    },

    // 获取字典列表数据
    getTableData() {
      this.tableLoading = true;
      this.rpc.controlWorkbench
        .dataDictionaryFieldListQuery({
          fieldName: this.fieldInfo.fieldName,
          currentPage: this.pagerTwo.currentPage,
          turnPageShowNum: this.pagerTwo.turnPageShowNum,
          queryType: "2", // 1数据字典管控 2数据字段管理 3其他
          likeFlag: "1", // 模糊查询
          fieldFlag: "2",
        })
        .then((res) => {
          this.recomondList = res.dictionaryFiledLists || [];
          this.pagerTwo.total = Number(res.turnPageTotalNum || 0);
        })
        .catch((err) => {})
        .finally(() => {
          this.tableLoading = false;
        });
    },

    // 数据字典选择每页条数改变时
    handleSizeChangeTwo(e) {
      this.pagerTwo.turnPageShowNum = e;
      this.getTableData();
    },
    // 数据字典选择当前页改变时
    handleCurrentChangeTwo(e) {
      this.pagerTwo.currentPage = e;
      this.getTableData();
    },

    // 数据字典选择每页条数改变时
    handleSizeChange(e) {
      this.pager.turnPageShowNum = e;
      this.qryDataDictionaryFieldMappingdList();
    },
    // 数据字典选择当前页改变时
    handleCurrentChange(e) {
      this.pager.currentPage = e;
      this.qryDataDictionaryFieldMappingdList();
    },

    handleConfirm() {
      let tempArr =
        this.activeName == "first"
          ? this.firstSelectList
          : this.secondSelectList;
      this.$emit("confirm", tempArr);
      this.handleClose();
    },
  },
};
</script>
  
  <style lang="scss" scoped>
@import "./css/mixin.scss";
@import "./css/common.scss";
.aop_businessd2_comps_decision_list {
  ::v-deep .el-form-item__label {
    width: 86px !important;
  }
}
.content-wrapper {
  padding: 8px 24px;
  margin-bottom: 72px;
}

.info-bottom-handle {
  position: fixed;
  bottom: 0;
  width: stretch;
  background: #ffffff;
  flex: none;
  height: 72px;
  box-shadow: inset 0px 1px 0px 0px rgba(245, 245, 250, 1);
  @extend .flex-center;
  ::v-deep .el-button {
    width: 112px;
    height: 40px;
    border-radius: 2px;
  }
}

.switch-style {
  color: #333333;
  display: flex;
  align-items: center;
}

::v-deep .el-radio__label {
  display: none;
}
.table-header {
  padding: 16px 0;
}
.recommend-wrapper {
  font-size: 12px;
  color: #999999;
  .recommend-title {
    font-size: 14px;
    color: rgb(51, 51, 51);
  }
  .recommend-content.show {
    color: #ff9d00;
  }
}
.current-font {
  font-weight: bolder;
  font-size: 14px;
  color: rgb(51, 51, 51);
  &.marginleft {
    margin-left: 60px;
  }
  .font-content {
    font-size: 14px;
    font-weight: normal;
  }
}

.dialog {
  ::v-deep .el-dialog__header {
    display: none;
  }

  .content {
    padding: 8px 24px 24px;
  }
  ::v-deep.el-dialog {
    margin-top: 3vh !important;
  }
  ::v-deep.el-dialog__body {
    max-height: 78vh;
  }

  .table_operate {
    margin-top: -24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    h1 {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #111111;
      font-weight: 500;
      span {
        margin-left: 7px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #b8b8b8;
        line-height: 16px;
        font-weight: 400;
      }
    }
  }

  ::v-deep .el-dialog .el-dialog__body {
    padding: 0px !important;
  }

  ::v-deep .el-form-item__label {
    width: 106px !important;
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
.link {
  color: #358aff;
  cursor: pointer;
}
::v-deep .el-tabs__item:focus.is-active.is-focus:not(:active) {
  box-shadow: none !important;
}
</style>
  