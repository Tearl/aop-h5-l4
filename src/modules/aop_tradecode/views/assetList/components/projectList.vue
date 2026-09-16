<template>
  <el-dialog 
      title="使用工程列表"
      :visible="visibleShow"
      :before-close="handleClose"
      width="70%"
      
      class="aop_endentry_assetList_list_header_dialog">
    <el-container>
      <!-- <el-header style="height: auto">

      </el-header> -->
      <el-main class="preview_main">
        <el-form
          :inline="true"
          :model="formSearch"
          class="demo-form-inline"
          v-show="showSearchForm"
        >
          <el-form-item label="工程编号/编码/名称：" size="small">
            <el-input
              v-model="formSearch.appNoCdNm"
              placeholder="请输入"
              class="input_search_num"
            ></el-input>
          </el-form-item>
          <el-form-item size="small" style="float: right">
            <el-button type="primary" size="small" @click="submitSearch"
              >查询</el-button
            >
            <el-button plain size="small" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="wrap">
          <PageTable
            class="table_style"
            height="400"
            :table="tables"
            :data="treeData"
            key="connectList1"
            ref="dialogTableRef"
            rowK="connectList"
            :show-overflow-tooltip="true"
          ></PageTable>
          <el-pagination
            class="btn_el_pageNation"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            medium
            background
            :current-page="formSearch.currentPage"
            :page-sizes="[10, 20, 30]"
            :page-size="formSearch.turnPageShowNum"
            layout="total, prev, pager, next,sizes, jumper"
            :total="turnPageTotalNum"
          >
          </el-pagination>
        </div>
      </el-main>
    </el-container>
  </el-dialog>
