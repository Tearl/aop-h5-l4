<template>
    <div class="capability-model">
        <aside class="capability-model__sidebar">
            <div class="capability-model__sidebar-header">
                <div class="capability-model__brand-icon">能</div>
                <div class="capability-model__brand-title">能力模型</div>
                <div class="capability-model__brand-en">Capability Model</div>
            </div>

            <div class="capability-model__level-tree">
                <template v-for="(level, index) in levels">
                    <button
                        :key="level.key"
                        :class="['capability-model__level', { active: selectedLevel === level.key }]"
                        type="button"
                        @click="selectLevel(level.key)"
                    >
                        <span class="capability-model__level-dot" :style="{ background: level.color }" />
                        <span>{{ level.label }}</span>
                    </button>
                    <div
                        v-if="index < levels.length - 1"
                        :key="`${level.key}-connector`"
                        class="capability-model__level-connector"
                    />
                </template>
            </div>
        </aside>

        <main ref="main" class="capability-model__main">
            <header class="capability-model__toolbar">
                <div class="capability-model__toolbar-title">能力模型图</div>

                <div class="capability-model__toolbar-actions">
                    <div class="capability-model__expand-control">
                        <span>展开至</span>
                        <el-select
                            v-model="expandToLevel"
                            class="capability-model__expand-select"
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
                        class="capability-model__expand-toggle"
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
                        {{ allNodesExpanded ? '一键收起' : '一键展开' }}
                    </el-button>
                    <label class="capability-model__search">
                        <i class="el-icon-search" />
                        <input
                            v-model.trim="searchKeyword"
                            type="text"
                            placeholder="查找节点..."
                            @input="scheduleSearchHighlight"
                        >
                    </label>
                    <button type="button" title="缩小" @click="zoomBy(-0.1)">
                        −
                    </button>
                    <span>{{ zoomPercent }}%</span>
                    <button type="button" title="放大" @click="zoomBy(0.1)">
                        +
                    </button>
                    <button type="button" title="重置视图" @click="resetView">
                        <img
                            :src="require('@m/assets/images/refresh-reset.svg')"
                            width="16"
                            height="16"
                            alt=""
                            draggable="false"
                        >
                    </button>
                    <button type="button" title="全屏" @click="toggleFullscreen">
                        <i class="el-icon-full-screen" />
                    </button>
                </div>
            </header>

            <div ref="canvas" v-loading="modelLoading" class="capability-model__canvas">
                <div ref="graph" class="capability-model__graph" />
                <div class="capability-model__hint">鼠标滚轮缩放 · 拖拽平移</div>
                <button
                    v-if="fullscreen"
                    type="button"
                    class="capability-model__fullscreen-exit"
                    @click="toggleFullscreen"
                >
                    退出全屏
                </button>
            </div>
        </main>
    </div>
</template>

<script>
import G6 from '@antv/g6'
import rpcMixins from '@m/core/mixin'
import {
    CAPABILITY_LEVELS,
    CAPABILITY_MODEL_DATA
} from './data'

const HORIZONTAL_GAP = 180
const VERTICAL_GAP = 6
const NODE_HEIGHT = 34
const ROOT_HEIGHT = 44
const DEFAULT_EXPAND_LEVEL = 'cap'
const MAX_VISIBLE_GRAPH_NODES = 1200
const API_CAPABILITY_TYPE_MAP = {
    capability: 'domain',
    appVersion: 'group',
    module: 'cap',
    function: 'func'
}
const API_CAPABILITY_LEVEL_MAP = {
    1: 'domain',
    2: 'group',
    3: 'cap',
    4: 'func',
    5: 'rule'
}
const CAPABILITY_TYPE_LEVEL_MAP = {
    root: 0,
    domain: 1,
    group: 2,
    cap: 3,
    func: 4,
    rule: 5
}

const createCapabilityRoot = children => Object.freeze({
    name: '能力模型',
    type: 'root',
    children
})

