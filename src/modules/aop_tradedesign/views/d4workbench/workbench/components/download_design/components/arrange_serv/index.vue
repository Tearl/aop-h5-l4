<template>
  <div class="aop_tradedesign_comps_undergarment_m1_input_trans_arrange">
    <TabsContent :L5serviceList="L5serviceList" @dataChange="dataChange" ref="tabsContentRef" :servCount="servCount" :fieldList="fieldList" :fieldCount="fieldCount"></TabsContent>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import filters from "@m/utils/filters";
import TabsContent from "./tabsContent.vue";
export default {
  mixins: [mixin],
  components: {
    TabsContent
  },
  props: {
    currentD4bObj:{
      type:Object,
      default:() =>({})
    },
    authId: {
      type: String,
      default: () => "",
    },
    fnctCd: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      L5serviceList:[],
      servCount:"0",
      fieldList:[],
      fieldCount:"0"
    };
  },
  mounted() {
    // this.init();
  },
  methods: {
    init() {
      console.log(this.fnctCd,this.authId,this.currentD4bObj,"编排")
      this.getServiceList();
    },
    async getServiceList(){
      const params = {
        fnctCd:this.fnctCd,
        authCd:this.authId,
        d4bSvcId:this.currentD4bObj.svcId,
      };
      const res = await this.rpc.dicmgmtDefine.getServiceList(params);
      console.log("res--->",res);
      this.L5serviceList.length = 0;
      this.fieldList =res.l5SvcList;
      this.fieldCount = res.l5SvcList.length;
      this.L5serviceList.push(this.fieldList[0]);
      this.servCount= "1"
    },
    dataChange(data,index,e){
      if(e == "2"){
        this.L5serviceList.length = 0;
        this.L5serviceList.push(data);
        // console.log(this.L5serviceList,"yyyyyyyy")
        this.servCount= "1"
      }
      // console.log(data,index,e,"yyyyyyyy")
    }
  },
  watch: {},
  filters: {
    ...filters,
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_undergarment_m1_input_trans_arrange {
 
}
</style>
