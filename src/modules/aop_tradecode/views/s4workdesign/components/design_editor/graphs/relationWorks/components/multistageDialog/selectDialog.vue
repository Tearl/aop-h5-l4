<template>
  <PageDialog
    :dialogWidth="'1002px'"
    :dialogTitle="activeName == 'second' ? '选择凭证' : '从业务对象中选择'"
    :dialogVisiable="dialogVisiable && !voucherVisiable"
    @closeDialog="tabsCanel"
    :clickModal="false"
  >
    <div slot="box" class="aop_asset_interfaceManagement__component_tabs">
      <SearchTop
        v-if="activeName == 'second'"
        ref="formRef"
        :serviceForm="serviceForm"
        :form="searchForm"
        @service="search"
        style="
          box-shadow: inset 0px -1px 0px 0px rgba(231, 231, 238, 1);
          margin-bottom: 14px;
        "
      >
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
      </SearchTop>
      <SearchTop
        v-else
        ref="formRef"
        :serviceForm="serviceObjForm"
        :form="searchObjForm"
        @service="search"
        style="
          box-shadow: inset 0px -1px 0px 0px rgba(231, 231, 238, 1);
          margin-bottom: 14px;
        "
      >
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
      </SearchTop>
      <div class="m-title">
        <el-button
          v-if="activeName == 'second'"
          type="primary"
          @click="addVocher"
          icon="el-icon-plus"
          style="margin-left: 25px"
          class="right_button"
          >新建凭证</el-button
        >
        <!-- 去掉新建对象按钮 -->
        <!-- <el-button
          v-if="activeName == 'fifth' || activeName == 'third'"
          type="primary"
          @click="addObject"
          icon="el-icon-plus"
          style="margin-left: 25px"
          class="right_button"
          >新建对象</el-button
        > -->
      </div>

      <Table
        ref="dictryTable"
        :tableType="$parent.navTwo ? '' : 'selection'"
        :rowK="activeName == 'second' ? 'voId' : 'objId'"
        height="530px"
        :tableLoading="tableLoading"
        :table="activeName == 'second' ? vouchColumnList : columnList"
        :data="tableData"
        @operate="operate"
        @selectionChange="tableSelectionChange"
        @radioChange="tableRadioChange"
      ></Table>

      <PagePagination
        @size-change="paginationChange"
        @current-change="getDictionaryList"
        :pager="pager"
      >
      </PagePagination>
    </div>
    <template slot="footer">
      <div v-if="selectedtData.length > 0" class="search-content-foot-check">
        <div class="search-content-foot-check-content">
          <label>已选择{{ selectedtData.length }}个：</label>
          <div v-for="(item, index) in selectedtData" :key="index">
            <span @click="deleteCheck(index)">{{
              item.objName || item.voucherName
            }}</span>
          </div>
        </div>
      </div>
      <div>
        <el-button @click="tabsCanel">取 消</el-button>
        <el-button type="primary" @click="tabsConfirm">确 定</el-button>
      </div>
    </template>
  </PageDialog>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "./../../../bizWorks/components/detail_tabs/page_table"; // 公共表格组件
