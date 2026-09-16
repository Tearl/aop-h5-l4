<template>
  <div class="aop_tradedesign_comps_d4bdesign_info_baisc">
    <div class="content_wrapper">
      <!-- 查看基本信息 -->
      <div class="content_read">
        <div class="detail_content">
          <div class="content_header base_nav_title">基本信息</div>
          <DetailInfo
            :detailInfo="detailInfo"
            :uploadFlag="uploadFlag"
            :getApiBizType="getApiBizType"
            :noTrans="noTrans"
            @showRelatedTops="showRelatedTops"
          >
          </DetailInfo>
        </div>

        <!-- 配置信息 -->
        <div class="detail_content">
          <div class="content_header base_nav_title">配置信息</div>
          <div class="check_group">
            <el-checkbox v-model="detailInfo.isLogin" :disabled="noTrans" class="left">是否登录</el-checkbox>
            <el-checkbox v-model="detailInfo.isSession" :disabled="noTrans" class="left">是否校验会话</el-checkbox>
            <el-checkbox v-model="detailInfo.isVerificationCode" :disabled="noTrans" class="right">是否校验验证码</el-checkbox>
            <el-checkbox v-model="detailInfo.isUploadFile" :disabled="noTrans" class="right">是否上传文件</el-checkbox>
          </div>
        </div>

        <!-- 参数配置 -->
        <div class="params_detail_content content_detail_params">
          <!-- <div class="content_header base_nav_title">参数配置</div> -->
          <Params
            ref="paramsRef"
            :currentServObj="detailInfo"
            :arsId="svcId"
            :puApiParams="puApiParams"
            :noTrans="noTrans"
            :uploadFlag="uploadFlag"
            @paramList="paramIOlist"
            @delF="delF"
          ></Params>
        </div>
        <!-- L5服务列表 -->
        <div class="detail_content">
          <L5ServList ref="l5servRef" :noTrans="noTrans"></L5ServList>
        </div>
      </div>
    </div>

    <!-- <slot name="rightNav">
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
import DetailInfo from "./info";
import Table from "@m/core/components/page_table";
import validate from "@m/utils/validate";
import PageRightNav from "@m/core/components/page_right_nav";
import { reList, mixList } from "@m/utils/paramTree";
import Params from "./components/params";
import L5ServList from "./components/l5_service_list";
import { getSessionStorage } from "@m/utils/localStorage.js";

