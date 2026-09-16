<template>
    <div class="system-panorama">
        <header class="system-panorama__header">
            <div class="system-selector">
                <span>当前系统</span>
                <el-select
                    v-model="currentSystemKey"
                    class="system-selector__system"
                    :style="{ width: currentSystemSelectWidth }"
                    :disabled="systemLoading || !systems.length"
                    @change="handleSystemChange"
                >
                    <el-option
                        v-for="item in systems"
                        :key="item.sysId"
                        :label="item.sysChiName"
                        :value="item.sysId"
                    />
                </el-select>
                <el-select
                    v-model="currentSystemVersionId"
                    class="system-selector__version"
                    :style="{ width: currentVersionSelectWidth }"
                    :disabled="
                        systemLoading || !currentSystemVersionOptions.length
                    "
                    @change="handleSystemVersionChange"
                >
                    <el-option
                        v-for="item in currentSystemVersionOptions"
                        :key="item.sysVersionId"
                        :label="item.sysVersionNo || item.sysVersionName"
                        :value="item.sysVersionId"
                    />
                </el-select>
            </div>
            <el-tabs v-model="currentMainTab" class="system-panorama__tabs">
                <el-tab-pane
                    v-for="tab in mainTabs"
                    :key="tab.key"
                    :label="tab.label"
                    :name="tab.key"
                    :disabled="tab.disabled"
                />
            </el-tabs>
        </header>

        <main
            v-loading="systemLoading || systemDetailLoading"
            :class="[
                'system-panorama__content',
                {
                    'system-panorama__content--diagram':
                        ['integration', 'tech', 'functional'].includes(
                            currentMainTab
                        ),
                },
            ]"
            element-loading-text="系统数据加载中"
        >
            <template v-if="systems.length">
                <system-info
                    v-if="currentMainTab === 'info'"
                    :system="currentSystem"
                    :stacks="techStacks"
                    :belong-id="currentSystemVersionId"
                />
                <system-diagram
                    v-else-if="currentMainTab === 'integration'"
                    title="集成架构图"
                    diagram-type="integration"
                    :system-key="currentSystemKey"
                    :initial-version="integrationVersion"
                    :layers="integrationLayers"
                    :item-detail-enabled="false"
                    :show-version-selector="false"
                    @model-edit="openModelEditor('integration', $event.version)"
                    @edit="openDiagramEditor('integration', $event.version)"
                />
                <system-tech-diagram
                    v-else-if="currentMainTab === 'tech'"
                    title="技术架构图"
                    :layers="techLayers"
                />

                <section
                    v-else-if="currentMainTab === 'deployment'"
                    class="tabbed-panel"
                >
                    <el-tabs v-model="currentDeploymentTab" class="sub-tabs">
                        <el-tab-pane label="逻辑部署" name="logical" />
                        <el-tab-pane label="物理部署" name="physical" />
                        <el-tab-pane label="网络设计" name="network" />
                    </el-tabs>
                    <system-diagram
                        :key="currentDeploymentTab"
                        title="部署架构图"
                        :diagram-type="`deployment-${currentDeploymentTab}`"
                        :system-key="currentSystemKey"
                        :layers="deploymentLayers"
                        @model-edit="
                            openModelEditor(
                                `deployment-${currentDeploymentTab}`,
                                $event.version
                            )
                        "
                        @edit="
                            openDiagramEditor(
                                `deployment-${currentDeploymentTab}`
                            )
                        "
                    />
                </section>

                <section
                    v-else-if="currentMainTab === 'functional'"
                    class="tabbed-panel"
                >
                    <el-tabs v-model="currentFunctionalTab" class="sub-tabs">
                        <el-tab-pane label="应用架构图" name="app" />
                        <el-tab-pane label="系统功能图" name="system" />
                        <el-tab-pane label="集成架构图" name="integration" />
                        <el-tab-pane label="数据流图" name="data" disabled />
                    </el-tabs>
                    <system-application-diagram
                        v-if="currentFunctionalTab === 'app'"
                        :system="currentSystem"
                        :layers="applicationArchData"
                        :edges="applicationArchitectureEdges"
                        :relation-diagram="applicationRelationDiagram"
                        :initial-view="currentApplicationDiagramView"
                        @view-change="handleApplicationDiagramViewChange"
                    />
                    <system-diagram
                        v-else
                        :key="currentFunctionalTab"
                        :title="functionalTitle"
                        :layers="functionalLayers"
                        :initial-zoom="
                            currentFunctionalTab === 'app' ? 0.8 : 0.9
                        "
                        :diagram-type="`functional-${currentFunctionalTab}`"
                        :system-key="currentSystemKey"
                        :show-version-selector="false"
                        @model-edit="
                            openModelEditor(
                                `functional-${currentFunctionalTab}`,
                                $event.version
                            )
                        "
                        @edit="
                            openDiagramEditor(
                                `functional-${currentFunctionalTab}`
                            )
                        "
                    />
                </section>

                <system-report v-else :system="currentSystem" />
            </template>
            <el-empty v-else-if="!systemLoading" description="暂无系统数据" />
        </main>
    </div>
