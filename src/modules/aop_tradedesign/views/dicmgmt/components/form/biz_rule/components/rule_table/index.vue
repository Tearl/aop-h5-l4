<template>
  <div class="aop_tradedesign_comps_d4_edit_biz_rule_inner_table">
    <div class="edit_container">
      <el-table
        border
        :data="tableData"
        class="two_dimensional_array"
        :key="isUpdate"
        :cell-class-name="tableCellClassName"
        @header-click="headerClick"
        @header-contextmenu="headercontextmenu"
        @row-contextmenu="rowcontextmenu"
      >
        <template v-for="item in tableColumn">
          <el-table-column
            :key="item.prop"
            :label="item.label || '选择'"
            :prop="item.prop"
            :min-width="item.minWidth"
            align="center"
            :label-class-name="!item.label ? 'clickText' : ''"
          >
            <div v-if="pageType == 'edit'" slot-scope="scope">
              <el-input
                :key="item.prop"
                :ref="item.prop+'Ref'"
                :disabled="scope.column.label == '选择'"
                v-model="scope.row[item.prop]"
                autofocus
                style="height: 100%"
                :placeholder="scope.column.label == '选择' ? '请设置表头' : '请输入'"
                @input="handleInput(tableData, scope.$index, scope.row, item.prop)"
              />
            </div>
            <div v-else slot-scope="scope">
              <div>{{ scope.row[item.prop] }}</div>
            </div>
          </el-table-column>
        </template>
        <div slot="empty">
          <div @click="addFirstRow">暂无数据，请点击添加行</div>
        </div>
      </el-table>
    </div>
    <!-- 选择表头字段 -->
    <SelectOutputField
      ref="selectOutputFieldRef"
      :currentServObj="currentServObj"
      @setOutputTarget="setOutputTarget"
    ></SelectOutputField>

    <div
      v-if="showRightMenu"
      class="right-menu border-radius-little box-shadow"
      :style="{ top: topNumber + 'px', left: leftNumber + 'px' }"
      @mouseleave="rightClickMenuMouseLeave"
    >
      <RightClickMenu
        @handleClick="handleClick"
        :rightClickMenuType="rightClickMenuType"
        :tableData="tableData"
        :tableColumn="tableColumn"
        :currentColumn="currentColumn"
        :currentRow="currentRow"
      ></RightClickMenu>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table";
import PageDialog from "@m/core/components/page_dialog";
import RightClickMenu from './right_click_menu.vue'
import SelectOutputField from "./selectOutputField"
import filters from "@m/utils/filters";

