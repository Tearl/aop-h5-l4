<template>
  <div class="aop_tradedesigncomps_rule_list">
    <TableHeader
      :title="'规则分类列表'"
      :btnList="btnList"
      @btnClick="handleBtnClik"
    ></TableHeader>
    <Table :table="tables" :data="ruleList" @operate="operate"></Table>
    <!-- 分页器 -->
    <PagePagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :pager="pager"
    >
    </PagePagination>

    <PageDialog
      ref="paramsMsg"
      dialogWidth="720px"
      :dialogTitle="dialogTitle"
      :dialogVisiable="dialogVisible"
      @closeDialog="dialogVisible = false"
      class="dialog_wrapper"
    >
      <div class="dialog_content" slot="box">
        <el-form
          class="edit_form"
          ref="createFormRef"
          label-width="120px"
          :model="createForm"
          :rules="createRules"
        >
          <div class="form_info">
            <el-form-item label="分类名称" prop="clsfNm">
              <el-input
                v-model="createForm.clsfNm"
                clearable
                placeholder="请输入分类名称"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="分类中文名称" prop="clsfCnNm">
              <el-input
                v-model="createForm.clsfCnNm"
                clearable
                placeholder="请输入分类中文名称"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="分类描述" prop="clsfDescr">
              <el-input
                type="textarea"
                v-model="createForm.clsfDescr"
                clearable
                placeholder="请输入分类描述"
              >
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import validate from "@m/utils/validate";
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import Table from "@m/core/components/page_table";
import TableHeader from "@m/core/components/page_table_header";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    TableHeader,
  },
  props: {
    // 表单的搜索条件
    searchForm: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // 列表参数
      tables: [
        {
          prop: "clsfNm",
          label: "分类名称",
          width: "250",
          type: "text",
          tooltip: true,
        },
        {
          prop: "clsfCnNm",
          label: "分类中文名称",
          width: "250",
          type: "text",
          tooltip: true,
        },
        {
          prop: "clsfDescr",
          label: "分类描述",
          type: "text",
          width: "320",
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
      // 分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 分类弹框是否可见
      dialogVisible: false,
      // 规则分类列表
      ruleList: [],
      // 创建分类表单参数
      createForm: {
        clsfNm: "", // 分类名称
        clsfCnNm: "", // 中文名
        clsfDescr: "", // 数据描述
      },
      // 添加表单验证规则
      createRules: {
        clsfNm: [
          { required: true, trigger: "blur",  validator: this.checkName },
          { required: true, trigger: "blur",  message: "请输入分类名称", },
        ],
        clsfCnNm: [
          { required: true, trigger: "blur", message: "分类中文名不能为空" },
          {
            required: true,
            trigger: "blur",
            message: "请输入中文名称",
            validator: validate.isChinese,
          },
        ],
        clsfDescr: [
          { required: true, message: "分类描述不能为空", trigger: "blur" },
        ],
      },
      // 创建新增对话框
      dialogTitle: "",
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
    checkName(rule, value, callback) {
      const reg = /^[a-zA-Z]+[0-9]*$/;
      if(value == "" || value && !reg.test(value)){
        callback(new Error("请输入英文开头或数字结尾。例如:错误输入A6A、A6A6"))
      }else{
        callback()
      }
    },
    // 操作
    operate(operation, data) {
      if (operation == "delete") {
        this.$confirm("确定要删除吗").then(async () => {
          const params = { clsfId: data.clsfId };
          const res = await this.rpc.systemmgmt.deleteRuleClassification(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getList();
        });
      } else {
        this.createForm = JSON.parse(JSON.stringify(data));
        this.dialogTitle = "编辑规则分类";
        this.dialogVisible = true;
      }
    },
    // 处理按钮点击
    handleBtnClik(e) {
      this.toCreate();
    },
    // 创建分类
    toCreate() {
      this.createForm = {};
      this.dialogTitle = "创建规则分类";
      this.dialogVisible = true;
    },
    // 确定
    confirm() {
      this.$refs.createFormRef.validate(async (valid) => {
        if (!valid) return;
        const api =
          this.dialogTitle == "创建规则分类"
            ? "addRuleClassification"
            : "editRuleClassification";
        const message =
          this.dialogTitle == "创建规则分类" ? "创建成功" : "编辑成功";
        const res = await this.rpc.systemmgmt[api](this.createForm);
        this.$notify({
          title: "成功",
          message,
          duration: 2000,
          type: "success",
        });
        this.getList();
        this.dialogVisible = false;
      });
    },
    // 查询规则分类列表
    async getList() {
      const data = {
        content: this.searchForm.content ? this.searchForm.content : "",
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const res = await this.rpc.systemmgmt.pageGetRuleClassification(data);
      this.ruleList = res.rciList;
      this.pager.total = res.turnPageShowNum * 1;
    },
    // 当前每页条数改变时
    handleSizeChange(e) {
      this.pager.turnPageShowNum = e;
      this.getList();
    },
    // 当前页改变时
    handleCurrentChange(e) {
      this.getList();
    },
  },
  created() {
    this.getList();
  },
  watch: {
    dialogVisible(n, o) {
      if (!n) this.$refs.createFormRef.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesigncomps_rule_list {
  .dialog_wrapper {
    .dialog_content {
      font-family: $font_regular;
      .edit_form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 24px 0;
        @include form;
      }
    }
  }
  ::v-deep .over_descr {
    white-space: nowrap; /*超出的空白区域不换行*/
    overflow: hidden; /*超出隐藏*/
    text-overflow: ellipsis; /*文本超出显示省略号*/
  }
}
</style>