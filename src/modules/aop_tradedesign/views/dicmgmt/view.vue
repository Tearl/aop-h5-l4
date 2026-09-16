<template>
  <div>
    <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
  <div class="aop_tradedesign_page_dicmgmt_view">
    <SysSidebar
      :name="detailInfo.arsName"
      :iconCurrent="iconCurrent"
      @toCurrent="toCurrent"
    ></SysSidebar>
    <div class="view_wrapper">
      <SysInfo
        :arsId="arsId"
        :detailInfo="detailInfo"
        v-if="iconCurrent === 'info'"
      ></SysInfo>

      <SysObejct
        :arsId="arsId"
        :detailInfo="detailInfo"
        :url="url"
        :type="type"
        v-if="iconCurrent === 'business'"
        @confirmUrl="getServiceSysDetail"
        @toAddObj="toAddObj"
        @toModObj="toModObj"
        @toObjDetail="toObjDetail"
      ></SysObejct>

      <AddObj
        v-if="iconCurrent === 'addObj'"
        :sysId="arsId"
        @toBusinessList="toBusinessList"
      ></AddObj>

      <ModObj
        ref="modObjRef"
        class="mod_obj"
        v-if="iconCurrent === 'modObj'"
        :bsnObjId="bsnObjId"
        :sysId="arsId"
        @toBusinessList="toBusinessList"
      ></ModObj>

      <ObjDetail
        ref="objDetailRef"
        class="obj_detail"
        v-if="iconCurrent === 'objDetail'"
        :bsnObjId="bsnObjId"
        :sysId="arsId"
        @toBusinessList="toBusinessList"
      ></ObjDetail>

      <SysDic 
        dicType="sysView"
        :arsId="arsId" 
        v-if="iconCurrent === 'dictionary'"
        @toDicDetail="toDicDetail"
        @toAddDic="toAddDic"
        @toModDic="toModDic"
        @toRule="toRule"
        @toExampleList="toExampleList"
      ></SysDic>

      <SysDicDetail
        ref="dicDetailRef"
        class="obj_detail"
        v-if="iconCurrent === 'dicDetail'"
        :dictryId="dictryId"
        :sysId="arsId"
        dicType="sysView"
        @toDicList="toDicList"
      ></SysDicDetail>

      <SysAddDic
        ref="addDicRef"
        class="obj_detail"
        v-if="iconCurrent === 'addDic'"
        :dictryId="dictryId"
        :sysId="arsId"
        apiType="sys"
        @toDicList="toDicList"
      ></SysAddDic>

      <SysModDic
        ref="modDicRef"
        class="obj_detail"
        v-if="iconCurrent === 'modDic'"
        :dictryId="dictryId"
        :sysId="arsId"
        apiType="sys"
        @toDicList="toDicList"
      ></SysModDic>

      <SysRule
        ref="ruleRef"
        class="obj_detail"
        v-if="iconCurrent === 'rule'"
        :dictryId="dictryId"
        :sysId="arsId"
        :pageType="pageType"
        @toDicList="toDicList"
      ></SysRule>
      
      <SysDicExampleList
        ref="exampleListRef"
        class="obj_detail"
        v-if="iconCurrent === 'exampleList'"
        :dictryId="dictryId"
        :sysId="arsId"
        @toDicList="toDicList"
      ></SysDicExampleList>

      <SysHeader :arsId="arsId" v-if="iconCurrent === 'setting'"></SysHeader>

      <SysTerm :arsId="arsId" v-if="iconCurrent === 'definition'"></SysTerm>

      <ApiGroup :arsId="arsId" :bkId="bkId" :serviceType="serviceType" :type="type" v-if="iconCurrent === 'group'"></ApiGroup>

      <TypeMgmt :arsId="arsId" v-if="iconCurrent === 'type'"></TypeMgmt>

      <DomainList :arsId="arsId" v-if="iconCurrent === 'domainList'" @toDomainDetail="toDomainDetail" @toDomainEdit="toDomainEdit" @toDomainAdd="toDomainAdd"></DomainList>

      <DomainApiList :arsId="arsId" :domainId="domainId" v-if="iconCurrent === 'domainDetail'" @toDomainList="toDomainList"></DomainApiList>

      <DomainEdit :arsId="arsId" :domainId="domainId" :pageType="domainType" v-if="iconCurrent === 'domainEdit'" @toDomainList="toDomainList"></DomainEdit>

      <R5List ref="R5ListRef" v-if="iconCurrent === 'R5List'" :arsId="arsId" ></R5List>

      <DataList ref="dataListRef" v-if="iconCurrent === 'dataList'" :arsId="arsId" ></DataList>
    </div>
  </div>
  </div>
</template> 

