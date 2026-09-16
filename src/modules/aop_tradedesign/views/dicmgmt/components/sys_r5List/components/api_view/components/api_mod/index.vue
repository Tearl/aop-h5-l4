<template>
  <div class="aop_tradedesign_comps_apimgmt_api_mod">
    <div class="create_container">
      <div class="create_content">
        <Set ref="setRef" :detailInfo="detailInfo" type="mod"></Set>
        <Params
          ref="paramsRef"
          :detailInfo="detailInfo"
          :arsId="arsId"
        ></Params>
      </div>
    </div>

    <PageFooter>
      <div slot="box">
        <el-button type="primary" @click="saveChange(99)">确认</el-button>
      </div>
    </PageFooter>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { mixList } from "@m/utils/paramTree";
import { unduplicated } from "@m/utils/array";
import PageFooter from "@m/core/components/page_footer";
import Set from "./set";
import Params from "./params";
export default {
  mixins: [mixin],
  props: {
    apiId: {
      type: String,
      default: () => "",
    },
    arsId: {
      type: String,
      default: () => "",
    },
  },
  components: {
    Set,
    Params,
    PageFooter,
  },
  data() {
    return {
      detailInfo: {},
    };
  },
  methods: {
    init() {
      this.getDetail();
    },
    async getDetail() {
      const params = {
        apiId: this.apiId,
      };
      const res = await this.rpc.apimgmt.getApiDetail(params);
      this.detailInfo = res;
      this.$refs.setRef.formData = res;
      this.$refs.setRef.formData.arsName = res.relySysName;
      this.$refs.setRef.formData.arsId = res.relySys;
      this.$refs.setRef.formData.apiSceneIdList = res.apiSceneIdList.map(
        (item) => {
          item = item.asrSceneId;
          return item;
        }
      );
      this.$refs.setRef.getApiGroup();
      this.$refs.setRef.getMaxTypeList();
      this.$refs.setRef.getMinTypeList();
      this.$refs.setRef.getSceneIdList();

      if (res.aiServProcUrl !== "" && res.aiServProcUrl) {
        this.$refs.setRef.imgList.push({ path: res.aiServProcUrl });
      }

      this.$refs.paramsRef.initParams(res);
      //TO FIXED 编辑器
      setTimeout(() => {
        this.$refs.setRef.showEditor = true;
      }, 500);
    },
    // 提交
    async confirm() {
      let params = {};
      //添加排序序号
      if (this.detailInfo.puApiParams) {
        this.detailInfo.puApiParams.map((item, index) => {
          item.paramIndex = index;
        });
      }
      for (let key in this.detailInfo) {
        if (key != "sendData" && key != "receiveData") {
          params[key] = this.detailInfo[key];
        }
      }
      // 修改场景列表
      const list = [];
      this.detailInfo.apiSceneIdList.map((item) => {
        list.push({ asrSceneId: item });
      });
      params.apiSceneIdList = list;
      if (this.$refs.setRef.imgList.length > 0) {
        params.aiServProcUrl = this.$refs.setRef.imgList[0].path || "";
      }
      const res = await this.rpc.apimgmt.handleApiMod(params);
      this.$notify({
        title: "成功",
        message: "编辑API成功",
        duration: 2000,
        type: "success",
      });
      this.$emit("toApiInfo");
    },
    getOnly(arrs, operate) {
      if (operate == "only") {
        let list = unduplicated(arrs, "paramKey");
        if (list.length == arrs.length) return [];
        return arrs.filter((item) => list.indexOf(item) == -1);
      } else {
        const list = mixList(arrs, "children");
        const data = unduplicated(list, "paramParentId");
        let i = [];
        console.log("data", data);
        data.forEach((item) => {
          const l = list.filter((it) => it.paramParentId == item.paramParentId);
          const f = this.getOnly(l, "only");
          if (f.length > 0) {
            i = f;
          }
        });
        return i;
      }
    },
    saveChange(e) {
      const form = this.$refs.setRef.$refs.formData;
      const data = this.$refs.setRef.formData;
      // data.apiDesc = this.$refs.setRef.$refs.editorRef.eValue;
      // console.log(data.apiDesc);
      // if (data.apiDesc.indexOf("ProseMirror-trailingBreak") != -1) {
      //   data.apiDesc = "";
      // }
      form.validate(async (valid) => {
        if (!valid) return this.$message.error("基本信息填写有误或未填写");
        this.detailInfo = data;
        this.detailInfo.sendData = this.$refs.paramsRef.sendData;
        this.detailInfo.receiveData = this.$refs.paramsRef.receiveData;
        this.detailInfo.httpData = this.$refs.paramsRef.httpData;
        const h = this.detailInfo.httpData.find(
          (item) =>
            item.paramKey == "connection" ||
            item.paramKey == "charset" ||
            item.paramKey == "Content-Type" ||
            item.paramKey == "Authorization" ||
            item.paramKey == "apiVersion"
        );
        console.log(h);
        if (h)
          return this.$message.error(
            "http请求头参数不能为：connection，charset，Content-Type，Authorization，apiVersion"
          );
        const i = this.getOnly(this.detailInfo.sendData);
        if (i.length > 0)
          return this.$message.error(
            "输入参数的参数key: " + i[0].paramKey + "不能重复!请检查"
          );
        const l = this.getOnly(this.detailInfo.receiveData);
        if (l.length > 0)
          return this.$message.error(
            "输出参数的参数key: " + l[0].paramKey + "不能重复，请检查"
          );
        //转一维数组
        this.detailInfo.puApiParams = JSON.parse(
          JSON.stringify(
            mixList(this.detailInfo.sendData, "children").concat(
              mixList(this.detailInfo.receiveData, "children")
            )
          )
        );
        const listFlag = this.detailInfo.puApiParams.filter((item) => {return item.paramKey == "" || item.paramCName == ""})
        if(listFlag.length > 0) return this.$message.error("参数Key及参数名称不能为空！")
        this.detailInfo.httpHeaderParams = JSON.parse(
          JSON.stringify(mixList(this.detailInfo.httpData, "children"))
        );
        if (e == 99) {
          this.confirm();
        }
      });
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_apimgmt_api_mod {
  .create_container {
    width: 100%;
    height: 100%;
    .create_content {
      width: 100%;
      background: $base_white;
      .content_header {
        padding: 20px 30px 0;
        font-family: $font_medium;
        font-size: 16px;
        color: $pri_ft_color;
        letter-spacing: 0;
        font-weight: $font_weight_600;
      }
    }
  }
}
</style>