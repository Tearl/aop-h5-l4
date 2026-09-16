<template>
    <div class="process-model">
        <aside class="process-model__sidebar">
            <div class="process-model__sidebar-header">
                <div class="process-model__brand">
                    <div class="process-model__brand-icon">流</div>
                    <div class="process-model__brand-title">流程模型</div>
                    <div class="process-model__brand-en">Process Model</div>
                </div>
            </div>
            <div class="process-model__level-tree">
                <template v-for="(level, index) in levels">
                    <button
                        :key="level.key"
                        :class="[
                            'process-model__level',
                            { active: selectedLevel === level.key }
                        ]"
                        type="button"
                        @click="selectLevel(level.key)"
                    >
                        <span
                            class="process-model__level-dot"
                            :style="{ background: level.color }"
                        />
                        <span>{{ level.label }}</span>
                    </button>
                    <div
                        v-if="index < levels.length - 1"
                        :key="`${level.key}-connector`"
                        class="process-model__level-connector"
                    />
                </template>
            </div>
        </aside>

        <main class="process-model__main">
            <header class="process-model__toolbar">
                <div class="process-model__toolbar-heading">
                    <span class="process-model__toolbar-title">流程模型图</span>
                    <span class="process-model__toolbar-path">
                        业务领域 / 价值流 / 关键业务 / 流程段
                    </span>
                </div>
            </header>

            <div
                v-if="selectedLevel === 'biz-domain'"
                v-loading="domainLoading"
                class="process-model__content"
            >
                <h2 class="process-model__content-title">业务领域全景图</h2>
                <section
                    v-for="category in domainData"
                    :key="category.id"
                    class="process-model__domain-section"
                >
                    <div class="process-model__domain-category">
                        <span>{{ category.name }}</span>
                        <small>({{ category.count }})</small>
                    </div>
                    <div class="process-model__domain-items">
                        <button
                            v-for="item in category.items"
                            :key="item.id"
                            :class="[`is-${item.type}`, `depth-${item.depth}`]"
                            type="button"
                            @click="openDomain(item)"
                        >
                            <span>{{ item.name }}</span>
                            <!-- <small>{{ typeMeta[item.type].label }}</small> -->
                        </button>
                    </div>
                </section>
                <div
                    v-if="!domainLoading && !domainData.length"
                    class="process-model__empty large process-model__domain-empty"
                >
                    <span class="process-model__empty-icon">◇</span>
                    <strong>暂无业务领域数据</strong>
                    <small>接口暂未返回业务领域分组</small>
                </div>
            </div>

            <div v-else class="process-model__content">
                <div class="process-model__workspace">
                    <aside class="process-model__tree-panel">
                        <div class="process-model__tree-head">
                            <div class="process-model__tree-title">
                                <span>流程模型树</span>
                                <span class="process-model__tree-count">{{ modelNodes.length }} 个节点</span>
                            </div>
                            <div class="process-model__tree-search">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="m20 20-4-4" />
                                </svg>
                                <input
                                    v-model="treeKeyword"
                                    type="text"
                                    placeholder="搜索流程模型节点"
                                >
                                <button
                                    v-if="treeKeyword"
                                    type="button"
                                    aria-label="清空搜索"
                                    @click="treeKeyword = ''"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div class="process-model__tree-body">
                            <button
                                v-for="row in visibleTreeRows"
                                :key="row.node.id"
                                :class="[
                                    'process-model__tree-row',
                                    { active: selectedNodeId === row.node.id }
                                ]"
                                :style="{ paddingLeft: `${row.depth * 16 + 4}px` }"
                                type="button"
                                @click="selectNode(row.node)"
                            >
                                <span
                                    :class="[
                                        'process-model__tree-toggle',
                                        {
                                            expanded: row.expanded,
                                            empty: !row.hasChildren
                                        }
                                    ]"
                                    @click.stop="toggleNode(row.node)"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="9 6 15 12 9 18" />
                                    </svg>
                                </span>
                                <span
                                    class="process-model__tree-icon"
                                    :style="{ background: typeMeta[row.node.type].color }"
                                >
                                    {{ typeMeta[row.node.type].icon }}
                                </span>
                                <span class="process-model__tree-name">{{ row.node.name }}</span>
                            </button>
                            <div v-if="!visibleTreeRows.length" class="process-model__empty">
                                <span class="process-model__empty-icon">◇</span>
                                <strong>未找到匹配节点</strong>
                                <small>请更换关键词后重试</small>
                            </div>
                        </div>
                    </aside>

                    <section v-if="selectedNode" class="process-model__detail">
                        <div class="process-model__detail-head">
                            <div class="process-model__breadcrumb">{{ selectedPath }}</div>
                            <div class="process-model__detail-title">
                                <span>{{ selectedNode.name }}</span>
                                <span class="process-model__type-tag">{{ selectedMeta.label }}</span>
                            </div>
                            <div class="process-model__tabs">
                                <button
                                    v-for="tab in selectedTabs"
                                    :key="tab.key"
                                    :class="{ active: activeTab === tab.key }"
                                    type="button"
                                    @click="handleDetailTabChange(tab.key)"
                                >
                                    {{ tab.label }}
                                </button>
                            </div>
                        </div>

                        <div
                            :class="[
                                'process-model__detail-body',
                                { 'is-design': activeTab === 'design' }
                            ]"
                        >
                            <div
                                v-if="activeTab === 'design'"
                                class="process-model__card process-model__card--design"
                            >
                                <div
                                    v-if="usesModelDesignFlow"
                                    v-loading="modelDesignFlowLoading"
                                    class="process-model__canvas"
                                >
                                    <process-flow-canvas
                                        v-if="hasModelDesignFlow"
                                        :key="modelDesignFlowCanvasKey"
                                        :data="modelDesignFlowData"
                                    />
                                    <div
                                        v-else-if="!modelDesignFlowLoading"
                                        class="process-model__empty large"
                                    >
                                        <span class="process-model__empty-icon">◇</span>
                                        <strong>暂无流程图</strong>
                                        <small>当前节点尚未配置流程画布</small>
                                    </div>
                                </div>
                                <div
                                    v-else-if="flowNodes.length"
                                    :class="['process-model__canvas', { dragging }]"
                                    @mousedown="startDrag"
                                    @mousemove="dragCanvas"
                                    @mouseup="stopDrag"
                                    @mouseleave="stopDrag"
                                    @wheel.prevent="handleWheel"
                                >
                                    <div
                                        class="process-model__flow-stage"
                                        :style="{ transform: flowTransform }"
                                    >
                                        <div v-if="flowMode === 'value-stream'" class="process-model__flow horizontal">
                                            <template v-for="node in flowNodes">
                                                <div
                                                    v-if="node !== flowNodes[0]"
                                                    :key="`${node.id}-arrow`"
                                                    class="process-model__flow-arrow horizontal"
                                                />
                                                <button
                                                    :key="node.id"
                                                    class="process-model__flow-node primary"
                                                    type="button"
                                                    title="点击查看关键业务详情"
                                                    @click.stop="drawerNode = node"
                                                >
                                                    {{ node.name }}
                                                </button>
                                            </template>
                                        </div>

                                        <div v-else-if="flowMode === 'process-segment'" class="process-model__special-flow">
                                            <div class="process-model__terminal">
                                                <div class="process-model__terminal-top">{{ selectedNode.name }}<br>(R0000)</div>
                                                <div class="process-model__terminal-bottom">开始</div>
                                            </div>
                                            <template v-for="(node, index) in flowNodes">
                                                <div :key="`${node.id}-arrow`" class="process-model__vertical-arrow" />
                                                <button
                                                    :key="node.id"
                                                    class="process-model__component-node"
                                                    type="button"
                                                    title="点击查看节点详情"
                                                    @click.stop="drawerNode = node"
                                                >
                                                    <span class="process-model__component-head">内管基础　(R000{{ index + 1 }})</span>
                                                    <strong>{{ node.name }}</strong>
                                                    <span class="process-model__component-foot">{{ typeMeta[node.type].label }}</span>
                                                </button>
                                            </template>
                                            <div class="process-model__vertical-arrow" />
                                            <div class="process-model__terminal">
                                                <div class="process-model__terminal-top">{{ selectedNode.name }}<br>(R000{{ flowNodes.length + 1 }})</div>
                                                <div class="process-model__terminal-bottom">结束</div>
                                            </div>
                                        </div>

                                        <div v-else class="process-model__simple-flow">
                                            <template v-for="node in flowNodes">
                                                <div
                                                    v-if="node !== flowNodes[0]"
                                                    :key="`${node.id}-arrow`"
                                                    class="process-model__simple-arrow"
                                                />
                                                <button
                                                    :key="node.id"
                                                    class="process-model__simple-node"
                                                    type="button"
                                                    title="点击查看节点详情"
                                                    @click.stop="drawerNode = node"
                                                >
                                                    {{ node.name }}
                                                </button>
                                            </template>
                                        </div>
                                    </div>
                                    <div class="process-model__canvas-tools" @mousedown.stop>
                                        <button type="button" aria-label="缩小" @click="zoomBy(-0.1)">−</button>
                                        <span>{{ zoomPercent }}%</span>
                                        <button type="button" aria-label="放大" @click="zoomBy(0.1)">+</button>
                                        <button type="button" aria-label="重置视图" @click="resetFlow">
                                            <img
                                                :src="require('@m/assets/images/refresh-reset.svg')"
                                                width="16"
                                                height="16"
                                                alt=""
                                                draggable="false"
                                            >
                                        </button>
                                    </div>
                                </div>
                                <div v-else class="process-model__empty large">
                                    <span class="process-model__empty-icon">◇</span>
                                    <strong>暂无流程图</strong>
                                    <small>当前节点尚未配置下级流程节点</small>
                                </div>
                            </div>

                            <div v-else-if="activeTab === 'list'" class="process-model__card">
                                <div class="process-model__card-title">关键业务清单</div>
                                <div class="process-model__list-filter">
                                    <span>关键业务名称</span>
                                    <input
                                        v-model="listKeyword"
                                        type="text"
                                        placeholder="请输入关键业务名称"
                                    >
                                    <button class="primary" type="button">查询</button>
                                    <button type="button" @click="listKeyword = ''">重置</button>
                                </div>
                                <div class="process-model__table-wrap">
                                    <table class="process-model__table">
                                        <thead>
                                            <tr>
                                                <th>关键业务ID</th>
                                                <th>关键业务名称</th>
                                                <th>关键业务描述</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="node in businessRows"
                                                :key="node.id"
                                                @click="selectNode(node)"
                                            >
                                                <td>{{ node.id.toUpperCase() }}</td>
                                                <td class="link">{{ node.name }}</td>
                                                <td>{{ node.desc || '/' }}</td>
                                            </tr>
                                            <tr v-if="!businessRows.length">
                                                <td colspan="3" class="process-model__table-empty">暂无匹配数据</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div v-else class="process-model__card">
                                <div class="process-model__section-title">基本信息</div>
                                <div class="process-model__info-grid">
                                    <div
                                        v-for="row in infoRows"
                                        :key="row.label"
                                        :class="['process-model__info-item', { full: row.full }]"
                                    >
                                        <span>{{ row.label }}</span>
                                        <strong>{{ row.value }}</strong>
                                    </div>
                                </div>

                                <template v-if="selectedNode.type === 'interface' || selectedNode.type === 'service'">
                                    <div class="process-model__section-title">业务规则</div>
                                    <div class="process-model__table-wrap">
                                        <table class="process-model__table">
                                            <thead>
                                                <tr>
                                                    <th>业务规则ID</th>
                                                    <th>业务规则名称</th>
                                                    <th>业务规则类型</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="rule in relatedRules" :key="rule.id">
                                                    <td>{{ rule.id.toUpperCase() }}</td>
                                                    <td class="link">{{ rule.name }}</td>
                                                    <td>自定义规则</td>
                                                </tr>
                                                <tr v-if="!relatedRules.length">
                                                    <td colspan="3" class="process-model__table-empty">暂无数据</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div class="process-model__section-title">
                                        输入参数
                                        <span class="process-model__param-button">查看报文头</span>
                                    </div>
                                    <div class="process-model__table-wrap">
                                        <table class="process-model__table">
                                            <thead>
                                                <tr>
                                                    <th>字段简称</th>
                                                    <th>字段名称</th>
                                                    <th>参数类型</th>
                                                    <th>参数长度</th>
                                                    <th>是否必填</th>
                                                    <th>默认值</th>
                                                    <th>描述</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="row in parameterRows" :key="row[0]">
                                                    <td v-for="(value, index) in row" :key="index">{{ value }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <div
                            v-if="drawerNode"
                            class="process-model__drawer-mask"
                            @click="drawerNode = null"
                        />
                        <aside v-if="drawerNode" class="process-model__drawer">
                            <div class="process-model__drawer-head">
                                <strong>节点详情</strong>
                                <button type="button" aria-label="关闭" @click="drawerNode = null">×</button>
                            </div>
                            <div class="process-model__drawer-body">
                                <div class="process-model__detail-title drawer-title">
                                    <span>{{ drawerNode.name }}</span>
                                    <span class="process-model__type-tag">{{ typeMeta[drawerNode.type].label }}</span>
                                </div>
                                <div class="process-model__info-grid single">
                                    <div
                                        v-for="row in drawerInfoRows"
                                        :key="row.label"
                                        :class="['process-model__info-item', { full: row.full }]"
                                    >
                                        <span>{{ row.label }}</span>
                                        <strong>{{ row.value }}</strong>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </section>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import mixins from '@m/core/mixin'
import ProcessFlowCanvas from './components/ProcessFlowCanvas.vue'
import {
    BUSINESS_DOMAIN_DATA,
    PROCESS_LEVELS,
    PROCESS_TREE_DATA,
    PROCESS_TYPE_META
} from './data'

const clone = value => JSON.parse(JSON.stringify(value))
const freezeIfObject = value => (
    value && typeof value === 'object' ? Object.freeze(value) : value
)

const PARENT_TYPE_MAP = {
    'value-stream': 'biz-domain',
    'key-business': 'value-stream',
    'process-segment': 'key-business',
    interface: 'process-segment',
    service: 'interface',
    'backend-rule': 'service'
}

const PROCESS_NODE_TYPE_MAP = {
    bizDomain: 'biz-domain',
    valueStream: 'value-stream',
    keyBusiness: 'key-business',
    flowSegment: 'process-segment'
}
const MODEL_NODE_TYPES = new Set([
    'biz-domain',
    'value-stream',
    'key-business',
    'process-segment'
])
const FLOW_DESIGN_NODE_TYPES = new Set([
    'value-stream',
    'key-business',
    'process-segment'
])

const buildProcessTreeIndex = nodes => {
    const flattenedNodes = []
    const nodeMap = Object.create(null)
    const modelNodes = []
    const walk = (items, parents = []) => {
        items.forEach(node => {
            const indexedNode = { ...node, parents }
            flattenedNodes.push(indexedNode)
            nodeMap[indexedNode.id] = indexedNode
            if (MODEL_NODE_TYPES.has(indexedNode.type)) {
                modelNodes.push(indexedNode)
            }
            walk(node.children || [], parents.concat(node.id))
        })
    }
    walk(nodes)
    return {
        flattenedNodes: Object.freeze(flattenedNodes),
        nodeMap: Object.freeze(nodeMap),
        modelNodes: Object.freeze(modelNodes)
    }
}

const normalizeProcessTreeNode = (node = {}) => ({
    ...node,
    id: node.nodeId || '',
    name: node.nodeName || '',
    type: PROCESS_NODE_TYPE_MAP[node.nodeType] || node.nodeType || '',
    desc: node.remark || '',
    children: Array.isArray(node.children)
        ? node.children.map(normalizeProcessTreeNode)
        : [],
    relNodes: Array.isArray(node.relNodes) ? node.relNodes : []
})

const normalizeDomainNode = (node = {}, fallbackId = '') => ({
    ...node,
    id: node.domainId || fallbackId,
    name: node.domainName || '未命名业务领域',
    type: 'biz-domain',
    desc: node.domainDesc || '',
    children: []
})

const normalizeDomainGroup = (group = {}, groupIndex = 0) => {
    const children = Array.isArray(group.children)
        ? group.children.map((child, childIndex) => ({
            ...normalizeDomainNode(child, `domain-${groupIndex}-${childIndex}`),
            depth: 1
        }))
        : []
    const hasChildCount = group.childCount !== null
        && group.childCount !== undefined
        && !Number.isNaN(Number(group.childCount))
    const section = {
        ...group,
        id: group.parentDomainId || `domain-group-${groupIndex}`,
        name: group.parentDomainName || '未命名业务领域',
        type: 'domain-group',
        desc: group.parentDomainDesc || '',
        count: hasChildCount ? Number(group.childCount) : children.length,
        items: children
    }

    return { nodes: children, section }
}

export default {
    name: 'ProcessModel',
    mixins: [mixins],
    components: {
        ProcessFlowCanvas
    },
    data() {
        return {
            levels: PROCESS_LEVELS,
            domainData: [],
            domainLoading: false,
            typeMeta: PROCESS_TYPE_META,
            treeData: [],
            flattenedNodeList: [],
            nodeIndex: Object.freeze(Object.create(null)),
            modelNodeList: [],
            processModelTreeRequestId: 0,
            processNodeDetailResponse: null,
            processNodeDetailRequestId: 0,
            modelDesignFlowResponse: null,
            modelDesignFlowLoading: false,
            modelDesignFlowRequestId: 0,
            selectedLevel: 'biz-domain',
            selectedNodeId: '',
            treeKeyword: '',
            listKeyword: '',
            activeTab: 'design',
            expandedNodes: {},
            drawerNode: null,
            zoom: 1,
            panX: 0,
            panY: 0,
            dragging: false,
            dragStartX: 0,
            dragStartY: 0,
            panStartX: 0,
            panStartY: 0
        }
    },
    computed: {
        flattenedNodes() {
            return this.flattenedNodeList
        },
        modelNodes() {
            return this.modelNodeList
        },
        nodeMap() {
            return this.nodeIndex
        },
        selectedNode() {
            return this.nodeMap[this.selectedNodeId] || this.flattenedNodes[0]
        },
        selectedMeta() {
            return this.typeMeta[this.selectedNode.type]
        },
        selectedPath() {
            return this.selectedNode.parents
                .map(id => this.nodeMap[id])
                .filter(Boolean)
                .concat(this.selectedNode)
                .map(node => node.name)
                .join(' / ')
        },
        selectedTabs() {
            if (
                this.selectedNode.type === 'biz-domain'
                || this.selectedNode.type === 'backend-rule'
            ) {
                return [{ key: 'info', label: '基本信息' }]
            }
            if (this.selectedNode.type === 'value-stream') {
                return [
                    { key: 'design', label: '流程设计' },
                    { key: 'list', label: '关键业务清单' },
                    { key: 'info', label: '基本信息' }
                ]
            }
            return [
                { key: 'design', label: '流程设计' },
                { key: 'info', label: '基本信息' }
            ]
        },
        selectedProcessNodeDetail() {
            const response = this.processNodeDetailResponse
            const detail = response && response.body
                ? response.body
                : response
            if (!detail || !this.selectedNode) return null
            const selectedNodeId = this.selectedNode.nodeId || this.selectedNode.id
            return detail.nodeId === selectedNodeId ? detail : null
        },
        visibleTreeRows() {
            const keyword = this.treeKeyword.trim().toLowerCase()
            const rows = []
            const walk = (nodes, depth) => {
                nodes.forEach(node => {
                    const children = node.type === 'process-segment'
                        ? []
                        : (node.children || [])
                    const matches = item => (
                        item.name.toLowerCase().includes(keyword)
                        || (item.type !== 'process-segment' && (item.children || []).some(matches))
                    )
                    if (keyword && !matches(node)) return

                    const expanded = keyword || this.expandedNodes[node.id] === true
                    rows.push({
                        node,
                        depth,
                        expanded,
                        hasChildren: children.length > 0
                    })
                    if (expanded) walk(children, depth + 1)
                })
            }
            walk(this.treeData, 0)
            return rows
        },
        flowNodes() {
            return this.selectedNode.children || []
        },
        usesModelDesignFlow() {
            return FLOW_DESIGN_NODE_TYPES.has(this.selectedNode.type)
        },
        modelDesignFlowData() {
            const response = this.modelDesignFlowResponse
            const result = response && response.body ? response.body : response
            return {
                relObjType: this.selectedNode.type === 'process-segment'
                    ? 'control_point'
                    : 'process',
                flowNodeInfos: result && Array.isArray(result.flowNodeInfos)
                    ? result.flowNodeInfos
                    : [],
                flowInfoRelList: result && Array.isArray(result.flowInfoRelList)
                    ? result.flowInfoRelList
                    : [],
                laneGroupInfoList: result && Array.isArray(result.laneGroupInfoList)
                    ? result.laneGroupInfoList
                    : []
            }
        },
        hasModelDesignFlow() {
            return this.modelDesignFlowData.flowNodeInfos.length > 0
                || this.modelDesignFlowData.laneGroupInfoList.length > 0
        },
        modelDesignFlowCanvasKey() {
            return `${this.selectedNode.id}-${this.modelDesignFlowData.relObjType}`
        },
        flowMode() {
            if (this.selectedNode.type === 'value-stream') return 'value-stream'
            if (this.selectedNode.type === 'process-segment') return 'process-segment'
            return 'simple'
        },
        zoomPercent() {
            return Math.round(this.zoom * 100)
        },
        flowTransform() {
            return `translate(calc(-50% + ${this.panX}px), calc(-50% + ${this.panY}px)) scale(${this.zoom})`
        },
        businessRows() {
            const keyword = this.listKeyword.trim().toLowerCase()
            let rows = (this.selectedNode.children || []).filter(node => node.type === 'key-business')
            if (this.selectedNode.type === 'key-business') rows = [this.selectedNode]
            return rows.filter(node => !keyword || node.name.toLowerCase().includes(keyword))
        },
        infoRows() {
            return this.getInfoRows(
                this.selectedNode,
                this.selectedProcessNodeDetail
            )
        },
        drawerInfoRows() {
            return this.drawerNode ? this.getInfoRows(this.drawerNode) : []
        },
        relatedRules() {
            if (this.selectedNode.type === 'service') {
                return (this.selectedNode.children || []).filter(node => node.type === 'backend-rule')
            }
            if (this.selectedNode.type === 'interface') {
                const service = (this.selectedNode.children || []).find(node => node.type === 'service')
                return service
                    ? (service.children || []).filter(node => node.type === 'backend-rule')
                    : []
            }
            return []
        },
        parameterRows() {
            if (this.selectedNode.type === 'service') {
                return [
                    ['dto', 'dto', 'Object', '/', '否', '/', 'SetAccountDTO'],
                    ['userNo', '企业客户编号', 'String', '/', '否', '/', '/'],
                    ['operNo', '网银操作员编号', 'String', '/', '否', '/', '/'],
                    ['acctList', '企业账户集合', 'List<Object>', '/', '否', '/', '/']
                ]
            }
            return [
                ['ukeyId', 'UKey设备编号', 'String', '30', '否', '/', '标识数字证书存储的硬件设备'],
                ['oldPasswd', '旧密码', 'String', '128', '否', '/', '验证用户原始密码'],
                ['newPassword', '新密码', 'String', '20', '否', '/', '用户设置的新密码'],
                ['newCfmPasswd', '新确认密码', 'String', '/', '否', '/', '与新密码一致性校验']
            ]
        }
    },
    created() {
        this.getBizDomainPanorama()
    },
    methods: {
        replaceTreeData(treeData = []) {
            const normalizedTree = Array.isArray(treeData) ? treeData : []
            const index = buildProcessTreeIndex(normalizedTree)
            this.treeData = Object.freeze(normalizedTree)
            this.flattenedNodeList = index.flattenedNodes
            this.nodeIndex = index.nodeMap
            this.modelNodeList = index.modelNodes
        },
        async getBizDomainPanorama(params = {}) {
            this.domainLoading = true
            try {
                const response = await this.rpc.assetcenter.getBizDomainPanorama(params)
                const result = response && response.body ? response.body : response
                const groups = result && Array.isArray(result.groups)
                    ? result.groups
                    : []
                const normalizedGroups = groups.map(normalizeDomainGroup)
                const treeData = normalizedGroups.reduce(
                    (nodes, group) => nodes.concat(group.nodes),
                    []
                )

                this.replaceTreeData(treeData)
                this.domainData = Object.freeze(
                    normalizedGroups.map(group => group.section)
                )
                this.selectedNodeId = treeData[0] ? treeData[0].id : ''
                this.expandedNodes = {}
                if (this.selectedNodeId) {
                    this.activeTab = this.selectedNode.type === 'biz-domain'
                        ? 'info'
                        : 'design'
                    this.expandLineage(this.selectedNodeId)
                }
            } catch (error) {
                this.replaceTreeData([])
                this.domainData = []
                this.selectedNodeId = ''
                this.expandedNodes = {}
            } finally {
                this.domainLoading = false
            }
        },
        // 保留手动启用 Mock 的入口，接口空数据或失败时不会自动回退。
        loadMockBizDomainPanorama() {
            const treeData = clone(PROCESS_TREE_DATA)
            const mockNodeMap = {}
            const collect = nodes => nodes.forEach(node => {
                mockNodeMap[node.name] = node
                collect(node.children || [])
            })
            collect(treeData)

            this.domainData = Object.freeze(
                BUSINESS_DOMAIN_DATA.map((category, categoryIndex) => ({
                    id: `mock-category-${categoryIndex}`,
                    name: category.name,
                    type: 'biz-domain',
                    count: category.items.length,
                    items: category.items.map((name, itemIndex) => ({
                        ...(mockNodeMap[name] || {}),
                        id: (mockNodeMap[name] && mockNodeMap[name].id)
                            || `mock-domain-${categoryIndex}-${itemIndex}`,
                        name,
                        type: 'biz-domain',
                        depth: 1,
                        children: (mockNodeMap[name] && mockNodeMap[name].children) || []
                    }))
                }))
            )
            this.replaceTreeData(treeData)
            this.selectedNodeId = treeData[0] ? treeData[0].id : ''
            this.expandedNodes = {}
            if (this.selectedNodeId) this.expandLineage(this.selectedNodeId)
        },
        getProcessModelTree(params = {}) {
            return this.rpc.assetcenter.getProcessModelTree(params)
        },
        async loadProcessModelTree(domainId) {
            const requestId = ++this.processModelTreeRequestId
            if (!domainId) return null
            try {
                const response = await this.getProcessModelTree({ domainId })
                if (requestId === this.processModelTreeRequestId) {
                    const result = response && response.body
                        ? response.body
                        : response || {}
                    const treeData = Array.isArray(result.children)
                        ? result.children.map(normalizeProcessTreeNode)
                        : []
                    this.replaceTreeData(treeData)
                    const domainNode = this.nodeIndex[domainId]
                    const levelNode = this.flattenedNodeList.find(
                        node => node.type === this.selectedLevel
                    )
                    // 明确点击业务领域时应保留该领域的选中态，不能再被
                    // 当前层级中的第一条价值流覆盖。
                    const nextSelectedNode = domainNode
                        || levelNode
                        || this.flattenedNodeList[0]
                    this.selectedNodeId = nextSelectedNode ? nextSelectedNode.id : ''
                    if (nextSelectedNode) {
                        this.activeTab = nextSelectedNode.type === 'biz-domain'
                            ? 'info'
                            : 'design'
                    }
                    this.expandedNodes = {}
                    if (this.selectedNodeId) {
                        this.$nextTick(() => {
                            this.expandLineage(this.selectedNodeId)
                        })
                    }
                }
                return response
            } catch (error) {
                return null
            }
        },
        getProcessNodeDetail(params = {}) {
            return this.rpc.assetcenter.getProcessNodeDetail(params)
        },
        getModelDesignFlow(params = {}) {
            return this.rpc.assetcenter.qryModelDesignFlow(params)
        },
        async loadModelDesignFlow(node = this.selectedNode) {
            const requestId = ++this.modelDesignFlowRequestId
            this.modelDesignFlowResponse = null
            this.modelDesignFlowLoading = false
            if (!node || !FLOW_DESIGN_NODE_TYPES.has(node.type)) {
                return null
            }

            const blgObjId = node.nodeId || node.id || ''
            if (!blgObjId) return null

            this.modelDesignFlowLoading = true
            try {
                const response = await this.getModelDesignFlow({
                    blgObjId,
                    relObjType: node.type === 'process-segment'
                        ? 'control_point'
                        : 'process'
                })
                if (requestId === this.modelDesignFlowRequestId) {
                    this.modelDesignFlowResponse = freezeIfObject(response)
                }
                return response
            } catch (error) {
                if (requestId === this.modelDesignFlowRequestId) {
                    this.modelDesignFlowResponse = null
                }
                return null
            } finally {
                if (requestId === this.modelDesignFlowRequestId) {
                    this.modelDesignFlowLoading = false
                }
            }
        },
        async loadProcessNodeDetail(node = this.selectedNode) {
            const requestId = ++this.processNodeDetailRequestId
            this.processNodeDetailResponse = null
            if (!node) return null

            const nodeId = node.nodeId || node.id || ''
            const nodeType = node.nodeType || ''
            if (!nodeId) return null

            try {
                const response = await this.getProcessNodeDetail({
                    nodeId,
                    nodeType
                })
                if (requestId === this.processNodeDetailRequestId) {
                    this.processNodeDetailResponse = response
                }
                return response
            } catch (error) {
                if (requestId === this.processNodeDetailRequestId) {
                    this.processNodeDetailResponse = null
                }
                return null
            }
        },
        handleDetailTabChange(tabKey) {
            this.activeTab = tabKey
            if (tabKey === 'info') {
                this.loadProcessNodeDetail()
            } else if (tabKey === 'design') {
                this.loadModelDesignFlow()
            }
        },
        getInfoRows(node, detail = null) {
            const detailData = detail || {}
            const rows = [
                {
                    label: 'ID',
                    value: detailData.nodeId || node.nodeId || node.id || '/'
                },
                {
                    label: '名称',
                    value: detailData.nodeName || node.nodeName || node.name || '/'
                }
            ]
            const parents = (node.parents || [])
                .map(id => this.nodeMap[id])
                .filter(Boolean)
            const domain = node.type === 'biz-domain'
                ? node
                : parents.find(item => item.type === 'biz-domain')
            const stream = node.type === 'value-stream'
                ? node
                : parents.find(item => item.type === 'value-stream')
            const business = node.type === 'key-business'
                ? node
                : parents.find(item => item.type === 'key-business')
            const parentName = detailData.parentName || ''

            if (node.type !== 'biz-domain' && domain) {
                rows.push({
                    label: '所属业务域',
                    value: node.type === 'value-stream' && parentName
                        ? parentName
                        : domain.name
                })
            }
            if (['key-business', 'process-segment', 'interface', 'service', 'backend-rule'].includes(node.type) && stream) {
                rows.push({
                    label: '所属价值流',
                    value: node.type === 'key-business' && parentName
                        ? parentName
                        : stream.name
                })
            }
            if (['process-segment', 'interface', 'service', 'backend-rule'].includes(node.type) && business) {
                rows.push({
                    label: '所属关键业务',
                    value: node.type === 'process-segment' && parentName
                        ? parentName
                        : business.name
                })
            }
            rows.push(
                { label: '创建人', value: detailData.creatorName || '/' },
                { label: '创建时间', value: detailData.createTime || '/' },
                {
                    label: '描述',
                    value: detailData.description || node.desc || '/',
                    full: true
                }
            )
            return rows
        },
        selectLevel(level) {
            this.selectedLevel = level
            this.treeKeyword = ''
            this.drawerNode = null
            this.resetFlow()
            if (level === 'biz-domain') {
                // 返回业务领域全景后，忽略此前仍在途的流程模型树请求，
                // 避免响应返回时再次恢复价值流选中态。
                this.processModelTreeRequestId += 1
                return
            }

            const targetType = PARENT_TYPE_MAP[level] || 'biz-domain'
            const target = this.flattenedNodes.find(node => node.type === targetType)
            if (target) this.selectNode(target)
        },
        openDomain(item) {
            const node = this.nodeMap[item.id] || item
            if (!node || !node.id) return
            this.selectedLevel = node.type === 'value-stream'
                ? 'key-business'
                : 'value-stream'
            this.selectNode(node)
        },
        selectNode(node) {
            this.processNodeDetailRequestId += 1
            this.processNodeDetailResponse = null
            this.modelDesignFlowRequestId += 1
            this.modelDesignFlowResponse = null
            this.modelDesignFlowLoading = false
            this.selectedNodeId = node.id
            if (node.type === 'biz-domain') {
                this.loadProcessModelTree(node.id)
            }
            this.drawerNode = null
            this.resetFlow()
            this.expandLineage(node.id)
            this.$nextTick(() => {
                const firstTab = this.selectedTabs[0]
                this.activeTab = firstTab.key
                if (this.activeTab === 'design') {
                    this.loadModelDesignFlow(node)
                } else if (this.activeTab === 'info') {
                    this.loadProcessNodeDetail(node)
                }
            })
        },
        expandLineage(nodeId) {
            const node = this.nodeMap[nodeId]
            if (!node) return
            node.parents.concat(node.id).forEach(id => this.$set(this.expandedNodes, id, true))
        },
        toggleNode(node) {
            if (!node.children || !node.children.length) return
            this.$set(this.expandedNodes, node.id, !this.expandedNodes[node.id])
        },
        clampZoom(value) {
            return Math.max(0.4, Math.min(2, Number(value.toFixed(2))))
        },
        zoomBy(delta) {
            this.zoom = this.clampZoom(this.zoom + delta)
        },
        resetFlow() {
            this.zoom = 1
            this.panX = 0
            this.panY = 0
        },
        startDrag(event) {
            if (event.button !== 0) return
            const target = event.target
            if (
                target.closest
                && target.closest(
                    '.process-model__flow-node, .process-model__simple-node, .process-model__component-node, .process-model__canvas-tools'
                )
            ) return
            this.dragging = true
            this.dragStartX = event.clientX
            this.dragStartY = event.clientY
            this.panStartX = this.panX
            this.panStartY = this.panY
            event.preventDefault()
        },
        dragCanvas(event) {
            if (!this.dragging) return
            this.panX = this.panStartX + event.clientX - this.dragStartX
            this.panY = this.panStartY + event.clientY - this.dragStartY
        },
        stopDrag() {
            this.dragging = false
        },
        handleWheel(event) {
            this.zoomBy(event.deltaY > 0 ? -0.08 : 0.08)
        }
    }
}
</script>

<style scoped>
.process-model {
    display: flex;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
    overflow: hidden;
    background: #fff;
    color: #273142;
}

.process-model,
.process-model * {
    scrollbar-color: #b8c5d8 transparent;
    scrollbar-width: thin;
}

.process-model ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.process-model ::-webkit-scrollbar-track {
    background: transparent;
}

.process-model ::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 999px;
    background: #b8c5d8;
    background-clip: content-box;
}

