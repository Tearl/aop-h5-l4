<template>
  <div class="aop_workgate_comps_systemmgmt_dic_form">
    <div class="create_content_wrapper">
      <div class="detail_content">
        <div class="content_header nav_title">
          {{ dictryId ? "编辑数据字典" : "创建数据字典" }}
        </div>
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
                v-model="formData.dictryNo"
                clearable
                placeholder="请输入参数名称"
                show-word-limit
                disabled
              >
              </el-input>
              <el-button class="" type="primary" @click="showDialog"
                >{{!sysId ? "从现有数据字典选择" : "从公共数据字典选择"}}</el-button
              >
            </el-form-item>
            <el-form-item label="参数中文名称" prop="dictryNm">
              <el-input
                v-model="formData.dictryNm"
                clearable
                maxlength="100"
                placeholder="请输入参数中文名称"
                disabled
              >
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="关键字" prop="dictryKeyWord"> -->
            <el-form-item label="关键字" class="no_before">
              <el-input
                v-model="formData.dictryKeyWord"
                clearable
                maxlength="100"
                placeholder="请输入关键字"
                disabled
              >
              </el-input>
              <el-tag size="small" type="warning">多个关键字用空格隔开</el-tag>
            </el-form-item>
            <!-- <el-form-item label="英文名字全称" prop="dictryEnglishFullName"> -->
            <el-form-item label="英文名字全称" class="no_before">
              <el-input
                v-model="formData.dictryEnglishFullName"
                clearable
                maxlength="100"
                placeholder="请输入英文名字全称"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="参数描述" prop="dictryDescr" class="no_before">
              <el-input
                type="textarea"
                :rows="4"
                maxlength="150"
                placeholder="请输入参数描述"
                v-model="formData.dictryDescr"
                clearable
                show-word-limit
                disabled
              >
              </el-input>
            </el-form-item>

            <el-form-item label="所属分类" prop="dictryGateg" v-if="!sysId">
              <el-select
                v-model="formData.dictryGateg"
                placeholder="请选择所属分类"
                clearable
                disabled
                @change="handleDictryGategChange"
              >
                <el-option
                  v-for="item in dictGategList"
                  :label="item.clsfNm"
                  :key="item.clsfId"
                  :value="item.clsfId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="参数类型" prop="dictryTyp">
              <el-select
                v-model="formData.dictryTyp"
                placeholder="请选择参数类型"
                clearable
                disabled
              >
                <el-option
                  v-for="item in selectVal"
                  :label="item.type"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="最大长度"
              prop="dictryLength"
              class="no_before"
              v-show="
                formData.dictryTyp != 'List' && formData.dictryTyp != 'Object'
              "
            >
              <el-input
                v-model="formData.dictryLength"
                clearable
                disabled
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
              v-show="formData.dictryTyp == 'String'"
            >
              <Enumerate ref="enumRef" :bizType="pageMode" @showDialog="showDialog"></Enumerate>
            </el-form-item>

            <el-form-item
              label="验证规则"
              class="no_before"
              v-show="formData.dictryTyp == 'String'"
            >
              <Rule ref="ruleRef" :bizType="pageMode" @showDialog="showDialog"></Rule>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <DictionarySelect
      ref="dictionaryRef"
      :dialogVisible="dictionaryDialogVisible"
      :dictGategList="dictGategList"
      @closeDialog="dictionaryCloseDialog"
      @setDictChildList="setDictChildList"
    >
    </DictionarySelect>

    <!-- <DictionaryPublic
      ref="dictionaryPublicRef"
      :dialogVisible="publicDialogVisible"
      @closeDialog="publicCloseDialog"
      @confirmParams="confirmParams"
    >
    </DictionaryPublic> -->

    <!-- <PageFooter>
      <div slot="box">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="preservation">确 定</el-button>
      </div>
    </PageFooter> -->
  </div>
</template>
<script>
import PageHeader from "@m/core/components/page_header";
import Table from "@m/core/components/page_table";
import PageFooter from "@m/core/components/page_footer";
import mixin from "@m/core/mixin";
import validate from "@m/utils/validate";
import DictionarySelect from "./select";
import Enumerate from "./enumerate";
import Rule from "./rule";
import DictionaryPublic from "./public";

