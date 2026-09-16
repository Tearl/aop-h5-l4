<template>
    <div class="product-model">
        <div class="product-model__sidebar">
            <div class="product-model__sidebar-header">
                <div class="product-model__brand">
                    <div class="product-model__brand-icon">品</div>
                    <div class="product-model__brand-title">产品模型</div>
                    <div class="product-model__brand-en">Product Model</div>
                </div>
            </div>
            <div class="product-model__sidebar-tree">
                <template v-for="(level, index) in levels">
                    <div
                        :key="level.key"
                        :class="[
                            'product-model__sidebar-node',
                            { active: selectedLevel === level.key },
                        ]"
                        @click="selectLevel(level.key)"
                    >
                        <span
                            class="product-model__sidebar-dot"
                            :style="{ background: level.color }"
                        />
                        <span>{{ level.label }}</span>
                    </div>
                    <div
                        v-if="index < levels.length - 1"
                        :key="`${level.key}-connector`"
                        class="product-model__sidebar-connector"
                    />
                </template>
            </div>
        </div>

        <div class="product-model__main">
            <div class="product-model__toolbar">
                <div class="product-model__toolbar-heading">
                    <span class="product-model__toolbar-title">产品模型图</span>
                </div>

                <div class="product-model__toolbar-actions">
                    <div class="product-model__expand-control">
                        <span>展开至</span>
                        <el-select
                            v-model="expandToLevel"
                            class="product-model__expand-select"
                            size="mini"
                            placeholder="请选择层级"
                            @change="expandTreeToLevel"
                        >
                            <el-option
                                v-for="level in levels"
                                :key="level.key"
                                :label="level.label"
                                :value="level.key"
                            />
                        </el-select>
                    </div>
                    <el-button
                        class="product-model__expand-toggle"
                        size="mini"
                        @click="toggleAllNodes"
                    >
                        <i
                            :class="
                                allNodesExpanded
                                    ? 'el-icon-folder-remove'
                                    : 'el-icon-folder-add'
                            "
                        />
                        {{ allNodesExpanded ? "一键收起" : "一键展开" }}
                    </el-button>
                    <el-input
                        v-model="searchKeyword"
                        class="product-model__search"
                        size="mini"
                        clearable
                        placeholder="查找节点..."
                    />
                    <el-button
                        class="product-model__toolbar-button"
                        size="mini"
                        title="缩小"
                        @click="zoomBy(-0.1)"
                    >
                        −
                    </el-button>
                    <div class="product-model__zoom-display">
                        {{ zoomPercent }}%
                    </div>
                    <el-button
                        class="product-model__toolbar-button"
                        size="mini"
                        title="放大"
                        @click="zoomBy(0.1)"
                    >
                        +
                    </el-button>
                    <el-button
                        class="product-model__toolbar-button"
                        size="mini"
                        title="重置视图"
                        @click="resetView"
                    >
                        <img
                            :src="require('@m/assets/images/refresh-reset.svg')"
                            width="16"
                            height="16"
                            alt=""
                            draggable="false"
                        >
                    </el-button>
                    <el-button
                        class="product-model__toolbar-button"
                        size="mini"
                        title="全屏"
                        @click="toggleFullscreen"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                        </svg>
                    </el-button>
                </div>
            </div>

            <div
                ref="canvasWrap"
                v-loading="modelLoading"
                :class="['product-model__canvas-wrap', { dragging }]"
                element-loading-text="产品模型加载中"
                @mousedown="startDrag"
                @mousemove="dragCanvas"
                @mouseup="stopDrag"
                @mouseleave="stopDrag"
                @wheel.prevent="handleWheel"
            >
                <el-empty
                    v-if="!modelLoading && !modelData.length"
                    description="暂无产品模型数据"
                />
                <div
                    v-else-if="modelData.length"
                    class="product-model__canvas"
                    :style="canvasStyle"
                >
                    <svg
                        class="product-model__edges"
                        :width="treeLayout.width"
                        :height="treeLayout.height"
                        :viewBox="`0 0 ${treeLayout.width} ${treeLayout.height}`"
                    >
                        <path
                            v-for="edge in treeLayout.edges"
                            :key="edge.id"
                            :d="edge.path"
                        />
                    </svg>

                    <div class="product-model__tree">
                        <div
                            v-for="node in treeLayout.nodes"
                            :key="node.id"
                            :class="[
                                'product-model__node',
                                node.levelClass,
                                {
                                    highlight:
                                        selectedNodeId === node.id ||
                                        selectedLevel === node.type,
                                    'search-dim': !nodeMatchesSearch(node),
                                },
                            ]"
                            :style="getNodeStyle(node)"
                            @click="selectNode(node.id)"
                        >
                            <div class="product-model__node-body">
                                {{ node.name }}
                            </div>
                            <button
                                v-if="node.hasChildren"
                                :class="[
                                    'product-model__node-toggle',
                                    { expanded: node.expanded },
                                ]"
                                type="button"
                                :title="node.expanded ? '收起' : '展开'"
                                @click.stop="toggleNode(node.id)"
                            />
                        </div>
                    </div>
                </div>

                <div v-if="modelData.length" class="product-model__zoom-hint">
                    鼠标滚轮缩放 · 拖拽平移
                </div>
                <button
                    class="product-model__fullscreen-exit"
                    type="button"
                    @click.stop="toggleFullscreen"
                >
                    退出全屏
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import mixins from "@m/core/mixin";
import { PRODUCT_LEVELS, PRODUCT_MODEL_DATA } from "./data";

