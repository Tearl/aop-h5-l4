<template>
    <entity-model class="data-entity-view" force-view-mode />
</template>

<script>
import EntityModel from '../../entityModel/index.vue'

export default {
    name: 'DataEntity',
    components: {
        EntityModel
    }
}
</script>

<style lang="scss" scoped>
.data-entity-view {
    ::v-deep .object-graph-header {
        flex: 0 0 52px;
        height: 52px;
        padding: 0 16px;
        box-sizing: border-box;
    }

    ::v-deep .object-graph-header .left p {
        margin: 0;
    }

    ::v-deep .object-graph-header .left .el-select {
        width: 250px;
    }

    ::v-deep .object-graph-header .logo,
    ::v-deep .object-graph-header h3,
    ::v-deep .object-graph-header > .right,
    ::v-deep .object-graph-shortcut > .right {
        display: none;
    }
}
</style>
