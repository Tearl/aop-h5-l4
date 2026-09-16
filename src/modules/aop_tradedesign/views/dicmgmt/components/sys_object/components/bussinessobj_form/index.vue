<template>
  <div class="aop_tradedesign_comps_dicmgmt_bussinessobj_form">
    <div class="create_content_wrapper">
      <div class="detail_content">
        <div class="content_header nav_title">
          {{ type === "add" ? "创建业务对象" : "编辑业务对象" }}
        </div>
        <el-form
          :model="formData"
          :rules="rules"
          class="service_create_form"
          ref="formData"
          label-width="130px"
        >
          <div class="service_create_form_info">
            <el-form-item label="业务对象名称" prop="bsnObjNm">
              <el-input
                v-model="formData.bsnObjNm"
                clearable
                placeholder="请输入业务对象名称"
                show-word-limit
              >
              </el-input>
            </el-form-item>
            <el-form-item label="业务对象英文名" prop="bsnObjCd">
              <el-input
                v-model="formData.bsnObjCd"
                clearable
                maxlength="100"
                placeholder="请输入业务对象英文名"
              >
              </el-input>
            </el-form-item>

            <el-form-item label="所属领域" prop="domainId">
              <el-select
                v-model="formData.domainId"
                placeholder="请选择所属领域"
                clearable
              >
                <el-option
                  v-for="item in domainInfoList"
                  :label="item.domainNm"
                  :key="item.domainId"
                  :value="item.domainId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="业务对象描述" prop="bsnObjDesc">
              <el-input
                type="textarea"
                v-model="formData.bsnObjDesc"
                clearable
                placeholder="请输入业务对象描述"
              >
              </el-input>
            </el-form-item>

            <el-form-item
              label="属性列表"
              class="no_before"
            >
              <el-button
                class="add_params_button"
                icon="el-icon-plus"
                type="primary"
                @click="addDicParams"
                >从数据字典添加</el-button
              >
              <el-button
                class="add_params_button"
                icon="el-icon-plus"
                type="primary"
                @click="addBusParams"
                >从业务对象添加</el-button
              >
              <Table
                class="table_style"
                :data="propList"
                :table="propListTable"
                rowK="serialNumber"
                :cellStyle="dictListCellStyle"
                @operate="operate"
              ></Table>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <DictionarySelect
      ref="dictionaryRef"
      :dialogVisible="dictionaryDialogVisible"
      :sysId="sysId"
      @closeDialog="dictionaryCloseDialog"
      @setDictChildList="setDictChildList"
    >
    </DictionarySelect>

    <BussinessobjSelect
      ref="bussinessobjRef"
      :dialogVisible="bussinessobjDialogVisible"
      @closeDialog="bussinessobjCloseDialog"
      @setDictChildList="setObjChildList"
      :bsnObjId="bsnObjId"
    >
    </BussinessobjSelect>
  </div>
</template>
<script>
import Table from "@m/core/components/page_table";
import mixin from "@m/core/mixin";
import validate from "@m/utils/validate";
import DictionarySelect from "./dictionary_select";
import BussinessobjSelect from "./bussinessobj_select";
import { unduplicated, setSerialNumber } from "@m/utils/array";

export default {
  mixins: [mixin],
  components: {
    Table,
    DictionarySelect,
    BussinessobjSelect
  },
  props: {
    type: {
      type: String,
      default: () => "add",
    },
    bsnObjId: {
      type: String,
      default: () => "",
    },
    sysId: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      propList: [],
      // 添加输入参数列表参数
      propListTable: [
        {
          prop: "propId",
          label: "属性ID",
          width: "100",
          type: "text",
          tooltip: true,
        },
        {
          prop: "propNm",
          width: "160",
          label: "属性名称",
          type: "input",
          inputStyle: "width: 120px",
          disabled: function(scope) {
            return scope.row.propType === "0"
          },
        },
        {
          prop: "propCd",
          width: "120",
          label: "属性英文名称",
          type: "text",
          tooltip: true,
        },
        {
          prop: "propType",
          label: "属性来源",
          width: "100",
          type: "text",
          filter: "propType",
          tooltip: true,
        },
        {
          prop: "propGateg",
          label: "属性类型",
          width: "160",
          inputStyle: "width: 120px",
          type: "select",
          selectVal: [
            {
              type: "Object",
              value: "Object"
            },
            {
              type: "List",
              value: "List"
            },
          ],
          disabled: function(scope) {
            return scope.row.propType === "0"
          },
        },
        {
          label: "操作",
          type: "button",
          width: "100",
          buttonList: [
            {
              desc: "删除",
              operate: "delete",
            },
          ],
        },
      ],
      selectVal: [
        { type: "Object", value: "Object" },
      ],
      // 编辑页面时传过来的id值
      dictryId: "",
      // 表单数据
      formData: {
        bsnObjNm: "", // 参数中文名称
        bsnObjCd: "",
        domainId: "",
        bsnObjDesc: ""
      },
      //服务资产基本信息绑定的验证规则
      rules: {
        bsnObjNm: [
          {
            required: true,
            trigger: "blur",
            message: "请输入业务对象名称",
          },
          {
            required: true,
            trigger: "blur",
            message: "请输入中文",
            validator: validate.containChinese,
          },
        ],
        bsnObjCd: [
          {
            required: true,
            trigger: "blur",
            message: "请输入业务对象英文名",
          },
          {
            required: true,
            trigger: "blur",
            message: "请输入英文",
            validator: validate.isEnglish,
          },
        ],
        domainId: [
          { required: true, trigger: "blur", message: "请选择所属领域" },
        ],
      },
      // 所属分类列表
      domainInfoList: [],
      // 数据字典选择弹框
      dictionaryDialogVisible: false,
      bussinessobjDialogVisible: false,
    };
  },
  methods: {
    operate(operation, data) {
      if (operation == "delete") {
        this.propList = this.propList.filter(
          (item) => item.propId != data.propId
        );
      }
    },
    // 添加子参数
    addDicParams() {
      this.dictionaryDialogVisible = true;
      // this.$nextTick(() => {
      //   // this.
      // })
    },
    // 数据字典选择弹框取消
    dictionaryCloseDialog() {
      this.dictionaryDialogVisible = false;
    },
    addBusParams() {
      this.bussinessobjDialogVisible = true
    },
    bussinessobjCloseDialog() {
      this.bussinessobjDialogVisible = false
    },
    setDictChildList(data) {
      data.forEach((item) => {
        const d = {
          propId: item.dictryId,
          propCd: item.dictryNo,
          propNm: item.dictryNm,
          propType: "0",
          propGateg: item.dictryTyp
        }
        this.propList.push(d)
      })
      this.propList = unduplicated(this.propList, "propId");
      this.dictionaryCloseDialog();
    },
    setObjChildList(data) {
      data.forEach((item) => {
        const d = {
          propId: item.bsnObjId,
          propCd: item.bsnObjCd,
          propNm: item.bsnObjNm,
          propType: "1",
          propGateg: "Object"
        }
        this.propList.push(d)
      })
      this.propList = unduplicated(this.propList, "propId");
      this.bussinessobjCloseDialog();
    },
    async getDomainList() {
      const res = await this.rpc.systemmgmt.getDomainList()
      this.domainInfoList = res.domainInfoList
    },
    //初始化
    init() {
      this.getDomainList();
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_bussinessobj_form {
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
    ::v-deep .el-input__inner{
      width: 150px;
    }
    ::v-deep .el-input {
      width: 150px !important;
    }
  }
}
</style>
