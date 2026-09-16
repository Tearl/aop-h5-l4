<template>
  <div class="aop_tradedesign_dic_cmps_my_dic_list">
    <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <div class="content">
      <BaseInfo ref="baseRef" type="read"></BaseInfo>
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
import BaseInfo from "./components/form/dataSetInfo";
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
          label: "新增数据集",
        },
      ],
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {},
    labelClick(e) {
      if (e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list",
        });
      }
    },
    handleCancel() {
      this.$nextTick(() => {
        this.$refs.baseRef.reset();
      });
      this.$router.push({
        path: "/aop_tradedesign/dicmgmt/list",
      });
    },
    confirm() {
      let data = this.$refs.baseRef.dataSetForm;
      let departmentList  =this.$refs.baseRef.departmentList;
      let beltLineNm = ""
      departmentList.map((item) =>{
        if(item.value == data.beltLine){
          beltLineNm  = item.label
        }
      })
      let formRef = this.$refs.baseRef.$refs.formRef;
      console.log(departmentList,data.beltLine,'1')
      formRef.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const params = {
          ...data,
          beltLineNm
        };
        console.log("确定", data, params);
        const res = await this.rpc.dicmgmt.addMydataSet(params);
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