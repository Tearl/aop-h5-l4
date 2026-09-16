<template>
  <div class="aop_tradecode_comps_apimgmt_api_mod_params">
    <div class="params_wrapper">
      <el-form
        :model="formData"
        class="create_form"
        ref="formData"
        label-width="90px"
      >
      <!-- zhouzhiyuan -->
        <div class="create_form_info">
          <el-form-item label="输入参数">
            <div class="input_wrapper base_nav_title">
              <div class="top_right_create">
                <el-tag type="warning" class="el_tag"
                  >1、自定义添加参数时，需在参数描述输入自定义原因，
                  2、自定义参数类型为List时，参数key要以List为结尾</el-tag
                >
                <div>
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    class="user_define"
                    :disabled="noTrans"
                    @click="addBodyData('s', '1')"
                    >自定义添加</el-button
                  >
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    :disabled="noTrans"
                    @click="addBodyData('s', '2')"
                    >从服务添加</el-button
                  >
                </div>
              </div>
              <div class="data_wrapper">
                <PageBigData
                  ref="sendDataRef"
                  parentClass="send_data"
                  :data="sendData"
                  :isCascader="true"
                  paramsType="input"
                  :detailInfo="currentServObj"
                  :apEncryTypeList="apEncryTypeList"
                  @updateTableData="updataInputData"
                  :signatureList="signatureList"
                  @addList="addList"
                  @addObj="addObj"
                  @add="addBdata"
                  @del="delBdata"
                  @addByDic="addByDic"
                  @paramKeyBlur="paramKeyBlur"
                  @setLengthDisabled="setLengthDisabled"
                ></PageBigData>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="create_form_info">
          <el-form-item label="输出参数">
            <div class="output_wrapper base_nav_title">
              <div class="top_right_create">
                <el-tag type="warning" class="el_tag"
                  >1、自定义添加参数时，需在参数描述输入自定义原因，
                  2、自定义参数类型为List时，参数key要以List为结尾</el-tag
                >
                <div>
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    class="user_define"
                    :disabled="noTrans"
                    @click="addBodyData('r', '1')"
                    >自定义添加</el-button
                  >
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    :disabled="noTrans"
                    @click="addBodyData('r', '2')"
                    >从服务添加</el-button
                  >
                </div>
              </div>
              <div class="data_wrapper">
                <PageBigData
                  ref="receiveDataRef"
                  parentClass="receive_data"
                  :data="receiveData"
                  :sourceList="sourceList"
                  :bodyData="bodyData"
                  :isCascader="true"
                  paramsType="output"
                  :serviceIdMapToParamList="serviceIdMapToParamList"
                  :compositeIdMapToParamList="compositeIdMapToParamList"
                  :detailInfo="currentServObj"
                  :isFilterList="isFilterList"
                  :apEncryTypeList="apEncryTypeList"
                  @updateTableData="updateTableData"
                  @addList="addList"
                  @addObj="addObj"
                  @add="addBdata"
                  @del="delBdata"
                  @addByDic="addByDic"
                  @chooseVal="chooseVal"
                  @sourceChange="sourceChange"
                  @focusChange="focusChange"
                  @paramKeyBlur="paramKeyBlur"
                  @setLengthDisabled="setLengthDisabled"
                  @updateCompositeIdMapToParamList="updateCompositeIdMapToParamList"
                ></PageBigData>
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <AddDicParams
      ref="dicRef"
      :detailInfo="currentServObj"
      :getApiBizType="getApiBizType"
      :currentServObj="currentServObj"
      :compositeIdMapToParamList="compositeIdMapToParamList"
      @saveParams="saveParamsDataset"
    ></AddDicParams>
    <UserDefinedParams
      ref="userDefinedRef"
      :detailInfo="currentServObj"
      :getApiBizType="getApiBizType"
      @saveParams="saveParamsDataset"
    ></UserDefinedParams>
    <ChooseVal
      ref="chooseValRef"
      :servId="servId"
      @saveSourceParams="saveSourceParams"
    ></ChooseVal>
    <aopBusinessDatadict ref="aopBusinessDatadict" @selectConfirm="saveParamsDataset" />
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import {
  unduplicated,
  array2flat,
} from "@m/utils/array";
import PageBigData from "@m/core/components/download_design/page_big_data/transIndex";
import AddDicParams from "./dialog/addParams";
import UserDefinedParams from "@m/core/components/download_design/page_big_data/addUserDefined";
import ChooseVal from "./dialog/chooseVal";
import { reList, mixList, setParamOrder } from "@m/utils/paramTree";
import { sourceActionType, actionTypeToApSource } from "@m/utils/normalData";

