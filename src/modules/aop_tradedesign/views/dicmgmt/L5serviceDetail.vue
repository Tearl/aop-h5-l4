<template>
  <div class="aop_tradedesign_dic_page_piecewiseDetail">
    <PageHeader
      v-if="isDialog"
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <div class="content_serviceDetail">
      <div class="detail_info">
        <div class="title">基本信息</div>
        <div class="content">
          <div class="detail_list">
            <div class="item">
              <span class="content_title">服务名称：</span>
              <span class="content_info">{{
                detailInfo.apiName || detailInfo.svcNm
              }}</span>
            </div>
          </div>
          <div class="detail_list">
            <div class="item">
              <span class="content_title">服务ID：</span>
              <span class="content_info">{{
                apiId||detailInfo.apiId 
              }}</span>
            </div>
          </div>
          <div class="detail_list">
            <div class="item">
              <span class="content_title">服务类型：</span>
              <span class="content_info">{{
                (detailInfo.apiServiceType || detailInfo.svcTpCd).substr(-4)
              }}</span>
            </div>
          </div>
        </div>
        <div class="detail_list_bottom">
          <div class="bottom_content">
            <span class="content_title">服务描述：</span>
            <span
              v-html="detailInfo.apiDesc || detailInfo.svcDesc"
              class="content_info"
            ></span>
          </div>
        </div>
        <!-- <div class="detail_list_bottom"></div> -->
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
            ref="bizRuleRef"
            :pageType="'read'"
            :ruleInfo="ruleInfo"
            :currentServObj="currentServObj"
          ></RuleTable>
        </div>
        <div class="rules_text">业务规则：</div>
        <div class="text_rules">{{ ruleComnt }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import PageHeader from "@m/core/components/page_header";
import { reList } from "@m/utils/paramTree";
import RuleTable from "@m/core/components/rule_table";
import Table from "@m/core/components/page_table";
export default {
  mixins: [mixin],
  components: {
    PageHeader,
    RuleTable,
    Table,
  },
  props: {
    isDialog: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    breadcrumbs() {
      if (this.type == "dataSetDetail") {
        return [
          {
            label: "字典管理",
            operate: "list",
          },
          {
            label: "数据集详情",
            operate: "dataSetDetail",
          },
          {
            label: "服务详情",
          },
        ];
      } else if (this.type == "editDataSet") {
        return [
          {
            label: "字典管理",
            operate: "list",
          },
          {
            label: "编辑数据集",
            operate: "dataSetEdit",
          },
          {
            label: "服务详情",
          },
        ];
      } else if (this.type == "detail" || this.type == "edit") {
        return [
          {
            label: "字典管理",
            operate: "list",
          },
          {
            label: "分段详情",
            operate: "substnDetil",
          },
          {
            label: "服务详情",
          },
        ];
      } else if (this.type == "editSub") {
        return [
          {
            label: "字典管理",
            operate: "list",
          },
          {
            label: "编辑分段",
            operate: "editSub",
          },
          {
            label: "服务详情",
          },
        ];
      } else if (this.type == "tableDetail") {
        return [
          {
            label: "字典管理",
            operate: "list",
          },
          {
            label: "服务详情",
          },
        ]
      }
    },
  },
  data() {
    return {
      detailInfo: {},
      apiId: "",
      ataSetNo: "",
      dataSetDataId: "",
      type: "",
      iInputList: [], // 数据输入列表
      iOutputList: [], // 数据输出列表
      ruleComnt: "",
      ruleInfo: {},
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
      ],
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
      editDatasetType:""
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  // destroyed(){
  //   sessionStorage.removeItem("dataSetInfo")
  // },
  methods: {
    init() {
      this.apiId = this.$route.query.apiId;
      this.dataSetNo = this.$route.query.dataSetNo;
      this.dataSubstnNo = this.$route.query.dataSubstnNo || "";
      this.type = this.$route.query.type || "";
      this.editDatasetType = this.$route.query.editDatasetType || "";
      this.getDetail();
    },
    labelClick(e) {
      if (e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list",
        });
      } else if (e == "dataSetDetail") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/dataDetail",
          query: {
            dataSetNo: this.dataSetNo,
          },
        });
      } else if (e == "dataSetEdit") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editDataSet",
          query: {
            dataSetNo: this.dataSetNo,
            editDatasetType:this.editDatasetType
          },
        });
      } else if (e == "substnDetil") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/piecewiseDetail",
          query: {
            dataSetNo: this.dataSetNo,
            dataSubstnNo: this.dataSubstnNo,
            type: this.type,
          },
        });
      } else if (e == "editSub") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editSubstn",
          query: {
            dataSubstnNo: this.dataSubstnNo,
            dataSetNo: this.dataSetNo,
            type: this.type,
          },
        });
      } else {
        this.$router.go(-1);
      }
    },
    // 查询模块下用户信息
    async getDetail() {
      const params = {
        apiId: this.apiId,
      };
      const res = await this.rpc.dicmgmt.getApiDetail(params);
      this.detailInfo = res || {};
      this.iInputList = reList(
        res.puApiParams.filter((item) => item.paramDirection == 0)
      );
      this.iInputList = this.iInputList.sort((a,b) => a.paramOrder - b.paramOrder)
      this.iOutputList = reList(
        res.puApiParams.filter((item) => item.paramDirection == 1)
      );
      this.iOutputList = this.iOutputList.sort((a,b) => a.paramOrder - b.paramOrder)
      // this.ruleComnt = res.ruleComnt;
      this.$nextTick(() =>{
        // this.ruleInfo = res;
        // const that = this.$refs.ruleTableRef;
        // that.setRuleInfo(res);
        this.getBusinessRuleInfo(res)
      })
      // this.$refs.reqRef.iInputList = reList(inputList);
      // this.$refs.resRef.iOutputList = reList(outputList);
      this.$nextTick(() => {
        console.timeEnd("render耗时");
      });
    },
    async getBusinessRuleInfo(data) {
      this.ruleInfo = {};
      const params = {
        apiId: data.svcId || data.apiId,
      };
      const res = await this.rpc.dicmgmt.getBusinessRuleInfo(params);
      this.ruleComnt = res.ruleComnt;
      const that = this.$refs.bizRuleRef;
      that.setRuleInfo(res);
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_page_piecewiseDetail {
  // padding: 0 24px;
  // background-color: #ffffff;
  .title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .content_title {
    font-family: $font_regular;
    // font-size: 14px;
    letter-spacing: 0;
    color: #999999;
  }
  .content_serviceDetail {
    .detail_info {
      margin-bottom: 16px;
      padding: 20px 30px;
      margin: 16px;
      background-color: #ffffff;
      .content {
        display: flex;
        .detail_list {
          width: 33%;
          display: flex;
          margin-bottom: 16px;
          .item {
            // width: 33%;
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
      }
      .rules_text{
        margin-top: 10px;
      }
      .detail_list_bottom {
        // margin-top: 16px;
        border-top: 1px solid #e7e7ee;
        .bottom_content {
          color: $sec_ft_color;
          padding: 16px 0;
          .content_info {
            color: #333330;
          }
        }
      }
    }
  }
}
</style>