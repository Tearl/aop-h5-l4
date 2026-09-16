 <template>
  <div class="aop_tradedesign_comps_apimgmt_api_view_api_flow">
    <div class="detail_content">
        <!-- 流程图 -->
        <div class="content_header_title nav_title">流程图</div>
        <img :src="detailInfo.aiServProcUrl" />
      </div>
    <Rule :apiId="apiId" :type="type" :btnAuth="btnAuth"></Rule>
    <BussObj :apiId="apiId" :type="type" :btnAuth="btnAuth" @toObjDetail="toObjDetail" @toModObj="toModObj"></BussObj>
    <Serv :apiId="apiId" :type="type" :btnAuth="btnAuth" v-if="servShow"></Serv>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import Serv from "./serv";
import Rule from "./rule";
import BussObj from "./object";
export default {
  mixins: [mixin],
  components: {
    Serv,
    Rule,
    BussObj
  },
  props: {
    apiId: {
      type: String,
      default: () => "",
    },
    btnAuth: {
      type: String,
      default: () => false,
    },
  },
  data() {
    return {
      servShow: false,
      detailInfo: {},
      type: "inDetail"
    };
  },
  methods: {
    init() {
      this.getApiDetail();
    },
    // 查询详情
    async getApiDetail() {
      const params = {
        apiId: this.apiId,
      };
      const res = await this.rpc.apimgmt.getApiDetail(params);
      this.detailInfo = res;
      if (res.apiServiceType === "4B服务") {
        this.servShow = true;
      }
    },
    toObjDetail(e) {
      this.$emit("toObjDetail",e, "rule")
    },
    toModObj(e) {
      this.$emit("toModObj",e)
    }
  },
  created() {
    this.init();
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_api_view_api_flow {
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
</style>

