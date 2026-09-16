<template>
    <div
        class="x6-graph-custom-flowWorks-container"
        style="width: 100%; height: 100%"
    >
        <div ref="view" class="x6-custom-flowWorks-view"></div>
        <canvas id="canvas" style="display: none"></canvas>
    </div>
</template>
<script>
import props from "./props";
import View from "../../lib";
export default {
    inject: ["getDialog"],
    props,
    mounted() {
        this.$nextTick(() => {
            this.view = new View(
                this,
                {
                    container: this.$refs.view,
                },
                this.$props
            );
        });
    },
    methods: {
        getNodesData() {
            return this.view.graph.getNodes().map((node) => node.data);
        },
        dispose() {
            this.view.graph.dispose();
        },
        render(metas) {
            setTimeout(() => {
                this.view.render.render(metas);
            }, 30);
        },
        svgToPng(svgElement, functionId) {
            return new Promise((resolve, reject) => {
                const svgData = new XMLSerializer().serializeToString(
                    svgElement
                );
                const svgBase64 = `data:image/svg+xml;base64,${btoa(
                    unescape(encodeURIComponent(svgData))
                )}`;
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    const canvas = document.getElementById("canvas");
                    canvas.width = 1500;
                    canvas.height = 1500;
                    const ctx = canvas.getContext("2d");

                    ctx.drawImage(img, 0, 0, 2000, 2000);

                    canvas.toBlob((blob) => {
                        let _temp = new File([blob], `${functionId}.png`, {
                            type: "image/png",
                        });
                        console.log("_temp---->", _temp);
                        resolve(_temp);
                    }, "image/png");
                };

                img.onerror = (error) => reject(error);

                img.src = svgBase64; // 将 Base64 编码的 SVG 作为图片源加载
            });
        },
        async getPicBySvg(functionId) {
            const svgElement = this.$refs.view.querySelector("svg");
            const pngFile = await this.svgToPng(svgElement, functionId);
            return pngFile;
        },
    },
};
</script>
<style lang="scss">
@import "./style.scss";
</style>
