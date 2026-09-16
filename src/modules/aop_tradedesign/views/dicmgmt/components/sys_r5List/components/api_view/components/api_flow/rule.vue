<template>
  <div class="aop_tradedesign_comps_apimgmt_api_view_api_flow_rule">
    <div class="service_content_container">
      <div class="service_content_bottom">
        <TableHeader
          :title="'业务规则列表'"
          :btnList="btnAuth ? btnList : []"
          @btnClick="handleBtnClik"
          v-if="type == 'inDetail'"
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
                <el-form-item label="规则ID" prop="ruleCode">
                  <el-input
                    v-model="editForm.ruleCode"
                    clearable
                    placeholder="请输入规则ID"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="规则名称" prop="ruleName">
                  <el-input
                    v-model="editForm.ruleName"
                    clearable
                    placeholder="请输入规则名称"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="规则类型" prop="ruleType">
                  <el-select
                    v-model="editForm.ruleType"
                    clearable
                    placeholder="规则类型"
                  >
                    <el-option
                      v-for="(item, index) in classificationNmOptions"
                      :value="item.value"
                      :label="item.type"
                      :key="index"
                      >{{ item.type }}</el-option
                    >
                  </el-select>
                </el-form-item>
                <el-form-item label="自然语言描述" prop="ruleNature">
                  <el-input
                    type="textarea"
                    v-model="editForm.ruleNature"
                    clearable
                    placeholder="请输入自然语言描述"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="规则语言描述" prop="ruleDesc">
                  <el-input
                    type="textarea"
                    v-model="editForm.ruleDesc"
                    clearable
                    placeholder="请输入规则语言描述"
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

        <PageDialog
          ref="paramsMsg"
          dialogWidth="720px"
          dialogTitle="查看业务规则"
          :dialogVisiable="readDialogVisible"
          @closeDialog="readDialogVisible = false"
          class="dialog_wrapper"
        >
          <div class="dialog_content" slot="box">
            <el-form
              class="read_form"
              ref="readForm"
              label-width="120px"
              :model="readForm"
            >
              <div class="form_info">
                <el-form-item label="规则ID：">
                  <span>{{readForm.ruleCode}}</span>
                </el-form-item>
                <el-form-item label="规则名称：">
                  <span>{{readForm.ruleName}}</span>
                </el-form-item>
                <el-form-item label="规则类型：">
                  <span>{{readForm.ruleType | ruleType}}</span>
                </el-form-item>
                <el-form-item label="自然语言描述：">
                  <span>{{readForm.ruleNature}}</span>
                </el-form-item>
                <el-form-item label="规则语言描述：">
                  <span>{{readForm.ruleDesc}}</span>
                </el-form-item>
              </div>
            </el-form>
          </div>

          <div slot="footer">
            <el-button @click="readDialogVisible = false">取 消</el-button>
            <!-- <el-button type="primary" @click="confirm">确 定</el-button> -->
          </div>
        </PageDialog>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import ServiceTop from "@m/core/components/page_search_top"; // 头部搜索栏
import validate from "@m/utils/validate";
import PageDialog from "@m/core/components/page_dialog";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import TableHeader from "@m/core/components/page_table_header";
import { options } from "@m/utils/commonData.js"

