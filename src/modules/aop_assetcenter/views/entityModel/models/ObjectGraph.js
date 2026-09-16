import Basic from "./Basic";
import config from "../config";
export default class ObjectGraph extends Basic {
    constructor(context) {
        super(context);
        this.nodeCodeMap = {}
    }
    init(objects) {
        let nodes = [],
            noLocationNodes = [],
            edges = [];
        this.nodeCodeMap = {};
        let relations = [];
        let aggList = [];
        objects.forEach((object) => {
            if (object.objType) this.nodeCodeMap[object.objId] = true;
            relations.push(...object.objectRelInfos);
            let node = {};
            let nodeProps = object.nodeProps
                ? JSON.parse(object.nodeProps)
                : null;
            node = {
                id: object.objId,
                width: config.nodeSize.width,
                height: config.nodeSize.height,
                zIndex: 3,
                data: {
                    ...object,
                    isNew: false,
                    isClicked: false,
                    designType: this.ctx.designType,
                    action: this.ctx.action,
                },
                ports: config.ports,
                isShow: true,
            };
            switch (object.objType) {
                case "00":
                    node.shape = "entity-object";
                    break;
                case "01":
                    node.shape = "value-object";
                    break;
                case "02":
                    node.shape = "aggroot-object";
                    break;
                default:
                    node.isShow = false;
                    break;
            }
            if (node.isShow) {
                if (nodeProps && nodeProps.x && nodeProps.y) {
                    node.x = Number(nodeProps.x);
                    node.y = Number(nodeProps.y);
                    nodes.push(node);
                } else {
                    noLocationNodes.push(node);
                }
            }

            if (object.objType == "02" && object.aggregationBaseInfo) {
                aggList.push({ ...object.aggregationBaseInfo, aggRoot: object});
            }
        });

        if (noLocationNodes.length) {
            const total = noLocationNodes.length;
            const cols = Math.ceil(Math.sqrt(total));
            const containerWidth = this.graph.container.clientWidth;
            const gapX = config.nodeSize.width + 20;
            const gapY = config.nodeSize.height + 20;
            const startX = containerWidth - cols * gapX;
            const startY = 50;
            noLocationNodes.forEach((node, idx) => {
                const row = Math.floor(idx / cols);
                const col = idx % cols;
                node.x = startX + col * gapX;
                node.y = startY + row * gapY;
                nodes.push(node);
            });
        }
        this.graph.addNodes(nodes);

        if (aggList.length) {
            aggList.forEach(agg => {
                let objIds = agg.objIds.split(",");
                let aggRoot = this.graph.getCellById(agg.aggRoot.objId);
                let position = aggRoot.position();
                let aggregationNodeProps = agg.aggregationNodeProps
                    ? JSON.parse(agg.aggregationNodeProps)
                    : null;
                let parent = null;
                
                if (aggregationNodeProps) {
                    parent = this.graph.addNode({
                        id: agg.aggregationId,
                        shape: "aggroot-container",
                        width: aggregationNodeProps.size.width,
                        height: aggregationNodeProps.size.height,
                        x: aggregationNodeProps.x,
                        y: aggregationNodeProps.y,
                        zIndex: 1,
                        data: {
                            ...agg,
                            objType: "10",
                            isNew: false,
                            isClicked: false,
                            designType: this.designType,
                        },
                    });
                    objIds.forEach((id) => {
                        let _node = this.graph.getCellById(id);
                        parent.addChild(_node);
                    });
                } else {
                    parent = this.graph.addNode({
                        id: agg.aggregationId,
                        shape: "aggroot-container",
                        width: objIds.length * 200 + 20,
                        height: 300,
                        x: position.x - 20,
                        y: position.y - 80,
                        zIndex: 1,
                        data: {
                            ...agg,
                            objType: "10",
                            isNew: false,
                            isClicked: false,
                            designType: this.designType,
                        },
                    });
                    objIds.forEach((id, index) => {
                        let _node = this.graph.getCellById(id);
                        _node.position(position.x + index * 200, position.y);
                        parent.addChild(_node, {
                            autoPosition: true,
                        });
                    });
                }
                
            })
        }
        relations = relations.reduce((pre, relation) => {
            let { curObjId, tgtObjId, relConvert } = relation;
            if (this.nodeCodeMap[curObjId] && this.nodeCodeMap[tgtObjId] && !relConvert) {
                pre.push(relation);
            }
            return pre;
        }, []);

        edges = relations.map((relation) => {
            let {
                curObjId,
                tgtObjId,
                obrRelash,
                object1Multiplicity,
                object2Multiplicity,
                edgeProps,
            } = relation;
            let edgePropsObj = edgeProps ? JSON.parse(edgeProps) : {};
            let vertices = [];
            if (edgePropsObj && edgePropsObj[this.designType]) {
                vertices = edgePropsObj[this.designType].vertices;
            }
            
            const sourcePort = edgePropsObj.sourcePort || "";
            const targetPort = edgePropsObj.targetPort || "";

            return {
                id: `edge-${curObjId}-${tgtObjId}`,
                shape: "edge",
                zIndex: 9,
                source: { cell: curObjId, port: sourcePort, anchor: "orth" },
                target: { cell: tgtObjId, port: targetPort, anchor: "orth" },
                attrs: {
                    line: {
                        stroke: "#333",
                        strokeWidth: 2,
                        targetMarker: this.marker(obrRelash),
                    },
                },
                labels: [this.label(object1Multiplicity, object2Multiplicity)],
                data: relation,
                vertices,
            };
        });
        this.graph.addEdges(edges);
    }

