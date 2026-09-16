import R from './constant'
import { nodeType, } from "../../../adapter/typeMap"
import { calcChildInParent } from '../../../utils'

export const getModelConfig = (model, extra = {}) => {
    const { x, y, type, id, } = model
    const data = model.getData()
    const style = model.getNodeStyle()

    const {
        properties: {
            width,
            height,
            headerHeight = R.defaultHeaderHeight,
            stepTitleHeight = R.defaultStepTitleHeight,
            trackTitleHeight = R.defaultTrackTitleHeight,
            stepGroup = [],
            trackGroup = [],
            isDev,
        }
    } = data

    return {
        id,
        x,
        y,
        isDev,
        w: width,
        h: height,
        sx: x - width / 2,
        sy: y - height / 2,
        isVertical: type === nodeType.LANE_VERTICAL,
        style,
        headerHeight,
        stepTitleHeight: stepGroup.length ? stepTitleHeight : 0,
        trackTitleHeight,
        stepGroup,
        trackGroup,
        children: Array.from(model.children || []),
        stepCount: stepGroup.length,
        trackCount: trackGroup.length,
        data: data.properties.data || {},
        ...extra,
    }
}

export const getLinePoint = (M, size, offset = 0, isReverse = false) => {
    const horizontal = isReverse ? !M.isVertical : M.isVertical

    return horizontal ? {
        x1: M.x - M.w / 2 + offset,
        y1: M.y - M.h / 2 + size,
        x2: M.x + M.w / 2,
        y2: M.y - M.h / 2 + size,
    } : {
        x1: M.x - M.w / 2 + size,
        y1: M.y - M.h / 2 + offset,
        x2: M.x - M.w / 2 + size,
        y2: M.y + M.h / 2,
    }
}

export const getReduceStepGroup = (M) => {
    const newGroup = []
    M.stepGroup.reduce((t, c) => {
        const n = t + c.size
        const line = getLinePoint(M, n)
        newGroup.push({
            ...c,
            line,
            text: M.isVertical ? {
                x: M.x - M.w / 2 + M.stepTitleHeight / 2,
                y: line.y1 - c.size / 2,
            } : {
                x: line.x1 - c.size / 2,
                y: M.y - M.h / 2 + M.stepTitleHeight / 2,
            },
            rect: M.isVertical ? {
                width: M.stepTitleHeight,
                height: c.size,
            } : {
                width: c.size,
                height: M.stepTitleHeight,
            },
            reduceSize: n,
        })
        return n
    }, M.headerHeight)

    return newGroup
}

export const getReduceTrackGroup = (M) => {
    const newGroup = []
    M.trackGroup.reduce((t, c) => {
        const n = t + c.size
        const line = getLinePoint(
            M,
            n,
            M.headerHeight,
            true
        )
        newGroup.push({
            ...c,
            line,
            text: M.isVertical ? {
                x: line.x1 - c.size / 2,
                y: M.y - M.h / 2 + M.headerHeight + M.trackTitleHeight / 2,
            } : {
                x: M.x - M.w / 2 + M.headerHeight + M.trackTitleHeight / 2,
                y: line.y1 - c.size / 2,
            },
            rect: M.isVertical ? {
                width: c.size,
                height: M.trackTitleHeight,
            } : {
                width: M.trackTitleHeight,
                height: c.size,
            },
            reduceSize: n
        })
        return n
    }, M.stepTitleHeight)

    return newGroup
}

export const stepGroupAdapter = (M, group) => {
    const newStepGroup = []

    group.reduce((total, step, i) => {
        const { size } = step
        const [sx, sy] = [M.x - M.w / 2, M.y - M.h / 2]
        const [x, y, width, height] = M.isVertical
            ? [
                sx + M.w / 2,
                sy + total + size / 2,
                M.w,
                size,
            ] : [
                sx + total + size / 2,
                sy + M.h / 2,
                size,
                M.h,
            ]

        newStepGroup[i] = {
            ...step,
            x,
            y,
            width,
            height
        }

        return size + total
    }, M.headerHeight)

    return newStepGroup
}

export const updateChildren = (M, graphModel, group) => {
    return group.map(item => {
        const children = M.children.map(id => {
            return graphModel.getNodeModelById(id)
        }).filter(n => {
            return n ? calcChildInParent(item, {
                x: n.x,
                y: n.y,
                width: n.width,
                height: n.height,
            }) : false
        }).map(({ id }) => id)

        return {
            ...item,
            children
        }
    })
}


export const trackGroupAdapter = (M, group) => {
    const newTrackGroup = []

    group.reduce((total, track, i) => {
        const { size } = track

        const [sx, sy] = [M.x - M.w / 2, M.y - M.h / 2]
        const [x, y, width, height] = M.isVertical
            ? [
                sx + total + size / 2,
                sy + M.headerHeight + (M.h - M.headerHeight) / 2,
                size,
                M.h - M.headerHeight,
            ] : [
                sx + M.headerHeight + (M.w - M.headerHeight) / 2,
                sy + total + size / 2,
                M.w - M.headerHeight,
                size,
            ]

        newTrackGroup[i] = {
            ...track,
            x,
            y,
            width,
            height
        }

        return size + total
    }, M.stepGroup.length ? M.stepTitleHeight : 0)

    return newTrackGroup
}

