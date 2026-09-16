<template>
  <div class="aop_workgate_comps_systemmgmt_dic_form_select">
    <PageDialog
      dialogTitle="基本信息"
      :dialogVisiable="dialogVisible"
      dialogWidth="70%"
      @closeDialog="closeDialog"
      class="dialog"
    >
      <div slot="box">
        <el-form
          ref="formRef"
          :model="subForm"
          :rules="rules"
          label-width="130px"
          class="edit_form"
        >
          <el-form-item label="所属数据集" prop="">
            <span>{{ subForm.dataSetNm }}</span>
          </el-form-item>
          <el-form-item label="名称" prop="dataSubstnNm">
            <el-input
              placeholder="请输入名称"
              v-model="subForm.dataSubstnNm"
            ></el-input>
            <el-button class="" type="primary" @click="showSelectDialog"
              >从字段池中选择</el-button
            >
          </el-form-item>
          <!-- <el-form-item label="所属部" prop="">
            <span>{{
              infoData.beltLine || subForm.beltLine | beltLineType
            }}</span>
          </el-form-item> -->
          <el-form-item label="关系" prop="dataSubstnAttr">
            <el-select
              placeholder="请选择关系"
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
        </el-form>
        <!-- 从字段池中选择 -->
        <SelectFromFiledPool
          ref="selectRef"
          @confirmData="confirmData"
        ></SelectFromFiledPool>
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
      dialogVisible: false,
      subForm: {
        dataSubstnNm: "",
        dataSubstnAttr: "",
      },
      rules: {
        dataSubstnNm: [
          { required: true, trigger: "blur", message: "请输入分段名称" },
        ],
        dataSubstnAttr: [
          { required: true, trigger: "blur", message: "请选择关系" },
        ],
      },
      relationList: [
        { value: "01", label: "1:1" },
        { value: "02", label: "1:N" },
      ],
    };
  },
  methods: {
    showDialog(data) {
      if(data) this.getSubDetail(data)
      else this.subForm = {dataSubstnNm:"",dataSubstnAttr:""}
      this.dialogVisible = true;
    },
    closeDialog() {
      this.$refs.formRef.resetFields();
      this.dialogVisible = false;
    },
    showSelectDialog() {
      this.$refs.selectRef.showDialog();
    },
    confirm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$emit("addSub");
        }
      });
    },
    //从字段池选择点击确定
    confirmData(data) {
      console.log(data);
      this.subForm.dataSubstnNm = data.dictryNm;
    },
    async getSubDetail(data){
      const params = {
        dataSubstnNo: data.dataSubstnNo,
      };
      const res = await this.rpc.dicmgmtDefine.getSubStnDetail(params);
      this.subForm = res;
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
