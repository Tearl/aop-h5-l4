import { RectNode, h } from "@logicflow/core"
import { customEventType } from "../../adapter/typeMap"

export const getSizeControl = (model) => {
    const outlineStyle = model.getResizeOutlineStyle()
    const controlStyle = model.getResizeControlStyle()
    const { x, y, width: w, height: h } = model
    controlSize = [controlStyle.width, controlStyle.height]
    outlineSize = [25, 25]

    const controlOffsetX = controlSize[0] / 2
    const controlOffsetY = controlSize[1] / 2
    const outlineOffsetX = outlineSize[0] / 2
    const outlineOffsetY = outlineSize[1] / 2

    return [
        { x: x, y: y - h / 2, type: 'top' },
        { x: x + w / 2, y: y, type: 'right' },
        { x: x, y: y + h / 2, type: 'bottom' },
        { x: x - w / 2, y: y, type: 'left' },
    ].map(e => {
        const commonAttrs = {
            className: 'lf-basic-shape lf-resize-control-content',
        }

        let cursorStyle = {
            cursor: 'ew-resize',
        }

        if (['top', 'bottom'].includes(e.type)) {
            cursorStyle = {
                cursor: 'ns-resize',
            }
        }

        return [
            {
                style: cursorStyle,
                type: e.type,
            },
            {
                x: e.x - controlOffsetX,
                y: e.y - controlOffsetY,
                ...controlStyle,
                ...commonAttrs,
            },
            {
                x: e.x - outlineOffsetX,
                y: e.y - outlineOffsetY,
                width: outlineSize[0],
                height: outlineSize[1],
                ...outlineStyle,
                ...commonAttrs,
            },
        ]
    })
}

export const createControl = (
    [cursorAttrs, controlAttrs, outlineAttrs],
    mousedownHandler
) => {
    return h('g', {
        className: 'lf-resize-control-group',
        ...cursorAttrs,
        onmousedown: (ev) => {
            mousedownHandler(ev)
            ev.stopPropagation()
        }
    }, [
        h('rect', {
            ...controlAttrs,
        }),
        h('rect', {
            ...outlineAttrs,
        }),
    ])
}

