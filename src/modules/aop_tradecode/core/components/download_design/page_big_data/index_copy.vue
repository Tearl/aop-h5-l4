<template>
  <div class="aop_workgate_comps_page_big_data">
    <div
      :ref="type == '' ? 'dataRef' : ''"
      class="big_data_wrapper"
      :class="type == '' ? parentClass : ''"
    >
      <el-row v-if="type == ''" class="grid_no_re">
        <el-col :span="4"><div class="grid_header">参数key</div></el-col>
        <el-col :span="5"><div class="grid_header">参数名称</div></el-col>
        <el-col :span="3"><div class="grid_header">参数值类型</div></el-col>
        <el-col :span="2"><div class="grid_header">参数长度</div></el-col>
        <el-col :span="2"><div class="grid_header">是否必输</div></el-col>
        <el-col :span="3"><div class="grid_header">默认值</div></el-col>
        <el-col :span="5"><div class="grid_header">参数描述</div></el-col>
        <!-- <el-col :span="3"><div class="grid_header">枚举值</div></el-col> -->
        <!-- <el-col :span="2"><div class="grid_header">贯标标志</div></el-col>
        <el-col :span="2"><div class="grid_header">贯标方式</div></el-col> -->
        <!-- <el-col :span="2"><div class="grid_header">自定义规则</div></el-col> -->
        <div class="grid_header_operation">
          <div class="grid_header">操作</div>
        </div>
      </el-row>
      <el-row v-if="data.length > 0" class="grid_no_re" disabled>
        <div class="grid_item" v-for="(item, index) in data" :key="index">
          <el-col :span="4"
            ><div
              class="grid_content gird_name"
              :style="{ paddingLeft: level * 15 + 'px' }"
            >
              <i
                v-if="item.children && item.children.length>0"
                class="grid_icon"
                :class="
                  item.showChild
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="handleChildShow(item)"
              ></i>
              <el-input
                v-model="item.paramKey"
                size="small"
                clearable
                placeholder=""
                maxlength="50"
                :disabled="item.disabled"
                @blur="paramKeyBlur(item)"
              >
              </el-input></div
          ></el-col>
          <el-col :span="5"
            ><div class="grid_content">
              <el-input
                v-model="item.paramCName"
                size="small"
                clearable
                placeholder=""
                maxlength="50"
                :disabled="item.disabled"
              >
              </el-input></div
          ></el-col>
          <!-- <el-col :span="2"
            ><div class="grid_content">
              <el-input
                v-model="item.paramDesc"
                size="small"
                clearable
                placeholder=""
              >
              </el-input></div
          ></el-col> -->
          <el-col :span="3"
            ><div class="grid_content">
              <el-select
                v-model="item.paramValueType"
                :disabled="item.disabled"
                size="small"
                @change="handleValueType(item)"
              >
                <el-option
                  v-for="(nItem, nI) in (!item.speciTypeList ? speciTypeList : typeList)"
                  :value="nItem.value"
                  :key="nI"
                  :label="nItem.type"
                  >{{ nItem.type }}</el-option
                >
              </el-select>
            </div></el-col
          >
          <!-- <el-col :span="2"
            ><div class="grid_content">
              <el-select
                v-model="item.standFlg"
                size="small"
              >
                <el-option
                  v-for="(nItem, nI) in standFlgList"
                  :value="nItem.value"
                  :key="nI"
                  :label="nItem.type"
                  >{{ nItem.type }}</el-option
                >
              </el-select>
            </div></el-col
          >
          <el-col :span="2"
            ><div class="grid_content">
              <el-select
                v-model="item.standType"
                size="small"
              >
                <el-option
                  v-for="(nItem, nI) in standTypeList"
                  :value="nItem.value"
                  :key="nI"
                  :label="nItem.type"
                  >{{ nItem.type }}</el-option
                >
              </el-select>
            </div></el-col
          > -->
          <el-col :span="2"
            ><div class="grid_content">
              <el-input
                v-model="item.paramLength"
                :disabled="item.disabled"
                size="small"
                clearable
                placeholder=""
                maxlength="50"
              >
              </el-input></div
          ></el-col>
          <el-col :span="2"
            ><div class="grid_content">
              <el-select v-model="item.isNeed" size="small" :disabled="item.disabled">
                <el-option
                  v-for="(nItem, nI) in isNeedList"
                  :value="nItem.value"
                  :key="nI"
                  :label="nItem.type"
                  >{{ nItem.type }}</el-option
                >
              </el-select>
            </div></el-col
          >
          <el-col :span="3"
            ><div class="grid_content">
              <el-input
                v-model="item.paramValue"
                size="small"
                clearable
                :disabled="item.disabled"
                placeholder=""
                maxlength="500"
              >
              </el-input></div
          ></el-col>
          <el-col :span="5"
            ><div class="grid_content">
              <el-input
                v-model="item.paramDesc"
                size="small"
                clearable
                :disabled="item.disabled"
                placeholder=""
                maxlength="500"
              >
              </el-input></div
          ></el-col>
          <!-- <el-col :span="3"
            ><div class="grid_content">
              <el-input
                v-model="item.checkPattern"
                size="small"
                clearable
                :disabled="item.disabled"
                placeholder=""
                maxlength="500"
              >
              </el-input></div
          ></el-col> -->
          
          <!-- <el-col :span="2"
            ><div class="grid_content">
              <el-input
                v-model="item.paramValue"
                size="small"
                clearable
                placeholder=""
              >
              </el-input></div
          ></el-col> -->
          <div
            class="grid_content_operation"
            :style="{
              left: type == '' ? opereationLeft + 'px' : chilLeft + 'px',
            }"
          >
            <el-button
              type="text"
              size="small"
              @click="add(item)"
              :disabled="item.disabled &&item.paramKey != 'bodyData' && item.paramKey != 'bodyOutData'"
              v-show="
                item.paramValueType == 'List' ||
                item.paramValueType == 'Object'
              "
              >增加</el-button
            >
            <el-button
              type="text"
              size="small"
              :class="item.disabled ? '' : 'del_btn'"
              :disabled="item.disabled"
              v-show="item.paramValueType != 'List' && item.paramValueType != 'Object'"
              @click="del(item)"
              >删除</el-button
            >
            <el-dropdown v-show="item.paramValueType == 'List' || item.paramValueType == 'Object'">
              <span class="operation_link" :class="item.disabled &&item.paramKey != 'bodyData' &&item.paramKey != 'bodyOutData' ? 'more_unClick':''">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :disabled="
                    item.paramValueType !== 'List' &&
                    item.paramValueType !== 'Object'
                  "
                  @click.native="addByDic(item)"
                  >从数据集添加</el-dropdown-item
                >
                <el-dropdown-item @click.native="del(item)"
                  :disabled="item.disabled"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <PageBigData
            v-if="item.children && item.children.length > 0 && item.showChild"
            :data="item.children"
            type="child"
            :level="level + 1"
            class="grid_child"
            :chilLeft="type == '' ? opereationLeft : chilLeft"
            v-bind="$attrs"
            @add="add"
            @del="del"
            @addByDic="addByDic"
          ></PageBigData>
        </div>
      </el-row>
      <div v-else class="grid_empty">
        <p>暂无数据</p>
        <div class="grid_empty_pos"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PageBigData",
  components: {},
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: () => "",
    },
    level: {
      type: Number,
      default: () => 0,
    },
    chilLeft: {
      type: Number,
      default: () => 0,
    },
    // 滚动条元素的类名
    parentClass: {
      type: String,
      default: () => "big_data_wrapper",
    },
    typeList: {
      type: Array,
      default: () => [
        { type: "String", value: "String" },
        { type: "File", value: "File" },
        { type: "List", value: "List" },
        { type: "boolean", value: "boolean" },
        { type: "char", value: "char" },
        { type: "int", value: "int" },
        { type: "byte", value: "byte" },
        { type: "short", value: "short" },
        { type: "long", value: "long" },
        { type: "float", value: "float" },
        { type: "double", value: "double" },
        { type: "Boolean", value: "Boolean" },
        { type: "Character", value: "Character" },
        { type: "Integer", value: "Integer" },
        { type: "Byte", value: "Byte" },
        { type: "Short", value: "Short" },
        { type: "Long", value: "Long" },
        { type: "Float", value: "Float" },
        { type: "Double", value: "Double" },
        { type: "BigDecimal", value: "BigDecimal" },
        { type: "Object", value: "Object" },
        { type: "Date", value: "Date" },
      ],
    },
  },
  data() {
    return {
      // 贯标标志  00-没有贯标；10--已贯标
      standFlgList: [
        { type: "没有贯标", value: "00" },
        { type: "已贯标", value: "10" },
      ],
      // 贯标方式(00-手工贯标；10-系统贯标)
      standTypeList: [
        { type: "手工贯标", value: "00" },
        { type: "系统贯标", value: "10" },
      ],
      isNeedList: [
        { type: "否", value: "0" },
        { type: "是", value: "1" },
      ],
      opereationLeft: 0,

      rsObserver: "",
      isObserver: "",
      speciTypeList: [
        { type: "List", value: "List" },
        { type: "Object", value: "Object" },
      ]
    };
  },
  methods: {
    handleChildShow(e) {
      console.log(e);
      e.showChild = !e.showChild;
      this.$forceUpdate();
    },
    handleValueType(e) {
      if (e.paramValueType !== "List" || e.paramValueType !== "Object") {
        e.children = [];
        delete e.children;
        delete e.showChild;
      }
    },
    //计算位置
    leftCount() {
      if (this.type == "") {
        // 横向滚动
        const scrollLeft = this.$refs.dataRef.scrollLeft; // scrollX
        const w = this.$refs.dataRef.offsetWidth;
        this.opereationLeft = w - 100 + scrollLeft;
      } else {
        this.opereationLeft = this.chilLeft;
      }
    },
    //窗口宽度改变
    handleResize() {
      console.log("handle resize");
      this.leftCount();
    },
    //滚动改变
    handleScroll() {
      console.log("handle scroll");
      this.leftCount();
    },
    add(e) {
      this.$emit("add", e);
      this.$forceUpdate();
    },
    del(e) {
      this.$emit("del", e);
      this.$forceUpdate();
    },
    addByDic(e) {
      console.log(e);
      this.$emit("addByDic", e);
    },
    paramKeyBlur(e) {
      this.$emit("paramKeyBlur", e);
    },
  },
  mounted() {
    if (this.type === "") {
      this.leftCount();
      const dom = this.$refs.dataRef;
      this.rsObserver = new ResizeObserver(this.handleResize);
      this.rsObserver.observe(dom);
      document
        .querySelector("." + this.parentClass)
        .addEventListener("scroll", this.leftCount);
    }
  },
  beforeDestroy() {
    this.rsObserver.disconnect();
    try {
      document
      .querySelector("." + this.parentClass)
      .removeEventListener("scroll", this.leftCount);
    } catch (error) {
      console.log(error)
    }
  },
  watch: {
    data(val) {},
    chilLeft(val) {},
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_workgate_comps_page_big_data {
  clear: both;
  position: relative;
  .big_data_wrapper {
    overflow-x: scroll;
    width: 100%;
    padding-right: 100px;
    border-bottom: 1px solid #ebeef5;
    @include scrollbar;
    .grid_no_re {
      position: static;
      width: calc(150%);
    }
    &::after {
      content: "";
      position: absolute;
      width: 20px;
      top: 0;
      left: calc(100% - 100px);
      right: 0;
      bottom: 10px;
      box-shadow:-5px 2px 10px -5px rgba(0,0,0,0.12)
    }
  }
  .grid_item {
    clear: both;
    position: relative;
    width: 100%;
    &::after {
      content: "";
      display: block;
      clear: both;
    }
  }
  .grid_child {
    position: static;
    .big_data_wrapper {
      width: 100%;
      overflow: visible;
      padding-right: 0;
      border-bottom: 0;
      .grid_no_re {
        width: 100%;
      }
      &::after {
        content: "";
        display: none;
        clear: both;
      }
    }
    .gird_name {
      padding-left: 20px;
    }
  }
  .grid_header {
    background: #fafafc;
    color: #333;
    padding: 12px 10px;
    white-space: nowrap;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    vertical-align: middle;
    font-size: 14px;
    font-weight: bold;
    border-bottom: 1px solid #ebeef5;
  }
  .grid_empty {
    width: 130%;
    height: 100%;
    border-bottom: 1px solid #ebeef5;
    p {
      line-height: 60px;
      width: 50%;
      color: #909399;
      margin: 0 auto;
      text-align: center;
    }
  }
  .grid_content {
    display: flex;
    padding: 12px 10px;
    border-bottom: 1px solid #ebeef5;
    height: 57px;
    .grid_icon {
      font-size: 20px;
      margin-top: 10px;
      cursor: pointer;
    }
  }
  .grid_header_operation {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
  }
  .grid_content_operation {
    position: absolute;
    left: 0;
    top: 0;
    height: 57px;
    width: 100px;
    padding: 12px 10px;
    border-bottom: 1px solid #ebeef5;
    background: #fff;
    overflow: hidden;
    z-index: 999;
    .add_btn {
      position: relative;
    }
    .add_btn::after {
      position: absolute;
      content: '';
      display: block;
      width: 1px;
      height: 16px;
      top: 8px;
      right: -7px;
      background: #E7E7EE;
    }
    .del_btn {
      color: #FE4758 ;
    }
    /deep/ .el-button {
      font-size: 13px;
    }
  }
  .operation_link {
    cursor: pointer;
    color: #358aff;
    font-size: 13px;
  }
  .more_unClick {
    pointer-events: none;
    color: #c0c4cc;
  }
}
</style>