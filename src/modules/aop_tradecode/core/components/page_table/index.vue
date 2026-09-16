<template>
  <div class="aop_developer_comps_page_table">
    <el-table
      :data="isBig ? virtualData : data"
      :row-key="getRow"
      :tree-props="treeProps"
      :expand-row-keys="rowKey"
      style="width: 100%"
      @selection-change="selectionChange"
      ref="tableRef"
      :class="comsClass"
      v-loading="tableLoading"
      :cell-style="cellStyle"
      :lazy="isBig ? true : false"
      :load="load"
      :stripe="stripe"
      :row-style="rowStyle"
    >
      <el-table-column
        :label="tableType == 'index' ? '序号' : ''"
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
        :min-width="item.minWidth"
        :label="item.label"
        :fixed="item.fixed"
        :align="item.align || 'left'"
        :show-overflow-tooltip="item.tooltip == true ? true : false"
      >
        <template
          slot-scope="scope"
          v-if="item.templateIf ? item.templateIf(scope) : true"
        >
          <el-select
            v-model="scope.row[typeof item.prop == 'string' ? item.prop : item.prop(scope.row)]"
            :clearable="
              item.clearable ? (item.clearable === 'true' ? true : false) : true
            "
            v-if="getType(item, scope) == 'select'"
            :placeholder="item.placeholder ? item.placeholder : item.label"
            :filterable="item.filterable"
            @focus="selectFocus(scope.row,item.prop)"
            @change="
              item.selectChange
                ? item.selectChange(scope, table)
                : selectChange(scope.row, item.prop)
            "
            :disabled="item.disabled && item.disabled(scope, table)"
            :size="item.size ? item.size : 'small'"
            :style="item.inputStyle"
          >
            <el-option
              v-if="item.disabled(scope, table) && item.disabledVal"
              v-for="(d, dvIndex) in item.disabledVal"
              :key="dvIndex"
              :label="d.type"
              :value="d.value"
            ></el-option>
            <el-option
              v-for="(i, selIndex) in getSelectVal(item, scope)"
              :key="selIndex"
              :label="i.type"
              :value="i.value"
              :disabled="i.disabled && i.disabled(scope, i)"
            ></el-option>
          </el-select>
          <div v-if="getType(item, scope) == 'selectText'">
            <el-select
              v-model="scope.row[item.prop]"
              :clearable="
                item.clearable
                  ? item.clearable === 'true'
                    ? true
                    : false
                  : true
              "
              v-if="item.selectText ? item.selectText(scope) : false"
              :placeholder="item.placeholder ? item.placeholder : item.label"
              :filterable="item.filterable"
              @focus="selectFocus(scope.row,item.prop)"
              @change="
                item.selectChange
                  ? item.selectChange(scope, table)
                  : selectChange(scope.row)
              "
              :disabled="item.disabled && item.disabled(scope, table)"
              :size="item.size ? item.size : 'small'"
              :style="item.inputStyle"
            >
              <el-option
                v-if="item.disabled(scope, table) && item.disabledVal"
                v-for="(d, dvIndex) in item.disabledVal"
                :key="dvIndex"
                :label="d.type"
                :value="d.value"
              ></el-option>
              <el-option
                v-for="(i, selIndex) in item.selectVal"
                :key="selIndex"
                :label="i.type"
                :value="i.value"
                :disabled="i.disabled && i.disabled(scope, i)"
              ></el-option>
            </el-select>
            <span v-else :class="item.textClass">
              {{ getFilters(scope, item) }}
            </span>
          </div>
          <el-input
            :style="item.inputStyle"
            v-model="scope.row[item.prop]"
            :placeholder="item.placeholder"
            clearable
            @change="inputChange(scope.row)"
            @input="(e) => item.input && item.input(e, scope)"
            :disabled="item.disabled && item.disabled(scope, table)"
            v-else-if="getType(item, scope) == 'input'"
            :size="item.size ? item.size : 'small'"
          ></el-input>
          <div v-else-if="getType(item, scope) == 'inputPicker'">
            <el-input
              v-if="item.inputPicker && item.inputPicker(scope)"
              :style="item.inputStyle"
              v-model="scope.row[item.prop]"
              :placeholder="item.placeholder"
              clearable
              @input="(e) => item.input && item.input(e, scope)"
              @change="inputChange(scope.row)"
              :disabled="item.disabled && item.disabled(scope, table)"
              :size="item.size ? item.size : 'small'"
            ></el-input>
            <el-date-picker
              v-model="scope.row[item.prop]"
              type="datetime"
              :style="item.inputStyle"
              v-else
              clearable
              :value-format="item.format"
              :placeholder="item.placeholder"
              :size="item.size ? item.size : 'small'"
              @change="inputChange(scope.row)"
            ></el-date-picker>
          </div>
          <div v-else-if="getType(item, scope) == 'selectPicker'">
            <el-select
              v-if="item.selectPicker && item.selectPicker(scope)"
              v-model="scope.row[typeof item.prop == 'string' ? item.prop : item.prop(scope.row)]"
              :clearable="
                item.clearable
                  ? item.clearable === 'true'
                    ? true
                    : false
                  : true
              "
              :placeholder="item.placeholder ? item.placeholder : item.label"
              :filterable="item.filterable"
              @focus="selectFocus(scope.row, typeof item.prop == 'string' ? item.prop : item.prop(scope.row))"
              @change="
                item.selectChange
                  ? item.selectChange(scope, table)
                  : selectChange(scope.row)
              "
              @blur="(e) => selectBlur(e,scope)"
              :disabled="item.disabled && item.disabled(scope, table)"
              :size="item.size ? item.size : 'small'"
              :style="item.inputStyle"
            >
              <el-option
                v-if="item.disabled(scope, table) && item.disabledVal"
                v-for="(d, dvIndex) in item.disabledVal"
                :key="dvIndex"
                :label="d.type"
                :value="d.value"
              ></el-option>
              <el-option
                v-for="(i, selIndex) in item.selectVal"
                :key="selIndex"
                :label="i.type"
                :value="i.value"
                :disabled="i.disabled && i.disabled(scope, i)"
              ></el-option>
            </el-select>
            <el-date-picker
              v-model="scope.row[item.prop]"
              :type="item.dateType || 'datetime'"
              :style="item.inputStyle"
              v-else
              clearable
              :value-format="item.format"
              :placeholder="item.placeholder"
              :size="item.size ? item.size : 'small'"
              @change="inputChange(scope.row)"
            ></el-date-picker>
          </div>
          <div v-else-if="getType(item, scope) == 'inputBtn'">
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
            <div v-else @click="operate(item.btnItem.operate, scope.row)">
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
            v-else-if="getType(item, scope) == 'radio'"
            v-model="currentRadio"
            :label="scope.row[item.prop]"
            :disabled="isDisabled"
            @change="radioChange(scope.row)"
            ><span></span
          ></el-radio>
          <el-checkbox
            v-else-if="getType(item, scope) == 'checkbox'"
            v-model="scope.row[item.prop]"
            :size="item.size ? item.size : 'small'"
            @change="item.checkboxfun ? item.checkboxfun(scope) : ''"
            :true-label="item.true"
            :false-label="item.false"
          ></el-checkbox>
          <span v-else-if="getType(item, scope) == 'enum'" :class="item.textClass">
            {{ item.enumObj[scope.row[item.prop]] }}
          </span>
          <span v-else-if="getType(item, scope) == 'text'" :class="item.textClass">
            {{ getFilters(scope, item) }}
          </span>
          <span
            v-else-if="getType(item, scope) == 'html'"
            :class="item.textClass"
            v-html="getFilters(scope, item)"
          >
          </span>
          <el-input
            class="textarea"
            v-else-if="getType(item, scope) == 'textarea'"
            v-model="scope.row[item.prop]"
            type="textarea"
            :class="item.textClass"
            autosize
            resize="none"
            readonly
          >
          </el-input>
          <span v-else-if="getType(item, scope) == 'textClassList'">
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
            v-else-if="getType(item, scope) == 'textClick'"
            :class="item.textClass ? item.textClass : 'text_style'"
            @click="operate(item.operate, scope.row)"
          >
            {{ getFilters(scope, item) }}
          </span>
          <div
            v-else-if="getType(item, scope) == 'partlyTextClick'"
          >
            <span v-if="item.customFormat && item.customFormat(scope.row)">
              <span v-for="text in item.textArray(scope.row)" :key="text.content">
                <span v-if="text.type == 'click'" class="text_style" @click="operate(text.operate, scope.row)">{{ text.content }}</span>
                <span v-else>{{ text.content }}</span>
              </span>
            </span>
            <span v-else>{{ getFilters(scope, item) }}</span>
            <span
              @click="operate(item.operate, scope.row)"
              :class="item.textClass ? item.textClass : 'text_style'"
            >
              {{typeof item.clickText == "string" ? item.clickText : item.clickText(scope.row)}}
            </span>
          </div>
          <span
            v-else-if="getType(item, scope) == 'iconText'"
            class="iconText_style"
            @click="operate(item.operate, scope.row)"
          >
            <img
              v-for="(iconItem, iconIndex) in item.iconList"
              :key="iconIndex"
              class="text_icon"
              :src="iconItem.icon"
              v-show="iconItem.stylefun ? iconItem.stylefun(scope) : ''"
            />
            {{ getFilters(scope, item) }}
          </span>
          <el-rate
            v-else-if="getType(item, scope) == 'rate'"
            v-model="scope.row[item.prop]"
            disabled
          ></el-rate>
          <el-switch
            v-else-if="getType(item, scope) == 'switch'"
            v-model="scope.row[item.prop]"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            :disabled="item.disabled ? item.disabled(scope) : false"
            @change="switchChange(scope.row)"
          ></el-switch>
          <div v-else-if="getType(item, scope) == 'button'" class="table_btn_box">
            <div
              v-for="(btnItem, i) in item.buttonList"
              :key="i"
              :class="btnItem.icon ? 'table_button' : 'table_border'"
              v-if="item.buttonList.length > 3 ? (i < 2 ? true : false) : true"
            >
              <div
                @click="
                  (btnItem.relation ? btnItem.relation(scope, table) : true)
                    ? operate(btnItem.operate, scope.row)
                    : ''
                "
              >
                <img
                  v-if="btnItem.icon"
                  class="icon"
                  :style="btnItem.stylefun ? btnItem.stylefun(scope) : ''"
                  :src="btnItem.icon"
                />
                <span
                  v-else
                  :class="
                    (btnItem.relation ? btnItem.relation(scope, table) : true)
                      ? btnItem.desc == '删除' || btnItem.desc == '作废'
                        ? 'btn_delete'
                        : ''
                      : 'table_border_disabled'
                  "
                  >{{
                    btnItem.renamed ? btnItem.renamed(scope) : btnItem.desc
                  }}</span
                >
              </div>
            </div>
            <el-dropdown
              v-if="
                item.dropdownList
                  ? item.dropdownList.length > 0
                  : item.buttonList.length > 3
              "
              trigger="click"
              @command="command"
            >
              <span class="el-dropdown-link">
                {{ item.dropdownTitle ? item.dropdownTitle : "更多"
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(dropItem, n) in item.dropdownList
                    ? item.dropdownList
                    : item.buttonList"
                  :key="n"
                  :command="[dropItem.operate, scope.row]"
                  :disabled="
                    dropItem.relation ? !dropItem.relation(scope, table) : false
                  "
                  v-if="
                    item.dropdownList ? item.dropdownList.length > 0 : n > 1
                  "
                >
                  {{ dropItem.desc }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-else-if="getType(item,scope) == 'inputNumber'">
            <el-input-number :max="inputNumber" v-model="scope.row[item.prop]" controls-position="right" @change="handleChange" :min="1" :disabled="item.disabled && item.disabled(scope, table)"></el-input-number>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import filters from "@m/core/utils/new";
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
      default: () => ({ children: "children", hasChildren: "hasChildren" }),
    },
    cellStyle: {
      type: Object,
      default: () => ({}),
    },
    //默认选中
    radioModel: {
      type: String,
      default: () => "",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isBig: {
      type: Boolean,
      default: false,
    },
    inputNumber:{
      type:Number,
      default:()=>50
    },
    stripe: { //是否隔行变色
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentRadio: this.radioModel,
      //大数据负责懒加载
      virtualData: [],
    };
  },
  methods: {
    operate(operation, data) {
      this.$emit("operate", operation, data);
    },
    command(e) {
      this.$emit("operate", e[0], e[1]);
    },
    getRow(row) {
      if (!this.rowK) return null;
      return row[this.rowK];
    },
    // 多选按钮变化时
    selectionChange(e) {
      this.$emit("selectionChange", e);
    },
    // 只能单选处理
    radioSelection(e) {
      this.$refs.tableRef.clearSelection(); //清除
      this.$refs.tableRef.toggleRowSelection(e.pop());
    },
    // 默认选中数据
    toggleRowSelection(e) {
      this.$refs.tableRef.toggleRowSelection(e);
    },
    // switch状态变化时
    switchChange(e) {
      this.$emit("switchChange", e);
    },
    // 点击文字
    textClick(data) {
      this.$emit("textClick", data);
    },

    iconText(data) {
      this.$emit("iconText", data);
    },
    // 过滤器
    getFilters(scope, item) {
      const prop = scope.row[typeof item.prop == 'string' ? item.prop : item.prop(scope.row)]
      const filter = item.filter
      if (filter) {
        if (typeof filter == 'string') {
          return filters[filter](prop, scope.row) || ""
        } else if (typeof filter == 'function') {
          return filter(scope) || ""
        }
      } else {
        return prop || "";
      }
    },
    // 清空多选框
    clearSelection() {
      this.$refs.tableRef.clearSelection();
    },
    // 下拉框变化时触发
    selectChange(data, prop) {
      this.$emit("selectChange", data, prop);
    },
    // 单选
    radioChange(data) {
      this.$emit("radioChange", data);
    },
    // 清理radio
    clearRadio() {
      this.currentRadio = "";
    },
    // inputChange改变
    inputChange(e) {
      this.$emit("inputChange", e);
    },
    selectFocus(e,p) {
      this.$emit("selectFocus", e,p);
    },
    selectBlur(e,scope) {
      this.$emit("selectBlur",e,scope.row)
    },
    handleChange(data){
      console.log("data=>",data)
      this.$emit("handleChange", data);
    },

    //懒加载
    load(tree, treeNode, resolve) {
      let child = [];
      child = this.loadId(
        JSON.parse(JSON.stringify(this.data)),
        tree.paramId,
        child
      );
      for (let j in child) {
        if (child[j].children && child[j].children.length > 0) {
          child[j].children = [];
          child[j].hasChildren = true;
        }
      }
      setTimeout(() => {
        resolve(child);
      }, 1000);
    },
    //遍历
    loadId(arr, id, data = []) {
      arr.forEach((item) => {
        if (item.paramId === id) {
          console.log("匹配");
          data = item.children || [];
        }
        if (item.children && data.length === 0) {
          data = this.loadId(item.children, id, []);
        }
      });
      return data;
    },
    getType(item, scope) {
      return typeof item.type == 'string' ? item.type : item.type(scope.row)
    },
    getSelectVal(item, scope) {
      return typeof item.selectVal == 'object' ? item.selectVal : item.selectVal(scope.row)
    },
    rowStyle({ row, rowIndex }) {
      let changeColor = {
        "background":"#f9d9dd"
      };
      let upgradesColor = {
        "background":"#fef0de"
      }
      if(row?.changeTp == "1") return changeColor
      else if (row?.changeTp == "2") return upgradesColor
      else return ""
    }
  },
  created() {},
  mounted() {},
  watch: {
    radioModel(val) {
      this.currentRadio = val;
    },
    data(val) {
      if (this.isBig) {
        const data = JSON.parse(JSON.stringify(val));
        this.virtualData = data.map((item) => {
          if (
            (item.paramValueType === "List" ||
              item.paramValueType === "Object") &&
            item.children &&
            item.children.length > 0
          ) {
            item.children = [];
            item.hasChildren = true;
          }
          return item;
        });
      }
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_developer_comps_page_table {
  ::v-deep .status {
    display: inline-block;
    text-align: center;
    height: 24px;
    line-height: 24px;
    padding: 0 4px;
    &.red {
      background: #ffeaec;
      color: $danger_color;
    }
    &.blue {
      background: #f2f8ff;
      color: $theme_color;
    }
    &.grey {
      background: #f3f3f3;
      color: $sec_ft_color;
    }
    &.green {
      background: #dffff6;
      color: $success_color;
    }
    &.orange {
      background: #fff4e5;
      color: $sec_warning_color;
    }
  }
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
  ::v-deep .el-rate__icon {
    font-size: 14px;
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

  .table_text {
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .iconText_style {
    cursor: pointer;
  }
  // 隐藏全选框
  .hide_checkbox ::v-deep thead th .el-checkbox {
    visibility: hidden;
  }
  .table_btn_box {
    .table_border {
      display: inline-block;
      cursor: pointer;
      color: $theme_color;
    }
  }
  .table_border_disabled {
    color: #999 !important;
    cursor: not-allowed;
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
  ::v-deep .el-rate__icon {
    margin-right: 2px;
  }
  ::v-deep .el-input-number{
    width: 100%;
  }
  .text_icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    display: inline-block;
    font-size: 30px;
    line-height: 16px;
    color: $reg_ft_color;
  }
  .el-table ::v-deep.el-table__cell {
    user-select: text;
  }
  ::v-deep .el-switch {
    vertical-align: baseline;
  }
  .el-table ::v-deep th.gutter {
    display: table-cell !important;
  }
  .el-table ::v-deep colgroup.gutter {
    display: table-cell !important;
  }
  // 改变展开行按钮样式
  ::v-deep .el-icon-arrow-right {
    display: inline-block;
    width: 17px;
    height: 17px;
    text-align: center;
    line-height: 14px;
    border: 1px solid #e9e9e9;
    user-select: none;
    background: #fff;
  }
  ::v-deep .el-table__expand-icon .el-icon-arrow-right:before {
    content: "+";
  }
  ::v-deep .el-table__expand-icon--expanded .el-icon-arrow-right:before {
    content: "-";
  }
  ::v-deep [class*="el-table__row--level"] .el-table__expand-icon {
    transform: rotate(0);
  }
  .textarea {
    ::v-deep .el-textarea__inner {
      width: 100%;
      overflow: hidden;
      border: none;
      background: transparent;
      padding: 5px 0;
    }
  }
}
</style>
