<template>
  <div class="aop_tradedesign_comps_apimgmt_case_form_mod">
    <CaseForm ref="modForm" type="mod" :arsId="arsId"></CaseForm>
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
export default {
  mixins: [mixin],
  components: {
    PageFooter,
    CaseForm,
  },
  data() {
    return {
      dataObj: {},
      caseId: "",
      recordDataList: [],
      paramNameList: [],
      caseCondition: [],
      oldLevel: ""
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
      this.$refs.modForm.formData = res;
      this.$refs.modForm.oldLevel = res.level
      this.oldLevel = res.level
      const conditionList = this.caseConditionBakTrasBack(
        JSON.parse(escape2Html(res.caseConditionBak) || "[]")
      );
      this.$refs.modForm.conditionList = this.disposeList(conditionList);

      const headerData = this.caseConditionBakTrasBack(
        JSON.parse(escape2Html(res.caseCondition) || "[]")
      );
      this.$refs.modForm.headerData = this.disposeList(headerData);

      this.$refs.modForm.requestMsg = res.requestMsg;
      const requestMsgBody = JSON.parse(escape2Html(res.requestMsg)).body;
      this.$refs.modForm.responseMsg = res.responseMsg;
      this.getApiDetail()
      this.getLevelList()
    },
    // 获取优先级列表
    async getLevelList(e) {
      const params = {
        apiId: this.dataObj.serviceId,
      };
      const res = await this.rpc.apimgmt.getLevelList(params);
      this.$refs.modForm.levelList = res.levelList
      let levelMax = ""
      if (res.levelList.length > 0) {
        levelMax =
          Math.max.apply(
            Math,
            res.levelList.map(function (item) {
              return item.caseLevel;
            })
          ) +
          "";
      } else {
        levelMax = "1";
      }
      for (let i = 0; i < levelMax; i++) {
        this.$refs.modForm.levelSelectList.push({ type: i + 1 + "", value: i + 1 + "" });
      }
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
      this.$refs.modForm.selectValData = selectVal;

      const headerSelectValData = res.httpHeaderParams.map((item) => {
          item.type = item.paramKey;
          item.value = item.paramKey;
          item.key = item.paramType;
          return item
      });
      this.$refs.modForm.headerSelectValData = headerSelectValData;
    },
    // 提交
    confirm() {
      const form = this.$refs.modForm.$refs.form;
      const data = this.$refs.modForm.formData;
      const levelList = this.$refs.modForm.levelList
      this.recordDataList = this.restoreList(JSON.parse(JSON.stringify(this.$refs.modForm.conditionList)));
      this.caseCondition =  this.restoreList(JSON.parse(JSON.stringify(this.$refs.modForm.headerData)))
      form.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const d = levelList.some((item) => {return item.caseLevel == data.level})
        if(d && this.oldLevel !== data.level) {
          const p = {
            serviceId: data.serviceId,
            oldLevel: data.level,
            level: this.$refs.modForm.oldLevel,
          }
          const res = await this.rpc.apimgmt.changeLevel(p);
        }
        const params = Object.assign(data, {
          requestMsg: this.$refs.modForm.$refs.requestRow.resData,
          responseMsg: this.$refs.modForm.$refs.responseRow.resData,
          caseConditionBak: JSON.stringify(this.recordDataList),
          caseCondition: JSON.stringify(this.caseCondition),
        });
        params.caseId = this.caseId;
        const res = await this.rpc.apimgmt.modApiCase(params);
        this.$notify({
          title: "成功",
          message: "编辑Mock成功",
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
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_case_form_mod {
}
</style>
