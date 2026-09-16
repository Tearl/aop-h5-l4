<template>
  <div class="aop_tradedesign_comps_workbench_public_dialog_addService">
    <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <div class="content">
      <Basic
        ref="basicRef"
        :editFlag="true"
        :infoData="dataObj"
        :svcTypShow="true"
        @radioChange="radioChange"
      ></Basic>
      <Params
        ref="paramsRef"
        :dataObj="dataObj"
        :paramsIdList="paramsIdList"
        @addParamsId="addParamsId"
        @delParamsId="delParamsId"
        sendParentClass="send_data_list_edit"
        receiveParentClass="receive_data_list_edit"
        v-if="paramsShow"
      ></Params>
      <Rule
        ref="bizRuleRef"
        isEdit="edit"
        :ruleInfo="ruleInfo"
        :apiId="apiId"
        :dataObj="dataObj"
        v-if="ruleShow"
      >
      </Rule>
    </div>
    <PageFooter slot="footer">
      <div slot="box">
        <el-button @click="handleCancel">返 回</el-button>

        <el-button type="primary" @click="confirm">提 交</el-button>
      </div>
    </PageFooter>

    <!-- 从数据集中选择 -->
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Basic from "./components/form/servInfo";
import Params from "./components/form/params";
import Rule from "./components/form/biz_rule";
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";
import { unduplicated, setSerialNumber } from "@m/utils/array";
import { mixList, reList, dicSetParamOrder } from "@m/utils/dicParamTree";
import { getSessionStorage } from "@m/utils/localStorage.js";

