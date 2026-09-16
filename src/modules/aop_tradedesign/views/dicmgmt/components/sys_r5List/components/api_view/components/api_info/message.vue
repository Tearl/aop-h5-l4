<template>
  <div class="aop_tradedesign_comps_apimgmt_api_info_message">
    <div class="content_wrapper">
      <div class="detail_content">
        <div class="data_list" v-if="type=='http'">
          <!-- HTTP请求头 -->
          <Table
            class="table_style"
            :data="httpHeaderParams"
            rowK="paramOrder"
            :table="httpHeaderTable"
            :isBig="true"
          ></Table>
        </div>
        <div class="data_list" v-if="type=='req'">
          <!-- 输入报文 -->
          <Table
            class="table_style"
            :data="iInputList"
            rowK="paramOrder"
            :table="iInputListTable"
            :isBig="true"
          ></Table>
        </div>
        <div class="data_list" v-if="type=='res'">
          <!-- 输出报文 -->
          <Table
            class="table_style"
            :data="iOutputList"
            rowK="paramOrder"
            :table="iOutputListTable"
            :isBig="true"
          ></Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@m/utils/filters";
import { array2nested } from "@m/utils/array";
import Table from "@m/core/components/page_table";
export default {
  components: {
    Table
  },
  props: {
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      // 添加输入参数列表参数
      iInputListTable: [
        {
          prop: "paramKey",
          label: "参数Key",
          width: "200px",
          type: "text",
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
          type: "text",
        },
        {
          prop: "paramLength",
          label: "参数长度",
          type: "text",
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter"
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          type: "text",
        },
      ],
      // 添加参数输出列表参数
      iOutputListTable: [
        {
          prop: "paramKey",
          label: "参数Key",
          width: "200px",
          type: "text",
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
          type: "text",
        },
        {
          prop: "paramLength",
          label: "参数长度",
          type: "text",
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter"
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          type: "text",
        },
      ],
      //输入参数
      iInputList: [],
      //输出参数
      iOutputList: [],
      httpHeaderParams: [],
      httpHeaderTable: [
        {
          prop: "paramKey",
          label: "参数Key",
          width: "200px",
          type: "text",
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
          type: "text",
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter"
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          type: "text",
        },
      ]
    }
  },
  methods: {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_api_info_message {
  .detail_content {
    background: $base_white;
    margin-bottom: 16px;
  }
  .content_header,
  .content_header_title {
    font-family: $font_medium;
    font-size: 16px;
    color: $pri_ft_color;
    letter-spacing: 0;
  }
  .rules_text {
    margin-top: 16px;
  }
  .content_header_title {
    font-family: $font_medium;
    margin-top: 36px;
  }
  .content_info {
    margin-top: 24px;
    img {
      margin-bottom: 16px;
    }
  }
  .cotent_below {
    margin-top: 16px;
    background: $base_white;
    padding: 20px 32px 40px;
  }
  .data_list {
    font-family: $font_regular;
    font-size: 14px;
    color: $reg_ft_color;
    letter-spacing: 0;
    margin-top: 16px;
  }
  .table_style {
    margin-top: 16px;
    ::v-deep .el-table th {
      color: $sec_ft_color;
    }
  }
}
</style>
