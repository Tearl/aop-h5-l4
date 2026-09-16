<template>
  <div class="aop_tradedesign_comps_workbench_public_dialog_addService">
    <PageDialog
      :dialogWidth="'1000px'"
      :dialogTitle="dialogTitle"
      :dialogVisiable="dialogVisible"
      @closeDialog="closeDialog"
      class="add_dataset_dialog"
      :apTobody="true"
    >
      <div slot="box">
        <div class="content">
          <!-- <el-card class="stepProgress" shadow="never">
            <el-steps :space="400" :active="activeSteps" align-center>
              <el-step title="定义数据集"></el-step>
              <el-step title="定义分段"></el-step>
            </el-steps>
          </el-card> -->
          <div class="steps">
            <el-steps :space="400" :active="activeSteps" align-center>
              <el-step title="定义数据集"></el-step>
              <el-step title="定义分段"></el-step>
            </el-steps>
          </div>
          <div class="dec"></div>
          <div class="basic" v-if="activeShow">
            <Basic
              ref="baseRef"
              :editFlag="true"
              :addShow="addShow"
              :infoData="dataObj"
              @openDataset="openDataset"
            ></Basic>
          </div>
          <div class="basic" v-if="!activeShow">
            <DataSetTable
              ref="dataSetTableRef"
              :infoData="infoData"
            ></DataSetTable>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div v-if="activeShow">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click.native="nextSteps">下一步</el-button>
        </div>
        <div v-if="!activeShow">
          <el-button type="primary" @click.native="gotoBack">上一步</el-button>
          <el-button type="primary" @click.native="confirmDialog"
            >确定</el-button
          >
        </div>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Basic from "./components/form/dataSetInfo";
import DataSetTable from "./components/form/dataSetTable";
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";
import PageDialog from "@m/core/components/page_dialog";

export default {
  mixins: [mixin],
  components: {
    Basic,
    PageHeader,
    PageFooter,
    PageDialog,
    DataSetTable,
  },
  props: {
    dataObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialogVisible: false,
      isShow: false,
      dataSetNo: "",
      infoData: {},
      activeSteps: 1,
      activeShow: true,
      dialogTitle: "维护数据集",
      titleShow: false,
      nextShow: false,
      addShow:false
    };
  },
  methods: {
    init() {},
    showDialog(data) {
      this.activeSteps = 1;
      this.activeShow = true;
      if (data && JSON.stringify(data) !== "{}") {
        this.dataSetNo = data.dataSetNo;
        this.nextShow = false;
        this.getDetail();
        this.dialogTitle = "维护数据集";
        this.titleShow = true;
        console.log(this.dataSetNo, "this.dataSetNo");
        this.dialogVisible = true;
      }
    },
    confirm() {
      let data = this.$refs.baseRef.dataSetForm;
      let formRef = this.$refs.baseRef.$refs.formRef;
      formRef.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const params = {
          ...data,
        };
        console.log("确定", data, params);
        // let api = data.dataSetNo ? "editMydataSet":"addMydataSet"
        const res = await this.rpc.dicmgmt.editMydataSet(params);
        this.dataSetNo = res.dataSetNo || data.dataSetNo;
        this.$notify({
          title: "成功",
          message: "编辑成功",
          duration: 2000,
          type: "success",
        });
        this.activeShow = false;
        this.nextShow = false;
        this.activeSteps = 2;
        // this.getDetail();
        this.$nextTick(() => {
          this.$refs.dataSetTableRef.init();
        });
        // this.handleCancel();
      });
    },
    async getDetail() {
      const params = {
        dataSetNo: this.dataSetNo,
      };
      const res = await this.rpc.dicmgmt.getMyDataSetDetail(params);
      this.infoData = res;
      if(res.statusCd == "0"){
        this.addShow = false
      }else if(res.statusCd == "2" || res.statusCd == "1"){
        this.addShow = true
      }
      if (!this.nextShow){
        this.$refs.baseRef.dataSetForm = res;
      }
    },
    closeDialog() {
      // this.$refs.baseRef.reset();
      this.dialogVisible = false;
      this.isShow = false;
    },
    nextSteps() {
      if(this.addShow){
        this.dataSetNo = this.infoData.dataSetNo;
        this.activeShow = false;
        this.nextShow = false;
        this.activeSteps = 2;
        this.$nextTick(() => {
          this.$refs.dataSetTableRef.init();
        });
      }else{
        this.confirm();
      }
      // this.$nextTick(() => {
      //   this.$refs.dataSetTableRef.init();
      // });
    },
    gotoBack() {
      this.nextShow = false;
      this.getDetail();
      // this.dialogTitle =this.titleShow ? "维护数据集": "编辑数据集"
      this.activeShow = true;
      this.activeSteps = 1;
    },
    confirmDialog() {
      this.dialogVisible = false;
      this.activeSteps = 1;
      this.$emit("getList");
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_workbench_public_dialog_addService {
  .content {
    margin: 16px;
  }
}
.add_dataset_dialog {
  .steps {
    @include el_steps_dataset;
    padding: 15px;
  }
  .dec {
    // margin-bottom: 24px;
    height: 1px;
    box-shadow: inset 0 -1px 0 0 #e7e7e7;
  }
  .basic {
    padding: 24px;
  }
  ::v-deep .el-dialog .el-dialog__body {
    padding: 0px !important;
  }
}
</style>
