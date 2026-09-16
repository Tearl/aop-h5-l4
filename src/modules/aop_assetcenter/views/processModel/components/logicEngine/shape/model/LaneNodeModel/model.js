import { EventType, } from '@logicflow/core'
import { dynamicGroup } from "@logicflow/extension"
import { nodeType, customEventType } from "../../../adapter/typeMap"
import ResizeMouseEvent from "../mouseEvent"
import R from './constant'
import * as utils from './utils'

export class LaneNodeModel extends dynamicGroup.model {
    minHeight = 140
    minWidth = 140

    constructor(data, graphModel) {
        super(data, graphModel)

        this.mouseEvent = new ResizeMouseEvent()
        this.bindResize = this.bindResize.bind(this)
        this.destroy = this.destroy.bind(this)
        this.resizeHandler = this.resizeHandler.bind(this)
        this.mouseDownHandler = this.mouseDownHandler.bind(this)
        graphModel.eventCenter.on(EventType.NODE_RESIZE, this.bindResize)
        graphModel.eventCenter.on(EventType.NODE_DROP, this.bindResize)
        graphModel.eventCenter.once(EventType.NODE_DELETE, this.destroy)

        this.mouseEvent.on('onDown', this.mouseDownHandler)
        this.mouseEvent.on('onMove', this.resizeHandler)
    }

