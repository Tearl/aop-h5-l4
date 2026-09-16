<template>
  <div class="aop_tradecode_comps_design_attr_judge_attr_select">
    <PageDialog
      :dialogWidth="'56.3%'"
      :dialogTitle="'选择参数来源及变量'"
      :dialogVisiable="dialogVisible"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <el-form
          :rules="rules"
          :model="formData"
          ref="form"
          label-position="right"
          label-width="130px"
          class="edit_form"
        >
          <div class="form_info">
            <el-form-item label="输出组件名称" prop="actionName">
              <el-select
                v-model="formData.actionId"
                placeholder="请选择输出组件"
                filterable
                clearable
                @change="selectChange"
              >
                <el-option
                  v-for="item in cpnList"
                  :label="item.actionName"
                  :key="item.actionId"
                  :value="item.actionId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="参数变量名称" prop="paramKey">
              <el-select
                v-model="formData.paramKey"
                placeholder="请选择参数变"
                filterable
                clearable
                :disabled="!formData.actionName"
              >
                <el-option
                  v-for="item in paramList"
                  :label="item.paramCName"
                  :key="item.paramId"
                  :value="item.paramKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import PageDialog from "@m/core/components/page_dialog";
import { mixList, reList } from "@m/utils/paramTree";

export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    isRead: {
      type: Boolean,
      default: () => false,
    },
    dataList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      formData: {
        actionId: "", // 输出组件id
        actionName: "", // 输出组件名称
        paramKey: "", // 参数变量名称
      },
      //定义规则
      rules: {
        actionId: [{ required: true, trigger: "blur", message: "输出组件名称不能为空" }],
        actionName: [{ required: true, trigger: "blur", message: "输出组件名称不能为空" }],
        paramKey: [{ required: true, trigger: "blur", message: "参数变量名称不能为空" } ],
      },
      cpnList: [],
      currentRow: {},
      paramList: [],
      operate: ""
    };
  },
  methods: {
    showDialog(row, currentObj, operate) {
      console.log("showDialog", row, currentObj)
      this.currentRow = row
      this.getDataList()
      this.operate = operate
      this.$nextTick(() => {
        this.cpnList = this.dataList.filter(item => {
          return item.actionId != currentObj.actionId && ["D4bAction", "D5SelfAction", "D5LinkAction", "dataDealAction","newD5Action"].indexOf(item.actionType) > -1
        })
        console.log(this.cpnList);
        this.dialogVisible = true
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.formData = {
        actionId: "", // 输出组件id
        actionName: "", // 输出组件名称
        paramCName: "", // 参数变量名称
      }
    },
    closeDialog() {
      this.resetForm();
      this.dialogVisible = false;
    },
    confirm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        const list = this.paramList.filter((item) => item.paramKey == this.formData.paramKey)
        if(this.operate == "d") {
          this.currentRow.paramKey = this.formData.paramKey
          this.currentRow.paramName = list[0].paramCName
          this.currentRow.paramType = list[0].paramType
          this.currentRow.paramLength = list[0].paramLength
          this.currentRow.paramValue = `${this.formData.actionName}.${list[0].paramCName}`
        } else if( this.operate == "1") {
          this.currentRow.paramKey1 = this.formData.paramKey
          this.currentRow.paramName1 = list[0].paramCName
          this.currentRow.paramType1 = list[0].paramType
          this.currentRow.paramLength1 = list[0].paramLength
          this.currentRow.paramValue1 = `${this.formData.actionName}.${list[0].paramCName}`
        } else {
          this.currentRow.paramKey2 = this.formData.paramKey
          this.currentRow.paramName2 = list[0].paramCName
          this.currentRow.paramType2 = list[0].paramType
          this.currentRow.paramLength2 = list[0].paramLength
          this.currentRow.paramValue2 = `${this.formData.actionName}.${list[0].paramCName}`
        }
        this.resetForm();
        this.dialogVisible = false;
      });
    },
    getDataList() {
      this.$emit("getDataList")
    },
    selectChange(e) {
      console.log("selectChange", e)
      this.formData.paramCName = ""
      const target = this.cpnList.find(item => item.actionId == e)
      this.formData.actionName = target.actionName
      if (target.actionType == "dataDealAction") {
        this.getDataDealOutputParmas(target)
      } else {
        this.formData.actionName = target.actionName
        this.getServiceCpnDefaultParams(target)
      }
    },
    getDataDealOutputParmas(e) {
      console.log("getDataDealOutputParmas", e)
      this.paramList = e.paramList.filter((item) => item.paramDirection == "1")
    },
    async getServiceCpnDefaultParams(e) {
      console.log("getServiceCpnDefaultParams", e)
      const params = {
        d4StusCd: "1",
        blngtoTyp: "10",
        apiId: e.conf.find(item => item.name == "svcId").value,
        d4bApiId: this.currentServObj.apiId
      }
      const res = await this.rpc.d4.getServiceCpnDefaultParams(params)
      // this.inputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == "0"));
      this.paramList = res.paramList.filter((item) => item.paramDirection == "1")
    },
  },
  created() {
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_judge_attr_select {
  .edit_form {
    margin-top: 10px;
    @include form;
  }
}
</style>
