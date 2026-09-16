<template>
    <div class="application-architecture-page">
        <aside class="application-architecture-page__sidebar">
            <div class="application-architecture-page__brand">
                <div class="application-architecture-page__brand-icon">应</div>
                <strong>应用模型</strong>
                <span>Application Model</span>
            </div>

            <nav class="application-architecture-page__levels">
                <template v-for="(item, index) in levels">
                    <button
                        :key="item.key"
                        :class="{ active: selectedLevel === item.key }"
                        type="button"
                        @click="selectedLevel = item.key"
                    >
                        {{ item.label }}
                    </button>
                    <i
                        v-if="index < levels.length - 1"
                        :key="`${item.key}-arrow`"
                        class="el-icon-bottom"
                    />
                </template>
            </nav>
        </aside>

        <main class="application-architecture-page__main">
            <system-application-diagram
                standalone
                :system="currentSystem"
                :systems="systems"
                :versions="currentSystemVersionOptions"
                :initial-version="currentSystemVersionId"
                :layers="layers"
                :edges="architectureEdges"
                :relation-diagram="relationDiagram"
                :initial-view="currentDiagramView"
                :focus-level="selectedLevel"
                :loading="systemLoading || diagramLoading"
                @system-change="changeSystem"
                @version-change="handleVersionChange"
                @view-change="handleDiagramViewChange"
            />
        </main>
    </div>
</template>

<script>
import rpcMixins from "../../core/mixin";
import SystemApplicationDiagram from "../applicationPanorama/components/SystemApplicationDiagram.vue";
import {
    getApplicationArchitectureResult,
    normalizeApplicationArchitecture,
} from "../applicationPanorama/applicationArchitectureData";

export default {
    name: "ApplicationArchitecture",
    mixins: [rpcMixins],
    components: { SystemApplicationDiagram },
    data() {
        return {
            selectedLevel: "system",
            levels: [
                { key: "system", label: "系统" },
                { key: "application", label: "应用" },
                { key: "module", label: "模块" },
                { key: "service", label: "服务" },
                { key: "interface", label: "接口" },
            ],
            systems: [],
            currentSystemId: "",
            systemVersionOptions: [],
            currentSystemVersionId: "",
            systemLoading: false,
            diagramLoading: false,
            architectureEdges: [],
            relationDiagram: {},
            currentDiagramView: "matrix",
            architectureRequestId: 0,
            relationRequestId: 0,
            layers: [],
        };
    },
    computed: {
        currentSystem() {
            return (
                this.systems.find(
                    (item) => item.sysId === this.currentSystemId
                ) ||
                this.systems[0] || { id: "", name: "" }
            );
        },
        currentSystemVersionOptions() {
            return this.systemVersionOptions.filter(
                (item) => item.sysId === this.currentSystemId
            );
        },
    },
    methods: {
        changeSystem(name) {
            const item = this.systems.find((system) => system.name === name);
            if (!item) return;
            this.currentSystemId = item.sysId;
            this.selectFirstSystemVersion();
            this.loadCurrentDiagram();
        },
        async getSystemList() {
            this.systemLoading = true;
            try {
                const res = await this.rpc.assetcenter.getSystemList();
                this.systems = (res.list || [])
                    .filter((item) => item && item.sysId)
                    .map((item) => ({
                        ...item,
                        id: item.sysId,
                        name:
                            item.sysChiName ||
                            item.sysShortName ||
                            item.sysCode ||
                            item.sysId,
                    }));

                const responses = await Promise.all(
                    this.systems.map((system) =>
                        this.getSystemVersionListByOrg(system.sysId)
                    )
                );
                this.systemVersionOptions = responses.reduce(
                    (options, response, index) => {
                        const system = this.systems[index];
                        const versions = (response && response.list) || [];
                        return options.concat(
                            versions
                                .filter(
                                    (version) =>
                                        version && version.sysVersionId
                                )
                                .map((version) => ({
                                    ...version,
                                    sysId: version.sysId || system.sysId,
                                }))
                        );
                    },
                    []
                );
                this.currentSystemId = this.systems[0]
                    ? this.systems[0].sysId
                    : "";
                this.selectFirstSystemVersion();
                this.loadCurrentDiagram();
            } catch (error) {
                this.systems = [];
                this.systemVersionOptions = [];
                this.currentSystemId = "";
                this.currentSystemVersionId = "";
                this.layers = [];
                this.architectureEdges = [];
            } finally {
                this.systemLoading = false;
            }
        },
        getSystemVersionListByOrg(sysId) {
            return this.rpc.assetcenter.getSystemVersionListByOrg({ sysId });
        },
        selectFirstSystemVersion() {
            const firstVersion = this.currentSystemVersionOptions[0];
            this.currentSystemVersionId = firstVersion
                ? firstVersion.sysVersionId
                : "";
        },
        handleVersionChange(sysVersionId) {
            this.currentSystemVersionId = sysVersionId;
            this.loadCurrentDiagram();
        },
        handleDiagramViewChange(view) {
            this.currentDiagramView = view;
            if (view === "relations") {
                return this.loadApplicationRelationDiagram();
            }
            return this.loadArchitectureDiagram();
        },
        loadCurrentDiagram() {
            return this.currentDiagramView === "relations"
                ? this.loadApplicationRelationDiagram()
                : this.loadArchitectureDiagram();
        },
        getArchitectureDiagram(params = {}) {
            return this.rpc.assetcenter.getArchitectureDiagram(params);
        },
        async loadApplicationRelationDiagram() {
            const requestId = ++this.relationRequestId;
            this.architectureRequestId += 1;
            this.relationDiagram = {};
            if (!this.currentSystemVersionId) return null;
            this.diagramLoading = true;
            try {
                const response = await this.getArchitectureDiagram({
                    belongId: this.currentSystemVersionId,
                    fcType: "appArchInstance",
                });
                if (requestId === this.relationRequestId) {
                    this.relationDiagram =
                        getApplicationArchitectureResult(response);
                }
                return response;
            } catch (error) {
                if (requestId === this.relationRequestId) {
                    this.relationDiagram = {};
                }
                return null;
            } finally {
                if (requestId === this.relationRequestId) {
                    this.diagramLoading = false;
                }
            }
        },
        async loadArchitectureDiagram() {
            const requestId = ++this.architectureRequestId;
            this.relationRequestId += 1;
            this.relationDiagram = {};
            this.layers = [];
            this.architectureEdges = [];
            if (!this.currentSystemVersionId) {
                this.diagramLoading = false;
                return Promise.resolve(null);
            }
            this.diagramLoading = true;
            try {
                const response = await this.getArchitectureDiagram({
                    belongId: this.currentSystemVersionId,
                    fcType: "appArch",
                });
                if (requestId !== this.architectureRequestId) return response;
                this.layers = this.normalizeArchitectureLayers(response);
                const result = getApplicationArchitectureResult(response);
                this.architectureEdges = Array.isArray(result.edges)
                    ? result.edges
                    : [];
                return response;
            } catch (error) {
                if (requestId === this.architectureRequestId) {
                    this.layers = [];
                    this.architectureEdges = [];
                }
                return null;
            } finally {
                if (requestId === this.architectureRequestId) {
                    this.diagramLoading = false;
                }
            }
        },
        normalizeArchitectureLayers(response) {
            return normalizeApplicationArchitecture(response);
        },
        getAppModelTree(params = {}) {
            return this.rpc.assetcenter.getAppModelTree(params);
        },
        getAppNodeDetail(params = {}) {
            return this.rpc.assetcenter.getAppNodeDetail(params);
        },
    },
    created() {
        this.getSystemList();
    },
};
</script>

