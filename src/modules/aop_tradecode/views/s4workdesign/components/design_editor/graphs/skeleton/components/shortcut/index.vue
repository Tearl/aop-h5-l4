<template>
    <div class="x6-graph-custom-works-shortcut">
        <template v-if="!excludeIcons.includes('undo') || !excludeIcons.includes('redo')">
            <el-tooltip effect="dark" content="取消" placement="top" v-if="!excludeIcons.includes('undo')">
                <div class="x6-graph-custom-works-shortcut-key" :class="{'disabled': disabled.includes('undo') }" @click="iconClick('undo')">
                    <icon-container name="#icon-undo" />
                </div>
            </el-tooltip>
            <el-tooltip effect="dark" content="重做" placement="top" v-if="!excludeIcons.includes('redo')">
                <div class="x6-graph-custom-works-shortcut-key" :class="{'disabled': disabled.includes('redo') }" @click="iconClick('redo')">
                    <icon-container name="#icon-redo" />
                </div>
            </el-tooltip>
            <div><el-divider direction="vertical"></el-divider></div>
        </template>

        <template v-if="!excludeIcons.includes('move') || !excludeIcons.includes('select')">
            <el-tooltip effect="dark" content="拖拽画布" placement="top" v-if="!excludeIcons.includes('move')">
                <div class="x6-graph-custom-works-shortcut-key" :class="{'actived': current == 'move' }" @click="iconClick('move')">
                    <icon-container name="#icon-zhuashou" />
                </div>
            </el-tooltip>
            <el-tooltip effect="dark" content="框选节点" placement="top" v-if="!excludeIcons.includes('select')">
                <div class="x6-graph-custom-works-shortcut-key" :class="{'actived': current == 'select' }" @click="iconClick('select')">
                    <icon-container name="#icon-kuangxuan" />
                </div>
            </el-tooltip>
            <div><el-divider direction="vertical"></el-divider></div>
        </template>

        <template>
            <el-tooltip effect="dark" content="复制" placement="top" v-if="!excludeIcons.includes('copy')">
                <div class="x6-graph-custom-works-shortcut-key" :class="{'disabled': disabled.includes('copy') }" @click="iconClick('copy')">
                    <icon-container name="#icon-copy" />
                </div>
            </el-tooltip>
            <el-tooltip effect="dark" content="黏贴" placement="top" v-if="!excludeIcons.includes('paste')">
                <div class="x6-graph-custom-works-shortcut-key" :class="{'disabled': disabled.includes('paste') }" @click="iconClick('paste')">
                    <icon-container name="#icon-paste" />
                </div>
            </el-tooltip>
        </template>
        <el-tooltip effect="dark" content="删除" placement="top" v-if="!excludeIcons.includes('del')">
            <div class="x6-graph-custom-works-shortcut-key" :class="{'disabled': disabled.includes('del') }" @click="iconClick('del')">
                <icon-container name="#icon-ashbin" />
            </div>
        </el-tooltip>
        <!--<div><el-divider direction="vertical"></el-divider></div>
        <el-tooltip effect="dark" content="聚合" placement="top">
            <div class="x6-graph-custom-works-shortcut-key">
                <icon-container name="#icon-a-bianzu2" />
            </div>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top">
            <div class="x6-graph-custom-works-shortcut-key">
                <icon-container name="#icon-Icon-link-unlink" />
            </div>
        </el-tooltip> -->
    </div>
</template>
<script>
import iconContainer from '../iconContainer'
export default {
    components: {
        iconContainer
    },
    props: {
        excludeIcons: {
            type: Array,
            default(){
                return []
            }
        }
    },
    data(){
        return {
            current: 'select',
            disabled: ['undo','redo','copy','paste','del']
        }
    },

    methods: {
        iconClick(key){
            if(!this.disabled.includes(key)){
                if(['select','move'].includes(key)){
                    this.current = key
                }
                this.$emit('iconClick', key)
            }
        },

        formatIcons(icons){
            return Array.isArray(icons) ? icons : (icons ? [icons] : [])
        },

        setDisabledIcon(icons){
            let _icons = this.formatIcons(icons)
            _icons.forEach(icon => {
                if(this.disabled.indexOf(icon) == '-1'){
                    this.disabled.push(icon)
                }
            })
        },

        cleanDisabledIcon(icons){
            let _icons = this.formatIcons(icons)
            this.disabled = this.disabled.filter(key => !_icons.includes(key))
        }
    }
}
</script>