const HORIZONTAL_GAP = 180;
const VERTICAL_GAP = 6;
const NODE_HEIGHT = 34;
const TOGGLE_WIDTH = 20;

const TYPE_LEVEL_MAP = {
    root: 0,
    "product-line": 1,
    "product-main": 2,
    "product-catalog": 3,
    "basic-product": 4,
    "sellable-product": 5,
    "product-component": 6,
};

const API_TYPE_MAP = {
    line: "product-line",
    group: "product-main",
    catalog: "product-catalog",
    baseProduct: "basic-product",
    saleProduct: "sellable-product",
    component: "product-component",
};

const API_LEVEL_TYPE_MAP = {
    1: "product-line",
    2: "product-main",
    3: "product-catalog",
    4: "basic-product",
    5: "sellable-product",
    6: "product-component",
};

function normalizeProductNode(node = {}) {
    return {
        ...node,
        name: node.nodeName || node.name || "未命名节点",
        type:
            API_TYPE_MAP[node.nodeType] ||
            API_LEVEL_TYPE_MAP[node.level] ||
            node.type ||
            "product-component",
        children: Array.isArray(node.children)
            ? node.children.map(normalizeProductNode)
            : [],
    };
}

function createExpandedNodesToLevel(modelData = [], targetLevel = 0) {
    const expandedNodes = {};
    const visit = (node, path) => {
        const children = Array.isArray(node.children) ? node.children : [];
        if (!children.length) return;

        const level = TYPE_LEVEL_MAP[node.type] || 0;
        expandedNodes[path] = level < targetLevel;
        children.forEach((child, index) => {
            visit(child, `${path}-${index}`);
        });
    };

    visit(
        {
            type: "root",
            children: modelData,
        },
        "0"
    );
    return expandedNodes;
}

