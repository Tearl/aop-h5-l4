<template>
    <el-drawer title="查看分类" :visible.sync="drawerVisible" size="800px" class="drawer_common_wrap">
        <div class="sort_detail_drawer">
            <div class="detail_item">
                <span class="detail_label">上级分类：</span>
                <span>{{detailInfo.preCategoryName || '/'}}</span>
            </div>
            <div class="detail_item">
                <span class="detail_label">分类名称：</span>
                <span>{{detailInfo.categoryName}}</span>
            </div>
            <div class="detail_item">
                <span class="detail_label">是否底层：</span>
                <span>{{detailInfo.endFlag == '1' ? '是' : '否'}}</span>
            </div>
        </div>
        <div class="detail_desc" v-if="detailInfo.endFlag == '1'">
            <span class="detail_label">分类说明：</span>
            <aopCommonDocPreview :data="initValues.html" />
        </div>
    </el-drawer>
</template>

<script>
import mixin from "@m/core/mixin";
export default {
    mixins: [mixin],
    data() {
        return {
            initValues: {
                html: ''
            },
            detailInfo: {}
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
        }
    },
    computed: {
        drawerVisible: {
            get () {
                return this.value
            },

            set (val) {
                this.$emit('input', val)
            }
        }
    },
    mounted() {
        this.queryThemDetail()
    },
    methods: {
        async queryThemDetail() {
            const {
                categoryId
            } = this.formInfo
            const { categoryName, categoryDesc, endFlag, preCategoryName } = await this.rpc.datadict.qryDataDictionaryCategoryDetail({categoryId})
            this.detailInfo = {
                categoryName,
                categoryId,
                endFlag,
                preCategoryName
            }
            this.initValues.html = categoryDesc
        }
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
    .sort_detail_drawer {
        border-bottom: 1px solid rgba(238,240,245,1);
    }
    .detail_item, .detail_desc {
        margin-bottom: 24px;

        span {
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
            line-height: 20px;
            font-weight: 400;
        }

        .detail_label {
            color: #999999;
        }
    }
    .detail_desc {
        margin-top: 24px;
    }
}
</style>