export default {
  mixins: [mixin],
  components: {
    PageBigData,
    AddDicParams,
    ChooseVal,
    UserDefinedParams
  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    arsId: {
      type: String,
      default: () => "",
    },
    noTrans: {
      type: Boolean,
      default: () => false,
    },
    uploadFlag: {
      type: Boolean,
      default: () => false,
    },
    getApiBizType: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      servNm: "",
      isHandleParamType: "",
      // 当前数据
      isData: {},
      sendData: [], // 请求报文
      receiveData: [], // 响应报文
      formData: {},
      currentSubObj: {},
      datasetObj: {},
      L5CheckList: [],
      paramsIntList: [],
      paramsIntL5List: [],
      paramsOutList: [],
      paramsOutL5List: [],
      radioModel: "",
      L5Arr: [],
      l5ServiceList: [],
      puApiParams: [],
      l5SvcList: [
        {
          svcId: "121",
          svcNm: "测试1",
        },
        {
          svcId: "122",
          svcNm: "测试2",
        },
      ],
      currentParams: {},
      scorllFalg: false,
      sourceList: [],
      apSource: "00",
      childrenArr: [],
      formInline: {},
      sourceVal: null,
      servId: "", //来源选的服务id
      bodyData: [],
      serviceIdMapToParamList: {},
      speciTypeList: [
        { type: "List", value: "List", label: "List",},
        { type: "Object", value: "Object", label: "Object" },

      ],
      typeList: [
        { type: "String", value: "String", label: "String" },
        { type: "File", value: "File", label: "File" },
        {
          value: 'List', type: 'List', label: "List",
          children: [
            { value: 'String', label: 'String', parent: 'List',},
            { value: 'Character', label: 'Character', parent: 'List',},
            { value: 'Integer', label: 'Integer', parent: 'List',},
            { value: 'Byte', label: 'Byte', parent: 'List',},
            { value: 'Short', label: 'Short', parent: 'List',},
            { value: 'Long', label: 'Long', parent: 'List',},
            { value: 'Float', label: 'Float', parent: 'List',},
            { value: 'Double', label: 'Double', parent: 'List',},
            { value: "Date", label: "Date", parent: 'List',},
          ]
        },
        {
          value: 'Array', type: 'Array', label: "Array",  disabled: true,
          children: [
            { value: 'String', label: 'String', parent: 'List',},
            { value: 'Character', label: 'Character', parent: 'List',},
            { value: 'Integer', label: 'Integer', parent: 'List',},
            { value: 'Byte', label: 'Byte', parent: 'List',},
            { value: 'Short', label: 'Short', parent: 'List',},
            { value: 'Long', label: 'Long', parent: 'List',},
            { value: 'Float', label: 'Float', parent: 'List',},
            { value: 'Double', label: 'Double', parent: 'List',},
            { value: "Date", label: "Date", parent: 'List',},
          ]
        },
        { type: "boolean", value: "boolean", label: "boolean" },
        { type: "char", value: "char", label: "char" },
        { type: "int", value: "int", label: "int" },
        { type: "byte", value: "byte", label: "byte" },
        { type: "short", value: "short", label: "short" },
        { type: "long", value: "long", label: "long" },
        { type: "float", value: "float", label: "float" },
        { type: "double", value: "double", label: "double" },
        { type: "Boolean", value: "Boolean", label: "Boolean" },
        { type: "Character", value: "Character", label: "Character" },
        { type: "Integer", value: "Integer", label: "Integer" },
        { type: "Byte", value: "Byte", label: "Byte" },
        { type: "Short", value: "Short", label: "Short" },
        { type: "Long", value: "Long", label: "Long" },
        { type: "Float", value: "Float", label: "Float" },
        { type: "Double", value: "Double", label: "Double" },
        { type: "BigDecimal", value: "BigDecimal", label: "BigDecimal" },
        { type: "Object", value: "Object", label: "Object" },
        { type: "Date", value: "Date", label: "Date" },
        { type: "LocalDate", value: "LocalDate", label: "LocalDate" },
        { type: "LocalDateTime", value: "LocalDateTime", label: "LocalDateTime" },
      ],
      tableLength: 0,
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
      compositeIdMapToParamList: {},
      isFilterList:[],
      apEncryTypeList:[],
      projectId: "",
      signatureList: [],
    };
  },
  watch: {
    sendData(val) {
      val.forEach((item) => {
        if (!item.paramParentId && item.paramKey == "bodyData") {
          item.childTier = 1;
          if (item.children && item.children.length) {
            // 设置每层层数
            this.getchildTier(item.children, 1);
          }
        }
      });
    },
    receiveData(val) {
      // console.log("receiveData");
      val.forEach((item) => {
        if (!item.paramParentId && item.paramKey == "bodyOutData") {
          item.childTier = 1;
          if (item.children && item.children.length) {
            // 设置每层层数
            this.getchildTier(item.children, 1);
          }
        }
      });
    },
  },
  methods: {
    updataInputData() {
      this.sendData = [...this.sendData]
    },
    updateTableData() {
      this.receiveData = JSON.parse(JSON.stringify(this.receiveData))
      console.log(this.receiveData, 'receiveData')
    },
    handleClickParent(item, refsName) {
      this.start = item.start
      this.end = item.end
      const input = document.querySelector('.' + refsName).querySelector('input')
      if (item?.desensitizationTypeList[0] === 'CUSTOMER') {
        input.value = `自定义#${item.start}#${item.end}`
        item.desensitizationType = `CUSTOMER#${item.start}#${item.end}`
      } else {
        item.desensitizationType = item.desensitizationTypeList[0]
      }
    },
    deepChildren(children, status = true, parent = null) {
      console.log('deepChildren')
      for (let i = 0; i < children.length; i++) {
        const item = children[i];
        item.paramValueTypeList = []
        item.actionId1 = item.actionId
        item.isFilterList = JSON.parse(JSON.stringify(this.isFilterList))
        item.desensitizationTypeList = item.desensitizationType
        if (item.desensitizationType.includes('CUSTOMER')) {
          item.desensitizationTypeList = []
          let arr = item.desensitizationType.split('#')
          item.desensitizationTypeList[0] = arr[0]
          item.desensitizationTypeList[1] = arr[0]
          // item.desensitizationTypeList[2] = arr[2]
          item.start = arr[1]
          item.end = arr[2]
          this.$nextTick(() => {
            this.$nextTick(() => {
              this.handleClickParent(item, 'cascader' + item.paramId)
            })
          })
        }
        item.disabledDefault = true
        if (item.paramParentId && status) {
          item.disabled2 = true
        } else {
          item.disabled2 = false
        }
        if (parent?.paramMappingKey) {
          item.tree = parent.paramMappingKey
        }
        if (!item.paramMappingKey) {
          item.paramMappingKey = ''
        }
        item.paramValueTypeList[0] = item.paramValueType?.split('<')[0]
        if (item.paramValueType.includes('<')) {
          item.paramValueTypeList[1] = item.paramValueType.slice(5, item.paramValueType.length - 1)
        } 
        if (item.paramValueType.includes('[')) {
          item.paramValueTypeList[1] = item.paramValueType.split('[')
          item.paramValueTypeList[0] = 'Array'
        }
        if (item.children && item.children.length) {
          let temp = true
          if (item.actionName === '复合来源') {
            temp = false
          }
          this.deepChildren(item.children, temp, item)
        }
      }
      return
    },
    getchildTier(arr, childLength, type = "page") {
      // console.log("getchildTier",arr,childLength)
      arr.forEach((data) => {
        data.childTier = childLength + 1;
        // 如果是自定义添加
        data.typeList = this.typeList;
        // 在第五层时，要去除List/Object类型
        if (data.childTier == 5) {
          data.typeList = this.typeList.filter(
            (item) => item.type !== "List" && item.type !== "Object"
          );
        }
        if (type == "dialog" && this.tableLength < data.childTier) {
          this.tableLength = data.childTier;
        }
        if (data.children && data.children.length) {
          data.typeList = this.speciTypeList;
          this.getchildTier(data.children, data.childTier, type);
        }
      });
    },
    setLengthDisabled(e){
      if(["Boolean","Character","boolean","char"].includes(e.paramValueType) 
          && e.paramCustomFlg == "1"
        ){
          e.valueDisabled = true
          this.$set(e,"paramLength","1")
        }else if( ["Object","List"].includes(e.paramValueType) && e.paramCustomFlg == "1" ){
          e.valueDisabled = true
          this.$set(e,"paramLength","")
        }else {
          e.valueDisabled = false
          // this.$set(e,"paramLength","")
        }
    },
    handleCancel(e) {
      this.radioHeader = 0;
      this.addVisible = false;
      this.beforeDestroy();
      this.clearAll(this.dictList);
    },
    async getSourceList() {
      const params = {
        apiId: this.currentServObj.svcId,
        turnPageShowNum: 1000,
      };
      const res = await this.rpc.d4.getAssociatedSelfServiceList(params);
      let arr = res.apiInfoList.map((item) => {
        return { value: item.apiId, label: item.apiName };
      });
      this.sourceList.push(...arr);
      // return res.apiInfoList;
    },
    async initParams(data) {
      // this.sourceList = [
      //   {
      //     value: this.currentServObj.svcId,
      //     label: "当前4b交易",
      //   },
      // ];
      console.time("render耗时33");
      const transId = this.currentServObj.apiId
      // data.puApiParams.forEach(param => {
      //   if (param.paramDirection == 1) {
      //     param.apSource = param.apSource || "00"
      //     param.actionName = param.actionName || "当前4b交易"
      //     param.paramMappingKey = param.paramMappingKey || param.paramKey
      //     param.paraMapgNm = param.paraMapgNm || param.paramCName
      //     param.actionId = param.actionId || transId
      //   }
      // })
      this.sendData = reList(
        data.puApiParams?.filter((item) => item.paramDirection == 0)
      );
      console.log(this.sendData, "sendData2")

      // this.deepChildren(this.sendData)
      this.sendData.forEach((item) => {
        if (
          [
            "reqHeaderData",
            "commonData",
            "channelData",
            "securityData",
            "bodyData",
          ].includes(item.paramKey) &&
          !item.paramParentId &&
          item.paramValueType == "Object"
        ) {
          this.setDisabled(item);
        }
        if (item.paramKey == "bodyData" && item.children) {
          item.showChild = true;
          this.traversalData(item.children)
        }
      });
      this.receiveData = reList(
        data.puApiParams?.filter((item) => item.paramDirection == 1)
      );
      await this.getDessitizaList();
      this.deepChildren(this.receiveData)
      this.deepChildren(this.sendData)
      this.receiveData.forEach((item) => {
        if (
          ["resHeaderData", "bodyOutData"].includes(item.paramKey) &&
          !item.paramParentId &&
          item.paramValueType == "Object"
        ) {
          this.setDisabled(item);
        }
        if (item.paramKey == "bodyOutData" && item.children) {
          item.showChild = true;
          this.traversalData(item.children)
          this.setDisabled(item, "source");
        }
        if (["resHeaderData", "bodyOutData"].includes(item.paramKey)) {
          this.setDisabled(item, "source");
        }
      });
      // console.log("输出", this.receiveData, this.sendData);
      setParamOrder(this.sendData)
      setParamOrder(this.receiveData)
      this.setMapParamsList()
      this.servId = transId;
      this.sendData.forEach((item) =>{
        if(item.paramKey == "bodyData"){
          item.paramPosition = "0";
          item?.children?.length > 0 && this.setParamPosition(item.children,"body");
        } else {
          item.paramPosition = "1";
          item?.children?.length > 0 && this.setParamPosition(item.children,"header");
        }
      })
      this.receiveData.forEach((item) =>{
        if(item.paramKey == "bodyOutData") {
          item.paramPosition = "0";
          item?.children?.length > 0 && this.setParamPosition(item.children,"body");
        } else {
          item.paramPosition = "1";
          item?.children?.length > 0 && this.setParamPosition(item.children,"header");
        }
      })
      // zhouzhiyuan
      this.receiveData = JSON.parse(JSON.stringify(this.receiveData))
      this.sendData = JSON.parse(JSON.stringify(this.sendData))
      console.log(this.sendData, "sendData33")

      // this.setSourceOption(this.receiveData);
      // this.setSourceVal();
      // this.getSourceList();
      this.$nextTick(() => {
        console.timeEnd("render耗时33");
      });
    },
    setMapParamsList() {
      const dataList = this.currentServObj.flow.map(item => {
        item.actionType = item.type
        item.actionName = item.conf.find(e => e.name == "actionDesc")?.value
        item.actionOwnId = item.cpntId
        return item
      })
      console.log(dataList, "dataList")
      const { svcId: apiId, apiName, puApiParams} = this.currentServObj
      this.compositeIdMapToParamList = dataList.reduce((prev, data) => {
        if (sourceActionType.includes(data.actionType) && data.compositeId) {
          const compositeId = data.compositeId
          if (!this.compositeIdMapToParamList[compositeId]) {
            prev[compositeId] = {
              svcId: data.actionOwnId,
              svcNm: data.actionName,
              actionType: data.actionType,
              paramList: data.paramList,
            }
          } else {
            prev[compositeId] = this.compositeIdMapToParamList[compositeId]
          }
        }
        return prev
      }, {[apiId]: { svcNm: apiName, svcId: apiId, paramList: puApiParams}})
      // 设置来源一列的下拉选项
      this.sourceList = dataList.reduce((prev, data) => {
        if (sourceActionType.includes(data.actionType) && data.compositeId) {
          prev.push({
            label: data.actionName,
            // value: data.actionOwnId,
            svcId: data.actionOwnId,
            value: data.compositeId,
            actionSeq: data.conf.find(item => item.name == "actionSeq")?.value,
            actionType: data.actionType,
          })
        }
        return prev
      }, [{
        label: "当前4b交易",
        value: apiId,
        svcId: apiId,
      }])
      console.log(this.sourceList, this.compositeIdMapToParamList, "this.sourceList, this.compositeIdMapToParamList")
    },
    traversalData(data) {
      data.forEach(item => {
        // 循环遍历设置参数长度
        this.setLengthDisabled(item)
        if(item.children?.length) {
          this.traversalData(item.children)
        }
      })
    },
    // 循环遍历设置disabled属性
    setDisabled(data, type) {
      if (type == "source") {
        // data.sourceFlag = true;
        data.sourceFlag = false;
        if (data.children) {
          data.children.forEach((item) => {
            this.setDisabled(item, type);
          });
        }
      } else {
        data.disabled = true;
        data.disabledDefault = true
        if (data.paramKey == "bodyData" || data.paramKey == "bodyOutData") {
          return;
        } else if (data.children) {
          data.children.forEach((item) => {
            this.setDisabled(item, type);
          });
        }
      }
    },
    setSourceOption(data) {
      data.forEach((item) => {
        if (item.actionId == "" || item.actionName == "") {
          item.actionId = this.sourceList[0].value;
          item.actionName = this.sourceList[0].label;
          item.paramMappingKey = item.paramKey;
          item.paraMapgNm = item.paramCName;
        }
        if (item.children && item.children.length) {
          this.setSourceOption(item.children);
        }
      });
    },
    setSourceVal() {
      if (this.apSource == "00") {
        let tempData = this.sendData?.filter(
          (item) =>
            item.paramDirection == "0" &&
            !item.paramParentId &&
            item.paramKey == "bodyData"
        );
        // console.log("ces", tempData[0], tempData);
        tempData = !tempData[0].children ? [] : tempData[0].children;
        tempData = array2flat(tempData, "children");
        this.bodyData = tempData.map((item) => {
          return { type: item.paramCName, value: item.paramKey };
        });
        this.serviceIdMapToParamList[this.sourceList[0].value] = tempData;
      }
      this.refreshParams();
    },
    async updateCompositeIdMapToParamList(row) {
      const compositeId = row.actionId
      console.log("==---====",this.currentServObj)
      console.log("=====>",this.compositeIdMapToParamList)
      const item = this.compositeIdMapToParamList[compositeId]
      const apiId = item?.svcId
      if (compositeId && item && !(item?.paramList?.length)) {
        if (apiId && ["D4bAction", "D5SelfAction", "D5LinkAction"].includes(item.actionType)) {
          const res = await this.rpc.d4.queryL5ParamAndRuleDefinitions({
            d4StusCd: "1",
            blngtoTyp: "10",
            apiId: apiId,
            d4bApiId: this.currentServObj.apiId,
            bizDomainNo: this.currentServObj.beltLine,
          })
          item.paramList = res.paramList
        } else if (item.actionType == "loopAction") {
          const res = await this.rpc.d4.getServiceCpnParams({
            d4StusCd: "1",
            blngtoTyp: "11",
            compositeId: compositeId,
          })
          item.paramList = res.paramList
        } else if (["cacheSessionAction", "getSessionAction"].includes(item.actionType)) {
          // const res = await this.rpc.d4.querySessionParam({
          //   cstNo: this.$route.query.competitorId,
          //   bizDomainNo: this.currentServObj.beltLine,
          //   appId: this.currentServObj?.relySys || this.$route.query.appId,
          // });
          // item.paramList = res.paramList
          const res = await this.rpc.newEditor.querySessionParam({
            appId: this.projectId,
            paramCateg: "1"
          })
          item.paramList = mixList(res.pubDataList,"children").map((item) =>{
            item.paramCName = item.paramName
            item.paramKey = item.paramCode
            item.paramParentId = item.paramParentOrder
            return item
          })
        } else if (["uploadAction", "getCacheAction", "setCacheAction"].includes(item.actionType)) {
          const res = await this.rpc.d4.getServiceCpnParams({
            d4StusCd: "1",
            blngtoTyp: "11",
            compositeId: compositeId,
          });
          item.paramList = res.paramList
        }
      }
    },
    async getL5Params() {
      const param = {
        apiId: this.servId,
        currentPage: "1",
        turnPageShowNum: "10",
      };
      const res = await this.rpc.d4.getL5ServField(param);
      let data = array2flat(res.paramList, "sonParamList");
      // this.bodyData = JSON.parse(JSON.stringify(data));
      return data;
    },
    addObj(e) {
        // item.children = []
        // item.paramKey = item.fieldKeyName
        // item.paramCName = item.fieldName
        // item.isNeed = '0'
        // item.paramType = item.fieldType
        // item.paramValueType = item.fieldType
        // item.paramDesc = item.fieldBusiness
        // item.paramLength = item.fieldLength
        // item.paraMapgNm = ''
        // item.paramMappingKey = item.fieldKeyName
        // item.paramId = this.createId()
        // item.actionId = ''
        // item.actionName = ''
        // item.apSource = ''
        // item.isFilter = ''
        // item.paramEnum = ''
      if (!e.children) {
        e.children = [];
      }
      const prs = {
        children: [],
        paramType: 'Object',
        paramValueType: 'Object',
        paramValueTypeList: ['Object'],
        isNeed: '0',
        paramCName: '',
        paramKey: '',
        paramDesc: '',
        paramLength: '',
        paramEnum: '',
        paramId: this.createId(),
        actionId: '',
        actionName: '',
        apSource: '',
        isFilter: '',
        paramEnum: '',
        paramMappingKey: '',
        paraMapgNm: '',
        disabledDefault: false,
      }
      console.log(e.paramDirection, 'paramDirection')
      this.addChildParams(
        e.paramDirection === "1" ? this.receiveData : this.sendData,
        e,
        prs
      );
      if (e.paramDirection === "1") {
        this.refreshBodyData(this.receiveData);
        this.expendChild(this.receiveData, "bodyOutData");
      } else {
        this.refreshBodyData(this.sendData);
        this.expendChild(this.sendData, "bodyData");
      }
      setParamOrder(this.sendData)
      setParamOrder(this.receiveData)
      // this.deepChildren(this.receiveData)
      // this.deepChildren(this.sendData)
      this.receiveData = JSON.parse(JSON.stringify(this.receiveData))
      this.sendData = JSON.parse(JSON.stringify(this.sendData))
    },
    addList(e) {
        // item.children = []
        // item.paramKey = item.fieldKeyName
        // item.paramCName = item.fieldName
        // item.isNeed = '0'
        // item.paramType = item.fieldType
        // item.paramValueType = item.fieldType
        // item.paramDesc = item.fieldBusiness
        // item.paramLength = item.fieldLength
        // item.paraMapgNm = ''
        // item.paramMappingKey = item.fieldKeyName
        // item.paramId = this.createId()
        // item.actionId = ''
        // item.actionName = ''
        // item.apSource = ''
        // item.isFilter = ''
        // item.paramEnum = ''
      if (!e.children) {
        e.children = [];
      }
      const prs = {
        children: [],
        paramType: 'List',
        paramValueType: 'List',
        paramValueTypeList: ['List'],
        isNeed: '0',
        paramCName: '',
        paramKey: '',
        paramDesc: '',
        paramLength: '',
        paramEnum: '',
        paramId: this.createId(),
        actionId: '',
        actionName: '',
        apSource: '',
        isFilter: '',
        paramEnum: '',
        paramMappingKey: '',
        paraMapgNm: '',
        disabledDefault: false,
      }
      console.log(e.paramDirection)
      this.addChildParams(
        e.paramDirection === "1" ? this.receiveData : this.sendData,
        e,
        prs
      );
      if (e.paramDirection === "1") {
        this.refreshBodyData(this.receiveData);
        this.expendChild(this.receiveData, "bodyOutData");
      } else {
        this.refreshBodyData(this.sendData);
        this.expendChild(this.sendData, "bodyData");
      }
      setParamOrder(this.sendData)
      setParamOrder(this.receiveData)
      // this.deepChildren(this.receiveData)
      // this.deepChildren(this.sendData)
      this.receiveData = JSON.parse(JSON.stringify(this.receiveData))
      this.sendData = JSON.parse(JSON.stringify(this.sendData))
    },
    //大数据的添加
    addBdata(e) {
      this.operate("add", e);
    },
    //大数据的删除
    delBdata(e) {
      this.operate("del", e);
      // if (e.paramDirection == 0) {
      //   this.clearParam(this.receiveData, e);
      // }
    },
    addByDic(e) {
      this.operate("dicAdd", e);
    },
    // 遍历清空来源值选择的已删除的数据
    clearParam(data, e) {
      // console.log("clearParam",data, e)
      data.forEach((item) => {
        if (
          item.actionId == this.sourceList[0].value &&
          item.paramMappingKey == e.paramKey
        ) {
          this.$set(item, "paraMapgNm", "");
        }
        if (item.children) {
          this.clearParam(item.children, e);
        }
      });
    },
    addBodyData(type, e) {
      if (type == "s") {
        // 输入
        const data = this.sendData.filter((item) => {
          return (
            item.paramDirection == "0" &&
            !item.paramParentId &&
            item.paramKey == "bodyData"
          );
        });
        if (e == "1") {
          // 自定义
          // this.addChildParams(this.sendData, ...data, {}, true);
          // this.expendChild(this.sendData, "bodyData");
          // this.refreshParams();
          this.isData = data[0];
          // this.$refs.aopBusinessDatadict.
          this.$refs.aopBusinessDatadict.openDatadict({
            fieldSource: 'develop'
          })
          // this.showParams("userDefined");
        } else {
          // 弹窗选
          this.isData = data[0];
          this.showParams("s", "0");
        }
        console.log("====>",this.isData,data,this.sendData)
      } else {
        // 输出
        const data = this.receiveData.filter((item) => {
          return (
            item.paramDirection == "1" &&
            !item.paramParentId &&
            item.paramKey == "bodyOutData"
          );
        });
        if (e == "1") {
          // 自定义
          // this.addChildParams(this.receiveData, ...data, {}, true);
          // this.expendChild(this.receiveData, "bodyOutData");
          // this.refreshParams();
          this.isData = data[0];
          // this.showParams("userDefined");
          this.$refs.aopBusinessDatadict.openDatadict({
            fieldSource: 'develop'
          })
        } else {
          // 弹窗选
          this.isData = data[0];
          this.showParams("r", "1");
        }
      }
    },
    //BODY列表参数操作
    operate(operation, data) {
      console.log(data);
      if (data.paramDirection == "0") {
        if (operation == "add") {
          this.isData = data;
          // this.showParams("userDefined");
          this.$refs.aopBusinessDatadict.openDatadict({
            fieldSource: 'develop'
          })
          // this.addChildParams(this.sendData, data, {}, true);
          // this.refreshParams();
          // this.expendChild(this.sendData, "bodyData");
        } else if (operation == "dicAdd") {
          this.isData = data;
          this.showParams("addChild", data.paramDirection);
        } else {
          this.delParams(this.sendData, data.paramOrder);
        }
      } else {
        if (operation == "add") {
          this.isData = data;
          // this.showParams("userDefined");
          this.$refs.aopBusinessDatadict.openDatadict({
            fieldSource: 'develop'
          })
          // this.addChildParams(this.receiveData, data, {}, true);
          // this.refreshParams();
          // this.expendChild(this.receiveData, "bodyOutData");
        } else if (operation == "dicAdd") {
          this.isData = data;
          this.showParams("addChild", data.paramDirection);
        } else {
          this.delParams(this.receiveData, data.paramOrder);
        }
      }
      // this.setSourceVal();
    },
    //大数据头部的添加
    addHdata(e) {
      this.httpOperate("add", e);
    },
    //大数据头部的删除
    delHdata(e) {
      this.httpOperate("del", e);
    },
    //大数据头部从数字字典添加
    addHByDic(e) {
      this.httpOperate("dicAdd", e);
    },
    //http头处理
    httpOperate(operation, data) {
      if (data.paramDirection == "0") {
        if (operation == "add") {
          this.addChildParams(this.httpData, data);
        } else if (operation == "dicAdd") {
          this.isData = data;
          this.showParams("addChild");
        } else {
          this.delParams(this.httpData, data.paramOrder);
        }
      }
    },
    paramKeyBlur(e) {
      let reg = /^[A-Za-z]+$/;
      if (!reg.test(e.paramKey)) {
        return this.$message.error("参数Key只能输入英文");
      }
      if (
        e.paramKey &&
        (e.paramValueType == "List" || e.paramValueType == "Object")
      ) {
        if (this.javaKeyWord.includes(e.paramKey)) {
          return this.$message.error("参数Key不能使用JAVA中的关键字");
        }
      }
    },

    //参数操作
    /** 添加第一级报文参数
     * @param {Array} arrs 原数组
     * @param {String} pos 数组位置
     * @param {String} direct 数组方向
     * @param {Object} prs 赋值后的数据,字典需用
     */
    addParams(arrs, pos, direct, prs = {}) {
      const order =
        arrs.length > 0
          ? arrs[arrs.length - 1].paramOrder.indexOf(".") !== -1
            ? arrs[arrs.length - 1].split(".")[0] * 1 + 1
            : arrs[arrs.length - 1].paramOrder * 1 + 1
          : 1;
      let data = {
        paramOrder: order.toString(),
        paramPosition: pos,
        paramDirection: direct,
        isNeed: "0", // 0过滤，1不过虑
        paramParentId: "",
        action: "0",
        paramKey: prs.paramKey,
        paramCName: prs.paramCName,
        paramLength: prs.paramLength,
        paramValueType: prs.paramValueType,
        paramDesc: prs.paramDesc,
        standFlg: prs.standFlg,
        standType: prs.standType,
        paramId: prs.paramId,
        actionId: this.sourceList[0].value,
        actionName: this.sourceList[0].label,
        // children: prs.children.length ? prs.children : [],
      };
      if (prs.children && prs.children.length > 0) {
        prs.children.map((item) => {
          const prs = {
            paramKey: item.paramKey,
            paramCName: item.paramCName,
            paramLength: item.paramLength,
            paramValueType: item.paramValueType,
            paramDesc: item.paramDesc,
            paramId: item.paramId,
            children: item.children,
            actionId: this.sourceList[0].value,
            actionName: this.sourceList[0].label,
            standFlg: this.radioHeader == "0" ? "10" : "00",
            standType: this.radioHeader == "0" ? "10" : "00",
          };
          this.addChildParams({}, data, prs);
        });
      }
      arrs.push(data);
    },
    // 删除报文参数
    delParams(arrs, id) {
      let i = 0;
      while (arrs[i]) {
        if (arrs[i].paramOrder == id) {
          arrs.splice(i, 1);
          // let d = 0;
          // if (id.indexOf(".") != -1) {
          //   d = id.substring(0, id.length - 1);
          // }
          // for (let i = 0; i < arrs.length; i++) {
          //   arrs[i].paramOrder = d + (i + 1) + "";
          // }
          return;
        }
        if (arrs[i].children && arrs[i].children.length > 0) {
          this.delParams(arrs[i].children, id);
        }
        i++;
      }
      setParamOrder(this.sendData)
      setParamOrder(this.receiveData)
      // this.$emit("delF","delF");
    },
    /** 添加子级报文参数
     * @param {Array} arrs 原数组
     * @param {Object} item 父级
     * @param {Object} prs 赋值后的数据,字典需用
     */
    addChildParams(arrs, item = {}, prs = {}, emptyFlag = false) {
      const order =
        item.children && item.children.length > 0
          ? item.paramOrder + "." + (item.children.length + 1)
          : item.paramOrder + "." + 1;
      const data = {
        paramOrder: order,
        paramValue: "",
        paramPosition: item.paramPosition,
        paramDirection: item.paramDirection,
        isNeed: emptyFlag ? "0" : prs.isNeed, // 0过滤，1不过虑
        paramParentId: item.paramOrder,
        action: "0",
        paramKey: prs.paramKey || "",
        paramCName: prs.paramCName || "",
        paramLength: prs.paramLength,
        paramType: prs.paramType,
        paramValueType: prs.paramValueType,
        paramValueTypeList: prs.paramValueTypeList,
        paramDesc: prs.paramDesc,
        standFlg: prs.standFlg,
        standType: prs.standType,
        paramId: prs.paramId || this.createId(),
        actionId: prs.actionId,
        actionName: prs.actionName,
        apSource: prs.apSource,
        paraMapgNm: prs.paraMapgNm,
        paramMappingKey: prs.paramMappingKey,
        sourceValList: this.bodyData,
        paramCustomFlg: emptyFlag ? "1" : "0", //字段自定义标志（1是0否）
        // sourceFlag: true,
        desensitizationType:"0",
        apEnum: prs.paramEnum,
        disabledDefault: prs.disabledDefault,
      };
      if (prs.children && prs.children.length > 0) {
        prs.children.map((iitem) => {
          const prs = {
            paramKey: iitem.paramKey || "",
            paramCName: iitem.paramCName,
            paramLength: iitem.paramLength,
            paramType: iitem.paramType,
            paramValueType: iitem.paramValueType,
            paramValueTypeList: iitem.paramValueTypeList,
            paramDesc: iitem.paramDesc,
            children: iitem.children,
            standFlg: this.radioHeader == "0" ? "10" : "00",
            standType: this.radioHeader == "0" ? "10" : "00",
            paramId: iitem.paramId,
            actionId: iitem.actionId,
            actionName: iitem.actionName,
            apSource: iitem.apSource,
            paraMapgNm: iitem.paraMapgNm,
            paramMappingKey: iitem.paramMappingKey,
            isNeed: emptyFlag ? "0" : item.isNeed,
            desensitizationType:"0",
            apEnum: iitem.paramEnum,
            disabledDefault: item.disabledDefault,
          };
          this.addChildParams({}, data, prs, emptyFlag);
        });
      }
      const mixData = JSON.parse(JSON.stringify(data));
      item.children = item.children || [];
      item.children.push(mixData);
      if (!!mixData.paramKey) {
        // item.children = unduplicated(item.children, ["paramKey"]);
        item.children = this.unduplicated(item.children);
      }
      // console.log(data, "addChildParams", data.paramCName, emptyFlag);
    },
    unduplicated(arrs, key = "paramKey") {
      if (!arrs?.length) return []
      const keys = []
      const result = arrs.reduce((prev, item) => {
        if (!keys.includes(item[key])) {
          keys.push(item[key])
          prev.push(item)
        } else {
          if (["List", "Object"].includes(item.paramType)) {
            let target = prev.find(param => param.paramKey == item[key])
            target.children = item.children
          }
        }
        return prev
      }, [])
      console.log("result", result)
      return result
    },
    refreshParams() {
      this.httpData = JSON.parse(JSON.stringify(this.httpData || []));
      this.receiveData = JSON.parse(JSON.stringify(this.receiveData));
      this.sendData = JSON.parse(JSON.stringify(this.sendData));
      console.log(this.sendData, "sendData4444")

      this.$forceUpdate();
    },
    //参数列表操作
    // 添加输入输出按钮点击
    showParams(e, paramDirection) {
      if(e == "userDefined") {
        this.$refs.userDefinedRef.showDialog(e)
      }else {
        console.log('222222222')
        this.$refs.dicRef.showDialog(e, paramDirection);
      }
    },
    setDisableDefault(tableData) {
      tableData.forEach((item) => {
        item.disabledDefault = true;
        if (item.children && item.children.length > 0) {
          this.setDisableDefault(item.children);
        }
      })
    },
    changeTableData(tableData) {
      tableData.forEach((item) => {
          // paramKey: item.paramKey,
          // paramCName: item.paramCName,
          // paramLength: item.paramLength,
          // paramType: item.paramType,
          // paramValueType: item.paramValueType,
          // paramDesc: item.paramDesc,
          // isNeed: item.isNeed,
          // paramId: this.createId(),
          // actionId: item.actionId,
          // actionName: item.actionName,
          // apSource: item.apSource,
          // paraMapgNm: item.paraMapgNm,
          // paramMappingKey: item.paramMappingKey,
          // paramEnum: item.paramEnum,
          // // actionId: this.sourceList[0].value,
          // // actionName: this.sourceList[0].label,
          // // dataSetDataId: item.dataSetDataId,
          // children: item.children.length ? item.children : [],
          // // standFlg: this.radioHeader == "0" ? "10" : "00",
          // // standType: this.radioHeader == "0" ? "10" : "00",
          // isFilter:""
        // item.
        item.children = []
        item.paramKey = item.fieldKeyName
        item.paramCName = item.fieldName
        item.isNeed = '0'
        item.paramType = item.fieldType
        item.paramValueType = item.fieldType
        item.paramDesc = item.fieldBusiness
        item.paramLength = item.fieldLength
        item.paramMappingKey = item.fieldKeyName
        item.paramId = this.createId()
        item.actionId = ''
        item.actionName = ''
        item.apSource = ''
        item.isFilter = ''
        item.paramEnum = ''
        item.paraMapgNm = ''
        item.disabledDefault = true
        item.dataDictionaryEnumLists.forEach((data, index) => {
          let str = data.enumKey + ':' + data.enumValue
          if (index < item.dataDictionaryEnumLists.length - 1) {
            str += ';'
          }
          item.paramEnum += str
        })
      })
    },
    //确认选择参数
    async saveParamsDataset(sendObj,addType=false) {
      console.log("tableData",tableData,this.isData)
      let tableData = sendObj.data || sendObj
      if (sendObj.data) {
        this.changeTableData(tableData)
      }
      this.setDisableDefault(tableData)
      this.tableLength = 0;
      this.getchildTier(JSON.parse(JSON.stringify(tableData)), 0, "dialog");
      if (this.tableLength > 6) {
        return this.$message.error(
          `最多只能添加5层参数，当前在${this.isData.childTier}层`
        );
      }
      this.formInline = this.$refs.dicRef.formInline;
      // const data = this.filterChild(JSON.parse(JSON.stringify(tableData)));
      const sendDataTemp = JSON.parse(
        JSON.stringify(mixList(this.sendData, "sonParamList"))
      );
      const receiveDataTemp = JSON.parse(
        JSON.stringify(mixList(this.receiveData, "sonParamList"))
      );
      let paramsF = false;
      //输入参数判断 s 输入   r 输出
      if (this.formInline.type == "s") {
        tableData.map((item) => {
          sendDataTemp.map((m) => {
            if (item.paramKey == m.paramKey) {
              paramsF = true;
            }
          });
        });
      } else if (this.formInline.type == "r") {
        tableData.map((item) => {
          receiveDataTemp.map((m) => {
            if (item.paramKey == m.paramKey) {
              paramsF = true;
            }
          });
        });
      }
      if (paramsF) {
        return this.$message.error("参数已存在");
      }
      // 点击操作栏的添加按钮-从弹窗选
      tableData.map((item) => {
        const prs = {
          paramKey: item.paramKey,
          paramCName: item.paramCName,
          paramLength: item.paramLength,
          paramType: item.paramType,
          paramValueType: item.paramValueType,
          paramDesc: item.paramDesc,
          isNeed: item.isNeed,
          paramId: this.createId(),
          actionId: item.actionId,
          actionName: item.actionName,
          apSource: item.apSource,
          paraMapgNm: item.paraMapgNm,
          paramMappingKey: item.paramMappingKey,
          paramEnum: item.paramEnum,
          // actionId: this.sourceList[0].value,
          // actionName: this.sourceList[0].label,
          // dataSetDataId: item.dataSetDataId,
          children: item.children.length ? item.children : [],
          disabledDefault: true,
          // standFlg: this.radioHeader == "0" ? "10" : "00",
          // standType: this.radioHeader == "0" ? "10" : "00",
          isFilter:""
        };
        this.addChildParams(
          this.isData.paramDirection === "1" ? this.receiveData : this.sendData,
          this.isData,
          prs,
          addType
        );
        if (this.isData.paramDirection === "1") {
          this.refreshBodyData(this.receiveData);
          this.expendChild(this.receiveData, "bodyOutData");
        } else {
          this.refreshBodyData(this.sendData);
          this.expendChild(this.sendData, "bodyData");
        }
      });
      setParamOrder(this.sendData)
      setParamOrder(this.receiveData)
      this.deepChildren(this.receiveData)
      this.deepChildren(this.sendData)
      this.receiveData = JSON.parse(JSON.stringify(this.receiveData))
      this.sendData = JSON.parse(JSON.stringify(this.sendData))
      console.log(this.sendData, "sendData1")
      // this.setSourceVal();
      this.refreshParams();
      this.$refs.dicRef.handleCancel();
    },
    refreshBodyData(data) {
      data.forEach((item) => {
        if (
          item.paramKey == this.isData.paramKey &&
          item.paramOrder == this.isData.paramOrder &&
          item.paramCName == this.isData.paramCName
        ) {
          item.children = JSON.parse(JSON.stringify(this.isData.children));
          // console.log("相同了", item, this.isData);
        } else if (item.children) {
          this.refreshBodyData(item.children);
        }
      });
    },
    // 选择来源参数
    saveSourceParams(data) {
      let arr = data instanceof Array ? data[0] : data;
      console.log(
        "saveSourceParams",
        arr.paramType,
        this.currentParams.paramType
      );
      if (!arr) {
        return this.$message.error("请选择参数");
      }
      if (arr.paramType != this.currentParams.paramType) {
        return this.$message.error("类型不匹配，请重新选择");
      }
      this.sourceVal = arr;
      this.$refs.chooseValRef.handleCancel();
    },

    createId() {
      let paramId = "";
      const paramIdLength = 6;
      const random = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        0,
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ];
      for (let i = 0; i < paramIdLength; i++) {
        let indexId = Math.floor(Math.random() * 26);
        paramId += random[indexId];
      }
      return paramId;
    },
    // 去除没有被选中的子参数
    filterChild(arr) {
      let data = arr.filter((item, index) => {
        if (item.isPush) {
          if (item.children?.length) {
            item.children = item.children.filter((ii) => {
              return ii.isPush;
            });
          }
        }
        if (item.children && item.children.length) {
          this.filterChild(item.children);
        }
        return item.isPush;
      });
      return data;
    },
    // 选择参数
    chooseVal(e) {
      this.currentParams = e;
      this.$refs.chooseValRef.showDialog();
    },
    async setInitData(data) {
      console.log(
        "setInitData",
        data,
        data.actionId,
        this.serviceIdMapToParamList
      );
      if (data.actionId == this.sourceList[0].value) {
        this.apSource = "00";
      } else {
        this.apSource = "20";
      }
      this.servId = data.actionId;
      if (data.actionId in this.serviceIdMapToParamList) {
        let bodyData = this.serviceIdMapToParamList[data.actionId].map(
          (param) => {
            param.type = param.paramCName;
            param.value = param.paramKey;
            return param;
          }
        );
        this.$set(data, "sourceValList", bodyData);
      } else if (data.actionId == this.sourceList[0].value) {
        this.$set(data, "sourceValList", this.bodyData);
      } else {
        const arr = await this.getL5Params();
        this.serviceIdMapToParamList[data.actionId] = arr;
        let tempData = this.serviceIdMapToParamList[data.actionId].map(
          (param) => {
            param.type = param.paramCName;
            param.value = param.paramKey;
            return param;
          }
        );
        this.$set(data, "sourceValList", tempData);
      }
    },
    focusChange(e) {
      this.setInitData(e);
    },
    sourceChange(e, data) {
      this.setInitData(data);
    },
    expendChild(data, type) {
      data.forEach((item) => {
        if (item.paramKey == type && item.children) {
          item.showChild = true;
        }
      });
    },
    async getDessitizaList(){
      const res = await this.rpc.d4.getDessitizaList();
      let tempArr = {value:"0",type:"无", label: '无', text: '无'}
      this.isFilterList.length = 0;
      if(res.desensitizationTypeList && res.desensitizationTypeList.length >0){
        res.desensitizationTypeList.map((item, index) =>{
          let obj = {
            start: '',
            end: '',
            key: index,
            value:item.desensitizationType,
            label:item.desensitizationName,
            text:item.desensitizationName,
          }
          this.isFilterList.push(obj)
          if (obj.value === 'CUSTOMER') {
            obj.children = [
              {
                key: 100,
                start: '',
                end: '',
                key: index,
                type: 'input',
                value: 'CUSTOMER',
                label: '#',
                parent: 'CUSTOMER'
              }
            ]
          }
        })
        // this.isFilterList.push({
        //     value: '555自定义',
        //     label: '3333自定义3333',
        //     text: '自定义',
        //     start: '',
        //     end: '',
        //     children: [{
        //       type: 'input',
        //       start: '',
        //       end: '',
        //       value: '#',
        //       labe: '#',
        //     }]
        // })
        this.isFilterList.unshift(tempArr)
      }else{
        this.isFilterList = [...tempArr]
      }

      console.log(this.isFilterList, "this.isFilterList")
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
      }, [{ value: "", type: "无"}])
    },
    setParamPosition(data,type) {
      data.forEach((item) => {
        item.paramPosition = type == "body" ? "0" : "1";
        if(item?.children?.length > 0){
          this.setParamPosition(item.children,type)
        }
      })
    }
  },
  created() {
    this.projectId = this.$route.query.projectId
    // this.init()
  },
  filters: {
    ...filters,
  },
  provide() {
    return {
      updateCompositeIdMapToParamList: this.updateCompositeIdMapToParamList,
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_apimgmt_api_mod_params {
  .params_wrapper {
    // padding: 20px 30px;
    .input_wrapper,
    .output_wrapper {
      .top_right_create {
        text-align: right;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        .user_define {
          background: $base_white;
          color: $theme_color;
          border: 0.5px solid $theme_color;
        }
        ::v-deep .el-button {
          @include large_button_common;
          height: 36px;
        }
      }
      .table_style {
        margin-top: 16px;
      }
      .data_wrapper {
        margin-top: 16px;
        margin-left: -74px;
      }
    }
    ::v-deep .create_form {
      .el-form-item__label {
        color: $reg_ft_color;
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
      }
    }
  }
  .create_form_info {
    background: $base_white;
    margin-bottom: 16px;
    padding: 20px;
    margin-bottom: 16px;
  }
  .el_tag {
    margin-top: 4px;
  }
}
</style>
