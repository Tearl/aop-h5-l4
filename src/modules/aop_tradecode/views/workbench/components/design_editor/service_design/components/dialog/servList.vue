<template>
  <div class="aop_tradecode_comps_serv_list">
    <PageDialog
      dialogTitle=""
      :dialogVisiable="dialogVisible"
      dialogWidth="80%"
      @closeDialog="closeDialog"
      class="dialog"
      :apTobody="true"
    >
      <div slot="title">
        <div class="title_content">
          <div class="title">选择服务</div>
          <div class="top_btn_flex">
            <el-radio-group v-model="changeTabs" size="medium" @change="changeTypeBtn">
              <el-radio-button v-for="item in labelTbs" :key="item.value" :label="item.value" >{{item.label}}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div slot="box">
        <ServiceTop
          ref="formRef"
          :serviceForm="serviceForm"
          :form="form"
          class="service_top"
          labelwidth="auto"
          @selectChange="selectChange"
        >
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
        <div class="content">
          <div class="table_operate">
            <div class="header_content">
              <h1>服务列表</h1>
            </div>
          </div>
          <Table
            ref="dictListTableRef"
            class="table_style"
            :table="tables"
            :data="dictList"
            :rowK="'serialNumber'"
            :treeProps="{ children: 'children' }"
            :tableType="'selection'"
            selectName="freezeFlag"
            @selectionChange="handleSelectionChange"
            @operate="operate"
          ></Table>
          <PagePagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager="pager"
          >
          </PagePagination>
        </div>
      </div>
      <span slot="footer">
        <div class="show_conf">
          <div class="show_conf_title">
            已选择{{ tableData && tableData.length }}个：
          </div>
          <div class="show_conf_content">
            <el-tag
              v-for="(item, index) in tableData"
              :key="index"
              type="info"
              size="small"
              closable
              class="show_conf_tag"
              @close="delParamsTag(item)"
            >
              {{ item.aiName }}
            </el-tag>
          </div>
        </div>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </PageDialog>
    <DecisionList ref="decisionTreeCountRef"></DecisionList>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_select_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import { unduplicated, setSerialNumber } from "@m/utils/array";
