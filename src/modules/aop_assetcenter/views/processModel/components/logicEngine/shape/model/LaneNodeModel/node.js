import { h, } from "@logicflow/core"
import { dynamicGroup } from "@logicflow/extension"
import { customEventType } from "../../../adapter/typeMap"
import { createControl, getSizeControl } from "../RectNode"
import * as utils from './utils'

export class LaneNode extends dynamicGroup.view {
    constructor(data) {
        super(data)
        this.startPoint = { x: 0, y: 0 }
    }

    getModelInfo() {
        return utils.getModelConfig(this.props.model)
    }

    createTextStyle(value = '', isVertical = false, style = {}) {
        return {
            'fill': 'currentColor',
            'font-size': 12,
            'text-anchor': 'middle',
            'dominant-baseline': 'central',
            'color': '#000',
            'overflowMode': 'default',
            'lineHeight': '1.2',
            'class': 'lf-lane-step-text',
            'value': value,
            'writing-mode': isVertical ? 'tb' : '',
            ...style,
        }
    }

    createLine(size, offset = 0, isReverse = false) {
        const M = this.getModelInfo()

        return h('line', {
            ...utils.getLinePoint(M, size, offset, isReverse),
            ...M.style
        })
    }

    textEditTrigger({ x, y, width, height, name }, vertical, editCallback) {
        // this.props.graphModel.eventCenter.emit(
        //     customEventType.CUSTOM_TEXT_DBLCLICK,
        //     {
        //         x,
        //         y,
        //         vertical,
        //         width: width,
        //         height: height,
        //         singleRow: true,
        //         showBackground: true,
        //         className: `lf-lane-input ${vertical ? 'vertical-mode' : ''}`,
        //         getText: () => name,
        //         callback: editCallback
        //     }
        // )
    }

    createTextRect(name, textStyle, rectStyle, vertical, editCallback) {
        return h('g', {}, [
            h('text', textStyle, name),
            h('rect', {
                ...rectStyle,
                fill: 'transparent',
                // ondblclick: (ev) => {
                //     this.textEditTrigger(
                //         {
                //             x: textStyle.x,
                //             y: textStyle.y,
                //             width: rectStyle.width,
                //             height: rectStyle.height,
                //             name,
                //         },
                //         vertical,
                //         editCallback,
                //     )
                //     ev.stopPropagation()
                // },
            }),
        ])
    }

    createResizeLine(lineStyle, isVertical, mousedownHandler) {
        return h('g', {}, [
            h('line', lineStyle),
            h('line', {
                ...lineStyle,
                className: `step-resize-stick ${isVertical ? 'vertical-mode' : ''}`,
                'stroke-width': 10,
                'stroke': 'transparent',
                onmouseenter: (ev) => {
                    ev.target.style.stroke = '#0061ff1f'
                },
                onmouseleave: (ev) => {
                    ev.target.style.stroke = ''
                },
                onmousedown: (ev) => {
                    mousedownHandler(ev)
                    ev.stopPropagation()
                    ev.preventDefault()
                }
            })
        ])
    }

    updateStepText(id, name) {
        const M = this.getModelInfo()
        this.props.model.setProperties({
            stepGroup: M.stepGroup.map(e => {
                return e.id === id ? { ...e, name } : e
            }),
        })
    }

    updateTrackText(id, name) {
        const M = this.getModelInfo()
        this.props.model.setProperties({
            trackGroup: M.trackGroup.map(e => {
                return e.id === id ? { ...e, name } : e
            }),
        })
    }

    getHeaderSize() {
        const M = this.getModelInfo()
        const { model } = this.props

        const base = M.isVertical ? {
            width: M.w,
            height: M.headerHeight,
        } : {
            width: M.headerHeight,
            height: M.h,
        }

        return {
            ...base,
            name: model.text.value,
            x: model.text.x,
            y: model.text.y,
        }
    }

    resizeMousedownHandler(ev, current, type) {
        this.modelInfo = this.getModelInfo()
        this.resizeItem = current
        this.startPoint = { x: ev.x, y: ev.y }
        this.resizeFlag = type
    }

    resizeMousemoveHandler(ev) {
        const M = this.modelInfo
        const { model } = this.props

        if (this.resizeFlag) {
            const distancePoz = {
                x: ev.x - this.startPoint.x,
                y: ev.y - this.startPoint.y,
            }

            if (this.resizeFlag === 'step') {
                const newStepSize = this.resizeItem.size + (
                    M.isVertical
                        ? distancePoz.y
                        : distancePoz.x
                )

                const props = utils.updateStepSize(
                    M,
                    this.resizeItem.id,
                    newStepSize
                )
                model.resizeSize(props, 'step')
            } else {
                const newTrackSize = this.resizeItem.size + (
                    M.isVertical
                        ? distancePoz.x
                        : distancePoz.y
                )

                const props = utils.updateTrackSize(
                    M,
                    this.resizeItem.id,
                    newTrackSize
                )
                model.resizeSize(props, 'track')
            }

            ev.stopPropagation()
        }
    }

