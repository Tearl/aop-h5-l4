
<template>
    <div class="x6-relation-custom-shape-node">
        <x6-shape-bar v-if="!preview" />
        <div class="x6-relation-custom-shape-body level2">
            <div class="header">
                {{options.fnName || '产品'}}
                <i v-if="embed && options.lowerLevel" @mousedown.stop @click.stop="drill" class="el-icon-link"></i>
            </div>
        </div>
    </div>
</template>
<script>
import mixins from './mixins'
export default {
    name: 'x6-shape-node-level2',
    mixins
}
</script>
