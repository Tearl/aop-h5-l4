<template>
  <div class="aop_tradedesign_dic_cmps_data_set_form_two_dimensional_table">
    <Menu
      @menyItemCmd="menyItemCmd"
      :handleType="handleType"
    />
    <el-table
      border
      :data="tableData"
      :cell-style="tableCellStyle"
      :header-cell-style="tableHeaderCellStyle"
      :cell-class-name="className"
      @cell-click="handleClickColumn"
      @header-click="handleHeaderClick"
      @cell-dblclick="handleDoubleClickColumn"
    >
      <el-table-column
        v-for="(item, index) in tablecolumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      >
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import Menu from "./menu";
export default {
  data() {
    return {
      tableData: [{}, {}],
      tablecolumn: [
        {
          prop: "",
          label: "",
        },
        {
          prop: "",
          label: "",
        },
        {
          prop: "",
          label: "",
        },
      ],
      // 内容行列
      contentRow: "",
      contentColumn: "",
      // 表头行列位置
      headerRow: "",
      headerColumn: "",
      handleType: "",
      // 当前选中的行列
      currentRow: "",
      currentColumn: "",
    };
  },
  components: {
    Menu,
  },
  created() {},
  computed: {},
  methods: {
    className({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex;
      column.index = columnIndex;
    },
    // 单击表格内单元格
    handleClickColumn(row, column, cell, event) {
      console.log("单元格单击", row, column, cell, event, this.handleType);
      this.handleType = "content";
      this.contentRow = row;
      this.contentColumn = column;
      this.headerRow = "";
      this.headerColumn = "";
    },
    // 设置单元格样式
    tableCellStyle(row, rowIndex, column) {
      if (this.contentRow === row.row && this.contentColumn === row.column) {
        return "background-color:#f2f8ff;color:#358aff";
      } else {
        return "background-color:#fff;";
      }
    },
    // 双击单元格
    handleDoubleClickColumn(row, column, cell, event) {
      console.log("双击");
    },
    // 单击表头
    handleHeaderClick(column, event) {
      console.log("表头单击", column, event);
      this.handleType = "header";
      this.contentRow = "";
      this.contentColumn = "";
      this.headerRow = "";
      this.headerColumn = column;
      this.currentColumn = column.index;
      this.currentRow = row.index;
    },
    // 设置表头样式
    tableHeaderCellStyle(row, column, rowIndex, columnIndex) {
      if (this.headerColumn === row.column) {
        return "background-color:#f2f8ff;color:#358aff";
      } else {
        return "background-color:#fafafc;color:#333";
      }
    },

    // 行操作
    handleRow(type) {
      console.log("addRow", type, this.currentRow, this.tableData.length);
      if (type == "addDown") {
        this.tableData.splice(this.currentRow + 1, 0, {});
      } else if (type == "addUp") {
        this.tableData.splice(this.currentRow, 0, {});
        this.currentRow++;
      } else if (type == "del") {
        this.tableData.splice(this.currentRow, 1);
      } else if (type == "moveUp") {
        if (this.currentRow > 0) {
          let arr = this.tableData[this.currentRow];
          let arr1 = this.tableData[this.currentRow - 1];
          let data = [arr, arr1];
          this.tableData.splice(this.currentRow - 1, 2, ...data);
          this.currentRow--;
        }
      } else if (type == "moveDown") {
        if (this.currentRow < this.tableData.length - 1) {
          let arr = this.tableData[this.currentRow];
          let arr1 = this.tableData[this.currentRow + 1];
          let data = [arr1, arr];
          this.tableData.splice(this.currentRow, 2, ...data);
          this.currentRow++;
        }
      }
    },
    // 列操作
    handleCol(type) {
      console.log("addRow", type, this.currentColumn, this.tablecolumn.length);
      if (type == "addRight") {
        this.tablecolumn.splice(this.currentColumn + 1, 0, {});
      } else if (type == "addLeft") {
        this.tablecolumn.splice(this.currentColumn, 0, {});
        this.currentColumn++;
      } else if (type == "del") {
        this.tablecolumn.splice(this.currentColumn, 1);
      } else if (type == "moveLeft") {
        if (this.currentColumn > 0) {
          let arr = this.tablecolumn[this.currentColumn];
          let arr1 = this.tablecolumn[this.currentColumn - 1];
          let data = [arr, arr1];
          this.tablecolumn.splice(this.currentColumn - 1, 2, ...data);
          this.currentColumn--;
        }
      } else if (type == "moveRight") {
        if (this.currentColumn < this.tablecolumn.length - 1) {
          let arr = this.tablecolumn[this.currentColumn];
          let arr1 = this.tablecolumn[this.currentColumn + 1];
          let data = [arr1, arr];
          this.tablecolumn.splice(this.currentColumn, 2, ...data);
          this.currentColumn++;
        }
      }
    },
    // 点击操作按钮
    menyItemCmd(type) {
      switch (type) {
        // 行操作
        case "addDownRow":
          this.handleRow("addDown");
          break;
        case "addUpRow":
          this.handleRow("addUp");
          break;
        case "delCurrentRow":
          this.handleRow("del");
          break;
        case "moveUpRow":
          this.handleRow("moveUp");
          break;
        case "moveDownRow":
          this.handleRow("moveDown");
          break;
        // 列操作
        case "addLefttCol":
          this.handleCol("addLeft");
          break;
        case "addRightCol":
          this.handleCol("addRight");
          break;
        case "delCurrentCol":
          this.handleCol("del");
          break;
        case "moveRightCol":
          this.handleCol("moveRight");
          break;
        case "moveLeftCol":
          this.handleCol("moveLeft");
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_cmps_data_set_form_two_dimensional_table {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently*/

  ::v-deep .el-table th {
    background: $base_bg_color;
    color: $reg_ft_color;
  }
}
</style>