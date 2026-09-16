<template>
  <div class="aop_tradedesign_dic_cmps_data_set_form_serv_Info">
    <el-form
      ref="formRef"
      :model="servForm"
      :rules="rules"
      label-width="130px"
      class="edit_form"
    >
      <div class="header_title">基本信息</div>
      <el-form-item label="所属数据集" prop="">
        <span>{{ infoData.dataSetNm }}</span>
      </el-form-item>
      <el-form-item label="服务类型" prop="svcTyp">
        <el-radio-group
          v-model="servForm.svcTyp"
          @change="radioChange"
          :disabled="editFlag"
        >
          <el-radio label="D5自有服务">自有服务</el-radio>
          <el-radio label="D5直连服务">直连服务</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="服务名称" prop="svcNm">
        <el-input
          placeholder="请输入服务名称"
          v-model="servForm.svcNm"
        ></el-input>
      </el-form-item>
      <el-form-item label="服务编码" prop="svcNo">
        <el-input
          placeholder="请输入服务编码"
          v-model="servForm.svcNo"
        ></el-input>
      </el-form-item>
      <el-form-item label="服务版本" prop="svcVer">
        <div class="form_item_flex">
          <el-input v-model="servForm.svcVer" clearable placeholder="1.0.0" />

          <span class="icon_right">
            <i class="el-icon-caret-top" @click="iconClick('add')"></i>
            <i class="el-icon-caret-bottom" @click="iconClick('lose')"></i>
          </span>
        </div>
      </el-form-item>
      <el-form-item label="参与方" prop="apiServiceParticipater">
        <el-input
          placeholder="请输入参与方"
          v-model="servForm.apiServiceParticipater"
        ></el-input>
      </el-form-item>
      <el-form-item label="服务作用" prop="svcDesc">
        <el-input
          type="textarea"
          :rows="3"
          v-model="servForm.svcDesc"
          clearable
          placeholder="请输入服务作用"
          :maxlength="length"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { getSessionStorage } from "@m/utils/localStorage.js";

export default {
  mixins: [mixin],
  components: {},
  props: {
    // 数据集信息
    infoData: {
      type: String,
      default: () => {},
    },
    editFlag: {
      type: Boolean,
      default: () => false
    },
  },
  data() {
    return {
      servForm: {
        svcTyp: "D5自有服务",
        svcNm: "",
        svcNo: "",
        svcVer: "1.0.0",
        apiServiceParticipater: "",
        svcDesc: "",
      },
      rules: {
        svcTyp: [
          { required: true, trigger: "blur", message: "请选择服务类型" },
        ],
        svcNm: [{ required: true, trigger: "blur", message: "请输入服务名称" }],
        svcNo: [{ required: true, trigger: "blur", message: "请输入服务编码" }],
        svcVer: [
          { required: true, trigger: "blur", message: "请输入服务版本" },
        ],
        apiServiceParticipater: [
          { required: true, trigger: "blur", message: "请输入参与方" },
        ],
        svcDesc: [
          { required: true, trigger: "blur", message: "请输入服务作用" },
        ],
      },
      //选择数据字典参数弹窗
      addVisible: false,
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索参数名称、中文名或描述",
          style: {
            width: "260px",
          },
        },
        {
          type: "select",
          model: "paraType",
          placeholder: "参数值类型",
          select: [
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
      ],
      // 当前数据
      dataObj: {},
      dataSetNm: "",
      groupId: "",
      arsId: "",
    };
  },
  methods: {
    init() {},
    radioChange(e) {
      this.$emit("radioChange", e);
    },

    // 版本号增减点击
    iconClick(e) {
      this.$refs.formRef.validateField(["svcVer"], (valid) => {
        if (!!valid) return;
        if (e == "add") {
          let list = this.servForm.svcVer.split(".");
          list[2] = Number(list[2]) + 1;
          if (list[2] > 9) {
            list[2] = 0;
            list[1] = Number(list[1]) + 1;
            if (list[1] > 9) {
              list[1] = 0;
              list[0] = Number(list[0]) + 1;
              if (list[0] > 9) return;
            }
          }
          let n = list.join(".");
          this.servForm.svcVer = n;
        } else {
          let list = this.servForm.svcVer.split(".");
          list[2] = Number(list[2]) - 1;
          if (list[2] < 0) {
            list[2] = 9;
            list[1] = Number(list[1]) - 1;
            if (list[1] < 0) {
              list[1] = 9;
              list[0] = Number(list[0]) - 1;
              if (list[0] < 1) return;
            }
          }
          let n = list.join(".");
          this.servForm.svcVer = n;
        }
      });
    },
    resetForm() {
      this.$refs.formRef && this.$refs.formRef.resetFields();
      this.searchRecord = {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        dictryKeyWord: "", // 关键字
        paraType: "", // 类型
        paraGateg: "", // 所属分类
      };
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_cmps_data_set_form_serv_Info {
  background: $base_white;
  padding: 20px 24px;
  .edit_form {
    @include form;
    .header_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #131313;
      letter-spacing: 0;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .tips {
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
    /deep/ .el-input {
      width: 400px;
    }
    .no_before {
      ::v-deep .el-form-item__label::before {
        content: "";
      }
    }
  }
  .form_item_flex {
    display: flex;
    .icon_right {
      margin-left: 5px;
      display: flex;
      flex-flow: column;
      font-size: 21px;
      i {
        cursor: pointer;
        line-height: 20px;
      }
    }
  }
}
</style>
