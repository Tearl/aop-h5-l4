<template>
  <div class="aop_tradedesign_page_dicmgmt_sys_data_list_detail">
    <div class="create_content_wrapper">
      <div class="detail_content">
        <div class="content_header nav_title">{{ "基本信息" }}</div>
        <ul class="content_body">
          <li class="list_item">
            <span class="list_item_key">数据集名称：</span>
            <span class="list_item_value">{{formData.dataColletChiNm}}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">数据集ID：</span>
            <span class="list_item_value">{{ formData.dataColletId }}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">数据集描述：</span>
            <span class="list_item_value">{{ formData.dataColletDescr }}</span>
          </li>
        </ul>
      </div>

      <div class="detail_content">
        <div class="content_header nav_title">数据列表</div>
        <Table
          class="table_style"
          :data="dictInfos"
          :table="dictInfosTable"
        ></Table>
        <!-- 分页器 -->
        <PagePagination
          class="page_pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager="pager"
          >
        </PagePagination>
      </div>
    </div>

    <PageFooter>
      <div slot="box">
        <el-button @click="handleCancel">取 消</el-button>
        <!-- <el-button type="primary" @click="preservation">确 定</el-button> -->
      </div>
    </PageFooter>
  </div>
</template>
<script>
import PageHeader from "@m/core/components/page_header";
import Table from "@m/core/components/page_table";
import PageFooter from "@m/core/components/page_footer";
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import PagePagination from "@m/core/components/page_pagination";

export default {
  mixins: [mixin],
  components: {
    PageHeader,
    Table,
    PageFooter,
    PagePagination
  },
  props: {
    dataColletId: {
      type: String,
      default: () => "",
    },
    sysId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      dictInfos: [],
      // 添加输入参数列表参数
      dictInfosTable: [
        {
          prop: "dictryId",
          label: "数据ID",
          width: "100",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryNm",
          width: "120",
          label: "数据名称",
          type: "text",
          tooltip: true,
        },
      ],
      // 表单数据
      formData: {
        dataColletChiNm: "", // 参数中文名称
        dataColletId: "",
        dataColletDescr: ""
      },
      // 列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
    };
  },
  methods: {
    async getDetail() {
      console.log(this.dataColletId);
      const res = await this.rpc.systemmgmt.getDataListDetail({dataColletId: this.dataColletId})
      this.formData = {
        dataColletChiNm: res.dataColletChiNm, 
        dataColletDescr: res.dataColletDescr,
        dataColletId: res.dataColletId
      }
    },
    async getList() {
      const params = {
        dataColletId: this.dataColletId,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      }
      const res = await this.rpc.systemmgmt.getDataListDetailList(params)
      this.dictInfos = res.dictInfos
      this.pager.total = res.turnPageTotalNum
    },
    // 每页条数改变时
    handleSizeChange(e) {
      this.pager.turnPageShowNum = e;
      this.getList();
    },
    // 当前页改变时
    handleCurrentChange(e) {
      this.getList();
    },
    handleCancel() {
      this.$emit("toList")
    },
    //初始化
    init() {
      this.getDetail()
      this.getList()
    },
  },
  created() {
    this.init();
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_dicmgmt_sys_data_list_detail {
  .create_content_wrapper {
    // padding: 16px 24px;
    .detail_content {
      background: $base_white;
      padding: 20px 32px;
      margin-bottom: 16px;
      .content_header {
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
        margin-bottom: 20px;
      }
      .content_body {
        display: flex;
        flex-wrap: wrap;
        .list_item {
          width: 50%;
          margin-bottom: 16px;
          .list_item_key {
            color: $sec_ft_color;
          }
          .list_item_value {
            color: $pri_ft_color;
            &.click_text {
              color: $theme_color;
              cursor: pointer;
            }
          }
        }
      }
      .service_create_form {
        margin-top: 32px;
        @include form(".service_create_form_info");
        .create_form_tips {
          width: 500px;
          position: absolute;
          left: 420px;
          top: 0px;
          height: 40px;
          line-height: 40px;
          font-family: $font_regular;
          font-size: 12px;
          color: $sec_ft_color;
          letter-spacing: 0;
        }
      }
      .service_create_form_info {
        padding: 0px 30px 0;
        .no_before ::v-deep.el-form-item__label::before {
          content: "";
        }
        .add_params_button {
          font-size: 14px;
          border-radius: 2px;
          cursor: pointer;
          padding: 0 8px;
          letter-spacing: 0;
          text-align: center;
          font-family: PingFangSC-Regular;
          height: 40px;
        }
      }
    }
    .table_class {
      ::v-deep tr td {
        &:nth-child(1) {
          .cell {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
  .input_textarea {
    position: absolute;
    top: 20px;
    left: 30px;
    width: 1000px;
    height: 500px;
  }
  ::v-deep .table_style .el-radio__label {
    display: none;
  }

  .dialog {
    ::v-deep .service_top {
      padding: 0;
    }
  }
  ::v-deep .el-dialog__wrapper {
    overflow: hidden;
  }
  .table_class ::v-deep.el-table tr {
    height: 75px;
  }
  .table_class ::v-deep.input_error .el-input__inner {
    border-color: #f56c6c;
  }
  .table_style {
    // margin-top: 16px;
    ::v-deep .el-table th {
      line-height: 0;
      color: $sec_ft_color;
    }
  }
}
</style>
