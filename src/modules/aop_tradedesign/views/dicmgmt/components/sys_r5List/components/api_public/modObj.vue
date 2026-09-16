<template>
  <div class="aop_tradedesign_comps_apimgmt_api_public_mod_obj">

    <ObjForm ref="modForm" type="edit" :bsnObjId="bsnObjId" :sysId="sysId"></ObjForm>

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
import PageFooter from "@m/core/components/page_footer";
import ObjForm from "./components/obj_form";
export default {
  mixins: [mixin],
  components: {
    PageFooter,
    ObjForm,
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
      this.$emit("toApiViewObj")
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
      this.getDetail()
    },
  },
  created() {},
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_api_public_mod_obj {
}
</style>
