<template>
  <div class="aop_workgate_comps_systemmgmt_dic_form_select">
    <PageDialog
      dialogTitle="基本信息"
      :dialogVisiable="dialogVisible"
      dialogWidth="70%"
      @closeDialog="closeDialog"
      class="dialog"
      :apTobody="true"
      :customClass="'customClass'"
    >
      <div slot="box">
        <el-form
          ref="formRef"
          :model="subForm"
          :rules="rules"
          label-width="130px"
          class="edit_form"
        >
          <el-form-item label="所属数据集" prop="">
            <span>{{ subForm.dataSetNm }}</span>
          </el-form-item>
          <el-form-item label="名称" prop="dataSubstnNm">
            <el-input
              placeholder="请输入名称"
              v-model="subForm.dataSubstnNm"
            ></el-input>
            <el-button class="" type="primary" @click="showSelectDialog"
              >从字段池中选择</el-button
            >
          </el-form-item>
          <el-form-item label="所属部" prop="">
            <span>{{
              infoData.beltLine || subForm.beltLine | beltLineType
            }}</span>
          </el-form-item>
          <el-form-item label="关系" prop="dataSubstnAttr">
            <el-select
              placeholder="请选择关系"
              v-model="subForm.dataSubstnAttr"
            >
              <el-option
                v-for="(item, index) in relationList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <TabsContent
          ref="tabsContentRef"
          class="card_style"
          fourDesign="edit"
          :isShow="false"
          :widthChange="true"
          :serviceTrue="true"
          :piecewiseTrue="false"
          :fieldList="fieldList"
          :piecewiseList="piecewiseList"
          :L5serviceList="L5serviceList"
          :susStnCount="susStnCount"
          :fieldCount="fieldCount"
          :servCount="servCount"
          @detailClick="detailClick"
          @dataChange="dataChange"
          @checkChange="checkChange"
          @reFresh="reFresh"
          @addType="addType"
        ></TabsContent>
        <!-- 从字段池中选择 -->
        <SelectFromFiledPool
          ref="selectRef"
          @confirmData="confirmData"
        ></SelectFromFiledPool>
        <AddField
          ref="addFieldRef"
          @confirmComplete="confirmField"
          :datasetInfo="infoData"
          :subInfo="substnObj"
        ></AddField>
        <AddServ
          ref="addServRef"
          :infoData="infoData"
          @confirmComplete="confirmServ"
        ></AddServ>
        <EditField
          ref="editFieldRef"
          @confirmComplete="confirmField"
          type="edit"
          :datasetInfo="infoData"
          :subInfo="substnObj"
        ></EditField>
        <editServ
          ref="editServRef"
          :infoData="infoData"
          @confirmComplete="confirmServ"
          :editFlag="true"
        ></editServ>
        <L5Detail ref="l5DetailRef"></L5Detail>
        <FieldDetail ref="fieldDetailRef"></FieldDetail>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table"; // 公共表格组件