<style scoped>
.application-architecture-page {
    display: flex;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    background: #fff;
    color: #1e2c42;
}
.application-architecture-page__sidebar {
    display: flex;
    width: 250px;
    flex: 0 0 250px;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid #e2e7ef;
    background: #fff;
}
.application-architecture-page__brand {
    flex-shrink: 0;
    padding: 30px 24px 28px;
    border-bottom: 1px solid #edf0f4;
    text-align: center;
}
.application-architecture-page__brand-icon {
    display: flex;
    width: 52px;
    height: 52px;
    align-items: center;
    justify-content: center;
    margin: 0 auto 10px;
    border-radius: 12px;
    background: linear-gradient(135deg, #2b5fd7, #7048bd);
    box-shadow: 0 6px 16px rgba(43, 95, 215, 0.2);
    color: #fff;
    font-size: 22px;
    font-weight: 700;
}
.application-architecture-page__brand strong {
    display: block;
    color: #222b38;
    font-size: 19px;
}
.application-architecture-page__brand span {
    display: block;
    margin-top: 3px;
    color: #9aa3af;
    font-size: 11px;
}
.application-architecture-page__levels {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    align-items: center;
    padding: 28px 24px;
    overflow-y: auto;
}
.application-architecture-page__levels button {
    width: 168px;
    min-height: 46px;
    padding: 11px 12px;
    border: 1px solid #dfe7f4;
    border-radius: 6px;
    background: #eef3fb;
    color: #38537d;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}
.application-architecture-page__levels button.active {
    border-color: #2b5fd7;
    background: #2b5fd7;
    box-shadow: 0 5px 14px rgba(43, 95, 215, 0.22);
    color: #fff;
}
.application-architecture-page__levels i {
    height: 28px;
    flex-shrink: 0;
    color: #b9c7da;
    font-size: 13px;
    line-height: 28px;
}
.application-architecture-page__main {
    min-width: 0;
    min-height: 0;
    flex: 1;
    overflow: hidden;
}
</style>
