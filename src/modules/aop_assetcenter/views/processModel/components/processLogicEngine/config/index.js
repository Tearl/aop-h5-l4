export const config = {
    isSilentMode: false,
    snapline: true,
    allowResize: true,
    allowRotate: true,
    nodeSelectedOutline: false,
    grid: {
        size: 0,
        type: "dot",
        visible: false,
        config: {
            color: "#d1d1d1",
            thickness: 1,
        }
    },
    background: {
        backgroundColor: "#fff"
    },
    nodeTextDraggable: false,
    nodeSelectedOutline: true,
    hoverOutline: true,
}

export const theme = {
    baseNode: {
        stroke: "#239edd",
        strokeWidth: 1
    },
    line: {
        strokeWidth: 1
    },
    bezier: {
        strokeWidth: 1
    },
    polyline: {
        strokeWidth: 1
    },
    anchorLine: {
        strokeDasharray: "0",
        strokeWidth: 1
    }
}
