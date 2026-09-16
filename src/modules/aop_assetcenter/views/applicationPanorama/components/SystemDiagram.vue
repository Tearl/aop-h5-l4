<template>
    <div ref="shell" class="diagram-shell">
        <div class="diagram-toolbar">
            <div class="diagram-title">
                {{ title }}
                <em v-if="modelDiagram" class="model-source-tag">模型图</em>
                <el-select
                    v-if="showVersionSelector"
                    v-model="version"
                    size="small"
                    class="version-select"
                    @change="handleVersionChange"
                >
                    <el-option label="V1.0.0" value="V1.0.0" />
                    <el-option label="V2.0.0" value="V2.0.0" />
                </el-select>
            </div>
            <div class="diagram-tools">
                <!-- <button
                    type="button"
                    class="diagram-edit-button"
                    title="进入模型编辑器"
                    @click="$emit('model-edit', { version })"
                >
                    <i class="el-icon-edit-outline" /> 模型编辑
                </button>
                <button
                    type="button"
                    class="diagram-drawio-button"
                    title="使用原 Draw.io 编辑器"
                    @click="$emit('edit', { version })"
                >
                    Draw.io 备份
                </button> -->
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
        <div
            ref="canvas"
            :class="[
                'diagram-canvas',
                {
                    dragging,
                    'is-empty': !modelDiagram && !previewSvg && !layers.length,
                },
            ]"
            @wheel="onWheel"
            @mousedown="startPan"
            @mousemove="movePan"
            @mouseup="endPan"
            @mouseleave="endPan"
        >
            <div class="diagram-stage" :style="{ transform: `scale(${zoom})` }">
                <div
                    v-if="modelDiagram"
                    ref="modelCanvas"
                    class="model-diagram-preview"
                    aria-label="模型架构图预览"
                />
                <img
                    v-else-if="previewSvg"
                    class="drawio-preview"
                    :src="previewSvg"
                    :alt="title"
                />
                <template v-else>
                    <el-empty
                        v-if="!layers.length"
                        description="暂无架构图数据"
                    />
                    <template v-else>
                    <div
                        v-for="(layer, layerIndex) in layers"
                        :key="`${layer.name}-${layerIndex}`"
                        class="diagram-layer-wrap"
                    >
                        <section
                            :class="[
                                'diagram-layer',
                                `tone-${layer.tone || 'default'}`,
                            ]"
                        >
                            <div class="diagram-layer__name">
                                {{ layer.name }}
                            </div>
                            <div class="diagram-layer__groups">
                                <article
                                    v-for="(group, groupIndex) in layer.groups"
                                    :key="`${group.name}-${groupIndex}`"
                                    :class="[
                                        'diagram-group',
                                        { 'diagram-group--plain': !group.name },
                                    ]"
                                >
                                    <h4 v-if="group.name">{{ group.name }}</h4>
                                    <div class="diagram-group__items">
                                        <button
                                            v-for="item in group.items"
                                            :key="item"
                                            :disabled="!itemClickable"
                                            type="button"
                                            @click="handleItemClick(item, layer, group)"
                                        >
                                            {{ item }}
                                        </button>
                                    </div>
                                </article>
                            </div>
                        </section>
                        <div
                            v-if="layerIndex < layers.length - 1"
                            class="diagram-connector"
                        >
                            <span
                                v-if="layer.protocol"
                                class="diagram-protocol"
                                >{{ layer.protocol }}</span
                            >
                        </div>
                    </div>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { Graph } from "@antv/x6";
import rpcMixins from "../../../core/mixin";
import { loadDiagramRecord } from "../diagramStorage";
import { loadModelDiagram } from "../modelDiagramStorage";

