
<template>
    <div class="x6-graph-custom-works-header">
        <div class="x6-graph-custom-works-header-left">
            <i @click="$router.back()">
                <img src="./assets/nav.png">
            </i>
            <slot name="left">
                <span>{{label}}</span>
            </slot>
        </div>
        <div class="x6-graph-custom-works-header-right">
            <el-button v-for="(v,k) in btns" :key="k" type="primary" size="mini" @click="confirm(v)">{{v.label}}</el-button>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        label: {
            type: String,
            default: '对象关系'
        },
        btns: {
            type: Array,
            default(){
                return [
                    { label: '导出图片', value: 'exportPNG' },
                    { label: '保存', value: 'save' }
                ]
            }
        }
    },
    methods: {
        confirm(option){
            this.$emit('confirm', option)
        }
    }
}
</script>