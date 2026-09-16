<template>
  <div class="aop_tradedesign_comps_dicmgmt_api_group">
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
        title="业务资产"
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
      :dialogTitle="groupTitle"
      :dialogVisiable="groupVisible"
      dialogWidth="56.3%"
      @closeDialog="closeGroupDialog"
    >
      <div slot="box" class="box">
        <el-form
          :model="groupForm"
          :rules="groupRules"
          ref="groupFormRef"
          label-width="120px"
          class="edit_form"
        >
          <el-form-item label="资产名称" prop="sgName">
            <el-input
              v-model="groupForm.sgName"
              placeholder="请设置资产名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="资产编号" prop="sgCode">
            <el-input
              v-model="groupForm.sgCode"
              placeholder="请设置资产编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="服务类型" prop="serviceType" v-if="type == 'sys'">
            <el-select
              v-model="groupForm.serviceType"
              placeholder="请选择服务类型"
              :disabled="isMod"
            >
              <el-option
                v-for="(item) in servTypeList"
                :key="item.servTypeId"
                :value="item.servTypeNm"
                :label="item.servTypeNm"
              >
                {{ item.servTypeNm }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资产描述">
            <el-input
              v-model="groupForm.sgDesc"
              :maxlength="100"
              placeholder="请输入资产描述"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="报文头模板">
            <el-select
              v-model="groupForm.templateId"
              placeholder="报文头模板"
              class="wtfull"
            >
              <el-option
                v-for="(item, index) in templateList"
                :value="item.templateId"
                :key="index"
                :label="item.templateName"
                >{{ item.templateName }}</el-option
              >
            </el-select>
          </el-form-item> -->
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
    bkId: {
      type: String,
      default: () => "",
    },
    serviceType: {
      type: String,
      default: () => "",
    },
    type: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      //头部搜索
      serviceForm: [
        {
          type: "input",
          model: "sgName",
          placeholder: "资产名称",
        },
        {
          type: "input",
          model: "sgCode",
          placeholder: "资产编号",
        }
      ],
      // 搜索条件
      form: {
        sgName: "",
        sgCode: "",
      },
      // 点击搜索按钮后，记录搜索条件
      searchForm: {
        sgName: "",
        sgCode: "",
      },
      //按钮列表
      btnList: [
        {
          name: "新增资产",
          value: "addGroup",
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
          prop: "sgName",
          label: "资产名称",
          width: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "sgCode",
          label: "资产编号",
          width: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "bkName",
          label: "归属用户",
          width: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "arsName",
          label: "归属服务应用",
          width: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "sgDesc",
          label: "描述",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "serviceType",
          label: "服务类型",
          width: "150",
          type: "text",
          tooltip: true,
        },
        {
          prop: "createTime",
          label: "创建时间",
          width: "160",
          type: "text",
          filter: "crtTm_yyyyMMddhhmmss",
        },
        {
          prop: "action",
          label: "操作",
          width: "105",
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
              // relation: function (scope) {
              //   1.若是绑定了API则不允许删除
              //   return scope.row.apiState == "1";
              // },
            },
          ],
        },
      ],
      // 分页器参数
      pager: { currentPage: 1, turnPageShowNum: 10, total: 0 },

      //新增编辑
      groupTitle: "新增资产",
      groupVisible: false,
      groupForm: {
        sgName: "",
        sgCode: "",
        sgDesc: "",
        serviceType: ""
        // templateId: "",
        // bkId: "",
        // arsId: ""
      },
      groupRules: {
        sgName: [{ required: true, message: "请输入", trigger: "blur" }],
        sgCode: [{ required: true, message: "请输入", trigger: "blur" }],
        serviceType: [{ required: true, message: "请选择服务类型", trigger: "blur" }],
        // bkId: [{ required: true, message: "请选择", trigger: "change" }],
        // arsId: [{ required: true, message: "请选择", trigger: "change" }],
      },
      groupFormMod: {
        sgId: "",
      },

      templateList: [],
      bankList: [],
      sysList: [],
      servTypeList: [],
      isMod: false
    };
  },
  methods: {
    init() {
      this.getList();
      this.getTemplate();
      this.getBank();
      this.getServTypeList()
    },
    async getServTypeList() {
      const res = await this.rpc.bankmgmt.getServTypeList()
      this.servTypeList = res.serviceTypeList
    },
    operate(operation, data) {
      if (operation == "mod") {
        this.modGroup(data);
      } else if (operation == "del") {
        this.del(data);
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
        sgName: this.form.sgName,
        sgCode: this.form.sgCode,
        bkId: "",
        arsId: this.arsId,
        serviceType: this.serviceType,
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      if(this.type == "sys") {
        params.serviceType = ""
      }
      const res = await this.rpc.systemmgmt.getApiGroupList(params);
      this.dataList = res.serviceGroupList;
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
      if (e == "addGroup") {
        this.addGroup();
      }
    },

    //新增资产
    addGroup() {
      this.resetDialog();
      this.groupTitle = "新增资产";
      this.isMod = false
      this.groupVisible = true;
    },
    //编辑资产
    modGroup(e) {
      this.resetDialog();
      this.groupVisible = true;
      this.isMod = true
      this.groupTitle = "编辑资产";
      this.getDetail(e.sgId);
      this.groupFormMod.sgId = e.sgId;
    },
    resetDialog() {
      this.groupForm.sgName = "";
      this.groupForm.sgDesc = "";
      this.groupForm.sgCode = "";
      this.groupForm.serviceType = "";
    },
    closeGroupDialog() {
      this.resetDialog()
      this.groupVisible = false;
    },
    confirmGroupDialog() {
      this.$refs.groupFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const params = Object.assign(
          {
            creater: JSON.parse(getLocalStorage("_userInfo")).cstName,
            arsId: this.arsId,
            bkId: this.bkId,
          },
          this.groupForm
        );
        if(!this.type) {
          params.serviceType = this.serviceType
        }
        const modParams = Object.assign(
          {
            sgId: this.groupFormMod.sgId,
          },
          this.groupForm
        );
        const api =
          this.groupTitle == "编辑资产" ? "modApiGroup" : "addApiGroup";
        const res = await this.rpc.systemmgmt[api](
          this.groupTitle == "编辑资产" ? modParams : params
        );
        this.$notify({
          title: "成功",
          message: this.groupTitle == "编辑资产" ? "编辑成功" : "新增成功",
          duration: 2000,
          type: "success",
        });
        this.search();
        this.closeGroupDialog();
      });
    },
    //删除资产
    del(e) {
      this.$confirm("是否删除该资产，名称为" + e.sgName)
        .then(async () => {
          const params = {
            sgId: e.sgId,
          };
          const res = await this.rpc.systemmgmt.delApiGroup(params);
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
    async getDetail(e) {
      const params = {
        sgId: e
      };
      const res = await this.rpc.systemmgmt.getApiGroupDetail(params);
      this.groupForm = res;
      this.changeBank();
    },
    async getTemplate() {
      const res = await this.rpc.public.getTemplateList();
      this.templateList = res.templateList;
    },
    async getBank() {
      const res = await this.rpc.public.getBankList();
      this.bankList = res.bkList;
      const bankList = res.bkList.map((item) => {
        item.type = item.bkNm;
        item.value = item.bkId;
        return item;
      });
    },
    async getServiceSysList(e) {
      const params = {
        bkId: e,
        allShowStatus: "0",
      };
      const res = await this.rpc.public.getServiceSysList(params);
      this.sysList = res.sysList;
      const sysList = res.sysList.map((item) => {
        item.type = item.arsName;
        item.value = item.arsId;
        return item;
      });
    },

    changeBank(e) {
      this.getServiceSysList(this.groupForm.bkId)
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
.aop_tradedesign_comps_dicmgmt_api_group {
  .content_wrapper {
    background: $base_white;
    padding: 0 24px 24px;
  }
  .pn_style {
    text-align: center;
  }
  .edit_form {
    @include form;
    ::v-deep .el-select {
      width: 100%;
    }
  }
}
</style>

