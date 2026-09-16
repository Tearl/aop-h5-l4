<template>
    <div class="view-sow-items">
        <el-table :data="items" border stripe v-loading="loading" style="width: 100%">
            <el-table-column prop="name" label="功能名称" min-width="140" />
            <el-table-column prop="description" label="功能说明" min-width="180" />
            <el-table-column prop="fitAssessed" label="功能合用" width="100">
                <template slot-scope="{ row }">
                    <el-tag
                        :type="row.fitAssessed ? 'success' : 'info'"
                        size="small"
                    >{{ row.fitAssessed ? '合用' : '未评价' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column v-if="isPoc" prop="pocScore" label="POC分值" width="100" />
            <el-table-column v-if="isPoc" prop="pocSelfScore" label="自评得分" width="100" />
            <el-table-column v-if="isPoc" prop="pocCompeteScore" label="竞对得分" width="100" />
        </el-table>
        <div v-if="!items.length && !loading" class="view-sow-items__empty">
            暂无SOW清单数据
        </div>
    </div>
</template>

<script>
import { getSowItems } from '../../../core/api/sow'

export default {
    name: 'ViewSowItems',
    props: {
        sowId: { type: String, required: true },
        sowType: { type: String, default: '' }
    },
    data() {
        return {
            items: [],
            loading: false
        }
    },
    computed: {
        isPoc() {
            return this.sowType === 'POC'
        }
    },
    created() {
        this.fetchItems()
    },
    methods: {
        async fetchItems() {
            this.loading = true
            try {
                const res = await getSowItems(this.sowId)
                this.items = res.list || res || []
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.view-sow-items {
    padding: 8px 0;
}
.view-sow-items__empty {
    padding: 60px 0;
    text-align: center;
    color: #909399;
}
</style>