<script>
import mixin from "@m/core/mixin";
import SysSidebar from "./components/sys_sidebar";
import SysInfo from "./components/sys_info";
import SysObejct from "./components/sys_object";
import AddObj from "./addObj";
import ModObj from "./modObj";
import ObjDetail from "./objDetail";
import SysDic from "./components/sys_dic";
import SysDicDetail from "./dictionaryDetail";
import SysAddDic from "./addDictionary";
import SysModDic from "./modDictionary";
import SysRule from "./rule";
import SysDicExampleList from "./dicExampleList";
import SysTerm from "./components/sys_term";
import SysHeader from "./components/sys_header";
import ApiGroup from "./components/api_group";
import TypeMgmt from "./components/type_mgmt";
import DomainList from "./components/sys_domain/list";
import DomainApiList from "./components/sys_domain/domain_api";
import DomainEdit from "./components/sys_domain/edit";

import R5List from "./components/sys_r5List";
import DataList from "./components/sys_dataList";
import { getSessionStorage } from "@m/utils/localStorage";
import PageHeader from "@m/core/components/page_header";
export default {
  mixins: [mixin],
  components: {
    SysSidebar,
    SysInfo,
    SysObejct,
    SysDic,
    SysHeader,
    SysTerm,
    ApiGroup,
    AddObj,
    ModObj,
    ObjDetail,
    TypeMgmt,
    SysDicDetail,
    SysAddDic,
    SysModDic,
    SysRule,
    SysDicExampleList,
    DomainList,
    DomainApiList,
    DomainEdit,
    R5List,
    DataList,
    PageHeader,
  },

  data() {
    return {
      detailInfo: {},
      arsId: "",
      iconCurrent: "",
      url: "",
      bkId: "",
      bsnObjId: "",
      serviceType: "",
      dictryId: "",
      pageType: "",
      type: "",
      domainType: "",
      // 导航栏参数
      breadcrumbs: [
        {
          label: "服务应用",
          operate: "list",
        },
        {
          label: "服务应用详情",
        },
      ],
    };
  },
  methods: {
    // 导航栏点击
    labelClick(e) {
      if (e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/bankmgmt/serviceSysList",
        });
      }
    },
    init() {
      this.arsId = this.$route.query.sysId;
      this.iconCurrent = this.$route.query.iconCurrent;
      this.type = this.$route.query.type || ""
      this.serviceType = getSessionStorage("workgate-servType") || "";
      this.getServiceSysDetail();
    },
    toAddObj() {
      this.iconCurrent = "addObj"
    },
    toModObj(e) {
      this.bsnObjId = e
      this.iconCurrent = "modObj"
      this.$nextTick(() => {
        this.$refs.modObjRef.getDetail()
      })
    },
    toObjDetail(e) {
      this.bsnObjId = e
      this.iconCurrent = "objDetail"
      this.$nextTick(() => {
        this.$refs.objDetailRef.getDetail()
      })
    },
    toBusinessList() {
      this.iconCurrent = "business"
    },
    
    // 数据字典
    toDicList() {
      this.iconCurrent = "dictionary"
    },
    toDicDetail(e) {
      this.dictryId = e
      this.iconCurrent = "dicDetail"
      this.$nextTick(() => {
        this.$refs.dicDetailRef.getDictionaryInfoById()
      })
    },
    toAddDic() {
      this.iconCurrent = "addDic"
    },
    toModDic(e) {
      this.dictryId = e
      this.iconCurrent = "modDic"
      this.$nextTick(() => {
        this.$refs.modDicRef.getDetail()
      })
    },
    toRule(e,o) {
      this.dictryId = e
      this.pageType = o
      this.iconCurrent = "rule"
      this.$nextTick(() => {
        this.$refs.ruleRef.getList()
        this.$refs.ruleRef.getBtnState()
      })
    },
    toExampleList(e) {
      this.dictryId = e
      this.iconCurrent = "exampleList"
      this.$nextTick(() => {
        this.$refs.exampleListRef.getList()
      })
    },
    // 领域
    toDomainDetail(e) {
      this.domainId = e
      this.iconCurrent = "domainDetail";
    },
    toDomainEdit(e) {
      this.domainType = "edit"
      this.domainId = e
      this.iconCurrent = "domainEdit";
    },
    toDomainAdd() {
      this.domainId = ""
      this.domainType = "create"
      this.iconCurrent = "domainEdit";
    },
    toDomainList() {
      this.iconCurrent = "domainList";
    },
    //查询详情  
    async getServiceSysDetail() {
      const params = {
        arsId: this.arsId,
      };
      const res = await this.rpc.public.getServiceSysDetail(params);
      this.detailInfo = res;
      this.url = res.arsBsnObjUrl;
      this.bkId = res.bkId;
    },
    toCurrent(e) {
      this.iconCurrent = e;
      if(e == "R5List") {
        this.$nextTick(() => {
          this.$refs.R5ListRef.flag = "0"
        })
      }else if(e == "info"){
        this.getServiceSysDetail()
      }
    },
  },
  created() {
    this.init();
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_dicmgmt_view {
  padding: 16px;
  display: flex;
  height: 100%;
  .view_wrapper {
    padding-left: 216px;
    overflow-x: hidden;
    width: 100%;
  }
  .mod_obj,
  .obj_detail {
    ::v-deep .create_content_wrapper {
      padding: 0;
    }
  }
}
// .header_page_view{
//   margin-left: -15px;
//   margin-top: -15px;
// }
</style>

