<template>
    <div class="aop_developer_comps_page_tabs">
        <el-tabs
            v-model="activeTab"
            @edit="handleTabsEdit"
            @tab-click="handleClick(activeTab)"
            :type="tabType"
        >
            <el-tab-pane
                v-for="(item, index) in tabsList"
                :label="item.v"
                :name="item.k"
                :key="index"
                :closable="item.closable ? item.closable : false"
            ></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    props: {
        defaultActive: {
            type: String,
            default: () => "",
        },
        tabsList: {
            type: Array,
            default: () => [],
        },
        tabType: {
            type: String,
            default: () => "",
        }
    },
    data() {
        return {
            activeTab: this.defaultActive,
        };
    },
    methods: {
        handleClick(e) {
            this.$emit("tabClick", e);
        },
        handleTabsEdit(e) {
            this.$emit("tabEdit", e);
        },
    },
    watch: {
        defaultActive(o) {
            this.activeTab = o;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_developer_comps_page_tabs {
    background-color: $base_white;
    width: 100%;
    ::v-deep .el-tabs__nav-wrap::after {
        background-color: $base_white;
    }
    ::v-deep .el-tabs__header {
        margin: 0;
        .el-tabs__item {
            height: 48px;
            padding: 0 16px;
            line-height: 48px;
            font-size: 14px;
            font-family: $font_regular;
            letter-spacing: 0;
            font-weight: 500;
        }
    }
    ::v-deep .el-tabs__content {
        display: none;
    }
}
</style>
