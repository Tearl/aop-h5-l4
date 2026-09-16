<template>
  <div>
    <el-dialog
      title="引用对象"
      :visible.sync="visible"
      class="import-object-dialog"
      width="900px"
      :close-on-click-modal="false"
      :append-to-body="true"
      top="10vh"
      @close="close"
    >
      <div class="dialog-content">
        <div class="search-form">
          <div class="left">
            <el-form ref="form" :model="searchForm" :inline="true" size="mini">
              <el-form-item label="业务对象编码/名称:">
                <el-input
                  v-model="searchForm.objCeOrNm"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="所属中心:">
                <el-select
                  v-model="searchForm.applicationNo"
                  placeholder="请选择所属中心"
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="item in projectList"
                    :key="item.value"
                  ></el-option>
                </el-select>
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

        <el-table
          :data="infoList"
          row-key="objId"
          v-loading="loading"
          style="width: 100%"
          ref="infoList"
          size="small"
          align="center"
          :stripe="false"
          :reserve-selection="true"
          border
          :header-cell-style="{
            background: '#F5F5F8',
            color: '#333',
          }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column prop="objCode" label="业务对象编码">
            <template slot-scope="scope">
              {{ scope.row.objCode || "/" }}
            </template>
          </el-table-column>
          <el-table-column prop="objName" label="业务对象名称">
            <template slot-scope="scope">
              {{ scope.row.objName || "/" }}
            </template>
          </el-table-column>

          <el-table-column prop="bizDomainName" label="业务域">
            <template slot-scope="scope">
              {{ scope.row.bizDomainName || "/" }}
            </template>
          </el-table-column>
          <el-table-column prop="applicationName" label="所属中心">
            <template slot-scope="scope">
              {{ scope.row.applicationName || "/" }}
            </template>
          </el-table-column>
          <el-table-column prop="attrNames" label="属性">
            <template slot-scope="scope">
              {{ scope.row.attrNames || "/" }}
            </template>
          </el-table-column>
        </el-table>
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          "
        >
          <p>已选（{{ selectedList.length }}）</p>
          <el-pagination
            background
            layout="total, prev, pager, next"
            :total="total"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            size="small"
          >
          </el-pagination>
        </div>
      </div>
      <div class="btn-group" slot="footer">
        <el-button size="medium" @click="close">取 消</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="confirm"
          :disabled="selectedList.length == 0"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import _ from "lodash";
export default {
  name: "ImportObject",
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    bizDomainNo: {
      type: String,
      default: "",
    },
    project: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      searchForm: {
        objCeOrNm: "",
        applicationNo: "",
      },
      projectList: [],
      currentPage: 1,
      turnPageShowNum: 10,
      total: 0,

      selectedList: [],

      infoList: [],
    };
  },
  async mounted() {
    await this.qryBizObjectBasePage();
    const { queryAppAndBlgClsInfoList } =
      await this.rpc.assetcenter.queryOwnL5ProjectPageList({
        bizDomainNo: "",
        currentPage: 1,
        turnPageShowNum: 1000,
      });
    this.projectList = queryAppAndBlgClsInfoList || [];
    this.projectList = [{ label: "全部", value: "" }].concat(
      this.projectList.map((i) => {
        return {
          value: i.projectId,
          label: i.projectNm,
        };
      })
    );
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async confirm() {
      await this.rpc.assetcenter.saveQuoteBizObj({
        currentAppNo: this.project.projectId,
        infoList: this.selectedList.map((i) => ({
          objId: i.objId,
          sourceAppNo: i.applicationNo,
        })),
      });
      this.$emit("confirm", _.cloneDeep(this.selectedList));
    },
    async search() {
      await this.qryBizObjectBasePage();
    },
    async reset() {
      this.searchForm = {
        objCeOrNm: "",
        applicationNo: "",
      };
      this.currentPage = 1;
      await this.qryBizObjectBasePage();
    },
    async qryBizObjectBasePage() {
      this.loading = true;
      const { infoList, turnPageTotalNum } =
        await this.rpc.assetcenter.qryBizObjectBasePage({
          ...this.searchForm,
          bizDomainNo: "",
          noApplicationNo: this.project.projectId,
          objClass: "",
          objType: "",
          currentPage: this.currentPage,
          turnPageShowNum: this.turnPageShowNum,
        });
      this.infoList = infoList.map((i) => {
        return {
          ...i,
          attrNames: i.attributeInfos.map((attr) => attr.dictryName).join("、"),
        };
      });
      this.total = turnPageTotalNum;
      this.loading = false;
    },

    async handleCurrentChange(v) {
      this.currentPage = v;
      await this.search();
    },

    handleSelectionChange(v) {
      this.selectedList = v;
      console.log("selectedList", this.selectedList);
    },
  },
};
</script>

<style lang="scss" scoped>
.import-object-dialog {
  /deep/.el-dialog__body {
    padding: 10px 20px 20px 20px !important;
  }
  /deep/.el-dialog__header {
    border-bottom: 1px solid #f5f5fa;
    padding: 12px 20px;
    background: #fafafc;

    .el-dialog__title {
      font-size: 16px;
      color: #000000;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: bold;
      font-family: PingFangSC-Medium;
    }

    .el-dialog__headerbtn {
      top: 14px;
    }
  }
  /deep/.el-dialog__footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #e7e7e7;
    padding: 16px !important;
  }
  .btn-group {
    text-align: center;
  }

  .dialog-content {
    height: 550px;
    overflow-y: scroll;
    .search-form {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      //   border-bottom: 1px solid #e7e7e7;
      //   margin-bottom: 12px;
      .left {
        flex: 1;
      }
      .right {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
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
  }
}
</style>

