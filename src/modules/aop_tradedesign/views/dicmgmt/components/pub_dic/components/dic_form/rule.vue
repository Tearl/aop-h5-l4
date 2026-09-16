<template>
  <div class="aop_tradedesign_comps_dicmgmt_dic_form_rule">
    <div class="input_wrapper">
      <div class="top_right_create" v-if="bizType == 'edit'">
        <el-button type="primary" icon="el-icon-plus" @click="showDialog"
          >配置验证规则</el-button
        >
        <el-tag size="small" type="warning"
          >配置多条规则时必须都满足才能校验成功</el-tag
        >
      </div>
      <!-- <Table
        class="table_style"
        :data="configData"
        :table="configTable"
        @operate="operate"
      ></Table> -->
      <Table
        ref="ruleTableRef"
        class="table_style"
        :table="tables"
        :data="ruleTableData"
        rowK="ruleId"
        @operate="operate"
      ></Table>
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
          :serviceForm="serviceForm"
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
import { unduplicated } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    PageHeader,
    TableHeader
  },
  props: {
    bizType: {
      type: String,
      default: () => "edit",
    },
  },
  data() {
    return {
      //枚举值参数列表
      enumerateValueTable: [
        {
          prop: "key",
          label: "枚举值",
          minWidth: "15%",
          type: "text",
        },
        {
          prop: "value",
          label: "内容",
          minWidth: "50%",
          type: "text",
          tooltip: true,
        },
        {
          label: "操作",
          width: "110",
          type: "button",
          buttonList: [
            {
              desc: "编辑",
              operate: "edit",
            },
            {
              desc: "删除",
              operate: "delete",
            },
          ],
        },
      ],
      //控制显示添加枚举值弹框
      enumerateValueVisible: false,
      //枚举值列表数据
      enumerateValueList: [],
      //枚举值输入数据
      enumerateValueForm: {
        enumerateValue: "",
        stepContent: "",
      },
      //枚举值规则校验
      enumerateValueRules: {
        enumerateValue: [{ required: true, message: "请输入枚举值", trigger: "blur" }],
        stepContent: [{ required: true, message: "请输入内容", trigger: "blur" }],
        
      },
      // 弹框标题
      dialogTitle: "",
      // 点击编辑时当前行的数据
      isData: "",

      // 添加验证规则弹框
      addRuleDialogVisible: false,
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
      addRuleForm: {
        content: "", // 名称,id,描述
        // paraClassifyId: "", // 所属分类id
      },
      // 搜索表单记录(点击搜索按钮后保存)
      addRuleSearchRecord: {
        content: "", // 编号或名称或描述
        // paraClassifyId: "", // 所属分类id
      },
      // 添加验证规则分页器
      addRulePager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
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
      // 已选参数数组
      tableData: [],
      // 当前选择的数据组
      selectionData: [],
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
        // {
        //   width: "120",
        //   prop: "dictCount",
        //   label: "关联数据字典数",
        //   type: "textClick",
        //   align: "center",
        //   operate: "read"
        // },
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
    };
  },
  methods: {
    operate(op, data) {
      console.log(op, data);
      if (op == "delete") {
        this.ruleTableData = this.ruleTableData.filter(item => item.ruleId != data.ruleId)
      } else {
      }
    },
    // 点击添加规则按钮
    showDialog() {
      this.addRuleGetList()
      this.getRuleClassification()      
      this.dialogTitle = "配置验证规则";
      this.addRuleDialogVisible = true;
    },
    // 配置验证规则关闭时触发
    closeDialog() {
      this.$refs.addRuleformRef.resetFields();
      this.addRuleDialogVisible = false;
    },
    // 添加弹框确定
    confirm() {
      this.ruleTableData = unduplicated(this.ruleTableData.concat(this.tableData), "ruleId")
      this.addRuleDialogVisible = false;
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
    // 获取未配置验证规则数据列表
    async addRuleGetList() {
      const data = {
        qCondition: this.addRuleSearchRecord.content ? this.addRuleSearchRecord.content : "",
        paraClassifyId: this.addRuleSearchRecord.paraClassifyId
          ? this.addRuleSearchRecord.paraClassifyId
          : "",
        dictryId: "",
        currentPage: this.addRulePager.currentPage + "",
        turnPageShowNum: this.addRulePager.turnPageShowNum,
      };
      const res = await this.rpc.systemmgmt.notConfiguredList(data);
      this.configData = res.ruleDefinedInfoPageList;
      this.addRulePager.total = res.turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableData();
      });
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
        this.serviceForm.find((item) => item.model == "paraClassifyId").select =
        selectList;
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
  },
  created() {
    this.enumerateValueTable[2].type = this.bizType == "read" ? "" : "button";
    if (this.enumerateValueTable[2].type == "") {
      this.enumerateValueTable[2].label = "";
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_dic_form_rule {
  .top_right_create {
    ::v-deep .el-button {
      @include large_button_common;
    }
  }
  .box {
    margin: 24px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mt20 {
    margin-top: 20px;
  }
  ::v-deep .el-textarea__inner {
    width: 520px;
  }
  .table_style {
    margin-top: 16px;
    ::v-deep .el-table th {
      line-height: 0;
      color: $sec_ft_color;
    }
  }
  .dialog {
    .service_top {
     padding: 0; 
    }
    ::v-deep .el-input {
      .el-input__inner {
        padding-left: 30px!important;
      }
    }
    ::v-deep .el-select {
      .el-input {
        width: 120px!important;
        .el-input__inner {
          padding-left: 10px!important;
        }
      }
    }
    ::v-deep .el-pagination {
      .el-pagination__editor {
        width: 46px!important;
        .el-input__inner {
          padding-left: 3px!important;
        }
      }
    }
  }
}
</style>