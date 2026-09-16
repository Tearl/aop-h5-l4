<template>
  <div class="aop_tradecode_comps_d4bdesign_info_baisc">
    <div class="content_wrapper">
      <!-- 查看基本信息 -->
      <div class="content_read">
        <div class="detail_content">
          <div class="flex">
            <div class="content_header base_nav_title mgr20">基本信息</div>
            <el-checkbox v-model="detailInfo.isCommon" :disabled="isRead" v-if="!isRead">是否常用</el-checkbox>
            <div class="common_title" v-if="detailInfo.isCommon == '1' && isRead">常用</div>
          </div>
          <DetailInfo
            :detailInfo="detailInfo"
            :uploadFlag="uploadFlag"
            :getApiBizType="getApiBizType"
            :noTrans="isRead"
            @showRelatedTops="showRelatedTops"
            ref="detailRef"
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
            <span>{{ detailInfo.isLoginOut == "1" ? "登出" : "" }}</span>
          </div>
        </div>

        <!-- 配置信息 -->
        <div class="detail_content">
          <div class="content_header base_nav_title">配置信息</div>
          <div class="check_group">
            <!-- <el-checkbox v-model="detailInfo.isLogin" :disabled="noTrans" class="left">是否登录</el-checkbox> -->
            <el-checkbox
              v-model="detailInfo.isSession"
              :disabled="isRead"
              class="left"
              >校验会话</el-checkbox
            >
            <el-checkbox
              v-model="detailInfo.isEncode"
              :disabled="isRead"
              class="right"
              >加解密</el-checkbox
            >
            <el-checkbox
              v-model="detailInfo.isDesensitization"
              :disabled="isRead"
              class="right"
              >脱敏</el-checkbox
            >
          </div>
        </div>

        <!-- 主流程图 -->
        <!-- <div class="process_middle">
          <div class="content_header base_nav_title">主流程图</div>
          <div class="process_box">
            <Process
              class="process_main"
              ref="process"
              pageType="mainFlow"
              :dataObj="dataObj"
              :isRead="true"
            >
            </Process>
          </div>
        </div> -->

        <!-- 参数配置 -->
        <div class="params_detail_content content_detail_params" v-if="!isRead">
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
        <!-- 参数配置 -->
        <div v-if="isRead">
          <div class="detail_content">
            <div class="content_header">输入参数</div>
            <Table
              class="table_style"
              :data="sendDataList"
              :table="iInputListTable"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div>
          <div class="detail_content">
            <div class="content_header base_nav_title">输出参数</div>
            <Table
              class="table_style"
              :data="receiveDataList"
              :table="iOutputListTable"
              :rowK="'paramOrder'"
              :treeProps="{ children: 'children' }"
            ></Table>
          </div>
        </div>

        <PageFooter
          @handleConfirm="handleConfirm"
          :confirmDisabled="isConfirm"
          :cancelLabel="''"
          :confirmLabel="'保存'"
          v-if="!isRead"
        ></PageFooter>
      </div>
      <div class="check_btn" v-if="showEdit">
        <el-button type="text" icon="el-icon-edit-outline" v-if="isRead" @click="changeEdit"
          >编辑</el-button
        >
        <el-button type="text" icon="el-icon-view" v-else  @click="changeEdit"
          >查看</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { unduplicated } from "@m/utils/array";
import DetailInfo from "./info";
import Table from "@m/core/components/page_table";
import { reList, mixList } from "@m/utils/paramTree";
import Params from "./components/params";
import PageFooter from "@m/core/components/page_footer";

