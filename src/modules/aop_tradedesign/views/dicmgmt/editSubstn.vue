<template>
  <div class="aop_tradedesign_dic_cmps_my_dic_list">
    <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <div class="content">
      <BaseInfo ref="baseRef" type="edit" :infoData="infoData"></BaseInfo>
      <!-- <TabsContent
        class="tabsContent"
        fourDesign="edit"
        :isShow="false"
        :piecewiseTrue="false"
        :widthChange="true"
        :fieldList="fieldList"
        :L5serviceList="L5serviceList"
        :fieldCount="fieldCount"
        :servCount="servCount"
        @addType="addType"
        @detailClick="detailClick"
        @dataChange="dataChange"
        @reFresh="reFresh"
      ></TabsContent> -->
      <TabsContent
        class="tabsContent"
        fourDesign="edit"
        :isShow="false"
        :piecewiseTrue="false"
        :widthChange="true"
        :fieldList="fieldList"
        :L5serviceList="L5serviceList"
        :fieldCount="fieldCount"
        :servCount="servCount"
        @addType="addType"
        @detailClick="detailClick"
        @dataChange="dataChange"
        @reFresh="reFresh"
        :searchShow ="false"
      ></TabsContent>
      <PageFooter slot="footer">
        <div slot="box">
          <el-button @click="handleCancel">返 回</el-button>
          <el-button type="primary" @click="confirm">提 交</el-button>
        </div>
      </PageFooter>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";
