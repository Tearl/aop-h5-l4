<template>
  <div class="aop_tradedesign_comps_dicmgmt_dic_form">
    <div :class="pageType == 'appr' ? '' : 'create_content_wrapper'">
      <div class="detail_content">
        <!-- <div class="content_header nav_title">
          {{ headerTitle }}
        </div> -->
        <el-form
          :model="formData"
          :rules="rules"
          class="service_create_form"
          ref="formData"
          label-width="120px"
        >
          <div class="service_create_form_info">
            <el-form-item label="参数名称" prop="dictryNo">
              <el-input
                :disabled="!!sysId"
                v-model="formData.dictryNo"
                clearable
                placeholder="请输入参数名称"
                show-word-limit
              >
              </el-input>
            </el-form-item >
            <el-form-item label="参数中文名称" prop="dictryNm">
              <el-input
                :disabled="!!sysId"
                v-model="formData.dictryNm"
                clearable
                maxlength="100"
                placeholder="请输入参数中文名称"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="字段属性" prop="attrType" >
              <el-radio-group v-model="formData.attrType" :disabled="isDisabled" @change="radioChange">
                <el-radio label="0">普通属性</el-radio>
                <el-radio label="4">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :disabled="isDisabled"
              label="验证规则："
              prop="rule"
              v-show="formData.attrType == '4'"
            >
              <el-select
                v-model="formData.ruleId"
                placeholder="请选择验证规则"
                @change="changeRule"
              >
                <el-option
                  v-for="item in ruleTableData"
                  :label="item.ruleNm"
                  :key="item.ruleId"
                  :value="item.ruleId"
                ></el-option>
              </el-select>
            </el-form-item>
            <div v-show="formData.attrType == '0' || chooseRule">
                <el-form-item label="关键字" class="no_before" >
                  <el-input
                    v-model="formData.dictryKeyWord"
                    clearable
                    maxlength="100"
                    placeholder="请输入关键字"
                  >
                  </el-input>
                  <el-tag size="small" type="warning">多个关键字用空格隔开</el-tag>
                </el-form-item>
                <el-form-item label="英文名字全称" class="no_before" >
                  <el-input
                    v-model="formData.dictryEnglishFullName"
                    clearable
                    maxlength="100"
                    placeholder="请输入英文名字全称"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="参数描述" prop="dictryDescr" class="no_before" >
                  <el-input
                    type="textarea"
                    :rows="4"
                    maxlength="150"
                    placeholder="请输入参数描述"
                    v-model="formData.dictryDescr"
                    clearable
                    show-word-limit
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="参数类型" prop="dictryTyp">
                  <el-select
                    :disabled="!!sysId || isDisabled"
                    v-model="formData.dictryTyp"
                    placeholder="请选择参数类型"
                    clearable
                  >
                    <el-option
                      v-for="item in selectTypeList"
                      :label="item.type"
                      :key="item.value"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="最大长度"
                  prop="dictryLength"
                  v-show="
                  formData.dictryTyp != 'List' && formData.dictryTyp != 'Object'
                "
                >
                  <el-input
                    :disabled="isDisabled"
                    v-model="formData.dictryLength"
                    clearable
                    placeholder="请输入最大长度"
                  />
                  <el-tag
                    size="small"
                    type="warning"
                    v-show="
                    ['double', 'float', 'Double', 'Float', 'BigDecimal'].indexOf(
                      formData.dictryTyp
                    ) != -1
                  "
                  >格式：最大长度,精度。如20,2</el-tag
                  >
                </el-form-item>
              <!-- </el-form> -->
              <el-form-item
                label="子参数列表"
                class="no_before"
                v-show="
                formData.dictryTyp == 'List' || formData.dictryTyp == 'Object'
              "
              >
                <el-button
                  class="add_params_button"
                  icon="el-icon-plus"
                  type="primary"
                  @click="addSonParams"
                >添加子参数</el-button
                >
                <Table
                  class="table_style"
                  :data="iInputList"
                  :table="iInputListTable"
                  rowK="serialNumber"
                  :cellStyle="dictListCellStyle"
                  @operate="operate"
                ></Table>
              </el-form-item>
              <el-form-item
                label="枚举值"
                class="no_before"
                v-if="
                  [
                    'String',
                    'char',
                    'byte',
                    'short',
                    'long',
                    'Character',
                    'Byte',
                    'Short',
                    'Long',
                  ].includes(formData.dictryTyp)"
              >
                <Enumerate ref="enumRef" @showDialog="handleShowDialog"></Enumerate>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <DictionarySelect
      ref="dictionaryRef"
      :sysId="sysId"
      @setDictChildList="setDictChildList"
    >
    </DictionarySelect>
  </div>
