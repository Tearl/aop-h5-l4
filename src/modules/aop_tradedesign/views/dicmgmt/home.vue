<template>
  <div class="aop_tradedesign_dic_page_my_dic">
    <SideBar
      :menuDatasetList="menuDatasetList"
      @tabChange="tabChange"
      :departmentList="mateList"
    ></SideBar>
    <!-- 数据字典 -->
    <div
      class="content"
      v-if="currentMenuObj.type == 'dictManage'"
    >
      <div class="search">
        <!-- <div class="review_tabs" v-if="active == 'unreview'">
          <el-tabs v-model="activeTabs" @tab-click="handleClick">
            <el-tab-pane
              :label="`集列表（${datasetCount || 0}）个`"
              name="dataset"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <div class="review_tabs" v-else>
          <el-tabs v-model="activeTabs" @tab-click="handleClick">
            <el-tab-pane
              :label="`集列表（${datasetCount || 0}）个`"
              name="dataset"
            ></el-tab-pane>
            <el-tab-pane
              :label="`分段列表（${subCount || 0}）个`"
              name="sub"
            ></el-tab-pane>
            <el-tab-pane
              :label="`字段列表（${fieldCount || 0}）个`"
              name="field"
            ></el-tab-pane>
            <el-tab-pane
              :label="`L5服务（${serviceCount || 0}）个`"
              name="server"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <SearchTop
          ref="formRef"
          :serviceForm="serviceForm"
          :form="form"
          v-if="showSearch && activeTabs !== 'server'"
          labelwidth="100px"
        >
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
        </SearchTop> -->
        <!-- <div v-show="activeTabs == 'dataset'">
          <DicList
            ref="dicListRef"
            :active="active"
            :activeTabs="activeTabs"
            :currentMenuObj="currentMenuObj"
            @changeSearch="changeSearch"
            @getCount="getCount"
            @getViewCount="getViewCount"
            @getTotal="getTotal"
          ></DicList>
        </div>
        <div class="sub" v-show="activeTabs == 'sub'">
          <SubList
            ref="subListRef"
            :active="active"
            @changeSearch="changeSearch"
          ></SubList>
        </div>
        <div class="field" v-show="activeTabs == 'field'">
          <FieldList
            ref="fieldListRef"
            :active="active"
            @changeSearch="changeSearch"
          ></FieldList>
        </div> -->
        <DicList
          ref="dicListRef"
          :active="active"
          :activeTabs="activeTabs"
          :currentMenuObj="currentMenuObj"
          @changeSearch="changeSearch"
          @getCount="getCount"
          @getViewCount="getViewCount"
          @getTotal="getTotal"
        ></DicList>
      </div>
    </div>
    <!-- 元数据管理 -->
    <div class="content" v-else>
      <div class="search">
        <div class="accept_tabs">
          <el-tabs v-model="activeDataTabs" @tab-click="handleAttrClick">
            <el-tab-pane :label="`所有属性`" name="allAttribute"></el-tab-pane>
            <el-tab-pane
              :label="`普通属性`"
              name="commonAttribute"
            ></el-tab-pane>
            <el-tab-pane :label="`枚举属性`" name="enumAttribute"></el-tab-pane>
            <el-tab-pane :label="`对象属性`" name="ObjAttribute"></el-tab-pane>
            <el-tab-pane :label="`列表属性`" name="listAttribute"></el-tab-pane>
            <el-tab-pane
              :label="`自定义属性`"
              name="defineAttribute"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <!-- 所有属性 -->
        <div v-if="activeDataTabs == 'allAttribute'">
          <AllAttr
            flag="list"
            ref="dictionaryListRef"
            :beltLine="departmentCode"
            :businessDomainLists="mateList"
          ></AllAttr>
        </div>
        <!-- 普通属性 -->
        <div v-if="activeDataTabs == 'commonAttribute'">
          <CommonAttr
            flag="list"
            ref="commonAttrRef"
            :beltLine="departmentCode"
          ></CommonAttr>
        </div>
        <!-- 对象属性 -->
        <div v-if="activeDataTabs == 'ObjAttribute'">
          <ObjectAttr
            flag="list"
            ref="objAttributeRef"
            :beltLine="departmentCode"
          ></ObjectAttr>
        </div>
        <!-- 枚举属性 -->
        <div v-if="activeDataTabs == 'enumAttribute'">
          <EnumAttr
            ref="enumAttrRef"
            flag="list"
            :beltLine="departmentCode"
          ></EnumAttr>
        </div>
        <!-- 列表属性 -->
        <div v-if="activeDataTabs == 'listAttribute'">
          <ListAttr
            ref="listAttrRef"
            flag="list"
            :beltLine="departmentCode"
          ></ListAttr>
        </div>
        <!-- 自定义属性 -->
        <div v-if="activeDataTabs == 'defineAttribute'">
          <DefineAttr
            ref="defineAttrRef"
            flag="list"
            :beltLine="departmentCode"
          ></DefineAttr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import SearchTop from "@m/core/components/page_search_top";
