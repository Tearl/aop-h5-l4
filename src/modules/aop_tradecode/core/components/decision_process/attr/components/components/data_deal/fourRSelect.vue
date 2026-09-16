<template>
  <div class="aop_tradecode_comps_design_attr_data_deal_attr_select">
    <PageDialog
      class="dialog"
      :dialogWidth="'56.3%'"
      :dialogTitle="'选择参数来源及变量'"
      :dialogVisiable="dialogVisible"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <!-- 页签 -->
        <ServiceTabs
          class="tabs_box"
          :tabsList="tabsList"
          :defaultActive="defaultActive"
          @tabClick="handleTabClick"
        >
        </ServiceTabs>
        <el-form
          :rules="rules"
          :model="formData"
          ref="form"
          label-position="right"
          label-width="130px"
          class="edit_form"
        >
          <div class="form_info">
            <el-form-item
              label="输出组件名称"
              prop="actionName"
              v-if="defaultActive == 'cpnOutput'"
            >
              <el-select
                v-model="formData.actionId"
                placeholder="请选择输出组件"
                filterable
                clearable
                @change="selectChange"
              >
                <el-option
                  v-for="item in cpnList"
                  :label="item.actionName"
                  :key="item.actionId"
                  :value="item.actionId"
                ></el-option>
              </el-select>
            </el-form-item>
            <Table
              class="table_style"
              ref="paramsTableRef"
              :table="paramsTable"
              :data="paramList"
              tableType="selection"
              rowK="paramOrder"
              :cellStyle="paramListCellStyle"
              @selectionChange="selectionChange"
            ></Table>
            <!-- <el-form-item label="参数变量名称" prop="paramKey">
              <el-select
                v-model="formData.paramKey"
                placeholder="请选择参数变"
                filterable
                clearable
                multiple
                :disabled="!formData.actionName"
              >
                <el-option
                  v-for="item in paramList"
                  :label="item.paramCName"
                  :key="item.paramId"
                  :value="item.paramKey"
                ></el-option>
              </el-select>
            </el-form-item> -->
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
import Table from "@m/core/components/page_table_workgate";
import PageDialog from "@m/core/components/page_dialog";
import ServiceTabs from "@m/core/components/page_tabs";
import { mixList, reList } from "@m/utils/paramTree";
import { getSessionStorage } from "@m/utils/localStorage";