.process-model ::-webkit-scrollbar-thumb:hover {
    background: #8fa0b8;
    background-clip: content-box;
}

.process-model ::-webkit-scrollbar-corner {
    background: transparent;
}

.process-model__sidebar {
    display: flex;
    flex: 0 0 250px;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid #edf0f4;
    background: #fff;
}

.process-model__sidebar-header {
    padding: 30px 24px 28px;
    border-bottom: 1px solid #edf0f4;
}

.process-model__brand {
    text-align: center;
}

.process-model__brand-icon {
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

.process-model__brand-title {
    color: #222b38;
    font-size: 19px;
    font-weight: 700;
}

.process-model__brand-en {
    margin-top: 3px;
    color: #9aa3af;
    font-size: 11px;
}

.process-model__level-tree {
    flex: 1;
    padding: 28px 18px;
    overflow-y: auto;
}

.process-model__level {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 176px;
    min-height: 46px;
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
}

.process-model__level:hover {
    border-color: #8eade5;
    background: #e7effc;
}

.process-model__level.active {
    border-color: #2b5fd7;
    background: #2b5fd7;
    box-shadow: 0 5px 14px rgba(43, 95, 215, 0.22);
    color: #fff;
}

.process-model__level.active .process-model__level-dot {
    background: #fff !important;
}

.process-model__level-dot {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
    border-radius: 50%;
}

.process-model__level-connector {
    position: relative;
    width: 1px;
    height: 28px;
    margin: 0 auto;
    background: #b9c7da;
}

.process-model__level-connector::after {
    position: absolute;
    bottom: -1px;
    left: -4px;
    border-top: 6px solid #b9c7da;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
    content: '';
}

.process-model__main {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    overflow: hidden;
}

.process-model__toolbar {
    display: flex;
    align-items: center;
    min-height: 58px;
    padding: 0 20px;
    border-bottom: 1px solid #e6eaf0;
    background: #fff;
}

.process-model__toolbar-heading {
    display: flex;
    align-items: baseline;
    min-width: 0;
}

.process-model__toolbar-title {
    flex-shrink: 0;
    color: #273142;
    font-size: 15px;
    font-weight: 700;
}

.process-model__toolbar-path {
    margin-left: 10px;
    overflow: hidden;
    color: #98a1ad;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.process-model__content {
    flex: 1;
    min-height: 0;
    box-sizing: border-box;
    padding: 20px;
    overflow: auto;
    background: #f5f7fa;
}

.process-model__content-title {
    margin: 0 0 16px;
    color: #273142;
    font-size: 18px;
}

.process-model__domain-section {
    display: flex;
    align-items: stretch;
    padding: 12px;
    margin-bottom: 12px;
    border: 1px solid #e7ebf2;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(31, 45, 61, 0.04);
}

.process-model__domain-category {
    display: flex;
    width: 160px;
    min-height: 60px;
    flex-shrink: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 10px;
    border: 0;
    border-radius: 6px;
    background: #2b5fd7;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    cursor: default;
    user-select: none;
}

.process-model__domain-category small {
    margin-top: 2px;
    font-size: 12px;
    font-weight: 400;
}

.process-model__domain-items {
    display: flex;
    flex: 1;
    align-content: flex-start;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px 0 8px 16px;
}

.process-model__domain-items button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border: 1px solid transparent;
    border-radius: 4px;
    background: #eef2f7;
    color: #4a5568;
    font-size: 13px;
    cursor: pointer;
}

