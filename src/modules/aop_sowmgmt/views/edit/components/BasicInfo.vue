<template>
    <div class="basic-info">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
            <el-form-item label="SOW名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入SOW名称" maxlength="30" show-word-limit />
            </el-form-item>
            <el-form-item label="关联商机" prop="relatedBiz">
                <el-input v-model="form.relatedBiz" placeholder="请输入关联商机" maxlength="30" />
            </el-form-item>
            <el-form-item label="商机编号" prop="bizNo">
                <el-input v-model="form.bizNo" placeholder="请输入商机编号" maxlength="30" />
            </el-form-item>
            <el-form-item label="SOW类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择SOW类型" style="width:100%">
                    <el-option label="POC" value="POC" />
                    <el-option label="交付" value="DELIVERY" />
                    <el-option label="FM1" value="FM1" />
                    <el-option label="其他" value="OTHER" />
                </el-select>
            </el-form-item>
            <el-form-item label="产品类型" prop="productType">
                <el-select v-model="form.productType" placeholder="请选择产品类型" style="width:100%">
                    <el-option label="业务产品" value="BUSINESS" />
                    <el-option label="平台产品" value="PLATFORM" />
                    <el-option label="工具产品" value="TOOL" />
                </el-select>
            </el-form-item>
            <el-form-item label="期望完成时间" prop="expectEndTime">
                <el-date-picker
                    v-model="form.expectEndTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择期望完成时间"
                    style="width:100%"
                />
            </el-form-item>
            <el-form-item label="凭据附件">
                <el-upload
                    action="#"
                    :file-list="attachmentList"
                    :limit="3"
                    :on-remove="handleRemoveAttachment"
                    :before-upload="handleBeforeUploadAttachment"
                >
                    <el-button size="small" type="primary">上传附件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="描述">
                <el-input
                    v-model="form.description"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入描述"
                    maxlength="200"
                    show-word-limit
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
            </el-form-item>
        </el-form>

        <PocInfo v-if="form.type === 'POC'" :data="form.pocInfo" :sow-id="sowId" />
    </div>
</template>

<script>
import PocInfo from './PocInfo'

export default {
    name: 'BasicInfo',
    components: { PocInfo },
    props: {
        sowId: { type: String, required: true },
        data: { type: Object, default: null }
    },
    data() {
        return {
            saving: false,
            attachmentList: [],
            form: {
                name: '',
                relatedBiz: '',
                bizNo: '',
                type: '',
                productType: '',
                expectEndTime: '',
                description: '',
                pocInfo: null
            },
            rules: {
                name: [
                    { required: true, message: '请输入SOW名称', trigger: 'blur' },
                    { max: 30, message: '不超过30字', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择SOW类型', trigger: 'change' }
                ]
            }
        }
    },
    watch: {
        data: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.form = { ...this.form, ...val }
                }
            }
        }
    },
    methods: {
        async handleSave() {
            const valid = await this.$refs.form.validate().catch(() => false)
            if (!valid) return
            this.saving = true
            try {
                this.$emit('save', { ...this.form })
            } finally {
                this.saving = false
            }
        },
        handleRemoveAttachment(file, fileList) {
            this.attachmentList = fileList
        },
        handleBeforeUploadAttachment(file) {
            this.attachmentList.push({ name: file.name, uid: file.uid })
            return false
        }
    }
}
</script>

<style scoped>
.basic-info {
    max-width: 640px;
}
</style>