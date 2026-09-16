<template>
  <div class="conditionalBranchDrawer">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>
          <span>条件分支</span>
        </div>
      </div>
      <div v-if="endActionType == '00'">
        <conditionalBranch 
          :currentCompInfo="currentCompInfo" 
          :currentServObj="currentServObj"
          v-for="(item, i) in conditions"
          :key="i"
          :sequence="i + 1"
          :isRead="false"
          :ref="getRefName(i)"
          :baseBranchInfo="item"
          :isComponent="false"
          @operate="selectOperate"
        />
      </div>
      
      <!-- 抛出错误 -->
      <div v-else>
        <throwError
          v-for="(item, index) in conditions"
          :key="index"
          :compSeqNo="index"
          :isRead="false"
          :ref="getRefErrorName(index)"
          :baseBranchInfo="item"
          :currentCompInfo="currentCompInfo" 
          :currentServObj="currentServObj"
          :isComponent="false"
          @operate="selectOperate"
        />
      </div>
    </div>
    <div
      class="attr_btn"
    >
      <el-button
        type="primary"
        size="small"
        :disabled="disabled"
        @click="saveBranch"
        class="right_button"
        >保存</el-button
      >
    </div>

    <!-- 输出目标-选择输出字段 -->
    <SelectOutputField
      ref="selectOutputFieldRef"
      :currentServObj="currentServObj"
      @setOutputTarget="setOutputTarget"
    ></SelectOutputField>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";

import conditionalBranch from "@m/core/components/service_design/components/ConditionalBranch"
import throwError from "@m/core/components/service_design/components/ThrowError"

import SelectOutputField from "./service_setting/selectOutputField"

