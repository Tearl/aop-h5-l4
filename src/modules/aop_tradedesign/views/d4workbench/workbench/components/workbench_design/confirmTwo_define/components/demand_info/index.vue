<template>
  <div class="aop_tradedesign_comps_d4editor_service_define_demand_info">
    <div class="content_wrapper">
      <div class="content_read">
        <div class="detail_content">
          <div class="content_header nav_title_demand">基本信息</div>
          <div class="content">
            <div class="detail_list_left">
              <div class="left_content">
                <span>服务接口名称：</span>
                <span v-if="elemActive == '需求列表'" class="content_info">{{ currentR4bObj.svcNm }}</span>
                <el-select
                  v-else
                  clearable
                  size="mini"
                  v-model="currentSelect"
                  placeholder="请选择"
                  @change="currentSelectChange">
                  <el-option
                    v-for="item in demandOptions"
                    :key="item.svcId"
                    :label="item.svcNm"
                    :value="item.svcId">
                  </el-option>
                </el-select>
                
              </div>
            </div>
            <div class="detail_list_right">
              <div class="right_content">
                <span>接口号：</span>
                <span class="content_info">{{ currentR4bObj.svcId }}</span>
              </div>
            </div>
          </div>
          <div class="detail_list_bottom">
            <div class="bottom_content">
              <span>版本描述：</span>
              <span class="content_info">{{ currentR4bObj.versionDesc }}</span>
            </div>
          </div>
        </div>
        <!-- 业务规则 -->
        <div class="detail_content">
          <div class="content_header nav_title_demand">业务规则</div>
          <div class="rules_text">
            <CreateBizRule :bizType="pageType" ref="bizRuleRef"></CreateBizRule>
          </div>
        </div>
        <!-- 参数配置 -->
        <div class="detail_content">
          <div class="content_header nav_title_demand">参数配置</div>
          <div class="data_list">
            数据输入
            <Table
              class="table_style"
              :data="iInputList"
              :table="iInputListTable"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div>
          <div class="data_list">
            数据输出
            <Table
              class="table_style"
              :data="iOutputList"
              :table="iOutputListTable"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div>
        </div>
      </div>
    </div>
    <PageRightNav
      :itemList="itemList"
      parentClass=".process_middle"
      navClass=".nav_title_demand"
    ></PageRightNav>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Basic from "../../../../d4b_detail/basic";
import CreateBizRule from "./biz_rule";
import Table from "@m/core/components/page_table";
import PageRightNav from "@m/core/components/page_right_nav";
import {reList} from "@m/utils/paramTree";

export default {
  mixins: [mixin],
  components: {
    Basic,
    CreateBizRule,
    Table,
    PageRightNav,
  },
  props: {
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    currentR4bObj: {
      type: Object,
      default: () => ({}),
    },
    elemActive: {
      type: String,
      default: () => "D4b服务列表",
    },
  },
  data() {
    return {
      detailInfo: {},
      pageType: "read",
      itemList: [
        "基本信息",
        "业务规则",
        "参数配置",
      ],
      iInputList: [], // 数据输入列表,
      iOutputList: [], // 数据输出列表,
      // 数据输入列表参数
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
      // 数据输出列表参数
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
      r4bSvcList: [],
      demandOptions: [],
      currentSelect: "",
      currentR4bObj: {},
      reqSvcList: []
    };
  },
  methods: {
    // R4b服务下拉框
    async getR4bSelectList(data = {}) {
      const params = {
        fnctId: data.fnctId || "",
        d4bSvcId: data.d4bSvcId || "",
      }
      const res = await this.rpc.d4.getR4bSelectList(params)
    },
    async getR4bServiceDetail(data = {}) {
      const params = {
        r4bSvcId: data.r4bSvcId || "",
      }
      const res = await this.rpc.d4.getR4bServiceDetail(params)
      this.currentR4bObj = res
      this.$refs.bizRuleRef.businessRuleList = res.bizRuleList
      this.iInputList =  reList(res.puApiParams.filter((item) => item.paramDirection == 0));
      this.iOutputList = reList(res.puApiParams.filter((item) => item.paramDirection == 1));
    },
    currentSelectChange(e) {
      this.getR4bServiceDetail({
        r4bSvcId: this.currentSelect
      })
    },
    init(data) {
      this.demandOptions = data.demandOptions
      this.currentSelect = data.r4bSvcId
      if (data.r4bSvcId != "") {
        this.getR4bServiceDetail({
          r4bSvcId: data.r4bSvcId
        })
      }
    }
  },
  created() {
    // this.init()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4editor_service_define_demand_info {
  ::v-deep .el-form-item__label {
    text-align: left;
    vertical-align: middle;
    float: left;
    font-family: $font_regular;
    font-size: 14px;
    color: $pri_ft_color;
    letter-spacing: 0;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  ::v-deep .el-select .el-input__inner:focus,
  ::v-deep .el-textarea__inner:focus,
  ::v-deep .el-input__inner:focus {
    border-color: $pri_br_color;
  }
  .content_wrapper {
    font-family: $font_regular;
    .content_read {
      .content {
        display: flex;
        .detail_list_left,
        .detail_list_right {
          width: 50%;
        }
        .left_content,
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
      .detail_content {
        background: $base_white;
        padding: 20px 32px;
        margin-bottom: 16px;
        .data_list {
          margin-top: 14px;
        }
      }
      .content_header {
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
      }
      .rules_text {
        margin-top: 16px;
      }
      .content_info {
        margin-top: 24px;
        img {
          margin-bottom: 16px;
        }
      }
      ::v-deep .el-table {
        margin-top: 16px;
      }
      ::v-deep .el-table th {
        color: $sec_ft_color;
      }
    }
  }
  .content_detail_params ::v-deep.el-form-item__label::before {
    content: "" !important;
  }
}
</style>
