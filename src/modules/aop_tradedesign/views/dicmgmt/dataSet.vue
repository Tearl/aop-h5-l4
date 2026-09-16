<template>
  <div class="d1_app_design_page_new">
    <div class="right_main">
      <!-- <div class="appInfo_operate_block">
        <div class="appInfo_operate_block_left">
          <h1>{{ titleInfo.title }}</h1>
          <span class="version_span">{{ titleInfo.version }}</span>
          <span class="status_span">{{ publishStatus[aaiStatus] }}</span>
          <span class="aailabel_span">{{ businessLabel }}</span>
        </div>
        <div class="appInfo_operate_block_right">
          <el-popover
            width="100px"
            trigger="hover"
            placement="bottom"
            popper-class="d1Design_operate_more"
          >
            <div class="operate_more_btn">
              <span @click="doOperate('check-pass')">验收通过</span>
              <span>历史版本选择</span>
            </div>
            <el-button slot="reference" size="small" type="primary"
              >更多操作</el-button
            >
          </el-popover>
        </div>
      </div> -->

      <div class="create-content-wrapper">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="数据集" name="0"> </el-tab-pane>
          <el-tab-pane label="服务集" name="1"> </el-tab-pane>
          <!-- <el-tab-pane label="价值流矩阵" name="2">
                  </el-tab-pane>
                  <el-tab-pane label="功能列表" name="3">
                  </el-tab-pane> -->
        </el-tabs>
      </div>

      <component v-bind:is="currentTabComponent"></component>
    </div>

    <!-- <div class="empty" v-else>
      <div class="empty_main">
        <img src="../assets/page.png" alt="" />
        <span class="desc">数据已进入登记状态，请前往M3管理查看</span>
      </div>
    </div> -->
  </div>
</template>

