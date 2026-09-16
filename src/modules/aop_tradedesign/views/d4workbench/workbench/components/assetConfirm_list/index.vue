<template>
  <div class="aop_tradedesign_asset_confirm_list_page">
    <div class="sideBar">
      <SideBar :statusList="statusList" @tabChange="tabChange"></SideBar>
    </div>
    <div class="content">
      <div class="search">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="资产名称：">
            <el-input
              size="small"
              class="input"
              v-model="form.content"
              clearable
            >
              <span slot="suffix" class="text" @click.stop="openDialog"
                >添加资产</span
              >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="tabs_content">
        <ServiceTabs
          class="content_wrapper_tabs"
          :tabsList="tabsList"
          :defaultActive="defaultActive"
          @tabClick="handleTabClick"
        ></ServiceTabs>
        <div class="dataset" v-show="defaultActive == 'd'">
          <!-- <div>数据集列表</div> -->
          <DatasetList ref="datasetListRef"></DatasetList>
        </div>
        <div class="service" v-show="defaultActive == 's'">
          <!-- <div>服务列表</div> -->
          <ServiceList ref="serviceTabsRef"></ServiceList>
        </div>
      </div>
      <PageFooter>
        <div slot="box">
          <el-button type="primary" @click="exportOrder">导 出</el-button>
          <el-button type="primary" @click="sendOrders">派 单</el-button>
        </div>
      </PageFooter>
      <SelectAssetDialog
        ref="selectAssetDialogRef"
        @saveParams="saveParams"
      ></SelectAssetDialog>
      <SendOrderDialog ref="sendOrderDialogRef"></SendOrderDialog>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import SearchTop from "@m/core/components/page_search_top";
import SideBar from "./components/sideBar";
import ServiceList from "./serviceList";
import DatasetList from "./datasetList";
import ServiceTabs from "@m/core/components/page_tabs_workgate";
import PageFooter from "@m/core/components/page_footer";
import SelectAssetDialog from "./components/dialog/selectAssetDialog";
import SendOrderDialog from "./components/dialog/sendOrderDialog";
export default {
  mixins: [mixin],
  components: {
    SideBar,
    SearchTop,
    ServiceTabs,
    ServiceList,
    DatasetList,
    PageFooter,
    SelectAssetDialog,
    SendOrderDialog
  },
  data() {
    return {
      statusList: [
        //  设计状态：00-设计中、01-待评审、02-评审驳回、03-待登记、20-已登记
        {
          statusName: "我的待办",
          statusNumber: "0",
          status: "all",
          type: "all",
          id: "0",
        },
        {
          statusName: "待派单",
          statusNumber: "0",
          status: "00",
          type: "draft",
          id: "1",
        },
      ],
      // serviceForm: [
      //   {
      //     type: "input",
      //     model: "content",
      //     placeholder: "",
      //     labelText: "服务名称:",
      //     suffixName:"添加资产"
      //   },
      // ],
      // 搜索条件
      form: {
        content: "",
      },
      active: "all", // all-我的字典 01-草稿箱 02-评审箱 03-登记箱
      activeTabs: null, //  unaccept-待登记 accepted-已登记 unreview-待评审 review-已评审
      showSearch: true,
      checkedCount: "0",
      noCheckedCount: "0",
      noRegisterCount: "0",
      registerCount: "0",
      tabsList: [
        { v: "数据集", k: "d" },
        { v: "服务集", k: "s" },
      ],
      defaultActive: "d",
    };
  },
  methods: {
    init() {},
    async getCount() {
      const res = await this.rpc.dicmgmt.getDataSetCount();
      this.statusList[0].statusNumber = res.totalNum;
      this.statusList[1].statusNumber = res.designNum;
      this.statusList[2].statusNumber = res.reviewNum;
      this.statusList[3].statusNumber = res.registerNum;
    },
    search() {
      // this.$refs.dicListRef.getDicList();
    },
    tabChange(e) {
      this.reset();
      // this.$refs.dicListRef.reset()
      console.log("e", e, this.active);
      if (!e) {
        this.active = "all";
      } else {
        //当前点击页签判断
        this.active = e.status;
        this.activeTabs = e.type;
        if (e.status == "01") {
        }
      }
    },
    handleTabClick(e) {
      this.defaultActive = e;
      if (this.defaultActive == "s") {
      }
    },
    exportOrder() {},
    sendOrders() {
      this.$refs.sendOrderDialogRef.showDialog();
      // this.$router.back();
    },
    openDialog() {
      console.log("openDialog");
      this.$refs.selectAssetDialogRef.showDialog();
    },
    saveParams(data) {
      console.log(data, "选中的资产");
      let dataArr = JSON.parse(JSON.stringify(data));
      let tempString = "";
      dataArr.map((item) => [(tempString = `${tempString}${item.dictNo}，`)]);
      this.form.content = tempString;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_asset_confirm_list_page {
  display: flex;
  height: 100vh;
  .sideBar {
    height: 100vh;
  }
  .content_wrapper_tabs {
    margin: 16px 16px 0 16px;
  }
  .content {
    margin: 16px 16px 0 0;
    background: #fff;
    width: calc(100% - 200px);
    /deep/ .serivce_top_left {
      width: 100%;
    }
    .dataset {
      margin-top: 10px;
      padding: 16px;
    }
    .service {
      margin-top: 10px;
      padding: 16px;
    }
  }
  .search {
    padding: 16px 0px;
  }
  .el-form {
    ::v-deep .el-form-item {
      margin-bottom: 0;
      margin-right: 8px;
      .el-input {
        width: 120px;
        font-size: 14px;
        color: $reg_ft_color;
        &.input {
          width: 400px;
        }
      }
      .el-input--suffix .el-input__inner{
        padding-right: 62px;
      }
      .text {
        color: $theme_color;
        cursor: pointer;
      }
      .el-select {
        .el-input__inner {
          padding: 0 10px;
        }
        ::v-deep .el-input__suffix {
          right: 2px;
        }
      }
      .switch_content {
        padding: 0 10px;
        .switch_label {
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
