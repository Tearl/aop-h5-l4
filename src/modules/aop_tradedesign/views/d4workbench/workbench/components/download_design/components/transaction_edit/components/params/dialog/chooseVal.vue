<template>
  <div class="aop_tradedesign_download_design_comps_add_params">
    <PageDialog
      :dialogWidth="'90%'"
      :dialogTitle="'请选择参数'"
      :dialogVisiable="addVisible"
      @closeDialog="handleCancel"
      class="create_dialog"
    >
      <div slot="box">
        <div class="add_dialog_conf1">
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
                      :data="dictList"
                      :table="dictListTables"
                      ref="dictListTableRef"
                      :rowK="'serialNumber'"
                      :treeProps="{ children: 'sonParamList' }"
                      :tableType="'selection'"
                      :cellStyle="dictListCellStyle"
                      @select="select"
                      @selectAll="selectAll"
                    ></Table>
                    <!-- <Table
                ref="tableRef"
                class="table"
                :data="dictList"
                :table="dictListTables"
                :radioModel="radioModel"
                @operate="operate"
                @radioChange="radioChange"
                @selectionChange="handleSelectionChange"
              ></Table> -->
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
                      {{ item.paramCName }}
                    </el-tag>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="saveParams">确定</el-button>
      </div>
    </PageDialog>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import {
  unduplicated,
  setSerialNumber,
  unduplicatedByKeys,
} from "@m/utils/array";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    PagePagination,
    ServiceTop,
  },
  props: {
    servId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      // 已选参数
      tableData: [],
      // 选择参数弹框
      addVisible: false,
      // 选择参数分页器
      dicPager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      dictList: [],
      // 添加参数列表参数
      dictListTables: [
        // {
        //   prop: "paramId",
        //   label: "",
        //   type: "radio",
        //   width: "100px",
        // },
        {
          prop: "paramCName",
          label: "中文名称",
          // minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramKey",
          label: "英文名称",
          // minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramDesc",
          label: "描述",
          // minWidth: "20%",
          type: "text",
          tooltip: true,
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
        // {
        //   type: "select",
        //   model: "paraType",
        //   placeholder: "参数值类型",
        //   select: [
        //     { type: "String", value: "String" },
        //     { type: "File", value: "File" },
        //     { type: "List", value: "List" },
        //     { type: "boolean", value: "boolean" },
        //     { type: "char", value: "char" },
        //     { type: "int", value: "int" },
        //     { type: "byte", value: "byte" },
        //     { type: "short", value: "short" },
        //     { type: "long", value: "long" },
        //     { type: "float", value: "float" },
        //     { type: "double", value: "double" },
        //     { type: "Boolean", value: "Boolean" },
        //     { type: "Character", value: "Character" },
        //     { type: "Integer", value: "Integer" },
        //     { type: "Byte", value: "Byte" },
        //     { type: "Short", value: "Short" },
        //     { type: "Long", value: "Long" },
        //     { type: "Float", value: "Float" },
        //     { type: "Double", value: "Double" },
        //     { type: "BigDecimal", value: "BigDecimal" },
        //     { type: "Object", value: "Object" },
        //     { type: "Date", value: "Date" },
        //   ],
        // },
      ],
      // 输入输出参数弹框的搜索表单
      formInline: {
        content: "",
        paraType: "",
      },
      l5SvcList: [],
      currentPage: 1, //存储当前服务列表的显示页数
      turnPageTotalNum: 10, //存储当前服务列表的总条数
    };
  },
  methods: {
    saveParams() {
      this.$emit("saveSourceParams", this.tableData);
    },
    showDialog(e) {
      this.tableData = [];
      this.L5serviceList = [];
      this.addVisible = true;
      this.goSearch();
      this.resetSearch();
    },
    // 初始化添加输入输出搜索栏
    resetSearch() {
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields();
      }
    },
    select(selection, row) {
      if (selection.length > 1) {
        let del_row = selection.shift();
        this.tableData = JSON.parse(JSON.stringify(selection));
        this.$refs.dictListTableRef.toggleRowSelection(del_row, false);
      } else {
        this.tableData = JSON.parse(JSON.stringify(selection));
      }
    },
    selectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1;
      }
      this.tableData = JSON.parse(JSON.stringify(selection));
    },

    //多选显示
    dictListCellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.serialNumber.indexOf(".") != "-1" && column.label == "") {
        return { visibility: "hidden" };
      }
    },
    //表头样式
    dicHeaderCellStyle({ row, column, rowIndex, columnIndex }) {
      // if (row[0].type == "selection" && row[0].label == "") {
      //   return { display: "none" };
      // }
    },
    goSearch() {
      this.dicPager.currentPage = "1";
      this.getFiledList();
    },
    resetFields() {
      this.formInline.content = "";
      this.dicPager.currentPage = "1";
      this.getFiledList();
    },
    handleCancel() {
      this.addVisible = false;
      this.beforeDestroy();
      this.tableData = [];
      this.clearAll(this.dictList);
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
    //字段
    async getFiledList() {
      const param = {
        apiId: this.servId,
        currentPage: this.dicPager.currentPage + "",
        turnPageShowNum: this.dicPager.turnPageShowNum,
      };
      const res = await this.rpc.d4.getL5ServField(param);
      res.paramList.map((item) => {
        item.typeLength = `${item.paramType}（${item.paramLength}）`;
      });
      this.radioModel = {};
      this.dictList = setSerialNumber(res.paramList, "", "sonParamList");
      this.dicPager.total = res.turnPageTotalPage * 1;
    },
    // 删除当前点击的参数
    delParamsTag(e) {
      console.log(e, "delParamsTag");
      const index = this.dictList.findIndex(
        (item) => item.paramId == e.paramId
      );
      if (index == -1) {
        this.tableData = this.tableData.filter((it) => it.paramId != e.paramId);
      } else {
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          this.dictList[index],
          false
        );
      }
    },
    clearAll(data) {
      data.forEach((item) => {
        item.isPush = 0;
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          item,
          false
        );
        if (item.sonParamList.length) {
          this.clearAll(item.sonParamList);
        }
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss">
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_download_design_comps_add_params {
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
        // overflow: hidden;
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
        .middle {
          width: 100%;
          max-height: 420px;
          margin-left: 10px;
          // overflow: auto;
        }
        .list_title {
          border-bottom: 1px solid #dcdfe6;
          padding: 10px;
          font-weight: 600;
          color: rgb(94, 8, 8);
          // margin-bottom: 5px;
        }
      }
    }
    .service_menu_list {
      // margin-top: 8px;
      // height: 278px;
      max-height: 320px;
      overflow-y: scroll;
      .list_item {
        font-size: 12px;
        // margin-bottom: 6px;
        // white-space: nowrap;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        cursor: pointer;
        padding: 4px 6px;
        // height: 30px;
        &:hover,
        &.active {
          background: #eaf1ff;
          .text_area .list_item_title {
            color: $theme_color;
            font-weight: 600;
          }
        }
        .text_area {
          display: flex;
          .icon {
            margin-right: 4px;
          }
          .list_item_title {
            white-space: nowrap;
            text-overflow: ellipsis;
            // overflow: hidden;
            // padding: 0 10px;
            max-width: 120px;
            height: 20px;
            line-height: 20px;
            color: #000;
            cursor: pointer;
            font-size: 13px;
            &.r4b {
              max-width: 170px;
            }
          }
        }
        &:hover {
          .list_item_icon {
            &.delete {
              display: inline-block;
            }
          }
        }
        .list_item_icon {
          &.delete {
            display: none;
            // color: $danger_color;
            cursor: pointer;
          }
        }
        .icon_area {
          font-size: 13px;
        }
      }
    }
  }
  .elem_search {
    overflow: hidden;
    line-height: 30px;
    padding: 5px;
    &.flex {
      display: flex;
      justify-content: center;
      align-items: center;
      .add_icon {
        margin-left: 5px;
        cursor: pointer;
        .el-icon-plus {
          color: $theme_color;
          font-weight: $font_weight_600;
          font-size: 28px;
        }
        &.hidden {
          visibility: hidden;
        }
      }
    }
  }
}
</style>