<template>
  <div class="aop_tradecode_comps_design_attr_set_cache_action_select_params">
    <PageDialog
      :dialogTitle="'选择参数'"
      :dialogVisiable="dialogVisible"
      dialogWidth="70%"
      @closeDialog="closeDialog"
    >
      <div slot="box" class="container">
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
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import PageDialog from "@m/core/components/page_dialog";
import { mixList, reList, packageParamKey, getParamParent } from "@m/utils/paramTree";

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
        // {
        //   prop: "paramKey",
        //   width: "45",
        //   type: "radio",
        //   tooltip: false,
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
      dialogVisible: false,
      paramsDetail: {},
      currentRow: {},
      isApSource: "",
      formData: {
        actionId: "", // 字段来源对应的4B交易ID或L5服务的组件ID
      },
      tableData: [],
      paramDataList: [],
      dictionaryData: [],
      currentRadio: "",
      compositeIdMapToParamList: {},
      // 已选中数据
      selectedTable: [],
      innerFlowDataList: [],
      currentKey: ""
    };
  },
  computed: {
    options() {
      return this.getDataList().reduce((prev, data) => {
        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(data.actionType) && data.compositeId) {
          prev.push({
            label: data.actionName,
            svcId: data.actionOwnId,
            value: data.compositeId,
            actionSeq: data.conf.find(item => item.name == "actionSeq")?.value
          })
        }
        return prev
      }, [])
    }
  },
  inject: ["getDataList"],
  methods: {
    //多选显示
    tableCellStyle({ row, column, rowIndex, columnIndex }) {
      // const topParamParent = getParamParent(row, this.dictionaryData)
      // const paramList = this.compositeIdMapToParamList[this.formData.actionId]?.paramList || []
      // const paramList = mixList(JSON.parse(JSON.stringify(this.dictionaryData)), "children") || []
      if(column.type === "selection") {
        // const _parentParam = paramList.find(item => item.paramOrder == row.paramParentId)
        // console.log(_parentParam, row, 'ppppppp')
        if ((["List", "Object"].includes(row?.paramType))) {
          return { visibility: "hidden" };
        }
      }
    },
    async showDialog(data) {
      this.dialogVisible = true;
      this.dictionaryData = JSON.parse(JSON.stringify(data));
      const paramList = mixList(this.dictionaryData)
      this.initParamMapping(this.dictionaryData, paramList)
    },
    initParamMapping(data, paramList) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        item.paramMappingKey = packageParamKey(item, paramList)
        console.log(item.paramMappingKey, "mapp")
        if (item.children && item.children.length) {
          this.initParamMapping(item.children, paramList)
        }
      }
    },
    selectionChange(e, row) {
      this.$refs.tableRef.clearSelection();
      this.$refs.tableRef.toggleRowSelection(row, true);
      // this.selectedTable = row
      this.selectedTable = [row]
    },
    setParamListSource(selectedTable, paramList, actionId, actionName, apSource = "20") {
      selectedTable.forEach(param => {
        param.paramValue = packageParamKey(param, paramList)
        param.apSource = apSource
        if (param?.children?.length) {
          this.setParamListSource(param.children, paramList)
        }
      })
    },
    confirm() {
      this.$emit("confirm", this.selectedTable)
      this.closeDialog()
    },
    closeDialog() {
      this.dictionaryData = []
      this.dialogVisible = false
    },
  },
  created() {
    // this.init()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_attr_set_cache_action_select_params {
  .container {
    padding: 16px;
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
