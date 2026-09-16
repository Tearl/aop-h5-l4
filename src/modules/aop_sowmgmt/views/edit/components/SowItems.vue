<template>
    <div class="sow-items">
        <div class="sow-items__toolbar">
            <el-button type="primary" size="small" @click="showImport = true">批量导入</el-button>
            <el-button size="small" @click="handleDownloadTemplate">下载模板</el-button>
        </div>
        <el-table :data="items" border stripe style="width: 100%; margin-top: 12px;">
            <el-table-column prop="name" label="功能名称" min-width="140" />
            <el-table-column prop="description" label="功能说明" min-width="180" />
            <el-table-column prop="fitAssessed" label="功能合用" width="100">
                <template slot-scope="{ row }">
                    <el-tag
                        :type="row.fitAssessed ? 'success' : 'info'"
                        size="small"
                    >{{ row.fitAssessed ? '已评价' : '待评价' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column v-if="isPoc" prop="pocScore" label="POC分值" width="100" />
            <el-table-column v-if="isPoc" prop="pocSelfScore" label="自评得分" width="100" />
            <el-table-column v-if="isPoc" prop="pocCompeteScore" label="竞对得分" width="100" />
            <el-table-column label="操作" width="160" fixed="right">
                <template slot-scope="{ row }">
                    <el-button type="text" size="mini" @click="handleEditItem(row)">编辑</el-button>
                    <el-button
                        type="text"
                        size="mini"
                        class="action--danger"
                        @click="handleDeleteItem(row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="!items.length" class="sow-items__empty">
            <p>请上传SOW清单</p>
        </div>

        <ImportDialog
            :visible.sync="showImport"
            :sow-id="sowId"
            :sow-type="sowType"
            :has-existing="items.length > 0"
            @imported="handleImported"
        />
        <ItemEditDialog
            :visible.sync="showItemEdit"
            :item="editingItem"
            :is-poc="isPoc"
            @confirm="handleItemEditConfirm"
        />
    </div>
</template>

<script>
import ImportDialog from './ImportDialog'
import ItemEditDialog from './ItemEditDialog'
import { getSowItems, deleteSowItem, updateSowItem } from '../../../core/api/sow'

export default {
    name: 'SowItems',
    components: { ImportDialog, ItemEditDialog },
    props: {
        sowId: { type: String, required: true },
        sowType: { type: String, default: '' }
    },
    data() {
        return {
            items: [],
            loading: false,
            showImport: false,
            showItemEdit: false,
            editingItem: null
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
        },
        handleDownloadTemplate() {
            const url = this.isPoc
                ? '/api/sow/template/poc.xlsx'
                : '/api/sow/template/normal.xlsx'
            window.open(url)
        },
        handleImported(items) {
            this.items = items
        },
        handleEditItem(row) {
            this.editingItem = { ...row }
            this.showItemEdit = true
        },
        async handleItemEditConfirm(data) {
            await updateSowItem(this.sowId, data.id, data)
            this.showItemEdit = false
            this.$message.success('编辑成功')
            this.fetchItems()
        },
        async handleDeleteItem(row) {
            let confirmMsg = '确定删除该功能吗？'
            if (row.matchedSolution) {
                confirmMsg = `该功能已关联方案「${row.matchedSolution}」，删除后匹配关系也将一并删除。确定继续吗？`
            }
            try {
                await this.$confirm(confirmMsg, '删除确认', {
                    type: 'warning'
                })
                await deleteSowItem(this.sowId, row.id)
                this.$message.success('删除成功')
                this.fetchItems()
            } catch {
                // cancelled
            }
        }
    }
}
</script>

<style scoped>
.sow-items {
    padding: 8px 0;
}
.sow-items__toolbar {
    display: flex;
    gap: 8px;
}
.sow-items__empty {
    padding: 60px 0;
    text-align: center;
    color: #909399;
}
.action--danger {
    color: #F56C6C;
}
</style>