export default {
  mixins: [mixin],
  components: {
    Basic,
    Params,
    PageHeader,
    PageFooter,
    Rule,
  },
  data() {
    return {
      breadcrumbs: [
        {
          label: "字典管理",
          operate: "list",
        },
        {
          label: "编辑数据集",
          operate: "edit",
        },
        {
          label: "编辑服务",
        },
      ],
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
      ruleShow: true, //暂时不需要展示二维表
      paramsShow: true,
      bizLine: "",
      currentServObj:{},
      tempList:[],
      serObj:{},
      mapDataList:{},
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
      editDatasetType:""
    };
  },
  // destroyed(){
  //   sessionStorage.removeItem("dataSetInfo")
  // },
  methods: {
    init() {
      this.apiId = this.$route.query.apiId;
      this.dataObj = JSON.parse(getSessionStorage("dataSetInfo"));
      this.editDatasetType = this.$route.query.editDatasetType
      this.$nextTick(() =>{
        const that_rule = this.$refs.bizRuleRef;
        that_rule.ruleInfo = {};
        const that = this.$refs.bizRuleRef.$refs.ruleTableRef
        that.setRuleInfo(this.ruleInfo)
      })

      this.getApiDetail(this.apiId);

      this.getParamsList();
      // this.getServDetail();
      // this.getBusinessRuleInfo();
      // this.getParamsList();
    },
    labelClick(e) {
      if (e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list",
        });
      } else if (e == "edit") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editDataSet",
          query: {
            dataSetNo: this.dataObj.dataSetNo,
            editDatasetType: this.editDatasetType
          },
        });
      }
    },
    //新增时获取输入输出参数模板
    async getDetail(res) {
      // 处理输入参数
      const sendData = res.puApiParams.filter((item) => {
        return item.paramPosition != "2" && item.paramDirection == "0";
      });
      let tempArr = reList(sendData, "paramParentId", "paramOrder");

      // tempArr.forEach((item) => {
      //   if (
      //     [

      //       "reqHeaderData",
      //       "commonData",
      //       "channelData",
      //       "securityData", 
      //       "bodyData", 
      //     ].includes(item.paramKey) &&
      //     !item.paramParentId &&
      //     item.paramValueType == "Object"
      //   ) {
      //     this.setDisabled(item);
      //   }

      //   // this.setDisabled(item);
      //   if (item.paramKey == "bodyData" && item.children) {
      //     item.showChild = true;
      //     this.setEditDisabled(item.children);
      //   }
      // });
      
      // console.log(tempArr,"---===----")
      tempArr = tempArr.sort((a,b) => a.paramOrder - b.paramOrder)
      dicSetParamOrder(tempArr)
      // let bodyDataList = tempArr.filter((item) =>item.paramPosition == "0" &&!item.paramParentId &&item.paramKey == "bodyData")
      // if(bodyDataList[0].children && bodyDataList[0].children.length > 0) dicSetParamOrder(bodyDataList)
      // console.log(tempArr[1],tempArr,"bodyDataList")
      this.$refs.paramsRef.sendData = tempArr;

      // 处理输出参数
      const receiveData = res.puApiParams.filter((item) => {
        return item.paramPosition != "2" && item.paramDirection == "1";
      });
      let arrOutput = reList(receiveData, "paramParentId", "paramOrder");
      
      // arrOutput.forEach((item) => {

      //   if (
      //     ["bodyOutData", "resHeaderData"].includes(item.paramKey) &&
      //     !item.paramParentId &&
      //     item.paramValueType == "Object"
      //   ) {

      //     this.setDisabled(item);

      //   }
      //   // this.setDisabled(item);
      //   if (item.paramKey == "bodyOutData" && item.children) {
      //     item.showChild = true;
      //     this.setEditDisabled(item.children);

      //   }
      // });

      // console.log(arrOutput,"---===----")
      arrOutput = arrOutput.sort((a,b) => a.paramOrder - b.paramOrder)
      dicSetParamOrder(arrOutput)
      // let bodyOutDataList = arrOutput.filter((item) =>item.paramPosition == "0" &&!item.paramParentId &&item.paramKey == "bodyOutData")
      // if(bodyOutDataList[0].children && bodyOutDataList[0].children.length > 0) dicSetParamOrder(bodyOutDataList)
      // console.log(arrOutput[1],arrOutput,"bodyOutDataList")
      this.$refs.paramsRef.receiveData = arrOutput;
      let puApiParams = JSON.parse(
            JSON.stringify(
              mixList(tempArr, "children").concat(
                mixList(arrOutput, "children")
              )
            )
          );
      this.tempList.push(...puApiParams);
    },
    async getApiDetail(data){
      this.serObj= data;
      const params= {
        apiId:data
      }
      const res = await this.rpc.dicmgmt.getApiDetail(params);
      // console.log(res,"--------");
      let obj ={}
      if(res.apiServiceType !== "D5自有服务"){
        this.ruleShow = false;
        this.paramsShow = false;
        this.$nextTick(()=>{
          this.$refs.basicRef.getSystemList();
        })
      }else{
        this.ruleShow = true;
        this.paramsShow = true;
        this.getDetail(res);
        this.getBusinessRuleInfo()
      }
      obj ={
        svcTyp:res.apiServiceType,
        svcNm:res.apiName,
        svcNo:res.apiCode,
        dataSetNm:this.dataObj.dataSetNm,
        svcDesc:res.apiDesc,
        systemCode:res.relySys
      }
      this.$nextTick(()=>{
        this.$refs.basicRef.servForm = obj;
      })
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
    setEditDisabled(data){
      data.map((item) =>{
        this.setLengthDisabled(item)
        if(item?.children?.length){
          this.setEditDisabled(item.children)
        }
      })
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
    handleCancel() {
      this.labelClick("edit");
    },
    async getParamsList() {
      const params = {
        apiId: this.apiId,
      };
      const res = await this.rpc.dicmgmt.getParamsList(params);
      this.paramsIdList = res.d5UseDataSetRelList;
    },
    addParamsId(data) {
      // this.paramsIdList.push(data);
      // console.log("新增后的params", this.paramsIdList);
      // this.paramsIdList =  unduplicated( list, "paramKey");
    },
    delParamsId(paramId, data) {
      // console.log("删除前", paramId,data);
      // this.paramsIdList.forEach((item,index)=> {
      //   if (item.paramId == paramId) {
      //       this.paramsIdList.splice(index, 1);
      //       console.log("删除后的params", this.paramsIdList,paramId);
      //       return 
      //   }
      // })
      // if(data.children && data.children.length > 0) {
      //     let i = 0
      //     while(data.children[i]) {
      //       this.delParamsId(data.children[i].paramId, data.children[i])
      //       i++
      //     }
      //   }
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
      console.log("obj2", obj2, this.servObj);
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

    confirm() {
      let form = this.$refs.basicRef.servForm;
      this.$refs.basicRef.$refs.formRef.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        // if (!this.paramsIdList.length)
        //   return this.$message.error("请从数据集中选择字段");
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
          let noSameList = [];  //拿到新增完成 和查询回来的不同参数
          let addParamsList = []; //从noSameList 拿到从数据集新增的字段参数
          let sameList = [];   //新增完成和关联 表找出相同的数据集字段
          let d5UseDataSetRelList = []; 
          //添加过后和返回的参数不同
          noSameList = puApiParams.filter((f) => !this.tempList.some((s) => s.paramId == f.paramId))
          //处理前后对比出新增的字段
          noSameList.map((item) =>{

            if(item.dataSetDataId ){
              addParamsList.push({
              dataSetDataId:item.dataSetDataId || "",
              paramId:item.paramId || "",
              dataSetNm:item.dataSetNm,
              dataSetNo:item.dataSetNo,
              dataSubstnNm:item.dataSubstnNm,
              dataSubstnNo:item.dataSubstnNo,
              paramKey:item.paramKey,
              paramNm:item.paramNm
            })
            }
          })
          //获取跟关联表相同的参数 
          puApiParams.map((item) =>{

            this.paramsIdList.map((m) =>{

              if(item.paramKey == m.paramKey){
                sameList.push(m)
              }
            })
          })

          console.log(sameList, "sameList", addParamsList,'addParamsList',noSameList,"noSameList",d5UseDataSetRelList,"d5UseDataSetRelList")
          d5UseDataSetRelList.push(...sameList, ...addParamsList)
          d5UseDataSetRelList = unduplicated(d5UseDataSetRelList,"dataSetDataId")
          console.log("d5UseDataSetRelList---->", d5UseDataSetRelList)
          const listFlag = puApiParams.filter((item) => {
            if (!["File","List","Object"].includes(item.paramValueType)){
              return item.paramKey == "" || item.paramCName == "" || item.paramValueType == "" || item.paramLength == "";
            }else{
              return item.paramKey == "" || item.paramCName == "" || item.paramValueType == "";
            }
          });
          console.log(listFlag,'listFlag')
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
          if(this.keyList[0]) return this.$message.error(`自定义输入参数类型为List：参数名称为【${this.keyList[0]}】的 "参数key"要以英文开头List为结尾`)
          if(this.keyList[1]) return this.$message.error(`自定义输出参数类型为List：参数名称为【${this.keyList[1]}】的 "参数key"要以英文开头List为结尾`)
          this.keyOtherList = {};
          this.hasOtherKey(puApiParams)
          if(this.keyOtherList[0]) return this.$message.error(`自定义输入参数：参数名称为【${this.keyOtherList[0]}】的 "参数key"以英文开头,或数字结尾,错误输入,例如：A8A、A8A8`)
          if(this.keyOtherList[1]) return this.$message.error(`自定义输出参数：参数名称为【${this.keyOtherList[1]}】的 "参数key"以英文开头,或数字结尾,错误输入,例如：A8A、A8A8`)
          this.keywordList = {};
          this.hasKeyword(puApiParams)
          if(this.keywordList[0]) return this.$message.error(`自定义输入参数类型为Object：参数名称为【${this.keywordList[0]}】的 "参数key"不能是Java关键字`)
          if(this.keywordList[1]) return this.$message.error(`自定义输入参数类型为Object：参数名称为【${this.keywordList[1]}】的 "参数key"不能是Java关键字`)
     
          // 传参
          const params = {
            dataSetNo:this.dataObj.dataSetNo,
            dataSetNm:this.dataObj.dataSetNm,
            apiName:form.svcNm,
            apiDesc:form.svcDesc,
            apiServiceType:form.svcTyp || this.dataObj.apiServiceType,
            puApiParams: puApiParams,
            d5UseDataSetRelList: d5UseDataSetRelList,
            bizLine: this.bizLine,
            apiId:this.apiId
          };
          console.log("确认", params, arr);
          if(this.ruleInfo.ruleDefnId){
            const that = this.$refs.bizRuleRef.$refs.ruleTableRef;
            if(!that.getCheckData()) return
            const res = await this.rpc.dicmgmt.editL5Serv(params);
            that.editBusinessRule(this.ruleInfo)
            this.handleCancel();
          }else{
            const that = this.$refs.bizRuleRef.$refs.ruleTableRef;
            if(!that.getCheckData()) return
            const res = await this.rpc.dicmgmt.editL5Serv(params);
            that.addBusinessRule()
            this.handleCancel();
          }
        } else {
          const params = {
            standardSystemCode: form?.standardSystemCode,
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
          this.handleCancel();
        }
      });
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
  },
  created() {
    this.init();
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
</style>
