<template>
  <div class="aop_tradedesign_dic_cmps_data_set_form_params">
    <el-form
      ref="formRef"
      :model="servForm"
      :rules="rules"
      label-width="130px"
      class="edit_form"
    >
    <div v-if="detailShow">
      <div class="header_title">参数配置</div>
      <el-form-item label="输入参数：">
        <div class="input_wrapper">
          <div class="top_right_create">
            <!-- <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="addParams(sendData, '0', '0')"
                  >添加输入参数</el-button
                > -->
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="showDialogBody('definedInput')"
              >自定义添加</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="showParams('s')"
              >添加参数</el-button
            >
            <el-tag size="small" type="warning">1、自定义添加参数时，参数key只能是英文，参数描述需输入自定义原因  2、自定义参数类型为List时，参数key要以List为结尾</el-tag>
          </div>
          <!-- <Table
                class="table_style_ft table_style"
                :data="sendData"
                rowK="paramOrder"
                :table="sendColumns"
                @operate="operate"
              ></Table> -->
          <div class="data_wrapper">
            <PageBigData
              ref="sendDataRef"
              :parentClass="sendParentClass"
              :data="sendData"
              @add="addBdata"
              @del="delBdata"
              @addByDic="addByDic"
              @paramKeyBlur="paramKeyBlur"
              @setLengthDisabled="setLengthDisabled"
            ></PageBigData>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="输出参数：" required>
        <div class="output_wrapper">
          <div class="top_right_create">
            <!-- <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="addParams(receiveData, '0', '1')"
                  >添加输出参数</el-button
                > -->
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="showDialogBody('definedOutput')"
              >自定义添加</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="showParams('r')"
              >添加参数</el-button
            >
            <el-tag size="small" type="warning">1、自定义添加参数时，参数key只能是英文，参数描述需输入自定义原因  2、自定义参数类型为List时，参数key要以List为结尾</el-tag>
          </div>
          <!-- <Table
                class="table_style_ft table_style"
                :data="receiveData"
                :table="receiveColumns"
                rowK="paramOrder"
                @operate="operate"
              ></Table> -->
          <div class="data_wrapper">
            <PageBigData
              ref="receiveDataRef"
              :parentClass="receiveParentClass"
              :data="receiveData"
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

    <div v-else>
      <div class="header_title">参数配置</div>
      <el-form-item label="输入参数：">
        <div class="input_wrapper">
          <div class="top_right_create">
            <Table :treeProps="{ children: 'children' }" class="table_style" :data="sendInputData" :rowK="'paramOrder'" :table="iInputListTable"></Table>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="输出参数：">
        <div class="input_wrapper">
          <div class="top_right_create">
            <Table :treeProps="{ children: 'children' }" class="table_style" :data="receiveOutputData" :rowK="'paramOrder'" :table="iOutputListTable"></Table>
          </div>
        </div>
      </el-form-item>
    </div>
     
    </el-form>
    <!-- 从数据集中选择 -->
    <SelectFromDataSet
      ref="dataSetRef"
      :dataObj="dataObj"
      @saveParams="saveParams"
    ></SelectFromDataSet>

    <!-- 从元数据选择 -->
    <UserDefinedParams
      ref="userDefinedRef"
      @saveParams="saveParams"
    ></UserDefinedParams>

    <!-- 自定义body -->
    <BodyDefine
      ref="bodyDefineRef"
      :selectShow="true"
      @saveParams="saveBodyParams"
    ></BodyDefine>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import { unduplicated, setSerialNumber,unduplicatedByKeys } from "@m/utils/array";
