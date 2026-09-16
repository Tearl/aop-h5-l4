<template>
  <div class="aop_service_dic_page_piecewiseDetail">
    <PageDialog
      :dialogWidth="'80%'"
      :dialogVisiable="dialogVisible"
      dialogTitle="服务详情"
      @closeDialog="closeDialog"
      :apTobody="true"
      :customClass="'customClass'"
    >
      <div slot="box">
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
            <Message
              ref="httpRef"
              :detailInfo="detailInfo"
              type="http"
            ></Message>
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
      </div>
      <div slot="footer">
        <div class="btn_info" v-if="isDialog">
          <div class="btn" style="">
            <el-button @click="closeDialog">返回</el-button>
          </div>
        </div>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
// import TabsContent from "./components/tabsContent.vue";
import PageHeader from "@m/core/components/page_header";
import Info from "./components/info";
import Remark from "./components/remark";
import Protocol from "./components/protocol";
import Message from "./components/message";
import MessExam from "./components/messExam";
import PageDialog from "@m/core/components/page_dialog";
import { reList } from "@m/utils/paramTree";
export default {
  mixins: [mixin],
  components: {
    // TabsContent,
    PageHeader,
    Info,
    Remark,
    MessExam,
    Protocol,
    Message,
    PageDialog,
  },
  props: {
    isDialog: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      detailInfo: {},
      apiId: "",
      ataSetNo: "",
      dataSetDataId: "",
      type: "",
      dialogVisible: false,
    };
  },
  created() {},
  mounted() {
    // this.init();
  },
  methods: {
    init() {
      this.getDetail();
    },
    showDialog(data) {
      this.apiId = data.l5SvcId || data.apiId;
      this.getDetail();
      this.dialogVisible = true;
    },
    // 查询模块下用户信息
    async getDetail() {
      const params = {
        apiId: this.apiId,
      };
      const res = await this.rpc.dicmgmt.getApiDetail(params);
      this.detailInfo = res || {};
      const inputList = res.puApiParams.filter(
        (item) => item.paramDirection === "0"
      );
      const outputList = res.puApiParams.filter(
        (item) => item.paramDirection === "1"
      );
      this.$refs.reqRef.iInputList = reList(inputList);
      this.$refs.resRef.iOutputList = reList(outputList);
      this.$nextTick(() => {
        console.timeEnd("render耗时");
      });
    },
    closeDialog(){
      this.dialogVisible = false;
    }
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_service_dic_page_piecewiseDetail {
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
        &:nth-child(1) {
          margin-top: 0;
        }
      }
    }
    .btn_info {
      background: $base_white;
      padding: 20px 30px;
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.customClass{
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
        &:nth-child(1) {
          margin-top: 0;
        }
      }
    }
    .btn_info {
      background: $base_white;
      padding: 20px 30px;
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>