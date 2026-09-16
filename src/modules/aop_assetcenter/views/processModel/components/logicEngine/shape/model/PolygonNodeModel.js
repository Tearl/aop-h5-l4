import { h, PolygonNode, PolygonNodeModel, EventType } from "@logicflow/core"
import ResizeMouseEvent from "./mouseEvent"
import { createControl, getSizeControl, createText } from "./RectNode"

export class BasePolygonNode extends PolygonNode {
    constructor(props) {
        super(props)
    }

    getSizeControl() {
        const { model, graphModel } = this.props
        const isReadonly = graphModel.editConfigModel.isSilentMode

        if (isReadonly) return []

        return getSizeControl(model)
            .map(props => createControl(
                props,
                (ev) => {
                    model.mouseEvent.mouseDownHandler(ev, props)
                }
            ))
    }

    createText() {
        const { model, graphModel } = this.props
        const { properties, x, y } = model.getData()
        return createText(model, graphModel, (txt, editor) => {
            const eh = editor.offsetHeight - 4

            model.setProperties({
                data: {
                    ...properties.data,
                    fnName: txt,
                },
                points: model.parsePoints(x, y, properties.width, eh),
            })
        })
    }

    getShape() {
        const { model, graphModel } = this.props
        const { isSelected } = model
        const { allowResize } = graphModel.editConfigModel

        return h('g', {}, [
            super.getShape(),
            isSelected && allowResize ? this.getSizeControl() : null,
            this.createText(),
        ])
    }
}

export default class BasePolygonNodeModel extends PolygonNodeModel {
    minHeight = 44
    minWidth = 86

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
        this.text.y = y
        this.text.x = x

        this.setProperties({
            // width,
            // height,
            points: this.parsePoints(x, y, width, height),
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
            fnName: "判断",
            fnClass: "03"
        }
    }

    parsePoints(x, y, w, h) {
        return [
            [x - w / 2, y],
            [x, y - h / 2],
            [x + w / 2, y],
            [x, y + h / 2],
        ]
    }

    initDefaultData(data, width, height) {
        const { properties, x, y } = data

        if (!properties) {
            data.properties = {
                data: this.getDefaultData(),
                points: this.parsePoints(x, y, width, height),
            }
        }

        this.text.editable = false
    }

    formatText() {}
}
