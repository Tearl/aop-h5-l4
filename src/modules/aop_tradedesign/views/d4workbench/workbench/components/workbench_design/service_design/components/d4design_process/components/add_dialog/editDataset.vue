<template>
  <div class="aop_workgate_comps_systemmgmt_dic_form_select">
    <PageDialog
      :dialogWidth="'90%'"
      :dialogVisiable="addDataVisible"
      :dialogTitle="dataTitle"
      @closeDialog="closeDataDialog"
      :apTobody="true"
      :customClass="'customClass'"
    >
      <div slot="box">
        <el-form
          ref="formRef"
          :model="dataSetForm"
          :rules="dataRules"
          label-width="130px"
          class="edit_form"
        >
          <el-form-item label="名称" prop="dataSetNm">
            <el-input
              placeholder="请输入名称"
              v-model="dataSetForm.dataSetNm"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属部" prop="beltLine">
            <el-select
              placeholder="请选择所属部"
              v-model="dataSetForm.beltLine"
              :disabled="type == 'edit'"
            >
              <el-option
                v-for="(item, index) in departmentList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属册" prop="classifyId">
            <el-select
              placeholder="请选择所属册"
              v-model="dataSetForm.classifyId"
            >
              <el-option
                v-for="(item, index) in volumeList"
                :key="index"
                :label="item.label"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="dataSetDesc">
            <el-input
              type="textarea"
              :rows="3"
              v-model="dataSetForm.dataSetDesc"
              clearable
              placeholder="请输入描述"
              :maxlength="length"
            />
          </el-form-item>
        </el-form>
        <TabsContent
          ref="tabsContentRef"
          class="card_style"
          fourDesign="edit"
          :isShow="false"
          :widthChange="false"
          :serviceTrue="true"
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
        <AddField
          ref="addFieldRef"
          @confirmComplete="confirmField"
          :datasetInfo="dataObj"
          :subInfo="substnObj"
        ></AddField>
        <AddSub
          ref="addSubRef"
          :infoData="dataObj"
          @confirmComplete="confirmSub"
        ></AddSub>
        <AddServ
          ref="addServRef"
          :infoData="dataObj"
          @confirmComplete="confirmServ"
        ></AddServ>
        <EditField
          ref="editFieldRef"
          @confirmComplete="confirmField"
          type="edit"
          :datasetInfo="dataObj"
          :subInfo="substnObj"
        ></EditField>
        <editServ
          ref="editServRef"
          :infoData="dataObj"
          @confirmComplete="confirmServ"
          :editFlag="true"
        ></editServ>
        <EditSub
          ref="editSubRef"
          :infoData="dataObj"
          @confirmComplete="confirmSub"
        ></EditSub>
        <SubDetail ref="subDetailRef" @detailClick="detailDataClick"></SubDetail>
        <L5Detail ref="l5DetailRef"></L5Detail>
        <FieldDetail ref="fieldDetailRef"></FieldDetail>
      </div>
      <div slot="footer">
        <el-button @click="closeDataDialog">取 消</el-button>
        <el-button type="primary" @click="dataConfirm">确 定</el-button>
      </div>
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
import TabsContent from "../addServ/components/tabsContent";
import AddField from "../add_dialog/addField";
import AddSub from "../add_dialog/addSub";
import AddServ from "../add_dialog/addServ";
import EditField from "../add_dialog/editField";
import EditSub from "../add_dialog/editSub";
import EditServ from "../add_dialog/editServ";
import SubDetail from "../add_dialog/subDetail";
import FieldDetail from "../add_dialog/fieldDetail";
import L5Detail from "../add_dialog/L5serviceDetail";

