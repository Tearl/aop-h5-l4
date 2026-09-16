<template>
  <div class="aop_tradedesign_page_dicmgmt_modDictionary">
    <DictionaryForm ref="modRef" pageType="mod" :apiType="apiType" :sysId="sysId" :dictryId="dictryId" @toDicList="toDicList" @toDetail="toDetail"></DictionaryForm>
  </div>
</template>
<script>
import DictionaryForm from "./components/sys_dic/components/dic_form";

export default {
  components: {
    DictionaryForm
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
    }
  },
  data() {
    return {
    };
  },
  methods: {
    toDicList() {
      this.$emit("toDicList");
    },
    toDetail(e) {
      this.$emit("toDetail", e);
    },
    getDetail() {
      this.$refs.modRef.getDictionaryInfoById(this.dictryId)
    },
    //初始化
    init() {
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_dicmgmt_modDictionary {
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
      ::v-deep tr td{
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
  .table_class ::v-deep.el-table  tr {
    height: 75px;
  }
  .table_class ::v-deep.input_error .el-input__inner{
    border-color: #F56C6C;
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
