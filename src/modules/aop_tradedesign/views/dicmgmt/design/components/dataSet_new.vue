<template>
  <div class="data_set_new">
    <div class="flex">
      <div class="comps_aside">
        <div class="tree_search">
          <el-input
            class="module_search"
            size="mini"
            placeholder="搜索名称"
            prefix-icon="el-icon-search"
            v-model="filterText"
          ></el-input>
        </div>
        <div class="comps_aside_content">
          <el-tree
            ref="treeDom"
            class="treeClass"
            :data="treeData"
            node-key="id"
            default-expand-all
            :filter-node-method="filterNode"
            indent="10"
            @node-click="handleNodeClick"
            :expand-on-click-node="false"
            icon-class="el-icon-arrow-right"
            :current-node-key="currentIndex"
          >
            <span class="custom-tree-node" slot-scope="{ data, node }">
              <span
                :class="['label_span', `label_span_${node.level}`]"
                :title="node.label"
                >{{ node.label }}</span
              >

              <el-popover
                placement="bottom"
                width="106"
                popper-class="popover_1000"
                trigger="click"
              >
                <div class="operate_btns">
                  <span @click="doOperate('dataSetEdit', data)">编辑</span>
                  <span @click="doOperate('dataSetDel', data)">删除</span>
                </div>
                <img
                  slot="reference"
                  v-show="currentIndex == data.id && node.level == 2"
                  src="../../assets/icon_split.png"
                  class="icon_split"
                  alt=""
                />
              </el-popover>

              <img
                @click="doOperate('dataSetAdd', data)"
                v-show="
                  currentIndex == data.id && node.level == 1 && data.id != '-1'
                "
                src="../../assets/add_page.png"
                class="icon_split"
                alt=""
              />
            </span>
          </el-tree>
        </div>
      </div>
      <div class="right_main">
        <data-set-all v-if="isDataSetAll" />

        <div class="current_tab_change" v-else>
          <el-radio-group
            @change="tabChange"
            v-model="dataSetIndex"
            size="mini"
          >
            <el-radio-button label="1">{{
              dataSetListInfo.dataSetNm
            }}</el-radio-button>
            <el-radio-button label="2"
              >关联服务列表({{ servNum }})</el-radio-button
            >
          </el-radio-group>

          <span class="tab_desc">{{ tabDesc }}</span>
        </div>
        <component
          v-bind:is="currentTabComponent"
          :parentInfo="dataSetListInfo"
          @serviceNum="serviceNum"
        ></component>
      </div>

      <!-- <div class="right_main" v-else>
                <div class="empty">
                    <div class="empty_main">
                        <img src="../assets/page.png" alt="">
                        <span class="desc">暂无数据</span>
                    </div>
                </div>
            </div> -->
    </div>

    <data-set-info-dialog
      v-if="dataSetInfoDialogVirble"
      v-model="dataSetInfoDialogVirble"
      :dataSetInfo="dataSetInfo"
      @output="dataSetOutput"
    />
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import dataSetList from "./dataSetList.vue";
import serviceList from "./dataSetServiceList.vue";
import dataSetAll from "./dataSetAll.vue";
import dataSetInfoDialog from "../dialog/DatasetInfoDialog.vue";
export default {
  mixins: [mixin],

  inject: ["action", "appInfo"],

  components: {
    dataSetList,
    serviceList,
    dataSetAll,
    dataSetInfoDialog,
  },

  data() {
    return {
      treeData: [],
      currentIndex: "",
      dataSetIndex: "1",
      tabDesc: "",
      currentTabComponent: "",
      moduleInfo: {},
      titleInfo: {},
      dataSetInfo: {},
      dataSetInfoDialogVirble: false,
      filterText: "",
      isDataSetAll: true,
      dataSetListInfo: {},
      servNum: "",
      dataSetName: "",
    };
  },
  watch: {
    filterText(val) {
      this.$refs.treeDom.filter(val);
    },
  },
  created() {
    this.queryDataSetTreeData();
    this.queryServiceNum();
  },
  mounted() {},
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    async queryServiceNum() {
      const { turnPageTotalNum } = await this.rpc.d1interation.queryServiceList(
        {
          // blgAppNo: this.appInfo.aaiId,
          // appVerNo: this.appInfo.aaiVersion,
          // authId: this.appInfo.isolateWorkspace,
          dataSetNo: this.dataSetListInfo.dataSetNo,
          currentPage: "1",
          turnPageShowNum: "10",
        }
      );
      this.servNum = turnPageTotalNum;
    },
    dataSetOutput() {
      this.queryDataSetTreeData();
    },
    handleNodeClick(data, node) {
      console.log(data, node, "0-------");
      this.currentIndex = data.id;
      this.dataSetIndex = "1";

      if (node.level == 2) {
        this.dataSetListInfo = data;
        this.isDataSetAll = false;
        this.currentTabComponent = dataSetList;
        this.tabDesc = this.dataSetListInfo.dataSetDesc;
      }
      if (data.id == "-1") {
        this.isDataSetAll = true;
        this.currentTabComponent = "";
      }
    },

    tabChange() {
      this.tabDesc =
        this.dataSetIndex == 1
          ? this.dataSetListInfo.dataSetDesc
          : "展示当前数据集中数据字段被哪些服务使用";
      this.currentTabComponent = this.mapCrrrentComponent(this.dataSetIndex);
    },

    mapCrrrentComponent(index) {
      switch (index) {
        case "1":
          return dataSetList;
        case "2":
          return serviceList;
      }
    },

    doOperate(operate, data) {
      switch (operate) {
        case "dataSetAdd":
          this.dataSetInfoDialogVirble = true;
          this.dataSetInfo = {
            operationType: "0",
            classifyId: data.classifyId,
          };
          break;
        case "dataSetEdit":
          this.dataSetInfoDialogVirble = true;
          this.dataSetInfo = {
            operationType: "1",
            dataSetNo: data.dataSetNo,
          };
          break;
        case "dataSetDel":
          this.$confirm("确定删除该条数据集吗？", "温馨提示").then((res) => {
            this.rpc.d1interation
              .delDataSet({
                dataSetNo: data.dataSetNo,
              })
              .then((res) => {
                this.$notify({
                  title: "成功",
                  message: "删除成功",
                  duration: 2000,
                  type: "success",
                });
                this.queryDataSetTreeData();
              });
          });
          break;
      }
    },

    // 处理tree数据
    formatDataSetTree(data) {
      data.forEach((item, i) => {
        item.id = i;
        item.label = `${item.classifyNm}(${item.dataSetSum})`;

        if (item.dataSetList && item.dataSetList.length > 0) {
          item.children = item.dataSetList;
          item.children.forEach((info, j) => {
            info.id = `${i} + ${j}`;
            (info.label = info.dataSetNm),
              (info.classifyId = item.classifyId),
              (info.classifyNm = item.classifyNm);
            info.classifyNoInitial = item.classifyNoInitial;
          });
        }
      });
      return data;
    },
    async queryDataSetTreeData() {
      const { dataSetClassifyList, dataSetSum } =
        await this.rpc.d1interation.queryDataSetTreeData({
          // blgAppNo: this.appInfo.aaiId,
          // appVerNo: this.appInfo.aaiVersion,
          // authId: this.appInfo.isolateWorkspace,
          dataSetNm: "",
        });

      let list = this.formatDataSetTree(dataSetClassifyList);

      list.unshift({
        label: `全部(${dataSetSum})`,
        id: "-1",
      });
      this.treeData = list;
      this.$nextTick(() => {
        this.currentIndex = "-1";
        this.$refs.treeDom.setCurrentKey("-1");
      });
    },
  },
};
</script>
<style lang="scss">
.popover_1000 {
  width: 100px;
  background: #fff;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  padding: 0;

  &.el-tooltip__popper.is-light {
    border: none;
  }
  .operate_btns {
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
        color: #3489fe;
      }

      &:last-child {
        &:hover {
          background: #fff;
          color: #ff5d5f;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.data_set_new {
  .flex {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    min-height: calc(100vh - 179px);

    .comps_aside {
      width: 200px;
      background: #fff;
      border-radius: 2px;

      .tree_search {
        padding: 14px 8px 0 8px;

        .module_search {
          border-radius: 2px;
        }
      }

      .comps_aside_content {
        padding: 6px 8px;
        /deep/.treeClass {
          .el-tree-node.is-current > .el-tree-node__content {
            background: #f0f5ff;
            color: #358aff;
          }
          .el-tree-node__content {
            margin: 3px 0;
            height: 34px;
          }
          .el-tree-node__content:hover {
            background-color: #f7f7f9;
          }
          .custom-tree-node {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 80%;
            line-height: 16px;

            .label_span {
              width: 90%;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }

            .label_span_1 {
              font-size: 16px;
              // color: #333333;
            }
            .label_span_0 {
              font-size: 14px;
              color: #333333;
            }

            .icon_split {
              width: 16px;
              height: 16px;
            }
          }
        }

        .comps_aside_item {
          display: flex;
          align-items: center;
          height: 34px;
          padding: 9px 8px;
          cursor: pointer;
          margin-bottom: 6px;

          img {
            width: 16px;
            height: 16px;
            margin-right: 4px;
          }

          span {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
          }
        }

        .aside_item_active {
          background: #f0f5ff;
          border-radius: 2px;

          span {
            color: #358aff;
          }
        }
      }
    }
  }

  .right_main {
    flex: 1;
    margin-left: 12px;
    height: 100%;
    overflow: hidden;
    min-height: calc(100vh - 179px);

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

    .current_tab_change {
      padding: 16px 24px;
      background: #fff;
      margin-bottom: 12px;

      .tab_desc {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
        display: block;
        margin-top: 6px;
      }
    }
  }
}
</style>