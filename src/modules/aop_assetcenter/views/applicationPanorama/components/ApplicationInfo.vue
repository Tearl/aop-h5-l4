<template>
    <div class="application-info">
        <div class="information-card">
            <div class="information-card__title"><i class="el-icon-document" />应用信息</div>
            <div class="information-row">
                <span class="information-label">应用名称</span><span class="information-value">{{ info.appName }}</span>
            </div>
            <div class="information-row">
                <span class="information-label">应用编码</span><span class="information-value"><span class="application-code">{{ info.appCode }}</span></span>
            </div>
            <div class="information-row">
                <span class="information-label">应用类型</span><span class="information-value">{{ info.appType }}</span>
            </div>
            <div class="information-row">
                <span class="information-label">所属租户</span><span class="information-value">{{ info.tenant }}</span>
            </div>
            <div class="information-row">
                <span class="information-label">负责人</span><span class="information-value">{{ info.owner }}</span>
            </div>
            <div class="information-row information-row--multiline">
                <span class="information-label">应用描述</span><span class="information-value">{{ info.desc }}</span>
            </div>
        </div>

        <div class="information-card">
            <div class="information-card__title"><i class="el-icon-time" />版本信息</div>
            <div class="information-row">
                <span class="information-label">当前版本</span><span class="information-value version">V{{ info.version }}</span>
            </div>
            <div class="information-row">
                <span class="information-label">版本状态</span>
                <span class="information-value"><el-tag :type="statusType" size="mini">{{ info.status }}</el-tag></span>
            </div>
            <div class="information-row">
                <span class="information-label">发布日期</span><span class="information-value">{{ info.releaseDate }}</span>
            </div>
            <div class="information-row information-row--multiline">
                <span class="information-label">版本描述</span><span class="information-value">{{ info.versionDesc }}</span>
            </div>
            <div class="information-row information-row--multiline">
                <span class="information-label">变更记录</span><span class="information-value">{{ info.changelog }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ApplicationInfo',
    props: {
        info: {
            type: Object,
            required: true
        }
    },
    computed: {
        statusType() {
            return this.info.status === '已发布' ? 'success' : 'warning'
        }
    }
}
</script>

<style scoped>
.application-info {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
}

.information-card {
    padding: 24px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.information-card__title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e8e8e8;
    color: #262626;
    font-size: 16px;
    font-weight: 600;
}

.information-card__title i {
    color: #2b5fd7;
    font-size: 17px;
}

.information-row {
    display: flex;
    min-height: 46px;
    padding: 12px 0;
    box-sizing: border-box;
    border-bottom: 1px solid #f0f0f0;
}

.information-row:last-child {
    border-bottom: 0;
}

.information-label {
    width: 176px;
    flex-shrink: 0;
    color: #8c8c8c;
    font-size: 14px;
}

.information-value {
    flex: 1;
    color: #262626;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.7;
}

.application-code {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 3px;
    background: #f5f5f5;
    color: #2b5fd7;
    font-size: 12px;
}

.information-row .version {
    color: #2b5fd7;
    font-weight: 600;
}

.information-row--multiline {
    min-height: 60px;
}

@media (max-width: 1100px) {
    .application-info {
        grid-template-columns: 1fr;
    }
}
</style>