import PagePagination from "@m/core/components/page_pagination";
import PageDialog from "./../../../bizWorks/components/detail_tabs/page_dialog";
import SearchTop from "./../../../bizWorks/components/detail_tabs/page_search_top";
export default {
  mixins: [mixin],
  components: {
    Table,
    PagePagination,
    PageDialog,
    SearchTop,
  },
  props: {
    dialogVisiable: {
      //表格列表列头
      default: () => false,
      type: Boolean,
    },
    voucherVisiable: {
      //表格列表列头
      default: () => false,
      type: Boolean,
    },
    activeName: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      tableLoading: false, // 字段选择表格是否加载
      showFlag: false,
      selectedtData: [], //已选中表格数据
      tableData: [], // 字段选择表格数据
      columnList: [
        // 字段选择表格列表参数
        {
          prop: "objId",
          label: "",
          width: "35",
          type: "radio",
          show: this.$parent.navTwo,
        },
        {
          prop: "objName",
          label: "对象名称",
          minWidth: "100",
          type: "text",
          tooltip: true,
        },
        {
          prop: "objCode",
          minWidth: "100",
          label: "编码",
          type: "text",
          tooltip: true,
        },
        {
          prop: "objType",
          filter: "objType",
          label: "对象类型",
          minWidth: "100",
          type: "text",
          tooltip: true,
        },
        {
          prop: "objClass",
          filter: "objClass",
          label: "分类",
          minWidth: "100",
          type: "text",
          tooltip: true,
        },
        {
          prop: "userName",
          filter: "paraTyp",
          label: "更新人",
          minWidth: "100",
          align: "center",
          type: "text",
        },
      ],
      vouchColumnList: [
        // 字段选择表格列表参数
        {
          prop: "voucherName",
          label: "凭证名称",
          minWidth: "120",
          type: "text",
          tooltip: true,
        },
        {
          prop: "voId",
          minWidth: "100",
          label: "凭证ID",
          type: "text",
          tooltip: true,
        },
        {
          prop: "voucherType",
          filter: "voucherType",
          label: "凭证类型",
          minWidth: "100",
          type: "text",
          tooltip: true,
        },
        {
          prop: "voucherDesc",
          label: "凭证描述",
          minWidth: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "createUserName",
          label: "更新人",
          minWidth: "100",
          align: "center",
          type: "text",
        },
      ],
      pager: {
        // 字段选择表格页码信息
        turnPageShowNum: 10,
        currentPage: 1,
        total: 0,
      },
      iInputList: [],
      // 添加输入参数列表参数

      serviceForm: [
        {
          type: "input",
          model: "voucherName",
          placeholder: "请输入",
          label: "凭证名称/ID：",
          style: {
            width: "170px",
          },
        },
        {
          type: "select",
          model: "voucherType",
          disabled: this.$parent.flowPathType == "5" ? false : true,
          label: "凭证类型：",
          placeholder: "全部",
          select: [
            { type: "业务凭证", value: "00" },
            { type: "系统凭证", value: "01" },
          ],
        },
        {
          type: "input",
          model: "createUserName",
          placeholder: "请输入",
          label: "更新人： ",
          style: {
            width: "170px",
          },
        },
      ],

      serviceObjForm: [
        {
          type: "input",
          model: "objName",
          placeholder: "请输入",
          label: "对象名称/编码： ",
          style: {
            width: "170px",
          },
        },
        {
          type: "select",
          model: "objType",
          label: "对象类型：",
          placeholder: "全部",
          select: [
            { type: "实体对象", value: "00" },
            { type: "值对象", value: "01" },
          ],
        },
        {
          type: "select",
          model: "objClass",
          label: "分类",
          placeholder: "全部",
          select: [
            { type: "用户", value: "1" },
            { type: "机构", value: "2" },
            { type: "渠道", value: "3" },
            { type: "产品", value: "4" },
            { type: "合约", value: "5" },
            { type: "系统", value: "6" },
          ],
        },
        {
          type: "input",
          model: "userName",
          placeholder: "请输入",
          label: "更新人： ",
          style: {
            paddingLeft: "48px",
            width: "170px",
          },
        },
      ],
      // 搜索信息表单
      searchForm: {
        voucherName: "", // 编号或名称或描述
        voucherType: "", //属性类型
        createUserName: "", // 类型
      },
      searchObjForm: {
        objName: "", // 编号或名称或描述
        objType: "",
        objClass: "", //属性类型
        userName: "", // 类型
      },
      bkId: "", // 银行ID
      sysId: "", // 系统ID
    };
  },
  methods: {
    // 查询事件
    search() {
      this.pager.currentPage = "1";
      this.getDictionaryList();
    },
    // 重置事件
    reset() {
      this.searchForm = {
        voucherName: "", // 编号或名称或描述
        voucherType: "", //属性类型
        createUserName: "", // 类型
      };
      this.searchObjForm = {
        objName: "", // 编号或名称或描述
        objType: "",
        objClass: "", //属性类型
        userName: "", // 类型
      };
    },
    // 弹窗取消事件
    tabsCanel() {
      this.$emit("tabsCanel");
    },
    // 弹窗确定事件
    tabsConfirm() {
      if (this.selectedtData.length === 0)
        return this.$message.error("您未选择数据");
      this.changeColumnParams();
    },

    // 现有数据修改
    changeColumnParams() {
      //  选择字典的数据
      this.$emit("tabsConfirm", this.selectedtData);
    },

    // 选中字段数据变化时
    tableSelectionChange(val) {
      this.selectedtData = val;
    },
    tableRadioChange(val) {
      this.tableData.map((item) => {
        if (Number(item.objId) == Number(val)) {
          this.selectedtData = [];
          this.selectedtData.push(item);
        }
      });
    },
    //清除全选
    cleanSelectAll() {
      this.$refs.dictryTable.clearSelection();
    },

    // 页码变化时
    paginationChange(val) {
      this.pager.turnPageShowNum = val;
      this.pager.currentPage = 1;
      this.getDictionaryList();
    },
    //获取字段列表
    getDictionaryList() {
      this.tableLoading = true;
      let data = Object.assign(this.pager, this.searchForm, this.searchObjForm);
      data.taskId = this.$route.query.taskId;
      if (this.activeName == "second") {
        this.rpc.graph.qryVoucherList(data).then((res) => {
          this.tableData = res.voucherInfoList;
          this.pager.total = Number(res.turnPageTotalNum);
          this.tableLoading = false;
        });
      }
      if (this.activeName == "fifth" || this.activeName == "third") {
        data.bizDomainNo = this.$route.query.bizDomainNo;
        this.rpc.graph.qryBizObjectListV2(data).then((res) => {
          this.tableData = res.objectInfos;
          this.pager.total = Number(res.turnPageTotalNum);
          this.$parent.targetData = this.tableData;
          this.tableLoading = false;
        });
      }
    },

    operate(operate, data, index) {
      if (this.activeName == "second") {
        switch (operate) {
          case "view":
            this.$parent.operateAction = "view";
            this.$parent.vouchers = data;
            this.$parent.voucherVisiable = true;
            break;
          case "edit":
            this.$parent.operateAction = "edit";
            this.$parent.vouchers = data;
            this.$parent.voucherVisiable = true;
            break;
          case "delete":
            this.$confirm("您确定删除当前凭证吗？", "删除提示").then(() => {
              if (
                this.$parent.valueFlowData.vouchers.find((item) => {
                  return item.voId == data.voId;
                })
              ) {
                this.$confirm("当前凭证已被关联，不允许删除？", "删除提示");
              } else {
                this.rpc.graph.delVoucher({ voId: data.voId }).then(() => {
                  this.$notify({
                    title: "成功",
                    message: "删除成功",
                    duration: 2000,
                    type: "success",
                  });
                  this.tableData.splice(index, 1);
                });
              }
            });
            break;
        }
      } else {
        switch (operate) {
          case "view":
            this.$parent.objectData = data;
            this.$parent.viewObjectVisible = true;
            break;
          case "edit":
            this.$parent.objectData = data;
            this.$parent.editObjectVisible = true;
            break;
          case "delete":
            this.$confirm("您确定删除当前对象吗？", "删除提示").then(() => {
              if (
                this.$parent.valueFlowData.objects.find((item) => {
                  return item.objId == data.objId;
                })
              ) {
                this.$confirm("当前凭证已被关联，不允许删除？", "删除提示");
              } else {
                this.rpc.graph.delBizObject({ objId: data.objId }).then(() => {
                  this.$notify({
                    title: "成功",
                    message: "删除成功",
                    duration: 2000,
                    type: "success",
                  });
                  this.tableData.splice(index, 1);
                });
              }
            });
            break;
        }
      }
    },
    //元数据取消选择
    deleteCheck(key) {
      let rows = this.selectedtData[key];
      if (rows) {
        this.$refs.dictryTable.toggleRowSelection(rows);
      } else {
        this.$refs.dictryTable.clearSelection();
      }
    },
    addVocher() {
      this.$parent.operateAction = "add";
      this.$parent.vouchers = { voucherDataInfoList: [] };
      this.$parent.voucherVisiable = true;
    },
    addObject() {
      this.$parent.addObjectVisible = true;
      this.$parent.objData = this.tableData;
    },
    columnListPush() {
      const userId = this.$store.state.userInfo.cstNo;
      this.vouchColumnList.push({
        label: "操作",
        minWidth: "120",
        type: "button",
        buttonList: [
          {
            desc: "查看",
            operate: "view",
          },
          {
            desc: "编辑",
            operate: "edit",
            relation: function (scope) {
              return scope.row.createUserId == userId;
            },
          },
          {
            desc: "删除",
            operate: "delete",
            relation: function (scope) {
              return scope.row.createUserId == userId;
            },
          },
        ],
      });
      this.columnList.push({
        minWidth: "120",
        label: "操作",
        type: "button",
        buttonList: [
          {
            desc: "查看",
            operate: "view",
          },
          {
            desc: "编辑",
            operate: "edit",
            relation: function (scope) {
              return scope.row.userId == userId;
            },
          },
          {
            desc: "删除",
            operate: "delete",
            relation: function (scope) {
              return scope.row.userId == userId;
            },
          },
        ],
      });
    },
  },
  created() {
    if (this.$parent.flowPathType == "5") {
      this.searchForm.voucherType = "";
    } else {
      this.searchForm.voucherType = "00";
    }
    this.search();
    this.columnListPush();
  },
  // filters: {
  //   ...filters,
  // },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_asset_interfaceManagement__component_tabs {
  .title {
    font-weight: bold;
    font-size: 1.2em;
    padding-bottom: 16px;
    color: #333333;
  }
  .d-flex-center {
    display: flex;
    justify-content: center;
    padding: 0 0 12px;
    margin: 0 0 20px -24px;
    border-bottom: 1px solid #dcdfe6;
    width: calc(100% + 48px);
  }
  .radio-text {
    min-width: 200px;
  }
  .el-select {
    width: 100%;
  }
}
.search-content-foot-check {
  color: #333333;
  line-height: 28px;
  .search-content-foot-check-content {
    display: flex;
    flex-wrap: wrap;
  }
  span {
    height: 28px;
    background: #f7f7f9;
    border-radius: 2px;
    padding: 0 6px;
    display: inline-block;
    margin-left: 3px;
    &:after {
      content: " ";
      display: inline-block;
      width: 16px;
      height: 16px;
      background: url("~@m/assets/assets/icon_关闭.png");
      background-size: cover;
      margin-left: 4px;
      vertical-align: middle;
    }
  }
}
.m-title {
  font-size: 16px;
  font-weight: 700;
  padding-bottom: 20px;
}
</style>
