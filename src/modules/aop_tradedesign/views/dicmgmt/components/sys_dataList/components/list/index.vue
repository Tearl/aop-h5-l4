<template>
  <div class="aop_tradedesign_comps_dicmgmt_data_list_mgmt_list">
    <SearchTop ref="formRef" :serviceForm="serviceForm" :form="form">
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
    </SearchTop>
    <div class="content_wrapper">
      <TableHeader
        title="数据集管理"
        :btnList="btnList"
        @btnClick="handleBtnClik"
      ></TableHeader>

      <Table
        class="table"
        :data="dataList"
        :table="tableColumn"
        @operate="operate"
      ></Table>

      <!-- 分页器 -->
      <PagePagination
        class="pn_style"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pager="pager"
      >
      </PagePagination>
    </div>

    <!-- 资产新增或编辑 -->
    <PageDialog
      :dialogTitle="typeTitle"
      :dialogVisiable="typeVisible"
      dialogWidth="56.3%"
      @closeDialog="closeGroupDialog"
    >
      <div slot="box" class="box">
        <el-form
          :model="formValidate"
          :rules="ruleValidate"
          ref="formValidateRef"
          label-width="120px"
          class="edit_form"
        >
          <el-form-item label="大类名称" prop="typeName">
            <el-input
              v-model="formValidate.typeName"
              placeholder="请输入大类名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="大类编码" prop="typeCode">
            <el-input
              v-model="formValidate.typeCode"
              placeholder="请输入大类编码"
            ></el-input>
          </el-form-item>
          <el-form-item label="类别描述">
            <el-input
              v-model="formValidate.typeDesc"
              :maxlength="100"
              placeholder="请输入类别描述"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="closeGroupDialog">取 消</el-button>
        <el-button type="primary" @click="confirmGroupDialog">确 定</el-button>
      </span>
    </PageDialog>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import SearchTop from "@m/core/components/page_search_top"; // 头部搜索栏