export default {
    name: "ProductModel",
    mixins: [mixins],
    data() {
        return {
            levels: PRODUCT_LEVELS,
            modelData: [],
            modelLoading: false,
            searchKeyword: "",
            selectedLevel: PRODUCT_LEVELS[0].key,
            selectedNodeId: "",
            expandToLevel: "product-main",
            expandedNodes: {},
            zoom: 1,
            panX: 40,
            panY: 40,
            dragging: false,
            dragStartX: 0,
            dragStartY: 0,
            panStartX: 0,
            panStartY: 0,
        };
    },
    computed: {
        zoomPercent() {
            return Math.round(this.zoom * 100);
        },
        canvasStyle() {
            return {
                width: `${this.treeLayout.width}px`,
                height: `${this.treeLayout.height}px`,
                transform: `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`,
            };
        },
        allNodesExpanded() {
            if (!this.modelData.length) return false;

            const isExpanded = (node, path) => {
                const children = Array.isArray(node.children)
                    ? node.children
                    : [];
                if (!children.length) return true;
                if (this.expandedNodes[path] === false) return false;
                return children.every((child, index) =>
                    isExpanded(child, `${path}-${index}`)
                );
            };

            return isExpanded(
                { type: "root", children: this.modelData },
                "0"
            );
        },
        treeLayout() {
            const rootNode = {
                name: "产品模型",
                type: "root",
                children: this.modelData,
            };
            const nodes = [];
            const rawEdges = [];

            const isExpanded = (path) => this.expandedNodes[path] !== false;

            const getSubtreeHeight = (node, path) => {
                const hasVisibleChildren =
                    node.children && node.children.length && isExpanded(path);
                if (!hasVisibleChildren) return NODE_HEIGHT;

                return Math.max(
                    NODE_HEIGHT,
                    node.children.reduce((height, child, index) => {
                        const gap = index ? VERTICAL_GAP : 0;
                        return (
                            height +
                            gap +
                            getSubtreeHeight(child, `${path}-${index}`)
                        );
                    }, 0)
                );
            };

            const getTextWidth = (text) =>
                Array.from(String(text || "")).reduce(
                    (width, char) =>
                        width + (char.charCodeAt(0) > 127 ? 14 : 8),
                    0
                );

            const layoutNode = (node, x, centerY, path) => {
                const level = TYPE_LEVEL_MAP[node.type] || 0;
                const expanded = isExpanded(path);
                const hasChildren = Boolean(
                    node.children && node.children.length
                );
                const bodyWidth = getTextWidth(node.name) + 28;
                const nodeWidth = bodyWidth + (hasChildren ? TOGGLE_WIDTH : 0);
                const nodeHeight = level === 0 ? 44 : NODE_HEIGHT;
                const nodeY = centerY - nodeHeight / 2;

                nodes.push({
                    id: path,
                    name: node.name,
                    type: node.type,
                    levelClass: `level-${level}`,
                    x,
                    y: nodeY,
                    width: nodeWidth,
                    height: nodeHeight,
                    bodyWidth,
                    hasChildren,
                    expanded,
                });

                if (!hasChildren || !expanded) return;

                const childX = x + nodeWidth + HORIZONTAL_GAP;
                const totalHeight = node.children.reduce(
                    (height, child, index) => {
                        const gap = index ? VERTICAL_GAP : 0;
                        return (
                            height +
                            gap +
                            getSubtreeHeight(child, `${path}-${index}`)
                        );
                    },
                    0
                );
                let currentY = centerY - totalHeight / 2;

                node.children.forEach((child, index) => {
                    if (index) currentY += VERTICAL_GAP;
                    const childPath = `${path}-${index}`;
                    const childHeight = getSubtreeHeight(child, childPath);
                    const childCenterY = currentY + childHeight / 2;

                    rawEdges.push({
                        id: `${path}-${childPath}`,
                        x1: x + bodyWidth + 22,
                        y1: centerY,
                        x2: childX + 10,
                        y2: childCenterY,
                    });
                    layoutNode(child, childX, childCenterY, childPath);
                    currentY += childHeight;
                });
            };

            layoutNode(rootNode, 0, 0, "0");

            const bounds = nodes.reduce(
                (result, node) => ({
                    maxX: Math.max(result.maxX, node.x + 10 + node.width),
                    maxY: Math.max(result.maxY, node.y + node.height),
                    minY: Math.min(result.minY, node.y),
                }),
                { maxX: 0, maxY: -Infinity, minY: Infinity }
            );
            const offsetY = -bounds.minY + 40;
            const width = bounds.maxX + 80;
            const height = bounds.maxY - bounds.minY + 80;
            const edges = rawEdges.map((edge) => {
                const y1 = edge.y1 + offsetY;
                const y2 = edge.y2 + offsetY;
                const centerX = (edge.x1 + edge.x2) / 2;
                return {
                    id: edge.id,
                    path: `M${edge.x1},${y1} C${centerX},${y1} ${centerX},${y2} ${edge.x2},${y2}`,
                };
            });

            return {
                nodes,
                edges,
                width,
                height,
                offsetY,
            };
        },
    },
    created() {
        this.getProductModelTree();
    },
    methods: {
        async getProductModelTree(params = {}) {
            this.modelLoading = true;
            try {
                const response = await this.rpc.assetcenter.getProductModelTree(
                    params
                );
                const result =
                    response && response.body ? response.body : response;
                const children =
                    result && Array.isArray(result.children)
                        ? result.children
                        : [];
                this.modelData = children.map(normalizeProductNode);
                this.expandToLevel = "product-main";
                this.expandedNodes = createExpandedNodesToLevel(
                    this.modelData,
                    TYPE_LEVEL_MAP[this.expandToLevel]
                );
                this.selectedLevel = this.levels[0].key;
                this.selectedNodeId = "";
                this.$nextTick(() => this.resetView());
            } catch (error) {
                this.modelData = [];
            } finally {
                this.modelLoading = false;
            }
        },
        // 保留手动启用 Mock 的入口，但接口空数据或失败时不会自动回退。
        loadMockProductModel() {
            this.modelData = PRODUCT_MODEL_DATA;
            this.expandToLevel = "product-main";
            this.expandedNodes = createExpandedNodesToLevel(
                this.modelData,
                TYPE_LEVEL_MAP[this.expandToLevel]
            );
            this.selectedLevel = this.levels[0].key;
            this.selectedNodeId = "";
            this.$nextTick(() => this.resetView());
        },
        getNodeStyle(node) {
            return {
                left: `${node.x + 10}px`,
                top: `${node.y + this.treeLayout.offsetY}px`,
            };
        },
        nodeMatchesSearch(node) {
            const keyword = this.searchKeyword.trim();
            return !keyword || node.name.includes(keyword);
        },
        selectNode(nodeId) {
            this.selectedNodeId = nodeId;
        },
        toggleNode(nodeId) {
            this.$set(
                this.expandedNodes,
                nodeId,
                this.expandedNodes[nodeId] === false
            );
            this.expandToLevel = "";
        },
        expandTreeToLevel(level) {
            const targetLevel = TYPE_LEVEL_MAP[level];
            if (targetLevel === undefined) return;

            this.expandedNodes = createExpandedNodesToLevel(
                this.modelData,
                targetLevel
            );
            this.selectedNodeId = "";
            this.$nextTick(() => this.resetView());
        },
        toggleAllNodes() {
            const expandAll = !this.allNodesExpanded;
            this.expandedNodes = createExpandedNodesToLevel(
                this.modelData,
                expandAll ? Number.POSITIVE_INFINITY : 0
            );
            this.expandToLevel = expandAll
                ? this.levels[this.levels.length - 1].key
                : "";
            this.selectedNodeId = "";
            this.$nextTick(() => this.resetView());
        },
        selectLevel(level) {
            this.selectedLevel = this.selectedLevel === level ? "" : level;
            this.selectedNodeId = "";
            if (!this.selectedLevel) return;

            this.$nextTick(() => {
                const node = this.treeLayout.nodes.find(
                    (item) => item.type === this.selectedLevel
                );
                const wrap = this.$refs.canvasWrap;
                if (!node || !wrap) return;

                const left = node.x + 10;
                const top = node.y + this.treeLayout.offsetY;
                this.panX = wrap.clientWidth / 2 - left * this.zoom - 80;
                this.panY = wrap.clientHeight / 2 - top * this.zoom - 20;
            });
        },
        clampZoom(value) {
            return Math.max(0.2, Math.min(3, Number(value.toFixed(2))));
        },
        zoomBy(delta) {
            const wrap = this.$refs.canvasWrap;
            const oldZoom = this.zoom;
            const nextZoom = this.clampZoom(oldZoom + delta);
            if (!wrap || nextZoom === oldZoom) return;

            const centerX = (wrap.clientWidth / 2 - this.panX) / oldZoom;
            const centerY = (wrap.clientHeight / 2 - this.panY) / oldZoom;
            this.zoom = nextZoom;
            this.panX = wrap.clientWidth / 2 - centerX * nextZoom;
            this.panY = wrap.clientHeight / 2 - centerY * nextZoom;
        },
        resetView() {
            const wrap = this.$refs.canvasWrap;
            if (!wrap || !this.modelData.length) {
                this.zoom = 1;
                this.panX = 0;
                this.panY = 0;
                return;
            }

            const padding = 48;
            const availableWidth = Math.max(wrap.clientWidth - padding * 2, 1);
            const availableHeight = Math.max(
                wrap.clientHeight - padding * 2,
                1
            );
            const fitZoom = Math.min(
                1,
                availableWidth / this.treeLayout.width,
                availableHeight / this.treeLayout.height
            );

            this.zoom = this.clampZoom(fitZoom);
            this.panX =
                (wrap.clientWidth - this.treeLayout.width * this.zoom) / 2;
            this.panY =
                (wrap.clientHeight - this.treeLayout.height * this.zoom) / 2;
        },
        toggleFullscreen() {
            const wrap = this.$refs.canvasWrap;
            if (!wrap) return;

            if (document.fullscreenElement) {
                document.exitFullscreen();
                return;
            }

            if (!wrap.requestFullscreen) {
                this.$message.warning("当前浏览器不支持全屏模式");
                return;
            }

            const result = wrap.requestFullscreen();
            if (result && result.catch) {
                result.catch(() => this.$message.warning("无法进入全屏模式"));
            }
        },
        startDrag(event) {
            if (event.button !== 0) return;
            const target = event.target;
            if (target.closest && target.closest(".product-model__node"))
                return;

            this.dragging = true;
            this.dragStartX = event.clientX;
            this.dragStartY = event.clientY;
            this.panStartX = this.panX;
            this.panStartY = this.panY;
            event.preventDefault();
        },
        dragCanvas(event) {
            if (!this.dragging) return;
            this.panX = this.panStartX + event.clientX - this.dragStartX;
            this.panY = this.panStartY + event.clientY - this.dragStartY;
        },
        stopDrag() {
            this.dragging = false;
        },
        handleWheel(event) {
            const wrap = this.$refs.canvasWrap;
            if (!wrap) return;

            const rect = wrap.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            const oldZoom = this.zoom;
            const nextZoom = this.clampZoom(
                oldZoom + (event.deltaY > 0 ? -0.08 : 0.08)
            );
            const canvasX = (mouseX - this.panX) / oldZoom;
            const canvasY = (mouseY - this.panY) / oldZoom;

            this.zoom = nextZoom;
            this.panX = mouseX - canvasX * nextZoom;
            this.panY = mouseY - canvasY * nextZoom;
        },
    },
};
</script>

