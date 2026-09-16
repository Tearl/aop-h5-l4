<template>
    <div
        ref="shell"
        :class="['application-diagram', { 'application-diagram--standalone': standalone }]"
        v-loading="loading"
    >
        <div class="application-diagram__toolbar">
            <div class="application-diagram__title">
                {{ standalone ? "应用架构实例图" : "应用架构图" }}
            </div>
            <div class="application-diagram__legend">
                <span><i class="legend-app" />应用</span>
                <span><i class="legend-module" />模块</span>
            </div>
            <div v-if="!standalone" class="view-switch">
                <button
                    :class="{ active: view === 'matrix' }"
                    type="button"
                    @click="changeView('matrix')"
                >
                    分层矩阵
                </button>
                <button
                    :class="{ active: view === 'relations' }"
                    type="button"
                    @click="changeView('relations')"
                >
                    应用间关系
                </button>
            </div>
            <div class="application-diagram__tools">
                <button type="button" title="缩小" @click="changeZoom(-0.1)">
                    −
                </button>
                <span>{{ Math.round(zoom * 100) }}%</span>
                <button type="button" title="放大" @click="changeZoom(0.1)">
                    +
                </button>
                <button type="button" title="复原" @click="reset">
                    <img
                        :src="require('@m/assets/images/refresh-reset.svg')"
                        width="16"
                        height="16"
                        alt=""
                        draggable="false"
                    >
                </button>
                <button type="button" title="全屏" @click="toggleFullscreen">
                    {{ fullscreen ? "×" : "⛶" }}
                </button>
            </div>
        </div>

        <div v-if="standalone" class="application-diagram__filters">
            <strong>当前系统</strong>
            <el-select
                v-model="selectedSystemName"
                size="small"
                class="system-select"
                :disabled="loading || !systemOptions.length"
                @change="$emit('system-change', selectedSystemName)"
            >
                <el-option
                    v-for="item in systemOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                />
            </el-select>
            <strong>版本</strong>
            <el-select
                v-model="version"
                size="small"
                class="version-select"
                :disabled="loading || !versionOptions.length"
                @change="$emit('version-change', version)"
            >
                <el-option
                    v-for="item in versionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
            <div class="view-switch">
                <button
                    :class="{ active: view === 'matrix' }"
                    type="button"
                    @click="changeView('matrix')"
                >
                    分层矩阵
                </button>
                <button
                    :class="{ active: view === 'relations' }"
                    type="button"
                    @click="changeView('relations')"
                >
                    应用间关系
                </button>
            </div>
        </div>

        <div
            ref="canvas"
            :class="[
                'application-diagram__canvas',
                { dragging, 'is-empty': !hasCurrentDiagramData },
            ]"
            @wheel="onWheel"
            @mousedown="startPan"
            @mousemove="movePan"
            @mouseup="endPan"
            @mouseleave="endPan"
        >
            <div
                class="application-diagram__stage"
                :style="{ transform: `scale(${zoom})` }"
            >
                <el-empty
                    v-if="!hasCurrentDiagramData"
                    class="application-diagram__empty"
                    :description="
                        view === 'relations'
                            ? '暂无应用关系数据'
                            : '暂无架构图数据'
                    "
                />
                <div
                    v-else
                    :class="[
                        'application-diagram__panel',
                        {
                            'is-focus':
                                focusLevel === 'system' && view === 'matrix',
                        },
                    ]"
                >
                <div v-if="view === 'matrix'" class="architecture-matrix">
                    <section
                        v-for="layer in layers"
                        :key="layer.layer"
                        class="architecture-layer"
                    >
                        <div class="architecture-layer__label">
                            {{ layer.layer }}
                        </div>
                        <div class="architecture-layer__apps">
                            <article
                                v-for="app in layer.apps"
                                :key="app.name"
                                :class="[
                                    'application-card',
                                    { 'is-focus': focusLevel === 'application' },
                                ]"
                            >
                                <header>
                                    {{ app.name }}<span>{{ app.line }}</span>
                                </header>
                                <div
                                    v-if="app.modules && app.modules.length"
                                    class="application-card__modules"
                                >
                                    <button
                                        v-for="module in app.modules"
                                        :key="module[0]"
                                        :class="{ 'is-focus': focusLevel === 'module' }"
                                        type="button"
                                        @click.stop="
                                            openModule(module, app, layer)
                                        "
                                    >
                                        {{ module[0] }}
                                    </button>
                                </div>
                                <div v-else class="application-card__empty">
                                    暂无模块数据
                                </div>
                            </article>
                        </div>
                    </section>
                </div>
                <div v-else class="relation-board">
                    <template v-if="relationLayout.nodes.length">
                    <svg aria-label="应用间调用关系">
                        <defs>
                            <marker
                                id="application-relation-arrow"
                                markerWidth="7"
                                markerHeight="7"
                                refX="6"
                                refY="3.5"
                                orient="auto"
                            >
                                <path d="M0 0L7 3.5L0 7Z" fill="#6f86a5" />
                            </marker>
                        </defs>
                        <g
                            v-for="edge in relationLayout.edges"
                            :key="edge.id"
                        >
                            <path
                                :class="{ backup: edge.dashed }"
                                :d="edge.path"
                                marker-end="url(#application-relation-arrow)"
                            >
                                <title>{{ edge.desc }}</title>
                            </path>
                            <text
                                :x="edge.labelX"
                                :y="edge.labelY - 6"
                                text-anchor="middle"
                            >
                                {{ edge.name }}
                            </text>
                        </g>
                    </svg>
                    <div
                        v-for="node in relationLayout.nodes"
                        :key="node.id"
                        class="relation-node"
                        :style="{ left: `${node.x}px`, top: `${node.y}px` }"
                    >
                        <span>{{ node.name }}</span>
                        <small>{{ node.layerName }}</small>
                    </div>
                    </template>
                </div>
                </div>
            </div>
        </div>

        <el-drawer
            :visible.sync="moduleDrawerVisible"
            title="模块详情"
            direction="rtl"
            size="700px"
            append-to-body
            class="application-module-detail-drawer"
            @closed="handleModuleDrawerClosed"
        >
            <div v-if="selectedModule" class="module-drawer__body">
                <h3>基本信息</h3>
                <div v-loading="moduleDetailLoading" class="module-info">
                    <span>模块ID</span><b>{{ selectedModule.id || "/" }}</b>
                    <span>模块名称</span
                    ><b>{{ selectedModule.name || "/" }}</b>
                    <span>模块描述</span>
                    <b class="module-info__description">
                        <aopCommonDocPreview
                            :data="selectedModule.description || '/'"
                        />
                    </b>
                    <span>所在层级</span
                    ><b
                        class="module-info__hierarchy"
                        >{{ system.name || "/" }} /
                        {{
                            selectedModule.appName ||
                            selectedModule.contextAppName ||
                            "/"
                        }}</b
                    >
                </div>
                <h3>接口清单</h3>
                <div class="module-filter">
                    <el-input
                        v-model.trim="keyword"
                        size="small"
                        clearable
                        placeholder="请输入接口名称/编码"
                        @keyup.enter.native="applyFilters"
                    />
                    <el-select
                        v-model="service"
                        size="small"
                        placeholder="全部服务"
                        clearable
                        >
                        <el-option label="全部" value="" />
                        <el-option
                            v-for="item in moduleServiceOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                    <el-button type="primary" size="small" @click="applyFilters"
                        >搜索</el-button
                    >
                    <el-button size="small" @click="resetFilters"
                        >重置</el-button
                    >
                </div>
                <el-table
                    v-loading="moduleApiLoading"
                    class="module-table"
                    :data="interfaces"
                    border
                >
                    <el-table-column
                        prop="name"
                        label="接口名称"
                        min-width="170"
                    />
                    <el-table-column
                        prop="code"
                        label="接口编码"
                        min-width="150"
                    />
                    <el-table-column
                        prop="service"
                        label="所属服务"
                        min-width="130"
                    />
                    <el-table-column label="操作" width="70"
                        ><template slot-scope="scope"
                            ><el-button
                                type="text"
                                @click="viewInterface(scope.row)"
                                >查看</el-button
                            ></template
                        ></el-table-column
                    >
                </el-table>
                <div class="module-pagination">
                    <el-pagination
                        :current-page.sync="page"
                        :page-size="pageSize"
                        :page-sizes="[10, 20, 30, 50]"
                        :total="moduleApiTotal"
                        layout="total, sizes, prev, pager, next"
                        @size-change="onPageSizeChange"
                        @current-change="onPageChange"
                    />
                </div>
                <div v-if="selectedInterface" class="interface-preview">
                    <strong>{{ selectedInterface.name }}</strong
                    ><br />接口编码：{{ selectedInterface.code
                    }}<br />所属服务：{{ selectedInterface.service
                    }}<template v-if="selectedInterface.source"
                        ><br />调用示例：{{
                            selectedInterface.source
                        }}</template
                    >
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import mixins from "@m/core/mixin";
export default {
    name: "SystemApplicationDiagram",
    props: {
        system: { type: Object, required: true },
        layers: { type: Array, required: true },
        edges: { type: Array, default: () => [] },
        relationDiagram: { type: Object, default: () => ({}) },
        standalone: { type: Boolean, default: false },
        systems: { type: Array, default: () => [] },
        versions: { type: Array, default: () => ["V1.0.0", "V2.0.0"] },
        initialVersion: { type: String, default: "V1.0.0" },
        initialView: {
            type: String,
            default: "matrix",
            validator: (value) => ["matrix", "relations"].includes(value),
        },
        focusLevel: { type: String, default: "" },
        loading: { type: Boolean, default: false },
    },
    mixins: [mixins],
    data() {
        return {
            version: this.initialVersion,
            selectedSystemName: this.system.name || "",
            view: this.initialView,
            zoom: 0.78,
            fullscreen: false,
            dragging: false,
            pan: null,
            selectedModule: null,
            moduleDrawerVisible: false,
            moduleDetailResponse: null,
            moduleApiListResponse: null,
            serviceListResponse: null,
            moduleServiceOptions: [],
            moduleDetailLoading: false,
            moduleDetailRequestId: 0,
            moduleApiLoading: false,
            moduleApiRequestId: 0,
            moduleApiTotal: 0,
            interfaces: [],
            keyword: "",
            appliedKeyword: "",
            service: "",
            appliedService: "",
            page: 1,
            pageSize: 10,
            selectedInterface: null,
        };
    },
    computed: {
        systemOptions() {
            return this.systems.length
                ? this.systems.map((item) =>
                      typeof item === "string" ? item : item.name
                  )
                : [this.system.name].filter(Boolean);
        },
        versionOptions() {
            return this.versions.map((item) => {
                if (typeof item === "string") {
                    return { label: item, value: item };
                }
                const value =
                    item.sysVersionId || item.value || item.sysVersionNo || "";
                return {
                    label:
                        item.sysVersionNo ||
                        item.sysVersionName ||
                        item.label ||
                        value,
                    value,
                };
            });
        },
        hasCurrentDiagramData() {
            return this.view === "relations"
                ? this.relationLayout.nodes.length > 0
                : this.layers.length > 0;
        },
        relationLayout() {
            return this.buildRelationLayout(this.relationDiagram);
        },
    },
    mounted() {
        document.addEventListener("fullscreenchange", this.syncFullscreen);
    },
    beforeDestroy() {
        document.removeEventListener("fullscreenchange", this.syncFullscreen);
    },
    watch: {
        initialVersion(value) {
            this.version = value;
        },
        initialView(value) {
            this.view = value;
        },
        system: {
            deep: true,
            handler(value) {
                this.selectedSystemName = (value && value.name) || "";
            },
        },
    },
    methods: {
        parsePropsConfig(propsConfig) {
            if (!propsConfig) return {};
            if (typeof propsConfig === "object") return propsConfig;
            try {
                return JSON.parse(propsConfig) || {};
            } catch (error) {
                return {};
            }
        },
        getPortPoint(node, port) {
            const width = 170;
            const height = 60;
            const points = {
                left: { x: node.x, y: node.y + height / 2 },
                right: { x: node.x + width, y: node.y + height / 2 },
                top: { x: node.x + width / 2, y: node.y },
                bottom: { x: node.x + width / 2, y: node.y + height },
            };
            return points[port] || points.right;
        },
        getPortVector(port) {
            return (
                {
                    left: { x: -1, y: 0 },
                    right: { x: 1, y: 0 },
                    top: { x: 0, y: -1 },
                    bottom: { x: 0, y: 1 },
                }[port] || { x: 1, y: 0 }
            );
        },
        getRelationPath(source, target, edge) {
            const sourcePort = edge.sourcePort || "right";
            const targetPort = edge.targetPort || "left";
            const start = this.getPortPoint(source, sourcePort);
            const end = this.getPortPoint(target, targetPort);
            const sourceVector = this.getPortVector(sourcePort);
            const targetVector = this.getPortVector(targetPort);
            const offset = 28;
            const startOut = {
                x: start.x + sourceVector.x * offset,
                y: start.y + sourceVector.y * offset,
            };
            const endOut = {
                x: end.x + targetVector.x * offset,
                y: end.y + targetVector.y * offset,
            };
            const sourceHorizontal = sourceVector.x !== 0;
            const targetHorizontal = targetVector.x !== 0;
            const points = [start, startOut];

            if (sourceHorizontal && targetHorizontal) {
                if (startOut.y !== endOut.y) {
                    const middleX = (startOut.x + endOut.x) / 2;
                    points.push(
                        { x: middleX, y: startOut.y },
                        { x: middleX, y: endOut.y }
                    );
                }
            } else if (!sourceHorizontal && !targetHorizontal) {
                if (startOut.x !== endOut.x) {
                    const middleY = (startOut.y + endOut.y) / 2;
                    points.push(
                        { x: startOut.x, y: middleY },
                        { x: endOut.x, y: middleY }
                    );
                }
            } else if (sourceHorizontal) {
                points.push({ x: endOut.x, y: startOut.y });
            } else {
                points.push({ x: startOut.x, y: endOut.y });
            }

            points.push(endOut, end);
            const segments = points.slice(1).map((point, index) => {
                const previous = points[index];
                return {
                    start: previous,
                    end: point,
                    length:
                        Math.abs(point.x - previous.x) +
                        Math.abs(point.y - previous.y),
                };
            });
            const labelSegment = segments.reduce(
                (longest, segment) =>
                    segment.length > longest.length ? segment : longest,
                segments[0]
            );
            const labelX =
                (labelSegment.start.x + labelSegment.end.x) / 2;
            const labelY =
                (labelSegment.start.y + labelSegment.end.y) / 2;
            return {
                path: points
                    .map((point, index) =>
                        `${index ? "L" : "M"}${point.x} ${point.y}`
                    )
                    .join(" "),
                labelX,
                labelY,
            };
        },
        getTargetPosition(source, edge) {
            const sourcePort = edge.sourcePort || "right";
            const targetPort = edge.targetPort || "left";
            let x = source.x;
            let y = source.y;
            if (sourcePort === "right") x += 350;
            else if (sourcePort === "left") x -= 350;
            else if (sourcePort === "bottom") {
                y += 210;
                if (targetPort === "right") x -= 350;
                else if (targetPort === "left") x += 350;
            } else if (sourcePort === "top") {
                y -= 210;
                if (targetPort === "right") x -= 350;
                else if (targetPort === "left") x += 350;
            }
            return {
                x: Math.max(30, Math.min(920, x)),
                y: Math.max(32, Math.min(330, y)),
            };
        },
        buildRelationLayout(response = {}) {
            const result = (response && response.body) || response || {};
            const rawNodes = Array.isArray(result.nodes)
                ? result.nodes.filter(
                      (node) => String(node.fnClass) === "06"
                  )
                : [];
            const rawEdges = Array.isArray(result.edges) ? result.edges : [];
            const layerMap = new Map(
                (Array.isArray(result.layers) ? result.layers : []).map(
                    (layer) => [layer.fnId, layer.fnName || layer.fnDesc || ""]
                )
            );
            const incomingIds = new Set(rawEdges.map((edge) => edge.tgtFnId));
            const positionMap = new Map();
            const roots = rawNodes.filter((node) => !incomingIds.has(node.fnId));
            const firstNodes = roots.length ? roots : rawNodes.slice(0, 1);
            firstNodes.forEach((node, index) => {
                positionMap.set(node.fnId, { x: 185, y: 80 + index * 100 });
            });

            for (let pass = 0; pass < rawNodes.length; pass += 1) {
                let changed = false;
                rawEdges.forEach((edge) => {
                    const source = positionMap.get(edge.curFnId);
                    if (source && !positionMap.has(edge.tgtFnId)) {
                        positionMap.set(
                            edge.tgtFnId,
                            this.getTargetPosition(source, edge)
                        );
                        changed = true;
                    }
                });
                if (!changed) break;
            }

            rawNodes.forEach((node, index) => {
                if (!positionMap.has(node.fnId)) {
                    positionMap.set(node.fnId, {
                        x: 185 + (index % 3) * 350,
                        y: 80 + Math.floor(index / 3) * 210,
                    });
                }
            });

            const nodes = rawNodes.map((node) => ({
                id: node.fnId,
                name: node.fnDesc || node.fnName || "",
                layerName: layerMap.get(node.parentNodeId) || "",
                raw: node,
                ...positionMap.get(node.fnId),
            }));
            const nodeMap = new Map(nodes.map((node) => [node.id, node]));
            const edges = rawEdges
                .filter(
                    (edge) =>
                        nodeMap.has(edge.curFnId) &&
                        nodeMap.has(edge.tgtFnId)
                )
                .map((edge, index) => {
                    const source = nodeMap.get(edge.curFnId);
                    const target = nodeMap.get(edge.tgtFnId);
                    const sourceConfig = this.parsePropsConfig(
                        source.raw.propsConfig
                    );
                    const route = this.getRelationPath(source, target, edge);
                    return {
                        id: edge.fnrId || `${edge.curFnId}-${edge.tgtFnId}-${index}`,
                        name: edge.fnrName || "",
                        desc: edge.fnrDesc || "",
                        dashed:
                            String(sourceConfig.LineType || "").toLowerCase() ===
                            "dashed",
                        ...route,
                    };
                });
            return { nodes, edges };
        },
        changeView(view) {
            if (this.view === view) return;
            this.view = view;
            this.$emit("view-change", view);
        },
        getAppModeDetail(params = {}) {
            return this.rpc.assetcenter.getAppModeDetail(params);
        },
        getAppModeApiList(params = {}) {
            return this.rpc.assetcenter.getAppModeApiList(params);
        },
        getServiceList(params = {}) {
            return this.rpc.assetcenter.getServiceList(params);
        },
        getModuleResponseResult(response) {
            return (response && response.body) || response || {};
        },
        normalizeServiceOptions(response) {
            const result = this.getModuleResponseResult(response);
            const groups = Array.isArray(result)
                ? result
                : result.apiGroups ||
                  result.serviceList ||
                  result.list ||
                  result.serviceGroups ||
                  result.groupList ||
                  [];
            return groups
                .map((group) => ({
                    label:
                        group.groupName ||
                        group.serviceGroupName ||
                        group.name ||
                        "",
                    value: String(
                        group.groupId ||
                            group.serviceGroupId ||
                            group.id ||
                            ""
                    ),
                    code: group.groupCode || group.serviceGroupCode || "",
                    raw: group,
                }))
                .filter((item) => item.value);
        },
        normalizeModuleApiInterfaces(response) {
            const result = this.getModuleResponseResult(response);
            let apis = [];
            if (Array.isArray(result.apiList)) {
                apis = result.apiList;
            } else if (Array.isArray(result.list)) {
                apis = result.list;
            } else if (Array.isArray(result.records)) {
                apis = result.records;
            } else if (Array.isArray(result.rows)) {
                apis = result.rows;
            } else if (Array.isArray(result.apiGroups)) {
                apis = result.apiGroups.reduce((rows, group) => {
                    const groupApis = Array.isArray(group.apis)
                        ? group.apis
                        : [];
                    return rows.concat(
                        groupApis.map((api) => ({
                            ...api,
                            groupId: api.groupId || group.groupId || "",
                            groupName: group.groupName || "",
                            groupCode: group.groupCode || "",
                        }))
                    );
                }, []);
            }

            const serviceNameMap = new Map(
                this.moduleServiceOptions.map((item) => [
                    String(item.value),
                    item.label,
                ])
            );
            return apis.map((api) => {
                const groupId = String(
                    api.groupId || api.serviceGroupId || ""
                );
                return {
                    name: api.apiName || api.name || "/",
                    code: api.apiCode || api.code || "/",
                    service:
                        api.groupName ||
                        api.serviceGroupName ||
                        serviceNameMap.get(groupId) ||
                        "/",
                    source: "",
                    apiId: api.apiId || api.id || "",
                    controlPointId:
                        api.controlPointId || api.apiId || api.id || "",
                    apiType: api.apiType || "",
                    apiVersion: api.apiVersion || "",
                    groupId,
                    groupCode:
                        api.groupCode || api.serviceGroupCode || "",
                    raw: api,
                };
            });
        },
        async loadModuleBasicDetail(modId, requestId) {
            try {
                const response = await this.getAppModeDetail({ modId });
                if (
                    requestId !== this.moduleDetailRequestId ||
                    !this.selectedModule
                ) {
                    return;
                }
                const detail =
                    response && response.body ? response.body : response || {};
                this.moduleDetailResponse = response;
                this.selectedModule = {
                    ...this.selectedModule,
                    id: detail.nodeId || "",
                    name: detail.nodeName || "",
                    description: detail.description || "",
                    appId: detail.appId || "",
                    appName: detail.appName || "",
                    layerCode: detail.layerCode || "",
                    parentId: detail.parentId || "",
                };
            } catch (error) {
                if (requestId === this.moduleDetailRequestId) {
                    this.moduleDetailResponse = null;
                }
            } finally {
                if (requestId === this.moduleDetailRequestId) {
                    this.moduleDetailLoading = false;
                }
            }
        },
        async loadModuleServices(modId, requestId) {
            try {
                const response = await this.getServiceList({ modId });
                if (requestId !== this.moduleDetailRequestId) return;
                this.serviceListResponse = response;
                this.moduleServiceOptions =
                    this.normalizeServiceOptions(response);
                return response;
            } catch (error) {
                if (requestId === this.moduleDetailRequestId) {
                    this.serviceListResponse = null;
                    this.moduleServiceOptions = [];
                }
                return null;
            }
        },
        async loadModuleApiList(modId, requestId) {
            const apiRequestId = ++this.moduleApiRequestId;
            this.moduleApiLoading = true;
            try {
                const response = await this.getAppModeApiList({
                    keyword: this.appliedKeyword,
                    modId,
                    pageNum: this.page,
                    pageSize: this.pageSize,
                    serviceGroupId: this.appliedService,
                });
                if (
                    requestId === this.moduleDetailRequestId &&
                    apiRequestId === this.moduleApiRequestId
                ) {
                    const result = this.getModuleResponseResult(response);
                    this.moduleApiListResponse = response;
                    this.interfaces =
                        this.normalizeModuleApiInterfaces(response);
                    this.moduleApiTotal = Number(
                        result.turnPageTotalNum !== undefined
                            ? result.turnPageTotalNum
                            : result.total !== undefined
                            ? result.total
                            : result.totalCount !== undefined
                            ? result.totalCount
                            : this.interfaces.length
                    );
                }
                return response;
            } catch (error) {
                if (
                    requestId === this.moduleDetailRequestId &&
                    apiRequestId === this.moduleApiRequestId
                ) {
                    this.moduleApiListResponse = null;
                    this.interfaces = [];
                    this.moduleApiTotal = 0;
                }
                return null;
            } finally {
                if (apiRequestId === this.moduleApiRequestId) {
                    this.moduleApiLoading = false;
                }
            }
        },
        queryModuleApiList() {
            if (!this.selectedModule) return null;
            return this.loadModuleApiList(
                this.selectedModule.id,
                this.moduleDetailRequestId
            );
        },
        openModule(module, app) {
            const moduleNode = module[3] || {};
            const modId = moduleNode.fnId || "";
            const requestId = ++this.moduleDetailRequestId;
            this.selectedModule = {
                id: modId,
                name: module[0],
                description: "",
                appId: "",
                appName: "",
                contextAppName: app.name,
                layerCode: "",
                parentId: "",
            };
            this.moduleDrawerVisible = true;
            this.moduleDetailResponse = null;
            this.moduleApiListResponse = null;
            this.serviceListResponse = null;
            this.moduleServiceOptions = [];
            this.interfaces = [];
            this.moduleApiTotal = 0;
            this.clearFilters();
            this.moduleDetailLoading = true;
            this.loadModuleBasicDetail(modId, requestId);
            this.loadModuleServices(modId, requestId).then(() => {
                if (requestId === this.moduleDetailRequestId) {
                    this.loadModuleApiList(modId, requestId);
                }
            });
        },
        closeModule() {
            this.moduleDrawerVisible = false;
        },
        handleModuleDrawerClosed() {
            this.moduleDetailRequestId += 1;
            this.moduleApiRequestId += 1;
            this.moduleDetailLoading = false;
            this.moduleApiLoading = false;
            this.selectedModule = null;
            this.selectedInterface = null;
            this.moduleServiceOptions = [];
            this.interfaces = [];
            this.moduleApiTotal = 0;
        },
        applyFilters() {
            this.appliedKeyword = this.keyword;
            this.appliedService = this.service;
            this.page = 1;
            this.selectedInterface = null;
            this.queryModuleApiList();
        },
        resetFilters() {
            this.clearFilters();
            this.queryModuleApiList();
        },
        clearFilters() {
            this.keyword = "";
            this.appliedKeyword = "";
            this.service = "";
            this.appliedService = "";
            this.page = 1;
            this.selectedInterface = null;
        },
        onPageSizeChange(size) {
            this.pageSize = size;
            this.page = 1;
            this.queryModuleApiList();
        },
        onPageChange(page) {
            this.page = page;
            this.queryModuleApiList();
        },
        viewInterface(row) {
            this.selectedInterface = row;
            const controlPointId =
                row.controlPointId || row.apiId || row.raw?.controlPointId || "";
            if (!controlPointId) {
                this.$message.warning("当前接口缺少接口详情标识");
                return;
            }

            const params = new URLSearchParams({
                controlPointId,
                apiId: row.apiId || "",
                apiName: row.name === "/" ? "" : row.name || "",
                apiCode: row.code === "/" ? "" : row.code || "",
                apiVersion: row.apiVersion || "",
            });
            window.open(
                `/h5-pc-terminal-web/aop_businessmold/#/assetLibrary/interfaceDetail?${params.toString()}`,
                "_blank"
            );
        },
        changeZoom(delta) {
            this.zoom = Math.max(
                0.45,
                Math.min(1.6, Number((this.zoom + delta).toFixed(2)))
            );
        },
        onWheel(event) {
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                this.changeZoom(event.deltaY < 0 ? 0.1 : -0.1);
            }
        },
        startPan(event) {
            if (
                event.button !== 0 ||
                event.target.closest("button,input,select")
            )
                return;
            const canvas = this.$refs.canvas;
            this.dragging = true;
            this.pan = {
                x: event.clientX,
                y: event.clientY,
                left: canvas.scrollLeft,
                top: canvas.scrollTop,
            };
        },
        movePan(event) {
            if (!this.pan) return;
            const canvas = this.$refs.canvas;
            canvas.scrollLeft = this.pan.left - (event.clientX - this.pan.x);
            canvas.scrollTop = this.pan.top - (event.clientY - this.pan.y);
        },
        endPan() {
            this.dragging = false;
            this.pan = null;
        },
        reset() {
            this.zoom = 0.78;
            if (this.$refs.canvas) {
                this.$refs.canvas.scrollLeft = 0;
                this.$refs.canvas.scrollTop = 0;
            }
        },
        toggleFullscreen() {
            if (document.fullscreenElement) document.exitFullscreen();
            else if (this.$refs.shell.requestFullscreen)
                this.$refs.shell.requestFullscreen();
        },
        syncFullscreen() {
            this.fullscreen = document.fullscreenElement === this.$refs.shell;
        },
    },
};
</script>

