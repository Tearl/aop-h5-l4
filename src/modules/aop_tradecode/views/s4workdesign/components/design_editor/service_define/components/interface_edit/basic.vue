<template>
  <div class="aop_tradecode_comps_d4bdesign_info_baisc">
    <div class="content_wrapper">
      <!-- 查看基本信息 -->
      <div class="content_read">
        <div class="detail_content">
          <div class="flex">
            <div class="content_header base_nav_title mgr20">基本信息</div>
            <el-checkbox v-model="detailInfo.isCommon" :disabled="isRead" v-if="!isRead">是否常用</el-checkbox>
            <div class="common_title" v-if="detailInfo.isCommon == '1' && isRead">常用</div>
            <!-- <div class="common_title" >常用</div> -->
          </div>
          <DetailInfo
            :detailInfo="detailInfo"
            :uploadFlag="uploadFlag"
            :getApiBizType="getApiBizType"
            :noTrans="isRead"
            @showRelatedTops="showRelatedTops"
            ref="detailRef"
          >
          </DetailInfo>
        </div>
        <!-- 部分信息展示 复用 -->
        <!-- 接口特性 -->
        <div class="detail_content">
          <div class="content_header base_nav_title">
            <span>接口特性</span>
            <el-radio-group v-model="btnradioType">
                <el-radio style="pointer-events: none;" :disabled="true && !btnradioType.includes(ra.value)" v-for="ra in radioList" :key="ra.value" :label="ra.value">{{ra.label}}</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 配置信息 -->
        <div class="detail_content">
          <div class="content_header base_nav_title" style="display: flex;">
            <span>配置信息</span>
                <el-checkbox-group style="margin-left:5px;" :value="btnCheckboxType">
                    <el-checkbox
                        v-for="box in checkboxList"
                        :key="box.value"
                        :label="box.value"
                        class="left"
                        @change="handleChange($event, box.value)"
                        :disabled="isRead && !btnCheckboxType.includes(box.value)"
                        >
                        {{box.label}}</el-checkbox>
                      <el-input class="content_header_input" v-model="logType" v-if="btnCheckboxType.includes('4')" :disabled="isRead" size="small"></el-input>
                </el-checkbox-group>
                        <!-- :disabled="isRead" -->

            </div>

        </div>
        <el-tabs class="infoTabsCard" v-model="tabActiveName" type="card" @tab-click="infoTabsClick">
            <el-tab-pane
                v-for="item in infotabsList"
                :key="item.value"
                :label="item.label"
                :name="item.name">
            </el-tab-pane>
        </el-tabs>
        <!-- 绑定交易列表 -->
        <div class="detail_content" v-if="tabActiveName=='second'">
          <div class="content_header base_nav_title">关联业务规则：
            <!-- <el-button
             type="primary"
            size="mini"
            class="m_btn"
            @click="showAddService('addService4')"
             v-if="detailInfo.srcFnctFlg!='0' && !isDisabled">添加</el-button> -->
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
                            <!-- <p v-html="scope.row.ruleDesc||'/'"></p> -->
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    prop="interactiveNm"
                    show-overflow-tooltip="true"
                    min-width="120"
                    label="原绑定交互事件列表">
                </el-table-column> -->
            </el-table>
          </div>
        </div>
        <!-- 添加接口 -->
        <Service4BDialog
            :visibleShow="visibleShowAdd"
            :dialogTitle="dialogTitle"
            :tableData="service4BList"
            :detailInfo="detailInfo"
            :formB="formA"
            :key="'1'"
            @closeDialog="closeDialog"
            name="service4BDialog"
        ></Service4BDialog>

        <!-- 业务规则实现列表 -->
        <!-- <div class="detail_content" v-if="tabActiveName=='second'">
          <div class="content_header base_nav_title">业务规则实现:
          </div>
          <div>
            <el-table
                :data="gridData2"
                :span-method="objectSpanMethod2"
                :header-cell-style="{ background: '#F5F5F8', color: '#606266' }"
                border
                style="width: 100%; margin-top: 20px">
                <el-table-column
                    prop="ruleId"
                    label="规则编号"
                    min-width="150">
                </el-table-column>
                <el-table-column
                    prop="ruleNm"
                    show-overflow-tooltip="true"
                    min-width="120"
                    label="规则名称">
                    <template slot-scope="scope">
                        <span
                        @click="operate3('guize', scope.row)"
                        style="color:#358aff;cursor:pointer;"
                        >
                        {{ scope.row.ruleNm }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="achFlg"
                    show-overflow-tooltip="true"
                    min-width="120"
                    label="服务实现">
                    <template slot-scope="scope">
                        <span
                            v-if="scope.row.achFlg=='1'"
                            @click="operate3('serviceName', scope.row)"
                            style="color:#358aff;cursor: pointer;"
                        >
                        {{ scope.row.svcNm }}
                        </span>
                        <span
                            v-if="scope.row.achFlg=='0'"
                            style="color:red;"
                        >
                        {{ '未实现' }}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
          </div>
        </div> -->

        <!-- 绑定交互列表 -->
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

        <!-- 参数配置 -->
        <div class="params_detail_content content_detail_params" v-show="!isRead && tabActiveName=='first'">
          <Params
            ref="paramsRef"
            :currentServObj="detailInfo"
            :arsId="svcId"
            :puApiParams="puApiParams"
            :noTrans="noTrans"
            :uploadFlag="uploadFlag"
            @paramList="paramIOlist"
            @delF="delF"
          ></Params>
        </div>
        <!-- 参数配置 -->
        <div v-if="isRead">
          <div class="detail_content" v-if="tabActiveName=='first'">
            <div class="content_header">输入参数</div>
            <Table
              class="table_style"
              :data="sendDataList"
              :table="iInputListTable"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div>
          <div class="detail_content" v-if="tabActiveName=='first'">
            <div class="content_header base_nav_title">输出参数</div>
            <Table
              class="table_style"
              :data="receiveDataList"
              :table="iOutputListTable"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div>
        </div>
        <!-- 规则列表编排 -->
        <!-- <div class="detail_content">
          <L5ServList
            ref="l5servRef"
            pageType="confirm"
            :showBtn="showBtn"
            :noTrans="noTrans"
          ></L5ServList>
        </div> -->
        <!-- <PageFooter
          @handleConfirm="handleConfirm"
          :confirmDisabled="isConfirm"
          :cancelLabel="''"
          :confirmLabel="'保存'"
          v-if="!isRead"
        ></PageFooter> -->
      </div>
      <!-- <div class="check_btn">
        <el-button type="text" icon="el-icon-edit-outline" v-if="isRead" :disabled="detailInfo.srcFnctFlg=='0' || isDisabled" @click="changeEdit"
          >编辑</el-button
        >
        <el-button type="primary" size="small" v-else  @click="changeEdit('save')"
          >保存</el-button
        >
      </div> -->
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { unduplicated } from "@m/utils/array";
import DetailInfo from "./info";
import Table from "@m/core/components/page_table";
import { reList, mixList, rowInfos } from "@m/utils/paramTree";
import Params from "./components/params";
import PageFooter from "@m/core/components/page_footer";
import PageTable from "@m/core/components/page_table";
import L5ServList from "./components/l5_service_list";
import interFaceInfoDetail from "../interface_detail/basic.vue";
import Service4BDialog from "./components/add_service.vue";

export default {
  mixins: [mixin],
  components: {
    DetailInfo,
    Table,
    Params,
    PageFooter,
    PageTable,
    L5ServList,
    interFaceInfoDetail,
    Service4BDialog,
  },
  props: {
    basicData: {
      type: Object,
      default: () => ({}),
    },
    orderInfo: {
      type: Object,
      default: () => ({}),
    },
    fnctCd: {
      type: String,
      default: () => "",
    },
    uploadFlag: {
      type: Boolean,
      default: () => false,
    },
    // isRead: {
    //   type: Boolean,
    //   default: () => true,
    // }
  },
  data() {
    return {
      detailInfo: {}, //服务组件基本信息
      svcId: "",
      noTrans: false,
      descList: {},
      keyList: {},
      competitorId: "", //银行ID
      /* 流程图相关变量 */
      dataObj: {
        flow: [],
        position: "",
      },
      appId: "",
      checkList: {},
      sendDataList: [],
      receiveDataList: [],
      isRead: true,
      isFilterList: [],
      apEncryTypeList: [],

      // btnradioType:'1', // 接口特性
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
        checkboxList:[{
            label:"校验会话",
            value:"1",
        },{
            label:"签名验签",
            value:"5",
        },{
            label:"加解密",
            value:"2",
        },
        {
            label:"脱敏",
            value:"3",
        },{
            label:"操作日志",
            value:"4",
        },],
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

      // 绑定交易
      intgridData:[],
      gridData:[],
        tables2: [
            {
                prop: "txId",
                label: "交易编号",
                minWidth: "150",
                type: "text",
                tooltip: true,
            },
            {
                prop: "txNm",
                label: "交易名称",
                minWidth: "150",
                type: "textClick",
                tooltip: true,
                operate:"txNmClick"
            },
            {
                prop: "d4iName",
                label: "原绑定交互事件",
                minWidth: "150",
                type: "textClick",
                tooltip: true,
                operate:"txNmClick"
            },
            {
                label: "操作",
                type: "button",
                fixed: 'right',
                width: "100",
                buttonList: [
                    {
                        desc: "删除",
                        operate: "del",
                    },
                ],
            },
        ],
        visibleShowAdd: false,
        dialogTitle:'',
        service4BList:[],
        formA:{},
        spanArr: [],
        // 业务规则实现
      gridData2:[],
        tables3: [
            {
                prop: "ruleId",
                label: "规则编号",
                minWidth: "150",
                type: "text",
                tooltip: true,
            },
            {
                prop: "ruleNm",
                label: "规则名称",
                minWidth: "150",
                type: "textClick",
                tooltip: true,
                operate:"txNmClick"
            },
            {
                prop: "achFlgNm",
                label: "服务实现",
                minWidth: "120",
                type: "textClick",
                tooltip: true,
                operate:"txNmClick",
                filter: (scope) => {
                    const option =  this.apEncryTypeList.find(item => item.value == scope.row?.apEncryType)
                    return option?.type || "无"
                },
            },
        ],
        // 绑定交互
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
      btnCheckboxType: [],
      status: false,
      logType: '',
      ruleList: [],
    };
  },
  computed: {
    isDisabled() {
      return this.$route.query.pageMode === 'preview'
    },
    // 数据输入列表参数
    iInputListTable() {
      return [
        {
          prop: "paramKey",
          label: "参数Key",
          width: "200px",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
          width: "200px",
          tooltip: true,
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramLength",
          label: "参数长度",
          type: "text",
          tooltip: true,
        },
        {
          prop: "signatureType",
          label: "签名验签",
          type: "text",
          filter: (scope) => {
            if (this.signatureList && this.signatureList.length > 0) {
              const option =  this.signatureList?.find(item => item.value == scope.row?.signatureType)
              return option?.type || "无"
            }
            return '无'
          },
          tooltip: true,
        },
        {
          prop: "apEncryType",
          label: "加密类型",
          type: "text",
          filter: (scope) => {
            const option =  this.apEncryTypeList?.find(item => item.value == scope.row?.apEncryType)
            return option?.type || "无"
          },
          tooltip: true,
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter",
          tooltip: true,
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apEnum",
          label: "枚举值",
          type: "text",
          tooltip: true,
        },
      ].filter(item => {
        if (item.label === '签名验签') {
          return this.detailInfo.isSignature
        } else if (["解密类型", "加密类型"].includes(item.label)) {
          return this.detailInfo.isEncode
        } else {
          return true
        }
      })
    },
    // 数据输出列表参数
    iOutputListTable() {
      return [
        {
          prop: "paramKey",
          label: "参数Key",
          width: "200px",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
          width: "200px",
          tooltip: true,
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramLength",
          label: "参数长度",
          type: "text",
          tooltip: true,
        },
        {
          prop: "actionName",
          label: "来源",
          type: "text",
          tooltip: true,
        },
                {
          prop: "paraMapgNm",
          label: "来源值",
          type: "text",
          filter: (scope) => {
            if (scope.row?.actionId == "constantValue") {
              return scope.row.paraMapgNm
            } else {
              return scope.row.paraMapgNm
            }
          },
          tooltip: true,
        },
        {
          prop: "desensitizationType",
          label: "脱敏类型",
          type: "text",
          filter: (scope) => {
            const option =  this.isFilterList.find(item => item.value == scope.row?.desensitizationType)
            if (scope.row.desensitizationType.includes('CUSTOMER')) {
              return scope.row.desensitizationType.replace('CUSTOMER', '自定义')
            }
            return option?.type || "无"
          },
          tooltip: true,
        },
        {
          prop: "apEncryType",
          label: "加密类型",
          type: "text",
          filter: (scope) => {
            const option =  this.apEncryTypeList.find(item => item.value == scope.row?.apEncryType)
            return option?.type || "无"
          },
          tooltip: true,
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter",
          tooltip: true,
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apEnum",
          label: "枚举值",
          type: "text",
          tooltip: true,
        },
      ].filter(item => {
        if (item.label == "脱敏类型") {
          return this.detailInfo.isDesensitization
        } else if (["解密类型", "加密类型"].includes(item.label)) {
          return this.detailInfo.isEncode
        } else {
          return true
        }
      })
    },
    btnradioType(){
        // isLogin: this.ruleForm.radioType=='2'?'1':'0', // 是否需要登录开关 常规 0否1是
        // isVerificationCode: this.ruleForm.radioType=='3'?'1':'0', //是否需要检验验证码 0否1是
        // isUploadFile: this.ruleForm.radioType=='4'?'1':'0', // 是否上传文件 0否1是
        console.log(this.detailInfo,'======')
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
  inject: {
    funcDetail: {
      type: Object,
    },
    reloadDetailInfo: {
      type: Function,
    },
  },
  methods: {
    // queryInterfaceRelFunctionDemandList
    async getRuleList() {
      const res = await this.rpc.assetList.queryInterfaceRelFunctionDemandList({
        ifId: this.detailInfo.svcId,
        fnctId: this.$route.query.fnctId,
      })
      this.ruleList = res.functionBizDemandInfoList
      this.ruleList.forEach((item) => {
        item.property = item.ruleId
      })
    //   this.ruleList = [...this.ruleList, ...this.ruleList]
      this.getSpanArr(this.ruleList)
    },

    checkStatus(list) {
      let status = false
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item.actionId === 'complex') {
          if (item.children && item.children.length > 0) {
            const res = this.checkStatus(item.children)
            if (!res) {
              return res
            }
          }
        } else {
          if (item.actionId) {
            status = true
          }
          if (i === list.length - 1) {
            if (!status) {
              return false
            }
            status = false
          }
        }
      }
      return true
    },
    getSpanArr(data) {
    // data就是我们从后台拿到的数据
      let pos = 0
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        console.log(`rowspan:${_row} colspan:${_col}`);
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        };
      }
    },
    handleChange(status, value) {
      if (this.isRead) {
        return
      }
      const arr = []
      if (!this.btnCheckboxType.length) {
        this.btnCheckboxType.push(value)
        arr.push(value)
      } else {
        for (let i = 0; i < this.btnCheckboxType.length; i++) {
          const item = this.btnCheckboxType[i];
          if (item !== value) {
            arr.push(item)
          }
        }
      }
      if (!this.btnCheckboxType.includes(value)) {
        arr.push(value)
      }
      this.btnCheckboxType = arr
      this.detailInfo.isDesensitization = this.btnCheckboxType.includes('3') ? "1" : "0", //是否脱敏
      this.detailInfo.isEncode = this.btnCheckboxType.includes('2')? "1" : "0", //是否加密
      this.detailInfo.isSignature = this.btnCheckboxType.includes('5')? "1" : "0", //是否签名
      this.detailInfo = {
        ...this.detailInfo
      }
      // console.log(value)
    },
    showRelatedTops() {
      this.$emit("showRelatedTops");
    },
    setTransFlag(e) {
      this.noTrans = e;
    },
    checkSource(list) {
      for (var i = 0; i < list.length; i++) {
        const item = list[i];
        if (item.paramDirection === '1') {
          if (!item.actionId) {
            this.$message.error(`输出参数${item.paramKey}来源、来源值不能为空`)
            return true
          }
          if (!item.paramMappingKey && item.actionId !== "complex") {
            this.$message.error(`输出参数${item.paramKey}来源值不能为空`)
            return true
          }
        }
      }
    },
    addInterface() {
      console.log("添加接口");
      this.$emit("addInterface");
    },
    //点击提交按钮 保存D4b服务信息
    async handleConfirm() {
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

      // const list = receiveData.filter((item) => {
      //   return item.actionId === 'complex'
      // })
      // const result = this.checkStatus(list)
      // if (!result && list.length) {
      //   return this.$message.error('复合来源的子参数至少有一个来源、来源值不能为空')
      // }

      // 2024-08-15 不校验参数来源和来源值是否为空
      // const checkStatus = this.checkSource(puApiParams)

      // if (checkStatus) {
      //   return true
      // }
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
      if (this.btnCheckboxType.includes('2')) {
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
      if (this.detailInfo.isDesensitization === '0') {
        puApiParams.forEach((item) => {
          item.desensitizationType = ''
        })
      }
      if (this.detailInfo.isEncode === '0') {
        puApiParams.forEach((item) => {
          item.apEncryType = ''
        })
      }
      if (this.detailInfo.isSignature === '0') {
        puApiParams.forEach((item) => {
          item.signatureType = ''
        })
      }
      // let funcInfo = JSON.parse(getSessionStorage("func-info"));
      const params = {
        fnctId: this.fnctCd || this.$route.query.fnctId,
        blngTyp: "0",
        blngtoTyp: "00",
        apiId: this.basicData.svcId, // ApiID
        apiName: this.basicData.svcNm, // API名称
        apiCode: this.basicData.svcCd, // Api编号
        inOutFlg: this.basicData.inOutFlg, // 内外标志
        apiVersion: this.basicData.svcVersionNo, // API版本
        arsId: this.basicData.sysId, // 系统Id
        arsNm: this.basicData.arsNm, // 系统名称
        lvl1TypeCodeId: "", // 服务大类
        lvl2TypeCodeId: "", // 服务小类
        apiServiceType: this.basicData.svcTpCd, // 服务类型
        apiDesc: this.basicData.svcDesc, // API描述
        versionDesc: this.basicData.sersionDesc, // API版本描述
        // groupId: this.basicData.groupId,
        beltLine: this.basicData.beltLine, // 归属业务线
        paramList: puApiParams,
        d4UseDataSetRelList: [],
        isLogin: this.basicData.isLogin ? "1" : "0", //是否登录
        isVerificationCode: this.basicData.isVerificationCode ? "1" : "0", //是否需要校验验证码
        isUploadFile: this.basicData.isUploadFile ? "1" : "0", //是否上传文件
        // svcSeq: this.basicData.svcSeq,
        isLog: this.btnCheckboxType.includes('4') ? '1' : '0',
        isSignature: this.btnCheckboxType.includes('5') ? '1' : '0',
        isCommon: this.basicData.isCommon ? "1": "0",
        isLoginOut: this.btnradioType=='5' ? '1' : '0',
        isSession: this.btnCheckboxType.includes('1') ? "1" : "0", //是否需要会话
        isEncode: this.btnCheckboxType.includes('2')? "1" : "0", //是否加密
        isDesensitization: this.btnCheckboxType.includes('3') ? "1" : "0", //是否脱敏
        logType: this.logType,
        aiClass: this.basicData.aiClass,
        aiLabel: this.basicData.aiLabelNew,
      };
      this.isConfirm = true;
      console.log("参数：--》222", params);
      await this.rpc.newEditor.editD4Trans(params);
      this.rpc.s4design.addFuntionJobCommitFlow({
        fnctId: this.$route.query.fnctId,
        jobTpCd: 'C4',
      })
      this.$notify({
        title: "成功",
        message: "保存成功",
        duration: 2000,
        type: "success",
      });
      this.isConfirm = false;
      this.$emit("changeList");
      return 0
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
        // console.log("data", data);
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
    // 判断自定义参数为List类型时paramKey是否以List结尾
    checkListEnd(data) {
      let flag = data.some((item) => {
        if (item.paramCustomFlg == "1" && item.paramValueType == "List") {
          let param = item.paramKey.slice(-4);
          return param != "List";
        } else {
          if (item.children && item.children.length) {
            this.checkListEnd(item.children);
          }
        }
      });
      return flag;
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
    // 初始化
    init() {},
    search() {
      this.$emit("showRelatedTops");
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
    async changeEdit(type) {
      
      if(type && type=='save'){
        if (!this.logType && this.btnCheckboxType.includes('4')) {
          return this.$message.error('操作日志不能为空');
        }
        return await this.handleConfirm()
        
      }
      if(type && type=='edit'){
        this.isRead = false
      }

      if (this.status) {
        this.status = false
        return
      }
      
      if (!this.isRead) {
        this.$nextTick(() => {
          this.$refs.detailRef.showInterface = false;
          this.$refs.paramsRef.initParams(this.detailInfo);
        });
      } else {
        this.sendDataList = reList(
          this.detailInfo.puApiParams?.filter((item) => item.paramDirection == 0)
        );
        this.receiveDataList = reList(
          this.detailInfo.puApiParams?.filter((item) => item.paramDirection == 1)
        );
        this.setSourceOption(this.receiveDataList);
        
      }
    },
    setSourceOption(data) {
      data.forEach((item) => {
        if (item.actionId == "" && item.actionName == "当前4b交易") {
          item.actionId = this.detailInfo.svcId;
          item.actionName = "当前4b交易";
          item.paramMappingKey = item.paramKey;
          item.paraMapgNm = item.paramCName;
        }
        if (item.children && item.children.length) {
          this.setSourceOption(item.children);
        }
      });
    },
    async getDessitizaList(){
      const res = await this.rpc.d4.getDessitizaList();
      let tempArr = {value:"0",type:"无"}
      this.isFilterList.length = 0;
      if(res.desensitizationTypeList && res.desensitizationTypeList.length >0){
        res.desensitizationTypeList.map((item) =>{
          this.isFilterList.push({
            value:item.desensitizationType,
            type:item.desensitizationName
          })
        })
        this.isFilterList.unshift(tempArr)
      }else{
        this.isFilterList = [...tempArr]
      }
      this.apEncryTypeList = res.apEncryTypeList?.reduce((prev, item) => {
        prev.push({
          value: item.desensitizationType,
          type: item.desensitizationName,
        })
        return prev
      }, [{ value: "0", type: "无"}])
      this.signatureList = res.signatureList?.reduce((prev, item) => {
        prev.push({
          value: item.desensitizationType,
          type: item.desensitizationName,
        })
        return prev
      }, [{ value: "0", type: "无"}])
    },
    infoTabsClick(v){
        console.log(v,"llllmmmmmm")
    },
    // 绑定交易列表查询 queryInterfaceRelTradeList
    async getContList(value) {
        if(!this.detailInfo.svcId){
            return
        }
        this.gridData = []
        const params = {
            ifId: this.detailInfo.svcId,
        }
        const res = await this.rpc.s4design.queryInterfaceRelTradeList(params);
        this.intgridData = res.bizTradeInfoList || [];
        let arr1 = []
        let list = res.bizTradeInfoList.map((ele,index)=>{
            let obj = {}
            if(Array.isArray(ele.eventInfoList) && ele.eventInfoList.length > 0){
                // console.log("====",index, ele.eventInfoList.length)
                ele.eventInfoList.forEach((el)=>{
                    obj = {
                        d4iId: el.d4iId,
                        d4iName: el.d4iName,
                        functionId: el.functionId,
                        isolateWorkspace: el.isolateWorkspace,
                        layoutId: el.layoutId,
                        modelVersion: el.modelVersion,
                        relateType: el.relateType,
                        serviceApiId: el.serviceApiId,
                        txId:ele.txId,
                        txNm: ele.txNm,
                        listleng:ele.eventInfoList.length,
                        idx: index,
                    }
                    arr1.push(obj)
                })
            } else {
                obj = {
                        txId:ele.txId,
                        txNm: ele.txNm,
                        listleng:0,
                        idx: index,
                    }
                arr1.push(obj)
            }

        })
        // console.log(arr1,'arr1')
        this.gridData = arr1;
    },
    // 接口绑定交互查询
    async queryServiceEvents(){
        this.gridData3 = [];
        const params = {
            // isolateWorkspace: 'C3' || this.detailInfo.isolateWorkspace,
            ifId: this.detailInfo.svcId,
        }
        const res = await this.rpc.s4design.queryServiceEvents(params);
        this.gridData3 = res.devopsEnevtInfoList || [];
    },
    // 业务规则实现查询
    async queryInterfaceRuleListS4(){
        this.gridData2 = [];
        const params = {
            ifId: this.detailInfo.svcId,
        }
        const res = await this.rpc.s4design.queryInterfaceRuleListS4(params);
        let arr2 = []
        let list = res.bizRuleInfoList.map((ele,index)=>{
            let obj = {}
            if(Array.isArray(ele.s5ServiceInfoList) && ele.s5ServiceInfoList.length > 0){
                ele.s5ServiceInfoList.forEach((el)=>{
                    obj = {
                        svcId: el.svcId,
                        svcCd: el.svcCd,
                        svcNm: el.svcNm,
                        // 以上是二级列表提取
                        ruleSrcCd: ele.ruleSrcCd,
                        achFlg: ele.achFlg,
                        ruleId:ele.ruleId,
                        ruleNm: ele.ruleNm,
                        listleng:ele.s5ServiceInfoList.length,
                        idx: index,
                    }
                    arr2.push(obj)
                })
            } else {
                obj = {
                        ruleSrcCd: ele.ruleSrcCd,
                        achFlg: ele.achFlg,
                        ruleId:ele.ruleId,
                        ruleNm: ele.ruleNm,
                        listleng:0,
                        idx:index,
                    }
                arr2.push(obj)
            }

        })
        // console.log(arr1,'arr1')
        this.gridData2 = arr2;
        // console.log('业务规则实现列表',this.gridData2)
    },
    operate(operation, data) {
        console.log(operation, data)
        if(operation=='del'){
            this.$confirm("确定要删除吗？", "", {
                distinguishCancelAndClose: true,
                center: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
            .then(() => {
                this.delContlist(data)
            })
            .catch((action) => {
                console.log(action)
            });
        }
        // 交互事件名称查看
        if(operation=='eventDetail'){
            let params = {
                kind:data.relateType,
                orderId: data.isolateWorkspace,
                assetId: this.$route.query.fnctNo,
                functionId: data.functionId,
                functionVersion: data.modelVersion,
                layoutId: data.layoutId,
                showType:'flow',
                mode:'look',
                projectId: data.appid || '',
            }
            let params6 = rowInfos(params);
            // 无appid 的跳转
            window.open(
                `/aop-h5-sub/#/aop_enddesign/layoutex/requirement?${params6}`,
                "_blank"
            );
            // window.open(
            //     `/aop-h5-sub/#/aop_enddesign/layoutex/design?${params6}`,
            //     "_blank"
            // );
        }
        // 绑定交易跳转
        if(operation=='listnameDetail'){
            window.open(
                `/aop-h5-sub/#/aop_businessd2/transactionDesign/transDetail?apiId=${data.txId}`,
                "_blank"
            );
        }
    },
    // 交互跳转查看
    operate2(operation, data) {
        if(operation=='txNmClick'){
            let params = {
                kind: data.relateType,
                orderId: data.isolateWorkspace,
                assetId: this.$route.query.fnctNo,
                functionId: data.functionId || this.$route.query.fnctId,
                functionVersion: data.modelVersion,
                layoutId: data.layoutId,
                showType:'flow',
                mode:'look',
                projectId: data.appId,
                examId: this.$route.query.examId
            }
            let params6 = rowInfos(params);
            // window.open(
            //     `/aop-h5-sub/#/aop_enddesign/layoutex/requirement?${params6}`,
            //     "_blank"
            // );

            // 有appid 的跳转
            window.open(
                `/aop-h5-sub/#/aop_enddesign/layoutex/design?${params6}`,
                "_blank"
            );
        }
    },
    // 规则跳转查看
    operate3(operation, data) {
        if(operation=='guize'){
            window.open(
                `/aop-h5-sub/#/aop_tradecode/s5Design/interfaceDetail?apiId=${data.ruleId}`,
                "_blank"
            );
        }
        if(operation=='serviceName'){
            window.open(
                `/aop-h5-sub/#/aop_tradedesign/d4workbench/directL5Detail?svcId=${data.svcId}`,
                "_blank"
            );
        }
    },
    async deleteRow(data){

    },
    // 添加交易
    showAddService(row){
        // 全部交易列表
        this.service4BList= [];
        this.visibleShowAdd = true;
        this.dialogTitle = "选择业务交易";
        this.queryFunctionBizTradeList()
    },
    async queryFunctionBizTradeList(){
        const params = {
        fnctId: this.$route.query.fnctId || '', //功能编号   FM-ZC-2023-000663
      };
      const res = await this.rpc.s4design.queryFunctionBizTradeList(params);
      this.service4BList = res.bizTradeAchieveSituationList;
    },
    // 多个弹窗关闭交互
    closeDialog(type,val){
        if(type=='serviceClose'){
            this.visibleShowAdd = false;
            this.getContList()
        }
    },
    listnameDetail(value) {
        window.open(
            `/aop-h5-sub/#/aop_businessd2/transactionDesign/transDetail?apiId=${value.txId}`,
            "_blank"
        );
    },
    // 删除绑定交易
    async delContlist(val){
        // idList 实现情况id集合 achSituId
        const params = {
            ifId: this.detailInfo.svcId,
            txId: val.txId,
            idList:val.idList || []
        }
        const res = await this.rpc.s4design.removeInterfaceAndTradeRel(params)
        this.rpc.s4design.addFuntionJobCommitFlow({
          fnctId: this.$route.query.fnctId,
          jobTpCd: 'C4',
        })
        this.getContList(res);
    },
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //     // console.log('当前行rowIndex',rowIndex , row)
    //     // console.log('当前列columnIndex',columnIndex,column,row)
    //     if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
    //         // 获取当前单元格的值
    //         const currentValue = row[column.property];
    //         // 获取上一行相同列的值
    //         const preRow = this.gridData[rowIndex - 1];
    //         const preValue = preRow ? preRow[column.property] : null;
    //         // 如果当前值和上一行的值相同，则将当前单元格隐藏
    //         if (currentValue === preValue) {
    //             return { rowspan: 0, colspan: 0 };
    //         } else {
    //             // 否则计算当前单元格应该跨越多少行
    //             let rowspan = 1;
    //             for (let i = rowIndex + 1; i < this.gridData.length; i++) {
    //                 const nextRow = this.gridData[i];
    //                 const nextValue = nextRow[column.property];
    //                 if (nextValue === currentValue) {
    //                 rowspan++;
    //                 } else {
    //                 break;
    //                 }
    //             }
    //             return { rowspan, colspan: 1 };
    //         }
    //     }
    // },
    objectSpanMethod2({ row, column, rowIndex, columnIndex }) {
        // console.log('当前行rowIndex',rowIndex , row)
        // console.log('当前列columnIndex',columnIndex,column)
        if (columnIndex === 0 || columnIndex === 1) {
            // 获取当前单元格的值
            const currentValue = row[column.property];
            // 获取上一行相同列的值
            const preRow = this.gridData2[rowIndex - 1];
            const preValue = preRow ? preRow[column.property] : null;
            // 如果当前值和上一行的值相同，则将当前单元格隐藏
            if (currentValue === preValue) {
                return { rowspan: 0, colspan: 0 };
            } else {
                // 否则计算当前单元格应该跨越多少行
                let rowspan = 1;
                for (let i = rowIndex + 1; i < this.gridData2.length; i++) {
                    const nextRow = this.gridData2[i];
                    const nextValue = nextRow[column.property];
                    if (nextValue === currentValue) {
                    rowspan++;
                    } else {
                    break;
                    }
                }
                return { rowspan, colspan: 1 };
            }
        }
    },
  },
  created() {
    this.init();
    this.competitorId = this.$route.query.competitorId || "";
    this.appId = this.$route.query.appId || "";
  },
  watch: {
    sendDataList() {
      console.log("sendDataList", this.sendDataList);
    },
    async basicData(res, o) {
      console.log(res, "res222222")
      this.detailInfo = res;

      this.detailInfo.isSession =
        this.detailInfo.isSession == "1" ? true : false;
      this.detailInfo.isVerificationCode =
        this.detailInfo.isVerificationCode == "1" ? true : false;
      this.detailInfo.isUploadFile = this.detailInfo.isUploadFile == "1";
      this.detailInfo.isLogin = this.detailInfo.isLogin == "1";
      this.detailInfo.isEncode = this.detailInfo.isEncode == "1";
      this.detailInfo.isLog = this.detailInfo.isLog == '1';
      this.detailInfo.isDesensitization =
        this.detailInfo.isDesensitization == "1";
      this.detailInfo.isCommon = this.detailInfo.isCommon == "1";
      this.detailInfo.isSignature = this.detailInfo.isSignature == "1";
      this.sendDataList = [];
      this.receiveDataList = [];
      this.svcId = res.svcId;
      this.isRead = true;
      this.btnCheckboxType = []
      if(this.detailInfo.isSession) {
        this.btnCheckboxType =  ['1'];
      }
      if(this.detailInfo.isEncode) {
        this.btnCheckboxType.push('2');
      }
      if(this.detailInfo.isDesensitization) {
        this.btnCheckboxType.push('3');
      }
      if (this.detailInfo.isLog) {
        this.btnCheckboxType.push('4')
        this.logType = this.detailInfo.logType
      } else {
        this.logType = ''
      }
      if (this.detailInfo.isSignature) {
        this.btnCheckboxType.push('5')
      }
      this.$nextTick(() => {
        this.getContList()
        this.queryServiceEvents();
        this.queryInterfaceRuleListS4();
        this.getRuleList();
        if (this.svcId) {
          // this.$refs.l5servRef.initData(this.svcId);
          if (!this.isRead) {
            this.$refs.detailRef.showInterface = false;
            this.$refs.paramsRef.initParams(res);
          } else {
            this.sendDataList = reList(
              res.puApiParams.filter((item) => item.paramDirection == 0)
            );
            this.receiveDataList = reList(
              res.puApiParams.filter((item) => item.paramDirection == 1)
            );
            this.setSourceOption(this.receiveDataList);
            this.getDessitizaList();
          }
          // this.$refs.paramsRef.initParams(res);

          // this.$refs.detailRef.getInterfaceNm(res.svcNm);
        } else {
          this.$refs.paramsRef.sendData = [];
          this.$refs.paramsRef.receiveData = [];
        }
        console.log("ppppppp",this.receiveDataList)
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_d4bdesign_info_baisc {
    width:100%;
  ::v-deep .el-textarea__inner:focus,
  ::v-deep .el-input__inner:focus {
    border-color: $pri_br_color;
  }
  .content_wrapper {
    font-family: $font_regular;
    position: relative;
    width: 100%;
    padding-bottom: 30px;
    .content_read {
      position: relative;
      width:100%;
      .detail_content {
        background: $base_white;
        padding: 20px 32px;
        width:calc(100vw - 320px);
        // margin-bottom: 16px;
        .check_group {
          display: flex;
          margin-top: 16px;
          .left,
          .right {
            width: 50%;
          }
        }
      }
      .infoTabsCard{
        display: inline-block;
        width: 100%;
        padding: 16px 32px 0 32px;
        /deep/.is-active{
            background:#358aff!important;
            color:#fff!important;
        }
      }
      .content_header {
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
        margin-bottom: 12px;
        .content_header_input {
          width: 100px;
          margin-left: 10px;
        }
        .m_btn{
            font-size: 14px;
            color:#fff;
            margin-left: 10px;
            cursor:pointer;
            float:right;
        }
        span{
            margin-right: 10px;
            font-weight: 550;
        }
      }
      .process_middle {
        background: $base_white;
        padding: 20px 32px;
        margin-bottom: 16px;
        height: 500px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .process_box {
        @include scrollbar;
        overflow-y: auto;
        overflow-x: auto;
      }
      .btn {
        position: absolute;
        right: 55%;
        top: 10px;
      }
    }
  }
  .check_btn {
    position: fixed;
    top: 150px;
    right: 40px;
    z-index: 1001;
  }
  .aop_tradecode_comps_page_footer{
    margin-bottom: 38px;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .mgr20 {
    margin-right: 20px;
    margin-bottom: 0px !important;
  }
  .common_title{
    // border-radius: 50% 50%;
    transform:scale(0.8);
    width: 28px;
    height: 20px;
    // height: 24px;
    text-align: center;

    line-height: 20px;
    // background: #e5ffe7;
    background: red;
    color: #fff;
    // border-color: #e5ffe7;
    font-size: 12px;
    // box-shadow: #36d542;
    border: 1px solid red;
  }
  /deep/.w-e-scroll{
    p{
        white-space: normal!important;
    }
  }
}
</style>
