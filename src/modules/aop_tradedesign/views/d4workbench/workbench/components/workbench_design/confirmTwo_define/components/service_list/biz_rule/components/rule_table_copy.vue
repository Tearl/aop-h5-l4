<template>
  <div class="aop_tradedesign_comps_d4_edit_biz_rule_inner_table">
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%">
      <el-table-column
        v-for="(item, index) in tableColumn"
        :key="index"
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
            v-else-if="item.type == 'textClick'"
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
      <!-- <el-table-column
        property="date"
        label="日期"
        width="120">
      </el-table-column>
      <el-table-column
        property="name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        property="address"
        label="地址">
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import Table from "@m/core/components/page_table";
import PageDialog from "@m/core/components/page_dialog";
import filters from "@m/utils/filters";

export default {
  components: {
    Table,
    PageDialog,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: () => false,
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    tableColumn: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // tableData: [{
      //   date: '2016-05-02',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   date: '2016-05-04',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1517 弄'
      // }, {
      //   date: '2016-05-01',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1519 弄'
      // }, {
      //   date: '2016-05-03',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1516 弄'
      // }],
      // tableColumn: [
      //   {
      //     prop: "ruleNo",
      //     label: "规则ID",
      //     width: "180",
      //     type: "text",
      //     tooltip: true,
      //   },
      //   {
      //     prop: "ruleNm",
      //     label: "规则名称",
      //     width: "120",
      //     type: "text",
      //     tooltip: true,
      //   },
      //   {
      //     prop: "ruleTpCd",
      //     label: "规则类型",
      //     width: "120",
      //     type: "text",
      //     filter: "ruleTpCd",
      //     operate: "read",
      //     tooltip: true,
      //   },
      //   {
      //     prop: "ruleDesc",
      //     label: "自然语言描述",
      //     width: "600",
      //     type: "textarea",
      //   },
      // ],
      currentRow: null,
    };
  },
  computed: {
    
  },
  methods: {
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  },
  created() {
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4_edit_biz_rule_inner_table {
}
</style>