export default {
  mixins: [mixin],
  components: {
    DetailInfo,
    Table,
    Params,
    PageFooter,
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
    currentD4bObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      detailInfo: {}, //服务组件基本信息
      svcId: "",
      noTrans: false,
      descList: {},
      keyList: {},
      competitorId: "", //银行ID
      /* 流程图相关变量 */
      dataObj: {
        flow: [],
        position: "",
      },
      appId: "",
      checkList: {},
      sendDataList: [],
      receiveDataList: [],
      isRead: true,
      isFilterList: [],
      apEncryTypeList: [],
      showEdit: true,
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
          tooltip: true,
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
          width: "200px",
          tooltip: true,
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramLength",
          label: "参数长度",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apEncryType",
          label: "加密类型",
          type: "text",
          filter: (scope) => {
            const option =  this.apEncryTypeList.find(item => item.value == scope.row?.apEncryType)
            return option?.type || "无"
          },
          tooltip: true,
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter",
          tooltip: true,
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apEnum",
          label: "枚举值",
          type: "text",
          tooltip: true,
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
          tooltip: true,
        },
        {
          prop: "paramCName",
          label: "参数名称",
          type: "text",
          width: "200px",
          tooltip: true,
        },
        {
          prop: "paramValueType",
          label: "参数值类型",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramLength",
          label: "参数长度",
          type: "text",
          tooltip: true,
        },
        {
          prop: "actionName",
          label: "来源",
          type: "text",
          tooltip: true,
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
          tooltip: true,
        },
        {
          prop: "desensitizationType",
          label: "脱敏类型",
          type: "text",
          filter: (scope) => {
            const option =  this.isFilterList.find(item => item.value == scope.row?.desensitizationType)
            return option?.type || "无"
          },
          tooltip: true,
        },
        {
          prop: "apEncryType",
          label: "加密类型",
          type: "text",
          filter: (scope) => {
            const option =  this.apEncryTypeList.find(item => item.value == scope.row?.apEncryType)
            return option?.type || "无"
          },
          tooltip: true,
        },
        {
          prop: "isNeed",
          label: "是否必输",
          type: "text",
          filter: "isFilter",
          tooltip: true,
        },
        {
          prop: "paramValue",
          label: "默认值",
          type: "text",
          tooltip: true,
        },
        {
          prop: "paramDesc",
          label: "参数描述",
          type: "text",
          tooltip: true,
        },
        {
          prop: "apEnum",
          label: "枚举值",
          type: "text",
          tooltip: true,
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
  inject: {
    funcDetail: {
      type: Object,
    },
    reloadDetailInfo: {
      type: Function,
    },
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
      const i = this.getOnly(sendData);
      if (i.length > 0)
        return this.$message.error(
          "输入参数的参数key: " + i[0].paramKey + "不能重复!请检查"
        );
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
      // this.descList = {};
      // this.hasDesc(puApiParams);
      // if (this.descList[0]) {
      //   return this.$message.error(
      //     `请在输入参数：【${this.descList[0]}】的 "参数描述" 输入自定义原因`
      //   );
      // }
      // if (this.descList[1]) {
      //   return this.$message.error(
      //     `请在输出参数：【${this.descList[1]}】的 "参数描述" 输入自定义原因`
      //   );
      // }
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
      if (this.basicData.isEncode) {
        this.sendDataList = [];
        let sendDataChild = sendData.filter(
          (item) => item.paramKey == "bodyData"
        );
        this.hasCheck(sendDataChild, "bodyData");
        if (this.sendDataList?.length > 0) {
          return this.$message.error(
            `输入参数解密类型不能为空，参数名称为【${this.sendDataList}】`
          );
        }
        // this.sendDataList = [];
        this.receiveDataList = [];
        let receiveChild = receiveData.filter(
          (item) => item.paramKey == "bodyOutData"
        );
        this.hasCheck(receiveChild, "bodyOutData");
        if (this.receiveDataList?.length > 0) {
          return this.$message.error(
            `输出参数加密类型不能为空，参数名称为【${this.receiveDataList}】`
          );
        }
      }

      if (puApiParams) {
        puApiParams.map((item, index) => {
          item.paramIndex = index;
        });
      }
      // let funcInfo = JSON.parse(getSessionStorage("func-info"));
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
        paramList: puApiParams,
        d4UseDataSetRelList: [],
        isLogin: this.basicData.isLogin ? "1" : "0", //是否登录
        isSession: this.basicData.isSession ? "1" : "0", //是否需要会话
        isVerificationCode: this.basicData.isVerificationCode ? "1" : "0", //是否需要校验验证码
        isUploadFile: this.basicData.isUploadFile ? "1" : "0", //是否上传文件
        // svcSeq: this.basicData.svcSeq,
        isEncode: this.basicData.isEncode ? "1" : "0", //是否加密
        isDesensitization: this.basicData.isDesensitization ? "1" : "0", //是否脱敏
        isCommon: this.basicData.isCommon ? "1" : "0",   //是否常用：1-常用;0-不常用
      };
      this.isConfirm = true;
      console.log("参数：--》", params);
      await this.rpc.newEditor.editD4Trans(params);
      this.$notify({
        title: "成功",
        message: "保存成功",
        duration: 2000,
        type: "success",
      });
      this.isConfirm = false;
      this.$emit("changeList");
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
        // console.log("data", data);
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
          item.paramCustomFlg == "1" &&
          item.paramValueType.includes('List') &&
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
        if (item.paramCustomFlg == "1" && item.paramValueType.includes('List')) {
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
    // 初始化
    init() {},
    search() {
      this.$emit("showRelatedTops");
    },
    hasCheck(data, type) {
      if (data?.length == 0) return [];
      data.map((item) => {
        if (
          !["bodyData", "bodyOutData"].includes(item.paramKey) &&
          item.paramParentId &&
          !item.apEncryType
        ) {
          if (type == "bodyData") this.sendDataList.push(item.paramCName);
          else this.receiveDataList.push(item.paramCName);
        }
        if (item?.children?.length > 0) {
          this.hasCheck(item.children, type);
        }
      });
    },
    changeEdit() {
      this.isRead = !this.isRead;
      if (!this.isRead) {
        this.$nextTick(() => {
          this.$refs.detailRef.showInterface = false;
          this.$refs.paramsRef.initParams(this.detailInfo);
        });
      } else {
        this.sendDataList = reList(
          this.detailInfo.puApiParams.filter((item) => item.paramDirection == 0)
        );
        this.receiveDataList = reList(
          this.detailInfo.puApiParams.filter((item) => item.paramDirection == 1)
        );
        this.setSourceOption(this.receiveDataList);
      }
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
  created() {
    this.init();
    this.competitorId = this.$route.query.competitorId || "";
    this.appId = this.$route.query.appId || "";
  },
  watch: {
    async basicData(res, o) {
      this.detailInfo = res;
      this.detailInfo.isSession =
        this.detailInfo.isSession == "1" ? true : false;
      this.detailInfo.isVerificationCode =
        this.detailInfo.isVerificationCode == "1" ? true : false;
      this.detailInfo.isUploadFile = this.detailInfo.isUploadFile == "1";
      this.detailInfo.isLogin = this.detailInfo.isLogin == "1";
      this.detailInfo.isEncode = this.detailInfo.isEncode == "1";
      this.detailInfo.isDesensitization =
        this.detailInfo.isDesensitization == "1";
      this.detailInfo.isCommon = this.detailInfo.isCommon == "1";
      this.sendDataList = [];
      this.receiveDataList = [];
      this.svcId = res.svcId;
      this.isRead = true;
      console.log("--res--", res);
      this.$nextTick(() => {
        if (this.svcId) {
          // this.$refs.l5servRef.initData(this.svcId);
          if (!this.isRead) {
            this.$refs.detailRef.showInterface = false;
            this.$refs.paramsRef.initParams(res);
          } else {
            this.sendDataList = reList(
              res.puApiParams.filter((item) => item.paramDirection == 0)
            );
            this.receiveDataList = reList(
              res.puApiParams.filter((item) => item.paramDirection == 1)
            );
            this.setSourceOption(this.receiveDataList);
            this.getDessitizaList();
          }
          // this.$refs.paramsRef.initParams(res);

          // this.$refs.detailRef.getInterfaceNm(res.svcNm);
        } else {
          this.$refs.paramsRef.sendData = [];
          this.$refs.paramsRef.receiveData = [];
        }
      });
    },
    currentD4bObj(res){
      if(res && res.srcFnctFlg == "1"){
        this.showEdit = true;
      }else {
        this.showEdit = false;
      }
      console.log("----",res)
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_d4bdesign_info_baisc {
  ::v-deep .el-textarea__inner:focus,
  ::v-deep .el-input__inner:focus {
    border-color: $pri_br_color;
  }
  .content_wrapper {
    font-family: $font_regular;
    position: relative;
    .content_read {
      position: relative;
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
      .process_middle {
        background: $base_white;
        padding: 20px 32px;
        margin-bottom: 16px;
        height: 500px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .process_box {
        @include scrollbar;
        overflow-y: auto;
        overflow-x: auto;
      }
      .btn {
        position: absolute;
        right: 55%;
        top: 10px;
      }
    }
  }
  .check_btn {
    position: absolute;
    top: 10px;
    right: 40px;
  }
  .aop_tradecode_comps_page_footer{
    margin-bottom: 38px;
  }
  .flex{
    display: flex;
    align-items: center;
  }
  .mgr20{
    margin-right: 20px;
  }
  .common_title{
    border-radius: 50% 50%;
    transform:scale(0.8);
    width: 28px;
    // height: 24px;
    text-align: center;
    line-height: 24px;
    // background: #e5ffe7;
    background: #ffffff;
    color: red;
    // border-color: #e5ffe7;
    font-size: 12px;
    // box-shadow: #36d542;
    border: 1px solid red;
  }
}
</style>