.process-model__domain-items button small {
    color: #8a96a8;
    font-size: 11px;
}

.process-model__domain-items button.is-value-stream {
    border-color: #d6e4ff;
    background: #f3f7ff;
    color: #2b5fd7;
}

.process-model__domain-items button.depth-2,
.process-model__domain-items button.depth-3 {
    border-style: dashed;
}

.process-model__domain-items button:hover {
    border-color: #2b5fd7;
    background: #2b5fd7;
    color: #fff;
}

.process-model__domain-items button:hover small {
    color: rgba(255, 255, 255, 0.8);
}

.process-model__domain-empty {
    min-height: 320px;
}

.process-model__workspace {
    display: flex;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    border: 1px solid #e5eaf2;
    border-radius: 8px;
    background: #fff;
}

.process-model__tree-panel {
    display: flex;
    width: 286px;
    flex-shrink: 0;
    flex-direction: column;
    border-right: 1px solid #e8ecf2;
    background: #fff;
}

.process-model__tree-head {
    padding: 16px;
    border-bottom: 1px solid #edf0f5;
}

.process-model__tree-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 15px;
    font-weight: 700;
}

.process-model__tree-count {
    padding: 2px 7px;
    border-radius: 10px;
    background: #f3f5f8;
    color: #8c8c8c;
    font-size: 11px;
    font-weight: 400;
}

