<template>
  <div class="aop_tradedesign_dic_page_piecewiseDetail">
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
              <span class="label">名称：</span
              ><span class="label_value">{{ subStnInfo.dataSubstnNm }}</span>
            </div>
          </div>
          <div class="left_box">
            <div class="content">
              <span class="label">所属部：</span
              ><span class="label_value">{{
                subStnInfo.beltLine | beltLineType
              }}</span>
            </div>
            <div class="content">
              <span class="label">关系：</span
              ><span class="label_value">{{
                subStnInfo.dataSubstnAttr | substnAttrType
              }}</span>
            </div>
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
          :fieldCount="fieldCount"
          :servCount="servCount"
          @detailClick="detailClick"
          @dataChange="dataChange"
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
    currentSubObj: {
      type: Object,
      default: ()=>({}),
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
      list: [],
      dataSubstnNo: "",
      type: "",
      fieldData:{},
      fieldCount: "0",
      servCount: "0",
    };
  },
  created() {},
  mounted() {
    // this.init();
  },
  computed: {
   
  },
  methods: {
    init() {
      this.dataSubstnNo = this.$route.query.dataSubstnNo;
      this.dataSetNo = this.$route.query.dataSetNo || "FM-SJJ-110821";
      this.type = this.$route.query.type || "";
      console.log(this.currentSubObj,"init")
      this.getDetail();
      this.getFieldList();
    },
    async getDetail() {
      const params = {
        dataSubstnNo: this.dataSubstnNo || this.currentSubObj.dataSubstnNo,
      };
      const res = await this.rpc.dicmgmt.getSubStnDetail(params);
      this.subStnInfo = res || {};
    },
    async getFieldList() {
      const params = {
        dataSubstnNo: this.dataSubstnNo || this.currentSubObj.dataSubstnNo
      }
      const res = await this.rpc.dicmgmt.getMyFieldList(params);
      this.fieldList = res.dataSetDataRelationList
      this.fieldCount = res.turnPageTotalNum;
      if(!res.dataSetDataRelationList.length) {
        this.fieldData = {}
      }else {
        Object.assign(this.fieldData,res.dataSetDataRelationList[0])
        this.getServList()
      }
    },
    async getServList() {
      const params = {
        dataSetDataId: this.fieldData.dataSetDataId
      }
      const res = await this.rpc.dicmgmt.getL5ServList(params)
      this.L5serviceList = res.l5SvcList
      this.servCount = res.turnPageTotalNum;
    },
    detailClick(item, e) {
      console.log(item, e, "详情");
      this.$emit("cellBelong",item,e);
    },
    dataChange(item, index, e) {
      switch (e) {
        //字段
        case "2":
          Object.assign(this.fieldData, item);
          this.getServList()
          break;
        //服务
        case "3":
          break;
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