<template>
    <div class="model-editor-page">
        <header class="model-editor-header">
            <div class="model-editor-title">
                <el-button icon="el-icon-arrow-left" size="small" circle @click="goBack" />
                <div>
                    <strong>{{ diagramTitle }} · 模型编辑</strong>
                    <span>{{ systemName }}（{{ systemKey }}）/ {{ diagramVersion }}</span>
                </div>
            </div>
            <div class="model-editor-actions">
                <el-tooltip content="撤销 Ctrl+Z" placement="bottom">
                    <el-button icon="el-icon-refresh-left" size="small" :disabled="!canUndo" @click="undoDiagram" />
                </el-tooltip>
                <el-tooltip content="重做 Ctrl+Y" placement="bottom">
                    <el-button icon="el-icon-refresh-right" size="small" :disabled="!canRedo" @click="redoDiagram" />
                </el-tooltip>
                <span class="toolbar-divider" />
                <el-dropdown trigger="click" @command="alignSelectedNodes">
                    <el-button size="small">
                        对齐 <i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="left">左对齐</el-dropdown-item>
                        <el-dropdown-item command="center">水平居中</el-dropdown-item>
                        <el-dropdown-item command="right">右对齐</el-dropdown-item>
                        <el-dropdown-item divided command="top">上对齐</el-dropdown-item>
                        <el-dropdown-item command="middle">垂直居中</el-dropdown-item>
                        <el-dropdown-item command="bottom">下对齐</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown trigger="click" @command="distributeSelectedNodes">
                    <el-button size="small">
                        等距分布 <i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="horizontal">水平等距</el-dropdown-item>
                        <el-dropdown-item command="vertical">垂直等距</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <div class="zoom-control">
                    <button type="button" title="缩小" @click="changeCanvasZoom(-0.1)">−</button>
                    <span>{{ zoomPercent }}%</span>
                    <button type="button" title="放大" @click="changeCanvasZoom(0.1)">+</button>
                    <button type="button" title="适应内容" @click="fitContent"><i class="el-icon-full-screen" /></button>
                </div>
                <el-dropdown trigger="click" @command="handleMoreCommand">
                    <el-button size="small">更多 <i class="el-icon-arrow-down el-icon--right" /></el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="generate" icon="el-icon-magic-stick">生成当前架构</el-dropdown-item>
                        <el-dropdown-item divided command="clear" icon="el-icon-delete">清空画布</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button type="primary" size="small" icon="el-icon-document" @click="saveDiagram">
                    保存
                </el-button>
            </div>
        </header>

        <main class="model-editor-workspace">
            <aside class="model-editor-palette">
                <div class="palette-title">图形</div>
                <div class="shape-list">
                    <div
                        v-for="shape in shapeOptions"
                        :key="shape.type"
                        class="shape-item"
                        draggable="true"
                        @dragstart="startShapeDrag($event, shape.type)"
                        @dragend="finishShapeDrag"
                        @click="addShapeAtViewportCenter(shape.type)"
                    >
                        <span :class="['shape-preview', `shape-preview--${shape.type}`]">
                            <i v-if="shape.type === 'container'">分组</i>
                        </span>
                        <b>{{ shape.label }}</b>
                    </div>
                </div>
                <div class="palette-tip">
                    <i class="el-icon-info" />
                    点击快速添加<br>也可拖入指定位置
                </div>
            </aside>

            <section
                ref="canvasWrap"
                class="model-editor-canvas-wrap"
            >
                <div
                    ref="canvasScroller"
                    class="model-editor-canvas-scroll"
                    @dragover.prevent
                    @drop.prevent="handleCanvasDrop"
                    @scroll="refreshContextPosition"
                >
                    <div
                        ref="canvas"
                        class="model-editor-canvas"
                        :style="canvasStyle"
                    />
                </div>

                <div class="canvas-quick-guide">
                    <span><i class="el-icon-rank" /> 右键拖动画布</span>
                    <span>Ctrl + 滚轮缩放</span>
                    <span>框选 / Ctrl 多选</span>
                </div>

                <transition name="toolbar-fade">
                    <div
                        v-if="selectedNode && !inlineEditor.visible"
                        class="cell-context-toolbar"
                        :style="contextToolbarStyle"
                        @mousedown.stop
                    >
                        <el-tooltip content="修改文字" placement="top">
                            <button type="button" @click="startInlineEdit(selectedNode)"><i class="el-icon-edit" /></button>
                        </el-tooltip>
                        <el-tooltip content="绑定数据" placement="top">
                            <button type="button" @click="openNodePanel('binding')"><i class="el-icon-connection" /></button>
                        </el-tooltip>
                        <el-tooltip content="外观样式" placement="top">
                            <button type="button" @click="openNodePanel('style')"><i class="el-icon-brush" /></button>
                        </el-tooltip>
                        <el-tooltip content="恢复标准尺寸" placement="top">
                            <button type="button" @click="resetSelectedNodeSize"><i class="el-icon-crop" /></button>
                        </el-tooltip>
                        <span />
                        <el-tooltip content="复制 Ctrl+C" placement="top">
                            <button type="button" @click="copySelection"><i class="el-icon-document-copy" /></button>
                        </el-tooltip>
                        <el-tooltip content="删除 Delete" placement="top">
                            <button class="danger" type="button" @click="removeSelectedNode"><i class="el-icon-delete" /></button>
                        </el-tooltip>
                    </div>
                </transition>

                <transition name="toolbar-fade">
                    <div
                        v-if="selectedEdge"
                        class="cell-context-toolbar edge-context-toolbar"
                        :style="contextToolbarStyle"
                        @mousedown.stop
                    >
                        <button type="button" @click="openEdgePanel"><i class="el-icon-setting" /> 关系设置</button>
                        <span />
                        <button class="danger" type="button" @click="removeSelectedEdge"><i class="el-icon-delete" /></button>
                    </div>
                </transition>

                <el-input
                    v-if="inlineEditor.visible"
                    ref="inlineEditorInput"
                    v-model="inlineEditor.value"
                    class="node-inline-editor"
                    :style="inlineEditor.style"
                    size="small"
                    @keyup.enter.native="commitInlineEdit"
                    @keyup.esc.native="cancelInlineEdit"
                    @blur="commitInlineEdit"
                />

                <div v-if="!nodeCount" class="canvas-empty-hint">
                    <div class="empty-icon"><i class="el-icon-plus" /></div>
                    <strong>拖入第一个图形开始设计</strong>
                    <span>形状负责展示，数据绑定负责内容，连接线负责关系</span>
                </div>
                <div class="canvas-status">
                    {{ nodeCount }} 个节点 · {{ edgeCount }} 条关系
                    <span v-if="dirty">· 未保存</span>
                </div>
            </section>

            <transition name="property-slide">
                <aside v-if="propertyPanelVisible" class="model-property-drawer">
                    <div class="property-drawer-header">
                        <div>
                            <strong>{{ selectedEdge ? '关系设置' : '节点设置' }}</strong>
                            <span>{{ selectedEdge ? relationLabel(edgeForm.relationType) : shapeLabel(nodeForm.shapeType) }}</span>
                        </div>
                        <button type="button" @click="closePropertyPanel"><i class="el-icon-close" /></button>
                    </div>

                    <el-tabs v-if="selectedNode" v-model="nodePropertyTab" class="property-tabs" stretch>
                        <el-tab-pane label="数据绑定" name="binding">
                            <div class="property-form">
                                <div class="binding-preview" :style="nodePreviewStyle">
                                    {{ nodeForm.label || '节点预览' }}
                                </div>
                                <label>
                                    <span>资产类型</span>
                                    <el-select
                                        v-model="nodeForm.sourceType"
                                        size="small"
                                        clearable
                                        placeholder="选择数据来源"
                                        @change="handleSourceTypeChange"
                                    >
                                        <el-option
                                            v-for="item in sourceTypes"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        />
                                    </el-select>
                                </label>
                                <label v-if="nodeForm.sourceType">
                                    <span>数据记录</span>
                                    <el-select
                                        v-model="nodeForm.sourceId"
                                        size="small"
                                        filterable
                                        clearable
                                        placeholder="搜索并选择数据"
                                        @change="handleSourceRecordChange"
                                    >
                                        <el-option
                                            v-for="item in currentSourceRecords"
                                            :key="item.id"
                                            :label="sourceRecordLabel(item)"
                                            :value="item.id"
                                        />
                                    </el-select>
                                </label>
                                <label v-if="nodeForm.sourceId">
                                    <span>展示字段</span>
                                    <el-checkbox-group v-model="nodeForm.displayFields" class="display-field-list" @change="applyBindingLabel">
                                        <el-checkbox
                                            v-for="field in currentSourceFields"
                                            :key="field.value"
                                            :label="field.value"
                                        >{{ field.label }}</el-checkbox>
                                    </el-checkbox-group>
                                </label>
                                <div class="property-note">字段顺序即节点中的展示顺序，修改后画布实时预览。</div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="文字与样式" name="style">
                            <div class="property-form">
                                <label>
                                    <span>显示文本</span>
                                    <el-input v-model="nodeForm.label" size="small" type="textarea" :rows="3" @input="applyNodeProperties" />
                                </label>
                                <label v-if="!['layer', 'container'].includes(nodeForm.shapeType)">
                                    <span>形状</span>
                                    <el-radio-group v-model="nodeForm.shapeType" size="small" @change="applyNodeProperties">
                                        <el-radio-button label="rectangle">矩形</el-radio-button>
                                        <el-radio-button label="rounded">圆角矩形</el-radio-button>
                                    </el-radio-group>
                                </label>
                                <div class="property-row">
                                    <label>
                                        <span>宽度</span>
                                        <el-input-number v-model="nodeForm.width" :min="80" :max="2400" :step="10" size="small" controls-position="right" @change="applyNodeProperties" />
                                    </label>
                                    <label>
                                        <span>高度</span>
                                        <el-input-number v-model="nodeForm.height" :min="40" :max="1200" :step="10" size="small" controls-position="right" @change="applyNodeProperties" />
                                    </label>
                                </div>
                                <div class="color-setting-list">
                                    <label><span>底色</span><el-color-picker v-model="nodeForm.fill" @change="applyNodeProperties" /></label>
                                    <label><span>边框</span><el-color-picker v-model="nodeForm.stroke" @change="applyNodeProperties" /></label>
                                    <label><span>文字</span><el-color-picker v-model="nodeForm.textColor" @change="applyNodeProperties" /></label>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>

                    <div v-else-if="selectedEdge" class="property-form edge-property-form">
                        <label>
                            <span>关系类型</span>
                            <el-select v-model="edgeForm.relationType" size="small" @change="applyEdgeProperties">
                                <el-option v-for="item in relationTypes" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </label>
                        <label>
                            <span>通信协议</span>
                            <el-select v-model="edgeForm.protocol" size="small" filterable allow-create clearable default-first-option placeholder="HTTP、RPC、MQ……" @change="applyEdgeProperties">
                                <el-option label="HTTP / HTTPS" value="HTTP / HTTPS" />
                                <el-option label="RPC" value="RPC" />
                                <el-option label="MQ" value="MQ" />
                                <el-option label="TCP" value="TCP" />
                            </el-select>
                        </label>
                        <label>
                            <span>关系说明</span>
                            <el-input v-model="edgeForm.label" size="small" type="textarea" :rows="3" placeholder="例如：账户查询调用" @input="applyEdgeProperties" />
                        </label>
                        <div class="color-setting-list">
                            <label><span>线条颜色</span><el-color-picker v-model="edgeForm.stroke" @change="applyEdgeProperties" /></label>
                            <label><span>虚线</span><el-switch v-model="edgeForm.dashed" @change="applyEdgeProperties" /></label>
                        </div>
                    </div>
                </aside>
            </transition>
        </main>
    </div>
