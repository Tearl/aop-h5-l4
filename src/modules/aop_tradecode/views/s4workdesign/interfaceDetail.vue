<template>
  <div class="aop_tradedesign_page_d4workbench_workbench_one_confirm">
    <!-- 页签 -->
    <div class="application_detail_tabs" v-if="showHeader">
      <div class="application_detail_tabs_label_area">
        <div class="img_style">
          <img
            @click="$router.back"
            :src="require('@m/assets/images/icon_cancle_h.png')"
            alt=""
            class="icon_close"
          />
        </div>
        <img
          :src="require('@m/assets/images/icon_fn_h.png')"
          alt=""
          class="icon_fn"
        />
        <img
          :src="require('@m/assets/images/icon_LOGO.png')"
          alt=""
          class="icon_logo"
        />
      </div>
    </div>

    <div class="content">
      <!-- 功能信息 -->
      <!-- 页签 -->
      <div class="content_header">
        <ServiceTabs
          :tabsList="tabsList"
          :defaultActive="defaultActive"
          @tabClick="handleTabClick"
        >
        </ServiceTabs>
      </div>
      <div class="record_btn_style" v-show="fourRAttrFlag">
        <el-button type="text" @click="handleBackBtn"> 返回</el-button>
      </div>
      <Detail
        v-show="defaultActive == 'basicTabs'"
        ref="detailRef"
        :authId="authId"
        :fnctCd="fnctCd"
        :jobNo="jobNo"
        :modelVersion="modelVersion"
        class="detail_content_box"
        pageType="read"
        pageMode="read"
        @doOperate="doOperate"
      ></Detail>
      <div v-show="defaultActive == 'processTabs'">
        <div class="process_contain_box">
          <div class="process_container flex_left">
            <!-- 画布 -->
            <div class="flow_pic">
              <!-- <ServiceFlowTabs
                :tabsList="flowTabsList"
                :defaultActive="flowDefaultActive"
                @tabClick="handleFlowTabClick"
              >
              </ServiceFlowTabs> -->
              <!-- 切换竖版页签 -->
              <div class="left_container">
                <div class="tab_item"
                 v-for="(item) in flowTabsList"
                  :key="item.k"
                  :class="flowDefaultActive == item.k?'tab_item_blue':''"
                  @click="handleFlowTabClick(item.k)">
                    {{ item.v }}
                </div>
             </div>
              <!-- <div>
                  <div>主流程</div>
                  <div>4b流程</div>
                </div> -->
            </div>
            <div class="process_middle">
              <Process
                ref="process"
                v-show="flowDefaultActive == '4bFlow'"
                class="process_main"
                pageType="d5Design"
                :dataObj="processDataObj"
                :isRead="true"
                @getAttrEvent="getAttrEvent"
                @getConditionEvent="getConditionEvent"
                @getSvgClickEvent="getSvgClickEvent"
                @handleActionChange="handleActionChange"
              >
              </Process>
              <mainProcess
                class="process_main"
                v-show="flowDefaultActive == 'mainFlow'"
                ref="process"
                :dataObj="mainFlowData"
                pageType="mainFlow"
                :isRead="true"
              >
              </mainProcess>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail_box" v-show="expend">
      <!-- 属性 -->
      <transition name="plus-icon">
        <Pattr
          v-show="expend"
          ref="pattr"
          class="process_right"
          :dicArray="dicArray"
          :isRead="true"
          :showTips="false"
          :chooseType="chooseType"
          :currentServObj="currentServObj"
          :currentParentCpnInfo="currentParentCpnInfo"
          @updateConditionEvent="updateConditionEvent"
          @upDateFlowParams="upDateFlowParams"
          @updateDataParams="updateDataParams"
          @handleClose="handleClose"
        ></Pattr>
      </transition>
      <div class="detail_background" @click="handleClose"></div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Detail from "./components/design_editor/service_define/components/interface_detail";
