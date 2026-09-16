import { LaneNodeModel, LaneNode } from './model/LaneNodeModel'
import { nodeType } from "../adapter/typeMap"

class customModel extends LaneNodeModel {
    getDefaultData() {
        const data = super.getDefaultData()
        return {
            ...data,
            type: nodeType.LANE_HORIZONTAL,
        }
    }
}

class customView extends LaneNode {
}

export default {
    type: nodeType.LANE_HORIZONTAL,
    model: customModel,
    view: customView
}
