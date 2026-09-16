<template>
  <div class="content">
    <div class="dataset-wrapper">
      <div class="dataset-content">
        <div class="search">
          <div class="body">
            <div class="main">
              <span class="leftList">客户列表（{{ list.length || 0 }}）</span>
            </div>
            <div class="btns" style="height: 32px">
              <el-input
                v-model="form.finaBrhName"
                placeholder="请输入客户名称"
                class="el-inputs"
                maxlength="50"
                clearable
              ></el-input>
              <el-button
                type="primary"
                size="small"
                @click="search"
                style="height: 32px; width: 64px; margin-left: 10px"
                >查询</el-button
              >
            </div>
          </div>
        </div>
        <div class="dataContent" v-loading="tableLoading">
          <div class="dataBox" v-for="item in list" :key="item">
            <div class="dataTop" @click="detail(item)">
              <div class="topLeft">客户</div>
              <div>
                <div class="topName">{{ item.finaBrhShortCode }}</div>
                <div class="topRight">
                  {{ item.finaBrhNo }}
                </div>
              </div>
            </div>
            <div class="dataMiddle">
              <div>数据字典：{{ item.fieldTotal || 0 }}</div>
              <div class="middleRight">
                未映射：{{ item.notMappingFieldTotal || 0 }}
              </div>
            </div>
            <div class="dataset-opera">
              <el-button size="mini" type="text" @click="doOperate(item)"
                >对标管理</el-button
              >
            </div>
          </div>
        </div>
        <pagePagination
          @size-change="paginationChange"
          @current-change="currentChange"
          :pager="pager"
        >
        </pagePagination>
      </div>
    </div>
  </div>
</template>
  
  <script>
import mixin from "@m/core/mixin";
import pagePagination from "@m/core/components/page_pagination";
export default {
  mixins: [mixin],
  components: { pagePagination },
  data() {
    return {
      tableLoading: false, //列表加载

      list: [],
      form: {
        finaBrhName: "",
      },
      pager: {
        //页码信息
        pageSizes: [20, 40, 80],
        turnPageShowNum: 20,
        currentPage: 1,
        total: 0,
      },
    };
  },
  created() {
    this.qryFinaBranchList();
  },
  methods: {
    doOperate(row = {}) {
      this.$router.push({
        path: "/aop_tradedesign/datadict/benchmanage",
        query: {
          finaBrhNo: row.finaBrhNo,
          finaBrhName: row.finaBrhName,
          finaBrhShortCode: row.finaBrhShortCode,
        },
      });
    },

    detail(info) {},

    async qryFinaBranchList() {
      this.tableLoading = true;
      let { finaBrhName } = this.form;
      let params = {
        finaBrhName,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const data = await this.rpc.datadict.qryFinaBranchList(params);
      this.list = data.finaBranchDictBeanList;
      this.pager.total = Number(data.turnPageTotalNum || 0);
      this.tableLoading = false;
    },
    // 切换每页条数
    paginationChange(val) {
      this.pager.turnPageShowNum = val;
      this.pager.currentPage = 1;
      this.qryFinaBranchList();
    },
    // 切换页码
    currentChange(val) {
      this.pager.currentPage = val;
      this.qryFinaBranchList();
    },
    search() {
      this.qryFinaBranchList();
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.content {
  height: 100%;
  padding: 16px;
  .search {
    background: #ffffff;
    border-radius: 4px;
    margin-bottom: 14px;
    .body {
      padding: 16px 24px 8px 24px;
      display: flex;
      flex-wrap: wrap;
      .btns {
        display: flex;
      }

      .main {
        flex: 1;
        ::v-deep .el-input,
        ::v-deep .el-select {
          width: 180px;
        }

        ::v-deep .el-form-item__label {
          color: #000;
          font-family: PingFangSC-Regular;
        }

        ::v-deep .el-form-item {
          margin-bottom: 0px;
        }
      }
    }
  }
  .leftList {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 600;
    margin-right: 10px;
    line-height: 24px;
  }

  .dataContent {
    display: grid;
    grid-template-columns: 33.1% 33.1% 33.1%;
    justify-items: center;
    grid-gap: 12px 0.7%;
    .dataBox {
      cursor: pointer;
      width: 100%;
      border-radius: 4px;
      background: #fff;
      border-radius: 4px;
      padding: 16px 24px 0 24px;
      .dataMiddle {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 16px 0;
        .middleRight {
          color: #e62c0c;
        }
      }
      .dataTop {
        display: flex;
        align-items: center;
        .topLeft {
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 48px;
          height: 48px;
          border-radius: 4px;
          background: #597ef7;
          color: #fff;
        }
        .topName {
          margin-left: 20px;
          height: 20px;
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #333333;
          letter-spacing: 0;
          line-height: 20px;
          font-weight: 600;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .topRight {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.65);
          line-height: 20px;
          font-weight: 400;
          background: #f5f5f5;
          border: 0.5px solid rgba(217, 217, 217, 1);
          border-radius: 2px;
          padding: 2px 4px;
          text-align: center;
          margin-left: 20px;
        }
      }
    }
  }
}

::v-deep .el-input__inner {
  height: 32px; /* 设置输入框的高度 */
}
.dataset-opera {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #e8e8e8;
  height: 48px;
  ::v-deep .el-button--text {
    font-size: 14px;
  }
  .btn-delete {
    color: #fe4758;
  }
}
</style>
  