export default {
    name: "SystemDiagram",
    mixins: [rpcMixins],
    props: {
        title: { type: String, required: true },
        layers: { type: Array, required: true },
        initialZoom: { type: Number, default: 0.9 },
        diagramType: { type: String, default: "integration" },
        systemKey: { type: String, default: "default" },
        initialVersion: { type: String, default: "V1.0.0" },
        itemClickable: { type: Boolean, default: true },
        itemDetailEnabled: { type: Boolean, default: true },
        showVersionSelector: { type: Boolean, default: true },
    },
    data() {
        return {
            version: this.initialVersion,
            zoom: this.initialZoom,
            fullscreen: false,
            previewSvg: "",
            modelDiagram: null,
            modelGraph: null,
            dragging: false,
            pan: null,
        };
    },
    mounted() {
        this.loadDrawioPreview();
        document.addEventListener("fullscreenchange", this.syncFullscreen);
    },
    beforeDestroy() {
        document.removeEventListener("fullscreenchange", this.syncFullscreen);
        this.destroyModelGraph();
    },
    watch: {
        systemKey: "loadDrawioPreview",
        diagramType: "loadDrawioPreview",
    },
    methods: {
        handleItemClick(item, layer, group) {
            this.$emit("item-click", { item, layer, group });
            if (this.itemDetailEnabled) {
                this.$message.info(`${item}：查看详情`);
            }
        },
        // 接口预留：当前图形仍读取本地数据，暂不主动调用。
        getIntegrationArch(params = {}) {
            return this.rpc.assetcenter.getIntegrationArch(params);
        },
        getFuncArch(params = {}) {
            return this.rpc.assetcenter.getFuncArch(params);
        },
        getTechArchDiagram(params = {}) {
            return this.rpc.assetcenter.getTechArchDiagram(params);
        },
        loadDrawioPreview() {
            this.modelDiagram = loadModelDiagram({
                systemId: this.systemKey,
                diagramType: this.diagramType,
                version: this.version,
            });
            if (this.modelDiagram) {
                this.previewSvg = "";
                this.$nextTick(() => this.renderModelDiagram());
                return;
            }
            this.destroyModelGraph();
            if (this.diagramType === "integration") {
                const record = loadDiagramRecord({
                    systemId: this.systemKey,
                    diagramType: this.diagramType,
                    version: this.version,
                });
                this.previewSvg = record ? record.previewSvg || "" : "";
                return;
            }
            this.previewSvg =
                localStorage.getItem(
                    `drawio-architecture:${this.systemKey}:${this.diagramType}:svg`
                ) || "";
        },
        renderModelDiagram() {
            this.destroyModelGraph();
            if (!this.modelDiagram || !this.$refs.modelCanvas) return;
            this.modelGraph = new Graph({
                container: this.$refs.modelCanvas,
                autoResize: true,
                background: { color: "#ffffff" },
                interacting: false,
                panning: false,
                mousewheel: false,
            });
            this.modelGraph.fromJSON(this.modelDiagram.graph || { cells: [] });
            this.$nextTick(() => {
                if (!this.modelGraph || !this.modelGraph.getCells().length) return;
                this.modelGraph.zoomToFit({ padding: 36, maxScale: 1 });
                this.modelGraph.centerContent();
            });
        },
        destroyModelGraph() {
            if (this.modelGraph) this.modelGraph.dispose();
            this.modelGraph = null;
        },
        handleVersionChange() {
            this.loadDrawioPreview();
            this.$message.success(`已切换至 ${this.version}`);
        },
        changeZoom(delta) {
            this.zoom = Math.max(
                0.5,
                Math.min(1.6, Number((this.zoom + delta).toFixed(1)))
            );
        },
        onWheel(event) {
            if (!event.ctrlKey && !event.metaKey) return;
            event.preventDefault();
            this.changeZoom(event.deltaY < 0 ? 0.1 : -0.1);
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
            this.zoom = this.initialZoom;
            if (this.$refs.canvas) {
                this.$refs.canvas.scrollLeft = 0;
                this.$refs.canvas.scrollTop = 0;
            }
            this.$message.success("视图已复原");
        },
        toggleFullscreen() {
            if (document.fullscreenElement) document.exitFullscreen();
            else if (this.$refs.shell && this.$refs.shell.requestFullscreen)
                this.$refs.shell.requestFullscreen();
        },
        syncFullscreen() {
            this.fullscreen = document.fullscreenElement === this.$refs.shell;
        },
    },
};
</script>

