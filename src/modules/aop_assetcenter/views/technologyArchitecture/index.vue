<template>
    <architecture-model
        architecture-type="technology"
        :technology-model-data="technologyModelData"
        :technology-loading="technologyLoading"
        :technology-stack-detail="technologyStackDetail"
        :technology-logical-resources="technologyLogicalResources"
        @technology-stack-click="getTechStackNodeDetail"
        @technology-logical-resources-click="getTechLogicalResourcesDetail"
    />
</template>

<script>
import mixins from "@m/core/mixin";
import ArchitectureModel from "../components/architectureModel";

const normalizeTechnologyStack = (stack = {}) => ({
    ...stack,
    id: stack.nodeId || "",
    name: stack.nodeName || "",
    type: stack.nodeType || "",
    desc: stack.remark || "",
});

const normalizeTechnologyDomain = (domain = {}) => ({
    ...domain,
    id: domain.nodeId || "",
    name: domain.nodeName || "",
    type: domain.nodeType || "",
    desc: domain.remark || "",
    stacks: Array.isArray(domain.children)
        ? domain.children.map(normalizeTechnologyStack)
        : [],
});

const normalizeTechnologyLayer = (layer = {}) => ({
    ...layer,
    id: layer.nodeId || "",
    name: layer.nodeName || "",
    type: layer.nodeType || "",
    desc: layer.remark || "",
    domains: Array.isArray(layer.children)
        ? layer.children.map(normalizeTechnologyDomain)
        : [],
});

const createEmptyLogicalResources = () => ({
    currentPage: 1,
    list: [],
    turnPageShowNum: 10,
    turnPageTotalNum: 0,
    turnPageTotalPage: 0,
});

export default {
    name: "TechnologyArchitecture",
    mixins: [mixins],
    components: {
        ArchitectureModel,
    },
    data() {
        return {
            technologyModelData: [],
            technologyLoading: false,
            technologyStackDetail: null,
            technologyLogicalResources: createEmptyLogicalResources(),
        };
    },
    methods: {
        async getTechModelTree(params = {}) {
            this.technologyLoading = true;
            try {
                const response = await this.rpc.assetcenter.getTechModelTree({
                    ...params,
                    techDomainId: params.techDomainId || "",
                    techLevelId: params.techLevelId || "",
                });
                const result = response && response.body ? response.body : response;
                const children = result && Array.isArray(result.children)
                    ? result.children
                    : [];
                this.technologyModelData = children.map(normalizeTechnologyLayer);
            } catch (error) {
                this.technologyModelData = [];
            } finally {
                this.technologyLoading = false;
            }
        },
        loadMockTechModel() {
            this.technologyModelData = null;
        },
        getTechInstanceMatrix(params = {}) {
            return this.rpc.assetcenter.getTechInstanceMatrix(params);
        },
        getTechNodeDetail(params = {}) {
            return this.rpc.assetcenter.getTechNodeDetail(params);
        },
        async getTechStackNodeDetail(techStackId) {
            this.technologyStackDetail = null;
            this.technologyLogicalResources = createEmptyLogicalResources();
            try {
                const response = await this.rpc.assetcenter.getTechStackNodeDetail({
                    techStackId,
                });
                const result = response && response.body ? response.body : response;
                this.technologyStackDetail = result || null;
            } catch (error) {
                this.technologyStackDetail = null;
            }
        },
        async getTechLogicalResourcesDetail(params = {}) {
            try {
                const response = await this.rpc.assetcenter.getTechLogicalResourcesDetail({
                    resourceName: params.resourceName || "",
                    resourceType: params.resourceType || "",
                    techStackId: params.techStackId || "",
                });
                const result = response && response.body ? response.body : response;
                this.technologyLogicalResources = result || createEmptyLogicalResources();
            } catch (error) {
                this.technologyLogicalResources = createEmptyLogicalResources();
            }
        },
    },
    created() {
        this.getTechModelTree();
    },
};
</script>