.process-model__tree-search {
    position: relative;
}

.process-model__tree-search svg {
    position: absolute;
    top: 8px;
    left: 10px;
    color: #a1a8b3;
}

.process-model__tree-search input {
    width: 100%;
    height: 32px;
    box-sizing: border-box;
    padding: 0 30px 0 32px;
    border: 1px solid #dfe4ec;
    border-radius: 5px;
    outline: none;
    font-size: 12px;
}

.process-model__tree-search input:focus {
    border-color: #2b5fd7;
    box-shadow: 0 0 0 2px rgba(43, 95, 215, 0.08);
}

.process-model__tree-search button {
    position: absolute;
    top: 5px;
    right: 7px;
    border: 0;
    background: transparent;
    color: #a1a8b3;
    font-size: 17px;
    cursor: pointer;
}

.process-model__tree-body {
    flex: 1;
    padding: 10px 8px 20px;
    overflow: auto;
}

.process-model__tree-row {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 34px;
    box-sizing: border-box;
    padding-right: 8px;
    overflow: hidden;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: #4a5568;
    font-size: 12px;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
}

.process-model__tree-row:hover {
    background: #f4f7fc;
    color: #2b5fd7;
}

.process-model__tree-row.active {
    background: #eaf1ff;
    color: #2b5fd7;
    font-weight: 600;
}