export const updateSizeGroup = (group, id, size, min) => {
    return group.map(e => {
        return e.id === id
            ? {
                ...e,
                size: size < min ? min : size
            }
            : e
    })
}

export const updateStepSize = (M, id, size) => {
    const newGroup = updateSizeGroup(
        M.stepGroup,
        id,
        size,
        R.minStepSize
    )

    const allSize = newGroup.reduce((t, c) => t + c.size, M.headerHeight)

    let { x, y, w, h } = M

    if (M.isVertical) {
        const offset = allSize - h
        h = allSize
        y = y + offset / 2
    } else {
        const offset = allSize - w
        w = allSize
        x = x + offset / 2
    }

    return {
        stepGroup: stepGroupAdapter(M, newGroup),
        x,
        y,
        w,
        h,
    }
}

export const updateTrackSize = (M, id, size) => {
    const newGroup = updateSizeGroup(
        M.trackGroup,
        id,
        size,
        R.minTrackSize
    )

    const allSize = newGroup.reduce((t, c) => t + c.size, M.stepTitleHeight)

    let { x, y, w, h } = M

    if (M.isVertical) {
        const offset = allSize - w
        w = allSize
        x = x + offset / 2
    } else {
        const offset = allSize - h
        h = allSize
        y = y + offset / 2
    }

    return {
        trackGroup: trackGroupAdapter(M, newGroup),
        x,
        y,
        w,
        h,
    }
}

export const getReduceSize = (group, offset = 0, minItemSize = 0) => {
    let [allSize, preSize] = [0, 0]
    allSize = group.reduce((t, c, i) => {
        const total = t + c.size

        if (i === group.length - 1) {
            preSize = t
        }

        return total
    }, offset)

    return {
        allSize,
        preSize,
        minSize: minItemSize + preSize
    }
}

const updateLastStepSize = (group, size) => {
    return group.map((s, i) => {
        return group.length - 1 === i ? { ...s, size } : s
    })
}

export const syncStepSize = (M, baseStepSize = false) => {
    let [x, y, width, height, stepGroup] = [M.x, M.y, M.w, M.h, M.stepGroup]
    const { allSize, preSize, minSize } = getReduceSize(
        M.stepGroup,
        M.headerHeight,
        R.minStepSize,
    )

    if (M.isVertical) {
        if (baseStepSize) {
            y = y + (allSize - height) / 2
            height = allSize
        } {
            if (height < minSize) {
                y = y + (minSize - height) / 2,
                height = minSize

                stepGroup = updateLastStepSize(
                    stepGroup,
                    R.minStepSize
                )
            } else {
                stepGroup = updateLastStepSize(
                    stepGroup,
                    height - preSize
                )
            }
        }
    } else {
        if (baseStepSize) {
            x = x + (allSize - width) / 2
            width = allSize
        } else {
            if (width < minSize) {
                x = x + (minSize - width) / 2
                width = minSize

                stepGroup = updateLastStepSize(
                    stepGroup,
                    R.minStepSize
                )
            } else {
                stepGroup = updateLastStepSize(
                    stepGroup,
                    width - preSize
                )
            }
        }
    }

    return {
        x, y, width, height, stepGroup,
        modelData: {
            ...M,
            stepCount: stepGroup.length,
            stepGroup,
            x,
            y,
            w: width,
            h: height,
        }
    }
}

export const syncTrackSize = (M, baseTrackSize = false) => {
    let [x, y, width, height, trackGroup] = [M.x, M.y, M.w, M.h, M.trackGroup]
    const { allSize, preSize, minSize } = getReduceSize(
        M.trackGroup,
        M.stepTitleHeight,
        R.minTrackSize
    )

    if (M.isVertical) {
        if (baseTrackSize) {
            x = x + (allSize - width) / 2
            width = allSize
        } else {
            if (width < minSize) {
                x = x + (minSize - width) / 2
                width = minSize

                trackGroup = updateLastStepSize(
                    trackGroup,
                    R.minTrackSize
                )
            } else {
                trackGroup = updateLastStepSize(
                    trackGroup,
                    width - preSize
                )
            }
        }
    } else {
        if (baseTrackSize) {
            y = y + (allSize - height) / 2
            height = allSize
        } else {
            if (height < minSize) {
                y = y + (minSize - height) / 2
                height = minSize

                trackGroup = updateLastStepSize(
                    trackGroup,
                    R.minTrackSize
                )
            } else {
                trackGroup = updateLastStepSize(
                    trackGroup,
                    height - preSize
                )
            }
        }
    }

    return {
        x, y, width, height, trackGroup,
        modelData: {
            ...M,
            trackGroup,
            trackCount: trackGroup.length,
            x,
            y,
            w: width,
            h: height,
        }
    }
}