<script>
// import d1FuncList from './design/components/funcList.vue'
// import streamMatrix from '../components/streamMatrix.vue'
import dataSet from "./design/components/dataSet_new.vue";
import serviceSet from "./design/components/serviceSet_new.vue";
// import lookStreamMatrix from '../components/appInfo/streamMatrix.vue'
// import lookDataSet from '../M3/components/dataSet_new.vue'
// import lookServiceSet from '../M3/components/serviceSet_new.vue'
// import lookFuncList from '../M3/components/funcList.vue'
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],

  inject: ["action", "appInfo"],

  data() {
    return {
      currentIndex: "",
      activeName: "0",
      publishStatus: {
        "01": "生产中",
        "03": "待登记",
        11: "登记中",
        12: "已登记",
        13: "已驳回",
      },
      currentTabComponent: "",
      aaiStatus: "",
      titleInfo: {},
      businessLabel: "",
      labelMap: {
        0: "对公资产",
        1: "个人业务",
        2: "销售业务",
      },
    };
  },
  created() {
    this.currentTabComponent = this.mapCrrrentComponent(this.activeName);
    // this.titleInfo = {
    //     title: this.appInfo.aaiName,
    //     version: this.appInfo.aaiVersion,
    //     label: this.appInfo.aaiLableName,
    //     status: this.appInfo.aaiStatus
    // }
    this.queryAppInfos();
    this.queryAppYouxuanInfos();
  },
  watch: {
    "$route.query"(val) {
      console.log(val, "val00-----");
      this.$emit("tabChange", val.d1AppIndex);
    },
  },
  methods: {
    handleNodeClick(data, node) {},

    async queryAppYouxuanInfos() {
      // console.log("sds",this.rpc)
      // const { businessLabel } = await this.rpc.d1workspace.d1AppInfos({
      //   appCode: this.$route.query.aaiId,
      //   appVer: this.$route.query.aaiVersion,
      //   authorizationId: this.$route.query.isolateWorkspace,
      // });
      // console.log(this.labelMap[businessLabel], "businessLabel----");
      // this.businessLabel = this.labelMap[businessLabel];
    },

    async queryAppInfos() {
      // const { aaiStatus, aaiName, aaiVersion } =
      //   await this.rpc.d1workspace.d1AppInfo({
      //     appCode: this.appInfo.aaiId,
      //     appVer: this.appInfo.aaiVersion,
      //     authorizationId: this.appInfo.isolateWorkspace,
      //   });
      // this.aaiStatus = aaiStatus;
      // this.titleInfo = {
      //   title: aaiName,
      //   version: aaiVersion,
      //   status: aaiStatus,
      // };
    },

    tabClick() {
      this.currentTabComponent = this.mapCrrrentComponent(this.activeName);
    },
    mapCrrrentComponent(index) {
      // if(this.action == 'app-look') {
      //     switch(index) {
      //         case '2': return lookStreamMatrix
      //         case '0': return lookDataSet
      //         case '1': return lookServiceSet
      //         case '3': return lookFuncList
      //     }
      // } else {
      switch (index) {
        // case '2': return streamMatrix
        case "0":
          return dataSet;
        case "1":
          return serviceSet;
        // case '3': return d1FuncList
      }
      // }
    },
    doOperate(operate) {
      switch (operate) {
        case "app-info":
          this.$router.push({
            path: "/aop_enddesign/d1interation/applicateInfo",
            query: {
              aaiId: this.appInfo.aaiId,
              aaiVersion: this.appInfo.aaiVersion,
              isolateWorkspace: this.appInfo.isolateWorkspace,
            },
          });
          break;
        case "check-pass":
          this.$confirm("确定验收通过当前应用吗？", "温馨提示").then((res) => {
            this.rpc.d1workspace
              .d1AppSubmitCheck({
                aaiId: this.appInfo.aaiId,
                aaiVersion: this.appInfo.aaiVersion,
                isolateWorkspace: this.appInfo.isolateWorkspace,
              })
              .then((res) => {
                this.$notify({
                  title: "成功",
                  message: "验收通过",
                  duration: 2000,
                  type: "success",
                });
                this.$router.replace({
                  path: "/aop_enddesign/d1interation/detail",
                  query: { ...this.$route.query, d1AppIndex: "2" },
                });
              });
          });
          break;
      }
    },
  },
};
</script>
<style lang="scss">
.d1Design_operate_more {
  width: 100px;
  background: #fff;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);

  &.el-tooltip__popper.is-light {
    border: none;
  }
  .operate_more_btn {
    // height: 110px;
    span {
      display: block;
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      cursor: pointer;

      &:hover {
        background: #e7f1ff;
        color: #3489fe;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.d1_app_design_page_new {
  margin: 12px;
  min-height: calc(100vh - 179px);

  .right_main {
    .appInfo_operate_block {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 24px;
      background: #fff;
      margin-bottom: 1px;
      height: 48px;

      .appInfo_operate_block_left {
        display: flex;
        align-items: center;

        h1 {
          font-family: PingFangSC-Semibold;
          font-size: 16px;
          color: #000000;
          letter-spacing: 0;
          margin-right: 4px;
        }
        .version_span {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #999999;
          margin-right: 12px;
        }
        .status_span {
          background: #fff4e5;
          border: 0.5px solid rgba(255, 145, 4, 1);
          border-radius: 2px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #ff9104;
          padding: 0 4px;
        }
        .aailabel_span {
          color: #358aff;
          background: #e7f1ff;
          border: 0.5px solid rgba(53, 138, 255, 1);
          font-size: 12px;
          padding: 0 4px;
          margin-left: 8px;
        }
      }
    }

    .create-content-wrapper {
      background: #ffffff;
      margin-bottom: 12px;
      padding: 0 24px;

      /deep/.el-tabs__header {
        margin: 0;
      }
      /deep/.el-tabs__nav-wrap::after {
        height: 0px;
      }
      /deep/.el-tabs__item {
        height: 48px;
        line-height: 48px;
      }
    }
    /deep/.el-tabs__item {
      box-shadow: none !important;
    }
  }

  .empty {
    justify-content: center;
    display: flex;
    padding-top: 125px;
    background: #fff;
    height: calc(100vh - 180px);

    .empty_main {
      width: 340px;
      text-align: center;
      img {
        width: 200px;
        height: 130px;
      }
      .desc {
        display: block;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #999999;
        margin-bottom: 32px;
      }
    }
  }
}
</style>