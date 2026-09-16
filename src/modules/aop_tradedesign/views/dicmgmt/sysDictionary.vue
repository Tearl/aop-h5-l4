<template>
  <div class="aop_tradedesign_page_sys_dictionary">
    <div class="sys_dic_sidebar">
      <div class="sidebar_header">
        <span class="sidebar_title">应用数据字典</span>
        <div class="select_box">
          <el-select
            v-model="bkId"
            class="filter_input"
            placeholder="所属用户"
            filterable
            @change="bankChange"
            size="small"
          >
            <el-option
              v-for="item in bankList"
              :label="item.bkNm"
              :key="item.bkId"
              :value="item.bkId"
            ></el-option>
          </el-select>
          <el-select
            v-model="sysId"
            class="filter_input"
            placeholder="所属应用"
            filterable
            @change="sysChange"
            size="small"
          >
            <el-option
              v-for="item in sysList"
              :label="item.arsName"
              :key="item.arsId"
              :value="item.arsId"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="sidebar_box">
        <el-menu>
          <el-menu-item
            v-for="(item, index) in aMenuList"
            :key="index"
            :index="index + 1"
            @click="menuClick(item.menuId)"
            :class="begins == item.menuId ? 'is_active' : ''"
          >
            <span slot="title">{{ item.menuName }}</span>
          </el-menu-item>
        </el-menu>
        <el-tree
          ref="aMenuRef"
          class="siderbar_menu"
          :class="currentKey === '' ? 'menu_current_none' : ''"
          :data="dictionaryList"
          :props="defaultProps"
          accordion
          node-key="menuId"
          @node-click="handleNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <!-- <i class="el-icon-folder-opened" v-if="node.level === 1"></i> -->
            <span class="tree_label">{{ node.label }}</span>
          </span>
        </el-tree>
        <div class="icon_box" v-show="iconShow">
          <img
            class="icon"
            :src="require('@m/assets/images/icon_loading.png')"
          />
        </div>
      </div>
    </div>
    <div class="content_wrapper">
      <ServiceTabs
        v-if="isTabsShow"
        class="content_wrapper_tabs"
        :tabsList="tabsList"
        :defaultActive="defaultActive"
        @tabClick="handleTabClick"
      >
      </ServiceTabs>
      <DictionaryList
        ref="dicListRef"
        class="content"
        v-if="defaultActive == 'd'"
        :bkId="bkId"
        :arsId="sysId"
        :begins="begins"
        pageType="sys"
        @getMenuList ="getMenuList"
        @tabsShow="tabsShow"
        @getList="contentSearch"
      ></DictionaryList>
      <DicStayApproveList
        ref="dicStayApproveList"
        v-if="defaultActive == 'l'"
        :bkId="bkId"
        :arsId="sysId"
        :begins="begins"
        @tabsShow="tabsShow"
        @getList="contentSearch"
      ></DicStayApproveList>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import DictionaryList from "./components/sys_dic";
