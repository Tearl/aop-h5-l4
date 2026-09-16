<template>
    <div class="architecture-model-page">
        <aside class="architecture-model-page__sidebar">
            <div class="architecture-model-page__brand">
                <div class="architecture-model-page__brand-icon">{{ config.icon }}</div>
                <div class="architecture-model-page__brand-title">{{ config.title }}</div>
                <div class="architecture-model-page__brand-en">{{ config.english }}</div>
            </div>
            <div class="architecture-model-page__levels">
                <template v-for="(level, index) in config.levels">
                    <button
                        :key="level.key"
                        :class="[
                            'architecture-model-page__level',
                            { active: selectedLevel === level.key }
                        ]"
                        type="button"
                        @click="selectLevel(level.key)"
                    >
                        {{ level.label }}
                    </button>
                    <div
                        v-if="index < config.levels.length - 1"
                        :key="`${level.key}-line`"
                        class="architecture-model-page__level-line"
                    />
                </template>
            </div>
        </aside>

        <main ref="main" class="architecture-model-page__main">
            <header class="architecture-model-page__toolbar">
                <strong>{{ config.toolbarTitle }}</strong>
                <div class="architecture-model-page__tools">
                    <button type="button" title="缩小" @click="zoomBy(-0.1)">−</button>
                    <span>{{ zoomPercent }}%</span>
                    <button type="button" title="放大" @click="zoomBy(0.1)">+</button>
                    <button type="button" title="重置视图" @click="resetView">
                        <img
                            :src="require('@m/assets/images/refresh-reset.svg')"
                            width="16"
                            height="16"
                            alt=""
                            draggable="false"
                        >
                    </button>
                    <button type="button" title="全屏" @click="toggleFullscreen">⛶</button>
                </div>
            </header>

            <div
                ref="canvas"
                :class="['architecture-model-page__canvas', { dragging }]"
                @mousedown="startPan"
                @mousemove="movePan"
                @mouseup="stopPan"
                @mouseleave="stopPan"
            >
                <div
                    class="architecture-model-page__graph"
                    :style="{ transform: `scale(${zoom})` }"
                >
                    <template v-if="architectureType === 'application'">
                        <div class="application-architecture">
                            <section
                                :class="[
                                    'application-architecture__hierarchy',
                                    { focused: ['app-layer', 'app-domain', 'app-system'].includes(selectedLevel) }
                                ]"
                            >
                                <h2>应用层-应用域-应用系统结构图</h2>
                                <div class="application-architecture__structure">
                                    <div
                                        :class="[
                                            'application-architecture__layer-label',
                                            { active: selectedLevel === 'app-layer' }
                                        ]"
                                    >
                                        渠道场景层
                                    </div>
                                    <div
                                        :class="[
                                            'application-architecture__domains',
                                            { active: selectedLevel === 'app-domain' }
                                        ]"
                                    >
                                        <div
                                            v-for="domain in applicationDomains"
                                            :key="domain"
                                            class="application-architecture__domain"
                                        >
                                            <h3>{{ domain }}</h3>
                                            <div
                                                :class="[
                                                    'application-architecture__systems',
                                                    { active: selectedLevel === 'app-system' }
                                                ]"
                                            >
                                                <button
                                                    v-for="system in systemsForDomain(domain)"
                                                    :key="system.id"
                                                    :class="{ selected: selectedSystemId === system.id }"
                                                    type="button"
                                                    @click.stop="selectSystem(system.id)"
                                                >
                                                    {{ system.name }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div class="application-architecture__context">
                                <div>
                                    <div class="application-architecture__breadcrumb">
                                        渠道场景层 / {{ selectedSystem.domain }} /
                                        <b>{{ selectedSystem.name }}</b>
                                    </div>
                                    <strong>
                                        {{ selectedSystem.name }}
                                        <small>{{ appCategories.length }} 个一级分类 · {{ appComponentCount }} 个应用组件</small>
                                    </strong>
                                </div>
                                <div class="application-architecture__switch">
                                    <button
                                        :class="{ active: viewMode === 'category' }"
                                        type="button"
                                        @click.stop="viewMode = 'category'"
                                    >
                                        分类视图
                                    </button>
                                    <button
                                        :class="{ active: viewMode === 'panorama' }"
                                        type="button"
                                        @click.stop="viewMode = 'panorama'"
                                    >
                                        全景视图
                                    </button>
                                </div>
                            </div>

                            <div
                                v-if="viewMode === 'category'"
                                :class="[
                                    'application-architecture__component-master',
                                    { focused: selectedLevel === 'app-component' }
                                ]"
                            >
                                <aside class="application-architecture__category-nav">
                                    <h3>一级组件分类</h3>
                                    <button
                                        v-for="category in appCategories"
                                        :key="category.name"
                                        :class="{ active: selectedCategoryName === category.name }"
                                        type="button"
                                        @click.stop="selectedCategoryName = category.name"
                                    >
                                        {{ category.name }}
                                        <span>{{ categoryItemCount(category) }}</span>
                                    </button>
                                </aside>
                                <section class="application-architecture__category-content">
                                    <header>
                                        <strong>{{ selectedCategory.name }}</strong>
                                        <small>二级组件分类与应用组件</small>
                                    </header>
                                    <div class="application-architecture__group-grid">
                                        <div
                                            v-for="group in selectedCategory.groups"
                                            :key="group.name"
                                            class="application-architecture__group"
                                        >
                                            <h4>{{ group.name }}</h4>
                                            <div class="application-architecture__items">
                                                <button
                                                    v-for="item in group.items"
                                                    :key="item"
                                                    type="button"
                                                    @click.stop="openApplicationComponent(item, group.name)"
                                                >
                                                    {{ item }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div
                                v-else
                                :class="[
                                    'application-architecture__panorama',
                                    { focused: selectedLevel === 'app-component' }
                                ]"
                            >
                                <section
                                    v-for="category in appCategories"
                                    :key="category.name"
                                    class="application-architecture__band"
                                >
                                    <div class="application-architecture__band-label">
                                        {{ category.name }}
                                    </div>
                                    <div class="application-architecture__band-body">
                                        <div
                                            v-for="group in category.groups"
                                            :key="group.name"
                                            class="application-architecture__group"
                                        >
                                            <h4>{{ group.name }}</h4>
                                            <div class="application-architecture__items">
                                                <button
                                                    v-for="item in group.items"
                                                    :key="item"
                                                    type="button"
                                                    @click.stop="openApplicationComponent(item, group.name)"
                                                >
                                                    {{ item }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </template>

                    <template v-else-if="architectureType === 'technology'">
                        <div v-loading="technologyLoading" class="technology-architecture">
                            <section
                                v-for="layer in displayTechnologyLayers"
                                :key="layer.id || layer.name"
                                :class="[
                                    'technology-architecture__layer',
                                    `highlight-${selectedLevel}`
                                ]"
                            >
                                <div class="technology-architecture__layer-label">
                                    {{ layer.name }}
                                </div>
                                <div
                                    class="technology-architecture__domains"
                                    :style="{
                                        gridTemplateColumns: `repeat(${Math.max(1, Math.min(3, layer.domains.length))}, 360px)`
                                    }"
                                >
                                    <div
                                        v-for="domain in layer.domains"
                                        :key="domain.id || domain.name"
                                        class="technology-architecture__domain"
                                    >
                                        <h3>{{ domain.name }}</h3>
                                        <div v-if="domain.stacks.length" class="technology-architecture__stacks">
                                            <button
                                                v-for="stack in domain.stacks"
                                                :key="stack.id || stack.name || stack"
                                                type="button"
                                                @click.stop="openTechnologyStack(stack, layer, domain)"
                                            >
                                                {{ stack.name || stack }}
                                            </button>
                                        </div>
                                        <div v-else class="technology-architecture__empty">
                                            暂无技术栈数据
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div
                                v-if="!technologyLoading && !displayTechnologyLayers.length"
                                class="technology-architecture__empty-page"
                            >
                                <strong>暂无技术架构数据</strong>
                                <small>接口暂未返回技术层、技术域和技术栈数据</small>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <div class="deployment-architecture">
                            <div class="deployment-architecture__legend">
                                <span><i class="dc" />数据中心</span>
                                <span><i class="zone" />网络分区</span>
                                <span><i class="cluster" />集群</span>
                            </div>
                            <div class="deployment-architecture__lanes">
                                <section
                                    v-for="lane in deploymentLanes"
                                    :key="lane.code"
                                    class="deployment-architecture__lane"
                                >
                                    <div
                                        :class="[
                                            'deployment-architecture__node dc',
                                            { highlighted: selectedLevel === 'dc' }
                                        ]"
                                        role="button"
                                        tabindex="0"
                                        @click.stop="openDeploymentNode(lane, 'dc')"
                                        @keydown.enter.stop="openDeploymentNode(lane, 'dc')"
                                    >
                                        <b>DC</b>
                                        <small>数据中心</small>
                                        <strong>{{ lane.dc }}</strong>
                                    </div>
                                    <div class="deployment-architecture__link" />
                                    <div
                                        :class="[
                                            'deployment-architecture__node zone',
                                            { highlighted: selectedLevel === 'zone' }
                                        ]"
                                        role="button"
                                        tabindex="0"
                                        @click.stop="openDeploymentNode(lane, 'zone')"
                                        @keydown.enter.stop="openDeploymentNode(lane, 'zone')"
                                    >
                                        <b>网</b>
                                        <small>网络分区</small>
                                        <strong>{{ lane.zone }}</strong>
                                    </div>
                                    <div class="deployment-architecture__link" />
                                    <div
                                        :class="[
                                            'deployment-architecture__node cluster',
                                            { highlighted: selectedLevel === 'cluster' }
                                        ]"
                                        role="button"
                                        tabindex="0"
                                        @click.stop="openDeploymentNode(lane, 'cluster')"
                                        @keydown.enter.stop="openDeploymentNode(lane, 'cluster')"
                                    >
                                        <b>群</b>
                                        <small>集群</small>
                                        <strong>{{ lane.cluster }}</strong>
                                    </div>
                                    <div class="deployment-architecture__lane-meta">
                                        {{ lane.code }} · 生产环境
                                    </div>
                                </section>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <button
                class="architecture-model-page__fullscreen-exit"
                type="button"
                @click="toggleFullscreen"
            >
                退出全屏
            </button>
        </main>

        <el-drawer
            :visible.sync="detailDrawerVisible"
            :title="detailDrawerTitle"
            :size="detailDrawerSize"
            direction="rtl"
            append-to-body
            :class="[
                'architecture-model-detail-drawer',
                { 'technology-detail-drawer': detailRecord && detailRecord.type === 'technology' }
            ]"
            :wrapper-closable="false"
            @closed="handleDrawerClosed"
        >
            <div class="architecture-model-page__drawer-layout">
                <div
                    v-if="detailRecord"
                    :class="[
                        'architecture-model-page__drawer-body',
                        { 'technology-detail__body': detailRecord.type === 'technology' }
                    ]"
                >
                    <template v-if="detailRecord.type === 'application'">
                    <h3 class="architecture-model-page__section-title">基本信息</h3>
                    <div class="architecture-model-page__info">
                        <span>应用组件名称</span><strong>{{ detailRecord.name }}</strong>
                        <span>应用组件ID</span><strong>{{ applicationComponentCode(detailRecord.name) }}</strong>
                        <span>应用组件描述</span>
                        <strong>
                            {{ detailRecord.name }}应用组件，归属于{{ detailRecord.category }}，负责相关业务场景的页面交互与业务能力编排。
                        </strong>
                    </div>

                    <h3 class="architecture-model-page__section-title">接口列表</h3>
                    <div class="architecture-model-page__filters">
                        <label>
                            <span>接口名称</span>
                            <input v-model="filters.name" placeholder="请输入接口名称">
                        </label>
                        <label>
                            <span>接口编码</span>
                            <input v-model="filters.code" placeholder="请输入接口编码">
                        </label>
                        <label>
                            <span>所属服务</span>
                            <select v-model="filters.service">
                                <option value="">全部</option>
                                <option v-for="service in interfaceServices" :key="service" :value="service">
                                    {{ service }}
                                </option>
                            </select>
                        </label>
                        <label>
                            <span>接口状态</span>
                            <select v-model="filters.status">
                                <option value="">全部</option>
                                <option value="已注册">已注册</option>
                                <option value="已完成">已完成</option>
                            </select>
                        </label>
                        <div>
                            <button type="button" @click="resetFilters">重置</button>
                            <button class="primary" type="button" @click="interfacePage = 1">查询</button>
                        </div>
                    </div>

                    <div class="architecture-model-page__table-wrap">
                        <table class="architecture-model-page__table">
                            <thead>
                                <tr>
                                    <th>接口名称</th>
                                    <th>接口编码</th>
                                    <th>所属服务</th>
                                    <th>接口状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in pagedInterfaces" :key="item.code">
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.code }}</td>
                                    <td>{{ item.service }}</td>
                                    <td>
                                        <span :class="['architecture-model-page__status', item.status === '已注册' ? 'registered' : 'completed']">
                                            {{ item.status }}
                                        </span>
                                    </td>
                                    <td>
                                        <button class="architecture-model-page__view-link" type="button" @click="previewInterface = item">
                                            查看
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="!pagedInterfaces.length">
                                    <td colspan="5" class="empty">未找到符合条件的接口</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="architecture-model-page__pagination">
                        <span>共 {{ filteredInterfaces.length }} 条</span>
                        <button
                            v-for="page in interfacePageCount"
                            :key="page"
                            :class="{ active: interfacePage === page }"
                            type="button"
                            @click="interfacePage = page"
                        >
                            {{ page }}
                        </button>
                    </div>
                    <div v-if="previewInterface" class="architecture-model-page__preview">
                        <b>{{ previewInterface.name }}</b><br>
                        接口编码：{{ previewInterface.code }}<br>
                        所属服务：{{ previewInterface.service }}<br>
                        接口状态：{{ previewInterface.status }}
                    </div>
                    </template>

                    <template v-else-if="detailRecord.type === 'technology'">
                        <div class="technology-detail__tabs">
                            <button
                                :class="{ active: technologyDetailTab === 'base' }"
                                type="button"
                                @click="technologyDetailTab = 'base'"
                            >
                                基本信息
                            </button>
                            <button
                                :class="{ active: technologyDetailTab === 'resource' }"
                                type="button"
                                @click="openTechnologyResourceTab"
                            >
                                包含逻辑资源
                            </button>
                        </div>

                        <template v-if="technologyDetailTab === 'base'">
                            <section class="technology-detail__section">
                                <h3 class="technology-detail__section-title">基本信息</h3>
                                <div class="technology-detail__info-grid">
                                    <div class="technology-detail__info-item">
                                        <span>技术栈名称</span>
                                        <strong>{{ technologyDetailData.name }}</strong>
                                    </div>
                                    <div class="technology-detail__info-item">
                                        <span>类别</span>
                                        <strong>{{ technologyDetailData.category }}</strong>
                                    </div>
                                    <div class="technology-detail__info-item">
                                        <span>所属技术域</span>
                                        <strong>{{ technologyDetailData.domainPath }}</strong>
                                    </div>
                                    <div class="technology-detail__info-item">
                                        <span>状态</span>
                                        <strong>
                                            <i
                                                :class="[
                                                    'technology-detail__status',
                                                    {
                                                        'technology-detail__status--disabled': technologyDetailData.status === '停用'
                                                    }
                                                ]"
                                            >{{ technologyDetailData.status }}</i>
                                        </strong>
                                    </div>
                                    <div class="technology-detail__info-item">
                                        <span>是否开源</span>
                                        <strong>{{ technologyDetailData.isOpen }}</strong>
                                    </div>
                                    <div class="technology-detail__info-item">
                                        <span>是否信创</span>
                                        <strong>{{ technologyDetailData.isXinchuang }}</strong>
                                    </div>
                                    <div class="technology-detail__info-item">
                                        <span>通信协议</span>
                                        <strong>{{ technologyDetailData.protocol }}</strong>
                                    </div>
                                    <div class="technology-detail__info-item">
                                        <span>字符集</span>
                                        <strong>{{ technologyDetailData.charSet }}</strong>
                                    </div>
                                    <div class="technology-detail__info-item full">
                                        <span>技术栈说明</span>
                                        <strong>{{ technologyDetailData.desc }}</strong>
                                    </div>
                                </div>
                            </section>

                            <h3 class="technology-detail__section-title standalone">版本信息</h3>
                            <div class="architecture-model-page__table-wrap technology-detail__table-wrap">
                                <table class="architecture-model-page__table">
                                    <thead>
                                        <tr>
                                            <th>版本号</th>
                                            <th>版本说明</th>
                                            <th>建议升级版本</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{{ technologyDetailData.version }}</td>
                                            <td>{{ technologyDetailData.versionDesc }}</td>
                                            <td>{{ technologyDetailData.versionUp }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </template>

                        <template v-else>
                            <div class="technology-detail__filters">
                                <input
                                    v-model="technologyResourceKeyword"
                                    type="text"
                                    placeholder="请输入资源名称"
                                >
                                <select v-model="technologyResourceType">
                                    <option value="">全部类别</option>
                                    <option value="0">服务</option>
                                    <option value="1">组件</option>
                                </select>
                                <button class="primary" type="button" @click="queryTechnologyResources">搜索</button>
                                <button type="button" @click="resetTechnologyResourceFilters">重置</button>
                            </div>
                            <div class="architecture-model-page__table-wrap technology-detail__table-wrap">
                                <table class="architecture-model-page__table">
                                    <thead>
                                        <tr>
                                            <th>逻辑资源名称</th>
                                            <th>逻辑资源类别</th>
                                            <th>状态</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="resource in filteredTechnologyResources"
                                            :key="resource.logicalDeviceId || resource.name"
                                        >
                                            <td>{{ resource.name }}</td>
                                            <td>{{ resource.type }}</td>
                                            <td><i class="technology-detail__status">{{ resource.status }}</i></td>
                                        </tr>
                                        <tr v-if="!filteredTechnologyResources.length">
                                            <td colspan="3" class="empty">暂无符合条件的逻辑资源</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="technology-detail__pagination">
                                <span>共 {{ technologyResourcePagination.total }} 条</span>
                                <select :value="technologyResourcePagination.pageSize">
                                    <option :value="10">10 条/页</option>
                                    <option :value="20">20 条/页</option>
                                    <option :value="30">30 条/页</option>
                                    <option :value="40">40 条/页</option>
                                    <option :value="50">50 条/页</option>
                                </select>
                                <button type="button" disabled>上一页</button>
                                <button
                                    v-for="page in technologyResourcePagination.totalPages"
                                    :key="page"
                                    :class="{ active: page === technologyResourcePagination.currentPage }"
                                    type="button"
                                    disabled
                                >
                                    {{ page }}
                                </button>
                                <button type="button" disabled>下一页</button>
                            </div>
                        </template>
                    </template>

                    <template v-else>
                        <div class="architecture-model-page__info deployment-detail">
                            <span>节点名称</span><strong>{{ detailRecord.name }}</strong>
                            <span>节点类型</span><strong>{{ detailRecord.nodeLabel }}</strong>
                            <span>部署通道</span><strong>{{ detailRecord.laneCode }}</strong>
                            <span>运行环境</span><strong>{{ detailRecord.environment }}</strong>
                            <span>上下游关系</span><strong>{{ detailRecord.relation }}</strong>
                        </div>
                    </template>
                </div>
                <div
                    v-if="!detailRecord || detailRecord.type !== 'technology'"
                    class="architecture-model-page__drawer-footer"
                >
                    <el-button size="small" @click="closeDetailDrawer">关 闭</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import {
    APPLICATION_CATEGORIES,
    APPLICATION_SYSTEMS,
    ARCHITECTURE_CONFIG,
    DEPLOYMENT_LANES,
    TECHNOLOGY_LAYERS
} from './data'

const TECHNOLOGY_TYPE_MAP = {
    前端组件库: '前端组件',
    前端开发语言: '开发语言',
    前端开发框架: '前端框架',
    消息框架: '消息组件',
    应用服务器: '应用容器',
    流程引擎: '流程组件',
    文件管理: '文件组件',
    数据缓存: '缓存组件',
    日志管理: '日志组件',
    监控管理: '监控组件',
    安全权限: '安全组件',
    审计管理: '审计组件',
    版本管理: '版本管理组件',
    数据库域: '数据库组件',
    中间件域: '中间件组件',
    开发框架域: '开发框架'
}

export default {
    name: 'ArchitectureModel',
    props: {
        architectureType: {
            type: String,
            required: true
        },
        technologyModelData: {
            type: Array,
            default: null
        },
        technologyLoading: {
            type: Boolean,
            default: false
        },
        technologyStackDetail: {
            type: Object,
            default: null
        },
        technologyLogicalResources: {
            type: Object,
            default: null
        }
    },
    data() {
        const config = ARCHITECTURE_CONFIG[this.architectureType]
        return {
            selectedLevel: config.levels[0].key,
            zoom: config.initialZoom,
            selectedSystemId: 'personal-mobile',
            selectedCategoryName: '产品运营层',
            viewMode: 'category',
            technologyLayers: TECHNOLOGY_LAYERS,
            deploymentLanes: DEPLOYMENT_LANES,
            detailRecord: null,
            detailDrawerVisible: false,
            technologyDetailTab: 'base',
            technologyResourceKeyword: '',
            technologyResourceType: '',
            technologyResources: [
                { name: '个人手机银行核心服务', type: '服务', status: '在用' },
                { name: '渠道接口适配组件', type: '组件', status: '在用' }
            ],
            applicationInterfaces: [],
            filters: {
                name: '',
                code: '',
                service: '',
                status: ''
            },
            interfacePage: 1,
            interfacePageSize: 5,
            previewInterface: null,
            dragging: false,
            dragStartX: 0,
            dragStartY: 0,
            scrollStartX: 0,
            scrollStartY: 0
        }
    },
    computed: {
        config() {
            return ARCHITECTURE_CONFIG[this.architectureType]
        },
        zoomPercent() {
            return Math.round(this.zoom * 100)
        },
        selectedSystem() {
            return APPLICATION_SYSTEMS.find(item => item.id === this.selectedSystemId)
                || APPLICATION_SYSTEMS[2]
        },
        applicationDomains() {
            return [...new Set(APPLICATION_SYSTEMS.map(item => item.domain))]
        },
        appCategories() {
            return APPLICATION_CATEGORIES[this.selectedSystemId] || []
        },
        selectedCategory() {
            return this.appCategories.find(item => item.name === this.selectedCategoryName)
                || this.appCategories[0]
                || { name: '', groups: [] }
        },
        appComponentCount() {
            return this.appCategories.reduce(
                (total, category) => total + this.categoryItemCount(category),
                0
            )
        },
        filteredInterfaces() {
            return this.applicationInterfaces.filter(item => (
                (!this.filters.name || item.name.includes(this.filters.name.trim()))
                && (!this.filters.code || item.code.includes(this.filters.code.trim()))
                && (!this.filters.service || item.service === this.filters.service)
                && (!this.filters.status || item.status === this.filters.status)
            ))
        },
        interfacePageCount() {
            return Math.max(1, Math.ceil(this.filteredInterfaces.length / this.interfacePageSize))
        },
        pagedInterfaces() {
            const validPage = Math.min(this.interfacePage, this.interfacePageCount)
            const start = (validPage - 1) * this.interfacePageSize
            return this.filteredInterfaces.slice(start, start + this.interfacePageSize)
        },
        interfaceServices() {
            return [...new Set(this.applicationInterfaces.map(item => item.service))]
        },
        displayTechnologyLayers() {
            return Array.isArray(this.technologyModelData)
                ? this.technologyModelData
                : this.technologyLayers
        },
        technologyComponentType() {
            if (!this.detailRecord || this.detailRecord.type !== 'technology') return ''
            return TECHNOLOGY_TYPE_MAP[this.detailRecord.domain] || '通用组件'
        },
        technologyDetailData() {
            const record = this.detailRecord || {}
            const detail = this.technologyStackDetail
            const domainPath = [record.layer, record.domain].filter(Boolean).join(' / ')

            if (!detail) {
                return {
                    name: record.name || '',
                    category: this.technologyComponentType,
                    domainPath,
                    status: '在用',
                    isOpen: '是',
                    isXinchuang: '是',
                    protocol: 'HTTP / TCP',
                    charSet: 'UTF-8',
                    desc: record.desc || '用于小豹银行系统的标准技术组件与运行支撑。',
                    version: 'V1.0.0',
                    versionDesc: '当前生产版本',
                    versionUp: 'V1.1.0'
                }
            }

            const info = detail.techStackInfo || {}
            const version = detail.versionInfo || {}
            const text = value => (value === null || value === undefined ? '' : String(value))
            const yesOrNo = value => {
                if (String(value) === '1') return '是'
                if (String(value) === '0') return '否'
                return text(value)
            }
            const status = value => {
                if (String(value) === '0') return '在用'
                if (String(value) === '1') return '停用'
                return text(value)
            }

            return {
                name: text(info.techStackName),
                category: text(info.techStackType),
                domainPath: domainPath || text(info.techDomainId),
                status: status(info.status),
                isOpen: yesOrNo(info.isOpen),
                isXinchuang: yesOrNo(info.isXinchuang),
                protocol: text(info.protocol),
                charSet: text(info.charSet),
                desc: text(info.techStackDesc),
                version: text(version.techStackVersion),
                versionDesc: text(version.versionDesc),
                versionUp: text(version.techStackVersionUp)
            }
        },
        filteredTechnologyResources() {
            if (this.technologyLogicalResources) {
                const list = Array.isArray(this.technologyLogicalResources.list)
                    ? this.technologyLogicalResources.list
                    : []
                return list.map(resource => ({
                    ...resource,
                    name: resource.logicDeviceName || '',
                    type: {
                        0: '服务',
                        1: '组件'
                    }[String(resource.logicDeviceType)] || String(resource.logicDeviceType || ''),
                    status: String(resource.status) === '0'
                        ? '正常'
                        : String(resource.status || '')
                }))
            }
            const keyword = this.technologyResourceKeyword.trim().toLowerCase()
            return this.technologyResources.filter(resource => (
                (!keyword || resource.name.toLowerCase().includes(keyword))
                && (!this.technologyResourceType || resource.type === this.technologyResourceType)
            ))
        },
        technologyResourcePagination() {
            const result = this.technologyLogicalResources || {}
            return {
                currentPage: Number(result.currentPage) || 1,
                pageSize: Number(result.turnPageShowNum) || 10,
                total: Number(result.turnPageTotalNum) || 0,
                totalPages: Number(result.turnPageTotalPage) || 1
            }
        },
        detailDrawerTitle() {
            const titleMap = {
                application: '应用组件详情',
                technology: '技术栈详情',
                deployment: '部署节点详情'
            }
            return titleMap[this.detailRecord && this.detailRecord.type] || '详情'
        },
        detailDrawerSize() {
            if (!this.detailRecord) return '680px'
            if (this.detailRecord.type === 'application') return '800px'
            if (this.detailRecord.type === 'technology') return '700px'
            return '560px'
        }
    },
    watch: {
        architectureType: {
            immediate: false,
            handler() {
                this.resetArchitecture()
            }
        },
        filteredInterfaces() {
            if (this.interfacePage > this.interfacePageCount) {
                this.interfacePage = this.interfacePageCount
            }
        }
    },
    methods: {
        systemsForDomain(domain) {
            return APPLICATION_SYSTEMS.filter(item => item.domain === domain)
        },
        categoryItemCount(category) {
            return category.groups.reduce((total, group) => total + group.items.length, 0)
        },
        selectLevel(level) {
            this.selectedLevel = level
            if (this.architectureType === 'application' && ['app-component', 'app-service', 'app-interface'].includes(level)) {
                this.$nextTick(() => {
                    const canvas = this.$refs.canvas
                    if (canvas) canvas.scrollTo({ top: 300 * this.zoom, behavior: 'smooth' })
                })
            }
        },
        selectSystem(systemId) {
            this.selectedSystemId = systemId
            this.selectedCategoryName = (APPLICATION_CATEGORIES[systemId] || [])[0].name
            this.selectedLevel = 'app-component'
        },
        applicationComponentCode(name) {
            let hash = 0
            Array.from(name).forEach(char => {
                hash = (hash * 31 + char.charCodeAt(0)) % 1000000
            })
            return `AC-${String(hash).padStart(6, '0')}`
        },
        buildApplicationInterfaces(name) {
            const code = this.applicationComponentCode(name).slice(3)
            const actions = ['查询', '详情查询', '校验', '提交', '状态查询', '维护']
            const services = ['会话类', '支付结算类', '用户信息类']
            return actions.map((action, index) => ({
                name: `${name}${action}接口`,
                code: `API-${code}-${String(index + 1).padStart(2, '0')}`,
                service: services[index % services.length],
                status: index % 3 === 0 ? '已注册' : '已完成'
            }))
        },
        openApplicationComponent(name, category) {
            this.detailRecord = {
                type: 'application',
                name,
                category
            }
            this.applicationInterfaces = this.buildApplicationInterfaces(name)
            this.resetFilters()
            this.detailDrawerVisible = true
        },
        openTechnologyStack(stack, layer, domain) {
            const stackRecord = typeof stack === 'string' ? { name: stack } : stack
            const layerRecord = typeof layer === 'string' ? { name: layer } : layer
            const domainRecord = typeof domain === 'string' ? { name: domain } : domain
            const techStackId = stackRecord.nodeId || stackRecord.id || ''
            if (techStackId) this.$emit('technology-stack-click', techStackId)
            this.detailRecord = {
                ...stackRecord,
                type: 'technology',
                name: stackRecord.name,
                layer: layerRecord.name,
                layerId: layerRecord.id || '',
                domain: domainRecord.name,
                domainId: domainRecord.id || ''
            }
            this.technologyDetailTab = 'base'
            this.resetTechnologyResourceFilters()
            this.detailDrawerVisible = true
        },
        openTechnologyResourceTab() {
            this.technologyDetailTab = 'resource'
            this.queryTechnologyResources()
        },
        queryTechnologyResources() {
            const record = this.detailRecord || {}
            const techStackId = record.nodeId || record.id || ''
            if (techStackId) {
                this.$emit('technology-logical-resources-click', {
                    resourceName: this.technologyResourceKeyword,
                    resourceType: this.technologyResourceType,
                    techStackId
                })
            }
        },
        openDeploymentNode(lane, nodeType) {
            const nodeMap = {
                dc: {
                    label: '数据中心',
                    name: lane.dc,
                    relation: `${lane.dc} → ${lane.zone}`
                },
                zone: {
                    label: '网络分区',
                    name: lane.zone,
                    relation: `${lane.dc} → ${lane.zone} → ${lane.cluster}`
                },
                cluster: {
                    label: '集群',
                    name: lane.cluster,
                    relation: `${lane.zone} → ${lane.cluster}`
                }
            }
            const node = nodeMap[nodeType]
            this.detailRecord = {
                type: 'deployment',
                nodeType,
                nodeLabel: node.label,
                name: node.name,
                laneCode: lane.code,
                environment: '生产环境',
                relation: node.relation
            }
            this.detailDrawerVisible = true
        },
        closeDetailDrawer() {
            this.detailDrawerVisible = false
        },
        handleDrawerClosed() {
            this.detailRecord = null
            this.previewInterface = null
            this.technologyDetailTab = 'base'
            this.resetTechnologyResourceFilters()
        },
        resetTechnologyResourceFilters() {
            this.technologyResourceKeyword = ''
            this.technologyResourceType = ''
        },
        resetFilters() {
            this.filters = {
                name: '',
                code: '',
                service: '',
                status: ''
            }
            this.interfacePage = 1
            this.previewInterface = null
        },
        zoomBy(delta) {
            this.zoom = Math.max(
                this.config.minZoom,
                Math.min(this.config.maxZoom, Number((this.zoom + delta).toFixed(2)))
            )
        },
        resetView() {
            this.zoom = this.config.initialZoom
            const canvas = this.$refs.canvas
            if (canvas) {
                canvas.scrollTop = 0
                canvas.scrollLeft = 0
            }
        },
        resetArchitecture() {
            this.selectedLevel = this.config.levels[0].key
            this.zoom = this.config.initialZoom
            this.closeDetailDrawer()
            this.$nextTick(this.resetView)
        },
        toggleFullscreen() {
            const main = this.$refs.main
            if (!main) return
            if (document.fullscreenElement) {
                document.exitFullscreen()
                return
            }
            if (!main.requestFullscreen) {
                this.$message.warning('当前浏览器不支持全屏模式')
                return
            }
            const result = main.requestFullscreen()
            if (result && result.catch) {
                result.catch(() => this.$message.warning('无法进入全屏模式'))
            }
        },
        startPan(event) {
            if (event.button !== 0) return
            const target = event.target
            if (target.closest && target.closest('button, input, select, [role="button"]')) return
            const canvas = this.$refs.canvas
            if (!canvas) return
            this.dragging = true
            this.dragStartX = event.clientX
            this.dragStartY = event.clientY
            this.scrollStartX = canvas.scrollLeft
            this.scrollStartY = canvas.scrollTop
            event.preventDefault()
        },
        movePan(event) {
            if (!this.dragging) return
            const canvas = this.$refs.canvas
            if (!canvas) return
            canvas.scrollLeft = this.scrollStartX - (event.clientX - this.dragStartX)
            canvas.scrollTop = this.scrollStartY - (event.clientY - this.dragStartY)
        },
        stopPan() {
            this.dragging = false
        }
    }
}
</script>

<style scoped>
.architecture-model-page {
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

.architecture-model-page__sidebar {
    display: flex;
    width: 250px;
    flex-shrink: 0;
    box-sizing: border-box;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid #e7ebf1;
    background: #fff;
}

.architecture-model-page__brand {
    flex-shrink: 0;
    padding: 30px 24px 28px;
    border-bottom: 1px solid #edf0f4;
    text-align: center;
}

.architecture-model-page__brand-icon {
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

.architecture-model-page__brand-title {
    color: #222b38;
    font-size: 19px;
    font-weight: 700;
}

.architecture-model-page__brand-en {
    margin-top: 3px;
    color: #9aa3af;
    font-size: 11px;
}

.architecture-model-page__levels {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    align-items: center;
    padding: 28px 24px;
    overflow-y: auto;
}

.architecture-model-page__level {
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

.architecture-model-page__level:hover {
    border-color: #8eade5;
    background: #e7effc;
}

.architecture-model-page__level.active {
    border-color: #2b5fd7;
    background: #2b5fd7;
    box-shadow: 0 5px 14px rgba(43, 95, 215, 0.22);
    color: #fff;
}

.architecture-model-page__level-line {
    position: relative;
    width: 1px;
    height: 28px;
    flex-shrink: 0;
    background: #b9c7da;
}

.architecture-model-page__level-line::after {
    position: absolute;
    bottom: -1px;
    left: -4px;
    border-top: 6px solid #b9c7da;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
    content: '';
}

.architecture-model-page__main {
    position: relative;
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    overflow: hidden;
    background: #f7f9fc;
}

.architecture-model-page__toolbar {
    display: flex;
    min-height: 58px;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid #e6eaf0;
    background: #fff;
}

.architecture-model-page__toolbar > strong {
    font-size: 15px;
}

.architecture-model-page__tools {
    display: flex;
    align-items: center;
    gap: 7px;
}

.architecture-model-page__tools button {
    display: flex;
    width: 32px;
    height: 32px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 1px solid #dfe4ec;
    border-radius: 5px;
    background: #fff;
    color: #758092;
    font-size: 15px;
    cursor: pointer;
}

.architecture-model-page__tools button:hover {
    border-color: #2b5fd7;
    color: #2b5fd7;
}

.architecture-model-page__tools span {
    min-width: 44px;
    color: #788393;
    font-size: 11px;
    text-align: center;
}

.architecture-model-page__canvas {
    flex: 1;
    min-height: 0;
    box-sizing: border-box;
    padding: 42px 46px;
    overflow: auto;
    background-color: #f8fafd;
    background-image: radial-gradient(#d9e0ea 1px, transparent 1px);
    background-size: 18px 18px;
    cursor: grab;
}

.architecture-model-page__canvas.dragging {
    cursor: grabbing;
    user-select: none;
}

.architecture-model-page__graph {
    width: fit-content;
    min-width: 0;
    margin: 0 auto;
    transform-origin: top center;
    transition: transform 0.18s ease;
}

.architecture-model-page,
.architecture-model-page * {
    scrollbar-color: #b8c5d8 transparent;
    scrollbar-width: thin;
}

.architecture-model-page ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.architecture-model-page ::-webkit-scrollbar-track {
    background: transparent;
}

.architecture-model-page ::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 999px;
    background: #b8c5d8;
    background-clip: content-box;
}

.architecture-model-page ::-webkit-scrollbar-thumb:hover {
    background: #8fa0b8;
    background-clip: content-box;
}

.architecture-model-page ::-webkit-scrollbar-corner {
    background: transparent;
}

.architecture-model-page__fullscreen-exit {
    position: absolute;
    top: 18px;
    right: 18px;
    z-index: 30;
    display: none;
    padding: 8px 13px;
    border: 1px solid #dce3ec;
    border-radius: 6px;
    background: #fff;
    color: #435066;
    cursor: pointer;
}

.architecture-model-page__main:fullscreen .architecture-model-page__fullscreen-exit {
    display: block;
}

.application-architecture {
    width: 1180px;
    margin: 0 auto;
}

.application-architecture__hierarchy,
.application-architecture__panorama {
    padding: 14px;
    margin-bottom: 18px;
    border: 1px solid #d7ccef;
    border-radius: 10px;
    background: #fcfaff;
}

.application-architecture__hierarchy.focused,
.application-architecture__component-master.focused,
.application-architecture__panorama.focused {
    border-color: #2b5fd7;
    box-shadow: 0 0 0 3px rgba(43, 95, 215, 0.1);
}

.application-architecture__hierarchy h2 {
    margin: 0 0 14px;
    color: #3f3561;
    font-size: 14px;
    text-align: center;
}

.application-architecture__structure {
    display: grid;
    grid-template-columns: 72px 1fr;
    align-items: stretch;
    gap: 12px;
}

.application-architecture__layer-label {
    display: flex;
    min-height: 112px;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    background: linear-gradient(180deg, #7854c9, #5d3eb3);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 3px;
    writing-mode: vertical-rl;
}

.application-architecture__layer-label.active,
.application-architecture__domains.active,
.application-architecture__systems.active {
    outline: 2px solid #2b5fd7;
    box-shadow: 0 0 0 3px rgba(43, 95, 215, 0.1);
}

.application-architecture__domains {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    border-radius: 8px;
}

.application-architecture__domain {
    padding: 12px;
    border: 1px solid #b9cfee;
    border-radius: 8px;
    background: #f3f7ff;
}

.application-architecture__domain h3 {
    margin: 0 0 12px;
    color: #285fb8;
    font-size: 12px;
    text-align: center;
}

.application-architecture__systems {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 9px;
    border-radius: 6px;
}

.application-architecture__systems button {
    min-height: 38px;
    border: 1px solid #cfe0f3;
    border-radius: 6px;
    background: #eaf4ff;
    color: #45627f;
    font-size: 12px;
    cursor: pointer;
}

.application-architecture__systems button:hover,
.application-architecture__systems button.selected {
    border-color: #2b5fd7;
    background: #e8f0ff;
    color: #1f53bc;
}

.application-architecture__systems button.selected {
    box-shadow: 0 0 0 3px rgba(43, 95, 215, 0.08);
    font-weight: 700;
}

.application-architecture__context {
    position: sticky;
    top: 0;
    z-index: 8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 11px 14px;
    margin-bottom: 14px;
    border: 1px solid #a9c4ea;
    border-radius: 8px;
    background: rgba(239, 246, 255, 0.96);
    box-shadow: 0 4px 12px rgba(42, 83, 145, 0.08);
}

.application-architecture__breadcrumb {
    margin-bottom: 3px;
    color: #718096;
    font-size: 11px;
}

.application-architecture__breadcrumb b {
    color: #245bb2;
}

.application-architecture__context > div > strong {
    color: #203a62;
    font-size: 14px;
}

.application-architecture__context small {
    margin-left: 8px;
    color: #718096;
    font-size: 11px;
    font-weight: 400;
}

.application-architecture__switch {
    display: flex;
    flex-shrink: 0;
    padding: 3px;
    border: 1px solid #c8d7ec;
    border-radius: 7px;
    background: #fff;
}

.application-architecture__switch button {
    height: 28px;
    padding: 0 13px;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: #6c7889;
    font-size: 11px;
    cursor: pointer;
}

.application-architecture__switch button.active {
    background: #2b5fd7;
    box-shadow: 0 2px 6px rgba(43, 95, 215, 0.2);
    color: #fff;
}

.application-architecture__component-master {
    display: grid;
    grid-template-columns: 190px minmax(0, 1fr);
    align-items: start;
    gap: 14px;
    border-radius: 10px;
}

.application-architecture__category-nav {
    position: sticky;
    top: 70px;
    padding: 10px;
    border: 1px solid #c7d8ee;
    border-radius: 9px;
    background: #fff;
}

.application-architecture__category-nav h3 {
    padding: 4px 8px 10px;
    margin: 0;
    color: #7b8797;
    font-size: 11px;
}

.application-architecture__category-nav button {
    display: flex;
    width: 100%;
    min-height: 39px;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 10px;
    margin-bottom: 6px;
    border: 1px solid transparent;
    border-radius: 6px;
    background: #f3f7fc;
    color: #53647b;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
}

.application-architecture__category-nav button.active {
    border-color: #2b5fd7;
    background: #e8f0ff;
    color: #1f53bc;
    font-weight: 700;
}

.application-architecture__category-nav button span {
    color: #99a5b4;
    font-size: 10px;
}

.application-architecture__category-content,
.application-architecture__panorama {
    min-height: 240px;
    padding: 14px;
    border: 1px solid #b7cdec;
    border-radius: 10px;
    background: #f6faff;
}

.application-architecture__category-content > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    margin-bottom: 12px;
    border-bottom: 1px solid #d9e5f4;
}

.application-architecture__category-content > header strong {
    color: #285da8;
    font-size: 14px;
}

.application-architecture__category-content > header small {
    color: #8a96a7;
    font-size: 11px;
}

.application-architecture__group-grid,
.application-architecture__band-body {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}

.application-architecture__group {
    min-width: 0;
    padding: 9px;
    border: 1px solid #c8d8ee;
    border-radius: 6px;
    background: #fff;
}

.application-architecture__group h4 {
    margin: 0 0 8px;
    color: #34445a;
    font-size: 12px;
    text-align: center;
}

.application-architecture__items {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
}

.application-architecture__items button {
    min-height: 32px;
    padding: 6px 8px;
    border: 1px solid #d8e5f4;
    border-radius: 4px;
    background: #eef5fd;
    color: #526073;
    font-size: 11px;
    cursor: pointer;
}

.application-architecture__items button:hover {
    border-color: #aac0e7;
    background: #e5eefc;
    color: #2455b5;
}

.application-architecture__band {
    display: grid;
    grid-template-columns: 58px 1fr;
    align-items: stretch;
    gap: 10px;
    margin-bottom: 12px;
}

.application-architecture__band:last-child {
    margin-bottom: 0;
}

.application-architecture__band-label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 0;
    border-radius: 6px;
    background: linear-gradient(180deg, #2b5fd7, #3d82df);
    box-shadow: 0 4px 12px rgba(43, 95, 215, 0.18);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 4px;
    writing-mode: vertical-rl;
}

.technology-architecture {
    display: flex;
    width: 1120px;
    min-height: 320px;
    max-width: 1420px;
    flex-direction: column;
    gap: 16px;
    margin: 0 auto;
}

.technology-architecture__layer {
    display: grid;
    grid-template-columns: 72px 1fr;
    align-items: stretch;
    gap: 12px;
}

.technology-architecture__layer-label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 0;
    border-radius: 7px;
    background: linear-gradient(180deg, #2b5fd7, #254bad);
    box-shadow: 0 4px 12px rgba(43, 95, 215, 0.16);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 4px;
    writing-mode: vertical-rl;
}

.technology-architecture__domains {
    display: grid;
    align-items: stretch;
    justify-content: start;
    gap: 12px;
}

.technology-architecture__domain {
    min-width: 0;
    padding: 12px;
    border: 1px solid #d8e0ec;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.94);
}

.technology-architecture__domain h3 {
    padding-bottom: 10px;
    margin: 0 0 10px;
    border-bottom: 1px solid #e8edf4;
    color: #33445d;
    font-size: 13px;
    text-align: center;
}

.technology-architecture__stacks {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    gap: 8px;
}

.technology-architecture__stacks button {
    min-width: 92px;
    min-height: 34px;
    padding: 7px 10px;
    border: 1px solid #dce3ed;
    border-radius: 5px;
    background: #eef2f7;
    color: #526176;
    font-size: 11px;
    cursor: pointer;
}

.technology-architecture__stacks button:hover {
    border-color: #87a9e4;
    background: #e8f0ff;
    box-shadow: 0 4px 10px rgba(43, 95, 215, 0.1);
    color: #2455b5;
    transform: translateY(-1px);
}

.technology-architecture__empty {
    padding: 7px 2px;
    color: #a0a9b6;
    font-size: 11px;
}

.technology-architecture__empty-page {
    display: flex;
    min-height: 320px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #7d8898;
}

.technology-architecture__empty-page strong {
    margin-bottom: 8px;
    font-size: 15px;
}

.technology-architecture__empty-page small {
    color: #a0a9b6;
    font-size: 12px;
}

.technology-architecture__layer.highlight-layer .technology-architecture__layer-label {
    background: linear-gradient(180deg, #704dc5, #4e32a5);
}

.technology-architecture__layer.highlight-domain .technology-architecture__domain {
    border: 2px solid #2b5fd7;
}

.technology-architecture__layer.highlight-stack .technology-architecture__stacks button {
    border-color: #77a0e8;
    background: #e7efff;
    color: #2454b2;
}

.technology-architecture__layer.highlight-component .technology-architecture__domain,
.technology-architecture__layer.highlight-logical .technology-architecture__domain,
.technology-architecture__layer.highlight-physical .technology-architecture__domain {
    box-shadow: 0 0 0 3px rgba(43, 95, 215, 0.1);
}

.deployment-architecture {
    min-width: 760px;
    max-width: 1060px;
    margin: 0 auto;
}

.deployment-architecture__legend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 28px;
    margin-bottom: 42px;
    color: #697586;
    font-size: 12px;
}

.deployment-architecture__legend span {
    display: flex;
    align-items: center;
    gap: 7px;
}

.deployment-architecture__legend i {
    width: 10px;
    height: 10px;
    border-radius: 3px;
}

.deployment-architecture__legend i.dc {
    background: #7454bd;
}

.deployment-architecture__legend i.zone {
    background: #3b91df;
}

.deployment-architecture__legend i.cluster {
    background: #34a47f;
}

.deployment-architecture__lanes {
    display: flex;
    flex-direction: column;
    gap: 46px;
}

.deployment-architecture__lane {
    display: grid;
    grid-template-columns: 1fr 100px 1fr 100px 1fr;
    align-items: center;
    padding: 24px 28px;
    border: 1px solid #e3e8f0;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 2px 8px rgba(31, 45, 61, 0.04);
}

.deployment-architecture__node {
    display: flex;
    min-height: 116px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;
    border: 1px solid #dfe5ee;
    border-radius: 9px;
    background: #fff;
    cursor: pointer;
    outline: none;
    text-align: center;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.deployment-architecture__node:hover,
.deployment-architecture__node:focus-visible {
    border-color: #7ea6ea;
    box-shadow: 0 8px 18px rgba(43, 95, 215, 0.12);
    transform: translateY(-2px);
}

.deployment-architecture__node.highlighted {
    border: 2px solid #2b5fd7;
    background: #f4f8ff;
    box-shadow: 0 0 0 4px rgba(43, 95, 215, 0.1), 0 8px 20px rgba(43, 95, 215, 0.15);
    transform: translateY(-2px);
}

.deployment-architecture__node b {
    display: flex;
    width: 46px;
    height: 46px;
    align-items: center;
    justify-content: center;
    margin-bottom: 9px;
    border-radius: 12px;
    color: #fff;
    font-size: 18px;
}

.deployment-architecture__node.dc b {
    background: linear-gradient(135deg, #6747b8, #8c65cf);
}

.deployment-architecture__node.zone b {
    border-radius: 50%;
    background: linear-gradient(135deg, #2c71d6, #4aa8e5);
}

.deployment-architecture__node.cluster b {
    background: linear-gradient(135deg, #1f9a75, #55b995);
}

.deployment-architecture__node small {
    margin-bottom: 3px;
    color: #98a1ad;
    font-size: 11px;
}

.deployment-architecture__node strong {
    color: #283445;
    font-size: 14px;
}

.deployment-architecture__link {
    position: relative;
    height: 2px;
    margin: 0 12px;
    background: #9cb6dc;
}

.deployment-architecture__link::after {
    position: absolute;
    top: -4px;
    right: -1px;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 8px solid #9cb6dc;
    content: '';
}

.deployment-architecture__lane-meta {
    grid-column: 1 / -1;
    margin-top: 13px;
    color: #9aa3af;
    font-size: 11px;
    text-align: right;
}

.architecture-model-page__drawer-layout {
    display: flex;
    height: 100%;
    min-height: 0;
    flex-direction: column;
}

.architecture-model-page__drawer-body {
    min-height: 0;
    flex: 1;
    padding: 18px 20px;
    overflow-y: auto;
}

.architecture-model-page__drawer-body.technology-detail__body {
    padding: 20px;
}

.architecture-model-page__drawer-footer {
    flex-shrink: 0;
    padding: 12px 20px;
    border-top: 1px solid #e8ecf2;
    text-align: right;
}

.architecture-model-page__section-title {
    padding-left: 9px;
    margin: 20px 0 12px;
    border-left: 3px solid #3b8cff;
    color: #252b35;
    font-size: 15px;
}

.architecture-model-page__section-title:first-child {
    margin-top: 0;
}

.architecture-model-page__info {
    display: grid;
    grid-template-columns: 132px minmax(0, 1fr);
    overflow: hidden;
    margin-bottom: 20px;
    border: 1px solid #e0e6ef;
    border-radius: 8px;
    font-size: 12px;
}

.architecture-model-page__info span,
.architecture-model-page__info strong {
    padding: 11px 13px;
    border-bottom: 1px solid #e8edf4;
}

.architecture-model-page__info span {
    background: #f7f9fc;
    color: #8691a1;
}

.architecture-model-page__info strong {
    background: #fff;
    color: #2d3748;
    font-weight: 400;
    line-height: 1.55;
}

.architecture-model-page__info > :nth-last-child(-n + 2) {
    border-bottom: 0;
}

.technology-detail__tabs {
    display: flex;
    gap: 4px;
    padding: 0 2px;
    margin-bottom: 18px;
    border-bottom: 1px solid #e4e9f0;
}

.technology-detail__tabs button {
    position: relative;
    padding: 10px 20px;
    border: 0;
    background: transparent;
    color: #697587;
    font-size: 13px;
    cursor: pointer;
}

.technology-detail__tabs button.active {
    color: #2f63dc;
    font-weight: 650;
}

.technology-detail__tabs button.active::after {
    position: absolute;
    right: 12px;
    bottom: -1px;
    left: 12px;
    height: 3px;
    border-radius: 3px 3px 0 0;
    background: #2f63dc;
    content: '';
}

.technology-detail__section {
    overflow: hidden;
    margin-bottom: 16px;
    border: 1px solid #e4eaf2;
    border-radius: 9px;
    background: #fff;
}

.technology-detail__section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 18px;
    margin: 0;
    color: #252b35;
    font-size: 15px;
    font-weight: 700;
}

.technology-detail__section-title::before {
    width: 4px;
    height: 18px;
    flex-shrink: 0;
    border-radius: 2px;
    background: #3981ef;
    content: '';
}

.technology-detail__section .technology-detail__section-title {
    border-bottom: 1px solid #e7ecf3;
}

.technology-detail__section-title.standalone {
    padding-right: 2px;
    padding-left: 2px;
    margin: 20px 0 12px;
}

.technology-detail__info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.technology-detail__info-item {
    display: grid;
    grid-template-columns: 140px minmax(0, 1fr);
    min-height: 44px;
    border-bottom: 1px solid #edf1f6;
}

.technology-detail__info-item:nth-child(odd):not(.full) {
    border-right: 1px solid #edf1f6;
}

.technology-detail__info-item.full {
    grid-column: 1 / -1;
    border-bottom: 0;
}

.technology-detail__info-item span,
.technology-detail__info-item strong {
    display: flex;
    align-items: center;
    padding: 11px 14px;
    font-size: 13px;
    line-height: 1.7;
}

.technology-detail__info-item span {
    background: #fafbfc;
    color: #7c8798;
}

.technology-detail__info-item strong {
    color: #2d3748;
    font-weight: 400;
}

.technology-detail__status {
    display: inline-flex;
    padding: 3px 9px;
    border-radius: 999px;
    background: #eaf8f1;
    color: #159b62;
    font-size: 12px;
    font-style: normal;
}

.technology-detail__status--disabled {
    background: #fef0f0;
    color: #f04438;
}

.technology-detail__filters {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    padding: 14px;
    margin-bottom: 14px;
    border: 1px solid #e1e7ef;
    border-radius: 8px;
    background: #f8fafc;
}

.technology-detail__filters input,
.technology-detail__filters select {
    width: 190px;
    height: 34px;
    box-sizing: border-box;
    padding: 0 11px;
    border: 1px solid #d9e1ec;
    border-radius: 6px;
    background: #fff;
    color: #334155;
    font-size: 12px;
    outline: none;
}

.technology-detail__filters select {
    width: 140px;
}

.technology-detail__filters button {
    height: 34px;
    padding: 0 16px;
    border: 1px solid #2f63dc;
    border-radius: 6px;
    background: #fff;
    color: #2f63dc;
    font-size: 12px;
    cursor: pointer;
}

.technology-detail__filters button.primary {
    background: #2f63dc;
    color: #fff;
}

.technology-detail__table-wrap {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #fff;
}

.technology-detail__table-wrap .architecture-model-page__table {
    min-width: 500px;
    font-size: 13px;
}

.technology-detail__table-wrap .architecture-model-page__table th,
.technology-detail__table-wrap .architecture-model-page__table td {
    padding: 12px 14px;
}

.technology-detail__pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 7px;
    margin-top: 12px;
    color: #7b8797;
    font-size: 11px;
}

.technology-detail__pagination select {
    height: 30px;
    padding: 0 8px;
    border: 1px solid #d9e0e9;
    border-radius: 5px;
    background: #fff;
    color: #607086;
    font-size: 11px;
}

.technology-detail__pagination button {
    min-width: 30px;
    height: 30px;
    padding: 0 9px;
    border: 1px solid #d9e0e9;
    border-radius: 5px;
    background: #fff;
    color: #607086;
}

.technology-detail__pagination button.active {
    border-color: #2f63dc;
    background: #2f63dc;
    color: #fff;
}

.technology-detail__pagination button:disabled {
    color: #b3bbc6;
    cursor: not-allowed;
}

.architecture-model-page__filters {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    padding: 14px;
    margin-bottom: 14px;
    border: 1px solid #e1e7ef;
    border-radius: 8px;
    background: #f8fafc;
}

.architecture-model-page__filters label > span {
    display: block;
    margin-bottom: 6px;
    color: #7c8796;
    font-size: 11px;
}

.architecture-model-page__filters input,
.architecture-model-page__filters select {
    width: 100%;
    height: 34px;
    box-sizing: border-box;
    padding: 0 10px;
    border: 1px solid #d7dee8;
    border-radius: 6px;
    background: #fff;
    color: #334155;
    font-size: 12px;
    outline: none;
}

.architecture-model-page__filters > div {
    display: flex;
    grid-column: 1 / -1;
    justify-content: flex-end;
    gap: 8px;
}

.architecture-model-page__filters button {
    min-width: 70px;
    height: 32px;
    padding: 0 14px;
    border: 1px solid #d2dae6;
    border-radius: 6px;
    background: #fff;
    color: #5f6c7d;
    font-size: 12px;
    cursor: pointer;
}

.architecture-model-page__filters button.primary {
    border-color: #2b5fd7;
    background: #2b5fd7;
    color: #fff;
}

.architecture-model-page__table-wrap {
    overflow-x: auto;
}

.architecture-model-page__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
}

.architecture-model-page__table th {
    padding: 11px 12px;
    border-bottom: 1px solid #e5e9ef;
    background: #f6f8fb;
    color: #596577;
    text-align: left;
}

.architecture-model-page__table td {
    padding: 12px;
    border-bottom: 1px solid #edf0f4;
    color: #4b5563;
}

.architecture-model-page__table td.empty {
    padding: 28px;
    color: #98a1ad;
    text-align: center;
}

.architecture-model-page__status {
    display: inline-flex;
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 10px;
}

.architecture-model-page__status.registered {
    background: #e8f1ff;
    color: #2563eb;
}

.architecture-model-page__status.completed {
    background: #e7f8f1;
    color: #16845b;
}

.architecture-model-page__view-link {
    padding: 3px 5px;
    border: 0;
    background: transparent;
    color: #2b5fd7;
    font-size: 11px;
    cursor: pointer;
}

.architecture-model-page__pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    margin-top: 12px;
    color: #7b8797;
    font-size: 11px;
}

.architecture-model-page__pagination button {
    min-width: 28px;
    height: 28px;
    border: 1px solid #d9e0e9;
    border-radius: 4px;
    background: #fff;
    color: #607086;
    cursor: pointer;
}

.architecture-model-page__pagination button.active {
    border-color: #2b5fd7;
    background: #2b5fd7;
    color: #fff;
}

.architecture-model-page__preview {
    padding: 13px;
    margin-top: 14px;
    border-left: 3px solid #2b5fd7;
    border-radius: 5px;
    background: #f3f7fd;
    color: #536174;
    font-size: 12px;
    line-height: 1.8;
}

@media (max-width: 1000px) {
    .architecture-model-page__sidebar {
        width: 210px;
    }

    .architecture-model-page__levels {
        padding-right: 20px;
        padding-left: 20px;
    }

    .architecture-model-page__level {
        width: 160px;
    }
}
</style>

<style>
.architecture-model-detail-drawer .el-drawer {
    max-width: calc(100vw - 40px);
}

.architecture-model-detail-drawer .el-drawer__header {
    padding: 18px 20px;
    margin-bottom: 0;
    border-bottom: 1px solid #e8ecf2;
    color: #252b35;
    font-weight: 600;
}

.architecture-model-detail-drawer .el-drawer__body {
    overflow: hidden;
}

.technology-detail-drawer .el-drawer__header {
    height: 60px;
    box-sizing: border-box;
    padding: 0 20px;
    font-size: 16px;
    font-weight: 700;
}

.technology-detail-drawer .el-drawer__close-btn {
    color: #7b8797;
    font-size: 18px;
}
</style>
