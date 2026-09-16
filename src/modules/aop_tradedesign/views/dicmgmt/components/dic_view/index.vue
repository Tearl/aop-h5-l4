<template>
  <div class="aop_tradedesign_page_dicmgmt_dic_view">
    <!-- <div :class="dicType =='sysView' ? 'view_bread_crumb_fixed' : 'bread_crumb_fixed'">
      <common-header v-if="dataDictionProd=='d'" class="common_header" label="数据字典列表" subLabel="数据字典详情" @toDicList="toDicList" />
      <common-header v-if="dataDictionProd=='w'" class="common_header" label="待审批列表" subLabel="待审批详情" @toDicList="toDicList" />
      <common-header v-if="dataDictionProd=='y'" class="common_header" label="已审批列表" subLabel="已审批详情" @toDicList="toDicList" />
    </div> -->
    <ServiceTabs
      :type="dicType == 'pubView' ? '2' : '1'"
      :tabsList="tabsList"
      :defaultActive="defaultActive"
      @tabClick="handleTabClick"
    >
    </ServiceTabs>
    <div :class="tabsList.length > 0 ? 'view_wrapper' : 'view_wrapper_prod'">
      <SysDicDetail
        ref="dicDetailRef"
        class="obj_detail"
        v-if="defaultActive === 'v'"
        :dictryId="dictryId"
        :sysId="sysId"
        :apiType="apiType"
        :apprType="apprType"
        :aplySrlNo="aplySrlNo"
        @toDicList="toDicList"
      ></SysDicDetail>

      <SysModDic
        ref="modDicRef"
        class="obj_detail"
        v-if="defaultActive === 'm'"
        :dictryId="dictryId"
        :sysId="sysId"
        :apiType="apiType"
        @toDetail="toDetail"
      ></SysModDic>

      <SysRule
        ref="ruleRef"
        class="obj_detail"
        v-if="defaultActive === 'r'"
        :dictryId="dictryId"
        :sysId="sysId"
        :pageType="pageType"
      ></SysRule>

      <SysDicExampleList
        ref="exampleListRef"
        class="obj_detail"
        v-if="defaultActive === 'e'"
        :dictryId="dictryId"
        :sysId="sysId"
      ></SysDicExampleList>
    </div>
  </div>
</template> 

<script>
import mixin from "@m/core/mixin";
import SysDicDetail from "../../dictionaryDetail";
import SysModDic from "../../modDictionary";
import SysRule from "../../rule";
import SysDicExampleList from "../../dicExampleList";
import ServiceTabs from "@m/core/components/page_tabs";
import { getSessionStorage } from "@m/utils/localStorage";
// import commonHeader from "../ApplicationHeader.vue";
export default {
  mixins: [mixin],
  components: {
    SysDicDetail,
    SysModDic,
    SysRule,
    SysDicExampleList,
    ServiceTabs,
    // commonHeader,
  },
  props: {
    dictryId: {
      type: String,
      default: () => "",
    },
    sysId: {
      type: String,
      default: () => "",
    },
    toDefaultActive: {
      type: String,
      default: () => "",
    },
    type: {
      type: String,
      default: () => "",
    },
    apiType: {
      type: String,
      default: () => "",
    },
    apprType: {
      type: String,
      default: () => "",
    },
    aplySrlNo: {
      type: String,
      default: () => "",
    },
    dicType: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      // 页签列表
      tabsList: [],
      // 默认活动页签
      defaultActive: "v",
      arsId: "",
      pageType: "",
      dataDictionProd: "",
      daoHangLan: "",
      // dictryId:""
    };
  },
  methods: {
    init() {
      console.log("类型", this.dicType);
      this.defaultActive = this.toDefaultActive || "v";
      if (this.apprType == "approved") {
        this.tabsList = [
          // { v: "预览", k: "v" },
          // { v: "枚举值", k: "t" },
          // { v: "验证规则", k: "r" },
          // { v: "示例数据", k: "e" },
        ];
      } else {
        const permissions = JSON.parse(
          JSON.parse(localStorage.getItem("__menuItemList")).value
        );
        if (permissions.indexOf("designWorkgate:dictionary:edit") > -1) {
          this.tabsList = [
            { v: "预览", k: "v" },
            // { v: "编辑", k: "m", authName: "designWorkgate:dictionary:edit" },
            { v: "编辑", k: "m" },
            // { v: "枚举值", k: "t" },
            // { v: "验证规则", k: "r" },
            { v: "示例数据", k: "e" },
          ];
          if (this.type === '3' || this.type === '4') {
            this.tabsList.pop()
          }
        } else {
          this.tabsList = [
            { v: "预览", k: "v" },
            { v: "编辑", k: "m" },
            // { v: "验证规则", k: "r" },
            { v: "示例数据", k: "e" },
          ];
          if (this.type === '3' || this.type === '4') {
            this.tabsList.pop()
          }
        }
      }
    },
    handleTabClick(e) {
      console.log(e,'-----')
      this.defaultActive = e.name;
    },
    toDetail(e) {
      if (e === '3' || e === '4') {
          this.tabsList = [
            { v: "预览", k: "v" },
            { v: "编辑", k: "m" },
          ];
      } else {
          this.tabsList = [
            { v: "预览", k: "v" },
            { v: "编辑", k: "m" },
            // { v: "验证规则", k: "r" },
            { v: "示例数据", k: "e" },
          ];
      }
      this.defaultActive = "v";
    },
    toDicList() {
      this.$emit("toDicList");
      this.daoHangLan = true;
    },
  },
  created() {
    // this.dictryId = this.$route.query.dictryId
    this.init();
    this.dataDictionProd = getSessionStorage("data_diction_p");
  },
  watch: {
    dictryId(n, o) {
      this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_dicmgmt_dic_view {
  .common_header {
    margin-bottom: 20px;
  }
  // padding: 16px;
  // display: flex;
  // position: relative;
  // height: 100%;
  .view_wrapper {
    // padding-left: 216px;
    // overflow-x: hidden;
    // width: 100%;
    // margin-top: 116px;
  }
  .view_wrapper_prod {
    // padding-left: 216px;
    // overflow-x: hidden;
    // width: 100%;
    // margin-top: 70px;
  }
  .mod_obj,
  .obj_detail {
    ::v-deep .create_content_wrapper {
      padding: 0;
    }
  }
  .bread_crumb_fixed {
    @include fixed_common;
    top: 104.5px;
    padding: 18px 0 0;
    width: 100%;
  }

  .tabs_fixed {
    @include fixed_common;
    top: 170.5px;
    padding: 18px 0 0;
    width: 100%;
  }
  .sys_view_wrapper {
    // margin-top: 116px;
  }
  .view_bread_crumb_fixed {
    @include fixed_common;
    top: 151.5px;
    padding: 18px 0 0;
    width: 100%;
  }
  .view_tabs_fixed {
    @include fixed_common;
    top: 216.5px;
    padding: 18px 0 0;
    width: 100%;
  }
}
</style>

