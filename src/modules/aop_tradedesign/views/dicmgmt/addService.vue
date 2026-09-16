<template>
  <div class="aop_tradedesign_comps_workbench_public_dialog_addService">
    <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <div class="content">
      <Basic
        ref="basicRef"
        :infoData="dataObj"
        @radioChange="radioChange"
      ></Basic>
      <Params
        ref="paramsRef"
        :dataObj="dataObj"
        :paramsIdList="paramsIdList"
        @addParamsId="addParamsId"
        @delParamsId="delParamsId"
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
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";
import { unduplicated, setSerialNumber } from "@m/utils/array";
import { mixList, reList } from "@m/utils/paramTree";
import { getSessionStorage } from "@m/utils/localStorage.js";
import Rule from "./components/form/biz_rule";

export default {
  mixins: [mixin],
  components: {
    Basic,
    Params,
    PageHeader,
    PageFooter,
    Rule
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
          label: "新增服务",
        },
      ],
      dataObj: {},
      dataSetNm: "",
      groupId: "",
      arsId: "",
      templateList: [],
      // 存储L5服务关联的paramsId
      paramsIdList: [],
      paramsShow: true,
      ruleShow:true,
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
      ruleInfo:{},
      editDatasetType:""
    };
  },
  methods: {
    init() {
      this.dataObj = JSON.parse(getSessionStorage("dataSetInfo"));
      this.editDatasetType = this.$route.query.editDatasetType
      this.$nextTick(() =>{
        this.$refs.basicRef.servForm.dataSetNm = this.dataObj.dataSetNm
        const that_rule = this.$refs.bizRuleRef;
        that_rule.ruleInfo = {};
        const that = this.$refs.bizRuleRef.$refs.ruleTableRef
        that.setRuleInfo(this.ruleInfo)
      })
      // this.getSysId();
      this.ruleInfo = {};

      // this.getDetail();

      this.radioObj = {};
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
            editDatasetType:this.editDatasetType
          },
        });
      }
    },
    handleCancel() {
      this.labelClick("edit");
    },
    radioChange(e) {
      console.log(e, "radioChange");
      // this.getSysId();
      // this.getDetail();
      if (e == "D5直连服务") {
        this.paramsShow = false;
        this.ruleShow = false;
      } else {
        this.paramsShow = true;
        this.ruleShow = true;
        this.getDetail();
      }
    },
    //根据服务类型查服务id
    getSysId() {
      let type = "";
      this.$nextTick(async () => {
        type = this.$refs.basicRef.servForm.svcTyp;
        const params = {
          apiServiceType: type,
        };
        console.log("类型", params, type);
        const res = await this.rpc.dicmgmt.getSysId(params);
        this.arsId = res.arsId;
        this.groupId = res.groupId;
      });
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
      tempArr = tempArr.sort((a,b) => a.paramOrder - b.paramOrder)
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
      arrOutput = arrOutput.sort((a,b) => a.paramOrder - b.paramOrder)
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
    async getTempData() {
      const res = await this.rpc.dicmgmt.getFormatList();
      this.templateList = res.templates;
      this.getDetail("change");
    },
    confirm() {
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
          // console.log(puApiParams,'puApiParams',this.$refs.paramsRef.sendData,this.paramsIdList,"输入")
          let puApiParamsTemp = puApiParams.filter((f) =>!this.tempList.some((s) => f.paramId == s.paramId))
          // console.log(puApiParamsTemp,"临时参数")
          puApiParamsTemp.map((item) =>{
            if(item.dataSetDataId&&item.paramId){
              tempParamsIdList.push({
              dataSetDataId:item.dataSetDataId || "",
              paramId:item.paramId || ""
            })
            }
          })
          tempParamsIdList = unduplicated(tempParamsIdList,"dataSetDataId")
          console.log(puApiParamsTemp,tempParamsIdList,"临时参数")
          const listFlag = puApiParamsTemp.filter((item) => {
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
          if(this.keyOtherList[0]) return this.$message.error(`自定义输入参数：参数名称为【${this.keyOtherList[0]}】的 "参数key"以英文开头,或数字结尾,错误输入,例如：A8A、A8A8`)
          if(this.keyOtherList[1]) return this.$message.error(`自定义输出参数：参数名称为【${this.keyOtherList[1]}】的 "参数key"以英文开头,或数字结尾,错误输入,例如：A8A、A8A8`)
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
          // console.log("-------",that.tableColumn,that.tableData,columnInfoList)
          // 传参
          const params = {
            // ...form,
            apiGroupId: "",
            // apiGroupId:"",
            arsId:this.dataObj.arsId,
            d5UseDataSetRelList: tempParamsIdList,
            puApiParams: puApiParams,
            bizLine: this.dataObj.beltLine,
            // bizLine: "FM-YWY-2022-000001",
            svcDesc: form.svcDesc,
            svcNm: form.svcNm,
            svcTyp: form.svcTyp,
            ruleNm: form.svcNm,
            ruleComnt,
            columnInfoList,
          };
          console.log("确认", params, arr);
          const res = await this.rpc.downloadDesign.addL5Serv(params);
          this.$notify({
            title: "成功",
            message: "成功",
            duration: 2000,
            type: "success",
          });
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
    addParamsId({dataSetDataId,paramId}) {
      this.paramsIdList.push({"dataSetDataId":dataSetDataId,"paramId":paramId});
      // console.log("新增后的params", this.paramsIdList);
    },
    delParamsId(paramId, list) {
      // console.log("删除前", paramId, list);
      // let data = list;
      // this.paramsIdList.forEach((item, index) => {
      //   if (item.paramId == paramId) {
      //     this.paramsIdList.splice(index, 1);
      //     // console.log("删除后的params", this.paramsIdList, paramId);
      //     return;
      //   }
      // });
      // if (data.children && data.children.length > 0) {
      //   let i = 0;
      //   while (data.children[i]) {
      //     this.delParamsId(data.children[i].paramId, data.children[i]);
      //     i++;
      //   }
      // }
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
  },
  created() {
    this.init();
  },
  // destroyed(){
  //   sessionStorage.removeItem("dataSetInfo")
  // }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_workbench_public_dialog_addService {
  .content {
    // background: $base_white;
    //   padding: 20px 24px;
    margin: 16px;
  }
}
</style>
