<template>
  <div class="aop_tradedesign_comps_workbench_public_dialog_addService">
    <PageDialog
      :dialogWidth="'1000px'"
      :dialogTitle="'添加新服务'"
      :dialogVisiable="dialogVisible"
      @closeDialog="dialogVisible = false"
      class="add_service_dialog"
      :apTobody="true"
    >
      <div slot="box">
        <div class="content">
          <Basic
            ref="basicRef"
            :editFlag="true"
            :infoData="radioObj"
            @openDataset="openDataset"
            @radioChange="radioChange"
          ></Basic>
          <Params
            ref="paramsRef"
            :dataObj="radioObj"
            :paramsIdList="paramsIdList"
            @addParamsId="addParamsId"
            @delParamsId="delParamsId"
            v-if="paramsShow"
          ></Params>
          <Rule
            ref="bizRuleRef"
            isEdit="edit"
            :currentServObj="currentServObj"
            :apiId="apiId"
            :dataObj="radioObj"
            v-if="ruleShow"
          ></Rule>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="confirmSer">确定</el-button>
      </div>
    </PageDialog>
    <!-- 数据集列表弹框 -->
    <DatasetList
      ref="datasetDetailRef"
      @confirmDataset="confirmDataset"
      @openDialog="openDatasetDialog"
      @openEditDialog="openEditDialog"
    ></DatasetList>
    <AddDataset ref="addDatasetRef" @getList="getList"></AddDataset>
    <EditDataset ref="editDatasetRef" @getList="getList"></EditDataset>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Basic from "./components/form/servInfoAdd";
import Params from "./components/form/params";
import Rule from "./components/form/biz_rule";
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";
import { unduplicated, setSerialNumber } from "@m/utils/array";
import { mixList, reList } from "@m/utils/paramTree";
import { getSessionStorage } from "@m/utils/localStorage.js";
import PageDialog from "@m/core/components/page_dialog";
import DatasetList from "../../datasetList";
import AddDataset from "../addDataset";
import EditDataset from "../addDataset/editIndex";