export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    RightClickMenu,
    SelectOutputField,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: () => false,
    },
    data: {
      type: Array,
      default: () => [],
    },
    table: {
      type: Array,
      default: () => [],
    },
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    pageType: {
      type: String,
      default: () => "edit",
    },
    ruleComnt: {
      type: String,
      default: () => "",
    },
    dataObj: {
      type: Object,
      default: () => ({}),
    },
    apiId: {
      type: String,
      default: () => false,
    },
  },
  data() {
    return {
      tableData: [{}],
      tableColumn: [
        { prop: "", label: "" },
      ],
      showRightMenu: false,
      topNumber: 0,
      leftNumber: 0,
      currentRow: {},
      currentColumn: {},
      rightClickMenuType: "",
      ruleInfo: {},
      isUpdate: false,
      tempRef: ""
    };
  },
  computed: {},
  watch: {
    isUpdate() {
      this.$nextTick(()=> {
        this.$refs[this.tempRef][0].focus()
      })
    }
  },
  methods: {
    setRuleInfo(ruleInfo) {
      this.ruleInfo = ruleInfo
      if (ruleInfo.columnInfoList[0]?.lineInfoList?.length) {
        let tableData = []
        for (let i = 0; i < ruleInfo.columnInfoList[0]?.lineInfoList?.length; i++) {
          tableData.push({})
        }
        ruleInfo.columnInfoList.forEach((column, index) => {
          column.lineInfoList.forEach((row, index) => {
            tableData[row.lineSeqNo][column.clmnCd] = row.val
          })
        })
        this.tableColumn = ruleInfo.columnInfoList.map(item => {
          return {
            clmnSeqNo: item.clmnSeqNo,
            label: item.clmnNm,
            prop: item.clmnCd,
          }
        })
        this.tableData = tableData
        this.setTableSeqNo()
      }
    },
    handleInput(data, index, row, name) {
      this.$set(data, index, row)
      this.isUpdate = !this.isUpdate
      this.tempRef = name + "Ref"
    },
    setOutputTarget(type, column, data) {
      console.log("setOutputcolumn", type, column, data)
      if (type == "column") {
        if (this.tableData.some(item => data.dictNo in item)) {
          return this.$message.error("表格中已存在同名的列")
        }
        this.$set(this.tableColumn, column.index, { prop: data.dictNo, label: data.dictNm,clmnSeqNo: column.index })
        if (!this.tableData.some(item => column.property in item)) {
          // 新增一列时
          this.tableData = this.tableData.map(item => {
            item[data.dictNo] = ""
            return item
          })
        } else {
          // 修改某一列的表头时
          this.tableData = this.tableData.map(item => {
            const val = item[column.property]
            delete item[column.property]
            item[data.dictNo] = val
            return item
          })
        }
      } else if (type == "actionPostSeq") {
        column.actionPostSeq = data.actionSeq
      }
      // const index = this.outputTargetList.indexOf(column)
      // const row = this.outputTargetList[index]
      // row.paramKey = 
    },
    // 设置二维表的行序号和列序号
    setTableSeqNo() {
      this.tableColumn = this.tableColumn.map((item, index) => {
        item.clmnSeqNo = index
        return item
      })
      this.tableData = this.tableData.map((item, index) => {
        item.lineSeqNo = index
        return item
      })
    },
    handleClick(data) {
      console.log("handleClick", data, this.currentRow, this.currentColumn)
      if (data.name == "向左插入列") {
        this.tableColumn.splice(this.currentColumn.index, 0, { prop: "", label: "" })
      } else if (data.name == "向右插入列") {
        this.tableColumn.splice(this.currentColumn.index + 1, 0, { prop: "", label: "" })
      } else if (data.name == "删除选中列") {
        this.tableColumn.splice(this.currentColumn.index, 1)
      } else if (data.name == "向左移动列") {
        const index = this.currentColumn.index
        const left = this.tableColumn[index - 1]
        const right = this.tableColumn[index]
        this.tableColumn[index] = left
        this.tableColumn[index - 1] = right
        const tableColumn = JSON.parse(JSON.stringify(this.tableColumn))
        this.tableColumn = []
        this.$nextTick(() => {
          this.tableColumn = JSON.parse(JSON.stringify(tableColumn))
        })
      } else if (data.name == "向右移动列") {
        const index = this.currentColumn.index
        const left = this.tableColumn[index + 1]
        const right = this.tableColumn[index]
        this.tableColumn[index] = left
        this.tableColumn[index + 1] = right
        const tableColumn = JSON.parse(JSON.stringify(this.tableColumn))
        this.tableColumn = []
        this.$nextTick(() => {
          this.tableColumn = JSON.parse(JSON.stringify(tableColumn))
        })
      } else if (data.name == "向上插入行") {
        this.tableData.splice(this.currentRow.index, 0, {})
      } else if (data.name == "向下插入行") {
        this.tableData.splice(this.currentRow.index + 1, 0, {})
      } else if (data.name == "删除选中行") {
        this.tableData.splice(this.currentRow.index, 1)
      } else if (data.name == "向上移动行") {
        const index = this.currentRow.index
        const up = this.tableData[index - 1]
        const down = this.tableData[index]
        this.tableData[index] = up
        this.tableData[index - 1] = down
        const tableData = JSON.parse(JSON.stringify(this.tableData))
        this.tableData = []
        this.$nextTick(() => {
          this.tableData = JSON.parse(JSON.stringify(tableData))
        })
      } else if (data.name == "向下移动行") {
        const index = this.currentRow.index
        const up = this.tableData[index]
        const down = this.tableData[index + 1]
        this.tableData[index + 1] = up
        this.tableData[index] = down
        const tableData = JSON.parse(JSON.stringify(this.tableData))
        this.tableData = []
        this.$nextTick(() => {
          this.tableData = JSON.parse(JSON.stringify(tableData))
        })
      }
      this.setTableSeqNo()
      this.showRightMenu = false
    },
    rightClickMenuMouseLeave() {
      this.showRightMenu = false
    },
    // 添加首行
    addFirstRow() {
      this.tableData.push({})
      this.setTableSeqNo()
    },
    async addBusinessRule(data) {
      this.setTableSeqNo()
      const params = {
        apiId: this.apiId,
        ruleNm: this.currentServObj.svcNm,
        ruleComnt: this.ruleComnt,
        columnInfoList: this.transferColumnInfoListFormat(this.tableColumn, this.tableData)
      };
      await this.rpc.dicmgmt.addBusinessRule(params);
      // this.$notify({
      //   title: "成功",
      //   message: "保存成功",
      //   duration: 2000,
      //   type: "success",
      // });
    },
    async editBusinessRule(data) {
      this.setTableSeqNo()
      const params = {
        ruleDefnId: data.ruleDefnId,
        ruleNm: data.ruleNm,
        ruleComnt: this.ruleComnt,
        columnInfoList: this.transferColumnInfoListFormat(this.tableColumn, this.tableData)
      };
      await this.rpc.dicmgmt.editBusinessRule(params);
      // this.$notify({
      //   title: "成功",
      //   message: "保存成功",
      //   duration: 2000,
      //   type: "success",
      // });
    },
    transferColumnInfoListFormat(column, data) {
      return column.map(item => {
        return {
          clmnSeqNo: item.clmnSeqNo,
          clmnCd: item.prop,
          clmnNm: item.label,
          lineInfoList: data.map(data => {
            return {
              lineSeqNo: data.lineSeqNo,
              val: data[item.prop],
            }
          })
        }
      })
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 添加表头，修改表头
    headerClick(data) {
      if (this.pageType == "read") return
      this.$refs.selectOutputFieldRef.showDialog(data,this.dataObj)
    },
    headercontextmenu(column, event) {
      if (this.pageType == "read") return
      event.preventDefault(); // 隐藏浏览器默认右击菜单
      this.showRightMenu = true
      this.topNumber = event.pageY
      this.leftNumber = event.pageX
      this.currentColumn = column
      this.rightClickMenuType = "column"
    },
    rowcontextmenu(row, column, event) {
      if (this.pageType == "read") return
      event.preventDefault(); // 隐藏浏览器默认右击菜单
      this.showRightMenu = true
      this.topNumber = event.pageY
      this.leftNumber = event.pageX
      this.currentRow = row
      this.currentColumn = column
      this.rightClickMenuType = "row"
      return
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex;
      column.index = columnIndex;
    },
  },
  created() {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4_edit_biz_rule_inner_table {
  .two_dimensional_array {
    width: calc(100% - 120px);
    margin-left: 120px;
    ::v-deep .el-table__row {
      height: 40px;
    }
  }
  .right-menu {
    width: 130px;
    position: fixed;
    z-index: 1000;
    background-color: white;
  }
}
</style>