export default {
  mixins: [mixin],
  components: {
    conditionalBranch,
    throwError,
    SelectOutputField
  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    relId: {

    }
  },
  data() {
    return {
      endActionType: '',
      conditions: [],
      disabled: false
    };
  },
  computed: {
  },
  inject: ["getDataList", "setCurrentActionId"],
  methods: {
    selectOperate(operate, info, index) {
      this.outputTargetOperate(operate, info, index)
    },

    outputTargetOperate(operation, data, index = -1) {
      this.operateType = operation
      if (operation == "paramNm") {
        this.$refs.selectOutputFieldRef.showDialog(data, this.formData)
      } else if (operation === 'paramValue') {
        this.$refs.selectOutputFieldRef.showDialog(data, this.formData, 'paramValueSrcActionId')
      }
    },

    setOutputTarget(type, target, obj) {
      if (this.operateType === 'paramValue') {
        target.paramValue = obj.paramKey
        target.paramValueType = obj.paramType
        target.paramValueNm = obj.paramCName
      } else if (type == "paramNm") {

        // paramValueType 参数值类型
        // paramKeySrcType 参数Key来源类型
        // paramValueSrcType 参数值来源类型
        // paramValueSrcActionId 参数值来源组件ID
        // target.paramKey = obj.paramKey
        // target.paramNm = obj.paramCName
        // target.paramType = obj.paramType
        this.$set(target, 'paramNm', obj.paramCName);
        this.$set(target, 'paramKey', obj.paramKey);
        this.$set(target, 'paramType', obj.paramType);
        if (["List", "Object"].includes(target.paramType)) {
          target.paramValue = "null"
          target.condTyp = "="
        }
      }
    },

    async saveBranch() {
      this.disabled = true
      let conditionalBranchInfo = {}
      if (this.endActionType == '00') {
        conditionalBranchInfo = this.$refs['conditionalBranch' + 0][0].dataOutput()
      } else {
        conditionalBranchInfo = this.$refs['throwError' + 0][0].dataOutput()
      }
      

      if(this.conditions.length ) {
        const keyToErrorMessage = {
          actionId: "来源不能为空",
          paramKey: "来源值不能为空",
          condTyp: "对比关系不能为空",
          paramValueSrcActionId: "对比来源不能为空",
          paramValue: "对比来源值不能为空"
        }
        let list = JSON.parse(conditionalBranchInfo.executeConditionJson)
        for (let key in keyToErrorMessage) {
          if (list.some(item => !item[key])) 
          {
            this.disabled = false
            return this.$message.error(keyToErrorMessage[key])
          }
          
        }
        if(list.length > 1) {
          if (list.slice(0, -1).some(item => !item['groupOperator'])) {
            this.disabled = false
            return this.$message.error('关系符不能为空')
          }
        }
      }
      // this.$emit("upDateServParams", JSON.parse(JSON.stringify(this.currentObj)), params, layoutServiceBeanList);
      this.$emit('conditionalBranchSave', conditionalBranchInfo)
      this.disabled = false
    },
    /**
     * addInterfaceProcessActionLayoutRel
     * 修改接口流程组件编排关系
     */
    async updateInterfaceProcessActionLayoutRel() {
      let conditionalBranchInfo = this.$refs['conditionalBranch' + 0][0].dataOutput()

      if(this.conditions.length ) {
        const keyToErrorMessage = {
          actionId: "来源不能为空",
          paramKey: "来源值不能为空",
          condTyp: "对比关系不能为空",
          paramValueSrcActionId: "对比来源不能为空",
          paramValue: "对比来源值不能为空"
        }
        let list = JSON.parse(conditionalBranchInfo.executeConditionJson)
        for (let key in keyToErrorMessage) {
          if (list.some(item => !item[key])) 
          {
            this.disabled = false
            return this.$message.error(keyToErrorMessage[key])
          }
          
        }
        if(list.length > 1) {
          if (list.slice(0, -1).some(item => !item['groupOperator'])) {
            this.disabled = false
            return this.$message.error('关系符不能为空')
          }
        }
      }
      const { relId } = await this.rpc.d4.addOrUpdateInterfaceProcessActionLayoutRel({
          relId: conditionalBranchInfo.relId,
          tranId: conditionalBranchInfo?.tranId,
          startActionId: conditionalBranchInfo.startActionId,
          endActionId: conditionalBranchInfo.endActionId,
          relDesc: conditionalBranchInfo.relDesc,
          relDescType: conditionalBranchInfo.relDescType,
          endActionType: conditionalBranchInfo.endActionType,
          exceptionActionInfo: conditionalBranchInfo.exceptionActionInfo,
          executeConditionJson: conditionalBranchInfo.executeConditionJson,
      })
      this.disabled = false
      this.$notify({
          title: "成功",
          message: "保存成功",
          duration: 2000,
          type: "success",
      });
      this.queryInterfaceProcessActionLayoutRel(relId)
    },
    async init(e) {
      console.log(e, 'e---------branch-init')
      this.endActionType = e.endActionType
      this.conditions = []
      //组装数据
      this.conditions.push(e)
      // this.queryInterfaceProcessActionLayoutRel(e.relId)
    },
    /**
     * 查询编排关系
     */
    async queryInterfaceProcessActionLayoutRel(relId) {
      this.conditions = []
      const res = await this.rpc.d4.queryInterfaceProcessActionLayoutRel({
        relId
      })
      //组装数据
      this.conditions.push(res)
    },

    // 动态生成每个组件的 ref 名称
    getRefName(index) {
      return 'conditionalBranch' + index;
    },

    getRefErrorName(index) {
      return 'throwError' + index;
    },

  },
  created() {
  },
  
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.conditionalBranchDrawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  .mt10 {
    margin-top: 10px;
  }
  .bold_text {
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #111111;
    letter-spacing: 0;
  }
  .width_move {
    width: 1px;
    position: absolute;
    left: 0px;
    height: 100%;
    cursor: w-resize;
    background: #f5f5fa;
    z-index: 1;
  }
  .trigger_diy {
    position: absolute;
    left: -22px;
    top: 50%;
    width: 11px;
    height: 84px;
    line-height: 84px;
    color: #fff;
    font-size: 18px;
    padding-right: 10px;
    cursor: pointer;
    transition: background 0.3s ease;
    z-index: 200;
    background: rgba(0, 0, 0, 0);
    border-top: 11px solid rgba(0, 0, 0, 0);
    border-bottom: 11px solid rgba(0, 0, 0, 0);
    border-right: 11px solid #409eff;
    i {
      margin-left: 7px;
      margin-top: -25px;
      vertical-align: middle;
    }
  }
  .trigger_diy_without_sidebar {
    transform: rotate(180deg);
    transform-origin: 100% 50% 0;
  }
  .attr_main {
    height: 100%;
    ::v-deep .el-table__cell {
      padding: 8px 0;
      .cell {
        span {
          font-size: 12px;
        }
      }
    }
    ::v-deep tr {
      .cell {
        font-size: 12px;
        // padding: 0;
      }
    }
  }
  .attr_title {
    padding: 0px 20px;
    font-family: $font_medium;
    font-weight: 600;
    height: 44px;
    line-height: 44px;
    &.flex {
      display: flex;
      justify-content: space-between;
      .right_btn {
        color: $theme_color;
        cursor: pointer;
      }
    }
    .btn {
      margin-left: 4px;
    }
  }
  .attr_pre_title {
    // padding: 8px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    &.underline {
      border-bottom: 1px solid $pri_br_color;
    }
    &.mb0 {
      margin-bottom: 0;
    }
    .el-icon-arrow-down {
      cursor: pointer;
      &.hidden {
        transform: rotate(180deg);
      }
    }
    .el-icon-more {
      cursor: pointer;
    }
    .attr_pre_title_b {
      color: $reg_ft_color;
      display: inline-block;
      margin-right: 10px;
      &.bold {
        font-weight: 600;
      }
    }

    .allocBtn {
        background: transparent;
        border-radius: 4px;
        color: #358aff;
        border: 1px solid #358aff;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        cursor: pointer;

        .icon {
            height: 16px;
            width: 16px;
            background: url("~@m/assets/images/icon_add_blue.png") no-repeat;
            background-size: 100% auto;
        }
    }

    .allocBtn:hover {
        background-color: rgba(#358aff, 0.1);
    }
  }
  .attr_content {
    background-color: $base_bg_color;
    padding: 20px 10px;
  }
  .attr_box {
    height: calc(100% - 47px);
    overflow-y: scroll;
    padding-bottom: 30px;
    &.mt10 {
      margin-top: 10px;
    }
    .base_info {
      margin: 10px 20px 0;
      border-bottom: 1px solid  #E7E7EE;
      .base_info_list {
        .item {
          margin-bottom: 10px;
          .title {
            display: inline-block;
            color: #999;
            white-space: nowrap;
            width: 70px;
            text-align: right;
          }
          .content {
            color: #333;
          }
          &:nth-last-child(1) {
            margin-bottom: 16px;
          }
        }
      }
    }
  }
  .attr_show {
    padding: 0px 20px;
    overflow: hidden;
    .attr_show_item {
      margin-bottom: 10px;
      overflow: hidden;
      position: relative;
      font-size: 14px;
      &.flex {
        display: flex;
        .item_title {
          width: 80px;
          padding-right: 4px;
          padding-top: 4px;
          text-align: right;
          font-size: 12px;
          font-weight: $font_weight_600;
          white-space: nowrap;
          &.required_fields {
            &::before {
              content: "*";
              color: $sec_danger_color;
              margin-right: 2px;
            }
          }
          &.w68 {
            width: 68px;
          }
        }
        .item_value {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          ::v-deep .el-textarea__inner {
            height: 80px;
          }
          &.select {
            ::v-deep .el-input--suffix {
              font-size: 12px;
            }
          }
          &.text {
            font-size: 12px;
            padding-top: 4px;
          }
        }
      }
      &.mb20 {
        margin-bottom: 20px;
      }
      &.pb20 {
        padding-bottom: 20px;
      }
      &.border_bottom {
        border-bottom: 1px solid #E7E7EE;
      }
      .can_select {
        user-select: text;
      }
      .sub_title {
        font-size: 12px;
        margin-bottom: 6px;
      }
      .attr_show_item_t {
        // width: 100%;
        // margin-right: 10px;
        // margin-bottom: 10px;
        padding: 5px 5px 0 0;
        // font-weight: $font_weight_600;
        white-space: nowrap;
        min-width: 100px;
        text-align: right;
        .attr_show_item_i {
          font-weight: 400;
          white-space: normal;
          word-break: break-all;
        }
        &.flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title {
            width: 64px;
          }
          .content {
            flex: 1;
          }
          .right_btn {
            color: $theme_color;
            cursor: pointer;
          }
        }
        &.required {
          &::before {
            content: "*";
            color: red;
          }
        }
        &.textLeft {
          text-align: left;
        }
      }
      .attr_show_item_c {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.textarea {
          ::v-deep .el-textarea__inner {
            min-height: 60px !important;
          }
        }
        &.left {
          padding-right: 4px;
        }
        &.right {
          padding-left: 4px;
        }
        ::v-deep .el-select {
          width: 100%;
        }
      }
      .attr_show_item_b {
        position: absolute;
        right: 0;
        top: 0;
        ::v-deep .el-button {
          @include mini_button_common;
          height: 20px;
          &.el-button--default.is-plain {
            border-color: $sec_ft_color;
            color: $sec_ft_color;
            &:hover,
            &:focus {
              color: $sec_ft_color;
            }
          }
          &.el-button--danger.is-plain {
            border-color: $danger_color;
            &:hover,
            &:focus {
              color: $danger_color;
            }
          }
          &.el-button--primary {
            background-color: $theme_color;
            border-color: $theme_color;
          }
          &.is-plain {
            background-color: $base_white;
            &:hover,
            &:focus {
              color: $theme_color;
            }
          }
        }
        .el-icon-more {
          cursor: pointer;
        }
      }
    }
  }
  .attr_send {
    padding: 8px 20px;
    ::v-deep .el-input__suffix {
      color: #333;
    }
  }
  .attr_recive {
    padding: 8px 20px;
    &.mb20 {
      margin-bottom: 20px;
    }
    .text_btn {
      color: $theme_color;
      cursor: pointer;
      font-size: 10px;
    }
  }
  .underLine {
    border-bottom: 1px solid $pri_br_color;
  }
  .attr_set_f {
    width: 68px;
    margin-right: 10px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ::v-deep .el-input--mini .el-input__inner {
      height: 24px;
    }
  }
  .attr_set_s {
    width: 116px;
    margin-right: 5px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .attr_set_ad {
    font-size: 16px;
    height: 24px;
    line-height: 24px;
    width: 16px;
    float: right;
    color: $reg_ft_color;
    cursor: pointer;
  }
  .attr_set_t {
    width: 16px;
    float: right;
    .key_action {
      font-size: 16px;
      height: 24px;
      line-height: 24px;
    }
    i {
      cursor: pointer;
    }
  }
  .attr_set_l {
    width: 186px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .key_title {
    padding: 0px 0px 8px;
    overflow: hidden;
    color: $sec_ft_color;
    display: flex;
    justify-content: space-between;
  }
  .key_list {
    overflow: hidden;
    .key_item {
      margin-bottom: 5px;
      overflow: hidden;
      .attr_set_f_ml {
        margin-left: 10px;
      }
      ::v-deep .el-input__inner {
        line-height: 28px;
        border: 1px solid $pri_br_color;
        border-radius: $theme_radius;
        height: 28px;
        color: $reg_ft_color;
        padding: 0 5px;
      }
    }
  }

  ::v-deep .el-input__inner {
    line-height: 32px;
    border: 1px solid $pri_br_color;
    border-radius: $theme_radius;
    height: 32px;
    color: $reg_ft_color;
  }
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  ::v-deep .el-table thead tr th {
    background-color: $table_bg_color;
  }
  .line_dialog_conf {
    .add_conf {
      padding: 15px 20px;
      border-bottom: 1px solid $pri_br_color;
      display: flex;
      align-items: center;
      .add_conf_s {
        width: 90px;
      }
      .add_conf_t {
        width: 90px;
      }
      .add_conf_btn {
        // float: right;
        margin-left: auto;
      }
    }
    .add_condition {
      padding: 15px 20px;
      border-bottom: 1px solid $pri_br_color;
      .add_condition_k {
        width: 110px;
        margin-right: 2px;
      }
      .add_condition_btn {
        cursor: pointer;
      }
      .hidden {
        visibility: hidden;
      }
    }
    .add_content {
      padding: 15px 20px;
      .add_content_t {
        margin-bottom: 15px;
        font-family: $font_medium;
      }
      .add_content_l {
        padding: 15px;
        background-color: $base_bg_color;
      }
    }
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
  .attr_tabs {
    display: flex;
    // justify-content: center;
    background-color: $base_white;
    width: 100%;
    border-bottom: 2px solid #dcdfe6;
    box-shadow: 0 1px 10px 0 #e7e7e7;;
    // ::v-deep .el-tabs__active-bar {
    //   width: 50px !important;
    // }
    ::v-deep .el-tabs__nav-wrap::after {
      background-color: $base_white;
    }
    ::v-deep .el-tabs__header {
      margin: 0;
      .el-tabs__item {
        height: 50px;
        line-height: 50px;
        font-size: 12px;
        padding: 0 15px;
        font-family: $font_medium;
        letter-spacing: 0;
        min-width: 78px;
        text-align: center;
        &.is-active {
          font-weight: $font_weight_600;
        }
      }
    }
    ::v-deep .el-tabs__content {
      display: none;
    }
  }
  .form {
    width: 70%;
    margin: 24px auto;
  }
  .attr_btn {
    @include attr_btn;
  }
  .service_edit_form {
    ::v-deep .el-form-item__label {
      font-size: 12px;
    }
  }
  .service_edit_form_info {
    margin-bottom: 16px;
    .el-form-item {
      margin-bottom: 8px;
    }
  }
  .rule_dialog {
    padding: 15px 24px;
    .rule_dialog_item {
      margin-bottom: 10px;
    }
  }
  .table ::v-deep .wraning_row {
    display: none;
  }
  .table {
    &.input_list {
      ::v-deep .el-input__inner {
        cursor: pointer;
      }
    }
    ::v-deep .el-table {
      &::before {
        display: none;
      }
    }
  }
  .el-menu {
    border-right: 0;
    ::v-deep .is-active {
      color: #303133;
    }
    .is_active {
      color: $theme_color;
      background-color: #eaf1ff;
      font-weight: $font_weight_600;
    }
    ::v-deep .el-menu-item {
      padding-left: 10px !important;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      letter-spacing: 0;
    }
  }
  .list_item_tag {
    font-size: 12px;
    padding: 0 3px;
    border-radius: $theme_radius;
    // margin-right: 4px;
    transform: scale(0.7);
    height: 20px;
    line-height: 20px;
    text-align: center;
    margin-left: 5px;
    &.outside {
      color: #ff934b;
      background: #fff4e5;
      font-size: 14px;
    }
  }
  .transition_arrange {
    .transition_arrange_title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    padding: 12px 0;
    ::v-deep .el-select__caret {
      color: #333;
      transform: rotateZ(0);
      &::before {
        content: "\e790"
      }
    }
    .tips_info {
      margin-top: 10px;
    }
  }
  .exception_message {
    margin-bottom: 30px;
    .tips_info {
      margin-top: 10px;
    }
  }
  .add_line_group {
    float: right;
    margin-bottom: 10px;
    margin-top: 10px;
    margin-left: 10px;
  }
}
</style>
