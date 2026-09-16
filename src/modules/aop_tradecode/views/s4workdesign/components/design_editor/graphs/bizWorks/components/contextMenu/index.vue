
<template>
    <div ref="contexts" class="x6-graph-custom-bizWorks-contextmenu" @mouseleave="mouseleave" @click="del">
        <i class="el-icon-delete" style="color:red"></i>
        <span>删除</span>
    </div>
</template>
<script>
export default {
    methods: {
        calc(options){
            let { x, y } = options
            let offset = document.querySelector('.x6-graph-custom-works-skeleton-main').getBoundingClientRect()
            this.$refs.contexts.style = `left:${ x - offset.x - 3}px;top:${ y - offset.y - 3}px;display:block`
            return new Promise((resolve, reject) => {
                this.resolver = resolve
                this.rejecter = reject
            })
        },
        mouseleave(){
            this.$refs.contexts.style = ''
            if(this.rejecter){
                this.rejecter()
                this.reset()
            }
        },
        del(){
            this.$refs.contexts.style = ''
            this.resolver()
            this.reset()
        },
        reset(){
            this.resolver = null
            this.rejecter = null
        }
    }
}
</script>
<style lang="scss">
.x6-graph-custom-bizWorks-contextmenu{
    position: absolute;
    z-index: 99;
    display: none;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    padding: 4px 6px;
    cursor: pointer;
    span{
        color: red;
    }
}
</style>