export const createText = (model, graphModel, callback) => {
    const style = model.getNodeStyle()
    const { x, y, properties: { width, height, data } } = model.getData()
    const isReadonly = graphModel.editConfigModel.isSilentMode
    const txt = model.properties?.data?.fnName || model.getDefaultData().fnName
    // 获取节点类型
    const nodeType = model.type; 

    // 计算动态高度
    const fontSize = 12
    const lineHeight = 1.5
    const padding = 8
    const maxLines = 3
    const charsPerLine = Math.floor((width - padding * 2) / (fontSize * 0.6))
    const estimatedLines = Math.min(maxLines, Math.ceil(txt.length / charsPerLine))
    const textHeight = estimatedLines * fontSize * lineHeight + padding * 2
    const dynamicHeight = Math.max(height, textHeight)

    if (model.height < dynamicHeight) {
      model.height = dynamicHeight;
      model.updateEdgePointByAnchors();
    }

    const sourceType = data?.sourceType;
    let badgeText = '';
    let badgeColor = '';
    switch (sourceType) {
        case '00':
            badgeText = '新增';
            badgeColor = '#fe4758';
            break;
        case '01':
            badgeText = '引用';
            badgeColor = '#fe4758';
            break;
        case '02':
            badgeText = '不变';
            badgeColor = 'orange';
            break;
        default:
            badgeText = '';
            badgeColor = '';
    }

    // 定义允许显示角标的节点类型
    const allowedTypes = ['connect:flow', 'connect:condition', 'connect:data', 'connect:document', 'connect:store'];
    const shouldShowBadge = allowedTypes.includes(nodeType) && badgeText && sourceType == '01';

    return h('g', {}, [
        h('foreignObject', {
            ...style,
            x: x - width / 2,
            y: y - dynamicHeight / 2,
            width: width,
            height: dynamicHeight,
            // ondblclick: (ev) => {
            //     if (isReadonly) return
            //     ev.target.style.display = 'none'
            //     graphModel.eventCenter.emit(
            //         customEventType.CUSTOM_TEXT_DBLCLICK,
            //         {
            //             x: x,
            //             y: y,
            //             width: width,
            //             height: height,
            //             isRich: false,
            //             className: 'lf-connect-input',
            //             getText: () => {
            //                 return txt
            //             },
            //             callback: (txt, editor) => {
            //                 ev.target.style.display = 'flex'
            //                 const eh = editor.offsetHeight

            //                 if (callback) {
            //                     callback(txt, editor)
            //                 } else {
            //                     model.setProperties({
            //                         data: {
            //                             ...data,
            //                             fnName: txt,
            //                         },
            //                         height: eh,
            //                     })
            //                 }
            //             }
            //         }
            //     )
            //     ev.stopPropagation()
            // }
        }, [
            h('div', {
                className: 'fl-connect-node-text',
                style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: width + 'px',
                    padding: '4px 8px',
                    lineHeight: height-3+'px',
                    minHeight: height - 3 + 'px',
                },
                title: txt
            }, [
                h('div', {
                    className: 'fl-connect-node-text__inner',
                    style: {
                        fontSize: '12px',
                        wordBreak: 'break-all',
                        textAlign: 'center',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '3',
                        lineHeight: '1.5'
                    }
                }, txt)
            ]),
        ]),
        // 添加角标元素
        shouldShowBadge && h('rect', {
            x: x + width / 2 - 20, // 调整角标位置
            y: y - dynamicHeight / 2,
            width: 20,
            height: 14,
            fill: badgeColor, // 角标背景颜色
            rx: 2, // 圆角
        }),
        shouldShowBadge && h('text', {
            x: x + width / 2 - 10, // 调整文本位置
            y: y - dynamicHeight / 2 + 10,
            textAnchor: 'middle',
            fill: '#ffffff', // 文本颜色
            fontSize: '8px',
        }, badgeText)
    ])

    // return h('foreignObject', {
    //     ...style,
    //     x: x - width / 2,
    //     y: y - height / 2,
    //     width: width,
    //     height: height,
    //     ondblclick: (ev) => {
    //         if (isReadonly) return
    //         ev.target.style.display = 'none'
    //         graphModel.eventCenter.emit(
    //             customEventType.CUSTOM_TEXT_DBLCLICK,
    //             {
    //                 x: x,
    //                 y: y,
    //                 width: width,
    //                 height: height,
    //                 isRich: false,
    //                 className: 'lf-connect-input',
    //                 getText: () => {
    //                     return txt
    //                 },
    //                 callback: (txt, editor) => {
    //                     ev.target.style.display = 'flex'
    //                     const eh = editor.offsetHeight

    //                     if (callback) {
    //                         callback(txt, editor)
    //                     } else {
    //                         model.setProperties({
    //                             data: {
    //                                 ...data,
    //                                 fnName: txt,
    //                             },
    //                             height: eh,
    //                         })
    //                     }
    //                 }
    //             }
    //         )
    //         ev.stopPropagation()
    //     }
    // }, [
    //     h('div', {
    //         className: 'fl-connect-node-text',
    //         style: {
    //             display: 'flex',
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             width: width + 'px',
    //             height: height + 'px',
    //             padding: '4px 8px',
    //         },
    //     }, [
    //         h('div', {
    //             className: 'fl-connect-node-text__inner',
    //             style: {
    //                 fontSize: '12px',
    //                 whiteSpace: 'wrap',
    //                 wordBreak: 'break-all',
    //                 textAlign: 'center',
    //             },
    //         }, txt)
    //     ]),
    // ])
}

export default class BaseRectNode extends RectNode {
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
        return createText(model, graphModel)
    }

    getShape() {
        const { model, graphModel } = this.props
        const { isSelected } = model
        const { allowResize } = graphModel.editConfigModel
        const { width, height } = model
        const txt = model.properties?.data?.fnName || model.getDefaultData().fnName

        const fontSize = 12
        const lineHeight = 1.5
        const padding = 8
        const maxLines = 3

        const charsPerLine = Math.floor((width - padding * 2) / (fontSize * 0.6));
        const estimatedLines = Math.min(maxLines, Math.ceil(txt.length / charsPerLine));
        const textHeight = estimatedLines * fontSize * lineHeight + padding * 2;
        const dynamicHeight = Math.max(height, textHeight);


        if (model.height < dynamicHeight) {
            model.height = dynamicHeight
            model.updateEdgePointByAnchors();
        }
        return h('g', {}, [
            super.getShape(),
            isSelected && allowResize ? this.getSizeControl() : [],
            this.createText(),
        ])
    }
}
