<template>
  <div class="aop_tradedesign_comps_dicmgmt_sys_dic">
    <DicSidebar ref="dicSidebar" v-if="pageType !== 'sys'" class="dic_sidebar" :pageType="pageType" :bkId="bkId" @toGetList="toGetList" :sysId="arsId" @toDicView="toDicView" @dicAdd="toAddDic"></DicSidebar>
    <div :class="pageType !== 'sys' ? 'service_content' : ''" v-if="flag == 'list'">
      <ServiceTop ref="formRef" :serviceForm="serviceForm" :form="form">
        <div slot="rightButton">
          <el-button
            type="primary"
            size="small"
            @click="search"
            class="right_button"
            >搜索</el-button
          >
          <el-button size="small" @click="reset" class="right_button"
            >重置</el-button
          >
        </div>
      </ServiceTop>
      <div class="content_bottom">
        <DictionaryList
          ref="serviceList"
          :searchForm="searchRecord"
          :begins="begins"
          :bkId="bkId"
          @getMenuList="getMenuList"
          :sysId="arsId"
          :pageType="pageType"
          @toDicDetail="toDicDetail"
          @toAddDic="toAddDic"
          @toModDic="toModDic"
          @toRule="toRule"
          @toExampleList="toExampleList"
        >
        </DictionaryList>
      </div>
    </div>
    <div :class="pageType !== 'sys' ? 'service_content' : ''" v-if="flag == 'view'">
      <DicView :apiType="'sys'" :dicType="dicType" :dictryId="dictryId" :sysId="arsId" @toDicList="toDicList"></DicView>
    </div>
    <div :class="pageType !== 'sys' ? 'service_content' : ''" v-if="flag == 'add'">
      <AddDic class="add_dic" :apiType="'sys'" :sysId="arsId" @toDicList="toDicList" @getMenuList="getMenuList"></AddDic>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import DictionaryList from "./components/dic_list"; // 列表
import ServiceTop from "@m/core/components/page_search_top"; //
import PageHeader from "@m/core/components/page_header";
import DicSidebar from "../dic_sidebar";
import DicView from "../dic_view";
import AddDic from "../../addDictionary";

export default {
  mixins: [mixin],
  components: {
    DictionaryList,
    ServiceTop,
    PageHeader,
    DicSidebar,
    DicView,
    AddDic
  },
  props: {
    arsId: {
      type: String,
      default: () => "",
    },
    bkId: {
      type: String,
      default: () => "",
    },
    pageType: {
      type: String,
      default: () => ""
    },
    begins: {
      type: String,
      default: () => ""
    },
    dicType: {
      type: String,
      default: () => ""
    },
  },
  data() {
    return {
      flag: "list",
      // 导航栏参数
      breadcrumbs: [
        {
          label: "工作台",
          operate: "list",
        },
        {
          label: "数据字典",
        },
      ],
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "content",
          placeholder: "搜索参数名称、中文名、英文名或描述",
          style: {
            width: "300px",
          },
        },
        {
          type: "switch",
          model: "preciseQuery",
          label: "精确查询",
          activeValue: "1",
          inactiveValue: "0",
          style: {
            width: "260px",
          },
        },
        {
          type: "input",
          model: "dictryKeyWord",
          placeholder: "搜索关键字",
          style: {
            width: "127px",
          },
        },
        {
          type: "select",
          model: "paraType",
          placeholder: "参数类型",
          select: [
            { type: "String", value: "String" },
            { type: "File", value: "File" },
            { type: "List", value: "List" },
            { type: "boolean", value: "boolean" },
            { type: "char", value: "char" },
            { type: "int", value: "int" },
            { type: "byte", value: "byte" },
            { type: "short", value: "short" },
            { type: "long", value: "long" },
            { type: "float", value: "float" },
            { type: "double", value: "double" },
            { type: "Boolean", value: "Boolean" },
            { type: "Character", value: "Character" },
            { type: "Integer", value: "Integer" },
            { type: "Byte", value: "Byte" },
            { type: "Short", value: "Short" },
            { type: "Long", value: "Long" },
            { type: "Float", value: "Float" },
            { type: "Double", value: "Double" },
            { type: "BigDecimal", value: "BigDecimal" },
            { type: "Object", value: "Object" },
            { type: "Date", value: "Date" },
          ],
        },
      ],
      // 搜索信息表单
      form: {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        dictryKeyWord: "", // 关键字
        paraType: "", // 类型
        paraGateg: "", // 所属分类
      },
      // 搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        content: "", // 编号或名称或描述
        preciseQuery: "0", // 精准查询  1精准，0或不填模糊
        dictryKeyWord: "", // 关键字
        paraType: "", // 类型
        paraGateg: "", // 所属分类
      },
      dictryId: "",
    };
  },
  methods: {
    toDicDetail(e) {
      this.flag = "view"
      this.dictryId = e
      // this.$emit("toDicDetail",e)
      this.$emit("tabsShow",false)
    },
    getMenuList(){
      if(this.pageType !=="sys"){
        this.$refs.dicSidebar.getList()
      }else{
        this.$emit("getMenuList")
      }
    },
    toAddDic() {
      if(!this.arsId) return this.$message.error("请先选择应用")
      this.flag = "add"
      this.$emit("tabsShow",false)
    },
    toModDic(e) {
      this.$emit("toModDic",e)
    },
    toRule(e,o) {
      this.$emit("toRule",e,o)
    },
    toExampleList(e) {
      this.$emit("toExampleList",e)
    },
    toDicList() {
      this.flag = "list"
      this.$emit("tabsShow",true)
      this.$emit("getList")
    },
    // 点击搜索按钮
    search() {
      Object.assign(this.searchRecord, this.form);
      this.$nextTick(() => {
        this.$refs.serviceList.pager.currentPage = "1";
        this.$refs.serviceList.getList();
      })
    },
    // 点击重置按钮
    reset() {
      this.$refs.formRef.resetFields();
    },
    // 导航栏点击
    labelClick(e) {
      if (e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/workbench/home",
        });
      }
    },
    toGetList(e) {
      this.flag = "list";
      this.$emit("tabsShow",true)
    },
    toDicView(e) {
      this.dictryId = e
      this.flag = "view";
      this.$emit("tabsShow",false)
    },
    //初始化
    init() {
      this.search()
      this.$nextTick(()=> {
        this.$refs.dicSidebar.getList()
      })
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_sys_dic {
  // position: relative;
  min-height: 100%;
  .service_content {
    padding-left: 316px;
    // padding: 20px 24px;
  }
  .dic_sidebar {
    // padding: 0;
    margin-top:47px;
    left: 216px;
  }
  .content_bottom {
    background: $base_white;
    padding: 0 24px 24px;
  }
  .add_dic ::v-deep .create_content_wrapper  {
    padding: 0;
  }
}
</style>


