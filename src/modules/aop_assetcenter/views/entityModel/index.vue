<template>
  <div class="object-graph-design">
    <Header
      :bizDomainNo="bizDomainNo"
      :action="action"
      @changeBizDomain="changeBizDomain"
      @save="save"
      @exportImage="exportImage"
      @openBiz="openBiz"
    />
    <div class="content">
      <Sider
        ref="sider"
        :bizDomainNo="bizDomainNo"
        :action="action"
        :designType="designType"
        @changeProject="changeProject"
        @startDrag="startDrag"
        @operateObject="operateObject"
        @updateTab="(t) => (tab = t)"
        @clear="clear"
      />
      <graph
        ref="graph"
        :project="project"
        :bizDomainNo="bizDomainNo"
        :designType="designType"
        :action="action"
        @refresh="refresh"
        @update="update"
        v-loading="loading"
      />
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import graph from "./graph.vue";
import Header from "./components/Header.vue";
import Sider from "./components/Sider.vue";
import { NodeTypeTagText } from "./components/nodeType";
export default {
  name: "BusinessObjectGraphDesign",
  mixins: [mixin],
  props: {
    forceViewMode: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    graph,
    Header,
    Sider,
  },
  data() {
    return {
      bizDomainNo: "",
      projectId: "",
      initObjId: "",
      project: null,
      loading: false,

      tab: "1",
      treeNodeData: null,
      NodeTypeTagText,

      action: "0",
      designType: "domain_model",

      centerId: "",
    };
  },
  created() {
    const { bizDomainNo, projectId, objId, action } = this.$route.query;
    this.bizDomainNo = bizDomainNo || "";
    this.projectId = projectId || "";
    this.initObjId = objId || "";
    this.action = this.forceViewMode
      ? "1"
      : ["0", "1"].includes(action)
      ? action
      : "0";
  },
  methods: {
    changeBizDomain(value) {
      this.bizDomainNo = value;
    },
    async changeProject(project, infoList, f = false) {
      this.project = project;
      this.projectId = project.projectId;
      this.$refs.graph.renderObjects(
        infoList,
        f ? this.initObjId : this.centerId
      );
    },
    startDrag(node, event) {
      this.$refs.graph.dragToGraph(node, event);
    },
    operateObject(type, obj) {
      let nodeId = obj.objId;
      if (nodeId) {
        let node = this.$refs.graph.graph.getCellById(nodeId);
        if (node) {
          switch (type) {
            case "select":
              this.$refs.graph.graph.centerCell(node).resetSelection(node);
              this.$refs.graph.activateNode(node);
              break;
            case "delete":
              this.$refs.graph.deleteNode(node);
              break;
            case "edit":
              this.$refs.graph.graph.centerCell(node).resetSelection(node);
              this.$refs.graph.activateNode(node);
              this.$refs.graph.$refs.addObject.show(node);
              break;
            default:
              break;
          }
        }
      }
    },
    async refresh(f = true, initObjId = "") {
      if (initObjId) {
        this.centerId = initObjId;
      } else {
        this.centerId = "";
      }
      await this.$refs.sider.refresh(f);
    },
    async save() {
      let designType = "domain_model";
      const nodes = this.$refs.graph.graph.getNodes();
      const saveObjLocationInfoList = nodes.map((node) => {
        let nodeData = node.getData();
        let position = node.position();
        let size = node.size();
        let nodeProps = nodeData.nodeProps
          ? JSON.parse(nodeData.nodeProps)
          : {};
        nodeProps.x = Math.round(position.x);
        nodeProps.y = Math.round(position.y);
        nodeProps.bgColor = nodeProps.bgColor || "";
        nodeProps.fontColor = nodeProps.fontColor || "";
        nodeProps.size = size;
        return {
          nodeProps: JSON.stringify(nodeProps),
          targetId:
            nodeData.objType == "10" ? nodeData.aggregationId : nodeData.objId,
          targetType: ["00", "01", "02"].includes(nodeData.objType)
            ? "object"
            : "aggregation",
        };
      });

      const edges = this.$refs.graph.graph.getEdges();
      let infoList = edges.map((edge) => {
        let edgeData = edge.getData();

        let edgeProps = edgeData.edgeProps
          ? JSON.parse(edgeData.edgeProps)
          : {};
        let vertices = edge.getVertices().map((vertex) => ({
          x: Math.round(vertex.x),
          y: Math.round(vertex.y),
        }));
        edgeProps[designType] = {
          vertices,
        };
        const sourcePort = edge.getSourcePortId() || "";
        const targetPort = edge.getTargetPortId() || "";
        edgeProps.sourcePort = sourcePort;
        edgeProps.targetPort = targetPort;
        return {
          edgeProps: JSON.stringify(edgeProps),
          obrId: edgeData.obrId,
          edgePropsId: edgeData.edgePropsId || "",
          belongId: this.projectId,
          belongType: "app",
          designType,
        };
      });

      await this.rpc.assetcenter.saveObjLocationInfo({
        belongId: this.projectId,
        belongType: "app",
        designType,
        saveObjLocationInfoList,
        partialUpdateFlag: false,
      });

      if (infoList.length) {
        await this.rpc.assetcenter.updateBizObjRelEdgeProps({
          infoList,
        });
      }

      this.$message.success("保存成功!");
    },
    exportImage() {
      let filename = `${this.project.bizDomainNm}-${this.project.projectNm}-业务对象关系图`;
      this.$refs.graph.customExport(filename);
    },
    openBiz() {
      window.open(
        `/aop-h5-sub/#/aop_businessmold2/modelDesign/objectGraphDesign?bizDomainNo=${this.bizDomainNo}&projectId=${this.projectId}`,
        "_blank"
      );
    },
    clear() {
      this.$refs.graph.clear();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles/mixin.scss";
.object-graph-design {
  width: 100% !important;
  height: 100% !important;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  background: #edeeef;
  @include flex(column, flex-start, center);
  .content {
    flex: 1;
    width: 100%;
    @include flex(row, flex-start, center);
  }
}
/deep/ .el-tag--mini {
  height: 16px !important;
  line-height: 15px !important;
  padding: 0 2px !important;
}
</style>
