<template>
    <div class="architecture-content">
        <div v-if="content.description" class="architecture-content__description">
            {{ content.description }}
        </div>

        <div
            v-if="content.type === 'capability-tree'"
            ref="capabilityPanel"
            class="capability-tree-panel"
        >
            <div class="capability-tree-toolbar">
                <div class="capability-tree-legend">
                    <span><i class="legend-category" />模块分类</span>
                    <span><i class="legend-module" />模块</span>
                    <span><i class="legend-function" />功能</span>
                </div>
                <div class="capability-tree-controls">
                    <button type="button" title="缩小" @click="zoomCapability(-0.1)">
                        −
                    </button>
                    <span>{{ capabilityZoomPercent }}</span>
                    <button type="button" title="放大" @click="zoomCapability(0.1)">
                        +
                    </button>
                    <button type="button" title="适应画布" @click="fitCapability">
                        <img
                            :src="require('@m/assets/images/refresh-reset.svg')"
                            width="16"
                            height="16"
                            alt=""
                            draggable="false"
                        >
                    </button>
                    <button type="button" title="全屏" @click="toggleCapabilityFullscreen">
                        <i class="el-icon-full-screen" />
                    </button>
                </div>
            </div>
            <div ref="capabilityViewport" class="capability-tree-viewport" />
            <button
                v-if="capabilityFullscreen"
                type="button"
                class="capability-tree-exit"
                @click="toggleCapabilityFullscreen"
            >
                退出全屏
            </button>
        </div>

        <template v-else-if="content.type === 'cards'">
            <div class="architecture-root">{{ content.root }}</div>
            <div class="domain-grid">
                <div v-for="card in content.cards" :key="card.name" class="domain-card">
                    <div class="domain-card__header">
                        <span :class="['domain-card__title', `tone-${card.tone}`]">{{ card.name }}</span>
                    </div>
                    <div class="domain-card__desc">{{ card.desc }}</div>
                    <div class="domain-card__subtitle">一级业务能力</div>
                    <div class="domain-card__items">
                        <div v-for="item in card.items" :key="item.name" class="domain-card__item">
                            <span>{{ item.name }}</span>
                            <div v-if="item.desc" class="domain-card__item-desc">{{ item.desc }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <el-table v-else-if="content.type === 'table'" :data="content.rows">
            <el-table-column
                v-for="column in content.columns"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                min-width="140"
            />
        </el-table>

        <div v-else-if="content.type === 'tables'" class="table-section-list">
            <section v-for="(section, sectionIndex) in content.sections" :key="section.title || sectionIndex">
                <div v-if="section.title" class="table-section__title">{{ section.title }}</div>
                <el-table :data="section.rows">
                    <el-table-column
                        v-for="column in section.columns"
                        :key="column.prop"
                        :prop="column.prop"
                        :label="column.label"
                        min-width="140"
                    />
                </el-table>
            </section>
        </div>

        <div v-else-if="content.type === 'flows'" class="flow-list">
            <div v-for="flow in content.flows" :key="flow.title" class="flow-card">
                <div class="flow-card__title">
                    <span>{{ flow.title }}</span>
                    <span :class="['flow-card__tag', `tone-${flow.tagTone}`]">{{ flow.tag }}</span>
                </div>
                <div
                    v-for="(row, rowIndex) in flow.rows"
                    :key="`${flow.title}-${rowIndex}`"
                    :class="[
                        'flow-row',
                        { 'flow-row--branch': flow.rowArrows && flow.rowArrows[rowIndex] }
                    ]"
                    :style="getFlowRowStyle(rowIndex)"
                >
                    <template v-for="(step, stepIndex) in row">
                        <div :key="`${flow.title}-${rowIndex}-${step.name}`" class="flow-step">
                            <div :class="['flow-node', `tone-${step.tone}`, { 'flow-node--dashed': step.dashed }]">
                                {{ step.name }}
                            </div>
                            <div v-if="step.desc" class="flow-step__desc">{{ step.desc }}</div>
                        </div>
                        <div
                            v-if="stepIndex < row.length - 1"
                            :key="`${flow.title}-${rowIndex}-arrow-${stepIndex}`"
                            class="flow-arrow"
                        >
                            →
                        </div>
                    </template>
                </div>
                <div v-if="flow.note" class="flow-card__note">{{ flow.note }}</div>
            </div>
        </div>

        <div v-else-if="content.type === 'layers'" class="layer-list">
            <template v-for="(layer, index) in content.layers">
                <div :key="layer.title" class="layer-card">
                    <div class="architecture-card__title">
                        <span>{{ layer.title }}</span>
                        <span v-if="layer.tag" class="layer-card__tag">{{ layer.tag }}</span>
                    </div>
                    <div class="layer-card__nodes">
                        <div
                            v-for="node in layer.nodes"
                            :key="getLayerNodeName(node)"
                            :class="[
                                'layer-card__node',
                                `tone-${getLayerNodeTone(node)}`,
                                { 'layer-card__node--clickable': hasLayerNodeDetail(node) }
                            ]"
                            :tabindex="hasLayerNodeDetail(node) ? 0 : null"
                            :role="hasLayerNodeDetail(node) ? 'button' : null"
                            @click="openLayerNode(node)"
                            @keydown.enter.prevent="openLayerNode(node)"
                            @keydown.space.prevent="openLayerNode(node)"
                        >
                            <div>{{ getLayerNodeName(node) }}</div>
                            <div v-if="getLayerNodeDesc(node)" class="layer-card__node-desc">
                                {{ getLayerNodeDesc(node) }}
                            </div>
                        </div>
                    </div>
                </div>
                <i v-if="index < content.layers.length - 1" :key="`${layer.title}-arrow`" class="el-icon-bottom layer-arrow" />
            </template>
            <el-table v-if="content.table" :data="content.table.rows">
                <el-table-column
                    v-for="column in content.table.columns"
                    :key="column.prop"
                    :prop="column.prop"
                    :label="column.label"
                    min-width="140"
                />
            </el-table>
        </div>

        <div v-else-if="content.type === 'centers'" class="deployment">
            <div class="deployment__root">{{ content.root }}</div>
            <div class="deployment__connector" />
            <div class="deployment__centers">
                <div v-for="center in content.centers" :key="center.title" class="deployment__center-wrap">
                    <div :class="['deployment__center', { active: center.active }]">
                        <div class="deployment__center-title">{{ center.title }}</div>
                        <div class="deployment__tag-wrap">
                            <span :class="['deployment__tag', `tone-${center.tagTone}`]">{{ center.tag }}</span>
                        </div>
                        <div class="deployment__items">
                            <div v-for="item in center.items" :key="item.name" class="deployment__item">
                                <i :style="{ background: item.color }" />{{ item.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="deployment__connector" />
            <div class="deployment__footer">
                <span>数据同步 / 容灾切换</span> · {{ content.footer }}
            </div>
        </div>

        <transition name="node-drawer">
            <div v-if="selectedNode" class="node-drawer-mask" @click.self="selectedNode = null">
                <aside class="node-drawer" role="dialog" aria-modal="true" aria-label="技术节点详情">
                    <div class="node-drawer__header">
                        <div class="node-drawer__title">技术节点详情</div>
                        <button type="button" class="node-drawer__close" aria-label="关闭" @click="selectedNode = null">×</button>
                    </div>
                    <div class="node-drawer__body">
                        <div class="node-detail-row">
                            <div class="node-detail-label">当前节点名称</div>
                            <div class="node-detail-value">{{ selectedNode.name }}</div>
                        </div>
                        <div class="node-detail-row">
                            <div class="node-detail-label">所在架构层次</div>
                            <div class="node-detail-value">{{ selectedNode.layer }}</div>
                        </div>
                        <div class="node-detail-row">
                            <div class="node-detail-label">职责</div>
                            <div class="node-detail-value">{{ selectedNode.duty }}</div>
                        </div>
                    </div>
                </aside>
            </div>
        </transition>
    </div>
</template>

<script>
import G6 from '@antv/g6'

export default {
    name: 'ArchitectureContent',
    props: {
        content: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            selectedNode: null,
            capabilityZoom: 0.9,
            capabilityFullscreen: false
        }
    },
    computed: {
        capabilityZoomPercent() {
            return `${Math.round(this.capabilityZoom * 100)}%`
        }
    },
    watch: {
        content: {
            immediate: true,
            handler(content) {
                if (content.type === 'capability-tree') {
                    this.$nextTick(this.renderCapabilityGraph)
                } else {
                    this.destroyCapabilityGraph()
                }
            }
        }
    },
    created() {
        this.capabilityGraph = null
    },
    mounted() {
        document.addEventListener('fullscreenchange', this.syncCapabilityFullscreen)
        window.addEventListener('resize', this.resizeCapabilityGraph)
    },
    beforeDestroy() {
        document.removeEventListener('fullscreenchange', this.syncCapabilityFullscreen)
        window.removeEventListener('resize', this.resizeCapabilityGraph)
        this.destroyCapabilityGraph()
    },
    methods: {
        buildCapabilityGraphData() {
            const modules = this.content.modules || []
            const columnWidth = 210
            const canvasWidth = Math.max(1660, modules.length * columnWidth + 120)
            const rootX = canvasWidth / 2
            const rootY = 54
            const busY = 112
            const moduleY = 166
            const functionStartY = 258
            const functionGap = 58
            const firstModuleX = (canvasWidth - (modules.length - 1) * columnWidth) / 2
            const nodes = [{
                id: 'capability-root',
                x: rootX,
                y: rootY,
                label: this.content.root,
                type: 'rect',
                size: [190, 68],
                anchorPoints: [[0.5, 0], [0.5, 1]],
                style: {
                    radius: 10,
                    fill: '#2b5fd7',
                    stroke: '#2b5fd7',
                    lineWidth: 1,
                    shadowColor: 'rgba(43, 95, 215, 0.24)',
                    shadowBlur: 14
                },
                labelCfg: {
                    style: {
                        fill: '#fff',
                        fontSize: 16,
                        fontWeight: 700
                    }
                }
            }]
            const edges = []
            const busNodeIds = []

            modules.forEach((module, moduleIndex) => {
                const moduleId = `capability-module-${moduleIndex}`
                const busNodeId = `capability-bus-${moduleIndex}`
                const moduleX = firstModuleX + moduleIndex * columnWidth
                busNodeIds.push(busNodeId)
                nodes.push({
                    id: busNodeId,
                    x: moduleX,
                    y: busY,
                    type: 'circle',
                    size: 1,
                    style: {
                        fill: 'transparent',
                        stroke: 'transparent',
                        opacity: 0
                    }
                })
                nodes.push({
                    id: moduleId,
                    x: moduleX,
                    y: moduleY,
                    label: module.name,
                    type: 'rect',
                    size: [190, 54],
                    anchorPoints: [[0.5, 0], [0.5, 1]],
                    style: {
                        radius: 8,
                        fill: '#eaf3ff',
                        stroke: '#75a9ea',
                        lineWidth: 1
                    },
                    labelCfg: {
                        style: {
                            fill: '#2457a6',
                            fontSize: 13,
                            fontWeight: 700
                        }
                    }
                })
                edges.push({
                    id: `capability-edge-bus-${moduleIndex}`,
                    source: busNodeId,
                    target: moduleId,
                    type: 'line',
                    targetAnchor: 0
                })

                let previousId = moduleId
                module.items.forEach((item, itemIndex) => {
                    const functionId = `capability-function-${moduleIndex}-${itemIndex}`
                    nodes.push({
                        id: functionId,
                        x: moduleX,
                        y: functionStartY + itemIndex * functionGap,
                        label: item.name,
                        type: 'rect',
                        size: [190, 44],
                        anchorPoints: [[0.5, 0], [0.5, 1]],
                        style: {
                            radius: 7,
                            fill: '#f5f9ff',
                            stroke: '#c9dcf5',
                            lineWidth: 1
                        },
                        labelCfg: {
                            style: {
                                fill: '#415a7c',
                                fontSize: 11
                            }
                        }
                    })
                    edges.push({
                        id: `capability-edge-${moduleIndex}-${itemIndex}`,
                        source: previousId,
                        target: functionId,
                        type: 'line',
                        sourceAnchor: 1,
                        targetAnchor: 0
                    })
                    previousId = functionId
                })
            })

            if (busNodeIds.length) {
                const centerBusNodeId = busNodeIds[Math.floor(busNodeIds.length / 2)]
                edges.push({
                    id: 'capability-edge-root-bus',
                    source: 'capability-root',
                    target: centerBusNodeId,
                    type: 'line',
                    sourceAnchor: 1
                })
                edges.push({
                    id: 'capability-edge-main-bus',
                    source: busNodeIds[0],
                    target: busNodeIds[busNodeIds.length - 1],
                    type: 'line'
                })
            }

            return { nodes, edges }
        },
        renderCapabilityGraph() {
            const viewport = this.$refs.capabilityViewport
            if (!viewport || !viewport.clientWidth || !viewport.clientHeight) return
            this.destroyCapabilityGraph()
            const graph = new G6.Graph({
                container: viewport,
                width: viewport.clientWidth,
                height: viewport.clientHeight,
                renderer: 'svg',
                minZoom: 0.35,
                maxZoom: 2.2,
                fitView: true,
                fitViewPadding: 28,
                modes: {
                    default: [
                        {
                            type: 'drag-canvas',
                            allowDragOnItem: true,
                            scalableRange: 0.5
                        },
                        {
                            type: 'zoom-canvas',
                            minZoom: 0.35,
                            maxZoom: 2.2
                        }
                    ]
                },
                defaultEdge: {
                    type: 'line',
                    style: {
                        stroke: '#aebbd0',
                        lineWidth: 1.5,
                        radius: 8,
                        offset: 16
                    }
                }
            })
            graph.data(this.buildCapabilityGraphData())
            graph.on('viewportchange', () => {
                this.capabilityZoom = graph.getZoom()
            })
            graph.render()
            this.capabilityGraph = graph
            this.fitCapability()
        },
        destroyCapabilityGraph() {
            if (this.capabilityGraph && !this.capabilityGraph.get('destroyed')) {
                this.capabilityGraph.destroy()
            }
            this.capabilityGraph = null
        },
        zoomCapability(delta) {
            const graph = this.capabilityGraph
            const viewport = this.$refs.capabilityViewport
            if (!graph || !viewport) return
            const zoom = Math.max(0.35, Math.min(2.2, graph.getZoom() + delta))
            graph.zoomTo(zoom, {
                x: viewport.clientWidth / 2,
                y: viewport.clientHeight / 2
            })
            this.capabilityZoom = graph.getZoom()
        },
        fitCapability() {
            const graph = this.capabilityGraph
            const viewport = this.$refs.capabilityViewport
            if (!graph || !viewport) return
            graph.changeSize(viewport.clientWidth, viewport.clientHeight)
            graph.fitView(28)
            if (graph.getZoom() > 1) {
                graph.zoomTo(1)
                graph.fitCenter()
            }
            this.capabilityZoom = graph.getZoom()
        },
        resizeCapabilityGraph() {
            const graph = this.capabilityGraph
            const viewport = this.$refs.capabilityViewport
            if (!graph || !viewport || !viewport.clientWidth || !viewport.clientHeight) return
            graph.changeSize(viewport.clientWidth, viewport.clientHeight)
        },
        toggleCapabilityFullscreen() {
            const panel = this.$refs.capabilityPanel
            if (!panel) return
            if (document.fullscreenElement) {
                document.exitFullscreen()
            } else if (panel.requestFullscreen) {
                panel.requestFullscreen()
            }
        },
        syncCapabilityFullscreen() {
            this.capabilityFullscreen = document.fullscreenElement === this.$refs.capabilityPanel
            this.$nextTick(() => window.setTimeout(this.fitCapability, 0))
        },
        getFlowRowStyle(rowIndex) {
            if (!rowIndex) return {}
            return {
                paddingLeft: `${60 + (rowIndex - 1) * 30}px`
            }
        },
        getLayerNodeName(node) {
            return typeof node === 'string' ? node : node.name
        },
        getLayerNodeTone(node) {
            return typeof node === 'string' ? 'blue' : (node.tone || 'blue')
        },
        getLayerNodeDesc(node) {
            return typeof node === 'string' ? '' : node.desc
        },
        hasLayerNodeDetail(node) {
            return typeof node !== 'string' && Boolean(node.detail)
        },
        openLayerNode(node) {
            if (this.hasLayerNodeDetail(node)) {
                this.selectedNode = node.detail
            }
        }
    }
}
</script>

<style scoped>
.architecture-content__description {
    padding: 12px 16px;
    margin-bottom: 16px;
    border-left: 3px solid #2b5fd7;
    border-radius: 6px;
    background: rgba(43, 95, 215, 0.06);
    color: #8c8c8c;
    font-size: 13px;
    line-height: 1.7;
}

.capability-tree-panel {
    position: relative;
    border: 1px solid #e2e8f1;
    border-radius: 10px;
    background: #f5f7fa;
    overflow: hidden;
}

.capability-tree-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 10px 14px;
    border-bottom: 1px solid #e2e8f1;
    background: #fff;
}

