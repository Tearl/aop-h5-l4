<!--
 * 数据字典-数据字段管理-新增字段
 -->
<template>
  <div>
    <el-drawer
      class="aop-com-drawer"
      :title="drawerTitle"
      :size="800"
      :visible.sync="drawerShow"
      :wrapperClosable="false"
    >
      <div class="info-content">
        <div
          v-loading="isLoading"
          class="drawer-main-content info-form-content"
        >
          <!-- 内容 -->
          <div class="aop-com-info-form-wrap">
            <!-- 模块信息表单 -->
            <el-form
              ref="infoForm"
              :model="formData"
              :rules="formRules"
              label-position="top"
              :inline="false"
              size="small"
              @submit.native.prevent
            >
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="字段名称：" prop="fieldName">
                    <el-input
                      class="input-primary-btn"
                      v-model="formData.fieldName"
                      placeholder="请输入字段名称"
                      :disabled="action != 'addField'"
                      :maxlength="20"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="字段简称：" prop="fieldKeyName">
                    <el-input
                      v-model="formData.fieldKeyName"
                      placeholder="请输入字段简称"
                      :maxlength="20"
                      :disabled="true"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="字段全称：" prop="fieldFullName">
                    <el-input
                      v-model="formData.fieldFullName"
                      placeholder="请输入字段全称"
                      :maxlength="20"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="别名：" prop="fieldAlias">
                    <el-input
                      v-model="formData.fieldAlias"
                      placeholder="请输入别名"
                      :maxlength="20"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="字段定义：" prop="fieldBusiness">
                    <dataFormatTip type="define" class="label-info" />
                    <el-input
                      v-model="formData.fieldBusiness"
                      type="textarea"
                      :rows="3"
                      resize="none"
                      placeholder="请输入字段定义"
                      :maxlength="200"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="字段规则：" prop="fieldRule">
                    <dataFormatTip type="rule" class="label-info" />
                    <el-input
                      v-model="formData.fieldRule"
                      type="textarea"
                      :rows="3"
                      resize="none"
                      placeholder="请输入字段规则"
                      :maxlength="200"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="主题分类：" prop="standards">
                    <el-cascader
                      placeholder="请选择"
                      v-model="formData.standards"
                      :options="preNodeProps"
                      clearable
                      :props="{
                        lazy: true,
                        lazyLoad,
                        checkStrictly: true,
                        emitPath: true,
                      }"
                    ></el-cascader>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="点击去分类管理"
                      placement="top-start"
                    >
                      <img
                        @click="gotoStandards"
                        width="16px"
                        height="16px"
                        :src="require('@m/assets/images/icon_setting.png')"
                        class="theme-class"
                        alt=""
                      />
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="字段类型：" prop="fieldType">
                    <el-select
                      v-model="formData.fieldType"
                      placeholder="请选择字段类型"
                      @change="changeFieldType"
                      clearable
                    >
                      <el-option
                        :label="item.label"
                        :value="item.value"
                        v-for="item in fieldTypeOption"
                        :key="item.label"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 只能输入数字和英文逗号 -->
                <el-col :span="12">
                  <el-form-item label="字段长度：" prop="fieldLength">
                    <el-input
                      v-model="formData.fieldLength"
                      placeholder="请输入字段长度"
                      :maxlength="20"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label="数据格式："
                    prop="dataFormatType"
                    v-if="!!formData.fieldType && mapFormatList.length"
                  >
                    <el-select
                      v-model="formData.dataFormatType"
                      @change="changeDataFormatType"
                      placeholder="请选择数据格式"
                      clearable
                    >
                      <el-option
                        v-for="(item, i) in mapFormatList"
                        :key="i"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    v-if="mapPercent.includes(formData.dataFormatType)"
                    label="数据精度："
                    prop="fieldScale"
                  >
                    <el-input
                      v-model="formData.fieldScale"
                      placeholder="请输入数值,用于小数点保留位数"
                      :maxlength="20"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="长度限制："
                    prop="fieldLengthLimitType"
                    v-if="!mapLongLimit.includes(formData.dataFormatType)"
                  >
                    <el-select
                      v-model="formData.fieldLengthLimitType"
                      placeholder="请选择长度限制"
                      @change="changeLength"
                    >
                      <el-option
                        v-for="(item, i) in longList"
                        :key="i"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="最小长度："
                    prop="fieldLengthMin"
                    v-if="
                      !mapLongLimit.includes(formData.dataFormatType) &&
                      !!formData.fieldLengthLimitType &&
                      formData.fieldLengthLimitType != '00' &&
                      formData.fieldLengthLimitType != '02'
                    "
                  >
                    <el-input
                      v-model="formData.fieldLengthMin"
                      placeholder="请输入最小长度"
                      :maxlength="20"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="最大长度："
                    prop="fieldLengthMax"
                    v-if="
                      !mapLongLimit.includes(formData.dataFormatType) &&
                      !!formData.fieldLengthLimitType &&
                      formData.fieldLengthLimitType != '00' &&
                      formData.fieldLengthLimitType != '01'
                    "
                  >
                    <el-input
                      v-model="formData.fieldLengthMax"
                      placeholder="请输入最大长度，不超过字段长度"
                      :maxlength="20"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="取值范围："
                    prop="valueRange"
                    v-if="mapValueRange.includes(formData.dataFormatType)"
                  >
                    <el-input
                      v-model="formData.valueRange"
                      placeholder="请输入取值范围，例[0,99]"
                      :maxlength="20"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                  <el-form-item label="主数据系统：" prop="masterDataSystem">
                    <el-select
                      v-model="formData.masterDataSystem"
                      filterable
                      placeholder="请选择主数据系统"
                      clearable
                    >
                      <el-option
                        v-for="(item, i) in relationSystemList"
                        :key="i"
                        :label="item.standardSystemName"
                        :value="item.standardSystemCode"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <el-col :span="24">
                  <el-form-item label="代码编码规则：" prop="codeRule">
                    <el-input
                      type="textarea"
                      v-model="formData.codeRule"
                      placeholder="请输入代码编码规则"
                      :maxlength="20"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

            <!-- 枚举定义 -->
            <h3 class="required-title">枚举定义:</h3>
            <div class="padding-b-12">
              <el-button
                @click="handleEnumChose"
                class="com-plain-primary-btn"
                icon="el-icon-plus"
                type="default"
                size="small"
                >选择枚举值</el-button
              >
              <el-button
                @click="handleEnumAdd"
                class="com-plain-primary-btn"
                icon="el-icon-plus"
                type="default"
                size="small"
                >新增枚举值</el-button
              >
            </div>
            <div class="aop_common_page_table">
              <el-table :data="tableData">
                <el-table-column prop="enumLabel" label="枚举标签">
                  <template slot-scope="scope">{{
                    scope.row.enumLabel || "/"
                  }}</template>
                </el-table-column>
                <el-table-column
                  prop="enumValue"
                  label="枚举值"
                ></el-table-column>
                <el-table-column prop="enumKey" label="枚举key">
                  <template slot-scope="scope">{{
                    scope.row.enumKey || "/"
                  }}</template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <!-- 底部操作按钮 -->
        <div class="info-bottom-handle">
          <el-button type="default" plain size="medium" @click="handleClose">
            取消
          </el-button>
          <el-button
            class="ml24"
            type="primary"
            size="medium"
            @click="handleConfirm"
          >
            保存
          </el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 新增/修改枚举值 -->
    <handleEnum ref="handleEnum" @enumConfirm="enumConfirm" />
    <enumChose ref="enumChose" @changeEnumList="changeEnumList" />
    <!-- 分析字段 -->
    <analysisField ref="analysisField" @analysisConfirm="analysisConfirm" />
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import { fieldTypeOption } from "@m/utils/commonData";
import handleEnum from "./handleEnum.vue";
import enumChose from "./enumChose.vue";
import analysisField from "./analysisField.vue";
import dataFormatTip from "./dataFormatTip.vue";
export default {
  mixins: [mixin],
  components: { handleEnum, analysisField, dataFormatTip, enumChose },
  props: {
    currentType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      preNodeProps: [],
      isLoading: false,
      drawerShow: false, // 弹窗是否显示
      drawerTitle: "新增字段", // 抽屉名称
      action: "reviewField", // addField/reviewField/editField
      // 表单数据
      formData: {
        fieldName: "",
        fieldKeyName: "",
        fieldFullName: "",
        fieldAlias: "",
        fieldBusiness: "",
        fieldRule: "",
        fieldType: "",
        fieldLength: "10",
        standards: [],
        dataFormatType: "",
        fieldScale: "2",
        fieldLengthLimitType: "00",
        codeRule: "",
        valueRange: "",
        fieldLengthMin: "5",
        fieldLengthMax: "10",
        masterDataSystem: "",
        topicCode: "",
        categoryId: "",
      },
      longList: [
        {
          label: "固定长度",
          value: "00",
        },
        {
          label: "最小长度",
          value: "01",
        },
        {
          label: "最大长度",
          value: "02",
        },
        {
          label: "最小长度-最大长度",
          value: "03",
        },
      ],
      formatList: [
        {
          label: "字母",
          value: "a",
        },
        {
          label: "数字",
          value: "n",
        },
        {
          label: "汉字",
          value: "c",
        },
        {
          label: "字母+数字",
          value: "an",
        },
        {
          label: "字母+汉字",
          value: "ac",
        },
        {
          label: "数字+汉字",
          value: "nc",
        },
        {
          label: "字母+数字+汉字",
          value: "anc",
        },
        {
          label: "日期",
          value: "d",
        },
        {
          label: "时间",
          value: "t",
        },
        {
          label: "日期时间",
          value: "dt",
        },
        {
          label: "金额",
          value: "m",
        },
        {
          label: "百分比",
          value: "p",
        },
      ],
      // 表单规则
      formRules: {
        fieldName: [
          {
            required: true,
            message: "请输入字段名称",
            trigger: "blur",
          },
        ],
        valueRange: [
          {
            required: false,
            message: "请输入取值范围，例[0,99]",
            trigger: "blur",
          },
          {
            pattern: /\b([0-9]|[1-9][0-9])\b/,
            message: "请输入取值范围，例[0,99]",
            trigger: "blur",
          },
        ],
        fieldKeyName: [
          {
            required: true,
            message: "请输入字段简称",
            trigger: "blur",
          },
        ],
        fieldFullName: [
          {
            required: true,
            message: "请输入字段全称",
            trigger: "blur",
          },
        ],
        fieldBusiness: [
          {
            required: true,
            message: "请输入字段定义",
            trigger: "blur",
          },
        ],
        fieldType: [
          {
            required: true,
            message: "请选择字段类型",
            trigger: "change",
          },
        ],
        fieldLength: [
          {
            required: true,
            message: "请输入字段长度",
            trigger: "blur",
          },
        ],
        standards: [
          {
            required: true,
            message: "请选择主题分类",
            trigger: "change",
          },
        ],
        dataFormatType: [
          {
            required: true,
            message: "请选择数据格式",
            trigger: "change",
          },
        ],
        fieldLengthLimitType: [
          {
            required: true,
            message: "请选择长度限制",
            trigger: "change",
          },
        ],
        fieldLengthMin: [
          {
            required: true,
            message: "请输入最小长度",
            trigger: "blur",
          },
        ],
        fieldLengthMax: [
          {
            required: true,
            message: "请输入最大长度",
            trigger: "blur",
          },
        ],
      },
      fieldTypeOption: [],
      tableData: [],
      editIndex: -1,
      initData: {},
      enumCode: "",
      mapFormatType: {
        String: [
          {
            label: "字母",
            value: "a",
          },
          {
            label: "数字",
            value: "n",
          },
          {
            label: "汉字",
            value: "c",
          },
          {
            label: "字母+数字",
            value: "an",
          },
          {
            label: "字母+汉字",
            value: "ac",
          },
          {
            label: "数字+汉字",
            value: "nc",
          },
          {
            label: "字母+数字+汉字",
            value: "anc",
          },
        ],
        Short: [
          {
            label: "数字",
            value: "n",
          },
        ],
        Integer: [
          {
            label: "数字",
            value: "n",
          },
        ],
        Long: [
          {
            label: "数字",
            value: "n",
          },
        ],
        Float: [
          {
            label: "数字",
            value: "n",
          },
        ],
        Double: [
          {
            label: "数字",
            value: "n",
          },
        ],
        BigDecimal: [
          {
            label: "数字",
            value: "n",
          },
          {
            label: "金额",
            value: "m",
          },
          {
            label: "百分比",
            value: "p",
          },
        ],
        Byte: [],
        Character: [
          {
            label: "字母",
            value: "a",
          },
          {
            label: "数字",
            value: "n",
          },
          {
            label: "汉字",
            value: "c",
          },
        ],
        File: [],
        Date: [
          {
            label: "日期时间",
            value: "dt",
          },
        ],
        LocalDate: [
          {
            label: "日期",
            value: "d",
          },
        ],
        LocalTime: [
          {
            label: "时间",
            value: "t",
          },
        ],
        LocalDateTime: [
          {
            label: "日期时间",
            value: "dt",
          },
        ],
      },
      mapPercent: ["n", "m", "p"],
      mapValueRange: ["n", "d", "t", "dt", "m", "p"],
      mapLongLimit: ["d", "t", "dt", "m", "p"],
      relationSystemList: [],
      isEdit: false,
    };
  },
  inject: ["openTab"], // 用于打开窗口
  created() {},
  computed: {
    mapFormatList() {
      return this.mapFormatType[this.formData.fieldType];
    },
  },
  methods: {
    gotoStandards() {
      let urlParam = this.$router.resolve({
        path: "/aop_tradedesign/datadict/sortlist",
        query: {},
      });
      window.open(urlParam.href, "_blank");
    },
    changeFieldType() {
      if (this.formData.fieldType == "LocalTime") {
        this.formData.dataFormatType = "t";
      } else if (this.formData.fieldType == "LocalDate") {
        this.formData.dataFormatType = "d";
      } else if (
        this.formData.fieldType == "LocalDateTime" ||
        this.formData.fieldType == "Date"
      ) {
        this.formData.dataFormatType = "dt";
      } else if (
        this.formData.fieldType == "Short" ||
        this.formData.fieldType == "Integer" ||
        this.formData.fieldType == "Long" ||
        this.formData.fieldType == "Float" ||
        this.formData.fieldType == "Double"
      ) {
        this.formData.dataFormatType = "n";
      } else {
        this.formData.dataFormatType = "";
      }
    },
    changeLength() {
      if (this.formData.fieldLengthLimitType == "00") {
        this.formData.fieldLengthMin = "";
        this.formData.fieldLengthMax = "";
      } else if (this.formData.fieldLengthLimitType == "01") {
        this.formData.fieldLengthMin = "";
        this.formData.fieldLengthMax = "";
      } else if (this.formData.fieldLengthLimitType == "02") {
        this.formData.fieldLengthMin = "";
        this.formData.fieldLengthMax = this.formData.fieldLength;
      } else if (this.formData.fieldLengthLimitType == "03") {
        this.formData.fieldLengthMin = "";
        this.formData.fieldLengthMax = this.formData.fieldLength;
      }
    },
    changeDataFormatType(val) {
      if (val == "p") {
        this.formData.fieldLength = "6";
      } else {
        this.formData.fieldLength = "10";
      }
      this.formData.fieldScale = "2";
      this.formData.fieldLengthLimitType = "00";
      this.formData.fieldLengthMin = "5";
      this.formData.fieldLengthMax = "10";
      this.formData.valueRange = "";
    },
    // 打开抽屉
    async openDrawer(data) {
      this.queryAllStandardSystemList();
      Object.assign(this.$data, this.$options.data());
      this.fieldTypeOption = fieldTypeOption;
      this.action = data.action || "reviewField";
      this.drawerTitle = data.drawerTitle || "新增字段";
      this.initData = data || {};
      if (this.action == "editField") {
        this.isEdit = true;
      }
      if (this.action === "addField") {
        this.$nextTick(() => {
          this.$refs.analysisField.openDrawer({
            analysisFirst: true,
            fieldId: data.fieldId,
          });
        });

        return false;
      }
      // 数据回显
      for (key in this.formData) {
        this.formData[key] = data[key] || "";
      }
      await this.getDictTopic();

      if (!this.formData.topicCode) {
        this.$set(this.formData, "standards", []);
      } else if (!this.formData.categoryId) {
        this.$set(this.formData, "standards", [this.formData.topicCode]);
      } else {
        let tempArr = this.formData.categoryId.split("#");
        this.$set(this.formData, "standards", [
          this.formData.topicCode,
          ...tempArr,
        ]);
      }

      this.tableData = data.dataDictionaryEnumLists || [];
      this.drawerShow = true;
      this.$nextTick(() => {
        this.$refs.infoForm && this.$refs.infoForm.clearValidate();
      });
    },
    queryAllStandardSystemList() {
      const params = {
        instNo: "",
        originStandardSystemCode: "",
        standardSystemCode: "",
        standardSystemCodeList: [],
        standardSystemDesc: "",
        standardSystemName: "",
        systemCode: "",
      };
      this.rpc.datadict.queryAllStandardSystemList(params).then((res) => {
        this.relationSystemList = res.relationSystemList;
      });
    },

    async analysisConfirm(data) {
      this.getDictTopic();

      if (data.analysisFirst) {
        setTimeout(() => {
          this.drawerShow = true;
          this.$nextTick(() => {
            this.$refs.infoForm && this.$refs.infoForm.clearValidate();
          });
        }, 300);
      }

      this.formData.fieldName = data.fieldName.replace(/\s/g, "") || "";
      this.formData.fieldKeyName = data.rootShortNameCombine || "";
      this.formData.fieldFullName = data.rootFullNameCombine || "";
    },

    lazyLoad(node, resolve) {
      const { level, data, children } = node;
      if (level == 1 && children.length <= 0) {
        this.getDictCategory(data.topicCode, (nodeList) => {
          resolve(nodeList);
        });
      } else {
        resolve([]);
      }
    },

    getDictTopic() {
      this.rpc.datadict
        .qryDataDictionaryListTopic()
        .then((res) => {
          this.preNodeProps = res.topicInfoList.map((e) => {
            return {
              value: e.topicCode,
              label: e.topicName,
              ...e,
            };
          });
          if (this.isEdit && this.formData.topicCode) {
            this.getDictCategory(this.formData.topicCode, (nodeList) => {
              if (nodeList.length <= 0) {
                return false;
              }
              this.preNodeProps.forEach((item) => {
                if (item.topicCode == nodeList[0].topicCode) {
                  item.children = nodeList;
                }
              });
              this.preNodeProps.splice(0, 0);
            });
          }
        })
        .catch((err) => {});
    },

    recursionData(curentArr = []) {
      for (let i = 0; i <= curentArr.length - 1; i++) {
        const item = curentArr[i];

        if (item.children.length) {
          this.recursionData(item.children);
        }
        item.value = item.categoryId;
        item.label = item.categoryName;
      }
      return curentArr;
    },

    getDictCategory(val = "", resolve) {
      this.rpc.datadict
        .qryDataDictionaryCategoryList({
          topicCode: val,
        })
        .then((res) => {
          let nodeList = this.recursionData(res.categoryInfoList);
          if (nodeList.length == 0) {
            this.preNodeProps.map((item) => {
              if (item.topicCode == val) {
                item.leaf = false;
              }
              item.children = [];
            });
            this.preNodeProps.splice(0, 0);
          } else {
            nodeList.map((item) => {
              item.c = true;
            });
          }
          if (resolve) {
            resolve(nodeList);
          } else {
            this.preNodeProps[0].children = nodeList;
            this.preNodeProps.splice(0, 0);
          }
        })
        .catch((err) => {});
    },
    handleEnumAdd() {
      window.open("/aop-h5/#/aop_tradedesign/datadict/neumlist", "_blank");
    },
    handleEnumChose() {
      this.$refs.enumChose.showDialog({
        enumCode: this.enumCode,
      });
    },
    handleEnumEdit(row, $index) {
      this.editIndex = $index;
      this.$refs.handleEnum.openDialog({
        action: "edit",
        ...row,
      });
    },
    handleEnumDelete(row, $index) {
      this.$confirm("确定删除此枚举定义吗？")
        .then(() => {
          this.tableData.splice($index, 1);
        })
        .catch(() => {});
    },
    async changeEnumList(code) {
      this.enumCode = code;
      const { detailList } = await this.rpc.datadict.queryEnumParamDetail({
        enumCode: code,
      });
      this.tableData = detailList || [];
    },
    enumConfirm(data) {
      if (this.editIndex === -1) {
        this.tableData.push({
          fieldId: this.initData.fieldId,
          enumKey: data.enumKey,
          enumValue: data.enumValue,
        });
      } else {
        this.tableData[this.editIndex] = {
          ...this.tableData[this.editIndex],
          enumKey: data.enumKey,
          enumValue: data.enumValue,
        };
        this.tableData = this.tableData.concat([]);
      }
    },
    // 点击取消按钮
    handleClose() {
      this.isLoading = false;
      this.drawerShow = false;
    },
    // 点击保存按钮
    handleConfirm() {
      console.log(this.formData.standards, "this.formData.standards===");
      if (!this.formData.fieldFullName) {
        this.$message.warning("请先分析字段名称");
        return false;
      }
      if (!this.formData.standards[0]) {
        this.$message.error("请先添加主题！");
        return false;
      }
      if (!this.formData.standards[1]) {
        this.$message.error("请先添加分类！");
        return false;
      }

      if (
        !!this.formData.fieldLengthMin &&
        Number(this.formData.fieldLengthMin) > Number(this.formData.fieldLength)
      ) {
        this.$message.error("最小长度不得超过字段长度，请调整！");
        return false;
      }
      if (
        !!this.formData.fieldLengthMax &&
        Number(this.formData.fieldLengthMax) > Number(this.formData.fieldLength)
      ) {
        this.$message.error("最大长度不得超过字段长度，请调整！");
        return false;
      }
      if (
        !!this.formData.fieldLengthMax &&
        !!this.formData.fieldLengthMin &&
        Number(this.formData.fieldLengthMax) <
          Number(this.formData.fieldLengthMin)
      ) {
        this.$message.error("最小长度不得超过最大长度，请调整！");
        return false;
      }
      this.$refs.infoForm.validate((valid, validObject) => {
        if (valid === true) {
          this.tableData.forEach((item) => {
            item.fieldKeyName = this.formData.fieldKeyName;
          });
          let tempArr = [...this.formData.standards];
          let temStr = tempArr.pop();
          // let tempCategoryList = tempArr.splice(1);
          // let temStr = "";
          // if (tempCategoryList.length > 1) {
          //   temStr = tempCategoryList.join("#");
          // } else {
          //   temStr = tempCategoryList[0];
          // }
          this.formData.categoryId = temStr;
          this.formData.topicCode = this.formData.standards[0] || "";
          // 审批通过
          if (this.action === "reviewField") {
            this.rpc.datadict
              .dataDictionaryFieldUpdate({
                fieldId: this.initData.fieldId || "",
                replaceField: this.initData.fieldId || "",
                operation: "0", // 操作方式 0：审批；1：修改
                fieldFlag: this.initData.fieldFlag,
                fieldSource: this.initData.fieldSource || "",
                status: "01", // 通过
                ...this.formData,
                // dataDictionaryEnumLists: this.tableData,
                enumCode: this.enumCode,
              })
              .then(() => {
                this.$notify({
                  title: "成功",
                  message: "新增成功",
                  duration: 2000,
                  type: "success",
                });
                this.$emit("refreshAddFinish");
                this.$emit("refreshData");
                this.handleClose();
              })
              .catch(() => {});
          } else if (this.action === "editField") {
            // 编辑字段
            this.rpc.datadict
              .dataDictionaryFieldUpdate({
                fieldId: this.initData.fieldId,
                ...this.formData,
                enumCode: this.enumCode,
                operation: "1",
                fieldFlag: this.initData.fieldFlag || "2",
              })
              .then(() => {
                this.$notify({
                  title: "成功",
                  message: "字段修改成功",
                  duration: 2000,
                  type: "success",
                });
                this.$emit("refreshData");
                this.handleClose();
              })
              .catch(() => {});
          } else {
            // 新增字段-补充字段
            this.rpc.datadict
              .dataDictionaryFieldAdd({
                ...this.formData,
                fieldSource: "common",
                enumCode: this.enumCode,
              })
              .then(() => {
                this.$notify({
                  title: "成功",
                  message: "字段补充成功",
                  duration: 2000,
                  type: "success",
                });
                this.$emit("refreshData");
                this.handleClose();
              })
              .catch(() => {});
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
@import "@m/assets/css/common.scss";
@import "@m/assets/css/public.scss";
@import "../css/page.scss";
::v-deep .el-form-item {
  position: relative;
  .label-info {
    position: absolute;
    z-index: 1000;
    top: -36px;
    left: 70px;
  }
}
.info-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-top: 1px solid #e7e7ee;
  .drawer-main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .info-top-fixed {
    flex: none;
  }

  .top-header-tab {
    padding: 0 24px;
    box-shadow: 0px 0.5px 0px 0px rgba(231, 231, 238, 1);
  }
  .info-bottom-handle {
    flex: none;
    height: 72px;
    box-shadow: inset 0px 1px 0px 0px rgba(245, 245, 250, 1);
    @extend .flex-center;
    ::v-deep .el-button {
      width: 112px;
      height: 40px;
      border-radius: 2px;
    }
  }
}
.info-form-content {
  padding: 24px;

  .aop-com-info-form-wrap {
    ::v-deep {
      .el-form-item {
        margin-bottom: 24px;
      }
      .el-form-item__label {
        line-height: 16px;
        padding-bottom: 12px;
      }
      .el-select,
      .el-cascader {
        width: 100%;
      }
    }
  }
  .required-title {
    padding-bottom: 12px;
    font-size: 14px;
    color: #323c41;
    line-height: 16px;
    font-weight: 400;
  }
}
.input-primary-btn {
  ::v-deep .el-input-group__append {
    .el-button {
      color: #fff;
      background-color: $theme_color;
      border-radius: 0 3px 3px 0;
    }
  }
}
.theme-class {
  position: absolute;
  right: 10px;
  top: -28px;
}
</style>