    destroy({ data }) {
        if (this.id === data.id) {
            const { eventCenter } = this.graphModel
            this.mouseEvent.destroy()
            eventCenter.off(EventType.NODE_RESIZE, this.bindResize)
            eventCenter.off(EventType.NODE_DROP, this.bindResize)
            eventCenter.off(EventType.NODE_DELETE, this.destroy)
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
        if (this.resizeRules[0](this, 0, 0, width, height)) {
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

            this.refresh()
        }
    }

    getDefaultData() {
        return {
            fnName: "默认标题",
            fnClass: "lane",
            type: nodeType.LANE_VERTICAL,
            version: '2.0',
        }
    }

    getDefaultAnchor() {
        return []
    }

    resizeRules = [
        (model, deltaX, deltaY, width, height) => {
            const M = utils.getModelConfig(model)
            const { preSize: preStepSize } = utils.getReduceSize(
                M.stepGroup,
                M.headerHeight
            )
            const minStepSize = preStepSize + R.minStepSize
            const { preSize: preTrackSize } = utils.getReduceSize(
                M.trackGroup,
                M.stepTitleHeight
            )
            const minTrackSize = preTrackSize + R.minTrackSize

            if (M.isVertical) {
                if (height < minStepSize) {
                    return false
                }
                if (width < minTrackSize) {
                    return false
                }
            } else {
                if (width < minStepSize) {
                    return false
                }
                if (height < minTrackSize) {
                    return false
                }
            }

            return true
        }
    ]

    getModelInfo() {
        return utils.getModelConfig(this, {
            isVertical: this.getVerticalBool(),
        })
    }

    bindResize({ data }) {
        if (this.id === data.id) {
            this.refresh()
        }
    }

    initNodeData(data) {
        if (!data.properties) {
            const defaultData = this.getDefaultData()
            const isVertical = this.getVerticalBool(defaultData.type)
            const size = R.defaultSize.slice(0)

            if (!isVertical) {
                size.reverse()
            }

            const defaultProperties = {
                headerHeight: R.defaultHeaderHeight,
                stepTitleHeight: R.defaultStepTitleHeight,
                trackTitleHeight: R.defaultTrackTitleHeight,
                stepGroup: [],
                width: size[0],
                height: size[1],
                w: size[0],
                h: size[1],
                isVertical,
            }

            const defaultTrack = [{
                size: R.defaultSize[0],
                id: this.graphModel.idGenerator('track'),
                name: R.defaultTrackName,
            }]

            const trackGroup = utils.trackGroupAdapter(
                {
                    ...data,
                    ...defaultProperties,

                },
                defaultTrack,
            )

            this.width = size[0]
            this.height = size[1]

            data.properties = {
                data: defaultData,
                trackGroup,
                ...defaultProperties,
            }
        }

        this.text.editable = false

        super.initNodeData(data)

        this.rotatable = false
        this.isCollapsed = false
        this.collapsible = false
    }

    getVerticalBool(type) {
        return (type || this.type) === nodeType.LANE_VERTICAL
    }

    getAddableOutlineStyle() {
        const style = super.getAddableOutlineStyle()
        style.stroke = ""
        style.strokeDasharray = "0"
        return style
    }

    getConnectedTargetRules() {
        const rules = super.getConnectedTargetRules()
        rules.push({
            message: "该节点不能作为边的终点",
            validate: () => false,
        })
        return rules
    }

    saveStepText(id, name) {
        if (!id) return

        const { stepGroup = [] } = this.properties
        const newStepGroup = stepGroup.map(s => {
            return s.id === id ? {
                ...s,
                name,
            } : s
        })
        this.updateStepGroup(newStepGroup)
    }

    resizeSize(props, type) {
        this.x = props.x
        this.y = props.y
        this.width = props.w
        this.height = props.h

        this.setProperties({
            width: props.w,
            height: props.h,
        })

        if (type === 'step') {
            this.updateStepGroup(props.stepGroup)
            this.syncTrackSize()
        } else {
            this.updateTrackGroup(props.trackGroup)
            this.syncStepSize()
        }
    }

    setStepEvent(stepGroup) {
        this.graphModel.eventCenter.emit(
            customEventType.LANE_STEP_SET,
            {
                stepGroup,
                data: this.properties.data,
            }
        )
    }

    setStep(count) {
        count = Number(count)
        const M = this.getModelInfo()

        if (count === M.stepCount) return

        let newStepGroup = M.stepGroup
        const updateStep = (baseStepSize) => {
            this.syncStepSize(baseStepSize, newStepGroup)
            this.setStepEvent(newStepGroup)
        }

        if (count === 0) {
            newStepGroup = []
            updateStep(false)
            this.syncTrackSize()
        } else if (count < M.stepCount) {
            newStepGroup = M.stepGroup.slice(0, count)
            updateStep(true)
            this.syncTrackSize()
        } else {
            Array(count - M.stepCount)
                .fill(0)
                .forEach(() => {
                    newStepGroup.push({
                        size: R.defaultStepSize,
                        id: this.graphModel.idGenerator(),
                        name: R.defaultStepName,
                    })
                })
            updateStep(true)
            this.syncTrackSize()
            if (M.stepCount === 0) {
                this.syncStepSize(true)
            }
        }
    }

    setTrackEvent(trackGroup) {
        this.graphModel.eventCenter.emit(
            customEventType.LANE_TRACK_ADD,
            {
                trackGroup,
                data: this.properties.data,
            }
        )
    }

    refresh() {
        const M = this.getModelInfo()
        const { modelData, stepGroup } = utils.syncStepSize(M)
        const { x, y, width, height, trackGroup } = utils.syncTrackSize(modelData)

        this.x = x
        this.y = y

        this.width = width
        this.height = height

        this.setProperties({ width, height })
        this.updateStepGroup(stepGroup)
        this.updateTrackGroup(trackGroup)
    }

    setTrack(count) {
        count = Number(count)
        const M = this.getModelInfo()

        if (count === M.trackCount || count === 0) return

        let newTrackGroup = M.trackGroup
        const updateTrack = (baseTrackSize) => {
            this.syncTrackSize(baseTrackSize, newTrackGroup)
            this.setTrackEvent(newTrackGroup)
        }

        if (count < M.trackCount) {
            newTrackGroup = M.trackGroup.slice(0, count)
            updateTrack(true)
            this.syncStepSize()
        } else {
            Array(count - M.trackCount)
                .fill(0)
                .forEach(() => {
                    newTrackGroup.push({
                        size: R.defaultTrackSize,
                        id: this.graphModel.idGenerator(),
                        name: R.defaultTrackName,
                    })
                })
            updateTrack(true)
            this.syncStepSize()
            if (M.trackCount === 0) {
                this.syncTrackSize(true)
            }
        }
    }

    updateTrackChildren() {
        this.setProperty('trackGroup', this._updateTrackChildren())
    }

    _updateTrackChildren(trackGroup) {
        const M = this.getModelInfo()
        return utils.updateChildren(
            M,
            this.graphModel,
            trackGroup || M.trackGroup
        )
    }

    _updateTrackGroup(group) {
        const M = this.getModelInfo()
        return utils.trackGroupAdapter(M, group || M.trackGroup)
    }

    updateTrackGroup(group) {
        this.setProperty(
            'trackGroup',
            this._updateTrackChildren(
                this._updateTrackGroup(group),
            )
        )
    }

    syncTrackSize(baseTrackSize = false, newTrackGroup) {
        let M = this.getModelInfo()

        if (newTrackGroup) {
            const count = newTrackGroup.length
            M.trackGroup = newTrackGroup
            M = utils.syncTrackSize(M, count > 0).modelData
        }

        const { x, y, width, height, trackGroup } = utils.syncTrackSize(M, baseTrackSize)

        this.x = x
        this.y = y

        this.width = width
        this.height = height
        this.setProperties({ width, height })
        this.updateTrackGroup(trackGroup)
    }

    updateStepChildren() {
        this.setProperty('stepGroup', this._updateStepChildren())
    }

    _updateStepChildren(stepGroup) {
        const M = this.getModelInfo()
        return utils.updateChildren(
            M,
            this.graphModel,
            stepGroup || M.stepGroup
        )
    }

    _updateStepGroup(group) {
        const M = this.getModelInfo()
        return utils.stepGroupAdapter(M, group || M.stepGroup)
    }

    updateStepGroup(group) {
        this.setProperty(
            'stepGroup',
            this._updateStepChildren(
                this._updateStepGroup(group),
            )
        )
    }

    getReduceSize(stepArr, initSize) {
        if (!stepArr) return 0
        const { headerHeight = R.defaultHeaderHeight, } = this.properties
        return stepArr.reduce(
            (t, c) => t + c.size,
            typeof initSize === 'number' ? initSize : headerHeight
        )
    }

    syncStepSize(baseStepSize = false, newStepGroup) {
        let M = this.getModelInfo()

        if (newStepGroup) {
            const count = newStepGroup.length
            M.stepGroup = newStepGroup
            M = utils.syncStepSize(M, count > 0).modelData
        }

        const { x, y, width, height, stepGroup } = utils.syncStepSize(M, baseStepSize)

        this.x = x
        this.y = y

        this.width = width
        this.height = height
        this.setProperties({ width, height })
        this.updateStepGroup(stepGroup)
    }

    setAttributes() {
        const M = this.getModelInfo()

        if (M.isVertical) {
            this.text.x = M.x
            this.text.y = M.y - M.h / 2 + M.headerHeight / 2
        } else {
            this.text.x = M.x - M.w / 2 + M.headerHeight / 2
            this.text.y = M.y
        }

        this.updateText(M.data?.fnName)
    }

    getTextStyle() {
        const isVertical = this.getVerticalBool()

        const {
            textStyle = {},
        } = this.properties
        const style = super.getTextStyle()

        return {
            ...style,
            ...structuredClone(textStyle),
            'writing-mode': isVertical ? '' : 'tb',
        };
    }
}
