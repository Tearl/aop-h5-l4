<template>
  <div class="aop_tradecode_comps_d4bdesign_info_baisc">
    <div class="content_wrapper">
      <!-- 查看基本信息 -->
      <div class="content_read">
        <div class="detail_content">
          <div class="content_header base_nav_title">基本信息</div>
          <DetailInfo
            :reqmentId="reqmentId"
            :detailInfo="detailInfo"
            :uploadFlag="uploadFlag"
            :showBtn="showBtn"
            :noTrans="noTrans"
            @showRelatedTops="showRelatedTops"
          >
          </DetailInfo>
        </div>

        <!-- 接口特性 -->
        <div class="detail_content">
          <div class="content_header base_nav_title">
            <span>接口特性</span>
            <span>{{ detailInfo.isLogin == "1" ? "常规" : "" }}</span>
            <span>{{
              detailInfo.isVerificationCode == "1" ? "校验验证码" : ""
            }}</span>
            <span>{{ detailInfo.isUploadFile == "1" ? "上传文件" : "" }}</span>
          </div>
        </div>

        <!-- 配置信息 -->
        <div class="detail_content">
          <div class="content_header base_nav_title">配置信息</div>
          <div class="check_group">
            <el-checkbox v-model="detailInfo.isSession" class="left" disabled>校验会话</el-checkbox>
            <el-checkbox v-model="detailInfo.isEncode" class="right" disabled>加解密</el-checkbox>
            <el-checkbox v-model="detailInfo.isDesensitization" class="right" disabled>脱敏</el-checkbox>
          </div>
        </div>

        <!-- 参数配置 -->
        <div class="detail_content">
          <div class="content_header base_nav_title">输入参数</div>
          <Table
            class="table_style"
            :data="iInputList"
            :table="iInputListTable"
            :rowK="'paramOrder'"
            :treeProps="{ children: 'children' }"
          ></Table>
        </div>
        <div class="detail_content">
          <div class="content_header base_nav_title">输出参数</div>
          <Table
            class="table_style"
            :data="iOutputList"
            :table="iOutputListTable"
            :rowK="'paramOrder'"
            :treeProps="{ children: 'children' }"
          ></Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import DetailInfo from "./info";
import Table from "@m/core/components/page_table_workgate";
import { reList, mixList } from "@m/utils/paramTree";
import Process from "@m/core/components/process/comps";