<style scoped>
.product-model {
    display: flex;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
    overflow: hidden;
    background: #fff;
    color: #262626;
}

.product-model,
.product-model * {
    scrollbar-color: #b8c5d8 transparent;
    scrollbar-width: thin;
}

.product-model ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.product-model ::-webkit-scrollbar-track {
    background: transparent;
}

.product-model ::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 999px;
    background: #b8c5d8;
    background-clip: content-box;
}

.product-model ::-webkit-scrollbar-thumb:hover {
    background: #8fa0b8;
    background-clip: content-box;
}

.product-model ::-webkit-scrollbar-corner {
    background: transparent;
}

.product-model__sidebar {
    display: flex;
    flex: 0 0 250px;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid #edf0f4;
    background: #fff;
}

.product-model__sidebar-header {
    box-sizing: border-box;
    flex-shrink: 0;
    padding: 30px 24px 28px;
    border-bottom: 1px solid #edf0f4;
}

.product-model__brand {
    text-align: center;
}

.product-model__brand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    margin: 0 auto 10px;
    border-radius: 12px;
    background: linear-gradient(135deg, #2b5fd7, #7048bd);
    box-shadow: 0 6px 16px rgba(43, 95, 215, 0.2);
    color: #fff;
    font-size: 21px;
    font-weight: 700;
}

