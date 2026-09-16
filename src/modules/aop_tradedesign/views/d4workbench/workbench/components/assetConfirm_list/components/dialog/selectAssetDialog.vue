<template>
  <div class="aop_tradedesign_comps_workbench_public_dialog_addParams">
    <PageDialog
      dialogTitle="资产列表"
      :dialogVisiable="dialogVisible"
      dialogWidth="90%"
      @closeDialog="closeDialog"
      class="dialog"
      :apTobody="true"
    >
      <div slot="box">
        <div class="add_dialog_conf">
          <div class="check_content">
            <div class="middle">
              <div class="right_table">
                <ServiceTop
                  ref="formRef"
                  :serviceForm="serviceForm"
                  :form="formInline"
                  class="search_conf"
                >
                  <div slot="rightButton">
                    <el-button
                      type="primary"
                      size="small"
                      @click="goSearch"
                      class="right_button"
                      >搜索</el-button
                    >
                    <el-button
                      size="small"
                      @click="resetFields"
                      class="right_button"
                      >重置</el-button
                    >
                  </div>
                </ServiceTop>
                <div class="content">
                  <div class="table">
                    <Table
                      class="table_style"
                      :data="dataList"
                      :table="tableColumn"
                      ref="dictListTableRef"
                      :rowK="'serialNumber'"
                      :treeProps="{ children: 'children' }"
                      :tableType="'selection'"
                      :cellStyle="dictListCellStyle"
                      @selectionChange="handleSelectionChange"
                    ></Table>
                    <!-- 分页器 -->
                    <PagePagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :pager="Pager"
                    >
                    </PagePagination>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click.native="saveParams">确定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import PageDialog from "@m/core/components/page_dialog";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import { unduplicated, setSerialNumber } from "@m/utils/array";
