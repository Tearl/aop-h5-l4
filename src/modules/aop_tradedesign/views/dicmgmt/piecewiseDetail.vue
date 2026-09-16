<template>
  <div class="aop_tradedesign_dic_page_piecewiseDetail">
    <PageHeader
      v-if="!isDialog"
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <div class="detail_info">
      <div class="top_info">
        <h1>基本信息</h1>
        <div class="content_box">
          <div class="right_box">
            <div class="content">
              <span class="label">所属数据集：</span
              ><span class="label_value">{{ subStnInfo.dataSetNm }}</span>
            </div>
            <div class="content">
              <span class="label">关系：</span
              ><span class="label_value">{{
                subStnInfo.dataSubstnAttr | substnAttrType
              }}</span>
            </div>
          </div>
          <div class="middle_box">
            <div class="content">
              <span class="label">所属域：</span
              ><span class="label_value">{{
                subStnInfo.beltLineNm
              }}</span>
            </div>
            <div class="content">
              <span class="label">分类：</span
              ><span class="label_value">{{ subStnInfo.classifyId | classifyIdSt }}</span>
            </div>
          </div>
          <div class="left_box">
            <div class="content">
              <span class="label">名称：</span
              ><span class="label_value">{{ subStnInfo.dataSubstnNm }}</span>
            </div>
          </div>
        </div>
        <div class="bottom_box">
          <div class="content">
            <span class="label">描述：</span
            ><span class="label_value">{{ subStnInfo.subDesc }}</span>
          </div>
        </div>
      </div>
      <!-- <div class="bottom_box">
        <div class="content">
          <span class="label">产品描述：</span
          ><span class="label_value">{{ subStnInfo.assetsContext }}</span>
        </div>
      </div> -->
    </div>
    <div class="detail_info">
      <div class="top_info">
        <TabsContent
          :isShow="false"
          :piecewiseTrue="false"
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
    </div>
    <!-- <div class="btn_info" v-if="!isDialog">
      <div class="btn" style="">
        <el-button @click="labelClick('back')">返回</el-button>
      </div>
    </div> -->
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import TabsContent from "./components/dataTabsContent";
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
  },
  data() {
    return {
      subStnInfo: {},
      appNo: "", //应用编号
      appVerNo: "", //应用版本号
      fieldList: [],
      piecewiseList: [],
      L5serviceList: [],
      // breadcrumbs: [
      //   {
      //     label: "字典管理",
      //     operate: "list",
      //   },
      //   {
      //     label: "字典管理",
      //     operate: "dataSet",
      //   },
      //   {
      //     label: "数据分段详情",
      //   },
      // ],
      list: [],
      dataSubstnNo: "",
      type: "",
      fieldData: {},
      fieldCount: "0",
      servCount: "0",
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  destroyed(){
    sessionStorage.removeItem("dataSetInfo")
  },
  computed: {
    breadcrumbs() {
      if (this.type == "detail") {
        return [
          {
            label: "字典管理",
            operate: "list",
          },
          {
            label: "数据集详情",
            operate: "detail",
          },
          {
            label: "数据分段详情",
          },
        ];
      } else if(this.type == "list"){
        return [
          {
            label:"字典管理",
            operate: "list",
          },
          {
            label: "数据分段详情",
          }
        ]
      }else {
        return [
          {
            label: "字典管理",
            operate: "list",
          },
          {
            label: "编辑数据集",
            operate: "edit",
          },
          {
            label: "数据分段详情",
          },
        ];
      }
    },
  },
  methods: {
    init() {
      this.dataSubstnNo = this.$route.query.dataSubstnNo;
      this.dataSetNo = this.$route.query.dataSetNo;
      this.type = this.$route.query.type || "";
      this.getDetail();
      this.getFieldList();
    },
    reFresh(e, type) {
      console.log("更新数据", e);
      if (type == "field") {
        this.getFieldList(e);
      } else if (type == "serv") {
        this.getServList(e);
      }
    },
    labelClick(e) {
      if (e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/list",
        });
      } else if (e == "detail") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/dataDetail",
          query: {
            dataSetNo: this.dataSetNo,
          },
        });
      } else if (e == "edit") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editDataSet",
          query: {
            dataSetNo: this.dataSetNo,
          },
        });
      } else if (e == "back") {
        this.$router.go(-1);
      }
    },
    async getDetail() {
      const params = {
        dataSubstnNo: this.dataSubstnNo,
      };
      const res = await this.rpc.dicmgmt.getSubStnDetail(params);
      this.subStnInfo = res || {};
    },
    async getFieldList(e) {
      const params = {
        dataSubstnNo: this.dataSubstnNo,
        // currentPage: e ? e : "1",
        turnPageShowNum: "9999",
        preciseQuery: "0",
        content: e || "",
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
        this.L5serviceList = [];
        this.servCount = "0";
      } else {
        Object.assign(this.fieldData, res.dataSetDataRelationList[0]);
        this.$refs.tabsContentRef.fieldStyle = "0";
        this.getServList();
      }
    },
    async getServList(e) {
      const params = {
        dataSetDataId: this.fieldData.dataSetDataId,
        // currentPage: e,
        turnPageShowNum: "9999",
        content: e || "",
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
    detailClick(item, e) {
      console.log(item, e, "详情");
      if (e == "2") {
        if (this.isDialog) {
          this.$emit("detailChange", e);
        } else {
          this.$router.push({
            path: "/aop_tradedesign/dicmgmt/fieldDetail",
            query: {
              dataSetDataId: item.dataSetDataId,
              dataSetNo: this.dataSetNo,
              dataSubstnNo: this.dataSubstnNo,
              type: this.type,
            },
          });
        }
      } else if (e == "3") {
        if (this.isDialog) {
          this.$emit("detailChange", e);
        } else {
          this.$router.push({
            path: "/aop_tradedesign/dicmgmt/L5serviceDetail",
            query: {
              apiId: item.l5SvcId,
              dataSetNo: this.dataSetNo,
              dataSubstnNo: this.dataSubstnNo,
              type: this.type,
            },
          });
        }
      }
    },
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
    fieldSearch(data) {
      console.log("fieldSearch", data);
      this.getFieldList(data);
    },
    servSearch(data) {
      console.log("servSearch", data);
      this.getServList(data);
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_dic_page_piecewiseDetail {
  .detail_info {
    background: #fff;
    padding: 20px 24px;
    margin-bottom: 16px;
    margin: 16px;
    h1 {
      font-family: $font_medium;
      font-size: 16px;
      color: $pri_ft_color;
      letter-spacing: 0;
      font-weight: $font_weight_600;
    }
    .top_info {
      .content_box {
        display: flex;
        margin-bottom: 10px;
        .right_box,
        .middle_box,
        .left_box {
          width: 33%;
        }
      }
    }
    .bottom_box,
    .top_info {
      .content {
        margin-top: 16px;
        .label {
          font-family: $font_regular;
          font-size: 14px;
          color: $sec_ft_color;
          letter-spacing: 0;
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
    .bottom_box {
      border-top: 1px solid #e7e7ee;
      margin-top: 24px;
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
}
</style>