export default {
  mixins: [mixin],
  components: {
    PageDialog,
    PagePagination,
    Table,
    ServiceTop,
    TabsContent,
    AddField,
    AddSub,
    AddServ,
    EditField,
    EditSub,
    EditServ,
    SubDetail,
    FieldDetail,
    L5Detail
  },
  props: {
    type: {
      type: String,
      default: () => "detail",
    },
    dictGategList: {
      type: Array,
      default: () => false,
    },
    dataInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      addDataVisible: false,
      dataTitle: "添加数据集",
      dataSetForm: {
        dataSetNm: "",
        dataSetDesc: "",
        classifyId: "",
        beltLine: "",
      },
      dataRules: {
        dataSetNm: [
          { required: true, trigger: "blur", message: "请输入数据集名称" },
        ],
        beltLine: [{ required: true, trigger: "blur", message: "请选择部" }],
        classifyId: [{ required: true, trigger: "blur", message: "请选择册" }],
      },
      //所属部下拉框
      departmentList: [
        { value: "0", label: "对公业务" },
        { value: "1", label: "对私业务" },
        { value: "2", label: "营销业务" },
      ],
      //所属册下拉框
      volumeList: [
        { name: "1", label: "C1 用户册" },
        { name: "2", label: "P1 机构册" },
        { name: "3", label: "C2 渠道册" },
        { name: "4", label: "P2 产品册" },
        { name: "5", label: "C3 合约册" },
        { name: "6", label: "S 系统册" },
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
    showDialog(type, data) {
      this.addDataVisible = true;
      console.log("编辑");
      if (type == "editData") {
        this.dataTitle = "编辑数据集";
        this.fieldList = [];
        this.L5serviceList = [];
        this.piecewiseList = [];
        this.fieldCount = "0";
        this.servCount = "0";
        this.susStnCount = "0";
        this.getMyDataSetDetail(data);
      } else {
        this.dataTitle = "添加数据集";
        console.log(data, "添加数据集");
        // this.dataSetForm.classifyId = data.dataSetNo
      }
    },
    closeDataDialog() {
      this.$refs.formRef.resetFields();
      this.addDataVisible = false;
    },
    //确认编辑添加
    dataConfirm() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.dataSetForm,
          };
          const api =
            this.dataTitle == "添加数据集" ? "addMydataSet" : "editMydataSet";
          const res = await this.rpc.dicmgmtDefine[api](params);
          this.$notify({
            title: "成功",
            message: this.dataTitle == "添加数据集" ? "新增成功" : "编辑成功",
            duration: 2000,
            type: "success",
          });
          this.closeDataDialog();
          this.$emit("confirmComplete");
        }
      });
    },
    //FM-SJJ-111025
    async getMyDataSetDetail(data) {
      const params = {
        dataSetNo: data.dataSetNo,
      };
      const res = await this.rpc.dicmgmtDefine.getMyDataSetDetail(params);
      this.dataSetForm = res;
      this.dataObj = res;
      console.log("getMyDataSetDetail", res);
      this.getSubsList();
    },
    async getSubsList() {
      const params = {
        dataSetNo: this.dataSetForm.dataSetNo,
        currentPage: "1",
        turnPageShowNum: "99",
      };
      const res = await this.rpc.dicmgmt.getSubStnList(params);
      this.piecewiseList = [];
      this.piecewiseList = res.dataSubsectionList;
      this.susStnCount = res.turnPageTotalNum;
      this.$refs.tabsContentRef.piecewiseStyle = "0";
      if (!res.dataSubsectionList.length) {
        this.substnObj = {};
      } else {
        Object.assign(this.substnObj, res.dataSubsectionList[0] || {});
        this.getFieldList();
      }
    },
    async getFieldList() {
      const params = {
        dataSubstnNo: this.substnObj.dataSubstnNo,
        currentPage: "1",
        turnPageShowNum: "99",
      };
      const res = await this.rpc.dicmgmtDefine.getMyFieldList(params);
      this.fieldList = [];
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
      this.L5serviceList = [];
      this.L5serviceList = res.l5SvcList;
      this.servCount = res.turnPageTotalNum;
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
          this.fieldList = [];
          this.L5serviceList = [];
          this.getFieldList();
          this.$refs.tabsContentRef.piecewiseStyle = index;
          break;
        case "2":
          Object.assign(this.fieldObj, item);
          this.L5serviceList = [];
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
    detailDataClick(data,type){
      if(type == "1"){
        console.log("1",data);
        this.$nextTick(() =>{
          this.$refs.subDetailRef.showDialog(data);
        })
      }else if (type == "2"){
        this.$nextTick(() =>{
          this.$refs.fieldDetailRef.showDialog(data)
        })
        console.log("2",data)
      }else if(type =="3"){
        this.$nextTick(() =>{
          this.$refs.l5DetailRef.showDialog(data);
        })
        console.log("3",data)
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
.customClass {
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
