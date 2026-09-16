<template>
  <div class="aop_businessd2_comps_decision_list">
    <PageDialog
      :dialogVisiable="dialogVisible"
      dialogWidth="800px"
      @closeDialog="closeDialog"
      dialogTitle="标化检测"
      class="dialog"
      :apTobody="true"
      :footerShow="false"
    >
      <div slot="box" class="content">
        <div class="D2_workspace_common_table">
          <div class="table-header">
            <span class="current-font">
              <img
                width="16px"
                height="16px"
                class="font-img"
                :src="require('@m/assets/images/icon_waring.png')"
                alt=""
              /><span
                >当前还有{{ recomondList.length || "0" }}个参数未标化：</span
              >
            </span>
          </div>
          <el-table
            :data="recomondList"
            ref="multipleTable"
            v-loading="tableLoading"
          >
            <el-table-column
              show-overflow-tooltip
              prop="fieldId"
              label="参数Key"
            >
              <template slot-scope="scope">
                {{ scope.row.fieldId || "/" }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="paramName"
              label="参数中文名称"
            >
              <template slot-scope="scope">
                {{ scope.row.paramName || "/" }}
              </template>
            </el-table-column>
            <el-table-column prop="fieldKeyName" label="标准字段名称">
              <span class="no-standardtest">暂未标化</span>
            </el-table-column>
            <el-table-column prop="paramDirection" label="输入/输出">
              <template slot-scope="scope">
                {{ scope.row.paramDirection == "0" ? "输入参数" : "输出参数" }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="60px"
              align="left"
              fixed="right"
            >
              <div class="flex_wrap" slot-scope="{ row }">
                <span
                  class="design_btn blue pointer"
                  style="color: #358aff"
                  @click="outputTargetOperate(row)"
                  >标准化</span
                >
              </div>
            </el-table-column>
          </el-table>
        </div>
        <compStandard ref="compStandard" @reflesh="getTableData" />
      </div>
    </PageDialog>
  </div>
</template>
  
  <script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "./page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import compStandard from "../compStandard";
export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    compStandard,
  },
  props: {},
  data() {
    return {
      fieldInfo: {},
      dialogVisible: false,
      tableLoading: false,
      recomondList: [],
      apiMap: {
        0: "s4ParamStandardDetection",
        1: "s5ParamStandardDetection",
      },
    };
  },

  methods: {
    outputTargetOperate(data) {
      this.$refs.compStandard.showDialog(data);
    },
    async showDialog(params) {
      // this.fieldInfo = params;
      this.dialogVisible = true;
      this.mappingType = this.$route.query?.mappingType;
      this.getTableData();
    },

    // 获取字典列表数据
    getTableData() {
      this.tableLoading = true;
      this.rpc.d4[this.apiMap[this.mappingType]]({
        svcId: this.$route.query.apiId,
        fnctId: "",
        dsgnFlg: "1",
      })
        .then((res) => {
          this.recomondList = res.paramList || [];
        })
        .catch((err) => {})
        .finally(() => {
          this.tableLoading = false;
        });
    },

    closeDialog() {
      this.dialogVisible = false;
    },
  },
};
</script>
  
  <style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.table-header {
  padding: 16px 0;
  .current-font {
    display: flex;
    align-items: center;
    font-weight: bolder;
    font-size: 14px;
    color: rgb(51, 51, 51);
    .font-img {
      margin-right: 4px;
    }
  }
}
.no-standardtest {
  color: #fe4758;
}
.dialog {
  .content {
    padding: 8px 24px 24px;
  }
  ::v-deep.el-dialog {
    margin-top: 3vh !important;
  }
  ::v-deep.el-dialog__body {
    max-height: 78vh;
  }
  ::v-deep .el-dialog .el-dialog__body {
    padding: 0px !important;
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
</style>
  