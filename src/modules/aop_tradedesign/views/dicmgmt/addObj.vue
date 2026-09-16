<template>
  <div class="aop_tradedesign_page_dicmgmt_addObj">
    
    <BussinessobjForm ref="addForm" type="add" :sysId="sysId"></BussinessobjForm>

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
import { getSessionStorage } from "@m/utils/localStorage";
export default {
  mixins: [mixin],
  components: {
    PageHeader,
    PageFooter,
    BussinessobjForm,
  },
  props: {
    sysId: {
      type: String,
      default: () => ""
    }
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
          label: "创建业务对象",
        },
      ],
      dataObj: {},
    };
  },
  methods: {
    // 点击确定按钮
    confirm() {
      const form = this.$refs.addForm.$refs.formData;
      const data = this.$refs.addForm.formData;
      const list = this.$refs.addForm.propList;
      form.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const params = Object.assign({}, data);
        params.sysId = this.sysId
        params.propList = list
        params.servType = getSessionStorage("workgate-servType")
        const res = await this.rpc.systemmgmt.addBussinessobj(params);
        this.$notify({
          title: "成功",
          message: "成功",
          duration: 2000,
          type: "success",
        });
        this.$emit("toBusinessList")
      });
    },
    handleCancel() {
      this.$emit("toBusinessList")
    },
    init() {},
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_dicmgmt_addObj {
  ::v-deep .create_content_wrapper {
    padding: 0;
  }
}
</style>
