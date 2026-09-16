
<template>
    <el-container class="x6-graph-custom-works-skeleton">
        <graph-svg-list></graph-svg-list>
        <el-aside width="auto" style="overflow:hidden">
            <slot name="sider"></slot>
        </el-aside>
        <el-container>
            <el-header height="auto" style="padding:0">
                <slot name="header"></slot>
            </el-header>
            <el-main class="x6-graph-custom-works-skeleton-main">
                <slot></slot>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import graphSvgList from './components/svgList'
export default {
    components: {
        graphSvgList
    },
    data(){
        return {}
    }
}
</script>
<style lang="scss">
@import './style.scss';
</style>