import BaseInfo from "./components/form/subStnInfo";
import TabsContent from "./components/dataTabsContent";
import { getSessionStorage, setSessionStorage } from "@m/utils/localStorage.js";
export default {
  mixins: [mixin],
  components: {
    PageHeader,
    PageFooter,
    BaseInfo,
    TabsContent,
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
          operate: "dataSet",
        },
        {
          label: "编辑分段",
        },
      ],
      dataSubstnNo: "",
      dataSetNo: "",
      dataSetNm: "",
      fieldList: [],
      L5serviceList: [],
      fieldData: {},
      fieldCount: "0",
      servCount: "0",
      infoData:{},
      beltLine:"",
      beltLineNm:""
    };
  },
  created() {
    this.init();
  },
  destroyed(){
    // sessionStorage.removeItem("dataSetInfo")
  },
  mounted() {},
  methods: {
    init() {
      this.dataSubstnNo = this.$route.query.dataSubstnNo;
      this.dataSetNo = this.$route.query.dataSetNo;
      this.dataSetNm = this.$route.query.dataSetNm;
      this.infoData.beltLineNm = this.$route.query.beltLineNm;
      this.beltLineNm = this.$route.query.beltLineNm;
      this.beltLine = this.$route.query.beltLine;
      let dataObj = JSON.parse(getSessionStorage("subStnInfo"));
      if (!!dataObj) {
        this.$nextTick(() => {
          this.$refs.baseRef.subForm = dataObj;
        });
      } else {
        this.getDetail();
      }
      this.getFieldList();
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
    async getFieldList(e) {
      const params = {
        dataSubstnNo: this.dataSubstnNo,
        currentPage: e ? e : "1",
        turnPageShowNum: "10",
      };
      const res = await this.rpc.dicmgmt.getMyFieldList(params);
      if (e == 1 || !e) {
        this.fieldList = res.dataSetDataRelationList;
        this.fieldCount = res.turnPageTotalNum;
      } else {
        let fild = res.dataSetDataRelationList;
        this.fieldList = this.fieldList.concat(fild);
      }
      console.log("params", this.fieldList);
      if (!res.dataSetDataRelationList.length) {
        this.fieldData = {};
      } else {
        Object.assign(this.fieldData, res.dataSetDataRelationList[0]);
        this.getServList();
      }
    },
    async getServList(e) {
      const params = {
        dataSetDataId: this.fieldData.dataSetDataId,
        currentPage: e,
        turnPageShowNum: "10",
      };
      const res = await this.rpc.dicmgmt.getL5ServList(params);
      if (e == 1 || !e) {
        this.L5serviceList = res.l5SvcList;
        this.servCount = res.turnPageTotalNum;
      } else {
        let serv = res.l5SvcList;
        this.L5serviceList = this.L5serviceList.concat(serv);
      }
    },
    labelClick(e) {
      if (e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list",
        });
      } else if (e == "dataSet") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editDataSet",
          query: {
            dataSetNo: this.dataSetNo,
          },
        });
      }
      setSessionStorage("subStnInfo", null);
    },
    handleCancel() {
      setSessionStorage("subStnInfo", null);
      this.$nextTick(() => {
        this.$refs.baseRef.reset();
      });
      this.$router.push({
        path: "/aop_tradedesign/dicmgmt/editDataSet",
        query: {
          dataSetNo: this.dataSetNo,
        },
      });
    },
    async getDetail() {
      const params = {
        dataSubstnNo: this.dataSubstnNo,
      };
      const res = await this.rpc.dicmgmt.getSubStnDetail(params);
      this.$refs.baseRef.subForm = res;
    },
    confirm() {
      let formRef = this.$refs.baseRef.$refs.formRef;
      let data = this.$refs.baseRef.subForm;
      formRef.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        const params = {
          ...data,
          blgDataSetNo: this.dataSetNo,
          dataSubstnDesc:data.subDesc
        };
        console.log("确定", data, params);
        const res = await this.rpc.dicmgmt.editSubStn(params);
        this.$notify({
          title: "成功",
          message: "修改成功",
          duration: 2000,
          type: "success",
        });
        this.handleCancel();
      });
    },
    //数据改变
    dataChange(item, index, e) {
      switch (e) {
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
        if (type == "read") {
          this.handleServ("read", item);
        }else if (type =="mod"){
          this.handleServ("edit",item);
        }else if (type == "add"){
          this.handleServ("add", item);
        }else if (type =="delete"){
          this.handleServ("del", item);
        }
      }
    },
    //字段操作
    handleField(type, item) {
      setSessionStorage(
        "subStnInfo",
        JSON.stringify(this.$refs.baseRef.subForm)
      );
      if (type == "read") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/fieldDetail",
          query: {
            dataSetDataId: item.dataSetDataId,
            dataSetNo: this.dataSetNo,
            dataSubstnNo: this.dataSubstnNo,
            type: "editSub",
          },
        });
      } else if (type == "add") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/addField",
          query: {
            dataSetNo: this.dataSetNo,
            dataSetNm: this.dataSetNm,
            dataSubstnNo: this.dataSubstnNo,
            dataSubstnNm: this.$refs.baseRef.subForm.dataSubstnNm,
            beltLine:this.beltLine,
            beltLineNm:this.beltLineNm,
            type: "addSubstn",
          },
        });
      } else if (type == "edit") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editField",
          query: {
            dataSetDataId: item.dataSetDataId,
            dataSetNo: this.dataSetNo,
            dataSubstnNo: this.dataSubstnNo,
            beltLine:this.beltLine,
            beltLineNm:this.beltLineNm,
            type: "editSubstn",
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
      setSessionStorage(
        "subStnInfo",
        JSON.stringify(this.$refs.baseRef.subForm)
      );
      if (type == "read") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/L5serviceDetail",
          query: {
            apiId: item.l5SvcId,
            dataSetNo: this.dataSetNo,
            dataSubstnNo: this.dataSubstnNo,
            type: "editSub",
          },
        });
      }else if(type =="add"){
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/addServ",
          query: {
            dataSetNo: this.dataSetNo,
            dataSubstnNo: this.dataSubstnNo,
            dataSetNm: this.dataSetNm,
            beltLine:this.beltLine,
          },
        });
      }else if(type == "edit"){
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editServ",
          query: {
            apiId: item.l5SvcId,
            dataSetNo: this.dataSetNo,
            beltLine:this.beltLine,
          },
        });
      }else if(type == "del"){
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
  .content {
    margin: 16px;
    padding: 20px 24px;
    background: $base_white;
  }
}
</style>