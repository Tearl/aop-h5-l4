<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :title="hasExisting ? '重新导入SOW清单' : '导入SOW清单'"
        width="560px"
        :close-on-click-modal="false"
    >
        <div class="import-dialog">
            <el-upload
                ref="upload"
                drag
                action="#"
                :limit="1"
                :file-list="fileList"
                :before-upload="handleBeforeUpload"
                :on-remove="handleRemove"
                accept=".xlsx"
                :auto-upload="false"
            >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">
                    仅支持 .xlsx 格式文件。可先
                    <el-button type="text" @click="handleDownloadTemplate">下载模板</el-button>
                </div>
            </el-upload>

            <div v-if="diffResult && hasExisting" class="import-dialog__diff">
                <el-divider content-position="left">变更对比</el-divider>
                <div v-if="diffResult.added && diffResult.added.length" class="diff-section">
                    <h4 style="color: #67C23A;">新增功能 ({{ diffResult.added.length }})</h4>
                    <el-table :data="diffResult.added" size="mini" border>
                        <el-table-column prop="name" label="功能名称" />
                    </el-table>
                </div>
                <div v-if="diffResult.removed && diffResult.removed.length" class="diff-section">
                    <h4 style="color: #F56C6C;">删除功能 ({{ diffResult.removed.length }})</h4>
                    <el-table :data="diffResult.removed" size="mini" border>
                        <el-table-column prop="name" label="功能名称" />
                        <el-table-column prop="matchedSolution" label="是否已匹配方案" width="120">
                            <template slot-scope="{ row }">
                                {{ row.matchedSolution || '未匹配' }}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <span slot="footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button
                type="primary"
                :loading="importing"
                :disabled="!selectedFile"
                @click="handleImport"
            >开始导入</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { importSowItems } from '../../../core/api/sow'

export default {
    name: 'ImportDialog',
    props: {
        visible: { type: Boolean, default: false },
        sowId: { type: String, required: true },
        sowType: { type: String, default: '' },
        hasExisting: { type: Boolean, default: false }
    },
    data() {
        return {
            importing: false,
            selectedFile: null,
            fileList: [],
            diffResult: null
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible },
            set(val) { this.$emit('update:visible', val) }
        },
        isPoc() {
            return this.sowType === 'POC'
        }
    },
    methods: {
        handleBeforeUpload(file) {
            const isXlsx = file.name.endsWith('.xlsx')
            if (!isXlsx) {
                this.$message.error('仅支持 .xlsx 格式文件')
                return false
            }
            this.selectedFile = file
            this.fileList = [{ name: file.name, uid: file.uid }]
            return false
        },
        handleRemove() {
            this.selectedFile = null
            this.fileList = []
            this.diffResult = null
        },
        handleDownloadTemplate() {
            const url = this.isPoc
                ? '/api/sow/template/poc.xlsx'
                : '/api/sow/template/normal.xlsx'
            window.open(url)
        },
        async handleImport() {
            if (!this.selectedFile) return
            this.importing = true
            try {
                const formData = new FormData()
                formData.append('file', this.selectedFile)
                const res = await importSowItems(this.sowId, formData)
                if (res.diff) {
                    this.diffResult = res.diff
                    if (!this.hasExisting) {
                        this.$emit('imported', res.items || [])
                        this.dialogVisible = false
                        this.$message.success('导入成功')
                    }
                } else {
                    this.$emit('imported', res.items || [])
                    this.dialogVisible = false
                    this.$message.success('导入成功')
                }
            } catch {
                this.$message.error('导入失败，请检查文件格式')
            } finally {
                this.importing = false
            }
        }
    }
}
</script>

<style scoped>
.import-dialog__diff {
    margin-top: 16px;
}
.diff-section {
    margin-bottom: 12px;
}
.diff-section h4 {
    margin: 4px 0 8px;
}
</style>