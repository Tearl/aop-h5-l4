<template>
  <div class="aop_tradedesign_dic_page_piecewiseDetail">
    <PageHeader
      v-if="isDialog"
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <div class="detail_container">
      <div class="detail_content">
        <!-- 基本信息 -->
        <div class="content_header_title nav_title">基本信息</div>
        <Info :detailInfo="detailInfo" @goToScene="goToScene"></Info>
      </div>
      <div class="detail_content">
        <!-- API作用 -->
        <div class="content_header_title nav_title">服务作用</div>
        <Remark :detailInfo="detailInfo"></Remark>
      </div>
      <div class="detail_content" v-if="isShow">
        <!-- 协议信息 -->
        <div class="content_header_title nav_title">协议信息</div>
        <Protocol :detailInfo="detailInfo"></Protocol>
      </div>
      <div class="detail_content" v-if="isShow">
        <!-- HTTP请求头 -->
        <div class="content_header_title nav_title">HTTP请求头</div>
        <Message ref="httpRef" :detailInfo="detailInfo" type="http"></Message>
      </div>
      <div class="detail_content">
        <!-- 输入报文 -->
        <div class="content_header_title nav_title">输入报文</div>
        <Message ref="reqRef" :detailInfo="detailInfo" type="req"></Message>
      </div>
      <div class="detail_content">
        <!-- 输出报文 -->
        <div class="content_header_title nav_title">输出报文</div>
        <Message ref="resRef" :detailInfo="detailInfo" type="res"></Message>
      </div>
      <div class="detail_content">
        <!-- 样例报文 -->
        <div class="content_header_title nav_title">样例报文</div>
        <MessExam :detailInfo="detailInfo"></MessExam>
      </div>
      <div class="btn_info" v-if="isDialog">
      <!-- <div class="btn" style="">
        <el-button @click="labelClick('back')">返回</el-button>
      </div> -->
    </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import TabsContent from './components/tabsContent.vue';
import PageHeader from "@m/core/components/page_header";
import Info from "./components/info";
import Remark from "./components/remark";
import Protocol from "./components/protocol";
import Message from "./components/message";
import MessExam from "./components/messExam";
import {reList} from "@m/utils/paramTree";
export default {
  mixins: [mixin],
  components: {
    TabsContent,
    PageHeader,
    Info,
    Remark,
    MessExam,
    Protocol,
    Message,
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
      } else if(this.type == "editDataSet") {
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
      } else if(this.type == "detail" || this.type == "edit"){
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
      }else if(this.type == "editSub"){
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
      // breadcrumbs: [
      //   {
      //     label: "字典管理",
      //     operate: "list",
      //   },
      //   {
      //     label: "服务详情",
      //   },
      // ],
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.apiId = this.$route.query.apiId;
      this.dataSetNo = this.$route.query.dataSetNo;
      this.dataSubstnNo = this.$route.query.dataSubstnNo || ""
      this.type = this.$route.query.type || "";
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
          },
        });
      } else if ( e == "substnDetil") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/piecewiseDetail",
          query: {
            dataSetNo: this.dataSetNo,
            dataSubstnNo: this.dataSubstnNo,
            type: this.type
          },
        });
      }else if (e== "editSub") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editSubstn",
          query: {
            dataSubstnNo: this.dataSubstnNo,
            dataSetNo: this.dataSetNo,
            type: this.type
          },
        });
      } else {
        this.$router.go(-1)
      }
    },
    // 查询模块下用户信息
    async getDetail() {
      const params = {
        apiId: this.apiId,
      };
      const res = await this.rpc.dicmgmt.getApiDetail(params);
      this.detailInfo = res || {};
      const inputList = res.puApiParams.filter(item => item.paramDirection === "0");
      const outputList = res.puApiParams.filter(item => item.paramDirection === "1");
      this.$refs.reqRef.iInputList = reList(inputList);
      this.$refs.resRef.iOutputList = reList(outputList);
      this.$nextTick(() => {
        console.timeEnd('render耗时');
      });
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
  .detail_container {
    .detail_content {
      background: $base_white;
      padding: 20px 30px;
      margin: 16px;
      .content_header_title {
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
        margin-top: 20px;
        &:nth-child(1){
          margin-top: 0;
        }
      }
    }
    .btn_info{
      background: $base_white;
      padding: 20px 30px;
      margin-bottom: 20px;
      display:flex;
      justify-content: center;
    align-items: center;
    }
  }
}
</style>