import Table from "@m/core/components/page_table";
export default {
  mixins: [mixin],
  components: {
    PageDialog,
    ServiceTop,
    Table,
  },
  props: {
    // 数据集信息
    dataObj: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      dialogVisible: false,
      formInline: {
        content: "",
      },
      serviceForm: [
        {
          type: "input",
          labelText: "资产名称:",
          model: "content",
          placeholder: "请输入资产名称",
          style: {
            width: "260px",
          },
        },
      ],
      Pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      dataList: [
        {dictNo:"第1资产"},
        {dictNo:"第2资产"},
        {dictNo:"第3资产"},
        {dictNo:"第4资产"},
        {dictNo:"第5资产"},
        {dictNo:"第6资产"},

      ],
      tableColumn: [
        {
          prop: "dictNo",
          label: "资产名称",
          width: "250",
          type: "text",
        },
      ],
      selectionData: [],
      tableData: [],
      isRecord:true
    };
  },
  methods: {
    //获取数据
    getAssetList(){},
    showDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    //多选显示
    dictListCellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.dictryPid == "" && column.type === "selection") {
        return { visibility: "hidden" };
      }
    },
    delParamsTag(e) {
      console.log(e,"eeee")
      const index = this.dictList.findIndex((item) => item.dictId == e.dictId);
      if (index == -1) {
        this.tableData = this.tableData.filter((it) => it.dictId != e.dictId);
      } else {
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          this.dictList[index],
          false
        );
      }
    },
    resetSearch() {
      this.resetFields();
      this.getAssetList();
    },
    saveParams() {
      this.closeDialog();
      this.$emit("saveParams", this.selectionData);
    },
    // 多选框选中
    handleSelectionChange(e) {
      // console.log(e, "handleSelectionChange");
      // if (!this.isRecord && this.selectionData.length > e.length) {
      //   this.selectionData.forEach((item) => {
      //     if (e.indexOf(item) == -1) {
      //       this.tableData = this.tableData.filter(
      //         (it) => it.dictId != item.dictId
      //       );
      //     }
      //   });
      //   console.log("1")
      // } else {
      //   console.log("2")
      //   this.tableData.push(...e);
      //   this.tableData = unduplicated(this.tableData, "dictId");
      // }
      this.selectionData = e;
      console.log(this.selectionData,"handleSelectionChange")
      // this.isRecord = false;
    },
    goSearch() {
      this.getAssetList()
    },
    resetFields() {
      this.pager.currentPage = "1";
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields();
      }
    },
    // 每页条数改变时
    handleSizeChange(turnPageShowNum) {
      this.pager.turnPageShowNum = turnPageShowNum + "";
      this.getAssetList();
    },
    // 当前页改变时
    handleCurrentChange() {
      this.getAssetList();
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_workbench_public_dialog_addParams {
  .add_dialog_conf {
    padding: 15px 12px;
    .search_conf {
      padding: 0;
      margin: 0;
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
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
    .check_content {
      display: flex;
      .left {
        width: 15%;
        max-height: 420px;
        overflow: auto;
        border: 2px solid #dcdfe6;
        // flex: 1;
      }
      .middle {
        width: 55%;
        max-height: 420px;
        margin-left: 10px;
        overflow: auto;
      }
      .right {
        width: 30%;
        max-height: 420px;
        overflow: auto;
        border: 2px solid #dcdfe6;
        margin-left: 20px;

        .ser {
          .list_item {
            // border: 2px solid #dfdfdf;
            // width: 380px;
            // width: 24%;
            // height: 450px;
            // max-height: 450px;
            overflow: auto;
            border-radius: 5px;
            .list_title {
              display: flex;
              justify-content: space-between;
              padding: 0 10px;
              line-height: 47px;
              font-family: $font_medium;
              font-size: 16px;
              color: $pri_ft_color;
              letter-spacing: 0;
              font-weight: $font_weight_600;
            }
          }
          .item_active {
            background: #f0f5ff;
            color: #358aff;
          }
          .table {
            padding: 10px;
            // display: flex;
            .table_item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              cursor: pointer;
              //   height: 40px;
              //   line-height: 40px;
              padding: 10px 10px;
              margin-top: 10px;
              border-radius: 5px;
              .left_content {
                display: flex;
                flex: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                .left_title {
                  //   margin-left: 5px;
                  margin: 0 5px;
                  //   width: 100%;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  font-size: 13px;
                }
                .left_status {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 12px;

                  // text-align: center;
                }
                // .statusRed{
                //     background:#fef1f1;
                //     color: #7bca55;
                // }
                // .statusGreen{
                //     background: #e7f4ec;
                //     color:#f78585;
                // }
              }
              .right_content {
                margin-left: 5px;
                display: flex;
                .right_title {
                  margin-left: 5px;
                }
              }
            }
          }
        }
      }
    }
    .siderbar_menu {
      /deep/ .el-tree-node {
        padding: 4px 0;
        &:focus {
          > .el-tree-node__content {
            background-color: #f0fbff;
          }
        }
      }
      /deep/ .el-tree-node.is-current {
        > .el-tree-node__content {
          background-color: #f0fbff;
        }
      }
      /deep/ .el-tree-node__content {
        height: 27px;
        position: relative;
        padding-left: 0px !important;
        &:focus {
          background-color: #f0fbff;
        }
        &:active {
          background-color: #f0fbff;
        }
        &:visited {
          background-color: #f0fbff;
        }
        &:hover {
          background-color: #f0fbff;
        }
      }
      /deep/ .el-tag {
        height: 17px;
        line-height: 17px;
      }
      .custom-tree-node {
        display: flex;
        justify-content: space-between;
        width: 220px;
      }
      .tree_label {
        // display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        // width: 80%;
        margin-left: 3px;
        &.active {
          background: #eaf1ff;
          color: $theme_color;
          font-weight: 600;
        }
        // flex: 1;
      }
      .left {
        display: flex;
        flex: 1;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      /deep/.el-tag {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
      }
    }
  }
}
.dialog {
  .add_dialog_conf {
    padding: 15px 12px;
    .search_conf {
      padding: 0;
      margin: 0;
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
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
    .check_content {
      display: flex;
      overflow: auto;
      .left {
        width: 25%;
        max-height: 420px;
        overflow: auto;
        border: 2px solid #dcdfe6;
      }
      .middle {
        // width: 55%;
        max-height: 420px;
        margin-left: 10px;
        overflow: auto;
        flex: 1;
      }
      .title {
        font-weight: 600;
        font-family: PingFangSC-Semibold;
        margin-bottom: 10px;
      }
      .right {
        // width: 30%;
        max-height: 420px;
        overflow: auto;
        border: 2px solid #dcdfe6;
        margin-left: 20px;
        .ser {
          .list_item {
            // border: 2px solid #dfdfdf;
            // width: 380px;
            // width: 24%;
            // height: 450px;
            // max-height: 450px;
            overflow: auto;
            border-radius: 5px;
            .list_title {
              display: flex;
              justify-content: space-between;
              padding: 0 10px;
              line-height: 47px;
              font-family: $font_medium;
              font-size: 16px;
              color: $pri_ft_color;
              letter-spacing: 0;
              font-weight: $font_weight_600;
            }
          }
          .item_active {
            background: #f0f5ff;
            color: #358aff;
          }
          .table {
            padding: 10px;
            // display: flex;
            .table_item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              cursor: pointer;
              //   height: 40px;
              //   line-height: 40px;
              padding: 10px 10px;
              margin-top: 10px;
              border-radius: 5px;
              .left_content {
                display: flex;
                flex: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                .left_title {
                  //   margin-left: 5px;
                  margin: 0 5px;
                  //   width: 100%;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  font-size: 13px;
                }
                .left_status {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 12px;

                  // text-align: center;
                }
                // .statusRed{
                //     background:#fef1f1;
                //     color: #7bca55;
                // }
                // .statusGreen{
                //     background: #e7f4ec;
                //     color:#f78585;
                // }
              }
              .right_content {
                margin-left: 5px;
                display: flex;
                .right_title {
                  margin-left: 5px;
                }
              }
            }
          }
        }
      }
    }
    .siderbar_menu {
      /deep/ .el-tree-node {
        padding: 4px 0;
        &:focus {
          > .el-tree-node__content {
            background-color: #f0fbff;
          }
        }
      }
      /deep/ .el-tree-node.is-current {
        > .el-tree-node__content {
          background-color: #f0fbff;
        }
      }
      /deep/ .el-tree-node__content {
        height: 27px;
        position: relative;
        padding-left: 0px !important;
        &:focus {
          background-color: #f0fbff;
        }
        &:active {
          background-color: #f0fbff;
        }
        &:visited {
          background-color: #f0fbff;
        }
        &:hover {
          background-color: #f0fbff;
        }
      }
      /deep/ .el-tag {
        height: 17px;
        line-height: 17px;
      }
      .custom-tree-node {
        display: flex;
        justify-content: space-between;
        width: 220px;
      }
      .tree_label {
        // display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        // width: 80%;
        margin-left: 3px;
        &.active {
          background: #eaf1ff;
          color: $theme_color;
          font-weight: 600;
        }
        // flex: 1;
      }
      .left {
        display: flex;
        flex: 1;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      /deep/.el-tag {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
      }
    }
  }
}
</style>