<template>
  <div class="aop_tradedesign_comps_apimgmt_case_test">
    <div class="detail_container">
      <div class="test_box_detail_test">
        <div class="test_box_detail_test_title">Mock测试</div>
        <div class="test_header">
          <div class="test_header_left">
            <el-form class="test_header_form" ref="formRef" :inline="true">
              <el-form-item label="API名称：">
                <span>{{ detailInfo.apiName }}</span>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="caseId"
                  placeholder="测试Mock选择"
                  size="small"
                  class="box_left"
                  filterable
                  @change="changeCase"
                >
                  <el-option
                    v-for="item in caseList"
                    :key="item.caseId"
                    :label="item.caseName"
                    :value="item.caseId"
                  > 
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否是真实应用：">
                <el-switch
                  v-model="testFlg"
                  active-color="#13ce66"
                  inactive-color=""
                  active-value="1"
                  inactive-value="0"
                  @change="testFlgChange"
                  :disabled="!caseId">
                </el-switch>
              </el-form-item>
              <el-form-item label="URL：" class="form_item_url">
                <el-tooltip effect="dark" :content="testUrl" placement="top">
                  <span>{{ testUrl }}</span>
                </el-tooltip>
              </el-form-item>
            </el-form>
          </div>
          <div class="test_header_right">
            <el-button type="primary" size="small" @click="toTest"
              >执行测试</el-button
            >
          </div>
        </div>
      </div>
      <div class="btn_header">
        <div class="btn_box">
          <el-button type="primary" size="small" @click="toAdd"
            >新建Mock</el-button
          >
        </div>
        <div class="right_box">
          <span>测试结果：</span>
          <img
            :class="
              resultFlg == '0' || resultFlg == '1' ? 'test_record_icon' : ''
            "
            :src="
              resultFlg == '0'
                ? require('@m/assets/images/icon_success.png')
                : resultFlg == '1'
                ? require('@m/assets/images/icon_fail.png')
                : ''
            "
          />
          <span
            class="content_info status"
            :class="
              resultFlg == '0' ? 'success' : resultFlg == '1' ? 'fail' : ''
            "
            >{{
              resultFlg == "0" ? "成功" : resultFlg == "1" ? "失败" : "--"
            }}</span
          >
          <!-- <span
            class="right_box_link"
            @click="changeDisplayType(displayType)"
            >{{ displayType == "1" ? "图形展示" : "报文展示" }}</span
          > -->
        </div>
      </div>

      <div class="runtest_content">
        <div class="main_row" v-show="displayType == '0'">
          <div class="detail_content">
            <!-- Mock条件 -->
            <div class="params_row_box">
              <span class="params_row_box_header_l">Mock条件</span>
              <span class="params_row_box_header_r" @click="showCondiTable()">
                <i
                  class="el-icon-arrow-up"
                  v-show="currentCondiTable == '1'"
                ></i
                ><i
                  class="el-icon-arrow-down"
                  v-show="currentCondiTable != '1'"
                ></i>
              </span>
            </div>
            <Condition
              v-show="currentCondiTable == '1'"
              :dataList="dataList"
              :headerDataList="headerDataList"
            ></Condition>
          </div>
          <div class="main_row_header">
            <!-- <span class="right_box_link" @click="changeMessageType(messageType)"
              >{{ messageType == "1" ? "原始报文" : "标准报文"}}</span
            > -->
          </div>
          <div class="main_row_box" v-show="messageType == '1'">
            <div class="middle_radio">
              <el-radio-group v-model="navDefaultActive" size="small">
                <el-radio-button label="body">Body</el-radio-button>
                <el-radio-button label="header">Header</el-radio-button>
              </el-radio-group>
            </div>
            <div class="detail_row">
              <div class="left_row">
                <div class="header_box" v-show="navDefaultActive == 'header'">
                  <div class="content_header">输入报文：</div>
                  <div class="condition_wrapper">
                    <div class="wrapper_create">
                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="small"
                        @click="addHeaderData"
                        >添加参数</el-button
                      >
                    </div>
                  </div>
                  <Table
                    class="table_style"
                    :data="headerDataInput"
                    :table="tableColumn"
                    @operate="operate"
                  ></Table>
                </div>
                <PageMockRow
                  v-show="navDefaultActive == 'body'"
                  class="request_msg"
                  ref="testLeftRowRef"
                  :title="'输入报文：'"
                  :theme="'vscode_theme'"
                  :dataObj="requestMsgJson"
                  type="edit"
                ></PageMockRow>
              </div>
            </div>
            <div class="detail_row">
              <div class="left_row">
                <PageMockRow
                  :title="'输出报文：'"
                  ref="testRightRow"
                  :dataObj="responseMsgJson"
                  :theme="'vscode_theme'"
                ></PageMockRow>
              </div>
            </div>
          </div>
          <div class="main_row_box" v-show="messageType == '2'">
            <div class="detail_row">
              <div class="left_row">
                <PageMockRow
                  ref="testLeftRow"
                  :title="'输入报文：'"
                  :dataObj="requestMsg"
                  :theme="'vscode_theme'"
                  type="edit"
                ></PageMockRow>
              </div>
            </div>
            <div class="detail_row">
              <div class="left_row">
                <PageMockRow
                  :title="'输出报文：'"
                  ref="testRightRow"
                  :dataObj="responseMsg"
                  :theme="'vscode_theme'"
                ></PageMockRow>
              </div>
            </div>
          </div>
        </div>
        <div class="params_row" v-show="displayType == '1'">
          <div class="params_row_box">
            <span class="params_row_box_header_l">输入报文</span>
            <span class="params_row_box_header_r" @click="showParamTable('T')">
              <i
                class="el-icon-arrow-right"
                v-show="TcurrentParamsTable == '1'"
              ></i
              ><i
                class="el-icon-arrow-down"
                v-show="TcurrentParamsTable != '1'"
              ></i>
            </span>
            <Table
              v-show="TcurrentParamsTable == '1'"
              :data="responseTable"
              :table="paramsColumns"
              class="params_row_box_table"
            ></Table>
          </div>
          <div class="params_row_box">
            <span class="params_row_box_header_l">输出报文</span>
            <span class="params_row_box_header_r" @click="showParamTable('B')">
              <i
                class="el-icon-arrow-right"
                v-show="BcurrentParamsTable == '2'"
              ></i
              ><i
                class="el-icon-arrow-down"
                v-show="BcurrentParamsTable != '2'"
              ></i>
            </span>
            <Table
              v-show="BcurrentParamsTable == '2'"
              :data="responseTable"
              :table="paramsColumns"
              class="params_row_box_table"
            ></Table>
          </div>
        </div>
      </div>
    </div>
    <PageFooter>
      <div slot="box">
        <el-button @click="handleCancel" v-show="type !== 'view' ">返 回</el-button>
      </div>
    </PageFooter>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import { escape2Html } from "@m/utils/html2e";
