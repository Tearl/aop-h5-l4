<template>
  <div class="aop_tradedesign_comps_design_attr_sql_attr">
    <div class="attr_main">
      <div class="attr_title underLine">
        <div>数据库组件</div>
      </div>
      <div class="attr_box">
        <div class="attr_show underLine">
          <div class="attr_show_item">
            <div class="attr_show_item_t">名称：<span v-if="isRead" class="attr_show_item_i">{{formData.actionDesc}}</span></div>
            <div class="attr_show_item_c" v-if="!isRead">
              <el-input :disabled="isRead" v-model="formData.actionDesc" size="mini"></el-input>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">数据库类型：<span v-if="isRead" class="attr_show_item_i">{{formData.actionType == '1' ? 'MySQL' : 'Oracle'}}</span></div>
            <div class="attr_show_item_c" v-if="!isRead">
              <el-select :disabled="isRead" v-model="formData.actionType" size="mini">
                <el-option
                  v-for="i in sqlTypeList"
                  :key="i.value"
                  :label="i.type"
                  :value="i.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">关键表：</div>
            <div class="attr_show_item_b">
              <el-button v-if="!isRead" type="primary" size="small" @click="addform"
                >添加</el-button
              >
            </div>
            <div class="attr_show_item_c">
              <Table
                class="table"
                :data="keyFormList"
                :table="isRead ? keyFormColumn.slice(0,2) : keyFormColumn"
                @operate="operate"
              ></Table>
            </div>
            <!-- <div
              v-for="(item, i) in actionExArray"
              :key="i"
              class="attr_show_item_c"
            >
              <el-input
                class="input"
                v-model="item.value" size="mini">
              </el-input>
              <span class="delete_btn" @click="deleteForm(i)">删除</span>
            </div> -->
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">关键字段：</div>
            <div class="attr_show_item_b">
              <el-button v-if="!isRead" type="primary" size="small" @click="addparams"
                >添加</el-button
              >
            </div>
            <div class="attr_show_item_c">
              <Table
                class="table"
                :data="dataList"
                :table="isRead ? tableColumn.slice(0,2) : tableColumn"
                @operate="operate"
              ></Table>
            </div>
          </div>
          <div class="attr_show_item">
            <div class="attr_show_item_t">伪代码描述：<span v-if="isRead" class="attr_show_item_i">{{formData.actionBs}}</span></div>
            <div class="attr_show_item_c" v-if="!isRead">
              <el-input
                :disabled="isRead"
                type="textarea"
                v-model="formData.actionBs"
                size="mini"
              ></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="attr_btn"
    >
      <el-button
        v-if="!isRead"
        type="primary"
        size="small"
        @click="saveParams"
        class="right_button"
        >保存</el-button
      >
    </div>
    <!-- 添加关键表弹窗 -->
    <PageDialog
      :dialogTitle="dialogTitle"
      :dialogVisiable="dialogVisible"
      dialogWidth="56.3%"
      @closeDialog="closeDialog"
    >
      <div slot="box">
        <div v-show="dialogTitle=='添加关键表'">
          <el-form
            :model="kform"
            :rules="kformRules"
            ref="kformRef"
            label-width="100px"
            class="form"
          >
            <el-form-item label="表名" prop="paramNm">
              <el-input v-model="kform.paramNm" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="表中文名" prop="paramDesc">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入"
                v-model="kform.paramDesc"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>

        <div v-show="dialogTitle=='添加关键字段'">
          <el-form
            :model="pform"
            :rules="pformRules"
            ref="pformRef"
            label-width="100px"
            class="form"
          >
            <el-form-item label="字段名" prop="paramNm">
              <el-input v-model="pform.paramNm" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="字段中文名" prop="paramDesc">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入"
                v-model="pform.paramDesc"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        
      </div>
      <span slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
      >
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import Table from "@m/core/components/page_table_workgate";
import PageDialog from "@m/core/components/page_dialog";

import { mixList, reList } from "@m/utils/paramTree";
import validate from "@m/utils/validate";

