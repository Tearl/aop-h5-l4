<template>
  <div class="aop_tradecode_page_d4workbench_workbench_service_define">
    <!-- 顶部菜单 -->
    <AsNav @navBack="navBack" :showBackIcon="false" :asideActive="asideActive">
      <div slot="textProps" v-if="isAction">系统设计-接口设计-{{ fnctNm }}</div>
      <div slot="textProps" v-else>功能设计开发-{{ fnctNm }}</div>
      <div slot="radioProps" v-if="asideActive!='1'">
        <el-button-group>
            <el-button :type="asideActive=='2'?'primary':''" size="small" @click="handleGoTo('2')">接口定义</el-button>
            <el-button :type="asideActive=='3'?'primary':''" size="small" @click="handleGoTo('3')">接口设计</el-button>
            <el-button :type="asideActive=='4'?'primary':''" size="small" @click="handleGoTo('4')">接口源码</el-button>
            <el-button :type="asideActive=='0'?'primary':''" size="small" @click="handleGoTo('0')">流程设计</el-button>
        </el-button-group>
      </div>
        <div slot="btnProps" v-if="!isDisabled && $route.query.displayType != '01'" class="top_right_btns" :class="!isAction ? 'transform-y' : ''">
          <div>
              <!-- <el-button plain type="primary" size="small" @click="showdialog('3')">初始化配置</el-button>
              <el-button plain type="primary" style="margin-right: 14px;" size="small" @click="connectListOperate('configured',orderDetail)" >工程配置</el-button> -->
          </div>
          <div v-if="asideActive=='2' || asideActive=='3'">
              <el-button plain type="primary" size="small" @click="showdialog('1')">生成代码</el-button>
              <el-button plain type="primary" size="small" @click="appyBranchCodeDownLoad('0')">下载代码</el-button>
          </div>
        </div>

      <div slot="btnProps" v-if="!isDisabled" style="visibility: hidden;">
        <el-button type="danger" plain @click="topMenuBtnClick('3')" v-if="isAction">S4设计提交</el-button>
        <el-button type="danger" plain @click="topMenuBtnClick('4')" v-else>下装开发提交</el-button>
      </div>
    </AsNav>
    <!-- 主体 -->
    <div class="design_container">
      <div class="design_container_aside">
        <Aside isClickTips @goTo="handleGoTo" :active="asideActive"></Aside>
      </div>
      <div class="design_container_process">
        <div class="process_contain_box">
          <div class="process_container">
            <!-- 业务交易元素 -->
            <!-- 废弃方法 @showCreateDialog="showCreateDialog" @showD2InfoDialog="showD2InfoDialog" -->
            <Pelem
              ref="pelem"
              class="process_left"
              v-if="asideActive !='0'"
              :jobNo="jobNo"
              :fnctCd="fnctCd"
              :isolateWorkspace="isolateWorkspace"
              :d4bSvcList="d4bSvcList"
              :d4bScrollTop="d4bScrollTop"
              :r4bSvcList="r4bSvcList"
              :currentD4bObj="currentD4bObj"
              :currentR4bObj="currentR4bObj"
              :assetFnctNo="assetFnctNo"
              :asideActive="asideActive"
              @pickElemEvent="pickElemEvent"
              @elemTabClick="elemTabClick"
              @getD4bServiceList="getD4bServiceList"
              @getR4bServiceList="getR4bServiceList"
              @d4bServClick="d4bServClick"
              @r4bServClick="r4bServClick"
              @addInterface="addInterface"
              @delInterface="delInterface"
            ></Pelem>
            <!-- 浏览  -->
            <div class="content_wrapper" v-show="topNavActive == 'read'">
              <!-- 画布 -->
              <div class="process_middle_wrapper">
                <!-- 页签  -->
                <!-- 无用方法 @tabEdit="handleTabsEdit" -->
                <ServiceTabs
                  :tabsList="tabsList2"
                  :defaultActive="defaultActive"
                  @tabClick="handleTabClick"
                >
                </ServiceTabs>
                <!--  -->
                <div
                  class="process_middle"
                  v-if="
                    defaultActive == 'businessRealize' ||
                    defaultActive == 'serviceEdit' ||
                    defaultActive == 'serviceInfo' ||
                    defaultActive == 'processDesc' ||
                    defaultActive == 'processDraw'
                  "
                >
                <!-- 流程描述 -->
                  <div
                    v-show="asideActive =='0'"
                    class="content_wrapper_detail"
                  >
                    <businessFlow
                      v-if="asideActive =='0'"
                      ref="processDescRef"
                      :itemInfo="itemInfo"
                      :editSt="$route.query.displayType != '01' ? '1' : '0'"
                      :mode="'s4Design'"
                      :activeTabName="defaultActive"
                    ></businessFlow>
                  </div>
                  <!-- 流程图end -->
                  <!-- 业务交易基本信息 -->
                  <div
                    class="content_wrapper_detail"
                    v-show="defaultActive == 'serviceInfo'"
                  >
                    <ServiceDetail
                      ref="serviceDetailRef"
                      v-if="r4bDataShow"
                      @showRelatedTops="gotoPageD2"
                      @addInterface="addInterface"
                      :queryDetail="queryDetail"
                    ></ServiceDetail>
                  </div>
                  <div
                    class="no_data"
                    v-if="!r4bDataShow && defaultActive == 'serviceInfo'"
                  >
                    暂无数据
                  </div>
                  <!-- 业务接口模块 -->
                  <div
                    v-show="defaultActive == 'serviceEdit'"
                    class="content_wrapper_detail"
                  >
                    <ServiceEdit
                      v-if="d4bDataShow"
                      ref="baseInfoRef"
                      @changeList="changeList"
                      @showRelatedTops="gotoPage"
                      @addInterface="addInterface"
                    ></ServiceEdit>
                  </div>
                  <div
                    class="no_data"
                    v-if="!d4bDataShow && defaultActive == 'serviceEdit'"
                  >
                    暂无数据
                  </div>
                  <!-- 业务交易实现 -->
                  <div v-show="defaultActive == 'businessRealize'">
                    <BusinessRealize
                      :currentR4bObj="currentR4bObj"
                      :currentR4bList="currentR4bList"
                      ref="businessRealizeRef"
                      @completeConfirm="completeConfirm"
                    ></BusinessRealize>
                  </div>
                </div>
                <!-- 业务接口流程图 -->
                <div
                  v-show="defaultActive == 'businessProcess'"
                  class="process_content"
                >
                  <div class="flow_aside">
                    <el-menu :default-active="picDefault">
                      <el-menu-item
                        index="mainFlow"
                        @click="picClick('mainFlow')"
                      >
                        <div slot="title">
                          <img
                            :src="
                              picDefault == 'mainFlow'
                                ? require('@m/assets/images/icon_asdev_a.png')
                                : require('@m/assets/images/icon_asdev.png')
                            "
                            alt=""
                          /><span>主流程</span>
                        </div>
                      </el-menu-item>
                      <el-menu-item index="4bFlow" @click="picClick('4bFlow')">
                        <div slot="title">
                          <img
                            :src="
                              picDefault == '4bFlow'
                                ? require('@m/assets/images/icon_m1_h.png')
                                : require('@m/assets/images/icon_m1.png')
                            "
                            alt=""
                          /><span>4b流程</span>
                        </div>
                      </el-menu-item>
                    </el-menu>
                  </div>
                  <div class="btn_list" v-if="picDefault == '4bFlow'">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="handleBackBtn"
                      v-show="fourRAttrFlag"
                      class="btn_align"
                      icon="el-icon-back"
                    >
                      返回</el-button
                    >
                    <el-button
                      class="btn_align"
                      type="primary"
                      size="mini"
                      @click="oneKeyAlign('4bFlow')"
                      icon="el-icon-location-outline"
                      >一键对齐</el-button
                    >
                  </div>
                  <div class="process_main" v-if="picDefault == '4bFlow'">
                    <div>
                      <Process
                        ref="processRef"
                        pageType="assetDesign"
                        :dataObj="dataObj"
                        :fourRAttrFlag="fourRAttrFlag"
                        :scaleRate="scaleRate"
                        @getAttrEvent="getAttrEvent"
                        @getConditionEvent="getConditionEvent"
                        @getSvgClickEvent="getSvgClickEvent"
                        @handleActionChange="handleActionChange"
                        :isRead="isRead"
                      >
                      </Process>
                    </div>
                  </div>
                  <div
                    v-if="picDefault == 'mainFlow'"
                    class="process_main_flow"
                  >
                    <div>
                      <ProcessFlow
                        ref="process"
                        pageType="mainFlow"
                        :dataObj="mainFlowData"
                        :isRead="isRead"
                      >
                      </ProcessFlow>
                    </div>
                  </div>
                </div>
                <!-- 业务交易流程图 -->
                <div
                  v-show="defaultActive == 'businessDecisionProcess'"
                  class="process_content"
                >
                  <div class="decision_btn_list">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="handleDecisionBackBtn"
                      v-show="fourRAttrDecisionFlag"
                      class="btn_align"
                      icon="el-icon-back"
                    >
                      返回</el-button
                    >
                    <el-button
                      class="btn_align"
                      type="primary"
                      size="mini"
                      @click="oneKeyAlign('decision')"
                      icon="el-icon-location-outline"
                      >一键对齐</el-button
                    >
                  </div>
                  <div class="process_main_decision">
                    <ProcessDecision
                      ref="process"
                      pageType="assetDesign"
                      :scaleRate="scaleRateFlow4b"
                      :dataObj="decisionData"
                      :fourRAttrFlag="fourRAttrDecisionFlag"
                      @getAttrEvent="getAttrEvent"
                      @getConditionEvent="getConditionEvent"
                      @getSvgClickEvent="getDecisionSvgClickEvent"
                      :isRead="isRead"
                      @handleActionChange="handleDecisionActionChange"
                    >
                    </ProcessDecision>
                  </div>
                </div>
              </div>
            </div>
            <!-- 业务交易流程图的子属性  -->
            <PattrDecision
            v-if="
                defaultActive == 'businessDecisionProcess'
              "
              ref="pattr"
              class="process_right"
              :dicArray="dicArray"
              :fnctId="fnctId"
              :currentServObj="currentServObj"
              @updateConditionEvent="updateConditionEvent"
              @upDateFlowParams="upDateFlowParams"
              @updateDataParams="updateDataParams"
              @handleCondPritChange="handleCondPritChange"
              @updateRecordFlow="updateRecordFlow"
              @upDateServParams="upDateServParams"
              @toSave="toSave"
              :isRead="isRead"
              @getDataList="getDataList"
            ></PattrDecision>

            <!-- 业务接口流程图的子属性 -->
            <Pattr
              v-if="defaultActive == 'businessProcess' && picDefault == '4bFlow'"
              ref="pattr"
              class="process_right"
              :dicArray="dicArray"
              :fnctId="fnctId"

              :currentServObj="interfaceObj"
              :currentParentCpnInfo="currentParentCpnInfo"
              @updateConditionEvent="updateConditionEvent"
              @upDateFlowParams="upDateFlowParams"
              @updateDataParams="updateDataParams"
              @handleCondPritChange="handleCondPritChange"
              @updateRecordFlow="updateRecordFlow"
              @upDateServParams="upDateServParams"
              @toSave="toSave"
              :isRead="isRead"
              @getDataList="getDataList"
              :showType="pattrShowType"
            ></Pattr>
          </div>
          <!-- 添加接口 -->
          <InterfaceList
            :visibleShow="visibleShowAdd"
            :dialogTitle="dialogTitle"
            :tableData="service4BList"
            :formB="queryDetail"
            :key="'1'"
            @closeDialog="closeDialog"
            name="InterfaceList"
          ></InterfaceList>
        </div>
      </div>
    </div>
     <!-- 编辑器交易2024年1月11日 -->
    <CheckSystemDesign ref="checkSystemDesignRef" @checkSystemDesign="checkSystemDesign"></CheckSystemDesign>
    <!-- 生成代码 -->
    <GenerateCode
        :visibleShow="centerDialogVisible"
        :key="code"
        :formInfo="orderDetail"
        :appId="orderDetail.appId"
        :fnctNo="orderDetail.assetFnctNo"
        :authFnctJobInfoId2="orderDetail.authFnctJobInfoId"
        :tableData="tableData"
        @handleClose="handleClose1"
        name="GennerateCode"
        :tranData="tranData"
        :s4Design="false"
    ></GenerateCode>
    <!-- 初始化配置 -->
    <ApplyConfiguation
        :visibleShow="applyConfigVisible"
        :keyType="'s4design'"
        :formInfo3="orderDetail"
        :detailObj="detailObj"
        :appId="orderDetail.appId"
        @handleClose="handleClose3"
        name="ApplyConfiguation"
    ></ApplyConfiguation>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { mapActions, mapState } from "vuex";
