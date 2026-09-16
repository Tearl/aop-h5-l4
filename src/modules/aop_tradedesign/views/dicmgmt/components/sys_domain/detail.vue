<template>
  <div class="aop_tradedesign_comps_dicmgmt_sys_domain_detail">
    <!-- <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader> -->
    <div class="detail_container">
      <div class="detail_content">
        <div class="content_header nav_title">领域详情</div>
        <ul class="content_body">
          <li class="list_item">
            <span class="list_item_key">领域名称：</span>
            <span class="list_item_value">{{domainInfo.domainNo}}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">领域中文名称：</span>
            <span class="list_item_value">{{domainInfo.domainNm}}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">领域描述：</span>
            <span class="list_item_value">{{domainInfo.domainDesc}}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">创建人：</span>
            <span class="list_item_value">{{domainInfo.creatrNm}}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">创建时间：</span>
            <span class="list_item_value">{{domainInfo.crtTm | crtTm_yyyyMMddhhmmss}}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">修改人：</span>
            <span class="list_item_value">{{domainInfo.updNm}}</span>
          </li>
          <li class="list_item">
            <span class="list_item_key">修改时间：</span>
            <span class="list_item_value">{{domainInfo.updTm | crtTm_yyyyMMddhhmmss}}</span>
          </li>
        </ul>
      </div>
    </div>
    <PageFooter>
      <div slot="box">
        <el-button @click="cancle">返 回</el-button>
      </div>
    </PageFooter>

  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";
// import validate from "@m/utils/validate";
import filters from "@m/utils/filters";

export default {
  mixins: [mixin],
  components: {
    PageHeader,
    PageFooter,
  },
  props: {
    domainId: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      // 页面类型
      pageType: "",
      // 应用ID
      appId: "",
      // 应用信息
      appInfo: {},
      // 领域信息
      domainInfo: {},
      // 新增应用表单
      formData: {
        appNo: "", // 应用名称
        appName: "", // 应用中文名称
        appDesc: "", // 应用描述
        codeType: "", // 源码库类型
        codeUrl: "", // 源码库地址
      },
      breadcrumbs: [
        {
          label: "领域管理",
          operate: 'list'
        },
        {
          label: "领域详情",
        },
      ],
      pagerG: {
        currentPage: "1",
        turnPageShowNum: "10",
        total: 0,
      },
      // 控制资产数对话框显示或隐藏
      groupCountVisiable: false,
      domainId: ""
    };
  },
  computed: {
  },
  methods: {
    // 顶部导航栏点击
    labelClick() {
      this.$router.push({
        path: "/aop_service/domainmgmt/list",
      });
    },
    // 取消
    cancle() {
      this.$emit("toDomainList")
      // this.$router.push({ path: "/aop_service/domainmgmt/list" });
    },
    //保存
    async save() {
      this.$refs.formData.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        console.log("表单验证通过后的逻辑")
      });
    },
    // 获取领域详情信息
    async getDomainInfoByDomainId() {
      const params = {
        domainId: this.domainId
      };
      const res = await this.rpc.systemmgmt.getDomainInfoByDomainId(params);
      this.domainInfo = res
    },
    init() {
      // this.domainId = this.$route.query.domainId
      this.getDomainInfoByDomainId()
    },
  },
  created() {
    this.init()
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_sys_domain_detail {
  .detail_container {
    display: flex;
    padding-bottom: 16px;
    // padding: 16px 24px;
    .detail_content {
      width: 100%;
      height: 100%;
      min-height: 482px;
      background: $base_white;
      padding: 20px 30px 0;
      .content_header {
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
        margin-bottom: 20px;
      }
      .content_body {
        .list_item {
          margin-bottom: 16px;
          .list_item_key {
            color: $sec_ft_color;
          }
          .list_item_value {
            color: $pri_ft_color;
            &.click_text {
              color: $theme_color;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>