export default {
  mixins: [mixin],
  components: {
    DetailInfo,
    Table,
    PageRightNav,
    Params,
    L5ServList,
  },
  props: {
    basicData: {
      type: Object,
      default: () => ({}),
    },
    orderInfo: {
      type: Object,
      default: () => ({}),
    },
    fnctCd: {
      type: String,
      default: () => "",
    },
    uploadFlag: {
      type: Boolean,
      default: () => false,
    },
    getApiBizType: {
      type: Boolean,
      default: () => false,
    },
    // noTrans: {
    //   type: Boolean,
    //   default: () => false,
    // },
  },
  data() {
    return {
      detailInfo: {}, //服务组件基本信息
      itemList: ["基本信息", "输入参数", "L5服务列表"],
      svcId: "",
      noTrans: false,
      descList: {},
      keyList: {},
      keyOtherList:{},
      keywordList:{},
      javaKeyWord: [
        "private",
        "protected",
        "public",
        "abstract",
        "class",
        "extends",
        "final",
        "implements",
        "interface",
        "native",
        "new",
        "static",
        "strictfp",
        "synchronized",
        "transient",
        "volatile",
        "break",
        "case",
        "continue",
        "default",
        "do",
        "else",
        "for",
        "if",
        "instanceof",
        "return",
        "switch",
        "while",
        "assert",
        "catch",
        "finally",
        "throw",
        "throws",
        "try",
        "import",
        "package",
        "boolean",
        "byte",
        "char",
        "double",
        "float",
        "int",
        "long",
        "short",
        "super",
        "this",
        "void",
        "goto",
        "const",
        "null",
        "true",
        "false",
      ],
      competitorId:"", //银行ID
    };
  },
  computed: {},
  inject: {
    funcDetail: {
      type: Object
    }
  },
  methods: {
    showRelatedTops() {
      this.$emit("showRelatedTops");
    },
    setTransFlag(e) {
      this.noTrans = e;
    },
    //点击提交按钮 保存D4b服务信息
    async handleConfirm() {
      const sendData = this.$refs.paramsRef.sendData;
      const receiveData = this.$refs.paramsRef.receiveData;
      // this.getNodeId(sendData[2].children, sendData[2].paramOrder);
      const i = this.getOnly(sendData);
      if (i.length > 0)
        return this.$message.error(
          "输入参数的参数key: " + i[0].paramKey + "不能重复!请检查"
        );
      // this.getNodeId(receiveData[1].children, receiveData[1].paramOrder);
      const l = this.getOnly(receiveData);
      if (l.length > 0)
        return this.$message.error(
          "输出参数的参数key: " + l[0].paramKey + "不能重复，请检查"
        );
      //转一维数组
      let puApiParams = JSON.parse(
        JSON.stringify(
          mixList(sendData, "children").concat(mixList(receiveData, "children"))
        )
      );
      const isEmpty = this.getCheckEmpty(puApiParams);
      if (isEmpty) {
        return this.$message.error("参数Key、参数名称、参数值类型不能为空");
      }
      this.descList = {};
      this.hasDesc(puApiParams);
      if (this.descList[0]) {
        return this.$message.error(
          `请在输入参数：【${this.descList[0]}】的 "参数描述" 输入自定义原因`
        );
      }
      if (this.descList[1]) {
        return this.$message.error(
          `请在输出参数：【${this.descList[1]}】的 "参数描述" 输入自定义原因`
        );
      }
      this.keyList = {};
      this.hasKey(puApiParams);
      if (this.keyList[0])
        return this.$message.error(
          `自定义输入参数类型为List：参数名称为【${this.keyList[0]}】的 "参数key"要以List为结尾`
        );
      if (this.keyList[1])
        return this.$message.error(
          `自定义输出参数类型为List：参数名称为【${this.keyList[1]}】的 "参数key"要以List为结尾`
        );
      // if (this.checkListEnd(puApiParams)) {
      //   return this.$message.error(
      //     `当自定义参数类型为List的时候，参数Key请以List结尾`
      //   );
      // }
      this.keyOtherList = {};
      this.hasOtherKey(puApiParams)
      if(this.keyOtherList[0]) return this.$message.error(`自定义输入参数：参数名称为【${this.keyOtherList[0]}】的 "参数key"以英文开头,或数字结尾,例如AA、A88,不能是A8A8`)
      if(this.keyOtherList[1]) return this.$message.error(`自定义输出参数：参数名称为【${this.keyOtherList[1]}】的 "参数key"以英文开头,或数字结尾,例如AA、A88,不能是A8A8`)
      this.keywordList = {};
      this.hasKeyword(puApiParams)
      if(this.keywordList[0]) return this.$message.error(`自定义输入参数类型为Object：参数名称为【${this.keywordList[0]}】的 "参数key"不能是Java关键字`)
      if(this.keywordList[1]) return this.$message.error(`自定义输入参数类型为Object：参数名称为【${this.keywordList[1]}】的 "参数key"不能是Java关键字`)
      
      if (puApiParams) {
        puApiParams.map((item, index) => {
          item.paramIndex = index;
        });
      }
      let funcInfo = JSON.parse(getSessionStorage("func-info"));
      const params = {
        fnctId: this.fnctCd || this.$route.query.fnctId,
        blngTyp: "0",
        blngtoTyp: "00",
        apiId: this.basicData.svcId, // ApiID
        apiName: this.basicData.svcNm, // API名称
        apiCode: this.basicData.svcCd, // Api编号
        inOutFlg: this.basicData.inOutFlg, // 内外标志
        apiVersion: this.basicData.svcVersionNo, // API版本
        arsId: this.basicData.sysId, // 系统Id
        arsNm: this.basicData.arsNm, // 系统名称
        lvl1TypeCodeId: "", // 服务大类
        lvl2TypeCodeId: "", // 服务小类
        apiServiceType: this.basicData.svcTpCd, // 服务类型
        apiDesc: this.basicData.svcDesc, // API描述
        versionDesc: this.basicData.sersionDesc, // API版本描述
        // groupId: this.basicData.groupId,
        beltLine: this.basicData.beltLine, // 归属业务线
        // groupNm: this.basicData.groupNm, // 归属业务线
        // businessRuleList,
        // paramList: sendData.concat(receiveData),
        paramList: puApiParams,
        l5SvcList: this.$refs.l5servRef.l5ServiceList,
        d4UseDataSetRelList: [],
        isLogin: this.basicData.isLogin ? "1" : "0", //是否登录
        isSession: this.basicData.isSession ? "1" : "0", //是否需要会话
        isVerificationCode: this.basicData.isVerificationCode ? "1" : "0", //是否需要校验验证码
        isUploadFile: this.basicData.isUploadFile ? "1" : "0", //是否上传文件
        // 资产
        groupId: funcInfo.admiId,
        groupNm: funcInfo.modelName,
        // 客户
        bkId: funcInfo.competitorId || this.competitorId,
        bkNm: funcInfo.competitorName,
        // 应用
        arsId: funcInfo.appLabel,
        arsNm: funcInfo.appLabelName,
        
      };
      this.isConfirm = true;
      console.log("参数：--》", params);
      await this.rpc.d4.editD4Trans(params);
      this.$notify({
        title: "成功",
        message: "保存成功",
        duration: 2000,
        type: "success",
      });
      this.isConfirm = false;
      this.$emit("changeList")
    },
    getOnly(arrs, operate) {
      if (operate == "only") {
        let list = unduplicated(arrs, "paramKey");
        if (list.length == arrs.length) return [];
        return arrs.filter((item) => list.indexOf(item) == -1);
      } else {
        const list = mixList(arrs, "children");
        const data = unduplicated(list, "paramParentId");
        let i = [];
        console.log("data", data);
        data.forEach((item) => {
          const l = list.filter((it) => it.paramParentId == item.paramParentId);
          const f = this.getOnly(l, "only");
          if (f.length > 0) {
            i = f;
          }
        });
        return i;
      }
    },
    getCheckEmpty(data) {
      let flag = false;
      data.forEach((item) => {
        if (!item.paramKey || !item.paramCName || !item.paramValueType) {
          flag = true;
        }
      });
      return flag;
    },
    hasDesc(data) {
      data.map((item) => {
        if (
          item.paramCustomFlg == "1" &&
          !item.paramDesc &&
          item.paramValueType != "List" &&
          item.paramValueType != "Object"
        ) {
          if (item.paramDirection in this.descList) {
            this.descList[item.paramDirection].push(item.paramCName);
          } else {
            this.descList[item.paramDirection] = [];
            this.descList[item.paramDirection].push(item.paramCName);
          }
        }
        if (item.children && item.children.length) {
          this.hasDesc(item.children);
        }
      });
    },
    hasKey(data) {
      data.map((item) => {
        if (
          item.paramValueType == "List" &&
          !/List$/.test(item.paramKey)
        ) {
          if (item.paramDirection in this.keyList) {
            this.keyList[item.paramDirection].push(item.paramCName);
          } else {
            this.keyList[item.paramDirection] = [];
            this.keyList[item.paramDirection].push(item.paramCName);
          }
        }
        if (item.children && item.children.length) {
          this.hasKey(item.children);
        }
      });
    },
    // 判断自定义参数为List类型时paramKey是否以List结尾
    checkListEnd(data) {
      let flag = data.some((item) => {
        if (item.paramCustomFlg == "1" && item.paramValueType == "List") {
          let param = item.paramKey.slice(-4);
          return param != "List";
        } else {
          if (item.children && item.children.length) {
            this.checkListEnd(item.children);
          }
        }
      });
      return flag;
    },
    // 遍历数组 重新排序
    getNodeId(arrs, id) {
      if (!arrs || arrs.length == 0) return [];
      let i = 0;
      while (arrs[i]) {
        arrs[i].paramOrder = id ? id + "." + (i + 1) : i + 1 + "";
        arrs[i].paramParentId = id ? id : "";
        if (arrs[i].children && arrs[i].children.length > 0) {
          this.getNodeId(arrs[i].children, arrs[i].paramOrder);
        }
        i++;
      }
    },
    //自定义参数只能是英文
    hasOtherKey(data) {
      data.map(item => {
        if(item.paramValueType !== "List" && !(/^[a-zA-Z]+[0-9]*$/).test(item.paramKey)) {
          if(item.paramDirection in this.keyOtherList) {
            this.keyOtherList[item.paramDirection].push(item.paramCName)
          }else {
            this.keyOtherList[item.paramDirection] = []
            this.keyOtherList[item.paramDirection].push(item.paramCName)
          }
        }
        if(item.children && item.children.length) {
          this.hasOtherKey(item.children)
        }
      })
    },
    //自定义参数类型是List、Object,参数key不能是Java关键字
    hasKeyword(data) {
      data.map(item => {
        if(item.paramValueType == "Object" && this.javaKeyWord.includes(item.paramKey) ) {
          if(item.paramDirection in this.keywordList) {
            this.keywordList[item.paramDirection].push(item.paramCName)
          }else {
            this.keywordList[item.paramDirection] = []
            this.keywordList[item.paramDirection].push(item.paramCName)
          }
        }
        if(item.children && item.children.length) {
          this.hasKeyword(item.children)
        }
      })
    },
    // 初始化
    init() {},
  },
  created() {
    this.init();
    this.competitorId = this.$route.query.competitorId || "";
  },
  watch: {
    async basicData(res, o) {
      this.detailInfo = res;
      this.detailInfo.isSession =
        this.detailInfo.isSession == "1" ? true : false;
      this.detailInfo.isVerificationCode =
        this.detailInfo.isVerificationCode == "1" ? true : false;
      this.detailInfo.isUploadFile = this.detailInfo.isUploadFile == "1"
      this.detailInfo.isLogin = this.detailInfo.isLogin == "1"
      this.iInputList = [];
      this.iOutputList = [];
      this.svcId = res.svcId;
      this.$nextTick(() => {
        if (this.svcId) {
          this.$refs.l5servRef.initData(this.svcId);
          this.$refs.paramsRef.initParams(res);
        } else {
          this.$refs.paramsRef.sendData = [];
          this.$refs.paramsRef.receiveData = [];
          this.$refs.l5servRef.l5ServiceList = [];
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4bdesign_info_baisc {
  ::v-deep .el-textarea__inner:focus,
  ::v-deep .el-input__inner:focus {
    border-color: $pri_br_color;
  }
  .content_wrapper {
    font-family: $font_regular;
    .content_read {
      .detail_content {
        background: $base_white;
        padding: 20px 32px;
        margin-bottom: 16px;
        .check_group {
          display: flex;
          margin-top: 16px;
          .left,
          .right {
            width: 50%;
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
    }
  }
}
</style>
