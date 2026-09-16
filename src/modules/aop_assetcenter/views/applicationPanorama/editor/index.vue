<template>
    <div class="drawio-editor-host">
        <iframe
            ref="drawioFrame"
            class="drawio-editor-frame"
            :src="drawioUrl"
            title="draw.io 架构图编辑器"
            allow="clipboard-read; clipboard-write"
        />
        <div v-if="loading" class="drawio-loading">
            <i class="el-icon-loading" />
            <strong>正在打开 {{ diagramTitle }}</strong>
            <span>首次加载 draw.io 编辑器可能需要几秒钟</span>
            <el-button size="small" @click="goBack">返回系统全景</el-button>
        </div>
    </div>
</template>

<script>
import {
    INTEGRATION_LAYERS,
    TECH_LAYERS,
    DEPLOYMENT_VIEWS,
    FUNCTION_LAYERS,
    APP_LAYERS,
    DATA_FLOW_LAYERS,
} from "../systemData";
import {
    loadDiagramRecord,
    saveDiagramRecord,
} from "../diagramStorage";

const DRAWIO_BASE_URL = window.AOP_DRAWIO_URL || "https://embed.diagrams.net";
const DRAWIO_ORIGIN = new URL(DRAWIO_BASE_URL, window.location.href).origin;
const DRAWIO_URL = `${DRAWIO_BASE_URL.replace(
    /\/$/,
    ""
)}/?embed=1&proto=json&configure=1&spin=1&libraries=1&saveAndExit=1&ui=kennedy&lang=zh`;

const DRAWIO_CONFIG = {
    css: [
        ".geMenubar { display: none !important; }",
        ".geStatus { display: none !important; }",
    ].join(" "),
};

const DIAGRAMS = {
    integration: { title: "集成架构图", layers: INTEGRATION_LAYERS },
    tech: { title: "技术架构图", layers: TECH_LAYERS },
    "deployment-logical": {
        title: "部署架构图 - 逻辑部署",
        layers: DEPLOYMENT_VIEWS.logical,
    },
    "deployment-physical": {
        title: "部署架构图 - 物理部署",
        layers: DEPLOYMENT_VIEWS.physical,
    },
    "deployment-network": {
        title: "部署架构图 - 网络设计",
        layers: DEPLOYMENT_VIEWS.network,
    },
    "functional-app": { title: "应用架构图", layers: APP_LAYERS },
    "functional-system": { title: "系统功能图", layers: FUNCTION_LAYERS },
    "functional-integration": {
        title: "集成架构图",
        layers: INTEGRATION_LAYERS,
    },
    "functional-data": { title: "数据流图", layers: DATA_FLOW_LAYERS },
};

const escapeXml = (value) =>
    String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

const toneColor = (tone) =>
    ({
        green: "#eef8e8",
        yellow: "#fff7dc",
        blue: "#e3f1ff",
        orange: "#fff0e6",
    }[tone] || "#f4f9ff");

