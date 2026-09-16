<template>
    <div v-once class="x6-custom-flowWorks-widget endConnection">
        <div>
            <span>结束</span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'end-connection'
}
</script>
<style lang="scss" scoped>
.endConnection{
    & > div {
        width:86px;
        height:38px;
        border: 1px solid rgba(178,178,178,1);
        border-radius: 12px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>