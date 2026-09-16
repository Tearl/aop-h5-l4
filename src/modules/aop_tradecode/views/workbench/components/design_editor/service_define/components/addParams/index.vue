<template>
  <div class="aop_businessd2_comps_decision_list">
    <el-drawer
      :visible.sync="dialogVisible"
      :size="900"
      @closeDialog="handleClose"
      :with-header="false"
      :append-to-body="true"
      class="dialog"
    >
      <div class="content-wrapper">
        <el-tabs v-model="activeName">
          <el-tab-pane label="从数据字典选择" name="first">
          <ServiceTop ref="formRef" :serviceForm="serviceForm" :form="searchForm" labelwidth="138px" style="padding: 0;">
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
          <el-button type="primary" style="margin-bottom: 10px;"   @click="doOperate">新增数据字段</el-button>
          <div class="D2_workspace_common_table">
            <el-table
              :data="infoList"
              ref="multipleTableTwo"
              v-loading="tableLoadingTwo"
              @selection-change="handleSelectionChangeTwo"
            >
              <el-table-column
                type="selection"
                fixed
                width="52"
                align="center"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="fieldKeyName"
                label="字段简称"
              >
                <template slot-scope="scope">
                  {{ scope.row.fieldKeyName || "/" }}
                </template>
              </el-table-column>
              <el-table-column prop="fieldName" label="字段名称">
                <template slot-scope="scope">
                  {{ scope.row.fieldName || "/" }}
                </template>
              </el-table-column>
              <el-table-column prop="fieldBusiness" label="业务定义">
                <template slot-scope="scope">
                  {{ scope.row.fieldBusiness || "/" }}
                </template>
              </el-table-column>
              <el-table-column prop="fieldRule" label="业务规则">
                <template slot-scope="scope">
                  {{ scope.row.fieldRule || "/" }}
                </template>
              </el-table-column>
              <!-- <el-table-column
                prop="address"
                label="操作"
                min-width="60px"
                fixed="right"
              >
                <template slot-scope="scope">
                  <div class="button">
                    <span
                      @click="doOperate(scope.row)"
                      class="OperateTextR"
                      >查看</span
                    >
                  </div>
                </template>
              </el-table-column> -->
            </el-table>
            <PagePagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :pager="pager"
            >
            </PagePagination>
          </div>
          <div class="info-bottom-handle" >
            <el-button type="default" plain size="medium" @click="handleClose">
              取消
            </el-button>
            <el-button
              class="ml24"
              type="primary"
              size="medium"
              @click="handleConfirm"
            >
              确定
            </el-button>
          </div>
          </el-tab-pane>
        
        </el-tabs>
      </div>
    
    </el-drawer>
  </div>
</template>
  
  <script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "./dialog";
