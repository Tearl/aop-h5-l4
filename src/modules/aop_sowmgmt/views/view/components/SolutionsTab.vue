<template>
    <div class="solutions-tab" v-loading="loading">
        <el-table :data="solutions" border stripe style="width: 100%">
            <el-table-column prop="name" label="方案名称" min-width="160">
                <template slot-scope="{ row }">
                    <el-button type="text" @click="handleOpenSolution(row)">{{ row.name }}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
                <template slot-scope="{ row }">
                    <el-tag :type="row.status === 'APPROVED' ? 'success' : 'info'" size="small">
                        {{ row.statusLabel || row.status }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="160" />
            <el-table-column prop="creator" label="创建人" width="100" />
        </el-table>
        <div v-if="!solutions.length && !loading" class="solutions-tab__empty">
            暂无关联方案
        </div>
    </div>
</template>

<script>
function getSowSolutions(sowId) {
    return app.api.rpc('aop.sowmgmt.getSowSolutions', { sowId })
}

export default {
    name: 'SolutionsTab',
    props: {
        sowId: { type: String, required: true }
    },
    data() {
        return {
            solutions: [],
            loading: false
        }
    },
    created() {
        this.fetchSolutions()
    },
    methods: {
        async fetchSolutions() {
            this.loading = true
            try {
                const res = await getSowSolutions(this.sowId)
                this.solutions = res.list || res || []
            } finally {
                this.loading = false
            }
        },
        handleOpenSolution(row) {
            if (row.id) {
                window.open(`/solution/detail/${row.id}`, '_blank')
            }
        }
    }
}
</script>

<style scoped>
.solutions-tab {
    padding: 8px 0;
}
.solutions-tab__empty {
    padding: 60px 0;
    text-align: center;
    color: #909399;
}
</style>