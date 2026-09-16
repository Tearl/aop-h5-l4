<template>
  <div class="aop_tradedesign_comps_d4bdesign_info_baisc">
    <div class="content_wrapper" v-if="isEdit">
      <!-- 编辑基本信息 -->
      <div class="content_read">
        <div class="detail_content">
          <div class="content_header base_nav_title">基本信息</div>
          <DetailInfo
            :reqmentId="reqmentId"
            :detailInfo="detailInfo"
            :isEdit="isEdit"
            :numUser="numUser"
            @showRelatedAssets="showRelatedAssets"
          ></DetailInfo>
        </div>
        <div class="detail_content">
          <!-- <div class="content_header base_nav_title">输入参数</div>
          <div class="data_list">
            <Table
              class="table_style"
              :data="iInputList"
              :table="iInputListTable"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div> -->
          <InputParams
            ref="inputParamsRef"
            :detailInfo="detailInfo"
            :arsId="formData.sysId"
          ></InputParams>
        </div>
        <div class="detail_content">
          <div class="content_header base_nav_title">业务规则</div>
          <div class="rules_text">
            <CreateBizRule
              ref="bizRuleRef"
              :isEdit="isEdit"
              :currentServObj="basicData"
              :ruleInfo="ruleInfo"
            >
            </CreateBizRule>
          </div>
        </div>
        <div class="detail_content">
          <!-- <div class="content_header base_nav_title">输出参数</div>
          <div class="data_list">
            <Table
              class="table_style"
              :data="iOutputList"
              :table="iOutputListTable"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div> -->
          <OutputParams
            ref="outputParamsRef"
            :detailInfo="detailInfo"
            :arsId="formData.sysId"
          ></OutputParams>
        </div>
        <div class="btn_list">
          <el-button type="primary" @click="saveService">保存</el-button>
        </div>
      </div>
    </div>
    <div class="content_wrapper" v-else>
      <!-- 查看基本信息 -->
      <div class="content_read">
        <div class="detail_content">
          <div class="content_header base_nav_title">基本信息</div>
          <DetailInfo
            :reqmentId="reqmentId"
            :detailInfo="detailInfo"
            :isEdit="isEdit"
            :numUser="numUser"
            ref="baseInfoRef"
            @showRelatedAssets="showRelatedAssets"
          ></DetailInfo>
        </div>
        <div class="detail_content">
          <div class="content_header base_nav_title">输入参数</div>
          <div class="data_list">
            <Table
              class="table_style"
              :data="iInputList"
              :table="iInputListTable"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div>
        </div>
        <div class="detail_content">
          <div class="content_header base_nav_title">输出参数</div>
          <div class="data_list">
            <Table
              class="table_style"
              :data="iOutputList"
              :table="iOutputListTable"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div>
        </div>
        <div class="detail_content">
          <div class="content_header base_nav_title">业务规则</div>
          <div class="rules_text">
            <CreateBizRule
              ref="bizRuleRef"
              :isEdit="isEdit"
              :ruleInfo="ruleInfo"
            >
            </CreateBizRule>
          </div>
        </div>
      </div>
    </div>
<!-- 
    <slot name="rightNav">
      <PageRightNav
        navClass=".base_nav_title"
        :itemList="itemList"
      ></PageRightNav>
    </slot> -->
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import {
  unduplicated,
  array2NonNested,
  array2nested,
  array2flat,
  unduplicatedByKeys,
  setSerialNumber,
} from "@m/utils/array";
import CreateBizRule from "./biz_rule";
import PageParams from "@m/core/components/page_params";
import DetailInfo from "./info";
import Table from "@m/core/components/page_table";
import validate from "@m/utils/validate";
import PageRightNav from "@m/core/components/page_right_nav";
import InputParams from "./input";
import OutputParams from "./output";
import { reList } from "@m/utils/paramTree";