import DecisionList from "./decisionList";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    DecisionList
  },
  props: {
    currentInterfaceObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialogVisible: false,
      serviceForm: [
        {
          type: "inputIcon",
          model: "apiNuCoNm",
          placeholder: "请输入",
          labelText: "服务编号/编码/名称:",
        },
        {
          type: "select",
          model: "projectId",
          placeholder: "请选择",
          labelText: "所属中心:",
          select: [],
        },
        {
          type: "select",
          model: "aiServiceGroupId",
          placeholder: "请选择",
          labelText: "所属分组:",
          select: [],
        },
        {
          type: "select",
          model: "aiState",
          placeholder: "请选择",
          labelText: "服务状态:",
          select: [
            { value: "", type: "全部" },
            { value: "1", type: "已完成" },
            { value: "2", type: "已投产" },
          ],
        },
        {
          type: "select",
          model: "freezeFlag",
          placeholder: "请选择",
          labelText: "冻结状态:",
          select: [
            { value: "", type: "全部" },
            { value: "0", type: "冻结" },
            { value: "1", type: "正常" },
          ],
        },
        {
          type: "inputIcon",
          model: "treeCoNm",
          placeholder: "请输入",
          labelText: "规则编号/名称:",
        },
      ],
      // 数据字典搜索信息表单
      form: {
        apiNuCoNm: "", // 服务编号/编码/名称
        projectId: "", //所属中心
        aiServiceGroupId: "", //所属分组
        aiState: "", //服务状态
        freezeFlag: "", //冻结状态
        treeCoNm: "", //规则编号/名称
        notDesign: "1", //默认查找已登记和已投产
      },
      // 数据字典搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        apiNuCoNm: "", // 服务编号/编码/名称
        projectId: "", //所属中心
        aiServiceGroupId: "", //所属分组
        aiState: "", //服务状态
        freezeFlag: "", //冻结状态
        treeCoNm: "", //规则编号/名称
        notDesign: "1", //默认查找已登记和已投产
      },
      // 分段列表分页器
      pager: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 分段列表参数
      tables: [
        {
          prop: "apiSeq",
          label: "服务编号",
          type: "text",
          tooltip: true,
        },
        {
          prop: "aiCode",
          label: "服务编码",
          type: "text",
          tooltip: true,
        },
        {
          prop: "aiName",
          label: "服务名称",
          type: "text",
          tooltip: true,
        },
        {
          prop: "aiVersion",
          label: "版本",
          type: "text",
          tooltip: true,
        },
        {
          prop: "aiDesc",
          label: "服务描述",
          type: "text",
          tooltip: true,
        },
        {
          prop: "centerName",
          label: "所属中心",
          type: "text",
          tooltip: true,
        },
        {
          prop: "aiServiceGroupName",
          label: "所属分组",
          type: "text",
          tooltip: true,
        },
        {
          prop: "aiState",
          label: "服务状态",
          // width: "250",
          type: "textClassList",
          filter: "serStus",
          textClassList: [
            { class: "add status", val: "2" },
            { class: "register status", val: "1" },
          ],
        },
        {
          prop: "freezeFlag",
          label: "冻结状态",
          // width: "250",
          type: "textClassList",
          filter: "freezeStus",
          textClassList: [
            { class: "add status", val: "0" },
            { class: "register status", val: "1" },
          ],
        },
        {
          prop: "bindDecisionTreeCount",
          label: "绑定规则",
          tooltip: true,
          type: "textClick",
          operate:"detail"
        },
        {
          prop: "aiModifyUserNm",
          label: "更新人",
          type: "text",
          tooltip: true,
        },
        {
          prop: "aiModifyTime",
          label: "更新时间",
          type: "text",
          tooltip: true,
        },
      ],
      // 数据字典选择列表
      dictList: [],
      // 记录是否点击分页器和搜索按钮
      isRecord: false,
      // 已选参数数组
      tableData: [],
      // 记录已经选择
      selectionData: [],
      beltLine: "",
      l5ProjectGroupInfoList: [],
      changeTabs: "current",
      labelTbs:[
        {value:"current",label:"当前域"},
        {value:"public",label:"公共域"},
      ]
    };
  },
  methods: {
    showDialog() {
      this.searchRecord = {
        apiNuCoNm: "", // 服务编号/编码/名称
        projectId: "", //所属中心
        aiServiceGroupId: "", //所属分组
        aiState: "", //服务状态
        freezeFlag: "", //冻结状态
        treeCoNm: "", //规则编号/名称
        notDesign: "1", //默认查找已登记和已投产
      };
      this.init();
      this.dialogVisible = true;
    },
    // 点击搜索按钮
    search() {
      this.isRecord = true;
      Object.assign(this.searchRecord, this.form);
      this.pager.currentPage = "1";
      this.getList(this.changeTabs);
    },
    // 点击重置按钮
    reset() {
      this.resetForm();
      this.getList(this.changeTabs);
    },
    resetForm() {
      this.pager.currentPage = "1";
      this.$refs.formRef.resetFields();
      // this.serviceForm[2].select = [];
      this.serviceForm[2].select = this.getGroupSelectList(this.l5ProjectGroupInfoList)
      this.searchRecord = {
        apiNuCoNm: "", // 服务编号/编码/名称
        projectId: "", //所属中心
        aiServiceGroupId: "", //所属分组
        aiState: "", //服务状态
        freezeFlag: "", //冻结状态
        treeCoNm: "", //规则编号/名称
        notDesign: "1", //默认查找已登记和已投产
      };
    },
    // 获取字典列表数据
    async getList(changeTabs) {
      const params = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        ...this.searchRecord,
        domainNo: (changeTabs == "current" ? this.beltLine : "FM-YWY-2022-000006") || "",
      };
      const res = await this.rpc.newEditor.getL5ServList(params);
      this.dictList = res.ifpApiInfoBos;
      this.pager.total = res.turnPageTotalNum * 1;
      this.$nextTick(() => {
        this.isTableData();
      });
    },
    // 数据字典选择每页条数改变时
    handleSizeChange(e) {
      this.isRecord = true;
      this.pager.currentPage = "1"
      this.pager.turnPageShowNum = e;
      this.getList(this.changeTabs);
    },
    // 数据字典选择当前页改变时
    handleCurrentChange(e) {
      this.isRecord = true;
      this.getList(this.changeTabs);
    },
    closeDialog() {
      this.$refs.formRef.resetFields();
      this.dialogVisible = false;
      this.resetForm();
      this.tableData = [];
    },
    async confirm() {
      if (this.tableData.length == 0) return this.$message.error("请选择服务");
      this.tableData.map((item) => {
        item.transId = this.currentInterfaceObj.apiId;
        item.apiId = item.aiId;
        item.apiState = item.aiState;
        item.apiCode = item.aiCode;
        item.apiName = item.aiName;
        // item.apiServiceType = item?.apiServiceType || "";
        item.apiSeq = item.apiSeq;
        return item;
      });
      const params = {
        svcChoiceList: this.tableData,
      };
      const res = await this.rpc.newEditor.chooseL5serv(params);
      this.$notify({
        title: "成功",
        message: "添加成功",
        duration: 2000,
        type: "success",
      });
      this.closeDialog();
      this.$emit("getInterfaceList");
    },
    // 初始化
    init() {
      this.beltLine = this.$route.query.beltLine;
      this.getList(this.changeTabs);
      this.getCenterList(this.changeTabs);
    },
    // 多选框选中
    handleSelectionChange(e) {
      if (!this.isRecord && this.selectionData.length > e.length) {
        this.selectionData.forEach((item) => {
          if (e.indexOf(item) == -1) {
            this.tableData = this.tableData.filter(
              (it) => it.aiId != item.aiId
            );
          }
        });
      } else {
        this.tableData.push(...e);
        this.tableData = unduplicated(this.tableData, "aiId");
      }
      this.selectionData = e;
      this.isRecord = false;
    },
    delParamsTag(e) {
      // console.log(e, "eeee");
      const index = this.dictList.findIndex((item) => item.aiId == e.aiId);
      if (index == -1) {
        this.tableData = this.tableData.filter((it) => it.aiId != e.aiId);
      } else {
        this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
          this.dictList[index],
          false
        );
      }
    },
    // tableData数据选中表格中
    isTableData() {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item) => {
          this.dictList.forEach((data) => {
            if (item.aiId == data.aiId) {
              this.isRecord = true;
              this.$refs.dictListTableRef.$refs.tableRef.toggleRowSelection(
                data
              );
            }
          });
        });
      }
    },
    /**
     * 所属中心
     */
    async getCenterList(changeTabs) {
      let res = await this.rpc.newEditor.getCenterList({
        bizDomainNo:(changeTabs == "current" ? this.beltLine : "FM-YWY-2022-000006") || "",
      });
      // if (res.l5ProjectGroupInfoList?.length > 0) {
      //   this.l5ProjectGroupInfoList = res.l5ProjectGroupInfoList;
      // }
      this.l5ProjectGroupInfoList = res.l5ProjectGroupInfoList;
      this.serviceForm[1].select = res.l5ProjectGroupInfoList?.reduce(
        (prev, item) => {
          prev.push({
            value: item.projectId,
            type: item.projectNm,
          });
          return prev;
        },
        [{ value: "", type: "全部" }]
      );
      this.serviceForm[2].select = await this.getGroupSelectList(this.l5ProjectGroupInfoList)
    },
    selectChange(data, type) {
      console.log(type, data, "=----->");
      if (type == "projectId") {
        this.l5ProjectGroupInfoList.map((item, index) => {
          if (item.projectId == data) {
            this.$nextTick(() =>{
              this.serviceForm[2].select = item.l5GroupInfoList?.reduce(
                (prev, iitem) => {
                  prev.push({
                    value: iitem.l5GroupId,
                    type: iitem.l5GroupNm,
                  });
                  return prev;
                },
                [{ value: "", type: "全部" }]
              );
            })
          } else if (data == "") {
            this.form.aiServiceGroupId = "";
            this.serviceForm[2].select = this.getGroupSelectList(this.l5ProjectGroupInfoList)
          } else {
            this.form.aiServiceGroupId = "";
            this.serviceForm[2].select = [];
          }
        });
      }
    },
    /**
     * 按照所属中心查询分组
     */
    async getGroupList(data) {
      let res = await this.rpc.newEditor.getGroupList({
        projectId: data,
      });
      this.serviceForm[2].select = res.l5GroupInfoList?.reduce(
        (prev, item) => {
          prev.push({
            value: item.l5GroupId,
            type: item.l5GroupNm,
          });
          return prev;
        },
        [{ value: "", type: "全部" }]
      );
    },
    operate(op,data){
      if(op == "detail"){
        this.$refs.decisionTreeCountRef.showDialog(data)
      }
    },
    async changeTypeBtn(val) {
      await this.resetForm();
      await this.getList(val);
      await this.getCenterList(val);
    },
    getGroupSelectList(dataList){
      let arr = [];
      dataList.forEach(item =>{
        if(item.l5GroupInfoList.length > 0){
          item?.l5GroupInfoList.forEach((iitem) =>{
            arr.push({
              value: iitem.l5GroupId,
              type: iitem.l5GroupNm,
            })
          })
        }
      })
      arr.unshift({ value: "", type: "全部" })
      return arr;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_comps_serv_list {
  .content {
    padding: 0px 30px;
  }
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }

  .service_top ::v-deep.serivce_top_box {
    padding: 0;
    margin: 0;
  }
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
    }
  }

  ::v-deep .el-form-item__label {
    width: 86px !important;
  }
}
.dialog {
  .content {
    padding: 0px 30px;
  }
  ::v-deep.el-dialog {
    margin-top: 3vh !important;
  }
  ::v-deep.el-dialog__body {
    max-height: 78vh;
  }
  .show_conf {
    padding: 15px 24px;
    overflow: hidden;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
      span {
        color: #358aff;
      }
    }
    .show_conf_content {
      float: left;
    }
    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .table_operate {
    padding: 16px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    h1 {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #111111;
      letter-spacing: 0;
    }
    .header_content {
      display: flex;
      justify-content: space-between;
      // flex: 1;
      width: 100%;
      margin-right: 10px;
      .btn_style {
        @include small_button_common;
      }
    }
  }

  ::v-deep .el-dialog .el-dialog__body {
    padding: 0px !important;
  }
  ::v-deep .aop_tradecode_comps_page_service_top {
    // height: 160px !important;
    margin-bottom: 0px !important;
    padding: 16px 24px 8px 24px !important;
  }
  ::v-deep .aop_tradecode_comps_page_service_top .serivce_top .serivce_top_left{
    flex: 1;
  }
  ::v-deep
    .aop_tradecode_comps_page_service_top
    .el-form
    .el-form-item
    .el-input {
    width: 160px;
  }

  ::v-deep .show_conf {
    padding: 15px 0px;
    overflow: hidden;
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: 16px;
    // box-shadow: inset 0 1px 0 0 #F5F5FA;
    .show_conf_title {
      float: left;
      margin-right: 10px;
      font-family: $font_medium;
      span {
        color: #358aff;
      }
    }
    .show_conf_content {
      float: left;
    }
    .show_conf_tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .top_btn_flex{
    margin-top: -36px;
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
    z-index: 100 !important;
  }
}
</style>
