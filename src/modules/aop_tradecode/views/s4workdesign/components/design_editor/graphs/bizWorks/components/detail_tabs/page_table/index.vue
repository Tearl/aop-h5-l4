<template>
  <div class="aop_base_comps_page_table">
    <el-table
      ref="tableRef"
      v-loading="tableLoading"
      style="width: 100%"
      :height="height"
      :class="comsClass"
      :data="data"
      :tree-props="treeProps"
      :cell-style="cellStyle"
      :row-key="getRow"
      @select="select"
      @select-all="selectAll"
      @selection-change="selectionChange"
    >
      <el-table-column
        :label="tableType == 'index' ? '序号' : ''"
        :reserve-selection="true"
        :type="tableType"
        width="55"
        align="center"
        v-if="tableType"
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in table"
        :key="index"
        :prop="item.prop"
        :width="item.width"
        :min-width="item.minWidth || item.width || item.label.length * 20"
        :label="item.label"
        :fixed="item.type == 'button' ? 'right' : null"
        :align="item.align || 'left'"
      >
        <template
          slot-scope="scope"
          v-if="item.templateIf ? item.templateIf(scope) : true"
        >
          <div v-if="!item.tooltip">
            <el-select
              v-model="scope.row[item.prop]"
              clearable
              v-if="item.type == 'select'"
              :placeholder="item.placeholder ? item.placeholder : item.label"
              @change="selectChange(scope.row)"
              :size="item.size ? item.size : 'small'"
              :style="item.inputStyle"
            >
              <el-option
                v-for="i in item.selectVal"
                :key="i.value"
                :label="i.type"
                :value="i.value"
                :disabled="i.disabled && i.disabled(scope, table)"
              ></el-option>
            </el-select>
            <el-input
              :style="item.inputStyle"
              v-model="scope.row[item.prop]"
              :placeholder="item.placeholder"
              clearable
              @input="(e) => item.input && item.input(e, scope)"
              :disabled="item.disabled && item.disabled(scope, table)"
              v-else-if="item.type == 'input'"
              :size="item.size ? item.size : 'small'"
            ></el-input>
            <div v-else-if="item.type == 'inputBtn'">
              <el-input
                v-if="item.inputBtn && item.inputBtn(scope)"
                :style="item.inputStyle"
                v-model="scope.row[item.prop]"
                :placeholder="item.placeholder"
                clearable
                @input="(e) => item.input && item.input(e, scope)"
                :disabled="item.disabled && item.disabled(scope, table)"
                :size="item.size ? item.size : 'small'"
              ></el-input>
              <div
                v-else
                @click="operate(item.btnItem.operate, scope.row, scope.$index)"
              >
                <img
                  v-if="item.btnItem.icon"
                  class="icon"
                  :style="
                    item.btnItem.stylefun ? item.btnItem.stylefun(scope) : ''
                  "
                  :src="item.btnItem.icon"
                />
                <span
                  v-else
                  :class="
                    item.btnItem.desc == '删除' || item.btnItem.desc == '作废'
                      ? 'btn_delete'
                      : ''
                  "
                  >{{ item.btnItem.desc }}</span
                >
              </div>
            </div>
            <el-radio
              v-else-if="item.type == 'radio' && item.show"
              v-model="radioModel"
              :label="scope.row[item.prop]"
              @change="(e) => radioChange(e, scope.row)"
              ><span></span
            ></el-radio>
            <el-checkbox
              v-else-if="item.type == 'checkbox'"
              v-model="scope.row[item.prop]"
              :size="item.size ? item.size : 'small'"
              :true-label="'0'"
              :false-label="'1'"
            ></el-checkbox>
            <span v-else-if="item.type == 'enum'" :class="item.textClass">
              {{ item.enumObj[scope.row[item.prop]] }}
            </span>
            <span v-else-if="item.type == 'text'" :class="item.textClass">
              {{ getFilters(scope, item) }}
            </span>
            <span
              v-else-if="item.type == 'html'"
              :class="item.textClass"
              v-html="getFilters(scope, item)"
            >
            </span>
            <span v-else-if="item.type == 'textClassList'">
              <span
                v-for="(classItem, classIndex) in item.textClassList"
                :key="classIndex"
                v-show="scope.row[item.prop] == classItem.val"
                :class="classItem.class"
              >
                {{ getFilters(scope, item) }}
              </span>
            </span>
            <span
              v-else-if="item.type == 'textClick'"
              :class="item.textClass ? item.textClass : 'text_style'"
              @click="operate(item.operate, scope.row, scope.$index)"
            >
              {{ getFilters(scope, item) }}
            </span>
            <span
              v-else-if="item.type == 'textStyle'"
              :class="item.textStyle ? item.textStyle : 'text_style_blue'"
            >
              {{ getFilters(scope, item) }}
            </span>
            <el-rate
              v-else-if="item.type == 'rate'"
              v-model="scope.row[item.prop]"
              disabled
            ></el-rate>
            <el-switch
              v-else-if="item.type == 'switch'"
              v-model="scope.row[item.prop]"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="switchChange(scope.row)"
            ></el-switch>
            <div v-else-if="item.type == 'button'" class="table_btn_box">
              <div
                v-for="(btnItem, i) in item.buttonList"
                :key="i"
                v-if="btnItem.relation ? btnItem.relation(scope, table) : true"
                :class="btnItem.icon ? 'table_button' : 'table_border'"
              >
                <div @click="operate(btnItem.operate, scope.row, scope.$index)">
                  <img
                    v-if="btnItem.icon"
                    class="icon"
                    :style="btnItem.stylefun ? btnItem.stylefun(scope) : ''"
                    :src="btnItem.icon"
                  />
                  <span
                    v-else
                    :class="
                      btnItem.desc == '删除' || btnItem.desc == '作废'
                        ? 'btn_delete'
                        : ''
                    "
                    >{{ btnItem.desc }}</span
                  >
                </div>
              </div>
              <el-dropdown
                v-if="item.dropdownBtn ? item.dropdownBtn(scope) : false"
                trigger="click"
                @command="command"
              >
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(dropItem, indexs) in item.dropdownList"
                    :key="indexs"
                    :command="[dropItem.operate, scope.row]"
                  >
                    <span
                      v-if="
                        dropItem.relation
                          ? dropItem.relation(scope, table)
                          : true
                      "
                      >{{ dropItem.desc }}</span
                    >
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <el-tooltip
            v-else
            :enterable="false"
            placement="top-start"
            :content="getFilters(scope, item)"
          >
            <span class="table_text">
              {{ getFilters(scope, item) }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import filters from "./filters";
export default {
  props: {
    table: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    rowK: {
      type: String,
      default: () => "",
    },
    tableType: {
      type: String,
      default: () => "",
    },
    rowKey: {
      type: Array,
      default: () => [],
    },
    // 类名样式
    comsClass: {
      type: String,
      default: () => "",
    },
    tableLoading: {
      type: Boolean,
      default: () => false,
    },
    treeProps: {
      type: Object,
      default: () => ({ children: "children" }),
    },
    cellStyle: {
      type: Object,
      default: () => ({}),
    },
    radioModel: {
      type: String,
      default: () => "",
    },
    height: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {};
  },
  methods: {
    operate(operation, data, index) {
      this.$emit("operate", operation, data, index, this.data);
    },
    command(e) {
      this.$emit("operate", e[0], e[1]);
    },
    getRow(row) {
      if (!this.rowK) return "";
      return row[this.rowK];
    },
    // 多选按钮变化时
    selectionChange(e) {
      this.$emit("selectionChange", e);
    },
    // 手动勾选数据行的 Checkbox 时触发的事件
    select(e, row) {
      this.$emit("select", e, row);
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    selectAll(e) {
      this.$emit("selectAll", e);
    },
    // 点击某行的多选框时触发
    selectSingle(e, row) {
      this.$emit("selectSingle", e, row);
    },
    // 只能单选处理
    radioSelection(e) {
      this.$refs.tableRef.clearSelection(); //清除
      this.$refs.tableRef.toggleRowSelection(e.pop());
    },
    // 默认选中数据
    toggleRowSelection(e, bol) {
      this.$refs.tableRef.toggleRowSelection(e, bol);
    },
    // 默认选中全部数据
    toggleAllSelection() {
      this.$refs.tableRef.toggleAllSelection();
    },
    // switch状态变化时
    switchChange(e) {
      this.$emit("switchChange", e);
    },
    // 点击文字
    textClick(data) {
      this.$emit("textClick", data);
    },
    // 过滤器
    // getFilters(porp, filter) {
    //   if (!!filter) {
    //     return filters[filter](porp);
    //   } else {
    //     return porp;
    //   }
    // },
    // 过滤器
    getFilters(scope, item) {
      const prop =
        scope.row[
          typeof item.prop == "string" ? item.prop : item.prop(scope.row)
        ];
      const filter = item.filter;
      if (filter) {
        if (typeof filter == "string") {
          return filters[filter](prop, scope.row) || "/";
        } else if (typeof filter == "function") {
          return filter(scope) || "/";
        }
      } else {
        return prop || "/";
      }
    },
    // 清空多选框
    clearSelection() {
      this.$refs.tableRef.clearSelection();
    },
    // 清空多选框
    doLayout() {
      this.$refs.tableRef.doLayout();
    },
    // 下拉框变化时触发
    selectChange(data) {
      this.$emit("selectChange", data);
    },
    // 单选
    radioChange(e, data) {
      this.$emit("radioChange", e, data);
    },
  },
  created() {},
  mounted() {},
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_base_comps_page_table {
  ::v-deep .status {
    display: inline-block;
    text-align: center;
    height: 24px;
    line-height: 24px;
    padding: 0 4px;
    //待设计
    &.undevelop {
      background: #ffeaec;
      color: $danger_color;
    }
    //已完成
    &.finished {
      background: #f2f8ff;
      color: $theme_color;
    }
    // 已作废
    &.cancellation {
      background: #f3f3f3;
      color: $sec_ft_color;
    }
    // 待生产
    &.unpublish {
      background: #dffff6;
      color: #2ddaac;
    }
    // 生产中
    &.publishing {
      background: #fff4e5;
      color: #ff9104;
    }
    // 待验收
    &.unchecked {
      background: #ffeaec;
      color: #fe4758;
    }
    &.link {
      background-color: #f0f5ff;
      color: #358aff;
    }

    &.disabled {
      background-color: #f3f3f3;
      color: #999;
    }
    &.error {
      background-color: #ffeaec;
      color: #fe4758;
    }
  }
  // min-height: 390px;
  ::v-deep .el-table tr {
    background: $base_white;
    color: $reg_ft_color;
    .cell {
      div {
        display: inline-block;
      }
    }
  }
  ::v-deep .el-table th {
    background: $base_bg_color;
    color: $reg_ft_color;
  }
  ::v-deep .el-table {
    table {
      width: 100% !important;
    }
    .el-table__empty-block {
      width: 100% !important;
    }
  }
  .table_button {
    display: inline-block;
    cursor: pointer;
    color: $theme_color;
    margin-right: 16px;
  }
  .icon {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    display: inline-block;
    font-size: 30px;
    line-height: 20px;
    color: $reg_ft_color;
  }
  .text_style {
    color: $theme_color;
    font-family: $font_regular;
    font-size: 14px;
    cursor: pointer;
  }

  .text_style_blue {
    color: $theme_color;
    font-family: $font_regular;
    font-size: 14px;
    // cursor: pointer;
  }

  .table_text {
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  // 隐藏全选框
  .hide_checkbox ::v-deep thead th .el-checkbox {
    visibility: hidden;
  }
  .table_btn_box .table_border {
    display: inline-block;
    cursor: pointer;
    color: $theme_color;
  }
  .btn_delete {
    color: #fe4758;
  }
  .table_btn_box {
    .table_border {
      &::after {
        content: "|";
        margin: 0 5px;
        color: $pri_br_color;
      }
      &:last-child {
        &::after {
          content: "";
        }
      }
    }
  }
  .el-dropdown-link {
    cursor: pointer;
    color: $theme_color;
    ::v-deep .el-icon--right {
      margin-left: 0;
    }
  }
}
</style>