</template>

<script>
import mixins from "@m/core/mixin";
import SystemInfo from "./components/SystemInfo";
import SystemDiagram from "./components/SystemDiagram";
import SystemTechDiagram from "./components/SystemTechDiagram";
import SystemReport from "./components/SystemReport";
import SystemApplicationDiagram from "./components/SystemApplicationDiagram";
import {
    getApplicationArchitectureResult,
    normalizeApplicationArchitecture,
} from "./applicationArchitectureData";
import {
    SYSTEMS,
    MAIN_TABS,
    DEPLOYMENT_VIEWS,
} from "./systemData";

const EMPTY_SYSTEM = Object.freeze({
    key: "",
    sysId: "",
    sysChiName: "",
    id: "—",
    name: "—",
    shortName: "—",
    englishName: "—",
    code: "—",
    domain: "—",
    category: "—",
    attribute: "—",
    audience: "—",
    status: "—",
    level: "—",
    launchDate: "—",
    overview: "—",
});

function getAdaptiveSelectWidth(value, minWidth) {
    const text = String(value || "");
    const textWidth = Array.from(text).reduce(
        (width, char) => width + (/[^\x00-\xff]/.test(char) ? 16 : 9),
        0
    );
    return `${Math.max(minWidth, textWidth + 48)}px`;
}

function getMockSystem(apiSystem) {
    const candidates = [
        apiSystem.sysId,
        apiSystem.sysCode,
        apiSystem.sysShortName,
        apiSystem.sysChiName,
    ]
        .filter(
            (value) => value !== undefined && value !== null && value !== ""
        )
        .map(String);

    return SYSTEMS.find((item) =>
        [item.key, item.id, item.code, item.shortName, item.name].some(
            (value) => candidates.includes(String(value))
        )
    );
}

