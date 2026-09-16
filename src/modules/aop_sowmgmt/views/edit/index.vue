<template>
    <div class="sow-edit" v-loading="loading">
        <div class="sow-edit__header">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">SOW管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑SOW</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-tabs v-model="activeTab" type="card">
            <el-tab-pane label="基本信息" name="basic">
                <BasicInfo
                    ref="basicInfo"
                    :sow-id="sowId"
                    :data="sowData"
                    @save="handleSaveBasic"
                />
            </el-tab-pane>
            <el-tab-pane label="SOW清单" name="items">
                <SowItems
                    ref="sowItems"
                    :sow-id="sowId"
                    :sow-type="sowData && sowData.type"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BasicInfo from './components/BasicInfo'
import SowItems from './components/SowItems'

export default {
    name: 'SowEdit',
    components: { BasicInfo, SowItems },
    data() {
        return {
            activeTab: 'basic',
            sowData: null,
            loading: false
        }
    },
    computed: {
        ...mapGetters('sow', ['currentSow', 'editLoading']),
        sowId() {
            return this.$route.params.id
        }
    },
    created() {
        this.fetchDetail()
    },
    methods: {
        ...mapActions('sow', ['fetchSowDetail', 'updateSowData']),
        async fetchDetail() {
            this.loading = true
            try {
                this.sowData = await this.fetchSowDetail(this.sowId)
            } finally {
                this.loading = false
            }
        },
        async handleSaveBasic(data) {
            await this.updateSowData({ id: this.sowId, data })
            this.$message.success('保存成功')
        }
    }
}
</script>

<style scoped>
.sow-edit {
    padding: 16px;
}
.sow-edit__header {
    margin-bottom: 16px;
}
</style>