import PageFooter from "@m/core/components/page_footer";
import ServiceTabs from "@m/core/components/page_tabs";
import Pattr from "@m/core/components/process/attr";
import Process from "@m/core/components/process/comps";
import { unduplicatedByKeys } from "@m/utils/array";
import ServiceFlowTabs from "@m/views/workbench/components/design_editor/public/page_tabs";
import mainProcess from "@m/core/components/process/comps";
import { typeEnumObj } from "@m/utils/normalData.js";
import { escape2Html } from "@m/utils/html2e.js";
export default {
  mixins: [mixin],
  components: {
    Detail,
    PageFooter,
    ServiceTabs,
    Pattr,
    Process,
    ServiceFlowTabs,
    mainProcess,
  },
  props: {
    showHeader: {
      default: true,
      type: Boolean,
    },
    sendApiId: {
      type: String,
      default: "",
    }
  },
  provide() {
    return {};
  },
  data() {
    return {
      fnctCd: "", //功能编码
      authId: "", // 授权ID
      funcNm: "", //功能名称
      jobNo: "", //作业号
      modelVersion: "", //功能版本
      competitorId: "", //标品ID
      status: "", //状态
      viewType: "", //页面类型 downReview-评审
      functionInfo: {}, // 功能信息\
      //页签列表
      tabsList: [
        { v: "基本信息", k: "basicTabs" },
        { v: "业务流程", k: "processTabs" },
      ],
      defaultActive: "basicTabs",
      //页签列表
      flowTabsList: [
        { v: "主流程", k: "mainFlow" },
        { v: "4b流程", k: "4bFlow" },
      ],
      flowDefaultActive: "mainFlow",
      processDataObj: {},
      dicArray: [],
      apiId: "",
      defaultObj: {
        flow: [
          {
            cpntId: "",
            id: "inputAction1",
            referId: "inputAction",
            type: "inputAction",
            transition: [],
            conf: [
              {
                name: "actionDesc",
                value: "input",
              },
            ],
            paramList: [],
          },
          {
            cpntId: "",
            id: "outputAction2",
            referId: "outputAction",
            type: "outputAction",
            transition: [],
            conf: [
              {
                name: "actionDesc",
                value: "output",
              },
            ],
            paramList: [],
          },
        ],
        position:
          "{&quot;inputAction1&quot;:&quot;197.1092529296875 66.00421142578125 100 48&quot;,&quot;outputAction2&quot;:&quot;198.1092529296875 249.00421142578125 100 48&quot;}",
      },
      chooseType: "serv",
      expend: false, //展开属性面板
      midWidth: 1671,
      currentServObj: {},
      getAttrEventTimer: "",
      currentD4bObj: {},
      currentParentCpnInfo: {}, //父组件的信息（4R、循环、异步）
      fourRAttrFlag: false, //是否双击4R组件
      /* 流程图相关变量 */
      mainFlowData: {},
    };
  },
  computed: {},
  created() {
    this.init();
  },
  watch: {
    sendApiId() {
      this.apiId = this.sendApiId;
      this.getD4bServiceInfo();
      this.getDataProcess();
      this.getMainFlow();
    }
  },
  provide() {
    return {
      getDataList: this.getDataList,
    };
  },
  mounted() {},
  methods: {
    init() {
      this.apiId = this.$route.query.apiId || this.sendApiId;

      if (this.apiId) {
        this.getD4bServiceInfo();
        this.getDataProcess();
        this.getMainFlow();
      }

    },
    getDataList(reference = false) {
      if (reference) {
        return this.$refs.process.dataList;
      } else {
        return JSON.parse(JSON.stringify(this.$refs.process.dataList));
      }
    },
    // 查询D4b服务详情
    async getD4bServiceInfo() {
      console.log("查详情", this.currentD4bObj);
      const res = await this.rpc.d4.getD4bServiceInfo({
        svcId: this.apiId,
        fnctId: "",
        dsgnFlg: "1",
      });
      this.$refs.detailRef.basicData = res;
    },
    //流程图
    async getDataProcess() {
      const data = {
        apiId: this.apiId,
        blngtoTyp: "00",
        d4StusCd: "1",
        deployFlg: "0",
      };
      const res = await this.rpc.d4.getServiceDesignDetail(data);
      this.getAllData(res);
      this.currentServObj = res;
      this.currentServObj.svcId = res.apiId;
    },
    async getMainFlow() {
      let res = await this.rpc.newEditor.queryMainFlow({
        svcId: this.apiId,
      });
      this.getFlowAllData(res);
    },
    /**
     * 主流程图数据处理
     */
    getFlowAllData(val) {
      const position = val.flow.reduce((prev, data, index) => {
        const type = typeEnumObj[data.type];
        const actionId = `${type}${index + 1}`;
        prev[actionId] = `300 ${50 + index * 80} 100 150`;
        data.id = data.referId = actionId;
        data.type = type;
        return prev;
      }, {});
      const dataObj = {
        flow: val.flow,
        position: escape2Html(JSON.stringify(position)),
      };
      this.mainFlowData = JSON.parse(JSON.stringify(dataObj));
    },
    //画布获取组件参数
    getAttrEvent(e, click) {
      if (this.getAttrEventTimer) {
        clearTimeout(this.getAttrEventTimer);
      }
      this.getAttrEventTimer = setTimeout(() => {
        this.chooseType = "action";
        this.expend = true;
        this.$refs.pattr.getAttr(e, click);
      }, 200);
    },
    async handleActionChange(e) {
      clearTimeout(this.getAttrEventTimer);
      const dataList = this.getDataList();
      this.currentD4bObj = e;
      this.currentD4bObj.svcId = e.compositeId;
      this.currentParentCpnInfo = { ...e, dataList };
      this.$refs.pattr.get4RFlowParams(this.currentD4bObj);
      this.fourRAttrFlag = true;
      //获取组件流程图信息
      const params = {
        cpntPId: e.compositeId,
      };
      const res = await this.rpc.newEditor.queryMainFlow(params);
      this.getAllData(res);
      // this.getServiceArrangeList();
    },
    //画布条件
    getConditionEvent(e) {
      this.$refs.pattr.getCondition(e);
    },
    //点击画布空白
    getSvgClickEvent(e) {
      console.log("点击空白");
      if (
        ["loopAction", "asyncAction", "4RAction"].includes(
          this.currentParentCpnInfo.actionType
        )
      ) {
        this.chooseType = "action";
        this.expend = true;
        this.$refs.pattr.getAttr(this.currentParentCpnInfo);
      } else {
        this.chooseType = "serv";
        this.expend = true;
        if (e.flow.length !== 0) {
          this.$refs.pattr.getFlowParams(this.processDataObj);
        }
      }
    },
    //更新线条条件
    updateConditionEvent(e) {
      this.$refs.process.updateCondition(e);
    },
    //更新flow参数
    upDateFlowParams(e) {
      this.processDataObj.paramList = e.paramList;
      this.processDataObj.input = e.input;
      this.processDataObj.output = e.output;
    },
    // 更新dataList
    updateDataParams(e) {
      this.$refs.process.updateDataParams(e);
    },
    //获取参数或配置默认参数
    getAllData(val) {
      if (val.flow.length == 0) {
        val.flow = this.defaultObj.flow;
        val.position = this.defaultObj.position;
      }
      if (this.isProcessTemp) {
        val.flow = this.tempProcessObj.flow;
        val.position = this.tempProcessObj.position;
      }
      this.processDataObj = val;
      if (!this.fourRAttrFlag) {
        this.$refs.pattr.getFlowParams(this.processDataObj);
      }
      // this.mixDic();
    },
    //组合字典
    mixDic() {
      const d = this.processDataObj.puApiParams
        .map((item) => {
          return {
            paraNm: item.paraNm,
            paraNo: item.paraNo,
            paraId: item.paraId,
            paraPareId: item.paraPareId,
            paraPosition: item.paraPosition,
          };
        })
        .filter((item) => item.paraPosition == 0);
      this.dicArray = unduplicatedByKeys(d, [
        "paraId",
        "paraPareId",
        "paraPosition",
      ]);
    },
    handleTabClick(e) {
      this.defaultActive = e.name;
      console.log("E", e);
    },
    handleFlowTabClick(e) {
      this.flowDefaultActive = e;
      console.log("E", e);
    },
    confirm() {
      this.$refs.commitDialogRef.showDialog();
      // this.$confirm("确定提交吗？").then((res) => {
      //   // this.confirmReview();
      // });
    },
    async confirmReview(isPass = true, rarRejectReason) {
      const params = {
        admiId: this.fnctCd,
        version: this.modelVersion,
        isolateWorkspace: this.authId,
        rarType: "01", // 00:前端，01:后端
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
    problemRecord() {
      this.$refs.probRecordRef.showDialog();
    },
    confirmProblem(data) {
      if (this.chooseType == "serv") {
        // 点击的是服务的问题记录
      } else {
        // 提交的是组件的问题记录
      }
    },
    commitAsset() {},
    designDetail() {},
    handleClose() {
      this.expend = false;
    },
    // 返回服务的流程图
    handleBackBtn() {
      console.log("返回流程图");
      this.fourRAttrFlag = false;
      this.currentParentCpnInfo = {};
      this.refreshFlow();
    },
    async refreshFlow() {
      // 刷新流程图
      if (this.fourRAttrFlag) {
        // 在子流程内
        const res = await this.rpc.d4.getFlowdata({
          cpntPId: this.currentD4bObj.compositeId,
        });
        this.getAllData(res);
        // this.getServiceArrangeList();
      } else {
        this.expend = false;
        this.getD4bServiceInfo();
        this.getDataProcess();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_d4workbench_workbench_one_confirm {
  overflow: hidden;
  height: 100vh;
  .application_detail_tabs {
    background: #ffffff;
    margin-bottom: 12px;
    height: 48px;
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    box-shadow: 0 1px 10px 0 #e7e7e7;
    z-index: 100;
    .btn_style {
      /deep/ .el-button {
        height: 30px;
        line-height: 5px;
        border-radius: 2px;
        padding: 2px 14px;
        font-size: 14px;
      }
    }

    .application_detail_tabs_label_area {
      display: flex;
      align-items: center;

      .page_type_title {
        font-family: $font_regular;
        font-size: 14px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
        margin-right: 6px;
      }
      .fnc_Nm {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: $reg_ft_color;
        letter-spacing: 0;
        padding-left: 8px;
        font-weight: $font_weight_600;
        border-left: 1px solid #d8d8d8;
      }
      .img_style {
        width: 40px;
        height: 48px;
        line-height: 54px;
        text-align: center;
        border-right: 1px solid $pri_br_color;
        cursor: pointer;
      }
      .icon_close {
        width: 16px;
        height: 16px;
      }
      .icon_back {
        width: 16px;
        height: 16px;
        margin-left: 12px;
        cursor: pointer;
      }
      .icon_fn {
        width: 16px;
        height: 16px;
        margin-left: 12px;
      }
      .icon_logo {
        width: 30px;
        height: 14px;
        margin: 0 8px;
      }
    }
  }
  .content {
    margin: 14px;
    // height: calc(100% - 47px);
    // overflow: auto;
    .header_title {
      display: flex;
      justify-content: space-between;
      background: $base_white;
      margin-bottom: 12px;
      padding: 16px;
      .content_title {
        .func_title {
          font-size: 16px;
          color: $pri_ft_color;
          font-weight: $font_weight_600;
        }
        .status {
          line-height: 18px;
          font-size: 14dpx;
          padding: 2px 12px;
          margin-left: 8px;
        }
        .status_01 {
          color: #ff9104;
          background: #fff4e5;
        }
        .status_02 {
          color: #ff5f5f;
          background: #ffefee;
        }
        .status_03 {
          color: #358aff;
          background: #f2f8ff;
        }
        .status_04 {
          color: #36d542;
          background: #e5ffe7;
        }
        .status_05 {
          color: #5d36d5;
          background: #e6e5ff;
        }
      }
      .btn_style {
        @include mini_button_common;
        /deep/ .el-dropdown {
          margin-left: 8px;
        }
        .el-dropdown-link {
          height: 28px;
          color: #6d747f;
          background: #f2f3f5;
          border: none;
        }
      }
    }
  }
  /deep/ .aop_tradedesign_comps_page_footer {
    position: fixed;
    z-index: 98;
  }
  .process_contain_box {
    width: 100%;

    display: flex;
    overflow: hidden;
    background: #fff;
    .process_container {
      width: 100%;
      // height: 100%;
      margin: 0 auto;
      display: flex;
      height: calc(100vh - 48px);
      // align-items: center;
      // justify-content: flex-end;
      font-family: $font_regular;
      overflow: hidden;
      flex-direction: column;
      ::v-deep .el-input__inner {
        border: 1px solid $pri_br_color;
        border-radius: $theme_radius;
      }
      .process_main {
        background: $base_white;
        display: inline-block;
        padding: 24px;
        // padding: 0 24px 24px;
        .process_divMb {
          margin-bottom: 5px;
        }
      }
      .process_middle {
        background-color: $base_bg_color;
        // height: calc(100vh - 48px);
        flex: 1;
        overflow: auto;
        position: relative;
        .process_header_title {
          font-family: $font_medium;
          font-size: 16px;
          color: $pri_ft_color;
          letter-spacing: 0;
          background-color: $base_white;
          padding: 20px 30px;
          padding-bottom: 0;
          font-weight: $font_weight_600;
        }
      }
    }
    .flex_left{
        display: flex;
        flex-direction: row;
    }
    .flow_pic {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f7f7f9;
      .left_container {
            width: 40px;
            height: 100%;
            font-size: 14px;
            background: #fff;
            border-right: 1px solid #e6e6e6;
            overflow: hidden;
            .tab_item {
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                text-align: center;
                cursor: pointer;
                padding: 10px;
                border-bottom: 1px solid #e6e6e6;
            }
            .tab_item_blue {
                color: #358AFF;
                font-weight: bold;
            }
        }
    }
  }
  .content_header {
    display: flex;
    justify-content: space-between;
    // background-color: $base_bg_color;
    // .btn_style {
    //   line-height: 47px;
    // }
  }

  .record_btn_style {
    position: absolute;
    top: 230px;
    right: 50px;
    z-index: 999;
    padding: 0 10px;
    background: #ffffff;
    border: 0 solid #ececec;
    box-shadow: 0 0 11px 0 #ececec;
    border-radius: 2px;
  }
  .tabs_btn_style {
    line-height: 71px;
    margin-right: 24px;
    .detail {
      background: $base_white;
      color: $theme_color;
      border: 0.5px solid $theme_color;
    }
    /deep/ .el-button {
      border-radius: 2px;
      font-size: 14px;
    }
  }
  .plus-icon-enter-active {
    animation: axisYin 0.3s;
  }
  .plus-icon-leave-to {
    animation: axisYin 0.3s reverse;
  }
  @keyframes axisYin {
    0% {
      opacity: 0;
      transform: translateX(100%);
    }
    100% {
      opacity: 1;
      transform: translateX(0%);
    }
  }
  .detail_box {
    position: absolute;
    top: 48px;
    right: 0;
    width: 100%;
    height: calc(100vh - 48px);
    background: rgba(8, 7, 7, 0.6);
    overflow-x: hidden;
    z-index: 99;
    .detail_content {
      position: absolute;
      right: 0;
      // min-width: 300px;
      // max-width: 550px;
      height: 100%;
      background: #fff;
    }
    .detail_background {
      position: absolute;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .detail_content_box {
    height: calc(100vh - 155px);
    overflow: auto;
  }
  .process_right {
    background: $base_white;
    flex: 0 0 260px;
    border-left: 1px solid $pri_br_color;
    position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