.product-model__brand-title {
    color: #222b38;
    font-size: 19px;
    font-weight: 700;
}

.product-model__brand-en {
    margin-top: 3px;
    color: #9aa3af;
    font-size: 11px;
}

.product-model__sidebar-tree {
    flex: 1;
    padding: 28px 18px;
    overflow-y: auto;
}

.product-model__sidebar-node {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 176px;
    min-height: 46px;
    box-sizing: border-box;
    gap: 8px;
    padding: 11px 10px;
    margin: 0 auto;
    border: 1px solid #dfe7f4;
    border-radius: 6px;
    background: #eef3fb;
    color: #38537d;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.product-model__sidebar-node:hover {
    border-color: #8eade5;
    background: #e7effc;
}

.product-model__sidebar-node.active {
    border-color: #2b5fd7;
    background: #2b5fd7;
    box-shadow: 0 5px 14px rgba(43, 95, 215, 0.22);
    color: #fff;
}

.product-model__sidebar-node.active .product-model__sidebar-dot {
    background: #fff !important;
}

.product-model__sidebar-dot {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
    border-radius: 50%;
}

.product-model__sidebar-connector {
    width: 1px;
    height: 28px;
    margin: 0 auto;
    background: #b9c7da;
    position: relative;
}

.product-model__sidebar-connector::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: -4px;
    border-top: 6px solid #b9c7da;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
}

