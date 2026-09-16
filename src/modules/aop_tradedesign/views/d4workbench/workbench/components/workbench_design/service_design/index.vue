<template>
  <div class="aop_tradedesign_page_d4workbench_workbench_service_design">
    <!-- 顶部菜单 -->
    <AsNav @navBack="navBack" :asideActive="asideActive">
      <div slot="textProps">{{ fnctNm }}</div>
      <div slot="radioProps">
        <el-radio-group v-model="navDefaultActive" size="small" @change="changeTabs">
          <el-radio-button label="s">交易流程</el-radio-button>
          <el-radio-button label="p" :disabled="saveDisabled || fourRAttrFlag"
            >参数设置</el-radio-button
          >
        </el-radio-group>
      </div>
      <div slot="btnProps">
        <el-button
          type="primary"
          v-show="navDefaultActive == 's' && fourRAttrFlag"
          size="mini"
          @click="handleBackBtn"
          >返回</el-button
        >
        <el-button
          v-if="pageMode != 'read'"
          :disabled="saveDisabled"
          type="primary"
          @click="toSave"
          >{{ saveBtnName }}</el-button
        >
        <!-- <el-button
          v-if="pageMode != 'read' && designerFlg == '2'"
          :disabled="saveDisabled"
          type="primary"
          @click="toSave"
          >保存编排</el-button
        >
        <el-tag
          size="small"
          type="warning"
          class="tips"
          v-show="designerFlg == 0 && navDefaultActive == 's' && !fourRAttrFlag"
          >默认无法编辑，点击开始设计按钮后，独占设计</el-tag
        >
        <el-button
          v-show="
            designerFlg == 0 &&
            pageMode != 'read' &&
            navDefaultActive == 's' &&
            !fourRAttrFlag
          "
          type="primary"
          size="mini"
          class="design_btn"
          @click="startDesign"
          >开始设计</el-button
        >
        <el-button
          v-show="
            designerFlg == 2 &&
            pageMode != 'read' &&
            navDefaultActive == 's' &&
            !fourRAttrFlag
          "
          type="primary"
          size="mini"
          @click="completeDesign"
          >设计完成</el-button
        > -->
      </div>
    </AsNav>
    <!-- 主体 -->
    <div class="design_container">
      <!-- <div class="design_container_aside">
        <Aside isClickTips @goTo="handleGoTo" :active="asideActive"></Aside>
      </div> -->
      <div class="design_container_process">
        <!-- 流程图 -->
        <div class="process_contain_box" v-show="navDefaultActive == 's'">
          <div class="process_container">
            <!-- 元素 -->
            <Pelem
              ref="pelem"
              class="process_left"
              :fnctId="fnctId"
              :fnctCd="fnctCd"
              :authAppDtlId="authAppDtlId"
              :currentApiId="currentApiId"
              :currentServObj="currentServObj"
              :detailType="detailType"
              :fourRAttrFlag="fourRAttrFlag"
              :authId="authId"
              :jobNo="jobNo"
              :svcId="svcId"
              :currentParentCpnInfo="currentParentCpnInfo"
              :isRead="pageMode == 'read'"
              @showCreateDialog="showCreateDialog"
              @showD2InfoDialog="showD2InfoDialog"
              @pickElemEvent="pickElemEvent"
              @imgClick="checkNeeds"
              @d4bOptionsChange="d4bOptionsChange"
              @servClick="servClick"
              @handleDataView="handleDataView"
              @showServInfo="showServInfo"
              @toSave="toSave"
              @addService="addService"
            ></Pelem>
            <!-- 画布 -->
            <div class="process_middle">
              <div class="btn_style">
                <el-button v-if="!fourRAttrFlag" class="btn_align" type="primary" size="mini" @click="checkTrans">校验</el-button>
                <el-button class="btn_align" type="primary" size="mini" @click="oneKeyAlign">一键对齐</el-button>
              </div>
              <!-- <Ptools
                @pickElemEvent="pickElemEvent"
                @toSave="toSave"
                @toServ="toServ"
                :style="{ width: toolsWidth }"
                :saveDisabled="saveDisabled"
                :pageMode="pageMode"
                :designerFlg="designerFlg"
                :designerDesc="designerDesc"
                :fourRAttrFlag="fourRAttrFlag"
                :currentServObj="currentServObj"
              >
              </Ptools> -->
              <!-- <div
                v-if="fourRAttrFlag"
                slot="topBtnArea"
                class="top_btn_area"
              >
                <div class="btn back" @click="handleBackBtn">返回</div>
                <div
                  v-if="pageMode != 'read'"
                  class="btn save"
                  @click="toSave"
                >
                  保存
                </div>
              </div> -->
              <div class="process_box">
                <Process
                  class="process_main"
                  :class="{ four_r: fourRAttrFlag }"
                  ref="process"
                  pageType="downDesign"
                  :dataObj="dataObj"
                  :fourRAttrFlag="fourRAttrFlag"
                  :dataViewVisible="dataViewVisible"
                  :scaleRate="scaleRate"
                  :layoutActionList="layoutActionList"
                  @getAttrEvent="getAttrEvent"
                  @getConditionEvent="getConditionEvent"
                  @getConditionDbClickEvent="getConditionDbClickEvent"
                  @getSvgClickEvent="getSvgClickEvent"
                  @handleNewRectAdd="handleNewRectAdd"
                  @generateLineCondPrit="generateLineCondPrit"
                  @itemEditClick="editNewD5Service"
                  @handleActionChange="handleActionChange"
                  @showServInfo="showServInfo"
                  :isRead="pageMode == 'read'"
                >
                  <!-- <template #cpnServiceProps="data">
                    <el-button
                      type="primary"
                      size="mini"
                      @click.stop="editNewD5Service(data)"
                      >编辑</el-button
                    >
                  </template> -->
                  <!-- <template #createNeedsProps="data">
                    <el-button type="primary" size="mini" @click="editNeeds(data)"
                      >编辑需求</el-button
                    >
                    <div class="process_divMb"></div>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="checkNeeds(data)"
                      >需求详情</el-button
                    >
                  </template>
                  <template #hasCreateNeedsProps="data">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="checkNeeds(data)"
                      >组件详情</el-button
                    >
                  </template> -->
                </Process>
              </div>
            </div>
            <!-- 属性 -->
            <Pattr
              ref="pattr"
              class="process_right"
              :dicArray="dicArray"
              :fnctId="fnctId"
              :currentServObj="currentServObj"
              :isRead="pageMode == 'read'"
              :fourRAttrFlag="fourRAttrFlag"
              :currentApiId="currentApiId"
              :currentParentCpnInfo="currentParentCpnInfo"
              @updateConditionEvent="updateConditionEvent"
              @upDateFlowParams="upDateFlowParams"
              @updateDataParams="updateDataParams"
              @handleCondPritChange="handleCondPritChange"
              @updateRecordFlow="updateRecordFlow"
              @upDateServParams="upDateServParams"
              @toSave="toSave"
              @getDataList="getDataList"
              @updateServiceArrangeList="updateServiceArrangeList"
            ></Pattr>
          </div>
        </div>

        <!-- 参数设置 -->
        <div class="params_contain_box" v-show="navDefaultActive == 'p'">
          <Params
            ref="paramsRef"
            :currentServObj="currentServObj"
            :fourRAttrFlag="fourRAttrFlag"
          >
          </Params>
        </div>
      </div>
    </div>

     <!-- 校验交易 -->
     <CheckTrans ref="checkTrans"></CheckTrans>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { mapActions, mapState } from "vuex";
