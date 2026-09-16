<!-- 业务专题-关联规则-关联功能选择 -->
<template>
  <div class="aop_businessd2_comps_decision_list">
    <PageDialog
      :dialogVisiable="dialogVisible"
      dialogWidth="1000px"
      @closeDialog="closeDialog"
      class="dialog"
      :apTobody="true"
    >
      <div slot="box" class="content">
        <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
          <el-tab-pane label="推荐字段" name="first"></el-tab-pane>
          <el-tab-pane label="选择字段" name="second"></el-tab-pane>
        </el-tabs>
        <div class="" v-if="activeName == 'first'">
          <div class="D2_workspace_common_table">
            <div class="table-header">
              <span class="current-font">
                当前字段名称：<span class="font-content">{{
                  fieldInfo.fieldName
                }}</span>
              </span>
              <span class="current-font marginleft">
                当前字段简称：<span class="font-content">{{
                  fieldInfo.fieldKeyName
                }}</span></span
              >
              <div class="recommend-wrapper">
                <span class="recommend-title" style="margin-right: 16px"
                  >推荐字段</span
                >
                <span
                  class="recommend-content"
                  :class="{ show: !recomondList.length }"
                >
                  {{
                    !recomondList.length
                      ? "根据字段简称匹配，当前暫无匹配数据，可自定义选择字段"
                      : "根据字段简称匹配，以下是匹配结果，请选择要映射的字段"
                  }}
                </span>
              </div>
            </div>
            <el-table
              :data="recomondList"
              ref="multipleTable"
              v-loading="tableLoading"
              @row-dbclick="rowClick"
              @current-change="handleChange"
            >
              <el-table-column width="55" align="center">
                <template slot-scope="scope">
                  <el-radio
                    v-model="currentRadio"
                    :label="scope.row.fieldId"
                  ></el-radio>
                </template>
              </el-table-column>
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
              @row-dbclick="rowClickTwo"
              @current-change="handleChangeTwo"
            >
              <el-table-column width="55" align="center">
                <template slot-scope="scope">
                  <el-radio
                    v-model="currentRadioTwo"
                    :label="scope.row.fieldId"
                  ></el-radio>
                </template>
              </el-table-column>
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
      </div>
      <template slot="footer">
        <div>
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
      </template>
    </PageDialog>
  </div>
</template>
  
  <script>
import mixin from "@m/core/mixin";
import { fieldTypeOption } from "@m/utils/commonData";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "./dialog";
export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
  },
  props: {},
  data() {
    return {
      fieldInfo: {},
      activeName: "first",
      dialogVisible: false,
      tableLoading: false,
      tableLoadingTwo: false,
      recomondList: [],
      value1: "0",
      fieldType: "",
      fieldTypeOption: [],
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
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      infoList: [],
      currentRadio: null,
      currentRadioTwo: null,
    };
  },

  methods: {
    async showDialog(params) {
      this.fieldInfo = params;
      this.fieldTypeOption = fieldTypeOption;
      this.dialogVisible = true;
      this.getTableData();
    },

    tabsHandleClick() {
      if (this.activeName == "first") {
        this.getTableData();
      } else {
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
      this.rpc.datadict
        .dataDictionaryFieldListQuery({
          queryType: "2", // 1数据字典管控 2数据字段管理 3其他
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
      this.rpc.datadict
        .qryDataDictionaryFieldRecommendList({
          fieldKeyName: this.fieldInfo.fieldKeyName,
        })
        .then((res) => {
          this.recomondList = res.fieldRecommendList || [];
        })
        .catch((err) => {})
        .finally(() => {
          this.tableLoading = false;
        });
    },

    // 数据字典选择每页条数改变时
    handleSizeChange(e) {
      this.pager.turnPageShowNum = e;
      this.qryDataDictionaryFieldMappingdList();
    },
    // 数据字典选择当前页改变时
    handleCurrentChange(e) {
      this.qryDataDictionaryFieldMappingdList();
    },
    closeDialog() {
      this.dialogVisible = false;
    },

    async confirm() {
      this.closeDialog();
      await this.rpc.datadict.addDataDictionaryFieldMapping({
        fieldId: this.fieldInfo.fieldId,
        finaBrhNo: this.$route.query.finaBrhNo,
        mappingFieldId:
          this.activeName == "first" ? this.currentRadio : this.currentRadioTwo,
      });
      this.$emit("reflesh");
      this.$message({
        type: "success",
        message: "添加映射成功",
      });
    },

    rowClick(row, column, event) {
      if (this.currentRadio && row.fieldId == this.currentRadio.fieldId) {
        this.setCurrent(row);
        this.currentRadio = null;
      } else {
        this.currentRadio = row;
      }
    },

    handleChange(row) {
      this.currentRadio = row;
    },

    setCurrent(row) {
      this.$refs.multipleTable.setCurrentRow(row);
    },

    rowClickTwo(row, column, event) {
      if (this.currentRadioTwo && row.fieldId == this.currentRadioTwo.fieldId) {
        this.setCurrentTwo(row);
        this.currentRadioTwo = null;
      } else {
        this.currentRadioTwo = row;
      }
    },

    handleChangeTwo(row) {
      this.currentRadioTwo = row;
    },

    setCurrentTwo(row) {
      this.$refs.multipleTableTwo.setCurrentRow(row);
    },
  },
};
</script>
  
  <style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_businessd2_comps_decision_list {
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
    }
  }

  ::v-deep .el-form-item__label {
    width: 86px !important;
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
  margin: 16px 0 0 0;
  font-size: 12px;
  color: #999999;
  .recommend-title {
    font-weight: bolder;
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
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
      span {
        color: #358aff;
      }
    }
    .show_conf_content {
      float: left;
    }
    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
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
  ::v-deep .show_conf {
    padding: 15px 0px;
    overflow: hidden;
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: 16px;
    // box-shadow: inset 0 1px 0 0 #F5F5FA;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
      span {
        color: #358aff;
      }
    }
    .show_conf_content {
      float: left;
    }
    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
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
.link {
  color: #358aff;
  cursor: pointer;
}
</style>
  