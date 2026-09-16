<!--
 * @Author: zhaoyu zhoayu@belink.com
 * @Date: 2023-06-29 17:37:44
 * @LastEditors: zhaoyu zhoayu@belink.com
 * @LastEditTime: 2023-07-03 10:43:27
 * @FilePath: /aop-h5-l1/src/modules/aop_businessd2/views/d2/nodeDesign/components/BusinessFlow.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * 开发工作台-系统设计-业务流程 - editSt 0 不可编辑 1 可编辑
 -->
<template>
  <div class="aop-tcb-layout-wrap">
    <el-tabs class="top-header-tab" type="card" v-model="activeTabName" @tab-click="tabtopClick(activeTabName)">
        <el-tab-pane v-for="(item, index) in tabsList2" :label="item.v" :key="index" :name="item.k"></el-tab-pane>
    </el-tabs>
    <!-- <div class="line-gray"></div> -->
    <div class="aop-tcb-layout-center">
      <!-- 流程描述 -->
      <!-- 开发模式 -->
      <div v-if="activeTabName == 'processDesc'" style="padding-left:16px;">
        <div class="flex-top padding-t-24" v-if="(mode == 's4Design' || mode == 's5Design') && editSt=='1'">
          <div class="editor-wrap" >
            <aopCommonDocEditor
                :formMode="true"
                :useDrawio="false"
                :showTitle="false"
                :showHeaderTree="false"
                businessType="YWJY"
                :businessContext="{
                    bizAppNo: itemInfo.bizAppNo,
                    bizAppVersion: itemInfo.bizAppVersion
                }"
                :imageUploadConfig="imageUploadConfigSetting"
                v-model="initValues"
            />
          </div>
        </div>
        <!-- 预览模式 -->
        <div v-if="editSt=='0'">
            <!-- v-if="mode == 's4Design' && initValues.html" -->
            <div class="flow_view" v-if="mode == 's4Design' && initValues.html">
                <aopCommonDocPreview :data="initValues.html"></aopCommonDocPreview>
            </div>
            <div v-if="mode == 's4Design' && (initValues.html == '<p><br></p>' || (initValues.html == ''))" class="flow-default-wrap">
                <img src="@m/assets/images/empty-default.png" alt="" />
                <h3>暂无数据</h3>
            </div>
        </div>

      </div>

      <!-- 流程图 -->
      <div v-if="activeTabName == 'processDraw'">
          <!-- 直接展示流程图编辑器 -->
          <div class="flow-img-wrap">
            <flowWorks
                ref="flowWorksRef"
                :itemInfo="itemInfo"
                :editSt="editSt"
            ></flowWorks>
          </div>
      </div>
      <!-- 流程图 -->
    </div>
    <div
      class="fix-bottom"
      v-if="(mode == 's4Design' || mode == 's5Design') && activeTabName == 'processDesc' && editSt=='1'"
    >
    <!-- com-primary-large-btn -->
      <el-button
        size="small"
        type="primary"
        class="primaryBtn"
        @click="submit"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import pageQuillEditor from "@m/core/components/page_quill_editor/index";
import flowWorks from "../graphs/flowWorks";

