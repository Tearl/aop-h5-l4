<template>
  <div class="aop_tradedesign_dic_cmps_my_dic_list">
    <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <ServiceTabs
      class="content_wrapper_tabs"
      :tabsList="tabsList"
      :defaultActive="defaultActive"
      @tabClick="handleTabClick"
    ></ServiceTabs>

    <div class="content">
      <div class="dataSet" v-show="defaultActive == 'd'">
        <BaseInfo ref="baseRef" type="edit" class="baseInfo"></BaseInfo>
        <!-- <TabsContent
          class="tabsContent"
          fourDesign="edit"
          :isShow="false"
          :piecewiseTrue="true"
          :widthChange="true"
          :fieldList="fieldList"
          :piecewiseList="piecewiseList"
          :L5serviceList="L5serviceList"
          :susStnCount="susStnCount"
          :fieldCount="fieldCount"
          :servCount="servCount"
          @addType="addType"
          @detailClick="detailClick"
          @dataChange="dataChange"
          @reFresh="reFresh"
        ></TabsContent> -->
        <TabsContent
          :isShow="false"
          :piecewiseTrue="true"
          :widthChange="true"
          fourDesign="edit"
          :fieldList="fieldList"
          :piecewiseList="piecewiseList"
          :L5serviceList="L5serviceList"
          :susStnCount="susStnCount"
          :fieldCount="fieldCount"
          @fieldSearch="fieldSearch"
          @subSearch="subSearch"
          @servSearch="servSearch"
          :servCount="servCount"
          @detailClick="detailClick"
          @dataChange="dataChange"
          ref="tabsContentRef"
          @reFresh="reFresh"
          @addType="addType"
          :searchShow = "false"
        ></TabsContent>
        <PageFooter slot="footer">
          <div slot="box">
            <el-button @click="handleCancel">返 回</el-button>
            <el-button type="primary" @click="confirm">提 交</el-button>
          </div>
        </PageFooter>
      </div>
      <div class="dataSet" v-show="defaultActive == 's'">
        <ServList :dataSetNo="dataSetNo" :defaultActive="defaultActive"></ServList>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";
