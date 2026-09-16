<template>
  <div class="aop_tradedesign_comps_apimgmt_case_form_addr">
    <CaseForm ref="addrForm" type="addRev"></CaseForm>
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
  props: {
    caseId: {
      type: String,
      default: () => "",
    },
    apiId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      // 导航栏参数
      breadcrumbs: [
        {
          label: "Mock管理",
          operate: "list",
        },
        {
          label: "新增反Mock",
        },
      ],
      dataObj: {},
      caseCondition: []
    };
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
      this.$refs.addrForm.formData = {
        caseName: "",
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
      let conditionList = this.caseConditionBakTrasBack(
        JSON.parse(escape2Html(res.caseConditionBak) || "[]")
      );
      // conditionList = conditionList.map((item) => {
      //   item.isNeed = "1"
      //   return item
      // })
      this.$refs.addrForm.conditionList = this.disposeList(conditionList);

      let headerData = this.caseConditionBakTrasBack(
        JSON.parse(escape2Html(res.caseCondition) || "[]")
      );
      this.$refs.addrForm.headerData = this.disposeList(headerData);

      this.$refs.addrForm.requestMsg = res.requestMsg;
      this.$refs.addrForm.responseMsg = res.responseMsg;
      this.$refs.addrForm.getLevelList(res.serviceId);
    },
    // 提交
    confirm() {
      const form = this.$refs.addrForm.$refs.form;
      const data = this.$refs.addrForm.formData;
      const levelList = this.$refs.addrForm.levelList;
      const recordDataList = this.restoreList(JSON.parse(JSON.stringify(this.$refs.addrForm.conditionList)));
      this.caseCondition =  this.restoreList(JSON.parse(JSON.stringify(this.$refs.addrForm.headerData)))
      form.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const d = levelList.some((item) => {
          return item.caseLevel == data.level;
        });
        if (d) {
          const p = {
            serviceId: data.serviceId,
            oldLevel: data.level,
            level: this.$refs.addrForm.levelMax,
          };
          const res = await this.rpc.apimgmt.changeLevel(p);
        }
        const params = Object.assign(data, {
          requestMsg: this.$refs.addrForm.$refs.requestRow.resData,
          responseMsg: this.$refs.addrForm.$refs.responseRow.resData,
          caseConditionBak: JSON.stringify(recordDataList),
          caseCondition: JSON.stringify(this.caseCondition),
          createUser: JSON.parse(getLocalStorage("_userInfo")).cstName,
        });
        params.positiveAndNegative = "1";
        params.url = data.url;
        params.fatherID = this.caseId;
        params.apicode = data.service;
        const res = await this.rpc.apimgmt.addApiCase(params);
        this.$notify({
          title: "成功",
          message: "新增反Mock成功",
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
    caseConditionBakTrasBack(e) {
      const list = [];
      for (let i in e) {
        for (let k in e[i]) {
          list.push(e[i][k]);
        }
      }
      return list;
    },
    // 还原数组
    restoreList(arrs,id) {
      arrs = arrs.filter((item) => {
        return item.isNeed === "1";
      });
      arrs.forEach((item, index) => {
        if (
          (item.paramType == "List" || item.paramType == "Object") &&
          item.children
        ) {
          arrs[index].paramOrder = index + 1 + ""
          arrs[index].paramValue = this.restoreList(
            JSON.parse(JSON.stringify(item.children)),arrs[index].paramOrder
          );
          delete item.children;
        } else {
          arrs[index].paramOrder = id ? id + "." + (index + 1) : index + 1 + ""
          delete item.children;
        }
      });
      arrs = this.canConditionTrans(JSON.parse(JSON.stringify(arrs)));
      return arrs;
    },
    canConditionTrans(e) {
      const list = [];
      for (let i in e) {
        let name = e[i].paramName;
        list.push({ [name]: e[i] });
      }
      return list;
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_case_form_addr {
}
</style>
