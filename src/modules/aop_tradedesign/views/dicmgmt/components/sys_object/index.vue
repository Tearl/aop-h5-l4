<template>
  <div class="aop_tradedesign_comps_dicmgmt_sys_object">
    <PageTabs
      :defaultActive="defaultActive"
      :tabsList="tabsList"
      @tabClick="handleTabClick"
    ></PageTabs>
    <div class="service_content" v-show="defaultActive === 'l'">
      <ServiceTop ref="formRef" :serviceForm="serviceForm" :form="form">
        <div slot="rightButton">
          <el-button
            type="primary"
            size="small"
            @click="search"
            class="right_button"
            >搜索</el-button
          >
          <el-button size="small" @click="reset" class="right_button"
            >重置</el-button
          >
        </div>
      </ServiceTop>
      <div class="content_bottom">
        <BussinessobjList ref="serviceList" :searchForm="searchRecord" @toAddObj="toAddObj" @toModObj="toModObj" @toObjDetail="toObjDetail">
        </BussinessobjList>
      </div>
    </div>
    <div class="service_content" v-show="defaultActive === 'p'">
      <div class="form_wrapper">
        <el-form
          :model="formData"
          class="create_form"
          ref="formData"
          label-width="120px"
        >
          <div class="create_form_info">
            <div class="img_wrapper">
              <img :src="imgUrl" />
            </div>
            <el-form-item label="关系图">
              <el-upload
                class="upload_file_btn"
                :action="actionUrl"
                :on-exceed="handleExceed"
                :on-success="handleImgSuccess"
                :file-list="uploadList"
                :auto-upload="true"
                :name="'uploadFile'"
                :show-file-list="false"
                :disabled="imgList.length > 0"
              >
                <div class="upload_body_btn">
                  <el-button size="mini" type="primary" class="upload_button">
                    <img
                      class="upload_button_plus"
                      :src="require('@m/assets/images/icon_add_back.png')"
                      alt=""
                    />
                    添加文件</el-button
                  >
                </div>
              </el-upload>
              <div v-for="(item, i) in imgList" :key="item" class="ex_file">
                <div class="file">{{ item.path }}</div>
                <el-button
                  icon="el-icon-close"
                  class="close_btn"
                  @click="delImg(i)"
                ></el-button>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <PageFooter
        @handleConfirm="confirmUrl"
        :confirmLabel="'提交'"
        :cancelLabel="''"
      ></PageFooter>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import BussinessobjList from "./components/bussinessobj_list"; // 列表