export default {
  mixins: [mixin],
  components: {
    pageQuillEditor,
    flowWorks,
  },
  data() {
    return {
      //页签列表
      tabsList2: [
        { v: "流程图", k: "processDraw" },
        { v: "流程描述", k: "processDesc" },
      ],
      assetInfo: {},
      showTitle: false,
      initValues: {
        title: '',
        html: '',
        flowChartId:'',
      },
    };
  },
  props: {
    mode: {
      type: String,
      default: "s4Design",
    },
    itemInfo: {
      type: Object,
      default: () => {},
    },
    activeTabName: {
      type: String,
      default: () => "processDraw",
    },
    editSt: { // 0否 1是可编辑
        type: String,
        default: () => '1',
    },
  },
  inject: ["openTab"], // 用于打开窗口
  computed: {
    imageUploadConfigSetting() {
        return {
            fieldName: "uploadFile",
            server: this.rpc.s4design.newuploadAssetImageUrl(),
            maxFileSize: 10 * 1024 * 1024, // 10M
            meta: {
                funcId: this.itemInfo.functionId,
                jobNo: this.itemInfo.jobNo || '',
            },
            customInsert: (res, insertFn, file) => {
                const { body, header } = res;
                if (header.errorCode === "0") {
                    let url = body.uploadedFilePath || "";
                    url = this.$replaceUrl(url);
                    let fileName = file && file.name;
                    fileName = fileName || url.split("/").pop();
                    insertFn(url, fileName);
                } else {
                    this.$message.error(header.errorMsg);
                }
            },
        };
    },
  },
  mounted() {
    this.$nextTick(() => {
        this.dataInit();
    })
  },
  watch: {
    itemInfo() {
        this.$nextTick(() => {
            this.dataInit();
        })
    },
    activeTabName(val){
        if(val=='processDesc'){
            this.$nextTick(() => {
                this.dataInit();
            })
        }
    }
  },
  methods: {
     titleChangeEvent(v) {
        console.log("🚀 ~ file: index.vue:18 ~ titleChangeEvent ~ v:", v)
    },
    tabtopClick(e){
        if(this.editSt == '0'){
            this.$emit("tabClick", e);
        }
    },
    editorChangeEvent(v) {
        console.log("🚀 ~ file: index.vue:33 ~ editorChangeEvent ~ v:", v)
        this.initValues.html = v.origin
    },
    dataInit() {
        let query = this.$route.query
        if(query.tabKey) {
            this.activeTabName = query.tabKey
        }
        this.qryBizFlow();
    },
    /**
     * @description: 业务流程查询
     * @return {*}
     */
    async qryBizFlow() { // 初始化查询
      const { flowChartDesc, picAddr, flowChartId, flowChartNm } = await this.rpc.s4design.qryBizFunlowDetail({
        fnctId: this.itemInfo.functionId || '',
      });
      this.initValues = {
        html: flowChartDesc || '',
        flowChartId: flowChartId || '',
        title: flowChartNm || '',
      }
      console.log(this.initValues,'this.initValues')
    },

    /**
     * @description: 功能业务流程编辑
     * @return {*}
     */
    async updateBizFlowFn() { // 保存功能
      await this.rpc.s4design.commitFnctFlowChartBaseInfo({
        flowChartDesc: this.initValues.html,
        fnctId: this.itemInfo.functionId,
        flowChartId: this.initValues.flowChartId || '',
        flowChartNm: this.initValues.title || '',
        picAddr: '',
      });
      this.$notify({
        title: "成功",
        message: "修改成功",
        duration: 2000,
        type: "success",
      });
      // 再次查询
      this.qryBizFlow();
    },

    /**
     * @description: 按钮保存
     * @return {*}
     */
    submit() {
        this.updateBizFlowFn();
    },
    queryRecord() {
      let reviewType = this.mode == 'review' ? '23' : '42'
      this.assetInfo = {
        assetName, assetId, bizAppNo, bizAppName, taskId,
        reviewType: reviewType
      }
      this.$refs.baseInfoProblemRecords.showDialog();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/common.scss";
@import "@m/assets/css/public.scss";
.aop-tcb-layout-wrap{
    width: 100%;
    position: relative;
}
.noClick {
    pointer-events: none;
}
.editor-wrap {
  width: 100%;
  height: calc(100vh - 200px);
  overflow-y: auto;
}
.flow-img-wrap {
  padding: 4px 0;
  display: flex;
  .el-image {
    width: auto;
    max-width: 100%;
    display: block;
    transform:scale(0.5);
    transform-origin: top;
  }
}
.fix-bottom {
  position: fixed;
  z-index:99;
  top: 10px;
  right: 15px;
//   transform: translate(-50%, 0%);
  display: flex;
  justify-content: center;
  align-items: center;
  .primaryBtn{
    min-width: 55px;
    font-size: 12px;
    border-radius: 2px;
    cursor: pointer;
    padding: 0 8px;
    letter-spacing: 0;
    text-align: center;
    font-family: PingFangSC-Regular;
    height: 28px;
}
}
.line-gray {
  background: #f7f7f9;
  height: 12px;
}
.flow_view {
  margin-top: 24px;
}
.question_record {
  width: 98px;
  text-align: center;
  height: 32px;
  line-height: 32px;
  color: #fe4758;
  border: 1px solid rgba(254, 71, 88, 1);
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  .record_icon {
    width: 12px;
    height: 12px;
    margin-right: 7px;
  }


}
  .flow-default-wrap {
      padding: 126px 0 40px 0;
      img {
          display: block;
          margin: 0 auto;
          width: 150px;
      }
      h3 {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #999999;
          font-weight: 400;
          text-align: center;
          margin-bottom: 16px;
      }
      .btn-wrap {
          text-align: center;
          .el-button {
              height: 28px;
              border-radius: 2px;
              padding: 0 10px;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #ffffff;
              font-weight: 400;
              line-height: 20px;
          }
      }
  }
</style>
