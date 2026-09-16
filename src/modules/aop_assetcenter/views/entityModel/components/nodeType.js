const NodeTypeTag = {
    "00": "warning",
    "01": "success",
    "02": "primary",
    "03": "danger",
    "04": "info",
    "05": "default",
};

const NodeTypeTagText = {
    "00": "产品树",
    "01": "产品",
    "02": "业务",
    "03": "流程段",
    "04": "接口",
    "05": "服务",
};

function formatTree(app, versionList) {
    const root = {
        id: app.appId,
        parentId: "",
        label: app.appName,
        dataType: "00",
        children: [],
        info: app,
    };

    root.children = versionList.map((version) => {
        const versionNode = {
            id: version.houseTypeVersionId,
            parentId: root.id,
            label: version.houseTypeName,
            dataType: "01",
            children: [],
            info: version,
        };

        if (Array.isArray(version.moduleLists)) {
            versionNode.children = version.moduleLists.map((module) => {
                const moduleNode = {
                    id: module.modId,
                    parentId: versionNode.id,
                    label: module.modName,
                    dataType: "02",
                    children: [],
                    info: module,
                };
                if (Array.isArray(module.functionList)) {
                    moduleNode.children = module.functionList.map((func) => {
                        const funcNode = {
                            id: func.functionId,
                            parentId: moduleNode.id,
                            label: func.functionName,
                            dataType: "03",
                            children: [],
                            info: func,
                        };
                        return funcNode;
                    });
                }
                return moduleNode;
            });
        }
        return versionNode;
    });

    return root;
}

module.exports = { NodeTypeTag, NodeTypeTagText, formatTree };


