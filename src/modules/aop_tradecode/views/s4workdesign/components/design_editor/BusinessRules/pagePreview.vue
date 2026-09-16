<template>
    <div class="business-rules-page-preview">
        <iframe
            :src="src"
            frameborder="0"
            ref="eleIframe"
            style="width: 100%; height: calc(100% - 8px)"
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
    computed: {
        src() {
            return `/h5-pc-terminal-web/layout_preview/#/previewex?kind=02&modelVersion=${this.attrs.modelVersion}&orderId=${this.attrs.isolateWorkspace}&fnctId=${this.attrs.fnctId}&layoutId=${this.attrs.layoutId}&showLeft=0&showHeader=0&projectId=${this.attrs.projectId}`;
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
.business-rules-page-preview {
    padding: 8px !important;
    width: 100%;
    height: 100%;
}
</style>
