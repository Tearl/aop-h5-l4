<template>
  <div class="view-object-drawer">
    <el-drawer
      title="功能列表"
      :visible.sync="visible"
      size="800px"
      :wrapperClosable="false"
      :before-close="handleClose"
    >
      <div class="drawer-content">
        <div class="search-form">
          <div class="left">
            <el-form ref="form" :model="searchForm" :inline="true" size="mini" label-width="106px">
              <el-form-item label="应用名称:">
                <el-input
                  v-model="searchForm.appName"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="模块名称:">
                <el-input
                  v-model="searchForm.modName"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="功能编号/名称:">
                <el-input
                  v-model="searchForm.functionCeOrNm"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="right">
            <el-button type="primary" size="small" @click="search"
              >查询</el-button
            >
            <el-button size="small" @click="reset">重置</el-button>
          </div>
        </div>

        <div class="table-options">
          <el-popover placement="bottom" width="120" trigger="click">
            <div>
              <el-checkbox-group v-model="checkList" @change="itemChange">
                <el-checkbox v-for="(m, k) in more" :key="k" :label="m.value">{{
                  m.label
                }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="outer" slot="reference">
              <img
                class="img"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAPKADAAQAAAABAAAAPAAAAACL3+lcAAAB80lEQVRoBe1ZMW4CMRAkl4gG8YB0/IE236DNN9JRRErBN9LyhXyBP1BBTZuCix1xljW3JhNZutWd5przrme83tnD8SqzmR4pIAWkgBSQAlJACgykwAMTZ7PZzI/H4/v1en0N+OcC59w0zedqtdru9/vvDuPF7eLj+xEdlr1YLD5Csm9hbmnN33zLtm1fLpfL/HQ6fXU4L24XH98NOiz7VllrqudDLNo9QuZALNoZtDdksU89pu1In/HhcDB/Buv1ur1RExbtgblmJlSFTeZInUp4pIWjt60K01KNFMie0ueQ3+/pm53GpZQjNn+8uPke0pj6pOMNKjH+GCAW7Xt0xKL9H24JSyUcr4sh+C4sgtXL141Xy13E5k4vbr4HjaXAhBUw78WYr1eLVxMXc+hstYedEvmbbb0iB7Fo5+viGLFoIz63WSx78Ugt38AtXk3cXI80pv4OJ/QEBkp4AkW8m4IqfFeeCUyyp7RXi1cT1ywP9UnXtGleXDPb4KQS9mrxauKWEpZfCkxMAbWHVkG9/gNYE9fKI/qoU5ptveKCiEU7YkoPYtEu8aKfxbIXj5o2zYtr6kNV2GSO1KmER1o4etuqMC3VSIHsKV3TpnlxzZJQn7RXi1cT18w2OKmEa9o0L24pYfmlgBSQAlJACkgBKTCYAj8hkqe+i1J+0AAAAABJRU5ErkJggg=="
                alt=""
                srcset=""
              />
            </div>
          </el-popover>
        </div>

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
          <el-table-column prop="appName" label="应用名称" min-width="120px">
            <template slot-scope="scope">
              {{ scope.row.appName || "/" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="appId"
            label="应用ID"
            v-if="checkList.includes('appId')"
            min-width="120px"
          >
            <template slot-scope="scope">
              {{ scope.row.appId || "/" }}
            </template>
          </el-table-column>
          <el-table-column prop="modName" label="模块名称" min-width="120px">
            <template slot-scope="scope">
              {{ scope.row.modName || "/" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="modId"
            label="模块ID"
            v-if="checkList.includes('modId')"
            min-width="120px"
          >
            <template slot-scope="scope">
              {{ scope.row.modId || "/" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="functionName"
            label="功能名称"
            min-width="120px"
          >
            <template slot-scope="scope">
              {{ scope.row.functionName || "/" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="functionCode"
            label="功能编号"
            min-width="120px"
            v-if="checkList.includes('functionCode')"
          >
            <template slot-scope="scope">
              {{ scope.row.functionCode || "/" }}
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="80px"
            fixed="right"
            min-width="120px"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="viewFn(scope.row)" size="small"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="total"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          size="small"
          :page-sizes="[10, 15, 20, 30]"
          :page-size="turnPageShowNum"
        >
        </el-pagination>
      </div>
    </el-drawer>

    <ViewControlPointDialog
      :visible="showControlPoint"
      v-if="showControlPoint"
      :row="currentFn"
      @close="showControlPoint = false"
    />
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import ViewControlPointDialog from "./ViewControlPointDialog.vue";
export default {
  mixins: [mixin],
  name: "ViewFn",
  components: {
    ViewControlPointDialog,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    project: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      searchForm: {
        appName: "",
        modName: "",
        functionCeOrNm: "",
      },
      infoList: [],
      currentPage: 1,
      turnPageShowNum: 10,
      total: 0,

      showControlPoint: false,
      currentFn: null,

      checkList: [],
      more: Object.freeze([
        { label: "应用ID", value: "appId" },
        { label: "模块ID", value: "modId" },
        { label: "功能编号", value: "functionCode" },
      ]),
    };
  },
  async mounted() {
    await this.search();
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    async qryBizObjAppFunPage() {
      this.loading = true;
      const { infoList, turnPageTotalNum } =
        await this.rpc.assetcenter.qryBizObjAppFunPage({
          ...this.searchForm,
          applicationNo: this.project.projectId,
          currentPage: this.currentPage,
          turnPageShowNum: this.turnPageShowNum,
        });
      this.infoList = infoList;
      this.total = turnPageTotalNum;
      this.loading = false;
    },
    async search() {
      await this.qryBizObjAppFunPage();
    },
    async reset() {
      this.searchForm = {
        functionCeOrNm: "",
        appName: "",
        modName: "",
      };
      this.currentPage = 1;
      await this.search();
    },
    async handleCurrentChange(v) {
      this.currentPage = v;
      await this.search();
    },
    async handleSizeChange(v) {
      this.turnPageShowNum = v;
      this.currentPage = 1;
      await this.search();
    },
    viewFn(row) {
      this.currentFn = row;
      this.showControlPoint = true;
    },
    itemChange(list) {
      this.checkList = list;
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
    .search-form {
      @include flex(row, space-between, flex-start);
      .left {
        flex: 1;
      }
      .right {
        @include flex(row, flex-end, center);
      }
    }
    .table-options {
      @include flex(row, flex-end, center);
      .outer {
        border: 1px solid #e2e2e2;
        padding: 2px;
        @include flex(column, center, center);
        margin-bottom: 4px;
        cursor: pointer;
      }
      .img {
        width: 20px;
        height: 20px;
      }
    }
  }
}
/deep/.el-pagination {
  padding: 0 !important;
  margin: 12px 0;
  text-align: right;
  .btn-next {
    margin-right: 0;
  }
}
</style>

