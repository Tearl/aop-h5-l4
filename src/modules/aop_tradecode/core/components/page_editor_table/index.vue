<template>
  <div class="aop_tradedesign_comps_page_table">
    <el-table
      :data="data"
      :row-key="getRow"
      :tree-props="treeProps"
      :expand-row-keys="rowKey"
      style="width: 100%"
      @selection-change="selectionChange"
      @select="select"
      @select-all="selectAll"
      ref="tableRef"
      :class="comsClass"
      v-loading="tableLoading"
      :cell-style="cellStyle"
      :span-method="mergeFlag ? spanMethod : ''"
      :border="mergeFlag ? true : false"
      :key="reload"
    >
      <el-table-column
        :label="tableType == 'index' ? '序号' : ''"
        :type="tableType"
        width="55"
        align="center"
        v-if="tableType"
        :selectable="selectable"
      ></el-table-column>
      <template v-for="(item,index) in table">
        <el-table-column
          :key="index"
          v-if="useType == 'dialog' ? item.isTrue : true"
          :prop="item.prop"
          :width="item.width"
          :min-width="item.minWidth"
          :label="item.label"
          :fixed="item.fixed"
          :align="item.align || 'left'"
          :show-overflow-tooltip="item.tooltip == true ? true : false"
          :render-header="item.renderHeaderFun"
        >
          <template
            slot-scope="scope"
            v-if="item.templateIf ? item.templateIf(scope) : true"
          >
            <el-select
              v-model="scope.row[typeof item.prop == 'string' ? item.prop : item.prop(scope.row)]"
              :clearable="item.clearable == 'false' ? false : true"
              v-if="(typeof item.type == 'string' ? item.type : item.type(scope.row)) == 'select'"
              :placeholder="(typeof item.placeholder == 'function') ?  item.placeholder(scope) : (item.placeholder || '')"
              @change="selectChange(scope.row, item.prop)"
              :size="item.size ? item.size : 'small'"
              :style="item.inputStyle"
              :disabled="item.disabled && item.disabled(scope)"
            >
              <el-option
                v-for="i in item.selectVal"
                :key="i.value"
                :label="i.type"
                :value="i.value"
                :disabled="i.disabled && i.disabled(scope, table)"
              ></el-option>
            </el-select>
            <div v-if="item.type == 'selectText'">
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
                {{ getFilters(scope.row[item.prop], item.filter) }}
              </span>
            </div>
            <div v-else-if="(typeof item.type == 'string' ? item.type : item.type(scope.row)) == 'input'">
              <el-input
                :style="item.inputStyle"
                :class="item.class && item.class(scope)"
                v-model="scope.row[item.prop]"
                :placeholder="(typeof item.placeholder == 'function') ?  item.placeholder(scope) : (item.placeholder || '')"
                :clearable="item.clearable == 'false' ? false : true"
                @input="(e) => item.input && item.input(e, scope)"
                @blur="item.blur && item.blur(scope)"
                :disabled="item.disabled && item.disabled(scope, table)"
                :size="item.size ? item.size : 'small'"
              ></el-input>
              <span v-show="item.errorText && item.errorText(scope)" class="error_text" :style="{left: item.width - 170 + 10 +'px'}">{{item.label}}不可为空</span>
            </div>
            
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
              v-else-if="item.type == 'radio'"
              v-model="currentRadio"
              :label="scope.row[item.prop]"
              @change="(e) => radioChange(e, scope.row)"
              ><span></span
            ></el-radio>
            <el-radio-group
              v-else-if="item.type == 'radioGroup'"
              v-model="scope.row[item.prop]"
              @change="(e) => radioChange(e, scope.row)"
              :fill="scope.row[item.prop] == '00' ? '#36D542' : '#FE4758' "
              >
              <el-radio-button 
                v-for="ii in item.radioList"
                :key="ii.value"
                :label="ii.value"
              >{{ ii.label }}</el-radio-button>
            </el-radio-group>
            <el-checkbox
              v-else-if="item.type == 'checkbox'"
              v-model="scope.row[item.prop]"
              :size="item.size ? item.size : 'small'"
              @change="item.checkboxfun ? item.checkboxfun(scope) : ''"
              :true-label="item.true"
              :false-label="item.false"
            ></el-checkbox>
            <span v-else-if="item.type == 'enum'" :class="item.textClass">
              {{ item.enumObj[scope.row[item.prop]] }}
            </span>
            <span v-else-if="(typeof item.type == 'string' ? item.type : item.type(scope.row)) == 'text'" :class="item.textClass">
              {{ getFilters(scope.row[typeof item.prop == 'string' ? item.prop : item.prop(scope.row)], item.filter) }}
            </span>
            <span
              v-else-if="item.type == 'html'"
              :class="item.textClass"
              v-html="getFilters(scope.row[item.prop], item.filter)"
            >
            </span>
            <el-input
              class="textarea"
              v-else-if="item.type == 'textarea'"
              v-model="scope.row[item.prop]"
              type="textarea"
              :class="item.textClass"
              autosize
              resize="none"
              readonly
            >
            </el-input>
            <span v-else-if="item.type == 'textClassList'">
              <span
                v-for="(classItem, classIndex) in item.textClassList"
                :key="classIndex"
                v-show="scope.row[item.prop] == classItem.val"
                :class="classItem.class"
              >
                {{ getFilters(scope.row[item.prop], item.filter) }}
              </span>
            </span>
            <span
              v-else-if="(typeof item.type == 'string' ? item.type : item.type(scope.row)) == 'textClick'"
              :class="item.textClass ? item.textClass : 'text_style'"
              @click="operate(item.operate, scope.row)"
            >
              {{ getFilters(scope.row[item.prop], item.filter) }}
            </span>
            <div
              v-else-if="item.type == 'partlyTextClick'"
            >
              <span>{{ getFilters(scope.row[item.prop], item.filter) }}</span>
              <span
                @click="operate(item.operate, scope.row)"
                :class="item.textClass ? item.textClass : 'text_style'"
              >
                {{item.clickText}}
              </span>
            </div>
            <span v-else-if="item.type == 'iconText'" class="iconText_style" @click="operate(item.operate, scope.row)">
              <img
                v-for="(iconItem, iconIndex) in item.iconList"
                :key="iconIndex"
                class="text_icon"
                :src="iconItem.icon"
                v-show="iconItem.stylefun ? iconItem.stylefun(scope) : ''"
              />
              {{ getFilters(scope.row[item.prop], item.filter) }}
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
                v-for="(btnItem, i) in getShowBtnList(item.buttonList)"
                :key="i"
                :class="btnItem.icon ? 'table_button' : 'table_border'"
                v-if="(getShowBtnList(item.buttonList).length > 3 ? i<2 : true)"
                v-hasPermi="[btnItem.authName]"
              >
                <div @click="(btnItem.relation ? btnItem.relation(scope, table) : true) ? operate(btnItem.operate, scope.row) : ''">
                  <img
                    v-if="btnItem.icon"
                    class="icon"
                    :style="btnItem.stylefun ? btnItem.stylefun(scope) : ''"
                    :src="btnItem.icon"
                  />
                  <span
                    v-else
                    :class="
                    (btnItem.relation ? btnItem.relation(scope, table) : true) ? 
                      (btnItem.desc == '删除' || btnItem.desc == '作废'
                        ? 'btn_delete'
                        : '') : 'table_border_disabled'
                    "
                    >{{ btnItem.descFun ? btnItem.descFun(scope) : btnItem.desc }}</span
                  >
                </div>
              </div>
                <el-dropdown
                v-if="getShowBtnList(item.buttonList).length > 3"
                trigger="click"
                @command="command"
              >
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(dropItem, n) in getShowBtnList(item.buttonList)"
                    :key="n"
                    :command="[dropItem.operate, scope.row]"
                    :disabled="dropItem.relation ? !dropItem.relation(scope, table) : false"
                    v-if="n>1"
                    v-hasPermi="[dropItem.authName]"
                  >
                    <div v-if="dropItem.type == 'inlineBtn'">
                      <span
                        v-for="(inlineBtn, n) in getShowBtnList(dropItem.buttonList)"
                        :key="inlineBtn.desc"
                        >
                        <span v-if="inlineBtn.relation && inlineBtn.relation(scope, table)">
                          <span @click="operate(inlineBtn.operate, scope.row)" style="color: #358aff">{{inlineBtn.desc}}</span>
                          <span v-if="n < getShowBtnList(dropItem.buttonList).length - 1"> / </span> 
                        </span>
                        
                        <span v-else>
                          <span class="disabled_text_btn" style="color: #bbb;">{{inlineBtn.desc}}</span>
                          <span v-if="n < getShowBtnList(dropItem.buttonList).length - 1"> / </span> 
                        </span>
                      </span>
                      
                    </div>
                    <div v-else>
                      <span :style="{color: dropItem.relation ? (!dropItem.relation(scope, table) ? '#bbb' : '#358aff') : '#358aff'}">{{ dropItem.desc }}</span>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import filters from "@m/utils/filters";

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
    selectable: {
      type: Function,
      default: () => true
    },
    mergeArr: {
      type: Array,
      default: () => [],
    },
    mergeFlag: {
      type: Boolean,
      default: () => false,
    },
    useType: {
      type: String,
      default: () => "page",
    },
    reload: {
      type: Number,
      default: () => 0,
    },
  },
  data() {
    return {
      currentRadio: this.radioModel,
      permissions: [],
      mergeObj: {}
    };
  },
  methods: {
    operate(operation, data) {
      this.$emit("operate", operation, data);
    },
    command(e) {
      this.$emit("operate", e[0], e[1]);
    },
    // 获取需要合并的行列
    getSpanArr(data) {
      this.mergeArr.forEach((key, index1) => {
        let count = 0; 
        this.mergeObj[key] = []; 
        data.forEach((item, index) => {
          if (index === 0) {
            this.mergeObj[key].push(1);
          } else {
            // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
            if (item[key] === data[index - 1][key]) {
              this.mergeObj[key][count] += 1;
              this.mergeObj[key].push(0);
            } else {
              count = index; 
              this.mergeObj[key].push(1); 
            }
          }
        });
      });
    },
    // 合并
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.mergeArr.indexOf(column.property) !== -1) {
        // 判断其值是不是为0
        if (this.mergeObj[column.property][rowIndex]) {
          return [this.mergeObj[column.property][rowIndex], 1];
        } else {
          // 如果为0则为需要合并的行
          return [0, 0];
        }
      }
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
    select(e,row) {
      this.$emit("select", e, row);
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    selectAll(e) {
      this.$emit("selectAll", e);
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
    getFilters(porp, filter) {
      if (!!filter) {
        return filters[filter](porp);
      } else {
        return porp;
      }
    },
    // 清空多选框
    clearSelection() {
      this.$refs.tableRef.clearSelection();
    },
    // 下拉框变化时触发
    selectChange(row, prop) {
      this.$emit("selectChange", row, prop);
    },
    // 单选
    radioChange(e, data) {
      this.$emit("radioChange", e, data);
    },
    selectFocus(e,d) {
      this.$emit("selectFocus",e,d)
    },
    // 当前角色拥有权限的按钮列表
    getShowBtnList(data) {
      const result = data.filter(item => {
        if (item.authName) {
          return this.permissions.indexOf(item.authName) > -1
        } else {
          return true
        }
      })
      return result
    },
    // 清理radio
    clearRadio() {
      this.currentRadio = "";
    },
    init() {
      this.permissions = JSON.parse(JSON.parse(localStorage.getItem('__menuItemList')).value)
      if (this.mergeFlag) {
        this.getSpanArr(this.data)
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  watch: {
    radioModel(val) {
      this.currentRadio = val;
    }
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradedesign_comps_page_table {
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
      background: #ffeaec;
      color: $danger_color;
    }
    // 生产中
    &.publishing {
      background: #fff4e5;
      color: $sec_warning_color;
    }
    // 待验收
    &.unchecked {
      background: #dffff6;
      color: $success_color;
    }
    &.add{
      border: 0.5px solid #FE4758;
      color: $danger_color;
      width: 55px;
    }
    &.register{
      border: 0.5px solid #36D542;
      color:#36D542;
      width: 55px;
    }
    &.self{
      border: 0.5px solid #358AFF;
      color: #358AFF;
    }
    &.change{
      border: 0.5px solid #FF9104;
      color: #FF9104;
    }
    &.selfOther{
      border: 0.5px solid #FF9104;
      color: #FF9104;
      width: 55px;
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
    // background: $base_bg_color;
    background: $table_bg_color;
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
  .textarea {
    ::v-deep .el-textarea__inner {
      width: 100%;
      overflow: hidden;
      border: none;
      background: transparent;
      padding: 5px 0;
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
  .el-table ::v-deep th.gutter {
    display: table-cell !important;
  }
  .el-table ::v-deep colgroup.gutter {
    display: table-cell !important;
  }
  .error_text{
    position: absolute;
    top: 52px;
    left: 10px;
    font-size: 12px;
    color: #F56C6C;
  }
}
</style>