import { RectNodeModel, EventType } from "@logicflow/core"
import ResizeMouseEvent from "./mouseEvent"

export default class BaseRectNodeModel extends RectNodeModel {
    minHeight = 24
    minWidth = 32

    constructor(data, graphModel) {
        super(data, graphModel)
        this.mouseEvent = new ResizeMouseEvent()
        this.destroy = this.destroy.bind(this)
        this.resizeHandler = this.resizeHandler.bind(this)
        this.mouseDownHandler = this.mouseDownHandler.bind(this)
        graphModel.eventCenter.once(EventType.NODE_DELETE, this.destroy)

        this.mouseEvent.on('onDown', this.mouseDownHandler)
        this.mouseEvent.on('onMove', this.resizeHandler)
    }

    destroy({ data }) {
        if (this.id === data.id) {
            this.mouseEvent.destroy()
            this.graphModel.eventCenter.off(EventType.NODE_DELETE, this.destroy)
        }
    }

    mouseDownHandler(ev) {
        this.startResizeData = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        }
    }

    resizeHandler(ev, deltaX, deltaY, extra) {
        console.log("🚀 ~ BaseRectNodeModel ~ resizeHandler ~ extra:", extra)
        const type = extra[0].type
        let { x, y, width, height } = this.startResizeData
        const mw = this.minWidth
        const mh = this.minHeight

        if (type === 'top') {
            let newHeight = height + (deltaY * -1)
            y = y - (newHeight - height) / 2

            if (newHeight <= mh) {
                return
            }

            this.resizeUpdate(width, newHeight, x, y)
        } else if (type === 'right') {
            let newWidth = width + deltaX
            x = x + (newWidth - width) / 2

            if (newWidth <= mw) {
                return
            }

            this.resizeUpdate(newWidth, height, x, y)
        } else if (type === 'bottom') {
            let newHeight = height + deltaY
            y = y + (newHeight - height) / 2

            if (newHeight <= mh) {
                return
            }

            this.resizeUpdate(width, newHeight, x, y)
        } else if (type === 'left') {
            let newWidth = width + (deltaX * -1)
            x = x - (newWidth - width) / 2

            if (newWidth <= mw) {
                return
            }

            this.resizeUpdate(newWidth, height, x, y)
        }

    }

    resizeUpdate(width, height, x, y) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.text.y = y
        this.text.x = x

        this.setProperties({
            width,
            height,
        })

        this.updateEdgePointByAnchors()
    }

    updateEdgePointByAnchors() {
        const { id, anchors } = this
        const edges = this.graphModel.getNodeEdges(id)

        edges.forEach((edge) => {
            if (edge.sourceNodeId === id) {

            const anchorItem = anchors.find(
                (anchor) => anchor.id === edge.sourceAnchorId,
            )

            if (anchorItem) {
                edge.updateStartPoint({
                    x: anchorItem.x,
                    y: anchorItem.y,
                })
            }
            } else if (edge.targetNodeId === id) {
            const anchorItem = anchors.find(
                (anchor) => anchor.id === edge.targetAnchorId,
            )

            if (anchorItem) {
                edge.updateEndPoint({
                    x: anchorItem.x,
                    y: anchorItem.y,
                })
            }
            }
        })
    }

    getDefaultData() {
        return {
            fnName: "开始",
            fnClass: "00"
        }
    }

    initDefaultData(data, width, height) {
        const { properties = {} } = data

        if (!properties.data) {
            data.properties = {
                ...properties,
                data: this.getDefaultData(),
            }

            if (width) {
                this.width = width
            }

            if (height) {
                this.height = height
            }
        }

        this.text.editable = false
    }

    formatText() {}
}
