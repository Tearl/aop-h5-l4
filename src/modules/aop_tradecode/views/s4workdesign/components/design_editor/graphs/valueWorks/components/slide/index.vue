
<template>
  <div class="slide">
    <div class="slide-bar">
      <div :class="{ active: activedTab == '0' }" @click="activTab('0')">
        流<br />程<br />组<br />件
      </div>
      <div :class="{ active: activedTab == '1' }" @click="activTab('1')">
        价<br />值<br />分<br />段
      </div>
    </div>
    <div class="slide-body" v-show="showbody">
      <div class="header">
        <h5>{{ title }}</h5>
        <div class="tool" @click="hideSilideBody">
          <i class="el-icon-arrow-left"></i>
        </div>
      </div>
      <div class="main">
        <dl v-show="activedTab == '0'">
          <dd>
            <div class="mini-component">
              <ConnectionValue
                @mousedown.native="createNode($event, 'MiniCollectionValue')"
              />
            </div>
          </dd>
        </dl>
        <ul class="node-list" v-show="activedTab == '1'">
          <draggable v-model="nodeList" @end="end">
            <li v-for="(v, k) in nodeList" :key="v.id" @click="selectNode(v)">
              <Iocn name="#icon-shujumoxing" />
              <div>
                <p>{{ v.segName }}</p>
                <p>{{ v.segCode }}</p>
              </div>
              <div
                style="flex: 1"
                class="edit"
                v-if="$parent.$route.query.save"
              >
                <Iocn @click.native.stop="editNode(v)" name="#icon-edit" />
                <Iocn @click.native.stop="delNode(k, v)" name="#icon-ashbin" />
              </div>
            </li>
          </draggable>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import miniShape, { options } from "../shape";
import Iocn from "../svgContainer";
import draggable from "vuedraggable";
export default {
  components: {
    ...miniShape,
    Iocn,
    draggable,
  },
  data() {
    return {
      showbody: true,
      actived: "0",
      nodeList: [],
    };
  },
  computed: {
    Stager() {
      return this.$parent.Stager;
    },
    activedTab({ showbody }) {
      if (!showbody) {
        return null;
      }
      return this.actived;
    },
    title({ actived }) {
      return actived == "0" ? "流程组件" : "价值分段";
    },
  },
  methods: {
    init() {
      this.box = this.Stager.node.box;
      this.box.on("change:data", () => {
        if (this.actived == "1" && this.showbody) {
          this.updateNode();
        }
      });
    },

    activTab(num) {
      this.actived = num;
      this.showbody = true;
    },
    hideSilideBody() {
      this.showbody = false;
    },
    createNode($event, shape) {
      this.Stager.node.drop($event, { ...options, shape });
    },
    selectNode(v) {
      this.box.trigger("custom:node:operate", {
        action: "select",
        data: v,
      });
    },
    editNode(v) {
      this.box.trigger("custom:node:operate", {
        action: "edit",
        data: v,
      });
    },
    delNode(i, k) {
      this.nodeList.splice(i, 1);
      this.box.trigger("custom:node:operate", {
        action: "remove",
        data: k,
      });
    },
    updateNode() {
      this.nodeList = [].concat(this.box.data);
    },
    end() {
      this.$parent.Stager.graph.trigger("node:getData", this.nodeList);
    },
  },
  watch: {
    actived(val) {
      if (val == "1") {
        this.updateNode();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.slide {
  // width: 280px;
  // background: #fff;
  min-height: calc(100vh - 48px);
  display: flex;

  .slide-bar {
    width: 28px;
    height: 100%;
    font-size: 12px;
    color: #59575c;
    // box-shadow: 0.5px 0px 0px 0px rgba(231,231,238,1);
    border-top: 1px solid #bbbdbf;
    border-right: 1px solid #bbbdbf;
    background: #dfe0e1;
    display: flex;
    flex-direction: column;
    align-items: center;
    & > div {
      width: 100%;
      text-align: center;
      cursor: pointer;
      padding: 26px 0;
      font-weight: 600;
      // margin-top: 20px;
      &.active {
        // color: #358AFF;
        color: #3e3e3e;
        background: #fff;
      }
    }
  }

  .slide-body {
    width: 237px;
    border-right: 1px solid #bbbdbf;
    .header {
      width: 100%;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      // box-shadow: 0px 0.5px 0px 0px rgba(231,231,238,1);
      border-top: 1px solid #dfe0e1;
      border-bottom: 1px solid #dfe0e1;
      padding: 0 12px;
      box-sizing: border-box;
      h5 {
        color: #18191a;
        font-weight: 400;
        font-size: 12px;
      }
      .tool {
        i {
          display: inline-block;
          vertical-align: middle;
          margin-left: 2px;
          cursor: pointer;
          width: 16px;
          height: 16px;
          img {
            width: 100%;
          }
        }
      }
    }
  }

  .main {
    margin-top: 10px;
    padding: 4px 12px;

    dl {
      dd {
        display: flex;
        justify-content: space-between;
        margin-top: 6px;
      }
    }
    .mini-component {
      box-sizing: border-box;
      border-radius: 2px;
      overflow: hidden;
      cursor: pointer;
      &:hover {
        background: #f9fafc;
      }
    }

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: #333;
      padding: 4px;
      font-weight: 500;
      border-radius: 2px;
      cursor: pointer;

      .next-icon {
        width: 16px;
        height: 16px;
      }

      p {
        width: 150px;
        white-space: nowrap;
        overflow: hidden;
        word-break: keep-all;
        text-overflow: ellipsis;
        padding: 0 4px;
        color: #000;
        font-weight: 400;
        font-size: 12px;
        .code {
          padding-left: 4px;
          color: #838388;
        }
      }

      .edit {
        visibility: hidden;
        i {
          display: inline-block;
        }
      }
      &:hover {
        background-color: #eef3f9;
        & > div.edit {
          visibility: visible;
        }
      }
    }
  }
}
</style>