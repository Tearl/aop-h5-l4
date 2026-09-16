<template>
  <div
    :id="`container${index}`"
    :style="{
      'margin-top': topInit,
    }"
  ></div>
</template>
<script>
// import lodash from "lodash-es";
import G6 from "@antv/g6";
// import "@antv/x6-vue-shape";
// import Count from "./Count";
export default {
  props: {
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 0,
    },
    index: {
      type: Number,
      default: 0,
    },
    //顶部初始距离
    topInit: {
      require: true,
      type: String,
    },
    //行高
    lineHeight: {
      type: String,
      default: 40,
    },
    sourceData: {
      required: true,
      type: Object,
    },
    targetData: {
      required: true,
      type: Object,
    },
  },
  computed: {},
  data() {
    return {
      graph: {},
      data: {},
      sourceMap: {},
      targetMap: {},
      indexMap: 1,
      data_list: []
    };
  },
  created() {
    // console.log("源数据：", this.sourceData);
    // console.log("目标数据：", this.targetData);
    // const sourceList = this.sourceData;
    // const targetList = this.targetData;
    const sourceList = this.sourceData;
    const targetList = this.targetData;
    this.createMap(sourceList, targetList);
  },
  mounted() {
    this.$nextTick(() => {
      this.initCompared();
    });
  },
  watch: {},
  methods: {
    initCompared() {
      //注册自定义边
      // G6.registerEdge(
      //   "circle-running",
      //   {
      //     afterDraw(cfg, group) {
      //       // get the first shape in the group, it is the edge's path here=
      //       const shape = group.get("children")[0];
      //       // the start position of the edge's path
      //       const startPoint = shape.getPoint(0);

      //       // add red circle shape
      //       const circle = group.addShape("circle", {
      //         attrs: {
      //           x: startPoint.x,
      //           y: startPoint.y,
      //           fill: "#1890ff",
      //           r: 3,
      //         },
      //         name: "circle-shape",
      //       });

      //       // animation for the red circle
      //       circle.animate(
      //         (ratio) => {
      //           // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
      //           // get the position on the edge according to the ratio
      //           const tmpPoint = shape.getPoint(ratio);
      //           // returns the modified configurations here, x and y here
      //           return {
      //             x: tmpPoint.x,
      //             y: tmpPoint.y,
      //           };
      //         },
      //         {
      //           repeat: true, // Whether executes the animation repeatly
      //           duration: 3000, // the duration for executing once
      //         }
      //       );
      //     },
      //   },
      //   "cubic" // extend the built-in edge 'cubic'
      // );
      // console.log("初始化G6画布", this.height);
      const graph = new G6.Graph({
        container: `container${this.index}`, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: this.width, // Number，必须，图的宽度
        height: this.height, // Number，必须，图的高度
        defaultNode: {
          size: 1, //边宽度
          // type: 'circle',  // 在数据中已经指定 type，这里无需再次指定
          style: {
            fill: "#bae637",
            stroke: "#eaff8f",
            lineWidth: 5,
          },
        },
        defaultEdge: {
          // type: "circle-running", //cubic动画定义的线条
          type: "line", //cubic  //直线
          size: 3, //边宽度
          /* you can configure the global edge style as following lines */
          style: {
            stroke: "#F6BD16",
            // endArrow: true, //箭头
          },
        },
        // //hover click边时的样式
        // edgeStateStyles: {
        //   // edge style of active state
        //   active: {
        //     opacity: 0.5,
        //     stroke: "#005dd7",
        //     lineWidth: 3,
        //   },
        //   // edge style of selected state
        //   selected: {
        //     stroke: "#005dd7",
        //     lineWidth: 3,
        //   },
        // },
      });
      // graph.on("edge:mouseenter", (evt) => {
      //   const { item } = evt;
      //   graph.setItemState(item, "active", true);
      // });

      // graph.on("edge:mouseleave", (evt) => {
      //   const { item } = evt;
      //   graph.setItemState(item, "active", false);
      // });
      // graph.on("edge:click", (evt) => {
      //   const { item } = evt;
      //   console.log('点击edge',item)
      //   graph.setItemState(item, "selected", !item._cfg.states.includes('selected'));
      // });
      let tableTopInit = this.topInit, //初始top距离
        tableLineHeight = 48,//表格行高距离
        sourceNodeX = this.width,//源节点X轴
        targetNodeX = 0;//目标节点X轴（根据画布宽度）
      const data = {
        // 点集
        nodes: [
          // {
          //   id: "node1", // String，该节点存在则必须，节点的唯一标识
          //   x: 50, // Number，可选，节点位置的 x 值
          //   y: 60, // Number，可选，节点位置的 y 值
          // },
          // {
          //   id: "node2", // String，该节点存在则必须，节点的唯一标识
          //   x: 300, // Number，可选，节点位置的 x 值
          //   y: 100, // Number，可选，节点位置的 y 值
          // },
        ],
        // 边集
        edges: [
          // {
          //   source: {
          //     x: 0,
          //     y: sourceNodeY,
          //   }, // String，必须，起始点 id
          //   target: {
          //     x: 300,
          //     y: targetNodeY,
          //   }, // String，必须，起始点 id
          //   // source: "node1", // String，必须，目标点 id
          //   // target: "node2", // String，必须，目标点 id
          // },
        ],
      };
      // console.log(data,"=====>")

      // 整合坐标数据-生成edge
      let edges = [];
      for (const [k, v] of Object.entries(this.sourceMap)) {
        // console.log('遍历源目标-生成线',v.paramStandardId)
        if(!v.paramStandardId) continue;
        const arr = v.paramStandardId.split(',')
        // console.log('一对',arr.length,arr)
        for (const j of arr) {
          // console.log("目标",j,this.targetMap[j],this.targetMap);
          if (this.targetMap[j]) {
            const targetMap = this.targetMap[j];
            let sourceNodeIndex = v.index,
              sourceNodeY =
                tableTopInit +
                (tableLineHeight * sourceNodeIndex - tableLineHeight / 2),
              targetNodeIndex = targetMap.index,
              targetNodeY =
                tableTopInit +
                (tableLineHeight * targetNodeIndex - tableLineHeight / 2);
            // console.log('sourceNode',sourceNodeX,sourceNodeY)
            // console.log('targetNode',targetNodeX,targetNodeY)
            edges.push({
              source: {
                x: sourceNodeX,
                y: sourceNodeY,
                name: k,
              },
              target: {
                x: targetNodeX,
                y: targetNodeY,
                name: j,
              },
            });
          }
        }
      }

      
      // console.log("edges",edges)
      // data.edges = edges;
      data.edges = edges;
      // this.data_list = data
      // console.log("data_list",data)
      graph.data(data); // 读取 Step 2 中的数据源到图上
      this.graph = graph;
      graph.render(); // 渲染图
    },
    // 选中边事件
    setCurrentEdge(code) {
      // console.log("setCurrentEdge", code);
      const edge = this.graph
        .getEdges()
        .filter((i) => i._cfg.source.name === code);
      if (edge) {
        for (const i of edge) {
          this.graph.setItemState(i, "selected", true);
        }
      }
    },
    clearAllCurrentEdge() {
      for (const edge of this.graph.getEdges()) {
        this.graph.setItemState(edge, "selected", false);
      }
    },
    /**
     * grsipStandardId 映射字段
     */
    createMap(sourceIn, targetIn) {
      // console.log("源输入参数", sourceIn);
      // console.log("输入参数", targetIn);
      //输入
      let sourceMap = {};
      let targetMap = {};
      this.getParamMap(sourceMap, sourceIn);
      this.indexMap = 1;
      this.getParamMap(targetMap, targetIn);
      this.indexMap = 1;
      this.sourceMap = sourceMap;
      this.targetMap = targetMap;

      console.log("映射的源数据", sourceMap);
      console.log("映射目标数据", targetMap);
    },
    getParamMap(sourceMap, list, codes) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        let code = codes || "";
        if (item) {
          // console.log("赋值：",code, item.grsipCode, this.indexMap);
          let save = {
            index: this.indexMap,
            paramStandardId: item.paramStandardId,
          };
          if (code) {
            code = `${code}.${item.apKey}`;
            sourceMap[code] = save;
          } else {
            sourceMap[item.apKey] = save;
            code = item.apKey;
          }
          this.indexMap += 1;
        }
        //子层
        if (
          item.sonParamList &&
          item.sonParamList.length
        ) {
          this.getParamMap(sourceMap, item.sonParamList, code);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