.process-model__tree-toggle {
    display: flex;
    width: 18px;
    height: 24px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    color: #87909d;
}

.process-model__tree-toggle svg {
    transition: transform 0.15s;
}

.process-model__tree-toggle.expanded svg {
    transform: rotate(90deg);
}

.process-model__tree-toggle.empty {
    opacity: 0;
}

.process-model__tree-icon {
    display: inline-flex;
    min-width: 42px;
    height: 22px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    margin-right: 7px;
    border-radius: 5px;
    color: #fff;
    font-size: 10px;
    font-weight: 600;
}

.process-model__tree-name {
    overflow: hidden;
    text-overflow: ellipsis;
}

.process-model__detail {
    position: relative;
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    overflow: hidden;
    background: #f6f8fb;
}

.process-model__detail-head {
    padding: 16px 20px 0;
    border-bottom: 1px solid #e8ecf2;
    background: #fff;
}

.process-model__breadcrumb {
    margin-bottom: 10px;
    color: #8c8c8c;
    font-size: 12px;
}

.process-model__detail-title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #1f2937;
    font-size: 18px;
    font-weight: 700;
}

.process-model__type-tag {
    padding: 2px 8px;
    border: 1px solid #d4e2ff;
    border-radius: 3px;
    background: #edf3ff;
    color: #2b5fd7;
    font-size: 11px;
    font-weight: 500;
}

