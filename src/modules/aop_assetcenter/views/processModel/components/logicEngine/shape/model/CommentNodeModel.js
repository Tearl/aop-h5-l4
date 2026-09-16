import { h, HtmlNode, HtmlNodeModel, EventType } from "@logicflow/core"
import { nodeType, customEventType } from "../../adapter/typeMap"
import ResizeMouseEvent from "./mouseEvent"
import { createControl, getSizeControl } from "./RectNode"

export class CommentNode extends HtmlNode {
    constructor(props) {
        super(props)
    }

    setHtml(rootEl) {
        const { properties: { data }, type, } = this.props.model
        const isLeft = nodeType.COMMENT_LEFT === type
        const txt = data?.fnDesc || data?.fnName

        const el = document.createElement('div')
        el.className = 'fl-node-comment'
        el.style.cssText = `
            background: #ffff;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            word-break: break-all;
            white-space: pre-wrap;
        `

        el.innerHTML = `
            <div class=fl-node-text" style="padding: 4px 8px;">${txt}</div>
            <div class=fl-node-shape"
                style="
                    height: 100%;
                    width: 10%;
                    position: absolute;
                    top: 0;
                    pointer-events: none;
                    border: 1px solid #239edd;
                    ${
                        isLeft
                            ? 'right: 0; border-left: none;'
                            : 'left: 0; border-right: 0;'
                    }
                "
            ></div>
        `
        rootEl.innerHTML = ''
        rootEl.appendChild(el)

        // 双击修改文字
        // el.ondblclick = (ev) => {
        //     ev.target.style.display = 'none'
        //     const { graphModel, model } = this.props
        //     const { x, y, properties: { width, height, data } } = model.getData()
        //     const isReadonly = graphModel.editConfigModel.isSilentMode

        //     if (isReadonly) return

        //     graphModel.eventCenter.emit(
        //         customEventType.CUSTOM_TEXT_DBLCLICK,
        //         {
        //             x,
        //             y,
        //             width: width,
        //             height: height,
        //             isRich: true,
        //             className: 'lf-comment-input',
        //             target: ev.target,
        //             getText: () => {
        //                 return txt
        //             },
        //             callback: (txt, editor) => {
        //                 ev.target.style.display = 'block'
        //                 const eh = editor.offsetHeight
        //                 model.setProperties({
        //                     data: {
        //                         ...data,
        //                         fnDesc: txt,
        //                     },
        //                     height: eh,
        //                 })
        //             }
        //         }
        //     )
        // }
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

    getShape() {
        const { model, graphModel } = this.props
        const { isSelected } = model
        const { allowResize } = graphModel.editConfigModel

        return h('g', {}, [
            super.getShape(),
            isSelected && allowResize ? this.getSizeControl() : null
        ])
    }
  }

export class CommentNodeModel extends HtmlNodeModel {
    minHeight = 30
    minWidth = 70

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
            fnName: "注释",
            fnDesc: "注释",
            fnClass: "13"
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
