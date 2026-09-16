<template>
  <div class="aop_tradedesign_dic_page_dataDetail">
    <!-- <PageHeader
      v-if="!isDialog"
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader> -->
    <!-- <common-header label="产品查看" /> -->
    <div class="detail_info">
      <div class="top_info">
        <h1>基本信息</h1>
        <div class="content_box">
          <!-- <div class="flex_content"> -->
            <div class="content">
              <span class="label">数据集名称：</span
              ><span class="label_value">{{ detailObj.dataSetNm }}</span>
            </div>
            <div class="content">
              <span class="label">所属域：</span
              ><span class="label_value">{{ detailObj.beltLineNm || detailObj.beltLine | newBeltLineType }}</span>
            </div>
            <div class="content">
              <span class="label">分类：</span
              ><span class="label_value">{{ detailObj.classifyId |classifyIdSt }}</span>
            </div>
          <!-- </div> -->
          <!-- <div class="right_box">
            <div class="content">
              <span class="label">名称：</span
              ><span class="label_value">{{ detailObj.dataSetNm }}</span>
            </div>
            <div class="content">
              <span class="label">所属册：</span
              ><span class="label_value">{{ detailObj.dataSetCgyDesc }}</span>
            </div>
          </div>
          <div class="left_box">
            <div class="content">
              <span class="label">所属部：</span
              ><span class="label_value">{{ detailObj.beltLine |beltLineType }}</span>
            </div>
          </div> -->
        </div>
      </div>
      <div class="bottom_box">
        <div class="bottom_content">
          <span class="label">数据集描述：</span
          ><span class="label_value">{{ detailObj.dataSetDesc }}</span>
        </div>
      </div>
    </div>
    <div class="detail_info" v-if="isEdit">
      <TabsContent
        :isShow="false"
        :piecewiseTrue="true"
        :widthChange="true"
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
      ></TabsContent>
    </div>
    <div class="detail_info" v-else>
      <TabsContent
        :isShow="false"
        :piecewiseTrue="true"
        :widthChange="true"
        :fieldList="fieldList"
        :piecewiseList="piecewiseList"
        :L5serviceList="L5serviceList"
        :susStnCount="susStnCount"
        :fieldCount="fieldCount"
        :servCount="servCount"
        @detailClick="detailClick"
        @dataChange="dataChange"
        fourDesign="edit"
        @addType="add"
        ref="tabsContentRef"
        @reFresh="reFresh"
      ></TabsContent>
    </div>
    <!-- <div class="btn_info" v-if="!isDialog">
      <div class="btn" style="">
        <el-button @click="labelClick('list')">返回</el-button>
      </div>
    </div> -->
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import TabsContent from "./components/tabsContent.vue";
import PageHeader from "@m/core/components/page_header";
export default {
  mixins: [mixin],
  components: {
    TabsContent,
    PageHeader,
  },
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: true,
    },
    currentD4bObj: {
      type: Object,
      default: () => ({}),
    },
    currentDatasetObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      moduleInfos: {},
      appNo: "", //应用编号
      appVerNo: "", //应用版本号
      fieldList: [],
      piecewiseList: [],
      L5serviceList: [],
      breadcrumbs: [
        {
          label: "字典管理",
          operate: "list",
        },
        {
          label: "数据集详情",
        },
      ],
      list: [],
      detailObj: {},
      dataSetNo: "",
      fieldData: {},
      substnData: {},
      susStnCount: "0",
      fieldCount: "0",
      servCount: "0",
    };
  },
  created() {},
  mounted() {
    // this.init();
  },
  computed: {},
  methods: {
    init() {
      this.dataSetNo = this.$route.query.dataSetNo;
      this.getDetail();
      // await this.getSubsList();
      console.log(this.currentD4bObj, "数据集详情");
    },
    reFresh(e, type) {
       if (type == "field") {
        this.getFieldList(e);
      } else if (type == "serv") {
        this.getServList(e);
      }
    },
    async getDetail() {
      if(!this.currentD4bObj?.dataSetNo) return
      const params = {
        dataSetNo: this.dataSetNo || this.currentD4bObj.dataSetNo,
      };
      const res = await this.rpc.dicmgmtDefine.getMyDataSetDetail(params);
      this.detailObj = res || {};
      this.getSubsList();
    },
    async getSubsList(data) {
      // if(this.currentD4bObj?.dataSetNo || this.detailObj?.dataSetNo) return 
      const params = {
        dataSetNo:this.detailObj.dataSetNo,
        turnPageShowNum: "9999",
        content:data || ""
      };
      const res = await this.rpc.dicmgmtDefine.getSubStnList(params);
      // if(e == 1 || !e){
      //   this.piecewiseList = res.dataSubsectionList;
      //   this.susStnCount = res.turnPageTotalNum;
      // }else{
      //   let arr = res.dataSubsectionList;
      //   this.piecewiseList = this.piecewiseList.concat(arr);
      // }
      this.piecewiseList = res.dataSubsectionList;
      this.susStnCount = res.turnPageTotalNum;
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
    async getFieldList(data) {
      const params = {
        dataSubstnNo: this.substnData.dataSubstnNo,
        // currentPage: e,
        turnPageShowNum: "9999",
        preciseQuery:"0",
        content:data || ""

      };
      const res = await this.rpc.dicmgmtDefine.getMyFieldList(params);
      // if(e == 1 || !e){
      //   this.fieldList = res.dataSetDataRelationList;
      //   this.fieldCount = res.turnPageTotalNum;
      // }else{
      //   let fild = res.dataSetDataRelationList;
      //   this.fieldList = this.fieldList.concat(fild);
      // }
      this.fieldList = res.dataSetDataRelationList;
      this.fieldCount = res.turnPageTotalNum;
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
    async getServList(data) {
      const params = {
        dataSetDataId: this.fieldData.dataSetDataId,
        // currentPage: e,
        turnPageShowNum: "9999",
        content:data || ""
      };
      const res = await this.rpc.dicmgmtDefine.getL5ServList(params);
      // if(e == 1 || !e){
      //   this.L5serviceList = res.l5SvcList;
      //   this.fieldCount = res.turnPageTotalNum;
      // }else{
      //   let L5List = res.l5SvcList;
      //   this.L5serviceList = this.L5serviceList.concat(L5List);
      // }
      this.L5serviceList = res.l5SvcList;
      this.servCount = res.turnPageTotalNum;
    },
    labelClick(e) {
      if (e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list",
        });
      }
    },
    detailClick(item, e, type) {
      // console.log(item, e, type, "详情");
      this.$emit("cellOp", item, e, type);
      // if (e == "1") {
      //   if (this.isDialog) {
      //     this.$emit("detailChange", e);
      //   } else {
      //     this.$router.push({
      //       path: "/aop_tradedesign/dicmgmt/piecewiseDetail",
      //       query: {
      //         dataSubstnNo: item.dataSubstnNo,
      //         dataSetNo: this.dataSetNo,
      //         type: "detail",
      //       },
      //     });
      //   }
      // } else if (e == "2") {
      //   if (this.isDialog) {
      //     this.$emit("detailChange", e);
      //   } else {
      //     this.$router.push({
      //       path: "/aop_tradedesign/dicmgmt/fieldDetail",
      //       query: {
      //         dataSetDataId: item.dataSetDataId,
      //         dataSetNo: this.dataSetNo,
      //         type: "dataSetDetail",
      //       },
      //     });
      //   }
      // } else if (e == "3") {
      //   if (this.isDialog) {
      //     this.$emit("detailChange", e);
      //   } else {
      //     this.$router.push({
      //       path: "/aop_tradedesign/dicmgmt/L5serviceDetail",
      //       query: {
      //         apiId: item.l5SvcId,
      //         dataSetNo: this.dataSetNo,
      //         type: "dataSetDetail",
      //       },
      //     });
      //   }
      // }
    },
    dataChange(item, index, e) {
      // console.log("当前点击", item, index, e, this.substnData);
      switch (e) {
        //分段
        case "1":
          Object.assign(this.substnData, item);
          this.getFieldList();
          break;
        //字段
        case "2":
          Object.assign(this.fieldData, item);
          this.getServList();
          this.$refs.tabsContentRef.fieldStyle = index
          break;
        //服务
        case "3":
          this.$refs.tabsContentRef.L5serviceStyle = index;
          break;
      }
    },
    subSearch(data){
      console.log("subSearch",data);
      this.getSubsList(data)
    },
    fieldSearch(data){
      console.log("fieldSearch",data);
      this.getFieldList(data);
    },
    servSearch(data){
      console.log("servSearch",data);
      this.getServList(data);
    },
    add(type) {
      this.$emit("addOp", type);
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_page_dataDetail {
  .detail_info {
    background: #fff;
    padding: 20px 24px;
    margin-bottom: 16px;
    // margin: 16px;
    h1 {
      font-family: $font_medium;
      font-size: 16px;
      // color: $pri_ft_color;
      color: #333333;
      letter-spacing: 0;
      // font-weight: $font_weight_600;
      margin-bottom: 20px;
    }
    .top_info {
      .content_box {
        display: flex;
        justify-content: space-between;
        margin-bottom: 23px;
        .content{
          flex: 1;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        // .right_box,
        // .left_box {
        //   width: 50%;
        // }
      }
    }
    .bottom_box,
    .top_info {
      .bottom_content {
        
        border-top: 1px solid #e7e7ee;
        padding: 16px 0;
        color: $sec_ft_color;
        .label {
          font-family: $font_regular;
          font-size: 14px;
          letter-spacing: 0;
          color: #999999;
        }
        .label_value {
          color: $pri_ft_color;
          &.cursor {
            color: $theme_color;
            cursor: pointer;
          }
        }
      }
    }
    .bottom_box{
      margin-top: 16px;
    }
  }
  .btn_info {
    background: #fff;
    padding: 20px 24px;
    margin-bottom: 16px;
    margin: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .label{
    color: #999999;
  }
}
</style>