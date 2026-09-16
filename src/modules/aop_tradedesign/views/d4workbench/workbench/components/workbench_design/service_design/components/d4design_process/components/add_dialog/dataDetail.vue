<template>
  <div class="aop_service_dic_page_dataDetail">
    <PageDialog
      :dialogWidth="'90%'"
      :dialogVisiable="dataVisible"
      :dialogTitle="dataTitle"
      @closeDialog="closeDataDialog"
      :apTobody="true"
      :customClass="'customClass'"
    >
      <div slot="box">
        <div class="detail_info">
          <div class="top_info">
            <h1>基本信息</h1>
            <div class="content_box">
              <div class="right_box">
                <div class="content">
                  <span class="label">名称：</span
                  ><span class="label_value">{{ detailObj.dataSetNm }}</span>
                </div>
                <div class="content">
                  <span class="label">所属册：</span
                  ><span class="label_value">{{
                    detailObj.dataSetCgyDesc
                  }}</span>
                </div>
              </div>
              <div class="left_box">
                <div class="content">
                  <span class="label">所属部：</span
                  ><span class="label_value">{{
                    detailObj.beltLine | beltLineType
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="bottom_box">
            <div class="content">
              <span class="label">描述：</span
              ><span class="label_value">{{ detailObj.dataSetDesc }}</span>
            </div>
          </div>
        </div>
        <div class="detail_info">
          <TabsContent
            ref="tabsContentRef"
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
            @reFresh="reFresh"
          ></TabsContent>
        </div>
      </div>
      <div slot="footer">
        <div class="btn_info" v-if="!isDialog">
          <div class="btn" style="">
            <el-button @click="closeDataDialog()">返回</el-button>
          </div>
        </div>
      </div>
    </PageDialog>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import TabsContent from "../addServ/components/tabsContent";
import PageHeader from "@m/core/components/page_header";
import PageDialog from "@m/core/components/page_dialog";
export default {
  mixins: [mixin],
  components: {
    TabsContent,
    PageHeader,
    PageDialog,
  },
  props: {
    isDialog: {
      type: Boolean,
      default: false,
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
      dataVisible: false,
      dataTitle: "数据集详情",
    };
  },
  created() {},
  mounted() {
    // this.init();
  },
  computed: {},
  methods: {
    init() {
      this.getDetail();
      this.getSubsList();
    },
    showDialog(data) {
      this.dataSetNo = data.dataSetNo;
      this.getDetail(data);
      this.getSubsList();
      this.dataVisible = true;
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
    async getDetail(data) {
      const params = {
        dataSetNo: data.dataSetNo,
      };
      const res = await this.rpc.dicmgmt.getMyDataSetDetail(params);
      this.detailObj = res || {};
    },
    async getSubsList() {
      const params = {
        dataSetNo: this.dataSetNo,
        turnPageShowNum: "99",
      };
      const res = await this.rpc.dicmgmt.getSubStnList(params);
      this.piecewiseList = res.dataSubsectionList;
      this.susStnCount = res.turnPageTotalNum;
      this.$refs.tabsContentRef.piecewiseStyle = "0";
      if (!res.dataSubsectionList.length) {
        this.substnData = {};
      } else {
        Object.assign(this.substnData, res.dataSubsectionList[0] || {});
        this.getFieldList();
      }
    },
    async getFieldList() {
      const params = {
        dataSubstnNo: this.substnData.dataSubstnNo,
        turnPageShowNum: "99",
      };
      const res = await this.rpc.dicmgmt.getMyFieldList(params);
      this.fieldList = res.dataSetDataRelationList;
      this.fieldCount = res.turnPageTotalNum;
      this.$refs.tabsContentRef.fieldStyle = "0";
      console.log("params", this.fieldList);
      if (!res.dataSetDataRelationList.length) {
        this.fieldData = {};
      } else {
        Object.assign(this.fieldData, res.dataSetDataRelationList[0]);
        this.getServList();
      }
    },
    async getServList() {
      const params = {
        dataSetDataId: this.fieldData.dataSetDataId,
        turnPageShowNum: "10",
      };
      const res = await this.rpc.dicmgmt.getL5ServList(params);
      this.L5serviceList = res.l5SvcList;
      this.servCount = res.turnPageTotalNum;
    },
    detailClick(item, e, type) {
      console.log(item, e, type, "详情");
      this.$emit("detailClick",item,e);
    },
    dataChange(item, index, e) {
      console.log("当前点击", item, index, e, this.substnData);
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
          break;
        //服务
        case "3":
          break;
      }
    },
    closeDataDialog() {
      this.dataVisible = false;
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_service_dic_page_dataDetail {
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
        .right_box,
        .left_box {
          width: 50%;
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
.customClass {
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
        .right_box,
        .left_box {
          width: 50%;
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