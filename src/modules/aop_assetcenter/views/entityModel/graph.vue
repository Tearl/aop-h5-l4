<template>
  <div id="object-graph">
    <div id="graph-container" class="no-select"></div>
    <scale @zoomTo="zoomTo" />
    <svgs />
    <shortcut
      ref="shortcut"
      :action="action"
      @shortcutSelect="shortcutSelect"
      @changeColor="changeColor"
      @importObj="showImportObjectDialog = true"
      @viewFn="showViewFnDialog = true"
    />

    <AddObject
      ref="addObject"
      :project="project"
      :treeNodeData="treeNodeData"
      :designType="designType"
      @add="addNode"
      @update="updateNode"
      @cancel="cancelNode"
    />

    <ViewObject ref="viewObject"
      :designType="designType"
      :project="project"
      :treeNodeData="treeNodeData"
    />
    <ViewSysObject ref="viewSysObject" />

    <AddRelation
      ref="addRelDialog"
      @close="cancelAddRel"
      @relation="optRelation"
      @delRelation="delRelation"
    />

    <EditAgg
      ref="editAgg"
      :visible="showEditAgg"
      :agg="currentAgg"
      v-if="showEditAgg"
      @close="
        showEditAgg = false;
        currentAgg = null;
      "
      @removeObj="removeObj"
      @updateAgg="updateAgg"
    />

    <ImportObject
      v-if="showImportObjectDialog"
      :visible="showImportObjectDialog"
      :bizDomainNo="bizDomainNo"
      :project="project"
      @close="showImportObjectDialog = false"
      @confirm="importObjectList"
    />
    <ViewFnDialog
      v-if="showViewFnDialog"
      :visible="showViewFnDialog"
      :project="project"
      @close="showViewFnDialog = false"
    />
  </div>
</template>
<script>
import EntityObject from "./shapes/EntityObject.vue";
import ValueObject from "./shapes/ValueObject.vue";
import AggRootObject from "./shapes/AggRootObject.vue";
import AggRootContainer from "./shapes/AggRootContainer.vue";
import { Graph } from "@antv/x6";
import { Dnd } from "@antv/x6-plugin-dnd";
import { Snapline } from "@antv/x6-plugin-snapline";
import { register } from "@antv/x6-vue-shape";
import { Selection } from "@antv/x6-plugin-selection";
import { History } from "@antv/x6-plugin-history";
import { Export } from "@antv/x6-plugin-export";

import config from "./config";
import { addGraphListeners } from "./listeners";
import ObjectGraph from "./models/ObjectGraph";
import Store from "./models/Store";

import scale from "./widgets/scale.vue";
import svgs from "./widgets/svgs.vue";
import shortcut from "./widgets/shortcut";
import AddObject from "./components/AddObject.vue";
import ViewObject from "./components/ViewObject.vue";
import AddRelation from "./components/AddRelation.vue";
import EditAgg from "./components/EditAgg.vue";

import ViewSysObject from "./components/ViewSysObject.vue";
import ImportObject from "./components/ImportObject.vue";
import ViewFnDialog from "./components/ViewFnDialog.vue";

import mixin from "@m/core/mixin";
import _ from "lodash";
import uuidv4 from "uuid/v4";

register({
  shape: "entity-object",
  component: EntityObject,
});
register({
  shape: "value-object",
  component: ValueObject,
});
register({
  shape: "aggroot-object",
  component: AggRootObject,
});
register({
  shape: "aggroot-container",
  component: AggRootContainer,
});

