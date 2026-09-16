import { EventType } from "@logicflow/core";
import BasicManage from "./basicManage";
import {
    laneTypes,
    solidTypes,
    customEventType,
    processType,
    nodeType,
} from "../adapter/typeMap";
import { checkPointInGroup } from "../utils";

export default class ContextmenuManage extends BasicManage {
    constructor(context) {
        super(context);
        const lf = this.logic;

        lf.on(
            EventType.SELECTION_CONTEXTMENU,
            this.selectionContextmenu.bind(this)
        );
        lf.on(EventType.NODE_CONTEXTMENU, this.nodeContextmenu.bind(this));
    }

    nodeContextmenu({ data, position }) {
        const nodeData = data.properties?.data;
        const lf = this.logic;
        const isLane = laneTypes.includes(data.type);
        const contextmenuPoz = position.canvasOverlayPosition;
        const { stepGroup, trackGroup } = data.properties;
        console.log(data.properties);
        
        const matchStep = checkPointInGroup(contextmenuPoz, stepGroup);
        const matchTrack = checkPointInGroup(contextmenuPoz, trackGroup);

        lf.extension.menu.setMenuByType({
            type: data.type,
            menu: [
                isLane ||
                [nodeType.CONNECT_START, nodeType.CONNECT_END].includes(
                    data.type
                )
                    ? null
                    : {
                          text: "编排接口",
                          callback: () => {
                              this.eventManage.emit(
                                  customEventType.NODE_CONFIG,
                                  data
                              );
                          },
                      },
                isLane
                    ? {
                          text: "选中全部子节点",
                          callback: () => {
                              this.nodeManage.selectNodesByIds(data.children);
                          },
                      }
                    : null,
                matchTrack
                    ? {
                          text: "选中当前泳道子节点",
                          callback: () => {
                              this.nodeManage.selectNodesByIds(
                                  matchTrack.children
                              );
                          },
                      }
                    : null,
                {
                    text: "删除",
                    callback: () => {
                        lf.deleteNode(data.id);
                    },
                },
            ].filter(Boolean),
        });
    }

    selectionContextmenu() {
        const lf = this.logic;

        lf.extension.menu.setMenuByType({
            type: "lf:defaultSelectionMenu",
            menu: [
                {
                    text: "删除",
                    callback: ({ nodes, edges }) => {
                        edges.forEach((e) => {
                            lf.deleteEdge(e.id);
                        });

                        nodes.forEach((n) => {
                            lf.deleteNode(n.id);
                        });
                    },
                },
            ].filter(Boolean),
        });
    }
}