import Process from "@m/core/components/process/comps";
import AsNav from "./components/d4analyse_nav";
import Pattr from "@m/core/components/process/attr";
import Pelem from "./components/d4analyse_process/elem";
import { escape2Html } from "@m/utils/html2e.js";
import { typeEnumObj } from "@m/utils/normalData.js";
import {
  reList,
  mixList,
  getParamParent,
  packageParamKey,
  rowInfos,
} from "@m/utils/paramTree";
import Aside from "./components/d4analyse_process/aside";
import { unduplicatedByKeys } from "@m/utils/array";
import ServiceTabs from "../public/page_tabs";
import ServiceEdit from "./components/interface_edit";
import ServiceDetail from "./components/service_detail";
import BusinessRealize from "./components/business_realize"; //业务实现
import PattrDecision from "@m/core/components/decision_process/attr";
import ProcessFlow from "@m/core/components/process/comps"; //主流程图
import { getSessionStorage } from "@m/utils/localStorage";
import InterfaceList from "@m/views/assetList/components/components/add_service"; //主流程图
import GenerateCode from "@m/views/assetList/components/generateCode.vue"; // 生成代码
import { downloadEvt } from "@m/core/utils/download.js";
import ProcessDecision from "@m/core/components/decision_process/comps";

import businessFlow from "../BusinessFlow";
import CheckSystemDesign from "../check_systemDesign";
import ApplyConfiguation from "../../../../assetList/components/applyConfiguation.vue";
export default {
  mixins: [mixin],
  components: {
    Pattr,
    Process,
    Pelem,
    AsNav,
    Aside,
    ServiceTabs,
    ServiceEdit,
    ServiceDetail,
    BusinessRealize,
    PattrDecision,
    ProcessFlow,
    InterfaceList,
    ProcessDecision,
    businessFlow,
    CheckSystemDesign,
    GenerateCode,
    ApplyConfiguation,
  },
  props: {
    pageType: {
      type: String,
      default: () => "",
    },
    fnctId: {
      type: String,
      default: () => "",
    },
    fnctCd: {
      type: String,
      default: () => "",
    },
    apiId: {
      type: String,
      default: () => "",
    },
    authAppDtlId: {
      type: String,
      default: () => "",
    },
    admiId: {
      type: String,
      default: () => "",
    },
    modelVersion: {
      type: String,
      default: () => "",
    },
    detailType: {
      type: String,
      default: () => "",
    },
    currentActive: {
      type: String,
      default: () => "",
    },
  },
  data() {
    d2Url = `${window.origin}/#/aop_enddesign/layoutdesign/detail?admiId=20000244&orderId=10001865`;
    return {
      //默认数据
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
      dataObj: {
        flow: [],
        position: "",
      },
      //页面传参
      activeView: "page",
      showType: "process",
      // 导航栏页签
      topNavActive: "read",
      // 服务组件列表
      dataList: [],
      pageMode: "",
      // 记录流程图数据
      recordFlow: "",
      // 记录流程图位置信息
      recordPosition: "",
      // 返回位置 home 为返回列表
      navReturn: "",
      // 侧边栏的当前选中项索引
      asideActive: "",

      // D2页面的URL
      d2Url,
      // 工具栏宽度
      toolsWidth: "",
      //页签列表
      tabsList2: [
        { v: "流程图", k: "processDraw" },
        { v: "流程描述", k: "processDesc" },
      ],
      itemInfo: {},
      //当前页签 默认流程描述
      defaultActive: "processDraw",
      showBussinessFlow: true,
      pattrShowType:'service', // 最右侧展示 默认交易 非决策decisionAction


      // apiId: "12702194420047305153",
      editBtnDisabled: false, // 顶部导航的编辑按钮能否点击,
      r4bSvcList: [],
      d4bApiList: [],
      currentRadio: "",

      currentApiId: "",
      currentD4bObj: {},
      currentR4bObj: {},
      currentR4bList: [],

      // 左侧菜单数据
      fnctInfo: {},
      d4bSvcList: [],
      elemActive: "业务交易",
    //   是否需要滚动
      d4bScrollTop:0,

      currentServObj: {},
      // 接口调用完成才展示页面
      infoShow: false,

      isRead: true,
      picList: [
        { v: "主流程 ", k: "mainFlow" },
        { v: "4b流程", k: "4bFlow" },
      ],
      //当前页签
      picDefault: "4bFlow",
      mainFlowData: {}, //主流程图数据处理
      decisionData: {}, //业务4b流程图数据处理
      visibleShowAdd: false, //接口添加弹框
      dialogTitle: "", //接口添加弹框标题
      jobNo: "", //作业号
      fnctCd: "", //功能编号
      beltLine: "", //业务域
      authId: "", //授权编号
      isolateWorkspace: "", //隔离标识
      modelVersion: "", //版本
      queryDetail: {}, //路由参数
      asgntNo: "",
      appId: "",
      competitorId: "",
      d4bDataShow: true,
      r4bDataShow: true,
      businessObj: {},
      interfaceObj: {},
      getAttrEventTimer: "",
      currentParentCpnInfo: {}, //父组件的信息（4R、循环、异步）
      fourRAttrFlag: false, //是否双击4R组件
      fourRAttrDecisionFlag: false,
      assetFnctNo: "",
      authAstFnctInfoId: "",
      decisionObj: {},
      assetId: "",
      scaleRate: 1, //流程图的缩放比例
      scaleRateFlow: 1,
      scaleRateFlow4b: 1,

      serviceSeq: '',

      //生成代码弹窗
      centerDialogVisible: false,
      orderDetail:{},
      tranData: [],
      detailObj:{},
      applyConfigVisible: false, // 申请配置弹窗
      fnctNm: ""
    };
  },
  computed: {
    isDisabled() {
      return this.$route.query.pageMode === 'preview'
    },
    ...mapState("aop_tradecode", ["tempProcessObj", "isProcessTemp"]),
    noEdit() {
      return (
        this.editBtnDisabled ||
        this.pageType == "read" ||
        this.pageMode == "read" ||
        (this.currentD4bObj && this.currentD4bObj.dsgnFlg == 0) ||
        this.d4bSvcList.length == 0
      );
    },
    isAction() {
      return this.$route.query.pageMode === 's4design'
    },
    hasCreated() {
      if (this.elemActive == "业务交易") {
        return this.d4bSvcList.length > 0;
      } else {
        return this.d4bSvcList.length > 0 || this.r4bSvcList.length > 0;
      }
    },
  },
  provide() {
    return {
      getDataList: this.getDataList,
      // setCurrentActionId: this.setCurrentActionId,
      // deleteLineBySourceIdAndTargetId: this.deleteLineBySourceIdAndTargetId,
    };
  },
  methods: {
    ...mapActions("aop_tradecode", ["saveTempProcessObj", "changeProcessTemp"]),
    //初始化
    init() {
        if(this.$route.query.typeOf4b == '1'){ // 从下装接口列表过来
            this.serviceSeq = this.$route.query.serviceSeq
        }
      this.servId = this.$route.query.servId;
      this.atomId = this.$route.query.atomId;
      this.pageMode = this.$route.query.pageMode; // 开发页面进入隐藏保存
      this.apiId = this.$route.query.apiId;
      this.orderId = this.$route.query.orderId;
      this.jobNo = this.$route.query.jobId;
      this.fnctCd = this.$route.query.admiId;
      this.beltLine = this.$route.query.bizLineId;
      this.authId = this.$route.query.authId;
      this.isolateWorkspace = this.$route.query.isolateWorkspace;
      this.modelVersion = this.$route.query.modelVersion || "";
      this.asgntNo = this.$route.query.asgntNo;
      this.appId = this.$route.query.appId;
      this.competitorId = this.$route.query.competitorId;
      this.assetFnctNo = this.$route.query.assetFnctNo; // 功能号
      this.authAstFnctInfoId = this.$route.query.authAstFnctInfoId;
      this.assetId = this.$route.query.fnctNo; // 活动号
      this.queryDetail = {
        authFnctJobInfoId: this.$route.query.authFnctJobInfoId,
        asgntNo: this.asgntNo,
        assetFnctNo: this.assetFnctNo,
        bizDomainNo: this.beltLine,
        bizAppId: this.appId,
        cstNo: this.competitorId,
        authAstFnctInfoId: this.authAstFnctInfoId,
      };
      // 生成代码
      this.orderDetail = {
        authFnctJobInfoId: this.$route.query.authFnctJobInfoId,
        asgntNo: this.asgntNo,
        assetFnctNo: this.assetFnctNo,
        fnctNo: this.$route.query.fnctNo,
        assetFnctNm: this.$route.query.modelName,
        bizDomainNo: this.beltLine,
        appId: this.$route.query.projectId,
        cstNo: this.competitorId,
        authAstFnctInfoId: this.authAstFnctInfoId,
      }
    //   this.getD4bServiceList();
    this.rpc.businessRules.queryFunctionRelInfo({
            fnctId: this.fnctId || this.$route.query.fnctId
        }).then(res => {
          this.fnctNm = res.fnctNm;
        })
    },
    getDataList(e) {
      console.log(
        "getDataList",
        JSON.parse(JSON.stringify(this.$refs.process.dataList))
      );
      return JSON.parse(JSON.stringify(this.$refs.process.dataList));
    },
    // 导航栏返回
    navBack(e) {
      this.$router.go(-1);
    //   this.navReturn = e;
    //   this.goRoute();
    },
    // 返回方法
    goRoute() {
      if (this.navReturn == "home") {
        this.$router.back();
      } else {
        this.$router.push(getSessionStorage("interfaceRouter"));
      }
    },
    //展示创建新服务组件窗口
    showNewServiceDemand(e) {
      this.newServiceVisiable = true;
    },
    // 清除画布数据缓存
    clearAllData() {
      const data = { flow: [], position: "" };
      this.saveTempProcessObj(data);
      this.changeProcessTemp(false);
    },
    //组合字典
    mixDic() {
      const d = this.dataObj.puApiParams
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
    //返回
    goBack() {
      this.$router.go(-1);
    },
    //画布触发
    //画布获取组件参数
    getAttrEvent(e, click) {
      if (this.getAttrEventTimer) {
        clearTimeout(this.getAttrEventTimer);
      }
      this.getAttrEventTimer = setTimeout(() => {
        this.$refs.pattr.getAttr(e, click);
      }, 200);
    },
    //画布条件
    getConditionEvent(e) {
      this.$refs.pattr.getCondition(e);
      // this.mixDic();
    },
    //点击画布空白
    getSvgClickEvent(e) {
      if (
        ["loopAction", "asyncAction", "4RAction"].includes(
          this.currentParentCpnInfo.actionType
        )
      ) {
        this.$refs.pattr.getAttr(this.currentParentCpnInfo);
      } else {
        if (e.flow.length !== 0) {
          this.$refs.pattr.getFlowParams(this.dataObj);
        }
      }
    },
    //决策树点击空白处
    getDecisionSvgClickEvent(e) {
      if (e.flow.length !== 0) {
        this.$refs.pattr.getSvgClickEvent(this.dataObj);
      }
    },
    //接口双击进入子流程
    async handleActionChange(e) {
      clearTimeout(this.getAttrEventTimer);
      const dataList = this.getDataList();
      this.currentParentCpnInfo = { ...e, dataList };
      this.$refs.pattr.get4RFlowParams(this.interfaceObj);
      this.fourRAttrFlag = true;
      //获取组件流程图信息
      const params = {
        cpntPId: e.compositeId,
      };
      const res = await this.rpc.d4.getFlowdata(params);
      this.getAllData(res);
      // this.getServiceArrangeList();
    },
    //决策树双击进入子流程
    async handleDecisionActionChange(e) {
      if (["4RAction", "loopAction", "asyncAction"].includes(e.actionType)) {
        clearTimeout(this.getAttrEventTimer);
        const dataList = this.getDataList();
        this.currentParentCpnInfo = { ...e, dataList };
        this.$refs.pattr.get4RFlowParams(this.interfaceObj);
        this.fourRAttrDecisionFlag = true;
        //获取组件流程图信息
        const params = {
          cpntPId: e.compositeId,
        };
        const res = await this.rpc.transactionDesign.getFlowdata(params);
        this.getAllData(res);
      } else if (e.actionType == "decisionAction") {
        console.log("双击了规则组件", e);
        const res =
          await this.rpc.transactionDesign.queryDecisionTreeParamAndRuleDefinitions(
            {
              d4StusCd: "1",
              blngtoTyp: "10",
              compositeId: e.compositeId || "",
              apiId: e.actionOwnId,
              d4bApiId: this.decisionObj.svcId,
              bizDomainNo: this.decisionObj.beltLine,
            }
          );
        const routeData = this.$router.resolve({
          path: "/aop_businessd2/transactionDesign/decisionFlowInfo",
          query: {
            authId: "D2",
            fnctCd: "",
            jobNo: this.jobNo,
            fnctNm: "",
            apiId: e.actionOwnId,
            appId: this.appId,
            ruleId: res.ruleDefnId,
            bizLineId: this.decisionObj.beltLine,
            transId: this.decisionObj.svcId,
          },
        });
        window.open(routeData.href, "_blank");
      }

      // this.getServiceArrangeList();
    },
    // 返回服务的流程图
    async handleBackBtn() {
      this.fourRAttrFlag = false;
      this.currentParentCpnInfo = {};
      await this.refreshFlow();
      this.$refs.pattr.getFlowParams(this.currentServObj);
    },
    // 返回服务的流程图决策树
    async handleDecisionBackBtn() {
      this.fourRAttrDecisionFlag = false;
      this.currentParentCpnInfo = {};
      await this.refreshDecisionFlow();
      this.$refs.pattr.getFlowParams(this.currentServObj);
    },
    async refreshDecisionFlow() {
      // 刷新流程图
      if (this.fourRAttrDecisionFlag) {
        // 在子流程内
        const res = await this.rpc.transactionDesign.getFlowdata({
          cpntPId: this.currentParentCpnInfo.compositeId,
        });
        this.getAllData(res);
      } else {
        this.getInServiceDesignDetail();
      }
    },
    async refreshFlow() {
      // 刷新流程图
      if (this.fourRAttrFlag) {
        // 在子流程内
        const res = await this.rpc.d4.getFlowdata({
          cpntPId: this.currentParentCpnInfo.compositeId,
        });
        this.getAllData(res);
      } else {
        this.getFlowDetail();
      }
    },
    //画布组件创建
    handleNewRectAdd(e) {
      if (e.actionType == "newAction") {
        this.currentNewService = e;
        this.showNewServiceDemand(e);
      }
    },
    // 生成线条时的默认优先级
    generateLineCondPrit(lineObj, lineList) {
      this.$refs.pattr.generateLineCondPrit(lineObj, lineList);
    },
    //元素栏触发
    //元素创建到画布
    pickElemEvent(e) {
      if (e.item.referId != "executeFlowAction") {
        this.$refs.process.handleNewRectMousedown(e);
        // this.mixDic();
        this.$refs.pattr.showType = "attr";
      } else if (this.elemActive = '业务交易' || this.defaultActive=='businessDecisionProcess') {
        this.$refs.pattr.showType = "service";
      } else if(this.elemActive = '接口列表' || this.defaultActive=='businessProcess') {
        this.$refs.pattr.showType = "service";
      }
    },

    //属性栏触发
    //更新线条条件
    updateConditionEvent(e) {
      this.$refs.process.updateCondition(e);
    },
    //更新flow参数
    upDateFlowParams(e) {
      this.dataObj.paramList = e.paramList;
      this.dataObj.input = e.input;
      this.dataObj.output = e.output;
      // this.mixDic();
    },
    // 更新dataList
    updateDataParams(e) {
      console.log("updateDataParams", e);
      this.$refs.process.updateDataParams(e);
    },
    // 更新recordFlow
    updateRecordFlow(e) {
      const _recordFlow = JSON.parse(this.recordFlow);
      const updatedItem = _recordFlow.find((item) => item.id == e.actionId);
      if (updatedItem) {
        updatedItem.paramList = JSON.parse(JSON.stringify(e.paramList));
        this.recordFlow = JSON.stringify(_recordFlow);
      }
    },
    adjustSize() {
      this.toolsWidth =
        document.querySelector(".process_middle").offsetWidth * 1 - 10 + "px";
    },
    handleMousewheel(e) {
      if (e.ctrlKey) {
        if (e.wheelDelta > 0) {
          if (this.scaleRate < 2) {
            this.scaleRate = (this.scaleRate + 0.1).toFixed(1) * 1;
          }
        } else {
          if (this.scaleRate > 0.6) {
            this.scaleRate = (this.scaleRate - 0.1).toFixed(1) * 1;
          }
        }
        e.preventDefault();
      }
    },
    handleMousewheelFlow(e) {
      if (e.ctrlKey) {
        if (e.wheelDelta > 0) {
          if (this.scaleRateFlow < 2) {
            this.scaleRateFlow = (this.scaleRateFlow + 0.1).toFixed(1) * 1;
          }
        } else {
          if (this.scaleRateFlow > 0.6) {
            this.scaleRateFlow = (this.scaleRateFlow - 0.1).toFixed(1) * 1;
          }
        }
        e.preventDefault();
      }
    },
    handleMousewheelFlow4b(e) {
      if (e.ctrlKey) {
        if (e.wheelDelta > 0) {
          if (this.scaleRateFlow4b < 2) {
            this.scaleRateFlow4b = (this.scaleRateFlow4b + 0.1).toFixed(1) * 1;
          }
        } else {
          if (this.scaleRateFlow4b > 0.6) {
            this.scaleRateFlow4b = (this.scaleRateFlow4b - 0.1).toFixed(1) * 1;
          }
        }
        e.preventDefault();
      }
    },
    // 添加事件监听器
    addEventListener() {
      window.addEventListener("resize", this.adjustSize, false);
      window.addEventListener("mousewheel", this.handleMousewheel, {
        passive: false,
      });
      window.addEventListener("mousewheel", this.handleMousewheelFlow, {
        passive: false,
      });
      window.addEventListener("mousewheel", this.handleMousewheelFlow4b, {
        passive: false,
      });
      // document.querySelector(".process_middle").addEventListener("scroll", this.handleScroll, false)
    },
    // 删除事件监听器
    removeEventListener() {
      window.removeEventListener("resize", this.adjustSize, false);
      window.removeEventListener("mousewheel", this.handleMousewheel);
      window.removeEventListener("mousewheel", this.handleMousewheelFlow);
      window.removeEventListener("mousewheel", this.handleMousewheelFlow4b);
      // document.querySelector(".process_middle").removeEventListener("scroll", this.handleScroll, false)
    },

    //新版
    // 切换左侧菜单的页签
    elemTabClick(e,v) {
      this.elemActive = e;
      if( e== '业务交易' || v == '1') { // 业务交易 一个页签
        this.tabsList2 = [
          { v: "基本信息", k: "serviceInfo" },
          { v: "业务流程", k: "businessDecisionProcess" },
        ];
        this.defaultActive = "serviceInfo";
        this.isRead = true;
        this.editBtnDisabled = true;
        // 查询业务交易列表
        this.getR4bServiceList();
      }else if(e == '接口列表' || v == '2') { // 接口列表1个页签
        this.tabsList2 = [
          { v: "基本信息", k: "serviceEdit" },
          { v: "业务流程", k: "businessProcess" },
        ];
        this.defaultActive = "serviceEdit";
        this.isRead = true;
        this.editBtnDisabled = true;
        // 查询业务接口列表
        this.getD4bServiceList();
      }
    },
    //切换当前页签
    handleTabClick(e) {
      this.defaultActive = e;
      this.get4BTabsList();
    },
    //主流程和4b流程切换
    picClick(e) {
      this.picDefault = e;
      this.getFlowDetail();
    },
    // 功能下业务接口列表查询
    async getD4bServiceList(data) {
      let svcNm = data;
      console.log(svcNm);
      const params = {
        svcNm, //名称
        pageFlg: "0", //分页标志：0-不分页；1-分页
        jobNo: this.asgntNo, //作业号
        fnctCd: this.assetFnctNo, //功能编号   FM-ZC-2023-000663
        beltLine: this.beltLine, //业务域   FM-YWY-2022-000001
        authId: this.authAstFnctInfoId, //授权编号  FM-AFJI-2023041100001273
      };
      const res = await this.rpc.newEditor.getInterfaceList(params);
      this.d4bSvcList = res.apiInfoList;
      this.d4bSvcList.forEach((item) => {
        item.apiId = item.svcId;
      });
      this.infoShow = true;
      // 如果链接带参进行匹配

      if(this.$route.query.svcId){
        let tablength = 0;
        this.d4bSvcList.forEach((item,index) => {
            if(item.svcId == this.$route.query.svcId){
                tablength = index + 2; // 搜索框占位
            }
        });
        this.currentD4bObj =
          this.d4bSvcList.find((item) => item.svcId == this.$route.query.svcId) || {};
          this.d4bServClick(this.currentD4bObj)
          this.d4bScrollTop = 36*tablength;
      }else if (this.apiId) {
        this.currentD4bObj =
          this.d4bSvcList.find((item) => item.svcId == this.apiId) || {};
      } else if (this.serviceSeq){
           this.currentD4bObj =
          this.d4bSvcList.find((item) => item.svcSeq == this.serviceSeq) || {};
      } else {
        let svcId = getSessionStorage("svcId")
        if (svcId) {
          const item = this.d4bSvcList.find((item) => item.svcId == svcId) || this.d4bSvcList[0];
          this.currentD4bObj = item;
        } else {
          this.currentD4bObj = this.d4bSvcList[0];
        }
      }
      // 初次加载
      if (res.apiInfoList.length > 0) {
        this.getInterfaceInfo();
        this.d4bDataShow = true;
        // this.getD4bServiceList.flag = true;
      } else {
        this.d4bSvcList = [];
        this.d4bDataShow = false;
      }
    },
    //点击接口列表
    async d4bServClick(e) {
      this.currentD4bObj = e;
      this.currentApiId = e.svcId;
      this.get4BTabsList();
    },
    //接口主流程数据处理
    async getInterfaceInfo() {

      Promise.all([
        this.rpc.newEditor.getD4bServiceInfo({
          svcId: this.currentD4bObj.apiId || '',
          fnctId: '', //this.fnctId || this.currentD4bObj.fnctId,
          dsgnFlg: "1",
        }),
        this.rpc.newEditor.getServiceDesignDetail({
          apiId: this.currentD4bObj.apiId || '',
          d4StusCd: "1", // 0-分析，1-设计；2-测试
          blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
          dsgnFlg: "1",
        }),
      ]).then((res) => {
        const basicData = res[0];
        this.interfaceObj = res[0];
        basicData.srcFnctFlg = this.currentD4bObj.srcFnctFlg || ''
        // console.log(res[0],res[1],'=======')
        basicData.flow = res[1].flow;
        basicData.puApiParams.forEach((item, index, paramList) => {
          const paramParent = getParamParent(item, paramList);
          const isHeaderData =
            ["resHeaderData"].includes(paramParent?.paramKey) ||
            (item.paramKey == "bodyOutData" && !item.paramParentId);
          if (
            isHeaderData &&
            item.paramDirection == "1" &&
            !item.actionId &&
            !item.actionName &&
            !item.apSource
          ) {
            item.actionId = "system";
            item.actionName = "平台系统";
            item.apSource = "01";
            item.paraMapgNm = item.paramCName;
            item.paramMappingKey = packageParamKey(item, basicData.puApiParams);
          }
          if (item.apSource == "01") {
            item.actionId = "system";
          } else if (item.apSource == "10") {
            item.actionId = "constantValue";
          }
        });
        if (this.defaultActive == "serviceInfo") {
          this.$nextTick(() => {
            this.$refs.serviceDetailRef.basicData = JSON.parse(
              JSON.stringify(basicData)
            );
          });
        } else if (this.defaultActive == "serviceEdit") {
          this.$nextTick(() => {
            this.$refs.baseInfoRef.basicData = JSON.parse(
              JSON.stringify(basicData)
            );
          });
        }
      });
    },
    //接口详情流程图
    async getInterfaceDetail() {
      const params = {
        apiId: this.currentD4bObj.apiId,
        d4StusCd: "1", // 0-分析，1-设计；2-测试
        blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
        // dsgnFlg: this.currentD4bObj.dsgnFlg ,
        deployFlg: "1", // 发布标志 0 未发布 1已发布
      };

      let res = await this.rpc.newEditor.getServiceDesignDetail(params);
      this.getAllData(res);
      this.interfaceObj = res;
      this.interfaceObj.svcId = res.apiId;
      this.$refs.pattr.currentObj = res;
      this.$refs.pattr.getFlowParams(res);
    },
    //功能下的业务交易列表查询
    async getR4bServiceList() {
      const params = {
        fnctId: this.$route.query.assetFnctNo || '', //功能编号   FM-ZC-2023-000663
      };
      const res = await this.rpc.s4design.queryFunctionBizTradeList(params);
      this.r4bSvcList = res.bizTradeAchieveSituationList;
      this.currentR4bObj = res.bizTradeAchieveSituationList[0];
      this.currentR4bList = res.bizTradeAchieveSituationList || []; // 增加一个所有4b存放
      if (this.r4bSvcList?.length > 0) {
        let obj = this.r4bSvcList[0];
        this.currentR4bObj = {
            apiId: obj.txId,
            apiNm: obj.txNm,
            achFlg: obj.achFlg,
            txSrcCd: obj.txSrcCd,
            ...obj,
        };
        this.getD4bServiceInfo();
        this.r4bDataShow = true;
      } else {
        this.r4bSvcList = [];
        this.r4bDataShow = false;
      }
    },
    //点击业务交易列表
    async r4bServClick(e) {
      this.currentR4bObj = {
        apiId: e.txId,
        apiNm: e.txNm,
        achFlg: e.achFlg,
        txSrcCd: e.txSrcCd,
        ...e,
      };
    //   this.currentR4bObj = e;
      this.get4BTabsList();
    },
    // 查询业务4B交易服务详情
    async getD4bServiceInfo() {
      Promise.all([
        this.rpc.newEditor.get4BServiceInfo({
          svcId: this.currentR4bObj.apiId || '',
          fnctId: this.fnctId,
          dsgnFlg: "1",
        }),
        this.rpc.newEditor.get4BServiceDesignDetail({
          apiId: this.currentR4bObj?.apiId,
          d4StusCd: "1", // 0-分析，1-设计；2-测试
          blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
          dsgnFlg: "1",
        }),
      ]).then((res) => {
        const basicData = res[0];
        basicData.flow = res[1].flow;
        this.decisionObj = res[0];
        // console.log(this.decisionObj, "查询交易详情",res);
        basicData.puApiParams.forEach((item, index, paramList) => {
          const paramParent = getParamParent(item, paramList);
          const isHeaderData =
            ["resHeaderData"].includes(paramParent?.paramKey) ||
            (item.paramKey == "bodyOutData" && !item.paramParentId);
          if (
            isHeaderData &&
            item.paramDirection == "1" &&
            !item.actionId &&
            !item.actionName &&
            !item.apSource
          ) {
            item.actionId = "system";
            item.actionName = "平台系统";
            item.apSource = "01";
            item.paraMapgNm = item.paramCName;
            item.paramMappingKey = packageParamKey(item, basicData.puApiParams);
          }
          if (item.apSource == "01") {
            item.actionId = "system";
          } else if (item.apSource == "10") {
            item.actionId = "constantValue";
          }
        });
        if (this.defaultActive == "serviceInfo") {
          this.$nextTick(() => {
            this.$refs.serviceDetailRef.basicData = JSON.parse(
              JSON.stringify(basicData)
            );
          });
        } else if (this.defaultActive == "serviceEdit") {
          this.$nextTick(() => {
            this.$refs.baseInfoRef.basicData = JSON.parse(
              JSON.stringify(basicData)
            );
          });
        }
      });
    },
    //业务4b流程图数据处理
    async getInServiceDesignDetail() {
        // console.log('==========',this.currentR4bObj,this.defaultActive)
      const params = {
        apiId: this.currentR4bObj.apiId,
        d4StusCd: "1", // 0-分析，1-设计；2-测试
        blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
        // dsgnFlg: this.currentD4bObj.dsgnFlg ,
        deployFlg: "1", // 发布标志 0 未发布 1已发布
      };

      let res = await this.rpc.newEditor.get4BServiceDesignDetail(params);
      this.getAllData(res);
      this.currentServObj = res;
      this.currentServObj.svcId = res.apiId;
      this.$nextTick(()=>{
        this.$refs.pattr.currentObj = res;
        this.$refs.pattr.getFlowParams(res);
      })

    },
    //主流程图
    async queryMainFlow() {
      const params = {
        svcId: this.currentD4bObj.apiId,
      };
      let res = await this.rpc.newEditor.queryMainFlow(params);
      this.getFlowAllData(res);
    },
    //获取参数或配置默认参数
    getAllData(val) {
      if (val.flow && val.flow.length == 0) {
        val.flow = this.defaultObj.flow;
        val.position = this.defaultObj.position;
      }
      if (this.isProcessTemp) {
        val.flow = this.tempProcessObj.flow;
        val.position = this.tempProcessObj.position;
      }
      if (this.defaultActive == "businessDecisionProcess"){
        this.decisionData = val;
      } else if (
        this.defaultActive == "businessProcess" &&
        this.picDefault == "4bFlow"
      ) {
        this.dataObj = val;
      }

    },
    /**
     * 根据不同页签调用方法 业务4b页签
     */
    get4BTabsList() {
        if(this.defaultActive == "processDesc" || this.defaultActive == "processDraw"){
            this.showBussinessFlow = true;
        } else {
            if (this.elemActive == "业务交易") {
                if (this.r4bSvcList.length > 0) {
                    if (this.defaultActive == "serviceInfo") {
                        this.getD4bServiceInfo();
                    } else if (this.defaultActive == "businessDecisionProcess") {
                        this.$nextTick(() => {
                            this.getInServiceDesignDetail();
                        });
                    } else if (this.defaultActive == "businessRealize") {
                        this.$nextTick(() => {
                            this.$refs.businessRealizeRef.init();
                        });
                    }
                }
            }else if (this.elemActive == "接口列表") {
                if (this.d4bSvcList.length > 0) {
                    if (this.defaultActive == "serviceEdit") {
                        this.getInterfaceInfo();
                    } else if (this.defaultActive == "businessProcess") {
                        if(this.$refs.pattr){
                            this.$refs.pattr.showType = "service";
                        }
                        this.getFlowDetail();
                    }
                }
            }
        }

    },
    /***
     * 生成代码
     * * */
    async showdialog(obj) {
        if (obj == "1") {
            await this.getSaveCodeList();
            await this.getTranList();
        } else if (obj == "3") {
            await this.getAPPlicationList();
            this.applyConfigVisible = !this.applyConfigVisible;
        }
    },
    handleClose1(obj) {
        this.centerDialogVisible = !this.centerDialogVisible;
    },
    handleClose3(obj) {
        this.applyConfigVisible = false;
    },
    async connectListOperate(type,row){
        const data = {
            authFnctJobInfoId: this.$route.query.authAstFnctInfoId, // 授权作业Id
            fnctNo: this.$route.query.assetFnctNo
        };
        const res = await this.rpc.assetList.queryApplicationFunctionList(
            data
        );
        row = {
            appId: res.transAppId, //工程应用编号
            examId: this.$route.query.examId, //产品实例ID
            editSt: '0', // 设置编辑操作状态
        }
        if(!row.appId){
            this.$alert("当前功能还未关联工程，请先去关联工程", "提示", {
                confirmButtonText: "确定",
                center: true,
                callback: (action) => {
                    return false;
                },
            });
            return;
        }
        let goType = res.transAppId?'transt':'channel';
        let params6 = rowInfos(row);
        //跳转应用配置
        if (type == "configured") {
            if(goType=='transt'){ //交易
                window.open(
                    `/aop-h5-sub/#/aop_deploydesign/productionTable/configurationItem?${params6}`,
                    "_blank"
                );
            } else if(goType=='channel') { //渠道 // 渠道工程直接跳转渠道工程列表第一个的配置页面
                if (res.chnlAppInfoList[0].appTpCd == "1") {
                    if (res.chnlAppInfoList[0].app2LvlTpCd == "2") {
                        //移动端应用
                        if (
                            res.chnlAppInfoList[0].app3LvlTpCd == "1" ||
                            res.chnlAppInfoList[0].app3LvlTpCd == "2"
                        ) {
                            //iOS 或 Android应用
                            window.open(
                                `/aop-h5-sub/#/aop_deploydesign/productionTable/mobileChannelApplication?${params6}`,
                                "_blank"
                            );
                            return;
                        }
                    }
                    window.open(
                        `/aop-h5-sub/#/aop_deploydesign/productionTable/channelApplication?${params6}`,
                        "_blank"
                    );
                }
            }
        }
    },
    // 查询工程应用列表
    async getAPPlicationList() {
        const params = {
            authFnctJobInfoId: this.$route.query.authAstFnctInfoId, // 授权作业Id
            fnctNo: this.$route.query.assetFnctNo
        };
        const res = await this.rpc.assetList.queryApplicationFunctionList(
            params
        );
        this.detailObj = res;
    },
    //生成代码按钮
    async getSaveCodeList(row) {
        const params = {
            appId: this.$route.query.projectId,
            authFnctJobInfoId: this.$route.query.assetFnctNo, // 功能id this.$route.query.authFnctJobInfoId
        };
        let res = await this.rpc.assetList.queryApplicationSaveCodeList(params);
        this.tranData = [];
        let txNm = this.$route.query.modelName || this.$route.query.modelName.trim();
        let newarrList = {
            txNm: txNm,
            txEngNm: res.fnctEngNm || "",
            fnctNo: res.fnctNo || "",
            type: "功能",
            pkgPath: res.pkgPath || '', // 查询到的包路径
        };
        this.tranData.push(newarrList);
        console.log(this.tranData,'this.tranData')
    },
    async getTranList() {
        const params = {
            pageFlg:"1",
            authId: this.$route.query.authAstFnctInfoId,
            beltLine: this.$route.query.bizLineId,
            fnctCd: this.$route.query.assetFnctNo,
            jobNo: this.$route.query.asgntNo,
            currentPage:"1",
            turnPageShowNum:"999",
        };
        let res = await this.rpc.assetList.queryApiInfoListByPageList(params);
        res.apiInfoList.map((item) =>{
            item.txId = item.svcId;
            item.txNm = item.svcNm;
            item.txEngNm = item.svcCd;
            return item
        })
        this.tableData = res.apiInfoList || [];
        this.centerDialogVisible = !this.centerDialogVisible;
    },
    //下载代码按钮
    appyBranchCodeDownLoad(row) {
        this.$confirm("请先确定代码是否生成，再下载代码去保存", "", {
            distinguishCancelAndClose: true,
            center: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
        })
            .then(() => {
                this.downDialog(row);
            })
            .catch((action) => {
                this.$message({
                    type: "info",
                    message: "已取消下载",
                });
            });
    },
    //确定下载代码
    async downDialog(row) {
        const params = {
            fnctId: this.$route.query.fnctId,
        };
        let res = await this.rpc.assetList.queryAppyBranchCodeDownLoad(params);
        if (!res.downUrl) {
            this.$message({
                message: "请先生成代码，再下载代码",
                type: "warning",
            });
        } else {
            downloadEvt(this.$replaceUrl(res.downUrl));
        }
    },
    /**
     * 格式化
     */
    oneKeyAlign(type) {
      type == "decision"
        ? this.$refs.process.oneKeyAlign()
        : this.$refs.processRef.oneKeyAlign();
    },
    /**
     * 主流程业务4b切换
     */
    getFlowDetail() {
      this.picDefault == "mainFlow" && this.queryMainFlow();
      this.picDefault == "4bFlow" && this.getInterfaceDetail();
    },
    /**
     * 主流程图数据处理
     */
    getFlowAllData(val) {
      const position = val.flow.reduce((prev, data, index) => {
        const type = typeEnumObj[data.type];
        const actionId = `${type}${index + 1}`;
        prev[actionId] = `150 ${50 + index * 80} 100 48`;
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
    async submitSystemDesign(){ // 系统设计提交S4
      const params = {
        fnctId: this.assetFnctNo || this.$route.query.assetFnctNo,
        submitTpCd: "02", // 01-上装设计;02-下装S4设计;03-下装S5设计
      };
      let res = await this.rpc.s4design.submitSystemDesign(params);
      this.$notify({
        title: "成功",
        message: "保存成功",
        duration: 2000,
        type: "success",
      });
      this.init()
    },
    async submitFunctionIntoTest(){ // 系统设计提交S4
      const params = {
        fnctNo: this.assetFnctNo || this.$route.query.assetFnctNo,
        sbmterCd: "C4",
      };
      let res = await this.rpc.s4design.submitFunctionIntoTest(params);
      this.$notify({
        title: "成功",
        message: "保存成功",
        duration: 2000,
        type: "success",
      });
      this.init()
    },
    /**
     * 页签切换
     */
    handleGoTo(e) {
      if (this.asideActive == e) return;
      if(e =='2'){
        this.tabsList2 = [
            { v: "基本信息", k: "serviceEdit" },
            { v: "业务流程", k: "businessProcess" },
        ];
        this.defaultActive = 'serviceEdit';
      }
       if(e =='1'){
        this.tabsList2 = [
            { v: "基本信息", k: "serviceInfo" },
            { v: "业务流程", k: "businessDecisionProcess" },
        ];
        this.defaultActive = 'serviceInfo';
      }
      if(e =='0') {
        this.tabsList2 = [
            { v: "流程图", k: "processDraw" },
            { v: "流程描述", k: "processDesc" },
        ];
        this.defaultActive = 'processDraw';
      }
      this.asideActive = e;
      this.$emit("handleGoTo", e, this.currentD4bObj);
    },
    //
    topMenuBtnClick(num){
        if(num == '1'){
            // 系统设计-上装设计预览
        } else if(num == '2'){
            // 系统设计-下装设计S5预览
        } else if(num == '3'){
            // S4设计提交
            console.log("定义")
            this.checkS4SystemDesignResult();
        } else if(num == '4'){
            // c4开发提交
            this.checkS4SystemDesignResult();
        }
    },
    /**
     * 选择接口弹框
     */
    addInterface(val) {
      if(val=='realS4'){ // 选择实现接口
        this.visibleShowAdd = true;
      } else {
        this.visibleShowAdd = true;
      }
    },
    /**
     * 关闭接口弹框
     */
    closeDialog() {
      this.visibleShowAdd = false;
      this.getD4bServiceList();
    },
    /**
     * 业务4b列表----业务实现--绑定接口回调
     */
    completeConfirm() {
      this.get4BTabsList();
    },
    /**
     * 跳转上装
     */
    showRelatedTops() {
      window.open(
        `/h5-pc-terminal-web/layout_preview/#/previewex?kind=01&orderId=${this.isolateWorkspace}&funcId=${this.assetId}&modelVersion=${this.modelVersion}`
      );
    },
    async changeList() {
      await this.getD4bServiceList();
    },
    delInterface() {
      this.getD4bServiceList();
    },
    //跳转商业建模活动开发上装
    async gotoPageD2() {
      let urlParam = this.$router.resolve({
        path: "/aop_businessd2/d2/nodeDesign",
        query: {
          assetId: this.assetId,
          // bizAppNo: res.bizAppNo,
          // bizDomainNo: res.bizDomainNo,
          bizAppVersion: this.modelVersion,
          // bizStatus: res.bizStatus,
          action: "view",
          activeComp: "layout",
          // taskId: res.taskId,
          // bizAppName: res.bizAppName
        },
      });
      window.open(urlParam.href, "_blank");
    },
    async getAssetDetail() {
      let res = await this.rpc.newEditor.getAssetDetail({
        assetId: this.assetId,
        bizAppVersion: this.modelVersion,
      });
      console.log("res->", res);
    },
    //跳转开发工作台上装页面
    gotoPage() {
      let paramsDetail = this.$route.query;
      window.open(
        `/h5-pc-terminal-web/layout_preview/#/runtime_preview?kind=${"02"}&orderId=${"03"}&funcId=${
          paramsDetail.assetFnctNo
        }&modelVersion=${paramsDetail.asgntNo}&projectId=${
          paramsDetail.projectId
        }&type=def&assetId=${paramsDetail.fnctNo}`,
        "_blank"
      );
    },
    //2024年1月11日 S4系统设计结果校验
    async checkS4SystemDesignResult() {
      const  res = await this.rpc.s4design.checkS4SystemDesignResult({
        fnctNo: this.assetFnctNo || this.$route.query.assetFnctNo,
      })
      this.$refs.checkSystemDesignRef.showDialog(res);
    },
    //确认调用提交设计接口
    checkSystemDesign(){
        if(this.isAction){ //s4设计
            this.submitSystemDesign();
        } else {//c4开发
            this.submitFunctionIntoTest();
        }
    },
  },
  created() {
    this.itemInfo = {
            functionId: this.$route.query.assetFnctNo || '',
            assetId: this.$route.query.fnctNo || '',
            bizAppNo: this.$route.query.appId || '',
            bizAppVersion: '',
            jobNo: this.asgntNo || this.$route.query.asgntNo,
        }
    this.init();
  },
  watch: {
    defaultActive(val) {
      if (val == "businessProcess") {
        window.removeEventListener("mousewheel", this.handleMousewheelFlow4b);
        window.addEventListener("mousewheel", this.handleMousewheel, {
          passive: false,
        });
      } else if (val == "businessDecisionProcess") {
        window.removeEventListener("mousewheel", this.handleMousewheel);
        window.addEventListener("mousewheel", this.handleMousewheelFlow4b, {
          passive: false,
        });
      }
    },
    'currentActive': {
        handler(newVal,oldVal){
            if(newVal){
                this.$nextTick(()=>{
                    this.asideActive = newVal;
                })
            }
        },
        deep: true,
        immediate: true,
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.addEventListener();
      this.adjustSize();
    });
  },
  beforeDestroy() {
    this.removeEventListener();
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy();
    next();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_page_d4workbench_workbench_service_define {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .transform-y {
    // transform: translateY(-50%);
    right: 10px;
  }
  .top_right_btns{
    position: absolute;
    display: flex;
    right: 120px;
    align-items: center;
    height: 48px;
    top: 0;
  }
  .top_center_btns{
    position: absolute;
    display: flex;
    right: 120px;
  }

  .design_container {
    display: flex;
    width: 100%;
    overflow: hidden;
    .design_container_aside {
      flex: 0 0 40px;
    }
    .design_container_process {
      flex: 1;
      width: 0;
      .process_contain_box {
        width: 100%;
        height: calc(100vh - 48px);
        display: flex;
        overflow: hidden;
        .process_container {
          width: 100%;
          height: 100%;
          margin: 0 auto;
          display: flex;
          font-family: $font_regular;
          overflow: hidden;
          ::v-deep .el-input__inner {
            border: 1px solid $pri_br_color;
            border-radius: $theme_radius;
          }
          .process_left {
            background: $base_white;
            flex: 0 0 260px;
            border-right: 1px solid $pri_br_color;
          }
          .process_right {
            background: $base_white;
            flex: 0 0 300px;
            // flex: 0 0 260px;
            border-left: 1px solid $pri_br_color;
          }
          .process_main {
            background: $base_white;
            display: inline-block;
            // height: calc(100% - 100px);
            height: calc(100vh - 150px);
            width: 100%;
            // overflow: auto;
            overflow-y: scroll;
            overflow-x: scroll;
            // margin: 0px 24px;
            // margin-top: 50px;
            .process_divMb {
              margin-bottom: 2px;
            }
          }
          .content_wrapper {
            display: flex;
            flex: 1;
            // overflow: auto;
            overflow: hidden;
            .process_middle_wrapper {
              display: flex;
              flex-direction: column;
              flex: 1;
              // overflow: auto;
              // overflow-x: auto;
              overflow: hidden;
              .process_middle {
                @include scrollbar;
                background-color: $base_white;
                flex: 1;
                overflow: auto;
                position: relative;
                // max-height: calc(100vh - 85px);
              }
            }
          }
          .content_wrapper_detail {
            display: flex;
            flex: 1;
            overflow: auto;
            // padding-bottom: 50px;
          }
          .create_container {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: $theme_color;
            font-weight: 600;
            .el-icon-plus {
              font-size: 60px;
              cursor: pointer;
            }
          }
        }
      }
      .params_contain_box {
        width: 100%;
        height: calc(100vh - 48px);
        background-color: $base_white;
        overflow: auto;
      }
    }
  }
  .newService_dialog {
    .el-select {
      width: 100%;
    }
    ::v-deep .el-form-item__label {
      color: $reg_ft_color;
      font-weight: $font_weight_600;
    }
  }
  .params_contain_box {
    width: 100%;
    height: 100%;
    height: calc(100vh - 48px);
    background-color: $base_white;
    overflow: auto;
  }
  .info_container_main {
    background-color: $base_white;
    .info_container_fr {
      ::v-deep .search_bar {
        width: 100%;
        margin: 0 auto;
      }
      // padding: 16px 24px;
    }
  }
  .steps_box {
    background-color: $base_white;
    padding: 0px 100px;
    width: 100%;
    ::v-deep .el-step__head.is-finish {
      color: $base_white;
      border-color: #358aff;
      .el-step__icon.is-text {
        background-color: #358aff;
      }
    }
    ::v-deep .el-step__head.is-process {
      color: #333;
      border-color: #f8f8f8;
      .el-step__icon.is-text {
        background-color: #f8f8f8;
        .el-step__icon-inner {
          font-weight: normal;
        }
      }
    }
    ::v-deep .el-step__title.is-process {
      font-weight: normal;
      font-size: 12px;
    }
    ::v-deep .el-step__title.is-finish {
      color: #303133;
      font-size: 12px;
    }
  }
  .form_box {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    ::v-deep .el-textarea__inner {
      width: 400px;
    }
    .el-input,
    .el-select {
      width: 400px;
    }
  }
  .form_item_flex {
    display: flex;
    .icon_right {
      margin-left: 5px;
      display: flex;
      flex-flow: column;
      font-size: 21px;
      i {
        cursor: pointer;
        line-height: 20px;
      }
    }
  }
  .d2Info_dialog {
    ::v-deep .el-dialog {
      margin-top: 5vh !important;
    }
    .iframe_content {
      width: 100%;
      height: 1200px;
    }
  }
  ::v-deep .el-dialog__wrapper {
    overflow: auto!important;
  }
  .trigger_diy {
    position: absolute;
    right: 280px;
    top: 50%;
    width: 11px;
    height: 84px;
    line-height: 84px;
    color: #fff;
    font-size: 18px;
    padding-right: 10px;
    cursor: pointer;
    transition: background 0.3s ease;
    z-index: 2;
    background: rgba(0, 0, 0, 0);
    border-top: 11px solid rgba(0, 0, 0, 0);
    border-bottom: 11px solid rgba(0, 0, 0, 0);
    border-left: 11px solid #409eff;
    i {
      margin-left: -15px;
      margin-top: -25px;
      vertical-align: middle;
    }
  }
  .trigger_diy_without_sidebar {
    right: 0px;
  }
  .check_formater_btn {
    margin-left: 16px;
    @include normal_button_common;
  }
  .content_header {
    font-family: $font_medium;
    font-size: 16px;
    color: $pri_ft_color;
    letter-spacing: 0;
    margin-bottom: 20px;
    font-weight: $font_weight_600;
  }
  .params_style {
    padding: 24px;
  }
  .process_content {
    position: relative;
    .flow_aside {
      display: flex;
      position: absolute;
      flex-direction: column;
      width: 40px;
      height: 100%;
      z-index: 10;
      ::v-deep .el-menu {
        height: 100%;
        .el-menu-item {
          height: auto;
          padding: 10px 0;
          padding-left: 0 !important;
          border-bottom: 1px solid #e6e6e6;
          text-orientation: upright;
          letter-spacing: 5px;
          div {
            writing-mode: vertical-lr;
            margin-left: -10px;
            margin-right: -10px;
          }
          img {
            width: 14px;
            height: 14px;
            margin-bottom: 8px;
          }
        }
      }
    }
  }
  .btn_list {
    // position: absolute;
    // right: 0;
    // top: 20px;
    // float: right;
    background: #ffffff;
    display: flex;
    // justify-content: flex-end;
    // align-items: center;
    flex-direction: row-reverse;
    padding: 10px;
  }
  .btn_align {
    margin: 0px 5px;
  }
  .tabs_list {
    display: flex;
    justify-content: center;
    position: relative;
    // margin-top: 10px;
    .left_process,
    .right_process {
      width: 50%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #e7e7e7;
      background: #ffffff;
      cursor: pointer;
      &.active {
        color: #358aff;
      }
      &.left_border {
        border-left: none;
      }
    }

    .process_item {
      width: 50%;
    }
  }
  .decision_btn_list {
    // float: right;
    display: flex;
    flex-direction: row-reverse;
    background-color: #ffffff;
    padding: 10px;
  }
  .no_data {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .process_main_decision {
    background: $base_white;
    display: inline-block;
    // height: calc(100% - 100px);
    height: calc(100vh - 150px);
    width: 100%;
    // overflow: auto;
    overflow-y: scroll;
    overflow-x: scroll;
  }
  .process_main_flow {
    background: $base_white;
    display: inline-block;
    // height: calc(100% - 100px);
    height: calc(100vh - 100px);
    width: 100%;
    // overflow: auto;
    overflow-y: scroll;
    overflow-x: scroll;
  }
}
</style>
