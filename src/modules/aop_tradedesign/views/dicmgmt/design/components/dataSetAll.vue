<template>
  <div class="dataSet_all">
    <!-- 搜索区域 -->
    <div class="common_search_form">
      <el-form :inline="true" size="small" label-position="right">
        <el-row class="search_bottom">
          <el-col :span="20">
            <!-- <el-form-item label="数据分类：">
                            <el-select placeholder="请输入" v-model="formData.dataSetCgyDesc" class="search_form_input_width"></el-select>
                        </el-form-item> -->

            <el-form-item label="数据名称：">
              <el-input
                placeholder="请输入"
                v-model="formData.dictNm"
                class="search_form_input_width"
              ></el-input>
            </el-form-item>
            <el-form-item label="创建时间：">
              <el-date-picker
                v-model="formData.searchDate"
                type="datetimerange"
                value-format="yyyyMMddHHmmss"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div class="form_btn">
              <el-button size="small" type="primary" @click="listQr"
                >查询</el-button
              >
              <el-button size="small" @click="reset">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="data_set_table_main">
      <div class="data_set_list_title">
        <h1>数据集列表</h1>
      </div>

      <div class="data_set_list_table">
        <el-table class="data_set_common_table" :data="list">
          <el-table-column
            label="数据集分类"
            prop="classifyNm"
          ></el-table-column>
          <el-table-column
            label="数据集名称"
            prop="dataSetNm"
          ></el-table-column>
          <el-table-column
            label="数据分段"
            prop="dataSubstnNm"
          ></el-table-column>
          <el-table-column label="数据名称" prop="dictNm"></el-table-column>
          <el-table-column
            label="数据样例"
            prop="dataExample"
          ></el-table-column>
          <el-table-column label="枚举值" prop="dataEnum"></el-table-column>
          <el-table-column label="数据说明" prop="dataDesc">
            <template slot-scope="scope">
              <span>{{ scope.row.dataDesc || "/" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="scope-opera-detail">
                <div class="color-blue" @click="doOperate('look', scope.row)">
                  查看
                </div>
                <div class="color-blue" @click="doOperate('del', scope.row)">
                  删除
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <div class="pagination" v-if="list.length > 0 && total > 10">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="pageNum"
            layout="total,prev, pager, next, sizes, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <create-data-config-drawer
      v-if="createDataConfigDrawerVirble"
      v-model="createDataConfigDrawerVirble"
      :configDrawerInfo="configDrawerInfo"
    />
  </div>
</template>

<script>
import createDataConfigDrawer from "../dialog/CreateDataConfigDrawer.vue";
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],

  inject: ["action", "appInfo"],

  components: {
    createDataConfigDrawer,
  },
  props: {
    parentInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      list: [],
      formData: {
        searchDate: [],
        dictNm: "",
      },
      createDataConfigDrawerVirble: false,
      configDrawerInfo: {},
      page: "1",
      pageNum: "10",
      total: 0,
    };
  },

  mounted() {
    this.listQr();
  },

  methods: {
    handleSizeChange(e) {
      this.pageNum = e;
      this.listQr();
    },
    handleCurrentChange(e) {
      this.page = e;
      this.listQr();
    },

    reset() {
      this.formData = {
        searchDate: [],
        dictNm: "",
      };
      this.listQr();
    },

    async listQr() {
      const { dataList, turnPageTotalNum } =
        await this.rpc.d1interation.dataSetDataList({
          currentPage: this.page,
          turnPageShowNum: this.pageNum,
          dictNm: this.formData.dictNm,
          crtStrtTm: this.formData.searchDate[0],
          crtEndTm: this.formData.searchDate[1],
          // blgAppNo: this.appInfo.aaiId,
          // appVerNo: this.appInfo.aaiVersion,
          // authId: this.appInfo.isolateWorkspace,
        });
      (this.list = dataList || []), (this.total = turnPageTotalNum);
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },

    doOperate(operate, scope) {
      console.log(
        scope.dataSetDataId,
        "this.configDrawerInfo.dataSetDataId---"
      );
      switch (operate) {
        case "del":
          this.$confirm("确定删除当前数据吗？", "温馨提示").then((res) => {
            this.rpc.d1interation
              .delDataSetData({
                dataSetDataId: scope.dataSetDataId,
              })
              .then((res) => {
                this.$notify({
                  title: "成功",
                  message: "删除成功",
                  duration: 2000,
                  type: "success",
                });
                this.listQr();
              });
          });
          break;
        case "look":
          this.configDrawerInfo.operationType = "2";
          this.configDrawerInfo.dataSetDataId = scope.dataSetDataId;
          this.createDataConfigDrawerVirble = true;
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dataSet_all {
  .common_search_form {
    background: #ffffff;
    padding: 16px 24px;
    padding-bottom: 0;
    margin-bottom: 12px;

    .el-form-item--small.el-form-item {
      margin-bottom: 16px;
    }
    .form_btn {
      text-align: right;
    }

    .search_form_input_width {
      width: 140px;
    }
    // /deep/.el-date-editor--datetimerange.el-input__inner {
    //     width: 456px;
    // }
  }

  .data_set_table_main {
    margin-top: 12px;
    background: #fff;
    // min-height: calc(100vh - 340px);

    .data_set_list_title {
      // display: flex;
      // align-items: center;
      padding: 20px 24px;

      h1 {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #111111;
        letter-spacing: 0;
      }
    }

    .data_set_list_table {
      padding: 0 24px;
      min-height: calc(100vh - 179px);
      /deep/.data_set_common_table {
        padding-bottom: 24px;

        &.el-table .el-table__body tr {
          cursor: pointer;
        }

        &.el-table th {
          background: #fafafc;
          font-size: 14px;
          color: #333333;
        }

        &.el-table th .cell {
          padding-left: 24px;
          line-height: 23px;
        }

        &.el-table td {
          padding: 11px 0;
          font-size: 14px;
          color: #666666;
          position: relative;
        }

        &.el-table td .cell {
          padding-left: 24px;
          line-height: 23px;
        }

        .scope-opera-detail {
          display: flex;
          align-items: center;
        }
        .color-blue,
        .color-blue-blue,
        .color-red {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #358aff;
          letter-spacing: 0;
          display: flex;
          cursor: pointer;
          margin-right: 8px;
        }
        .color-red {
          color: #fe5161;
        }
      }
    }

    .pagination {
      text-align: right;
      padding: 12px 0;
    }
  }
}
</style>