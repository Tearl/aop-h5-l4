<template>
  <div class="aop_tradedesign_page_d4workbench_workbench_trans_edit">
    <!-- 页签 -->
    <div class="application_detail_tabs">
      <div class="img_style">
        <img
          :src="require('@m/assets/images/icon_asset_back.png')"
          alt=""
          class="icon_back"
        />
      </div>
      <div class="application_detail_tabs_label_area">
        <div class="content_title">
          <div class="func_title">{{ functionInfo.modelName }}</div>
          <span
            :class="['status', `status_${functionInfo.functionOverallStatus}`]"
            >{{ publishStatus[functionInfo.functionOverallStatus] }}</span
          >
          <!-- <span class="status status_other">{{
            functionInfo.jobId
          }}</span> -->
          <span class="status status_other">{{
            functionInfo.competitorId
          }}</span>
          <span class="status status_other">{{
            functionInfo.abiLabelName
          }}</span>
        </div>
        <div class="btn_style">
          <el-button
            type="primary"
            @click="doOperate('commit')"
            size="mini"
            :disabled="editFlag"
            >保存</el-button
          >
        </div>
      </div>
    </div>

    <div class="content">
      <Detail
        ref="detailRef"
        :authId="authId"
        :fnctCd="fnctCd"
        :jobNo="functionInfo.jobNo"
        :modelVersion="modelVersion"
        :apiId="svcId"
        pageType="read"
        pageMode="read"
        @doOperate="doOperate"
      ></Detail>
    </div>

    <PageFooter v-if="viewType == 'downReview'">
      <div slot="box">
        <el-button @click="notPass">不通过</el-button>
        <el-button @click="pass" type="primary">通 过</el-button>
      </div>
    </PageFooter>

    <!-- 验收不通过对话框 -->
    <ReviewDialog
      ref="reviewDialogRef"
      @confirmReview="confirmReview"
    ></ReviewDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { setSessionStorage } from "@m/utils/localStorage.js";
import Detail from "./components/download_design/indexUp";
import PageFooter from "@m/core/components/page_footer";
import ReviewDialog from "./components/download_design/components/reviewDialog";