import { mixList, reList, setParamOrder } from "@m/utils/paramTree";
import { getSessionStorage } from "@m/utils/localStorage.js";
import PageBigData from "@m/core/components/download_design/page_big_data";
import SelectFromDataSet from "../dialog/selcFromDataSet";
import UserDefinedParams from "@m/core/components/download_design/page_big_data/addUserDefined";
import BodyDefine from "@m/core/components/download_design/page_big_data/addUserDefined";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    PageBigData,
    SelectFromDataSet,
    PageHeader,
    PageFooter,
    UserDefinedParams,
    BodyDefine
  },
  props: {
    // 数据集信息
    dataObj: {
      type: String,
      default: () => ({}),
    },
    // 关联paramsId信息
    paramsIdList: {
      type: String,
      default: () => "",
    },
    sendParentClass:{
      type: String,
      default: () => "send_data_list",
    },
    receiveParentClass:{
      type: String,
      default: () => "receive_data_list",
    },
    detailShow:{
      type:Boolean,
      default:true
    }

  },
  data() {
    return {
      sendData: [],
      receiveData: [],
      // 当前数据
      isData: {},
      isHandleParamType: "",
      childList: [],
      paramCustomFlg:false,
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
      sendInputData:[],
      receiveOutputData:[],
      // 数据输入列表参数
      iInputListTable: [
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
          tooltip: true,
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
          type: "text",
        },
        {
          prop: "paramLength",
          label: "参数长度",
          type: "text",
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter"
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
      ],
      // 数据输出列表参数
      iOutputListTable: [
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
          tooltip: true,
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
          type: "text",
        },
        {
          prop: "paramLength",
          label: "参数长度",
          type: "text",
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter"
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
      ],
      bodyFlag: "",
    };
  },
  methods: {
    init() {},
    // 添加输入输出按钮点击
    showParams(e) {
      // console.log(this.sendData,'入参')
      if (JSON.stringify(this.dataObj) == "{}")
        return this.$message.error("请选择数据集");
      // if (e == "s") {
      //   const bodyDataList = this.sendData.filter((item) => {
      //     return (
      //       item.paramPosition == "0" &&
      //       !item.paramParentId &&
      //       item.paramKey == "bodyData"
      //     );
      //   });
      //   this.isData = bodyDataList[0];
      // } else if (e == "r") {
      //   const bodyDataList = this.receiveData.filter((item) => {
      //     return (
      //       item.paramPosition == "0" &&
      //       !item.paramParentId &&
      //       item.paramKey == "bodyOutData"
      //     );
      //   });
      //   this.isData = bodyDataList[0];
      // }
      this.isHandleParamType = e;
      if(e == "userDefined") {
        this.$refs.userDefinedRef.showDialog(e)
      }else {
        this.$refs.dataSetRef.showDialog();
      }
    },
    //大数据的添加
    addBdata(e) {
      this.operate("add", e);
    },
    //大数据的删除
    delBdata(e) {
      this.operate("del", e);
    },
    addByDic(e) {
      this.operate("dicAdd", e);
    },
    //BODY列表参数操作
    operate(operation, data) {
      console.log(data);
      if (data.paramDirection == "0") {
        if (operation == "add") {
          if(data.paramValueType && ["List","Object"].includes(data.paramValueType) && data.paramOrder.split(".").length >= 6) return this.$message.error("数据结构层级只能第五层")
          this.paramCustomFlg = false;
          this.isData = data;
          this.showParams("userDefined");
        } else if (operation == "dicAdd") {
          // if(["reqHeaderData","commonData","channelData","securityData"].includes(data.paramKey)&&!data.paramParentId &&data.paramValueType == "Object"){
          //   return this.$message.error("请在bodyData下添加参数")
          // }
          this.isData = data;
          this.paramCustomFlg = true;
          this.showParams("addChild");
        } else {
          this.delParams(this.sendData, data.paramOrder, data);
          // let bodyDataList = this.sendData.filter((item) =>item.paramKey == "bodyData" && item.paramPosition == "0" && !item.paramParentId )
          // console.log(bodyDataList,"bodyDataList")
          // // this.getNodeId(this.sendData[2].children,this.sendData[2].paramOrder);
          // this.getNodeId(bodyDataList[0].children,bodyDataList[0].paramOrder);
          // console.log(this.sendData[1],"sendData")
          setParamOrder(this.sendData)
          console.log(this.sendData,"sendData")
        }
      } else {
        if (operation == "add") {
          if(data.paramValueType && ["List","Object"].includes(data.paramValueType) && data.paramOrder.split(".").length >= 6) return this.$message.error("数据结构层级只能第五层")
          this.paramCustomFlg = false;
          this.isData = data;
          this.showParams("userDefined");
        } else if (operation == "dicAdd") {
          // if(["resHeaderData"].includes(data.paramKey)&&!data.paramParentId &&data.paramValueType == "Object"){
          //   return this.$message.error("请在bodyOutData下添加参数")
          // }
          this.isData = data;
          this.paramCustomFlg = true;
          this.showParams("addChild");
        } else {
          this.delParams(this.receiveData, data.paramOrder, data);
          // let bodyOutDataList = this.receiveData.filter((item) =>item.paramKey == "bodyOutData" && item.paramPosition == "0" && !item.paramParentId )
          // console.log(bodyOutDataList,"bodyOutDataList")
          // // this.getNodeId(this.receiveData[1].children,this.receiveData[1].paramOrder);
          // this.getNodeId(bodyOutDataList[0].children,bodyOutDataList[0].paramOrder);
          // console.log(this.receiveData[1],"receiveData")
          setParamOrder(this.receiveData)
          console.log(this.receiveData,"receiveData")
        }
      }
    },
    /** 添加子级报文参数
     * @param {Array} arrs 原数组
     * @param {Object} item 父级
     * @param {Object} prs 赋值后的数据,字典需用
     */
    addChildParams(arrs, item = {}, prs = {}) {
      const order =
        item.children && item.children.length > 0
          ? item.paramOrder + "." + (item.children.length + 1)
          : item.paramOrder + "." + 1;
      const data = {
        paramOrder: order,
        paramCName: prs.paramCName || "",
        paramValue: prs.paramValue || "",
        paramLength: prs.paramLength || "",
        // paramValueType: "List",
        paramValueType: prs.paramValueType || "",
        paramPosition: item.paramPosition,
        paramDirection: item.paramDirection,
        paramDesc: prs.paramDesc || "",
        isNeed: "0", // 0过滤，1不过虑
        paramParentId: item.paramOrder,
        action: "0",
        apEnum:prs.apEnum || "",
        paramKey:prs.paramKey || "",
        paramCName: prs.paramCName || "",
        paramLength: prs.paramLength || "",
        paramNm:prs.paramNm || "",
        speciTypeList:prs.speciTypeList || "",
        paramCustomFlg:this.paramCustomFlg ? "0" : "1",
        paramId: prs.paramId || this.createId(),
        dataSetDataId: prs.dataSetDataId || "" ,
        dataSubstnNo: prs.dataSubstnNo || "",
        dataSetNm: prs.dataSetNm || "",
        dataSetNo: prs.dataSetNo || "",
        dataSubstnNm: prs.dataSubstnNm || "",
      };
      if (prs.children && prs.children.length > 0) {
        prs.children.map((iitem) => {
          const prs = {
            paramKey: iitem.paramKey || "",
            paramCName: iitem.paramCName,
            paramLength: iitem.paramLength,
            paramValueType: iitem.paramValueType,
            paramDesc: iitem.paramDesc,
            // children: iitem.children,
            paramId: iitem.paramId,
            isNeed:this.paramCustomFlg ? "0" : "1",
          };
          if(iitem.children?.length > 0) {
            prs.children = iitem.children
          }
          this.addChildParams({}, data, prs);
        });
      }
      const mixData = JSON.parse(JSON.stringify(data));
      item.children = item.children || [];
      item.children.push(mixData);
      if (!!mixData.paramKey) {
        // item.children = unduplicatedByKeys(item.children, ["paramKey","paramCName"]);
        item.children = this.unduplicated(item.children);
      }
      this.$emit("addParamsId", mixData);
      // arrs = JSON.parse(JSON.stringify(arrs));
      // this.refreshParams();
    },
    refreshParams() {
      this.receiveData = JSON.parse(JSON.stringify(this.receiveData));
      this.sendData = JSON.parse(JSON.stringify(this.sendData));
      this.$forceUpdate();
    },
    // 删除报文参数
    delParams(arrs, id, data) {
      let i = 0;
      while (arrs[i]) {
        if (arrs[i].paramOrder == id) {
          let paramsId = arrs[i].paramId;
          this.$emit("delParamsId", paramsId, arrs[i]);
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
    },
    getSort(arrs,id){
      let i = 0;
      while(arrs[i]){
        arrs[i].paramOrder = id ? id + "." + (i + 1) : 2 + "";
        arrs[i].paramParentId = id ? id : "";
        if(arrs[i].children && arrs[i].children.length > 0){
          this.getSort(arrs[i].children, arrs[i].paramOrder);
        }
        i++;
      }
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
    // 保存当前选中的参数
    saveParams(e, substnData,type) {
      let flag = type == "userDefined"
      console.log("data",flag, e, substnData,type);
      const data = JSON.parse(JSON.stringify(e));
      if(this.isHandleParamType === "userDefined" || this.isHandleParamType === "addChild"){
        data.map((item) => {
          const prs = {
            paramKey: flag ? item.paramKey : item.dictNo,
            paramCName: flag ? item.paramCName : item.dictNm,
            paramLength: flag ? item.paramLength : item.dictLength,
            paramValueType: flag ? item.paramValueType : item.dictTyp,
            paramDesc: flag ? item.paramDesc : item.dataDesc,
            paramNm: flag ? item.paramCName : item.dictNm,
            paramId: this.createId(),
            dataSetDataId: flag ? "" : item.dataSetDataId,
            dataSetNo: flag ? "" : item.dataSetNo,
            apEnum: flag ? item.paramEnum : item.dataEnum,
            dataSetNm: flag ? "" : this.dataObj.dataSetNm,
            dataSubstnNo: flag ? "" : item.dataSubstnNo,
            dataSubstnNm: flag ? "" : substnData.dataSubstnNm,
            speciTypeList:"speciTypeList",
            paramCustomFlg: flag ? "1" : "0",
            paramType: flag ? item.paramValueType : item.dictTyp,
          };
          if(item.children?.length>0) {
            prs.children = item.children
          }
          this.addChildParams(
            this.isData.paramPosition === "1"
            ? this.httpData
            : this.isData.paramDirection === "1"
            ? this.receiveData
            : this.sendData,
            this.isData,
            prs
          );
        });
        // if (this.isData.paramDirection === "1") {
        //   this.expendChild(this.receiveData, "bodyOutData");
        // } else {
        //   this.expendChild(this.sendData, "bodyData");
        // }
        this.refreshParams();
      }else{
        data.map((item)=>{
          const prs = {
            paramKey: item.dictNo,
            paramCName: item.dictNm,
            paramLength:item.dictLength,
            paramValueType: item.dictTyp,
            paramDesc: item.dataDesc,
            paramNm: item.dictNm,
            paramId: this.createId(),
            dataSetDataId: item.dataSetDataId,
            dataSetNo: item.dataSetNo,
            dataSetNm: this.dataObj.dataSetNm,
            dataSubstnNo: item.dataSubstnNo,
            dataSubstnNm: substnData.dataSubstnNm,
            apEnum:item.dataEnum,
            speciTypeList:"speciTypeList",
            paramCustomFlg: flag ? "1" : "0",
            paramType: item.dictTyp,
          }
          this.addParams(
            this.isHandleParamType === "r" ? this.receiveData : this.sendData,
            this.isHandleParamType === "h" ? "1" : "0",
            this.isHandleParamType === "r" ? "1" : "0",
            prs
          );
        })
      }
      // data.map((item) => {
      //   const prs = {
      //     paramKey: flag ? item.paramKey : item.dictNo,
      //     paramCName: flag ? item.paramCName : item.dictNm,
      //     paramLength: flag ? item.paramLength : item.dictLength,
      //     paramValueType: flag ? item.paramValueType : item.dictTyp,
      //     paramDesc: flag ? item.paramDesc : item.dataDesc,
      //     paramNm: flag ? item.paramCName : item.dictNm,
      //     paramId: this.createId(),
      //     dataSetDataId: flag ? "" : item.dataSetDataId,
      //     dataSetNo: flag ? "" : item.dataSetNo,
      //     apEnum: flag ? item.paramEnum : item.dataEnum,
      //     dataSetNm: flag ? "" : this.dataObj.dataSetNm,
      //     dataSubstnNo: flag ? "" : item.dataSubstnNo,
      //     dataSubstnNm: flag ? "" : substnData.dataSubstnNm,
      //     speciTypeList:"speciTypeList",
      //     paramCustomFlg: flag ? "1" : "0",
      //   };
      //   if(item.children?.length>0) {
      //     prs.children = item.children
      //   }
      //   this.addChildParams(
      //     this.isData.paramPosition === "1"
      //       ? this.httpData
      //       : this.isData.paramDirection === "1"
      //       ? this.receiveData
      //       : this.sendData,
      //     this.isData,
      //     prs
      //   );
      // });
      // if (this.isData.paramDirection === "1") {
      //   this.expendChild(this.receiveData, "bodyOutData");
      // } else {
      //   this.expendChild(this.sendData, "bodyData");
      // }
      // this.refreshParams();
      // if (this.isHandleParamType === "addChild") {
      //   data.map((item) => {
      //     const prs = {
      //       paramKey: item.dictNo,
      //       paramCName: item.dictNm,
      //       paramLength: item.dictLength,
      //       paramValueType: item.dictTyp,
      //       paramDesc: item.dataDesc,
      //       paramNm: item.dictNm,
      //       paramId: this.createId(),
      //       dataSetDataId: item.dataSetDataId,
      //       dataSetNo: item.dataSetNo,
      //       checkPattern:item.dataEnum,
      //       dataSetNm: this.dataObj.dataSetNm,
      //       dataSubstnNo: item.dataSubstnNo,
      //       dataSubstnNm: substnData.dataSubstnNm,
      //     };
      //     this.addChildParams(
      //       this.isData.paramPosition === "1"
      //         ? this.httpData
      //         : this.isData.paramDirection === "1"
      //         ? this.receiveData
      //         : this.sendData,
      //       this.isData,
      //       prs
      //     );
      //   });
      //   this.refreshParams();
      // } else {
      //   data.map((item) => {
      //     const prs = {
      //       paramKey: item.dictNo,
      //       paramCName: item.dictNm,
      //       paramLength:item.dictLength,
      //       paramValueType: item.dictTyp,
      //       paramDesc: item.dataDesc,
      //       paramNm: item.dictNm,
      //       paramId: this.createId(),
      //       dataSetDataId: item.dataSetDataId,
      //       dataSetNo: item.dataSetNo,
      //       dataSetNm: this.dataObj.dataSetNm,
      //       dataSubstnNo: item.dataSubstnNo,
      //       dataSubstnNm: substnData.dataSubstnNm,
      //       checkPattern:item.dataEnum,
      //     };
      //     this.addParams(
      //       this.isHandleParamType === "r" ? this.receiveData : this.sendData,
      //       this.isHandleParamType === "h" ? "1" : "0",
      //       this.isHandleParamType === "r" ? "1" : "0",
      //       prs
      //     );
      //   });
      // }
      setParamOrder(this.sendData);
      setParamOrder(this.receiveData);
      this.$nextTick(() => {
        this.$refs.dataSetRef.closeDialog();
      });
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
      const data = {
        paramOrder: order.toString(),
        paramCName: prs.paramCName || "",
        paramValue: prs.paramValue || "",
        paramLength: prs.paramValue || "",
        paramValueType: prs.paramValueType,
        paramPosition: pos,
        paramDirection: direct,
        paramDesc: prs.paramDesc,
        isNeed: "0", // 0过滤，1不过虑
        paramParentId: "",
        action: "0",
        apEnum:prs.apEnum || "",
        paramKey:prs.paramKey || "",
        paramType: prs.paramType,
      };
      const mixData = Object.assign(data, prs);
      arrs.push(mixData);
      if(!!mixData.paramKey){
        if(pos !== "2" && direct == "0") this.sendData = this.unduplicated(this.sendData)
        else if (pos !== "2" && direct == "1") this.receiveData = this.unduplicated(this.receiveData)
      }
      console.log(arrs,"-----")
      this.$emit("addParamsId", mixData);
    },
    expendChild(data, type) {
      data.forEach((item) => {
        if (item.paramKey == type && item.children){
          item.showChild = true;
        }
      });
    },
    paramKeyBlur(data){
      const reg = /^[a-zA-Z]+[0-9]*$/;
      const regList = /^[a-zA-Z]+List$/;
      if(data.paramValueType == "List"){
        if (data.paramKey == "") return this.$message.error("参数key不能为空")
        else if(!regList.test(data.paramKey)) return this.$message.error("参数key只能以英文开头，List结尾")
      }else if(data.paramValueType == "Object"){
        if(this.javaKeyWord.includes(data.paramKey)) return this.$message.error("参数key不能是Java关键字")
        else if (data.paramKey == "") return this.$message.error("参数key不能为空")
        else if (!reg.test(data.paramKey)) return this.$message.error("参数key以英文开头,或数字结尾,例如AA、A88,不能是A8A8")
      }else{
        if (data.paramKey == "") return this.$message.error("参数key不能为空")
        else if(!reg.test(data.paramKey)) return this.$message.error("参数key以英文开头,或数字结尾,例如AA、A88,不能是A8A8")
      }
    },
    setLengthDisabled(data){
      if(["Boolean","Character","boolean","char"].includes(data.paramValueType) && data.paramCustomFlg == "1"){
        data.lengthDisabled = true;
        data.paramLength = "1";
      }else if(["Object","List"].includes(data.paramValueType) && data.paramCustomFlg == "1"){
        data.lengthDisabled = true;
        data.paramLength = "";
      }else{
        data.lengthDisabled = false;
      }
    },
    //增加paramsId
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
    setData(){
      this.sendInputData = [];
      this.receiveOutputData = []
    },
    resetData(){
      this.sendData = [];
      this.receiveData = [];
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
    //自定义body
    addBodyParams(arrs, pos, direct, prs = {}) {
      const order =
        arrs.length > 0
          ? arrs[arrs.length - 1].paramOrder.indexOf(".") !== -1
            ? arrs[arrs.length - 1].split(".")[0] * 1 + 1
            : arrs[arrs.length - 1].paramOrder * 1 + 1
          : 1;
      const data = {
        paramOrder: order.toString(),
        paramCName: prs.paramCName || "",
        paramValue: prs.paramValue || "",
        paramLength: prs.paramLength || "",
        paramValueType: prs.paramValueType,
        paramPosition: pos,
        paramDirection: direct,
        paramDesc: prs.paramDesc,
        isNeed: "0", // 0过滤，1不过虑
        paramParentId: prs?.paramOrder || "",
        action: "0",
        apEnum: prs.apEnum || "",
        paramKey: prs.paramKey || "",
        paramCustomFlg: "1",
        // paramType: prs.paramType,
      };
      if (prs.children && prs.children.length > 0) {
        prs.children.map((iitem) => {
          const prs = {
            paramKey: iitem.paramKey || "",
            paramCName: iitem.paramCName,
            paramLength: iitem.paramLength,
            paramValueType: iitem.paramValueType,
            paramDesc: iitem.paramDesc,
            paramId: iitem.paramId,
            isNeed: "0", // 0过滤，1不过虑
            paramParentId: iitem.paramOrder,
            action: "0",
            apEnum: iitem?.apEnum || "",
            paramPosition: pos,
            paramDirection: direct,
            // paramKey: iitem?.paramKey || "",
            // paramType: iitem?.paramType,
          };
          if (iitem.children?.length > 0) {
            prs.children = iitem.children;
          }
          this.addChildBodyParams({}, data, prs);
        });
      }
      // const mixData = Object.assign(data,prs);
      const mixData = JSON.parse(JSON.stringify(data));
      // const mixData = prs?.children.length > 0 ?JSON.parse(JSON.stringify(data)) :Object.assign(data,prs);
      arrs.push(mixData);
      if (!!mixData.paramKey) {
        if (pos !== "2" && direct == "0")
          this.sendData = this.unduplicated(this.sendData);
        else if (pos !== "2" && direct == "1")
          this.receiveData = this.unduplicated(this.receiveData);
      }
      console.log(arrs, "-----");
      this.$emit("addParamsId", mixData);
    },
    //自定义body
    showDialogBody(e) {
      this.bodyFlag = e;
      this.paramCustomFlg = false;
      this.$refs.bodyDefineRef.showDialog();
    },
    //自定义body保存
    saveBodyParams(e) {
      console.log(e, "0----000");
      const data = JSON.parse(JSON.stringify(e));
      data.map((item) => {
        const prs = {
          paramKey: item.paramKey,
          paramCName: item.paramCName,
          paramLength: item.paramLength,
          paramValueType: item.paramValueType,
          paramDesc: item.paramDesc,
          paramNm: item.paramCName,
          paramId: this.createId(),
          dataSetDataId: "",
          dataSetNo: "",
          dataSetNm: "",
          dataSubstnNo: "",
          dataSubstnNm: "",
          apEnum: item.paramEnum,
          speciTypeList: "speciTypeList",
          paramCustomFlg: "1",
          paramType: item.paramValueType,
        };
        if (item.children && item.children.length > 0) {
          prs.children = item.children;
        }
        console.log("---prs--", prs);
        this.addBodyParams(
          this.bodyFlag === "definedOutput" ? this.receiveData : this.sendData,
          "0",
          this.bodyFlag === "definedOutput" ? "1" : "0",
          prs
        );
      });
      setParamOrder(this.sendData);
      setParamOrder(this.receiveData);
    },
    addChildBodyParams(arrs, item = {}, prs = {}) {
      const order =
        item.children && item.children.length > 0
          ? item.paramOrder + "." + (item.children.length + 1)
          : item.paramOrder + "." + 1;
      const data = {
        paramOrder: order,
        paramCName: prs.paramCName || "",
        paramValue: prs.paramValue || "",
        paramLength: prs.paramLength || "",
        // paramValueType: "List",
        paramValueType: prs.paramValueType || "",
        paramPosition: item.paramPosition,
        paramDirection: item.paramDirection,
        paramDesc: prs.paramDesc || "",
        isNeed: "0", // 0过滤，1不过虑
        paramParentId: item.paramOrder,
        action: "0",
        apEnum: prs.apEnum || "",
        paramKey: prs.paramKey || "",
        paramCName: prs.paramCName || "",
        paramLength: prs.paramLength || "",
        paramNm: prs.paramNm || "",
        speciTypeList: prs.speciTypeList || "",
        paramCustomFlg: this.paramCustomFlg ? "0" : "1",
      };
      if (prs.children && prs.children.length > 0) {
        prs.children.map((iitem) => {
          const prs = {
            paramKey: iitem.paramKey || "",
            paramCName: iitem.paramCName,
            paramLength: iitem.paramLength,
            paramValueType: iitem.paramValueType,
            paramDesc: iitem.paramDesc,
            // children: iitem.children,
            paramId: iitem.paramId,
            isNeed: this.paramCustomFlg ? "0" : "1",
            paramPosition: item.paramPosition,
            paramDirection: item.paramDirection,
          };
          if (iitem.children?.length > 0) {
            prs.children = iitem.children;
          }
          console.log("--aaaa---",prs)
          this.addChildBodyParams({}, data, prs);
        });
      }
      // const mixData =prs.children?.length > 0 ? Object.assign(data, prs): JSON.parse(JSON.stringify(data));
      // const mixData = Object.assign(data, prs);
      const mixData = JSON.parse(JSON.stringify(data));
      item.children = item.children || [];
      item.children.push(mixData);
      if (!!mixData.paramKey) {
        // item.children = unduplicatedByKeys(item.children, ["paramKey","paramCName"]);
        item.children = this.unduplicated(item.children);
      }
      this.$emit("addParamsId", mixData);
      // arrs = JSON.parse(JSON.stringify(arrs));
      // this.refreshParams();
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_cmps_data_set_form_params {
  // padding: 20px 30px;
  // margin-top: 10px;
  background: $base_white;
  padding: 0px 24px;
  .input_wrapper,
  .output_wrapper {
    .table_style {
      margin-top: 16px;
    }
    .top_right_create {
      font-size: 14px;
      ::v-deep .el-button {
        @include large_button_common;
      }
    }
    .data_wrapper {
      margin-top: 16px;
    }
  }
  ::v-deep .edit_form {
    .header_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #111111;
      letter-spacing: 0;
      margin-bottom: 20px;
      // font-weight: 600;
    }
    .el-form-item__label {
      color: $reg_ft_color;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      letter-spacing: 0;
      text-align: right;
      padding-right: 16px;
      color: #333333;
      // font-weight: 600;
    }
  }
  ::v-deep .el-button {
    height: 36px !important;
  }
  ::v-deep .el-form-item__label {
    width: 97px !important;
  }
  ::v-deep .el-form-item__content {
    margin-left: 97px !important;
  }
  ::v-deep .grid_header {
    background: #f5f5f8;
  }
}
</style>
