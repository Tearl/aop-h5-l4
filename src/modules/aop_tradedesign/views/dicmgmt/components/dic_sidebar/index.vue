<template>
  <div class="aop_tradedesign_comps_dicmgmt_dic_sidebar">
    <div class="dic_sidebar">
      <span class="sidebar_title">{{ sidebarTitle }}</span>
      <div class="sidebar_filter" v-show="apprType == 'dic' || apprType == 'detail'">
        <el-input
          v-model="content"
          class="filter_input"
          placeholder="搜索参数名称、中文名、英文名或描述"
          @keyup.enter.native="contentSearch"
        />
        <div class="sidebar_operation" v-if="type !== 'read' && apprType != 'detail'">
          <el-button type="primary" @click="dicAdd">{{
            "创建数据字典"
          }}</el-button>
        </div>
      </div>
      <div class="sidebar_filter" v-show="apprType == 'appr'">
        <el-input
          v-model="aplyBtchNo"
          class="filter_input"
          placeholder="搜索批次号"
          @keyup.enter.native="contentSearch"
        />
      </div>
      <div class="sidebar_box">
        <el-menu>
          <el-menu-item
            v-show="apprType == 'dic' || apprType == 'detail'"
            v-for="(item, index) in aMenuList"
            :key="index"
            :index="index + 1"
            @click="menuClick(item.menuId)"
            :class="begins == item.menuId ? 'is_active' : ''"
          >
            <span slot="title">{{ item.menuName }}</span>
          </el-menu-item>
          <el-menu-item
            index="1"
            class="is_active"
            v-show="apprType == 'appr'"
          >
            <span slot="title">#</span>
          </el-menu-item>
        </el-menu>
        <el-tree
          ref="aMenuRef"
          class="siderbar_menu"
          :class="currentKey === '' ? 'menu_current_none' : 'menu_is_current'"
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
  </div>
</template> 

