<template>
    <div class="design-review-element-confirm">
        <iframe
            :src="src"
            frameborder="0"
            style="width: 100%; height: calc(100% - 8px)"
            ref="eleIframe"
            @load="removeComponentLoading"
        ></iframe>
    </div>
</template>

<script>
// @ts-ignore
export default {
    props: {
        attrs: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {};
    },
    created() {
        console.log("attrs", this.attrs);
    },
    computed: {
        src() {
            // @ts-ignore
            return `/h5-pc-terminal-web/layout_preview/#/previewex?kind=01&modelVersion=${this.attrs.modelVersion}&orderId=${this.attrs.isolateWorkspace}&fnctId=${this.attrs.fnctId}&layoutId=${this.attrs.elementId}&showLeft=0&showHeader=0&projectId=${this.attrs.projectId}`;
        },
    },
    methods: {
        removeComponentLoading() {
            const iframeDocument =
                this.$refs.eleIframe.contentDocument ||
                this.$refs.eleIframe.contentWindow.document;

            // 添加自定义样式，隐藏滚动条但保留滚动功能
            const customStyles = `
                    body {
                        overflow: hidden;
                    }
                    ::-webkit-scrollbar {
                        width: 0 !important;
                    }
                    ::-webkit-scrollbar-track {
                        background: transparent !important;
                    }
                    ::-webkit-scrollbar-thumb {
                        background-color: transparent !important;
                    }
                `;

            const styleElement = iframeDocument.createElement("style");
            styleElement.appendChild(
                iframeDocument.createTextNode(customStyles)
            );

            // 将样式添加到iframe的文档头部
            iframeDocument.head.appendChild(styleElement);

            this.$emit("removeComponentLoading");
        },
    },
};
</script>
<style lang="scss" scoped>
.design-review-element-confirm {
    padding: 8px !important;
}
</style>
