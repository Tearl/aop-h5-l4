export function getApplicationArchitectureResult(response = {}) {
    return (response && response.body) || response || {};
}

function getBusinessLineName(propsConfig) {
    if (!propsConfig) return "";

    if (typeof propsConfig === "object") {
        return propsConfig.businessLineName || "";
    }

    try {
        const config = JSON.parse(propsConfig);
        return config && config.businessLineName
            ? config.businessLineName
            : "";
    } catch (error) {
        return "";
    }
}

export function normalizeApplicationArchitecture(response = {}) {
    const result = getApplicationArchitectureResult(response);
    const responseLayers = Array.isArray(result.layers) ? result.layers : [];
    const nodes = Array.isArray(result.nodes) ? result.nodes : [];

    const layers = responseLayers.map((layer) => ({
        id: layer.fnId,
        code: layer.fnCode,
        desc: layer.fnDesc,
        layer: layer.fnName || "",
        apps: [],
    }));
    const layerMap = new Map(layers.map((layer) => [layer.id, layer]));
    const appMap = new Map();

    nodes
        .filter((node) => String(node.fnClass) === "06")
        .forEach((node) => {
            const targetLayer = layerMap.get(node.parentNodeId);
            if (!targetLayer) return;
            const app = {
                id: node.fnId,
                code: node.fnCode,
                desc: node.fnDesc,
                name: node.fnName || "",
                line: getBusinessLineName(node.propsConfig),
                modules: [],
                raw: node,
            };
            targetLayer.apps.push(app);
            appMap.set(app.id, app);
        });

    nodes
        .filter((node) => String(node.fnClass) === "07")
        .forEach((node) => {
            const targetApp = appMap.get(node.parentNodeId);
            if (!targetApp) return;
            targetApp.modules.push([
                node.fnName || "",
                node.fnDesc || "",
                "",
                node,
            ]);
        });

    return layers;
}
