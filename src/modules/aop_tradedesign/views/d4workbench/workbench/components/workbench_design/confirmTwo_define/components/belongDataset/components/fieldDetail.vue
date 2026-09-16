<template>
  <div class="fieldDetail_page">
    <div class="content_fieldDetail">
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
                {{ detailInfo.beltLineNm || detailInfo.beltLine | newBeltLineType }}
              </span>
            </div>
          </div>

          <div class="detail_list_middle">
            <div class="middle_content">
              <span>英文名字：</span>
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
        <div class="table">
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
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import { 
  enumCondition
} from "@m/utils/enumCondition";
export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
  },
  props: {},
  filters: {
    ...filters,
  },
  data() {
    return {
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
        0: "对公业务线",
        1: "对私业务线",
        2: "营销业务线",
      },
      showEunm:false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    async getDetail(data) {
      const params = {
        dataSetDataId: data.dataSetDataId,
      };
      const res = await this.rpc.dicmgmt.getMyFieldDetail(params);
      this.detailInfo = res;
      if (enumCondition(res.dictryTyp)) {
        if (res.dictryEnum) {
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
    // 每页条数改变时
    handleSizeChange(turnPageShowNum) {
      //   this.pager.turnPageShowNum = turnPageShowNum + "";
      //   this.getFieldList();
    },
    // 当前页改变时
    handleCurrentChange() {
      //   this.getFieldList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.fieldDetail_page {
  padding: 0px 24px;
  .title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
  }
  .content_fieldDetail {
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
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
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
