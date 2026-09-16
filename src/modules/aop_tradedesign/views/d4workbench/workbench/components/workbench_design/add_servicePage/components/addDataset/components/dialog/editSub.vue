<template>
  <div class="aop_workgate_comps_systemmgmt_dic_form_select">
    <PageDialog
      dialogTitle="编辑分段"
      :dialogVisiable="dialogVisible"
      dialogWidth="720px"
      @closeDialog="closeDialog"
      class="dialog"
      :apTobody="true"
      :customClass="'customClass_addSub'"
    >
      <div slot="box">
        <el-form
          ref="formRef"
          :model="subForm"
          :rules="rules"
          label-width="130px"
          size="small"
          class="edit_form"
        >
          <el-form-item label="所属数据集：" prop="">
            <span>{{ infoData.dataSetNm || subForm.dataSetNm }}</span>
          </el-form-item>
          <el-form-item label="数据分段名称：" prop="dataSubstnNm">
            <el-input
              placeholder="请输入数据分段名称"
              v-model="subForm.dataSubstnNm"
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属域：" prop="beltLine">
            <span>{{
              infoData.beltLineNm || beltLineObj[infoData.beltLine] || subForm.beltLine | beltLineType
            }}</span>
          </el-form-item>
          <el-form-item label="分段关系：" prop="dataSubstnAttr">
            <el-select
              placeholder="请分段关系"
              v-model="subForm.dataSubstnAttr"
            >
              <el-option
                v-for="(item, index) in relationList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据描述：" prop="subDesc">
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
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
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
// import SelectFromFiledPool from "./components/selcFromSubsectionPool";
import filters from "@m/utils/filters";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    // SelectFromFiledPool,
  },
  filters: {
    ...filters,
  },
  props: {
    infoData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialogVisible: false,
      subForm: {
        dataSubstnNm: "",
        dataSubstnAttr: "",
        // beltLine:"",
        subDesc: "",
      },
      rules: {
        dataSubstnNm: [
          { required: true, trigger: "blur", message: "请输入分段名称" },
        ],
        dataSubstnAttr: [
          { required: true, trigger: "change", message: "请选择关系" },
        ],
        // beltLine: [
        //   { required: true, trigger: "change", message: "请选择所属域" },
        // ],
      },
      relationList: [
        { value: "01", label: "1:1" },
        { value: "02", label: "1:N" },
      ],
      beltLineObj:{
        "FM-YWY-2022-000001":"对公业务",
        "FM-YWY-2022-000002":"对私业务",
        "FM-YWY-2022-000003":"营销业务",
      }
    };
  },
  methods: {
    showDialog(data) {
      if (data) this.getSubDetail(data);
      else this.subForm = { dataSubstnNm: "", dataSubstnAttr: "" };
      this.dialogVisible = true;
    },
    closeDialog() {
      this.$refs.formRef.resetFields();
      this.dialogVisible = false;
    },
    confirm() {
      // this.$refs.formRef.validate(async (valid) => {
      //   if (valid) {
      //     const params = {
      //       ...this.subForm,
      //       blgDataSetNo: this.infoData.dataSetNo,
      //     };
      //     const res = await this.rpc.dicmgmt.addSubStn(params);
      //     this.$notify({
      //       title: "成功",
      //       message: "新增成功",
      //       duration: 2000,
      //       type: "success",
      //     });
      //     this.closeDialog();
      //     this.$emit("confirmSub");
      //   }
      // });
      this.closeDialog();
    },
    async getSubDetail(data) {
      const params = {
        dataSubstnNo: data.dataSubstnNo,
      };
      const res = await this.rpc.dicmgmtDefine.getSubStnDetail(params);
      this.subForm = res;
      console.log("this", this.infoData,this.subForm);
    },
    // 初始化
    init() {},
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
  // .edit_form {
  //   @include form;
  //   .header_title {
  //     font-family: PingFangSC-Medium;
  //     font-size: 16px;
  //     // color: #131313;
  //     letter-spacing: 0;
  //     margin-bottom: 20px;
  //     // font-weight: 600;
  //   }
  //   /deep/ .el-input,
  //   /deep/ .el-textarea__inner {
  //     width: 400px;
  //   }
  //   ::v-deep .el-button {
  //     @include large_button_common;
  //   }
  //   .no_before {
  //     ::v-deep .el-form-item__label::before {
  //       content: "";
  //     }
  //   }
  // }
}
.customClass_addSub {
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
    // @include form;
    .header_title {
      // font-family: PingFangSC-Medium;
      // font-size: 16px;
      // color: #131313;
      // letter-spacing: 0;
      margin-bottom: 20px;
      // font-weight: 600;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
    }
    /deep/ .el-input,
    /deep/ .el-textarea__inner {
      width: 520px;
    }
     /deep/ .el-textarea__inner{
      height: 80px;
     }
    ::v-deep .el-form-item__label {
      width: 120px !important;
    }
    ::v-deep .el-form-item__content {
      margin-left: 120px !important;
    }
    ::v-deep .el-form-item .el-form-item__label {
      color: #333333 !important;
      font-weight: 400 !important;
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
  ::v-deep .edit_form .el-form-item__label {
    width: 97px !important;
  }
  ::v-deep .edit_form .el-form-item__content {
    margin-left: 98px !important;
  }
  ::v-deep .edit_form .el-form-item .el-form-item__label {
    color: #333333 !important;
    font-weight: 400 !important;
  }
}
</style>