import PageMockRow from "@m/core/components/page_mock_row";
import Table from "@m/core/components/page_table";
import Condition from "./condition";
import PageFooter from "@m/core/components/page_footer";
export default {
  mixins: [mixin],
  props: {
    caseId: {
      type: String,
      default: () => "",
    },
    apiId: {
      type: String,
      default: () => "",
    },
    type: {
      type: String,
      default: () => "",
    }
  },
  components: {
    PageMockRow,
    Table,
    Condition,
    PageFooter
  },
  data() {
    return {
      navDefaultActive: "body",
      searchType: "api",
      detailInfo: {},
      displayType: "0",
      resultFlg: "",
      testUrl: "",
      caseList: [],
      //原始报文
      requestMsg: "",
      responseMsg: "",
      //标准报文
      requestMsgJson: "",
      responseMsgJson: "",
      requestTable: [],
      responseTable: [],
      paramsColumns: [
        {
          prop: "paramOrder",
          label: "排序",
          type: "text",
          width: "60",
        },
        {
          prop: "paramName",
          label: "参数Key",
          type: "text",
          width: "140",
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
          width: "140",
        },
        {
          prop: "paramPosition",
          label: "报文定位",
          type: "text",
          width: "120",
          filter: "paramPosition",
        },
        {
          prop: "paramType",
          label: "参数类型",
          type: "text",
          width: "120",
          filter: "paramType",
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          type: "text",
          width: "140",
        },
      ],

      TcurrentParamsTable: "1",
      BcurrentParamsTable: "1",
      currentCondiTable: "1",
      messageType: "1",
      dataList: [], // body
      headerDataList: [], // header条件展示
      headerDataInput: [], // 输入报文header
      apiVersion: "",
      tableColumn: [
        {
          prop: "paramName",
          label: "Key",
          type: "input",
        },
        {
          prop: "paramValue",
          label: "Value",
          type: "input",
        },
        {
            prop: "action",
            label: "操作",
            width: "80",
            type: "button",
            buttonList: [
              {
                desc: "删除",
                operate: "del",
              },
            ],
          },
      ],
      testFlg: "",
      serviceCode: ""
    };
  },
  methods: {
    init() {
      if (this.apiId !== "") {
        this.getApiDetail();
        this.getCaseList();
      } else {
        this.getApiCaseDetail();
      }
    },
    operate(operation,data) {
      const i = this.headerDataInput.indexOf(data);
      this.headerDataInput.splice(i, 1);
    },
    // 添加header的数据
    addHeaderData() {
      this.headerDataInput.push({
        paramName: "",
        paramValue: "",
      })
    },
    // 获取详情
    async getApiDetail() {
      const params = {
        apiId: this.apiId,
      };
      const res = await this.rpc.apimgmt.getApiDetail(params);
      this.detailInfo = res;
    },
    // 获取Mock下拉选择
    async getCaseList() {
      const params = {
        apiId: this.apiId,
      };
      const res = await this.rpc.public.getApiCaseSelect(params);
      this.caseList = res.caseList;
      if (this.caseId !== "") {
        this.changeCase(this.caseId);
      }
    },
    // 通过Mock获取详情
    async getApiCaseDetail() {
      const params = {
        caseId: this.caseId,
      };
      const res = await this.rpc.apimgmt.getApiCaseDetail(params);
      this.apiId = res.serviceId;
      this.apiVersion = this.apiVersion
      const dataList = this.caseConditionBakTrasBack(
        JSON.parse(escape2Html(res.caseConditionBak) || "[]")
      );
      this.dataList = this.disposeList(dataList);

      const headerDataList = this.caseConditionBakTrasBack(
        JSON.parse(escape2Html(res.caseCondition) || "[]")
      );
      this.headerDataList = this.disposeList(headerDataList);
      
      this.headerDataInput = JSON.parse(JSON.stringify(this.headerDataList))
      this.getApiDetail();
      this.getCaseList();
    },
    // 处理数组
    disposeList(arrs) {
      arrs.forEach((item, index) => {
        if (item.paramType == "List" || item.paramType == "Object") {
          arrs[index].paramValue = this.caseConditionBakTrasBack(
            JSON.parse(JSON.stringify(item.paramValue))
          );
          arrs[index].paramValue = this.disposeList(
            JSON.parse(JSON.stringify(item.paramValue))
          );
          arrs[index].children = item.paramValue;
          arrs[index].paramValue = "";
        }
      });
      return arrs;
    },
    async getJson() {
      const params = {
        caseId: this.caseId,
        requestMsg: this.requestMsg,
      };
      console.log(this.requestMsg);
      const res = await this.rpc.public.getJson(params);
      this.requestMsgJson = escape2Html(res.requestMsg);
      this.responseMsgJson = "";
      this.resultFlg = "";
      this.requestTable = [];
      this.responseTable = [];
    },
    async getTestPuApiParams() {
      const params = {
        apiId: this.apiId,
        requestMsg: this.requestMsgJson,
        responseMsg: this.responseMsgJson,
      };
      const res = await this.rpc.public.getTestPuApiParams(params);
      this.initParams(res);
    },
    initParams(data) {
      let item = data.puApiParams;
      this.requestTable = [];
      this.responseTable = [];
      function compare(key) {
        return function (value1, value2) {
          let val1 = value1[key];
          let val2 = value2[key];
          return val1 - val2;
        };
      }
      item.sort(compare("paramIndex"));
      if (item) {
        for (let i of item) {
          if (i.paramDirection == "0") {
            i.index = +this.requestTable.length + 1;
            this.requestTable.push(i);
          } else {
            i.index = +this.responseTable.length + 1;
            this.responseTable.push(i);
          }
        }
      }
    },
    changeDisplayType(e) {
      if (e == "0") {
        this.displayType = "1";
      } else {
        this.displayType = "0";
      }
    },
    changeMessageType(e) {
      if (e == "1") {
        this.messageType = "2";
      } else {
        this.messageType = "1";
      }
    },
    toAdd() {
      this.$emit("toAddCase",this.apiId)
    },
    async toTest() {
      if(!this.caseId) return this.$message.error("请先选择测试Mock，再执行测试")
      this.resultFlg = "";
      const httpHeaderParam = {}
      for(let i in this.headerDataInput) {
        let name = this.headerDataInput[i].paramName
        httpHeaderParam[name] = this.headerDataInput[i].paramValue
      }
      console.log(httpHeaderParam);
      const params = {
        url: this.testUrl,
        testFlg: this.testFlg,
        serviceCode: this.serviceCode,
        requestMsg: this.$refs.testLeftRowRef.resData,
        apiVersion: this.apiVersion,
        httpHeaderParam: JSON.stringify(httpHeaderParam)
      };
      const res = await this.rpc.public.handleRpc(params);
      this.resultFlg = res.result == "0" ? res.result : "1";
      this.responseMsgJson = escape2Html(res.responseMsg);
      this.getTestPuApiParams();
    },
    async changeCase(e) {
      this.$emit("caseChange",e)
      const currentItem = this.caseList.filter((item) => item.caseId == e)[0];
      this.testUrl = currentItem.url;
      this.serviceCode = currentItem.serviceCode;
      this.requestMsg = escape2Html(currentItem.requestMsg);
      this.responseMsg = escape2Html(currentItem.responseMsg);
      this.getJson();
      const params = {
        caseId: this.caseId,
      };
      const res = await this.rpc.apimgmt.getApiCaseDetail(params);
      this.apiVersion = res.apiVersion
      const dataList = this.caseConditionBakTrasBack(
        JSON.parse(escape2Html(res.caseConditionBak) || "[]")
      );
      this.dataList = this.disposeList(dataList);
      
      const headerDataList = this.caseConditionBakTrasBack(
        JSON.parse(escape2Html(res.caseCondition) || "[]")
      );
      this.headerDataList = this.disposeList(headerDataList);
      
      this.headerDataInput = JSON.parse(JSON.stringify(this.headerDataList))
    },
    showParamTable(e) {
      if (e == "T") {
        this.TcurrentParamsTable = this.TcurrentParamsTable == "1" ? "2" : "1";
      } else {
        this.BcurrentParamsTable = this.BcurrentParamsTable == "1" ? "2" : "1";
      }
    },
    showCondiTable() {
      this.currentCondiTable = this.currentCondiTable == "1" ? "2" : "1";
    },
    caseConditionBakTrasBack(e) {
      const list = [];
      for (let i in e) {
        for (let k in e[i]) {
          list.push(e[i][k]);
        }
      }
      return list;
    },
    handleCancel() {
      this.$emit("toBack",this.apiId)
    },
    testFlgChange(e) {
      // this.toTest()
      console.log(e);
    }
  },
  created() {
    this.init();
  },
  watch: {
    caseId(n,o) {
      this.init();
    },
    apiId(n,o) {
      this.init();
    },
  }, 
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_case_test {
  .detail_container {
    .test_box_detail_test {
      padding: 0 30px 0px;
      position: relative;
      background: $base_white;
      width: 100%;
      .test_box_detail_test_title {
        padding-top: 20px;
        font-size: 16px;
        font-weight: $font_weight_600;
      }
      .test_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 72px;
        padding: 10px 0 20px;
        .test_header_left {
          width: calc(100% - 66px);
          ::v-deep .el-input__inner {
            height: 32px;
            line-height: 32px;
            background: $base_white;
            border-radius: $theme_radius;
          }
          ::v-deep .el-select .el-input__inner:focus {
            border-color: $pri_br_color;
          }
          ::v-deep .el-input__inner:focus {
            border-color: $pri_br_color;
          }
          .el-select ::v-deep .el-input__inner::placeholder {
            color: $reg_ft_color;
          }
          .test_header_form {
            .form_item_url {
              &::v-deep .el-form-item__content {
                width: 230px;
                white-space: nowrap;
                overflow-x: hidden;
                text-overflow: ellipsis;
              }
            }
            ::v-deep .el-form-item {
              margin-bottom: 0;
              margin-right: 8px;
              .el-input {
                // width: 120px;
                font-size: 14px;
                color: $reg_ft_color;
                &.input {
                  width: 315px;
                }
              }
              .el-select {
                .el-input__inner {
                  padding: 0 10px;
                }
                ::v-deep .el-input__suffix {
                  right: 2px;
                }
              }
            }
          }
        }
        .test_header_right {
          ::v-deep .el-button {
            @include small_button_common;
            min-width: 64px;
          }
          // ::v-deep .el-button--primary {
          //   @include primary_button;
          // }
        }
      }
      .box_left {
        margin-right: 10px;
      }
    }
  }

  .main_row {
    margin-top: 10px;
    .main_row_header {
      background-color: $base_white;
      padding: 20px 30px 0;
      position: relative;
      .right_box_link {
        color: #358aff;
        cursor: pointer;
        position: absolute;
        right: 30px;
      }
    }
    .main_row_box {
      position: relative;
      background-color: $base_white;
      display: flex;
      justify-content: space-between;
      padding: 20px 30px;
    }
    .detail_row {
      // position: relative;
      width: 50%;
      overflow: hidden;
      padding-right: 10px;
      .left_row,
      .right_row {
        width: 100%;
        position: relative;
        ::v-deep .el-textarea__inner {
          min-height: 600px !important;
        }
        ::v-deep .jv-code {
          min-height: 600px;
        }
      }
      .right_row {
        padding-right: 0;
        padding-left: 0;
      }
    }
  }
  .params_row {
    .params_row_box {
      margin-top: 10px;
      background: $base_white;
      padding: 16px 30px;
      font-size: 16px;
      .params_row_box_header_l {
        font-weight: 600;
      }
      .params_row_box_header_r {
        float: right;
        cursor: pointer;
        color: #358aff;
      }
    }
    .params_row_box_table {
      margin-top: 10px;
      &::v-deep .el-table th {
        color: $sec_ft_color;
      }
    }
  }
  .btn_header {
    display: flex;
    padding: 20px 30px 20px;
    background: $base_white;
    margin-top: 10px;
    .btn_box {
      width: 50%;
      ::v-deep .el-button {
        @include small_button_common;
        min-width: 64px;
      }
      ::v-deep .el-button--primary {
        @include primary_button;
      }
    }
    .right_box {
      width: 50%;
      line-height: 32px;
      .test_record_icon {
        width: 20px;
        height: 20px;
        vertical-align: sub;
      }
      .right_box_link {
        color: #358aff;
        cursor: pointer;
        margin-left: 10px;
      }
    }
    .status {
      text-align: center;
      height: 24px;
      line-height: 24px;
      padding: 0 4px;
      &.fail {
        background: #ffeaec;
        color: $danger_color;
      }
      &.success {
        background: #f2f8ff;
        color: $theme_color;
      }
    }
  }
  .detail_content {
    background: $base_white;
    padding: 20px 30px;
    margin-bottom: 20px;
    .params_row_box {
      background: $base_white;
      font-size: 16px;
      .params_row_box_header_l {
        font-weight: 600;
      }
      .params_row_box_header_r {
        float: right;
        cursor: pointer;
        color: #358aff;
      }
    }
  }
  .request_msg ::v-deep.el-textarea__inner {
    padding: 30px 20px;
    // background: $base_black;
    // color: #c6937c;
    // font-family: Consolas, Menlo, Courier, monospace
  }
  .runtest_content {
    position: relative;
  }
  .middle_radio {
    position: absolute;
    left: 0;
    top: -12px;
    margin: 0 auto;
    text-align: center;
    width: 50%;
    ::v-deep .el-radio-button__inner {
      padding: 0 8px;
      height: 28px;
      line-height: 28px;
    }
    ::v-deep .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 2px 0 0 2px;
    }
    ::v-deep .el-radio-button:last-child .el-radio-button__inner {
      border-radius: 0 2px 2px 0;
    }
  }
  .header_box {
    font-size: 14px;
    .content_header {
      font-family: PingFangSC-Regular;
      color: #333;
      letter-spacing: 0;
      margin-bottom: 10px;
    }
    .wrapper_create {
      margin-bottom: 10px;
    }
  }
}
</style>