.process-model__tabs {
    display: flex;
    gap: 28px;
    margin-top: 14px;
}

.process-model__tabs button {
    position: relative;
    padding: 0 2px 12px;
    border: 0;
    background: transparent;
    color: #697386;
    font-size: 13px;
    cursor: pointer;
}

.process-model__tabs button.active {
    color: #2b5fd7;
    font-weight: 600;
}

.process-model__tabs button.active::after {
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;
    height: 2px;
    background: #2b5fd7;
    content: '';
}

.process-model__detail-body {
    display: flex;
    flex: 1;
    min-height: 0;
    padding: 18px 20px;
    overflow: auto;
}

.process-model__detail-body.is-design {
    padding: 8px 0 0;
    overflow: hidden;
}

.process-model__card {
    width: 100%;
    box-sizing: border-box;
    padding: 18px;
    border: 1px solid #e6eaf0;
    border-radius: 7px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(31, 45, 61, 0.03);
}

.process-model__card--design {
    display: flex;
    min-height: 0;
    flex: 1;
    padding: 0;
    overflow: hidden;
}

.process-model__card--design > .process-model__empty {
    width: 100%;
    min-height: 0;
    flex: 1;
}

.process-model__card-title {
    margin-bottom: 16px;
    color: #303846;
    font-size: 14px;
    font-weight: 700;
}