import PageDialog from "@m/core/components/page_dialog";
import PagePagination from "@m/core/components/page_pagination";
import ServiceTop from "@m/core/components/page_search_top"; // 搜索栏
import { unduplicated } from "@m/utils/array";
import SelectFromFiledPool from "./components/selcFromSubsectionPool";
import filters from "@m/utils/filters";
import TabsContent from "../addServ/components/tabsContent";
import AddField from "../add_dialog/addField";
import AddServ from "../add_dialog/addServ";
import EditField from "../add_dialog/editField";
import EditServ from "../add_dialog/editServ";
import FieldDetail from "../add_dialog/fieldDetail";
import L5Detail from "../add_dialog/L5serviceDetail";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    SelectFromFiledPool,
    TabsContent,
    AddField,
    AddServ,
    EditField,
    EditServ,
    FieldDetail,
    L5Detail
  },
  filters: {
    ...filters,
  },
  props: {
    infoData: {
      type: Object,
      default: () => ({})
    },
    dictGategList: {
      type: Array,
      default: () => false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      subForm: {
        dataSubstnNm: "",
        dataSubstnAttr: "",
      },
      rules: {
        dataSubstnNm: [
          { required: true, trigger: "blur", message: "请输入分段名称" },
        ],
        dataSubstnAttr: [
          { required: true, trigger: "blur", message: "请选择关系" },
        ],
      },
      relationList: [
        { value: "01", label: "1:1" },
        { value: "02", label: "1:N" },
      ],
      fieldList: [],
      piecewiseList: [],
      L5serviceList: [],
      susStnCount: "0",
      fieldCount: "0",
      servCount: "0",
      substnObj: {},
      fieldObj: {},
      L5SerObj: {},
    };
  },
  methods: {
    showDialog(data) {
      if (data){
        this.getSubDetail(data);
        this.fieldList = [];
        this.L5serviceList = [];
        this.fieldCount ="0";
        this.servCount ="0"
      }
      else this.subForm = { dataSubstnNm: "", dataSubstnAttr: "" };
      this.dialogVisible = true;
    },
    closeDialog() {
      this.$refs.formRef.resetFields();
      this.dialogVisible = false;
    },
    showSelectDialog() {
      this.$refs.selectRef.showDialog();
    },
    confirm() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.subForm,
            blgDataSetNo: this.infoData.dataSetNo,
          };
          const api = this.subForm.dataSubstnNo ? "editSubStn" : "addSubStn";
          const res = await this.rpc.dicmgmtDefine[api](params);
          this.$notify({
            title: "成功",
            message: this.subForm.dataSubstnNo ? "编辑成功" : "新增成功",
            duration: 2000,
            type: "success",
          });
          this.closeDialog()
          this.$emit("confirmComplete");
        }
      });
    },
    //从字段池选择点击确定
    confirmData(data) {
      console.log(data);
      this.subForm.dataSubstnNm = data.dictryNm;
    },
    async getSubDetail(data) {
      const params = {
        dataSubstnNo: data.dataSubstnNo,
      };
      const res = await this.rpc.dicmgmtDefine.getSubStnDetail(params);
      this.subForm = res;
      this.substnObj = res;
      this.getFieldList();
    },
    async getFieldList() {
      const params = {
        dataSubstnNo: this.subForm.dataSubstnNo,
        currentPage: "1",
        turnPageShowNum: "99",
      };
      const res = await this.rpc.dicmgmtDefine.getMyFieldList(params);
      this.fieldList = res.dataSetDataRelationList;
      this.fieldCount = res.turnPageTotalNum;
      this.$refs.tabsContentRef.fieldStyle = "0";
      if (!res.dataSetDataRelationList.length) {
        this.fieldObj = {};
      } else {
        Object.assign(this.fieldObj, res.dataSetDataRelationList[0] || {});
        this.getServList();
      }
    },
    async getServList() {
      const params = {
        dataSetDataId: this.fieldObj.dataSetDataId,
        currentPage: "1",
        turnPageShowNum: "99",
      };
      const res = await this.rpc.dicmgmtDefine.getL5ServList(params);
      this.L5serviceList = res.l5SvcList;
      this.servCount = res.turnPageTotalNum;
      this.$refs.tabsContentRef.L5serviceStyle = "0";
    },
    dataChange(item, index, e) {
      console.log("当前点击", item, index, e);
      switch (e) {
        // case "0":
        //   Object.assign(this.dataObj, item);
        //   this.getSubsList();
        //   this.$refs.tabsContentRef.dataStyle = index;
        //   break;
        case "1":
          Object.assign(this.substnObj, item);
          this.L5serviceList = [];
          this.getFieldList();
          this.$refs.tabsContentRef.piecewiseStyle = index;
          break;
        case "2":
          Object.assign(this.fieldObj, item);
          this.getServList();
          this.$refs.tabsContentRef.fieldStyle = index;
          break;
        case "3":
          this.$refs.tabsContentRef.L5serviceStyle = index;
          break;
      }
    },
    addType(type) {
      console.log("添加", type);
      switch (type) {
        case "dataSet":
          this.$refs.addDatasetRef.showDialog(type);
          break;
        case "subsection":
          this.$nextTick(() => {
            this.$refs.addSubRef.showDialog();
          });
          break;
        case "field":
          this.$nextTick(() => {
            this.$refs.addFieldRef.showFiledDialog();
          });
          break;
        case "service":
          this.$nextTick(() => {
            this.$refs.addServRef.showDialog(type);
            console.log("服务添加");
          });
          break;
      }
    },
    detailClick(item, e, type) {
      if (e == "1" && type == "mod") {
        this.$nextTick(() => {
          this.$refs.editSubRef.showDialog(item);
        });
        console.log("分段编辑");
      } else if (e == "1" && type == "delete") {
        this.delOp("sub", item);
        console.log("分段删除");
      } else if (e == "1" && type == "read") {
        // this.$emit("detailClick",e,item);
        this.$nextTick(() => {
          this.$refs.subDetailRef.showDialog(item);
        });
        console.log("分段详情");
      } else if (e == "2" && type == "mod") {
        this.$nextTick(() => {
          this.$refs.editFieldRef.showFiledDialog(item);
        });
        console.log("字段编辑");
      } else if (e == "2" && type == "delete") {
        this.delOp("field", item);
        console.log("字段删除");
      } else if (e == "2" && type == "read") {
        this.$nextTick(() => {
          this.$refs.fieldDetailRef.showDialog(item);
        });
        // this.$emit("detailClick",e,item);
        console.log("字段详情");
      } else if (e == "3" && type == "mod") {
        this.$nextTick(() => {
          this.$refs.editServRef.showDialog("editData", item);
        });
        console.log("L5服务编辑");
      } else if (e == "3" && type == "delete") {
        this.delOp("L5Serv", item);
        console.log("L5服务删除");
      } else if (e == "3" && type == "read") {
        this.$nextTick(() => {
          this.$refs.l5DetailRef.showDialog(item);
        });
        // this.$emit("detailClick",e,item);
        console.log("L5服务详情");
      }
    },
    delOp(type, data) {
      if (type == "sub") {
        this.$confirm("是否删除该分段").then(async () => {
          const params = {
            dataSubstnNo: data.dataSubstnNo,
          };
          const res = await this.rpc.dicmgmtDefine.delSubStn(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getSubsList();
        });
      } else if (type == "field") {
        this.$confirm("是否删除该字段").then(async () => {
          const params = {
            dataSetDataId: data.dataSetDataId,
          };
          const res = await this.rpc.dicmgmtDefine.delMyField(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getFieldList();
        });
      } else if (type == "L5Serv") {
        this.$confirm("是否删除该服务").then(async () => {
          const params = {
            apiId: data.l5SvcId,
            dataSetNo: data.dataSetNo,
          };
          const res = await this.rpc.dicmgmtDefine.delL5Serv(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getServList();
        });
      }
    },
    confirmSub() {
      this.getSubsList();
    },
    confirmField() {
      this.getFieldList();
    },
    confirmServ() {
      this.getServList();
    },
    // 初始化
    init() {
      // this.getList();
      // this.getClassifyTypeList()
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_systemmgmt_dic_form_select {
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }
  .dialog {
    ::v-deep.el-dialog {
      margin-top: 3vh !important;
    }
    ::v-deep.el-dialog__body {
      max-height: 78vh;
    }
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
  .edit_form {
    @include form;
    .header_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #131313;
      letter-spacing: 0;
      margin-bottom: 20px;
      font-weight: 600;
    }
    /deep/ .el-input,
    /deep/ .el-textarea__inner {
      width: 400px;
    }
    ::v-deep .el-button {
      @include large_button_common;
    }
    .no_before {
      ::v-deep .el-form-item__label::before {
        content: "";
      }
    }
  }
}
.customClass{
  ::v-deep .table_dialog th {
    color: $sec_ft_color;
  }
  .dialog {
    ::v-deep.el-dialog {
      margin-top: 3vh !important;
    }
    ::v-deep.el-dialog__body {
      max-height: 78vh;
    }
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
  .edit_form {
    @include form;
    .header_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #131313;
      letter-spacing: 0;
      margin-bottom: 20px;
      font-weight: 600;
    }
    /deep/ .el-input,
    /deep/ .el-textarea__inner {
      width: 400px;
    }
    ::v-deep .el-button {
      @include large_button_common;
    }
    .no_before {
      ::v-deep .el-form-item__label::before {
        content: "";
      }
    }
  }
}
</style>