export default {
  mixins: [mixin],
  components: {
    ServiceTop,
    Table,
    PagePagination,
    TableHeader,
    PageDialog
  },
  props: {
    apiId: {
      type: String,
      default: () => "",
    },
    type: {
      type: String,
      default: () => "",
    },
    btnAuth: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      // 列表参数
      tables: [
        {
          prop: "ruleCode",
          label: "规则ID",
          width: "90",
          type: "text",
          tooltip: true,
        },
        {
          prop: "ruleName",
          label: "规则名称",
          width: "100",
          type: "text",
          tooltip: true,
        },
        {
          prop: "ruleType",
          label: "规则类型",
          width: "80",
          type: "textClick",
          operate: "read",
          filter: "ruleType",
          tooltip: true,
        },
        {
          prop: "ruleNature",
          label: "自然语言描述",
          width: "300",
          type: "text",
          tooltip: true,
        },
        {
          prop: "ruleDesc",
          label: "规则语言描述",
          width: "300",
          type: "textarea",
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
      //控制创建业务规则对话框是否显示
      dialogVisible: false,
      //创建/编辑 分类的数据存储
      editForm: {
        ruleCode: "", // 规则ID
        ruleName: "", // 规则名称
        ruleType: "", // 规则类型
        ruleDesc: "", // 规则语言描述
        ruleNature: "",
      },
      // 弹窗标题
      dialogTitle: "",
      //规则校验
      rules: {
        ruleCode: [
          { required: true, trigger: "blur", message: "规则ID不能为空" },
        ],
        ruleName: [
          { required: true, trigger: "blur", message: "规则名称不能为空" },
        ],
        ruleType: [
          { required: true, trigger: "blur", message: "规则类型不能为空" },
        ],
      },
      // 表格头部按钮
      btnList: [
        {
          name: "创建业务规则",
          value: "create",
          type: "primary",
          imgSrc: "",
          iconClass: "el-icon-plus",
        },
      ],
      //控制导入数据对话框显示或隐藏
      uploadDialog: false,
      //上传文件的地址
      actionUrl: "",
      // 分类下拉框选项
      // classificationNmOptions: [
      //   { type: "文本", value: "0" },
      //   { type: "引用", value: "1" },
      //   { type: "赋值", value: "2" },
      //   { type: "判断", value: "3" },
      //   { type: "服务调用", value: "4" },
      //   { type: "公式", value: "5" },
      // ],
      classificationNmOptions: options['ruleType'],
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "ruleCode",
          placeholder: "搜索规则ID",
          style: {
            width: "260px",
          },
        },
        {
          type: "select",
          model: "ruleType",
          placeholder: "选择规则类型",
          select: [
            {
              type: "判断",
              value: "0",
            },
            {
              type: "引用",
              value: "1",
            },
            {
              type: "公式",
              value: "2",
            },
          ],
          style: {
            width: "260px",
          },
        },
      ],
      // 搜索条件
      form: {
        ruleCode: "", // 查询条件
        ruleType: "",
      },
      searchForm: {
        ruleCode: "", // 查询条件
        ruleType: "",
      },
      readDialogVisible: false,
      readForm: {
        ruleCode: "", // 规则ID
        ruleType: "", // 规则类型
        ruleDesc: "", // 规则语言描述
        ruleNature: "",
      },
    };
  },
  methods: {
    init() {
      if (this.type == "inDetail") {
        this.tables.push({
          label: "操作",
          width: "110",
          type: "button",
          // fixed: "right",
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
        });
      }
    },
    //点击搜索按钮
    search() {
      Object.assign(this.searchForm, this.form);
      this.pager.currentPage = "1";
      this.getList();
    },
    //点击重置按钮
    reset() {
      this.$refs.formRef.resetFields();
    },
    //点击创建业务规则按钮
    handleBtnClik(e) {
      if (e == "create") {
        this.toCreate();
      } else if (e == "import") {
        this.actionUrl = this.rpc.file.abbreviationUp({ isCover: "1" });
        this.uploadDialog = true;
      }
    },
    //创建业务规则
    toCreate() {
      this.dialogTitle = "创建业务规则";
      this.dialogVisible = true;
    },
    //关闭对话框
    closeDialog() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        dictryNm: "", // 中文名称
        dictryNo: "", // 英文名称
        dictryEngAbbr: "", // 英文缩写
        classificationNm: "", // 分类
        dictryDescr: "", // 分类描述
      };
      if (this.dialogTitle == "编辑业务规则")
        delete this.editForm.abbreviationId;
      this.dialogVisible = false;
    },
    //获取数据列表
    async getList() {
      const params = {
        apiId: this.apiId,
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        ruleCode: this.searchForm.ruleCode,
        ruleType: this.searchForm.ruleType,
      };
      const res = await this.rpc.apimgmt.getRuleList(params);
      this.serviceList = res.businessRuleList;
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
      if (operation == "edit") {
        // Object.assign(this.editForm, data);
        this.editForm = JSON.parse(JSON.stringify(data));
        // Object.keys(this.editForm).forEach(key => this.editForm[key] = data[key]);
        // this.editForm.ruleId = data.ruleId;
        this.dialogTitle = "编辑业务规则";
        this.dialogVisible = true;
      } else if (operation == "delete") {
        this.$confirm("是否删除该业务规则?").then(async () => {
          const res = await this.rpc.apimgmt.deleteRule({
            ruleId: data.ruleId,
            apiId: this.apiId,
          });
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getList();
        });
      } else if(operation == "read") {
        this.readForm = data
        this.readDialogVisible = true
      }
    },
    //确定
    confirm() {
      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
          const params = this.editForm;
          params.apiId = this.apiId;
          const message =
            this.dialogTitle == "创建业务规则"
              ? "创建业务规则成功"
              : "编辑业务规则成功";
          const res = await this.rpc.apimgmt.addModRule(params);
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
    this.init()
    this.getList();
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_api_view_api_flow_rule {
  .service_content_container {
    .service_content_bottom {
      background: $base_white;
      padding: 0 24px 24px;
      margin-bottom: 20px;
    }
  }
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
      .read_form {
        @include form;
      }
    }
  }
}
</style>