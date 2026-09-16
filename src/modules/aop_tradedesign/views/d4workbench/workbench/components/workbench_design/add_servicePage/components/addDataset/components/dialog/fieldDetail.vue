<template>
  <div class="page">
    <PageDialog
      dialogTitle="字段详情"
      :dialogVisiable="dialogVisible"
      dialogWidth="1000px"
      @closeDialog="closeDialog"
      class="dialog"
      :apTobody="true"
      :customClass="'customClass_page'"
    >
      <div slot="box">
        <div class="detail_info">
          <div class="title">基本信息</div>
          <div class="content">
            <div class="detail_list_left">
              <div class="left_content">
                <span>字段名称：</span>
                <span class="content_info">{{ detailInfo.dictryNm }}</span>
              </div>
              <div class="left_content">
                <span>字段类型：</span>
                <span class="content_info">{{ detailInfo.dictryTyp }}</span>
              </div>
              <div class="left_content">
                <span>所属域：</span>
                <span class="content_info">
                  {{ detailInfo.beltLineNm || departmentList[detailInfo.beltLine] }}
                </span>
              </div>
            </div>

            <div class="detail_list_middle">
              <div class="middle_content">
                <span>英文名称：</span>
                <span class="content_info">{{ detailInfo.dictryNo }}</span>
              </div>
              <div class="middle_content">
                <span>最大长度：</span>
                <span class="content_info">
                  {{ detailInfo.dictryLength }}
                </span>
              </div>
              <div class="middle_content">
                <span>创建人：</span>
                <span class="content_info">
                  {{ detailInfo.crtPrsnNm }}
                </span>
              </div>
            </div>

            <div class="detail_list_right">
              <div class="right_content">
                <span>所属分段：</span>
                <span class="content_info">{{ detailInfo.dataSubstnNm }}</span>
              </div>
              <div class="right_content">
                <span>所属数据集：</span>
                <span class="content_info">{{ detailInfo.dataSetNm }}</span>
              </div>
              <div class="right_content">
                <span>创建时间：</span>
                <span class="content_info">
                  {{ detailInfo.crtTm | crtTm_yyyyMMddhhmmss }}
                </span>
              </div>
            </div>
          </div>
          <div class="detail_list_bottom">
            <div class="bottom_content">
              <span>字段描述：</span>
              <span v-html="detailInfo.dictryDescr" class="content_info"></span>
            </div>
          </div>
        </div>
        <div class="table_content" v-if="showEunm">
          <div class="title">枚举值</div>
          <div>
            <Table
              ref="tableRef"
              class="table_style"
              :data="tableData"
              :table="tableColumn"
              @operate="operate"
            ></Table>
            <!-- 分页器 -->
            <!-- <PagePagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :pager="pager"
            >
            </PagePagination> -->
          </div>
        </div>
      </div>
      <span slot="footer">
        <!-- <el-button @click="closeDialog">取 消</el-button> -->
        <!-- <el-button type="primary" @click="confirm">确 定</el-button> -->
      </span>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
// import PagePagination from "@m/core/components/page_pagination";
export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    // PagePagination,
  },
  props: {},
  filters: {
    ...filters,
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      tableColumn: [
        {
          prop: "key",
          label: "枚举值",
          // width: "250",
          type: "text",
        },
        {
          prop: "value",
          label: "内容",
          // width: "250",
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
        "FM-YWY-2022-000001": "对公业务线",
        "FM-YWY-2022-000002": "对私业务线",
        "FM-YWY-2022-000003": "营销业务线",
      },
      showEunm:false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    init() {},
    async getDetail(data) {
      const params = {
        dataSetDataId: data.dataSetDataId,
      };
      const res = await this.rpc.dicmgmt.getMyFieldDetail(params);
      this.detailInfo = res;
      if (["String","char","byte","short","long","Character","Byte","Short","Long"].includes(res.dictryTyp)) {
        if (res.dictryEnum && res.dictryEnum !== "") {
          this.tableData = res.dictryEnum.split(",").map((item) => {
            const arr = item.split("-");
            return {
              key: arr[0],
              value: arr[1],
            };
          });
        }
        this.showEunm = true;
      }else{
        this.showEunm = false;
      }
    },
    showDialog(data) {
      // this.tableData.splice(0,this.tableData.length)
      this.getDetail(data);
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.tableData.splice(0,this.tableData.length)
    },
    confirm() {},
    // 每页条数改变时
    handleSizeChange(turnPageShowNum) {
      // this.pager.turnPageShowNum = turnPageShowNum + "";
      // this.getFieldList();
    },
    // 当前页改变时
    handleCurrentChange() {
      // this.getFieldList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.customClass_page {
  .title {
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    margin-bottom: 10px;
  }
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
        .content_info {
          color: $pri_ft_color;
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
  }

  .detail_list_bottom {
    margin-top: 16px;
    .bottom_content {
      border-top: 1px solid #e7e7ee;
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
</style>