import ServiceTop from "@m/core/components/page_search_top"; //
import PageHeader from "@m/core/components/page_header";
import PageTabs from "@m/core/components/page_tabs";
import PageFooter from "@m/core/components/page_footer";
export default {
  mixins: [mixin],
  components: {
    BussinessobjList,
    ServiceTop,
    PageHeader,
    PageTabs,
    PageFooter,
  },
  props: {
    url: {
      type: String,
      default: () => "",
    },
    arsId: {
      type: String,
      default: () => "",
    },
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      tabsList: [
        { v: "业务对象列表", k: "l" },
        { v: "业务对象关系图", k: "p" },
      ],
      defaultActive: "l",
      // 公共搜索
      serviceForm: [
        {
          type: "input",
          model: "bsnObjNm",
          placeholder: "搜索业务对象名称",
          style: {
            width: "300px",
          },
        },
        {
          type: "select",
          model: "domainId",
          placeholder: "所属领域",
          select: [],
          filterable: true,
        },
      ],
      // 搜索信息表单
      form: {
        bsnObjNm: "", // 编号或名称或描述
        domainId: "", // 类型
      },
      // 搜索表单记录(点击搜索按钮后保存)
      searchRecord: {
        bsnObjNm: "", // 编号或名称或描述
        domainId: "", // 类型
      },

      formData: {},
      actionUrl: "",
      // 文件列表
      fileList: [],
      // IMG列表
      imgList: [],
      // 上传列表
      uploadList: [],
      imgUrl: "",
    };
  },
  methods: {
    //tab切换
    handleTabClick(e) {
      this.defaultActive = e;
    },
    // 点击搜索按钮
    search() {
      Object.assign(this.searchRecord, this.form);
      this.$nextTick(() => {
        this.$refs.serviceList.pager.currentPage = "1";
        this.$refs.serviceList.getList();
      });
    },
    // 点击重置按钮
    reset() {
      this.$refs.formRef.resetFields();
    },
    async getDomainList() {
      const res = await this.rpc.systemmgmt.getDomainList();
      this.serviceForm[1].select = res.domainInfoList.map((item) => {
        return { type: item.domainNm, value: item.domainId };
      });
    },
    // 导航栏点击
    labelClick(e) {
      if (e == "list") {
        this.$router.push({
          path: "/aop_tradedesign/workbench/home",
        });
      }
    },
    // img上传成功
    handleImgSuccess(response) {
      if (response.header.errorCode == "0") {
        this.imgList.push({
          path: response.body.path,
        });
        this.imgUrl = response.body.path;
      } else {
        this.$message.error(response.header.errorMsg);
      }
    },
    delImg(e) {
      this.imgList.splice(e, 1);
      this.imgUrl = "";
    },
    async confirmUrl() {
      const params = {
        arsId: this.arsId,
        arsBsnObjUrl: this.imgUrl,
      };
      const res = await this.rpc.systemmgmt.handleObjUrl(params);
      this.$notify({
        title: "成功",
        message: "上传成功",
        duration: 2000,
        type: "success",
      });
      this.$emit("confirmUrl")
    },
    toAddObj() {
      this.$emit("toAddObj")
    },
    toModObj(e) {
      this.$emit("toModObj",e)
    },
    toObjDetail(e) {
      this.$emit("toObjDetail",e)
    },
    //初始化
    init() {
      this.actionUrl = this.rpc.file.pUp();
      this.search();
      this.getDomainList()
      console.log(this.detailInfo);
    },
  },
  created() {
    this.init();
  },
  mounted() {
    this.imgUrl = this.url
    if (this.imgUrl !== "") {
      this.imgList.push({ path: this.imgUrl });
    }
  },
  watch: {
    url(n, o) {
      console.log(n);
      this.imgUrl = n;
      if (this.imgUrl !== "") {
        this.imgList = []
        this.imgList.push({ path: this.imgUrl });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_sys_object {
  .service_content {
    .form_wrapper {
      width: 100%;
      height: 100%;
      min-height: 400px;
      background-color: $base_white;
      .form_header {
        padding: 20px 30px 0;
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
      }
      .create_form {
        padding-top: 16px;
        @include form(".create_form_info");
      }
      .create_form_info {
        padding: 0px 30px 0;
        .upload_button_plus {
          display: block;
          height: 20px;
          width: 20px;
          margin: 0 auto;
          margin-bottom: 2px;
        }
        .ex_file {
          width: 100%;
          height: 40px;
          position: relative;
          .file {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          .close_btn {
            color: $base_white;
            position: absolute;
            right: -16px;
            top: 8px;
            bottom: 0;
            border: 0;
            height: 16px;
            width: 16px;
            line-height: 16px;
            border-radius: 50%;
            background-color: rgba(51, 51, 51, 0.7);
            text-align: center;
            overflow: hidden;
            padding: 0;
          }
        }
        .upload_button {
          width: 80px;
          height: 80px;
          background-color: $base_bg_color;
          border: 1px solid $pri_br_color;
          color: $sec_ft_color;
        }
      }
    }
  }
  .img_wrapper {
    padding: 0 16px;
    text-align: center;
  }
  .content_bottom {
    background: $base_white;
    padding: 0 24px 24px;
  }
}
</style>


