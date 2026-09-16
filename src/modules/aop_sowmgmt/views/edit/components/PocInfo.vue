<template>
    <div class="poc-info" v-if="data">
        <el-divider content-position="left">POC信息</el-divider>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-statistic title="POC总分" :value="data.totalScore || 0" />
            </el-col>
            <el-col :span="8">
                <el-statistic title="当前自评得分" :value="data.selfScore || 0" />
            </el-col>
            <el-col :span="8">
                <el-statistic title="竞争对手得分" :value="data.competeScore || 0" />
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'PocInfo',
    props: {
        data: { type: Object, default: null },
        sowId: { type: String, required: true }
    }
}
</script>

<style scoped>
.poc-info {
    margin-top: 16px;
}
</style>