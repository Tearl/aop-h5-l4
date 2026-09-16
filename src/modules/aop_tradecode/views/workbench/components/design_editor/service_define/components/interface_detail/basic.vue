<template>
  <div class="aop_tradecode_comps_d4bdesign_info_baisc" v-loading="isLoading" element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading">
    <div class="content_wrapper">
      <div class="content_read">
        <!-- 基本信息 -->
        <div class="detail_content">
          <div class="content_header base_nav_title">基本信息
                <div class="right-btns">
                  <el-tooltip
                      class="item"
                      effect="dark"
                      content="保存"
                      placement="top-start"
                      v-if="isEditing"
                  >
                      <img
                          src="@m/assets/images/icon_save_h.png"
                          alt=""
                          srcset=""
                          @click="handleSave"
                      />
                  </el-tooltip>
                  <el-tooltip
                      class="item"
                      effect="dark"
                      content="编辑"
                      placement="top-start"
                  >
                      <img
                          v-if="$route.query.mode == 'editor'&&!isEditing"
                          src="@m/assets/images/icon_editor_h.png"
                          alt=""
                          srcset=""
                          @click="changeEdit"
                      />
                  </el-tooltip>
              </div>
          </div>
          <DetailInfo
            :detailInfo="detailInfo"
            :uploadFlag="uploadFlag"
            :noTrans="noTrans"
            :isEditing="isEditing"
          >
          </DetailInfo>
        </div>
        <!-- 流程图 -->
        <div class="detail_content">
          <div class="content_header base_nav_title">
            <span>流程图</span>
            <div v-if="isEditing" class="edit_buttons param_buttons">
              <el-button type="primary" size="mini" @click="showFlowChartEditor">编辑流程图</el-button>
            </div>
          </div>
          <div ref="graphContainer" class='flow-pic'>
            <img v-if="imageUrl" :src="imageUrl" alt="plantUML Diagram" />
          </div>
        </div>
        <!-- 接口特性 -->
        <div class="detail_content">
          <div class="content_header base_nav_title">
            <span>接口特性</span>
          </div>
           <el-radio-group v-model="btnradioType">
              <el-radio style="pointer-events: none;" :disabled="true && !btnradioType.includes(ra.value)" v-for="ra in radioList" :key="ra.value" :label="ra.value">{{ra.label}}</el-radio>
           </el-radio-group>
        </div>
        <!-- 配置信息 -->
        <div class="detail_content">
          <div class="content_header base_nav_title">配置信息</div>
          <div class="check_group">
            <el-checkbox v-model="detailInfo.isSession" class="left" :disabled="!isEditing">校验会话</el-checkbox>
            <el-checkbox v-model="detailInfo.isSignature" class="left" :disabled="!isEditing">签名验签</el-checkbox>
            <el-checkbox v-model="detailInfo.isEncode" class="right" :disabled="!isEditing">加解密</el-checkbox>
            <el-checkbox v-model="detailInfo.isDesensitization" class="right" :disabled="!isEditing">脱敏</el-checkbox>
            <el-checkbox v-model="detailInfo.isLog" class="right" :disabled="!isEditing">操作日志
            <el-input class="content_header_input" style="width:100px ;"  v-model="logType" v-if="detailInfo.isLog" :disabled="!isEditing" size="small"></el-input>
            </el-checkbox>
          </div>
        </div>
         <!-- 拓展信息 -->
         <div class="detail_content">
          <div class="content_header base_nav_title">
            <span>基本信息-拓展</span>
          </div>
          <AdditionalInformation
            :uploadFlag="uploadFlag"
            :noTrans="noTrans"
            :isEditing="isEditing"
            ref="AdditionalInformation"
          >
          </AdditionalInformation>
        </div>
        <el-tabs class="infoTabsCard" v-model="tabActiveName" type="card" @tab-click="infoTabsClick">
            <el-tab-pane
                v-for="item in infotabsList"
                :key="item.value"
                :label="item.label"
                :name="item.name">
            </el-tab-pane>
        </el-tabs>
        <!-- 参数配置 -->
        <div class="params_detail_content content_detail_params" v-show="isEditing && tabActiveName=='first'">
          <Params
            ref="paramsRef"
            :currentServObj="detailInfo"
            :arsId="detailInfo.svcId"
            :puApiParams="basicData.puApiParams"
            :noTrans="noTrans"
            :uploadFlag="uploadFlag"
          ></Params>
        </div>
         <div v-if="!isEditing">
          <div class="detail_content" v-if="tabActiveName=='first'">
            <div class="base_nav_title content_header">
              <span class="border-line" 
                >输入参数
                <el-button
                  type="primary"
                  size="mini"
                  style="margin-left: 10px"
                  @click="headerClick"
                  >{{ isShowHeader ? "隐藏报文头" : "显示报文头" }}</el-button
                ></span
              >
              <div class="param_buttons">
                <el-button  type="danger" plain size="mini" @click="ctandardTestClick">标化检测</el-button>
              </div>
            </div>
            <Table
              class="table_style"
              :data="iInputList"
              :table="iInputListTable"
              :rowK="'paramOrder'"
              :stripe="true"
              :treeProps="{ children: 'children' }"
              @operate="outputTargetOperate"
            ></Table>
          </div>
          <div class="detail_content" v-if="tabActiveName=='first'">
            <div class="content_header base_nav_title">
              <span>输出参数</span>
            </div>
              <Table
                class="table_style"
                :data="iOutputList"
                :table="iOutputListTable"
                :rowK="'paramOrder'"
                :treeProps="{ children: 'children' }"
                @operate="outputTargetOperate"
              ></Table>
          </div>
         </div>
        <div class="detail_content" v-if="tabActiveName=='second'">
          <div class="content_header base_nav_title">关联业务规则：
          </div>
          <div>
            <el-table
                :data="ruleList"
                :span-method="objectSpanMethod"
                :header-cell-style="{ background: '#F5F5F8', color: '#606266' }"
                border
                style="width: 100%; margin-top: 20px">
                <el-table-column
                    prop="ruleId"
                    label="规则ID"
                    show-overflow-tooltip="true"
                    min-width="180">
                </el-table-column>
                <el-table-column
                    prop="ruleNm"
                    show-overflow-tooltip="true"
                    min-width="150"
                    label="规则名称">
                </el-table-column>
                <el-table-column
                    prop="ruleDesc"
                    show-overflow-tooltip="true"
                    min-width="120"
                    label="规则描述">
                    <template slot-scope="scope">
                        <div style="display:flex;flex-wrap:wrap;padding:0 0;">
                            <aopCommonDocPreview :data="scope.row.ruleDesc||'/'"></aopCommonDocPreview>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
          </div>
        </div>
         <div class="detail_content" v-if="tabActiveName=='third'">
          <div class="content_header base_nav_title">绑定交互:
          </div>
          <div>
            <PageTable
                class="table_style"
                ref="radioTableRef2"
                :table="tables4"
                :data="gridData3"
                rowK="bussiness"
                @operate="operate2"
                @textClick="textClick"
                :show-overflow-tooltip="true"
            ></PageTable>
          </div>
        </div>
      </div>
    </div>
    <compStandard ref="compStandard" v-on="$listeners" />
    <StandardTest ref="StandardTest" @reflesh="getDessitizaList" />
    <PageDialog
      :dialogVisiable="flowChartEditorVisible"
      dialogWidth="900px"
      @closeDialog="handleFlowChartEditorClose"
      dialogTitle="编辑流程图"
      class="dialog"
      :apTobody="true"
      :footerShow="false"
      :closeOnClickModal="false"
      :closeOnPressEscape="false"
    >
      <div slot="box" class="content flow-chart-editor">
        <el-row :gutter="20" class="equal-height-row">
          <el-col :span="12" class="equal-height-col">
            <el-input
              type="textarea"
              v-model="flowChartText"
              placeholder="请输入PlantUML格式的流程图描述"
              style="width: 100%; height: 100%;"
              :rows="15"
              @input="debounceGenerateFlowChart"
            ></el-input>
          </el-col>
          <el-col :span="12" class="equal-height-col">
            <div class="preview-container">
              <div v-if="!tempImageUrl" class="empty-preview">
                流程图预览区
              </div>
              <img v-else :src="tempImageUrl" alt="plantUML Diagram" class="preview-image" />
            </div>
          </el-col>
        </el-row>
        <div class="editor-buttons">
          <el-button type="primary" @click="handleConfirm">确认</el-button>
          <el-button @click="handleFlowChartEditorClose">取消</el-button>
        </div>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import DetailInfo from "./info";
