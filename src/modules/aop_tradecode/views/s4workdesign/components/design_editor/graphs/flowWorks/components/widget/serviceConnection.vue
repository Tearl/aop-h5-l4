<template>
    <div v-once class="x6-custom-flowWorks-widget serviceConnection">
        <div>
            <span>接口</span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'service-connection'
}
</script>
<style lang="scss" scoped>
.serviceConnection{
    & > div {
        width:86px;
        height:38px;
        border: 1px solid rgba(178,178,178,1);
        border-radius: 2px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
