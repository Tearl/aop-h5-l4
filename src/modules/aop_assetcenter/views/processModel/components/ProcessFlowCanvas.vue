<template>
    <div ref="shell" class="process-flow-canvas">
        <div ref="view" class="process-flow-canvas__view" />
        <div class="process-flow-canvas__tools">
            <button type="button" aria-label="缩小" @click="zoomOut">−</button>
            <span>{{ zoomPercent }}%</span>
            <button type="button" aria-label="放大" @click="zoomIn">+</button>
            <button type="button" aria-label="适应画布" @click="fitView">适应</button>
            <button type="button" aria-label="全屏查看" title="全屏查看" @click="toggleFullscreen">
                {{ fullscreen ? '退出全屏' : '全屏' }}
            </button>
        </div>
    </div>
</template>

<script>
import KeyBusinessLogicGraph from './logicEngine'
import ProcessSegmentLogicGraph from './processLogicEngine'

const safeParse = (value, fallback) => {
    if (!value) return fallback
    if (typeof value === 'object') return value
    try {
        return JSON.parse(value)
    } catch (error) {
        return fallback
    }
}

export default {
    name: 'ProcessFlowCanvas',
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            logicView: null,
            zoomPercent: 100,
            fullscreen: false
        }
    },
    watch: {
        data: {
            handler() {
                this.$nextTick(this.renderGraph)
            }
        }
    },
    mounted() {
        document.addEventListener('fullscreenchange', this.syncFullscreen)
        const LogicGraph = this.data.relObjType === 'control_point'
            ? ProcessSegmentLogicGraph
            : KeyBusinessLogicGraph
        this.logicView = new LogicGraph({
            container: this.$refs.view,
            customSilent: true,
            idGenerator: () => `readonly-flow-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        })
        this.renderGraph()
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => this.resizeCanvas())
            this.resizeObserver.observe(this.$refs.shell)
        }
    },
    beforeDestroy() {
        document.removeEventListener('fullscreenchange', this.syncFullscreen)
        if (this.resizeObserver) this.resizeObserver.disconnect()
        this.resizeObserver = null
        const logic = this.logicView && this.logicView.logic
        if (logic && typeof logic.destroy === 'function') {
            logic.destroy()
        }
        this.logicView = null
    },
    methods: {
        toGraphMeta() {
            const isControlPoint = this.data.relObjType === 'control_point'
            const flowNodeInfos = Array.isArray(this.data.flowNodeInfos)
                ? this.data.flowNodeInfos.map(item => {
                    const config = safeParse(item.configInfo, {})
                    return {
                        ...config,
                        ...(isControlPoint && item.nodeId ? { fnId: item.nodeId } : {}),
                        fnName: item.nodeName || config.fnName || ''
                    }
                })
                : []
            const nodeRels = Array.isArray(this.data.flowInfoRelList)
                ? this.data.flowInfoRelList.map(item => safeParse(item.configInfo, item))
                : []
            const laneGroupInfoList = Array.isArray(this.data.laneGroupInfoList)
                ? this.data.laneGroupInfoList.map(item => safeParse(item.configInfo, item))
                : []

            return {
                flowNodeInfos,
                nodeRels,
                laneGroupInfoList
            }
        },
        renderGraph() {
            if (!this.logicView) return
            this.logicView.render(this.toGraphMeta())
            this.$nextTick(() => this.fitView())
        },
        zoomIn() {
            const logic = this.logicView && this.logicView.logic
            if (!logic) return
            logic.zoom(true)
            this.syncZoomPercent()
        },
        zoomOut() {
            const logic = this.logicView && this.logicView.logic
            if (!logic) return
            logic.zoom(false)
            this.syncZoomPercent()
        },
        resetView() {
            const logic = this.logicView && this.logicView.logic
            if (!logic) return
            if (typeof logic.resetZoom === 'function') logic.resetZoom()
            if (typeof logic.resetTranslate === 'function') logic.resetTranslate()
            if (typeof logic.translateCenter === 'function') logic.translateCenter()
            this.syncZoomPercent()
        },
        syncZoomPercent() {
            const logic = this.logicView && this.logicView.logic
            const transform = logic && logic.graphModel && logic.graphModel.transformModel
            const scale = transform && Number(transform.SCALE_X)
            this.zoomPercent = Number.isFinite(scale) ? Math.round(scale * 100) : 100
        },
        fitView() {
            const logic = this.logicView && this.logicView.logic
            if (!logic) return
            if (typeof logic.resetZoom === 'function') logic.resetZoom()
            if (typeof logic.resetTranslate === 'function') logic.resetTranslate()
            if (typeof logic.fitView === 'function') logic.fitView(40, 40)

            const transform = logic.graphModel && logic.graphModel.transformModel
            if (transform && Number(transform.SCALE_X) > 1) {
                if (typeof logic.resetZoom === 'function') logic.resetZoom()
                if (typeof logic.resetTranslate === 'function') logic.resetTranslate()
                if (typeof logic.translateCenter === 'function') logic.translateCenter()
            }
            this.syncZoomPercent()
        },
        resizeCanvas() {
            const logic = this.logicView && this.logicView.logic
            const view = this.$refs.view
            if (!logic || !view || typeof logic.resize !== 'function') return
            logic.resize(view.clientWidth, view.clientHeight)
        },
        toggleFullscreen() {
            const shell = this.$refs.shell
            if (!shell) return
            if (document.fullscreenElement) {
                document.exitFullscreen()
            } else if (shell.requestFullscreen) {
                shell.requestFullscreen()
            }
        },
        syncFullscreen() {
            this.fullscreen = document.fullscreenElement === this.$refs.shell
            this.$nextTick(() => {
                window.setTimeout(() => {
                    this.resizeCanvas()
                    this.fitView()
                }, 50)
            })
        }
    }
}
</script>

<style scoped>
.process-flow-canvas {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    background: #f8fafc;
}

.process-flow-canvas:fullscreen {
    width: 100vw;
    height: 100vh;
}

.process-flow-canvas__view {
    width: 100%;
    height: 100%;
}

.process-flow-canvas__tools {
    position: absolute;
    right: 14px;
    bottom: 14px;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    border: 1px solid #e1e6ee;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 2px 8px rgba(31, 45, 61, 0.08);
}

.process-flow-canvas__tools button {
    min-width: 30px;
    height: 28px;
    padding: 0 8px;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: #596577;
    cursor: pointer;
}

.process-flow-canvas__tools button:hover {
    background: #edf3ff;
    color: #2b5fd7;
}

.process-flow-canvas__tools span {
    min-width: 44px;
    color: #788393;
    font-size: 11px;
    text-align: center;
}
</style>
