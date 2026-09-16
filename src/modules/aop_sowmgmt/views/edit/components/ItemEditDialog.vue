<template>
    <el-dialog
        :visible.sync="dialogVisible"
        title="编辑功能信息"
        width="480px"
        :close-on-click-modal="false"
    >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
            <el-form-item label="功能名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入功能名称" />
            </el-form-item>
            <el-form-item label="功能说明">
                <el-input
                    v-model="form.description"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入功能说明"
                />
            </el-form-item>
            <el-form-item label="功能合用">
                <el-radio-group v-model="form.fitAssessed">
                    <el-radio :label="true">合用</el-radio>
                    <el-radio :label="false">不合用</el-radio>
                </el-radio-group>
            </el-form-item>
            <template v-if="isPoc">
                <el-form-item label="POC分值">
                    <el-input-number v-model="form.pocScore" :min="0" :max="100" />
                </el-form-item>
                <el-form-item label="自评得分">
                    <el-input-number v-model="form.pocSelfScore" :min="0" :max="100" />
                </el-form-item>
                <el-form-item label="竞对得分">
                    <el-input-number v-model="form.pocCompeteScore" :min="0" :max="100" />
                </el-form-item>
            </template>
        </el-form>
        <span slot="footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" :loading="saving" @click="handleConfirm">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'ItemEditDialog',
    props: {
        visible: { type: Boolean, default: false },
        item: { type: Object, default: null },
        isPoc: { type: Boolean, default: false }
    },
    data() {
        return {
            saving: false,
            form: {
                name: '',
                description: '',
                fitAssessed: false,
                pocScore: 0,
                pocSelfScore: 0,
                pocCompeteScore: 0
            },
            rules: {
                name: [
                    { required: true, message: '请输入功能名称', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible },
            set(val) { this.$emit('update:visible', val) }
        }
    },
    watch: {
        item: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.form = { ...this.form, ...val }
                }
            }
        }
    },
    methods: {
        async handleConfirm() {
            const valid = await this.$refs.form.validate().catch(() => false)
            if (!valid) return
            this.saving = true
            try {
                this.$emit('confirm', { ...this.form, id: this.item.id })
            } finally {
                this.saving = false
            }
        }
    }
}
</script>