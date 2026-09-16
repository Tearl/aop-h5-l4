<template>
  <div class="aop_workgate_comps_page_big_data">
    <div
      :ref="type == '' ? 'dataRef' : ''"
      class="big_data_wrapper "
      :class="{
        parentClass: type == '',
        show_scroll: paramsType == 'input',
      }"
    >
      <el-row v-if="type == ''" class="grid_no_re">
        <el-col :span="paramsType == 'input' ? 5 : 10"
          ><div class="grid_header">中文名称</div></el-col
        >
        <el-col :span="5" v-if="paramsType == 'input'"
          ><div class="grid_header">参数来源</div></el-col
        >
        <el-col :span="paramsType == 'input' ? 5 : 8"><div class="grid_header">是否必输</div></el-col>
        <el-col
          :span="!isRead?4:8"
          v-if="paramsType == 'input'"
          ><div class="grid_header">来源值</div></el-col
        >
        <el-col :span="3"><div class="grid_header" v-if="!isRead">操作</div></el-col>
        <!-- <div class="grid_header_operation" v-if="!isRead">
          <div class="grid_header">操作</div>
        </div> -->
      </el-row>
      <el-row v-if="data.length > 0" class="grid_no_re">
        <div class="grid_item" v-for="(item, index) in data" :key="index">
          <!-- 中文名称 -->
          <el-col :span="paramsType == 'input' ? 5 : 10"
            ><div
              class="grid_content gird_name"
              :style="{ paddingLeft: level * 40 + 'px' }"
            >
              <i
                v-if="item.children"
                class="grid_icon"
                :class="
                  item.showChild
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="handleChildShow(item)"
              ></i>
              <el-tooltip class="item" effect="dark" :content="item.paramCName" placement="top-start">
              <div class="grid_title">{{ item.paramCName }}</div>
            </el-tooltip>
            </div></el-col
          >
          <!-- 参数来源 -->
          <el-col :span="4" v-if="paramsType == 'input'"
            ><div class="grid_content">
              <el-select
                v-if="!isRead"
                v-model="item.apSource"
                size="small"
                @change="handleValueType(item)"
              >
                <el-option
                  v-for="i in selectVal"
                  :key="i.value"
                  :label="i.type"
                  :value="i.value"
                ></el-option>
              </el-select>
              <span v-else class="grid_title">{{ item.paraMapgNm }}</span>
            </div></el-col
          >
          <!-- 是否必输 -->
          <el-col :span="paramsType == 'input' ? 4 : 8"
            ><div class="grid_content">
              <template v-if="!isRead">
                <el-select
                  v-model="item.isNeed"
                  size="small"
                  v-if="paramsType == 'input'"
                >
                  <el-option
                    v-for="(nItem, nI) in isNeedList"
                    :value="nItem.value"
                    :key="nI"
                    :label="nItem.type"
                    >{{ nItem.type }}</el-option
                  >
                </el-select>
                <span v-else class="grid_title">{{ item.isNeed }}</span>
              </template>
              <template v-else>
                <span class="grid_title">{{ item.isNeed | paraNed }}</span>
              </template>
            </div></el-col
          >
          <!-- 来源值 -->
          <el-col :span="!isRead?5:8" v-if="paramsType == 'input'"
            ><div class="grid_content">
              <el-tooltip  v-if="!isRead" class="item" effect="dark" :content="item.apSource == '99'
                    ? item.paramValue
                    : item.paraMapgNm || '选择'" placement="top-start">
              <el-button
                type="text"
                class="apsource_style"
               
                @click="handleApSource(item)"
                >{{
                  item.apSource == "99"
                    ? item.paramValue
                    : item.paraMapgNm || "选择"
                }}</el-button
              >
            </el-tooltip>
            <el-tooltip v-else class="item" effect="dark" :content="item.paraMapgNm" placement="top-start">
              <span  class="grid_title">{{ item.paraMapgNm }}</span>
            </el-tooltip>
            </div></el-col
          >
          <!-- 操作 -->
          <el-col :span="4"
            ><div class="grid_content" v-if="!isRead">
              <el-button
                type="text"
                class="del_style"
                @click="handleApSource(item)"
                >删除</el-button
              >
            </div></el-col
          >
          <!-- <div
            v-if="!isRead"
            class="grid_content_operation"
            :style="{
              left: type == '' ? opereationLeft + 'px' : chilLeft + 'px',
            }"
          >
            <el-button type="text" size="small" @click="delParams(item)"
              >删除</el-button
            > -->
            <!-- <el-button
              type="text"
              size="small"
              @click="add(item)"
              :disabled="
                item.paramValueType !== 'List' &&
                item.paramValueType !== 'Object'
              "
              >增加</el-button
            >
            <el-dropdown>
              <span class="operation_link">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :disabled="
                    item.paramValueType !== 'List' &&
                    item.paramValueType !== 'Object'
                  "
                  @click.native="addByDic(item)"
                  >从数据字典添加</el-dropdown-item
                >
                <el-dropdown-item @click.native="del(item)"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown> -->
          <!-- </div> -->
          <PageBigData
            v-if="item.children && item.children.length > 0 && item.showChild"
            :data="item.children"
            type="child"
            :paramsType="paramsType"
            :isRead="isRead"
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
import filters from "@m/utils/filters";
export default {
  name: "PageBigData",
  components: {},
  props: {
    paramsType: {
      type: String,
      default: () => "input",
    },
    isRead: {
      type: Boolean,
      default: () => false,
    },
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
      default: () => "show_scroll",
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
      isNeedList: [
        { type: "否", value: "0" },
        { type: "是", value: "1" },
      ],
      opereationLeft: 0,

      rsObserver: "",
      isObserver: "",
      selectVal: [
        { type: "服务输入参数", value: "00" },
        { type: "服务输出参数", value: "10" },
        { type: "服务临时参数", value: "30" },
        { type: "组件输出参数", value: "20" },
      ],
    };
  },
  methods: {
    handleApSource(item) {
      console.log("item", item);
      this.$emit("operate", "choseParams", item);
    },
    delParams(item) {
      if (this.paramsType == "input") {
        this.$emit("operate", "deleteInputParam", item);
      } else {
        this.$emit("operate", "deleteOutputParam", item);
      }
    },
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
        console.log(1, this.opereationLeft);
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
      this.$emit("addParams", e);
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
      console.log(error);
    }
  },
  watch: {
    data(val) {},
    chilLeft(val) {},
  },
  filters: {
    ...filters,
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_workgate_comps_page_big_data {
  clear: both;
  position: relative;
  .show_scroll {
    // overflow-x: scroll;
  }
  .big_data_wrapper {
    // overflow-x: scroll;
    width: 100%;
    padding-right: 40px;
    border-bottom: 1px solid #ebeef5;
    @include scrollbar;
    .grid_no_re {
      position: static;
      width: calc(130%);
    }
    // &::after {
    //   content: "";
    //   position: absolute;
    //   width: 20px;
    //   top: 0;
    //   left: calc(100% - 100px);
    //   right: 0;
    //   bottom: 10px;
    //   box-shadow: -5px 2px 10px -5px rgba(0, 0, 0, 0.12);
    // }
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
  .del_style {
    color: #fe4758;
  }
  .apsource_style {
    overflow: hidden;
    white-space: nowrap;
    word-break: break-all;
    text-overflow: ellipsis;
    vertical-align: middle;
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
    z-index: 80;
  }
  .operation_link {
    cursor: pointer;
    color: #358aff;
    font-size: 12px;
  }
  .grid_title {
    font-size: 13px;
    line-height: 36px;
    overflow: hidden;
    white-space: nowrap;
    word-break: break-all;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
}
</style>