import { encode } from "plantuml-encoder";
import Table from "./components/page_table_workgate";
import { reList, mixList } from "@m/utils/paramTree";
import { unduplicated } from "@m/utils/array";
import PageTable from "@m/core/components/page_table";
import compStandard from "./compStandard";
import StandardTest from "./components/standardTest.vue";
import PageDialog from "./components/page_dialog";
import Params from "./components/params";
import AdditionalInformation from "./components/additionalInformation";

export default {
  mixins: [mixin],
  components: {
    DetailInfo,
    Table,
    compStandard,
    StandardTest,
    PageDialog,
    PageTable,
    Params,
    AdditionalInformation
  },
  props: {
    basicData: {
      type: Object,
      default: () => ({}),
    },
    uploadFlag: {
      type: Boolean,
      default: () => false,
    },
    noTrans: {
      type: Boolean,
      default: () => false,
    },
    mode: { 
      type: String, 
      default: 'view' ,
    },
    fnctCd: { 
      type: String, 
      default: '' ,
    }
  },
  data() {
    return {
      isLoading: false,
      logType: '',
      ruleList:[],
      radioList:[{
            label:"常规",
            value:"1",
        },{
            label:"登录",
            value:"2",
        },
        {
            label:"登出",
            value:"5",
        },
        {
            label:"校验验证码",
            value:"3",
        },{
            label:"上传文件",
            value:"4",
      }],
      gridData3:[],
      tables4: [
          {
              prop: "d4iId",
              label: "交互事件编号",
              minWidth: "150",
              type: "text",
              tooltip: true,
          },
          {
              prop: "d4iName",
              label: "交互事件名称",
              minWidth: "150",
              type: "textClick",
              tooltip: true,
              operate:"txNmClick"
          },
      ],
      tabActiveName:'first',
      infotabsList:[{
            label:'输入输出',
            value:'first',
            name:'first',
        },{
            label:'业务规则',
            value:'second',
            name:'second',
        },{
            label:'前端交互',
            value:'third',
            name:'third',
      }],
      isShowHeader: false,
      flowChart: null,
      flowChartText: '',
      flowChartEditorVisible: false,
      error: null,
      isEditing: false,
      iInputList: [], // 数据输入列表
      iOutputList: [], // 数据输出列表
      allInputList: [],
      allOutputList: [],
      detailInfo: {
        isSession: false,
        isEncode: false,
        isDesensitization: false,
        isLog: false, 
        bizDomainCode: '',
        isSignature: false,
      },
      keyList: {},
      isFilterList: [],
      apEncryTypeList: [],
      /* 流程图相关变量 */
      imageUrl: null,
      originalFlowChartText: '',
      originalFlowChart: '',
      originalImageUrl: null,
      tempImageUrl: null,
      sendDataList:[],
      receiveDataList:[]
    };
  },
  mounted() {
    this.mode === 'editor'?this.isEditing = true:this.isEditing = false
  },
  computed: {
    // 数据输入列表参数
    iInputListTable() {
      const baseColumns = [
        {
          prop: "paramKey",
          label: "参数Key",
          width: "200px",
          type: "text",
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
        },
        {
          prop: "fieldKeyName",
          label: "字段标准编码",
              width: "120px",
          type: "text",
          textClass: "standard",
        },
        {
          prop: "fieldName",
          label: "字段标准名称",
              width: "120px",
          type: "text",
          textClass: "standard",
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
              width: "120px",
          type: "text",
        },
        {
          prop: "paramLength",
          label: "参数长度",
          type: "text",
        },
        {
          prop: "apEncryType",
          label: "加密类型",
          type: "text",
          filter: (scope) => {
            const option = this.apEncryTypeList.find(
              (item) => item.value == scope.row?.apEncryType
            );
            return option?.type || "";
          },
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter",
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          type: "text",
        },
        {
          prop: "dictryEnum",
          label: "枚举值",
          type: "text",
        },
        // {
        //   prop: "extId",
        //   label: "扩展表ID",
        //   type: "text",
        // },
         {
          prop: "packageName",
          label: "类所在包名",
            width: "120px",
          type: "text",
        },
         {
          prop: "classEnName",
          label: "参数类英文名称",
            width: "120px",
          type: "text",
        },
         {
          prop: "classCnName",
          label: "参数类中文名称",
            width: "120px",
          type: "text",
        },
         {
          prop: "paramKeyIndex",
          label: "参数KEY索引",
            width: "120px",
          type: "text",
        },
        {
          label: "操作",
          type: "button",
          width: "80",
          buttonList: [
            {
              desc: "标准化",
              operate: "standardization",
            },
          ],
        },
      ].filter((item) => {
        if (["解密类型", "加密类型"].includes(item.label)) {
          return this.detailInfo.isEncode;
        } else {
          return true;
        }
      });
      return baseColumns;
    },
    // 数据输出列表参数
    iOutputListTable() {
      const baseColumns = [
        {
          prop: "paramKey",
          label: "参数Key",
          width: "200px",
          type: "text",
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
        },
        {
          prop: "fieldKeyName",
          label: "字段标准编码",
              width: "120px",
          type: "text",
          textClass: "standard",
        },
        {
          prop: "fieldName",
          label: "字段标准名称",
              width: "120px",
          type: "text",
          textClass: "standard",
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
              width: "120px",
          type: "text",
        },
        {
          prop: "paramLength",
          label: "参数长度",
          type: "text",
        },
        {
          prop: "actionName",
          label: "来源",
          type: "text",
        },
        {
          prop: "paraMapgNm",
          label: "来源值",
          type: "text",
          filter: (scope) => {
            if (scope.row?.actionId == "constantValue") {
              return scope.row.paramMappingKey;
            } else {
              return scope.row.paraMapgNm;
            }
          },
        },
        {
          prop: "desensitizationType",
          label: "脱敏类型",
          type: "text",
          filter: (scope) => {
            const option = this.isFilterList.find(
              (item) => item.value == scope.row?.desensitizationType
            );
            return option?.type || "";
          },
        },
        {
          prop: "apEncryType",
          label: "加密类型",
          type: "text",
          filter: (scope) => {
            const option = this.apEncryTypeList.find(
              (item) => item.value == scope.row?.apEncryType
            );
            return option?.type || "";
          },
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter",
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          type: "text",
        },
        {
          prop: "dictryEnum",
          label: "枚举值",
          type: "text",
        },
        {
          prop: "extId",
          label: "扩展表ID",
          type: "text",
        },
         {
          prop: "packageName",
          label: "类所在包名",
            width: "120px",
          type: "text",
        },
         {
          prop: "classEnName",
          label: "参数类英文名称",
            width: "120px",
          type: "text",
        },
         {
          prop: "classCnName",
          label: "参数类中文名称",
            width: "120px",
          type: "text",
        },
         {
          prop: "paramKeyIndex",
          label: "参数KEY索引",
            width: "120px",
          type: "text",
        },
        {
          label: "操作",
          type: "button",
          width: "80",
          buttonList: [
            {
              desc: "标准化",
              operate: "standardization",
            },
          ],
        },
      ].filter((item) => {
        if (item.label == "脱敏类型") {
          return this.detailInfo.isDesensitization;
        } else if (["解密类型", "加密类型"].includes(item.label)) {
          return this.detailInfo.isEncode;
        } else {
          return true;
        }
      });

      return baseColumns;
    },
    btnradioType(){
        if (this.detailInfo.isLoginOut === '1') {
          return '5'
        }
        if(this.detailInfo.isLogin){
            return '2';
        }
        if(this.detailInfo.isVerificationCode){
            return '3';
        }
        if(this.detailInfo.isUploadFile){
            return '4';
        }
        if(!this.detailInfo.isLogin){
            return '1';
        }
        return
    },
  },
  methods: {
    changeEdit(){
      this.isEditing = true
      this.$nextTick(() => {
          this.$refs.paramsRef.initParams(this.detailInfo);
      });
    },
    // 接口绑定交互查询
    async queryServiceEvents(){
        this.gridData3 = [];
        const params = {
            ifId: this.detailInfo.svcId,
        }
        const res = await this.rpc.s4design.queryServiceEvents(params);
        this.gridData3 = res.devopsEnevtInfoList || [];
    },
    async getRuleList() {
      const res = await this.rpc.assetList.queryInterfaceRelFunctionDemandList({
        ifId: this.detailInfo.svcId,
        fnctId: this.fnctCd,
      })
      this.ruleList = res.functionBizDemandInfoList
      this.ruleList.forEach((item) => {
        item.property = item.ruleId
      })
      this.getSpanArr(this.ruleList)
    },
    getSpanArr(data) {
      let pos = 0
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          pos = 0
        } else {
          if (data[i].ruleId === data[i - 1].ruleId) {
            this.spanArr[pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            pos = i;
          }
        }
      }
    },
    outputTargetOperate(operation, data) {
      if (operation == "standardization") {
        this.$refs.compStandard.showDialog(data);
      }
    },
    headerClick() {
      this.isShowHeader = !this.isShowHeader;
      this.changeStatus();
    },
    ctandardTestClick() {
      this.$refs.StandardTest.showDialog();
    },
   
    setSourceOption(data) {
      data.forEach((item) => {
        if (!item.actionId) {
          item.actionId = this.detailInfo.svcId;
          item.actionName = "当前4b交易";
        }
        if (item.actionId === 'constantValue') {
          if (item.paramMappingKey && !item.paraMapgNm) {
            item.paraMapgNm = item.paramMappingKey;
          } else if (item.paraMapgNm && !item.paramMappingKey) {
            item.paramMappingKey = item.paraMapgNm;
          }
        } else if (!item.paraMapgNm) {
          item.paraMapgNm = item.paramCName;
        }
        if (item.children && item.children.length) {
          this.setSourceOption(item.children);
        }
      });
    },
  
    async getDessitizaList() {
      const res = await this.rpc.d4.getDessitizaList();
      let tempArr = { value: "0", type: "无" };
      this.isFilterList.length = 0;
      if (
        res.desensitizationTypeList &&
        res.desensitizationTypeList.length > 0
      ) {
        res.desensitizationTypeList.map((item) => {
          this.isFilterList.push({
            value: item.desensitizationType,
            type: item.desensitizationName,
          });
        });
        this.isFilterList.unshift(tempArr);
      } else {
        this.isFilterList = [...tempArr];
      }
      this.apEncryTypeList = res.apEncryTypeList?.reduce(
        (prev, item) => {
          prev.push({
            value: item.desensitizationType,
            type: item.desensitizationName,
          });
          return prev;
        },
        [{ value: "0", type: "无" }]
      );
    },
    changeStatus() {
      const tempInArr = this.allInputList.filter(
        (item) => item.paramPosition == 0
      );
      const tempOutArr = this.allOutputList.filter(
        (item) => item.paramPosition == 0
      );

      this.iInputList = this.isShowHeader
        ? this.allInputList
        : tempInArr.length
        ? [...tempInArr[0].children]
        : [];

      this.iOutputList = this.isShowHeader
        ? this.allOutputList
        : tempOutArr.length
        ? [...tempOutArr[0].children]
        : [];
    },
    showFlowChartEditor() {
      this.originalFlowChartText = this.flowChartText;
      this.originalFlowChart = this.flowChart;
      this.originalImageUrl = this.imageUrl;
      this.flowChartText = this.flowChart || '';
      this.flowChartEditorVisible = true;
    },
    handleFlowChartEditorClose() {
      this.flowChartText = this.originalFlowChartText;
      this.flowChart = this.originalFlowChart;
      this.imageUrl = this.originalImageUrl;
      this.tempImageUrl = null;
      this.flowChartEditorVisible = false;
    },
    generateFlowChart() {
      if (!this.flowChartText.trim()) {
        this.tempImageUrl = null;
        return;
      }
      try {
        const encoded = encode(this.flowChartText, {
          server: "http://www.plantuml.com/plantuml/proxy",
          format: "svg",
          timeout: 5000,
        });
        this.tempImageUrl = `https://www.plantuml.com/plantuml/img/${encoded}`;
        this.flowChart = this.flowChartText;
      } catch (error) {
        console.error("Error generating PlantUML image:", error);
      }
    },
    handleConfirm() {
      if (this.flowChartText.trim()) {
        this.generateFlowChart();
        this.imageUrl = this.tempImageUrl;
        this.flowChart = this.flowChartText;
        this.flowChartEditorVisible = false;
        this.$message.success('流程图已保存');
      } else {
        this.flowChart = '';
        this.imageUrl = null;
        this.tempImageUrl = null;
        this.flowChartEditorVisible = false;
        this.$message.info('流程图已清空');
      }
    },
    debounceGenerateFlowChart() {
      if (this.generateFlowChartTimer) {
        clearTimeout(this.generateFlowChartTimer);
      }
      this.generateFlowChartTimer = setTimeout(() => {
        this.generateFlowChart();
      }, 1000);
    },

    async  handleSave() {
      this.isLoading = true
      const sendData = this.$refs.paramsRef.sendData;
      const receiveData = this.$refs.paramsRef.receiveData;
      const i = this.getOnly(sendData);
      if (i.length > 0) {
         this.$message.error(
          "输入参数的参数key: " + i[0].paramKey + "不能重复!请检查"
        );
        return 1
      }
      const l = this.getOnly(receiveData);
      if (l.length > 0) {
         this.$message.error(
          "输出参数的参数key: " + l[0].paramKey + "不能重复，请检查"
        );
        return 1
      }
      //转一维数组
      let puApiParams = JSON.parse(
        JSON.stringify(
          mixList(sendData, "children").concat(mixList(receiveData, "children"))
        )
      );
      const isEmpty = this.getCheckEmpty(puApiParams);
      if (isEmpty) {
         this.$message.error("参数Key、参数名称、参数值类型不能为空");
         return 1
      }

      this.keyList = {};
      this.hasKey(puApiParams);
      if (this.keyList[0]) {
         this.$message.error(
          `自定义输入参数类型为List：参数名称为【${this.keyList[0]}】的 "参数key"要以List为结尾`
        );
        return 1
      }
      if (this.keyList[1]) {
         this.$message.error(
          `自定义输出参数类型为List：参数名称为【${this.keyList[1]}】的 "参数key"要以List为结尾`
        );
        return 1
      }
      if (this.detailInfo.isEncode) {
        this.sendDataList = [];
        let sendDataChild = sendData.filter(
          (item) => item.paramKey == "bodyData"
        );
        this.hasCheck(sendDataChild, "bodyData");
        if (this.sendDataList?.length > 0) {
          this.isRead = false
          this.status = true
           this.$message.error(
            `输入参数解密类型不能为空，参数名称为【${this.sendDataList}】`
          );
          return 1
        }
        this.receiveDataList = [];
        let receiveChild = receiveData.filter(
          (item) => item.paramKey == "bodyOutData"
        );
        this.hasCheck(receiveChild, "bodyOutData");
        if (this.receiveDataList?.length > 0) {
          this.status = true
          this.isRead = false
           this.$message.error(
            `输出参数加密类型不能为空，参数名称为【${this.receiveDataList}】`
          );
          return 1
        }
      }

      if (puApiParams) {
        puApiParams.map((item, index) => {
          item.paramIndex = index;
        });
      }
      if (!this.detailInfo.isDesensitization) {
        puApiParams.forEach((item) => {
          item.desensitizationType = ''
        })
      }
      if (!this.detailInfo.isEncode) {
        puApiParams.forEach((item) => {
          item.apEncryType = ''
        })
      }
      if (!this.detailInfo.isSignature) {
        puApiParams.forEach((item) => {
          item.signatureType = ''
        })
      }
      const expendInfo = this.$refs.AdditionalInformation.exportInfo()
      const params = {
        fnctId: this.fnctCd,
        aopS4ExtendInfoBean:{...expendInfo},
        blngTyp: "0",
        blngtoTyp: "00",
        lvl1TypeCodeId: "", // 服务大类
        lvl2TypeCodeId: "", // 服务小类
        d4UseDataSetRelList: [],
        flowChart:this.flowChart,
        apiId: this.$route.query.apiId, // ApiID
        apiName: this.detailInfo.svcNm, // API名称
        apiCode: this.detailInfo.svcCd, // Api编码
        inOutFlg: this.detailInfo.inOutFlg, // 内外标志
        apiVersion: this.detailInfo.svcVersionNo, // API版本
        arsId: this.detailInfo.sysId, // 系统Id
        arsNm: this.detailInfo.arsNm, // 系统名称
        apiServiceType: this.detailInfo.svcTpCd, // 服务类型
        apiDesc: this.detailInfo.svcDesc, // API描述
        versionDesc: "", // API版本描述
        beltLine: this.detailInfo.beltLine, // 归属业务线
        paramList: puApiParams,
        isLogin: this.detailInfo.isLogin ? "1" : "0", //是否登录
        isVerificationCode: this.detailInfo.isVerificationCode ? "1" : "0", //是否需要校验验证码
        isUploadFile: this.detailInfo.isUploadFile ? "1" : "0", //是否上传文件
        isLog: this.detailInfo.isLog ? '1' : '0',
        isSignature: this.detailInfo.isSignature? '1' : '0',
        isCommon: "0",
        isLoginOut: this.btnradioType=='5' ? '1' : '0',
        isSession: this.detailInfo.isSession? "1" : "0", //是否需要会话
        isEncode: this.detailInfo.isEncode? "1" : "0", //是否加密
        isDesensitization: this.detailInfo.isDesensitization ? "1" : "0", //是否脱敏
        logType: this.logType,
        aiClass: this.detailInfo.aiClass,
        aiLabel: '',
      };
      await this.rpc.newEditor.updateFncEdittSvc(params);
      this.isEditing = false;
      this.$notify({
        title: "成功",
        message: "保存成功",
        duration: 1000,
        type: "success",
      });
      this.$refs.AdditionalInformation.init()
      this.$emit("reflesh");
      this.isLoading = false
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
    hasKey(data) {
      data.map((item) => {
        if (
          item.paramCustomFlg == "1" &&
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
    hasCheck(data, type) {
      if (data?.length == 0) return [];
      data.map((item) => {
        if (
          !["bodyData", "bodyOutData"].includes(item.paramKey) &&
          item.paramParentId &&
          !item.apEncryType
        ) {
          if (type == "bodyData") this.sendDataList.push(item.paramCName);
          else this.receiveDataList.push(item.paramCName);
        }
        if (item?.children?.length > 0) {
          this.hasCheck(item.children, type);
        }
      });
    },
   
  },
  watch: {
    async basicData(res, o) {
        this.flowChart = res.flowChart || '';
        this.flowChartText = res.flowChart || '';
        
        if (this.flowChart) {
          try {
            const encoded = await encode(this.flowChart, {
              server: "http://www.plantuml.com/plantuml/proxy",
              format: "svg",
              timeout: 5000,
            });
            this.imageUrl = `https://www.plantuml.com/plantuml/img/${encoded}`;
          } catch (error) {
            console.error("Error generating PlantUML image:", error);
          }
        }
        
        this.detailInfo = {
          ...res,
          isSession: res.isSession == "1",
          isSignature: res.isSignature == "1",
          isEncode: res.isEncode == "1",
          isDesensitization: res.isDesensitization == "1",
          isLog: res.isLog == "1",
          isSignature: res.isSignature == "1",
          isVerificationCode: res.isVerificationCode == "1",
          isUploadFile: res.isUploadFile == "1",
          isLogin: res.isLogin == "1"
        };
       this.$refs.AdditionalInformation.queryS4ExtendInfo(this.detailInfo)
        this.logType = this.detailInfo.logType
        if(this.isEditing){
            this.$refs.paramsRef.initParams(res);
        }else{
        this.iInputList = [];
        this.iOutputList = [];
        this.$nextTick(() => {
          this.allInputList = [].concat(
          reList(res.puApiParams.filter((item) => item.paramDirection == 0))
        );
        this.allOutputList = [].concat(
          reList(res.puApiParams.filter((item) => item.paramDirection == 1))
        );
          this.queryServiceEvents();
          if(!!this.fnctCd){
            this.getRuleList();
          }
          this.changeStatus();
          this.setSourceOption(this.iOutputList);
        });
        this.getDessitizaList();
        }
       
      
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_comps_d4bdesign_info_baisc {
   .right-btns {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-content: center;
      cursor: pointer;
      img {
          width: 24px;
          height: 24px;
      }
    }
   .user_define {
          background: $base_white;
          color: $theme_color;
          border: 0.5px solid $theme_color;
        }
 .infoTabsCard{
        display: inline-block;
        width: 100%;
        padding: 16px 32px 0 16px;
        background-color: #fff;
        /deep/.is-active{
            background:#358aff!important;
            color:#fff!important;
        }
      }
  .content_wrapper {
    font-family: $font_regular;
    .content_read {
      .detail_content {
        background: $base_white;
        padding: 20px 32px;
        margin-bottom: 16px;
      }
      .content_header {
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
      }
      .base_input_title {
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
        display: flex;
        align-items: center; 
        justify-content: space-between; 
      }
      .param_buttons {
        display: flex;
        position: absolute;
        right: 0;
        top: 0;
        gap: 8px;
      }
      .content_header.base_nav_title {
        // display: flex;
        // align-items: center;
        // justify-content: space-between;
        position: relative;
        margin-bottom: 16px;
        &::before {
          content: "";
          border: 2px solid #358aff;
          margin-right: 6px;
          height: 60%;
        }
      }
      .table_style {
        clear: both;
        position: relative;
        overflow-x: scroll;
        width: 100%;
        overflow-x: hidden; 
        padding-right: 0;
        border-bottom: 1px solid #ebeef5;
        @include scrollbar;
        &::after {
          display: none; 
        }
        .grid_header {
          background: #fafafc;
          color: #333;
          padding: 4px 10px;
          white-space: nowrap;
          word-break: break-all;
          text-overflow: ellipsis;
          overflow: hidden;
          vertical-align: middle;
          font-size: 14px;
          font-weight: bold;
          border-bottom: 1px solid #ebeef5;
        }
        .grid_content {
          display: flex;
          padding: 12px 10px;
          border-bottom: 1px solid #ebeef5;
          height: 57px;
        }
        .level-indent {
          display: inline-block;
          height: 14px;
          vertical-align: middle;
          margin-right: 6px;
        }
        .expand-icon {
          cursor: pointer;
          margin-right: 4px;
          transition: transform 0.2s;
        }
        .expand-icon.expanded {
          transform: rotate(90deg);
        }
      }
      .button-list {
        display: flex;
        justify-content: center;
      }

    }
  }
  .check_group {
    display: flex;
    align-items: center;
    margin-top: 16px;
    .left,
    .right {
      width: 50%;
    }
  }
}
.flow-pic {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
}
.flow-chart-editor {
  .preview-container {
    height: 360px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9f9f9;
  }
  .empty-preview {
    color: #909399;
    font-size: 14px;
  }
  .preview-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .dialog {
    ::v-deep.el-dialog {
      margin-top: 5px  !important;
      width: 900px !important;
    }
    ::v-deep.el-dialog__body {
      height: 700px;
      overflow: hidden;
      padding: 0 !important;
    }
  }
}
.content_wrapper {
  padding-bottom: 3%;
}
</style>