<style scoped>
.application-diagram {
    position: relative;
    overflow: hidden;
    height: calc(100vh - 230px);
    min-height: 560px;
    border: 1px solid #e3e9f2;
    background: #fff;
}
.application-diagram:fullscreen {
    height: 100vh;
}
.application-diagram--standalone {
    height: 100%;
    min-height: 0;
    border: 0;
}
.application-diagram__toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    height: 58px;
    padding: 0 18px;
    border-bottom: 1px solid #e2e8f0;
    box-sizing: border-box;
    background: #fff;
}
.application-diagram__title {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #172033;
    font-size: 16px;
    font-weight: 700;
}
.application-diagram--standalone .application-diagram__tools {
    margin-left: auto;
}
.application-diagram__filters {
    display: flex;
    height: 74px;
    align-items: center;
    gap: 14px;
    padding: 0 24px;
    box-sizing: border-box;
    border-bottom: 1px solid #e2e8f0;
    background: #fff;
    color: #1f2b3d;
}
.application-diagram__filters .system-select {
    width: 200px;
}
.application-diagram__filters .view-switch {
    margin-left: auto;
    background: #f1f3f7;
}
.application-diagram__filters .view-switch button {
    height: 42px;
    border: 0;
    background: transparent;
}
.application-diagram__filters .view-switch button.active {
    border-radius: 7px;
    background: #fff;
    color: #2f63dc;
    box-shadow: 0 2px 8px rgba(38, 61, 97, 0.12);
}
.version-select {
    width: 112px;
}
.application-diagram__legend {
    display: flex;
    gap: 14px;
    color: #66758a;
}
.application-diagram__legend span {
    display: flex;
    align-items: center;
    gap: 6px;
}
.application-diagram__legend i {
    width: 10px;
    height: 10px;
    border-radius: 3px;
}
.legend-app {
    background: #eef1f5;
}
.legend-module {
    background: #dce7f7;
}
.view-switch {
    display: flex;
    margin-left: auto;
    overflow: hidden;
    border: 1px solid #d7dfe9;
    border-radius: 6px;
}
.view-switch button {
    height: 32px;
    padding: 0 13px;
    border: 0;
    border-right: 1px solid #d7dfe9;
    background: #fff;
    color: #66758a;
    cursor: pointer;
}
.view-switch button:last-child {
    border-right: 0;
}
.view-switch button.active {
    background: #2f63dc;
    color: #fff;
}
.application-diagram__tools {
    display: flex;
    align-items: center;
    gap: 8px;
}
.application-diagram__tools button,
.application-diagram__tools span {
    display: grid;
    place-items: center;
    min-width: 38px;
    height: 36px;
    padding: 0 8px;
    border: 1px solid #dce3ed;
    border-radius: 7px;
    box-sizing: border-box;
    background: #fff;
    color: #5e6b7d;
}
.application-diagram__tools button {
    cursor: pointer;
}
.application-diagram__tools button:hover {
    border-color: #2f63dc;
    color: #2f63dc;
}
.application-diagram__canvas {
    overflow: auto;
    height: calc(100% - 58px);
    padding: 28px;
    box-sizing: border-box;
    background-color: #f8fbff;
    background-image: radial-gradient(#dce6f3 1px, transparent 1px);
    background-size: 20px 20px;
    cursor: grab;
}
.application-diagram--standalone .application-diagram__canvas {
    height: calc(100% - 132px);
    padding: 22px 0 30px;
}
.application-diagram--standalone .application-diagram__stage {
    width: 1240px;
}
.application-diagram__canvas.dragging {
    cursor: grabbing;
    user-select: none;
}
.application-diagram__canvas.is-empty {
    overflow: hidden;
    padding: 0;
    cursor: default;
}
.application-diagram__canvas.is-empty .application-diagram__stage {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100%;
}
.application-diagram__stage {
    width: 1200px;
    min-height: 650px;
    margin: 0 auto;
    transform-origin: top center;
    transition: transform 0.15s;
}
.application-diagram__panel {
    border: 1px solid transparent;
    border-radius: 12px;
    transition: border-color 0.16s, box-shadow 0.16s;
}
.application-diagram__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
}
.application-diagram--standalone .is-focus {
    border-color: #2f63db !important;
    box-shadow: 0 0 0 3px rgba(47, 99, 219, 0.22) !important;
}
.architecture-matrix {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.diagram-empty {
    display: grid;
    min-height: 320px;
    place-items: center;
    border: 1px dashed #d5dfed;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.84);
    color: #8a96a7;
    font-size: 14px;
}
.relation-board > .diagram-empty {
    height: 100%;
    min-height: 0;
    border: 0;
}
.architecture-layer {
    display: grid;
    grid-template-columns: 108px 1fr;
    overflow: hidden;
    min-height: 188px;
    border: 1px solid #d5dfed;
    border-radius: 14px 0 0 14px;
    background: rgba(255, 255, 255, 0.9);
}
.architecture-layer__label {
    display: grid;
    place-items: center;
    padding: 15px;
    border-right: 0;
    background: linear-gradient(155deg, #5536c8, #3965d7);
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: 4px;
    text-align: center;
    text-orientation: upright;
    writing-mode: vertical-rl;
}
.architecture-layer__apps {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
    gap: 14px;
    padding: 22px;
}
.application-card {
    overflow: hidden;
    border: 1px solid #d7e0ec;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 6px rgba(43, 62, 88, 0.04);
}
.application-card header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    border-bottom: 1px solid #e6ebf2;
    color: #263750;
    font-weight: 700;
}
.application-card header span {
    padding: 2px 8px;
    border-radius: 10px;
    background: #edf3fc;
    color: #6680a2;
    font-size: 12px;
    font-weight: 400;
}
.application-card__modules {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    padding: 14px;
}
.application-card__modules button {
    min-width: 112px;
    padding: 9px 12px;
    border: 1px solid #cbd9ed;
    border-radius: 6px;
    background: #f5f8fc;
    color: #456183;
    cursor: pointer;
}
.application-card__modules button:hover {
    border-color: #6f9ee2;
    background: #ebf3ff;
    color: #2f63dc;
}
.application-card__empty {
    display: grid;
    min-height: 72px;
    place-items: center;
    color: #98a2b3;
    font-size: 13px;
}
.relation-board {
    position: relative;
    height: 430px;
    overflow: hidden;
    border: 0;
    background: transparent;
}
.relation-board svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
.relation-board svg > g > path {
    fill: none;
    stroke: #7d91ad;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
}
.relation-board svg > g > path.backup {
    stroke-dasharray: 8 6;
}
.relation-board text {
    fill: #61758f;
    font-size: 13px;
    font-weight: 400;
    paint-order: stroke;
    stroke: #f8fbff;
    stroke-linejoin: round;
    stroke-width: 5px;
}
.relation-chain {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding: 40px;
    box-sizing: border-box;
}
.relation-chain__item {
    display: flex;
    align-items: center;
}
.relation-chain .relation-node {
    position: static;
    width: 190px;
    height: 82px;
    background: #eef5ff;
    color: #2959af;
}
.relation-connector {
    position: relative;
    display: flex;
    width: 170px;
    height: 74px;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    color: #52647c;
    font-size: 13px;
}
.relation-connector::before {
    position: absolute;
    top: 40px;
    right: 8px;
    left: 8px;
    height: 2px;
    background: #8090a5;
    content: "";
}
.relation-connector::after {
    position: absolute;
    top: 35px;
    right: 3px;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 9px solid #8090a5;
    content: "";
}
.relation-connector span,
.relation-connector small {
    position: relative;
    z-index: 1;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.relation-connector small {
    color: #8a96a7;
    font-size: 11px;
}
.relation-node {
    position: absolute;
    display: flex;
    width: 170px;
    height: 60px;
    padding: 8px 12px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    border: 1px solid #bcd2ef;
    border-radius: 8px;
    box-sizing: border-box;
    background: #eef5ff;
    color: #24569a;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    box-shadow: 0 2px 7px rgba(45, 75, 113, 0.05);
}
.relation-node small {
    display: block;
    padding: 0;
    background: transparent;
    color: #24569a;
    font-size: 13px;
    font-weight: 700;
}
.node-1 {
    left: 95px;
    top: 75px;
}
.node-2 {
    left: 435px;
    top: 75px;
}
.node-3 {
    left: 785px;
    top: 75px;
}
.node-4 {
    left: 435px;
    top: 285px;
}
.node-5 {
    left: 95px;
    top: 285px;
}
.module-drawer__body {
    padding: 20px;
}
.module-drawer__body h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 6px 0 12px;
    font-size: 15px;
}
.module-drawer__body h3::before {
    width: 4px;
    height: 16px;
    border-radius: 2px;
    background: #3981ef;
    content: "";
}
.module-info {
    display: grid;
    grid-template-columns: 120px 1fr;
    margin-bottom: 22px;
    border: 1px solid #e3e9f1;
    border-radius: 7px;
}
.module-info span,
.module-info b {
    padding: 11px 13px;
    border-bottom: 1px solid #edf1f5;
}
.module-info span {
    background: #f7f9fc;
    color: #78869a;
}
.module-info b {
    font-weight: 400;
}
.module-info .module-info__hierarchy {
    font-weight: 700;
}
.module-info span:nth-last-child(-n + 2),
.module-info b:nth-last-child(-n + 2) {
    border-bottom: 0;
}
.module-filter {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}
.module-filter .el-input {
    width: 210px;
}
.module-filter .el-select {
    width: 150px;
}
.module-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 14px;
    color: #7b8798;
}
.interface-preview {
    margin-top: 12px;
    padding: 12px 14px;
    border: 1px solid #d9e5f5;
    border-radius: 7px;
    background: #f5f9ff;
    color: #536a89;
    line-height: 1.8;
}
.module-drawer__body ::v-deep .module-table.el-table {
    overflow: hidden;
    border-color: #e1e7ef;
    border-radius: 8px;
    color: #3f4d61;
    font-size: 14px;
}
.module-drawer__body ::v-deep .module-table.el-table::before,
.module-drawer__body ::v-deep .module-table.el-table--border::after {
    background-color: #e1e7ef;
}
.module-drawer__body ::v-deep .module-table.el-table th {
    height: 48px;
    padding: 0;
    border-color: #e1e7ef;
    background: #f7f9fc;
    color: #536077;
    font-weight: 600;
}
.module-drawer__body ::v-deep .module-table.el-table td {
    height: 48px;
    padding: 0;
    border-color: #e7ecf3;
    background: #fff;
}
.module-drawer__body ::v-deep .module-table.el-table th > .cell,
.module-drawer__body ::v-deep .module-table.el-table td > .cell {
    padding: 0 14px;
    line-height: 22px;
}
.module-drawer__body ::v-deep .module-table.el-table .el-table__body tr:hover > td {
    background: #f6f9fe;
}
.module-drawer__body ::v-deep .module-table.el-table .el-button--text {
    padding: 5px 0;
    color: #2f6bdb;
}
.module-drawer__body ::v-deep .module-pagination .el-pagination {
    display: flex;
    align-items: center;
    padding: 0;
}
.module-drawer__body ::v-deep .module-pagination .el-pagination__total {
    margin-right: 14px;
    color: #7b8798;
}
.module-drawer__body ::v-deep .module-pagination .el-pagination__sizes {
    margin-right: 10px;
}
.module-drawer__body ::v-deep .module-pagination .btn-prev,
.module-drawer__body ::v-deep .module-pagination .btn-next,
.module-drawer__body ::v-deep .module-pagination .el-pager li {
    min-width: 32px;
    height: 32px;
    margin: 0 3px;
    border: 1px solid #dce3ed;
    border-radius: 6px;
    background: #fff;
    color: #607086;
    line-height: 30px;
}
.module-drawer__body ::v-deep .module-pagination .el-pager li.active {
    border-color: #2f63dc;
    background: #2f63dc;
    color: #fff;
}
@media (max-width: 1100px) {
    .application-diagram__legend {
        display: none;
    }
    .architecture-layer__apps {
        grid-template-columns: 1fr;
    }
}
</style>

<style>
.application-module-detail-drawer .el-drawer {
    max-width: calc(100vw - 40px);
}

.application-module-detail-drawer .el-drawer__header {
    padding: 18px 20px;
    margin-bottom: 0;
    border-bottom: 1px solid #e2e8f0;
    color: #252b35;
    font-size: 18px;
    font-weight: 600;
}

.application-module-detail-drawer .el-drawer__body {
    overflow: auto;
}
</style>
