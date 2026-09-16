<template>
  <div class="aop_workgate_page_systemmgmt_dic_example_list">
    <div class="create_content_wrapper">
      <!-- <TableHeader
          title="示例列表"
          :btnList="btnList"
          @btnClick="handleBtnClik"
        ></TableHeader> -->
      <div class="top_right_create" v-if="bizType == 'edit'">
        <el-button type="primary" icon="el-icon-plus" @click="handleBtnClik"
          >添加示例值</el-button
        >
      </div>
      <Table
        class="table_style"
        :table="tables"
        @operate="operate"
        :data="dataList"
        rowK="exampleId"
      ></Table>
    </div>
    <!-- 添加示例 -->
    <PageDialog
      :apTobody="true"
      :dialogTitle="dialogTitle"
      :dialogVisiable="dialogVisible"
      dialogWidth="56.3%"
      @closeDialog="closeDialog"
      class="example_dialog"
    >
      <div slot="box">
        <el-form
          class="edit_form"
          ref="editForm"
          label-width="120px"
          :model="formData"
          :rules="rules"
        >
          <div class="form_info">
            <el-form-item label="示例值" prop="exampleValue">
              <el-input
                v-model="formData.exampleValue"
                clearable
                placeholder="请输入示例值"
              >
              </el-input>
              <el-button class="button" type="primary" @click="getExampleValue"
                >随机生成</el-button
              >
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </PageDialog>

    <PageFooter>
      <div slot="box">
        <el-button @click="handleCancel" v-if="this.type == 'public'"
          >返 回</el-button
        >
        <!-- <el-button type="primary" @click="preservation">提 交</el-button> -->
      </div>
    </PageFooter>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import TableHeader from "@m/core/components/page_table_header";