.process-model__canvas {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 0;
    flex: 1;
    overflow: hidden;
    background-color: #f8fafc;
    background-image: radial-gradient(#d9dee8 1px, transparent 1px);
    background-size: 16px 16px;
    cursor: grab;
    user-select: none;
}

.process-model__canvas.dragging {
    cursor: grabbing;
}

.process-model__flow-stage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: center;
}

.process-model__flow {
    display: flex;
    min-width: 260px;
    flex-direction: column;
    align-items: center;
}

.process-model__flow.horizontal {
    min-width: max-content;
    flex-direction: row;
}

.process-model__flow-arrow {
    position: relative;
    width: 2px;
    height: 38px;
    flex-shrink: 0;
    background: #88a0bd;
}

.process-model__flow-arrow::after {
    position: absolute;
    bottom: -1px;
    left: -5px;
    border-top: 8px solid #88a0bd;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    content: '';
}

.process-model__flow-arrow.horizontal {
    width: 54px;
    height: 1px;
}

.process-model__flow-arrow.horizontal::after {
    top: -4px;
    right: -1px;
    bottom: auto;
    left: auto;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 7px solid #88a0bd;
    border-right: 0;
}

.process-model__flow-node {
    display: flex;
    width: 230px;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.process-model__flow-node.terminal {
    min-height: 58px;
    padding: 8px 22px;
    border: 2px solid #3988f5;
    border-radius: 26px;
    background: #edf5ff;
    color: #2879df;
    font-size: 13px;
    font-weight: 600;
}

.process-model__flow-node.terminal small {
    margin-top: 4px;
    color: #697386;
    font-weight: 400;
}

.process-model__flow-node.terminal.end {
    border-color: #e69a9a;
    background: #fff2f2;
    color: #b43a3a;
}

.process-model__flow-node.component {
    min-height: 76px;
    padding: 8px 12px;
    border: 2px solid #1599e6;
    border-radius: 12px;
    background: #fff;
    color: #171717;
    cursor: pointer;
}

.process-model__flow-node.component:hover {
    background: #f5fbff;
    box-shadow: 0 0 0 3px rgba(21, 153, 230, 0.1);
}

.process-model__flow-node.component small {
    color: #3185f7;
    font-size: 10px;
}

.process-model__flow-node.component strong {
    margin: 4px 0;
    font-size: 13px;
}

.process-model__flow-node.component span {
    overflow: hidden;
    color: #7b8797;
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.process-model__flow-node.primary {
    width: 128px;
    min-height: 60px;
    padding: 10px;
    border: 1px solid #2b5fd7;
    border-radius: 7px;
    background: #edf4ff;
    box-shadow: 0 2px 7px rgba(43, 95, 215, 0.08);
    color: #214eae;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: box-shadow 0.15s, transform 0.15s;
}

.process-model__flow-node.primary:hover {
    box-shadow: 0 0 0 3px rgba(43, 95, 215, 0.14), 0 6px 14px rgba(43, 95, 215, 0.15);
    transform: translateY(-2px);
}

.process-model__simple-flow,
.process-model__special-flow {
    display: flex;
    min-width: 240px;
    flex-direction: column;
    align-items: center;
}

.process-model__simple-node {
    display: flex;
    width: 190px;
    min-height: 58px;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    padding: 12px 16px;
    border: 2px solid #1599e6;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
    color: #171717;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
}

.process-model__simple-node:hover {
    background: #f5fbff;
    box-shadow: 0 0 0 3px rgba(21, 153, 230, 0.1);
}

.process-model__simple-arrow,
.process-model__vertical-arrow {
    position: relative;
    width: 2px;
    height: 38px;
    flex-shrink: 0;
    background: #555;
}

.process-model__simple-arrow::after,
.process-model__vertical-arrow::after {
    position: absolute;
    bottom: -1px;
    left: -6px;
    border-top: 11px solid #555;
    border-right: 7px solid transparent;
    border-left: 7px solid transparent;
    content: '';
}

.process-model__terminal {
    width: 230px;
    padding: 2px;
    clip-path: polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%);
    background: #3988f5;
    filter: drop-shadow(0 2px 5px rgba(43, 95, 215, 0.12));
    color: #2879df;
    font-size: 13px;
    text-align: center;
}

.process-model__terminal-top {
    padding: 9px 24px 8px 12px;
    background: #3988f5;
    color: #fff;
    font-weight: 600;
}

.process-model__terminal-bottom {
    padding: 10px 24px 10px 12px;
    background: #fff;
    font-weight: 600;
}

.process-model__component-node {
    display: flex;
    width: 230px;
    box-sizing: border-box;
    flex-direction: column;
    padding: 6px;
    border: 2px solid #9b9b9b;
    background: #fff;
    text-align: center;
    cursor: pointer;
}

.process-model__component-head {
    margin-bottom: 5px;
    color: #3185f7;
    font-size: 11px;
    text-align: left;
}

.process-model__component-node strong {
    padding: 13px 8px;
    border-radius: 6px;
    background: #ff900d;
    color: #202733;
    font-size: 13px;
}

.process-model__component-foot {
    padding-top: 5px;
    color: #3185f7;
    font-size: 12px;
}

.process-model__canvas-tools {
    position: absolute;
    right: 14px;
    bottom: 14px;
    z-index: 4;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    border: 1px solid #e1e6ee;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.94);
    box-shadow: 0 2px 8px rgba(31, 45, 61, 0.08);
}

.process-model__canvas-tools button {
    display: inline-flex;
    width: 30px;
    height: 28px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: #596577;
    font-size: 16px;
    cursor: pointer;
}

.process-model__canvas-tools button:hover {
    background: #edf3ff;
    color: #2b5fd7;
}

.process-model__canvas-tools span {
    min-width: 44px;
    color: #788393;
    font-size: 11px;
    text-align: center;
}

.process-model__empty {
    display: flex;
    min-height: 240px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #7b8797;
    text-align: center;
}

.process-model__empty.large {
    min-height: 394px;
}

.process-model__empty-icon {
    display: flex;
    width: 52px;
    height: 52px;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    border-radius: 50%;
    background: #edf3ff;
    color: #2b5fd7;
    font-size: 24px;
}

.process-model__empty strong {
    color: #4b5563;
    font-size: 14px;
}

.process-model__empty small {
    color: #9aa3af;
    font-size: 12px;
}

.process-model__list-filter {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px;
    margin-bottom: 14px;
    border-radius: 5px;
    background: #f8f9fb;
    font-size: 12px;
}

.process-model__list-filter input {
    width: 220px;
    height: 32px;
    box-sizing: border-box;
    padding: 0 10px;
    border: 1px solid #dfe4ec;
    border-radius: 4px;
    outline: none;
}

.process-model__list-filter button {
    height: 32px;
    padding: 0 15px;
    border: 1px solid #d9dfe8;
    border-radius: 4px;
    background: #fff;
    color: #536070;
    cursor: pointer;
}

.process-model__list-filter button.primary {
    border-color: #2b5fd7;
    background: #2b5fd7;
    color: #fff;
}

.process-model__table-wrap {
    overflow-x: auto;
}

.process-model__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
}

