<template>
  <div class="aop_tradedesign_comps_d4_edit_biz_rule_inner_table">
    <div v-if="pageType == 'edit'" class="edit_container">
      <el-table
        border
        :data="tableData"
        class="two_dimensional_array"
        :cell-class-name="tableCellClassName"
        :key="tableKey"
        @header-click="headerClick"
        @header-contextmenu="headercontextmenu"
        @row-contextmenu="rowcontextmenu"
      >
        <el-table-column label="条件间关系" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row['条件间关系']"
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="item in condRelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column class-name="condition_column" align="center">
          <template slot="header">
            <div class="header">
              <span class="title">条件项</span>
              <span class="icon plus" @click="showDialog('addColumn')">+</span>
            </div>
          </template>

          <template v-for="item in subTableColumn">
            <el-table-column
              :key="item.prop"
              :prop="item.prop"
              :min-width="item.minWidth"
              align="center"
              class-name="condition_column"
              :label-class-name="!item.label ? 'clickText' : ''"
            >
              <template slot="header">
                <div class="header">
                  <span class="text">{{ item.label }}</span>
                  <span class="icon subtract" @click="deleteColumn(item)">
                    <span class="content"></span>
                  </span>
                </div>
              </template>
              <div slot-scope="scope">
                <el-input
                  :key="item.prop"
                  :ref="item.prop + 'Ref'"
                  v-model="scope.row[item.prop]"
                  autofocus
                  style="height: 100%"
                  size="small"
                  :placeholder="'请输入'"
                  @input="
                    handleInput(tableData, scope.$index, scope.row, item.prop)
                  "
                />
              </div>
            </el-table-column>
          </template>
        </el-table-column>
        <el-table-column label="动作" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row['动作']"
              autofocus
              style="height: 100%"
              size="small"
              :placeholder="'请输入'"
            />
          </template>
        </el-table-column>
        <el-table-column label="处理结果" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row['处理结果']"
              autofocus
              style="height: 100%"
              size="small"
              :placeholder="'请输入'"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="scope" class="operate_column">
            <span class="delete" @click="operate('deleteLine', scope.row)"
              >删除</span
            >
          </div>
        </el-table-column>
        <div class="empty" slot="empty">
          <div @click="addFirstRow">暂无数据，请点击添加行</div>
        </div>
      </el-table>
      <el-button
        class="add_line_btn"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="addLine"
        >增加一行</el-button
      >
    </div>
    <div v-else class="read_container">
      <el-table
        border
        :data="tableData"
        class="two_dimensional_array"
        :cell-class-name="tableCellClassName"
        :key="tableKey"
        @header-click="headerClick"
        @header-contextmenu="headercontextmenu"
        @row-contextmenu="rowcontextmenu"
      >
        <el-table-column label="条件间关系" align="center">
          <template slot-scope="scope">
            <span>{{scope.row['条件间关系']}}</span>
            <!-- <el-select
              v-model="scope.row['条件间关系']"
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="item in condRelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
          </template>
        </el-table-column>
        <el-table-column class-name="condition_column" align="center">
          <template slot="header">
            <div class="header">
              <span class="title">条件项</span>
              <!-- <span class="icon plus" @click="showDialog('addColumn')">+</span> -->
            </div>
          </template>

          <template v-for="item in subTableColumn">
            <el-table-column
              :key="item.prop"
              :prop="item.prop"
              :min-width="item.minWidth"
              align="center"
              class-name="condition_column"
              :label-class-name="!item.label ? 'clickText' : ''"
            >
              <template slot="header">
                <div class="header">
                  <span class="text">{{ item.label }}</span>
                  <!-- <span class="icon subtract" @click="deleteColumn(item)">
                    <span class="content"></span>
                  </span> -->
                </div>
              </template>
              <div slot-scope="scope">
                <span>{{scope.row[item.prop]}}</span>
                <!-- <el-input
                  :key="item.prop"
                  :ref="item.prop + 'Ref'"
                  v-model="scope.row[item.prop]"
                  autofocus
                  style="height: 100%"
                  size="small"
                  :placeholder="'请输入'"
                  @input="
                    handleInput(tableData, scope.$index, scope.row, item.prop)
                  "
                /> -->
              </div>
            </el-table-column>
          </template>
        </el-table-column>
        <el-table-column label="动作" align="center">
          <template slot-scope="scope">
            <span>{{scope.row['动作']}}</span>
            <!-- <el-input
              v-model="scope.row['动作']"
              autofocus
              style="height: 100%"
              size="small"
              :placeholder="'请输入'"
            /> -->
          </template>
        </el-table-column>
        <el-table-column label="处理结果" align="center">
          <template slot-scope="scope">
            <span>{{scope.row['处理结果']}}</span>
            <!-- <el-input
              v-model="scope.row['处理结果']"
              autofocus
              style="height: 100%"
              size="small"
              :placeholder="'请输入'"
            /> -->
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center">
          <div slot-scope="scope" class="operate_column">
            <span class="delete" @click="operate('deleteLine', scope.row)"
              >删除</span
            >
          </div>
        </el-table-column> -->
        <div class="empty" slot="empty">
          <div>暂无数据</div>
        </div>
      </el-table>
    </div>
    <!-- 选择表头字段 -->
    <SelectOutputField
      ref="selectOutputFieldRef"
      :currentServObj="currentServObj"
      @setOutputTarget="setOutputTarget"
      @addColumn="addColumn"
    ></SelectOutputField>

    <!-- <div
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
    </div> -->
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table";
import PageDialog from "@m/core/components/page_dialog";
import RightClickMenu from "./right_click_menu.vue";
import SelectOutputField from "./selectOutputField";
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
    dataSetInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tableData: [],
      tableColumn: [],
      showRightMenu: false,
      topNumber: 0,
      leftNumber: 0,
      currentRow: {},
      currentColumn: {},
      rightClickMenuType: "",
      ruleInfo: {},
      condRelOptions: [
        { label: "同时满足", value: "同时满足" },
        { label: "满足任意一项", value: "满足任意一项" },
      ],
      tableKey: ""
    };
  },
  computed: {
    subTableColumn() {
      return this.tableColumn.filter((item) => item.isSubColumn);
    },
  },
  methods: {
    setRuleInfo(ruleInfo) {
      console.log("setRuleInfo", ruleInfo)
      if (ruleInfo?.ruleDefnId) {
        this.ruleInfo = ruleInfo;
        if (ruleInfo.columnInfoList[0]?.lineInfoList?.length) {
          this.tableColumn = ruleInfo.columnInfoList.reduce((prev, column) => {
            const line0 = column.headerLineInfoList.find(
              (item) => item.lineSeqNo == 0
            );
            const line1 = column.headerLineInfoList.find(
              (item) => item.lineSeqNo == 1
            );
            if (line1?.val) {
              prev.push({
                clmnSeqNo: column.clmnSeqNo,
                label: line1.val,
                prop: line1.val,
                isSubColumn: line0.val != line1.val,
              });
            }
            return prev;
          }, []);
          let tableData = ruleInfo.columnInfoList[0]?.lineInfoList.map(
            (line) => ({})
          );
          ruleInfo.columnInfoList.forEach((column, index) => {
            column.lineInfoList.forEach((row, index) => {
              const label = this.tableColumn[column.clmnSeqNo]?.label;
              tableData[row.lineSeqNo][label] = row.val;
            });
          });
          this.tableData = tableData;
          this.setTableSeqNo();
        }
      } else {
        this.tableData = [];
        this.tableColumn = [
          { prop: "条件间关系", label: "条件间关系" },
          { prop: "动作", label: "动作" },
          { prop: "处理结果", label: "处理结果" },
        ];
      }
    },
    handleInput(data, index, row, name) {
      this.tableData = JSON.parse(JSON.stringify(data));
    },
    setOutputTarget(type, column, data) {
      console.log("setOutputcolumn", type, column, data);
      if (type == "column") {
        if (this.tableData.some((item) => data.dictNo in item)) {
          return this.$message.error("表格中已存在同名的列");
        }
        this.$set(this.tableColumn, column.index, {
          prop: data.dictNo,
          label: data.dictNm,
          clmnSeqNo: column.index,
        });
        if (!this.tableData.some((item) => column.property in item)) {
          // 新增一列时
          this.tableData = this.tableData.map((item) => {
            item[data.dictNo] = "";
            return item;
          });
        } else {
          // 修改某一列的表头时
          this.tableData = this.tableData.map((item) => {
            const val = item[column.property];
            delete item[column.property];
            item[data.dictNo] = val;
            return item;
          });
        }
      } else if (type == "actionPostSeq") {
        column.actionPostSeq = data.actionSeq;
      }
      // const index = this.outputTargetList.indexOf(column)
      // const row = this.outputTargetList[index]
      // row.paramKey =
    },
    // 设置二维表的行序号和列序号
    setTableSeqNo() {
      this.tableColumn = this.tableColumn.map((item, index) => {
        item.clmnSeqNo = index;
        return item;
      });
      this.tableData = this.tableData.map((item, index) => {
        item.lineSeqNo = index;
        return item;
      });
    },
    showDialog(type) {
      if (type == "addColumn") {
        this.$refs.selectOutputFieldRef.showDialog(this.dataSetInfo);
      }
    },
    addColumn(data) {
      console.log("addColumn", data);
      console.log(this.tableColumn,'111')
      if(this.subTableColumn.length &&this.subTableColumn.some((item) =>item.prop == data.dictNm && item.label == data.dictNm)){
        return this.$message.error("添加的条件项不能有重复")
      }
      const index = this.tableColumn.findIndex(
        (column) => column.label == "动作" && !column.isSubColumn
      );
      this.tableColumn.splice(index, 0, {
        prop: data.dictNm,
        label: data.dictNm,
        isSubColumn: true,
      });
      this.setTableSeqNo();

      // this.tableColumn.push({
      //   prop: data.dictNm,
      //   label: data.dictNm,
      //   isSubColumn: true,
      // });
      
      console.log(this.tableColumn,'2222')
      // this.$refs.selectOutputFieldRef.showDialog(column, this.currentServObj)
    },
    deleteColumn(data) {
      console.log("deleteColumn", data, this.tableColumn.indexOf(data));
      const index = this.tableColumn.indexOf(data);
      this.tableColumn.splice(index, 1);
    },
    addLine() {
      this.tableData.push({});
      console.log("addLine", this.tableColumn);
    },
    handleClick(data) {
      console.log("handleClick", data, this.currentRow, this.currentColumn);
      if (data.name == "向左插入列") {
        this.tableColumn.splice(this.currentColumn.index, 0, {
          prop: "",
          label: "",
        });
      } else if (data.name == "向右插入列") {
        this.tableColumn.splice(this.currentColumn.index + 1, 0, {
          prop: "",
          label: "",
        });
      } else if (data.name == "删除选中列") {
        this.tableColumn.splice(this.currentColumn.index, 1);
      } else if (data.name == "向左移动列") {
        const index = this.currentColumn.index;
        const left = this.tableColumn[index - 1];
        const right = this.tableColumn[index];
        this.tableColumn[index] = left;
        this.tableColumn[index - 1] = right;
        const tableColumn = JSON.parse(JSON.stringify(this.tableColumn));
        this.tableColumn = [];
        this.$nextTick(() => {
          this.tableColumn = JSON.parse(JSON.stringify(tableColumn));
        });
      } else if (data.name == "向右移动列") {
        const index = this.currentColumn.index;
        const left = this.tableColumn[index + 1];
        const right = this.tableColumn[index];
        this.tableColumn[index] = left;
        this.tableColumn[index + 1] = right;
        const tableColumn = JSON.parse(JSON.stringify(this.tableColumn));
        this.tableColumn = [];
        this.$nextTick(() => {
          this.tableColumn = JSON.parse(JSON.stringify(tableColumn));
        });
      } else if (data.name == "向上插入行") {
        this.tableData.splice(this.currentRow.index, 0, {});
      } else if (data.name == "向下插入行") {
        this.tableData.splice(this.currentRow.index + 1, 0, {});
      } else if (data.name == "删除选中行") {
        this.tableData.splice(this.currentRow.index, 1);
      } else if (data.name == "向上移动行") {
        const index = this.currentRow.index;
        const up = this.tableData[index - 1];
        const down = this.tableData[index];
        this.tableData[index] = up;
        this.tableData[index - 1] = down;
        const tableData = JSON.parse(JSON.stringify(this.tableData));
        this.tableData = [];
        this.$nextTick(() => {
          this.tableData = JSON.parse(JSON.stringify(tableData));
        });
      } else if (data.name == "向下移动行") {
        const index = this.currentRow.index;
        const up = this.tableData[index];
        const down = this.tableData[index + 1];
        this.tableData[index + 1] = up;
        this.tableData[index] = down;
        const tableData = JSON.parse(JSON.stringify(this.tableData));
        this.tableData = [];
        this.$nextTick(() => {
          this.tableData = JSON.parse(JSON.stringify(tableData));
        });
      }
      this.setTableSeqNo();
      this.showRightMenu = false;
    },
    rightClickMenuMouseLeave() {
      this.showRightMenu = false;
    },
    // 添加首行
    addFirstRow() {
      this.tableData.push({});
      this.setTableSeqNo();
    },
    async addBusinessRule(data) {
      this.setTableSeqNo();
      const params = {
        apiId: this.currentServObj.svcId ||this.currentServObj.apiId,
        ruleNm: this.currentServObj.svcNm ||this.currentServObj.apiName,
        ruleComnt: this.ruleComnt,
        columnInfoList: this.transferColumnInfoListFormat(
          this.tableColumn,
          this.tableData
        ),
      };
      await this.rpc.d4.addBusinessRule(params);
      this.$notify({
        title: "成功",
        message: "编辑成功",
        duration: 2000,
        type: "success",
      });
    },
    async editBusinessRule(data) {
      console.log("editBusinessRule", this.tableColumn, this.tableData);
      // this.setTableSeqNo();
      // const params = {
      //   ruleDefnId: data.ruleDefnId,
      //   ruleNm: data.ruleNm,
      //   ruleComnt: this.ruleComnt,
      //   columnInfoList: this.transferColumnInfoListFormat(
      //     this.tableColumn,
      //     this.tableData
      //   ),
      // };
      // await this.rpc.d4.editBusinessRule(params);
      // this.$notify({
      //   title: "成功",
      //   message: "保存成功",
      //   duration: 2000,
      //   type: "success",
      // });

      this.setTableSeqNo();
      const params = {
        ruleDefnId: data.ruleDefnId,
        ruleNm: data.ruleNm,
        ruleComnt: this.ruleComnt,
        columnInfoList: this.transferColumnInfoListFormat(
          this.tableColumn,
          this.tableData
        ),
      };
      console.log("params", params);
      await this.rpc.d4.editBusinessRule(params);
      this.$notify({
        title: "成功",
        message: "保存成功",
        duration: 2000,
        type: "success",
      });
    },
    transferColumnInfoListFormat(tablecolumn, tableData) {
      this.setTableSeqNo();
      return tablecolumn.map((item) => {
        const headerLineInfoList = [
          { val: item.isSubColumn ? "条件项" : item.label, lineSeqNo: "0" },
          { val: item.label, lineSeqNo: "1" },
        ];
        return {
          clmnSeqNo: item.clmnSeqNo,
          clmnCd: item.prop,
          clmnNm: item.label,
          headerLineInfoList: headerLineInfoList,
          lineInfoList: tableData.map((data) => {
            return {
              lineSeqNo: data.lineSeqNo,
              val: data[item.prop],
            };
          }),
        };
      });
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 添加表头，修改表头
    headerClick(column, event) {
      console.log("headerClick", column, event);
      if (this.pageType == "read") return;
      this.currentColumn = column
      this.tableKey = +new Date()
      // this.$refs.selectOutputFieldRef.showDialog(column, this.currentServObj)
    },
    headercontextmenu(column, event) {
      if (this.pageType == "read") return;
      event.preventDefault(); // 隐藏浏览器默认右击菜单
      this.showRightMenu = true;
      this.topNumber = event.pageY;
      this.leftNumber = event.pageX;
      this.currentColumn = column;
      this.rightClickMenuType = "column";
    },
    rowcontextmenu(row, column, event) {
      console.log("rowcontextmenu", row, column, event);
      if (this.pageType == "read") return;
      event.preventDefault(); // 隐藏浏览器默认右击菜单
      this.showRightMenu = true;
      this.topNumber = event.pageY;
      this.leftNumber = event.pageX;
      this.currentRow = row;
      this.currentColumn = column;
      this.rightClickMenuType = "row";
      return;
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex;
      column.index = columnIndex;
    },
    operate(operation, data) {
      console.log("operate", operation, data);
      if (operation == "deleteLine") {
        const index = this.tableData.indexOf(data);
        this.tableData.splice(index, 1);
      }
    },
    getCheckData(){
      console.log(this.subTableColumn,this.tableData,"334555")
      if(!this.tableColumn.some((item) => item.isSubColumn == true)) return this.$message.error("业务规则不能为空") && false
      if(!this.tableData.length > 0) return this.$message.error("业务规则条件项不能为空") && false
      return true
    }
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
  ::v-deep .el-table thead tr th {
    background-color: $table_bg_color;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
  }
  ::v-deep .el-table__cell {
    padding: 9.5px 0;
    &.condition_column {
      padding: 4px 0;
    }
  }
  .edit_container {
    .add_line_btn {
      margin-top: 8px;
    }
    .empty {
      cursor: pointer;
    }
  }
  .two_dimensional_array {
    width: 100%;
    ::v-deep .el-table__row {
      height: 40px;
    }
    .condition_column {
      height: 32px !important;
      .header {
        display: flex;
        justify-content: center;
        align-items: center;
        &.active {
          background: rgba($color: $theme_color, $alpha: 0.1);
        }
      }
      .text {
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
      }
      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 4px;
        width: 16px;
        height: 16px;
        font-size: 16px;
        font-weight: lighter;
        color: #fff;
        cursor: pointer;
        &.plus {
          border-radius: 3px;
          background: $theme_color;
        }
        &.subtract {
          border-radius: 8px;
          background: #fe4758;
          .content {
            display: inline-block;
            width: 10px;
            height: 2px;
            background: #fff;
            transform: scale(0.9);
          }
        }
      }
    }
    .operate_column {
      .delete {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #fe4758;
        letter-spacing: 0;
        cursor: pointer;
      }
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