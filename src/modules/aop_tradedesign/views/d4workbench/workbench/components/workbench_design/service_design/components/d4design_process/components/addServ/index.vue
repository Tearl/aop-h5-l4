<template>
  <div class="aop_service_dic_page_my_dic">
    <SideBar :statusList="statusList" @tabChange="tabChange"></SideBar>
    <div class="content">
      <div class="search">
        <SearchTop
          ref="formRef"
          :serviceForm="serviceForm"
          :form="form"
          v-if="showSearch"
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
        </SearchTop>
        <!-- 评审箱 -->
        <div class="review_tabs" v-if="active == '01' || active == '02'">
          <el-tabs v-model="activeTabs" @tab-click="handleClick">
            <el-tab-pane
              :label="`待评审（${noCheckedCount || 0}）`"
              name="unreview"
            ></el-tab-pane>
            <el-tab-pane
              :label="`已评审（${checkedCount || 0}）`"
              name="review"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <!-- 登记箱 -->
        <div class="accept_tabs" v-if="active == '03' || active == '20'">
          <el-tabs v-model="activeTabs" @tab-click="handleClick">
            <el-tab-pane
              :label="`待登记（${count || 0}）`"
              name="unaccept"
            ></el-tab-pane>
            <el-tab-pane
              :label="`已登记（${count || 0}）`"
              name="accepted"
            ></el-tab-pane>
          </el-tabs>
        </div>

        <TabsContent
          ref="tabsContentRef"
          class="card_style"
          fourDesign="edit"
          :isShow="true"
          :widthChange="false"
          :serviceTrue="true"
          :fieldList="fieldList"
          :piecewiseList="piecewiseList"
          :L5serviceList="L5serviceList"
          :dataList="dataList"
          :susStnCount="susStnCount"
          :fieldCount="fieldCount"
          :servCount="servCount"
          :datasetCount="datasetCount"
          @detailClick="detailClick"
          @dataChange="dataChange"
          @checkChange="checkChange"
          @reFresh="reFresh"
          @addType="addType"
        ></TabsContent>
      </div>
      <AddDataset
        ref="addDatasetRef"
        @confirmComplete="confirmDataset"
        :type="type"
        :dataInfo="dataObj"
        @addType="addType"
      ></AddDataset>
      <EditDataset
        ref="editDatasetRef"
        @confirmComplete="confirmDataset"
        :type="type"
        :dataInfo="dataObj"
        @addType="addType"
        @detailClick="detailDataClick"
      ></EditDataset>
      <DataDetail ref="dataDetailRef" @detailClick="detailDataClick"></DataDetail>
      <AddField
        ref="addFieldRef"
        @confirmComplete="confirmField"
        :datasetInfo="dataObj"
        :subInfo="substnObj"
      ></AddField>
      <EditField
        ref="editFieldRef"
        @confirmComplete="confirmField"
        type="edit"
        :datasetInfo="dataObj"
        :subInfo="substnObj"
      ></EditField>
      <SubDetail ref="subDetailRef" @detailClick="detailDataClick"></SubDetail>
      <AddSub
        ref="addSubRef"
        :infoData="dataObj"
        @confirmComplete="confirmSub"
      ></AddSub>
      <EditSub
        ref="editSubRef"
        :infoData="dataObj"
        @confirmComplete="confirmSub"
      ></EditSub>
      <FieldDetail ref="fieldDetailRef"></FieldDetail>
      <AddServ
        ref="addServRef"
        :infoData="dataObj"
        @confirmComplete="confirmServ"
      ></AddServ>
      <editServ
        ref="editServRef"
        :infoData="dataObj"
        @confirmComplete="confirmServ"
        :editFlag="true"
      ></editServ>
      <L5Detail ref="l5DetailRef"></L5Detail>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import SearchTop from "@m/core/components/page_search_top";