.process-model__table th {
    padding: 11px 12px;
    border-bottom: 1px solid #e5e9ef;
    background: #f6f8fb;
    color: #596577;
    font-weight: 600;
    text-align: left;
    white-space: nowrap;
}

.process-model__table td {
    padding: 12px;
    border-bottom: 1px solid #edf0f4;
    color: #4b5563;
}

.process-model__table tbody tr:hover td {
    background: #f8fbff;
}

.process-model__table tbody tr {
    cursor: pointer;
}

.process-model__table td.link {
    color: #2b5fd7;
}

.process-model__table td.process-model__table-empty {
    padding: 36px;
    color: #9aa3af;
    text-align: center;
}

.process-model__section-title {
    padding-left: 9px;
    margin: 24px 0 14px;
    border-left: 3px solid #3b8cff;
    color: #252b35;
    font-size: 15px;
    font-weight: 700;
}

.process-model__section-title:first-child {
    margin-top: 0;
}

.process-model__param-button {
    display: inline-flex;
    align-items: center;
    height: 30px;
    padding: 0 12px;
    margin-left: 10px;
    border-radius: 4px;
    background: #3388f5;
    color: #fff;
    font-size: 12px;
    font-weight: 400;
}

.process-model__info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(220px, 1fr));
    border-top: 1px solid #eef1f5;
    border-left: 1px solid #eef1f5;
}

.process-model__info-grid.single {
    grid-template-columns: 1fr;
}

.process-model__info-item {
    display: grid;
    min-height: 46px;
    grid-template-columns: 112px 1fr;
    border-right: 1px solid #eef1f5;
    border-bottom: 1px solid #eef1f5;
    font-size: 12px;
}

.process-model__info-item.full {
    grid-column: 1 / -1;
}

.process-model__info-item span {
    padding: 13px 14px;
    background: #f8f9fb;
    color: #788393;
}

.process-model__info-item strong {
    padding: 13px 14px;
    color: #303846;
    font-weight: 400;
    white-space: pre-line;
    word-break: break-word;
}

.process-model__drawer-mask {
    position: fixed;
    z-index: 299;
    inset: 0;
    background: rgba(15, 23, 42, 0.28);
}

.process-model__drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 300;
    display: flex;
    width: 460px;
    max-width: 92vw;
    flex-direction: column;
    background: #fff;
    box-shadow: -8px 0 24px rgba(15, 23, 42, 0.16);
}

.process-model__drawer-head {
    display: flex;
    height: 60px;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid #e8ecf2;
}

.process-model__drawer-head button {
    width: 30px;
    height: 30px;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: #7b8797;
    font-size: 21px;
    cursor: pointer;
}

.process-model__drawer-body {
    flex: 1;
    padding: 20px;
    overflow: auto;
}

.process-model__detail-title.drawer-title {
    margin-bottom: 18px;
}

@media (max-width: 1100px) {
    .process-model__sidebar {
        flex-basis: 210px;
    }

    .process-model__level {
        width: 160px;
    }

    .process-model__tree-panel {
        width: 240px;
    }

    .process-model__info-grid {
        grid-template-columns: 1fr;
    }

    .process-model__info-item.full {
        grid-column: auto;
    }
}
</style>
