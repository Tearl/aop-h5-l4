const nodeSize = {
    width: 180,
    height: 118,
};

const embedPadding = 20;

const defaultConfig = {
    autoResize: true,
    background: {
        color: "#edeeef",
    },
    panning: false,
    mousewheel: {
        enabled: true,
        modifiers: "Ctrl",
        maxScale: 4,
        minScale: 0.2,
    },
    scaling: { min: 0.2, max: 4 },
    highlighting: {},
    connecting: {
        snap: {
            radius: 10,
        },
        allowMulti: false,
        allowNode: false,
        allowPort: true,
        allowBlank: false,
        allowLoop: false,
        allowEdge: false,
        highlight: true,
        router: {
            name: "manhattan",
            args: { padding: 20 },
        },
        connectionPoint: {
            name: "boundary",
            args: {
                sticky: true,
                offset: -4,
            },
        },
        connector: {
            name: "rounded",
            args: {
                radius: 8,
            },
        },
        validateConnection(p) {
            const { sourceView, targetView, sourceCell, targetCell, edge } = p;
            if (!targetView) {
                return true;
            }
            const origSource = edge.getData().__origSource;
            const origTarget = edge.getData().__origTarget;
            if (origSource && origTarget.cell) {
                if (sourceCell && sourceCell.id !== origSource.cell)
                    return false;
            }
            if (origTarget && origTarget.cell) {
                if (targetCell && targetCell.id !== origTarget.cell)
                    return false;
            }

            const targetNode = targetView.cell;
            const targetData = targetNode.getData();
            if (["00", "01"].includes(targetData.objType)) {
                return true;
            } else {
                return false;
            }
        },
    },
};

const ports = {
    groups: {
        left: {
            position: "left",
            attrs: {
                circle: {
                    magnet: true,
                    stroke: "#8f8f8f",
                    r: 4,
                    style: { display: "none" },
                },
            },
        },
        right: {
            position: "right",
            attrs: {
                circle: {
                    magnet: true,
                    stroke: "#8f8f8f",
                    r: 4,
                    style: { display: "none" },
                },
            },
        },
        top: {
            position: "top",
            attrs: {
                circle: {
                    magnet: true,
                    stroke: "#8f8f8f",
                    r: 4,
                    style: { display: "none" },
                },
            },
        },
        bottom: {
            position: "bottom",
            attrs: {
                circle: {
                    magnet: true,
                    stroke: "#8f8f8f",
                    r: 4,
                    style: { display: "none" },
                },
            },
        },
    },
    items: generatePortData(10),
};

const exportSheet = `
            .entity-object-node {
              width: 180px;
              height: 118px;
              border-radius: 6px;
              overflow: hidden;
              box-sizing: border-box;
            }

            .entity-object-node .header {
              height: 50px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 8px;
              border-top-left-radius: 6px;
              border-top-right-radius: 6px;
              box-sizing: border-box;
            }

            .entity-object-node .header p {
              line-height: 1;
              width: 100%;
              text-align: center;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              font-size: 14px;
              font-weight: 500;
            }

            .entity-object-node .header .title {
              font-size: 14px;
              margin-bottom: 6px;
            }

            .entity-object-node .content {
              background: #fff;
              padding: 8px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              box-sizing: border-box;
            }

            .entity-object-node .content .el-link {
              width: 100%;
            }

            .entity-object-node .content /deep/.el-link--inner {
              width: 100%;
            }

            .entity-object-node .content p {
              line-height: 1.2;
              font-size: 14px;
              width: 100%;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            }

            .entity-object-node .content p .left {
              flex: 1;
            }

            .entity-object-node .content p .value {
              font-weight: 600;
              color: #409eff;
            }

            .value-object-node {
              width: 180px;
              height: 118px;
              border-radius: 6px;
              overflow: hidden;
              box-sizing: border-box;
            }

            .value-object-node .header {
              height: 50px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 8px;
              border-top-left-radius: 6px;
              border-top-right-radius: 6px;
              box-sizing: border-box;
            }

            .value-object-node .header p {
              line-height: 1;
              width: 100%;
              text-align: center;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              font-size: 14px;
              font-weight: 500;
            }

            .value-object-node .header .title {
              font-size: 14px;
              margin-bottom: 6px;
            }

            .value-object-node .content {
              background: #fff;
              padding: 8px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              box-sizing: border-box;
            }

            .value-object-node .content .el-link {
              width: 100%;
            }

            .value-object-node .content /deep/.el-link--inner {
              width: 100%;
            }

            .value-object-node .content p {
              line-height: 1.2;
              font-size: 14px;
              width: 100%;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            }

            .value-object-node .content p .left {
              flex: 1;
            }

            .value-object-node .content p .value {
              font-weight: 600;
              color: #409eff;
            }
`;

export function generatePortData(count) {
    const groups = ["left", "right", "top", "bottom"];
    const portData = [];
    groups.forEach((group) => {
        for (let i = 0; i < count; i++) {
            portData.push({
                id: `${group}-port-${i}`,
                group: group,
            });
        }
    });

    return portData;
}

export default { defaultConfig, ports, nodeSize, exportSheet, embedPadding };