export default {
  mixins: [mixin],
  components: {
    Detail,
    PageFooter,
    ReviewDialog,
  },
  provide() {
    return {};
  },
  data() {
    return {
      publishStatus: {
        "00": "待分配",
        "01": "设计中",
        "02": "待评审",
        "03": "待一确",
        "04": "待二确",
        "05": "已登记",
      },
      fnctCd: "", //功能编码
      authId: "", // 授权ID
      jobNo: "", //作业号
      modelVersion: "", //功能版本
      competitorId: "", //标品ID
      status: "", //状态
      viewType: "", //页面类型 downReview-评审
      functionInfo: {}, // 功能信息
      svcId: "", //交易Id
      editFlag: false, //是否为编辑状态
    };
  },
  computed: {},
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.fnctCd = this.$route.query.funcCd || "";
      this.authId = this.$route.query.isolateWorkspace || "";
      this.modelVersion = this.$route.query.modelVersion || "";
      this.viewType = this.$route.query.viewType || "func";
      this.svcId = this.$route.query.apiId || "";
      this.competitorId = this.$route.query.competitorId || "";
      // this.getServList();
      this.getDetail();
      setSessionStorage("transRouter","")
    },
    async getServList() {
      const params = {
        authId: this.authId,
        fnctCd: this.fnctCd,
        jobNo: this.functionInfo.jobNo,
      };
      const res = await this.rpc.d4.getFuncServList(params);
    },
    async getDetail() {
      const params = {
        isolateWorkspace: this.authId,
        admiId: this.fnctCd,
        modelVersion: this.modelVersion,
      };
      const res = await this.rpc.d4.getFuncDetail(params);
      this.functionInfo = res;
      setSessionStorage("func-bizLineId", this.functionInfo.bizType);
      setSessionStorage("func-info", JSON.stringify(this.functionInfo));
      this.$forceUpdate();
    },
    /**
     * 响应按钮操作
     * @param {String} operate 操作
     * @param {Object} scope 操作数据对象
     */
    doOperate(operate, scope) {
      console.log("doOperate", operate, scope);
      switch (operate) {
        case "commit":
          this.commit()
          break;
        case "arrange":
          setSessionStorage("transRouter",this.$route.fullPath)
          this.$router.push({
            path: "/aop_tradedesign/d4workbench/design",
            query: {
              authId: this.authId,
              fnctCd: this.fnctCd,
              detailType: "download",
              jobNo: this.functionInfo.jobNo,
              fnctNm: this.functionInfo.modelName,
              bizLineId: this.functionInfo.bizType,
              transId: this.svcId,
              competitorId: this.competitorId,
              beltLineNm: this.functionInfo.bizTypeName,
            },
          });
          break;
      }
    },
    async commit() {
      const params = {
        apiId: this.svcId,
        assetId: this.fnctCd,
      }
      const res = await this.rpc.downloadDesign.getTransRelation(params)
      if(res.related) {
        this.$confirm("已被其他资产关联使用，请确认是否修改").then((res) => {
          this.$refs.detailRef.handleConfirm();
        });
      }else {
        this.$refs.detailRef.handleConfirm();
      }
    },
    async confirmReview(isPass = true, rarRejectReason) {
      const params = {
        admiId: this.fnctCd,
        version: this.modelVersion,
        isolateWorkspace: this.authId,
        rarType: "01", // 00:上装，01:下装
        isPass: isPass,
        rarRejectReason: rarRejectReason,
      };
      await this.rpc.d4.reviewDownDeisgn(params);
      this.$notify({
        title: "成功",
        message: "提交成功",
        duration: 2000,
        type: "success",
      });
      this.$router.push({
        path: "/aop_endentry/t2/list",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_d4workbench_workbench_trans_edit {
  height: calc(100vh - 58px);
  overflow: auto;
  .application_detail_tabs {
    background: #ffffff;
    margin-bottom: 12px;
    position: relative;
    display: flex;
    padding: 10px 18px;
    display: flex;
    padding: 10px 18px;
    position: fixed;
    top: 47px;
    z-index: 1000;
    width: 100%;
    .img_style {
      cursor: pointer;
      img {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        margin-top: 5px;
      }
    }

    .application_detail_tabs_label_area {
      display: flex;
      flex: 1;
      justify-content: space-between;
      align-items: center;

      .icon_back {
        width: 16px;
        height: 16px;
        margin-right: 12px;
        cursor: pointer;
      }
      .content_title {
        display: flex;
        flex: 1;
        justify-content: flex-start;
        .func_title {
          font-size: 16px;
          color: $pri_ft_color;
          font-weight: $font_weight_600;
          margin-right: 4px;
        }
        .status {
          line-height: 18px;
          font-size: 12px;
          padding: 2px 12px;
          margin-left: 8px;
          border-radius: 2px;
          line-height: 20px;
          text-align: center;
        }
        .status_01 {
          color: #ff9104;
          background: #fff4e5;
          border: 0.5px solid #ff9104;
        }
        // .status_02 {
        //   color: #ff5f5f;
        //   background: #ffefee;
        //   border: 0.5px solid #ff5f5f;
        // }
        .status_05 {
          color: #358aff;
          background: #f2f8ff;
          border: 0.5px solid #358aff;
        }
        .status_00,
        .status_02,
        .status_03,
        .status_04 {
          color: #36d542;
          background: #e5ffe7;
          border: 0.5px solid #36d542;
        }
        // .status_05 {
        //   color: #5d36d5;
        //   background: #e6e5ff;
        //   border: 0.5px solid #5d36d5;
        // }
        .status_other {
          background: #f5f5f5;
          border: 0.5px solid #d9d9d9;
          color: #555;
        }
      }
    }
  }
  .content {
    margin: 0 14px;
    margin-top: 62px;
  }
  .btn_style {
    @include mini_button_common;
    /deep/ .el-button {
      border-radius: 2px;
    }
  }
}
</style>