import ServiceTabs from "@m/core/components/page_tabs";
import BaseInfo from "./components/form/dataSetInfo";
import TabsContent from "./components/dataTabsContent";
import ServList from "./components/servList";
import { getSessionStorage, setSessionStorage } from "@m/utils/localStorage.js";
export default {
  mixins: [mixin],
  components: {
    PageHeader,
    PageFooter,
    BaseInfo,
    ServiceTabs,
    TabsContent,
    ServList,
  },
  props: {},
  computed: {},
  data() {
    return {
      breadcrumbs: [
        {
          label: "字典管理",
          operate: "list",
        },
        {
          label: "编辑数据集",
        },
      ],
      dataSetNo: "",
      tabsList: [
        { v: "数据集", k: "d" },
        { v: "L5服务", k: "s" },
      ],
      defaultActive: "d",
      piecewiseList: [],
      fieldList: [],
      L5serviceList: [],
      substnData: {},
      fieldData: {},
      susStnCount: "0",
      fieldCount: "0",
      servCount: "0",
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.dataSetNo = this.$route.query.dataSetNo;
      this.defaultActive = this.$route.query.editDatasetType || "d"
      // let dataObj = JSON.parse(getSessionStorage("dataSetInfo"));
      // if (!!dataObj) {
      //   this.$nextTick(() => {
      //     this.$refs.baseRef.dataSetForm = dataObj;
      //   });
      // } else {
      // }
      this.getDetail();

      // console.log("缓存", dataObj);
      this.getSubsList();
    },
    reFresh(e, type) {
      console.log("更新数据", e);
      if (type == "sub") {
        this.getSubsList(e);
      } else if (type == "field") {
        this.getFieldList(e);
      } else if (type == "serv") {
        this.getServList(e);
      }
    },
    handleTabClick(e) {
      this.defaultActive = e.name;
      if (this.defaultActive == "s") {
        this.tempStorage();
        console.log("存储数据");
      }
    },
    tempStorage() {
      setSessionStorage(
        "dataSetInfo",
        JSON.stringify(this.$refs.baseRef.dataSetForm)
      );
    },
    clearTemp() {
      // console.log('sssssdd')
      // setSessionStorage("dataSetInfo", null);
    },
    labelClick(e) {
      if (e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list",
        });
      }
      this.clearTemp();
    },
    async getDetail() {
      const params = {
        dataSetNo: this.dataSetNo,
      };
      const res = await this.rpc.dicmgmt.getMyDataSetDetail(params);
      // let {dataSetNm, dataSetDesc, classifyId, beltLine, ...newObj} = res
      this.$refs.baseRef.dataSetForm = res;
    },
    async getSubsList() {
      const params = {
        dataSetNo: this.dataSetNo,
        // currentPage: e,
        turnPageShowNum: "9999",
      };
      const res = await this.rpc.dicmgmt.getSubStnList(params);
      // if (e == 1 || !e) {
      //   this.piecewiseList = res.dataSubsectionList;
      //   this.susStnCount = res.turnPageTotalNum;
      // } else {
      //   let arr = res.dataSubsectionList;
      //   this.piecewiseList = this.piecewiseList.concat(arr);
      // }
      this.piecewiseList = res.dataSubsectionList;
      this.susStnCount = res.turnPageTotalNum;
      console.log("params", this.piecewiseList);
      if (!res.dataSubsectionList.length) {
        this.substnData = {};
        this.fieldList = [];
        this.fieldCount = "0"
      } else {
        Object.assign(this.substnData, res.dataSubsectionList[0] || {});
        this.$refs.tabsContentRef.piecewiseStyle = "0"
        this.getFieldList();
      }
    },
    async getFieldList() {
      const params = {
        dataSubstnNo: this.substnData.dataSubstnNo,
        // currentPage: e,
        turnPageShowNum: "9999",
      };
      const res = await this.rpc.dicmgmt.getMyFieldList(params);
      // if (e == 1 || !e) {
      //   this.fieldList = res.dataSetDataRelationList;
      //   this.fieldCount = res.turnPageTotalNum;
      // } else {
      //   let fild = res.dataSetDataRelationList;
      //   this.fieldList = this.fieldList.concat(fild);
      // }
      this.fieldList = res.dataSetDataRelationList;
      this.fieldCount = res.turnPageTotalNum;
      console.log("params", this.fieldList);
      if (!res.dataSetDataRelationList.length) {
        this.fieldData = {};
        this.L5serviceList =[];
        this.servCount = "0"
      } else {
        Object.assign(this.fieldData, res.dataSetDataRelationList[0]);
        this.$refs.tabsContentRef.fieldStyle = "0"
        this.getServList();
      }
    },
    async getServList() {
      const params = {
        dataSetDataId: this.fieldData.dataSetDataId,
        // currentPage: e,
        turnPageShowNum: "9999",
      };
      const res = await this.rpc.dicmgmt.getL5ServList(params);
      this.L5serviceList = res.l5SvcList;
      this.servCount = res.turnPageTotalNum;
      // if (e == 1 || !e) {
      //   this.L5serviceList = res.l5SvcList;
      //   this.servCount = res.turnPageTotalNum;
      // } else {
      //   let serv = res.l5SvcList;
      //   this.L5serviceList = this.L5serviceList.concat(serv);
      // }
    },
    handleCancel() {
      this.clearTemp();
      this.$nextTick(() => {
        this.$refs.baseRef.reset();
      });
      this.$router.push({
        path: "/aop_tradedesign/dicmgmt/list",
      });
    },
    confirm() {
      let data = this.$refs.baseRef.dataSetForm;
      let formRef = this.$refs.baseRef.$refs.formRef;
      formRef.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const params = {
          ...data,
        };
        const res = await this.rpc.dicmgmt.editMydataSet(params);
        this.$notify({
          title: "成功",
          message: "编辑成功",
          duration: 2000,
          type: "success",
        });
        this.handleCancel();
      });
    },
    //数据改变
    dataChange(item, index, e) {
      switch (e) {
        //分段
        case "1":
          Object.assign(this.substnData, item);
          this.getFieldList();
          console.log("当前点击", item, index, e, this.substnData);
          break;
        //字段
        case "2":
          Object.assign(this.fieldData, item);
          this.getServList();
          break;
        //服务
        case "3":
          break;
      }
    },

    //新增操作
    addType(type) {
      console.log(type, "addType", this.dataSetNo);
      switch (type) {
        case "subsection":
          this.handleSubStn("add");
          break;
        case "field":
          this.handleField("add");
          break;
        case "service":
          this.handleServ("add")
          break;
      }
    },
    //查删改操作
    detailClick(item, e, type) {
      console.log(item, e, type, "详情");
      if (e == "1") {
        // 分段
        if (type == "mod") {
          this.handleSubStn("edit", item);
        } else if (type == "read") {
          this.handleSubStn("read", item);
        } else if (type == "delete") {
          this.handleSubStn("del", item);
        }
      } else if (e == "2") {
        if (type == "mod") {
          this.handleField("edit", item);
        } else if (type == "read") {
          this.handleField("read", item);
        } else if (type == "delete") {
          this.handleField("del", item);
        }
      } else if (e == "3") {
        if (type == "mod") {
          this.handleServ("edit",item);
        } else if (type == "read") {
          this.handleServ("read", item);
        } else if (type == "add"){
          this.handleServ("add", item);
        } else if (type == "delete"){
          this.handleServ("del", item);
        }
      }
    },
    //分段操作
    handleSubStn(type, item) {
      this.tempStorage();
      if (type == "read") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/piecewiseDetail",
          query: {
            dataSubstnNo: item.dataSubstnNo,
            type: "edit",
            dataSetNo: this.dataSetNo,
          },
        });
      } else if (type == "add") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/addSubstn",
          query: {
            dataSetNo: this.dataSetNo,
            dataSetNm: this.$refs.baseRef.dataSetForm.dataSetNm,
            beltLine: this.$refs.baseRef.dataSetForm.beltLine,
            beltLineNm:this.$refs.baseRef.dataSetForm.beltLineNm,
          },
        });
      } else if (type == "edit") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editSubstn",
          query: {
            dataSubstnNo: item.dataSubstnNo,
            dataSetNo: this.dataSetNo,
            dataSetNm: this.$refs.baseRef.dataSetForm.dataSetNm,
            beltLineNm:this.$refs.baseRef.dataSetForm.beltLineNm,
            beltLine: this.$refs.baseRef.dataSetForm.beltLine,
          },
        });
      } else if (type == "del") {
        this.$confirm("是否删除该分段").then(async () => {
          const params = {
            dataSubstnNo: item.dataSubstnNo,
          };
          const res = await this.rpc.dicmgmt.delSubStn(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getSubsList();
        });
      }
    },
    //字段操作
    handleField(type, item) {
      this.tempStorage();
      if (type == "read") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/fieldDetail",
          query: {
            dataSetDataId: item.dataSetDataId,
            dataSetNo: this.dataSetNo,
            type: "editDataSet",
          },
        });
      } else if (type == "add") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/addField",
          query: {
            dataSetNo: this.dataSetNo,
            dataSetNm: this.$refs.baseRef.dataSetForm.dataSetNm,
            dataSubstnNo: this.substnData.dataSubstnNo,
            dataSubstnNm: this.substnData.dataSubstnNm,
            beltLine: this.$refs.baseRef.dataSetForm.beltLine,
            beltLineNm:this.$refs.baseRef.dataSetForm.beltLineNm,
            type: "add",
          },
        });
      } else if (type == "edit") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editField",
          query: {
            dataSetDataId: item.dataSetDataId,
            dataSetNo: this.dataSetNo,
            dataSubstnNo: this.substnData.dataSubstnNo,
            beltLine: this.$refs.baseRef.dataSetForm.beltLine,
            beltLineNm:this.$refs.baseRef.dataSetForm.beltLineNm,
            type: "edit",
          },
        });
      } else if (type == "del") {
        this.$confirm("是否删除该字段").then(async () => {
          const params = {
            dataSetDataId: item.dataSetDataId,
          };
          const res = await this.rpc.dicmgmt.delMyField(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getFieldList();
        });
      }
    },
    //服务操作
    handleServ(type, item) {
      console.log("服务", item);
      this.tempStorage();
      if (type == "read") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/L5serviceDetail",
          query: {
            apiId: item.l5SvcId,
            dataSetNo: this.dataSetNo,
            type: "editDataSet",
            editDatasetType:this.defaultActive
          },
        });
      }else if(type == "add"){
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/addServ",
          query:{
            dataSetNo: this.dataSetNo,
            dataSetNm: this.$refs.baseRef.dataSetForm.dataSetNm,
            beltLine: this.$refs.baseRef.dataSetForm.beltLine,
            editDatasetType:this.defaultActive
          }
        });
        this.tempStorage();
      }else if(type == "edit"){
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editServ",
          query: {
            apiId: item.l5SvcId,
            dataSetNo: this.dataSetNo,
            dataSetNm: this.$refs.baseRef.dataSetForm.dataSetNm,
            beltLine: this.$refs.baseRef.dataSetForm.beltLine,
            editDatasetType:this.defaultActive
          },
        });
        this.tempStorage()
      }else if (type =="del"){
        this.$confirm("是否删除该服务").then(async () => {
          const params = {
            apiId: item.l5SvcId,
            dataSetNo: this.dataSetNo,
          };
          const res = await this.rpc.dicmgmt.delL5Serv(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getServList();
        });
      }
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_cmps_my_dic_list {
  .content_wrapper_tabs {
    margin: 16px 16px 0 16px;
  }
  .content {
    margin: 16px 16px;
    // padding: 20px 24px;
    // background: $base_white;
    .baseInfo,
    .tabsContent {
      background: $base_white;
      padding: 20px 24px;
      margin-bottom: 16px;
    }
  }
}
</style>