function normalizeSystem(apiSystem = {}) {
    const mockSystem = getMockSystem(apiSystem) || {};
    const sysId = String(apiSystem.sysId || mockSystem.key || "");
    const sysChiName =
        apiSystem.sysChiName ||
        apiSystem.sysShortName ||
        mockSystem.name ||
        "—";

    return {
        ...EMPTY_SYSTEM,
        ...mockSystem,
        ...apiSystem,
        key: sysId,
        sysId,
        sysChiName,
        id: apiSystem.sysCode || apiSystem.sysId || mockSystem.id || "—",
        name: sysChiName,
        shortName:
            apiSystem.sysShortName ||
            apiSystem.sysAbbr ||
            mockSystem.shortName ||
            "—",
        englishName:
            apiSystem.sysEngName ||
            apiSystem.sysEnglishName ||
            mockSystem.englishName ||
            "—",
        code: apiSystem.sysCode || mockSystem.code || "—",
        domain:
            apiSystem.appDomainName ||
            apiSystem.appDomain ||
            mockSystem.domain ||
            "—",
        category:
            apiSystem.sysTypeName ||
            apiSystem.sysType ||
            mockSystem.category ||
            "—",
        attribute:
            apiSystem.sysAttrName ||
            apiSystem.sysAttribute ||
            apiSystem.systemAttribute ||
            mockSystem.attribute ||
            "—",
        audience:
            apiSystem.userScopeName ||
            apiSystem.userScope ||
            mockSystem.audience ||
            "—",
        status:
            apiSystem.statusName ||
            apiSystem.status ||
            mockSystem.status ||
            "—",
        level:
            apiSystem.sysLevelName ||
            apiSystem.sysLevel ||
            mockSystem.level ||
            "—",
        launchDate:
            apiSystem.launchDate ||
            apiSystem.onlineDate ||
            mockSystem.launchDate ||
            "—",
        overview:
            apiSystem.sysOverview ||
            apiSystem.sysDesc ||
            apiSystem.remark ||
            mockSystem.overview ||
            "—",
    };
}

function getSystemVersionOption(system, version = {}) {
    const sysId = String(version.sysId || system.sysId || "");
    const sysVersionId = String(version.sysVersionId || "");
    const sysVersionName =
        version.sysVersionName ||
        `${system.sysChiName}${version.sysVersionNo || ""}`;

    return {
        ...version,
        sysId,
        sysVersionId,
        sysVersionName,
    };
}

function getSystemDetailData(response = {}) {
    const result = (response && response.body) || response || {};
    return (
        result.systemDetail ||
        result.systemInfo ||
        result.detail ||
        result.data ||
        result
    );
}

const INTEGRATION_LAYER_TONES = [
    "green",
    "yellow",
    "blue",
    "default",
    "orange",
];

function normalizeLayeredDiagram(response = {}, tones = []) {
    const result = (response && response.body) || response || {};
    const layers = Array.isArray(result.layers) ? result.layers : [];
    const nodes = Array.isArray(result.nodes) ? result.nodes : [];
    const edges = Array.isArray(result.edges) ? result.edges : [];
    if (!layers.length) return [];

    const layerNodes = new Map(layers.map((layer) => [layer.fnId, []]));
    nodes.forEach((node) => {
        const targetNodes = layerNodes.get(node.parentNodeId);
        if (targetNodes) {
            targetNodes.push(node);
        }
    });

    return layers.map((layer, index) => {
        const edge = edges.find((item) => item.curFnId === layer.fnId);
        return {
            id: layer.fnId,
            code: layer.fnCode,
            description: layer.fnDesc,
            name: layer.fnName || "",
            tone: tones[index] || "default",
            protocol: (edge && edge.fnrName) || "",
            groups: [
                {
                    name: "",
                    items: (layerNodes.get(layer.fnId) || []).map(
                        (node) => node.fnName || ""
                    ),
                },
            ],
        };
    });
}

function normalizeIntegrationDiagram(response = {}) {
    return normalizeLayeredDiagram(response, INTEGRATION_LAYER_TONES);
}

function normalizeFunctionalDiagram(response = {}) {
    return normalizeLayeredDiagram(response, INTEGRATION_LAYER_TONES);
}

function normalizeTechDiagram(response = {}) {
    const result = (response && response.body) || response || {};
    const layers = Array.isArray(result.layers) ? result.layers : [];
    const nodes = Array.isArray(result.nodes) ? result.nodes : [];

    return layers.map((layer) => ({
        id: layer.fnId,
        code: layer.fnCode,
        description: layer.fnDesc,
        name: layer.fnName || "",
        groups: nodes
            .filter(
                (node) =>
                    String(node.fnClass) === "06" &&
                    node.parentNodeId === layer.fnId
            )
            .map((group) => ({
                id: group.fnId,
                code: group.fnCode,
                description: group.fnDesc,
                name: group.fnName || "",
                items: nodes
                    .filter(
                        (node) =>
                            String(node.fnClass) === "08" &&
                            node.parentNodeId === group.fnId
                    )
                    .map((node) => node.fnName || ""),
            })),
    }));
}

