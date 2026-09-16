<template>
  <div class="aop_tradedesign_dic_cmps_data_set_form_base_info">
    <el-form
      ref="formRef"
      :model="dataSetForm"
      :rules="rules"
      label-width="130px"
      class="edit_form"
    >
      <div class="header_title">基本信息</div>
      <el-form-item label="名称" prop="dataSetNm">
        <div class="dataSet">
          <el-input
            placeholder="请输入名称"
            v-model.trim="dataSetForm.dataSetNm"
          ></el-input>
          <span
            :class="['status_span', `status_${dataSetForm.statusCd}`]"
            v-if="type == 'edit'"
            >{{ dataSetForm.statusCd | dataStatus }}</span
          >
          <!-- <el-button v-if="type !== 'edit'" type="primary" class="gr10" @click="showSelectDialog">从元数据选择</el-button> -->
        </div>
      </el-form-item>
      <el-form-item label="所属域" prop="beltLine">
        <el-select
          placeholder="请选择所属域"
          v-model="dataSetForm.beltLine"
          :disabled="type == 'edit'"
        >
          <el-option
            v-for="(item, index) in departmentList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="classifyId">
        <el-select
          placeholder="请选择分类"
          v-model="dataSetForm.classifyId"
        >
          <el-option
            v-for="(item, index) in volumeList"
            :key="index"
            :label="item.label"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="dataSetDesc">
        <el-input
          type="textarea"
          :rows="3"
          v-model="dataSetForm.dataSetDesc"
          clearable
          placeholder="请输入描述"
          :maxlength="length"
        />
      </el-form-item>
    </el-form>
    <SelectFromMateData ref="selectFromMateDataRef" @confirmData="confirmData"></SelectFromMateData>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import SelectFromMateData from "../dialog/selcFromMateData";
export default {
  mixins: [mixin],
  components:{
    SelectFromMateData
  },
  props: {
    type: {
      type: String,
      default: "read",
    },
  },
  computed: {},
  data() {
    return {
      dataSetForm: {
        dataSetNm: "",
        dataSetDesc: "",
        classifyId: "",
        beltLine: "",
      },
      rules: {
        dataSetNm: [
          { required: true, trigger: "blur", message: "请输入数据集名称" },
        ],
        beltLine: [
          { required: true, trigger: "change", message: "请选择所属域" },
        ],
        classifyId: [
          { required: true, trigger: "change", message: "请选择分类" },
        ],
      },
      //所属部下拉框
      departmentList: [
        // { value: "0", label: "对公" },
        // { value: "1", label: "对私" },
        // { value: "2", label: "营销" },
      ],
      //所属册下拉框
      volumeList: [
        { name: "1", label: "用户" },
        { name: "2", label: "机构" },
        { name: "3", label: "渠道" },
        { name: "4", label: "产品" },
        { name: "5", label: "合约" },
        { name: "6", label: "系统" },
      ],
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.queryBizDomainList();
    },
    async queryBizDomainList() {
      const res = await this.rpc.downloadDesign.queryBizDomainList();
      if (res.businessDomainLists.length > 0) {
        res.businessDomainLists.map((item) => {
          this.departmentList.push({
            value: item.bizDomainNo,
            label: item.bizDomainName,
          });
        });
      }
      // this.departmentList = res.businessDomainLists;
      // console.log(departmentList,"departmentListdepartmentList")
    },
    reset() {
      this.$refs.formRef.resetFields();
    },
    showSelectDialog(){
      this.$refs.selectFromMateDataRef.showDialog()
    },
    confirmData(data){
      this.dataSetForm.dataSetNm = data.dictryNm
    }
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_cmps_data_set_form_base_info {
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
      width: 584px;
    }
    /deep/ .dataSet {
      // display: flex;
      // justify-content: space-between;
      .gr10 {
        margin-left: 8px;
      }
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