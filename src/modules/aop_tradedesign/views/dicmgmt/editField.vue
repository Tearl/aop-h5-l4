<template>
  <div class="aop_tradedesign_dic_cmps_my_dic_list">
    <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader>
    <div class="content">
      <BaseInfo ref="baseRef" :infoData="infoData" type="edit" :backType="type"></BaseInfo>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import PageHeader from "@m/core/components/page_header";
import BaseInfo from "./components/form/fieldInfo";
export default {
  mixins: [mixin],
  components: {
    PageHeader,
    BaseInfo,
  },
  props: {},
  computed: {
    breadcrumbs() {
      if (this.type == "edit") {
        return [
          {
            label: "字典管理",
            operate: "list",
          },
          {
            label: "编辑数据集",
            operate: "dataSet",
          },
          {
            label: "编辑字段",
          },
        ];
      } else {
        return [
          {
            label: "字典管理",
            operate: "list",
          },
          {
            label: "编辑分段",
            operate: "substn",
          },
          {
            label: "编辑字段",
          },
        ];
      }
    },
  },
  data() {
    return {
      // breadcrumbs: [
      //   {
      //     label: "字典管理",
      //     operate: "list",
      //   },
      //   {
      //     label: "编辑数据集",
      //     operate: "dataSet",
      //   },
      //   {
      //     label: "编辑字段",
      //   },
      // ],
      infoData: {},
      type: ""
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  // destroyed(){
  //   sessionStorage.removeItem("dataSetInfo")
  // },
  methods: {
    init() {
      this.infoData.dataSetNo = this.$route.query.dataSetNo;
      this.infoData.dataSubstnNo = this.$route.query.dataSubstnNo;
      this.infoData.dataSetDataId = this.$route.query.dataSetDataId;
      this.type = this.$route.query.type || "";
      this.getDetail()
    },
    async getDetail() {
      const params = {
        dataSetDataId: this.infoData.dataSetDataId,
      };
      const res = await this.rpc.dicmgmt.getMyFieldDetail(params);
      this.$refs.baseRef.formData = res;
      this.$set(this.$refs.baseRef.formData,"dataSubstnNo",this.infoData.dataSubstnNo)
      if(["String","char","byte","short","long","Character","Byte","Short","Long"].includes(res.dictryTyp)){
        if(res.dictryEnum && res.dictryEnum !== ""){
          this.$refs.baseRef.$refs.enumRef.enumerateValueList = res.dictryEnum.split(",").map((item) =>{
            let arr = item.split("-");
            return {
              key:arr[0],
              value:arr[1],
            }
          })
        }
      }
      // this.$refs.baseRef.servList = res.apiList
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
            dataSetNo: this.infoData.dataSetNo,
          },
        });
      } else if (e == "substn") {
        this.$router.push({
          path: "/aop_tradedesign/dicmgmt/editSubstn",
          query: {
            dataSetNo: this.infoData.dataSetNo,
            dataSubstnNo: this.infoData.dataSubstnNo,
          },
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
    background: $base_white;
  }
}
</style>