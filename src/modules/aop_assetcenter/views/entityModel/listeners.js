export function addGraphListeners(graph, ctx) {
    graph.on("node:mouseenter", ({ view }) => {
        if (ctx.action !== "0") return;
        view.container
            .querySelectorAll(".x6-port-body")
            .forEach((p) => (p.style.display = "block"));
    });
    graph.on("node:mouseleave", ({ view }) => {
        if (ctx.action !== "0") return;
        view.container
            .querySelectorAll(".x6-port-body")
            .forEach((p) => (p.style.display = "none"));
    });
    graph.on("blank:click", () => {
        ctx.activateNode(null);
    });
    graph.on("history:change", (e) => {
        if (ctx.action == "0") {
            let undo = ctx.graph.canUndo();
            let redo = ctx.graph.canRedo();
            let command = [];
            let uncommand = [];
            if (undo) {
                command.push("undo");
            } else {
                uncommand.push("undo");
            }
            if (redo) {
                command.push("redo");
            } else {
                uncommand.push("redo");
            }
            if (command.length) {
                ctx.$refs.shortcut.cleanDisabledIcon(command);
            }
            if (uncommand.length) {
                ctx.$refs.shortcut.setDisabledIcon(uncommand);
            }
        }
    });

    graph.on("node:embedding", ({ e }) => {
        ctx.ctrlPressed = e.metaKey || e.ctrlKey;
    });

    graph.on("node:change:size", ({ node, options }) => {
        if (options.skipParentHandler) {
            return;
        }

        const children = node.getChildren();
        if (children && children.length) {
            node.prop("originSize", node.getSize());
        }
    });

    graph.on("node:change:position", ({ node, options }) => {
        if (options.skipParentHandler || ctx.ctrlPressed) {
            return;
        }

        const children = node.getChildren();
        if (children && children.length) {
            node.prop("originPosition", node.getPosition());
        }

        const parent = node.getParent();
        if (parent && parent.isNode()) {
            let originSize = parent.prop("originSize");
            if (originSize == null) {
                originSize = parent.getSize();
                parent.prop("originSize", originSize);
            }

            let originPosition = parent.prop("originPosition");
            if (originPosition == null) {
                originPosition = parent.getPosition();
                parent.prop("originPosition", originPosition);
            }

            let x = originPosition.x;
            let y = originPosition.y;
            let cornerX = originPosition.x + originSize.width;
            let cornerY = originPosition.y + originSize.height;
            let hasChange = false;

            const children = parent.getChildren();
            if (children) {
                children.forEach((child) => {
                    const bbox = child.getBBox().inflate(20);
                    const corner = bbox.getCorner();

                    if (bbox.x < x) {
                        x = bbox.x;
                        hasChange = true;
                    }

                    if (bbox.y < y) {
                        y = bbox.y;
                        hasChange = true;
                    }

                    if (corner.x > cornerX) {
                        cornerX = corner.x;
                        hasChange = true;
                    }

                    if (corner.y > cornerY) {
                        cornerY = corner.y;
                        hasChange = true;
                    }
                });
            }

            if (hasChange) {
                parent.prop(
                    {
                        position: { x, y },
                        size: { width: cornerX - x, height: cornerY - y },
                    },
                    { skipParentHandler: true }
                );
            }
        }
    });

    graph.on("node:move", ({ node }) => {
        const edges = graph.getConnectedEdges(node, {
            outgoing: true,
            incoming: true,
        });
        edges.forEach((edge) => {
            if (edge.getVertices().length > 0) {
                edge.setVertices([]);
                edge.refresh();
            }
        });
    });



    graph.on("edge:mouseenter", ({ cell }) => {
        if (ctx.action !== "0") return;
        cell.addTools([
            {
                name: "vertices",
                args: {
                    attrs: {
                        r: 12,
                        fill: "#409eff",
                        stroke: "#fff",
                        cursor: "move",
                        "stroke-width": 2,
                    },
                },
            },
            {
                name: "target-arrowhead",
                args: {
                    attrs: {
                        fill: "#409eff",
                        d: "M -15 -12 5 0 -15 12 Z",
                        cursor: "move",
                    },
                },
            },
            {
                name: "source-arrowhead",
                args: {
                    attrs: {
                        fill: "#409eff",
                        d: "M 15 -12 -5 0 15 12 Z",
                        cursor: "move",
                    },
                },
            },
            {
                      name: "button",
                      args: {
                          markup: [
                              {
                                  tagName: "circle",
                                  selector: "button",
                                  attrs: {
                                      r: 14,
                                      stroke: "#fe854f",
                                      strokeWidth: 2,
                                      fill: "white",
                                      cursor: "pointer",
                                  },
                              },
                              {
                                  tagName: "text",
                                  textContent: "编辑",
                                  selector: "icon",
                                  attrs: {
                                      fill: "#fe854f",
                                      fontSize: 10,
                                      textAnchor: "middle",
                                      pointerEvents: "none",
                                      y: "0.3em",
                                  },
                              },
                          ],
                          distance: 60,
                          onClick({ view }) {
                              const edge = view.cell;
                              const source = edge.getSourceCell();
                              const sourceData = source.getData();
                              const target = edge.getTargetCell();
                              const targetData = target.getData();
                              const relation = edge.getData();
                              let all = ctx.objList.filter(
                                  (i) => i.objType == "00" || i.objType == "01"
                              );
                              let targetObjList = _.differenceBy(
                                  all,
                                  [sourceData],
                                  "objId"
                              );
                              ctx.$refs.addRelDialog.show(
                                  sourceData,
                                  relation,
                                  targetData,
                                  targetObjList,
                                  edge
                              );
                          },
                      },
                  },
        ]);
    });

    graph.on("edge:mouseleave", ({ cell }) => {
        cell.removeTools();
    });
}


