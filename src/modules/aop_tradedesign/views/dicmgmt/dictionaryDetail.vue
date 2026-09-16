<template>
  <div class="aop_tradedesign_page_dicmgmt_dictionaryDetail">
    <!-- <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader> -->
    <div class="create_content_wrapper">
      <div class="detail_content">
        <div class="content_header nav_title">基本信息</div>
        <ul class="content_body">
          <li class="list_item">
            <span class="list_item_key">参数名称：</span>
            <span class="list_item_value">{{ formData.dictryNo }}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">参数中文名称：</span>
            <span class="list_item_value">{{ formData.dictryNm }}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">关键字：</span>
            <span class="list_item_value">{{ formData.dictryKeyWord }}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">英文名字全称：</span>
            <span class="list_item_value">{{
              formData.dictryEnglishFullName
            }}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">参数描述：</span>
            <span class="list_item_value">{{ formData.dictryDescr }}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">属性分类：</span>
            <span class="list_item_value">{{ formData.attributeTypNm }}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">参数类型：</span>
            <span class="list_item_value">{{ formData.dictryTyp }}</span>
          </li>
          <li class="list_item" v-if="formData.dictryTyp != 'List' && formData.dictryTyp != 'Object'">
            <span class="list_item_key">最大长度：</span>
            <span class="list_item_value">{{ formData.dictryLength }}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">创建人：</span>
            <span class="list_item_value">{{ formData.creatrNm }}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">创建时间：</span>
            <span class="list_item_value">{{
              formData.crtTm | crtTm_yyyyMMddhhmmss
            }}</span>
          </li>
        </ul>
      </div>

      <div
        class="detail_content"
        v-show="formData.dictryTyp == 'List' || formData.dictryTyp == 'Object'"
      >
        <div class="content_header nav_title">{{ "子参数列表" }}</div>
        <Table
          class="table_style"
          :data="iInputList"
          :table="iInputListTable"
          rowK="serialNumber"
          :cellStyle="dictListCellStyle"
          @operate="operate"
        ></Table>
      </div>

      <div class="detail_content" v-show="enumCondition()">
        <div class="content_header nav_title">{{ "枚举值" }}</div>
        <Enumerate ref="enumRef" :bizType="pageMode"></Enumerate>
      </div>

      <div class="detail_content" v-show="formData.attributeTyp === '4'">
        <div class="content_header nav_title">{{ "验证规则" }}</div>
        <Rule ref="ruleRef" :bizType="pageMode"></Rule>
      </div>
      <div class="detail_content detail_content_bottom" v-if="formData.dictryTyp !== 'Object' && formData.dictryTyp !== 'List'">
        <div class="content_header nav_title">示例列表</div>
        <Table
          :table="tables"
          :data="dataList"
        ></Table>
      </div>
    </div>

    <PageFooter>
      <div slot="box">
        <el-button @click="handleCancel">取 消</el-button>
        <!-- <el-button type="primary" @click="preservation">确 定</el-button> -->
      </div>
    </PageFooter>
  </div>
</template>
<script>
import PageHeader from "@m/core/components/page_header";
import Table from "@m/core/components/page_table";
import PageFooter from "@m/core/components/page_footer";
import mixin from "@m/core/mixin";
import validate from "@m/utils/validate";
import Enumerate from "./components/sys_dic/components/dic_detail/enumerate";
import Rule from "./components/sys_dic/components/dic_detail/rule";
import { 
  enumCondition
} from "@m/utils/enumCondition";
import filters from "@m/utils/filters";

