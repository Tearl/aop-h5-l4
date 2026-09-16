import RectNode from "./model/RectNode"
import RectNodeModel from './model/RectNodeModel'
import { nodeType } from "../adapter/typeMap"

class customView extends RectNode { }

class customModel extends RectNodeModel {
    getDefaultData() {
        return {
            fnName: "结束",
            fnClass: "01"
        }
    }

    initNodeData(data) {
        this.initDefaultData(data, 86, 38)
        super.initNodeData(data)
        this.radius = 12
    }
}

export default {
    type: nodeType.CONNECT_END,
    view: customView,
    model: customModel
}
