import RectNode from "./model/RectNode"
import RectNodeModel from './model/RectNodeModel'
import { nodeType } from "../adapter/typeMap"

class customView extends RectNode { }

class customModel extends RectNodeModel {
    getDefaultData() {
        return {
            fnName: "流程",
            fnClass: "02"
        }
    }

    initNodeData(data) {
        this.initDefaultData(data, 86, 38)
        super.initNodeData(data)
        this.radius = 2
    }
}

export default {
    type: nodeType.CONNECT_FLOW,
    view: customView,
    model: customModel
}