const normalizeCapabilityNode = node => {
    const type = API_CAPABILITY_TYPE_MAP[node.nodeType]
        || API_CAPABILITY_LEVEL_MAP[node.level]
    if (!type) return null

    const children = (Array.isArray(node.children) ? node.children : [])
        .map(normalizeCapabilityNode)
        .filter(Boolean)

    return {
        ...node,
        name: node.nodeName || node.name || '未命名节点',
        type,
        children
    }
}

const EMPTY_EXPANDED_NODES = Object.freeze({})

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key)

const countTreeNodes = root => {
    let count = 0
    const stack = [root]
    while (stack.length) {
        const node = stack.pop()
        if (!node) continue
        count += 1
        const children = Array.isArray(node.children) ? node.children : []
        children.forEach(child => stack.push(child))
    }
    return count
}

export default {
    name: 'CapabilityModel',
    mixins: [rpcMixins],
    data() {
        return {
            levels: CAPABILITY_LEVELS,
            modelData: createCapabilityRoot([]),
            modelLoading: false,
            selectedLevel: CAPABILITY_LEVELS[0].key,
            expandToLevel: DEFAULT_EXPAND_LEVEL,
            expandDepth: CAPABILITY_TYPE_LEVEL_MAP[DEFAULT_EXPAND_LEVEL],
            expandedNodes: EMPTY_EXPANDED_NODES,
            modelNodeCount: 0,
            searchKeyword: '',
            zoom: 1,
            fullscreen: false
        }
    },
    computed: {
        zoomPercent() {
            return Math.round(this.zoom * 100)
        },
        levelMap() {
            return this.levels.reduce((result, level) => {
                result[level.key] = level
                return result
            }, {})
        },
        allNodesExpanded() {
            return this.modelNodeCount > 0
                && this.expandDepth === Number.POSITIVE_INFINITY
                && !Object.keys(this.expandedNodes).some(
                    key => this.expandedNodes[key] === false
                )
        }
    },
    created() {
        this.graph = null
        this.graphData = null
        this.searchHighlightApplied = false
        this.highlightedLevel = ''
        this.searchTimer = null
        this.getCapabilityModelTree();
    },
    mounted() {
        document.addEventListener('fullscreenchange', this.syncFullscreen)
        window.addEventListener('resize', this.resizeGraph)
        this.$nextTick(this.renderGraph)
    },
    beforeDestroy() {
        document.removeEventListener('fullscreenchange', this.syncFullscreen)
        window.removeEventListener('resize', this.resizeGraph)
        window.clearTimeout(this.searchTimer)
        this.destroyGraph()
    },
    methods: {
        async getCapabilityModelTree(params = {}) {
            this.modelLoading = true
            try {
                const response = await this.rpc.assetcenter.getCapabilityModelTree(params)
                const result = response && response.body ? response.body : response
                const children = result && Array.isArray(result.children)
                    ? result.children.map(normalizeCapabilityNode).filter(Boolean)
                    : []

                this.modelData = createCapabilityRoot(children)
                this.modelNodeCount = countTreeNodes(this.modelData)
                this.resetExpansion(DEFAULT_EXPAND_LEVEL, false)
                this.searchKeyword = ''
                this.selectedLevel = this.levels[0].key
                this.$nextTick(this.renderGraph)
            } catch (error) {
                this.modelData = createCapabilityRoot([])
                this.modelNodeCount = 0
                this.expandedNodes = EMPTY_EXPANDED_NODES
                this.$nextTick(this.renderGraph)
            } finally {
                this.modelLoading = false
            }
        },
        getBusinessFunctionTree() {
            const res = this.rpc.assetcenter.getBusinessFunctionTree({
                modIds: [],
            })
            console.log(res,'res===========>')
        },
        loadMockCapabilityModel() {
            this.modelData = Object.freeze(CAPABILITY_MODEL_DATA)
            this.modelNodeCount = countTreeNodes(this.modelData)
            this.resetExpansion(DEFAULT_EXPAND_LEVEL, false)
            this.searchKeyword = ''
            this.selectedLevel = this.levels[0].key
            this.$nextTick(this.renderGraph)
        },
        isNodeExpanded(node, path, expandDepth = this.expandDepth, overrides = this.expandedNodes) {
            if (hasOwn(overrides, path)) return overrides[path]
            const level = CAPABILITY_TYPE_LEVEL_MAP[node.type] || 0
            return level < expandDepth
        },
        countVisibleNodes(expandDepth, overrides = EMPTY_EXPANDED_NODES, limit = Number.POSITIVE_INFINITY) {
            let count = 0
            const stack = [{ node: this.modelData, path: 'cap-0' }]
            while (stack.length) {
                const current = stack.pop()
                if (!current || !current.node) continue
                count += 1
                if (count > limit) return count
                const children = Array.isArray(current.node.children)
                    ? current.node.children
                    : []
                if (!children.length || !this.isNodeExpanded(
                    current.node,
                    current.path,
                    expandDepth,
                    overrides
                )) continue
                for (let index = children.length - 1; index >= 0; index -= 1) {
                    stack.push({
                        node: children[index],
                        path: `${current.path}-${index}`
                    })
                }
            }
            return count
        },
        resolveSafeExpandDepth(requestedDepth) {
            if (this.modelNodeCount <= MAX_VISIBLE_GRAPH_NODES) {
                return requestedDepth
            }
            let depth = requestedDepth === Number.POSITIVE_INFINITY
                ? this.levels.length
                : requestedDepth
            while (depth > 0 && this.countVisibleNodes(
                depth,
                EMPTY_EXPANDED_NODES,
                MAX_VISIBLE_GRAPH_NODES
            ) > MAX_VISIBLE_GRAPH_NODES) {
                depth -= 1
            }
            return depth
        },
        getLevelKeyByDepth(depth) {
            const level = this.levels.find(item => (
                CAPABILITY_TYPE_LEVEL_MAP[item.key] === depth
            ))
            return level ? level.key : ''
        },
        resetExpansion(level, notify = true) {
            const requestedDepth = CAPABILITY_TYPE_LEVEL_MAP[level]
            if (requestedDepth === undefined) return
            const safeDepth = this.resolveSafeExpandDepth(requestedDepth)
            this.expandDepth = safeDepth
            this.expandToLevel = this.getLevelKeyByDepth(safeDepth)
            this.expandedNodes = EMPTY_EXPANDED_NODES
            if (notify && safeDepth < requestedDepth) {
                this.$message.warning(
                    `当前共有 ${this.modelNodeCount} 个节点，为避免页面卡死，已自动降低首屏展开层级，可点击圆点逐个展开分支。`
                )
            }
        },
        getNodeWidth(name) {
            const textWidth = Array.from(name).reduce((width, char) => (
                width + (char.charCodeAt(0) > 127 ? 14 : 8)
            ), 0)
            return Math.max(76, textWidth + 28)
        },
        buildGraphData() {
            const nodes = []
            const edges = []
            let maxX = 0
            let maxY = 0

            const measureNode = (node, path, depth) => {
                const children = Array.isArray(node.children) ? node.children : []
                const hasChildren = Boolean(children.length)
                const expanded = this.isNodeExpanded(node, path)
                const visibleChildren = hasChildren && expanded
                    ? children.map((child, index) => (
                        measureNode(child, `${path}-${index}`, depth + 1)
                    ))
                    : []
                const nodeHeight = depth === 0 ? ROOT_HEIGHT : NODE_HEIGHT
                const height = visibleChildren.length
                    ? visibleChildren.reduce((total, child, index) => (
                        total + child.height + (index ? VERTICAL_GAP : 0)
                    ), 0)
                    : nodeHeight
                return {
                    node,
                    path,
                    depth,
                    hasChildren,
                    expanded,
                    nodeHeight,
                    nodeWidth: this.getNodeWidth(node.name),
                    height,
                    children: visibleChildren
                }
            }

            const rootLayout = measureNode(this.modelData, 'cap-0', 0)
            const totalHeight = rootLayout.height

            const layoutNode = (layout, left, centerY) => {
                const {
                    node,
                    path,
                    depth,
                    hasChildren,
                    expanded,
                    nodeHeight,
                    nodeWidth
                } = layout
                const level = this.levelMap[node.type]
                const fill = node.type === 'root'
                    ? '#1A3F8F'
                    : (level ? level.color : '#4a90e2')
                const textColor = node.type === 'func' || node.type === 'rule'
                    ? '#174f6d'
                    : '#fff'
                const top = centerY - nodeHeight / 2

                nodes.push({
                    id: path,
                    x: left + nodeWidth / 2,
                    y: centerY,
                    label: node.name,
                    nodeName: node.name,
                    nodeType: node.type,
                    hasChildren,
                    expanded,
                    type: 'rect',
                    size: [nodeWidth, nodeHeight],
                    style: {
                        radius: depth === 0 ? 10 : 8,
                        fill,
                        stroke: fill,
                        lineWidth: 1,
                        shadowColor: 'rgba(31, 45, 61, 0.1)',
                        shadowBlur: depth === 0 ? 10 : 4
                    },
                    labelCfg: {
                        style: {
                            fill: textColor,
                            fontSize: depth === 0 ? 14 : 13,
                            fontWeight: depth === 0 ? 700 : 500
                        }
                    },
                    linkPoints: hasChildren ? {
                        right: true,
                        size: 7,
                        fill: expanded ? '#2B5FD7' : '#fff',
                        stroke: '#2B5FD7',
                        lineWidth: 2
                    } : undefined,
                    anchorPoints: [[0, 0.5], [1, 0.5]]
                })
                maxX = Math.max(maxX, left + nodeWidth)
                maxY = Math.max(maxY, top + nodeHeight)

                if (!layout.children.length) return
                const childLeft = left + nodeWidth + HORIZONTAL_GAP
                let childTop = centerY - layout.height / 2

                layout.children.forEach((child, index) => {
                    const childCenterY = childTop + child.height / 2
                    edges.push({
                        id: `${path}-edge-${index}`,
                        source: path,
                        target: child.path,
                        type: 'cubic-horizontal',
                        sourceAnchor: 1,
                        targetAnchor: 0,
                        style: {
                            stroke: '#aebbd0',
                            lineWidth: 1.4
                        }
                    })
                    layoutNode(child, childLeft, childCenterY)
                    childTop += child.height + VERTICAL_GAP
                })
            }

            layoutNode(rootLayout, 50, totalHeight / 2 + 40)
            return {
                nodes,
                edges,
                width: maxX + 100,
                height: Math.max(maxY + 60, totalHeight + 80)
            }
        },
        renderGraph() {
            const container = this.$refs.graph
            const canvas = this.$refs.canvas
            if (!container || !canvas || !canvas.clientWidth || !canvas.clientHeight) return
            this.destroyGraph()
            this.graphData = this.buildGraphData()

            const graph = new G6.Graph({
                container,
                width: canvas.clientWidth,
                height: canvas.clientHeight,
                renderer: 'canvas',
                minZoom: 0.25,
                maxZoom: 2.5,
                modes: {
                    default: [
                        {
                            type: 'drag-canvas',
                            allowDragOnItem: false,
                            scalableRange: 0.8
                        },
                        {
                            type: 'zoom-canvas',
                            minZoom: 0.25,
                            maxZoom: 2.5
                        }
                    ]
                },
                nodeStateStyles: {
                    levelSelected: {
                        lineWidth: 3,
                        stroke: '#173f9f',
                        shadowColor: 'rgba(43, 95, 215, 0.35)',
                        shadowBlur: 12
                    },
                    searchDim: {
                        opacity: 0.12
                    }
                },
                defaultEdge: {
                    type: 'cubic-horizontal',
                    style: {
                        stroke: '#aebbd0',
                        lineWidth: 1.4
                    }
                }
            })
            graph.data({
                nodes: this.graphData.nodes,
                edges: this.graphData.edges
            })
            graph.on('viewportchange', () => {
                this.zoom = graph.getZoom()
            })
            graph.on('node:click', event => {
                const model = event.item.getModel()
                this.selectedLevel = model.nodeType
                if (model.hasChildren) {
                    const nextExpandedNodes = Object.freeze({
                        ...this.expandedNodes,
                        [model.id]: !model.expanded
                    })
                    if (!model.expanded && this.countVisibleNodes(
                        this.expandDepth,
                        nextExpandedNodes,
                        MAX_VISIBLE_GRAPH_NODES
                    ) > MAX_VISIBLE_GRAPH_NODES) {
                        this.$message.warning(
                            `单次最多展示 ${MAX_VISIBLE_GRAPH_NODES} 个节点，请先收起其他分支后再展开。`
                        )
                        return
                    }
                    this.expandedNodes = nextExpandedNodes
                    this.expandToLevel = ''
                    this.updateGraphData(model.id)
                } else {
                    this.applyLevelHighlight()
                }
            })
            graph.render()
            this.graph = graph
            this.resetView()
            this.applyLevelHighlight()
            this.applySearchHighlight()
        },
        updateGraphData(focusNodeId) {
            if (!this.graph) return
            this.graphData = this.buildGraphData()
            this.graph.changeData({
                nodes: this.graphData.nodes,
                edges: this.graphData.edges
            })
            this.applyLevelHighlight()
            this.applySearchHighlight()
            if (focusNodeId && this.graph.findById(focusNodeId)) {
                const animate = this.graphData.nodes.length < 200
                this.graph.focusItem(
                    focusNodeId,
                    animate,
                    animate ? { duration: 160 } : undefined
                )
            }
        },
        applyLevelHighlight() {
            if (!this.graph) return
            const previousLevel = this.highlightedLevel
            this.graph.getNodes().forEach(node => {
                const nodeType = node.getModel().nodeType
                if (nodeType === this.selectedLevel) {
                    this.graph.setItemState(node, 'levelSelected', true)
                } else if (nodeType === previousLevel) {
                    this.graph.setItemState(node, 'levelSelected', false)
                }
            })
            this.highlightedLevel = this.selectedLevel
        },
        scheduleSearchHighlight() {
            window.clearTimeout(this.searchTimer)
            this.searchTimer = window.setTimeout(
                this.applySearchHighlight,
                120
            )
        },
        applySearchHighlight() {
            if (!this.graph) return
            const keyword = this.searchKeyword.trim().toLowerCase()
            if (!keyword && !this.searchHighlightApplied) return
            this.searchHighlightApplied = Boolean(keyword)
            this.graph.getNodes().forEach(node => {
                const name = String(node.getModel().nodeName || '').toLowerCase()
                this.graph.setItemState(node, 'searchDim', Boolean(keyword && !name.includes(keyword)))
            })
        },
        selectLevel(levelKey) {
            this.selectedLevel = levelKey
            this.applyLevelHighlight()
            if (!this.graph) return
            const target = this.graph.getNodes().find(node => (
                node.getModel().nodeType === levelKey
            ))
            if (target) {
                this.graph.focusItem(target, true, { duration: 320 })
            }
        },
        expandTreeToLevel(level) {
            this.resetExpansion(level)
            this.updateGraphData()
            this.resetView()
        },
        toggleAllNodes() {
            const expandAll = !this.allNodesExpanded
            const requestedDepth = expandAll ? Number.POSITIVE_INFINITY : 0
            const safeDepth = expandAll
                ? this.resolveSafeExpandDepth(requestedDepth)
                : requestedDepth
            this.expandDepth = safeDepth
            this.expandedNodes = EMPTY_EXPANDED_NODES
            this.expandToLevel = this.getLevelKeyByDepth(safeDepth)
            if (expandAll && safeDepth !== Number.POSITIVE_INFINITY) {
                this.$message.warning(
                    `当前共有 ${this.modelNodeCount} 个节点，已展开至安全层级；请通过圆点继续展开需要查看的分支。`
                )
            }
            this.updateGraphData()
            this.resetView()
        },
        zoomBy(delta) {
            const graph = this.graph
            const canvas = this.$refs.canvas
            if (!graph || !canvas) return
            const zoom = Math.max(0.25, Math.min(2.5, graph.getZoom() + delta))
            graph.zoomTo(zoom, {
                x: canvas.clientWidth / 2,
                y: canvas.clientHeight / 2
            })
            this.zoom = graph.getZoom()
        },
        resetView() {
            const graph = this.graph
            const canvas = this.$refs.canvas
            const root = graph && graph.findById('cap-0')
            if (!graph || !canvas || !root) return
            this.zoom = 1
            graph.zoomTo(this.zoom, { x: 0, y: 0 })
            const rootModel = root.getModel()
            const rootWidth = rootModel.size[0]
            graph.moveTo(
                36 + rootWidth * this.zoom / 2 - rootModel.x * this.zoom,
                canvas.clientHeight / 2 - rootModel.y * this.zoom
            )
        },
        resizeGraph() {
            const graph = this.graph
            const canvas = this.$refs.canvas
            if (!graph || !canvas || !canvas.clientWidth || !canvas.clientHeight) return
            graph.changeSize(canvas.clientWidth, canvas.clientHeight)
        },
        toggleFullscreen() {
            const canvas = this.$refs.canvas
            if (!canvas) return
            if (document.fullscreenElement) {
                document.exitFullscreen()
            } else if (canvas.requestFullscreen) {
                canvas.requestFullscreen()
            }
        },
        syncFullscreen() {
            this.fullscreen = document.fullscreenElement === this.$refs.canvas
            this.$nextTick(() => window.setTimeout(this.resizeGraph, 0))
        },
        destroyGraph() {
            if (this.graph && !this.graph.get('destroyed')) {
                this.graph.destroy()
            }
            this.graph = null
            this.highlightedLevel = ''
        }
    }
}
</script>

