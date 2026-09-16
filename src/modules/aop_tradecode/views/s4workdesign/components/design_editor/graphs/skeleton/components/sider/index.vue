<template>
    <div class="x6-graph-custom-works-sider">
        <!-- <div class="x6-graph-custom-works-sider-bar">
            <div v-for="(v) in tabs" :class="{actived: current.value == v.value}" :key="v.value" @click="activTab(v)">{{v.label}}</div>
        </div> -->
        <div class="x6-graph-custom-works-sider-body" v-show="showSide">
            <div class="x6-graph-custom-works-sider-body-header">
                <h5>{{current.label}}</h5>
                <div class="x6-graph-custom-works-sider-header-tool" @click="hideSiderBody">
                    <i class="el-icon-arrow-left"></i>
                </div>
            </div>
            <div class="x6-graph-custom-works-sider-main">
                <slot :data="current"></slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        showSide: {
            type: Boolean,
            default: false
        },
        tabs: {
            type: Array,
            default(){
                return [
                    {label:'领域模型',value:'00'}
                ]
            }
        }
    },
    data(){
        return {
            current: {}
        }
    },
    mounted(){
        if(this.showSide){
            this.current = this.tabs[0]
        }
    },
    methods: {
        activTab(option){
            this.current = option
            this.$emit('update:showSide', true)
            this.$emit('tabChange', this.current)
        },
        hideSiderBody(){
            this.current = {}
            this.$emit('update:showSide', false)
            this.$emit('tabChange', this.current)
        }
    }
}
</script>
