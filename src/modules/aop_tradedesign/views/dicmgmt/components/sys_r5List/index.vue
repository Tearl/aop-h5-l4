<template>
  <div class="aop_tradedesign_page_dicmgmt_sys_r5List">
    <div class="content_box">
      <div
        :class="
          sidebarVisible ? 'apiServ_wrapper' : 'apiServ_wrapper_without_sidebar'
        "
      >
        <!-- Api管理 -->
        <ApiList
          ref="apiListRef"
          v-if="flag === '0'"
          :servType="servType"
          :sgId="sgId"
          :arsId="arsId"
          :fnctId="fnctId"
          :groupName="groupName"
          :apiServiceType="apiServiceType"
          :msgFormat="msgFormat"
          :apiState="apiState"
          @toApiView="toApiView"
          @toApiCopy="toApiCopy"
          @getTreeList="getTreeList"
        ></ApiList>
        <!-- Api查看 -->
        <ApiView
          v-if="flag === '1'"
          :rId="rId"
          :arsId="arsId"
          :type="type"
          :pageType="pageType"
          @toAddCase="toAddCase"
          @toCaseList="toCaseList"
          @toCaseDetail="toCaseDetail"
          @toCaseTest="toCaseTest"
          @toAddRevCase="toAddRevCase"
          @toModCase="toModCase"
          @toCopyCase="toCopyCase"
          @toObjDetail="toObjDetail"
          @toModObj="toModObj"
          @toApiList="toApiList"
        ></ApiView>

        <!-- Mock测试 -->
        <CaseTest
          v-if="flag === '4'"
          :caseId="caseId"
          @toAddCase="toAddCase"
          @toBack="toBack"
          @caseChange="caseChange"
        ></CaseTest>
        <!-- Mock新增 -->
        <AddCase
          v-if="flag === '6'"
          :apiId="rId"
          :arsId="arsId"
          :apiServiceType="apiServiceType"
          :sceneId="sId"
          @toApiView="toBack"
        ></AddCase>
        <!-- 反Mock新增 -->
        <AddRevCase
          v-if="flag === '7'"
          :apiId="rId"
          :caseId="caseId"
          @toApiView="caseToApiView"
        ></AddRevCase>
        <!-- Mock编辑 -->
        <ModCase
          v-if="flag === '8'"
          :apiId="rId"
          :caseId="caseId"
          :arsId="arsId"
          @toApiView="caseToApiView"
        ></ModCase>
        <!-- Mock复制 -->
        <CopyCase
          v-if="flag === '9'"
          :apiId="rId"
          :caseId="caseId"
          :arsId="arsId"
          @toApiView="caseToApiView"
        ></CopyCase>

        <!-- 业务对象详情 -->
        <ObjDetail
          v-if="flag === '12'"
          :bsnObjId="bsnObjId"
          @toApiViewObj="toApiViewObj"
        ></ObjDetail>

        <ModObj
          v-if="flag === '13'"
          :bsnObjId="bsnObjId"
          :sysId="arsId"
          @toApiViewObj="toApiViewObj"
        ></ModObj>
      </div>
    </div>
  </div>
</template> 

<script>
import ApiList from "./components/fnct_public/api_list";
import ApiView from "./components/api_view";
import CaseTest from "./components/case_test";

import AddCase from "./components/case_form/add";
import AddRevCase from "./components/case_form/addr";
import ModCase from "./components/case_form/mod";
import CopyCase from "./components/case_form/copy";

import ObjDetail from "./components/api_public/objDetail";
import ModObj from "./components/api_public/modObj";
import PageHeader from "@m/core/components/page_header";

