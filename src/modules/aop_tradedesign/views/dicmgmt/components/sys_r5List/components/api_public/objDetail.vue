<template>
  <div class="aop_tradedesign_comps_apimgmt_api_public_obj_detail">
    <div class="create_content_wrapper">
      <div class="detail_content">
        <div class="content_header nav_title">{{ "基本信息" }}</div>
        <ul class="content_body">
          <li class="list_item">
            <span class="list_item_key">业务对象名称：</span>
            <span class="list_item_value">{{ formData.bsnObjNm }}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">业务对象ID：</span>
            <span class="list_item_value">{{ formData.bsnObjId }}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">业务对象英文名：</span>
            <span class="list_item_value">{{ formData.bsnObjCd }}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">所属领域：</span>
            <span class="list_item_value">{{ formData.domainNm }}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">服务类型：</span>
            <span class="list_item_value">{{ formData.servType }}</span>
          </li>
        </ul>
      </div>

      <div class="detail_content">
        <div class="content_header nav_title">属性列表</div>
        <Table
          class="table_style"
          :data="propList"
          :table="propListTable"
        ></Table>
      </div>
    </div>

    <PageFooter>
      <div slot="box">
        <!-- <el-button @click="handleCancel">取 消</el-button> -->
      </div>
    </PageFooter>
  </div>
</template>
<script>
import Table from "@m/core/components/page_table";
import PageFooter from "@m/core/components/page_footer";
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";

export default {
  mixins: [mixin],
  components: {
    Table,
    PageFooter,
  },
  props: {
    bsnObjId: {
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
      propList: [],
      // 添加输入参数列表参数
      propListTable: [
        {
          prop: "propId",
          label: "属性ID",
          width: "100",
          type: "text",
          tooltip: true,
        },
        {
          prop: "propNm",
          width: "160",
          label: "属性名称",
          type: "text",
        },
        {
          prop: "propCd",
          width: "120",
          label: "属性英文名称",
          type: "text",
          tooltip: true,
        },
        {
          prop: "propType",
          label: "属性来源",
          width: "100",
          type: "text",
          filter: "propType",
          tooltip: true,
        },
        {
          prop: "propGateg",
          label: "属性类型",
          width: "160",
          type: "text",
        },
      ],
      // 导航栏参数
      breadcrumbs: [
        {
          label: "业务对象",
          operate: "list",
        },
        {
          label: "查看业务对象",
        },
      ],
      // 表单数据
      formData: {
        bsnObjNm: "", // 参数名称
        bsnObjId: "", // 参数中文名称
        bsnObjCd: "", // 参数描述
        domainNm: "", // 所属分类
        servType: "", // 参数类型
      },
    };
  },
  methods: {
    handleCancel() {
      this.$emit("toApiViewObj")
    },
    // 进入编辑页面时查询详情
    async getDetail() {
      const params = {
        bsnObjId: this.bsnObjId,
      };
      const res = await this.rpc.systemmgmt.getBussinessobjDetail(params);
      this.formData = res;
      this.propList = res.propList;
    },
    //初始化
    init() {
      this.getDetail();
    },
  },
  mounted() {
    this.init();
  },
  created() {
    // this.init();
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_api_public_obj_detail {
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
