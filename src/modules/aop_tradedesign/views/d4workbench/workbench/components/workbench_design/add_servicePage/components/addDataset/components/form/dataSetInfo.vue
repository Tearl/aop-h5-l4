<template>
  <div class="aop_tradedesign_dic_cmps_data_set_form_base_info">
    <el-form
      ref="formRef"
      :model="dataSetForm"
      :rules="rules"
      label-width="130px"
      size="small"
      class="edit_form"
    >
      <div class="header_title">数据集基本信息</div>
      <el-form-item label="数据集名称：" prop="dataSetNm">
        <el-input placeholder="请输入数据集名称" maxlength="50" v-model="dataSetForm.dataSetNm" :disabled="addShow"></el-input>
      </el-form-item>
      <!-- <el-form-item label="所属域：" prop="beltLine">
        <el-select placeholder="请选择所属域" v-model="dataSetForm.beltLine"  :disabled="addShow || beltLineTrue">
          <el-option
            v-for="(item, index) in departmentList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="所属域：" prop="beltLine">
        <el-select placeholder="请选择所属域" v-model="dataSetForm.beltLine"  :disabled="addShow || beltLineTrue">
          <el-option
            v-for="(item, index) in departmentList"
            :key="index.bizDomainNo"
            :label="item.bizDomainName"
            :value="item.bizDomainNo"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类：" prop="classifyId">
        <el-select placeholder="请选择分类" v-model="dataSetForm.classifyId" :disabled="addShow">
          <el-option
            v-for="(item, index) in volumeList"
            :key="index"
            :label="item.label"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据集描述：" prop="dataSetDesc">
        <el-input
          type="textarea"
          :rows="3"
          v-model="dataSetForm.dataSetDesc"
          clearable
          placeholder="请输入描述"
          maxlength="500"
          :disabled="addShow"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
export default {
  mixins: [mixin],
  props: {
    type: {
      type: String,
      default: "read"
    },
    addShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  data() {
    return {
      dataSetForm: {
        dataSetNm: "",
        dataSetDesc: "",
        classifyId: "",
        beltLine: ""
      },
      rules: {
        dataSetNm: [
          { required: true, trigger: "blur", message: "请输入数据集名称" }
        ],
        beltLine: [{ required: true, trigger: "change", message: "请选择部" }],
        classifyId: [{ required: true, trigger: "change", message: "请选择分类" }]
      },
      //所属部下拉框
      departmentList: [
        // { value: "0", label: "对公业务线" },
        // { value: "1", label: "对私业务线" },
        // { value: "2", label: "营销业务线" }
      ],
      //所属册下拉框
      volumeList: [
        { name: "1", label: "用户" },
        { name: "2", label: "机构" },
        { name: "3", label: "渠道" },
        { name: "4", label: "产品" },
        { name: "5", label: "合约" },
        { name: "6", label: "系统" }
      ],
      bizLineId:"",
      beltLineObj:{
        "对公业务域":"0",
        "对私业务域":"1",
        "营销业务域":"2",
      },
      beltLineTrue:false,
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.bizLineId = this.$route.query.bizLineId;
      this.beltLineTrue  = this.beltLineObj[this.bizLineId]  !== "" ?  true : false;
      // console.log(this.dataSetForm.bizLine,'this.dataSetForm.bizLine')
      this.queryBizDomainList();
    },
    reset() {
      this.$refs.formRef.resetFields();
    },
    resetForm() {
      this.dataSetForm = {
        dataSetNm: "",
        dataSetDesc: "",
        classifyId: "",
        beltLine: ""
      };
      this.$refs.formRef.resetFields();
    },
    async queryBizDomainList(){
      const res = await this.rpc.downloadDesign.queryBizDomainList();
      this.departmentList = res.businessDomainLists;
      // console.log(departmentList,"departmentListdepartmentList")
    }
  },
  filters: {
    ...filters
  }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_cmps_data_set_form_base_info {
  ::v-deep .el-form-item__label {
    width: 112px !important;
  }
  ::v-deep .el-form-item__content {
    margin-left: 112px !important;
  }
  ::v-deep .el-form-item .el-form-item__label {
    color: #333333 !important;
    font-weight: 400 !important;
  }
  .edit_form {
    @include form;
    .header_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #131313;
      letter-spacing: 0;
      margin-bottom: 20px;
      font-weight: 600;
    }
    /deep/ .el-input,
    /deep/ .el-textarea__inner {
      width: 700px;
    }
    .no_before {
      ::v-deep .el-form-item__label::before {
        content: "";
      }
    }
  }
  .status_span {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    letter-spacing: 0;
    padding: 4px 16px;
    margin-left: 12px;
  }
  .status_0 {
    color: #ff5f5f;
    background: #ffefee;
  }
  .status_1 {
    color: #36d542;
    background: #e5ffe7;
  }
  .status_2 {
    color: #ff9104;
    background: #fff4e5;
  }
}
</style>