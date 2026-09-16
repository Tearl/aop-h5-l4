<template>
  <div class="aop_workgate_comps_apimgmt_api_mod_params">
    <div class="params_wrapper">
      <el-form
        :model="formData"
        class="create_form"
        ref="formData"
        label-width="90px"
      >
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
                  paramsType="input"
                  @add="addBdata"
                  @del="delBdata"
                  @addByDic="addByDic"
                  @paramKeyBlur="paramKeyBlur"
                  @setLengthDisabled="setLengthDisabled"
                  @inputClick="inputClick"
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
                  paramsType="output"
                  pageType="paramsSet"
                  :serviceIdMapToParamList="serviceIdMapToParamList"
                  :compositeIdMapToParamList="compositeIdMapToParamList"
                  :detailInfo="currentServObj"
                  :isFilterList="isFilterList"
                  @add="addBdata"
                  @del="delBdata"
                  @addByDic="addByDic"
                  @sourceChange="sourceChange"
                  @focusChange="focusChange"
                  @paramKeyBlur="paramKeyBlur"
                  @setLengthDisabled="setLengthDisabled"
                  @inputClick="inputClick"
                  @updateCompositeIdMapToParamList="
                    updateCompositeIdMapToParamList
                  "
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
    <UserDefinedParams
      ref="userDefinedRef"
      :detailInfo="currentServObj"
      :getApiBizType="getApiBizType"
      @saveParams="saveParamsDataset"
    ></UserDefinedParams>
    <!-- 拟态的下拉选择框 -->
    <SimulantSelect ref="simulantSelectRef" :currentServObj="currentServObj">
    </SimulantSelect>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import { unduplicated, array2flat } from "@m/utils/array";
import PageBigData from "@m/core/components/download_design/page_big_data/transIndex";
import AddDicParams from "./components/add_dialog/addParams";
import SimulantSelect from "@m/core/components/process/attr/components/output/components/simulantSelect"
import { reList, mixList, packageParamKey, getParamParent, setParamOrder } from "@m/utils/paramTree";
import UserDefinedParams from "@m/core/components/download_design/page_big_data/addUserDefined";
import { sourceActionType, actionTypeToApSource } from "@m/utils/normalData";