export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
  },
  data() {
    return {
      activeName: "first",
      dialogVisible: false,
      tableLoadingTwo: false,
      serviceForm: [
        {
          type: "input",
          model: "fieldName",
          placeholder: "请输入字段名称、中文名或描述",
          style: {
            width: "260px",
          },
        },
        {
          type: "switch",
          model: "likeFlag",
          label: "精确查询",
          activeValue: "1",
          inactiveValue: "0",
          style: {
            width: "260px",
          },
        },
        {
          type: "select",
          model: "fieldType",
          placeholder: "参数类型",
          select: [
            {
              label: "String",
              value: "String",
            },
            {
                label: "Integer",
                value: "Integer",
            },
            {
                label: "Long",
                value: "Long",
            },
            {
                label: "Double",
                value: "Double",
            },
            {
                label: "Date",
                value: "Date",
            },
            {
                label: "Boolean",
                value: "Boolean",
            },
            {
                label: "BigDecimal",
                value: "BigDecimal",
            },
            {
                label: "Float",
                value: "Float",
            },
            {
                label: "Char",
                value: "Char",
            },
            {
                label: "Byte",
                value: "Byte",
            },
            {
                label: "Short",
                value: "Short",
            },
            {
                label: "File",
                value: "File",
            },
          ],
        },
      ],
      searchForm: {
        fieldName: "",
        fieldType: "",
        likeFlag: "1",
      },
      infoList: [],
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      secondSelectList: [],
      pageInfo:{}
    };
  },
  created() {
  },

  methods: {
    async showDialog(info={}) {
      this.pageInfo = info
      this.dialogVisible = true;
      this.qryDataDictionaryFieldMappingdList();
    },
    doOperate(){
       window.open(
          `/aop-h5-sub/#/aop_tradedesign/datadict/dataFieldManage`,
          "_blank"
        );
        // ?apiId=${data.ifId}&mappingType=0&currentType=S4&mode="view"
    },
    handleSelectionChangeTwo(row) {
      this.secondSelectList = row;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 点击搜索按钮
    search() {
      this.pager.currentPage = "1";
      this.qryDataDictionaryFieldMappingdList();
    },
    // 点击重置按钮
    reset() {
      this.pager.currentPage = "1";
      this.searchForm = {
        fieldName: "",
        fieldType: "",
        likeFlag: "1",
      };
      this.$refs.formRef.resetFields();
      this.qryDataDictionaryFieldMappingdList();
    },

    qryDataDictionaryFieldMappingdList() {
      this.tableLoadingTwo = true;
      this.rpc.d4
        .dataDictionaryFieldListQuery({
          queryType: "3", // 1数据字典管控 2数据字段管理 3其他
          likeFlag: this.searchForm.likeFlag,
          fieldFlag: '2', // 字段标志 1：老字段；2：新标准字段
          currentPage: this.pager.currentPage,
          turnPageShowNum: this.pager.turnPageShowNum,
          ...this.searchForm,
        })
        .then((res) => {
          this.infoList = res.dictionaryFiledLists || [];
          this.pager.total = Number(res.turnPageTotalNum || 0);
        })
        .catch((err) => {})
        .finally(() => {
          this.tableLoadingTwo = false;
        });
    },

    // 数据字典选择每页条数改变时
    handleSizeChange(e) {
      this.pager.turnPageShowNum = e;
      this.qryDataDictionaryFieldMappingdList();
    },
    // 数据字典选择当前页改变时
    handleCurrentChange(e) {
      this.pager.currentPage = e;
      this.qryDataDictionaryFieldMappingdList();
    },

    handleConfirm() {
      this.$emit("confirm", {data:this.secondSelectList,extraData:{}});
      this.handleClose();
    },
  },
};
</script>
  
  <style lang="scss" scoped>
@import "./css/mixin.scss";
@import "./css/common.scss";
.aop_businessd2_comps_decision_list {
  ::v-deep .el-form-item__label {
    width: 86px !important;
  }
}
.content-wrapper {
  padding: 8px 24px;
  margin-bottom: 72px;
}

.info-bottom-handle {
  position: fixed;
  bottom: 0;
  width: stretch;
  background: #ffffff;
  flex: none;
  height: 72px;
  z-index: 100;
  box-shadow: inset 0px 1px 0px 0px rgba(245, 245, 250, 1);
  @extend .flex-center;
  ::v-deep .el-button {
    width: 112px;
    height: 40px;
    border-radius: 2px;
  }
}

.switch-style {
  color: #333333;
  display: flex;
  align-items: center;
}

// ::v-deep .el-radio__label {
//   display: none;
// }
.table-header {
  padding: 16px 0;
}
.recommend-wrapper {
  font-size: 12px;
  color: #999999;
  .recommend-title {
    font-size: 14px;
    color: rgb(51, 51, 51);
  }
  .recommend-content.show {
    color: #ff9d00;
  }
}
.current-font {
  font-weight: bolder;
  font-size: 14px;
  color: rgb(51, 51, 51);
  &.marginleft {
    margin-left: 60px;
  }
  .font-content {
    font-size: 14px;
    font-weight: normal;
  }
}

.dialog {
  ::v-deep .el-dialog__header {
    display: none;
  }

  .content {
    padding: 8px 24px 24px;
  }
  ::v-deep.el-dialog {
    margin-top: 3vh !important;
  }
  ::v-deep.el-dialog__body {
    max-height: 78vh;
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
::v-deep .el-tabs__item:focus.is-active.is-focus:not(:active) {
  box-shadow: none !important;
}
.OperateTextR {
  cursor: pointer;
  width: 28px;
  height: 16px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #358aff;
  letter-spacing: 0;
  line-height: 16px;
  font-weight: 400;
}
</style>
  