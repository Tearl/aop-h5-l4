<template>
    <div class="no_data">
        <img src="../assets/images/nodata.svg" alt="">
        <span>暂无数据</span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '暂无数据'
        }
    }
}
</script>

<style lang="scss" scoped>
.no_data {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 4px;

    img {
        width: 60px;
        height: 60px;
    }
}
</style>