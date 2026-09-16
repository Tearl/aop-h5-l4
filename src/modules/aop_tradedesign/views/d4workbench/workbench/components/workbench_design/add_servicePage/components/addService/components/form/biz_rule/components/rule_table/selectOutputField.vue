<template>
  <div class="aop_tradedesign_comps_design_attr_select_output_field">
    <PageDialog
      :dialogWidth="'90%'"
      :dialogTitle="'请选择参数'"
      :dialogVisiable="dialogVisible"
      @closeDialog="closeDialog"
      class="create_dialog"
      :apTobody="true"
    >
      <div slot="box">
        <div class="add_dialog_conf1">
          <div class="check_content">
            <div class="left">
              <div class="left_tree">
                <div>
                  <el-tree
                    :data="menuDatasetList"
                    class="siderbar_menu"
                    ref="menuDatasetRef"
                    :props="defaultProps"
                    node-key="dataSubstnNo"
                    :default-expanded-keys="defaultExpandedKeys"
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
                    </span></el-tree
                  >
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
                    <!-- <Table
                      class="table_style"
                      :data="dictList"
                      :table="dictListTables"
                      ref="dictListTableRef"
                      :rowK="'serialNumber'"
                      :treeProps="{ children: 'children' }"
                      :tableType="'selection'"
                      :cellStyle="dictListCellStyle"
                      @selectionChange="handleSelectionChange"
                    ></Table> -->
                    <Table
                      ref="tableRef"
                      class="table"
                      :data="dictList"
                      :table="dictListTables"
                      :radioModel="radioModel"
                      @radioChange="radioChange"
                    ></Table>
                    <!-- 分页器 -->
                    <PagePagination
                      @size-change="handleDicSizeChange"
                      @current-change="handleDicCurrentChange"
                      :pager="dicPager"
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
                      @close="delParamsTag(item, formInline.type)"
                    >
                      {{ item.dictNmSer }}
                    </el-tag>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click.native="closeDialog">取 消</el-button>
        <el-button
          type="primary"
          @click.native="confirm"
          >确定</el-button
        >
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import {
  unduplicated,
  setSerialNumber,
  unduplicatedByKeys,
} from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    PagePagination,
    ServiceTop
  },
  props: {
  },
  data() {
    return {
      dialogVisible: false,
      paramsDetail: {},
      currentColumnObj: {},
      tableData: [],
      //树
      menuDatasetList: [
        // {
        //   dataSetNo: "1",
        //   dataSetNm: "测试1",
        //   number: "2",
        //   children: [
        //     {
        //       dataSetNo: "FM-SJJ-111025",
        //       dataSetNm: "测试2",
        //       status: "1",
        //     },
        //     {
        //       dataSetNo: "FM-SJJ-110731",
        //       dataSetNm: "产品数据集8",
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
      dictList: [],
      // 添加参数列表参数
      dictListTables: [
        {
          prop: "dictId",
          width: "55",
          type: "radio",
        },
        {
          prop: "dictNm",
          label: "字段中文名称",
          // minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictNo",
          label: "英文名称",
          // minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "statusCd",
          label: "状态",
          // minWidth: "20%",
          type: "textClassList",
          filter:"fieldStatus",
          tooltip: true,
          textClassList: [
            { class: "undevelop status", val: "0" },
            { class: "publishing status", val: "1" },
            { class: "unchecked status", val: "2" },
            // { class: "finished status", val: "04" },
            // { class: "cancellation status", val: "05" },
          ],
        },
        // {
        //   prop: "dictryTyp",
        //   label: "参数值类型",
        //   width: "90",
        //   type: "text",
        //   tooltip: true,
        // },
        {
          prop: "typeLength",
          label: "类型(长度)",
          // width: "90",
          type: "text",
          tooltip: true,
        },
      ],
      radioModel: "",
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "请输入字段名称",
          style: {
            width: "260px",
          },
        },
      ],
      // 输入输出参数弹框的搜索表单
      formInline: {
        content: "",
        paraType: "",
      },
      dicPager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      datasetObj: {},
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      dataSetNm: "",
      dataSetNo: "",
    };
  },
  methods: {
    async showDialog(data,{dataSetNo,dataSetNm}) {
      // console.log("showDialog", data)
      this.currentColumnObj = data
      this.radioModel = data.dictId
      this.selectionData = [];
      this.tableData = [];
      this.dialogVisible = true;
      this.dataSetNo = dataSetNo
      this.dataSetNm = dataSetNm
      this.getDataParamsList();
    },
    closeDialog() {
      this.dialogVisible = false
    },
    
    confirm() {
      // if (!this.currentRadio) return this.$message.error("请选择参数")
      this.$emit("setOutputTarget", "column", this.currentColumnObj, this.paramsDetail)
      this.closeDialog()
    },
   
    //获取分段
    async getDataParamsList() {
      const params = {
        dataSetNo: this.dataSetNo || "",
      };
      const res = await this.rpc.dicmgmt.getSubStnList(params);
      if (res.dataSubsectionList.length > 0) {
        this.menuDatasetList = [{}]
        this.menuDatasetList[0].dataSubstnNo = this.dataSetNo || ""
        this.menuDatasetList[0].dataSubstnNm = this.dataSetNm || ""
        this.menuDatasetList[0].dataSubsectionList = res.dataSubsectionList
        this.defaultExpandedKeys.push(
          this.menuDatasetList[0].dataSubsectionList[0].dataSubstnNo
        );
        this.currentDatasetObj = this.menuDatasetList[0].dataSubsectionList[0];
        if (this.currentDatasetObj) {
          this.currentSubObj = this.currentDatasetObj;
          this.getFiledList();
        }
      }

      // const param = {
      //   currentPage: "1",
      //   turnPageShowNum: "99",
      // };
      // const res = await this.rpc.dicmgmtDefine.getDataParamsList(param);
      // if (res.dataSetList.length > 0) {
      //   res.dataSetList.map((item) => {
      //     item.dataSubstnNm = item.dataSetNm;
      //     item.dataSubstnNo = item.dataSetNo;
      //   });
      //   this.menuDatasetList = res.dataSetList;
      //   this.defaultExpandedKeys.push(
      //     this.menuDatasetList[0].dataSubsectionList[0].dataSubstnNo
      //   );
      //   this.currentDatasetObj = this.menuDatasetList[0].dataSubsectionList[0];
      //   if (this.currentDatasetObj) {
      //     this.currentSubObj = this.currentDatasetObj;
      //     this.getFiledList();
      //   }
      //   console.log("数据", this.menuDatasetList)
      // }
    },
    //字段
    async getFiledList() {
      const param = {
        dataSubstnNo: this.currentSubObj.dataSubstnNo,
        dictNm:this.formInline.content,
        currentPage: this.dicPager.currentPage + "",
        turnPageShowNum: this.dicPager.turnPageShowNum,
      };
      const res = await this.rpc.dicmgmt.getMyFieldList(param);
      res.dataSetDataRelationList.map((item) => {
        item.typeLength = `${item.dictTyp}（${item.dictLength}）`;
      });
      console.log(res, "res------");
      this.dictList = setSerialNumber(res.dataSetDataRelationList);
      this.dicPager.total = res.turnPageTotalNum * 1;
      console.log("getFiledList", res);
    },

    //分段树点击
    handleNodeClick(data, node) {
      // console.log(node, data, "handleNodeClick");
      this.currentDatasetObj = data;
      this.dictList = [];
      if (node.level !== 1) {
        this.currentSubObj = data;
        this.isRecord = true;
        this.getFiledList();
        this.L5serviceList = [];
        // console.log(this.currentSubObj, "this.currentSubObj");
      } else {
        // this.datasetObj = data;
        // this.getL5ServicList();
      }
    },

    goSearch() {
      this.isRecord = true;
      this.dicPager.currentPage = "1";
      this.getFiledList();
    },
    resetFields(){
      this.formInline.content = "";
      this.dicPager.currentPage = "1";
      this.getFiledList();
    },
    //字段单选调接口L5服务
    radioChange(e) {
      this.radioModel = e.dictId;
      this.paramsDetail = e
    },
    handleDicSizeChange(e) {
      this.isRecord = true;
      this.dicPager.turnPageShowNum = e + "";
      this.getFiledList();
    },
    handleDicCurrentChange(e) {
      this.isRecord = true;
      this.getFiledList();
    },
    init() {
    }
  },
  created() {
    this.init()
  },
  watch: {
    defaultExpandedKeys(val) {
      if (val) {
        this.$nextTick(() => {
          document
            .querySelector(".el-tree-node__children .el-tree-node__content")
            .click();
        });
      }
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_design_attr_select_output_field {
  .container {
    padding: 16px;
  }
  .edit_form {
    margin-top: 10px;
    @include form;
  }
  .table_style ::v-deep .el-table__header-wrapper .el-checkbox {
    display: none;
  }
  .create_dialog {
    ::v-deep .el-dialog__body {
      padding: 0;
    }
    .add_dialog_conf1 {
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
          width: 20%;
          max-height: 420px;
          overflow: auto;
          border: 2px solid #dcdfe6;
          // flex: 1;
        }
        .middle {
          width: 80%;
          max-height: 420px;
          margin-left: 10px;
          overflow: auto;
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
    .add_dialog_conf {
      padding: 15px 24px;
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
    }
    .d_flex_center {
      display: flex;
      justify-content: center;
      padding: 16px 0 12px;
      margin: 0 0 0 -24px;
      border-bottom: 1px solid #dcdfe6;
      width: calc(100% + 48px);
    }
  }
}
.create_dialog {
    ::v-deep .el-dialog__body {
      padding: 0;
    }
    .add_dialog_conf1 {
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
          width: 20%;
          max-height: 420px;
          overflow: auto;
          border: 2px solid #dcdfe6;
          // flex: 1;
        }
        .middle {
          width: 80%;
          max-height: 420px;
          margin-left: 10px;
          overflow: auto;
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
    .add_dialog_conf {
      padding: 15px 24px;
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
    }
    .d_flex_center {
      display: flex;
      justify-content: center;
      padding: 16px 0 12px;
      margin: 0 0 0 -24px;
      border-bottom: 1px solid #dcdfe6;
      width: calc(100% + 48px);
    }
  }
</style>
