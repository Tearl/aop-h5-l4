<template>
  <div class="subDetail_page">
    <div class="content_subDetail">
      <div class="detail_info">
        <div class="title">基本信息</div>
        <div class="content">
          <div class="detail_list_left">
            <div class="left_content">
              <span>分段名称：</span>
              <span class="content_info">{{ detailInfo.dataSubstnNm }}</span>
            </div>
            <div class="left_content">
              <span>所属域：</span>
              <span class="content_info">{{
                detailInfo.beltLineNm || detailInfo.beltLine | newBeltLineType
              }}</span>
            </div>
          </div>

          <div class="detail_list_middle">
            <div class="middle_content">
              <span>所属数据集：</span>
              <span class="content_info">{{ detailInfo.dataSetNm }}</span>
            </div>
            <div class="middle_content">
              <span>关系：</span>
              <span class="content_info">{{
                dataSubstnAttr[detailInfo.dataSubstnAttr]
              }}</span>
            </div>
          </div>
          <div class="detail_list_right">
            <div class="right_content">
              <span>分类：</span>
              <span class="content_info">{{ detailInfo.classifyId | classifyIdSt }}</span>
            </div>
            <div class="right_content">
              <span>申请时间：</span>
              <span class="content_info">{{ detailInfo.createTm | crtTm_yyyyMMddhhmmss }}</span>
            </div>
          </div>
        </div>
        <div class="detail_list_bottom">
          <div class="bottom_content">
            <span>分段描述：</span>
            <span v-html="detailInfo.subDesc" class="content_info"></span>
          </div>
        </div>
      </div>
      <div class="table_content">
        <div class="title">字段项信息</div>
        <div class="table">
          <Table
            ref="tableRef"
            class="table_style"
            :data="tableData"
            :table="tableColumn"
            @operate="operate"
          ></Table>
          <!-- 分页器 -->
          <PagePagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager="pager"
          ></PagePagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PagePagination from "@m/core/components/page_pagination";
export default {
  mixins: [mixin],
  components: {
    Table,
    PagePagination,
  },
  filters: {
    ...filters,
  },
  props: {},
  data() {
    return {
      tableData: [],
      tableColumn: [
        {
          prop: "dictNo",
          label: "英文名称",
          // width: "200",
          type: "text",
        },
        {
          prop: "dictNm",
          label: "字段名称",
          // width: "250",
          type: "text",
          operate: "detail",
        },
        {
          prop: "dictNm",
          label: "字段描述",
          // width: "250",
          type: "text",
        },
        {
          prop: "dictTyp",
          label: "数据类型",
          // width: "250",
          type: "text",
        },
        {
          prop: "crtPrsnNm",
          label: "创建人",
          // width: "250",
          type: "text",
        },
        {
          prop: "crtTm",
          label: "创建时间",
          // width: "250",
          filter: "crtTm_yyyyMMddhhmmss",
          type: "text",
        },
      ],
      detailInfo: {},
      dataSubstnNo: "",
      //列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      dataSubstnAttr: {
        "01": "1:1",
        "02": "1:N",
      },
      departmentList: {
        0: "对公业务线",
        1: "对私业务线",
        2: "营销业务线",
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    async getDetail(data) {
      const params = {
        dataSubstnNo: data.dataSubstnNo,
      };
      const res = await this.rpc.dicmgmt.getSubStnDetail(params);
      this.detailInfo = res;
      this.dataSubstnNo = res.dataSubstnNo;
      this.getFieldList();
    },
    async getFieldList() {
      const params = {
        dataSubstnNo: this.dataSubstnNo,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const res = await this.rpc.dicmgmt.getMyFieldList(params);
      this.tableData = res.dataSetDataRelationList;
      this.pager.total = res.turnPageTotalNum;
    },
    showDialog(data) {
      this.pager = {
        currentPage:"1",
        turnPageShowNum:10,
        total:0
      }
      this.getDetail(data);
    },
    operate(operation, data) {
      if (operation == "detail") {
        this.$emit("fieldDetail", data);
      }
    },
    // 每页条数改变时
    handleSizeChange(turnPageShowNum) {
      this.pager.currentPage = "1"
      this.pager.turnPageShowNum = turnPageShowNum;
      this.getFieldList();
    },
    // 当前页改变时
    handleCurrentChange() {
      this.getFieldList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.subDetail_page {
  padding: 0px 24px;
  .title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
  }
  .content_subDetail {
    .detail_info {
      .content {
        display: flex;
        .detail_list_left,
        .detail_list_middle,
        .detail_list_right {
          width: 33%;
        }
        .left_content,
        .middle_content,
        .right_content {
          margin-top: 16px;
          font-family: $font_regular;
          font-size: 14px;
          color: $sec_ft_color;
          letter-spacing: 0;
          display: flex;
          .content_info {
            color: $pri_ft_color;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            flex: 1;
            &.cursor {
              color: $theme_color;
              cursor: pointer;
            }
            /deep/ .el-tag--dark {
              border-radius: $theme_radius;
              height: 19px;
              line-height: 19px;
              font-size: 14px;
            }
          }
          .content_versNo {
            background: #f2f8ff;
            color: $theme_color;
          }
          .text_style {
            color: $theme_color;
            font-family: $font_regular;
            font-size: 14px;
            cursor: pointer;
          }
          .status {
            display: inline-block;
            text-align: center;
            line-height: 20px;
            padding: 0px 5px;
            &.unpublish {
              background: #dffff6;
              color: #2ddaac;
            }
            &.publishing {
              background: #fff4e5;
              color: #ff9104;
            }
            &.unchecked {
              background: #ffeaec;
              color: #fe4758;
            }
            &.finished {
              background: #f2f8ff;
              color: #358aff;
            }
          }
          .input {
            display: inline-block;
            width: 50%;
          }
        }
      }
      .detail_list_bottom {
        margin-top: 16px;
        .bottom_content {
          border-bottom: 1px solid #e7e7ee;
          color: $sec_ft_color;
          padding: 16px 0;
          .content_info {
            display: block;
            color: #333330;
            line-height: 1;
            margin-top: 16px;
          }
        }
      }
    }
    .table_content {
      margin-top: 16px;
      .table {
        margin-top: 16px;
      }
    }
  }
}
</style>
