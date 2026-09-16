
<template>
    <div class="x6-relation-custom-shape-node">
        <x6-shape-bar v-if="!preview" />
        <div class="x6-relation-custom-shape-body common-layout level5">
            <div class="header">
                {{options.fnName||'操作'}}
                <i v-if="embed && options.lowerLevel" @mousedown.stop @click.stop="drill" class="el-icon-link"></i>
            </div>
            <div class="main">
                <div class="obj">
                    <span>{{objectsLen}}</span>
                    <label>对象</label>
                </div>
                <div class="data">
                    <span>{{vouchersLen}}</span>
                    <label>凭证</label>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import mixins from './mixins'
export default {
    name: 'x6-shape-node-level5',
    mixins
}
</script>