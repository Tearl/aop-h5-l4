import typeMap, { nodeTypeValues, } from "./typeMap"
const safeParseArray = value => {
    if (Array.isArray(value)) return value
    if (!value) return []
    try {
        const result = JSON.parse(value)
        return Array.isArray(result) ? result : []
    } catch (error) {
        return []
    }
}

const getNodeType = (props, data) => {
    return nodeTypeValues.includes(props.nodeType)
        ?  props.nodeType
        : typeMap[data.fnClass]
}

const nodeDataPolyfill = (origin) => {
    const { point, propsConfig } = origin

    if (!propsConfig) {
        return {
            ...origin,
            point: {
                ...point,
                pointX: Number(point.pointX) + Number(point.width) / 2,
                pointY: Number(point.pointY) + Number(point.height) / 2,
            }
        }
    } else {
        return origin
    }
}

export const getInNodeItem = (node) => {
    const { point, propsConfig, ...other } = nodeDataPolyfill(node)
    const props = JSON.parse(propsConfig || '{}')

    const result = {
        id: node.fnId,
        type: getNodeType(props, node),
        x: Number(point.pointX),
        y: Number(point.pointY),
        rotate: props.rotate,
        properties: {
            data: {
                ...other,
                ...props,
            },
            width: Number(point.width),
            height: Number(point.height),
            children: safeParseArray(other.childrenNode),
        }
    }

    if (other.points && other.fnClass === "03") {
        // delete result.properties.width
        // delete result.properties.height
        const points = JSON.parse(other.points || "[]")
        if (points.length) {
            result.properties.points = points
        }
    }

    return result
}

const getInAreaList = (data) => {
    return data.map(group => {
        if (group.propsConfig) {
            return JSON.parse(group.propsConfig || '{}')
        } else {
            const point = group.point
            const width = Number(point.width)
            return {
                size: width,
                id: group.fnId,
                name: group.fnName,
                x: Number(point.pointX) + width / 2,
                y: Number(point.pointY) + Number(point.height) / 2,
                children: safeParseArray(group.childrenNode)
            }
        }
    })
}

const laneParsePolyfill = (data, vm) => {
    if (data?.point?.width) return data

    const childPoints = data.laneNodeInfos.map(e => e.point)
    if (!childPoints.length) return data

    const first = childPoints[0]
    const height = Number(first.height)
    const width = childPoints.reduce((t, e) => Number(e.width) + t, 0)
    const pointX = Number(first.pointX)
    const pointY = Number(first.pointY)
    const point = {
        height,
        width,
        pointX,
        pointY,
    }

    return {
        ...data,
        fnId: vm.graphModel.idGenerator(),
        point,
    }
}

export const getInLaneItem = (lane, vm) => {
    lane = laneParsePolyfill(lane, vm);
    const { laneNodeInfos, stageGroupInfos = [] } = lane
    const stepGroup = getInAreaList(stageGroupInfos)
    const trackGroup = getInAreaList(laneNodeInfos)
    let result = getInNodeItem(lane);

    result = {
        ...result,
        properties: {
            ...result.properties,
            stepGroup,
            trackGroup,
        }
    }

    return result
}

const getPozFromPort = (port, node) => {
    const x = node.x
    const y = node.y
    const w = node.properties.width
    const h = node.properties.height
    let { sx, sy } = { x, y }

    switch (port) {
        case "port_1":
            sx = x - w / 2
            sy = y
            break

        case "port_3":
            sx = x
            sy = y - h / 2
            break

        case "port_2":
            sx = x + w / 2
            sy = y
            break

        case "port_4":
            sx = x
            sy = y + h / 2
            break

        default:
            break
    }

    return { x: sx, y: sy }
}

const edgeDataPolyfill = (normalNodes, origin) => {
    // 新数据无需转换
    if (origin.startPointX) {
        return origin
    }

    const sourceNode = normalNodes.find(e => e.id === origin.curFnId)
    const targetNode = normalNodes.find(e => e.id === origin.tgtFnId)

    const startPoz = getPozFromPort(origin.sourcePort, sourceNode)
    const endPoz = getPozFromPort(origin.targetPort, targetNode)

    return {
        ...origin,
        startPointX: startPoz.x,
        startPointY: startPoz.y,
        endPointX: endPoz.x,
        endPointY: endPoz.y,
        textValue: origin.seleType,
        textPointX: (startPoz.x + endPoz.x) / 2,
        textPointY: (startPoz.y + endPoz.y) / 2,
    }
}

export const getInEdgeItem = (normalNodes, origin) => {
    const val = edgeDataPolyfill(normalNodes, origin)
    const props = JSON.parse(val.propsConfig || '{}')
    let result

    if (val.startPointX) {
        result = {
            type: props.lineType || "polyline",
            sourceNodeId: val.curFnId,
            targetNodeId: val.tgtFnId,
            startPoint: {
                x: Number(val.startPointX),
                y: Number(val.startPointY)
            },
            endPoint: {
                x: Number(val.endPointX),
                y: Number(val.endPointY)
            },
        }

        const pointsList = JSON.parse(val.pointList || "[]")

        if (pointsList.length) {
            result.pointsList = pointsList
        }

        if (val.textPointX) {
            result.text = {
                x: Number(val.textPointX),
                y: Number(val.textPointY),
                value: val.textValue
            }
        }
    }

    return result
}

export const getOutNodeItem = (node, properties, parentId) => {
    const result = {
        ...(properties.data || {}),
        parentNodeId: parentId,
        propsConfig: JSON.stringify({
            rotate: node.rotate,
            nodeType: node.type,
        }),
        point: {
            width: String(properties.width),
            height: String(properties.height),
            pointX: String(node.x),
            pointY: String(node.y)
        },
        points: JSON.stringify(properties?.points || []),
        childrenNode: JSON.stringify((node?.children || [])),
    }

    return result
}

export const getOutAreaList = (data, parentId) => {
    return data.map(group => {
        return {
            parentNodeId: parentId,
            fnName: group.name,
            fnId: group.id,
            propsConfig: JSON.stringify(group),
            point: {
                width: String(group.width),
                height: String(group.height),
                pointX: String(group.x),
                pointY: String(group.y)
            },
            childrenNode: JSON.stringify((group?.children || [])),
        }
    })
}

export const getOutLaneItem = (node, properties) => {
    let result = getOutNodeItem(node, properties)

    result = {
        ...result,
        laneNodeInfos: getOutAreaList(
            properties.trackGroup,
            node.id
        ),
        stageGroupInfos: getOutAreaList(
            properties.stepGroup,
            node.id
        ),
    }

    return result
}

export const getOutEdgeItem = (model, edge) => {
    const getId = (id) => {
        return model.getNodeModelById(id).getProperties().data.fnId || id;
    }

    const result = {
        propsConfig: JSON.stringify({
            lineType: edge.type,
        }),
        curFnId: getId(edge.sourceNodeId),
        tgtFnId: getId(edge.targetNodeId),
        pointList: JSON.stringify(edge.pointsList),
        startPointX: String(edge.startPoint.x),
        startPointY: String(edge.startPoint.y),
        endPointX: String(edge.endPoint.x),
        endPointY: String(edge.endPoint.y)
    }

    if (edge.text) {
        Object.assign(result, {
            textPointX: String(edge.text.x),
            textPointY: String(edge.text.y),
            textValue: edge.text.value
        })
    }

    return result
}