export default {
  mixins: [mixin],
  components: {
    PageBigData,
    AddDicParams,
    SimulantSelect,
    UserDefinedParams,
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
  inject: ["getDataList"],
  data() {
    return {
      detailInfo: {}, //存储当前交易信息
      servNm: "",
      isHandleParamType: "",
      // 当前数据
      isData: {},
      sendData: [], // 请求报文
      receiveData: [], // 响应报文
      formData: {},
      // 表单数据
      // formData: {
      //   dictryNo: "", // 参数名称
      //   dictryNm: "", // 参数中文名称
      //   dictryKeyWord: "", // 关键字
      //   dictryEnglishFullName: "", // 英文名字全称
      //   dictryDescr: "", // 参数描述
      //   dictryGateg: "", // 所属分类
      //   dictryTyp: "String", // 参数类型
      //   dictryLength: "", // 最大长度
      // },
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
        { type: "List", value: "List" },
        { type: "Object", value: "Object" },
      ],
      typeList: [
        { type: "String", value: "String" },
        { type: "File", value: "File" },
        { type: "List", value: "List" },
        { type: "boolean", value: "boolean" },
        { type: "char", value: "char" },
        { type: "int", value: "int" },
        { type: "byte", value: "byte" },
        { type: "short", value: "short" },
        { type: "long", value: "long" },
        { type: "float", value: "float" },
        { type: "double", value: "double" },
        { type: "Boolean", value: "Boolean" },
        { type: "Character", value: "Character" },
        { type: "Integer", value: "Integer" },
        { type: "Byte", value: "Byte" },
        { type: "Short", value: "Short" },
        { type: "Long", value: "Long" },
        { type: "Float", value: "Float" },
        { type: "Double", value: "Double" },
        { type: "BigDecimal", value: "BigDecimal" },
        { type: "Object", value: "Object" },
        { type: "Date", value: "Date" },
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
      serviceIdMapToParamList: {},
      paramsData: [],
      compositeIdMapToParamList: {},
      hasInit: false,
      appId: "",
      isFilterList:[],
      projectId: ""
    };
  },
  watch: {
    sendData(val) {
      // console.log("sendData");
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
  provide() {
    return {
      updateCompositeIdMapToParamList: this.updateCompositeIdMapToParamList,
    };
  },
  methods: {
    // 更新map当前4b的参数
    upDateMap() {
      let sendData = array2flat(this.sendData, "children");
      let receiveData = array2flat(this.receiveData, "children");
      let data = [...sendData, ...receiveData];
      this.paramsData = data;
    },
    inputClick(scope, e, type) {
      if (!scope.actionId) {
        scope.actionId = this.currentServObj.apiId;
      }
      let scoped = {
        row: scope,
        column: {
          label: type == "actionId" ? "来源" : "来源值",
          property: type == "actionId" ? "actionId" : "paraMapgNm",
        },
      };
      // if (scope.row.paramParentId != this.bodyOutData?.paramOrder) return
      e.preventDefault();
      this.upDateMap();
      this.$refs.simulantSelectRef.init(
        scoped,
        e,
        "paramsSet",
        this.paramsData
      );
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
    initParams(data) {
      // this.detailInfo = JSON.parse(JSON.stringify(data))
      // this.sourceList = [
      //   {
      //     value: this.currentServObj.svcId,
      //     label: "当前4b交易",
      //   },
      // ];
      console.time("render耗时");
      // const transId = this.currentServObj.apiId
      // data.puApiParams.forEach(param => {
      //   if (param.paramDirection == 1) {
      //     param.apSource = param.apSource || "00"
      //     param.actionName = param.actionName || "当前4b交易"
      //     param.paramMappingKey = param.paramMappingKey || param.paramKey
      //     param.paraMapgNm = param.paraMapgNm || param.paramCName
      //     param.actionId = param.actionId || transId
      //   }
      // })
      data.puApiParams.forEach((item, index, paramList) => {
        const paramParent = getParamParent(item, paramList)
        const isHeaderData = ["resHeaderData"].includes(paramParent?.paramKey) || (item.paramKey == "bodyOutData" && !item.paramParentId)
        if (isHeaderData && item.paramDirection == "1" && !item.actionId && !item.actionName && !item.apSource) {
          item.actionId = "system"
          item.actionName = "平台系统"
          item.apSource = "01"
          item.paraMapgNm = item.paramCName
          item.paramMappingKey = packageParamKey(item, data.puApiParams)
        }
        if (item.apSource == "01") {
          item.actionId = "system"
        } else if (item.apSource == "10") {
          item.actionId = "constantValue"
        }
      })
      this.sendData = reList(
        data.puApiParams.filter((item) => item.paramDirection == 0)
      );

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
          this.traversalData(item.children);
        }
      });
      this.receiveData = reList(
        data.puApiParams.filter((item) => item.paramDirection == 1)
      );
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
          this.traversalData(item.children);
        }
      });
      // console.log("输出", this.receiveData, this.sendData);
      setParamOrder(this.sendData)
      setParamOrder(this.receiveData)
      this.setMapParamsList()
      this.servId = this.currentServObj.apiId;
      // this.setSourceOption(this.receiveData);
      // this.setSourceVal();
      // this.getSourceList();
      this.$nextTick(() => {
        console.timeEnd("render耗时");
      });
    },
    setMapParamsList() {
      const dataList = this.getDataList()
      const { apiId, apiName, puApiParams} = this.currentServObj
      this.compositeIdMapToParamList = dataList.reduce((prev, data) => {
        if (sourceActionType.includes(data.actionType) && data.compositeId) {
          const compositeId = data.compositeId
          if (!this.compositeIdMapToParamList[compositeId]) {
            prev[compositeId] = {
              svcId: data.actionOwnId,
              svcNm: data.actionName,
              actionType: data.actionType,
              paramList: [],
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
      }, [])
    },
    async updateCompositeIdMapToParamList(row) {
      const compositeId = row.actionId
      const item = this.compositeIdMapToParamList[compositeId]
      const apiId = item?.svcId
      if (compositeId && item && !(item?.paramList?.length)) {
        if (apiId && ["D4bAction", "D5SelfAction", "D5LinkAction"].includes(item.actionType)) {
          const res = await this.rpc.d4.queryL5ParamAndRuleDefinitions({
            d4StusCd: "1",
            blngtoTyp: "10",
            apiId: apiId,
            d4bApiId: this.currentServObj.apiId,
            bizDomainNo: this.currentServObj.bizLineId,
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
          //   cstNo: this.currentServObj.competitorId,
          //   bizDomainNo: this.currentServObj.bizLineId,
          //   appId: this.currentServObj.relySys || this.appId,
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
    traversalData(data) {
      data.forEach((item) => {
        // 循环遍历设置参数长度
        this.setLengthDisabled(item);
        if (item.children?.length) {
          this.traversalData(item.children);
        }
      });
    },
    // 循环遍历设置disabled属性
    setDisabled(data, type) {
      if (type == "source") {
        data.sourceFlag = true;
        if (data.children) {
          data.children.forEach((item) => {
            this.setDisabled(item, type);
          });
        }
      } else {
        data.disabled = true;
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
        if (item.actionName == "当前4b交易") {
          item.actionId = this.currentServObj.apiId;
          item.actionName = "当前4b交易";
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
        let tempData = this.sendData.filter(
          (item) =>
            item.paramPosition == "0" &&
            !item.paramParentId &&
            item.paramKey == "bodyData"
        );
        // console.log("ces", tempData[0], tempData);
        tempData = !tempData[0].children ? [] : tempData[0].children;
        tempData = array2flat(tempData, "children");
        this.bodyData = tempData.map((item) => {
          return { type: item.paramCName, value: item.paramKey };
        });
        this.serviceIdMapToParamList[this.currentServObj.apiId] = tempData;
      }
      this.refreshParams();
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
    //大数据的添加
    addBdata(e) {
      this.operate("add", e);
    },
    //大数据的删除
    delBdata(e) {
      this.operate("del", e);
      if (e.paramDirection == 0) {
        this.clearParam(this.receiveData, e);
      }
    },
    addByDic(e) {
      this.operate("dicAdd", e);
    },
    // 遍历清空来源值选择的已删除的数据
    clearParam(data, e) {
      // console.log("clearParam",data, e)
      data.forEach((item) => {
        if (
          item.actionId == this.currentServObj.apiId &&
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
      console.log("addBodyData", type, e)
      if (type == "s") {
        // 输入
        const data = this.sendData.filter((item) => {
          return (
            item.paramPosition == "0" &&
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
          this.showParams("userDefined");
        } else {
          // 弹窗选
          this.isData = data[0];
          this.showParams("s", "0");
        }
      } else {
        // 输出
        const data = this.receiveData.filter((item) => {
          return (
            item.paramPosition == "0" &&
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
          this.showParams("userDefined");
        } else {
          // 弹窗选
          this.isData = data[0];
          this.showParams("r", "1");
        }
      }
    },
    //BODY列表参数操作
    operate(operation, data) {
      console.log("operate", operation, data);
      if (data.paramDirection == "0") {
        if (operation == "add") {
          this.isData = data;
          this.showParams("userDefined");
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
          this.showParams("userDefined");
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
        // actionId: this.currentServObj.apiId,
        // actionName: "当前4b交易",
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
            // actionId: this.currentServObj.apiId,
            // actionName: "当前4b交易",
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
        isFilter:emptyFlag ? "0" : item.isFilter,
        desensitizationType:"0",
      };
      if (prs.children && prs.children.length > 0) {
        prs.children.map((iitem) => {
          const prs = {
            paramKey: iitem.paramKey || "",
            paramCName: iitem.paramCName,
            paramLength: iitem.paramLength,
            paramType: iitem.paramType,
            paramValueType: iitem.paramValueType,
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
            isFilter:emptyFlag ? "0" : iitem.isFilter,
            desensitizationType:"0",
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
      return arrs.reduce((prev, item) => {
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
    },
    refreshParams() {
      this.httpData = JSON.parse(JSON.stringify(this.httpData || []));
      this.receiveData = JSON.parse(JSON.stringify(this.receiveData));
      this.sendData = JSON.parse(JSON.stringify(this.sendData));
      this.$forceUpdate();
    },
    //参数列表操作
    // 添加输入输出按钮点击
    showParams(e, paramDirection) {
      if (e == "userDefined") {
        this.$refs.userDefinedRef.showDialog(e);
      } else {
        this.$refs.dicRef.showDialog(e, paramDirection);
      }
    },
    //确认选择参数
    async saveParamsDataset(tableData) {
      this.tableLength = 0;
      this.getchildTier(JSON.parse(JSON.stringify(tableData)), 0, "dialog");
      if (this.tableLength + this.isData.childTier > 5) {
        return this.$message.error(
          `最多只能添加5层参数，当前在${this.isData.childTier}层`
        );
      }
      this.formInline = this.$refs.dicRef.formInline;
      const data = this.filterChild(JSON.parse(JSON.stringify(tableData)));
      const sendDataTemp = JSON.parse(
        JSON.stringify(mixList(this.sendData, "sonParamList"))
      );
      const receiveDataTemp = JSON.parse(
        JSON.stringify(mixList(this.receiveData, "sonParamList"))
      );
      let paramsF = false;
      //输入参数判断 s 输入   r 输出
      if (this.formInline.type == "s") {
        data.map((item) => {
          sendDataTemp.map((m) => {
            if (item.paramKey == m.paramKey) {
              paramsF = true;
            }
          });
        });
      } else if (this.formInline.type == "r") {
        data.map((item) => {
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
      data.map((item) => {
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
          // dataSetDataId: item.dataSetDataId,
          children: item.children.length ? item.children : [],
          // standFlg: this.radioHeader == "0" ? "10" : "00",
          // standType: this.radioHeader == "0" ? "10" : "00",
          isFilter:item.isFilter
        };
        this.addChildParams(
          this.isData.paramDirection === "1" ? this.receiveData : this.sendData,
          this.isData,
          prs,
          false
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
          if (item.children.length) {
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
    async setInitData(data) {
      console.log(
        "setInitData",
        data,
        data.actionId,
        this.serviceIdMapToParamList
      );
      if (data.actionId == this.currentServObj.apiId) {
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
      } else if (data.actionId == this.currentServObj.apiId) {
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
    },
    async init() {
      if (this.hasInit) return;
      const transId = this.currentServObj.apiId;
      const res = await this.rpc.d4.getD4bServiceInfo({
        svcId: transId,
        dsgnFlg: "1",
      });
      this.initParams(res);
      this.getDessitizaList();
      this.hasInit = true
    }
  },
  created() {
    this.appId = this.$route.query.appId
    this.projectId = this.$route.query.projectId
    // this.init()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_workgate_comps_apimgmt_api_mod_params {
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