import SideBar from "./components/sideBar";
import TabsContent from "./components/tabsContent";
import AddDataset from "../add_dialog/addDataset";
import AddField from "../add_dialog/addField";
import AddSub from "../add_dialog/addSub";
import AddServ from "../add_dialog/addServ";
import EditDataset from "../add_dialog/editDataset";
import EditField from "../add_dialog/editField";
import EditSub from "../add_dialog/editSub";
import EditServ from "../add_dialog/editServ";
import DataDetail from "../add_dialog/dataDetail";
import SubDetail from "../add_dialog/subDetail";
import FieldDetail from "../add_dialog/fieldDetail";
import L5Detail from "../add_dialog/L5serviceDetail";
export default {
  mixins: [mixin],
  components: {
    SideBar,
    SearchTop,
    TabsContent,
    AddDataset,
    AddField,
    AddSub,
    AddServ,
    EditDataset,
    EditField,
    EditSub,
    EditServ,
    DataDetail,
    SubDetail,
    FieldDetail,
    L5Detail
  },
  computed: {
    serviceForm() {
      console.log("数据集关键字", this.active);
      if (this.active == "all") {
        return [
          {
            type: "input",
            model: "content",
            placeholder:
              "输入 数据集关键字 or 分段关键字 or 字段关键字 or 服务关键字 or 交易关键字",
            labelText: "关键字:",
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
            type: "select",
            model: "beltLine",
            placeholder: "请选择",
            labelText: "所属部:",
            select: [
              { value: "0", type: "对公业务" },
              { value: "1", type: "对私业务" },
              { value: "2", type: "营销业务" },
            ],
          },
          {
            type: "select",
            model: "classifyId",
            placeholder: "请选择",
            labelText: "所属册:",
            select: [
              { value: "", type: "全部" },
              { value: "1", type: "C1 用户册" },
              { value: "2", type: "P1 机构册" },
              { value: "3", type: "C2 渠道册" },
              { value: "4", type: "P2 产品册" },
              { value: "5", type: "C3 合约册" },
              { value: "6", type: "S 系统册" },
            ],
          },
          {
            type: "select",
            model: "status",
            placeholder: "请选择",
            labelText: "状态:",
            select: [
              { value: "all", type: "全部" },
              { value: "00", type: "设计中" },
              { value: "01", type: "待评审" },
              { value: "02", type: "评审驳回" },
              { value: "03", type: "待登记" },
              { value: "20", type: "已登记" },
            ],
          },
        ];
      } else {
        return [
          {
            type: "input",
            model: "content",
            placeholder:
              "输入 数据集关键字 or 分段关键字 or 字段关键字 or 服务关键字 or 交易关键字",
            labelText: "关键字:",
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
            type: "select",
            model: "beltLine",
            placeholder: "请选择",
            labelText: "所属部:",
            select: [
              { value: "0", type: "对公业务" },
              { value: "1", type: "对私业务" },
              { value: "2", type: "营销业务" },
            ],
          },
          {
            type: "select",
            model: "classifyId",
            placeholder: "请选择",
            labelText: "所属册:",
            select: [
              { value: "all", type: "全部" },
              { value: "C1", type: "C1 用户册" },
              { value: "P1", type: "P1 机构册" },
              { value: "C2", type: "C2 渠道册" },
              { value: "P2", type: "P2 产品册" },
              { value: "C3", type: "C3 合约册" },
              { value: "S", type: "S 系统册" },
            ],
          },
        ];
      }
    },
  },
  data() {
    return {
      statusList: [
        //  设计状态：00-设计中、01-待评审、02-评审驳回、03-待登记、20-已登记
        {
          statusName: "我的字典",
          statusNumber: "0",
          status: "all",
          type: "all",
          id: "0",
        },
        {
          statusName: "草稿箱",
          statusNumber: "0",
          status: "00",
          type: "draft",
          id: "1",
        },
      ],
      // 搜索条件
      form: {
        content: "",
        preciseQuery: "",
        beltLine: "",
        classifyId: "",
        status: "",
      },
      active: "all", // all-我的字典 01-草稿箱 02-评审箱 03-登记箱
      activeTabs: null, //  unaccept-待登记 accepted-已登记 unreview-待评审 review-已评审
      showSearch: true,
      count: "0",
      checkedCount: "0",
      noCheckedCount: "0",
      fieldList: [],
      piecewiseList: [],
      L5serviceList: [],
      dataList: [],
      susStnCount: "0",
      fieldCount: "0",
      servCount: "0",
      datasetCount: "0",
      dataObj: {},
      substnObj: {},
      fieldObj: {},
    };
  },
  methods: {
    init() {
      this.getCount();
      this.tabChange();
    },
    async getCount() {
      const res = await this.rpc.dicmgmtDefine.getDataSetCount();
      this.statusList[0].statusNumber = res.totalNum;
      this.statusList[1].statusNumber = res.designNum;
      // this.statusList[2].statusNumber = res.reviewNum;
      // this.statusList[3].statusNumber = res.registerNum;
    },
    changeSearch() {
      this.showSearch = !this.showSearch;
    },
    search() {
      this.$refs.dicListRef.form = this.form;
      this.$refs.dicListRef.getDicList();
    },
    reset() {
      this.$refs.formRef.resetFields();
    },
    tabChange(e) {
      console.log("e", e);
      if (!e) {
        this.active = "all";
      } else {
        //当前点击页签判断
        this.active = e.status;
        this.activeTabs = e.type;
        // if (e.status == "02") {
        //   this.activeTabs = "unaccept";
        // } else if (e.status == "03") {
        //   this.activeTabs = "unreview";
        // }
      }
      this.$nextTick(() => {
        this.getDatasetList();
      });
      // this.$nextTick(() => {
      //   this.$refs.dicListRef.getDicList();
      //   // this.count = this.$refs.dicListRef.total
      // });
    },
    handleClick(e) {
      console.log("切换");
      switch (e.name) {
        case "unaccept":
          this.activeTabs = "unaccept";
          this.active = "03";
          break;
        case "accepted":
          this.activeTabs = "accepted";
          this.active = "20";
          break;
        case "unreview":
          this.activeTabs = "unreview";
          this.active = "01";
          break;
        case "review":
          this.activeTabs = "review";
          this.active = "02";
          break;
        default:
          break;
      }
    },
    async getDatasetList() {
      let status =
        this.form.status == "all" || !this.form.status
          ? []
          : [this.form.status];
      let queryParams = {
        ...this.form,
        desiStusCdList: this.active == "all" ? status : [this.active],
        currentPage: "1",
        turnPageShowNum: "99",
      };
      const res = await this.rpc.dicmgmtDefine.getMyDicList(queryParams);
      console.log("getDatasetList", res);
      this.dataList = res.dataSetList;
      this.datasetCount = res.turnPageTotalNum;
      if (!res.dataSetList.length) {
        this.dataObj = {};
      } else {
        Object.assign(this.dataObj, res.dataSetList[0] || {});
        this.getSubsList();
      }
    },
    async getSubsList() {
      const params = {
        dataSetNo: this.dataObj.dataSetNo,
        currentPage: "1",
        turnPageShowNum: "99",
      };
      const res = await this.rpc.dicmgmtDefine.getSubStnList(params);
      this.piecewiseList = [];
      this.piecewiseList = res.dataSubsectionList;
      this.susStnCount = res.turnPageTotalNum;
      this.$refs.tabsContentRef.piecewiseStyle = "0";
      if (!res.dataSubsectionList.length) {
        this.substnObj = {};
      } else {
        Object.assign(this.substnObj, res.dataSubsectionList[0] || {});
        this.getFieldList();
      }
    },
    async getFieldList() {
      const params = {
        dataSubstnNo: this.substnObj.dataSubstnNo,
        currentPage: "1",
        turnPageShowNum: "99",
      };
      const res = await this.rpc.dicmgmtDefine.getMyFieldList(params);
      this.fieldList = [];
      this.fieldList = res.dataSetDataRelationList;
      this.fieldCount = res.turnPageTotalNum;
      this.$refs.tabsContentRef.fieldStyle = "0";
      if (!res.dataSetDataRelationList.length) {
        this.fieldObj = {};
      } else {
        Object.assign(this.fieldObj, res.dataSetDataRelationList[0] || {});
        this.getServList();
      }
    },
    async getServList() {
      const params = {
        dataSetDataId: this.fieldObj.dataSetDataId,
        currentPage: "1",
        turnPageShowNum: "99",
      };
      const res = await this.rpc.dicmgmtDefine.getL5ServList(params);
      this.L5serviceList = [];
      this.L5serviceList = res.l5SvcList;
      this.servCount = res.turnPageTotalNum;
    },
    detailClick(item, e, type) {
      console.log(item, e, type, "详情");
      if (e == "0" && type == "read") {
        this.$nextTick(() =>{
          this.$refs.dataDetailRef.showDialog(item)
        })
      } else if (e == "0" && type == "mod") {
        // Object.assign(this.dataObj, item);
        this.$nextTick(() =>{
          this.$refs.editDatasetRef.showDialog("editData",item);
        })
        console.log("数据编辑");
      } else if (e == "0" && type == "delete") {
        this.delOp("dataset",item);
        console.log("数据删除");
      } else if (e == "1" && type == "mod") {
        this.$nextTick(() =>{
          this.$refs.editSubRef.showDialog(item);
        })
        console.log("分段编辑");
      } else if (e == "1" && type == "delete") {
        this.delOp("sub",item);
        console.log("分段删除");
      } else if (e == "1" && type == "read") {
        this.$nextTick(() =>{
          this.$refs.subDetailRef.showDialog(item);
        })
        console.log("分段详情");
      } else if (e == "2" && type == "mod") {
        this.$nextTick(() =>{
          this.$refs.editFieldRef.showFiledDialog(item);
        })
        console.log("字段编辑");
      } else if (e == "2" && type == "delete") {
        this.delOp("field",item);
        console.log("字段删除");
      } else if (e == "2" && type == "read") {
        this.$nextTick(() =>{
          this.$refs.fieldDetailRef.showDialog(item)
        })
        console.log("字段详情");
      } else if (e == "3" && type == "mod") {
        this.$nextTick(() =>{
          this.$refs.editServRef.showDialog("editData",item);
        })
        console.log("L5服务编辑");
      } else if (e == "3" && type == "delete") {
        this.delOp("L5Serv",item);
        console.log("L5服务删除");
      } else if (e == "3" && type == "read") {
        this.$nextTick(() =>{
          this.$refs.l5DetailRef.showDialog(item);
        })
        console.log("L5服务详情");
      }
    },
    dataChange(item, index, e) {
      console.log("当前点击", item, index, e);
      switch (e) {
        case "0":
          Object.assign(this.dataObj, item);
          this.fieldList = [];
          this.L5serviceList = [];
          this.piecewiseList = [];
          this.getSubsList();
          this.$refs.tabsContentRef.dataStyle = index;
          break;
        case "1":
          Object.assign(this.substnObj, item);
          this.fieldList = [];
          this.L5serviceList = [];
          this.getFieldList();
          this.$refs.tabsContentRef.piecewiseStyle = index;
          break;
        case "2":
          Object.assign(this.fieldObj, item);
          this.L5serviceList = [];
          this.getServList();
          this.$refs.tabsContentRef.fieldStyle = index;
          break;
        case "3":
          this.$refs.tabsContentRef.L5serviceStyle = index;
          break;
      }
    },
    addType(type) {
      console.log("添加", type);
      this.type = "detail";
      switch (type) {
        case "dataSet":
          this.$refs.addDatasetRef.showDialog(type);
          break;
        case "subsection":
          this.$nextTick(() => {
            this.$refs.addSubRef.showDialog();
          });
          break;
        case "field":
          this.$nextTick(() => {
            this.$refs.addFieldRef.showFiledDialog();
          });
          break;
        case "service":
          this.$nextTick(() => {
            this.$refs.addServRef.showDialog(type);
            console.log("服务添加");
          });
          break;
      }
    },
    confirmDataset() {
      this.getDatasetList();
    },
    confirmSub() {
      this.getSubsList();
    },
    confirmField() {
      this.getFieldList();
    },
    confirmServ() {
      this.getServList();
    },
    delOp(type, data) {
      if (type == "dataset") {
        this.$confirm("是否删除该数据集").then(async () => {
          const params = {
            dataSetNo: data.dataSetNo,
          };
          const res = await this.rpc.dicmgmtDefine.delMydataSet(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getDatasetList();
        });
      } else if (type == "sub") {
        this.$confirm("是否删除该分段").then(async () => {
          const params = {
            dataSubstnNo: data.dataSubstnNo,
          };
          const res = await this.rpc.dicmgmtDefine.delSubStn(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getSubsList();
        });
      } else if (type == "field") {
        this.$confirm("是否删除该字段").then(async () => {
          const params = {
            dataSetDataId: data.dataSetDataId,
          };
          const res = await this.rpc.dicmgmtDefine.delMyField(params);
          this.$notify({
            title: "成功",
            message: "删除成功",
            duration: 2000,
            type: "success",
          });
          this.getFieldList();
        });
      } else if (type == "L5Serv") {
        this.$confirm("是否删除该服务").then(async () => {
          const params = {
            apiId: data.l5SvcId,
            dataSetNo:data.dataSetNo
          };
          const res = await this.rpc.dicmgmtDefine.delL5Serv(params);
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
    detailDataClick(data,type){
      if(type == "1"){
        console.log("1",data);
        this.$nextTick(() =>{
          this.$refs.subDetailRef.showDialog(data);
        })
      }else if (type == "2"){
        this.$nextTick(() =>{
          this.$refs.fieldDetailRef.showDialog(data)
        })
        console.log("2",data)
      }else if(type =="3"){
        this.$nextTick(() =>{
          this.$refs.l5DetailRef.showDialog(data);
        })
        console.log("3",data)
      }
    }
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.aop_service_dic_page_my_dic {
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
}
</style>
