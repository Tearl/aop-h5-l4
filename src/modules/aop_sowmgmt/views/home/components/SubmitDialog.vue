<template>
    <el-dialog
        :visible.sync="dialogVisible"
        title="提交完成确认"
        width="420px"
        :close-on-click-modal="false"
    >
        <div v-if="validationError">
            <p style="color: #F56C6C;">{{ validationError }}</p>
        </div>
        <div v-else>
            <p>确定将SOW「{{ sowInfo && sowInfo.name }}」提交完成吗？</p>
            <p style="color: #909399;">提交后状态将变更为"已完成"。</p>
        </div>
        <span slot="footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button
                v-if="!validationError"
                type="primary"
                :loading="loading"
                @click="handleConfirm"
            >确定提交</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'SubmitDialog',
    props: {
        visible: { type: Boolean, default: false },
        sowInfo: { type: Object, default: null }
    },
    data() {
        return {
            loading: false,
            validationError: ''
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
                this.validateSubmit()
            }
        }
    },
    methods: {
        validateSubmit() {
            const sow = this.sowInfo || {}
            const checks = []
            if (!sow.items || !sow.items.length) {
                checks.push('SOW清单未导入或为空')
            }
            if (sow.items && sow.items.some(i => !i.fitAssessed)) {
                checks.push('存在功能未完成合用评价')
            }
            this.validationError = checks.length ? checks.join('；') : ''
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