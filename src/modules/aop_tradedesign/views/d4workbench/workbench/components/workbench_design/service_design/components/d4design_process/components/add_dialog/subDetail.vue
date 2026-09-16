<template>
  <div class="aop_service_dic_page_piecewiseDetail">
    <PageDialog
      dialogTitle="分段详情"
      :dialogVisiable="dialogVisible"
      dialogWidth="70%"
      @closeDialog="closeDialog"
      class="dialog"
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
                  <span class="label">所属数据集：</span
                  ><span class="label_value">{{ subStnInfo.dataSetNm }}</span>
                </div>
                <div class="content">
                  <span class="label">名称：</span
                  ><span class="label_value">{{
                    subStnInfo.dataSubstnNm
                  }}</span>
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
              @reFresh="reFresh"
            ></TabsContent>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="btn_info" v-if="!isDialog">
          <div class="btn" style="">
            <el-button @click="closeDialog">返回</el-button>
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
      dialogVisible: false,
    };
  },
  created() {},
  mounted() {
    // this.init();
  },
  methods: {
    init() {
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
    showDialog(data) {
      this.dataSubstnNo = data.dataSubstnNo;
      this.getDetail();
      this.getFieldList();
      this.dialogVisible = true;
    },
    async getDetail() {
      const params = {
        dataSubstnNo: this.dataSubstnNo,
      };
      const res = await this.rpc.dicmgmt.getSubStnDetail(params);
      this.subStnInfo = res || {};
    },
    async getFieldList() {
      const params = {
        dataSubstnNo: this.dataSubstnNo,
        turnPageShowNum: "99",
      };
      const res = await this.rpc.dicmgmt.getMyFieldList(params);
      this.fieldList = res.dataSetDataRelationList;
      this.fieldCount = res.turnPageTotalNum;
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
        turnPageShowNum: "99",
      };
      const res = await this.rpc.dicmgmt.getL5ServList(params);

      this.L5serviceList = res.l5SvcList;
      this.servCount = res.turnPageTotalNum;
    },
    detailClick(item, e) {
      console.log(item, e, "详情");
      this.$emit("detailClick",item,e);
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
    closeDialog() {
      this.dialogVisible = false;
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_service_dic_page_piecewiseDetail {
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