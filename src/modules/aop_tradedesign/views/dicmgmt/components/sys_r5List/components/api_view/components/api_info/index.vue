<template>
  <div class="aop_tradedesign_comps_apimgmt_api_info">
    <div class="detail_container">
      <div class="detail_content">
        <!-- 基本信息 -->
        <div class="content_header_title nav_title">基本信息</div>
        <Info :detailInfo="detailInfo" @goToScene="goToScene"></Info>
      </div>
      <div class="detail_content">
        <!-- API作用 -->
        <div class="content_header_title nav_title">API作用</div>
        <Remark :detailInfo="detailInfo"></Remark>
      </div>
      <div class="detail_content">
        <!-- 协议信息 -->
        <div class="content_header_title nav_title">协议信息</div>
        <Protocol :detailInfo="detailInfo"></Protocol>
      </div>
      <div class="detail_content">
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
    </div>

    <PageRightNav
      :itemList="itemList"
      :parentClass="'.view_wrapper'"
    ></PageRightNav>

    
    <PageFooter>
      <div slot="box">
        <el-button @click="handleCancel">返 回</el-button>
      </div>
    </PageFooter>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";

import Info from "./info";
import Remark from "./remark";
import Protocol from "./protocol";
import Message from "./message";
import MessExam from "./messExam";

import PageRightNav from "@m/core/components/page_right_nav";

import {reList} from "@m/utils/paramTree";
import PageFooter from "@m/core/components/page_footer";

export default {
  mixins: [mixin],
  props: {
    apiId: {
      type: String,
      default: () => "",
    },
  },
  components: {
    Info,
    Remark,
    Protocol,
    Message,
    MessExam,
    PageRightNav,
    PageFooter
  },
  data() {
    return {
      // 右侧导航栏参数
      itemList: [
        "基本信息",
        "API作用",
        "协议信息",
        "HTTP请求头",
        "输入报文",
        "输出报文",
        "样例报文"
      ],
      detailInfo: {},
    };
  },
  methods: {
    init() {
      this.getApiDetail();
    },
    // 查询详情
    async getApiDetail() {
      const params = {
        apiId: this.apiId,
      };
      const res = await this.rpc.apimgmt.getApiDetail(params);
      this.detailInfo = res;
      const inputList = res.puApiParams.filter(item => item.paramDirection === "0");
      const outputList = res.puApiParams.filter(item => item.paramDirection === "1");
      const httpHeaderParams = reList(res.httpHeaderParams);
      console.time('render耗时');
      this.$refs.reqRef.iInputList = reList(inputList);
      this.$refs.resRef.iOutputList = reList(outputList);
      this.$refs.httpRef.httpHeaderParams = httpHeaderParams;
      this.$nextTick(() => {
        console.timeEnd('render耗时');
      });
    },

    goToScene(e) {
      this.$emit("toCaseList",e)
    },
    handleCancel() {
      this.$emit("toApiList")
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_api_info {
  .detail_container {
    .detail_content {
      background: $base_white;
      padding: 20px 30px;
      margin-bottom: 20px;
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
  }
}
</style>