import TableHeader from "@m/core/components/page_table_header";
import Table from "@m/core/components/page_table";
import PagePagination from "@m/core/components/page_pagination";
import PageDialog from "@m/core/components/page_dialog";
import { getLocalStorage } from "@m/utils/localStorage";
export default {
  mixins: [mixin],
  components: {
    SearchTop,
    TableHeader,
    Table,
    PagePagination,
    PageDialog,
  },
  props: {
    arsId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      //头部搜索
      serviceForm: [
        {
          type: "input",
          model: "dataColletChiNm",
          placeholder: "请输入数据集中文名称",
        },
      ],
      // 搜索条件
      form: {
        dataColletChiNm: "",
      },
      // 点击搜索按钮后，记录搜索条件
      searchForm: {
        dataColletChiNm: "",
      },
      //按钮列表
      btnList: [
        {
          name: "创建数据集",
          value: "addDataList",
          type: "primary",
          imgSrc: "",
          iconClass: "",
        },
      ],
      // 数据列表
      dataList: [],
      // 列表参数
      tableColumn: [
        {
          prop: "dataColletId",
          label: "数据集ID",
          width: "100",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dataColletChiNm",
          label: "数据集中文名称",
          width: "150",
          type: "textClick",
          operate: "toDetail",
          tooltip: true,
        },
        {
          prop: "dataColletEngNm",
          label: "数据集英文名称",
          width: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dataColletDescr",
          label: "数据集描述",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "action",
          label: "操作",
          width: "135",
          fixed: "right",
          type: "button",
          buttonList: [
            {
              desc: "编辑",
              operate: "mod",
            },
            {
              desc: "删除",
              operate: "del",
            },
          ],
        },
      ],
      // 分页器参数
      pager: { currentPage: 1, turnPageShowNum: 10, total: 0 },

      //新增编辑
      typeTitle: "新增资产",
      typeVisible: false,
      formValidate: {
        typeName: "",
        typeCode: "",
        typeDesc: "",
      },
      ruleValidate: {
        typeName: [{ required: true, message: "请输入大类名称", trigger: "blur" }],
        typeCode: [{ required: true, message: "请输入大类名称", trigger: "blur" }],
      },
      bizId: ""
    };
  },
  methods: {
    init() {
      this.getList();
    },
    operate(operation, data) {
      if (operation == "mod") {
        this.modType(data);
      } else if (operation == "del") {
        this.del(data);
      } else if (operation == "toDetail") {
        this.toDetail(data)
      }
    },
    //更改页码条数
    handleSizeChange(turnPageShowNum) {
      this.pager.turnPageShowNum = turnPageShowNum;
      this.getList();
    },
    //更改当前页
    handleCurrentChange() {
      this.getList();
    },
    //获取数据
    async getList() {
      const params = {
        ...this.searchForm,
        sysId: this.arsId,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const res = await this.rpc.systemmgmt.getDataList(params);
      this.dataList = res.dataColletionInfos;
      this.pager.total = res.turnPageTotalNum * 1;
    },
    //搜索
    search() {
      Object.assign(this.searchForm, this.form);
      this.pager.currentPage = 1;
      this.getList();
    },
    //重置
    reset() {
      this.$refs.formRef.resetFields();
    },
    //点击按钮
    handleBtnClik(e) {
      if (e == "addDataList") {
        this.$emit("addDataList")
      }
    },

    //编辑资产
    modType(e) {
      this.$emit("moddDataList", e)
      // this.typeVisible = true;
      // this.typeTitle = "编辑大类";
      // this.bizId = e.bizId
      // this.formValidate = {
      //   typeName: e.typeName,
      //   typeCode: e.typeCode,
      //   typeDesc: e.typeDesc
      // }
    },
    resetDialog() {
      this.formValidate = {
        typeCode: "",
        typeName: "",
        typeDesc: ""
      }
    },
    closeGroupDialog() {
      this.resetDialog()
      this.typeVisible = false;
    },
    confirmGroupDialog() {
      this.$refs.formValidateRef.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const params = {
          typeName: this.formValidate.typeName,
          typeDesc: this.formValidate.typeDesc,
          typeCode: this.formValidate.typeCode,
          creater: JSON.parse(getLocalStorage("_userInfo")).cstName,
          arsId: this.arsId,
        }
        const modParams = {
          typeName: this.formValidate.typeName,
          typeDesc: this.formValidate.typeDesc,
          typeCode: this.formValidate.typeCode,
          creater: JSON.parse(getLocalStorage("_userInfo")).cstName,
          bizId: this.bizId,
        }
        const api =
          this.typeTitle == "编辑大类" ? "modType" : "addType";
        const res = await this.rpc.systemmgmt[api](
          this.typeTitle == "编辑大类" ? modParams : params
        );
        this.$notify({
          title: "成功",
          message: this.typeTitle == "编辑大类" ? "编辑成功" : "新增成功",
          duration: 2000,
          type: "success",
        });
        this.search();
        this.closeGroupDialog();
      });
    },
    //删除资产
    del(e) {
      this.$confirm("是否删除该大类，名称为" + e.dataColletChiNm)
        .then(async () => {
          const params = {
            dataColletId: e.dataColletId,
          };
          const res = await this.rpc.systemmgmt.delDataList(params);
          this.$notify({
            title: "成功",
            message: "删除成功！",
            duration: 2000,
            type: "success",
          });
          this.getList();
        })
        .catch(() => {});
    },
    // 查看详情
    toDetail(e) {
      this.$emit("toDetail",e)
    }
  },
  created() {
    this.init();
  },
  watch: {
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_data_list_mgmt_list {
  .content_wrapper {
    background: $base_white;
    padding: 0 24px 24px;
  }
  .pn_style {
    text-align: center;
  }
  .edit_form {
    @include form;
  }
}
</style>

