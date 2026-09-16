<template>
    <el-dialog
        :visible.sync="dialogVisible"
        title="删除确认"
        width="420px"
        :close-on-click-modal="false"
    >
        <div v-if="blocked">
            <p>该SOW已关联方案，无法删除。</p>
            <p v-if="blockedSolutions.length">
                关联方案：<strong>{{ blockedSolutions.join('、') }}</strong>
            </p>
        </div>
        <div v-else>
            <p>确定删除当前SOW「{{ sowInfo && sowInfo.name }}」吗？删除后不可恢复。</p>
        </div>
        <span slot="footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button
                v-if="!blocked"
                type="danger"
                :loading="loading"
                @click="handleConfirm"
            >确定删除</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'DeleteDialog',
    props: {
        visible: { type: Boolean, default: false },
        sowInfo: { type: Object, default: null }
    },
    data() {
        return {
            loading: false,
            blocked: false,
            blockedSolutions: []
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible },
            set(val) { this.$emit('update:visible', val) }
        }
    },
    watch: {
        visible(val) {
            if (val && this.sowInfo) {
                this.checkBlocked()
            }
        }
    },
    methods: {
        checkBlocked() {
            if (this.sowInfo && this.sowInfo.solutions && this.sowInfo.solutions.length > 0) {
                this.blocked = true
                this.blockedSolutions = this.sowInfo.solutions.map(s => s.name || s)
            } else {
                this.blocked = false
                this.blockedSolutions = []
            }
        },
        async handleConfirm() {
            this.loading = true
            try {
                this.$emit('confirm')
            } finally {
                this.loading = false
            }
        }
    }
}
</script>