import { setSessionStorage, getSessionStorage } from "@m/utils/localStorage";
export default {
  components: {
    ApiList,
    ApiView,
    CaseTest,
    AddCase,
    AddRevCase,
    ModCase,
    CopyCase,
    ObjDetail,
    ModObj,
    PageHeader,
  },
  props: {
    arsId: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      // 导航栏参数
      breadcrumbs: [
        {
          label: "资产视图",
          operate: "view",
        },
        {
          label: "功能列表",
          operate: "fnctList",
        },
        {
          label: "API列表",
        },
      ],
      sgId: "",
      // arsId: "",
      rId: "", // apiId
      sId: "", // 场景id
      caseId: "",
      apiId: "",
      flag: "0",
      apiServiceType: "",
      groupName: "",
      sidebarVisible: true,
      type: "",
      // 是否为反Mock
      isReverse: "",
      msgFormat: "",
      goBack: "", // 添加Mock 返回
      pageType: "",
      bsnObjId: "",
      toType: "",
      fnctData: {},
      fnctId: "",
      servType: "",
      apiState: ""
    };
  },
  methods: {
    init() {
      // this.arsId = this.$route.query.arsId || "";
      this.apiId = this.$route.query.apiId || "";
      this.type = this.$route.query.type || "";
      this.servType = this.$route.query.servType || "";
      this.toType = this.$route.query.toType || "";
      this.fnctData = this.$route.query.fnctData || {};
      this.fnctId = this.$route.query.fnctId || "";
      if (this.toType == "api") {
        // 导航栏参数
        this.breadcrumbs = [
          {
            label: "资产视图",
            operate: "view",
          },
          {
            label: "API列表",
            operate: "apiList",
          },
          {
            label: "API详情",
          },
        ];
      } else if (this.toType == "view") {
        // 导航栏参数
        this.breadcrumbs = [
          {
            label: "资产视图",
            operate: "view",
          },
          {
            label: "功能列表",
            operate: "fnctList",
          },
          {
            label: "API列表",
          },
        ];
      } else {
        // 导航栏参数
        this.breadcrumbs = [
          {
            label: "功能列表",
            operate: "list",
          },
          {
            label: "API详情",
          },
        ];
      }
      this.msgFormat = this.$route.query.msgFormat || "";
      this.apiServiceType = this.$route.query.serviceType || "";
      // if(this.arsId !== "") {
      //   this.sidebarVisible = true;
      // }else {
      //   this.sidebarVisible = false;
      // }
      if (this.apiId !== "") {
        this.$nextTick(() => {
          this.toApiView(this.apiId);
        });
      } else {
        this.flag = "0";
      }
      // this.sgId = getSessionStorage("workgate-sgId") || "";
      // this.apiServiceType = getSessionStorage("workgate-servType") || "";
      this.sId = getSessionStorage("workgate-sceneId") || "";
    },
    // 导航栏点击
    labelClick(e) {
      if (e == "view") {
        this.$router.push({
          path: "/aop_tradedesign/apimgmt/assetsView",
        });
      } else if (e == "apiList") {
        this.$router.push({
          path: "/aop_tradedesign/apimgmt/apiList",
          query: {
            type: "view",
          },
        });
      } else if (e == "fnctList") {
        this.$router.push({
          path: "/aop_tradedesign/apimgmt/fnctList",
          query: {
            type: "view",
          },
        });
      } else if (e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/apimgmt/fnctList",
        });
      }
    },
    toApiList(e, name, apiState) {
      this.apiState = apiState || "0"
      this.flag = "0";
      if (!e && !name) {
        this.$nextTick(() => {
          this.$refs.apiListRef.getList();
        });
        return;
      }
      this.sgId = e;
      this.groupName = name;
      setSessionStorage("workgate-sgId", e);
    },
    toApiView(e) {
      this.flag = "1";
      this.type = "";
      this.pageType = "";
      this.rId = e;
    },
    caseToApiView(e) {
      this.flag = "1";
      this.pageType = "mock";
      this.rId = e;
    },
    toApiCopy(e) {
      this.flag = "2";
      this.rId = e;
    },
    toCaseList(e) {
      this.flag = "3";
      this.sId = e;
    },
    toCaseTest(e, i) {
      this.flag = "4";
      this.caseId = e;
      this.goBack = i ? i : "";
    },
    toCaseDetail(e, p) {
      this.flag = "5";
      this.caseId = e;
      this.isReverse = p;
    },
    toAddCase(e, i) {
      this.flag = "6";
      this.rId = e;
      this.goBack = i ? i : "";
    },
    toBack(e) {
      if (this.goBack == "scene") {
        this.toSceneDetail(this.sId);
      } else {
        this.caseToApiView(e);
      }
    },
    toAddRevCase(e) {
      this.flag = "7";
      this.caseId = e;
    },
    toModCase(e) {
      this.flag = "8";
      this.caseId = e;
    },
    toCopyCase(e) {
      this.flag = "9";
      this.caseId = e;
    },
    toSceneList(e) {
      this.flag = "10";
    },
    toSceneDetail(e) {
      this.flag = "11";
      this.sId = e;
    },
    toObjDetail(e, p) {
      this.flag = "12";
      this.bsnObjId = e;
      this.pageType = p;
    },
    toModObj(e) {
      this.flag = "13";
      this.bsnObjId = e;
    },
    // 业务对象详情返回
    toApiViewObj() {
      this.flag = "1";
    },
    // 刷新左边树
    getTreeList() {
      // this.$refs.apiSidebarRef.getApiGroupList()
      this.$refs.apiSidebarRef.getTreeList();
    },
    toGetSceneList() {
      this.$refs.apiSidebarRef.handleTabClick("2");
    },
    showChange() {
      this.sidebarVisible = !this.sidebarVisible;
    },
    caseChange(e) {
      this.$refs.apiSidebarRef.caseChange(e);
    },
  },
  created() {
    this.init();
  },
  activated(e) {
    console.log(123, e);
    this.init();
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_dicmgmt_sys_r5List {
  .content_box {
    // padding: 16px;
    display: flex;
  }
  .apiServ_wrapper {
    width: 100%;
    // padding-left: 316px;
    overflow-x: hidden;
  }
  .apiServ_wrapper_without_sidebar {
    width: 100%;
    padding-left: 0;
    overflow-x: hidden;
  }
  .trigger_diy {
    position: absolute;
    left: 313px;
    top: 50%;
    width: 11px;
    height: 84px;
    line-height: 84px;
    color: #fff;
    font-size: 18px;
    padding-right: 10px;
    cursor: pointer;
    transition: background 0.3s ease;
    z-index: 2;
    background: rgba(0, 0, 0, 0);
    border-top: 11px solid rgba(0, 0, 0, 0);
    border-bottom: 11px solid rgba(0, 0, 0, 0);
    border-left: 11px solid #409eff;
    i {
      margin-left: -15px;
      margin-top: -25px;
      vertical-align: middle;
    }
  }
  .trigger_diy_without_sidebar {
    left: 0px;
  }
  .header_title {
    padding: 20px 24px;
    background: $base_white;
    margin-bottom: 16px;
    .el-form {
      @include form;
      display: flex;
      ::v-deep .el-form-item {
        flex: 1;
        margin-bottom: 0;
        margin-right: 8px;
      }
    }
  }
}
</style>