import { unduplicated, setSerialNumber } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    PageHeader,
    Table,
    PageFooter,
    DictionarySelect,
    Enumerate,
    Rule,
    DictionaryPublic
  },
  props: {
    sysId: {
      type: String,
      default: () => ""
    },
    dictryId: {
      type: String,
      default: () => ""
    }
  },
  data() {
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
        {
          prop: "dictryGategName",
          label: "所属分类",
          minWidth: "20%",
          type: "text",
        },
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
        dictryGateg: "", // 所属分类
        dictryTyp: "", // 参数类型
        dictryLength: "", // 最大长度
      },
      //服务资产基本信息绑定的验证规则
      rules: {
        dictryNo: [
          {
            required: true,
            trigger: "blur",
            message: "请输入参数名称",
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
        dictryGateg: [
          { required: true, trigger: "change", message: "请选择所属分类" },
        ],
        dictryLength: [
          { required: true, trigger: "change", validator: this.validator },
        ],
      },
      // 所属分类列表
      dictGategList: [],
      // 数据字典选择弹框
      dictionaryDialogVisible: false,
      // 公共数据字典选择
      publicDialogVisible: false,

      // 判断是否从公共数据字典过来
      type: ""
    };
  },
  methods: {
    showDialog(type, data) {
      this.$emit("showDialog", type, data)
    },
    async validator(rule, value, callback) {
      if (rule.field == "dictryLength") {
        if (
          this.formData.dictryTyp == "List" ||
          this.formData.dictryTyp == "Object"
        ) {
          callback();
        } else if (
          ["double", "float", "Double", "Float", "BigDecimal"].indexOf(
            this.formData.dictryTyp
          ) != -1
        ) {
          const reg = /^([1-9][0-9]*)(,([1-9][0-9]*))$/;
          if (value && !reg.test(value)) callback(new Error("格式错误"));
          const lengthNum = value.split(",");
          if (lengthNum[0] * 1 < lengthNum[1] * 1)
            callback(new Error("最大长度不能小于精度长度"));
          else callback();
        } else {
          const reg = /^[0-9]*$/;
          if (value && !reg.test(value)) {
            callback(new Error("请输入数字"));
          } else {
            callback();
          }
        }
      } else if (rule.field == "dictryNo") {
        if (this.formData.dictryGateg && this.formData.dictryNo) {
          const params = {
            dictryId: this.dictryId,
            dictryNo: this.formData.dictryNo,
            dictryGateg: this.sysId ? "10000000" : this.formData.dictryGateg,
            sysId: this.sysId,
          };
          const res = await this.rpc.dictionary.duplicateChenck(params);
          if (res.result == "1") {
            callback("参数名称重复，请重新输入");
          }
        }
      }
    },
    operate(operation, data) {
      if (operation == "delete") {
        this.iInputList = this.iInputList.filter(
          (item) => item.dictryId != data.dictryId
        );
      }
    },
    // 所属分类选择框变化时
    async handleDictryGategChange() {
      if (this.formData.dictryNo) {
        this.$refs.formData.validateField("dictryNo");
      }
    },
    // 添加子参数
    addSonParams() {
      // console.log(this.dictGategList);
      // this.dictionaryDialogVisible = true;
      this.showDialog("sonParams")
    },
    // 数据字典选择弹框取消
    dictionaryCloseDialog() {
      this.dictionaryDialogVisible = false;
    },
    setDictChildList(data) {
      this.iInputList = setSerialNumber(
        unduplicated(this.iInputList.concat(data), "dictryId")
      );
      this.dictionaryCloseDialog();
    },
    // 从公共数据字典选择
    publicCloseDialog() {
      this.publicDialogVisible = false;
    },
    // 从公共数据字典确认
    confirmParams(e) {
      this.publicCloseDialog();
      this.getDictionaryInfoById(e.dictryId);
    },
    // 获取所属分类列表
    async getTypeList() {
      const params = { turnPageShowNum: "0" };
      if(!this.sysId) {
        params.excludeClsfId= "10000000" 
      }
      const res = await this.rpc.dictionary.getClassifyTypeList(params);
      this.dictGategList = res.serviceList;
    },
    // 创建数据字典
    async addDictionary() {
      const params = Object.assign({}, this.formData);
      if (params.dictryTyp == "String") {
        const enumerateValueList = this.$refs.enumRef.enumerateValueList;
        params.dictryEnum = enumerateValueList.reduce((pre, item, index) => {
          return `${pre}${item.key}-${item.value}${
            index == enumerateValueList.length - 1 ? "" : ";"
          }`;
        }, "");
        params.ruleIdList = this.$refs.ruleRef.ruleTableData.map((item) => ({
          ruleId: item.ruleId,
        }));
      } else if (params.dictryTyp == "List" || params.dictryTyp == "Object") {
        params.dictChildList = this.iInputList;
        params.dictryLength = "";
      }
      if(!!this.sysId) {
        params.sysId = this.sysId;
        params.dictryGateg = "10000000";
      }
      const res = await this.rpc.public.addPublicDictionary(params);
      this.$notify({
        title: "成功",
        message: "成功",
        duration: 2000,
        type: "success",
      });
      this.$refs.formData.resetFields()
      this.$emit("handleCancel", res)
      // this.handleCancel()
    },
    async editDictionary() {
      const params = Object.assign({ dictryId: this.dictryId }, this.formData);
      if (params.dictryTyp == "String") {
        const enumerateValueList = this.$refs.enumRef.enumerateValueList;
        params.dictryEnum = enumerateValueList.reduce((pre, item, index) => {
          return `${pre}${item.key}-${item.value}${
            index == enumerateValueList.length - 1 ? "" : ";"
          }`;
        }, "");
        params.ruleIdList = this.$refs.ruleRef.ruleTableData.map((item) => ({
          ruleId: item.ruleId,
        }));
      } else if (params.dictryTyp == "List" || params.dictryTyp == "Object") {
        params.dictChildList = this.iInputList;
        params.dictryLength = "";
      }
      const res = await this.rpc.public.editPublicDictionary(params);
      this.$notify({
        title: "成功",
        message: "成功",
        duration: 2000,
        type: "success",
      });
      this.handleCancel()
    },
    handleCancel() {
      if(!this.dictryId) {
        if (this.type !== "public") {
          this.$emit("toDicList");
        } else {
          this.$router.push({
            path: "/aop_workgate/systemmgmt/dictionaryList",
          });
        }
      } else {
        this.$emit("toDetail");
      }
    },
    // 点击确定按钮
    preservation() {
      this.$refs.formData.validate(async(valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        if (this.dictryId) {
          // 编辑数据字典
          this.editDictionary();
        } else {
          // 创建数据字典
          const params = {
            dictryNm: this.formData.dictryNm,
          };
          const res = await this.rpc.dictionary.dicNameCheck(params);
          if (res.result == "1" && this.sysId) {
            this.$confirm("警告：公共数据字典池已有该字典，请确认是否仍要创建").then(async () => {
              this.addDictionary();
            });
          } else {
            this.addDictionary();
          }
        }
      });
    },
    // 进入编辑页面时查询详情
    async getDictionaryInfoById(e) {
      const params = {
        dictryId: e,
      };
      const res = await this.rpc.dictionary.editList(params);
      this.formData.dictryNo = res.dictryNo;
      this.formData.dictryNm = res.dictryNm;
      this.formData.dictryKeyWord = res.dictryKeyWord.replace(
        /(^\s*)|(\s*$)/g,
        ""
      ); // 去除前后空格
      this.formData.dictryEnglishFullName = res.dictryEnglishFullName;
      this.formData.dictryDescr = res.dictryDescr;
      this.formData.dictryGateg = res.dictryGateg;
      this.formData.dictryTyp = res.dictryTyp;
      this.formData.dictryLength = res.dictryLength;
      this.dicGetNodeId(res.dictChildList);
      this.iInputList = JSON.parse(JSON.stringify(res.dictChildList));
      if (res.dictryTyp == "String") {
        if (res.dictryEnum) {
          this.$refs.enumRef.enumerateValueList = res.dictryEnum
            .split(";")
            .map((item) => {
              const arr = item.split("-");
              return {
                key: arr[0],
                value: arr[1],
              };
            });
        }
        this.$refs.ruleRef.ruleTableData = res.ruleList;
      }
    },
    //判断是否有子参数
    dicGetNodeId(arrs, id) {
      arrs.forEach((item, i) => {
        if (item.children.length > 0) {
          item.serialNumber = id ? id + "." + (i + 1) : i + 1 + "";
          this.dicGetNodeId(item.children, item.serialNumber);
        } else {
          item.serialNumber = id ? id + "." + (i + 1) : i + 1 + "";
          delete item.children;
        }
      });
    },
    //初始化
    init() {
      this.type = this.$route.query.type || "";
      if(this.type == "public") {
        this.dictryId = this.$route.query.dictryId;
        this.sysId = this.$route.query.sysId;
      }
      this.getDictionaryInfoById(this.dictryId);
      this.getTypeList();
      this.breadcrumbs[1].label = this.dictryId
        ? "编辑数据字典"
        : "创建数据字典"; 
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_workgate_comps_systemmgmt_dic_form {
  .create_content_wrapper {
    padding: 16px 24px;
    .detail_content {
      position: relative;
      background: $base_white;
      padding: 0 24px 24px;
      min-height: 78.5vh;
      .content_header {
        padding: 20px 30px 0;
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
        padding: 0px 30px 0;
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
}
</style>