function createInitialDrawioXml(title, layers) {
    const cells = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>'];
    const layerX = 90;
    const layerWidth = 1120;
    const contentWidth = layerWidth - 180;
    let layerY = 60;
    let previousLayerId = "";

    layers.forEach((layer, layerIndex) => {
        const groups = layer.groups || [];
        const gap = 12;
        const groupWidth = Math.max(
            250,
            (contentWidth - Math.max(0, groups.length - 1) * gap) /
                Math.max(1, groups.length)
        );
        const groupHeights = groups.map((group) => {
            const columns = Math.max(1, Math.floor((groupWidth - 24) / 136));
            return Math.max(
                76,
                Math.ceil((group.items || []).length / columns) * 50 +
                    (group.name ? 38 : 20)
            );
        });
        const layerHeight = Math.max(112, Math.max(...groupHeights, 76) + 24);
        const layerId = `layer-${layerIndex}`;
        const layerStyle = [
            "swimlane",
            "html=1",
            "horizontal=0",
            "startSize=150",
            "rounded=1",
            "arcSize=8",
            "collapsible=0",
            "recursiveResize=0",
            "container=1",
            "fontSize=18",
            "fontStyle=1",
            "fontColor=#28384e",
            `fillColor=${toneColor(layer.tone)}`,
            "swimlaneFillColor=#ffffff",
            "strokeColor=#cbdff5",
            "separatorColor=#aab8ca",
        ].join(";");
        cells.push(
            `<mxCell id="${layerId}" value="${escapeXml(
                layer.name
            )}" businessKind="layer" style="${layerStyle}" vertex="1" parent="1">` +
                `<mxGeometry x="${layerX}" y="${layerY}" width="${layerWidth}" height="${layerHeight}" as="geometry"/>` +
                "</mxCell>"
        );

        groups.forEach((group, groupIndex) => {
            const groupId = `${layerId}-group-${groupIndex}`;
            const groupX = 162 + groupIndex * (groupWidth + gap);
            const groupHeight = groupHeights[groupIndex];
            const groupStyle =
                "rounded=1;whiteSpace=wrap;html=1;container=1;recursiveResize=0;fillColor=#ffffff;fillOpacity=88;strokeColor=#c4d7ef;fontColor=#51627a;verticalAlign=top;spacingTop=8;";
            cells.push(
                `<mxCell id="${groupId}" value="${escapeXml(
                    group.name || ""
                )}" businessKind="group" style="${groupStyle}" vertex="1" parent="${layerId}">` +
                    `<mxGeometry x="${groupX}" y="12" width="${groupWidth}" height="${groupHeight}" as="geometry"/>` +
                    "</mxCell>"
            );
            const columns = Math.max(1, Math.floor((groupWidth - 24) / 136));
            const items = group.items || [];
            const usedColumns = Math.min(columns, Math.max(1, items.length));
            const rowWidth =
                usedColumns * 126 + Math.max(0, usedColumns - 1) * 10;
            const firstX = (groupWidth - rowWidth) / 2;
            items.forEach((name, itemIndex) => {
                const column = itemIndex % columns;
                const row = Math.floor(itemIndex / columns);
                const itemId = `${groupId}-item-${itemIndex}`;
                const itemStyle =
                    "rounded=1;whiteSpace=wrap;html=1;fillColor=#edf3ff;strokeColor=#9dbdff;fontColor=#315da8;fontSize=13;";
                cells.push(
                    `<mxCell id="${itemId}" value="${escapeXml(
                        name
                    )}" businessKind="system" style="${itemStyle}" vertex="1" parent="${groupId}">` +
                        `<mxGeometry x="${firstX + column * 136}" y="${
                            (group.name ? 30 : 16) + row * 50
                        }" width="126" height="42" as="geometry"/>` +
                        "</mxCell>"
                );
            });
        });

        if (previousLayerId) {
            const edgeId = `edge-${layerIndex - 1}-${layerIndex}`;
            const protocol = layers[layerIndex - 1].protocol || "";
            const edgeStyle =
                "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#8292a8;endArrow=classic;endFill=1;";
            cells.push(
                `<mxCell id="${edgeId}" value="${escapeXml(
                    protocol
                )}" businessKind="protocol" style="${edgeStyle}" edge="1" parent="1" source="${previousLayerId}" target="${layerId}">` +
                    '<mxGeometry relative="1" as="geometry"/>' +
                    "</mxCell>"
            );
        }
        previousLayerId = layerId;
        layerY += layerHeight + 62;
    });

    return [
        '<mxfile host="system-panorama" agent="aop-assetcenter" version="1.0">',
        `<diagram id="system-architecture" name="${escapeXml(title)}">`,
        '<mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1654" pageHeight="1169" math="0" shadow="0">',
        "<root>",
        cells.join(""),
        "</root>",
        "</mxGraphModel>",
        "</diagram>",
        "</mxfile>",
    ].join("");
}