<style scoped>
.capability-model {
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 620px;
    overflow: hidden;
    background: #fff;
    color: #334155;
}

.capability-model__sidebar {
    display: flex;
    flex: 0 0 250px;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid #edf0f4;
    background: #fff;
}

.capability-model__sidebar-header {
    padding: 30px 24px 28px;
    border-bottom: 1px solid #edf0f4;
    text-align: center;
}

.capability-model__brand-icon {
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

.capability-model__brand-title {
    color: #222b38;
    font-size: 19px;
    font-weight: 700;
}

.capability-model__brand-en {
    margin-top: 3px;
    color: #9aa3af;
    font-size: 11px;
}

.capability-model__level-tree {
    flex: 1;
    padding: 28px 18px;
    overflow-y: auto;
}

.capability-model__level {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 176px;
    min-height: 46px;
    gap: 8px;
    padding: 10px;
    margin: 0 auto;
    border: 1px solid #dfe7f4;
    border-radius: 6px;
    background: #eef3fb;
    color: #38537d;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
}

.capability-model__level:hover {
    border-color: #8eade5;
    background: #e7effc;
}

.capability-model__level.active {
    border-color: #2b5fd7;
    background: #2b5fd7;
    box-shadow: 0 5px 14px rgba(43, 95, 215, 0.22);
    color: #fff;
}

.capability-model__level.active .capability-model__level-dot {
    background: #fff !important;
}

.capability-model__level-dot {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
    border-radius: 50%;
}

.capability-model__level-connector {
    position: relative;
    width: 1px;
    height: 28px;
    margin: 0 auto;
    background: #b9c7da;
}

.capability-model__level-connector::after {
    position: absolute;
    bottom: -1px;
    left: -4px;
    border-top: 6px solid #b9c7da;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
    content: '';
}

.capability-model__main {
    position: relative;
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    overflow: hidden;
}

.capability-model__toolbar {
    display: flex;
    min-height: 58px;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 0 20px;
    border-bottom: 1px solid #e6eaf0;
    background: #fff;
}

.capability-model__toolbar-title {
    flex-shrink: 0;
    color: #273142;
    font-size: 15px;
    font-weight: 700;
}

.capability-model__toolbar-actions {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 6px;
}

.capability-model__expand-control {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #667085;
    font-size: 12px;
    white-space: nowrap;
}

.capability-model__expand-select {
    width: 128px;
}

.capability-model__expand-select ::v-deep .el-input__inner {
    height: 32px;
    border-color: #e2e6ec;
    border-radius: 6px;
    line-height: 32px;
}

.capability-model__expand-toggle.el-button {
    display: inline-flex;
    width: auto;
    height: 32px;
    align-items: center;
    padding: 0 11px;
    border-color: #e2e6ec;
    border-radius: 6px;
    color: #667085;
}

.capability-model__expand-toggle.el-button:hover,
.capability-model__expand-toggle.el-button:focus {
    border-color: #2b5fd7;
    background: #fff;
    color: #2b5fd7;
}

.capability-model__expand-toggle i {
    margin-right: 5px;
}

.capability-model__search {
    display: flex;
    width: 160px;
    height: 32px;
    align-items: center;
    gap: 7px;
    padding: 0 10px;
    margin-right: 2px;
    border: 1px solid #e2e6ec;
    border-radius: 6px;
    background: #fff;
    color: #98a2b3;
}

.capability-model__search:focus-within {
    border-color: #2b5fd7;
}

.capability-model__search input {
    width: 100%;
    min-width: 0;
    padding: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: #344054;
    font-family: inherit;
    font-size: 12px;
}

.capability-model__search input::placeholder {
    color: #98a2b3;
}

.capability-model__toolbar-actions button {
    display: flex;
    width: 32px;
    height: 32px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 1px solid #e2e6ec;
    border-radius: 6px;
    background: #fff;
    color: #667085;
    cursor: pointer;
}

.capability-model__toolbar-actions button:hover {
    border-color: #2b5fd7;
    color: #2b5fd7;
}

.capability-model__toolbar-actions > span {
    min-width: 46px;
    color: #788393;
    font-size: 11px;
    text-align: center;
}

.capability-model__canvas {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    background-color: #f5f7fa;
}

.capability-model__graph {
    position: absolute;
    inset: 0;
}

.capability-model__graph ::v-deep canvas,
.capability-model__graph ::v-deep svg {
    cursor: grab;
}

.capability-model__graph ::v-deep canvas:active,
.capability-model__graph ::v-deep svg:active {
    cursor: grabbing;
}

.capability-model__hint {
    position: absolute;
    z-index: 2;
    right: 16px;
    bottom: 14px;
    padding: 6px 10px;
    border: 1px solid rgba(194, 204, 218, 0.8);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.88);
    color: #8a96a8;
    font-size: 11px;
    pointer-events: none;
}

.capability-model__canvas:fullscreen {
    background-color: #f5f7fa;
}

.capability-model__fullscreen-exit {
    position: absolute;
    z-index: 3;
    top: 16px;
    right: 16px;
    padding: 7px 12px;
    border: 0;
    border-radius: 5px;
    background: rgba(39, 49, 66, 0.82);
    color: #fff;
    cursor: pointer;
}

@media (max-width: 1100px) {
    .capability-model__sidebar {
        flex-basis: 220px;
    }

    .capability-model__search {
        width: 136px;
    }
}
</style>
