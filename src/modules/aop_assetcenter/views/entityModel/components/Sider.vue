<template>
  <div class="object-graph-sider">
    <div class="tabs">
      <div
        class="tab-item"
        :class="{ active: activeTab === '1' }"
        @click="setActiveTab('1')"
      >
        领域模型
      </div>
      <div class="tab-item disabled" :class="{ active: activeTab === '2' }">
        产品模型
      </div>
    </div>
    <div class="side-content" :class="{ active: activeTab !== '' }">
      <template v-if="activeTab === '1'">
        <div class="title-block">
          <el-dropdown
            trigger="click"
            size="mini"
            placement="bottom-start"
            @command="handleCommand"
          >
            <div class="center-select">
              <span class="name">{{ projectNm }}</span>
              <i class="el-icon-arrow-down"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in centerList"
                :key="index"
                :command="item"
                ><div
                  style="min-width: 180px"
                  :style="{
                    color:
                      item.projectId === selectedProjectId ? '#409EFF' : '',
                  }"
                >
                  {{ item.projectNm }}
                </div></el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <div class="close-content" @click="setActiveTab('')">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div style="padding: 8px">
          <el-input
            placeholder="搜索"
            v-model="keyword"
            size="mini"
            clearable
            @clear="search"
            @change="search"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </div>
        <div class="objects-container" v-loading="centerLoading">
          <div
            class="object-item"
            v-for="(item, index) in objList"
            :key="index"
          >
            <div class="object-name" @click="selectObject(item)">
              <span class="mark" :class="'mark' + item.achieveStatus"></span>
              <span class="name" :class="{ short: item.quote == '01' }">
                {{ item.objName + "（" + item.objCode + "）" }}
              </span>
              <!-- quote -->
              <el-tag v-if="item.quote == '01'" type="warning" size="mini"
                >引用</el-tag
              >
            </div>
            <div class="opt-btns" v-if="action == '0'">
              <i class="el-icon-edit" @click="editObject(item)"></i>
              <i class="el-icon-delete" @click="deleteObject(item)"></i>
            </div>
          </div>
        </div>
        <div class="components-container" v-if="action == '0'">
          <div class="title-block">
            <p>
              <span class="title">组件</span>
              <span class="description">拖拽组件进画布即可新增</span>
            </p>
            <div class="close-content" @click="toggleComponentList()">
              <i class="el-icon-minus" v-if="showComponentList"></i>
              <i class="el-icon-plus" v-else></i>
            </div>
          </div>
          <div class="components-list" v-if="showComponentList">
            <div
              class="component-item"
              v-for="(nodeType, index) in NODE_TYPES"
              :key="index"
              @mousedown="startDrag(nodeType, $event)"
            >
              <div class="head">
                <div
                  class="head1"
                  :style="{ background: nodeType.color }"
                ></div>
                <div class="head2"></div>
              </div>

              <span class="component-name">{{ nodeType.label }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import NODE_TYPES from "../shapes/nodeType";
import { NodeTypeTag, NodeTypeTagText, formatTree } from "./nodeType";
export default {
  name: "ObjectGraphSider",
  mixins: [mixin],
  props: {
    bizDomainNo: {
      type: String,
      default: "",
    },
    designType: {
      type: String,
      default: () => "",
    },
    action: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      NODE_TYPES,
      NodeTypeTag,
      NodeTypeTagText,
      activeTab: "1",
      selectedProjectId: "",
      projectNm: "",
      currentProject: null,
      centerList: [],
      centerLoading: false,

      keyword: "",
      infoList: [],
      objList: [],
      showComponentList: true,
    };
  },
  watch: {
    bizDomainNo: {
      async handler(value) {
        this.selectedProjectId = "";
        this.projectNm = "";
        this.centerList = [];
        this.keyword = "";

        if (!value) return;
        await this.queryOwnL5ProjectPageList();
      },
    },
  },
  async mounted() {
    this.selectedProjectId = this.projectId || "";
    if (this.bizDomainNo) {
      await this.queryOwnL5ProjectPageList(true);
    }
  },
  methods: {
    search() {
      if (this.keyword.trim() === "") {
        this.objList = this.infoList;
      } else {
        this.objList = this.infoList.filter(
          (item) =>
            item.objName.includes(this.keyword.trim()) ||
            item.objCode.includes(this.keyword.trim())
        );
      }
    },
    startDrag(node, event) {
      this.$emit("startDrag", node, event);
    },
    async setActiveTab(tab) {
      this.activeTab = tab;
      if (this.activeTab == "1") {
        await this.qryBizObjectBaseList();
      } else {
      }
      this.$emit("updateTab", this.activeTab);
    },
    toggleComponentList() {
      this.showComponentList = !this.showComponentList;
    },
    async handleCommand(item) {
      this.selectedProjectId = item.projectId;
      this.projectNm = item.projectNm;
      this.currentProject = item;
      await this.qryBizObjectBaseList();
    },

    async queryOwnL5ProjectPageList(f) {
      const { queryAppAndBlgClsInfoList } =
        await this.rpc.assetcenter.queryOwnL5ProjectPageList({
          bizDomainNo: this.bizDomainNo,
          currentPage: 1,
          turnPageShowNum: 1000,
        });
      this.centerList = queryAppAndBlgClsInfoList || [];
      if (this.centerList.length > 0) {
        if (this.selectedProjectId) {
          const _currentProject = this.centerList.find(
            (item) => item.projectId === this.selectedProjectId
          );
          if (_currentProject) {
            this.selectedProjectId = _currentProject.projectId;
            this.projectNm = _currentProject.projectNm;
            this.currentProject = _currentProject;
          }
        } else {
          this.selectedProjectId = this.centerList[0].projectId;
          this.projectNm = this.centerList[0].projectNm;
          this.currentProject = this.centerList[0];
        }

        await this.qryBizObjectBaseList(f, false);
      } else {
        // 没有中心
        this.objList = [];
        this.$emit("clear");
      }
    },
    async qryBizObjectBaseList(first = false, refresh = false) {
      this.centerLoading = true;
      this.keyword = "";
      const { infoList } = await this.rpc.assetcenter.qryBizObjectEditList({
        applicationNo: this.currentProject.projectId,
        bizDomainNo: this.currentProject.bizDomainNo,
        belongId: this.currentProject.projectId,
        belongType: "app",
        designType: this.designType,
      });
      this.infoList = infoList;
      this.objList = infoList || [];
      window.localStorage.setItem(
        "obj_list_in_center_business",
        JSON.stringify(this.objList)
      );
      this.centerLoading = false;

      if (!refresh) {
        this.$emit("changeProject", this.currentProject, this.infoList, first);
      }
    },
    selectObject(item) {
      this.$emit("operateObject", "select", item);
    },
    editObject(item) {
      this.$emit("operateObject", "edit", item);
    },
    deleteObject(item) {
      this.$emit("operateObject", "delete", item);
    },
    async refresh(refresh = true) {
      await this.qryBizObjectBaseList(false, refresh);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/mixin.scss";
.object-graph-sider {
  height: calc(100vh - 48px);
  overflow: hidden;
  @include flex(row, flex-start, center);

  .tabs {
    width: 28px;
    height: 100%;
    @include flex(column, flex-start, center);
    background: #dfe0e1;
    font-size: 12px;
    color: #59575c;
    border-right: 1px solid #bbbdbf;

    .tab-item {
      width: 100%;
      text-align: center;
      padding: 12px 4px;
      cursor: pointer;
      border-bottom: 1px solid #bbbdbf;
    }

    .active {
      color: #3e3e3e;
      background: #fff;
    }

    .disabled {
      cursor: not-allowed;
    }
  }

  .side-content {
    width: 240px;
    height: 100%;
    border-right: 1px solid #bbbdbf;
    background: #f8f8f8;
    display: none;
    flex-direction: column;

    .title-block {
      width: 100%;
      @include flex(row, space-between, center);
      height: 40px;
      border-bottom: 1px solid #bbbdbf;
      padding: 0 8px;

      .close-content {
        width: 24px;
        height: 24px;
        @include flex(row, flex-end, center);
        cursor: pointer;
      }

      .center-select {
        flex: 1;
        height: 100%;
        @include flex(row, center, center);
        cursor: pointer;
        color: #3e3e3e;

        .name {
          width: 180px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 12px;
          font-weight: 600;
        }

        i {
          width: 20px;
        }
      }

      .title {
        font-size: 12px;
        font-weight: 600;
        color: #3e3e3e;
      }

      .description {
        font-size: 10px;
        color: #8c8c8c;
      }
    }

    > div[style="padding: 8px"] {
      height: 40px;
      box-sizing: border-box;
    }

    .tree-container {
      flex: 1;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      border-bottom: 1px solid #bbbdbf;
      padding: 0 8px;
      box-sizing: border-box;
      .el-tree {
        height: 100%;
        background: none;
        font-size: 12px;
        /deep/ .el-tree-node__content {
          .el-tag {
            margin-right: 8px;
          }
        }
      }
    }
    .objects-container {
      flex: 1;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      border-bottom: 1px solid #bbbdbf;
      padding: 0 8px;
      box-sizing: border-box;

      .object-item {
        width: 100%;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        font-size: 12px;
        padding: 4px;
        @include flex(row, space-between, center);
        border-radius: 4px;
        transition: background-color 0.3s;

        .object-name {
          @include flex(row, flex-start, center);

          .mark {
            width: 10px;
            height: 10px;
            margin-right: 4px;
            border-radius: 50%;
          }

          .mark00 {
            background: #e6a23c;
          }

          .mark01 {
            background: #67c23a;
          }

          .name {
            width: 156px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .short {
            width: 126px;
          }
        }

        .opt-btns {
          display: none;
        }

        &:hover {
          background-color: #e6e6e6;

          .opt-btns {
            @include flex(row, flex-end, center);

            i {
              font-size: 14px;
              color: #8c8c8c;
              margin-left: 8px;
              cursor: pointer;

              &:hover {
                color: #3e3e3e;
              }
            }
          }
        }
      }
    }

    .components-container {
      box-sizing: border-box;

      .components-list {
        height: 200px;
        width: 100%;
        @include flex(row, flex-start, flex-start);
        flex-wrap: wrap;
        padding: 20px 10px;

        .component-item {
          width: 60px;
          height: 100px;
          margin-right: 12px;
          @include flex(column, flex-start, center);
          cursor: pointer;

          .head {
            border-radius: 8px;
            overflow: hidden;
          }

          .head1 {
            width: 60px;
            height: 28px;
          }

          .head2 {
            width: 60px;
            height: 30px;
            background: #fff;
          }

          .component-name {
            margin-top: 6px;
            font-size: 12px;
            color: #3e3e3e;
          }
        }
      }
    }
  }

  .active {
    display: flex;
  }
}
</style>