<style scoped lang="scss">
.diagram-shell {
    overflow: hidden;
    min-height: 560px;
    height: calc(100vh - 178px);
    border: 1px solid #e3e9f2;
    border-radius: 10px;
    background: #fff;
}
.diagram-shell:fullscreen {
    height: 100vh;
    border-radius: 0;
}
.diagram-toolbar {
    display: flex;
    align-items: center;
    height: 58px;
    padding: 0 18px;
    border-bottom: 1px solid #e2e8f0;
    background: #fff;
}
.diagram-title {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #1f2937;
    font-size: 16px;
    font-weight: 700;
}
.version-select {
    width: 112px;
}
.model-source-tag {
    padding: 3px 8px;
    border-radius: 999px;
    background: #eaf1ff;
    color: #2f63dc;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
}
.diagram-tools {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
}
.diagram-tools button,
.diagram-tools span {
    display: grid;
    place-items: center;
    min-width: 38px;
    height: 36px;
    padding: 0 8px;
    border: 1px solid #dce3ed;
    border-radius: 7px;
    background: #fff;
    color: #5e6b7d;
}
.diagram-tools button {
    cursor: pointer;
}
.diagram-tools .diagram-edit-button {
    display: flex;
    width: auto;
    padding: 0 14px;
    gap: 6px;
    border-color: #2f63dc;
    background: #2f63dc;
    color: #fff;
}
.diagram-tools .diagram-edit-button:hover {
    background: #2456c7;
    color: #fff;
}
.diagram-tools .diagram-drawio-button {
    width: auto;
    padding: 0 12px;
    border-style: dashed;
    color: #7b8797;
}
.diagram-tools button:hover {
    border-color: #2f63dc;
    color: #2f63dc;
}
.diagram-canvas {
    overflow: auto;
    height: calc(100% - 58px);
    padding: 28px;
    box-sizing: border-box;
    background-color: #f8fbff;
    background-image: radial-gradient(#dce6f3 1px, transparent 1px);
    background-size: 20px 20px;
    cursor: grab;
}
.diagram-canvas.dragging {
    cursor: grabbing;
    user-select: none;
}
.diagram-canvas.is-empty {
    overflow: hidden;
    padding: 0;
    cursor: default;
}
.diagram-canvas.is-empty .diagram-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100%;
}
.diagram-stage {
    width: 1240px;
    min-height: 620px;
    margin: 0 auto;
    transform-origin: top center;
    transition: transform 0.15s;
}
.drawio-preview {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 0 auto;
}
.model-diagram-preview {
    width: 100%;
    height: 620px;
    overflow: hidden;
    border-radius: 8px;
    background: #fff;
    pointer-events: none;
}
.diagram-layer {
    position: relative;
    display: grid;
    grid-template-columns: 150px 1fr;
    min-height: 104px;
    border: 1px solid #cfe0f7;
    border-radius: 10px;
    background: #f7fbff;
}
.tone-green {
    background: #eef8e8;
}
.tone-yellow {
    background: #fff7d9;
}
.tone-blue {
    background: #e3f1ff;
}
.tone-orange {
    background: #fff0e6;
}
.diagram-layer__name {
    display: grid;
    place-items: center;
    padding: 14px;
    border-right: 1px dashed #a7b2c2;
    color: #334155;
    font-size: 18px;
    font-weight: 650;
}
.diagram-layer__groups {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 12px;
    padding: 12px;
}
.diagram-group {
    min-height: 72px;
    padding: 10px;
    border: 1px solid #c8d8ee;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.82);
}
.diagram-group--plain {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}
.diagram-group--plain .diagram-group__items {
    width: 100%;
    align-content: center;
}
.diagram-group h4 {
    margin: 0 0 10px;
    color: #2f4058;
    text-align: center;
}
.diagram-group__items {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
}
.diagram-group__items button {
    min-width: 112px;
    padding: 9px 12px;
    border: 1px solid #a9c4fb;
    border-radius: 6px;
    background: #eaf1ff;
    color: #315ca7;
    cursor: pointer;
}
.diagram-group__items button:hover {
    border-color: #2f63dc;
    box-shadow: 0 3px 10px rgba(47, 99, 220, 0.12);
}
.diagram-group__items button:disabled {
    border-color: #a9c4fb;
    box-shadow: none;
    opacity: 1;
    cursor: default;
}
.diagram-connector {
    position: relative;
    height: 52px;
}
.diagram-connector::before {
    position: absolute;
    top: 0;
    bottom: 5px;
    left: 50%;
    width: 1px;
    background: #8090a5;
    content: "";
}
.diagram-connector::after {
    position: absolute;
    bottom: 3px;
    left: 50%;
    width: 7px;
    height: 7px;
    border-right: 1.5px solid #8090a5;
    border-bottom: 1.5px solid #8090a5;
    content: "";
    transform: translateX(-50%) rotate(45deg);
}
.diagram-protocol {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: calc(50% + 12px);
    padding: 1px 6px;
    border-radius: 3px;
    background: #f8fbff;
    color: #66758a;
    font-size: 12px;
    line-height: 18px;
    white-space: nowrap;
    transform: translateY(-50%);
}
</style>