.product-model__main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    background: #fff;
}

.product-model__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    min-height: 58px;
    gap: 8px;
    flex-shrink: 0;
    flex-wrap: nowrap;
    padding: 0 20px;
    border-bottom: 1px solid #e6eaf0;
    background: #fff;
}

.product-model__toolbar-actions {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
}

.product-model__toolbar-actions {
    gap: 8px;
}

.product-model__expand-control {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #667085;
    font-size: 12px;
    white-space: nowrap;
}

.product-model__expand-select {
    width: 128px;
}

.product-model__expand-select ::v-deep .el-input__inner {
    height: 32px;
    border-color: #e2e6ec;
    border-radius: 6px;
    line-height: 32px;
}

.product-model__expand-toggle.el-button {
    height: 32px;
    padding: 0 11px;
    border-color: #e2e6ec;
    border-radius: 6px;
    color: #667085;
}

.product-model__expand-toggle.el-button:hover,
.product-model__expand-toggle.el-button:focus {
    border-color: #2b5fd7;
    background: #fff;
    color: #2b5fd7;
}

.product-model__expand-toggle i {
    margin-right: 5px;
}

.product-model__toolbar-heading {
    display: flex;
    align-items: baseline;
    min-width: 0;
}

.product-model__toolbar-title {
    color: #273142;
    font-size: 15px;
    font-weight: 700;
    white-space: nowrap;
}

.product-model__search {
    width: 160px;
}

.product-model__search ::v-deep .el-input__inner {
    height: 32px;
    border-color: #e8e8e8;
    border-radius: 6px;
    color: #262626;
    font-size: 12px;
    line-height: 32px;
}

