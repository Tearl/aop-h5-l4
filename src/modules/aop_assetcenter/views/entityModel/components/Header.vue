<template>
  <div class="object-graph-header">
    <div class="left">
      <div class="logo right12">
        <img src="data:image/png;base64,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" />
      </div>
      <h3 class="bold right12 font16">业务对象设计</h3>
      <p>
        <el-select
          v-model="selectedBizDomain"
          placeholder="请选择"
          size="mini"
          @change="changeBizDomain"
        >
          <el-option
            v-for="item in bizDomainList"
            :key="item.bizDomainNo"
            :label="item.bizDomainName"
            :value="item.bizDomainNo"
          >
          </el-option>
        </el-select>
      </p>
    </div>
    <div class="right">
      <el-button type="warning" plain size="mini" @click="openBiz" v-if="action == '0'"
        >库表对象设计器</el-button
      >
      <el-button type="primary" plain size="mini" @click="exportImage"
        >导出图片</el-button
      >
      <el-button type="primary" size="mini" @click="save" v-if="action == '0'">保存</el-button>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
  name: "ObjectGraphHeader",
  mixins: [mixin],
  props: {
    bizDomainNo: {
      type: String,
      default: "",
    },
    action: {
      type: String,
      default: "0"
    }
  },
  data() {
    return {
      selectedBizDomain: "",
      bizDomainList: [],
    };
  },

  async mounted() {
    await this.queryBizDomainList();
  },
  methods: {
    async queryBizDomainList() {
      const { businessDomainLists } =
        await this.rpc.assetcenter.queryBizDomainList();
      this.bizDomainList = businessDomainLists || [];
      if (this.bizDomainList.length > 0) {
        this.selectedBizDomain =
          this.bizDomainNo || this.bizDomainList[0].bizDomainNo;
        if (this.selectedBizDomain !== this.bizDomainNo) {
          this.$emit("changeBizDomain", this.selectedBizDomain);
        }
      }
    },
    changeBizDomain(value) {
      this.$emit("changeBizDomain", value);
    },
    save() {
      this.$emit("save");
    },
    exportImage() {
      this.$emit("exportImage");
    },
    openBiz() {
      this.$emit("openBiz");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/mixin.scss";
.object-graph-header {
  width: 100%;
  height: 48px;
  background: #fff;
  @include flex(row, space-between, center);
  padding: 0 12px 0 0;
  border-bottom: 1px solid #bbbdbf;
  .left {
    @include flex(row, flex-start, center);
    .logo {
      width: 40px;
      height: 48px;
      background: #005dd7;
      @include flex(row, center, center);
      padding: 4;
    }
    // h3 {
    //   margin-right: 24px;
    // }
  }
}
</style>
