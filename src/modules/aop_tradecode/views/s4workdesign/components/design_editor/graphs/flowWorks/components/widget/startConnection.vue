<template>
    <div v-once class="x6-custom-flowWorks-widget startConnection">
        <div>
            <span>开始</span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'start-connection'
}
</script>
<style lang="scss" scoped>
.startConnection{
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