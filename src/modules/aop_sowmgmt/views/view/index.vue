<template>
    <div class="sow-view" v-loading="loading">
        <div class="sow-view__header">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">SOW管理</el-breadcrumb-item>
                <el-breadcrumb-item>SOW详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-tabs v-model="activeTab" type="card">
            <el-tab-pane label="基本信息" name="basic">
                <ViewBasicInfo :data="sowData" />
            </el-tab-pane>
            <el-tab-pane label="SOW清单" name="items">
                <ViewSowItems :sow-id="sowId" :sow-type="sowData && sowData.type" />
            </el-tab-pane>
            <el-tab-pane label="关联方案" name="solutions">
                <SolutionsTab :sow-id="sowId" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ViewBasicInfo from './components/BasicInfo'
import ViewSowItems from './components/SowItems'
import SolutionsTab from './components/SolutionsTab'

export default {
    name: 'SowView',
    components: { ViewBasicInfo, ViewSowItems, SolutionsTab },
    data() {
        return {
            activeTab: 'basic',
            sowData: null,
            loading: false
        }
    },
    computed: {
        ...mapGetters('sow', ['currentSow', 'viewLoading']),
        sowId() {
            return this.$route.params.id
        }
    },
    created() {
        this.fetchDetail()
    },
    methods: {
        ...mapActions('sow', ['fetchSowDetail']),
        async fetchDetail() {
            this.loading = true
            try {
                this.sowData = await this.fetchSowDetail(this.sowId)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.sow-view {
    padding: 16px;
}
.sow-view__header {
    margin-bottom: 16px;
}
</style>