export default {
  mixins: [mixin],
  components: {
    PageHeader,
    Table,
    PageFooter,
    Enumerate,
    Rule,
  },
  props: {
    sysId: {
      type: String,
      default: () => ""
    },
    dictryId: {
      type: String,
      default: () => ""
    },
    apiType: {
      type: String,
      default: () => ""
    },
    apprType: {
      type: String,
      default: () => ""
    },
    aplySrlNo: {
      type: String,
      default: () => ""
    },
  },
  data() {
    return {
      // 示例列表参数
      tables: [
        {
          width: "120",
          prop: "exampleOrder",
          label: "排序",
          type: "text",
        },
        {
          width: "150",
          prop: "exampleValue",
          label: "示例值",
          type: "text",
        },
        {
          width: "120",
          prop: "creatrNm",
          label: "创建人",
          tooltip: true,
          type: "text",
        },
        {
          width: "120",
          prop: "crtTm",
          label: "创建时间",
          type: "text",
          filter: "crtTm",
        },
      ],
      // 示例列表信息
      dataList: [],
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
        //   label: "",
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
        // {
        //   label: "操作",
        //   type: "button",
        //   width: "50",
        //   buttonList: [
        //     {
        //       desc: "删除",
        //       operate: "delete",
        //     },
        //   ],
        // },
      ],
      // 导航栏参数
      // breadcrumbs: [
      //   {
      //     label: "数据字典管理",
      //     operate: "list",
      //   },
      //   {
      //     label: "查看数据字典",
      //   },
      // ],
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
        dictryDescr: "", // 参数描述
        // dictryGateg: "", // 
        dictryTyp: "string", // 参数类型
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
            validator: validate.isChinese,
          },
        ],
        dictryDescr: [
          { required: true, trigger: "blur", message: "请输入参数描述" },
        ],
        dictryTyp: [
          { required: true, trigger: "blur", message: "请选择参数类型" },
        ],
        // dictryGateg: [
        //   { required: true, trigger: "change", message: "请选择" },
        // ],
      },
      // 列表
      dictGategList: [],
      type: ""
    };
  },
  methods: {
    // 导航栏点击
    // labelClick(e) {
    //   if (e == "list") {
    //     this.$router.go(-1);
    //   }
    // },
    enumCondition() {
      return enumCondition(this.formData.dictryTyp)
    },
    // 获取列表
    async getDictExampleList() {
      const data = {
        dictryId: this.dictryId,
      };
      const res = await this.rpc.systemmgmt.getDictExampleList(data);
      this.dataList = res.dictExampleList;
    },
    getClsfNm() {
      const obj = this.dictGategList.find(
        (item) => item.clsfId == this.formData.dictryGateg
      );
      return (obj && obj.clsfNm) || "";
    },
    operate(operation, data) {
      // console.log(operation, data)
      if (operation == "delete") {
        this.iInputList = this.iInputList.filter(
          (item) => item.dictryId != data.dictryId
        );
      }
    },
    handleCancel() {
      if (this.type !== "public") {
        this.$emit("toDicList");
      } else {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list",
        });
      }
    },
    // 获取列表
    async getTypeList() {
      const params = { turnPageShowNum: "0",excludeClsfId: "10000000"  };
      const res = await this.rpc.systemmgmt.getClassifyTypeList(params);
      this.dictGategList = res.serviceList;
    },
    // 导航栏点击
    // labelClick(e) {
    //   this.$router.push({
    //     path: "/aop_tradedesign/dicmgmt/list",
    //   });
    // },
    // 进入编辑页面时查询详情
    async getDictionaryInfoById() {                                                                                                                           
      const params = {
        dictryId: this.dictryId,
      };
      const api = this.apiType == "sys" ? "getSysDicDetail" : "editList"
      const res = await this.rpc.systemmgmt[api](params);
      this.formData = res;
      this.dicGetNodeId(res.dictChildList);
      this.iInputList = JSON.parse(JSON.stringify(res.dictChildList));
      if (this.enumCondition()) {
        if (res.dictryEnum !== "") {
          this.$refs.enumRef.enumerateValueList = res.dictryEnum
            .split(";")
            .map((item) => {
              const arr = item.split("-");
              return {
                key: arr[0],
                value: arr[1],
              };
            });
        } else {
          this.$refs.enumRef.enumerateValueList = [];
        }
        this.$refs.ruleRef.ruleTableData = res.ruleList;
      }
    },

    async getApprInfo() {
      const params = {
        aplySrlNo: this.aplySrlNo,
      }
      const data = await this.rpc.systemmgmt.getBatchParmasDetail(params)
      const res = data.sourceDictInfo
      this.formData = res;
      this.dicGetNodeId(res.dictChildList);
      this.iInputList = JSON.parse(JSON.stringify(res.dictChildList));
      if (res.dictryTyp == "String") {
        if (res.dictryEnum !== "") {
          this.$refs.enumRef.enumerateValueList = res.dictryEnum
            .split(";")
            .map((item) => {
              const arr = item.split("-");
              return {
                key: arr[0],
                value: arr[1],
              };
            });
        } else {
          this.$refs.enumRef.enumerateValueList = [];
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
      // this.getTypeList();
      if (this.type == "public") {
        this.dictryId = this.$route.query.dictryId || "";
      }
      if (this.apprType == "approved") {
        console.log("78",this.aplySrlNo)
        this.getApprInfo()
      }else {
        this.getDictionaryInfoById();
      }
      this.getDictExampleList()
    },
  },
  created() {
    this.init();
  },
  filters: {
    ...filters,
  },
  watch: {
    dictryId(n,o) {
      this.init()
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_dicmgmt_dictionaryDetail {
  .create_content_wrapper {
    padding: 16px 24px;
    .detail_content {
      background: $base_white;
      padding: 20px 32px;
      margin-bottom: 16px;
      .content_header {
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
        margin-bottom: 20px;
      }
      .content_body {
        display: flex;
        flex-wrap: wrap;
        .list_item {
          width: 50%;
          margin-bottom: 16px;
          .list_item_key {
            color: $sec_ft_color;
          }
          .list_item_value {
            color: $pri_ft_color;
            &.click_text {
              color: $theme_color;
              cursor: pointer;
            }
          }
        }
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
    .detail_content_bottom {
      margin-bottom: 0px;
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
    // margin-top: 16px;
    ::v-deep .el-table th {
      line-height: 0;
      color: $sec_ft_color;
    }
  }

}
</style>
