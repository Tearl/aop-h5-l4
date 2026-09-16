
<template>
    <div class="x6-graph-custom-works-model-list">
        <div style="padding-bottom:10px">
            <el-input size="mini" placeholder="搜索" clearable v-model="searchValue" @clear="searchComfirn" @keyup.enter.native="searchComfirn">
                <el-button size="mini"  slot="append" icon="el-icon-search" @click="searchComfirn"></el-button>
            </el-input>
        </div>
        <ul>
            <li v-for="(v) in objList" :key="v.objCode">
                <div class="x6-graph-custom-works-model" @click="itemSelect(v)">
                    <icon-container name="#icon-shujumoxing" />
                    <div class="x6-graph-custom-works-model-info">
                        <div class="x6-graph-custom-works-model-info-text" :title="v.objName + '(' +v.objCode + ')'">
                            <span class="x6-graph-custom-works-model-info-name">{{v.objName}}</span>
                            <span class="x6-graph-custom-works-model-info-code">({{v.objCode}})</span>
                        </div>
                        <div class="x6-graph-custom-works-model-info-edit" v-if="showEdit" @click.stop="itemEdit(v)">
                            <icon-container name="#icon-edit" />
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import iconContainer from '../iconContainer'
export default {
    components: {
        iconContainer
    },
    props: {
        list: {
            type: Array,
            default(){
                return []
            }
        },
        showEdit: {
            type: Boolean,
            default: true
        }
    },
    data(){
        return {
            searchValue: '',
            objList: []
        }
    },
    methods: {
        itemSelect(options){
            this.$emit('itemSelect', options)
        },
        itemEdit(options){
            this.$emit('itemEdit', options)
        },
        searchComfirn(){
            if(!this.searchValue){
                this.objList = this.list
            }else{
                this.objList = this.list.filter(o => {
                    return o.objName.indexOf(this.searchValue) != -1 || o.objCode.indexOf(this.searchValue) != -1
                })
            }
        }
    },
    watch: {
        list(val){
            this.searchComfirn()
        }
    }
}
</script>