    resizeMouseupHandler() {
        if (this.resizeFlag) {
            this.resizeItem = null
            this.startPoint = { x: 0, y: 0 }
            this.resizeFlag = null
        }
    }

    createStepGroupArea() {
        const M = this.getModelInfo()
        const reduceStepGroup = utils.getReduceStepGroup(M)

        return reduceStepGroup.map((S, i) => {
            const isLastStep = i === M.stepCount - 1

            return h('g', {}, [
                M.isDev ? h('rect', {
                    x: S.x - S.width / 2,
                    y: S.y - S.height / 2,
                    width: S.width,
                    height: S.height,
                    fill: '#ff000026',
                }) : null,
                M.stepCount > 0 ? this.createTextRect(S.name, {
                    ...this.createTextStyle(S.name, M.isVertical),
                    ...S.text,
                }, {
                    x: S.text.x - S.rect.width / 2,
                    y: S.text.y - S.rect.height / 2,
                    width: S.rect.width,
                    height: S.rect.height,
                }, M.isVertical, (txt) => {
                    this.updateStepText(S.id, txt)
                }) : null,
                !isLastStep ? this.createResizeLine(
                    {
                        ...S.line,
                        ...M.style
                    },
                    !M.isVertical,
                    (ev) => {
                        this.resizeMousedownHandler(ev, S, 'step')
                    }
                ) : null,
            ])
        })
    }

    createTrackGroupArea() {
        const M = this.getModelInfo()
        const reduceTrackGroup = utils.getReduceTrackGroup(M)

        return reduceTrackGroup.map((S, i) => {
            const isLastStep = i === M.trackCount - 1

            return h('g', {}, [
                M.isDev ? h('rect', {
                    x: S.x - S.width / 2,
                    y: S.y - S.height / 2,
                    width: S.width,
                    height: S.height,
                    fill: '#0000ff33',
                }) : null,
                M.trackCount > 0 ? this.createTextRect(S.name, {
                    ...this.createTextStyle(S.name, !M.isVertical),
                    ...S.text,
                }, {
                    x: S.text.x - S.rect.width / 2,
                    y: S.text.y - S.rect.height / 2,
                    width: S.rect.width,
                    height: S.rect.height,
                },
                !M.isVertical,
                (txt) => {
                    this.updateTrackText(S.id, txt)
                }) : null,
                !isLastStep ? this.createResizeLine(
                    {
                        ...S.line,
                        ...M.style
                    },
                    M.isVertical,
                    (ev) => {
                        this.resizeMousedownHandler(ev, S, 'track')
                    }
                ) : null,
            ])
        })
    }

    getSizeControl() {
        const { model } = this.props
        return getSizeControl(model)
            .map(props => createControl(
                props,
                (ev) => {
                    model.mouseEvent.mouseDownHandler(ev, props)
                }
            ))
    }

    getShape() {
        const M = this.getModelInfo()
        const { model, graphModel } = this.props
        const { isSelected } = model
        const { allowResize } = graphModel.editConfigModel
        const isReadonly = graphModel.editConfigModel.isSilentMode

        return h('g', {
            class: 'lf-lane',
            id: 'lane_' + M.id,
            // ondblclick: (ev) => {
            //     if (isReadonly) return
            //     const titleSize = this.getHeaderSize()
            //     this.textEditTrigger(
            //         titleSize,
            //         !M.isVertical,
            //         (txt) => {
            //             model.text.value = txt
            //             const data = model.getData()
            //             model.setProperties({
            //                 data: {
            //                     ...data.properties.data,
            //                     fnName: txt,
            //                 }
            //             })
            //         }
            //     )
            //     ev.stopPropagation()
            // },
            onmousemove: (ev) => {
                this.resizeMousemoveHandler(ev)
            },
            onmouseup: (ev) => {
                this.resizeMouseupHandler()
            }
        }, [
            super.getShape(),
            this.createLine(M.headerHeight),
            M.stepCount > 0
                ? this.createLine(
                    M.stepTitleHeight,
                    M.headerHeight,
                    true
                )
                : null,
            M.trackCount > 0
                ? this.createLine(
                    M.trackTitleHeight + M.headerHeight,
                    M.stepTitleHeight,
                )
                : null,
            this.createStepGroupArea(),
            this.createTrackGroupArea(),
            isSelected && allowResize ? this.getSizeControl() : null
        ])
    }
}

