<template>
  <div class="aop_workgate_comps_systemmgmt_dic_form_select">
    <PageDialog
      :dialogWidth="'50%'"
      :dialogVisiable="addDataVisible"
      :dialogTitle="dataTitle"
      @closeDialog="closeDataDialog"
    >
      <div slot="box">
        <el-form
          ref="formRef"
          :model="dataSetForm"
          :rules="dataRules"
          label-width="130px"
          class="edit_form"
        >
          <el-form-item label="名称" prop="dataSetNm">
            <el-input
              placeholder="请输入名称"
              v-model="dataSetForm.dataSetNm"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属部" prop="beltLine">
            <el-select
              placeholder="请选择所属部"
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
          <el-form-item label="所属册" prop="classifyId">
            <el-select
              placeholder="请选择所属册"
              v-model="dataSetForm.classifyId"
              disabled
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
      </div>
      <div slot="footer">
        <el-button @click="closeDataDialog">取 消</el-button>
        <el-button type="primary" @click="dataConfirm">确 定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import { unduplicated } from "@m/utils/array";
import SelectFromFiledPool from "../public_dialog/selcFromSubsectionPool";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    SelectFromFiledPool,
  },
  props: {
    // dialogVisible: {
    //   type: Boolean,
    //   default: () => false
    // },
    dictGategList: {
      type: Array,
      default: () => false,
    },
  },
  data() {
    return {
      addDataVisible: false,
      dataTitle: "添加数据集",
      dataSetForm: {
        dataSetNm: "",
        dataSetDesc: "",
        classifyId: "",
        beltLine: "",
      },
      dataRules: {
        dataSetNm: [
          { required: true, trigger: "blur", message: "请输入数据集名称" },
        ],
        beltLine: [{ required: true, trigger: "blur", message: "请选择部" }],
        classifyId: [{ required: true, trigger: "blur", message: "请选择册" }],
      },
      //所属部下拉框
      departmentList: [
        { value: "0", label: "对公业务" },
        { value: "1", label: "对私业务" },
        { value: "2", label: "营销业务" },
      ],
      //所属册下拉框
      volumeList: [
        { name: "1", label: "C1 用户册" },
        { name: "2", label: "P1 机构册" },
        { name: "3", label: "C2 渠道册" },
        { name: "4", label: "P2 产品册" },
        { name: "5", label: "C3 合约册" },
        { name: "6", label: "S 系统册" },
      ],
    };
  },
  methods: {
    showDialog(type,data) {
      this.addDataVisible = true;
      if (type == "editData") {
        this.dataTitle = "编辑数据集";
        this.getMyDataSetDetail(data);
      } else {
        this.dataTitle = "添加数据集";
        console.log(data,'添加数据集')
        this.dataSetForm.classifyId = data.dataSetNo
      }
    },
    closeDataDialog() {
      this.$refs.formRef.resetFields();
      this.addDataVisible = false;
    },
    //确认编辑添加
    dataConfirm() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.dataSetForm,
          };
          const api = this.dataTitle =="添加数据集" ? "addMydataSet":"editMydataSet"
          const res = await this.rpc.dicmgmtDefine[api](params);
          this.$notify({
            title: "成功",
            message:this.dataTitle == "添加数据集" ?"新增成功":"编辑成功",
            duration: 2000,
            type: "success",
          });
          this.closeDataDialog()
          this.$emit("confirmComplete");
        }
      });
    },
    //FM-SJJ-111025
    async getMyDataSetDetail(data){
      const params = {
        dataSetNo:data.dataSetNo
      }
      const res = await this.rpc.dicmgmtDefine.getMyDataSetDetail(params);
      this.dataSetForm = res;
      console.log("getMyDataSetDetail",res)
    },
    // 初始化
    init() {
      // this.getList();
      // this.getClassifyTypeList()
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_systemmgmt_dic_form_select {
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }
  .dialog {
    ::v-deep.el-dialog {
      margin-top: 3vh !important;
    }
    ::v-deep.el-dialog__body {
      max-height: 78vh;
    }
  }
  .service_top ::v-deep.serivce_top_box {
    padding: 0;
    margin: 0;
  }
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
    }
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
