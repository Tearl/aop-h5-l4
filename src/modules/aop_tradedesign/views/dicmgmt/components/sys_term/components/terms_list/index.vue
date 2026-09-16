<template>
  <div class="aop_tradedesign_comps_dicmgmt_terms_list">
    <TableHeader
      :title="'术语定义列表'"
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
            <el-form-item label="中文名称" prop="dictryNm">
              <el-input
                v-model="editForm.dictryNm"
                clearable
                placeholder="请输入中文名称"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="英文名称" prop="dictryNo">
              <el-input
                v-model="editForm.dictryNo"
                clearable
                placeholder="请输入英文名称"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="英文缩写" prop="dictryEngAbbr">
              <el-input
                v-model="editForm.dictryEngAbbr"
                clearable
                placeholder="请输入英文缩写"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="描述" prop="dictryDescr">
              <el-input
                type="textarea"
                v-model="editForm.dictryDescr"
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
import filters from "@m/utils/filters";
import validate from "@m/utils/validate";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
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
          prop: "dictryNm",
          label: "中文名称",
          width: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryNo",
          label: "英文名称",
          width: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryEngAbbr",
          label: "英文缩写",
          width: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryDescr",
          label: "描述",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "creatrNm",
          label: "创建人",
          width: "100",
          type: "text",
          tooltip: true,
        },
        {
          prop: "crtTm",
          label: "创建时间",
          width: "150",
          type: "text",
          tooltip: true,
          filter: "crtTm"
        },
        {
          prop: "updNm",
          label: "修改人",
          width: "100",
          type: "text",
          tooltip: true,
        },
        {
          prop: "updTm",
          label: "修改时间",
          width: "150",
          type: "text",
          tooltip: true,
          filter: "crtTm"
        },
        {
          label: "操作",
          width: "110",
          type: "button",
          fixed: "right",
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
      // 服务组件列表
      serviceList: [],
      //列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      //控制创建术语定义对话框是否显示
      dialogVisible: false,
      //创建/编辑 分类的数据存储
      editForm: {
        dictryNm: "", // 中文名称
        dictryNo: "", // 英文名称
        dictryEngAbbr: "", // 英文缩写
        dictryDescr: "", // 分类描述
      },
      // 弹窗标题
      dialogTitle: "",
      //规则校验
      rules: {
        dictryNm: [
          { required: true, trigger: "blur", message: "中文名称不能为空" },
          {
            required: true,
            trigger: "blur",
            validator: validate.containChinese,
          },
        ],
        dictryNo: [
          { required: true, trigger: "blur", message: "英文名称不能为空" },
          {
            required: true,
            trigger: "blur",
            validator: validate.isEnglish,
          },
        ],
        dictryEngAbbr: [
          { required: true, trigger: "blur", message: "英文缩写不能为空" },
          {
            required: true,
            trigger: "blur",
            validator: validate.isEnglish,
          },
        ],
        dictryDescr: [
          { required: true, trigger: "blur", message: "分类描述不能为空" },
        ],
      },
      // 表格头部按钮
      btnList: [
        {
          name: "创建术语",
          value: "create",
          type: "primary",
          imgSrc: "",
          iconClass: "el-icon-plus",
        },
      ],
      sysId: ""
    };
  },
  methods: {
    //点击创建术语定义按钮
    handleBtnClik(e) {
      if (e == "create") {
        this.toCreate();
      }
    },
    //创建术语定义
    toCreate() {
      this.dialogTitle = "创建术语定义";
      this.dialogVisible = true;
    },
    //关闭对话框
    closeDialog() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        dictryNm: "", // 中文名称
        dictryNo: "", // 英文名称
        dictryEngAbbr: "", // 英文缩写
        dictryDescr: "", // 分类描述
      }
      if (this.dialogTitle == "编辑术语定义") delete this.editForm.abbreviationId;
      this.dialogVisible = false;
    },
    //获取数据列表
    async getList() {
      const params = {
        sysId: this.sysId,
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        content: this.searchForm.qCondition,
        classificationNm: this.sysId,
      };
      const res = await this.rpc.systemmgmt.getTermsList(params);
      this.serviceList = res.dictryAbbreviationList;
      this.pager.total = res.turnPageTotalNum * 1;
    },

    // 每页条数改变时
    handleSizeChange(turnPageShowNum) {
      this.pager.turnPageShowNum = turnPageShowNum;
      this.getList();
    },
    // 当前页改变时
    handleCurrentChange() {
      this.getList();
    },
    //操作
    operate(operation, data) {
      if (operation == "edit") {
        // Object.assign(this.editForm, data);
        Object.keys(this.editForm).forEach(key => this.editForm[key] = data[key]);
        this.editForm.abbreviationId = data.abbreviationId;
        this.dialogTitle = "编辑术语定义";
        this.dialogVisible = true;
      } else if (operation == "delete") {
        this.$confirm("是否删除该术语?").then(async () => {
          const params = {
            sysId: this.sysId,
            abbreviationIdList: [{abbreviationId:data.abbreviationId}]
          }
          const res = await this.rpc.systemmgmt.deleTerms(params);
          this.$notify({
            title: "成功",
            message: "删除术语成功",
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
          params.sysId = this.sysId
          params.classificationNm = this.sysId
          const message =
            this.dialogTitle == "创建术语定义" ? "创建术语定义成功" : "编辑术语定义成功";
          const api =  this.dialogTitle == "创建术语定义" ? "addTerms" : "editTerms";
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
  },
  created() {
    this.sysId = this.$route.query.sysId
    this.getList();
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_terms_list {
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
}
</style>