import PageFooter from "@m/core/components/page_footer";
import Sortable from "sortablejs";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    Table,
    ServiceTop,
    TableHeader,
    PageFooter,
  },
  props: {
    dictryId: {
      type: String,
      default: () => "",
    },
    sysId: {
      type: String,
      default: () => "",
    },
    bizType: {
      type: String,
      default: () => "edit",
    },
  },
  data() {
    return {
      // 导航栏参数
      breadcrumbs: [],
      // 表格头部按钮
      btnList: [
        {
          name: "添加示例",
          value: "create",
          type: "primary",
          imgSrc: "",
          iconClass: "el-icon-plus",
        },
      ],
      // 示例列表参数
      tables: [
        {
          width: "120",
          prop: "exampleOrder",
          label: "排序",
          type: "text",
        },
        {
          width: "150",
          prop: "exampleValue",
          label: "示例值",
          type: "text",
        },
        {
          width: "120",
          prop: "creatrNm",
          label: "创建人",
          tooltip: true,
          type: "text",
        },
        {
          width: "120",
          prop: "crtTm",
          label: "创建时间",
          type: "text",
          filter: "crtTm",
        },
        {
          width: "100",
          label: "操作",
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
      // 示例列表信息
      dataList: [],
      dialogVisible: false,
      dialogTitle: "",
      formData: {
        exampleValue: "",
      },
      //规则校验
      rules: {
        exampleValue: [
          { required: true, trigger: "blur", message: "示例值不能为空" },
        ],
      },
      type: "",
      dictionaryInfo: {},
    };
  },
  methods: {
    async getExampleValue() {
      const api = this.sysId
        ? "getDictionaryExampleByVerifyRule"
        : "getPublicDictionaryExampleByVerifyRule";
      const { exmpVal } = await this.rpc.dictionary[api]({
        dictryNo: this.dictionaryInfo.dictryNo,
        sysId: this.sysId,
      });
      this.formData.exampleValue = exmpVal;
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          console.log(_this.dataList);
          const currRow = _this.dataList.splice(oldIndex, 1)[0];
          _this.dataList.splice(newIndex, 0, currRow);
          _this.sortDictExample();
        },
      });
    },
    handleCancel() {
      if (this.type !== "public") {
        this.$emit("toDicList");
      } else {
        this.$router.push({
          path: "/aop_workgate/systemmgmt/dictionaryList",
        });
      }
    },
    // 添加示例
    handleBtnClik() {
      this.dialogTitle = "添加示例";
      this.dialogVisible = true;
    },
    // 删除示例
    operate(operation, data) {
      if (operation == "delete") {
        this.$confirm("是否删除该示例").then(async () => {
          const params = {
            exampleId: data.exampleId,
          };
          const res = await this.rpc.dictionary.delDictExample(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.sortDictExample(data.exampleId);
        });
      } else if (operation == "edit") {
        this.exampleId = data.exampleId;
        this.formData.exampleValue = data.exampleValue;
        this.dialogTitle = "编辑示例";
        this.dialogVisible = true;
      }
    },
    async sortDictExample(e) {
      let exampleOrderList = [];
      if (!!e) {
        this.dataList.forEach((item) => {
          if (item.exampleId !== e) {
            exampleOrderList.push({
              exampleId: item.exampleId,
              exampleOrder:
                item.exampleOrder > e
                  ? item.exampleOrder - 1 + ""
                  : item.exampleOrder,
            });
          }
        });
      } else {
        exampleOrderList = this.dataList.map((item, index) => {
          return {
            exampleId: item.exampleId,
            exampleOrder: index + 1 + "",
          };
        });
      }
      const res = await this.rpc.dictionary.sortDictExample({
        exampleOrderList,
      });
      this.getList();
    },
    // 获取列表
    async getList() {
      const data = {
        dictryId: this.dictryId,
      };
      const res = await this.rpc.dictionary.getDictExampleList(data);
      this.dataList = res.dictExampleList;
    },
    // 添加弹框确定
    confirm() {
      const addParams = {
        exampleValue: this.formData.exampleValue,
        dictryId: this.dictryId,
        sysFlg: this.sysId ? "1" : "",
      };
      const modParams = {
        exampleValue: this.formData.exampleValue,
        exampleId: this.exampleId,
        sysFlg: this.sysId ? "1" : "",
      };
      const api =
        this.dialogTitle == "添加示例" ? "addDictExample" : "modDictExample";
      this.rpc.dictionary[api](
        this.dialogTitle == "添加示例" ? addParams : modParams
      ).then((res) => {
        this.$notify({
          title: "成功",
          message: this.dialogTitle == "添加示例" ? "添加成功" : "编辑成功",
          duration: 2000,
          type: "success",
        });
        this.closeDialog();
        this.getList();
      });
    },
    closeDialog() {
      this.$refs.editForm.resetFields();
      this.dialogVisible = false;
    },
    async getSysDicDetail() {
      const api = this.sysId ? "getSysDicDetail" : "editList";
      const res = await this.rpc.dictionary[api]({
        dictryId: this.dictryId,
      });
      this.dictionaryInfo = res;
    },
    // 初始化
    init() {
      this.type = this.$route.query.type || "";
      if (this.type == "public") {
        this.dictryId = this.$route.query.dictryId;
      }
      this.getSysDicDetail();
      this.getList();
    },
  },
  created() {
    this.init();
  },
  mounted() {
    // 阻止默认行为
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
    this.rowDrop();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_page_systemmgmt_dic_example_list {
 .example_dialog-dialog {
  background: red !important;
}
  .example_dialog .service_top {
    padding: 0;
  }
  .edit_form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 24px 0;
    @include form;
    .button {
      margin-left: 6px;
    }
  }
  .top_right_create {
    ::v-deep .el-button {
      @include large_button_common;
      width: 117px;
    }
  }
  .table_style {
    margin-top: 16px;
    ::v-deep .el-table th {
      line-height: 0;
      color: $sec_ft_color;
    }
  }
}
</style>
