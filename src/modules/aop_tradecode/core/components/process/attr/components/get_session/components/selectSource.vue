<template>
  <div class="aop_tradecode_comps_design_attr_get_sessionn_attr_select_source">
    <PageDialog
      :dialogTitle="'选择参数'"
      :dialogVisiable="dialogVisible"
      dialogWidth="600px"
      @closeDialog="closeDialog"
    >
      <div slot="box" class="container">
        <el-form
          :model="formData"
          :rules="rules"
          ref="form"
          label-position="right"
          label-width="127px"
          class="edit_form"
        >
          <div class="form_info">
            <el-form-item label="来源:" prop="actionId">
              <el-select
                v-model="formData.actionId"
                placeholder="请选择来源"
                filterable
                @change="selectChange('actionId', $event)"
              >
                <el-option
                  v-for="item in assignedSourceOptions"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="参数" prop="paramKey">
              <el-select
                v-model="formData.paramKey"
                placeholder="请选择参数"
                filterable
                @change="selectChange('paramKey', $event)"
                :disabled="!formData.actionId"
              >
                <el-option
                  v-for="item in assignedSourceKeyOptions"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
      >
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
    dataList: {
      type: Array,
      default: () => [],
    },
    currentObj: {
      type: Object,
      default: () => ({}),
    }
  },
  data() {
    return {
      dialogVisible: false,
      paramsDetail: {},
      currentRow: {}, // 原表格行数据的引用
      isApSource: "",
      cpnList: [],
      formData: {
        actionId: "",
        paramKey: "",
        apSource: "",
        paramValue: "",
      },
      rules: {
        paramKey: [
          {
            required: true,
            trigger: "change",
            validator: this.validator,
          },
        ],
      },
      tableData: [],
      paramDataList: [],
      dictionaryData: [],
      currentRadio: "",
      compositeIdMapToParamList: {},
      currentKey: "",
    };
  },
  computed: {
    assignedSourceOptions() {
      const prev = ["assignedSource1", "assignedSource2"].includes(this.currentKey) ? [
        { label: "当前4b交易", value: this.currentServObj?.svcId, svcId: this.currentServObj?.svcId },
        { label: "固定值", value: "", svcId: "" },
      ] : [ { label: "当前4b交易", value: this.currentServObj?.svcId, svcId: this.currentServObj?.svcId } ]
      // if (["assignedSource1", "assignedSource2"],includes(this.currentKey)) {
        
      // }
      return this.getDataList().reduce((prev, data) => {
        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType) && data.compositeId) {
          prev.push({
            label: data.actionName,
            // value: data.actionOwnId,
            svcId: data.actionOwnId,
            value: data.compositeId,
          })
        }
        return prev
      }, prev)
    },
    assignedSourceKeyOptions() {
      const compositeId = this.formData?.actionId
      const item = this.getDataList().find(data => data.compositeId && data.compositeId == compositeId)
      if ((item || compositeId == this.currentServObj?.svcId)) {
        let paramList = this.compositeIdMapToParamList[compositeId]?.paramList || []
        return paramList.map(param => {
          param.label = param.paramCName
          param.value = this.packageParamKey(param, paramList)
          return param
        })
      } else {
        return []
      }
    },
    isFixedValue() {
      return this.formData.apSource == "10"
    }
  },
  inject: ["getDataList"],
  methods: {
    validator(rule, value, callback) {
      if (rule.field == "paramKey") {
        if (this.formData.apSource != "10") {
          if (!value) {
            return callback("不能为空")
          } else {
            callback()
          }
        } else {
          if (!this.formData.paramValue) {
            return callback("固定值不能为空")
          } else if (!(/^[+-]?(\d|([1-9]\d+))(\.\d+)?$/.test(this.formData.paramValue))) {
            callback("只能输入数字")
          } else {
            callback()
          }
        }
      }
    },
    isFixedValue() {
      return this.formData?.apSource == "10"
    },
    async showDialog(data) {
      console.log("showDialog", data)
      // this.currentKey = key
      this.currentRow = data
      if (data.cacheKey) this.formData = JSON.parse(data.cacheKey)
      if (this.formData?.actionId) {
        await this.updateCompositeIdMapToParamList()
      }
      // this.formData = JSON.parse(JSON.stringify(data[key]))
      // if (data[key]?.apSource != "10") {
      //   await this.updateCompositeIdMapToParamList()
      // }
      this.dialogVisible = true;
    },
    async updateCompositeIdMapToParamList() {
      const compositeId = this.formData?.actionId
      // 新拖进来的组件
      if (!this.compositeIdMapToParamList[compositeId]) {
        const data = this.getDataList().find((item) => item.compositeId == compositeId)
        this.compositeIdMapToParamList[compositeId] = {
          svcId: data.actionOwnId,
          svcNm: data.actionName,
          paramList: [],
        }
      }
      const item = this.compositeIdMapToParamList[compositeId]
      const apiId = item?.svcId
      if (compositeId && apiId && !(this.compositeIdMapToParamList[compositeId]?.paramList?.length)) {
        const res = await this.rpc.d4.queryL5ParamAndRuleDefinitions({
          d4StusCd: "1",
          blngtoTyp: "10",
          apiId: apiId,
          d4bApiId: this.currentServObj?.svcId || this.currentServObj.apiId,
          bizDomainNo: this.currentServObj.bizLineId,
        })
        this.compositeIdMapToParamList[compositeId].paramList = res.paramList
      }
    },
    closeDialog() {
      this.formData = {
        actionId: "",
        paramKey: "",
        apSource: "",
        paramValue: "",
      }
      this.$refs.form.resetFields();
      // this.formData.actionId = ""
      // this.dictionaryData = []
      // this.currentRadio = ""
      this.dialogVisible = false
    },
    initParams(data, params) {
      console.log(data, params);
      console.time("render耗时");
      this.currentRow = params
      this.isApSource = params.apSource
      if(this.isApSource == "20") {
        this.$nextTick(() => {
          this.cpnList = this.dataList.filter(item => {
            return item.actionId != this.currentObj.actionId && ["D4bAction", "D5SelfAction", "D5LinkAction", "dataDealAction"].indexOf(item.actionType) > -1
          })
          this.dialogVisible = true
        })
      } else {
        this.paramDataList = data.puApiParams.filter(
          (item) => item.paramDirection === (params.apSource == "10" ? "3" : (params.apSource == "00" ? "0" : "1"))
        );
        this.dictionaryData = reList(this.paramDataList);
        this.dialogVisible = true
      }
      this.$nextTick(() => {
        console.timeEnd("render耗时");
      });
    },
    confirm() {
      this.$refs.form.validate(async (valid) => {
        console.log("confirm", this.formData, this.currentRow)
        if (!valid) return;
        const data = JSON.parse(JSON.stringify(this.formData))
        this.$emit("confirm", data)
        this.closeDialog()
      });
    },
    async selectChange(type, e) {
      console.log("selectChange", type, e)
      if (type == "actionId") {
        const item = this.assignedSourceOptions.find(item => item.value == e)
        // let obj = this.formData
        if (item) {
          this.formData.actionId = e;
          this.formData.actionNm = item.label;
          this.formData.paramKey = this.formData.paramNm = this.formData.paramType =  ""
          this.formData.apSource = e == this.currentServObj?.svcId ? "00" : "20"
          this.formData.paramValue = ""
          this.paramsDetail = {}
        }
        if (e) {
          await this.updateCompositeIdMapToParamList()
        }
      } else if (type == "paramKey") {
        const item = this.assignedSourceKeyOptions.find(item => item.value == e)
        if (item) {
          this.formData.paramKey = e;
          this.formData.paramNm = item.paramCName;
          this.formData.paramType = item.paramType;
          this.paramsDetail = item
        }
      }
    },
    /**
     * @description: 把参数key组装成 parentKey.key的形式
     * @param {*} param 当前进行拼接的参数
     * @param {*} paramList 参数列表
     * @param {*} paramKey 累计拼接的paramKey
     * @return {*}
     */
    packageParamKey(param, paramList, paramKey = "") {
      const { paramOrder, paramParentId } = param
      if (paramOrder != paramParentId && paramParentId) {
        const _param = paramList.find(item => item.paramOrder == paramParentId)
        const _paramKey = `${param.paramKey}${paramKey ? "." : ""}${paramKey}`
        return this.packageParamKey(_param, paramList, _paramKey)
      } else {
        return `${param.paramKey}${paramKey ? "." : ""}${paramKey}`
      }
    },
    init() {
      // this.currentServObj?.svcId = this.$route.query.transId || this.$route.query.apiId
      const dataList = this.getDataList()
      const { apiName, puApiParams} = this.currentServObj
      this.compositeIdMapToParamList = dataList.reduce((prev, data) => {
        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType) && data.compositeId) {
          // const svcId = data.conf.find(item => item.name == "svcId").value
          const compositeId = data.compositeId
          if (!this.compositeIdMapToParamList[compositeId]) {
            prev[compositeId] = {
              svcId: data.actionOwnId,
              svcNm: data.actionName,
              paramList: [],
            }
          }
        }
        return prev
      }, {[this.currentServObj?.svcId]: { svcNm: apiName, svcId: this.currentServObj?.svcId, paramList: puApiParams}})
    }
  },
  created() {
    this.init()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_get_sessionn_attr_select_source {
  .container {
    padding: 16px;
  }
  .edit_form {
    margin-top: 10px;
    @include form;
  }
  .table_style ::v-deep .el-table__header-wrapper .el-checkbox {
    display: none;
  }
}
</style>