</template>
<script>
import Table from "@m/core/components/page_table"
import mixin from "@m/core/mixin"
import validate from "@m/utils/validate"
import DictionarySelect from "./selectChildData"
import Enumerate from "./enumerate"
import {
  getSessionStorage,
} from "@m/utils/localStorage";

import { unduplicated, setSerialNumber } from "@m/utils/array"

export default {
  mixins: [mixin],
  components: {
    Table,
    DictionarySelect,
    Enumerate,
  },
  props: {
    sysId: {
      type: String,
      default: () => "",
    },
    dictryId: {
      type: String,
      default: () => "",
    },
    apiType: {
      type: String,
      default: () => "",
    },
    pageType: {
      type: String,
      default: () => "",
    },
  },
  data () {
    return {
      iInputList: [],
      // 添加输入参数列表参数
      iInputListTable: [
        {
          prop: "dictryNo",
          label: "参数名称",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryNm",
          minWidth: "30%",
          label: "参数中文名称",
          type: "text",
          tooltip: true,
        },
        {
          prop: "dictryDescr",
          label: "参数描述",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        // {
        //   prop: "dictryGategName",
        //   label: "所属分类",
        //   minWidth: "20%",
        //   type: "text",
        // },
        {
          prop: "dictryTyp",
          filter: "paraTyp",
          label: "参数类型",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryLength",
          label: "最大长度",
          minWidth: "15%",
          align: "center",
          type: "text",
        },
        {
          prop: "dictryRule",
          label: "验证规则",
          minWidth: "30%",
          type: "text",
          operate: "read",
          tooltip: true,
        },
        {
          label: "操作",
          type: "button",
          width: "50",
          buttonList: [
            {
              desc: "删除",
              operate: "delete",
            },
          ],
        },
      ],
      // 导航栏参数
      breadcrumbs: [
        {
          label: "数据字典管理",
          operate: "list",
        },
        {
          label: "编辑数据字典",
        },
      ],
      selectVal: [
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
      // 表单数据
      formData: {
        dictryNo: "", // 参数名称
        dictryNm: "", // 参数中文名称
        dictryKeyWord: "", // 关键字
        dictryEnglishFullName: "", // 英文名字全称
        dictryDescr: "", // 参数描述
        // dictryGateg: "10000001", // 所属分类
        dictryTyp: "String", // 参数类型
        dictryLength: "", // 最大长度
        opinion: "",
        remark: "",
        attrType: "0",
        ruleId: '',
      },
      //服务资产基本信息绑定的验证规则
      rules: {
        dictryNo: [
          {
            required: true,
            trigger: "blur",
            message: "请输入英文参数名称",
            validator: validate.isEnglish,
          },
          {
            required: true,
            trigger: "blur",
            validator: this.validator,
          },
        ],
        dictryNm: [
          {
            required: true,
            trigger: "blur",
            message: "请输入参数中文名称",
          },
          {
            required: true,
            trigger: "blur",
            message: "请输入中文",
            validator: validate.containChinese,
          },
          {
            required: true,
            trigger: "blur",
            validator: this.validator,
          },
        ],
        dictryKeyWord: [
          {
            required: true,
            trigger: "blur",
            message: "请输入关键字",
          },
        ],
        dictryEnglishFullName: [
          {
            required: true,
            trigger: "blur",
            message: "请输入英文名字全称",
          },
          {
            required: true,
            trigger: "blur",
            message: "请输入英文",
            validator: validate.isEnglish,
          },
        ],
        dictryTyp: [
          { required: true, trigger: "blur", message: "请选择参数类型" },
        ],
        // dictryGateg: [
        //   { required: true, trigger: "change", message: "请选择所属分类" },
        // ],
        dictryLength: [
          { required: true, trigger: "blur", validator: this.validator, message: "请输入数字"  },
        ],
        rule: [
          // { required: true, trigger: "blur", message: "请选择验证规则" },
        ],
      },
      // 所属分类列表
      dictGategList: [],
      // 数据字典选择弹框
      dictionaryDialogVisible: false,
      // 公共数据字典选择
      publicDialogVisible: false,

      // 判断是否从公共数据字典过来
      type: "",
      ruleTableData: [],
      chooseRule: false,
      beltLine: '',
      ruleList: [],
    }
  },
  computed: {
    isDisabled() {
      return this.type === 'addAttr'
    },
    selectTypeList() {
      if (this.formData.attrType === '4') {
        return this.selectVal.filter((e) => {
          if (e.type !== 'Object' && e.type !== 'List') {
            return e
          }
        })
      } else {
        return this.selectVal
      }
    },
  },
  methods: {
    radioChange() {
      if (this.formData.dictryTyp === 'List' || this.formData.dictryTyp === 'Object') {
        if (this.formData.attrType === '4') {
          this.formData.dictryTyp = 'String'
        }
      }
    },
    changeRule(val) {
      this.chooseRule = true;
      let ruleList = this.ruleTableData.filter((item) => item.ruleId == val);
      console.log(val, ruleList, "val");
      this.ruleList.push(...ruleList);
    },
    async validator (rule, value, callback) {
      if (rule.field == "dictryLength") {

        if (
          this.formData.dictryTyp == "List" ||
          this.formData.dictryTyp == "Object"
        ) {
          callback()
        } else if (value.trim().length === 0) {
          callback('请输入数字')
          return
        } else if (
          ["double", "float", "Double", "Float", "BigDecimal"].indexOf(
            this.formData.dictryTyp
          ) != -1
        ) {
          const reg = /^([1-9][0-9]*)(,([1-9][0-9]*))$/
          if (value && !reg.test(value)) callback(new Error("格式错误"))
          const lengthNum = value.split(",")
          if (lengthNum[0] * 1 < lengthNum[1] * 1)
            callback(new Error("最大长度不能小于精度长度"))
          else callback()
        } else {
          const reg = /^[0-9]*$/
          if (value && !reg.test(value)) {
            callback(new Error("请输入数字"))
          } else {
            callback()
          }
        }
      }
    },
    getMenuList () {
      this.$emit("getMenuList")
    },
    operate (operation, data) {
      if (operation == "delete") {
        this.iInputList = this.iInputList.filter(
          (item) => item.dictryId != data.dictryId
        )
      }
    },
    // 所属分类选择框变化时
    async handleDictryGategChange () {
      if (this.formData.dictryNo) {
        this.$refs.formData.validateField("dictryNo")
      }
    },
    // 添加子参数
    addSonParams () {
      console.log(this.dictGategList)
      // this.dictionaryDialogVisible = true
      this.$refs.dictionaryRef.showDialog();
    },
    // 数据字典选择弹框取消
    dictionaryCloseDialog () {
      this.dictionaryDialogVisible = false
    },
    setDictChildList (data) {
      this.iInputList = setSerialNumber(
        unduplicated(this.iInputList.concat(data), "dictryId")
      )
      this.dictionaryCloseDialog()
    },
    // 从公共数据字典选择
    publicCloseDialog () {
      this.publicDialogVisible = false
    },
    // 从公共数据字典确认
    confirmParams (e) {
      this.publicCloseDialog()
      this.getDictionaryInfoById(e.dictryId, "confirmPublic")
    },
      // 获取迁移数据列表
    async getRuleList() {
      const data = {
        qCondition: "",
        paraClassifyId: "",
        currentPage: 1,
        turnPageShowNum: "99999",
      };
      const res = await this.rpc.downloadDesign.getDataRuleList(data);
      this.ruleTableData = res.ruleDefinedInfoPageList;
    },
    // 获取所属分类列表
    // async getTypeList () {
    //   const params = { turnPageShowNum: "0" }
    //   if (!this.sysId) {
    //     params.excludeClsfId = "10000000"
    //   }
    //   const res = await this.rpc.systemmgmt.getClassifyTypeList(params)
    //   this.dictGategList = res.serviceList
    // },
    getParamsRuleIdList() {
      if (this.ruleList.length && this.formData.attrType === '4') {
          return {
            ruleList: [{
              ruleId: this.ruleList[0]?.ruleId,
            }],
            releId: this.ruleList[0]?.ruleId,
          }
      }
      return {}
    },
    // 创建数据字典
    async addDictionary () {
      let params = Object.assign({}, this.formData)
      if (params.dictryTyp == "String") {
        const enumerateValueList = this.$refs.enumRef.enumerateValueList
        params.dictryEnum = enumerateValueList.reduce((pre, item, index) => {
          return `${pre}${item.key}-${item.value}${index == enumerateValueList.length - 1 ? "" : ";"
            }`
        }, "")
        params = {
          ...params,
          ...this.getParamsRuleIdList(),
        }
      } else if (params.dictryTyp == "List" || params.dictryTyp == "Object") {
        params.dictChildList = this.iInputList
        params.dictryLength = ""
      }
      if (this.apiType == "sys" || !!this.sysId) {
        params.dictryGateg = "10000000"
        params.sysId = this.sysId
      }
      const api = this.apiType == "sys" ? "addSysDic" : "addPublicDictionary"
      params.beltLine = this.beltLine
      const res = await this.rpc.public[api](params)
      this.$notify({
        title: "成功",
        message: "成功",
        duration: 2000,
        type: "success",
      })
      params.dictryId = res.dictryId
      return params
    },
    async editDictionary () {
      let params = Object.assign({ dictryId: this.dictryId }, this.formData)
      if (params.dictryTyp == "String") {
        const enumerateValueList = this.$refs.enumRef.enumerateValueList
        params.dictryEnum = enumerateValueList.reduce((pre, item, index) => {
          return `${pre}${item.key}-${item.value}${index == enumerateValueList.length - 1 ? "" : ";"
            }`
        }, "")
        params = {
          ...params,
          ...this.getParamsRuleIdList(),
        }
      } else if (params.dictryTyp == "List" || params.dictryTyp == "Object") {
        params.dictChildList = this.iInputList
        params.dictryLength = ""
      }
      if (this.apiType == "sys" || !!this.sysId) {
        params.dictryGateg = "10000000"
        params.sysId = this.sysId
      }
      params.beltLine = this.beltLine
      const api =
        this.apiType == "sys"
          ? "modSysDic"
          : this.apiType == "standard"
            ? "agreeStandardDic"
            : "editPublicDictionary"
      const res = await this.rpc.systemmgmt[api](params)
      this.$notify({
        title: "成功",
        message: "成功",
        duration: 2000,
        type: "success",
      })
      return res
    },
    handleCancel () {
      if (!this.dictryId) {
        if (this.type !== "public") {
          this.$emit("toDicList")
        } else {
          this.$router.push({
            path: "/aop_tradedesign/dicmgmt/list",
          })
        }
      } else if (this.isDisabled) {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list",
        })
      } else {
        this.$emit("toDetail")
      }
    },
    // 点击确定按钮
    async preservation () {
      this.$refs.formData.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写")
        // if (this.pageType == "mod" ) {
        //   // 编辑数据字典
        //   await this.editDictionary()
        //   this.handleCancel()
        // } else if (this.isDisabled) {
        //   // 如果是新增属性
        //   await this.editDictionary()
        //   this.$router.push({
        //     path: "/aop_tradedesign/dicmgmt/list",
        //   })
        // } else {
        this.addDictionary()
        // }
      })
    },
    // 进入编辑页面时查询详情
    async getDictionaryInfoById (e, operation) {
      console.log("88", e, operation)
      const params = {
        dictryId: e,
      }
      const data = {

      }
      const api =
        operation == "confirmPublic"
          ? "editList"
          : this.apiType == "sys"
            ? "getSysDicDetail"
            : "editList"
      const res = await this.rpc.systemmgmt[api](params)
      this.formData.dictryNo = res.dictryNo
      this.formData.dictryNm = res.dictryNm
      this.formData.dictryKeyWord = res.dictryKeyWord.replace(
        /(^\s*)|(\s*$)/g,
        ""
      ) // 去除前后空格
      this.formData.dictryEnglishFullName = res.dictryEnglishFullName
      this.formData.dictryDescr = res.dictryDescr
      this.formData.dictryGateg = res.dictryGateg
      this.formData.dictryTyp = res.dictryTyp
      this.formData.dictryLength = res.dictryLength
      this.formData.ruleId = res.ruleList.length ? res.ruleList[0] : ''
      if (this.formData.ruleId) {
        this.chooseRule = true;
      }
      // 4 自定义属性
      if (res.attributeTyp === '4') {
        this.formData.attrType = res.attributeTyp
      } else {
        this.formData.attrType = '0'
      }
      this.dicGetNodeId(res.dictChildList)
      this.iInputList = JSON.parse(JSON.stringify(res.dictChildList))
      if (res.dictryTyp == "String") {
        if (res.dictryEnum) {
          this.$refs.enumRef.enumerateValueList = res.dictryEnum
            .split(";")
            .map((item) => {
              const arr = item.split("-")
              return {
                key: arr[0],
                value: arr[1],
              }
            })
        }
      }
      console.log("查详情", e, operation, this.formData, res)
    },
    //判断是否有子参数
    dicGetNodeId (arrs, id) {
      arrs.forEach((item, i) => {
        if (item.children.length > 0) {
          item.serialNumber = id ? id + "." + (i + 1) : i + 1 + ""
          this.dicGetNodeId(item.children, item.serialNumber)
        } else {
          item.serialNumber = id ? id + "." + (i + 1) : i + 1 + ""
          delete item.children
        }
      })
    },
    //初始化
    init () {
      this.type = this.$route.query.type || ""
      this.beltLine = this.$route.query.bizLineId
      if (this.type == "public" || this.type === 'addAttr') {
        this.dictryId = this.$route.query.dictryId
        this.sysId = this.$route.query.sysId
      }
      if (this.type === 'addAttr' && this.dictryId) {
        this.getDictionaryInfoById(this.dictryId)
      } else if (this.pageType == "mod" || this.pageType == "appr") {
        this.getDictionaryInfoById(this.dictryId)
      }
      this.getRuleList();
      // this.getTypeList()
      this.breadcrumbs[1].label = this.dictryId
        ? "编辑数据字典"
        : "创建数据字典"
      console.log("初始化", this.dictryId, this.pageType, this.type)
    },
  },
  created () {
    this.init()
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_dic_form {
  .create_content_wrapper {
    // padding: 16px 24px;
  }
  .detail_content {
    position: relative;
    background: $base_white;
    // padding: 0 24px 24px;
    min-height: 78.5vh;
    .content_header {
      // padding: 20px 30px 0;
      font-family: $font_medium;
      font-size: 16px;
      color: $pri_ft_color;
      letter-spacing: 0;
      font-weight: $font_weight_600;
    }
    .service_create_form {
      margin-top: 32px;
      @include form(".service_create_form_info");
      .create_form_tips {
        width: 500px;
        position: absolute;
        left: 420px;
        top: 0px;
        height: 40px;
        line-height: 40px;
        font-family: $font_regular;
        font-size: 12px;
        color: $sec_ft_color;
        letter-spacing: 0;
      }
      ::v-deep .el-button {
        @include large_button_common;
      }
    }
    .service_create_form_info {
      // padding: 0px 30px 0;
      .no_before ::v-deep.el-form-item__label::before {
        content: "";
      }
      .add_params_button {
        font-size: 14px;
        border-radius: 2px;
        cursor: pointer;
        padding: 0 8px;
        letter-spacing: 0;
        text-align: center;
        font-family: PingFangSC-Regular;
        height: 40px;
      }
    }
  }
  .table_class {
    ::v-deep tr td {
      &:nth-child(1) {
        .cell {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
.input_textarea {
  position: absolute;
  top: 20px;
  left: 30px;
  width: 1000px;
  height: 500px;
}
::v-deep .table_style .el-radio__label {
  display: none;
}

.dialog {
  ::v-deep .service_top {
    padding: 0;
  }
}
::v-deep .el-dialog__wrapper {
  overflow: hidden;
}
.table_class ::v-deep.el-table tr {
  height: 75px;
}
.table_class ::v-deep.input_error .el-input__inner {
  border-color: #f56c6c;
}
.table_style {
  margin-top: 16px;
  ::v-deep .el-table th {
    line-height: 0;
    color: $sec_ft_color;
  }
}
</style>
