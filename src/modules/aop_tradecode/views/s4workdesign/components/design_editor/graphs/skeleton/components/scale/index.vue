
<template>
    <div class="x6-graph-custom-works-scale">
        <el-dropdown size="mini" placement="top" trigger="click" @command="handleCommand">
            <div class="x6-graph-custom-works-scale-bar">
                <p @click.stop="zoomIn"><icon-container name="#icon-zoom-in" /></p>
                <span class="el-dropdown-link">{{val}}%<i class="el-icon-arrow-down el-icon--right"></i></span>
                <p @click.stop="zoomOut"><icon-container name="#icon-zoom-out" /></p>
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
import iconContainer from '../iconContainer'
export default {
    inject: ['getEditor'],
    components: {
        iconContainer
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
            let editor = this.getEditor()
            editor.view.graph.zoomTo(scale / 100)
        }
    }
}
</script>