import DicStayApproveList from "./components/dic_stay_approve";
import ServiceTabs from "@m/core/components/page_tabs";
export default {
  mixins: [mixin],
  components: {
    DicStayApproveList,
    ServiceTabs,
    DictionaryList,
  },
  data() {
    return {
      bankList: [],
      // 页签列表
      tabsList: [
        { v: "数据字典", k: "d" },
        { v: "待审批列表", k: "l" },
      ],
      defaultActive: "d",
      isTabsShow: true,
      bkId: "",
      sysList: [],
      aMenuList: [
        {
          menuName: "A~Z",
          menuId: "",
        },
        {
          menuName: "A",
          menuId: "A|a",
        },
        {
          menuName: "B",
          menuId: "B|b",
        },
        {
          menuName: "C",
          menuId: "C|c",
        },
        {
          menuName: "D",
          menuId: "D|d",
        },
        {
          menuName: "E",
          menuId: "E|e",
        },
        {
          menuName: "F",
          menuId: "F|f",
        },
        {
          menuName: "G",
          menuId: "G|g",
        },
        {
          menuName: "H",
          menuId: "H|h",
        },
        {
          menuName: "I",
          menuId: "I|i",
        },
        {
          menuName: "J",
          menuId: "J|j",
        },
        {
          menuName: "K",
          menuId: "K|k",
        },
        {
          menuName: "L",
          menuId: "L|l",
        },
        {
          menuName: "M",
          menuId: "M|m",
        },
        {
          menuName: "N",
          menuId: "N|n",
        },
        {
          menuName: "O",
          menuId: "O|o",
        },
        {
          menuName: "P",
          menuId: "P|p",
        },
        {
          menuName: "Q",
          menuId: "Q|q",
        },
        {
          menuName: "R",
          menuId: "R|r",
        },
        {
          menuName: "S",
          menuId: "S|s",
        },
        {
          menuName: "T",
          menuId: "T|t",
        },
        {
          menuName: "U",
          menuId: "U|u",
        },
        {
          menuName: "V",
          menuId: "V|v",
        },
        {
          menuName: "W",
          menuId: "W|w",
        },
        {
          menuName: "X",
          menuId: "X|x",
        },
        {
          menuName: "Y",
          menuId: "Y|y",
        },
        {
          menuName: "Z",
          menuId: "Z|z",
        },
      ],
      sysId: "",
      defaultProps: {
        label: "menuName",
        children: "list",
      },
      currentKey: "",
      begins: "",
      nodeTempSave: [],
      pager: { currentPage: 1, turnPageShowNum: 50, total: 0 },
      dictionaryList: [],
      timer: "",
      iconShow: false,
    };
  },
  methods: {
    init() {
      this.getBankList();
    },
    handleTabClick(e) {
      this.defaultActive = e;
      this.$nextTick(() => {
        this.sysChange()
      })
    },
    tabsShow(e) {
      this.isTabsShow = e;
    },
    sysChange(e) {
      this.begins = this.begins == "All" ? "" : this.begins;
      this.nodeTempSave = []
      this.getList();
    },
    menuClick(e) {
      console.log(e);
      this.begins = e == "All" ? "" : e;
      this.contentSearch();
      if (this.defaultActive == "d") {
        this.$nextTick(() => {
          this.$refs.dicListRef.toGetList();
        });
      } else {
        this.$nextTick(() => {
          this.$refs.dicStayApproveList.toGetList();
        });
      }
    },
    contentSearch() {
      this.nodeTempSave = this.nodeTempSave.filter((item) => {
        return item.id !== this.begins;
      });
      this.getList();
    },
    getMenuList(){
      this.getList();
    },
    async getList() {
      //检测是否有存储的数据
      let lastData = this.nodeTempSave.filter(
        (item) => item.id === this.begins && item.bkId == this.bkId
      )[0];
      const params = {
        sysId: this.sysId,
        begins: this.begins == "All" ? "" : this.begins,
        bkId: this.bkId,
        currentPage: lastData && this.iconShow
          ? lastData.currentPage + 1
          : this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      let api =
        this.defaultActive == "d" ? "getSysDicList" : "getStandardDicList";
      const res = await this.rpc.systemmgmt[api](params);
      let data = []
      if (this.defaultActive == "d") {
        data = res.dictionariesInfoBoList.map((item) => {
          item.menuName = item.dictryNm;
          item.menuId = item.dictryId;
          return item;
        });
      } else {
        data = res.standardFlowList.map((item) => {
          item.menuName = item.dictryNm;
          item.menuId = item.dictryId;
          return item;
        });
      }

      this.pager.total = res.turnPageTotalNum * 1;
      //缓存数据
      let asData = [];
      if (this.pager.total > 50) {
        asData = lastData ? lastData.data.concat(data) : data;
      } else {
        asData = data;
      }
      const saveData = {
        id: this.begins,
        bkId: this.bkId,
        data: asData,
        currentPage: params.currentPage,
        total: this.pager.total,
      };
      this.nodeTempSave = this.nodeTempSave.filter(
        (item) => item.id !== saveData.id
      );
      this.nodeTempSave.push(saveData);
      this.dictionaryList = [];
      this.dictionaryList = JSON.parse(JSON.stringify(asData));
      this.iconShow = false;
    },
    //菜单点击
    handleNodeClick(e) {
      this.currentKey = e.menuId;
      if (this.defaultActive == "d") {
        this.$nextTick(() => {
          this.$refs.dicListRef.toDicView(e.menuId);
        });
      } else {
        this.$nextTick(() => {
          this.$refs.dicStayApproveList.toDicView(e.menuId);
        });
      }
    },
    async getBankList() {
      const res = await this.rpc.public.getBankList();
      this.bankList = res.bkList;
      this.bkId = res.bkList[0].bkId
      this.bankChange(this.bkId)
    },
    async bankChange(e) {
      const res = await this.rpc.public.getServiceSysList({
        allShowStatus: "0",
        bkId: this.bkId,
      });
      this.sysList = res.sysList;
      this.sysId = res.sysList[0].arsId
      this.getList();
    },
    //更新节点数据
    async updateKeyChildren(e) {
      const data = this.nodeTempSave.filter((item) => item.id === e)[0];
      if (data.total > data.data.length) {
        // if(data.currentPage == 2) return
        this.iconShow = true;
        this.getList();
      }
    },
    //获取位置
    getLocation() {
      let b = document.querySelector(".siderbar_menu");
      console.log(b.scrollTop, this.begins);
      const data = this.nodeTempSave.filter(
        (item) => item.id === this.begins
      )[0];
      if (b.scrollTop >= 1599.1 * data.currentPage) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.updateKeyChildren(this.begins);
        }, 500);
      }
    },
  },
  created() {
    this.init();
  },
  mounted() {
    document
      .querySelector(".siderbar_menu")
      .addEventListener("scroll", this.getLocation);
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_page_sys_dictionary {
  .sys_dic_sidebar {
    position: fixed;
    left: 0;
    top: 122px;
    bottom: 0;
    // height: 100%;
    width: 300px;
    // padding: 16px;
    // padding-right: 0;
    margin-left: 16px;
    margin-bottom: 16px;
    overflow: auto;
    background: $base_white;
    z-index: 999;
    .sidebar_header {
      background: #ddd;
      .select_box {
        display: flex;
      }
    }
    .sidebar_title {
      padding-left: 19px;
      background: #ddd;
      display: inline-block;
      width: 100%;
      font-size: 16px;
      color: #131313;
      font-weight: $font_weight_600;
      height: 46px;
      line-height: 46px;
    }
    .filter_input {
      margin: 10px 6px;
    }
  }
  .content_wrapper {
    padding: 16px;
    padding-left: 332px;
    .content_wrapper_tabs {
      // padding-left: 316px;
      // @include fixed_common;
      // top: 104.5px;
      // padding: 18px 0 0;
      // width: 100%;
    }
    .content {
      // margin-top: 50px;
    }
  }
  .sidebar_box {
    position: relative;
    height: 83%;
  }
  .el-menu {
    float: left;
    border-right: 0;
    height: 100%;
    padding-top: 2px;
    // background: #ddd;
    ::v-deep .is-active {
      color: #303133;
    }
    ::v-deep .el-menu-item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 3.7%;
      line-height: 3.7%;
      font-size: 14px;
      letter-spacing: 0;
      width: 37px;
      padding-left: 0px !important;
      padding-right: 0px;
      font-weight: 600;
    }
    .is_active {
      color: $base_white;
      background-color: $theme_color;
    }
  }
  .icon_box {
    position: absolute;
    bottom: 0;
    left: 130px;
    background: #fff;
    z-index: 999;
    .icon {
      width: 20px;
      height: 20px;
      vertical-align: sub;
    }
  }
  .siderbar_menu {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    /deep/ .el-tree-node {
      padding: 4px 0;
      &:focus {
        > .el-tree-node__content {
          background-color: #f0fbff;
        }
      }
    }
    /deep/ .el-tree-node.is-current {
      > .el-tree-node__content {
        background-color: #f0fbff;
      }
    }
    /deep/ .el-tree-node__content {
      height: 35px;
      position: relative;
      &:focus {
        background-color: #f0fbff;
      }
      &:active {
        background-color: #f0fbff;
      }
      &:visited {
        background-color: #f0fbff;
      }
      &:hover {
        background-color: #f0fbff;
        .tree_operation {
          display: block;
        }
      }
    }
    /deep/ .el-tree-node__children .el-tree-node__expand-icon::before {
      content: "";
    }
    .tree_operation {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      z-index: 999;
      display: none;
      > i {
        margin: 8px 4px;
      }
    }
    .tree_label {
      display: inline-block;
    }
  }
  .menu_current_none ::v-deep.el-tree-node.is-current > .el-tree-node__content {
    background-color: $base_white;
  }
}
</style>