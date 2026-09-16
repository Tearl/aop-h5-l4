<template>
  <div class="aop_tradedesign_dic_cmps_data_set_form_base_info">
    <el-form
      ref="formRef"
      :model="subForm"
      :rules="rules"
      label-width="130px"
      class="edit_form"
    >
      <div class="header_title">基本信息</div>
      <el-form-item label="所属数据集" prop="">
        <span>{{ infoData.dataSetNm || subForm.dataSetNm }}</span>
      </el-form-item>
      <el-form-item label="名称" prop="dataSubstnNm">
        <el-input
          placeholder="请输入名称"
          v-model.trim="subForm.dataSubstnNm"
        ></el-input>
        <!-- <el-button
          class=""
          v-if="type !== 'edit'"
          type="primary"
          @click="showSelectDialog"
          >从元数据选择</el-button
        > -->
      </el-form-item>
      <el-form-item label="所属域" prop="">
        <span>{{ infoData.beltLineNm || subForm.beltLine }}</span>
      </el-form-item>
      <el-form-item label="关系" prop="dataSubstnAttr">
        <el-select placeholder="请选择关系" v-model="subForm.dataSubstnAttr">
          <el-option
            v-for="(item, index) in relationList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据描述" prop="subDesc">
        <el-input
          type="textarea"
          :rows="3"
          v-model="subForm.subDesc"
          clearable
          placeholder="请输入描述"
          maxlength="500"
        />
      </el-form-item>
    </el-form>
    <!-- 从字段池中选择 -->
    <SelectFromMateData
      ref="selectFromMateDataRef"
      @confirmData="confirmData"
    ></SelectFromMateData>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import SelectFromMateData from "../dialog/selcFromMateData";
export default {
  mixins: [mixin],
  components: {
    SelectFromMateData,
  },
  props: {
    type: {
      type: String,
      default: "read",
    },
    infoData: {
      type: Object,
      default: {},
    },
  },
  computed: {},
  data() {
    return {
      subForm: {
        dataSubstnNm: "",
        dataSubstnAttr: "",
        subDesc:""
      },
      rules: {
        dataSubstnNm: [
          { required: true, trigger: "blur", message: "请输入分段名称" },
        ],
        dataSubstnAttr: [
          { required: true, trigger: "change", message: "请选择关系" },
        ],
      },
      relationList: [
        { value: "01", label: "1:1" },
        { value: "02", label: "1:N" },
      ],
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {},
    reset() {
      this.$refs.formRef.resetFields();
    },
    showSelectDialog() {
      this.$refs.selectFromMateDataRef.showDialog();
    },
    //从字段池选择点击确定
    confirmData(data) {
      this.subForm.dataSubstnNm = data.dictryNm;
      console.log("选择", data.dictryNm, this.subForm);
    },
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
      width: 400px;
    }
    ::v-deep .el-button {
      @include large_button_common;
    }
    .no_before {
      ::v-deep .el-form-item__label::before {
        content: "";
      }
    }
  }
}
</style>