<template>
    <div class="view-basic-info" v-if="data">
        <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="SOW ID">{{ data.sowId }}</el-descriptions-item>
            <el-descriptions-item label="SOW名称">{{ data.name }}</el-descriptions-item>
            <el-descriptions-item label="SOW类型">{{ typeLabel(data.type) }}</el-descriptions-item>
            <el-descriptions-item label="产品类型">{{ productLabel(data.productType) }}</el-descriptions-item>
            <el-descriptions-item label="关联商机">{{ data.relatedBiz || '-' }}</el-descriptions-item>
            <el-descriptions-item label="商机编号">{{ data.bizNo || '-' }}</el-descriptions-item>
            <el-descriptions-item label="状态">
                <el-tag :type="statusTagType(data.status)" size="small">{{ statusLabel(data.status) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="期望完成时间">{{ data.expectEndTime || '-' }}</el-descriptions-item>
            <el-descriptions-item label="创建人">{{ data.creator || '-' }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ data.createTime || '-' }}</el-descriptions-item>
            <el-descriptions-item label="描述" :span="2">{{ data.description || '-' }}</el-descriptions-item>
        </el-descriptions>

        <div v-if="data.type === 'POC' && data.pocInfo" class="view-poc">
            <el-divider content-position="left">POC信息</el-divider>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-statistic title="POC总分" :value="data.pocInfo.totalScore || 0" />
                </el-col>
                <el-col :span="8">
                    <el-statistic title="当前自评得分" :value="data.pocInfo.selfScore || 0" />
                </el-col>
                <el-col :span="8">
                    <el-statistic title="竞争对手得分" :value="data.pocInfo.competeScore || 0" />
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
const TYPE_MAP = { POC: 'POC', DELIVERY: '交付', FM1: 'FM1', OTHER: '其他' }
const PRODUCT_MAP = { BUSINESS: '业务产品', PLATFORM: '平台产品', TOOL: '工具产品' }
const STATUS_MAP = { REGISTERED: '已注册', COMPLETED: '已完成', REGISTERED_FINAL: '已登记' }

export default {
    name: 'ViewBasicInfo',
    props: {
        data: { type: Object, default: null }
    },
    methods: {
        typeLabel(t) { return TYPE_MAP[t] || t || '-' },
        productLabel(t) { return PRODUCT_MAP[t] || t || '-' },
        statusLabel(s) { return STATUS_MAP[s] || s || '-' },
        statusTagType(s) {
            if (s === 'REGISTERED') return 'warning'
            if (s === 'COMPLETED') return 'success'
            return 'info'
        }
    }
}
</script>

<style scoped>
.view-basic-info {
    max-width: 800px;
}
.view-poc {
    margin-top: 16px;
}
</style>