<script>
import mixin from "@m/core/mixin";
export default {
  mixins: [mixin],
  components: {},
  props: {
    sysId: {
      type: String,
      default: () => "",
    },
    type: {
      type: String,
      default: () => "",
    },
    pageType: {
      type: String,
      default: () => "",
    },
    bkId: {
      type: String,
      default: () => "",
    },
    sidebarTitle: {
      type: String,
      default: () => "数据字典",
    },
  },
  data() {
    return {
      content: "",
      defaultProps: {
        label: "menuName",
        children: "list",
      },
      currentKey: "",
      aMenuList: [
        {
          menuName: "A~Z",
          menuId: "All",
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
      nodeTempSave: [],
      pager: { currentPage: 1, turnPageShowNum: 50, total: 0 },
      begins: "All",
      dictionaryList: [],
      timer: "",
      iconShow: false,
      apprType: "dic", //左侧树显示类型
      apiType: "",
      aplyBtchNo: "",
    };
  },
  methods: {
    init() {
      // this.getList();
      // this.getBatchList()
    },
    getData(res,lastData,params,type) {
      let resArr = type == "detail" ? "dictInfoList" 
      : type == "dicList" ? "dictionariesInfoBoList" 
      : "dictApplyInfoList"
      const data = res[resArr].map((item) => {
        item.menuName = !type ? item.aplyBtchNo : item.dictryNm;
        item.menuId = !type ? item.aplyBtchNo : item.dictryId;
        return item;
      });
      this.pager.total = res.turnPageTotalNum * 1;
      //缓存数据
      let asData = [];
      if (this.pager.total > 50) {
        asData = lastData ? lastData.data.concat(data) : data;
      } else {
        asData = data;
      }
      const saveData = {
        id: type ? this.begins : "#",
        bkId: this.bkId,
        data: asData,
        type: type,
        currentPage: params.currentPage,
        total: this.pager.total,
      };
      this.nodeTempSave = this.nodeTempSave.filter(
        (item) => item.id !== saveData.id
      );
      this.nodeTempSave.push(saveData);
      this.dictionaryList = JSON.parse(JSON.stringify(asData));
      this.iconShow = false;
    },
    async getList() {
      //检测是否有存储的数据
      let lastData = this.nodeTempSave.filter(
        (item) => item.id === this.begins && item.bkId == this.bkId && item.type == "dicList"
      )[0];
      this.dictionaryList = [];
      const params = {
        sysId: this.sysId,
        begins: this.begins == "All" ? "" : this.begins,
        content: this.content,
        bkId: this.bkId,
        currentPage:
          lastData && this.iconShow
            ? lastData.currentPage + 1
            : this.pager.currentPage,
        turnPageShowNum: this.pager.turnPageShowNum,
      };
      let api =
        this.pageType == "sys"
          ? "getSysDicList"
          : this.pageType == "standard"
          ? "getStandardDicList"
          : this.sysId
          ? "getSysDictionaryList"
          : "getDictionaryList";
      const res = await this.rpc.systemmgmt[api](params);
      this.getData(res,lastData,params,"dicList")
    },
    //查询审批详情左侧列表树
    async getApprList() {
      //检测是否有存储的数据
      let lastData = this.nodeTempSave.filter(
        (item) => item.id === this.begins && item.bkId == this.bkId
      )[0];
      this.dictionaryList = [];
      const params = {
        currentPage: this.pager.currentPage + "",
        turnPageShowNum: this.pager.turnPageShowNum,
        content: this.content,
        preciseQuery: "0",
        dictryKeyWord: "",
        paraType: "",
        paraGateg: "",
        sysId: this.arsId,
        begins: this.begins,
        bkId: this.bkId,
        aplyBtchNo: this.aplyBtchNo,
        aprvlStusCd: this.apiType == "noApproval" ? "0" : "1"
      }
      const res = await this.rpc.systemmgmt.getBatchDetailList(params);
      this.getData(res,lastData,params,"detail")
    },
    // 获取批次列表数据
    async getBatchList() {
      let lastData = this.nodeTempSave.filter(
        (item) => item.id === this.begins && item.bkId == this.bkId
      )[0];
      this.dictionaryList = [];
      const params = {
        aplyBtchNo: this.aplyBtchNo,
        sbmtPrsnNm: "",
        sbmtStrtTm: "",
        sbmtEndTm: "",
      };
      const api =
        this.apiType === "noApproval" ? "getPendApprList" : "getAppredList";
      const res = await this.rpc.public[api](params);
      this.getData(res,lastData,params,"")
    },
    contentSearch() {
      this.nodeTempSave = this.nodeTempSave.filter((item) => {
        return item.id !== this.begins;
      });
      if(this.apprType == "appr") {
        this.getBatchList()
      }else if(this.apprType == "detail")  {
        this.getApprList()
      } else {
        this.getList();
      }
    },
    menuClick(e) {
      console.log(e,this.apprType);
      this.begins = e;
      this.contentSearch();
      if(this.apprType == "detail" ) {
        this.$emit("toApprList",e)
      }else {
        this.$emit("toGetList", e);
      }
    },
    //菜单点击
    handleNodeClick(e) {
      console.log(e,'eeee')
      this.currentKey = e.menuId;
      if(this.apprType == 'dic') {
        this.$emit("toDicView", e.menuId);
      } else if (this.apprType == 'detail'){
        this.$emit("toApprDetail", e);
      }
      else{
        this.$emit("toApprView", e);
      }
      this.$emit("getDataDictionProd", { v: "公共数据字典详情", k: "dd", closable: true },e.dictryId)
    },
    dicAdd() {
      this.$emit("dicAdd");
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
      if (b.scrollTop >= 1638.4 * data.currentPage) {
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
  watch: {
    // bkId(n, o) {
    //   this.init();
    // },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_dicmgmt_dic_sidebar {
  position: absolute;
  height: 100%;
  left: 0;
  top: 58px;
  bottom: 0;
  width: 316px;
  padding: 16px;
  padding-right: 0;
  .dic_sidebar {
    padding-right: 0;
    width: 100%;
    height: calc(100% - 178px);
    // background: #ddd;
    .sidebar_filter {
      height: 39px;
      background-color: #ddd;
      display: flex;
      justify-content: space-between;
      padding: 0px 5px;
      .filter_input {
        width: 100%;
        /deep/ .el-input__inner {
          font-size: 12px;
          padding-left: 16px;
          border-radius: 2px;
          height: 32px;
        }
      }
      .sidebar_operation {
        font-size: 14px;
        ::v-deep .el-button {
          @include small_button_common;
        }
      }
    }
    .sidebar_title {
      padding-left: 16px;
      background: #ddd;
      display: inline-block;
      width: 100%;
      font-size: 16px;
      color: #131313;
      font-weight: $font_weight_600;
      height: 34px;
      line-height: 34px;
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
    .menu_current_none
      ::v-deep.el-tree-node.is-current
      > .el-tree-node__content {
      background-color: $base_white;
    }
    .menu_is_current ::v-deep.el-tree-node.is-current > .el-tree-node__content {
      color: $theme_color;
      background-color: #eaf1ff;
      font-weight: $font_weight_600;
    }
  }
  .sidebar_box {
    position: relative;
    height: 100%;
    min-height: 500px;
    max-height: 500px;
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
}
</style>