export default {
  mixins: [mixin],
  name: "ObjectGraph",
  props: {
    bizDomainNo: {
      type: String,
      default: "",
    },
    project: {
      type: Object,
      default: () => {},
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
  components: {
    scale,
    svgs,
    shortcut,
    AddObject,
    ViewObject,
    AddRelation,
    EditAgg,
    ViewSysObject,
    ImportObject,
    ViewFnDialog,
  },
  data() {
    return {
      model: null,
      graph: null,
      dnd: null,
      store: null,

      currentNode: null,
      currentEdge: null,

      objList: [],

      treeNodeData: null,
      initNodeId: "",

      ctrlPressed: false,
      showEditAgg: false,
      currentAgg: null,
      isDragging: false,

      showImportObjectDialog: false,
      showViewFnDialog: false,
    };
  },
  provide() {
    return {
      getGraph: () => {
        return this.graph;
      },
    };
  },
  mounted() {
    this.initGraph();
    if (this.action != "0") {
      this.graph.options.connecting.allowPort = false;
      this.graph.options.interacting = false;
      this.graph.toggleSelection(false);
    }
  },
  methods: {
    initGraph() {
      this.graph = new Graph({
        container: document.getElementById("graph-container"),
        ...config.defaultConfig,
        embedding: {
          enabled: this.action === "0",
          validate({ child, parent, childView, parentView }) {
            if (parent.data.objType == "10") {
              return true;
            }
            return false;
          },
        },
      });

      this.initListeners(this.graph);

      this.dnd = new Dnd({
        target: this.graph,
        scaled: false,
        animation: true,
      });
      this.graph.use(
        new Selection({
          enabled: true,
          rubberband: true,
          showNodeSelectionBox: true,
          pointerEvents: "none",
          filter(cell) {
            return this.isNode(cell);
          },
        })
      );
      this.graph.use(
        new History({
          enabled: true,
          ignoreAdd: true,
          ignoreRemove: true,
        })
      );
      this.graph.use(new Export());
      this.graph.use(new Snapline());
      this.graph.centerContent();
    },

    offListeners(graph) {
      graph.off("node:embedded");
      graph.off("node:click");
      graph.off("node:added");
      graph.off("edge:connected");
      graph.off("node:dblclick");
      graph.off("node:view");
      graph.off("node:edit");
      graph.off("node:delete");
      graph.off("selection:changed");
    },

    initListeners(graph) {
      graph.on("node:embedded", ({ node, previousParent, currentParent }) => {
        if (this.action !== "0") return;
        this.ctrlPressed = false;
        if (!previousParent) {
          let nodeData = node.getData();
          if (nodeData.isNew) {
            // 新节点
          } else {
            let agg = currentParent.getData();
            console.log("nodeData", nodeData, agg);
            this.rpc.assetcenter
              .saveAggregationBizObjRel({
                aggregationId: agg.aggregationId,
                objIds: [nodeData.objId],
              })
              .then(() => {});
          }
        }
      });

      graph.on("node:click", ({ node, e }) => {
        this.activateNode(node);
      });
      graph.on("node:added", ({ node }) => {
        let d = node.getData();
        if (d.isNew) {
          this.$refs.addObject.show(node);
        }
      });
      graph.on("edge:connected", ({ isNew, edge }) => {
        if (this.action !== "0") return;
        if (isNew) {
          const source = edge.getSourceCell();
          const sourceData = source.getData();
          const target = edge.getTargetCell();
          const targetData = target.getData();
          let all = this.objList.filter(
            (i) => i.objType == "00" || i.objType == "01"
          );
          let targetObjList = _.differenceBy(all, [sourceData], "objId");
          this.$refs.addRelDialog.show(
            sourceData,
            null,
            targetData,
            targetObjList,
            edge
          );
        }
      });
      graph.on("node:dblclick", ({ node }) => {
        let data = node.getData();
        if (this.action == "0") {
          if (data.objType == "10") {
            this.currentAgg = node;
            this.showEditAgg = true;
          } else {
            this.$refs.addObject.show(node);
          }
        } else if (this.action == "1") {
          this.$refs.viewObject.show(data, "1");
        }
      });

      graph.on("node:view", async ({ nodeData, tab }) => {
        if (this.isDragging) return;
        if (tab == "5") {
          if (nodeData.l5ObjId) {
            const res = await this.rpc.assetcenter.qrySysBizObjectInfo({
              objId: nodeData.l5ObjId,
            });
            this.$refs.viewSysObject.show(res, "1");
          }
        } else {
          this.$refs.viewObject.show(nodeData, tab);
        }
      });
      graph.on("node:edit", ({ node }) => {
        if (this.action !== "0") return;
        let data = node.getData();
        if (data.objType == "10") {
          this.currentAgg = node;
          this.showEditAgg = true;
        } else {
          this.$refs.addObject.show(node);
        }
      });
      graph.on("node:delete", ({ node }) => {
        if (this.action !== "0") return;
        this.deleteNode(node);
      });

      graph.on("selection:changed", ({ selected }) => {
        const selectedNodes = selected.filter(
          (cell) => this.graph.isNode(cell) && cell.getData().objType !== "10"
        );
        if (selectedNodes.length > 0) {
          this.$refs.shortcut.cleanDisabledIcon([
            "delete",
            "color",
            "hline",
            "vline",
            "hcenter",
            "vcenter",
          ]);
          let bgColors = [];
          let fontColors = [];
          selectedNodes.forEach((node) => {
            const data = node.getData();
            const nodeProps = data.nodeProps ? JSON.parse(data.nodeProps) : {};
            if (nodeProps.bgColor) {
              bgColors.push(nodeProps.bgColor);
            } else {
              if (data.objType === "00") {
                bgColors.push("#04844b");
              } else if (data.objType === "01") {
                bgColors.push("#3e3e3c");
              } else if (data.objType === "02") {
                bgColors.push("#0070d2");
              }
            }
            if (nodeProps.fontColor) {
              fontColors.push(nodeProps.fontColor);
            } else {
              fontColors.push("#1b1d1d");
            }
          });
          const mostFrequentBgColor = this.findMostFrequentElement(bgColors);
          const mostFrequentFontColor =
            this.findMostFrequentElement(fontColors);
          if (mostFrequentBgColor) {
            this.$refs.shortcut.updateBgColor(mostFrequentBgColor);
          }
          if (mostFrequentFontColor) {
            this.$refs.shortcut.updateFontColor(mostFrequentFontColor);
          }
        } else {
          this.$refs.shortcut.setDisabledIcon([
            "delete",
            "color",
            "hline",
            "vline",
            "hcenter",
            "vcenter",
          ]);
          this.$refs.shortcut.cleanColors();
        }
      });

      graph.on("edge:added", ({ edge }) => {
        edge.setData({
          __origSource: edge.getSource(),
          __origTarget: edge.getTarget(),
        });
      });

      graph.on("node:mousedown", () => {
        this.isDragging = false;
      });

      graph.on("node:mousemove", () => {
        this.isDragging = true;
      });

      addGraphListeners(graph, this);
    },

    findMostFrequentElement(arr) {
      if (_.isEmpty(arr)) return null;
      const countObj = _.countBy(arr);
      const mostFrequent = _.maxBy(_.entries(countObj), ([_, count]) => count);
      return mostFrequent ? mostFrequent[0] : null;
    },

    customExport(filename) {
      let bbox = this.graph.getAllCellsBBox();
      if (!bbox) return;
      this.graph.exportPNG(filename, {
        width: bbox.width * 2,
        height: bbox.height * 2,
        padding: 100,
        quality: 1,
        backgroundColor: "#edeeef",
        stylesheet: config.exportSheet,
      });
    },

    deleteNode(node) {
      let nodeData = node.getData();

      if (nodeData.quote == "01") {
        this.$confirm("确定从当前中心下删除该对象的关联关系？", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            await this.rpc.assetcenter.delQuoteBizObj({
              objId: nodeData.objId,
              currentAppNo: this.project.projectId,
            });
            if (nodeData.objType == "02" && nodeData.aggregationBaseInfo) {
              let agg = this.graph.getCellById(
                nodeData.aggregationBaseInfo.aggregationId
              );
              const children = agg.getChildren();
              children.forEach((child) => {
                child.setParent(null);
              });
              agg && agg.remove();
              node.remove();
              this.$emit("refresh", false);
            } else {
              node.remove();
              this.$emit("refresh");
            }
            this.$message.success("删除成功!");
          })
          .catch(() => {});
      } else {
        this.$confirm("您确定删除当前对象吗？", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            await this.rpc.assetcenter.delBizObjectV2({
              objId: nodeData.objId,
            });
            if (nodeData.objType == "02" && nodeData.aggregationBaseInfo) {
              let agg = this.graph.getCellById(
                nodeData.aggregationBaseInfo.aggregationId
              );
              const children = agg.getChildren();
              children.forEach((child) => {
                child.setParent(null);
              });
              agg && agg.remove();
              node.remove();
              this.$emit("refresh", false);
            } else {
              node.remove();
              this.$emit("refresh");
            }
            this.$message.success("删除成功!");
          })
          .catch(() => {});
      }
    },

    clear() {
      this.graph.clearCells();
    },
    renderObjects(objects, id = "") {
      this.clear();
      this.model = new ObjectGraph(this);
      this.store = new Store();
      this.model.init(objects);
      this.graph.centerContent();
      if (id) {
        this.initNodeId = id;
        let node = this.graph.getCellById(this.initNodeId);
        if (node) {
          this.graph.centerCell(node).resetSelection(node);
          this.activateNode(node);
        }
      } else {
        this.activateNode(null);
        this.initNodeId = null;
      }
      this.objList = objects;
    },

    dragToGraph(node, e) {
      if (this.action !== "0") return;
      let dragNode;
      switch (node.type) {
        case "NODE_ENTITY":
          dragNode = this.graph.createNode({
            id: uuidv4(),
            shape: "entity-object",
            width: config.nodeSize.width,
            height: config.nodeSize.height,
            ports: config.ports,
            data: {
              objType: "00",
              isNew: true,
              isClicked: false,
              designType: this.designType,
            },
          });
          break;
        case "NODE_VALUE":
          dragNode = this.graph.createNode({
            id: uuidv4(),
            shape: "value-object",
            width: config.nodeSize.width,
            height: config.nodeSize.height,
            ports: config.ports,
            data: {
              objType: "01",
              isNew: true,
              isClicked: false,
              designType: this.designType,
            },
          });
          break;
        case "NODE_AGGROOT":
          dragNode = this.graph.createNode({
            id: uuidv4(),
            shape: "aggroot-object",
            width: config.nodeSize.width,
            height: config.nodeSize.height,
            ports: config.ports,
            data: {
              objType: "02",
              isNew: true,
              isClicked: false,
              designType: this.designType,
            },
          });
          break;
        default:
          break;
      }
      this.dnd.start(dragNode, e);
    },

    activateNode(node) {
      if (node) {
        if (this.currentNode) {
          let data = this.currentNode.getData();
          this.currentNode.setData({ ...data, isClicked: false });

          if (data.objType != "10") {
            node.setZIndex(3);
          }
        }
        let _data = node.getData();
        if (_data.objType != "10") {
          node.setZIndex(4);
        }

        this.currentNode = node;
        let data = this.currentNode.getData();
        this.currentNode.setData({ ...data, isClicked: true });
      } else {
        if (this.currentNode) {
          let data = this.currentNode.getData();
          this.currentNode.setData({ ...data, isClicked: false });
        }
        this.currentNode = null;
      }
    },

    zoomTo(val) {
      this.graph.zoomTo(val / 100);
    },

    enablePointerMode() {
      this.graph.options.interacting = this.action === "0";
      this.graph.togglePanning(false);
      this.graph.toggleSelection(this.action === "0");
      this.initListeners(this.graph);
    },

    enablePanningMode() {
      this.graph.options.interacting = false;
      this.graph.togglePanning(true);
      this.graph.toggleSelection(false);
      this.offListeners(this.graph);
    },
    enableSelectingMode() {
      this.graph.options.interacting = this.action === "0";
      this.graph.togglePanning(false);
      this.graph.toggleSelection(this.action === "0");
      this.initListeners(this.graph);
    },
    hLineCenter() {
      const selectedNodes = this.graph
        .getSelectedCells()
        .filter(
          (cell) => this.graph.isNode(cell) && cell.getData().objType !== "10"
        );
      if (selectedNodes.length === 0) {
        return;
      }
      const avgY =
        selectedNodes.reduce((sum, node) => {
          const position = node.position();
          return sum + position.y;
        }, 0) / selectedNodes.length;
      selectedNodes.forEach((node) => {
        const position = node.position();
        node.position(position.x, avgY);
      });
    },
    vLineCenter() {
      const selectedNodes = this.graph
        .getSelectedCells()
        .filter(
          (cell) => this.graph.isNode(cell) && cell.getData().objType !== "10"
        );
      if (selectedNodes.length === 0) {
        return;
      }
      const avgX =
        selectedNodes.reduce((sum, node) => {
          const position = node.position();
          return sum + position.x;
        }, 0) / selectedNodes.length;
      selectedNodes.forEach((node) => {
        const position = node.position();
        node.position(avgX, position.y);
      });
    },
    hSpaceCenter() {
      const selectedNodes = this.graph
        .getSelectedCells()
        .filter(
          (cell) => this.graph.isNode(cell) && cell.getData().objType !== "10"
        );
      if (selectedNodes.length === 0) {
        return;
      }
      const sortedNodes = selectedNodes.sort((a, b) => {
        const posA = a.position();
        const posB = b.position();
        return posA.x - posB.x;
      });
      const firstNode = sortedNodes[0];
      const lastNode = sortedNodes[sortedNodes.length - 1];
      const firstPos = firstNode.position();
      const lastPos = lastNode.position();
      const totalWidth = lastPos.x - firstPos.x;
      const space = totalWidth / (sortedNodes.length - 1);
      sortedNodes.forEach((node, index) => {
        const position = node.position();
        const newX = firstPos.x + index * space;
        node.position(newX, position.y);
      });
      const avgY =
        selectedNodes.reduce((sum, node) => {
          const position = node.position();
          return sum + position.y;
        }, 0) / selectedNodes.length;
      selectedNodes.forEach((node) => {
        const position = node.position();
        node.position(position.x, avgY);
      });
    },
    vSpaceCenter() {
      const selectedNodes = this.graph
        .getSelectedCells()
        .filter(
          (cell) => this.graph.isNode(cell) && cell.getData().objType !== "10"
        );
      if (selectedNodes.length === 0) {
        return;
      }
      const sortedNodes = selectedNodes.sort((a, b) => {
        const posA = a.position();
        const posB = b.position();
        return posA.y - posB.y;
      });
      const firstNode = sortedNodes[0];
      const lastNode = sortedNodes[sortedNodes.length - 1];
      const firstPos = firstNode.position();
      const lastPos = lastNode.position();
      const totalHeight = lastPos.y - firstPos.y;
      const space = totalHeight / (sortedNodes.length - 1);
      sortedNodes.forEach((node, index) => {
        const position = node.position();
        const newY = firstPos.y + index * space;
        node.position(position.x, newY);
      });
      const avgX =
        selectedNodes.reduce((sum, node) => {
          const position = node.position();
          return sum + position.x;
        }, 0) / selectedNodes.length;
      selectedNodes.forEach((node) => {
        const position = node.position();
        node.position(avgX, position.y);
      });
    },
    shortcutSelect(key) {
      switch (key) {
        case "hcenter":
          this.hSpaceCenter();
          break;
        case "vcenter":
          this.vSpaceCenter();
          break;
        case "hline":
          this.hLineCenter();
          break;
        case "vline":
          this.vLineCenter();
          break;
        case "click":
          this.enablePointerMode();
          break;
        case "move":
          this.enablePanningMode();
          break;
        case "select":
          this.enableSelectingMode();
          break;
        case "undo":
          this.graph.cleanSelection().undo();
          break;
        case "redo":
          this.graph.cleanSelection().redo();
          break;
        case "delete":
          const selectedNodes = this.graph
            .getSelectedCells()
            .filter(
              (cell) =>
                this.graph.isNode(cell) && cell.getData().objType !== "10"
            );
          if (selectedNodes.length === 0) {
            return;
          }

          const hasRelNodes = selectedNodes.filter((node) => {
            const data = node.getData();
            return (
              Array.isArray(data.objectRelInfos) &&
              data.objectRelInfos.length > 0
            );
          });

          const noRelNodes = selectedNodes.filter((node) => {
            const data = node.getData();
            return (
              !Array.isArray(data.objectRelInfos) ||
              data.objectRelInfos.length === 0
            );
          });

          if (hasRelNodes.length > 0) {
            const hasRelObjects = hasRelNodes.map((node) => node.getData());
            const h = this.$createElement;
            this.$msgbox({
              title: "删除提示",
              message: h("div", null, [
                h(
                  "p",
                  {
                    style: {
                      width: "100%",
                    },
                  },
                  "以下对象存在对象关系，不允许删除"
                ),
                h(
                  "el-table",
                  {
                    style: { width: "100%", margin: "12px 0" },
                    props: {
                      size: "mini",
                      data: hasRelObjects,
                      border: true,
                      headerCellStyle: {
                        background: "#F5F5F8",
                        color: "#333",
                      },
                    },
                  },
                  [
                    h("el-table-column", {
                      props: {
                        prop: "objName",
                        label: "对象名称",
                      },
                    }),
                    h("el-table-column", {
                      props: {
                        prop: "objCode",
                        label: "对象编码",
                      },
                    }),
                  ]
                ),
              ]),
              showCancelButton: true,
              cancelButtonText: "取消",
              confirmButtonText:
                noRelNodes.length > 0
                  ? `删除其它 ${noRelNodes.length} 个对象`
                  : "确定",
            })
              .then(async () => {
                if (noRelNodes.length > 0) {
                  const objIds = noRelNodes.map((node) => {
                    const data = node.getData();
                    return data.objId;
                  });
                  await this.rpc.assetcenter.batchDelBizObj({
                    objIds: objIds,
                  });
                  this.$message.success("删除成功!");
                  this.graph.cleanSelection();
                  this.$refs.shortcut.setDisabledIcon(["delete"]);
                  noRelNodes.forEach((node) => {
                    node.remove();
                  });
                  this.$emit("refresh");
                }
              })
              .catch(() => {});
          } else {
            this.$confirm(
              `确定删除已选择的 ${noRelNodes.length} 个对象吗？`,
              "删除提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(async () => {
                const objIds = noRelNodes.map((node) => {
                  const data = node.getData();
                  return data.objId;
                });
                await this.rpc.assetcenter.batchDelBizObj({
                  objIds: objIds,
                });
                this.$message.success("删除成功!");
                this.graph.cleanSelection();
                this.$refs.shortcut.setDisabledIcon(["delete"]);
                noRelNodes.forEach((node) => {
                  node.remove();
                });
                this.$emit("refresh");
              })
              .catch(() => {});
          }

        default:
          break;
      }
    },
    async addNode(node, objId, aggregationBaseInfo) {
      this.$emit("refresh");
      this.model.updateNodeMap(objId);
      let res = await this.rpc.assetcenter.qryBizObjectInfoV2({
        objId: objId,
        belongId: this.project.projectId,
        belongType: "app",
        designType: "domain_model",
      });
      res = {
        ...res,
        attributeCount: res.attributeInfos.length,
        behaviorCount: res.objectBehaviorInfos.length,
        sysObjCount: res.l5ObjIds.length,
      };

      this.objList.push(res);
      node.updateData(res);
      node.setData({ isNew: false });
      const _json = node.toJSON();
      _json.id = res.objId;
      node.remove();
      let child = this.graph.addNode(_json);
      if (Array.isArray(res.objectRelInfos) && res.objectRelInfos.length) {
        if (res.objType == "02" && aggregationBaseInfo) {
          let position = node.position();
          let aggObjs = res.objectRelInfos.filter(
            (i) => i.obrRelash == "aggregation"
          );

          const parent = this.graph.addNode({
            id: aggregationBaseInfo.aggregationId,
            shape: "aggroot-container",
            width: 220 + aggObjs.length * 200,
            height: 300,
            x: position.x - config.embedPadding,
            y: position.y - 80,
            zIndex: 1,
            data: {
              ...aggregationBaseInfo,
              aggRoot: res,
              objType: "10",
              isNew: false,
              isClicked: false,
              designType: this.designType,
            },
          });

          parent.addChild(child);

          let aggNodes = aggObjs.map((i) => {
            return this.graph.getCellById(i.tgtObjId);
          });
          for (let i in aggNodes) {
            let x = position.x + 200 * (i + 1);
            aggNodes[i].position(x, position.y);
            parent.addChild(aggNodes[i]);
          }
        }

        res.objectRelInfos.forEach((rel) => {
          this.model.createSingleLine(rel);
        });
      }
    },
    async removeObj(objId) {
      let node = this.graph.getCellById(objId);
      this.currentAgg.removeChild(node);
      this.$emit("refresh", false);
    },
    async updateAgg(info) {
      let data = this.currentAgg.getData;
      this.currentAgg.updateData({ ...data, ...info });
      this.showEditAgg = false;
      this.currentAgg = null;
    },
    async updateNode(node) {
      this.$emit("refresh");
      let data = node.getData();
      let res = await this.rpc.assetcenter.qryBizObjectInfoV2({
        objId: data.objId,
        belongId: this.project.projectId,
        belongType: "app",
        designType: "domain_model",
      });
      res = {
        ...res,
        attributeCount: res.attributeInfos.length,
        behaviorCount: res.objectBehaviorInfos.length,
        sysObjCount: res.l5ObjIds.length,
      };
      node.updateData(res);
      const startEdges = this.graph.getConnectedEdges(node, {
        outgoing: true,
      });
      startEdges.forEach((edge) => {
        this.graph.removeCell(edge);
      });
      if (Array.isArray(res.objectRelInfos) && res.objectRelInfos.length) {
        res.objectRelInfos.forEach((rel) => {
          this.model.createSingleLine(rel);
        });
      }
    },
    cancelNode(node) {
      node.remove();
    },
    cancelAddRel(edge) {
      if (edge) {
        let edgeId = edge.prop("id");
        if (!edgeId.startsWith("edge")) {
          this.graph.removeEdge(edge);
        }
      }
    },
    async optRelation(relation, edge) {
      const cur = await this.rpc.assetcenter.qryBizObjectInfoV2({
        objId: relation.curObjId,
        belongId: this.project.projectId,
        belongType: "app",
        designType: this.designType,
      });

      let edgeData = edge.getData();

      let edgeProps =
        edgeData && edgeData.edgeProps ? JSON.parse(edgeData.edgeProps) : {};
      const sourcePort = edge.getSourcePortId() || "";
      const targetPort = edge.getTargetPortId() || "";
      edgeProps.sourcePort = sourcePort;
      edgeProps.targetPort = targetPort;
      relation.edgeProps = JSON.stringify(edgeProps);
      relation.belongId = this.project.projectId;
      relation.belongType = "app";
      relation.designType = this.designType;

      let edgeId = edge.prop("id");
      if (edgeId.startsWith("edge")) {
        cur.objectRelInfos.forEach((r, index) => {
          if (
            r.curObjId == relation.curObjId &&
            r.tgtObjId == relation.tgtObjId
          ) {
            cur.objectRelInfos[index] = relation;
          }
        });
      } else {
        cur.objectRelInfos.push(relation);
      }
      await this.rpc.assetcenter.saveBizObjectInfoV2(cur);

      let nodeId = cur.objId;
      let node = this.graph.getCellById(nodeId);
      node.updateData(cur);

      this.graph.removeEdge(edge);

      let res = await this.rpc.assetcenter.qryBizObjectInfoV2({
        objId: cur.objId,
        belongId: this.project.projectId,
        belongType: "app",
        designType: "domain_model",
      });

      res.objectRelInfos.forEach((rel) => {
        if (
          rel.curObjId == relation.curObjId &&
          rel.tgtObjId == relation.tgtObjId
        ) {
          this.model.createSingleLine(rel);
        }
      });
      this.$message.success("保存成功!");
    },
    delRelation(edge) {
      if (edge) {
        let edgeId = edge.prop("id");
        if (edgeId.startsWith("edge")) {
          const source = edge.getSourceCell();
          const sourceData = source.getData();
          const target = edge.getTargetCell();
          const targetData = target.getData();
          sourceData.objectRelInfos = sourceData.objectRelInfos.filter(
            (rel) => rel.tgtObjId !== targetData.objId
          );
          source.updateData(sourceData);
          targetData.objectRelInfos = targetData.objectRelInfos.filter(
            (rel) => rel.tgtObjId !== sourceData.objId
          );
          target.updateData(targetData);

          this.graph.removeEdge(edge);
        }
      }
    },

    async changeColor(colorObj) {
      const selectedNodes = this.graph
        .getSelectedCells()
        .filter(
          (cell) => this.graph.isNode(cell) && cell.getData().objType !== "10"
        );
      if (selectedNodes.length === 0) {
        return;
      }
      const saveObjLocationInfoList = selectedNodes.map((node) => {
        let nodeData = node.getData();
        let position = node.position();
        let size = node.size();
        let nodeProps = nodeData.nodeProps
          ? JSON.parse(nodeData.nodeProps)
          : {};
        nodeProps.x = Math.round(position.x);
        nodeProps.y = Math.round(position.y);
        nodeProps.size = size;
        nodeProps.bgColor = colorObj.color;
        nodeProps.fontColor = colorObj.fontColor;
        return {
          nodeProps: JSON.stringify(nodeProps),
          targetId:
            nodeData.objType == "10" ? nodeData.aggregationId : nodeData.objId,
          targetType: ["00", "01"].includes(nodeData.objType)
            ? "object"
            : "aggregation",
        };
      });
      await this.rpc.assetcenter.saveObjLocationInfo({
        belongId: this.project.projectId,
        belongType: "app",
        designType: "domain_model",
        saveObjLocationInfoList,
        partialUpdateFlag: true,
      });
      this.$message.success("颜色修改成功!");
      selectedNodes.forEach((node) => {
        let data = node.getData();
        let nodeProps = data.nodeProps ? JSON.parse(data.nodeProps) : {};
        nodeProps.bgColor = colorObj.color;
        nodeProps.fontColor = colorObj.fontColor;
        let updatedData = { ...data, nodeProps: JSON.stringify(nodeProps) };
        node.setData(updatedData);
      });
    },
    async importObjectList(objs) {
      this.showImportObjectDialog = false;
      this.$emit("refresh", false, objs[objs.length - 1].objId);
    },
  },
};
</script>

<style lang="scss" scoped>
#object-graph {
  width: 100%;
  height: 100%;
  flex: 1;
  position: relative;
  overflow: hidden;
}
#graph-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
