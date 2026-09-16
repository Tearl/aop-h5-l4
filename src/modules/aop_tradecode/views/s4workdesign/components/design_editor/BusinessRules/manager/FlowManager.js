import { Graph } from "@antv/x6";

export default class FlowManager {
    /**
     * 获取流程映射关系
     * @param {Array} flowList
     * @returns
     */
    static getFlowMap(flowList = []) {
        return flowList.reduce((retObj, flow) => {
            retObj[flow.flowId] = flow;
            return retObj;
        }, {});
    }

    /**
     * 创建图形对象
     * @param {Object} options
     * @returns
     */
    static createGraph(options = {}) {
        let defaultOptions = {
            width: 2000,
            height: 2000,
            panning: {
                enabled: true,
                eventTypes: ["leftMouseDown", "rightMouseDown", "mouseWheel"],
            },
            scroller: {
                enabled: false,
                pannable: true,
                pageVisible: true,
                pageBreak: false,
            },
            interacting: {
                nodeMovable: false,
            },
            mousewheel: {
                enabled: true,
                modifiers: ["ctrl", "meta"],
            },
        };
        return new Graph(Object.assign(defaultOptions, options));
    }

    /**
     * 获取图形数据
     * @param {Object} flowInfo 处理流程信息
     * @returns
     */
    static getGraphData(flowInfo, orderId = "") {
        let nodes = [],
            edges = [],
            vectorX = 300,
            vectorY = 0;
        let { stepDefineList = [], stepList: stepDesignList = [] } = flowInfo;
        let stepList = stepDefineList,
            stepRect;
        if (orderId == "D2") {
            stepList = stepDefineList;
        } else if (orderId == "C3") {
            stepList = stepDesignList;
        }
        if (stepList.length) {
            stepRect = stepList[0].rect;
            vectorX = stepRect.x > 200 ? stepRect.x - 100 : 0;
            vectorY = stepRect.y > 200 ? stepRect.y - 100 : 0;
        }

        // 遍历步骤生成流程图数据
        stepList.forEach((step) => {
            stepRect = step.rect;
            // 步骤节点处理
            nodes.push({
                id: step.stepId,
                x: stepRect.x - vectorX,
                y: stepRect.y - vectorY,
                width: stepRect.width || 100,
                height: stepRect.height || 48,
                nodeType:
                    step.action.className === "InteractiveDetermineAction"
                        ? "diamond"
                        : step.action.shapeType,
                markup: [
                    {
                        tagName:
                            step.action.className ===
                            "InteractiveDetermineAction"
                                ? "polygon"
                                : "rect",
                        selector: "body",
                    },
                    {
                        tagName: "text",
                        selector: "label",
                    },
                    {
                        tagName: "rect",
                        selector: "tbody",
                    },
                    {
                        tagName: "text",
                        selector: "title",
                    },
                ],
                attrs: this.getNodeStyle(
                    step.action.shapeType,
                    step.name || step.action.name,
                    stepRect.width || 100
                ),
                data: step,
            });

            // 步骤连接处理
            step.transitionList.forEach((trans) => {
                edges.push({
                    source: step.stepId,
                    target: trans.targetId,
                    attrs: {
                        line: {
                            stroke: "#333",
                        },
                    },
                    labels:
                        trans.name && trans.name.trim() != ""
                            ? [
                                  {
                                      attrs: {
                                          text: {
                                              text: trans.name,
                                          },
                                      },
                                  },
                              ]
                            : [],
                });
            });
        });
        return { nodes, edges };
    }

    /**
     * 获取节点样式
     * @param {String} shapeType 节点形状
     * @param {String} label 节点标题
     * @returns
     */
    static getNodeStyle(shapeType, label, width) {
        switch (shapeType) {
            case "diamond":
                // 钻石形状
                return {
                    body: {
                        fill: "#E7F1FF",
                        stroke: "#358AFF",
                        refPoints: "0,10 10,0 20,10 10,20",
                        cursor: "pointer",
                    },
                    label: {
                        text: label,
                        fill: "#358AFF",
                        fontSize: 12,
                        cursor: "pointer",
                    },
                    tbody: {
                        fill: "#FF9104",
                        stroke: "#FF9104",
                        width: 60,
                        height: 20,
                        refX: 102,
                    },
                    title: {
                        text: "前端校验",
                        fill: "#FFFFFF",
                        fontSize: 12,
                        refX: (width / 3) * 4,
                        refY: 10,
                    },
                };
            case "rect":
                // 矩形
                return {
                    body: {
                        fill: "#E7F1FF",
                        stroke: "#358AFF",
                        cursor: "pointer",
                    },
                    label: {
                        text: label,
                        fill: "#358AFF",
                        fontSize: 12,
                        cursor: "pointer",
                    },
                    tbody: {
                        fill: "#FF9104",
                        stroke: "#FF9104",
                        width: 60,
                        height: 20,
                        refX: 102,
                    },
                    title: {
                        text: "前端校验",
                        fill: "#FFFFFF",
                        fontSize: 12,
                        refX: (width / 3) * 4,
                        refY: 10,
                    },
                };
            case "roundrect":
                // 圆角矩形
                return {
                    body: {
                        fill: "#FFFFFF",
                        stroke: "#f7f7f9",
                        rx: 16,
                        ry: 16,
                        cursor: "pointer",
                    },
                    label: {
                        text: label,
                        fill: "#000",
                        fontSize: 12,
                        cursor: "pointer",
                    },
                };
            case "service":
                // 服务
                return {
                    body: {
                        fill: "#5daf34",
                        stroke: "#5daf34",
                        rx: 8,
                        ry: 8,
                        cursor: "pointer",
                    },
                    label: {
                        text: label,
                        fill: "#fff",
                        fontSize: 12,
                        cursor: "pointer",
                    },
                    tbody: {
                        fill: "#36D542",
                        stroke: "#36D542",
                        width: 60,
                        height: 20,
                        refX: 102,
                    },
                    title: {
                        text: "服务处理",
                        fill: "#FFFFFF",
                        fontSize: 12,
                        refX: (width / 3) * 4,
                        refY: 10,
                    },
                };
            default:
                return {
                    body: {
                        fill: "#E7F1FF",
                        stroke: "#358AFF",
                        cursor: "pointer",
                    },
                    label: {
                        text: label,
                        fill: "#358AFF",
                        fontSize: 12,
                        cursor: "pointer",
                    },
                };
        }
    }
}
