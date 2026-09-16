<template>
    <div ref="shell" class="tech-diagram-shell">
        <header class="tech-diagram-toolbar">
            <h3>{{ title }}</h3>
            <div class="tech-diagram-tools">
                <button type="button" title="缩小" @click="changeZoom(-0.1)">−</button>
                <span>{{ Math.round(zoom * 100) }}%</span>
                <button type="button" title="放大" @click="changeZoom(0.1)">+</button>
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
        </header>

        <div
            ref="canvas"
            :class="['tech-diagram-canvas', { dragging }]"
            @wheel="onWheel"
            @mousedown="startPan"
            @mousemove="movePan"
            @mouseup="endPan"
            @mouseleave="endPan"
        >
            <div class="tech-diagram-stage" :style="{ transform: `scale(${zoom})` }">
                <el-empty v-if="!layers.length" description="暂无架构图数据" />
                <div v-else class="tech-board">
                    <section
                        v-for="layer in layers"
                        :key="layer.id || layer.name"
                        class="tech-row"
                    >
                        <div class="vertical-label">
                            <span v-for="(text, index) in layer.name" :key="index">
                                {{ text }}
                            </span>
                        </div>
                        <div class="group-grid">
                            <article
                                v-for="(group, groupIndex) in layer.groups"
                                :key="`${group.name}-${groupIndex}`"
                                class="group-box"
                            >
                                <h4>{{ group.name }}</h4>
                                <div class="component-grid">
                                    <button
                                        v-for="item in group.items"
                                        :key="item"
                                        type="button"
                                        @click="$emit('item-click', { item, layer, group })"
                                    >
                                        {{ item }}
                                    </button>
                                </div>
                            </article>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SystemTechDiagram",
    props: {
        title: { type: String, default: "技术架构图" },
        layers: { type: Array, default: () => [] },
        initialZoom: { type: Number, default: 0.9 },
    },
    data() {
        return {
            zoom: this.initialZoom,
            fullscreen: false,
            dragging: false,
            pan: null,
        };
    },
    mounted() {
        document.addEventListener("fullscreenchange", this.syncFullscreen);
    },
    beforeDestroy() {
        document.removeEventListener("fullscreenchange", this.syncFullscreen);
    },
    methods: {
        changeZoom(step) {
            this.zoom = Math.min(1.6, Math.max(0.5, this.zoom + step));
        },
        onWheel(event) {
            if (!event.ctrlKey && !event.metaKey) return;
            event.preventDefault();
            this.changeZoom(event.deltaY < 0 ? 0.1 : -0.1);
        },
        startPan(event) {
            if (event.button !== 0 || event.target.closest("button")) return;
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
        },
        toggleFullscreen() {
            if (document.fullscreenElement) document.exitFullscreen();
            else if (this.$refs.shell && this.$refs.shell.requestFullscreen) {
                this.$refs.shell.requestFullscreen();
            }
        },
        syncFullscreen() {
            this.fullscreen = document.fullscreenElement === this.$refs.shell;
        },
    },
};
</script>

<style scoped lang="scss">
.tech-diagram-shell {
    overflow: hidden;
    min-height: 0;
    height: 100%;
    border: 1px solid #e3e9f2;
    border-radius: 10px;
    background: #fff;
}
.tech-diagram-shell:fullscreen {
    height: 100vh;
    border-radius: 0;
}
.tech-diagram-toolbar {
    display: flex;
    align-items: center;
    height: 58px;
    padding: 0 18px;
    border-bottom: 1px solid #e2e8f0;
    background: #fff;
    box-sizing: border-box;
}
.tech-diagram-toolbar h3 {
    margin: 0;
    color: #1f2937;
    font-size: 16px;
    font-weight: 700;
}
.tech-diagram-tools {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
}
.tech-diagram-tools button,
.tech-diagram-tools span {
    display: grid;
    place-items: center;
    min-width: 38px;
    height: 36px;
    padding: 0 8px;
    border: 1px solid #dce3ed;
    border-radius: 7px;
    background: #fff;
    color: #5e6b7d;
    box-sizing: border-box;
}
.tech-diagram-tools button {
    cursor: pointer;
}
.tech-diagram-tools button:hover {
    border-color: #2f63dc;
    color: #2f63dc;
}
.tech-diagram-canvas {
    overflow: auto;
    height: calc(100% - 58px);
    padding: 28px;
    background-color: #f8fbff;
    background-image: radial-gradient(#dce6f3 1px, transparent 1px);
    background-size: 20px 20px;
    box-sizing: border-box;
    cursor: grab;
}
.tech-diagram-canvas.dragging {
    cursor: grabbing;
    user-select: none;
}
.tech-diagram-stage {
    width: 1400px;
    min-height: 620px;
    margin: 0 auto;
    transform-origin: top center;
    transition: transform 0.15s;
}
.tech-board {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.tech-row {
    display: grid;
    grid-template-columns: 86px 1fr;
    gap: 12px;
    padding: 12px;
    border: 1px solid #cfe0f7;
    border-radius: 10px;
    background: #f7fbff;
}
.vertical-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 136px;
    padding: 12px 8px;
    border-radius: 8px;
    background: linear-gradient(180deg, #2e63dc, #428ae6);
    color: #fff;
    font-size: 17px;
    font-weight: 700;
    line-height: 1.25;
}
.group-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
}
.group-box {
    min-height: 136px;
    padding: 12px;
    border: 1px solid #c8d8ee;
    border-radius: 8px;
    background: #fff;
    box-sizing: border-box;
}
.group-box h4 {
    margin: 0 0 12px;
    color: #2f4058;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
}
.component-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(90px, 1fr));
    gap: 8px;
}
.component-grid button {
    min-height: 48px;
    padding: 10px;
    border: 1px solid #a9c4fb;
    border-radius: 6px;
    background: #eaf1ff;
    color: #315ca7;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
}
.component-grid button:hover {
    border-color: #2f63dc;
    box-shadow: 0 3px 10px rgba(47, 99, 220, 0.12);
}
@media (max-width: 1100px) {
    .group-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>
