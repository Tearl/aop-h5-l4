<template>
  <div class="entity-object-node-wrapper">
    <div class="opt-btns" :class="{ show: isClicked }">
      <span>
        <i
          class="el-icon-edit-outline custom-event-target"
          @click="editObj"
        ></i>
        <i
          class="el-icon-delete custom-event-target"
          @click="deleteObj"
          v-if="hasDelete"
        ></i>
      </span>
    </div>
    <div class="entity-object-node">
      <div class="header" :style="{ background: bgColor, color: fontColor }">
        <p>{{ (nodeData && nodeData.objName) || "未命名" }}</p>
        <p class="title">{{ title }}</p>
        <img v-if="nodeData && nodeData.quote == '01'" src="data:image/png;base64,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" alt="">
      </div>
      <div class="content">
        <el-link :underline="false">
          <p class="custom-event-target" @click="viewObj('2')">
            <span class="left"
              ><span class="value">{{
                (nodeData && nodeData.attributeCount) || 0
              }}</span>
              对象属性</span
            >
            <i class="el-icon-view"></i>
          </p>
        </el-link>
        <el-link :underline="false">
          <p class="custom-event-target" @click="viewObj('4')">
            <span class="left"
              ><span class="value">
                {{ (nodeData && nodeData.behaviorCount) || 0 }}
              </span>
              对象行为</span
            >
            <i class="el-icon-view"></i>
          </p>
        </el-link>
        <el-link :underline="false">
          <p class="custom-event-target" @click="viewObj('5')">
            <span class="left"
              ><span class="value">{{
                (nodeData && nodeData.sysObjCount) || 0
              }}</span>
              库表对象</span
            >
            <i class="el-icon-view"></i>
          </p>
        </el-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EntityObject",
  inject: ["getNode", "getGraph"],
  data() {
    return {
      title: "<<实体对象>>",
      node: null,
      graph: null,
      nodeData: {
        isClicked: false,
      },
    };
  },
  computed: {
    isClicked() {
      return (
        this.nodeData && this.nodeData.isClicked && this.nodeData.action == "0"
      );
    },
    hasDelete() {
      return this.nodeData && this.nodeData.designType == "domain_model";
    },
    bgColor() {
      let nodeProps = this.nodeData.nodeProps
        ? JSON.parse(this.nodeData.nodeProps)
        : null;
      return nodeProps && nodeProps.bgColor ? nodeProps.bgColor : "#04844b";
    },
    fontColor() {
      let nodeProps = this.nodeData.nodeProps
        ? JSON.parse(this.nodeData.nodeProps)
        : null;
      return nodeProps && nodeProps.fontColor ? nodeProps.fontColor : "#1b1d1d";
    },
  },
  mounted() {
    this.graph = this.getGraph();
    this.node = this.getNode();
    this.nodeData = this.node.getData();
    this.node.on("change:data", () => {
      this.nodeData = this.node.getData();
    });
  },
  methods: {
    viewObj(tab) {
      this.graph.trigger("node:view", { nodeData: this.nodeData, tab });
    },
    deleteObj() {
      this.graph.trigger("node:delete", { node: this.node });
    },
    editObj() {
      this.graph.trigger("node:edit", { node: this.node });
    },
  },
};
</script>

<style lang="scss" scoped>
.entity-object-node-wrapper {
  position: relative;

  .opt-btns {
    position: absolute;
    top: -18px;
    right: 0px;
    display: flex;
    justify-content: flex-end;
    visibility: hidden;
    span {
      background: #fff;
      padding: 0 4px;
      font-size: 12px;
      .el-icon-delete {
        margin-left: 2px;
        &:hover {
          color: red;
        }
      }
      .el-icon-edit-outline {
        &:hover {
          color: #409eff;
        }
      }
      i {
        cursor: pointer;
      }
    }
  }
  .show {
    visibility: visible;
  }
}
.entity-object-node {
  width: 180px;
  border-radius: 6px;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid #bbbdbf;
  .header {
    height: 66px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    position: relative;
    img {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 48px;
      height: 48px;
    }
    p {
      line-height: 1.2;
      width: 100%;
      font-size: 16px;
      font-weight: bold;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
    .title {
      font-size: 12px;
      margin-top: 4px;
    }
  }
  .content {
    background: #fff;
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .el-link {
      width: 100%;
    }
    /deep/.el-link--inner {
      width: 100%;
    }
    p {
      line-height: 1.2;
      font-size: 11px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .left {
        flex: 1;
      }
      .value {
        font-weight: 600;
        color: #409eff;
      }
    }
  }
}
</style>

