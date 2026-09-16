<template>
    <el-drawer
        :visible.sync="drawerVisible"
        title="新建SOW"
        size="480px"
        :close-on-click-modal="false"
        :wrapperClosable="false"
    >
        <div class="create-drawer">
            <el-form ref="form" :model="form" :rules="rules" label-width="110px" size="small">
                <el-form-item label="SOW名称" prop="name">
                    <el-input
                        v-model="form.name"
                        placeholder="请输入SOW名称"
                        maxlength="30"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="关联商机" prop="relatedBiz">
                    <el-input
                        v-model="form.relatedBiz"
                        placeholder="请输入关联商机"
                        maxlength="30"
                    />
                </el-form-item>
                <el-form-item label="商机编号" prop="bizNo">
                    <el-input
                        v-model="form.bizNo"
                        placeholder="请输入商机编号"
                        maxlength="30"
                    />
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
            </el-form>
        </div>
        <div class="create-drawer__footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" :loading="creating" @click="handleCreate">仅创建</el-button>
            <el-button type="primary" :loading="creatingAndEdit" @click="handleCreateAndEdit">
                创建并继续设计
            </el-button>
        </div>
    </el-drawer>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'CreateDrawer',
    props: {
        visible: { type: Boolean, default: false }
    },
    data() {
        return {
            creating: false,
            creatingAndEdit: false,
            attachmentList: [],
            form: {
                name: '',
                relatedBiz: '',
                bizNo: '',
                type: '',
                productType: '',
                expectEndTime: '',
                description: ''
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
    computed: {
        drawerVisible: {
            get() { return this.visible },
            set(val) { this.$emit('update:visible', val) }
        }
    },
    methods: {
        ...mapActions('sow', ['createSowData']),
        resetForm() {
            this.form = {
                name: '',
                relatedBiz: '',
                bizNo: '',
                type: '',
                productType: '',
                expectEndTime: '',
                description: ''
            }
            this.attachmentList = []
        },
        async validateForm() {
            try {
                await this.$refs.form.validate()
                return true
            } catch {
                return false
            }
        },
        async handleCreate() {
            const valid = await this.validateForm()
            if (!valid) return
            this.creating = true
            try {
                const res = await this.createSowData({ ...this.form })
                this.$message.success('SOW创建成功')
                this.drawerVisible = false
                this.resetForm()
                this.$emit('created')
            } finally {
                this.creating = false
            }
        },
        async handleCreateAndEdit() {
            const valid = await this.validateForm()
            if (!valid) return
            this.creatingAndEdit = true
            try {
                const res = await this.createSowData({ ...this.form })
                this.$message.success('SOW创建成功')
                this.drawerVisible = false
                this.resetForm()
                if (res && res.id) {
                    this.$router.push({ name: 'aopSowmgmtEdit', params: { id: res.id } })
                }
            } finally {
                this.creatingAndEdit = false
            }
        },
        handleCancel() {
            this.drawerVisible = false
            this.resetForm()
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
.create-drawer {
    padding: 0 16px;
}
.create-drawer__footer {
    padding: 16px;
    text-align: right;
    border-top: 1px solid #EBEEF5;
}
.create-drawer__footer .el-button {
    margin-left: 8px;
}
</style>