<template>
    <div class="common_table_operate">
        
            <div @mouseleave="item.hasActive = false" @mouseenter="item.hasActive = true" @click="btnClick(i)" :class="['common_table_operate_item']" v-for="(item, i) in operate_btn" :key="item">
                <el-popover
                    placement="bottom"
                    popper-class="btn_style"
                    width="120"
                    trigger="click" :disabled="!item.isPop">
                    <div>
                        <el-checkbox-group v-model="selectItemKeyList" @change="handleChange">
                            <el-checkbox v-for="item in tableColumnList" :key="item.value" :label="item.value" >{{item.text}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div slot="reference">
                        <img :src="item.defaultIcon" v-if="!item.hasActive" alt="">
                        <img :src="item.activeIcon" v-else alt="">
                    </div>
                </el-popover>
            </div>
        
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    props: {
        btnList: {
            type: Array,
            default: () => []
        },
        tableColumnList: {
            type: Array,
            default: () => []
        },
        selectItemKeyList: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        operate_btn() {
            if(this.btnList.length == 0) {
                return this.defaultBtns
            } else {
                return this.btnList
            }
        }
    },
    data() {
        return {
            defaultBtns: [
                {
                    defaultIcon: require('@m/assets/images/common_search.png'),
                    activeIcon: require('@m/assets/images/common_search_h.png'),
                    hasActive: false,
                    isPop: false
                },
                // {
                //     defaultIcon: require('@m/assets/images/common_list.png'),
                //     activeIcon: require('@m/assets/images/common_list_h.png'),
                //     hasActive: false,
                //     isPop: false
                    
                // },
                // {
                //     defaultIcon: require('@m/assets/images/common_line.png'),
                //     activeIcon: require('@m/assets/images/common_line_h.png'),
                //     hasActive: false,
                //     isPop: false
                // },
                // {
                //     defaultIcon: require('@m/assets/images/common_operate.png'),
                //     activeIcon: require('@m/assets/images/common_operate_h.png'),
                //     hasActive: false,
                //     isPop: true
                // }
            ]
        }
    },
    mounted() {
        console.log(this.tableColumnList,this.selectItemKeyList, 'tableColumnList-----')
    },
    methods: {
        btnClick(index) {
            console.log(index, 'index-----')
            this.$emit('btnClick', index)
        },
        handleChange(value) {
            console.log(value)
            this.$emit('changeComlunTable', this.selectItemKeyList)
        }
    }
}
</script>

<style lang="scss">

.btn_style {
    .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #333333;
        font-family: PingFangSC-Regular;
        font-size: 12px;
    }
    &.el-popover {
        min-width: 120px;
    }
    .el-checkbox, .el-checkbox__label {
        color: #333333;
        font-family: PingFangSC-Regular;
        font-size: 12px;
    }
}
</style>

<style lang="scss">
.common_table_operate {
    display: flex;
    align-items: center;
    // border: 1px solid rgba(220,224,228,1);

    .common_table_operate_item {
        width: 36px;
        height: 32px;
        cursor: pointer;

        // display: flex;
        // justify-content: center;
        // align-items: center;
        line-height: 40px;
        text-align: center;

        border-top: 1px solid rgba(220,224,228,1);
        border-bottom: 1px solid rgba(220,224,228,1);
        border-left: 0.5px solid rgba(220,224,228,1);
        border-right: 0.5px solid rgba(220,224,228,1);
        border-right: none;

        &:first-child {
            border-left: 1px solid rgba(220,224,228,1);
        }
        &:last-child {
            border-right: 1px solid rgba(220,224,228,1);
        }

        img {
            width: 20px;
            height: 20px;
        }
        &:hover {

            border: 1px solid #358AFF;
        }
    }
    
}
</style>