.product-model__search ::v-deep .el-input__inner:focus {
    border-color: #2b5fd7;
}

.product-model__toolbar-button.el-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border-color: #e8e8e8;
    border-radius: 6px;
    color: #8c8c8c;
}

.product-model__toolbar-button.el-button:hover,
.product-model__toolbar-button.el-button:focus {
    border-color: #2b5fd7;
    background: #fff;
    color: #2b5fd7;
}

.product-model__toolbar-button ::v-deep span {
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-model__zoom-display {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 8px;
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    color: #8c8c8c;
    font-size: 12px;
}

.product-model__canvas-wrap {
    position: relative;
    flex: 1;
    overflow: hidden;
    background: #f5f7fa;
    cursor: grab;
    user-select: none;
}

.product-model__canvas-wrap.dragging {
    cursor: grabbing;
}

.product-model__canvas-wrap:fullscreen {
    background: #f5f7fa;
}

.product-model__canvas {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;
}

.product-model__edges {
    position: absolute;
    top: 0;
    left: 0;
    overflow: visible;
    pointer-events: none;
}

.product-model__edges path {
    fill: none;
    stroke: #b0bdd0;
    stroke-width: 1.5;
}

.product-model__tree {
    position: relative;
}

.product-model__node {
    position: absolute;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0;
    white-space: nowrap;
    cursor: pointer;
    transition: filter 0.15s;
}

.product-model__node:hover {
    filter: brightness(1.08);
}

.product-model__node.highlight {
    filter: drop-shadow(0 0 6px rgba(43, 95, 215, 0.5));
}

.product-model__node.highlight .product-model__node-body {
    box-shadow: 0 0 0 3px #2b5fd7, 0 2px 8px rgba(43, 95, 215, 0.3);
}

.product-model__node-body {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
}

.product-model__node.level-0 .product-model__node-body {
    padding: 10px 20px;
    border-radius: 10px;
    background: #1a3f8f;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
}

.product-model__node.level-1 .product-model__node-body {
    background: #2b5fd7;
    color: #fff;
}

.product-model__node.level-2 .product-model__node-body {
    background: #4a90d9;
    color: #fff;
}

.product-model__node.level-3 .product-model__node-body {
    background: #5ba3e6;
    color: #fff;
}

.product-model__node.level-4 .product-model__node-body {
    background: #7ec8e3;
    color: #1a5070;
}

.product-model__node.level-5 .product-model__node-body {
    background: #a8d8ea;
    color: #1a5070;
}

.product-model__node.level-6 .product-model__node-body {
    background: #c9e9f2;
    color: #1a5070;
}

.product-model__node-toggle {
    z-index: 3;
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    padding: 0;
    margin-left: 6px;
    border: 2px solid #2b5fd7;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    transition: all 0.15s;
}

.product-model__node-toggle:hover {
    transform: scale(1.3);
}

.product-model__node-toggle.expanded {
    border-color: #2b5fd7;
    background: #2b5fd7;
}

.product-model__node.search-dim {
    opacity: 0.12;
}

.product-model__zoom-hint {
    position: absolute;
    right: 16px;
    bottom: 12px;
    z-index: 10;
    padding: 3px 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.85);
    color: #8c8c8c;
    font-size: 11px;
    pointer-events: none;
}

.product-model__fullscreen-exit {
    position: absolute;
    top: 18px;
    right: 18px;
    z-index: 30;
    display: none;
    padding: 8px 13px;
    border: 1px solid #dce3ec;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 4px 14px rgba(31, 45, 61, 0.14);
    color: #435066;
    cursor: pointer;
}

.product-model__canvas-wrap:fullscreen .product-model__fullscreen-exit {
    display: block;
}

@media (max-width: 900px) {
    .product-model__sidebar {
        flex-basis: 210px;
    }

    .product-model__sidebar-node {
        width: 160px;
    }

    .product-model__toolbar {
        align-items: center;
    }
}
</style>
