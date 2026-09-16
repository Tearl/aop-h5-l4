<template>
  <div class="aop_tradedesign_comps_workbench_public_dialog_addParams">
    <!-- 从数据集中选择 -->
    <PageDialog
      dialogTitle="请选择参数"
      :dialogVisiable="dialogVisible"
      dialogWidth="1000px"
      @closeDialog="closeDialog"
      class="dialog"
      :apTobody="true"
    >
      <div slot="box">
        <div class="add_dialog_conf">
          <div class="check_content">
            <div class="left">
              <div class="left_tree">
                <div class="tree_title">数据集列表</div>
                <div>
                  <el-tree
                    :data="menuDatasetList"
                    class="siderbar_menu"
                    :class="
                      currentNodeKey === ''
                        ? 'menu_current_none'
                        : 'menu_is_current'
                    "
                    ref="menuDatasetRef"
                    :props="defaultProps"
                    node-key="dataSubstnNo"
                    :expand-on-click-node="false"
                    default-expand-all
                    @node-click="handleNodeClick"
                    @node-expand="nodeExpand"
                    :current-node-key="currentNodeKey"
                  >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span
                        class="tree_label"
                        :title="node.label"
                        :class="{
                          active:
                            currentDatasetObj.dataSubstnNo == data.dataSubstnNo,
                        }"
                        >{{ `${node.label}` }}</span
                      >
                      <div
                        v-if="node.level == '1'"
                        class="disabled"
                        @click.stop
                      ></div>
                    </span>
                  </el-tree>
                </div>
              </div>
            </div>
            <div class="middle">
              <div class="right_table">
                <ServiceTop
                  ref="formRef"
                  :serviceForm="serviceForm"
                  :form="formInline"
                  class="search_conf"
                  @enterIconSearch="goSearch"
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
                      @click="resetSearch"
                      class="right_button"
                      >重置</el-button
                    >
                  </div>
                </ServiceTop>
                <div class="content">
                  <div class="table">
                    <TableHeader
                      :title="`字段列表（${total}）`"
                      :slotVisble="true"
                      :checkedColumns="checkedColumns"
                      :checkBoxGroup="checkBoxGroup"
                      @changeColumn="changeColumn"
                    >
                    </TableHeader>
                    <Table
                      class="table_style"
                      :data="dictList"
                      :table="tableColumn"
                      ref="dictListTableRef"
                      :rowK="'serialNumber'"
                      :treeProps="{ children: 'children' }"
                      :tableType="'selection'"
                      :cellStyle="dictListCellStyle"
                      useType="dialog"
                      :reload="reload"
                      @selectionChange="handleSelectionChange"
                    ></Table>
                    <!-- <Table
                      ref="tableRef"
                      class="table"
                      :data="dictList"
                      :table="dictListTables"
                      :radioModel="radioModel"
                      @operate="operate"
                      @radioChange="radioChange"
                    ></Table> -->
                    <!-- 分页器 -->
                    <PagePagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :pager="pager"
                    >
                    </PagePagination>
                  </div>
                </div>
                <!-- <div class="show_conf">
                  <div class="show_conf_title">
                    已选择{{ tableData && tableData.length }}个：
                  </div>
                  <div class="show_conf_content">
                    <el-tag
                      v-for="(item, index) in tableData"
                      :key="index"
                      type="info"
                      size="small"
                      closable
                      class="show_conf_tag"
                      @close="delParamsTag(item)"
                    >
                      {{ item.dictNm }}
                    </el-tag>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="show_conf">
          <div class="show_conf_title">
            已选择{{ tableData && tableData.length }}个：
          </div>
          <div class="show_conf_content">
            <el-tag
              v-for="(item, index) in tableData"
              :key="index"
              type="info"
              size="small"
              closable
              class="show_conf_tag"
              @close="delParamsTag(item)"
            >
              {{ item.dictNm }}
            </el-tag>
          </div>
        </div>
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
import PagePagination from "@m/core/components/page_pagination";
import TableHeader from "@m/core/components/page_table_header_filter";
export default {
  mixins: [mixin],
  components: {
    PageDialog,
    ServiceTop,
    Table,
    PagePagination,
    TableHeader
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
        // preciseQuery: "",
      },
      serviceForm: [
        {
          type: "inputIcon",
          labelText: "字段名称:",
          model: "content",
          placeholder: "请输入",
          style: {
            width: "180px",
          },
        },
      ],
      menuDatasetList: [
        // {
        //   dataSubstnNo: "1",
        //   dataSubstnNm: "测试1",
        //   number: "2",
        //   dataSubsectionList: [
        //     {
        //       dataSubstnNo: "FM-SJJ-111025",
        //       dataSubstnNm: "测试2",
        //       status: "1",
        //     },
        //     {
        //       dataSubstnNo: "FM-SJJ-110731",
        //       dataSubstnNm: "产品数据集8",
        //       status: "0",
        //     },
        //   ],
        // },
      ],
      defaultProps: {
        label: "dataSubstnNm",
        children: "dataSubsectionList",
      },
      defaultExpandedKeys: [],
      currentNodeKey: "",
      currentDatasetObj: {
        // dataSetNo: "FM-SJJ-111025",
      },
      servCount: "0",
      L5serviceList: [],
      L5serviceStyle: "0",
      statusObj: {
        0: "新增",
        1: "已入库",
        2: "变更",
      },
      L5Obj: {
        D5自有服务: "自有",
        D5直连服务: "直连",
      },
      currentSubObj: {},
      datasetObj: {},
      L5CheckList: [],
      paramsIntList: [],
      paramsIntL5List: [],
      paramsOutList: [],
      paramsOutL5List: [],
      radioModel: "",
      L5Arr: [],
      l5ServiceList: [],
      puApiParams: [],
      dicPager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      dictList: [],
      tableColumn: [
        {
          prop: "dictNm",
          label: "字段中文名称",
          // width: "200",
          type: "text",
          isTrue: true,
        },
        {
          prop: "dictNo",
          label: "英文名称",
          // width: "250",
          type: "text",
          isTrue: true,
        },
        {
          prop: "statusCd",
          label: "状态",
          type: "textClassList",
          filter: "fieldStatus",
          textClassList: [
            { class: "add status", val: "0" },
            { class: "register status", val: "1" },
            { class: "selfOther status", val: "2" },
            // { class: "finished status", val: "04" },
            // { class: "cancellation status", val: "05" },
          ],
          isTrue: true,
        },
        {
          prop: "typeLength",
          label: "类型（长度）",
          // width: "250",
          type: "text",
          isTrue: true,
        },
        // {
        //   label: "操作",
        //   width: "110",
        //   type: "button",
        //   fixed: "right",
        //   buttonList: [
        //     {
        //       desc: "查询服务",
        //       operate: "searchServ",
        //     },
        //   ],
        // },
      ],
      total: "2",
      selectionData: [],
      tableData: [],
      isRecord: true,
      //列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },

      // 表格筛选信息
      checkedColumns: [
        "字段中文名称",
        "英文名称",
        "状态",
        "类型（长度）",
      ],
      checkBoxGroup: [
        { label: "字段中文名称", disabled: true },
        { label: "英文名称" },
        { label: "状态" },
        { label: "类型（长度）" },
      ],
      reload: 0,
    };
  },
  methods: {
    changeColumn(val) {
      this.checkedColumns = val;
      let tempArr = this.checkBoxGroup.filter((i) => !val.includes(i.label));
      let arr = tempArr.map((item) => {
        return item.label;
      });
      this.tableColumn.filter((i) => {
        if (arr.indexOf(i.label) != -1) {
          i.isTrue = false;
        } else {
          i.isTrue = true;
        }
      });
      ++this.reload;
    },
    showDialog() {
      this.dialogVisible = true;
      this.tableData = [];
      this.formInline = {
        content: "",
      };
      this.pager = {
        currentPage: "1",
        turnPageShowNum: 10,
        total: 0,
      };
      console.log(this.dataObj, "showDialog");
      this.getDataParamsList();
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
    //获取分段
    async getDataParamsList() {
      const param = {
        currentPage: "1",
        turnPageShowNum: "9999",
        dataSetNo: this.dataObj.dataSetNo,
      };
      const res = await this.rpc.dicmgmtDefine.getDataParamsList(param);
      if (res.dataSetList.length > 0) {
        res.dataSetList.map((item) => {
          item.dataSubstnNm = item.dataSetNm;
          item.dataSubstnNo = item.dataSetNo;
        });
        this.menuDatasetList = res.dataSetList;
        this.defaultExpandedKeys.push(
          this.menuDatasetList[0].dataSubsectionList[0].dataSubstnNo
        );
        // this.defaultExpandedKey = this.menuDatasetList[0].dataSubsectionList[0].dataSubstnNo;
        this.currentDatasetObj = this.menuDatasetList[0].dataSubsectionList[0];
        if (this.currentDatasetObj) {
          this.currentSubObj = this.currentDatasetObj;
          this.getFiledList();
        }
      }
    },
    //字段
    async getFiledList() {
      const param = {
        dataSubstnNo: this.currentSubObj.dataSubstnNo,
        content: this.formInline.content,
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        preciseQuery: "0",
      };
      const res = await this.rpc.dicmgmtDefine.getMyFieldList(param);
      res.dataSetDataRelationList.map((item) => {
        item.typeLength = `${item.dictTyp}（${item.dictLength}）`;
      });
      // console.log(res, "res------");
      this.dictList = setSerialNumber(res.dataSetDataRelationList);
      this.pager.total = res.turnPageTotalNum * 1;
      this.total = res.turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableData();
      });
    },
    delParamsTag(e) {
      console.log(e, "eeee");
      const index = this.dictList.findIndex(
        (item) => item.dataSetDataId == e.dataSetDataId
      );
      if (index == -1) {
        this.tableData = this.tableData.filter(
          (it) => it.dataSetDataId != e.dataSetDataId
        );
        // console.log("-1");
      } else {
        // console.log("1");
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          this.dictList[index],
          false
        );
      }
    },
    goSearch() {
      this.pager.currentPage = "1";
      this.isRecord = true;
      this.getFiledList();
    },
    resetSearch() {
      this.pager.currentPage = "1";
      this.formInline.content = "";
      this.isRecord = true;
      this.getFiledList();
    },
    handleCancel() {
      this.closeDialog();
    },
    saveParams() {
      if (!this.tableData.length) return this.$message.error("请选择字段");
      this.closeDialog();
      this.$emit("saveParams", this.tableData, this.currentSubObj);
    },
    //分段树点击
    handleNodeClick(data, node) {
      // console.log(node, data, "handleNodeClick");
      this.currentDatasetObj = data;
      this.total = "";
      this.currentNodeKey = data.dataSubstnNo;
      if (node.level !== 1) {
        this.currentSubObj = data;
        this.isRecord = true;
        this.getFiledList();
      } else {
        // console.log(this.tableData, "选择父节点");
      }
    },
    // 多选框选中
    handleSelectionChange(e) {
      // console.log(e, "handleSelectionChange");
      this.datasetObj = e;
      // this.tableData.push(...e);
      // this.tableData = unduplicated(this.tableData, "dataSetDataId");
      // this.getL5ServicList();
      if (!this.isRecord && this.selectionData.length > e.length) {
        this.selectionData.forEach((item) => {
          if (e.indexOf(item) == -1) {
            this.tableData = this.tableData.filter(
              (it) => it.dataSetDataId != item.dataSetDataId
            );
          }
        });
      } else {
        this.tableData.push(...e);
        this.tableData = unduplicated(this.tableData, "dataSetDataId");
      }
      this.selectionData = e;
      this.isRecord = false;
    },
    nodeExpand() {},
    resetFields() {
      this.pager.currentPage = "1";
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields();
      }
    },
    handleSizeChange(turnPageShowNum) {
      this.pager.currentPage = "1";
      this.pager.turnPageShowNum = turnPageShowNum;
      this.getFiledList();
      this.isRecord = true;
    },
    handleCurrentChange() {
      this.getFiledList();
      this.isRecord = true;
    },
    // tableData数据选中表格中
    isTableData() {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item) => {
          this.dictList.forEach((data) => {
            if (item.dataSetDataId == data.dataSetDataId) {
              this.isRecord = true;
              this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
                data
              );
            }
          });
        });
      }
    },
  },
  filters: {
    ...filters,
  },
  watch: {
    defaultExpandedKeys(newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          document
            .querySelector(".el-tree-node__children .el-tree-node__content")
            .click();
        });
      }
    },
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
        position: relative;
      }
      .tree_label {
        // display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        // width: 80%;
        margin-left: 3px;
        max-width: 160px;
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
    .menu_current_none
      ::v-deep.el-tree-node.is-current
      > .el-tree-node__content {
      background-color: $base_white;
    }
    .menu_is_current ::v-deep.el-tree-node.is-current > .el-tree-node__content {
      color: $theme_color;
      background-color: #eaf1ff;
      font-family: SimHei;
      // font-weight: $font_weight_600;
    }
  }
}
.dialog {
  ::v-deep .el-dialog {
    background: #f5f5f8 !important;
  }
  ::v-deep .bgColor {
    background: #fff;
  }
  .disabled {
    cursor: not-allowed;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
  }
  ::v-deep .el-dialog__body {
    padding: 12px 16px !important;
  }
  ::v-deep .aop_tradedesign_comps_page_service_top .serivce_top {
    height: 64px;
    padding: 16px 24px;
  }
  ::v-deep .el-dialog__footer {
    background: #fff;
  }
  ::v-deep .dialog .el-form .el-form-item .el-input.input {
    width: 180px !important;
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
  .tree_title {
    padding: 20px 16px 19px 16px;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #000000;
    letter-spacing: 0;
  }
  .add_dialog_conf {
    // padding: 15px 12px;
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
        // width: 25%;
        width: 186px;
        height: 618px;
        // max-height: 420px;
        overflow: auto;
        border: 1px solid #dcdfe6;
        background: #fff;
      }
      .middle {
        // width: 55%;
        // max-height: 420px;
        // margin-left: 10px;
        overflow: auto;
        height: 618px;
        margin-left: 12px;
        // background: #fff;
        flex: 1;
        .content {
          background: #fff;
          margin-top: 12px;
          padding: 20px 24px;
          height: 542px;
          overflow: auto;
        }
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
        // border: 2px solid #dcdfe6;
        margin-left: 12px;
        background: #fff;

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
        position: relative;
      }
      .tree_label {
        // display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 160px;
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