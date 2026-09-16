import LogicFlow from "@logicflow/core"
import {
    Menu,
    SelectionSelect,
    DynamicGroup,
    Snapshot,
    // Highlight,
    // ProximityConnect
} from '@logicflow/extension'
import { config, theme } from "../config"

import Adapter from "../adapter"

//注册自定义类型
import RegisterManage from "./registerManage"
import EventManage from "./eventManage"
import NodeManage from "./nodeManage"
import EdgeManage from "./edgeManage"
import TextManage from "./textManage"
import KeyboardManage from "./keyboardManage"
import ShortcutManage from "./shortcutManage"
import LaneManage from "./laneManage"
import ContextmenuManage from "./contextmenuManage"

import "@logicflow/core/lib/style/index.css"
import "@logicflow/extension/es/index.css"

export default class {
    constructor(options = {}) {
        const lf = this.logic = new LogicFlow({
            ...config,
            ...options,
            plugins: [
                Menu,
                SelectionSelect,
                DynamicGroup,
                Snapshot,
                // Highlight,
                // ProximityConnect,
            ],
            keyboard: {
                enabled: true,
                shortcuts: [
                    {
                        keys: ["Escape"],
                        callback: () => {
                            this.nodeManage.cancelNodesSelected()
                        }
                    },
                    {
                        keys: ["Space"],
                        callback: () => {
                            this.eventManage.emit('move')
                        }
                    },
                    {
                        keys: ["Alt", "Meta"],
                        callback: () => {
                            this.eventManage.emit('select')
                        }
                    },
                    {
                        keys: ["ctrl + l"],
                        callback: () => {
                            this.shortcutManage.alignSelectedNodes('left')
                        }
                    },
                    {
                        keys: ["ctrl + r"],
                        callback: () => {
                            this.shortcutManage.alignSelectedNodes('right')
                        }
                    },
                    {
                        keys: ["ctrl + i"],
                        callback: () => {
                            this.shortcutManage.alignSelectedNodes('horizontalCenter')
                        }
                    },
                    {
                        keys: ["ctrl + t"],
                        callback: () => {
                            this.shortcutManage.alignSelectedNodes('top')
                        }
                    },
                    {
                        keys: ["ctrl + b"],
                        callback: () => {
                            this.shortcutManage.alignSelectedNodes('bottom')
                        }
                    },
                    {
                        keys: ["ctrl + m"],
                        callback: () => {
                            this.shortcutManage.alignSelectedNodes('verticalCenter')
                        }
                    },
                    {
                        keys: ["ctrl + h"],
                        callback: () => {
                            this.shortcutManage.alignSelectedNodes('horizontalAverage')
                        }
                    },
                    {
                        keys: ["ctrl + j"],
                        callback: () => {
                            this.shortcutManage.alignSelectedNodes('verticalAverage')
                        }
                    },
                ]
            }
        })

        new Adapter(lf)

        lf.setTheme(theme)
        lf.extension.selectionSelect.openSelectionSelect()
        lf.extension.selectionSelect.setSelectionSense(false, true)
        lf.extension.menu.setMenuByType({
            type: 'lf:defaultGraphMenu',
            menu: [
                {
                    text: "清空画布",
                    callback: () => {
                        lf.clearData()
                    }
                },
            ]
        })
        // lf.extension.proximityConnect.setThresholdDistance(50)

        this.registerManage = new RegisterManage(this)
        this.nodeManage = new NodeManage(this)
        this.edgeManage = new EdgeManage(this)
        this.eventManage = new EventManage(this)
        this.textManage = new TextManage(this)
        this.keyboardManage = new KeyboardManage(this)
        this.shortcutManage = new ShortcutManage(this)
        this.laneManage = new LaneManage(this)
        this.contextmenuManage = new ContextmenuManage(this)

        if (options.customSilent) {
            console.log("??? ttt");
            let a = lf.getEditConfig();
            console.log("aaaa", a);

            // 只读模式配置（可点击）
            lf.updateEditConfig({
                isSilentMode: true,
                adjustNodePosition: false,
            });
        } else {
            // 非只读模式下，确保自动扩张相关配置为true
            // lf.updateEditConfig({
            //     autoExpand: true,
            //     adjustNodePosition: true
            // });
        }
    }

    render(meta) {
        const lf = this.logic
        lf.render(meta)
        // lf.translate(0, 0)
        lf.translateCenter()
    }
}
