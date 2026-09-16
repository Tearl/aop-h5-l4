<template>
    <div class="architecture-panorama">
        <header class="architecture-panorama__header">
            <div>
                <h2>架构全景</h2>
                <p>展示业务、数据、应用、部署、技术五大架构及其模型层级结构，支持横向追溯</p>
            </div>
            <div class="relation-legend" aria-label="跨模型关系图例">
                <span class="relation-legend__note">箭头/关系端点指向目标元素 · 点击节点聚焦关系</span>
                <span><b>→</b>使用/触发</span>
                <span><b>▷</b>实现</span>
                <span class="relation-legend__carrier"><b>■</b>承载</span>
                <span><b>⇢</b>访问</span>
                <span><b>◆</b>组合</span>
            </div>
        </header>

        <div ref="scroll" class="architecture-panorama__scroll">
            <div
                ref="canvas"
                class="architecture-panorama__canvas"
                :style="canvasStyle"
                aria-label="架构全景关系图"
            />
        </div>
    </div>
</template>

<script>
import { Graph } from '@antv/x6'
import { ARCHITECTURE_COLUMNS, ARCHITECTURE_RELATIONS } from './data'

const GRAPH_WIDTH = 1809
const GRAPH_HEIGHT = 790
const ELEMENT_WIDTH = 167
const ELEMENT_HEIGHT = 61
const ELEMENT_Y = [150, 250, 350, 450, 550, 650]
const BUSINESS_ELEMENT_Y = [150, 250, 350, 460, 560, 670]
const MODEL_TITLE_Y = 82
const MODEL_TITLE_HEIGHT = 42

const HEADER_ICONS = {
    business: 'M0 0H7V7H0ZM11 0H18V7H11ZM0 11H7V18H0ZM11 11H18V18H11Z',
    data: 'M9 0C14 0 18 1.4 18 3S14 6 9 6 0 4.6 0 3 4 0 9 0ZM0 3V10C0 11.6 4 13 9 13S18 11.6 18 10V3M0 10V17C0 18.6 4 20 9 20S18 18.6 18 17V10',
    application: 'M6 2L0 9L6 16M12 2L18 9L12 16',
    deployment: 'M9 0C14 0 18 1.4 18 3S14 6 9 6 0 4.6 0 3 4 0 9 0ZM0 3V17C0 18.6 4 20 9 20S18 18.6 18 17V3M0 10C0 11.6 4 13 9 13S18 11.6 18 10',
    technology: 'M12.2 4.2A5 5 0 0 0 5.6 10.8L0.8 15.6A2.1 2.1 0 0 0 3.8 18.6L8.6 13.8A5 5 0 0 0 15.2 7.2L12.1 10.3L9.9 8.1Z'
}

const COLUMN_LAYOUT = [
    {
        key: 'business',
        x: 0,
        width: 731,
        headerStart: '#1890ff',
        headerEnd: '#40a9ff',
        fill: '#e8f4fd',
        stroke: '#91d5ff',
        text: '#1890ff',
        modelX: [30, 280, 520]
    },
    {
        key: 'data',
        x: 770,
        width: 231,
        headerStart: '#13a8a8',
        headerEnd: '#36cfc9',
        fill: '#e6fffb',
        stroke: '#87e8de',
        text: '#13c2c2',
        modelX: [800]
    },
    {
        key: 'application',
        x: 1038,
        width: 231,
        headerStart: '#52c41a',
        headerEnd: '#73d13d',
        fill: '#f6ffed',
        stroke: '#b7eb8f',
        text: '#52c41a',
        modelX: [1080]
    },
    {
        key: 'deployment',
        x: 1308,
        width: 231,
        headerStart: '#fa8c16',
        headerEnd: '#ffa940',
        fill: '#fff7e6',
        stroke: '#ffd591',
        text: '#fa8c16',
        modelX: [1340]
    },
    {
        key: 'technology',
        x: 1578,
        width: 231,
        headerStart: '#722ed1',
        headerEnd: '#9254de',
        fill: '#f9f0ff',
        stroke: '#d3adf7',
        text: '#722ed1',
        modelX: [1610]
    }
]