</template>

<script>
import { Graph } from '@antv/x6'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { History } from '@antv/x6-plugin-history'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { loadModelDiagram, saveModelDiagram } from '../modelDiagramStorage'
import {
    SYSTEMS,
    TECH_STACKS,
    APPLICATION_ARCH_DATA,
    DEPLOYMENT_VIEWS,
    INTEGRATION_LAYERS,
    TECH_LAYERS,
    FUNCTION_LAYERS,
    APP_LAYERS,
    DATA_FLOW_LAYERS
} from '../systemData'

const SHAPE_MIME = 'application/x-aop-architecture-shape'

const SOURCE_TYPES = [
    { value: 'system', label: '系统' },
    { value: 'application', label: '应用' },
    { value: 'service', label: '服务/接口' },
    { value: 'techStack', label: '技术栈' },
    { value: 'deploymentNode', label: '部署节点' }
]

const SOURCE_FIELDS = {
    system: [
        { value: 'name', label: '系统名称' },
        { value: 'code', label: '系统代码' },
        { value: 'domain', label: '所属应用域' },
        { value: 'status', label: '状态' }
    ],
    application: [
        { value: 'name', label: '应用名称' },
        { value: 'line', label: '业务条线' },
        { value: 'layer', label: '架构层' }
    ],
    service: [
        { value: 'name', label: '服务名称' },
        { value: 'module', label: '模块名称' },
        { value: 'interface', label: '接口' },
        { value: 'application', label: '所属应用' }
    ],
    techStack: [
        { value: 'name', label: '技术栈名称' },
        { value: 'version', label: '版本' },
        { value: 'domain', label: '技术域' },
        { value: 'layer', label: '技术层' }
    ],
    deploymentNode: [
        { value: 'name', label: '节点名称' },
        { value: 'group', label: '节点分组' },
        { value: 'area', label: '部署区域' },
        { value: 'view', label: '部署视图' }
    ]
}

const buildSourceCatalog = () => {
    const applications = []
    const services = []
    APPLICATION_ARCH_DATA.forEach(layer => {
        layer.apps.forEach(app => {
            applications.push({
                id: `application:${layer.layer}:${app.name}`,
                name: app.name,
                line: app.line,
                layer: layer.layer
            })
            app.modules.forEach(module => {
                services.push({
                    id: `service:${app.name}:${module[1]}:${module[2]}`,
                    name: module[1],
                    module: module[0],
                    interface: module[2],
                    application: app.name
                })
            })
        })
    })
    const deploymentNodes = []
    Object.keys(DEPLOYMENT_VIEWS).forEach(view => {
        DEPLOYMENT_VIEWS[view].forEach(area => {
            area.groups.forEach(group => {
                group.items.forEach(name => {
                    deploymentNodes.push({
                        id: `deployment:${view}:${area.name}:${group.name}:${name}`,
                        name,
                        group: group.name,
                        area: area.name,
                        view
                    })
                })
            })
        })
    })
    return {
        system: SYSTEMS.map(item => ({
            id: item.key,
            name: item.name,
            code: item.code,
            domain: item.domain,
            status: item.status
        })),
        application: applications,
        service: services,
        techStack: TECH_STACKS.map(item => ({
            id: `tech-stack:${item.id}`,
            name: item.name,
            version: item.version,
            domain: item.domain,
            layer: item.layer
        })),
        deploymentNode: deploymentNodes
    }
}

const SOURCE_CATALOG = buildSourceCatalog()

const RELATION_TYPES = [
    { value: 'call', label: '调用' },
    { value: 'dependency', label: '依赖' },
    { value: 'deployment', label: '部署' },
    { value: 'access', label: '访问' },
    { value: 'dataFlow', label: '数据流' }
]

const DIAGRAM_TITLES = {
    integration: '集成架构图',
    tech: '技术架构图',
    'deployment-logical': '部署架构图 - 逻辑部署',
    'deployment-physical': '部署架构图 - 物理部署',
    'deployment-network': '部署架构图 - 网络设计',
    'functional-app': '应用架构图',
    'functional-system': '系统功能图',
    'functional-integration': '集成架构图',
    'functional-data': '数据流图'
}

const DIAGRAM_LAYER_DATA = {
    integration: INTEGRATION_LAYERS,
    tech: TECH_LAYERS,
    'deployment-logical': DEPLOYMENT_VIEWS.logical,
    'deployment-physical': DEPLOYMENT_VIEWS.physical,
    'deployment-network': DEPLOYMENT_VIEWS.network,
    'functional-app': APP_LAYERS,
    'functional-system': FUNCTION_LAYERS,
    'functional-integration': INTEGRATION_LAYERS,
    'functional-data': DATA_FLOW_LAYERS
}

const LAYER_TONES = {
    green: { fill: '#eff9e9', stroke: '#b9dda9', titleFill: '#e7f5df' },
    yellow: { fill: '#fff9e5', stroke: '#efd99a', titleFill: '#fff5d5' },
    blue: { fill: '#eef6ff', stroke: '#b8d4f3', titleFill: '#e1eefc' },
    orange: { fill: '#fff4ea', stroke: '#f0c49f', titleFill: '#ffead8' },
    default: { fill: '#f7faff', stroke: '#c7d9ef', titleFill: '#edf4fc' }
}

const SHAPE_CONFIG = {
    rectangle: {
        label: '矩形节点',
        width: 180,
        height: 72,
        fill: '#eaf2ff',
        stroke: '#7aa7f8',
        textColor: '#315ca7',
        rx: 0,
        ry: 0
    },
    rounded: {
        label: '圆角矩形',
        width: 180,
        height: 72,
        fill: '#effbea',
        stroke: '#86c96b',
        textColor: '#3c7f27',
        rx: 12,
        ry: 12
    },
    container: {
        label: '容器',
        width: 420,
        height: 240,
        fill: '#f8fafc',
        stroke: '#94a3b8',
        textColor: '#475569',
        rx: 10,
        ry: 10,
        dashed: true
    }
}

