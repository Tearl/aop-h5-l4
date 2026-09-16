<template>
  <div class="aop_tradedesign_page_dicmgmt_modObj">

    <BussinessobjForm ref="modForm" type="edit" :bsnObjId="bsnObjId" :sysId="sysId"></BussinessobjForm>

    <PageFooter>
      <div slot="box">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="confirm">提 交</el-button>
      </div>
    </PageFooter>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";
import BussinessobjForm from "./components/sys_object/components/bussinessobj_form";
export default {
  mixins: [mixin],
  components: {
    PageHeader,
    PageFooter,
    BussinessobjForm,
  },
  props: {
    bsnObjId: {
      type: String,
      default: () => ""
    },
    sysId: {
      type: String,
      default: () => ""
    },
  },
  data() {
    return {
      // 导航栏参数
      breadcrumbs: [
        {
          label: "业务对象",
          operate: "list",
        },
        {
          label: "编辑业务对象",
        },
      ],
      dataObj: {},
      apiId: "",
      msgFormat: ""
    };
  },
  methods: {
    confirm() {
      const form = this.$refs.modForm.$refs.formData;
      const data = this.$refs.modForm.formData;
      const list = this.$refs.modForm.propList;
      form.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const params = Object.assign({}, data);
        params.propList = list;
        const res = await this.rpc.systemmgmt.modBussinessobj(params);
        this.$notify({
          title: "成功",
          message: "成功",
          duration: 2000,
          type: "success",
        });
        this.handleCancel()
      });
    },
    handleCancel() {
      if(!this.apiId) {
        this.$emit("toBusinessList")
      } else {
        this.$router.push({
          path: "/aop_tradedesign/apimgmt/apiServ",
          query: {
            arsId: this.sysId,
            apiId: this.apiId,
            msgFormat: this.msgFormat,
          },
        });
      }
    },
    // 进入编辑页面时查询详情
    async getDetail() {
      const params = {
        bsnObjId: this.bsnObjId,
      };
      const res = await this.rpc.systemmgmt.getBussinessobjDetail(params);
      this.$refs.modForm.formData = res
      this.$refs.modForm.formData.domainId = "10000001"
      this.$refs.modForm.propList = res.propList
    },
    init() {
      this.apiId = this.$route.query.apiId || ""
      if(!!this.apiId) {
        this.sysId = this.$route.query.sysId
        this.bsnObjId = this.$route.query.bsnObjId
        this.getDetail()
      }
      this.msgFormat = this.$route.query.msgFormat || ""
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_dicmgmt_modObj {
}
</style>
