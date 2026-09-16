<template>
  <div class="aop_tradecode_comps_design_attr_select_output_postseq">
    <PageDialog
      :dialogTitle="'选择后序位置'"
      :dialogVisiable="dialogVisible"
      dialogWidth="70%"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <el-form
          v-if="isApSource == '20'"
          :model="formData"
          ref="form"
          label-position="right"
          label-width="127px"
          class="edit_form"
        >
          <div class="form_info">
            <el-form-item label="输出服务名称:" prop="actionName">
              <el-select
                v-model="formData.actionId"
                placeholder="请选择输出服务"
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
          </div>
        </el-form>
        <Table
          ref="tableRef"
          class="table_style"
          :data="tableData"
          :table="tableColumn"
          :radioModel="currentRadio"
          @radioChange="radioChange"
        ></Table>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
      >
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import PageDialog from "@m/core/components/page_dialog";
import { mixList, reList } from "@m/utils/paramTree";

export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    currentObj: {
      type: Object,
      default: () => ({}),
    }
  },
  data() {
    return {
      tableData: [],
      tableColumn: [
        {
          prop: "actionId",
          width: "45",
          type: "radio",
          tooltip: false,
        },
        {
          prop: "actionSeq",
          label: "位置ID",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "actionName",
          label: "组件名称",
          minWidth: "20%",
          type: "text",
          tooltip: true,
        },
      ],
      dialogVisible: false,
      paramsDetail: {},
      currentParamsObj: {},
      isApSource: "",
      cpnList: [],
      formData: {
        actionId: "", // 输出服务id\
      },
      paramDataList: [],
      currentRadio: {},
      dataList: [],
    };
  },
  inject: ["getDataList"],
  methods: {
    async showDialog(data) {
      this.currentParamsObj = data
      this.dataList = this.getDataList()
      this.dataList.forEach(item => {
        const actionSeq = item.conf.find(e => e.name == "actionSeq")?.value
        if (actionSeq && item.actionId != this.currentObj.actionId ) {
          this.tableData.push({
            actionId: item.actionId,
            actionName: item.actionName,
            actionSeq,
          })
        }
      })
      this.tableData.sort((a, b) => {
        return a.actionSeq.slice(1) * 1 - b.actionSeq.slice(1) * 1;
      });
      this.dialogVisible = true
    },
    closeDialog() {
      this.formData.actionId = ""
      this.tableData = []
      this.dialogVisible = false
    },
    confirm() {
      this.$emit("setOutputTarget", "actionPostSeq", this.currentParamsObj, this.paramsDetail)
      this.closeDialog()
    },
    selectChange(e) {
      if(!e) return this.tableData = []
      console.log("selectChange", e)
      const target = this.cpnList.find(item => item.actionId == e)
      if (target.actionType == "dataDealAction") {
        this.getDataDealOutputParmas(target)
      } else {
        this.getServiceCpnDefaultParams(target)
      }
    },
    getDataDealOutputParmas(e) {
      console.log("getDataDealOutputParmas", e)
      this.tableData = e.paramList.filter((item) => item.paramDirection == "1")
    },
    async getServiceCpnDefaultParams(e) {
      console.log("getServiceCpnDefaultParams", e)
      const params = {
        d4StusCd: "1",
        blngtoTyp: "10",
        apiId: e.conf.find(item => item.name == "svcId").value,
        d4bApiId: this.currentServObj.apiId
      }
      const res = await this.rpc.transactionDesign.getServiceCpnDefaultParams(params)
      // this.inputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == "0"));
      this.tableData = res.paramList.filter((item) => item.paramDirection == "1")
    },
    selectionChange(e,row) {
      this.$refs.tableRef.clearSelection();
      this.$refs.tableRef.toggleRowSelection(row, true);
      this.paramsDetail = JSON.parse(JSON.stringify(row));
    },
    //多选显示
    tableCellStyle({ row, column, rowIndex, columnIndex }) {
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
            d = this.getParamParent(this.tableData, i);
            if(d[0]?.paramType == "List") {
              return { visibility: "hidden" };
            }
          }
        }
      }
    },
    getParamParent(arrs, id) {
      let d = [];
      for (let i = 0; i < arrs.length; i++) {
        if (arrs[i].paramOrder == id) {
          d = this.paramDataList.filter((data) => {
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
    radioChange (e) {
      console.log("radioChange", e)
      this.currentRadio = e.actionId
      this.paramsDetail = e
    },
    init() {
    }
  },
  created() {
    this.init()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_select_output_postseq {
  .edit_form {
    margin-top: 10px;
    @include form;
  }
  .table_style ::v-deep .el-table__header-wrapper .el-checkbox {
    display: none;
  }
}
</style>
