<template>
  <div class="aop_tradedesign_comps_d4editor_service_define_business_rule">
    <div class="detail_container">
      <div class="detail_content">
        <!-- 流程图 -->
        <div class="content_header_title nav_title_rule">流程图</div>
        <img :src="detailInfo.aiServProcUrl" />
      </div>
      <!-- <div class="detail_content" v-if="servShow"> -->
      <div class="detail_content">
        <!-- 关联服务 -->
        <div class="content_header_title nav_title_rule">关联服务</div>
        <Serv ref="sceneListRef" :apiId="apiId" :currentD4bObj="currentD4bObj"></Serv>
      </div>
      <div class="detail_content">
        <!-- 业务规则 -->
        <!-- <div class="content_header_title ">业务规则</div> -->
        <Rule class="nav_title_rule" ref="ruleListRef" :pageMode='$route.query.pageMode' :apiId="apiId" :currentD4bObj="currentD4bObj" :btnAuth="btnAuth" type="inDetail"></Rule>
      </div>
      <!-- 业务对象 -->
      <!-- <div class="detail_content">
        <div class="content_header_title nav_title_rule">业务对象</div>
        <BussObj :apiId="apiId" @toObjDetail="toObjDetail"></BussObj>
      </div> -->
    </div>
    <PageRightNav
      :itemList="itemList"
      :parentClass="'.process_middle'"
      navClass=".nav_title_rule"
    ></PageRightNav>
  </div>
</template>
<script>
import mixin from "@m/core/mixin";
import Serv from "./serv";
import Rule from "./rule";
import BussObj from "./object";
import PageRightNav from "@m/core/components/page_right_nav";

export default {
  mixins: [mixin],
  components: {
    Serv,
    Rule,
    BussObj,
    PageRightNav
  },
  props: {
    apiId: {
      type: String,
      default: () => "",
    },
    currentD4bObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // 右侧导航栏参数
      itemList: [
        "流程图",
        "关联服务",
        "业务规则",
      ],
      // servShow: false,
      detailInfo: {},
      btnAuth:true,
    };
  },
  methods: {
    init() {
      console.log("业务规则初始化123")
      this.btnAuth = this.$route.query.pageMode == 'read' ?false:true
      this.$refs.ruleListRef.getList()
      this.$refs.sceneListRef.getList()
      // this.getApiDetail();
    },
    toObjDetail(e) {
      this.$emit("toObjDetail", e,"business")
    },
    // 查询详情
    async getApiDetail() {
      if (!this.currentD4bObj.svcId) return
      const params = {
        apiId: this.currentD4bObj.svcId,
      };
      const res = await this.rpc.public.getApiDetail(params);
      this.detailInfo = res;
      // if (res.apiServiceType === "D4b服务") {
      //   this.servShow = true;
      //   this.itemList = [
      //     "流程图",
      //     "关联服务",
      //     "业务规则",
      //     "业务对象"
      //   ]
      // } else {
      //   this.itemList = [
      //     "流程图",
      //     "业务规则",
      //     "业务对象"
      //   ]
      // }
    },
  },
  created() {
    // this.init();
  }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4editor_service_define_business_rule {
  .detail_container {
    .detail_content {
      background: $base_white;
      padding: 20px 30px;
      margin-bottom: 20px;
      .content_header_title {
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
        margin: 20px 0;
        &:nth-child(1){
          margin-top: 0;
        }
      }
    }
  }
}
</style>
