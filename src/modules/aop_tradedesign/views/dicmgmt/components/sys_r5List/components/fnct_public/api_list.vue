<template>
  <div class="aop_tradedesign_comps_apimgmt_up_api_public_api_list">
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
        class="content_wrapper_header"
        title="R5管理"
        :btnList="btnList"
        @btnClick="handleBtnClik"
      >
      </TableHeader>

      <div class="wrapper_box">
        <div class="wrapper_box_right">
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
      </div>
    </div>
    <!-- 新建API -->
    <PageDialog
      :dialogWidth="'56.3%'"
      dialogTitle="新建API"
      :dialogVisiable="apiDialogVisiable"
      @closeDialog="closeApiDialog"
    >
      <div slot="box">
        <el-form
          :model="apiData"
          :rules="apiRules"
          class="create_form"
          ref="apiData"
          label-width="130px"
        >
          <div class="create_form_info">
            <el-form-item label="API名称" prop="apiName">
              <el-input
                v-model="apiData.apiName"
                clearable
                placeholder="请输入API名称"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="API编码" prop="apiCode">
              <el-input
                v-model="apiData.apiCode"
                clearable
                placeholder="/example"
              >
              </el-input>
              <div class="create_form_tips"></div>
            </el-form-item>
            <el-form-item label="业务资产" prop="apiGroupId">
              <el-select
                v-model="apiData.apiGroupId"
                placeholder="请选择业务资产"
                filterable
                size="small"
              >
                <el-option
                  v-for="item in apiGroupList"
                  :label="item.sgName"
                  :key="item.sgId"
                  :value="item.sgId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="API版本" prop="apiVersion">
              <div class="form_item_flex">
                <el-input
                  v-model="apiData.apiVersion"
                  clearable
                  placeholder="对外发布API版本号，如1.0.0"
                />
                <span class="icon_right">
                  <i class="el-icon-caret-top" @click="iconClick('add')"></i>
                  <i
                    class="el-icon-caret-bottom"
                    @click="iconClick('lose')"
                  ></i>
                </span>
              </div>
            </el-form-item>
            <el-form-item label="报文格式" prop="templateId" required>
              <span>{{ msgFormat ? msgFormat : "自定义" }}</span>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="closeApiDialog">取 消</el-button>
        <el-button type="primary" @click="saveApiDialog">确 定</el-button>
      </div>
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
import validate from "@m/utils/validate";
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
    groupName: {
      type: String,
      default: () => "全部接口",
    },
    type: {
      type: String,
      default: () => "",
    },
    fnctId: {
      type: String,
      default: () => "",
    },
    servType: {
      type: String,
      default: () => "",
    },
    apiState: {
      type: String,
      default: () => "0",
    },
  },
  data() {
    return {
      //头部搜索
      serviceForm: [
        {
          type: "input",
          model: "apiName",
          placeholder: "API名称",
          style: {
            width: "240px",
          },
        },
        {
          type: "input",
          model: "apiCode",
          placeholder: "API编码",
          style: {
            width: "240px",
          },
        },
      ],
      // 搜索条件
      form: {
        apiName: "",
        apiCode: "",
        apiState: "2",
        bkId: "",
        relySys: "",
        groupId: "",
      },
      // 点击搜索按钮后，记录搜索条件
      searchForm: {
        apiName: "",
        apiCode: "",
        apiState: "2",
        bkId: "",
        relySys: "",
        groupId: "",
      },
      //按钮列表
      btnList: [
        {
          name: "R5创建",
          value: "add",
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
          prop: "apiSeq",
          label: "API ID",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiName",
          label: "API名称",
          width: "200",
          type: "textClick",
          operate: "check",
          tooltip: true,
        },
        {
          prop: "apiCode",
          label: "API编码",
          width: "200",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiServiceType",
          label: "服务类型",
          width: "120",
          type: "text",
          tooltip: true,
        },
        {
          prop: "relySysName",
          label: "服务应用",
          width: "160",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apiGroupName",
          label: "业务资产",
          width: "120",
          type: "text",
          tooltip: true,
        },
        {
          prop: "mockCaseNum",
          label: "Mock数",
          width: "120",
          type: "textClick",
          operate: "mockCaseNum",
          align: "center",
        },
        {
          prop: "action",
          label: "操作",
          width: "80",
          fixed: "right",
          type: "button",
          buttonList: [
            {
              desc: "删除",
              operate: "del",
            },
          ],
        },
      ],
      // 分页器参数
      pager: { currentPage: 1, turnPageShowNum: 10, total: 0 },

      selectionAll: [],
      isPopCompleteShow: false,
      pageDesc: "",
      //r5创建
      //API发布
      apiData: {
        apiName: "", // 名称
        apiCode: "", // 编号
        apiVersion: "1.0.0", // 版本
        apiGroupId: "",
        arsId: "",
        templateId: "35630836010608041738",
      },
      apiRules: {
        apiName: [
          { required: true, trigger: "blur", message: "请输入API名称" },
        ],
        apiCode: [
          {
            required: true,
            trigger: "blur",
            message: "请输入正确的API编码",
            validator: validate.isPathId,
          },
        ],
        apiGroupId: [
          { required: true, trigger: "change", message: "请选择所属业务资产" },
        ],
        apiVersion: [
          { required: true, trigger: "blur", message: "请输入版本号" },
        ],
      },
      apiDialogVisiable: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.type == "view") {
        this.tableColumn[6].type = "text";
      }
      this.getList();
      this.getApiGroupList();
    },
    // 获取资产
    //获取业务资产列表
    async getApiGroupList(e) {
      const params = {
        arsId: this.arsId,
        serviceType: "自有L5服务"
      };
      const res = await this.rpc.public.getApiGroupList(params);
      this.apiGroupList = res.apiGroupList;
    },
    operate(operation, data) {
      if (operation == "enable") {
        this.changeAble(data, 0);
      } else if (operation == "disable") {
        this.changeAble(data, 1);
      } else if (operation == "check") {
        this.$emit("toApiView", data.apiId, data.relySys, data.apiServiceType);
        // this.toDetail(data);
      } else if (operation == "mockCaseNum") {
        this.$emit("toApiCase", data.apiId, data.relySys);
      } else if (operation == "del") {
        this.$confirm(`请确认是否删除该R5服务？名称为：${data.apiName}`).then(
          async () => {
            const res = await this.rpc.apimgmt.handleApiState({
              apiId: data.apiId,
              apiState: "-1"
            });
            this.$notify({
              title: "成功",
              message: "删除成功",
              duration: 2000,
              type: "success",
            });
            this.getList();
          }
        );
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
        fnctId: this.fnctId,
        relySys: this.arsId,
        bkId: this.searchForm.bkId,
        apiName: this.searchForm.apiName,
        apiCode: this.searchForm.apiCode,
        apiServiceType: "R5自有服务",
        apiState: "0",
        currentPage: this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      const res = await this.rpc.public.getApiManageList(params);
      console.log(res);
      this.dataList = res.apiList;
      this.pager.total = res.turnPageTotalNum * 1;
      this.resData = res.apiList;
      if (this.selectionAll.length != 0) {
        this.resData.map((item) => {
          this.selectionAll.map((i) => {
            if (item.apiId == i.apiId) {
              item["_checked"] = true;
            }
          });
        });
      }
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
      console.log(e);
      this.apiDialogVisiable = true;
    },

    // r5创建
    //关闭发布API
    closeApiDialog() {
      this.$refs.apiData.resetFields();
      this.apiDialogVisiable = false;
    },
    //发布API
    saveApiDialog() {
      this.$refs.apiData.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息输入有误");
        const params = Object.assign(this.apiData, {
          arsId: this.arsId,
          apiServiceType: "R5自有服务",
          apiSource: "D5工作台",
          createNm: JSON.parse(getLocalStorage("_userInfo")).cstName
        });
        const res = await this.rpc.apimgmt.handleSimpleApiPublish(params);
        this.$notify({
          title: "成功",
          message: "新增成功",
          duration: 2000,
          type: "success",
        });
        this.closeApiDialog();
        this.getList();
      });
    },
    // 版本号增减点击
    iconClick(e) {
      this.$refs.apiData.validateField(["apiVersion"], (valid) => {
        if (valid) return;
        if (e == "add") {
          let list = this.apiData.apiVersion.split(".");
          list[2] = Number(list[2]) + 1;
          if (list[2] > 9) {
            list[2] = 0;
            list[1] = Number(list[1]) + 1;
            if (list[1] > 9) {
              list[1] = 0;
              list[0] = Number(list[0]) + 1;
              if (list[0] > 9) return;
            }
          }
          let n = list.join(".");
          this.apiData.apiVersion = n;
        } else {
          let list = this.apiData.apiVersion.split(".");
          list[2] = Number(list[2]) - 1;
          if (list[2] < 0) {
            list[2] = 9;
            list[1] = Number(list[1]) - 1;
            if (list[1] < 0) {
              list[1] = 9;
              list[0] = Number(list[0]) - 1;
              if (list[0] < 1) return;
            }
          }
          let n = list.join(".");
          this.apiData.apiVersion = n;
        }
      });
    },
  },
  watch: {
    arsId(n, o) {
      this.init();
    },
    groupName(n, o) {
      this.init();
    },
    fnctId(n, o) {
      this.init();
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_up_api_public_api_list {
  // padding: 16px;
  .content_wrapper {
    background: $base_white;
    .content_wrapper_header {
      padding: 0 24px;
    }
  }
  .pn_style {
    text-align: center;
  }

  .wrapper_box {
    background-color: #f7f7f9;
    display: flex;
    .wrapper_box_left {
      margin-right: 16px;
      width: 155px;
      background: $base_white;
      padding: 0 12px;
      .wrapper_box_left_title {
        padding-left: 10px;
        background: $base_white;
        display: inline-block;
        width: 100%;
        font-size: 16px;
        color: #131313;
        font-weight: $font_weight_600;
        height: 64px;
        line-height: 64px;
      }
      .el-menu {
        border-right: 0;
        ::v-deep .is-active {
          color: #303133;
        }
        .is_active {
          color: $theme_color;
          background-color: #ebf3ff;
        }
        .tab_label_title {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          display: inline-block;
        }
        .tab_label_number {
          font-weight: $font_weight_600;
          color: $theme_color;
        }
        ::v-deep .el-menu-item {
          padding-left: 10px !important;
          height: 36px;
          line-height: 36px;
          font-size: 14px;
          letter-spacing: 0;
        }
      }
    }
    .wrapper_box_right {
      background: $base_white;
      padding: 0 24px 24px;
      flex: 1;
      overflow: hidden;
    }
  }
  .title_color {
    color: $theme_color;
  }
  .edit_form,
  .create_form {
    @include form;
    ::v-deep .el-select {
      width: 100%;
    }
  }
  .form_item_flex {
    display: flex;
    .icon_right {
      margin-left: 5px;
      display: flex;
      flex-flow: column;
      font-size: 21px;
      i {
        cursor: pointer;
        line-height: 20px;
      }
    }
  }
}
</style>

