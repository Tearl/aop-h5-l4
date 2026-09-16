<template>
  <div class="tools">
    <div class="tools-key" :class="{ disabled: !toolData.undo }">
      <Icon name="#icon-undo" />
    </div>
    <div class="tools-key" :class="{ disabled: !toolData.redo }">
      <Icon name="#icon-redo" />
    </div>
    <!-- <div><el-divider direction="vertical"></el-divider></div>
        <div class="tools-key" :class="{'actived': toolData.move}" @click="changeSelection('move')">
            <Icon name="#icon-zhuashou" />
        </div>
        <div class="tools-key" :class="{'actived': toolData.selection}" @click="changeSelection('selection')">
            <Icon name="#icon-kuangxuan" />
        </div> -->
    <div><el-divider direction="vertical"></el-divider></div>
    <div class="tools-key" :class="{ disabled: !toolData.copy }" @click="copy">
      <Icon name="#icon-copy" />
    </div>
    <!-- <div class="tools-key" :class="{'disabled': !toolData.cut}" @click="cut">
            <Icon name="#icon-cut" />
        </div> -->
    <div
      class="tools-key"
      :class="{ disabled: !toolData.paste }"
      @click="paste"
    >
      <Icon name="#icon-paste" />
    </div>
    <div
      class="tools-key"
      :class="{ disabled: !toolData.del }"
      @click="nodeRemove"
    >
      <Icon name="#icon-ashbin" />
    </div>
    <!-- <div><el-divider direction="vertical"></el-divider></div>
        <div class="tools-key" :class="{'disabled': !toolData.link}" @click="link">
            <Icon name="#icon-a-bianzu2" />
        </div>
        <div class="tools-key" :class="{'disabled': !toolData.unlink}" @click="unlink">
            <Icon name="#icon-Icon-link-unlink" /> -->
  </div>
</template>
<script>
import _ from "lodash";
import Icon from "../svgContainer";
export default {
  components: {
    Icon,
  },
  props: ["toolData"],
  data() {
    return {};
  },
  computed: {
    Stager() {
      return this.$parent.Stager;
    },
    graph() {
      return this.$parent.Stager.graph;
    },
  },
  methods: {
    nodeRemove() {
      //   let selectedNodes = this.graph.getSelectedCells();
      //   selectedNodes.forEach((item) => {
      //     if (this.graph.isNode(item)) {
      this.Stager.node.box.trigger("custom:node:operate", {
        action: "remove",
      });
      //     }
      //   });
    },
    changeSelection(name) {
      let clone = Object.assign({}, this.toolData);
      if (name == "move") {
        clone.move = true;
        clone.selection = false;
        this.graph.toggleSelection(false);
        this.graph.togglePanning(true);
      } else if (name == "selection") {
        clone.move = false;
        clone.selection = true;
        this.graph.toggleSelection(true);
        this.graph.togglePanning(false);
      }
      this.$emit("update:toolData", clone);
    },
    copy() {
      let clone = Object.assign({}, this.toolData);
      //   let selectedNodes = this.graph.getSelectedCells();
      this.Stager.node.box.trigger("custom:node:operate", {
        action: "copy",
      });
      clone.paste = true;
      this.$emit("update:toolData", clone);
    },
    paste() {
      //   let nodes = this.graph.paste();
      //   setTimeout(() => {
      //     nodes.forEach((node) => {
      //       let data = node.getData();
      //       let newData = Object.assign({}, data, {
      //         objCode: data.objCode + `_${_.uniqueId()}copy`,
      //       });
      //       this.Stager.store.set(newData.objCode, node.id);
      //       node.replaceData(newData);
      //     });
      //   }, 80);
      this.Stager.node.box.trigger("custom:node:operate", {
        action: "paste",
      });
      //   this.graph.resetSelection(nodes);
    },
    cut() {
      // let selectedNodes = this.graph.getSelectedCells()
      // this.graph.cut(selectedNodes, {deep: true})
    },
    unlink() {
      this.$confirm("确认要取消聚合吗?", "取消聚合", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.Stager.node.unlink();
      });
    },
    link() {
      this.Stager.node.link();
    },
  },
};
</script>
<style lang="scss" scoped>
.tools {
  width: 100%;
  height: 28px;
  padding: 0 20px;
  background: #fff;
  border-left: solid 0.5px #e7e7ee;
  // box-shadow: 0px 0.5px 0px 0px #e7e7ee;
  border-top: 1px solid #dfe0e1;
  border-bottom: 1px solid #dfe0e1;
  display: flex;
  align-items: center;
  overflow: hidden;
  & > div {
    display: flex;
    align-items: center;
    padding: 4px;
    margin-right: 6px;
    border-radius: 3px;
    height: 22px;
    overflow: hidden;
    cursor: pointer;
    .next-icon {
      width: 14px;
      height: 14px;
      line-height: 14px;
    }
    &.tools-key:hover {
      background-color: #dfe0e1;
    }
  }
  .disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .actived {
    background-color: #dfe0e1;
  }
}
</style>