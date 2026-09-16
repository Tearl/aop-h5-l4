<template>
    <el-button-group>
        <el-button
            v-if="showAction('submit')"
            type="primary"
            size="mini"
            @click="$emit('submit', row)"
        >提交完成</el-button>
        <el-button
            v-if="showAction('edit')"
            type="text"
            size="mini"
            @click="$emit('edit', row)"
        >编辑</el-button>
        <el-button
            v-if="showAction('view')"
            type="text"
            size="mini"
            @click="$emit('view', row)"
        >查看</el-button>
        <el-button
            v-if="showAction('delete')"
            type="text"
            size="mini"
            class="action--danger"
            @click="$emit('delete', row)"
        >删除</el-button>
    </el-button-group>
</template>

<script>
const STATUS_ACTIONS = {
    REGISTERED: ['submit', 'edit', 'view', 'delete'],
    COMPLETED: ['edit', 'view', 'delete'],
    REGISTERED_FINAL: ['view']
}

export default {
    name: 'ActionButtons',
    props: {
        row: { type: Object, required: true }
    },
    methods: {
        showAction(action) {
            const allowed = STATUS_ACTIONS[this.row.status] || []
            return allowed.includes(action)
        }
    }
}
</script>

<style scoped>
.action--danger {
    color: #F56C6C;
}
.action--danger:hover {
    color: #F56C6C;
}
</style>