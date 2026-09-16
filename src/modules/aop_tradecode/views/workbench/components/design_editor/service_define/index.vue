<template>
  <div class="aop_tradecode_page_d4workbench_workbench_service_define">
    <!-- 顶部菜单 -->
    <AsNav @navBack="navBack" :asideActive="asideActive">
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
    </AsNav>
    <!-- 主体 -->
    <div class="design_container">
      <div class="design_container_aside">
        <Aside isClickTips @goTo="handleGoTo" :active="asideActive"></Aside>
      </div>
      <div class="design_container_process">
        <div class="process_contain_box">
          <div class="process_container">
            <!-- 业务元素 -->
            <Pelem
              ref="pelem"
              v-if="asideActive=='1' || asideActive=='2'"
              class="process_left"
              :jobNo="jobNo"
              :fnctCd="fnctCd"
              :asideActive="asideActive"
              :isolateWorkspace="isolateWorkspace"
              :d4bSvcList="d4bSvcList"
              :r4bSvcList="r4bSvcList"
              :currentD4bObj="currentD4bObj"
              :currentR4bObj="currentR4bObj"
              :assetFnctNo="assetFnctNo"
              @showCreateDialog="showCreateDialog"
              @showD2InfoDialog="showD2InfoDialog"
              @pickElemEvent="pickElemEvent"
              @elemTabClick="elemTabClick"
              @getD4bServiceList="getD4bServiceList"
              @getR4bServiceList="getR4bServiceList"
              @d4bServClick="d4bServClick"
              @r4bServClick="r4bServClick"
              @addInterface="addInterface"
              @delInterface="delInterface"
            ></Pelem>
            <!-- 浏览 -->
            <div class="content_wrapper" v-show="topNavActive == 'read'">
              <!-- 画布 -->
              <div class="process_middle_wrapper">
                <!-- 页签 -->
                <ServiceTabs
                  :tabsList="tabsList"
                  :defaultActive="defaultActive"
                  @tabClick="handleTabClick"
                  @tabEdit="handleTabsEdit"
                >
                </ServiceTabs>
                <div
                  class="process_middle"
                  v-show="
                    defaultActive == 'businessRealize' ||
                    defaultActive == 'serviceEdit' ||
                    defaultActive == 'serviceInfo'
                  "
                >
                  <!-- 编辑 -->
                  <div
                    v-show="defaultActive == 'serviceEdit'"
                    class="content_wrapper_detail"
                  >
                    <ServiceEdit
                      v-if="d4bDataShow"
                      ref="baseInfoRef"
                      @changeList="changeList"
                      @showRelatedTops="gotoPage"
                      :currentD4bObj="currentD4bObj"
                    ></ServiceEdit>
                  </div>
                  <div
                    class="no_data"
                    v-if="!d4bDataShow && defaultActive == 'serviceEdit'"
                  >
                    暂无数据
                  </div>
                  <!-- 详情 -->
                  <div
                    class="content_wrapper_detail"
                    v-show="defaultActive == 'serviceInfo'"
                  >
                    <ServiceDetail
                      ref="serviceDetailRef"
                      v-if="r4bDataShow"
                      @showRelatedTops="gotoPageD2"
                    ></ServiceDetail>
                  </div>
                  <div
                    class="no_data"
                    v-if="!r4bDataShow && defaultActive == 'serviceInfo'"
                  >
                    暂无数据
                  </div>
                  <!-- 业务实现 -->
                  <div v-show="defaultActive == 'businessRealize'">
                    <BusinessRealize
                      :currentR4bObj="currentR4bObj"
                      :currentR4bList="currentR4bList"
                      ref="businessRealizeRef"
                      @completeConfirm="completeConfirm"
                    ></BusinessRealize>
                  </div>
                </div>
                <!-- 接口流程图 -->
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
                  <!-- <div class="tabs_list">
                    <div
                      class="left_process"
                      @click.stop="picClick('mainFlow')"
                      :class="{ active: picDefault == 'mainFlow' }"
                    >
                      <span>主流程</span>
                    </div>
                    <div
                      class="left_process left_border"
                      @click.stop="picClick('4bFlow')"
                      :class="{ active: picDefault == '4bFlow' }"
                    >
                      <span>4b流程</span>
                    </div>
                  </div> -->
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
                <!-- 业务4b流程图 -->
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
            <!-- 属性 -->
            <PattrDecision
              v-if="defaultActive == 'businessDecisionProcess'"
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
            <Pattr
              v-if="
                defaultActive == 'businessProcess' && picDefault == '4bFlow'
              "
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
import ProcessDecision from "@m/core/components/decision_process/comps";
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
      asideActive: "1",

      // D2页面的URL
      d2Url,
      // 工具栏宽度
      toolsWidth: "",
      //页签列表
      tabsList: [
        { v: "基本信息", k: "serviceEdit" },
        { v: "业务流程", k: "businessProcess" },
      ],
      //当前页签
      defaultActive: "serviceEdit",
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
      elemActive: "接口列表",

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
      fnctNm: "",
    };
  },
  computed: {
    ...mapState("aop_tradecode", ["tempProcessObj", "isProcessTemp"]),
    isAction() {
      return this.$route.query.pageMode === 's4design'
    },
    noEdit() {
      return (
        this.editBtnDisabled ||
        this.pageType == "read" ||
        this.pageMode == "read" ||
        (this.currentD4bObj && this.currentD4bObj.dsgnFlg == 0) ||
        this.d4bSvcList.length == 0
      );
    },
    hasCreated() {
      if (this.elemActive == "业务4b列表") {
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
        if(this.$route.query.typeOf4b == '1'){ // 从后端接口列表过来
            this.serviceSeq = this.$route.query.serviceSeq
        }
      this.servId = this.$route.query.servId;
      this.atomId = this.$route.query.atomId;
      this.pageMode = this.$route.query.pageMode; // 开发页面进入隐藏保存
      this.apiId = this.$route.query.apiId;
      this.orderId = this.$route.query.orderId;
      this.jobNo = this.$route.query.jobId;
      this.fnctCd = this.$route.query.admiId;
      this.beltLine = this.$route.query.beltLine;
      this.authId = this.$route.query.authId;
      this.isolateWorkspace = this.$route.query.isolateWorkspace;
      this.modelVersion = this.$route.query.modelVersion || "";
      this.asgntNo = this.$route.query.asgntNo;
      this.appId = this.$route.query.appId;
      this.competitorId = this.$route.query.competitorId;
      this.assetFnctNo = this.$route.query.fnctId;
      this.authAstFnctInfoId = this.$route.query.authAstFnctInfoId;
      this.assetId = this.$route.query.fnctNo;
      this.queryDetail = {
        authFnctJobInfoId: this.authAstFnctInfoId,
        asgntNo: this.asgntNo,
        assetFnctNo: this.assetFnctNo,
        bizDomainNo: this.beltLine,
        bizAppId: this.appId,
        cstNo: this.competitorId,
        authAstFnctInfoId: this.authAstFnctInfoId,
      };
      this.getD4bServiceList();
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
      this.navReturn = e;
      this.goRoute();
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
      console.log("-----", e);
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
      console.log("返回流程图");
      this.fourRAttrFlag = false;
      this.currentParentCpnInfo = {};
      await this.refreshFlow();
      this.$refs.pattr.getFlowParams(this.currentServObj);
    },
    // 返回服务的流程图决策树
    async handleDecisionBackBtn() {
      console.log("返回流程图");
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
      } else {
        console.log("获取对应D4b服务的流程图，更新画布内容", e);
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
    elemTabClick(e) {
      this.elemActive = e;
      console.log("elemTabClick", e);
      if (e == "业务4b列表") {
        this.tabsList = [
          { v: "基本信息", k: "serviceInfo" },
          { v: "业务流程", k: "businessDecisionProcess" },
          { v: "业务实现", k: "businessRealize" },
        ];
        this.defaultActive = "serviceInfo";
        this.isRead = true;
        this.editBtnDisabled = false;
        this.getR4bServiceList();
        // this.getAssetDetail();
      } else {
        this.tabsList = [
          { v: "基本信息", k: "serviceEdit" },
          { v: "业务流程", k: "businessProcess" },
        ];
        this.defaultActive = "serviceEdit";
        this.isRead = true;
        this.editBtnDisabled = true;
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
    // 接口列表
    async getD4bServiceList(data) {
      let svcNm = data;
      console.log(svcNm);
      const params = {
        // assetId: this.assetId || "FM-ZC-2023-000663",
        // isolateWorkspace: this.isolateWorkspace || "T1",
        svcNm, //名称
        pageFlg: "0", //分页标志：0-不分页；1-分页
        jobNo: this.asgntNo, //作业号
        fnctId: this.$route.query.fnctId || '', //功能编号   FM-ZC-2023-000663
        beltLine: this.beltLine, //业务域   FM-YWY-2022-000001
        authId: this.authAstFnctInfoId, //授权编号  FM-AFJI-2023041100001273
      };
      const res = await this.rpc.newEditor.getInterfaceList(params);
      this.d4bSvcList = res.apiInfoList;
      this.d4bSvcList.forEach((item) => {
        item.apiId = item.svcId;
      });
      console.log(this.d4bSvcList, "d4bSvcList");
      this.infoShow = true;
      if (this.apiId) {
        this.currentD4bObj =
          this.d4bSvcList.find((item) => item.svcId == this.apiId) || {};
      } else if (this.serviceSeq){
           this.currentD4bObj =
          this.d4bSvcList.find((item) => item.svcSeq == this.serviceSeq) || {};
      } else {
        this.currentD4bObj = this.d4bSvcList[0];
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
      console.log("d4bServClick", e);
      this.currentD4bObj = e;
      this.currentApiId = e.svcId;
      this.get4BTabsList();
    },
    //接口主流程数据处理
    async getInterfaceInfo() {
      Promise.all([
        this.rpc.newEditor.getD4bServiceInfo({
          svcId: this.currentD4bObj && this.currentD4bObj.apiId,
          // svcStsCd: this.currentD4bObj && this.currentD4bObj.svcRlsFlg, // 1发布，0未发布
          fnctId: this.fnctId,
          dsgnFlg: "1",
        }),
        this.rpc.newEditor.getServiceDesignDetail({
          apiId: this.currentD4bObj.apiId,
          d4StusCd: "1", // 0-分析，1-设计；2-测试
          blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
          dsgnFlg: "1",
        }),
      ]).then((res) => {
        const basicData = res[0];
        this.interfaceObj = res[0];
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
            this.$refs.baseInfoRef.currentD4bObj = this.currentD4bObj;
          });
        }
      });
    },
    //接口详情流程图
    async getInterfaceDetail() {
      const params = {
        // apiId: this.currentApiId,
        apiId: this.currentD4bObj.apiId,
        d4StusCd: "1", // 0-分析，1-设计；2-测试
        blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
        // dsgnFlg: this.currentD4bObj.dsgnFlg ,
        deployFlg: "1", // 发布标志 0 未发布 1已发布
      };

      let res = await this.rpc.newEditor.getServiceDesignDetail(params);
      console.log("getServiceDesignDetail");
      this.getAllData(res);
      this.interfaceObj = res;
      this.interfaceObj.svcId = res.apiId;
      this.$refs.pattr.currentObj = res;
      this.$refs.pattr.getFlowParams(res);
    },
    //业务4b列表查询
    async getR4bServiceList(data) {
      let r4bNm = data;
      console.log(r4bNm);
      const params = {
        assetId: this.assetFnctNo || "FM-L2-FUN-2023-000014644",
        // assetId: "FM-GZT-2022-000001",
        // assetId: this.fnctCd,
        // isolateWorkspace: this.isolateWorkspace || "T1",
        isolateWorkspace: "D2",
        // assetId: "FM-ZC-2023-049044",
        modelVersion: "100001",
      };
      const res = await this.rpc.newEditor.get4BRelationServList(params);
      this.r4bSvcList = res.list;
      this.currentR4bObj = this.r4bSvcList[0];
      this.currentR4bList = res.list || []; // 增加一个所有4b存放
      if (this.r4bSvcList?.length > 0) {
        // this.r4bServClick(this.currentR4bObj);
        this.getD4bServiceInfo();
        this.r4bDataShow = true;
      } else {
        this.r4bSvcList = [];
        this.r4bDataShow = false;
      }
    },
    //点击业务4b列表
    async r4bServClick(e) {
      console.log("r4bServClick", e);
      this.currentR4bObj = e;
      this.get4BTabsList();
    },
    // 查询业务4B服务详情
    async getD4bServiceInfo() {
      Promise.all([
        this.rpc.newEditor.get4BServiceInfo({
          svcId: this.currentR4bObj && this.currentR4bObj.apiId,
          // svcStsCd: this.currentD4bObj && this.currentD4bObj.svcRlsFlg, // 1发布，0未发布
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
        console.log(this.decisionObj, "===-----");
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
            this.$refs.baseInfoRef.currentD4bObj = this.currentD4bObj;
          });
        }
      });
    },
    //业务4b流程图数据处理
    async getInServiceDesignDetail() {
      const params = {
        // apiId: this.currentApiId,
        apiId: this.currentR4bObj.apiId,
        d4StusCd: "1", // 0-分析，1-设计；2-测试
        blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
        // dsgnFlg: this.currentD4bObj.dsgnFlg ,
        deployFlg: "1", // 发布标志 0 未发布 1已发布
      };

      let res = await this.rpc.newEditor.get4BServiceDesignDetail(params);
      console.log("getServiceDesignDetail");
      this.getAllData(res);
      this.currentServObj = res;
      this.currentServObj.svcId = res.apiId;
      this.$refs.pattr.currentObj = res;
      this.$refs.pattr.getFlowParams(res);
    },
    //主流程图
    async queryMainFlow() {
      const params = {
        svcId: this.currentD4bObj.apiId,
      };
      let res = await this.rpc.newEditor.queryMainFlow(params);
      console.log("queryMainFlow", res);
      this.getFlowAllData(res);
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
      if (this.defaultActive == "businessDecisionProcess")
        this.decisionData = val;
      else if (
        this.defaultActive == "businessProcess" &&
        this.picDefault == "4bFlow"
      )
        this.dataObj = val;
    },
    /**
     * 根据不同页签调用方法 业务4b页签
     */
    get4BTabsList() {
      if (this.elemActive == "业务4b列表") {
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
            console.log("业务4b列表----业务实现");
          }
        }
      } else {
        if (this.d4bSvcList.length > 0) {
          if (this.defaultActive == "serviceEdit") {
            this.getInterfaceInfo();
          } else if (this.defaultActive == "businessProcess") {
            this.getFlowDetail();
          }
        }
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
    /**
     * 页签接口定义-接口设计切换
     */
    handleGoTo(e) {
      console.log("顶部按钮组点击----", e);
      if (this.asideActive == e) return;
      this.asideActive = e;
      this.$emit("handleGoTo", e, this.currentD4bObj);
    },
    /**
     * 选择接口弹框
     */
    addInterface() {
      this.visibleShowAdd = true;
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
     * 跳转前端
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
    //跳转商业建模活动开发前端
    async gotoPageD2() {
      // let res =await this.rpc.newEditor.getAssetDetail({
      //   assetId:this.assetId,
      //   bizAppVersion:this.modelVersion
      // })
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
    //跳转开发工作台前端页面
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
  },
  created() {
    this.init();
    this.rpc.businessRules.queryFunctionRelInfo({
            fnctId: this.fnctId || this.$route.query.fnctId
        }).then(res => {
          this.fnctNm = res.fnctNm;
        })
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
    transform: translateY(-50%);
    right: 10px;
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
              }
            }
          }
          .content_wrapper_detail {
            display: flex;
            flex: 1;
            overflow: auto;
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
    overflow: hidden;
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