export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    isRead: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      formData: {
        actionBs: "",
        actionDesc: "数据库组件",
        actionType: "",
        actionParam: "",
      },
      dialogVisible: false,
      currentObj: {},
      cpnData: {},
      // 关键表输入数据
      kform: {
        paramNm: "",
        paramDesc: "",
      },
      // 关键表规则校验
      kformRules: {
        paramNm: [{ required: true, message: "请输入", trigger: "blur" }],
        paramDesc: [
          { required: true, message: "请输入", trigger: "blur" },
          { required: true, trigger: "blur", message: "请输入中文", validator: validate.containChinese },
        ],
      },
      // 关键表数据
      keyFormList: [],
      // 关键表列表参数
      keyFormColumn: [
        {
          prop: "paramNm",
          label: "表名",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramDesc",
          label: "表中文名",
          minWidth: "45%",
          type: "text",
          tooltip: true,
        },
        {
          label: "操作",
          minWidth: "25%",
          type: "button",
          buttonList: [
            {
              desc: "删除",
              operate: "keyFormDel",
            },
          ],
        },
      ],
      // 关键字段数据
      dataList: [],
      // 关键字段列表参数
      tableColumn: [
        {
          prop: "paramNm",
          label: "字段名",
          minWidth: "30%",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramDesc",
          label: "字段中文名",
          minWidth: "45%",
          type: "text",
          tooltip: true,
        },
        {
          label: "操作",
          minWidth: "25%",
          type: "button",
          buttonList: [
            {
              desc: "删除",
              operate: "del",
            },
          ],
        },
      ],
      // 关键字段输入数据
      pform: {
        paramNm: "",
        paramDesc: "",
      },
      // 关键字段规则校验
      pformRules: {
        paramNm: [{ required: true, message: "请输入", trigger: "blur" }],
        paramDesc: [
          { required: true, message: "请输入", trigger: "blur" },
          { required: true, trigger: "blur", message: "请输入中文", validator: validate.containChinese },
        ],
      },
      // 数据库类型下拉
      sqlTypeList: [
        { value: "1", type: "MySQL" },
        { value: "2", type: "Oracle" },
      ],
    };
  },
  computed: {
    blngtoTyp() {
      return this.currentServObj.apiServiceType.indexOf("D4") > -1 ? "10" : "11"
    }
  },
  methods: {
    async getParams(e, obj) {
      console.log("getParams", e, obj);
      this.currentObj = e
      if (!e.compositeId) {
        e.conf.map(item => {
          this.formData[item.name] = item.value
        })
        return;
      } else {
        const params = {
          d4StusCd: "1",
          blngtoTyp: this.blngtoTyp,
          compositeId: e.compositeId || "",
        };
        const res =this.typeInterface == "interfaceType" ? await this.rpc.apimgmt.getServiceCpnParams(params) : await this.rpc.d4.getServiceCpnParams(params);
        this.cpnData = res
        res.confList.map(item => {
          this.formData[item.confKey] = item.confValue
        })
        this.dataList = JSON.parse(this.formData.actionParams || "[]");
        this.keyFormList = JSON.parse(this.formData.actionEx || "[]");
      }
    },
    async saveParams() {
      // const paramList = JSON.parse(
      //   JSON.stringify(
      //     mixList(this.tableData, "children")
      //   )
      // );
      const d = JSON.stringify(this.dataList);
      this.formData.actionParams = d;
      this.formData.actionEx = JSON.stringify(this.keyFormList)

      const e = this.currentServObj
      const confList = this.cpnData.confList || []
      for (let i in this.formData)  {
        const target = confList.find(item => item.confKey == i)
        if (target) {
          target.confValue = this.formData[i]
        } else {
          confList.push({
            confKey: i,
            confValue: this.formData[i],
            confId: "",
            confDescr: "",
            compositeId: e.compositeId || "",
          })
        }
      }
      const params = {
        d4StusCd: "1",
        blngtoTyp: this.blngtoTyp,
        apiId: e.apiId,
        paramList: [],
        confList,
        compositeId: this.currentObj.compositeId || ""
      }
      const { compositeId } =this.typeInterface == "interfaceType"?await this.rpc.apimgmt.saveServiceCpnParams(params): await this.rpc.d4.saveServiceCpnParams(params);
      params.compositeId = compositeId
      this.$emit("upDateServParams", JSON.parse(JSON.stringify(this.currentObj)), params)
      // this.$emit("toSave", true)
    },
    // 添加参数
    addparams() {
      this.dialogTitle = "添加关键字段"
      this.dialogVisible = true;
      this.pform.paramNm = "";
      this.pform.paramDesc = "";
    },
    // 添加表
    addform() {
      console.log("addform")
      this.dialogTitle = "添加关键表"
      this.dialogVisible = true;
      this.kform.paramNm = "";
      this.kform.paramDesc = "";
      // this.actionExArray.push({value: ""})
    },
    // 确认参数
    confirm() {
      if (this.dialogTitle == "添加关键表") {
        this.$refs.kformRef.validate(valid => {
          if (!valid) return this.$message.error("基本信息填写有误或未填写");
          this.keyFormList.push(JSON.parse(JSON.stringify(this.kform)));
          this.closeDialog();
        })
      } else if (this.dialogTitle == "添加关键字段") {
        this.$refs.pformRef.validate(valid => {
          if (!valid) return this.$message.error("基本信息填写有误或未填写");
          this.dataList.push(JSON.parse(JSON.stringify(this.pform)));
          this.closeDialog();
        })
      }
    },
    closeDialog() {
      this.$refs.kformRef.resetFields()
      this.$refs.pformRef.resetFields()
      this.dialogVisible = false;
    },
    operate(operation, data) {
      if (operation == "del") {
        this.dataList = this.dataList.filter(item => (item.paramNm != data.paramNm || item.paramDesc != data.paramDesc))
      } else if (operation == "keyFormDel") {
        this.keyFormList = this.keyFormList.filter(item => (item.paramNm != data.paramNm || item.paramDesc != data.paramDesc))
      }
    },
    init() {
      if(this.$route.query.typeInterface){   //判断 作业太网关接口跳转过来
        this.typeInterface = this.$route.query.typeInterface ||""
      }
    }
  },
  created() {
    this.init()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_design_attr_sql_attr {
  position: relative;
  height: 100%;
  .attr_main {
    height: 100%;
    ::v-deep .el-table__cell {
      padding: 2px 0;
      .cell {
        span {
          font-size: 12px;
        }
      }
    }
    ::v-deep tr {
      .cell {
        font-size: 12px;
        padding: 0;
      }
    }
  }
  .attr_title {
    padding: 8px 10px;
    font-family: $font_medium;
    &.flex {
      display: flex;
      justify-content: space-between;
      .right_btn {
        color: $theme_color;
        cursor: pointer;
      }
    }
  }
  .attr_pre_title {
    // padding: 8px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-icon-arrow-down {
      cursor: pointer;
      &.hidden {
        transform: rotate(180deg);
      }
    }
    .attr_pre_title_b {
      color: $reg_ft_color;
    }
  }
  .attr_content {
    background-color: $base_bg_color;
    padding: 20px 10px;
  }
  .attr_box {
    height: 100%;
    overflow-y: scroll;
    padding-bottom: 102px;
    &.mt10 {
      margin-top: 10px;
    }
  }
  .attr_show {
    padding: 8px 10px;
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
      .attr_show_item_t {
        width: 100%;
        margin-right: 10px;
        margin-bottom: 10px;
        font-weight: $font_weight_600;
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
      }
      .attr_show_item_c {
        width: 100%;
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
    padding: 8px 10px;
  }
  .attr_recive {
    padding: 8px 10px;
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
    box-shadow: 0 1px 10px 0 #e7e7e7;
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
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    width: calc(100% - 10px);
    padding-bottom: 10px;
    background: $base_white;
    z-index: 10;
    ::v-deep .el-button {
      @include normal_button_common;
      width: 112px;
      color: $reg_ft_color;
      background: $base_white;
      border: 1px solid $pri_br_color;
      &.el-button--primary {
        @include primary_button;
      }
    }
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
}
</style>