export default {
    name: 'ModelArchitectureEditor',
    data() {
        return {
            graph: null,
            selectedNode: null,
            selectedEdge: null,
            nodeCount: 0,
            edgeCount: 0,
            canvasWidth: 1200,
            canvasHeight: 800,
            zoomPercent: 100,
            dirty: false,
            restoring: false,
            shapeDragActive: false,
            quickAddOffset: 0,
            propertyPanelVisible: false,
            nodePropertyTab: 'binding',
            contextToolbarStyle: {},
            canUndo: false,
            canRedo: false,
            inlineEditor: {
                visible: false,
                nodeId: '',
                value: '',
                style: {}
            },
            sourceTypes: SOURCE_TYPES,
            relationTypes: RELATION_TYPES,
            shapeOptions: [
                { type: 'layer', label: '架构层', description: '分层泳道与节点容器' },
                { type: 'rectangle', label: '矩形', description: '标准架构元素' },
                { type: 'rounded', label: '圆角矩形', description: '强调或业务节点' },
                { type: 'container', label: '容器', description: '架构层、区域或分组' }
            ],
            nodeForm: {
                shapeType: '',
                label: '',
                width: 180,
                height: 72,
                fill: '#ffffff',
                stroke: '#d1d5db',
                textColor: '#334155',
                sourceType: '',
                sourceId: '',
                displayFields: []
            },
            edgeForm: {
                relationType: 'call',
                protocol: '',
                label: '',
                stroke: '#64748b',
                dashed: false
            }
        }
    },
    computed: {
        diagramType() {
            return this.$route.query.type || 'integration'
        },
        diagramTitle() {
            return this.$route.query.title || DIAGRAM_TITLES[this.diagramType] || '架构图'
        },
        diagramVersion() {
            return this.$route.query.version || 'V1.0.0'
        },
        systemKey() {
            return this.$route.query.system || 'default'
        },
        systemName() {
            const system = SYSTEMS.find(item => item.key === this.systemKey)
            return system ? system.name : this.systemKey
        },
        diagramContext() {
            return {
                systemId: this.systemKey,
                diagramType: this.diagramType,
                version: this.diagramVersion
            }
        },
        currentSourceRecords() {
            return SOURCE_CATALOG[this.nodeForm.sourceType] || []
        },
        currentSourceFields() {
            return SOURCE_FIELDS[this.nodeForm.sourceType] || []
        },
        canvasStyle() {
            return {
                width: `${this.canvasWidth}px`,
                height: `${this.canvasHeight}px`
            }
        },
        nodePreviewStyle() {
            return {
                color: this.nodeForm.textColor,
                background: this.nodeForm.fill,
                borderColor: this.nodeForm.stroke,
                borderRadius: this.nodeForm.shapeType === 'rounded' ? '12px' : '2px'
            }
        }
    },
    mounted() {
        this.initializeCanvasDimensions()
        this.initGraph()
        this.restoreDiagram()
        window.addEventListener('resize', this.ensureCanvasSize)
        window.addEventListener('keydown', this.handleEditorKeydown)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.ensureCanvasSize)
        window.removeEventListener('keydown', this.handleEditorKeydown)
        if (this.graph) this.graph.dispose()
    },
    beforeRouteLeave(to, from, next) {
        if (!this.dirty) {
            next()
            return
        }
        this.$confirm('当前模型图尚未保存，确定离开吗？', '退出模型编辑', {
            confirmButtonText: '直接离开',
            cancelButtonText: '继续编辑',
            type: 'warning'
        }).then(() => next()).catch(() => next(false))
    },
    methods: {
        initializeCanvasDimensions() {
            const scroller = this.$refs.canvasScroller
            if (!scroller) return
            this.canvasWidth = Math.max(800, scroller.clientWidth)
            this.canvasHeight = Math.max(600, scroller.clientHeight)
        },
        initGraph() {
            this.graph = new Graph({
                container: this.$refs.canvas,
                width: this.canvasWidth,
                height: this.canvasHeight,
                background: { color: '#f8fbff' },
                grid: {
                    visible: true,
                    size: 20,
                    type: 'dot',
                    args: { color: '#d7e2f0', thickness: 1 }
                },
                panning: {
                    enabled: true,
                    eventTypes: ['rightMouseDown', 'mouseWheelDown']
                },
                mousewheel: {
                    enabled: true,
                    modifiers: ['ctrl', 'meta'],
                    minScale: 0.5,
                    maxScale: 2
                },
                interacting: {
                    nodeMovable: cellView => {
                        const data = cellView.cell.getData() || {}
                        return data.kind !== 'model-group'
                    },
                    edgeMovable: false
                },
                connecting: {
                    snap: true,
                    allowBlank: false,
                    allowLoop: false,
                    allowEdge: false,
                    allowNode: false,
                    router: { name: 'orth' },
                    connector: { name: 'rounded', args: { radius: 8 } },
                    connectionPoint: 'boundary',
                    validateConnection: ({ sourceCell, targetCell, sourceMagnet, targetMagnet }) => (
                        Boolean(sourceMagnet && targetMagnet) &&
                        this.isConnectableNode(sourceCell) &&
                        this.isConnectableNode(targetCell) &&
                        sourceCell.id !== targetCell.id
                    ),
                    createEdge: () => this.graph.createEdge(this.createEdgeConfig())
                }
            })

            this.graph.use(new Transform({
                resizing: {
                    enabled: node => (node.getData() || {}).kind !== 'model-group',
                    minWidth: node => (node.getData() || {}).shapeType === 'layer' ? 520 : 80,
                    minHeight: node => (node.getData() || {}).shapeType === 'layer' ? 100 : 40,
                    maxWidth: 2400,
                    maxHeight: 1200,
                    orthogonal: true,
                    autoScroll: true,
                    preserveAspectRatio: false
                },
                rotating: false
            }))
            this.graph.use(new Selection({
                enabled: true,
                multiple: true,
                rubberband: true,
                rubberNode: true,
                rubberEdge: false,
                movable: true,
                showNodeSelectionBox: true,
                filter: cell => cell.isNode() && (cell.getData() || {}).kind !== 'model-group'
            }))
            this.graph.use(new Snapline({
                enabled: true,
                sharp: true,
                resizing: true,
                tolerance: 8,
                filter: node => (node.getData() || {}).kind !== 'model-group'
            }))
            this.graph.use(new History({
                enabled: true,
                stackSize: 80,
                beforeAddCommand: (event, args) => !(args.options && args.options.transient)
            }))
            this.graph.use(new Clipboard({ enabled: true }))

            this.graph.on('node:click', ({ node }) => {
                const data = node.getData() || {}
                if (data.kind !== 'model-group') this.selectNode(node)
            })
            this.graph.on('node:dblclick', ({ node }) => this.startInlineEdit(node))
            this.graph.on('edge:click', ({ edge }) => {
                this.selectEdge(edge)
                this.openEdgePanel()
            })
            this.graph.on('blank:click', () => {
                this.closePropertyPanel()
                this.clearSelection()
            })
            this.graph.on('node:change:position', () => {
                this.markDirty()
                this.scheduleCanvasResize()
                this.refreshContextPosition()
            })
            this.graph.on('node:resized', ({ node }) => {
                this.syncCompositeNodeGeometry(node)
                if (this.selectedNode && this.selectedNode.id === node.id) {
                    const size = node.getSize()
                    this.nodeForm.width = Math.round(size.width)
                    this.nodeForm.height = Math.round(size.height)
                }
                this.markDirty()
                this.scheduleCanvasResize()
                this.refreshContextPosition()
            })
            this.graph.on('node:added', () => {
                this.syncNodeCount()
                this.scheduleCanvasResize()
            })
            this.graph.on('node:removed', () => {
                this.syncNodeCount()
                this.scheduleCanvasResize()
            })
            this.graph.on('edge:added', () => this.syncEdgeCount())
            this.graph.on('edge:removed', () => this.syncEdgeCount())
            this.graph.on('edge:change:target', ({ edge }) => {
                this.markDirty()
                if (!this.restoring && edge.getTargetCell()) {
                    this.selectEdge(edge)
                    this.openEdgePanel()
                }
            })
            this.graph.on('scale', () => {
                this.zoomPercent = Math.round(this.graph.zoom() * 100)
                this.refreshContextPosition()
            })
            this.graph.on('translate', () => this.refreshContextPosition())
            this.graph.on('history:change', () => this.updateHistoryState())
        },
        handleMoreCommand(command) {
            if (command === 'generate') this.generateArchitectureTemplate()
            if (command === 'clear') this.clearCanvas()
        },
        openNodePanel(tab = 'binding') {
            if (!this.selectedNode) return
            this.nodePropertyTab = tab
            this.propertyPanelVisible = true
            this.$nextTick(() => this.refreshContextPosition())
        },
        openEdgePanel() {
            if (!this.selectedEdge) return
            this.propertyPanelVisible = true
            this.$nextTick(() => this.refreshContextPosition())
        },
        closePropertyPanel() {
            this.propertyPanelVisible = false
            this.$nextTick(() => this.refreshContextPosition())
        },
        refreshContextPosition() {
            this.$nextTick(() => {
                const cell = this.selectedNode || this.selectedEdge
                if (!cell || !this.graph || !this.$refs.canvasWrap) return
                const box = cell.getBBox()
                const clientBox = this.graph.localToClient(box)
                const wrapBox = this.$refs.canvasWrap.getBoundingClientRect()
                const panelWidth = this.propertyPanelVisible ? 360 : 0
                const maxLeft = Math.max(90, wrapBox.width - panelWidth - 90)
                const left = Math.min(maxLeft, Math.max(90, clientBox.x - wrapBox.x + clientBox.width / 2))
                const top = Math.max(58, clientBox.y - wrapBox.y - 48)
                this.contextToolbarStyle = {
                    left: `${left}px`,
                    top: `${top}px`
                }
            })
        },
        startInlineEdit(node) {
            if (!node || !node.isNode()) return
            const data = node.getData() || {}
            if (data.kind === 'model-group') return
            this.selectNode(node)
            const box = this.graph.localToClient(node.getBBox())
            const wrapBox = this.$refs.canvasWrap.getBoundingClientRect()
            this.inlineEditor = {
                visible: true,
                nodeId: node.id,
                value: data.label || node.attr('label/text') || '',
                style: {
                    left: `${box.x - wrapBox.x + 8}px`,
                    top: `${box.y - wrapBox.y + Math.max(4, (box.height - 34) / 2)}px`,
                    width: `${Math.max(120, box.width - 16)}px`
                }
            }
            this.$nextTick(() => {
                const input = this.$refs.inlineEditorInput
                if (input && input.focus) input.focus()
                if (input && input.select) input.select()
            })
        },
        commitInlineEdit() {
            if (!this.inlineEditor.visible || !this.graph) return
            const node = this.graph.getCellById(this.inlineEditor.nodeId)
            const value = String(this.inlineEditor.value || '').trim() || '未命名节点'
            this.inlineEditor.visible = false
            if (!node || !node.isNode()) return
            const data = node.getData() || {}
            node.attr('label/text', value)
            node.setData({ ...data, label: value })
            if (this.selectedNode && this.selectedNode.id === node.id) this.nodeForm.label = value
            this.markDirty()
            this.refreshContextPosition()
        },
        cancelInlineEdit() {
            this.inlineEditor.visible = false
        },
        updateHistoryState() {
            this.canUndo = Boolean(this.graph && this.graph.canUndo())
            this.canRedo = Boolean(this.graph && this.graph.canRedo())
        },
        undoDiagram() {
            if (!this.graph || !this.graph.canUndo()) return
            this.closePropertyPanel()
            this.clearSelection()
            this.graph.undo()
            this.syncNodeCount()
            this.syncEdgeCount()
            this.markDirty()
            this.updateHistoryState()
        },
        redoDiagram() {
            if (!this.graph || !this.graph.canRedo()) return
            this.closePropertyPanel()
            this.clearSelection()
            this.graph.redo()
            this.syncNodeCount()
            this.syncEdgeCount()
            this.markDirty()
            this.updateHistoryState()
        },
        resetSelectedNodeSize() {
            if (!this.selectedNode) return
            const data = this.selectedNode.getData() || {}
            const shapeType = data.shapeType || 'rectangle'
            const size = shapeType === 'layer'
                ? { width: 640, height: 120 }
                : {
                    width: (SHAPE_CONFIG[shapeType] || SHAPE_CONFIG.rectangle).width,
                    height: (SHAPE_CONFIG[shapeType] || SHAPE_CONFIG.rectangle).height
                }
            this.selectedNode.resize(size.width, size.height)
            this.nodeForm.width = size.width
            this.nodeForm.height = size.height
            this.syncCompositeNodeGeometry(this.selectedNode)
            this.markDirty()
            this.scheduleCanvasResize()
            this.refreshContextPosition()
        },
        copySelection() {
            if (!this.graph) return
            const nodes = this.getSelectedActionNodes()
            const cells = nodes.length ? nodes : (this.selectedNode ? [this.selectedNode] : [])
            if (!cells.length) return
            this.graph.copy(cells, { deep: true })
            this.$message.success(`已复制 ${cells.length} 个节点`)
        },
        pasteSelection() {
            if (!this.graph || this.graph.isClipboardEmpty()) return
            const cells = this.graph.paste({ offset: 32 })
            const nodes = cells.filter(cell => cell.isNode() && (cell.getData() || {}).kind !== 'model-group')
            if (!nodes.length) return
            this.graph.cleanSelection()
            this.graph.select(nodes)
            this.selectNode(nodes[nodes.length - 1])
            this.markDirty()
            this.scheduleCanvasResize()
        },
        removeCurrentSelection() {
            if (this.selectedEdge) {
                this.removeSelectedEdge()
                return
            }
            const nodes = this.getSelectedActionNodes()
            if (nodes.length > 1) {
                this.closePropertyPanel()
                this.clearSelection()
                nodes.forEach(node => node.remove({ deep: true }))
                this.markDirty()
                return
            }
            this.removeSelectedNode()
        },
        handleEditorKeydown(event) {
            const target = event.target
            const editing = target && (
                ['INPUT', 'TEXTAREA'].includes(target.tagName) ||
                target.isContentEditable
            )
            if (editing) return
            const key = String(event.key || '').toLowerCase()
            const command = event.ctrlKey || event.metaKey
            if (command && key === 'z') {
                event.preventDefault()
                event.shiftKey ? this.redoDiagram() : this.undoDiagram()
            } else if (command && key === 'y') {
                event.preventDefault()
                this.redoDiagram()
            } else if (command && key === 'c') {
                event.preventDefault()
                this.copySelection()
            } else if (command && key === 'v') {
                event.preventDefault()
                this.pasteSelection()
            } else if (key === 'delete' || key === 'backspace') {
                event.preventDefault()
                this.removeCurrentSelection()
            } else if (key === 'enter' && this.selectedNode) {
                event.preventDefault()
                this.startInlineEdit(this.selectedNode)
            } else if (key === 'escape') {
                this.closePropertyPanel()
                this.clearSelection()
            }
        },
        startShapeDrag(event, shapeType) {
            this.shapeDragActive = true
            event.dataTransfer.effectAllowed = 'copy'
            event.dataTransfer.setData(SHAPE_MIME, shapeType)
            event.dataTransfer.setData('text/plain', shapeType)
        },
        finishShapeDrag() {
            window.setTimeout(() => {
                this.shapeDragActive = false
            }, 0)
        },
        addShapeAtViewportCenter(shapeType) {
            if (this.shapeDragActive || !this.graph || !this.$refs.canvasWrap) return
            const box = this.$refs.canvasWrap.getBoundingClientRect()
            const panelWidth = this.propertyPanelVisible ? 360 : 0
            const offset = this.quickAddOffset
            const point = this.graph.clientToLocal(
                box.left + (box.width - panelWidth) / 2 + offset,
                box.top + box.height / 2 + offset
            )
            this.quickAddOffset = (this.quickAddOffset + 24) % 120
            this.createShapeAtPoint(shapeType, point, true)
        },
        handleCanvasDrop(event) {
            const shapeType = event.dataTransfer.getData(SHAPE_MIME) || event.dataTransfer.getData('text/plain')
            if (!this.graph) return
            const point = this.graph.clientToLocal(event.clientX, event.clientY)
            this.createShapeAtPoint(shapeType, point, true)
        },
        createShapeAtPoint(shapeType, point, editAfterCreate = false) {
            if (!this.graph) return
            let node = null
            if (shapeType === 'layer') {
                node = this.graph.addNode(this.createLayerNodeConfig({
                    id: `layer-${Date.now()}`,
                    name: '架构层',
                    x: Math.max(20, point.x - 320),
                    y: Math.max(20, point.y - 60),
                    width: 640,
                    height: 120,
                    tone: LAYER_TONES.default
                }))
            } else if (SHAPE_CONFIG[shapeType]) {
                node = this.graph.addNode(this.createNodeConfig(shapeType, point, SHAPE_CONFIG[shapeType]))
            }
            if (!node) return
            this.markDirty()
            this.selectNode(node)
            this.scheduleCanvasResize()
            if (editAfterCreate) this.$nextTick(() => this.startInlineEdit(node))
        },
        createNodeConfig(shapeType, point, config) {
            const isContainer = shapeType === 'container'
            const nodeConfig = {
                shape: 'rect',
                x: Math.max(0, point.x - config.width / 2),
                y: Math.max(0, point.y - (isContainer ? 28 : config.height / 2)),
                width: config.width,
                height: config.height,
                zIndex: isContainer ? 1 : 10,
                attrs: {
                    body: {
                        fill: config.fill,
                        stroke: config.stroke,
                        strokeWidth: 1.5,
                        strokeDasharray: config.dashed ? '8 5' : '',
                        rx: config.rx,
                        ry: config.ry
                    },
                    label: {
                        text: config.label,
                        fill: config.textColor,
                        fontSize: isContainer ? 16 : 15,
                        fontWeight: 600,
                        textWrap: isContainer ? null : {
                            width: -14,
                            height: -10,
                            ellipsis: true
                        },
                        refX: isContainer ? 16 : 0.5,
                        refY: isContainer ? 22 : 0.5,
                        textAnchor: isContainer ? 'start' : 'middle',
                        textVerticalAnchor: 'middle'
                    }
                },
                data: {
                    kind: 'model-node',
                    shapeType,
                    label: config.label,
                    style: {
                        fill: config.fill,
                        stroke: config.stroke,
                        textColor: config.textColor
                    }
                }
            }
            if (shapeType === 'rectangle') {
                nodeConfig.ports = {
                    groups: this.portGroups(),
                    items: this.portItems()
                }
            }
            return nodeConfig
        },
        createLayerNodeConfig({ id, name, x, y, width, height, tone }) {
            const titleWidth = 132
            return {
                id,
                shape: 'rect',
                x,
                y,
                width,
                height,
                zIndex: 1,
                markup: [
                    { tagName: 'rect', selector: 'body' },
                    { tagName: 'rect', selector: 'titleBody' },
                    { tagName: 'rect', selector: 'titleBodySquare' },
                    { tagName: 'path', selector: 'divider' },
                    { tagName: 'text', selector: 'label' }
                ],
                ports: {
                    groups: this.portGroups(),
                    items: this.portItems()
                },
                attrs: {
                    body: {
                        fill: tone.fill,
                        stroke: tone.stroke,
                        strokeWidth: 1.5,
                        rx: 38,
                        ry: 38
                    },
                    titleBody: {
                        x: 0,
                        y: 0,
                        width: titleWidth,
                        height,
                        fill: tone.titleFill,
                        stroke: 'none',
                        rx: 38,
                        ry: 38
                    },
                    titleBodySquare: {
                        x: 38,
                        y: 0,
                        width: titleWidth - 38,
                        height,
                        fill: tone.titleFill,
                        stroke: 'none'
                    },
                    divider: {
                        d: `M ${titleWidth} 0 L ${titleWidth} ${height}`,
                        stroke: tone.stroke,
                        strokeWidth: 1.2
                    },
                    label: {
                        text: name,
                        refX: titleWidth / (2 * width),
                        refY: 0.5,
                        fill: '#2f4058',
                        fontSize: 16,
                        fontWeight: 700,
                        textAnchor: 'middle',
                        textVerticalAnchor: 'middle',
                        textWrap: {
                            width: titleWidth - 20,
                            height: height - 16,
                            ellipsis: true
                        }
                    }
                },
                data: {
                    kind: 'model-node',
                    shapeType: 'layer',
                    label: name,
                    titleWidth,
                    style: {
                        fill: tone.fill,
                        stroke: tone.stroke,
                        textColor: '#2f4058'
                    }
                }
            }
        },
        createGroupNodeConfig({ id, parent, name, x, y, width, height }) {
            return {
                id,
                parent,
                shape: 'rect',
                x,
                y,
                width,
                height,
                zIndex: 2,
                attrs: {
                    body: {
                        fill: '#ffffff',
                        fillOpacity: 0.82,
                        stroke: '#b8d1ef',
                        strokeWidth: 1.2,
                        rx: 14,
                        ry: 14
                    },
                    label: {
                        text: name || '',
                        fill: '#52647b',
                        fontSize: 13,
                        fontWeight: 600,
                        refX: 0.5,
                        refY: name ? 18 : 0.5,
                        textAnchor: 'middle',
                        textVerticalAnchor: 'middle'
                    }
                },
                data: {
                    kind: 'model-group',
                    label: name || ''
                }
            }
        },
        portGroups() {
            const createGroup = position => ({
                position,
                attrs: {
                    circle: {
                        r: 5,
                        magnet: true,
                        stroke: '#2f63dc',
                        strokeWidth: 1.5,
                        fill: '#ffffff',
                        opacity: 0
                    }
                }
            })
            return {
                top: createGroup('top'),
                right: createGroup('right'),
                bottom: createGroup('bottom'),
                left: createGroup('left')
            }
        },
        portItems() {
            return ['top', 'right', 'bottom', 'left'].map(group => ({ id: group, group }))
        },
        isConnectableNode(node) {
            if (!node || !node.isNode()) return false
            const data = node.getData() || {}
            return data.kind === 'model-node' && ['layer', 'rectangle'].includes(data.shapeType)
        },
        syncCompositeNodeGeometry(node) {
            if (!node || !node.isNode()) return
            const data = node.getData() || {}
            if (data.shapeType !== 'layer') return
            const size = node.getSize()
            const titleWidth = data.titleWidth || 156
            node.attr({
                titleBody: { height: size.height },
                titleBodySquare: { height: size.height },
                divider: { d: `M ${titleWidth} 0 L ${titleWidth} ${size.height}` },
                label: {
                    text: data.label || '架构层',
                    x: null,
                    y: null,
                    refX: titleWidth / (2 * size.width),
                    refY: 0.5,
                    transform: null
                }
            })
        },
        scheduleCanvasResize() {
            this.$nextTick(() => this.ensureCanvasSize())
        },
        ensureCanvasSize() {
            if (!this.graph || !this.$refs.canvasScroller) return
            const nodes = this.graph.getNodes()
            const maxRight = nodes.reduce((value, node) => {
                const box = node.getBBox()
                return Math.max(value, box.x + box.width)
            }, 0)
            const maxBottom = nodes.reduce((value, node) => {
                const box = node.getBBox()
                return Math.max(value, box.y + box.height)
            }, 0)
            const scroller = this.$refs.canvasScroller
            const nextWidth = Math.max(800, scroller.clientWidth, Math.ceil(maxRight + 160))
            const nextHeight = Math.max(600, scroller.clientHeight, Math.ceil(maxBottom + 160))
            if (nextWidth === this.canvasWidth && nextHeight === this.canvasHeight) return
            this.canvasWidth = nextWidth
            this.canvasHeight = nextHeight
            this.$nextTick(() => {
                if (this.graph) this.graph.resize(this.canvasWidth, this.canvasHeight)
            })
        },
        getSelectedActionNodes() {
            if (!this.graph || typeof this.graph.getSelectedCells !== 'function') return []
            const nodes = this.graph.getSelectedCells().filter(cell => (
                cell.isNode() && (cell.getData() || {}).kind !== 'model-group'
            ))
            const selectedIds = new Set(nodes.map(node => node.id))
            return nodes.filter(node => {
                let parent = node.getParent()
                while (parent) {
                    if (selectedIds.has(parent.id)) return false
                    parent = parent.getParent()
                }
                return true
            })
        },
        alignSelectedNodes(direction) {
            const nodes = this.getSelectedActionNodes()
            if (nodes.length < 2) {
                this.$message.warning('请按住 Ctrl 多选或在画布空白处框选至少两个节点')
                return
            }
            const boxes = nodes.map(node => node.getBBox())
            const left = Math.min(...boxes.map(box => box.x))
            const right = Math.max(...boxes.map(box => box.x + box.width))
            const top = Math.min(...boxes.map(box => box.y))
            const bottom = Math.max(...boxes.map(box => box.y + box.height))
            nodes.forEach((node, index) => {
                const box = boxes[index]
                let x = box.x
                let y = box.y
                if (direction === 'left') x = left
                if (direction === 'center') x = (left + right - box.width) / 2
                if (direction === 'right') x = right - box.width
                if (direction === 'top') y = top
                if (direction === 'middle') y = (top + bottom - box.height) / 2
                if (direction === 'bottom') y = bottom - box.height
                node.position(x, y, { deep: true })
            })
            this.markDirty()
            this.scheduleCanvasResize()
        },
        distributeSelectedNodes(direction) {
            const nodes = this.getSelectedActionNodes()
            if (nodes.length < 3) {
                this.$message.warning('等距分布至少需要选择三个节点')
                return
            }
            const horizontal = direction === 'horizontal'
            const sorted = nodes.slice().sort((a, b) => {
                const aBox = a.getBBox()
                const bBox = b.getBBox()
                return (horizontal ? aBox.x : aBox.y) - (horizontal ? bBox.x : bBox.y)
            })
            const firstBox = sorted[0].getBBox()
            const lastBox = sorted[sorted.length - 1].getBBox()
            const start = horizontal ? firstBox.x : firstBox.y
            const end = horizontal
                ? lastBox.x + lastBox.width
                : lastBox.y + lastBox.height
            const totalSize = sorted.reduce((value, node) => {
                const box = node.getBBox()
                return value + (horizontal ? box.width : box.height)
            }, 0)
            const gap = (end - start - totalSize) / (sorted.length - 1)
            let cursor = start
            sorted.forEach(node => {
                const box = node.getBBox()
                if (horizontal) node.position(cursor, box.y, { deep: true })
                else node.position(box.x, cursor, { deep: true })
                cursor += (horizontal ? box.width : box.height) + gap
            })
            this.markDirty()
            this.scheduleCanvasResize()
        },
        createEdgeConfig() {
            return {
                zIndex: 5,
                attrs: {
                    line: {
                        stroke: '#64748b',
                        strokeWidth: 1.6,
                        targetMarker: {
                            name: 'classic',
                            size: 8
                        }
                    }
                },
                data: {
                    kind: 'model-relation',
                    relation: {
                        type: 'call',
                        protocol: '',
                        label: ''
                    },
                    style: {
                        stroke: '#64748b',
                        dashed: false
                    }
                }
            }
        },
        selectNode(node) {
            if (this.graph && typeof this.graph.isSelected === 'function' && !this.graph.isSelected(node)) {
                this.graph.cleanSelection()
                this.graph.select(node)
            }
            if (this.selectedNode && this.selectedNode.id !== node.id) this.setNodeSelected(this.selectedNode, false)
            if (this.selectedEdge) this.setEdgeSelected(this.selectedEdge, false)
            this.selectedEdge = null
            this.selectedNode = node
            this.setNodeSelected(node, true)
            const data = node.getData() || {}
            const size = node.getSize()
            this.nodeForm = {
                shapeType: data.shapeType || 'rectangle',
                label: data.label || node.attr('label/text') || '',
                width: Math.round(size.width),
                height: Math.round(size.height),
                fill: (data.style && data.style.fill) || node.attr('body/fill') || '#ffffff',
                stroke: (data.style && data.style.stroke) || node.attr('body/stroke') || '#d1d5db',
                textColor: (data.style && data.style.textColor) || node.attr('label/fill') || '#334155',
                sourceType: (data.binding && data.binding.sourceType) || '',
                sourceId: (data.binding && data.binding.sourceId) || '',
                displayFields: (data.binding && data.binding.displayFields) || []
            }
            this.refreshContextPosition()
        },
        selectEdge(edge) {
            if (this.graph && typeof this.graph.cleanSelection === 'function') this.graph.cleanSelection()
            if (this.selectedNode) this.setNodeSelected(this.selectedNode, false)
            if (this.selectedEdge && this.selectedEdge.id !== edge.id) this.setEdgeSelected(this.selectedEdge, false)
            this.selectedNode = null
            this.selectedEdge = edge
            this.setEdgeSelected(edge, true)
            const data = edge.getData() || {}
            const relation = data.relation || {}
            const style = data.style || {}
            this.edgeForm = {
                relationType: relation.type || 'call',
                protocol: relation.protocol || '',
                label: relation.label || '',
                stroke: style.stroke || edge.attr('line/stroke') || '#64748b',
                dashed: Boolean(style.dashed)
            }
            this.refreshContextPosition()
        },
        clearSelection() {
            this.cancelInlineEdit()
            if (this.selectedNode) this.setNodeSelected(this.selectedNode, false)
            if (this.selectedEdge) this.setEdgeSelected(this.selectedEdge, false)
            this.selectedNode = null
            this.selectedEdge = null
            if (this.graph && typeof this.graph.cleanSelection === 'function') {
                this.graph.cleanSelection()
            }
        },
        setNodeSelected(node, selected) {
            if (!node || !node.isNode()) return
            node.attr('body/strokeWidth', selected ? 2.5 : 1.5, { transient: true })
        },
        setEdgeSelected(edge, selected) {
            if (!edge || !edge.isEdge()) return
            edge.attr('line/strokeWidth', selected ? 3 : 1.6, { transient: true })
        },
        applyNodeProperties() {
            const node = this.selectedNode
            if (!node) return
            const isContainer = this.nodeForm.shapeType === 'container'
            const isLayer = this.nodeForm.shapeType === 'layer'
            const shapeConfig = SHAPE_CONFIG[this.nodeForm.shapeType] || SHAPE_CONFIG.rectangle
            node.resize(this.nodeForm.width, this.nodeForm.height)
            node.attr({
                body: {
                    fill: this.nodeForm.fill,
                    stroke: this.nodeForm.stroke,
                    strokeWidth: 2.5,
                    rx: isLayer ? 38 : shapeConfig.rx,
                    ry: isLayer ? 38 : shapeConfig.ry,
                    strokeDasharray: shapeConfig.dashed ? '8 5' : ''
                },
                label: {
                    text: this.nodeForm.label,
                    fill: this.nodeForm.textColor,
                    refX: isContainer ? 16 : (isLayer ? null : 0.5),
                    refY: isContainer ? 22 : (isLayer ? null : 0.5),
                    textAnchor: isContainer ? 'start' : 'middle'
                }
            })
            const data = node.getData() || {}
            if (isLayer) {
                const titleWidth = data.titleWidth || 132
                node.attr({
                    titleBody: { height: this.nodeForm.height, fill: this.nodeForm.fill },
                    titleBodySquare: { height: this.nodeForm.height, fill: this.nodeForm.fill },
                    divider: { d: `M ${titleWidth} 0 L ${titleWidth} ${this.nodeForm.height}` },
                    label: {
                        text: this.nodeForm.label,
                        x: null,
                        y: null,
                        refX: titleWidth / (2 * this.nodeForm.width),
                        refY: 0.5,
                        transform: null
                    }
                })
            }
            node.setData({
                ...data,
                shapeType: this.nodeForm.shapeType,
                label: this.nodeForm.label,
                style: {
                    fill: this.nodeForm.fill,
                    stroke: this.nodeForm.stroke,
                    textColor: this.nodeForm.textColor
                },
                binding: {
                    sourceType: this.nodeForm.sourceType,
                    sourceId: this.nodeForm.sourceId,
                    displayFields: this.nodeForm.displayFields
                }
            })
            const shouldHavePorts = ['layer', 'rectangle'].includes(this.nodeForm.shapeType)
            if (shouldHavePorts && !node.getPorts().length) {
                node.prop('ports/groups', this.portGroups())
                node.addPorts(this.portItems())
            } else if (!shouldHavePorts && node.getPorts().length) {
                node.removePorts()
            }
            this.markDirty()
            this.scheduleCanvasResize()
            this.refreshContextPosition()
        },
        handleSourceTypeChange() {
            this.nodeForm.sourceId = ''
            this.nodeForm.displayFields = []
            this.applyNodeProperties()
        },
        handleSourceRecordChange() {
            this.nodeForm.displayFields = this.nodeForm.sourceId ? ['name'] : []
            this.applyBindingLabel()
        },
        applyBindingLabel() {
            const record = this.currentSourceRecords.find(item => item.id === this.nodeForm.sourceId)
            if (record && this.nodeForm.displayFields.length) {
                this.nodeForm.label = this.nodeForm.displayFields
                    .map(field => record[field])
                    .filter(value => value !== undefined && value !== null && value !== '')
                    .join('\n')
            }
            this.applyNodeProperties()
        },
        sourceRecordLabel(record) {
            const extra = record.code || record.version || record.interface || record.area || ''
            return extra ? `${record.name}（${extra}）` : record.name
        },
        applyEdgeProperties() {
            const edge = this.selectedEdge
            if (!edge) return
            const stroke = this.edgeForm.stroke || '#64748b'
            edge.attr({
                line: {
                    stroke,
                    strokeWidth: 3,
                    strokeDasharray: this.edgeForm.dashed ? '8 5' : '',
                    targetMarker: {
                        name: 'classic',
                        size: 8,
                        fill: stroke,
                        stroke
                    }
                }
            })
            const label = [
                this.relationLabel(this.edgeForm.relationType),
                this.edgeForm.protocol,
                this.edgeForm.label
            ].filter(Boolean).join(' · ')
            edge.setLabels(label ? [{
                position: 0.5,
                attrs: {
                    label: {
                        text: label,
                        fill: '#475569',
                        fontSize: 12
                    }
                }
            }] : [])
            const data = edge.getData() || {}
            edge.setData({
                ...data,
                relation: {
                    type: this.edgeForm.relationType,
                    protocol: this.edgeForm.protocol,
                    label: this.edgeForm.label
                },
                style: {
                    stroke,
                    dashed: this.edgeForm.dashed
                }
            })
            this.markDirty()
        },
        relationLabel(relationType) {
            const item = this.relationTypes.find(relation => relation.value === relationType)
            return item ? item.label : '关系'
        },
        generateArchitectureTemplate() {
            const layers = DIAGRAM_LAYER_DATA[this.diagramType] || []
            if (!layers.length) {
                this.$message.warning('当前图类型暂未配置架构数据')
                return
            }
            const generate = () => this.applyArchitectureTemplate(layers)
            if (!this.graph || !this.graph.getCells().length) {
                generate()
                return
            }
            this.$confirm('生成当前架构会替换画布中的现有内容，是否继续？', '生成架构模板', {
                confirmButtonText: '生成',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(generate).catch(() => {})
        },
        applyArchitectureTemplate(layers) {
            if (!this.graph) return
            this.restoring = true
            this.clearSelection()
            this.graph.clearCells()
            const viewportWidth = this.$refs.canvasScroller ? this.$refs.canvasScroller.clientWidth : 1360
            const layerX = 50
            const layerWidth = Math.max(760, Math.min(1260, viewportWidth - 100))
            const titleWidth = 132
            const contentPadding = 14
            const groupGap = 12
            const itemWidth = 126
            const itemHeight = 44
            const itemGap = 10
            let layerY = 50
            let previousLayerId = ''

            layers.forEach((layer, layerIndex) => {
                const groups = layer.groups && layer.groups.length ? layer.groups : [{ name: '', items: [] }]
                const contentWidth = layerWidth - titleWidth - contentPadding * 2
                const groupWidth = (contentWidth - groupGap * Math.max(0, groups.length - 1)) / groups.length
                const groupMetrics = groups.map(group => {
                    const columns = Math.max(1, Math.floor((groupWidth - 24 + itemGap) / (itemWidth + itemGap)))
                    const rows = Math.max(1, Math.ceil((group.items || []).length / columns))
                    const top = group.name ? 38 : 16
                    return {
                        columns,
                        rows,
                        height: top + rows * itemHeight + Math.max(0, rows - 1) * 10 + 16
                    }
                })
                const layerHeight = Math.max(126, Math.max(...groupMetrics.map(item => item.height)) + 28)
                const toneName = layer.tone || ['green', 'yellow', 'blue', 'default', 'orange'][layerIndex % 5]
                const tone = LAYER_TONES[toneName] || LAYER_TONES.default
                const layerId = `template-layer-${layerIndex}`
                const layerNode = this.graph.addNode(this.createLayerNodeConfig({
                    id: layerId,
                    name: layer.name,
                    x: layerX,
                    y: layerY,
                    width: layerWidth,
                    height: layerHeight,
                    tone
                }))

                groups.forEach((group, groupIndex) => {
                    const groupId = `${layerId}-group-${groupIndex}`
                    const groupX = layerX + titleWidth + contentPadding + groupIndex * (groupWidth + groupGap)
                    const groupY = layerY + 14
                    const groupHeight = layerHeight - 28
                    const groupNode = this.graph.addNode(this.createGroupNodeConfig({
                        id: groupId,
                        parent: layerId,
                        name: group.name,
                        x: groupX,
                        y: groupY,
                        width: groupWidth,
                        height: groupHeight
                    }))
                    layerNode.addChild(groupNode)
                    const metrics = groupMetrics[groupIndex]
                    const items = group.items || []
                    const itemStartY = groupY + (group.name ? 38 : 16)
                    items.forEach((name, itemIndex) => {
                        const row = Math.floor(itemIndex / metrics.columns)
                        const column = itemIndex % metrics.columns
                        const rowCount = Math.min(metrics.columns, items.length - row * metrics.columns)
                        const rowWidth = rowCount * itemWidth + Math.max(0, rowCount - 1) * itemGap
                        const firstX = groupX + (groupWidth - rowWidth) / 2
                        const x = firstX + column * (itemWidth + itemGap)
                        const y = itemStartY + row * (itemHeight + 10)
                        const itemConfig = this.createNodeConfig('rounded', {
                            x: x + itemWidth / 2,
                            y: y + itemHeight / 2
                        }, {
                            ...SHAPE_CONFIG.rectangle,
                            label: String(name),
                            width: itemWidth,
                            height: itemHeight,
                            rx: 8,
                            ry: 8
                        })
                        itemConfig.id = `${groupId}-item-${itemIndex}`
                        itemConfig.parent = groupId
                        itemConfig.data.templateGenerated = true
                        const itemNode = this.graph.addNode(itemConfig)
                        groupNode.addChild(itemNode)
                    })
                })

                if (previousLayerId) {
                    const protocol = layers[layerIndex - 1].protocol || ''
                    const edgeConfig = this.createEdgeConfig()
                    edgeConfig.id = `template-edge-${layerIndex - 1}-${layerIndex}`
                    edgeConfig.source = { cell: previousLayerId, anchor: { name: 'bottom' } }
                    edgeConfig.target = { cell: layerId, anchor: { name: 'top' } }
                    edgeConfig.data.relation.protocol = protocol
                    edgeConfig.data.relation.label = ''
                    if (protocol) {
                        edgeConfig.labels = [{
                            position: 0.5,
                            attrs: {
                                label: {
                                    text: protocol,
                                    fill: '#475569',
                                    fontSize: 12
                                }
                            }
                        }]
                    }
                    this.graph.addEdge(edgeConfig)
                }
                previousLayerId = layerId
                layerY += layerHeight + 70
            })

            this.restoring = false
            this.syncNodeCount()
            this.syncEdgeCount()
            this.dirty = true
            this.$nextTick(() => {
                this.ensureCanvasSize()
                this.fitContent()
            })
        },
        removeSelectedNode() {
            if (!this.selectedNode || !this.graph) return
            const node = this.selectedNode
            this.closePropertyPanel()
            this.selectedNode = null
            node.remove({ deep: true })
            this.markDirty()
        },
        removeSelectedEdge() {
            if (!this.selectedEdge || !this.graph) return
            const edge = this.selectedEdge
            this.closePropertyPanel()
            this.selectedEdge = null
            this.graph.removeEdge(edge)
            this.markDirty()
        },
        clearCanvas() {
            if (!this.graph || !this.graph.getNodes().length) return
            this.$confirm('确定清空当前模型画布吗？', '清空画布', {
                confirmButtonText: '清空',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.clearSelection()
                this.graph.clearCells()
                this.markDirty()
            }).catch(() => {})
        },
        saveDiagram() {
            if (!this.graph) return
            const selectedNode = this.selectedNode
            const selectedEdge = this.selectedEdge
            if (selectedNode) this.setNodeSelected(selectedNode, false)
            if (selectedEdge) this.setEdgeSelected(selectedEdge, false)
            const graph = this.graph.toJSON()
            if (selectedNode) this.setNodeSelected(selectedNode, true)
            if (selectedEdge) this.setEdgeSelected(selectedEdge, true)
            try {
                saveModelDiagram(this.diagramContext, graph, {
                    diagramName: this.diagramTitle
                })
                this.dirty = false
                this.$message.success('模型图已保存，返回查看页即可展示')
            } catch (error) {
                this.$message.error('模型图保存失败，请检查本地存储空间')
            }
        },
        restoreDiagram() {
            const record = loadModelDiagram(this.diagramContext)
            if (!this.graph) return
            if (!record) {
                this.graph.cleanHistory()
                this.syncNodeCount()
                this.syncEdgeCount()
                this.dirty = false
                this.updateHistoryState()
                return
            }
            try {
                this.restoring = true
                this.graph.fromJSON(record.graph || record)
                this.graph.getNodes().forEach(node => {
                    if (this.isConnectableNode(node) && !node.getPorts().length) {
                        node.prop('ports/groups', this.portGroups())
                        node.addPorts(this.portItems())
                    }
                    if (!this.isConnectableNode(node) && node.getPorts().length) node.removePorts()
                    this.syncCompositeNodeGeometry(node)
                })
                this.graph.getEdges().forEach(edge => {
                    const source = edge.getSource()
                    const target = edge.getTarget()
                    const sourceCell = source && source.cell ? this.graph.getCellById(source.cell) : null
                    const targetCell = target && target.cell ? this.graph.getCellById(target.cell) : null
                    if (source && source.port && sourceCell && !this.isConnectableNode(sourceCell)) {
                        edge.setSource({ cell: source.cell, anchor: { name: 'bottom' } })
                    }
                    if (target && target.port && targetCell && !this.isConnectableNode(targetCell)) {
                        edge.setTarget({ cell: target.cell, anchor: { name: 'top' } })
                    }
                })
                this.syncNodeCount()
                this.syncEdgeCount()
                this.$nextTick(() => this.fitContent())
            } catch (error) {
                this.$message.warning('已保存的模型图无法读取，将使用空白画布')
            } finally {
                this.restoring = false
                this.dirty = false
                if (this.graph && this.graph.cleanHistory) this.graph.cleanHistory()
                this.updateHistoryState()
            }
        },
        changeCanvasZoom(delta) {
            if (!this.graph) return
            const current = this.graph.zoom()
            const next = Math.max(0.5, Math.min(1.6, Number((current + delta).toFixed(1))))
            this.graph.zoomTo(next)
            this.zoomPercent = Math.round(next * 100)
            this.refreshContextPosition()
        },
        fitContent() {
            if (!this.graph) return
            if (!this.graph.getNodes().length) {
                this.graph.zoomTo(1)
                this.zoomPercent = 100
                return
            }
            this.ensureCanvasSize()
            this.$nextTick(() => {
                if (!this.graph) return
                this.graph.zoomToFit({ padding: 60, maxScale: 1 })
                this.graph.centerContent()
                this.refreshContextPosition()
            })
        },
        syncNodeCount() {
            this.nodeCount = this.graph
                ? this.graph.getNodes().filter(node => (node.getData() || {}).kind !== 'model-group').length
                : 0
        },
        syncEdgeCount() {
            this.edgeCount = this.graph ? this.graph.getEdges().length : 0
        },
        markDirty() {
            if (!this.restoring) this.dirty = true
        },
        shapeLabel(shapeType) {
            const item = this.shapeOptions.find(shape => shape.type === shapeType)
            return item ? item.label : '节点'
        },
        goBack() {
            this.$router.replace({
                name: 'aopAssetcenterApplicationPanorama',
                query: {
                    diagram: this.diagramType,
                    system: this.systemKey,
                    version: this.diagramVersion
                }
            })
        }
    }
}
</script>

<style scoped>
.model-editor-page {
    position: fixed;
    z-index: 2100;
    inset: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f3f6fa;
    color: #263244;
}
.model-editor-header {
    display: flex;
    align-items: center;
    flex: 0 0 68px;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid #dfe6ef;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 2px 10px rgba(30, 41, 59, .06);
}
.model-editor-title,
.model-editor-actions { display: flex; align-items: center; gap: 8px; }
.model-editor-title > div { display: flex; flex-direction: column; gap: 3px; }
.model-editor-title strong { font-size: 17px; }
.model-editor-title span { color: #8a96a7; font-size: 12px; }
.toolbar-divider { width: 1px; height: 22px; margin: 0 3px; background: #e1e7ef; }
.zoom-control { display: inline-flex; align-items: center; height: 32px; overflow: hidden; border: 1px solid #dcdfe6; border-radius: 4px; background: #fff; }
.zoom-control button { width: 34px; height: 32px; padding: 0; border: 0; border-right: 1px solid #ebeef5; background: #fff; color: #5c6b7e; cursor: pointer; }
.zoom-control button:last-child { border-right: 0; border-left: 1px solid #ebeef5; }
.zoom-control button:hover { background: #f4f8ff; color: #2f63dc; }
.zoom-control span { min-width: 52px; color: #64748b; text-align: center; font-size: 12px; }
.model-editor-workspace {
    position: relative;
    display: grid;
    min-height: 0;
    flex: 1;
    grid-template-columns: 112px minmax(0, 1fr);
    border-top: 1px solid #edf1f6;
    background: #fff;
}
.model-editor-palette { z-index: 4; overflow: auto; border-right: 1px solid #e2e8f0; background: #fff; }
.palette-title { padding: 15px 12px 9px; color: #8794a7; text-align: center; font-size: 12px; font-weight: 600; }
.shape-list { display: grid; gap: 8px; padding: 4px 10px 12px; }
.shape-item {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 7px;
    padding: 10px 6px 8px;
    border: 1px solid transparent;
    border-radius: 8px;
    cursor: grab;
    transition: border-color .15s, background .15s, transform .15s;
}
.shape-item:hover { border-color: #c9daf9; background: #f4f8ff; transform: translateY(-1px); }
.shape-item:active { cursor: grabbing; }
.shape-item b { color: #536277; font-size: 12px; font-weight: 500; }
.shape-preview {
    position: relative;
    display: grid;
    width: 60px;
    height: 34px;
    flex: 0 0 auto;
    place-items: center;
    border: 1.5px solid #7aa7f8;
    box-sizing: border-box;
    background: #eaf2ff;
}
.shape-preview--rounded { border-color: #86c96b; border-radius: 9px; background: #effbea; }
.shape-preview--layer { height: 40px; border-color: #9bbfe9; border-radius: 11px; background: #f4f9ff; }
.shape-preview--layer::before { position: absolute; top: 0; bottom: 0; left: 0; width: 16px; border-right: 1px solid #9bbfe9; border-radius: 11px 0 0 11px; background: #e2effc; content: ''; }
.shape-preview--container { height: 40px; border-color: #94a3b8; border-radius: 5px; border-style: dashed; background: #f8fafc; }
.shape-preview--container i { position: absolute; top: 4px; left: 6px; color: #64748b; font-size: 9px; font-style: normal; }
.palette-tip {
    margin: 8px 10px;
    padding: 10px 6px;
    border-radius: 7px;
    background: #f5f8fc;
    color: #718096;
    text-align: center;
    font-size: 12px;
    line-height: 1.7;
}
.palette-tip i { display: block; margin-bottom: 3px; color: #4c83df; }
.model-editor-canvas-wrap { position: relative; min-width: 0; min-height: 0; overflow: hidden; background: #f8fbff; }
.model-editor-canvas-scroll { position: absolute; inset: 0; overflow: auto; overscroll-behavior: contain; }
.model-editor-canvas { position: relative; min-width: 100%; min-height: 100%; }
.model-editor-canvas ::v-deep .x6-node:hover .x6-port-body,
.model-editor-canvas ::v-deep .x6-port-body:hover { opacity: 1 !important; }
.model-editor-canvas ::v-deep .x6-edge-label text { paint-order: stroke; stroke: #fff; stroke-width: 5px; stroke-linejoin: round; }
.model-editor-canvas ::v-deep .x6-widget-transform { border: 1px solid #2f63dc; }
.model-editor-canvas ::v-deep .x6-widget-transform-resize { width: 9px; height: 9px; border: 1px solid #2f63dc; background: #fff; }
.canvas-quick-guide {
    position: absolute;
    z-index: 3;
    top: 14px;
    left: 16px;
    display: flex;
    gap: 18px;
    padding: 8px 12px;
    border: 1px solid #e4eaf2;
    border-radius: 7px;
    background: rgba(255, 255, 255, .9);
    box-shadow: 0 3px 12px rgba(30, 41, 59, .05);
    color: #7b899c;
    font-size: 12px;
    pointer-events: none;
}
.cell-context-toolbar {
    position: absolute;
    z-index: 12;
    display: flex;
    align-items: center;
    padding: 4px;
    border: 1px solid #dce4ef;
    border-radius: 7px;
    background: #fff;
    box-shadow: 0 7px 22px rgba(31, 53, 82, .18);
    transform: translateX(-50%);
}
.cell-context-toolbar button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
    height: 30px;
    padding: 0 8px;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: #53647a;
    cursor: pointer;
}
.cell-context-toolbar button:hover { background: #edf4ff; color: #2f63dc; }
.cell-context-toolbar button.danger:hover { background: #fff0f0; color: #e05252; }
.cell-context-toolbar > span { width: 1px; height: 20px; margin: 0 3px; background: #e5eaf0; }
.node-inline-editor { position: absolute; z-index: 15; }
.node-inline-editor ::v-deep .el-input__inner { border-color: #2f63dc; text-align: center; box-shadow: 0 0 0 2px rgba(47, 99, 220, .12); }
.canvas-empty-hint {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    color: #9aa7b8;
    pointer-events: none;
    transform: translate(-50%, -50%);
}
.canvas-empty-hint .empty-icon { display: grid; width: 54px; height: 54px; border: 1px dashed #94b7ec; border-radius: 14px; background: #f0f6ff; place-items: center; }
.canvas-empty-hint i { color: #5d8fe0; font-size: 24px; }
.canvas-empty-hint strong { color: #52647b; font-size: 16px; }
.canvas-empty-hint span { font-size: 13px; }
.canvas-status {
    position: absolute;
    z-index: 3;
    right: 14px;
    bottom: 12px;
    padding: 6px 10px;
    border: 1px solid #dfe6ef;
    border-radius: 6px;
    background: rgba(255, 255, 255, .92);
    color: #7b899c;
    font-size: 12px;
    pointer-events: none;
}
.canvas-status span { color: #d97706; }
.model-property-drawer {
    position: absolute;
    z-index: 20;
    top: 0;
    right: 0;
    bottom: 0;
    width: 360px;
    overflow: auto;
    border-left: 1px solid #dfe6ef;
    background: #fff;
    box-shadow: -8px 0 24px rgba(30, 41, 59, .1);
}
.property-drawer-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 18px 14px; border-bottom: 1px solid #edf1f5; }
.property-drawer-header > div { display: flex; flex-direction: column; gap: 3px; }
.property-drawer-header strong { font-size: 16px; }
.property-drawer-header span { color: #93a0b1; font-size: 12px; }
.property-drawer-header button { width: 32px; height: 32px; border: 0; border-radius: 6px; background: transparent; color: #7b899c; cursor: pointer; }
.property-drawer-header button:hover { background: #f2f5f9; }
.property-tabs ::v-deep .el-tabs__header { margin-bottom: 0; padding: 0 12px; }
.property-tabs ::v-deep .el-tabs__content { overflow: visible; }
.property-form { display: grid; gap: 18px; padding: 20px; }
.property-form label { display: flex; min-width: 0; flex-direction: column; gap: 7px; color: #66758a; font-size: 13px; }
.property-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.property-row ::v-deep .el-input-number { width: 100%; }
.binding-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 62px;
    padding: 12px;
    border: 1.5px solid;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    white-space: pre-line;
}
.display-field-list { display: grid; gap: 9px; padding: 12px; border: 1px solid #e4eaf2; border-radius: 6px; background: #fafcff; }
.display-field-list ::v-deep .el-checkbox { margin-right: 0; }
.property-note { padding: 10px 12px; border-radius: 6px; background: #f5f8fc; color: #8290a3; font-size: 12px; line-height: 1.65; }
.color-setting-list { display: grid; gap: 0; border: 1px solid #e4eaf2; border-radius: 7px; }
.color-setting-list label { display: flex; align-items: center; flex-direction: row; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid #edf1f5; }
.color-setting-list label:last-child { border-bottom: 0; }
.edge-property-form { padding-top: 24px; }
.toolbar-fade-enter-active, .toolbar-fade-leave-active { transition: opacity .15s, transform .15s; }
.toolbar-fade-enter, .toolbar-fade-leave-to { opacity: 0; transform: translate(-50%, 5px); }
.property-slide-enter-active, .property-slide-leave-active { transition: transform .2s ease, opacity .2s; }
.property-slide-enter, .property-slide-leave-to { opacity: 0; transform: translateX(100%); }
@media (max-width: 1100px) {
    .model-editor-header { padding: 0 12px; }
    .model-editor-actions { gap: 5px; }
    .model-editor-workspace { grid-template-columns: 96px minmax(0, 1fr); }
    .canvas-quick-guide { display: none; }
}
</style>
