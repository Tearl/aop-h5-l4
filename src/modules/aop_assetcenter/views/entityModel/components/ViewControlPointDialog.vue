<template>
  <div class="view-object-drawer">
    <el-drawer
      title="接口-服务列表"
      :visible.sync="visible"
      size="800px"
      :wrapperClosable="false"
      :before-close="handleClose"
    >
      <div class="drawer-content">
        <el-table
          :data="infoList"
          v-loading="loading"
          style="width: 100%"
          ref="infoList"
          size="small"
          align="center"
          :stripe="false"
          border
          :header-cell-style="{
            background: '#F5F5F8',
            color: '#333',
          }"
        >
          <el-table-column prop="controlPointId" label="接口ID">
            <template slot-scope="scope">
              {{ scope.row.controlPointId || "/" }}
            </template>
          </el-table-column>
          <el-table-column prop="controlPointName" label="接口名称">
            <template slot-scope="scope">
              {{ scope.row.controlPointName || "/" }}
            </template>
          </el-table-column>

          <el-table-column prop="settlementId" label="服务ID">
            <template slot-scope="scope">
              {{ scope.row.settlementId || "/" }}
            </template>
          </el-table-column>
          <el-table-column prop="settlementName" label="服务名称">
            <template slot-scope="scope">
              {{ scope.row.settlementName || "/" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="viewFn(scope.row)" size="small"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  name: "ViewControlPoint",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      infoList: [],
    };
  },
  async mounted() {
    await this.qryFunCtPtStList();
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    async qryFunCtPtStList() {
      this.loading = true;
      const { infoList } = await this.rpc.assetcenter.qryFunCtPtStList({
        functionCode: this.row.functionCode,
        functionVersionSn: this.row.functionVersionSn,
      });
      this.infoList = infoList;
      this.loading = false;
    },
    async viewFn(row) {
      const res = await this.rpc.assetcenter.qryCtrPtSouData({
        controlPointId: row.controlPointId,
      });
      if (!res.businessId) {
        this.$message.error("未绑定关联业务");
      } else {
        const queryParams = new URLSearchParams({
          productId: res.productId,
          bizId: res.businessId,
          bizName: res.businessName,
          productTreeId: res.productTreeId,
          domainNo: res.domainNo,
          bizDomainNo: res.domainNo,
          domainName: res.domainName,
          planId: res.planId,
          action: "view",
          designAgain: "1",
          externalLink: "1",
          expandedKey: `${res.processId}_${row.controlPointId}`,
          currentNodeId: row.settlementId,
        });
        window.open(
          `/aop-h5-sub/#/aop_businessmold/modelDesign/home?${queryParams.toString()}`,
          "_blank"
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/mixin.scss";
/deep/ .el-drawer__header {
  margin: 0;
  padding: 12px;
  color: #333;
  font-weight: 700;
  border-bottom: 1px solid #e2e2e2;
}
/deep/ .el-drawer__body {
  padding: 12px 12px 0 12px;
  display: flex;
  flex-direction: column;
  .drawer-content {
    flex: 1;
    overflow-y: scroll;
  }
}
</style>

