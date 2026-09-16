<template>
  <div class="aop_tradedesign_comps_apimgmt_case_form_add">
    <CaseForm ref="addForm" :type="type" :arsId="arsId" :apiServiceType="apiServiceType"></CaseForm>
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
import { getLocalStorage } from "@m/utils/localStorage";
export default {
  mixins: [mixin],
  components: {
    PageFooter,
    CaseForm,
  },
  props: {
    apiId: {
      type: String,
      default: () => "",
    },
    sceneId: {
      type: String,
      default: () => "",
    },
    arsId: {
      type: String,
      default: () => "",
    },
    apiServiceType: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      dataObj: {},
      type: "add",
      recordDataList: [],
      caseCondition: []
    };
  },
  methods: {
    handleCancel() {
      this.$emit("toApiView",this.apiId)
    },
    // 提交
    confirm() {
      const form = this.$refs.addForm.$refs.form;
      const data = this.$refs.addForm.formData;
      const levelList = this.$refs.addForm.levelList
      this.recordDataList =  this.restoreList(JSON.parse(JSON.stringify(this.$refs.addForm.conditionList)))
      this.caseCondition =  this.restoreList(JSON.parse(JSON.stringify(this.$refs.addForm.headerData)))
      form.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const d = levelList.some((item) => {return item.caseLevel == data.level})
        if(d) {
          const p = {
            serviceId: data.serviceId,
            oldLevel: data.level,
            level: this.$refs.addForm.levelMax
          }
          const res = await this.rpc.apimgmt.changeLevel(p);
        }
        const params = Object.assign(
          {
            requestMsg: this.$refs.addForm.$refs.requestRow.resData,
            responseMsg: this.$refs.addForm.$refs.responseRow.resData,
            caseConditionBak: JSON.stringify(this.recordDataList),
            caseCondition: JSON.stringify(this.caseCondition),
            createUser: JSON.parse(getLocalStorage("_userInfo")).cstName
          },
          data
        );
        params.positiveAndNegative = "0";
        if(!!this.sceneId) {
          params.sceneId = this.sceneId
        }
        console.log(params);
        const res = await this.rpc.apimgmt.addApiCase(params);
        this.$notify({
          title: "成功",
          message: "新增Mock成功",
          duration: 2000,
          type: "success",
        });
        this.handleCancel()
      });
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
    init() {
      if (this.apiId !== "") {
        this.type = "addByApi";
        this.$nextTick(() => {
          this.$refs.addForm.getApiDetail(this.apiId);
          this.$refs.addForm.getApiMessage(this.apiId);
          this.$refs.addForm.getLevelList(this.apiId);
        });
      } else {
        this.type = "add";
      }
    }
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_case_form_add {
}
</style>
