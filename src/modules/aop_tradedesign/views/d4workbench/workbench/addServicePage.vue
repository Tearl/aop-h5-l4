<template>
  <div class="add_service_page">
    <!-- <PageHeader
      ref="headerRef"
      :breadcrumbs="breadcrumbs"
      @labelClick="labelClick"
    ></PageHeader> -->
    <!-- 页签 -->
    <div class="application_detail_tabs">
      <div class="application_detail_tabs_label_area">
        <img
          @click="goBack"
          :src="require('@m/assets/images/icon_asset_back.png')"
          alt=""
          class="icon_back"
        />
        <h1>添加服务</h1>
      </div>
    </div>
    <div class="add_service_page_tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按数据集" name="first"></el-tab-pane>
        <el-tab-pane label="按服务" name="second"></el-tab-pane>
      </el-tabs>
    </div>
    <DatasetList
      ref="datasetListRef"
      v-if="activeName == 'first'"
      @goBack="goBack"
    ></DatasetList>

    <ServiceList
      ref="serviceListRef"
      v-if="activeName == 'second'"
      @goBack="goBack"
    ></ServiceList>
    <AddService ref="addServiceRef"></AddService>
  </div>
</template>

<script>
import DatasetList from "./components/workbench_design/add_servicePage/dataset";
import ServiceList from "./components/workbench_design/add_servicePage/service";
// import PageHeader from "@m/core/components/page_header"; // 面包屑
import mixin from "@m/core/mixin";
import { getSessionStorage } from "@m/utils/localStorage.js";
export default {
  components: {
    DatasetList,
    ServiceList,
    // PageHeader,
  },
  mixins: [mixin],
  data() {
    return {
      activeName: "first",
      //   breadcrumbs: [
      //     {
      //       label: "添加服务",
      //       operate: "home",
      //     },
      //     {
      //       label: "功能列表",
      //     },
      //   ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleClick() {
      // console.log(this.activeName, "22222this.activeName");
    },
    goBack() {
      this.$router.push(getSessionStorage("designRouter"))
    },
  },
};
</script>

<style lang="scss">
@import "@m/assets/css/mixin.scss";
.add_service_page {
  padding: 16px;
  .application_detail_tabs {
    background: #ffffff;
    margin: 0px;
    display: flex;
    position: relative;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 18px;
    box-shadow: 0 1px 10px 0 #E7E7E7;
    margin-bottom: 12px;

    .application_detail_tabs_label_area {
      display: flex;
      align-items: center;
      img {
        width: 28px;
        height: 28px;
        margin-right: 10px;
      }
      .icon_back {
        width: 16px;
        height: 16px;
        margin-right: 12px;
        cursor: pointer;
      }
      h1 {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #000000;
        letter-spacing: 0;
      }
    }
  }
  .add_service_page_tabs {
    background: #ffffff;
    margin-bottom: 12px;
    padding: 0 24px;

    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__nav-wrap::after {
      height: 0px;
    }
    .el-tabs__item {
      height: 48px;
      line-height: 48px;
    }
  }
  .el-tabs__item {
    box-shadow: none !important;
  }
}
</style>