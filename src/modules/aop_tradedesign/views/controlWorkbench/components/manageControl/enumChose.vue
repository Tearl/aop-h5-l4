<!-- 业务专题-关联规则-关联功能选择 -->
<template>
  <div class="aop_businessd2_comps_decision_list">
    <PageDialog
      dialogTitle="选择枚举值"
      :dialogVisiable="dialogVisible"
      dialogWidth="1000px"
      @closeDialog="closeDialog"
      class="dialog"
      :apTobody="true"
    >
      <div slot="box" class="content">
        <ServiceTop ref="formRef" :serviceForm="serviceForm" :form="form">
          <div slot="rightButton">
            <el-button
              type="primary"
              size="small"
              @click="search"
              class="right_button"
              >查询</el-button
            >
            <el-button size="small" @click="reset" class="right_button"
              >重置</el-button
            >
          </div>
        </ServiceTop>
        <div class="D2_workspace_common_table">
          <el-table :data="infoList" ref="multipleTable">
            <el-table-column width="55" align="center">
              <template slot-scope="scope">
                <div>
                  <el-radio
                    v-model="currentRadio"
                    :label="scope.row.enumCode"
                    @change="(e) => radioChange(e, scope.row)"
                    ><span></span
                  ></el-radio>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="enumName"
              label="枚举名称"
            >
              <template slot-scope="scope">
                {{ scope.row.enumName || "/" }}
              </template>
            </el-table-column>
            <el-table-column prop="enumCode" label="枚举编码">
            </el-table-column>
            <el-table-column label="操作" width="120px">
              <template slot-scope="scope">
                <span class="link" @click="look(scope.row)">查看</span>
              </template>
            </el-table-column>
          </el-table>
          <PagePagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager="pager"
          >
          </PagePagination>
        </div>
      </div>
      <template slot="footer">
        <div>
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
      </template>
    </PageDialog>
  </div>
</template>
  
  <script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
  },
  props: {},
  data() {
    return {
      dialogVisible: false,
      tableLoading: false, //表格加载状态
      currentRadio: "",
      serviceForm: [
        {
          type: "input",
          model: "enumCodeOrNm",
          placeholder: "请输入",
          labelText: "枚举名称：",
          style: { width: "170px" },
        },
      ],
      // 数据字典搜索信息表单
      form: {
        enumCodeOrNm: "",
      },
      // 数据字典搜索表单记录(点击搜索按钮后保存)
      // 分段列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 数据字典选择列表
      infoList: [],
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      // 已选
      asset: "",
    };
  },

  methods: {
    async showDialog(params) {
      console.log(params, "params");

      // data数据初始化
      this.dialogVisible = true;
      this.getTableData();
      if (params.enumCode) {
        this.asset = this.infoList.filter(
          (e) => e.enumCode == params.enumCode
        )[0];
      }
    },
    // 点击搜索按钮
    search() {
      this.isRecord = true;

      this.pager.currentPage = "1";
      this.getTableData();
    },
    // 点击重置按钮
    reset() {
      this.pager.currentPage = "1";
      this.form = {
        functionIdOrNm: "", //功能名称/ID
      };
      this.$refs.formRef.resetFields();
      this.getTableData();
    },
    // 获取字典列表数据
    getTableData() {
      this.tableLoading = true;
      this.rpc.datadict
        .qryEnumDictionaryList({
          currentPage: this.pager.currentPage + "",
          turnPageShowNum: this.pager.turnPageShowNum,
          ...this.form,
        })
        .then((res) => {
          this.pager.total = Number(res.totalNum || 0);
          this.infoList = res.infoList || [];
          //   this.$nextTick(() => {
          //     this.isTableData();
          //   });
        })
        .catch((err) => {})
        .finally(() => {
          this.tableLoading = false;
        });
    },
    look(info) {
      let link = this.$router.resolve({
        path: "/aop_tradedesign/datadict/neumEdit",
        query: {
          action: "look",
          queryType: "3",
          enumCode: info.enumCode,
        },
      });
      window.open(link.href, "_blank");
    },
    // 数据字典选择每页条数改变时
    handleSizeChange(e) {
      this.isRecord = true;
      this.pager.turnPageShowNum = e;
      this.getTableData();
    },
    // 数据字典选择当前页改变时
    handleCurrentChange(e) {
      this.isRecord = true;
      this.getTableData();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    async confirm() {
      if (!this.asset) {
        this.$message.error("请选择枚举值");
        return false;
      }
      this.closeDialog();
      this.$emit("changeEnumList", this.asset.enumCode);
      this.asset = "";
    },
    radioChange(e, row) {
      this.asset = row;
    },
  },
};
</script>
  
  <style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_businessd2_comps_decision_list {
  .content {
    padding: 0px 24px 24px;
  }
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
    }
  }

  ::v-deep .el-form-item__label {
    width: 86px !important;
  }
}
.dialog {
  .content {
    padding: 0px 24px 24px;
  }
  ::v-deep.el-dialog {
    margin-top: 3vh !important;
  }
  ::v-deep.el-dialog__body {
    max-height: 78vh;
  }
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
      span {
        color: #358aff;
      }
    }
    .show_conf_content {
      float: left;
    }
    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .table_operate {
    margin-top: -24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    h1 {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #111111;
      font-weight: 500;
      span {
        margin-left: 7px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #b8b8b8;
        line-height: 16px;
        font-weight: 400;
      }
    }
  }

  ::v-deep .el-dialog .el-dialog__body {
    padding: 0px !important;
  }

  ::v-deep .el-form-item__label {
    width: 106px !important;
  }
  ::v-deep .show_conf {
    padding: 15px 0px;
    overflow: hidden;
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: 16px;
    // box-shadow: inset 0 1px 0 0 #F5F5FA;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
      span {
        color: #358aff;
      }
    }
    .show_conf_content {
      float: left;
    }
    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
/deep/.el-table {
  .el-table__body tr {
    cursor: pointer;
  }

  th {
    color: rgb(51, 51, 51);
    background: #f5f5f8;
    font-size: 14px;
    padding: 8px 0;
  }

  th .cell {
    padding-left: 24px;
    line-height: 23px;
  }

  td {
    height: 48px;
    padding: 12px 0;
    font-size: 14px;
    color: #666666;
    position: relative;
  }

  td .cell {
    padding-left: 24px;
    line-height: 23px;
  }
}
.link {
  color: #358aff;
  cursor: pointer;
}
</style>
  