<template>
  <div class="aop_tradedesign_comps_design_attr_select_temp_params">
    <PageDialog
      :dialogTitle="isApSource == '10' ? '选择临时参数' : isApSource == '00' ? '选择交易输入参数' : '选择服务输出参数'"
      :dialogVisiable="tempParamsVisible"
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
          :table="tables"
          :data="dictionaryData"
          rowK="paramOrder"
          tableType="selection"
          :cellStyle="tableCellStyle"
          @tableSelectChange="selectionChange"
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
    dataList: {
      type: Array,
      default: () => [],
    },
    currentObj: {
      type: Object,
      default: () => ({}),
    }
  },
  data() {
    return {
      // 字典列表参数
      tables: [
        // {
        //   prop: "paramKey",
        //   width: "40",
        //   type: "radio",
        //   tooltip: false,
        //   show: function(scope) {
        //     return scope.row.paramType != "List" && scope.row.paramType != "Object"
        //   }
        // },
        {
          prop: "paramKey",
          label: "参数名称",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramCName",
          minWidth: "30%",
          label: "参数中文名称",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        // {
        //   prop: "dictryGategName",
        //   label: "所属分类",
        //   minWidth: "20%",
        //   type: "text",
        //   tooltip: true,
        // },
        {
          prop: "paramType",
          filter: "paraTyp",
          label: "参数类型",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
        {
          prop: "paramLength",
          label: "最大长度",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
      ],
      tempParamsVisible: false,
      paramsDetail: {},
      currentParamsObj: {},
      isApSource: "",
      cpnList: [],
      formData: {
        actionId: "", // 输出服务id\
      },
      tableData: [],
      paramDataList: []
    };
  },
  methods: {
    closeDialog() {
      this.formData.actionId = ""
      this.dictionaryData = []
      this.tempParamsVisible = false
    },
    initParams(data, params) {
      console.log(data, params);
      console.time("render耗时");
      this.currentParamsObj = params
      this.isApSource = params.apSource
      if(this.isApSource == "20") {
        this.$nextTick(() => {
          this.cpnList = this.dataList.filter(item => {
            return item.actionId != this.currentObj.actionId && ["D4bAction", "D5SelfAction", "D5LinkAction", "dataDealAction"].indexOf(item.actionType) > -1
          })
          this.tempParamsVisible = true
        })
      } else {
        this.paramDataList = data.puApiParams.filter(
          (item) => item.paramDirection === (params.apSource == "10" ? "3" : (params.apSource == "00" ? "0" : "1"))
        );
        this.dictionaryData = reList(this.paramDataList);
        this.tempParamsVisible = true
      }
      this.$nextTick(() => {
        console.timeEnd("render耗时");
      });
    },
    confirm() {
      this.$emit("setParaMapgNm", this.currentParamsObj, this.paramsDetail)
      this.closeDialog()
    },
    selectChange(e) {
      if(!e) return this.dictionaryData = []
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
      this.dictionaryData = e.paramList.filter((item) => item.paramDirection == "1")
    },
    async getServiceCpnDefaultParams(e) {
      console.log("getServiceCpnDefaultParams", e)
      const params = {
        d4StusCd: "1",
        blngtoTyp: "10",
        apiId: e.conf.find(item => item.name == "svcId").value,
        d4bApiId: this.currentServObj.apiId
      }
      const res = await this.rpc.d4.getServiceCpnDefaultParams(params)
      // this.inputParamsListAtSetting = reList(res.paramList.filter((item) => item.paramDirection == "0"));
      this.dictionaryData = res.paramList.filter((item) => item.paramDirection == "1")
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
            d = this.getParamParent(this.dictionaryData, i);
            if(d[0].paramType == "List") {
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
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_design_attr_select_temp_params {
  .edit_form {
    margin-top: 10px;
    @include form;
  }
  .table_style ::v-deep .el-table__header-wrapper .el-checkbox {
    display: none;
  }
}
</style>