import Process from "@m/core/components/process/comps";
import AsNav from "./components/d4design_nav";
import Pattr from "@m/core/components/process/attr";
import Pelem from "./components/d4design_process/elem";
import { html2Escape } from "@m/utils/html2e.js";
import { reList, mixList } from "@m/utils/paramTree";
// import Aside from "./components/d4design_process/aside";
// import Ptools from "./components/d4design_process/tools";
// import { getSessionStorage } from "@m/utils/localStorage";
import Params from "./components/d4design_process/params";
import CheckTrans from "../../download_design/components/check_trans";
import { getSessionStorage, setSessionStorage } from "@m/utils/localStorage.js";
import { actionNameToNoActionId } from "@m/utils/normalData";
import {
  unduplicated,
} from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    Pattr,
    Process,
    Pelem,
    AsNav,
    // Aside,
    // Ptools,
    Params,
    CheckTrans
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
    authId: {
      type: String,
      default: () => "",
    },
    jobNo: {
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
    detailType: {
      type: String,
      default: () => "",
    },
    svcId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      dataViewVisible: false,
      //4R组件默认数据
      defaultFourRObj: {
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
              {
                name: "actionMsg",
                value: "",
              },
              {
                name: "actionSeq",
                value: "R0000",
              },
              {
                name: "actionFrntSeq",
                value: "",
              },
              {
                name: "actionPostSeq",
                value: "",
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
              {
                name: "actionMsg",
                value: "",
              },
              {
                name: "actionSeq",
                value: "R0001",
              },
              {
                name: "actionFrntSeq",
                value: "",
              },
              {
                name: "actionPostSeq",
                value: "",
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
      //当前ID与状态
      servId: "",
      //状态 stusCd: 01-待开发，02-开发中，03-开发完成
      stusCd: "",
      // 服务定义 (04-完成服务定义，05-暂定服务定义)
      deployFlg: "",
      //参数下拉数据
      dicArray: [],
      //页面传参
      activeView: "page",
      showType: "process",

      //服务组件相关
      //控制创建服务组件对话框显示或隐藏
      newServiceVisiable: false,
      //创建服务组件数据
      newServiceForm: {
        apiName: "", // 服务名称
        apiCode: "", // 服务编码
        arsId: "",
        apiGroupId: "", // 所属分组
        apiVersion: "1.0.0", // 版本号
      },
      currentNewService: {},
      //开发完成
      isConfirmPop: false,
      //服务定义
      isDefinePop: false,
      definePopDesc: "暂停服务定义",
      definePopType: "0",
      atomId: "",
      // 业务类型下拉框数据
      businessList: [],
      // 导航栏页签
      navDefaultActive: "s",
      // 新增组件页签
      steps: 1,
      // 服务组件列表
      dataList: [],
      // 列表参数
      tableColumn: [
        {
          prop: "apiCode",
          label: "D5服务ID",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiName",
          label: "D5服务名称",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "funcDescr",
          label: "D5服务描述",
          minWidth: "25%",
          type: "text",
          tooltip: true,
        },
        // {
        //   prop: "grpgNm",
        //   label: "所属分组",
        //   width: "110",
        //   type: "text",
        // },
        // {
        //   prop: "aaName",
        //   label: "所属应用",
        //   width: "80",
        //   type: "text",
        //   tooltip: false,
        // },
        {
          prop: "serviceCount",
          label: "关联D4b服务",
          width: "105",
          type: "textClick",
          operate: "textClick",
          tooltip: false,
          align: "center",
        },
        {
          prop: "serviceSts",
          label: "服务状态",
          width: "90",
          filter: "cpnStusCd",
          type: "textClassList",
          align: "center",
          textClassList: [
            { class: "unpublish status", val: "01" },
            { class: "publishing status", val: "02" },
            { class: "unchecked status", val: "03" },
            { class: "finished status", val: "04" },
          ],
        },
        // {
        //   prop: "",
        //   label: "操作",
        //   width: "50",
        //   type: "button",
        //   buttonList: [{ desc: "查看", operate: "check" }],
        // },
      ],
      // 分页器参数
      pager: { currentPage: "1", turnPageShowNum: "10", total: 0 },
      //头部搜索
      searchForm: [
        {
          type: "input",
          model: "nmOrNo",
          placeholder: "搜索R5服务名称",
          style: {
            width: "400px",
          },
        },
      ],
      // 搜索条件
      form: {
        nmOrNo: "", // 名称
      },
      pageMode: "",
      // 记录流程图数据
      recordFlow: "",
      // 记录流程图位置信息
      recordPosition: "",
      // 返回位置 home 为返回列表
      navReturn: "",
      // 侧边栏的当前选中项索引
      asideActive: "1",
      // 跳转确认框的配置信息
      confirmOptions: {
        distinguishCancelAndClose: true,
        confirmButtonText: "保存后跳转",
        cancelButtonText: "不保存直接跳转",
      },
      // 是否已创建D4分析
      hasCreated: true,
      // D2信息对话框显示或隐藏
      d2InfoVisiable: false,
      // 工具栏宽度
      toolsWidth: "",
      currentApiId: "",
      servVisible: false,
      currentServObj: {},
      currentD4bObj: {},
      bkList: [],
      sysList: [],
      apiGroupList: [],
      isDevConfig: false,
      groupVisible: false,
      designerFlg: null, //当前服务可设计的标识 0 无人设计 1 别人已设计 2 自己设计
      designerDesc: "", //当前设计人
      isDesign: true, //根据服务可设计标识，判断是否可拖拽流程图
      fourRAttrFlag: false, //是否双击4R组件
      storeData: {}, //存放当前服务的流程图信息
      storeApiData: {}, //存放当前服务的信息
      typeInterface: "",
      fnctNm: {}, //功能名称
      scaleRate: 1, //流程图的缩放比例
      currentParentCpnInfo: {}, //父组件的信息（4R、循环、异步）
      layoutActionList: [], // 交易编排表
      bizLineId:"",
      competitorId:"",
      transId: "",
      beltLineNm:"",
      appId: "", // 业务应用id
      descList:{},
      keyList:{},
      keyOtherList:{},
      keywordList:{},
      javaKeyWord: [
        "private",
        "protected",
        "public",
        "abstract",
        "class",
        "extends",
        "final",
        "implements",
        "interface",
        "native",
        "new",
        "static",
        "strictfp",
        "synchronized",
        "transient",
        "volatile",
        "break",
        "case",
        "continue",
        "default",
        "do",
        "else",
        "for",
        "if",
        "instanceof",
        "return",
        "switch",
        "while",
        "assert",
        "catch",
        "finally",
        "throw",
        "throws",
        "try",
        "import",
        "package",
        "boolean",
        "byte",
        "char",
        "double",
        "float",
        "int",
        "long",
        "short",
        "super",
        "this",
        "void",
        "goto",
        "const",
        "null",
        "true",
        "false",
      ],
    };
  },
  computed: {
    // ...mapState("aop_tradedesign", ["tempProcessObj", "isProcessTemp"]),
    // 是否修改过流程图
    hasChangeProcess() {
      // if (this.pageMode == "read" || this.isDesign) return false;
      if (this.pageMode == "read") return false;
      const dataObj = this.pcTranform();
      if (!dataObj.flow.length) return false;
      return (
        this.recordFlow !== JSON.stringify(dataObj.flow) ||
        this.recordPosition !== JSON.stringify(dataObj.position)
      );
    },
    saveDisabled() {
      return this.pageMode == "read";
      // return (
      //   (this.navDefaultActive == "a"
      //     ? this.isDevConfig
      //     : !this.currentD4bObj.svcId) ||
      //   this.currentD4bObj.dsgnFlg == "0" ||
      //   this.pageMode == "read" ||
      //   Object.keys(this.currentD4bObj).length == 0
      // );
    },
    checkDisabled() {
      return this.navDefaultActive == "s"
        ? this.isDevConfig
        : !this.currentD4bObj.svcId ||
            Object.keys(this.currentD4bObj).length == 0;
    },
    // 默认数据
    defaultObj() {
      if (this.currentServObj.isUploadFile == "1") {
        return {
          flow: [
            {
              cpntId: "",
              id: "inputAction1",
              referId: "inputAction",
              type: "inputAction",
              transition: [
                {
                  condPrit: "0",
                  desc: "bottom-top",
                  name: "inputAction1.transition0",
                  polyline: "245.1092529296875 55.00421142578125 245.8266105654457 146.01681518554688",
                  value: "uploadAction3",
                }
              ],
              conf: [
                {
                  name: "actionDesc",
                  value: `${this.currentServObj.apiName || "input"}`,
                },
                {
                  name: "actionMsg",
                  value: "",
                },
                {
                  name: "actionSeq",
                  value: "R0000",
                },
                {
                  name: "actionFrntSeq",
                  value: "",
                },
                {
                  name: "actionPostSeq",
                  value: "",
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
                  value: `${this.currentServObj.apiName + "结束" || "output"}`,
                },
                {
                  name: "actionMsg",
                  value: "",
                },
                {
                  name: "actionSeq",
                  value: "R0002",
                },
                {
                  name: "actionFrntSeq",
                  value: "",
                },
                {
                  name: "actionPostSeq",
                  value: "",
                },
              ],
              paramList: [],
            },
            {
              cpntId: "",
              id: "uploadAction3",
              referId: "uploadAction",
              type: "uploadAction",
              transition: [],
              conf: [
                {
                  name: "actionDesc",
                  value: "文件上传组件"
                },
                {
                  name: "actionMsg",
                  value: ""
                },
                {
                  name: "actionSeq",
                  value: "R0001"
                },
                {
                  name: "actionFrntSeq",
                  value: "R0000"
                },
                {
                  name: "actionPostSeq",
                  value: ""
                },
                {
                  name: "uploadKey",
                  value: "uploadFilePath",
                },
                {
                  name: "uploadValue",
                  value: "",
                },
              ],
              paramList: [
                // {
                //   "actionId": "",
                //   "actionName": "",
                //   "apSource": "",
                //   "isNeed": "1",
                //   "paraMapgNm": "",
                //   "paramCName": "上传文件路径",
                //   "paramDirection": "1",
                //   "paramKey": "uploadFilePath",
                //   "paramMappingKey": "",
                //   "paramName": "上传文件路径",
                //   "paramOrder": "1",
                //   "paramParentId": "",
                //   "paramPosition": "1",
                //   "paramType": "String",
                // }
              ],
            },
          ],
          position:
            "{&quot;inputAction1&quot;:&quot;195.1092529296875 31.00421142578125 100 48&quot;,&quot;outputAction2&quot;:&quot;198.1092529296875 290.00421142578125 100 48&quot;,&quot;uploadAction3&quot;:&quot;196.01577758789062 146.01681518554688 100 48&quot;}",
        };
      } else {
        return {
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
                  value: `${this.currentServObj.apiName || "input"}`,
                },
                {
                  name: "actionMsg",
                  value: "",
                },
                {
                  name: "actionSeq",
                  value: "R0000",
                },
                {
                  name: "actionFrntSeq",
                  value: "",
                },
                {
                  name: "actionPostSeq",
                  value: "",
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
                  value: `${this.currentServObj.apiName + "结束" || "output"}`,
                },
                {
                  name: "actionMsg",
                  value: "",
                },
                {
                  name: "actionSeq",
                  value: "R0001",
                },
                {
                  name: "actionFrntSeq",
                  value: "",
                },
                {
                  name: "actionPostSeq",
                  value: "",
                },
              ],
              paramList: [],
            },
            // {
            //   cpntId: "",
            //   id: "4RAction3",
            //   referId: "4RAction",
            //   type: "4RAction",
            //   transition: [],
            //   conf: [
            //     {
            //       name: "actionDesc",
            //       value: "4R",
            //     },
            //   ],
            //   paramList: [],
            // },
          ],
          position:
            "{&quot;inputAction1&quot;:&quot;195.1092529296875 31.00421142578125 100 48&quot;,&quot;outputAction2&quot;:&quot;198.1092529296875 290.00421142578125 100 48&quot;}",
        };
      }
    },
    saveBtnName() {
      if (this.navDefaultActive == "p") {
        return "保存参数"
      } else if (this.navDefaultActive == "s") {
        return "保存编排"
      } else {
        return "保存"
      }
    }
  },
  provide() {
    return {
      getDataList: this.getDataList,
      setCurrentActionId: this.setCurrentActionId,
      deleteLineBySourceIdAndTargetId: this.deleteLineBySourceIdAndTargetId,
    };
  },
  methods: {
    // ...mapActions("aop_tradedesign", [
    //   "saveTempProcessObj",
    //   "changeProcessTemp",
    // ]),
    //初始化
    init() {
      // this.servId = this.$route.query.servId;
      // this.atomId = this.$route.query.atomId;
      this.pageMode = this.$route.query.pageMode; // 开发页面进入隐藏保存
      this.fnctNm = this.$route.query.fnctNm;
      this.currentApiId = this.$route.query.transId;
      this.bizLineId = this.$route.query.bizLineId;
      this.competitorId = this.$route.query.competitorId
      this.transId = this.$route.query.transId || this.$route.query.apiId
      this.beltLineNm = this.$route.query.beltLineNm
      this.appId = this.$route.query.appId
      // if (this.$route.query.apiId) {
      //   console.log("路由中有APIID");
      //   this.currentApiId = this.$route.query.apiId;
      // } else {
      //   console.log("路由中没有APIID");
      // }
      this.getServiceDesignDetail();
    },
    servClick(e) {
      console.log("servClick", e);
      this.currentD4bObj = e;
      this.currentApiId = e.apiId;
      this.getInServiceDesignDetail();
    },
    async getInServiceDesignDetail() {
      if (!this.currentApiId) return;
      const params = {
        // apiId: this.currentApiId,
        apiId: this.transId,
        d4StusCd: "1", // 0-分析，1-设计；2-测试
        blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
        // dsgnFlg: this.currentD4bObj.dsgnFlg ,
        deployFlg: "1", // 发布标志 0 未发布 1已发布
      };

      let res = await this.rpc.d4.getServiceDesignDetail(params);
      console.log("getServiceDesignDetail");
      this.getAllData(res);
      this.$refs.pattr.currentObj = res;
      this.$refs.pattr.getFlowParams(res);
      // 保存当前选中服务信息
      this.currentServObj = res;
      this.$nextTick(() => {
        this.$refs.pelem.getServicePickList();
      });
      // 参数设置页的内容
      // const inputList = res.puApiParams.filter(
      //   (item) => item.paramDirection === "0"
      // );
      // const outputList = res.puApiParams.filter(
      //   (item) => item.paramDirection === "1"
      // );
      // const tempList = res.puApiParams.filter(
      //   (item) => item.paramDirection === "3"
      // );
      // this.$refs.paramsRef.iInputList = reList(inputList);
      // this.$refs.paramsRef.iOutputList = reList(outputList);
      // this.$refs.paramsRef.iTempList = reList(tempList);
    },
    changeView() {
      this.dataViewVisible = false;
    },
    d4bOptionsChange(e) {
      this.fourRAttrFlag = false;
      this.currentD4bObj = e;
      this.currentApiId = e.svcId;
      this.storeApiData = e;
      this.getServiceDesignDetail();
    },
    // 双击4R组件
    async handleActionChange(e) {
      console.log("handleActionChange", e);
      if (!e.compositeId) return this.$message.error("请先保存组件信息");
      const dataObj = this.pcTranform();
      if (!dataObj.flow.length) return false;
      const dataList = this.getDataList()
      // 流程图数据被修改
      let changeFlag =
        this.recordFlow !== JSON.stringify(dataObj.flow) ||
        this.recordPosition !== JSON.stringify(dataObj.position);
      if (changeFlag) {
        this.$confirm(
          "您修改了流程图，还未保存，需要保存后再跳转吗？",
          this.confirmOptions
        ).then(async () => {
          if (!this.handleToSaveVerify()) return
          await this.save(false);
          // this.currentD4bObj = e;
          // this.currentD4bObj.svcId = e.compositeId;
          this.currentApiId = e.compositeId;
          this.currentParentCpnInfo = {...e, dataList};
          this.$refs.pattr.get4RFlowParams(this.currentParentCpnInfo);
          this.fourRAttrFlag = true;
          //获取组件流程图信息
          const params = {
            cpntPId: e.compositeId,
          };
          const res = await this.rpc.d4.getFlowdata(params);
          this.getAllData(res);
          this.getServiceArrangeList();
        }).catch(async () => {
          // this.currentD4bObj = e;
          // this.currentD4bObj.svcId = e.compositeId;
          this.currentApiId = e.compositeId;
          this.currentParentCpnInfo = {...e, dataList};
          this.$refs.pattr.get4RFlowParams(this.currentParentCpnInfo);
          this.fourRAttrFlag = true;
          //获取组件流程图信息
          const params = {
            cpntPId: e.compositeId,
          };
          const res = await this.rpc.d4.getFlowdata(params);
          this.getAllData(res);
          this.getServiceArrangeList();
        }).finally(async () => {
          // this.changeTabs();
          //临时存储服务数据
          // this.storeData = this.currentServObj;
          // const data = this.pcTranform();
          // this.storeData.flow = data.flow;
          // this.storeData.position = data.position;
          // this.storeData.apiId = this.currentApiId;
          // this.storeData.designerFlg = this.designerFlg;
          
        });
      } else {
        // this.currentD4bObj = e;
        // this.currentD4bObj.svcId = e.compositeId;
        this.currentApiId = e.compositeId;
        this.currentParentCpnInfo = {...e, dataList};
        this.$refs.pattr.get4RFlowParams(this.currentParentCpnInfo);
        this.fourRAttrFlag = true;
        //获取组件流程图信息
        const params = {
          cpntPId: e.compositeId,
        };
        const res = await this.rpc.d4.getFlowdata(params);
        this.getAllData(res);
        this.getServiceArrangeList();
      }
      // console.log("D4服务数据", this.storeData);
      //获取组件信息
      // this.$nextTick(() => {
      //   this.$refs.pattr.$refs.fourRAttrRefs.getParams(e, this.currentServObj);
      //   const parmaObj = JSON.parse(getSessionStorage("4R-paramsData"));
      //   console.log("D4服务数据", this.currentServObj,parmaObj);
      //   Object.assign(this.currentServObj, parmaObj);
      //   console.log("4R数据", parmaObj);
      //   this.$refs.paramsRef.iInputList = reList(
      //     parmaObj.inputParamsListAtSetting
      //   );
      //   this.getNodeId(this.$refs.paramsRef.iInputList);
      //   this.$refs.paramsRef.iOutputList = reList(
      //     parmaObj.outputParamsListAtSetting
      //   );
      //   this.getNodeId(this.$refs.paramsRef.iOutputList);
      //   this.$refs.paramsRef.iTempList = reList(
      //     parmaObj.tempParamsListAtSetting
      //   );
      //   this.getNodeId(this.$refs.paramsRef.iTempList);
      // });
    },
    toServ(e) {
      const dataObj = this.pcTranform();
      console.log("流程图数据", dataObj);
      if (!dataObj.flow.length) return false;
      // 流程图数据被修改
      let changeFlag =
        this.recordFlow !== JSON.stringify(dataObj.flow) ||
        this.recordPosition !== JSON.stringify(dataObj.position);
      if (changeFlag) {
        this.$confirm(
          "您修改了流程图，还未保存，需要保存后再跳转吗？",
          this.confirmOptions
        )
          .then(async () => {
            // await this.save();
            let type = this.fourRAttrFlag ? "fourRBack" : "";
            await this.toSave(true, type);
            if (this.fourRAttrFlag) {
              this.handleBackBtn();
            } else {
              this.handleActionChange(e);
            }
          })
          .catch(() => {
            if (this.fourRAttrFlag) {
              this.handleBackBtn();
            } else {
              this.handleActionChange(e);
            }
          });
      } else {
        if (this.fourRAttrFlag) {
          this.handleBackBtn();
        } else {
          this.handleActionChange(e);
        }
      }
      this.changeTabs();
    },
    //恢复api的数据
    backData() {
      this.fourRAttrFlag = false;
      this.currentServObj = this.storeData;
      this.currentD4bObj = this.storeApiData;
      this.currentApiId = this.storeApiData.svcId;
      this.currentParentCpnInfo = {};
    },
    // 返回服务的流程图
    async handleBackBtn() {
      console.log("返回流程图");
      // this.backData();
      // this.getAllData(this.currentServObj);
      // this.$refs.pattr.currentObj = this.currentServObj;
      // this.$refs.pattr.getFlowParams(this.currentServObj);
      // this.getServiceDesignDetail();
      this.fourRAttrFlag = false;
      this.currentParentCpnInfo = {};
      await this.refreshFlow()
      this.$refs.pattr.getFlowParams(this.currentServObj);
    },
    handleGoTo(e) {
      if (this.asideActive == e) return;
      if (this.hasChangeProcess) {
        this.$confirm(
          "您修改了流程图，还未保存，需要保存后再跳转吗？",
          this.confirmOptions
        )
          .then(async () => {
            // await this.save();
            await this.toSave();
            this.$emit("handleGoTo", e, this.currentD4bObj);
          })
          .catch(() => {
            this.fourRAttrFlag ? this.backData() : "";
            this.$emit("handleGoTo", e, this.currentD4bObj);
          });
      } else {
        this.fourRAttrFlag ? this.backData() : "";
        this.$emit("handleGoTo", e, this.currentD4bObj);
      }
    },
    goTo(e) {
      if (this.asideActive == e) return;
      this.asideActive = e;
      if (e == "0") {
        this.$router.push({
          path: "/aop_tradedesign/assetsdesign/definition",
          query: {
            servId: this.$route.query.servId,
            servNm: this.$route.query.servNm,
            isDev: this.$route.query.isDev,
            pageType: "design",
          },
        });
      } else if (e == "1") {
        this.$router.push({
          path: "/aop_tradedesign/assetsdesign/design",
          query: {
            servId: this.$route.query.servId,
            servNm: this.$route.query.servNm,
            isDev: this.$route.query.isDev,
          },
        });
      } else {
        this.$router.push({
          path: "/aop_tradedesign/assetsdev/modify",
          query: {
            servId: this.$route.query.servId,
            servNm: this.$route.query.servNm,
            isDev: this.$route.query.isDev,
          },
        });
      }
    },
    // 导航栏返回
    navBack(e) {
      if (this.hasChangeProcess && this.navDefaultActive == "s") {
        this.$confirm(
          "您修改了流程图，还未保存，需要保存后再跳转吗？",
          this.confirmOptions
        )
          .then(async () => {
            if (!this.handleToSaveVerify()) return
            await this.save(false);
            this.navReturn = e;
            this.goRoute();
          })
          .catch(() => {
            this.navReturn = e;
            this.goRoute();
          });
      } else {
        this.navReturn = e;
        this.goRoute();
      }
      // this.navReturn = e;
      // this.goRoute();
    },
    // 判断输入输出参数是否修改
    isParams() {
      if (
        this.$refs.paramsRef.iInputListRecord !==
          JSON.stringify(this.$refs.paramsRef.iInputList) ||
        this.$refs.paramsRef.iOutputListRecord !==
          JSON.stringify(this.$refs.paramsRef.iOutputList)
      ) {
        this.$confirm(
          "您修改了输入输出参数，还未保存，需要保存后再跳转吗？",
          this.confirmOptions
        )
          .then(async () => {
            await this.saveParams();
            this.goRoute();
          })
          .catch(() => {
            this.goRoute();
          });
      } else {
        this.goRoute();
      }
    },
    // 返回方法
    goRoute() {
      if (this.navReturn == "home") {
        this.$router.push({
          path: "/aop_endentry/t2/list",
        });
      } else {
        // this.$router.back();
        this.$router.push(getSessionStorage("transRouter"))
      }
    },
    //保存所有服务资产参数
    async save(refresh = true, type) {
      const dataList = this.getDataList().filter(
        (data) =>
          data.actionType != "inputAction" && data.actionType != "outputAction"
      );
      if (!dataList.length) return this.$message.error("请添加编排组件后再保存")
      // const notActionSeqItem = this.getDataList().find((data) => !this.getConfItem("actionSeq", data.actionId).value)
      // if (notActionSeqItem) return this.$message.error(`组件【${notActionSeqItem.actionName}】缺少位置序号，无法保存。`)
      // 给没有位置序号的组件添加一个临时的位置序号
      const noActionSeqItemList = this.getDataList(true).filter((data) => {
        const actionSeq = this.getConfItem("actionSeq", data.actionId).value
        return !actionSeq || actionSeq.includes("位置序号")
      })
      noActionSeqItemList.forEach((data, index) => {
        this.getConfItem("actionSeq", data.actionId, true).value = `位置序号${index + 1}`
      })
      const arrangeListParams = await this.saveServiceArrangeList()
      // 过滤掉临时生成位置序号的数据
      arrangeListParams.layoutActionList = arrangeListParams.layoutActionList.filter((item) => {
        if (item.layoutActionList?.length) {
          item.layoutActionList = item.layoutActionList.filter((subItem) => !subItem.loSeqNo?.includes("位置序号"))
        }
        return !item.loSeqNo?.includes("位置序号")
      })
      const data = this.pcTranform();
      const ap = JSON.parse(JSON.stringify(this.dataObj));
      ap.flow = data.flow;
      ap.position = data.position;
      ap.suitScp = "CHANNEL";
      ap.commonFlag = false;
      Object.assign(ap, {
        d4StusCd: "1",
        blngtoTyp: "00",
        apiId: this.fourRAttrFlag ? this.currentApiId : this.transId,
        funcId: this.fnctId,
        cpntPId: !this.fourRAttrFlag ? "" : this.currentParentCpnInfo.compositeId,
      });
      Object.assign(ap, arrangeListParams)
      // const api = !this.fourRAttrFlag
      //   ? "saveD4bSeriveProcess"
      //   : "toSave4RAction";
      // const res = await this.rpc.d4[api](ap);
      const res = await this.rpc.d4.saveD4bTranDesignFlow(ap);
      this.rpc.s4design.addFuntionJobCommitFlow({
        fnctId: this.fnctCd || this.$route.query.assetFnctNo,
        jobTpCd: 'C4',
      })
      if (!["saveParams", "saveArrangeList"].includes(type)) {
        this.$notify({
          title: "成功",
          message: "保存成功",
          duration: 2000,
          type: "success",
        });
      }
      if (refresh) {
        await this.refreshFlow();
      }
      const fileActionItem = this.getDataList().find(data => data.actionType == "uploadAction" && !data.paramList?.length)
      // 当流程图中的文件上传组件没有参数的时候，需要保存信息
      if (fileActionItem) {
        this.saveUploadActionData(fileActionItem)
      }
    },
    // 保存后续编排表
    async saveServiceArrangeList() {
      // const dataList = this.getDataList(true).filter(
      //   (data) =>
      //     data.actionType != "inputAction" && data.actionType != "outputAction"
      // );
      const dataList = this.getDataList(true);
      // 给没有组件id的元素生成组件id
      const withoutCompositeIdList = dataList.filter(item => !item.compositeId)
      const length = withoutCompositeIdList.length
      if (length) {
        const res = await this.rpc.d4.generateCompositeId({
          num: length
        })
        res.copositeIdList.forEach((compositeId) => {
          const item = dataList.find(item => !item.compositeId)
          item.compositeId = compositeId
          item.newFlag = true // 是否前端调接口生成compositeId的标记
        })
      }
      // 获取容器内所有组件的组件id
      const subcomponentIdList = dataList.reduce((prev, container) => {
        const conf = this.getConfItem("subcomponent", container.actionId);
        const subcomponent = JSON.parse(conf.value || "[]");
        return prev.concat(subcomponent);
      }, []);
      // 建立组件id与交易编排信息的对应关系 compositeIdToLayoutActionList
      const compositeIdList = dataList.reduce((prev, item) => {
        if (item.compositeId) prev.push(item.compositeId)
        return prev
      }, [])
      const _layoutActionList = this.layoutActionList.reduce((prev, item) => {
        prev.push(item)
        if (item?.layoutActionList?.length) {
          prev.push(...item.layoutActionList)
          item.layoutActionList = []
        }
        return prev
      }, [])
      const compositeIdToLayoutActionList = compositeIdList.reduce((prev, id) => {
        prev[id] = _layoutActionList.filter(item => item.actionId == id)
        return prev
      }, {})
      if (this.layoutActionList.length) {
        // 非初次保存
        // 获取当前流程图，除去input、output及容器内的所有组件后，其他组件的对象数组
        const arrangeDataList = dataList.reduce((prev, data) => {
          if (!subcomponentIdList.includes(data.actionId)) {
            prev.push(data);
          }
          return prev;
        }, []);
        let layoutActionList = arrangeDataList.reduce((prev, data) => {
          let layoutDatas = compositeIdToLayoutActionList[data.compositeId]
          if (layoutDatas.length) {
            // 之前已经保存过的组件
            layoutDatas.forEach((item) => {
              // 更新实时位置序号
              item.loSeqNo = this.getConfItem("actionSeq", data.actionId).value
              item.frntLoSeqNo = this.getConfItem("actionFrntSeq", data.actionId).value
              item.postLoSeqNo = this.getConfItem("actionPostSeq", data.actionId).value
              if (["containerAction", "concurrentAction"].includes(data.actionType)) {
                // 更新容器内组件的数据
                const conf = this.getConfItem("subcomponent", data.actionId)
                const subcomponent = JSON.parse((conf.value || "[]"))
                const subDataList = dataList.filter((data => subcomponent.includes(data.actionId)))
                const subLayoutActionList = subDataList.reduce((_prev, subData) => {
                  let subLayoutActions =  compositeIdToLayoutActionList[subData.compositeId]
                  subLayoutActions = subLayoutActions.length ? subLayoutActions : this.getParamsOflayoutActionList([subData], dataList)
                  subLayoutActions.forEach(item => {
                    // 更新子组件的实时位置序号
                    item.loSeqNo = this.getConfItem("actionSeq", subData.actionId).value
                    item.frntLoSeqNo = this.getConfItem("actionFrntSeq", subData.actionId).value
                    const tfrCdtnCd = JSON.parse(item.tfrCdtnCd || "{}")
                    item.postLoSeqNo = tfrCdtnCd.actionPostSeq ? tfrCdtnCd.actionPostSeq : this.getConfItem("actionPostSeq", subData.actionId).value
                  })
                  _prev.push(...subLayoutActions)
                  return _prev
                }, [])
                item.layoutActionList = subLayoutActionList
              }
            })
            prev.push(...layoutDatas)
          } else {
            // 新拖出来的组件
            let appendData = this.getParamsOflayoutActionList([data], dataList)
            appendData = appendData.map((item) => {
              const data = dataList.find((data) => data.compositeId == item.actionId)
              // 新拖出来组件的是容器时，判断是否往容器内添加了组件
              if (["containerAction", "concurrentAction"].includes(data.actionType)) {
                const conf = this.getConfItem("subcomponent", data.actionId)
                const subcomponent = JSON.parse((conf.value || "[]"))
                if (item?.layoutActionList?.length) {
                  item.layoutActionList.forEach(subData => {
                    const tfrCdtnCd = compositeIdToLayoutActionList[subData.actionId][0]?.tfrCdtnCd
                    subData.tfrCdtnCd = tfrCdtnCd
                  })
                }
              }
              return item
            })
            // prev.push(...this.getParamsOflayoutActionList([data], dataList))
            prev.push(...appendData)
          }
          return prev
        }, [])
        const params = {
          svcId: this.transId, // 交易ID
          layoutActionList,
          parentActionId: this.fourRAttrFlag ? this.currentParentCpnInfo.compositeId : ""
        }
        return params
        // await this.rpc.d4.saveServiceArrangeList(params);
      } else {
        // 初次保存
        const layoutActionList = this.getParamsOflayoutActionList(dataList);
        const params = {
          svcId: this.transId, // 交易ID
          layoutActionList,
          parentActionId: this.fourRAttrFlag ? this.currentParentCpnInfo.compositeId : ""
        };
        return params
        // await this.rpc.d4.saveServiceArrangeList(params);
      }
    },
    getParamsOflayoutActionList(dataList, allDataList) {
      // 初次保存时 dataList和allDataList为相同数组
      if (!allDataList) allDataList = dataList
      const actionTypObj = {
        inputAction: 0,
        outputAction: 0,
        D4bAction: 1,
        D5SelfAction: 1,
        D5LinkAction: 1,
        asyncAction: 2,
        concurrentAction: 3,
        containerAction: 4,
        loopAction: 5,
        breakAction: 6,
        continueAction: 7,
        operationAction: 8,
        spliceAction: 9,
        cacheSessionAction: 10,
        getSessionAction: 11,
        uploadAction: 12,
        setCacheAction: 13,
        getCacheAction: 14,
      };
      const subcomponentIdList = dataList.reduce((prev, container) => {
        const conf = this.getConfItem("subcomponent", container.actionId);
        const subcomponent = JSON.parse(conf.value || "[]");
        return prev.concat(subcomponent);
      }, []);
      // const allDataList = this.getDataList()
      return dataList
        .filter((data) => !subcomponentIdList.includes(data.actionId))
        .map((data) => {
          let subLayoutActionList = [];
          if (
            ["containerAction", "concurrentAction"].includes(data.actionType)
          ) {
            const conf = this.getConfItem("subcomponent", data.actionId);
            const subcomponent = JSON.parse(conf.value || "[]");
            subLayoutActionList = subcomponent.map((subcomponentId) => {
              const item = allDataList.find(
                (data) => data.actionId == subcomponentId
              );
              return {
                svcId: item.actionOwnId, // 服务ID
                actionKey: this.getConfItem("svcNo", item.actionId).value, // 服务编号
                actionId: item.compositeId, // 组件ID
                actionNm: item.actionName, // 服务名称
                actionTyp: actionTypObj[item.actionType], // 组件类型 1服务2异步组件3并发组件4容器组件5循环组件
                parentActionId: data.compositeId, // 父组件ID
                loSeqNo: this.getConfItem("actionSeq", item.actionId).value, // 位置序号
                frntLoSeqNo: this.getConfItem("actionFrntSeq", item.actionId)
                  .value, // 前置位置序号
                postLoSeqNo: this.getConfItem("actionPostSeq", item.actionId)
                  .value, // 后置位置序号
                tfrCdtnCd: "", // 转移条件代码
              };
            });
          }
          return {
            svcId: data.actionOwnId, // 服务ID
            actionKey: this.getConfItem("svcNo", data.actionId).value, // 服务编号
            actionId: data.compositeId, // 组件ID
            actionNm: data.actionName, // 服务名称
            actionTyp: actionTypObj[data.actionType], // 组件类型 1服务2异步组件3并发组件4容器组件5循环组件
            loSeqNo: this.getConfItem("actionSeq", data.actionId).value, // 位置序号
            frntLoSeqNo: this.getConfItem("actionFrntSeq", data.actionId).value, // 前置位置序号
            postLoSeqNo: this.getConfItem("actionPostSeq", data.actionId).value, // 后置位置序号
            tfrCdtnCd: "", // 转移条件代码
            layoutActionList: subLayoutActionList, // 子集合
          };
        });
    },
    // 查询后续编排表
    async getServiceArrangeList() {
      const res = await this.rpc.d4.getServiceArrangeList({
        svcId: this.transId,
        parentActionId: this.currentParentCpnInfo.compositeId || ""
      });
      this.layoutActionList = res.layoutActionList;
    },
    // 更新后续编排表
    updateServiceArrangeList(data, currentObj) {
      console.log("updateServiceArrangeList", data, currentObj)
      const actionId = data?.actionId
      if (actionId) {
        const dataList = this.getDataList();
        const subcomponentIdList = dataList.reduce((prev, container) => {
          const conf = this.getConfItem("subcomponent", container.actionId);
          const subcomponent = JSON.parse(conf.value || "[]");
          return prev.concat(subcomponent);
        }, []);
        const target = dataList.find(item => item.compositeId == actionId)
        // 是否更新容器内的组件
        const flag = subcomponentIdList.includes(target.actionId)
        if (!flag) {
          this.layoutActionList = this.layoutActionList.filter(
            (item) => item.actionId != actionId
          );
          this.layoutActionList.push(data);
        } else {
          // 更新子组件里的后续编排
          const target = this.layoutActionList.find(layoutData => {
            const subActionList = layoutData.layoutActionList.filter(item => item.actionId == actionId)
            return subActionList.length
          })
          target.layoutActionList = target.layoutActionList.filter(item => item.actionId != actionId)
          target.layoutActionList.push(data)
        }
      }
      this.save(true, "saveArrangeList")
    },
    // 保存文件上传组件信息
    async saveUploadActionData(item) {
      const confList = item.conf.reduce((prev, config) => {
        prev.push({
          confKey: config.name,
          confValue: config.value,
          confId: "",
          confDescr: "",
          compositeId: item?.compositeId || "",
        })
        return prev
      }, [])
      const paramList = [
        {
          paramOrder: "1",
          paramPosition: "1",
          paramDirection: "1",
          isNeed: "1",
          paramParentId: "",
          paramKey: "uploadFilePath",
          paramCName: "文件上传路径键名",
          paramValueType: "String",
        },{
                    paramOrder: "2",
                    paramPosition: "1",
                    paramDirection: "1",
                    isNeed: "1",
                    paramParentId: "",
                    paramKey: "uploadFileType",
                    paramCName: "文件上传类型",
                    paramValueType: "String",
                },
      ]
      const params = {
        d4StusCd: "1",
        blngtoTyp: "11",
        apiId: this.currentServObj.apiId,
        paramList: paramList,
        confList,
        compositeId: item?.compositeId || ""
      }
      const { compositeId } = await this.rpc.d4.saveServiceCpnParams(params)
    },
    // 获取conf配置项
    getConfItem(name, actionId, reference = false) {
      const cpn = this.getDataList(reference).find((data) => data.actionId == actionId);
      return cpn.conf.find((item) => item.name == name) || {};
    },
    async refreshFlow() {
      // if (!this.currentApiId) return;
      // 刷新流程图
      if (this.fourRAttrFlag) { // 在子流程内
        const res = await this.rpc.d4.getFlowdata({
          cpntPId: this.currentParentCpnInfo.compositeId,
        });
        this.getAllData(res);
        this.getServiceArrangeList();
      } else {
        // const params = {
        //   apiId: this.transId,
        //   d4StusCd: "1", // 0-分析，1-设计；2-测试
        //   blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
        //   dsgnFlg: this.currentD4bObj.dsgnFlg || 1,
        //   // deployFlg: this.currentD4bObj.dsgnFlg == 0 ? 1 : 0, // 发布标志 0 未发布 1已发布
        // };
        // let res = await this.rpc.d4.getServiceDesignDetail(params);
        // this.getAllData(res);
        Promise.all([this.rpc.d4.getD4bServiceInfo({
          svcId: this.transId,
          // fnctId: this.fnctId,
          dsgnFlg: "1",
        }), this.rpc.d4.getServiceDesignDetail({
          apiId: this.transId,
          d4StusCd: "1", // 0-分析，1-设计；2-测试
          blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
          dsgnFlg: this.currentD4bObj.dsgnFlg || 1,
          // deployFlg: this.currentD4bObj.dsgnFlg == 0 ? 1 : 0, // 发布标志 0 未发布 1已发布
        })]).then((_res) => {
          const res = Object.assign(_res[0], _res[1], { bizLineId: this.bizLineId, competitorId: this.competitorId, appId: this.appId })
          // 保存当前选中服务信息
          this.currentServObj = res;
          this.getAllData(res);
        })
        this.getServiceArrangeList();
      }
    },
    // 保存按钮 触发保存不返回
    async toSave(refresh = true, type) {
      try {
        if (this.toSave.calling) return
        this.toSave.calling = true
        if (this.navDefaultActive == "p") {
          // if(!(this.$refs.paramsRef.iInputList.length > 0)) {
          //   return this.$message.error("输入参数不可为空")
          // }
          this.saveParams();
        } else if (this.navDefaultActive == "a") {
          this.$refs.devConfigRef.save();
        } else {
          // let iInputList = this.$refs.paramsRef.iInputList;
          // let iOutputList = this.$refs.paramsRef.iOutputList;
          // this.upDateServParams("params", {
          //   iInputList,
          //   iOutputList,
          // });
          if (!this.handleToSaveVerify()) return
          await this.save(refresh, type);
          this.$refs.pattr.refresh()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.toSave.calling = false
      }
    },
    handleToSaveVerify() {
      const dataList = this.getDataList();
      // 校验容器内的L5服务组件是否有两个或以上
      const containerList = this.$refs.process.containerList
      const container = containerList.find((container) => {
        const conf = this.getConfItem("subcomponent", container.actionId);
        const subcomponent = JSON.parse(conf.value || "[]");
        return subcomponent.length < 2
      })
      if (container) {
        return this.$message.error(`${container.actionName}内的服务组件数少于2，无法保存`) && false
      }
      // 校验子流程内是否有L5服务组件
      // if (this.fourRAttrFlag && this.currentParentCpnInfo.actionType == "asyncAction" && !dataList.some((data) => ["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType))) {
      //   return this.$message.error(`子流程中缺少服务组件，无法保存`) && false
      // }
      // 校验循环组件的表单填写
      const loopAction = dataList.find(data => data.actionType == "loopAction" && data.compositeId && !this.getConfItem("loopList", data.actionId)?.value)
      if (loopAction) {
        return this.$message.error(`${loopAction.actionName}的循环集合为空，无法保存`) && false
      }
      // 校验选择/并发组件的前序组件的交易编排列表不能为空
      const frntSeqItemList = containerList.reduce((prev, container) => {
        const actionSeq = this.getConfItem("actionSeq", container.actionId)?.value
        const actionFrntSeq = this.getConfItem("actionFrntSeq", container.actionId)?.value
        if (actionSeq && actionFrntSeq) {
          const item = dataList.find(data => {
            if (data.compositeId) {
              const _actionSeq = this.getConfItem("actionSeq", data.actionId)?.value
              return _actionSeq == actionFrntSeq
            }
          })
          if (item) prev.push(item)
        }
        return prev
      }, [])
      
      const unmatchedFrntItem = frntSeqItemList.find(item => {
        // const actionSeq = this.getConfItem("actionSeq", item.actionId)?.value
        // const layoutData = this.layoutActionList.find(layoutData => layoutData.loSeqNo == actionSeq)
        const layoutData = this.layoutActionList.find(layoutData => layoutData.actionId == item.compositeId)
        return !layoutData?.tfrCdtnCd?.length || layoutData?.tfrCdtnCd == "[]"
      })
      if (unmatchedFrntItem) {
        const actionSeq = this.getConfItem("actionSeq", unmatchedFrntItem.actionId)?.value
        return this.$message.error(`【${unmatchedFrntItem.actionName}(${actionSeq})】的交易编排列表不能为空`) && false
      }
      return true
    },
    getOnly(arrs, operate) {
      if (operate == "only") {
        let list = unduplicated(arrs, "paramKey");
        if (list.length == arrs.length) return [];
        return arrs.filter((item) => list.indexOf(item) == -1);
      } else {
        const list = mixList(arrs, "children");
        const data = unduplicated(list, "paramParentId");
        let i = [];
        console.log("data", data);
        data.forEach((item) => {
          const l = list.filter((it) => it.paramParentId == item.paramParentId);
          const f = this.getOnly(l, "only");
          if (f.length > 0) {
            i = f;
          }
        });
        return i;
      }
    },
    getCheckEmpty(data) {
      let flag = false;
      data.forEach((item) => {
        if (!item.paramKey || !item.paramCName || !item.paramValueType) {
          flag = true;
        }
      });
      return flag;
    },
    hasDesc(data) {
      data.map((item) => {
        if (
          item.paramCustomFlg == "1" &&
          !item.paramDesc &&
          item.paramValueType != "List" &&
          item.paramValueType != "Object"
        ) {
          if (item.paramDirection in this.descList) {
            this.descList[item.paramDirection].push(item.paramCName);
          } else {
            this.descList[item.paramDirection] = [];
            this.descList[item.paramDirection].push(item.paramCName);
          }
        }
        if (item.children && item.children.length) {
          this.hasDesc(item.children);
        }
      });
    },
    hasKey(data) {
      data.map((item) => {
        if (
          item.paramValueType == "List" &&
          !/List$/.test(item.paramKey)
        ) {
          if (item.paramDirection in this.keyList) {
            this.keyList[item.paramDirection].push(item.paramCName);
          } else {
            this.keyList[item.paramDirection] = [];
            this.keyList[item.paramDirection].push(item.paramCName);
          }
        }
        if (item.children && item.children.length) {
          this.hasKey(item.children);
        }
      });
    },
    // 保存输入输出参数接口调用
    async saveParams() {
      const that = this.$refs.paramsRef
      let iInputList = mixList(that.sendData, "children");
      let iOutputList = mixList(that.receiveData, "children");

      // 来源值判断是否为空
      let paraMapflag = iOutputList.find(item => !item.paraMapgNm)
      // if(!!paraMapflag) return this.$message.error("请选择来源值，来源值不能为空")
      let puApiParams = JSON.parse(JSON.stringify([...iInputList, ...iOutputList]));
      puApiParams.forEach((item) => {
        if (actionNameToNoActionId.includes(item.actionName)) item.actionId = ""
      })
      const sendData = that.sendData
      const receiveData = that.receiveData
      this.getNodeId(sendData[2].children, sendData[2].paramOrder);
      const i = this.getOnly(sendData);
      if (i.length > 0)
        return this.$message.error(
          "输入参数的参数key: " + i[0].paramKey + "不能重复!请检查"
        );
      this.getNodeId(receiveData[1].children, receiveData[1].paramOrder);
      const l = this.getOnly(receiveData);
      if (l.length > 0)
        return this.$message.error(
          "输出参数的参数key: " + l[0].paramKey + "不能重复，请检查"
        );
      //转一维数组
      const isEmpty = this.getCheckEmpty(puApiParams);
      if (isEmpty) {
        return this.$message.error("参数Key、参数名称、参数值类型不能为空");
      }
      this.descList = {};
      this.hasDesc(puApiParams);
      if (this.descList[0]) {
        return this.$message.error(
          `请在输入参数：【${this.descList[0]}】的 "参数描述" 输入自定义原因`
        );
      }
      if (this.descList[1]) {
        return this.$message.error(
          `请在输出参数：【${this.descList[1]}】的 "参数描述" 输入自定义原因`
        );
      }
      this.keyList = {};
      this.hasKey(puApiParams);
      if (this.keyList[0])
        return this.$message.error(
          `自定义输入参数类型为List：参数名称为【${this.keyList[0]}】的 "参数key"要以List为结尾`
        );
      if (this.keyList[1])
        return this.$message.error(
          `自定义输出参数类型为List：参数名称为【${this.keyList[1]}】的 "参数key"要以List为结尾`
        );

      this.keyOtherList = {};
      this.hasOtherKey(puApiParams)
      if(this.keyOtherList[0]) return this.$message.error(`自定义输入参数：参数名称为【${this.keyOtherList[0]}】的 "参数key"以英文开头,或数字结尾,例如AA、A88,不能是A8A8`)
      if(this.keyOtherList[1]) return this.$message.error(`自定义输出参数：参数名称为【${this.keyOtherList[1]}】的 "参数key"以英文开头,或数字结尾,例如AA、A88,不能是A8A8`)
      this.keywordList = {};
      this.hasKeyword(puApiParams)
      if(this.keywordList[0]) return this.$message.error(`自定义输入参数类型为Object：参数名称为【${this.keywordList[0]}】的 "参数key"不能是Java关键字`)
      if(this.keywordList[1]) return this.$message.error(`自定义输入参数类型为Object：参数名称为【${this.keywordList[1]}】的 "参数key"不能是Java关键字`)

      const params = {
        apiId: this.transId,
        paramList: puApiParams,
      };
      const res = await this.rpc.d4.updateD4Param(params);
      this.$notify({
        title: "成功",
        message: "参数保存成功",
        duration: 2000,
        type: "success",
      });
      this.currentServObj.puApiParams = puApiParams;
      this.upDateServParams("params", {
        iInputList,
        iOutputList,
      });
      // this.refreshFlow();
      if (!this.isDesign) {
        this.save(true, "saveParams");
      }
    },
    changeTabs(e) {
      this.$refs.pelem.defaultActive = "服务编排组件";
      this.$refs.pelem.data_view = true;
      this.dataViewVisible = false;
      if (e == "p") {
        // this.$refs.paramsRef.setMapParamsList()
        this.$refs.paramsRef.init()
      }
    },
    // 暂存服务资产画布
    async tempSave() {
      const data = this.pcTranform();
      this.saveTempProcessObj(data);
    },
    // 画布数据转换
    pcTranform() {
      const k = this.$refs.process.dataList;
      const l = this.$refs.process.lineList;
      const flow = [];
      const p = {};
      for (let i in k) {
        let f = {
          compositeId: k[i].compositeId,
          cpntId: k[i].actionOwnId,
          id: k[i].actionId,
          referId: k[i].actionType,
          type: k[i].actionType,
          transition: [],
          conf: k[i].conf,
          paramList: k[i].paramList,
          newFlag:  k[i].newFlag,
        };
        for (let c in l) {
          // if (l[c].sourceId == k[i].actionId) {
          //   let m = {
          //     desc: "",
          //     ...l[c].condition,
          //     name: k[i].actionId + ".transition" + c,
          //     value: l[c].targetId,
          //     polyline: l[c].polyline,
          //   };
          //   f.transition.push(m);
          // }
          // 字段和字段之间的连线，sourceId会带-
          if (l[c].sourceId.split("-")[0] == k[i].actionId) {
            const child = k[i].children.find(
              (child) => child.targetId == l[c].targetId
            );
            let m = {
              desc: child ? `${child.begin}-${child.end}` : "",
              ...l[c].condition,
              name: l[c].sourceId + ".transition" + c,
              value: l[c].targetId,
              polyline: l[c].polyline,
            };
            f.transition.push(m);
          }
        }
        flow.push(f);
        p[k[i].actionId] =
          k[i].actionX +
          " " +
          k[i].actionY +
          " " +
          this.$refs.process.itemOptions.itemWidth +
          " " +
          this.$refs.process.itemOptions.itemHeight;
      }
      const data = JSON.parse(
        JSON.stringify({ flow: flow, position: html2Escape(JSON.stringify(p)) })
      );
      return data;
    },
    //获取银行
    async getBankList() {
      const res = await this.rpc.public.getBankList();
      this.bkList = res.bkList;
    },
    bankChange(e) {
      console.log(e);
      this.newServiceForm.apiGroupId = "";
      this.newServiceForm.arsId = "";
      if (!e) {
        this.sysList = [];
        this.apiGroupList = [];
        return;
      }
      this.newServiceForm.bkNm = this.bkList.find(
        (item) => item.bkId == e
      ).bkNm;
      this.getSysList();
    },
    // 获取服务系统列表
    async getSysList() {
      const params = {
        bkId: this.currentServObj.bkId,
        isCenter: "1",
        // serviceTypeNm: "D4b服务",
        // allShowStatus: "0",
      };
      const res = await this.rpc.public.getServiceSysList(params);
      this.sysList = res.sysList;
    },
    arsIdChange(e) {
      this.newServiceForm.apiGroupId = "";
      if (!e) {
        this.apiGroupList = [];
        return;
      }
      this.newServiceForm.arsNm = this.sysList.find(
        (item) => item.arsId == e
      ).arsName;
      this.getApiGroup();
    },
    //获取API分组
    async getApiGroup() {
      const params = {
        arsId: this.newServiceForm.arsId,
        serviceType: "D5自有服务",
      };
      const res = await this.rpc.public.getApiGroupList(params);
      this.apiGroupList = res.apiGroupList;
    },
    changeApiGroup(e) {
      if (!e) return;
      this.newServiceForm.groupNm = this.apiGroupList.find(
        (item) => item.sgId == e
      ).sgName;
    },
    //展示创建新服务组件窗口
    showNewServiceDemand(e) {
      this.newServiceVisiable = true;
      this.newServiceForm.bkId = this.currentServObj.bkId;
      this.newServiceForm.bkNm = this.currentServObj.bkNm;
      this.getSysList();
    },
    //取消创建新服务
    cancelNewService() {
      this.$refs.process.dataList.pop();
      this.newServiceVisiable = false;
      this.currentNewService = {};
      // this.$refs.searchFormRef.resetFields()
      this.$refs.form.resetFields();
      this.dataList = [];
      this.steps = 1;
    },
    //获取参数或配置默认参数
    getAllData(val) {
      if (!val.flow || val.flow.length == 0) {
        if (this.fourRAttrFlag) {
          val.flow = this.defaultFourRObj.flow;
          val.position = this.defaultFourRObj.position;
        } else {
          val.flow = this.defaultObj.flow;
          val.position = this.defaultObj.position;
        }
      }
      if (this.isProcessTemp) {
        val.flow = this.tempProcessObj.flow;
        val.position = this.tempProcessObj.position;
      }
      this.dataObj = val;
      // this.$refs.pattr.getFlowParams(this.dataObj);
      this.$nextTick(() => {
        const data = this.pcTranform();
        this.recordFlow = JSON.stringify(data.flow);
        this.recordPosition = JSON.stringify(data.position);
        if (!this.fourRAttrFlag) {
          this.designerFlg = this.dataObj.designerFlg;
          this.designerDesc = this.dataObj.designerDesc;
          this.isDesign = this.designerFlg !== "2";
        }
      });
      // this.mixDic();
      // this.clearAllData();
    },
    // 清除画布数据缓存
    clearAllData() {
      const data = { flow: [], position: "" };
      this.saveTempProcessObj(data);
      this.changeProcessTemp(false);
    },
    async getServiceDesignDetail() {
      // if (!this.currentApiId) return;
      Promise.all([this.rpc.d4.getD4bServiceInfo({
        svcId: this.transId,
        // fnctId: this.fnctId,
        dsgnFlg: "1",
      }), this.rpc.d4.getServiceDesignDetail({
        apiId: this.transId,
        d4StusCd: "1", // 0-分析，1-设计；2-测试
        blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
        dsgnFlg: this.currentD4bObj.dsgnFlg || 1,
        // deployFlg: this.currentD4bObj.dsgnFlg == 0 ? 1 : 0, // 发布标志 0 未发布 1已发布
      })]).then((_res) => {
        const res = Object.assign(_res[0], _res[1], { bizLineId: this.bizLineId, competitorId: this.competitorId})
        // 保存当前选中服务信息
        this.currentServObj = res;
        this.getAllData(res);
        this.$refs.pattr.currentObj = res;
        this.$refs.pattr.getFlowParams(res);
        this.$nextTick(() => {
          this.$refs.pelem.getServicePickList();
        });
        // 参数设置页的内容
        // const inputList = res.puApiParams.filter(
        //   (item) => item.paramDirection === "0"
        // );
        // const outputList = res.puApiParams.filter(
        //   (item) => item.paramDirection === "1"
        // );
        // const tempList = res.puApiParams.filter(
        //   (item) => item.paramDirection === "3"
        // );
        // this.$refs.paramsRef.initParams(res)
        // this.getNodeId(this.$refs.paramsRef.iInputList);
        // this.$refs.paramsRef.iOutputList = reList(outputList);
        // this.getNodeId(this.$refs.paramsRef.iOutputList);
        // this.$refs.paramsRef.iTempList = reList(tempList);
        // this.getNodeId(this.$refs.paramsRef.iTempList);
        this.$refs.process.handleSvgBgClick();
        this.getServiceArrangeList();
      })
    },
    // 遍历数组 重新排序
    getNodeId(arrs, id) {
      if (!arrs || arrs.length == 0) return [];
      let i = 0;
      while (arrs[i]) {
        arrs[i].paramOrder = id ? id + "." + (i + 1) : i + 1 + "";
        arrs[i].paramParentId = id ? id : "";
        if (arrs[i].children && arrs[i].children.length > 0) {
          this.getNodeId(arrs[i].children, arrs[i].paramOrder);
        }
        i++;
      }
    },
    //编辑服务组件需求
    async editNeeds(e) {
      const dataObj = this.pcTranform();
      if (
        this.recordFlow !== JSON.stringify(dataObj.flow) ||
        this.recordPosition !== JSON.stringify(dataObj.position)
      ) {
        this.$confirm(
          "您修改了流程图，还未保存，需要保存后再跳转吗？",
          this.confirmOptions
        )
          .then(async () => {
            await this.save();
          })
          .catch(() => {})
          .finally(() => {
            this.$router.push({
              path: "/aop_tradedesign/assetsdesign/cpnModify",
              query: {
                reqmentId: e.data.actionOwnId,
                servId: this.servId,
                pageType: "edit",
              },
            });
          });
      } else {
        this.$router.push({
          path: "/aop_tradedesign/assetsdesign/cpnModify",
          query: {
            reqmentId: e.data.actionOwnId,
            servId: this.servId,
            pageType: "edit",
          },
        });
      }
    },
    //查看服务组件需求
    async checkNeeds(e) {
      console.log("展示对话框");
      this.showDialog();
      // this.$router.push({
      // path: "/aop_tradedesign/assetsdesign/cpnDetail",
      //   query: {
      //     reqmentId: e.data.actionOwnId,
      //   },
      // });
    },
    showDialog(e, data) {
      if (e == "group") {
        this.groupVisible = true;
        this.$refs.createGroupRef.formData.bkId = this.newServiceForm.bkId;
        this.$refs.createGroupRef.formData.arsId = this.newServiceForm.arsId;
        this.$refs.createGroupRef.init();
      } else if (e == "serviceInfo") {
        // this.$refs.serviceInfoDialog.showDialog(data)
      } else if (e == "system") {
        this.$refs.createSystemRef.showDialog(data);
      }
    },
    //返回
    goBack() {
      this.$router.go(-1);
    },
    //显示开发完成POP
    showConfirmPop() {
      this.isConfirmPop = true;
    },
    //关闭开发完成POP
    closeConfirmPop() {
      this.isConfirmPop = false;
    },
    //开发完成确认
    async confirmPop() {
      const data = { servId: this.servId };
      const res = await this.rpc.assets.completeServiceAssets(data);
      this.$notify({
        title: "成功",
        message: "成功",
        duration: 2000,
        type: "success",
      });
      this.closeConfirmPop();
      this.$router.push({
        path: "/aop_tradedesign/assetsmgmt/list",
      });
    },
    //显示服务定义POP
    showDefinePop(e) {
      this.definePopDesc = e == "1" ? "完成服务定义" : "暂停服务定义";
      this.definePopType = e;
      this.isDefinePop = true;
    },
    //关闭服务定义POP
    closeDefinePop() {
      this.isDefinePop = false;
    },
    //服务定义
    async definePop() {
      const data = { servId: this.servId, operTyp: this.definePopType };
      const res = await this.rpc.assets.defineServiceAssets(data);
      this.$notify({
        title: "成功",
        message: "成功",
        duration: 2000,
        type: "success",
      });
      this.closeDefinePop();
    },

    //切换视图
    changeType(e) {
      this.showType = e;
    },
    //画布触发
    //画布获取组件参数
    getAttrEvent(e, click) {
      console.log("getAttrEvent", e);
      this.$refs.pattr.getAttr(e, click);
      // this.mixDic();
    },
    //画布条件
    getConditionEvent(lineObj, lineList) {
      // this.$refs.pattr.getCondition(lineObj, lineList);
      // this.mixDic();
    },
    getConditionDbClickEvent(lineObj, lineList) {
      console.log("getConditionDbClickEvent");
      this.$refs.pattr.getCondition(lineObj, lineList);
      // this.mixDic();
    },
    //点击画布空白
    getSvgClickEvent(e) {
      if (e.flow.length !== 0) {
        // this.$refs.pattr.getFlowParams(this.dataObj);
        this.$refs.pattr.getSvgClickEvent(this.dataObj);
      }
    },
    //画布组件创建
    handleNewRectAdd(e) {
      console.log("handleNewRectAdd", e);
      if (e.actionType == "newD5Action") {
        console.log("新增D5");
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
      console.log("pickElemEvent", e);
      this.$refs.process.handleNewRectMousedown(e);
    },
    //点击开始设计按钮
    async startDesign() {
      this.isDesign = false;
      const params = {
        apiId: this.currentApiId,
        d4StusCd: "1", // 0-分析，1-设计；2-测试
        blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
        dsgnFlg: this.currentD4bObj.dsgnFlg || 1,
        // deployFlg: this.currentD4bObj.dsgnFlg == 0 ? 1 : 0, // 发布标志 0 未发布 1已发布
      };
      const dataParams = {
        apiId: this.currentApiId,
        d4StusCd: "1", // 0-分析，1-设计；2-测试
        blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
        dsgnFlg: this.currentD4bObj.dsgnFlg,
        // deployFlg: this.currentD4bObj.dsgnFlg == 0 ? 1 : 0, // 发布标志 0 未发布 1已发布
        apiCode: this.currentD4bObj.apiCode,
        apiVersion: this.currentD4bObj.apiVersion,
      };
      const res =
        this.typeInterface == "interfaceType"
          ? await this.rpc.apimgmt.toStartDesign(dataParams)
          : await this.rpc.d4.toStartDesign(params);
      this.refreshFlow();
    },
    //点击设计完成按钮
    completeDesign() {
      this.save().then(async () => {
        const params = {
          apiId: this.currentApiId,
          d4StusCd: "1", // 0-分析，1-设计；2-测试
          blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
          dsgnFlg: this.currentD4bObj.dsgnFlg || 1,
          // deployFlg: this.currentD4bObj.dsgnFlg == 0 ? 1 : 0, // 发布标志 0 未发布 1已发布
        };
        const dataParams = {
          apiId: this.currentApiId,
          d4StusCd: "1", // 0-分析，1-设计；2-测试
          blngtoTyp: "00", // 00-D4API，01-D5API,10-D4组件,11-D5组件
          dsgnFlg: this.currentD4bObj.dsgnFlg,
          // deployFlg: this.currentD4bObj.dsgnFlg == 0 ? 1 : 0, // 发布标志 0 未发布 1已发布
          apiCode: this.currentD4bObj.apiCode,
          apiVersion: this.currentD4bObj.apiVersion,
        };
        const res =
          this.typeInterface == "interfaceType"
            ? await this.rpc.apimgmt.toCompleteDesign(dataParams)
            : await this.rpc.d4.toCompleteDesign(params);
        // this.getServiceDesignDetail()
        this.refreshFlow();
        this.$refs.process.handleSvgBgClick();
      });
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

    // 创建服务组件
    operate(operation, data) {
      if (operation == "textClick") {
        this.getRelatedAssets(data);
      } else if (operation == "check") {
        this.newServiceVisiable = false;
        this.$router.push({
          path: "/aop_tradedesign/cpndesign/detail",
          query: {
            pageType: "read",
            reqmentId: data.reqmentId,
          },
        });
      }
    },
    //更改页码条数
    handleSizeChange(turnPageShowNum) {
      this.pager.turnPageShowNum = turnPageShowNum + "";
      this.getList();
    },
    //更改当前页
    handleCurrentChange() {
      this.getList();
    },
    //获取数据
    async getList() {
      const params = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        cpntNm: this.searchForm.cpntNm,
      };
      const res = await this.rpc.cpn.cpnCheckDuplicate(params);
      this.dataList = res.serviceList;
      this.pager.total = res.turnPageTotalNum * 1;
    },
    async getR5ServiceList() {
      const params = {
        ...this.form,
        releaseFlg: "1", // 0-未发布 1-已发布 2-全部
        svcTpCd: "02",
        // domainId: this.domainId,
      };
      const res = await this.rpc.d5.getR5ServiceList(params);
      this.dataList = res.reqSvcList;
      this.pager.total = res.turnPageTotalNum * 1;
    },
    //搜索
    search() {
      Object.assign(this.searchForm, this.form);
      this.pager.currentPage = "1";
      this.getR5ServiceList();
      // this.getList();
    },
    // 确认按钮
    confirm() {
      this.steps = 2;
      this.getBankList();
      // this.newServiceForm.cpntNm = this.form.cpntNm
    },
    // 获取关联资产
    getRelatedAssets(data) {
      if (data.serviceCount * 1 > 0) {
        const cpn = this.$refs.relatedAssetsList;
        cpn.reqmentId = data.reqmentId;
        cpn.getRelatedAssets(data);
      }
    },
    // 更新dataList
    updateDataParams(e) {
      console.log("updateDataParams", e);
      this.$refs.process.updateDataParams(e);
    },
    handleCondPritChange(newCondPrit, oldCondPrit, lineObj) {
      this.$refs.process.handleCondPritChange(
        newCondPrit,
        oldCondPrit,
        lineObj
      );
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
    // 更新参数
    upDateServParams(obj, e) {
      this.$refs.process.upDateServParams(obj, e);
    },
    // 显示创建D4分析的对话框
    showCreateDialog() {
      this.newServiceVisiable = true;
      console.log("showCreateDialog");
    },
    // 显示查看D2信息的对话框
    showD2InfoDialog() {
      console.log("showD2InfoDialog");
      this.d2InfoVisiable = true;
    },
    adjustSize() {
      this.toolsWidth =
        document.querySelector(".process_middle").offsetWidth * 1 - 10 + "px";
    },
    handleMousewheel(e) {
      if (e.wheelDelta > 0) {
        this.scaleRate += 0.1;
      } else {
        this.scaleRate -= 0.1;
      }
      e.preventDefault();
    },
    // 添加事件监听器
    addEventListener() {
      window.addEventListener("resize", this.adjustSize, false);
      // window.addEventListener("mousewheel", this.handleMousewheel, { passive: false });
      // document.querySelector(".process_middle").addEventListener("scroll", this.handleScroll, false)
    },
    // 删除事件监听器
    removeEventListener() {
      window.removeEventListener("resize", this.adjustSize, false);
      // window.removeEventListener("mousewheel", this.handleMousewheel);
      // document.querySelector(".process_middle").removeEventListener("scroll", this.handleScroll, false)
    },
    async showStandardCheckDialog() {
      this.$refs.standardCheckRef.showStandardCheckDialog();
    },
    getDataList(reference = false) {
      if (reference) {
        return this.$refs.process.dataList
      } else {
        return JSON.parse(JSON.stringify(this.$refs.process.dataList));
      }
    },
    setCurrentActionId(e) {
      this.$refs.process.setCurrentActionId = e;
    },
    deleteLineBySourceIdAndTargetId(sourceId, targetId) {
      this.$refs.process.deleteLineBySourceIdAndTargetId(sourceId, targetId);
    },
    showServInfo(e) {
      this.$refs.pattr.showServInfo(e);
      // this.showDialog("serviceInfo", e);
    },
    editNewD5Service() {
      const currentObj = this.$refs.pattr.currentObj;
      // console.log(currentObj)
      this.$refs.d5EditRef.showDialog("service", currentObj);
    },
    getR5Detail(data) {
      console.log("getR5Detail", data);
      this.$refs.pattr.getR5Detail(data.apiId, true);
    },

    updateSelect(e, data) {
      if (e == "system") {
        this.getSysList();
        // 设置下拉框选中新增的系统
        this.newServiceForm.arsId = data.arsId;
      } else if (e == "group") {
        this.getApiGroup();
        // 设置下拉框选中新增的分组
        this.newServiceForm.apiGroupId = data.sgId;
      }
    },
    handleDataView(flag, type) {
      if (type == "数据视图") {
        this.$refs.process.$refs.attrListRef.getDataLists();
      } else if (type == "数据视图列表") {
        this.dataViewVisible = flag;
        this.$refs.process.$refs.attrListRef.getList();
      } else {
        this.dataViewVisible = flag;
      }
    },
    //下装设计新增服务弹框
    addService() {
      // this.$refs.addServDialogRef.showDialog();
      setSessionStorage("designRouter",this.$route.fullPath)
      this.$router.push({
        path: "/aop_tradedesign/d4workbench/addServicePage",
        query: {
          transId: this.transId,
          bizLineId:this.bizLineId,
          competitorId:this.competitorId,
          beltLineNm:this.beltLineNm
        },
      });
    },
    //选择服务刷新服务列表
    getServiceList() {
      this.$refs.pelem.getServicePickList();
    },
    // 一键对齐
    oneKeyAlign() {
      this.$refs.process.oneKeyAlign()
    },
    async checkTrans() {
      const params = {
        tranId: this.transId,
      };
      const res = await this.rpc.downloadDesign.checkTrans(params);
      this.$refs.checkTrans.showDialog(res);
    },
    //自定义参数只能是英文
    hasOtherKey(data) {
      data.map(item => {
        if(item.paramValueType !== "List" && !(/^[a-zA-Z]+[0-9]*$/).test(item.paramKey)) {
          if(item.paramDirection in this.keyOtherList) {
            this.keyOtherList[item.paramDirection].push(item.paramCName)
          }else {
            this.keyOtherList[item.paramDirection] = []
            this.keyOtherList[item.paramDirection].push(item.paramCName)
          }
        }
        if(item.children && item.children.length) {
          this.hasOtherKey(item.children)
        }
      })
    },
    //自定义参数类型是List、Object,参数key不能是Java关键字
    hasKeyword(data) {
      data.map(item => {
        if(item.paramValueType == "Object" && this.javaKeyWord.includes(item.paramKey) ) {
          if(item.paramDirection in this.keywordList) {
            this.keywordList[item.paramDirection].push(item.paramCName)
          }else {
            this.keywordList[item.paramDirection] = []
            this.keywordList[item.paramDirection].push(item.paramCName)
          }
        }
        if(item.children && item.children.length) {
          this.hasKeyword(item.children)
        }
      })
    },
  },
  created() {
    this.init();
  },
  mounted() {
    this.$nextTick(() => {
      this.addEventListener();
      this.adjustSize();
      // this.getServiceDesignDetail();
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
.aop_tradedesign_page_d4workbench_workbench_service_design {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .design_container {
    display: flex;
    width: 100%;
    overflow: hidden;
    position: relative;
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
            // flex: 0 0 240px;
            flex: 0 0 275px;
            border-right: 1px solid $pri_br_color;
          }
          .process_right {
            background: $base_white;
          }
          .process_main {
            background: $base_white;
            display: inline-block;
            // margin: 16px;
            .process_divMb {
              margin-bottom: 2px;
            }
            &.four_r {
              margin-top: 6px;
            }
          }
          .process_middle {
            @include scrollbar;
            // background-color: $base_white;
            flex: 1;
            overflow-y: hidden;
            overflow-x: auto;
            position: relative;
            margin: 0px 20px 20px;
            box-shadow: 0 0 0 0 #e7e7ee;
            .process_box {
              height: calc(100% - 50px);
              background-color: $base_white;
              padding: 20px 20px 20px;
              overflow: auto;
              margin-top: 50px;
            }
            .create_container {
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .el-icon-plus {
                font-size: 60px;
              }
            }
            .top_btn_area {
              display: flex;
              justify-content: space-between;
              padding: 14px 16px 0;
              .btn {
                height: 24px;
                padding: 0 9px;
                cursor: pointer;
                border-radius: 2px;
                font-size: 14px;
                font-family: PingFangSC-Regular;
                letter-spacing: 0;
                &.back {
                  background: #ffffff;
                  border: 1px solid #358aff;
                  color: #358aff;
                }
                &.save {
                  background: #358aff;
                  border: 1px solid #358aff;
                  color: #ffffff;
                }
              }
            }
            .btn_style {
              position: absolute;
              right: 0;
              top: 12px;
              /deep/ .el-button {
                // border-radius: 2px;
              }
              .btn_align {
                @include mini_button_common;
                // box-shadow: 0 1px 10px 0 #e7e7e7;
                // z-index: 5;
                // padding: 12px 8px;
                // background: $base_white;
              }
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
    .check_formater_btn {
      width: 144px;
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
        width: 500px;
        margin: 0 auto;
      }
      padding: 16px 24px;
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
  .tips {
    margin-right: 12px;
    transition: none;
  }
}
</style>