export default {
  mixins: [mixin],
  components: {
    PageParams,
    CreateBizRule,
    DetailInfo,
    Table,
    PageRightNav,
    InputParams,
    OutputParams,
  },
  props: {
    // 页面类型
    pageType: {
      type: String,
      default: () => "edit",
    },
    basicData: {
      type: Object,
      default: () => ({}),
    },
    orderInfo: {
      type: Object,
      default: () => ({}),
    },
    isEdit: {
      type: Boolean,
      default: () => false,
    },
    currentD4bObj:{
      type:Object,
      default:() =>({})
    }
  },
  data() {
    return {
      cpntNm: "",
      // 服务组件基本信息列表
      formData: {
        cpntNm: "", // 组件名称
        cpntNo: "", //服务组件设计id
        funcDescr: "", // 组件描述
        funcKeyword: "", //功能关键字
        aaId: "", //所属应用
        versNo: "1.0.0",
        versDescr: "",
        grpgId: "",
        bizTypeId: "",
      },
      // 基本信息列表校验
      rules: {
        cpntNm: [
          {
            required: true,
            trigger: "blur",
            message: "服务组件设计名称不能为空",
          },
          {
            required: true,
            trigger: "blur",
            message: "请输入包含中文的内容",
            validator: validate.containChinese,
          },
          // {
          //   required: true,
          //   trigger: "blur",
          //   min: 2,
          //   message: "请输入最少两个中文",
          // },
        ],
        cpntNo: [
          {
            required: true,
            trigger: "blur",
            message: "服务组件设计id不能为空",
          },
        ],
        funcDescr: [
          { required: true, trigger: "blur", message: "组件描述不能为空" },
        ],
        funcKeyword: [
          { required: true, trigger: "blur", message: "功能关键字不能为空" },
        ],
        // aaId: [
        //   { required: true, trigger: "change", message: "所属应用不能为空" },
        // ],
        // grpgId: [
        //   { required: true, trigger: "change", message: "所属分组不能为空" },
        // ],
        bizTypeId: [
          { required: true, trigger: "change", message: "业务类型不能为空" },
        ],
        versNo: [
          {
            required: true,
            validator: validate.validateVersion,
            trigger: "blur",
          },
        ],
        versDescr: [
          { required: true, trigger: "blur", message: "版本描述不能为空" },
        ],
      },
      iParamssList: [], // 配置验证规则列表
      iInputList: [], // 数据输入列表
      iOutputList: [], // 数据输出列表
      iMockList: [], // mock数据编辑列表
      pageType: "", // 页面类型
      reqmentId: "", // 服务组件ID
      businessList: [], // 业务类型下拉框列表
      grpgList: [], // 分组下拉框列表
      aaIdList: [], // 应用下拉框列表
      actionUrl: "", // 文件上传链接
      fileList: [], // 上传文件列表
      detailInfo: {}, //服务组件基本信息
      // 数据输入列表参数
      iInputListTable: [
        {
          prop: "paramKey",
          label: "参数Key",
          width: "200px",
          type: "text",
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
          type: "text",
        },
        // {
        //   prop: "paramLength",
        //   label: "参数长度",
        //   type: "text",
        // },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter"
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
        },
        // {
        //   prop: "paramDesc",
        //   label: "参数描述",
        //   type: "text",
        // },
        {
          prop: "apEnum",
          label: "枚举值",
          type: "text",
        },
      ],
      // 数据输出列表参数
      iOutputListTable: [
        {
          prop: "paramKey",
          label: "参数Key",
          width: "200px",
          type: "text",
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
          type: "text",
        },
        // {
        //   prop: "paramLength",
        //   label: "参数长度",
        //   type: "text",
        // },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter"
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
        },
        // {
        //   prop: "paramDesc",
        //   label: "参数描述",
        //   type: "text",
        // },
        {
          prop: "apEnum",
          label: "枚举值",
          type: "text",
        },
      ],
      reuseType: "",
      itemList: ["基本信息", "输入参数", "业务规则","输出参数"],
      ruleInfo: {},
      numUser:"",
    };
  },
  computed: {
    // 右侧导航栏参数
    // itemList() {
    //   const result = [
    //     "基本信息",
    //     "参数配置",
    //     "mock数据",
    //     "服务设计流程",
    //     "业务规则",
    //     "异常处理说明",
    //     "技术/安全说明",
    //   ]
    //   if (this.pageType == "read") result.push("设计工单详情")
    //   return result
    // }
  },
  methods: {
    // 添加mock数据
    addMockData(e) {
      this.$refs.serviceCpnMock.iMockList = e;
    },
    // 删除mock数据
    removeMockData(e) {
      this.$refs.serviceCpnMock.iMockList =
        this.$refs.serviceCpnMock.iMockList.filter((item) => item.key !== e);
    },
    // 提交需求
    confirm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息输入有误或未填写");
        if (this.$refs.bizRuleRef.businessRuleList.length == 0)
          return this.$message.error("业务规则不能为空");
        const processList = this.$refs.procesRef.processList;
        if (processList.length == 0)
          return this.$message.error("服务设计流程不能为空");
        for (i in processList) {
          if (processList[i].stepNo != i * 1 + 1) {
            return this.$message.error("服务设计流程未按顺序");
          }
        }
        this.iInputList = this.$refs.pageParamsRef.iInputList;
        this.iOutputList = this.$refs.pageParamsRef.iOutputList;
        // if (this.iInputList.length == 0 || this.iOutputList.length == 0)
        //   return this.$message.error("输入参数和输出参数不能为空");
        if (this.iInputList.length == 0)
          return this.$message.error("输入参数不能为空");
        if (this.$refs.unuslListRef.bugDescList.length == 0)
          return this.$message.error("异常处理说明不能为空");
        if (this.$refs.techListRef.techDescList.length == 0)
          return this.$message.error("安全技术说明不能为空");
        const params = Object.assign(
          {
            paramList: this.iInputList.concat(this.iOutputList),
            outputData: JSON.stringify(this.$refs.serviceCpnMock.iMockList),
            bizRuleList: this.$refs.bizRuleRef.businessRuleList,
            procesList: this.$refs.procesRef.processList,
            unuslList: this.$refs.unuslListRef.bugDescList,
            techList: this.$refs.techListRef.techDescList,
            reqmentId: this.reqmentId,
          },
          this.formData
        );
        params.paramList = unduplicatedByKeys(array2flat(params.paramList), [
          "paraId",
          "paraPareId",
          "paraPosition",
        ]);
        const api =
          this.reuseType == "reuse" || this.pageType == "add"
            ? "addServiceDemand"
            : "editServiceCpnDetail";
        params.reuseId = this.reqmentId;
        const res = await this.rpc.cpn[api](params);
        this.$notify({
          title: "成功",
          message: "保存成功",
          duration: 2000,
          type: "success",
        });
        this.$router.go(-1);
      });
    },
    // 获取应用下拉框列表
    async getAaIdList() {
      const res = await this.rpc.cpn.getApplyList();
      this.aaIdList = res.appList;
    },
    // 获取分组下拉框列表
    async getGrpgList() {
      const data = {
        aaId: this.pageType !== "read" ? this.formData.aaId : "",
      };
      const res = await this.rpc.cpn.getGrpgList(data);
      this.grpgList = res.grpgList;
    },
    // 获取业务类型下拉框列表
    async getBusinessList() {
      const res = await this.rpc.public.getBusinessList();
      this.businessList = res.dataList;
    },
    // 版本号增减点击
    iconClick(e) {
      this.$refs.form.validateField(["versNo"], (valid) => {
        if (!!valid) return;
        if (e == "add") {
          let list = this.formData.versNo.split(".");
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
          this.formData.versNo = n;
        } else {
          let list = this.formData.versNo.split(".");
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
          this.formData.versNo = n;
        }
      });
    },
    //编辑保存
    saveService() {
      const that = this.$refs.bizRuleRef.$refs.ruleTableRef
      console.log("服务信息编辑保存", that.tableData, that.tableColumn)
      if (!that.tableData.length) return
      if (this.ruleInfo.ruleDefnId) {
        that.editBusinessRule(this.ruleInfo)
      } else {
        that.addBusinessRule(this.ruleInfo)
      }
    },
    async getBusinessRuleInfo() {
      this.ruleInfo = {}
      const params = {
        apiId: this.basicData.svcId || this.basicData.apiId,
      };
      const res = await this.rpc.d4.getBusinessRuleInfo(params);
      this.ruleInfo = res
      const that = this.$refs.bizRuleRef.$refs.ruleTableRef
      that.setRuleInfo(res)
    },
    async getQuoteNum(data){
      const res = await this.rpc.downloadDesign.getQuoteNum({
        svcId:data.apiId,
      })
      // console.log("getQuoteNum",res);
      // this.$refs.baseInfoRef.numUser = res.quoteNum
      this.numUser = res.quoteNum;
      // this.$refs.baseInfoRef.totalNum = res;
    },
    // 初始化
    init() {
      this.pageType = this.$route.query.pageType;
      this.reuseType = this.$route.query.reuseType;
      this.actionUrl = this.rpc.file.pUp();
      this.reqmentId = this.$route.query.reqmentId;
    },
  },
  created() {
    this.init();
  },
  watch: {
    async basicData(res, o) {
      this.detailInfo = res;
      this.iInputList = [];
      this.iOutputList = [];
      this.$nextTick(() => {
        // this.$refs.bizRuleRef.businessRuleList = res.bizRuleList;
        this.getQuoteNum(res)
        this.getBusinessRuleInfo();
        this.iInputList = reList(
          res.puApiParams.filter((item) => item.paramDirection == 0)
        );
        this.iOutputList = reList(
          res.puApiParams.filter((item) => item.paramDirection == 1)
        );
        // console.log("dddddddd",this.iInputList,this.iOutputList)
        if(this.isEdit){
          this.getBusinessRuleInfo();
          this.$refs.inputParamsRef.sendData = reList(
          res.puApiParams.filter((item) => item.paramDirection == 0)
        );
        this.$refs.outputParamsRef.receiveData = reList(
          res.puApiParams.filter((item) => item.paramDirection == 1)
        );
        }
      });
    },
    async totalNum(newVal,oldVal){
      console.log(newVal,oldVal,"123")
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4bdesign_info_baisc {
  ::v-deep .el-form-item__label {
    text-align: left;
    vertical-align: middle;
    float: left;
    font-family: $font_regular;
    font-size: 14px;
    color: $pri_ft_color;
    letter-spacing: 0;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  ::v-deep .el-select .el-input__inner:focus,
  ::v-deep .el-textarea__inner:focus,
  ::v-deep .el-input__inner:focus {
    border-color: $pri_br_color;
  }
  .content_wrapper {
    font-family: $font_regular;
    .content_eidt {
      .content_detail {
        background: $base_white;
        padding: 20px 30px;
        margin-bottom: 16px;
      }
      .content_detail:last-child {
        margin-bottom: 0;
      }
      .content_header {
        // font-family: $font_medium;
        font-size: 16px;
        // color: $pri_ft_color;
        letter-spacing: 0;
        margin-bottom: 20px;
        font-family: PingFangSC-Medium;
        color: #333333;
        // font-weight: $font_weight_600;
      }
      .edit_form {
        @include form;
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
        .no_before {
          ::v-deep .el-form-item__label::before {
            content: "";
          }
        }
      }
      ::v-deep .table_style_ft th {
        color: $sec_ft_color;
      }
      ::v-deep .table_style th {
        line-height: 0;
      }
    }
    .content_read {
      .detail_content {
        background: $base_white;
        padding: 20px 32px;
        margin-bottom: 12px;
        .data_list {
          margin-top: 14px;
        }
      }
      .content_header {
        // font-family: $font_medium;
        font-size: 16px;
        // color: $pri_ft_color;
        letter-spacing: 0;
        // font-weight: $font_weight_600;
        font-family: PingFangSC-Medium;
        color: #333333;
      }
      .rules_text {
        margin-top: 16px;
      }
      .content_info {
        margin-top: 24px;
        img {
          margin-bottom: 16px;
        }
      }
      ::v-deep .el-table {
        margin-top: 16px;
      }
      ::v-deep .el-table th {
        color: $sec_ft_color;
      }
    }
  }
  .upload_img_btn {
    float: left;
  }
  .upload_button_plus {
    display: block;
    height: 20px;
    width: 20px;
    margin: 0 auto;
    margin-bottom: 2px;
  }
  .ex_graph {
    width: 80px;
    height: 80px;
    float: left;
    position: relative;
    margin-left: 20px;
    .image {
      width: 100%;
      height: 100%;
    }
    .close_btn {
      color: $base_white;
      position: absolute;
      right: -7px;
      top: -7px;
      border: 0;
      height: 16px;
      width: 16px;
      line-height: 16px;
      border-radius: 50%;
      background-color: rgba(51, 51, 51, 0.7);
      text-align: center;
      overflow: hidden;
      padding: 0;
    }
  }
  .upload_button {
    width: 80px;
    height: 80px;
    background-color: $base_bg_color;
    border: 1px solid $pri_br_color;
    color: $sec_ft_color;
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
  .content_detail_params ::v-deep.el-form-item__label::before {
    content: "" !important;
  }
  .btn_list{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px
  }
}
</style>
