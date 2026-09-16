
<template>
  <div class="x6-relation-custom-shape-region">
    <div class="x6-relation-custom-shape-region-body">
      <div class="header">
        <p>{{ objName }}</p>
        <div v-if="showBar" class="bar">
          <i class="el-icon-edit-outline" @mousedown.stop @click.stop="edit"></i>
          <i class="el-icon-circle-plus-outline" @mousedown.stop @click.stop="add"></i>
          <i class="el-icon-delete" @mousedown.stop @click.stop="del"></i>
        </div>
      </div>
      <div class="main"></div>
    </div>
  </div>
</template>
<script>
export default {
  inject: ["getGraph", "getNode"],
  name: "x6-shape-region",
  data() {
    return {
      showBar: true,
      options: {},
    };
  },

  mounted() {
    this.initEvent();
  },
  computed: {
    objName({ options }) {
      let node = this.getNode();
      if (node?.data) {
        let obj = node.data;
        return obj?.fnName ?? "默认参与者";
      } else {
        return "默认参与者";
      }
    },
  },
  methods: {
    initEvent() {
      let { preview, embed } = this.getGraph().__view__.options;
      if (preview || embed) {
        this.showBar = false;
        return;
      }

      let node = this.getNode();
      node.on("change:data", ({ current }) => {
        this.options = Object.assign({}, current);
      });
    },
    edit() {
      let grpah = this.getGraph();
      let node = this.getNode();
      grpah.__view__.node.validate(node);
    },
    del() {
      let grpah = this.getGraph();
      let node = this.getNode();
      grpah.__view__.region.remove(node);
    },
    add() {
      let grpah = this.getGraph();
      let node = this.getNode();
      grpah.__view__.region.add(node);
    }
  },
};
</script>