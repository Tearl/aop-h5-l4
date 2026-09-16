
<template>
    <div class="btf-zoom">
        <el-dropdown size="mini" placement="top" trigger="click" @command="handleCommand">
        <div class="zoom-bar">
            <p @click.stop="zoomIn"><Icon name="#icon-zoom-in" /></p>
            <span class="el-dropdown-link">{{val}}%<i class="el-icon-arrow-down el-icon--right"></i></span>
            <p @click.stop="zoomOut"><Icon name="#icon-zoom-out" /></p>
        </div>
        <el-dropdown-menu slot="dropdown">
            <div style="height:200px;overflow-y:auto">
            <el-dropdown-item v-for="(v, k) in list" :key="v" :command="k">
                <span style="padding:0 24px">{{v}}%</span>
            </el-dropdown-item>
            </div>
        </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
import Icon from '../svgContainer'
export default {
    components: {
        Icon
    },
    data(){
        return {
            currentIndex: 6,
            list: [
                33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 200, 250, 300
            ]
        }
    },
    computed: {
        val(){
            return this.list[this.currentIndex]
        },
        graph(){
            return this.$parent.Stager.graph
        }
    },
    methods: {
        handleCommand(command){
            this.currentIndex = command
            this.zoom(this.list[command])
        },
        zoomIn(){
            if(this.currentIndex < this.list.length - 1){
                this.currentIndex = this.currentIndex + 1
                this.zoom(this.list[this.currentIndex])
            }
        },
        zoomOut(){
            if(this.currentIndex > 0){
                this.currentIndex = this.currentIndex - 1
                this.zoom(this.list[this.currentIndex])
            }
        },
        zoom(scale){
            setTimeout(() => {
                this.graph.zoomTo(scale / 100)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.btf-zoom{
    padding: 6px 10px 3px 6px;
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 499;
    background: #fff;
    box-shadow: 0 0 0 1px #dddbda, 0 2px 3px 0 rgba(0,0,0,.16);
    .zoom-bar{
        display: flex;
        align-items: center;
        .next-icon{
            cursor: pointer;
            width: 16px;
            height: 16px;
        }
        .el-dropdown-link{
            display: block;
            width: 74px;
            box-sizing: border-box;
            font-size: 14px;
            text-align: center;
        }
    }
}
</style>