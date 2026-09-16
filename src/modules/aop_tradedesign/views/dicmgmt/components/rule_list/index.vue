<template>
  <div class="aop_tradedesigncomps_rule_list">
    <div class="detail_content">
      <TableHeader
        title="验证规则管理"
        :btnList="btnList"
        @btnClick="handleBtnClik"
      ></TableHeader>
      <Table
        ref="ruleTableRef"
        :table="tables"
        @operate="operate"
        :data="ruleTableData"
        tableType="selection"
        rowK="ruleId"
        @selectionChange="selectionChange"
      ></Table>

      <PagePagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pager="pager"
      >
      </PagePagination>
    </div>

    <PageUploadBox
      dialogTitle="导入验证"
      :dialogVisiable="uploadDialog"
      dialogWidth="30%"
      :actionUrl="actionUrl"
      @download="download"
      @closeDialog="uploadDialog = false"
      @refresh="getList"
      @radioChange="radioChange"
    ></PageUploadBox>

    <PagePop
      desc="确定导出数据吗"
      :isPopCompleteShow="isExportPop"
      @handleCancel="closeExportPop"
      @handleConfirm="download('export')"
    ></PagePop>

    <!-- 迁移数据弹窗 -->
    <DataTransfer
      :dialogVisiable="transferDialog"
      :selectedData="selectedData"
      :searchForm="searchForm"
      :classifyOptions="classifyOptions"
      @closeDialog="transferDialog = false"
      @confirm="transferDialog = false"
      @getList="getList"
    >
    </DataTransfer>

    <PageDialog
      dialogTitle="测试验证"
      :dialogVisiable="testDialogVisible"
      dialogWidth="720px"
      @closeDialog="closeTestDialogVisible"
    >
      <div slot="box" class="page_dialog_center">
        <span class="test_top" v-show="testTextShow == 'true'">输入正确</span>
        <span
          class="test_top test_top_color"
          v-show="testTextShow == 'error'"
          >{{ testError }}</span
        >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleFormRef"
          label-width="82px"
          class="test_input"
        >
          <div class="form_info">
            <el-form-item label-width="100px" label="测试数据" prop="testinput">
              <el-input
                v-model="ruleForm.testinput"
                clearable
                placeholder="请输入测试数据"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="closeTestDialogVisible">取 消</el-button>
        <el-button type="primary" @click="testConfirm">确 定</el-button>
      </span>
    </PageDialog>
    
    <DictionaryCount
      ref="dictionaryCountRef"
      :dialogVisiable="dictionaryCountDialogVisiable"
      @closeDialog="dictionaryCountCloseDialog"
    ></DictionaryCount>
    
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageDialog from "@m/core/components/page_dialog";
import PageUploadBox from "@m/core/components/page_upload_box"; // 上传文件弹框
import Table from "@m/core/components/page_table"; // 公共表格组件
import PagePagination from "@m/core/components/page_pagination";
import DataTransfer from "./data_transfer";
import DictionaryCount from "./dictionary_count";
import TableHeader from "@m/core/components/page_table_header";
import PagePop from "@m/core/components/page_pop";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PageUploadBox,
    PagePagination,
    Table,
    DataTransfer,
    TableHeader,
    PagePop,
    DictionaryCount
  },
  props: {
    // 表单的搜索条件
    searchForm: {
      type: Object,
      default: () => ({}),
    },
    // 分类选择下拉列表
    classifyOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
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
        {
          width: "100",
          prop: "clsfCnNm",
          label: "规则分类",
          width: "90",
          type: "text",
        },
        {
          width: "160",
          prop: "dictCount",
          label: "关联元数据数",
          type: "textClick",
          align: "center",
          operate: "read"
        },
        {
          width: "160",
          prop: "ruleType",
          label: "规则类型",
          type: "text",
          filter: "ruleType",
        },
        {
          width: "160",
          prop: "ruleExps",
          label: "验证规则",
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
          width: "160",
          label: "操作",
          type: "button",
          fixed: "right",
          buttonList: [
            {
              desc: "测试",
              operate: "test",
            },
            {
              desc: "编辑",
              operate: "edit",
              // authName: "assetDispose:rule:edit",
            },
            {
              desc: "删除",
              operate: "delete",
              // authName: "assetDispose:rule:delete",
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
      // 文件上传对话框
      uploadDialog: false,
      // 迁移对话框
      transferDialog: false,
      // 测试对话框
      testDialogVisible: false,
      // 选中的数据
      selectedData: [],
      // 上传数据地址
      actionUrl: "",
      // 测试输入框表单
      ruleForm: {
        testinput: "",
      },
      // 规则
      rules: {
        testinput: [
          { required: true, message: "请输入测试数据", trigger: "blur" },
        ],
      },
      // 当前data
      isData: "",
      // 测试成功失败信息显示或隐藏
      testTextShow: "",
      // 测试失败提示信息
      testError: "",
      // 表格头部按钮
      btnList: [
        {
          name: "导入数据",
          value: "import",
          type: "normal",
          imgSrc: require("@m/assets/images/icon_import.png"),
          iconClass: "",
          // authName: "assetDispose:rule:import",
        },
        {
          name: "导出数据",
          value: "export",
          type: "normal",
          imgSrc: require("@m/assets/images/icon_export.png"),
          iconClass: "",
          // authName: "assetDispose:rule:export",
        },
        // {
        //   name: "迁移数据",
        //   value: "transfer",
        //   type: "normal",
        //   imgSrc: require("@m/assets/images/icon_transfer.png"),
        //   iconClass: "",
        //   authName: "assetDispose:rule:transfer",
        // },
        {
          name: "分类维护",
          value: "classify",
          type: "normal",
          imgSrc: require("@m/assets/images/icon_classification.png"),
          iconClass: "",
          // authName: "assetDispose:rule:classify",
        },
        {
          name: "创建规则",
          value: "create",
          type: "primary",
          imgSrc: "",
          iconClass: "el-icon-plus",
          // authName: "assetDispose:rule:create",
        },
      ],
      //导出数据
      isExportPop: false,
      // 关联数据字典弹框
      dictionaryCountDialogVisiable: false,
    };
  },
  methods: {
    // 删除验证规则
    async operate(operation, data) {
      if (operation == "delete") {
        this.$confirm("是否删除该数据验证").then(async () => {
          const params = {
            ruleId: data.ruleId,
          };
          const res = await this.rpc.systemmgmt.deleteRule(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getList();
        });
      } else if (operation == "edit") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/ruleAdd",
          query: { ruleId: data.ruleId },
        });
      } else if (operation == "test") {
        this.isData = data;
        this.testDialogVisible = true;
      } else if (operation == "read") {
        await this.$refs.dictionaryCountRef.getList(data.ruleId)
        this.dictionaryCountDialogVisiable = true
      }
    },
    // 测试弹框关闭
    closeTestDialogVisible() {
      this.testTextShow = "";
      this.$refs.ruleFormRef.resetFields();
      this.$refs.ruleFormRef.clearValidate();
      this.testDialogVisible = false;
    },
    // 验证测试数据
    testConfirm() {
      this.$refs.ruleFormRef.validate((valid) => {
        if (!valid) return;
        let reg;
        try {
          reg = eval(this.isData.ruleExps);
        } catch (error) {
          reg = RegExp(this.isData.ruleExps);
        }
        if (reg.test(this.ruleForm.testinput)) {
          this.testTextShow = "true";
        } else {
          this.testError = this.isData.ruleTip;
          this.testTextShow = "error";
        }
      });
    },
    // 创建规则按钮
    establishRule() {
      this.$router.push({ path: "/aop_tradedesign/dicmgmt/ruleAdd" });
    },
    // 导入规则
    uploadRule() {
      this.actionUrl = this.rpc.file.ruleUpUrl({ isCover: "true" });
      this.uploadDialog = true;
    },
    // 是否覆盖
    radioChange(e) {
      if (e == "1") {
        this.actionUrl = this.rpc.file.ruleUpUrl({ isCover: "true" });
      } else {
        this.actionUrl = this.rpc.file.ruleUpUrl({ isCover: "fasle" });
      }
    },
    // 导出规则
    exportRule() {
      if (
        this.selectedData.length == 0 &&
        !this.searchForm.content &&
        !this.searchForm.paraClassifyId
      ) {
        return this.$message.warning("请勾选需要导出的数据或通过搜索进行匹配");
      }
      this.isExportPop = true;
    },
    // 下载模板或导出数据
    async download(e) {
      const params = {
        exportStus: e == "export" ? "1" : "0",
        ruleIdList: this.selectedData.map((item) => item.ruleId),
        qCondition: this.searchForm.content,
        paraClassifyId: this.searchForm.paraClassifyId,
      };
      const res = await this.rpc.systemmgmt.templateDownload(params);
      const downLoadUrl = this.$replaceUrl(res.downLoadUrl);
      const a = document.createElement("a");
      a.style.display = "none";
      a.download = "";
      a.href = downLoadUrl;
      a.click();
      this.uploadDialog = false;
      this.isExportPop = false;
      // 清除多选框
      // if( e == "export") this.$refs.ruleTableRef.clearSelection()
    },
    //关闭确认导出POP
    closeExportPop() {
      this.isExportPop = false;
    },
    // 迁移规则
    transferRule() {
      if (
        this.selectedData.length == 0 &&
        !this.searchForm.content &&
        !this.searchForm.paraClassifyId
      ) {
        return this.$message.warning("请勾选需要迁移的数据或通过搜索进行匹配");
      }
      this.transferDialog = true;
    },
    // 获取迁移数据列表
    async getList() {
      const data = {
        qCondition: this.searchForm.content ? this.searchForm.content : "",
        paraClassifyId: this.searchForm.paraClassifyId
          ? this.searchForm.paraClassifyId
          : "",
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const res = await this.rpc.systemmgmt.getRuleList(data);
      this.ruleTableData = res.ruleDefinedInfoPageList;
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
    // 多选框变化时
    selectionChange(e) {
      console.log(e);
      this.selectedData = e;
    },
    // 规则分类页面
    ruleRouter() {
      this.$router.push({
        path: "/aop_tradedesign/dicmgmt/ruleClassification",
      });
    },
    // 按钮处理事件
    handleBtnClik(btn) {
      switch (btn) {
        case "transfer":
          this.transferRule();
          return;
        case "classify":
          this.ruleRouter();
          return;
        case "import":
          this.uploadRule();
          return;
        case "export":
          this.exportRule();
          return;
        case "create":
          this.establishRule();
          return;
        default:
          return;
      }
    },
    // 关联数据字典弹框关闭
    dictionaryCountCloseDialog() {
      this.dictionaryCountDialogVisiable = false
    }
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesigncomps_rule_list {
  .detail_content {
    background: $base_white;
    padding: 0 24px 24px;
  }
  .page_dialog_center {
    height: 87px;
    position: relative;
    display: flex;
    .test_input {
      flex: 1;
      font-size: 14px;
      margin: 20px 80px 0;
      @include form;
    }
    .test_top {
      position: absolute;
      left: 165px;
      top: 0px;
    }
    .test_top_color {
      color: $danger_color;
    }
  }
}
</style>