</template>
<script>
import mixin from "@m/core/mixin";
import { mapGetters } from "vuex";
import PageHeader from "@m/core/components/page_header";
import PageTable from "@m/core/components/page_table_workgate";
export default {
  mixins: [mixin],
  components: {
    PageHeader,
    PageTable,
  },
  props: {
    
  },
  data() {
    return {
      treeData: [],

      //搜索条件
      formSearch: {
        templateId: '',
        appNoCdNm: '',
        currentPage: '',
        turnPageShowNum: '',
      },
      createForm: {
        srcTemplateId: '',
        templateNm: '',
        templateDesc: '',
      },
      showSearch: true,
      zoomSize: 1,
      // 右侧待选项的数据列表
      selectItemKeyList: [],
      selectedKey: [],
      toggleIndex: 0,
      tableColumnList: [],
      showSearchForm: true,
      tables: [
        {
          prop: "appId",
          label: "工程编号",
          minWidth: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "appCd",
          label: "工程编码",
          minWidth: "120",
          type: "text",
          tooltip: true,
          operate: "templateNm",
        },
        {
          prop: "appNm",
          label: "工程名称",
          minWidth: "110",
          type: "text",
          tooltip: true,
        },
        {
          prop: "app1LvlTypeCd",
          label: "工程类型",
          minWidth: "150",
          type: "text",
          tooltip: true,
          // 1-渠道端应用; 2-交易4b应用
          filter: (scope) => {
            return scope.row.app1LvlTypeCd === '1' ? '渠道端应用' : '交易4b应用';
          }

        },
        {
          prop: "appDesc",
          label: "工程描述",
          minWidth: "170",
          type: "text",
          tooltip: true,
        },
      ],
      //列表数量
      turnPageTotalNum: 0,
      buttonList: [
        {
          name: "查看",
          color: "#358aff",
          type: "look",
          isDisabled: false,
        },
        {
          name: "编辑",
          color: "#358aff",
          type: "edit",
          isDisabled: false,
        },
        {
          name: "复制",
          color: "#358aff",
          type: "copy",
          isDisabled: false,
        },
        {
          name: "删除",
          color: "red",
          type: "del",
          isDisabled: false,
        },
      ],

      newlabelShow: false,
      drawerTitle: "新增标签",
      drawShowType: "add",
      topInfo: {},
      looklabelShow: false,
      maxTableHeight: "",
      turnPageTotalNum: 0,
      visibleShow: false,
      templateId: '',
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    showDialog(id) {
      this.visibleShow = true;
      this.templateId = id
      this.resetSearch()
    },
    handleClose() {
      this.visibleShow = false
    },
    submitSearch() {
      this.formSearch.turnPageShowNum = 10;
      this.formSearch.currentPage = 1;
      this.queryLabelBaseInfoPageList();
    },
    resetSearch() {
      this.formSearch.appNoCdNm = "";
      this.formSearch.turnPageShowNum = 10;
      this.formSearch.currentPage = 1;
      this.queryLabelBaseInfoPageList();
    },
    handleSizeChange(newsize) {
      this.formSearch.turnPageShowNum = newsize;
      this.queryLabelBaseInfoPageList();
    },
    handleCurrentChange(newPage) {
      this.formSearch.currentPage = newPage;
      this.queryLabelBaseInfoPageList();
    },
    // 所有活动标签列表
    async queryLabelBaseInfoPageList() {
      this.treeData = [];
      const params = {
        ...this.formSearch,
        templateId: this.templateId,
        currentPage: this.formSearch.currentPage,
        turnPageShowNum: this.formSearch.turnPageShowNum,
      };
      const res = await this.rpc.assetList.queryMessageTemplateRelAppPageList(
        params
      );
      this.turnPageTotalNum = Number(res.turnPageTotalNum);
      this.treeData = res.appInfoList
    },
  },
  created() {},
  mounted() {
    // this.queryLabelBaseInfoPageList(); // 查询标签列表
  },
  beforeDestroy() {
    this.treeData = [];
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy();
    next();
  },
  watch: {},
  filters: {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_endentry_assetList_list_header_dialog {
  // background-color: $base_white;
  // width: 100%;
  // position: relative;
  .el-container {
    width: 100%;
    overflow: hidden;
    // background: #f5f5f5;
    // padding: 12px 12px;
  }
  .table_style {
    padding-bottom: 15px;
  }
  h3 {
    font-size: 16px;
    font-family: PingFangSC-Semibold;
    color: #111111;
    letter-spacing: 0;
    line-height: 24px;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }
  .el-header {
    background-color: #fff;
    margin-bottom: 10px;
    position: relative;
    .el-form {
      margin-top: 30px;
    }
    .demo-form-inline {
      width: 100%;
      margin: 16px 0px 0 0;
      background: #ffffff;
      .input_search_num {
        max-width: 150px;
        /deep/ .el-input__inner {
          input {
            min-width: 120px !important;
            max-width: 130px !important;
          }
        }
      }
      .input_search_select1 {
        /deep/ .el-form-item__content {
          input {
            min-width: 130px !important;
            max-width: 150px !important;
          }
        }
      }
      .input_search_select2 {
        /deep/ .el-form-item__content {
          input {
            min-width: 125px !important;
            max-width: 145px !important;
          }
        }
      }
      .input_search_name {
        max-width: 90px;
      }
      .input_search_time {
        max-width: 250px;
      }
      /deep/.el-date-editor .el-range-separator {
        min-width: 25px !important;
      }
      ::v-deep .el-button {
        min-width: 64px;
        height: 32px;
        font-size: 14px;
      }
    }
  }
  .preview_main {
    // padding: 12px 24px 24px 24px;
    background: #ffffff;
    position: relative;
    overflow: hidden;
    padding-top: 0px;
    padding-top: 0px;
    .homeMainHeader {
      height: auto;
      background-color: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0px;
      justify-content: space-between;
      margin-bottom: 12px;
      h3 {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        line-height: 24px;
        font-weight: 500;
      }
      /deep/.el-icon-search:before {
        font-size: 16px;
      }
      /deep/.el-icon-zoom-in:before {
        font-size: 16px;
      }
      /deep/.el-icon-zoom-out:before {
        font-size: 16px;
      }
    }
    .tabs_div::-webkit-scrollbar {
      display: none;
    }
    .wrap {
      width: 100%;
      background: #ffffff;
      // overflow: scroll;
    }
  }
  ::v-deep .el-drawer__header {
    box-shadow: inset 0 -1px 0 0 #e7e7e7;
    font-family: PingFangSC-Semibold;
    color: #333333;
    letter-spacing: 0;
    font-weight: 600;
    // padding: 14px 24px;
    margin-bottom: 0px;
  }
  ::v-deep .el-dialog {
    border-radius: 8px 8px;
  }
  ::v-deep .el-dialog__footer {
    display: flex;
    justify-content: center;
  }
  h3 {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
    line-height: 36px;
  }
  .preview_content_table {
    // padding: 16px 16px;
    color: #131313;
    background-color: $base_white;
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 36px;
    }
    .orange {
      color: #ff9104;
      background: #fff4e5;
    }
    .green {
      color: #36d542;
      background: #e5ffe7;
    }
    .blue {
      color: #358aff;
      background: #f2f8ff;
    }
    .red {
      color: #fe4758;
      background: #ffeaec;
    }
    .span-tag {
      // padding: 0px 8px;
      border-radius: 2px 2px;
      font-size: 14px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      font-family: PingFangSC-Regular;
    }
    .preview_content_table_flex {
      display: flex;
      width: 100%;
      font-size: 14px;
      p {
        margin-top: 6px;
        color: #999999;
        width: 50%;
        span {
          color: #333333;
        }
      }
    }
  }
  ::v-deep .el-tabs__nav-wrap::after {
    background-color: $base_white;
  }
  ::v-deep .el-dialog__footer {
    display: flex;
    justify-content: center;
  }
  .btn_el_pageNation {
    display: flex;
    justify-content: flex-end;
    // padding: 16px 0;
  }
  .dialog-footer {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    .el-button {
      margin-right: 10px;
    }
  }
  ::v-deep .el-dialog__body {
    // padding: 20px 20px 0 20px !important;
    padding-top: 20px !important;
    padding-right: 0px;
    padding-left: 0px;
    border-top: 1px solid #eee;
  }
  .dialog-content-table {
    width: 100%;

    ::v-deep .el-button {
      min-width: 64px;
      height: 32px;
      font-size: 14px;
    }
    .top_title_tips {
      width: 100%;
      display: flex;
      align-items: center;
      background: #fef2dd;
      position: absolute;
      top: 54px;
      left: 0;
      // padding: 16px 16px;
      span {
        font-size: 14px;
        color: #f5a623;
        line-height: 1;
        margin-left: 5px;
      }
    }
    h3 {
      color: $pri_ft_color;
      font-weight: 600;
      line-height: 36px;
    }
    ::v-deep .el-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
      line-height: 30px;
      color: #ff9104;
    }
    .dialog-footer {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dialog_table_title_top {
      width: 100%;
      display: flex;
      align-items: center;
      margin: 10px 0px;
    }
    .preview_content_table2 {
      display: flex;
      flex: 1;
      flex-direction: column;
      margin: 10px 0px;
      color: #131313;
      // padding-bottom: 5px;
      .preview_content_table_flex {
        display: flex;
        width: 100%;
        text-align: left;
        p {
          color: #999999;
          font-size: 14px;
          width: 50%;
        }
        span {
          font-size: 14px;
          color: $pri_ft_color;
        }
      }
    }

    .left_dialog_table_content {
      width: 100%;
      h3 {
        margin-top: 10px;
      }
      .left_dialog_table_flex {
        width: 100%;
        display: flex;
        span {
          font-size: 14px;
          color: #999999;
        }
        span:last-child {
          font-size: 14px;
          color: #333333;
        }
      }
      .left_dialog_table_flex_end {
        width: 100%;
        margin-top: 14px;
        span {
          font-size: 14px;
          color: $pri_ft_color;
        }
        p {
          font-size: 14px;
          color: $pri_ft_color;
          span {
            font-size: 14px;
            color: #999999;
            margin-right: 5px;
          }
        }
      }
    }
  }
  .bg-red {
    //艳红
    background-color: #e54d42;
    color: #fff;
  }

  .bg-orange {
    //橘黄
    background-color: #f37b1d;
    color: #fff;
  }

  .bg-yellow {
    //亮黄
    background-color: #fbbd08;
    color: #333;
  }

  .bg-olive {
    // 橄榄绿
    background-color: #8dc63f;
    color: #fff;
  }

  .bg-green {
    // 森林绿
    background-color: #39b54a;
    color: #fff;
  }

  .bg-cyan {
    //天青
    background-color: #1cbbb4;
    color: #fff;
  }

  .bg-blue {
    // 海蓝
    background-color: #0081ff;
    color: #fff;
  }

  .bg-purple {
    // 葡萄紫
    background-color: #6739b6;
    color: #fff;
  }

  .bg-mauve {
    // 木槿紫
    background-color: #9c26b0;
    color: #fff;
  }

  .bg-pink {
    // 粉红
    background-color: #e03997;
    color: #fff;
  }

  .bg-brown {
    //土褐色
    background-color: #a5673f;
    color: #fff;
  }

  .bg-grey {
    // 青灰色
    background-color: #8799a3;
    color: #fff;
  }

  .bg-gray {
    // 浅灰色
    background-color: #f0f0f0;
    color: #666;
  }

  .bg-black {
    // 深黑
    background-color: #333;
    color: #fff;
  }

  .bg-white {
    // 雅白
    background-color: #fff;
    color: #666;
  }
}
</style>
