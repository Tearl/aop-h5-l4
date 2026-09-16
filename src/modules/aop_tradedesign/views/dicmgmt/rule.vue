<template>
  <div class="aop_tradedesign_page_dicmgmt_rule">
    <!-- <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader> -->
    <div class="create_content_wrapper">
      <div class="detail_content">
        <TableHeader
          title="已配置验证规则"
          :btnList="btnList"
          @btnClick="handleBtnClik"
        ></TableHeader>
        <Table
          ref="ruleTableRef"
          :table="tables"
          @operate="operate"
          :data="ruleTableData"
          rowK="ruleId"
        ></Table>
      <PagePagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pager="pager"
      >
      </PagePagination>
      </div>
    </div>
    <!-- 配置验证规则 -->
    <PageDialog
      dialogTitle="添加验证规则"
      :dialogVisiable="addRuleDialogVisible"
      dialogWidth="70%"
      @closeDialog="closeDialog"
      class="dialog"
    >
      <div slot="box">
        <ServiceTop
          ref="addRuleformRef"
          :serviceForm="addRuleServiceForm"
          :form="addRuleForm"
          class="service_top"
        >
          <div slot="rightButton">
            <el-button
              type="primary"
              size="small"
              @click="addRuleSearch"
              class="right_button"
              >搜索</el-button
            >
            <el-button size="small" @click="resetSearch" class="right_button"
              >重置</el-button
            >
          </div>
        </ServiceTop>
        <Table
          class="table_style"
          ref="configTableRef"
          :table="configTable"
          :data="configData"
          tableType="selection"
          rowK="ruleId"
          @selectionChange="selectionChange"
        ></Table>
        <PagePagination
          @size-change="addRuleHandleSizeChange"
          @current-change="addRuleHandleCurrentChange"
          :pager="addRulePager"
        >
        </PagePagination>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </PageDialog>

    <!-- 关联数据字典数 -->
    <DictionaryCount
      ref="dictionaryCountRef"
      :dialogVisiable="dictionaryCountDialogVisiable"
      @closeDialog="dictionaryCountCloseDialog"
    ></DictionaryCount>

    <PageFooter>
      <div slot="box">
        <el-button @click="handleCancel" v-if="this.type == 'public'">返 回</el-button>
        <!-- <el-button type="primary" @click="preservation">提 交</el-button> -->
      </div>
    </PageFooter>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import PageHeader from "@m/core/components/page_header";
import TableHeader from "@m/core/components/page_table_header";
import PageFooter from "@m/core/components/page_footer";
import { unduplicated } from "@m/utils/array";
import DictionaryCount from "./components/sys_dic/components/dic_rule/count";


