<template>
  <div class="aop_tradedesign_comps_d4workbench_workbench_header_banner">
    <div class="treeSideBar">
      <el-tree
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
            <span v-if="node.level == '2' && !(node.label == '对公元数据' ||node.label == '对私元数据' ||node.label == '营销元数据')">
              {{`(${data.number})个`}}
              <!-- <span
                v-if="
                  !(
                    node.label == '对公元数据' ||
                    node.label == '对私元数据' ||
                    node.label == '营销元数据'
                  )
                "
                >{{ `${data.number}` }}</span
              ></span
            > -->
          </span>
        </span>
        </span>
      </el-tree>
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
      default: () => ({}),
    },
  },
  data() {
    return {
      defaultProps: {
        label: "dataLabel",
        children: "dataChildren",
      },
      currentDatasetObj: {},
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
  created() {
    this.defaultExpandedKeys.push(this.menuDatasetList[0].dataChildren[0]);
  },
  methods: {
    handleNodeClick(data, node) {
      this.currentDatasetObj = data;
      this.$emit("tabChange",data)
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
    margin: 16px 4px;
    background: #fff;
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
  }
}
</style>