export default {
    name: 'ArchitecturePanorama',
    data() {
        return {
            graph: null,
            nodeBounds: {},
            lockedRelationId: '',
            focusedNodeId: '',
            canvasWidth: GRAPH_WIDTH,
            canvasHeight: GRAPH_HEIGHT,
            resizeObserver: null,
            resizeFrame: 0
        }
    },
    computed: {
        canvasStyle() {
            return {
                width: `${this.canvasWidth}px`,
                height: `${this.canvasHeight}px`
            }
        }
    },
    mounted() {
        this.initGraph()
        this.renderPanorama()
        this.$nextTick(() => {
            this.bindGraphResize()
            this.fitGraphToViewport()
        })
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.scheduleGraphFit)
        if (this.resizeObserver) this.resizeObserver.disconnect()
        if (this.resizeFrame) window.cancelAnimationFrame(this.resizeFrame)
        if (this.graph) this.graph.dispose()
    },
    methods: {
        bindGraphResize() {
            window.addEventListener('resize', this.scheduleGraphFit)
            if (window.ResizeObserver && this.$refs.scroll) {
                this.resizeObserver = new window.ResizeObserver(this.scheduleGraphFit)
                this.resizeObserver.observe(this.$refs.scroll)
            }
        },
        scheduleGraphFit() {
            if (this.resizeFrame) window.cancelAnimationFrame(this.resizeFrame)
            this.resizeFrame = window.requestAnimationFrame(() => {
                this.resizeFrame = 0
                this.fitGraphToViewport()
            })
        },
        fitGraphToViewport() {
            if (!this.graph || !this.$refs.scroll) return
            const availableWidth = Math.floor(this.$refs.scroll.clientWidth)
            if (availableWidth <= 0) return

            // 只按容器宽度适配，确保图谱左右边缘与页面内容对齐。
            // 高度随比例自然延伸，避免为了塞进一屏再次缩小文字。
            const scale = Math.min(1, availableWidth / GRAPH_WIDTH)
            const width = Math.floor(GRAPH_WIDTH * scale)
            const height = Math.floor(GRAPH_HEIGHT * scale)
            this.canvasWidth = width
            this.canvasHeight = height
            this.graph.resize(width, height)
            this.graph.scale(scale, scale, 0, 0)
        },
        initGraph() {
            this.graph = new Graph({
                container: this.$refs.canvas,
                width: GRAPH_WIDTH,
                height: GRAPH_HEIGHT,
                background: {
                    color: '#fff'
                },
                grid: false,
                panning: false,
                mousewheel: false,
                interacting: {
                    nodeMovable: false,
                    edgeMovable: false,
                    edgeLabelMovable: false,
                    arrowheadMovable: false,
                    vertexMovable: false,
                    vertexAddable: false,
                    vertexDeletable: false
                }
            })

            this.graph.on('node:click', ({ node }) => this.handleNodeClick(node))
            this.graph.on('edge:mouseenter', ({ edge }) => this.handleEdgeEnter(edge))
            this.graph.on('edge:mouseleave', () => this.handleEdgeLeave())
            this.graph.on('edge:click', ({ edge }) => this.handleEdgeClick(edge))
            this.graph.on('blank:click', () => this.clearFocus())
        },
        renderPanorama() {
            this.graph.clearCells()
            this.nodeBounds = {}
            this.addArchitectureColumns()
            this.addModelNodes()
            this.addHierarchyEdges()
            this.addRelationEdges()
        },
        addArchitectureColumns() {
            COLUMN_LAYOUT.forEach(layout => {
                const column = ARCHITECTURE_COLUMNS.find(item => item.key === layout.key)
                if (!column) return
                this.graph.addNode({
                    id: `architecture-column-${layout.key}`,
                    shape: 'rect',
                    x: layout.x,
                    y: 0,
                    width: layout.width,
                    height: GRAPH_HEIGHT,
                    zIndex: 0,
                    attrs: {
                        body: {
                            fill: '#fff',
                            stroke: '#e4eaf2',
                            strokeWidth: 1,
                            rx: 8,
                            ry: 8
                        },
                        label: {
                            text: ''
                        }
                    },
                    data: {
                        kind: 'column'
                    }
                })
                this.graph.addNode({
                    id: `architecture-header-${layout.key}`,
                    shape: 'rect',
                    x: layout.x,
                    y: 0,
                    width: layout.width,
                    height: 50,
                    zIndex: 2,
                    markup: [
                        { tagName: 'rect', selector: 'body' },
                        { tagName: 'path', selector: 'icon' },
                        { tagName: 'text', selector: 'label' }
                    ],
                    attrs: {
                        body: {
                            width: layout.width,
                            height: 50,
                            fill: {
                                type: 'linearGradient',
                                stops: [
                                    { offset: 0, color: layout.headerStart },
                                    { offset: 1, color: layout.headerEnd }
                                ],
                                attrs: {
                                    x1: '0%',
                                    y1: '0%',
                                    x2: '100%',
                                    y2: '100%'
                                }
                            },
                            stroke: 'none',
                            rx: 8,
                            ry: 8
                        },
                        icon: {
                            d: HEADER_ICONS[layout.key],
                            transform: 'translate(16,15) scale(1)',
                            fill: 'none',
                            stroke: '#fff',
                            strokeWidth: 2,
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round'
                        },
                        label: {
                            text: column.title,
                            refX: 46,
                            refY: 0.5,
                            fill: '#fff',
                            fontSize: 18,
                            fontWeight: 600,
                            textAnchor: 'start',
                            textVerticalAnchor: 'middle'
                        }
                    },
                    data: {
                        kind: 'header'
                    }
                })
            })
        },
        addModelNodes() {
            COLUMN_LAYOUT.forEach(layout => {
                const column = ARCHITECTURE_COLUMNS.find(item => item.key === layout.key)
                if (!column) return
                column.models.forEach((model, modelIndex) => {
                    const x = layout.modelX[modelIndex]
                    const elementY = layout.key === 'business' ? BUSINESS_ELEMENT_Y : ELEMENT_Y
                    const modelTitleData = {
                        kind: 'model-title',
                        routeName: model.routeName
                    }
                    if (layout.key === 'business') {
                        const lastRowIndex = Math.max(model.chain.length - 1, 0)
                        const cardBottom = elementY[lastRowIndex] + ELEMENT_HEIGHT + 20
                        this.graph.addNode({
                            id: `architecture-model-card-${layout.key}-${modelIndex}`,
                            shape: 'rect',
                            x: x - 10,
                            y: 70,
                            width: ELEMENT_WIDTH + 20,
                            height: cardBottom - 70,
                            zIndex: 1,
                            attrs: {
                                body: {
                                    fill: '#fff',
                                    stroke: '#d9e6f7',
                                    strokeWidth: 1,
                                    rx: 8,
                                    ry: 8
                                },
                                label: {
                                    text: ''
                                }
                            },
                            data: {
                                kind: 'model-card'
                            }
                        })
                    }
                    this.graph.addNode({
                        id: `architecture-model-title-${layout.key}-${modelIndex}`,
                        shape: 'rect',
                        x: x - 10,
                        y: MODEL_TITLE_Y,
                        width: ELEMENT_WIDTH + 20,
                        height: MODEL_TITLE_HEIGHT,
                        zIndex: 8,
                        attrs: {
                            body: {
                                fill: '#f5f5f5',
                                stroke: 'none',
                                rx: 4,
                                ry: 4,
                                cursor: model.routeName ? 'pointer' : 'default'
                            },
                            label: {
                                text: '',
                                cursor: model.routeName ? 'pointer' : 'default'
                            }
                        },
                        data: modelTitleData
                    })
                    this.graph.addNode({
                        id: `architecture-model-tag-${layout.key}-${modelIndex}`,
                        shape: 'rect',
                        x,
                        y: MODEL_TITLE_Y + 10,
                        width: Math.max(58, model.name.length * 13 + 18),
                        height: 22,
                        zIndex: 9,
                        attrs: {
                            body: {
                                fill: layout.fill,
                                stroke: layout.stroke,
                                strokeWidth: 1,
                                rx: 8,
                                ry: 8,
                                cursor: model.routeName ? 'pointer' : 'default'
                            },
                            label: {
                                text: model.name,
                                fill: layout.text,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: model.routeName ? 'pointer' : 'default'
                            }
                        },
                        data: modelTitleData
                    })
                    this.graph.addNode({
                        id: `architecture-model-go-${layout.key}-${modelIndex}`,
                        shape: 'rect',
                        x: x + ELEMENT_WIDTH - 24,
                        y: MODEL_TITLE_Y + 8,
                        width: 24,
                        height: 26,
                        zIndex: 9,
                        attrs: {
                            body: {
                                fill: 'transparent',
                                stroke: 'none',
                                cursor: model.routeName ? 'pointer' : 'default'
                            },
                            label: {
                                text: '›',
                                fill: '#aaa',
                                fontSize: 22,
                                fontWeight: 400,
                                cursor: model.routeName ? 'pointer' : 'default'
                            }
                        },
                        data: modelTitleData
                    })
                    model.chain.forEach((element, rowIndex) => {
                        const bounds = {
                            x,
                            y: elementY[rowIndex],
                            width: ELEMENT_WIDTH,
                            height: ELEMENT_HEIGHT
                        }
                        this.nodeBounds[element.id] = bounds
                        this.graph.addNode({
                            id: this.elementCellId(element.id),
                            shape: 'rect',
                            ...bounds,
                            zIndex: 10,
                            markup: [
                                {
                                    tagName: 'g',
                                    className: 'architecture-element-content',
                                    children: [
                                        { tagName: 'rect', selector: 'body' },
                                        { tagName: 'text', selector: 'label' }
                                    ]
                                }
                            ],
                            attrs: {
                                body: {
                                    fill: layout.fill,
                                    stroke: layout.stroke,
                                    strokeWidth: 1,
                                    rx: 6,
                                    ry: 6,
                                    cursor: 'pointer'
                                },
                                label: {
                                    text: element.label,
                                    fill: layout.text,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }
                            },
                            data: {
                                kind: 'element',
                                semanticId: element.id,
                                originalStroke: layout.stroke
                            }
                        })
                    })
                })
            })
        },
        addHierarchyEdges() {
            ARCHITECTURE_COLUMNS.forEach(column => {
                column.models.forEach(model => {
                    model.chain.forEach((element, index) => {
                        if (index >= model.chain.length - 1) return
                        const next = model.chain[index + 1]
                        if (element.id === 'deployment.cluster' && next.id === 'deployment.node') return
                        const source = this.nodePoint(element.id, 'bottom')
                        const target = this.nodePoint(next.id, 'top')
                        this.graph.addEdge({
                            id: `architecture-hierarchy-${element.id}`,
                            zIndex: 4,
                            source,
                            target,
                            attrs: {
                                line: {
                                    stroke: '#aaa',
                                    strokeWidth: 1,
                                    targetMarker: {
                                        name: 'classic',
                                        size: 6,
                                        fill: '#aaa',
                                        stroke: '#aaa'
                                    }
                                }
                            },
                            data: {
                                kind: 'hierarchy'
                            }
                        })
                    })
                })
            })
        },
        addRelationEdges() {
            ARCHITECTURE_RELATIONS.forEach(relation => {
                const route = this.relationRoute(relation.id)
                if (!route) return
                const color = '#202020'
                this.graph.addEdge({
                    id: `architecture-relation-${relation.id}`,
                    zIndex: 6,
                    source: route.source,
                    target: route.target,
                    vertices: route.vertices || [],
                    connector: 'normal',
                    attrs: {
                        line: {
                            stroke: color,
                            strokeWidth: 1.2,
                            strokeOpacity: 0.84,
                            strokeDasharray: relation.type === 'access' ? '9 7' : '',
                            sourceMarker: null,
                            targetMarker: this.relationMarker(relation.type, color)
                        }
                    },
                    data: {
                        kind: 'relation',
                        relation
                    }
                })
            })
        },
        relationRoute(relationId) {
            // 应用右侧关系走廊由内向外固定为 1260 / 1280 / 1300 / 1320，
            // 对应参考图中的嵌套回路线，避免相邻关系交换通道后产生交叉。
            if (relationId === 'product-process') {
                const source = this.nodePoint('business.product.component', 'right')
                const target = this.nodePoint('business.process.segment', 'left')
                return {
                    source,
                    target,
                    vertices: [
                        { x: 238, y: source.y },
                        { x: 238, y: target.y }
                    ]
                }
            }
            if (relationId === 'process-capability') {
                return {
                    source: this.nodePoint('business.process.segment', 'right'),
                    target: this.nodePoint('business.capability.function', 'left')
                }
            }
            if (relationId === 'application-data') {
                return {
                    source: this.nodePoint('application.application', 'left'),
                    target: this.nodePoint('data.entity', 'right')
                }
            }
            if (relationId === 'application-capability') {
                const source = this.nodePoint('application.application', 'left', 0.72)
                const target = this.nodePoint('business.capability.function', 'right')
                return {
                    source,
                    target,
                    vertices: [
                        { x: 1020, y: source.y },
                        { x: 1020, y: 550 },
                        { x: 750, y: 550 },
                        { x: 750, y: target.y }
                    ]
                }
            }
            if (relationId === 'deployment-application') {
                const source = this.nodePoint('deployment.cluster', 'left')
                const target = this.nodePoint('application.application', 'right', 0.2)
                return {
                    source,
                    target,
                    vertices: [
                        { x: 1320, y: source.y },
                        { x: 1320, y: target.y }
                    ]
                }
            }
            if (relationId === 'technology-application') {
                const source = this.nodePoint('technology.stack', 'left')
                const target = this.nodePoint('application.application', 'right', 0.45)
                return {
                    source,
                    target,
                    vertices: [
                        { x: 1550, y: source.y },
                        { x: 1550, y: 650 },
                        { x: 1300, y: 650 },
                        { x: 1300, y: target.y }
                    ]
                }
            }
            if (relationId === 'application-technology-component') {
                const source = this.nodePoint('application.application', 'right', 0.7)
                const target = this.nodePoint('technology.component', 'left')
                return {
                    source,
                    target,
                    vertices: [
                        { x: 1280, y: source.y },
                        { x: 1280, y: 690 },
                        { x: 1570, y: 690 },
                        { x: 1570, y: target.y }
                    ]
                }
            }
            if (relationId === 'logical-device-application') {
                const source = this.nodePoint('technology.logicalDevice', 'right')
                const app = this.nodeBounds['application.application']
                const target = {
                    x: app.x + app.width * 0.75,
                    y: app.y + app.height
                }
                return {
                    source,
                    target,
                    vertices: [
                        { x: 1797, y: source.y },
                        { x: 1797, y: 730 },
                        { x: 1260, y: 730 },
                        { x: 1260, y: 330 },
                        { x: target.x, y: 330 }
                    ]
                }
            }
            if (relationId === 'node-cluster') {
                return {
                    source: this.nodePoint('deployment.node', 'top'),
                    target: this.nodePoint('deployment.cluster', 'bottom')
                }
            }
            return null
        },
        relationMarker(type, color) {
            if (type === 'realization') {
                return {
                    name: 'block',
                    size: 10,
                    fill: '#fff',
                    stroke: color,
                    strokeWidth: 1.2
                }
            }
            if (type === 'assignment') {
                return {
                    name: 'path',
                    d: 'M 0 0 L 8 0 L 8 8 L 0 8 Z',
                    refX: 0,
                    refY: 0,
                    fill: color,
                    stroke: color
                }
            }
            if (type === 'composition') {
                return {
                    name: 'diamond',
                    size: 9,
                    fill: color,
                    stroke: color
                }
            }
            return {
                name: 'classic',
                size: 8,
                fill: color,
                stroke: color
            }
        },
        nodePoint(semanticId, side, ratio = 0.5) {
            const bounds = this.nodeBounds[semanticId]
            if (!bounds) return { x: 0, y: 0 }
            if (side === 'left') return { x: bounds.x, y: bounds.y + bounds.height * ratio }
            if (side === 'right') return { x: bounds.x + bounds.width, y: bounds.y + bounds.height * ratio }
            if (side === 'top') return { x: bounds.x + bounds.width * ratio, y: bounds.y }
            return { x: bounds.x + bounds.width * ratio, y: bounds.y + bounds.height }
        },
        elementCellId(semanticId) {
            return `architecture-element-${semanticId}`
        },
        handleNodeClick(node) {
            const data = node.getData() || {}
            if (data.kind === 'model-title' && data.routeName) {
                this.$router.push({ name: data.routeName })
                return
            }
            if (data.kind !== 'element') {
                this.clearFocus()
                return
            }
            this.lockedRelationId = ''
            this.focusedNodeId = this.focusedNodeId === data.semanticId ? '' : data.semanticId
            this.applyRelationFocus()
        },
        handleEdgeEnter(edge) {
            const data = edge.getData() || {}
            if (data.kind !== 'relation' || this.lockedRelationId || this.focusedNodeId) return
            this.applyRelationFocus([data.relation.id])
        },
        handleEdgeLeave() {
            if (!this.lockedRelationId && !this.focusedNodeId) this.applyRelationFocus()
        },
        handleEdgeClick(edge) {
            const data = edge.getData() || {}
            if (data.kind !== 'relation') return
            this.focusedNodeId = ''
            this.lockedRelationId = this.lockedRelationId === data.relation.id ? '' : data.relation.id
            this.applyRelationFocus(this.lockedRelationId ? [this.lockedRelationId] : [])
        },
        clearFocus() {
            this.lockedRelationId = ''
            this.focusedNodeId = ''
            this.applyRelationFocus()
        },
        applyRelationFocus(explicitIds) {
            let activeIds = explicitIds || []
            if (!explicitIds && this.focusedNodeId) {
                activeIds = ARCHITECTURE_RELATIONS
                    .filter(item => item.sourceId === this.focusedNodeId || item.targetId === this.focusedNodeId)
                    .map(item => item.id)
            }
            const hasActive = activeIds.length > 0
            this.graph.getEdges().forEach(edge => {
                const data = edge.getData() || {}
                if (data.kind !== 'relation') return
                const active = activeIds.includes(data.relation.id)
                const color = active ? '#174fbf' : '#202020'
                edge.attr({
                    line: {
                        stroke: color,
                        strokeWidth: active ? 2.4 : 1.2,
                        strokeOpacity: hasActive && !active ? 0.1 : 0.84,
                        strokeDasharray: data.relation.type === 'access' ? '9 7' : '',
                        sourceMarker: null,
                        targetMarker: this.relationMarker(data.relation.type, color)
                    }
                })
            })
            this.graph.getNodes().forEach(node => {
                const data = node.getData() || {}
                if (data.kind !== 'element') return
                const related = hasActive && ARCHITECTURE_RELATIONS.some(item => (
                    activeIds.includes(item.id) && (item.sourceId === data.semanticId || item.targetId === data.semanticId)
                ))
                node.attr('body/stroke', related ? '#2f63db' : data.originalStroke)
                node.attr('body/strokeWidth', related ? 2 : 1)
            })
        }
    }
}
</script>