export default {
  mixins: [mixin],
  components: {
    DetailInfo,
    Table,
    Process,
  },
  props: {
    basicData: {
      type: Object,
      default: () => ({}),
    },
    showBtn: {
      type: Boolean,
      default: () => false,
    },
    uploadFlag: {
      type: Boolean,
      default: () => false,
    },
    noTrans: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      iInputList: [], // 数据输入列表
      iOutputList: [], // 数据输出列表
      detailInfo: {}, //服务组件基本信息
      reuseType: "",
      l5ServiceList: [],
      isFilterList: [],
      apEncryTypeList: [],
      /* 流程图相关变量 */
      dataObj: {
        flow: [],
        position: "",
      },
    };
  },
  computed: {
    // 数据输入列表参数
    iInputListTable() {
      return [
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
        {
          prop: "paramLength",
          label: "参数长度",
          type: "text",
        },
        {
          prop: "apEncryType",
          label: "加密类型",
          type: "text",
          filter: (scope) => {
            const option =  this.apEncryTypeList.find(item => item.value == scope.row?.apEncryType)
            return option?.type || ""
          },
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter",
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          type: "text",
        },
        {
          prop: "dictryEnum",
          label: "枚举值",
          type: "text",
        },
      ].filter(item => {
        if (["解密类型", "加密类型"].includes(item.label)) {
          return this.detailInfo.isEncode
        } else {
          return true
        }
      })
    },
    // 数据输出列表参数
    iOutputListTable() {
      return [
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
        {
          prop: "paramLength",
          label: "参数长度",
          type: "text",
        },
        {
          prop: "actionName",
          label: "来源",
          type: "text",
        },
        {
          prop: "paraMapgNm",
          label: "来源值",
          type: "text",
          filter: (scope) => {
            if (scope.row?.actionId == "constantValue") {
              return scope.row.paramMappingKey
            } else {
              return scope.row.paraMapgNm
            }
          },
        },
        {
          prop: "desensitizationType",
          label: "脱敏类型",
          type: "text",
          filter: (scope) => {
            const option =  this.isFilterList.find(item => item.value == scope.row?.desensitizationType)
            return option?.type || ""
          },
        },
        {
          prop: "apEncryType",
          label: "加密类型",
          type: "text",
          filter: (scope) => {
            const option =  this.apEncryTypeList.find(item => item.value == scope.row?.apEncryType)
            return option?.type || ""
          },
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter",
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          type: "text",
        },
        {
          prop: "dictryEnum",
          label: "枚举值",
          type: "text",
        },
      ].filter(item => {
        if (item.label == "脱敏类型") {
          return this.detailInfo.isDesensitization
        } else if (["解密类型", "加密类型"].includes(item.label)) {
          return this.detailInfo.isEncode
        } else {
          return true
        }
      })
    },
  },
  methods: {
    init() {},
    showRelatedTops() {
      this.$emit("showRelatedTops");
    },
    setSourceOption(data) {
      data.forEach((item) => {
        if (item.actionId == "" || item.actionName == "") {
          item.actionId = this.detailInfo.svcId;
          item.actionName = "当前4b交易";
          item.paramMappingKey = item.paramKey;
          item.paraMapgNm = item.paramCName;
        }
        if (item.children && item.children.length) {
          this.setSourceOption(item.children);
        }
      });
    },
    async getDessitizaList(){
      const res = await this.rpc.d4.getDessitizaList();
      let tempArr = {value:"0",type:"无"}
      this.isFilterList.length = 0;
      if(res.desensitizationTypeList && res.desensitizationTypeList.length >0){
        res.desensitizationTypeList.map((item) =>{
          this.isFilterList.push({
            value:item.desensitizationType,
            type:item.desensitizationName
          })
        })
        this.isFilterList.unshift(tempArr)
      }else{
        this.isFilterList = [...tempArr]
      }
      this.apEncryTypeList = res.apEncryTypeList?.reduce((prev, item) => {
        prev.push({
          value: item.desensitizationType,
          type: item.desensitizationName,
        })
        return prev
      }, [{ value: "0", type: "无"}])
    }
  },
  created() {},
  watch: {
    async basicData(res, o) {
      this.detailInfo = res;
      this.detailInfo.isSession = this.detailInfo.isSession== '1' ? true:false
      this.detailInfo.isVerificationCode = this.detailInfo.isVerificationCode== '1' ? true:false
      this.detailInfo.isUploadFile = this.detailInfo.isUploadFile == "1"
      this.detailInfo.isLogin = this.detailInfo.isLogin == "1"
      this.detailInfo.isEncode = this.detailInfo.isEncode == "1"
      this.detailInfo.isDesensitization = this.detailInfo.isDesensitization == "1"
      this.iInputList = [];
      this.iOutputList = [];
      this.$nextTick(() => {
        // this.$refs.bizRuleRef.businessRuleList = res.bizRuleList;
        this.iInputList = reList(
          res.puApiParams.filter((item) => item.paramDirection == 0)
        );
        this.iOutputList = reList(
          res.puApiParams.filter((item) => item.paramDirection == 1)
        );
        this.setSourceOption(this.iOutputList);
      });
      this.getDessitizaList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradecode_comps_d4bdesign_info_baisc {
  .content_wrapper {
    font-family: $font_regular;
    .content_read {
      .detail_content {
        background: $base_white;
        padding: 20px 32px;
        margin-bottom: 16px;
        .flex_tab {
          display: flex;
          justify-content: flex-start;
          .table_title {
            line-height: 40px;
            margin-right: 10px;
          }
          .btn_style {
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
      .content_header {
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
      }
      .process_middle {
        background: $base_white;
        padding: 20px 32px;
        margin-bottom: 16px;
        height: 500px;
        overflow: hidden;
        display: flex;
        flex-direction: column
      }
      .process_box {
        @include scrollbar;
        overflow-y: auto;
        overflow-x: auto;
      }
      ::v-deep .el-table {
        margin-top: 16px;
      }
      ::v-deep .el-table th {
        color: $sec_ft_color;
      }
    }
  }
  /deep/ .el-table th.el-table__cell > .cell {
    color: #333;
  }
  .check_group {
    display: flex;
    margin-top: 16px;
    .left,
    .right {
      width: 50%;
    }
  }
}
</style>