    marker(value) {
        let name = "path";
        switch (value) {
            case "combination":
                return {
                    name,
                    d: "M 30 10 L 20 16 L 10 10 L 20 4 z",
                    fill: "black",
                    offsetX: -10,
                };
            case "aggregation":
                return {
                    name,
                    d: "M 30 10 L 20 16 L 10 10 L 20 4 z",
                    fill: "white",
                    offsetX: -10,
                };
            case "association":
                return {
                    name,
                    d: "M 6 10 L 18 4 C 14.3333 6 10.6667 8 7 10 L 18 16 z",
                    strokeWidth: 2,
                    offsetX: -7,
                };
            case "extends":
                return {
                    name,
                    d: "M 14 -8 0 0 14 8 Z",
                    fill: "white",
                    offsetX: -7,
                };
        }
    }
    relationshipValue(value) {
        let map = {
            "0-N": "1:0..*",
            "1-N": "1:1..*",
            "0-1": "1:0..1",
            "1-1": "1:1",
            "N-0": "1:1",
            "N-1": "1:1",
            "1-0": "1:0..1",
        };
        return map[value];
    }
    label(o1, o2) {
        let text = "/"
        if (o1 && o2) {
            text = this.relationshipValue(`${o1}-${o2}`);
        }
        return {
            attrs: {
                label: {
                    text,
                },
                rect: {
                    ref: "label",
                    stroke: "rgba(31,56,88,.6)",
                    strokeWidth: 2,
                    rx: 4,
                    ry: 4,
                    refWidth: "140%",
                    refHeight: "100%",
                    refX: "-20%",
                    refY: "-0%",
                    cursor: "pointer",
                },
            },
            position: {
                options: {
                    keepGradient: true,
                    ensureLegibility: true,
                },
            },
        };
    }

    updateNodeMap(objId) {
        this.nodeCodeMap[objId] = true;
    }
    createSingleLine(relation) {
        let {
            curObjId,
            tgtObjId,
            obrRelash,
            object1Multiplicity,
            object2Multiplicity,
            relConvert,
            edgeProps,
        } = relation;
        if (this.nodeCodeMap[curObjId] && this.nodeCodeMap[tgtObjId] && !relConvert) {
            let edgePropsObj = edgeProps ? JSON.parse(edgeProps) : {};
            let vertices = [];
            if (edgePropsObj && edgePropsObj[this.designType]) {
                vertices = edgePropsObj[this.designType].vertices;
            }
            const sourcePort = edgePropsObj.sourcePort || "";
            const targetPort = edgePropsObj.targetPort || "";

            let newEdge = {
                id: `edge-${curObjId}-${tgtObjId}`,
                shape: "edge",
                zIndex: 9,
                source: { cell: curObjId, port: sourcePort },
                target: { cell: tgtObjId, port: targetPort },
                attrs: {
                    line: {
                        stroke: "#333",
                        strokeWidth: 2,
                        targetMarker: this.marker(obrRelash),
                    },
                },
                labels: [this.label(object1Multiplicity, object2Multiplicity)],
                data: relation,
                vertices,
                // connector: "smooth",
            };
            this.graph.addEdge(newEdge);
        }
        
    }
}


