<template>
  <div class="aop_tradedesign_dic_cmps_my_dic_list">
    <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <div class="content">
      <BaseInfo ref="baseRef" :infoData="infoData"></BaseInfo>
      <PageFooter slot="footer">
        <div slot="box">
          <el-button @click="handleCancel">返 回</el-button>
          <el-button type="primary" @click="confirm">提 交</el-button>
        </div>
      </PageFooter>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";
import BaseInfo from "./components/form/subStnInfo";
export default {
  mixins: [mixin],
  components: {
    PageHeader,
    PageFooter,
    BaseInfo,
  },
  props: {},
  computed: {},
  data() {
    return {
      breadcrumbs: [
        {
          label: "字典管理",
          operate: "list",
        },
        {
          label: "编辑数据集",
          operate: "dataSet",
        },
        {
          label: "新增分段",
        },
      ],
      infoData: {},
    };
  },
  created() {
    this.init();
  },
  destroyed(){
    sessionStorage.removeItem("dataSetInfo")
  },
  mounted() {},
  methods: {
    init() {
      this.infoData.dataSetNo = this.$route.query.dataSetNo;
      this.infoData.dataSetNm = this.$route.query.dataSetNm;
      this.infoData.beltLine = this.$route.query.beltLine;
      this.infoData.beltLineNm = this.$route.query.beltLineNm;
      console.log("info", this.infoData);
    },
    labelClick(e) {
      if (e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list",
        });
      } else if (e == "dataSet") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editDataSet",
          query: {
            dataSetNo: this.infoData.dataSetNo,
          },
        });
      }
    },
    handleCancel() {
      this.$nextTick(() => {
        this.$refs.baseRef.reset();
      });
      this.$router.push({
        path: "/aop_tradedesign/dicmgmt/editDataSet",
        query: {
          dataSetNo: this.infoData.dataSetNo,
        },
      });
    },
    confirm() {
      let data = this.$refs.baseRef.subForm;
      let formRef = this.$refs.baseRef.$refs.formRef;
      formRef.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const params = {
          ...data,
          blgDataSetNo: this.infoData.dataSetNo,
          dataSubstnDesc:data.subDesc
        };
        console.log("确定", data, params);
        const res = await this.rpc.dicmgmt.addSubStn(params);
        this.$notify({
          title: "成功",
          message: "新增成功",
          duration: 2000,
          type: "success",
        });
        this.handleCancel();
      });
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_cmps_my_dic_list {
  .content {
    margin: 16px;
    padding: 20px 24px;
    background: $base_white;
  }
}
</style>