.capability-tree-legend {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #6d7b8f;
    font-size: 12px;
}

.capability-tree-legend span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.capability-tree-legend i {
    width: 10px;
    height: 10px;
    border-radius: 3px;
}

.legend-category { background: #2b5fd7; }
.legend-module { background: #75a9ea; }
.legend-function { background: #dceafa; }

.capability-tree-controls {
    display: flex;
    align-items: center;
    gap: 8px;
}

.capability-tree-controls button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 30px;
    padding: 0;
    border: 1px solid #d9e1ec;
    border-radius: 5px;
    background: #fff;
    color: #627086;
    cursor: pointer;
}

.capability-tree-controls button:hover {
    border-color: #2b5fd7;
    color: #2b5fd7;
}

.capability-tree-controls span {
    width: 50px;
    color: #627086;
    font-size: 12px;
    text-align: center;
}

.capability-tree-viewport {
    position: relative;
    height: calc(100vh - 330px);
    min-height: 430px;
    cursor: grab;
    overflow: hidden;
    user-select: none;
}

.capability-tree-viewport ::v-deep svg {
    cursor: grab;
}

.capability-tree-viewport ::v-deep svg:active {
    cursor: grabbing;
}

.capability-tree-panel:fullscreen {
    background: #f5f7fa;
}

.capability-tree-panel:fullscreen .capability-tree-viewport {
    height: calc(100vh - 54px);
}

.capability-tree-exit {
    position: absolute;
    z-index: 3;
    top: 64px;
    right: 16px;
    padding: 7px 12px;
    border: 0;
    border-radius: 5px;
    background: rgba(39, 49, 66, 0.82);
    color: #fff;
    cursor: pointer;
}

.architecture-root,
.deployment__root {
    width: fit-content;
    padding: 12px 32px;
    margin: 0 auto;
    border-radius: 8px;
    background: linear-gradient(135deg, #2b5fd7, #5b8ee6);
    box-shadow: 0 4px 12px rgba(43, 95, 215, 0.3);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
}

.domain-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin-top: 20px;
}

.domain-card,
.layer-card {
    padding: 16px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    background: #fff;
}

.domain-card {
    transition: all 0.2s;
}

.domain-card:hover {
    border-color: #2b5fd7;
    box-shadow: 0 4px 12px rgba(43, 95, 215, 0.1);
}

.architecture-card__title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
    color: #262626;
    font-size: 13px;
    font-weight: 600;
}

.domain-card__title {
    display: inline-block;
    padding: 1px 8px;
    border: 0;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 500;
}

.domain-card__title,
.flow-card__tag,
.deployment__tag {
    border: 1px solid;
}

.tone-blue { border-color: #91d5ff; background: #e8f4fd; color: #1890ff !important; }
.tone-green { border-color: #b7eb8f; background: #f6ffed; color: #52c41a !important; }
.tone-orange { border-color: #ffd591; background: #fff7e6; color: #fa8c16 !important; }
.tone-purple { border-color: #d3adf7; background: #f9f0ff; color: #722ed1 !important; }
.tone-red { border-color: #ffa39e; background: #fff1f0; color: #f5222d !important; }
.tone-cyan { border-color: #87e8de; background: #e6fffb; color: #13c2c2 !important; }
.tone-gray { border-color: #d9d9d9; background: #fafafa; color: #595959 !important; }

.domain-card__header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 10px;
    margin-bottom: 12px;
    border-bottom: 1px solid #e8e8e8;
}

.domain-card__desc {
    padding: 8px 10px;
    margin-bottom: 12px;
    border-radius: 4px;
    background: #fff;
    color: #262626;
    font-size: 12px;
    line-height: 1.6;
}

.domain-card__subtitle {
    display: block;
    margin-bottom: 8px;
    color: #8c8c8c;
    font-size: 11px;
}

.domain-card__items {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.domain-card__item {
    padding: 6px 10px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    background: #fff;
    color: #262626;
    font-size: 12px;
    transition: all 0.2s;
}

.domain-card__item:hover {
    border-color: #2b5fd7;
    background: rgba(43, 95, 215, 0.05);
}

.domain-card__item-desc {
    margin-top: 2px;
    color: #8c8c8c;
    font-size: 10px;
}

.flow-list {
    display: flex;
    flex-direction: column;
}

.layer-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.table-section-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.table-section__title {
    padding: 12px 16px;
    margin-bottom: 16px;
    border-left: 3px solid #2b5fd7;
    border-radius: 6px;
    background: rgba(43, 95, 215, 0.06);
    color: #262626;
    font-size: 13px;
    font-weight: 600;
}

.flow-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    margin-bottom: 12px;
    border: 1px solid #e7ebf1;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(31, 45, 61, 0.035);
}

.flow-card__title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    color: #262626;
    font-size: 13px;
    font-weight: 600;
}

.flow-card__tag {
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 400;
}

.flow-row {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    row-gap: 16px;
    padding: 16px 0;
    box-sizing: border-box;
}

.flow-row--branch {
    position: relative;
    padding-top: 8px;
    padding-bottom: 8px;
}

.flow-row--branch::before {
    content: '↘';
    margin-right: 6px;
    color: #8c8c8c;
    font-size: 18px;
}

.flow-step {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
    min-height: 68px;
}

.flow-node {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    min-width: 80px;
    padding: 8px 14px;
    box-sizing: border-box;
    border: 1px solid #d3adf7;
    border-radius: 6px;
    background: #f9f0ff;
    color: #722ed1;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.35;
    text-align: center;
    transition: all 0.2s;
}

.flow-node.tone-blue { border-color: #91d5ff; }
.flow-node.tone-green { border-color: #b7eb8f; }
.flow-node.tone-orange { border-color: #ffd591; }
.flow-node.tone-purple { border-color: #d3adf7; }
.flow-node.tone-red { border-color: #ffa39e; }
.flow-node.tone-cyan { border-color: #87e8de; }
.flow-node.tone-gray { border-color: #d9d9d9; }

.flow-node:hover {
    transform: scale(1.05);
}

.flow-node--dashed {
    border-style: dashed;
}

.flow-step__desc {
    position: absolute;
    top: 52px;
    left: 50%;
    transform: translateX(-50%);
    color: #8c8c8c;
    font-size: 10px;
    white-space: nowrap;
}

.flow-arrow {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 4px;
    color: #8c8c8c;
    font-size: 18px;
}

.flow-card__note {
    padding-left: 60px;
    margin-top: 8px;
    color: #8c8c8c;
    font-size: 11px;
}

.layer-list {
    align-items: stretch;
}

.layer-card__tag {
    padding: 1px 8px;
    border-radius: 8px;
    background: rgba(43, 95, 215, 0.1);
    color: #2b5fd7;
    font-size: 11px;
    font-weight: 500;
}

.layer-card__nodes {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.layer-card__node {
    flex: 1;
    min-width: 100px;
    padding: 10px 16px;
    border: 1px solid;
    border-radius: 6px;
    font-size: 12px;
    text-align: center;
    transition: all 0.2s;
    cursor: default;
}

.layer-card__node:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.layer-card__node--clickable {
    cursor: pointer;
}

.layer-card__node--clickable:focus {
    outline: 2px solid rgba(43, 95, 215, 0.35);
    outline-offset: 2px;
}

.layer-card__node-desc {
    margin-top: 2px;
    font-size: 11px;
    opacity: 0.8;
}

.layer-arrow {
    align-self: center;
    color: #8c8c8c;
    font-size: 18px;
}

.deployment {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    text-align: center;
}

.deployment__root {
    background: linear-gradient(135deg, #fa541c, #ff7a45);
    box-shadow: 0 4px 12px rgba(250, 84, 28, 0.3);
}

.deployment__connector {
    width: 2px;
    height: 24px;
    margin: 0 auto;
    background: #e8e8e8;
}

.deployment__centers {
    display: flex;
    width: 100%;
    gap: 16px;
    text-align: left;
}

.deployment__center-wrap {
    min-width: 200px;
    flex: 1;
}

.deployment__center {
    padding: 16px;
    margin-top: 24px;
    border: 2px solid #e8e8e8;
    border-radius: 8px;
    background: #fff;
}

.deployment__center.active {
    border: 2px solid #1890ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.deployment__center-title {
    padding-bottom: 8px;
    margin-bottom: 12px;
    border-bottom: 1px solid #e8e8e8;
    color: #262626;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
}

.deployment__tag-wrap {
    margin-bottom: 10px;
    text-align: center;
}

.deployment__tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 11px;
}

.deployment__items {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.deployment__item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 4px;
    background: #fafafa;
    color: #262626;
    font-size: 11px;
}

.deployment__item i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
}

.deployment__footer {
    padding: 10px 24px;
    border: 1px dashed #e8e8e8;
    border-radius: 8px;
    background: #fafafa;
    color: #8c8c8c;
    font-size: 12px;
    text-align: center;
}

.deployment__footer span {
    color: #262626;
    font-weight: 600;
}

.node-drawer-mask {
    position: fixed;
    z-index: 2000;
    inset: 0;
    background: rgba(0, 0, 0, 0.28);
}

.node-drawer {
    position: absolute;
    top: 0;
    right: 0;
    width: min(440px, 92vw);
    height: 100%;
    background: #fff;
    box-shadow: -8px 0 24px rgba(0, 0, 0, 0.14);
}

.node-drawer__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 58px;
    padding: 0 22px;
    border-bottom: 1px solid #e8e8e8;
}

.node-drawer__title {
    color: #262626;
    font-size: 16px;
    font-weight: 600;
}

.node-drawer__close {
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: #8c8c8c;
    cursor: pointer;
    font-size: 24px;
}

.node-drawer__close:hover {
    background: #f5f5f5;
    color: #2b5fd7;
}

.node-drawer__body {
    padding: 24px;
}

.node-detail-row {
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;
}

.node-detail-label {
    margin-bottom: 7px;
    color: #8c8c8c;
    font-size: 12px;
}

.node-detail-value {
    color: #262626;
    font-size: 14px;
    line-height: 1.7;
}

.node-drawer-enter-active,
.node-drawer-leave-active {
    transition: opacity 0.2s;
}

.node-drawer-enter-active .node-drawer,
.node-drawer-leave-active .node-drawer {
    transition: transform 0.2s;
}

.node-drawer-enter,
.node-drawer-leave-to {
    opacity: 0;
}

.node-drawer-enter .node-drawer,
.node-drawer-leave-to .node-drawer {
    transform: translateX(100%);
}

::v-deep .el-table {
    width: 100%;
    margin-bottom: 16px;
    border: 1px solid #e3e8f0;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(31, 45, 61, 0.04);
    color: #262626;
    font-size: 13px;
    overflow: hidden;
}

::v-deep .el-table::before {
    display: none;
}

::v-deep .el-table th {
    padding: 0;
    border-bottom: 1px solid #e3e8f0;
    background: #f7f9fc;
    color: #596579;
    font-weight: 600;
}

::v-deep .el-table th > .cell {
    padding: 12px 14px;
    line-height: 20px;
}

::v-deep .el-table td {
    padding: 0;
    border-bottom: 1px solid #edf0f4;
    background: #fff;
    color: #262626;
    vertical-align: top;
}

::v-deep .el-table td > .cell {
    padding: 11px 14px;
    line-height: 20px;
}

::v-deep .el-table__body tr:last-child td {
    border-bottom: 0;
}

::v-deep .el-table__body tr:hover > td {
    background: #f8fbff !important;
}

@media (max-width: 1000px) {
    .domain-grid {
        grid-template-columns: 1fr;
    }

    .deployment__centers {
        flex-direction: column;
    }

    .deployment__center {
        margin-top: 0;
    }
}
</style>
