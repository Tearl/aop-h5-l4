<template>
  <div class="aop_tradedesign_comps_dictionary_define_dialog_addParams">
    <PageDialog
      :dialogTitle="dialogTitle"
      :dialogVisiable="dialogVisible"
      dialogWidth="90%"
      @closeDialog="closeDialog"
      class="dialog"
    >
      <div slot="box">
        <SerBasic
          :isEdit="true"
          :serviceVisible="false"
          ref="serBasicRef"
        ></SerBasic>
      </div>
      <div slot="footer">
        <el-button @click.native="closeDialog">取 消</el-button>
        <el-button type="primary" @click.native="saveParams">确定</el-button>
      </div>
    </PageDialog>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";
import SerBasic from "../../service_list/basic"; //添加服务弹框
import { unduplicated, setSerialNumber } from "@m/utils/array";
import { mixList, reList } from "@m/utils/paramTree";
import { getSessionStorage } from "@m/utils/localStorage.js";
export default {
  mixins: [mixin],
  components: {
    PageDialog,
    SerBasic,
  },
  props: {},
  data() {
    return {
      dialogTitle: "添加服务",
      dialogVisible: false,
      apiObj: {},
      servObj:{},
      paramsIdList:[]
    };
  },
  methods: {
    showDialog(data) {
      if (data) {
        this.dialogTitle = "编辑服务";
        this.apiObj = data;
        this.getDetail();
        this.getParamsList();
      } else this.dialogTitle = "添加服务";
      this.dialogVisible = true;
      console.log(data, "编辑");
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    async getParamsList() {
      const params = {
        apiId: this.apiObj.apiId,
      };
      const res = await this.rpc.dicmgmtDefine.getParamsList(params);
      this.paramsIdList = res.d5UseDataSetRelList;
    },
    async getDetail() {
      const res = await this.rpc.d4.getD4bServiceInfo({
        svcId:this.apiObj.apiId,
        dsgnFlg:this.apiObj.apiState
      })
      console.log(res,"res -->")
      this.$refs.serBasicRef.basicData = res; 
      let {d4L5SvcList,d4UseDataSetRelList,puApiParams,svcCd,svcDesc,svcId,svcNm,svcTpCd,svcVersionNo,...tempObj} = res;
      Object.assign(this.servObj, tempObj);
      console.log("obj2", this.servObj);
    },
    saveParams() {
      const _this_info = this.$refs.serBasicRef.$refs.detailInfoRef.detailInfo;
      const _this_rule = this.$refs.serBasicRef.$refs.bizRuleRef.$refs.ruleTableRef;
      const _this_inputParams = this.$refs.serBasicRef.$refs.inputParamsRef;
      const _this_outputParams = this.$refs.serBasicRef.$refs.outputParamsRef;
      const ruleInfo = this.$refs.serBasicRef.ruleInfo;
      console.log(_this_inputParams.sendData,_this_outputParams.receiveData,_this_info,this.paramsIdList,ruleInfo,"ssss");
      this.$refs.serBasicRef.$refs.detailInfoRef.$refs.formBasic.validate(async (valid) =>{
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        if (!this.paramsIdList.length)  return this.$message.error("请从数据集中选择字段");
        //去重
        const i = this.getOnly(_this_inputParams.sendData);
        if (i.length > 0)
          return this.$message.error(
            "输入参数的参数key: " + i[0].paramKey + "不能重复!请检查"
          );
        const l = this.getOnly(_this_outputParams.receiveData);
        if (l.length > 0)
          return this.$message.error(
            "输出参数的参数key: " + l[0].paramKey + "不能重复，请检查"
          );

        //转一维数组
        let puApiParams = JSON.parse(
          JSON.stringify(
            mixList(_this_inputParams.sendData, "children").concat(
              mixList(_this_outputParams.receiveData, "children")
            )
          )
        );
        const listFlag = puApiParams.filter((item) => {
          return item.paramKey == "" || item.paramCName == "";
        });
        if (listFlag.length > 0)
          return this.$message.error("参数Key及参数名称不能为空！");
        //传参
        const params = {
          dataSetNo: this.apiObj.dataSetNo,
          // apiId: form.svcTyp,
          apiName: _this_info.svcNm,
          apiCode: _this_info.svcCd,
          apiDesc: _this_info.svcDesc,
          // apiServiceParticipater: form.apiServiceParticipater,
          apiServiceType: _this_info.svcTpCd,
          // apiGroupId: this.groupId,
          // arsId: this.arsId,
          puApiParams: puApiParams,
          ...this.servObj,
          businessRuleList: [],
          d5UseDataSetRelList: this.paramsIdList
        };
        console.log("确认", params);
        const res = await this.rpc.dicmgmtDefine.editL5Serv(params);
        if (ruleInfo.ruleDefnId) {
          _this_rule.editBusinessRule(this.ruleInfo);
        } else {
          _this_rule.addBusinessRule(this.ruleInfo);
        }
        this.$notify({
          title: "成功",
          message: "编辑成功",
          duration: 2000,
          type: "success",
        });
      })
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
  created() {},
  mounted() {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.aop_tradedesign_comps_dictionary_define_dialog_addParams {
}
</style>