import SideBar from "./components/sideBar";
import DicList from "./components/my_dic_list";
import SubList from "./components/sub_list";
import FieldList from "./components/field_list";
import AllAttr from "./components/pub_dic"; //所有属性
import CommonAttr from "./components/common_attr"; //普通属性
import ObjectAttr from "./components/object_attr"; //对象属性
import EnumAttr from "./components/enum_attr"; //枚举属性
import DefineAttr from "./components/define_attr"; //自定义属性
import ListAttr from "./components/list_attr"; //列表属性
import ServiceTabs from "@m/core/components/page_tabs";
import ServiceL5 from './components/serviceL5.vue'
import { setSessionStorage, getSessionStorage } from "@m/utils/localStorage";
export default {
  mixins: [mixin],
  components: {
    SideBar,
    SearchTop,
    DicList,
    SubList,
    FieldList,
    ServiceTabs,
    AllAttr,
    CommonAttr,
    EnumAttr,
    DefineAttr,
    ObjectAttr,
    ListAttr,
    ServiceL5,
  },
  data() {
    return {
      menuDatasetList: [
        {
          id: "1",
          dataLabel: "我的字典",
          number: "0",
          type: "all",
        },
        {
          id: "2",
          dataLabel: "设计中",
          number: "0",
          type: "design",
        },
        {
          id: "3",
          dataLabel: "待评审",
          number: "0",
          type: "unreview",
        },
        {
          id: "4",
          dataLabel: "已登记",
          number: "0",
          type: "unaccept",
        },
      ],
      // 页签列表
      tabsList: [
        { v: "所有属性", k: "allAttribute" },
        { v: "普通属性", k: "commonAttribute" },
        { v: "枚举属性", k: "enumAttribute" },
        { v: "对象属性", k: "ObjAttribute" },
        { v: "列表属性", k: "listAttribute" },
        { v: "自定义属性", k: "designAttribute" },
      ],
      activeDataTabs: "allAttribute",
      // 搜索条件
      form: {
        content: "",
        preciseQuery: "0",
        beltLine: "",
        classifyId: "",
        status: "",
      },
      active: "all", // all-我的字典 01-草稿箱 02-评审箱 03-登记箱
      activeTabs: "dataset", //  unaccept-待登记 accepted-已登记 unreview-待评审 review-已评审
      showSearch: true,
      checkedCount: "0",
      noCheckedCount: "0",
      noRegisterCount: "0",
      datasetCount: "0",
      subCount: "0",
      fieldCount: "0",
      registerCount: "0",
      departmentList: [],
      serviceForm: [
        {
          type: "inputIcon",
          model: "content",
          placeholder: "输入业务对象名称",
          labelText: "业务对象名称:",
        },
        // {
        //   type: "switch",
        //   model: "preciseQuery",
        //   label: "精确查询",
        //   activeValue: "1",
        //   inactiveValue: "0",
        //   style: {
        //     width: "260px",
        //   },
        // },
        {
          type: "select",
          model: "beltLine",
          placeholder: "请选择",
          labelText: "所属域:",
          select: [],
        },
        {
          type: "select",
          model: "classifyId",
          placeholder: "请选择",
          labelText: "分类:",
          select: [
            { value: "", type: "全部" },
            { value: "1", type: "用户" },
            { value: "2", type: "机构" },
            { value: "3", type: "渠道" },
            { value: "4", type: "产品" },
            { value: "5", type: "合约" },
            { value: "6", type: "系统" },
          ],
        },
      ],
      flag: false,
      statusObj: {
        all: "",
        design: "0",
        unreview: "3",
        unaccept: "2",
      },
      desiStusCd: [],
      departmentCode: "",
      mateList: [],
      tempActive: "",
      typeObj: {
        dataset: "业务对象名称",
        sub: "分段名称",
        field: "字段名称",
      },
      serviceCount: 0,
      currentMenuObj: {
        type: "dictManage",
      },
    };
  },
  methods: {
    async init() {
      this.tempActive = getSessionStorage("activeIndex") || "all";
      this.active = this.tempActive;
      this.departmentCode = getSessionStorage("beltLine") || "";
      this.desiStusCd = JSON.parse(getSessionStorage("desiStusCd")) || [];
      this.activeTabs =this.tempActive =="unreview" ? "dataset":getSessionStorage("tabDataset") || "dataset";
      this.activeDataTabs = getSessionStorage("tabMate") || "allAttribute";
      this.currentMenuObj = JSON.parse(getSessionStorage("currentMenuObj")) || { type: "dictManage" };
      // this.getCount();
      Promise.all([
        this.rpc.downloadDesign.queryBizDomainList(),
        this.rpc.dicmgmt.queryObjCountByBizDomainNo(),
      ]).then(([bizDomainData, bizDomainCountData]) => {
        this.mateList = bizDomainData.businessDomainLists;
        const countList = bizDomainCountData.countList
        this.departmentList = bizDomainData.businessDomainLists.map(item => {
          item.value = item.bizDomainNo
          item.type = item.bizDomainName
          item.num = countList.find(countItem => countItem.code == item.bizDomainNo)?.num || 0
          return item
        })
      })
      this.tabChange(this.currentMenuObj);
      // this.queryBizDomainList();
      // if (this.active == "all") {
      //   this.serviceForm = [
      //     {
      //       type: "inputIcon",
      //       model: "content",
      //       placeholder: "输入业务对象名称",
      //       labelText: "业务对象名称:",
      //     },
      //     // {
      //     //   type: "switch",
      //     //   model: "preciseQuery",
      //     //   label: "精确查询",
      //     //   activeValue: "1",
      //     //   inactiveValue: "0",
      //     //   style: {
      //     //     width: "260px",
      //     //   },
      //     // },
      //     {
      //       type: "select",
      //       model: "beltLine",
      //       placeholder: "请选择",
      //       labelText: "所属域:",
      //       select: [],
      //     },
      //     {
      //       type: "select",
      //       model: "classifyId",
      //       placeholder: "请选择",
      //       labelText: "分类:",
      //       select: [
      //         { value: "", type: "全部" },
      //         { value: "1", type: "用户" },
      //         { value: "2", type: "机构" },
      //         { value: "3", type: "渠道" },
      //         { value: "4", type: "产品" },
      //         { value: "5", type: "合约" },
      //         { value: "6", type: "系统" },
      //       ],
      //     },
      //     {
      //       type: "select",
      //       model: "status",
      //       placeholder: "请选择",
      //       labelText: "状态:",
      //       select: [
      //         { value: "", type: "全部" },
      //         { value: "0", type: "设计中" },
      //         { value: "01", type: "待评审" },
      //         // { value: "02", type: "评审驳回" },
      //         // { value: "03", type: "待登记" },
      //         { value: "20", type: "已登记" },
      //       ],
      //     },
      //   ];
      //   this.$refs.dicListRef?.getDicList();
      // } else {
      //   this.serviceForm = [
      //     {
      //       type: "inputIcon",
      //       model: "content",
      //       placeholder: "输入业务对象名称",
      //       labelText: "业务对象名称:",
      //     },
      //     // {
      //     //   type: "switch",
      //     //   model: "preciseQuery",
      //     //   label: "精确查询",
      //     //   activeValue: "1",
      //     //   inactiveValue: "0",
      //     //   style: {
      //     //     width: "260px",
      //     //   },
      //     // },
      //     {
      //       type: "select",
      //       model: "beltLine",
      //       placeholder: "请选择",
      //       labelText: "所属域:",
      //       select: [],
      //     },
      //     {
      //       type: "select",
      //       model: "classifyId",
      //       placeholder: "请选择",
      //       labelText: "分类:",
      //       select: [
      //         { value: "", type: "全部" },
      //         { value: "1", type: "用户" },
      //         { value: "2", type: "机构" },
      //         { value: "3", type: "渠道" },
      //         { value: "4", type: "产品" },
      //         { value: "5", type: "合约" },
      //         { value: "6", type: "系统" },
      //       ],
      //     },
      //   ];
      // }
    },
    async queryBizDomainList() {
      const res = await this.rpc.downloadDesign.queryBizDomainList();
      if (res.businessDomainLists.length > 0) {
        res.businessDomainLists.map((item) => {
          this.departmentList.push({
            value: item.bizDomainNo,
            type: item.bizDomainName,
          });
        });
        this.serviceForm[1].select = this.departmentList;
        this.mateList = res.businessDomainLists;
        // console.log(this.serviceForm, this.departmentList, "123");
      }
    },
    //获取字典状态总数
    async getCount() {
      let params = {
        dataSetType: "2",
      };
      const res = await this.rpc.dicmgmt.getDataSetCountStatcd(params);
      this.menuDatasetList[0].number = res.totalNum;
      this.menuDatasetList[1].number = res.designNum;
      this.menuDatasetList[2].number = res.reviewNum;
      this.menuDatasetList[3].number = res.registerNum;
    },
    //获取集列表、字段列表、分段列表总数
    async getDictCount() {
      let params = {
        dataSetType: "2",
        desiStusCdList: this.desiStusCd,
      };
      const res = await this.rpc.dicmgmt.getDictCount(params);
      const { dataSetNum, subSecNum, dictNum } = res;
      this.datasetCount = dataSetNum;
      this.subCount = subSecNum;
      this.fieldCount = dictNum;
    },
    changeSearch() {
      this.showSearch = !this.showSearch;
    },
    search() {
      if (this.activeTabs == "dataset") {
        this.$refs.dicListRef.form = this.form;
        this.$refs.dicListRef.resetPage();
        this.$nextTick(() => {});
        this.$refs.dicListRef.getDicList();
      } else if (this.activeTabs == "sub") {
        this.$refs.subListRef.form = this.form;
        this.$refs.subListRef.resetPage();
        this.$refs.subListRef.getDicList();
      } else if (this.activeTabs == "field") {
        this.$refs.fieldListRef.form = this.form;
        this.$refs.fieldListRef.resetPage();
        this.$refs.fieldListRef.getDicList();
      }
    },
    reset() {
      // this.$refs.dicListRef.page = "1";
      this.$refs.formRef.resetFields();
    },
    getTotal(data, e) {
      if (e == "01") {
        this.noCheckedCount = data;
      } else if (e == "02") {
        this.checkedCount = data;
      } else if (e == "03") {
        this.noRegisterCount = data;
      } else if (e == "20") {
        this.registerCount = data;
      }
    },
    getViewCount(e) {
      console.log("getViewCount", e, this.active);
      this.getCount();
      this.getDictCount();
    },
    tabChange(e) {
      console.log("tabChange", e, this.active);
      this.currentMenuObj = e || {};
      this.active = e?.type || "";
      if (!e) {
        this.active = this.tempActive || "all";
        this.$nextTick(() => {
          this.$refs.dicListRef?.getDicList();
        });
        this.serviceForm = [
          {
            type: "inputIcon",
            model: "content",
            placeholder: "输入业务对象名称",
            labelText: "业务对象名称:",
          },
          // {
          //   type: "switch",
          //   model: "preciseQuery",
          //   label: "精确查询",
          //   activeValue: "1",
          //   inactiveValue: "0",
          //   style: {
          //     width: "260px",
          //   },
          // },
          {
            type: "select",
            model: "beltLine",
            placeholder: "请选择",
            labelText: "所属域:",
            select: [],
          },
          {
            type: "select",
            model: "classifyId",
            placeholder: "请选择",
            labelText: "分类:",
            select: [
              { value: "", type: "全部" },
              { value: "1", type: "用户" },
              { value: "2", type: "机构" },
              { value: "3", type: "渠道" },
              { value: "4", type: "产品" },
              { value: "5", type: "合约" },
              { value: "6", type: "系统" },
            ],
          },
          {
            type: "select",
            model: "status",
            placeholder: "请选择",
            labelText: "状态:",
            select: [
              { value: "", type: "全部" },
              { value: "0", type: "设计中" },
              { value: "01", type: "待评审" },
              // { value: "02", type: "评审驳回" },
              // { value: "03", type: "待登记" },
              { value: "20", type: "已登记" },
            ],
          },
        ];
        if (this.active !== "mateData") {
          // this.activeTabs = "dataset"
          this.getDatasetList(this.activeTabs)
          // if (this.activeTabs == "dataset") {
          //   this.$nextTick(() => {
          //     this.$refs.dicListRef.getDicList();
          //   });
          // } else if (this.activeTabs == "sub") {
          //   this.$nextTick(() => {
          //     this.$refs.subListRef.getDicList();
          //   });
          // } else if (this.activeTabs == "field") {
          //   this.$nextTick(() => {
          //     this.$refs.fieldListRef.getDicList();
          //   });
          // }
        } else {
          // this.activeDataTabs = "allAttribute"
          this.getMateList(this.activeDataTabs);
        }
      } else {
        // if (["all", "design", "unreview", "unaccept"].includes(e.type)) {
        if (this.currentMenuObj?.type == 'dictManage') {
          console.log("tabChange-字典管理", this.currentMenuObj)
          // this.showSearch = true;
          // let statusTemp = this.statusObj[e.type];
          // if(e.type == "unreview") this.activeTabs = "dataset"
          // if (statusTemp == "2") {
          //   this.desiStusCd = ["1", "2"];
          // } else {
          //   this.desiStusCd = [...statusTemp];
          // }
          // this.$refs.formRef?.resetFields();
          // this.getDictCount();
          // console.log(statusTemp, this.desiStusCd, "statusTemp");
          // this.getDatasetList(this.activeTabs)
          // this.activeDataTabs = "allAttribute"
          // sessionStorage.removeItem("tabMate")
          // this.$nextTick(() => {
          //   this.setSearchName(this.active, this.typeObj[this.activeTabs]);
          // });
          setSessionStorage("sideBarIndex", e.id);
          setSessionStorage("desiStusCd", JSON.stringify(this.desiStusCd));
          setSessionStorage("activeIndex", this.active);
          setSessionStorage("currentMenuObj", JSON.stringify(this.currentMenuObj));
          this.$nextTick(() => {
            this.$refs.dicListRef.init();
          })
        } else {
          console.log("tabChange-元数据管理", this.currentMenuObj)
          this.departmentCode = e.bizDomainNo;
          setSessionStorage("beltLine", this.departmentCode);
          setSessionStorage("sideBarIndex", e.bizDomainCode);
          setSessionStorage("activeIndex", "mateData");
          setSessionStorage("currentMenuObj", JSON.stringify(this.currentMenuObj));
          this.getMateList(this.activeDataTabs);
          this.activeTabs = "dataset"
          sessionStorage.removeItem("tabDataset")
          // if (this.activeDataTabs == "allAttribute") {
          //   this.$nextTick(() => {
          //     this.$refs.dictionaryListRef.getList();
          //   });
          // } else if (this.activeDataTabs == "commonAttribute") {
          //   this.$nextTick(() => {
          //     this.$refs.commonAttrRef.getList();
          //   });
          // } else if (this.activeDataTabs == "ObjAttribute") {
          //   this.$nextTick(() => {
          //     this.$refs.objAttributeRef.getList();
          //   });
          // } else if (this.activeDataTabs == "enumAttribute") {
          //   this.$nextTick(() => {
          //     this.$refs.enumAttrRef.getList();
          //   });
          // } else if (this.activeDataTabs == "listAttribute") {
          //   this.$nextTick(() => {
          //     this.$refs.listAttrRef.getList();
          //   });
          // } else if (this.activeDataTabs == "defineAttribute") {
          //   this.$nextTick(() => {
          //     this.$refs.defineAttrRef.getList();
          //   });
          // }
        }
        if (this.active == "all") {
          this.serviceForm = [
            {
              type: "inputIcon",
              model: "content",
              placeholder: "输入业务对象名称",
              labelText: "业务对象名称:",
            },
            // {
            //   type: "switch",
            //   model: "preciseQuery",
            //   label: "精确查询",
            //   activeValue: "1",
            //   inactiveValue: "0",
            //   style: {
            //     width: "260px",
            //   },
            // },
            {
              type: "select",
              model: "beltLine",
              placeholder: "请选择",
              labelText: "所属域:",
              select: [],
            },
            {
              type: "select",
              model: "classifyId",
              placeholder: "请选择",
              labelText: "分类:",
              select: [
                { value: "", type: "全部" },
                { value: "1", type: "用户" },
                { value: "2", type: "机构" },
                { value: "3", type: "渠道" },
                { value: "4", type: "产品" },
                { value: "5", type: "合约" },
                { value: "6", type: "系统" },
              ],
            },
            {
              type: "select",
              model: "status",
              placeholder: "请选择",
              labelText: "状态:",
              select: [
                { value: "", type: "全部" },
                { value: "0", type: "设计中" },
                { value: "01", type: "待评审" },
                // { value: "02", type: "评审驳回" },
                // { value: "03", type: "待登记" },
                { value: "20", type: "已登记" },
              ],
            },
          ];
          this.serviceForm[1].select = this.departmentList;
        } else {
          this.serviceForm = [
            {
              type: "inputIcon",
              model: "content",
              placeholder: "输入业务对象名称",
              labelText: "业务对象名称:",
            },
            // {
            //   type: "switch",
            //   model: "preciseQuery",
            //   label: "精确查询",
            //   activeValue: "1",
            //   inactiveValue: "0",
            //   style: {
            //     width: "260px",
            //   },
            // },
            {
              type: "select",
              model: "beltLine",
              placeholder: "请选择",
              labelText: "所属域:",
              select: [],
            },
            {
              type: "select",
              model: "classifyId",
              placeholder: "请选择",
              labelText: "分类:",
              select: [
                { value: "", type: "全部" },
                { value: "1", type: "用户" },
                { value: "2", type: "机构" },
                { value: "3", type: "渠道" },
                { value: "4", type: "产品" },
                { value: "5", type: "合约" },
                { value: "6", type: "系统" },
              ],
            },
          ];
          this.serviceForm[1].select = this.departmentList;
        }
      }
    },
    handleClick(e) {
      if (this.activeTabs === 'server') {
        this.showSearch = false
      } else {
        this.showSearch = true
        this.$nextTick(() => {
          this.$refs?.formRef.resetFields();
        })
      }
      
      // if (e.name == "dataset") {
      //   this.showSearch = true;
      //   this.$nextTick(() => {
      //     this.$refs.dicListRef.getDicList();
      //   });
      // } else if (e.name == "sub") {
      //   this.$refs.subListRef.getDicList();
      //   // this.showSearch = false;
      // } else if (e.name == "field") {
      //   this.$refs.fieldListRef.getDicList();
      //   // this.showSearch = false;
      // }
      this.setSearchName(this.active, this.typeObj[this.activeTabs]);
      this.getDatasetList(e.name)
      setSessionStorage("tabDataset", this.activeTabs);
    },
    //所有属性、普通属性、对象属性、枚举属性、列表属性、自定义属性
    //allAttribute、commonAttribute、ObjAttribute、enumAttribute、listAttribute、defineAttribute
    handleAttrClick(e) {
      this.getMateList(e.name)
      // if (e.name == "allAttribute") {
      //   this.$nextTick(() => {
      //     this.$refs.dictionaryListRef.getList();
      //   });
      // } else if (e.name == "commonAttribute") {
      //   this.$nextTick(() => {
      //     this.$refs.commonAttrRef.getList();
      //   });
      // } else if (e.name == "ObjAttribute") {
      //   this.$nextTick(() => {
      //     this.$refs.objAttributeRef.getList();
      //   });
      // } else if (e.name == "enumAttribute") {
      //   this.$nextTick(() => {
      //     this.$refs.enumAttrRef.getList();
      //   });
      // } else if (e.name == "listAttribute") {
      //   this.$nextTick(() => {
      //     this.$refs.listAttrRef.getList();
      //   });
      // } else if (e.name == "defineAttribute") {
      //   this.$nextTick(() => {
      //     this.$refs.defineAttrRef.getList();
      //   });
      // }
      setSessionStorage("tabMate", this.activeDataTabs);
    },
    setSearchName(typeMenu, typeName) {
      if (typeMenu == "all") {
        if (typeName == "业务对象名称") {
          this.serviceForm = [
            {
              type: "inputIcon",
              model: "content",
              placeholder: `请输入${typeName}`,
              labelText: `${typeName}:`,
            },
            {
              type: "select",
              model: "beltLine",
              placeholder: "请选择",
              labelText: "所属域:",
              select: [],
            },
            {
              type: "select",
              model: "classifyId",
              placeholder: "请选择",
              labelText: "分类:",
              select: [
                { value: "", type: "全部" },
                { value: "1", type: "用户" },
                { value: "2", type: "机构" },
                { value: "3", type: "渠道" },
                { value: "4", type: "产品" },
                { value: "5", type: "合约" },
                { value: "6", type: "系统" },
              ],
            },
            {
              type: "select",
              model: "status",
              placeholder: "请选择",
              labelText: "状态:",
              select: [
                { value: "", type: "全部" },
                { value: "0", type: "设计中" },
                { value: "01", type: "待评审" },
                { value: "20", type: "已登记" },
              ],
            },
          ];
        } else {
          this.serviceForm = [
            {
              type: "inputIcon",
              model: "content",
              placeholder: `请输入${typeName}`,
              labelText: `${typeName}:`,
            },
            {
              type: "select",
              model: "beltLine",
              placeholder: "请选择",
              labelText: "所属域:",
              select: [],
            },
            {
              type: "select",
              model: "classifyId",
              placeholder: "请选择",
              labelText: "分类:",
              select: [
                { value: "", type: "全部" },
                { value: "1", type: "用户" },
                { value: "2", type: "机构" },
                { value: "3", type: "渠道" },
                { value: "4", type: "产品" },
                { value: "5", type: "合约" },
                { value: "6", type: "系统" },
              ],
            },
            {
              type: "select",
              model: "status",
              placeholder: "请选择",
              labelText: "状态:",
              select: [
                { value: "", type: "全部" },
                { value: "0", type: "新增" },
                { value: "20", type: "已登记" },
              ],
            },
          ];
        }
      } else {
        this.serviceForm = [
          {
            type: "inputIcon",
            model: "content",
            placeholder: `请输入${typeName}`,
            labelText: `${typeName}:`,
          },
          {
            type: "select",
            model: "beltLine",
            placeholder: "请选择",
            labelText: "所属域:",
            select: [],
          },
          {
            type: "select",
            model: "classifyId",
            placeholder: "请选择",
            labelText: "分类:",
            select: [
              { value: "", type: "全部" },
              { value: "1", type: "用户" },
              { value: "2", type: "机构" },
              { value: "3", type: "渠道" },
              { value: "4", type: "产品" },
              { value: "5", type: "合约" },
              { value: "6", type: "系统" },
            ],
          },
        ];
      }
      this.serviceForm[1].select = this.departmentList;
      this.$forceUpdate();
    },
    getMateList(activeDataTabs) {
      if (activeDataTabs == "allAttribute") {
        this.$nextTick(() => {
          this.$refs.dictionaryListRef.resetPage();
          this.$refs.dictionaryListRef.getList();
        });
      } else if (activeDataTabs == "commonAttribute") {
        this.$nextTick(() => {
          this.$refs.commonAttrRef.resetPage();
          this.$refs.commonAttrRef.getList();
        });
      } else if (activeDataTabs == "ObjAttribute") {
        this.$nextTick(() => {
          this.$refs.objAttributeRef.resetPage();
          this.$refs.objAttributeRef.getList();
        });
      } else if (activeDataTabs == "enumAttribute") {
        this.$nextTick(() => {
          this.$refs.enumAttrRef.resetPage();
          this.$refs.enumAttrRef.getList();
        });
      } else if (activeDataTabs == "listAttribute") {
        this.$nextTick(() => {
          this.$refs.listAttrRef.resetPage();
          this.$refs.listAttrRef.getList();
        });
      } else if (activeDataTabs == "defineAttribute") {
        this.$nextTick(() => {
          this.$refs.defineAttrRef.resetPage();
          this.$refs.defineAttrRef.getList();
        });
      }
    },
    getDatasetList(activeTabs) {
      if (activeTabs == "dataset") {
        this.$nextTick(() => {
          this.$refs.dicListRef.resetPage();
          this.$refs.dicListRef.getDicList();
        });
      } else if (activeTabs == "sub") {
        this.$nextTick(() => {
          this.$refs.subListRef.resetPage();
          this.$refs.subListRef.getDicList();
        });
      } else if (activeTabs == "field") {
        this.$nextTick(() => {
          this.$refs.fieldListRef.resetPage();
          this.$refs.fieldListRef.getDicList();
        });
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.aop_tradedesign_dic_page_my_dic {
  display: flex;
  .content {
    margin: 16px 16px 0 0;
    width: calc(100% - 200px);
    /deep/ .serivce_top_left {
      width: 100%;
    }
  }
  .accept_tabs,
  .review_tabs {
    background: #ffffff;
    margin-bottom: 12px;
    padding: 0 24px;
    /deep/ .el-tabs__nav-wrap {
      margin: 0;
      line-height: 40px;
    }
    /deep/ .el-tabs__header {
      margin: 0;
    }
    /deep/ .el-tabs__nav-wrap::after {
      height: 0px;
      background-color: none;
    }
    /deep/ .el-tabs__item {
      height: 56px;
      line-height: 56px;
    }
  }
  ::v-deep
    .aop_tradedesign_comps_page_service_top
    .el-form
    .el-form-item
    .el-input {
    width: 160px;
  }
  // ::v-deep .el-form-item__label {
  //   width: 86px !important;
  // }
}
</style>