export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    PageHeader,
    TableHeader,
    DictionaryCount,
    PageFooter
  },
  props: {
    sysId: {
      type: String,
      default: () => ""
    },
    dictryId: {
      type: String,
      default: () => ""
    },
    pageType: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      // 导航栏参数
      breadcrumbs: [],
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索规则名称、中文名或描述",
          style: {
            width: "260px",
          },
        },
        // {
        //   type: "select",
        //   model: "paraClassifyId",
        //   placeholder: "所属分类",
        //   select: [],
        //   filterable: true,
        // },
      ],
      // 搜索信息表单
      form: {
        content: "", // 名称,id,描述
        // paraClassifyId: "", // 所属分类id
      },
      // 搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        content: "", // 编号或名称或描述
        // paraClassifyId: "", // 所属分类id
      },
      // 表格头部按钮
      btnList: [
        {
          name: "添加验证规则",
          value: "create",
          type: "primary",
          imgSrc: "",
          iconClass: "el-icon-plus",
        },
      ],
      // 验证规则列表参数
      tables: [
        {
          width: "120",
          prop: "ruleNo",
          label: "规则名称",
          type: "text",
        },
        {
          width: "150",
          prop: "ruleNm",
          label: "规则中文名称",
          type: "text",
        },
        {
          width: "200",
          prop: "ruleDescr",
          label: "规则描述",
          tooltip: true,
          type: "text",
        },
        // {
        //   width: "100",
        //   prop: "clsfCnNm",
        //   label: "所属分类",
        //   width: "90",
        //   type: "text",
        // },
        {
          width: "120",
          prop: "dictCount",
          label: "关联数据字典数",
          type: "textClick",
          align: "center",
          operate: "read"
        },
        {
          width: "160",
          prop: "ruleExps",
          label: "正则表达式",
          tooltip: true,
          type: "text",
        },
        {
          width: "160",
          prop: "ruleTip",
          label: "提示信息",
          type: "text",
          tooltip: true,
        },
        {
          width: "80",
          label: "操作",
          type: "button",
          fixed: "right",
          buttonList: [
            {
              desc: "删除",
              operate: "delete",
            },
          ],
        },
      ],
      // 验证规则列表信息
      ruleTableData: [],
      // 验证规则分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },

      // 添加验证规则弹框参数

      // 添加验证规则弹框
      addRuleDialogVisible: false,
      // 配置验证规则列表参数
      configTable: [
        {
          prop: "ruleNo",
          label: "规则名称",
          type: "text",
          tooltip: false,
        },
        {
          prop: "ruleNm",
          label: "规则中文名称",
          type: "text",
          tooltip: false,
        },
        {
          prop: "ruleDescr",
          label: "验证描述",
          type: "text",
          tooltip: true,
        },
        {
          prop: "ruleExps",
          label: "正则表达式",
          type: "text",
          tooltip: true,
        },
        {
          prop: "ruleTip",
          label: "提示信息",
          type: "text",
          tooltip: true,
        },
      ],
      // 验证规则列表数据
      configData: [],
      // 公共搜索
      addRuleServiceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索规则名称、中文名或描述",
          style: {
            width: "260px",
          },
        },
        // {
        //   type: "select",
        //   model: "paraClassifyId",
        //   placeholder: "所属分类",
        //   select: [],
        //   filterable: true,
        // },
      ],
      // 搜索信息表单
      addRuleForm: {
        content: "", // 名称,id,描述
        // paraClassifyId: "", // 所属分类id
      },
      // 搜索表单记录(点击搜索按钮后保存)
      addRuleSearchRecord: {
        content: "", // 编号或名称或描述
        paraClassifyId: "", // 所属分类id
      },
      // 添加验证规则分页器
      addRulePager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      // 已选参数数组
      tableData: [],
      // 当前选择的数据组
      selectionData: [],
      // 关联数据字典弹框
      dictionaryCountDialogVisiable: false,
      type: ""
    }
  },
  methods: {
    // 导航栏点击
    labelClick(e) {
      if(e == "list" && this.goType == "sys") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/view",
          query: {
            sysId: this.sysId,
            iconCurrent: "dictionary"
          }
        });
      } else {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list",
        });
      }
    },
    handleCancel() {
      if (this.type !== "public") {
        this.$emit("toDicList");
      } else {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list",
        });
      }
    },
    // 搜索按钮
    search() {
      Object.assign(this.searchRecord, this.form);
      this.pager.currentPage = "1";
      this.getList();
    },
    // 重置按钮
    reset() {
      this.$refs.formRef.resetFields();
    },
    // 规则分类的下拉列表
    async getRuleClassification() {
      const res = await this.rpc.systemmgmt.getRuleClassification();
      const selectList = res.rciList.map((item) => ({
        type: item.clsfCnNm,
        value: item.clsfId,
      }));
      this.serviceForm.find((item) => item.model == "paraClassifyId").select =
        selectList;
        this.addRuleServiceForm.find((item) => item.model == "paraClassifyId").select =
        selectList;
    },
    // 添加验证规则
    handleBtnClik() {
      this.addRuleGetList()
      this.addRuleDialogVisible = true
    },
    // 删除验证规则
    async operate(operation, data) {
      if (operation == "delete") {
        this.$confirm("是否删除该验证规则与数据字典的关系").then(async () => {
          const params = {
            dictryId: this.dictryId,
            ruleIdList: [{ruleId: data.ruleId}]
          }
          this.rpc.systemmgmt.deleteRuleRelation(params).then((res) => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              duration: 2000,
              type: "success",
            });
            this.getList()
          })
        });
      } else if (operation == "read") {
        await this.$refs.dictionaryCountRef.getList(data.ruleId)
        this.dictionaryCountDialogVisiable = true
      }
    },
    // 获取已配置验证规则列表
    async getList() {
      const data = {
        qCondition: this.searchRecord.content ? this.searchRecord.content : "",
        paraClassifyId: this.searchRecord.paraClassifyId
          ? this.searchRecord.paraClassifyId
          : "",
        dictryId: this.dictryId,
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const res = await this.rpc.systemmgmt.alreadyConfiguredList(data);
      this.ruleTableData = res.ruleList;
      this.pager.total = res.turnPageTotalNum * 1;
    },
    // 每页条数变化
    handleSizeChange(e) {
      this.pager.turnPageShowNum = e;
      this.getList();
    },
    // 当前页变化
    handleCurrentChange(e) {
      this.getList();
    },
    // 关联数据字典弹框关闭
    dictionaryCountCloseDialog() {
      this.dictionaryCountDialogVisiable = false
    },
    // 搜索按钮
    addRuleSearch() {
      Object.assign(this.addRuleSearchRecord, this.addRuleForm);
      this.addRulePager.currentPage = "1";
      this.isRecord = true;
      this.addRuleGetList();
    },
    // 重置按钮
    resetSearch() {
      this.$refs.addRuleformRef.resetFields();
    },
    // 配置验证规则关闭时触发
    closeDialog() {
      this.$refs.addRuleformRef.resetFields();
      this.addRuleDialogVisible = false;
    },
    // 获取未配置验证规则数据列表
    async addRuleGetList() {
      const data = {
        qCondition: this.addRuleSearchRecord.content ? this.addRuleSearchRecord.content : "",
        paraClassifyId: this.addRuleSearchRecord.paraClassifyId
          ? this.addRuleSearchRecord.paraClassifyId
          : "",
        dictryId: this.dictryId,
        currentPage: this.addRulePager.currentPage + "",
        turnPageShowNum: this.addRulePager.turnPageShowNum,
      };
      const res = await this.rpc.systemmgmt.notConfiguredList(data);
      this.configData = res.ruleDefinedInfoPageList;
      this.pager.total = res.turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableData();
      });
    },
    // 每页条数变化
    addRuleHandleSizeChange(e) {
      this.addRulePager.turnPageShowNum = e;
      this.isRecord = true;
      this.addRuleGetList();
    },
    // 当前页变化
    addRuleHandleCurrentChange(e) {
      this.isRecord = true;
      this.addRuleGetList();
    },
    // tableData数据选中表格中
    isTableData() {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item) => {
          this.configData.forEach((data) => {
            if (item.ruleId == data.ruleId) {
              this.isRecord = true;
              this.$refs.configTableRef.$refs.tableRef.toggleRowSelection(
                data
              );
            }
          });
        });
      }
    },
    selectionChange(e) {
      if (!this.isRecord && this.selectionData.length > e.length) {
        this.selectionData.forEach((item) => {
          if (e.indexOf(item) == -1) {
            this.tableData = this.tableData.filter(
              (it) => it.ruleId != item.ruleId
            );
          }
        });
      } else {
        this.tableData.push(...e);
        this.tableData = unduplicated(this.tableData, "ruleId");
      }
      this.selectionData = e;
      this.isRecord = false;
    },
    // 添加弹框确定
    confirm() {
      const params = {dictryId: this.dictryId, ruleIdList: []}
      this.tableData.forEach((item) => {
        params.ruleIdList.push({ruleId: item.ruleId})
      })
      this.rpc.systemmgmt.bindingRule(params).then((res) => {
        this.$notify({
          title: "成功",
          message: "添加成功",
          duration: 2000,
          type: "success",
        });
        this.addRuleDialogVisible = false;
        this.getList()
      })
    },
    getBtnState() {
      if (this.pageType == "read") {
        console.log("隐藏按钮")
        this.btnList = []
        this.tables = this.tables.filter(item => item.label != "操作")
      }
    },
    // 初始化
    init() {
      this.type = this.$route.query.type || ""
      if(this.type == "public") {
        this.dictryId = this.$route.query.dictryId
        this.sysId = this.$route.query.sysId
        this.pageType = this.$route.query.pageType
        this.getBtnState()
      }
      this.getList()
      this.getRuleClassification()
      // if(this.goType == "sys") {
      //   this.breadcrumbs = [
      //     {
      //       label: "应用数据字典",
      //       operate: "list"
      //     },
      //     {
      //       label: "配置验证规则",
      //     },
      //   ]
      // } else {
      //   this.breadcrumbs = [
      //     {
      //       label: "公共数据字典",
      //       operate: "list"
      //     },
      //     {
      //       label: "配置验证规则",
      //     },
      //   ]
      // }
      
      
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_dicmgmt_rule {
  .service_content {
    padding: 20px 24px 0;
  }
  .create_content_wrapper {
    padding: 16px 24px;
    .detail_content {
      background: $base_white;
      padding: 0 24px 24px;
      min-height: 78.5vh;
    }
  }
  .dialog .service_top {
    padding: 0;
  }
}
</style>
