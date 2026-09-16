<template>
  <div class="aop_tradedesign_page_dicmgmt_classify">
    <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>

    <div class="service_content_container">
      <ServiceTop ref="formRef" :serviceForm="serviceForm" :form="form">
        <div slot="rightButton">
          <el-button
            type="primary"
            size="small"
            @click="search"
            class="right_button"
            >搜索</el-button
          >
          <el-button size="small" @click="reset" class="right_button"
            >重置</el-button
          >
        </div>
      </ServiceTop>
      <div class="service_content_bottom">
        <TableHeader
          :title="'字典分类列表'"
          :btnList="btnList"
          @btnClick="handleBtnClik"
        ></TableHeader>
        <Table :table="tables" :data="serviceList" @operate="operate"> </Table>
        <!-- 分页器 -->
        <PagePagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager="pager"
        >
        </PagePagination>
      </div>
    </div>

    <PageDialog
      ref="paramsMsg"
      dialogWidth="720px"
      :dialogTitle="dialogTitle"
      :dialogVisiable="dialogVisible"
      @closeDialog="closeDialog"
      class="dialog_wrapper"
    >
      <div class="dialog_content" slot="box">
        <el-form
          class="edit_form"
          ref="editForm"
          label-width="120px"
          :model="editForm"
          :rules="rules"
        >
          <div class="form_info">
            <el-form-item label="分类名称" prop="clsfNm">
              <el-input
                v-model="editForm.clsfNm"
                clearable
                placeholder="请输入分类名称"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="数据描述" prop="clsfDescr">
              <el-input
                type="textarea"
                v-model="editForm.clsfDescr"
                clearable
                placeholder="请输入数据描述"
              >
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import PageHeader from "@m/core/components/page_header";
import filters from "@m/utils/filters";
import validate from "@m/utils/validate";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import TableHeader from "@m/core/components/page_table_header";

export default {
  mixins: [mixin],
  components: {
    PageHeader,
    ServiceTop,
    PageDialog,
    PagePagination,
    Table,
    TableHeader,
  },
  data() {
    return {
      // 导航栏参数
      breadcrumbs: [
        {
          label: "元数据管理",
          operate: "list",
        },
        {
          label: "分类维护",
        },
      ],
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "qCondition",
          placeholder: "搜索分类名称或描述",
          style: {
            width: "260px",
          },
        },
      ],
      // 搜索条件
      form: {
        qCondition: "", // 查询条件
      },
      // 列表参数
      tables: [
        {
          prop: "clsfNm",
          label: "分类名称",
          width: "250",
          type: "text",
        },
        {
          prop: "clsfDescr",
          label: "分类描述",
          width: "320",
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
              relation: function (scope) {
                return scope.row.clsfId != "10000000";
              },
            },
            {
              desc: "删除",
              operate: "delete",
              relation: function (scope) {
                return scope.row.clsfId != "10000000";
              },
            },
          ],
        },
      ],
      // 服务组件列表
      serviceList: [],
      //列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      //控制创建分类对话框是否显示
      dialogVisible: false,
      //创建/编辑 分类的数据存储
      editForm: {
        clsfNm: "", // 分类名称
        clsfDescr: "", // 分类描述
      },
      // 弹窗标题
      dialogTitle: "",
      //规则校验
      rules: {
        clsfNm: [
          { required: true, trigger: "blur", message: "分类名称不能为空" },
          {
            required: true,
            trigger: "blur",
            message: "请输入中文名称",
            validator: validate.isChinese,
          },
        ],
        clsfDescr: [
          { required: true, trigger: "blur", message: "分类描述不能为空" },
        ],
      },
      // 表格头部按钮
      btnList: [
        {
          name: "创建分类",
          value: "create",
          type: "primary",
          imgSrc: "",
          iconClass: "el-icon-plus",
        },
      ],
    };
  },
  methods: {
    init() {
      this.getList();
    },
    //点击搜索按钮
    search() {
      this.pager.currentPage = "1";
      this.getList();
    },
    //点击重置按钮
    reset() {
      this.$refs.formRef.resetFields();
    },
    // 导航栏点击
    labelClick(e) {
      if (e == "list") {
        this.$router.go(-1);
      }
    },
    //点击创建分类按钮
    handleBtnClik(e) {
      this.toCreate();
    },
    //创建分类
    toCreate() {
      this.dialogTitle = "创建分类";
      this.dialogVisible = true;
    },
    //关闭对话框
    closeDialog() {
      this.$refs.editForm.resetFields();
      if (this.dialogTitle == "编辑分类") delete this.editForm.clsfId;
      this.dialogVisible = false;
    },
    //获取数据列表
    async getList() {
      const params = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        qCondition: this.form.qCondition,
      };
      const res = await this.rpc.systemmgmt.queryClassifyList(params);
      this.serviceList = res.serviceList;
      this.pager.total = res.turnPageTotalNum * 1;
    },

    // 每页条数改变时
    handleSizeChange(turnPageShowNum) {
      this.pager.turnPageShowNum = turnPageShowNum + "";
      this.getList();
    },
    // 当前页改变时
    handleCurrentChange() {
      this.getList();
    },
    //操作
    operate(operation, data) {
      if (operation == "edit" && !(data.clsfId == "10000000")) {
        this.getClassifyDetail(data.clsfId);
        this.dialogTitle = "编辑分类";
        this.dialogVisible = true;
      } else if (operation == "delete" && !(data.clsfId == "10000000")) {
        this.$confirm("是否删除该分类?").then(async () => {
          const res = await this.rpc.systemmgmt.deleteClassifyDetail({
            clsfId: data.clsfId,
          });
          this.$notify({
            title: "成功",
            message: "删除分类成功",
            duration: 2000,
            type: "success",
          });
          this.getList();
        });
      }
    },
    //确定
    confirm() {
      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
          const params = this.editForm;
          const api =
            this.dialogTitle == "创建分类"
              ? "createClassify"
              : "editClassifyDetail";
          const message =
            this.dialogTitle == "创建分类" ? "创建分类成功" : "编辑分类成功";
          const res = await this.rpc.systemmgmt[api](params);
          this.$notify({
            title: "成功",
            message,
            duration: 2000,
            type: "success",
          });
          this.getList();
          this.closeDialog();
        }
      });
    },
    //根据ID查询单个数据分类信息
    async getClassifyDetail(clsfId) {
      const res = await this.rpc.systemmgmt.getClassifyDetail({ clsfId });
      Object.assign(this.editForm, res);
    },
  },
  created() {
    this.init();
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_dicmgmt_classify {
  .service_content_container {
    padding: 20px 24px;

    .service_content_bottom {
      background: $base_white;
      padding: 0 24px 24px;
    }
  }
}
</style>