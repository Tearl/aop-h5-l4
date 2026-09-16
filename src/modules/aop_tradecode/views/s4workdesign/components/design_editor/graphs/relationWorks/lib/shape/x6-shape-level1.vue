
<template>
    <div class="x6-relation-custom-shape-node">
        <x6-shape-bar v-if="!preview" />
        <div class="x6-relation-custom-shape-body level1">
            <div class="header">
                {{options.fnName || '分类'}}
                <i v-if="embed && options.lowerLevel" @mousedown.stop @click.stop="drill" class="el-icon-link"></i>
            </div>
        </div>
    </div>
</template>
<script>
import mixins from './mixins'
export default {
    name: 'x6-shape-node-level1',
    mixins
}
</script>
