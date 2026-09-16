<template>
  <div class="aop_tradedesign_comps_d4workbench_workbench_header_banner">
    <div class="treeSideBar">
      <div class="dic_content">
        <div @click.stop="iconDicClick" class="dic_header">
          <div class="icon" @click.stop="iconDicClick">
            <span v-if="iconDicShow"><i class="el-icon-caret-bottom"></i></span>
            <span v-else><i class="el-icon-caret-right"></i></span>
          </div>
          <div>业务对象管理</div>
        </div>
        <div v-show="iconDicShow">
          <!-- <div v-for="(item, index) in menuDatasetList" :key="index" class="textOver">
            <div
              class="dicItem"
              @click="dicClick(item,index)"
              :class="{ active: currentDatasetObj == item.id }"
            >
              <div>{{ item.dataLabel }}</div>
              <div class="number">{{ `(${item.number})个` }}</div>
            </div>
          </div> -->
          <div v-for="(item, index) in dictManageMenuList" :key="index" class="textOver">
            <div
              class="dicItem"
              @click="dicClick(item,index)"
              :class="{ active: currentDatasetObj == `dict-${item.bizDomainCode}` }"
            >
              <div>{{ `${item.bizDomainName}(${item.num})` }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="madeDate_content">
        <div @click.stop="iconMateClick" class="madeDate_header">
          <div class="icon" @click.stop="iconMateClick">
            <span v-if="iconMateShow"><i class="el-icon-caret-bottom"></i ></span>
            <span v-else><i class="el-icon-caret-right"></i></span>
          </div>
          <div>元数据管理</div>
        </div>
        <div v-show="iconMateShow">
          <div v-for="(item, index) in departmentList" :key="index" class="textOver">
            <div class="dicItem"  @click="mateClick(item,index)" :class="{ active: currentDatasetObj == item.bizDomainCode }">
              <div>{{ `${item.bizDomainName}元数据` }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- <el-tree
        :data="menuDatasetList"
        class="siderbar_menu"
        :class="currentNodeKey === '' ? 'menu_current_none' : 'menu_is_current'"
        ref="menuDatasetRef"
        :props="defaultProps"
        node-key="id"
        :expand-on-click-node="false"
        default-expand-all
        @node-click="handleNodeClick"
        @node-expand="nodeExpand"
        :current-node-key="currentNodeKey"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span
            class="tree_label"
            :class="{
              active: currentDatasetObj.id == data.id,
            }"
            ><span>{{ `${node.label}` }}</span>
            <span
              v-if="
                node.level == '2' &&
                !(
                  node.label == '对公元数据' ||
                  node.label == '对私元数据' ||
                  node.label == '营销元数据'
                )
              "
            >
              {{ `(${data.number})个` }}
            </span>
          </span>
        </span>
      </el-tree> -->
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";

export default {
  mixins: [mixin],
  props: {
    menuDatasetList: {
      type: Object,
      default: () => ([]),
    },
    departmentList:{
      type:Object,
      default:()=>([])
    }
  },
  data() {
    return {
      defaultProps: {
        label: "dataLabel",
        children: "dataChildren",
      },
      iconDicShow: true,
      iconMateShow: true,
      dicMenu: [
        {
          id: "1",
          dataLabel: "我的字典",
          number: "1111111111111111111",
          type: "all",
        },
        {
          id: "2",
          dataLabel: "设计中",
          number: "0",
          type: "design",
        },
        {
          id: "3",
          dataLabel: "待评审",
          number: "0",
          type:"unreview"
        },
        {
          id: "4",
          dataLabel: "已登记",
          number: "0",
          type:"unaccept"
        },
      ],
      currentDatasetObj: "FM",
      // menuDatasetList:[
      //   {
      //     dataLabel:"字典管理",
      //     id:"0",
      //     dataChildren:[
      //       {
      //         id:"1",
      //         dataLabel:"我的字典",
      //         number:"0",
      //         type:"all"
      //       },
      //       {
      //         id:"2",
      //         dataLabel:"设计中",
      //         number:"0",
      //         type:"all"
      //       },
      //       {
      //         id:"3",
      //         dataLabel:"待评审",
      //         number:"0"
      //       },
      //       {
      //         id:"4",
      //         dataLabel:"已登记",
      //         number:"0"
      //       }
      //     ]
      //   },
      //   {
      //     dataLabel:"元数据管理",
      //     id:"5",
      //     dataChildren:[
      //       {
      //         id:"6",
      //         dataLabel:"对公元数据",
      //         number:"0"
      //       },
      //       {
      //         id:"7",
      //         dataLabel:"对私元数据",
      //         number:"0"
      //       },
      //       {
      //         id:"8",
      //         dataLabel:"营销元数据",
      //         number:"0"
      //       }

      //     ]
      //   }
      // ],
      defaultExpandedKeys: [],
    };
  },
  computed: {
    dictManageMenuList() {
      const list = JSON.parse(JSON.stringify(this.departmentList))
      return list.map((item) => {
        item.id = `dict-${item.bizDomainCode}`
        item.type = "dictManage"
        return item
      })
    }
  },
  created() {
    // this.defaultExpandedKeys.push(this.menuDatasetList[0].dataChildren[0]);
    const sideBarIndex = sessionStorage.getItem("sideBarIndex")
    const id = this.dictManageMenuList[0]?.id || "dict-FM"
    this.currentDatasetObj = !["1", "2", "3", "4"].includes(sideBarIndex) ?  sideBarIndex : id
  },
  methods: {
    dicClick(data, index) {
      console.log("dicClick", data, index)
      this.currentDatasetObj = data.id;
      this.$emit("tabChange", data);
    },
    mateClick(data, index) {
      console.log("mateClick", data, index)
      this.currentDatasetObj = data.bizDomainCode;
      this.$emit("tabChange", data);
    },
    iconDicClick() {
      this.iconDicShow = !this.iconDicShow;
    },
    iconMateClick() {
      this.iconMateShow = !this.iconMateShow;
    },
  },
  watch: {
    defaultExpandedKeys(newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          document
            .querySelector(".el-tree-node__children .el-tree-node__content")
            .click();
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_comps_d4workbench_workbench_header_banner {
  // height: 100%;
  // height:calc(100vh - 16px);
  // background: #fff;
  width: 186px;
  .treeSideBar {
    position: fixed;
    height: 100%;
    margin: 16px 4px;
    background: #fff;
    width: 170px;
    // height:calc(100vh - 16px);
    .siderbar_menu {
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
        height: 34px;
        // position: relative;
        // padding-left: 10px !important;
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
        }
      }
      /deep/ .el-tag {
        height: 17px;
        line-height: 17px;
      }
      /deep/ .el-tree-node.is-expanded > .el-tree-node__children {
        // margin-left: 16px !important;
        padding: 3px;
      }
      .custom-tree-node {
        display: flex;
        justify-content: space-between;
        width: 174px;
        position: relative;
      }
      .tree_label {
        // display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 120px;
        // width: 80%;
        margin-left: 3px;
        font-size: 14px !important;
        color: #333333;
        &.active {
          background: #eaf1ff;
          color: $theme_color;
          // font-weight: 600;
        }
        // flex: 1;
      }
      .left {
        display: flex;
        flex: 1;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      /deep/.el-tag {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
      }
    }
    .menu_is_current ::v-deep.el-tree-node.is-current > .el-tree-node__content {
      color: $theme_color;
      background-color: #eaf1ff;
      // font-family: SimHei;
      // font-weight: $font_weight_600;
    }
    .dic_content,.madeDate_content{
      padding-top: 10px;
    }
    .dic_header,
    .madeDate_header {
      display: flex;
      cursor: pointer;
    }
    .icon {
      margin: 0 4px;
    }
    .dicItem {
      display: flex;
      height: 40px;
      margin: 8px 4px;
      // background: #eaf1ff;
      // color: $theme_color;
      padding: 8px 0px 8px 24px;
      cursor: pointer;
      &.active {
        background: #eaf1ff;
        color: $theme_color;
        // font-weight: 600;
      }
    }
    .number {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .textOver {
      min-width: 170px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