export default {
  mixins: [mixin],
  components: {
    Basic,
    Params,
    PageHeader,
    PageFooter,
    Rule,
    PageDialog,
    DatasetList,
    AddDataset,
    EditDataset,
  },
  props: {
    isShow: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      dataObj: {},
      dataSetNm: "",
      groupId: "",
      arsId: "",
      templateList: [],
      apiId: "",
      servObj: {},
      ruleInfo: {},
      // 存储L5服务关联的paramsId
      paramsIdList: [],
      dialogVisible: false,
      groupId: "",
      arsId: "",
      ruleShow: false, //暂时不需要展示二维表
      paramsShow: true,
      radioObj: {},
      bizLine: "",
      currentServObj:{},
      tempList:[],
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
      competitorId:"",  //银行ID
    };
  },
  methods: {
    getList() {
      this.$refs.datasetDetailRef.getDatasetList('update');
    },
    init() {
      this.apiId = this.$route.query.apiId;
      this.dataObj = JSON.parse(getSessionStorage("dataSetInfo"));
      this.getServDetail();
      this.getBusinessRuleInfo();
      this.getParamsList();
    },
    showDialog(data) {
      this.dialogVisible = true;
      this.ruleInfo = {};
      // this.getDetail();
      this.radioObj = {};
      this.paramsShow = true;
      if (JSON.stringify(data) !== "{}") {
        this.ruleShow = true;
        console.log(data)
        this.radioObj = data;
        this.$nextTick(() => {
          this.$refs.basicRef.resetForm();
          this.$refs.basicRef.servForm.dataSetNm = data.dataSetNm;
          this.$refs.basicRef.datasetDisabled = true;
          const that_rule = this.$refs.bizRuleRef;
          that_rule.ruleInfo = {};
          const that = this.$refs.bizRuleRef.$refs.ruleTableRef
          that.setRuleInfo(this.ruleInfo)
        });
      } else {
        this.ruleShow = false;
        this.$nextTick(() => {
          this.$refs.basicRef.datasetDisabled = false;
          this.$refs.basicRef.resetForm();
        });
      }
      // this.ruleShow = false;
      // this.$nextTick(() =>{
      //   this.$refs.basicRef.resetForm();
      // })
      this.$nextTick(() =>{
        this.$refs.paramsRef.resetData();
      })
    },
    handleCancel() {
      this.dialogVisible = false;
      this.$refs.basicRef.resetForm();
      this.$refs.datasetDetailRef.radioModel = {};
      this.ruleInfo = {};
    },
    //根据服务类型查服务id
    async getSysId() {
      const params = {
        apiServiceType: "D5自有服务",
      };
      const res = await this.rpc.dicmgmt.getSysId(params);
      this.arsId = res.arsId;
      this.groupId = res.groupId;
      // this.getDetail();
    },
    //新增时获取输入输出参数模板
    async getDetail() {
      // const params = {
      //   arsId: this.arsId,
      // };
      const res = await this.rpc.dicmgmt.getHeaderInfo();
      // console.log("数据", res);
      // 处理输入参数
      const sendData = res.paramList.filter((item) => {
        return item.paramPosition != "2" && item.paramDirection == "0";
      });
      let tempArr = reList(sendData, "paramParentId", "paramOrder");
      // console.log("tempArr", tempArr);
      tempArr.forEach((item) => {
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
        // this.setDisabled(item);
        if (item.paramKey == "bodyData" && item.children) {
          item.showChild = true;
        }
      });
      // this.$refs.paramsRef.sendData = reList(
      //   sendData,
      //   "paramParentId",
      //   "paramOrder"
      // );
      this.$refs.paramsRef.sendData = tempArr;

      // 处理输出参数
      const receiveData = res.paramList.filter((item) => {
        return item.paramPosition != "2" && item.paramDirection == "1";
      });
      let arrOutput = reList(receiveData, "paramParentId", "paramOrder");
      arrOutput.forEach((item) => {
        if (
          ["bodyOutData", "resHeaderData"].includes(item.paramKey) &&
          !item.paramParentId &&
          item.paramValueType == "Object"
        ) {
          this.setDisabled(item);
        }
        // this.setDisabled(item);
        if (item.paramKey == "bodyOutData" && item.children) {
          item.showChild = true;
        }
      });
      this.$refs.paramsRef.receiveData = arrOutput;
      let puApiParams = JSON.parse(
            JSON.stringify(
              mixList(tempArr, "children").concat(
                mixList(arrOutput, "children")
              )
            )
          );
      this.tempList.push(...puApiParams);
      // console.log(this.tempList,"111111");
      // this.$refs.paramsRef.receiveData = reList(
      //   receiveData,
      //   "paramParentId",
      //   "paramOrder"
      // );
      // console.log("data",sendData,receiveData)
    },
    // 循环遍历设置disabled属性
    setDisabled(data) {
      data.disabled = true;
      if (data.paramKey == "bodyData" || data.paramKey == "bodyOutData") {
        return;
      } else if (data.children) {
        data.children.forEach((item) => {
          this.setDisabled(item);
        });
      }
    },
    confirmSer() {
      let form = this.$refs.basicRef.servForm;
      this.$refs.basicRef.$refs.formRef.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        //去重
        if (form.svcTyp == "D5自有服务") {
          const i = this.getOnly(this.$refs.paramsRef.sendData);
          if (i.length > 0)
            return this.$message.error(
              "输入参数的参数key: " + i[0].paramKey + "不能重复!请检查"
            );
          const l = this.getOnly(this.$refs.paramsRef.receiveData);
          if (l.length > 0)
            return this.$message.error(
              "输出参数的参数key: " + l[0].paramKey + "不能重复，请检查"
            );

          //转一维数组
          let puApiParams = JSON.parse(
            JSON.stringify(
              mixList(this.$refs.paramsRef.sendData, "children").concat(
                mixList(this.$refs.paramsRef.receiveData, "children")
              )
            )
          );
          let tempParamsIdList = []
          // let puApiParamsTemp = puApiParams.filter((f) =>!this.tempList.some((s) => f.paramId == s.paramId))
          // let puApiParamsTemp = puApiParams.filter((f) => !["List","Object"].includes(f.paramValueType))
          puApiParams.map((item) =>{
            if(item.dataSetDataId){
              tempParamsIdList.push({
              dataSetDataId:item.dataSetDataId || "",
              paramId:item.paramId || ""
            })
            }
          })
          tempParamsIdList = unduplicated(tempParamsIdList,"dataSetDataId")
          // console.log(puApiParamsTemp,tempParamsIdList,"临时参数")
          const listFlag = puApiParams.filter((item) => {
            if (!["File","List","Object"].includes(item.paramValueType)){
              return item.paramKey == "" || item.paramCName == "" || item.paramValueType == "" || item.paramLength == "";
            }else{
              return item.paramKey == "" || item.paramCName == "" || item.paramValueType == "";
            }
          });
          // console.log(listFlag,'listFlag')
          if (listFlag.length > 0)
            return this.$message.error("参数Key、参数名称、参数长度、参数类型、及是否必输不能为空！");
          let arr = new Set(
            this.$refs.paramsRef.$refs.dataSetRef.dataSetDataIdList
          );
          this.descList ={};
          this.hasDesc(puApiParams)
          if(this.descList[0]) return this.$message.error(`请在输入参数：【${this.descList[0]}】的 "参数描述" 输入自定义原因`)
          if(this.descList[1]) return this.$message.error(`请在输出参数：【${this.descList[1]}】的 "参数描述" 输入自定义原因`)
          this.keyList ={};
          this.hasKey(puApiParams)
          if(this.keyList[0]) return this.$message.error(`自定义输入参数类型为List：参数名称为【${this.keyList[0]}】的 "参数key"以英文开头并以List为结尾`)
          if(this.keyList[1]) return this.$message.error(`自定义输出参数类型为List：参数名称为【${this.keyList[1]}】的 "参数key" 以英文开头并以List为结尾`)
          this.keyOtherList = {};
          this.hasOtherKey(puApiParams)
          if(this.keyOtherList[0]) return this.$message.error(`自定义输入参数：参数名称为【${this.keyOtherList[0]}】的 "参数key"以英文开头,或数字结尾,例如AA、A88,不能是A8A8`)
          if(this.keyOtherList[1]) return this.$message.error(`自定义输出参数：参数名称为【${this.keyOtherList[1]}】的 "参数key"以英文开头,或数字结尾,例如AA、A88,不能是A8A8`)
          this.keywordList = {};
          this.hasKeyword(puApiParams)
          if(this.keywordList[0]) return this.$message.error(`自定义输入参数类型为Object：参数名称为【${this.keywordList[0]}】的 "参数key"不能是Java关键字`)
          if(this.keywordList[1]) return this.$message.error(`自定义输入参数类型为Object：参数名称为【${this.keywordList[1]}】的 "参数key"不能是Java关键字`)
          // let puApiParamsTemp = puApiParams.filter((f) =>!this.tempList.some((s) => f.paramId == s.paramId))
          // console.log(puApiParamsTemp,"临时参数")
          const that = this.$refs.bizRuleRef.$refs.ruleTableRef
          const ruleComnt = that.ruleComnt
          const columnInfoList = that.transferColumnInfoListFormat(
            that.tableColumn,
            that.tableData
          )
          let funcInfo = JSON.parse(getSessionStorage("func-info"))
          // 传参
          const params = {
            // ...form,
            apiGroupId: "",
            // apiGroupId:"",
            arsId: "",
            d5UseDataSetRelList: tempParamsIdList,
            puApiParams: puApiParams,
            bizLine: this.bizLine,
            // bizLine: "FM-YWY-2022-000001",
            svcDesc: form.svcDesc,
            svcNm: form.svcNm,
            svcTyp: form.svcTyp,
            ruleNm: form.svcNm,
            ruleComnt,
            columnInfoList,
            // 资产
            groupId: funcInfo.admiId,
            groupNm: funcInfo.modelName,
            // 客户
            bkId: funcInfo.competitorId || this.competitorId,
            bkNm: funcInfo.competitorName,
            // 应用
            arsId: funcInfo.appLabel,
            arsNm: funcInfo.appLabelName,
          };
          console.log("确认", params, arr);
          const res = await this.rpc.downloadDesign.addL5Serv(params);
          this.$notify({
            title: "成功",
            message: "成功",
            duration: 2000,
            type: "success",
          });
          this.$emit("confirmService");
          this.handleCancel();
        } else {
          const params = {
            standardSystemCode: form?.systemCode?.standardSystemCode,
            labelCode: form.svcNo,
            labelName: form.svcNm,
            labelDesc: form.svcDesc,
            labelType: "0",
          };
          console.log("确认", params);
          const res = await this.rpc.downloadDesign.getAddLabel(params);
          this.$notify({
            title: "成功",
            message: "成功",
            duration: 2000,
            type: "success",
          });
          this.$emit("confirmService");
          this.handleCancel();
        }
      });
    },
    childrenOp(data){
      let numberParam = 0;
      if(data.children){
        if(["Object","List"].includes(data.children.paramValueType) && !data.children.dataSetDataId){
          numberParam = numberParam++;
        }else if(data.children.children){
          data.children.children.forEach((item)=>{
            this.childrenOp(item)
          })
        }
      }
      return numberParam
    },
    async getParamsList() {
      const params = {
        apiId: this.apiId,
      };
      const res = await this.rpc.dicmgmt.getParamsList(params);
      this.paramsIdList = res.d5UseDataSetRelList;
    },
    addParamsId({ dataSetDataId, paramId }) {
      this.paramsIdList.push({
        dataSetDataId: dataSetDataId,
        paramId: paramId,
      });
      // console.log("新增后的params", this.paramsIdList);
      // this.paramsIdList =  unduplicated( list, "paramKey");
    },
    delParamsId(paramId, data) {
      // console.log("删除前", paramId, data);
      this.paramsIdList.forEach((item, index) => {
        if (item.paramId == paramId) {
          this.paramsIdList.splice(index, 1);
          // console.log("删除后的params", this.paramsIdList, paramId);
          return;
        }
      });
      if (data.children && data.children.length > 0) {
        let i = 0;
        while (data.children[i]) {
          this.delParamsId(data.children[i].paramId, data.children[i]);
          i++;
        }
      }
    },
    //查询服务信息
    async getServDetail() {
      const params = {
        apiId: this.apiId,
      };
      const res = await this.rpc.dicmgmt.getApiDetail(params);
      let obj2 = (({
        apiServiceType,
        apiName,
        apiCode,
        apiVersion,
        apiServiceParticipater,
        apiDesc,
      }) => ({
        svcTyp: apiServiceType,
        svcNm: apiName,
        svcNo: apiCode,
        svcVer: apiVersion,
        apiServiceParticipater,
        svcDesc: apiDesc,
      }))(res);
      let {
        apiServiceType,
        apiName,
        apiCode,
        apiVersion,
        apiServiceParticipater,
        apiDesc,
        puApiParams,
        businessRuleList,
        ...tempObj
      } = res;

      Object.assign(this.servObj, tempObj);
      // console.log("obj2", obj2, this.servObj);
      this.$refs.basicRef.servForm = obj2;
      const inputList = res.puApiParams.filter(
        (item) => item.paramDirection === "0"
      );
      const outputList = res.puApiParams.filter(
        (item) => item.paramDirection === "1"
      );
      this.arsId = res.ssrId;
      this.groupId = res.apiGroupId;
      this.$refs.paramsRef.sendData = reList(inputList);
      this.$refs.paramsRef.receiveData = reList(outputList);
      this.$nextTick(() => {
        console.timeEnd("render耗时");
      });
    },

    async getBusinessRuleInfo() {
      this.ruleInfo = {};
      const params = {
        apiId: this.apiId,
      };
      const res = await this.rpc.dicmgmt.getBusinessRuleInfo(params);
      this.ruleInfo = res;
      const that = this.$refs.bizRuleRef.$refs.ruleTableRef;
      that.setRuleInfo(res);
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
    radioChange(e,data) {
      console.log(e,data, "eeeee");
      if (e == "D5直连服务") {
        this.paramsShow = false;
        this.ruleShow = false;
      } else {
        this.paramsShow = true;
        if(data.dataSetNm !== ""){
          this.ruleShow = true;
        }else{
          this.ruleShow = false;
        }
        // this.ruleShow = true;
        // this.getDetail();
      }
    },
    confirmDataset(data) {
      console.log(data, "confirmDataset");
      let that = this.$refs.basicRef;
      this.radioObj = data;
      // console.log(that, "confirmDataset");
      // that = JSON.parse(JSON.stringify(that))
      // that.dataSetNm = data.dataSetNm;
      // this.$nextTick(() =>{
      //   this.$set(that.servForm,"dataSetNm",data.dataSetNm)
      // })
      this.$set(that.servForm, "dataSetNm", data.dataSetNm);
      // console.log(that.servForm, "111");
      let dataObj = JSON.stringify(data);
      this.ruleShow = dataObj == "{}" ? false : true;
      if(dataObj !== "{}" && data.dataSetNm){
        that.validateField("formRef","dataSetNm");  //手动去除校验结果
      }
    },
    openDatasetDialog(data) {
      console.log("openDatasetDialog");
      this.$refs.addDatasetRef.showDialog();
    },
    openEditDialog(data) {
      this.$refs.editDatasetRef.showDialog(data);
    },
    openDataset() {
      this.$refs.datasetDetailRef.showDialog();
      // this.$emit("openDataset");
    },
    //自定义参数，描述不能为空
    hasDesc(data) {
      data.map(item => {
        if(item.paramCustomFlg == "1" && !item.paramDesc && !["List","Object"].includes(item.paramValueType)) {
          if(item.paramDirection in this.descList) {
            this.descList[item.paramDirection].push(item.paramCName)
          }else {
            this.descList[item.paramDirection] = []
            this.descList[item.paramDirection].push(item.paramCName)
          }
        }
        if(item.children && item.children.length) {
          this.hasDesc(item.children)
        }
      })
    },
    //自定义参数为List，参数key以英文开头，List结尾
    hasKey(data) {
      data.map(item => {
        if(item.paramValueType == "List" && !(/^[a-zA-Z]+List$/).test(item.paramKey)) {
          if(item.paramDirection in this.keyList) {
            this.keyList[item.paramDirection].push(item.paramCName)
          }else {
            this.keyList[item.paramDirection] = []
            this.keyList[item.paramDirection].push(item.paramCName)
          }
        }
        if(item.children && item.children.length) {
          this.hasKey(item.children)
        }
      })
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
    // this.init();
    this.bizLine = this.$route.query.bizLineId;
    this.competitorId = this.$route.query.competitorId;
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_workbench_public_dialog_addService {
  .content {
    margin: 16px;
  }
}
.add_service_dialog {
  ::v-deep .el-dialog__body {
    padding: 0;
  }
}
</style>