export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    ServiceTabs,
  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    isRead: {
      type: Boolean,
      default: () => false,
    },
    fourRAttrFlag: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      //页签列表
      tabsList: [
        { v: "服务输入参数", k: "servInput" },
        { v: "服务输出参数", k: "servOutput" },
        { v: "组件输出参数", k: "cpnOutput" },
        { v: "服务临时参数", k: "temp" },
      ],
      //当前页签
      defaultActive: "servInput",
      dialogVisible: false,
      formData: {
        actionId: "", // 输出组件id
        actionName: "", // 输出组件名称
        paramKey: "", // 参数变量名称
      },
      //定义规则
      rules: {
        actionId: [
          { required: true, trigger: "blur", message: "输出组件名称不能为空" },
        ],
        actionName: [
          { required: true, trigger: "blur", message: "输出组件名称不能为空" },
        ],
        paramKey: [
          { required: true, trigger: "blur", message: "参数变量名称不能为空" },
        ],
      },
      cpnList: [],
      currentRow: {},
      paramList: [],
      type: "",
      paramsTable: [
        {
          prop: "paramKey",
          label: "参数Key",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramCName",
          label: "参数名称",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
          width: "90",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramLength",
          label: "参数长度",
          width: "90",
          type: "text",
          tooltip: true,
        },
      ],
      tableData: {},
      dataList: [],
      parmaObj: {},
      currentObj: {}
    };
  },
  inject: ["getDataList"],
  methods: {
    showDialog(currentObj, type) {
      this.currentObj = currentObj
      this.parmaObj = JSON.parse(getSessionStorage("4R-paramsData"));
      console.log("showDialog", this.currentObj, type);
      // this.currentRow = row
      this.type = type;
      this.dataList = this.getDataList();
      console.log("showDialog1111", this.dataList);
      this.$nextTick(() => {
        this.cpnList = this.dataList.filter((item) => {
          return (
            item.actionId != currentObj.actionId &&
            [
              "D4bAction",
              "D5SelfAction",
              "D5LinkAction",
              "dataDealAction",
              "newD5Action",
              "dataListAction",
            ].indexOf(item.actionType) > -1
          );
        });
        console.log(this.cpnList);
        this.dialogVisible = true;
        if (this.fourRAttrFlag) {
          this.paramList = this.parmaObj.inputParamsListAtSetting;
          // this.paramList = parmaObj.outputParamsListAtSetting;
        } else {
          const p = this.currentServObj.puApiParams.filter(
            (item) => item.paramDirection === "0"
          );
          this.paramList = reList(p);
        }
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
      this.$refs.paramsTableRef.clearSelection();
      this.paramList = [];
      this.defaultActive = "servInput";
      this.formData = {
        actionId: "", // 输出组件id
        actionName: "", // 输出组件名称
        paramCName: "", // 参数变量名称
      };
    },
    closeDialog() {
      this.resetForm();
      this.dialogVisible = false;
    },
    selectionChange(e,row) {
      console.log(e,row,e.length)
      if(e.length > 1) {
        this.$refs.paramsTableRef.clearSelection();
        this.$refs.paramsTableRef.toggleRowSelection(e[e.length-1]);
      }else if(e.length == 1) {
        this.tableData = JSON.parse(JSON.stringify(e[e.length-1]));
      }else {
        this.tableData = []
      }
    },
    confirm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.$emit(
          "selectConfirm",
          this.currentObj,
          this.tableData,
          this.defaultActive
        );
        this.resetForm();
        this.dialogVisible = false;
      });
    },
    handleTabClick(e) {
      if (e.name == "servInput") {
        if (this.fourRAttrFlag) {
          this.paramList = this.parmaObj.inputParamsListAtSetting;
        } else {
          const p = this.currentServObj.puApiParams.filter(
            (item) => item.paramDirection === "0"
          );
          this.paramList = reList(p);
        }
      } else if (e.name == "servOutput") {
        if (this.fourRAttrFlag) {
          this.paramList = this.parmaObj.outputParamsListAtSetting;
        } else {
          const p = this.currentServObj.puApiParams.filter(
            (item) => item.paramDirection === "1"
          );
          this.paramList = reList(p);
        }
      } else if (e.name == "temp") {
        const p = this.currentServObj.puApiParams.filter(
          (item) => item.paramDirection === "3"
        );
        this.paramList = reList(p);
      } else {
        this.paramList = [];
      }
      this.defaultActive = e.name;
      this.tableData = {};
    },
    selectChange(e) {
      console.log("selectChange", e);
      this.formData.paramCName = "";
      const target = this.cpnList.find((item) => item.actionId == e);
      this.formData.actionName = target.actionName;
      if (
        target.actionType == "dataDealAction" ||
        target.actionType == "dataListAction"
      ) {
        this.getDataDealOutputParmas(target);
      } else {
        this.formData.actionName = target.actionName;
        this.getServiceCpnDefaultParams(target);
      }
    },
    getDataDealOutputParmas(e) {
      console.log("getDataDealOutputParmas", e);
      this.paramList = reList(
        e.paramList.filter((item) => item.paramDirection == "1")
      );
      // this.paramList = e.paramList.filter((item) => item.paramDirection == "1")
    },
    async getServiceCpnDefaultParams(e) {
      console.log("getServiceCpnDefaultParams", e);
      const params = {
        d4StusCd: "1",
        blngtoTyp: "10",
        apiId: e.conf.find((item) => item.name == "svcId").value,
        d4bApiId: this.currentServObj.apiId,
      };
      const res = await this.rpc.transactionDesign.getServiceCpnDefaultParams(params);
      this.paramList = reList(
        res.paramList.filter((item) => item.paramDirection == "1")
      );
      // this.paramList = res.paramList.filter((item) => item.paramDirection == "1")
    },
    getParamParent(arrs, id) {
      let d = [];
      for (let i = 0; i < arrs.length; i++) {
        if (arrs[i].paramOrder == id) {
          d = this.paramList.filter((data) => {
            return data.paramKey == arrs[i].paramName;
          });
          d.push(arrs[i]);
          return d;
        } else {
          if (arrs[i].paramType == "List" || arrs[i].paramType == "Object") {
            if (arrs[i].children && arrs[i].children.length > 0) {
              const j = this.getParamParent(arrs[i].children, id);
              d = j.length > 0 ? j : d;
            }
          }
        }
      }
      return d;
    },
    //多选显示
    paramListCellStyle({ row, column, rowIndex, columnIndex }) {
      if(column.type === "selection") {
        if(row.paramType == "List" || row.paramType == "Object") {
          return { visibility: "hidden" };
        } else {
          if(row.paramParentId !== "") {
            let list = row.paramOrder.split(".");
            let i = "";
            for (let j = 0; j < list.length - 1; j++) {
              i = i ? i + "." + list[j] : list[j] + "";
            }
            let d = [];
            d = this.getParamParent(this.paramList, i);
            if(d[0].paramType == "List") {
              return { visibility: "hidden" };
            }
          }
        }
      }
    },
  },
  created() {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_data_deal_attr_select {
  .dialog {
    .tabs_box {
      border-bottom: 2px solid #dcdfe6;
    }
  }
  .edit_form {
    margin-top: 10px;
    @include form;
  }
  .table_style ::v-deep .el-table__header-wrapper .el-checkbox {
    display: none;
  }
}
</style>