export default {
    name: "SystemPanorama",
    mixins: [mixins],
    components: {
        SystemInfo,
        SystemDiagram,
        SystemTechDiagram,
        SystemReport,
        SystemApplicationDiagram,
    },
    data() {
        const requestedDiagram = this.$route.query.diagram || "";
        const currentMainTab = requestedDiagram.startsWith("functional-")
            ? "functional"
            : ["integration", "tech"].includes(requestedDiagram)
            ? requestedDiagram
            : "info";
        return {
            systems: [],
            systemVersionOptions: [],
            systemLoading: false,
            systemDetailLoading: false,
            systemDetail: null,
            systemDetailRequestId: 0,
            integrationArchitectureResponse: null,
            integrationArchitectureRequestId: 0,
            techArchitectureResponse: null,
            techArchitectureRequestId: 0,
            applicationArchitectureResponse: null,
            applicationArchitectureRequestId: 0,
            applicationArchitectureEdges: [],
            applicationRelationDiagram: {},
            applicationRelationRequestId: 0,
            currentApplicationDiagramView: "matrix",
            functionalSystemArchitectureResponse: null,
            functionalArchitectureRequestId: 0,
            mainTabs: MAIN_TABS.map((tab) => ({
                ...tab,
                disabled: ["deployment", "report"].includes(tab.key),
            })),
            techStacks: [],
            integrationLayers: [],
            techLayers: [],
            functionalSystemLayers: [],
            applicationArchData: [],
            currentSystemKey: "",
            currentSystemVersionId: "",
            currentMainTab,
            integrationVersion: this.$route.query.version || "V1.0.0",
            currentDeploymentTab: requestedDiagram.startsWith("deployment-")
                ? requestedDiagram.replace("deployment-", "")
                : "logical",
            currentFunctionalTab: requestedDiagram.startsWith("functional-")
                ? requestedDiagram.replace("functional-", "")
                : "app",
        };
    },
    computed: {
        currentSystemVersionOptions() {
            return this.systemVersionOptions.filter(
                (item) => item.sysId === this.currentSystemKey
            );
        },
        currentSystemVersion() {
            return this.currentSystemVersionOptions.find(
                (item) => item.sysVersionId === this.currentSystemVersionId
            );
        },
        currentSystemSelectWidth() {
            const system = this.systems.find(
                (item) => item.sysId === this.currentSystemKey
            );
            return getAdaptiveSelectWidth(
                system && system.sysChiName,
                140
            );
        },
        currentVersionSelectWidth() {
            const version = this.currentSystemVersion;
            return getAdaptiveSelectWidth(
                version && (version.sysVersionNo || version.sysVersionName),
                110
            );
        },
        currentSystem() {
            const system =
                this.systems.find(
                    (item) => item.sysId === this.currentSystemKey
                ) || this.systems[0];
            if (!system) return EMPTY_SYSTEM;
            return normalizeSystem({
                ...system,
                ...(this.currentSystemVersion || {}),
                ...(this.systemDetail || {}),
            });
        },
        deploymentLayers() {
            return DEPLOYMENT_VIEWS[this.currentDeploymentTab];
        },
        functionalLayers() {
            if (this.currentFunctionalTab === "system")
                return this.functionalSystemLayers;
            if (this.currentFunctionalTab === "integration")
                return this.integrationLayers;
            return [];
        },
        functionalTitle() {
            return {
                app: "应用架构图",
                system: "系统功能图",
                integration: "集成架构图",
                data: "数据流图",
            }[this.currentFunctionalTab];
        },
    },
    watch: {
        currentMainTab(value) {
            if (value === "integration") {
                this.loadIntegrationArchitectureDiagram();
            } else if (value === "tech") {
                this.loadTechArchitectureDiagram();
            } else if (
                value === "functional" &&
                this.currentFunctionalTab === "app"
            ) {
                this.loadCurrentApplicationDiagram();
            } else if (value === "functional") {
                this.loadCurrentFunctionalDiagram();
            }
        },
        currentFunctionalTab(value) {
            if (this.currentMainTab !== "functional") return;
            if (value === "app") {
                this.loadCurrentApplicationDiagram();
            } else if (value === "integration") {
                this.loadIntegrationArchitectureDiagram();
            } else {
                this.loadFunctionalArchitectureDiagram(value);
            }
        },
    },
    methods: {
        async getSystemList() {
            this.systemLoading = true;
            try {
                const res = await this.rpc.assetcenter.getSystemList();
                const list = res.list || [];
                this.systems = list
                    .filter(
                        (item) =>
                            item &&
                            item.sysId !== undefined &&
                            item.sysId !== null &&
                            item.sysId !== ""
                    )
                    .map(normalizeSystem);

                const versionResponses = await Promise.all(
                    this.systems.map((system) =>
                        this.getSystemVersionListByOrg(system.sysId)
                    )
                );
                this.systemVersionOptions = versionResponses.reduce(
                    (options, response, index) => {
                        const system = this.systems[index];
                        const versions = (response && response.list) || [];
                        return options.concat(
                            versions
                                .filter(
                                    (version) => version && version.sysVersionId
                                )
                                .map((version) =>
                                    getSystemVersionOption(system, version)
                                )
                        );
                    },
                    []
                );
                const initialSystem = this.systems[2] || this.systems[0];
                this.currentSystemKey = initialSystem
                    ? initialSystem.sysId
                    : "";
                this.selectFirstSystemVersion();
                await this.loadCurrentSystemDetail();
                if (this.currentMainTab === "integration") {
                    await this.loadIntegrationArchitectureDiagram();
                } else if (this.currentMainTab === "tech") {
                    await this.loadTechArchitectureDiagram();
                } else if (
                    this.currentMainTab === "functional" &&
                    this.currentFunctionalTab === "app"
                ) {
                    await this.loadCurrentApplicationDiagram();
                } else if (this.currentMainTab === "functional") {
                    await this.loadCurrentFunctionalDiagram();
                }
            } catch (error) {
                this.systems = [];
                this.systemVersionOptions = [];
                this.currentSystemKey = "";
                this.currentSystemVersionId = "";
                this.systemDetail = null;
            } finally {
                this.systemLoading = false;
            }
        },
        getSystemVersionListByOrg(sysId) {
            return this.rpc.assetcenter.getSystemVersionListByOrg({
                sysId,
            });
        },
        getSystemDetail(params) {
            return this.rpc.assetcenter.getSystemDetail(params);
        },
        getArchitectureDiagram(params = {}) {
            return this.rpc.assetcenter.getArchitectureDiagram(params);
        },
        async loadIntegrationArchitectureDiagram() {
            const belongId = this.currentSystemVersionId;
            const requestId = ++this.integrationArchitectureRequestId;
            this.integrationArchitectureResponse = null;
            this.integrationLayers = [];
            if (!belongId) return null;

            try {
                const response = await this.getArchitectureDiagram({
                    belongId,
                    fcType: "asset",
                });
                if (requestId === this.integrationArchitectureRequestId) {
                    this.integrationArchitectureResponse = response;
                    this.integrationLayers =
                        normalizeIntegrationDiagram(response);
                }
                return response;
            } catch (error) {
                if (requestId === this.integrationArchitectureRequestId) {
                    this.integrationArchitectureResponse = null;
                    this.integrationLayers = [];
                }
                return null;
            }
        },
        async loadTechArchitectureDiagram() {
            const belongId = this.currentSystemVersionId;
            const requestId = ++this.techArchitectureRequestId;
            this.techArchitectureResponse = null;
            this.techLayers = [];
            if (!belongId) return null;

            try {
                const response = await this.getArchitectureDiagram({
                    belongId,
                    fcType: "flow",
                });
                if (requestId === this.techArchitectureRequestId) {
                    this.techArchitectureResponse = response;
                    this.techLayers = normalizeTechDiagram(response);
                }
                return response;
            } catch (error) {
                if (requestId === this.techArchitectureRequestId) {
                    this.techArchitectureResponse = null;
                    this.techLayers = [];
                }
                return null;
            }
        },
        async loadApplicationArchitectureDiagram() {
            const belongId = this.currentSystemVersionId;
            const requestId = ++this.applicationArchitectureRequestId;
            this.applicationRelationRequestId += 1;
            this.applicationArchitectureResponse = null;
            this.applicationArchData = [];
            this.applicationArchitectureEdges = [];
            this.applicationRelationDiagram = {};
            if (!belongId) return null;

            try {
                const response = await this.getArchitectureDiagram({
                    belongId,
                    fcType: "appArch",
                });
                if (requestId === this.applicationArchitectureRequestId) {
                    const result = getApplicationArchitectureResult(response);
                    this.applicationArchitectureResponse = response;
                    this.applicationArchData =
                        normalizeApplicationArchitecture(response);
                    this.applicationArchitectureEdges = Array.isArray(
                        result.edges
                    )
                        ? result.edges
                        : [];
                }
                return response;
            } catch (error) {
                if (requestId === this.applicationArchitectureRequestId) {
                    this.applicationArchitectureResponse = null;
                    this.applicationArchData = [];
                    this.applicationArchitectureEdges = [];
                }
                return null;
            }
        },
        async loadApplicationRelationDiagram() {
            const belongId = this.currentSystemVersionId;
            const requestId = ++this.applicationRelationRequestId;
            this.applicationArchitectureRequestId += 1;
            this.applicationRelationDiagram = {};
            if (!belongId) return null;

            try {
                const response = await this.getArchitectureDiagram({
                    belongId,
                    fcType: "appArchInstance",
                });
                if (requestId === this.applicationRelationRequestId) {
                    this.applicationRelationDiagram =
                        getApplicationArchitectureResult(response);
                }
                return response;
            } catch (error) {
                if (requestId === this.applicationRelationRequestId) {
                    this.applicationRelationDiagram = {};
                }
                return null;
            }
        },
        handleApplicationDiagramViewChange(view) {
            this.currentApplicationDiagramView = view;
            return this.loadCurrentApplicationDiagram();
        },
        loadCurrentApplicationDiagram() {
            return this.currentApplicationDiagramView === "relations"
                ? this.loadApplicationRelationDiagram()
                : this.loadApplicationArchitectureDiagram();
        },
        async loadFunctionalArchitectureDiagram(tab) {
            const fcType = tab === "system" ? "funcMainView" : "";
            const belongId = this.currentSystemVersionId;
            const requestId = ++this.functionalArchitectureRequestId;
            this.functionalSystemArchitectureResponse = null;
            this.functionalSystemLayers = [];
            if (!fcType || !belongId) return null;

            try {
                const response = await this.getArchitectureDiagram({
                    belongId,
                    fcType,
                });
                if (requestId !== this.functionalArchitectureRequestId) {
                    return response;
                }
                this.functionalSystemArchitectureResponse = response;
                this.functionalSystemLayers =
                    normalizeFunctionalDiagram(response);
                return response;
            } catch (error) {
                if (requestId === this.functionalArchitectureRequestId) {
                    this.functionalSystemArchitectureResponse = null;
                    this.functionalSystemLayers = [];
                }
                return null;
            }
        },
        loadCurrentFunctionalDiagram() {
            if (this.currentFunctionalTab === "app") {
                return this.loadCurrentApplicationDiagram();
            }
            if (this.currentFunctionalTab === "integration") {
                return this.loadIntegrationArchitectureDiagram();
            }
            return this.loadFunctionalArchitectureDiagram(
                this.currentFunctionalTab
            );
        },
        async loadCurrentSystemDetail() {
            const version = this.currentSystemVersion;
            const requestId = ++this.systemDetailRequestId;
            this.systemDetail = null;
            if (!version) {
                this.systemDetailLoading = false;
                return;
            }

            this.systemDetailLoading = true;
            try {
                const response = await this.getSystemDetail({
                    sysId: version.sysId,
                    sysVersionId: version.sysVersionId,
                });
                if (requestId !== this.systemDetailRequestId) return;
                this.systemDetail = getSystemDetailData(response);
            } catch (error) {
                if (requestId === this.systemDetailRequestId) {
                    this.systemDetail = null;
                }
            } finally {
                if (requestId === this.systemDetailRequestId) {
                    this.systemDetailLoading = false;
                }
            }
        },
        selectFirstSystemVersion() {
            const firstVersion = this.currentSystemVersionOptions[0];
            this.currentSystemVersionId = firstVersion
                ? firstVersion.sysVersionId
                : "";
        },
        handleSystemChange() {
            this.selectFirstSystemVersion();
            this.loadCurrentSystemDetail();
            if (this.currentMainTab === "integration") {
                this.loadIntegrationArchitectureDiagram();
            } else if (this.currentMainTab === "tech") {
                this.loadTechArchitectureDiagram();
            } else if (
                this.currentMainTab === "functional" &&
                this.currentFunctionalTab === "app"
            ) {
                this.loadCurrentApplicationDiagram();
            } else if (this.currentMainTab === "functional") {
                this.loadCurrentFunctionalDiagram();
            }
        },
        handleSystemVersionChange() {
            this.loadCurrentSystemDetail();
            if (this.currentMainTab === "integration") {
                this.loadIntegrationArchitectureDiagram();
            } else if (this.currentMainTab === "tech") {
                this.loadTechArchitectureDiagram();
            } else if (
                this.currentMainTab === "functional" &&
                this.currentFunctionalTab === "app"
            ) {
                this.loadCurrentApplicationDiagram();
            } else if (this.currentMainTab === "functional") {
                this.loadCurrentFunctionalDiagram();
            }
        },
        openDiagramEditor(type, version = "V1.0.0") {
            this.$router.push({
                name: "aopAssetcenterApplicationPanoramaEditor",
                query: {
                    type,
                    system: this.currentSystemKey,
                    version,
                },
            });
        },
        openModelEditor(type, version = "V1.0.0") {
            this.$router.push({
                name: "aopAssetcenterApplicationPanoramaModelEditor",
                query: {
                    type,
                    system: this.currentSystemKey,
                    version,
                },
            });
        },
    },
    created() {
        this.getSystemList();
    },
};
</script>

