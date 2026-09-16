import { h, LineEdge, LineEdgeModel } from '@logicflow/core'

class ConnectLineView extends LineEdge {
    getEdge() {
        const { model } = this.props
        const { startPoint, endPoint, } = model
        const style = model.getEdgeStyle()

        return h('line', {
            ...style,
            stroke: '#239edd',
            x1: startPoint.x,
            y1: startPoint.y,
            x2: endPoint.x,
            y2: endPoint.y,
        })
    }
}

class ConnectLineModel extends LineEdgeModel {
}

export default {
    type: "connectLine",
    view: ConnectLineView,
    model: ConnectLineModel
}
