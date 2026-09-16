<template>
  <div class="serviceDetail_page">
    <div class="content_serviceDetail">
      <div class="detail_info">
        <div class="title">基本信息</div>
        <div class="content">
          <div class="detail_list">
            <div class="item">
              <span class="content_title">服务名称：</span>
              <span class="content_info">{{ detailInfo.apiName ||detailInfo.svcNm}}</span>
            </div>
          </div>
          <div class="detail_list">
            <div class="item">
              <span class="content_title">服务ID：</span>
              <span class="content_info">{{ apiId || detailInfo.apiCode ||detailInfo.svcCd}}</span>
            </div>
          </div>
          <div class="detail_list">
            <div class="item">
              <span class="content_title">服务类型：</span>
              <span class="content_info">{{ detailInfo.apiServiceType||detailInfo.svcTpCd }}</span>
            </div>
          </div>
          <div class="detail_list_bottom">
            <div class="bottom_content">
              <span class="content_title">服务描述：</span>
              <span v-html="detailInfo.apiDesc || detailInfo.svcDesc" class="content_info"></span>
            </div>
          </div>
        </div>
        <div class="detail_list_bottom"></div>
      </div>
      <div class="detail_info">
        <div class="title">输入参数</div>
        <div class="data_list">
          <Table
            class="table_style"
            :data="iInputList"
            :table="iInputListTable"
            :rowK="'paramOrder'"
            :treeProps="{ children: 'children' }"
          ></Table>
        </div>
      </div>
      <div class="detail_info">
        <div class="title">输出参数</div>
        <div class="data_list">
          <Table
            class="table_style"
            :data="iOutputList"
            :table="iOutputListTable"
            :rowK="'paramOrder'"
            :treeProps="{ children: 'children' }"
          ></Table>
        </div>
      </div>
      <div class="detail_info">
        <div class="title">规则表</div>
        <div class="data_list">
          <RuleTable
            ref="ruleTableRef"
            :pageType="'read'"
            :ruleInfo="ruleInfo"
            :currentServObj="currentServObj"
          ></RuleTable>
        </div>
        <div class="rules_text">业务规则</div>
        <div class="text_rules">{{ ruleComnt }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table";
import { reList } from "@m/utils/paramTree";
import RuleTable from "@m/core/components/rule_table";
export default {
  mixins: [mixin],
  components: {
    Table,
    RuleTable,
  },
  props: {},
  data() {
    return {
      detailInfo: {},
      currentServObj: {},
      ruleList: [],
      iInputList: [], // 数据输入列表
      iOutputList: [], // 数据输出列表
      // 数据输入列表参数
      // iInputListTable: [
      //   {
      //     prop: "paramKey",
      //     label: "参数Key",
      //     width: "200px",
      //     type: "text",
      //   },
      //   {
      //     prop: "paramCName",
      //     label: "参数名称",
      //     type: "text",
      //   },
      //   {
      //     prop: "paramValueType",
      //     label: "参数值类型",
      //     type: "text",
      //   },
      //   {
      //     prop: "paramLength",
      //     label: "参数长度",
      //     type: "text",
      //   },
      //   {
      //     prop: "isNeed",
      //     label: "是否必输",
      //     type: "text",
      //     filter: "isFilter",
      //   },
      //   {
      //     prop: "paramValue",
      //     label: "默认值",
      //     type: "text",
      //   },
      //   {
      //     prop: "paramDesc",
      //     label: "参数描述",
      //     type: "text",
      //   },
      //   {
      //     prop: "checkPattern",
      //     label: "枚举值",
      //     type: "text",
      //   },
      // ],
      iInputListTable: [
        {
          prop: "paramKey",
          label: "参数Key",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramName",
          label: "参数名称",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramType",
          label: "参数类型",
          minWidth: "15%",
          type: "text",
          tooltip: true,
        },
        // {
        //   // prop: "apSource", // 当前交易00 L5服务20
        //   prop: "actionName",
        //   label: "来源",
        //   minWidth: "20%",
        //   type: "text",
        //   tooltip: true,
        // },
        // {
        //   prop: "paraMapgNm",
        //   label: "来源值",
        //   minWidth: "20%",
        //   type: "text",
        //   tooltip: true,
        // },
        {
          prop: "isNeed",
          label: "是否必输",
          minWidth: "15%",
          type: "text",
          tooltip: true,
          align: "center",
          filter: "paraNed",
        },
        {
          // prop: "paraMapgNm",
          prop: "paramValue",
          label: "缺省值",
          minWidth: "15%",
          type: "text",
          align: "center",
        },
      ],
      // 数据输出列表参数
      // iOutputListTable: [
      //   {
      //     prop: "paramKey",
      //     label: "参数Key",
      //     width: "200px",
      //     type: "text",
      //   },
      //   {
      //     prop: "paramCName",
      //     label: "参数名称",
      //     type: "text",
      //   },
      //   {
      //     prop: "paramValueType",
      //     label: "参数值类型",
      //     type: "text",
      //   },
      //   {
      //     prop: "paramLength",
      //     label: "参数长度",
      //     type: "text",
      //   },
      //   {
      //     prop: "isNeed",
      //     label: "是否必输",
      //     type: "text",
      //     filter: "isFilter",
      //   },
      //   {
      //     prop: "paramValue",
      //     label: "默认值",
      //     type: "text",
      //   },
      //   {
      //     prop: "paramDesc",
      //     label: "参数描述",
      //     type: "text",
      //   },
      //   {
      //     prop: "checkPattern",
      //     label: "枚举值",
      //     type: "text",
      //   },
      // ],
      iOutputListTable: [
        {
          prop: "paramKey",
          label: "参数Key",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramName",
          label: "参数名称",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramType",
          label: "参数类型",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          // prop: "paraMapgNm",
          prop: "paramValue",
          label: "缺省值",
          minWidth: "15%",
          type: "text",
          align: "center",
        },
        // {
        //   prop: "isNeed",
        //   label: "是否必输",
        //   minWidth: "20%",
        //   type: "text",
        //   tooltip: true,
        //   align: "center",
        //   filter: "paraNed",
        // },
      ],
      ruleComnt: "",
      ruleInfo:{},
      apiId:"",
      bizDomainNo:""
    };
  },
  created() {
    this.bizDomainNo = this.$route.query.bizLineId || ""
  },
  mounted() {},
  methods: {
    showDialog() {},
    async getL5SerDetail(data) {
      this.apiId = data.l5SvcId
      // console.log(this.currentL5servObj,data, "getL5SerDetail");
      const params = {
        apiId: data.l5SvcId,
        d4StusCd: "1",
        blngtoTyp: "10",
        d4bApiId:data.transId,
        bizDomainNo:this.bizDomainNo
      };
      // const res = await this.rpc.dicmgmtDefine.getApiDetail(params);
      const res = await this.rpc.d4.queryL5ParamAndRuleDefinitions(params);
      this.detailInfo = res;
      this.iInputList = reList(
        res.paramList.filter((item) => item.paramDirection == 0)
      );
      this.iOutputList = reList(
        res.paramList.filter((item) => item.paramDirection == 1)
      );
      this.ruleComnt = res.ruleComnt;
      this.$nextTick(() =>{
        this.ruleInfo = res;
        const that = this.$refs.ruleTableRef;
        that.setRuleInfo(res);
      })
      // this.getBusinessRuleInfo(this.detailInfo);
    },
    async getBusinessRuleInfo(data) {
      this.ruleInfo = {};
      const params = {
        apiId: data.apiId,
      };
      const res = await this.rpc.d4.getBusinessRuleInfo(params);
      // this.$nextTick(()=>{
      //   this.ruleInfo = res;
      // })
      this.ruleInfo = res;
      this.ruleComnt = res.ruleComnt;
      // this.$set(this.ruleInfo,"ruleComnt",res.ruleComnt)
      const that = this.$refs.ruleTableRef;
      that.setRuleInfo(res);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.serviceDetail_page {
  padding: 0 24px;
  .title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    margin-bottom: 16px;
  }
  .content_title {
    font-family: $font_regular;
    font-size: 14px;
    letter-spacing: 0;
    color: #999999;
  }
  .content_serviceDetail {
    .detail_info {
      margin-bottom: 16px;
      .content {
        .detail_list {
          display: flex;
          margin-bottom: 16px;
          .item {
            width: 33%;
            display: flex;
            color: $sec_ft_color;
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
    }
  }
  .rules_text {
    margin-top: 16px;
  }
  .text_rules {
    margin-bottom: 40px;
  }
}
</style>
