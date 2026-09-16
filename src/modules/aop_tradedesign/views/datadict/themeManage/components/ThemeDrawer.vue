<template>
    <el-drawer :title="drawerTitle" :visible.sync="drawerVisible" size="800px" class="drawer_common_wrap">
        <formEdit @cancel="drawerVisible = false" :formInfo="formInfo" :type="type" v-on="$listeners" />
    </el-drawer>
</template>

<script>
import formEdit from './FormEdit'
export default {
    components: {
        formEdit
    },
    data() {
        return {
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: ''
        },
        formInfo: {
            type: Object,
            default: () => {}
        },
        operate: {
            type: String,
            default: ''
        },
    },
    computed: {
        drawerVisible: {
            get () {
                return this.value
            },

            set (val) {
                this.$emit('input', val)
            }
        },
        drawerTitle() {
            switch(this.type) 
            {
                case 'add':
                    return '新增标准主题'
                case 'edit':
                    return '编辑标准主题'
                
            }
        }
    },
    methods: {
        
    }
}
</script>
<style lang="scss" scoped>
    
    
</style>
<style lang="scss" scoped>
.drawer_common_wrap {
    
    /deep/.el-drawer__body {
        padding: 24px;
        // padding-bottom: 90px;
    }
    /deep/.el-drawer__header {
        font-size: 16px;
        color: #333333;
        font-weight: 600;
        margin: 0;
        padding: 16px 24px;
        box-shadow: inset 0px -0.5px 0px 0px rgba(220,224,228,1);;
    }
}
</style>