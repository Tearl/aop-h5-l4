<template>
  <div class="aop_workgate_comps_page_big_data">
    <div
      :ref="type == '' ? 'dataRef' : ''"
      class="big_data_wrapper"
      :class="type == '' ? parentClass : ''"
    >
      <el-row v-if="type == ''" class="grid_no_re">
        <el-col :span="paramsType == 'output' ? 3 : 4"><div class="grid_header">参数Key</div></el-col>
        <el-col :span="paramsType == 'output' ? 2 : 3"><div class="grid_header">参数名称</div></el-col>
        <el-col :span="2"><div class="grid_header">参数值类型</div></el-col>
        <el-col :span="2"><div class="grid_header">参数长度</div></el-col>
        <el-col :span="2" v-show="paramsType == 'output'"
          ><div class="grid_header">来源</div></el-col
        >
        <el-col :span="2" v-show="paramsType == 'output'"
          ><div class="grid_header">来源值</div></el-col
        >
        <el-col :span="2" v-show="paramsType == 'output'"><div class="grid_header">脱敏类型</div></el-col>
        <el-col :span="2"><div class="grid_header">是否必输</div></el-col>
        <el-col :span="2"><div class="grid_header">默认值</div></el-col>
        <el-col :span="paramsType == 'output' ? 2 : 3"
          ><div class="grid_header">参数描述</div></el-col
        >
        <el-col :span="paramsType == 'output' ? 2 : 6"
          ><div class="grid_header">枚举值</div></el-col
        >
        <div class="grid_header_operation">
          <div class="grid_header">操作</div>
        </div>
      </el-row>
      <el-row v-if="data.length > 0" class="grid_no_re">
        <div class="grid_item" v-for="(item, index) in data" :key="index">
          <!-- 参数Key -->
          <el-col :span="paramsType == 'output' ? 3 : 4"
            ><div
              class="grid_content gird_name"
              :style="{ paddingLeft: level * 20 + 'px' }"
            >
              <i
                v-if="item.children && item.children.length > 0"
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
                :disabled="item.disabled"
                maxlength="50"
                @blur="paramKeyBlur(item)"
              >
              </el-input></div
          ></el-col>
          <!-- 参数名称 -->
          <el-col :span="paramsType == 'output' ? 2 : 3"
            ><div class="grid_content">
              <el-input
                v-model="item.paramCName"
                size="small"
                clearable
                placeholder=""
                :disabled="item.disabled"
                maxlength="50"
              >
              </el-input></div
          ></el-col>
          <!-- 参数值类型 -->
          <el-col :span="2"
            ><div class="grid_content">
              <el-select
                v-model="item.paramValueType"
                size="small"
                @change="handleValueType(item)"
                :disabled="item.disabled"
              >
                <el-option
                  v-for="(nItem, nI) in item.typeList"
                  :value="nItem.value"
                  :key="nI"
                  :label="nItem.type"
                  >{{ nItem.type }}</el-option
                >
              </el-select>
            </div></el-col
          >
          <!-- 参数长度 -->
          <el-col :span="2"
            ><div class="grid_content">
              <el-input
                v-model="item.paramLength"
                size="small"
                clearable
                placeholder=""
                maxlength="10"
                :disabled="item.disabled || item.valueDisabled"
              >
              </el-input></div
          ></el-col>
          <!-- 来源 -->
          <el-col :span="2" v-show="paramsType == 'output'"
            ><div class="grid_content">
              <!-- <el-input
                readonly
                :suffix-icon="item.suffixIcon || 'el-icon-caret-bottom'"
                :style="item.inputStyle"
                :value="item.actionName"
                @input="(e) => item.input && item.input(e, scope)"
                @click.native="(e) => inputClick(item, e, 'actionId')"
                :disabled="item.disabled || item.sourceFlag"
                :size="item.size ? item.size : 'small'"
              ></el-input> -->
              
              <el-select
                v-model="item.actionId"
                size="small"
                :disabled="(item.disabled || item.sourceFlag) && pageType !== 'paramsSet'"
                @change="handleSelectChange('actionId', $event, item)"
                clearable
              >
                <el-option
                  v-for="(nItem, nI) in getSourceList(item)"
                  :value="nItem.value"
                  :key="nI"
                  :label="getOptionsName('actionName', nItem)"
                  ></el-option
                >
              </el-select>
              <!-- <el-select
                v-else
                v-model="item.actionName"
                size="small"
                disabled
              >
                <el-option
                  v-for="(nItem, nI) in sourceList"
                  :value="nItem.value"
                  :key="nI"
                  :label="nItem.label"
                  >{{ getOptionsName("actionName", nItem) }}</el-option
                >
              </el-select> -->
            </div></el-col
          >
          <!-- 来源值 -->
          <el-col :span="2" v-show="paramsType == 'output'"
            ><div class="grid_content">
              <!-- <el-button type="text" @click="chooseVal(item)">{{
                !sourceVal ? "选择" : sourceVal.paramCName
              }}</el-button> -->
              <!-- <el-input
                readonly
                :suffix-icon="item.suffixIcon || 'el-icon-caret-bottom'"
                :style="item.inputStyle"
                :value="item.paraMapgNm"
                @input="(e) => item.input && item.input(e, scope)"
                @click.native="(e) => inputClick(item, e, 'paraMapgNm')"
                :disabled="item.disabled || item.sourceFlag"
                :size="item.size ? item.size : 'small'"
              ></el-input> -->
              <el-input
                v-if="item.actionId == 'constantValue'"
                v-model="item.paramMappingKey"
                size="small"
                :disabled="getRowDisabled('paraMapgNm', item)"
                clearable
                placeholder="请输入"
                maxlength="200"
              ></el-input>
              <el-select
                v-else
                class="tree_select_container"
                popper-class="aop_h5_l4_comps_page_big_data_tree_select_container"
                :ref="`${item.paramDirection}-${item.paramOrder}`"
                v-model="item.paraMapgNm"
                size="small"
                :disabled="getRowDisabled('paraMapgNm', item)"
                @change="handleSelectChange('paraMapgNm', $event, item)"
                @focus="handleSelectFocus(item)"
                clearable
              >
                <!-- <el-option
                  v-for="nItem in getSourceValueList(item)"
                  :value="nItem.value"
                  :key="nItem"
                  :label="nItem.label"
                  >
                </el-option> -->
                <div class="search_area">
                  <el-input
                    v-model="formData.paramCName"
                    placeholder="请输入参数名"
                    size="small"
                    clearable
                    @input="handleInput(item, $event)"
                  ></el-input>
                </div>
                <el-option class="select_tree_option" disabled>
                  <el-tree
                    ref="paramCNameTreeRef"
                    :highlight-current="true"
                    :data="getParamCNameTree(item)"
                    :props="defaultProps"
                    :default-expanded-keys="defaultExpanded"
                    :current-node-key="currentKey"
                    :load="loadNode"
                    lazy
                    node-key="paramOrder"
                    :expand-on-click-node="false"
                  >
                    <div class="custom_tree_node" slot-scope="{ node, data }">
                      <div
                        :class="data.disabled ? 'disabled' : ''"
                        @click.stop="handleNodeClick(item, data, node, 'paramCName')"
                      >
                        {{ data.paramCName }}
                      </div>
                    </div>
                  </el-tree>
                </el-option>
              </el-select>
            </div></el-col
          >
          <!-- 是否脱敏 -->
          <el-col :span="2" v-show="paramsType == 'output'"
            ><div class="grid_content">
              <el-select
                v-model="item.desensitizationType"
                size="small"
                :disabled="item.disabled"
              >
                <el-option
                  v-for="(nItem, nI) in isFilterList"
                  :value="nItem.value"
                  :key="nI"
                  :label="nItem.type"
                  >{{ nItem.type }}</el-option
                >
              </el-select>
            </div></el-col
          >
          <!-- 是否必输 -->
          <el-col :span="2"
            ><div class="grid_content">
              <el-select
                v-model="item.isNeed"
                size="small"
                :disabled="item.disabled"
              >
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
          <!-- 默认值 -->
          <el-col :span="2"
            ><div class="grid_content">
              <el-input
                v-model="item.paramValue"
                size="small"
                clearable
                placeholder=""
                :disabled="item.disabled"
                maxlength="500"
              >
              </el-input></div
          ></el-col>

          <!-- 参数描述 -->
          <el-col :span="paramsType == 'output' ? 2 : 3"
            ><div class="grid_content">
              <el-input
                v-model="item.paramDesc"
                size="small"
                clearable
                placeholder=""
                :disabled="item.disabled"
                maxlength="500"
              >
              </el-input></div
          ></el-col>
          <!-- 枚举值 -->
          <el-col :span="paramsType == 'output' ? 2 : 6"
            ><div class="grid_content">
              <el-input
                v-model="item.apEnum"
                size="small"
                clearable
                placeholder=""
                :disabled="item.disabled"
                maxlength="500"
              >
              </el-input></div
          ></el-col>
          <div
            class="grid_content_operation"
            :style="{
              left: type == '' ? opereationLeft + 'px' : chilLeft + 'px',
            }"
          >
            <el-button
              type="text"
              size="small"
              class="add_btn"
              @click="add(item)"
              v-show="
                item.paramValueType == 'List' || item.paramValueType == 'Object'
              "
              :disabled="
                (item.disabled &&
                  item.paramPosition != '0') ||
                item.childTier >= 4
              "
              >添加</el-button
            >

            <el-button
              type="text"
              size="small"
              v-show="
                item.paramValueType != 'List' && item.paramValueType != 'Object'
              "
              :class="item.disabled ? '' : 'del_btn'"
              @click.native="del(item)"
              :disabled="item.disabled"
              >删除</el-button
            >
            <el-dropdown
              v-show="
                item.paramValueType == 'List' || item.paramValueType == 'Object'
              "
            >
              <span
                class="operation_link"
                :class="
                  item.disabled &&
                  item.paramPosition != '0' 
                    ? 'more_unClick'
                    : ''
                "
              >
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :disabled="
                    item.paramValueType !== 'List' &&
                    item.paramValueType !== 'Object'
                  "
                  @click.native="addByDic(item)"
                  >从服务添加</el-dropdown-item
                >
                <el-dropdown-item
                  :disabled="getRowDisabled('deleteSubParams', item)"
                  @click.native="deleteSubParams(item)"
                  >清空子参数</el-dropdown-item
                >
                <el-dropdown-item
                  @click.native="del(item)"
                  class="del_style"
                  :disabled="item.disabled"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <PageBigData
            v-if="item.children && item.children.length > 0 && item.showChild"
            :pageType="pageType"
            :data="item.children"
            :paramsType="paramsType"
            type="child"
            :level="level + 1"
            class="grid_child"
            :chilLeft="type == '' ? opereationLeft : chilLeft"
            :sourceList="sourceList"
            :compositeIdMapToParamList="compositeIdMapToParamList"
            :detailInfo="detailInfo"
            v-bind="$attrs"
            :isFilterList="isFilterList"
            @add="add"
            @del="del"
            @addByDic="addByDic"
            @paramKeyBlur="paramKeyBlur"
            @setLengthDisabled="setLengthDisabled"
            @inputClick="inputClick"
            @updateCompositeIdMapToParamList="updateCompositeIdMapToParamList"
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
import { packageParamKey, getParamParent, mixList, reList, getRelativeParamList } from "@m/utils/paramTree";
import { sourceActionType, actionTypeToApSource } from "@m/utils/normalData";
import { unduplicated } from "@m/utils/array";

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
    paramsType: {
      type: String,
      default: () => "input",
    },
    sourceList: {
      type: Array,
      default: () => [],
    },
    bodyData: {
      type: Array,
      default: () => [],
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
    detailInfo: {
      type: Object,
      default: () => ({})
    },
    compositeIdMapToParamList: {
      type: Object,
      default: () => ({})
    },
    pageType: {
      type: String,
      default: () => "",
    },
    isFilterList:{
      type: Object,
      default: () =>([])
    }
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
      speciTypeList: [
        { type: "List", value: "List" },
        { type: "Object", value: "Object" },
      ],
      sourceValList: [],
      defaultProps: {
        label: "label",
        children: "children",
        isLeaf: "leaf",
      },
      defaultExpanded: [], // 树形展示序号组,
      currentKey: "",
      resolve: "",
      formData: {
        paramCName: "", // 参数中文名
      }
    };
  },
  inject: ["updateCompositeIdMapToParamList"],
  methods: {
    handleChildShow(e) {
      console.log(e);
      e.showChild = !e.showChild;
      this.$forceUpdate();
    },
    handleValueType(e) {
      e.actionId = e.actionName = e.apSource = e.paramMappingKey = e.paraMapgNm = ""
      e.paramType = e.paramValueType
      if (e.paramValueType !== "List" || e.paramValueType !== "Object") {
        e.children = [];
        delete e.children;
        delete e.showChild;
      }
      if (
        e.paramKey &&
        (e.paramValueType == "List" || e.paramValueType == "Object")
      ) {
        this.$emit("paramKeyBlur", e);
      }
      this.setLengthDisabled(e)
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
      this.$emit("add", e);
      this.$forceUpdate();
    },
    del(e) {
      this.$emit("del", e);
      this.$forceUpdate();
    },
    addByDic(e) {
      this.$emit("addByDic", e);
    },
    paramKeyBlur(e) {
      this.$emit("paramKeyBlur", e);
    },
    setLengthDisabled(e) {
      this.$emit("setLengthDisabled", e);
    },
    chooseVal(e) {
      this.$emit("chooseVal", e);
    },
    focusChange(e) {
      // if(!e.sourceValList) {
      // }
      this.$emit("focusChange", e);
    },
    selectChange(e, data) {
      data.paramMappingKey = e.value;
      data.paraMapgNm = e.type;
    },
    sourceChange(e, data) {
      data.actionId = e.value;
      data.actionName = e.label;
      if (data.actionId == this.detailInfo?.apiId) {
        data.apSource = "00";
      } else {
        data.apSource = "20";
      }
      this.$set(data, "paraMapgNm", "");
      this.$emit("sourceChange", e, data);
    },
    inputClick(scope, e, type) {
      this.$emit("inputClick", scope, e, type);
    },
    async handleSelectChange(key, e, row) {
      if (key == "actionId") {
        if (!e) {
          row.paraMapgNm = row.paramMappingKey = row.actionId = row.actionName = row.apSource = ""
        } else if (e == "system") {
          const { puApiParams } = this.detailInfo
          row.paraMapgNm = row.paramCName
          row.paramMappingKey = packageParamKey(row, puApiParams)
          const item = this.getSourceList(row).find(item => item.value == e)
          row.actionId = item?.value || e
          row.actionName = item?.label
          row.apSource = actionTypeToApSource[item?.actionType]
        } else if (e == "constantValue") {
          row.paraMapgNm = row.paramMappingKey = ""
          row.actionId = e
          row.actionName = "固定值"
          row.apSource = actionTypeToApSource[e]
        } else {
          const transId = this.detailInfo?.apiId
          row.paraMapgNm = row.paramMappingKey =""
          const item = this.getSourceList(row).find(item => item.value == e)
          row.actionId = item?.value || e
          row.actionName = item?.label
          // row.apSource = e == transId ? "00" : "20"
          if (e == transId) {
            row.apSource = "00"
          } else {
            row.apSource = actionTypeToApSource[item?.actionType]
          }
          await this.updateCompositeIdMapToParamList(row)
        }
      } else if (key == "paraMapgNm") {
        const options = this.getSourceValueList(row)
        const item = options.find(item => item.value == e)
        row.paramMappingKey = item?.value || e
        row.paraMapgNm = item?.label
      }
      this.$forceUpdate()
    },
    async handleSelectFocus(row) {
      // console.log("handleSelectFocus", row)
      const compositeId = row.actionId
      const item = this.compositeIdMapToParamList[compositeId]
      if (compositeId && item && !(item?.paramList?.length)) {
        const selectDom = this.$refs[`${row.paramDirection}-${row.paramOrder}`][0]
        selectDom.visible = false
        await this.updateCompositeIdMapToParamList(row)
        selectDom.visible = true
      }
      let paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[row.actionId]?.paramList || []))
      const paramParent = getParamParent(row, paramList)
      const paramCNameTree = this.getParamCNameTree(row)
      if (paramParent) {
        if (["bodyData", "bodyOutData"].includes(paramParent.paramKey)) {
          // 默认展开body
          // console.log("默认展开body")
          const items = paramCNameTree.filter(param => !param.paramParentId && (["bodyOutData"].includes(param.paramKey) || param.paramKey == paramParent.paramKey))
          if (items?.length) {
            this.defaultExpanded = items.map(item => item.paramOrder)
          }
        } else {
          // 默认展开报文头
          // console.log("默认展开报文头")
          const items = paramCNameTree.filter(param => !param.paramParentId && (["resHeaderData"].includes(param.paramKey) || param.paramKey == paramParent.paramKey))
          if (items?.length) {
            this.defaultExpanded = items.map(item => item.paramOrder)
          }
        }
      }
    },
    getSourceList(row) {
      let list = [
        { label: "平台系统", svcId: "", value: "system",  actionSeq: "", actionType: "system" },
        { label: "固定值", svcId: "", value: "constantValue",  actionSeq: "", actionType: "constantValue" },
      ]
      if (!row.disabled) {
        list = list.filter(item => item.label != "平台系统")
      }
      if (["List", "Object"].includes(row.paramType)) {
        list = list.filter(item => item.label != "固定值")
      }
      return list.concat(this.sourceList)
    },
    getSourceValueList(row) {
      const compositeId = row.actionId
      let paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[compositeId]?.paramList || []))
      const paramDirection = row.apSource == "00" ? "0" : "1"
      const paramParent = getParamParent(row, paramList)
      const paramType = row.paramType
      if (!["50", "60"].includes(row.apSource)) {
        // 来源不是设置会话组件和获取会话组件时，需要根据来源类型筛选输入或者输出参数
        paramList = paramList.filter(param => param.paramDirection == paramDirection)
      }
      return this.filterParamListByRowParamType(paramList, row).map(param => {
        param.label = param.paramCName
        param.value = packageParamKey(param, paramList)
        return param
      })
      // if (paramParent?.paramKey == "bodyOutData" && row?.paramParentId) {
      //   const bodyDataKey = row.apSource == "00" ? "bodyData" : "bodyOutData"
      //   return paramList.filter(param => {
      //     if (["List", "Object"].includes(paramType)) {
      //       return param.paramDirection == paramDirection && param.paramParentId && getParamParent(param, paramList)?.paramKey == bodyDataKey && param.paramType == paramType
      //     } else {
      //       return param.paramDirection == paramDirection && param.paramParentId && getParamParent(param, paramList)?.paramKey == bodyDataKey
      //     }
      //   }).map(param => {
      //     param.label = param.paramCName
      //     param.value = packageParamKey(param, paramList)
      //     return param
      //   })
      // } else {
      //   return paramList.filter(param => param.paramDirection == paramDirection).map(param => {
      //     param.label = param.paramCName
      //     param.value = packageParamKey(param, paramList)
      //     return param
      //   })
      // }
    },
    getRowDisabled(key, row) {
      if (key == "paraMapgNm") {
        return ((row.disabled || row.sourceFlag) && this.pageType !== 'paramsSet') || row.actionId == "system"
      } else if (key == "deleteSubParams") {
        return !row?.children?.length
      }
    },
    filterParamListByRowParamType(paramList, row) {
      // console.log("filterParamListByRowParamType", paramList, row, row.paramType)
      const { paramType } = row
      if (["List", "Object", "Date"].includes(paramType)) {
        return paramList.filter(param => param.paramType == paramType)
      } else if (paramType == "String") {
        return paramList.filter(param => !["List", "Object"].includes(param.paramType))
      } else {
        return paramList
      }
    },
    getOptionsName(key, item) {
      if (key == "actionName") {
        return !item.actionSeq ? item.label : `${item.label}(${item.actionSeq})`
      }
    },
    getParamCNameTree(row) {
      // console.log("getParamCNameTree", row)
      const compositeId = row.actionId
      let paramList = JSON.parse(JSON.stringify(this.compositeIdMapToParamList[compositeId]?.paramList || []))
      const paramDirection = row.apSource == "00" ? "0" : "1"
      if (!["50", "60"].includes(row.apSource)) {
        // 来源不是设置会话组件和获取会话组件时，需要根据来源类型筛选输入或者输出参数
        paramList = paramList.filter(param => param.paramDirection == paramDirection)
      }
      this.setParamListDisabledByRowParamType(paramList, row)
      let paramListWithFilter = paramList.map((param) => {
        param.label = param.paramCName
        param.value = packageParamKey(param, paramList)
        param.leaf = !(param?.children?.length > 0);
        return param
      }).filter(param => param.paramCName.includes(this.formData.paramCName))
      paramListWithFilter = unduplicated(getRelativeParamList(paramListWithFilter, paramList), "paramOrder")
      return reList(paramListWithFilter)
    },
    setParamListDisabledByRowParamType(paramList, row) {
      const { paramType } = row
      if (["List", "Object", "Date"].includes(paramType)) {
        paramList.forEach(param => {
          param.children = paramList.filter(_param => _param.paramParentId == param.paramOrder)
          param.disabled = param.paramType != paramType
        })
      } else {
        paramList.forEach(param => {
          param.children = paramList.filter(_param => _param.paramParentId == param.paramOrder)
          param.disabled = ["List", "Object"].includes(param.paramType)
        })
      }
    },
    //获取子级
    async loadNode(node, resolve) {
      // console.log("loadNode", node);
      this.resolve = resolve;
      if (node.level === 0) {
        return resolve(node.data);
      }
      if (node.level >= 1) {
        return resolve(node.data.children);
      }
    },
    handleNodeClick(row, data, node, type) {
      // console.log("handleNodeClick", row, data, node, type);
      if (node.data?.disabled) return
      if (type == "paramCName") {
        this.currentKey = data.paramOrder;
        row.paramMappingKey = data?.value
        row.paraMapgNm = data?.label
        if (["List", "Object"].includes(row?.paramType) && row.children?.length) {
          const sourceOption = this.getSourceList(row).find(item => item.value == row.actionId)
          this.setSubParamsSourceAndSourceValue(row, data, sourceOption)
        }
        const selectDom = this.$refs[`${row.paramDirection}-${row.paramOrder}`][0]
        selectDom?.blur()
      }
    },
    setSubParamsSourceAndSourceValue(row, data, sourceOption) {
      row.children.forEach((param) => {
        const item = data?.children?.find(child => child.paramKey == param.paramKey && child.paramCName == param.paramCName)
        if (item) {
          // 能从来源值的子参数中匹配到同名的参数
          param.actionId = sourceOption?.value
          param.actionName = sourceOption?.label
          param.apSource = actionTypeToApSource[sourceOption?.actionType]
          param.paramMappingKey = item?.value
          param.paraMapgNm = item?.label
          if (["List", "Object"].includes(param?.paramType) && param.children?.length) {
            this.setSubParamsSourceAndSourceValue(param, item, sourceOption)
          }
        }
      })
    },
    handleInput(row, e) {
      const paramCNameTree = this.getParamCNameTree(row)
      this.defaultExpanded = this.getDefaultExpanded(paramCNameTree)
    },
    getDefaultExpanded(list) {
      return list.reduce((prev, item) => {
        if (["List", "Object"].includes(item.paramType)) {
          prev.push(item.paramOrder)
          if (item.children?.length) {
            prev.push(...this.getDefaultExpanded(item.children))
            return prev
          }
        }
        return prev
      }, [])
    },
    deleteSubParams(item) {
      item.children = []
      this.$forceUpdate()
    }
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
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
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
      width: calc(130%);
    }
    &::after {
      content: "";
      position: absolute;
      width: 20px;
      top: 0;
      left: calc(100% - 100px);
      right: 0;
      bottom: 10px;
      box-shadow: -5px 2px 10px -5px rgba(0, 0, 0, 0.12);
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
    padding: 4px 10px;
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
      content: "";
      display: block;
      width: 1px;
      height: 16px;
      top: 8px;
      right: -3px;
      background: #e7e7ee;
    }
    .del_btn {
      color: #fe4758;
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
  .del_style {
    color: red;
  }
}
</style>

<style lang="scss">
.aop_h5_l4_comps_page_big_data_tree_select_container {
  .select_tree_option {
    min-width: 150px !important;
    min-height: 200px !important;
    padding: 0 !important;
    margin: 0;
    overflow: auto;
    cursor: default !important;
    .custom_tree_node {
      position: relative;
      width: 100%;
      .disabled {
        color: #ccc;
      }
    }
  }
  .el-scrollbar {
    .el-scrollbar__bar {
      &.is-vertical {
        display: none;
      }
    }
  }
  .search_area {
    padding: 0 10px 8px;
  }
}
</style>
