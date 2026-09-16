<template>
    <el-table
        :data="data"
        v-loading="loading"
        border
        stripe
        style="width: 100%"
    >
        <el-table-column prop="sowId" label="SOW ID" width="180" />
        <el-table-column prop="name" label="SOW名称" min-width="160" />
        <el-table-column prop="type" label="SOW类型" width="100">
            <template slot-scope="{ row }">
                {{ typeLabel(row.type) }}
            </template>
        </el-table-column>
        <el-table-column prop="relatedBiz" label="关联商机" min-width="140" />
        <el-table-column prop="expectEndTime" label="期望完成时间" width="120" />
        <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="{ row }">
                <el-tag
                    :type="statusTagType(row.status)"
                    size="small"
                >{{ statusLabel(row.status) }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" width="100" />
        <el-table-column label="操作" width="220" fixed="right">
            <template slot-scope="{ row }">
                <ActionButtons
                    :row="row"
                    @edit="$emit('edit', row)"
                    @delete="$emit('delete', row)"
                    @submit="$emit('submit', row)"
                    @view="$emit('view', row)"
                />
            </template>
        </el-table-column>
    </el-table>
    <div class="sow-table__pagination">
        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[10]"
            @current-change="$emit('page-change', $event)"
        />
    </div>
</template>

<script>
import ActionButtons from './ActionButtons'

const TYPE_MAP = { POC: 'POC', DELIVERY: '交付', FM1: 'FM1', OTHER: '其他' }
const STATUS_MAP = { REGISTERED: '已注册', COMPLETED: '已完成', REGISTERED_FINAL: '已登记' }

export default {
    name: 'SowTable',
    components: { ActionButtons },
    props: {
        data: { type: Array, default: () => [] },
        total: { type: Number, default: 0 },
        loading: { type: Boolean, default: false },
        currentPage: { type: Number, default: 1 },
        pageSize: { type: Number, default: 10 }
    },
    methods: {
        typeLabel(type) { return TYPE_MAP[type] || type },
        statusLabel(status) { return STATUS_MAP[status] || status },
        statusTagType(status) {
            if (status === 'REGISTERED') return 'warning'
            if (status === 'COMPLETED') return 'success'
            return 'info'
        }
    }
}
</script>

<style scoped>
.sow-table__pagination {
    margin-top: 16px;
    text-align: right;
}
</style>