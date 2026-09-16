 <template>
  <div class="aop_tradedesign_comps_apimgmt_api_view">
    <ServiceTabs
      :tabsList="tabsList"
      :defaultActive="defaultActive"
      @tabClick="handleTabClick"
      @tabEdit="handleTabsEdit"
    >
    </ServiceTabs>
    <ApiInfo
      ref="apiInfoRef"
      v-if="defaultActive == 'v'"
      :apiId="apiId"
      @toCaseList="toCaseList"
      @toApiList="toApiList"
    ></ApiInfo>
    <ApiMod
      ref="apiModRef"
      v-if="defaultActive == 'm'"
      :apiId="apiId"
      :arsId="arsId"
      @toApiInfo="toApiInfo"
    ></ApiMod>
    <CaseTest
      ref="caseTestRef"
      v-if="defaultActive == 't'"
      :apiId="apiId"
      type="view"
      @toAddCase="toAddCase"
    ></CaseTest>
    <CaseList
      ref="caseListRef"
      v-if="defaultActive == 'k'"
      :apiId="apiId"
      :type="'view'"
      @toApiView="toApiView"
      @toCaseDetail="toCaseDetail"
      @toCaseTest="toCaseTest"
      @toAddCase="toAddCase"
      @toAddRevCase="toAddRevCase"
      @toModCase="toModCase"
      @toCopyCase="toCopyCase"
    ></CaseList>
    <RuleList
      ref="ruleListRef"
      v-if="defaultActive == 'r'"
      :apiId="apiId"
      :btnAuth="btnAuth"
      type="inDetail"
      @toObjDetail="toObjDetail"
      @toModObj="toModObj"
    ></RuleList>
    <Flow ref="flowRef" v-if="defaultActive == 'b'" :apiId="apiId" @toObjDetail="toObjDetail"></Flow>

    <!-- Mock详情 -->
    <CaseDetail v-if="defaultActive === 'td'" :caseId="caseId" :isReverse="isReverse"></CaseDetail>

    <!-- 业务对象详情 -->
    <ObjDetail v-if="defaultActive === 'od'" :bsnObjId="bsnObjId" @toApiViewObj="toApiViewObj"></ObjDetail>

  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import ServiceTabs from "@m/core/components/page_tabs";
import ApiInfo from "./components/api_info";
import ApiMod from "./components/api_mod";
import Flow from "./components/api_flow";
import RuleList from "./components/api_flow/iRule";
import CaseTest from "../case_test";
import CaseList from "../case_list";
import CaseDetail from "../case_detail";
import ObjDetail from "../api_public/objDetail";
export default {
  mixins: [mixin],
  components: {
    ServiceTabs,
    ApiInfo,
    ApiMod,
    CaseTest,
    CaseList,
    RuleList,
    Flow,
    CaseDetail,
    ObjDetail
  },
  props: {
    rId: {
      type: String,
      default: () => "",
    },
    arsId: {
      type: String,
      default: () => "",
    },
    type: {
      type: String,
      default: () => "",
    },
    pageType: {
      type: String,
      default: () => "",
    }
  },
  data() {
    return {
      // 页签列表
      tabsList: [
        { v: "预览", k: "v" },
        { v: "编辑", k: "m" },
        { v: "测试", k: "t" },
        { v: "MOCK", k: "k" },
        { v: "业务规则", k: "r" },
        { v: "业务流程", k: "b" },
      ],
      // 默认活动页签
      defaultActive: "none",
      apiId: "",
      caseId: "",
      btnAuth: false,
      isReverse: "",
      bsnObjId: "",
      bsnObjType: "",
    };
  },
  methods: {
    //tab切换
    handleTabClick(e) {
      this.defaultActive = e;
    },
    handleTabsEdit(e) {
      this.tabsList = this.tabsList.filter((item) => {
        return item.k !== e;
      });
      if(e == "td") {
        this.defaultActive = "k";
      } else if (e == "od" && this.bsnObjType == "rule") {
        this.defaultActive = "r";
      } else if (e == "od" && this.bsnObjType == "business") {
        this.defaultActive = "b";
      }
      
    },
    init() {
      this.apiId = this.rId;
      this.btnAuth = this.type === "app" || this.type === "api" || this.type === "mock" ? false : true;
      if (this.btnAuth) {
        this.tabsList = [
          { v: "预览", k: "v" },
          { v: "编辑", k: "m" },
          { v: "测试", k: "t" },
          { v: "MOCK", k: "k" },
          { v: "业务规则", k: "r" },
          { v: "业务流程", k: "b" },
        ];
      } else {
        this.tabsList = [
          { v: "预览", k: "v" },
          { v: "测试", k: "t" },
          { v: "MOCK", k: "k" },
          { v: "业务规则", k: "r" },
          { v: "业务流程", k: "b" },
        ];
      }
      this.defaultActive = "none";
      this.$nextTick(() => {
        this.defaultActive = this.pageType == "mock" || this.type === "mock" ? "k" :  "v";
      });
    },
    toApiInfo() {
      this.init();
    },
    toAddCase(e) {
      this.$emit("toAddCase", e);
    },
    toCaseList(e) {
      this.$emit("toCaseList", e);
    },
    toCaseTest(e) {
      this.$emit("toCaseTest", e);
    },
    toCaseDetail(e,p) {
      const i = this.tabsList.find((item) => {return item.k == "td"})
      if(!i) this.tabsList.push({ v: "Mock详情", k: "td", closable: true });
      this.defaultActive = "td";
      this.caseId = e;
      this.isReverse = p
    },
    toAddRevCase(e) {
      this.$emit("toAddRevCase", e);
    },
    toModCase(e) {
      this.$emit("toModCase", e);
    },
    toCopyCase(e) {
      this.$emit("toCopyCase", e);
    },
    // 去业务对象详情
    toObjDetail(e,p) {
      const i = this.tabsList.find((item) => {return item.k == "od"})
      if(!i) this.tabsList.push({ v: "业务对象详情", k: "od", closable: true });
      this.defaultActive = "od";
      this.bsnObjId = e
      this.bsnObjType = p
    },
    toModObj(e) {
      this.$emit("toModObj", e)
    },
    toApiList() {
      this.$emit("toApiList")
    }
  },
  created() {
    this.init();
  },
  watch: {
    rId(n, o) {
      this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_api_view {
}
</style>

