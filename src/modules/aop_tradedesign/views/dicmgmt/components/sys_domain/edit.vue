<template>
  <div class="aop_tradedesign_comps_dicmgmt_sys_domain_edit">
    <!-- <PageHeader
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader> -->
    <div class="create_container">
      <div class="create_content">
        <div class="content_header nav_title">{{pageType == "edit" ? "领域编辑" : "领域新增"}}</div>
        <el-form
          :model="formData"
          :rules="rules"
          class="service_create_form"
          ref="formData"
          label-width="120px"
        >
          <div class="service_create_form_info">
            <el-form-item label="领域名称" prop="domainNo">
              <el-input
                v-model="formData.domainNo"
                clearable
                placeholder="请输入领域名称"
                show-word-limit
              >
              </el-input>
              <div class="create_form_tips">
                命名规范：xxx-domain，如 user-domain
              </div>
            </el-form-item>
            <el-form-item label="领域中文名称" prop="domainNm">
              <el-input
                v-model="formData.domainNm"
                clearable
                maxlength="100"
                placeholder="请输入领域中文名称"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="领域描述" prop="domainDesc">
              <el-input
                type="textarea"
                :rows="4"
                maxlength="150"
                placeholder="请输入领域描述"
                v-model="formData.domainDesc"
                clearable
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <PageFooter>
      <div slot="box">
        <el-button @click="cancle">取 消</el-button>
        <el-button
          type="primary"
          @click="save"
          >保 存</el-button
        >
      </div>
    </PageFooter>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import PageHeader from "@m/core/components/page_header";
import PageFooter from "@m/core/components/page_footer";

import validate from "@m/utils/validate";


export default {
  mixins: [mixin],
  components: {
    PageHeader,
    PageFooter,
  },
  props: {
    pageType: {
      type: String,
      default: () => ""
    },
    domainId: {
      type: String,
      default: () => ""
    },
    arsId: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      // 领域信息表单
      formData: {
        domainId: "", // 领域ID
        domainNo: "", // 领域名称
        domainNm: "", // 领域中文名称
        domainDesc: "", // 领域描述
      },
      // 领域表单的验证规则
      rules: {
        domainNo: [
          { required: true, trigger: "blur", message: "请输入领域名称" },
          { required: true, trigger: "blur", message: "命名规范：xxx-domain，如 user-domain", validator: validate.domainName},
        ],
        domainNm: [
          {
            required: true,
            trigger: "blur",
            message: "请输入领域中文名称",
          },
          {
            required: true,
            trigger: "blur",
            message: "请输入中文",
            validator: validate.isChinese,
          },
          {
            required: true,
            trigger: "blur",
            min: 2,
            message: "请输入最少两个中文",
          },
        ],
        domainDesc: [
          { required: true, trigger: "blur", message: "请输入领域描述" },
        ]
      },
    };
  },
  computed: {
    breadcrumbs() {
      return [
        {
          label: "领域管理",
          operate: 'list'
        },
        {
          label: this.pageType == "create" ? "新增领域" : "编辑领域",
        },
      ]
    }
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
        if (!valid) return
        const params = {
          domainNo: this.formData.domainNo,
          sysId: this.arsId,
          // domainId: this.pageType == "edit" ? this.domainId : "",
          domainNm: this.formData.domainNm,
          domainDesc: this.formData.domainDesc
        }
        if (this.pageType == "edit") {
          params.domainId = this.domainId
          await this.rpc.systemmgmt.editDomainInfo(params);
        } else {
          await this.rpc.systemmgmt.addDomainInfo(params);
        }
        this.$notify({
          title: "成功",
          message: "成功",
          duration: 2000,
          type: "success",
        });
        this.cancle();
      });
    },
    async getDomainInfoByDomainId() {
      const params = {
        domainId: this.domainId
      };
      const res = await this.rpc.systemmgmt.getDomainInfoByDomainId(params);
      Object.assign(this.formData, res)
    },
    init() {
      if (this.pageType == "edit") {
        this.getDomainInfoByDomainId()
      }
    },
  },
  created() {
    this.init()
  },
  watch: {
    domainId(n,o) {
      this.init()
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_sys_domain_edit {
  .create_container {
    display: flex;
    padding-bottom: 16px;
    .create_content {
      width: 100%;
      height: 100%;
      min-height: 482px;
      background: $base_white;
      .content_header {
        padding: 20px 30px 0;
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
      }
      .service_create_form {
        margin-top: 32px;
        @include form(".service_create_form_info");
        .create_form_tips {
          width: 500px;
          position: absolute;
          left: 420px;
          top: 0px;
          height: 40px;
          line-height: 40px;
          font-family: $font_regular;
          font-size: 12px;
          color: $sec_ft_color;
          letter-spacing: 0;
        }
      }
      .service_create_form_info {
        padding: 0px 30px 0;
      }
    }
  }
}
</style>


