<template>
  <div class="aop_graph_valueWorks">
    <Header />
    <div class="container">
      <SvgList />
      <div class="body">
        <Slider ref="slider" />
        <div class="main">
          <Tool :toolData.sync="toolData" />
          <div class="graph-view-wrap">
            <Zoom />
            <div ref="view" class="graph-view-container">
              <div id="stage-container"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <editValueFlow ref="editValueFlow"></editValueFlow>
  </div>
</template>
<script>
import View from "./lib";
import mixins from "./mixins";
import Header from "./components/header";
import Slider from "./components/slide";
import SvgList from "../skeleton/components/svgList";
import editValueFlow from "./components/editValueFlow.vue";
import Tool from "./components/tool";
import Zoom from "./components/zoom"
export default {
  mixins,
  components: {
    Header,
    Slider,
    SvgList,
    editValueFlow,
    Tool,
    Zoom
  },
  data() {
    return {
      toolData: {
        undo: false,
        redo: false,
        move: false,
        selection: true,
        copy: false,
        cut: false,
        paste: false,
        del: false,
        link: false,
        unlink: false,
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      let width = this.$refs.view.offsetWidth;
      let height = this.$refs.view.offsetHeight;
      this.Stager = new View(this, {
        container: this.$refs.view,
        width,
        height,
      });

      this.$refs.slider.init();
    });
  },
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>