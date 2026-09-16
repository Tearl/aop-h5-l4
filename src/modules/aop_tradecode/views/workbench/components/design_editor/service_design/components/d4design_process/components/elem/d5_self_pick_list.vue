<template>
  <div class="aop_tradecode_comps_design_elem_d5_self_pick_list">
    <!-- <div class="select_bar_container">
      <div class="elem_select flex">
        <el-select
          clearable
          v-model="searchForm.relySys"
          placeholder="所属系统"
          size="mini"
          filterable
          disabled="true"
          @change="sysOptionsChange">
          <el-option
            v-for="item in sysOptions"
            :key="item.arsId"
            :label="item.arsName"
            :value="item.arsId">
          </el-option>
        </el-select>
        <el-input
          v-model="searchForm.svcNm"
          clearable
          placeholder="输入名称或编码"
          size="mini"
          class="elem_select_right"
          @keyup.enter.native="getAssociatedSelfServiceList()"
          @input="inputSearch"
        >
          <i class="el-icon-search" slot="prefix" @click="search"> </i>
        </el-input>
      </div>
    </div> -->
    <ul class="api_info_list">
      <li v-for="(item, index) in apiInfoList" :key="item" class="api_info_list_item" :class="{changeColor:item.changeTp == '1',upgradesColor:item.changeTp == '2'}">
        <div class="left" @mousedown.stop="pickOne(item, $event)">
          <div class="icon">
            <span
              class="center"
              :class="{
                yellow: item.apiServiceType == 'D5直连服务',
                origin: item.apiServiceType == 'D5自有服务',
              }"
            ></span>
          </div>
          <!-- <div
            v-if="!item.isShow"
            class="service_name bold_text"
            @mouseenter="(e) => isShowToltip(e, index)"
            @mouseout="hideTip(index)"
          >{{ item.apiName }}</div> -->
          <div
            class="service_name bold_text"
            @mouseenter="(e) => isShowToltip(e, index)"
            @mouseout="hideTip(index)"
          >{{ item.apiName }}</div>
          <!-- 最佳省略位置 -->
          <el-tooltip
            class="item"
            effect="dark"
            :content="item.apiName"
            placement="top"
            v-if="item.apiName.length>10"
          >
            <div class="service_name bold_text">...</div>
          </el-tooltip>
          <span class="tag blue" v-if="item.apiServiceType == 'D5自有服务'"
            >自有</span
          >
          <span class="tag origin" v-if="item.apiServiceType == 'D5直连服务'"
            >直连</span
          >
          <!-- <span class="tag red" v-if="item.addState == '0'">新增</span> -->
        </div>
        <div v-if="!isRead" class="right">
          <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <i class="el-icon-edit-outline" @click.stop="edit(item)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <i class="el-icon-delete-solid" @click.stop="del(item)"></i>
          </el-tooltip> -->
          <!-- <i class="el-icon-edit-outline" v-if="item.addState == '0'" @click.stop="edit(item)"></i> -->
          <!-- <i class="el-icon-delete-solid" @click.stop="del(item)"></i> -->
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <i class="el-icon-delete-solid" @click.stop="del(item)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="item.changeTp == '1'? '服务变动':'服务升级'" placement="top" v-if="item.changeTp == '1' || item.changeTp == '2'">
            <i class="el-icon-warning" @click.stop="servChange(item)"></i>
          </el-tooltip>
        </div>
      </li>
    </ul>
    <!-- <el-tree
      ref="aMenuRef"
      class="siderbar_menu"
      :class="currentKey === '' ? 'menu_current_none' : ''"
      :data="aMenuList"
      :props="defaultProps"
      :default-expanded-keys="defaultExpanded"
      :current-node-key="currentKey"
      :load="loadNode"
      :filter-node-method="filterNode"
      lazy
      accordion
      node-key="menuId"
    >
      <div class="custom-tree-node flex_container" slot-scope="{ node, data }">
        <div class="left" @mousedown.stop="pickOne(data, $event)">
          <img
            src="@m/assets/images/serv_icon.png"
            class="flex_container_icon"
          />
          <span class="tree_label">{{ node.label }}</span>
        </div>
        <div class="right">
          <span class="list_item_tag released" v-if="data.addState == '0'"
            >新增</span
          >
          <span
            class="list_item_tag new"
            v-if="data.apiServiceType == 'D5自有服务'"
            >自有</span
          >
          <span
            class="list_item_tag outside"
            v-if="data.apiServiceType == 'D5直连服务'"
            >直连</span
          >
          <span class="design" @click.stop="del(data)">删除</span>
        </div>
      </div>
    </el-tree> -->
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import { unduplicated } from "@m/utils/array";
import { debounce } from "@m/utils/debounce.js";
import filters from "@m/utils/filters";
export default {
  mixins: [mixin],
  components:{

  },
  props: {
    currentServObj: {
      type: Object,
      default: () => ({}),
    },
    currentD4bObj: {
      type: Object,
      default: () => ({}),
    },
    // 阅读模式
    isRead: {
      type: Boolean,
      default: () => false,
    },
    currentInterfaceObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      searchForm: {
        svcNm: "",
        system: "",
        relySys: "", // 系统ID
        groupId: "",
      },
      apiGroupOptions: [],
      aMenuList: [],
      currentKey: "",
      defaultExpanded: ["0"], // 树形展示序号组,
      defaultProps: {
        label: "menuName",
        children: "children",
        isLeaf: "leaf",
      },
      sysOptions: [],
      transId: "",
      apiInfoList: [],
    };
  },
  methods: {
    /**
     * @description:
     * @param {*} el dom元素
     * @return {*}
     */
    textRange (el) {
      const textContent = el
      const targetW = textContent.getBoundingClientRect().width
      const range = document.createRange()
      range.setStart(textContent, 0)
      range.setEnd(textContent, textContent.childNodes.length)
      const rangeWidth = range.getBoundingClientRect().width
      return rangeWidth > targetW
    },
    isShowToltip (e, index) {
      const bool = this.textRange(e.target)
      this.apiInfoList[index].isShow = bool
    },
    hideTip (index) {
      this.apiInfoList[index].isShow = false
    },
    //获取子级
    async loadNode(node, resolve) {
      console.log("loadNode", node);
      this.resolve = resolve;
      if (node.level === 0) {
        return resolve([]);
      }
      if (node.level === 1) {
        const params = {
          grpNo: node.data.sgId,
          sysId: this.searchForm.relySys,
          svcTpCd: "D5自有服务",
        };
        const res = await this.rpc.publicEditor.getGateServiceList(params);
        console.log("getGateServiceList", res);
        const data = res.gateServiceList.map((item) => {
          item.menuName = item.svcNm;
          item.menuId = item.svcId;
          return item;
        });
        setTimeout(() => {
          resolve(data);
          this.handleNodeClick(node.data);
        }, 100);
      }
      if (node.level > 1) {
        return resolve([]);
      }
    },
    //菜单点击
    handleNodeClick(e) {
      console.log("handleNodeClick", e);
      this.currentKey = e.sgId;
      if (!e.parent) {
        this.showServInfo(e);
      }
    },
    // 防抖搜索触发
    inputSearch() {
      debounce(() => {
        this.search();
      }, 800);
    },
    search() {
      this.$refs.aMenuRef.filter(this.searchForm);
    },
    filterNode(searchForm, data) {
      console.log("filterNode", searchForm, data);
      return (
        data.parent ||
        data.svcNm.indexOf(searchForm.svcNm) > -1 ||
        data.svcNo.indexOf(searchForm.svcNm) > -1
      );
    },
    // 获取服务系统列表
    async getSysList(serviceType) {
      const params = {
        allShowStatus: "0",
        bkId: this.currentServObj.bkId,
        serviceTypeNm: serviceType,
      };
      const res = await this.rpc.publicEditor.getServiceSysList(params);
      this.sysOptions = res.sysList;
      this.searchForm.relySys = res.sysList.find(
        (item) => item.arsId == this.currentServObj.relySys
      ).arsId;
      console.log(
        "相同的系统",
        this.searchForm.relySys,
        this.currentServObj.relySys
      );
      this.getServGrpgList(this.searchForm.relySys);
    },
    //鼠标按下的时候触发
    pickOne(i, ev) {
      console.log("d5_self_pick_list-pickOne", i, ev);
      if (!i.parent) {
        this.$parent.pickOne(i, ev);
      }
    },
    sysOptionsChange(arsId) {
      console.log("sysOptionsChange", arsId);
      this.getServGrpgList(arsId);
      // this.search()
    },
    // 获取服务分组列表
    async getServGrpgList(arsId) {
      if (!arsId) return;
      const params = {
        arsId,
        serviceType: "D5自有服务",
      };
      const res = await this.rpc.publicEditor.getReleaseApiGroupList(params);
      this.apiGroupOptions = res.apiGroupList;
      this.aMenuList = res.apiGroupList.map((item) => {
        item.menuName = item.sgName;
        item.menuId = item.sgId;
        item.parent = true; // 标签是父级
        item.children = [];
        return item;
      });
      if (this.aMenuList.length > 0) {
        this.defaultExpanded = [this.aMenuList[0].menuId];
      }
    },
    async getGateServiceList() {
      const params = {
        // grpNo: "",
        sysId: this.currentServObj.bkId,
        svcTpCd: "D5自有服务",
      };
      const res = await this.rpc.publicEditor.getGateServiceList(params);
      console.log("getGateServiceList", res);
      // this.apiGroupOptions = res.apiGroupList;
    },
    async showServInfo(e) {
      this.$emit("showServInfo", e);
    },
    async getAssociatedSelfServiceList() {
      // if (!this.currentD4bObj.svcId) return
      console.log("=====>",this.currentInterfaceObj)
      const params = {
        apiId: this.currentInterfaceObj && this.currentInterfaceObj.svcId,
        content: this.searchForm.svcNm,
        turnPageShowNum: 1000
      };
      const paramsChange = {
        interfaceId: this.currentInterfaceObj && this.currentInterfaceObj.svcId,
        turnPageShowNum: 1000
      }
      const resChangeServ = await this.rpc.changeList.queryServiceChangeList(paramsChange);
      console.log("res1",resChangeServ)
      const res = await this.rpc.d4.getAssociatedSelfServiceList(params);
      this.apiInfoList = res.apiInfoList.map((item) => {
        item.menuName = item.apiName;
        item.menuId = item.apiId;
        item.leaf = true;
        item.svcId = item.apiId;
        item.svcNm = item.apiName;
        item.svcNo = item.apiCode;
        item.svcTpCd = item.apiServiceType;
        item.sysNm = item.relySysName;
        let sameItem = resChangeServ?.serviceChangeList.length> 0 && resChangeServ?.serviceChangeList.find(someItem =>someItem.apiId == item.apiId)
        if(sameItem){
          item.changeTp = sameItem.changeTp
          item.serviceChangeId = sameItem.serviceChangeId
        }else {
          item.changeTp = ""
          item.serviceChangeId = ""
        }
        item.isShow = false
        return item
      });
    },
    async del(data) {
      this.$confirm("是否删除该服务，服务名称为" + data.apiName)
        .then(async () => {
          const params = {
            apiId: data.apiId,
            transId: this.currentInterfaceObj.svcId,
          };
          const res = await this.rpc.newEditor.delectTransL5ServiceRel(params);
          this.$notify({
            title: "成功",
            message: "删除成功！",
            duration: 2000,
            type: "success",
          });
          if(["1","2"].includes(data.changeTp)) this.$emit("delServ")
          else this.getAssociatedSelfServiceList();
        })
        .catch(() => {});
      console.log(data, "删除");
    },
    edit(data){
      this.$refs.editServiceRef.showDialog(data)
    },
    confirmService(){
      this.getAssociatedSelfServiceList();
    },
    init() {
      this.transId = this.$route.query.transId || this.$route.query.apiId;
    },
    initData(){
      this.getAssociatedSelfServiceList();
    },
    servChange(data) {
      this.$emit("servChange",data)
    }
  },
  created() {
    this.init();
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_design_elem_d5_self_pick_list {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  .select_bar_container {
    padding: 8px 10px 0;
  }
  .elem_search,
  .elem_select {
    overflow: hidden;
    margin-bottom: 8px;
    .elem_select_right {
      margin-left: 6px;
      ::v-deep .el-input__inner {
        padding: 0 20px;
      }
      .el-icon-search {
        position: relative;
        top: 5px;
      }
    }
    &.flex {
      display: flex;
      justify-content: center;
      align-items: center;
      .add_icon {
        margin-left: 10px;
        cursor: pointer;
        &.hidden {
          visibility: hidden;
        }
      }
    }
    ::v-deep .el-select {
      width: 100%;
    }
  }
  .elem_search_sel {
    float: left;
    ::v-deep .el-input__inner {
      width: 100%;
      height: 28px;
    }
    ::v-deep .el-input__icon {
      line-height: 28px !important;
    }
    .el-icon-search {
      line-height: 28px;
    }
  }
  .el-menu {
    overflow-y: auto;
    border: 0px;
    ::v-deep .el-submenu__title {
      height: 40px;
      line-height: 40px;
      font-weight: $font_weight_600;
      font-family: PingFangSC-Regular;
      font-size: 12px;
    }
    .el_menu_img {
      width: 9.95px;
      height: 9.98px;
      margin-right: 20px;
      margin-top: 4px;
    }
    ::v-deep .el-submenu__title:hover {
      background-color: #fff;
    }
    ::v-deep .el-menu-item-group__title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #333333;
      letter-spacing: 0;
      cursor: pointer;
      user-select: none;
    }
  }
  .api_info_list {
    .api_info_list_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 34px;
      padding: 0 16px;
      margin-bottom: 5px;
      &:hover {
        background: #f7f7f9;
        .right {
          .el-icon-delete-solid {
            visibility: visible;
          }
          .el-icon-edit-outline{
            visibility: visible;
          }
        }
      }
      .left {
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
        .icon {
          width: 16px;
          height: 16px;
          border: 1px solid #e7e7ee;
          border-radius: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          .center {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 2px;
            &.blue {
              background: $theme_color;
            }
            &.origin {
              background: #FF9104;
            }
            &.yellow {
              background: #f7ecc2;
            }
          }
        }
        .service_name {
          margin-left: 4px;
          overflow: hidden;
        //   text-overflow: ellipsis;
          white-space: nowrap;
          // max-width: 120px;
          max-width: 110px;
        }
        .tag {
          width: 28px;
          height: 16px;
          line-height: 14px;
          text-align: center;
          border-radius: 2px;
          margin-left: 4px;
          &.blue {
            color: $theme_color;
            border: 1px solid $theme_color;
          }
          &.red {
            color: #fe4758;
            border: 1px solid #fe4758;
          }
          &.origin {
            color: #ff9104;
            border: 1px solid #ff9104;
          }
          &.yellow {
            color: #f7ecc2;
            border: 1px solid #f7ecc2;
          }
        }
      }
      .right {
        .el-icon-delete-solid {
          font-size: 14px;
          color: $theme_color;
          cursor: pointer;
          visibility: hidden;
        }
        .el-icon-edit-outline {
          font-size: 14px;
          color: $theme_color;
          cursor: pointer;
          visibility: hidden;
        }
        .el-icon-warning{
          font-size: 14px;
          color: #f5a300;
          cursor: pointer;
        }
      }
      &.changeColor{
        background:#f9d9dd
      }
      &.upgradesColor{
        background: #fef0de;
      }
    }
  }
  .bold_text {
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #111111;
    letter-spacing: 0;
  }
  .siderbar_menu {
    @include scrollbar;
    // flex: 1;
    // height: calc(100% - 201px);
    width: 280px;
    overflow-y: auto;
    overflow-x: hidden;
    .flex_container {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        flex: 1;
        .flex_container_icon {
          height: 16px;
          vertical-align: top;
        }
      }
      .right {
        margin-right: 6px;
        .list_item_tag {
          font-size: 12px;
          padding: 0 3px;
          border-radius: $theme_radius;
          // margin-right: 4px;
          transform: scale(0.7);
          height: 20px;
          line-height: 20px;
          text-align: center;
          display: inline-block;
          font-size: 14px;
          &.design {
            color: #fff;
            background: #358aff;
            &.hidden {
              visibility: hidden;
            }
          }
          &.released {
            color: $base_white;
            background: #2ddaac;
          }
          &.outside,
          &.inside {
            color: #ff934b;
            background: #fff4e5;
          }
          &.new {
            color: #fe6f79;
            background: #ffeaec;
          }
        }
      }
      .detail {
        visibility: hidden;
        background: #358aff;
        color: #fff;
        transform: scale(0.8);
        @include mini_button_common;
      }
      &:hover {
        .detail {
          visibility: visible;
        }
      }
    }
    /deep/ .el-tree-node {
      padding: 4px 0;
      &:focus {
        > .el-tree-node__content {
          background-color: #eaf1ff;
          color: #358aff;
          font-weight: 600;
        }
      }
    }
    /deep/ .el-tree-node.is-current {
      > .el-tree-node__content {
        background-color: #eaf1ff;
      }
    }
    /deep/ .el-tree-node__content {
      user-select: none;
      height: 35px;
      position: relative;
      padding-left: 0 !important;
      &:focus {
        background-color: #eaf1ff;
        color: #358aff;
        font-weight: 600;
      }
      &:active {
        background-color: #eaf1ff;
        color: #358aff;
        font-weight: 600;
      }
      &:visited {
        background-color: #eaf1ff;
        color: #358aff;
        font-weight: 600;
      }
      &:hover {
        background-color: #eaf1ff;
        color: #358aff;
        font-weight: 600;
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
      // width: 210px;
    }
  }
  .menu_current_none ::v-deep.el-tree-node.is-current > .el-tree-node__content {
    background-color: $base_white;
  }
}
</style>
