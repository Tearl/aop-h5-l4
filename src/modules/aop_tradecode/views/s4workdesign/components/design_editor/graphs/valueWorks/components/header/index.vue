<template>
  <div class="header">
    <div class="header-left">
      <i @click="$router.back()">
        <img src="./assets/nav.png" />
      </i>
      <span>价值流</span>
    </div>
    <div class="header-right">
      <el-button size="mini" @click="exportPNG">导出图片</el-button>
      <el-button v-if="saveButton" size="mini" @click="save" type="primary"
        >保存</el-button
      >
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      saveButton: this.$parent.$route.query.save,
    };
  },
  computed: {
    Stager() {
      return this.$parent.Stager;
    },
  },
  methods: {
    toPNG() {
      setTimeout(() => {
        // let [box] = this.Stager.graph.getNodes()
        // let { width, height } = box.size()
        // return
        // this.Stager.graph.toPNG((dataUri) => {
        //     img = document.createElement("img");
        //     img.src = dataUri;
        //     // document.body.appendChild(img);
        //     console.log('dataUri >>>>', dataUri)
        //   },
        //   {
        //     width,
        //     height,
        //     padding: 10,
        //     quality: 1,
        //   }
        // );
      });
    },

    exportPNG() {
      this.$parent.Stager.graph.trigger("node:save", "img");
      this.$nextTick(() => {
        let [box] = this.Stager.graph.getNodes();
        let { width, height } = box.size();
        this.Stager.graph.exportPNG("file", {
          width: width * 2,
          height: height * 2,
          padding: 10,
          quality: 1,
          stylesheet: `
 .svgText {
    text-align: center;
    overflow: visible;
    margin-right: -20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    p {
      width: 100%;
      padding: 0 40px;
      min-width: 185px;
      white-space: nowrap;
      font-size: 16px;
      font-weight: 500;
    }
  }
  .subsection {
    min-width: 185px;
    height: 70px;
    background-color: #1a77d2;
    clip-path: polygon(
      0px 0px,
      35px 35px,
      0px 70px,
      calc(100% - 35px) 70px,
      100% 35px,
      calc(100% - 35px) 0px,
      0px 0px
    );
  }
          `,
        });
      });
    },

    save() {
      //   let json = this.Stager.graph.toJSON();
      //   let cells = json.cells.reduce((pre, next) => {
      //     if (next.shape != "edge") {
      //       let result = Object.create(null);
      //       result.id = next.id;
      //       result.shape = next.shape;
      //       result.data = next.data || {};
      //       result.position = next.position;
      //       if (next.shape == "Collection") {
      //         result.size = next.size;
      //         if (next.children && next.children.length > 0) {
      //           result.children = next.children || [];
      //         }
      //       } else {
      //         if (next.parent) {
      //           result.parent = next.parent;
      //         }
      //       }
      //       pre.push(result);
      //     }
      //     return pre;
      //   }, []);
      this.$parent.Stager.graph.trigger("node:save", this.$route.query);
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  height: 48px;
  background: #fff;
  border-top: 1px solid #dfe0e1;
  // box-shadow: 0 1px 10px 0 #e7e7e7;
  background: #f5f5f5;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
  .header-left {
    display: flex;
    align-items: center;
    i {
      width: 16px;
      height: 16px;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
    span {
      cursor: pointer;
      margin-left: 16px;
    }
  }
  .header-right {
    .el-button {
      min-width: 48px;
      padding: 0 10px;
      height: 24px;
      font-size: 12px;
      border-radius: 2px;
    }
  }
}
</style>