<template>
    <el-form :model="localForm" inline size="small">
        <el-form-item label="SOW名称">
            <el-input v-model="localForm.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="SOW ID">
            <el-input v-model="localForm.sowId" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="关联商机">
            <el-input v-model="localForm.relatedBiz" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="状态">
            <el-select v-model="localForm.status" placeholder="请选择" clearable>
                <el-option label="已注册" value="REGISTERED" />
                <el-option label="已完成" value="COMPLETED" />
                <el-option label="已登记" value="REGISTERED_FINAL" />
            </el-select>
        </el-form-item>
        <el-form-item label="创建人">
            <el-input v-model="localForm.creator" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="期望完成时间">
            <el-date-picker
                v-model="localForm.expectEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
                clearable
            />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: 'SearchBar',
    props: {
        value: { type: Object, default: () => ({}) }
    },
    computed: {
        localForm: {
            get() { return this.value },
            set(val) { this.$emit('input', val) }
        }
    },
    methods: {
        handleSearch() {
            this.$emit('search', { ...this.localForm })
        },
        handleReset() {
            this.localForm = {
                name: '',
                sowId: '',
                relatedBiz: '',
                status: '',
                creator: '',
                expectEndTime: ''
            }
            this.$emit('reset')
        }
    }
}
</script>