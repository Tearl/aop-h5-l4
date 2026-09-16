<template>
  <div class="aop_tradedesign_comps_apimgmt_case_form_copy">
    <CaseForm ref="copyForm" type="mod" :arsId="arsId"></CaseForm>
    <PageFooter>
      <div slot="box">
        <el-button @click="handleCancel">返 回</el-button>
        <el-button type="primary" @click="confirm">提 交</el-button>
      </div>
    </PageFooter>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageFooter from "@m/core/components/page_footer";
import CaseForm from "./index";
import { escape2Html } from "@m/utils/html2e";
import { getLocalStorage } from "@m/utils/localStorage";
export default {
  mixins: [mixin],
  components: {
    PageFooter,
    CaseForm,
  },
  data() {
    return {
      dataObj: {},
      paramNameList: [],
      recordDataList: [],
      caseCondition: []
    };
  },
  props: {
    caseId: {
      type: String,
      default: () => "",
    },
    apiId: {
      type: String,
      default: () => "",
    },
    arsId: {
      type: String,
      default: () => "",
    },
  },
  methods: {
    init() {
      this.getData();
    },
    // 详情
    async getData() {
      const params = {
        caseId: this.caseId,
      };
      const res = await this.rpc.apimgmt.getApiCaseDetail(params);
      this.dataObj = res;
      this.$refs.copyForm.formData = {
        caseName: res.caseName,
        serviceId: res.serviceId,
        level: "",
        caseDesc: res.caseDesc,
        serviceName: res.serviceName,
        url: res.serviceCode,
        service: res.serviceCode, //apicode
        isNeed: res.isNeed,
        system: res.system,
        positiveAndNegative: res.positiveAndNegative, //正反Mock
        sgName: res.sgName,
      };
      this.$refs.copyForm.formData.url = res.serviceCode;
      const conditionList = this.caseConditionBakTrasBack(
        JSON.parse(escape2Html(res.caseConditionBak) || "[]")
      );
      this.$refs.copyForm.conditionList = this.disposeList(conditionList);

      const headerData = this.caseConditionBakTrasBack(
        JSON.parse(escape2Html(res.caseCondition) || "[]")
      );
      this.$refs.copyForm.headerData = this.disposeList(headerData);

      this.$refs.copyForm.requestMsg = res.requestMsg;
      this.$refs.copyForm.responseMsg = res.responseMsg;
      this.$refs.copyForm.getLevelList(res.serviceId);
      this.getApiDetail()
    },
    // 获取详情
    async getApiDetail(e) {
      const params = {
        apiId: this.dataObj.serviceId,
        paramDirection: "0",
      };
      const res = await this.rpc.apimgmt.getApiDetail(params);
      //获取可选key值
      const selectVal = res.puApiParams.map((item) => {
          item.type = item.paramKey;
          item.value = item.paramKey;
          item.key = item.paramType;
          return item
      });
      this.$refs.copyForm.selectValData = selectVal;

      const headerSelectValData = res.httpHeaderParams.map((item) => {
          item.type = item.paramKey;
          item.value = item.paramKey;
          item.key = item.paramType;
          return item
      });
      this.$refs.copyForm.headerSelectValData = headerSelectValData;
    },
    // 提交
    confirm() {
      const form = this.$refs.copyForm.$refs.form;
      const data = this.$refs.copyForm.formData;
      const levelList = this.$refs.copyForm.levelList
      this.recordDataList = this.restoreList(JSON.parse(JSON.stringify(this.$refs.copyForm.conditionList)));
      this.caseCondition =  this.restoreList(JSON.parse(JSON.stringify(this.$refs.copyForm.headerData)))
      form.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const d = levelList.some((item) => {return item.caseLevel == data.level})
        if(d) {
          const p = {
            serviceId: data.serviceId,
            oldLevel: data.level,
            level: this.$refs.copyForm.levelMax
          }
          const res = await this.rpc.apimgmt.changeLevel(p);
        }
        const params = Object.assign(data, {
          requestMsg: this.$refs.copyForm.$refs.requestRow.resData,
          responseMsg: this.$refs.copyForm.$refs.responseRow.resData,
          caseConditionBak: JSON.stringify(this.recordDataList),
          caseCondition: JSON.stringify(this.caseCondition),
          createUser: JSON.parse(getLocalStorage("_userInfo")).cstName
        });
        await this.rpc.apimgmt.addApiCase(params);
        this.$notify({
          title: "成功",
          message: "复制Mock成功",
          duration: 2000,
          type: "success",
        });
        this.$emit("toApiView",this.apiId)
      });
    },
    handleCancel() {
      this.$emit("toApiView",this.apiId)
    },
    // 处理数组
    disposeList(arrs) {
      arrs.forEach((item, index) => {
        if (item.paramType == "List" || item.paramType == "Object") {
          arrs[index].paramValue = this.caseConditionBakTrasBack(
            JSON.parse(JSON.stringify(item.paramValue))
          );
          arrs[index].paramValue = this.disposeList(
            JSON.parse(JSON.stringify(item.paramValue))
          );
          arrs[index].children = item.paramValue;
          arrs[index].paramValue = "";
        }
      });
      return arrs;
    },
    // 还原数组
    restoreList(arrs) {
      arrs.forEach((item,index) => {
         if((item.paramType == "List" || item.paramType == "Object") && item.children) {
           arrs[index].paramValue = this.restoreList(JSON.parse(JSON.stringify(item.children)))
           delete item.children
         } else {
           delete item.children
         }
      })
      arrs = this.canConditionTrans(JSON.parse(JSON.stringify(arrs)))
      console.log(arrs)
      return arrs
    },
    canConditionTrans(e) {
      const list = []
      for(let i in e) {
        let name = e[i].paramName
        list.push({[name]:e[i]})
      }
      return list
    },
    caseConditionBakTrasBack(e) {
      const list = [];
      for (let i in e) {
        for (let k in e[i]) {
          list.push(e[i][k]);
        }
      }
      return list;
    },
    labelClick() {
      this.$router.push({
        path: "/aop_tradedesign/apimgmt/caseList",
      });
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_case_form_copy {
}
</style>