export default {
    name: "DrawioArchitectureEditor",
    data() {
        return {
            drawioUrl: DRAWIO_URL,
            loading: true,
            pendingExit: false,
            latestXml: "",
            diagramRecord: null,
        };
    },
    computed: {
        diagramType() {
            return this.$route.query.type || "integration";
        },
        diagramConfig() {
            return DIAGRAMS[this.diagramType] || DIAGRAMS.integration;
        },
        diagramTitle() {
            return this.$route.query.title || this.diagramConfig.title;
        },
        diagramVersion() {
            return this.$route.query.version || "V1.0.0";
        },
        isManagedIntegration() {
            return this.diagramType === "integration";
        },
        diagramContext() {
            return {
                systemId: this.$route.query.system || "default",
                diagramType: this.diagramType,
                diagramName: this.diagramTitle,
                version: this.diagramVersion,
            };
        },
        storagePrefix() {
            return `drawio-architecture:${
                this.$route.query.system || "default"
            }:${this.diagramType}`;
        },
        xmlStorageKey() {
            return `${this.storagePrefix}:xml`;
        },
        previewStorageKey() {
            return `${this.storagePrefix}:svg`;
        },
    },
    mounted() {
        window.addEventListener("message", this.handleDrawioMessage);
    },
    beforeDestroy() {
        window.removeEventListener("message", this.handleDrawioMessage);
    },
    methods: {
        handleDrawioMessage(event) {
            if (
                event.origin !== DRAWIO_ORIGIN ||
                event.source !== this.$refs.drawioFrame.contentWindow
            )
                return;
            let message = event.data;
            if (typeof message === "string") {
                try {
                    message = JSON.parse(message);
                } catch (error) {
                    return;
                }
            }
            if (!message || !message.event) return;

            if (message.event === "configure") {
                this.postToDrawio({
                    action: "configure",
                    config: DRAWIO_CONFIG,
                });
            } else if (message.event === "init") {
                this.loadDiagram();
            } else if (message.event === "load") {
                this.loading = false;
            } else if (message.event === "autosave" && message.xml) {
                this.latestXml = message.xml;
                this.persistXml(message.xml);
            } else if (message.event === "save" && message.xml) {
                const saveEventData = {
                    event: message.event,
                    diagramType: this.diagramType,
                    system: this.$route.query.system || "default",
                    version: this.diagramVersion,
                    exit: Boolean(message.exit),
                    savedAt: new Date().toISOString(),
                    xml: message.xml,
                };
                console.log(
                    "[draw.io] save event JSON\n",
                    JSON.stringify(saveEventData, null, 2)
                );
                this.saveDiagram(message);
            } else if (message.event === "export" && message.format === "svg") {
                this.persistPreview(message.data);
            } else if (message.event === "exit") {
                this.handleExit(message.modified);
            }
        },
        postToDrawio(message) {
            const frame = this.$refs.drawioFrame;
            if (!frame || !frame.contentWindow) return;
            frame.contentWindow.postMessage(
                JSON.stringify(message),
                DRAWIO_ORIGIN
            );
        },
        loadDiagram() {
            let storedXml = "";
            if (this.isManagedIntegration) {
                try {
                    this.diagramRecord = loadDiagramRecord(
                        this.diagramContext
                    );
                    storedXml = this.diagramRecord
                        ? this.diagramRecord.diagramXml || ""
                        : "";
                } catch (error) {
                    this.$message.warning("本地架构图数据读取失败，将加载初始图");
                }
            } else {
                storedXml = localStorage.getItem(this.xmlStorageKey) || "";
            }
            this.latestXml =
                storedXml ||
                createInitialDrawioXml(
                    this.diagramTitle,
                    this.diagramConfig.layers
                );
            this.postToDrawio({
                action: "load",
                xml: this.latestXml,
                title: this.diagramTitle,
                autosave: 1,
                saveAndExit: 1,
                noExitBtn: 0,
                exportProtocol: false,
                fit: 1,
                maxFitScale: 1,
            });
        },
        saveDiagram(message) {
            this.latestXml = message.xml;
            this.pendingExit = Boolean(message.exit);
            if (!this.persistXml(message.xml)) return;
            this.postToDrawio({
                action: "export",
                format: "svg",
                xml: message.xml,
                border: 16,
                background: "#ffffff",
                embedImages: true,
            });
        },
        persistXml(xml) {
            try {
                if (this.isManagedIntegration) {
                    this.diagramRecord = saveDiagramRecord(
                        this.diagramContext,
                        {
                            diagramName: this.diagramTitle,
                            diagramXml: xml,
                        }
                    );
                } else {
                    localStorage.setItem(this.xmlStorageKey, xml);
                }
                return true;
            } catch (error) {
                this.$message.error(
                    "图形数据过大，暂时无法保存到本地 Mock 存储"
                );
                return false;
            }
        },
        persistPreview(svgData) {
            try {
                if (this.isManagedIntegration) {
                    this.diagramRecord = saveDiagramRecord(
                        this.diagramContext,
                        {
                            diagramName: this.diagramTitle,
                            previewSvg: svgData,
                        }
                    );
                } else {
                    localStorage.setItem(this.previewStorageKey, svgData);
                }
                if (this.pendingExit) {
                    this.pendingExit = false;
                    this.goBack();
                } else {
                    this.$message.success(
                        "架构图已保存，系统查看页将展示最新版本"
                    );
                    this.postToDrawio({
                        action: "status",
                        message: "已保存到系统",
                        modified: false,
                    });
                }
            } catch (error) {
                this.$message.error("预览数据过大，源文件已保存但查看图未更新");
            }
        },
        handleExit(modified) {
            if (!modified) {
                this.goBack();
                return;
            }
            this.$confirm("当前修改尚未保存，确定退出编辑器吗？", "退出编辑", {
                confirmButtonText: "直接退出",
                cancelButtonText: "继续编辑",
                type: "warning",
            })
                .then(this.goBack)
                .catch(() => {});
        },
        goBack() {
            this.$router.replace({
                name: "aopAssetcenterApplicationPanorama",
                query: {
                    diagram: this.diagramType,
                    system: this.$route.query.system || "default",
                    version: this.diagramVersion,
                },
            });
        },
    },
};
</script>

<style scoped>
.drawio-editor-host {
    position: fixed;
    z-index: 2100;
    inset: 0;
    overflow: hidden;
    background: #f2f3f4;
}
.drawio-editor-frame {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    background: #f2f3f4;
}
.drawio-loading {
    position: absolute;
    z-index: 2;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
    background: #f7f8fa;
    color: #526071;
}
.drawio-loading i {
    color: #2f80ed;
    font-size: 30px;
}
.drawio-loading strong {
    color: #1f2937;
    font-size: 17px;
}
.drawio-loading span {
    margin-bottom: 6px;
    color: #8a96a6;
    font-size: 13px;
}
</style>
