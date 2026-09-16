<template>
  <div class="aop_tradedesign_page_dicmgmt_addObj">
    <BussinessobjForm ref="addForm" :type="type" :sysId="sysId" :dataColletId="dataColletId"></BussinessobjForm>

    <PageFooter>
      <div slot="box">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 认</el-button>
      </div>
    </PageFooter>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";
import BussinessobjForm from "./components/data_list_form";
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
    },
    type: {
      type: String,
      default: () => "add"
    },
    dataColletId: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      dataObj: {},
    };
  },
  methods: {
    // 点击确定按钮
    confirm() {
      const form = this.$refs.addForm.$refs.formData;
      const data = this.$refs.addForm.formData;
      const list = this.$refs.addForm.dictInfos;
      form.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const params = Object.assign({}, data);
        params.sysId = this.sysId
        if(this.type == "add") {
          params.dictInfos = list.map((item) => { return {dictryId: item.dictryId}})
        }
        const api = this.type == "add" ? "addDataList" : "modDataList"
        const res = await this.rpc.systemmgmt[api](params);
        this.$notify({
          title: "成功",
          message: this.type == "add" ? "创建数据集成功" : "编辑数据集成功",
          duration: 2000,
          type: "success",
        });
        this.$emit("toList")
      });
    },
    handleCancel() {
      this.$emit("toList")
    },
    init() {
    },
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