<style scoped>
.architecture-panorama {
    min-height: calc(100vh - 96px);
    padding: 16px;
    box-sizing: border-box;
    background: #fff;
    color: #262626;
}

.architecture-panorama__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 16px;
}

.architecture-panorama__header h2 {
    margin: 0;
    color: #262626;
    font-size: 22px;
    font-weight: 600;
}

.architecture-panorama__header p {
    margin: 4px 0 0;
    color: #8c8c8c;
    font-size: 14px;
}

.relation-legend {
    display: flex;
    max-width: 720px;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 6px 12px;
    color: #6f7d90;
    font-size: 13px;
}

.relation-legend span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
}

.relation-legend b {
    color: #5b86d6;
    font-size: 16px;
    font-weight: 700;
}

.relation-legend__carrier b {
    display: inline-flex;
    width: 16px;
    height: 16px;
    align-items: center;
    justify-content: center;
    flex: 0 0 16px;
    font-size: 11px;
    line-height: 1;
}

.relation-legend__note {
    color: #45658f;
    font-weight: 600;
}

.architecture-panorama__scroll {
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 8px;
}

.architecture-panorama__canvas {
    width: 1809px;
    height: 790px;
    margin: 0 auto;
    background: #fff;
}

.architecture-panorama__canvas ::v-deep .x6-node[data-cell-id^='architecture-element-'] .architecture-element-content {
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.18s ease;
}

.architecture-panorama__canvas ::v-deep .x6-node[data-cell-id^='architecture-element-']:hover .architecture-element-content {
    transform: translateY(-2px);
}

.architecture-panorama__canvas ::v-deep .x6-node[data-cell-id^='architecture-element-'] .architecture-element-content rect {
    transition: filter 0.18s ease;
}

.architecture-panorama__canvas ::v-deep .x6-node[data-cell-id^='architecture-element-']:hover .architecture-element-content rect {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

@media (max-width: 1200px) {
    .architecture-panorama__header {
        align-items: flex-start;
        flex-direction: column;
    }

    .relation-legend {
        justify-content: flex-start;
    }
}
</style>