<style scoped lang="scss">
.system-panorama {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    height: 100%;
    min-height: 0;
    padding: 16px;
    box-sizing: border-box;
    background: #f4f6f9;
    color: #1f2937;
}
.system-panorama__header {
    position: sticky;
    z-index: 10;
    top: 0;
    display: flex;
    align-items: center;
    height: 68px;
    padding: 0 14px;
    border: 1px solid #e6ebf2;
    border-radius: 10px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 2px 8px rgba(31, 41, 55, 0.04);
}
.system-selector {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 10px;
    margin-right: 24px;
    min-width: 0;
    white-space: nowrap;
    font-size: 16px;
    font-weight: 700;
}
.system-selector__system {
    flex: none;
}
.system-selector__version {
    flex: none;
}
.system-selector ::v-deep .el-input__inner {
    border: 0;
    color: #1f2937;
    font-weight: 600;
}
.system-panorama__tabs {
    flex: 1;
    min-width: 0;
}
.system-panorama__tabs ::v-deep .el-tabs__header {
    margin: 0;
}
.system-panorama__tabs ::v-deep .el-tabs__nav-wrap::after {
    display: none;
}
.system-panorama__tabs ::v-deep .el-tabs__nav-scroll {
    text-align: center;
}
.system-panorama__tabs ::v-deep .el-tabs__nav {
    float: none;
    display: inline-block;
    vertical-align: top;
}
.system-panorama__tabs ::v-deep .el-tabs__item {
    height: 67px;
    padding: 0 20px;
    color: #687588;
    line-height: 67px;
}
.system-panorama__tabs ::v-deep .el-tabs__item.is-active {
    color: #2f63dc;
    font-weight: 600;
}
.system-panorama__tabs ::v-deep .el-tabs__item.is-disabled,
.system-panorama__tabs ::v-deep .el-tabs__item.is-disabled:hover {
    color: #b8c0cc !important;
    cursor: not-allowed !important;
    user-select: none;
}
.system-panorama__tabs ::v-deep .el-tabs__active-bar {
    height: 3px;
    background: #2f63dc;
}
.system-panorama__tabs ::v-deep .el-tabs__content,
.sub-tabs ::v-deep .el-tabs__content {
    display: none;
}
.system-panorama__content {
    flex: 1;
    min-height: 0;
    margin-top: 14px;
    overflow: auto;
}
.system-panorama__content--diagram {
    overflow: hidden;
}
.system-panorama__content--diagram ::v-deep .diagram-shell {
    height: 100%;
    min-height: 0;
}
.tabbed-panel {
    display: flex;
    height: 100%;
    min-height: 0;
    flex-direction: column;
    overflow: hidden;
    border-radius: 10px;
    background: #fff;
}
.tabbed-panel ::v-deep .diagram-shell,
.tabbed-panel ::v-deep .application-diagram {
    flex: 1;
    height: auto;
    min-height: 0;
}
.tabbed-panel ::v-deep .diagram-shell {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
.sub-tabs {
    flex: 0 0 52px;
    height: 52px;
    padding: 0 22px;
    border: 1px solid #e3e9f2;
    border-bottom: 0;
    border-radius: 10px 10px 0 0;
    background: #fff;
}
.sub-tabs ::v-deep .el-tabs__header {
    margin: 0;
}
.sub-tabs ::v-deep .el-tabs__nav-wrap::after {
    height: 1px;
    background: #e2e8f0;
}
.sub-tabs ::v-deep .el-tabs__nav-scroll {
    text-align: center;
}
.sub-tabs ::v-deep .el-tabs__nav {
    float: none;
    display: inline-block;
    vertical-align: top;
}
.sub-tabs ::v-deep .el-tabs__item {
    height: 52px;
    padding: 0 28px;
    line-height: 52px;
}
.sub-tabs ::v-deep .el-tabs__item.is-disabled,
.sub-tabs ::v-deep .el-tabs__item.is-disabled:hover {
    color: #b8c0cc !important;
    cursor: not-allowed !important;
    user-select: none;
}
.sub-tabs ::v-deep .el-tabs__active-bar {
    height: 3px;
    background: #2f63dc;
}
@media (max-width: 1200px) {
    .system-panorama__header {
        display: flex;
        align-items: stretch;
        height: auto;
        flex-direction: column;
    }
    .system-selector {
        flex: 0 0 auto;
        height: 58px;
    }
    .system-panorama__tabs ::v-deep .el-tabs__nav-scroll {
        text-align: left;
    }
    .system-panorama__tabs ::v-deep .el-tabs__item {
        height: 52px;
        line-height: 52px;
    }
}
</style>
